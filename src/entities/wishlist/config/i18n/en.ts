export const wishlistEn = {
  card: {
    noImage: "No photo",
    linkButton: "Link",
    statusPurchased: "Purchased",
    statusAvailable: "Available"
  },
  notifications: {
    wishlist: {
      created: "Wishlist created successfully!",
      updated: "Wishlist updated successfully!",
      deleted: "Wishlist deleted successfully!",
      errorCreate: "Error creating wishlist",
      errorUpdate: "Error updating wishlist",
      errorDelete: "Error deleting wishlist",
      errorLoad: "Error loading wishlists"
    },
    wish: {
      created: "Wish added!",
      updated: "Wish updated!",
      deleted: "Wish deleted!",
      error: "An error occurred while working with the wish",
      errorCreate: "Error adding wish",
      errorUpdate: "Error updating wish",
      errorDelete: "Error deleting wish"
    }
  },
  giftTags: {
    none: "No tag",
    reallyWant: "Really want",
    wouldBeNice: "Would be nice",
    thinking: "Thinking",
    buyMyself: "Buy myself"
  },
  itemCount: {
    one: "wish",
    few: "wishes",
    many: "wishes",
    other: "wishes"
  }
} as const;