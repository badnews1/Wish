-- ============================================
-- МИГРАЦИЯ: Полная система друзей (дополнение к базовой)
-- Дата: 2025-01-15
-- Описание: Добавляет недостающие компоненты к существующей таблице friendships
-- ============================================

-- ⚠️ ВАЖНО: Эта миграция дополняет 20250115_create_friendships_table.sql
-- Применяйте только если базовая миграция уже применена!

-- ============================================
-- 1. ОБНОВЛЕНИЕ ТАБЛИЦЫ FRIENDSHIPS
-- ============================================

-- Добавить поле requested_by (кто отправил запрос)
ALTER TABLE friendships 
  ADD COLUMN IF NOT EXISTS requested_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Заполнить для существующих записей (предполагаем что user_id = отправитель)
UPDATE friendships 
SET requested_by = user_id 
WHERE requested_by IS NULL;

-- Сделать NOT NULL
ALTER TABLE friendships 
  ALTER COLUMN requested_by SET NOT NULL;

-- Добавить constraint для нормализации пары (всегда user_id < friend_id)
ALTER TABLE friendships ADD CONSTRAINT normalized_pair CHECK (user_id < friend_id);

-- Удалить старый enum значение 'rejected' если было создано
-- (в новой системе используем только 'pending' и 'accepted')
-- Записи со статусом 'rejected' должны быть удалены, а не храниться

-- Добавить индекс на requested_by
CREATE INDEX IF NOT EXISTS idx_friendships_requested_by ON friendships(requested_by);

-- Добавить partial индексы для оптимизации пагинации
-- Для друзей (status = accepted)
CREATE INDEX IF NOT EXISTS idx_friendships_accepted_user_pagination 
  ON friendships(user_id, created_at DESC, id DESC) 
  WHERE status = 'accepted';

CREATE INDEX IF NOT EXISTS idx_friendships_accepted_friend_pagination 
  ON friendships(friend_id, created_at DESC, id DESC) 
  WHERE status = 'accepted';

-- Для входящих/исходящих запросов (status = pending)
CREATE INDEX IF NOT EXISTS idx_friendships_pending_user_pagination 
  ON friendships(user_id, created_at DESC, id DESC) 
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_friendships_pending_friend_pagination 
  ON friendships(friend_id, created_at DESC, id DESC) 
  WHERE status = 'pending';

-- ============================================
-- 2. ТАБЛИЦА FRIEND_ACTIONS (Rate Limiting)
-- ============================================

