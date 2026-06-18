import { motion } from 'framer-motion';
import { Icon } from '@/components/atoms';

interface SocialLinkProps {
  icon: string;
  href: string;
  label: string;
}

export function SocialLink({ icon, href, label }: SocialLinkProps) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-inverse-on-surface transition-standard hover:bg-primary"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon name={icon} size={18} />
    </motion.a>
  );
}
