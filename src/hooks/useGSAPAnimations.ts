/**
 * useGSAPAnimations
 *
 * Centraliza la lógica de animaciones GSAP para la landing.
 * Todas las animaciones respetan prefers-reduced-motion vía gsap.matchMedia().
 *
 * Patrones de uso:
 *   - heroEntrance: timeline de entrada del Hero (texto + imagen en secuencia)
 *   - scrollBatch: reveal en batch de elementos (.gsap-reveal) al entrar al viewport
 *   - parallax: efecto parallax sutil en un elemento durante el scroll
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';

// Registro único de plugins — idempotente si se llama varias veces.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Types ─────────────────────────────────────────────────────────────────

interface HeroEntranceOptions {
  /** Ref al contenedor raíz del Hero (scope para selectores GSAP). */
  containerRef: RefObject<HTMLElement | null>;
  /** Selector del bloque de copy (badge, h1, p, CTAs, social proof). */
  copySelector?: string;
  /** Selector de la ilustración del auto. */
  illustrationSelector?: string;
}

interface ScrollRevealOptions {
  /** Ref al contenedor que aloja los elementos .gsap-reveal. */
  containerRef: RefObject<HTMLElement | null>;
  /** Porcentaje del viewport desde donde se activa (0–1). Default 0.15. */
  amount?: number;
}

interface ParallaxOptions {
  /** Ref al elemento que se mueve en parallax. */
  elementRef: RefObject<HTMLElement | null>;
  /** Cuántos px se desplaza el elemento por cada px de scroll (negativo = sube). */
  speed?: number;
}

// ─── Hero entrance timeline ─────────────────────────────────────────────────

/**
 * Anima la entrada del Hero con un timeline orquestado.
 * Badge → h1 → párrafo → CTAs → social proof en paralelo con la ilustración.
 */
export function useHeroEntrance({
  containerRef,
  copySelector = '.hero-copy',
  illustrationSelector = '.hero-illustration',
}: HeroEntranceOptions) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Animación completa para usuarios sin preferencia de movimiento reducido.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Ilustración entra desde la derecha con scale
        tl.fromTo(
          illustrationSelector,
          { opacity: 0, x: 60, scale: 0.93 },
          { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out' },
          0,
        );

        // Copy: cada hijo visible en stagger desde abajo
        tl.fromTo(
          `${copySelector} > *`,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.11 },
          0.15,
        );
      });

      // Motion reducido: fade simple sin traslación.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.fromTo(
          [copySelector, illustrationSelector],
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
        );
      });
    },
    { scope: containerRef },
  );
}

// ─── Scroll reveal (batch) ───────────────────────────────────────────────────

/**
 * Aplica reveal de scroll a todos los elementos con clase .gsap-reveal
 * dentro del containerRef. Usa ScrollTrigger.batch para animar en grupos.
 *
 * El elemento debe tener `opacity: 0; transform: translateY(40px)` como estado inicial,
 * que se puede lograr con la clase CSS `gsap-reveal` (definida en index.css).
 */
export function useScrollRevealBatch({
  containerRef,
  amount = 0.15,
}: ScrollRevealOptions) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Obtiene los elementos .gsap-reveal dentro de este scope específico.
      // No usamos selector global para evitar que una sección anime
      // elementos de otra (cada hook tiene su propio scope).
      const elements = containerRef.current.querySelectorAll<HTMLElement>('.gsap-reveal');
      if (elements.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set estado inicial en el scope (por si el CSS no cargó antes del mount).
        gsap.set(elements, { opacity: 0, y: 40 });

        ScrollTrigger.batch(elements, {
          start: `top ${Math.round((1 - amount) * 100)}%`,
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.1,
              ease: 'power3.out',
              overwrite: true,
            });
          },
          onLeaveBack: (batch) => {
            gsap.set(batch, { opacity: 0, y: 40, overwrite: true });
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(elements, { opacity: 1, y: 0 });
      });
    },
    { scope: containerRef },
  );
}

// ─── Car slide-in ───────────────────────────────────────────────────────────

interface CarSlideInOptions {
  /** Ref a la sección que actúa como trigger del scroll. */
  sectionRef: RefObject<HTMLElement | null>;
  /** Ref al contenedor del auto que se desliza. */
  carRef: RefObject<HTMLElement | null>;
}

