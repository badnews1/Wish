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
}

/**
 * Хук для обновления профиля пользователя
 * 
 * @returns Mutation для обновления профиля
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData): Promise<User> => {
      // Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Маппим name → display_name для БД
      const updateData: Record<string, any> = {};
      if (data.name !== undefined) {
        updateData.display_name = data.name;
      }
      if (data.bio !== undefined) {
        updateData.bio = data.bio;
      }
      if (data.avatar_url !== undefined) {
        updateData.avatar_url = data.avatar_url;
      }
      if (data.username !== undefined) {
        updateData.username = data.username;
      }

      // Обновляем данные в таблице profiles
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Ошибка обновления профиля:', error);
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
        created_at: updatedProfile.created_at,
      };
    },
    onSuccess: () => {
      // Инвалидируем кеш текущего пользователя
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}