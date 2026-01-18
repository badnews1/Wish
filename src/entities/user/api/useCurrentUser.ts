// Хук для получения текущего пользователя
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { User } from '../model/types';

async function getCurrentUser(): Promise<User | null> {
  // Проверяем сессию
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session) {
    return null;
  }

  const authUser = sessionData.session.user;

  // Получаем профиль из БД
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (error || !profile) {
    return null;
  }

  return {
    id: profile.id,
    email: authUser.email || '', // email берем из auth.users
    name: profile.display_name || '', // имя из display_name
    username: profile.username || '', // никнейм из username
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    birth_date: profile.birth_date, // дата рождения
    created_at: profile.created_at,
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: false,
  });
}