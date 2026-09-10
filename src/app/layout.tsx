import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

export const metadata: Metadata = {
  title: 'Love Thy Salad | Healthy Food Cloud Kitchen in Baner, Pune',
  description:
    'Fresh, nutrient-rich salads, cold pressed juices, wraps, soups, and oat jars delivered fresh to your doorstep in Baner, Pune. Subscribe to our 20 Meal Plan today.',
  keywords: [
    'Love Thy Salad',
    'Salad delivery Baner',
    'Healthy food Pune',
    'Cloud kitchen Baner',
    '20 meal plan subscription Pune',
    'Smiti Olga Khattri',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-salad-bg text-salad-charcoal antialiased flex flex-col min-h-screen">
        <AdminAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
