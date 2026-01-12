import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  /** Позиция label относительно переключателя. 'left' - label слева (с description), 'right' - label справа */
  labelPosition?: 'left' | 'right';
  className?: string;
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  labelPosition = 'left',
  className = '',
}: ToggleSwitchProps) {
  const handleClick = () => {
    onChange(!checked);
  };

  // Если есть description, всегда показываем label + description слева
  const hasDescription = !!description;
  const effectiveLabelPosition = hasDescription ? 'left' : labelPosition;

  return (
    <div
      onClick={handleClick}
      className={`flex items-center cursor-pointer active:opacity-70 transition-opacity ${className}`}
    >
      {/* Label слева (с description) */}
      {effectiveLabelPosition === 'left' && (label || description) && (
        <div className="flex-1 text-left">
          {label && (
            <div className="text-sm font-medium text-gray-700">{label}</div>
          )}
          {description && (
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          )}
        </div>
      )}

      {/* Toggle Switch */}
      <div
        className={`w-11 h-6 rounded-full transition-colors flex items-center p-[3px] ${
          checked ? 'bg-[var(--color-accent)]' : 'bg-gray-300'
        } ${effectiveLabelPosition === 'left' && (label || description) ? 'ml-3' : ''}`}
      >
        <div
          className={`w-[18px] h-[18px] bg-white rounded-full transition-transform shadow-sm ${
            checked ? 'translate-x-[20px]' : 'translate-x-0'
          }`}
        />
      </div>

      {/* Label справа */}
      {effectiveLabelPosition === 'right' && label && (
        <span className="ml-3 text-base font-medium text-gray-900">{label}</span>
      )}
    </div>
  );
}
