/**
 * Кнопка для отклонения запроса в друзья
 * @module features/manage-friend-request/ui
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRejectFriendRequest } from '@/entities/friendship';
import { X } from 'lucide-react';

interface RejectRequestButtonProps {
  /** ID запроса в друзья */
  friendshipId: string;
}

/**
 * Кнопка отклонения запроса в друзья
 */
export function RejectRequestButton({ friendshipId }: RejectRequestButtonProps): JSX.Element {
  const rejectRequest = useRejectFriendRequest();

  const handleReject = () => {
    rejectRequest.mutate(friendshipId);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleReject}
      disabled={rejectRequest.isPending}
    >
      <X className="w-4 h-4" />
    </Button>
  );
}
