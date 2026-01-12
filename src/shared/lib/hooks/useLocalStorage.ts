import { useState, useEffect, useCallback } from 'react';

/**
 * Универсальный хук для работы с localStorage
 * @param key - ключ для хранения в localStorage
 * @param initialValue - начальное значение по умолчанию
 * @param parser - функция для парсинга данных из localStorage (опционально)
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parser?: (data: any) => T
) {
  // Инициализация состояния из localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsed = JSON.parse(item);
      return parser ? parser(parsed) : parsed;
    } catch (error) {
      console.error(`Ошибка загрузки данных из localStorage [${key}]:`, error);
      return initialValue;
    }
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      const dataString = JSON.stringify(storedValue);
      localStorage.setItem(key, dataString);
    } catch (error) {
      console.error(`Ошибка сохранения данных в localStorage [${key}]:`, error);
    }
  }, [key, storedValue]);

  // Обёртка для безопасного удаления
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Ошибка удаления данных из localStorage [${key}]:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeValue] as const;
}
