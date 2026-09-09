import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { ReduxProvider } from '@/lib/redux/provider';
import ToastContainer from '@/components/ui/ToastContainer';
import OfflineIndicator from '@/components/ui/OfflineIndicator';
import SimulatedEventsProvider from '@/components/ui/SimulatedEventsProvider';
import { SupabaseRealtimeProvider } from '@/components/providers/SupabaseRealtimeProvider';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { KeyboardShortcutsMount } from '@/components/providers/KeyboardShortcutsMount';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Workroom',
  description: 'The digital studio for modern teams. Projects, tasks, people and ideas — brought together in one beautifully organized workspace.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Workroom',
    description: 'The digital studio for modern teams. Projects, tasks, people and ideas — brought together in one beautifully organized workspace.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workroom',
    description: 'The digital studio for modern teams. Projects, tasks, people and ideas — brought together in one beautifully organized workspace.',
  },
};

import { Suspense } from 'react';
import { AppPreloader } from '@/components/ui/AppPreloader';
import { NavigationProgress } from '@/components/ui/NavigationProgress';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            <AppPreloader />
            <Suspense fallback={null}>                                             
              <NavigationProgress />
            </Suspense>
            {children}
            <ToastContainer />
            <Toaster position="bottom-right" richColors />
            <OfflineIndicator />
            <SimulatedEventsProvider />
            <SupabaseRealtimeProvider children={null} />
            <KeyboardShortcutsMount />
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

