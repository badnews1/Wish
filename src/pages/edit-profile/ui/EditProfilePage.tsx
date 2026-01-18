import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Header } from '@/widgets/header';
import { EditProfileForm, validateEditProfileForm } from '@/features/edit-profile';
import { useCurrentUser, useUpdateProfile, useUploadAvatar } from '@/entities/user';
import type { EditProfileFormData, EditProfileErrors } from '@/features/edit-profile';
import { useTranslation } from '@/app';

/**
 * Props для страницы редактирования профиля
 */
interface EditProfilePageProps {
  onNavigateBack: () => void;
}

/**
 * Страница редактирования профиля пользователя
 * 
 * Позволяет редактировать:
 * - Имя пользователя
 * - Описание профиля
 * - Аватар
 */
export function EditProfilePage({ onNavigateBack }: EditProfilePageProps): JSX.Element {
  const { t } = useTranslation();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  const [errors, setErrors] = useState<EditProfileErrors | null>(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | undefined>(undefined);

  // Показываем загрузку если данные пользователя еще не загружены
  if (isLoadingUser || !currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initialData: EditProfileFormData = {
    name: currentUser.name,
    username: currentUser.username,
    bio: currentUser.bio || '', // берем из профиля или пустая строка
    avatar_url: tempAvatarUrl || currentUser.avatar_url,
    birth_date: currentUser.birth_date, // передаём строку как есть
  };

  const handleAvatarSelect = (file: File) => {
    uploadAvatar(file, {
      onSuccess: (avatarUrl) => {
        setTempAvatarUrl(avatarUrl);
        // Автоматически обновляем аватар в БД сразу после загрузки
        updateProfile(
          { avatar_url: avatarUrl },
          {
            onSuccess: () => {
              toast.success('Фото загружено');
            },
            onError: (error: Error) => {
              toast.error('Фото загружено, но не сохранено');
            },
          }
        );
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Не удалось загрузить фото');
      },
    });
  };

  const handleSubmit = (formData: EditProfileFormData) => {
    // Валидация
    const validationErrors = validateEditProfileForm(formData, {
      nameRequired: t('editProfile.validation.nameRequired'),
      nameMinLength: t('editProfile.validation.nameMinLength'),
      nameMaxLength: t('editProfile.validation.nameMaxLength'),
      usernameRequired: t('editProfile.validation.usernameRequired'),
      bioMaxLength: t('editProfile.validation.bioMaxLength'),
    });
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors(null);

    // Отправка данных (avatar_url уже сохранён в handleAvatarSelect)
    updateProfile(
      {
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        birth_date: formData.birth_date, // Отправляем дату рождения
        // НЕ отправляем avatar_url здесь, так как он уже сохранён при загрузке
      },
      {
        onSuccess: () => {
          toast.success('Профиль успешно обновлен');
          onNavigateBack();
        },
        onError: (error) => {
          toast.error('Не удалось обновить профиль');
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Хедер */}
      <Header
        title="Редактировать профиль"
        leftAction={
          <button
            onClick={onNavigateBack}
            className="w-9 h-9 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
            disabled={isPending}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        }
      />

      {/* Форма */}
      <EditProfileForm
        initialData={initialData}
        errors={errors}
        isLoading={isPending}
        isUploadingAvatar={isUploadingAvatar}
        onSubmit={handleSubmit}
        onCancel={onNavigateBack}
        onAvatarSelect={handleAvatarSelect}
      />
    </div>
  );
}