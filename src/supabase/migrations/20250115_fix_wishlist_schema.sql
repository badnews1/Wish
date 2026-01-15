-- Миграция: Исправление схемы вишлистов под TypeScript типы
-- Дата: 2025-01-15

-- ============================================================================
-- UP MIGRATION
-- ============================================================================

-- 1. ОБНОВЛЕНИЕ ТАБЛИЦЫ wishlists
-- ============================================================================

-- Изменяем тип privacy на корректный enum
ALTER TABLE public.wishlists 
  DROP CONSTRAINT IF EXISTS wishlists_privacy_check;

ALTER TABLE public.wishlists 
  ADD CONSTRAINT wishlists_privacy_check 
  CHECK (privacy IN ('public', 'friends', 'selected', 'private'));

-- Изменяем booking_visibility с boolean на text enum
ALTER TABLE public.wishlists 
  DROP COLUMN IF EXISTS booking_visibility CASCADE;

ALTER TABLE public.wishlists 
  ADD COLUMN booking_visibility text NOT NULL DEFAULT 'hide_all' 
  CHECK (booking_visibility IN ('show_names', 'hide_names', 'hide_all'));

-- Добавляем недостающие поля
ALTER TABLE public.wishlists 
  ADD COLUMN IF NOT EXISTS allow_group_gifting boolean DEFAULT false NOT NULL;

ALTER TABLE public.wishlists 
  ADD COLUMN IF NOT EXISTS favorite_count integer DEFAULT 0 NOT NULL;

-- Переименовываем icon_id если нужно (оставляем icon как есть для emoji)
-- ALTER TABLE public.wishlists RENAME COLUMN icon TO icon_id;
-- Или добавим icon_id отдельно если icon это emoji
ALTER TABLE public.wishlists 
  ADD COLUMN IF NOT EXISTS icon_id text;

COMMENT ON COLUMN public.wishlists.icon IS 'Emoji иконка вишлиста';
COMMENT ON COLUMN public.wishlists.icon_id IS 'ID иконки из справочника WISHLIST_ICONS';
COMMENT ON COLUMN public.wishlists.allow_group_gifting IS 'Разрешён ли групповой подарок';
COMMENT ON COLUMN public.wishlists.favorite_count IS 'Количество добавлений в избранное';

-- 2. ОБНОВЛЕНИЕ ТАБЛИЦЫ wishlist_items
-- ============================================================================

-- Добавляем поле purchased_by (кто забронировал/купил подарок)
ALTER TABLE public.wishlist_items 
  ADD COLUMN IF NOT EXISTS purchased_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Добавляем gift_tag (метка подарка)
ALTER TABLE public.wishlist_items 
  ADD COLUMN IF NOT EXISTS gift_tag text DEFAULT 'none' 
  CHECK (gift_tag IN ('none', 'really-want', 'would-be-nice', 'thinking', 'buy-myself'));

-- Добавляем purchase_location (адрес физического магазина)
ALTER TABLE public.wishlist_items 
  ADD COLUMN IF NOT EXISTS purchase_location text;

COMMENT ON COLUMN public.wishlist_items.purchased_by IS 'ID пользователя который забронировал/купил подарок';
COMMENT ON COLUMN public.wishlist_items.gift_tag IS 'Метка приоритета подарка';
COMMENT ON COLUMN public.wishlist_items.purchase_location IS 'Адрес физического магазина для покупки';

-- 3. СОЗДАНИЕ JUNCTION TABLE для many-to-many связи
-- ============================================================================
-- Одно желание может быть в нескольких вишлистах

CREATE TABLE IF NOT EXISTS public.wishlist_item_relations (
  wishlist_id uuid NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.wishlist_items(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  PRIMARY KEY (wishlist_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_item_relations_wishlist 
  ON public.wishlist_item_relations(wishlist_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_item_relations_item 
  ON public.wishlist_item_relations(item_id);

COMMENT ON TABLE public.wishlist_item_relations IS 'Связь many-to-many между вишлистами и желаниями';

-- Включаем RLS для junction table
ALTER TABLE public.wishlist_item_relations ENABLE ROW LEVEL SECURITY;

-- Политики для junction table (читать могут те кто может читать вишлист)
CREATE POLICY "Wishlist item relations viewable if wishlist is viewable"
  ON public.wishlist_item_relations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_item_relations.wishlist_id
        AND (wishlists.privacy = 'public' OR wishlists.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage relations in own wishlists"
  ON public.wishlist_item_relations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_item_relations.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_item_relations.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

-- 4. МИГРАЦИЯ ДАННЫХ (если есть существующие записи)
-- ============================================================================

-- Заполняем junction table существующими связями
INSERT INTO public.wishlist_item_relations (wishlist_id, item_id)
SELECT wishlist_id, id 
FROM public.wishlist_items
ON CONFLICT DO NOTHING;

-- Теперь можем удалить старое поле wishlist_id из wishlist_items
-- НО ПОКА ОСТАВИМ для обратной совместимости
-- ALTER TABLE public.wishlist_items DROP COLUMN wishlist_id;

COMMENT ON COLUMN public.wishlist_items.wishlist_id IS 'DEPRECATED: Используйте wishlist_item_relations. Оставлено для совместимости';

-- ============================================================================
-- DOWN MIGRATION
-- ============================================================================

-- Для отката миграции (выполняется при rollback):
/*
DROP TABLE IF EXISTS public.wishlist_item_relations;

ALTER TABLE public.wishlists DROP COLUMN IF EXISTS icon_id;
ALTER TABLE public.wishlists DROP COLUMN IF EXISTS allow_group_gifting;
ALTER TABLE public.wishlists DROP COLUMN IF EXISTS favorite_count;

ALTER TABLE public.wishlists 
  DROP CONSTRAINT IF EXISTS wishlists_privacy_check;
ALTER TABLE public.wishlists 
  ADD CONSTRAINT wishlists_privacy_check 
  CHECK (privacy IN ('public', 'private', 'link'));

ALTER TABLE public.wishlists DROP COLUMN IF EXISTS booking_visibility;
ALTER TABLE public.wishlists 
  ADD COLUMN booking_visibility boolean DEFAULT false NOT NULL;

ALTER TABLE public.wishlist_items DROP COLUMN IF EXISTS purchased_by;
ALTER TABLE public.wishlist_items DROP COLUMN IF EXISTS gift_tag;
ALTER TABLE public.wishlist_items DROP COLUMN IF EXISTS purchase_location;
*/
