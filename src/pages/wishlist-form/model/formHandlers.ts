import { useCallback } from 'react';
import { type PrivacyType, type BookingVisibilityType } from '../../../features/create-wishlist/config';
import type { CreateWishlistForm } from '../../../features/create-wishlist';

interface UseWishlistFormHandlersProps {
  // State values
  title: string;
  description: string;
  selectedIconId: string;
  eventDate: Date | undefined;
  privacy: PrivacyType;
  bookingVisibility: BookingVisibilityType;
  allowGroupGifting: boolean;
  coverImage: string | undefined;
  
  // State setters
  setEventDate: (date: Date | undefined) => void;
  setPrivacy: (privacy: PrivacyType) => void;
  setBookingVisibility: (visibility: BookingVisibilityType) => void;
  setSelectedIconId: (iconId: string) => void;
  setAllowGroupGifting: (value: boolean | ((prev: boolean) => boolean)) => void;
  
  // Callbacks
  onSubmit: (data: CreateWishlistForm) => void;
}

/**
 * Хук для управления обработчиками событий формы вишлиста
 * 
 * Содержит все callback функции для взаимодействия с формой
 */
export function useWishlistFormHandlers({
  title,
  description,
  selectedIconId,
  eventDate,
  privacy,
  bookingVisibility,
  allowGroupGifting,
  coverImage,
  setEventDate,
  setPrivacy,
  setBookingVisibility,
  setSelectedIconId,
  setAllowGroupGifting,
  onSubmit
}: UseWishlistFormHandlersProps) {
  
  // Form submission
  const handleSubmit = useCallback(() => {
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        eventDate: eventDate,
        privacy: privacy,
        bookingVisibility: bookingVisibility,
        allowGroupGifting: allowGroupGifting,
        iconId: selectedIconId,
        imageUrl: coverImage,
      });
    }
  }, [title, description, eventDate, privacy, bookingVisibility, allowGroupGifting, selectedIconId, coverImage, onSubmit]);

  // Date selection handler
  const handleConfirmDate = useCallback((date: Date | undefined) => {
    setEventDate(date);
  }, [setEventDate]);

  // Privacy selection handler
  const handleSelectPrivacy = useCallback((selectedPrivacy: PrivacyType) => {
    setPrivacy(selectedPrivacy);
  }, [setPrivacy]);

  // Booking visibility selection handler
  const handleSelectBookingVisibility = useCallback((selectedBookingVisibility: BookingVisibilityType) => {
    setBookingVisibility(selectedBookingVisibility);
  }, [setBookingVisibility]);

  // Icon selection handler
  const handleSelectIcon = useCallback((iconId: string) => {
    setSelectedIconId(iconId);
  }, [setSelectedIconId]);

  // Group gifting toggle handler
  const handleToggleGroupGifting = useCallback(() => {
    setAllowGroupGifting((prev) => !prev);
  }, [setAllowGroupGifting]);

  return {
    handleSubmit,
    handleConfirmDate,
    handleSelectPrivacy,
    handleSelectBookingVisibility,
    handleSelectIcon,
    handleToggleGroupGifting,
  };
}
