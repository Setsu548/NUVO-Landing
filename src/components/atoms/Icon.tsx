interface IconProps {
  name: string;
  fill?: boolean;
  size?: number;
  className?: string;
}

export function Icon({ name, fill = false, size = 24, className = '' }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
