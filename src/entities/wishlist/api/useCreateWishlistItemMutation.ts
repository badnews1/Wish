/**
 * React Query мутация для создания желания в Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation, MAX_WISH_TITLE_LENGTH, MAX_WISH_DESCRIPTION_LENGTH } from '@/shared/lib';
import type { WishlistItemInput } from '../model/types';
import { uploadWishlistItemPhoto } from './wishlistItemStorageUtils';

interface CreateWishlistItemParams {
  wishlistId: string;
  item: WishlistItemInput;
}

export function useCreateWishlistItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ wishlistId, item }: CreateWishlistItemParams) => {
      // Обрезаем название и описание до максимальной длины (доп. защита)
      const safeTitle = item.title.slice(0, MAX_WISH_TITLE_LENGTH);
      const safeDescription = item.description ? item.description.slice(0, MAX_WISH_DESCRIPTION_LENGTH) : null;
      
      // Сначала создаём желание без фото
      const { data: wishlistItem, error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlistId,
          title: safeTitle,
          description: safeDescription,
          image_url: null, // Временно null, обновим после загрузки в Storage
          product_url: item.link || null,
          price: item.price || null,
          currency: item.currency || 'RUB',
          tags: item.giftTag ? [item.giftTag] : [],
          categories: item.category || [],
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating wishlist item:', error);
        throw error;
      }

      // Если есть фото - загружаем в Storage и обновляем запись
      if (item.imageUrl) {
        try {
          const photoUrl = await uploadWishlistItemPhoto(wishlistItem.id, item.imageUrl);
          
          const { error: updateError } = await supabase
            .from('wishlist_items')
            .update({ image_url: photoUrl })
            .eq('id', wishlistItem.id);

          if (updateError) {
            console.error('Ошибка обновления фото в БД:', updateError);
            throw updateError;
          }

          // Возвращаем обновлённый объект
          return { ...wishlistItem, image_url: photoUrl };
        } catch (uploadError) {
          console.error('Ошибка загрузки фото в Storage:', uploadError);
          throw uploadError;
        }
      }

      return wishlistItem;
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов чтобы перезагрузить список с обновленными items
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success(getTranslation('wishlist.notifications.wish.created'));
    },
    onError: (error) => {
      console.error('Failed to create wishlist item:', error);
      toast.error(getTranslation('wishlist.notifications.wish.errorCreate'));
    },
  });
}