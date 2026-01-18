import { ListChecks, Sparkles } from 'lucide-react';
import type { FloatingCardConfig } from '../model';

export const FLOATING_CARDS: FloatingCardConfig[] = [
  {
    id: 'wishlist',
    icon: ListChecks,
    title: 'widgets.bottomMenu.floatingCards.newWishlist', // i18n ключ
    backgroundColor: 'var(--floating-card-wishlist)',
    rotation: -8,
  },
  {
    id: 'wish',
    icon: Sparkles,
    title: 'widgets.bottomMenu.floatingCards.newWish', // i18n ключ
    backgroundColor: 'var(--floating-card-wish)',
    rotation: 8,
  },
];
