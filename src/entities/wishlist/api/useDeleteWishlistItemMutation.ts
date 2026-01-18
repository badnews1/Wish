/**
 * React Query мутация для удаления желания из Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation } from '@/shared/lib';
import { deleteWishlistItemPhoto } from './wishlistItemStorageUtils';

export function useDeleteWishlistItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      // Удаляем фото из Storage перед удалением записи
      await deleteWishlistItemPhoto(itemId);

      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error('Error deleting wishlist item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success(getTranslation('wishlist.notifications.wish.deleted'));
    },
    onError: (error) => {
      console.error('Failed to delete wishlist item:', error);
      toast.error(getTranslation('wishlist.notifications.wish.errorDelete'));
    },
  });
}