# API Хуки для системы друзей

**Путь:** `entities/friend/api/`

---

## 📁 Структура

```
entities/friend/
  ├── api/
  │   ├── useSendFriendRequest.ts
  │   ├── useAcceptFriendRequest.ts
  │   ├── useCancelFriendRequest.ts
  │   ├── useRejectFriendRequest.ts
  │   ├── useDeleteFriend.ts
  │   ├── useMyFriends.ts
  │   ├── useIncomingRequests.ts
  │   ├── useOutgoingRequests.ts
  │   ├── useFriendshipStatus.ts
  │   └── useSearchUsers.ts
  ├── model/
  │   └── types.ts
  └── ui/
      └── (компоненты)
```

---

## 🔧 Типы (model/types.ts)

```typescript
export type FriendshipStatus = 'none' | 'friends' | 'outgoing' | 'incoming';

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted';
  requested_by: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  display_name: string;
  avatar_url: string | null;
  friends_count: number;
}

export interface UserWithFriendship extends User {
  friendshipStatus: FriendshipStatus;
}
```

---

## 🔄 Mutations

### 1. useSendFriendRequest.ts

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';

export function useSendFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentUserId = user.id;
      const [userId, friendId] = [currentUserId, targetUserId].sort();

      try {
        // Пытаемся вставить сразу (оптимистичный сценарий)
        const { data, error } = await supabase
          .from('friendships')
          .insert({
            user_id: userId,
            friend_id: friendId,
            status: 'pending',
            requested_by: currentUserId
          })
          .select()
          .single();

        if (error) throw error;

        toast.success('Запрос отправлен');
        return data;

      } catch (error: any) {
        // Ошибка constraint → запись уже существует
        if (error.code === '23505') {
          const { data: existing } = await supabase
            .from('friendships')
            .select()
            .eq('user_id', userId)
            .eq('friend_id', friendId)
            .single();

          if (!existing) throw error;

          // Встречный запрос → принять
          if (existing.status === 'pending' && existing.requested_by !== currentUserId) {
            const { data } = await supabase
              .from('friendships')
              .update({ status: 'accepted' })
              .eq('id', existing.id)
              .select()
              .single();

            toast.success('Вы стали друзьями!');
            return data;
          }

          // Уже отправлен мной
          if (existing.status === 'pending' && existing.requested_by === currentUserId) {
            toast.info('Запрос уже отправлен');
            return existing;
          }

          // Уже друзья
          if (existing.status === 'accepted') {
            toast.info('Вы уже друзья');
            return existing;
          }
        }

        // Другая ошибка (rate limit от триггера)
        if (error.message?.includes('DAILY_LIMIT')) {
          toast.error('Вы уже отправляли запрос этому пользователю 3 раза сегодня');
        } else if (error.message?.includes('RATE_LIMIT')) {
          toast.error('Слишком частые действия. Попробуйте позже');
        } else if (error.message?.includes('GLOBAL_LIMIT')) {
          toast.error('Слишком много действий за последний час');
        } else {
          toast.error('Ошибка при отправке запроса');
        }

        throw error;
      }
    },
    onSuccess: () => {
      // Инвалидировать все связанные запросы
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['searchUsers'] });
    }
  });
}
```

---

### 2. useAcceptFriendRequest.ts

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';

export function useAcceptFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentUserId = user.id;
      const [userId, friendId] = [currentUserId, targetUserId].sort();

      const { data, error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .eq('status', 'pending')
        .eq('requested_by', targetUserId) // Убедиться что это входящий
        .select()
        .single();

      if (error) {
        toast.error('Ошибка при принятии запроса');
        throw error;
      }

      toast.success('Запрос принят');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    }
  });
}
```

---

### 3. useCancelFriendRequest.ts

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';

