import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

export const Route = createFileRoute("/")({
  component: Index,
});

// === KONSTANTA UNDANGAN (mudah diganti) ===
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
    time: "08.00 - 10.00 WIB",
    place: "Masjid Al-Hikmah, Jakarta Selatan",
    maps: "https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta",
  },
  resepsi: {
    day: "Sabtu, 27 April 2024",
    time: "11.00 - 14.00 WIB",
    place: "Gedung Serbaguna Melati, Jakarta Selatan",
    maps: "https://maps.google.com/?q=Gedung+Serbaguna+Melati+Jakarta",
  },
  // Beberapa mirror MP3 publik (fallback otomatis kalau salah satu gagal)
  music: [
    "https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3",
    "https://www.bensound.com/bensound-music/bensound-romantic.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  ],
};

const C = {
  dusty: "#B8C5D6",
  lavender: "#D4C5E2",
  cream: "#F0EBF8",
  navy: "#2C3E50",
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

// === Floating flowers/leaves with continuous motion ===
function FloatingPetals() {
  const items = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        emoji: ["🌸", "🌿", "🌺", "🍃", "🌷", "✨"][i % 6],
        left: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 12,
        size: 14 + Math.random() * 18,
      })),
    [],
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-10%", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: "110vh",
            x: [0, 20, -20, 10, 0],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0, 0.9, 0.9, 0],
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
          }}
        >
          {p.emoji}
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`relative w-full px-5 sm:px-8 py-16 sm:py-24 ${className}`}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ kicker, title, icon }: { kicker: string; title: string; icon: string }) {
  return (
    <div className="text-center mb-8">
      <motion.p
        initial={{ letterSpacing: "0.1em", opacity: 0 }}
        whileInView={{ letterSpacing: "0.5em", opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-[10px] sm:text-xs"
        style={{ color: C.navy }}
      >
        {kicker}
      </motion.p>
      <h2
        className="font-serif-w text-3xl sm:text-4xl mt-2"
        style={{ color: C.navy }}
      >
        {title}
      </h2>
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
        className="text-2xl mt-3"
      >
        {icon}
      </motion.div>
      <div
        className="h-px w-16 mx-auto mt-4 opacity-60"
        style={{ background: C.navy }}
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

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [form, setForm] = useState({ nama: "", hadir: "Hadir", ucapan: "" });

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);

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
    a.play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  useEffect(() => {
    if (opened) tryPlay();
  }, [opened, musicIdx]);

  const openInvitation = () => {
    setOpened(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 50);
  };

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

  const onAudioError = () => {
    if (musicIdx < WEDDING.music.length - 1) {
      setMusicIdx((i) => i + 1);
    }
  };

  const submitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.ucapan.trim()) return;
    const next = [{ ...form, ts: Date.now() }, ...rsvps];
    setRsvps(next);
    localStorage.setItem("rsvps", JSON.stringify(next));
    setForm({ nama: "", hadir: "Hadir", ucapan: "" });
  };

  const photos = [1, 2, 3, 4, 5, 6];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400;700&display=swap');
        .font-serif-w { font-family: 'Playfair Display', serif; }
        body, .font-body-w { font-family: 'Lato', sans-serif; }
        @keyframes shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        .shimmer-text {
          background: linear-gradient(90deg, ${C.navy} 0%, ${C.lavender} 50%, ${C.navy} 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(44,62,80,.35) }
          50% { box-shadow: 0 0 0 18px rgba(44,62,80,0) }
        }
        .ring-pulse { animation: ringPulse 2.4s ease-out infinite }
        html { scroll-behavior: smooth }
      `}</style>

      <div
        className="font-body-w min-h-screen w-full relative"
        style={{
          background: `radial-gradient(1200px 600px at 10% -10%, ${C.lavender}55, transparent 60%),
                       radial-gradient(900px 500px at 100% 100%, ${C.dusty}55, transparent 60%),
                       linear-gradient(180deg, ${C.cream} 0%, #ffffff 50%, ${C.dusty}33 100%)`,
          color: C.navy,
        }}
      >
        {/* App container - mobile first, max-width on larger screens */}
        <div
          className="mx-auto w-full max-w-[480px] sm:max-w-[520px] relative shadow-2xl bg-white/30 backdrop-blur-sm min-h-screen overflow-hidden"
          style={{ borderLeft: `1px solid ${C.lavender}55`, borderRight: `1px solid ${C.lavender}55` }}
        >
          {opened && <FloatingPetals />}

          {/* ============ COVER ============ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div
                key="cover"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
                className="fixed inset-0 z-50 mx-auto"
                style={{
                  maxWidth: 520,
                  left: 0,
                  right: 0,
                  background: `linear-gradient(160deg, ${C.cream} 0%, #ffffff 55%, ${C.dusty} 130%)`,
                }}
              >
                {/* Animated floral corners */}
                {[
                  { cls: "top-4 left-4", emoji: "🌿", rotate: -15 },
                  { cls: "top-6 right-6", emoji: "🌸", rotate: 15 },
                  { cls: "bottom-8 left-6", emoji: "🌺", rotate: -10 },
                  { cls: "bottom-6 right-4", emoji: "🍃", rotate: 20 },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    className={`absolute text-4xl sm:text-5xl ${p.cls}`}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: 1,
                      scale: [1, 1.1, 1],
                      rotate: [p.rotate - 5, p.rotate + 5, p.rotate - 5],
                    }}
                    transition={{
                      opacity: { duration: 1, delay: 0.2 * i },
                      scale: { duration: 4, repeat: Infinity, delay: 0.2 * i },
                      rotate: { duration: 5, repeat: Infinity, delay: 0.2 * i },
                    }}
                  >
                    {p.emoji}
                  </motion.div>
                ))}

                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative px-7 py-10 sm:px-10 sm:py-14 text-center w-full"
                    style={{
                      border: `1px solid ${C.navy}55`,
                      outline: `1px solid ${C.lavender}`,
                      outlineOffset: 6,
                      background: "rgba(255,255,255,0.55)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    <motion.p
                      initial={{ letterSpacing: "0.1em", opacity: 0 }}
                      animate={{ letterSpacing: "0.5em", opacity: 1 }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="font-serif-w italic text-xs sm:text-sm mb-3"
                      style={{ color: C.navy }}
                    >
                      THE WEDDING OF
                    </motion.p>

                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="text-3xl mb-2"
                    >
                      🌸
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="font-serif-w mb-4 shimmer-text"
                      style={{ fontSize: "clamp(36px, 10vw, 52px)", lineHeight: 1.05 }}
                    >
                      {WEDDING.bride}
                      <span className="block italic text-2xl sm:text-3xl my-1">&</span>
                      {WEDDING.groom}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="font-serif-w italic mb-5 text-sm sm:text-base"
                      style={{ color: C.navy }}
                    >
                      {WEDDING.dateText}
                    </motion.p>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="h-px w-20 mx-auto my-4 origin-center"
                      style={{ background: C.navy }}
                    />

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1, duration: 0.8 }}
                    >
                      <p className="text-[10px] sm:text-xs tracking-[0.3em] mb-1">KEPADA YTH.</p>
                      <p className="text-xs mb-1">Bpk/Ibu/Saudara/i</p>
                      <motion.p
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="font-serif-w text-xl sm:text-2xl mb-1"
                        style={{ color: C.navy }}
                      >
                        {guest}
                      </motion.p>
                      <p className="text-xs mb-6">Di Tempat</p>
                    </motion.div>

                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openInvitation}
                      className="ring-pulse inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-medium"
                      style={{ background: C.navy }}
                    >
                      💌 Buka Undangan
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ============ MAIN ============ */}
          {opened && (
            <div className="relative z-10">
              {/* Top parallax floral */}
              <motion.div
                style={{ y: heroParallax }}
                className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
              >
                <div className="absolute top-3 left-3 text-3xl">🌿</div>
                <div className="absolute top-3 right-3 text-3xl">🌸</div>
              </motion.div>

              {/* PEMBUKAAN */}
              <Section id="pembukaan">
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl mb-4"
                  >
                    🌸 ✨ 🌿
                  </motion.div>
                  <p
                    className="font-serif-w italic text-lg sm:text-xl mb-4"
                    style={{ color: C.navy }}
                  >
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-sm leading-relaxed mb-3 italic">
                    "Dan di antara tanda-tanda kekuasaan-Nya Dia menciptakan untukmu istri-istri
                    dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya,
                    dan dijadikan-Nya di antaramu rasa kasih dan sayang."
                  </p>
                  <p className="text-xs mb-8" style={{ color: C.navy }}>
                    (QS. Ar-Rum: 21)
                  </p>
                  <p className="text-sm mb-8">
                    Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan
                    pernikahan putra-putri kami:
                  </p>

                  {[
                    {
                      icon: "🌷",
                      name: WEDDING.brideFull,
                      role: "Putri dari",
                      parents: WEDDING.brideParents,
                    },
                    {
                      icon: "🌿",
                      name: WEDDING.groomFull,
                      role: "Putra dari",
                      parents: WEDDING.groomParents,
                    },
                  ].map((p, i) => (
                    <div key={p.name}>
                      <motion.div
                        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.2 }}
                        className="my-6"
                      >
                        <motion.p
                          animate={{ rotate: [0, 8, -8, 0] }}
                          transition={{ duration: 5, repeat: Infinity }}
                          className="text-4xl mb-2"
                        >
                          {p.icon}
                        </motion.p>
                        <h2
                          className="font-serif-w text-3xl sm:text-4xl"
                          style={{ color: C.navy }}
                        >
                          {p.name}
                        </h2>
                        <p className="text-sm mt-2">{p.role}</p>
                        <p className="text-sm font-semibold">{p.parents}</p>
                      </motion.div>
                      {i === 0 && (
                        <motion.p
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 100 }}
                          className="font-serif-w italic text-3xl"
                          style={{ color: C.navy }}
                        >
                          &
                        </motion.p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              {/* DETAIL ACARA */}
              <Section id="acara">
                <SectionTitle kicker="SAVE THE DATE" title="Detail Acara" icon="🌸 🍃" />

                {/* Countdown */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3 my-8">
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
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      className="rounded-2xl py-3 sm:py-4 text-center"
                      style={{
                        background: `linear-gradient(180deg, #ffffff, ${C.cream})`,
                        border: `1px solid ${C.lavender}`,
                        boxShadow: "0 6px 18px rgba(44,62,80,0.08)",
                      }}
                    >
                      <motion.div
                        key={x.v}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="font-serif-w text-xl sm:text-2xl"
                        style={{ color: C.navy }}
                      >
                        {String(x.v).padStart(2, "0")}
                      </motion.div>
                      <div className="text-[9px] sm:text-[10px] tracking-widest opacity-70">
                        {x.l.toUpperCase()}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {[
                  { title: "Akad Nikah", icon: "💍", data: WEDDING.akad },
                  { title: "Resepsi", icon: "🥂", data: WEDDING.resepsi },
                ].map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                    whileHover={{ y: -4 }}
                    className="rounded-3xl p-6 mb-4 text-center"
                    style={{
                      background: "rgba(255,255,255,0.75)",
                      border: `1px solid ${C.lavender}`,
                      boxShadow: "0 10px 30px rgba(44,62,80,0.08)",
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-4xl mb-2"
                    >
                      {c.icon}
                    </motion.div>
                    <h3
                      className="font-serif-w text-2xl sm:text-3xl mb-3"
                      style={{ color: C.navy }}
                    >
                      {c.title}
                    </h3>
                    <p className="text-sm">{c.data.day}</p>
                    <p className="text-sm font-semibold">{c.data.time}</p>
                    <p className="text-sm mt-2 italic">{c.data.place}</p>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={c.data.maps}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 px-5 py-2 rounded-full text-white text-sm"
                      style={{ background: C.navy }}
                    >
                      📍 Buka Google Maps
                    </motion.a>
                  </motion.div>
                ))}
              </Section>

              {/* GALERI */}
              <Section id="galeri">
                <SectionTitle kicker="GALLERY" title="Momen Kami" icon="📸 🌺" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {photos.map((n, i) => (
                    <motion.button
                      key={n}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.05, rotate: i % 2 ? 2 : -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLightbox(i)}
                      className="aspect-square rounded-2xl flex items-center justify-center font-serif-w text-sm shadow-md"
                      style={{
                        background:
                          i % 2 === 0
                            ? `linear-gradient(135deg, ${C.lavender}, ${C.cream})`
                            : `linear-gradient(135deg, ${C.dusty}, ${C.cream})`,
                        color: C.navy,
                      }}
                    >
                      Foto {n}
                    </motion.button>
                  ))}
                </div>
              </Section>

              {/* RSVP */}
              <Section id="rsvp">
                <SectionTitle kicker="RSVP" title="Ucapan & Doa" icon="💌" />
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={submitRsvp}
                  className="rounded-3xl p-5 sm:p-6 space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    border: `1px solid ${C.lavender}`,
                    boxShadow: "0 10px 30px rgba(44,62,80,0.08)",
                  }}
                >
                  <input
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2.5 rounded-xl outline-none bg-white focus:ring-2 transition"
                    style={{ border: `1px solid ${C.dusty}` }}
                  />
                  <select
                    value={form.hadir}
                    onChange={(e) => setForm({ ...form, hadir: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white"
                    style={{ border: `1px solid ${C.dusty}` }}
                  >
                    <option>Hadir</option>
                    <option>Tidak Hadir</option>
                  </select>
                  <textarea
                    required
                    rows={3}
                    value={form.ucapan}
                    onChange={(e) => setForm({ ...form, ucapan: e.target.value })}
                    placeholder="Tulis ucapan & doa..."
                    className="w-full px-4 py-2.5 rounded-xl outline-none bg-white resize-none"
                    style={{ border: `1px solid ${C.dusty}` }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-2.5 rounded-full text-white font-medium"
                    style={{ background: C.navy }}
                  >
                    Kirim Ucapan
                  </motion.button>
                </motion.form>

                <div className="mt-6 space-y-3 max-h-80 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {rsvps.length === 0 && (
                      <p className="text-center text-xs italic opacity-70">
                        Belum ada ucapan. Jadilah yang pertama 🌸
                      </p>
                    )}
                    {rsvps.map((r) => (
                      <motion.div
                        key={r.ts}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="rounded-2xl p-3"
                        style={{
                          background: C.cream,
                          border: `1px solid ${C.lavender}`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-serif-w" style={{ color: C.navy }}>
                            {r.nama}
                          </p>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{
                              background: r.hadir === "Hadir" ? C.dusty : C.lavender,
                              color: C.navy,
                            }}
                          >
                            {r.hadir}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{r.ucapan}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Section>

              {/* PENUTUP */}
              <Section id="penutup">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="text-4xl mb-3"
                  >
                    🌸 🍃 🌺
                  </motion.div>
                  <h2
                    className="font-serif-w text-3xl sm:text-4xl shimmer-text"
                    style={{ color: C.navy }}
                  >
                    Terima Kasih
                  </h2>
                  <p className="text-sm mt-4 leading-relaxed">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                    Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua
                    mempelai.
                  </p>
                  <p className="font-serif-w italic text-lg mt-6" style={{ color: C.navy }}>
                    Kami yang berbahagia,
                  </p>
                  <motion.h3
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="font-serif-w text-3xl sm:text-4xl mt-2"
                    style={{ color: C.navy }}
                  >
                    {WEDDING.bride} & {WEDDING.groom}
                  </motion.h3>

                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Undangan pernikahan ${WEDDING.bride} & ${WEDDING.groom} - ${WEDDING.dateText}. ${typeof window !== "undefined" ? window.location.href : ""}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-8 px-6 py-3 rounded-full text-white text-sm"
                    style={{ background: C.navy }}
                  >
                    📱 Bagikan ke WhatsApp
                  </motion.a>
                  <p className="text-xs mt-10 opacity-60">
                    Made with 💜 — Floral Wedding Invitation
                  </p>
                </div>
              </Section>
            </div>
          )}

          {/* Music + Audio */}
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
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: playing ? 360 : 0 }}
                transition={{
                  scale: { type: "spring", stiffness: 200 },
                  rotate: { duration: 6, repeat: playing ? Infinity : 0, ease: "linear" },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMusic}
                className="fixed bottom-5 right-5 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white text-xl shadow-xl"
                style={{ background: C.navy }}
                aria-label="Toggle music"
              >
                {playing ? "🎵" : "🔇"}
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="rounded-3xl w-full max-w-sm aspect-square flex items-center justify-center font-serif-w text-2xl shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${C.lavender}, ${C.cream})`,
                    color: C.navy,
                  }}
                >
                  Foto {lightbox + 1}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}