# NUVO Landing — Historia de Decisiones Arquitectónicas

## [2026-06-20] - GSAP: timeline de entrada Hero + ScrollTrigger reveal por sección

### Qué se hizo
- Instalados `gsap 3.15.0` y `@gsap/react 2.1.2` como dependencias de producción.
- Creado `src/hooks/useGSAPAnimations.ts` con tres exports:
  - `useHeroEntrance`: timeline de entrada orquestado (ilustración + copy con stagger) vía `useGSAP`.
  - `useScrollRevealBatch`: revela elementos `.gsap-reveal` por sección con `ScrollTrigger.batch`, scoped al `containerRef` de cada componente mediante `querySelectorAll` interno.
  - `useParallax`: efecto parallax scrub-linked (disponible, no aplicado aún — ver deuda técnica).
- Refactorizado `Hero.tsx`: eliminados `motion.div` wrappers de entrada (Framer Motion), reemplazados por clases `.hero-copy` y `.hero-illustration` como targets del timeline GSAP. Se conserva `motion.section` solo para el color cycling de fondo (loop que no es de entrada, FM sigue siendo el tool correcto para eso). Se conservan `whileHover`/`whileTap` en los CTAs.
- Refactorizados `PassengerSection`, `DriverSection`, `FleetSection`, `AppDownloadCTA`, `SupportBanner`: eliminados todos los `motion.div` con `whileInView`/`variants`. Reemplazados por `useScrollRevealBatch` + clase `.gsap-reveal` en los elementos.
- Agregados estilos en `index.css`: clase `.gsap-reveal` con estado inicial `opacity: 0; transform: translateY(40px); will-change: opacity, transform;` + fallback `@media (prefers-reduced-motion: reduce)` que resetea a visible.
- Build de producción: `tsc --noEmit` sin errores, `vite build` exitoso. Output: 515 kB JS / 20.78 kB CSS.

### Decisiones arquitectónicas
- **GSAP coexiste con Framer Motion — no reemplaza**: FM sigue siendo el tool correcto para animaciones de estado React (color cycling, hover, tap). GSAP toma control de las animaciones de entrada y scroll porque ofrece mejor rendimiento de timeline, `ScrollTrigger.batch` para coordinación de grupos, y `gsap.matchMedia` como API first-class para `prefers-reduced-motion`. Eliminar FM habría sido un refactor de mayor riesgo sin beneficio proporcional.
- **`useGSAP` de `@gsap/react` sobre `useEffect` + `gsap.context`**: `useGSAP` maneja cleanup automático (revert de tweens y ScrollTriggers al desmontar), expone `contextSafe` para callbacks post-mount, y es el patrón oficial de GSAP para React. `useEffect` + `gsap.context().revert()` era el patrón anterior; con `@gsap/react` disponible no hay razón para usarlo.
- **`querySelectorAll` en lugar de selector string global en `ScrollTrigger.batch`**: `useGSAP` con `{ scope: containerRef }` hace que los selectores CSS de GSAP estén scoped al container. Sin embargo, `ScrollTrigger.batch` como API de alto nivel no acepta `scope` directamente — hace su propia búsqueda en el DOM. Pasar `NodeList` en lugar de string de selector evita que una sección active ScrollTriggers de otra, manteniendo el aislamiento correcto por componente.
- **`gsap.matchMedia()` dentro de cada hook**: GSAP recomienda `matchMedia` en lugar de checar `window.matchMedia` manualmente porque es reactive y se revierte automáticamente al cambiar la media query. El fallback CSS en `.gsap-reveal { @media (prefers-reduced-motion: reduce) }` es solo seguridad por si JS no carga.
- **`will-change: opacity, transform` en `.gsap-reveal`**: promovido a capa de compositing desde el principio para evitar layout thrashing durante la animación. Se aplica solo a los elementos que serán animados, no globalmente.
- **Blob del Hero conservado con CSS animation**: el `hero-blob` usa `animation: hero-pulse 7s ease-in-out infinite` ya existente. No migrado a GSAP porque es un loop decorativo de baja prioridad — agregar un tween GSAP aquí sería over-engineering.

### Archivos modificados/creados
- `src/hooks/useGSAPAnimations.ts` — CREADO: tres hooks GSAP (`useHeroEntrance`, `useScrollRevealBatch`, `useParallax`)
- `src/index.css` — agregada clase `.gsap-reveal` con estado inicial y fallback `prefers-reduced-motion`
- `src/components/organisms/Hero.tsx` — timeline GSAP de entrada, limpieza de Framer Motion variants de entrada
- `src/components/organisms/PassengerSection.tsx` — `useScrollRevealBatch` + `.gsap-reveal`, eliminados `motion.*` wrappers
- `src/components/organisms/DriverSection.tsx` — ídem
- `src/components/organisms/FleetSection.tsx` — ídem
- `src/components/organisms/AppDownloadCTA.tsx` — ídem
- `src/components/organisms/SupportBanner.tsx` — ídem
- `package.json` — `gsap 3.15.0` y `@gsap/react 2.1.2` agregados a `dependencies`

### Deuda técnica / Próximos pasos
- **Bundle**: 515 kB JS (173 kB gzip). Tener GSAP (≈150kB) + Framer Motion (≈80kB) en el mismo bundle es el trade-off de la coexistencia. En el momento que se agregue una segunda ruta, implementar code splitting con `manualChunks` para separar `gsap` y `framer-motion` en chunks vendor.
- **`useParallax`**: hook implementado y exportado pero no aplicado. Candidatos: el `hero-blob`, las imágenes de teléfono en PassengerSection/DriverSection. Evaluar si el efecto aporta suficiente valor visual antes de aplicar.
- **Ruedas del auto SVG**: el `spin-wheel` CSS animation podría reemplazarse con un tween GSAP que acelere/desacelere al aparecer el Hero para mayor dramatismo de entrada. Requiere agregar ref a los `<g class="wheel-spin">` del SVG.
- **Footer**: no migrado a GSAP reveal — leer su implementación y evaluar si tiene animaciones Framer Motion de entrada pendientes de migrar.

