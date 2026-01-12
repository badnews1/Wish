import { useState } from 'react';
import { UnderlinedTabs } from '@/shared/ui/UnderlinedTabs';
import { WishlistItemCard } from '@/entities/wishlist';
import { useTranslation } from '@/app';
import { WISHLIST_TABS, type WishlistTabId } from '../config';
import type { WishlistItemsListProps } from '../model';

/**
 * Список желаний с табами для фильтрации
 */
export function WishlistItemsList({ 
  items,
  onItemClick 
}: WishlistItemsListProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<WishlistTabId>('active');

  // Фильтруем карточки по статусу
  const filteredItems = items.filter(item => 
    activeTab === 'active' ? !item.isPurchased : item.isPurchased
  );

  return (
    <>
      {/* Заголовок секции */}
      <div className="px-6 mt-3">
        <h2 className="text-xl font-semibold text-gray-900">{t('pages.wishlistDetail.title')}</h2>
      </div>

      {/* Табы */}
      <div className="mt-2">
        <UnderlinedTabs<WishlistTabId>
          tabs={WISHLIST_TABS.map(tab => ({ ...tab, label: t(tab.labelKey) }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Список желаний */}
      <div className="px-6 mt-8 flex flex-col gap-4">
        {filteredItems.map((item) => (
          <WishlistItemCard 
            key={item.id}
            item={item}
            onClick={() => onItemClick?.(item.id)}
            t={t}
          />
        ))}
      </div>
    </>
  );
}