export function useCancelFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentUserId = user.id;
      const [userId, friendId] = [currentUserId, targetUserId].sort();

      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .eq('status', 'pending')
        .eq('requested_by', currentUserId); // Только мои исходящие

      if (error) {
        if (error.message?.includes('RATE_LIMIT')) {
          toast.error('Слишком частые действия. Попробуйте позже');
        } else {
          toast.error('Ошибка при отмене запроса');
        }
        throw error;
      }

      toast.success('Запрос отменён');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['searchUsers'] });
    }
  });
}
```

---

### 4. useRejectFriendRequest.ts

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';

export function useRejectFriendRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentUserId = user.id;
      const [userId, friendId] = [currentUserId, targetUserId].sort();

      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .eq('status', 'pending')
        .eq('requested_by', targetUserId); // Только входящие

      if (error) {
        toast.error('Ошибка при отклонении запроса');
        throw error;
      }

      toast.success('Запрос отклонён');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    }
  });
}
```

---

### 5. useDeleteFriend.ts

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';

export function useDeleteFriend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { userId: string; userName: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentUserId = user.id;
      const [userId, friendId] = [currentUserId, params.userId].sort();

      // Подтверждение для друзей
      const confirmed = window.confirm(
        `Удалить ${params.userName} из друзей?`
      );
      if (!confirmed) {
        throw new Error('Cancelled');
      }

      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .eq('status', 'accepted');

      if (error) {
        if (error.message?.includes('RATE_LIMIT')) {
          toast.error('Слишком частые действия. Попробуйте позже');
        } else {
          toast.error('Ошибка при удалении друга');
        }
        throw error;
      }

      toast.success('Пользователь удалён из друзей');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });
}
```

---

## 📊 Queries

### 6. useMyFriends.ts (с пагинацией)

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useMyFriends() {
  return useInfiniteQuery({
    queryKey: ['friends', 'my'],
    queryFn: async ({ pageParam }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('friendships')
        .select('*, user:user_id(*), friend:friend_id(*)')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(20);

      // Cursor по id
      if (pageParam) {
        query = query.lt('id', pageParam);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Получить второго пользователя
      const friends = data.map(item => {
        const otherUser = item.user_id === user.id ? item.friend : item.user;
        return otherUser;
      });

      return {
        data: friends,
        nextCursor: data.length === 20 ? data[data.length - 1].id : null
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
  });
}
```

---

