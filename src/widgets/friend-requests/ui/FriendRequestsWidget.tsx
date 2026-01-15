/**
 * Виджет для отображения запросов в друзья
 * Показывает входящие и исходящие запросы
 * @module widgets/friend-requests/ui
 */

import React from 'react';
import { usePendingRequests, useSentRequests } from '@/entities/friendship';
import { FriendRequestCard } from '@/entities/user';
import { SentRequestCard } from '@/entities/friendship';
import { CancelRequestButton } from '@/features/cancel-friend-request';
import { AcceptRequestButton, RejectRequestButton } from '@/features/manage-friend-request';
import { Loader2, UserPlus, Send } from 'lucide-react';

/**
 * Виджет страницы "Запросы"
 * Разделен на две секции: входящие (сверху) и исходящие (снизу)
 */
export function FriendRequestsWidget(): JSX.Element {
  const { data: incomingRequests = [], isLoading: isLoadingIncoming } = usePendingRequests();
  const { data: outgoingRequests = [], isLoading: isLoadingOutgoing } = useSentRequests();

  const isLoading = isLoadingIncoming || isLoadingOutgoing;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#5F33E1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Входящие запросы */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <UserPlus className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            Входящие запросы
          </h2>
          {incomingRequests.length > 0 && (
            <span className="bg-[#5F33E1] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {incomingRequests.length}
            </span>
          )}
        </div>

        {incomingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Нет новых запросов
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {incomingRequests.map((request) => (
              <FriendRequestCard
                key={request.friendshipId}
                request={request}
                acceptSlot={<AcceptRequestButton friendshipId={request.friendshipId} />}
                rejectSlot={<RejectRequestButton friendshipId={request.friendshipId} />}
              />
            ))}
          </div>
        )}
      </section>

      {/* Исходящие запросы */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Send className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            Исходящие запросы
          </h2>
          {outgoingRequests.length > 0 && (
            <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {outgoingRequests.length}
            </span>
          )}
        </div>

        {outgoingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Send className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">
              Нет отправленных запросов
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {outgoingRequests.map((request) => (
              <SentRequestCard
                key={request.id}
                request={request}
                actionSlot={<CancelRequestButton friendshipId={request.id} />}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}