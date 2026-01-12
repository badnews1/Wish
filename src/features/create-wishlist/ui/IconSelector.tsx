import React from 'react';
import { BaseDrawer } from '../../../shared/ui';
import { WISHLIST_ICONS } from '../config';
import { useTranslation } from '../../../shared/lib';

interface IconSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: string;
  onSelect: (iconId: string) => void;
}

export function IconSelector({ open, onOpenChange, selected, onSelect }: IconSelectorProps) {
  const { t } = useTranslation();
  
  const handleIconClick = (iconId: string) => {
    onSelect(iconId);
    onOpenChange(false);
  };

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="p-4 pb-8">
        <div className="grid grid-cols-7 gap-3">
          {WISHLIST_ICONS.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === selected;

            return (
              <button
                key={item.id}
                onClick={() => handleIconClick(item.id)}
                className={`
                  aspect-square rounded-2xl flex items-center justify-center
                  transition-colors active:scale-95
                  ${isSelected 
                    ? 'bg-[var(--color-accent)] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                aria-label={t(item.labelKey)}
              >
                <Icon size={24} strokeWidth={2} />
              </button>
            );
          })}
        </div>
      </div>
    </BaseDrawer>
  );
}