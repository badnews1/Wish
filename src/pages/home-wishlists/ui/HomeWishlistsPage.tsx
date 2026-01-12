import { useTranslation } from '@/app';

export function HomeWishlistsPage() {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-4">
      <div className="text-center text-muted-foreground py-8">
        {t('pages.homeWishlists.title')}
      </div>
    </div>
  );
}