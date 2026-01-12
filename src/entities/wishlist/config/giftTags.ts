import type { SelectOption } from '@/shared/model';
import type { GiftTag } from '../model';
import { GIFT_TAGS } from '../model';

/**
 * Конфигурация меток подарка
 */

/**
 * Дефолтное значение метки подарка для новых желаний
 */
export const DEFAULT_GIFT_TAG: GiftTag = 'none';

export type GiftTagOption = SelectOption & {
  id: GiftTag;
};

/**
 * Полная конфигурация меток подарка - единственный source of truth
 */
export const GIFT_TAG_CONFIG: Record<GiftTag, { 
  emoji: string; 
  labelKey: string; // i18n ключ
  bgColor: string; 
  textColor: string;
  // Tailwind классы для Badge компонента
  bgClass: string;
  textClass: string;
}> = {
  'none': { 
    emoji: '', 
    labelKey: 'wishlist.giftTags.none', 
    bgColor: '#F3F4F6', 
    textColor: '#4B5563',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600'
  },
  'really-want': { 
    emoji: '🔥', 
    labelKey: 'wishlist.giftTags.reallyWant', 
    bgColor: '#F3E8FF', 
    textColor: '#7C3AED',
    bgClass: 'bg-purple-100',
    textClass: 'text-purple-700'
  },
  'would-be-nice': { 
    emoji: '👍', 
    labelKey: 'wishlist.giftTags.wouldBeNice', 
    bgColor: '#DBEAFE', 
    textColor: '#1D4ED8',
    bgClass: 'bg-blue-100',
    textClass: 'text-blue-700'
  },
  'thinking': { 
    emoji: '🤔', 
    labelKey: 'wishlist.giftTags.thinking', 
    bgColor: '#FEF3C7', 
    textColor: '#A16207',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-700'
  },
  'buy-myself': { 
    emoji: '💰', 
    labelKey: 'wishlist.giftTags.buyMyself', 
    bgColor: '#D1FAE5', 
    textColor: '#047857',
    bgClass: 'bg-green-100',
    textClass: 'text-green-700'
  },
};

/**
 * Опции для SelectList - генерируются из GIFT_TAG_CONFIG (DRY)
 * Порядок элементов из GIFT_TAGS константы (SSOT)
 */
export const GIFT_TAG_OPTIONS: readonly GiftTagOption[] = GIFT_TAGS.map((id) => {
  const config = GIFT_TAG_CONFIG[id];
  return {
    id,
    label: config.labelKey,
    icon: config.emoji || undefined, // Не передаём пустую строку как icon
  };
});

/**
 * Стили для меток подарка (для Badge компонента) - генерируются из GIFT_TAG_CONFIG (DRY)
 */
export const GIFT_TAG_STYLES = Object.fromEntries(
  Object.entries(GIFT_TAG_CONFIG).map(([id, config]) => [
    id, 
    { bg: config.bgClass, text: config.textClass }
  ])
) as Record<GiftTag, { bg: string; text: string }>;