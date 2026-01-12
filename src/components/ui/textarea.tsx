import * as React from "react";

import { cn } from "./utils";

type TextareaSize = 'small' | 'medium' | 'large';
type TextareaVariant = 'default' | 'transparent';

interface TextareaProps extends React.ComponentProps<"textarea"> {
  size?: TextareaSize;
  variant?: TextareaVariant;
}

function Textarea({ className, size = 'medium', variant = 'default', ...props }: TextareaProps) {
  const sizeClasses: Record<TextareaSize, string> = {
    small: 'min-h-12 px-2 py-1 text-sm',
    medium: 'min-h-16 px-3 py-2 text-base md:text-sm',
    large: 'min-h-20 px-2 py-2 text-base',
  };

  const variantClasses: Record<TextareaVariant, string> = {
    default: 'border bg-input-background border-input',
    transparent: 'border-0 bg-transparent',
  };

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full rounded-md transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === 'default' && "dark:bg-input/30",
        variant !== 'transparent' && "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        variant !== 'transparent' && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps, TextareaSize, TextareaVariant };