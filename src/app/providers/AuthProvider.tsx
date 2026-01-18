// Провайдер для управления авторизацией
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from '@/entities/user';
import { WelcomePage } from '@/pages/welcome';
import { SignUpPage } from '@/pages/sign-up';
import { SignInPage } from '@/pages/sign-in';

type AuthScreen = 'welcome' | 'sign-up' | 'sign-in';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element | null {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useCurrentUser();
  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');

  // Показываем загрузку пока проверяем сессию
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь авторизован - показываем приложение
  if (user) {
    return <>{children}</>;
  }

  // Если не авторизован - показываем auth flow
  const handleAuthSuccess = async () => {
    // Инвалидируем кеш React Query чтобы перезапросить currentUser
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  if (authScreen === 'welcome') {
    return (
      <WelcomePage
        onSignUp={() => setAuthScreen('sign-up')}
        onSignIn={() => setAuthScreen('sign-in')}
      />
    );
  }

  if (authScreen === 'sign-up') {
    return (
      <SignUpPage
        onBack={() => setAuthScreen('welcome')}
        onSuccess={handleAuthSuccess}
        onSignInClick={() => setAuthScreen('sign-in')}
      />
    );
  }

  if (authScreen === 'sign-in') {
    return (
      <SignInPage
        onBack={() => setAuthScreen('welcome')}
        onSuccess={handleAuthSuccess}
        onSignInClick={() => setAuthScreen('sign-up')}
      />
    );
  }

  return null;
}