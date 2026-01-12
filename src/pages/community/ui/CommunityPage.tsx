import React from 'react';
import { Header } from '@/widgets/Header';
import { useTranslation } from '@/app';

export function CommunityPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white pb-32 min-h-screen">
      <Header title={t('pages.community.title')} />
      
      {/* Контент страницы */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-center text-muted-foreground py-8">
          {t('pages.community.inDevelopment')}
        </div>
      </div>
    </div>
  );
}