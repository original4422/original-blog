import type { Metadata } from 'next';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { PostList } from '@/components/post-list';
import { SITE_URL } from '@/data/site';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: '代码、系统与思考的长期笔记。',
  alternates: { canonical: `${SITE_URL}/blog/` },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={`${posts.length} published notes`}
        title="Blog"
        description="关于代码、系统、工具与设计的长期笔记。当前内容为高质量示例，后续可直接替换。"
      />
      <PostList posts={posts} />
    </main>
  );
}
