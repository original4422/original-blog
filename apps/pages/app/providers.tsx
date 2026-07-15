'use client';

import { ReactLenis } from 'lenis/react';
import { ThemeProvider, type ThemeProviderProps } from 'next-themes';
import type { ComponentType, PropsWithChildren, ReactNode } from 'react';

const ThemeProviderWithChildren = ThemeProvider as ComponentType<
  PropsWithChildren<ThemeProviderProps>
>;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProviderWithChildren
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </ThemeProviderWithChildren>
  );
}
