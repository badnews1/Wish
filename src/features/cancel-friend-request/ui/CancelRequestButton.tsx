/**
 * Кнопка для отмены отправленного запроса в друзья
 * @module features/cancel-friend-request/ui
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { useCancelRequest } from '../api/useCancelRequest';

interface CancelRequestButtonProps {
  /** ID запроса в друзья */
  friendshipId: string;
  /** Имя пользователя для отображения */
  userName?: string;
}

/**
 * Кнопка отмены запроса в друзья
 */
export function CancelRequestButton({ 
  friendshipId,
  userName 
}: CancelRequestButtonProps): JSX.Element {
  const cancelRequest = useCancelRequest();

  const handleCancel = () => {
    cancelRequest.mutate(friendshipId);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCancel}
      disabled={cancelRequest.isPending}
    >
      {cancelRequest.isPending ? 'Отмена...' : 'Отменить'}
    </Button>
  );
}
