
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UserSidebar } from '@/components/account/UserSidebar';

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container py-12 md:pb-12 pb-24">
        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <aside className="md:block">
            <UserSidebar />
          </aside>
          <div>
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
