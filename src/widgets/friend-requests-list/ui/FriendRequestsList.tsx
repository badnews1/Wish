/**
 * Виджет списка входящих запросов в друзья
 * @module widgets/friend-requests-list/ui
 */

import { usePendingRequests, FriendCard } from '@/entities/friendship';
import { FriendRequestActions } from '@/features/manage-friend-request';
import { UserPlus } from 'lucide-react';

/**
 * Виджет отображения входящих запросов в друзья
 */
export function FriendRequestsList(): JSX.Element {
  const { data: requests = [], isLoading, error } = usePendingRequests();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Ошибка загрузки запросов</p>
        <p className="text-sm text-gray-500 mt-1">Попробуйте обновить страницу</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Нет новых запросов</p>
        <p className="text-sm text-gray-500 mt-1">
          Здесь появятся входящие запросы в друзья
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <FriendCard
          key={request.friendshipId}
          friend={request}
          actionsSlot={
            <FriendRequestActions friendshipId={request.friendshipId} />
          }
        />
      ))}
    </div>
  );
}
