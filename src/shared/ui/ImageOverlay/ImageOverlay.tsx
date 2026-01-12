import React, { ReactNode } from 'react';
import { Upload } from 'lucide-react';

type ImageOverlaySize = 'sm' | 'md' | 'lg' | 'full';
type ImageOverlayPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center';

interface ImageOverlayProps {
  /** URL изображения. Если не передан, показывается пустое состояние */
  imageUrl?: string;
  
  /** Alt текст для изображения */
  alt?: string;
  
  /** Размер контейнера */
  size?: ImageOverlaySize;
  
  /** Кастомная высота (переопределяет size) */
  height?: string;
  
  /** Кастомная ширина (переопределяет size) */
  width?: string;
  
  /** Overlay кнопка (например, кнопка удаления) */
  overlayButton?: ReactNode;
  
  /** Позиция overlay кнопки */
  overlayPosition?: ImageOverlayPosition;
  
  /** Дополнительные overlay элементы (массив с позициями) */
  overlayElements?: Array<{
    element: ReactNode;
    position: ImageOverlayPosition;
  }>;
  
  /** Пустое состояние - ID для input type="file" */
  uploadInputId?: string;
  
  /** Обработчик загрузки файла */
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  /** Текст для пустого состояния */
  emptyStateText?: string;
  
  /** Подпись для пустого состояния (маленький текст) */
  emptyStateSubtext?: string;
  
  /** Цвет фона для пустого состояния или когда нет изображения */
  backgroundColor?: string;
  
  /** Скругление углов */
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  /** Дополнительные CSS классы */
  className?: string;
  
  /** CSS стиль для background-size (по умолчанию 'cover') */
  backgroundSize?: 'cover' | 'contain';
  
  /** Кастомный контент для пустого состояния (когда нет изображения) */
  emptyStateContent?: ReactNode;
}

const SIZE_MAP: Record<ImageOverlaySize, string> = {
  sm: 'h-32 w-32',
  md: 'h-48 w-48',
  lg: 'h-64 w-full',
  full: 'h-full w-full'
};

const POSITION_MAP: Record<ImageOverlayPosition, string> = {
  'top-left': 'top-6 left-4',
  'top-right': 'top-6 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'top-center': 'top-6 left-1/2 -translate-x-1/2'
};

const ROUNDED_MAP = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
};

const BG_SIZE_CLASS = {
  cover: 'bg-cover',
  contain: 'bg-contain'
} as const;

/**
 * Универсальный компонент для отображения изображения с overlay кнопками
 * 
 * ВАЖНО: shared компоненты НЕ могут импортировать useTranslation из app.
 * Все тексты должны передаваться через пропсы.
 * 
 * @example
 * // Изображение с кнопкой удаления в правом верхнем углу
 * <ImageOverlay
 *   imageUrl="/image.jpg"
 *   alt="Описание"
 *   size="lg"
 *   overlayButton={<Button onClick={handleDelete}><X /></Button>}
 *   overlayPosition="top-right"
 * />
 * 
 * @example
 * // Пустое состояние с загрузкой
 * <ImageOverlay
 *   uploadInputId="cover-image"
 *   onUpload={handleUpload}
 *   emptyStateText="Загрузить обложку"
 *   size="lg"
 * />
 * 
 * @example
 * // Множественные overlay элементы
 * <ImageOverlay
 *   imageUrl="/image.jpg"
 *   overlayElements={[
 *     { element: <BackButton />, position: 'top-left' },
 *     { element: <EditButton />, position: 'top-right' }
 *   ]}
 * />
 */
export function ImageOverlay({
  imageUrl,
  alt = '',
  size = 'lg',
  height,
  width,
  overlayButton,
  overlayPosition = 'top-right',
  overlayElements,
  uploadInputId,
  onUpload,
  emptyStateText,
  emptyStateSubtext,
  backgroundColor = '#f3f4f6',
  rounded = 'xl',
  className = '',
  backgroundSize = 'cover',
  emptyStateContent
}: ImageOverlayProps) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.lg;
  const roundedClass = ROUNDED_MAP[rounded];
  
  const containerStyle: React.CSSProperties = {
    ...(height && { height }),
    ...(width && { width })
  };

  // Пустое состояние с загрузкой
  if (!imageUrl && uploadInputId && onUpload) {
    return (
      <label
        htmlFor={uploadInputId}
        className={`${sizeClass} bg-gray-100 ${roundedClass} flex flex-col items-center justify-center cursor-pointer transition-colors active:bg-gray-200 ${className}`}
        style={containerStyle}
      >
        <Upload size={24} className="text-gray-400 mb-2" />
        {emptyStateText && (
          <span className="text-sm text-gray-500 text-center px-2">{emptyStateText}</span>
        )}
        {emptyStateSubtext && (
          <span className="text-xs text-gray-400 text-center px-2 mt-1">{emptyStateSubtext}</span>
        )}
        <input
          id={uploadInputId}
          type="file"
          accept="image/*"
          onChange={onUpload}
          className="hidden"
        />
      </label>
    );
  }

  // Изображение с overlay элементами
  return (
    <div
      className={`relative ${sizeClass} ${roundedClass} overflow-hidden ${className}`}
      style={containerStyle}
    >
      {imageUrl ? (
        <div
          className={`w-full h-full ${BG_SIZE_CLASS[backgroundSize]} bg-center`}
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            backgroundSize
          }}
          role="img"
          aria-label={alt}
        />
      ) : (
        <div
          className="w-full h-full"
          style={{ backgroundColor }}
        >
          {emptyStateContent}
        </div>
      )}

      {/* Одиночная overlay кнопка */}
      {overlayButton && (
        <div className={`absolute ${POSITION_MAP[overlayPosition]}`}>
          {overlayButton}
        </div>
      )}

      {/* Множественные overlay элементы */}
      {overlayElements?.map((item) => (
        <div key={item.position} className={`absolute ${POSITION_MAP[item.position]}`}>
          {item.element}
        </div>
      ))}
    </div>
  );
}