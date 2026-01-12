import React from 'react';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

interface CardImageProps {
  imageUrl?: string;
  imageComponent?: React.ReactNode;
  alt: string;
}

export function CardImage({ imageUrl, imageComponent, alt }: CardImageProps) {
  return (
    <div className="flex-1 rounded-lg overflow-hidden flex items-center justify-center">
      {imageComponent ? (
        <div className="w-full h-full flex items-center justify-center">
          {imageComponent}
        </div>
      ) : imageUrl ? (
        <ImageWithFallback
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain"
        />
      ) : null}
    </div>
  );
}
