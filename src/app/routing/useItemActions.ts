/**
 * Хук для управления CRUD операциями над желаниями (items)
 * Композирует entity-логику с app-навигацией и типами форм
 * @module app/routing/useItemActions
 */

import { useCallback } from 'react';
import type { NavigationView } from './types';
import { convertItemFormToInput } from './converters';
import type { CreateWishlistItemForm } from '@/features/create-wishlist-item';
import type { WishlistItem } from '@/entities/wishlist';
import { wishlistNotifications } from '../lib';

interface UseItemActionsParams {
  addWishlistItem: (wishlistIds: string[], data: WishlistItem) => void;
  updateWishlistItem: (wishlistId: string, itemId: string, data: WishlistItem) => void;
  removeWishlistItem: (wishlistId: string, itemId: string) => void;
  navigateToWishlistDetail: (wishlistId: string) => void;
  navigateToCreateItem: (wishlistId: string) => void;
  selectedWishlistId: string | null;
  selectedItemId: string | null;
  currentView: NavigationView;
}

interface UseItemActionsReturn {
  handleCreate: (data: CreateWishlistItemForm) => void;
  handleUpdate: (data: CreateWishlistItemForm) => void;
  handleDelete: () => void;
  handleCreateFromMenu: () => void;
}

/**
 * Хук предоставляет обработчики для создания, обновления и удаления желаний
 * с автоматической конвертацией типов и показом уведомлений
 */
export function useItemActions({
  addWishlistItem,
  updateWishlistItem,
  removeWishlistItem,
  navigateToWishlistDetail,
  navigateToCreateItem,
  selectedWishlistId,
  selectedItemId,
  currentView,
}: UseItemActionsParams): UseItemActionsReturn {
  
  const handleCreate = useCallback((data: CreateWishlistItemForm) => {
    addWishlistItem(data.wishlistIds, convertItemFormToInput(data));
    // Переходим к первому выбранному вишлисту
    if (data.wishlistIds.length > 0) {
      navigateToWishlistDetail(data.wishlistIds[0]);
    }
    wishlistNotifications.wish.created();
  }, [addWishlistItem, navigateToWishlistDetail]);

  const handleUpdate = useCallback((data: CreateWishlistItemForm) => {
    if (selectedItemId && selectedWishlistId) {
      // При обновлении обновляем во всех выбранных вишлистах
      data.wishlistIds.forEach(wishlistId => {
        updateWishlistItem(wishlistId, selectedItemId, convertItemFormToInput(data));
      });
      navigateToWishlistDetail(selectedWishlistId);
      wishlistNotifications.wish.updated();
    }
  }, [selectedItemId, selectedWishlistId, updateWishlistItem, navigateToWishlistDetail]);

  const handleDelete = useCallback(() => {
    if (selectedWishlistId && selectedItemId) {
      removeWishlistItem(selectedWishlistId, selectedItemId);
      navigateToWishlistDetail(selectedWishlistId);
      wishlistNotifications.wish.deleted();
    }
  }, [selectedWishlistId, selectedItemId, removeWishlistItem, navigateToWishlistDetail]);

  const handleCreateFromMenu = useCallback(() => {
    // Если мы на странице wishlist-detail, используем текущий вишлист
    if (currentView === 'wishlist-detail' && selectedWishlistId) {
      navigateToCreateItem(selectedWishlistId);
    } else {
      // Открываем форму без предвыбранного вишлиста - пользователь должен выбрать сам
      navigateToCreateItem('');
    }
  }, [currentView, selectedWishlistId, navigateToCreateItem]);

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleCreateFromMenu,
  };
}