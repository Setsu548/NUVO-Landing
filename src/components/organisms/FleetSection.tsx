import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FleetCard } from '@/components/molecules';
import { fadeUp, staggerContainer } from '@/hooks/useScrollReveal';

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

  return (
    <section id="business" className="bg-white py-24">
      <div className="container-page">
        <motion.div
          className="mb-16 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-headline-lg font-bold text-on-surface">
            {t('fleet.title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-body-md text-on-surface-variant">
            {t('fleet.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {FLEET_DEFS.map(({ icon, featured }, i) => {
            const rawBadge = t(`fleet.cards.${i}.badge`, { defaultValue: '' });
            const badge = rawBadge !== '' ? rawBadge : undefined;
            return (
              <FleetCard
                key={icon}
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
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
