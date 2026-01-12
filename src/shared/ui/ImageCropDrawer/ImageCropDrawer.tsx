import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '../../../components/ui/button';
import { BaseDrawer } from '../BaseDrawer';
import { RoundedButton } from '../RoundedButton';
import { Minus, Plus } from 'lucide-react';
import { createCroppedImage } from '../../lib';
import { useTranslation } from '../../lib/hooks';
import type { BaseDrawerProps } from '../../model';

interface ImageCropDrawerProps extends BaseDrawerProps {
  imageSrc: string;
  onConfirm: (croppedImage: string) => void;
  title: string;
  confirmLabel: string;
  aspect?: number; // undefined для свободных пропорций, 1 для квадрата
  objectFit?: 'horizontal-cover' | 'contain';
  containerClassName?: string;
}

export function ImageCropDrawer({ 
  open, 
  onOpenChange, 
  imageSrc, 
  onConfirm,
  title,
  confirmLabel,
  aspect = undefined,
  objectFit = 'horizontal-cover',
  containerClassName = 'relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden mb-6'
}: ImageCropDrawerProps) {
  const { t } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });

  const onCropComplete = useCallback(
    (croppedArea: unknown, croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImage = await createCroppedImage(imageSrc, croppedAreaPixels);
      onConfirm(croppedImage);
      onOpenChange(false);
    } catch (error) {
      console.error(t('imageCrop.error'), error);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 1));
  };

  // Для свободных пропорций нужен cropSize
  const needsCropSize = aspect === undefined;

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <RoundedButton 
          label={confirmLabel} 
          isActive={true} 
          onClick={handleConfirm}
          variant="full"
        />
      }
    >
      <div className="px-4 pb-4">
        {/* Область кропа */}
        <div
          className={containerClassName}
          ref={needsCropSize ? (el) => {
            if (el) {
              const { width, height } = el.getBoundingClientRect();
              if (width > 0 && height > 0 && (cropSize.width !== width || cropSize.height !== height)) {
                setCropSize({ width, height });
              }
            }
          } : undefined}
        >
          {needsCropSize ? (
            // Для свободных пропорций ждем инициализации cropSize
            cropSize.width > 0 && cropSize.height > 0 && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropSize={cropSize}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
                objectFit={objectFit}
                style={{
                  containerStyle: {
                    borderRadius: '0.75rem',
                  },
                  cropAreaStyle: {
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                  },
                }}
              />
            )
          ) : (
            // Для фиксированных пропорций cropSize не нужен
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={true}
              objectFit={objectFit}
              style={{
                containerStyle: {
                  borderRadius: '0.75rem',
                },
                cropAreaStyle: {
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                },
              }}
            />
          )}
        </div>

        {/* Контролы зума */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            variant="secondary"
            size="icon"
            shape="circle"
            aria-label={t('imageCrop.zoomOut')}
          >
            <Minus />
          </Button>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${((zoom - 1) / 2) * 100}%, #e5e7eb ${((zoom - 1) / 2) * 100}%, #e5e7eb 100%)`,
            }}
          />

          <Button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            variant="secondary"
            size="icon"
            shape="circle"
            aria-label={t('imageCrop.zoomIn')}
          >
            <Plus />
          </Button>
        </div>
      </div>
    </BaseDrawer>
  );
}