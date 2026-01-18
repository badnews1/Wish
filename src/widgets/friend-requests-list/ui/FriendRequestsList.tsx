/**
 * Виджет списка входящих запросов в друзья
 * @module widgets/friend-requests-list/ui
 */

import { useMemo } from 'react';
import { useIncomingFriendRequests, FriendRequestCard } from '@/entities/friend';
import { useCurrentUser } from '@/entities/user';
import { FriendRequestActions } from '@/features/manage-friend';
import { UserPlus } from 'lucide-react';
import { useTranslation } from '@/app';

/**
 * Виджет отображения входящих запросов в друзья
 */
export function FriendRequestsList(): JSX.Element {
  const { data: currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useIncomingFriendRequests({ userId: currentUser?.id || '' });

  // Собрать все запросы из страниц
  const requests = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

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
        <p className="text-red-600">{t('widgets.friendRequestsList.errorLoading')}</p>
        <p className="text-sm text-gray-500 mt-1">{t('widgets.friendRequestsList.errorRetry')}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">{t('widgets.friendRequestsList.emptyTitle')}</p>
        <p className="text-sm text-gray-500 mt-1">
          {t('widgets.friendRequestsList.emptySubtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {requests.map((friendship) => (
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
      
      {/* Кнопка "Загрузить еще" */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-3 bg-white rounded-2xl text-purple-600 font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          {isFetchingNextPage ? t('widgets.friendRequestsList.loading') : t('widgets.friendRequestsList.loadMore')}
        </button>
      )}
    </div>
  );
}