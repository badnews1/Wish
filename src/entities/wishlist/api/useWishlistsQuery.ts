/**
 * React Query хук для загрузки вишлистов из Supabase
 */

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import type { Wishlist, PrivacyType, BookingVisibilityType } from '../model/types';

export function useWishlistsQuery(userId?: string) {
  return useQuery({
    queryKey: ['wishlists', userId],
    queryFn: async (): Promise<Wishlist[]> => {
      let query = supabase
        .from('wishlists')
        .select('*')
        .order('created_at', { ascending: false });

      // Если указан userId - фильтруем по нему
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('useWishlistsQuery - error:', error);
        toast.error('Ошибка загрузки вишлистов');
        throw error;
      }

      // Преобразуем данные из БД в формат приложения
      return (data || []).map((item) => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        description: item.description || undefined,
        imageUrl: item.cover_image || undefined,
        coverImage: item.cover_image || undefined,
        icon: item.icon || undefined,
        iconId: item.icon_id || item.icon || undefined,
        privacy: item.privacy as PrivacyType,
        eventDate: item.event_date ? new Date(item.event_date) : undefined,
        bookingVisibility: item.booking_visibility as BookingVisibilityType,
        allowGroupGifting: item.allow_group_gifting || false,
        favoriteCount: item.favorite_count || 0,
        itemCount: 0, // TODO: добавить подсчет через join с wishlist_item_relations
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));
    },
    enabled: true, // Включен всегда, но можно управлять через параметр
  });
}