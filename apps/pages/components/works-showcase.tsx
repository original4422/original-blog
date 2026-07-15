'use client';

import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import { withBasePath } from '@/data/site';

export function WorksShowcase() {
  const [active, setActive] = useState(0);
  const sections = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = sections.current.map((section, index) => {
      if (!section) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(index);
        },
        { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
      );
      observer.observe(section);
      return observer;
    });
    return () => {
      observers.forEach((observer) => {
        observer?.disconnect();
      });
    };
  }, []);

  const project = projects[active];

  return (
    <section className="works" aria-label="精选项目">
      <div className="works-sticky" aria-hidden="true">
        <div className="works-counter">
          <span>{project.number}</span>
          <i />
          <span>{String(projects.length).padStart(2, '0')}</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={project.slug}
            className="works-visual"
            initial={{ opacity: 0, y: 28, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.01 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={withBasePath(project.image)}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="works-scroll">
        {projects.map((item, index) => (
          <article
            key={item.slug}
            ref={(node) => {
              sections.current[index] = node;
            }}
            className="work-panel"
          >
            <div className="work-panel-copy">
              <p className="eyebrow">{item.eyebrow}</p>
              <h2 className="display">{item.title}</h2>
              <p>{item.summary}</p>
              <Link href={`/projects/${item.slug}/`}>
                View case study <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
