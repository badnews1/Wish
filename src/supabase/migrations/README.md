# Миграции Supabase

Этот каталог содержит SQL миграции для базы данных Supabase.

## Применение миграций

### Через Supabase CLI (локальная разработка):

```bash
# Инициализация проекта (если еще не сделано)
supabase init

# Линк к проекту
supabase link --project-ref <your-project-ref>

# Применить все миграции
supabase db push

# Или применить конкретную миграцию
supabase db push --include-all
```

### Через Supabase Dashboard:

1. Откройте Supabase Dashboard
2. Перейдите в раздел "SQL Editor"
3. Скопируйте содержимое миграции
4. Выполните SQL запрос

## Генерация TypeScript типов

После применения миграций обновите TypeScript типы:

```bash
supabase gen types typescript --local > shared/api/database.types.ts
```

Или для продакшн базы:

```bash
supabase gen types typescript --project-ref <your-project-ref> > shared/api/database.types.ts
```

## Структура миграций

Каждая миграция содержит:
- **UP MIGRATION** - применение изменений
- **RLS POLICIES** - политики безопасности
- **DOWN MIGRATION** - откат изменений (в комментариях)

## Порядок применения

1. `20250113_create_profiles_table.sql` - таблица профилей
2. `20250113_create_wishlists_table.sql` - таблица вишлистов
3. `20250113_create_wishlist_items_table.sql` - таблица элементов вишлистов
4. `20250113_create_avatars_storage.sql` - Storage bucket для аватаров

## Важно

- ⚠️ НЕ редактируйте существующие миграции
- ✅ Для изменений создавайте новые миграции
- ✅ Всегда указывайте `down` миграцию для отката