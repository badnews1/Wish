/**
 * Универсальная кнопка управления дружбой
 * Автоматически определяет состояние и показывает нужную кнопку
 */

import { useFriendshipStatus, useSendFriendRequest, useCancelFriendRequest } from '@/entities/friend';
import { UserPlus, UserCheck, Clock, UserMinus } from 'lucide-react';
import { useTranslation } from '@/app';

interface FriendButtonProps {
  /** ID пользователя */
  targetUserId: string;
  /** Размер кнопки */
  size?: 'sm' | 'md';
  /** Вариант отображения */
  variant?: 'icon' | 'full';
}

/**
 * Компонент кнопки управления дружбой
 * 
 * Состояния:
 * - Нет связи → "Добавить в друзья"
 * - Исходящий запрос → "Отменить запрос"
 * - Входящий запрос → "Принять" (обрабатывается отдельно через FriendRequestActions)
 * - Друзья → "В друзьях" (disabled)
 */
export function FriendButton({ 
  targetUserId, 
  size = 'md',
  variant = 'icon'
}: FriendButtonProps): JSX.Element {
  const { t } = useTranslation();
  const { data: statusInfo } = useFriendshipStatus({ targetUserId });
  const sendRequest = useSendFriendRequest();
  const cancelRequest = useCancelFriendRequest();

  const iconSize = size === 'sm' ? 16 : 20;

  // Обработчик добавления в друзья
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendRequest.mutate({ targetUserId });
  };

  // Обработчик отмены запроса
  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelRequest.mutate({ targetUserId });
  };

  // Состояние: Уже друзья
  if (statusInfo?.status === 'accepted') {
    const buttonClass = variant === 'icon'
      ? 'p-2 rounded-full bg-gray-200 text-gray-500 cursor-default'
      : 'px-4 py-2 rounded-full bg-gray-200 text-gray-600 text-sm font-medium flex items-center gap-2 cursor-default';
    
    return (
      <button
        disabled
        className={buttonClass}
        aria-label={t('manageFriend.ui.alreadyFriendsAriaLabel')}
      >
        <UserCheck size={iconSize} />
        {variant === 'full' && <span>{t('manageFriend.ui.friendsLabel')}</span>}
      </button>
    );
  }

  // Состояние: Исходящий запрос (можно отменить)
  if (statusInfo?.is_outgoing) {
    const buttonClass = variant === 'icon'
      ? 'p-2 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors'
      : 'px-4 py-2 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 text-sm font-medium flex items-center gap-2 transition-colors';
    
    return (
      <button
        onClick={handleCancel}
        disabled={cancelRequest.isPending}
        className={buttonClass}
        aria-label={t('manageFriend.ui.cancelRequestAriaLabel')}
      >
        {cancelRequest.isPending ? (
          <Clock size={iconSize} className="animate-spin" />
        ) : (
          <UserMinus size={iconSize} />
        )}
        {variant === 'full' && (
          <span>{cancelRequest.isPending ? t('manageFriend.ui.cancelingLabel') : t('manageFriend.ui.cancelLabel')}</span>
        )}
      </button>
    );
  }

  // Состояние: Входящий запрос (показываем информацию, действия в другом компоненте)
  if (statusInfo?.is_incoming) {
    const buttonClass = variant === 'icon'
      ? 'p-2 rounded-full bg-blue-100 text-blue-600 cursor-default'
      : 'px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center gap-2 cursor-default';
    
    return (
      <button
        disabled
        className={buttonClass}
        aria-label={t('manageFriend.ui.incomingRequestAriaLabel')}
      >
        <Clock size={iconSize} />
        {variant === 'full' && <span>{t('manageFriend.ui.incomingRequestLabel')}</span>}
      </button>
    );
  }

  // Состояние: Нет связи (можно добавить)
  const buttonClass = variant === 'icon'
    ? 'p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    : 'px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';

  return (
    <button
      onClick={handleAdd}
      disabled={sendRequest.isPending}
      className={buttonClass}
      aria-label={t('manageFriend.ui.addFriendAriaLabel')}
    >
      <UserPlus size={iconSize} />
      {variant === 'full' && (
        <span>{sendRequest.isPending ? t('manageFriend.ui.sendingLabel') : t('manageFriend.ui.addFriendLabel')}</span>
      )}
    </button>
  );
}