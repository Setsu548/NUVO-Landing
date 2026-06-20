import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FleetCard } from '@/components/molecules';
import { useScrollRevealBatch } from '@/hooks/useGSAPAnimations';

type FleetDef = {
  icon: string;
  featured: boolean;
};

const FLEET_DEFS: FleetDef[] = [
  { icon: 'directions_car', featured: false },
  { icon: 'stars',          featured: true  },
  { icon: 'eco',            featured: false },
];

export function FleetSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  useScrollRevealBatch({ containerRef });

  return (
    <section id="business" ref={containerRef} className="bg-white py-24">
      <div className="container-page">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-headline-lg font-bold text-on-surface gsap-reveal">
            {t('fleet.title')}
          </h2>
          <p className="mx-auto max-w-2xl text-body-md text-on-surface-variant gsap-reveal">
            {t('fleet.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FLEET_DEFS.map(({ icon, featured }, i) => {
            const rawBadge = t(`fleet.cards.${i}.badge`, { defaultValue: '' });
            const badge = rawBadge !== '' ? rawBadge : undefined;
            return (
              <div key={icon} className="gsap-reveal">
                <FleetCard
                  icon={icon}
                  featured={featured}
                  title={t(`fleet.cards.${i}.title`)}
                  description={t(`fleet.cards.${i}.description`)}
                  features={[
                    t(`fleet.cards.${i}.features.0`),
                    t(`fleet.cards.${i}.features.1`),
                  ]}
                  {...(badge !== undefined ? { badge } : {})}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
