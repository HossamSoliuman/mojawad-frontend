// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import GlobalPlayer from '@/components/audio/GlobalPlayer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'مُجَوَّد — Quran Recitation Library',
  description: 'Listen to the finest Quran recitations by renowned qaris from around the world.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} bg-[#07070f] text-white min-h-screen`}>
        <Navbar />
        <main className="pb-28">{children}</main>
        <GlobalPlayer />
      </body>
    </html>
  );
}
