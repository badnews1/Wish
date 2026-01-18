import React from 'react';
import { Settings, Share2, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/app';
import { Header } from '@/widgets/header';
import { ProfileHeader } from '@/widgets/profile-header';
import { ProfileStats } from '@/widgets/profile-stats';
import { useCurrentUser, BirthdayCard } from '@/entities/user';
import { useWishlistsQuery, useUserStatsQuery } from '@/entities/wishlist';
import { useFriendsCount } from '@/entities/friend';
import { WishlistGridCard } from '@/pages/wishlist';
import type { User } from '@/entities/user';

/**
 * Страница профиля пользователя
 * 
 * Отображает:
 * - Шапку профиля с аватаром
 * - Статистику (вишлисты, желания, друзья)
 * - Кнопки поделиться и настроек в хедере
 */
export function ProfilePage({
  onNavigateToSettings,
  onNavigateToWishlistDetail,
  onNavigateToWishlistsTab,
}: {
  onNavigateToSettings?: () => void;
  onNavigateToWishlistDetail?: (wishlistId: string) => void;
  onNavigateToWishlistsTab?: () => void;
}) {
  const { t, language } = useTranslation();

  // Получаем данные текущего пользователя
  const { data: currentUser, isLoading } = useCurrentUser();

  // Загружаем вишлисты текущего пользователя
  const { data: wishlists = [], isLoading: isLoadingWishlists } = useWishlistsQuery(currentUser?.id);

  // Загружаем статистику пользователя
  const { data: userStats } = useUserStatsQuery(currentUser?.id);

  // Загружаем количество друзей
  const { data: friendsCount } = useFriendsCount({ userId: currentUser?.id });

  const handleSettingsClick = () => {
    if (onNavigateToSettings) {
      onNavigateToSettings();
    }
  };

  const handleShareProfile = () => {
    // TODO: Реализовать шаринг профиля
  };

  const handleWishlistsClick = () => {
    // TODO: Навигация на вишлисты
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Если нет данных пользователя - показываем заглушку
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pb-20">
        <p className="text-gray-600">Не удалось загрузить профиль</p>
      </div>
    );
  }

  // Адаптируем данные для ProfileHeader (преобразуем snake_case в camelCase)
  const displayUser = {
    ...currentUser,
    avatarUrl: currentUser.avatar_url,
    bio: currentUser.bio, // используем реальное bio
    wishlistCount: userStats?.wishlistCount || 0,
    itemCount: userStats?.itemCount || 0,
    friendCount: friendsCount || 0,
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Хедер с кнопками поделиться и настроек */}
      <Header
        title="Мой профиль"
        rightAction={
          <div className="flex items-center gap-1">
            <button
              onClick={handleShareProfile}
              className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleSettingsClick}
              className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        }
      />

      {/* Контент страницы */}
      <div className="space-y-6">
        {/* Шапка профиля */}
        <ProfileHeader 
          user={displayUser}
          t={t}
        />

        {/* Статистика */}
        <ProfileStats
          wishlistCount={displayUser.wishlistCount}
          itemCount={displayUser.itemCount}
          friendCount={displayUser.friendCount}
          onWishlistsClick={handleWishlistsClick}
          t={t}
        />

        {/* Плашка дня рождения (если указан) */}
        {currentUser.birth_date && (
          <BirthdayCard birthDate={currentUser.birth_date} />
        )}

        {/* Сетка вишлистов */}
        <div className="px-4 pb-4">
          {/* Заголовок секции */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">
                Вишлисты
              </h2>
              {!isLoadingWishlists && wishlists.length > 0 && (
                <span className="bg-[var(--color-accent)] text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {wishlists.length}
                </span>
              )}
            </div>
            
            {!isLoadingWishlists && wishlists.length > 0 && (
              <button
                onClick={() => {
                  if (onNavigateToWishlistsTab) {
                    onNavigateToWishlistsTab();
                  }
                }}
                className="flex items-center gap-1 text-sm text-[var(--color-accent)] active:opacity-70 transition-opacity font-medium"
              >
                Все
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {isLoadingWishlists ? (
            // Загрузка вишлистов
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : wishlists.length === 0 ? (
            // Пустое состояние
            <div className="text-center py-12">
              <p className="text-gray-500">
                {t('profile.noWishlists')}
              </p>
            </div>
          ) : (
            // Сетка вишлистов (2 колонки)
            <div className="grid grid-cols-2 gap-3">
              {wishlists.map((wishlist) => (
                <WishlistGridCard
                  key={wishlist.id}
                  wishlist={wishlist}
                  onClick={() => {
                    // TODO: Навигация на детали вишлиста
                    if (onNavigateToWishlistDetail) {
                      onNavigateToWishlistDetail(wishlist.id);
                    }
                  }}
                  t={t}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}