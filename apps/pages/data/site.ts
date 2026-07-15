export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages';

export const SITE_URL =
  process.env.SITE_URL ?? 'https://original4422.github.io/original-blog-pages';

const CONTACT_EMAIL = 'pzg24@mails.tsinghua.edu.cn';

export const siteConfig = {
  name: 'original',
  title: 'original — notes on code, systems & ideas',
  description: '记录代码、系统与持续思考的个人数字花园。',
  locale: 'zh_CN',
  email: CONTACT_EMAIL,
  nav: [
    { label: 'Blog', href: '/blog/' },
    { label: 'Tags', href: '/tags/' },
    { label: 'Projects', href: '/projects/' },
    { label: 'About', href: '/about/' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/original4422' },
    { label: 'Email', href: `mailto:${CONTACT_EMAIL}` },
  ],
} as const;

export function withBasePath(path: string) {
  if (!path || path === '/') return `${BASE_PATH}/`;
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${normalized}`;
}

export function absoluteSiteUrl(path: string) {
  if (/^https?:/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
