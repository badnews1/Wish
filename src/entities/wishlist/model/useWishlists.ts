import { useState } from 'react';
import type { Wishlist, WishlistInput, WishlistItem, WishlistItemInput } from './types';
import { generateId, useLocalStorage } from '@/shared/lib';
import { WISHLIST_STORAGE_KEY } from '../config';

// Парсер для конвертации дат из строк в Date объекты
function parseWishlists(data: any[]): Wishlist[] {
  return data.map((wishlist: any) => ({
    ...wishlist,
    eventDate: wishlist.eventDate ? new Date(wishlist.eventDate) : undefined,
    createdAt: new Date(wishlist.createdAt),
  }));
}

export function useWishlists() {
  const [wishlists, setWishlists] = useLocalStorage<Wishlist[]>(
    WISHLIST_STORAGE_KEY, 
    [], 
    parseWishlists
  );

  const addWishlist = (formData: WishlistInput) => {
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

  const removeWishlist = (id: string) => {
    setWishlists(prev => prev.filter(w => w.id !== id));
  };

  const updateWishlist = (id: string, updates: Partial<Wishlist>) => {
    setWishlists(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const addWishlistItem = (wishlistIds: string[], item: WishlistItemInput) => {
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

  const updateWishlistItem = (wishlistId: string, itemId: string, updates: Partial<WishlistItem>) => {
    setWishlists(prev => prev.map(w => {
      if (w.items && w.items.some(item => item.id === itemId)) {
        return {
          ...w,
          items: w.items.map(item => item.id === itemId ? { ...item, ...updates } : item),
        };
      }
      return w;
    }));
  };

  const removeWishlistItem = (wishlistId: string, itemId: string) => {
    setWishlists(prev => prev.map(w => {
      if (w.items && w.items.some(item => item.id === itemId)) {
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
