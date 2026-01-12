import { ArrowLeft, Share2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/widgets/Header';
import type { WishlistCoverProps } from '../model';

/**
 * Обложка вишлиста с overlay кнопками
 */
export function WishlistCover({
  imageUrl,
  backgroundColor,
  title,
  onBack,
  onEdit
}: WishlistCoverProps) {
  return (
    <Header
      variant="overlay"
      imageUrl={imageUrl}
      imageAlt={title}
      backgroundColor={backgroundColor}
      height="16rem"
      leftAction={
        <Button
          onClick={onBack}
          variant="icon-white"
          size="icon"
          shape="circle"
        >
          <ArrowLeft />
        </Button>
      }
      rightAction={
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
      }
    />
  );
}