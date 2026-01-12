/**
 * Хук для управления CRUD операциями над вишлистами
 * Композирует entity-логику с app-навигацией и типами форм
 * @module app/routing/useWishlistActions
 */

import { useCallback } from 'react';
import type { NavigationView } from './types';
import { convertWishlistFormToInput } from './converters';
import type { CreateWishlistForm } from '@/features/create-wishlist';
import type { Wishlist, WishlistInput } from '@/entities/wishlist';
import { wishlistNotifications } from '../lib';

interface UseWishlistActionsParams {
  addWishlist: (data: WishlistInput) => void;
  updateWishlist: (id: string, data: WishlistInput) => void;
  removeWishlist: (id: string) => void;
  navigateToWishlist: () => void;
  navigateToCreateWishlist: () => void;
  switchToWishlistTab: () => void;
  handleCreateWishlist: (data: WishlistInput) => void;
  handleEditWishlist: (data: WishlistInput) => void;
  selectedWishlistId: string | null;
}

interface UseWishlistActionsReturn {
  handleCreate: (data: CreateWishlistForm) => void;
  handleUpdate: (data: CreateWishlistForm) => void;
  handleDelete: () => void;
  handleCreateFromMenu: () => void;
}

/**
 * Хук предоставляет обработчики для создания, обновления и удаления вишлистов
 * с автоматической конвертацией типов и показом уведомлений
 */
export function useWishlistActions({
  addWishlist,
  updateWishlist,
  removeWishlist,
  navigateToWishlist,
  navigateToCreateWishlist,
  switchToWishlistTab,
  handleCreateWishlist,
  handleEditWishlist,
  selectedWishlistId,
}: UseWishlistActionsParams): UseWishlistActionsReturn {
  
  const handleCreate = useCallback((data: CreateWishlistForm) => {
    handleCreateWishlist(convertWishlistFormToInput(data));
    switchToWishlistTab();
    wishlistNotifications.wishlist.created();
  }, [handleCreateWishlist, switchToWishlistTab]);

  const handleUpdate = useCallback((data: CreateWishlistForm) => {
    handleEditWishlist(convertWishlistFormToInput(data));
    wishlistNotifications.wishlist.updated();
  }, [handleEditWishlist]);

  const handleDelete = useCallback(() => {
    if (selectedWishlistId) {
      removeWishlist(selectedWishlistId);
      navigateToWishlist();
      switchToWishlistTab();
      wishlistNotifications.wishlist.deleted();
    }
  }, [selectedWishlistId, removeWishlist, navigateToWishlist, switchToWishlistTab]);

  const handleCreateFromMenu = useCallback(() => {
    navigateToCreateWishlist();
  }, [navigateToCreateWishlist]);

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateFromMenu,
  };
}