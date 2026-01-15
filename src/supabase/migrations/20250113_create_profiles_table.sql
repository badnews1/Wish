-- Миграция: Создание таблицы профилей пользователей
-- Дата: 2025-01-13

-- ============================================================================
-- UP MIGRATION
-- ============================================================================

-- Создаём таблицу профилей (расширение auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Индекс для быстрого поиска по username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Включаем RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика: Все могут читать публичные профили
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Политика: Пользователи могут вставлять свой профиль
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Политика: Пользователи могут обновлять свой профиль
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Политика: Пользователи могут удалять свой профиль
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================================================
-- DOWN MIGRATION
-- ============================================================================

-- Для отката миграции (выполняется при rollback):
-- DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- DROP TABLE IF EXISTS public.profiles;
