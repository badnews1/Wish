import React from 'react';
import { useTranslation } from '@/app';
import type { ItemAdditionalInfoProps } from '../model';

/**
 * Дополнительная информация о товаре (место покупки и т.д.)
 */
export function ItemAdditionalInfo({ purchaseLocation }: ItemAdditionalInfoProps) {
  const { t } = useTranslation();

  if (!purchaseLocation) {
    return null;
  }

  return (
    <div className="px-6 space-y-4">
      {/* Место покупки */}
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-0.5">{t('pages.wishlistItemDetail.labels.purchaseLocation')}</p>
          <p className="text-base text-gray-900">{purchaseLocation}</p>
        </div>
      </div>
    </div>
  );
}