import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
 import { ToastContainer, toast } from 'react-toastify';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
          <SidebarProvider>{children}</SidebarProvider>
          </AuthProvider>
           <ToastContainer position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
