import { useEffect, useRef, type CSSProperties } from "react";
import { clamp, gsap, lerp, prefersReduced, ScrollTrigger } from "../lib/motion";
import { Kit } from "./art";

/**
 * The first-aid kit that travels through the page.
 *
 * It is a single fixed element whose position / size / 3D rotation is a pure
 * function of the scroll position, interpolated between "stops" in the DOM:
 *
 *   hero fence → (tumbles) → basket … CTA (pops up) → hovers through the
 *   pinned services section → (tumbles) → lands in the night scene.
 *
 * Whenever the kit rests on a stop we hand over to a static copy rendered
 * inside that stop, so it stays perfectly glued to the page while scrolling.
 */

type Pt = { x: number; y: number; s: number };
type Metrics = {
  vh: number;
  hero: Pt;
  basket: Pt;
  footer: Pt;
  hover: Pt;
  s1: number;
  sIn0: number;
  sIn1: number;
  sOut0: number;
  sMax: number;
  spin: number;
  ry4: number;
  ryEnd: number;
};

const BASE = 120; // px, matches .traveler__pos font-size
const REST = [-14, -32, 0]; // rotateX / rotateY / rotateZ of a resting kit (see .kit in CSS)
const IN_BASKET = [-18, 24, -14]; // see .stop--basket .kit

const easeIO = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeIOCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);

const stop = (name: string) => document.querySelector<HTMLElement>(`[data-stop="${name}"]`);

function centerOf(el: HTMLElement): Pt {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY, s: r.width };
}

export function KitStop({
  name,
  className = "",
  style,
  docked = false,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
  docked?: boolean;
}) {
  return (
    <div data-stop={name} data-docked={docked ? "1" : "0"} className={`stop ${className}`} style={style}>
      <span className="stop__in block">
        <Kit />
      </span>
    </div>
  );
}

