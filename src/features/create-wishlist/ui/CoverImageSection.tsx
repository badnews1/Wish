import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ImageOverlay } from '../../../shared/ui';
import { useTranslation } from '@/app';

interface CoverImageSectionProps {
  coverImage?: string;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function CoverImageSection({
  coverImage,
  onUploadImage,
  onRemoveImage
}: CoverImageSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-3">
      <ImageOverlay
        imageUrl={coverImage}
        alt="Обложка вишлиста"
        height="16rem"
        uploadInputId="cover-image"
        onUpload={onUploadImage}
        emptyStateText={t('imageUpload.uploadImage')}
        overlayButton={
          coverImage ? (
            <Button
              type="button"
              onClick={onRemoveImage}
              variant="icon-white"
              size="icon"
              shape="circle"
              aria-label={t('createWishlist.ui.removeCoverAria')}
            >
              <X />
            </Button>
          ) : undefined
        }
        overlayPosition="top-right"
      />
    </div>
  );
}