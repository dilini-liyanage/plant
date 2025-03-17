import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 p-4">
        {children}
      </main>
    </div>
  );
} 