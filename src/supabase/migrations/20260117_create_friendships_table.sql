-- ============================================
-- МИГРАЦИЯ: Базовая таблица friendships
-- Дата: 2026-01-17
-- Описание: Создаёт базовую таблицу для системы друзей
-- ============================================

-- ============================================
-- 1. ENUM ДЛЯ СТАТУСОВ ДРУЖБЫ
-- ============================================

-- Создать ENUM тип для статусов (если ещё не создан)
DO $$ BEGIN
  CREATE TYPE friendship_status AS ENUM ('pending', 'accepted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. СОЗДАНИЕ ТАБЛИЦЫ FRIENDSHIPS
-- ============================================

CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Уникальная пара пользователей (чтобы не было дублей)
  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id),
  
  -- Пользователь не может добавить себя в друзья
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id)
);

-- Комментарии
COMMENT ON TABLE public.friendships IS 'Дружеские связи между пользователями';
COMMENT ON COLUMN public.friendships.user_id IS 'Пользователь который отправил запрос (или меньший ID в нормализованной паре)';
COMMENT ON COLUMN public.friendships.friend_id IS 'Пользователь которому отправили запрос (или больший ID в нормализованной паре)';
COMMENT ON COLUMN public.friendships.status IS 'Статус дружбы: pending (ожидает), accepted (принят)';

-- ============================================
-- 3. ИНДЕКСЫ
-- ============================================

-- Базовые индексы для поиска
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON public.friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON public.friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON public.friendships(status);

-- ============================================
-- 4. ТРИГГЕРЫ
-- ============================================

-- Удалить старый триггер если существует
DROP TRIGGER IF EXISTS update_friendships_updated_at ON public.friendships;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. RLS ПОЛИТИКИ
-- ============================================

-- Включаем RLS
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;

-- Удалить старые политики если существуют
DROP POLICY IF EXISTS "Users can view their friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can send friend requests" ON public.friendships;
DROP POLICY IF EXISTS "Users can update their friendships" ON public.friendships;
DROP POLICY IF EXISTS "Users can delete their friendships" ON public.friendships;

-- Политика: Читать могут участники дружбы
CREATE POLICY "Users can view their friendships"
  ON public.friendships
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.uid() = friend_id
  );

-- Политика: Создавать запросы в друзья могут только авторизованные пользователи
CREATE POLICY "Users can send friend requests"
  ON public.friendships
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- Политика: Обновлять могут оба участника (чтобы принять/отклонить запрос)
CREATE POLICY "Users can update their friendships"
  ON public.friendships
  FOR UPDATE
  USING (
    auth.uid() = user_id 
    OR auth.uid() = friend_id
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.uid() = friend_id
  );

-- Политика: Удалять могут оба участника
CREATE POLICY "Users can delete their friendships"
  ON public.friendships
  FOR DELETE
  USING (
    auth.uid() = user_id 
    OR auth.uid() = friend_id
  );

-- ============================================
-- DOWN MIGRATION
-- ============================================

-- Для отката миграции (выполняется при rollback):
-- DROP TRIGGER IF EXISTS update_friendships_updated_at ON public.friendships;
-- DROP TABLE IF EXISTS public.friendships;
-- DROP TYPE IF EXISTS friendship_status;