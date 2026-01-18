/**
 * Хук для принятия входящего запроса в друзья
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '@/app';

interface AcceptFriendRequestParams {
  targetUserId: string;
}

/**
 * Принять входящий запрос в друзья
 */
export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ targetUserId }: AcceptFriendRequestParams) => {
      // Вызвать RPC функцию (SECURITY DEFINER обходит RLS)
      const { error } = await supabase
        .rpc('accept_friend_request', {
          p_target_user_id: targetUserId
        });

      if (error) {
        throw error;
      }

      return { targetUserId };
    },

    onSuccess: () => {
      // Инвалидировать кэш
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] }); // Обновить счетчик
      
      toast.success(t('community.toasts.requestAccepted'));
    },

    onError: () => {
      toast.error(t('community.toasts.requestAcceptedError'));
    },
  });
}