import React from 'react';
import { ChevronRight, Globe } from 'lucide-react';
import { Header } from '@/widgets/Header';
import { useDrawer } from '@/shared/lib';
import { SelectButton } from '@/shared/ui';
import { useTranslation } from '@/app';
import { useLanguageStore } from '@/app';
import { LanguageDrawer } from './LanguageDrawer';

export function ProfilePage() {
  const languageDrawer = useDrawer();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const languageLabel = language === 'ru' ? t('language.russian') : t('language.english');

  return (
    <div className="flex flex-col bg-white pb-32 min-h-screen">
      <Header title={t('navigation.profile')} />
      
      {/* Контент страницы */}
      <div className="p-4 flex-1 flex flex-col space-y-6">
        {/* Настройки */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-medium text-gray-900">{t('settings.title')}</h3>
          </div>
          
          <SelectButton
            label={t('settings.language')}
            value={languageLabel}
            onClick={languageDrawer.open}
          />
        </div>

        <div className="text-center text-muted-foreground py-8">
          {t('pages.profile.inDevelopment')}
        </div>
      </div>

      {/* Drawer выбора языка */}
      <LanguageDrawer
        open={languageDrawer.isOpen}
        onOpenChange={languageDrawer.setOpen}
        selected={language}
        onSelect={setLanguage}
      />
    </div>
  );
}