// Типы для пользователя и аутентификации

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  birth_date?: string; // Дата рождения в ISO формате (YYYY-MM-DD)
  created_at: string;
}

/**
 * Профиль пользователя (для UI компонентов)
 * Используется camelCase для совместимости с компонентами
 */
export interface UserProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  birthDate?: string | null; // Дата рождения в ISO формате (YYYY-MM-DD)
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export type SocialProvider = 'google' | 'apple';