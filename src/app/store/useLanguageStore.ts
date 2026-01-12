import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '../config/i18n';

/**
 * Поддерживаемые языки приложения определяются в app/config/i18n
 * через keyof typeof translations (источник правды)
 */

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