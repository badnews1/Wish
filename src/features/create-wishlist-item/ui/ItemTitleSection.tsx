import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/app';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageOverlay } from '@/shared/ui';
import { MAX_WISH_TITLE_LENGTH, MAX_WISH_DESCRIPTION_LENGTH } from '@/shared/lib';

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
  
  // Обработчик изменения названия с ограничением длины (обрезает если больше)
  const handleTitleChange = (value: string) => {
    const truncatedValue = value.slice(0, MAX_WISH_TITLE_LENGTH);
    onTitleChange(truncatedValue);
  };
  
  // Обработчик изменения описания с ограничением длины (обрезает если больше)
  const handleDescriptionChange = (value: string) => {
    const truncatedValue = value.slice(0, MAX_WISH_DESCRIPTION_LENGTH);
    onDescriptionChange(truncatedValue);
  };
  
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
        emptyStateText={t('imageUpload.uploadImage')}
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
        {/* Поле ввода названия с счетчиком */}
        <div className="relative">
          <Input
            id="item-title"
            type="text"
            placeholder={t('createWishlistItem.ui.titlePlaceholder')}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            size="large"
            variant="transparent"
            className="text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl pr-10"
            autoFocus
          />
          {/* Счетчик оставшихся символов */}
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 tabular-nums">
            {MAX_WISH_TITLE_LENGTH - title.length}
          </span>
        </div>
        
        {/* Поле описания с счетчиком */}
        <div className="relative">
          <Textarea
            id="item-description"
            placeholder={t('createWishlistItem.ui.descriptionPlaceholder')}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="bg-transparent border-none text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-0 min-h-[60px] rounded-2xl pr-12"
            rows={2}
          />
          {/* Счетчик оставшихся символов для описания */}
          {description && description.length > 0 && (
            <span className="absolute right-0 bottom-0 text-xs text-gray-400 tabular-nums">
              {MAX_WISH_DESCRIPTION_LENGTH - description.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}