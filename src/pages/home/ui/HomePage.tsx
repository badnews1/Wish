import React from 'react';
import { Bell } from 'lucide-react';
import { Tabs } from '@/shared/ui/tabs';
import { Button } from '@/components/ui/button';
import { RoundedButton } from '@/shared/ui/RoundedButton';
import { Header } from '@/widgets/header';
import { useTranslation } from '@/app';
import { homeTabs } from '../config';
import type { HomePageProps } from '../model';

export function HomePage({ currentSubPage, onTabChange, children }: HomePageProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white pb-32">
      <Header 
        title={t('pages.home.title')}
        rightAction={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {/* TODO: Реализовать уведомления */}}
            className="active:scale-90 transition-transform"
          >
            <Bell className="w-6 h-6" strokeWidth={2} />
          </Button>
        }
      />

      {/* Вкладки */}
      <div className="bg-white px-4 pb-2">
        <div className="flex gap-2">
          {homeTabs.map((tab) => (
            <RoundedButton
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              isActive={currentSubPage === tab.id}
              label={t(tab.labelKey)}
            />
          ))}
        </div>
      </div>

      {/* Контент подстраниц */}
      {children}
    </div>
  );
}