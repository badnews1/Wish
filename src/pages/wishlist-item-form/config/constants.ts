/**
 * Константы для формы создания/редактирования желания
 */

// Лимиты для загрузки изображений
export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Сообщения об ошибках
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'Файл слишком большой',
  FILE_TOO_LARGE_DESCRIPTION: `Максимальный размер файла — ${MAX_FILE_SIZE_MB} МБ`,
} as const;