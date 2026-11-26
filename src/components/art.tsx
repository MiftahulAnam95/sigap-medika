import type { CSSProperties, ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
type Art = { className?: string; style?: CSSProperties };

export const INK = "#0B3B30";
const numStyle: CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 800 };

/* ------------------------------------------------------------------ */
/* UI icons (24px, stroke = currentColor)                              */
/* ------------------------------------------------------------------ */
function Ico({ children, ...p }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  );
}

export const IconArrowRight = (p: P) => (
  <Ico {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Ico>
);
export const IconArrowDown = (p: P) => (
  <Ico {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Ico>
);
export const IconDownload = (p: P) => (
  <Ico {...p}>
    <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
  </Ico>
);
export const IconClose = (p: P) => (
  <Ico {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);
export const IconMenu = (p: P) => (
  <Ico {...p}>
    <path d="M4 8h16M4 16h16" />
  </Ico>
);
export const IconCheck = (p: P) => (
  <Ico {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Ico>
);
export const IconPlay = (p: P) => (
  <Ico {...p}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </Ico>
);
export const IconPause = (p: P) => (
  <Ico {...p}>
    <path d="M8 5v14M16 5v14" strokeWidth={3} />
  </Ico>
);
export const IconVolume = (p: P) => (
  <Ico {...p}>
    <path d="M4 10v4h3l5 4V6l-5 4z" fill="currentColor" />
    <path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.5a8 8 0 0 1 0 11" />
  </Ico>
);
export const IconMute = (p: P) => (
  <Ico {...p}>
    <path d="M4 10v4h3l5 4V6l-5 4z" fill="currentColor" />
    <path d="m16.5 9.5 5 5M21.5 9.5l-5 5" />
  </Ico>
);
export const IconShield = (p: P) => (
  <Ico {...p}>
    <path d="m12 3 7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </Ico>
);
export const IconTag = (p: P) => (
  <Ico {...p}>
    <path d="M3 11.5V4h7.5L21 14.5 14.5 21z" />
    <circle cx="7.6" cy="8.6" r="1.4" />
  </Ico>
);
export const IconTruck = (p: P) => (
  <Ico {...p}>
    <path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z" />
    <circle cx="6.5" cy="17.5" r="2" />
    <circle cx="17" cy="17.5" r="2" />
  </Ico>
);
export const IconWrench = (p: P) => (
  <Ico {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z" />
  </Ico>
);
export const IconPhone = (p: P) => (
  <Ico {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </Ico>
);
export const IconChat = (p: P) => (
  <Ico {...p}>
    <path d="M4 5h16v11H10l-6 4z" />
  </Ico>
);
export const IconBox = (p: P) => (
  <Ico {...p}>
    <path d="m3 8 9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8" />
  </Ico>
);
export const IconUsers = (p: P) => (
  <Ico {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.7.8 2.7 2.5 3 5.2" />
  </Ico>
);
export const IconBook = (p: P) => (
  <Ico {...p}>
    <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v13c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v13" />
  </Ico>
);
export const IconHeart = (p: P) => (
  <Ico {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  </Ico>
);
export const IconFlask = (p: P) => (
  <Ico {...p}>
    <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3M7.5 15h9" />
  </Ico>
);
export const IconHome = (p: P) => (
  <Ico {...p}>
    <path d="m3 11 9-7 9 7v9H3zM9.5 20v-6h5v6" />
  </Ico>
);
export const IconPulse = (p: P) => (
  <Ico {...p}>
    <path d="M2 12h4l2.5-6 4 12 3-9 1.5 3h5" />
  </Ico>
);

/* Social glyphs drawn inside a 32px disc */
export const SOCIAL: Record<string, ReactNode> = {
  instagram: (
    <>
      <rect x="9.5" y="9.5" width="13" height="13" rx="4" fill="none" strokeWidth="1.8" stroke="currentColor" />
      <circle cx="16" cy="16" r="3.1" fill="none" strokeWidth="1.8" stroke="currentColor" />
      <circle cx="19.8" cy="12.2" r="1" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M17.2 23v-6.3h2.1l.3-2.5h-2.4v-1.5c0-.7.2-1.2 1.2-1.2h1.3V9.3c-.2 0-1-.1-1.9-.1-1.9 0-3.1 1.1-3.1 3.2v1.8h-2.1v2.5h2.1V23z"
    />
  ),
  youtube: (
    <>
      <rect x="8.5" y="11" width="15" height="10.4" rx="3.4" fill="currentColor" />
      <path d="m14.6 13.7 4.3 2.5-4.3 2.5z" fill="var(--disc)" />
    </>
  ),
  linkedin: (
    <path
      fill="currentColor"
      d="M10.3 13.6h2.4V22h-2.4zm1.2-3.9a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zm3 3.9h2.3v1.2c.4-.8 1.4-1.4 2.6-1.4 2.3 0 2.9 1.5 2.9 3.6v5h-2.4v-4.4c0-1.1-.2-2-1.4-2s-1.6.9-1.6 2V22h-2.4z"
    />
  ),
};

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */
export function LogoMark({ className, style }: Art) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden>
      <rect width="64" height="64" rx="18" fill="#12B886" />
      <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#fff" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8 flex-none" />
      <span className="font-display text-[1.3rem] leading-none font-extrabold tracking-[-0.045em]">
        sigap<span className="font-medium opacity-70">medika</span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* First-aid kit — a true 3D cuboid built from six CSS faces           */
/* ------------------------------------------------------------------ */
export function Kit() {
  return (
    <span className="kit" aria-hidden>
      <i className="f" />
      <i className="b" />
      <i className="l" />
      <i className="r" />
      <i className="t" />
      <i className="u" />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Product illustrations (sticker style)                               */
/* ------------------------------------------------------------------ */
export function Stethoscope({ className, style }: Art) {
  const yoke = "M64 26c-14 0-18 12-16 28l12 44c4 18 18 28 38 28s34-10 38-28l12-44c2-16-2-28-16-28";
  const tube = "M98 126v18c0 26 22 38 44 30 12-5 18-16 16-30";
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={yoke} stroke={INK} strokeWidth="17" />
        <path d={yoke} stroke="#5BD6A8" strokeWidth="6.5" />
        <path d={tube} stroke={INK} strokeWidth="17" />
        <path d={tube} stroke="#12B886" strokeWidth="6.5" />
      </g>
      <circle cx="64" cy="26" r="9.5" fill="#FF5C4D" stroke={INK} strokeWidth="5" />
      <circle cx="132" cy="26" r="9.5" fill="#FF5C4D" stroke={INK} strokeWidth="5" />
      <circle cx="158" cy="128" r="26" fill="#FFF8EA" stroke={INK} strokeWidth="6" />
      <circle cx="158" cy="128" r="10.5" fill="#FF5C4D" stroke={INK} strokeWidth="5" />
    </svg>
  );
}

export function Thermometer({ className, style }: Art) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <g transform="rotate(-32 100 100)">
        <rect x="148" y="88" width="44" height="24" rx="12" fill="#C9D8D4" stroke={INK} strokeWidth="6" />
        <rect x="12" y="71" width="146" height="58" rx="29" fill="#FFF8EA" stroke={INK} strokeWidth="6" />
        <rect x="38" y="83" width="68" height="34" rx="9" fill="#0E9F74" stroke={INK} strokeWidth="5" />
        <text x="72" y="107" textAnchor="middle" fontSize="20" fill="#fff" style={numStyle}>
          36.5
        </text>
        <circle cx="131" cy="100" r="9.5" fill="#FF5C4D" stroke={INK} strokeWidth="5" />
      </g>
    </svg>
  );
}

export function Tensimeter({ className, style }: Art) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <path d="M112 100c30-8 36 6 40 20" fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <rect x="116" y="104" width="70" height="80" rx="17" fill="#12B886" stroke={INK} strokeWidth="6" />
      <path d="M119 130h64M119 158h64" stroke={INK} strokeWidth="4" opacity=".3" />
      <rect x="139" y="135" width="24" height="17" rx="5" fill="#FFF8EA" stroke={INK} strokeWidth="4" />
      <rect x="14" y="22" width="106" height="128" rx="19" fill="#FFF8EA" stroke={INK} strokeWidth="6" />
      <rect x="28" y="36" width="78" height="62" rx="10" fill="#D5F4E8" stroke={INK} strokeWidth="5" />
      <text x="67" y="64" textAnchor="middle" fontSize="24" fill={INK} style={numStyle}>
        120
      </text>
      <text x="67" y="89" textAnchor="middle" fontSize="22" fill={INK} style={numStyle}>
        80
      </text>
      <circle cx="45" cy="124" r="10.5" fill="#FF5C4D" stroke={INK} strokeWidth="5" />
      <rect x="66" y="116" width="40" height="16" rx="8" fill={INK} opacity=".16" />
    </svg>
  );
}

export function Oximeter({ className, style }: Art) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <g transform="rotate(-14 100 100)">
        <rect x="32" y="104" width="130" height="46" rx="21" fill="#12B886" stroke={INK} strokeWidth="6" />
        <rect x="24" y="48" width="144" height="64" rx="27" fill="#FFF8EA" stroke={INK} strokeWidth="6" />
        <rect x="50" y="60" width="84" height="40" rx="11" fill={INK} />
        <text x="75" y="89" textAnchor="middle" fontSize="25" fill="#5BD6A8" style={numStyle}>
          98
        </text>
        <path
          d="M97 84h6l4-10 5 16 4-6h7"
          fill="none"
          stroke="#FF5C4D"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="152" cy="108" r="8" fill={INK} />
      </g>
    </svg>
  );
}

export function PillBottle({ className, style }: Art) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <rect x="52" y="60" width="96" height="124" rx="17" fill="#FFC53D" stroke={INK} strokeWidth="6" />
      <rect x="55" y="98" width="90" height="56" fill="#FFF8EA" />
      <path d="M100 108v36M82 126h36" stroke="#12B886" strokeWidth="11" />
      <rect x="43" y="22" width="114" height="46" rx="12" fill="#FFF8EA" stroke={INK} strokeWidth="6" />
      <path d="M66 33v24M83 33v24M100 33v24M117 33v24M134 33v24" stroke={INK} strokeWidth="4" opacity=".28" strokeLinecap="round" />
    </svg>
  );
}

export function Mask({ className, style }: Art) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <path
        d="M40 80C6 78 4 124 40 124M160 80c34-2 36 44 0 44"
        fill="none"
        stroke={INK}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="37" y="56" width="126" height="90" rx="19" fill="#BFE5EC" stroke={INK} strokeWidth="6" />
      <path d="M50 84h100M50 101h100M50 118h100" stroke={INK} strokeWidth="4" opacity=".32" strokeLinecap="round" />
      <path d="M72 66h56" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function Wheelchair({ className, style }: Art) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden>
      <g fill="none" stroke={INK} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M134 40l24-8M72 110l-12 44-24 6M74 84h46" />
        <circle cx="114" cy="132" r="50" />
      </g>
      <circle cx="114" cy="132" r="36" fill="none" stroke="#12B886" strokeWidth="6" />
      <circle cx="114" cy="132" r="9" fill={INK} />
      <rect x="62" y="96" width="70" height="18" rx="7" fill="#FF5C4D" stroke={INK} strokeWidth="6" />
      <rect x="120" y="34" width="18" height="74" rx="8" fill="#FF5C4D" stroke={INK} strokeWidth="6" />
      <circle cx="48" cy="166" r="14" fill="#FFF8EA" stroke={INK} strokeWidth="7" />
    </svg>
  );
}

