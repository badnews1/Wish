/**
 * React Query мутация для обновления вишлиста в Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation } from '@/shared/lib';
import type { Wishlist } from '../model/types';
import { updateWishlistCover } from './wishlistStorageUtils';

export function useUpdateWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Wishlist> }) => {
      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.iconId !== undefined) {
        updateData.icon = updates.iconId;
        updateData.icon_id = updates.iconId;
      }
      
      // Обрабатываем обложку отдельно - загружаем в Storage если нужно
      if (updates.imageUrl !== undefined) {
        // Получаем текущую обложку для возможного удаления
        const { data: currentWishlist } = await supabase
          .from('wishlists')
          .select('cover_image')
          .eq('id', id)
          .single();
        
        const coverUrl = await updateWishlistCover(
          id, 
          updates.imageUrl, 
          currentWishlist?.cover_image
        );
        updateData.cover_image = coverUrl;
      }
      
      if (updates.privacy !== undefined) updateData.privacy = updates.privacy;
      if (updates.eventDate !== undefined) updateData.event_date = updates.eventDate;
      if (updates.bookingVisibility !== undefined) updateData.booking_visibility = updates.bookingVisibility;
      if (updates.allowGroupGifting !== undefined) updateData.allow_group_gifting = updates.allowGroupGifting;

      const { data, error } = await supabase
        .from('wishlists')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success(getTranslation('wishlist.notifications.wishlist.updated'));
    },
    onError: () => {
      toast.error(getTranslation('wishlist.notifications.wishlist.errorUpdate'));
    },
  });
}