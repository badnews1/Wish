/**
 * Хук для получения входящих запросов в друзья
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { Friendship, FriendsPaginationParams, FriendshipRpcRow } from '../model/types';

const PAGE_SIZE = 20;

interface UseIncomingFriendRequestsParams {
  userId: string;
}

/**
 * Получить список входящих запросов в друзья
 */
export function useIncomingFriendRequests({ userId }: UseIncomingFriendRequestsParams) {
  return useInfiniteQuery({
    queryKey: ['incoming-friend-requests', userId],
    enabled: !!userId,
    
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as FriendsPaginationParams['cursor'] | undefined;

      // RPC функция для входящих запросов
      const { data, error } = await supabase
        .rpc('get_incoming_friend_requests_paginated', {
          p_user_id: userId,
          p_limit: PAGE_SIZE,
          p_cursor_created_at: cursor?.created_at || null,
          p_cursor_id: cursor?.id || null,
        });

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