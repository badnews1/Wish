import { useCallback } from 'react';
import type { Wishlist, WishlistItem } from '@/entities/wishlist';
import type { NavigationAction } from './types';

/**
 * Композиционный хук для навигации по желаниям
 */
export function useItemNavigation(
  dispatch: React.Dispatch<NavigationAction>,
  wishlists: Wishlist[],
  selectedWishlistId: string | null,
  selectedItemId: string | null
) {
  // Навигация на форму создания желания
  const navigateToCreateItem = useCallback((wishlistId: string) => {
    dispatch({ type: 'NAVIGATE_TO_CREATE_ITEM', payload: wishlistId });
  }, [dispatch]);

  // Навигация на форму редактирования желания
  const navigateToEditItem = useCallback((wishlistId: string, itemId: string) => {
    dispatch({ type: 'NAVIGATE_TO_EDIT_ITEM', payload: { wishlistId, itemId } });
  }, [dispatch]);

  // Навигация на страницу детали желания
  const navigateToItemDetail = useCallback((wishlistId: string, itemId: string) => {
    dispatch({ type: 'NAVIGATE_TO_ITEM_DETAIL', payload: { wishlistId, itemId } });
  }, [dispatch]);

  // Получение данных выбранного желания
  const getSelectedItem = useCallback((): WishlistItem | undefined => {
    const wishlist = wishlists.find((w) => w.id === selectedWishlistId);
    return wishlist?.items?.find((item) => item.id === selectedItemId);
  }, [wishlists, selectedWishlistId, selectedItemId]);

  return {
    navigateToCreateItem,
    navigateToEditItem,
    navigateToItemDetail,
    getSelectedItem,
  } as const;
}