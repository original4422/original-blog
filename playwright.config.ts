import { defineConfig, devices } from '@playwright/test';

const pagesBasePath =
	process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages';
const baseURL = `http://127.0.0.1:4173${pagesBasePath}/`;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL,
		trace: 'retain-on-failure',
	},
	webServer: {
		command: 'pnpm preview:pages',
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
	projects: [
		{
			name: 'pages-mobile',
			grep: /@mobile/,
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 390, height: 844 },
			},
		},
		{
			name: 'pages-desktop',
			grep: /@desktop/,
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 1280, height: 800 },
			},
		},
	],
});
