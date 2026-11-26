import { useRef, type ComponentType, type CSSProperties } from "react";
import { attachSwing, gsap, map, MOTION_OK, ScrollTrigger, useGsap } from "../lib/motion";
import { Mask, Oximeter, PillBottle, Plaster, Stethoscope, Tensimeter, Thermometer, Wheelchair } from "../components/art";
import { Button, type Topic } from "../components/ui";

type Item = { art: ComponentType<{ className?: string; style?: CSSProperties }>; w: number; r: number } | null;

const TOP: Item[] = [
  { art: Wheelchair, w: 13, r: -10 },
  { art: PillBottle, w: 9, r: 12 },
  { art: Mask, w: 11, r: -6 },
  { art: Stethoscope, w: 12, r: 16 },
  { art: Thermometer, w: 11, r: -12 },
  { art: Oximeter, w: 11, r: 8 },
  { art: Plaster, w: 15, r: -4 },
];
// the gap in the middle is where the travelling first-aid kit pops up
const BOTTOM: Item[] = [
  { art: Tensimeter, w: 12, r: 8 },
  { art: Plaster, w: 16, r: -8 },
  { art: Stethoscope, w: 11, r: 12 },
  null,
  { art: PillBottle, w: 10, r: -10 },
  { art: Wheelchair, w: 13, r: 6 },
  { art: Mask, w: 11, r: -8 },
];

function Row({ items, edge }: { items: Item[]; edge: "top" | "bottom" }) {
  return (
    <div
      data-row={edge}
      className={`absolute left-[-7%] flex w-[114%] justify-between will-change-transform ${
        edge === "top" ? "top-0 items-start" : "bottom-0 items-end"
      }`}
    >
      {items.map((it, i) =>
        it ? (
          <it.art
            key={i}
            className={`h-auto flex-none ${i === 1 || i === 5 ? "max-sm:hidden" : ""}`}
            style={{
              width: `clamp(64px, ${it.w}vw, ${it.w * 13}px)`,
              transform: `translateY(${edge === "top" ? -36 : 36}%) rotate(${it.r}deg)`,
            }}
          />
        ) : (
          <span key={i} className="w-[18%] flex-none" />
        ),
      )}
    </div>
  );
}

export function StartNow({ onContact }: { onContact: (t: Topic) => void }) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".line"));
    const top = el.querySelector<HTMLElement>("[data-row='top']");
    const bottom = el.querySelector<HTMLElement>("[data-row='bottom']");
    const offSwing = attachSwing(lines);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const drift = (p: number) => {
        if (top) top.style.transform = `translate3d(${map(0, 1, -5, 5, p).toFixed(3)}%,0,0)`;
        if (bottom) bottom.style.transform = `translate3d(${map(0, 1, 5, -5, p).toFixed(3)}%,0,0)`;
      };
      drift(0);
      ScrollTrigger.create({ trigger: el, start: "top bottom", end: "bottom top", onUpdate: (s) => drift(s.progress) });
      return () => {
        if (top) top.style.transform = "";
        if (bottom) bottom.style.transform = "";
      };
    });

    return () => {
      offSwing();
      mm.revert();
    };
  });

  return (
    <section id="mulai" ref={root} data-kit-enter className="relative flex h-screen min-h-[640px] bg-brand text-pine">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <Row items={TOP} edge="top" />
        <Row items={BOTTOM} edge="bottom" />
      </div>

      <div className="wrap relative z-[2] m-auto pt-[5vh] pb-[21vh] text-center">
        <h2 className="display d-2 swing-lines">
          <span className="line">
            <span className="line-inner">Pesan hari ini,</span>
          </span>
          <span className="line">
            <span className="line-inner">siap pakai</span>
          </span>
          <span className="line">
            <span className="line-inner">besok.</span>
          </span>
        </h2>
        <div className="mt-[clamp(26px,3vw,48px)] flex justify-center min-[821px]:mt-[5.6vw]">
          <Button label="Saya mau dihubungi" variant="light" onClick={() => onContact("kontak")} />
        </div>
      </div>
    </section>
  );
}
