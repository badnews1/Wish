# UI Flows и компоненты

**Путь:** `entities/friend/ui/`, `pages/friends/`, `widgets/`

---

## 🎨 Основные UI сценарии

### 1. Кнопка действия (динамическая по статусу)

**Компонент:** `entities/friend/ui/FriendActionButton.tsx`

```typescript
import { useFriendshipStatus } from '../api';
import { 
  useSendFriendRequest, 
  useAcceptFriendRequest, 
  useCancelFriendRequest,
  useRejectFriendRequest,
  useDeleteFriend 
} from '../api';

interface FriendActionButtonProps {
  userId: string;
  userName: string;
}

export function FriendActionButton({ userId, userName }: FriendActionButtonProps) {
  const { data: status, isLoading } = useFriendshipStatus(userId);
  
  const sendRequest = useSendFriendRequest();
  const acceptRequest = useAcceptFriendRequest();
  const cancelRequest = useCancelFriendRequest();
  const rejectRequest = useRejectFriendRequest();
  const deleteFriend = useDeleteFriend();

  if (isLoading) return <Skeleton className="h-9 w-32" />;

  switch (status) {
    case 'none':
      return (
        <Button 
          onClick={() => sendRequest.mutate(userId)}
          disabled={sendRequest.isPending}
        >
          {sendRequest.isPending ? 'Отправка...' : 'Добавить в друзья'}
        </Button>
      );

    case 'outgoing':
      return (
        <Button 
          variant="outline"
          onClick={() => cancelRequest.mutate(userId)}
          disabled={cancelRequest.isPending}
        >
          {cancelRequest.isPending ? 'Отмена...' : 'Отменить запрос'}
        </Button>
      );

    case 'incoming':
      return (
        <div className="flex gap-2">
          <Button 
            onClick={() => acceptRequest.mutate(userId)}
            disabled={acceptRequest.isPending}
          >
            {acceptRequest.isPending ? 'Принятие...' : 'Принять'}
          </Button>
          <Button 
            variant="outline"
            onClick={() => rejectRequest.mutate(userId)}
            disabled={rejectRequest.isPending}
          >
            Отклонить
          </Button>
        </div>
      );

    case 'friends':
      return (
        <Button 
          variant="destructive"
          onClick={() => deleteFriend.mutate({ userId, userName })}
          disabled={deleteFriend.isPending}
        >
          {deleteFriend.isPending ? 'Удаление...' : 'Удалить из друзей'}
        </Button>
      );

    default:
      return null;
  }
}
```

**Использование:**
```tsx
<FriendActionButton userId={user.id} userName={user.display_name} />
```

---

### 2. Список друзей (с пагинацией)

**Компонент:** `pages/friends/ui/MyFriendsPage.tsx`

```typescript
import { useMyFriends } from '@/entities/friend/api';
import { UserCard } from '@/entities/user/ui/UserCard';
import { FriendActionButton } from '@/entities/friend/ui/FriendActionButton';

export function MyFriendsPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyFriends();

  const friends = data?.pages.flatMap(page => page.data) ?? [];
  const loadedCount = friends.length;
  const friendCount = hasNextPage ? `${loadedCount}+` : loadedCount;

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">У вас пока нет друзей</p>
        <Button onClick={() => router.push('/search')}>
          Найти друзей
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Друзья ({friendCount})
      </h1>

      <div className="space-y-2">
        {friends.map(friend => (
          <UserCard 
            key={friend.id}
            user={friend}
            action={<FriendActionButton userId={friend.id} userName={friend.display_name} />}
          />
        ))}
      </div>

      {hasNextPage && (
        <Button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full mt-4"
        >
          {isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
        </Button>
      )}
    </div>
  );
}
```

---

### 3. Входящие запросы

**Компонент:** `pages/friends/ui/IncomingRequestsPage.tsx`

```typescript
import { useIncomingRequests } from '@/entities/friend/api';
import { UserCard } from '@/entities/user/ui/UserCard';
import { FriendActionButton } from '@/entities/friend/ui/FriendActionButton';

export function IncomingRequestsPage() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useIncomingRequests();

  const requests = data?.pages.flatMap(page => page.data) ?? [];

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Нет входящих запросов</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Входящие запросы ({requests.length})
      </h1>

      <div className="space-y-2">
        {requests.map(user => (
          <UserCard 
            key={user.id}
            user={user}
            action={<FriendActionButton userId={user.id} userName={user.display_name} />}
          />
        ))}
      </div>

      {hasNextPage && (
        <Button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full mt-4"
        >
          {isFetchingNextPage ? 'Загрузка...' : 'Показать ещё'}
        </Button>
      )}
    </div>
  );
}
```

