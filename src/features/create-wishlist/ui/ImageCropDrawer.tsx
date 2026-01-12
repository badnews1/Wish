import React from 'react';
import { ImageCropDrawer as SharedImageCropDrawer } from '@/shared/ui';
import { useTranslation } from '@/app';
import type { BaseDrawerProps } from '@/shared/model';

interface ImageCropDrawerProps extends BaseDrawerProps {
  imageSrc: string;
  onConfirm: (croppedImage: string) => void;
}

/**
 * Обёртка над shared ImageCropDrawer с переводами для create-wishlist
 */
export function ImageCropDrawer({ open, onOpenChange, imageSrc, onConfirm }: ImageCropDrawerProps) {
  const { t } = useTranslation();
  
  return (
    <SharedImageCropDrawer
      open={open}
      onOpenChange={onOpenChange}
      imageSrc={imageSrc}
      onConfirm={onConfirm}
      title={t('createWishlist.ui.imageCropTitle')}
      confirmLabel={t('createWishlist.ui.imageCropConfirm')}
      zoomInLabel={t('imageCrop.zoomIn')}
      zoomOutLabel={t('imageCrop.zoomOut')}
      cropErrorLabel={t('imageCrop.error')}
      aspect={undefined}
      objectFit="horizontal-cover"
      containerClassName="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-6"
    />
  );
}