-- ============================================
-- МИГРАЦИЯ: RPC функции для пагинированного получения друзей
-- Дата: 2025-01-15
-- Описание: Добавляет функции для оптимизированного получения списков друзей
-- ============================================

-- ============================================
-- 1. ФУНКЦИЯ: get_friends_paginated
-- Получить список друзей с пагинацией
-- ============================================
CREATE OR REPLACE FUNCTION get_friends_paginated(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_cursor_created_at TIMESTAMPTZ DEFAULT NULL,
  p_cursor_id UUID DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  friend_id UUID,
  status friendship_status,
  requested_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  profile_id UUID,
  profile_username TEXT,
  profile_display_name TEXT,
  profile_avatar_url TEXT,
  profile_friends_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.user_id,
    f.friend_id,
    f.status,
    f.requested_by,
    f.created_at,
    f.updated_at,
    p.id AS profile_id,
    p.username AS profile_username,
    p.display_name AS profile_display_name,
    p.avatar_url AS profile_avatar_url,
    p.friends_count AS profile_friends_count
  FROM friendships f
  INNER JOIN profiles p ON (
    CASE 
      WHEN f.user_id = p_user_id THEN p.id = f.friend_id
      ELSE p.id = f.user_id
    END
  )
  WHERE (f.user_id = p_user_id OR f.friend_id = p_user_id)
    AND f.status = 'accepted'
    AND (
      p_cursor_created_at IS NULL 
      OR f.created_at < p_cursor_created_at
      OR (f.created_at = p_cursor_created_at AND f.id < p_cursor_id)
    )
  ORDER BY f.created_at DESC, f.id DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- 2. ФУНКЦИЯ: get_incoming_friend_requests_paginated
-- Получить входящие запросы в друзья с пагинацией
-- ============================================
CREATE OR REPLACE FUNCTION get_incoming_friend_requests_paginated(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_cursor_created_at TIMESTAMPTZ DEFAULT NULL,
  p_cursor_id UUID DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  friend_id UUID,
  status friendship_status,
  requested_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  profile_id UUID,
  profile_username TEXT,
  profile_display_name TEXT,
  profile_avatar_url TEXT,
  profile_friends_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.user_id,
    f.friend_id,
    f.status,
    f.requested_by,
    f.created_at,
    f.updated_at,
    p.id AS profile_id,
    p.username AS profile_username,
    p.display_name AS profile_display_name,
    p.avatar_url AS profile_avatar_url,
    p.friends_count AS profile_friends_count
  FROM friendships f
  INNER JOIN profiles p ON (
    CASE 
      WHEN f.user_id = p_user_id THEN p.id = f.friend_id
      ELSE p.id = f.user_id
    END
  )
  WHERE (f.user_id = p_user_id OR f.friend_id = p_user_id)
    AND f.status = 'pending'
    AND f.requested_by != p_user_id  -- Только входящие (не от меня)
    AND (
      p_cursor_created_at IS NULL 
      OR f.created_at < p_cursor_created_at
      OR (f.created_at = p_cursor_created_at AND f.id < p_cursor_id)
    )
  ORDER BY f.created_at DESC, f.id DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- 3. ФУНКЦИЯ: get_outgoing_friend_requests_paginated
-- Получить исходящие запросы в друзья с пагинацией
-- ============================================
CREATE OR REPLACE FUNCTION get_outgoing_friend_requests_paginated(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_cursor_created_at TIMESTAMPTZ DEFAULT NULL,
  p_cursor_id UUID DEFAULT NULL
) RETURNS TABLE (
  id UUID,
  user_id UUID,
  friend_id UUID,
  status friendship_status,
  requested_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  profile_id UUID,
  profile_username TEXT,
  profile_display_name TEXT,
  profile_avatar_url TEXT,
  profile_friends_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.user_id,
    f.friend_id,
    f.status,
    f.requested_by,
    f.created_at,
    f.updated_at,
    p.id AS profile_id,
    p.username AS profile_username,
    p.display_name AS profile_display_name,
    p.avatar_url AS profile_avatar_url,
    p.friends_count AS profile_friends_count
  FROM friendships f
  INNER JOIN profiles p ON (
    CASE 
      WHEN f.user_id = p_user_id THEN p.id = f.friend_id
      ELSE p.id = f.user_id
    END
  )
  WHERE (f.user_id = p_user_id OR f.friend_id = p_user_id)
    AND f.status = 'pending'
    AND f.requested_by = p_user_id  -- Только исходящие (от меня)
    AND (
      p_cursor_created_at IS NULL 
      OR f.created_at < p_cursor_created_at
      OR (f.created_at = p_cursor_created_at AND f.id < p_cursor_id)
    )
  ORDER BY f.created_at DESC, f.id DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- КОММЕНТАРИИ
-- ============================================
COMMENT ON FUNCTION get_friends_paginated IS 'Получить список друзей пользователя с пагинацией';
COMMENT ON FUNCTION get_incoming_friend_requests_paginated IS 'Получить входящие запросы в друзья с пагинацией';
COMMENT ON FUNCTION get_outgoing_friend_requests_paginated IS 'Получить исходящие запросы в друзья с пагинацией';
