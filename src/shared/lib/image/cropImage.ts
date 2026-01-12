/**
 * Создает обрезанное изображение на основе области кропа
 */
export async function createCroppedImage(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Не удалось получить контекст canvas');
  }

  // Устанавливаем размеры canvas равными размерам обрезанной области
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Рисуем обрезанное изображение
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Возвращаем base64 data URL
  return canvas.toDataURL('image/jpeg', 0.95);
}

/**
 * Создает HTMLImageElement из src
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}
