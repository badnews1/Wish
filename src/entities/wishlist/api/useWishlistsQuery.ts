/**
 * React Query хук для загрузки вишлистов из Supabase
 */

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';
import { getTranslation } from '@/shared/lib';
import type { Wishlist, PrivacyType, BookingVisibilityType } from '../model/types';

export function useWishlistsQuery(userId?: string) {
  return useQuery({
    queryKey: ['wishlists', userId],
    queryFn: async (): Promise<Wishlist[]> => {
      // Сначала загружаем вишлисты
      let query = supabase
        .from('wishlists')
        .select('*')
        .order('created_at', { ascending: false });

      // Если указан userId - фильтруем по нему
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: wishlistsData, error: wishlistsError } = await query;

      if (wishlistsError) {
        console.error('Error loading wishlists:', wishlistsError);
        toast.error(getTranslation('wishlist.notifications.wishlist.errorLoad'));
        throw wishlistsError;
      }

      // Загружаем items для всех вишлистов
      const wishlistIds = (wishlistsData || []).map(w => w.id);
      let items: any[] = [];
      
      if (wishlistIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('wishlist_items')
          .select('*')
          .in('wishlist_id', wishlistIds);

        if (itemsError) {
          console.error('Error loading wishlist items:', itemsError);
          // Не бросаем ошибку, просто items будет пустым
        } else {
          items = itemsData || [];
        }
      }

      // Преобразуем данные из БД в формат приложения
      return (wishlistsData || []).map((item) => {
        const wishlistItems = items.filter(i => i.wishlist_id === item.id);
        
        return {
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
          itemCount: wishlistItems.length,
          items: wishlistItems.map((wishItem: any) => ({
            id: wishItem.id,
            title: wishItem.title,
            description: wishItem.description || undefined,
            imageUrl: wishItem.image_url || undefined,
            link: wishItem.product_url || undefined,
            price: wishItem.price || undefined,
            currency: wishItem.currency || 'RUB',
            isPurchased: wishItem.is_purchased || false,
            giftTag: wishItem.tags?.[0] || undefined,
            category: wishItem.categories || undefined,
            wishlistIds: [item.id], // В контексте текущего вишлиста
          })),
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
        };
      });
    },
    enabled: true, // Включен всегда, но можно управлять через параметр
  });
}