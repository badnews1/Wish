import { useState, useRef } from 'react';

/**
 * Интерфейс для управления одним drawer'ом
 */
export interface DrawerControl {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * Тип конфигурации drawer'ов: объект где ключи - имена drawer'ов, значения - начальные состояния
 */
type DrawersConfig<T extends string> = Record<T, boolean>;

/**
 * Тип результата: объект где каждый drawer имеет полный контроль
 */
type DrawersControls<T extends string> = Record<T, DrawerControl>;

/**
 * Универсальный хук для управления множественными drawer'ами
 * 
 * Оптимизирован для избежания пересоздания функций:
 * - Функции управления (open, close, toggle, setOpen) создаются один раз через useRef
 * - При каждом рендере обновляется только поле isOpen
 * - Возвращается стабильная ссылка на объект controls
 * 
 * @example
 * ```tsx
 * const drawers = useMultipleDrawers({
 *   calendarDrawer: false,
 *   privacyDrawer: false,
 *   deleteDialog: false,
 * });
 * 
 * // Использование:
 * drawers.calendarDrawer.open();
 * drawers.privacyDrawer.isOpen;
 * drawers.deleteDialog.setOpen(true);
 * ```
 * 
 * @param config - Объект с именами drawer'ов и их начальными состояниями
 * @returns Объект с контроллерами для каждого drawer'а
 */
export function useMultipleDrawers<T extends string>(
  config: DrawersConfig<T>
): DrawersControls<T> {
  // Создаём единое состояние для всех drawer'ов
  const [drawersState, setDrawersState] = useState<DrawersConfig<T>>(config);

  // Создаём стабильные функции управления один раз через useRef
  const controlsRef = useRef<DrawersControls<T>>();

  if (!controlsRef.current) {
    const result = {} as DrawersControls<T>;

    for (const drawerName in config) {
      const name = drawerName; // Замыкание для сохранения имени
      result[name] = {
        isOpen: config[name], // Начальное значение

        open: () => {
          setDrawersState((prev) => ({ ...prev, [name]: true }));
        },

        close: () => {
          setDrawersState((prev) => ({ ...prev, [name]: false }));
        },

        toggle: () => {
          setDrawersState((prev) => ({ ...prev, [name]: !prev[name] }));
        },

        setOpen: (value: boolean | ((prev: boolean) => boolean)) => {
          setDrawersState((prev) => ({
            ...prev,
            [name]: typeof value === 'function' ? value(prev[name]) : value,
          }));
        },
      };
    }

    controlsRef.current = result;
  }

  // Обновляем только isOpen для каждого drawer'а при изменении состояния
  for (const drawerName in controlsRef.current) {
    controlsRef.current[drawerName].isOpen = drawersState[drawerName];
  }

  return controlsRef.current;
}