import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Compass,
  Sofa,
  BedDouble,
  ChefHat,
  Bath,
  LayoutGrid,
  Camera,
  ImagePlus,
  ArrowRight,
  ArrowLeft,
  Check,
  Palette,
  Lightbulb,
  Armchair,
  Sparkles,
  Wallet,
  Leaf,
  Info,
  RotateCcw,
  ClipboardList,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Loader2,
  AlertTriangle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#FBF8F2",
  surface: "#FFFFFF",
  surfaceAlt: "#F2EEE1",
  ink: "#22301F",
  inkSoft: "#4A5245",
  inkMuted: "#8A8370",
  primary: "#33513A",
  primaryDark: "#233A28",
  primarySoft: "#DEE7D8",
  accent: "#B4713E",
  accentSoft: "#F1DDC9",
  border: "#E7E0CE",
};

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap');
`;

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const ROOM_TYPES = [
  { id: "living", label: "Living Room", icon: Sofa },
  { id: "bedroom", label: "Bedroom", icon: BedDouble },
  { id: "kitchen", label: "Kitchen", icon: ChefHat },
  { id: "bathroom", label: "Bathroom", icon: Bath },
  { id: "other", label: "Other", icon: LayoutGrid },
];

const DIRECTIONS = [
  { id: "N", label: "North", angle: 0 },
  { id: "NE", label: "North-East", angle: 45 },
  { id: "E", label: "East", angle: 90 },
  { id: "SE", label: "South-East", angle: 135 },
  { id: "S", label: "South", angle: 180 },
  { id: "SW", label: "South-West", angle: 225 },
  { id: "W", label: "West", angle: 270 },
  { id: "NW", label: "North-West", angle: 315 },
];

const BUDGETS = [
  { id: "low", label: "Budget-friendly", range: "Under ₹25,000" },
  { id: "mid", label: "Mid-range", range: "₹25,000 – ₹1,00,000" },
  { id: "high", label: "Premium", range: "₹1,00,000+" },
];

const ROOM_CONTENT = {
  living: {
    recommendations: [
      "Arrange seating to face the main entrance so guests feel welcomed as they enter.",
      "Keep a clear walking path between the door and the seating area.",
      "Anchor the room with one focal point — a media wall or a statement rug — rather than several competing ones.",
    ],
    furniture: [
      "Position the sofa against a solid wall for a sense of support.",
      "Leave at least 90cm of walking space around the coffee table.",
      "Float a console table behind the sofa if it backs onto a hallway.",
    ],
    colour: ["Warm sand or soft sage walls", "Deep green or terracotta accent cushions", "Off-white ceiling to keep the room feeling tall"],
    lighting: ["Layer a central light with a floor lamp near the seating", "Use warm white bulbs (2700K–3000K) for evenings", "Add sheer curtains to soften harsh afternoon sun"],
    decor: ["One large art piece above the sofa instead of several small frames", "A textured rug to ground the seating area", "A money plant or areca palm in the corner"],
  },
  bedroom: {
    recommendations: [
      "Position the bed so you can see the door without lying directly in line with it.",
      "Keep the space under the bed clear, or used only for soft storage.",
      "Create a distinct study or dressing zone if the room allows it.",
    ],
    furniture: [
      "Leave equal walking space on both sides of the bed where possible.",
      "Avoid placing the bed directly under a beam or sloped ceiling.",
      "Keep a nightstand within arm's reach on each side.",
    ],
    colour: ["Muted blues, soft greens or warm neutrals for a calming effect", "Use bright reds only as small accents, not the main wall", "Matte finishes reduce glare from bedside lighting"],
    lighting: ["Add dimmable bedside lamps for night reading", "Keep overhead lighting warm-toned, not stark white", "Use blackout-lined curtains if you're a light sleeper"],
    decor: ["Keep decor minimal near the bed to support rest", "One soft throw and two accent cushions is enough", "Avoid a mirror directly facing the bed"],
  },
  kitchen: {
    recommendations: [
      "Keep cooking, washing and storage zones in a clear triangle for efficient movement.",
      "Make sure the stove area has good ventilation, ideally near a window or exhaust.",
      "Keep countertops as clear as possible for a calmer, more functional space.",
    ],
    furniture: [
      "Keep the refrigerator away from direct proximity to the stove.",
      "Use pull-out organisers in lower cabinets for full use of depth.",
      "Leave a small breathing gap between the sink and the stove.",
    ],
    colour: ["Light, easy-to-clean tones like off-white or soft yellow", "A warm accent tile behind the stove for character", "Avoid all-dark schemes — they can feel closed in"],
    lighting: ["Add task lighting under the cabinets above the counter", "Keep the main ceiling light bright and cool-toned (4000K)", "A pendant light over an island adds warmth"],
    decor: ["A small potted herb rack near the window", "Open shelving for everyday crockery instead of counter clutter", "One accent tile pattern, not several competing ones"],
  },
  bathroom: {
    recommendations: [
      "Keep wet and dry areas visually and physically separated where possible.",
      "Prioritise ventilation — a window or exhaust fan reduces dampness and odour.",
      "Store toiletries in closed cabinets to keep surfaces clear.",
    ],
    furniture: [
      "Choose a compact vanity if the room is under 4 sq m.",
      "Add a corner shelf to use vertical space without crowding the floor.",
      "Keep the mirror cabinet's opening path clear of the door swing.",
    ],
    colour: ["Cool, clean palettes — white, pale grey, soft blue", "A single accent tile band rather than a fully patterned wall", "Matte tiles on the floor for better grip"],
    lighting: ["Bright, cool-toned light around the mirror for grooming", "A warmer, dimmer light for the shower zone on a separate switch", "Waterproof-rated fixtures throughout"],
    decor: ["A few humidity-tolerant plants, like money plant or peace lily", "Rolled towels in a woven basket instead of an open pile", "One patterned hand towel as the accent, rest neutral"],
  },
  other: {
    recommendations: [
      "Define what this space is primarily for — work, storage, hobby — before choosing furniture.",
      "Keep at least one wall free for flexibility as the room's use evolves.",
      "Use furniture on castors if the room needs to adapt often.",
    ],
    furniture: [
      "A multi-purpose desk or table suits most flexible spaces.",
      "Wall-mounted storage keeps the floor open in a small room.",
      "Fold-away seating works well if the room doubles as a guest space.",
    ],
    colour: ["A neutral base so the room can adapt to different uses", "One accent wall matching the room's main purpose", "Keep trims and ceiling white for a clean backdrop"],
    lighting: ["Flexible, movable lighting suits a multi-use room", "Add a task lamp if the space is used for work or hobbies", "Place natural light near a desk or activity zone"],
    decor: ["Keep decor modular so it can move with the room's purpose", "A noticeboard or pinboard for planning", "Storage baskets to quickly tidy multi-use clutter"],
  },
};

const VASTU_CONTENT = {
  N: [
    "North is traditionally associated with wealth and career growth — often considered favourable for a study corner.",
    "Keeping the north side uncluttered is traditionally believed to support the flow of positive energy.",
    "A water feature or mirror on the north wall is a common traditional placement.",
  ],
  NE: [
    "The North-East corner is traditionally considered the most sacred direction — often kept for a small puja or meditation corner.",
    "Traditional guidance suggests keeping this corner light, clean and clutter-free.",
    "Heavy furniture or storage in the North-East is traditionally discouraged.",
  ],
  E: [
    "East-facing spaces are traditionally linked to new beginnings and health — often favoured for the main living area.",
    "Morning sunlight from the east is traditionally considered auspicious, so light curtains are often preferred.",
    "The eastern wall is traditionally kept relatively open rather than blocked by tall furniture.",
  ],
  SE: [
    "South-East is traditionally the direction associated with fire and energy — commonly recommended for the kitchen or stove.",
    "Traditional guidance suggests avoiding a bedroom in this corner if it can be helped.",
    "Keeping this zone active rather than used for storage is a common traditional preference.",
  ],
  S: [
    "South is traditionally associated with stability and strength — often considered suitable for heavier furniture.",
    "Traditional guidance suggests avoiding a main entrance directly on the south wall where a choice is possible.",
    "A study desk facing south is a common traditional recommendation for focus.",
  ],
  SW: [
    "South-West is traditionally considered the most stable direction — commonly recommended for the master bedroom.",
    "Traditional guidance suggests keeping this corner grounded, using solid, heavier furniture.",
    "Large windows or openings in the South-West are traditionally kept to a minimum.",
  ],
  W: [
    "West is traditionally linked to gains and social life — often considered suitable for a dining or family area.",
    "Traditional guidance favours keeping this wall relatively solid rather than heavily open.",
    "Evening activities are traditionally considered well-supported in west-facing rooms.",
  ],
  NW: [
    "North-West is traditionally associated with support and relationships — often recommended for a guest room.",
    "Traditional guidance suggests this direction suits storage for frequently used, movement-related items.",
    "Keeping this corner breathable rather than overly heavy is a common traditional preference.",
  ],
  unknown: [
    "Without a confirmed direction, we've kept this guidance general — traditional Vastu is most precise when the exact room orientation is known.",
    "A compass app can help you confirm your room's direction for more tailored guidance next time.",
    "General traditional advice: keep corners uncluttered and let natural light reach as much of the room as possible.",
  ],
};

const BUDGET_CONTENT = {
  low: [
    "Rearranging existing furniture is free and often makes the biggest visible difference.",
    "Swap curtains or cushion covers instead of replacing full furniture sets.",
    "A fresh coat of paint on one wall is one of the highest-impact low-cost changes.",
    "Look for second-hand or local carpenter-made pieces instead of branded furniture.",
  ],
  mid: [
    "Reupholstering one or two key pieces can refresh the room without a full change.",
    "Invest in good lighting fixtures — they change a room's feel more than most people expect.",
    "Custom storage from a local carpenter is often better value than imported modular units.",
    "Mix one statement piece — a rug or an accent chair — with otherwise budget furniture.",
  ],
  high: [
    "Consider custom modular furniture designed for the room's exact dimensions.",
    "Layered lighting — ambient, task and accent — makes the biggest difference at this budget.",
    "Premium natural materials, like solid wood or natural stone accents, age better than lookalike finishes.",
    "A designer consultation at this budget usually pays for itself in avoided mistakes.",
  ],
};

/* ------------------------------------------------------------------ */
/*  SMALL HELPERS                                                      */
/* ------------------------------------------------------------------ */
function buildAnalysis({ roomType, direction, budget, notes }) {
  const room = ROOM_CONTENT[roomType] || ROOM_CONTENT.other;
  const vastu = VASTU_CONTENT[direction] || VASTU_CONTENT.unknown;
  const alts = BUDGET_CONTENT[budget] || BUDGET_CONTENT.low;
  return { ...room, vastu, alternatives: alts, notes };
}

function polarPoint(angle, radius) {
  const rad = (angle * Math.PI) / 180;
  return { x: radius * Math.sin(rad), y: -radius * Math.cos(rad) };
}

/* ------------------------------------------------------------------ */
/*  AI ROOM VISUALIZATION — prompt builder + API call                  */
/* ------------------------------------------------------------------ */
function buildDesignPrompt({ roomType, direction, budget, analysis }) {
  const roomLabel = (ROOM_TYPES.find((r) => r.id === roomType)?.label || "room").toLowerCase();
  const dirLabel =
    direction === "unknown"
      ? "an unspecified direction"
      : DIRECTIONS.find((d) => d.id === direction)?.label || "an unspecified direction";
  const budgetInfo = BUDGETS.find((b) => b.id === budget);
  const budgetLabel = budgetInfo ? `${budgetInfo.label} (${budgetInfo.range})` : "a moderate budget";

  const colours = analysis.colour.join(", ");
  const furniture = analysis.furniture.slice(0, 2).join(" ");
  const lighting = analysis.lighting.slice(0, 2).join(" ");
  const decor = analysis.decor.slice(0, 2).join(" ");
  const vastuNote = analysis.vastu[0];

  return `Transform the uploaded room into a realistic, premium interior design while preserving the original room's architecture, camera perspective, walls, doors, windows and approximate dimensions. This is a ${roomLabel} facing ${dirLabel}, styled for a "${budgetLabel}" budget.

