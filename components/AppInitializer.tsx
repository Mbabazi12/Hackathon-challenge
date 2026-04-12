// components/AppInitializer.tsx
'use client';

import { useEffect } from 'react';
import { initDB } from '@/lib/indexedDB';
import { useUIStore } from '@/store/uiStore';

/**
 * AppInitializer component - runs initialization logic on app load
 */
export function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize IndexedDB
    initDB().catch(console.error);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Initialize dark mode from localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      useUIStore.setState({ darkMode: true });
      document.documentElement.classList.add('dark');
    }
  }, []);

  return <>{children}</>;
}
