/**
 * Валидация формы редактирования профиля
 */

import type { EditProfileForm } from './types';
import { validateUsername as validateUsernameFormat } from '@/entities/user';

/**
 * Ошибки валидации формы
 */
export interface EditProfileErrors {
  name?: string;
  username?: string;
  bio?: string;
}

/**
 * Перевод для сообщений валидации
 * Для упрощения работы функции передается объект переводов
 */
export interface ValidationMessages {
  nameRequired: string;
  nameMinLength: string;
  nameMaxLength: string;
  usernameRequired: string;
  bioMaxLength: string;
}

/**
 * Валидация формы редактирования профиля
 * 
 * @param form - данные формы
 * @param messages - объект с переводами сообщений валидации
 * @returns объект с ошибками или null если валидация прошла
 */
export function validateEditProfileForm(
  form: EditProfileForm,
  messages: ValidationMessages
): EditProfileErrors | null {
  const errors: EditProfileErrors = {};

  // Проверка имени
  if (!form.name.trim()) {
    errors.name = messages.nameRequired;
  } else if (form.name.trim().length < 2) {
    errors.name = messages.nameMinLength;
  } else if (form.name.trim().length > 50) {
    errors.name = messages.nameMaxLength;
  }

  // Проверка username
  if (!form.username.trim()) {
    errors.username = messages.usernameRequired;
  } else {
    const usernameValidation = validateUsernameFormat(form.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }
  }

  // Проверка био (опционально)
  if (form.bio && form.bio.length > 200) {
    errors.bio = messages.bioMaxLength;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}