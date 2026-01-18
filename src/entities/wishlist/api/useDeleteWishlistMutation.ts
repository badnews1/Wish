/**
 * React Query мутация для удаления вишлиста из Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation } from '@/shared/lib';
import { deleteWishlistCover } from './wishlistStorageUtils';

export function useDeleteWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Удаляем вишлист из БД (CASCADE удалит связанные items)
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Удаляем обложку из Storage (не бросаем ошибку если не получилось)
      await deleteWishlistCover(id);
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success(getTranslation('wishlist.notifications.wishlist.deleted'));
    },
    onError: () => {
      toast.error(getTranslation('wishlist.notifications.wishlist.errorDelete'));
    },
  });
}