'use client';

import { ReactLenis } from 'lenis/react';
import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </ThemeProvider>
  );
}
