import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';

interface BackButtonProps {
  onClick: () => void;
  ariaLabel: string; // Убрали default - теперь обязательный параметр
}

interface DeleteButtonProps {
  onClick: () => void;
  ariaLabel: string; // Убрали default - теперь обязательный параметр
}

/**
 * Стандартная кнопка "Назад" для Header
 * @param onClick - Обработчик клика
 * @param ariaLabel - ARIA метка для доступности (обязательна)
 */
export function createBackButton({ onClick, ariaLabel }: BackButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      shape="circle"
      aria-label={ariaLabel}
    >
      <ArrowLeft />
    </Button>
  );
}

/**
 * Стандартная кнопка "Удалить" для Header (красная)
 * @param onClick - Обработчик клика
 * @param ariaLabel - ARIA метка для доступности (обязательна)
 */
export function createDeleteButton({ onClick, ariaLabel }: DeleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="icon"
      shape="circle"
      aria-label={ariaLabel}
    >
      <Trash2 className="text-red-500" />
    </Button>
  );
}