/**
 * React Query мутация для удаления вишлиста из Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';

export function useDeleteWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('useDeleteWishlistMutation - deleting wishlist:', id);

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);

      console.log('useDeleteWishlistMutation - result:', { error });

      if (error) {
        console.error('useDeleteWishlistMutation - error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Вишлист удалён');
    },
    onError: (error) => {
      console.error('Failed to delete wishlist:', error);
      toast.error('Ошибка удаления вишлиста');
    },
  });
}
