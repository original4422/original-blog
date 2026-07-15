'use client';

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from 'next-themes';
import type { ComponentType, PropsWithChildren } from 'react';

type ThemeProviderWithChildrenProps = PropsWithChildren<ThemeProviderProps>;

const NextThemesProviderWithChildren =
	NextThemesProvider as ComponentType<ThemeProviderWithChildrenProps>;

export default function ThemeProvider({
	children,
	...props
}: ThemeProviderWithChildrenProps) {
	return (
		<NextThemesProviderWithChildren {...props}>
			{children}
		</NextThemesProviderWithChildren>
	);
}
