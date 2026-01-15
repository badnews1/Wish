// Типы для пользователя и аутентификации

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
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