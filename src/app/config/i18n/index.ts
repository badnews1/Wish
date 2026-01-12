// Импорты из shared
import { sharedRu } from '@/shared/config/i18n/ru';
import { sharedEn } from '@/shared/config/i18n/en';

// Импорты из entities
import { wishlistRu, wishlistEn } from '@/entities/wishlist/config/i18n';

// Импорты из features
import { createWishlistRu, createWishlistEn } from '@/features/create-wishlist/config/i18n';
import { createWishlistItemRu, createWishlistItemEn } from '@/features/create-wishlist-item/config/i18n';
import { productParserRu, productParserEn } from '@/features/product-parser/config/i18n';

// Импорты из widgets
import { bottomMenuRu, bottomMenuEn } from '@/widgets/BottomMenu/config/i18n';
import { headerRu, headerEn } from '@/widgets/Header/config/i18n';

// Импорты из pages
import { homeRu, homeEn } from '@/pages/home/config/i18n';
import { homeFeedRu, homeFeedEn } from '@/pages/home-feed/config/i18n';
import { homePopularRu, homePopularEn } from '@/pages/home-popular/config/i18n';
import { homeWishlistsRu, homeWishlistsEn } from '@/pages/home-wishlists/config/i18n';
import { communityRu, communityEn } from '@/pages/community/config/i18n';
import { profileRu, profileEn } from '@/pages/profile/config/i18n';
import { wishlistPageRu, wishlistPageEn } from '@/pages/wishlist/config/i18n';
import { wishlistDetailRu, wishlistDetailEn } from '@/pages/wishlist-detail/config/i18n';
import { wishlistFormRu, wishlistFormEn } from '@/pages/wishlist-form/config/i18n';
import { wishlistItemDetailRu, wishlistItemDetailEn } from '@/pages/wishlist-item-detail/config/i18n';
import { wishlistItemFormRu, wishlistItemFormEn } from '@/pages/wishlist-item-form/config/i18n';

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
    createWishlist: createWishlistRu,
    createWishlistItem: createWishlistItemRu,
    productParser: productParserRu,
    widgets: {
      bottomMenu: bottomMenuRu,
      header: headerRu
    },
    pages: {
      home: homeRu,
      homeFeed: homeFeedRu,
      homePopular: homePopularRu,
      homeWishlists: homeWishlistsRu,
      community: communityRu,
      profile: profileRu,
      wishlist: wishlistPageRu,
      wishlistDetail: wishlistDetailRu,
      wishlistForm: wishlistFormRu,
      wishlistItemDetail: wishlistItemDetailRu,
      wishlistItemForm: wishlistItemFormRu
    }
  },
  en: {
    ...sharedEn,
    wishlist: wishlistEn,
    createWishlist: createWishlistEn,
    createWishlistItem: createWishlistItemEn,
    productParser: productParserEn,
    widgets: {
      bottomMenu: bottomMenuEn,
      header: headerEn
    },
    pages: {
      home: homeEn,
      homeFeed: homeFeedEn,
      homePopular: homePopularEn,
      homeWishlists: homeWishlistsEn,
      community: communityEn,
      profile: profileEn,
      wishlist: wishlistPageEn,
      wishlistDetail: wishlistDetailEn,
      wishlistForm: wishlistFormEn,
      wishlistItemDetail: wishlistItemDetailEn,
      wishlistItemForm: wishlistItemFormEn
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.ru;

// Экспортируем функцию getTranslation
export { getTranslation } from './getTranslation';
