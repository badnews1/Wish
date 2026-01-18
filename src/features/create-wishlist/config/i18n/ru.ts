export const createWishlistRu = {
  privacy: {
    public: {
      label: "Публичный",
      description: "Виден всем пользователям"
    },
    friends: {
      label: "Только друзья",
      description: "Виден всем вашим друзьям"
    },
    selected: {
      label: "Выбрать друзей",
      description: "Выберите, кому показывать"
    },
    private: {
      label: "Никто",
      description: "Только для вас"
    }
  },
  bookingVisibility: {
    show_names: {
      label: "Показать имена",
      description: "Вы будете видеть кто забронировал подарок"
    },
    hide_names: {
      label: "Скрыть имена",
      description: "Вы увидите что подарок забронирован, но не кем"
    },
    hide_all: {
      label: "Не показывать бронирование",
      description: "Бронирования будут полностью скрыты"
    }
  },
  months: {
    genitive: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря"
    ]
  },
  ui: {
    datePickerTitle: "Выбор даты",
    datePickerConfirm: "Готово",
    datePickerClear: "Сбросить",
    privacyDrawerTitle: "Выберите приватность",
    bookingVisibilityDrawerTitle: "Видимость забронированных",
    imageCropTitle: "Обрезка изображения",
    imageCropConfirm: "Готово",
    imageCropZoomIn: "Увеличить",
    imageCropZoomOut: "Уменьшить",
    removeCoverAria: "Удалить обложку",
    selectIconAria: "Выбрать иконку",
    titlePlaceholder: "Введите название...",
    descriptionPlaceholder: "Введите описание...",
    eventDateLabel: "Дата события",
    eventDateNotSet: "Не указана",
    privacyLabel: "Приватность",
    bookingVisibilityLabel: "Видимость бронирования",
    groupGiftingLabel: "Разрешить групповые подарки",
    groupGiftingDescription: "Друзья смогут создавать складчины",
    coverImageAlt: "Обложка вишлиста"
  },
  errors: {
    imageCropFailed: "Ошибка при обрезке изображения:"
  }
} as const;