import { useCurrentUser } from '@/entities/user';
import { useWishlistsQuery, useCreateWishlistMutation, useUpdateWishlistMutation, useDeleteWishlistMutation } from '../api';
import type { Wishlist, WishlistInput, WishlistItem, WishlistItemInput } from './types';
import { generateId } from '@/shared/lib';

interface UseWishlistsReturn {
  wishlists: Wishlist[];
  addWishlist: (formData: WishlistInput) => void;
  removeWishlist: (id: string) => void;
  updateWishlist: (id: string, updates: Partial<Wishlist>) => void;
  addWishlistItem: (wishlistIds: string[], item: WishlistItemInput) => WishlistItem;
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

  const addWishlist = (formData: WishlistInput): void => {
    if (!currentUser?.id) {
      console.error('Cannot create wishlist: user not authenticated');
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

  // TODO: Реализовать работу с желаниями через Supabase
  // Пока оставляем заглушки для обратной совместимости
  const addWishlistItem = (wishlistIds: string[], item: WishlistItemInput): WishlistItem => {
    console.warn('addWishlistItem: Not implemented for Supabase yet');
    return {
      id: generateId(),
      ...item,
      wishlistIds,
    };
  };

  const updateWishlistItem = (wishlistId: string, itemId: string, updates: Partial<WishlistItem>): void => {
    console.warn('updateWishlistItem: Not implemented for Supabase yet', { wishlistId, itemId, updates });
  };

  const removeWishlistItem = (wishlistId: string, itemId: string): void => {
    console.warn('removeWishlistItem: Not implemented for Supabase yet', { wishlistId, itemId });
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