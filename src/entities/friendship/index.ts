/**
 * Публичный API для entities/friendship
 * @module entities/friendship
 */

// Типы
export type { 
  Friendship, 
  FriendshipStatus, 
  FriendWithDetails,
  FriendshipDirection,
  FriendRequest,
} from './model/types';

// API хуки
export {
  useMyFriends,
  usePendingRequests,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useRemoveFriend,
  friendshipKeys,
} from './api/useFriendships';

export { useSentRequests, sentRequestsKeys } from './api/useSentRequests';
export { useCheckFriendshipStatus } from './api/useCheckFriendshipStatus';

// Утилиты
export { filterFriendsByName } from './lib/filterFriends';

// UI компоненты
export { FriendCard } from './ui/FriendCard';
export { SentRequestCard } from './ui/SentRequestCard';