import { Globe, Users, UserPlus, Lock } from 'lucide-react';
import type { PrivacyType } from '../model';
import { PRIVACY_TYPES } from '../model';

/**
 * Дефолтное значение приватности для новых вишлистов
 */
export const DEFAULT_PRIVACY: PrivacyType = 'public';

export interface PrivacyOption {
  id: PrivacyType;
  labelKey: string;
  descriptionKey: string;
  icon: typeof Globe;
}

/**
 * Опции приватности вишлиста
 * labelKey и descriptionKey используются для i18n (createWishlist.privacy.{id}.label/description)
 * Порядок элементов соответствует PRIVACY_TYPES (SSOT)
 */
export const PRIVACY_OPTIONS: PrivacyOption[] = PRIVACY_TYPES.map((id) => {
  // Маппинг иконок и i18n ключей для каждого типа приватности
  const config: Record<PrivacyType, { icon: typeof Globe; labelKey: string; descriptionKey: string }> = {
    public: {
      icon: Globe,
      labelKey: 'createWishlist.privacy.public.label',
      descriptionKey: 'createWishlist.privacy.public.description',
    },
    friends: {
      icon: Users,
      labelKey: 'createWishlist.privacy.friends.label',
      descriptionKey: 'createWishlist.privacy.friends.description',
    },
    selected: {
      icon: UserPlus,
      labelKey: 'createWishlist.privacy.selected.label',
      descriptionKey: 'createWishlist.privacy.selected.description',
    },
    private: {
      icon: Lock,
      labelKey: 'createWishlist.privacy.private.label',
      descriptionKey: 'createWishlist.privacy.private.description',
    },
  };

  return {
    id,
    ...config[id],
  };
});