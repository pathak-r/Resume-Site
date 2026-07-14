/**
 * Ink line-art figures — Museum Wall (cream plates on olive).
 *
 * Rules: monoline strokes in ink at 2–4 opacity levels,
 * exactly one key color per figure (the element the AI touches),
 * monospace only for engineering annotation inside figures.
 * Hex colors only — CSS vars are unreliable inside SVG here.
 */

const INK = "#2C2A24";
const INK_SOFT = "#5C584C";
const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";

/* ── Hero — signature infrastructure scene (ink + four key-color nodes) ── */

export function HeroFigure() {
  return (
    <svg
      viewBox="0 0 440 360"
      width="100%"
      role="img"
      aria-label="Ink line drawing of industrial infrastructure with AI signal nodes"
    >
      <title>Infrastructure, drawn in ink</title>

      {/* ground grid */}
      <g stroke={INK} strokeWidth="0.5" opacity="0.12" fill="none">
        <path d="M 20 260 L 230 155 M 60 285 L 270 180 M 100 310 L 310 205" />
        <path d="M 180 150 L 400 260 M 130 175 L 350 285 M 230 130 L 430 230" />
      </g>

      {/* vessel */}
      <g stroke={INK} strokeWidth="1.2" fill="none">
        <ellipse cx="110" cy="98" rx="34" ry="12" />
        <path d="M 76 98 L 76 218 M 144 98 L 144 218" />
        <ellipse cx="110" cy="218" rx="34" ry="12" />
        <path d="M 86 226 L 86 258 M 134 226 L 134 258" opacity="0.5" />
        {/* top nozzle */}
        <path d="M 110 86 L 110 68 M 102 68 L 118 68" />
      </g>

      {/* pipe rack */}
      <g stroke={INK} strokeWidth="1" fill="none" opacity="0.7">
        <path d="M 210 120 L 210 250 M 226 128 L 226 258" />
        <path d="M 330 120 L 330 250 M 346 128 L 346 258" />
        <path d="M 210 150 L 330 150 M 226 158 L 346 158 M 210 150 L 226 158 M 330 150 L 346 158" />
        <path d="M 210 200 L 330 200 M 226 208 L 346 208 M 210 200 L 226 208 M 330 200 L 346 208" />
      </g>

      {/* pipe runs */}
      <g stroke={INK} strokeWidth="1.2" fill="none">
        <path d="M 144 132 L 176 132 L 176 144 L 402 144" opacity="0.85" />
        <path d="M 144 196 L 402 196" opacity="0.45" />
        <path d="M 160 202 L 390 202" opacity="0.3" />
      </g>

      {/* valve on main run */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <path d="M 250 137 L 266 151 M 250 151 L 266 137" />
      </g>

      {/* exchanger, right */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <ellipse cx="398" cy="230" rx="8" ry="15" />
        <path d="M 398 215 L 430 215 M 398 245 L 430 245" />
        <path d="M 402 144 L 402 215" opacity="0.85" />
      </g>

      {/* AI signal: four key-color nodes pulsing along the main line */}
      <circle cx="176" cy="144" r="3.5" fill="#4A6B4E" />
      <circle cx="258" cy="144" r="3.5" fill="#3D6B78" />
      <circle cx="330" cy="144" r="3.5" fill="#C45C3A" />
      <circle cx="402" cy="180" r="3.5" fill="#6B5A78" />

      {/* leader + label */}
      <path d="M 110 62 L 110 40 L 148 40" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.5" />
      <text x="153" y="43" fontSize="10" fill={INK_SOFT} fontFamily={MONO} letterSpacing="1.5">
        V-20
      </text>
      <path d="M 340 128 L 368 96 L 396 96" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.5" />
      <text x="360" y="88" fontSize="10" fill={INK_SOFT} fontFamily={MONO} letterSpacing="1.5">
        RACK-1B
      </text>

      {/* baseline rule + caption strip */}
      <rect x="24" y="316" width="392" height="1" fill={INK} opacity="0.18" />
      <text x="24" y="338" fontSize="10.5" fill={INK_SOFT} fontFamily={MONO}>
        ▸ ten years of shipping, drawn to scale
      </text>
    </svg>
  );
}

/* ── Enterprise AI Copilot — sage. Agent acting on a 3D model ── */

export function CopilotFigure() {
  const KEY = "#4A6B4E";
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      role="img"
      aria-label="Isometric 3D engineering model with an AI agent executing a command on a pump"
    >
      <title>LLM agent executing a command on a 3D engineering model</title>

      {/* platform */}
      <path d="M 60 190 L 200 120 L 340 190 L 200 260 Z" stroke={INK} strokeWidth="0.8" fill="none" opacity="0.25" />

      {/* vessel */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <ellipse cx="140" cy="66" rx="26" ry="10" />
        <path d="M 114 66 L 114 150 M 166 66 L 166 150" />
        <ellipse cx="140" cy="150" rx="26" ry="10" />
        <path d="M 122 157 L 122 182 M 158 157 L 158 182" opacity="0.5" />
      </g>

      {/* pipe vessel → pump */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <path d="M 166 122 L 222 122 L 222 158" />
        <path d="M 166 128 L 216 128 L 216 158" opacity="0.35" />
      </g>

      {/* pump block — the agent's target */}
      <g stroke={KEY} strokeWidth="1.3" fill="none">
        <path d="M 202 158 L 244 158 L 264 170 L 264 194 L 222 194 L 202 182 Z" />
        <path d="M 202 158 L 222 170 L 222 194 M 222 170 L 264 170" />
      </g>
      <rect x="192" y="148" width="84" height="56" rx="3" fill="none" stroke={KEY} strokeWidth="0.9" strokeDasharray="4 4" opacity="0.7" />
      <circle cx="192" cy="148" r="2.5" fill={KEY} />
      <circle cx="276" cy="148" r="2.5" fill={KEY} />
      <circle cx="192" cy="204" r="2.5" fill={KEY} />
      <circle cx="276" cy="204" r="2.5" fill={KEY} />

      {/* outgoing pipe + valve */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <path d="M 264 178 L 316 178 L 316 140 L 352 122" />
        <path d="M 306 171 L 326 185 M 306 185 L 326 171" />
      </g>

      {/* leader + tag */}
      <path d="M 276 156 L 316 86 L 344 86" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.5" />
      <text x="290" y="78" fontSize="9.5" fill={KEY} fontFamily={MONO} fontWeight="600">
        PUMP P-101
      </text>

      <path d="M 122 58 L 96 34 L 66 34" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.5" />
      <text x="24" y="27" fontSize="9.5" fill={INK_SOFT} fontFamily={MONO}>
        V-20
      </text>

      {/* prompt bar */}
      <rect x="30" y="230" width="340" height="1" fill={INK} opacity="0.18" />
      <text x="30" y="250" fontSize="10.5" fill={INK_SOFT} fontFamily={MONO}>
        ▸ isolate the recirculation pump, draft the work plan
      </text>
      <rect x="332" y="240" width="6" height="11" fill={KEY} opacity="0.9" />
      <text x="30" y="268" fontSize="9" fill={KEY} fontFamily={MONO}>
        agent: 4 steps planned · executing
      </text>
    </svg>
  );
}

/* ── NL Querying — sky. Smart3D plant model query ── */

export function Smart3DFigure() {
  const KEY = "#3D6B78";
  return (
    <svg
      viewBox="0 0 640 310"
      width="100%"
      role="img"
      aria-label="Isometric plant model; a natural-language query highlights line 6 inch P-1203 from vessel V-20 to exchanger E-115"
    >
      <title>Natural-language query resolving against a Smart3D plant design model</title>

      {/* ground grid */}
      <g stroke={INK} strokeWidth="0.5" opacity="0.13" fill="none">
        <path d="M 40 250 L 300 120 M 90 275 L 350 145 M 140 300 L 400 170" />
        <path d="M 240 120 L 560 280 M 180 150 L 500 310 M 300 90 L 620 250" />
      </g>

      {/* vessel V-20 */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <ellipse cx="110" cy="78" rx="30" ry="11" />
        <path d="M 80 78 L 80 190 M 140 78 L 140 190" />
        <ellipse cx="110" cy="190" rx="30" ry="11" />
        <path d="M 88 197 L 88 226 M 132 197 L 132 226" opacity="0.55" />
        <path d="M 140 165 L 158 165" opacity="0.6" />
      </g>
      <rect x="68" y="58" width="86" height="176" rx="4" fill="none" stroke={KEY} strokeWidth="0.9" strokeDasharray="5 4" opacity="0.6" />

      {/* pipe rack */}
      <g stroke={INK} strokeWidth="1" fill="none" opacity="0.75">
        <path d="M 250 100 L 250 235 M 268 109 L 268 244" />
        <path d="M 400 100 L 400 235 M 418 109 L 418 244" />
        <path d="M 250 130 L 400 130 M 268 139 L 418 139 M 250 130 L 268 139 M 400 130 L 418 139" />
        <path d="M 250 185 L 400 185 M 268 194 L 418 194 M 250 185 L 268 194 M 400 185 L 418 194" />
      </g>

      {/* background pipe runs */}
      <g stroke={INK} strokeWidth="1.1" fill="none" opacity="0.4">
        <path d="M 190 122 L 470 122" />
        <path d="M 190 178 L 470 178" />
        <path d="M 200 183 L 460 183" opacity="0.6" />
      </g>

      {/* HIGHLIGHTED LINE: vessel → rack → exchanger */}
      <path
        d="M 140 112 L 172 112 L 172 128 L 486 128 L 486 208 L 520 208"
        stroke={KEY}
        strokeWidth="1.8"
        fill="none"
      />
      {/* flow ticks */}
      <g stroke={KEY} strokeWidth="1.2" fill="none">
        <path d="M 300 123 L 308 128 L 300 133" />
        <path d="M 481 168 L 486 176 L 491 168" />
      </g>
      {/* valve */}
      <path d="M 224 121 L 240 135 M 224 135 L 240 121" stroke={KEY} strokeWidth="1.2" fill="none" />

      {/* exchanger E-115 */}
      <g stroke={INK} strokeWidth="1.1" fill="none">
        <ellipse cx="528" cy="208" rx="9" ry="16" />
        <path d="M 528 192 L 600 192 M 528 224 L 600 224" />
        <ellipse cx="600" cy="208" rx="9" ry="16" />
        <path d="M 545 224 L 545 246 M 585 224 L 585 246" opacity="0.5" />
      </g>

      {/* leaders + tags */}
      <path d="M 110 55 L 110 34 L 148 34" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.6" />
      <text x="152" y="37" fontSize="10" fill={INK} fontFamily={MONO} fontWeight="600">V-20</text>

      <path d="M 330 128 L 330 92 L 352 92" stroke={KEY} strokeWidth="0.7" fill="none" />
      <text x="356" y="95" fontSize="10" fill={KEY} fontFamily={MONO} fontWeight="600">6"-P-1203-A1A</text>

      <path d="M 564 186 L 564 168 L 582 168" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.6" />
      <text x="586" y="171" fontSize="10" fill={INK} fontFamily={MONO} fontWeight="600">E-115</text>

      <text x="196" y="172" fontSize="9" fill={INK} opacity="0.5" fontFamily={MONO}>4"-P-1101-B1B</text>

      {/* attribute readout card */}
      <g>
        <rect x="452" y="30" width="172" height="86" rx="6" fill="#FDFCF8" stroke="#D0DCE8" strokeWidth="1" />
        <text x="466" y="50" fontSize="9" fill={INK_SOFT} fontFamily={MONO} letterSpacing="1">LINE ATTRIBUTES</text>
        <g fontSize="9.5" fontFamily={MONO}>
          <text x="466" y="68" fill={INK_SOFT}>Tag</text>
          <text x="510" y="68" fill={INK}>6"-P-1203-A1A</text>
          <text x="466" y="84" fill={INK_SOFT}>From</text>
          <text x="510" y="84" fill={INK}>V-20 · N2</text>
          <text x="466" y="100" fill={INK_SOFT}>To</text>
          <text x="510" y="100" fill={INK}>E-115 · N1</text>
        </g>
      </g>

      {/* query bar + results */}
      <rect x="40" y="262" width="560" height="1" fill={INK} opacity="0.18" />
      <text x="40" y="284" fontSize="12" fill={INK} fontFamily={MONO}>
        ▸ which lines connect vessel V-20 to the exchangers?
      </text>
      <text x="40" y="303" fontSize="10.5" fill={KEY} fontFamily={MONO}>
        1 line · 1 valve · 2 nozzles matched
      </text>
      <rect x="428" y="274" width="7" height="12" fill={KEY} />
    </svg>
  );
}

/* ── Volve RAG — apricot. Well strata + document chunks ── */

export function VolveFigure() {
  const KEY = "#C45C3A";
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      role="img"
      aria-label="Geological cross-section with a well bore; document chunks are pinned to depths along the well"
    >
      <title>Drilling reports and production data embedded along the well bore</title>

      {/* strata */}
      <g stroke={INK} strokeWidth="1" fill="none">
        <path d="M 20 60 C 100 46, 240 74, 380 54" />
        <path d="M 20 110 C 110 98, 230 124, 380 104" opacity="0.65" />
        <path d="M 20 165 C 100 154, 250 180, 380 160" opacity="0.45" />
        <path d="M 20 215 C 110 206, 240 230, 380 212" opacity="0.3" />
      </g>

      {/* depth scale */}
      <g stroke={INK} strokeWidth="0.7" opacity="0.4" fill="none">
        <path d="M 36 40 L 36 240" />
        <path d="M 32 70 L 40 70 M 32 120 L 40 120 M 32 170 L 40 170 M 32 220 L 40 220" />
      </g>
      <g fontSize="8" fill={INK_SOFT} fontFamily={MONO} opacity="0.8">
        <text x="12" y="73">2600</text>
        <text x="12" y="123">2800</text>
        <text x="12" y="173">3000</text>
        <text x="12" y="223">3200</text>
      </g>

      {/* well bore — deviated */}
      <path d="M 190 22 L 190 120 C 190 160, 220 170, 252 178 L 310 192" stroke={KEY} strokeWidth="1.6" fill="none" />
      <path d="M 182 22 L 198 22" stroke={KEY} strokeWidth="1.4" fill="none" />
      {/* casing marks */}
      <g stroke={KEY} strokeWidth="1" opacity="0.6" fill="none">
        <path d="M 184 60 L 196 60 M 184 100 L 196 100" />
      </g>
      {/* perforations at target */}
      <g stroke={KEY} strokeWidth="1" fill="none">
        <path d="M 296 184 L 300 176 M 306 187 L 310 179 M 286 182 L 290 174" />
      </g>

      {/* chunk pins along bore */}
      <g fill={KEY}>
        <circle cx="190" cy="76" r="2.6" />
        <circle cx="190" cy="118" r="2.6" />
        <circle cx="236" cy="172" r="2.6" />
        <circle cx="300" cy="190" r="2.6" />
      </g>

      {/* document chunks, right */}
      <g fill="none" stroke={INK} strokeWidth="0.8" opacity="0.75">
        <rect x="330" y="66" width="20" height="26" rx="2" />
        <path d="M 334 74 h 12 M 334 79 h 12 M 334 84 h 8" />
        <rect x="342" y="120" width="20" height="26" rx="2" />
        <path d="M 346 128 h 12 M 346 133 h 12 M 346 138 h 8" />
      </g>
      <g stroke={INK} strokeWidth="0.7" fill="none" opacity="0.45">
        <path d="M 196 76 L 330 76" strokeDasharray="3 3" />
        <path d="M 196 118 L 342 130" strokeDasharray="3 3" />
      </g>

      {/* tags */}
      <text x="150" y="16" fontSize="9.5" fill={INK} fontFamily={MONO} fontWeight="600">15/9-F-12</text>
      <text x="322" y="60" fontSize="8.5" fill={INK_SOFT} fontFamily={MONO}>DDR 2007-06-19</text>
      <text x="334" y="114" fontSize="8.5" fill={INK_SOFT} fontFamily={MONO}>completion rpt</text>

      {/* query bar */}
      <rect x="20" y="240" width="360" height="1" fill={INK} opacity="0.18" />
      <text x="20" y="260" fontSize="10.5" fill={INK_SOFT} fontFamily={MONO}>
        ▸ why is water cut rising in F-12?
      </text>
      <text x="20" y="276" fontSize="9" fill={KEY} fontFamily={MONO}>
        7 chunks retrieved · 3 sources cited
      </text>
    </svg>
  );
}

/* ── PropScan — lavender. Vision-LLM defect detection ── */

export function PropScanFigure() {
  const KEY = "#6B5A78";
  return (
    <svg
      viewBox="0 0 400 280"
      width="100%"
      role="img"
      aria-label="Phone camera view of a wall; a vision model draws a bounding box around a crack and labels it"
    >
      <title>Vision-LLM defect detection from a phone photo</title>

      {/* room perspective lines */}
      <g stroke={INK} strokeWidth="0.7" opacity="0.25" fill="none">
        <path d="M 30 40 L 120 70 M 30 240 L 120 200 M 30 40 L 30 240" />
        <path d="M 370 46 L 290 72 M 370 236 L 290 198 M 370 46 L 370 236" />
      </g>

      {/* phone */}
      <g stroke={INK} strokeWidth="1.2" fill="none">
        <rect x="128" y="34" width="150" height="216" rx="16" />
        <path d="M 186 46 h 34" strokeWidth="0.9" />
      </g>

      {/* wall inside viewfinder */}
      <g stroke={INK} strokeWidth="0.8" opacity="0.4" fill="none">
        <path d="M 140 92 L 266 92 M 140 156 L 266 156 M 140 220 L 266 220" />
        <path d="M 176 60 L 176 92 M 230 92 L 230 156 M 176 156 L 176 220" />
      </g>

      {/* crack */}
      <path
        d="M 168 108 C 182 122, 194 118, 202 136 C 208 150, 220 148, 226 166 C 230 178, 240 180, 244 192"
        stroke={INK}
        strokeWidth="1.3"
        fill="none"
        opacity="0.8"
      />
      {/* hairline branches */}
      <path d="M 202 136 L 214 130 M 226 166 L 236 160" stroke={INK} strokeWidth="0.8" fill="none" opacity="0.5" />

      {/* bounding box */}
      <rect x="156" y="98" width="100" height="104" rx="3" fill="none" stroke={KEY} strokeWidth="1.1" strokeDasharray="5 4" />
      <circle cx="156" cy="98" r="2.5" fill={KEY} />
      <circle cx="256" cy="98" r="2.5" fill={KEY} />
      <circle cx="156" cy="202" r="2.5" fill={KEY} />
      <circle cx="256" cy="202" r="2.5" fill={KEY} />

      {/* label card */}
      <g>
        <rect x="292" y="88" width="96" height="64" rx="6" fill="#FDFCF8" stroke="#DBD6E8" strokeWidth="1" />
        <text x="304" y="106" fontSize="9" fill={KEY} fontFamily={MONO} fontWeight="600">CRACK · WALL</text>
        <text x="304" y="122" fontSize="9" fill={INK_SOFT} fontFamily={MONO}>conf 0.91</text>
        <text x="304" y="138" fontSize="9" fill={INK_SOFT} fontFamily={MONO}>sev: moderate</text>
      </g>
      <path d="M 256 110 L 292 110" stroke={INK} strokeWidth="0.7" fill="none" opacity="0.45" />

      {/* shutter */}
      <circle cx="203" cy="236" r="8" stroke={INK} strokeWidth="1" fill="none" opacity="0.6" />

      {/* caption bar */}
      <rect x="30" y="258" width="340" height="1" fill={INK} opacity="0.18" />
      <text x="30" y="276" fontSize="9.5" fill={KEY} fontFamily={MONO}>
        defect register: 14 items · site verdict: attention needed
      </text>
    </svg>
  );
}
