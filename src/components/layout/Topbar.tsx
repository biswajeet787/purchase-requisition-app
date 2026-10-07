import { Menu } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppStore';

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const user = useAppSelector((s) => s.session.user);
  const initials = user.name.split(' ').map((n) => n[0]).join('');

  return (
    <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-8">
      <button type="button" aria-label="Open menu" onClick={onMenu} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
        <Menu className="size-5" />
      </button>
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
          <p className="text-xs text-slate-500">Logged in</p>
        </div>
        <div className="grid size-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">{initials}</div>
      </div>
    </div>
  );
}
