export const createWishlistEn = {
  privacy: {
    public: {
      label: "Public",
      description: "Visible to all users"
    },
    friends: {
      label: "Friends only",
      description: "Visible to all your friends"
    },
    selected: {
      label: "Select friends",
      description: "Choose who can see"
    },
    private: {
      label: "Private",
      description: "Only for you"
    }
  },
  bookingVisibility: {
    show_names: {
      label: "Show names",
      description: "You will see who booked the gift"
    },
    hide_names: {
      label: "Hide names",
      description: "You will see that the gift is booked, but not by whom"
    },
    hide_all: {
      label: "Hide booking",
      description: "Bookings will be completely hidden"
    }
  },
  months: {
    genitive: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  },
  ui: {
    datePickerTitle: "Select date",
    datePickerConfirm: "Done",
    datePickerClear: "Clear",
    privacyDrawerTitle: "Select privacy",
    bookingVisibilityDrawerTitle: "Booking visibility",
    imageCropTitle: "Crop image",
    imageCropConfirm: "Done",
    imageCropZoomIn: "Zoom in",
    imageCropZoomOut: "Zoom out",
    removeCoverAria: "Remove cover",
    selectIconAria: "Select icon",
    titlePlaceholder: "Enter title...",
    descriptionPlaceholder: "Enter description...",
    eventDateLabel: "Event date",
    eventDateNotSet: "Not set",
    privacyLabel: "Privacy",
    bookingVisibilityLabel: "Booking visibility",
    groupGiftingLabel: "Allow group gifts",
    groupGiftingDescription: "Friends can create group gifts"
  },
  errors: {
    imageCropFailed: "Image crop failed:"
  }
} as const;
