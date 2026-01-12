import type { LucideIcon } from 'lucide-react';

/**
 * Базовый тип для ID сущностей
 */
export type EntityId = string;

/**
 * Опция для компонентов выбора (drawer, select)
 */
export interface SelectOption {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon | string; // Поддержка как LucideIcon, так и эмодзи (string)
}

/**
 * Базовые свойства для сущностей с визуальным оформлением
 */
export interface VisualEntity {
  id: EntityId;
  title: string;
  imageUrl?: string;
}

/**
 * Базовые свойства для сущностей с временными метками
 */
export interface TimestampedEntity {
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Размеры карточек
 */
export type CardSize = 'small' | 'medium' | 'large';

/**
 * Базовые пропсы для Drawer компонентов
 */
export interface BaseDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Базовые пропсы для Select компонентов с выбором значения
 */
export interface BaseSelectProps<T extends string> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: T;
  onSelect: (value: T) => void;
}