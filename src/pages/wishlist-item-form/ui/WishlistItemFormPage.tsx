import React from 'react';
import { FormHeader } from '../../../widgets/Header';
import { RoundedButton, ConfirmDialog } from '../../../shared/ui';
import { useTranslation } from '../../../shared/lib/hooks';
import { 
  ItemTitleSection,
  ItemSettingsSection,
  ItemImageCropDrawer,
  PriceInput,
  WishlistSelectSection,
} from '../../../features/create-wishlist-item/ui';
import { ProductUrlInput } from '../../../features/product-parser';
import type { Wishlist, WishlistItem } from '../../../entities/wishlist';
import type { WishlistItemFormPageProps } from '../model';
import { useWishlistItemForm } from '../model';

export function WishlistItemFormPage({ 
  wishlists,
  initialWishlistId,
  initialData,
  onBack,
  onSubmit,
  onDelete,
  mode = 'create'
}: WishlistItemFormPageProps) {
  const { t } = useTranslation();
  const {
    formState,
    setWishlistIds,
    setProductUrl,
    setTitle,
    setDescription,
    setPrice,
    setCurrency,
    setGiftTag,
    setCategory,
    setPurchaseLocation,
    drawers,
    handlers,
  } = useWishlistItemForm({
    wishlists,
    initialWishlistId,
    initialData,
    mode,
    onSubmit
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <FormHeader
        title={mode === 'edit' ? t('pages.wishlistItemForm.headerTitle.edit') : t('pages.wishlistItemForm.headerTitle.create')}
        onBack={onBack}
        onDelete={mode === 'edit' && onDelete ? () => drawers.deleteDialog.open() : undefined}
        ariaLabels={{
          back: t('pages.wishlistItemForm.backButtonAria'),
          delete: t('pages.wishlistItemForm.deleteButtonAria')
        }}
        className="flex-shrink-0"
      />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {/* Выбор вишлиста */}
          <WishlistSelectSection
            wishlists={wishlists}
            selectedWishlistIds={formState.wishlistIds}
            onWishlistsChange={setWishlistIds}
          />

          {/* Блок ссылки на товар */}
          <ProductUrlInput
            value={formState.productUrl}
            onChange={setProductUrl}
            onParsed={handlers.handleProductParsed}
          />

          {/* Фото + Название + Описание */}
          <ItemTitleSection
            title={formState.title}
            description={formState.description}
            imageUrl={formState.imageUrl}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onUploadImage={handlers.handleImageUpload}
            onRemoveImage={handlers.handleRemoveImage}
          />

          {/* Настройка цены */}
          <PriceInput
            price={formState.price}
            currency={formState.currency}
            onPriceChange={setPrice}
            onCurrencyChange={setCurrency}
          />

          {/* Карточка с настройками */}
          <ItemSettingsSection 
            selectedGiftTag={formState.giftTag}
            onGiftTagChange={setGiftTag}
            selectedCategory={formState.category}
            onCategoryChange={setCategory}
            purchaseLocation={formState.purchaseLocation}
            onPurchaseLocationChange={setPurchaseLocation}
          />
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="flex-shrink-0 px-4 py-4 bg-white">
        <RoundedButton 
          label={mode === 'edit' ? t('pages.wishlistItemForm.submitButton.edit') : t('pages.wishlistItemForm.submitButton.create')} 
          isActive={formState.wishlistIds.length > 0} 
          onClick={handlers.handleSubmit}
          variant="full"
          disabled={formState.wishlistIds.length === 0}
        />
      </div>

      {/* Диалог удаления */}
      <ConfirmDialog
        open={drawers.deleteDialog.isOpen}
        onOpenChange={drawers.deleteDialog.setOpen}
        title={t('pages.wishlistItemForm.deleteDialog.title')}
        description={t('pages.wishlistItemForm.deleteDialog.description')}
        confirmLabel={t('pages.wishlistItemForm.deleteDialog.confirm')}
        cancelLabel={t('pages.wishlistItemForm.deleteDialog.cancel')}
        variant="destructive"
        onConfirm={() => {
          drawers.deleteDialog.close();
          onDelete?.();
        }}
      />

      {/* Drawer для обрезки изображения */}
      <ItemImageCropDrawer
        open={drawers.cropDrawer.isOpen}
        onOpenChange={drawers.cropDrawer.setOpen}
        imageSrc={formState.originalImage}
        onConfirm={handlers.handleCropConfirm}
      />
    </div>
  );
}