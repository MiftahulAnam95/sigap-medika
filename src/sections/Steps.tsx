import { useEffect, useRef, useState } from "react";
import { attachSwing, clamp, gsap, map, MOTION_OK, prefersReduced, scroller, ScrollTrigger, useGsap } from "../lib/motion";
import {
  IconCheck,
  IconTruck,
  INK,
  Mask,
  Oximeter,
  PillBottle,
  Plaster,
  Stethoscope,
  Tensimeter,
  Thermometer,
  Wheelchair,
} from "../components/art";
import { Button, type Topic } from "../components/ui";

const STEPS = [
  {
    title: "Konsultasi gratis",
    desc: "Ceritakan kebutuhan faskes Anda. Spesialis produk kami menyusun daftar alat dan penawaran di hari yang sama.",
  },
  {
    title: "Pilih paket",
    desc: "Ambil paket siap pakai untuk klinik atau homecare — atau racik sendiri sesuai anggaran.",
  },
  {
    title: "Kirim & pasang",
    desc: "Alat dikirim, dirakit, dan dikalibrasi teknisi kami. Tim Anda dilatih sampai siap pakai.",
  },
];

const PACKS = {
  klinik: {
    label: "Klinik",
    tiers: [
      { name: "Dasar", price: 18.5, items: 12, list: ["Tensimeter & stetoskop", "Bed periksa", "Termometer infrared", "Timbangan badan"] },
      { name: "Lengkap", price: 46.9, items: 28, list: ["Semua isi paket Dasar", "EKG 3 channel", "Autoclave 18 L", "Nebulizer & suction"] },
      { name: "Premium", price: 89.5, items: 45, list: ["Semua isi paket Lengkap", "USG portabel", "Patient monitor", "Defibrilator AED"] },
    ],
  },
  homecare: {
    label: "Homecare",
    tiers: [
      { name: "Dasar", price: 4.9, items: 6, list: ["Kursi roda lipat", "Tensimeter digital", "Oksimeter jari", "Termometer"] },
      { name: "Lengkap", price: 12.5, items: 11, list: ["Semua isi paket Dasar", "Ranjang pasien 2 engkol", "Kasur dekubitus", "Nebulizer"] },
      { name: "Premium", price: 27.8, items: 17, list: ["Semua isi paket Lengkap", "Ranjang elektrik", "Konsentrator oksigen 5 L", "Suction pump"] },
    ],
  },
};
type Kind = keyof typeof PACKS;

const SHELF = [Tensimeter, Stethoscope, Thermometer, Oximeter, PillBottle, Mask, Wheelchair];
const SHELF_ON = [3, 5, 7];
const CHECKLIST = ["Tensimeter & stetoskop", "Bed periksa + lampu tindakan", "Autoclave (sterilisator)", "EKG 3 channel"];
const MILESTONES = ["Dikemas", "Dikirim", "Dirakit & dikalibrasi", "Tim dilatih"];
const ROUTE = "M92 172C170 60 250 250 330 150S450 80 506 168";

const card = "relative rounded-[28px] border-[1.5px] border-pine/10 bg-paper p-5 shadow-[0_30px_70px_-40px_rgba(11,59,48,0.45)] sm:p-8";
const bubble = "max-w-[86%] rounded-[20px] px-4 py-3 text-[16px] leading-snug";
const fmtPrice = (v: number) => v.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function ZoneHead({ i }: { i: number }) {
  return (
    <div className="mb-6 flex gap-4 lg:hidden">
      <span className="grid h-12 w-12 flex-none place-items-center rounded-full bg-pine font-display text-xl font-extrabold text-cream">
        {i + 1}
      </span>
      <div>
        <h3 className="display text-[2rem]">{STEPS[i].title}</h3>
        <p className="mt-2 max-w-[42ch] text-[16px] leading-snug">{STEPS[i].desc}</p>
      </div>
    </div>
  );
}

