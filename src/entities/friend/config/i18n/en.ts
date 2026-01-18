export const friendEn = {
  ui: {
    defaultDisplayName: 'User',
    friendsCount: {
      one: 'friend',
      other: 'friends',
    },
  },
  notifications: {
    sendRequest: {
      success: 'Friend request sent',
      dailyLimit: 'You have already sent a request to this user 3 times today',
      rateLimit: 'Too many actions with this user. Please try again later',
      globalLimit: 'Too many actions in the last hour. Please try again later',
      error: 'Failed to send friend request',
    },
    cancelRequest: {
      success: 'Friend request cancelled',
      error: 'Failed to cancel friend request',
    },
    acceptRequest: {
      success: 'Friend request accepted',
      error: 'Failed to accept friend request',
    },
    rejectRequest: {
      success: 'Friend request rejected',
      error: 'Failed to reject friend request',
    },
    deleteFriend: {
      success: 'Removed from friends',
      error: 'Failed to remove from friends',
    },
  },
} as const;
