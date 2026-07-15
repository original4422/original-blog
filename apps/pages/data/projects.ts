export type Project = {
  slug: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  imageAlt: string;
  year: string;
  status: string;
  stack: string[];
  highlights: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: 'signal-atlas',
    number: '01',
    eyebrow: 'Research interface',
    title: 'Signal Atlas',
    summary: 'Turn complex experiments into a map you can actually read.',
    description:
      '一个用于整理实验、观察指标与研究假设的交互式工作台。这里使用示例内容展示项目详情页的排版和叙事能力，后续可替换为你的真实项目。',
    image: '/images/project-signal.svg',
    imageAlt: 'Signal Atlas 示例项目的抽象波形界面',
    year: '2026',
    status: 'Example project',
    stack: ['Next.js', 'TypeScript', 'Data visualization'],
    highlights: [
      '把分散的实验记录整理成可回溯时间线',
      '支持指标对比、注释与研究假设关联',
      '自适应桌面和移动端的阅读体验',
    ],
    links: [{ label: 'Placeholder repository', href: 'https://github.com/' }],
  },
  {
    slug: 'quiet-compute',
    number: '02',
    eyebrow: 'Systems notebook',
    title: 'Quiet Compute',
    summary:
      'A visual notebook for systems that disappear into the background.',
    description:
      '围绕可靠性、资源利用率与可观测性构建的系统实验册。它目前是视觉占位项目，用于验证长标题、技术标签与详情信息的展示。',
    image: '/images/project-compute.svg',
    imageAlt: 'Quiet Compute 示例项目的节点与网格界面',
    year: '2026',
    status: 'Example project',
    stack: ['Rust', 'Observability', 'Distributed systems'],
    highlights: [
      '以任务为中心聚合日志、指标与追踪',
      '用轻量拓扑展示系统关系',
      '强调可复现的性能实验记录',
    ],
    links: [{ label: 'Placeholder repository', href: 'https://github.com/' }],
  },
  {
    slug: 'field-notes',
    number: '03',
    eyebrow: 'Personal knowledge',
    title: 'Field Notes',
    summary: 'Small observations, linked slowly into durable knowledge.',
    description:
      '一个强调写作、链接与长期维护的个人知识项目示例。视觉上延续站点的纸张感、细线与高对比排版。',
    image: '/images/project-notes.svg',
    imageAlt: 'Field Notes 示例项目的卡片和文字界面',
    year: '2025',
    status: 'Example project',
    stack: ['MDX', 'Search', 'Knowledge graph'],
    highlights: [
      '以纯文本作为长期可迁移的数据源',
      '构建期生成索引与双向链接',
      '为深度阅读优化的无干扰界面',
    ],
    links: [{ label: 'Placeholder repository', href: 'https://github.com/' }],
  },
  {
    slug: 'original-blog',
    number: '04',
    eyebrow: 'Digital garden',
    title: 'original.blog',
    summary:
      'The site you are looking at — a home for work and unfinished ideas.',
    description:
      '这个站点本身也是一个持续演进的项目：静态优先、内容可移植、无需运行时服务器，并通过细腻动效保留个人表达。',
    image: '/images/project-blog.svg',
    imageAlt: 'original blog 示例主页的抽象界面',
    year: '2026',
    status: 'In progress',
    stack: ['Next.js', 'Motion', 'GitHub Pages'],
    highlights: [
      'Blog、项目和个人介绍统一在一个视觉系统中',
      '静态搜索、RSS、Sitemap 与主题切换',
      '无数据库、无运行时服务依赖',
    ],
    links: [
      {
        label: 'GitHub repository',
        href: 'https://github.com/original4422/original-blog-pages',
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
