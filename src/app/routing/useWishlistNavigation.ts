import { useCallback } from 'react';
import type { Wishlist, WishlistInput } from '@/entities/wishlist';
import type { NavigationAction } from './types';

/**
 * Композиционный хук для навигации по вишлистам
 */
export function useWishlistNavigation(
  dispatch: React.Dispatch<NavigationAction>,
  wishlists: Wishlist[],
  selectedWishlistId: string | null,
  onCreateWishlist: (data: WishlistInput) => void,
  onUpdateWishlist: (id: string, data: WishlistInput) => void
) {
  // Навигация на страницу вишлистов
  const navigateToWishlist = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_WISHLIST' });
  }, [dispatch]);

  // Навигация на страницу деталей вишлиста
  const navigateToWishlistDetail = useCallback((wishlistId: string) => {
    dispatch({ type: 'NAVIGATE_TO_WISHLIST_DETAIL', payload: wishlistId });
  }, [dispatch]);

  // Навигация на форму создания вишлиста
  const navigateToCreateWishlist = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_CREATE_WISHLIST' });
  }, [dispatch]);

  // Навигация на форму редактирования вишлиста
  const navigateToEditWishlist = useCallback((wishlistId: string) => {
    dispatch({ type: 'NAVIGATE_TO_EDIT_WISHLIST', payload: wishlistId });
  }, [dispatch]);

  // Обработка создания вишлиста
  const handleCreateWishlist = useCallback((data: WishlistInput) => {
    onCreateWishlist(data);
    navigateToWishlist();
  }, [onCreateWishlist, navigateToWishlist]);

  // Обработка редактирования вишлиста
  const handleEditWishlist = useCallback((data: WishlistInput) => {
    if (selectedWishlistId) {
      onUpdateWishlist(selectedWishlistId, data);
      navigateToWishlistDetail(selectedWishlistId);
    }
  }, [selectedWishlistId, onUpdateWishlist, navigateToWishlistDetail]);

  // Получение данных выбранного вишлиста
  const getSelectedWishlist = useCallback((): Wishlist | undefined => {
    return wishlists.find((w) => w.id === selectedWishlistId);
  }, [wishlists, selectedWishlistId]);

  return {
    navigateToWishlist,
    navigateToWishlistDetail,
    navigateToCreateWishlist,
    navigateToEditWishlist,
    handleCreateWishlist,
    handleEditWishlist,
    getSelectedWishlist,
  } as const;
}