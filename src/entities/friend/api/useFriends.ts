/**
 * Хук для получения списка друзей с пагинацией
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { Friendship, FriendsPaginationParams, FriendshipRpcRow } from '../model/types';

const PAGE_SIZE = 20;

interface UseFriendsParams {
  userId: string; // ID пользователя, чьих друзей загружаем
}

/**
 * Получить список друзей (с пагинацией)
 */
export function useFriends({ userId }: UseFriendsParams) {
  return useInfiniteQuery({
    queryKey: ['friends', userId],
    enabled: !!userId, // Не запускать запрос если userId пустой
    
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as FriendsPaginationParams['cursor'] | undefined;

      // Построить запрос
      let query = supabase
        .rpc('get_friends_paginated', {
          p_user_id: userId,
          p_limit: PAGE_SIZE,
          p_cursor_created_at: cursor?.created_at || null,
          p_cursor_id: cursor?.id || null,
        });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Преобразовать данные
      const friendships: Friendship[] = (data || []).map((row: FriendshipRpcRow) => ({
        id: row.id,
        user_id: row.user_id,
        friend_id: row.friend_id,
        status: row.status,
        requested_by: row.requested_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        profile: {
          id: row.profile_id,
          username: row.profile_username,
          display_name: row.profile_display_name,
          avatar_url: row.profile_avatar_url,
          friends_count: row.profile_friends_count,
        },
      }));

      // Определить nextCursor
      const nextCursor = friendships.length === PAGE_SIZE 
        ? {
            created_at: friendships[friendships.length - 1].created_at,
            id: friendships[friendships.length - 1].id,
          }
        : null;

      return {
        data: friendships,
        nextCursor,
        hasMore: nextCursor !== null,
      };
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}