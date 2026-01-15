/**
 * React Query мутация для обновления вишлиста в Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import type { Wishlist } from '../model/types';

export function useUpdateWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Wishlist> }) => {
      console.log('useUpdateWishlistMutation - updating wishlist:', { id, updates });

      const updateData: Record<string, unknown> = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.iconId !== undefined) {
        updateData.icon = updates.iconId;
        updateData.icon_id = updates.iconId;
      }
      if (updates.imageUrl !== undefined) updateData.cover_image = updates.imageUrl;
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

      console.log('useUpdateWishlistMutation - result:', { data, error });

      if (error) {
        console.error('useUpdateWishlistMutation - error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Вишлист обновлён');
    },
    onError: (error) => {
      console.error('Failed to update wishlist:', error);
      toast.error('Ошибка обновления вишлиста');
    },
  });
}