// Zod схемы для валидации auth форм
import { z } from 'zod';

/**
 * Создает схему валидации для регистрации с переводами
 */
export function createSignUpSchema(messages: {
  nameMinLength: string;
  emailInvalid: string;
  passwordMinLength: string;
}) {
  return z.object({
    name: z.string().min(2, messages.nameMinLength),
    email: z.string().email(messages.emailInvalid),
    password: z.string().min(6, messages.passwordMinLength),
  });
}

/**
 * Создает схему валидации для входа с переводами
 */
export function createSignInSchema(messages: {
  emailInvalid: string;
  passwordMinLength: string;
}) {
  return z.object({
    email: z.string().email(messages.emailInvalid),
    password: z.string().min(6, messages.passwordMinLength),
  });
}

// Типы для форм (не зависят от переводов)
export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
};

export type SignInFormData = {
  email: string;
  password: string;
};
