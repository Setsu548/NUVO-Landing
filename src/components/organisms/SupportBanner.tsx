import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/atoms';
import { fadeUp } from '@/hooks/useScrollReveal';

export function SupportBanner() {
  const { t } = useTranslation();

  return (
    <section className="bg-primary-fixed py-16 text-on-primary-fixed">
      <motion.div
        className="container-page flex flex-col items-center gap-8 md:flex-row md:justify-between"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
      >
        <div className="flex items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/40">
            <Icon name="support_agent" size={24} />
          </div>
          <div>
            <h3 className="text-body-md font-bold">{t('support.title')}</h3>
            <p className="text-body-sm opacity-80">{t('support.subtitle')}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-4 md:w-auto">
          <input
            type="email"
            placeholder={t('support.placeholder')}
            className="flex-1 rounded-xl border-none px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary md:w-64"
            aria-label={t('support.email_aria')}
          />
          <button
            type="button"
            className="rounded-xl bg-primary px-6 py-3 text-label-md font-semibold text-on-primary transition-standard hover:bg-on-primary-container"
          >
            {t('support.cta')}
          </button>
        </div>
      </motion.div>
    </section>
  );
}