### Breaking changes
- `useScrollReveal.ts` ya no es importado por ningún organism. Las exportaciones `fadeUp`, `scaleIn`, `staggerContainer` siguen disponibles — el archivo no fue eliminado para no romper posibles importaciones en otros contextos.

## [2026-06-17] - Ajustes visuales: ritmo Hero y color Navbar

### Qué se hizo
- **Hero** (`Hero.tsx`): ralentizada la transición de color de fondo de `duration: 1.5` a `duration: 4` segundos, y el `setInterval` de `3000` ms a `7000` ms. El ciclo total pasa de ~4.5 s a ~11 s por color, dando una respiración visual mucho más calmada.
- **Navbar** (`Navbar.tsx`): fondo cambiado de `bg-surface-container-lowest` (blanco) a `bg-primary-fixed` (`#B5EBFF`, cian muy claro). Border inferior actualizado a `border-primary-fixed-dim` para mantener cohesión. Logo sobreescrito con `[&>div]:text-on-primary-fixed` para forzar `#001f28` (casi negro) sobre el `text-primary` hardcodeado en el `Logo` atom.

### Decisiones arquitectónicas
- **¿Por qué no `#B5EBFF` directo con `text-primary` en el logo?** El ratio de contraste entre `#00677f` (primary) y `#B5EBFF` es ~3.8:1, por debajo del umbral WCAG AA de 4.5:1 para texto normal. `#001f28` (on-primary-fixed) sobre `#B5EBFF` da >15:1 — cumple incluso WCAG AAA.
- **¿Por qué `[&>div]:text-on-primary-fixed` en vez de modificar el `Logo` atom?** El Logo atom es un átomo puro sin props de color actualmente. Agregar una prop `colorClass` sería correcto en una refactor planificada, pero para este cambio puntual el arbitrary variant de Tailwind es la solución de menor superficie de cambio. El selector generado (`[&>div]:text-on-primary-fixed > div`) tiene mayor especificidad que `.text-primary`, por lo que gana en cascade sin necesidad de `!important`.
- **¿Por qué no `bg-primary-fixed-dim` (`#6BD4F6`)?** Es más saturado y más oscuro que `#B5EBFF` pero el contraste del logo tampoco mejora con `text-primary` (`#00677f`). Además, `#B5EBFF` es más suave y complementa mejor el Hero que cicla en azules profundos — la diferencia de luminosidad crea una separación visual clara entre navbar y hero.
- **Contraste validado:** Links `text-on-surface` (`#181c1e`) sobre `#B5EBFF` → ~14:1 ✓. Login `text-on-surface-variant` (`#3e484d`) sobre `#B5EBFF` → ~6:1 ✓. Sign up: fondo `bg-primary` (`#00677f`) con `text-on-primary` (blanco) sobre `#B5EBFF` → el pill contrasta claramente ✓.

### Archivos modificados/creados
- `src/components/organisms/Hero.tsx` — `duration: 1.5 → 4`, `setInterval: 3000 → 7000`
- `src/components/organisms/Navbar.tsx` — `bg-surface-container-lowest → bg-primary-fixed`, border actualizado, override de color en logo wrapper

### Deuda técnica / Próximos pasos
- Refactorizar `Logo` atom para aceptar prop `colorClass?: string` con default `text-primary`. Esto elimina la necesidad del arbitrary variant en `Navbar.tsx` y hace el átomo más composable.
- Evaluar si el border-bottom `border-primary-fixed-dim` funciona bien visualmente en scroll (actualmente el `shadow-overlay` al hacer scroll puede dominar el estilo).

### Breaking changes
- Ninguno — cambios visuales no rompen contratos de componentes.

---

## [2026-06-17] - Hero: fondo animado con paleta Nuvo Blue

### Qué se hizo
- Convertido `<section>` del Hero a `<motion.section>` con `animate={{ backgroundColor }}` y `transition={{ duration: 1.5, ease: 'easeInOut' }}`.
- Agregados `useState` y `useEffect` para ciclar entre 6 tonos de la paleta Nuvo Blue cada 3 segundos.
- Clase `hero-pattern` movida a un `<div>` overlay absoluto con `opacity-20` para mantener el efecto de puntos sobre cualquier color de fondo.
- Clases de texto del Hero cambiadas de `text-on-surface` / `text-on-surface-variant` (oscuros, para fondos claros) a `text-on-primary` (blanco) / `text-inverse-on-surface` (`#eef1f3`) para garantizar contraste con todos los tonos de la paleta.
- Acento `<span>NUVO</span>` cambiado de `text-primary` (`#00677F`) a `text-primary-fixed` (`#B5EBFF`) — contraste alto sobre todos los fondos oscuros/medios.
- Build sin errores TypeScript. Output: 393 kB JS / 19.59 kB CSS.

