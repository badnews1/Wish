-- ============================================
-- МИГРАЦИЯ: Смягчение rate limits для разработки
-- Дата: 2025-01-15
-- Описание: Увеличивает лимиты для удобства тестирования
-- ============================================

-- ⚠️ ВНИМАНИЕ: Эта миграция ТОЛЬКО для разработки!
-- ⚠️ ПЕРЕД ПРОДАКШЕНОМ: Удалите эту миграцию или создайте новую с жесткими лимитами
-- ⚠️ Оригинальные лимиты: daily=3, rate=5, global=20

-- ============================================
-- Обновленная функция проверки rate limiting с более мягкими лимитами
-- ============================================
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
  -- 1. Дневной лимит (только send) - увеличен с 3 до 10 для тестирования
  IF p_action = 'send' THEN
    SELECT COUNT(*) INTO v_daily_send_count
    FROM friend_actions
    WHERE user_id = p_user_id
      AND target_user_id = p_target_user_id
      AND action = 'send'
      AND created_at > CURRENT_DATE;
    
    IF v_daily_send_count >= 10 THEN
      RAISE EXCEPTION 'DAILY_LIMIT: Вы уже отправляли запрос этому пользователю 10 раз сегодня';
    END IF;
  END IF;

  -- 2. Rate limit с одним пользователем - увеличен с 5 до 20 для тестирования
  SELECT COUNT(*) INTO v_rate_limit_count
  FROM friend_actions
  WHERE user_id = p_user_id
    AND target_user_id = p_target_user_id
    AND created_at > now() - INTERVAL '1 hour';
  
  IF v_rate_limit_count >= 20 THEN
    RAISE EXCEPTION 'RATE_LIMIT: Слишком частые действия с этим пользователем';
  END IF;

  -- 3. Глобальный лимит - увеличен с 20 до 100 для тестирования
  SELECT COUNT(*) INTO v_global_count
  FROM friend_actions
  WHERE user_id = p_user_id
    AND created_at > now() - INTERVAL '1 hour';
  
  IF v_global_count >= 100 THEN
    RAISE EXCEPTION 'GLOBAL_LIMIT: Слишком много действий за последний час';
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Очистка старых записей в friend_actions для тестирования
-- ============================================
-- Удалить все записи старше 1 часа
DELETE FROM friend_actions WHERE created_at < now() - INTERVAL '1 hour';

-- ============================================
-- КОММЕНТАРИИ
-- ============================================
COMMENT ON FUNCTION check_friend_action_limits IS 'Проверка rate limiting для действий с друзьями (смягченные лимиты для разработки)';