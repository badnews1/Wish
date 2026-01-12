import { ItemImageSection } from './ItemImageSection';
import { ItemMainInfo } from './ItemMainInfo';
import { ItemCategories } from './ItemCategories';
import { ItemAdditionalInfo } from './ItemAdditionalInfo';
import { ItemWishlists } from './ItemWishlists';
import type { WishlistItemDetailPageProps } from '../model';

export function WishlistItemDetailPage({ 
  item, 
  wishlists = [],
  onBack,
  onEdit,
  onWishlistClick,
  onToggleFulfilled
}: WishlistItemDetailPageProps): JSX.Element {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Изображение товара */}
      <ItemImageSection
        imageUrl={item.imageUrl}
        title={item.title}
        giftTag={item.giftTag}
        onBack={onBack}
        onEdit={onEdit}
      />

      {/* Основная информация */}
      <ItemMainInfo
        title={item.title}
        description={item.description}
        price={item.price}
        currency={item.currency}
        link={item.link}
        isPurchased={item.isPurchased}
        onToggleFulfilled={onToggleFulfilled}
      />

      {/* Метки и категории */}
      <ItemCategories categories={item.category || []} />

      {/* Дополнительная информация */}
      <ItemAdditionalInfo purchaseLocation={item.purchaseLocation} />

      {/* Вишлисты */}
      <ItemWishlists wishlists={wishlists} onWishlistClick={onWishlistClick} />
    </div>
  );
}