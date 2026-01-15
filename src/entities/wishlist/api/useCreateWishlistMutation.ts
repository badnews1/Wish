/**
 * React Query мутация для создания вишлиста в Supabase
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import type { WishlistInput } from '../model/types';

export function useCreateWishlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: WishlistInput & { userId: string }) => {
      console.log('useCreateWishlistMutation - creating wishlist:', input);

      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: input.userId,
          title: input.title,
          description: input.description || null,
          cover_image: input.imageUrl || null,
          icon: input.iconId || null,
          icon_id: input.iconId || null,
          privacy: input.privacy,
          event_date: input.eventDate || null,
          booking_visibility: input.bookingVisibility,
          allow_group_gifting: input.allowGroupGifting || false,
        })
        .select()
        .single();

      console.log('useCreateWishlistMutation - result:', { data, error });

      if (error) {
        console.error('useCreateWishlistMutation - error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Инвалидируем кеш вишлистов чтобы перезагрузить список
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Вишлист создан');
    },
    onError: (error) => {
      console.error('Failed to create wishlist:', error);
      toast.error('Ошибка создания вишлиста');
    },
  });
}