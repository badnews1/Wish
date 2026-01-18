/**
 * Кнопки действий для входящего запроса в друзья
 */

import { useAcceptFriendRequest, useRejectFriendRequest } from '@/entities/friend';
import { Check, X } from 'lucide-react';
import { useTranslation } from '@/app';

interface FriendRequestActionsProps {
  /** ID пользователя, отправившего запрос */
  targetUserId: string;
  /** Размер кнопок */
  size?: 'sm' | 'md';
}

/**
 * Компонент кнопок для принятия/отклонения входящего запроса
 */
export function FriendRequestActions({ 
  targetUserId,
  size = 'md' 
}: FriendRequestActionsProps): JSX.Element {
  const { t } = useTranslation();
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();

  const iconSize = size === 'sm' ? 16 : 20;

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    acceptRequest.mutate({ targetUserId });
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectRequest.mutate({ targetUserId });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Кнопка принять */}
      <button
        onClick={handleAccept}
        disabled={acceptRequest.isPending || rejectRequest.isPending}
        className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t('manageFriend.ui.acceptRequestAriaLabel')}
      >
        <Check size={iconSize} />
      </button>

      {/* Кнопка отклонить */}
      <button
        onClick={handleReject}
        disabled={acceptRequest.isPending || rejectRequest.isPending}
        className="p-2 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t('manageFriend.ui.rejectRequestAriaLabel')}
      >
        <X size={iconSize} />
      </button>
    </div>
  );
}