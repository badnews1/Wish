/**
 * Feature: Редактирование профиля пользователя
 * @module features/edit-profile
 */

export { EditProfileForm } from './ui/EditProfileForm';
export type { EditProfileForm as EditProfileFormData } from './model/types';
export { validateEditProfileForm } from './model/validation';
export type { EditProfileErrors, ValidationMessages } from './model/validation';
export { editProfileRu, editProfileEn } from './config/i18n';