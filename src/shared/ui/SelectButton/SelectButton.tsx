import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SelectButtonProps {
  label: string;
  value: string;
  onClick: () => void;
  valueClassName?: string;
  className?: string;
}

export function SelectButton({
  label,
  value,
  onClick,
  valueClassName = 'text-gray-900',
  className = ''
}: SelectButtonProps) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-between px-4 py-4 transition-colors active:bg-gray-100 ${className}`}
      onClick={onClick}
    >
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${valueClassName}`}>
          {value}
        </span>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </button>
  );
}
