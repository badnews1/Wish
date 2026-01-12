import React from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useTranslation } from '@/app';
import { Header } from './Header';

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

function createBackButton({ onClick, ariaLabel }: { onClick: () => void, ariaLabel: string }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  );
}

function createDeleteButton({ onClick, ariaLabel }: { onClick: () => void, ariaLabel: string }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Trash2 className="h-5 w-5" />
    </Button>
  );
}