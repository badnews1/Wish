/**
 * Конвертеры данных между различными типами форм и бизнес-моделей
 * @module app/routing/converters
 */

import type { CreateWishlistForm } from '@/features/create-wishlist';
import type { WishlistInput } from '@/entities/wishlist';
import type { CreateWishlistItemForm } from '@/features/create-wishlist-item';
import type { WishlistItemInput } from '@/entities/wishlist';

/**
 * Конвертирует данные формы создания вишлиста в формат для сохранения
 */
export function convertWishlistFormToInput(data: CreateWishlistForm): WishlistInput {
  return {
    title: data.title,
    description: data.description,
    iconId: data.iconId,
    imageUrl: data.imageUrl,
    eventDate: data.eventDate,
    privacy: data.privacy,
    bookingVisibility: data.bookingVisibility,
    allowGroupGifting: data.allowGroupGifting,
  };
}

/**
 * Конвертирует данные формы создания желания в формат для сохранения
 */
export function convertItemFormToInput(data: CreateWishlistItemForm): WishlistItemInput {
  return {
    title: data.title,
    price: data.price,
    currency: data.currency,
    imageUrl: data.imageUrl,
    link: data.link,
    description: data.description,
    giftTag: data.giftTag,
  };
}