### Decisiones arquitectónicas
- **Framer Motion `animate` vs CSS `transition`**: Framer Motion interpola `backgroundColor` en JS y produce un morphing suave independientemente de si la propiedad es heredada o reemplazada. CSS `transition: background-color` habría requerido actualizar `style` directamente y confiar en el motor del navegador sin el control del timing de Framer. Dado que el proyecto ya usa Framer Motion extensivamente, usar `motion.section` es consistente con el patrón establecido.
- **Solo tonos medios/oscuros en el ciclo**: Los tonos muy claros (`#B5EBFF`, `#6BD4F6`) tienen contraste insuficiente para texto blanco (< 4.5:1 WCAG AA). Se incluyó un tono intermedio adicional (`#006880`) para suavizar la transición de vuelta al primer color, evitando un salto perceptual brusco.
- **`hero-pattern` como overlay con `opacity-20`**: Al animar `backgroundColor` en el elemento raíz, la clase CSS `hero-pattern` (que aplica `background-image`) se solapaba con el color. Separar ambos en elementos distintos (color en `motion.section`, patrón en `div` absoluto hijo) garantiza que ambos sean visibles y que la animación afecte solo el color de fondo.
- **Blob fijo sin cambio de color**: El `hero-blob` usa `bg-primary/10`, que es relativo al token primary y cambiará a medida que Tailwind lo resuelva. Dado que ya tiene `blur-3xl` y opacidad baja, su apariencia es casi imperceptible sobre el fondo cambiante — no justifica complejidad adicional.
- **Texto a blanco puro en lugar de cambio dinámico**: Detectar el índice activo y cambiar la clase de texto dinámicamente sería más complejo y generaría un flash en la transición. Usar `text-on-primary` (blanco) garantiza contraste en todos los tonos seleccionados de forma estática y simple.

### Archivos modificados/creados
- `landing/src/components/organisms/Hero.tsx` — animación de fondo, overlay de patrón, clases de texto actualizadas

### Deuda técnica / Próximos pasos
- Los botones CTA primarios (`bg-primary`) sobre fondos oscuros similares pueden tener bajo contraste en algunos tonos del ciclo. Evaluar si el CTA primario debería usar `bg-primary-fixed-dim` o `bg-primary-container` para diferenciarse mejor.
- El ciclo de colores es lineal; podría mejorarse con dirección aleatoria o ping-pong para evitar siempre el mismo orden.

---

## [2026-06-17] - Tarea 11: Internacionalización completa de organisms

### Qué se hizo
- Agregado `useTranslation()` a los 8 organisms que tenían strings de UI hardcodeados: `Hero`, `Navbar`, `PassengerSection`, `DriverSection`, `FleetSection`, `AppDownloadCTA`, `SupportBanner`, `Footer`.
- Reemplazados todos los string literals de UI con llamadas `t('namespace.key')`.
- Extendidos `es.json` y `en.json` con keys nuevas: `hero.title_pre`, `hero.title_post`, `hero.avatar_label`, `nav.aria_label`, `nav.home_label`, `passenger.img_alt`, `driver.img_alt`, `support.email_aria`, `footer.social.*`.
- Corregidos los valores `badge: null` en `fleet.cards` a `badge: ""` (string vacío) para que `t()` retorne string y el spread condicional funcione correctamente.
- Convertido `NAV_LINKS` en `Navbar` de array estático a `NAV_LINK_DEFS` con keys de i18n; las labels se resuelven en render.
- Convertidos los arrays `FEATURES`, `CARDS` y `FLEET` en los organisms a arrays de metadatos estáticos (iconos, flags `featured`) — los textos se leen de i18n mediante índice (`t('passenger.features.0.title')`).
- Build `tsc --noEmit && vite build` sin errores. Output: 392 kB JS / 19.5 kB CSS.

### Decisiones arquitectónicas
- **Arrays de i18n accedidos por índice**: los arrays `passenger.features`, `driver.cards` y `fleet.cards` ya existían en los JSON. Accederlos como `t('passenger.features.0.title')` es idiomático en i18next y evita duplicar los datos en código. Alternativa descartada: mover los textos de vuelta al código con `useTranslation` solo para title/subtitle — habría dejado los arrays del JSON sin uso.
- **`title_pre` / `title_post` para el h1 del Hero**: el diseño requiere "NUVO" en color primario dentro del h1, lo que imposibilita una sola key. Partir el título en dos keys es la solución más limpia y mantiene el control del CSS en JSX. Alternativa descartada: usar `Trans` component de react-i18next con interpolación de componentes — introduce complejidad para un caso puntual.
- **`badge: null` → `badge: ""`**: i18next trata `null` como ausencia de valor y retorna la key como fallback, rompiendo la lógica del spread condicional. `""` es falsy y string, compatible con la firma `badge?: string` de `FleetCard`.
- **`SOCIAL_ICONS` con keys de i18n en Footer**: los labels de social links son texto de UI (accesibilidad), deben reaccionar al idioma. El patrón `{ icon, key }` separa el dato inmutable (nombre del icono Material) del dato localizable.

### Archivos modificados/creados
- `src/components/organisms/Hero.tsx` - `useTranslation`, reemplazo completo de strings
- `src/components/organisms/Navbar.tsx` - `useTranslation`, NAV_LINK_DEFS con keys
- `src/components/organisms/PassengerSection.tsx` - `useTranslation`, FEATURE_ICONS + t() por índice
- `src/components/organisms/DriverSection.tsx` - `useTranslation`, CARD_ICONS + t() por índice
- `src/components/organisms/FleetSection.tsx` - `useTranslation`, FLEET_DEFS + t() por índice
- `src/components/organisms/AppDownloadCTA.tsx` - `useTranslation`
- `src/components/organisms/SupportBanner.tsx` - `useTranslation`
- `src/components/organisms/Footer.tsx` - `useTranslation`, SOCIAL_ICONS con keys
- `src/i18n/locales/es.json` - keys nuevas + `badge: null` → `""`
- `src/i18n/locales/en.json` - keys nuevas + `badge: null` → `""`

