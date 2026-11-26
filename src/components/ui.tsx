import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { gsap, prefersReduced, scroller, ScrollTrigger } from "../lib/motion";
import { IconArrowDown, IconArrowRight, IconCheck, IconClose, IconDownload, IconMenu, IconPhone, Logo } from "./art";

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */
type ButtonProps = {
  label?: string;
  variant?: "primary" | "light" | "ghost" | "brand" | "glass";
  size?: "md" | "sm";
  icon?: "arrow" | "download" | "down" | "close" | "phone" | "none";
  iconFirst?: boolean;
  href?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
  className?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
};

const ICONS = { arrow: IconArrowRight, download: IconDownload, down: IconArrowDown, close: IconClose, phone: IconPhone };

export function Button({
  label,
  variant = "primary",
  size = "md",
  icon = "arrow",
  iconFirst = false,
  href,
  type = "button",
  ariaLabel,
  className = "",
  onClick,
}: ButtonProps) {
  const Icon = icon === "none" ? null : ICONS[icon];
  const vertical = icon === "download" || icon === "down";
  const iconEl = Icon && (
    <span className={`btn__icon ${vertical ? "btn__icon--down" : ""}`}>
      <Icon />
      <Icon />
    </span>
  );
  const cls = `btn btn--${variant} ${size === "sm" ? "btn--sm" : ""} ${label ? "" : "btn--icon"} ${className}`;
  const inner = (
    <>
      <span className="btn__bg" />
      <span className="btn__in">
        {iconFirst && iconEl}
        {label && (
          <span className="btn__label">
            <span>{label}</span>
            <span aria-hidden>{label}</span>
          </span>
        )}
        {!iconFirst && iconEl}
      </span>
    </>
  );
  return href ? (
    <a href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
      {inner}
    </a>
  ) : (
    <button type={type} className={cls} aria-label={ariaLabel} onClick={onClick}>
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Loader: a tilted curtain that lifts off the page                    */
/* ------------------------------------------------------------------ */
export function Loader({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const curtain = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const cb = useRef({ onReveal, onDone });
  cb.current = { onReveal, onDone };

  useEffect(() => {
    document.getElementById("boot")?.remove();
    scroller.lock();
    let alive = true;
    let locked = true;
    const release = () => {
      if (locked) scroller.unlock();
      locked = false;
    };

    const counter = { v: 0 };
    const count = gsap.to(counter, {
      v: 100,
      duration: prefersReduced() ? 0.4 : 1.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(2, "0");
      },
    });
    const fonts = document.fonts ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
    const cap = new Promise((resolve) => setTimeout(resolve, 3500));
    let lift: gsap.core.Tween | undefined;

    Promise.all([Promise.race([fonts, cap]), count.then()]).then(() => {
      if (!alive) return;
      ScrollTrigger.refresh();
      cb.current.onReveal();
      lift = gsap.fromTo(
        curtain.current,
        { "--p": 0 },
        {
          "--p": 1,
          duration: prefersReduced() ? 0.01 : 0.85,
          delay: 0.15,
          ease: "power2.inOut",
          onComplete: () => {
            release();
            cb.current.onDone();
          },
        },
      );
    });

    return () => {
      alive = false;
      count.kill();
      lift?.kill();
      release();
    };
  }, []);

  return (
    <div className="loader" role="status" aria-label="Memuat halaman">
      <div ref={curtain} className="loader__curtain">
        <div className="loader__inner">
          <div className="flex flex-col items-center gap-5 text-pine">
            <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden>
              <rect width="64" height="64" rx="18" fill="#fff" />
              <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#12B886" />
            </svg>
            <svg viewBox="0 0 260 60" className="ecg w-[210px]" fill="none" aria-hidden>
              <path
                d="M2 30h66l12-18 14 40 16-46 14 36 10-12h124"
                stroke="#fff"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="font-display text-lg font-extrabold tracking-tight tabular-nums">
              <span ref={num}>00</span>%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact drawer                                                      */
/* ------------------------------------------------------------------ */
export type Topic = "penawaran" | "katalog" | "kontak";

const COPY: Record<Topic, { title: string; sub: string; cta: string }> = {
  penawaran: {
    title: "Minta penawaran",
    sub: "Ceritakan kebutuhan Anda. Spesialis produk kami membalas dalam 1 jam kerja.",
    cta: "Kirim permintaan",
  },
  katalog: {
    title: "Kirim katalog ke saya",
    sub: "Katalog 2026 berisi 2.500+ produk kami kirim langsung ke WhatsApp Anda.",
    cta: "Kirim katalog",
  },
  kontak: {
    title: "Kami hubungi Anda",
    sub: "Tinggalkan nomor Anda. Tim kami menelepon balik — 24 jam, setiap hari.",
    cta: "Minta dihubungi",
  },
};

const field =
  "w-full rounded-2xl border-[1.5px] border-pine/15 bg-paper px-4 py-3.5 text-[16px] text-pine placeholder:text-pine/40 transition-colors focus:border-pine focus:outline-none";

export function ContactDrawer({ topic, onClose }: { topic: Topic | null; onClose: () => void }) {
  const open = topic !== null;
  const [shown, setShown] = useState<Topic>("penawaran");
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (topic) {
      setShown(topic);
      setSent(false);
    }
  }, [topic]);

  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    scroller.lock();
    document.documentElement.classList.add("ui-open");
    const t = window.setTimeout(() => first.current?.focus(), 380);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      scroller.unlock();
      document.documentElement.classList.remove("ui-open");
      before?.focus?.();
    };
  }, [open, onClose]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  const copy = COPY[shown];

  return (
    <div className={`fixed inset-0 z-[200] ${open ? "" : "pointer-events-none"}`} inert={!open}>
      <div
        className={`absolute inset-0 bg-pine/60 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        data-lenis-prevent
        className={`absolute top-0 right-0 flex h-full w-[min(540px,100vw)] flex-col overflow-y-auto bg-cream text-pine transition-transform duration-700 ease-expo ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-5 sm:px-9">
          <Logo />
          <Button variant="ghost" icon="close" ariaLabel="Tutup formulir" onClick={onClose} />
        </div>

        {sent ? (
          <div className="flex flex-1 flex-col items-start justify-center gap-5 px-6 pb-16 sm:px-9">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand text-pine">
              <IconCheck width={40} height={40} strokeWidth={3} />
            </span>
            <h2 className="display text-[clamp(2.4rem,7vw,3.6rem)]">
              Terima kasih{name ? `, ${name.split(" ")[0]}` : ""}!
            </h2>
            <p className="lead max-w-[32ch] text-pine/75">
              Permintaan Anda sudah kami terima. Spesialis produk kami segera menghubungi Anda lewat WhatsApp.
            </p>
            <Button label="Tutup" icon="close" onClick={onClose} />
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-1 flex-col gap-4 px-6 pt-8 pb-8 sm:px-9">
            <div className="mb-2">
              <h2 className="display text-[clamp(2.3rem,7vw,3.5rem)]">{copy.title}</h2>
              <p className="mt-3 max-w-[38ch] text-[17px] leading-snug text-pine/70">{copy.sub}</p>
            </div>
            <label className="grid gap-1.5 text-sm font-semibold">
              Nama lengkap
              <input
                ref={first}
                required
                name="nama"
                autoComplete="name"
                placeholder="dr. Ayu Lestari"
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Nama klinik / instansi <span className="sr-only">(opsional)</span>
              <input name="instansi" autoComplete="organization" placeholder="Klinik Pratama Sehat Sentosa" className={field} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Nomor WhatsApp
              <input
                required
                name="wa"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="[0-9+\s\-]{8,16}"
                title="Masukkan nomor yang valid, contoh 0812 3456 7890"
                placeholder="0812 3456 7890"
                className={field}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Kebutuhan
              <select name="kebutuhan" className={field} defaultValue={shown === "katalog" ? "katalog" : "klinik"}>
                <option value="klinik">Paket alat untuk klinik</option>
                <option value="homecare">Alat perawatan di rumah (homecare)</option>
                <option value="rs">Pengadaan rumah sakit / instansi</option>
                <option value="servis">Servis &amp; kalibrasi alat</option>
                <option value="katalog">Minta katalog produk</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Catatan <span className="sr-only">(opsional)</span>
              <textarea name="catatan" rows={3} placeholder="Contoh: butuh 2 bed periksa dan 1 EKG sebelum tanggal 20." className={field} />
            </label>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
              <Button type="submit" label={copy.cta} />
              <a href="tel:+622150902110" className="inline-flex items-center gap-2 text-[15px] font-semibold underline-offset-4 hover:underline">
                <IconPhone width={18} height={18} /> (021) 5090 2110
              </a>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
const LINKS: { label: string; href: string; offset?: number }[] = [
  { label: "Produk", href: "#produk" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "Cara Pesan", href: "#cara-pesan" },
  { label: "Layanan", href: "#layanan", offset: 0.5 },
];

export function Nav({ onContact }: { onContact: (t: Topic) => void }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (self.scroll() < 120) setHidden(false);
        else if (Math.abs(self.getVelocity()) > 80) setHidden(self.direction === 1);
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    scroller.lock();
    document.documentElement.classList.add("ui-open");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      scroller.unlock();
      document.documentElement.classList.remove("ui-open");
    };
  }, [open]);

  const go = (e: MouseEvent<HTMLElement>, href: string, offset = 0) => {
    e.preventDefault();
    setOpen(false);
    // let the scroll lock release before travelling
    window.setTimeout(() => scroller.to(href, { offset: offset * window.innerHeight }), open ? 60 : 0);
  };

  return (
    <>
      <header className={`nav ${hidden && !open ? "nav--hidden" : ""}`}>
        <a href="#top" onClick={(e) => go(e, "#top")} className="nav__chip px-3.5 text-pine" aria-label="Sigap Medika — ke atas">
          <Logo />
        </a>

        <nav className="nav__chip hidden gap-0.5 px-1.5 text-pine lg:flex" aria-label="Navigasi utama">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href, l.offset)} className="nav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button label="Minta Penawaran" size="sm" className="!hidden sm:!inline-flex" onClick={() => onContact("penawaran")} />
          <button
            type="button"
            className="nav__chip w-12 justify-center text-pine lg:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[90] bg-pine text-cream transition-[clip-path] duration-700 ease-expo lg:hidden ${
          open ? "" : "pointer-events-none"
        }`}
        style={{ clipPath: `circle(${open ? 150 : 0}% at calc(100% - 40px) 38px)` }}
        inert={!open}
      >
        <nav className="flex h-full flex-col justify-center gap-1 px-6" aria-label="Menu">
          {LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href, l.offset)}
              className={`display text-[clamp(2.6rem,13vw,5rem)] transition-[transform,opacity] duration-700 ease-expo ${
                open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              label="Minta Penawaran"
              variant="brand"
              onClick={() => {
                setOpen(false);
                onContact("penawaran");
              }}
            />
            <Button label="(021) 5090 2110" variant="glass" icon="phone" iconFirst href="tel:+622150902110" />
          </div>
        </nav>
      </div>
    </>
  );
}
