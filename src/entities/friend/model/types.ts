/**
 * Типы для сущности Friend (система друзей)
 */

import type { Database } from '@/shared/api/database.types';

// Типы из БД
export type FriendshipStatus = Database['public']['Enums']['friendship_status'];
export type FriendshipRow = Database['public']['Tables']['friendships']['Row'];

/**
 * Профиль пользователя (минимальная информация для отображения в списках)
 */
export interface FriendProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  friends_count: number;
}

/**
 * Дружба с JOIN profile другого пользователя
 */
export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  requested_by: string;
  created_at: string;
  updated_at: string;
  // JOIN с profiles
  profile: FriendProfile;
}

/**
 * Статус дружбы между текущим пользователем и другим
 */
export interface FriendshipStatusInfo {
  status: FriendshipStatus | null; // null если нет связи
  requested_by: string | null; // null если нет связи
  is_incoming: boolean; // true если текущий пользователь получил запрос
  is_outgoing: boolean; // true если текущий пользователь отправил запрос
}

/**
 * Ошибка rate limiting
 */
export type RateLimitError = 
  | 'DAILY_LIMIT' 
  | 'RATE_LIMIT' 
  | 'GLOBAL_LIMIT';

/**
 * Параметры пагинации для списков друзей
 */
export interface FriendsPaginationParams {
  limit?: number;
  cursor?: {
    created_at: string;
    id: string;
  };
}

/**
 * Результат пагинации
 */
export interface FriendsPaginationResult<T> {
  data: T[];
  nextCursor: { created_at: string; id: string } | null;
  hasMore: boolean;
}

/**
 * Результат RPC функции get_friends_paginated (flatten результат)
 */
export interface FriendshipRpcRow {
  id: string;
  user_id: string;
  friend_id: string;
  status: FriendshipStatus;
  requested_by: string;
  created_at: string;
  updated_at: string;
  profile_id: string;
  profile_username: string | null;
  profile_display_name: string | null;
  profile_avatar_url: string | null;
  profile_friends_count: number;
}