/**
 * Утилиты для работы с Supabase Storage для обложек вишлистов
 */

import { supabase } from '@/shared/api';

const BUCKET_NAME = 'wishlist-covers';

/**
 * Проверяет, является ли строка base64/data URL
 */
function isBase64OrDataUrl(str: string): boolean {
  return str.startsWith('data:') || str.startsWith('blob:');
}

/**
 * Конвертирует data URL в File объект
 */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * Загружает обложку вишлиста в Storage
 * @param wishlistId - ID вишлиста
 * @param imageUrl - data URL или blob URL изображения
 * @returns Public URL загруженного изображения
 */
export async function uploadWishlistCover(
  wishlistId: string,
  imageUrl: string
): Promise<string> {
  // Если это уже Storage URL - возвращаем как есть
  if (!isBase64OrDataUrl(imageUrl)) {
    return imageUrl;
  }

  // Конвертируем data URL в File
  const file = await dataUrlToFile(imageUrl, `${wishlistId}.jpg`);
  
  // Загружаем в Storage (перезапишет старый файл если существует)
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`${wishlistId}.jpg`, file, {
      cacheControl: '3600',
      upsert: true, // Перезаписать если существует
    });

  if (uploadError) {
    throw new Error(`Ошибка загрузки обложки в Storage: ${uploadError.message}`);
  }

  // Получаем публичный URL
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${wishlistId}.jpg`);

  return data.publicUrl;
}

/**
 * Удаляет обложку вишлиста из Storage
 * @param wishlistId - ID вишлиста
 */
export async function deleteWishlistCover(wishlistId: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([`${wishlistId}.jpg`]);

  if (error) {
    console.error(`Ошибка удаления обложки из Storage: ${error.message}`);
    // Не бросаем ошибку, чтобы не блокировать удаление вишлиста
  }
}

/**
 * Обновляет обложку вишлиста (удаляет старую и загружает новую)
 * @param wishlistId - ID вишлиста
 * @param newImageUrl - новый data URL изображения
 * @param oldImageUrl - старый URL изображения (опционально)
 * @returns Public URL загруженного изображения
 */
export async function updateWishlistCover(
  wishlistId: string,
  newImageUrl: string,
  oldImageUrl?: string | null
): Promise<string> {
  // Если новое изображение - это уже Storage URL и оно не изменилось
  if (!isBase64OrDataUrl(newImageUrl)) {
    return newImageUrl;
  }

  // Если было старое изображение из Storage - удаляем его
  // (на самом деле upsert перезапишет, но для явности можно удалить)
  if (oldImageUrl && !isBase64OrDataUrl(oldImageUrl)) {
    await deleteWishlistCover(wishlistId);
  }

  // Загружаем новую обложку
  return await uploadWishlistCover(wishlistId, newImageUrl);
}
