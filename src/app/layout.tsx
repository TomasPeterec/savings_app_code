import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Savings App',
  description: 'Miniaplikácia na dedikované sporenie',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sk">
      <body className="bg-gray-100 font-sans min-h-screen">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <h1 className="text-xl font-bold">Savings App</h1>
        </header>

        <main className="p-4">{children}</main>

        <footer className="text-center text-gray-500 text-sm p-4 mt-auto">
          © 2025 Savings App
        </footer>
      </body>
    </html>
  );
}
