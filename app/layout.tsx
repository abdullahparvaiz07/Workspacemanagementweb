import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { ReduxProvider } from '@/lib/redux/provider';
import ToastContainer from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'Workroom',
  description: 'The digital studio for modern teams. Projects, tasks, people and ideas — brought together in one beautifully organized workspace.',
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

import { Toaster } from 'sonner';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ReduxProvider>
          {children}
          <ToastContainer />
          <Toaster position="bottom-right" richColors />
        </ReduxProvider>
      </body>
    </html>
  );
}

