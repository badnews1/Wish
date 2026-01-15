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
 * Валидация формы редактирования профиля
 * 
 * @param form - данные формы
 * @returns объект с ошибками или null если валидация прошла
 */
export function validateEditProfileForm(form: EditProfileForm): EditProfileErrors | null {
  const errors: EditProfileErrors = {};

  // Проверка имени
  if (!form.name.trim()) {
    errors.name = 'Введите имя';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  } else if (form.name.trim().length > 50) {
    errors.name = 'Имя не должно превышать 50 символов';
  }

  // Проверка username
  if (!form.username.trim()) {
    errors.username = 'Введите никнейм';
  } else {
    const usernameValidation = validateUsernameFormat(form.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error;
    }
  }

  // Проверка био (опционально)
  if (form.bio && form.bio.length > 200) {
    errors.bio = 'Описание не должно превышать 200 символов';
  }

  return Object.keys(errors).length > 0 ? errors : null;
}