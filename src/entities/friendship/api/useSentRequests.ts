/**
 * API хук для получения отправленных запросов в друзья
 * @module entities/friendship/api
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { FriendRequest } from '../model/types';

/**
 * Ключи для React Query кэша
 */
export const sentRequestsKeys = {
  all: ['friendships', 'sent-requests'] as const,
};

/**
 * Хук для получения отправленных запросов в друзья
 * Возвращает список пользователей, которым текущий пользователь отправил запросы
 */
export function useSentRequests() {
  return useQuery({
    queryKey: sentRequestsKeys.all,
    queryFn: async (): Promise<FriendRequest[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Получаем запросы, которые отправил текущий пользователь (user_id = current user)
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          created_at,
          friend:friend_id (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(friendship => ({
        id: friendship.id,
        user: {
          id: friendship.friend.id,
          username: friendship.friend.username,
          displayName: friendship.friend.display_name,
          avatarUrl: friendship.friend.avatar_url,
          bio: null,
          createdAt: '',
          updatedAt: '',
        },
        createdAt: friendship.created_at,
      }));
    },
    staleTime: 30 * 1000, // Кэш на 30 секунд
  });
}
