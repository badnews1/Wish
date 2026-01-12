import { WishlistCover } from './WishlistCover';
import { WishlistInfo } from './WishlistInfo';
import { WishlistItemsList } from './WishlistItemsList';
import type { WishlistDetailPageProps } from '../model';

export function WishlistDetailPage({ 
  wishlist, 
  onBack,
  onEdit,
  onAddItem,
  onItemClick
}: WishlistDetailPageProps) {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Обложка вишлиста */}
      <WishlistCover
        imageUrl={wishlist.imageUrl}
        backgroundColor={wishlist.backgroundColor}
        title={wishlist.title}
        onBack={onBack}
        onEdit={onEdit}
      />

      {/* Информация о вишлисте */}
      <WishlistInfo
        title={wishlist.title}
        description={wishlist.description}
        eventDate={wishlist.eventDate}
        itemCount={wishlist.itemCount || 0}
        privacy={wishlist.privacy || 'public'}
        favoriteCount={wishlist.favoriteCount || 0}
      />

      {/* Список желаний с табами */}
      <WishlistItemsList
        items={wishlist.items || []}
        onItemClick={onItemClick}
      />
    </div>
  );
}