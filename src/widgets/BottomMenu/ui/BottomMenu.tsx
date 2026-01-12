import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { BOTTOM_MENU_ITEMS } from '../../../shared/config/navigation';
import { FLOATING_CARDS } from '../config';
import { FloatingCard } from '../../../shared/ui/FloatingCard';
import { useClickOutside } from '../../../shared/lib';
import { useTranslation } from '../../../shared/lib/hooks/useTranslation';
import type { BottomMenuItemId } from '../../../shared/config/navigation';
import type { BottomMenuProps } from '../model';

export function BottomMenu({ activeMenuItem, onMenuItemChange, onSelectWishlist, onSelectWish }: BottomMenuProps) {
  const [isAddMenuOpen, setIsAddMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleAddClick = () => {
    setIsAddMenuOpen(!isAddMenuOpen);
  };

  const handleCardClick = (cardId: string) => {
    setIsAddMenuOpen(false);
    if (cardId === 'wishlist') {
      onSelectWishlist?.();
    } else if (cardId === 'wish') {
      onSelectWish?.();
    }
  };

  // Закрытие меню при клике вне области
  useClickOutside(menuRef, () => setIsAddMenuOpen(false), isAddMenuOpen);

  return (
    <>
      {/* Всплывающее меню добавления */}
      {isAddMenuOpen && (
        <div className="fixed bottom-[120px] left-1/2 -translate-x-1/2 z-40" ref={menuRef}>
          <div className="flex gap-8">
            {FLOATING_CARDS.map((card) => (
              <FloatingCard
                key={card.id}
                icon={card.icon}
                title={t(card.title)} // Переводим ключ i18n
                backgroundColor={card.backgroundColor}
                rotation={card.rotation}
                onClick={() => handleCardClick(card.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Нижнее меню навигации */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="relative w-full h-[98px]">
          {/* Центральная кнопка */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[36px] z-10">
            <Button 
              onClick={handleAddClick}
              variant="default"
              size="icon"
              className="active:scale-95 transition-transform rounded-full"
              style={{
                backgroundColor: 'var(--color-accent)',
                width: '60px',
                height: '60px',
              }}
              aria-label={t('widgets.bottomMenu.addButtonAria')}
            >
              <Plus color="white" strokeWidth={2.5} />
            </Button>
          </div>

          {/* Меню с выемкой (SVG) */}
          <div className="absolute bottom-0 left-0 right-0 h-[68px]">
            <svg 
              className="absolute inset-0 w-full h-full drop-shadow-[0px_-2px_12px_rgba(0,0,0,0.08)]" 
              viewBox="0 0 600 68"
              fill="none"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M 0,0
                   L 252.5,0
                   Q 257.5,0 260.5,5
                   C 267.5,20 274.5,40 300,40
                   C 325.5,40 332.5,20 339.5,5
                   Q 342.5,0 347.5,0
                   L 600,0
                   L 600,68
                   L 0,68
                   Z"
                fill="white"
              />
            </svg>
            
            {/* Иконки меню */}
            <div className="relative h-full flex items-center justify-around px-4">
              {BOTTOM_MENU_ITEMS.map((item) => {
                if (item.isCenter) {
                  // Пустое место для центральной кнопки
                  return <div key={item.id} className="w-[64px]" />;
                }

                const Icon = item.icon;
                const isActive = activeMenuItem === item.id;
                
                return (
                  <Button
                    key={item.id}
                    onClick={() => onMenuItemChange(item.id)}
                    variant="ghost"
                    size="icon-lg"
                    className={`flex flex-col items-center gap-1 active:scale-90 transition-transform ${
                      isActive ? 'text-accent' : 'text-[var(--muted-icon)]'
                    }`}
                  >
                    <Icon 
                      className="w-6 h-6"
                      strokeWidth={2}
                    />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}