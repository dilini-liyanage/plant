'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Home, Leaf, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    label: 'Plants',
    href: '/admin/plants',
    icon: Leaf,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-16 items-center border-b bg-white px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin" className="mr-8 text-xl font-bold">
            Plant Nursery
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium',
                      pathname === item.href || pathname?.startsWith(`${item.href}/`)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" target="_blank" className="text-sm text-gray-600 hover:text-gray-900">
            View Website
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
} 