/**
 * React Query мутация для обновления желания в Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation, MAX_WISH_TITLE_LENGTH, MAX_WISH_DESCRIPTION_LENGTH } from '@/shared/lib';
import type { WishlistItem } from '../model/types';
import { updateWishlistItemPhoto } from './wishlistItemStorageUtils';

interface UpdateWishlistItemParams {
  itemId: string;
  updates: Partial<WishlistItem>;
}

export function useUpdateWishlistItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, updates }: UpdateWishlistItemParams) => {
      // Получаем текущее состояние желания для проверки старого фото
      const { data: currentItem } = await supabase
        .from('wishlist_items')
        .select('image_url')
        .eq('id', itemId)
        .single();

      // Конвертируем camelCase в snake_case для Supabase
      const dbUpdates: Record<string, any> = {};
      
      // Обрезаем название до максимальной длины (доп. защита)
      if (updates.title !== undefined) {
        dbUpdates.title = updates.title.slice(0, MAX_WISH_TITLE_LENGTH);
      }
      // Обрезаем описание до максимальной длины (доп. защита)
      if (updates.description !== undefined) {
        dbUpdates.description = updates.description 
          ? updates.description.slice(0, MAX_WISH_DESCRIPTION_LENGTH) 
          : null;
      }
      // imageUrl обрабатываем отдельно через Storage
      if (updates.link !== undefined) dbUpdates.product_url = updates.link || null;
      if (updates.price !== undefined) dbUpdates.price = updates.price || null;
      if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
      if (updates.isPurchased !== undefined) dbUpdates.is_purchased = updates.isPurchased;
      if (updates.giftTag !== undefined) dbUpdates.tags = updates.giftTag ? [updates.giftTag] : [];
      if (updates.category !== undefined) dbUpdates.categories = updates.category || [];

      // Если обновляется фото - загружаем в Storage
      if (updates.imageUrl !== undefined) {
        try {
          if (updates.imageUrl) {
            // Загружаем новое фото (с удалением старого)
            const photoUrl = await updateWishlistItemPhoto(
              itemId, 
              updates.imageUrl, 
              currentItem?.image_url
            );
            dbUpdates.image_url = photoUrl;
          } else {
            // Удаляем фото если imageUrl = null
            if (currentItem?.image_url) {
              const { deleteWishlistItemPhoto } = await import('./wishlistItemStorageUtils');
              await deleteWishlistItemPhoto(itemId);
            }
            dbUpdates.image_url = null;
          }
        } catch (uploadError) {
          console.error('Ошибка обновления фото в Storage:', uploadError);
          throw uploadError;
        }
      }

      const { data, error } = await supabase
        .from('wishlist_items')
        .update(dbUpdates)
        .eq('id', itemId)
        .select()
        .single();

      if (error) {
        console.error('Error updating wishlist item:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success(getTranslation('wishlist.notifications.wish.updated'));
    },
    onError: (error) => {
      console.error('Failed to update wishlist item:', error);
      toast.error(getTranslation('wishlist.notifications.wish.errorUpdate'));
    },
  });
}