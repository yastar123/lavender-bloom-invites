import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
} from "motion/react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ─────────────────────────────────────── DATA ─── */
const W = {
  bride: "Anis",
  brideFull: "Anis Permata Sari",
  brideParents: "Bapak Suryanto & Ibu Hartini",
  groom: "Fadli",
  groomFull: "Fadli Ahmad Rahman",
  groomParents: "Bapak Mahmud & Ibu Siti Aminah",
  dateText: "Sabtu, 27 April 2024",
  date: "2024-04-27T08:00:00+07:00",
  akad: {
    time: "08.00 – 10.00 WIB",
    place: "Masjid Al-Hikmah",
    addr: "Jl. Raya Kebayoran Lama No.32, Jakarta Selatan",
    maps: "https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta",
  },
  resepsi: {
    time: "11.00 – 14.00 WIB",
    place: "The Sultan Ballroom",
    addr: "Jl. Gatot Subroto, Senayan, Jakarta Pusat",
    maps: "https://maps.google.com/?q=Sultan+Hotel+Jakarta",
  },
  music: [
    "https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  ],
  story: [
    {
      year: "2019",
      title: "Pertemuan Pertama",
      sub: "Sebuah senyum yang mengubah segalanya",
      body: "Kami bertemu pertama kali di acara orientasi kampus. Satu tatapan yang tak sengaja, menjadi awal dari cerita yang paling indah.",
      img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&q=80&fit=crop",
    },
    {
      year: "2021",
      title: "Jatuh Cinta",
      sub: "Dua hati yang akhirnya bicara",
      body: "Dua tahun persahabatan yang dalam, perlahan berubah menjadi cinta yang tulus. Kami tahu, ini adalah sesuatu yang sangat spesial.",
      img: "https://images.unsplash.com/photo-1529635696947-b3f8c0d35b3c?w=600&h=800&q=80&fit=crop",
    },
    {
      year: "2023",
      title: "Lamaran",
      sub: "Momen yang paling dinantikan",
      body: "Di tepi pantai Bali, saat matahari tenggelam, Fadli berlutut dan bertanya, 'Maukah kamu menjadi teman hidupku?' Anis menjawab dengan air mata bahagia.",
      img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&q=80&fit=crop",
    },
    {
      year: "2024",
      title: "Hari Bahagia",
      sub: "Selamanya dimulai hari ini",
      body: "27 April 2024 — hari yang selalu kami impikan. Bersama keluarga dan sahabat tercinta, kami resmi menyatukan dua jiwa dalam ikatan suci.",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&q=80&fit=crop",
    },
  ],
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=1000&q=85&fit=crop",
      label: "Momen Pertama",
    },
    {
      src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=1000&q=85&fit=crop",
      label: "Dalam Kebun Bunga",
    },
    {
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=1000&q=85&fit=crop",
      label: "Cincin Kami",
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456503681?w=800&h=1000&q=85&fit=crop",
      label: "Tarian Pertama",
    },
    {
      src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1000&q=85&fit=crop",
      label: "Dekorasi Akad",
    },
    {
      src: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=800&h=1000&q=85&fit=crop",
      label: "Bunga Cinta",
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&q=85&fit=crop",
      label: "Momen Bersama",
    },
    {
      src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=1000&q=85&fit=crop",
      label: "Sang Pengantin",
    },
  ],
  bank: [
    { name: "Bank BCA", no: "1234 5678 9012", an: "Anis Permata Sari" },
    { name: "Bank Mandiri", no: "9876 5432 1098", an: "Fadli Ahmad Rahman" },
  ],
  dressCode: [
    { color: "#C8BA9E", label: "Sage Linen", for: "Tamu Pria" },
    { color: "#C4A89A", label: "Dusty Blush", for: "Tamu Wanita" },
    { color: "#DDD6CB", label: "Ivory Cream", for: "Keluarga" },
    { color: "#8FA087", label: "Muted Sage", for: "Keluarga" },
  ],
};

/* ─────────────────────────────────────── PALETTE ─── */
const G = {
  gold: "#C09050",
  goldL: "#E0C080",
  goldD: "#8A6030",
  deep: "#1A1511",
  ivory: "#FFFCF7",
  cream: "#FDF6EC",
  muted: "#7A6A58",
  rose: "#D4A8A0",
};

type Rsvp = { nama: string; hadir: string; ucapan: string; ts: number };

/* ─────────────────────────────────────── HOOKS ─── */
function useGuestName() {
  return useMemo(() => {
    if (typeof window === "undefined") return "Tamu Undangan";
    const p = new URLSearchParams(window.location.search).get("nama");
    return p ? decodeURIComponent(p) : "Tamu Undangan";
  }, []);
}

function useCountdown(target: string) {
  const [now, setNow] = useState(Date.now);
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

/* ─────────────────────────────────────── SMALL COMPONENTS ─── */

/** Gold gradient divider line */
function GLine({ className = "w-16 mx-auto" }: { className?: string }) {
  return (
    <div
      className={`h-px ${className}`}
      style={{
        background: `linear-gradient(to right, transparent, ${G.gold}77, transparent)`,
      }}
    />
  );
}

/** Decorative SVG corner ornament */
function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const deg = { tl: 0, tr: 90, br: 180, bl: 270 };
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      style={{ transform: `rotate(${deg[pos]}deg)` }}
    >
      <path
        d="M4 4 Q4 28 28 28"
        stroke={G.gold}
        strokeWidth="0.65"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M4 4 Q28 4 28 28"
        stroke={G.gold}
        strokeWidth="0.65"
        opacity="0.5"
        fill="none"
      />
      <circle cx="4" cy="4" r="2.2" fill={G.gold} opacity="0.45" />
      <circle cx="28" cy="4" r="1.1" fill={G.gold} opacity="0.3" />
      <circle cx="4" cy="28" r="1.1" fill={G.gold} opacity="0.3" />
      <path
        d="M10 4 Q10 12 4 16"
        stroke={G.gold}
        strokeWidth="0.5"
        opacity="0.25"
        fill="none"
      />
      <path
        d="M4 10 Q12 10 16 4"
        stroke={G.gold}
        strokeWidth="0.5"
        opacity="0.25"
        fill="none"
      />
    </svg>
  );
}

/** Section tag label */
function Tag({ label }: { label: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, letterSpacing: "0.15em" }}
      whileInView={{ opacity: 1, letterSpacing: "0.45em" }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="fb text-[9px] font-medium mb-3"
      style={{ color: G.gold, letterSpacing: "0.45em" }}
    >
      {label}
    </motion.p>
  );
}

