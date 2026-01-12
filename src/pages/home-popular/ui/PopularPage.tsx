import { useTranslation } from '@/app';

export function PopularPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-4">
      <div className="text-center text-muted-foreground py-8">
        {t('pages.homePopular.title')}
      </div>
    </div>
  );
}