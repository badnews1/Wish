/**
 * Форматирует дату в формат "DD месяц"
 * @param date - дата для форматирования
 * @param language - код языка ('ru' | 'en')
 * @returns отформатированная строка даты
 */
export function formatDate(date: Date, language: 'ru' | 'en' = 'ru'): string {
  const day = date.getDate();
  const locale = language === 'ru' ? 'ru-RU' : 'en-US';
  const month = date.toLocaleDateString(locale, { month: 'long' });

  return `${day} ${month}`;
}