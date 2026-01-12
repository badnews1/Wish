import type { HomeTabId } from '../../../app/routing';

/**
 * Props главной страницы
 */
export interface HomePageProps {
  currentSubPage: HomeTabId;
  onTabChange: (tabId: HomeTabId) => void;
  children: React.ReactNode;
}