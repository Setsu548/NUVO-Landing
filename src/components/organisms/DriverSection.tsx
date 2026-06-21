import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/atoms';
import { useScrollRevealBatch, useCarSlideInFromLeft } from '@/hooks/useGSAPAnimations';
import carPng from '/assets/car-front-right.png';

const DRIVER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBT-YtXpq54I98R1dLUlYCbB3c3fxMJJ9yK1pyw4q_9pEEYNJsRMy454sM72eIcnb3yws4Y1Ph1iCk5Lyg8wNsyoFAUnOwNmpMcvU_i7X3PJaTsj-E3CVfqWhiJujNp2RxGT0KCZNrsgM973KipRgaJ2GWiBwhq-s2YNiOAwc3wwyTjU9wtosNoxo2YHsMR9_MkNrEeHGmFgjRKjJGud8LD25I_4xnH42uNVm3Qw3BsyXroFBhWPKXdNbEWs7AxuA13ONBVeb7GQAo';

const CARD_ICONS = ['trending_up', 'event_available'] as const;

export function DriverSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useCarSlideInFromLeft({ sectionRef: containerRef, carRef });
  useScrollRevealBatch({ containerRef });

  return (
    <section id="drive" ref={containerRef} className="relative overflow-hidden bg-surface-container-low py-24 [clip-path:inset(0)]">
      <div
        ref={carRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 bottom-1/2 z-0 opacity-40 lg:bottom-0 lg:right-auto lg:w-1/2 lg:opacity-100"
      >
        <img
          src={carPng}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right lg:object-contain lg:object-right"
          draggable={false}
        />
      </div>
      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <div className="mb-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-outline-variant/20 px-6 py-5 shadow-sm gsap-reveal">
            <h2 className="mb-3 text-headline-lg font-bold text-on-surface">
              {t('driver.title')}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {t('driver.subtitle')}
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {CARD_ICONS.map((icon, i) => (
              <div
                key={icon}
                className="rounded-2xl border border-outline-variant/20 bg-white/80 backdrop-blur-sm p-6 shadow-card gsap-reveal"
              >
                <Icon name={icon} size={30} className="mb-4 text-primary" />
                <h4 className="mb-2 text-body-md font-bold text-on-surface">
                  {t(`driver.cards.${i}.title`)}
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  {t(`driver.cards.${i}.description`)}
                </p>
              </div>
            ))}
          </div>

          <div className="gsap-reveal">
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-xl bg-inverse-surface px-8 py-4 text-lg font-semibold text-inverse-on-surface shadow-card transition-standard hover:bg-on-surface"
            >
              {t('driver.cta')}
              <Icon name="person_add" />
            </motion.a>
          </div>
        </div>

        {/* Phone image */}
        <div className="relative flex justify-center gsap-reveal">
          <div
            aria-hidden="true"
            className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          />
          <img
            src={DRIVER_IMG}
            alt={t('driver.img_alt')}
            className="float-anim relative z-10 w-full max-w-sm drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
