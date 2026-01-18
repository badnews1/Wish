import React from 'react';
import { FormHeader } from '@/widgets/header';
import { RoundedButton, ConfirmDialog } from '@/shared/ui';
import { useTranslation } from '@/app';
import type { CreateWishlistForm } from '@/features/create-wishlist';
import { 
  useWishlistForm,
  DatePickerDrawer,
  PrivacySelectDrawer,
  BookingVisibilityDrawer,
  IconSelector,
  ImageCropDrawer,
  CoverImageSection,
  TitleWithIconSection,
  DescriptionSection,
  SettingsSection
} from '@/features/create-wishlist';
import type { WishlistFormPageProps } from '../model';

export function WishlistFormPage({ 
  onBack,
  onSubmit,
  onDelete,
  initialData,
  mode = 'create'
}: WishlistFormPageProps): JSX.Element {
  const { t } = useTranslation();
  const {
    formState,
    setTitle,
    setDescription,
    setCoverImage,
    drawers,
    handlers,
  } = useWishlistForm({ initialData, onSubmit });

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <FormHeader
        title={mode === 'edit' ? t('pages.wishlistForm.headerTitle.edit') : t('pages.wishlistForm.headerTitle.create')}
        onBack={onBack}
        onDelete={mode === 'edit' && onDelete ? () => drawers.deleteDialog.open() : undefined}
        ariaLabels={{
          back: t('pages.wishlistForm.backButtonAria'),
          delete: t('pages.wishlistForm.deleteButtonAria')
        }}
        className="flex-shrink-0"
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {/* Загрузка обложки */}
          <CoverImageSection
            coverImage={formState.coverImage}
            onUploadImage={handlers.handleUploadCoverImage}
            onRemoveImage={handlers.handleRemoveCoverImage}
          />

          {/* Поле названия с иконкой */}
          <TitleWithIconSection
            title={formState.title}
            selectedIconId={formState.selectedIconId}
            onTitleChange={setTitle}
            onIconClick={() => drawers.iconSelectorDrawer.open()}
          />

          {/* Поле описания */}
          <DescriptionSection
            description={formState.description}
            onDescriptionChange={setDescription}
          />

          {/* Карточка с настройками */}
          <SettingsSection
            eventDate={formState.eventDate}
            privacy={formState.privacy}
            bookingVisibility={formState.bookingVisibility}
            allowGroupGifting={formState.allowGroupGifting}
            onDateClick={() => drawers.calendarDrawer.open()}
            onPrivacyClick={() => drawers.privacyDrawer.open()}
            onBookingVisibilityClick={() => drawers.bookingVisibilityDrawer.open()}
            onGroupGiftingToggle={handlers.handleToggleGroupGifting}
          />
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-4 py-4 bg-white">
        <RoundedButton 
          label={mode === 'edit' ? t('pages.wishlistForm.submitButton.edit') : t('pages.wishlistForm.submitButton.create')} 
          isActive={true} 
          onClick={handlers.handleSubmit}
          variant="full"
        />
      </div>

      {/* Вложенные drawer'ы */}
      <DatePickerDrawer
        open={drawers.calendarDrawer.isOpen}
        onOpenChange={drawers.calendarDrawer.setOpen}
        selectedDate={formState.eventDate}
        onConfirm={handlers.handleConfirmDate}
      />

      <PrivacySelectDrawer
        open={drawers.privacyDrawer.isOpen}
        onOpenChange={drawers.privacyDrawer.setOpen}
        selected={formState.privacy}
        onSelect={handlers.handleSelectPrivacy}
      />

      <BookingVisibilityDrawer
        open={drawers.bookingVisibilityDrawer.isOpen}
        onOpenChange={drawers.bookingVisibilityDrawer.setOpen}
        selected={formState.bookingVisibility}
        onSelect={handlers.handleSelectBookingVisibility}
      />

      <IconSelector
        open={drawers.iconSelectorDrawer.isOpen}
        onOpenChange={drawers.iconSelectorDrawer.setOpen}
        selected={formState.selectedIconId}
        onSelect={handlers.handleSelectIcon}
      />

      <ImageCropDrawer
        open={drawers.cropDrawer.isOpen}
        onOpenChange={drawers.cropDrawer.setOpen}
        imageSrc={formState.originalImage || ''}
        onConfirm={handlers.handleCropConfirm}
      />

      {/* Диалог удаления */}
      <ConfirmDialog
        open={drawers.deleteDialog.isOpen}
        onOpenChange={drawers.deleteDialog.setOpen}
        title={t('pages.wishlistForm.deleteDialog.title')}
        description={t('pages.wishlistForm.deleteDialog.description')}
        confirmLabel={t('pages.wishlistForm.deleteDialog.confirm')}
        cancelLabel={t('pages.wishlistForm.deleteDialog.cancel')}
        variant="destructive"
        onConfirm={() => {
          drawers.deleteDialog.close();
          onDelete?.();
        }}
      />
    </div>
  );
}