export function Traveler() {
  const pos = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const node = pos.current;
    const kit = node?.firstElementChild as HTMLElement | null;
    if (!node || !kit) return;

    let m: Metrics | null = null;
    const stops = { hero: stop("hero"), basket: stop("basket"), footer: stop("footer") };
    const initial = {
      hero: stops.hero?.dataset.docked,
      basket: stops.basket?.dataset.docked,
      footer: stops.footer?.dataset.docked,
    };
    const docked: Record<string, boolean | undefined> = {};
    const dock = (key: keyof typeof stops, on: boolean) => {
      if (docked[key] === on) return;
      docked[key] = on;
      const el = stops[key];
      if (el) el.dataset.docked = on ? "1" : "0";
    };

    const measure = () => {
      const enter = document.querySelector<HTMLElement>("[data-kit-enter]");
      const hoverZone = document.querySelector<HTMLElement>("[data-kit-hover]");
      if (!stops.hero || !stops.basket || !stops.footer || !enter || !hoverZone) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sy = window.scrollY;
      const basket = centerOf(stops.basket);
      const enterTop = enter.getBoundingClientRect().top + sy;
      const hz = hoverZone.getBoundingClientRect();
      const sOut0 = hz.top + sy + hz.height - vh;
      const sIn1 = enterTop + vh * 0.06;
      const spin = 360 / (vh * 1.7);
      const ry4 = REST[1] + (sOut0 - sIn1) * spin;
      m = {
        vh,
        hero: centerOf(stops.hero),
        basket,
        footer: centerOf(stops.footer),
        hover: { x: vw / 2, y: vh * 0.84, s: clamp(92, 168, vw * 0.105) },
        s1: Math.max(2, basket.y - vh * 0.56),
        sIn0: enterTop - vh * 0.5,
        sIn1,
        sOut0,
        sMax: Math.max(sOut0 + 2, document.documentElement.scrollHeight - vh),
        spin,
        ry4,
        ryEnd: REST[1] + 360 * Math.ceil((ry4 - REST[1] + 200) / 360),
      };
    };

    let lastT = "";
    let lastR = "";
    let shown = false;

    const frame = () => {
      if (!m) return;
      const sc = window.scrollY;
      const bob = Math.sin(performance.now() / 650) * 6;
      let vis = true;
      let x = 0;
      let y = 0;
      let s = BASE;
      let rx = 0;
      let ry = 0;
      let rz = 0;

      const atEnd = sc >= m.sMax - 1.5;
      dock("hero", sc <= 1);
      dock("basket", sc >= m.s1);
      dock("footer", atEnd);

      if (sc <= 1 || atEnd) {
        vis = false;
      } else if (sc < m.s1) {
        // 1 — knocked off the fence, tumbling into the basket
        const p = sc / m.s1;
        const e = easeIO(p);
        const arc = Math.sin(Math.PI * p);
        x = lerp(m.hero.x, m.basket.x, easeIOCubic(p));
        y = lerp(m.hero.y, m.basket.y, p) - sc - arc * m.vh * 0.14;
        s = lerp(m.hero.s, m.basket.s, e) * (1 + 0.18 * arc);
        rx = lerp(REST[0], IN_BASKET[0] + 360, e);
        ry = lerp(REST[1], IN_BASKET[1] + 360, e);
        rz = lerp(REST[2], IN_BASKET[2], e) + arc * 18;
      } else if (sc < m.sIn0) {
        vis = false;
      } else if (sc < m.sIn1) {
        // 3 — pops up from below as the call-to-action arrives
        const p = (sc - m.sIn0) / (m.sIn1 - m.sIn0);
        const e = easeOutCubic(p);
        x = m.hover.x;
        y = lerp(m.vh + m.hover.s, m.hover.y, easeOutBack(p)) + bob * p;
        s = m.hover.s * lerp(0.7, 1, e);
        rx = lerp(200, REST[0], e);
        ry = lerp(-300, REST[1], e);
        rz = lerp(40, REST[2], e);
      } else if (sc < m.sOut0) {
        // 4 — hovers and spins with the scroll
        x = m.hover.x;
        y = m.hover.y + bob;
        s = m.hover.s;
        ry = REST[1] + (sc - m.sIn1) * m.spin;
        const turn = ((ry - REST[1]) * Math.PI) / 180;
        rx = REST[0] + Math.sin(turn) * 7;
        rz = Math.sin(turn / 2) * 5;
      } else {
        // 5 — tumbles down and lands in front of the shop at night
        const p = clamp(0, 1, (sc - m.sOut0) / (m.sMax - m.sOut0));
        const e = easeIOCubic(p);
        const turn = ((m.ry4 - REST[1]) * Math.PI) / 180;
        x = lerp(m.hover.x, m.footer.x, e);
        y = lerp(m.hover.y, m.footer.y - sc, e) - Math.sin(Math.PI * p) * m.vh * 0.08 + bob * (1 - p);
        s = lerp(m.hover.s, m.footer.s, e);
        rx = lerp(REST[0] + Math.sin(turn) * 7, REST[0] + 360, e);
        ry = lerp(m.ry4, m.ryEnd, e);
        rz = lerp(Math.sin(turn / 2) * 5, REST[2], e);
      }

      if (vis !== shown) {
        shown = vis;
        node.style.visibility = vis ? "visible" : "hidden";
      }
      if (!vis) return;
      const t = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${(s / BASE).toFixed(4)})`;
      const r = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
      if (t !== lastT) node.style.transform = lastT = t;
      if (r !== lastR) kit.style.transform = lastR = r;
    };

    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    window.addEventListener("resize", measure);
    gsap.ticker.add(frame);

    return () => {
      gsap.ticker.remove(frame);
      ScrollTrigger.removeEventListener("refresh", measure);
      window.removeEventListener("resize", measure);
      (Object.keys(stops) as (keyof typeof stops)[]).forEach((key) => {
        const el = stops[key];
        if (el && initial[key] !== undefined) el.dataset.docked = initial[key];
      });
    };
  }, []);

  return (
    <div className="traveler" aria-hidden>
      <div ref={pos} className="traveler__pos">
        <Kit />
      </div>
    </div>
  );
}
