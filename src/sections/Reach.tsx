import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import {
  attachEdges,
  attachSwing,
  clamp,
  DESKTOP,
  gsap,
  map,
  mediaSwing,
  MOBILE,
  MOTION_OK,
  prefersReduced,
  ScrollTrigger,
  stickerSwing,
  useGsap,
} from "../lib/motion";
import { IconMute, IconPause, IconPlay, IconShield, IconTag, IconTruck, IconVolume, IconWrench } from "../components/art";
import { Button, type Topic } from "../components/ui";
import poster from "../assets/poster.jpg";

const VIDEO_SRC = "https://videos.pexels.com/video-files/5203512/5203512-hd_1920_1080_30fps.mp4";
const PROVINCES = 38;
const LINES = ["Pusat alat", "kesehatan", "terlengkap", "se-Indonesia"];
const display: CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 800 };

const FEATURES = [
  {
    icon: IconShield,
    title: "Resmi & bergaransi",
    body: "Semua produk berizin edar Kemenkes (AKL/AKD) dengan garansi resmi distributor hingga 3 tahun.",
  },
  {
    icon: IconTag,
    title: "Harga transparan",
    body: "Harga grosir mulai dari 1 unit. Faktur pajak dan e-Katalog tersedia untuk pengadaan instansi.",
  },
  {
    icon: IconTruck,
    title: "Pengiriman kilat",
    body: "Same-day untuk Jabodetabek, 1–3 hari kerja ke kota lain — lengkap dengan asuransi pengiriman.",
  },
  {
    icon: IconWrench,
    title: "Servis & kalibrasi",
    body: "Teknisi elektromedis bersertifikat untuk instalasi, kalibrasi, dan perawatan berkala alat Anda.",
  },
];

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function VideoCard() {
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const time = useRef<HTMLTimeElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  // play only while on screen (and never auto-play for reduced-motion users)
  useEffect(() => {
    const v = video.current;
    if (!v || prefersReduced()) return;
    const st = ScrollTrigger.create({
      trigger: v,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => {
        if (self.isActive) v.play().catch(() => undefined);
        else v.pause();
      },
    });
    return () => st.kill();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => undefined);
    else v.pause();
  };
  const seek = (e: MouseEvent<HTMLButtonElement>) => {
    const v = video.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = clamp(0, 1, (e.clientX - r.left) / r.width) * v.duration;
  };

  return (
    <>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        poster={poster}
        muted={muted}
        loop
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="none"
        aria-label="Video ruang perawatan dengan ranjang pasien dan peralatan medis"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (bar.current && v.duration) bar.current.style.width = `${(v.currentTime / v.duration) * 100}%`;
          if (time.current) time.current.textContent = fmt(v.currentTime);
        }}
      />
      {!failed && (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 text-white sm:inset-x-5 sm:bottom-5">
          <div className="flex h-12 items-center gap-3 rounded-2xl bg-pine/70 pr-4 pl-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Jeda video" : "Putar video"}
              className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 transition-colors hover:bg-white/30"
            >
              {playing ? <IconPause width={18} height={18} /> : <IconPlay width={18} height={18} />}
            </button>
            <button
              type="button"
              onClick={seek}
              aria-label="Geser posisi video"
              className="relative h-9 w-[clamp(70px,14vw,190px)] cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                <span ref={bar} className="block h-full w-0 rounded-full bg-white" />
              </span>
            </button>
            <time ref={time} className="text-sm font-semibold tabular-nums">
              00:00
            </time>
          </div>
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-pine/70 backdrop-blur-md transition-colors hover:bg-pine"
          >
            {muted ? <IconMute width={20} height={20} /> : <IconVolume width={20} height={20} />}
          </button>
        </div>
      )}
    </>
  );
}

