import { useState, useCallback, useMemo } from 'react';

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

  // Создаём контроллеры для каждого drawer'а
  const controls = useMemo(() => {
    const result = {} as DrawersControls<T>;

    for (const drawerName in config) {
      result[drawerName] = {
        isOpen: drawersState[drawerName],
        
        open: () => {
          setDrawersState((prev) => ({ ...prev, [drawerName]: true }));
        },
        
        close: () => {
          setDrawersState((prev) => ({ ...prev, [drawerName]: false }));
        },
        
        toggle: () => {
          setDrawersState((prev) => ({ ...prev, [drawerName]: !prev[drawerName] }));
        },
        
        setOpen: (value: boolean | ((prev: boolean) => boolean)) => {
          setDrawersState((prev) => ({
            ...prev,
            [drawerName]: typeof value === 'function' ? value(prev[drawerName]) : value,
          }));
        },
      };
    }

    return result;
  }, [drawersState, config]);

  return controls;
}
