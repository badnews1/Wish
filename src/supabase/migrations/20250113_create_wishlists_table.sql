-- Миграция: Создание таблицы вишлистов
-- Дата: 2025-01-13

-- ============================================================================
-- UP MIGRATION
-- ============================================================================

-- Создаём таблицу вишлистов
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  cover_image text,
  icon text,
  privacy text NOT NULL DEFAULT 'private' CHECK (privacy IN ('public', 'private', 'link')),
  event_date timestamptz,
  booking_visibility boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_privacy ON public.wishlists(privacy);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON public.wishlists(created_at DESC);

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_wishlists_updated_at
  BEFORE UPDATE ON public.wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Включаем RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Политика: Читать могут все если privacy = 'public' ИЛИ владелец
CREATE POLICY "Wishlists are viewable by owner or if public"
  ON public.wishlists
  FOR SELECT
  USING (
    privacy = 'public' 
    OR auth.uid() = user_id
  );

-- Политика: Создавать могут только авторизованные пользователи
CREATE POLICY "Users can create own wishlists"
  ON public.wishlists
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Политика: Обновлять могут только владельцы
CREATE POLICY "Users can update own wishlists"
  ON public.wishlists
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Политика: Удалять могут только владельцы
CREATE POLICY "Users can delete own wishlists"
  ON public.wishlists
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- DOWN MIGRATION
-- ============================================================================

-- Для отката миграции (выполняется при rollback):
-- DROP TRIGGER IF EXISTS update_wishlists_updated_at ON public.wishlists;
-- DROP TABLE IF EXISTS public.wishlists;
