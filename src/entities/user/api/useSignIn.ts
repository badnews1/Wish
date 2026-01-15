// Хук для входа пользователя
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { SignInData } from '../model/types';
import { toast } from 'sonner@2.0.3';

interface SignInResponse {
  userId: string;
  accessToken: string;
}

async function signIn(data: SignInData): Promise<SignInResponse> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!authData.user || !authData.session) {
    throw new Error('Не удалось войти в систему');
  }

  return {
    userId: authData.user.id,
    accessToken: authData.session.access_token,
  };
}

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      toast.success('Вход выполнен успешно!');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка входа: ${error.message}`);
    },
  });
}
