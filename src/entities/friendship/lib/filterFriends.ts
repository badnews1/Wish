/**
 * Утилита для клиентской фильтрации друзей
 * @module entities/friendship/lib
 */

import type { FriendWithDetails } from '../model/types';

/**
 * Фильтрует список друзей по имени или фамилии (case-insensitive)
 * Используется для клиентской фильтрации без запросов к БД
 * 
 * @param friends - Массив друзей
 * @param searchQuery - Поисковый запрос
 * @returns Отфильтрованный массив друзей
 */
export function filterFriendsByName(
  friends: FriendWithDetails[],
  searchQuery: string
): FriendWithDetails[] {
  // Если запрос пустой - возвращаем всех
  if (!searchQuery || searchQuery.trim().length === 0) {
    return friends;
  }

  const query = searchQuery.toLowerCase().trim();

  return friends.filter(friend => {
    // Ищем по display_name (может содержать имя и фамилию)
    const displayName = friend.displayName?.toLowerCase() || '';
    
    // Ищем по username как запасной вариант
    const username = friend.username?.toLowerCase() || '';

    // Совпадение если query содержится в displayName или username
    return displayName.includes(query) || username.includes(query);
  });
}
