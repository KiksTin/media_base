'use client';

import { ClientProvider } from './ClientContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <ClientProvider>{children}</ClientProvider>;
}