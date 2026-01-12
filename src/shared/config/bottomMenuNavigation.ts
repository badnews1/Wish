import type { BottomMenuItemId } from './navigation';

/**
 * Тип функции навигации для нижнего меню
 */
export type BottomMenuNavigationHandler = () => void;

/**
 * Маппинг элементов нижнего меню на функции навигации
 * SINGLE SOURCE OF TRUTH - связь между конфигурацией и логикой
 * 
 * Исключаем 'add' т.к. это специальная кнопка с плавающим меню
 */
export type BottomMenuNavigationMap = Record<
  Exclude<BottomMenuItemId, 'add'>, 
  BottomMenuNavigationHandler
>;

/**
 * Создаёт хелпер для навигации по нижнему меню
 * Предотвращает рассинхронизацию между конфигурацией и логикой
 */
export function createBottomMenuNavigator(navigationMap: BottomMenuNavigationMap) {
  return (itemId: BottomMenuItemId): void => {
    // Специальная кнопка "add" не вызывает навигацию
    if (itemId === 'add') {
      return;
    }

    const handler = navigationMap[itemId];
    if (!handler) {
      console.error(`No navigation handler found for bottom menu item: ${itemId}`);
      return;
    }
    handler();
  };
}
