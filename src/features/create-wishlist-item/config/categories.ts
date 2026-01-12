/**
 * Конфигурация категорий товаров
 * label используется как i18n ключ (createWishlistItem.categories.{id})
 */

export interface Category {
  id: string;
  labelKey: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'electronics', labelKey: 'createWishlistItem.categories.electronics', icon: '📱' },
  { id: 'clothing', labelKey: 'createWishlistItem.categories.clothing', icon: '👕' },
  { id: 'shoes', labelKey: 'createWishlistItem.categories.shoes', icon: '👟' },
  { id: 'accessories', labelKey: 'createWishlistItem.categories.accessories', icon: '👜' },
  { id: 'beauty', labelKey: 'createWishlistItem.categories.beauty', icon: '💄' },
  { id: 'books', labelKey: 'createWishlistItem.categories.books', icon: '📚' },
  { id: 'sport', labelKey: 'createWishlistItem.categories.sport', icon: '⚽' },
  { id: 'home', labelKey: 'createWishlistItem.categories.home', icon: '🏠' },
  { id: 'games', labelKey: 'createWishlistItem.categories.games', icon: '🎮' },
  { id: 'toys', labelKey: 'createWishlistItem.categories.toys', icon: '🧸' },
  { id: 'jewelry', labelKey: 'createWishlistItem.categories.jewelry', icon: '💍' },
  { id: 'food', labelKey: 'createWishlistItem.categories.food', icon: '🍰' },
  { id: 'travel', labelKey: 'createWishlistItem.categories.travel', icon: '✈️' },
  { id: 'other', labelKey: 'createWishlistItem.categories.other', icon: '🎁' },
];