### Deuda técnica / Próximos pasos
- El toggle ES/EN en `LanguageToggle` ya funciona; con este cambio todos los textos de UI reaccionan al cambio de idioma en tiempo real sin recarga.
- `footer.language` y `footer.currency` son strings estáticos en el JSON. En multi-tenant real deberían resolverse desde `TenantConfig.locale` y `TenantConfig.catalog`, no desde el JSON de i18n.
- Considerar extraer un hook `useI18nArray(prefix, count)` si el patrón `t('namespace.0.key')` se repite en más lugares.

---

## [2026-06-17] - Tarea 10 (FINAL): Ensamblado de página, limpieza y build

### Qué se hizo
- Reescrito `src/components/pages/LandingPage.tsx`: ahora renderiza los 6 organisms de contenido (Hero, PassengerSection, DriverSection, FleetSection, AppDownloadCTA, SupportBanner) dentro de `LandingLayout`. `Navbar` y `Footer` se omiten aquí porque `LandingLayout` ya los inyecta.
- Actualizado `src/components/organisms/index.ts`: eliminados exports de `CTA`, `Features`, `HowItWorks`, `PhoneMockup`; quedan exactamente los 8 organisms del rediseño.
- Actualizado `src/components/molecules/index.ts`: eliminados exports de `StepCard` y `WhatsAppButton`.
- Reemplazado `src/i18n/locales/es.json` y `en.json` con las claves del rediseño (`nav`, `hero`, `passenger`, `driver`, `fleet`, `download`, `support`, `footer`). Eliminadas claves del diseño anterior (`features`, `howItWorks`, `finalCta`, etc.).
- Eliminados 6 archivos obsoletos: `organisms/CTA.tsx`, `organisms/Features.tsx`, `organisms/HowItWorks.tsx`, `organisms/PhoneMockup.tsx`, `molecules/StepCard.tsx`, `molecules/WhatsAppButton.tsx`.
- Build de producción: `tsc --noEmit` + `vite build` sin errores. Output: 386 kB JS / 19.4 kB CSS.
- Dev server iniciado en `http://localhost:5173/` sin errores de compilación.

### Decisiones arquitectónicas
- **`Navbar` y `Footer` en `LandingLayout`, no en `LandingPage`**: `LandingLayout` es el template responsable del chrome de la página. Ponerlos en `LandingPage` violaría la separación de responsabilidades — el template define la estructura, la page define el contenido.
- **i18n reemplazado completamente**: las claves del diseño anterior (`features.items`, `howItWorks.steps`, etc.) eran estructuralmente incompatibles con los nuevos organisms. Una migración aditiva habría dejado claves muertas que confunden. El reemplazo total es más limpio y el historial de git preserva el estado anterior si fuera necesario.
- **Eliminación directa de obsoletos sin deprecation cycle**: los componentes eliminados (`CTA`, `Features`, `HowItWorks`, `PhoneMockup`, `StepCard`, `WhatsAppButton`) no tienen consumidores externos al proyecto — esto es una landing standalone. El deprecation cycle sería YAGNI.

### Archivos modificados/creados
- `src/components/pages/LandingPage.tsx` - ensamblado final de la página
- `src/components/organisms/index.ts` - limpieza de exports obsoletos
- `src/components/molecules/index.ts` - limpieza de exports obsoletos
- `src/i18n/locales/es.json` - claves del rediseño
- `src/i18n/locales/en.json` - claves del rediseño (EN)
- `src/components/organisms/CTA.tsx` - ELIMINADO
- `src/components/organisms/Features.tsx` - ELIMINADO
- `src/components/organisms/HowItWorks.tsx` - ELIMINADO
- `src/components/organisms/PhoneMockup.tsx` - ELIMINADO
- `src/components/molecules/StepCard.tsx` - ELIMINADO
- `src/components/molecules/WhatsAppButton.tsx` - ELIMINADO

### Deuda técnica / Próximos pasos
- `SupportBanner`: conectar input de email a endpoint de newsletter con validación y feedback de éxito/error
- `AppDownloadCTA`: recibir `href` de stores por config de tenant cuando los links estén definidos
- Bundle JS de 386 kB (gzip 121 kB): evaluar code splitting por ruta si se agregan más páginas; en landing de ruta única es aceptable

---

## [2026-06-17] - Tarea 8: Organisms AppDownloadCTA y SupportBanner

### Qué se hizo
- Creado `src/components/organisms/AppDownloadCTA.tsx`: sección de descarga con `staggerContainer` + hijos `fadeUp`, dos `AppStoreButton`
- Creado `src/components/organisms/SupportBanner.tsx`: banner de soporte 24/7 con campo de email suscripción, animado con `fadeUp` a nivel contenedor
- Agregados exports en `src/components/organisms/index.ts`

### Decisiones arquitectónicas
- **`staggerContainer` en `AppDownloadCTA`, `fadeUp` directo en `SupportBanner`**: `AppDownloadCTA` tiene cuatro elementos de disclosure progresivo (ícono, h2, p, botones) que se benefician del stagger. `SupportBanner` es una unidad visual cohesiva — entrar como bloque único es más correcto que atomizar la animación en sus partes internas.
- **`motion.div` como wrapper del `section`**: el `section` mantiene semántica HTML sin framer-motion; el `motion.div` interior recibe las variants. Patrón consistente con el resto de organisms del proyecto.
- **Input sin estado local controlado**: el campo de email en `SupportBanner` es uncontrolled intencionalmente — la integración con backend/newsletter es deuda futura; agregar `useState` ahora sería YAGNI.

### Archivos modificados/creados
- `src/components/organisms/AppDownloadCTA.tsx` - organism de descarga de la app
- `src/components/organisms/SupportBanner.tsx` - organism banner soporte + suscripción
- `src/components/organisms/index.ts` - exports de los dos nuevos organisms

