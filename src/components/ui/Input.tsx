import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export const controlStyles = (invalid?: boolean) =>
  cn(
    'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400',
    'focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none',
    'disabled:cursor-not-allowed disabled:bg-slate-100 read-only:bg-slate-50 read-only:text-slate-600',
    invalid ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300',
  );

interface InputProps extends ComponentProps<'input'> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...props }: InputProps) {
  return <input aria-invalid={invalid || undefined} className={cn(controlStyles(invalid), className)} {...props} />;
}

interface TextareaProps extends ComponentProps<'textarea'> {
  invalid?: boolean;
}

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(controlStyles(invalid), 'h-auto min-h-20 py-2', className)}
      {...props}
    />
  );
}
