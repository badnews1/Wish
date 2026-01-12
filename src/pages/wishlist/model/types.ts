import type { Wishlist } from '@/entities/wishlist';

export interface WishlistPageProps {
  wishlists: Wishlist[];
  onWishlistClick?: (wishlistId: string) => void;
}