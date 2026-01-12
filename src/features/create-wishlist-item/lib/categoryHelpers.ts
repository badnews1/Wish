import { getTranslation } from '@/app/config/i18n';
import type { Language } from '@/app';
import { CATEGORIES } from '@/features/create-wishlist-item/config';

/**
 * Получить название категории по ID
 */
export function getCategoryLabel(categoryId: string, language: Language = 'ru'): string {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? getTranslation(language, category.labelKey) : getTranslation(language, 'common.other');
}

/**
 * Получить названия нескольких категорий через запятую
 */
export function getCategoryLabels(categoryIds?: string[], language: Language = 'ru'): string {
  if (!categoryIds || categoryIds.length === 0) return '';
  return categoryIds
    .map(id => getCategoryLabel(id, language))
    .join(', ');
}

/**
 * Получить иконку категории по ID
 */
export function getCategoryIcon(categoryId: string): string {
  return CATEGORIES.find(cat => cat.id === categoryId)?.icon || '🎁';
}