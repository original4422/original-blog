import { ArrowUpRight } from 'lucide-react';

import { siteConfig } from '@/data/site';

export function Contact() {
  return (
    <section className="contact">
      <p className="eyebrow">Have an idea worth exploring?</p>
      <h2 className="display">
        Let&apos;s make
        <br />
        something <em>useful.</em>
      </h2>
      <a className="contact-link" href={`mailto:${siteConfig.email}`}>
        <span>
          <small>Email</small>
          {siteConfig.email}
        </span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  );
}