export function Reach({ onContact }: { onContact: (t: Topic) => void }) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".line"));
    const sticker = el.querySelector<HTMLElement>("[data-sticker]");
    const num = el.querySelector("[data-count]");
    const card = el.querySelector<HTMLElement>("[data-video]");
    const list = el.querySelector<HTMLElement>("[data-list]");
    const reveals = el.querySelectorAll("[data-reveal]");

    // the sticker rides on the second headline line and counts while it tumbles in
    const offSwing = attachSwing(lines, {
      onProgress: (i, t) => {
        if (i !== 1 || !sticker || !num) return;
        if (window.innerWidth >= 821) {
          stickerSwing(sticker, t);
          num.textContent = String(Math.floor(clamp(0, PROVINCES, map(0.2, 0.6, 0, PROVINCES, t))));
        } else {
          sticker.style.opacity = String(clamp(0, 1, map(0, 0.6, 0, 1, t)));
          sticker.style.transform = `translate(${map(0, 1, 50, 0, t).toFixed(1)}px, ${map(0, 1, 160, 0, t).toFixed(1)}px) rotate(${map(0, 1, -40, 8, t).toFixed(1)}deg) scale(${clamp(0, 1, map(0, 0.7, 0, 1, t)).toFixed(3)})`;
          num.textContent = String(Math.floor(clamp(0, PROVINCES, map(0, 0.9, 0, PROVINCES, t))));
        }
      },
    });
    const offEdges = attachEdges(el, el.querySelector(".edge--top"), el.querySelector(".edge--bottom"));

    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      if (!card || !list) return;
      const apply = (t: number) => mediaSwing(card, t);
      apply(0);
      ScrollTrigger.create({
        trigger: card.parentElement,
        start: "top bottom",
        endTrigger: list,
        end: "top top",
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
      return () => gsap.set(card, { clearProps: "transform,opacity" });
    });
    mm.add(MOBILE, () => {
      if (!card) return;
      gsap.from(card, {
        autoAlpha: 0,
        y: 140,
        rotateX: 30,
        rotateY: -45,
        rotateZ: 14,
        scale: 0.9,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: card.parentElement, start: "top 88%", once: true },
      });
    });
    mm.add(MOTION_OK, () => {
      gsap.set(reveals, { autoAlpha: 0, yPercent: 50 });
      ScrollTrigger.create({
        trigger: list,
        start: "top 85%",
        once: true,
        onEnter: () => gsap.to(reveals, { autoAlpha: 1, yPercent: 0, duration: 0.6, stagger: 0.12, ease: "expo.out" }),
      });
    });

    return () => {
      offSwing();
      offEdges();
      mm.revert();
      if (sticker) sticker.style.cssText = "";
      if (num) num.textContent = String(PROVINCES);
    };
  });

  return (
    <section id="keunggulan" ref={root} className="relative bg-brand pt-[max(124px,13vw)] pb-[max(110px,11vw)] text-pine">
      <span className="edge edge--top" />
      <span className="edge edge--bottom" />

      <div className="wrap">
        <div className="relative z-20 text-center">
          <h2 className="display d-1 swing-lines">
            {LINES.map((l) => (
              <span key={l} className="line">
                <span className="line-inner">{l}</span>
              </span>
            ))}
          </h2>

          <div
            data-sticker
            className="absolute top-[-40px] right-[-4px] w-[clamp(68px,6vw+34px,150px)] min-[821px]:top-[-13%] min-[821px]:right-[-1%] xl:top-[4%] xl:right-[5%]"
          >
            <span className="sr-only">Melayani {PROVINCES} provinsi</span>
            <svg viewBox="0 0 168 168" className="h-auto w-full" aria-hidden>
              <path d="M84 0c46.4 0 84 37.6 84 84s-37.6 84-84 84H0V84C0 37.6 37.6 0 84 0z" fill="#fff" />
              <circle cx="84" cy="84" r="52" fill="#0B3B30" />
              <text data-count x="84" y="92" textAnchor="middle" fontSize="42" fill="#fff" style={{ ...display, letterSpacing: "-0.04em" }}>
                {PROVINCES}
              </text>
              <text x="84" y="112" textAnchor="middle" fontSize="14.5" fill="#5BD6A8" style={{ ...display, letterSpacing: "0.04em" }}>
                PROVINSI
              </text>
            </svg>
          </div>
        </div>

        <div className="relative z-[2] mt-[min(-5px,23px_-_7.25vw)] flex justify-center [perspective:1070px] max-[820px]:mt-8">
          <div
            data-video
            className="relative aspect-video w-[min(100%,980px)] overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-pine will-change-transform"
          >
            <VideoCard />
          </div>
        </div>

        <ul data-list className="mx-auto mt-[clamp(56px,6vw,110px)] grid max-w-[1320px] gap-x-7 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((f) => (
            <li key={f.title} data-reveal className="flex gap-3.5">
              <span className="mt-0.5 grid h-11 w-11 flex-none place-items-center rounded-2xl bg-pine/10">
                <f.icon />
              </span>
              <div>
                <h3 className="text-[clamp(1.2rem,1.08rem+0.4vw,1.5rem)] leading-tight font-bold tracking-[-0.03em]">{f.title}</h3>
                <p className="mt-1.5 text-[16px] leading-normal">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(40px,4vw,76px)] flex flex-wrap justify-center gap-3">
          <div data-reveal>
            <Button label="Katalog" variant="ghost" icon="download" iconFirst onClick={() => onContact("katalog")} />
          </div>
          <div data-reveal>
            <Button label="Minta penawaran" variant="light" onClick={() => onContact("penawaran")} />
          </div>
        </div>
      </div>
    </section>
  );
}
