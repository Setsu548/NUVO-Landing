import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/atoms';
import { AppStoreButton } from '@/components/molecules';
import { fadeUp, staggerContainer } from '@/hooks/useScrollReveal';

export function AppDownloadCTA() {
  const { t } = useTranslation();

  return (
    <section className="bg-inverse-surface py-24 text-inverse-on-surface">
      <motion.div
        className="container-page flex flex-col items-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeUp}>
          <Icon name="install_mobile" size={48} className="mb-6 text-primary" />
        </motion.div>

        <motion.h2 variants={fadeUp} className="mb-4 text-headline-lg font-bold">
          {t('download.title')}
        </motion.h2>

        <motion.p variants={fadeUp} className="mb-12 max-w-xl text-body-md opacity-80">
          {t('download.subtitle')}
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col gap-6 sm:flex-row">
          <AppStoreButton store="appstore" />
          <AppStoreButton store="googleplay" />
        </motion.div>
      </motion.div>
    </section>
  );
}
