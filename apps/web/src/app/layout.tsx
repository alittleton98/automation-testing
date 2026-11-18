import type { Metadata } from 'next';
import { APP_VERSION } from '@autotest/core';
import './globals.css';

export const metadata: Metadata = {
  title: 'Automation Testing',
  description: 'A stub web app for practicing CI/CD with GitHub Actions',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <main className="mx-auto max-w-2xl px-4 py-10">{children}</main>
        <footer className="pb-6 text-center text-xs text-slate-400">
          v{APP_VERSION} · {process.env.NEXT_PUBLIC_GIT_SHA ?? 'local'}
        </footer>
      </body>
    </html>
  );
}
