/**
 * Конфигурация месяцев для DatePicker
 * 
 * Массивы месяцев для каждого языка в родительном падеже
 * (например: "25 января" вместо "25 январь")
 */

export const MONTHS_GENITIVE = {
  ru: [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
} as const;
