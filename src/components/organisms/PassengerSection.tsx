import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureItem } from '@/components/molecules';
import { useScrollRevealBatch, useCarSlideIn } from '@/hooks/useGSAPAnimations';
import carPng from '/assets/car-nuvo.png';

const PASSENGER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSPHlY6lczpVl3F7OepgJCd0M4aV9M9HoHGloUDTQqla3HG9aGYiVRVuMP_AeDFtNvQfjsHxr_Z3rvL13Pt7ShnUEPHsLqeeCcmEOu0EbVvPfQJc88nrXnEmyTmBGbcmI6dYwQunHOtocGfN1RNXVIS3xXl8rxHtB8v8lgUmTU5xKgobRZrZz4rrru3G4pdwv2cirv409LbORZA-2EQGSYOJKb65PyI_FYB5SU43brZBc6aDYfFWWYFjT2hSsD_jnOc1rtsFw4w_0';

const FEATURE_ICONS = ['touch_app', 'verified_user', 'payments'] as const;

export function PassengerSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useScrollRevealBatch({ containerRef });
  useCarSlideIn({ sectionRef: containerRef, carRef });

  return (
    <section id="ride" ref={containerRef} className="relative overflow-hidden bg-surface py-24">

      {/* Auto PNG — desliza de derecha a izquierda al hacer scroll */}
      <div
        ref={carRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-0 w-1/2"
      >
        <img
          src={carPng}
          alt=""
          className="h-full w-full object-cover object-left"
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
          <h2 className="mb-4 text-headline-lg font-bold text-on-surface gsap-reveal">
            {t('passenger.title')}
          </h2>
          <p className="mb-10 text-body-md text-on-surface-variant gsap-reveal">
            {t('passenger.subtitle')}
          </p>
          <div className="space-y-8">
            {FEATURE_ICONS.map((icon, i) => (
              <div key={icon} className="gsap-reveal">
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
