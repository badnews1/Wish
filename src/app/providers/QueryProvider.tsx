/**
 * React Query Provider
 * Настройка кеширования и управления серверным состоянием
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// Создаём singleton инстанс QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Кеш на 5 минут
      staleTime: 5 * 60 * 1000,
      // Повторные попытки при ошибке
      retry: 1,
      // Не рефетчить при фокусе окна (для мобильного приложения)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Повторные попытки при ошибке мутации
      retry: 0,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
