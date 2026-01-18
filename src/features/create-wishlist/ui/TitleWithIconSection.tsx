import React from 'react';
import { useTranslation } from '@/app';
import { WISHLIST_ICONS } from '@/shared/config';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TitleWithIconSectionProps {
  title: string;
  selectedIconId: string;
  onTitleChange: (value: string) => void;
  onIconClick: () => void;
}

export function TitleWithIconSection({
  title,
  selectedIconId,
  onTitleChange,
  onIconClick
}: TitleWithIconSectionProps) {
  const { t } = useTranslation();
  const currentIcon = WISHLIST_ICONS.find(icon => icon.id === selectedIconId);
  const CurrentIconComponent = currentIcon?.icon;

  return (
    <div 
      className="p-4 rounded-2xl"
      style={{ backgroundColor: 'var(--color-accent)' }}
    >
      {/* Иконка + Название */}
      <div className="flex items-center gap-3">
        {/* Кнопка выбора иконки */}
        <Button
          type="button"
          onClick={onIconClick}
          variant="icon-white-semi"
          size="icon-2xl"
          shape="square"
          className="flex-shrink-0 rounded-2xl"
          aria-label={t('createWishlist.ui.selectIconAria')}
        >
          {CurrentIconComponent && (
            <CurrentIconComponent size={32} strokeWidth={2} className="text-white" />
          )}
        </Button>

        {/* Поле ввода названия */}
        <Input
          id="wishlist-title"
          type="text"
          placeholder={t('createWishlist.ui.titlePlaceholder')}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          size="large"
          variant="transparent"
          className="flex-1 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          autoFocus
        />
      </div>
    </div>
  );
}