export { WishlistCard } from './ui/WishlistCard';
export { WishlistItemCard } from './ui/WishlistItemCard';
export type { Wishlist, WishlistInput, WishlistItem, GiftTag, PrivacyType, BookingVisibilityType } from './model';
export { PRIVACY_TYPES, BOOKING_VISIBILITY_TYPES, GIFT_TAGS } from './model';
export { useWishlists } from './model';
export { 
  useWishlistsQuery, 
  useUserStatsQuery,
  useCreateWishlistMutation, 
  useUpdateWishlistMutation, 
  useDeleteWishlistMutation 
} from './api';
export type { UserStats } from './api';
export { formatItemCount, getGiftTagLabel, getGiftTagStyles } from './lib';
export { GIFT_TAG_OPTIONS, GIFT_TAG_CONFIG, PRIVACY_OPTIONS, BOOKING_VISIBILITY_OPTIONS, DEFAULT_PRIVACY, DEFAULT_BOOKING_VISIBILITY, DEFAULT_GIFT_TAG } from './config';
export type { GiftTagOption, PrivacyOption, BookingVisibilityOption } from './config';