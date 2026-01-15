-- ============================================
-- МИГРАЦИЯ: Система друзей
-- Дата: 2025-01-15
-- Автор: AI Assistant
-- ============================================

-- ============================================
-- 1. ТАБЛИЦЫ
-- ============================================

-- Таблица friendships (основная)
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Нормализация: всегда меньший ID первым
  CONSTRAINT normalized_pair CHECK (user_id < friend_id),
  
  -- Уникальность пары
  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),
  
  -- Нельзя добавить себя
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id)
);

-- Базовые индексы
CREATE INDEX idx_friendships_requested_by ON friendships(requested_by);

-- Partial индексы для cursor-based пагинации с фильтрацией
-- Для друзей (status = accepted)
CREATE INDEX idx_friendships_accepted_user_pagination 
  ON friendships(user_id, created_at DESC, id DESC) 
  WHERE status = 'accepted';

CREATE INDEX idx_friendships_accepted_friend_pagination 
  ON friendships(friend_id, created_at DESC, id DESC) 
  WHERE status = 'accepted';

-- Для входящих/исходящих запросов (status = pending)
CREATE INDEX idx_friendships_pending_user_pagination 
  ON friendships(user_id, created_at DESC, id DESC) 
  WHERE status = 'pending';

CREATE INDEX idx_friendships_pending_friend_pagination 
  ON friendships(friend_id, created_at DESC, id DESC) 
  WHERE status = 'pending';

-- Таблица friend_actions (rate limiting)
CREATE TABLE friend_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('send', 'cancel', 'accept', 'reject', 'delete')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индексы для проверки лимитов
CREATE INDEX idx_friend_actions_user_time ON friend_actions(user_id, created_at DESC);
CREATE INDEX idx_friend_actions_user_target ON friend_actions(user_id, target_user_id, created_at DESC);

-- ============================================
-- 2. СЧЕТЧИК ДРУЗЕЙ (materialized counter)
-- ============================================

-- Добавить колонку в users
ALTER TABLE users ADD COLUMN friends_count INT NOT NULL DEFAULT 0;

-- Создать индекс для быстрой сортировки
CREATE INDEX idx_users_friends_count ON users(friends_count DESC);

-- Заполнить для существующих пользователей
UPDATE users u
SET friends_count = (
  SELECT COUNT(*)
  FROM friendships f
  WHERE (f.user_id = u.id OR f.friend_id = u.id)
    AND f.status = 'accepted'
);

-- ============================================
-- 3. ФУНКЦИИ
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
-- 4. ТРИГГЕРЫ ДЛЯ RATE LIMITING
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

CREATE TRIGGER trigger_log_friend_delete
  BEFORE DELETE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION log_friend_action_on_delete();

-- ============================================
-- 5. ТРИГГЕРЫ ДЛЯ СЧЕТЧИКА ДРУЗЕЙ
-- ============================================

-- INSERT: увеличить счетчик
CREATE OR REPLACE FUNCTION update_friends_count_on_insert() RETURNS TRIGGER AS $$
BEGIN
  -- Только если статус = accepted
  IF NEW.status = 'accepted' THEN
    UPDATE users SET friends_count = friends_count + 1 WHERE id = NEW.user_id;
    UPDATE users SET friends_count = friends_count + 1 WHERE id = NEW.friend_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_friends_count_on_insert
  AFTER INSERT ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_friends_count_on_insert();

-- UPDATE: обновить при изменении статуса
CREATE OR REPLACE FUNCTION update_friends_count_on_update() RETURNS TRIGGER AS $$
BEGIN
  -- Из pending в accepted → +1
  IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN
    UPDATE users SET friends_count = friends_count + 1 WHERE id = NEW.user_id;
    UPDATE users SET friends_count = friends_count + 1 WHERE id = NEW.friend_id;
  END IF;
  
  -- Из accepted в pending → -1 (маловероятно, но на всякий случай)
  IF OLD.status = 'accepted' AND NEW.status = 'pending' THEN
    UPDATE users SET friends_count = GREATEST(0, friends_count - 1) WHERE id = NEW.user_id;
    UPDATE users SET friends_count = GREATEST(0, friends_count - 1) WHERE id = NEW.friend_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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
    UPDATE users SET friends_count = GREATEST(0, friends_count - 1) WHERE id = OLD.user_id;
    UPDATE users SET friends_count = GREATEST(0, friends_count - 1) WHERE id = OLD.friend_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_friends_count_on_delete
  AFTER DELETE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_friends_count_on_delete();

-- ============================================
-- 6. RLS ПОЛИТИКИ
-- ============================================

-- Включить RLS
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
-- 7. АВТОМАТИЧЕСКАЯ ОЧИСТКА (pg_cron)
-- ============================================

-- Включить расширение pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Создать задачу (запускается ежедневно в 3:00 UTC)
SELECT cron.schedule(
  'cleanup-friend-actions',
  '0 3 * * *',
  $$DELETE FROM friend_actions WHERE created_at < now() - INTERVAL '7 days'$$
);

-- ============================================
-- 8. МИГРАЦИЯ СУЩЕСТВУЮЩИХ ДАННЫХ (если есть)
-- ============================================

-- Если таблица friendships уже существует:

-- 1. Добавить поле requested_by
-- ALTER TABLE friendships 
--   ADD COLUMN requested_by UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Заполнить для существующих записей (предполагаем что user_id = отправитель)
-- UPDATE friendships SET requested_by = user_id WHERE requested_by IS NULL;

-- 3. Сделать NOT NULL
-- ALTER TABLE friendships ALTER COLUMN requested_by SET NOT NULL;

-- 4. Нормализовать данные (ОСТОРОЖНО: проверить перед запуском!)
-- CREATE TEMP TABLE friendships_normalized AS
-- SELECT 
--   id,
--   LEAST(user_id, friend_id) as user_id,
--   GREATEST(user_id, friend_id) as friend_id,
--   status,
--   requested_by,
--   created_at,
--   updated_at
-- FROM friendships;

-- TRUNCATE friendships CASCADE;
-- INSERT INTO friendships SELECT * FROM friendships_normalized;

-- 5. Удалить дубликаты если есть
-- DELETE FROM friendships a
-- USING friendships b
-- WHERE a.id > b.id
--   AND a.user_id = b.user_id
--   AND a.friend_id = b.friend_id;

-- 6. Добавить constraint нормализации
-- ALTER TABLE friendships ADD CONSTRAINT normalized_pair CHECK (user_id < friend_id);

-- ============================================
-- КОНЕЦ МИГРАЦИИ
-- ============================================
