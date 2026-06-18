import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FeatureItem } from '@/components/molecules';
import { fadeUp, scaleIn, staggerContainer } from '@/hooks/useScrollReveal';

const PASSENGER_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSPHlY6lczpVl3F7OepgJCd0M4aV9M9HoHGloUDTQqla3HG9aGYiVRVuMP_AeDFtNvQfjsHxr_Z3rvL13Pt7ShnUEPHsLqeeCcmEOu0EbVvPfQJc88nrXnEmyTmBGbcmI6dYwQunHOtocGfN1RNXVIS3xXl8rxHtB8v8lgUmTU5xKgobRZrZz4rrru3G4pdwv2cirv409LbORZA-2EQGSYOJKb65PyI_FYB5SU43brZBc6aDYfFWWYFjT2hSsD_jnOc1rtsFw4w_0';

const FEATURE_ICONS = ['touch_app', 'verified_user', 'payments'] as const;

export function PassengerSection() {
  const { t } = useTranslation();

  return (
    <section id="ride" className="bg-surface py-24">
      <div className="container-page grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Phone image */}
        <motion.div
          className="order-2 flex justify-center lg:order-1"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={scaleIn}
        >
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
        </motion.div>

        {/* Copy */}
        <motion.div
          className="order-1 lg:order-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="mb-4 text-headline-lg font-bold text-on-surface">
            {t('passenger.title')}
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-10 text-body-md text-on-surface-variant">
            {t('passenger.subtitle')}
          </motion.p>
          <motion.div variants={staggerContainer} className="space-y-8">
            {FEATURE_ICONS.map((icon, i) => (
              <motion.div key={icon} variants={fadeUp}>
                <FeatureItem
                  icon={icon}
                  title={t(`passenger.features.${i}.title`)}
                  description={t(`passenger.features.${i}.description`)}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
