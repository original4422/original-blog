import type { Metadata } from 'next';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { SITE_URL, withBasePath } from '@/data/site';
import { getAllPosts, getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags',
  description: '按主题浏览 original 的文章。',
  alternates: { canonical: `${SITE_URL}/tags/` },
};

const groups = [
  {
    title: 'Build & Systems',
    description: '工程实现、系统思考和发布方式。',
    names: ['Next.js', 'Systems', 'GitHub Pages', 'C++', 'Tools'],
  },
  {
    title: 'Design & Writing',
    description: '界面、注意力与长期写作。',
    names: [
      'Design',
      'Interface',
      'Writing',
      '中文写作',
      'Thinking',
      'Paper Notes',
    ],
  },
];

export default function TagsPage() {
  const tags = getAllTags();
  const tagMap = new Map(tags.map((tag) => [tag.tag, tag]));
  const used = new Set(groups.flatMap((group) => group.names));
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      tags: group.names.map((tag) => tagMap.get(tag)).filter(Boolean),
    }))
    .filter((group) => group.tags.length > 0);
  const other = tags.filter((tag) => !used.has(tag.tag));

  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow={`${tags.length} topics · ${getAllPosts().length} notes`}
        title="Tags"
        description="沿着主题进入内容。标签路由在构建时生成，包括空格、中文和特殊字符。"
      />
      <div className="tag-sections">
        {visibleGroups.map((group) => (
          <section className="tag-section" key={group.title}>
            <div>
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className="tag-cloud">
              {group.tags.map(
                (tag) =>
                  tag && (
                    <a
                      className="tag"
                      key={tag.tag}
                      href={withBasePath(
                        `/tags/${encodeURIComponent(tag.tag)}/`,
                      )}
                    >
                      {tag.tag} <small>{tag.count}</small>
                    </a>
                  ),
              )}
            </div>
          </section>
        ))}
        {other.length > 0 && (
          <section className="tag-section">
            <div>
              <h2>Other notes</h2>
              <p>尚未归入主要主题组的标签。</p>
            </div>
            <div className="tag-cloud">
              {other.map((tag) => (
                <a
                  className="tag"
                  key={tag.tag}
                  href={withBasePath(`/tags/${encodeURIComponent(tag.tag)}/`)}
                >
                  {tag.tag} <small>{tag.count}</small>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
