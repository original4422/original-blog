import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  featured?: boolean;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
  headings: { id: string; text: string; level: number }[];
};

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

function estimateReadingTime(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`[\]()!-]/g, ' ')
    .trim()
    .split(/\s+|(?<=[\u4e00-\u9fff])(?=[\u4e00-\u9fff])/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 260))} min read`;
}

export function slugifyHeading(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPost(slug: string): Post | undefined {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const headings = Array.from(content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map(
    ([, hashes, text]) => ({
      id: slugifyHeading(text),
      text: text.trim(),
      level: hashes.length,
    }),
  );

  return {
    slug,
    title: String(data.title),
    date: String(data.date),
    summary: String(data.summary),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    featured: Boolean(data.featured),
    readingTime: estimateReadingTime(content),
    content,
    headings,
  };
}

export function getAllPosts() {
  return getPostSlugs()
    .map(getPost)
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getAllTags() {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string) {
  return getAllPosts().filter((post) =>
    post.tags.some((postTag) => postTag.toLowerCase() === tag.toLowerCase()),
  );
}
