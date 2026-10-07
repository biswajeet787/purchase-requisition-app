import type { ComponentProps, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 text-white shadow-sm hover:bg-brand-800 active:bg-brand-900',
  secondary: 'bg-brand-50 text-brand-800 hover:bg-brand-100',
  outline: 'border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
};
const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
};

/** Shared class builder so <Link> and <button> can look identical. */
export const buttonStyles = ({ variant = 'primary', size = 'md', className }: { variant?: Variant; size?: Size; className?: string } = {}) =>
  cn(
    'inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors',
    'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({ variant, size, loading, icon, className, children, disabled, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} disabled={disabled || loading} className={buttonStyles({ variant, size, className })} {...props}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}
