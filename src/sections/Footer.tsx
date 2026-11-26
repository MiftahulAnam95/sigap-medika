import { useRef, type CSSProperties } from "react";
import { attachSwing, useGsap } from "../lib/motion";
import { StoreScene } from "../components/StoreScene";
import { KitStop } from "../components/Traveler";
import { Button, type Topic } from "../components/ui";
import { SOCIAL } from "../components/art";

const SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/" },
];

const link =
  "relative font-semibold after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-white after:opacity-0 after:transition-all after:duration-200 hover:after:-bottom-0.5 hover:after:opacity-100";

export function Footer({ onContact }: { onContact: (t: Topic) => void }) {
  const root = useRef<HTMLElement>(null);

  useGsap(() => {
    const el = root.current;
    if (!el) return;
    return attachSwing(Array.from(el.querySelectorAll<HTMLElement>(".line")), { settle: true });
  });

  return (
    <footer id="penutup" ref={root} className="relative -mt-px bg-[#0b1038] text-white">
      <div className="footer-scene">
        <StoreScene night>
          <KitStop name="footer" className="stop--footer" docked />
        </StoreScene>

        <div className="wrap relative z-[3] flex flex-col items-center pt-[clamp(52px,9vh,120px)] text-center">
          <h2 className="display d-hero text-[#FFF3C4]">
            <span className="line">
              <span className="line-inner">Malam pun,</span>
            </span>
            <span className="line">
              <span className="line-inner">kami siaga.</span>
            </span>
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button label="Hubungi kami" variant="brand" size="sm" onClick={() => onContact("kontak")} />
            <Button label="(021) 5090 2110" variant="glass" size="sm" icon="phone" iconFirst href="tel:+622150902110" />
          </div>
        </div>
      </div>

      <div className="relative z-[4] flex flex-col items-center gap-5 bg-[#0b1038] px-[clamp(16px,2.4vw,36px)] py-6 text-[15px] lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex-row lg:justify-between lg:bg-transparent lg:bg-gradient-to-t lg:from-[#060a2a] lg:to-transparent lg:pt-12 lg:pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:flex-1 lg:justify-start">
          <button type="button" className={link} onClick={() => onContact("kontak")}>
            Layanan pelanggan
          </button>
          <a className={link} href="mailto:halo@sigapmedika.id">
            halo@sigapmedika.id
          </a>
          <span className="text-white/75">Jl. Kesehatan Raya No. 24, Jakarta Pusat</span>
        </div>

        <ul className="flex gap-4">
          {SOCIALS.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} Sigap Medika`}
                className="group block text-[#0b1038]"
              >
                <svg viewBox="0 0 32 32" className="h-8 w-8 overflow-visible" style={{ "--disc": "#fff" } as CSSProperties} aria-hidden>
                  <circle
                    cx="16"
                    cy="16"
                    r="16"
                    className="fill-white transition-[scale,fill] duration-300 ease-expo group-hover:scale-[1.2] group-hover:fill-brand"
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                  {SOCIAL[s.key]}
                </svg>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-white/75 lg:flex-1 lg:text-right">© 2026 PT Sigap Medika Nusantara</p>
      </div>
    </footer>
  );
}
