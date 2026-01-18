// Страница регистрации
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/app/lib/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUp } from '@/entities/user';
import { createSignUpSchema, type SignUpFormData } from '@/entities/user/model';

interface SignUpPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onSignInClick: () => void;
}

export function SignUpPage({ onBack, onSuccess, onSignInClick }: SignUpPageProps): JSX.Element {
  const { t } = useTranslation();
  const { mutate: signUp, isPending } = useSignUp();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});

  const handleChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    const signUpSchema = createSignUpSchema({
      nameMinLength: t('user.validation.name.minLength'),
      emailInvalid: t('user.validation.email.invalid'),
      passwordMinLength: t('user.validation.password.minLength'),
    });
    
    const result = signUpSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as keyof SignUpFormData] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Отправка
    signUp(formData, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          type="button"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="ml-4 text-xl font-semibold">{t('auth.createAccount')}</h1>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              {t('auth.yourName')}
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              className="h-12 text-base"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              {t('auth.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="john@example.com"
              className="h-12 text-base"
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-medium">
              {t('auth.password')}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              className="h-12 text-base"
              disabled={isPending}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="w-full h-12 text-base font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 mt-8"
          >
            {isPending ? t('common.loading') : t('auth.getStarted')}
          </Button>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-base text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                type="button"
                onClick={onSignInClick}
                className="text-[var(--color-accent)] font-semibold hover:underline"
              >
                {t('auth.signIn')}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}