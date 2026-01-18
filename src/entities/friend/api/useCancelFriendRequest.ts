/**
 * Хук для отмены исходящего запроса в друзья
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '@/app';

interface CancelFriendRequestParams {
  targetUserId: string;
}

/**
 * Отменить исходящий запрос в друзья
 */
export function useCancelFriendRequest() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ targetUserId }: CancelFriendRequestParams) => {
      // Получить текущего пользователя
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error('Необходима авторизация');
      }

      const currentUserId = user.id;

      // Нормализовать пару
      const [userId, friendId] = currentUserId < targetUserId 
        ? [currentUserId, targetUserId]
        : [targetUserId, currentUserId];

      // Удалить запись (только если текущий пользователь = отправитель)
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .eq('status', 'pending')
        .eq('requested_by', currentUserId);

      if (error) {
        throw error;
      }

      return { targetUserId };
    },

    onSuccess: () => {
      // Инвалидировать кэш
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      
      toast.success(t('community.toasts.requestCanceled'));
    },

    onError: () => {
      toast.error(t('community.toasts.requestCanceledError'));
    },
  });
}