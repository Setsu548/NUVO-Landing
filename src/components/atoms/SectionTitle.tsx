import type { ReactNode } from 'react';

type SectionTitleProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  tone?: 'ink' | 'light';
  className?: string;
};

export function SectionTitle({
  title,
  subtitle,
  align = 'center',
  tone = 'ink',
  className,
}: SectionTitleProps) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left';
  const titleColor = tone === 'light' ? 'text-white' : 'text-on-surface';
  const subColor = tone === 'light' ? 'text-white/80' : 'text-on-surface-variant';

  return (
    <div className={['max-w-2xl', alignment, className].filter(Boolean).join(' ')}>
      <h2 className={`text-headline-lg ${titleColor}`}>{title}</h2>
      {subtitle ? <p className={`mt-3 text-body-lg ${subColor}`}>{subtitle}</p> : null}
    </div>
  );
}
