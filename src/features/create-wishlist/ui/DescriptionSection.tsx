import React from 'react';
import { Textarea } from '../../../components/ui/textarea';
import { useTranslation } from '../../../shared/lib';

interface DescriptionSectionProps {
  description?: string;
  onDescriptionChange: (value: string) => void;
}

export function DescriptionSection({
  description,
  onDescriptionChange
}: DescriptionSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 p-4 rounded-2xl">
      <Textarea
        id="wishlist-description"
        placeholder={t('createWishlist.ui.descriptionPlaceholder')}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="bg-transparent border-none text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
        rows={3}
      />
    </div>
  );
}