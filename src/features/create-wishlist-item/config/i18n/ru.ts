export const createWishlistItemRu = {
  ui: {
    deletePhotoAria: "Удалить фото",
    titlePlaceholder: "Введите название...",
    descriptionPlaceholder: "Добавьте описание или важные уточнения",
    itemDescriptionPlaceholder: "Введите описание...",
    wishlistLabel: "Вишлист",
    giftTagLabel: "Метка подарка",
    categoryLabel: "Категория",
    purchaseLocationLabel: "Место покупки",
    selectWishlist: "Выберите",
    selectGiftTag: "Выберите",
    selectCategory: "Выберите",
    selectPurchaseLocation: "Добавить",
    priceNotSet: "Не указана",
    priceDrawerTitle: "Цена",
    priceLabel: "Цена товара",
    pricePlaceholder: "Цена",
    currencyLabel: "Валюта",
    clearButton: "Очистить",
    doneButton: "Готово",
    wishlistDrawerTitle: "ДОБАВИТЬ В ВИШЛИСТ",
    giftTagDrawerTitle: "МЕТКА ПОДАРКА",
    categoryDrawerTitle: "КАТЕГОРИЯ",
    purchaseLocationDrawerTitle: "ГДЕ КУПИТЬ",
    purchaseLocationPlaceholder: "Введите адрес магазина...",
    imageCropTitle: "Обрезка изображения",
    imageCropConfirm: "Готово",
    imageCropZoomOut: "Уменьшить",
    imageCropZoomIn: "Увеличить"
  },
  productParser: {
    ui: {
      urlPlaceholder: "Ссылка (необязательно)",
      pasteAria: "Вставить из буфера обмена",
      clearAria: "Очистить ссылку",
      syncAria: "Загрузить данные товара",
      hint: "Вставьте ссылку на товар и используйте синхронизацию для автозаполнения данных",
      sectionTitle: "Ссылка на товар"
    },
    toast: {
      linkPasted: "Ссылка вставлена",
      pasteError: "Не удалось вставить ссылку",
      pasteErrorDescription: "Проверьте разрешения браузера",
      dataLoadedSuccess: "Данные загружены",
      dataLoadedDescription: "Форма автоматически заполнена",
      loadError: "Ошибка загрузки",
      loadErrorDescription: "Не удалось загрузить данные товара"
    },
    errors: {
      INVALID_URL: "Некорректная ссылка",
      PARSE_ERROR: "Ошибка парсинга",
      NETWORK_ERROR: "Проблемы с сетью",
      UNSUPPORTED_SITE: "Сайт не поддерживается"
    }
  },
  categories: {
    electronics: "Электроника",
    clothing: "Одежда",
    shoes: "Обувь",
    accessories: "Аксессуары",
    beauty: "Красота",
    books: "Книги",
    sport: "Спорт",
    home: "Для дома",
    games: "Игры",
    toys: "Игрушки",
    jewelry: "Украшения",
    food: "Еда и напитки",
    travel: "Путешествия",
    other: "Другое"
  },
  currencies: {
    USD: "USD - Доллар США",
    EUR: "EUR - Евро",
    GBP: "GBP - Фунт стерлингов",
    RUB: "RUB - Российский рубль"
  },
  errors: {
    imageCropFailed: "Ошибка при обрезке изображения:"
  }
} as const;