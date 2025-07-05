import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Francilia Films - Premium Streaming Experience',
  description: 'Unlimited movies, TV shows, and exclusive content. Watch anywhere, anytime.',
  metadataBase: new URL('https://francilia-films.vercel.app'),
  openGraph: {
    title: 'Francilia Films - Premium Streaming Experience',
    description: 'Unlimited movies, TV shows, and exclusive content. Watch anywhere, anytime.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Francilia Films - Premium Streaming Experience',
    description: 'Unlimited movies, TV shows, and exclusive content. Watch anywhere, anytime.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}