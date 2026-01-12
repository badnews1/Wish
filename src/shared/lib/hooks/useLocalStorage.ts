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
  parser?: (data: unknown) => T
): readonly [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  // Инициализация состояния из localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      
      const parsed = JSON.parse(item);
      return parser ? parser(parsed) : parsed;
    } catch (error) {
      // Возвращаем начальное значение при ошибке
      return initialValue;
    }
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    try {
      const dataString = JSON.stringify(storedValue);
      localStorage.setItem(key, dataString);
    } catch (error) {
      // Тихо пропускаем ошибки сохранения
    }
  }, [key, storedValue]);

  // Обёртка для безопасного удаления
  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      // Тихо пропускаем ошибки удаления
    }
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeValue] as const;
}