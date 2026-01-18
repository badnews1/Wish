import React from 'react';
import { Header } from '@/widgets/header';
import { useTranslation } from '@/app';
import { FriendsTabsWidget } from '@/widgets/friends-tabs';

export function CommunityPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-gray-50 pb-32 min-h-screen">
      <Header title={t('pages.community.title')} />

      {/* Контент страницы */}
      <div className="p-4 flex-1">
        <FriendsTabsWidget />
      </div>
    </div>
  );
}