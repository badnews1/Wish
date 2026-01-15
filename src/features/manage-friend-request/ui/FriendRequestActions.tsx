/**
 * Кнопки действий для входящего запроса в друзья
 * @module features/manage-friend-request/ui
 */

import { useAcceptFriendRequest, useRejectFriendRequest } from '@/entities/friendship';
import { Check, X } from 'lucide-react';

interface FriendRequestActionsProps {
  /** ID записи friendship */
  friendshipId: string;
}

/**
 * Компонент кнопок принятия/отклонения запроса в друзья
 */
export function FriendRequestActions({ friendshipId }: FriendRequestActionsProps): JSX.Element {
  const acceptRequest = useAcceptFriendRequest();
  const rejectRequest = useRejectFriendRequest();

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    acceptRequest.mutate(friendshipId);
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectRequest.mutate(friendshipId);
  };

  const isLoading = acceptRequest.isPending || rejectRequest.isPending;

  return (
    <div className="flex items-center gap-2">
      {/* Кнопка принять */}
      <button
        onClick={handleAccept}
        disabled={isLoading}
        className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Принять запрос"
      >
        <Check size={18} />
      </button>

      {/* Кнопка отклонить */}
      <button
        onClick={handleReject}
        disabled={isLoading}
        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Отклонить запрос"
      >
        <X size={18} />
      </button>
    </div>
  );
}
