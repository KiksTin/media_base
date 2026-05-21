'use client';

import { ClientProvider } from './ClientContext';
import { SongProvider } from './SongContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientProvider>
      <SongProvider>
        {children}
      </SongProvider>
    </ClientProvider>
  );
}