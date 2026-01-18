/**
 * Хук для отклонения входящего запроса в друзья
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '@/app';

interface RejectFriendRequestParams {
  targetUserId: string;
}

/**
 * Отклонить входящий запрос в друзья
 */
export function useRejectFriendRequest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ targetUserId }: RejectFriendRequestParams) => {
      // Вызвать RPC функцию (SECURITY DEFINER обходит RLS)
      const { error } = await supabase
        .rpc('reject_friend_request', {
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
      
      toast.success(t('community.toasts.requestRejected'));
    },

    onError: () => {
      toast.error(t('community.toasts.requestRejectedError'));
    },
  });
}