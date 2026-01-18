-- ============================================
-- МИГРАЦИЯ: RPC функции для действий с запросами друзей
-- Дата: 2025-01-15
-- Описание: Добавляет функции accept_friend_request и reject_friend_request с SECURITY DEFINER
-- ============================================

-- ============================================
-- 1. ФУНКЦИЯ: accept_friend_request
-- Принять входящий запрос в друзья
-- ============================================
CREATE OR REPLACE FUNCTION accept_friend_request(
  p_target_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_current_user UUID;
  v_user_id UUID;
  v_friend_id UUID;
BEGIN
  -- Получить текущего пользователя
  v_current_user := auth.uid();
  
  IF v_current_user IS NULL THEN
    RAISE EXCEPTION 'Необходима авторизация';
  END IF;

  -- Нормализовать пару
  IF v_current_user < p_target_user_id THEN
    v_user_id := v_current_user;
    v_friend_id := p_target_user_id;
  ELSE
    v_user_id := p_target_user_id;
    v_friend_id := v_current_user;
  END IF;

  -- Обновить статус (только если это входящий запрос)
  UPDATE friendships
  SET status = 'accepted', updated_at = now()
  WHERE user_id = v_user_id
    AND friend_id = v_friend_id
    AND status = 'pending'
    AND requested_by = p_target_user_id; -- Только входящие (не от меня)

  -- Проверить что обновление произошло
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Запрос в друзья не найден или уже обработан';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. ФУНКЦИЯ: reject_friend_request
-- Отклонить входящий запрос в друзья
-- ============================================
CREATE OR REPLACE FUNCTION reject_friend_request(
  p_target_user_id UUID
) RETURNS VOID AS $$
DECLARE
  v_current_user UUID;
  v_user_id UUID;
  v_friend_id UUID;
BEGIN
  -- Получить текущего пользователя
  v_current_user := auth.uid();
  
  IF v_current_user IS NULL THEN
    RAISE EXCEPTION 'Необходима авторизация';
  END IF;

  -- Нормализовать пару
  IF v_current_user < p_target_user_id THEN
    v_user_id := v_current_user;
    v_friend_id := p_target_user_id;
  ELSE
    v_user_id := p_target_user_id;
    v_friend_id := v_current_user;
  END IF;

  -- Удалить запрос (только если это входящий запрос)
  DELETE FROM friendships
  WHERE user_id = v_user_id
    AND friend_id = v_friend_id
    AND status = 'pending'
    AND requested_by = p_target_user_id; -- Только входящие (не от меня)

  -- Проверить что удаление произошло
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Запрос в друзья не найден или уже обработан';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- КОММЕНТАРИИ
-- ============================================
COMMENT ON FUNCTION accept_friend_request IS 'Принять входящий запрос в друзья';
COMMENT ON FUNCTION reject_friend_request IS 'Отклонить входящий запрос в друзья';
