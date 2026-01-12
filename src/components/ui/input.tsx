import * as React from "react";

import { cn } from "./utils";

type InputSize = 'small' | 'medium' | 'large' | 'xl';
type InputVariant = 'default' | 'transparent';

interface InputProps extends React.ComponentProps<"input"> {
  size?: InputSize;
  variant?: InputVariant;
}

function Input({ className, type, size = 'medium', variant = 'default', ...props }: InputProps) {
  const sizeClasses: Record<InputSize, string> = {
    small: 'h-8 px-2 py-1 text-sm',
    medium: 'h-9 px-3 py-1 text-base md:text-sm',
    large: 'py-2 text-xl font-semibold',
    xl: 'h-14 px-4 py-2 text-base',
  };

  const variantClasses: Record<InputVariant, string> = {
    default: 'border bg-input-background border-input',
    transparent: 'border-0 bg-transparent',
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        variant === 'default' && "dark:bg-input/30",
        variant !== 'transparent' && "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        variant !== 'transparent' && "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        variant === 'default' && size === 'large' && 'px-2',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Input };
export type { InputProps, InputSize, InputVariant };