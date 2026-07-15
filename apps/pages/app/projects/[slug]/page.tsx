import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import '@/components/listing.css';
import { getProject, projects } from '@/data/projects';
import { SITE_URL, withBasePath } from '@/data/site';

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `${SITE_URL}/projects/${slug}/` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main id="main-content" className="page-shell">
      <Link className="back-link" href="/projects/">
        <ArrowLeft aria-hidden="true" /> Back to projects
      </Link>
      <section className="project-hero">
        <div className="project-hero-copy">
          <p className="eyebrow">
            Project {project.number} · {project.year}
          </p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="project-stack">
            {project.stack.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="project-hero-image">
          <Image
            src={withBasePath(project.image)}
            alt={project.imageAlt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 60vw"
          />
        </div>
      </section>
      <section className="project-info">
        <section>
          <h2>Status</h2>
          <p>{project.status}</p>
          <p>该项目为页面布局占位示例。</p>
        </section>
        <section>
          <h2>Highlights</h2>
          <ul>
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Links</h2>
          {project.links.map((link) => (
            <a
              className="accent-link"
              href={link.href}
              key={link.label}
              rel="noreferrer"
            >
              {link.label} <ArrowUpRight aria-hidden="true" size={14} />
            </a>
          ))}
        </section>
      </section>
    </main>
  );
}
