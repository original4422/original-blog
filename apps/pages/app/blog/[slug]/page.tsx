import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import '@/components/listing.css';
import { PostList } from '@/components/post-list';
import { ScrollProgress } from '@/components/scroll-progress';
import { SITE_URL, withBasePath } from '@/data/site';
import {
  getAllPosts,
  getPost,
  getPostSlugs,
  slugifyHeading,
} from '@/lib/posts';

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const canonical = `${SITE_URL}/blog/${slug}/`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: canonical,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

function Heading({
  level,
  children,
  ...props
}: { level: 2 | 3; children?: ReactNode } & ComponentPropsWithoutRef<'h2'>) {
  const id = slugifyHeading(String(children));
  if (level === 3)
    return (
      <h3 id={id} {...props}>
        {children}
      </h3>
    );
  return (
    <h2 id={id} {...props}>
      {children}
    </h2>
  );
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getAllPosts()
    .filter((item) => item.slug !== slug)
    .slice(0, 2);

  return (
    <main id="main-content" className="page-shell">
      <ScrollProgress />
      <Link className="back-link" href="/blog/">
        <ArrowLeft aria-hidden="true" /> Back to blog
      </Link>
      <header className="article-header">
        <p className="eyebrow">Article · {post.readingTime}</p>
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <div className="post-meta">
          <time dateTime={post.date}>{post.date}</time>
          <span>By original</span>
        </div>
        <div className="post-tags">
          {post.tags.map((tag) => (
            <a
              className="tag"
              href={withBasePath(`/tags/${encodeURIComponent(tag)}/`)}
              key={tag}
            >
              {tag}
            </a>
          ))}
        </div>
      </header>
      <div className="article-body-grid">
        <article className="prose">
          <MDXRemote
            source={post.content}
            components={{
              h2: (props) => <Heading level={2} {...props} />,
              h3: (props) => <Heading level={3} {...props} />,
            }}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [
                  rehypeKatex,
                  [rehypePrettyCode, { theme: 'github-dark' }],
                ],
              },
            }}
          />
        </article>
        <aside className="article-toc" aria-label="文章目录">
          <h2>On this page</h2>
          <ol>
            {post.headings.map((heading) => (
              <li className={`toc-level-${heading.level}`} key={heading.id}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
          </ol>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="tag-sections">
          <div>
            <p className="eyebrow">Continue reading</p>
            <PostList posts={related} />
          </div>
        </section>
      )}
    </main>
  );
}
