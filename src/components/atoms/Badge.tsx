import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full bg-secondary-container px-4 py-1.5 text-label-md text-on-secondary-container ${className}`}
    >
      {children}
    </span>
  );
}
