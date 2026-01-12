import type { HomeTabId } from './types';

/**
 * Тип функции навигации для табов главной страницы
 */
export type HomeTabNavigationHandler = () => void;

/**
 * Маппинг табов главной страницы на функции навигации
 * SINGLE SOURCE OF TRUTH - связь между конфигурацией и логикой
 */
export type HomeTabNavigationMap = Record<HomeTabId, HomeTabNavigationHandler>;

/**
 * Создаёт хелпер для навигации по табам главной страницы
 * Предотвращает рассинхронизацию между конфигурацией и логикой
 */
export function createHomeTabNavigator(navigationMap: HomeTabNavigationMap) {
  return (tabId: HomeTabId): void => {
    const handler = navigationMap[tabId];
    if (!handler) {
      console.error(`No navigation handler found for tab: ${tabId}`);
      return;
    }
    handler();
  };
}