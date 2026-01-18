interface StatItemProps {
  label: string;
  value: number;
  onClick?: () => void;
}

/**
 * Элемент статистики
 */
function StatItem({ label, value, onClick }: StatItemProps): JSX.Element {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`
        flex flex-col items-center gap-0.5
        ${onClick ? 'active:opacity-60 transition-opacity cursor-pointer' : ''}
      `}
    >
      <span className="text-2xl font-bold text-gray-900 tabular-nums">
        {value}
      </span>
      <span className="text-sm text-gray-500">
        {label}
      </span>
    </Component>
  );
}

interface ProfileStatsProps {
  wishlistCount: number;
  itemCount: number;
  friendCount: number;
  onWishlistsClick?: () => void;
  t: (key: string) => string;
}

/**
 * Статистика профиля пользователя
 * 
 * Instagram-стиль:
 * - Три колонки с цифрами
 * - Компактно, без карточек
 * - Крупные цифры, мелкие подписи
 */
export function ProfileStats({ 
  wishlistCount, 
  itemCount, 
  friendCount, 
  onWishlistsClick,
  t 
}: ProfileStatsProps) {
  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-3 gap-4">
        <StatItem
          value={wishlistCount}
          label={t('widgets.profileStats.wishlists')}
          onClick={onWishlistsClick}
        />
        <StatItem
          value={itemCount}
          label={t('widgets.profileStats.items')}
        />
        <StatItem
          value={friendCount}
          label={t('widgets.profileStats.friends')}
        />
      </div>
    </div>
  );
}