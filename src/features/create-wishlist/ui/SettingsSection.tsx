import React from 'react';
import { Separator } from '../../../components/ui/separator';
import { formatDate, useTranslation } from '../../../shared/lib';
import { ToggleSwitch, SelectButton } from '../../../shared/ui';
import { PRIVACY_OPTIONS, BOOKING_VISIBILITY_OPTIONS } from '../config';
import type { PrivacyType, BookingVisibilityType } from '../config';

interface SettingsSectionProps {
  eventDate?: Date;
  privacy: PrivacyType;
  bookingVisibility: BookingVisibilityType;
  allowGroupGifting: boolean;
  onDateClick: () => void;
  onPrivacyClick: () => void;
  onBookingVisibilityClick: () => void;
  onGroupGiftingToggle: () => void;
}

export function SettingsSection({
  eventDate,
  privacy,
  bookingVisibility,
  allowGroupGifting,
  onDateClick,
  onPrivacyClick,
  onBookingVisibilityClick,
  onGroupGiftingToggle
}: SettingsSectionProps) {
  const { t, language } = useTranslation();
  const currentPrivacy = PRIVACY_OPTIONS.find(opt => opt.id === privacy);
  const currentBookingVisibility = BOOKING_VISIBILITY_OPTIONS.find(opt => opt.id === bookingVisibility);

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden">
      {/* Настройка даты события */}
      <SelectButton
        label={t('createWishlist.ui.eventDateLabel')}
        value={eventDate ? formatDate(eventDate, language) : t('createWishlist.ui.eventDateNotSet')}
        onClick={onDateClick}
        valueClassName="text-gray-500"
      />

      <Separator />

      {/* Настройка приватности */}
      <SelectButton
        label={t('createWishlist.ui.privacyLabel')}
        value={currentPrivacy ? t(currentPrivacy.labelKey) : ''}
        onClick={onPrivacyClick}
        valueClassName="text-gray-500"
      />

      <Separator />

      {/* Настройка видимости бронирования */}
      <SelectButton
        label={t('createWishlist.ui.bookingVisibilityLabel')}
        value={currentBookingVisibility ? t(currentBookingVisibility.labelKey) : ''}
        onClick={onBookingVisibilityClick}
        valueClassName="text-gray-500"
      />

      <Separator />

      {/* Настройка групповых складчин */}
      <ToggleSwitch
        checked={allowGroupGifting}
        onChange={onGroupGiftingToggle}
        label={t('createWishlist.ui.groupGiftingLabel')}
        description={t('createWishlist.ui.groupGiftingDescription')}
        className="w-full px-4 py-4"
      />
    </div>
  );
}
