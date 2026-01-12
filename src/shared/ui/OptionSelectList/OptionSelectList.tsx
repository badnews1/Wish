import React from 'react';
import { Check } from 'lucide-react';
import type { SelectOption } from '../../model';

interface OptionSelectListProps<T extends string> {
  options: readonly SelectOption[];
  selected?: T;
  onSelect: (value: T) => void;
  title?: string;
}

export function OptionSelectList<T extends string>({ options, selected, onSelect, title }: OptionSelectListProps<T>) {
  return (
    <div className="flex flex-col h-full">
      {/* Заголовок (если передан) */}
      {title && (
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
            {title}
          </h3>
        </div>
      )}

      {/* Список опций */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-2">
        {options.map((option) => {
          const isSelected = selected === option.id;
          
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id as T)}
              className="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-colors hover:bg-gray-50"
            >
              {option.icon && (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {typeof option.icon === 'string' 
                    ? <span className="text-xl">{option.icon}</span>
                    : <option.icon size={20} className="text-gray-600" />
                  }
                </div>
              )}
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-gray-500">{option.description}</div>
                )}
              </div>
              {isSelected && (
                <Check size={20} className="text-accent flex-shrink-0" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}