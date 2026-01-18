/**
 * Хук для отправки запроса в друзья
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';
import { getTranslation } from '@/shared/lib';
import type { RateLimitError } from '../model/types';

interface SendFriendRequestInput {
  /** ID пользователя, которому отправляем запрос */
  targetUserId: string;
}

/**
 * Мутация для отправки запроса в друзья
 */
export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetUserId }: SendFriendRequestInput) => {
      const { data, error } = await supabase.rpc('send_friend_request', {
        p_target_user_id: targetUserId,
      });

      if (error) {
        // Если ошибка содержит код rate limit
        if (error.message.includes('DAILY_LIMIT')) {
          throw new Error('DAILY_LIMIT');
        }
        if (error.message.includes('RATE_LIMIT')) {
          throw new Error('RATE_LIMIT');
        }
        if (error.message.includes('GLOBAL_LIMIT')) {
          throw new Error('GLOBAL_LIMIT');
        }
        throw error;
      }

      return data;
    },

    onSuccess: () => {
      // Инвалидировать кэш
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      
      toast.success(getTranslation('friend.notifications.sendRequest.success'));
    },

    onError: (error: Error) => {
      const message = error.message as RateLimitError | string;
      
      switch (message) {
        case 'DAILY_LIMIT':
          toast.error(getTranslation('friend.notifications.sendRequest.dailyLimit'));
          break;
        case 'RATE_LIMIT':
          toast.error(getTranslation('friend.notifications.sendRequest.rateLimit'));
          break;
        case 'GLOBAL_LIMIT':
          toast.error(getTranslation('friend.notifications.sendRequest.globalLimit'));
          break;
        default:
          toast.error(getTranslation('friend.notifications.sendRequest.error'));
      }
    },
  });
}
