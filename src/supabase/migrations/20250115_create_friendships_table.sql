-- Миграция: Создание таблицы friendships для системы друзей
-- Дата: 2025-01-15

-- Создание enum для статуса дружбы
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'rejected');

-- Создание таблицы friendships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint: нельзя добавить самого себя в друзья
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id),
  
  -- Уникальная пара user_id + friend_id (чтобы не было дублей)
  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_friendships_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_friendships_updated_at
  BEFORE UPDATE ON friendships
  FOR EACH ROW
  EXECUTE FUNCTION update_friendships_updated_at();

-- RLS: Включаем Row Level Security
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- RLS Политика: SELECT - видеть записи где я user_id или friend_id
CREATE POLICY "Users can view their friendships"
  ON friendships
  FOR SELECT
  USING (
    auth.uid() = user_id OR auth.uid() = friend_id
  );

-- RLS Политика: INSERT - создавать записи только от своего имени (user_id)
CREATE POLICY "Users can send friend requests"
  ON friendships
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
  );

-- RLS Политика: UPDATE - обновлять только если я получатель (friend_id)
-- Это позволяет принимать/отклонять входящие запросы
CREATE POLICY "Users can respond to friend requests"
  ON friendships
  FOR UPDATE
  USING (
    auth.uid() = friend_id
  )
  WITH CHECK (
    auth.uid() = friend_id
  );

-- RLS Политика: DELETE - удалять записи где я user_id или friend_id
-- Это позволяет удалять друзей или отменять отправленные запросы
CREATE POLICY "Users can remove friendships"
  ON friendships
  FOR DELETE
  USING (
    auth.uid() = user_id OR auth.uid() = friend_id
  );

-- Комментарии к таблице
COMMENT ON TABLE friendships IS 'Таблица для хранения связей между пользователями (система друзей)';
COMMENT ON COLUMN friendships.user_id IS 'ID пользователя, который отправил запрос в друзья';
COMMENT ON COLUMN friendships.friend_id IS 'ID пользователя, которому отправлен запрос';
COMMENT ON COLUMN friendships.status IS 'Статус дружбы: pending (ожидание), accepted (принято), rejected (отклонено)';
