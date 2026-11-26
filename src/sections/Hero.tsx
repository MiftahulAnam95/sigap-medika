import { useEffect, useRef } from "react";
import { gsap, MOTION_OK, scroller, swingOnce, useGsap } from "../lib/motion";
import { StoreScene } from "../components/StoreScene";
import { KitStop } from "../components/Traveler";
import { Button } from "../components/ui";
import { IconShield } from "../components/art";

const LEAF_COLORS = ["#12B886", "#0E9F74", "#5BD6A8", "#FFC53D", "#12B886", "#0E9F74", "#FF8E80", "#5BD6A8", "#0E9F74"];

/** Leaves drifting down the scene along random wavy paths, forever. */
function mountLeaves(container: HTMLElement, count: number) {
  const rnd = gsap.utils.random;
  const timelines: (gsap.core.Timeline | undefined)[] = [];
  let alive = true;
  let playing = true;

  const nodes = Array.from({ length: count }, (_, i) => {
    const outer = document.createElement("span");
    const inner = document.createElement("span");
    outer.className = "leaf";
    inner.style.setProperty("--leaf", LEAF_COLORS[i % LEAF_COLORS.length]);
    outer.append(inner);
    container.append(outer);
    return { outer, inner };
  });

  const run = (i: number, first: boolean) => {
    if (!alive) return;
    const { outer, inner } = nodes[i];
    const from = Math.random();
    const drift = rnd(-15, 15);
    const bends = Math.floor(rnd(1, 3.99));
    const rot = rnd(0, 360);
    const path: { xPercent: number; yPercent: number }[] = [{ xPercent: -100 * from, yPercent: -15 }];
    for (let n = 1; n <= bends; n++) {
      path.push({ xPercent: -100 * from + rnd(-15, 15) + drift, yPercent: -15 + (135 * n) / (bends + 1) });
    }
    path.push({ xPercent: -100 * from + drift, yPercent: 120 });

    gsap.set(outer, { xPercent: -100 * from, yPercent: -15 });
    gsap.set(inner, { scale: rnd(0.75, 1.75), rotate: rot });
    const tl = gsap.timeline({
      defaults: { duration: rnd(7, 12), ease: "power1.in" },
      delay: first ? i * 1.3 : rnd(0, 6),
      onComplete: () => run(i, false),
    });
    tl.to(outer, { motionPath: { path, curviness: 1.2 } }, 0).to(inner, { rotate: rot + rnd(-180, 180) }, 0);
    if (!playing) tl.pause();
    timelines[i] = tl;
  };

  nodes.forEach((_, i) => run(i, true));

  const io = new IntersectionObserver(([entry]) => {
    playing = entry.isIntersecting;
    timelines.forEach((tl) => (playing ? tl?.play() : tl?.pause()));
  });
  io.observe(container);

  return () => {
    alive = false;
    io.disconnect();
    timelines.forEach((tl) => tl?.kill());
    nodes.forEach(({ outer }) => outer.remove());
  };
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const lines = Array.from(el.querySelectorAll<HTMLElement>(".line-inner"));
      const fades = el.querySelectorAll(".hero__fade");
      const store = el.querySelector(".scene__store");
      const scooter = el.querySelector(".scene__scooter");
      const kit = el.querySelector(".stop__in");

      lines.forEach((l) => swingOnce(l, 0));
      gsap.set(fades, { autoAlpha: 0, y: 24 });
      gsap.set(store, { y: 70 });
      gsap.set(scooter, { xPercent: 170 });
      gsap.set(kit, { y: -el.offsetHeight, rotation: -50 });

      const tl = gsap.timeline({ paused: true });
      tl.to(store, { y: 0, duration: 1.3, ease: "expo.out" }, 0);
      lines.forEach((l, i) => {
        const p = { v: 0 };
        tl.to(p, { v: 1, duration: 1.15, ease: "power3.out", onUpdate: () => swingOnce(l, p.v) }, 0.2 + i * 0.13);
      });
      tl.to(fades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "expo.out" }, 0.55);
      tl.to(scooter, { xPercent: 0, duration: 1.6, ease: "power3.out" }, 0.3);
      tl.to(kit, { y: 0, rotation: 0, duration: 1.15, ease: "bounce.out" }, 0.75);
      intro.current = tl;

      const leaves = el.querySelector<HTMLElement>(".leaves");
      const stopLeaves = leaves ? mountLeaves(leaves, 9) : undefined;

      return () => {
        intro.current = null;
        stopLeaves?.();
        gsap.set(lines, { clearProps: "transform,opacity" });
      };
    });

    return () => mm.revert();
  });

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <header id="top" ref={root} className="hero">
      <StoreScene fence>
        <KitStop name="hero" className="stop--hero" docked />
        <div className="leaves" />
      </StoreScene>

      <div className="wrap relative z-[3] flex flex-col items-center pt-[88px] text-center sm:pt-[100px]">
        <p className="pill hero__fade mb-4 bg-paper/60 text-[#08744F]">
          <IconShield width={18} height={18} strokeWidth={2.4} />
          Distributor alkes resmi · 24 jam
        </p>
        <h1 className="display d-hero text-pine">
          <span className="line">
            <span className="line-inner">Anda merawat,</span>
          </span>
          <span className="line">
            <span className="line-inner">kami melengkapi.</span>
          </span>
        </h1>
        <p className="hero__fade mt-5 hidden max-w-[30ch] text-[17px] leading-snug font-medium text-pine/80 [@media(max-aspect-ratio:1/1)]:block">
          2.500+ alat kesehatan resmi &amp; bergaransi, dikirim ke seluruh Indonesia.
        </p>
      </div>

      <div className="hero__fade absolute bottom-[6%] left-1/2 z-10 -translate-x-1/2">
        <span className="float block">
          <Button icon="down" ariaLabel="Gulir ke daftar produk" onClick={() => scroller.to("#produk")} />
        </span>
      </div>
    </header>
  );
}
