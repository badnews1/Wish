import { useCallback } from 'react';
import type { NavigationView, HomeTabId, NavigationAction } from './types';
import { isValidHomeTabId } from './types';
import type { HomeTabNavigationMap } from './homeTabNavigation';
import { createHomeTabNavigator } from './homeTabNavigation';

/**
 * Композиционный хук для навигации по табам главной страницы
 */
export function useHomeNavigation(dispatch: React.Dispatch<NavigationAction>) {
  // Навигация на главную
  const navigateToHome = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME' });
  }, [dispatch]);

  // Навигация на таб Лента
  const navigateToHomeFeed = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME_FEED' });
  }, [dispatch]);

  // Навигация на таб Подборки
  const navigateToHomeSelections = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME_SELECTIONS' });
  }, [dispatch]);

  // Навигация на таб Популярное
  const navigateToHomePopular = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME_POPULAR' });
  }, [dispatch]);

  // Навигация на таб Вишлисты (главная)
  const navigateToHomeWishlists = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_HOME_WISHLISTS' });
  }, [dispatch]);

  return {
    navigateToHome,
    navigateToHomeFeed,
    navigateToHomeSelections,
    navigateToHomePopular,
    navigateToHomeWishlists,
  } as const;
}

/**
 * Хук для работы с табами главной страницы
 * Содержит логику конвертации NavigationView -> HomeTabId и обработки переключения табов
 */
export function useHomeTabsLogic(
  currentView: NavigationView,
  homeNavigation: ReturnType<typeof useHomeNavigation>
) {
  // ✅ Маппинг табов на функции навигации (связь конфигурации с логикой)
  const homeTabNavigationMap: HomeTabNavigationMap = {
    feed: homeNavigation.navigateToHomeFeed,
    selections: homeNavigation.navigateToHomeSelections,
    popular: homeNavigation.navigateToHomePopular,
    wishlists: homeNavigation.navigateToHomeWishlists,
  };

  const navigateToHomeTab = createHomeTabNavigator(homeTabNavigationMap);

  // ✅ Обработчик переключения табов с runtime валидацией
  const handleHomeTabChange = useCallback((tabId: HomeTabId) => {
    // Runtime валидация
    if (!isValidHomeTabId(tabId)) {
      console.error(`Invalid home tab ID: ${tabId}`);
      return;
    }
    navigateToHomeTab(tabId);
  }, [navigateToHomeTab]);

  // ✅ Определяем currentSubPage для HomePage на основе currentView
  const getCurrentHomeSubPage = useCallback((): HomeTabId => {
    switch (currentView) {
      case 'home-feed':
        return 'feed';
      case 'home-selections':
        return 'selections';
      case 'home-popular':
        return 'popular';
      case 'home-wishlists':
        return 'wishlists';
      default:
        return 'feed';
    }
  }, [currentView]);

  return {
    getCurrentHomeSubPage,
    handleHomeTabChange,
  };
}