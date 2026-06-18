import type { ComponentPropsWithoutRef } from 'react';

interface NavLinkProps extends ComponentPropsWithoutRef<'a'> {
  active?: boolean;
  light?: boolean;
}

export function NavLink({ active = false, light = false, className = '', children, ...props }: NavLinkProps) {
  const cls = active
    ? `border-b-2 py-5 text-label-md font-bold transition-standard ${light ? 'border-white text-white' : 'border-primary text-primary'}`
    : `text-label-md transition-standard ${light ? 'text-white/80 hover:text-white' : 'text-on-surface-variant hover:text-primary'}`;
  return (
    <a className={`${cls} ${className}`} {...props}>
      {children}
    </a>
  );
}
