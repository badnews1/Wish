import type { Wishlist, WishlistItem } from '../../../entities/wishlist';
import type { CreateWishlistItemForm } from '../../../features/create-wishlist-item';

export interface WishlistItemFormPageProps {
  wishlists: Wishlist[];
  initialWishlistId?: string;
  initialData?: WishlistItem;
  onBack: () => void;
  onSubmit: (data: CreateWishlistItemForm) => void;
  onDelete?: () => void;
  mode?: 'create' | 'edit';
}