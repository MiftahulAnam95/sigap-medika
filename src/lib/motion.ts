import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";
import { useLayoutEffect, type DependencyList } from "react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
// phones: don't re-measure everything each time the address bar slides in or out
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

/* ------------------------------------------------------------------ */
/* Math helpers                                                        */
/* ------------------------------------------------------------------ */
export const map = (inMin: number, inMax: number, outMin: number, outMax: number, v: number) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
export const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ------------------------------------------------------------------ */
/* Media conditions                                                    */
/* ------------------------------------------------------------------ */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const DESKTOP = `(min-width: 821px) and ${MOTION_OK}`;
export const MOBILE = `(max-width: 820.98px) and ${MOTION_OK}`;
export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Smooth scroll (Lenis) + scroll locking                              */
/* ------------------------------------------------------------------ */
let lenis: Lenis | null = null;
let locks = 0;

export const scroller = {
  init() {
    if (prefersReduced()) return () => {};
    const instance = new Lenis({ lerp: 0.1 });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    // prioritised: Lenis must move the page before anything reads scrollY this frame
    gsap.ticker.add(raf, false, true);
    gsap.ticker.lagSmoothing(0);
    if (locks > 0) instance.stop();
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  },
  to(target: string | HTMLElement | number, opts: { offset?: number; duration?: number } = {}) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4), ...opts });
      return;
    }
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (typeof el === "number") window.scrollTo(0, el);
    else if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0));
  },
  lock() {
    locks += 1;
    if (lenis) lenis.stop();
    else document.documentElement.style.overflow = "hidden";
  },
  unlock() {
    locks = Math.max(0, locks - 1);
    if (locks > 0) return;
    if (lenis) lenis.start();
    document.documentElement.style.overflow = "";
  },
};

/* ------------------------------------------------------------------ */
/* React glue                                                          */
/* ------------------------------------------------------------------ */
/** Runs GSAP setup inside a context so every tween / ScrollTrigger is reverted on unmount. */
export function useGsap(setup: () => void | (() => void), deps: DependencyList = []) {
  useLayoutEffect(() => {
    let cleanup: void | (() => void);
    const ctx = gsap.context(() => {
      cleanup = setup();
    });
    return () => {
      if (cleanup) cleanup();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ------------------------------------------------------------------ */
/* Signature animations                                                */
/* ------------------------------------------------------------------ */

/**
 * Scroll-scrubbed 3D swing. `t` is the element's journey through the viewport
 * (0 = entering at the bottom, 1 = leaving at the top). The text rises 300px,
 * while swinging like a door from one side to the other.
 */
export function swing(el: HTMLElement, t: number, offset = 1, range = 1) {
  el.style.opacity = String(clamp(0, 1, map(0, 0.4, 0, 1, t)));
  const y = map(0, 0.45, 300 * range, 0, t);
  const x = map(0, 1, -50 * range, 50, t) * offset;
  const rx = map(0, 1, 15 * range, -15, t) * offset;
  const ry = map(0, 1, -40 * range, 40, t) * offset;
  const rz = map(0, 1, -10 * range, 10, t) * offset;
  el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
}

/** One-shot version used on small screens and for the hero entrance (t: 0 → 1). */
export function swingOnce(el: HTMLElement, t: number) {
  el.style.opacity = String(clamp(0, 1, map(0.1, 0.7, 0, 1, t)));
  const y = clamp(0, 200, map(0, 1, 200, 0, t));
  const rx = clamp(-15, 0, map(0, 1, -15, 0, t));
  const ry = clamp(-70, 0, map(0, 1, -70, 0, t));
  const rz = clamp(0, 20, map(0, 1, 20, 0, t));
  el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
}

/** Scroll-scrubbed media card: rises from the back-left, straightens and grows. */
export function mediaSwing(el: HTMLElement, t: number) {
  const y = map(0, 1, 100, -100, t);
  const z = clamp(-200, 50, map(0, 1, -200, 200, t));
  const x = clamp(-100, 0, map(0, 1, -100, 100, t));
  const ry = clamp(0, 5, map(0, 1, 15, -15, t));
  const rz = clamp(-8, 5, map(0, 1, 5, -5, t));
  const scale = map(0.5, 1, 0.9, 1.15, t);
  el.style.opacity = String(clamp(0, 1, map(0, 0.3, 0, 1, t)));
  el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
}

/** Sticker that tumbles in next to a headline while its number counts up. */
export function stickerSwing(el: HTMLElement, t: number) {
  const y = map(0, 1, 200, -250, t);
  const x = map(0, 1, 0, -50, t);
  const rx = map(0, 1, 10, -10, t);
  const rz = map(0, 1, -50, 40, t);
  const scale = clamp(0, 1, map(0.2, 0.6, 0, 1, t));
  el.style.opacity = String(clamp(0, 1, map(0.2, 0.45, 0, 1, t)));
  el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
}

type SwingOpts = {
  onProgress?: (index: number, t: number) => void;
  /** scrub the entrance only and come to rest (for headings that stay on screen, e.g. the footer) */
  settle?: boolean;
};

/**
 * Wires every `.line` (outer) / `.line-inner` (animated child) pair.
 * Desktop: each line is scrubbed by its own position in the viewport.
 * Mobile: each line plays once when it enters.
 */
export function attachSwing(lines: HTMLElement[], opts: SwingOpts = {}) {
  const inners = lines.map((l) => (l.firstElementChild ?? l) as HTMLElement);
  const reset = () => gsap.set(inners, { clearProps: "transform,opacity" });
  const mm = gsap.matchMedia();

  mm.add(DESKTOP, () => {
    lines.forEach((line, i) => {
      const apply = (t: number) => {
        if (opts.settle) swingOnce(inners[i], t);
        else swing(inners[i], t);
        opts.onProgress?.(i, t);
      };
      apply(0);
      ScrollTrigger.create({
        trigger: line,
        start: "top bottom",
        end: opts.settle ? "top 45%" : "bottom top",
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    });
    return reset;
  });

  mm.add(MOBILE, () => {
    lines.forEach((line, i) => {
      const proxy = { v: 0 };
      const apply = () => {
        swingOnce(inners[i], proxy.v);
        opts.onProgress?.(i, proxy.v);
      };
      apply();
      ScrollTrigger.create({
        trigger: line,
        start: "top 90%",
        once: true,
        onEnter: () => gsap.to(proxy, { v: 1, duration: 0.95, ease: "power2.out", onUpdate: apply }),
      });
    });
    return reset;
  });

  return () => mm.revert();
}

/** Slanted section edges whose angle follows the scroll. */
export function attachEdges(section: HTMLElement, top: HTMLElement | null, bottom: HTMLElement | null) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const apply = (p: number) => {
      const wide = window.innerWidth >= 821;
      if (top) top.style.transform = `skewY(${clamp(-7, 0, map(0, 0.4, 0, wide ? -5 : -6, p)).toFixed(3)}deg)`;
      if (bottom) bottom.style.transform = `skewY(${clamp(-6, 5, map(0.6, 0.9, 0, wide ? 3 : 5, p)).toFixed(3)}deg)`;
    };
    apply(0);
    ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => apply(self.progress),
    });
    return () => {
      if (top) top.style.transform = "";
      if (bottom) bottom.style.transform = "";
    };
  });
  return () => mm.revert();
}
