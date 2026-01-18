/**
 * Русская локализация для features/edit-profile
 */

export const editProfileRu = {
  ui: {
    // Аватар
    changePhotoHint: 'Нажмите чтобы изменить фото',
    avatarAlt: 'Аватар',
    
    // Поля формы
    nameLabel: 'Имя',
    namePlaceholder: 'Введите ваше имя',
    usernameLabel: 'Имя пользователя',
    usernamePlaceholder: 'Введите ваше имя пользователя',
    bioLabel: 'Описание',
    bioPlaceholder: 'Расскажите о себе...',
    bioCounter: '{count}/200',
    birthDateLabel: 'Дата рождения',
    birthDatePlaceholder: 'Выберите дату рождения',
    birthDateHint: 'Друзья смогут видеть день и месяц вашего рождения',
    
    // Статусы проверки username
    usernameChecking: 'Проверка...',
    usernameAvailable: 'Имя пользователя доступно',
    usernameTaken: 'Имя пользователя уже занято',
    usernameCheckError: 'Не удалось проверить никнейм',
    
    // Кнопки
    saveButton: 'Сохранить',
    savingButton: 'Сохранение...',
    cancelButton: 'Отмена',
  },
  
  validation: {
    // Ошибки валидации имени
    nameRequired: 'Введите имя',
    nameMinLength: 'Имя должно содержать минимум 2 символа',
    nameMaxLength: 'Имя не должно превышать 50 символов',
    
    // Ошибки валидации username
    usernameRequired: 'Введите никнейм',
    
    // Ошибки валидации био
    bioMaxLength: 'Описание не должно превышать 200 символов',
  }
} as const;