/**
 * Вычисляет количество дней до дня рождения
 * 
 * @param birthDateStr - дата рождения в формате YYYY-MM-DD
 * @returns количество дней до ДР (0 если сегодня)
 */
export function getDaysUntilBirthday(birthDateStr: string): number {
  const [, month, day] = birthDateStr.split('-').map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Сбрасываем время для корректного сравнения
  
  // Создаём ДР в текущем году
  const thisYearBirthday = new Date(
    today.getFullYear(),
    month - 1, // месяцы с 0
    day
  );
  
  // Если ДР уже прошёл в этом году - берём следующий год
  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  // Считаем разницу в днях
  const diffMs = thisYearBirthday.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Форматирует дату рождения в читаемый формат (только день и месяц)
 * 
 * @param birthDateStr - дата рождения в формате YYYY-MM-DD
 * @returns строка вида "15 февраля"
 */
export function formatBirthdayDate(birthDateStr: string): string {
  const date = new Date(birthDateStr);
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'long' 
  });
}
