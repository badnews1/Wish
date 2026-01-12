import React from 'react';
import { Header } from './Header';
import { createBackButton, createDeleteButton } from '../lib';
import { useTranslation } from '../../../shared/lib/hooks/useTranslation';

interface FormHeaderProps {
  /** Заголовок формы */
  title: string;
  
  /** Обработчик кнопки "Назад" */
  onBack: () => void;
  
  /** Обработчик кнопки "Удалить" (опционально, для режима редактирования) */
  onDelete?: () => void;
  
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
  className
}: FormHeaderProps) {
  const { t } = useTranslation();

  return (
    <Header
      title={title}
      titleAlign="left"
      leftAction={createBackButton({ 
        onClick: onBack, 
        ariaLabel: t('widgets.header.backButtonAria')
      })}
      rightAction={
        onDelete ? createDeleteButton({ 
          onClick: onDelete, 
          ariaLabel: t('widgets.header.deleteButtonAria')
        }) : null
      }
      className={className}
    />
  );
}