import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Поддерживаемые языки приложения
 */
export type Language = 'ru' | 'en';

interface LanguageStore {
  /** Текущий язык приложения */
  language: Language;
  
  /** Установить язык */
  setLanguage: (language: Language) => void;
}

/**
 * Глобальный стор для управления языком приложения
 * Сохраняет выбор языка в localStorage
 */
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'ru', // По умолчанию русский
      
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'app-language', // ключ в localStorage
    }
  )
);
