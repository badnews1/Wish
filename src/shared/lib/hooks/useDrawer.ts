import { useState, useCallback } from 'react';

/**
 * Хук для управления состоянием drawer/dialog
 * @param initialState - Начальное состояние (по умолчанию false)
 * @returns [isOpen, open, close, toggle, setOpen]
 */
export function useDrawer(initialState: boolean = false): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
} {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Безопасная обёртка для setIsOpen, которая гарантирует boolean
  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setIsOpen(value);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setOpen,
  } as const;
}