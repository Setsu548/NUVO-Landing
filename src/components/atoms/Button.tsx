import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'inverse' | 'pill';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-semibold transition-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-60 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-on-primary rounded-xl shadow-card hover:shadow-overlay',
  secondary: 'bg-white border border-outline text-on-surface rounded-xl hover:bg-surface-container-low',
  inverse:   'bg-inverse-surface text-inverse-on-surface rounded-xl shadow-card hover:bg-on-surface',
  pill:      'bg-primary text-on-primary rounded-full shadow-card hover:shadow-overlay',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-body-sm',
  md: 'px-6 py-2.5 text-body-sm',
  lg: 'px-8 py-4 text-headline-md',
};

function cls(v: ButtonVariant, s: ButtonSize, extra?: string) {
  return [base, variants[v], sizes[s], extra].filter(Boolean).join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

type ButtonProps = BaseProps & ComponentPropsWithoutRef<'button'>;
type LinkButtonProps = BaseProps & ComponentPropsWithoutRef<'a'>;

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      className={cls(variant, size, className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      {...(props as AnyProps)}
    >
      {children}
    </motion.button>
  );
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <motion.a
      className={cls(variant, size, className)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      {...(props as AnyProps)}
    >
      {children}
    </motion.a>
  );
}
