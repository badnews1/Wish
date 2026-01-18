/**
 * Виджет поиска пользователей для добавления в друзья
 * @module widgets/user-search/ui
 */

import { useState, useEffect } from 'react';
import { useSearchUsers } from '@/entities/user';
import { UserSearchCard } from '@/entities/user';
import { FriendButton } from '@/features/manage-friend';
import { Search } from 'lucide-react';
import { useTranslation } from '@/app';

/**
 * Виджет поиска пользователей по никнейму
 */
export function UserSearch(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { t } = useTranslation();

  // Debounce поискового запроса (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: users = [], isLoading, error } = useSearchUsers(debouncedQuery);

  const isSearching = searchQuery.trim().length >= 2;
  const hasResults = users.length > 0;

  return (
    <div className="space-y-4">
      {/* Поисковая строка */}
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
          size={20} 
        />
        <input
          type="text"
          placeholder={t('widgets.userSearch.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Результаты поиска */}
      {isSearching && (
        <div>
          {isLoading ? (
            // Скелетоны загрузки
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : error ? (
            // Ошибка
            <div className="text-center py-8">
              <p className="text-red-600">{t('widgets.userSearch.errorSearch')}</p>
              <p className="text-sm text-gray-500 mt-1">{t('widgets.userSearch.errorRetry')}</p>
            </div>
          ) : hasResults ? (
            // Список найденных пользователей
            <div className="space-y-3">
              {users.map((user) => (
                <UserSearchCard
                  key={user.id}
                  user={user}
                  actionSlot={
                    <FriendButton targetUserId={user.id} variant="icon" />
                  }
                  t={t}
                />
              ))}
            </div>
          ) : (
            // Empty state: ничего не найдено
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">{t('widgets.userSearch.notFound')}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t('widgets.userSearch.notFoundSubtitle')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Подсказка когда поиск не начат */}
      {!isSearching && (
        <div className="text-center py-8">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">{t('widgets.userSearch.emptyTitle')}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t('widgets.userSearch.emptySubtitle')}
          </p>
        </div>
      )}
    </div>
  );
}