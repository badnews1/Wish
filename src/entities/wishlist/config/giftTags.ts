import type { SelectOption } from '@/shared/model';
import type { GiftTag } from '../model';

/**
 * Конфигурация меток подарка
 */

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
 * Порядок элементов важен для UI
 */
const GIFT_TAG_ORDER: GiftTag[] = ['none', 'really-want', 'would-be-nice', 'thinking', 'buy-myself'];

export const GIFT_TAG_OPTIONS: readonly GiftTagOption[] = GIFT_TAG_ORDER.map((id) => {
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
export const GIFT_TAG_STYLES: Record<GiftTag, { bg: string; text: string }> = (
  Object.entries(GIFT_TAG_CONFIG) as [GiftTag, typeof GIFT_TAG_CONFIG[GiftTag]][]
).reduce((acc, [id, config]) => {
  acc[id] = { bg: config.bgClass, text: config.textClass };
  return acc;
}, {} as Record<GiftTag, { bg: string; text: string }>);