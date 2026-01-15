-- Миграция: Создание таблицы элементов вишлистов (желаний)
-- Дата: 2025-01-13

-- ============================================================================
-- UP MIGRATION
-- ============================================================================

-- Создаём таблицу элементов вишлистов
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id uuid NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  product_url text,
  price numeric(10, 2),
  currency text DEFAULT 'RUB',
  priority integer DEFAULT 0 NOT NULL,
  is_purchased boolean DEFAULT false NOT NULL,
  tags text[],
  categories text[],
  order_index integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_order_index ON public.wishlist_items(wishlist_id, order_index);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_created_at ON public.wishlist_items(created_at DESC);

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_wishlist_items_updated_at
  BEFORE UPDATE ON public.wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Включаем RLS
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Политика: Читать могут те кто может читать сам вишлист
CREATE POLICY "Wishlist items viewable if wishlist is viewable"
  ON public.wishlist_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND (wishlists.privacy = 'public' OR wishlists.user_id = auth.uid())
    )
  );

-- Политика: Создавать могут только владельцы вишлиста
CREATE POLICY "Users can create items in own wishlists"
  ON public.wishlist_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

-- Политика: Обновлять могут только владельцы вишлиста
CREATE POLICY "Users can update items in own wishlists"
  ON public.wishlist_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

-- Политика: Удалять могут только владельцы вишлиста
CREATE POLICY "Users can delete items from own wishlists"
  ON public.wishlist_items
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = auth.uid()
    )
  );

-- ============================================================================
-- DOWN MIGRATION
-- ============================================================================

-- Для отката миграции (выполняется при rollback):
-- DROP TRIGGER IF EXISTS update_wishlist_items_updated_at ON public.wishlist_items;
-- DROP TABLE IF EXISTS public.wishlist_items;
