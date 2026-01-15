// Хук для регистрации пользователя
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { SignUpData } from '../model/types';
import { toast } from 'sonner@2.0.3';
import { generateRandomUsername } from '../lib/username';
import { checkUsernameAvailability } from './checkUsernameAvailability';

interface SignUpResponse {
  userId: string;
  accessToken: string;
}

async function signUp(data: SignUpData): Promise<SignUpResponse> {
  // 1. Создаём пользователя в auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user || !authData.session) {
    throw new Error('Не удалось создать пользователя');
  }

  // 2. Создаём профиль в таблице profiles
  let username = generateRandomUsername();
  let isAvailable = await checkUsernameAvailability(username);

  // Генерируем уникальный username (максимум 10 попыток)
  let attempts = 0;
  while (!isAvailable && attempts < 10) {
    username = generateRandomUsername();
    isAvailable = await checkUsernameAvailability(username);
    attempts++;
  }

  if (!isAvailable) {
    throw new Error('Не удалось сгенерировать уникальный никнейм');
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: authData.user.id,
    display_name: data.name,
    username: username,
    bio: null,
    avatar_url: null,
  });

  if (profileError) {
    throw new Error('Не удалось создать профиль');
  }

  return {
    userId: authData.user.id,
    accessToken: authData.session.access_token,
  };
}

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success('Аккаунт успешно создан!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка регистрации: ${error.message}`);
    },
  });
}