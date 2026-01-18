/**
 * Виджет списка друзей
 * Список друзей + поиск среди них + поиск новых пользователей
 * @module widgets/friends-list/ui
 */

import { useState, useEffect, useMemo } from 'react';
import { useFriends, FriendCard } from '@/entities/friend';
import { useSearchUsers, UserSearchCard } from '@/entities/user';
import { useCurrentUser } from '@/entities/user';
import { DeleteFriendButton, FriendButton } from '@/features/manage-friend';
import { Search, Users } from 'lucide-react';
import { useTranslation } from '@/app';

/**
 * Виджет списка друзей
 * Список друзей + поиск среди них + поиск новых пользователей
 */
export function FriendsListWidget(): JSX.Element {
  const { data: currentUser } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { t } = useTranslation();

  // Debounce поискового запроса (500ms) для поиска новых пользователей
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Загружаем своих друзей
  const {
    data: friendsData,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFriends({ userId: currentUser?.id || '' });
  
  // Ищем новых пользователей (только если есть поисковый запрос >= 2 символов)
  const { data: searchResults = [], isLoading: searchLoading, error: searchError } = useSearchUsers(debouncedQuery);
  
  // Собрать всех друзей из страниц
  const friends = useMemo(() => {
    return friendsData?.pages.flatMap(page => page.data) || [];
  }, [friendsData]);

  // Фильтруем своих друзей клиентски
  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    
    const query = searchQuery.toLowerCase();
    return friends.filter(friendship => {
      const displayName = friendship.profile.display_name?.toLowerCase() || '';
      const username = friendship.profile.username?.toLowerCase() || '';
      return displayName.includes(query) || username.includes(query);
    });
  }, [friends, searchQuery]);

  const isSearching = searchQuery.trim().length >= 2;
  const hasFriends = friends.length > 0;
  const hasFilteredFriends = filteredFriends.length > 0;
  const hasSearchResults = searchResults.length > 0;

  if (!currentUser || isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('widgets.friendsList.searchPlaceholderExtended')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">{t('widgets.friendsList.errorLoading')}</p>
          <p className="text-sm text-gray-500 mt-1">{t('widgets.friendsList.errorRetry')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Поисковая строка */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t('widgets.friendsList.searchPlaceholderExtended')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Если не ищем - показываем только список друзей */}
      {!isSearching && (
        <>
          {!hasFriends ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">{t('widgets.friendsList.emptyTitle')}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t('widgets.friendsList.emptySubtitle')}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {friends.map((friendship) => (
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
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full py-3 bg-white rounded-2xl text-purple-600 font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
                >
                  {isFetchingNextPage ? t('widgets.friendsList.loading') : t('widgets.friendsList.loadMore')}
                </button>
              )}
            </>
          )}
        </>
      )}

      {/* Если ищем - показываем 2 секции */}
      {isSearching && (
        <div className="space-y-6">
          {/* Секция 1: Мои друзья */}
          {hasFilteredFriends && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                {t('widgets.friendsList.myFriends')}
              </h3>
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
            </div>
          )}

          {/* Секция 2: Добавить в друзья (результаты поиска) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
              {t('widgets.friendsList.addToFriends')}
            </h3>
            
            {searchLoading ? (
              // Скелетоны загрузки
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : searchError ? (
              // О��ибка поиска
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <p className="text-red-600">{t('widgets.friendsList.errorSearch')}</p>
                <p className="text-sm text-gray-500 mt-1">{t('widgets.friendsList.errorSearchRetry')}</p>
              </div>
            ) : hasSearchResults ? (
              // Список найденных пользователей
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <UserSearchCard
                    key={user.id}
                    user={user}
                    actionSlot={
                      <FriendButton targetUserId={user.id} variant="icon" />
                    }
                    t={t}
                  />
                ))}
              </div>
            ) : (
              // Empty state: ничего не найдено
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">{t('widgets.friendsList.userNotFound')}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {t('widgets.friendsList.searchEmptySubtitle')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}