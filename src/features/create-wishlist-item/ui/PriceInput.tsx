import React, { useState, useEffect } from 'react';
import { BaseDrawer } from '../../../shared/ui';
import { useMultipleDrawers } from '../../../shared/lib';
import { useTranslation } from '@/app';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from '../config';

interface PriceInputProps {
  price?: number;
  currency?: string;
  onPriceChange: (price: number | undefined) => void;
  onCurrencyChange: (currency: string | undefined) => void;
}

export function PriceInput({
  price,
  currency,
  onPriceChange,
  onCurrencyChange
}: PriceInputProps) {
  const { t } = useTranslation();
  const drawers = useMultipleDrawers({ currency: false });
  const [localPrice, setLocalPrice] = useState(price?.toString() || '');
  const [localCurrency, setLocalCurrency] = useState(currency || DEFAULT_CURRENCY);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setLocalPrice(price?.toString() || '');
    setLocalCurrency(currency || DEFAULT_CURRENCY);
  }, [price, currency]);

  const handlePriceChange = (value: string) => {
    setLocalPrice(value);
    const priceValue = parseFloat(value);
    if (value && !isNaN(priceValue)) {
      onPriceChange(priceValue);
    } else {
      onPriceChange(undefined);
    }
  };

  const handleCurrencySelect = (selectedCurrency: string) => {
    setLocalCurrency(selectedCurrency);
    onCurrencyChange(selectedCurrency);
    drawers.currency.close();
  };

  return (
    <>
      <div className="flex items-center gap-3">
        {/* Кнопка выбора валюты */}
        <Button
          type="button"
          onClick={drawers.currency.open}
          size="icon-2xl"
          className="flex-shrink-0 bg-[var(--color-accent)] text-white font-semibold rounded-2xl"
        >
          {localCurrency}
        </Button>

        {/* Input для цены */}
        <div className="flex-1">
          <Input
            type="number"
            placeholder={t('createWishlistItem.ui.pricePlaceholder')}
            value={localPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            step="0.01"
            min="0"
            size="xl"
            className="bg-gray-100 border-0 placeholder:text-[var(--color-accent)] rounded-2xl"
          />
        </div>
      </div>

      {/* Drawer выбора валюты */}
      <BaseDrawer
        open={drawers.currency.isOpen}
        onOpenChange={drawers.currency.setOpen}
      >
        <div className="p-6 space-y-3">
          {CURRENCY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => handleCurrencySelect(option.id)}
              className={`w-full px-4 py-4 rounded-2xl text-left transition-colors ${
                localCurrency === option.id
                  ? 'bg-[var(--accent-muted)] text-[var(--color-accent)] font-medium'
                  : 'bg-gray-50 text-gray-900 active:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </BaseDrawer>
    </>
  );
}