import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Trash2, 
  Bell, 
  Mail, 
  Gift, 
  Eye, 
  MessageSquare,
  Globe,
  Palette,
  Moon,
  Info,
  FileText,
  Shield,
  HelpCircle,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useTranslation, type Language } from '@/app';
import { Header } from '@/widgets/Header';
import { ToggleSwitch } from '@/shared/ui';
import { LanguageDrawer } from '@/pages/profile/ui/LanguageDrawer';
import { useSignOut } from '@/entities/user';
import type { SettingsPageProps } from '../model';

/**
 * Страница настроек приложения
 * 
 * Отображает различные секции настроек:
 * - Аккаунт
 * - Уведомления
 * - Приватность
 * - Внешний вид
 * - О приложении
 */
export function SettingsPage({ onNavigateBack, onNavigateToEditProfile }: SettingsPageProps): JSX.Element {
  const { t, language, setLanguage } = useTranslation();
  const { mutate: signOut } = useSignOut();
  const [languageDrawerOpen, setLanguageDrawerOpen] = useState(false);
  
  // Состояния переключателей
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [wishlistUpdates, setWishlistUpdates] = useState(true);
  const [giftReminders, setGiftReminders] = useState(true);
  const [showWishlists, setShowWishlists] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Хедер */}
      <Header
        title={t('pages.settings.title')}
        leftAction={
          <button
            onClick={onNavigateBack}
            className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        }
      />

      {/* Контент */}
      <div className="px-4 py-6 space-y-8">
        {/* Аккаунт */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3 px-2">
            {t('pages.settings.account')}
          </h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <SettingRow
              icon={User}
              label={t('pages.settings.editProfile')}
              onClick={onNavigateToEditProfile}
            />
            <Divider />
            <SettingRow
              icon={Lock}
              label={t('pages.settings.changePassword')}
              onClick={() => console.log('Change password')}
            />
            <Divider />
            <SettingRow
              icon={Trash2}
              label={t('pages.settings.deleteAccount')}
              onClick={() => console.log('Delete account')}
              danger
            />
          </div>
        </section>

        {/* Уведомления */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3 px-2">
            {t('pages.settings.notifications')}
          </h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <SettingRow
              icon={Bell}
              label={t('pages.settings.pushNotifications')}
              showToggle
              toggleValue={pushNotifications}
              onToggleChange={setPushNotifications}
            />
            <Divider />
            <SettingRow
              icon={Mail}
              label={t('pages.settings.emailNotifications')}
              showToggle
              toggleValue={emailNotifications}
              onToggleChange={setEmailNotifications}
            />
            <Divider />
            <SettingRow
              icon={Gift}
              label={t('pages.settings.wishlistUpdates')}
              showToggle
              toggleValue={wishlistUpdates}
              onToggleChange={setWishlistUpdates}
            />
            <Divider />
            <SettingRow
              icon={Gift}
              label={t('pages.settings.giftReminders')}
              showToggle
              toggleValue={giftReminders}
              onToggleChange={setGiftReminders}
            />
          </div>
        </section>

        {/* Приватность */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3 px-2">
            {t('pages.settings.privacy')}
          </h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <SettingRow
              icon={Eye}
              label={t('pages.settings.profileVisibility')}
              onClick={() => console.log('Profile visibility')}
            />
            <Divider />
            <SettingRow
              icon={Gift}
              label={t('pages.settings.showWishlists')}
              showToggle
              toggleValue={showWishlists}
              onToggleChange={setShowWishlists}
            />
            <Divider />
            <SettingRow
              icon={MessageSquare}
              label={t('pages.settings.allowComments')}
              showToggle
              toggleValue={allowComments}
              onToggleChange={setAllowComments}
            />
          </div>
        </section>

        {/* Внешний вид */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3 px-2">
            {t('pages.settings.appearance')}
          </h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <SettingRow
              icon={Globe}
              label={t('pages.settings.language')}
              value={language === 'ru' ? 'Русский' : 'English'}
              onClick={() => setLanguageDrawerOpen(true)}
            />
            <Divider />
            <SettingRow
              icon={Moon}
              label={t('pages.settings.darkMode')}
              showToggle
              toggleValue={darkMode}
              onToggleChange={setDarkMode}
            />
          </div>
        </section>

        {/* О приложении */}
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3 px-2">
            {t('pages.settings.about')}
          </h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <SettingRow
              icon={Info}
              label={t('pages.settings.version')}
              value="1.0.0"
            />
            <Divider />
            <SettingRow
              icon={FileText}
              label={t('pages.settings.terms')}
              onClick={() => console.log('Terms')}
            />
            <Divider />
            <SettingRow
              icon={Shield}
              label={t('pages.settings.privacy_policy')}
              onClick={() => console.log('Privacy policy')}
            />
            <Divider />
            <SettingRow
              icon={HelpCircle}
              label={t('pages.settings.support')}
              onClick={() => console.log('Support')}
            />
          </div>
        </section>

        {/* Выход */}
        <section>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <SettingRow
              icon={LogOut}
              label={t('pages.settings.logout')}
              onClick={handleLogout}
              danger
            />
          </div>
        </section>
      </div>

      {/* Drawer выбора языка */}
      <LanguageDrawer
        open={languageDrawerOpen}
        onOpenChange={setLanguageDrawerOpen}
        selected={language}
        onSelect={handleLanguageSelect}
      />
    </div>
  );
}

/**
 * Строка настройки
 */
interface SettingRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
  onClick?: () => void;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  danger?: boolean;
}

function SettingRow({
  icon: Icon,
  label,
  value,
  onClick,
  showToggle,
  toggleValue,
  onToggleChange,
  danger,
}: SettingRowProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      disabled={!onClick && !showToggle}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-gray-100 transition-colors disabled:active:bg-transparent"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${danger ? 'text-red-500' : 'text-gray-700'}`} />
      <span className={`flex-1 text-left ${danger ? 'text-red-500' : 'text-gray-900'}`}>
        {label}
      </span>
      {value && (
        <span className="text-sm text-gray-500">
          {value}
        </span>
      )}
      {showToggle && onToggleChange && (
        <ToggleSwitch
          checked={toggleValue || false}
          onChange={onToggleChange}
        />
      )}
    </button>
  );
}

/**
 * Разделитель между строками
 */
function Divider(): JSX.Element {
  return <div className="h-px bg-gray-200 mx-4" />;
}