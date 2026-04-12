// app/layout.tsx
import type { Metadata } from 'next';
import { Sidebar } from '@/components/Sidebar';
import { AppInitializer } from '@/components/AppInitializer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Airtel Asset Inventory',
  description: 'Offline-first asset inventory management system',
  manifest: '/manifest.json',
  icons: {
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect fill="%23E30613" width="180" height="180"/><text x="50%" y="50%" font-size="80" fill="white" text-anchor="middle" dy=".3em" font-weight="bold">AI</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#E30613" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <AppInitializer>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6 lg:p-8">{children}</div>
            </main>
          </div>
        </AppInitializer>
      </body>
    </html>
  );
}
