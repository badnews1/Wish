import type { Wishlist, WishlistItem, PrivacyType } from '../../../entities/wishlist';

/**
 * ID таба страницы деталей вишлиста
 */
export type WishlistTabId = 'active' | 'fulfilled';

export interface WishlistDetailPageProps {
  wishlist: Wishlist;
  onBack: () => void;
  onEdit?: () => void;
  onAddItem?: () => void;
  onItemClick?: (itemId: string) => void;
}

export interface WishlistCoverProps {
  imageUrl?: string;
  backgroundColor?: string;
  title: string;
  onBack: () => void;
  onEdit?: () => void;
}

export interface WishlistInfoProps {
  title: string;
  description?: string;
  eventDate?: Date;
  itemCount: number;
  privacy: PrivacyType;
  favoriteCount: number;
}

export interface WishlistItemsListProps {
  items: WishlistItem[];
  onItemClick?: (itemId: string) => void;
}