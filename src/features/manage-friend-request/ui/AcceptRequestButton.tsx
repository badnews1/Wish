/**
 * Кнопка для принятия запроса в друзья
 * @module features/manage-friend-request/ui
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useAcceptFriendRequest } from '@/entities/friendship';
import { Check } from 'lucide-react';

interface AcceptRequestButtonProps {
  /** ID запроса в друзья */
  friendshipId: string;
}

/**
 * Кнопка принятия запроса в друзья
 */
export function AcceptRequestButton({ friendshipId }: AcceptRequestButtonProps): JSX.Element {
  const acceptRequest = useAcceptFriendRequest();

  const handleAccept = () => {
    acceptRequest.mutate(friendshipId);
  };

  return (
    <Button
      size="sm"
      onClick={handleAccept}
      disabled={acceptRequest.isPending}
      className="bg-[#5F33E1] hover:bg-[#4F28C7] text-white"
    >
      <Check className="w-4 h-4" />
    </Button>
  );
}
