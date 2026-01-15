/**
 * API хук для проверки статуса отношений с пользователем
 * @module entities/friendship/api
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { FriendshipStatus } from '../model/types';

interface FriendshipStatusResult {
  /** Есть ли какая-то связь */
  exists: boolean;
  /** Статус связи */
  status: FriendshipStatus | null;
  /** Направление: я отправил (outgoing) или мне отправили (incoming) */
  direction: 'outgoing' | 'incoming' | null;
  /** ID записи friendship */
  friendshipId: string | null;
}

/**
 * Хук для проверки статуса отношений с конкретным пользователем
 * Проверяет есть ли уже запрос или дружба в любом направлении
 */
export function useCheckFriendshipStatus(userId: string | null) {
  return useQuery({
    queryKey: ['friendship-status', userId],
    queryFn: async (): Promise<FriendshipStatusResult> => {
      if (!userId) {
        return { exists: false, status: null, direction: null, friendshipId: null };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { exists: false, status: null, direction: null, friendshipId: null };
      }

      // Проверяем в обоих направлениях
      const { data, error } = await supabase
        .from('friendships')
        .select('id, status, user_id, friend_id')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${userId}),and(user_id.eq.${userId},friend_id.eq.${user.id})`);

      if (error) {
        console.error('Ошибка проверки статуса дружбы:', error);
        return { exists: false, status: null, direction: null, friendshipId: null };
      }

      if (!data || data.length === 0) {
        return { exists: false, status: null, direction: null, friendshipId: null };
      }

      const friendship = data[0];
      const direction = friendship.user_id === user.id ? 'outgoing' : 'incoming';

      return {
        exists: true,
        status: friendship.status,
        direction,
        friendshipId: friendship.id,
      };
    },
    enabled: !!userId,
    staleTime: 10 * 1000, // Кэш на 10 секунд
  });
}
