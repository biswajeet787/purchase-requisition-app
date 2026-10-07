import { Suspense, useState, type ReactNode } from 'react';
import { Outlet } from 'react-router';
import { Skeleton } from '@/components/ui/Skeleton';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout({ sidebarFooter }: { sidebarFooter?: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} footer={sidebarFooter} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
