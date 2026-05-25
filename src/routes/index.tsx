import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

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
  music: "https://www.bensound.com/bensound-music/bensound-romantic.mp3",
};

const COLORS = {
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
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s };
}

function Petal({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={`absolute select-none opacity-70 ${className ?? ""}`}>{children}</div>;
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section
      id={id}
      ref={ref}
      className="relative w-full px-6 py-20"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity .9s ease, transform .9s ease",
      }}
    >
      {children}
    </section>
  );
}

function Index() {
  const guest = useGuestName();
  const [opened, setOpened] = useState(false);
  const [fading, setFading] = useState(false);
  const cd = useCountdown(WEDDING.date);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [form, setForm] = useState({ nama: "", hadir: "Hadir", ucapan: "" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("rsvps");
      if (raw) setRsvps(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (opened && audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [opened]);

  const openInvitation = () => {
    setFading(true);
    setTimeout(() => {
      setOpened(true);
      setFading(false);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, 700);
  };

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
    setMuted(!muted);
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
        .font-body-w { font-family: 'Lato', sans-serif; }
        @keyframes floaty { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-10px)} }
        @keyframes pulseBtn { 0%,100%{ box-shadow: 0 0 0 0 rgba(44,62,80,.35)} 50%{ box-shadow: 0 0 0 14px rgba(44,62,80,0)} }
        .floaty { animation: floaty 4s ease-in-out infinite; }
        .pulse-btn { animation: pulseBtn 2.2s ease-out infinite; }
        .invite-scroll { scroll-behavior: smooth; }
      `}</style>

      <div
        className="font-body-w invite-scroll min-h-screen w-full"
        style={{
          background: `linear-gradient(180deg, ${COLORS.cream} 0%, #ffffff 50%, ${COLORS.dusty}33 100%)`,
          color: COLORS.navy,
        }}
      >
        <div className="mx-auto w-full max-w-[480px] relative overflow-hidden shadow-2xl bg-white/40 backdrop-blur-sm min-h-screen">
          {/* COVER */}
          {!opened && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center mx-auto"
              style={{
                maxWidth: 480,
                left: 0,
                right: 0,
                background: `linear-gradient(160deg, ${COLORS.cream} 0%, #ffffff 55%, ${COLORS.dusty} 130%)`,
                opacity: fading ? 0 : 1,
                transition: "opacity .7s ease",
              }}
            >
              <Petal className="top-4 left-4 text-4xl floaty">🌿</Petal>
              <Petal className="top-6 right-6 text-4xl floaty">🌸</Petal>
              <Petal className="bottom-8 left-6 text-4xl floaty">🌺</Petal>
              <Petal className="bottom-6 right-4 text-4xl floaty">🍃</Petal>
              <Petal className="top-1/3 left-2 text-2xl floaty">🌸</Petal>
              <Petal className="bottom-1/3 right-2 text-2xl floaty">🌿</Petal>

              <div
                className="relative mx-6 px-8 py-12 text-center"
                style={{
                  border: `1px solid ${COLORS.navy}55`,
                  outline: `1px solid ${COLORS.lavender}`,
                  outlineOffset: 6,
                  background: "rgba(255,255,255,0.55)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <p
                  className="font-serif-w italic text-sm mb-2"
                  style={{ letterSpacing: "0.4em", color: COLORS.navy }}
                >
                  THE WEDDING OF
                </p>
                <div className="text-2xl mb-2">🌸</div>
                <h1
                  className="font-serif-w mb-4"
                  style={{ fontSize: 48, lineHeight: 1.05, color: COLORS.navy }}
                >
                  {WEDDING.bride}
                  <span className="block italic text-3xl my-1" style={{ color: COLORS.navy }}>&</span>
                  {WEDDING.groom}
                </h1>
                <p className="font-serif-w italic mb-6" style={{ color: COLORS.navy }}>
                  {WEDDING.dateText}
                </p>
                <div className="h-px w-16 mx-auto my-4" style={{ background: COLORS.navy }} />
                <p className="text-xs tracking-widest mb-1">KEPADA YTH.</p>
                <p className="text-xs mb-1">Bpk/Ibu/Saudara/i</p>
                <p className="font-serif-w text-xl mb-1" style={{ color: COLORS.navy }}>
                  {guest}
                </p>
                <p className="text-xs mb-6">Di Tempat</p>
                <button
                  onClick={openInvitation}
                  className="pulse-btn inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-medium hover:opacity-90 active:scale-95 transition"
                  style={{ background: COLORS.navy }}
                >
                  💌 Buka Undangan
                </button>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          {opened && (
            <div className="relative">
              {/* Floral corners */}
              <Petal className="top-2 left-2 text-3xl">🌿</Petal>
              <Petal className="top-2 right-2 text-3xl">🌸</Petal>

              {/* PEMBUKAAN */}
              <Section id="pembukaan">
                <div className="text-center">
                  <div className="text-3xl mb-3">🌸 ✨ 🌿</div>
                  <p className="font-serif-w italic text-lg mb-4" style={{ color: COLORS.navy }}>
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-sm leading-relaxed mb-6 italic">
                    "Dan di antara tanda-tanda kekuasaan-Nya Dia menciptakan untukmu istri-istri
                    dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya,
                    dan dijadikan-Nya di antaramu rasa kasih dan sayang."
                  </p>
                  <p className="text-xs mb-8" style={{ color: COLORS.navy }}>
                    (QS. Ar-Rum: 21)
                  </p>
                  <p className="text-sm mb-6">
                    Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan
                    pernikahan putra-putri kami:
                  </p>
                  <div className="space-y-6">
                    <div>
                      <p className="text-3xl mb-1">🌷</p>
                      <h2 className="font-serif-w text-3xl" style={{ color: COLORS.navy }}>
                        {WEDDING.brideFull}
                      </h2>
                      <p className="text-sm mt-2">Putri dari</p>
                      <p className="text-sm font-semibold">{WEDDING.brideParents}</p>
                    </div>
                    <p className="font-serif-w italic text-2xl" style={{ color: COLORS.navy }}>&</p>
                    <div>
                      <p className="text-3xl mb-1">🌿</p>
                      <h2 className="font-serif-w text-3xl" style={{ color: COLORS.navy }}>
                        {WEDDING.groomFull}
                      </h2>
                      <p className="text-sm mt-2">Putra dari</p>
                      <p className="text-sm font-semibold">{WEDDING.groomParents}</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* DETAIL ACARA */}
              <Section id="acara">
                <div className="text-center mb-6">
                  <p className="text-xs tracking-[0.4em]">SAVE THE DATE</p>
                  <h2 className="font-serif-w text-3xl mt-2" style={{ color: COLORS.navy }}>
                    Detail Acara
                  </h2>
                  <div className="text-2xl mt-2">🌸 🍃</div>
                </div>

                {/* Countdown */}
                <div
                  className="grid grid-cols-4 gap-2 my-6 text-center"
                  style={{ color: COLORS.navy }}
                >
                  {[
                    { v: cd.d, l: "Hari" },
                    { v: cd.h, l: "Jam" },
                    { v: cd.m, l: "Menit" },
                    { v: cd.s, l: "Detik" },
                  ].map((x) => (
                    <div
                      key={x.l}
                      className="rounded-xl py-3"
                      style={{ background: COLORS.cream, border: `1px solid ${COLORS.lavender}` }}
                    >
                      <div className="font-serif-w text-2xl">{String(x.v).padStart(2, "0")}</div>
                      <div className="text-[10px] tracking-widest">{x.l.toUpperCase()}</div>
                    </div>
                  ))}
                </div>

                {[
                  { title: "Akad Nikah", icon: "💍", data: WEDDING.akad },
                  { title: "Resepsi", icon: "🥂", data: WEDDING.resepsi },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl p-6 mb-4 text-center"
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      border: `1px solid ${COLORS.lavender}`,
                      boxShadow: "0 8px 24px rgba(44,62,80,0.08)",
                    }}
                  >
                    <div className="text-3xl mb-2">{c.icon}</div>
                    <h3 className="font-serif-w text-2xl mb-3" style={{ color: COLORS.navy }}>
                      {c.title}
                    </h3>
                    <p className="text-sm">{c.data.day}</p>
                    <p className="text-sm font-semibold">{c.data.time}</p>
                    <p className="text-sm mt-2 italic">{c.data.place}</p>
                    <a
                      href={c.data.maps}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-4 px-4 py-2 rounded-full text-white text-sm hover:opacity-90 transition"
                      style={{ background: COLORS.navy }}
                    >
                      📍 Buka Google Maps
                    </a>
                  </div>
                ))}
              </Section>

              {/* GALERI */}
              <Section id="galeri">
                <div className="text-center mb-6">
                  <p className="text-xs tracking-[0.4em]">GALLERY</p>
                  <h2 className="font-serif-w text-3xl mt-2" style={{ color: COLORS.navy }}>
                    Momen Kami
                  </h2>
                  <div className="text-2xl mt-2">📸 🌺</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((n, i) => (
                    <button
                      key={n}
                      onClick={() => setLightbox(i)}
                      className="aspect-square rounded-lg flex items-center justify-center font-serif-w text-sm hover:scale-105 transition"
                      style={{
                        background:
                          i % 2 === 0
                            ? `linear-gradient(135deg, ${COLORS.lavender}, ${COLORS.cream})`
                            : `linear-gradient(135deg, ${COLORS.dusty}, ${COLORS.cream})`,
                        color: COLORS.navy,
                      }}
                    >
                      Foto {n}
                    </button>
                  ))}
                </div>
              </Section>

              {/* RSVP */}
              <Section id="rsvp">
                <div className="text-center mb-6">
                  <p className="text-xs tracking-[0.4em]">RSVP</p>
                  <h2 className="font-serif-w text-3xl mt-2" style={{ color: COLORS.navy }}>
                    Ucapan & Doa
                  </h2>
                  <div className="text-2xl mt-2">💌</div>
                </div>
                <form
                  onSubmit={submitRsvp}
                  className="rounded-2xl p-5 space-y-3"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: `1px solid ${COLORS.lavender}`,
                  }}
                >
                  <input
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-2 rounded-lg outline-none bg-white"
                    style={{ border: `1px solid ${COLORS.dusty}` }}
                  />
                  <select
                    value={form.hadir}
                    onChange={(e) => setForm({ ...form, hadir: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white"
                    style={{ border: `1px solid ${COLORS.dusty}` }}
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
                    className="w-full px-4 py-2 rounded-lg outline-none bg-white"
                    style={{ border: `1px solid ${COLORS.dusty}` }}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-full text-white font-medium hover:opacity-90 transition"
                    style={{ background: COLORS.navy }}
                  >
                    Kirim Ucapan
                  </button>
                </form>

                <div className="mt-6 space-y-3 max-h-72 overflow-y-auto pr-1">
                  {rsvps.length === 0 && (
                    <p className="text-center text-xs italic opacity-70">
                      Belum ada ucapan. Jadilah yang pertama 🌸
                    </p>
                  )}
                  {rsvps.map((r) => (
                    <div
                      key={r.ts}
                      className="rounded-xl p-3"
                      style={{
                        background: COLORS.cream,
                        border: `1px solid ${COLORS.lavender}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-serif-w" style={{ color: COLORS.navy }}>
                          {r.nama}
                        </p>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: r.hadir === "Hadir" ? COLORS.dusty : COLORS.lavender,
                            color: COLORS.navy,
                          }}
                        >
                          {r.hadir}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{r.ucapan}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* PENUTUP */}
              <Section id="penutup">
                <div className="text-center">
                  <div className="text-3xl mb-3">🌸 🍃 🌺</div>
                  <h2 className="font-serif-w text-2xl" style={{ color: COLORS.navy }}>
                    Terima Kasih
                  </h2>
                  <p className="text-sm mt-4 leading-relaxed">
                    Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                    Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua
                    mempelai.
                  </p>
                  <p className="font-serif-w italic text-xl mt-6" style={{ color: COLORS.navy }}>
                    Kami yang berbahagia,
                  </p>
                  <h3 className="font-serif-w text-3xl mt-2" style={{ color: COLORS.navy }}>
                    {WEDDING.bride} & {WEDDING.groom}
                  </h3>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Undangan pernikahan ${WEDDING.bride} & ${WEDDING.groom} - ${WEDDING.dateText}. ${typeof window !== "undefined" ? window.location.href : ""}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-8 px-6 py-3 rounded-full text-white text-sm hover:opacity-90 transition"
                    style={{ background: COLORS.navy }}
                  >
                    📱 Bagikan ke WhatsApp
                  </a>
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
              <audio ref={audioRef} src={WEDDING.music} loop />
              <button
                onClick={toggleMusic}
                className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full text-white text-xl shadow-lg active:scale-95 transition"
                style={{ background: COLORS.navy }}
                aria-label="Toggle music"
              >
                {playing ? "🎵" : "🔇"}
              </button>
            </>
          )}

          {/* Lightbox */}
          {lightbox !== null && (
            <div
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            >
              <div
                className="rounded-2xl w-full max-w-sm aspect-square flex items-center justify-center font-serif-w text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.lavender}, ${COLORS.cream})`,
                  color: COLORS.navy,
                }}
              >
                Foto {lightbox + 1}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
