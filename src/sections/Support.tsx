import { useRef, type ComponentType, type SVGProps } from "react";
import { clamp, gsap, map, MOTION_OK, ScrollTrigger, useGsap } from "../lib/motion";
import { IconBook, IconFlask, IconHeart, IconHome, IconPulse, IconShield, IconWrench } from "../components/art";
import tech from "../assets/tech.jpg";
import teamA from "../assets/team-a.jpg";
import teamB from "../assets/team-b.jpg";
import trainA from "../assets/train-a.jpg";
import trainB from "../assets/train-b.jpg";

type Media =
  | { kind: "photo"; src: string; pos: string; rot: number; tall?: boolean }
  | { kind: "sticker"; icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; pos: string; rot: number; tone: string };

const PAPER = "bg-paper text-pine";
const SUN = "bg-sun text-pine";
const MINT = "bg-mint text-pine";

const POINTS: { cap: string; title: string; body: string; media: Media[] }[] = [
  {
    cap: "Kami sediakan",
    title: "Servis & kalibrasi",
    body: "Teknisi elektromedis bersertifikat.\nGaransi resmi hingga 3 tahun.",
    media: [
      { kind: "photo", src: tech, pos: "left-[5%] top-[13%] md:left-[9%] md:top-[17%]", rot: -10 },
      { kind: "sticker", icon: IconShield, label: "Garansi 3 th", pos: "right-[6%] top-[14%] md:right-[17%] md:top-[19%]", rot: 12, tone: MINT },
      { kind: "sticker", icon: IconWrench, label: "Kalibrasi", pos: "right-[5%] top-[61%] md:right-[19%] md:top-[59%]", rot: -8, tone: PAPER },
    ],
  },
  {
    cap: "Tim",
    title: "Spesialis produk",
    body: "Konsultan alkes berpengalaman,\nsiap membantu di seluruh Indonesia.",
    media: [
      { kind: "photo", src: teamA, pos: "left-[5%] top-[11%] md:left-[10%] md:top-[17%]", rot: -14, tall: true },
      { kind: "photo", src: teamB, pos: "right-[4%] top-[62%] md:right-[9%] md:top-[35%]", rot: 12 },
    ],
  },
  {
    cap: "Kami dampingi",
    title: "Pelatihan pengguna",
    body: "Pelatihan langsung untuk tim Anda.\nVideo panduan & modul digital.",
    media: [
      { kind: "photo", src: trainA, pos: "left-[4%] top-[12%] md:left-[6%] md:top-[12%]", rot: -12 },
      { kind: "photo", src: trainB, pos: "right-[4%] top-[14%] md:right-[9%] md:top-[15%]", rot: 14 },
      { kind: "sticker", icon: IconBook, label: "Modul digital", pos: "left-[7%] top-[62%] md:left-[22%] md:top-[68%]", rot: 6, tone: MINT },
    ],
  },
  {
    cap: "Kami hubungkan",
    title: "Jaringan mitra",
    body: "Akses ke 60+ merek resmi.\nPendampingan pengadaan berkelanjutan.",
    media: [
      { kind: "sticker", icon: IconPulse, label: "Diagnostik", pos: "left-[6%] top-[13%] md:left-[9%] md:top-[15%]", rot: -10, tone: PAPER },
      { kind: "sticker", icon: IconFlask, label: "Laboratorium", pos: "left-[4%] top-[62%] md:left-[17%] md:top-[55%]", rot: 8, tone: SUN },
      { kind: "sticker", icon: IconHome, label: "Homecare", pos: "right-[6%] top-[12%] md:right-[9%] md:top-[21%]", rot: 12, tone: MINT },
      { kind: "sticker", icon: IconHeart, label: "Rehabilitasi", pos: "right-[4%] top-[62%] md:right-[18%] md:top-[58%]", rot: -6, tone: PAPER },
      { kind: "sticker", icon: IconShield, label: "Sterilisasi", pos: "left-[38%] top-[10%] md:left-[31%] md:top-[9%]", rot: 4, tone: SUN },
    ],
  },
];

const SEG = 4.2; // timeline seconds per point

