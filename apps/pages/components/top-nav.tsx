'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/site';
import { SearchModal } from './search-modal';
import { ThemeToggle } from './theme-toggle';

export function TopNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const desktopViewport = window.matchMedia('(min-width: 760px)');

    const closeMenu = (restoreFocus = false) => {
      setMenuOpen(false);
      if (restoreFocus) menuButtonRef.current?.focus();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu(true);
    };

    const onViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };

    root.classList.add('mobile-menu-open');
    window.addEventListener('keydown', onKeyDown);
    desktopViewport.addEventListener('change', onViewportChange);
    const focusTimer = window.setTimeout(() => {
      navigationRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimer);
      root.classList.remove('mobile-menu-open');
      window.removeEventListener('keydown', onKeyDown);
      desktopViewport.removeEventListener('change', onViewportChange);
    };
  }, [menuOpen]);

  return (
    <header className="top-nav">
      <Link className="brand" href="/" aria-label="original 首页">
        <span className="brand-mark" aria-hidden="true">
          o
        </span>
        <span>original</span>
      </Link>

      <nav
        ref={navigationRef}
        id="primary-navigation"
        className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}
        aria-label="主导航"
      >
        {siteConfig.nav.map((item) => {
          const active = pathname.includes(item.href.replaceAll('/', ''));
          return (
            <Link
              key={item.href}
              className={active ? 'nav-link nav-link-active' : 'nav-link'}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="nav-actions">
        <SearchModal />
        <ThemeToggle />
        <button
          ref={menuButtonRef}
          className="icon-button menu-button"
          type="button"
          aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
