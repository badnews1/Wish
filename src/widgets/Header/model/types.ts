import { ReactNode } from 'react';

export type HeaderTitleAlign = 'center' | 'left';
export type HeaderVariant = 'default' | 'overlay';

export interface HeaderProps {
  /** Заголовок хедера */
  title?: string;
  
  /** Выравнивание заголовка */
  titleAlign?: HeaderTitleAlign;
  
  /** Контент для левой части хедера (например, кнопка назад) */
  leftAction?: ReactNode;
  
  /** Контент для правой части хедера (например, кнопка уведомлений, удаления) */
  rightAction?: ReactNode;
  
  /** Вариант header (default = белый фон, overlay = прозрачный над изображением) */
  variant?: HeaderVariant;
  
  /** URL изображения (только для variant="overlay") */
  imageUrl?: string;
  
  /** Alt текст для изображения (только для variant="overlay") */
  imageAlt?: string;
  
  /** Цвет фона (только для variant="overlay" когда нет изображения) */
  backgroundColor?: string;
  
  /** Высота header (только для variant="overlay") */
  height?: string;
  
  /** Контент для пустого состояния (только для variant="overlay") */
  emptyStateContent?: ReactNode;
  
  /** Дополнительные overlay элементы внизу (только для variant="overlay") */
  bottomOverlayElements?: ReactNode;
  
  /** Дополнительный CSS класс */
  className?: string;
}