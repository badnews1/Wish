/**
 * Public API для entity Friend
 */

// Типы
export type {
  FriendshipStatus,
  FriendshipRow,
  FriendProfile,
  Friendship,
  FriendshipStatusInfo,
  RateLimitError,
  FriendsPaginationParams,
  FriendsPaginationResult,
  FriendshipRpcRow,
} from './model/types';

// API хуки
export { useSendFriendRequest } from './api/useSendFriendRequest';
export { useCancelFriendRequest } from './api/useCancelFriendRequest';
export { useAcceptFriendRequest } from './api/useAcceptFriendRequest';
export { useRejectFriendRequest } from './api/useRejectFriendRequest';
export { useDeleteFriend } from './api/useDeleteFriend';
export { useFriends } from './api/useFriends';
export { useFriendsCount } from './api/useFriendsCount';
export { useIncomingFriendRequests } from './api/useIncomingFriendRequests';
export { useOutgoingFriendRequests } from './api/useOutgoingFriendRequests';
export { useFriendshipStatus } from './api/useFriendshipStatus';

// Lib
export { formatFriendsCount } from './lib';

// UI компоненты
export { FriendCard } from './ui/FriendCard';
export { FriendRequestCard } from './ui/FriendRequestCard';

// i18n
export { friendRu, friendEn } from './config';