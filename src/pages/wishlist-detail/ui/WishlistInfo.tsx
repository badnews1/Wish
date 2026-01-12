import { Heart } from 'lucide-react';
import { formatDate } from '../../../shared/lib';
import { formatItemCount } from '../../../entities/wishlist';
import { PRIVACY_OPTIONS } from '../../../features/create-wishlist/config';
import type { PrivacyType } from '../../../features/create-wishlist/config';
import type { WishlistInfoProps } from '../model';

/**
 * Информация о вишлисте: название, описание, дата, приватность, подписчики
 */
export function WishlistInfo({
  title,
  description,
  eventDate,
  itemCount,
  privacy,
  favoriteCount
}: WishlistInfoProps) {
  // Находим настройки приватности
  const privacyOption = PRIVACY_OPTIONS.find(option => option.id === privacy) || PRIVACY_OPTIONS[0];
  const PrivacyIcon = privacyOption.icon;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      
      {/* Дата события и количество желаний */}
      <div className="flex items-center gap-2 mt-1.5">
        {eventDate && (
          <>
            <span className="text-base text-gray-600">{formatDate(eventDate, true)}</span>
            <span className="text-base text-gray-400">•</span>
          </>
        )}
        <span className="text-base text-gray-600">{formatItemCount(itemCount)}</span>
      </div>
      
      {/* Описание */}
      {description && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
      
      {/* Приватность и счетчик подписок */}
      <div className="flex items-center gap-1.5 mt-6">
        <PrivacyIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">{privacyOption.label}</span>
        <div className="w-4" />
        <Heart className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {favoriteCount}
        </span>
      </div>
    </div>
  );
}