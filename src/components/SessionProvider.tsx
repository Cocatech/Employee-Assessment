'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function SessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check session status every 5 minutes
    const interval = setInterval(() => {
      if (status === 'unauthenticated') {
        // Session expired or logged out
        router.push('/auth/signin');
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [status, router]);

  // Immediate check on mount
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <SessionMonitor />
      {children}
    </NextAuthSessionProvider>
  );
}
