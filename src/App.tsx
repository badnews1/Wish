import { useWishlists } from './entities/wishlist';
import { useAppNavigation, useBottomMenuNavigation, useHomeTabsLogic, AppRouter, useWishlistActions, useItemActions } from './app';
import { BottomMenu } from './widgets/BottomMenu';

function App() {
  const { wishlists, addWishlist, updateWishlist, removeWishlist, addWishlistItem, updateWishlistItem, removeWishlistItem } = useWishlists();

  // Main navigation with callbacks
  const navigation = useAppNavigation(
    wishlists,
    (data) => {
      addWishlist(data);
    },
    (id, data) => {
      updateWishlist(id, data);
    }
  );

  // Bottom menu navigation with callbacks
  const { activeMenuItem, handleMenuItemChange, switchToMenuItem } = useBottomMenuNavigation(
    navigation.navigateToHomeFeed,
    navigation.navigateToWishlist
  );

  // CRUD операции для вишлистов
  const wishlistActions = useWishlistActions({
    addWishlist,
    updateWishlist,
    removeWishlist,
    navigateToWishlist: navigation.navigateToWishlist,
    navigateToCreateWishlist: navigation.navigateToCreateWishlist,
    switchToWishlistTab: () => switchToMenuItem('wishlist'),
    handleCreateWishlist: navigation.handleCreateWishlist,
    handleEditWishlist: navigation.handleEditWishlist,
    selectedWishlistId: navigation.selectedWishlistId,
  });

  // CRUD операции для желаний
  const itemActions = useItemActions({
    addWishlistItem,
    updateWishlistItem,
    removeWishlistItem,
    navigateToWishlistDetail: navigation.navigateToWishlistDetail,
    navigateToCreateItem: navigation.navigateToCreateItem,
    selectedWishlistId: navigation.selectedWishlistId,
    selectedItemId: navigation.selectedItemId,
    currentView: navigation.currentView,
  });

  // ✅ Логика навигации для табов главной страницы
  const homeTabsLogic = useHomeTabsLogic(
    navigation.currentView,
    {
      navigateToHome: navigation.navigateToHome,
      navigateToHomeFeed: navigation.navigateToHomeFeed,
      navigateToHomeSelections: navigation.navigateToHomeSelections,
      navigateToHomePopular: navigation.navigateToHomePopular,
      navigateToHomeWishlists: navigation.navigateToHomeWishlists,
    }
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <AppRouter
          // Состояние навигации
          currentView={navigation.currentView}
          activeMenuItem={activeMenuItem}
          selectedWishlistId={navigation.selectedWishlistId}
          selectedItemId={navigation.selectedItemId}
          wishlistFormMode={navigation.wishlistFormMode}
          itemFormMode={navigation.itemFormMode}

          // Данные
          wishlists={wishlists}
          selectedWishlist={navigation.getSelectedWishlist()}
          selectedItem={navigation.getSelectedItem()}

          // Навигация
          navigateBack={navigation.navigateBack}
          navigateToCreateWishlist={navigation.navigateToCreateWishlist}
          navigateToEditWishlist={navigation.navigateToEditWishlist}
          navigateToWishlistDetail={navigation.navigateToWishlistDetail}
          navigateToCreateItem={navigation.navigateToCreateItem}
          navigateToEditItem={navigation.navigateToEditItem}
          navigateToItemDetail={navigation.navigateToItemDetail}

          // Действия
          handleCreateWishlist={wishlistActions.handleCreate}
          handleUpdateWishlist={wishlistActions.handleUpdate}
          handleDeleteWishlist={wishlistActions.handleDelete}
          handleCreateItem={itemActions.handleCreate}
          handleUpdateItem={itemActions.handleUpdate}
          handleDeleteItem={itemActions.handleDelete}
          updateWishlistItem={updateWishlistItem}

          // Обработчики для HomePage
          getCurrentHomeSubPage={homeTabsLogic.getCurrentHomeSubPage}
          handleHomeTabChange={homeTabsLogic.handleHomeTabChange}
        />
      </div>

      {/* Нижнее меню скрыто ТОЛЬКО на формах создания/редактирования */}
      {navigation.currentView !== 'wishlist-form' && 
       navigation.currentView !== 'item-form' && (
        <BottomMenu 
          activeMenuItem={activeMenuItem}
          onMenuItemChange={handleMenuItemChange}
          onSelectWishlist={wishlistActions.handleCreateFromMenu}
          onSelectWish={itemActions.handleCreateFromMenu}
        />
      )}
    </div>
  );
}

export default App;