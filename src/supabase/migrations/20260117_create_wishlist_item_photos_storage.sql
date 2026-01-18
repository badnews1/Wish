-- =====================================================
-- Миграция: Создание Storage bucket для фото желаний
-- Дата: 2026-01-17
-- Описание: Создаёт публичный bucket для хранения фото желаний (wishlist items)
--           с RLS политиками для контроля доступа
-- =====================================================

-- ============================================
-- 1. Создание bucket для фото желаний
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wishlist-item-photos',
  'wishlist-item-photos',
  true, -- публичный доступ для чтения (для шаринга вишлистов)
  5242880, -- 5MB в байтах
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. RLS политики для storage.objects
-- ============================================

-- Политика: Все могут читать фото желаний (для публичных вишлистов)
CREATE POLICY "Anyone can view wishlist item photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'wishlist-item-photos');

-- Политика: Владелец вишлиста может загружать фото желания
-- Формат файла: {wishlist_item_id}.jpg
CREATE POLICY "Users can upload photo for their wishlist item"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wishlist-item-photos'
  AND auth.uid()::text IN (
    SELECT w.user_id::text 
    FROM public.wishlist_items wi
    JOIN public.wishlists w ON wi.wishlist_id = w.id
    WHERE wi.id::text = split_part(name, '.', 1)
  )
);

-- Политика: Владелец вишлиста может обновлять фото желания
CREATE POLICY "Users can update their wishlist item photo"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'wishlist-item-photos'
  AND auth.uid()::text IN (
    SELECT w.user_id::text 
    FROM public.wishlist_items wi
    JOIN public.wishlists w ON wi.wishlist_id = w.id
    WHERE wi.id::text = split_part(name, '.', 1)
  )
);

-- Политика: Владелец вишлиста может удалять фото желания
CREATE POLICY "Users can delete their wishlist item photo"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'wishlist-item-photos'
  AND auth.uid()::text IN (
    SELECT w.user_id::text 
    FROM public.wishlist_items wi
    JOIN public.wishlists w ON wi.wishlist_id = w.id
    WHERE wi.id::text = split_part(name, '.', 1)
  )
);

-- ============================================
-- DOWN MIGRATION (откат)
-- ============================================
-- Раскомментируйте и выполните для отката миграции

/*
-- Удаление политик
DROP POLICY IF EXISTS "Anyone can view wishlist item photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload photo for their wishlist item" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their wishlist item photo" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their wishlist item photo" ON storage.objects;

-- Удаление bucket
DELETE FROM storage.buckets WHERE id = 'wishlist-item-photos';

-- ВНИМАНИЕ: Это также удалит все загруженные фото желаний!
-- Используйте с осторожностью.
*/