/** Section wrapper with entrance animation */
function Sec({
  id,
  dark = false,
  children,
  className = "",
}: {
  id?: string;
  dark?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.07 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full ${className}`}
      style={{ background: dark ? G.deep : undefined, color: dark ? G.ivory : G.deep }}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────── LOADER ─── */
function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: G.deep }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.55em" }}
          transition={{ duration: 1.3, delay: 0.1 }}
          className="fb text-[9px] font-medium mb-7"
          style={{ color: G.gold }}
        >
          UNDANGAN PERNIKAHAN
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          <span
            className="fs"
            style={{
              fontSize: "clamp(52px,12vw,88px)",
              color: G.ivory,
              lineHeight: 1,
            }}
          >
            A
          </span>
          <span
            className="fd italic"
            style={{ fontSize: "clamp(24px,5vw,38px)", color: G.gold, lineHeight: 1 }}
          >
            &amp;
          </span>
          <span
            className="fs"
            style={{
              fontSize: "clamp(52px,12vw,88px)",
              color: G.ivory,
              lineHeight: 1,
            }}
          >
            F
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="fd italic mt-4 text-sm"
          style={{ color: `${G.ivory}55` }}
        >
          27 · 04 · 2024
        </motion.p>

        {/* Progress bar */}
        <div
          className="mt-10 w-36 mx-auto h-px rounded"
          style={{ background: `${G.ivory}15` }}
        >
          <motion.div
            initial={{ scaleX: 0, originX: "left" }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.7, duration: 1.6, ease: "easeInOut" }}
            className="h-full rounded"
            style={{
              background: `linear-gradient(to right, ${G.gold}, ${G.goldL})`,
              transformOrigin: "left center",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────── PARTICLES ─── */
function Particles() {
  const pts = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        char: ["✦", "✧", "·", "◦", "❋", "✿"][i % 6],
        left: (i * 6.5) % 100,
        delay: (i * 1.3) % 10,
        dur: 18 + (i % 5) * 3,
        size: 7 + (i % 4) * 2,
        op: 0.1 + (i % 3) * 0.06,
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pts.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-4%", opacity: 0 }}
          animate={{
            y: "106vh",
            x: [0, 14, -14, 6, 0],
            opacity: [0, p.op, p.op, 0],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            fontSize: p.size,
            color: G.gold,
          }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────── SCROLL BAR ─── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{
        scaleX,
        background: `linear-gradient(to right, ${G.goldD}, ${G.gold}, ${G.goldL})`,
      }}
    />
  );
}

/* ─────────────────────────────────────── CURSOR ─── */
function Cursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 200, damping: 22 });
  const sy = useSpring(cy, { stiffness: 200, damping: 22 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("a,button,[role=button]")) setHov(true);
    };
    const onOut = () => setHov(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <motion.div
      className="fixed z-[199] pointer-events-none hidden lg:flex items-center justify-center"
      style={{ x: sx, y: sy, marginLeft: "-20px", marginTop: "-20px" }}
      animate={{
        width: hov ? 40 : 12,
        height: hov ? 40 : 12,
      }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: hov ? "transparent" : G.gold,
          border: hov ? `1.5px solid ${G.gold}` : "none",
          opacity: hov ? 0.65 : 0.85,
          mixBlendMode: "multiply",
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────── MAIN ─── */
function Index() {
  const guest = useGuestName();
  const [loaded, setLoaded] = useState(false);
  const [opened, setOpened] = useState(false);
  const cd = useCountdown(W.date);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicIdx, setMusicIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeNav, setActiveNav] = useState("pembukaan");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [form, setForm] = useState({ nama: "", hadir: "Hadir", ucapan: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  /* Load saved RSVPs */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("rsvps");
      if (raw) setRsvps(JSON.parse(raw));
    } catch {}
  }, []);

  /* Music */
  const tryPlay = () => {
    const a = audioRef.current;
    if (!a) return;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };
  useEffect(() => {
    if (opened) tryPlay();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, musicIdx]);
  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      tryPlay();
    }
  };

  /* Open invitation */
  const openInvitation = () => {
    setOpened(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  /* RSVP submit */
  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.ucapan.trim()) return;
    const next: Rsvp[] = [{ ...form, ts: Date.now() }, ...rsvps];
    setRsvps(next);
    try {
      localStorage.setItem("rsvps", JSON.stringify(next));
    } catch {}
    setForm({ nama: "", hadir: "Hadir", ucapan: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  /* Copy bank number */
  const copyBank = (no: string) => {
    navigator.clipboard?.writeText(no.replace(/\s/g, "")).catch(() => {});
    setCopied(no);
    setTimeout(() => setCopied(null), 2500);
  };

  /* Gallery scroll */
  const scrollGallery = (dir: number) => {
    galleryRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  /* Nav */
  const navItems = [
    { id: "pembukaan", label: "Pasangan" },
    { id: "cerita", label: "Kisah" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "rsvp", label: "RSVP" },
  ];

  const navTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── JSX ── */
  return (
    <>
      {/* ─── Global styles ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body {
          font-family: 'Montserrat', sans-serif;
          background: ${G.ivory}; color: ${G.deep};
          margin: 0; padding: 0; overflow-x: hidden;
        }
        @media (hover: hover) and (pointer: fine) {
          body { cursor: none; }
        }

        /* Font helpers */
        .fs { font-family: 'Great Vibes', cursive; }
        .fd { font-family: 'Cormorant Garamond', Georgia, serif; }
        .fb { font-family: 'Montserrat', sans-serif; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: ${G.gold}55; border-radius: 2px; }
        ::-webkit-scrollbar-track { background: transparent; }

        /* Gold shimmer text */
        @keyframes shimG {
          0%   { background-position: -300% 0 }
          100% { background-position:  300% 0 }
        }
        .gshim {
          background: linear-gradient(90deg,
            ${G.goldD} 0%, ${G.gold} 28%, ${G.goldL} 50%,
            ${G.gold} 72%, ${G.goldD} 100%);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimG 5s linear infinite;
        }

        /* Pulse button */
        @keyframes btnPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${G.gold}66; }
          60%       { box-shadow: 0 0 0 14px ${G.gold}00; }
        }
        .btn-pulse { animation: btnPulse 2.8s ease-out infinite; }

        /* Vinyl spin */
        @keyframes vinylSpin { to { transform: rotate(360deg); } }
        .vspin { animation: vinylSpin 4s linear infinite; }

        /* Grain texture overlay */
        #grain-overlay {
          position: fixed; inset: 0; z-index: 9990;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }

        /* Form inputs */
        input, select, textarea {
          font-family: 'Montserrat', sans-serif;
          border-radius: 0 !important;
          -webkit-appearance: none;
        }
        input:focus, select:focus, textarea:focus {
          outline: none;
          box-shadow: 0 0 0 1.5px ${G.gold}77 !important;
        }
        select option { background: ${G.deep}; color: ${G.ivory}; }

        /* Gallery horizontal track */
        .gal-track {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .gal-track::-webkit-scrollbar { display: none; }
        .gal-item {
          flex: 0 0 260px;
          scroll-snap-align: start;
        }
        @media (min-width: 480px)  { .gal-item { flex: 0 0 300px; } }
        @media (min-width: 768px)  { .gal-item { flex: 0 0 340px; } }
        @media (min-width: 1024px) { .gal-item { flex: 0 0 380px; } }

        /* Story tab underline */
        .story-tab {
          position: relative;
          padding-bottom: 10px;
          transition: color 0.3s;
        }
        .story-tab::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: ${G.gold};
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .story-tab.active::after { transform: scaleX(1); }

        /* Safe area for mobile devices */
        .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0); }
      `}</style>

      {/* Grain overlay */}
      <div id="grain-overlay" aria-hidden="true" />

      {/* Custom cursor (desktop only) */}
      <Cursor />

      {/* ─────── LOADER ─────── */}
      <AnimatePresence>
        {!loaded && (
          <Loader key="loader" onDone={() => setLoaded(true)} />
        )}
      </AnimatePresence>

      {loaded && (
        <div className="w-full min-h-screen relative">

          {/* ─── COVER ─── */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div
                key="cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                transition={{ duration: 1 }}
                className="fixed inset-0 z-50 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* LEFT: full-height wedding photo (desktop only) */}
                <div className="hidden lg:block lg:w-[52%] h-full relative overflow-hidden">
                  <motion.img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=88&fit=crop"
                    alt="Wedding"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.06 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.8, ease: "easeOut" }}
                    loading="eager"
                  />
                  {/* Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to right, rgba(26,21,17,0.08), rgba(26,21,17,0.62))" }}
                  />
                  {/* Names overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
                    <motion.p
                      initial={{ opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 1 }}
                      className="fb text-[9px] font-medium mb-7"
                      style={{ color: `${G.ivory}90`, letterSpacing: "0.55em" }}
                    >
                      THE WEDDING OF
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, duration: 1.1 }}
                      className="fs"
                      style={{ fontSize: "clamp(72px,8.5vw,106px)", color: G.ivory, lineHeight: 1, textShadow: "0 3px 28px rgba(0,0,0,0.38)" }}
                    >
                      {W.bride}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="fd italic text-2xl my-1.5"
                      style={{ color: G.goldL }}
                    >
                      &amp;
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.05, duration: 1.1 }}
                      className="fs"
                      style={{ fontSize: "clamp(72px,8.5vw,106px)", color: G.ivory, lineHeight: 1, textShadow: "0 3px 28px rgba(0,0,0,0.38)" }}
                    >
                      {W.groom}
                    </motion.h1>
                    <GLine className="w-20 my-6" />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                      className="fd italic"
                      style={{ fontSize: "clamp(14px,1.6vw,18px)", color: `${G.ivory}80` }}
                    >
                      {W.dateText}
                    </motion.p>
                  </div>
                  <div className="absolute top-5 left-5 opacity-50"><Corner pos="tl" /></div>
                  <div className="absolute bottom-5 right-5 opacity-50"><Corner pos="br" /></div>
                </div>

                {/* RIGHT: invitation card */}
                <div
                  className="w-full lg:w-[48%] h-full flex items-center justify-center px-5 py-10 sm:px-8 relative overflow-hidden"
                  style={{
                    background: `radial-gradient(ellipse 140% 80% at 50% -10%, ${G.rose}44 0%, transparent 50%), ${G.ivory}`,
                  }}
                >
                  {/* Ambient sparkles */}
                  {[
                    { t: "7%", l: "7%", c: "✦", s: 16 },
                    { t: "10%", l: "88%", c: "✧", s: 12 },
                    { t: "88%", l: "8%", c: "✿", s: 14 },
                    { t: "86%", l: "86%", c: "❋", s: 16 },
                  ].map((sp, i) => (
                    <motion.span
                      key={i}
                      aria-hidden="true"
                      className="absolute pointer-events-none select-none"
                      style={{ top: sp.t, left: sp.l, color: G.gold, fontSize: sp.s, opacity: 0.2 }}
                      animate={{ y: [0, -9, 0], opacity: [0.15, 0.3, 0.15] }}
                      transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}
                    >
                      {sp.c}
                    </motion.span>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.1, delay: 0.15 }}
                    className="relative w-full text-center"
                    style={{ maxWidth: 340 }}
                  >
                    {/* Frame */}
                    <div
                      className="relative px-7 py-9 sm:px-9 sm:py-11"
                      style={{
                        border: `1px solid ${G.gold}44`,
                        background: "rgba(255,252,247,0.72)",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      {/* Corner marks */}
                      {(["tl", "tr", "bl", "br"] as const).map((p, i) => {
                        const pos =
                          p === "tl"
                            ? "top-2 left-2"
                            : p === "tr"
                            ? "top-2 right-2"
                            : p === "bl"
                            ? "bottom-2 left-2"
                            : "bottom-2 right-2";
                        const d =
                          p === "tl"
                            ? "M0 6L0 0L6 0"
                            : p === "tr"
                            ? "M12 6L12 0L6 0"
                            : p === "bl"
                            ? "M0 6L0 12L6 12"
                            : "M12 6L12 12L6 12";
                        return (
                          <div key={i} className={`absolute ${pos} w-[14px] h-[14px]`}>
                            <svg viewBox="0 0 12 12" fill="none" width="14" height="14">
                              <path d={d} stroke={G.gold} strokeWidth="1" opacity="0.5" />
                            </svg>
                          </div>
                        );
                      })}

                      {/* Mobile-only names */}
                      <div className="lg:hidden mb-5">
                        <motion.p
                          initial={{ opacity: 0, letterSpacing: "0.15em" }}
                          animate={{ opacity: 1, letterSpacing: "0.42em" }}
                          transition={{ duration: 1.2, delay: 0.2 }}
                          className="fb text-[9px] font-medium mb-4"
                          style={{ color: G.gold, letterSpacing: "0.42em" }}
                        >
                          THE WEDDING OF
                        </motion.p>
                        <GLine className="w-14 mx-auto mb-5" />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45, duration: 0.9 }}
                        >
                          <span className="fs gshim" style={{ fontSize: "clamp(44px,12vw,62px)", lineHeight: 1, display: "block" }}>
                            {W.bride}
                          </span>
                          <span className="fd italic block my-1" style={{ color: G.muted, fontSize: 18 }}>
                            &amp;
                          </span>
                          <span className="fs gshim" style={{ fontSize: "clamp(44px,12vw,62px)", lineHeight: 1, display: "block" }}>
                            {W.groom}
                          </span>
                        </motion.div>
                        <GLine className="w-14 mx-auto mt-5 mb-4" />
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.85 }}
                          className="fd italic text-sm"
                          style={{ color: G.muted }}
                        >
                          {W.dateText}
                        </motion.p>
                      </div>

                      {/* Desktop-only brief */}
                      <div className="hidden lg:block mb-6">
                        <p
                          className="fb text-[9px] font-medium mb-4"
                          style={{ color: G.gold, letterSpacing: "0.38em" }}
                        >
                          UNDANGAN PERNIKAHAN
                        </p>
                        <GLine className="w-14 mx-auto mb-4" />
                        <p className="fd italic text-sm" style={{ color: G.muted }}>
                          {W.dateText}
                        </p>
                      </div>

                      {/* Guest name */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0 }}
                        className="mb-7"
                      >
                        <p
                          className="fb text-[8px] font-medium mb-1.5"
                          style={{ color: G.gold, letterSpacing: "0.35em" }}
                        >
                          KEPADA YTH.
                        </p>
                        <p className="fb text-xs mb-1" style={{ color: G.muted }}>
                          Bpk/Ibu/Saudara/i
                        </p>
                        <p
                          className="fd font-medium"
                          style={{ fontSize: "clamp(18px,5vw,22px)", color: G.deep }}
                        >
                          {guest}
                        </p>
                        <p className="fb text-xs mt-0.5" style={{ color: G.muted }}>
                          Di Tempat
                        </p>
                      </motion.div>

                      {/* CTA button */}
                      <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.22 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={openInvitation}
                        className="btn-pulse fb inline-flex items-center gap-2 px-7 py-3 text-xs font-medium"
                        style={{
                          background: `linear-gradient(135deg, ${G.goldD}, ${G.gold})`,
                          color: G.ivory,
                          letterSpacing: "0.12em",
                        }}
                      >
                        ✉ BUKA UNDANGAN
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── MAIN CONTENT (after opening) ─── */}
          {opened && (
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <Particles />
              <ScrollBar />

              {/* ── LEFT SIDEBAR (desktop sticky) ── */}
              <aside
                className="hidden lg:flex lg:w-[34%] xl:w-[32%] 2xl:w-[30%] sticky top-0 h-screen flex-col overflow-hidden shrink-0"
                style={{ borderRight: `1px solid ${G.gold}18` }}
              >
                {/* Photo */}
                <div className="flex-1 relative overflow-hidden min-h-0">
                  <img
                    src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=82&fit=crop&crop=top"
                    alt="Anis & Fadli"
                    className="w-full object-cover"
                    style={{ height: "115%", objectPosition: "top center" }}
                    loading="eager"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, rgba(26,21,17,0.05) 0%, rgba(26,21,17,0.68) 100%)" }}
                  />
                  <div className="absolute top-4 left-4 opacity-50"><Corner pos="tl" /></div>
                  <div className="absolute top-4 right-4 opacity-50"><Corner pos="tr" /></div>
                </div>
                {/* Info panel */}
                <div
                  className="px-7 py-5 text-center shrink-0"
                  style={{ background: G.ivory, borderTop: `1px solid ${G.gold}22` }}
                >
                  <p className="fb text-[8px] font-medium mb-1" style={{ color: G.gold, letterSpacing: "0.45em" }}>
                    THE WEDDING OF
                  </p>
                  <div className="flex items-baseline justify-center gap-1.5 mt-1">
                    <span className="fs" style={{ fontSize: 38, color: G.deep, lineHeight: 1 }}>{W.bride}</span>
                    <span className="fd italic text-base" style={{ color: G.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize: 38, color: G.deep, lineHeight: 1 }}>{W.groom}</span>
                  </div>
                  <GLine className="w-14 mx-auto my-3" />
                  <p className="fd italic text-xs mb-4" style={{ color: G.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => navTo(item.id)}
                        className="fb text-[8px] font-medium py-1 transition-colors duration-200"
                        style={{
                          color: activeNav === item.id ? G.gold : G.muted,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT SCROLL AREA ── */}
              <div className="flex-1 min-w-0 overflow-x-hidden" style={{ background: G.ivory }}>

                {/* Mobile sticky nav */}
                <motion.nav
                  initial={{ y: -48, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="sticky top-0 z-40 lg:hidden flex items-center justify-center gap-0 py-2.5 safe-bottom"
                  style={{
                    background: "rgba(255,252,247,0.93)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    borderBottom: `1px solid ${G.gold}1A`,
                  }}
                >
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navTo(item.id)}
                      className="fb relative px-3 py-1.5 text-[8px] font-medium transition-colors duration-200"
                      style={{ color: activeNav === item.id ? G.gold : G.muted, letterSpacing: "0.1em" }}
                    >
                      {item.label.toUpperCase()}
                      {activeNav === item.id && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-2 right-2 h-px"
                          style={{ background: G.gold }}
                          transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        />
                      )}
                    </button>
                  ))}
                </motion.nav>

                {/* ══════ SECTION: PEMBUKAAN ══════ */}
                <Sec id="pembukaan" className="px-5 sm:px-10 py-16 sm:py-24">
                  <div className="absolute top-5 left-5 opacity-20 hidden sm:block"><Corner pos="tl" /></div>
                  <div className="absolute top-5 right-5 opacity-20 hidden sm:block"><Corner pos="tr" /></div>
                  <div className="text-center max-w-lg mx-auto">
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="fd font-light mb-2"
                      style={{ fontSize: "clamp(24px,5vw,36px)", color: G.deep }}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </motion.p>
                    <GLine className="w-20 mx-auto my-7" />
                    <motion.blockquote
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15, duration: 0.9 }}
                      className="fd italic leading-[2] mb-3 px-1"
                      style={{ fontSize: "clamp(13px,2vw,16px)", color: G.muted }}
                    >
                      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
                      pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa
                      tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                    </motion.blockquote>
                    <p className="fb text-[9px] font-medium mb-11" style={{ color: G.gold, letterSpacing: "0.3em" }}>
                      — QS. AR-RUM : 21 —
                    </p>

                    <p className="fb text-xs sm:text-sm leading-relaxed mb-12 px-1" style={{ color: G.muted }}>
                      Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud
                      menyelenggarakan walimatul 'ursy putra-putri kami:
                    </p>

                    {/* Couple portraits */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-6 items-center sm:items-start justify-center">
                      {[
                        {
                          img: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=650&q=85&fit=crop&crop=face",
                          lbl: "THE BRIDE",
                          name: W.bride,
                          full: W.brideFull,
                          role: "Putri dari",
                          parents: W.brideParents,
                          dx: -28,
                        },
                        {
                          img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&q=85&fit=crop&crop=face",
                          lbl: "THE GROOM",
                          name: W.groom,
                          full: W.groomFull,
                          role: "Putra dari",
                          parents: W.groomParents,
                          dx: 28,
                        },
                      ].map((p, i) => (
                        <motion.div
                          key={p.name}
                          initial={{ opacity: 0, x: p.dx }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: i * 0.12 }}
                          className="flex-1 text-center w-full sm:w-auto max-w-[220px] mx-auto sm:max-w-none"
                        >
                          <div
                            className="relative mx-auto mb-4 overflow-hidden"
                            style={{
                              width: "min(160px, 42vw)",
                              aspectRatio: "3/4",
                              border: `1.5px solid ${G.gold}44`,
                              boxShadow: `0 14px 44px rgba(192,144,80,0.12), 0 0 0 7px ${G.ivory}`,
                            }}
                          >
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                            <div
                              className="absolute inset-0"
                              style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(26,21,17,0.3) 100%)" }}
                            />
                          </div>
                          <p className="fb text-[8px] font-medium mb-2" style={{ color: G.gold, letterSpacing: "0.3em" }}>{p.lbl}</p>
                          <h2 className="fs" style={{ fontSize: 46, color: G.deep, lineHeight: 1.1 }}>{p.name}</h2>
                          <p className="fd italic text-sm mt-1.5 mb-0.5" style={{ color: G.muted }}>{p.full}</p>
                          <p className="fb text-[11px]" style={{ color: G.muted }}>{p.role}</p>
                          <p className="fb text-[11px] font-medium" style={{ color: G.deep }}>{p.parents}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Sec>

                <div className="px-8 sm:px-12"><GLine /></div>

                {/* ══════ SECTION: KISAH CINTA ══════ */}
                <Sec id="cerita" dark className="px-5 sm:px-10 py-16 sm:py-24">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Tag label="OUR LOVE STORY" />
                      <h2 className="fd font-light" style={{ fontSize: "clamp(28px,5vw,44px)", color: G.ivory }}>
                        Perjalanan Cinta Kami
                      </h2>
                      <GLine className="w-12 mx-auto mt-5" />
                    </div>

                    {/* Tabs */}
                    <div
                      className="flex gap-5 sm:gap-7 mb-8 overflow-x-auto pb-px"
                      style={{ borderBottom: `1px solid ${G.ivory}12` }}
                    >
                      {W.story.map((s, i) => (
                        <button
                          key={s.year}
                          onClick={() => setStoryIdx(i)}
                          className={`story-tab fb text-[11px] font-medium whitespace-nowrap flex-shrink-0 transition-colors duration-300 ${i === storyIdx ? "active" : ""}`}
                          style={{ color: i === storyIdx ? G.gold : `${G.ivory}50`, letterSpacing: "0.08em" }}
                        >
                          {s.year}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={storyIdx}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.45 }}
                        className="flex flex-col sm:flex-row gap-6 items-start"
                      >
                        <div
                          className="w-full sm:w-44 shrink-0 overflow-hidden"
                          style={{ aspectRatio: "3/4", border: `1px solid ${G.gold}44`, maxWidth: "min(100%, 180px)", margin: "0 auto" }}
                        >
                          <img
                            src={W.story[storyIdx].img}
                            alt={W.story[storyIdx].title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="fb text-[9px] font-medium mb-2" style={{ color: G.gold, letterSpacing: "0.4em" }}>
                            {W.story[storyIdx].year}
                          </p>
                          <h3 className="fd mb-1 font-normal" style={{ fontSize: "clamp(20px,4vw,28px)", color: G.ivory }}>
                            {W.story[storyIdx].title}
                          </h3>
                          <p className="fd italic text-sm mb-4" style={{ color: `${G.ivory}60` }}>
                            {W.story[storyIdx].sub}
                          </p>
                          <GLine className="w-10 mb-5" />
                          <p className="fb text-sm leading-[1.9]" style={{ color: `${G.ivory}80` }}>
                            {W.story[storyIdx].body}
                          </p>
                          {/* Dot navigation */}
                          <div className="flex gap-2 mt-8 flex-wrap">
                            {W.story.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setStoryIdx(i)}
                                aria-label={`Story ${i + 1}`}
                                style={{
                                  width: i === storyIdx ? 24 : 8,
                                  height: 8,
                                  background: i === storyIdx ? G.gold : `${G.ivory}28`,
                                  borderRadius: 4,
                                  transition: "all 0.3s ease",
                                  border: "none",
                                  cursor: "pointer",
                                  padding: 0,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Sec>

                {/* ══════ SECTION: ACARA ══════ */}
                <Sec id="acara" className="px-5 sm:px-10 py-16 sm:py-24">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Tag label="SAVE THE DATE" />
                      <h2 className="fd" style={{ fontSize: "clamp(28px,5vw,42px)", color: G.deep, fontWeight: 400 }}>
                        Detail Acara
                      </h2>
                      <GLine className="w-12 mx-auto mt-5" />
                    </div>

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
                          initial={{ opacity: 0, y: 14 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.07 }}
                          className="text-center py-4 sm:py-5 relative overflow-hidden"
                          style={{
                            background: `linear-gradient(160deg, ${G.ivory}, ${G.cream})`,
                            border: `1px solid ${G.gold}33`,
                          }}
                        >
                          <div
                            className="absolute inset-x-0 top-0 h-[2px]"
                            style={{ background: `linear-gradient(to right, transparent, ${G.gold}66, transparent)` }}
                          />
                          <AnimatePresence mode="popLayout">
                            <motion.span
                              key={x.v}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 10, opacity: 0 }}
                              transition={{ duration: 0.28 }}
                              className="fd font-light block"
                              style={{ fontSize: "clamp(20px,5vw,30px)", color: G.deep }}
                            >
                              {String(x.v).padStart(2, "0")}
                            </motion.span>
                          </AnimatePresence>
                          <span className="fb block mt-0.5" style={{ fontSize: "clamp(7px,1.8vw,9px)", color: G.gold, letterSpacing: "0.15em" }}>
                            {x.l.toUpperCase()}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Event cards */}
                    <div className="space-y-4 mb-10">
                      {[
                        {
                          title: "Akad Nikah",
                          sub: "Ijab Kabul",
                          img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&h=200&q=80&fit=crop",
                          data: W.akad,
                        },
                        {
                          title: "Resepsi Pernikahan",
                          sub: "Walimatul 'Ursy",
                          img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=200&q=80&fit=crop",
                          data: W.resepsi,
                        },
                      ].map((ev, i) => (
                        <motion.div
                          key={ev.title}
                          initial={{ opacity: 0, y: 22 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.12 }}
                          whileHover={{ y: -2 }}
                          className="relative overflow-hidden flex items-stretch"
                          style={{ border: `1px solid ${G.gold}33` }}
                        >
                          {/* Left accent line */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-0.5"
                            style={{ background: `linear-gradient(to bottom, ${G.gold}00, ${G.gold}55, ${G.gold}00)` }}
                          />
                          {/* Thumbnail */}
                          <div className="w-20 sm:w-24 shrink-0 overflow-hidden">
                            <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                          </div>
                          {/* Content */}
                          <div className="flex-1 px-4 sm:px-5 py-4 sm:py-5" style={{ background: G.ivory }}>
                            <p className="fb text-[8px] font-medium mb-0.5" style={{ color: G.gold, letterSpacing: "0.25em" }}>
                              {ev.sub.toUpperCase()}
                            </p>
                            <h3 className="fd mb-2" style={{ fontSize: "clamp(17px,3.5vw,22px)", color: G.deep, fontWeight: 400 }}>
                              {ev.title}
                            </h3>
                            <p className="fb text-xs font-semibold mb-0.5" style={{ color: G.deep }}>{ev.data.time}</p>
                            <p className="fd italic text-sm mb-0.5" style={{ color: G.muted }}>{ev.data.place}</p>
                            <p className="fb text-xs mb-3" style={{ color: G.muted }}>{ev.data.addr}</p>
                            <motion.a
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              href={ev.data.maps}
                              target="_blank"
                              rel="noreferrer"
                              className="fb inline-flex items-center gap-1.5 px-4 py-1.5 text-[9px] font-medium"
                              style={{
                                background: `linear-gradient(135deg, ${G.goldD}, ${G.gold})`,
                                color: G.ivory,
                                letterSpacing: "0.08em",
                              }}
                            >
                              ↗ GOOGLE MAPS
                            </motion.a>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Dress Code */}
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.85 }}
                      className="p-5 sm:p-7"
                      style={{ background: `linear-gradient(155deg, ${G.cream}, ${G.ivory})`, border: `1px solid ${G.gold}33` }}
                    >
                      <div className="text-center mb-5">
                        <Tag label="DRESS CODE" />
                        <h3 className="fd" style={{ fontSize: "clamp(18px,3.5vw,24px)", color: G.deep, fontWeight: 400 }}>
                          Tata Busana
                        </h3>
                        <p className="fb text-xs mt-1.5" style={{ color: G.muted }}>
                          Mohon kenakan warna busana berikut
                        </p>
                      </div>
                      <div className="flex gap-3 sm:gap-5 justify-center flex-wrap">
                        {W.dressCode.map((d, i) => (
                          <motion.div
                            key={d.label}
                            initial={{ opacity: 0, scale: 0.85 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="text-center"
                          >
                            <div
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 shadow-md"
                              style={{ background: d.color, border: `2px solid ${G.gold}22` }}
                            />
                            <p className="fb text-[9px] font-medium" style={{ color: G.deep }}>{d.label}</p>
                            <p className="fb text-[8px]" style={{ color: G.muted }}>{d.for}</p>
                          </motion.div>
                        ))}
                      </div>
                      <p className="fd italic text-center text-xs mt-5" style={{ color: G.muted }}>
                        Hindari warna putih & hitam penuh ✦
                      </p>
                    </motion.div>
                  </div>
                </Sec>

                <div className="px-8 sm:px-12"><GLine /></div>

                {/* ══════ SECTION: GALLERY ══════ */}
                <Sec id="galeri" dark className="py-16 sm:py-24">
                  <div className="text-center mb-8 px-5">
                    <Tag label="OUR GALLERY" />
                    <h2 className="fd font-light" style={{ fontSize: "clamp(28px,5vw,44px)", color: G.ivory }}>
                      Momen Kami
                    </h2>
                    <GLine className="w-12 mx-auto mt-5" />
                    <p className="fd italic text-sm mt-3" style={{ color: `${G.ivory}50` }}>
                      Geser untuk melihat semua foto
                    </p>
                  </div>

                  <div className="relative">
                    {/* Track */}
                    <div ref={galleryRef} className="gal-track px-5 sm:px-10">
                      {W.gallery.map((ph, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: Math.min(i * 0.05, 0.3) }}
                          onClick={() => setLightbox(i)}
                          className="gal-item relative overflow-hidden group"
                          style={{ aspectRatio: "3/4", flexShrink: 0 }}
                        >
                          <img
                            src={ph.src}
                            alt={ph.label}
                            className="w-full h-full object-cover"
                            style={{ transition: "transform 0.65s ease" }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                          {/* Label */}
                          <div
                            className="absolute inset-x-0 bottom-0 py-4 px-3"
                            style={{ background: "linear-gradient(to top, rgba(26,21,17,0.82) 0%, transparent 100%)" }}
                          >
                            <p className="fd italic text-sm" style={{ color: G.ivory }}>{ph.label}</p>
                          </div>
                          {/* Hover view */}
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100"
                            style={{ background: "rgba(192,144,80,0.14)", transition: "opacity 0.3s" }}
                          >
                            <span
                              className="fb text-[9px] font-medium px-4 py-2"
                              style={{ background: "rgba(255,252,247,0.15)", color: G.ivory, border: `1px solid ${G.ivory}30`, backdropFilter: "blur(6px)", letterSpacing: "0.1em" }}
                            >
                              LIHAT
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Arrows (sm+) */}
                    <button
                      onClick={() => scrollGallery(-1)}
                      aria-label="Previous"
                      className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center"
                      style={{ background: "rgba(26,21,17,0.55)", color: G.ivory, backdropFilter: "blur(6px)", fontSize: 20 }}
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => scrollGallery(1)}
                      aria-label="Next"
                      className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 items-center justify-center"
                      style={{ background: "rgba(26,21,17,0.55)", color: G.ivory, backdropFilter: "blur(6px)", fontSize: 20 }}
                    >
                      ›
                    </button>
                  </div>
                </Sec>

                {/* ══════ SECTION: GIFT ══════ */}
                <Sec id="hadiah" className="px-5 sm:px-10 py-16 sm:py-24">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                      <Tag label="AMPLOP DIGITAL" />
                      <h2 className="fd" style={{ fontSize: "clamp(26px,5vw,38px)", color: G.deep, fontWeight: 400 }}>
                        Hadiah &amp; Doa
                      </h2>
                      <GLine className="w-12 mx-auto mt-5" />
                      <p className="fd italic text-sm mt-5 px-2" style={{ color: G.muted }}>
                        Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami.
                        Namun bila ingin memberikan hadiah, berikut informasinya:
                      </p>
                    </div>

                    <div className="space-y-4">
                      {W.bank.map((b) => (
                        <motion.div
                          key={b.no}
                          initial={{ opacity: 0, y: 18 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg, ${G.cream}, ${G.ivory})`, border: `1px solid ${G.gold}44` }}
                        >
                          <div
                            className="absolute inset-x-0 top-0 h-[2px]"
                            style={{ background: `linear-gradient(to right, transparent, ${G.gold}66, transparent)` }}
                          />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
                            <div>
                              <p className="fb text-[9px] font-medium mb-1" style={{ color: G.gold, letterSpacing: "0.25em" }}>
                                {b.name.toUpperCase()}
                              </p>
                              <p
                                className="fd font-medium mb-0.5 break-all"
                                style={{ fontSize: "clamp(20px,5vw,28px)", color: G.deep }}
                              >
                                {b.no}
                              </p>
                              <p className="fb text-xs" style={{ color: G.muted }}>a.n. {b.an}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => copyBank(b.no)}
                              className="fb shrink-0 self-start sm:self-center px-5 py-2.5 text-[9px] font-medium transition-all duration-300"
                              style={{
                                background: copied === b.no ? G.gold : "transparent",
                                color: copied === b.no ? G.ivory : G.gold,
                                border: `1px solid ${G.gold}66`,
                                letterSpacing: "0.1em",
                                minWidth: 80,
                              }}
                            >
                              {copied === b.no ? "✓ COPIED" : "SALIN"}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 }}
                      className="mt-5 p-5 text-center"
                      style={{ border: `1px dashed ${G.gold}44` }}
                    >
                      <p className="fb text-[9px] font-medium mb-1" style={{ color: G.gold, letterSpacing: "0.3em" }}>
                        ATAU KIRIM KE ALAMAT
                      </p>
                      <p className="fd italic text-base" style={{ color: G.deep }}>
                        Jl. Anggrek Raya No. 12, Kebayoran Baru
                      </p>
                      <p className="fb text-xs mt-0.5" style={{ color: G.muted }}>Jakarta Selatan, 12160</p>
                    </motion.div>
                  </div>
                </Sec>

                <div className="px-8 sm:px-12"><GLine /></div>

                {/* ══════ SECTION: RSVP ══════ */}
                <Sec id="rsvp" dark className="px-5 sm:px-10 py-16 sm:py-24">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Tag label="RSVP" />
                      <h2 className="fd font-light" style={{ fontSize: "clamp(28px,5vw,42px)", color: G.ivory }}>
                        Ucapan &amp; Doa
                      </h2>
                      <GLine className="w-12 mx-auto mt-5" />
                      <p className="fd italic text-sm mt-5" style={{ color: `${G.ivory}55` }}>
                        Sampaikan ucapan terbaik Anda untuk kami
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          key="ok"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-center py-14"
                          style={{ border: `1px solid ${G.gold}44` }}
                        >
                          <p className="fs mb-3" style={{ fontSize: 56, color: G.gold, lineHeight: 1 }}>✉</p>
                          <p className="fd text-2xl mb-2" style={{ color: G.ivory }}>Terima Kasih</p>
                          <p className="fb text-xs" style={{ color: `${G.ivory}55` }}>
                            Ucapan Anda telah tersimpan dengan indah
                          </p>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          onSubmit={submitRsvp}
                          className="space-y-3 p-5 sm:p-7 mb-6"
                          style={{ background: "rgba(255,252,247,0.05)", border: `1px solid ${G.gold}33` }}
                        >
                          <div
                            className="h-px w-full mb-5"
                            style={{ background: `linear-gradient(to right, transparent, ${G.gold}55, transparent)` }}
                          />
                          <input
                            required
                            value={form.nama}
                            onChange={(e) => setForm({ ...form, nama: e.target.value })}
                            placeholder="Nama Anda"
                            className="fb w-full px-4 py-3 text-sm"
                            style={{
                              background: "rgba(255,252,247,0.06)",
                              border: `1px solid ${G.gold}33`,
                              color: G.ivory,
                            }}
                          />
                          <select
                            value={form.hadir}
                            onChange={(e) => setForm({ ...form, hadir: e.target.value })}
                            className="fb w-full px-4 py-3 text-sm"
                            style={{
                              background: "rgba(255,252,247,0.06)",
                              border: `1px solid ${G.gold}33`,
                              color: G.ivory,
                            }}
                          >
                            <option value="Hadir">✓ Insya Allah Hadir</option>
                            <option value="Tidak Hadir">✗ Belum Bisa Hadir</option>
                          </select>
                          <textarea
                            required
                            rows={4}
                            value={form.ucapan}
                            onChange={(e) => setForm({ ...form, ucapan: e.target.value })}
                            placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                            className="fb w-full px-4 py-3 text-sm resize-none"
                            style={{
                              background: "rgba(255,252,247,0.06)",
                              border: `1px solid ${G.gold}33`,
                              color: G.ivory,
                            }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.02, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="fb w-full py-3.5 text-xs font-medium mt-1"
                            style={{
                              background: `linear-gradient(135deg, ${G.goldD}, ${G.gold})`,
                              color: G.ivory,
                              letterSpacing: "0.14em",
                            }}
                          >
                            KIRIM UCAPAN
                          </motion.button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* RSVP list */}
                    {rsvps.length > 0 && (
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        <AnimatePresence>
                          {rsvps.map((r) => (
                            <motion.div
                              key={r.ts}
                              layout
                              initial={{ opacity: 0, x: -14 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="relative p-4"
                              style={{ background: "rgba(255,252,247,0.05)", border: `1px solid ${G.gold}22` }}
                            >
                              <div
                                className="absolute left-0 top-0 bottom-0 w-0.5"
                                style={{ background: `linear-gradient(to bottom, ${G.gold}00, ${G.gold}55, ${G.gold}00)` }}
                              />
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                <p className="fd text-base font-medium" style={{ color: G.ivory }}>{r.nama}</p>
                                <span
                                  className="fb text-[8px] font-medium px-2.5 py-0.5 shrink-0"
                                  style={{
                                    background: r.hadir === "Hadir" ? `${G.gold}28` : `${G.rose}22`,
                                    color: r.hadir === "Hadir" ? G.gold : G.rose,
                                    border: `1px solid ${r.hadir === "Hadir" ? G.gold + "44" : G.rose + "44"}`,
                                    letterSpacing: "0.08em",
                                  }}
                                >
                                  {r.hadir === "Hadir" ? "HADIR" : "TIDAK"}
                                </span>
                              </div>
                              <p className="fb text-xs leading-relaxed italic" style={{ color: `${G.ivory}60` }}>
                                {r.ucapan}
                              </p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                    {rsvps.length === 0 && !submitted && (
                      <p className="fb text-center text-[11px] italic py-4" style={{ color: `${G.ivory}40` }}>
                        Belum ada ucapan. Jadilah yang pertama ✦
                      </p>
                    )}
                  </div>
                </Sec>

                {/* ══════ SECTION: PENUTUP ══════ */}
                <Sec id="penutup" className="px-5 sm:px-10 py-20 sm:py-32 relative overflow-hidden">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 120% 55% at 50% -5%, ${G.rose}44, transparent 55%), ${G.ivory}` }}
                  />
                  <div className="absolute bottom-5 left-5 opacity-20 hidden sm:block"><Corner pos="bl" /></div>
                  <div className="absolute bottom-5 right-5 opacity-20 hidden sm:block"><Corner pos="br" /></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <motion.p
                      initial={{ opacity: 0, letterSpacing: "0.15em" }}
                      whileInView={{ opacity: 1, letterSpacing: "0.45em" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="fb text-[9px] font-medium mb-7"
                      style={{ color: G.gold, letterSpacing: "0.45em" }}
                    >
                      TERIMA KASIH
                    </motion.p>

                    <motion.h2
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="fs gshim"
                      style={{ fontSize: "clamp(48px,10vw,76px)", lineHeight: 1.1 }}
                    >
                      Jazakumullah<br />Khairan
                    </motion.h2>

                    <GLine className="w-20 mx-auto my-8" />

                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                      className="fd italic leading-[1.9] mb-8 px-2"
                      style={{ fontSize: "clamp(13px,2.2vw,16px)", color: G.muted }}
                    >
                      Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                      berkenan hadir dan memberikan doa restu kepada kedua mempelai. Semoga Allah
                      Subhanahu Wa Ta'ala membalas setiap kebaikan Anda dengan berlipat ganda.
                    </motion.p>

                    <p className="fd italic text-sm mb-2" style={{ color: G.muted }}>Kami yang berbahagia,</p>
                    <motion.h3
                      animate={{ opacity: [0.85, 1, 0.85] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="fs"
                      style={{ fontSize: "clamp(42px,8vw,58px)", color: G.deep }}
                    >
                      {W.bride} &amp; {W.groom}
                    </motion.h3>

                    <GLine className="w-16 mx-auto my-9" />

                    <motion.a
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      href={`https://wa.me/?text=${encodeURIComponent(
                        `Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}. ${typeof window !== "undefined" ? window.location.href : ""}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="fb inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-medium"
                      style={{ background: "#25D366", color: "#fff", letterSpacing: "0.1em" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      BAGIKAN KE WHATSAPP
                    </motion.a>

                    <p className="fb text-[9px] mt-12 pb-2" style={{ color: G.gold, opacity: 0.4, letterSpacing: "0.3em" }}>
                      ✦ MADE WITH LOVE ✦ 2024 ✦
                    </p>
                  </div>
                </Sec>
              </div>{/* end right scroll area */}
            </div>
          )}

          {/* ─── MUSIC BUTTON ─── */}
          {opened && (
            <>
              <audio
                ref={audioRef}
                src={W.music[musicIdx]}
                loop
                preload="none"
                onError={() => {
                  if (musicIdx < W.music.length - 1) setMusicIdx((i) => i + 1);
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
              />
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMusic}
                aria-label={playing ? "Pause music" : "Play music"}
                className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${G.goldD}, ${G.gold})`,
                  boxShadow: `0 8px 28px rgba(192,144,80,0.45)`,
                }}
              >
                {playing ? (
                  <div style={{ animation: "vinylSpin 4s linear infinite" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4" />
                      <circle cx="12" cy="12" r="3" fill="white" />
                      <path d="M6 12a6 6 0 016-6" stroke="white" strokeWidth="1" fill="none" opacity="0.55" />
                      <path d="M18 12a6 6 0 01-6 6" stroke="white" strokeWidth="1" fill="none" opacity="0.55" />
                    </svg>
                  </div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M19.07 4.93a10 10 0 010 14.14" />
                    <path d="M15.54 8.46a5 5 0 010 7.07" />
                  </svg>
                )}
              </motion.button>
            </>
          )}

          {/* ─── LIGHTBOX ─── */}
          <AnimatePresence>
            {lightbox !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightbox(null)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
                style={{ background: "rgba(26,21,17,0.9)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
              >
                <motion.div
                  initial={{ scale: 0.88, opacity: 0, y: 22 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.88, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{
                    maxWidth: 400,
                    width: "100%",
                    aspectRatio: "3/4",
                    boxShadow: `0 40px 90px rgba(0,0,0,0.55), 0 0 0 1px ${G.gold}33`,
                  }}
                >
                  <img
                    src={W.gallery[lightbox].src}
                    alt={W.gallery[lightbox].label}
                    className="w-full h-full object-cover"
                  />
                  {/* Bottom caption */}
                  <div
                    className="absolute inset-x-0 bottom-0 py-5 px-5"
                    style={{ background: "linear-gradient(to top, rgba(26,21,17,0.88) 0%, transparent 100%)" }}
                  >
                    <p className="fd italic text-lg" style={{ color: G.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[9px] mt-1 font-medium" style={{ color: G.goldL, letterSpacing: "0.12em" }}>
                      {W.bride.toUpperCase()} &amp; {W.groom.toUpperCase()}
                    </p>
                  </div>
                  {/* Corner ornaments */}
                  <div className="absolute top-3 left-3 opacity-40 pointer-events-none"><Corner pos="tl" /></div>
                  <div className="absolute top-3 right-3 opacity-40 pointer-events-none"><Corner pos="tr" /></div>

                  {/* Close — positioned at top-right, above corner ornaments */}
                  <button
                    onClick={() => setLightbox(null)}
                    aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center fb text-sm font-medium"
                    style={{ background: "rgba(255,252,247,0.18)", color: G.ivory, backdropFilter: "blur(6px)" }}
                  >
                    ✕
                  </button>

                  {/* Prev */}
                  {lightbox > 0 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-xl"
                      style={{ background: "rgba(255,252,247,0.15)", color: G.ivory, backdropFilter: "blur(4px)" }}
                    >
                      ‹
                    </button>
                  )}

                  {/* Next */}
                  {lightbox < W.gallery.length - 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-xl"
                      style={{ background: "rgba(255,252,247,0.15)", color: G.ivory, backdropFilter: "blur(4px)" }}
                    >
                      ›
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
