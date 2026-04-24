import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider'
import BlueprintBackground from '@/components/layouts/BlueprintBackground'
import TokenExpirationAlert from '@/components/TokenExpirationAlert'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'DevReview AI',
  description: 'Apprenez en construisant des projets réels avec feedback IA',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${poppins.variable} antialiased`}>
      <body>
        <AuthProvider>
          <BlueprintBackground />
          <TokenExpirationAlert />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
