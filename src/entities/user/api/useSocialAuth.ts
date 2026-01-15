// Хук для OAuth аутентификации (Google, Apple)
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import type { SocialProvider } from '../model/types';
import { toast } from 'sonner@2.0.3';

async function signInWithProvider(provider: SocialProvider): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function useSocialAuth() {
  return useMutation({
    mutationFn: signInWithProvider,
    onError: (error: Error) => {
      toast.error(`Ошибка авторизации: ${error.message}`);
    },
  });
}
