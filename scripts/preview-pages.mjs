import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'apps/pages/out');
const port = Number(process.env.PORT ?? 4173);

function normalizeBasePath(value) {
	if (!value || value === '/') return '';
	return `/${value}`.replace(/\/{2,}/g, '/').replace(/\/$/, '');
}

const basePath = normalizeBasePath(
	process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages',
);

const contentTypes = new Map([
	['.css', 'text/css; charset=utf-8'],
	['.html', 'text/html; charset=utf-8'],
	['.ico', 'image/x-icon'],
	['.jpeg', 'image/jpeg'],
	['.jpg', 'image/jpeg'],
	['.js', 'text/javascript; charset=utf-8'],
	['.json', 'application/json; charset=utf-8'],
	['.map', 'application/json; charset=utf-8'],
	['.png', 'image/png'],
	['.svg', 'image/svg+xml'],
	['.txt', 'text/plain; charset=utf-8'],
	['.webp', 'image/webp'],
	['.woff', 'font/woff'],
	['.woff2', 'font/woff2'],
	['.xml', 'application/xml; charset=utf-8'],
]);

function sendFile(request, response, filePath, status = 200) {
	const extension = path.extname(filePath).toLowerCase();
	response.writeHead(status, {
		'Cache-Control': 'no-store',
		'Content-Type': contentTypes.get(extension) ?? 'application/octet-stream',
	});
	if (request.method === 'HEAD') {
		response.end();
		return;
	}
	fs.createReadStream(filePath).pipe(response);
}

function resolveOutputPath(relativePath) {
	let candidate = relativePath;
	if (!candidate || candidate.endsWith('/')) candidate += 'index.html';
	const resolved = path.resolve(outputDirectory, candidate);
	if (
		resolved !== outputDirectory &&
		!resolved.startsWith(`${outputDirectory}${path.sep}`)
	) {
		return undefined;
	}
	return resolved;
}

if (!fs.existsSync(path.join(outputDirectory, 'index.html'))) {
	throw new Error('apps/pages/out is missing. Run pnpm build:pages first.');
}

const server = http.createServer((request, response) => {
	if (!request.url || !['GET', 'HEAD'].includes(request.method ?? '')) {
		response.writeHead(405, { Allow: 'GET, HEAD' });
		response.end('Method Not Allowed');
		return;
	}

	const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);
	let pathname;
	try {
		pathname = decodeURIComponent(url.pathname);
	} catch {
		response.writeHead(400);
		response.end('Bad Request');
		return;
	}

	if (basePath && pathname === basePath) {
		response.writeHead(308, { Location: `${basePath}/` });
		response.end();
		return;
	}

	if (basePath && !pathname.startsWith(`${basePath}/`)) {
		response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
		response.end(`Expected Pages base path: ${basePath}/`);
		return;
	}

	const relativePath = pathname.slice(basePath.length).replace(/^\//, '');
	let filePath = resolveOutputPath(relativePath);

	if (filePath && !fs.existsSync(filePath) && !path.extname(filePath)) {
		filePath = resolveOutputPath(`${relativePath}/`);
	}

	if (filePath && fs.statSync(filePath, { throwIfNoEntry: false })?.isFile()) {
		sendFile(request, response, filePath);
		return;
	}

	const notFoundPage = path.join(outputDirectory, '404.html');
	if (fs.existsSync(notFoundPage)) {
		sendFile(request, response, notFoundPage, 404);
		return;
	}

	response.writeHead(404);
	response.end('Not Found');
});

server.listen(port, '127.0.0.1', () => {
	console.log(
		`Pages production export available at http://127.0.0.1:${port}${basePath}/`,
	);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => server.close(() => process.exit(0)));
}