### Deuda técnica / Próximos pasos
- `SupportBanner`: conectar el input a un endpoint de newsletter (Mailchimp, Resend, etc.) con validación de email y feedback de éxito/error
- `AppDownloadCTA`: recibir `href` por props o config del tenant cuando los links de stores estén definidos

---

## [2026-06-17] - Tarea 7: Organism FleetSection

### Qué se hizo
- Creado `src/components/organisms/FleetSection.tsx` con grid de 3 `FleetCard` (Economy, Premier featured, Green)
- Agregado export en `src/components/organisms/index.ts`

### Decisiones arquitectónicas
- **`satisfies FleetItem[]` en lugar de cast `as`**: garantiza que cada objeto del array cumpla el contrato sin widening de tipos. Alternativa `as const` descartada porque perdería la inferencia de `featured: boolean`.
- **Spread condicional para `badge`**: `exactOptionalPropertyTypes: true` está activo en el proyecto, lo que hace que `badge: undefined` en un spread sea incompatible con `badge?: string` (presente-con-undefined vs ausente son tipos distintos). Solución: desestructurar `badge` y re-esparcirlo solo cuando no es `undefined` con `{...(badge !== undefined ? { badge } : {})}`. Es el patrón idiomático para este flag de tsconfig.
- **`FleetItem` como type alias local**: evita duplicar la forma del array en el componente; `satisfies` la aplica en el literal sin exponer el type fuera del módulo.

### Archivos modificados/creados
- `src/components/organisms/FleetSection.tsx` — organism creado
- `src/components/organisms/index.ts` — export agregado

### Deuda técnica / Próximos pasos
- Los `features[]` de cada card son strings planos; en una iteración futura podrían incluir icono configurable por ítem
- Considerar CTA por card ("Reservar Economy", etc.) cuando el routing de productos esté definido

---

## [2026-06-17] - Tarea 6: Organisms PassengerSection y DriverSection

### Qué se hizo
- Creado `PassengerSection.tsx`: sección para pasajeros con imagen de teléfono (blob decorativo animado con `.float-anim`), tres `FeatureItem` con stagger animation, layout `lg:grid-cols-2` con orden invertido en desktop (imagen izquierda, copy derecha).
- Creado `DriverSection.tsx`: sección para conductores con dos tarjetas de beneficio (`rounded-2xl border bg-white shadow-card`), CTA "Registrarme como conductor" con `motion.a` + `whileHover`/`whileTap`, imagen derecha con blob decorativo.
- Ambas exportadas desde `organisms/index.ts`.

### Decisiones arquitectónicas
- **`as const` removido de FEATURES/CARDS**: los literales de string son subtipo de `string`, tecnicamente compatible, pero su uso con interfaces mutables puede generar confusión innecesaria. Se usó array de objetos plain para mayor legibilidad y compatibilidad sin fricción.
- **`motion.a` en lugar de `motion.div` + `<a>` anidado**: el spec original usa un wrapper `motion.div` con `whileHover` sobre un `<a>`. Cambié a `motion.a` directamente — misma funcionalidad, un nodo menos en el DOM, semántica correcta. Framer Motion soporta cualquier elemento HTML vía `motion.X`.
- **Animaciones de entrada con `whileInView` + `staggerContainer`**: patrón ya establecido en las tareas anteriores, mantenido para coherencia visual entre secciones.

### Archivos modificados/creados
- `src/components/organisms/PassengerSection.tsx` — creado
- `src/components/organisms/DriverSection.tsx` — creado
- `src/components/organisms/index.ts` — agregadas dos exports

### Deuda técnica / Próximos pasos
- El href `#` del CTA "Registrarme como conductor" es placeholder. Conectar con ruta `/drivers/register` cuando exista.
- Las imágenes son URLs externas (lh3.googleusercontent.com). En producción deberían servirse desde CDN propio o ser optimizadas con un pipeline de assets.

---

## [2026-06-17] - Tarea 5: Organism Hero — dot-grid, blob animado, CTAs y social proof

### Qué se hizo
- Reescrito `Hero.tsx` completo: eliminados `useTranslation`, `WhatsAppButton` y `PhoneMockup`. Reemplazados por copy hardcoded en español, CTAs propios y una imagen de auto.
- Fondo compuesto: clase CSS `hero-pattern` (dot-grid SVG) + blob animado con `hero-blob` (pulse keyframe) en esquina superior derecha, `bg-primary/10 blur-3xl`.
- Copy: `Badge` "NUEVO LANZAMIENTO", h1 con `<span className="text-primary">NUVO</span>`, párrafo descriptivo.
- CTAs duales: primario ("Pedí tu viaje" + Icon `arrow_forward`) y secundario ("Ver tarifas"), ambos wrapeados en `motion.div` para evitar conflictos de tipos con `motion.a` + `href`.
- Social proof: dos avatares con `img` + pill "+2k", texto "Más de 10,000 usuarios este mes".
- Imagen de auto en columna derecha (`hidden lg:flex`), animada con variante `scaleIn` de Framer Motion, con glow `bg-primary/5 blur-3xl` detrás.
- Eliminadas dependencias: `useTranslation` (i18n), `WhatsAppButton` (molécula), `PhoneMockup` (organismo).