### 7. useIncomingRequests.ts

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useIncomingRequests() {
  return useInfiniteQuery({
    queryKey: ['friendRequests', 'incoming'],
    queryFn: async ({ pageParam }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('friendships')
        .select('*, user:user_id(*), friend:friend_id(*)')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'pending')
        .neq('requested_by', user.id) // НЕ я отправил
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(20);

      if (pageParam) {
        query = query.lt('id', pageParam);
      }

      const { data, error } = await query;
      if (error) throw error;

      const requests = data.map(item => {
        const otherUser = item.user_id === user.id ? item.friend : item.user;
        return otherUser;
      });

      return {
        data: requests,
        nextCursor: data.length === 20 ? data[data.length - 1].id : null
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
  });
}
```

---

### 8. useOutgoingRequests.ts

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

export function useOutgoingRequests() {
  return useInfiniteQuery({
    queryKey: ['friendRequests', 'outgoing'],
    queryFn: async ({ pageParam }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('friendships')
        .select('*, user:user_id(*), friend:friend_id(*)')
        .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
        .eq('status', 'pending')
        .eq('requested_by', user.id) // Я отправил
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(20);

      if (pageParam) {
        query = query.lt('id', pageParam);
      }

      const { data, error } = await query;
      if (error) throw error;

      const requests = data.map(item => {
        const otherUser = item.user_id === user.id ? item.friend : item.user;
        return otherUser;
      });

      return {
        data: requests,
        nextCursor: data.length === 20 ? data[data.length - 1].id : null
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
  });
}
```

---

### 9. useFriendshipStatus.ts

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { FriendshipStatus } from '../model/types';

export function useFriendshipStatus(targetUserId: string | null) {
  return useQuery({
    queryKey: ['friendshipStatus', targetUserId],
    queryFn: async (): Promise<FriendshipStatus> => {
      if (!targetUserId) return 'none';

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 'none';

      const currentUserId = user.id;
      const [userId, friendId] = [currentUserId, targetUserId].sort();

      const { data } = await supabase
        .from('friendships')
        .select('status, requested_by')
        .eq('user_id', userId)
        .eq('friend_id', friendId)
        .maybeSingle();

      if (!data) return 'none';
      if (data.status === 'accepted') return 'friends';
      if (data.requested_by === currentUserId) return 'outgoing';
      return 'incoming';
    },
    enabled: !!targetUserId,
  });
}
```

---

### 10. useSearchUsers.ts (двухсекционный поиск)

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { UserWithFriendship, FriendshipStatus } from '../model/types';

export function useSearchUsers(query: string) {
  return useQuery({
    queryKey: ['searchUsers', query],
    queryFn: async (): Promise<{
      friends: UserWithFriendship[];
      globalResults: UserWithFriendship[];
    }> => {
      if (!query.trim()) {
        return { friends: [], globalResults: [] };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const currentUserId = user.id;

      // ===== СЕКЦИЯ 1: Поиск среди друзей =====
      const { data: friendshipsData } = await supabase
        .from('friendships')
        .select('*, user:user_id(*), friend:friend_id(*)')
        .or(`user_id.eq.${currentUserId},friend_id.eq.${currentUserId}`)
        .eq('status', 'accepted');

      const friends = (friendshipsData || [])
        .map(item => {
          const otherUser = item.user_id === currentUserId ? item.friend : item.user;
          return { ...otherUser, friendshipStatus: 'friends' as FriendshipStatus };
        })
        .filter(u => u.display_name.toLowerCase().includes(query.toLowerCase()));

      // ===== СЕКЦИЯ 2: Глобальный поиск =====
      
      // 1. Получить ID всех друзей
      const friendIds = (friendshipsData || []).map(item => 
        item.user_id === currentUserId ? item.friend_id : item.user_id
      );

      // 2. Поиск пользователей (исключая себя и друзей)
      let usersQuery = supabase
        .from('users')
        .select('*')
        .ilike('display_name', `%${query}%`)
        .neq('id', currentUserId);

      // Добавить исключение друзей только если они есть
      if (friendIds.length > 0) {
        usersQuery = usersQuery.not('id', 'in', `(${friendIds.join(',')})`);
      }

      const { data: users } = await usersQuery
        .order('created_at', { ascending: false })
        .limit(20);

      if (!users || users.length === 0) {
        return { friends, globalResults: [] };
      }

      // 3. Получить статусы через batch функцию
      const userIds = users.map(u => u.id);
      const { data: statuses } = await supabase.rpc('get_friendship_statuses', {
        p_current_user: currentUserId,
        p_target_users: userIds
      });

      // 4. Создать Map для быстрого поиска
      const statusMap = new Map<string, FriendshipStatus>();
      statuses?.forEach(s => {
        if (s.status === 'accepted') {
          statusMap.set(s.target_user_id, 'friends');
        } else if (s.requested_by === currentUserId) {
          statusMap.set(s.target_user_id, 'outgoing');
        } else {
          statusMap.set(s.target_user_id, 'incoming');
        }
      });

      // 5. Добавить статусы к пользователям
      const usersWithStatus = users.map(user => ({
        ...user,
        friendshipStatus: statusMap.get(user.id) ?? 'none'
      }));

      // 6. Сортировать по приоритету
      usersWithStatus.sort((a, b) => {
        const priority = { incoming: 1, outgoing: 2, none: 3 };
        return priority[a.friendshipStatus] - priority[b.friendshipStatus];
      });

      return { friends, globalResults: usersWithStatus };
    },
    enabled: query.trim().length > 0,
  });
}
```

---

## 📦 Экспорт (entities/friend/api/index.ts)

```typescript
export { useSendFriendRequest } from './useSendFriendRequest';
export { useAcceptFriendRequest } from './useAcceptFriendRequest';
export { useCancelFriendRequest } from './useCancelFriendRequest';
export { useRejectFriendRequest } from './useRejectFriendRequest';
export { useDeleteFriend } from './useDeleteFriend';
export { useMyFriends } from './useMyFriends';
export { useIncomingRequests } from './useIncomingRequests';
export { useOutgoingRequests } from './useOutgoingRequests';
export { useFriendshipStatus } from './useFriendshipStatus';
export { useSearchUsers } from './useSearchUsers';
```

---

## ✅ Готово к использованию!

Все хуки типизированы, обрабатывают ошибки rate limiting, и инвалидируют кэш React Query.