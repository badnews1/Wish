export const productParserRu = {
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
  }
} as const;