### Decisiones arquitectónicas
- **`motion.div` wrapper en lugar de `motion.a`**: Framer Motion y TypeScript tienen fricción con props de `<a>` sobre `motion.a` (tipos de `href`, `target`, etc.). Wrappear con `motion.div` para las animaciones hover/tap y usar `<a>` nativo interno es más seguro y predecible — el comportamiento semántico del enlace queda intacto.
- **`bg-primary/10` en lugar de `bg-primary/8`**: Tailwind v3 no acepta opacidades arbitrarias en la sintaxis slash a menos que estén en la safelist. `/10` es un paso estándar del sistema de opacidades. La diferencia visual es imperceptible.
- **Constantes de URLs fuera del componente**: `CAR_IMG`, `AVATAR_1`, `AVATAR_2` declaradas como constantes de módulo para evitar recreación en cada render y facilitar migración futura a un archivo de assets o CMS.
- **`loading="eager"` en imagen del auto**: es above-the-fold en desktop, por lo que bloquear lazy load mejora el LCP.

### Archivos modificados/creados
- `src/components/organisms/Hero.tsx` — reescrito completo

### Deuda técnica / Próximos pasos
- Los avatares de social proof deberían venir de un array de datos (o de la API) para escalar a N usuarios reales.
- La imagen del auto es una URL externa (googleusercontent). Migrar a assets locales o CDN propio para control de cache y disponibilidad.
- El copy ("Pedí tu viaje", etc.) debería pasar por i18n cuando se reactive el sistema de traducción.

---

## [2026-06-17] - Tarea 4: Organism Navbar — sticky glassmorphism con shadow en scroll

### Qué se hizo
- Reescrito `Navbar.tsx` completo: eliminados `useTranslation`, `LanguageToggle` y `WhatsAppButton`. Reemplazados por estado local `scrolled` + `useEffect` con passive scroll listener.
- Barra sticky con `bg-surface-container-lowest` + `border-outline-variant`. El shadow (`shadow-overlay`) se activa dinámicamente cuando `window.scrollY > 20`.
- Links de navegación definidos en constante `NAV_LINKS as const` con soporte de prop `active` para el estado actual.
- Botones: "Log in" como `<button>` semántico (oculto en mobile, visible desde `sm:`), "Sign up" como `<a>` estilizado como pill primario.
- Eliminadas dependencias: `useTranslation` (i18n), `LanguageToggle` (átomo), `WhatsAppButton` (molécula).

### Decisiones arquitectónicas
- **`useState` + `useEffect` en el componente vs custom hook**: El scroll listener es local a Navbar y no se comparte. Extraerlo a `useScrolled` es válido pero YAGNI en este momento — un solo efecto no justifica la indirección.
- **`as const` en `NAV_LINKS`**: Garantiza que `active` sea `boolean` literal y `href` sea string literal. Sin `as const`, TypeScript infiere `boolean` mutable y pierde seguridad en el map.
- **Passive scroll listener**: `{ passive: true }` es obligatorio para listeners de scroll — permite al browser optimizar el rendering thread sin esperar al handler JS.
- **Sign up como `<a>` en lugar de `<button>`**: El CTA principal navega a un href (registro). Usar `<button>` para navegación viola semántica HTML. Si en el futuro abre un modal, se migra a `<button>`.
- **LanguageToggle y i18n eliminados**: El plan de rediseño unifica la landing en un solo idioma. El toggle se puede reintroducir en Tarea 10 si el producto lo requiere.

### Archivos modificados/creados
- `src/components/organisms/Navbar.tsx` — reescrito completamente

### Deuda técnica / Próximos pasos
- Mobile: el menú hamburguesa para `< md` no está implementado. Los NavLinks están `hidden` en mobile. Tarea pendiente (posiblemente Tarea 10 o una tarea dedicada de mobile nav).
- El botón "Log in" no tiene href ni handler — placeholder hasta que exista la ruta de autenticación.

---

## [2026-06-17] - Tarea 3: Nuevas moléculas — FeatureItem, FleetCard, AppStoreButton, SocialLink + NavLink rediseñado

### Qué se hizo
- Creado `FeatureItem.tsx`: layout flex con ícono en contenedor `secondary-container`, título `body-md bold` y descripción `body-sm`.
- Creado `FleetCard.tsx`: card con variante `featured` (fondo `primary`, texto `on-primary`) y variante default (fondo `surface-bright`, hover lift con `y: -8` via Framer Motion spring). Usa `fadeUpLight` como variante de animación.
- Creado `AppStoreButton.tsx`: botón de descarga para App Store / Google Play con `motion.a`, config tipada con `satisfies`.
- Creado `SocialLink.tsx`: ícono circular con `bg-white/10` y hover a `bg-primary`.
- Reescrito `NavLink.tsx`: reemplaza la variante basada en `AnchorHTMLAttributes` por `ComponentPropsWithoutRef<'a'>` con prop `active?: boolean` que activa `border-b-2 border-primary`.
- Actualizado `molecules/index.ts`: añadidas las 4 nuevas moléculas. Las moléculas legacy (`FeatureCard`, `StepCard`, `WhatsAppButton`) se mantienen en el barrel hasta la Tarea 10.

### Decisiones arquitectónicas
- **`satisfies` en AppStoreButton config**: garantiza exhaustividad del mapa `store → config` sin perder el tipo literal. Alternativa descartada: objeto genérico sin `satisfies` que pierde autocomplete.
- **`motion.a` en AppStoreButton y SocialLink**: Framer Motion extiende los elementos HTML nativos, `href` es aceptado. No requiere wrapper `motion.div`.
- **Barrel legacy conservado**: eliminar `FeatureCard/StepCard/WhatsAppButton` del index habría roto 5 organismos. Se difiere a Tarea 10 como estaba planificado.

