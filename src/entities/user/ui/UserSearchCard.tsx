/**
 * Карточка найденного пользователя для результатов поиска
 * @module entities/user/ui
 */

import type { UserProfile } from '../model/types';

interface UserSearchCardProps {
  /** Данные пользователя */
  user: UserProfile;
  /** Слот для кнопки действия (например, "Добавить в друзья") */
  actionSlot?: React.ReactNode;
  /** Обработчик клика на карточку */
  onClick?: () => void;
}

/**
 * Компонент карточки пользователя в результатах поиска
 */
export function UserSearchCard({ user, actionSlot, onClick }: UserSearchCardProps): JSX.Element {
  const displayText = user.displayName || user.username || 'Пользователь';
  const secondaryText = user.displayName && user.username ? `@${user.username}` : null;

  return (
    <div 
      className="flex items-center gap-3 p-4 bg-white rounded-2xl"
      onClick={onClick}
    >
      {/* Аватар */}
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
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

      {/* Слот для кнопки действия */}
      {actionSlot && (
        <div className="flex-shrink-0">
          {actionSlot}
        </div>
      )}
    </div>
  );
}
