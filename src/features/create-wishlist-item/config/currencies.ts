/**
 * Валюты для выбора цены товара
 */

export const CURRENCY_OPTIONS = [
  { id: 'USD', label: 'USD - Доллар США' },
  { id: 'EUR', label: 'EUR - Евро' },
  { id: 'GBP', label: 'GBP - Фунт стерлингов' },
  { id: 'RUB', label: 'RUB - Российский рубль' },
] as const;

export const DEFAULT_CURRENCY = 'USD';
