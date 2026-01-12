import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/app';

interface ItemDescriptionSectionProps {
  description?: string;
  onDescriptionChange: (value: string) => void;
}

export function ItemDescriptionSection({
  description,
  onDescriptionChange
}: ItemDescriptionSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 p-4 rounded-2xl">
      <Textarea
        id="item-description"
        placeholder={t('createWishlistItem.ui.itemDescriptionPlaceholder')}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
        rows={3}
      />
    </div>
  );
}