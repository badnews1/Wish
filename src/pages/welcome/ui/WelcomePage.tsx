// Welcome screen - первый экран приложения
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SocialAuthButtons } from '@/features/auth-social';
import { useTranslation } from '@/app/lib/hooks/useTranslation';

interface WelcomePageProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export function WelcomePage({ onSignUp, onSignIn }: WelcomePageProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        {/* Иконка */}
        <div className="w-24 h-24 rounded-full bg-[#5F33E1]/10 flex items-center justify-center mb-8">
          <Gift className="w-12 h-12 text-[#5F33E1]" />
        </div>

        {/* Заголовок */}
        <h1 className="text-3xl font-bold text-center mb-4">
          {t('auth.welcomeTitle')}
        </h1>

        {/* Описание */}
        <p className="text-base text-gray-600 text-center max-w-sm">
          {t('auth.welcomeDescription')}
        </p>
      </div>

      {/* Action Section */}
      <div className="px-6 pb-8 space-y-4">
        {/* Primary CTA - Sign Up */}
        <Button
          size="lg"
          onClick={onSignUp}
          className="w-full h-12 text-base font-semibold bg-[#5F33E1] hover:bg-[#5F33E1]/90"
        >
          {t('auth.getStarted')}
        </Button>

        {/* Secondary CTA - Sign In */}
        <Button
          variant="outline"
          size="lg"
          onClick={onSignIn}
          className="w-full h-12 text-base font-semibold"
        >
          {t('auth.signIn')}
        </Button>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              {t('auth.orContinueWith')}
            </span>
          </div>
        </div>

        {/* Social Auth */}
        <SocialAuthButtons />
      </div>
    </div>
  );
}