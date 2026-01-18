import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { User } from '../model/types';

/**
 * Данные для обновления профиля
 */
export interface UpdateProfileData {
  name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  birth_date?: string; // Дата рождения в ISO формате (YYYY-MM-DD)
}

/**
 * Хук для обновления профиля пользователя
 * 
 * @returns Mutation для обновления профиля
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      // Получаем текущего пользователя
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        throw new Error('Пользователь не авторизован');
      }

      // Формируем объект для обновления (только те поля, которые переданы)
      const updateData: Record<string, any> = {};

      if (data.name !== undefined) {
        updateData.display_name = data.name;
      }
      if (data.username !== undefined) {
        updateData.username = data.username;
      }
      if (data.bio !== undefined) {
        updateData.bio = data.bio;
      }
      if (data.avatar_url !== undefined) {
        updateData.avatar_url = data.avatar_url;
      }

      // Дата рождения уже в ISO формате (YYYY-MM-DD)
      if (data.birth_date !== undefined) {
        updateData.birth_date = data.birth_date;
      }

      // Обновляем данные в таблице profiles
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Возвращаем в формате User (display_name → name)
      return {
        id: updatedProfile.id,
        email: user.email || '',
        name: updatedProfile.display_name || '',
        username: updatedProfile.username || '',
        bio: updatedProfile.bio,
        avatar_url: updatedProfile.avatar_url,
        birth_date: updatedProfile.birth_date, // Возвращаем дату рождения
        created_at: updatedProfile.created_at,
      };
    },
    onSuccess: () => {
      // Инвалидируем кеш текущего пользователя
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}