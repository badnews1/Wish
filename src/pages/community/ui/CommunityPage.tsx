import React, { useState } from 'react';
import { Header } from '@/widgets/Header';
import { useTranslation } from '@/app';
import { FriendsTabsWidget } from '@/widgets/friends-tabs';
import { Users, Rss } from 'lucide-react';

type CommunityTab = 'friends' | 'followers';

export function CommunityPage(): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<CommunityTab>('friends');

  return (
    <div className="flex flex-col bg-gray-50 pb-32 min-h-screen">
      <Header title={t('pages.community.title')} />

      {/* Контент страницы */}
      <div className="p-4 flex-1">
        {/* Основные табы: Друзья | Подписчики */}
        <div className="mb-4">
          <div className="flex gap-2 bg-white rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                ${activeTab === 'friends'
                  ? 'bg-[#5F33E1] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Users className="w-5 h-5" />
              Друзья
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`
                flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                ${activeTab === 'followers'
                  ? 'bg-[#5F33E1] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              <Rss className="w-5 h-5" />
              Подписчики
            </button>
          </div>
        </div>

        {/* Контент табов */}
        {activeTab === 'friends' && <FriendsTabsWidget />}
        {activeTab === 'followers' && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <Rss className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Скоро здесь появятся подписчики</p>
            <p className="text-sm text-gray-500 mt-1">
              Функционал в разработке
            </p>
          </div>
        )}
      </div>
    </div>
  );
}