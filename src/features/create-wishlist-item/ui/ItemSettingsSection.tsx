import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BaseDrawer, SelectList, RoundedButton, SelectButton } from '@/shared/ui';
import { useMultipleDrawers, useTempState } from '@/shared/lib';
import { useTranslation } from '@/app';
import type { GiftTag } from '@/entities/wishlist';
import { GIFT_TAG_OPTIONS, getGiftTagLabel, DEFAULT_GIFT_TAG } from '@/entities/wishlist';
import { CATEGORIES } from '../config';
import { getCategoryLabels } from '../lib';

interface ItemSettingsSectionProps {
  selectedGiftTag?: GiftTag;
  onGiftTagChange: (giftTag: GiftTag) => void;
  selectedCategory?: string[];
  onCategoryChange: (category: string[]) => void;
  purchaseLocation?: string;
  onPurchaseLocationChange: (location: string) => void;
}

export function ItemSettingsSection({
  selectedGiftTag,
  onGiftTagChange,
  selectedCategory,
  onCategoryChange,
  purchaseLocation,
  onPurchaseLocationChange
}: ItemSettingsSectionProps) {
  const { t, language } = useTranslation();
  const drawers = useMultipleDrawers({
    giftTag: false,
    category: false,
    purchaseLocation: false
  });
  const [tempPurchaseLocation, setTempPurchaseLocation] = useTempState(purchaseLocation || '', drawers.purchaseLocation.isOpen);
  const [tempCategories, setTempCategories] = useTempState<string[]>(selectedCategory || [], drawers.category.isOpen);

  // Преобразуем опции меток подарков с переводами
  const giftTagOptions = GIFT_TAG_OPTIONS.map(tag => ({
    id: tag.id,
    label: getGiftTagLabel(tag.id, t),
    icon: tag.icon
  }));

  const categoryOptions = CATEGORIES.map(category => ({
    id: category.id,
    label: t(category.labelKey),
    icon: category.icon
  }));

  const handleCategoryToggle = (categoryId: string) => {
    setTempCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  return (
    <>
      <div className="bg-gray-50 rounded-2xl overflow-hidden">
        {/* Настройка метки подарка */}
        <SelectButton
          label={t('createWishlistItem.ui.giftTagLabel')}
          value={selectedGiftTag ? getGiftTagLabel(selectedGiftTag, t) : t('createWishlistItem.ui.selectGiftTag')}
          onClick={drawers.giftTag.open}
        />

        <Separator />

        {/* Настройка категории */}
        <SelectButton
          label={t('createWishlistItem.ui.categoryLabel')}
          value={selectedCategory ? getCategoryLabels(selectedCategory, t) : t('createWishlistItem.ui.selectCategory')}
          onClick={drawers.category.open}
        />

        <Separator />

        {/* Настройка места покупки */}
        <SelectButton
          label={t('createWishlistItem.ui.purchaseLocationLabel')}
          value={purchaseLocation || t('createWishlistItem.ui.selectPurchaseLocation')}
          onClick={drawers.purchaseLocation.open}
        />
      </div>

      {/* Drawer выбора метки подарка */}
      <BaseDrawer
        open={drawers.giftTag.isOpen}
        onOpenChange={drawers.giftTag.setOpen}
      >
        <SelectList
          mode="single"
          options={giftTagOptions}
          selected={selectedGiftTag || DEFAULT_GIFT_TAG}
          onSelect={(tagId) => {
            onGiftTagChange(tagId as GiftTag);
            drawers.giftTag.close();
          }}
        />
      </BaseDrawer>

      {/* Drawer выбора категории */}
      <BaseDrawer
        open={drawers.category.isOpen}
        onOpenChange={drawers.category.setOpen}
      >
        <SelectList
          mode="multi"
          options={categoryOptions}
          selected={tempCategories}
          onToggle={handleCategoryToggle}
          onDone={() => {
            onCategoryChange(tempCategories);
            drawers.category.close();
          }}
          maxSelections={3}
          title={`${t('common.select')} ${tempCategories.length} ${t('common.of')} 3`}
          doneLabel={t('common.done')}
        />
      </BaseDrawer>

      {/* Drawer выбора места покупки */}
      <BaseDrawer
        open={drawers.purchaseLocation.isOpen}
        onOpenChange={drawers.purchaseLocation.setOpen}
      >
        <div className="flex flex-col h-full">
          {/* Заголовок */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
              {t('createWishlistItem.ui.purchaseLocationDrawerTitle')}
            </h3>
          </div>
          
          {/* Контент */}
          <div className="flex-1 px-6 pb-4">
            <Input
              type="text"
              value={tempPurchaseLocation || ''}
              onChange={(e) => setTempPurchaseLocation(e.target.value)}
              placeholder={t('createWishlistItem.ui.purchaseLocationPlaceholder')}
              className="w-full"
            />
          </div>

          {/* Кнопка готово */}
          <div className="px-6 pb-6">
            <RoundedButton
              label={t('createWishlistItem.ui.doneButton')}
              isActive={true}
              onClick={() => {
                onPurchaseLocationChange(tempPurchaseLocation);
                drawers.purchaseLocation.close();
              }}
              variant="full"
            />
          </div>
        </div>
      </BaseDrawer>
    </>
  );
}