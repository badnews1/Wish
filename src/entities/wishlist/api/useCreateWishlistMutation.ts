/**
 * React Query мутация для создания вишлиста в Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation } from '@/shared/lib';
import type { WishlistInput } from '../model/types';
import { uploadWishlistCover } from './wishlistStorageUtils';

export function useCreateWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WishlistInput & { userId: string }) => {
      // Сначала создаём вишлист без обложки
      const { data: wishlist, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: input.userId,
          title: input.title,
          description: input.description || null,
          cover_image: null, // Временно null, обновим после загрузки в Storage
          icon: input.iconId || null,
          icon_id: input.iconId || null,
          privacy: input.privacy,
          event_date: input.eventDate || null,
          booking_visibility: input.bookingVisibility,
          allow_group_gifting: input.allowGroupGifting || false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Если есть обложка - загружаем в Storage и обновляем запись
      if (input.imageUrl) {
        try {
          const coverUrl = await uploadWishlistCover(wishlist.id, input.imageUrl);
          
          const { error: updateError } = await supabase
            .from('wishlists')
            .update({ cover_image: coverUrl })
            .eq('id', wishlist.id);

          if (updateError) {
            console.error('Ошибка обновления обложки в БД:', updateError);
            throw updateError;
          }

          // Возвращаем обновлённый объект
          return { ...wishlist, cover_image: coverUrl };
        } catch (uploadError) {
          console.error('Ошибка загрузки обложки в Storage:', uploadError);
          throw uploadError;
        }
      }

      return wishlist;
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов чтобы перезагрузить список
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success(getTranslation('wishlist.notifications.wishlist.created'));
    },
    onError: (error) => {
      console.error('Ошибка создания вишлиста:', error);
      toast.error(getTranslation('wishlist.notifications.wishlist.errorCreate'));
    },
  });
}