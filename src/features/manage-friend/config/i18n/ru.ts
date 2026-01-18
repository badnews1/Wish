/**
 * Русская локализация для features/manage-friend
 */

export const manageFriendRu = {
  ui: {
    // FriendButton - статусы
    alreadyFriendsAriaLabel: 'Уже в друзьях',
    friendsLabel: 'Друзья',
    
    cancelRequestAriaLabel: 'Отменить запрос',
    cancelLabel: 'Отменить',
    cancelingLabel: 'Отмена...',
    
    incomingRequestAriaLabel: 'Есть входящий запрос',
    incomingRequestLabel: 'Есть запрос',
    
    addFriendAriaLabel: 'Добавить в друзья',
    addFriendLabel: 'Добавить',
    sendingLabel: 'Отправка...',
    
    // DeleteFriendButton
    deleteFriendAriaLabel: 'Удалить из друзей',
    deleteLabel: 'Удалить',
    defaultFriendName: 'этого пользователя',
    
    // DeleteFriendButton - диалог подтверждения
    confirmDeleteTitle: 'Удалить из друзей?',
    confirmDeleteDescription: 'Вы уверены, что хотите удалить {{friendName}} из друзей? Чтобы снова стать друзьями, нужно будет отправить новый запрос.',
    confirmCancelButton: 'Отмена',
    confirmDeleteButton: 'Удалить',
    
    // FriendRequestActions
    acceptRequestAriaLabel: 'Принять запрос',
    rejectRequestAriaLabel: 'Отклонить запрос',
  }
} as const;