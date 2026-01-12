import { useReducer, useCallback } from 'react';
import type { Wishlist, WishlistInput } from '@/entities/wishlist';
import { navigationReducer, initialNavigationState } from './navigationReducer';
import { useHomeNavigation } from './useHomeNavigation';
import { useWishlistNavigation } from './useWishlistNavigation';
import { useItemNavigation } from './useItemNavigation';

/**
 * Хук для управления навигацией приложения
 * Использует composition подход для разделения логики на домены
 */
export function useAppNavigation(
  wishlists: Wishlist[],
  onCreateWishlist: (data: WishlistInput) => void,
  onUpdateWishlist: (id: string, data: WishlistInput) => void
) {
  const [state, dispatch] = useReducer(navigationReducer, initialNavigationState);

  // Композиционные хуки для навигации по доменам
  const homeNav = useHomeNavigation(dispatch);
  const wishlistNav = useWishlistNavigation(
    dispatch,
    wishlists,
    state.selectedWishlistId,
    onCreateWishlist,
    onUpdateWishlist
  );
  const itemNav = useItemNavigation(
    dispatch,
    wishlists,
    state.selectedWishlistId,
    state.selectedItemId
  );

  // Возврат на предыдущий экран
  const navigateBack = useCallback(() => {
    dispatch({ 
      type: 'NAVIGATE_BACK', 
      payload: { 
        currentView: state.currentView, 
        formMode: state.wishlistFormMode,
        itemFormMode: state.itemFormMode,
        wishlistId: state.selectedWishlistId,
        itemId: state.selectedItemId
      } 
    });
  }, [state.currentView, state.wishlistFormMode, state.itemFormMode, state.selectedWishlistId, state.selectedItemId]);

  // Навигация к Community
  const navigateToCommunity = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_COMMUNITY' });
  }, []);

  // Навигация к Profile
  const navigateToProfile = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_PROFILE' });
  }, []);

  return {
    // Состояние
    ...state,
    
    // Навигация домена Home
    ...homeNav,

    // Навигация по вишлистам
    ...wishlistNav,

    // Навигация по желаниям
    ...itemNav,

    // Базовая навигация
    navigateBack,
    navigateToCommunity,
    navigateToProfile,
  } as const;
}