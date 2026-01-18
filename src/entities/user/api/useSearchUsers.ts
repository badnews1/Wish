/**
 * API хук для поиска пользователей
 * @module entities/user/api
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { getTranslation } from '@/shared/lib';
import type { UserProfile } from '../model/types';

/**
 * Ключи для React Query кэша
 */
export const userSearchKeys = {
  search: (query: string) => ['users', 'search', query] as const,
};

/**
 * Хук для поиска пользователей по никнейму и имени
 * Используется для поиска новых друзей
 */
export function useSearchUsers(searchQuery: string) {
  return useQuery({
    queryKey: userSearchKeys.search(searchQuery),
    queryFn: async (): Promise<UserProfile[]> => {
      // Не выполняем поиск если запрос пустой или слишком короткий
      if (!searchQuery || searchQuery.trim().length < 2) {
        return [];
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(getTranslation('user.errors.notAuthorized'));

      const trimmedQuery = searchQuery.trim();

      // Поиск по никнейму ИЛИ имени (case-insensitive, contains)
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, display_name, avatar_url')
        .or(`username.ilike.%${trimmedQuery}%,display_name.ilike.%${trimmedQuery}%`)
        .neq('id', user.id) // Исключаем самого себя из результатов
        .limit(20); // Ограничиваем количество результатов

      if (error) throw error;

      return (data || []).map(profile => ({
        id: profile.id,
        username: profile.username,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
      }));
    },
    // Включаем запрос только если есть валидная строка поиска
    enabled: searchQuery.trim().length >= 2,
    // Кэшируем результаты на 5 минут
    staleTime: 5 * 60 * 1000,
  });
}