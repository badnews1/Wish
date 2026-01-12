import { useState, useEffect } from 'react';

/**
 * Хук для управления временным состоянием в drawer'ах
 * Автоматически синхронизирует временное значение с исходным при открытии drawer'а
 * 
 * @param initialValue - Исходное значение для синхронизации
 * @param isOpen - Флаг открытия drawer'а
 * @returns [tempValue, setTempValue] - Временное значение и функция для его обновления
 * 
 * @example
 * ```tsx
 * const [tempLocation, setTempLocation] = useTempState(purchaseLocation || '', isDrawerOpen);
 * ```
 */
export function useTempState<T>(initialValue: T, isOpen: boolean): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [tempValue, setTempValue] = useState<T>(initialValue);

  useEffect(() => {
    if (isOpen) {
      setTempValue(initialValue);
    }
  }, [isOpen, initialValue]);

  return [tempValue, setTempValue];
}
