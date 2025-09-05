
'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";
import { AdminMobileBottomNav } from "@/components/admin/AdminMobileBottomNav";
import { useAuth } from '@/context/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role !== 'admin') {
      router.push('/login');
    }
  }, [role, isLoading, router]);

  if (isLoading || role !== 'admin') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminMobileHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mb-16 md:mb-0">
          {children}
        </main>
        <AdminMobileBottomNav />
      </div>
    </div>
  );
}
