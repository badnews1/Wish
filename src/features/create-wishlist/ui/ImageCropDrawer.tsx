import React from 'react';
import { ImageCropDrawer as SharedImageCropDrawer } from '../../../shared/ui';
import { useTranslation } from '../../../shared/lib';
import type { BaseDrawerProps } from '../../../shared/model';

interface ImageCropDrawerProps extends BaseDrawerProps {
  imageSrc: string;
  onConfirm: (croppedImage: string) => void;
}

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
      aspect={undefined}
      objectFit="horizontal-cover"
      containerClassName="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-6"
      zoomOutLabel={t('createWishlist.ui.imageCropZoomOut')}
      zoomInLabel={t('createWishlist.ui.imageCropZoomIn')}
      errorMessage={t('createWishlist.errors.imageCropFailed')}
    />
  );
}
