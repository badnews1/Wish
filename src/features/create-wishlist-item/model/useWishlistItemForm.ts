import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/app';
import type { Wishlist, WishlistItem, GiftTag } from '@/entities/wishlist';
import { DEFAULT_GIFT_TAG } from '@/entities/wishlist';
import type { CreateWishlistItemForm } from './types';
import { useMultipleDrawers, useImageUploadCrop, MAX_WISH_TITLE_LENGTH, MAX_WISH_DESCRIPTION_LENGTH } from '@/shared/lib';
import { createProductParsedHandler } from '../lib';

interface UseWishlistItemFormProps {
  wishlists: Wishlist[];
  initialWishlistId?: string;
  initialData?: WishlistItem;
  mode: 'create' | 'edit';
  onSubmit: (data: CreateWishlistItemForm) => void;
}

interface UseWishlistItemFormReturn {
  formState: {
    wishlistIds: string[];
    productUrl: string;
    title: string;
    description: string;
    imageUrl: string | undefined;
    price: number | undefined;
    currency: string | undefined;
    originalImage: string;
    giftTag: GiftTag | undefined;
    category: string[];
    purchaseLocation: string | undefined;
  };
  setWishlistIds: (ids: string[]) => void;
  setProductUrl: (url: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setPrice: (price: number | undefined) => void;
  setCurrency: (currency: string | undefined) => void;
  setGiftTag: (giftTag: GiftTag | undefined) => void;
  setCategory: (category: string[]) => void;
  setPurchaseLocation: (location: string | undefined) => void;
  drawers: ReturnType<typeof useMultipleDrawers<{
    deleteDialog: boolean;
    cropDrawer: boolean;
  }>>;
  handlers: {
    handleSubmit: () => void;
    handleProductParsed: (product: any) => void;
    handleImageUpload: (file: File) => Promise<void>;
    handleRemoveImage: () => void;
    handleCropConfirm: (croppedImage: string) => void;
  };
}

export function useWishlistItemForm({
  wishlists,
  initialWishlistId,
  initialData,
  mode,
  onSubmit
}: UseWishlistItemFormProps): UseWishlistItemFormReturn {
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
  const [giftTag, setGiftTag] = useState<GiftTag | undefined>(DEFAULT_GIFT_TAG);
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
      // Обрезаем название до максимальной длины (на случай старых данных)
      setTitle((initialData.title || '').slice(0, MAX_WISH_TITLE_LENGTH));
      setDescription((initialData.description || '').slice(0, MAX_WISH_DESCRIPTION_LENGTH));
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
  }, [mode, initialData, itemImageUpload.setFinalImage, itemImageUpload.setOriginalImage]);

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
    [itemImageUpload.setFinalImage]
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