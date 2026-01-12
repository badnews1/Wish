import type { HomeTabId } from '../../../app/routing';

/**
 * Конфигурация табов главной страницы
 */
export const HOME_TABS: Array<{ id: HomeTabId; labelKey: string }> = [
  { id: 'feed', labelKey: 'pages.home.tabs.feed' },
  { id: 'selections', labelKey: 'pages.home.tabs.collections' },
  { id: 'popular', labelKey: 'pages.home.tabs.popular' },
  { id: 'wishlists', labelKey: 'pages.home.tabs.wishlists' },
] as const;

// Экспорт с camelCase именем для удобства
export const homeTabs = HOME_TABS;