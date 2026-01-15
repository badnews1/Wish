/**
 * Виджет с табами для раздела "Друзья"
 * Содержит подтабы: "Мои друзья" и "Запросы"
 * @module widgets/friends-tabs/ui
 */

import { useState } from 'react';
import { FriendsListWidget } from '@/widgets/friends-list';
import { FriendRequestsWidget } from '@/widgets/friend-requests';
import { usePendingRequests, useSentRequests } from '@/entities/friendship';
import { Users, Bell } from 'lucide-react';

type FriendsTab = 'friends' | 'requests';

/**
 * Виджет с табами: Мои друзья | Запросы
 */
export function FriendsTabsWidget(): JSX.Element {
  const [activeTab, setActiveTab] = useState<FriendsTab>('friends');

  // Подгружаем запросы для бейджей
  const { data: incomingRequests = [] } = usePendingRequests();
  const { data: outgoingRequests = [] } = useSentRequests();

  const totalRequests = incomingRequests.length + outgoingRequests.length;

  return (
    <div className="space-y-4">
      {/* Табы */}
      <div className="flex gap-2 bg-white rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('friends')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all
            ${activeTab === 'friends'
              ? 'bg-[#5F33E1] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <Users className="w-4 h-4" />
          Мои друзья
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`
            flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all relative
            ${activeTab === 'requests'
              ? 'bg-[#5F33E1] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <Bell className="w-4 h-4" />
          Запросы
          {totalRequests > 0 && (
            <span className={`
              absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
              ${activeTab === 'requests' ? 'bg-white text-[#5F33E1]' : 'bg-[#5F33E1] text-white'}
            `}>
              {totalRequests}
            </span>
          )}
        </button>
      </div>

      {/* Контент табов */}
      <div>
        {activeTab === 'friends' && <FriendsListWidget />}
        {activeTab === 'requests' && <FriendRequestsWidget />}
      </div>
    </div>
  );
}
