import { Contact } from '@/components/contact';
import { Hero } from '@/components/hero';
import '@/components/home.css';
import { Intro } from '@/components/intro';
import { WorksShowcase } from '@/components/works-showcase';

export default function HomePage() {
  return (
    <main id="main-content">
      <Hero />
      <Intro />
      <WorksShowcase />
      <Contact />
    </main>
  );
}
