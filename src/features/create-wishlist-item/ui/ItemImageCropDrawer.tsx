import React from 'react';
import { ImageCropDrawer as SharedImageCropDrawer } from '../../../shared/ui';
import { useTranslation } from '@/app';
import type { BaseDrawerProps } from '../../../shared/model';

interface ItemImageCropDrawerProps extends BaseDrawerProps {
  imageSrc: string;
  onConfirm: (croppedImage: string) => void;
}

/**
 * Обёртка над shared ImageCropDrawer с переводами для create-wishlist-item
 */
export function ItemImageCropDrawer({ open, onOpenChange, imageSrc, onConfirm }: ItemImageCropDrawerProps) {
  const { t } = useTranslation();
  
  return (
    <SharedImageCropDrawer
      open={open}
      onOpenChange={onOpenChange}
      imageSrc={imageSrc}
      onConfirm={onConfirm}
      title={t('createWishlistItem.ui.imageCropTitle')}
      confirmLabel={t('createWishlistItem.ui.imageCropConfirm')}
      zoomInLabel={t('imageCrop.zoomIn')}
      zoomOutLabel={t('imageCrop.zoomOut')}
      cropErrorLabel={t('imageCrop.error')}
      aspect={1}
      objectFit="contain"
      containerClassName="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-6"
    />
  );
}