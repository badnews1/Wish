import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/shared/api/supabase';

/**
 * Хук для загрузки аватара пользователя
 * 
 * Загружает файл в Supabase Storage и возвращает публичный URL
 */
export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      // Получаем текущего пользователя
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (!user || userError) {
        throw new Error('User not authenticated');
      }

      // Проверяем размер файла (максимум 2MB)
      const MAX_FILE_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('Файл слишком большой. Максимальный размер: 2MB');
      }

      // Проверяем тип файла
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Недопустимый формат файла. Используйте JPG, PNG или WebP');
      }

      // Удаляем ВСЕ старые аватары пользователя перед загрузкой нового
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(user.id);

      if (existingFiles && existingFiles.length > 0) {
        const filesToRemove = existingFiles.map(file => `${user.id}/${file.name}`);
        await supabase.storage
          .from('avatars')
          .remove(filesToRemove);
      }

      // Генерируем уникальное имя файла с timestamp
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const fileName = `avatar_${timestamp}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Загружаем новый файл в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: 'no-cache', // Отключаем кеширование для новых файлов
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Получаем публичный URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    },
  });
}