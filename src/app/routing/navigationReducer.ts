import type { NavigationState, NavigationAction } from './types';

export const initialNavigationState: NavigationState = {
  currentView: 'home-feed',
  previousView: null,
  selectedWishlistId: null,
  selectedItemId: null,
  wishlistFormMode: 'create',
  itemFormMode: 'create',
};

export function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'NAVIGATE_TO_HOME':
      return {
        currentView: 'home',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_HOME_FEED':
      return {
        currentView: 'home-feed',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_HOME_SELECTIONS':
      return {
        currentView: 'home-selections',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_HOME_POPULAR':
      return {
        currentView: 'home-popular',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_HOME_WISHLISTS':
      return {
        currentView: 'home-wishlists',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_WISHLIST':
      return {
        currentView: 'wishlist',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_COMMUNITY':
      return {
        currentView: 'community',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_PROFILE':
      return {
        currentView: 'profile',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_WISHLIST_DETAIL':
      return {
        currentView: 'wishlist-detail',
        previousView: state.currentView,
        selectedWishlistId: action.payload,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_CREATE_WISHLIST':
      return {
        currentView: 'wishlist-form',
        previousView: state.currentView,
        selectedWishlistId: null,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_EDIT_WISHLIST':
      return {
        currentView: 'wishlist-form',
        previousView: state.currentView,
        selectedWishlistId: action.payload,
        selectedItemId: null,
        wishlistFormMode: 'edit',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_CREATE_ITEM':
      return {
        currentView: 'item-form',
        previousView: state.currentView,
        selectedWishlistId: action.payload,
        selectedItemId: null,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_TO_EDIT_ITEM':
      return {
        currentView: 'item-form',
        previousView: state.currentView,
        selectedWishlistId: action.payload.wishlistId,
        selectedItemId: action.payload.itemId,
        wishlistFormMode: 'create',
        itemFormMode: 'edit',
      };

    case 'NAVIGATE_TO_ITEM_DETAIL':
      return {
        currentView: 'item-detail',
        previousView: state.currentView,
        selectedWishlistId: action.payload.wishlistId,
        selectedItemId: action.payload.itemId,
        wishlistFormMode: 'create',
        itemFormMode: 'create',
      };

    case 'NAVIGATE_BACK': {
      const { currentView, formMode, itemFormMode, wishlistId, itemId } = action.payload;

      if (currentView === 'item-detail') {
        // С детальной страницы желания возвращаемся на детальную страницу вишлиста
        if (wishlistId) {
          return {
            currentView: 'wishlist-detail',
            previousView: null,
            selectedWishlistId: wishlistId,
            selectedItemId: null,
            wishlistFormMode: 'create',
            itemFormMode: 'create',
          };
        } else {
          return {
            currentView: state.previousView || 'home-feed',
            previousView: null,
            selectedWishlistId: null,
            selectedItemId: null,
            wishlistFormMode: 'create',
            itemFormMode: 'create',
          };
        }
      } else if (currentView === 'item-form') {
        // Если есть wishlistId, возвращаемся на детальную страницу вишлиста
        if (wishlistId) {
          return {
            currentView: 'wishlist-detail',
            previousView: null,
            selectedWishlistId: wishlistId,
            selectedItemId: null,
            wishlistFormMode: 'create',
            itemFormMode: 'create',
          };
        } else {
          // Если нет wishlistId, возвращаемся туда, откуда пришли (previousView)
          return {
            currentView: state.previousView || 'home-feed',
            previousView: null,
            selectedWishlistId: null,
            selectedItemId: null,
            wishlistFormMode: 'create',
            itemFormMode: 'create',
          };
        }
      } else if (currentView === 'wishlist-form') {
        if (formMode === 'edit' && wishlistId) {
          return {
            currentView: 'wishlist-detail',
            previousView: null,
            selectedWishlistId: wishlistId,
            selectedItemId: null,
            wishlistFormMode: 'create',
            itemFormMode: 'create',
          };
        } else {
          return {
            currentView: state.previousView || 'wishlist',
            previousView: null,
            selectedWishlistId: null,
            selectedItemId: null,
            wishlistFormMode: 'create',
            itemFormMode: 'create',
          };
        }
      } else if (currentView === 'wishlist-detail') {
        return {
          currentView: 'wishlist',
          previousView: null,
          selectedWishlistId: null,
          selectedItemId: null,
          wishlistFormMode: 'create',
          itemFormMode: 'create',
        };
      } else {
        return {
          currentView: state.previousView || 'home-feed',
          previousView: null,
          selectedWishlistId: null,
          selectedItemId: null,
          wishlistFormMode: 'create',
          itemFormMode: 'create',
        };
      }
    }

    default:
      return state;
  }
}