import { toast } from 'sonner@2.0.3';

/**
 * Общие утилиты для уведомлений (без бизнес-логики)
 */
export const notifications = {
  common: {
    success: (message: string) => toast.success(message),
    error: (message: string, options?: { description?: string }) => {
      if (options?.description) {
        toast.error(message, { description: options.description });
      } else {
        toast.error(message);
      }
    },
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
  },
};
