import { generateId, useLocalStorage } from '@/shared/lib';
import type { Wishlist, WishlistInput, WishlistItem, WishlistItemInput } from './types';
import { WISHLIST_STORAGE_KEY } from '../config';
import { wishlistsArraySchema } from './schemas';

/**
 * Парсер для безопасной валидации и конвертации данных вишлистов
 * Использует zod для строгой проверки типов и преобразования дат из строк в Date объекты
 */
function parseWishlists(data: unknown[]): Wishlist[] {
  // Валидация с помощью zod - безопасно и строго типизировано
  const result = wishlistsArraySchema.safeParse(data);
  
  if (!result.success) {
    // Логируем ошибку валидации для debugging
    console.error('Failed to parse wishlists from localStorage:', result.error);
    // Возвращаем пустой массив при ошибке валидации
    return [];
  }
  
  return result.data;
}

interface UseWishlistsReturn {
  wishlists: Wishlist[];
  addWishlist: (formData: WishlistInput) => Wishlist;
  removeWishlist: (id: string) => void;
  updateWishlist: (id: string, updates: Partial<Wishlist>) => void;
  addWishlistItem: (wishlistIds: string[], item: WishlistItemInput) => WishlistItem;
  updateWishlistItem: (wishlistId: string, itemId: string, updates: Partial<WishlistItem>) => void;
  removeWishlistItem: (wishlistId: string, itemId: string) => void;
}

export function useWishlists(): UseWishlistsReturn {
  const [wishlists, setWishlists] = useLocalStorage<Wishlist[]>(
    WISHLIST_STORAGE_KEY, 
    [], 
    parseWishlists
  );

  const addWishlist = (formData: WishlistInput): Wishlist => {
    const newWishlist: Wishlist = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      iconId: formData.iconId,
      imageUrl: formData.imageUrl,
      eventDate: formData.eventDate,
      privacy: formData.privacy,
      bookingVisibility: formData.bookingVisibility,
      allowGroupGifting: formData.allowGroupGifting,
      itemCount: 0,
      createdAt: new Date(),
    };

    setWishlists(prev => [...prev, newWishlist]);
    return newWishlist;
  };

  const removeWishlist = (id: string): void => {
    setWishlists(prev => prev.filter(w => w.id !== id));
  };

  const updateWishlist = (id: string, updates: Partial<Wishlist>): void => {
    setWishlists(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const addWishlistItem = (wishlistIds: string[], item: WishlistItemInput): WishlistItem => {
    const newItem: WishlistItem = {
      id: generateId(),
      ...item,
      wishlistIds,
    };

    setWishlists(prev => prev.map(w => {
      if (wishlistIds.includes(w.id)) {
        const items = w.items || [];
        return { 
          ...w, 
          items: [...items, newItem],
          itemCount: items.length + 1,
        };
      }
      return w;
    }));

    return newItem;
  };

  const updateWishlistItem = (wishlistId: string, itemId: string, updates: Partial<WishlistItem>): void => {
    setWishlists(prev => prev.map(w => {
      // Обновляем item только в указанном вишлисте для оптимизации и безопасности
      if (w.id === wishlistId && w.items && w.items.some(item => item.id === itemId)) {
        return {
          ...w,
          items: w.items.map(item => item.id === itemId ? { ...item, ...updates } : item),
        };
      }
      return w;
    }));
  };

  const removeWishlistItem = (wishlistId: string, itemId: string): void => {
    setWishlists(prev => prev.map(w => {
      // Удаляем item только из указанного вишлиста для оптимизации и безопасности
      if (w.id === wishlistId && w.items && w.items.some(item => item.id === itemId)) {
        const newItems = w.items.filter(item => item.id !== itemId);
        return {
          ...w,
          items: newItems,
          itemCount: newItems.length,
        };
      }
      return w;
    }));
  };

  return {
    wishlists,
    addWishlist,
    removeWishlist,
    updateWishlist,
    addWishlistItem,
    updateWishlistItem,
    removeWishlistItem,
  };
}