import { useState, useEffect } from 'react';
import { type PrivacyType, type BookingVisibilityType } from '../../../entities/wishlist';
import { DEFAULT_ICON_ID } from '../../../features/create-wishlist/config';
import type { CreateWishlistForm } from '../../../features/create-wishlist';

interface UseWishlistFormStateProps {
  initialData?: Partial<CreateWishlistForm>;
  setFinalImage: (image: string | undefined) => void;
  setOriginalImage: (image: string | undefined) => void;
}

/**
 * Хук для управления состоянием формы вишлиста
 * 
 * Управляет всеми полями формы и их инициализацией
 */
export function useWishlistFormState({
  initialData,
  setFinalImage,
  setOriginalImage
}: UseWishlistFormStateProps) {
  // Form fields state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIconId, setSelectedIconId] = useState(DEFAULT_ICON_ID);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [privacy, setPrivacy] = useState<PrivacyType>('public');
  const [bookingVisibility, setBookingVisibility] = useState<BookingVisibilityType>('show_names');
  const [allowGroupGifting, setAllowGroupGifting] = useState(true);

  // Initialize form with initialData
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setSelectedIconId(initialData.iconId || DEFAULT_ICON_ID);
      
      // Инициализация изображения через переданные setters
      if (initialData.imageUrl) {
        setFinalImage(initialData.imageUrl);
        setOriginalImage(initialData.imageUrl);
      }
      
      setEventDate(initialData.eventDate);
      setPrivacy(initialData.privacy || 'public');
      setBookingVisibility(initialData.bookingVisibility || 'show_names');
      setAllowGroupGifting(initialData.allowGroupGifting ?? true);
    }
  }, [initialData, setFinalImage, setOriginalImage]);

  return {
    // State values
    state: {
      title,
      description,
      selectedIconId,
      eventDate,
      privacy,
      bookingVisibility,
      allowGroupGifting,
    },
    
    // State setters
    setters: {
      setTitle,
      setDescription,
      setSelectedIconId,
      setEventDate,
      setPrivacy,
      setBookingVisibility,
      setAllowGroupGifting,
    }
  };
}