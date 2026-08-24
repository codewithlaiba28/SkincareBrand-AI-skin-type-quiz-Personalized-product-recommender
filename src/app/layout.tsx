import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import ChatWidget from '@/components/ChatWidget';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'BeautySkin | Reveal Your Beauty',
  description: 'AI-powered personalized skincare recommendations and products.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Providers>
          <Navbar />
          {children}
          <AuthModal />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
