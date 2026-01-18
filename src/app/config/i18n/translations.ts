// Импорты из shared
import { sharedRu, sharedEn } from '@/shared/config/i18n';

// Импорты из entities
import { wishlistRu, wishlistEn } from '@/entities/wishlist/config/i18n';
import { userRu, userEn } from '@/entities/user/config/i18n';

// Импорты из features
import { createWishlistRu, createWishlistEn } from '@/features/create-wishlist/config/i18n';
import { createWishlistItemRu, createWishlistItemEn } from '@/features/create-wishlist-item/config/i18n';
import { editProfileRu, editProfileEn } from '@/features/edit-profile/config/i18n';
import { manageFriendRu, manageFriendEn } from '@/features/manage-friend/config/i18n';

// Импорты из widgets
import { bottomMenuRu, bottomMenuEn } from '@/widgets/bottom-menu/config/i18n';
import { headerRu, headerEn } from '@/widgets/header/config/i18n';
import { profileHeaderRu, profileHeaderEn } from '@/widgets/profile-header/config/i18n';
import { profileStatsRu, profileStatsEn } from '@/widgets/profile-stats/config/i18n';
import { profileQuickActionsRu, profileQuickActionsEn } from '@/widgets/profile-quick-actions/config/i18n';
import { friendRequestsWidgetRu, friendRequestsWidgetEn } from '@/widgets/friend-requests/config/i18n';
import { friendRequestsListRu, friendRequestsListEn } from '@/widgets/friend-requests-list/config/i18n';
import { friendsListRu, friendsListEn } from '@/widgets/friends-list/config/i18n';
import { userSearchRu, userSearchEn } from '@/widgets/user-search/config/i18n';

// Импорты из pages
import { homeRu, homeEn } from '@/pages/home/config/i18n';
import { homeFeedRu, homeFeedEn } from '@/pages/home-feed/config/i18n';
import { homePopularRu, homePopularEn } from '@/pages/home-popular/config/i18n';
import { homeWishlistsRu, homeWishlistsEn } from '@/pages/home-wishlists/config/i18n';
import { communityRu, communityEn } from '@/pages/community/config/i18n';
import { wishlistPageRu, wishlistPageEn } from '@/pages/wishlist/config/i18n';
import { wishlistDetailRu, wishlistDetailEn } from '@/pages/wishlist-detail/config/i18n';
import { wishlistFormRu, wishlistFormEn } from '@/pages/wishlist-form/config/i18n';
import { wishlistItemDetailRu, wishlistItemDetailEn } from '@/pages/wishlist-item-detail/config/i18n';
import { wishlistItemFormRu, wishlistItemFormEn } from '@/pages/wishlist-item-form/config/i18n';
import { settingsRu, settingsEn } from '@/pages/settings/config/i18n';

/**
 * Центральная система сборки переводов
 * 
 * Размещена в app/config/i18n согласно FSD Guidelines:
 * - app - самый верхний слой, может импортировать из всех нижележащих слоёв
 * - Собирает переводы из всех слоёв в единую структуру
 * 
 * Гибридный подход распределения переводов:
 * - shared/config/i18n - ТОЛЬКО общие тексты (common, validation, errors, navigation)
 * - entities/{entity}/config/i18n - UI сущности (wishlist.card, giftTags)
 * - features/{feature}/config/i18n - Формы и действия фич
 * - widgets/{widget}/config/i18n - Тексты виджетов
 * - pages/{page}/config/i18n - Тексты страниц
 */
export const translations = {
  ru: {
    ...sharedRu,
    wishlist: wishlistRu,
    user: userRu,
    createWishlist: createWishlistRu,
    createWishlistItem: createWishlistItemRu,
    editProfile: editProfileRu,
    manageFriend: manageFriendRu,
    widgets: {
      bottomMenu: bottomMenuRu,
      header: headerRu,
      profileHeader: profileHeaderRu,
      profileStats: profileStatsRu,
      profileQuickActions: profileQuickActionsRu,
      friendRequests: friendRequestsWidgetRu,
      friendRequestsList: friendRequestsListRu,
      friendsList: friendsListRu,
      userSearch: userSearchRu
    },
    pages: {
      home: homeRu,
      homeFeed: homeFeedRu,
      homePopular: homePopularRu,
      homeWishlists: homeWishlistsRu,
      community: communityRu,
      wishlist: wishlistPageRu,
      wishlistDetail: wishlistDetailRu,
      wishlistForm: wishlistFormRu,
      wishlistItemDetail: wishlistItemDetailRu,
      wishlistItemForm: wishlistItemFormRu,
      settings: settingsRu
    }
  },
  en: {
    ...sharedEn,
    wishlist: wishlistEn,
    user: userEn,
    createWishlist: createWishlistEn,
    createWishlistItem: createWishlistItemEn,
    editProfile: editProfileEn,
    manageFriend: manageFriendEn,
    widgets: {
      bottomMenu: bottomMenuEn,
      header: headerEn,
      profileHeader: profileHeaderEn,
      profileStats: profileStatsEn,
      profileQuickActions: profileQuickActionsEn,
      friendRequests: friendRequestsWidgetEn,
      friendRequestsList: friendRequestsListEn,
      friendsList: friendsListEn,
      userSearch: userSearchEn
    },
    pages: {
      home: homeEn,
      homeFeed: homeFeedEn,
      homePopular: homePopularEn,
      homeWishlists: homeWishlistsEn,
      community: communityEn,
      wishlist: wishlistPageEn,
      wishlistDetail: wishlistDetailEn,
      wishlistForm: wishlistFormEn,
      wishlistItemDetail: wishlistItemDetailEn,
      wishlistItemForm: wishlistItemFormEn,
      settings: settingsEn
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.ru;