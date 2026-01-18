export const wishlistRu = {
  card: {
    noImage: "Нет фото",
    linkButton: "Ссылка",
    statusPurchased: "Куплено",
    statusAvailable: "Актуально"
  },
  notifications: {
    wishlist: {
      created: "Вишлист создан",
      updated: "Вишлист обновлён",
      deleted: "Вишлист удалён",
      errorCreate: "Ошибка создания вишлиста",
      errorUpdate: "Ошибка обновления вишлиста",
      errorDelete: "Ошибка удаления вишлиста",
      errorLoad: "Ошибка загрузки вишлистов"
    },
    wish: {
      created: "Желание добавлено!",
      updated: "Желание обновлено!",
      deleted: "Желание удалено!",
      error: "Произошла ошибка при работе с желанием",
      errorCreate: "Ошибка при добавлении желания",
      errorUpdate: "Ошибка при обновлении желания",
      errorDelete: "Ошибка при удалении желания"
    }
  },
  giftTags: {
    none: "Без метки",
    reallyWant: "Очень хочу",
    wouldBeNice: "Было бы неплохо",
    thinking: "Подумаю",
    buyMyself: "Сам куплю"
  },
  itemCount: {
    one: "желание",
    few: "желания",
    many: "желаний"
  }
} as const;