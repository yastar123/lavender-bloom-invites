import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

export const Route = createFileRoute("/")({
  component: Index,
});

const WEDDING = {
  bride: "Anis",
  brideFull: "Anis Permata Sari",
  brideParents: "Bapak Suryanto & Ibu Hartini",
  groom: "Fadli",
  groomFull: "Fadli Ahmad Rahman",
  groomParents: "Bapak Mahmud & Ibu Siti Aminah",
  dateText: "Sabtu, 27 April 2024",
  date: "2024-04-27T08:00:00+07:00",
  akad: {
    day: "Sabtu, 27 April 2024",
    time: "08.00 – 10.00 WIB",
    place: "Masjid Al-Hikmah, Jakarta Selatan",
    maps: "https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta",
  },
  resepsi: {
    day: "Sabtu, 27 April 2024",
    time: "11.00 – 14.00 WIB",
    place: "Gedung Serbaguna Melati, Jakarta Selatan",
    maps: "https://maps.google.com/?q=Gedung+Serbaguna+Melati+Jakarta",
  },
  music: [
    "https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3",
    "https://www.bensound.com/bensound-music/bensound-romantic.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  ],
};

const C = {
  gold: "#C6965A",
  goldLight: "#E8C98A",
  goldDark: "#9B6F3A",
  deep: "#2A1F14",
  rose: "#E8D5D0",
  roseDark: "#C9A09A",
  cream: "#FDF8F0",
  ivory: "#FFFCF7",
  muted: "#8A7060",
};

// Real Unsplash wedding/romantic photos
const HERO_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85&fit=crop&crop=center";
const SIDEBAR_IMAGE = "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=700&q=80&fit=crop&crop=center";

const GALLERY_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=750&q=80&fit=crop&crop=center",
    label: "Momen Pertama",
  },
  {
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=750&q=80&fit=crop&crop=center",
    label: "Cincin Kami",
  },
  {
    src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=750&q=80&fit=crop&crop=center",
    label: "Sang Pengantin",
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456503681?w=600&h=750&q=80&fit=crop&crop=center",
    label: "Tarian Pertama",
  },
  {
    src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=750&q=80&fit=crop&crop=center",
    label: "Dekorasi",
  },
  {
    src: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=600&h=750&q=80&fit=crop&crop=center",
    label: "Bunga Cinta",
  },
];

type Rsvp = { nama: string; hadir: string; ucapan: string; ts: number };

