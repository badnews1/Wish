import { ReactNode } from 'react';

export type HeaderTitleAlign = 'center' | 'left';

export interface HeaderProps {
  /** Заголовок хедера */
  title: string;
  
  /** Выравнивание заголовка */
  titleAlign?: HeaderTitleAlign;
  
  /** Контент для левой части хедера (например, кнопка назад) */
  leftAction?: ReactNode;
  
  /** Контент для правой части хедера (например, кнопка уведомлений, удаления) */
  rightAction?: ReactNode;
  
  /** Дополнительный CSS класс */
  className?: string;
}
