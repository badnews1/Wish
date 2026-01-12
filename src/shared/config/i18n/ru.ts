export const sharedRu = {
  common: {
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    done: "Готово",
    close: "Закрыть",
    add: "Добавить",
    create: "Создать",
    share: "Поделиться",
    back: "Назад",
    next: "Далее",
    skip: "Пропустить",
    confirm: "Подтвердить",
    loading: "Загрузка...",
    noResults: "Ничего не найдено",
    error: "Ошибка",
    success: "Успешно",
    clear: "Очистить",
    select: "Выберите",
    notSet: "Не указана",
    other: "Другое",
    of: "из"
  },
  navigation: {
    home: "Главная",
    community: "Сообщество",
    add: "Добавить",
    wishlist: "Вишлист",
    profile: "Профиль"
  },
  language: {
    select: "Выбрать язык",
    russian: "Русский",
    english: "English"
  },
  settings: {
    title: "Настройки",
    language: "Язык"
  },
  icons: {
    gift: "Подарок",
    cake: "День рождения",
    trees: "Новый год",
    sparkle: "Красота",
    home: "Для дома",
    sparkles: "Мечты",
    bell: "Колокольчик",
    heart: "Сердце",
    star: "Звезда",
    music: "Музыка",
    laptop: "Ноутбук",
    coffee: "Кофе",
    camera: "Камера",
    plane: "Самолёт",
    gamepad: "Игры",
    palette: "Палитра"
  },
  imageCrop: {
    zoomOut: "Уменьшить",
    zoomIn: "Увеличить",
    error: "Не удалось обрезать изображение"
  },
  imageUpload: {
    invalidFormat: "Неверный формат файла. Пожалуйста, загрузите изображение (JPG, PNG, WebP).",
    fileTooLarge: "Размер файла слишком большой. Максимальный размер: {{maxSize}}MB.",
    fileTooLargeDescription: "Размер вашего файла: {{fileSize}}MB",
    processingError: "Не удалось обработать изображение. Попробуйте другой файл."
  },
  validation: {
    required: "Обязательное поле",
    minLength: "Минимум {{count}} символов",
    maxLength: "Максимум {{count}} символов",
    invalidEmail: "Неверный формат email",
    invalidUrl: "Неверный формат URL"
  },
  errors: {
    networkError: "Ошибка сети. Проверьте подключение к интернету.",
    serverError: "Ошибка сервера. Попробуйте позже.",
    unknownError: "Неизвестная ошибка. Попробуйте еще раз."
  }
} as const;
