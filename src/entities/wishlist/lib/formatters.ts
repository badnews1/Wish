/**
 * Форматирует количество желаний с правильным склонением
 * @param count - количество желаний
 * @param t - функция перевода
 * @param language - язык ('ru' | 'en')
 */
export function formatItemCount(
  count: number, 
  t: (key: string) => string,
  language: 'ru' | 'en' = 'ru'
): string {
  if (language === 'en') {
    const word = count === 1 
      ? t('wishlist.itemCount.one')
      : t('wishlist.itemCount.other');
    return `${count} ${word}`;
  }
  
  // Русский язык - три формы
  const cases = [2, 0, 1, 1, 1, 2];
  const caseIndex = count % 100 > 4 && count % 100 < 20 
    ? 2 
    : cases[Math.min(count % 10, 5)];
  
  const forms = [
    t('wishlist.itemCount.one'),
    t('wishlist.itemCount.few'),
    t('wishlist.itemCount.many'),
  ];
  
  return `${count} ${forms[caseIndex]}`;
}