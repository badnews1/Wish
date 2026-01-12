import type { GiftTag } from '../model';
import { GIFT_TAG_OPTIONS, GIFT_TAG_STYLES } from '../config';
import type { Language } from '../../../app';
import { getTranslation } from '@/app/config/i18n';

/**
 * Получить название метки по ID
 */
export function getGiftTagLabel(tagId: GiftTag | undefined, language: Language = 'ru'): string {
  if (!tagId || tagId === 'none') {
    return getTranslation(language, 'wishlist.giftTags.none');
  }
  
  const tag = GIFT_TAG_OPTIONS.find(t => t.id === tagId);
  if (!tag) {
    return getTranslation(language, 'wishlist.giftTags.none');
  }
  
  // tag.label теперь содержит i18n ключ
  return getTranslation(language, tag.label);
}

/**
 * Получить стили метки по ID
 */
export function getGiftTagStyles(tagId?: GiftTag): { bg: string; text: string } {
  if (!tagId) return GIFT_TAG_STYLES['none'];
  return GIFT_TAG_STYLES[tagId] || GIFT_TAG_STYLES['none'];
}