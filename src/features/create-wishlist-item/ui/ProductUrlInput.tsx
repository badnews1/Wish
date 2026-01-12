import React, { useState } from 'react';
import { Link as LinkIcon, RefreshCw, Trash2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/app';
import { parseProductUrl } from '../api/parseProduct';
import type { ParsedProduct, ParserStatus, ParserError } from '../model/productParser';

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
        toast.success(t('createWishlistItem.productParser.toast.linkPasted'));
      }
    } catch (error) {
      toast.error(t('createWishlistItem.productParser.toast.pasteError'), {
        description: t('createWishlistItem.productParser.toast.pasteErrorDescription')
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

      toast.success(t('createWishlistItem.productParser.toast.dataLoadedSuccess'), {
        description: t('createWishlistItem.productParser.toast.dataLoadedDescription')
      });

      onParsed(parsedProduct);
    } catch (error: unknown) {
      setStatus('error');
      
      // Переводим код ошибки, если есть, иначе используем fallback
      const errorMessage = (error as ParserError)?.code 
        ? t(`createWishlistItem.productParser.errors.${(error as ParserError).code}`)
        : t('createWishlistItem.productParser.toast.loadErrorDescription');
      
      toast.error(t('createWishlistItem.productParser.toast.loadError'), {
        description: errorMessage
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
            placeholder={t('createWishlistItem.productParser.ui.urlPlaceholder')}
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
          aria-label={isEmpty ? t('createWishlistItem.productParser.ui.pasteAria') : t('createWishlistItem.productParser.ui.clearAria')}
          className="flex-shrink-0"
        >
          {isEmpty ? (
            <LinkIcon className="w-5 h-5 text-white" />
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
          aria-label={t('createWishlistItem.productParser.ui.syncAria')}
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
        {t('createWishlistItem.productParser.ui.hint')}
      </p>
    </div>
  );
}