import { Globe, Users, UserPlus, Lock } from 'lucide-react';
import type { PrivacyType } from '../../../entities/wishlist';

export interface PrivacyOption {
  id: PrivacyType;
  labelKey: string;
  descriptionKey: string;
  icon: typeof Globe;
}

/**
 * Опции приватности вишлиста
 * labelKey и descriptionKey используются для i18n (createWishlist.privacy.{id}.label/description)
 */
export const PRIVACY_OPTIONS: PrivacyOption[] = [
  {
    id: 'public',
    labelKey: 'createWishlist.privacy.public.label',
    descriptionKey: 'createWishlist.privacy.public.description',
    icon: Globe,
  },
  {
    id: 'friends',
    labelKey: 'createWishlist.privacy.friends.label',
    descriptionKey: 'createWishlist.privacy.friends.description',
    icon: Users,
  },
  {
    id: 'selected',
    labelKey: 'createWishlist.privacy.selected.label',
    descriptionKey: 'createWishlist.privacy.selected.description',
    icon: UserPlus,
  },
  {
    id: 'private',
    labelKey: 'createWishlist.privacy.private.label',
    descriptionKey: 'createWishlist.privacy.private.description',
    icon: Lock,
  },
];