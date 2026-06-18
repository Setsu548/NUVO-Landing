import { Icon } from '@/components/atoms';

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-container">
        <Icon name={icon} className="text-primary" />
      </div>
      <div>
        <h4 className="mb-1 text-body-md font-bold text-on-surface">{title}</h4>
        <p className="text-body-sm text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}
