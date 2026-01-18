/**
 * Тип данных формы редактирования профиля
 */
export interface EditProfileFormData {
  name: string;
  username: string;
  bio: string;
  avatar_url?: string;
  birth_date?: string; // Дата рождения в ISO формате (YYYY-MM-DD)
}