/**
 * Утилиты для работы с фото желаний в Supabase Storage
 */

import { supabase } from '@/shared/api';

const BUCKET_NAME = 'wishlist-item-photos';

/**
 * Загружает фото желания в Supabase Storage
 * @param itemId - ID желания
 * @param imageUrl - Data URL или blob URL изображения
 * @returns Публичный URL загруженного файла
 */
export async function uploadWishlistItemPhoto(
  itemId: string,
  imageUrl: string
): Promise<string> {
  try {
    // Конвертируем Data URL в Blob
    const blob = await fetch(imageUrl).then((r) => r.blob());
    
    // Определяем расширение файла
    const extension = blob.type.split('/')[1] || 'jpg';
    const fileName = `${itemId}.${extension}`;

    // Загружаем файл в Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true, // Перезаписываем если файл уже существует
      });

    if (error) {
      console.error('Ошибка загрузки фото в Storage:', error);
      throw new Error(`Ошибка загрузки фото в Storage: ${error.message}`);
    }

    // Получаем публичный URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Ошибка загрузки фото желания:', error);
    throw error;
  }
}

/**
 * Удаляет фото желания из Supabase Storage
 * @param itemId - ID желания
 */
export async function deleteWishlistItemPhoto(itemId: string): Promise<void> {
  try {
    // Получаем список всех файлов для данного желания (могут быть разные расширения)
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', {
        search: itemId,
      });

    if (listError) {
      console.error('Ошибка получения списка файлов:', listError);
      return; // Не бросаем ошибку - фото может не существовать
    }

    if (!files || files.length === 0) {
      return; // Фото не существует - это нормально
    }

    // Удаляем все найденные файлы
    const filePaths = files.map((file) => file.name);
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (deleteError) {
      console.error('Ошибка удаления фото из Storage:', deleteError);
      // Не бросаем ошибку - фото уже может быть удалено
    }
  } catch (error) {
    console.error('Ошибка при удалении фото желания:', error);
    // Не бросаем ошибку - это не критично
  }
}

/**
 * Обновляет фото желания - удаляет старое и загружает новое
 * @param itemId - ID желания
 * @param newImageUrl - Data URL или blob URL нового изображения
 * @param oldImageUrl - URL старого изображения (опционально)
 * @returns Публичный URL нового файла
 */
export async function updateWishlistItemPhoto(
  itemId: string,
  newImageUrl: string,
  oldImageUrl?: string | null
): Promise<string> {
  try {
    // Если есть старое фото - удаляем его
    if (oldImageUrl) {
      await deleteWishlistItemPhoto(itemId);
    }

    // Загружаем новое фото
    return await uploadWishlistItemPhoto(itemId, newImageUrl);
  } catch (error) {
    console.error('Ошибка обновления фото желания:', error);
    throw error;
  }
}
