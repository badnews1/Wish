/**
 * Валюты для выбора цены товара
 * labelKey используется как i18n ключ (createWishlistItem.currencies.{id})
 */

export interface Currency {
  id: string;
  labelKey: string;
}

export const CURRENCY_OPTIONS: Currency[] = [
  { id: 'USD', labelKey: 'createWishlistItem.currencies.USD' },
  { id: 'EUR', labelKey: 'createWishlistItem.currencies.EUR' },
  { id: 'GBP', labelKey: 'createWishlistItem.currencies.GBP' },
  { id: 'RUB', labelKey: 'createWishlistItem.currencies.RUB' },
];

export const DEFAULT_CURRENCY = 'USD';