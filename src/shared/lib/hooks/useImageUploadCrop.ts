import { useState, useCallback } from 'react';
import { compressImage, isValidImageFile, checkImageSize, notifications, type ImageCompressionOptions } from '../';

interface UseImageUploadCropOptions {
  /** Пресет для сжатия изображения */
  compressionPreset?: ImageCompressionOptions;
  
  /** Максимальный размер файла в MB (по умолчанию 10MB) */
  maxSizeMB?: number;
  
  /** Callback при успешной загрузке и сжатии (перед crop) */
  onImageProcessed?: (imageUrl: string) => void;
  
  /** Автоматически открыть crop drawer после загрузки */
  autoOpenCrop?: boolean;
  
  /** Нужно ли сжатие (по умолчанию true для wishlist cover, false для item images) */
  enableCompression?: boolean;
  
  /** Тексты для ошибок (должны передаваться из компонента с доступом к useTranslation) */
  errorMessages?: {
    invalidFormat: string;
    fileTooLarge: string;
    fileTooLargeDescription: (fileSize: string) => string;
    processingError: string;
  };
}

interface UseImageUploadCropReturn {
  /** URL оригинального изображения (для crop drawer) */
  originalImage: string | undefined;
  
  /** URL финального изображения (после crop) */
  finalImage: string | undefined;
  
  /** Обработчик загрузки файла */
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /** Обработчик подтверждения crop */
  handleCropConfirm: (croppedImage: string) => void;
  
  /** Обработчик удаления изображения */
  handleRemove: () => void;
  
  /** Сеттер для финального изображения (если нужно установить вручную) */
  setFinalImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  
  /** Сеттер для оригинального изображения */
  setOriginalImage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

/**
 * Универсальный хук для управления flow загрузки и обрезки изображений
 * 
 * ВАЖНО: shared компоненты НЕ могут импортировать useTranslation из app.
 * Все тексты ошибок должны передаваться через errorMessages в options.
 * 
 * Управляет процессом:
 * 1. Загрузка файла → валидация (тип, размер)
 * 2. (Опционально) Сжатие изображения
 * 3. Установка originalImage для crop drawer
 * 4. После crop → сохранение finalImage
 * 
 * @example
 * // Для обложки вишлиста (с сжатием)
 * const imageUpload = useImageUploadCrop({
 *   compressionPreset: IMAGE_PRESETS.wishlistCover,
 *   maxSizeMB: 10,
 *   enableCompression: true,
 *   onImageProcessed: () => cropDrawer.open(),
 *   errorMessages: {
 *     invalidFormat: t('imageUpload.invalidFormat'),
 *     fileTooLarge: t('imageUpload.fileTooLarge', { maxSize: 10 }),
 *     fileTooLargeDescription: (size) => t('imageUpload.fileTooLargeDescription', { fileSize: size }),
 *     processingError: t('imageUpload.processingError')
 *   }
 * });
 * 
 * @example
 * // Для фото товара (без сжатия, простое crop)
 * const imageUpload = useImageUploadCrop({
 *   maxSizeMB: 20,
 *   enableCompression: false,
 *   onImageProcessed: () => cropDrawer.open(),
 *   errorMessages: { ... }
 * });
 */
export function useImageUploadCrop({
  compressionPreset,
  maxSizeMB = 10,
  onImageProcessed,
  enableCompression = true,
  errorMessages
}: UseImageUploadCropOptions = {}): UseImageUploadCropReturn {
  const [originalImage, setOriginalImage] = useState<string | undefined>();
  const [finalImage, setFinalImage] = useState<string | undefined>();

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!isValidImageFile(file)) {
      if (errorMessages?.invalidFormat) {
        notifications.common.error(errorMessages.invalidFormat);
      }
      e.target.value = '';
      return;
    }

    // Проверяем размер файла
    if (!checkImageSize(file, maxSizeMB)) {
      if (errorMessages?.fileTooLarge) {
        const fileSize = (file.size / (1024 * 1024)).toFixed(1);
        notifications.common.error(
          errorMessages.fileTooLarge,
          errorMessages.fileTooLargeDescription 
            ? { description: errorMessages.fileTooLargeDescription(fileSize) }
            : undefined
        );
      }
      e.target.value = '';
      return;
    }

    try {
      let imageUrl: string;

      if (enableCompression && compressionPreset) {
        // Сжимаем изображение с пресетом
        imageUrl = await compressImage(file, compressionPreset);
      } else {
        // Простое чтение без сжатия
        imageUrl = await readFileAsDataURL(file);
      }

      setOriginalImage(imageUrl);
      setFinalImage(imageUrl); // Устанавливаем как финальное на случай, если crop не будет
      
      // Вызываем callback (обычно открывает crop drawer)
      onImageProcessed?.(imageUrl);
      
      // Очищаем input для возможности повторной загрузки того же файла
      e.target.value = '';
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      if (errorMessages?.processingError) {
        notifications.common.error(errorMessages.processingError);
      }
      e.target.value = '';
    }
  }, [compressionPreset, maxSizeMB, onImageProcessed, enableCompression, errorMessages]);

  const handleCropConfirm = useCallback((croppedImage: string) => {
    setFinalImage(croppedImage);
  }, []);

  const handleRemove = useCallback(() => {
    setOriginalImage(undefined);
    setFinalImage(undefined);
  }, []);

  return {
    originalImage,
    finalImage,
    handleUpload,
    handleCropConfirm,
    handleRemove,
    setFinalImage,
    setOriginalImage
  };
}

/**
 * Вспомогательная функция для чтения файла как Data URL
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}