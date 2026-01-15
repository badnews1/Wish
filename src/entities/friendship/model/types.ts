/**
 * Типы для сущности friendship
 * @module entities/friendship/model
 */

import type { Database } from '@/shared/api/database.types';

/**
 * Тип статуса дружбы из базы данных
 */
export type FriendshipStatus = Database['public']['Enums']['friendship_status'];

/**
 * Базовый тип записи дружбы из БД
 */
export type Friendship = Database['public']['Tables']['friendships']['Row'];

/**
 * Тип для вставки новой записи дружбы
 */
export type FriendshipInsert = Database['public']['Tables']['friendships']['Insert'];

/**
 * Тип для обновления записи дружбы
 */
export type FriendshipUpdate = Database['public']['Tables']['friendships']['Update'];

/**
 * Расширенная информация о друге (включает данные профиля)
 */
export interface FriendWithDetails {
  /** ID записи дружбы */
  friendshipId: string;
  /** ID друга */
  userId: string;
  /** Никнейм друга */
  username: string | null;
  /** Отображаемое имя */
  displayName: string | null;
  /** Аватар */
  avatarUrl: string | null;
  /** Статус дружбы */
  status: FriendshipStatus;
  /** Дата создания запроса */
  createdAt: string;
}

/**
 * Тип направления запроса в друзья
 */
export type FriendshipDirection = 'outgoing' | 'incoming';

/**
 * Тип запроса в друзья с информацией о пользователе
 * Используется для отображения входящих и исходящих запросов
 */
export interface FriendRequest {
  /** ID запроса (friendship) */
  id: string;
  /** Информация о пользователе */
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
  };
  /** Дата создания запроса */
  createdAt: string;
}