import { useEffect, useRef } from 'react';
import { animate, createTimeline, createScope, createSpring } from 'animejs';

export function CarLabPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    const carGroup      = root.querySelector<SVGGElement>('#car-group')!;
    const headlightGlow = root.querySelector<SVGGElement>('#headlight-glow')!;
    const wheelSpinners = Array.from(root.querySelectorAll<SVGGElement>('.wheel-spinner'));

    const scope = createScope({ root });
    scope.execute(() => {
      const spring = createSpring({ stiffness: 160, damping: 14 });

      createTimeline()
        // Car slides in from left
        .add(carGroup, { translateX: [-950, 0], duration: 1500, ease: 'outExpo' })
        // Wheels spin in sync with car entry
        .add(wheelSpinners, { rotate: [0, 1080], duration: 1500, ease: 'outExpo' }, 0)
        // Bounce on landing (spring)
        .add(carGroup, { translateY: [-20, 0], duration: 800, ease: spring })
        // Headlights glow on
        .add(headlightGlow, { opacity: [0, 1], duration: 400, ease: 'outQuad' }, '-=350');

      // Idle float (infinite)
      animate(carGroup, {
        translateY: [0, -9, 0],
        duration: 3200,
        loop: true,
        ease: 'inOutSine',
        delay: 2600,
      });

      // Headlight pulse (subtle)
      animate(headlightGlow, {
        opacity: [0.8, 1],
        duration: 2200,
        loop: true,
        direction: 'alternate',
        ease: 'inOutSine',
        delay: 3200,
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex flex-col items-center justify-center px-6 py-16">
      <h1 className="text-white/90 text-2xl font-bold mb-1 tracking-wide">Car Lab</h1>
      <p className="text-white/30 text-sm mb-14">SVG vectorial + Anime.js v4</p>

      <div ref={rootRef} className="w-full max-w-4xl overflow-hidden">
        <svg
          viewBox="0 0 900 520"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C5E272" />
              <stop offset="35%" stopColor="#8DC63F" />
              <stop offset="100%" stopColor="#5C8D1A" />
            </linearGradient>
            <linearGradient id="frontFaceGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#496814" />
              <stop offset="100%" stopColor="#6FA028" />
            </linearGradient>
            <linearGradient id="hoodGrad" x1="0" y1="0" x2="0.35" y2="1">
              <stop offset="0%" stopColor="#AADC52" />
              <stop offset="100%" stopColor="#72A828" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#94CC42" />
              <stop offset="100%" stopColor="#5A8A18" />
            </linearGradient>
            <linearGradient id="windowGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2A3D52" />
              <stop offset="100%" stopColor="#0D1E2D" />
            </linearGradient>
            <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="rimGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#606060" />
              <stop offset="55%" stopColor="#303030" />
              <stop offset="100%" stopColor="#181818" />
            </radialGradient>
            <filter id="headlightGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── ALL CAR PARTS ── */}
          <g id="car-group">

            {/* Ground shadow */}
            <ellipse cx="432" cy="448" rx="335" ry="18" fill="url(#shadowGrad)" />

            {/* ── REAR WHEEL (behind body z-order) ── */}
            <g transform="translate(640,387)">
              <circle r="62" fill="#0A0A0A" />
              <circle r="62" fill="none" stroke="#1C1C1C" strokeWidth="5" />
              <g className="wheel-spinner" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <circle r="46" fill="#1E1E1E" />
                <circle r="42" fill="url(#rimGrad)" />
                <g stroke="#909090" strokeWidth="7" strokeLinecap="round">
                  <line x1="0" y1="-36" x2="0" y2="36" />
                  <line x1="-34" y1="-12" x2="34" y2="12" />
                  <line x1="-21" y1="30" x2="21" y2="-30" />
                  <line x1="21" y1="30" x2="-21" y2="-30" />
                  <line x1="34" y1="-12" x2="-34" y2="12" />
                </g>
                <circle r="13" fill="#444" />
                <circle r="7" fill="#686868" />
                <g fill="#555">
                  <circle cx="0" cy="-22" r="3" />
                  <circle cx="21" cy="-7" r="3" />
                  <circle cx="13" cy="18" r="3" />
                  <circle cx="-13" cy="18" r="3" />
                  <circle cx="-21" cy="-7" r="3" />
                </g>
              </g>
              <circle r="62" fill="none" stroke="#111" strokeWidth="2" />
            </g>

            {/* ── MAIN BODY ── */}
            <path
              id="car-body"
              d="
                M 78,375 Q 68,358 70,333 L 76,296 Q 86,260 112,228
                L 196,186 Q 242,163 284,150 L 380,126
                Q 430,113 496,108 L 577,107
                Q 620,107 652,120 Q 674,130 681,154
                L 686,192 Q 691,233 685,284
                L 675,358 Q 668,387 655,402
                L 130,404 Q 106,404 92,392 Z
              "
              fill="url(#bodyGrad)"
              stroke="#3E6A12"
              strokeWidth="1.5"
            />

            {/* ── FRONT FACE (3/4 perspective panel) ── */}
            <path
              d="
                M 78,375 Q 68,358 70,333 L 76,296 Q 86,260 112,228
                L 196,186 L 183,206 Q 159,236 146,277
                L 134,320 Q 128,354 130,382
                L 130,404 Q 106,404 92,392 Z
              "
              fill="url(#frontFaceGrad)"
            />

            {/* ── HOOD ── */}
            <path
              d="
                M 112,228 L 196,186 Q 242,163 284,150
                L 380,126 L 362,154 Q 320,165 278,178 L 182,210 Z
              "
              fill="url(#hoodGrad)"
              stroke="#3E6A12"
              strokeWidth="0.8"
            />
            <path d="M 162,224 Q 242,196 314,172 L 330,165" fill="none" stroke="#6A9A20" strokeWidth="2" opacity="0.45" />

            {/* ── ROOF ── */}
            <path
              d="
                M 380,126 Q 430,113 496,108 L 577,107
                Q 620,107 652,120 L 650,149
                Q 620,137 578,134 L 496,135
                Q 430,138 382,152 Z
              "
              fill="url(#roofGrad)"
              stroke="#3E6A12"
              strokeWidth="0.8"
            />

            {/* ── WINDSHIELD ── */}
            <path d="M 284,150 L 380,126 L 382,152 Q 346,162 310,172 L 278,178 Z" fill="url(#windowGrad)" opacity="0.92" />
            <path d="M 284,150 L 380,126 L 382,152 Q 346,162 310,172 L 278,178 Z" fill="none" stroke="#0A1825" strokeWidth="3" />
            {/* glare */}
            <path d="M 292,152 Q 322,141 358,132 L 368,130 L 364,140 Q 332,148 300,158 Z" fill="white" opacity="0.11" />

            {/* ── SIDE WINDOWS ── */}
            <path
              d="
                M 382,152 Q 430,138 496,135 L 578,134 L 650,149
                L 647,197 Q 620,187 578,185 L 496,184
                Q 447,184 394,191 Z
              "
              fill="url(#windowGrad)"
              opacity="0.88"
            />
            <path
              d="M 382,152 Q 430,138 496,135 L 578,134 L 650,149 L 647,197 Q 620,187 578,185 L 496,184 Q 447,184 394,191 Z"
              fill="none"
              stroke="#0A1825"
              strokeWidth="2"
            />
            {/* B-pillar */}
            <rect x="490" y="134" width="10" height="51" fill="#16251C" rx="2" />
            {/* A-pillar */}
            <path d="M 376,127 Q 379,140 384,155" fill="none" stroke="#16251C" strokeWidth="16" strokeLinecap="round" />
            {/* C-pillar */}
            <path d="M 650,120 L 647,197" fill="none" stroke="#16251C" strokeWidth="16" strokeLinecap="round" />
            {/* glare strip */}
            <path d="M 397,156 Q 448,144 508,141 L 548,140 L 544,148 Q 493,152 447,157 Z" fill="white" opacity="0.07" />

            {/* ── HEADLIGHTS ── */}
            {/* Housing (clear lens) */}
            <path
              d="M 112,228 L 196,186 L 183,206 Q 159,236 146,277 L 136,314 L 95,317 L 88,267 Q 85,244 100,234 Z"
              fill="#C5DCF0"
              opacity="0.82"
            />
            {/* DRL — L-shape (animated) */}
            <g id="headlight-glow" filter="url(#headlightGlow)" opacity="0">
              <path d="M 118,233 Q 150,217 180,207 L 184,213 Q 153,223 120,240 Z" fill="#FFD000" />
              <path d="M 118,233 L 120,240 L 108,277 L 100,275 Z" fill="#FFD000" />
            </g>
            {/* Projector lens */}
            <ellipse cx="148" cy="268" rx="24" ry="22" fill="#A8C8E8" />
            <ellipse cx="148" cy="268" rx="18" ry="16" fill="#D0E8F8" />
            <ellipse cx="148" cy="268" rx="10" ry="9" fill="#E8F4FF" opacity="0.9" />
            {/* Chrome frame */}
            <path
              d="M 112,228 L 196,186 L 183,206 Q 159,236 146,277 L 136,314 L 95,317 L 88,267 Q 85,244 100,234 Z"
              fill="none"
              stroke="#1A2A15"
              strokeWidth="2.5"
            />

            {/* ── FRONT GRILLE ── */}
            <path d="M 88,318 L 134,315 L 130,358 L 92,362 Z" fill="#0F0F0F" />
            <line x1="90" y1="326" x2="133" y2="323" stroke="#2A2A2A" strokeWidth="2.5" />
            <line x1="90" y1="334" x2="133" y2="332" stroke="#2A2A2A" strokeWidth="2.5" />
            <line x1="91" y1="342" x2="133" y2="341" stroke="#2A2A2A" strokeWidth="2.5" />
            <line x1="91" y1="350" x2="132" y2="350" stroke="#2A2A2A" strokeWidth="2.5" />
            {/* Emblem */}
            <ellipse cx="110" cy="338" rx="9" ry="9" fill="#282828" stroke="#383838" strokeWidth="1.5" />
            {/* Lower bumper vent */}
            <path d="M 78,360 Q 68,375 70,390 L 92,394 L 95,376 L 88,360 Z" fill="#0A0A0A" />

            {/* ── BODY LINES ── */}
            <path d="M 148,292 Q 305,280 505,280 L 656,292" fill="none" stroke="#A5D040" strokeWidth="2" opacity="0.32" />
            <path d="M 140,352 Q 305,342 505,342 L 655,352" fill="none" stroke="#3E6A12" strokeWidth="1.5" opacity="0.32" />
            <line x1="390" y1="195" x2="394" y2="382" stroke="#3E6A12" strokeWidth="2" opacity="0.45" />

            {/* ── WHEEL ARCHES ── */}
            <path d="M 110,404 Q 118,378 158,370 L 270,368 Q 304,370 314,383 L 320,404 Z" fill="#16200E" />
            <path d="M 518,404 Q 528,374 568,368 L 706,370 Q 722,378 724,394 L 726,404 Z" fill="#16200E" />

            {/* ── REAR LIGHTS ── */}
            <path
              d="
                M 681,154 L 686,192 Q 691,233 685,284
                L 679,342 L 672,360 L 665,402
                L 659,400 L 665,358 L 672,340
                L 678,282 Q 684,230 679,190 L 674,157 Z
              "
              fill="#C80E0E"
            />
            <path
              d="
                M 672,157 L 678,191 Q 683,230 678,281
                L 672,340 L 665,358 L 659,400 L 656,397
                L 662,356 L 668,338 L 674,280
                Q 679,228 674,190 L 668,158 Z
              "
              fill="#A00808"
              opacity="0.6"
            />
            <line x1="674" y1="165" x2="678" y2="342" stroke="#FF3030" strokeWidth="3" opacity="0.4" />
            {/* Reverse light */}
            <path d="M 665,360 L 673,358 L 671,400 L 657,400 Z" fill="#EEEEEE" opacity="0.82" />

            {/* ── REAR BUMPER ── */}
            <path d="M 675,358 Q 668,387 655,402 L 666,402 Q 673,387 681,360 Z" fill="#72A828" opacity="0.85" />

            {/* ── SPOILER ── */}
            <path d="M 577,107 Q 620,107 652,120 L 661,114 Q 630,100 577,102 Z" fill="#3E6A12" />
            <path d="M 620,105 Q 647,107 661,114 L 652,120 Q 638,113 620,112 Z" fill="#2E5008" opacity="0.8" />

            {/* ── SIDE MIRROR ── */}
            <path d="M 280,167 Q 298,158 308,161 L 308,170 Q 297,168 282,176 Z" fill="#72A828" />
            <rect x="281" y="161" width="25" height="14" rx="4" fill="#18281A" stroke="#243020" strokeWidth="1" />

            {/* ── BODY HIGHLIGHTS ── */}
            <path d="M 303,154 Q 432,126 577,120 L 578,128 Q 432,136 303,162 Z" fill="white" opacity="0.14" />
            <path d="M 163,222 Q 244,196 313,177 L 315,185 Q 245,204 165,230 Z" fill="white" opacity="0.19" />
            <path d="M 172,300 Q 354,288 535,287 L 652,298 L 650,306 Q 524,294 354,295 L 170,307 Z" fill="white" opacity="0.07" />

            {/* ── FRONT WHEEL (above body z-order) ── */}
            <g transform="translate(215,387)">
              <circle r="62" fill="#0A0A0A" />
              <circle r="62" fill="none" stroke="#1C1C1C" strokeWidth="5" />
              <g className="wheel-spinner" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <circle r="46" fill="#1E1E1E" />
                <circle r="42" fill="url(#rimGrad)" />
                <g stroke="#909090" strokeWidth="7" strokeLinecap="round">
                  <line x1="0" y1="-36" x2="0" y2="36" />
                  <line x1="-34" y1="-12" x2="34" y2="12" />
                  <line x1="-21" y1="30" x2="21" y2="-30" />
                  <line x1="21" y1="30" x2="-21" y2="-30" />
                  <line x1="34" y1="-12" x2="-34" y2="12" />
                </g>
                <circle r="13" fill="#444" />
                <circle r="7" fill="#686868" />
                <g fill="#555">
                  <circle cx="0" cy="-22" r="3" />
                  <circle cx="21" cy="-7" r="3" />
                  <circle cx="13" cy="18" r="3" />
                  <circle cx="-13" cy="18" r="3" />
                  <circle cx="-21" cy="-7" r="3" />
                </g>
              </g>
              <circle r="62" fill="none" stroke="#111" strokeWidth="2" />
            </g>

          </g>
          {/* ── END car-group ── */}
        </svg>
      </div>

      <a
        href="/"
        className="mt-12 text-white/35 hover:text-white/70 text-sm transition-colors duration-200"
      >
        ← Volver al Landing
      </a>
    </div>
  );
}
