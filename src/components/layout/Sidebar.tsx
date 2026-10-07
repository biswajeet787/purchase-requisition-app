import type { ReactNode } from 'react';
import { BarChart3, Boxes, ClipboardList, ShoppingCart, X } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '@/lib/cn';

const NAV = [
  { label: 'Purchase Requisitions', to: '/purchase-requisitions', icon: ClipboardList },
  { label: 'Purchase Orders', icon: ShoppingCart },
  { label: 'Inventory', icon: Boxes },
  { label: 'Reports', icon: BarChart3 },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  footer?: ReactNode;
}

export function Sidebar({ open, onClose, footer }: SidebarProps) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-950 text-slate-300 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-white/10 text-sm font-bold text-white ring-1 ring-white/20">S</div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">Spectrum ERP</p>
              <p className="text-[11px] text-slate-400">by Force Intellect</p>
            </div>
          </div>
          <button type="button" aria-label="Close menu" onClick={onClose} className="rounded-md p-1 hover:bg-white/10 lg:hidden">
            <X className="size-5" />
          </button>
        </div>

        <nav aria-label="Main" className="mt-4 flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const Icon = item.icon;
            if (!('to' in item)) {
              return (
                <span key={item.label} aria-disabled className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm opacity-40">
                  <Icon className="size-4.5" aria-hidden /> {item.label}
                </span>
              );
            }
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white')
                }
              >
                <Icon className="size-4.5" aria-hidden /> {item.label}
              </NavLink>
            );
          })}
        </nav>
        {footer && <div className="border-t border-white/10 p-4">{footer}</div>}
      </aside>
    </>
  );
}
