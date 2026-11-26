import { useRef, type CSSProperties } from "react";
import { attachSwing, gsap, map, MOTION_OK, ScrollTrigger, useGsap } from "../lib/motion";
import {
  BasketBack,
  BasketFront,
  IconShield,
  Mask,
  Oximeter,
  PillBottle,
  Stethoscope,
  Tensimeter,
  Thermometer,
} from "../components/art";
import { KitStop } from "../components/Traveler";

const FLYERS = [Stethoscope, Tensimeter, Thermometer, Oximeter, PillBottle, Mask];
const STARTS = [0, 0.55, 1.15, 1.7, 2.3, 2.85];
const basketLeft: CSSProperties = { left: "calc(50% - var(--bw) / 2)" };

export function Products() {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    const line = el.querySelector<HTMLElement>(".line");
    const stage = el.querySelector<HTMLElement>("[data-stage]");
    const wrap = el.querySelector<HTMLElement>("[data-flyers]");
    const blur = el.querySelector<HTMLElement>("[data-blur]");
    if (!line || !stage || !wrap) return;
    const items = Array.from(wrap.children) as HTMLElement[];

    const offSwing = attachSwing([line]);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      let tl: gsap.core.Timeline | null = null;
      let active = false;

      // Products shoot in from beyond both edges of the screen, arc over the
      // headline and dive into the basket. Paths are rebuilt in px on resize.
      const build = () => {
        tl?.kill();
        const W = stage.offsetWidth;
        const bw = stage.offsetHeight;
        const cx = W / 2;
        const vh = window.innerHeight;
        const next = gsap.timeline({ repeat: -1, paused: true });

        items.forEach((item, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          const sx = cx + dir * (W / 2 + 180 + (i % 3) * 36);
          const sy = -vh * (0.26 + 0.08 * (i % 3));
          const ex = cx + (i - 2.5) * bw * 0.024;
          const ey = bw * 0.26;
          const fy = bw * 0.66;
          const drop = ey - sy;
          const d =
            `M${sx},${sy} C${sx - dir * W * 0.1},${sy - drop * 0.6} ${ex + dir * W * 0.012},${ey - drop * 0.8} ${ex},${ey} ` +
            `C${ex},${ey + (fy - ey) * 0.35} ${ex},${fy - (fy - ey) * 0.3} ${ex},${fy}`;
          gsap.set(item, { x: sx, y: sy, xPercent: -50, yPercent: -50 });
          next.fromTo(
            item,
            { scale: 1.35 },
            {
              scale: 0.78,
              duration: 3,
              ease: "power4.out",
              motionPath: { path: d, autoRotate: dir === 1 ? 180 : true },
            },
            STARTS[i],
          );
        });

        next.progress(1);
        if (active) next.play();
        tl = next;
      };

      const play = () => {
        tl?.play();
        gsap.to(wrap, { autoAlpha: 1, duration: 0.2, overwrite: true });
      };
      const pause = () => {
        gsap.to(wrap, {
          autoAlpha: 0,
          duration: 0.3,
          overwrite: true,
          onComplete: () => {
            tl?.pause();
            tl?.progress(0);
          },
        });
      };

      gsap.set(wrap, { autoAlpha: 0 });
      build();
      ScrollTrigger.addEventListener("refresh", build);

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "bottom 12%",
        onToggle: (self) => {
          active = self.isActive;
          if (active) play();
          else pause();
        },
      });

      if (blur) {
        const drift = (p: number) => {
          blur.style.transform = `translate(${map(0, 1, 0, -95, p).toFixed(2)}%, ${map(0, 1, 0, 13, p).toFixed(2)}%) rotate(${map(0, 1, 10, -10, p).toFixed(2)}deg) scale(${map(0, 1, 1.1, 0.8, p).toFixed(3)})`;
        };
        drift(0);
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => drift(self.progress),
        });
      }

      return () => {
        ScrollTrigger.removeEventListener("refresh", build);
        tl?.kill();
        gsap.set(items, { clearProps: "all" });
        if (blur) blur.style.transform = "";
      };
    });

    return () => {
      offSwing();
      mm.revert();
    };
  });

  return (
    <section
      id="produk"
      ref={root}
      className="grain relative overflow-hidden bg-cream pt-[clamp(84px,11vw,210px)]"
      style={{ "--bw": "clamp(280px, 36vw, 500px)" } as CSSProperties}
    >
      <div className="wrap relative z-[2] text-center">
        <div className="line">
          <div className="line-inner">
            <p className="pill text-[#08744F]">
              <IconShield width={18} height={18} strokeWidth={2.4} />
              Berizin edar Kemenkes
            </p>
            <h2 className="display d-1 mt-4 text-pine">
              Pilih, pesan,
              <br />
              terima.
            </h2>
            <p className="lead mt-6 text-pine">+2.500 alat kesehatan siap kirim · 24 jam / 365 hari</p>
          </div>
        </div>
      </div>

      <div data-stage className="relative mt-[clamp(56px,7vw,120px)] h-[var(--bw)]" aria-hidden>
        <BasketBack className="absolute top-0 z-[1] h-[var(--bw)] w-[var(--bw)]" style={basketLeft} />
        <div data-flyers className="absolute inset-0 z-[2]" style={{ visibility: "hidden" }}>
          {FLYERS.map((Flyer, i) => (
            <div
              key={i}
              className="absolute top-0 left-0 will-change-transform"
              style={{ width: "clamp(118px, 9vw + 88px, 230px)" }}
            >
              <Flyer className="h-auto w-full" />
            </div>
          ))}
        </div>
        <KitStop
          name="basket"
          className="stop--basket z-[3]"
          style={{
            left: "50%",
            top: "calc(var(--bw) * 0.36)",
            fontSize: "calc(var(--bw) * 0.3)",
            margin: "-0.38em 0 0 -0.5em",
          }}
        />
        <BasketFront className="absolute top-0 z-[60] h-[var(--bw)] w-[var(--bw)]" style={basketLeft} />
      </div>

      <div
        data-blur
        aria-hidden
        className="pointer-events-none absolute right-[-12%] bottom-[22%] z-[4] hidden h-[150px] w-[400px] rounded-full blur-[7px] lg:block"
        style={{ background: "linear-gradient(90deg, #FF5C4D 50%, #FFF8EA 50%)" }}
      />
    </section>
  );
}
