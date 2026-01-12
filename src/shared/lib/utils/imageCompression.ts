/**
 * Утилиты для сжатия и изменения размера изображений
 */

export interface ImageCompressionOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number; // 0.0 - 1.0
  targetSizeKB?: number; // Опциональный целевой размер в KB
}

/**
 * Предустановленные настройки для разных типов изображений
 */
export const IMAGE_PRESETS = {
  // Обложка вишлиста: 1200x800px, качество 0.85, ~200-300KB
  wishlistCover: {
    maxWidth: 1200,
    maxHeight: 800,
    quality: 0.85,
    targetSizeKB: 300,
  } as ImageCompressionOptions,

  // Фото желания: 800x800px (квадрат), качество 0.8, ~150-200KB
  wishItem: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.8,
    targetSizeKB: 200,
  } as ImageCompressionOptions,
} as const;

/**
 * Сжимает и изменяет размер изображения
 * @param file - Исходный файл изображения
 * @param options - Параметры сжатия
 * @returns Promise с base64 строкой сжатого изображения
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Вычисляем новые размеры с сохранением пропорций
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > options.maxWidth || height > options.maxHeight) {
          if (aspectRatio > options.maxWidth / options.maxHeight) {
            // Ограничиваем по ширине
            width = options.maxWidth;
            height = width / aspectRatio;
          } else {
            // Ограничиваем по высоте
            height = options.maxHeight;
            width = height * aspectRatio;
          }
        }

        // Создаем canvas для ресайза
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Не удалось получить 2D контекст canvas'));
          return;
        }

        // Улучшенное качество отрисовки
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Рисуем изображение с новыми размерами
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем в base64 с заданным качеством
        let quality = options.quality;
        let result = canvas.toDataURL('image/jpeg', quality);

        // Если указан целевой размер, пытаемся его достичь
        if (options.targetSizeKB) {
          const targetBytes = options.targetSizeKB * 1024;
          let currentSize = Math.round((result.length * 3) / 4); // Приблизительный размер base64

          // Если размер превышает целевой, уменьшаем качество
          while (currentSize > targetBytes && quality > 0.1) {
            quality -= 0.05;
            result = canvas.toDataURL('image/jpeg', quality);
            currentSize = Math.round((result.length * 3) / 4);
          }

          const finalSizeKB = Math.round(currentSize / 1024);
          console.log(
            `✅ Изображение сжато: ${width}x${height}px, ${finalSizeKB}KB (качество: ${Math.round(quality * 100)}%)`
          );
        } else {
          const currentSize = Math.round((result.length * 3) / 4);
          const finalSizeKB = Math.round(currentSize / 1024);
          console.log(
            `✅ Изображение обработано: ${width}x${height}px, ${finalSizeKB}KB (качество: ${Math.round(quality * 100)}%)`
          );
        }

        resolve(result);
      };

      img.onerror = () => {
        reject(new Error('Не удалось загрузить изображение'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Проверяет, является ли файл допустимым изображением
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Получает размер base64 строки в KB
 */
export function getBase64SizeKB(base64: string): number {
  return Math.round((base64.length * 3) / 4 / 1024);
}

/**
 * Проверяет размер изображения
 */
export function checkImageSize(file: File, maxSizeMB: number = 10): boolean {
  return file.size <= maxSizeMB * 1024 * 1024;
}