/**
 * English localization for features/edit-profile
 */

export const editProfileEn = {
  ui: {
    // Avatar
    changePhotoHint: 'Tap to change photo',
    avatarAlt: 'Avatar',
    
    // Form fields
    nameLabel: 'Name',
    namePlaceholder: 'Enter your name',
    usernameLabel: 'Username',
    usernamePlaceholder: 'Enter your username',
    bioLabel: 'Bio',
    bioPlaceholder: 'Tell us about yourself...',
    bioCounter: '{count}/200',
    birthDateLabel: 'Birth Date',
    birthDatePlaceholder: 'Select your birth date',
    birthDateHint: 'Friends will be able to see the day and month of your birthday',
    
    // Username check statuses
    usernameChecking: 'Checking...',
    usernameAvailable: 'Username is available',
    usernameTaken: 'Username is already taken',
    usernameCheckError: 'Failed to check username',
    
    // Buttons
    saveButton: 'Save',
    savingButton: 'Saving...',
    cancelButton: 'Cancel',
  },
  
  validation: {
    // Name validation errors
    nameRequired: 'Enter your name',
    nameMinLength: 'Name must be at least 2 characters',
    nameMaxLength: 'Name must not exceed 50 characters',
    
    // Username validation errors
    usernameRequired: 'Enter your username',
    
    // Bio validation errors
    bioMaxLength: 'Bio must not exceed 200 characters',
  }
} as const;