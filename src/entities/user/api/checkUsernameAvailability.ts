import { supabase } from '@/shared/api/supabase';

/**
 * Проверяет доступность username
 * 
 * @param username - Никнейм для проверки
 * @param currentUserId - ID текущего пользователя (чтобы исключить его из проверки)
 * @returns true если username доступен, false если занят
 */
export async function checkUsernameAvailability(
  username: string, 
  currentUserId?: string
): Promise<boolean> {
  // Базовая валидация формата
  if (!username || username.length < 2 || username.length > 20) {
    return false;
  }

  // Проверяем есть ли пользователь с таким username
  let query = supabase
    .from('profiles')
    .select('id')
    .eq('username', username.toLowerCase());

  // Если проверяем для текущего пользователя - исключаем его
  if (currentUserId) {
    query = query.neq('id', currentUserId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return false;
  }

  // Если data === null, значит username свободен
  return data === null;
}