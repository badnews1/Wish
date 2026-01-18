import { 
  useWishlistsQuery, 
  useCreateWishlistMutation, 
  useUpdateWishlistMutation, 
  useDeleteWishlistMutation,
  useCreateWishlistItemMutation,
  useUpdateWishlistItemMutation,
  useDeleteWishlistItemMutation
} from '../api';
import { useCurrentUser } from '../@x/user';
import type { Wishlist, WishlistInput, WishlistItem, WishlistItemInput } from './types';

interface UseWishlistsReturn {
  wishlists: Wishlist[];
  addWishlist: (formData: WishlistInput) => void;
  removeWishlist: (id: string) => void;
  updateWishlist: (id: string, updates: Partial<Wishlist>) => void;
  addWishlistItem: (wishlistIds: string[], item: WishlistItemInput) => void;
  updateWishlistItem: (wishlistId: string, itemId: string, updates: Partial<WishlistItem>) => void;
  removeWishlistItem: (wishlistId: string, itemId: string) => void;
  isLoading: boolean;
}

export function useWishlists(): UseWishlistsReturn {
  const { data: currentUser } = useCurrentUser();
  const { data: wishlists = [], isLoading } = useWishlistsQuery(currentUser?.id);
  const createMutation = useCreateWishlistMutation();
  const updateMutation = useUpdateWishlistMutation();
  const deleteMutation = useDeleteWishlistMutation();
  const createItemMutation = useCreateWishlistItemMutation();
  const updateItemMutation = useUpdateWishlistItemMutation();
  const deleteItemMutation = useDeleteWishlistItemMutation();

  const addWishlist = (formData: WishlistInput): void => {
    if (!currentUser?.id) {
      return;
    }

    createMutation.mutate({
      ...formData,
      userId: currentUser.id,
    });
  };

  const removeWishlist = (id: string): void => {
    deleteMutation.mutate(id);
  };

  const updateWishlist = (id: string, updates: Partial<Wishlist>): void => {
    updateMutation.mutate({ id, updates });
  };

  const addWishlistItem = (wishlistIds: string[], item: WishlistItemInput): void => {
    // Создаём желание в каждом выбранном вишлисте
    wishlistIds.forEach(wishlistId => {
      createItemMutation.mutate({ wishlistId, item });
    });
  };

  const updateWishlistItem = (wishlistId: string, itemId: string, updates: Partial<WishlistItem>): void => {
    updateItemMutation.mutate({ itemId, updates });
  };

  const removeWishlistItem = (wishlistId: string, itemId: string): void => {
    deleteItemMutation.mutate(itemId);
  };

  return {
    wishlists,
    addWishlist,
    removeWishlist,
    updateWishlist,
    addWishlistItem,
    updateWishlistItem,
    removeWishlistItem,
    isLoading,
  };
}