import type { WishlistTabId } from '../model';

/**
 * Конфигурация табов для списка желаний
 */
export const WISHLIST_TABS: Array<{ id: WishlistTabId; labelKey: string }> = [
  { id: 'active', labelKey: 'pages.wishlistDetail.tabs.active' },
  { id: 'fulfilled', labelKey: 'pages.wishlistDetail.tabs.fulfilled' },
] as const;