---

### 4. Двухсекционный поиск

**Компонент:** `pages/search/ui/SearchUsersPage.tsx`

```typescript
import { useState } from 'react';
import { useSearchUsers } from '@/entities/friend/api';
import { UserCard } from '@/entities/user/ui/UserCard';
import { FriendActionButton } from '@/entities/friend/ui/FriendActionButton';
import { Input } from '@/components/ui/input';

export function SearchUsersPage() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useSearchUsers(query);

  return (
    <div>
      <Input 
        placeholder="Поиск пользователей..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4"
      />

      {isLoading && <div>Поиск...</div>}

      {data && (
        <>
          {/* Секция 1: Мои друзья */}
          {data.friends.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Мои друзья</h2>
              <div className="space-y-2">
                {data.friends.map(friend => (
                  <UserCard 
                    key={friend.id}
                    user={friend}
                    action={<FriendActionButton userId={friend.id} userName={friend.display_name} />}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Секция 2: Глобальный поиск */}
          {data.globalResults.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Другие пользователи</h2>
              <div className="space-y-2">
                {data.globalResults.map(user => (
                  <UserCard 
                    key={user.id}
                    user={user}
                    action={<FriendActionButton userId={user.id} userName={user.display_name} />}
                    badge={
                      user.friendshipStatus === 'incoming' ? (
                        <Badge>Запрос в друзья</Badge>
                      ) : user.friendshipStatus === 'outgoing' ? (
                        <Badge variant="outline">Запрос отправлен</Badge>
                      ) : null
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {query && data.friends.length === 0 && data.globalResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Ничего не найдено</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

---

### 5. Профиль пользователя (с кнопкой действия)

**Компонент:** `pages/profile/ui/UserProfilePage.tsx`

```typescript
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { FriendActionButton } from '@/entities/friend/ui/FriendActionButton';

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, display_name, avatar_url, friends_count')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return <div>Пользователь не найден</div>;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Avatar>
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback>{user.display_name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{user.display_name}</h1>
          <p className="text-muted-foreground">
            {user.friends_count} {declension(user.friends_count, ['друг', 'друга', 'друзей'])}
          </p>
        </div>
      </div>

      {/* Кнопка действия */}
      <FriendActionButton 
        userId={user.id} 
        userName={user.display_name} 
      />
    </div>
  );
}
```

---

## 🔄 Обработка race conditions

Все race conditions обрабатываются на уровне хука `useSendFriendRequest`:

1. **Пытаемся INSERT** → если успешно, готово
2. **Ловим constraint error** → проверяем существующую запись
3. **Встречный запрос** → автоматически принимаем
4. **Уже отправлен** → показываем toast "Запрос уже отправлен"
5. **Уже друзья** → показываем toast "Вы уже друзья"

---

## 🚨 Обработка ошибок rate limiting

Все ошибки обрабатываются в mutations:

```typescript
if (error.message?.includes('DAILY_LIMIT')) {
  toast.error('Вы уже отправляли запрос этому пользователю 3 раза сегодня');
} else if (error.message?.includes('RATE_LIMIT')) {
  toast.error('Слишком частые действия. Попробуйте позже');
} else if (error.message?.includes('GLOBAL_LIMIT')) {
  toast.error('Слишком много действий за последний час');
} else {
  toast.error('Ошибка при выполнении действия');
}
```

---

## 📱 Pull-to-refresh (мобильная версия)

```typescript
import { useState } from 'react';

export function MyFriendsPage() {
  const [isPulling, setIsPulling] = useState(false);
  const { refetch } = useMyFriends();

  const handlePullToRefresh = async () => {
    setIsPulling(true);
    await refetch();
    setIsPulling(false);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => handlePullToRefresh()}
    >
      {isPulling && <div>Обновление...</div>}
      {/* Контент */}
    </div>
  );
}
```

---

## ✅ Готово к имплементации!

Все компоненты готовы к использованию, обрабатывают все edge cases и показывают понятные сообщения пользователю.