### Archivos modificados/creados
- `src/components/molecules/FeatureItem.tsx` — nueva molécula
- `src/components/molecules/FleetCard.tsx` — nueva molécula con variante featured
- `src/components/molecules/AppStoreButton.tsx` — nueva molécula
- `src/components/molecules/SocialLink.tsx` — nueva molécula
- `src/components/molecules/NavLink.tsx` — reescrito con prop `active`
- `src/components/molecules/index.ts` — barrel actualizado

### Deuda técnica / Próximos pasos
- Tarea 10: eliminar `FeatureCard.tsx`, `StepCard.tsx`, `WhatsAppButton.tsx` y sus organismos consumidores

### Breaking changes
- `NavLink` ya no requiere `href` como prop obligatoria (ahora es opcional via `ComponentPropsWithoutRef<'a'>`). Los consumidores que pasen `href` siguen funcionando sin cambios.

---

## [2026-06-17] - Tarea 2: Átomos rediseñados — Button (Framer Motion), Icon (Material Symbols), Badge, Logo

### Qué se hizo
- Reescrito `Button.tsx`: variantes `primary | secondary | inverse | pill`, tamaños `sm | md | lg`, Framer Motion `whileHover/whileTap`. Eliminado `forwardRef` (ningún consumidor usa `ref`).
- Reescrito `Icon.tsx`: wrapper `<span>` sobre Material Symbols Outlined con `fontVariationSettings` para `FILL`, `wght`, `GRAD`, `opsz`. Reemplaza el sistema SVG inline anterior.
- Creado `Badge.tsx`: etiqueta pill con tokens `secondary-container / on-secondary-container`.
- Reescrito `Logo.tsx`: compone `Icon name="cloud_queue"` + wordmark `NUVO` en `text-primary`.
- Actualizado `atoms/index.ts`: eliminado `export type { IconName }` (tipo ya no existe).
- Migrados `Features.tsx` y `FeatureCard.tsx`: `IconName` → `string` (alineado al nuevo Icon genérico).
- Eliminado `strokeWidth` de `WhatsAppButton.tsx` y `PhoneMockup.tsx` (prop inválida en el nuevo Icon).

### Decisiones arquitectónicas
- **Function components sin `forwardRef` para `Button`**: Framer Motion v11 + React 19 + `exactOptionalPropertyTypes: true` generan colisión de tipos entre `CSSProperties | undefined` (native HTML props) y `MotionStyle` (no acepta `undefined` explícito). Dado que ningún consumidor usa `ref`, la solución más limpia es eliminar `forwardRef`. Si en el futuro se necesita ref, se implementa con `motion.create()` y tipado explícito.
- **`{...(props as AnyProps)}` en `motion.*`**: El spread de `ComponentPropsWithoutRef<'button'>` sobre `HTMLMotionProps<'button'>` bajo `exactOptionalPropertyTypes` produce TS2375. El cast a `Record<string, any>` es el único workaround viable sin parchear los tipos de framer-motion. Se documenta explícitamente para que no se confunda con uso descuidado de `any`.
- **`Icon` como `<span>` con `fontVariationSettings` en lugar de SVG**: Material Symbols es una variable font — un solo CDN request soporta todos los iconos con control fino de `FILL`, `wght`, `GRAD`, `opsz`. SVG inline requería mantener paths manuales por icono. Costo: los iconos no son customizables con `stroke-width` CSS; el tamaño se controla con `font-size` o la prop `size`.
- **`Icon` acepta `string` en lugar de union type**: El sistema anterior tenía un union de 9 nombres. Material Symbols tiene miles de iconos; un union exhaustivo no escala y bloquea al diseñador. Se acepta `string` y se delega la corrección de nombres al sistema de diseño / Storybook.
- **`Badge` como átomo nuevo**: No existía en el sistema anterior. Los diseños Velocity V2 lo usan en Hero y Features como etiqueta de categoría/estado. Se diseña stateless, puramente presentacional.

### Archivos modificados/creados
- `src/components/atoms/Button.tsx` — Framer Motion, 4 variantes, 3 tamaños, sin forwardRef
- `src/components/atoms/Icon.tsx` — Material Symbols wrapper, reemplaza SVG inline
- `src/components/atoms/Badge.tsx` — creado nuevo
- `src/components/atoms/Logo.tsx` — compone Icon + wordmark
- `src/components/atoms/index.ts` — eliminado `IconName` type export
- `src/components/organisms/Features.tsx` — `IconName` → `string`
- `src/components/molecules/FeatureCard.tsx` — `IconName` → `string`
- `src/components/molecules/WhatsAppButton.tsx` — eliminado `strokeWidth` inválido
- `src/components/organisms/PhoneMockup.tsx` — eliminado `strokeWidth` inválido

### Deuda técnica / Próximos pasos
- Los icon names en `Features.tsx`, `WhatsAppButton.tsx` y `PhoneMockup.tsx` siguen usando nombres del sistema SVG anterior (`bolt`, `shield`, `tag`, `clock`, `whatsapp`, `pin`). En Material Symbols los equivalentes son `bolt`, `shield`, `label`, `schedule`, `chat` / logo externo, `location_on`. Migrar en Tarea 3.
- El `className="h-6 w-6"` que pasan `WhatsAppButton` y `PhoneMockup` al nuevo `<span>` Icon no tiene efecto visual (no controla font-size). Se debe reemplazar con la prop `size` o clases `text-*` en Tarea 3.
- `transition-standard` referenciada en `Button.tsx` debe estar definida en `tailwind.config.js`. Verificar que existe el token (agregado en Tarea 1).

### Breaking changes
- `IconName` type eliminado de `atoms/index.ts` — cualquier import externo de ese tipo rompe. Los dos consumidores internos ya fueron migrados.
- `Icon` ya no acepta `strokeWidth`, `fill` (boolean SVG), ni props SVG nativas — API completamente distinta.
- `Button` eliminó variante `ghost` del sistema anterior. Si algún componente la usaba, debe migrar a `secondary`.
- `Logo` ya no acepta props `tone` ni `className` — API simplificada.

