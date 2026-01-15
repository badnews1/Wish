# TODO: Функционал друзей

## 1. База данных (Supabase)

### 1.1 Создать миграцию для таблицы friendships
- [ ] Создать файл миграции `YYYYMMDD_create_friendships_table.sql`
- [ ] Поля:
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key -> auth.users)
  - `friend_id` (uuid, foreign key -> auth.users)
  - `status` (enum: 'pending', 'accepted', 'rejected')
  - `created_at` (timestamp)
  - `updated_at` (timestamp)
- [ ] Индексы:
  - На `user_id`
  - На `friend_id`
  - Составной на `user_id, friend_id` (unique)
- [ ] Constraint: нельзя добавить самого себя в друзья

### 1.2 Создать RLS политики
- [ ] SELECT: видеть записи где `user_id = auth.uid()` или `friend_id = auth.uid()`
- [ ] INSERT: создавать записи где `user_id = auth.uid()`
- [ ] UPDATE: обновлять записи где `friend_id = auth.uid()` (для принятия/отклонения)
- [ ] DELETE: удалять записи где `user_id = auth.uid()` или `friend_id = auth.uid()`

### 1.3 Обновить типы базы данных
- [ ] Запустить `supabase gen types typescript`
- [ ] Обновить `shared/api/database.types.ts`

## 2. Entities

### 2.1 entities/friendship/
- [ ] Создать `model/types.ts`:
  - `Friendship`
  - `FriendshipStatus`
  - `FriendWithDetails` (объединение friendship + user data)
- [ ] Создать `api/useFriendships.ts`:
  - `useMyFriends()` - список принятых друзей
  - `usePendingRequests()` - входящие запросы
  - `useSendFriendRequest()` - отправить запрос
  - `useAcceptFriendRequest()` - принять запрос
  - `useRejectFriendRequest()` - отклонить запрос
  - `useRemoveFriend()` - удалить из друзей
- [ ] Создать `ui/FriendCard.tsx` - карточка друга/запроса
- [ ] Создать `index.ts` - публичный API

### 2.2 entities/user/ (расширение)
- [ ] Создать `api/useSearchUsers.ts` - поиск пользователей по никнейму (для добавления в друзья)
- [ ] Создать `ui/UserSearchCard.tsx` - карточка найденного пользователя
- [ ] Обновить `index.ts`

### 2.3 entities/friendship/ (дополнение для поиска)
- [ ] Добавить `lib/filterFriends.ts` - клиентская фильтрация друзей по имени/фамилии
- [ ] Обновить `api/useFriendships.ts`:
  - `useMyFriends()` должен возвращать полные данные пользователя (имя, фамилию)

## 3. Features

### 3.1 features/add-friend/
- [ ] Создать `ui/AddFriendButton.tsx` - кнопка добавления в друзья
- [ ] Логика отправки запроса с обработкой ошибок
- [ ] Toast уведомления
- [ ] Создать `index.ts`

### 3.2 features/manage-friend-request/
- [ ] Создать `ui/FriendRequestActions.tsx` - кнопки принять/отклонить
- [ ] Логика обработки запроса
- [ ] Toast уведомления
- [ ] Создать `index.ts`

### 3.3 features/remove-friend/
- [ ] Создать `ui/RemoveFriendButton.tsx` - удаление из друзей
- [ ] Модалка подтверждения
- [ ] Toast уведомления
- [ ] Создать `index.ts`

## 4. Widgets

### 4.1 widgets/friends-list/
- [ ] Создать `ui/FriendsList.tsx` - список друзей с использованием FriendCard
- [ ] Добавить поисковую строку для фильтрации своих друзей по имени/фамилии
- [ ] Локальная фильтрация списка друзей (без запросов к БД)
- [ ] Empty state когда нет друзей
- [ ] Empty state когда поиск не дал результатов
- [ ] Скелетоны загрузки
- [ ] Создать `index.ts`

### 4.2 widgets/friend-requests-list/
- [ ] Создать `ui/FriendRequestsList.tsx` - список входящих запросов
- [ ] Empty state когда нет запросов
- [ ] Бейдж с количеством новых запросов
- [ ] Создать `index.ts`

### 4.3 widgets/user-search/
- [ ] Создать `ui/UserSearch.tsx` - поисковая строка с результатами
- [ ] Поиск по никнейму для поиска новых друзей
- [ ] Debounce для поиска (300-500ms)
- [ ] Empty state для пустого результата
- [ ] Скелетоны загрузки
- [ ] Создать `index.ts`

## 5. Pages

### 5.1 pages/community/
- [ ] Обновить `ui/CommunityPage.tsx`:
  - Добавить поисковую строку для новых друзей (UserSearch widget) - по никнейму
  - Добавить табы: "Друзья" / "Запросы"
  - Интегрировать FriendsList widget (со своей поисковой строкой по имени/фамилии)
  - Интегрировать FriendRequestsList widget
  - Обработка переключения табов
- [ ] Создать `config/tabs.ts` - конфигурация табов

## 6. Локализация

### 6.1 shared/config/i18n/
- [ ] Добавить ключи для сообщества:
  - Поиск новых друзей: placeholder "Найти по никнейму", empty state
  - Поиск своих друзей: placeholder "Поиск по имени", empty state
  - Табы: "Друзья", "Запросы"
  - Кнопки: "Добавить", "Принять", "Отклонить", "Удалить"
  - Toast сообщения
  - Empty states

### 6.2 entities/friendship/config/i18n/
- [ ] Специфичные ключи для friendship entity
- [ ] Статусы запросов

## 7. Тестирование функционала
- [ ] Поиск новых пользователей по никнейму работает
- [ ] Фильтрация своих друзей по имени/фамилии работает
- [ ] Отправка запроса в друзья
- [ ] Принятие запроса
- [ ] Отклонение запроса
- [ ] Удаление из друзей
- [ ] RLS политики работают корректно
- [ ] Нельзя добавить самого себя
- [ ] Нельзя отправить повторный запрос
- [ ] UI корректно обновляется после действий

## 8. Дополнительно (опционально)
- [ ] Добавить счетчик новых запросов на иконку таба "Сообщество"
- [ ] Добавить возможность отменить отправленный запрос
- [ ] История отклоненных запросов
- [ ] Блокировка пользователей

## Порядок выполнения:
1. База данных (1.1 → 1.2 → 1.3)
2. Entities (2.1 → 2.2 → 2.3)
3. Features (3.1 → 3.2 → 3.3)
4. Widgets (4.1 → 4.2 → 4.3)
5. Pages (5.1)
6. Локализация (6.1 → 6.2)
7. Тестирование (7)