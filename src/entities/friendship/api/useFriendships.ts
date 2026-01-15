/**
 * API хуки для работы с дружбой
 * @module entities/friendship/api
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { FriendWithDetails, FriendshipInsert, FriendshipUpdate, FriendRequest } from '../model/types';
import { toast } from 'sonner@2.0.3';

/**
 * Ключи для React Query кэша
 */
export const friendshipKeys = {
  all: ['friendships'] as const,
  myFriends: () => [...friendshipKeys.all, 'my-friends'] as const,
  pendingRequests: () => [...friendshipKeys.all, 'pending-requests'] as const,
};

/**
 * Хук для получения списка принятых друзей текущего пользователя
 */
export function useMyFriends() {
  return useQuery({
    queryKey: friendshipKeys.myFriends(),
    queryFn: async (): Promise<FriendWithDetails[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Получаем записи где статус = accepted И (я user_id ИЛИ я friend_id)
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .eq('status', 'accepted')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

      if (error) throw error;

      // Для каждой записи определяем ID друга и загружаем его профиль
      const friendsWithDetails: FriendWithDetails[] = await Promise.all(
        (data || []).map(async (friendship) => {
          // Определяем кто друг (не я)
          const friendId = friendship.user_id === user.id 
            ? friendship.friend_id 
            : friendship.user_id;

          // Загружаем профиль друга
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('id', friendId)
            .single();

          if (profileError) {
            console.error('Ошибка загрузки профиля друга:', profileError);
          }

          return {
            friendshipId: friendship.id,
            userId: friendId,
            username: profile?.username || null,
            displayName: profile?.display_name || null,
            avatarUrl: profile?.avatar_url || null,
            status: friendship.status,
            createdAt: friendship.created_at,
          };
        })
      );

      return friendsWithDetails;
    },
  });
}

/**
 * Хук для получения входящих запросов в друзья (pending)
 */
export function usePendingRequests() {
  return useQuery({
    queryKey: friendshipKeys.pendingRequests(),
    queryFn: async (): Promise<FriendWithDetails[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Получаем записи где я friend_id И статус = pending (входящие запросы)
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          user_id,
          friend_id,
          status,
          created_at
        `)
        .eq('friend_id', user.id)
        .eq('status', 'pending');

      if (error) throw error;

      // Загружаем профили отправителей запросов
      const requestsWithDetails: FriendWithDetails[] = await Promise.all(
        (data || []).map(async (friendship) => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url')
            .eq('id', friendship.user_id)
            .single();

          if (profileError) {
            console.error('Ошибка загрузки профиля отправителя:', profileError);
          }

          return {
            friendshipId: friendship.id,
            userId: friendship.user_id,
            username: profile?.username || null,
            displayName: profile?.display_name || null,
            avatarUrl: profile?.avatar_url || null,
            status: friendship.status,
            createdAt: friendship.created_at,
          };
        })
      );

      return requestsWithDetails;
    },
  });
}

/**
 * Хук для отправки запроса в друзья
 */
export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendId: string): Promise<void> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Пользователь не авторизован');

      // Проверяем, нет ли уже связи в любом направлении
      const { data: existing } = await supabase
        .from('friendships')
        .select('id')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`)
        .maybeSingle();

      if (existing) {
        throw new Error('Связь уже существует');
      }

      const insert: FriendshipInsert = {
        user_id: user.id,
        friend_id: friendId,
        status: 'pending',
      };

      const { error } = await supabase
        .from('friendships')
        .insert(insert);

      if (error) throw error;
    },
    onSuccess: () => {
      // Инвалидируем кэш
      queryClient.invalidateQueries({ queryKey: friendshipKeys.all });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      toast.success('Запрос в друзья отправлен');
    },
    onError: (error: Error) => {
      console.error('Ошибка отправки запроса в друзья:', error);
      
      if (error.message === 'Связь уже существует') {
        toast.error('Этот пользователь уже в ваших друзьях или есть активный запрос');
      } else {
        toast.error('Не удалось отправить запрос');
      }
    },
  });
}

/**
 * Хук для принятия запроса в друзья
 */
export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendshipId: string): Promise<void> => {
      const update: FriendshipUpdate = {
        status: 'accepted',
      };

      const { error } = await supabase
        .from('friendships')
        .update(update)
        .eq('id', friendshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendshipKeys.all });
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      toast.success('Запрос принят');
    },
    onError: (error: Error) => {
      console.error('Ошибка принятия запроса:', error);
      toast.error('Не удалось принять запрос');
    },
  });
}

/**
 * Хук для отклонения запроса в друзья
 */
export function useRejectFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendshipId: string): Promise<void> => {
      const update: FriendshipUpdate = {
        status: 'rejected',
      };

      const { error } = await supabase
        .from('friendships')
        .update(update)
        .eq('id', friendshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendshipKeys.all });
      toast.success('Запрос отклонен');
    },
    onError: (error: Error) => {
      console.error('Ошибка отклонения запроса:', error);
      toast.error('Не удалось отклонить запрос');
    },
  });
}

/**
 * Хук для удаления из друзей
 */
export function useRemoveFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friendshipId: string): Promise<void> => {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: friendshipKeys.all });
      toast.success('Удалено з друзей');
    },
    onError: (error: Error) => {
      console.error('Ошибка удаления из друзей:', error);
      toast.error('Не удалось удалить из друзей');
    },
  });
}