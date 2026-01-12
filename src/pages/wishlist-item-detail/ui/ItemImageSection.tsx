import { ArrowLeft, Share2, Pencil, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageOverlay } from '@/shared/ui';
import type { GiftTag } from '@/entities/wishlist';
import { GIFT_TAG_CONFIG } from '@/entities/wishlist';
import type { ItemImageSectionProps } from '../model';
import { useTranslation } from '@/app';

/**
 * Секция изображения товара с overlay кнопками и badge
 */
export function ItemImageSection({
  imageUrl,
  title,
  giftTag,
  onBack,
  onEdit
}: ItemImageSectionProps) {
  const { t } = useTranslation();
  const giftTagConfig = giftTag ? GIFT_TAG_CONFIG[giftTag] : null;

  return (
    <ImageOverlay
      imageUrl={imageUrl}
      alt={title}
      height="24rem"
      rounded="lg"
      className="rounded-t-none"
      emptyStateContent={
        <div className="w-full h-full flex items-center justify-center">
          <Tag className="w-20 h-20 text-gray-300" strokeWidth={1.5} />
        </div>
      }
      overlayElements={[
        {
          element: (
            <Button
              onClick={onBack}
              variant="icon-white"
              size="icon"
              shape="circle"
            >
              <ArrowLeft />
            </Button>
          ),
          position: 'top-left'
        },
        {
          element: (
            <div className="flex gap-2">
              <Button
                onClick={onEdit}
                variant="icon-white-semi"
                size="icon"
                shape="circle"
              >
                <Pencil className="w-5 h-5" />
              </Button>
              <Button
                variant="icon-white-semi"
                size="icon"
                shape="circle"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          ),
          position: 'top-right'
        },
        ...(giftTagConfig ? [{
          element: (
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg"
              style={{
                backgroundColor: giftTagConfig.bgColor,
                color: giftTagConfig.textColor,
              }}
            >
              <span className="text-base">{giftTagConfig.emoji}</span>
              {t(giftTagConfig.labelKey)}
            </span>
          ),
          position: 'bottom-left' as const
        }] : [])
      ]}
    />
  );
}