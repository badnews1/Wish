/**
 * Карточка друга или запроса в друзья
 * @module entities/friendship/ui
 */

import type { FriendWithDetails } from '../model/types';

interface FriendCardProps {
  /** Данные друга */
  friend: FriendWithDetails;
  /** Слот для кнопок действий */
  actionsSlot?: React.ReactNode;
  /** Обработчик клика на карточку */
  onClick?: () => void;
}

/**
 * Компонент карточки друга
 * Отображает аватар, имя/никнейм, кнопки действий
 */
export function FriendCard({ friend, actionsSlot, onClick }: FriendCardProps): JSX.Element {
  const displayText = friend.displayName || friend.username || 'Пользователь';
  const secondaryText = friend.displayName && friend.username ? `@${friend.username}` : null;

  return (
    <div 
      className="flex items-center gap-3 p-4 bg-white rounded-2xl"
      onClick={onClick}
    >
      {/* Аватар */}
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {friend.avatarUrl ? (
          <img 
            src={friend.avatarUrl} 
            alt={displayText}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold text-gray-600">
            {displayText.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Информация о пользователе */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {displayText}
        </p>
        {secondaryText && (
          <p className="text-sm text-gray-500 truncate">
            {secondaryText}
          </p>
        )}
      </div>

      {/* Слот для кнопок действий */}
      {actionsSlot && (
        <div className="flex-shrink-0">
          {actionsSlot}
        </div>
      )}
    </div>
  );
}
