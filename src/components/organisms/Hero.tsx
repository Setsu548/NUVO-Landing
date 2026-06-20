import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Icon } from '@/components/atoms';
import { useHeroEntrance } from '@/hooks/useGSAPAnimations';

/** Tonos Nuvo Blue con contraste suficiente para texto blanco (ratio ≥ 4.5:1). */
const HERO_COLORS = [
  '#00677F', // primary — Nuvo Blue
  '#007D99', // entre primary y primary-container
  '#004E60', // on-primary-fixed-variant
  '#47B5D6', // primary-container — cian medio
  '#004354', // on-primary-container — azul profundo
  '#006880', // tono intermedio para suavizar transición de vuelta
] as const;

/** Ilustración SVG inline de un auto moderno en colores NUVO (sin dependencias externas). */
function CarIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Fondo con gradiente suave */}
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#e0f2f7" />
          <stop offset="100%" stopColor="#f0fafe" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00677f" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00677f" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#00677f" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Fondo ovalado */}
      <ellipse cx="240" cy="260" rx="200" ry="30" fill="url(#glowGrad)" />

      {/* Nubes — carrusel derecha → izquierda */}

      {/* Nube grande: 2 copias separadas 480 u para loop infinito */}
      <g>
        <g fill="white" opacity="0.85">
          <circle cx="80"  cy="76" r="22" />
          <circle cx="110" cy="52" r="34" />
          <circle cx="148" cy="60" r="28" />
          <circle cx="176" cy="74" r="20" />
          <rect x="80" y="76" width="96" height="22" />
        </g>
        <g fill="white" opacity="0.85" transform="translate(480 0)">
          <circle cx="80"  cy="76" r="22" />
          <circle cx="110" cy="52" r="34" />
          <circle cx="148" cy="60" r="28" />
          <circle cx="176" cy="74" r="20" />
          <rect x="80" y="76" width="96" height="22" />
        </g>
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="-480 0"
          dur="22s"
          repeatCount="indefinite"
        />
      </g>

      {/* Nube alargada: más ancha que alta, 2 copias para loop */}
      <g>
        <g fill="white" opacity="0.72">
          <circle cx="270" cy="55" r="13" />
          <circle cx="294" cy="47" r="17" />
          <circle cx="320" cy="42" r="20" />
          <circle cx="348" cy="40" r="22" />
          <circle cx="376" cy="42" r="20" />
          <circle cx="402" cy="47" r="17" />
          <circle cx="426" cy="55" r="13" />
          <rect x="270" y="55" width="156" height="13" />
        </g>
        <g fill="white" opacity="0.72" transform="translate(480 0)">
          <circle cx="270" cy="55" r="13" />
          <circle cx="294" cy="47" r="17" />
          <circle cx="320" cy="42" r="20" />
          <circle cx="348" cy="40" r="22" />
          <circle cx="376" cy="42" r="20" />
          <circle cx="402" cy="47" r="17" />
          <circle cx="426" cy="55" r="13" />
          <rect x="270" y="55" width="156" height="13" />
        </g>
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0 0"
          to="-480 0"
          dur="14s"
          begin="-8s"
          repeatCount="indefinite"
        />
      </g>

      {/* Carrocería principal — tambaleante */}
      <motion.g
        filter="url(#shadow)"
        animate={{ y: [0, -4, -1, -5, 0, -3, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' }}
      >
        {/* Piso / base del auto */}
        <rect x="60" y="210" width="360" height="48" rx="12" fill="#00677f" />

        {/* Cabina */}
        <path
          d="M130 210 C145 160 175 140 240 136 C305 140 335 160 350 210 Z"
          fill="#007d99"
        />

        {/* Techo */}
        <path
          d="M160 210 C170 168 190 150 240 147 C290 150 310 168 320 210 Z"
          fill="#00677f"
        />

        {/* Parabrisas delantero */}
        <path
          d="M292 210 C304 174 296 158 268 152 L240 150 C240 150 240 150 240 210 Z"
          fill="#b2e4ef"
        />
        {/* Parabrisas trasero */}
        <path
          d="M188 210 C176 174 184 158 212 152 L240 150 C240 150 240 150 240 210 Z"
          fill="#b2e4ef"
        />

        {/* Ventanas laterales — izquierda */}
        <path
          d="M168 200 C172 178 182 164 200 160 L228 159 L228 200 Z"
          fill="#cceef6"
        />
        {/* Ventanas laterales — derecha */}
        <path
          d="M312 200 C308 178 298 164 280 160 L252 159 L252 200 Z"
          fill="#cceef6"
        />

        {/* Franja lateral decorativa */}
        <rect x="65" y="216" width="350" height="6" rx="3" fill="#005566" opacity="0.4" />

        {/* Capó delantero */}
        <path d="M350 210 L420 210 C428 210 432 220 428 230 L350 230 Z" fill="#005f74" />
        {/* Capó trasero */}
        <path d="M130 210 L60 210 C52 210 48 220 52 230 L130 230 Z" fill="#005f74" />

        {/* Parachoque delantero */}
        <rect x="400" y="228" width="24" height="12" rx="4" fill="#004d61" />
        {/* Parachoque trasero */}
        <rect x="56" y="228" width="24" height="12" rx="4" fill="#004d61" />

        {/* Faros delanteros */}
        <ellipse cx="418" cy="218" rx="10" ry="5" fill="#fffde7" opacity="0.95" />
        <ellipse cx="418" cy="218" rx="6" ry="3" fill="#fff9c4" />
        {/* Faros traseros */}
        <ellipse cx="62" cy="218" rx="10" ry="5" fill="#ff5252" opacity="0.85" />
        <ellipse cx="62" cy="218" rx="6" ry="3" fill="#ff1744" opacity="0.7" />

        {/* Rueda delantera */}
        <g className="wheel-spin">
          <circle cx="360" cy="252" r="34" fill="#1a1a2e" />
          <circle cx="360" cy="252" r="24" fill="#2d2d44" />
          <circle cx="360" cy="252" r="14" fill="#00677f" />
          <circle cx="360" cy="252" r="6"  fill="#e0f2f7" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <line
              key={i}
              x1={360 + 9 * Math.cos((deg * Math.PI) / 180)}
              y1={252 + 9 * Math.sin((deg * Math.PI) / 180)}
              x2={360 + 22 * Math.cos((deg * Math.PI) / 180)}
              y2={252 + 22 * Math.sin((deg * Math.PI) / 180)}
              stroke="#e0f2f7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Rueda trasera */}
        <g className="wheel-spin">
          <circle cx="120" cy="252" r="34" fill="#1a1a2e" />
          <circle cx="120" cy="252" r="24" fill="#2d2d44" />
          <circle cx="120" cy="252" r="14" fill="#00677f" />
          <circle cx="120" cy="252" r="6"  fill="#e0f2f7" />
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <line
              key={i}
              x1={120 + 9 * Math.cos((deg * Math.PI) / 180)}
              y1={252 + 9 * Math.sin((deg * Math.PI) / 180)}
              x2={120 + 22 * Math.cos((deg * Math.PI) / 180)}
              y2={252 + 22 * Math.sin((deg * Math.PI) / 180)}
              stroke="#e0f2f7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </g>
      </motion.g>

      {/* Sombra del piso */}
      <ellipse cx="240" cy="286" rx="165" ry="10" fill="#00677f" opacity="0.12" />
    </svg>
  );
}

/** Avatar SVG con inicial y color de fondo. */
function AvatarPlaceholder({
  initial,
  bgColor,
  label,
}: {
  initial: string;
  bgColor: string;
  label: string;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      className="h-10 w-10 rounded-full border-2 border-white"
    >
      <circle cx="20" cy="20" r="20" fill={bgColor} />
      <text
        x="20"
        y="25"
        textAnchor="middle"
        fontSize="16"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        fill="white"
      >
        {initial}
      </text>
    </svg>
  );
}

export function Hero() {
  const { t } = useTranslation();
  const [colorIndex, setColorIndex] = useState(0);

  // Refs para GSAP scope
  const containerRef = useRef<HTMLElement>(null);

  // Color cycling del fondo — se mantiene en Framer Motion (animación de loop
  // que no depende de scroll, FM es ideal para esto).
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % HERO_COLORS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Timeline de entrada con GSAP: copy y ilustración entran orquestados.
  useHeroEntrance({ containerRef });

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[85vh] overflow-hidden flex items-center"
      animate={{ backgroundColor: HERO_COLORS[colorIndex] }}
      transition={{ duration: 4, ease: 'easeInOut' }}
    >
      {/* hero-pattern overlay semitransparente */}
      <div
        aria-hidden="true"
        className="hero-pattern pointer-events-none absolute inset-0 opacity-20"
      />
      {/* Blob decorativo */}
      <div
        aria-hidden="true"
        className="hero-blob pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container-page relative z-10 grid w-full grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left: copy — GSAP anima los hijos directos con selector .hero-copy > * */}
        <div className="hero-copy flex flex-col gap-6">
          <div>
            <Badge>{t('hero.badge')}</Badge>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-on-primary md:text-headline-xl">
            {t('hero.title_pre')}{' '}
            <br className="hidden md:block" />
            {t('hero.title_post')}{' '}
            <span className="text-primary-fixed">NUVO</span>
          </h1>

          <p className="max-w-lg text-body-lg text-inverse-on-surface">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-on-primary shadow-card transition-standard hover:shadow-overlay"
              >
                {t('hero.cta_primary')}
                <Icon name="arrow_forward" />
              </a>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline bg-white px-8 py-4 text-lg font-semibold text-on-surface transition-standard hover:bg-surface-container-low"
              >
                {t('hero.cta_secondary')}
              </a>
            </motion.div>
          </div>

          {/* Social proof */}
          <div className="mt-4 flex items-center gap-6">
            <div className="flex -space-x-3">
              <AvatarPlaceholder initial="M" bgColor="#e8956d" label={t('hero.avatar_label')} />
              <AvatarPlaceholder initial="S" bgColor="#7b5ea7" label={t('hero.avatar_label')} />
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary-fixed text-[10px] font-bold text-on-primary-fixed">
                +2k
              </div>
            </div>
            <p className="text-body-sm text-inverse-on-surface">
              {t('hero.social_proof')}
            </p>
          </div>
        </div>

        {/* Right: ilustración del auto — GSAP la anima con .hero-illustration */}
        <div className="hero-illustration relative flex justify-center lg:justify-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-125 rounded-full bg-primary/5 blur-3xl"
          />
          <CarIllustration className="relative z-10 w-full max-w-xs sm:max-w-sm lg:max-w-lg drop-shadow-2xl" />
        </div>
      </div>
    </motion.section>
  );
}
