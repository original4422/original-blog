import type { Metadata } from 'next';
import '@/components/listing.css';
import { PageHeader } from '@/components/page-header';
import { SITE_URL } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description: '关于 original 与这个网站。',
  alternates: { canonical: `${SITE_URL}/about/` },
};

export default function AboutPage() {
  return (
    <main id="main-content" className="page-shell">
      <PageHeader
        eyebrow="About this place"
        title="About"
        description="一份暂时的自我介绍，也是未来内容替换时最先需要编辑的页面。"
      />
      <div className="about-grid">
        <div className="about-intro">
          <p>
            你好，我是 <em>original</em>
            。我用代码理解系统，也用文字整理还没有答案的问题。
          </p>
          <p>
            这里的身份描述目前是占位内容。等你准备好真实简介后，可以把它替换成经历、研究方向，以及你希望被怎样认识。
          </p>
          <p>
            我相信最有价值的个人网站不会一次完成；它会在一次次发布中，慢慢长成工作的侧影。
          </p>
        </div>
        <aside className="about-aside">
          <section>
            <h2>Now</h2>
            <p>
              示例：正在构建个人博客，整理项目，并学习如何更清楚地表达复杂系统。
            </p>
          </section>
          <section>
            <h2>Interests</h2>
            <ul>
              <li>AI & systems</li>
              <li>Developer tools</li>
              <li>Research workflows</li>
              <li>Writing & interface design</li>
            </ul>
          </section>
          <section>
            <h2>Colophon</h2>
            <p>
              Next.js 静态导出，托管在 GitHub Pages。正文来自本地
              MDX，不使用数据库。
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
