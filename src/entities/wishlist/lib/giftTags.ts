import type { GiftTag } from '@/entities/wishlist/model';
import { GIFT_TAG_OPTIONS, GIFT_TAG_STYLES } from '@/entities/wishlist/config';

/**
 * Получить название метки по ID
 * @param tagId - ID метки подарка
 * @param t - функция перевода
 */
export function getGiftTagLabel(
  tagId: GiftTag | undefined, 
  t: (key: string) => string
): string {
  if (!tagId || tagId === 'none') {
    return t('wishlist.giftTags.none');
  }
  
  const tag = GIFT_TAG_OPTIONS.find(t => t.id === tagId);
  if (!tag) {
    return t('wishlist.giftTags.none');
  }
  
  // tag.label теперь содержит i18n ключ
  return t(tag.label);
}

/**
 * Получить стили метки по ID
 */
export function getGiftTagStyles(tagId?: GiftTag): { bg: string; text: string } {
  if (!tagId) return GIFT_TAG_STYLES['none'];
  return GIFT_TAG_STYLES[tagId] || GIFT_TAG_STYLES['none'];
}