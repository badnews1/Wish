import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FloatingCardProps {
  icon: LucideIcon;
  title: string;
  backgroundColor: string;
  rotation: number;
  onClick: () => void;
}

/**
 * Санитизирует HTML строку, разрешая только безопасные теги для переносов строк
 * 
 * Сначала экранирует все HTML символы, затем восстанавливает только <br/> теги.
 * Это защищает от XSS атак через другие HTML теги и скрипты.
 * 
 * Разрешено: <br/>, <br>, <br />
 * Всё остальное экранируется и отображается как текст
 */
function sanitizeTitle(html: string): string {
  // Сначала экранируем всё
  const escaped = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Восстанавливаем только безопасные <br/> теги
  return escaped.replace(/&lt;br\s*\/?&gt;/gi, '<br/>');
}

export function FloatingCard({ icon: Icon, title, backgroundColor, rotation, onClick }: FloatingCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-[140px] h-[140px] active:scale-95 transition-transform"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div 
        className="w-full h-full rounded-[28px] p-4 flex flex-col items-center justify-center gap-3 shadow-2xl border-4 border-white"
        style={{ backgroundColor }}
      >
        <div className="size-12 flex items-center justify-center">
          <Icon size={32} color="white" strokeWidth={2} />
        </div>
        <span 
          className="text-white font-medium text-sm text-center leading-tight"
          dangerouslySetInnerHTML={{ __html: sanitizeTitle(title) }}
        />
      </div>
    </button>
  );
}