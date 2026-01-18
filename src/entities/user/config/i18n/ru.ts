export const userRu = {
  ui: {
    defaultDisplayName: 'Пользователь',
  },
  birthday: {
    title: 'День рождения',
    today: 'Сегодня',
    daysLeft: 'через {count} дн.',
  },
  errors: {
    notAuthorized: 'Пользователь не авторизован',
  },
  validation: {
    username: {
      minLength: 'Никнейм должен быть минимум 2 символа',
      maxLength: 'Никнейм должен быть максимум 20 символов',
      invalidFormat: 'Никнейм может содержать только латинские буквы, цифры и подчеркивание',
    },
    name: {
      minLength: 'Имя должно содержать минимум 2 символа',
    },
    email: {
      invalid: 'Некорректный email',
    },
    password: {
      minLength: 'Пароль должен содержать минимум 6 символов',
    },
  },
  notifications: {
    signIn: {
      success: 'Вход выполнен успешно!',
      error: 'Ошибка входа',
    },
    signUp: {
      success: 'Аккаунт успешно создан!',
      error: 'Ошибка регистрации',
    },
    signOut: {
      success: 'Вы вышли из аккаунта',
      error: 'Ошибка выхода',
    },
    socialAuth: {
      error: 'Ошибка авторизации',
    },
    updateProfile: {
      success: 'Профиль обновлён',
      error: 'Ошибка обновления профиля',
    },
    uploadAvatar: {
      success: 'Аватар обновлён',
      error: 'Ошибка загрузки аватара',
    },
  },
} as const;