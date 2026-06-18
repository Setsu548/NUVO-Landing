import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n';

/** ES / EN segmented toggle. Persists via the i18n LanguageDetector cache. */
export function LanguageToggle({ className, light = false }: { className?: string; light?: boolean }) {
  const { t, i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? 'es';

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={['inline-flex rounded-full border p-0.5', light ? 'border-white/30 bg-white/15' : 'border-outline-variant/50 bg-white', className]
        .filter(Boolean)
        .join(' ')}
    >
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = current === lng;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            aria-pressed={active}
            className={[
              'rounded-full px-3 py-1 text-label-md transition-colors',
              active
                ? (light ? 'bg-white/25 text-white font-semibold' : 'bg-primary text-on-primary')
                : (light ? 'text-white/70 hover:text-white' : 'text-on-surface-variant hover:text-on-surface'),
            ].join(' ')}
          >
            {t(`language.${lng}`)}
          </button>
        );
      })}
    </div>
  );
}
