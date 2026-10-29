// Original SVG illustrations drawn for this project (one per product category).
// They are decorative: the product name and category are always shown as text nearby.

const NAVY = '#0b2545';
const TEAL = '#0f766e';
const TEAL_BRIGHT = '#14b8a6';
const MINT = '#b7e4de';
const TINT = '#e6f6f4';
const AMBER = '#c2680a';

// Shared tooth outline, also used by the logo.
export const TOOTH_PATH =
  'M56 76 C56 54 76 44 94 54 C98 56 102 56 106 54 C124 44 144 54 144 76 ' +
  'C144 100 134 110 132 134 C130 156 126 172 117 172 C108 172 108 146 100 146 ' +
  'C92 146 92 172 83 172 C74 172 70 156 68 134 C66 110 56 100 56 76 Z';

function Disc() {
  return <circle cx="100" cy="100" r="86" fill={TINT} />;
}

function CementArt() {
  return (
    <>
      <Disc />
      <path d={TOOTH_PATH} fill="#fff" stroke={NAVY} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="100" cy="64" rx="17" ry="8" fill={TEAL_BRIGHT} stroke={NAVY} strokeWidth="3" />
      <path d="M70 84 C68 98 72 108 74 120" stroke={MINT} strokeWidth="4" strokeLinecap="round" fill="none" />
      <g transform="translate(158 112) rotate(-25)">
        <rect x="-12" y="0" width="24" height="54" rx="5" fill={NAVY} />
        <rect x="-8" y="-14" width="16" height="15" rx="3" fill={TEAL_BRIGHT} stroke={NAVY} strokeWidth="3" />
        <rect x="-8" y="16" width="16" height="22" rx="3" fill="#fff" />
        <rect x="-5" y="22" width="10" height="3" rx="1.5" fill={MINT} />
        <rect x="-5" y="29" width="10" height="3" rx="1.5" fill={MINT} />
      </g>
    </>
  );
}

function CloveArt() {
  return (
    <>
      <Disc />
      <path d="M91 72 V50 a9 9 0 0 1 18 0 V72 Z" fill={TEAL} stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <rect x="86" y="70" width="28" height="16" rx="3" fill={NAVY} />
      <rect x="68" y="84" width="64" height="88" rx="14" fill={AMBER} stroke={NAVY} strokeWidth="4" />
      <rect x="76" y="112" width="48" height="40" rx="6" fill="#fff" />
      <circle cx="100" cy="124" r="4" fill="#7c4a1e" />
      <rect x="86" y="134" width="28" height="3.5" rx="1.75" fill="#cbd5e1" />
      <rect x="90" y="142" width="20" height="3.5" rx="1.75" fill="#cbd5e1" />
      <path d="M152 56 C152 56 143 68 143 75 a9 9 0 0 0 18 0 C161 68 152 56 152 56 Z" fill="#f59e0b" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <g transform="translate(40 150) rotate(-20)">
        <ellipse cx="0" cy="6" rx="4" ry="12" fill="#7c4a1e" />
        <circle cx="0" cy="-8" r="6" fill="#7c4a1e" />
      </g>
      <g transform="translate(54 160) rotate(18)">
        <ellipse cx="0" cy="6" rx="4" ry="12" fill="#92602c" />
        <circle cx="0" cy="-8" r="6" fill="#92602c" />
      </g>
    </>
  );
}

function RinseArt() {
  return (
    <>
      <Disc />
      <rect x="78" y="40" width="44" height="26" rx="6" fill={NAVY} />
      <path d="M88 44 V62 M100 44 V62 M112 44 V62" stroke="#34507a" strokeWidth="3" strokeLinecap="round" />
      <rect x="82" y="64" width="36" height="22" rx="4" fill="#fff" stroke={NAVY} strokeWidth="4" />
      <rect x="62" y="84" width="76" height="88" rx="14" fill="#fff" stroke={NAVY} strokeWidth="4" />
      <rect x="66" y="124" width="68" height="44" rx="10" fill="#2dd4bf" />
      <rect x="74" y="98" width="52" height="34" rx="6" fill="#fff" stroke={NAVY} strokeWidth="2.5" />
      <path d="M100 103 C100 103 94 111 94 115 a6 6 0 0 0 12 0 C106 111 100 103 100 103 Z" fill={TEAL_BRIGHT} />
      <rect x="82" y="122" width="36" height="3" rx="1.5" fill="#cbd5e1" />
      <path d="M148 128 h28 l-4 32 h-20 z" fill="#fff" stroke={NAVY} strokeWidth="3" strokeLinejoin="round" />
      <path d="M150 142 h24 l-2 18 h-20 z" fill="#2dd4bf" />
    </>
  );
}

function WaxArt() {
  return (
    <>
      <Disc />
      <circle cx="70" cy="124" r="38" fill="#fff" stroke={NAVY} strokeWidth="4" />
      <circle cx="70" cy="124" r="28" fill={TINT} stroke={TEAL_BRIGHT} strokeWidth="3" />
      <rect x="52" y="108" width="36" height="9" rx="4.5" fill="#fff7d6" stroke="#c9a227" strokeWidth="2" />
      <rect x="52" y="121" width="36" height="9" rx="4.5" fill="#fff7d6" stroke="#c9a227" strokeWidth="2" />
      <rect x="52" y="134" width="36" height="9" rx="4.5" fill="#fff7d6" stroke="#c9a227" strokeWidth="2" />
      <rect x="118" y="54" width="38" height="66" rx="17" fill="#fff" stroke={NAVY} strokeWidth="4" />
      <path d="M104 88 H168" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
      <rect x="128" y="80" width="18" height="15" rx="3" fill="#cbd5e1" stroke={NAVY} strokeWidth="3" />
      <circle cx="166" cy="88" r="9" fill="#fff7d6" stroke="#c9a227" strokeWidth="2.5" />
    </>
  );
}

function GuardArt() {
  return (
    <>
      <Disc />
      <path
        d="M40 122 C40 58 160 58 160 122 C160 138 148 144 140 134 C134 110 66 110 60 134 C52 144 40 138 40 122 Z"
        fill={TEAL_BRIGHT}
        stroke={NAVY}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M57 120 C62 84 138 84 143 120" stroke={TEAL} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="2 7" fill="none" />
      <path d="M82 50 c-5 -6 5 -10 0 -17 M100 50 c-5 -6 5 -10 0 -17 M118 50 c-5 -6 5 -10 0 -17" stroke="#7b8ba5" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </>
  );
}

const art = {
  cement: CementArt,
  clove: CloveArt,
  rinse: RinseArt,
  wax: WaxArt,
  guard: GuardArt,
};

export function Illustration({ type, className }) {
  const Art = art[type] || CementArt;
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <Art />
    </svg>
  );
}
