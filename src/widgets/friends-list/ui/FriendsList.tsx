/**
 * Виджет списка друзей с фильтрацией
 * @module widgets/friends-list/ui
 */

import { useState, useMemo } from 'react';
import { useMyFriends, FriendCard, filterFriendsByName } from '@/entities/friendship';
import { RemoveFriendButton } from '@/features/remove-friend';
import { Search, Users } from 'lucide-react';

/**
 * Виджет отображения списка друзей с поиском по имени
 */
export function FriendsList(): JSX.Element {
  const { data: friends = [], isLoading, error } = useMyFriends();
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем друзей клиентски по имени/фамилии
  const filteredFriends = useMemo(
    () => filterFriendsByName(friends, searchQuery),
    [friends, searchQuery]
  );

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
        <p className="text-red-600">Ошибка загрузки друзей</p>
        <p className="text-sm text-gray-500 mt-1">Попробуйте обновить страницу</p>
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
            placeholder="Поиск по имени"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      )}

      {/* Список друзей */}
      {hasSearchResults ? (
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
      ) : searchQuery.trim() ? (
        // Empty state: поиск не дал результатов
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Ничего не найдено</p>
          <p className="text-sm text-gray-500 mt-1">
            Попробуйте изменить запрос
          </p>
        </div>
      ) : (
        // Empty state: нет друзей вообще
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">У вас пока нет друзей</p>
          <p className="text-sm text-gray-500 mt-1">
            Найдите друзей через поиск выше
          </p>
        </div>
      )}
    </div>
  );
}
