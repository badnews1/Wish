/**
 * Типы для дружеских связей
 */

export const FRIENDSHIP_STATUSES = ['pending', 'accepted', 'rejected', 'blocked'] as const;

export type FriendshipStatus = typeof FRIENDSHIP_STATUSES[number];

export interface Friendship {
  id: string;
  userId: string; // Кто отправил запрос
  friendId: string; // Кому отправили запрос
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Расширенная информация о друге (включает данные профиля)
 */
export interface Friend {
  id: string;
  friendshipId: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  status: FriendshipStatus;
  // Направление дружбы (кто инициатор)
  isOutgoing: boolean; // true = я отправил запрос, false = мне отправили
}
