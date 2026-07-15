import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const postsDir = path.join(root, 'content', 'posts');
const publicDir = path.join(root, 'public');
const basePath = (
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages'
).replace(/\/$/, '');
const siteUrl = (
  process.env.SITE_URL ?? 'https://original4422.github.io/original-blog-pages'
).replace(/\/$/, '');

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const files = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith('.mdx'))
  .sort();

const posts = files
  .map((file) => {
    const slug = file.replace(/\.mdx$/, '');
    const { data, content } = matter(
      fs.readFileSync(path.join(postsDir, file), 'utf8'),
    );
    return {
      slug,
      title: String(data.title),
      date: String(data.date),
      summary: String(data.summary),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      body: content
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/[#>*_`[\]()!-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 1500),
    };
  })
  .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

const projectSearchItems = [
  [
    'signal-atlas',
    'Signal Atlas',
    'Turn complex experiments into a map you can actually read.',
    ['Next.js', 'Research'],
  ],
  [
    'quiet-compute',
    'Quiet Compute',
    'A visual notebook for systems that disappear into the background.',
    ['Systems', 'Observability'],
  ],
  [
    'field-notes',
    'Field Notes',
    'Small observations, linked slowly into durable knowledge.',
    ['MDX', 'Writing'],
  ],
  [
    'original-blog',
    'original.blog',
    'A home for work and unfinished ideas.',
    ['Next.js', 'GitHub Pages'],
  ],
];

const searchIndex = [
  ...posts.map((post) => ({
    type: 'post',
    title: post.title,
    summary: post.summary,
    tags: post.tags,
    body: post.body,
    url: `/blog/${post.slug}/`,
  })),
  ...projectSearchItems.map(([slug, title, summary, tags]) => ({
    type: 'project',
    title,
    summary,
    tags,
    url: `/projects/${slug}/`,
  })),
];

const allTags = [...new Set(posts.flatMap((post) => post.tags))].sort();
const staticPaths = ['/', '/blog/', '/tags/', '/projects/', '/about/'];
const articlePaths = posts.map((post) => `/blog/${post.slug}/`);
const projectPaths = projectSearchItems.map(([slug]) => `/projects/${slug}/`);
const tagPaths = allTags.map((tag) => `/tags/${encodeURIComponent(tag)}/`);
const sitemapPaths = [
  ...staticPaths,
  ...articlePaths,
  ...projectPaths,
  ...tagPaths,
];

const rssItems = posts
  .map(
    (post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${siteUrl}/blog/${encodeURIComponent(post.slug)}/</link>
    <guid isPermaLink="true">${siteUrl}/blog/${encodeURIComponent(post.slug)}/</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.summary)}</description>
    ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
  </item>`,
  )
  .join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>original</title>
  <link>${siteUrl}/</link>
  <description>记录代码、系统与持续思考的个人数字花园。</description>
  <language>zh-CN</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
</channel>
</rss>
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
  .map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route}`)}</loc></url>`)
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: ${basePath}/

Sitemap: ${siteUrl}/sitemap.xml
`;

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(
  path.join(publicDir, 'search-index.json'),
  `${JSON.stringify(searchIndex, null, 2)}\n`,
);
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rss);
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
fs.writeFileSync(
  path.join(publicDir, 'static-routes.json'),
  `${JSON.stringify({ basePath, siteUrl, tags: allTags, paths: sitemapPaths }, null, 2)}\n`,
);
fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');

console.log(
  `Generated static assets for ${posts.length} posts, ${allTags.length} tags and ${projectSearchItems.length} projects.`,
);
