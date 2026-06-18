import type { ReactNode } from 'react';
import { Footer, Navbar } from '@/components/organisms';

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
