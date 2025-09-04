
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UserDesktopSidebar } from '@/components/account/UserDesktopSidebar';
import { UserMobileBottomNav } from '@/components/account/UserMobileBottomNav';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12">
        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <aside className="hidden md:block">
            <UserDesktopSidebar />
          </aside>
          <div className="pb-16 md:pb-0">
            {children}
          </div>
        </div>
      </main>
      <Footer />
      <UserMobileBottomNav />
    </div>
  );
}
