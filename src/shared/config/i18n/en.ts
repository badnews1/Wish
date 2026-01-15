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
  profile: {
    noWishlists: "You don't have any wishlists yet"
  },
  auth: {
    welcomeTitle: "Create & Share Wishlists",
    welcomeDescription: "Save your wishes, share with friends and track gifts",
    getStarted: "Get Started",
    signIn: "Sign In",
    signUp: "Sign Up",
    orContinueWith: "or continue with",
    createAccount: "Create Account",
    yourName: "Your Name",
    email: "Email",
    password: "Password",
    alreadyHaveAccount: "Already have an account?",
    welcomeBack: "Welcome Back",
    forgotPassword: "Forgot password?",
    dontHaveAccount: "Don't have an account?",
    continueWithGoogle: "Continue with Google",
    continueWithApple: "Continue with Apple",
  },
  language: {
    select: "Select language",
    russian: "Русский",
    english: "English"
  },
  settings: {
    title: "Settings",
    language: "Language",
    account: {
      title: "Account",
      name: "Name",
      bio: "Bio",
      email: "Email",
      changePassword: "Change password"
    },
    privacy: {
      title: "Privacy",
      profileVisibility: "Profile visibility",
      profileVisibilityDescription: "Who can see your profile",
      public: "Public",
      friendsOnly: "Friends only",
      private: "Private",
      showStats: "Show statistics",
      showStatsDescription: "Display wishlists and items count"
    },
    notifications: {
      title: "Notifications",
      pushNotifications: "Push notifications",
      pushNotificationsDescription: "Receive notifications on device",
      emailNotifications: "Email notifications",
      emailNotificationsDescription: "Receive notifications via email",
      giftReminders: "Gift reminders",
      giftRemindersDescription: "Remind about important dates",
      newFollowers: "New followers",
      newFollowersDescription: "Notify about new followers"
    }
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
    processingError: "Failed to process image. Try another file.",
    uploadImage: "Upload image"
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