import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Loader2, Check, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/app';
import { DatePickerDrawer } from '@/features/create-wishlist';
import type { EditProfileForm as EditProfileFormData } from '../model/types';
import type { EditProfileErrors } from '../model/validation';
import { validateUsername, checkUsernameAvailability } from '@/entities/user';

/**
 * Props для формы редактирования профиля
 */
interface EditProfileFormProps {
  initialData: EditProfileFormData;
  errors: EditProfileErrors | null;
  isLoading?: boolean;
  isUploadingAvatar?: boolean;
  onSubmit: (data: EditProfileFormData) => void;
  onCancel: () => void;
  onAvatarSelect: (file: File) => void;
}

/**
 * Форма редактирования профиля
 * 
 * Позволяет редактировать:
 * - Имя
 * - Описание (био)
 * - Аватар (TODO: загрузка файла)
 */
export function EditProfileForm({
  initialData,
  errors,
  isLoading,
  isUploadingAvatar,
  onSubmit,
  onCancel,
  onAvatarSelect,
}: EditProfileFormProps): JSX.Element {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EditProfileFormData>(initialData);
  const [usernameCheckStatus, setUsernameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameError, setUsernameError] = useState<string>('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameCheckTimeoutRef = useRef<NodeJS.Timeout>();

  // Синхронизация formData при изменении initialData
  useEffect(() => {
    setFormData(initialData);
  }, [initialData.name, initialData.username, initialData.bio, initialData.avatar_url, initialData.birth_date]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAvatarClick = () => {
    // Открыть диалог выбора/загрузки аватара
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAvatarSelect(file);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.toLowerCase(); // Приводим к нижнему регистру
    setFormData({ ...formData, username });
    setUsernameError('');

    // Очищаем предыдущий таймер
    if (usernameCheckTimeoutRef.current) {
      clearTimeout(usernameCheckTimeoutRef.current);
    }

    // Валидация формата
    const validation = validateUsername(username, {
      minLength: t('user.validation.username.minLength'),
      maxLength: t('user.validation.username.maxLength'),
      invalidFormat: t('user.validation.username.invalidFormat'),
    });
    
    if (!validation.isValid) {
      setUsernameCheckStatus('idle');
      if (username.length > 0) {
        setUsernameError(validation.error || '');
      }
      return;
    }

    // Если username не изменился - не проверяем
    if (username === initialData.username) {
      setUsernameCheckStatus('available');
      return;
    }

    // Проверяем уникальность с задержкой
    setUsernameCheckStatus('checking');
    usernameCheckTimeoutRef.current = setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameCheckStatus(isAvailable ? 'available' : 'taken');
        if (!isAvailable) {
          setUsernameError(t('editProfile.ui.usernameTaken'));
        }
      } catch (error) {
        setUsernameCheckStatus('idle');
        setUsernameError(t('editProfile.ui.usernameCheckError'));
      }
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Скрытый input для выбора файла */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Контент формы */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-[var(--color-accent)] flex items-center justify-center overflow-hidden group"
            >
              {formData.avatar_url ? (
                <img 
                  src={formData.avatar_url} 
                  alt={t('editProfile.ui.avatarAlt')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
              
              {/* Оверлей при наведении */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center">
                {isUploadingAvatar ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
            <p className="text-sm text-gray-500 mt-2">
              {t('editProfile.ui.changePhotoHint')}
            </p>
          </div>

          {/* Имя */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('editProfile.ui.nameLabel')}
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('editProfile.ui.namePlaceholder')}
              error={errors?.name}
              disabled={isLoading}
            />
            {errors?.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Имя пользователя */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              {t('editProfile.ui.usernameLabel')}
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleUsernameChange}
              placeholder={t('editProfile.ui.usernamePlaceholder')}
              error={usernameError || errors?.username}
              disabled={isLoading}
            />
            {usernameError && (
              <p className="text-sm text-red-500 mt-1">{usernameError}</p>
            )}
            {errors?.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
            {usernameCheckStatus === 'checking' && (
              <p className="text-sm text-gray-500 mt-1">{t('editProfile.ui.usernameChecking')}</p>
            )}
            {usernameCheckStatus === 'available' && (
              <p className="text-sm text-green-500 mt-1">{t('editProfile.ui.usernameAvailable')}</p>
            )}
            {usernameCheckStatus === 'taken' && (
              <p className="text-sm text-red-500 mt-1">{t('editProfile.ui.usernameTaken')}</p>
            )}
          </div>

          {/* Описание */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              {t('editProfile.ui.bioLabel')}
            </label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder={t('editProfile.ui.bioPlaceholder')}
              rows={4}
              disabled={isLoading}
              className={errors?.bio ? 'border-red-500' : ''}
            />
            <div className="flex items-center justify-between mt-1">
              {errors?.bio ? (
                <p className="text-sm text-red-500">{errors.bio}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  {t('editProfile.ui.bioCounter', { count: formData.bio.length })}
                </p>
              )}
            </div>
          </div>

          {/* Дата рождения */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
              {t('editProfile.ui.birthDateLabel')}
            </label>
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(true)}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl text-left transition-colors active:bg-gray-50"
            >
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className={formData.birth_date ? 'text-gray-900' : 'text-gray-400'}>
                {formData.birth_date 
                  ? new Date(formData.birth_date).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : t('editProfile.ui.birthDatePlaceholder')
                }
              </span>
            </button>
            <p className="text-sm text-gray-500 mt-1">
              {t('editProfile.ui.birthDateHint')}
            </p>
          </div>
        </div>
      </div>

      {/* Date Picker Drawer */}
      <DatePickerDrawer
        open={isDatePickerOpen}
        onOpenChange={setIsDatePickerOpen}
        selectedDate={formData.birth_date ? new Date(formData.birth_date) : undefined}
        onConfirm={(date) => {
          // Конвертируем Date в ISO string (YYYY-MM-DD) без timezone проблем
          if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setFormData({ ...formData, birth_date: `${year}-${month}-${day}` });
          } else {
            setFormData({ ...formData, birth_date: undefined });
          }
        }}
        mode="past"
      />

      {/* Кнопки действий */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? t('editProfile.ui.savingButton') : t('editProfile.ui.saveButton')}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('editProfile.ui.cancelButton')}
        </Button>
      </div>
    </form>
  );
}