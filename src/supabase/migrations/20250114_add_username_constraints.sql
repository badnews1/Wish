-- Миграция: Добавление ограничений для username
-- Дата: 2025-01-14

-- ============================================================================
-- UP MIGRATION
-- ============================================================================

-- Добавляем ограничение на длину username (2-20 символов)
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_length_check 
  CHECK (char_length(username) >= 2 AND char_length(username) <= 20);

-- Добавляем ограничение на формат username (только латиница, цифры и подчеркивание)
ALTER TABLE public.profiles 
  ADD CONSTRAINT username_format_check 
  CHECK (username ~ '^[a-z0-9_]+$');

-- Для существующих пользователей без username генерируем случайные
-- (выполняется один раз при применении миграции)
DO $$
DECLARE
  profile_record RECORD;
  new_username text;
  is_unique boolean;
BEGIN
  FOR profile_record IN 
    SELECT id FROM public.profiles WHERE username IS NULL
  LOOP
    is_unique := false;
    WHILE NOT is_unique LOOP
      -- Генерируем username вида user1234
      new_username := 'user' || floor(random() * 100000)::text;
      
      -- Проверяем уникальность
      IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = new_username) THEN
        is_unique := true;
        UPDATE public.profiles SET username = new_username WHERE id = profile_record.id;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Теперь делаем username обязательным
ALTER TABLE public.profiles 
  ALTER COLUMN username SET NOT NULL;

-- ============================================================================
-- DOWN MIGRATION
-- ============================================================================

-- Для отката миграции (выполняется при rollback):
-- ALTER TABLE public.profiles ALTER COLUMN username DROP NOT NULL;
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS username_format_check;
-- ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS username_length_check;
