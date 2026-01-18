/**
 * Хук для получения количества друзей пользователя
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

interface UseFriendsCountParams {
  userId?: string;
}

/**
 * Получить количество принятых друзей
 */
export function useFriendsCount({ userId }: UseFriendsCountParams) {
  return useQuery({
    queryKey: ['friendsCount', userId],
    enabled: !!userId,
    
    queryFn: async (): Promise<number> => {
      if (!userId) {
        return 0;
      }

      // Подсчитываем количество принятых дружеских связей
      // Пользователь может быть как user_id (отправитель), так и friend_id (получатель)
      const { count, error } = await supabase
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

      if (error) {
        console.error('Error loading friends count:', error);
        throw error;
      }

      return count || 0;
    },
  });
}
