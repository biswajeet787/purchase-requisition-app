import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: 'neutral' | 'danger';
}

function StateMessage({ icon: Icon, title, description, action, tone = 'neutral' }: StateMessageProps) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center px-6 py-16 text-center">
      <div className={cn('mb-4 grid size-14 place-items-center rounded-2xl', tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700')}>
        <Icon className="size-7" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5 flex gap-2">{action}</div>}
    </div>
  );
}

type Preset = Omit<StateMessageProps, 'icon' | 'tone'>;

export const EmptyState = (props: Preset) => <StateMessage icon={Inbox} {...props} />;
export const ErrorState = (props: Preset) => (
  <div role="alert">
    <StateMessage icon={AlertTriangle} tone="danger" {...props} />
  </div>
);
