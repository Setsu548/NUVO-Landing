import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, LanguageToggle, Logo } from '@/components/atoms';
import { NavLink } from '@/components/molecules';

const NAV_LINK_DEFS = [
  { key: 'nav.ride',     href: '#ride',     active: true  },
  { key: 'nav.drive',    href: '#drive',    active: false },
  { key: 'nav.business', href: '#business', active: false },
  { key: 'nav.about',    href: '#about',    active: false },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleMobileNav = (href: string) => {
    closeMenu();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 260);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-standard ${scrolled ? 'shadow-overlay' : 'shadow-none'}`}
      style={{ backgroundColor: '#00829f', borderColor: '#00829f' }}
    >
      {/* Barra principal */}
      <nav
        className="container-page flex h-16 items-center justify-between"
        aria-label={t('nav.aria_label')}
      >
        <div className="flex items-center gap-8">
          <a href="#" aria-label={t('nav.home_label')} className="[&>div]:text-white [&>div>span]:text-white">
            <Logo />
          </a>
          {/* Links — solo desktop */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINK_DEFS.map((l) => (
              <NavLink key={l.key} href={l.href} active={l.active} light>
                {t(l.key)}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
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

          {/* Botón hamburguesa — solo mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-white transition-standard hover:bg-white/15 md:hidden"
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden"
            style={{ borderTop: '1px solid rgba(107,212,246,0.35)' }}
          >
            <div className="container-page flex flex-col pb-4 pt-2">
              {NAV_LINK_DEFS.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => handleMobileNav(l.href)}
                  className="border-b border-white/10 py-3 text-left text-label-md font-semibold text-white/90 transition-standard hover:text-white"
                >
                  {t(l.key)}
                </button>
              ))}
              {/* Acciones mobile */}
              <div className="mt-4 flex items-center gap-4">
                <LanguageToggle light />
                <button
                  type="button"
                  className="text-label-md text-white/80 transition-standard hover:text-white"
                >
                  {t('nav.login')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
