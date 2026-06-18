import { useTranslation } from 'react-i18next';
import { SocialLink } from '@/components/molecules';
import { Icon } from '@/components/atoms';

const SOCIAL_ICONS = [
  { icon: 'language',     key: 'footer.social.website' },
  { icon: 'chat_bubble',  key: 'footer.social.chat'    },
  { icon: 'photo_camera', key: 'footer.social.instagram' },
] as const;

const COLUMN_KEYS = ['company', 'products', 'legal'] as const;
const COLUMN_LINK_COUNTS = [4, 4, 4] as const;

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="about" className="w-full border-t border-white/5 bg-inverse-surface">
      <div className="container-page grid grid-cols-1 gap-8 py-16 text-inverse-on-surface md:grid-cols-4">
        {/* Brand column */}
        <div>
          <div className="mb-6 flex items-center gap-2 text-xl font-bold text-surface-bright">
            <Icon name="cloud_queue" fill size={28} className="text-primary" />
            NUVO
          </div>
          <p className="mb-6 text-body-sm text-surface-variant opacity-80">
            {t('footer.tagline')}
          </p>
          <div className="flex gap-4">
            {SOCIAL_ICONS.map((s) => (
              <SocialLink key={s.icon} icon={s.icon} href="#" label={t(s.key)} />
            ))}
          </div>
        </div>

        {/* Link columns */}
        {COLUMN_KEYS.map((colKey, ci) => (
          <div key={colKey}>
            <h4 className="mb-6 text-label-md font-bold uppercase tracking-wider text-white">
              {t(`footer.columns.${colKey}.title`)}
            </h4>
            <ul className="space-y-4">
              {Array.from({ length: COLUMN_LINK_COUNTS[ci] }, (_, li) => (
                <li key={li}>
                  <a
                    href="#"
                    className="text-body-sm text-surface-variant opacity-80 transition-standard hover:text-primary hover:opacity-100"
                  >
                    {t(`footer.columns.${colKey}.links.${li}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="container-page flex flex-col items-center justify-between gap-4 border-t border-white/5 pb-8 pt-8 md:flex-row">
        <p className="text-body-sm text-surface-variant opacity-60">
          {t('footer.copyright')}
        </p>
        <div className="flex gap-6">
          <span className="cursor-pointer text-body-sm text-surface-variant opacity-60 transition-standard hover:text-white">
            {t('footer.language')}
          </span>
          <span className="cursor-pointer text-body-sm text-surface-variant opacity-60 transition-standard hover:text-white">
            {t('footer.currency')}
          </span>
        </div>
      </div>
    </footer>
  );
}
