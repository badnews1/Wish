/**
 * Данные формы редактирования профиля
 */
export interface EditProfileForm {
  name: string;
  username: string;
  bio: string;
  avatar_url?: string;
}