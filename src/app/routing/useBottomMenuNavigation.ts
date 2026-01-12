import { useState, useCallback, useMemo } from 'react';
import type { BottomMenuItemId, BottomMenuNavigationMap } from '@/shared/config';
import { isValidBottomMenuId, createBottomMenuNavigator } from '@/shared/config';

interface UseBottomMenuNavigationReturn {
  activeMenuItem: BottomMenuItemId;
  handleMenuItemChange: (itemId: BottomMenuItemId) => void;
  switchToMenuItem: (itemId: Exclude<BottomMenuItemId, 'add'>) => void;
}

/**
 * Хук для управления переключением элементов нижнего меню приложения
 */
export function useBottomMenuNavigation(
  onNavigateToHomeFeed: () => void,
  onNavigateToWishlist: () => void,
  onNavigateToCommunity?: () => void,
  onNavigateToProfile?: () => void
): UseBottomMenuNavigationReturn {
  const [activeMenuItem, setActiveMenuItem] = useState<BottomMenuItemId>('home');

  // ✅ Создаём связь между конфигурацией и логикой навигации
  const navigationMap: BottomMenuNavigationMap = useMemo(() => ({
    home: onNavigateToHomeFeed,
    community: onNavigateToCommunity || (() => {}),
    wishlist: onNavigateToWishlist,
    profile: onNavigateToProfile || (() => {}),
  }), [onNavigateToHomeFeed, onNavigateToWishlist, onNavigateToCommunity, onNavigateToProfile]);

  const navigateToMenuItem = useMemo(
    () => createBottomMenuNavigator(navigationMap),
    [navigationMap]
  );

  const handleMenuItemChange = useCallback((itemId: BottomMenuItemId) => {
    // Runtime валидация
    if (!isValidBottomMenuId(itemId)) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`Invalid bottom menu item ID: ${itemId}`);
      }
      return;
    }

    // Не переключаем на специальную кнопку "add"
    if (itemId !== 'add') {
      setActiveMenuItem(itemId);
      // ✅ Используем навигатор вместо switch/case
      navigateToMenuItem(itemId);
    }
  }, [navigateToMenuItem]);

  const switchToMenuItem = useCallback((itemId: Exclude<BottomMenuItemId, 'add'>) => {
    setActiveMenuItem(itemId);
  }, []);

  return {
    activeMenuItem,
    handleMenuItemChange,
    switchToMenuItem,
  } as const;
}