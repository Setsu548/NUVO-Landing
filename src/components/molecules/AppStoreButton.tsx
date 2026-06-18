import { motion } from 'framer-motion';
import { Icon } from '@/components/atoms';

interface AppStoreButtonProps {
  store: 'appstore' | 'googleplay';
  href?: string;
}

const config = {
  appstore: {
    icon: 'apps',
    label: 'Download on',
    title: 'App Store',
  },
  googleplay: {
    icon: 'play_circle',
    label: 'Get it on',
    title: 'Google Play',
  },
} satisfies Record<AppStoreButtonProps['store'], { icon: string; label: string; title: string }>;

export function AppStoreButton({ store, href = '#' }: AppStoreButtonProps) {
  const { icon, label, title } = config[store];
  return (
    <motion.a
      href={href}
      className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-on-surface transition-standard hover:bg-surface-container-highest"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <Icon name={icon} size={30} className="text-on-surface" />
      <div className="text-left">
        <p className="text-[10px] font-bold uppercase leading-none">{label}</p>
        <p className="text-xl font-bold leading-tight">{title}</p>
      </div>
    </motion.a>
  );
}
