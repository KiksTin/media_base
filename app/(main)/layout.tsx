
import { SongProvider } from "../context/SongContext";
import { ClientProvider } from "../context/ClientContext";
import ClientLayout from './ClientLayout';


import "../globals.css";
import "../color.css";
import "../size.css";


export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientProvider>
      <SongProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
      </SongProvider>
    </ClientProvider>
  );
}
