import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { PostList } from '@/components/post-list';
import { SITE_URL } from '@/data/site';
import { getAllTags, getPostsByTag } from '@/lib/posts';

// Keep the raw tag here. Next.js owns URL encoding; pre-encoding values such as
// "Paper Notes", "中文写作" or "C++" creates mismatched static routes.
export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  return {
    title: `#${tag}`,
    description: `浏览 original 关于 ${tag} 的文章。`,
    alternates: {
      canonical: `${SITE_URL}/tags/${encodeURIComponent(tag)}/`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={`${posts.length} ${posts.length === 1 ? 'note' : 'notes'}`}
        title={`#${tag}`}
        description={`所有标记为 “${tag}” 的文章。`}
      />
      <div className="filter-note">
        <span>Filtered by topic</span>
        <Link href="/tags/">查看全部标签</Link>
      </div>
      <PostList posts={posts} />
    </main>
  );
}
