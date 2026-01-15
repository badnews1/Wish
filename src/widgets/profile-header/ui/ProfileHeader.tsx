import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { User as UserType } from '@/entities/user';

interface ProfileHeaderProps {
  user: UserType;
  t: (key: string) => string;
}

/**
 * Шапка профиля пользователя
 * 
 * Отображает:
 * - Аватар пользователя по центру
 * - Имя и био под аватаром
 */
export function ProfileHeader({ user, t }: ProfileHeaderProps) {
  return (
    <div className="px-4 pt-6 pb-4">
      <div className="flex flex-col items-center text-center">
        {/* Аватар */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-[var(--color-accent)] flex items-center justify-center overflow-hidden mb-4">
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-white" />
          )}
        </div>

        {/* Имя */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {user.name}
        </h1>

        {/* Никнейм */}
        <div className="text-sm text-gray-500 mb-3">
          @{user.username}
        </div>

        {/* Био */}
        {user.bio && (
          <p className="text-sm text-gray-600 leading-relaxed max-w-[280px]">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
}