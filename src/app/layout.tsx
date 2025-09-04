
import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartProvider';
import { WishlistProvider } from '@/context/WishlistProvider';
import { AuthProvider } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';
import { DataProvider } from '@/context/DataProvider';

export const metadata: Metadata = {
  title: 'KenaKata Online Store',
  description: 'A modern online store experience.',
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          poppins.variable,
          inter.variable
        )}
      >
        <AuthProvider>
          <DataProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
