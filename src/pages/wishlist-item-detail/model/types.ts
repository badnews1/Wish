import type { WishlistItem, GiftTag, Wishlist } from '@/entities/wishlist';

export interface WishlistItemDetailPageProps {
  item: WishlistItem;
  wishlists?: Array<{ id: string; title: string; iconId: string }>;
  onBack: () => void;
  onEdit?: () => void;
  onWishlistClick?: (wishlistId: string) => void;
  onToggleFulfilled?: (isFulfilled: boolean) => void;
}

export interface ItemImageSectionProps {
  imageUrl?: string;
  title: string;
  giftTag?: GiftTag;
  onBack: () => void;
  onEdit?: () => void;
}

export interface ItemMainInfoProps {
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  link?: string;
  isPurchased: boolean;
  onToggleFulfilled?: (isFulfilled: boolean) => void;
}

export interface ItemCategoriesProps {
  categories: string[];
}

export interface ItemAdditionalInfoProps {
  purchaseLocation?: string;
}

export interface ItemWishlistsProps {
  wishlists: Pick<Wishlist, 'id' | 'title' | 'iconId'>[];
  onWishlistClick?: (wishlistId: string) => void;
}