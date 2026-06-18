import { motion } from 'framer-motion';
import { Icon } from '@/components/atoms';
import { fadeUpLight } from '@/hooks/useScrollReveal';

interface FleetCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}

export function FleetCard({ icon, title, description, features, featured = false, badge }: FleetCardProps) {
  const containerCls = featured
    ? 'relative overflow-hidden rounded-3xl border border-primary bg-primary p-8 text-on-primary'
    : 'group rounded-3xl border border-outline-variant bg-surface-bright p-8 transition-standard hover:border-primary hover:shadow-overlay';

  const iconContainerCls = featured
    ? 'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20'
    : 'mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-container transition-standard group-hover:scale-110';

  return (
    <motion.div
      className={containerCls}
      variants={fadeUpLight}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {badge && (
        <div className="absolute right-0 top-0 p-4">
          <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white">
            {badge}
          </span>
        </div>
      )}
      <div className={iconContainerCls}>
        <Icon name={icon} size={30} className={featured ? 'text-white' : 'text-primary'} />
      </div>
      <h3 className="mb-3 text-headline-md">{title}</h3>
      <p className={`mb-6 text-body-sm ${featured ? 'opacity-90' : 'text-on-surface-variant'}`}>
        {description}
      </p>
      <ul className="space-y-3">
        {features.map((f) => (
          <li key={f} className={`flex items-center gap-2 text-label-md ${featured ? '' : 'text-on-surface-variant'}`}>
            <Icon name="check_circle" size={18} className={featured ? 'text-white' : 'text-primary'} />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
