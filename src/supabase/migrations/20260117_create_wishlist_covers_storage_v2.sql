-- =====================================================
-- Миграция: Создание Storage bucket для обложек вишлистов (ИСПРАВЛЕННАЯ)
-- Дата: 2026-01-17
-- Описание: Создаёт публичный bucket для хранения обложек вишлистов
--           с RLS политиками для контроля доступа
-- =====================================================

-- ============================================
-- 1. Создание bucket для обложек вишлистов
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wishlist-covers',
  'wishlist-covers',
  true, -- публичный доступ для чтения (для шаринга вишлистов)
  5242880, -- 5MB в байтах
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. RLS политики для storage.objects
-- ============================================

-- Политика: Все могут читать обложки (для публичных вишлистов)
CREATE POLICY "Anyone can view wishlist covers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wishlist-covers');

-- Политика: Владелец вишлиста может загружать обложку
-- Формат файла: {wishlist_id}.jpg
CREATE POLICY "Users can upload cover for their wishlist"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wishlist-covers'
  AND auth.uid()::text IN (
    SELECT user_id::text 
    FROM public.wishlists 
    WHERE id::text = split_part(name, '.', 1)
  )
);

-- Политика: Владелец вишлиста может обновлять обложку
CREATE POLICY "Users can update their wishlist cover"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'wishlist-covers'
  AND auth.uid()::text IN (
    SELECT user_id::text 
    FROM public.wishlists 
    WHERE id::text = split_part(name, '.', 1)
  )
);

-- Политика: Владелец вишлиста может удалять обложку
CREATE POLICY "Users can delete their wishlist cover"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'wishlist-covers'
  AND auth.uid()::text IN (
    SELECT user_id::text 
    FROM public.wishlists 
    WHERE id::text = split_part(name, '.', 1)
  )
);

-- ============================================
-- DOWN MIGRATION (откат)
-- ============================================
-- Раскомментируйте и выполните для отката миграции

/*
-- Удаление политик
DROP POLICY IF EXISTS "Anyone can view wishlist covers" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload cover for their wishlist" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their wishlist cover" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their wishlist cover" ON storage.objects;

-- Удаление bucket
DELETE FROM storage.buckets WHERE id = 'wishlist-covers';

-- ВНИМАНИЕ: Это также удалит все загруженные обложки!
-- Используйте с осторожностью.
*/
