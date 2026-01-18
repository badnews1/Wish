/**
 * Форматтеры для entity Friend
 */

/**
 * Форматирует количество друзей с правильным склонением
 * @param count - Количество друзей
 * @param t - Функция перевода
 * @returns Отформатированная строка (например: "5 друзей")
 */
export function formatFriendsCount(count: number, t: (key: string) => string): string {
  const cases = [2, 0, 1, 1, 1, 2];
  const caseIndex = count % 100 > 4 && count % 100 < 20 
    ? 2 
    : cases[Math.min(count % 10, 5)];
  
  const forms = [
    t('friend.ui.friendsCount.one'),
    t('friend.ui.friendsCount.few'),
    t('friend.ui.friendsCount.many'),
  ];
  
  return `${count} ${forms[caseIndex]}`;
}
