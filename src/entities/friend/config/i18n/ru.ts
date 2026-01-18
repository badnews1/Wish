export const friendRu = {
  ui: {
    defaultDisplayName: 'Пользователь',
    friendsCount: {
      one: 'друг',
      few: 'друга',
      many: 'друзей',
    },
  },
  notifications: {
    sendRequest: {
      success: 'Запрос в друзья отправлен',
      dailyLimit: 'Вы уже отправляли запрос этому пользователю 3 раза сегодня',
      rateLimit: 'Слишком частые действия с этим пользователем. Попробуйте позже',
      globalLimit: 'Слишком много действий за последний час. Попробуйте позже',
      error: 'Не удалось отправить запрос в друзья',
    },
    cancelRequest: {
      success: 'Запрос в друзья отменен',
      error: 'Не удалось отменить запрос в друзья',
    },
    acceptRequest: {
      success: 'Запрос в друзья принят',
      error: 'Не удалось принять запрос в друзья',
    },
    rejectRequest: {
      success: 'Запрос в друзья отклонен',
      error: 'Не удалось отклонить запрос в друзья',
    },
    deleteFriend: {
      success: 'Удалено из друзей',
      error: 'Не удалось удалить из друзей',
    },
  },
} as const;