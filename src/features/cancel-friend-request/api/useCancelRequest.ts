/**
 * API хук для отмены запроса в друзья
 * @module features/cancel-friend-request/api
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { sentRequestsKeys } from '@/entities/friendship';
import { toast } from 'sonner@2.0.3';

/**
 * Хук для отмены отправленного запроса в друзья
 */
export function useCancelRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendshipId: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Удаляем запрос
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .eq('user_id', user.id) // Проверяем, что это наш запрос
        .eq('status', 'pending'); // Можно отменить только pending

      if (error) throw error;
    },
    onSuccess: () => {
      // Инвалидируем кэш отправленных запросов
      queryClient.invalidateQueries({ queryKey: sentRequestsKeys.all });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      
      toast.success('Запрос отменен');
    },
    onError: (error) => {
      console.error('Ошибка отмены запроса:', error);
      toast.error('Не удалось отменить запрос');
    },
  });
}