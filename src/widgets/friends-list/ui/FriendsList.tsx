/**
 * Виджет списка друзей с фильтрацией
 * @module widgets/friends-list/ui
 */

import { useState, useMemo } from 'react';
import { useFriends, FriendCard } from '@/entities/friend';
import { useCurrentUser } from '@/entities/user';
import { DeleteFriendButton } from '@/features/manage-friend';
import { Search, Users } from 'lucide-react';
import { useTranslation } from '@/app';

/**
 * Виджет отображения списка друзей с поиском по имени
 */
export function FriendsList(): JSX.Element {
  const { data: currentUser } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFriends({ userId: currentUser?.id || '' });

  // Собрать все друзей из страниц
  const friends = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  // Фильтровать друзей клиентски по имени
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    
    const query = searchQuery.toLowerCase();
    return friends.filter(friendship => {
      const displayName = friendship.profile.display_name?.toLowerCase() || '';
      const username = friendship.profile.username?.toLowerCase() || '';
      return displayName.includes(query) || username.includes(query);
    });
  }, [friends, searchQuery]);

  if (!currentUser || isLoading) {
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
        <p className="text-red-600">{t('widgets.friendsList.errorLoading')}</p>
        <p className="text-sm text-gray-500 mt-1">{t('widgets.friendsList.errorRetry')}</p>
      </div>
    );
  }

  const hasFriends = friends.length > 0;
  const hasSearchResults = filteredFriends.length > 0;

  return (
    <div className="space-y-4">
      {/* Поисковая строка - показываем только если есть друзья */}
      {hasFriends && (
        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            type="text"
            placeholder={t('widgets.friendsList.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      )}

      {/* Список друзей */}
      {hasSearchResults ? (
        <>
          <div className="space-y-3">
            {filteredFriends.map((friendship) => (
              <FriendCard
                key={friendship.id}
                profile={friendship.profile}
                actionsSlot={
                  <DeleteFriendButton
                    targetUserId={friendship.profile.id}
                    friendName={friendship.profile.display_name || friendship.profile.username || t('widgets.friendsList.friendFallbackName')}
                    variant="icon"
                  />
                }
                t={t}
              />
            ))}
          </div>
          
          {/* Кнопка "Загрузить еще" */}
          {hasNextPage && !searchQuery && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-3 bg-white rounded-2xl text-purple-600 font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? t('widgets.friendsList.loading') : t('widgets.friendsList.loadMore')}
            </button>
          )}
        </>
      ) : searchQuery.trim() ? (
        // Empty state: поиск не дал результатов
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{t('widgets.friendsList.searchEmptyTitle')}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t('widgets.friendsList.searchEmptySubtitle')}
          </p>
        </div>
      ) : (
        // Empty state: нет друзей вообще
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{t('widgets.friendsList.emptyTitle')}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t('widgets.friendsList.emptySubtitle')}
          </p>
        </div>
      )}
    </div>
  );
}