import React from 'react';
import Picker from 'react-mobile-picker';
import { Button } from '@/components/ui/button';
import { BaseDrawer, RoundedButton } from '@/shared/ui';
import { useTranslation, translations } from '@/app';
import type { BaseDrawerProps } from '@/shared/model';

interface DatePickerDrawerProps extends BaseDrawerProps {
  selectedDate: Date | undefined;
  onConfirm: (date: Date | undefined) => void;
}

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const YEARS = Array.from({ length: 12 }, (_, i) => (2024 + i).toString());

export function DatePickerDrawer({ open, onOpenChange, selectedDate, onConfirm }: DatePickerDrawerProps) {
  const { t, language } = useTranslation();
  
  // Получаем названия месяцев из i18n
  const MONTH_NAMES = React.useMemo(() => {
    return translations[language as keyof typeof translations].createWishlist.months.genitive;
  }, [language]);
  
  // Инициализация значений из selectedDate или текущей даты
  const initializeValues = React.useCallback(() => {
    const date = selectedDate || new Date();
    return {
      day: date.getDate().toString(),
      month: MONTH_NAMES[date.getMonth()],
      year: date.getFullYear().toString()
    };
  }, [selectedDate, MONTH_NAMES]);

  const [pickerValue, setPickerValue] = React.useState(initializeValues);

  React.useEffect(() => {
    if (open) {
      setPickerValue(initializeValues());
    }
  }, [open, initializeValues]);

  const handleConfirm = () => {
    // Преобразуем выбранные значения в Date
    const monthIndex = MONTH_NAMES.indexOf(pickerValue.month);
    const day = parseInt(pickerValue.day);
    const year = parseInt(pickerValue.year);
    
    const newDate = new Date(year, monthIndex, day);
    onConfirm(newDate);
    onOpenChange(false);
  };

  const handleClear = () => {
    onConfirm(undefined);
    onOpenChange(false);
  };

  return (
    <BaseDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t('createWishlist.ui.datePickerTitle')}
      footer={
        <div className="space-y-3">
          <RoundedButton 
            label={t('createWishlist.ui.datePickerConfirm')} 
            isActive={true} 
            onClick={handleConfirm}
            variant="full"
          />
          {selectedDate && (
            <button
              onClick={handleClear}
              className="w-full text-center text-sm text-gray-600 py-2 transition-colors"
            >
              {t('createWishlist.ui.datePickerClear')}
            </button>
          )}
        </div>
      }
    >
      <div className="pb-4">
        {/* iOS-style Wheel Picker */}
        <div className="relative">
          <Picker
            value={pickerValue}
            onChange={setPickerValue}
            wheelMode="normal"
            height={240}
            itemHeight={40}
          >
            <Picker.Column name="day">
              {DAYS.map(day => (
                <Picker.Item key={day} value={day}>
                  {day}
                </Picker.Item>
              ))}
            </Picker.Column>
            
            <Picker.Column name="month">
              {MONTH_NAMES.map(month => (
                <Picker.Item key={month} value={month}>
                  {month}
                </Picker.Item>
              ))}
            </Picker.Column>
            
            <Picker.Column name="year">
              {YEARS.map(year => (
                <Picker.Item key={year} value={year}>
                  {year}
                </Picker.Item>
              ))}
            </Picker.Column>
          </Picker>
        </div>
      </div>
      
      {/* Кастомные стили для iOS-look */}
      <style>{`
        .picker-container {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .picker-column {
          color: #1f2937;
        }
        
        .picker-item {
          font-size: 20px;
          font-weight: 400;
          color: #9ca3af;
          transition: all 0.2s ease;
        }
        
        .picker-item.picker-item-selected {
          color: #1f2937;
          font-weight: 500;
        }
        
        .picker-highlight {
          background: linear-gradient(to bottom, 
            rgba(95, 51, 225, 0.05) 0%, 
            rgba(95, 51, 225, 0.08) 50%, 
            rgba(95, 51, 225, 0.05) 100%
          );
          border-top: 1px solid rgba(95, 51, 225, 0.1);
          border-bottom: 1px solid rgba(95, 51, 225, 0.1);
        }
      `}</style>
    </BaseDrawer>
  );
}