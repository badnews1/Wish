// Хук для входа пользователя
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '@/app';
import type { SignInData } from '../model/types';

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
  const { t } = useTranslation();
  
  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      toast.success(t('auth.welcomeBack'));
    },
    onError: (error: Error) => {
      toast.error(`${t('auth.signIn')}: ${error.message}`);
    },
  });
}