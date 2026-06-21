import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureItem } from '@/components/molecules';
import { useScrollRevealBatch, useCarSlideIn, useFeatureCardsReveal } from '@/hooks/useGSAPAnimations';
import carPng from '/assets/car-front-left.png';

const PASSENGER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSPHlY6lczpVl3F7OepgJCd0M4aV9M9HoHGloUDTQqla3HG9aGYiVRVuMP_AeDFtNvQfjsHxr_Z3rvL13Pt7ShnUEPHsLqeeCcmEOu0EbVvPfQJc88nrXnEmyTmBGbcmI6dYwQunHOtocGfN1RNXVIS3xXl8rxHtB8v8lgUmTU5xKgobRZrZz4rrru3G4pdwv2cirv409LbORZA-2EQGSYOJKb65PyI_FYB5SU43brZBc6aDYfFWWYFjT2hSsD_jnOc1rtsFw4w_0';

const FEATURE_ICONS = ['touch_app', 'verified_user', 'payments'] as const;

export function PassengerSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useScrollRevealBatch({ containerRef });
  useCarSlideIn({ sectionRef: containerRef, carRef });
  useFeatureCardsReveal({ containerRef });

  return (
    <section id="ride" ref={containerRef} className="relative overflow-hidden py-24 [clip-path:inset(0)]">

      {/* Auto PNG — desliza de derecha a izquierda al hacer scroll */}
      <div
        ref={carRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 bottom-1/2 z-0 opacity-40 lg:bottom-0 lg:left-auto lg:w-1/2 lg:opacity-100"
      >
        <img
          src={carPng}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-left lg:object-contain lg:object-left"
          draggable={false}
        />
      </div>

      <div className="container-page relative z-10 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Phone image */}
        <div className="order-2 flex justify-center lg:order-1 gsap-reveal">
          <div className="relative w-full max-w-sm">
            <div
              aria-hidden="true"
              className="float-anim absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-container/20 blur-3xl"
            />
            <img
              src={PASSENGER_IMG}
              alt={t('passenger.img_alt')}
              className="relative z-10 w-full drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <div className="mb-6 rounded-2xl bg-surface/90 backdrop-blur-sm border border-outline-variant/20 px-6 py-5 shadow-sm gsap-reveal">
            <h2 className="mb-3 text-headline-lg font-bold text-on-surface">
              {t('passenger.title')}
            </h2>
            <p className="text-body-md text-on-surface-variant">
              {t('passenger.subtitle')}
            </p>
          </div>
          <div className="space-y-4">
            {FEATURE_ICONS.map((icon, i) => (
              <div
                key={icon}
                className="feature-card rounded-2xl bg-surface/90 backdrop-blur-sm border border-outline-variant/20 p-5 shadow-sm"
              >
                <FeatureItem
                  icon={icon}
                  title={t(`passenger.features.${i}.title`)}
                  description={t(`passenger.features.${i}.description`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
