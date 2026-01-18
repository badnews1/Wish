/**
 * Карточка друга
 */

import type { FriendProfile } from '../model/types';
import { formatFriendsCount } from '../lib/formatters';

interface FriendCardProps {
  /** Профиль друга */
  profile: FriendProfile;
  /** Слот для кнопок действий */
  actionsSlot?: React.ReactNode;
  /** Обработчик клика на карточку */
  onClick?: () => void;
  /** Функция перевода */
  t: (key: string) => string;
}

/**
 * Компонент карточки друга
 * Отображает аватар, имя/никнейм, счетчик друзей, слот для действий
 */
export function FriendCard({ profile, actionsSlot, onClick, t }: FriendCardProps): JSX.Element {
  const displayText = profile.display_name || profile.username || t('common.noResults');
  const secondaryText = profile.display_name && profile.username ? `@${profile.username}` : null;
  const friendsCountText = formatFriendsCount(profile.friends_count, t);

  return (
    <div 
      className="flex items-center gap-3 p-4 bg-white rounded-2xl"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Аватар */}
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {profile.avatar_url ? (
          <img 
            src={profile.avatar_url} 
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
        {secondaryText ? (
          <p className="text-sm text-gray-500 truncate">
            {secondaryText}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            {friendsCountText}
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