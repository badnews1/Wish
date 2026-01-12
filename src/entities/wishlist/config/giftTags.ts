import type { GiftTag } from '../model';
import type { SelectOption } from '../../../shared/model';

/**
 * Конфигурация меток подарка
 */

export type GiftTagOption = SelectOption & {
  id: GiftTag;
  emoji?: string;
};

// Ключи i18n для меток
export const GIFT_TAG_OPTIONS: readonly GiftTagOption[] = [
  { id: 'none', label: 'wishlist.giftTags.none' },
  { id: 'really-want', label: 'wishlist.giftTags.reallyWant', emoji: '🔥' },
  { id: 'would-be-nice', label: 'wishlist.giftTags.wouldBeNice', emoji: '👍' },
  { id: 'thinking', label: 'wishlist.giftTags.thinking', emoji: '🤔' },
  { id: 'buy-myself', label: 'wishlist.giftTags.buyMyself', emoji: '💰' },
];

/**
 * Стили для меток подарка (для Badge компонента)
 */
export const GIFT_TAG_STYLES: Record<GiftTag, { bg: string; text: string }> = {
  'none': { bg: 'bg-gray-100', text: 'text-gray-600' },
  'really-want': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'would-be-nice': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'thinking': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  'buy-myself': { bg: 'bg-green-100', text: 'text-green-700' },
};

/**
 * Полная конфигурация меток подарка с emoji и цветами
 */
export const GIFT_TAG_CONFIG: Record<GiftTag, { 
  emoji: string; 
  label: string; 
  bgColor: string; 
  textColor: string;
}> = {
  'none': { 
    emoji: '', 
    label: 'Без метки', 
    bgColor: '#F3F4F6', 
    textColor: '#4B5563' 
  },
  'really-want': { 
    emoji: '🔥', 
    label: 'Очень хочу', 
    bgColor: '#F3E8FF', 
    textColor: '#7C3AED' 
  },
  'would-be-nice': { 
    emoji: '👍', 
    label: 'Было бы неплохо', 
    bgColor: '#DBEAFE', 
    textColor: '#1D4ED8' 
  },
  'thinking': { 
    emoji: '🤔', 
    label: 'Подумаю', 
    bgColor: '#FEF3C7', 
    textColor: '#A16207' 
  },
  'buy-myself': { 
    emoji: '💰', 
    label: 'Сам куплю', 
    bgColor: '#D1FAE5', 
    textColor: '#047857' 
  },
};