Apply these design directions:
- Colour palette: ${colours}.
- Furniture: ${furniture}
- Lighting: ${lighting}
- Decor: ${decor}
- Traditional Vastu consideration: ${vastuNote}

Improve furniture placement, storage and overall layout while keeping the result practical and achievable within the selected budget. Do not invent a different room — keep the same structure, windows, doors, and camera angle as the uploaded photo. Photorealistic architectural interior visualization, realistic materials, natural lighting, high detail, no cartoon or illustration style.`;
}

async function requestRoomVisualization(roomImage, prompt) {
  const response = await fetch("/api/generate-room-design", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomImage, prompt }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const err = new Error(data.message || "Could not generate the room design.");
    err.code = data.error;
    throw err;
  }

  return data; // { imageUrl } or { imageBase64 }
}

/* ------------------------------------------------------------------ */
/*  REUSABLE UI BITS                                                   */
/* ------------------------------------------------------------------ */
function TopBar({ onBack, step, total, title }) {
  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
          aria-label="Go back"
        >
          <ArrowLeft size={17} color={C.ink} />
        </button>
        {step != null && (
          <div className="flex items-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  height: 6,
                  width: i === step ? 20 : 6,
                  backgroundColor: i <= step ? C.primary : C.border,
                }}
              />
            ))}
          </div>
        )}
        <div className="w-9" />
      </div>
      {title && (
        <h1
          className="text-2xl leading-tight"
          style={{ fontFamily: "Fraunces, serif", color: C.ink, fontWeight: 500 }}
        >
          {title}
        </h1>
      )}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, icon: Icon = ArrowRight }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-2xl py-4 flex items-center justify-center gap-2 font-semibold transition active:scale-[0.98]"
      style={{
        backgroundColor: disabled ? C.border : C.primary,
        color: disabled ? C.inkMuted : "#FBF8F2",
        fontFamily: "Manrope, sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
      <Icon size={18} />
    </button>
  );
}

function SectionCard({ icon: Icon, title, items, tint }) {
  return (
    <div
      className="rounded-3xl p-5 mb-4"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: tint || C.primarySoft }}
        >
          <Icon size={16} color={C.primaryDark} />
        </div>
        <h3
          style={{ fontFamily: "Manrope, sans-serif", color: C.ink, fontWeight: 700 }}
          className="text-[15px]"
        >
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li
            key={i}
            className="text-[13.5px] leading-relaxed pl-4 relative"
            style={{ color: C.inkSoft, fontFamily: "Manrope, sans-serif" }}
          >
            <span
              className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: C.accent }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VisualizationCard({ status, image, errorMessage, onGenerate }) {
  return (
    <div
      className="rounded-3xl p-5 mb-4 overflow-hidden"
      style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: C.primarySoft }}
        >
          <ImageIcon size={16} color={C.primaryDark} />
        </div>
        <h3
          style={{ fontFamily: "Manrope, sans-serif", color: C.ink, fontWeight: 700 }}
          className="text-[15px]"
        >
          Your AI Room Design
        </h3>
      </div>

      {status === "loading" && (
        <div
          className="rounded-2xl flex flex-col items-center justify-center gap-3 py-14"
          style={{ backgroundColor: C.surfaceAlt }}
        >
          <Loader2 size={26} color={C.primary} className="animate-spin" />
          <p
            className="text-[13px]"
            style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted, fontWeight: 600 }}
          >
            Designing your dream room…
          </p>
        </div>
      )}

      {status === "success" && image && (
        <>
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{ border: `1px solid ${C.border}` }}
          >
            <img src={image} alt="AI redesigned room" className="w-full object-cover" />
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onGenerate}
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] transition active:scale-[0.98]"
              style={{
                backgroundColor: C.primarySoft,
                color: C.primaryDark,
                fontFamily: "Manrope, sans-serif",
                fontWeight: 700,
              }}
            >
              <RefreshCw size={14} /> Generate Again
            </button>
            <a
              href={image}
              download="vastunest-ai-room-design.png"
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] transition active:scale-[0.98]"
              style={{
                backgroundColor: C.primary,
                color: "#FBF8F2",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 700,
              }}
            >
              <Download size={14} /> Download Design
            </a>
          </div>
        </>
      )}

      {(status === "error" || status === "not_configured") && (
        <div
          className="rounded-2xl p-5 flex flex-col items-center text-center gap-3"
          style={{ backgroundColor: C.surfaceAlt }}
        >
          <AlertTriangle size={22} color={C.accent} />
          <p
            className="text-[13px] leading-relaxed"
            style={{ fontFamily: "Manrope, sans-serif", color: C.inkSoft }}
          >
            {status === "not_configured"
              ? "AI room visualization isn't connected yet. Once an image-generation provider is added, your redesigned room will appear here."
              : errorMessage || "We couldn't generate your room design right now."}
          </p>
          {status === "error" && (
            <button
              onClick={onGenerate}
              className="rounded-xl px-5 py-2.5 text-[13px] transition active:scale-[0.98]"
              style={{
                backgroundColor: C.primary,
                color: "#FBF8F2",
                fontFamily: "Manrope, sans-serif",
                fontWeight: 700,
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN 1 — HOME                                                     */
/* ------------------------------------------------------------------ */
function HomeScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: C.bg }}>
      {/* watermark compass */}
      <svg
        className="absolute -top-16 -right-20 opacity-[0.06] pointer-events-none"
        width="340"
        height="340"
        viewBox="0 0 340 340"
      >
        <circle cx="170" cy="170" r="150" fill="none" stroke={C.primary} strokeWidth="1.5" />
        <circle cx="170" cy="170" r="105" fill="none" stroke={C.primary} strokeWidth="1.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const p1 = polarPoint(a, 150);
          const p2 = polarPoint(a, 165);
          return (
            <line
              key={a}
              x1={170 + p1.x}
              y1={170 + p1.y}
              x2={170 + p2.x}
              y2={170 + p2.y}
              stroke={C.primary}
              strokeWidth="2"
            />
          );
        })}
      </svg>

      <div className="flex-1 flex flex-col justify-center px-7 pb-24 pt-16 relative z-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-7"
          style={{ backgroundColor: C.primary }}
        >
          <Compass size={30} color="#FBF8F2" strokeWidth={1.75} />
        </div>

        <h1
          className="text-[2.6rem] leading-[1.05] mb-3"
          style={{ fontFamily: "Fraunces, serif", color: C.ink, fontWeight: 500 }}
        >
          VastuNest
          <span style={{ color: C.accent }}> AI</span>
        </h1>

        <p
          className="text-lg italic mb-6"
          style={{ fontFamily: "Fraunces, serif", color: C.inkSoft, fontStyle: "italic" }}
        >
          Design your home smarter.
        </p>

        <p
          className="text-[14.5px] leading-relaxed mb-10 max-w-[92%]"
          style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}
        >
          Upload a photo of any room and get AI-powered interior suggestions —
          furniture, colour, and lighting — alongside traditional Vastu
          guidance based on your room's direction and budget.
        </p>

        <PrimaryButton onClick={onStart}>Start Designing</PrimaryButton>

        <div className="flex items-center gap-2 mt-6">
          <Leaf size={14} color={C.inkMuted} />
          <p className="text-[12px]" style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}>
            AI suggestions + traditional Vastu, side by side
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN 2 — ROOM SELECTION                                          */
/* ------------------------------------------------------------------ */
function RoomScreen({ selected, onSelect, onBack, onNext }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
      <TopBar onBack={onBack} step={0} total={4} title="Which room are we designing?" />
      <p
        className="px-5 text-[13.5px] mb-5"
        style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}
      >
        Pick the space you'd like suggestions for.
      </p>

      <div className="px-5 grid grid-cols-2 gap-3 flex-1">
        {ROOM_TYPES.map((r) => {
          const Icon = r.icon;
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="rounded-2xl p-5 flex flex-col items-start gap-4 transition active:scale-[0.97]"
              style={{
                backgroundColor: active ? C.primary : C.surface,
                border: `1.5px solid ${active ? C.primary : C.border}`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: active ? "rgba(255,255,255,0.15)" : C.primarySoft }}
              >
                <Icon size={20} color={active ? "#FBF8F2" : C.primaryDark} strokeWidth={1.75} />
              </div>
              <span
                className="text-[14px] text-left"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  color: active ? "#FBF8F2" : C.ink,
                }}
              >
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="p-5">
        <PrimaryButton onClick={onNext} disabled={!selected}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN 3 — UPLOAD PHOTO                                             */
/* ------------------------------------------------------------------ */
function UploadScreen({ photo, onPhoto, onBack, onNext }) {
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
      <TopBar onBack={onBack} step={1} total={4} title="Show us the room" />
      <p
        className="px-5 text-[13.5px] mb-5"
        style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}
      >
        A clear, well-lit photo works best.
      </p>

      <div className="px-5 flex-1">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />

        {!photo ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-3xl flex flex-col items-center justify-center gap-3 transition active:scale-[0.98]"
            style={{
              height: 300,
              border: `2px dashed ${C.border}`,
              backgroundColor: C.surface,
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: C.primarySoft }}
            >
              <Camera size={24} color={C.primaryDark} />
            </div>
            <p style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: C.ink }} className="text-[14px]">
              Tap to upload or take a photo
            </p>
            <p className="text-[12px]" style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}>
              JPG or PNG
            </p>
          </button>
        ) : (
          <div>
            <div
              className="rounded-3xl overflow-hidden mb-3"
              style={{ height: 300, border: `1px solid ${C.border}` }}
            >
              <img src={photo} alt="Room preview" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 mx-auto"
              style={{ fontFamily: "Manrope, sans-serif", color: C.primaryDark, fontWeight: 700 }}
            >
              <ImagePlus size={15} />
              <span className="text-[13.5px]">Change photo</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        <PrimaryButton onClick={onNext} disabled={!photo}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN 4 — ROOM DETAILS (direction dial + budget + notes)          */
/* ------------------------------------------------------------------ */
function DetailsScreen({ direction, onDirection, budget, onBudget, notes, onNotes, onBack, onNext }) {
  const radius = 108;
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
      <TopBar onBack={onBack} step={2} total={4} title="A few details" />

      <div className="px-5 flex-1 overflow-y-auto pb-6">
        {/* Direction dial */}
        <p
          className="text-[13px] mb-1"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: C.ink }}
        >
          Which way does the room face?
        </p>
        <p className="text-[12.5px] mb-5" style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}>
          Tap a direction on the dial, or the centre if you're not sure.
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative" style={{ width: 260, height: 260 }}>
            <div
              className="absolute rounded-full"
              style={{
                inset: 0,
                border: `1.5px solid ${C.border}`,
                backgroundColor: C.surface,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: radius * 2 - 64,
                height: radius * 2 - 64,
                border: `1px solid ${C.border}`,
              }}
            />

            {/* Don't know — centre */}
            <button
              onClick={() => onDirection("unknown")}
              className="absolute rounded-full flex flex-col items-center justify-center text-center transition active:scale-95"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                width: 84,
                height: 84,
                backgroundColor: direction === "unknown" ? C.accent : C.accentSoft,
                zIndex: 2,
              }}
            >
              <span
                className="text-[11px] leading-tight px-1"
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 700,
                  color: direction === "unknown" ? "#FFF8F0" : C.accent,
                }}
              >
                Don't Know
              </span>
            </button>

            {DIRECTIONS.map((d) => {
              const p = polarPoint(d.angle, radius);
              const active = direction === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onDirection(d.id)}
                  aria-label={d.label}
                  className="absolute rounded-full flex items-center justify-center transition active:scale-95"
                  style={{
                    left: `calc(50% + ${p.x}px)`,
                    top: `calc(50% + ${p.y}px)`,
                    transform: "translate(-50%,-50%)",
                    width: 46,
                    height: 46,
                    backgroundColor: active ? C.primary : C.surface,
                    border: `1.5px solid ${active ? C.primary : C.border}`,
                    zIndex: 3,
                  }}
                >
                  <span
                    className="text-[11.5px]"
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 800,
                      color: active ? "#FBF8F2" : C.ink,
                    }}
                  >
                    {d.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {direction && (
          <p
            className="text-center text-[13px] -mt-4 mb-8"
            style={{ fontFamily: "Manrope, sans-serif", color: C.primaryDark, fontWeight: 700 }}
          >
            Selected: {direction === "unknown" ? "Not sure / don't know" : DIRECTIONS.find((d) => d.id === direction)?.label}
          </p>
        )}

        {/* Budget */}
        <p
          className="text-[13px] mb-3"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: C.ink }}
        >
          What's your budget?
        </p>
        <div className="flex flex-col gap-2.5 mb-8">
          {BUDGETS.map((b) => {
            const active = budget === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onBudget(b.id)}
                className="rounded-2xl px-4 py-3.5 flex items-center justify-between transition active:scale-[0.98]"
                style={{
                  backgroundColor: active ? C.primary : C.surface,
                  border: `1.5px solid ${active ? C.primary : C.border}`,
                }}
              >
                <div className="text-left">
                  <p
                    className="text-[13.5px]"
                    style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: active ? "#FBF8F2" : C.ink }}
                  >
                    {b.label}
                  </p>
                  <p
                    className="text-[12px]"
                    style={{ fontFamily: "Manrope, sans-serif", color: active ? "rgba(255,255,255,0.75)" : C.inkMuted }}
                  >
                    {b.range}
                  </p>
                </div>
                {active && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    <Check size={14} color="#FBF8F2" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Notes */}
        <p
          className="text-[13px] mb-2"
          style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: C.ink }}
        >
          Tell us what you want to change{" "}
          <span style={{ color: C.inkMuted, fontWeight: 500 }}>(optional)</span>
        </p>
        <textarea
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
          placeholder="E.g. I want more storage and a brighter feel…"
          rows={3}
          className="w-full rounded-2xl p-4 text-[13.5px] resize-none outline-none"
          style={{
            fontFamily: "Manrope, sans-serif",
            backgroundColor: C.surface,
            border: `1.5px solid ${C.border}`,
            color: C.ink,
          }}
        />
      </div>

      <div className="p-5" style={{ backgroundColor: C.bg }}>
        <PrimaryButton onClick={onNext} disabled={!direction || !budget} icon={Sparkles}>
          Generate Analysis
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SCREEN 5 — AI ANALYSIS RESULT                                       */
/* ------------------------------------------------------------------ */
function ResultScreen({ data, photo, roomType, direction, budget, onBack, onRestart }) {
  const roomLabel = ROOM_TYPES.find((r) => r.id === roomType)?.label;
  const dirLabel = direction === "unknown" ? "Direction unknown" : DIRECTIONS.find((d) => d.id === direction)?.label;
  const budgetLabel = BUDGETS.find((b) => b.id === budget)?.label;

  const designPrompt = useMemo(
    () => buildDesignPrompt({ roomType, direction, budget, analysis: data }),
    [roomType, direction, budget, data]
  );

  const [vizStatus, setVizStatus] = useState("loading"); // loading | success | error | not_configured
  const [vizImage, setVizImage] = useState(null);
  const [vizErrorMsg, setVizErrorMsg] = useState("");

  async function runVisualization() {
    setVizStatus("loading");
    setVizErrorMsg("");
    try {
      const result = await requestRoomVisualization(photo, designPrompt);
      setVizImage(result.imageUrl || result.imageBase64 || null);
      setVizStatus("success");
    } catch (err) {
      setVizStatus(err.code === "not_configured" ? "not_configured" : "error");
      setVizErrorMsg(err.message);
    }
  }

  useEffect(() => {
    runVisualization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg }}>
      <TopBar onBack={onBack} step={3} total={4} />

      <div className="px-5 pb-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl" style={{ fontFamily: "Fraunces, serif", color: C.ink, fontWeight: 500 }}>
            Your Design Analysis
          </h1>
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mb-5"
          style={{ backgroundColor: C.accentSoft }}
        >
          <Info size={12} color={C.accent} />
          <span className="text-[11px]" style={{ fontFamily: "Manrope, sans-serif", color: C.accent, fontWeight: 700 }}>
            Sample analysis — AI engine not connected yet
          </span>
        </div>

        {/* summary card */}
        <div
          className="rounded-3xl p-3 mb-5 flex gap-3 items-center"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}
        >
          {photo && (
            <img src={photo} alt="Room" className="w-16 h-16 rounded-2xl object-cover shrink-0" />
          )}
          <div className="flex flex-wrap gap-1.5">
            {[roomLabel, dirLabel, budgetLabel].filter(Boolean).map((t) => (
              <span
                key={t}
                className="text-[11px] rounded-full px-2.5 py-1"
                style={{ backgroundColor: C.primarySoft, color: C.primaryDark, fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {data.notes && (
          <div className="rounded-3xl p-4 mb-5" style={{ backgroundColor: C.surfaceAlt }}>
            <p className="text-[11px] mb-1" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700, color: C.inkMuted }}>
              WHAT YOU TOLD US
            </p>
            <p className="text-[13.5px] italic" style={{ fontFamily: "Fraunces, serif", color: C.inkSoft }}>
              "{data.notes}"
            </p>
          </div>
        )}

        <SectionCard icon={ClipboardList} title="Interior Recommendations" items={data.recommendations} />
        <SectionCard icon={Armchair} title="Furniture Placement" items={data.furniture} />
        <SectionCard icon={Palette} title="Colour Suggestions" items={data.colour} />
        <SectionCard icon={Lightbulb} title="Lighting Suggestions" items={data.lighting} />
        <SectionCard icon={Sparkles} title="Decor Suggestions" items={data.decor} />

        <VisualizationCard
          status={vizStatus}
          image={vizImage}
          errorMessage={vizErrorMsg}
          onGenerate={runVisualization}
        />

        <SectionCard
          icon={Compass}
          title="Traditional Vastu Guidance"
          items={data.vastu}
          tint={C.accentSoft}
        />
        <SectionCard icon={Wallet} title="Budget-Friendly Alternatives" items={data.alternatives} />

        <div
          className="rounded-2xl p-4 mb-2"
          style={{ backgroundColor: C.surfaceAlt, border: `1px solid ${C.border}` }}
        >
          <p className="text-[11.5px] leading-relaxed" style={{ fontFamily: "Manrope, sans-serif", color: C.inkMuted }}>
            Vastu suggestions reflect traditional and cultural design practices.
            They are not scientific, medical, or financial guarantees — treat
            them as one input among many when planning your space.
          </p>
        </div>

        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-4 mt-3"
          style={{ fontFamily: "Manrope, sans-serif", color: C.primaryDark, fontWeight: 700 }}
        >
          <RotateCcw size={15} />
          <span className="text-[13.5px]">Start a New Design</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP ROOT                                                            */
/* ------------------------------------------------------------------ */
export default function VastuNestApp() {
  const [screen, setScreen] = useState("home"); // home | room | upload | details | result
  const [roomType, setRoomType] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [direction, setDirection] = useState(null);
  const [budget, setBudget] = useState(null);
  const [notes, setNotes] = useState("");

  function resetAll() {
    setRoomType(null);
    setPhoto(null);
    setDirection(null);
    setBudget(null);
    setNotes("");
    setScreen("home");
  }

  const analysis =
    screen === "result" ? buildAnalysis({ roomType, direction, budget, notes }) : null;

  return (
    <div style={{ backgroundColor: C.bg }}>
      <style>{fontImport}</style>
      <div className="max-w-md mx-auto shadow-sm" style={{ backgroundColor: C.bg, minHeight: "100vh" }}>
        {screen === "home" && <HomeScreen onStart={() => setScreen("room")} />}

        {screen === "room" && (
          <RoomScreen
            selected={roomType}
            onSelect={setRoomType}
            onBack={() => setScreen("home")}
            onNext={() => setScreen("upload")}
          />
        )}

        {screen === "upload" && (
          <UploadScreen
            photo={photo}
            onPhoto={setPhoto}
            onBack={() => setScreen("room")}
            onNext={() => setScreen("details")}
          />
        )}

        {screen === "details" && (
          <DetailsScreen
            direction={direction}
            onDirection={setDirection}
            budget={budget}
            onBudget={setBudget}
            notes={notes}
            onNotes={setNotes}
            onBack={() => setScreen("upload")}
            onNext={() => setScreen("result")}
          />
        )}

        {screen === "result" && (
          <ResultScreen
            data={analysis}
            photo={photo}
            roomType={roomType}
            direction={direction}
            budget={budget}
            onBack={() => setScreen("details")}
            onRestart={resetAll}
          />
        )}
      </div>
    </div>
  );
}
