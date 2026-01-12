/**
 * Типы для роутинга приложения
 * @module app/routing/types
 */

import type { Wishlist, WishlistInput, WishlistItem } from '@/entities/wishlist';

/**
 * ID таба главной страницы (внутренние названия навигации)
 */
export type HomeTabId = 'feed' | 'selections' | 'popular' | 'wishlists';

/**
 * Валидация ID таба (runtime проверка)
 * ВАЖНО: Эта функция должна синхронизироваться с HOME_TABS из pages/home/config
 */
export function isValidHomeTabId(tabId: string): tabId is HomeTabId {
  const validIds: HomeTabId[] = ['feed', 'selections', 'popular', 'wishlists'];
  return validIds.includes(tabId as HomeTabId);
}

/**
 * Виды (экраны) навигации приложения
 */
export type NavigationView = 
  | 'home' 
  | 'home-feed'
  | 'home-selections'
  | 'home-popular'
  | 'home-wishlists'
  | 'wishlist' 
  | 'wishlist-detail' 
  | 'wishlist-form'
  | 'item-form'
  | 'item-detail'
  | 'community'
  | 'profile';

/**
 * Состояние навигации приложения
 */
export interface NavigationState {
  currentView: NavigationView;
  previousView: NavigationView | null;
  selectedWishlistId: string | null;
  selectedItemId: string | null;
  wishlistFormMode: 'create' | 'edit';
  itemFormMode: 'create' | 'edit';
}

/**
 * Действия навигации для reducer
 */
export type NavigationAction =
  | { type: 'NAVIGATE_TO_HOME' }
  | { type: 'NAVIGATE_TO_HOME_FEED' }
  | { type: 'NAVIGATE_TO_HOME_SELECTIONS' }
  | { type: 'NAVIGATE_TO_HOME_POPULAR' }
  | { type: 'NAVIGATE_TO_HOME_WISHLISTS' }
  | { type: 'NAVIGATE_TO_WISHLIST' }
  | { type: 'NAVIGATE_TO_WISHLIST_DETAIL'; payload: string }
  | { type: 'NAVIGATE_TO_CREATE_WISHLIST' }
  | { type: 'NAVIGATE_TO_EDIT_WISHLIST'; payload: string }
  | { type: 'NAVIGATE_TO_CREATE_ITEM'; payload: string }
  | { type: 'NAVIGATE_TO_EDIT_ITEM'; payload: { wishlistId: string; itemId: string } }
  | { type: 'NAVIGATE_TO_ITEM_DETAIL'; payload: { wishlistId: string; itemId: string } }
  | { type: 'NAVIGATE_TO_COMMUNITY' }
  | { type: 'NAVIGATE_TO_PROFILE' }
  | { type: 'NAVIGATE_BACK'; payload: { currentView: NavigationView; formMode: 'create' | 'edit'; itemFormMode: 'create' | 'edit'; wishlistId: string | null; itemId: string | null } };

/**
 * Props для главного роутера приложения
 */
export interface AppRouterProps {
  // Состояние навигации
  currentView: NavigationView;
  activeMenuItem: string;
  selectedWishlistId: string | null;
  selectedItemId: string | null;
  wishlistFormMode: 'create' | 'edit';
  itemFormMode: 'create' | 'edit';

  // Данные
  wishlists: Wishlist[];
  selectedWishlist: Wishlist | undefined;
  selectedItem: WishlistItem | undefined;

  // Навигация
  navigateBack: () => void;
  navigateToCreateWishlist: () => void;
  navigateToEditWishlist: (id: string) => void;
  navigateToWishlistDetail: (id: string) => void;
  navigateToCreateItem: (wishlistId: string) => void;
  navigateToEditItem: (wishlistId: string, itemId: string) => void;
  navigateToItemDetail: (wishlistId: string, itemId: string) => void;
  navigateToCommunity: () => void;
  navigateToProfile: () => void;

  // Действия
  handleCreateWishlist: (data: WishlistInput) => void;
  handleUpdateWishlist: (data: WishlistInput) => void;
  handleDeleteWishlist: () => void;
  handleCreateItem: (data: any) => void;
  handleUpdateItem: (data: any) => void;
  handleDeleteItem: () => void;
  updateWishlistItem: (wishlistId: string, itemId: string, data: Partial<WishlistItem>) => void;

  // Обработчики для HomePage
  getCurrentHomeSubPage: () => HomeTabId;
  handleHomeTabChange: (tabId: HomeTabId) => void;
}

/**
 * Props для роутера главной страницы
 */
export interface HomeRouterProps {
  currentView: NavigationView;
  onCreateWishlist: () => void;
}