export function Plaster({ className, style }: Art) {
  return (
    <svg viewBox="0 0 320 160" className={className} style={style} aria-hidden>
      <g transform="rotate(-12 160 80)">
        <rect x="18" y="46" width="284" height="68" rx="34" fill="#FFB8A0" stroke={INK} strokeWidth="6" />
        <rect x="116" y="46" width="88" height="68" fill="#FFF8EA" stroke={INK} strokeWidth="6" />
        <path d="M160 63v34M143 80h34" stroke="#12B886" strokeWidth="10" />
        <g fill={INK} opacity=".42">
          <circle cx="54" cy="66" r="4.2" />
          <circle cx="54" cy="94" r="4.2" />
          <circle cx="84" cy="80" r="4.2" />
          <circle cx="266" cy="66" r="4.2" />
          <circle cx="266" cy="94" r="4.2" />
          <circle cx="236" cy="80" r="4.2" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Basket — drawn in two layers so products can drop *into* it         */
/* ------------------------------------------------------------------ */
export function BasketBack({ className, style }: Art) {
  return (
    <svg viewBox="0 0 500 500" className={className} style={style} aria-hidden>
      <path d="M92 178C92 4 408 4 408 178" fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <path d="M92 178C92 4 408 4 408 178" fill="none" stroke="#FFC53D" strokeWidth="8" strokeLinecap="round" />
      <path d="M30 172A220 52 0 0 1 470 172L456 270H44Z" fill="#0A7A5C" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
    </svg>
  );
}

export function BasketFront({ className, style }: Art) {
  const rowA = [98, 136, 174, 304, 342, 380];
  const rowC = [112, 150, 328, 366];
  return (
    <svg viewBox="0 0 500 500" className={className} style={style} aria-hidden>
      <path
        d="M30 172A220 52 0 0 0 470 172L430 450Q426 486 390 486H110Q74 486 70 450Z"
        fill="#12B886"
        stroke={INK}
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <g fill="#0C8F68">
        {rowA.map((x) => (
          <rect key={`a${x}`} x={x} y="264" width="22" height="48" rx="11" />
        ))}
        {rowC.map((x) => (
          <rect key={`c${x}`} x={x} y="404" width="22" height="48" rx="11" />
        ))}
      </g>
      <path d="M38 182A212 50 0 0 0 462 182" fill="none" stroke="#5BD6A8" strokeWidth="12" strokeLinecap="round" />
      <circle cx="250" cy="352" r="64" fill="#FFFDF7" stroke={INK} strokeWidth="8" />
      <path d="M250 316v72M214 352h72" stroke="#12B886" strokeWidth="22" />
    </svg>
  );
}
