import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { withBasePath } from '@/data/site';
import type { PostMeta } from '@/lib/posts';

const formatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <article className="post-row" key={post.slug}>
          <span className="post-index">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="post-main">
            <div className="post-meta">
              <time dateTime={post.date}>
                {formatter.format(new Date(post.date))}
              </time>
              <span>{post.readingTime}</span>
            </div>
            <h2 className="display">
              <Link href={`/blog/${post.slug}/`}>{post.title}</Link>
            </h2>
            <p>{post.summary}</p>
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
          </div>
          <Link
            className="post-arrow"
            href={`/blog/${post.slug}/`}
            aria-label={`阅读 ${post.title}`}
          >
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  );
}
