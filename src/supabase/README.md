# Supabase Integration

Этот проект использует Supabase в качестве backend для хранения данных, аутентификации и управления файлами.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install @supabase/supabase-js @tanstack/react-query
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Где найти эти значения:**
1. Откройте [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Перейдите в Settings → API
4. Скопируйте `Project URL` и `anon public` ключ

### 3. Применение миграций

#### Вариант A: Через Supabase Dashboard (рекомендуется для начала)

1. Откройте Supabase Dashboard
2. Перейдите в SQL Editor
3. Последовательно выполните миграции из папки `/supabase/migrations/`:
   - `20250113_create_profiles_table.sql`
   - `20250113_create_wishlists_table.sql`
   - `20250113_create_wishlist_items_table.sql`

#### Вариант B: Через Supabase CLI

```bash
# Установка CLI
npm install -g supabase

# Инициализация
supabase init

# Связь с проектом
supabase link --project-ref your-project-ref

# Применение миграций
supabase db push
```

### 4. Генерация типов

После применения миграций обновите TypeScript типы:

```bash
supabase gen types typescript --project-ref your-project-ref > shared/api/database.types.ts
```

## 📁 Структура

```
/shared/api/
  ├── supabase.ts          # Singleton клиент Supabase
  ├── database.types.ts    # Автогенерированные типы БД
  └── index.ts             # Публичный экспорт

/supabase/migrations/      # SQL миграции
  ├── 20250113_create_profiles_table.sql
  ├── 20250113_create_wishlists_table.sql
  └── 20250113_create_wishlist_items_table.sql

/entities/*/api/           # React Query хуки для работы с данными
```

## 🔐 Безопасность (RLS)

Все таблицы защищены Row Level Security (RLS) политиками:

- **profiles** - все могут читать, только владелец может изменять
- **wishlists** - публичные видны всем, приватные только владельцу
- **wishlist_items** - видны если вишлист доступен пользователю

## 🎯 Использование в коде

### Пример: Загрузка вишлистов

```tsx
import { useWishlistsQuery } from '@/entities/wishlist';

function MyComponent() {
  const { data: wishlists, isLoading, error } = useWishlistsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки</div>;

  return (
    <div>
      {wishlists?.map(wishlist => (
        <div key={wishlist.id}>{wishlist.title}</div>
      ))}
    </div>
  );
}
```

### Пример: Прямой запрос к Supabase

```tsx
import { supabase } from '@/shared/api';

async function fetchWishlists() {
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('privacy', 'public');

  if (error) throw error;
  return data;
}
```

## 📝 Создание новых хуков

Следуйте паттерну в `entities/*/api/`:

```tsx
// entities/wishlist/api/useCreateWishlist.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner@2.0.3';
import { supabase } from '@/shared/api';

export function useCreateWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlist: WishlistInput) => {
      const { data, error } = await supabase
        .from('wishlists')
        .insert([wishlist])
        .select()
        .single();

      if (error) {
        toast.error('Ошибка создания вишлиста');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Инвалидация кеша для обновления списка
      queryClient.invalidateQueries({ queryKey: ['wishlists'] });
      toast.success('Вишлист создан!');
    },
  });
}
```

## 🔄 React Query настройка

React Query уже настроен в приложении. Для добавления кастомных настроек измените провайдер в `/app/providers/`.

## ⚠️ Важно

- Все API ошибки обрабатываются в хуках (`api/`) с показом toast уведомлений
- Не выполняйте мутации напрямую в компонентах - создавайте хуки
- Всегда обрабатывайте `{ data, error }` от Supabase запросов
- PGRST116 (no rows) - не критичная ошибка, проверяйте `data?.length`

## 🛠️ Troubleshooting

### Ошибка "table does not exist"
→ Примените миграции через Dashboard или CLI

### Ошибка "row-level security policy violation"
→ Проверьте что RLS политики применены (см. миграции)

### Пустые результаты для приватных данных
→ Проверьте что пользователь авторизован: `auth.uid()` должен быть установлен

### TypeScript ошибки типов
→ Обновите типы: `supabase gen types typescript > shared/api/database.types.ts`

## 📚 Полезные ссылки

- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
