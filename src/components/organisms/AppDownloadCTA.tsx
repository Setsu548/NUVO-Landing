import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/atoms';
import { AppStoreButton } from '@/components/molecules';
import { useScrollRevealBatch } from '@/hooks/useGSAPAnimations';

export function AppDownloadCTA() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);

  useScrollRevealBatch({ containerRef });

  return (
    <section ref={containerRef} className="bg-inverse-surface py-24 text-inverse-on-surface">
      <div className="container-page flex flex-col items-center text-center">
        <div className="gsap-reveal">
          <Icon name="install_mobile" size={48} className="mb-6 text-primary" />
        </div>

        <h2 className="mb-4 text-headline-lg font-bold gsap-reveal">
          {t('download.title')}
        </h2>

        <p className="mb-12 max-w-xl text-body-md opacity-80 gsap-reveal">
          {t('download.subtitle')}
        </p>

        <div className="flex flex-col gap-6 sm:flex-row gsap-reveal">
          <AppStoreButton store="appstore" />
          <AppStoreButton store="googleplay" />
        </div>
      </div>
    </section>
  );
}
