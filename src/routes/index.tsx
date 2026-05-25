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
      <div className="h-px flex-1 opacity-30" style={{ background: C.gold }} />
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <path d="M20 2 C14 2, 8 8, 2 10 C8 12, 14 18, 20 18 C26 18, 32 12, 38 10 C32 8, 26 2, 20 2Z" fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.7"/>
        <circle cx="20" cy="10" r="2" fill={C.gold} opacity="0.8"/>
        <circle cx="6" cy="10" r="1.2" fill={C.gold} opacity="0.5"/>
        <circle cx="34" cy="10" r="1.2" fill={C.gold} opacity="0.5"/>
      </svg>
      <div className="h-px flex-1 opacity-30" style={{ background: C.gold }} />
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
    <svg
      width="90"
      height="90"
      viewBox="0 0 90 90"
      fill="none"
      style={{ transform: transforms[position] }}
    >
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
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        char: ["✦", "✧", "◆", "❋", "✿", "❀", "✼", "❁"][i % 8],
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 15 + Math.random() * 15,
        size: 8 + Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-5%", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "108vh",
            x: [0, 15, -15, 8, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            fontSize: p.size,
            color: C.gold,
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}

function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full px-6 sm:px-10 py-16 sm:py-20 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
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
      <h2
        className="font-display text-3xl sm:text-4xl mb-2"
        style={{ color: C.deep }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="font-body text-sm mt-2 italic" style={{ color: C.muted }}>
          {subtitle}
        </p>
      )}
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

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, -80]);
  const coverBgY = useTransform(scrollY, [0, 300], [0, 60]);

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
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 50);
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const photos = [
    { color: `linear-gradient(135deg, #E8D5D0 0%, #F5EBE8 100%)`, label: "Pre-wedding I" },
    { color: `linear-gradient(135deg, #D5DDE8 0%, #EBF0F5 100%)`, label: "Pre-wedding II" },
    { color: `linear-gradient(135deg, #D5E8DA 0%, #EBF5EE 100%)`, label: "Pre-wedding III" },
    { color: `linear-gradient(135deg, #E8E5D5 0%, #F5F2EB 100%)`, label: "Pre-wedding IV" },
    { color: `linear-gradient(135deg, #E8D5E5 0%, #F5EBF4 100%)`, label: "Pre-wedding V" },
    { color: `linear-gradient(135deg, #D5E8E8 0%, #EBF5F5 100%)`, label: "Pre-wedding VI" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
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
        
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .vinyl-spin { animation: vinylSpin 4s linear infinite; }
        
        html { scroll-behavior: smooth }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${C.cream}; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}66; border-radius: 2px; }
        
        .nav-indicator {
          background: linear-gradient(90deg, ${C.gold}00, ${C.gold}, ${C.gold}00);
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 2px ${C.gold}44;
          border-color: ${C.gold}88 !important;
        }
      `}</style>

      <div
        className="font-body min-h-screen w-full relative"
        style={{
          background: `
            radial-gradient(ellipse 900px 600px at 0% 0%, ${C.rose}55 0%, transparent 60%),
            radial-gradient(ellipse 700px 500px at 100% 100%, ${C.rose}44 0%, transparent 55%),
            radial-gradient(ellipse 800px 400px at 50% 50%, ${C.goldLight}11 0%, transparent 70%),
            linear-gradient(170deg, ${C.cream} 0%, ${C.ivory} 40%, ${C.cream} 100%)
          `,
          color: C.deep,
        }}
      >
        <div
          className="mx-auto w-full max-w-[480px] sm:max-w-[520px] relative min-h-screen overflow-hidden"
          style={{
            boxShadow: `0 0 80px rgba(198,150,90,0.12), 0 0 0 1px ${C.gold}22`,
            background: `
              radial-gradient(ellipse at top, ${C.rose}33 0%, transparent 50%),
              linear-gradient(180deg, ${C.ivory} 0%, rgba(255,252,247,0.97) 100%)
            `,
          }}
        >
          {opened && <FloatingPetals />}

          {/* ============ COVER ============ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div
                key="cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{
                  maxWidth: 520,
                  left: 0,
                  right: 0,
                  margin: "0 auto",
                  background: `
                    radial-gradient(ellipse 120% 60% at 50% -10%, ${C.rose}88 0%, transparent 55%),
                    radial-gradient(ellipse 80% 40% at 20% 110%, ${C.rose}55 0%, transparent 50%),
                    linear-gradient(170deg, ${C.cream} 0%, ${C.ivory} 100%)
                  `,
                }}
              >
                <motion.div style={{ y: coverBgY }} className="absolute inset-0 pointer-events-none">
                  {[
                    { top: "4%", left: "5%", size: 28, delay: 0 },
                    { top: "8%", right: "6%", size: 20, delay: 0.5 },
                    { top: "20%", left: "3%", size: 16, delay: 1 },
                    { top: "15%", right: "4%", size: 22, delay: 0.8 },
                    { bottom: "12%", left: "5%", size: 20, delay: 0.3 },
                    { bottom: "6%", right: "5%", size: 26, delay: 0.7 },
                    { bottom: "22%", left: "2%", size: 14, delay: 1.2 },
                    { bottom: "18%", right: "3%", size: 18, delay: 0.6 },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{ ...s, color: C.gold, fontSize: s.size, opacity: 0.35 }}
                      animate={{ y: [0, -8, 0], rotate: [0, 12, 0], opacity: [0.25, 0.45, 0.25] }}
                      transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: s.delay }}
                    >
                      {["✦", "❋", "✿", "✧", "❀", "◆", "✼", "❁"][i]}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Corner ornaments */}
                <div className="absolute top-4 left-4 opacity-60">
                  <FloralCorner position="tl" />
                </div>
                <div className="absolute top-4 right-4 opacity-60">
                  <FloralCorner position="tr" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-60">
                  <FloralCorner position="bl" />
                </div>
                <div className="absolute bottom-4 right-4 opacity-60">
                  <FloralCorner position="br" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full text-center"
                  >
                    {/* Inner border card */}
                    <div
                      className="relative px-8 py-12 sm:px-12 sm:py-16"
                      style={{
                        border: `1px solid ${C.gold}55`,
                        background: "rgba(255,252,247,0.6)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      {/* Inner corner accents */}
                      {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos, i) => (
                        <div key={i} className={`absolute ${pos} w-5 h-5`}>
                          <svg viewBox="0 0 16 16" fill="none">
                            <path
                              d={i === 0 ? "M0 8 L0 0 L8 0" : i === 1 ? "M16 8 L16 0 L8 0" : i === 2 ? "M0 8 L0 16 L8 16" : "M16 8 L16 16 L8 16"}
                              stroke={C.gold} strokeWidth="1.2" opacity="0.7"
                            />
                          </svg>
                        </div>
                      ))}

                      <motion.p
                        initial={{ opacity: 0, letterSpacing: "0.2em" }}
                        animate={{ opacity: 1, letterSpacing: "0.5em" }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                        className="text-[9px] sm:text-[10px] font-medium tracking-[0.5em] mb-5"
                        style={{ color: C.gold }}
                      >
                        THE WEDDING OF
                      </motion.p>

                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-px w-24 mx-auto mb-6 origin-center"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
                      />

                      <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="font-script gold-shimmer mb-1"
                        style={{ fontSize: "clamp(52px, 14vw, 72px)", lineHeight: 1 }}
                      >
                        {WEDDING.bride}
                      </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        className="font-display italic text-base my-1"
                        style={{ color: C.muted }}
                      >
                        &amp;
                      </motion.p>

                      <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="font-script gold-shimmer mb-5"
                        style={{ fontSize: "clamp(52px, 14vw, 72px)", lineHeight: 1 }}
                      >
                        {WEDDING.groom}
                      </motion.h1>

                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="h-px w-24 mx-auto mb-5 origin-center"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
                      />

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.7 }}
                        className="font-display italic text-sm sm:text-base mb-6"
                        style={{ color: C.muted }}
                      >
                        {WEDDING.dateText}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.7 }}
                        className="mb-7"
                      >
                        <p className="text-[9px] tracking-[0.35em] mb-1.5 font-medium" style={{ color: C.gold }}>
                          KEPADA YTH.
                        </p>
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
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={openInvitation}
                        className="btn-pulse inline-flex items-center gap-2.5 px-7 py-3 text-sm font-medium tracking-widest"
                        style={{
                          background: `linear-gradient(135deg, ${C.goldDark} 0%, ${C.gold} 50%, ${C.goldDark} 100%)`,
                          color: C.ivory,
                          letterSpacing: "0.12em",
                        }}
                      >
                        <span style={{ fontSize: 14 }}>✉</span> BUKA UNDANGAN
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============ MAIN ============ */}
          {opened && (
            <div className="relative z-10">

              {/* Sticky Nav */}
              <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="sticky top-0 z-30 flex items-center justify-center gap-1 py-3 px-2"
                style={{
                  background: "rgba(255,252,247,0.88)",
                  backdropFilter: "blur(16px)",
                  borderBottom: `1px solid ${C.gold}22`,
                }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="relative px-3 py-1.5 text-[10px] font-medium tracking-widest transition-all duration-300"
                    style={{
                      color: activeNav === item.id ? C.gold : C.muted,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {item.label.toUpperCase()}
                    {activeNav === item.id && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-0 right-0 h-px nav-indicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </motion.nav>

              {/* Hero parallax top */}
              <motion.div
                style={{ y: heroParallax }}
                className="absolute top-12 left-0 right-0 h-24 pointer-events-none z-0"
              >
                <div className="flex justify-between px-6">
                  <div className="opacity-20" style={{ color: C.gold, fontSize: 32 }}>✦</div>
                  <div className="opacity-15" style={{ color: C.gold, fontSize: 24 }}>❋</div>
                  <div className="opacity-20" style={{ color: C.gold, fontSize: 32 }}>✦</div>
                </div>
              </motion.div>

              {/* ——— PEMBUKAAN ——— */}
              <Section id="pembukaan">
                {/* Corner ornaments */}
                <div className="absolute top-6 left-6 opacity-40">
                  <FloralCorner position="tl" />
                </div>
                <div className="absolute top-6 right-6 opacity-40">
                  <FloralCorner position="tr" />
                </div>

                <div className="text-center">
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="font-display text-3xl sm:text-4xl mb-2"
                    style={{ color: C.deep, fontWeight: 300 }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </motion.p>

                  <OrnamentDivider />

                  <motion.blockquote
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="font-display italic text-sm sm:text-base leading-[1.9] mb-2 px-2"
                    style={{ color: C.muted }}
                  >
                    "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
                    pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa
                    tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                  </motion.blockquote>
                  <p className="text-[11px] tracking-widest font-medium mb-10" style={{ color: C.gold }}>
                    — QS. AR-RUM : 21 —
                  </p>

                  <p className="text-xs sm:text-sm leading-relaxed mb-10 px-2" style={{ color: C.muted }}>
                    Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan
                    walimatul 'ursy putra-putri kami:
                  </p>

                  {/* Bride */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                    className="mb-6"
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                      style={{
                        background: `radial-gradient(circle, ${C.rose} 0%, ${C.roseDark}55 100%)`,
                        border: `2px solid ${C.gold}44`,
                        boxShadow: `0 8px 32px ${C.rose}88, 0 0 0 6px ${C.ivory}`,
                      }}
                    >
                      🌸
                    </div>
                    <p className="text-[9px] tracking-[0.3em] mb-2 font-medium" style={{ color: C.gold }}>
                      THE BRIDE
                    </p>
                    <h2 className="font-script text-5xl sm:text-6xl mb-1" style={{ color: C.deep }}>
                      {WEDDING.bride}
                    </h2>
                    <p className="font-display text-sm italic mb-2" style={{ color: C.muted }}>
                      {WEDDING.brideFull}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: C.muted }}>
                      Putri dari {WEDDING.brideParents}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="my-6"
                  >
                    <div className="font-script text-5xl" style={{ color: C.gold }}>
                      &amp;
                    </div>
                    <div className="h-px w-16 mx-auto mt-2" style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }} />
                  </motion.div>

                  {/* Groom */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1 }}
                    className="mb-4"
                  >
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl"
                      style={{
                        background: `radial-gradient(circle, #D5E5D5 0%, #A8C4A855 100%)`,
                        border: `2px solid ${C.gold}44`,
                        boxShadow: `0 8px 32px #D5E5D588, 0 0 0 6px ${C.ivory}`,
                      }}
                    >
                      🌿
                    </div>
                    <p className="text-[9px] tracking-[0.3em] mb-2 font-medium" style={{ color: C.gold }}>
                      THE GROOM
                    </p>
                    <h2 className="font-script text-5xl sm:text-6xl mb-1" style={{ color: C.deep }}>
                      {WEDDING.groom}
                    </h2>
                    <p className="font-display text-sm italic mb-2" style={{ color: C.muted }}>
                      {WEDDING.groomFull}
                    </p>
                    <p className="text-[11px] font-medium" style={{ color: C.muted }}>
                      Putra dari {WEDDING.groomParents}
                    </p>
                  </motion.div>
                </div>
              </Section>

              <div className="px-8">
                <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}44, transparent)` }} />
              </div>

              {/* ——— DETAIL ACARA ——— */}
              <Section id="acara">
                <SectionTitle
                  kicker="SAVE THE DATE"
                  title="Detail Acara"
                  subtitle="Dengan penuh kebahagiaan kami mengundang kehadiran Anda"
                />

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-10">
                  {[
                    { v: cd.d, l: "Hari" },
                    { v: cd.h, l: "Jam" },
                    { v: cd.m, l: "Menit" },
                    { v: cd.s, l: "Detik" },
                  ].map((x, i) => (
                    <motion.div
                      key={x.l}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center py-4 sm:py-5 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, ${C.ivory} 0%, ${C.cream} 100%)`,
                        border: `1px solid ${C.gold}33`,
                        boxShadow: `0 4px 20px rgba(198,150,90,0.08)`,
                      }}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-[2px]"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }}
                      />
                      <motion.div
                        key={x.v}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-2xl sm:text-3xl font-light"
                        style={{ color: C.deep }}
                      >
                        {String(x.v).padStart(2, "0")}
                      </motion.div>
                      <div className="text-[8px] sm:text-[9px] tracking-widest mt-1 font-medium" style={{ color: C.gold }}>
                        {x.l.toUpperCase()}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Event cards */}
                <div className="space-y-4">
                  {[
                    {
                      title: "Akad Nikah",
                      subtitle: "Ijab Kabul",
                      icon: "💍",
                      data: WEDDING.akad,
                      accent: C.rose,
                    },
                    {
                      title: "Resepsi",
                      subtitle: "Walimatul 'Ursy",
                      icon: "🥂",
                      data: WEDDING.resepsi,
                      accent: "#D5E5D5",
                    },
                  ].map((c, i) => (
                    <motion.div
                      key={c.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.15 }}
                      whileHover={{ y: -3 }}
                      className="relative overflow-hidden"
                      style={{
                        background: `linear-gradient(160deg, ${C.ivory} 0%, rgba(255,252,247,0.95) 100%)`,
                        border: `1px solid ${C.gold}33`,
                        boxShadow: `0 8px 32px rgba(198,150,90,0.07)`,
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${C.gold}66, transparent)` }} />
                      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: `linear-gradient(to bottom, ${C.gold}00, ${C.gold}55, ${C.gold}00)` }} />

                      <div className="flex items-center gap-5 p-6">
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                          style={{
                            background: `radial-gradient(circle, ${c.accent} 0%, ${c.accent}66 100%)`,
                            border: `1px solid ${C.gold}33`,
                          }}
                        >
                          {c.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-[9px] tracking-[0.25em] font-medium mb-0.5" style={{ color: C.gold }}>
                            {c.subtitle.toUpperCase()}
                          </p>
                          <h3 className="font-display text-xl sm:text-2xl font-medium mb-2" style={{ color: C.deep }}>
                            {c.title}
                          </h3>
                          <p className="text-xs mb-0.5" style={{ color: C.muted }}>{c.data.day}</p>
                          <p className="text-xs font-semibold mb-1" style={{ color: C.deep }}>{c.data.time}</p>
                          <p className="text-xs italic mb-3" style={{ color: C.muted }}>{c.data.place}</p>
                          <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            href={c.data.maps}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-medium tracking-widest transition-all"
                            style={{
                              background: `linear-gradient(135deg, ${C.goldDark}, ${C.gold})`,
                              color: C.ivory,
                              letterSpacing: "0.08em",
                            }}
                          >
                            ↗ GOOGLE MAPS
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Section>

              <div className="px-8">
                <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}44, transparent)` }} />
              </div>

              {/* ——— GALERI ——— */}
              <Section id="galeri">
                <SectionTitle
                  kicker="OUR GALLERY"
                  title="Momen Kami"
                  subtitle="Sebuah perjalanan cinta yang indah"
                />
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  {photos.map((p, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.6 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setLightbox(i)}
                      className="aspect-[4/5] relative overflow-hidden group"
                      style={{
                        background: p.color,
                        boxShadow: `0 4px 20px rgba(198,150,90,0.1)`,
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl mb-2 opacity-40" style={{ color: C.muted }}>
                          {["🌸", "💑", "🌿", "✨", "🌺", "💍"][i]}
                        </div>
                        <p className="font-display italic text-xs" style={{ color: C.muted }}>
                          {p.label}
                        </p>
                      </div>
                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{ background: `${C.gold}22` }}
                      >
                        <div
                          className="px-3 py-1.5 text-[9px] font-medium tracking-widest"
                          style={{ background: C.ivory, color: C.gold, border: `1px solid ${C.gold}44` }}
                        >
                          LIHAT
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ border: `2px solid ${C.gold}55` }}
                      />
                    </motion.button>
                  ))}
                </div>
              </Section>

              <div className="px-8">
                <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}44, transparent)` }} />
              </div>

              {/* ——— RSVP ——— */}
              <Section id="rsvp">
                <SectionTitle
                  kicker="RSVP"
                  title="Ucapan & Doa"
                  subtitle="Sampaikan ucapan dan doa terbaik Anda"
                />

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-10"
                    >
                      <div className="text-4xl mb-3">✉</div>
                      <p className="font-display text-xl mb-1" style={{ color: C.deep }}>Terima Kasih</p>
                      <p className="text-xs" style={{ color: C.muted }}>Ucapan Anda telah terkirim</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      onSubmit={submitRsvp}
                      className="space-y-3 mb-8"
                      style={{
                        background: `linear-gradient(160deg, ${C.ivory} 0%, ${C.cream} 100%)`,
                        border: `1px solid ${C.gold}33`,
                        padding: "1.5rem",
                        boxShadow: `0 8px 32px rgba(198,150,90,0.07)`,
                      }}
                    >
                      <div className="h-[2px] w-full mb-5" style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }} />
                      <input
                        required
                        value={form.nama}
                        onChange={(e) => setForm({ ...form, nama: e.target.value })}
                        placeholder="Nama Anda"
                        className="w-full px-4 py-3 text-sm transition-all duration-200 bg-white/80"
                        style={{
                          border: `1px solid ${C.gold}33`,
                          color: C.deep,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      />
                      <select
                        value={form.hadir}
                        onChange={(e) => setForm({ ...form, hadir: e.target.value })}
                        className="w-full px-4 py-3 text-sm transition-all duration-200 bg-white/80"
                        style={{
                          border: `1px solid ${C.gold}33`,
                          color: C.deep,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        <option value="Hadir">✓ Insya Allah Hadir</option>
                        <option value="Tidak Hadir">✗ Belum Bisa Hadir</option>
                      </select>
                      <textarea
                        required
                        rows={3}
                        value={form.ucapan}
                        onChange={(e) => setForm({ ...form, ucapan: e.target.value })}
                        placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                        className="w-full px-4 py-3 text-sm transition-all duration-200 bg-white/80 resize-none"
                        style={{
                          border: `1px solid ${C.gold}33`,
                          color: C.deep,
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 text-xs font-medium tracking-widest transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${C.goldDark} 0%, ${C.gold} 50%, ${C.goldDark} 100%)`,
                          color: C.ivory,
                          letterSpacing: "0.12em",
                        }}
                      >
                        KIRIM UCAPAN
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {rsvps.length === 0 && (
                      <p className="text-center text-[11px] italic py-6" style={{ color: C.muted }}>
                        Belum ada ucapan. Jadilah yang pertama ✦
                      </p>
                    )}
                    {rsvps.map((r) => (
                      <motion.div
                        key={r.ts}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="relative overflow-hidden p-4"
                        style={{
                          background: `linear-gradient(160deg, ${C.ivory} 0%, ${C.cream} 100%)`,
                          border: `1px solid ${C.gold}22`,
                        }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${C.gold}00, ${C.gold}55, ${C.gold}00)` }} />
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="font-display text-base font-medium" style={{ color: C.deep }}>
                            {r.nama}
                          </p>
                          <span
                            className="text-[9px] px-2.5 py-0.5 font-medium tracking-wider"
                            style={{
                              background: r.hadir === "Hadir" ? `${C.gold}22` : `${C.rose}`,
                              color: r.hadir === "Hadir" ? C.gold : C.roseDark,
                              border: `1px solid ${r.hadir === "Hadir" ? C.gold + "44" : C.roseDark + "44"}`,
                            }}
                          >
                            {r.hadir === "Hadir" ? "HADIR" : "TIDAK"}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed italic" style={{ color: C.muted }}>{r.ucapan}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Section>

              <div className="px-8">
                <div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}44, transparent)` }} />
              </div>

              {/* ——— PENUTUP ——— */}
              <Section id="penutup" className="relative">
                <div className="absolute bottom-6 left-6 opacity-40">
                  <FloralCorner position="bl" />
                </div>
                <div className="absolute bottom-6 right-6 opacity-40">
                  <FloralCorner position="br" />
                </div>

                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="mb-8"
                  >
                    <div className="font-script text-6xl sm:text-7xl mb-1 gold-shimmer">
                      Terima Kasih
                    </div>
                  </motion.div>

                  <OrnamentDivider />

                  <p className="font-display italic text-sm sm:text-base leading-relaxed mb-6 px-4" style={{ color: C.muted }}>
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                    Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu
                    kepada kedua mempelai.
                  </p>

                  <p className="font-display italic text-sm mb-2" style={{ color: C.muted }}>
                    Kami yang berbahagia,
                  </p>
                  <motion.h3
                    animate={{ opacity: [0.85, 1, 0.85] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="font-script text-5xl sm:text-6xl"
                    style={{ color: C.deep }}
                  >
                    {WEDDING.bride} &amp; {WEDDING.groom}
                  </motion.h3>

                  <div className="h-px w-24 mx-auto my-8" style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }} />

                  <motion.a
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Undangan pernikahan ${WEDDING.bride} & ${WEDDING.groom} — ${WEDDING.dateText}. ${typeof window !== "undefined" ? window.location.href : ""}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 py-3 text-xs font-medium tracking-widest transition-all"
                    style={{
                      background: "#25D366",
                      color: "#fff",
                      letterSpacing: "0.1em",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    BAGIKAN KE WHATSAPP
                  </motion.a>

                  <p className="text-[10px] mt-12 pb-4 tracking-widest" style={{ color: C.gold, opacity: 0.5 }}>
                    ✦ MADE WITH LOVE ✦
                  </p>
                </div>
              </Section>
            </div>
          )}

          {/* Music Player */}
          {opened && (
            <>
              <audio
                ref={audioRef}
                src={WEDDING.music[musicIdx]}
                loop
                preload="auto"
                onError={onAudioError}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMusic}
                className="fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${C.goldDark} 0%, ${C.gold} 100%)`,
                  boxShadow: `0 8px 24px rgba(198,150,90,0.4)`,
                }}
                aria-label="Toggle music"
              >
                {playing ? (
                  <motion.div className="vinyl-spin" style={{ lineHeight: 1 }}>
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

          {/* Lightbox */}
          <AnimatePresence>
            {lightbox !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightbox(null)}
                className="fixed inset-0 z-50 flex items-center justify-center p-8"
                style={{ background: "rgba(42,31,20,0.85)", backdropFilter: "blur(8px)" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-full max-w-sm aspect-[4/5] flex flex-col items-center justify-center overflow-hidden"
                  style={{
                    background: photos[lightbox].color,
                    border: `1px solid ${C.gold}55`,
                    boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${C.gold}22`,
                  }}
                >
                  <div className="absolute top-3 left-3 opacity-50"><FloralCorner position="tl" /></div>
                  <div className="absolute top-3 right-3 opacity-50"><FloralCorner position="tr" /></div>
                  <div className="absolute bottom-3 left-3 opacity-50"><FloralCorner position="bl" /></div>
                  <div className="absolute bottom-3 right-3 opacity-50"><FloralCorner position="br" /></div>

                  <div className="text-5xl mb-4 opacity-30" style={{ color: C.muted }}>
                    {["🌸", "💑", "🌿", "✨", "🌺", "💍"][lightbox]}
                  </div>
                  <p className="font-display italic text-lg" style={{ color: C.muted }}>
                    {photos[lightbox].label}
                  </p>
                  <p className="text-[10px] tracking-widest mt-2 font-medium" style={{ color: C.gold }}>
                    {WEDDING.bride.toUpperCase()} & {WEDDING.groom.toUpperCase()}
                  </p>

                  <button
                    onClick={() => setLightbox(null)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
                    style={{ color: C.muted, border: `1px solid ${C.gold}44` }}
                  >
                    <span style={{ fontSize: 14 }}>✕</span>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
