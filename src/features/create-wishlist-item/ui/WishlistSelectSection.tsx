import React from 'react';
import { useTranslation } from '@/app';
import type { Wishlist } from '@/entities/wishlist';
import { BaseDrawer, SelectList, SelectButton } from '@/shared/ui';
import { useMultipleDrawers, useTempState } from '@/shared/lib';
import { WISHLIST_ICONS } from '@/shared/config';

interface WishlistSelectSectionProps {
  wishlists: Wishlist[];
  selectedWishlistIds: string[];
  onWishlistsChange: (wishlistIds: string[]) => void;
}

export function WishlistSelectSection({
  wishlists,
  selectedWishlistIds,
  onWishlistsChange
}: WishlistSelectSectionProps) {
  const { t } = useTranslation();
  const drawers = useMultipleDrawers({ wishlist: false });
  const [tempSelectedWishlistIds, setTempSelectedWishlistIds] = useTempState<string[]>(selectedWishlistIds, drawers.wishlist.isOpen);

  const wishlistOptions = wishlists.map(wishlist => {
    // Находим эмодзи по iconId
    const iconData = wishlist.iconId ? WISHLIST_ICONS.find(icon => icon.id === wishlist.iconId) : null;
    
    return {
      id: wishlist.id,
      label: wishlist.title,
      icon: iconData?.emoji || '🎁' // Дефолтная иконка, если не найдена
    };
  });

  const handleWishlistToggle = (wishlistId: string) => {
    setTempSelectedWishlistIds(prev => {
      if (prev.includes(wishlistId)) {
        return prev.filter(id => id !== wishlistId);
      } else {
        return [...prev, wishlistId];
      }
    });
  };

  const handleWishlistDone = () => {
    onWishlistsChange(tempSelectedWishlistIds);
    drawers.wishlist.close();
  };

  return (
    <>
      <div className="bg-gray-50 rounded-2xl overflow-hidden">
        <SelectButton
          label={t('createWishlistItem.ui.wishlistLabel')}
          value={
            selectedWishlistIds.length > 0
              ? selectedWishlistIds.map(id => {
                  const wishlist = wishlists.find(w => w.id === id);
                  return wishlist ? wishlist.title : '';
                }).join(', ')
              : t('createWishlistItem.ui.selectWishlist')
          }
          onClick={drawers.wishlist.open}
        />
      </div>

      {/* Drawer выбора вишлиста */}
      <BaseDrawer
        open={drawers.wishlist.isOpen}
        onOpenChange={drawers.wishlist.setOpen}
      >
        <SelectList
          mode="multi"
          options={wishlistOptions}
          selected={tempSelectedWishlistIds}
          onToggle={handleWishlistToggle}
          onDone={handleWishlistDone}
          doneLabel={t('common.done')}
        />
      </BaseDrawer>
    </>
  );
}