export function Support() {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // The pinned, scroll-scrubbed version is an enhancement: without it the
    // section is a plain stack of four readable blocks.
    mm.add(MOTION_OK, () => {
      el.dataset.pinned = "true";
      const sky = el.querySelector<HTMLElement>("[data-sky]");
      const stars = el.querySelector<HTMLElement>("[data-stars]");
      const sun = el.querySelector<HTMLElement>("[data-sun]");
      const points = Array.from(el.querySelectorAll<HTMLElement>("[data-point]"));
      const groups = Array.from(el.querySelectorAll<HTMLElement>("[data-group]"));
      const dots = Array.from(el.querySelectorAll<HTMLElement>("[data-dot]"));

      const tl = gsap.timeline({ paused: true });
      points.forEach((pt, i) => {
        const texts = pt.querySelectorAll("[data-t]");
        const media = groups[i]?.querySelectorAll("[data-m]") ?? [];
        const t0 = i * SEG;
        tl.fromTo(
          texts,
          { opacity: 0, y: 150, rotateY: -80 },
          { opacity: 1, y: 0, rotateY: 0, duration: 2, stagger: 0.08, ease: "power2.out" },
          t0,
        );
        tl.fromTo(
          media,
          { opacity: 0, scale: 0, filter: "blur(5px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, stagger: 0.3, ease: "power2.out" },
          t0 + 0.1,
        );
        if (i < points.length - 1) {
          tl.to(texts, { opacity: 0, y: -150, rotateY: 80, duration: 1.6, ease: "power2.in" }, t0 + 2.9);
          tl.to(media, { opacity: 0, scale: 1.5, filter: "blur(15px)", duration: 1.5, stagger: 0.2, ease: "power2.in" }, t0 + 2.7);
        }
      });
      tl.to({}, { duration: 1 });
      const total = tl.duration();

      let current = -1;
      const apply = (p: number) => {
        tl.progress(p);
        if (sky) sky.style.transform = `translate3d(0, ${(-80 * p).toFixed(3)}%, 0)`;
        if (stars) stars.style.opacity = clamp(0, 1, map(0.6, 0.9, 0, 1, p)).toFixed(3);
        if (sun) sun.style.transform = `translate3d(0, ${(p * 330).toFixed(2)}vh, 0) scale(${(1 + p * 1.4).toFixed(3)})`;
        const idx = clamp(0, points.length - 1, Math.floor((p * total + 1.3) / SEG));
        if (idx !== current) {
          current = idx;
          dots.forEach((d, i) => (d.dataset.on = i === idx ? "1" : "0"));
        }
      };
      apply(0);

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });

      return () => {
        delete el.dataset.pinned;
        tl.kill();
        [sky, stars].forEach((n) => n?.removeAttribute("style"));
        if (sun) sun.style.transform = "";
      };
    });

    return () => mm.revert();
  });

  return (
    <section
      id="layanan"
      ref={root}
      data-kit-hover
      className="group relative bg-night text-white data-[pinned=true]:h-[560vh] max-md:data-[pinned=true]:h-[480vh]"
    >
      <h2 className="sr-only">Layanan pendukung Sigap Medika</h2>

      <div className="relative overflow-hidden group-data-[pinned=true]:sticky group-data-[pinned=true]:top-0 group-data-[pinned=true]:h-screen">
        <div data-sky className="support-sky absolute inset-x-0 top-0 h-full will-change-transform group-data-[pinned=true]:h-[500%]" />
        <div data-stars className="absolute inset-0 opacity-0">
          <div className="stars" />
        </div>
        <div
          data-sun
          aria-hidden
          className="absolute top-[5%] right-[-4%] hidden aspect-square w-[clamp(130px,17vw,280px)] rounded-full will-change-transform group-data-[pinned=true]:block"
          style={{ background: "radial-gradient(circle, #FFEBAE 0%, #FFC53D 40%, rgba(255,197,61,0.38) 54%, rgba(255,197,61,0) 70%)" }}
        />

        {POINTS.map((p) => (
          <div
            key={p.title}
            data-point
            className="relative grid place-items-center px-4 py-20 group-data-[pinned=true]:absolute group-data-[pinned=true]:inset-0 group-data-[pinned=true]:py-0 group-data-[pinned=true]:pb-[8vh]"
          >
            <div className="max-w-[min(92vw,860px)] text-center [perspective:1700px]">
              <p data-t className="mx-auto w-fit rounded-full border border-white/35 px-3.5 py-2 text-[15px] leading-none font-bold tracking-wide uppercase">
                {p.cap}
              </p>
              <h3 data-t className="display d-3 mx-auto mt-5 max-w-[11ch]">
                {p.title}
              </h3>
              <p data-t className="lead mt-5 whitespace-pre-line text-white/90">
                {p.body}
              </p>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0 hidden group-data-[pinned=true]:block" aria-hidden>
          {POINTS.map((p) => (
            <div key={p.title} data-group>
              {p.media.map((m, i) =>
                m.kind === "photo" ? (
                  <img
                    key={i}
                    data-m
                    src={m.src}
                    alt=""
                    className={`absolute rounded-2xl object-cover shadow-[0_24px_50px_-18px_rgba(0,0,0,0.55)] will-change-transform ${m.pos} ${
                      m.tall ? "w-[clamp(98px,9vw+46px,240px)]" : "w-[clamp(124px,12vw+56px,300px)]"
                    }`}
                    style={{ rotate: `${m.rot}deg` }}
                  />
                ) : (
                  <div
                    key={i}
                    data-m
                    className={`absolute grid aspect-square w-[clamp(84px,7vw+26px,150px)] place-content-center justify-items-center gap-1 rounded-full text-center shadow-[0_18px_40px_-16px_rgba(0,0,0,0.5)] will-change-transform ${m.pos} ${m.tone}`}
                    style={{ rotate: `${m.rot}deg` }}
                  >
                    <m.icon className="h-auto w-[34%]" strokeWidth={2.2} />
                    <span className="px-2 text-[clamp(10.5px,0.45vw+8.5px,15px)] leading-tight font-bold">{m.label}</span>
                  </div>
                ),
              )}
            </div>
          ))}
        </div>

        <div
          className="absolute top-1/2 right-[clamp(12px,2vw,30px)] hidden -translate-y-1/2 justify-items-center gap-2 group-data-[pinned=true]:grid"
          aria-hidden
        >
          {POINTS.map((p, i) => (
            <span
              key={p.title}
              data-dot
              data-on={i === 0 ? "1" : "0"}
              className="h-2 w-2 rounded-full bg-white/40 transition-all duration-500 ease-expo data-[on='1']:h-7 data-[on='1']:bg-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
