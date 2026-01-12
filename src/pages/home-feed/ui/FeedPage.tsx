import { useTranslation } from '../../../shared/lib/hooks';
import type { FeedPageProps } from '../model';

export function FeedPage({ onCreateWishlist }: FeedPageProps) {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-4">
      <div className="text-center text-muted-foreground py-8">
        {t('pages.homeFeed.title')}
      </div>
    </div>
  );
}