/**
 * Кнопка удаления пользователя из друзей
 * @module features/remove-friend/ui
 */

import { useState } from 'react';
import { useRemoveFriend } from '@/entities/friendship';
import { UserMinus, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface RemoveFriendButtonProps {
  /** ID записи friendship */
  friendshipId: string;
  /** Имя друга для отображения в диалоге подтверждения */
  friendName: string;
  /** Размер кнопки */
  size?: 'sm' | 'md';
  /** Вариант отображения */
  variant?: 'icon' | 'full';
}

/**
 * Компонент кнопки удаления из друзей с подтверждением
 */
export function RemoveFriendButton({ 
  friendshipId, 
  friendName,
  size = 'md',
  variant = 'icon'
}: RemoveFriendButtonProps): JSX.Element {
  const [showConfirm, setShowConfirm] = useState(false);
  const removeFriend = useRemoveFriend();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    removeFriend.mutate(friendshipId);
    setShowConfirm(false);
  };

  const iconSize = size === 'sm' ? 16 : 20;
  const Icon = variant === 'icon' ? UserMinus : Trash2;
  
  const buttonClass = variant === 'icon'
    ? 'p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    : 'px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';

  return (
    <>
      <button
        onClick={handleClick}
        disabled={removeFriend.isPending}
        className={buttonClass}
        aria-label="Удалить из друзей"
      >
        <Icon size={iconSize} />
        {variant === 'full' && <span>Удалить</span>}
      </button>

      {/* Диалог подтверждения */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить из друзей?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить {friendName} из друзей? 
              Это действие можно будет отменить, отправив новый запрос.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
