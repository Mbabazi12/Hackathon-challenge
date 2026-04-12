// components/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  UserCheck,
  FileText,
  History,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/assets', label: 'Assets', icon: Package },
  { href: '/employees', label: 'Employees', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: UserCheck },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/audit', label: 'Audit Log', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Don't render dynamic content until hydration is complete
  if (!isHydrated) {
    return (
      <aside className="fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform lg:relative">
        <div className="flex h-screen flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Package className="text-airtel-red" size={28} />
              <div>
                <h1 className="font-bold text-airtel-red">Airtel</h1>
                <p className="text-xs text-gray-600">Inventory</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6" />
          <div className="border-t border-gray-200 p-4" />
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-40 rounded-lg p-2 lg:hidden"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform dark:bg-gray-800 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-screen flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Package className="text-airtel-red" size={28} />
              <div>
                <h1 className="font-bold text-airtel-red">Airtel</h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Inventory
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 space-y-2 px-4 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => toggleSidebar()}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-colors ${
                    isActive
                      ? 'bg-airtel-red text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <button
              onClick={toggleDarkMode}
              className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-700"
            >
              <span className="text-sm font-medium">
                {darkMode ? 'Light' : 'Dark'}
              </span>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
