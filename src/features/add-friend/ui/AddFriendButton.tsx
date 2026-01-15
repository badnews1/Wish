/**
 * Кнопка добавления пользователя в друзья
 * @module features/add-friend/ui
 */

import { useSendFriendRequest, useCheckFriendshipStatus } from '@/entities/friendship';
import { UserPlus, UserCheck, Clock } from 'lucide-react';

interface AddFriendButtonProps {
  /** ID пользователя, которого добавляем в друзья */
  userId: string;
  /** Размер кнопки */
  size?: 'sm' | 'md';
  /** Вариант отображения */
  variant?: 'icon' | 'full';
}

/**
 * Компонент кнопки для отправки запроса в друзья
 * Показывает разные состояния: можно добавить, уже отправлен запрос, уже друзья
 */
export function AddFriendButton({ 
  userId, 
  size = 'md',
  variant = 'icon'
}: AddFriendButtonProps): JSX.Element {
  const sendRequest = useSendFriendRequest();
  const { data: friendshipStatus } = useCheckFriendshipStatus(userId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    
    // Отправляем только если нет связи
    if (!friendshipStatus?.exists) {
      sendRequest.mutate(userId);
    }
  };

  const iconSize = size === 'sm' ? 16 : 20;

  // Если уже друзья
  if (friendshipStatus?.status === 'accepted') {
    const buttonClass = variant === 'icon'
      ? 'p-2 rounded-full bg-gray-200 text-gray-500 cursor-default'
      : 'px-4 py-2 rounded-full bg-gray-200 text-gray-600 text-sm font-medium flex items-center gap-2 cursor-default';
    
    return (
      <button
        disabled
        className={buttonClass}
        aria-label="Уже в друзьях"
      >
        <UserCheck size={iconSize} />
        {variant === 'full' && <span>Друзья</span>}
      </button>
    );
  }

  // Если уже отправлен запрос (исходящий)
  if (friendshipStatus?.exists && friendshipStatus?.direction === 'outgoing' && friendshipStatus?.status === 'pending') {
    const buttonClass = variant === 'icon'
      ? 'p-2 rounded-full bg-gray-200 text-gray-500 cursor-default'
      : 'px-4 py-2 rounded-full bg-gray-200 text-gray-600 text-sm font-medium flex items-center gap-2 cursor-default';
    
    return (
      <button
        disabled
        className={buttonClass}
        aria-label="Запрос отправлен"
      >
        <Clock size={iconSize} />
        {variant === 'full' && <span>Отправлено</span>}
      </button>
    );
  }

  // Если есть входящий запрос - показываем информацию (не добавляем снова)
  if (friendshipStatus?.exists && friendshipStatus?.direction === 'incoming' && friendshipStatus?.status === 'pending') {
    const buttonClass = variant === 'icon'
      ? 'p-2 rounded-full bg-blue-100 text-blue-600 cursor-default'
      : 'px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm font-medium flex items-center gap-2 cursor-default';
    
    return (
      <button
        disabled
        className={buttonClass}
        aria-label="Есть запрос"
      >
        <Clock size={iconSize} />
        {variant === 'full' && <span>Есть запрос</span>}
      </button>
    );
  }

  // Можно добавить в друзья
  const buttonClass = variant === 'icon'
    ? 'p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    : 'px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';

  return (
    <button
      onClick={handleClick}
      disabled={sendRequest.isPending}
      className={buttonClass}
      aria-label="Добавить в друзья"
    >
      <UserPlus size={iconSize} />
      {variant === 'full' && (
        <span>{sendRequest.isPending ? 'Отправка...' : 'Добавить'}</span>
      )}
    </button>
  );
}