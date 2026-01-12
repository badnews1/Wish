import React from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from '@/app';
import { Header } from '../../../widgets/Header';

export function CommunityPage() {
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