/**
 * Карточка отправленного запроса в друзья
 * @module entities/friendship/ui
 */

import React from 'react';
import type { FriendRequest } from '../model/types';
import { UserPlus } from 'lucide-react';

interface SentRequestCardProps {
  /** Данные запроса */
  request: FriendRequest;
  /** Слот для кнопки отмены */
  actionSlot?: React.ReactNode;
}

/**
 * Карточка отправленного запроса в друзья
 * Отображает пользователя, которому отправлен запрос
 */
export function SentRequestCard({ request, actionSlot }: SentRequestCardProps): JSX.Element {
  const { user, createdAt } = request;
  
  // Форматируем дату
  const requestDate = new Date(createdAt);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - requestDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let timeAgo = '';
  if (diffInDays === 0) {
    timeAgo = 'Сегодня';
  } else if (diffInDays === 1) {
    timeAgo = 'Вчера';
  } else if (diffInDays < 7) {
    timeAgo = `${diffInDays} дн. назад`;
  } else {
    timeAgo = requestDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl">
      {/* Аватар */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.displayName || user.username}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          (user.displayName?.[0] || user.username[0]).toUpperCase()
        )}
      </div>

      {/* Информация */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {user.displayName || user.username}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <UserPlus className="w-3.5 h-3.5" />
          <span>Отправлено {timeAgo}</span>
        </div>
      </div>

      {/* Слот для кнопки */}
      {actionSlot && (
        <div className="flex-shrink-0">
          {actionSlot}
        </div>
      )}
    </div>
  );
}
