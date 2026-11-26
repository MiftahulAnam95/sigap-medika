import type { CSSProperties, ReactNode } from "react";

type Part = { night?: boolean; className?: string };

const display: CSSProperties = { fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: "-0.04em" };

const DAY = {
  frame: "#0B3B30",
  fascia: "#0B3B30",
  fasciaText: "#F5EBD8",
  awnA: "#12B886",
  awnB: "#FFF8EA",
  awnShade: "rgba(11,59,48,.2)",
  inside: "#DDF2F1",
  door: "#C6EAEE",
  shelf: "#0B3B30",
  plinth: "#D9C6A2",
  step: "#C7B189",
  sign: "#12B886",
  streak: "rgba(255,255,255,.55)",
};
const NIGHT: typeof DAY = {
  frame: "#070B2E",
  fascia: "#0A1140",
  fasciaText: "#FFF3C4",
  awnA: "#0D8F6B",
  awnB: "#D9D3C4",
  awnShade: "rgba(40,20,0,.28)",
  inside: "#FFE9A6",
  door: "#FFDF86",
  shelf: "#3A2A14",
  plinth: "#2E3578",
  step: "#252B66",
  sign: "#27E0A4",
  streak: "rgba(255,255,255,.3)",
};

/* ------------------------------------------------------------------ */
/* Storefront                                                          */
/* ------------------------------------------------------------------ */
export function Storefront({ night = false, className }: Part) {
  const c = night ? NIGHT : DAY;
  const id = night ? "n" : "d";
  const sw = 1180 / 14;

  return (
    <svg viewBox="0 0 1220 800" className={className} aria-hidden>
      <defs>
        <clipPath id={`wl-${id}`}>
          <rect x="84" y="350" width="352" height="366" rx="6" />
        </clipPath>
        <clipPath id={`wr-${id}`}>
          <rect x="784" y="350" width="352" height="366" rx="6" />
        </clipPath>
        <clipPath id={`dr-${id}`}>
          <rect x="460" y="350" width="300" height="414" rx="6" />
        </clipPath>
        <filter id={`glow-${id}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {night && (
        <rect x="50" y="320" width="1120" height="450" fill="#FFD877" opacity=".38" filter={`url(#glow-${id})`} />
      )}

      {/* projecting pharmacy cross */}
      <rect x="101" y="94" width="14" height="32" fill={c.frame} />
      {night && <rect x="56" y="0" width="104" height="104" rx="20" fill={c.sign} opacity=".8" filter={`url(#glow-${id})`} />}
      <rect x="62" y="6" width="92" height="92" rx="17" fill={c.sign} stroke={c.frame} strokeWidth="6" />
      <path className="sign-blink" d="M108 27v50M83 52h50" stroke="#fff" strokeWidth="17" />

      {/* gooseneck lamps */}
      {[330, 610, 890].map((x) => (
        <g key={x}>
          {night && <path d={`M${x + 18} 92h28l52 156H${x - 34}z`} fill="#FFE9A6" opacity=".14" />}
          <path d={`M${x} 124v-22q0-16 16-16h8`} fill="none" stroke={c.frame} strokeWidth="6" strokeLinecap="round" />
          <path d={`M${x + 18} 76h28l6 17h-40z`} fill={c.frame} />
        </g>
      ))}

      {/* fascia sign */}
      <rect x="40" y="122" width="1140" height="130" rx="12" fill={c.fascia} />
      <rect x="52" y="134" width="1116" height="106" rx="7" fill="none" stroke={c.fasciaText} strokeWidth="2.5" opacity=".26" />
      <circle cx="226" cy="187" r="35" fill="#12B886" />
      <path d="M226 166v42M205 187h42" stroke="#fff" strokeWidth="13" />
      <text x="596" y="215" textAnchor="middle" fontSize="80" fill={c.fasciaText} style={display}>
        SIGAP MEDIKA
      </text>
      <rect x="946" y="158" width="184" height="58" rx="29" fill="#FF5C4D" />
      <text x="1038" y="199" textAnchor="middle" fontSize="33" fill="#fff" style={{ ...display, letterSpacing: "0" }}>
        24 JAM
      </text>

      {/* shop body */}
      <rect x="60" y="250" width="1100" height="550" fill={c.frame} />

      {/* left window: shelves */}
      <g clipPath={`url(#wl-${id})`}>
        <rect x="84" y="350" width="352" height="366" fill={c.inside} />
        {/* shelf 1 */}
        <rect x="104" y="398" width="64" height="70" fill="#FF5C4D" />
        <path d="M136 418v30M121 433h30" stroke="#fff" strokeWidth="9" />
        <rect x="184" y="420" width="38" height="48" rx="6" fill="#12B886" />
        <rect x="192" y="406" width="22" height="16" rx="3" fill="#FFF8EA" />
        <rect x="238" y="414" width="80" height="54" fill="#FFF8EA" />
        <rect x="238" y="432" width="80" height="14" fill="#12B886" />
        <rect x="334" y="390" width="44" height="78" fill="#0E9F74" />
        <rect x="340" y="410" width="32" height="22" fill="#FFF8EA" />
        <rect x="392" y="422" width="30" height="46" rx="6" fill="#FFC53D" />
        <rect x="398" y="410" width="18" height="14" fill={c.shelf} />
        {/* shelf 2 */}
        <path d="M134 528v-12q0-8 8-8h20q8 0 8 8v12" fill="none" stroke={c.shelf} strokeWidth="6" />
        <rect x="104" y="526" width="96" height="62" rx="8" fill="#FF5C4D" />
        <circle cx="152" cy="557" r="19" fill="#FFF8EA" />
        <path d="M152 546v22M141 557h22" stroke="#12B886" strokeWidth="7" />
        <rect x="218" y="548" width="72" height="40" fill="#FFF8EA" />
        <rect x="226" y="510" width="58" height="38" fill="#5BD6A8" />
        {[
          [322, 570],
          [360, 570],
          [341, 538],
        ].map(([x, y]) => (
          <g key={`${x}${y}`}>
            <circle cx={x} cy={y} r="18" fill="#FFF8EA" stroke="#D9C6A2" strokeWidth="4" />
            <circle cx={x} cy={y} r="6" fill="#D9C6A2" />
          </g>
        ))}
        <rect x="392" y="520" width="30" height="68" fill="#FF8E80" />
        {/* shelf 3 */}
        <rect x="104" y="644" width="92" height="64" rx="9" fill="#FFF8EA" />
        <rect x="114" y="654" width="50" height="30" rx="4" fill="#0E9F74" />
        <circle cx="178" cy="668" r="7" fill="#FF5C4D" />
        <rect x="212" y="658" width="84" height="50" fill="#BFE5EC" />
        <rect x="212" y="658" width="84" height="12" fill="#8CCBD6" />
        <path d="M330 650v-14h14" fill="none" stroke={c.shelf} strokeWidth="5" />
        <rect x="312" y="650" width="36" height="58" rx="7" fill="#FFF8EA" />
        <rect x="318" y="670" width="24" height="18" fill="#12B886" />
        <rect x="364" y="636" width="54" height="72" fill="#FF5C4D" />
        <rect x="372" y="656" width="38" height="20" fill="#FFF8EA" />
        {/* boards */}
        {[468, 588, 708].map((y) => (
          <rect key={y} x="84" y={y} width="352" height="9" fill={c.shelf} />
        ))}
        <path d="M176 350h60L116 716H56zM268 350h20L168 716h-20z" fill={c.streak} />
      </g>

      {/* door */}
      <g clipPath={`url(#dr-${id})`}>
        <rect x="460" y="350" width="300" height="414" fill={c.door} />
        <rect x="460" y="430" width="300" height="8" fill={c.shelf} opacity=".14" />
        <rect x="460" y="500" width="300" height="8" fill={c.shelf} opacity=".14" />
        <rect x="460" y="640" width="300" height="124" fill={c.shelf} opacity=".14" />
        <path d="M500 350h44L444 764h-44zM700 350h16L616 764h-16z" fill={c.streak} />
        <rect x="606" y="350" width="8" height="414" fill={c.frame} />
        <rect x="584" y="520" width="11" height="84" rx="5.5" fill={c.frame} />
        <rect x="625" y="520" width="11" height="84" rx="5.5" fill={c.frame} />
        <circle cx="533" cy="452" r="31" fill="#12B886" />
        <path d="M533 434v36M515 452h36" stroke="#fff" strokeWidth="11" />
        <path d="M687 372l-28 54M687 372l28 54" stroke={c.frame} strokeWidth="3" />
        <g transform="rotate(-5 687 450)">
          <rect x="640" y="424" width="94" height="50" rx="9" fill="#FF5C4D" stroke={c.frame} strokeWidth="5" />
          <text x="687" y="460" textAnchor="middle" fontSize="29" fill="#fff" style={{ ...display, letterSpacing: "0" }}>
            BUKA
          </text>
        </g>
      </g>

      {/* right window: mobility aids */}
      <g clipPath={`url(#wr-${id})`}>
        <rect x="784" y="350" width="352" height="366" fill={c.inside} />
        <rect x="784" y="686" width="352" height="30" fill={c.shelf} opacity=".16" />
        <g transform="translate(800 458) scale(1.2)">
          <g fill="none" stroke={c.shelf} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M134 40l24-8M72 110l-12 44-24 6M74 84h46" />
            <circle cx="114" cy="132" r="50" />
          </g>
          <circle cx="114" cy="132" r="36" fill="none" stroke="#12B886" strokeWidth="6" />
          <circle cx="114" cy="132" r="9" fill={c.shelf} />
          <rect x="62" y="96" width="70" height="18" rx="7" fill="#FF5C4D" stroke={c.shelf} strokeWidth="6" />
          <rect x="120" y="34" width="18" height="74" rx="8" fill="#FF5C4D" stroke={c.shelf} strokeWidth="6" />
          <circle cx="48" cy="166" r="14" fill="#FFF8EA" stroke={c.shelf} strokeWidth="7" />
        </g>
        <path d="M1074 398v290M1046 402h56M1042 690h64" fill="none" stroke={c.shelf} strokeWidth="7" strokeLinecap="round" />
        <rect x="1032" y="408" width="30" height="48" rx="8" fill="#BFE5EC" stroke={c.shelf} strokeWidth="4" />
        <path d="M1047 456v40" stroke={c.shelf} strokeWidth="3" />
        <path d="M880 350h60L820 716h-60zM972 350h20L872 716h-20z" fill={c.streak} />
      </g>

      {/* plinths + step */}
      {[84, 784].map((x) => (
        <g key={x}>
          <rect x={x} y="728" width="352" height="72" fill={c.plinth} />
          <path d={`M${x + 88} 728v72M${x + 176} 728v72M${x + 264} 728v72`} stroke={c.frame} strokeWidth="3" opacity=".25" />
        </g>
      ))}
      <rect x="448" y="772" width="324" height="28" fill={c.step} />

      {/* awning */}
      <rect x="60" y="340" width="1100" height="24" fill={c.awnShade} />
      <rect x="20" y="246" width="1180" height="14" fill={c.frame} />
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + i * sw} 258h${sw}v58a${sw / 2} 24 0 0 1 ${-sw} 0z`}
          fill={i % 2 ? c.awnB : c.awnA}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */
export function Scooter({ night = false, className }: Part) {
  const ink = night ? "#070B2E" : "#0B3B30";
  return (
    <svg viewBox="0 0 420 300" className={className} style={{ overflow: "visible" }} aria-hidden>
      {night && <path d="M84 126-70 86v110z" fill="#FFE9A6" opacity=".22" />}
      <rect x="252" y="50" width="132" height="102" rx="12" fill="#FFF8EA" stroke={ink} strokeWidth="7" />
      <path d="M318 75v52M292 101h52" stroke="#12B886" strokeWidth="17" />
      <path d="M262 152h112v15H262z" fill={ink} />
      <path
        d="M150 252l22-78q4-12 16-12h112q52 4 60 60v30z"
        fill="#12B886"
        stroke={ink}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <rect x="184" y="146" width="122" height="24" rx="12" fill={ink} />
      <path d="M116 236h74v18h-74z" fill={ink} />
      <path d="M104 118 82 238" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <path
        d="M100 122q40-4 52 40l14 76h-40q-6-66-34-106z"
        fill="#12B886"
        stroke={ink}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M84 96l48-6M112 92l-8 28" fill="none" stroke={ink} strokeWidth="9" strokeLinecap="round" />
      <circle cx="92" cy="130" r="13" fill="#FFC53D" stroke={ink} strokeWidth="6" />
      {[82, 322].map((x) => (
        <g key={x}>
          <circle cx={x} cy="252" r="42" fill={ink} />
          <circle cx={x} cy="252" r="19" fill="#EADBBF" />
          <circle cx={x} cy="252" r="6" fill={ink} />
        </g>
      ))}
    </svg>
  );
}

function Tree({ night = false, className }: Part) {
  const [a, b, c2, trunk] = night
    ? ["#0A4A5C", "#0C5E70", "#16808A", "#2A2350"]
    : ["#0E9F74", "#12B886", "#5BD6A8", "#7A5A3C"];
  return (
    <svg viewBox="0 0 300 560" className={className} aria-hidden>
      <path d="M138 560l8-250h18l8 250z" fill={trunk} />
      <path d="M154 364l-42-52M158 342l46-54" stroke={trunk} strokeWidth="12" strokeLinecap="round" />
      <circle cx="150" cy="170" r="120" fill={a} />
      <circle cx="86" cy="236" r="78" fill={b} />
      <circle cx="216" cy="232" r="84" fill={b} />
      <circle cx="176" cy="120" r="70" fill={c2} opacity=".55" />
      <circle cx="104" cy="150" r="46" fill={c2} opacity=".4" />
    </svg>
  );
}

function Lamp({ night = false, className }: Part) {
  const ink = night ? "#070B2E" : "#0B3B30";
  return (
    <svg viewBox="0 0 160 560" className={className} style={{ overflow: "visible" }} aria-hidden>
      {night && <path d="M36 50-90 560h230z" fill="#FFE9A6" opacity=".13" />}
      <rect x="110" y="40" width="12" height="520" rx="6" fill={ink} />
      <path d="M116 46q0-28-28-28H48" fill="none" stroke={ink} strokeWidth="10" strokeLinecap="round" />
      <path d="M14 20h44l8 22H6z" fill={ink} />
      <ellipse cx="36" cy="45" rx="21" ry="9" fill={night ? "#FFE9A6" : "#FFF8EA"} />
      <rect x="100" y="522" width="32" height="38" rx="6" fill={ink} />
    </svg>
  );
}

function Skyline({ night = false, className }: Part) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMaxYMax slice" className={className} aria-hidden>
      <g fill="currentColor">
        <rect x="0" y="150" width="60" height="150" />
        <rect x="52" y="96" width="46" height="204" />
        <rect x="104" y="172" width="70" height="128" />
        <path d="M194 300v-42h11V108l7-24 7 24v150h11v42z" />
        <rect x="240" y="120" width="56" height="180" />
        <rect x="288" y="192" width="60" height="108" />
        <rect x="340" y="140" width="60" height="160" />
      </g>
      <circle cx="212" cy="80" r="7" fill="#FFC53D" />
      {night && (
        <g fill="#FFD877" opacity=".75">
          {[
            [62, 112],
            [78, 140],
            [62, 190],
            [252, 136],
            [272, 136],
            [252, 172],
            [272, 208],
            [352, 156],
            [372, 190],
            [118, 190],
            [142, 214],
            [16, 170],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="9" height="12" />
          ))}
        </g>
      )}
    </svg>
  );
}

const CLOUD = "M24 62a22 22 0 0 1 4-43 34 34 0 0 1 64-6 26 26 0 0 1 44 24 13 13 0 0 1-4 25z";

/* ------------------------------------------------------------------ */
/* Composed scene                                                      */
/* ------------------------------------------------------------------ */
export function StoreScene({
  night = false,
  fence = false,
  children,
}: {
  night?: boolean;
  fence?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`scene ${night ? "scene--night" : ""}`} aria-hidden>
      <div className="scene__sky" />
      {night ? (
        <>
          <div className="stars" />
          <div className="scene__moon" />
        </>
      ) : (
        <>
          <svg viewBox="0 0 160 70" className="scene__cloud" style={{ left: "3%", top: "24%" }}>
            <path d={CLOUD} fill="currentColor" />
          </svg>
          <svg
            viewBox="0 0 160 70"
            className="scene__cloud"
            style={{ right: "6%", top: "16%", animationDelay: "-11s", scale: "0.8" }}
          >
            <path d={CLOUD} fill="currentColor" />
          </svg>
        </>
      )}
      <Skyline night={night} className="scene__far scene__far--l" />
      <Skyline night={night} className="scene__far scene__far--r" />
      <div className="scene__facade" />
      <Tree night={night} className="scene__tree" />
      <Lamp night={night} className="scene__lamp" />
      <Storefront night={night} className="scene__store" />
      <div className="scene__pavement" />
      <div className="scene__road" />
      <Scooter night={night} className="scene__scooter" />
      {fence && <div className="scene__fence" />}
      {children}
    </div>
  );
}
