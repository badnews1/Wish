import { toast } from 'sonner@2.0.3';
import { getTranslation } from '../../config/i18n';
import { useLanguageStore } from '../../store';

/**
 * Уведомления для Wishlist и WishlistItem
 * Размещены в app/lib так как используют глобальный стор и getTranslation из app
 */
export const wishlistNotifications = {
  wishlist: {
    created: () => {
      const { language } = useLanguageStore.getState();
      toast.success(getTranslation(language, 'wishlist.notifications.wishlist.created'));
    },
    updated: () => {
      const { language } = useLanguageStore.getState();
      toast.success(getTranslation(language, 'wishlist.notifications.wishlist.updated'));
    },
    deleted: () => {
      const { language } = useLanguageStore.getState();
      toast.success(getTranslation(language, 'wishlist.notifications.wishlist.deleted'));
    },
    error: (message?: string) => {
      const { language } = useLanguageStore.getState();
      const defaultMsg = getTranslation(language, 'wishlist.notifications.wishlist.error');
      toast.error(message || defaultMsg);
    },
  },
  
  wish: {
    created: () => {
      const { language } = useLanguageStore.getState();
      toast.success(getTranslation(language, 'wishlist.notifications.wish.created'));
    },
    updated: () => {
      const { language } = useLanguageStore.getState();
      toast.success(getTranslation(language, 'wishlist.notifications.wish.updated'));
    },
    deleted: () => {
      const { language } = useLanguageStore.getState();
      toast.success(getTranslation(language, 'wishlist.notifications.wish.deleted'));
    },
    error: (message?: string) => {
      const { language } = useLanguageStore.getState();
      const defaultMsg = getTranslation(language, 'wishlist.notifications.wish.error');
      toast.error(message || defaultMsg);
    },
  },
};
