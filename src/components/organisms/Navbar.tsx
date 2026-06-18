import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo, LanguageToggle } from '@/components/atoms';
import { NavLink } from '@/components/molecules';

const NAV_LINK_DEFS = [
  { key: 'nav.ride',     href: '#ride',     active: true  },
  { key: 'nav.drive',    href: '#drive',    active: false },
  { key: 'nav.business', href: '#business', active: false },
  { key: 'nav.about',    href: '#about',    active: false },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-standard ${scrolled ? 'shadow-overlay' : 'shadow-none'}`}
      style={{ backgroundColor: '#00829f', borderColor: '#00829f' }}
    >
      <nav
        className="container-page flex h-16 items-center justify-between"
        aria-label={t('nav.aria_label')}
      >
        <div className="flex items-center gap-8">
          <a href="#" aria-label={t('nav.home_label')} className="[&>div]:text-white [&>div>span]:text-white">
            <Logo />
          </a>
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINK_DEFS.map((l) => (
              <NavLink key={l.key} href={l.href} active={l.active} light>
                {t(l.key)}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle className="hidden sm:inline-flex" light />
          <button
            type="button"
            className="hidden text-label-md text-white/80 transition-standard hover:text-white rounded-lg px-4 py-2 sm:block"
          >
            {t('nav.login')}
          </button>
          <a
            href="#"
            className="rounded-full bg-white px-6 py-2.5 text-label-md font-semibold shadow-card transition-standard hover:shadow-overlay"
            style={{ color: '#00829f' }}
          >
            {t('nav.signup')}
          </a>
        </div>
      </nav>
    </header>
  );
}
