/**
 * Конфигурация табов виджета друзей
 */

export type FriendsTabId = 'friends' | 'requests';

export const FRIENDS_TABS: Array<{ id: FriendsTabId; labelKey: string }> = [
  { id: 'friends', labelKey: 'widgets.friendsTabs.tabs.myFriends' },
  { id: 'requests', labelKey: 'widgets.friendsTabs.tabs.requests' },
] as const;

// Экспорт с camelCase именем для удобства
export const friendsTabs = FRIENDS_TABS;
