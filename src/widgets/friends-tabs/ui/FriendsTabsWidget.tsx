/**
 * Виджет с табами для раздела "Друзья"
 * Содержит подтабы: "Мои друзья" и "Запросы"
 * @module widgets/friends-tabs/ui
 */

import { useState, useMemo } from 'react';
import { FriendsListWidget } from '@/widgets/friends-list';
import { FriendRequestsWidget } from '@/widgets/friend-requests';
import { useIncomingFriendRequests, useOutgoingFriendRequests } from '@/entities/friend';
import { useCurrentUser } from '@/entities/user';
import { RoundedButton } from '@/shared/ui/RoundedButton';
import { useTranslation } from '@/app';
import { friendsTabs } from '../config';
import type { FriendsTabId } from '../config';

/**
 * Виджет с табами: Мои друзья | Запросы
 */
export function FriendsTabsWidget() {
  const [activeTab, setActiveTab] = useState<FriendsTabId>('friends');
  const { data: currentUser } = useCurrentUser();
  const { data: incomingRequestsData } = useIncomingFriendRequests({ userId: currentUser?.id || '' });
  const { t } = useTranslation();
  
  // Достаем все запросы из всех страниц infinite query
  const totalRequests = useMemo(() => {
    if (!incomingRequestsData?.pages) return 0;
    return incomingRequestsData.pages.reduce((total, page) => total + (page.data?.length || 0), 0);
  }, [incomingRequestsData]);

  return (
    <div className="space-y-4">
      {/* Табы */}
      <div className="flex gap-2">
        {friendsTabs.map((tab) => (
          <div key={tab.id} className="relative flex-1">
            <RoundedButton
              onClick={() => setActiveTab(tab.id)}
              isActive={activeTab === tab.id}
              label={t(`community.tabs.${tab.id}`)}
            />
            {/* Бейдж для количества запросов */}
            {tab.id === 'requests' && totalRequests > 0 && (
              <span className={`
                absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                ${activeTab === 'requests' ? 'bg-white text-[#5F33E1]' : 'bg-[#5F33E1] text-white'}
              `}>
                {totalRequests}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Контент табов */}
      <div>
        {activeTab === 'friends' && <FriendsListWidget />}
        {activeTab === 'requests' && <FriendRequestsWidget />}
      </div>
    </div>
  );
}