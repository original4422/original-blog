import { siteConfig } from '../../site.config';
import { getPosts } from '../blog/utils';

export const revalidate = 3600;

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function GET() {
	const items = getPosts()
		.map((post) => {
			const url = `${siteConfig.url}/blog/${post.slug}`;
			return `<item>
	<title>${escapeXml(post.metadata.title)}</title>
	<link>${url}</link>
	<guid isPermaLink="true">${url}</guid>
	<pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
	<description>${escapeXml(post.metadata.summary)}</description>
${(post.metadata.tags ?? []).map((tag) => `\t<category>${escapeXml(tag)}</category>`).join('\n')}
</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
	<title>${escapeXml(siteConfig.title)}</title>
	<link>${siteConfig.url}</link>
	<description>${escapeXml(siteConfig.description)}</description>
	<language>${siteConfig.language}</language>
	<atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
	<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
		},
	});
}