CREATE TABLE IF NOT EXISTS friend_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('send', 'cancel', 'accept', 'reject', 'delete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы для проверки лимитов
CREATE INDEX IF NOT EXISTS idx_friend_actions_user_time ON friend_actions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_friend_actions_user_target ON friend_actions(user_id, target_user_id, created_at DESC);

-- ============================================
-- 3. СЧЕТЧИК ДРУЗЕЙ
-- ============================================

-- Добавить колонку в profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS friends_count INT NOT NULL DEFAULT 0;

-- Создать индекс для быстрой сортировки
CREATE INDEX IF NOT EXISTS idx_profiles_friends_count ON profiles(friends_count DESC);

-- Заполнить для существующих пользователей
UPDATE profiles p
SET friends_count = (
  SELECT COUNT(*)
  FROM friendships f
  WHERE (f.user_id = p.id OR f.friend_id = p.id)
    AND f.status = 'accepted'
);

-- ============================================
-- 4. ФУНКЦИИ
-- ============================================

-- Функция проверки rate limiting
CREATE OR REPLACE FUNCTION check_friend_action_limits(
  p_user_id UUID,
  p_target_user_id UUID,
  p_action TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_rate_limit_count INT;
  v_daily_send_count INT;
  v_global_count INT;
BEGIN
  -- 1. Дневной лимит (только send)
  IF p_action = 'send' THEN
    SELECT COUNT(*) INTO v_daily_send_count
    FROM friend_actions
    WHERE user_id = p_user_id
      AND target_user_id = p_target_user_id
      AND action = 'send'
      AND created_at > CURRENT_DATE;
    
    IF v_daily_send_count >= 3 THEN
      RAISE EXCEPTION 'DAILY_LIMIT: Вы уже отправляли запрос этому пользователю 3 раза сегодня';
    END IF;
  END IF;

  -- 2. Rate limit с одним пользователем
  SELECT COUNT(*) INTO v_rate_limit_count
  FROM friend_actions
  WHERE user_id = p_user_id
    AND target_user_id = p_target_user_id
    AND created_at > now() - INTERVAL '1 hour';
  
  IF v_rate_limit_count >= 5 THEN
    RAISE EXCEPTION 'RATE_LIMIT: Слишком частые действия с этим пользователем';
  END IF;

  -- 3. Глобальный лимит
  SELECT COUNT(*) INTO v_global_count
  FROM friend_actions
  WHERE user_id = p_user_id
    AND created_at > now() - INTERVAL '1 hour';
  
  IF v_global_count >= 20 THEN
    RAISE EXCEPTION 'GLOBAL_LIMIT: Слишком много действий за последний час';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для batch lookup статусов дружбы
CREATE OR REPLACE FUNCTION get_friendship_statuses(
  p_current_user UUID,
  p_target_users UUID[]
) RETURNS TABLE (
  target_user_id UUID,
  status friendship_status,
  requested_by UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE WHEN f.user_id = p_current_user THEN f.friend_id ELSE f.user_id END,
    f.status,
    f.requested_by
  FROM friendships f
  WHERE (f.user_id = p_current_user AND f.friend_id = ANY(p_target_users))
     OR (f.friend_id = p_current_user AND f.user_id = ANY(p_target_users));
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- 5. ТРИГГЕРЫ ДЛЯ RATE LIMITING
-- ============================================

-- INSERT: логировать send
CREATE OR REPLACE FUNCTION log_friend_action_on_insert() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    PERFORM check_friend_action_limits(NEW.requested_by, 
      CASE WHEN NEW.requested_by = NEW.user_id THEN NEW.friend_id ELSE NEW.user_id END, 
      'send');
    
    INSERT INTO friend_actions (user_id, target_user_id, action)
    VALUES (NEW.requested_by, 
      CASE WHEN NEW.requested_by = NEW.user_id THEN NEW.friend_id ELSE NEW.user_id END, 
      'send');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удалить старый триггер если есть
DROP TRIGGER IF EXISTS trigger_log_friend_send ON friendships;

CREATE TRIGGER trigger_log_friend_send
  BEFORE INSERT ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION log_friend_action_on_insert();

-- UPDATE: логировать accept
CREATE OR REPLACE FUNCTION log_friend_action_on_update() RETURNS TRIGGER AS $$
DECLARE
  v_current_user UUID;
BEGIN
  -- Получить текущего пользователя (может быть NULL при CASCADE)
  v_current_user := auth.uid();
  
  -- Если нет пользователя → пропустить логирование (системное действие)
  IF v_current_user IS NULL THEN
    RETURN NEW;
  END IF;
  
  IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN
    INSERT INTO friend_actions (user_id, target_user_id, action)
    VALUES (v_current_user, 
      CASE WHEN NEW.user_id = v_current_user THEN NEW.friend_id ELSE NEW.user_id END, 
      'accept');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удалить старый триггер если есть
DROP TRIGGER IF EXISTS trigger_log_friend_accept ON friendships;

CREATE TRIGGER trigger_log_friend_accept
  AFTER UPDATE ON friendships
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_friend_action_on_update();

-- DELETE: логировать cancel/reject/delete
CREATE OR REPLACE FUNCTION log_friend_action_on_delete() RETURNS TRIGGER AS $$
DECLARE
  v_action TEXT;
  v_target_id UUID;
  v_current_user UUID;
BEGIN
  -- Получить текущего пользователя (может быть NULL при CASCADE)
  v_current_user := auth.uid();
  
  -- Если нет пользователя → это CASCADE удаление, не логируем
  IF v_current_user IS NULL THEN
    RETURN OLD;
  END IF;
  
  -- Определить второго пользователя
  v_target_id := CASE WHEN OLD.user_id = v_current_user THEN OLD.friend_id ELSE OLD.user_id END;
  
  -- Определить тип действия
  IF OLD.status = 'pending' THEN
    IF OLD.requested_by = v_current_user THEN
      v_action := 'cancel';
    ELSE
      v_action := 'reject';
    END IF;
  ELSE
    v_action := 'delete';
  END IF;
  
  -- Проверить лимиты (кроме reject)
  IF v_action IN ('cancel', 'delete') THEN
    PERFORM check_friend_action_limits(v_current_user, v_target_id, v_action);
  END IF;
  
  -- Логировать
  INSERT INTO friend_actions (user_id, target_user_id, action)
  VALUES (v_current_user, v_target_id, v_action);
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Удалить старый триггер если есть
DROP TRIGGER IF EXISTS trigger_log_friend_delete ON friendships;

CREATE TRIGGER trigger_log_friend_delete
  BEFORE DELETE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION log_friend_action_on_delete();

-- ============================================
-- 6. ТРИГГЕРЫ ДЛЯ СЧЕТЧИКА ДРУЗЕЙ
-- ============================================

-- INSERT: увеличить счетчик
CREATE OR REPLACE FUNCTION update_friends_count_on_insert() RETURNS TRIGGER AS $$
BEGIN
  -- Только если статус = accepted
  IF NEW.status = 'accepted' THEN
    UPDATE profiles SET friends_count = friends_count + 1 WHERE id = NEW.user_id;
    UPDATE profiles SET friends_count = friends_count + 1 WHERE id = NEW.friend_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_friends_count_on_insert ON friendships;

CREATE TRIGGER trigger_update_friends_count_on_insert
  AFTER INSERT ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_friends_count_on_insert();

-- UPDATE: обновить при изменении статуса
CREATE OR REPLACE FUNCTION update_friends_count_on_update() RETURNS TRIGGER AS $$
BEGIN
  -- Из pending в accepted → +1
  IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN
    UPDATE profiles SET friends_count = friends_count + 1 WHERE id = NEW.user_id;
    UPDATE profiles SET friends_count = friends_count + 1 WHERE id = NEW.friend_id;
  END IF;
  
  -- Из accepted в pending → -1 (маловероятно, но на всякий случай)
  IF OLD.status = 'accepted' AND NEW.status = 'pending' THEN
    UPDATE profiles SET friends_count = GREATEST(0, friends_count - 1) WHERE id = NEW.user_id;
    UPDATE profiles SET friends_count = GREATEST(0, friends_count - 1) WHERE id = NEW.friend_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_friends_count_on_update ON friendships;

CREATE TRIGGER trigger_update_friends_count_on_update
  AFTER UPDATE ON friendships
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_friends_count_on_update();

-- DELETE: уменьшить счетчик
CREATE OR REPLACE FUNCTION update_friends_count_on_delete() RETURNS TRIGGER AS $$
BEGIN
  -- Только если был accepted
  IF OLD.status = 'accepted' THEN
    UPDATE profiles SET friends_count = GREATEST(0, friends_count - 1) WHERE id = OLD.user_id;
    UPDATE profiles SET friends_count = GREATEST(0, friends_count - 1) WHERE id = OLD.friend_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_friends_count_on_delete ON friendships;

CREATE TRIGGER trigger_update_friends_count_on_delete
  AFTER DELETE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_friends_count_on_delete();

-- ============================================
-- 7. ОБНОВЛЕНИЕ RLS ПОЛИТИК
-- ============================================

-- Удалить старые политики
DROP POLICY IF EXISTS "Users can view their friendships" ON friendships;
DROP POLICY IF EXISTS "Users can send friend requests" ON friendships;
DROP POLICY IF EXISTS "Users can respond to friend requests" ON friendships;
DROP POLICY IF EXISTS "Users can remove friendships" ON friendships;

-- Включить RLS (на всякий случай)
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_actions ENABLE ROW LEVEL SECURITY;

-- Политика для SELECT
CREATE POLICY "Users can view their friendships"
  ON friendships FOR SELECT
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- Политика для INSERT
CREATE POLICY "Users can send friend requests"
  ON friendships FOR INSERT
  WITH CHECK (requested_by = auth.uid());

-- Политика для UPDATE (принятие запроса)
CREATE POLICY "Users can respond to friend requests"
  ON friendships FOR UPDATE
  USING (
    (user_id = auth.uid() OR friend_id = auth.uid())
    AND status = 'pending'
    AND requested_by != auth.uid() -- Только входящие
  );

-- Политика для DELETE
CREATE POLICY "Users can remove friendships"
  ON friendships FOR DELETE
  USING (user_id = auth.uid() OR friend_id = auth.uid());

-- RLS для friend_actions: никто не может напрямую читать/писать
CREATE POLICY "No direct access" ON friend_actions FOR ALL USING (false);

-- ============================================
-- 8. АВТОМАТИЧЕСКАЯ ОЧИСТКА (pg_cron)
-- ============================================

-- Включить расширение pg_cron (может потребовать прав супервизора)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Создать задачу (запускается ежедневно в 3:00 UTC)
-- ⚠️ Требует расширение pg_cron, которое может быть недоступно в hosted версии
-- Применяйте через Supabase Dashboard → Database → Cron Jobs

-- SELECT cron.schedule(
--   'cleanup-friend-actions',
--   '0 3 * * *',
--   $$DELETE FROM friend_actions WHERE created_at < now() - INTERVAL '7 days'$$
-- );

-- ============================================
-- 9. КОММЕНТАРИИ К СХЕМЕ
-- ============================================

COMMENT ON TABLE friendships IS 'Таблица для хранения связей между пользователями (система друзей)';
COMMENT ON COLUMN friendships.user_id IS 'ID первого пользователя (всегда меньший ID в нормализованной паре)';
COMMENT ON COLUMN friendships.friend_id IS 'ID второго пользователя (всегда больший ID в нормализованной паре)';
COMMENT ON COLUMN friendships.status IS 'Статус дружбы: pending (ожидание), accepted (��ринято)';
COMMENT ON COLUMN friendships.requested_by IS 'ID пользователя, который отправил запрос в друзья';

COMMENT ON TABLE friend_actions IS 'Журнал действий для rate limiting (автоматически очищается через 7 дней)';
COMMENT ON COLUMN friend_actions.action IS 'Тип действия: send, cancel, accept, reject, delete';

COMMENT ON COLUMN profiles.friends_count IS 'Кэшированное количество друзей (materialized counter)';

-- ============================================
-- КОНЕЦ МИГРАЦИИ
-- ============================================

-- ⚠️ ВАЖНЫЕ ЗАМЕЧАНИЯ:
-- 1. pg_cron может быть недоступен - настройте через Dashboard
-- 2. Проверьте что ENUM friendship_status не содержит значение 'rejected'
-- 3. После применения миграции запустите тесты в SQL Editor