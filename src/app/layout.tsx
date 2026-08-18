import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SalonOsa — Affordable Salon Management & Customer Booking SaaS',
  description: 'Manage your salon, staff, appointments, billing, customer CRM, and automated WhatsApp rebooking for only ₹2,999/Year.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
