export const productParserEn = {
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
} as const;