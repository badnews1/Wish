import { useState, useEffect, useCallback } from 'react';
import { type PrivacyType, type BookingVisibilityType } from '../../../entities/wishlist';
import { DEFAULT_ICON_ID } from '../../../features/create-wishlist/config';
import type { CreateWishlistForm } from '../../../features/create-wishlist';
import { useMultipleDrawers, useImageUploadCrop, IMAGE_PRESETS } from '../../../shared/lib';
import { useWishlistFormState } from './formState';
import { useWishlistFormHandlers } from './formHandlers';

interface UseWishlistFormProps {
  initialData?: Partial<CreateWishlistForm>;
  onSubmit: (data: CreateWishlistForm) => void;
}

export function useWishlistForm({ initialData, onSubmit }: UseWishlistFormProps) {
  // Drawer management
  const drawers = useMultipleDrawers({
    calendarDrawer: false,
    privacyDrawer: false,
    bookingVisibilityDrawer: false,
    iconSelectorDrawer: false,
    cropDrawer: false,
    deleteDialog: false,
  });

  // Image upload & crop flow
  const coverImageUpload = useImageUploadCrop({
    compressionPreset: IMAGE_PRESETS.wishlistCover,
    maxSizeMB: 10,
    enableCompression: true,
    onImageProcessed: () => drawers.cropDrawer.open()
  });

  // Form state management
  const formStateHook = useWishlistFormState({
    initialData,
    setFinalImage: coverImageUpload.setFinalImage,
    setOriginalImage: coverImageUpload.setOriginalImage
  });

  // Form handlers
  const handlers = useWishlistFormHandlers({
    // State values
    title: formStateHook.state.title,
    description: formStateHook.state.description,
    selectedIconId: formStateHook.state.selectedIconId,
    eventDate: formStateHook.state.eventDate,
    privacy: formStateHook.state.privacy,
    bookingVisibility: formStateHook.state.bookingVisibility,
    allowGroupGifting: formStateHook.state.allowGroupGifting,
    coverImage: coverImageUpload.finalImage,
    
    // State setters
    setEventDate: formStateHook.setters.setEventDate,
    setPrivacy: formStateHook.setters.setPrivacy,
    setBookingVisibility: formStateHook.setters.setBookingVisibility,
    setSelectedIconId: formStateHook.setters.setSelectedIconId,
    setAllowGroupGifting: formStateHook.setters.setAllowGroupGifting,
    
    // Callbacks
    onSubmit
  });

  return {
    // Form state
    formState: {
      ...formStateHook.state,
      coverImage: coverImageUpload.finalImage,
      originalImage: coverImageUpload.originalImage,
    },
    
    // State setters
    setTitle: formStateHook.setters.setTitle,
    setDescription: formStateHook.setters.setDescription,
    setCoverImage: coverImageUpload.setFinalImage,
    
    // Drawers
    drawers,
    
    // Handlers
    handlers: {
      ...handlers,
      handleUploadCoverImage: coverImageUpload.handleUpload,
      handleRemoveCoverImage: coverImageUpload.handleRemove,
      handleCropConfirm: coverImageUpload.handleCropConfirm,
    },
  };
}