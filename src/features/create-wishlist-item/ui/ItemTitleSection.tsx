import React from 'react';
import { X } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { ImageOverlay } from '../../../shared/ui';
import { useTranslation } from '@/app';

interface ItemTitleSectionProps {
  title: string;
  description?: string;
  imageUrl?: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

export function ItemTitleSection({
  title,
  description,
  imageUrl,
  onTitleChange,
  onDescriptionChange,
  onUploadImage,
  onRemoveImage
}: ItemTitleSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div 
      className="flex overflow-hidden rounded-2xl bg-white"
      style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
    >
      {/* Зона для фото товара - прилипает к краям, подстраивается под высоту контента */}
      <ImageOverlay
        imageUrl={imageUrl}
        alt="Фото товара"
        width="8rem"
        uploadInputId="item-image"
        onUpload={onUploadImage}
        emptyStateText="Главное фото"
        emptyStateSubtext="(макс. 20 МБ)"
        rounded="sm"
        className="flex-shrink-0 self-stretch"
        overlayButton={
          imageUrl ? (
            <Button
              type="button"
              onClick={onRemoveImage}
              variant="icon-white"
              size="icon-sm"
              shape="circle"
              aria-label={t('createWishlistItem.ui.deletePhotoAria')}
              className="w-7 h-7"
            >
              <X className="w-4 h-4" />
            </Button>
          ) : undefined
        }
        overlayPosition="top-right"
      />

      {/* Поля названия и описания */}
      <div className="flex-1 flex flex-col px-4 py-3 gap-2">
        {/* Поле ввода названия */}
        <Input
          id="item-title"
          type="text"
          placeholder={t('createWishlistItem.ui.titlePlaceholder')}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          size="large"
          variant="transparent"
          className="text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
          autoFocus
        />
        
        {/* Поле описания */}
        <Textarea
          id="item-description"
          placeholder={t('createWishlistItem.ui.descriptionPlaceholder')}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="bg-transparent border-none text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0 min-h-[60px] rounded-2xl"
          rows={2}
        />
      </div>
    </div>
  );
}