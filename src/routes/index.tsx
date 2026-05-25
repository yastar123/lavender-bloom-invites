import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ═══════════════════ CONSTANTS ═══════════════════ */
const W = {
  bride: "Anis", brideFull: "Anis Permata Sari",
  brideParents: "Bapak Suryanto & Ibu Hartini",
  groom: "Fadli", groomFull: "Fadli Ahmad Rahman",
  groomParents: "Bapak Mahmud & Ibu Siti Aminah",
  dateText: "Sabtu, 27 April 2024",
  date: "2024-04-27T08:00:00+07:00",
  akad:    { time: "08.00 – 10.00 WIB",  place: "Masjid Al-Hikmah",    addr: "Jl. Raya Kebayoran Lama No.32, Jakarta Selatan", maps: "https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta" },
  resepsi: { time: "11.00 – 14.00 WIB",  place: "The Sultan Ballroom", addr: "Jl. Gatot Subroto, Senayan, Jakarta Pusat",     maps: "https://maps.google.com/?q=Sultan+Hotel+Jakarta" },
  music: ["https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3","https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"],
  story: [
    { year: "2019", title: "Pertemuan Pertama", sub: "Sebuah senyum yang mengubah segalanya", body: "Kami bertemu pertama kali di acara orientasi kampus. Satu tatapan yang tak sengaja, menjadi awal dari cerita yang paling indah.", img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&q=80&fit=crop" },
    { year: "2021", title: "Jatuh Cinta",        sub: "Dua hati yang akhirnya bicara",         body: "Dua tahun persahabatan yang dalam, perlahan berubah menjadi cinta yang tulus. Kami tahu, ini adalah sesuatu yang sangat spesial.",  img: "https://images.unsplash.com/photo-1529635696947-b3f8c0d35b3c?w=600&h=800&q=80&fit=crop" },
    { year: "2023", title: "Lamaran",            sub: "Momen yang paling dinantikan",          body: "Di tepi pantai Bali, saat matahari tenggelam, Fadli berlutut dan bertanya, 'Maukah kamu menjadi teman hidupku?' Anis menjawab dengan air mata bahagia.",  img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&q=80&fit=crop" },
    { year: "2024", title: "Hari Bahagia",       sub: "Selamanya dimulai hari ini",            body: "27 April 2024 — hari yang selalu kami impikan. Bersama keluarga dan sahabat tercinta, kami resmi menyatukan dua jiwa dalam ikatan suci.", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&q=80&fit=crop" },
  ],
  gallery: [
    { src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=1000&q=85&fit=crop", label: "Momen Pertama" },
    { src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&h=1000&q=85&fit=crop", label: "Dalam Kebun Bunga" },
    { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&h=1000&q=85&fit=crop", label: "Cincin Kami" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456503681?w=800&h=1000&q=85&fit=crop", label: "Tarian Pertama" },
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&h=1000&q=85&fit=crop", label: "Dekorasi Akad" },
    { src: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=800&h=1000&q=85&fit=crop", label: "Bunga Cinta" },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=1000&q=85&fit=crop", label: "Momen Bersama" },
    { src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=1000&q=85&fit=crop", label: "Sang Pengantin" },
  ],
  bank: [
    { name: "Bank BCA", no: "1234 5678 9012", an: "Anis Permata Sari", logo: "🏦" },
    { name: "Bank Mandiri", no: "9876 5432 1098", an: "Fadli Ahmad Rahman", logo: "🏦" },
  ],
  dressCode: [
    { color: "#D4C5B5", name: "Sage Linen", desc: "Tamu Pria" },
    { color: "#C9B5A8", name: "Dusty Blush", desc: "Tamu Wanita" },
    { color: "#E8E0D5", name: "Ivory Cream", desc: "Keluarga" },
    { color: "#9FAF9A", name: "Muted Sage", desc: "Keluarga" },
  ],
};

const C = {
  gold: "#C09050", goldLight: "#E0C080", goldDark: "#8A6030",
  deep: "#1A1511", ivory: "#FFFCF7", cream: "#FDF6EC",
  muted: "#7A6A58", warm: "#8A7060", rose: "#D4A8A0",
};

type Rsvp = { nama: string; hadir: string; ucapan: string; ts: number };

/* ═══════════════════ HOOKS ═══════════════════ */
function useGuestName() {
  return useMemo(() => {
    if (typeof window === "undefined") return "Tamu Undangan";
    const p = new URLSearchParams(window.location.search).get("nama");
    return p ? decodeURIComponent(p) : "Tamu Undangan";
  }, []);
}

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return { d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) };
}

/* ═══════════════════ SVG COMPONENTS ═══════════════════ */
function Corner({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) {
  const t: Record<string, string> = { tl:"rotate(0)", tr:"rotate(90deg) scaleY(-1)", bl:"rotate(-90deg) scaleX(-1)", br:"rotate(180deg)" };
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ transform: t[pos] }}>
      <path d="M4 4 Q4 32, 32 32" stroke={C.gold} strokeWidth="0.6" opacity="0.55" fill="none"/>
      <path d="M4 4 Q32 4, 32 32" stroke={C.gold} strokeWidth="0.6" opacity="0.55" fill="none"/>
      <circle cx="4" cy="4" r="2.5" fill={C.gold} opacity="0.5"/>
      <circle cx="32" cy="4" r="1.2" fill={C.gold} opacity="0.35"/>
      <circle cx="4" cy="32" r="1.2" fill={C.gold} opacity="0.35"/>
      <path d="M12 4 Q12 14, 4 18" stroke={C.gold} strokeWidth="0.5" opacity="0.3" fill="none"/>
      <path d="M4 12 Q14 12, 18 4" stroke={C.gold} strokeWidth="0.5" opacity="0.3" fill="none"/>
    </svg>
  );
}

function GoldLine({ className = "" }: { className?: string }) {
  return <div className={`h-px ${className}`} style={{ background: `linear-gradient(to right, transparent, ${C.gold}66, transparent)` }} />;
}

/* ═══════════════════ LOADER ═══════════════════ */
function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2400); return () => clearTimeout(t); }, [onDone]);
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: C.deep }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <motion.p
          initial={{ letterSpacing: "0.3em", opacity: 0 }}
          animate={{ letterSpacing: "0.6em", opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-[9px] font-medium mb-6"
          style={{ color: C.gold, fontFamily: "Montserrat,sans-serif" }}
        >
          UNDANGAN PERNIKAHAN
        </motion.p>
        <motion.h1
          className="font-script"
          style={{ fontSize: "clamp(64px,12vw,96px)", lineHeight: 1 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <span style={{ color: C.ivory }}>A</span>
          <span style={{ color: C.gold, fontFamily: "Cormorant Garamond, serif", fontSize: "0.6em", verticalAlign: "middle", margin: "0 8px" }}>&amp;</span>
          <span style={{ color: C.ivory }}>F</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="font-display italic text-sm mt-4"
          style={{ color: `${C.ivory}66`, fontFamily: "Cormorant Garamond, serif" }}
        >
          27 · 04 · 2024
        </motion.p>
        {/* Loading bar */}
        <div className="mt-10 w-40 mx-auto h-px" style={{ background: `${C.ivory}18` }}>
          <motion.div
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1.4, ease: "easeInOut" }}
            className="h-full"
            style={{ background: `linear-gradient(to right, ${C.gold}, ${C.goldLight})` }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════ PARTICLES ═══════════════════ */
function Particles() {
  const pts = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
    id: i, char: ["✦","✧","·","◦","∘","❋","✿"][i % 7],
    left: Math.random() * 100, delay: Math.random() * 10,
    dur: 18 + Math.random() * 14, size: 7 + Math.random() * 9, op: 0.08 + Math.random() * 0.18,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {pts.map(p => (
        <motion.span key={p.id}
          initial={{ y: "-5%", opacity: 0 }}
          animate={{ y: "108vh", x: [0, 18, -18, 8, 0], rotate: [0, 180, 360], opacity: [0, p.op, p.op, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: `${p.left}%`, fontSize: p.size, color: C.gold }}
        >{p.char}</motion.span>
      ))}
    </div>
  );
}

/* ═══════════════════ SCROLL PROGRESS ═══════════════════ */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left"
      style={{ scaleX, background: `linear-gradient(to right, ${C.goldDark}, ${C.gold}, ${C.goldLight})` }}
    />
  );
}

/* ═══════════════════ CURSOR (desktop) ═══════════════════ */
function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 180, damping: 20 });
  const sy = useSpring(y, { stiffness: 180, damping: 20 });
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a,button")) setHov(true); };
    const out  = () => setHov(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); window.removeEventListener("mouseout", out); };
  }, []);

  return (
    <motion.div
      className="fixed z-[99] pointer-events-none hidden lg:block"
      style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{ width: hov ? 40 : 12, height: hov ? 40 : 12, opacity: hov ? 0.6 : 0.8 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="w-full h-full rounded-full" style={{ background: hov ? "transparent" : C.gold, border: hov ? `1.5px solid ${C.gold}` : "none", mixBlendMode: "multiply" }} />
    </motion.div>
  );
}

