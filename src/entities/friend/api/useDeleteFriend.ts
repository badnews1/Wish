/**
 * Хук для удаления из друзей
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '@/app';

interface DeleteFriendParams {
  targetUserId: string;
}

/**
 * Удалить из друзей
 */
export function useDeleteFriend() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ targetUserId }: DeleteFriendParams) => {
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

      // Удалить запись (только если статус = accepted)
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .eq('status', 'accepted');

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
      
      toast.success(t('community.toasts.friendRemoved'));
    },

    onError: () => {
      toast.error(t('community.toasts.friendRemovedError'));
    },
  });
}