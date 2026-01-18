/**
 * Хук для получения статуса дружбы с пользователем
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { FriendshipStatusInfo } from '../model/types';

interface UseFriendshipStatusParams {
  targetUserId: string | null; // null если нужно отключить запрос
}

/**
 * Получить статус дружбы с конкретным пользователем
 */
export function useFriendshipStatus({ targetUserId }: UseFriendshipStatusParams) {
  return useQuery({
    queryKey: ['friendship-status', targetUserId],
    
    queryFn: async (): Promise<FriendshipStatusInfo> => {
      if (!targetUserId) {
        return {
          status: null,
          requested_by: null,
          is_incoming: false,
          is_outgoing: false,
        };
      }

      // Получить текущего пользователя
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Необходима авторизация');
      }

      const currentUserId = user.id;

      // Искать связь в обоих направлениях (на случай если нормализация не применена)
      const { data, error } = await supabase
        .from('friendships')
        .select('status, requested_by, user_id, friend_id')
        .or(`and(user_id.eq.${currentUserId},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${currentUserId})`)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Если нет записи
      if (!data) {
        return {
          status: null,
          requested_by: null,
          is_incoming: false,
          is_outgoing: false,
        };
      }

      // Определить направление запроса
      const is_incoming = data.status === 'pending' && data.requested_by !== currentUserId;
      const is_outgoing = data.status === 'pending' && data.requested_by === currentUserId;

      return {
        status: data.status,
        requested_by: data.requested_by,
        is_incoming,
        is_outgoing,
      };
    },

    enabled: !!targetUserId,
  });
}