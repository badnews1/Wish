import React, { useState } from 'react';
import { Link, Loader2, Check, Trash2, RefreshCw } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../../../shared/lib';

import { parseProductUrl } from '../api/parseProduct';
import type { ParsedProduct, ParserStatus } from '../model';

interface ProductUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  onParsed: (product: ParsedProduct) => void;
}

export function ProductUrlInput({ value, onChange, onParsed }: ProductUrlInputProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ParserStatus>('idle');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        toast.success(t('productParser.toast.linkPasted'));
      }
    } catch (error) {
      toast.error(t('productParser.toast.pasteError'), {
        description: t('productParser.toast.pasteErrorDescription')
      });
    }
  };

  const handleClear = () => {
    onChange('');
    setStatus('idle');
    setShowSuccess(false);
  };

  const handleSync = async () => {
    if (!value.trim()) return;

    setStatus('loading');
    setShowSuccess(false);

    try {
      const parsedProduct = await parseProductUrl(value);
      setStatus('success');
      setShowSuccess(true);
      
      // Показываем галочку на 1 секунду
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);

      toast.success(t('productParser.toast.dataLoadedSuccess'), {
        description: t('productParser.toast.dataLoadedDescription')
      });

      onParsed(parsedProduct);
    } catch (error: any) {
      setStatus('error');
      toast.error(t('productParser.toast.loadError'), {
        description: error?.message || t('productParser.toast.loadErrorDescription')
      });
      
      // Сбрасываем статус ошибки через 2 секунды
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  };

  const isEmpty = !value.trim();
  const isLoading = status === 'loading';
  const isDisabled = isEmpty || isLoading;

  return (
    <div className="bg-[var(--color-accent)] rounded-2xl p-6 space-y-3">
      <div className="relative flex items-center gap-2">
        {/* Input */}
        <div className="flex-1 relative">
          <Input
            type="url"
            placeholder={t('productParser.ui.urlPlaceholder')}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white"
          />
        </div>

        {/* Иконка вставки/очистки */}
        <Button
          variant="ghost"
          size="icon"
          shape="square"
          onClick={isEmpty ? handlePaste : handleClear}
          disabled={isLoading}
          aria-label={isEmpty ? t('productParser.ui.pasteAria') : t('productParser.ui.clearAria')}
          className="flex-shrink-0"
        >
          {isEmpty ? (
            <Link className="w-5 h-5 text-white" />
          ) : (
            <Trash2 className="w-5 h-5 text-white" />
          )}
        </Button>

        {/* Иконка синхронизации/загрузки */}
        <Button
          variant="ghost"
          size="icon"
          shape="square"
          onClick={handleSync}
          disabled={isDisabled}
          aria-label={t('productParser.ui.syncAria')}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : showSuccess ? (
            <Check className="w-5 h-5 text-green-300" />
          ) : (
            <RefreshCw 
              className={`w-5 h-5 ${isDisabled ? 'text-white/40' : 'text-white'}`} 
            />
          )}
        </Button>
      </div>

      <p className="text-sm text-white/80">
        {t('productParser.ui.hint')}
      </p>
    </div>
  );
}
