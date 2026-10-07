import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  actions?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, description, crumbs, actions, badge }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1 text-xs text-slate-500">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3" aria-hidden />}
                {c.to ? <Link to={c.to} className="hover:text-brand-700 hover:underline">{c.label}</Link> : <span className="font-medium text-slate-700">{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {badge}
        </div>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}
