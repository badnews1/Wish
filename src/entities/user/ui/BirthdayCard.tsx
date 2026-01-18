import { Cake } from 'lucide-react';
import { useTranslation } from '@/app';
import { getDaysUntilBirthday, formatBirthdayDate } from '../lib/getDaysUntilBirthday';

interface BirthdayCardProps {
  birthDate: string; // формат YYYY-MM-DD
}

/**
 * Карточка с информацией о дне рождения
 * Показывается в профиле пользователя
 */
export function BirthdayCard({ birthDate }: BirthdayCardProps): JSX.Element {
  const { t } = useTranslation();
  const daysUntil = getDaysUntilBirthday(birthDate);
  const formattedDate = formatBirthdayDate(birthDate);

  return (
    <div className="mx-4 mb-4 p-4 rounded-2xl bg-[#feeba1]">
      <div className="flex items-center justify-between">
        {/* Левая часть: иконка + текст */}
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            🎂
          </div>
          <div>
            <p className="text-base font-bold text-[#8B4513]">
              {t('user.birthday.title')}
            </p>
            <p className="text-sm font-normal text-[#8B4513]">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Правая часть: "через X дней" или "Сегодня" */}
        <div className="bg-white px-3 py-2 rounded-xl">
          {daysUntil === 0 ? (
            <p className="text-sm font-semibold text-[#8B4513] whitespace-nowrap">
              {t('user.birthday.today')}
            </p>
          ) : (
            <p className="text-sm font-semibold text-[#8B4513] whitespace-nowrap">
              {t('user.birthday.daysLeft', { count: daysUntil })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}