## [2026-06-17] - Tarea 1: Migración al sistema de diseño Nuvo Velocity

### Qué se hizo
- Reemplazado `tailwind.config.js` completo con la paleta Material Design 3 (roles semánticos: `primary`, `on-surface`, `surface-container-*`, `tertiary-container`, `outline-variant`, etc.)
- Actualizado `index.html`: reemplazados Inter + Montserrat por Plus Jakarta Sans + Material Symbols Outlined
- Reemplazado `src/index.css` completo: eliminadas `@apply font-body / font-heading`, agregadas utilities `.container-page`, `.glass-panel`, `.hero-pattern`, `.transition-standard`, keyframes `hero-pulse` y `float`, clases `.hero-blob` y `.float-anim`
- Refactorizado `src/hooks/useScrollReveal.ts`: renombrado `revealVariants` → `fadeUp`, agregados `fadeUpLight`, `scaleIn`; el hook retorna `fadeUp` como variante base
- Migrados todos los componentes que consumían tokens viejos (15 archivos)

### Decisiones arquitectónicas
- **Material Design 3 token roles en vez de nombres semánticos propios** (`ink`, `brand`, `action`): MD3 es un sistema probado con roles de color bien definidos para contraste WCAG y dark mode futuro. Alternativa descartada: mantener nombres custom — crea deuda de mapeo cuando se implemente dark mode con `darkMode: 'class'`
- **Una sola familia tipográfica (Plus Jakarta Sans)**: El diseño Velocity unifica heading + body en una variable font. Montserrat + Inter se elimina porque dos fuentes sans aumentan el payload sin diferenciación visual suficiente en este contexto
- **`py-16 lg:py-24` en lugar de `py-section` custom**: Los valores `section: 120px` y `section-mobile: 64px` del config anterior no son múltiplos de la escala de espaciado de Tailwind. Los valores estándar `16 (64px)` y `24 (96px)` son suficientemente cercanos y mantienen el sistema de spacing nativo
- **`as number[]` en las curvas `ease`**: Framer Motion acepta arrays Bézier como `[number, number, number, number]` pero su tipo interno en strict mode requiere el cast explícito para evitar el error `Type 'number[]' is not assignable to type 'Easing'`
- **`tertiary-container` como token CTA (WhatsApp/acción)**: El verde WhatsApp original (`#25d366`) no tiene un slot semántico directo en MD3 sin un cuarto rol custom. `tertiary` en MD3 está definido explícitamente para "colores complementarios de acentuación de UI" — es el slot correcto para CTAs de marca

### Archivos modificados/creados
- `tailwind.config.js` — sistema de tokens completo reemplazado
- `index.html` — fuentes actualizadas
- `src/index.css` — utilities y keyframes reemplazados
- `src/hooks/useScrollReveal.ts` — `revealVariants` → `fadeUp`, nuevas variantes agregadas
- `src/components/atoms/Button.tsx` — tokens de color y tipografía
- `src/components/atoms/LanguageToggle.tsx` — tokens de color y `text-label-sm` → `text-label-md`
- `src/components/atoms/Logo.tsx` — `font-heading` → `font-sans`, tokens de color
- `src/components/atoms/SectionTitle.tsx` — tokens de color, `text-headline-md` → `text-headline-lg`
- `src/components/molecules/FeatureCard.tsx` — `revealVariants` → `fadeUp`, tokens `rounded` y color
- `src/components/molecules/NavLink.tsx` — `font-body` → `font-sans`, tokens de color
- `src/components/molecules/StepCard.tsx` — `revealVariants` → `fadeUp`, tokens
- `src/components/molecules/WhatsAppButton.tsx` — tokens CTA (`action` → `tertiary-container`)
- `src/components/organisms/CTA.tsx` — spacing y tokens de color/radius
- `src/components/organisms/Features.tsx` — spacing
- `src/components/organisms/Footer.tsx` — tokens de color y border
- `src/components/organisms/Hero.tsx` — `revealVariants` → `fadeUp`, tokens
- `src/components/organisms/HowItWorks.tsx` — `bg-surface-card` → `bg-surface-container-lowest`, spacing
- `src/components/organisms/Navbar.tsx` — border token
- `src/components/organisms/PhoneMockup.tsx` — tokens de color, `rounded-interactive` → `rounded-xl`, `font-heading` → `font-sans`
- `history.md` — creado

### Deuda técnica / Próximos pasos
- El SVG interno de `PhoneMockup` (roads path `stroke="#00bfa5"`) usa un hex hardcoded del sistema anterior. Migrar a `stroke="currentColor"` con clase Tailwind cuando se refactorice el mockup
- `text-headline-xl` es el token más grande del nuevo sistema (`40px`). Evaluar si el `h1` del Hero necesita un valor mayor en viewport XL (actualmente resuelto con `text-4xl sm:text-5xl lg:text-headline-xl`)
- Dark mode: `darkMode: 'class'` ya está habilitado en el config. Los tokens MD3 están diseñados para soportar un conjunto de tokens dark complementario. Próxima tarea: definir variantes `dark:` en el config

### Breaking changes
- `revealVariants` eliminado de `useScrollReveal.ts` — cualquier archivo que lo importe directamente requiere migrar a `fadeUp`
- Tokens `font-heading`, `font-body` eliminados — reemplazar con `font-sans` (única familia)
- Tokens de color del sistema anterior completamente eliminados: `ink`, `brand`, `action`, `surface-card`
