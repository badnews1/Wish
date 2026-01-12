import { FeedPage } from '@/pages/home-feed';
import { SelectionsPage } from '@/pages/home-selections';
import { PopularPage } from '@/pages/home-popular';
import { HomeWishlistsPage } from '@/pages/home-wishlists';
import type { HomeRouterProps } from './types';

/**
 * Роутер для контента внутри главной страницы
 * Определяет, какой таб отображать на основе currentView
 */
export function HomeRouter({ currentView, onCreateWishlist }: HomeRouterProps): JSX.Element {
  switch (currentView) {
    case 'home-feed':
      return <FeedPage onCreateWishlist={onCreateWishlist} />;
    case 'home-selections':
      return <SelectionsPage />;
    case 'home-popular':
      return <PopularPage />;
    case 'home-wishlists':
      return <HomeWishlistsPage />;
    default:
      return <FeedPage onCreateWishlist={onCreateWishlist} />;
  }
}