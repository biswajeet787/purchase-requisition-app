import type { ComponentProps } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { controlStyles } from './Input';

interface SelectProps extends ComponentProps<'select'> {
  invalid?: boolean;
}

export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(controlStyles(invalid), 'appearance-none pr-9', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
    </div>
  );
}
