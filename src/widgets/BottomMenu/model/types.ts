import type { LucideIcon } from 'lucide-react';
import type { BottomMenuItemId } from '@/shared/config';

/**
 * Конфигурация всплывающей карточки для создания
 */
export interface FloatingCardConfig {
  id: string;
  icon: LucideIcon;
  title: string;
  backgroundColor: string;
  rotation: number;
}

/**
 * Пропсы компонента BottomMenu
 */
export interface BottomMenuProps {
  activeMenuItem: BottomMenuItemId;
  onMenuItemChange: (itemId: BottomMenuItemId) => void;
  onSelectWishlist?: () => void;
  onSelectWish?: () => void;
}