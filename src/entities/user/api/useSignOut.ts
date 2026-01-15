// Хук для выхода пользователя
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';
import { toast } from 'sonner@2.0.3';

async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Очищаем все кеши React Query
      queryClient.clear();
      toast.success('Вы вышли из аккаунта');
    },
    onError: (error: Error) => {
      toast.error(`Ошибка выхода: ${error.message}`);
    },
  });
}
