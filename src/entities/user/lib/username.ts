/**
 * Генерирует случайный уникальный username
 * 
 * Формат: user + 4-5 цифр (например: user1234)
 */
export function generateRandomUsername(): string {
  const randomNum = Math.floor(Math.random() * 100000);
  return `user${randomNum}`;
}

/**
 * Валидирует username
 * 
 * Правила:
 * - 2-20 символов
 * - Только латинские буквы (a-z), цифры и подчеркивание
 * - Нижний регистр
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (!username || username.length < 2) {
    return { isValid: false, error: 'Никнейм должен быть минимум 2 символа' };
  }
  
  if (username.length > 20) {
    return { isValid: false, error: 'Никнейм должен быть максимум 20 символов' };
  }
  
  // Проверяем формат (только a-z, 0-9, _)
  const usernameRegex = /^[a-z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { 
      isValid: false, 
      error: 'Никнейм может содержать только латинские буквы, цифры и подчеркивание' 
    };
  }
  
  return { isValid: true };
}