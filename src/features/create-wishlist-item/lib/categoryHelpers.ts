import { CATEGORIES } from '../config';

/**
 * Получить название категории по ID
 * @param categoryId - ID категории
 * @param t - функция перевода
 */
export function getCategoryLabel(categoryId: string, t: (key: string) => string): string {
  const category = CATEGORIES.find(cat => cat.id === categoryId);
  return category ? t(category.labelKey) : t('common.other');
}

/**
 * Получить названия нескольких категорий через запятую
 * @param categoryIds - Массив ID категорий
 * @param t - функция перевода
 */
export function getCategoryLabels(categoryIds: string[] | undefined, t: (key: string) => string): string {
  if (!categoryIds || categoryIds.length === 0) return '';
  return categoryIds
    .map(id => getCategoryLabel(id, t))
    .join(', ');
}

/**
 * Получить иконку категории по ID
 */
export function getCategoryIcon(categoryId: string): string {
  return CATEGORIES.find(cat => cat.id === categoryId)?.icon || '🎁';
}