export function Steps({ onContact }: { onContact: (t: Topic) => void }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [kind, setKind] = useState<Kind>("klinik");
  const [tier, setTier] = useState(1);
  const priceEl = useRef<HTMLSpanElement>(null);
  const itemsEl = useRef<HTMLSpanElement>(null);
  const shown = useRef({ price: PACKS.klinik.tiers[1].price, items: PACKS.klinik.tiers[1].items });
  const pack = PACKS[kind].tiers[tier];

  // price + item count roll to the new value whenever the selection changes
  useEffect(() => {
    const render = () => {
      if (priceEl.current) priceEl.current.textContent = fmtPrice(shown.current.price);
      if (itemsEl.current) itemsEl.current.textContent = String(Math.round(shown.current.items));
    };
    if (prefersReduced()) {
      shown.current = { price: pack.price, items: pack.items };
      render();
      return;
    }
    const tween = gsap.to(shown.current, { price: pack.price, items: pack.items, duration: 0.7, ease: "power3.out", onUpdate: render });
    return () => {
      tween.kill();
    };
  }, [pack.price, pack.items]);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    const lines = Array.from(el.querySelectorAll<HTMLElement>(".line"));
    const title = el.querySelector<HTMLElement>("[data-title]");
    const plaster = el.querySelector<HTMLElement>("[data-plaster]");
    const zones = Array.from(el.querySelectorAll<HTMLElement>("[data-zone]"));
    const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-fill]"));

    const offSwing = attachSwing(lines);
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      if (plaster && title) {
        const drift = (p: number) => {
          plaster.style.transform = `translate(${map(0, 1, 0, 75, p).toFixed(2)}%, ${map(0, 1, 0, 13, p).toFixed(2)}%) rotate(${map(0, 1, 8, -8, p).toFixed(2)}deg) scale(${map(0, 1, 0.8, 1.1, p).toFixed(3)})`;
        };
        drift(0);
        ScrollTrigger.create({ trigger: title, start: "top bottom", end: "bottom top", onUpdate: (s) => drift(s.progress) });
      }

      const timelines: gsap.core.Timeline[] = [];

      // zone 1 — the conversation unfolds
      {
        const z = zones[0];
        const tl = gsap.timeline({ paused: true });
        tl.from(z.querySelectorAll("[data-b]"), { autoAlpha: 0, y: 28, scale: 0.92, duration: 1, stagger: 1, ease: "power2.out" }, 0)
          .from(z.querySelectorAll("[data-c]"), { autoAlpha: 0, x: -14, duration: 0.5, stagger: 0.22 }, 1.4)
          .to({}, { duration: 1.4 });
        timelines.push(tl);
      }

      // zone 2 — the package card lands, promo sticker spins in
      {
        const z = zones[1];
        const tl = gsap.timeline({ paused: true });
        tl.from(z.querySelector("[data-card]"), { autoAlpha: 0, y: 90, rotate: 3, duration: 1, ease: "power2.out" }, 0)
          .from(z.querySelector("[data-promo]"), { scale: 0, rotate: -120, duration: 0.9, ease: "back.out(1.6)" }, 0.5)
          .to({}, { duration: 3.2 });
        timelines.push(tl);
      }

      // zone 3 — the van drives the route while the days tick
      {
        const z = zones[2];
        const van = z.querySelector("[data-van]");
        const route = z.querySelector<SVGPathElement>("[data-route]");
        const done = z.querySelector<SVGPathElement>("[data-route-done]");
        const day = z.querySelector("[data-day]");
        const tl = gsap.timeline({ paused: true });
        if (van && route && done) {
          const len = route.getTotalLength();
          const d = { v: 0 };
          gsap.set(done, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(van, { motionPath: { path: route, align: route, alignOrigin: [0.5, 0.86], autoRotate: true }, duration: 4, ease: "none" }, 0)
            .to(done, { strokeDashoffset: 0, duration: 4, ease: "none" }, 0)
            .to(
              d,
              {
                v: 3,
                duration: 4,
                ease: "none",
                onUpdate: () => {
                  if (day) day.textContent = String(Math.round(d.v));
                },
              },
              0,
            );
        }
        z.querySelectorAll("[data-m]").forEach((m, i) => {
          tl.to(m, { backgroundColor: "#12B886", borderColor: "#12B886", opacity: 1, duration: 0.3 }, 0.1 + i * 1.25);
        });
        tl.from(z.querySelector("[data-ready]"), { scale: 0, rotate: -25, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" }, 3.85).to(
          {},
          { duration: 1.6 },
        );
        timelines.push(tl);
      }

      zones.forEach((z, i) => {
        const apply = (p: number) => {
          timelines[i]?.progress(p);
          if (fills[i]) fills[i].style.transform = `scaleY(${clamp(0, 1, p / 0.85).toFixed(4)})`;
        };
        ScrollTrigger.create({
          trigger: z,
          start: "top 62%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
          onUpdate: (self) => apply(self.progress),
          onRefresh: (self) => apply(self.progress),
        });
      });

      return () => {
        timelines.forEach((t) => t.kill());
        fills.forEach((f) => (f.style.transform = "scaleY(0)"));
        if (plaster) plaster.style.transform = "";
      };
    });

    return () => {
      offSwing();
      mm.revert();
    };
  });

  const goTo = (i: number) => {
    const zone = root.current?.querySelectorAll<HTMLElement>("[data-zone]")[i];
    if (zone) scroller.to(zone, { offset: -window.innerHeight * 0.2 });
  };

  return (
    <section id="cara-pesan" ref={root} className="grain relative bg-cream pt-[max(190px,17vw)] pb-[clamp(90px,9vw,170px)] text-pine">
      <div data-title className="wrap relative text-center">
        <h2 className="display d-2 swing-lines relative z-[2]">
          <span className="line">
            <span className="line-inner">Alat di tangan</span>
          </span>
          <span className="line">
            <span className="line-inner">dalam 3 langkah</span>
          </span>
        </h2>
        <div
          data-plaster
          aria-hidden
          className="pointer-events-none absolute top-[-140%] left-[-14%] z-[1] min-[821px]:top-[-78%] w-[clamp(200px,34vw,560px)] will-change-transform"
        >
          <Plaster className="h-auto w-full" />
        </div>
      </div>

      <div className="wrap relative z-[2] mt-[clamp(64px,8vw,150px)] min-[821px]:mt-[max(150px,13vw)] grid gap-x-[clamp(32px,6vw,120px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* sticky rail */}
        <div className="hidden lg:block">
          <ol className="sticky top-[17vh]">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-state={i === active ? "active" : i < active ? "done" : "idle"}
                className="group relative pb-9 pl-[82px] last:pb-0"
              >
                {i < STEPS.length - 1 && (
                  <span className="absolute top-[64px] bottom-[8px] left-[27px] w-[3px] overflow-hidden rounded-full bg-pine/15">
                    <span data-fill className="block h-full w-full origin-top bg-pine" style={{ transform: "scaleY(0)" }} />
                  </span>
                )}
                <button type="button" onClick={() => goTo(i)} className="block text-left">
                  <span className="absolute top-0 left-0 grid h-14 w-14 place-items-center rounded-full border-[3px] border-pine font-display text-2xl font-extrabold transition-colors duration-500 group-data-[state=active]:bg-pine group-data-[state=active]:text-cream group-data-[state=done]:bg-brand">
                    {i + 1}
                  </span>
                  <h3 className="display pt-2 text-[clamp(1.8rem,2.7vw,3rem)] opacity-55 transition-opacity duration-500 group-data-[state=active]:opacity-100">
                    {s.title}
                  </h3>
                  <span className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-700 ease-expo group-data-[state=active]:grid-rows-[1fr] group-data-[state=active]:opacity-100">
                    <span className="overflow-hidden">
                      <span className="block max-w-[34ch] pt-3 text-[17px] leading-snug">{s.desc}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* zones */}
        <div className="grid gap-[clamp(48px,9vh,96px)]">
          {/* 1 — konsultasi */}
          <div data-zone className="flex min-h-[70vh] flex-col justify-center lg:min-h-[84vh]">
            <ZoneHead i={0} />
            <div className={card}>
              <div className="flex items-center gap-3 border-b border-pine/10 pb-4">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-brand font-display text-[15px] font-extrabold">
                  RN
                </span>
                <div>
                  <p className="leading-tight font-bold">Rani — Spesialis Produk</p>
                  <p className="flex items-center gap-1.5 text-sm text-pine/70">
                    <i className="inline-block h-2 w-2 rounded-full bg-brand" /> Online · membalas ±5 menit
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                <p className={`${bubble} ml-auto rounded-br-md bg-pine text-white`}>
                  Halo, bulan depan saya buka klinik pratama. Alat apa saja yang wajib ada?
                </p>
                <p data-b className={`${bubble} mr-auto rounded-bl-md bg-cream`}>
                  Siap, Dok! Saya susun daftarnya sesuai standar klinik pratama ya.
                </p>
                <ul data-b className={`${bubble} mr-auto grid gap-2 rounded-bl-md bg-cream`}>
                  {CHECKLIST.map((c) => (
                    <li key={c} data-c className="flex items-center gap-2 font-medium">
                      <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-brand">
                        <IconCheck width={13} height={13} strokeWidth={3.5} />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
                <p data-b className={`${bubble} mr-auto rounded-bl-md bg-cream`}>
                  Penawaran resmi saya kirim hari ini. Mau sekalian dihitungkan paketnya?
                </p>
                <p data-b className={`${bubble} typing ml-auto flex gap-1 rounded-br-md bg-pine py-4 text-white`} aria-hidden>
                  <i />
                  <i />
                  <i />
                </p>
              </div>
            </div>
          </div>

          {/* 2 — paket */}
          <div data-zone className="flex min-h-[70vh] flex-col justify-center lg:min-h-[84vh]">
            <ZoneHead i={1} />
            <div data-card className={card}>
              <div data-promo aria-hidden className="absolute -top-10 -right-3 h-[104px] w-[104px] sm:-right-9 sm:h-[128px] sm:w-[128px]">
                <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
                  <circle cx="60" cy="60" r="60" fill="#FFC53D" />
                  <defs>
                    <path id="promo-ring" d="M17 60a43 43 0 1 1 86 0a43 43 0 1 1-86 0" />
                  </defs>
                  <text fontSize="10.6" fill={INK} style={{ fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "0.08em" }}>
                    <textPath href="#promo-ring" textLength="264">
                      GRATIS ONGKIR • GRATIS INSTALASI •
                    </textPath>
                  </text>
                </svg>
                <IconTruck className="absolute inset-0 m-auto h-9 w-9" />
              </div>

              <div role="radiogroup" aria-label="Jenis paket" className="relative inline-grid grid-cols-2 rounded-2xl bg-cream p-1">
                <span
                  className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-pine transition-transform duration-500 ease-expo"
                  style={{ transform: `translateX(${kind === "klinik" ? 0 : 100}%)` }}
                />
                {(Object.keys(PACKS) as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    role="radio"
                    aria-checked={kind === k}
                    onClick={() => setKind(k)}
                    className={`relative z-[1] px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300 ${
                      kind === k ? "text-white" : "text-pine"
                    }`}
                  >
                    {PACKS[k].label}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold tracking-wide text-pine/70 uppercase">Mulai dari</p>
                <p className="display mt-1 text-[clamp(2.7rem,5.2vw,5rem)] tabular-nums">
                  Rp <span ref={priceEl}>{fmtPrice(pack.price)}</span> <span className="text-[0.5em]">jt</span>
                </p>
                <p className="mt-2 text-[16px] font-medium">
                  <span ref={itemsEl} className="tabular-nums">
                    {pack.items}
                  </span>{" "}
                  item · garansi resmi · termasuk instalasi
                </p>
              </div>

              <div className="mt-5 flex items-end justify-between gap-1 border-b-[3px] border-pine/80 pb-1" aria-hidden>
                {SHELF.map((Item, i) => {
                  const on = i < SHELF_ON[tier];
                  return (
                    <Item
                      key={i}
                      className="h-auto w-[13%] max-w-[64px] transition-[opacity,transform] duration-500 ease-expo"
                      style={{
                        opacity: on ? 1 : 0.16,
                        transform: `translateY(${on ? 0 : 6}px) scale(${on ? 1 : 0.72})`,
                        transformOrigin: "50% 100%",
                        transitionDelay: `${i * 45}ms`,
                      }}
                    />
                  );
                })}
              </div>

              <div role="radiogroup" aria-label="Tingkat paket" className="mt-6 grid grid-cols-3 gap-2">
                {PACKS[kind].tiers.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    role="radio"
                    aria-checked={tier === i}
                    onClick={() => setTier(i)}
                    className={`rounded-2xl border-[1.5px] px-2.5 py-3 text-left transition-colors duration-300 sm:px-3 ${
                      tier === i ? "border-pine bg-pine text-white" : "border-pine/20 hover:border-pine/60"
                    }`}
                  >
                    <span className="block text-[13px] font-semibold opacity-75">Paket</span>
                    <span className="font-display text-[1.02rem] leading-tight font-extrabold tracking-tight sm:text-[1.25rem]">{t.name}</span>
                  </button>
                ))}
              </div>

              <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {pack.list.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[16px]">
                    <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-brand">
                      <IconCheck width={13} height={13} strokeWidth={3.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button label={`Pesan paket ${pack.name}`} onClick={() => onContact("penawaran")} />
              </div>
            </div>
          </div>

          {/* 3 — kirim & pasang */}
          <div data-zone className="flex min-h-[70vh] flex-col justify-center lg:min-h-[84vh]">
            <ZoneHead i={2} />
            <div className={card}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold tracking-wide text-pine/70 uppercase">Estimasi tiba</p>
                  <p className="display mt-1 text-[clamp(3.2rem,6.4vw,6rem)] tabular-nums">
                    H+<span data-day>3</span>
                  </p>
                </div>
                <span data-ready className="pill mt-1 border-brand bg-brand text-pine">
                  <IconCheck width={16} height={16} strokeWidth={3} />
                  Siap pakai
                </span>
              </div>

              <svg viewBox="0 0 600 226" className="mt-1 h-auto w-full overflow-visible" aria-hidden>
                <rect x="14" y="140" width="72" height="50" rx="6" fill="#EADBBF" stroke={INK} strokeWidth="5" />
                <path d="M8 142 50 112l42 30" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="38" y="160" width="24" height="30" fill={INK} />
                <text x="50" y="214" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
                  Gudang
                </text>
                <rect x="512" y="120" width="76" height="70" rx="6" fill="#fff" stroke={INK} strokeWidth="5" />
                <path d="M550 133v24M538 145h24" stroke="#12B886" strokeWidth="8" />
                <rect x="540" y="166" width="20" height="24" fill={INK} />
                <text x="550" y="214" textAnchor="middle" fontSize="14" fontWeight="700" fill={INK}>
                  Klinik Anda
                </text>
                <path data-route d={ROUTE} fill="none" stroke={INK} strokeOpacity=".28" strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round" />
                <path data-route-done d={ROUTE} fill="none" stroke="#12B886" strokeWidth="6" strokeLinecap="round" />
                <g data-van>
                  <rect x="0" y="6" width="50" height="30" rx="5" fill="#FFF8EA" stroke={INK} strokeWidth="4" />
                  <path d="M25 13v16M17 21h16" stroke="#12B886" strokeWidth="5" />
                  <path d="M50 14h13l11 12v10H50z" fill="#12B886" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
                  <circle cx="16" cy="38" r="7" fill={INK} />
                  <circle cx="58" cy="38" r="7" fill={INK} />
                  <circle cx="16" cy="38" r="2.5" fill="#EADBBF" />
                  <circle cx="58" cy="38" r="2.5" fill="#EADBBF" />
                </g>
              </svg>

              <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {MILESTONES.map((m, i) => (
                  <li key={m} data-m className="rounded-2xl border-[1.5px] border-pine/20 px-3 py-2.5 text-[14px] leading-tight font-bold opacity-70">
                    <span className="block text-[12px] font-semibold opacity-75">0{i + 1}</span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
