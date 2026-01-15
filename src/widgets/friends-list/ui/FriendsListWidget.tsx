/**
 * Виджет списка друзей
 * Отображает друзей с поиском + возможность найти новых друзей
 * @module widgets/friends-list/ui
 */

import { useState, useEffect, useMemo } from 'react';
import { useMyFriends, FriendCard, filterFriendsByName } from '@/entities/friendship';
import { useSearchUsers, UserSearchCard } from '@/entities/user';
import { RemoveFriendButton } from '@/features/remove-friend';
import { AddFriendButton } from '@/features/add-friend';
import { Search, Users } from 'lucide-react';

/**
 * Виджет списка друзей
 * Список друзей + поиск среди них + поиск новых пользователей
 */
export function FriendsListWidget(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce поискового запроса (500ms) для поиска новых пользователей
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Загружаем своих друзей
  const { data: friends = [], isLoading, error } = useMyFriends();
  
  // Ищем новых пользователей (только если есть поисковый запрос >= 2 символов)
  const { data: searchResults = [], isLoading: searchLoading, error: searchError } = useSearchUsers(debouncedQuery);
  
  // Фильтруем своих друзей клиентски
  const filteredFriends = useMemo(
    () => filterFriendsByName(friends, searchQuery),
    [friends, searchQuery]
  );

  const isSearching = searchQuery.trim().length >= 2;
  const hasFriends = friends.length > 0;
  const hasFilteredFriends = filteredFriends.length > 0;
  const hasSearchResults = searchResults.length > 0;

  if (isLoading) {
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
            placeholder="Поиск друзей или новых пользователей"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="text-center py-12">
          <p className="text-red-600">Ошибка загрузки друзей</p>
          <p className="text-sm text-gray-500 mt-1">Попробуйте обновить страницу</p>
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
          placeholder="Поиск друзей или новых пользователей"
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
              <p className="text-gray-600 font-medium">У вас пока нет друзей</p>
              <p className="text-sm text-gray-500 mt-1">
                Найдите друзей через поиск выше
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.friendshipId}
                  friend={friend}
                  actionsSlot={
                    <RemoveFriendButton
                      friendshipId={friend.friendshipId}
                      friendName={friend.displayName || friend.username || 'друга'}
                      variant="icon"
                    />
                  }
                />
              ))}
            </div>
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
                Мои друзья
              </h3>
              <div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <FriendCard
                    key={friend.friendshipId}
                    friend={friend}
                    actionsSlot={
                      <RemoveFriendButton
                        friendshipId={friend.friendshipId}
                        friendName={friend.displayName || friend.username || 'друга'}
                        variant="icon"
                      />
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Секция 2: Добавить в друзья (результаты поиска) */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
              Добавить в друзья
            </h3>
            
            {searchLoading ? (
              // Скелетоны загрузки
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : searchError ? (
              // Ошибка поиска
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <p className="text-red-600">Ошибка поиска</p>
                <p className="text-sm text-gray-500 mt-1">Попробуйте еще раз</p>
              </div>
            ) : hasSearchResults ? (
              // Список найденных пользователей
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <UserSearchCard
                    key={user.id}
                    user={user}
                    actionSlot={
                      <AddFriendButton userId={user.id} variant="icon" />
                    }
                  />
                ))}
              </div>
            ) : (
              // Empty state: ничего не найдено
              <div className="text-center py-8 bg-gray-50 rounded-2xl">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Пользователь не найден</p>
                <p className="text-sm text-gray-500 mt-1">
                  Попробуйте изменить запрос
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}