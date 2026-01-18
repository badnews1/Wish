/**
 * English localization for features/manage-friend
 */

export const manageFriendEn = {
  ui: {
    // FriendButton - statuses
    alreadyFriendsAriaLabel: 'Already friends',
    friendsLabel: 'Friends',
    
    cancelRequestAriaLabel: 'Cancel request',
    cancelLabel: 'Cancel',
    cancelingLabel: 'Canceling...',
    
    incomingRequestAriaLabel: 'Incoming friend request',
    incomingRequestLabel: 'Request',
    
    addFriendAriaLabel: 'Add friend',
    addFriendLabel: 'Add',
    sendingLabel: 'Sending...',
    
    // DeleteFriendButton
    deleteFriendAriaLabel: 'Remove friend',
    deleteLabel: 'Remove',
    defaultFriendName: 'this user',
    
    // DeleteFriendButton - confirmation dialog
    confirmDeleteTitle: 'Remove friend?',
    confirmDeleteDescription: 'Are you sure you want to remove {{friendName}} from friends? To become friends again, you\'ll need to send a new request.',
    confirmCancelButton: 'Cancel',
    confirmDeleteButton: 'Remove',
    
    // FriendRequestActions
    acceptRequestAriaLabel: 'Accept request',
    rejectRequestAriaLabel: 'Reject request',
  }
} as const;