import { useState, useEffect, useCallback } from 'react';
import type { Wishlist, WishlistItem, GiftTag } from '../../../entities/wishlist';
import type { CreateWishlistItemForm } from '../../../features/create-wishlist-item';
import type { ParsedProduct } from '../../../features/product-parser';
import { useMultipleDrawers, useImageUploadCrop } from '../../../shared/lib';
import { createProductParsedHandler } from '../lib';
import { useTranslation } from '@/app';

interface UseWishlistItemFormProps {
  wishlists: Wishlist[];
  initialWishlistId?: string;
  initialData?: WishlistItem;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateWishlistItemForm) => void;
}

export function useWishlistItemForm({
  wishlists,
  initialWishlistId,
  initialData,
  mode,
  onSubmit
}: UseWishlistItemFormProps) {
  const { t } = useTranslation();
  
  // Form state
  const [wishlistIds, setWishlistIds] = useState<string[]>(
    initialWishlistId ? [initialWishlistId] : []
  );
  const [productUrl, setProductUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [currency, setCurrency] = useState<string | undefined>(undefined);
  const [giftTag, setGiftTag] = useState<GiftTag | undefined>('none');
  const [category, setCategory] = useState<string[]>([]);
  const [purchaseLocation, setPurchaseLocation] = useState<string | undefined>(undefined);
  
  // Drawer management
  const drawers = useMultipleDrawers({
    deleteDialog: false,
    cropDrawer: false,
  });

  // Image upload & crop flow (без сжатия для товаров)
  const itemImageUpload = useImageUploadCrop({
    maxSizeMB: 20,
    enableCompression: false,
    onImageProcessed: () => drawers.cropDrawer.open(),
    errorMessages: {
      invalidFormat: t('imageUpload.invalidFormat'),
      fileTooLarge: t('imageUpload.fileTooLarge', { maxSize: 20 }),
      fileTooLargeDescription: (size) => t('imageUpload.fileTooLargeDescription', { fileSize: size }),
      processingError: t('imageUpload.processingError')
    }
  });

  // Initialize form with initialData
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setProductUrl(initialData.link || '');
      setPrice(initialData.price);
      setCurrency(initialData.currency);
      setWishlistIds(initialData.wishlistIds || []);
      setGiftTag(initialData.giftTag);
      setCategory(initialData.category || []);
      setPurchaseLocation(initialData.purchaseLocation);
      
      // Инициализация изображения через хук
      if (initialData.imageUrl) {
        itemImageUpload.setFinalImage(initialData.imageUrl);
        itemImageUpload.setOriginalImage(initialData.imageUrl);
      }
    }
  }, [mode, initialData]);

  // Form submission
  const handleSubmit = useCallback(() => {
    // Валидация: хотя бы один вишлист должен быть выбран
    if (wishlistIds.length === 0) {
      return;
    }
    
    onSubmit({
      wishlistIds,
      title,
      description,
      imageUrl: itemImageUpload.finalImage,
      price,
      currency,
      link: productUrl || undefined,
      giftTag,
      category,
      purchaseLocation,
    });
  }, [wishlistIds, title, description, itemImageUpload.finalImage, price, currency, productUrl, giftTag, onSubmit, category, purchaseLocation]);

  // Product parser handler
  const handleProductParsed = useCallback(
    createProductParsedHandler(
      setTitle,
      setDescription,
      itemImageUpload.setFinalImage,
      setPrice,
      setCurrency
    ),
    [itemImageUpload]
  );

  return {
    // Form state
    formState: {
      wishlistIds,
      productUrl,
      title,
      description,
      imageUrl: itemImageUpload.finalImage,
      price,
      currency,
      originalImage: itemImageUpload.originalImage || '',
      giftTag,
      category,
      purchaseLocation,
    },

    // State setters
    setWishlistIds,
    setProductUrl,
    setTitle,
    setDescription,
    setPrice,
    setCurrency,
    setGiftTag,
    setCategory,
    setPurchaseLocation,

    // Drawers
    drawers,

    // Handlers
    handlers: {
      handleSubmit,
      handleProductParsed,
      handleImageUpload: itemImageUpload.handleUpload,
      handleRemoveImage: itemImageUpload.handleRemove,
      handleCropConfirm: itemImageUpload.handleCropConfirm,
    },
  };
}