/* ═══════════════════ SECTION WRAPPER ═══════════════════ */
function Sec({ id, dark = false, children, className = "" }: { id?: string; dark?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full ${className}`}
      style={{ background: dark ? C.deep : undefined, color: dark ? C.ivory : C.deep }}
    >
      {children}
    </motion.section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, letterSpacing: "0.2em" }}
      whileInView={{ opacity: 1, letterSpacing: "0.45em" }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className="text-[9px] sm:text-[10px] font-medium tracking-[0.45em] mb-3"
      style={{ color: C.gold, fontFamily: "Montserrat,sans-serif" }}
    >
      {children}
    </motion.p>
  );
}

/* ═══════════════════ MAIN INDEX ═══════════════════ */
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

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { const r = localStorage.getItem("rsvps"); if (r) setRsvps(JSON.parse(r)); } catch {}
  }, []);

  const tryPlay = () => { const a = audioRef.current; if (!a) return; a.play().then(() => setPlaying(true)).catch(() => {}); };
  useEffect(() => { if (opened) tryPlay(); }, [opened, musicIdx]);
  const toggleMusic = () => { const a = audioRef.current; if (!a) return; if (playing) { a.pause(); setPlaying(false); } else tryPlay(); };
  const onAudioError = () => { if (musicIdx < W.music.length - 1) setMusicIdx(i => i + 1); };

  const openInvitation = () => {
    setOpened(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }), 50);
  };

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.ucapan.trim()) return;
    const next = [{ ...form, ts: Date.now() }, ...rsvps];
    setRsvps(next);
    localStorage.setItem("rsvps", JSON.stringify(next));
    setForm({ nama: "", hadir: "Hadir", ucapan: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const copyBank = (no: string) => {
    navigator.clipboard.writeText(no.replace(/\s/g, ""));
    setCopied(no);
    setTimeout(() => setCopied(null), 2500);
  };

  const scrollGallery = (dir: number) => {
    if (galleryRef.current) galleryRef.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  const navItems = [
    { id: "pembukaan", label: "Pasangan" },
    { id: "cerita", label: "Kisah" },
    { id: "acara", label: "Acara" },
    { id: "galeri", label: "Galeri" },
    { id: "rsvp", label: "RSVP" },
  ];

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; background: ${C.ivory}; color: ${C.deep}; cursor: none; }
        @media (max-width: 1023px) { body { cursor: auto; } }
        .fs  { font-family: 'Great Vibes', cursive; }
        .fd  { font-family: 'Cormorant Garamond', serif; }
        .fb  { font-family: 'Montserrat', sans-serif; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.gold}55; border-radius: 2px; }

        @keyframes shimmerG {
          0% { background-position: -300% 0 } 100% { background-position: 300% 0 }
        }
        .gshim {
          background: linear-gradient(90deg, ${C.goldDark} 0%, ${C.gold} 30%, ${C.goldLight} 55%, ${C.gold} 75%, ${C.goldDark} 100%);
          background-size: 300% auto;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: shimmerG 5s linear infinite;
        }
        @keyframes pulse2 {
          0%,100%{ box-shadow: 0 0 0 0 ${C.gold}55 }
          50%    { box-shadow: 0 0 0 16px ${C.gold}00 }
        }
        .pulse { animation: pulse2 2.8s ease-out infinite; }
        @keyframes vSpin { to { transform: rotate(360deg); } }
        .vspin { animation: vSpin 4s linear infinite; }

        /* Grain overlay */
        .grain::after {
          content: '';
          position: fixed; inset: 0; z-index: 9998; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.028; mix-blend-mode: overlay;
        }

        input:focus, select:focus, textarea:focus { outline: none; box-shadow: 0 0 0 1.5px ${C.gold}88; }

        .gallery-track { display:flex; gap:12px; overflow-x:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .gallery-track::-webkit-scrollbar { display:none; }
        .gallery-item { flex:0 0 280px; scroll-snap-align:start; }
        @media(min-width:640px) { .gallery-item { flex:0 0 340px; } }
        @media(min-width:1024px) { .gallery-item { flex:0 0 400px; } }

        .story-tab.active { color: ${C.gold}; }
        .story-tab.active::after { transform: scaleX(1); }
        .story-tab::after { content:''; display:block; height:1px; background:${C.gold}; transform:scaleX(0); transform-origin:left; transition:transform 0.4s; }
      `}</style>

      <div className="grain" />
      <CustomCursor />

      {/* ════════ LOADER ════════ */}
      <AnimatePresence>
        {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <div className="min-h-screen w-full relative">

          {/* ════════ SCROLL PROGRESS ════════ */}
          {opened && <ScrollProgress />}

          {/* ════════ COVER ════════ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div
                key="cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
                transition={{ duration: 1.1 }}
                className="fixed inset-0 z-40 flex flex-col lg:flex-row"
              >
                {/* LEFT — hero photo (desktop) */}
                <div className="hidden lg:block lg:w-[52%] h-full relative overflow-hidden">
                  <motion.img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=90&fit=crop"
                    alt="hero"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,21,17,0.1) 0%, rgba(26,21,17,0.65) 100%)" }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <motion.p initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }}
                      className="fb text-[9px] tracking-[0.55em] font-medium mb-8" style={{ color: `${C.ivory}99` }}>
                      THE WEDDING OF
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1.2 }}
                      className="fs" style={{ fontSize: "clamp(72px, 9vw, 108px)", color: C.ivory, lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}>
                      {W.bride}
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
                      className="fd italic text-2xl my-2" style={{ color: C.goldLight }}>&amp;</motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1.2 }}
                      className="fs" style={{ fontSize: "clamp(72px, 9vw, 108px)", color: C.ivory, lineHeight: 1, textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}>
                      {W.groom}
                    </motion.h1>
                    <div className="h-px w-20 my-7 mx-auto" style={{ background: `linear-gradient(to right, transparent, ${C.goldLight}, transparent)` }} />
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
                      className="fd italic text-lg" style={{ color: `${C.ivory}88` }}>{W.dateText}</motion.p>
                  </div>
                  <div className="absolute top-5 left-5 opacity-55"><Corner pos="tl" /></div>
                  <div className="absolute bottom-5 right-5 opacity-55"><Corner pos="br" /></div>
                </div>

                {/* RIGHT — card */}
                <div className="w-full lg:w-[48%] h-full flex items-center justify-center px-6 py-10 relative overflow-hidden"
                  style={{ background: `radial-gradient(ellipse 140% 80% at 50% -10%, ${C.rose}55 0%, transparent 55%), ${C.ivory}` }}>
                  {/* Ambient dots */}
                  {[[8,8,"✦",18,0],[12,88,"✧",14,0.6],[88,10,"❋",12,0.3],[85,85,"✿",16,0.9]].map(([t,l,c,s,d],i) => (
                    <motion.div key={i} className="absolute pointer-events-none fb" style={{ top:`${t}%`, left:`${l}%`, color:C.gold, fontSize:s as number, opacity:0.22 }}
                      animate={{ y:[0,-10,0], opacity:[0.15,0.3,0.15] }} transition={{ duration:4+i, repeat:Infinity, delay:d as number }}>{c}</motion.div>
                  ))}

                  <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, delay: 0.2 }}
                    className="relative w-full max-w-[340px] text-center">
                    {/* Gold frame */}
                    <div className="relative px-8 py-10 sm:py-12" style={{ border: `1px solid ${C.gold}44`, background: "rgba(255,252,247,0.7)", backdropFilter: "blur(12px)" }}>
                      {/* Corner marks */}
                      {[["top-2 left-2","tl"],["top-2 right-2","tr"],["bottom-2 left-2","bl"],["bottom-2 right-2","br"]].map(([p, pos], i) => (
                        <div key={i} className={`absolute ${p} w-4 h-4`}><svg viewBox="0 0 14 14" fill="none"><path d={i===0?"M0 7L0 0L7 0":i===1?"M14 7L14 0L7 0":i===2?"M0 7L0 14L7 14":"M14 7L14 14L7 14"} stroke={C.gold} strokeWidth="1" opacity="0.55"/></svg></div>
                      ))}

                      {/* Mobile names */}
                      <div className="lg:hidden">
                        <motion.p initial={{ opacity:0, letterSpacing:"0.2em" }} animate={{ opacity:1, letterSpacing:"0.45em" }} transition={{ duration:1.2, delay:0.2 }}
                          className="fb text-[9px] tracking-[0.45em] font-medium mb-4" style={{ color:C.gold }}>THE WEDDING OF</motion.p>
                        <div className="h-px w-16 mx-auto mb-5" style={{ background:`linear-gradient(to right,transparent,${C.gold},transparent)` }}/>
                        {["bride","groom"].map((k,i) => (
                          <motion.div key={k} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4+i*0.2, duration:0.8 }}>
                            <h1 className="fs gshim" style={{ fontSize:"clamp(44px,13vw,60px)", lineHeight:1 }}>{k==="bride"?W.bride:W.groom}</h1>
                            {i===0 && <p className="fd italic my-1" style={{ color:C.muted, fontSize:18 }}>&amp;</p>}
                          </motion.div>
                        ))}
                        <div className="h-px w-16 mx-auto my-5" style={{ background:`linear-gradient(to right,transparent,${C.gold},transparent)` }}/>
                        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
                          className="fd italic text-sm mb-6" style={{ color:C.muted }}>{W.dateText}</motion.p>
                      </div>

                      {/* Desktop date only */}
                      <div className="hidden lg:block mb-6">
                        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }} className="fb text-[9px] tracking-[0.4em] font-medium mb-2" style={{ color:C.gold }}>UNDANGAN PERNIKAHAN</motion.p>
                        <div className="h-px w-16 mx-auto my-4" style={{ background:`linear-gradient(to right,transparent,${C.gold}66,transparent)` }}/>
                        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }} className="fd italic text-base" style={{ color:C.muted }}>{W.dateText}</motion.p>
                      </div>

                      {/* Guest */}
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.05 }} className="mb-7">
                        <p className="fb text-[8px] tracking-[0.35em] mb-1.5 font-medium" style={{ color:C.gold }}>KEPADA YTH.</p>
                        <p className="fb text-xs mb-1.5" style={{ color:C.muted }}>Bpk/Ibu/Saudara/i</p>
                        <p className="fd text-xl sm:text-2xl font-medium" style={{ color:C.deep }}>{guest}</p>
                        <p className="fb text-xs mt-1" style={{ color:C.muted }}>Di Tempat</p>
                      </motion.div>

                      <motion.button
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.25 }}
                        whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}
                        onClick={openInvitation}
                        className="pulse fb inline-flex items-center gap-2 px-7 py-3 text-xs font-medium"
                        style={{ background:`linear-gradient(135deg,${C.goldDark},${C.gold})`, color:C.ivory, letterSpacing:"0.12em" }}
                      >
                        ✉ BUKA UNDANGAN
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ════════ MAIN ════════ */}
          {opened && (
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <Particles />

              {/* ── DESKTOP LEFT SIDEBAR ── */}
              <aside className="hidden lg:flex lg:w-[34%] xl:w-[32%] h-screen sticky top-0 flex-col overflow-hidden"
                style={{ borderRight:`1px solid ${C.gold}18` }}>
                <div className="flex-1 relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=85&fit=crop&crop=top" alt="couple" className="w-full h-[115%] object-cover" />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, rgba(26,21,17,0.08) 0%, rgba(26,21,17,0.72) 100%)" }}/>
                  <div className="absolute top-4 left-4 opacity-55"><Corner pos="tl" /></div>
                  <div className="absolute top-4 right-4 opacity-55"><Corner pos="tr" /></div>
                </div>
                <div className="px-8 py-6 text-center" style={{ background:C.ivory, borderTop:`1px solid ${C.gold}22` }}>
                  <p className="fb text-[8px] tracking-[0.45em] font-medium mb-1" style={{ color:C.gold }}>THE WEDDING OF</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="fs" style={{ fontSize:40, color:C.deep, lineHeight:1 }}>{W.bride}</span>
                    <span className="fd italic text-base" style={{ color:C.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize:40, color:C.deep, lineHeight:1 }}>{W.groom}</span>
                  </div>
                  <GoldLine className="w-16 mx-auto my-3" />
                  <p className="fd italic text-xs mb-5" style={{ color:C.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-0.5">
                    {navItems.map(item => (
                      <button key={item.id} onClick={() => scrollTo(item.id)}
                        className="fb text-[8px] tracking-widest font-medium py-1 transition-colors duration-200"
                        style={{ color: activeNav===item.id ? C.gold : C.muted, letterSpacing:"0.12em" }}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── SCROLLABLE RIGHT PANEL ── */}
              <div className="flex-1 relative overflow-x-hidden">

                {/* Mobile nav */}
                <motion.nav initial={{ y:-50, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.4 }}
                  className="sticky top-0 z-30 lg:hidden flex items-center justify-center gap-1 py-3"
                  style={{ background:"rgba(255,252,247,0.92)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.gold}18` }}>
                  {navItems.map(item => (
                    <button key={item.id} onClick={() => scrollTo(item.id)}
                      className="fb relative px-3 py-1.5 text-[8px] font-medium transition-colors duration-200"
                      style={{ color:activeNav===item.id ? C.gold : C.muted, letterSpacing:"0.1em" }}>
                      {item.label.toUpperCase()}
                      {activeNav===item.id && <motion.div layoutId="nav-m" className="absolute bottom-0 left-2 right-2 h-px" style={{ background:C.gold }} />}
                    </button>
                  ))}
                </motion.nav>

                {/* ═══ OPENING ═══ */}
                <Sec id="pembukaan" className="px-6 sm:px-12 py-20 sm:py-28">
                  <div className="absolute top-6 left-6 opacity-25"><Corner pos="tl" /></div>
                  <div className="absolute top-6 right-6 opacity-25"><Corner pos="tr" /></div>
                  <div className="text-center max-w-lg mx-auto">
                    <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:1 }}
                      className="fd font-light mb-2" style={{ fontSize:"clamp(28px,5vw,40px)", color:C.deep }}>
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </motion.p>
                    <GoldLine className="w-20 mx-auto my-8" />
                    <motion.blockquote initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2, duration:1 }}
                      className="fd italic leading-[2] mb-3 px-2" style={{ fontSize:"clamp(14px,2vw,17px)", color:C.muted }}>
                      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                    </motion.blockquote>
                    <p className="fb text-[10px] tracking-widest font-medium mb-12" style={{ color:C.gold }}>— QS. AR-RUM : 21 —</p>
                    <p className="fb text-xs sm:text-sm leading-relaxed mb-14 px-2" style={{ color:C.muted }}>
                      Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan walimatul 'ursy putra-putri kami:
                    </p>

                    {/* Couple portraits */}
                    <div className="flex flex-col sm:flex-row gap-10 sm:gap-6 items-center justify-center">
                      {[
                        { img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=650&q=85&fit=crop&crop=face", lbl:"THE BRIDE", script:W.bride, full:W.brideFull, role:"Putri dari", parents:W.brideParents, dir:-1 },
                        { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=650&q=85&fit=crop&crop=face", lbl:"THE GROOM", script:W.groom, full:W.groomFull, role:"Putra dari", parents:W.groomParents, dir:1 },
                      ].map((p, i) => (
                        <motion.div key={p.script} initial={{ opacity:0, x:30*p.dir }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:1, delay:i*0.15 }}
                          className="flex-1 text-center">
                          <div className="relative w-40 sm:w-44 mx-auto mb-5 overflow-hidden"
                            style={{ aspectRatio:"3/4", border:`1.5px solid ${C.gold}44`, boxShadow:`0 16px 50px rgba(192,144,80,0.13), 0 0 0 8px ${C.ivory}` }}>
                            <img src={p.img} alt={p.script} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 55%, rgba(26,21,17,0.35) 100%)" }}/>
                          </div>
                          <p className="fb text-[8px] tracking-[0.35em] mb-2 font-medium" style={{ color:C.gold }}>{p.lbl}</p>
                          <h2 className="fs" style={{ fontSize:50, color:C.deep, lineHeight:1.1 }}>{p.script}</h2>
                          <p className="fd italic text-sm mt-2 mb-1" style={{ color:C.muted }}>{p.full}</p>
                          <p className="fb text-[11px]" style={{ color:C.muted }}>{p.role}</p>
                          <p className="fb text-[11px] font-medium" style={{ color:C.deep }}>{p.parents}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Sec>

                {/* ═══ LOVE STORY ═══ */}
                <Sec id="cerita" dark className="px-6 sm:px-12 py-20 sm:py-28">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-14">
                      <Tag>OUR LOVE STORY</Tag>
                      <h2 className="fd" style={{ fontSize:"clamp(32px,5vw,48px)", color:C.ivory, fontWeight:300 }}>Perjalanan Cinta Kami</h2>
                      <GoldLine className="w-12 mx-auto mt-5" />
                    </div>

                    {/* Story tabs */}
                    <div className="flex gap-6 mb-10 overflow-x-auto pb-1" style={{ borderBottom:`1px solid ${C.ivory}15` }}>
                      {W.story.map((s, i) => (
                        <button key={s.year} onClick={() => setStoryIdx(i)}
                          className={`story-tab fb text-xs font-medium pb-3 whitespace-nowrap flex-shrink-0 transition-colors duration-300 ${i===storyIdx?"active":""}`}
                          style={{ color:i===storyIdx?C.gold:`${C.ivory}55`, letterSpacing:"0.08em" }}>
                          {s.year}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div key={storyIdx}
                        initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}
                        transition={{ duration:0.5 }}
                        className="flex flex-col sm:flex-row gap-7 items-start"
                      >
                        <div className="w-full sm:w-48 flex-shrink-0 aspect-[3/4] overflow-hidden"
                          style={{ border:`1px solid ${C.gold}44` }}>
                          <img src={W.story[storyIdx].img} alt={W.story[storyIdx].title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="fb text-[9px] tracking-[0.4em] mb-3 font-medium" style={{ color:C.gold }}>{W.story[storyIdx].year}</p>
                          <h3 className="fd mb-1" style={{ fontSize:"clamp(22px,4vw,30px)", color:C.ivory, fontWeight:400 }}>{W.story[storyIdx].title}</h3>
                          <p className="fd italic text-sm mb-5" style={{ color:`${C.ivory}66` }}>{W.story[storyIdx].sub}</p>
                          <GoldLine className="w-10 mb-5" />
                          <p className="fb text-sm leading-[1.9]" style={{ color:`${C.ivory}88` }}>{W.story[storyIdx].body}</p>
                          {/* Timeline dots */}
                          <div className="flex gap-2 mt-8">
                            {W.story.map((_, i) => (
                              <button key={i} onClick={() => setStoryIdx(i)}
                                className="transition-all duration-300"
                                style={{ width:i===storyIdx?24:8, height:8, background:i===storyIdx?C.gold:`${C.ivory}30`, borderRadius:4 }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Sec>

                {/* ═══ ACARA ═══ */}
                <Sec id="acara" className="px-6 sm:px-12 py-20 sm:py-28">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Tag>SAVE THE DATE</Tag>
                      <h2 className="fd" style={{ fontSize:"clamp(30px,5vw,44px)", color:C.deep, fontWeight:400 }}>Detail Acara</h2>
                      <GoldLine className="w-12 mx-auto mt-5" />
                    </div>

                    {/* Countdown */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-12">
                      {[{v:cd.d,l:"Hari"},{v:cd.h,l:"Jam"},{v:cd.m,l:"Menit"},{v:cd.s,l:"Detik"}].map((x,i) => (
                        <motion.div key={x.l} initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                          className="text-center py-5 relative overflow-hidden"
                          style={{ background:`linear-gradient(160deg,${C.ivory},${C.cream})`, border:`1px solid ${C.gold}33` }}>
                          <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background:`linear-gradient(to right,transparent,${C.gold}66,transparent)` }}/>
                          <AnimatePresence mode="popLayout">
                            <motion.div key={x.v} initial={{ y:-12, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:12, opacity:0 }} transition={{ duration:0.3 }}
                              className="fd font-light" style={{ fontSize:"clamp(22px,5vw,32px)", color:C.deep }}>
                              {String(x.v).padStart(2,"0")}
                            </motion.div>
                          </AnimatePresence>
                          <div className="fb text-[7px] sm:text-[8px] tracking-widest mt-1 font-medium" style={{ color:C.gold }}>{x.l.toUpperCase()}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Event cards */}
                    <div className="space-y-4 mb-12">
                      {[
                        { title:"Akad Nikah", sub:"Ijab Kabul", img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=160&h=160&q=80&fit=crop", data:W.akad },
                        { title:"Resepsi Pernikahan", sub:"Walimatul 'Ursy", img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=160&h=160&q=80&fit=crop", data:W.resepsi },
                      ].map((c,i) => (
                        <motion.div key={c.title} initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8, delay:i*0.15 }}
                          whileHover={{ y:-3 }} className="relative overflow-hidden flex items-stretch"
                          style={{ border:`1px solid ${C.gold}33`, boxShadow:`0 8px 30px rgba(192,144,80,0.07)` }}>
                          <div className="w-20 sm:w-24 flex-shrink-0 overflow-hidden">
                            <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 px-5 py-5" style={{ background:C.ivory }}>
                            <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background:`linear-gradient(to bottom,${C.gold}00,${C.gold}55,${C.gold}00)` }}/>
                            <p className="fb text-[8px] tracking-[0.28em] font-medium mb-0.5" style={{ color:C.gold }}>{c.sub.toUpperCase()}</p>
                            <h3 className="fd mb-2" style={{ fontSize:"clamp(18px,3.5vw,24px)", color:C.deep }}>{c.title}</h3>
                            <p className="fb text-xs font-semibold mb-0.5" style={{ color:C.deep }}>{c.data.time}</p>
                            <p className="fd italic text-sm mb-0.5" style={{ color:C.muted }}>{c.data.place}</p>
                            <p className="fb text-xs mb-3" style={{ color:C.muted }}>{c.data.addr}</p>
                            <motion.a whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                              href={c.data.maps} target="_blank" rel="noreferrer"
                              className="fb inline-flex items-center gap-1.5 px-4 py-1.5 text-[9px] font-medium"
                              style={{ background:`linear-gradient(135deg,${C.goldDark},${C.gold})`, color:C.ivory, letterSpacing:"0.08em" }}>
                              ↗ GOOGLE MAPS
                            </motion.a>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Dress Code */}
                    <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.9 }}
                      className="p-6 sm:p-8" style={{ background:`linear-gradient(160deg,${C.cream},${C.ivory})`, border:`1px solid ${C.gold}33` }}>
                      <div className="text-center mb-6">
                        <Tag>DRESS CODE</Tag>
                        <h3 className="fd" style={{ fontSize:"clamp(20px,3.5vw,26px)", color:C.deep }}>Tata Busana</h3>
                        <p className="fb text-xs mt-2" style={{ color:C.muted }}>Mohon kenakan warna busana berikut</p>
                      </div>
                      <div className="flex gap-3 justify-center flex-wrap mb-4">
                        {W.dressCode.map((d,i) => (
                          <motion.div key={d.name} initial={{ opacity:0, scale:0.85 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.08 }}
                            className="text-center">
                            <div className="w-14 h-14 rounded-full mx-auto mb-2 shadow-md" style={{ background:d.color, border:`2px solid ${C.gold}22` }}/>
                            <p className="fb text-[9px] font-medium" style={{ color:C.deep }}>{d.name}</p>
                            <p className="fb text-[8px]" style={{ color:C.muted }}>{d.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                      <p className="fd italic text-center text-xs" style={{ color:C.muted }}>
                        Hindari warna putih & hitam penuh. Tampil cantik dan elegan bersama kami ✦
                      </p>
                    </motion.div>
                  </div>
                </Sec>

                {/* ═══ GALLERY ═══ */}
                <Sec id="galeri" dark className="py-20 sm:py-28">
                  <div className="text-center mb-10 px-6">
                    <Tag>OUR GALLERY</Tag>
                    <h2 className="fd" style={{ fontSize:"clamp(30px,5vw,44px)", color:C.ivory, fontWeight:300 }}>Momen Kami</h2>
                    <GoldLine className="w-12 mx-auto mt-5" />
                    <p className="fd italic text-sm mt-4" style={{ color:`${C.ivory}55` }}>Geser untuk melihat semua foto</p>
                  </div>

                  {/* Horizontal scroll gallery */}
                  <div className="relative">
                    <div ref={galleryRef} className="gallery-track px-6 sm:px-12 pb-4">
                      {W.gallery.map((p, i) => (
                        <motion.button key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.06 }}
                          onClick={() => setLightbox(i)}
                          className="gallery-item relative overflow-hidden group"
                          style={{ aspectRatio:"3/4", flexShrink:0 }}>
                          <img src={p.src} alt={p.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108" style={{ transition:"transform 0.7s ease" }}/>
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background:"rgba(192,144,80,0.18)" }}/>
                          <div className="absolute inset-x-0 bottom-0 py-4 px-4" style={{ background:"linear-gradient(to top, rgba(26,21,17,0.85) 0%, transparent 100%)" }}>
                            <p className="fd italic text-sm" style={{ color:C.ivory }}>{p.label}</p>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="fb text-[9px] font-medium px-4 py-2" style={{ background:"rgba(255,252,247,0.15)", color:C.ivory, border:`1px solid ${C.ivory}33`, backdropFilter:"blur(8px)", letterSpacing:"0.1em" }}>LIHAT</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    {/* Arrow buttons */}
                    <button onClick={() => scrollGallery(-1)}
                      className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center z-10"
                      style={{ background:"rgba(26,21,17,0.55)", color:C.ivory, backdropFilter:"blur(8px)" }}>‹</button>
                    <button onClick={() => scrollGallery(1)}
                      className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center z-10"
                      style={{ background:"rgba(26,21,17,0.55)", color:C.ivory, backdropFilter:"blur(8px)" }}>›</button>
                  </div>
                </Sec>

                {/* ═══ GIFT ═══ */}
                <Sec id="hadiah" className="px-6 sm:px-12 py-20 sm:py-28">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Tag>AMPLOP DIGITAL</Tag>
                      <h2 className="fd" style={{ fontSize:"clamp(28px,5vw,40px)", color:C.deep, fontWeight:400 }}>Hadiah & Doa</h2>
                      <GoldLine className="w-12 mx-auto mt-5" />
                      <p className="fd italic text-sm mt-5" style={{ color:C.muted }}>
                        Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami.<br/>Namun bila ingin memberikan hadiah, berikut informasinya:
                      </p>
                    </div>
                    <div className="space-y-4">
                      {W.bank.map((b, i) => (
                        <motion.div key={b.no} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.12 }}
                          className="relative overflow-hidden p-6 flex items-center justify-between gap-4"
                          style={{ background:`linear-gradient(135deg,${C.cream},${C.ivory})`, border:`1px solid ${C.gold}44`, boxShadow:`0 8px 30px rgba(192,144,80,0.07)` }}>
                          <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background:`linear-gradient(to right,transparent,${C.gold}66,transparent)` }}/>
                          <div>
                            <p className="fb text-[9px] tracking-widest font-medium mb-1" style={{ color:C.gold }}>{b.name.toUpperCase()}</p>
                            <p className="fd text-2xl sm:text-3xl font-medium mb-1" style={{ color:C.deep }}>{b.no}</p>
                            <p className="fb text-xs" style={{ color:C.muted }}>a.n. {b.an}</p>
                          </div>
                          <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                            onClick={() => copyBank(b.no)}
                            className="fb flex-shrink-0 px-4 py-2.5 text-[9px] font-medium tracking-widest transition-all duration-300"
                            style={{ background: copied===b.no ? C.gold : "transparent", color: copied===b.no ? C.ivory : C.gold, border:`1px solid ${C.gold}66`, letterSpacing:"0.1em" }}>
                            {copied===b.no ? "✓ COPIED" : "SALIN"}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                    {/* Physical gift */}
                    <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.3 }}
                      className="mt-6 p-5 text-center" style={{ border:`1px dashed ${C.gold}44` }}>
                      <p className="fb text-[9px] tracking-widest mb-1 font-medium" style={{ color:C.gold }}>ATAU KIRIM KE ALAMAT</p>
                      <p className="fd italic text-base" style={{ color:C.deep }}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                      <p className="fb text-xs mt-1" style={{ color:C.muted }}>Jakarta Selatan, 12160</p>
                    </motion.div>
                  </div>
                </Sec>

                {/* ═══ RSVP ═══ */}
                <Sec id="rsvp" dark className="px-6 sm:px-12 py-20 sm:py-28">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Tag>RSVP</Tag>
                      <h2 className="fd" style={{ fontSize:"clamp(28px,5vw,40px)", color:C.ivory, fontWeight:300 }}>Ucapan &amp; Doa</h2>
                      <GoldLine className="w-12 mx-auto mt-5" />
                      <p className="fd italic text-sm mt-5" style={{ color:`${C.ivory}55` }}>Sampaikan ucapan terbaik Anda untuk kami</p>
                    </div>

                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div key="ok" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                          className="text-center py-14 px-8" style={{ border:`1px solid ${C.gold}44` }}>
                          <div className="fs text-6xl mb-4" style={{ color:C.gold }}>✉</div>
                          <p className="fd text-2xl mb-2" style={{ color:C.ivory }}>Terima Kasih</p>
                          <p className="fb text-xs" style={{ color:`${C.ivory}55` }}>Ucapan Anda telah tersimpan dengan indah</p>
                        </motion.div>
                      ) : (
                        <motion.form key="form" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                          onSubmit={submitRsvp} className="space-y-3 p-6 sm:p-8"
                          style={{ background:"rgba(255,252,247,0.05)", border:`1px solid ${C.gold}33` }}>
                          <div className="h-[1px] w-full mb-6" style={{ background:`linear-gradient(to right,transparent,${C.gold}55,transparent)` }}/>
                          <input required value={form.nama} onChange={e => setForm({...form,nama:e.target.value})}
                            placeholder="Nama Anda" className="fb w-full px-4 py-3 text-sm"
                            style={{ background:"rgba(255,252,247,0.07)", border:`1px solid ${C.gold}33`, color:C.ivory, fontFamily:"Montserrat,sans-serif" }}/>
                          <select value={form.hadir} onChange={e => setForm({...form,hadir:e.target.value})}
                            className="fb w-full px-4 py-3 text-sm"
                            style={{ background:"rgba(255,252,247,0.07)", border:`1px solid ${C.gold}33`, color:C.ivory, fontFamily:"Montserrat,sans-serif" }}>
                            <option value="Hadir" style={{ background:C.deep }}>✓ Insya Allah Hadir</option>
                            <option value="Tidak Hadir" style={{ background:C.deep }}>✗ Belum Bisa Hadir</option>
                          </select>
                          <textarea required rows={4} value={form.ucapan} onChange={e => setForm({...form,ucapan:e.target.value})}
                            placeholder="Tulis ucapan dan doa untuk kedua mempelai..." className="fb w-full px-4 py-3 text-sm resize-none"
                            style={{ background:"rgba(255,252,247,0.07)", border:`1px solid ${C.gold}33`, color:C.ivory, fontFamily:"Montserrat,sans-serif" }}/>
                          <motion.button whileHover={{ scale:1.02, y:-1 }} whileTap={{ scale:0.98 }}
                            type="submit" className="fb w-full py-3.5 text-xs font-medium tracking-widest mt-2"
                            style={{ background:`linear-gradient(135deg,${C.goldDark},${C.gold})`, color:C.ivory, letterSpacing:"0.14em" }}>
                            KIRIM UCAPAN
                          </motion.button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {rsvps.length > 0 && (
                      <div className="mt-8 space-y-3 max-h-72 overflow-y-auto pr-1">
                        <AnimatePresence>
                          {rsvps.map(r => (
                            <motion.div key={r.ts} layout initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                              className="relative p-4" style={{ background:"rgba(255,252,247,0.05)", border:`1px solid ${C.gold}22` }}>
                              <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background:`linear-gradient(to bottom,${C.gold}00,${C.gold}55,${C.gold}00)` }}/>
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="fd text-base font-medium" style={{ color:C.ivory }}>{r.nama}</p>
                                <span className="fb text-[8px] px-2.5 py-0.5 font-medium"
                                  style={{ background:r.hadir==="Hadir"?`${C.gold}33`:`${C.rose}22`, color:r.hadir==="Hadir"?C.gold:C.rose, border:`1px solid ${r.hadir==="Hadir"?C.gold+44:C.rose+44}` }}>
                                  {r.hadir==="Hadir"?"HADIR":"TIDAK"}
                                </span>
                              </div>
                              <p className="fb text-xs leading-relaxed italic" style={{ color:`${C.ivory}66` }}>{r.ucapan}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </Sec>

                {/* ═══ CLOSING ═══ */}
                <Sec id="penutup" className="px-6 sm:px-12 py-24 sm:py-32 relative overflow-hidden">
                  {/* Bg decorative */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background:`radial-gradient(ellipse 120% 60% at 50% -5%, ${C.rose}44 0%, transparent 55%),${C.ivory}`
                  }}/>
                  <div className="absolute bottom-6 left-6 opacity-25"><Corner pos="bl" /></div>
                  <div className="absolute bottom-6 right-6 opacity-25"><Corner pos="br" /></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <motion.p initial={{ opacity:0, letterSpacing:"0.2em" }} whileInView={{ opacity:1, letterSpacing:"0.45em" }} viewport={{ once:true }} transition={{ duration:1.2 }}
                      className="fb text-[9px] tracking-[0.45em] font-medium mb-8" style={{ color:C.gold }}>
                      TERIMA KASIH
                    </motion.p>
                    <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:1 }}
                      className="fs gshim" style={{ fontSize:"clamp(56px,10vw,80px)", lineHeight:1.1 }}>
                      Jazakumullah<br/>Khairan
                    </motion.h2>
                    <GoldLine className="w-20 mx-auto my-8" />
                    <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay:0.2 }}
                      className="fd italic leading-[1.9] mb-10 px-4" style={{ fontSize:"clamp(14px,2vw,16px)", color:C.muted }}>
                      Merupakan suatu kehormatan dan kebahagiaan yang tiada terkira bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai. Semoga Allah Subhanahu Wa Ta'ala membalas setiap kebaikan Anda dengan berlipat ganda.
                    </motion.p>
                    <p className="fd italic text-sm mb-2" style={{ color:C.muted }}>Kami yang berbahagia,</p>
                    <motion.h3 animate={{ opacity:[0.85,1,0.85] }} transition={{ duration:3, repeat:Infinity }}
                      className="fs" style={{ fontSize:"clamp(44px,8vw,60px)", color:C.deep }}>
                      {W.bride} &amp; {W.groom}
                    </motion.h3>
                    <GoldLine className="w-16 mx-auto my-10" />
                    <motion.a whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.96 }}
                      href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}. ${typeof window!=="undefined"?window.location.href:""}`)}`}
                      target="_blank" rel="noreferrer"
                      className="fb inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-medium"
                      style={{ background:"#25D366", color:"#fff", letterSpacing:"0.1em" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      BAGIKAN KE WHATSAPP
                    </motion.a>
                    <p className="fb text-[9px] mt-14 tracking-[0.3em]" style={{ color:C.gold, opacity:0.4 }}>✦ MADE WITH LOVE ✦ 2024 ✦</p>
                  </div>
                </Sec>
              </div>{/* end right panel */}
            </div>
          )}

          {/* ════════ MUSIC ════════ */}
          {opened && (
            <>
              <audio ref={audioRef} src={W.music[musicIdx]} loop preload="auto" onError={onAudioError} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
              <motion.button
                initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:"spring", stiffness:200, delay:0.6 }}
                whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={toggleMusic}
                className="fixed bottom-6 right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${C.goldDark},${C.gold})`, boxShadow:`0 8px 28px rgba(192,144,80,0.45)` }}
                aria-label="Toggle music">
                {playing ? (
                  <div className="vspin">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.45"/>
                      <circle cx="12" cy="12" r="3" fill="white"/>
                      <path d="M6 12a6 6 0 016-6" stroke="white" strokeWidth="1" fill="none" opacity="0.6"/>
                      <path d="M18 12a6 6 0 01-6 6" stroke="white" strokeWidth="1" fill="none" opacity="0.6"/>
                    </svg>
                  </div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/>
                  </svg>
                )}
              </motion.button>
            </>
          )}

          {/* ════════ LIGHTBOX ════════ */}
          <AnimatePresence>
            {lightbox !== null && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={() => setLightbox(null)}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
                style={{ background:"rgba(26,21,17,0.92)", backdropFilter:"blur(12px)" }}>
                <motion.div
                  initial={{ scale:0.88, opacity:0, y:24 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:0.88, opacity:0 }}
                  transition={{ type:"spring", stiffness:250, damping:25 }}
                  onClick={e => e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{ maxWidth:420, width:"100%", aspectRatio:"3/4", boxShadow:`0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${C.gold}33` }}>
                  <img src={W.gallery[lightbox].src} alt={W.gallery[lightbox].label} className="w-full h-full object-cover"/>
                  <div className="absolute inset-x-0 bottom-0 py-6 px-5" style={{ background:"linear-gradient(to top, rgba(26,21,17,0.9) 0%, transparent 100%)" }}>
                    <p className="fd italic text-lg" style={{ color:C.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[9px] tracking-widest mt-1 font-medium" style={{ color:C.goldLight }}>{W.bride.toUpperCase()} &amp; {W.groom.toUpperCase()}</p>
                  </div>
                  <div className="absolute top-4 left-4 opacity-45"><Corner pos="tl" /></div>
                  <div className="absolute top-4 right-4 opacity-45"><Corner pos="tr" /></div>

                  <button onClick={() => setLightbox(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center fb text-sm"
                    style={{ background:"rgba(255,252,247,0.12)", color:"white", backdropFilter:"blur(4px)" }}>✕</button>
                  {lightbox > 0 && (
                    <button onClick={e => { e.stopPropagation(); setLightbox(lightbox-1); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center"
                      style={{ background:"rgba(255,252,247,0.12)", color:"white", backdropFilter:"blur(4px)" }}>‹</button>
                  )}
                  {lightbox < W.gallery.length-1 && (
                    <button onClick={e => { e.stopPropagation(); setLightbox(lightbox+1); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center"
                      style={{ background:"rgba(255,252,247,0.12)", color:"white", backdropFilter:"blur(4px)" }}>›</button>
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
