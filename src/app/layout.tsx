import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import Header from '@/components/public/Header';

import './globals.css';
import { auth } from '@clerk/nextjs/server';
import AdminNav from '@/components/admin/AdminNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plant Nursery',
  description: 'Discover beautiful plants for your home and garden',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="bg-[#f2f2f2]">
            {userId ? <AdminNav /> : <Header />}
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