function useGuestName() {
  return useMemo(() => {
    if (typeof window === "undefined") return "Tamu Undangan";
    const p = new URLSearchParams(window.location.search).get("nama");
    return p ? decodeURIComponent(p) : "Tamu Undangan";
  }, []);
}

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-8 ${className}`}>
      <div className="h-px flex-1 opacity-25" style={{ background: C.gold }} />
      <svg width="36" height="18" viewBox="0 0 40 20" fill="none">
        <path d="M20 2 C14 2, 8 8, 2 10 C8 12, 14 18, 20 18 C26 18, 32 12, 38 10 C32 8, 26 2, 20 2Z" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.7"/>
        <circle cx="20" cy="10" r="2" fill={C.gold} opacity="0.8"/>
        <circle cx="6" cy="10" r="1.2" fill={C.gold} opacity="0.5"/>
        <circle cx="34" cy="10" r="1.2" fill={C.gold} opacity="0.5"/>
      </svg>
      <div className="h-px flex-1 opacity-25" style={{ background: C.gold }} />
    </div>
  );
}

function FloralCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const transforms: Record<string, string> = {
    tl: "rotate(0deg)",
    tr: "rotate(90deg) scaleY(-1)",
    bl: "rotate(270deg)",
    br: "rotate(180deg)",
  };
  return (
    <svg width="80" height="80" viewBox="0 0 90 90" fill="none" style={{ transform: transforms[position] }}>
      <path d="M5 5 Q5 45, 45 45" stroke={C.gold} strokeWidth="0.7" opacity="0.5" fill="none"/>
      <path d="M5 5 Q45 5, 45 45" stroke={C.gold} strokeWidth="0.7" opacity="0.5" fill="none"/>
      <circle cx="45" cy="5" r="2" fill={C.gold} opacity="0.4"/>
      <circle cx="5" cy="45" r="2" fill={C.gold} opacity="0.4"/>
      <circle cx="5" cy="5" r="3" fill={C.gold} opacity="0.5"/>
      <path d="M15 5 Q15 20, 5 25" stroke={C.gold} strokeWidth="0.6" opacity="0.35" fill="none"/>
      <path d="M5 15 Q20 15, 25 5" stroke={C.gold} strokeWidth="0.6" opacity="0.35" fill="none"/>
      <circle cx="18" cy="8" r="1.5" fill={C.gold} opacity="0.3"/>
      <circle cx="8" cy="18" r="1.5" fill={C.gold} opacity="0.3"/>
    </svg>
  );
}

function FloatingPetals() {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        char: ["✦", "✧", "◆", "❋", "✿", "❀", "✼", "❁"][i % 8],
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 15 + Math.random() * 15,
        size: 8 + Math.random() * 10,
        opacity: 0.12 + Math.random() * 0.2,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-5%", x: 0, rotate: 0, opacity: 0 }}
          animate={{ y: "108vh", x: [0, 15, -15, 8, 0], rotate: [0, 90, 180, 270, 360], opacity: [0, p.opacity, p.opacity, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: `${p.left}%`, fontSize: p.size, color: C.gold }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}

function Section({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full px-6 sm:px-10 py-14 sm:py-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-10">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="text-[10px] sm:text-[11px] mb-3 font-medium tracking-[0.4em]"
        style={{ color: C.gold }}
      >
        {kicker}
      </motion.p>
      <h2 className="font-display text-3xl sm:text-4xl mb-2" style={{ color: C.deep }}>{title}</h2>
      {subtitle && <p className="font-body text-xs sm:text-sm mt-2 italic" style={{ color: C.muted }}>{subtitle}</p>}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-px w-12 mx-auto mt-5 origin-center"
        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
      />
    </div>
  );
}

function Index() {
  const guest = useGuestName();
  const [opened, setOpened] = useState(false);
  const cd = useCountdown(WEDDING.date);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicIdx, setMusicIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState("pembukaan");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [form, setForm] = useState({ nama: "", hadir: "Hadir", ucapan: "" });
  const [submitted, setSubmitted] = useState(false);

  const rightRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const sidebarParallax = useTransform(scrollY, [0, 600], [0, -50]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("rsvps");
      if (raw) setRsvps(JSON.parse(raw));
    } catch {}
  }, []);

  const tryPlay = () => {
    const a = audioRef.current;
    if (!a) return;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  useEffect(() => {
    if (opened) tryPlay();
  }, [opened, musicIdx]);

  const openInvitation = () => {
    setOpened(true);
    setTimeout(() => {
      if (rightRef.current) rightRef.current.scrollTop = 0;
      else window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 50);
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else tryPlay();
  };

  const onAudioError = () => {
    if (musicIdx < WEDDING.music.length - 1) setMusicIdx((i) => i + 1);
  };

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.ucapan.trim()) return;
    const next = [{ ...form, ts: Date.now() }, ...rsvps];
    setRsvps(next);
    localStorage.setItem("rsvps", JSON.stringify(next));
    setForm({ nama: "", hadir: "Hadir", ucapan: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const navItems = [
    { id: "pembukaan", label: "Pasangan" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "rsvp", label: "RSVP" },
  ];

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (!el) return;
    if (rightRef.current) {
      rightRef.current.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-script  { font-family: 'Great Vibes', cursive; }
        .font-body, body { font-family: 'Montserrat', sans-serif; }

        @keyframes shimmerGold {
          0%   { background-position: -300% 0 }
          100% { background-position: 300% 0 }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, ${C.goldDark} 0%, ${C.gold} 30%, ${C.goldLight} 50%, ${C.gold} 70%, ${C.goldDark} 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerGold 5s linear infinite;
        }
        @keyframes gentlePulse {
          0%,100% { box-shadow: 0 0 0 0 ${C.gold}44, 0 8px 32px rgba(198,150,90,0.2) }
          50%      { box-shadow: 0 0 0 14px ${C.gold}00, 0 8px 32px rgba(198,150,90,0.35) }
        }
        .btn-pulse { animation: gentlePulse 2.8s ease-out infinite }
        @keyframes vinylSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .vinyl-spin { animation: vinylSpin 4s linear infinite; }
        html, body { height: 100%; margin: 0; scroll-behavior: smooth }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.cream}; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}55; border-radius: 2px; }
        input:focus, select:focus, textarea:focus {
          outline: none; box-shadow: 0 0 0 2px ${C.gold}44; border-color: ${C.gold}88 !important;
        }
        .nav-pill.active { color: ${C.gold}; }
        .img-cover { width:100%; height:100%; object-fit:cover; display:block; }
      `}</style>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  ROOT — full screen, flex row on desktop                */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="font-body min-h-screen w-full flex flex-col lg:flex-row" style={{ background: C.cream, color: C.deep }}>

        {/* ════════════ COVER OVERLAY ════════════ */}
        <AnimatePresence mode="wait">
          {!opened && (
            <motion.div
              key="cover"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.9 }}
              className="fixed inset-0 z-50 flex flex-col lg:flex-row"
            >
              {/* LEFT HALF — hero photo (desktop only) */}
              <div className="hidden lg:block lg:w-1/2 h-full relative overflow-hidden">
                <img src={HERO_IMAGE} alt="Wedding" className="img-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to right, rgba(42,31,20,0.15) 0%, rgba(42,31,20,0.55) 100%)" }}
                />
                {/* Names overlaid on photo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                  <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="text-[10px] tracking-[0.5em] font-medium mb-6"
                    style={{ color: "rgba(255,252,247,0.8)" }}
                  >
                    THE WEDDING OF
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="font-script"
                    style={{ fontSize: "clamp(64px,8vw,96px)", color: C.ivory, lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                  >
                    {WEDDING.bride}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className="font-display italic text-xl my-1"
                    style={{ color: C.goldLight }}
                  >
                    &amp;
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 1 }}
                    className="font-script"
                    style={{ fontSize: "clamp(64px,8vw,96px)", color: C.ivory, lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                  >
                    {WEDDING.groom}
                  </motion.h1>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1 }}
                    className="h-px w-20 my-5 origin-center"
                    style={{ background: `linear-gradient(to right, transparent, ${C.goldLight}, transparent)` }}
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="font-display italic text-base"
                    style={{ color: "rgba(255,252,247,0.75)" }}
                  >
                    {WEDDING.dateText}
                  </motion.p>
                </div>
                {/* corner ornaments on photo */}
                <div className="absolute top-5 left-5 opacity-50"><FloralCorner position="tl" /></div>
                <div className="absolute bottom-5 right-5 opacity-50"><FloralCorner position="br" /></div>
              </div>

              {/* RIGHT HALF — invitation card */}
              <div
                className="w-full lg:w-1/2 h-full flex items-center justify-center px-6 py-10 lg:px-12"
                style={{
                  background: `radial-gradient(ellipse 120% 80% at 50% 0%, ${C.rose}66 0%, transparent 55%), ${C.ivory}`,
                }}
              >
                {/* Floating gold specks */}
                {[
                  { top: "8%", left: "8%", char: "✦", size: 18, delay: 0 },
                  { top: "12%", right: "7%", char: "❋", size: 14, delay: 0.5 },
                  { bottom: "10%", left: "6%", char: "✿", size: 16, delay: 0.8 },
                  { bottom: "8%", right: "8%", char: "✧", size: 20, delay: 0.3 },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-none"
                    style={{ ...s, color: C.gold, fontSize: s.size, opacity: 0.3 }}
                    animate={{ y: [0, -8, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 4 + i, repeat: Infinity, delay: s.delay }}
                  >
                    {s.char}
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-sm text-center"
                >
                  {/* Card border */}
                  <div
                    className="relative px-8 py-10 sm:py-12"
                    style={{ border: `1px solid ${C.gold}44`, background: "rgba(255,252,247,0.7)", backdropFilter: "blur(10px)" }}
                  >
                    {/* Corner markers */}
                    {[["top-2 left-2","tl"],["top-2 right-2","tr"],["bottom-2 left-2","bl"],["bottom-2 right-2","br"]].map(([pos, corner], i) => (
                      <div key={i} className={`absolute ${pos} w-5 h-5`}>
                        <svg viewBox="0 0 16 16" fill="none">
                          <path
                            d={i === 0 ? "M0 8 L0 0 L8 0" : i === 1 ? "M16 8 L16 0 L8 0" : i === 2 ? "M0 8 L0 16 L8 16" : "M16 8 L16 16 L8 16"}
                            stroke={C.gold} strokeWidth="1.2" opacity="0.6"
                          />
                        </svg>
                      </div>
                    ))}

                    {/* Mobile-only names (hidden on desktop where photo shows them) */}
                    <div className="lg:hidden">
                      <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.45em" }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="text-[9px] tracking-[0.45em] font-medium mb-4"
                        style={{ color: C.gold }}
                      >
                        THE WEDDING OF
                      </motion.p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.35 }}
                        className="h-px w-20 mx-auto mb-5 origin-center"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
                      />
                      <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="font-script gold-shimmer"
                        style={{ fontSize: "clamp(48px, 14vw, 64px)", lineHeight: 1 }}
                      >
                        {WEDDING.bride}
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="font-display italic my-1" style={{ color: C.muted, fontSize: 18 }}
                      >
                        &amp;
                      </motion.p>
                      <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.8 }}
                        className="font-script gold-shimmer mb-5"
                        style={{ fontSize: "clamp(48px, 14vw, 64px)", lineHeight: 1 }}
                      >
                        {WEDDING.groom}
                      </motion.h1>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8 }}
                        className="h-px w-20 mx-auto mb-4 origin-center"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
                      />
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        className="font-display italic text-sm mb-5" style={{ color: C.muted }}
                      >
                        {WEDDING.dateText}
                      </motion.p>
                    </div>

                    {/* Desktop-only date (since names are on photo) */}
                    <div className="hidden lg:block mb-5">
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-[9px] tracking-[0.4em] font-medium mb-3"
                        style={{ color: C.gold }}
                      >
                        UNDANGAN PERNIKAHAN
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.65 }}
                        className="font-display italic text-base"
                        style={{ color: C.muted }}
                      >
                        {WEDDING.dateText}
                      </motion.p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8 }}
                        className="h-px w-20 mx-auto mt-4 origin-center"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
                      />
                    </div>

                    {/* Guest */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.7 }}
                      className="mb-7"
                    >
                      <p className="text-[9px] tracking-[0.35em] mb-1.5 font-medium" style={{ color: C.gold }}>KEPADA YTH.</p>
                      <p className="text-xs mb-1.5" style={{ color: C.muted }}>Bpk/Ibu/Saudara/i</p>
                      <motion.p
                        animate={{ opacity: [0.85, 1, 0.85] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="font-display text-xl sm:text-2xl font-medium"
                        style={{ color: C.deep }}
                      >
                        {guest}
                      </motion.p>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>Di Tempat</p>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={openInvitation}
                      className="btn-pulse inline-flex items-center gap-2.5 px-7 py-3 text-xs font-medium"
                      style={{
                        background: `linear-gradient(135deg, ${C.goldDark} 0%, ${C.gold} 50%, ${C.goldDark} 100%)`,
                        color: C.ivory,
                        letterSpacing: "0.12em",
                      }}
                    >
                      <span style={{ fontSize: 13 }}>✉</span> BUKA UNDANGAN
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════ MAIN CONTENT — after cover opens ════════════ */}
        {opened && (
          <div className="flex flex-col lg:flex-row w-full min-h-screen">
            <FloatingPetals />

            {/* ── DESKTOP LEFT SIDEBAR (sticky) ── */}
            <aside
              className="hidden lg:flex lg:w-[38%] xl:w-[36%] h-screen sticky top-0 flex-col overflow-hidden"
              style={{ borderRight: `1px solid ${C.gold}22` }}
            >
              {/* Photo fills top 60% */}
              <motion.div
                style={{ y: sidebarParallax }}
                className="relative flex-1 overflow-hidden"
              >
                <img src={SIDEBAR_IMAGE} alt="Wedding couple" className="img-cover" style={{ height: "115%" }} />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(42,31,20,0.1) 0%, rgba(42,31,20,0.6) 100%)" }}
                />
                {/* Corner ornaments */}
                <div className="absolute top-4 left-4 opacity-60"><FloralCorner position="tl" /></div>
                <div className="absolute top-4 right-4 opacity-60"><FloralCorner position="tr" /></div>
              </motion.div>

              {/* Bottom info panel */}
              <div
                className="relative px-8 py-6 flex flex-col items-center text-center"
                style={{ background: C.ivory, borderTop: `1px solid ${C.gold}22` }}
              >
                <p className="text-[9px] tracking-[0.4em] font-medium mb-1" style={{ color: C.gold }}>THE WEDDING OF</p>
                <h2 className="font-script" style={{ fontSize: 42, color: C.deep, lineHeight: 1 }}>{WEDDING.bride}</h2>
                <p className="font-display italic text-base my-0.5" style={{ color: C.gold }}>&amp;</p>
                <h2 className="font-script" style={{ fontSize: 42, color: C.deep, lineHeight: 1 }}>{WEDDING.groom}</h2>
                <div className="h-px w-16 my-3" style={{ background: `linear-gradient(to right, transparent, ${C.gold}66, transparent)` }} />
                <p className="font-display italic text-xs mb-5" style={{ color: C.muted }}>{WEDDING.dateText}</p>

                {/* Nav links */}
                <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="nav-pill text-[9px] tracking-widest font-medium transition-colors duration-200"
                      style={{ color: activeNav === item.id ? C.gold : C.muted, letterSpacing: "0.12em" }}
                    >
                      {item.label.toUpperCase()}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── RIGHT / MOBILE MAIN SCROLL AREA ── */}
            <div
              ref={rightRef}
              className="flex-1 lg:h-screen lg:overflow-y-auto relative"
              style={{ background: `radial-gradient(ellipse at top, ${C.rose}22 0%, transparent 40%), ${C.ivory}` }}
            >
              {/* Mobile sticky nav */}
              <motion.nav
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="sticky top-0 z-30 lg:hidden flex items-center justify-center gap-1 py-3 px-2"
                style={{ background: "rgba(255,252,247,0.9)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.gold}22` }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-3 py-1.5 text-[9px] font-medium transition-all duration-300"
                    style={{ color: activeNav === item.id ? C.gold : C.muted, letterSpacing: "0.1em" }}
                  >
                    {item.label.toUpperCase()}
                    {activeNav === item.id && (
                      <motion.div
                        layoutId="nav-mobile"
                        className="absolute bottom-0 left-2 right-2 h-px"
                        style={{ background: C.gold }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.nav>

              {/* ——— PEMBUKAAN ——— */}
              <Section id="pembukaan">
                <div className="absolute top-5 left-5 opacity-30"><FloralCorner position="tl" /></div>
                <div className="absolute top-5 right-5 opacity-30"><FloralCorner position="tr" /></div>
                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="font-display text-3xl sm:text-4xl mb-2 font-light" style={{ color: C.deep }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </motion.p>
                  <OrnamentDivider />
                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="font-display italic text-sm sm:text-base leading-[1.9] mb-2 px-2" style={{ color: C.muted }}
                  >
                    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
                    pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa
                    tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                  </motion.blockquote>
                  <p className="text-[10px] tracking-widest font-medium mb-10" style={{ color: C.gold }}>— QS. AR-RUM : 21 —</p>

                  <p className="text-xs sm:text-sm leading-relaxed mb-10 px-2" style={{ color: C.muted }}>
                    Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan
                    walimatul 'ursy putra-putri kami:
                  </p>

                  {/* Couple photos + info */}
                  <div className="flex flex-col sm:flex-row gap-8 items-start justify-center">
                    {[
                      {
                        img: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=500&q=80&fit=crop&crop=face",
                        label: "THE BRIDE",
                        script: WEDDING.bride,
                        full: WEDDING.brideFull,
                        role: "Putri dari",
                        parents: WEDDING.brideParents,
                        dir: -1,
                      },
                      {
                        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&q=80&fit=crop&crop=face",
                        label: "THE GROOM",
                        script: WEDDING.groom,
                        full: WEDDING.groomFull,
                        role: "Putra dari",
                        parents: WEDDING.groomParents,
                        dir: 1,
                      },
                    ].map((p, i) => (
                      <motion.div
                        key={p.script}
                        initial={{ opacity: 0, x: 30 * p.dir }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: i * 0.15 }}
                        className="flex-1 text-center"
                      >
                        {/* Portrait photo */}
                        <div
                          className="relative w-36 sm:w-40 mx-auto mb-4 overflow-hidden"
                          style={{
                            aspectRatio: "3/4",
                            border: `2px solid ${C.gold}44`,
                            boxShadow: `0 12px 40px rgba(198,150,90,0.15), 0 0 0 6px ${C.ivory}`,
                          }}
                        >
                          <img src={p.img} alt={p.script} className="img-cover" />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(42,31,20,0.3) 100%)" }} />
                        </div>
                        <p className="text-[9px] tracking-[0.3em] mb-1.5 font-medium" style={{ color: C.gold }}>{p.label}</p>
                        <h2 className="font-script" style={{ fontSize: 44, color: C.deep, lineHeight: 1.1 }}>{p.script}</h2>
                        <p className="font-display italic text-sm mt-1 mb-1" style={{ color: C.muted }}>{p.full}</p>
                        <p className="text-[11px] font-medium" style={{ color: C.muted }}>{p.role}</p>
                        <p className="text-[11px] font-medium" style={{ color: C.deep }}>{p.parents}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Ampersand between */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="my-6 sm:hidden"
                  >
                    <div className="font-script text-5xl" style={{ color: C.gold }}>&amp;</div>
                  </motion.div>
                </div>
              </Section>

              <div className="px-10"><div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}33, transparent)` }} /></div>

              {/* ——— DETAIL ACARA ——— */}
              <Section id="acara">
                <SectionTitle kicker="SAVE THE DATE" title="Detail Acara" subtitle="Dengan penuh kebahagiaan kami mengundang kehadiran Anda" />

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-10">
                  {[{ v: cd.d, l: "Hari" }, { v: cd.h, l: "Jam" }, { v: cd.m, l: "Menit" }, { v: cd.s, l: "Detik" }].map((x, i) => (
                    <motion.div
                      key={x.l}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="text-center py-4 sm:py-5 relative overflow-hidden"
                      style={{ background: `linear-gradient(160deg, ${C.ivory}, ${C.cream})`, border: `1px solid ${C.gold}33`, boxShadow: `0 4px 20px rgba(198,150,90,0.07)` }}
                    >
                      <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }} />
                      <motion.div
                        key={x.v}
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-2xl sm:text-3xl font-light" style={{ color: C.deep }}
                      >
                        {String(x.v).padStart(2, "0")}
                      </motion.div>
                      <div className="text-[8px] sm:text-[9px] tracking-widest mt-1 font-medium" style={{ color: C.gold }}>{x.l.toUpperCase()}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Event cards */}
                <div className="space-y-4">
                  {[
                    { title: "Akad Nikah", subtitle: "Ijab Kabul", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=120&h=120&q=80&fit=crop", data: WEDDING.akad },
                    { title: "Resepsi", subtitle: "Walimatul 'Ursy", img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=120&h=120&q=80&fit=crop", data: WEDDING.resepsi },
                  ].map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden"
                      style={{ background: `linear-gradient(160deg, ${C.ivory}, rgba(255,252,247,0.95))`, border: `1px solid ${C.gold}33`, boxShadow: `0 8px 32px rgba(198,150,90,0.07)` }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${C.gold}66, transparent)` }} />
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: `linear-gradient(to bottom, ${C.gold}00, ${C.gold}44, ${C.gold}00)` }} />
                      <div className="flex items-center gap-4 p-5 sm:p-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden" style={{ border: `1px solid ${C.gold}33` }}>
                          <img src={c.img} alt={c.title} className="img-cover" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[9px] tracking-[0.25em] font-medium mb-0.5" style={{ color: C.gold }}>{c.subtitle.toUpperCase()}</p>
                          <h3 className="font-display text-xl sm:text-2xl font-medium mb-1.5" style={{ color: C.deep }}>{c.title}</h3>
                          <p className="text-xs mb-0.5" style={{ color: C.muted }}>{c.data.day}</p>
                          <p className="text-xs font-semibold mb-0.5" style={{ color: C.deep }}>{c.data.time}</p>
                          <p className="text-xs italic mb-3" style={{ color: C.muted }}>{c.data.place}</p>
                          <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            href={c.data.maps}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-medium"
                            style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.ivory, letterSpacing: "0.08em" }}
                          >
                            ↗ GOOGLE MAPS
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Section>

              <div className="px-10"><div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}33, transparent)` }} /></div>

              {/* ——— GALERI ——— */}
              <Section id="galeri">
                <SectionTitle kicker="OUR GALLERY" title="Momen Kami" subtitle="Sebuah perjalanan cinta yang indah" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {GALLERY_PHOTOS.map((p, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.92, y: 16 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.6 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLightbox(i)}
                      className="aspect-[3/4] relative overflow-hidden group"
                      style={{ boxShadow: `0 4px 20px rgba(198,150,90,0.1)` }}
                    >
                      <img src={p.src} alt={p.label} className="img-cover transition-transform duration-700 group-hover:scale-110" />
                      {/* Label overlay */}
                      <div className="absolute inset-x-0 bottom-0 py-3 px-2 text-center" style={{ background: "linear-gradient(to top, rgba(42,31,20,0.7) 0%, transparent 100%)" }}>
                        <p className="font-display italic text-xs text-white">{p.label}</p>
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center" style={{ background: "rgba(198,150,90,0.15)" }}>
                        <div className="px-3 py-1.5 text-[9px] font-medium tracking-widest" style={{ background: "rgba(255,252,247,0.9)", color: C.gold }}>
                          LIHAT
                        </div>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300" />
                    </motion.button>
                  ))}
                </div>
              </Section>

              <div className="px-10"><div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}33, transparent)` }} /></div>

              {/* ——— RSVP ——— */}
              <Section id="rsvp">
                <SectionTitle kicker="RSVP" title="Ucapan & Doa" subtitle="Sampaikan ucapan dan doa terbaik Anda" />
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-10">
                      <div className="text-4xl mb-3">✉</div>
                      <p className="font-display text-xl mb-1" style={{ color: C.deep }}>Terima Kasih</p>
                      <p className="text-xs" style={{ color: C.muted }}>Ucapan Anda telah terkirim</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onSubmit={submitRsvp}
                      className="space-y-3 mb-8 p-6"
                      style={{ background: `linear-gradient(160deg, ${C.ivory}, ${C.cream})`, border: `1px solid ${C.gold}33`, boxShadow: `0 8px 32px rgba(198,150,90,0.07)` }}
                    >
                      <div className="h-[2px] w-full mb-4" style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }} />
                      {[
                        { type: "input", value: form.nama, onChange: (v: string) => setForm({ ...form, nama: v }), placeholder: "Nama Anda", required: true },
                      ].map((f, i) => (
                        <input
                          key={i}
                          required={f.required}
                          value={f.value}
                          onChange={(e) => f.onChange(e.target.value)}
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 text-sm bg-white/80"
                          style={{ border: `1px solid ${C.gold}33`, color: C.deep, fontFamily: "Montserrat, sans-serif" }}
                        />
                      ))}
                      <select
                        value={form.hadir}
                        onChange={(e) => setForm({ ...form, hadir: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-white/80"
                        style={{ border: `1px solid ${C.gold}33`, color: C.deep, fontFamily: "Montserrat, sans-serif" }}
                      >
                        <option value="Hadir">✓ Insya Allah Hadir</option>
                        <option value="Tidak Hadir">✗ Belum Bisa Hadir</option>
                      </select>
                      <textarea
                        required rows={3}
                        value={form.ucapan}
                        onChange={(e) => setForm({ ...form, ucapan: e.target.value })}
                        placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                        className="w-full px-4 py-3 text-sm bg-white/80 resize-none"
                        style={{ border: `1px solid ${C.gold}33`, color: C.deep, fontFamily: "Montserrat, sans-serif" }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 text-xs font-medium tracking-widest"
                        style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color: C.ivory, letterSpacing: "0.12em" }}
                      >
                        KIRIM UCAPAN
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {rsvps.length === 0 && (
                      <p className="text-center text-[11px] italic py-6" style={{ color: C.muted }}>Belum ada ucapan. Jadilah yang pertama ✦</p>
                    )}
                    {rsvps.map((r) => (
                      <motion.div
                        key={r.ts} layout
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className="relative overflow-hidden p-4"
                        style={{ background: `linear-gradient(160deg, ${C.ivory}, ${C.cream})`, border: `1px solid ${C.gold}22` }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${C.gold}00, ${C.gold}55, ${C.gold}00)` }} />
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="font-display text-base font-medium" style={{ color: C.deep }}>{r.nama}</p>
                          <span className="text-[9px] px-2.5 py-0.5 font-medium" style={{ background: r.hadir === "Hadir" ? `${C.gold}22` : C.rose, color: r.hadir === "Hadir" ? C.gold : C.roseDark, border: `1px solid ${r.hadir === "Hadir" ? C.gold + "44" : C.roseDark + "44"}` }}>
                            {r.hadir === "Hadir" ? "HADIR" : "TIDAK"}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed italic" style={{ color: C.muted }}>{r.ucapan}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Section>

              <div className="px-10"><div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}33, transparent)` }} /></div>

              {/* ——— PENUTUP ——— */}
              <Section id="penutup" className="relative">
                <div className="absolute bottom-5 left-5 opacity-30"><FloralCorner position="bl" /></div>
                <div className="absolute bottom-5 right-5 opacity-30"><FloralCorner position="br" /></div>
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <div className="font-script text-6xl sm:text-7xl gold-shimmer">Terima Kasih</div>
                  </motion.div>
                  <OrnamentDivider />
                  <p className="font-display italic text-sm sm:text-base leading-relaxed mb-6 px-4" style={{ color: C.muted }}>
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                    Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                  </p>
                  <p className="font-display italic text-sm mb-2" style={{ color: C.muted }}>Kami yang berbahagia,</p>
                  <motion.h3
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="font-script text-5xl sm:text-6xl" style={{ color: C.deep }}
                  >
                    {WEDDING.bride} &amp; {WEDDING.groom}
                  </motion.h3>
                  <div className="h-px w-24 mx-auto my-8" style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }} />
                  <motion.a
                    whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                    href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${WEDDING.bride} & ${WEDDING.groom} — ${WEDDING.dateText}. ${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-3 text-xs font-medium tracking-widest"
                    style={{ background: "#25D366", color: "#fff", letterSpacing: "0.1em" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    BAGIKAN KE WHATSAPP
                  </motion.a>
                  <p className="text-[10px] mt-12 pb-4 tracking-widest" style={{ color: C.gold, opacity: 0.45 }}>✦ MADE WITH LOVE ✦</p>
                </div>
              </Section>
            </div>
          </div>
        )}

        {/* ════════════ MUSIC BUTTON ════════════ */}
        {opened && (
          <>
            <audio ref={audioRef} src={WEDDING.music[musicIdx]} loop preload="auto" onError={onAudioError} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMusic}
              className="fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, boxShadow: `0 8px 24px rgba(198,150,90,0.4)` }}
              aria-label="Toggle music"
            >
              {playing ? (
                <motion.div className="vinyl-spin">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M6 12 a6 6 0 0 1 6-6" stroke="white" strokeWidth="1" fill="none" opacity="0.6"/>
                    <path d="M18 12 a6 6 0 0 1-6 6" stroke="white" strokeWidth="1" fill="none" opacity="0.6"/>
                  </svg>
                </motion.div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              )}
            </motion.button>
          </>
        )}

        {/* ════════════ LIGHTBOX ════════════ */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12"
              style={{ background: "rgba(42,31,20,0.88)", backdropFilter: "blur(10px)" }}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative overflow-hidden"
                style={{ maxWidth: 420, width: "100%", aspectRatio: "3/4", boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${C.gold}33` }}
              >
                <img src={GALLERY_PHOTOS[lightbox].src} alt={GALLERY_PHOTOS[lightbox].label} className="img-cover" />
                <div className="absolute inset-x-0 bottom-0 py-5 px-4 text-center" style={{ background: "linear-gradient(to top, rgba(42,31,20,0.8) 0%, transparent 100%)" }}>
                  <p className="font-display italic text-white text-lg">{GALLERY_PHOTOS[lightbox].label}</p>
                  <p className="text-[10px] tracking-widest mt-1 font-medium" style={{ color: C.goldLight }}>{WEDDING.bride.toUpperCase()} &amp; {WEDDING.groom.toUpperCase()}</p>
                </div>
                <div className="absolute top-3 left-3 opacity-50"><FloralCorner position="tl" /></div>
                <div className="absolute top-3 right-3 opacity-50"><FloralCorner position="tr" /></div>
                <button
                  onClick={() => setLightbox(null)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center z-10"
                  style={{ background: "rgba(255,252,247,0.15)", color: "white", backdropFilter: "blur(4px)" }}
                >
                  ✕
                </button>
                {/* Prev/Next */}
                {lightbox > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                    style={{ background: "rgba(255,252,247,0.15)", color: "white", backdropFilter: "blur(4px)" }}
                  >‹</button>
                )}
                {lightbox < GALLERY_PHOTOS.length - 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                    style={{ background: "rgba(255,252,247,0.15)", color: "white", backdropFilter: "blur(4px)" }}
                  >›</button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
