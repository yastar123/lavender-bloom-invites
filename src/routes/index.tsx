import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EmblaCarousel from "embla-carousel-react";

/* ── Register GSAP plugins (client-side safe) ── */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
      body: "Kami bertemu pertama kali di acara orientasi kampus. Satu tatapan yang tak sengaja, menjadi awal dari cerita yang paling indah dalam hidup kami.",
      img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&q=80&fit=crop",
    },
    {
      year: "2021",
      title: "Jatuh Cinta",
      sub: "Dua hati yang akhirnya bicara",
      body: "Dua tahun persahabatan yang dalam, perlahan berubah menjadi cinta yang tulus dan suci. Kami tahu, ini adalah sesuatu yang sangat istimewa.",
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
    { src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&h=1200&q=85&fit=crop", label: "Momen Pertama" },
    { src: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&h=1200&q=85&fit=crop", label: "Dalam Kebun Bunga" },
    { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&h=1200&q=85&fit=crop", label: "Cincin Kami" },
    { src: "https://images.unsplash.com/photo-1511285560929-80b456503681?w=900&h=1200&q=85&fit=crop", label: "Tarian Pertama" },
    { src: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&h=1200&q=85&fit=crop", label: "Dekorasi Akad" },
    { src: "https://images.unsplash.com/photo-1583939411023-14783179e581?w=900&h=1200&q=85&fit=crop", label: "Bunga Cinta" },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=1200&q=85&fit=crop", label: "Momen Bersama" },
    { src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&h=1200&q=85&fit=crop", label: "Sang Pengantin" },
  ],
  bank: [
    { name: "Bank BCA", no: "1234 5678 9012", an: "Anis Permata Sari", color: "#1565C0" },
    { name: "Bank Mandiri", no: "9876 5432 1098", an: "Fadli Ahmad Rahman", color: "#F57F17" },
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

/* ─────────────────────────────────────── FRAMER VARIANTS ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/* ─────────────────────────────────────── SMALL UI ─── */
function GLine({ className = "w-16 mx-auto" }: { className?: string }) {
  return (
    <div
      className={`h-px ${className}`}
      style={{ background: `linear-gradient(to right, transparent, ${G.gold}77, transparent)` }}
    />
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const deg = { tl: 0, tr: 90, br: 180, bl: 270 };
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none"
      style={{ transform: `rotate(${deg[pos]}deg)` }}>
      <path d="M4 4 Q4 26 26 26" stroke={G.gold} strokeWidth="0.7" opacity="0.5" fill="none" />
      <path d="M4 4 Q26 4 26 26" stroke={G.gold} strokeWidth="0.7" opacity="0.5" fill="none" />
      <circle cx="4" cy="4" r="2" fill={G.gold} opacity="0.45" />
      <circle cx="26" cy="4" r="1" fill={G.gold} opacity="0.28" />
      <circle cx="4" cy="26" r="1" fill={G.gold} opacity="0.28" />
    </svg>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <motion.p
      variants={fadeUp}
      className="fb text-[9px] font-semibold mb-3"
      style={{ color: G.gold, letterSpacing: "0.5em" }}
    >
      {label}
    </motion.p>
  );
}

/* ─────────────────────────────────────── LOADER ─── */
function Loader({ onDone }: { onDone: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(".ldr-tag", { opacity: 1, letterSpacing: "0.55em", duration: 1.1, ease: "power2.out" })
      .to(".ldr-a", { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, "-=0.4")
      .to(".ldr-amp", { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
      .to(".ldr-f", { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, "-=0.5")
      .to(".ldr-date", { opacity: 1, duration: 0.7 }, "-=0.2")
      .to(".ldr-bar-fill", { scaleX: 1, duration: 1.3, ease: "power2.inOut" }, "-=0.6")
      .to(loaderRef.current, { delay: 0.2, opacity: 0, duration: 0.9, ease: "power2.inOut" });
  }, { scope: loaderRef });

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ background: G.deep }}
    >
      <div className="text-center px-6">
        <p className="ldr-tag fb text-[9px] font-semibold mb-8"
          style={{ color: G.gold, opacity: 0, letterSpacing: "0.1em" }}>
          UNDANGAN PERNIKAHAN
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="ldr-a fs"
            style={{ fontSize: "clamp(56px,13vw,96px)", color: G.ivory, lineHeight: 1, opacity: 0, transform: "translateY(30px)" }}>
            A
          </span>
          <span className="ldr-amp fd italic"
            style={{ fontSize: "clamp(24px,5vw,40px)", color: G.gold, lineHeight: 1, opacity: 0, transform: "scale(0.5)" }}>
            &amp;
          </span>
          <span className="ldr-f fs"
            style={{ fontSize: "clamp(56px,13vw,96px)", color: G.ivory, lineHeight: 1, opacity: 0, transform: "translateY(30px)" }}>
            F
          </span>
        </div>
        <p className="ldr-date fd italic mt-5 text-sm" style={{ color: `${G.ivory}50`, opacity: 0 }}>
          27 · 04 · 2024
        </p>
        <div className="mt-10 w-36 mx-auto h-px rounded overflow-hidden" style={{ background: `${G.ivory}14` }}>
          <div className="ldr-bar-fill h-full origin-left scale-x-0"
            style={{ background: `linear-gradient(to right, ${G.goldD}, ${G.gold}, ${G.goldL})` }} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── SCROLL PROGRESS ─── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] origin-left"
      style={{
        scaleX,
        height: 2,
        background: `linear-gradient(to right, ${G.goldD}, ${G.gold}, ${G.goldL})`,
      }}
    />
  );
}

/* ─────────────────────────────────────── CUSTOM CURSOR ─── */
function Cursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 240, damping: 24 });
  const sy = useSpring(cy, { stiffness: 240, damping: 24 });
  const [hov, setHov] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[role=button]")) setHov(true);
    };
    const onOut = () => setHov(false);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed z-[199] pointer-events-none hidden lg:block"
      style={{ x: sx, y: sy, marginLeft: "-20px", marginTop: "-20px" }}
    >
      <motion.div
        className="rounded-full"
        animate={{
          width: clicking ? 8 : hov ? 44 : 12,
          height: clicking ? 8 : hov ? 44 : 12,
          background: hov ? "transparent" : G.gold,
          border: hov ? `1.5px solid ${G.gold}` : "none",
          opacity: hov ? 0.7 : 0.9,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        style={{ mixBlendMode: "multiply" }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────── MAGNETIC BTN ─── */
function MagneticButton({
  children,
  onClick,
  className = "",
  style = {},
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 18 });
  const sy = useSpring(y, { stiffness: 160, damping: 18 });

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  }, [x, y]);

  const onMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  const Tag = href ? "a" : "button";
  const extraProps = href ? { href, target: "_blank", rel: "noreferrer" } : { onClick };

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="inline-block">
      <motion.div style={{ x: sx, y: sy }}>
        <Tag
          {...(extraProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          className={`inline-flex items-center justify-center gap-2 ${className}`}
          style={style}
        >
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────── PARALLAX IMAGE ─── */
function ParallaxImg({
  src,
  alt,
  className = "",
  strength = 0.15,
}: {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-strength * 100}%`, `${strength * 100}%`]);

  return (
    <div ref={ref} className={`overflow-hidden relative ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1 + strength * 2 }}
        className="w-full h-full object-cover" />
    </div>
  );
}

/* ─────────────────────────────────────── REVEAL TEXT ─── */
function RevealText({ children, className = "", style = {}, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────── GALLERY WITH EMBLA ─── */
function Gallery({ onOpen }: { onOpen: (i: number) => void }) {
  const [emblaRef, emblaApi] = EmblaCarousel({ loop: true, dragFree: true, align: "start" });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setSelectedIdx(emblaApi.selectedScrollSnap()));
    /* Auto-advance every 3.2 s, pause on pointer interaction */
    const startTimer = () => {
      autoTimer.current = setInterval(() => emblaApi.scrollNext(), 3200);
    };
    const stopTimer = () => {
      if (autoTimer.current) { clearInterval(autoTimer.current); autoTimer.current = null; }
    };
    startTimer();
    emblaApi.on("pointerDown", stopTimer);
    emblaApi.on("pointerUp",   () => { stopTimer(); startTimer(); });
    return () => { stopTimer(); };
  }, [emblaApi]);

  return (
    <div>
      {/* Carousel viewport */}
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing" style={{ touchAction: "pan-y pinch-zoom" }}>
        <div className="flex gap-3 sm:gap-4 pl-5 sm:pl-10">
          {W.gallery.map((ph, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.06, 0.35), duration: 0.7 }}
              whileHover={{ y: -6 }}
              onClick={() => onOpen(i)}
              className="relative overflow-hidden shrink-0 group"
              style={{
                width: "clamp(230px, 32vw, 350px)",
                aspectRatio: "3/4",
                boxShadow: "0 18px 40px rgba(26,21,17,0.28)",
              }}
            >
              <img src={ph.src} alt={ph.label} className="w-full h-full object-cover"
                style={{ transition: "transform 0.7s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Label */}
              <div className="absolute inset-x-0 bottom-0 py-5 px-4"
                style={{ background: "linear-gradient(to top, rgba(26,21,17,0.85) 0%, transparent)" }}>
                <p className="fd italic text-base" style={{ color: G.ivory }}>{ph.label}</p>
                <p className="fb text-[8px] mt-0.5 font-medium" style={{ color: G.goldL, letterSpacing: "0.12em" }}>
                  {String(i + 1).padStart(2, "0")} / {W.gallery.length}
                </p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                style={{ background: `${G.gold}18`, transition: "opacity 0.3s" }}>
                <span className="fb text-[9px] font-semibold px-4 py-2"
                  style={{ background: "rgba(255,252,247,0.15)", color: G.ivory,
                    border: `1px solid ${G.ivory}30`, backdropFilter: "blur(6px)", letterSpacing: "0.12em" }}>
                  LIHAT FOTO
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dot nav */}
      <div className="flex justify-center gap-2 mt-7">
        {W.gallery.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            style={{
              width: i === selectedIdx ? 22 : 7,
              height: 7,
              borderRadius: 4,
              background: i === selectedIdx ? G.gold : `${G.ivory}28`,
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────── FLOATING PETALS ─── */
function Petals() {
  const petals = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: (i * 8.5) % 100,
      delay: (i * 1.8) % 12,
      dur: 14 + (i % 4) * 4,
      size: 6 + (i % 3) * 3,
      rotate: i % 2 === 0 ? 360 : -360,
    })), []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map(p => (
        <motion.div key={p.id}
          initial={{ y: "-5%", opacity: 0, rotate: 0 }}
          animate={{ y: "108vh", opacity: [0, 0.18, 0.18, 0], rotate: p.rotate, x: [0, 20, -15, 10, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", left: `${p.left}%`, fontSize: p.size, color: G.gold }}>
          ✿
        </motion.div>
      ))}
    </div>
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
  const [lightboxDir, setLightboxDir] = useState(1);
  const [activeNav, setActiveNav] = useState("pembukaan");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [form, setForm] = useState({ nama: "", hadir: "Hadir", ucapan: "" });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [storyIdx, setStoryIdx] = useState(0);

  /* GSAP parallax for cover image */
  const coverImgRef = useRef<HTMLImageElement>(null);
  useGSAP(() => {
    if (!coverImgRef.current) return;
    gsap.to(coverImgRef.current, {
      yPercent: 22,
      ease: "none",
      scrollTrigger: { trigger: coverImgRef.current, start: "top top", end: "bottom top", scrub: true },
    });
  }, { dependencies: [opened] });

  /* Load RSVPs */
  useEffect(() => {
    try { const r = localStorage.getItem("rsvps"); if (r) setRsvps(JSON.parse(r)); } catch {}
  }, []);

  /* Highlight active nav on scroll */
  useEffect(() => {
    if (!opened) return;
    const ids = ["pembukaan", "cerita", "acara", "galeri", "rsvp"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [opened]);

  /* Music */
  const tryPlay = () => {
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
  };
  useEffect(() => { if (opened) tryPlay(); }, [opened, musicIdx]);
  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); } else tryPlay();
  };

  /* Open invitation */
  const openInvitation = () => {
    setOpened(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0 }));
  };

  /* RSVP */
  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.ucapan.trim()) return;
    const next: Rsvp[] = [{ ...form, ts: Date.now() }, ...rsvps];
    setRsvps(next);
    try { localStorage.setItem("rsvps", JSON.stringify(next)); } catch {}
    setForm({ nama: "", hadir: "Hadir", ucapan: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const copyBank = (no: string) => {
    navigator.clipboard?.writeText(no.replace(/\s/g, "")).catch(() => {});
    setCopied(no);
    setTimeout(() => setCopied(null), 2500);
  };

  const openLightbox = (i: number, dir = 1) => {
    setLightboxDir(dir);
    setLightbox(i);
  };

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

  /* ── Shared section heading ── */
  const SectionHead = ({ tag, title, dark = false }: { tag: string; title: string; dark?: boolean }) => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={staggerContainer}
      className="text-center mb-10 sm:mb-14"
    >
      <Tag label={tag} />
      <div className="overflow-hidden">
        <motion.h2
          variants={fadeUp}
          className="fd font-light"
          style={{ fontSize: "clamp(28px,5.5vw,48px)", color: dark ? G.ivory : G.deep, lineHeight: 1.2 }}
        >
          {title}
        </motion.h2>
      </div>
      <motion.div variants={fadeUp} className="mt-5">
        <GLine className="w-14 mx-auto" />
      </motion.div>
    </motion.div>
  );

  return (
    <>
      {/* ─── Global CSS ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body { font-family:'Montserrat',sans-serif; background:${G.ivory}; color:${G.deep}; margin:0; padding:0; overflow-x:hidden; }
        @media (hover:hover) and (pointer:fine) { body { cursor:none; } }

        .fs { font-family:'Great Vibes',cursive; }
        .fd { font-family:'Cormorant Garamond',Georgia,serif; }
        .fb { font-family:'Montserrat',sans-serif; }

        ::-webkit-scrollbar { width:3px; height:3px; }
        ::-webkit-scrollbar-thumb { background:${G.gold}55; border-radius:2px; }
        ::-webkit-scrollbar-track { background:transparent; }

        @keyframes shimG { 0%{background-position:-300% 0} 100%{background-position:300% 0} }
        .gshim {
          background: linear-gradient(90deg,${G.goldD} 0%,${G.gold} 28%,${G.goldL} 50%,${G.gold} 72%,${G.goldD} 100%);
          background-size:300% auto; -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; animation:shimG 5s linear infinite;
        }
        @keyframes btnPulse { 0%,100%{box-shadow:0 0 0 0 ${G.gold}66} 60%{box-shadow:0 0 0 14px ${G.gold}00} }
        .btn-pulse { animation:btnPulse 2.8s ease-out infinite; }

        /* Film grain */
        #grain {
          position:fixed; inset:0; z-index:9990; pointer-events:none; opacity:0.032;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode:overlay;
        }

        /* Timeline vertical line */
        .timeline-line { width:1px; background:linear-gradient(to bottom,transparent,${G.gold}55,transparent); }

        /* Inputs */
        input,select,textarea { font-family:'Montserrat',sans-serif; -webkit-appearance:none; }
        input::placeholder, textarea::placeholder { color:${G.ivory}40; }
        input:focus,select:focus,textarea:focus { outline:none; box-shadow:0 0 0 1.5px ${G.gold}88 !important; }
        select option { background:${G.deep}; color:${G.ivory}; }

        /* Story tab */
        .story-tab { position:relative; padding-bottom:10px; transition:color .3s; }
        .story-tab::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:${G.gold}; transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
        .story-tab.active::after { transform:scaleX(1); }

        /* Embla drag */
        .embla__container { backface-visibility:hidden; }

        /* Smooth hover on event cards */
        .event-card { transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease; }
        .event-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(192,144,80,.14); }

        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .float { animation:floatY 5s ease-in-out infinite; }
      `}</style>

      {/* Grain overlay */}
      <div id="grain" aria-hidden="true" />

      {/* Custom cursor (desktop) */}
      <Cursor />

      {/* ─── LOADER ─── */}
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {loaded && (
        <div className="w-full min-h-screen relative">

          {/* ─── COVER ─── */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div
                key="cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-50 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* LEFT: Hero photo (lg+) */}
                <div className="hidden lg:block lg:w-[52%] h-full relative overflow-hidden">
                  <img
                    ref={coverImgRef}
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90&fit=crop"
                    alt="Wedding"
                    className="w-full object-cover"
                    style={{ height: "115%", marginTop: "-7.5%", objectPosition: "center center" }}
                    loading="eager"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(120deg,rgba(26,21,17,.07) 0%,rgba(26,21,17,.62) 100%)" }} />

                  {/* Text overlay on photo */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <motion.p
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 1 }}
                      className="fb text-[9px] font-semibold mb-9"
                      style={{ color: `${G.ivory}88`, letterSpacing: "0.55em" }}
                    >
                      THE WEDDING OF
                    </motion.p>
                    <div className="overflow-hidden">
                      <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        className="fs"
                        style={{ fontSize: "clamp(70px,9vw,110px)", color: G.ivory, lineHeight: 1, textShadow: "0 4px 32px rgba(0,0,0,.4)" }}
                      >
                        {W.bride}
                      </motion.h1>
                    </div>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
                      className="fd italic text-2xl my-2" style={{ color: G.goldL }}>&amp;</motion.p>
                    <div className="overflow-hidden">
                      <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ delay: 1.05, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        className="fs"
                        style={{ fontSize: "clamp(70px,9vw,110px)", color: G.ivory, lineHeight: 1, textShadow: "0 4px 32px rgba(0,0,0,.4)" }}
                      >
                        {W.groom}
                      </motion.h1>
                    </div>
                    <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>
                      <GLine className="w-24 my-7" />
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="fd italic"
                      style={{ fontSize: "clamp(14px,1.6vw,18px)", color: `${G.ivory}78` }}
                    >
                      {W.dateText}
                    </motion.p>
                  </div>
                  <div className="absolute top-5 left-5 opacity-45"><Corner pos="tl" /></div>
                  <div className="absolute bottom-5 right-5 opacity-45"><Corner pos="br" /></div>
                </div>

                {/* RIGHT: Invitation card */}
                <div
                  className="w-full lg:w-[48%] h-full flex items-center justify-center px-5 py-10 sm:px-8 relative overflow-hidden"
                  style={{ background: `radial-gradient(ellipse 160% 90% at 50% -15%,${G.rose}48 0%,transparent 52%),${G.ivory}` }}
                >
                  {/* Ambient sparkles */}
                  {[
                    { top: "6%", left: "6%", c: "✦", s: 18, d: 0 },
                    { top: "8%", left: "89%", c: "✧", s: 13, d: 0.7 },
                    { top: "89%", left: "7%", c: "✿", s: 15, d: 1.4 },
                    { top: "87%", left: "88%", c: "❋", s: 17, d: 2.1 },
                  ].map((sp, i) => (
                    <motion.span key={i} aria-hidden="true" className="absolute pointer-events-none select-none"
                      style={{ top: sp.top, left: sp.left, color: G.gold, fontSize: sp.s, opacity: 0.22 }}
                      animate={{ y: [0, -10, 0], opacity: [0.15, 0.3, 0.15] }}
                      transition={{ duration: 4 + i, repeat: Infinity, delay: sp.d }}>
                      {sp.c}
                    </motion.span>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full text-center"
                    style={{ maxWidth: 340 }}
                  >
                    <div
                      className="relative px-7 py-10 sm:px-9 sm:py-12"
                      style={{ border: `1px solid ${G.gold}40`, background: "rgba(255,252,247,0.75)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
                    >
                      {/* Corner marks */}
                      {(["tl","tr","bl","br"] as const).map((p,i) => {
                        const pos = p==="tl"?"top-2 left-2":p==="tr"?"top-2 right-2":p==="bl"?"bottom-2 left-2":"bottom-2 right-2";
                        const d = p==="tl"?"M0 8L0 0L8 0":p==="tr"?"M14 8L14 0L6 0":p==="bl"?"M0 6L0 14L8 14":"M14 6L14 14L6 14";
                        return (
                          <div key={i} className={`absolute ${pos} w-4 h-4`}>
                            <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                              <path d={d} stroke={G.gold} strokeWidth="1" opacity="0.5"/>
                            </svg>
                          </div>
                        );
                      })}

                      {/* Mobile-only couple names */}
                      <div className="lg:hidden mb-6">
                        <motion.p initial={{ opacity:0, letterSpacing:"0.1em" }} animate={{ opacity:1, letterSpacing:"0.42em" }}
                          transition={{ duration:1.2, delay:0.25 }} className="fb text-[9px] font-semibold mb-4"
                          style={{ color:G.gold, letterSpacing:"0.42em" }}>THE WEDDING OF</motion.p>
                        <GLine className="w-14 mx-auto mb-5" />
                        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5, duration:0.9 }}>
                          <span className="fs gshim block" style={{ fontSize:"clamp(44px,12vw,64px)", lineHeight:1 }}>{W.bride}</span>
                          <span className="fd italic block my-1" style={{ color:G.muted, fontSize:18 }}>&amp;</span>
                          <span className="fs gshim block" style={{ fontSize:"clamp(44px,12vw,64px)", lineHeight:1 }}>{W.groom}</span>
                        </motion.div>
                        <GLine className="w-14 mx-auto mt-5 mb-4" />
                        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
                          className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</motion.p>
                      </div>

                      {/* Desktop-only date */}
                      <div className="hidden lg:block mb-7">
                        <p className="fb text-[9px] font-semibold mb-4" style={{ color:G.gold, letterSpacing:"0.38em" }}>UNDANGAN PERNIKAHAN</p>
                        <GLine className="w-14 mx-auto mb-4" />
                        <p className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</p>
                      </div>

                      {/* Guest name */}
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }} className="mb-7">
                        <p className="fb text-[8px] font-semibold mb-1.5" style={{ color:G.gold, letterSpacing:"0.35em" }}>KEPADA YTH.</p>
                        <p className="fb text-xs mb-1" style={{ color:G.muted }}>Bpk/Ibu/Saudara/i</p>
                        <p className="fd font-medium" style={{ fontSize:"clamp(18px,5vw,22px)", color:G.deep }}>{guest}</p>
                        <p className="fb text-xs mt-0.5" style={{ color:G.muted }}>Di Tempat</p>
                      </motion.div>

                      {/* CTA */}
                      <MagneticButton
                        onClick={openInvitation}
                        className="btn-pulse fb px-8 py-3.5 text-xs font-semibold"
                        style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, color:G.ivory, letterSpacing:"0.14em" }}
                      >
                        ✉&nbsp;&nbsp;BUKA UNDANGAN
                      </MagneticButton>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── MAIN CONTENT ─── */}
          {opened && (
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <Petals />
              <ScrollBar />

              {/* ── SIDEBAR (desktop sticky) ── */}
              <aside
                className="hidden lg:flex lg:w-[33%] xl:w-[31%] 2xl:w-[28%] sticky top-0 h-screen flex-col overflow-hidden shrink-0"
                style={{ borderRight:`1px solid ${G.gold}1A` }}
              >
                <div className="flex-1 relative overflow-hidden min-h-0">
                  <ParallaxImg
                    src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85&fit=crop&crop=top"
                    alt="Anis & Fadli"
                    className="w-full h-full absolute inset-0"
                    strength={0.08}
                  />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(26,21,17,.05),rgba(26,21,17,.7))" }} />
                  <div className="absolute top-4 left-4 opacity-45"><Corner pos="tl" /></div>
                  <div className="absolute top-4 right-4 opacity-45"><Corner pos="tr" /></div>
                </div>
                <div className="px-7 py-5 text-center shrink-0" style={{ background:G.ivory, borderTop:`1px solid ${G.gold}20` }}>
                  <p className="fb text-[8px] font-semibold mb-1" style={{ color:G.gold, letterSpacing:"0.44em" }}>THE WEDDING OF</p>
                  <div className="flex items-baseline justify-center gap-1.5 mt-1.5">
                    <span className="fs" style={{ fontSize:38, color:G.deep, lineHeight:1 }}>{W.bride}</span>
                    <span className="fd italic text-base" style={{ color:G.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize:38, color:G.deep, lineHeight:1 }}>{W.groom}</span>
                  </div>
                  <GLine className="w-14 mx-auto my-3" />
                  <p className="fd italic text-xs mb-4" style={{ color:G.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {navItems.map(item => (
                      <button key={item.id} onClick={() => navTo(item.id)}
                        className="fb text-[8px] font-semibold py-1 transition-colors duration-200"
                        style={{ color:activeNav===item.id ? G.gold : G.muted, letterSpacing:"0.12em" }}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT SCROLL AREA ── */}
              <div className="flex-1 min-w-0 overflow-x-hidden" style={{ background:G.ivory }}>

                {/* Mobile sticky nav */}
                <motion.nav
                  initial={{ y:-50, opacity:0 }}
                  animate={{ y:0, opacity:1 }}
                  transition={{ delay:0.35 }}
                  className="sticky top-0 z-40 lg:hidden flex items-center justify-center py-2.5"
                  style={{ background:"rgba(255,252,247,0.94)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${G.gold}18` }}
                >
                  {navItems.map(item => (
                    <button key={item.id} onClick={() => navTo(item.id)}
                      className="fb relative px-2.5 sm:px-3.5 py-1.5 text-[8px] font-semibold transition-colors duration-200"
                      style={{ color:activeNav===item.id ? G.gold : G.muted, letterSpacing:"0.1em" }}>
                      {item.label.toUpperCase()}
                      {activeNav===item.id && (
                        <motion.div layoutId="nav-m" className="absolute bottom-0 left-1 right-1 h-px"
                          style={{ background:G.gold }}
                          transition={{ type:"spring", stiffness:340, damping:32 }} />
                      )}
                    </button>
                  ))}
                </motion.nav>

                {/* ══ PEMBUKAAN ══ */}
                <section id="pembukaan" className="relative px-5 sm:px-12 py-16 sm:py-24 overflow-hidden">
                  {/* Ambient glow */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 80% 55% at 50% 0%,${G.rose}30,transparent 55%)` }} />
                  <div className="absolute top-6 left-6 opacity-15 hidden sm:block"><Corner pos="tl" /></div>
                  <div className="absolute top-6 right-6 opacity-15 hidden sm:block"><Corner pos="tr" /></div>

                  <div className="text-center max-w-lg mx-auto relative">
                    {/* Quran verse */}
                    <motion.div
                      initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }}
                      variants={staggerContainer}
                    >
                      <motion.p variants={fadeUp}
                        className="fd font-light mb-2"
                        style={{ fontSize:"clamp(22px,5vw,34px)", color:G.deep }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </motion.p>
                      <motion.div variants={fadeUp}><GLine className="w-20 mx-auto my-7" /></motion.div>
                      <motion.blockquote variants={fadeUp}
                        className="fd italic leading-[2.1] mb-3 px-2"
                        style={{ fontSize:"clamp(13px,2vw,16px)", color:G.muted }}>
                        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
                        pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa
                        tenteram kepadanya."
                      </motion.blockquote>
                      <motion.p variants={fadeUp}
                        className="fb text-[9px] font-semibold mb-12"
                        style={{ color:G.gold, letterSpacing:"0.32em" }}>
                        — QS. AR-RUM : 21 —
                      </motion.p>
                      <motion.p variants={fadeUp}
                        className="fb text-xs sm:text-sm leading-[1.95] mb-12 px-1"
                        style={{ color:G.muted }}>
                        Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud
                        menyelenggarakan walimatul 'ursy putra-putri kami:
                      </motion.p>
                    </motion.div>

                    {/* Couple portraits */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-6 items-center sm:items-start justify-center">
                      {[
                        { img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE BRIDE", name:W.bride, full:W.brideFull, role:"Putri dari", parents:W.brideParents, dx:-30 },
                        { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE GROOM", name:W.groom, full:W.groomFull, role:"Putra dari", parents:W.groomParents, dx:30 },
                      ].map((p, i) => (
                        <motion.div key={p.name}
                          initial={{ opacity:0, x:p.dx }}
                          whileInView={{ opacity:1, x:0 }}
                          viewport={{ once:true }}
                          transition={{ duration:1, delay:i*0.15, ease:[0.22,1,0.36,1] }}
                          className="flex-1 text-center w-full max-w-[210px] sm:max-w-none mx-auto sm:mx-0"
                        >
                          <motion.div whileHover={{ y:-6, scale:1.02 }} transition={{ duration:0.4 }}
                            className="relative mx-auto mb-4 overflow-hidden"
                            style={{ width:"min(155px,40vw)", aspectRatio:"3/4",
                              border:`1.5px solid ${G.gold}40`,
                              boxShadow:`0 16px 48px rgba(192,144,80,.14),0 0 0 7px ${G.ivory}` }}
                          >
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 50%,rgba(26,21,17,.28))" }} />
                          </motion.div>
                          <p className="fb text-[8px] font-semibold mb-2" style={{ color:G.gold, letterSpacing:"0.3em" }}>{p.lbl}</p>
                          <h2 className="fs" style={{ fontSize:48, color:G.deep, lineHeight:1.1 }}>{p.name}</h2>
                          <p className="fd italic text-sm mt-1.5 mb-0.5" style={{ color:G.muted }}>{p.full}</p>
                          <p className="fb text-[11px]" style={{ color:G.muted }}>{p.role}</p>
                          <p className="fb text-[11px] font-semibold" style={{ color:G.deep }}>{p.parents}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="px-8 sm:px-14"><GLine /></div>

                {/* ══ KISAH CINTA ══ */}
                <section id="cerita" className="relative py-16 sm:py-24 overflow-hidden"
                  style={{ background:G.deep }}>
                  <div className="px-5 sm:px-12">
                    <SectionHead tag="OUR LOVE STORY" title="Perjalanan Cinta Kami" dark />

                    <div className="max-w-lg mx-auto">
                      {/* Tabs */}
                      <div className="flex gap-6 sm:gap-8 mb-8 overflow-x-auto"
                        style={{ borderBottom:`1px solid ${G.ivory}12` }}>
                        {W.story.map((s,i) => (
                          <button key={s.year} onClick={() => setStoryIdx(i)}
                            className={`story-tab fb text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-300 ${i===storyIdx?"active":""}`}
                            style={{ color:i===storyIdx ? G.gold : `${G.ivory}45`, letterSpacing:"0.08em" }}>
                            {s.year}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div key={storyIdx}
                          initial={{ opacity:0, x:30 }}
                          animate={{ opacity:1, x:0 }}
                          exit={{ opacity:0, x:-30 }}
                          transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
                          className="flex flex-col sm:flex-row gap-6"
                        >
                          {/* Image */}
                          <div className="shrink-0 overflow-hidden"
                            style={{ width:"min(100%, 170px)", aspectRatio:"3/4",
                              border:`1px solid ${G.gold}44`, margin:"0 auto",
                              boxShadow:`0 20px 50px rgba(0,0,0,.45)` }}>
                            <motion.img
                              key={W.story[storyIdx].img}
                              initial={{ scale:1.12 }}
                              animate={{ scale:1 }}
                              transition={{ duration:0.9, ease:"easeOut" }}
                              src={W.story[storyIdx].img}
                              alt={W.story[storyIdx].title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Text */}
                          <div className="flex-1 pt-1">
                            <p className="fb text-[9px] font-semibold mb-2" style={{ color:G.gold, letterSpacing:"0.4em" }}>{W.story[storyIdx].year}</p>
                            <h3 className="fd font-normal mb-1" style={{ fontSize:"clamp(22px,4.5vw,30px)", color:G.ivory }}>{W.story[storyIdx].title}</h3>
                            <p className="fd italic text-sm mb-4" style={{ color:`${G.ivory}55` }}>{W.story[storyIdx].sub}</p>
                            <GLine className="w-10 mb-5" />
                            <p className="fb text-sm leading-[1.95]" style={{ color:`${G.ivory}75` }}>{W.story[storyIdx].body}</p>
                            {/* Dots */}
                            <div className="flex gap-2 mt-8">
                              {W.story.map((_,i) => (
                                <button key={i} onClick={() => setStoryIdx(i)} aria-label={`Story ${i+1}`}
                                  style={{ width:i===storyIdx?24:8, height:8, borderRadius:4,
                                    background:i===storyIdx ? G.gold : `${G.ivory}22`,
                                    border:"none", cursor:"pointer", padding:0,
                                    transition:"all .3s ease" }} />
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Timeline preview */}
                      <div className="flex items-start gap-4 mt-12 relative">
                        <div className="absolute left-3 top-3 bottom-3 timeline-line" />
                        <div className="flex flex-col gap-6 w-full pl-9">
                          {W.story.map((s,i) => (
                            <motion.button key={s.year} onClick={() => setStoryIdx(i)}
                              initial={{ opacity:0, x:-16 }}
                              whileInView={{ opacity:1, x:0 }}
                              viewport={{ once:true }}
                              transition={{ delay:i*0.09, duration:0.6 }}
                              className="flex items-center gap-3 text-left relative group"
                            >
                              <div className="absolute left-[-30px] w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                                style={{ background:i===storyIdx ? G.gold : `${G.ivory}14`, border:`1px solid ${i===storyIdx ? G.gold : G.ivory+"20"}`, transition:"all .3s" }}>
                                <div className="w-2 h-2 rounded-full" style={{ background:i===storyIdx ? G.ivory : G.gold+"55" }} />
                              </div>
                              <p className="fb text-[9px] font-semibold shrink-0" style={{ color:i===storyIdx ? G.gold : `${G.ivory}40`, letterSpacing:"0.12em" }}>{s.year}</p>
                              <p className="fd italic text-sm" style={{ color:i===storyIdx ? G.ivory : `${G.ivory}35` }}>{s.title}</p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ══ ACARA ══ */}
                <section id="acara" className="relative px-5 sm:px-12 py-16 sm:py-24 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 90% 50% at 50% 100%,${G.rose}20,transparent 55%)` }} />
                  <div className="max-w-lg mx-auto relative">
                    <SectionHead tag="SAVE THE DATE" title="Detail Acara" />

                    {/* Countdown */}
                    <motion.div
                      initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.3 }}
                      variants={staggerContainer}
                      className="grid grid-cols-4 gap-2 sm:gap-3 mb-12"
                    >
                      {[{ v:cd.d, l:"Hari" },{ v:cd.h, l:"Jam" },{ v:cd.m, l:"Menit" },{ v:cd.s, l:"Detik" }].map((x,i) => (
                        <motion.div key={x.l} variants={fadeUp} custom={i}
                          className="text-center py-4 sm:py-5 relative overflow-hidden"
                          style={{ background:`linear-gradient(160deg,${G.ivory},${G.cream})`, border:`1px solid ${G.gold}30` }}>
                          <div className="absolute inset-x-0 top-0 h-[2px]"
                            style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }} />
                          <AnimatePresence mode="popLayout">
                            <motion.span key={x.v}
                              initial={{ y:-12, opacity:0 }} animate={{ y:0, opacity:1 }}
                              exit={{ y:12, opacity:0 }} transition={{ duration:0.25 }}
                              className="fd font-light block"
                              style={{ fontSize:"clamp(22px,5.5vw,32px)", color:G.deep }}>
                              {String(x.v).padStart(2,"0")}
                            </motion.span>
                          </AnimatePresence>
                          <span className="fb block mt-0.5"
                            style={{ fontSize:"clamp(7px,1.8vw,9px)", color:G.gold, letterSpacing:"0.15em" }}>
                            {x.l.toUpperCase()}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Event cards */}
                    <div className="space-y-4 mb-12">
                      {[
                        { title:"Akad Nikah", sub:"Ijab Kabul", img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&h=220&q=80&fit=crop", data:W.akad },
                        { title:"Resepsi Pernikahan", sub:"Walimatul 'Ursy", img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=220&q=80&fit=crop", data:W.resepsi },
                      ].map((ev,i) => (
                        <motion.div key={ev.title}
                          initial={{ opacity:0, y:22 }}
                          whileInView={{ opacity:1, y:0 }}
                          viewport={{ once:true }}
                          transition={{ duration:0.85, delay:i*0.12, ease:[0.22,1,0.36,1] }}
                          className="event-card relative overflow-hidden flex items-stretch cursor-default"
                          style={{ border:`1px solid ${G.gold}30` }}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-0.5"
                            style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}55,${G.gold}00)` }} />
                          <div className="w-20 sm:w-24 shrink-0 overflow-hidden">
                            <img src={ev.img} alt={ev.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 px-4 sm:px-5 py-4 sm:py-5" style={{ background:G.ivory }}>
                            <p className="fb text-[8px] font-semibold mb-0.5" style={{ color:G.gold, letterSpacing:"0.22em" }}>{ev.sub.toUpperCase()}</p>
                            <h3 className="fd mb-2 font-normal" style={{ fontSize:"clamp(17px,3.5vw,22px)", color:G.deep }}>{ev.title}</h3>
                            <p className="fb text-xs font-semibold mb-0.5" style={{ color:G.deep }}>{ev.data.time}</p>
                            <p className="fd italic text-sm mb-0.5" style={{ color:G.muted }}>{ev.data.place}</p>
                            <p className="fb text-xs mb-3" style={{ color:G.muted }}>{ev.data.addr}</p>
                            <MagneticButton href={ev.data.maps}
                              className="fb text-[9px] font-semibold px-4 py-1.5"
                              style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, color:G.ivory, letterSpacing:"0.08em" }}>
                              ↗ GOOGLE MAPS
                            </MagneticButton>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Dress code */}
                    <motion.div
                      initial={{ opacity:0, y:22 }}
                      whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }}
                      transition={{ duration:0.85 }}
                      className="p-6 sm:p-8"
                      style={{ background:`linear-gradient(150deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}28` }}
                    >
                      <div className="text-center mb-6">
                        <Tag label="DRESS CODE" />
                        <h3 className="fd font-normal" style={{ fontSize:"clamp(18px,3.5vw,24px)", color:G.deep }}>Tata Busana</h3>
                        <p className="fb text-xs mt-1.5" style={{ color:G.muted }}>Mohon kenakan warna busana berikut</p>
                      </div>
                      <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
                        {W.dressCode.map((d,i) => (
                          <motion.div key={d.label}
                            initial={{ opacity:0, scale:0.8 }}
                            whileInView={{ opacity:1, scale:1 }}
                            viewport={{ once:true }}
                            transition={{ delay:i*0.08, type:"spring", stiffness:200 }}
                            whileHover={{ y:-4 }}
                            className="text-center"
                          >
                            <motion.div
                              whileHover={{ scale:1.1 }}
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 shadow-lg"
                              style={{ background:d.color, border:`2px solid ${G.gold}22` }}
                            />
                            <p className="fb text-[9px] font-semibold" style={{ color:G.deep }}>{d.label}</p>
                            <p className="fb text-[8px]" style={{ color:G.muted }}>{d.for}</p>
                          </motion.div>
                        ))}
                      </div>
                      <p className="fd italic text-center text-xs mt-5" style={{ color:G.muted }}>
                        Hindari warna putih &amp; hitam penuh ✦
                      </p>
                    </motion.div>
                  </div>
                </section>

                <div className="px-8 sm:px-14"><GLine /></div>

                {/* ══ GALLERY ══ */}
                <section id="galeri" className="relative py-16 sm:py-24 overflow-hidden"
                  style={{ background:G.deep }}>
                  <div className="text-center mb-8 sm:mb-12 px-5">
                    <SectionHead tag="OUR GALLERY" title="Momen Kami" dark />
                    <motion.p
                      initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                      className="fd italic text-sm mt-3"
                      style={{ color:`${G.ivory}45` }}>
                      Geser atau seret untuk melihat semua foto
                    </motion.p>
                  </div>
                  <Gallery onOpen={(i) => openLightbox(i)} />
                </section>

                {/* ══ GIFT ══ */}
                <section className="relative px-5 sm:px-12 py-16 sm:py-24 overflow-hidden">
                  <div className="max-w-lg mx-auto">
                    <SectionHead tag="AMPLOP DIGITAL" title="Hadiah & Doa" />
                    <p className="fd italic text-center text-sm mb-9 px-2" style={{ color:G.muted }}>
                      Kehadiran dan doa restu Anda adalah hadiah terbesar. Namun bila berkenan
                      memberikan hadiah:
                    </p>

                    <div className="space-y-4 mb-6">
                      {W.bank.map((b,i) => (
                        <motion.div key={b.no}
                          initial={{ opacity:0, y:18 }}
                          whileInView={{ opacity:1, y:0 }}
                          viewport={{ once:true }}
                          transition={{ delay:i*0.12, duration:0.8 }}
                          className="relative overflow-hidden"
                          style={{ background:`linear-gradient(135deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}40` }}
                        >
                          {/* Top accent */}
                          <div className="absolute inset-x-0 top-0 h-[2px]"
                            style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }} />
                          {/* Color stripe */}
                          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background:b.color, opacity:0.7 }} />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 pl-6">
                            <div>
                              <p className="fb text-[9px] font-semibold mb-1" style={{ color:G.gold, letterSpacing:"0.25em" }}>{b.name.toUpperCase()}</p>
                              <p className="fd font-medium break-all" style={{ fontSize:"clamp(20px,5vw,28px)", color:G.deep }}>{b.no}</p>
                              <p className="fb text-xs" style={{ color:G.muted }}>a.n. {b.an}</p>
                            </div>
                            <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                              onClick={() => copyBank(b.no)}
                              className="fb shrink-0 self-start sm:self-center px-5 py-2.5 text-[9px] font-semibold transition-all duration-300"
                              style={{ background:copied===b.no ? G.gold : "transparent",
                                color:copied===b.no ? G.ivory : G.gold,
                                border:`1px solid ${G.gold}60`, letterSpacing:"0.1em", minWidth:82 }}>
                              {copied===b.no ? "✓ COPIED" : "SALIN"}
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                      transition={{ delay:0.2 }}
                      className="mt-5 p-5 text-center"
                      style={{ border:`1px dashed ${G.gold}40` }}>
                      <p className="fb text-[9px] font-semibold mb-1" style={{ color:G.gold, letterSpacing:"0.3em" }}>ATAU KIRIM KE ALAMAT</p>
                      <p className="fd italic text-base" style={{ color:G.deep }}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                      <p className="fb text-xs mt-0.5" style={{ color:G.muted }}>Jakarta Selatan, 12160</p>
                    </motion.div>
                  </div>
                </section>

                <div className="px-8 sm:px-14"><GLine /></div>

                {/* ══ RSVP ══ */}
                <section id="rsvp" className="relative py-16 sm:py-24 overflow-hidden"
                  style={{ background:G.deep }}>
                  <div className="px-5 sm:px-12">
                    <SectionHead tag="RSVP" title="Ucapan & Doa" dark />
                    <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                      className="fd italic text-center text-sm mb-10"
                      style={{ color:`${G.ivory}50` }}>
                      Sampaikan ucapan terbaik Anda untuk kami
                    </motion.p>

                    <div className="max-w-lg mx-auto">
                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div key="ok"
                            initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                            className="text-center py-16"
                            style={{ border:`1px solid ${G.gold}44` }}>
                            <motion.p className="fs mb-3 float"
                              style={{ fontSize:60, color:G.gold, lineHeight:1 }}>✉</motion.p>
                            <p className="fd text-2xl mb-2" style={{ color:G.ivory }}>Terima Kasih</p>
                            <p className="fb text-xs" style={{ color:`${G.ivory}50` }}>Ucapan Anda telah tersimpan dengan indah</p>
                          </motion.div>
                        ) : (
                          <motion.form key="form"
                            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                            onSubmit={submitRsvp}
                            className="space-y-3 p-5 sm:p-7 mb-7"
                            style={{ background:"rgba(255,252,247,.05)", border:`1px solid ${G.gold}30` }}
                          >
                            <div className="h-px mb-5" style={{ background:`linear-gradient(to right,transparent,${G.gold}50,transparent)` }} />
                            <input required value={form.nama}
                              onChange={e => setForm({...form, nama:e.target.value})}
                              placeholder="Nama Anda"
                              className="fb w-full px-4 py-3 text-sm"
                              style={{ background:"rgba(255,252,247,.07)", border:`1px solid ${G.gold}30`, color:G.ivory }} />
                            <select value={form.hadir}
                              onChange={e => setForm({...form, hadir:e.target.value})}
                              className="fb w-full px-4 py-3 text-sm"
                              style={{ background:"rgba(26,21,17,.9)", border:`1px solid ${G.gold}30`, color:G.ivory }}>
                              <option value="Hadir">✓ Insya Allah Hadir</option>
                              <option value="Tidak Hadir">✗ Belum Bisa Hadir</option>
                            </select>
                            <textarea required rows={4} value={form.ucapan}
                              onChange={e => setForm({...form, ucapan:e.target.value})}
                              placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                              className="fb w-full px-4 py-3 text-sm resize-none"
                              style={{ background:"rgba(255,252,247,.07)", border:`1px solid ${G.gold}30`, color:G.ivory }} />
                            <MagneticButton onClick={() => {}} className="w-full">
                              <button type="submit"
                                className="fb w-full py-3.5 text-xs font-semibold mt-1"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, color:G.ivory, letterSpacing:"0.14em" }}>
                                KIRIM UCAPAN
                              </button>
                            </MagneticButton>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* RSVP list */}
                      {rsvps.length > 0 && (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          <AnimatePresence>
                            {rsvps.map(r => (
                              <motion.div key={r.ts} layout
                                initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                                className="relative p-4"
                                style={{ background:"rgba(255,252,247,.05)", border:`1px solid ${G.gold}20` }}>
                                <div className="absolute left-0 top-0 bottom-0 w-0.5"
                                  style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}55,${G.gold}00)` }} />
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                  <p className="fd text-base font-medium" style={{ color:G.ivory }}>{r.nama}</p>
                                  <span className="fb text-[8px] font-semibold px-2.5 py-0.5 shrink-0"
                                    style={{ background:r.hadir==="Hadir"?`${G.gold}28`:`${G.rose}22`,
                                      color:r.hadir==="Hadir"?G.gold:G.rose,
                                      border:`1px solid ${r.hadir==="Hadir"?G.gold+"44":G.rose+"44"}`,
                                      letterSpacing:"0.08em" }}>
                                    {r.hadir==="Hadir"?"HADIR":"TIDAK"}
                                  </span>
                                </div>
                                <p className="fb text-xs leading-relaxed italic" style={{ color:`${G.ivory}58` }}>{r.ucapan}</p>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                      {rsvps.length===0 && !submitted && (
                        <p className="fb text-center text-[11px] italic py-4" style={{ color:`${G.ivory}38` }}>
                          Belum ada ucapan. Jadilah yang pertama ✦
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ══ PENUTUP ══ */}
                <section className="relative px-5 sm:px-12 py-20 sm:py-32 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 130% 55% at 50% -5%,${G.rose}48,transparent 52%),${G.ivory}` }} />
                  <div className="absolute bottom-5 left-5 opacity-15 hidden sm:block"><Corner pos="bl" /></div>
                  <div className="absolute bottom-5 right-5 opacity-15 hidden sm:block"><Corner pos="br" /></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <motion.p initial={{ opacity:0, letterSpacing:"0.1em" }} whileInView={{ opacity:1, letterSpacing:"0.5em" }}
                      viewport={{ once:true }} transition={{ duration:1 }}
                      className="fb text-[9px] font-semibold mb-7"
                      style={{ color:G.gold, letterSpacing:"0.5em" }}>TERIMA KASIH</motion.p>

                    <RevealText
                      className="fs gshim"
                      style={{ fontSize:"clamp(46px,10vw,76px)", lineHeight:1.15, display:"block" }}>
                      Jazakumullah<br />Khairan
                    </RevealText>

                    <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
                      transition={{ duration:0.9, delay:0.2 }}>
                      <GLine className="w-20 mx-auto my-9" />
                    </motion.div>

                    <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }}
                      viewport={{ once:true }} transition={{ delay:0.3, duration:0.8 }}
                      className="fd italic leading-[1.95] mb-8 px-2"
                      style={{ fontSize:"clamp(13px,2.2vw,16px)", color:G.muted }}>
                      Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                      berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                    </motion.p>

                    <p className="fd italic text-sm mb-2" style={{ color:G.muted }}>Kami yang berbahagia,</p>
                    <motion.h3 animate={{ opacity:[0.85,1,0.85] }} transition={{ duration:3, repeat:Infinity }}
                      className="fs" style={{ fontSize:"clamp(40px,8vw,58px)", color:G.deep }}>
                      {W.bride} &amp; {W.groom}
                    </motion.h3>

                    <GLine className="w-16 mx-auto my-9" />

                    <MagneticButton
                      href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}.`)}`}
                      className="fb gap-2.5 px-7 py-3.5 text-xs font-semibold"
                      style={{ background:"#25D366", color:"#fff", letterSpacing:"0.1em" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      BAGIKAN KE WHATSAPP
                    </MagneticButton>

                    <p className="fb text-[9px] mt-12" style={{ color:G.gold, opacity:0.35, letterSpacing:"0.3em" }}>
                      ✦ MADE WITH LOVE ✦ 2024 ✦
                    </p>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ─── MUSIC BTN ─── */}
          {opened && (
            <>
              <audio ref={audioRef} src={W.music[musicIdx]} loop preload="none"
                onError={() => { if (musicIdx < W.music.length-1) setMusicIdx(i => i+1); }}
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
              <motion.button
                initial={{ scale:0, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                transition={{ type:"spring", stiffness:200, delay:0.7 }}
                whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }}
                onClick={toggleMusic}
                aria-label={playing ? "Pause music" : "Play music"}
                className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, boxShadow:`0 8px 30px rgba(192,144,80,.5)` }}
              >
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" style={{ animation:"vinylSpin 4s linear infinite" }}>
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
                    <circle cx="12" cy="12" r="3" fill="white"/>
                    <path d="M6 12a6 6 0 016-6" stroke="white" strokeWidth="1" fill="none" opacity="0.55"/>
                    <path d="M18 12a6 6 0 01-6 6" stroke="white" strokeWidth="1" fill="none" opacity="0.55"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14"/>
                    <path d="M15.54 8.46a5 5 0 010 7.07"/>
                  </svg>
                )}
              </motion.button>
            </>
          )}

          {/* ─── LIGHTBOX ─── */}
          <AnimatePresence>
            {lightbox !== null && (
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={() => setLightbox(null)}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10"
                style={{ background:"rgba(26,21,17,.92)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" }}
              >
                <motion.div
                  initial={{ scale:0.88, opacity:0, y:18 }}
                  animate={{ scale:1, opacity:1, y:0 }}
                  exit={{ scale:0.88, opacity:0 }}
                  transition={{ type:"spring", stiffness:240, damping:26 }}
                  onClick={e => e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{ maxWidth:400, width:"100%", aspectRatio:"3/4",
                    boxShadow:`0 40px 90px rgba(0,0,0,.6),0 0 0 1px ${G.gold}33` }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={lightbox}
                      initial={{ opacity:0, x: lightboxDir * 30 }}
                      animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x: lightboxDir * -30 }}
                      transition={{ duration:0.4 }}
                      src={W.gallery[lightbox].src}
                      alt={W.gallery[lightbox].label}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Caption */}
                  <div className="absolute inset-x-0 bottom-0 py-5 px-5"
                    style={{ background:"linear-gradient(to top,rgba(26,21,17,.9),transparent)" }}>
                    <p className="fd italic text-lg" style={{ color:G.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[9px] mt-1 font-semibold" style={{ color:G.goldL, letterSpacing:"0.12em" }}>
                      {String(lightbox+1).padStart(2,"0")} / {W.gallery.length}
                    </p>
                  </div>

                  {/* Corners */}
                  <div className="absolute top-3 left-3 opacity-35 pointer-events-none"><Corner pos="tl" /></div>
                  <div className="absolute top-3 right-12 opacity-35 pointer-events-none"><Corner pos="tr" /></div>

                  {/* Close */}
                  <button onClick={() => setLightbox(null)} aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center fb text-sm font-medium"
                    style={{ background:"rgba(255,252,247,.18)", color:G.ivory, backdropFilter:"blur(6px)" }}>
                    ✕
                  </button>

                  {/* Prev */}
                  {lightbox > 0 && (
                    <button onClick={e => { e.stopPropagation(); setLightboxDir(-1); setLightbox(lightbox-1); }}
                      aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-xl"
                      style={{ background:"rgba(255,252,247,.15)", color:G.ivory, backdropFilter:"blur(4px)" }}>‹</button>
                  )}

                  {/* Next */}
                  {lightbox < W.gallery.length-1 && (
                    <button onClick={e => { e.stopPropagation(); setLightboxDir(1); setLightbox(lightbox+1); }}
                      aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-xl"
                      style={{ background:"rgba(255,252,247,.15)", color:G.ivory, backdropFilter:"blur(4px)" }}>›</button>
                  )}
                </motion.div>

                {/* Thumbnail strip */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 px-4 py-2"
                  style={{ background:"rgba(26,21,17,.5)", backdropFilter:"blur(8px)" }}>
                  {W.gallery.map((_,i) => (
                    <button key={i} onClick={e => { e.stopPropagation(); setLightboxDir(i > lightbox! ? 1 : -1); setLightbox(i); }}
                      aria-label={`Go to photo ${i+1}`}
                      className="overflow-hidden transition-all duration-300"
                      style={{ width:i===lightbox?40:28, height:40, opacity:i===lightbox?1:0.45,
                        outline:i===lightbox?`1.5px solid ${G.gold}`:undefined }}>
                      <img src={W.gallery[i].src.replace("w=900","w=120")} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* Vinyl spin keyframe */}
      <style>{`@keyframes vinylSpin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
