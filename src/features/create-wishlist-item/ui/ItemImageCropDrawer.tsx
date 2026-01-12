import React from 'react';
import { ImageCropDrawer as SharedImageCropDrawer } from '../../../shared/ui';
import { useTranslation } from '../../../shared/lib';
import type { BaseDrawerProps } from '../../../shared/model';

interface ItemImageCropDrawerProps extends BaseDrawerProps {
  imageSrc: string;
  onConfirm: (croppedImage: string) => void;
}

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
      aspect={1}
      objectFit="contain"
      containerClassName="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-6"
      zoomOutLabel={t('createWishlistItem.ui.imageCropZoomOut')}
      zoomInLabel={t('createWishlistItem.ui.imageCropZoomIn')}
      errorMessage={t('createWishlistItem.errors.imageCropFailed')}
    />
  );
}