/**
 * Desliza el auto desde la derecha hacia su posición final cuando la sección
 * entra al viewport. El auto SIEMPRE entra por la derecha y SIEMPRE sale por
 * la izquierda, independientemente de la dirección del scroll.
 * Sin movimiento en prefers-reduced-motion: reduce.
 */
export function useCarSlideIn({ sectionRef, carRef }: CarSlideInOptions) {
  useGSAP(
    () => {
      if (!carRef.current || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Estado inicial: fuera del viewport por la derecha.
        gsap.set(carRef.current, { xPercent: 115, opacity: 0 });

        const slideIn = () =>
          gsap.fromTo(
            carRef.current,
            { xPercent: 115, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.3, ease: 'power3.out', overwrite: true },
          );
        const slideOut = (dur: number) =>
          gsap.to(carRef.current, { xPercent: -115, opacity: 0, duration: dur, ease: 'power2.in', overwrite: true });

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 72%',
          end: 'bottom top',
          onEnter: slideIn,
          onLeave: () => slideOut(0.9),
          onEnterBack: () =>
            gsap.fromTo(
              carRef.current,
              { xPercent: 115, opacity: 0 },
              { xPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', overwrite: true },
            ),
          onLeaveBack: () => slideOut(0.7),
        });

        // Si la sección ya está en el viewport al inicializar, onEnter no dispara.
        if (st.isActive) slideIn();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(carRef.current, { xPercent: 0, opacity: 1 });
      });
    },
    { scope: sectionRef },
  );
}

// ─── Car slide-in from LEFT ──────────────────────────────────────────────────

/**
 * Espejo de useCarSlideIn: el auto SIEMPRE entra por la IZQUIERDA y SIEMPRE
 * sale por la DERECHA. Para secciones donde el auto está en el lado izquierdo.
 */
export function useCarSlideInFromLeft({ sectionRef, carRef }: CarSlideInOptions) {
  useGSAP(
    () => {
      if (!carRef.current || !sectionRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(carRef.current, { xPercent: -115, opacity: 0 });

        const slideIn = () =>
          gsap.fromTo(
            carRef.current,
            { xPercent: -115, opacity: 0 },
            { xPercent: 0, opacity: 1, duration: 1.3, ease: 'power3.out', overwrite: true },
          );
        const slideOut = (dur: number) =>
          gsap.to(carRef.current, { xPercent: 115, opacity: 0, duration: dur, ease: 'power2.in', overwrite: true });

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 72%',
          end: 'bottom top',
          onEnter: slideIn,
          onLeave: () => slideOut(0.9),
          onEnterBack: () =>
            gsap.fromTo(
              carRef.current,
              { xPercent: -115, opacity: 0 },
              { xPercent: 0, opacity: 1, duration: 1.0, ease: 'power3.out', overwrite: true },
            ),
          onLeaveBack: () => slideOut(0.7),
        });

        if (st.isActive) slideIn();
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(carRef.current, { xPercent: 0, opacity: 1 });
      });
    },
    { scope: sectionRef },
  );
}

// ─── Feature cards reveal (cinematográfico) ─────────────────────────────────

interface FeatureCardsRevealOptions {
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * Reveal cinematográfico para cards individuales de features (.feature-card).
 * Cada card entra con opacity + translateY + scale en stagger.
 * Al salir hacia arriba vuelven al estado inicial para un re-reveal limpio.
 */
export function useFeatureCardsReveal({ containerRef }: FeatureCardsRevealOptions) {
  useGSAP(
    () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll<HTMLElement>('.feature-card');
      if (cards.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(cards, { opacity: 0, y: 50, scale: 0.95 });

        ScrollTrigger.batch(cards, {
          start: 'top 88%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power3.out',
              overwrite: true,
            });
          },
          onLeaveBack: (batch) => {
            gsap.set(batch, { opacity: 0, y: 50, scale: 0.95, overwrite: true });
          },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      });
    },
    { scope: containerRef },
  );
}

// ─── Parallax suave ─────────────────────────────────────────────────────────

/**
 * Mueve un elemento en parallax durante el scroll.
 * No hace nada en prefers-reduced-motion: reduce.
 */
export function useParallax({ elementRef, speed = -0.3 }: ParallaxOptions) {
  useGSAP(
    () => {
      if (!elementRef.current) return;

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(elementRef.current, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: elementRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    },
    { scope: elementRef as RefObject<HTMLElement> },
  );
}
