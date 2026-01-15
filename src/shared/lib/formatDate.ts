/**
 * Форматирует дату в формат "DD месяц YYYY"
 * @param date - дата для форматирования
 * @param language - код языка ('ru' | 'en')
 * @returns отформатированная строка даты
 */
export function formatDate(date: Date, language: 'ru' | 'en' = 'ru'): string {
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Используем Intl.DateTimeFormat для корректного склонения месяца
  const formatter = new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return formatter.format(date);
}