import { useEffect, useRef } from "react";

/**
 * Very subtle scroll-linked drift. `strength` is the fraction of the viewport
 * height the element travels as it crosses the screen (0.06 = ~±27px at 900px).
 * rAF-throttled, passive, transform-only; disabled under reduced motion.
 * The element should sit inside an `overflow-hidden` box and overshoot it
 * vertically (see `.parallax-bleed`) so the drift never exposes an edge.
 */
export function useParallax<T extends HTMLElement>(strength = 0.06) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      // -0.5 … 0.5 while the element's centre crosses the viewport.
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(-progress * strength * vh).toFixed(1)}px, 0)`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return ref;
}
