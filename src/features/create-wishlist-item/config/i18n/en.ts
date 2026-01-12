export const createWishlistItemEn = {
  ui: {
    deletePhotoAria: "Delete photo",
    titlePlaceholder: "Enter title...",
    descriptionPlaceholder: "Add description or important details",
    itemDescriptionPlaceholder: "Enter description...",
    wishlistLabel: "Wishlist",
    giftTagLabel: "Gift tag",
    categoryLabel: "Category",
    purchaseLocationLabel: "Purchase location",
    selectWishlist: "Select",
    selectGiftTag: "Select",
    selectCategory: "Select",
    selectPurchaseLocation: "Add",
    priceNotSet: "Not set",
    priceDrawerTitle: "Price",
    priceLabel: "Item price",
    pricePlaceholder: "Price",
    currencyLabel: "Currency",
    clearButton: "Clear",
    doneButton: "Done",
    wishlistDrawerTitle: "ADD TO WISHLIST",
    giftTagDrawerTitle: "GIFT TAG",
    categoryDrawerTitle: "CATEGORY",
    purchaseLocationDrawerTitle: "WHERE TO BUY",
    purchaseLocationPlaceholder: "Enter store address...",
    imageCropTitle: "Crop image",
    imageCropConfirm: "Done",
    imageCropZoomOut: "Zoom out",
    imageCropZoomIn: "Zoom in"
  },
  productParser: {
    ui: {
      urlPlaceholder: "Link (optional)",
      pasteAria: "Paste from clipboard",
      clearAria: "Clear link",
      syncAria: "Load product data",
      hint: "Paste product link and use sync to auto-fill data",
      sectionTitle: "Product link"
    },
    toast: {
      linkPasted: "Link pasted",
      pasteError: "Failed to paste link",
      pasteErrorDescription: "Check browser permissions",
      dataLoadedSuccess: "Data loaded",
      dataLoadedDescription: "Form auto-filled",
      loadError: "Load error",
      loadErrorDescription: "Failed to load product data"
    },
    errors: {
      INVALID_URL: "Invalid URL",
      PARSE_ERROR: "Parse error",
      NETWORK_ERROR: "Network error",
      UNSUPPORTED_SITE: "Unsupported site"
    }
  },
  categories: {
    electronics: "Electronics",
    clothing: "Clothing",
    shoes: "Shoes",
    accessories: "Accessories",
    beauty: "Beauty",
    books: "Books",
    sport: "Sport",
    home: "Home",
    games: "Games",
    toys: "Toys",
    jewelry: "Jewelry",
    food: "Food & Drinks",
    travel: "Travel",
    other: "Other"
  },
  currencies: {
    USD: "USD - US Dollar",
    EUR: "EUR - Euro",
    GBP: "GBP - British Pound",
    RUB: "RUB - Russian Ruble"
  },
  errors: {
    imageCropFailed: "Image crop failed:"
  }
} as const;