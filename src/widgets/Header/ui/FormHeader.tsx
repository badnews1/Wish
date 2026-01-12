import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/app';
import { Header } from './Header';
import { createBackButton, createDeleteButton } from '../lib';

interface FormHeaderProps {
  /** Заголовок формы */
  title: string;
  
  /** Обработчик кнопки "Назад" */
  onBack: () => void;
  
  /** Обработчик кнопки "Удалить" (опционально, для режима редактирования) */
  onDelete?: () => void;
  
  /** Aria-labels для кнопок (опционально) */
  ariaLabels?: {
    back?: string;
    delete?: string;
  };
  
  /** Дополнительный CSS класс */
  className?: string;
}

/**
 * Готовый Header для страниц форм с кнопкой "Назад" и опциональной кнопкой "Удалить"
 * 
 * @example
 * // Режим создания
 * <FormHeader
 *   title="Новый вишлист"
 *   onBack={handleBack}
 * />
 * 
 * @example
 * // Режим редактирования с кнопкой удаления
 * <FormHeader
 *   title="Редактировать вишлист"
 *   onBack={handleBack}
 *   onDelete={handleDelete}
 * />
 */
export function FormHeader({
  title,
  onBack,
  onDelete,
  ariaLabels,
  className
}: FormHeaderProps) {
  const { t } = useTranslation();

  return (
    <Header
      title={title}
      titleAlign="left"
      leftAction={createBackButton({ 
        onClick: onBack, 
        ariaLabel: ariaLabels?.back ?? t('widgets.header.backButtonAria')
      })}
      rightAction={
        onDelete ? createDeleteButton({ 
          onClick: onDelete, 
          ariaLabel: ariaLabels?.delete ?? t('widgets.header.deleteButtonAria')
        }) : null
      }
      className={className}
    />
  );
}