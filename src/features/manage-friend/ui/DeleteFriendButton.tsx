/**
 * Кнопка удаления из друзей с подтверждением
 */

import { useState } from 'react';
import { useDeleteFriend } from '@/entities/friend';
import { UserMinus, Trash2 } from 'lucide-react';
import { useTranslation } from '@/app';
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

interface DeleteFriendButtonProps {
  /** ID друга для удаления */
  targetUserId: string;
  /** Имя друга для отображения в диалоге */
  friendName?: string;
  /** Размер кнопки */
  size?: 'sm' | 'md';
  /** Вариант отображения */
  variant?: 'icon' | 'full';
}

/**
 * Компонент кнопки удаления из друзей с подтверждением
 */
export function DeleteFriendButton({ 
  targetUserId,
  friendName,
  size = 'md',
  variant = 'icon'
}: DeleteFriendButtonProps): JSX.Element {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteFriend = useDeleteFriend();

  const iconSize = size === 'sm' ? 16 : 20;
  const defaultName = friendName || t('manageFriend.ui.defaultFriendName');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    deleteFriend.mutate({ targetUserId });
    setShowConfirm(false);
  };

  const buttonClass = variant === 'icon'
    ? 'p-2 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    : 'px-4 py-2 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';

  return (
    <>
      <button
        onClick={handleClick}
        disabled={deleteFriend.isPending}
        className={buttonClass}
        aria-label={t('manageFriend.ui.deleteFriendAriaLabel')}
      >
        {variant === 'icon' ? (
          <UserMinus size={iconSize} />
        ) : (
          <>
            <Trash2 size={iconSize} />
            <span>{t('manageFriend.ui.deleteLabel')}</span>
          </>
        )}
      </button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('manageFriend.ui.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('manageFriend.ui.confirmDeleteDescription', { friendName: defaultName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('manageFriend.ui.confirmCancelButton')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('manageFriend.ui.confirmDeleteButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}