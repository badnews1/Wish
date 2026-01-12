export const sharedEn = {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    done: "Done",
    close: "Close",
    add: "Add",
    create: "Create",
    share: "Share",
    back: "Back",
    next: "Next",
    skip: "Skip",
    confirm: "Confirm",
    loading: "Loading...",
    noResults: "No results",
    error: "Error",
    success: "Success",
    clear: "Clear",
    select: "Select",
    notSet: "Not set",
    other: "Other",
    of: "of"
  },
  navigation: {
    home: "Home",
    community: "Community",
    add: "Add",
    wishlist: "Wishlist",
    profile: "Profile"
  },
  language: {
    select: "Select language",
    russian: "Русский",
    english: "English"
  },
  settings: {
    title: "Settings",
    language: "Language"
  },
  icons: {
    gift: "Gift",
    cake: "Birthday",
    trees: "New Year",
    sparkle: "Beauty",
    home: "Home",
    sparkles: "Dreams",
    bell: "Bell",
    heart: "Heart",
    star: "Star",
    music: "Music",
    laptop: "Laptop",
    coffee: "Coffee",
    camera: "Camera",
    plane: "Plane",
    gamepad: "Games",
    palette: "Palette"
  },
  imageCrop: {
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    error: "Failed to crop image"
  },
  imageUpload: {
    invalidFormat: "Invalid file format. Please upload an image (JPG, PNG, WebP).",
    fileTooLarge: "File size too large. Maximum size: {{maxSize}}MB.",
    fileTooLargeDescription: "Your file size: {{fileSize}}MB",
    processingError: "Failed to process image. Try another file."
  },
  validation: {
    required: "Required field",
    minLength: "Minimum {{count}} characters",
    maxLength: "Maximum {{count}} characters",
    invalidEmail: "Invalid email format",
    invalidUrl: "Invalid URL format"
  },
  errors: {
    networkError: "Network error. Check your internet connection.",
    serverError: "Server error. Try again later.",
    unknownError: "Unknown error. Please try again."
  }
} as const;
