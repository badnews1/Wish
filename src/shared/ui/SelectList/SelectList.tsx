import { Check } from 'lucide-react';
import { RoundedButton } from '../RoundedButton';
import { useTranslation } from '@/app';

interface SelectOption {
  id: string;
  label: string;
  icon?: string;
}

interface SingleSelectProps {
  mode: 'single';
  options: readonly SelectOption[];
  selected?: string;
  onSelect: (id: string) => void;
  title?: string;
}

interface MultiSelectProps {
  mode: 'multi';
  options: SelectOption[];
  selected: string[];
  onToggle: (id: string) => void;
  onDone: () => void;
  title?: string;
  maxSelections?: number;
}

type SelectListProps = SingleSelectProps | MultiSelectProps;

export function SelectList(props: SelectListProps) {
  const { options, title } = props;
  const { t } = useTranslation();

  const handleClick = (id: string) => {
    if (props.mode === 'single') {
      props.onSelect(id);
    } else {
      // В multi режиме проверяем ограничение
      if (props.maxSelections && !props.selected.includes(id) && props.selected.length >= props.maxSelections) {
        return;
      }
      props.onToggle(id);
    }
  };

  const isSelected = (id: string): boolean => {
    if (props.mode === 'single') {
      return props.selected === id;
    } else {
      return props.selected.includes(id);
    }
  };

  const isDisabled = (id: string): boolean => {
    if (props.mode === 'multi' && props.maxSelections) {
      return !props.selected.includes(id) && props.selected.length >= props.maxSelections;
    }
    return false;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок */}
      {title && (
        <div className="px-6 pt-6 pb-4">
          <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">
            {title}
          </h3>
        </div>
      )}

      {/* Список опций в виде pills */}
      <div className={`flex-1 px-6 overflow-y-auto ${title ? 'pb-4' : 'pt-6 pb-4'}`}>
        <div className="flex flex-wrap gap-3">
          {options.map((option) => {
            const selected = isSelected(option.id);
            const disabled = isDisabled(option.id);
            
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleClick(option.id)}
                disabled={disabled}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-base
                  transition-all active:scale-[0.98]
                  ${selected 
                    ? 'bg-[var(--color-accent)] text-white' 
                    : disabled
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {option.icon && <span className="text-xl">{option.icon}</span>}
                <span>{option.label}</span>
                {selected && <Check className="w-5 h-5" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Кнопка "Готово" только для multi режима */}
      {props.mode === 'multi' && (
        <div className="p-6">
          <RoundedButton
            label={t('common.done')}
            isActive={true}
            onClick={props.onDone}
            variant="full"
          />
        </div>
      )}
    </div>
  );
}