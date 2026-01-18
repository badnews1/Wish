/**
 * React Query хук для получения статистики пользователя
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api';

export interface UserStats {
  wishlistCount: number;
  itemCount: number;
}

export function useUserStatsQuery(userId?: string) {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: async (): Promise<UserStats> => {
      if (!userId) {
        return { wishlistCount: 0, itemCount: 0 };
      }

      // Получаем количество вишлистов
      const { count: wishlistCount, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (wishlistError) {
        console.error('Error loading wishlist count:', wishlistError);
        throw wishlistError;
      }

      // Получаем количество желаний через join
      const { data: wishlists, error: wishlistsError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', userId);

      if (wishlistsError) {
        console.error('Error loading wishlists for item count:', wishlistsError);
        throw wishlistsError;
      }

      const wishlistIds = (wishlists || []).map(w => w.id);
      let itemCount = 0;

      if (wishlistIds.length > 0) {
        const { count, error: itemsError } = await supabase
          .from('wishlist_items')
          .select('*', { count: 'exact', head: true })
          .in('wishlist_id', wishlistIds);

        if (itemsError) {
          console.error('Error loading item count:', itemsError);
          throw itemsError;
        }

        itemCount = count || 0;
      }

      return {
        wishlistCount: wishlistCount || 0,
        itemCount,
      };
    },
    enabled: !!userId,
  });
}
