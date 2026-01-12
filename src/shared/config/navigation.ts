import { Home, Users, ListChecks, Settings, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * ID элементов нижнего меню приложения
 */
export type BottomMenuItemId = 'home' | 'community' | 'wishlist' | 'profile' | 'add';

/**
 * Конфигурация элемента нижнего меню
 */
export interface BottomMenuItemConfig {
  id: BottomMenuItemId;
  icon: LucideIcon;
  /** i18n ключ для label (например, 'navigation.home') */
  labelKey: string;
  isCenter?: boolean;
}

/**
 * Конфигурация элементов нижнего меню
 * SINGLE SOURCE OF TRUTH - единый источник истины для всех ID нижнего меню
 */
export const BOTTOM_MENU_CONFIG: Record<BottomMenuItemId, BottomMenuItemConfig> = {
  home: { 
    id: 'home', 
    icon: Home, 
    labelKey: 'navigation.home'
  },
  community: { 
    id: 'community', 
    icon: Users, 
    labelKey: 'navigation.community'
  },
  add: { 
    id: 'add', 
    icon: Plus, 
    labelKey: 'navigation.add',
    isCenter: true 
  },
  wishlist: { 
    id: 'wishlist', 
    icon: ListChecks, 
    labelKey: 'navigation.wishlist'
  },
  profile: { 
    id: 'profile', 
    icon: Settings, 
    labelKey: 'navigation.profile'
  },
} as const;

/**
 * Массив элементов нижнего меню в порядке отображения
 */
export const BOTTOM_MENU_ITEMS: BottomMenuItemConfig[] = [
  BOTTOM_MENU_CONFIG.home,
  BOTTOM_MENU_CONFIG.community,
  BOTTOM_MENU_CONFIG.add,
  BOTTOM_MENU_CONFIG.wishlist,
  BOTTOM_MENU_CONFIG.profile,
];

/**
 * Type guard для проверки валидности BottomMenuItemId
 */
export function isValidBottomMenuId(value: unknown): value is BottomMenuItemId {
  return typeof value === 'string' && value in BOTTOM_MENU_CONFIG;
}