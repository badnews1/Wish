/**
 * Пропсы страницы настроек
 */
export interface SettingsPageProps {
  /** Обработчик возврата назад */
  onNavigateBack: () => void;
  /** Обработчик перехода на страницу редактирования профиля */
  onNavigateToEditProfile: () => void;
}

/**
 * Тип настройки в списке
 */
export interface SettingItem {
  /** Уникальный идентификатор */
  id: string;
  /** Название настройки */
  label: string;
  /** Иконка (компонент из lucide-react) */
  icon: React.ComponentType<{ className?: string }>;
  /** Обработчик клика */
  onClick?: () => void;
  /** Показывать переключатель */
  showToggle?: boolean;
  /** Значение переключателя */
  toggleValue?: boolean;
  /** Обработчик изменения переключателя */
  onToggleChange?: (value: boolean) => void;
}

/**
 * Секция настроек
 */
export interface SettingsSection {
  /** Уникальный идентификатор секции */
  id: string;
  /** Название секции */
  title: string;
  /** Элементы настроек */
  items: SettingItem[];
}