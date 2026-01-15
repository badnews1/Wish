/**
 * Карточка входящего запроса в друзья
 * @module entities/user/ui
 */

import React from 'react';
import type { FriendWithDetails } from '@/entities/friendship';

interface FriendRequestCardProps {
  /** Данные запроса */
  request: FriendWithDetails;
  /** Слот для кнопки принятия */
  acceptSlot?: React.ReactNode;
  /** Слот для кнопки отклонения */
  rejectSlot?: React.ReactNode;
}

/**
 * Карточка входящего запроса в друзья
 * Отображает пользователя, который отправил запрос
 */
export function FriendRequestCard({ 
  request, 
  acceptSlot, 
  rejectSlot 
}: FriendRequestCardProps): JSX.Element {
  const { username, displayName, avatarUrl } = request;

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl">
      {/* Аватар */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName || username || 'User'}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          (displayName?.[0] || username?.[0] || 'U').toUpperCase()
        )}
      </div>

      {/* Информация */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {displayName || username || 'Пользователь'}
        </h3>
        {username && displayName && (
          <p className="text-sm text-gray-500 truncate">@{username}</p>
        )}
      </div>

      {/* Слоты для кнопок */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {rejectSlot}
        {acceptSlot}
      </div>
    </div>
  );
}
