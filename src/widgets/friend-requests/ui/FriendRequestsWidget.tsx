/**
 * Виджет для отображения запросов в друзья
 * Показывает входящие и исходящие запросы
 * @module widgets/friend-requests/ui
 */

import { useMemo } from 'react';
import { Loader2, UserPlus, Send } from 'lucide-react';
import { useTranslation } from '@/app';
import { useIncomingFriendRequests, useOutgoingFriendRequests, FriendRequestCard } from '@/entities/friend';
import { useCurrentUser } from '@/entities/user';
import { FriendRequestActions, FriendButton } from '@/features/manage-friend';

/**
 * Виджет страницы "Запросы"
 * Разделен на две секции: входящие (сверху) и исходящие (снизу)
 */
export function FriendRequestsWidget(): JSX.Element {
  const { data: currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const {
    data: incomingData,
    isLoading: isLoadingIncoming,
    fetchNextPage: fetchNextIncoming,
    hasNextPage: hasNextIncoming,
    isFetchingNextPage: isFetchingNextIncoming,
  } = useIncomingFriendRequests({ userId: currentUser?.id || '' });

  const {
    data: outgoingData,
    isLoading: isLoadingOutgoing,
    fetchNextPage: fetchNextOutgoing,
    hasNextPage: hasNextOutgoing,
    isFetchingNextPage: isFetchingNextOutgoing,
  } = useOutgoingFriendRequests({ userId: currentUser?.id || '' });

  // Собрать запросы из страниц
  const incomingRequests = useMemo(() => {
    return incomingData?.pages.flatMap(page => page.data) || [];
  }, [incomingData]);

  const outgoingRequests = useMemo(() => {
    return outgoingData?.pages.flatMap(page => page.data) || [];
  }, [outgoingData]);

  const isLoading = isLoadingIncoming || isLoadingOutgoing;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent)]" />
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
            {t('widgets.friendRequests.incomingTitle')}
          </h2>
          {incomingRequests.length > 0 && (
            <span className="bg-[var(--color-accent)] text-white text-xs font-semibold px-2 py-0.5 rounded-full">
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
              {t('widgets.friendRequests.incomingEmpty')}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {incomingRequests.map((friendship) => (
                <FriendRequestCard
                  key={friendship.id}
                  profile={friendship.profile}
                  actionsSlot={
                    <FriendRequestActions targetUserId={friendship.profile.id} />
                  }
                  t={t}
                />
              ))}
            </div>
            {hasNextIncoming && (
              <button
                onClick={() => fetchNextIncoming()}
                disabled={isFetchingNextIncoming}
                className="w-full mt-3 py-3 bg-white rounded-2xl text-purple-600 font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                {isFetchingNextIncoming ? t('widgets.friendRequests.loading') : t('widgets.friendRequests.loadMore')}
              </button>
            )}
          </>
        )}
      </section>

      {/* Исходящие запросы */}
      <section>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Send className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t('widgets.friendRequests.outgoingTitle')}
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
              {t('widgets.friendRequests.outgoingEmpty')}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {outgoingRequests.map((friendship) => (
                <FriendRequestCard
                  key={friendship.id}
                  profile={friendship.profile}
                  actionsSlot={
                    <FriendButton targetUserId={friendship.profile.id} variant="icon" />
                  }
                  t={t}
                />
              ))}
            </div>
            {hasNextOutgoing && (
              <button
                onClick={() => fetchNextOutgoing()}
                disabled={isFetchingNextOutgoing}
                className="w-full mt-3 py-3 bg-white rounded-2xl text-purple-600 font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                {isFetchingNextOutgoing ? t('widgets.friendRequests.loading') : t('widgets.friendRequests.loadMore')}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}