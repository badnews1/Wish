import { Heart, Gift, Star, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface QuickActionItemProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick: () => void;
}

/**
 * Элемент быстрого действия
 */
function QuickActionItem({ icon: Icon, title, subtitle, onClick }: QuickActionItemProps): JSX.Element {
  return (
    <Card 
      className="flex items-center gap-3 p-4 cursor-pointer active:scale-95 transition-transform"
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[var(--color-accent)]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 text-sm">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-600 truncate">
            {subtitle}
          </div>
        )}
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </Card>
  );
}

interface ProfileQuickActionsProps {
  onPublicWishlistsClick: () => void;
  onFavoritesClick: () => void;
  onGiftHistoryClick: () => void;
  t: (key: string) => string;
}

/**
 * Быстрые действия в профиле
 * 
 * Отображает:
 * - Мои публичные вишлисты
 * - Избранные вишлисты
 * - История подарков
 */
export function ProfileQuickActions({ 
  onPublicWishlistsClick,
  onFavoritesClick,
  onGiftHistoryClick,
  t 
}: ProfileQuickActionsProps) {
  return (
    <div className="px-4 pb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        {t('widgets.profileQuickActions.title')}
      </h2>

      <div className="space-y-3">
        <QuickActionItem
          icon={Heart}
          title={t('widgets.profileQuickActions.publicWishlists')}
          subtitle={t('widgets.profileQuickActions.publicWishlistsSubtitle')}
          onClick={onPublicWishlistsClick}
        />
        
        <QuickActionItem
          icon={Star}
          title={t('widgets.profileQuickActions.favorites')}
          subtitle={t('widgets.profileQuickActions.favoritesSubtitle')}
          onClick={onFavoritesClick}
        />
        
        <QuickActionItem
          icon={Gift}
          title={t('widgets.profileQuickActions.giftHistory')}
          subtitle={t('widgets.profileQuickActions.giftHistorySubtitle')}
          onClick={onGiftHistoryClick}
        />
      </div>
    </div>
  );
}