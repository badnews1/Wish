import { ExternalLink } from 'lucide-react';
import { ToggleSwitch } from '@/shared/ui';
import { useTranslation } from '@/app';
import type { ItemMainInfoProps } from '../model';

/**
 * Основная информация о товаре: заголовок, цена, ссылка, описание, переключатель
 */
export function ItemMainInfo({
  title,
  description,
  price,
  currency,
  link,
  isPurchased,
  onToggleFulfilled
}: ItemMainInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      
      {/* Цена и ссылка */}
      {(price || link) && (
        <div className="flex items-center gap-3 mt-2">
          {price && (
            <span className="text-xl font-semibold text-[var(--color-accent)]">
              {price.toLocaleString('ru-RU')} {currency || '₽'}
            </span>
          )}
          {link && (
            <button
              onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[--color-accent] hover:bg-purple-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>{t('wishlist.card.linkButton')}</span>
            </button>
          )}
        </div>
      )}
      
      {/* Описание */}
      {description && (
        <p className="mt-4 text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      )}

      {/* Переключатель "Желание исполнено" */}
      {onToggleFulfilled && (
        <ToggleSwitch
          checked={isPurchased}
          onChange={onToggleFulfilled}
          label={t('pages.wishlistItemDetail.labels.fulfilled')}
          labelPosition="right"
          className="mt-6"
        />
      )}
    </div>
  );
}