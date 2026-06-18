import { motion } from 'framer-motion';
import { Icon } from '@/components/atoms';
import { fadeUp } from '@/hooks/useScrollReveal';

type FeatureCardProps = {
  icon: string;
  title: string;
  text: string;
};

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="flex flex-col items-start rounded-2xl bg-surface-container-lowest p-6 shadow-card"
    >
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-on-primary-container">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="text-headline-md text-on-surface">{title}</h3>
      <p className="mt-2 text-on-surface-variant">{text}</p>
    </motion.article>
  );
}
