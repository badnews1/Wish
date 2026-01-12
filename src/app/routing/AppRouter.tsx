import { wishlistToFormData } from '@/features/create-wishlist';
import type { AppRouterProps } from './types';
import { HomePage } from '@/pages/home';
import { HomeRouter } from './HomeRouter';
import { WishlistPage } from '@/pages/wishlist';
import { WishlistDetailPage } from '@/pages/wishlist-detail';
import { WishlistFormPage } from '@/pages/wishlist-form';
import { WishlistItemDetailPage } from '@/pages/wishlist-item-detail';
import { WishlistItemFormPage } from '@/pages/wishlist-item-form';
import { CommunityPage } from '@/pages/community';
import { ProfilePage } from '@/pages/profile';

/**
 * Главный роутер приложения
 * Определяет, какую страницу отображать на основе currentView
 */
export function AppRouter(props: AppRouterProps) {
  const {
    currentView,
    activeMenuItem,
    selectedWishlistId,
    selectedWishlist,
    selectedItem,
    wishlists,
    wishlistFormMode,
    itemFormMode,
    navigateBack,
    navigateToCreateWishlist,
    navigateToEditWishlist,
    navigateToWishlistDetail,
    navigateToCreateItem,
    navigateToEditItem,
    navigateToItemDetail,
    handleCreateWishlist,
    handleUpdateWishlist,
    handleDeleteWishlist,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    updateWishlistItem,
    getCurrentHomeSubPage,
    handleHomeTabChange,
  } = props;

  // Утилита: получить список вишлистов для желания
  const getItemWishlists = () => {
    if (!selectedItem) return [];
    return wishlists
      .filter(w => selectedItem.wishlistIds.includes(w.id))
      .map(w => ({ id: w.id, title: w.title, iconId: w.iconId || '🎁' }));
  };

  // ФОРМЫ создания/редактирования (БЕЗ нижнего меню)
  if (currentView === 'wishlist-form') {
    return (
      <WishlistFormPage
        onBack={navigateBack}
        onSubmit={
          wishlistFormMode === 'create' 
            ? handleCreateWishlist
            : handleUpdateWishlist
        }
        onDelete={wishlistFormMode === 'edit' ? handleDeleteWishlist : undefined}
        initialData={
          wishlistFormMode === 'edit' && selectedWishlist 
            ? wishlistToFormData(selectedWishlist) 
            : undefined
        }
        mode={wishlistFormMode}
      />
    );
  }

  if (currentView === 'item-form') {
    return (
      <WishlistItemFormPage
        wishlists={wishlists}
        initialWishlistId={selectedWishlistId || undefined}
        initialData={itemFormMode === 'edit' ? selectedItem : undefined}
        onBack={navigateBack}
        onSubmit={
          itemFormMode === 'create'
            ? handleCreateItem
            : handleUpdateItem
        }
        onDelete={itemFormMode === 'edit' ? handleDeleteItem : undefined}
        mode={itemFormMode}
      />
    );
  }

  // ДЕТАЛЬНЫЕ страницы (С нижним меню)
  if (currentView === 'wishlist-detail' && selectedWishlist) {
    return (
      <WishlistDetailPage
        wishlist={selectedWishlist}
        onBack={navigateBack}
        onEdit={() => navigateToEditWishlist(selectedWishlist.id)}
        onAddItem={() => navigateToCreateItem(selectedWishlist.id)}
        onItemClick={(itemId) => navigateToItemDetail(selectedWishlist.id, itemId)}
      />
    );
  }

  if (currentView === 'item-detail' && selectedItem && selectedWishlistId) {
    return (
      <WishlistItemDetailPage
        item={selectedItem}
        wishlists={getItemWishlists()}
        onBack={navigateBack}
        onEdit={() => navigateToEditItem(selectedWishlistId, selectedItem.id)}
        onWishlistClick={(wishlistId) => navigateToWishlistDetail(wishlistId)}
        onToggleFulfilled={(isFulfilled) => {
          updateWishlistItem(selectedWishlistId, selectedItem.id, { isPurchased: isFulfilled });
        }}
      />
    );
  }

  // ОСНОВНЫЕ страницы (С нижним меню)
  return (
    <>
      {activeMenuItem === 'home' && (
        <HomePage 
          currentSubPage={getCurrentHomeSubPage()}
          onTabChange={handleHomeTabChange}
        >
          <HomeRouter 
            currentView={currentView}
            onCreateWishlist={navigateToCreateWishlist}
          />
        </HomePage>
      )}
      
      {activeMenuItem === 'wishlist' && (
        <WishlistPage
          wishlists={wishlists}
          onWishlistClick={navigateToWishlistDetail}
        />
      )}

      {activeMenuItem === 'community' && <CommunityPage />}

      {activeMenuItem === 'profile' && <ProfilePage />}
    </>
  );
}