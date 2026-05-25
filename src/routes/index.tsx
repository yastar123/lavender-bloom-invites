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

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/")({
  component: Index,
});

/* ─── DATA ─── */
const W = {
  bride: "Anis", brideFull: "Anis Permata Sari",
  brideParents: "Bapak Suryanto & Ibu Hartini",
  groom: "Fadli", groomFull: "Fadli Ahmad Rahman",
  groomParents: "Bapak Mahmud & Ibu Siti Aminah",
  dateText: "Sabtu, 27 April 2024",
  date: "2024-04-27T08:00:00+07:00",
  akad: { time:"08.00 – 10.00 WIB", place:"Masjid Al-Hikmah", addr:"Jl. Raya Kebayoran Lama No.32, Jakarta Selatan", maps:"https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta" },
  resepsi: { time:"11.00 – 14.00 WIB", place:"The Sultan Ballroom", addr:"Jl. Gatot Subroto, Senayan, Jakarta Pusat", maps:"https://maps.google.com/?q=Sultan+Hotel+Jakarta" },
  music: ["https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3"],
  story: [
    { year:"2019", title:"Pertemuan Pertama", sub:"Sebuah senyum yang mengubah segalanya", body:"Kami bertemu pertama kali di acara orientasi kampus. Satu tatapan yang tak sengaja, menjadi awal dari cerita yang paling indah dalam hidup kami.", img:"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&q=80&fit=crop" },
    { year:"2021", title:"Jatuh Cinta", sub:"Dua hati yang akhirnya bicara", body:"Dua tahun persahabatan yang dalam, perlahan berubah menjadi cinta yang tulus. Kami tahu, ini adalah sesuatu yang sangat istimewa.", img:"https://images.unsplash.com/photo-1529635696947-b3f8c0d35b3c?w=600&h=800&q=80&fit=crop" },
    { year:"2023", title:"Lamaran", sub:"Momen yang paling dinantikan", body:"Di tepi pantai Bali, saat matahari tenggelam, Fadli berlutut dan bertanya, 'Maukah kamu menjadi teman hidupku?' Anis menjawab dengan air mata bahagia.", img:"https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&q=80&fit=crop" },
    { year:"2024", title:"Hari Bahagia", sub:"Selamanya dimulai hari ini", body:"27 April 2024 — hari yang selalu kami impikan. Bersama keluarga dan sahabat tercinta, kami resmi menyatukan dua jiwa dalam ikatan suci.", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&q=80&fit=crop" },
  ],
  gallery: [
    { src:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&h=1200&q=85&fit=crop", label:"Momen Pertama" },
    { src:"https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&h=1200&q=85&fit=crop", label:"Dalam Kebun Bunga" },
    { src:"https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&h=1200&q=85&fit=crop", label:"Cincin Kami" },
    { src:"https://images.unsplash.com/photo-1511285560929-80b456503681?w=900&h=1200&q=85&fit=crop", label:"Tarian Pertama" },
    { src:"https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&h=1200&q=85&fit=crop", label:"Dekorasi Akad" },
    { src:"https://images.unsplash.com/photo-1583939411023-14783179e581?w=900&h=1200&q=85&fit=crop", label:"Bunga Cinta" },
    { src:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=1200&q=85&fit=crop", label:"Momen Bersama" },
    { src:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&h=1200&q=85&fit=crop", label:"Sang Pengantin" },
  ],
  bank: [
    { name:"Bank BCA", no:"1234 5678 9012", an:"Anis Permata Sari", accent:"#1565C0" },
    { name:"Bank Mandiri", no:"9876 5432 1098", an:"Fadli Ahmad Rahman", accent:"#E65100" },
  ],
  dressCode: [
    { color:"#C8BA9E", label:"Sage Linen", for:"Tamu Pria" },
    { color:"#C4A89A", label:"Dusty Blush", for:"Tamu Wanita" },
    { color:"#DDD6CB", label:"Ivory Cream", for:"Keluarga" },
    { color:"#8FA087", label:"Muted Sage", for:"Keluarga" },
  ],
};

const G = {
  gold:"#C09050", goldL:"#E0C080", goldD:"#8A6030",
  deep:"#1A1511", ivory:"#FFFCF7", cream:"#FDF6EC",
  muted:"#7A6A58", rose:"#D4A8A0",
};

type Rsvp = { nama:string; hadir:string; ucapan:string; ts:number };

/* ─── HOOKS ─── */
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
  return { d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) };
}

/* ─── DECORATIVE SVGs ─── */
function OrnamentRing({ size=220, opacity=0.18 }: { size?:number; opacity?:number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" fill="none" style={{ opacity }}>
      <circle cx="110" cy="110" r="105" stroke={G.gold} strokeWidth=".6" strokeDasharray="4 6"/>
      <circle cx="110" cy="110" r="90" stroke={G.gold} strokeWidth=".4"/>
      <circle cx="110" cy="110" r="3" fill={G.gold}/>
      {[0,45,90,135,180,225,270,315].map((deg,i)=>{
        const r = 90, a = deg*Math.PI/180;
        const x = 110+r*Math.cos(a), y = 110+r*Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="2" fill={G.gold} opacity=".55"/>;
      })}
      {[0,60,120,180,240,300].map((deg,i)=>{
        const r = 105, a = deg*Math.PI/180;
        const x = 110+r*Math.cos(a), y = 110+r*Math.sin(a);
        return <path key={i} d={`M${x-4} ${y} L${x} ${y-7} L${x+4} ${y} L${x} ${y+7}Z`} fill={G.gold} opacity=".5"/>;
      })}
    </svg>
  );
}

function FloralDivider({ flip=false }: { flip?:boolean }) {
  return (
    <svg viewBox="0 0 400 40" fill="none" style={{ width:"100%", maxWidth:380, display:"block", transform: flip?"scaleX(-1)":"none" }}>
      <line x1="0" y1="20" x2="155" y2="20" stroke={G.gold} strokeWidth=".6" opacity=".4"/>
      <line x1="245" y1="20" x2="400" y2="20" stroke={G.gold} strokeWidth=".6" opacity=".4"/>
      <circle cx="200" cy="20" r="5" stroke={G.gold} strokeWidth=".8" opacity=".7"/>
      <circle cx="200" cy="20" r="2" fill={G.gold} opacity=".7"/>
      <path d="M175 20 Q185 10 195 20 Q185 30 175 20Z" fill={G.gold} opacity=".28"/>
      <path d="M225 20 Q215 10 205 20 Q215 30 225 20Z" fill={G.gold} opacity=".28"/>
      <path d="M165 20 Q170 14 175 20 Q170 26 165 20Z" fill={G.gold} opacity=".2"/>
      <path d="M235 20 Q230 14 225 20 Q230 26 235 20Z" fill={G.gold} opacity=".2"/>
      <circle cx="158" cy="20" r="1.5" fill={G.gold} opacity=".5"/>
      <circle cx="242" cy="20" r="1.5" fill={G.gold} opacity=".5"/>
      <circle cx="148" cy="20" r="1" fill={G.gold} opacity=".3"/>
      <circle cx="252" cy="20" r="1" fill={G.gold} opacity=".3"/>
    </svg>
  );
}

function Corner({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) {
  const deg = { tl:0, tr:90, br:180, bl:270 };
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ transform:`rotate(${deg[pos]}deg)` }}>
      <path d="M4 4 Q4 28 28 28" stroke={G.gold} strokeWidth=".8" opacity=".5" fill="none"/>
      <path d="M4 4 Q28 4 28 28" stroke={G.gold} strokeWidth=".8" opacity=".5" fill="none"/>
      <circle cx="4" cy="4" r="2.5" fill={G.gold} opacity=".55"/>
      <circle cx="28" cy="4" r="1.2" fill={G.gold} opacity=".3"/>
      <circle cx="4" cy="28" r="1.2" fill={G.gold} opacity=".3"/>
      <path d="M4 4 L10 4" stroke={G.gold} strokeWidth=".5" opacity=".35"/>
      <path d="M4 4 L4 10" stroke={G.gold} strokeWidth=".5" opacity=".35"/>
    </svg>
  );
}

/* Word-by-word animated heading */
function AnimHeading({ children, className="", style={}, dark=false, delay=0 }: {
  children: string; className?:string; style?:React.CSSProperties; dark?:boolean; delay?:number;
}) {
  const words = children.split(" ");
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
          <motion.span
            display="inline-block"
            initial={{ y:"115%", opacity:0, rotateX:"-18deg" }}
            whileInView={{ y:"0%", opacity:1, rotateX:"0deg" }}
            viewport={{ once:true, amount:0.8 }}
            transition={{ duration:0.75, delay: delay + i * 0.09, ease:[0.22,1,0.36,1] }}
            style={{ display:"inline-block", transformOrigin:"top center" }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* 3D tilt card */
function TiltCard({ children, className="", style={} }: { children:React.ReactNode; className?:string; style?:React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness:160, damping:20 });
  const sry = useSpring(ry, { stiffness:160, damping:20 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ry.set(x * 10);
    rx.set(-y * 10);
  }, [rx, ry]);

  const onLeave = useCallback(() => { rx.set(0); ry.set(0); }, [rx, ry]);

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX:srx, rotateY:sry, transformStyle:"preserve-3d", ...style }}
      className={className}>
      {children}
    </motion.div>
  );
}

/* Magnetic button */
function Magnetic({ children, className="", style={}, onClick, href }: {
  children:React.ReactNode; className?:string; style?:React.CSSProperties; onClick?:()=>void; href?:string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness:160, damping:18 });
  const sy = useSpring(y, { stiffness:160, damping:18 });

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width/2) * 0.32);
    y.set((e.clientY - r.top - r.height/2) * 0.32);
  }, [x, y]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  const Tag = href ? "a" : "button";
  const extra = href ? { href, target:"_blank", rel:"noreferrer" } : { onClick };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <motion.div style={{ x:sx, y:sy }}>
        <Tag {...(extra as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={className} style={style}>
          {children}
        </Tag>
      </motion.div>
    </div>
  );
}

/* Scroll reveal container */
function Reveal({ children, delay=0, className="", style={} }: {
  children:React.ReactNode; delay?:number; className?:string; style?:React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity:0, y:32 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.12 }}
      transition={{ duration:0.9, delay, ease:[0.22,1,0.36,1] }}
      className={className} style={style}
    >
      {children}
    </motion.div>
  );
}

/* Gold gradient line */
function GLine({ className="w-16 mx-auto" }: { className?:string }) {
  return <div className={`h-px ${className}`} style={{ background:`linear-gradient(to right,transparent,${G.gold}88,transparent)` }} />;
}

/* Section label */
function SecLabel({ children, dark=false }: { children:string; dark?:boolean }) {
  return (
    <Reveal>
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-8 opacity-50" style={{ background: dark ? G.goldL : G.gold }}/>
        <p className="fb text-[9px] font-semibold" style={{ color: dark ? G.goldL : G.gold, letterSpacing:".55em" }}>{children}</p>
        <div className="h-px w-8 opacity-50" style={{ background: dark ? G.goldL : G.gold }}/>
      </div>
    </Reveal>
  );
}

/* ─── LOADER ─── */
function Loader({ onDone }: { onDone:()=>void }) {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(".ldr-tag",  { opacity:1, letterSpacing:"0.56em", duration:1.1, ease:"power2.out" })
      .to(".ldr-a",    { opacity:1, y:0, duration:1, ease:"expo.out" }, "-=0.5")
      .to(".ldr-amp",  { opacity:1, scale:1, duration:0.55, ease:"back.out(2.2)" }, "-=0.5")
      .to(".ldr-f",    { opacity:1, y:0, duration:1, ease:"expo.out" }, "-=0.55")
      .to(".ldr-date", { opacity:1, duration:0.7 }, "-=0.3")
      .to(".ldr-ring", { opacity:.35, scale:1, duration:1.2, ease:"power2.out" }, "-=1.2")
      .to(".ldr-fill", { scaleX:1, duration:1.5, ease:"power2.inOut" }, "-=0.5")
      .to(el.current,  { opacity:0, duration:0.9, ease:"power2.inOut", delay:0.15 });
  }, { scope: el });

  return (
    <div ref={el} className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{ background:G.deep }}>
      <div className="absolute pointer-events-none ldr-ring" style={{ opacity:0, transform:"scale(.7)" }}>
        <OrnamentRing size={260} opacity={1}/>
      </div>
      <div className="text-center px-6 relative">
        <p className="ldr-tag fb text-[9px] font-semibold mb-8" style={{ color:G.gold, opacity:0, letterSpacing:"0.12em" }}>
          UNDANGAN PERNIKAHAN
        </p>
        <div className="flex items-center justify-center gap-5">
          <span className="ldr-a fs" style={{ fontSize:"clamp(64px,14vw,100px)", color:G.ivory, lineHeight:1, opacity:0, transform:"translateY(32px)" }}>A</span>
          <span className="ldr-amp fd italic" style={{ fontSize:"clamp(28px,5vw,44px)", color:G.gold, lineHeight:1, opacity:0, transform:"scale(0.4)" }}>&amp;</span>
          <span className="ldr-f fs" style={{ fontSize:"clamp(64px,14vw,100px)", color:G.ivory, lineHeight:1, opacity:0, transform:"translateY(32px)" }}>F</span>
        </div>
        <p className="ldr-date fd italic mt-5" style={{ fontSize:"clamp(12px,2vw,15px)", color:`${G.ivory}50`, opacity:0 }}>
          27 · 04 · 2024
        </p>
        <div className="mt-10 w-40 mx-auto h-px overflow-hidden rounded-full" style={{ background:`${G.ivory}12` }}>
          <div className="ldr-fill h-full origin-left scale-x-0 rounded-full"
            style={{ background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldL})` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── SCROLL PROGRESS ─── */
function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness:120, damping:30 });
  return (
    <motion.div className="fixed top-0 left-0 right-0 z-[60] origin-left h-[2px]"
      style={{ scaleX, background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldL})` }} />
  );
}

/* ─── CURSOR ─── */
function Cursor() {
  const cx = useMotionValue(-100); const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness:250, damping:25 });
  const sy = useSpring(cy, { stiffness:250, damping:25 });
  const [hov, setHov] = useState(false);
  const [click, setClick] = useState(false);

  useEffect(() => {
    const mv = (e:MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    const mo = (e:MouseEvent) => { if ((e.target as HTMLElement).closest("a,button,[role=button]")) setHov(true); };
    const mu = () => setHov(false);
    const md = () => setClick(true);
    const mup = () => setClick(false);
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", mo);
    window.addEventListener("mouseout", mu);
    window.addEventListener("mousedown", md);
    window.addEventListener("mouseup", mup);
    return () => { window.removeEventListener("mousemove",mv); window.removeEventListener("mouseover",mo); window.removeEventListener("mouseout",mu); window.removeEventListener("mousedown",md); window.removeEventListener("mouseup",mup); };
  }, []);

  return (
    <motion.div className="fixed z-[199] pointer-events-none hidden lg:flex items-center justify-center"
      style={{ x:sx, y:sy, marginLeft:"-20px", marginTop:"-20px" }}>
      <motion.div className="rounded-full"
        animate={{ width:click?8:hov?44:12, height:click?8:hov?44:12, background:hov?"transparent":G.gold, border:hov?`1.5px solid ${G.gold}`:"none", opacity:hov?0.7:0.9 }}
        transition={{ type:"spring", stiffness:300, damping:26 }}
        style={{ mixBlendMode:"multiply" }} />
    </motion.div>
  );
}

/* ─── EMBLA GALLERY ─── */
function Gallery({ onOpen }: { onOpen:(i:number)=>void }) {
  const [emblaRef, emblaApi] = EmblaCarousel({ loop:true, dragFree:true, align:"start" });
  const [sel, setSel] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setSel(emblaApi.selectedScrollSnap()));
    const start = () => { timer.current = setInterval(() => emblaApi.scrollNext(), 3400); };
    const stop  = () => { if (timer.current) { clearInterval(timer.current); timer.current=null; } };
    start();
    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", () => { stop(); start(); });
    return () => stop();
  }, [emblaApi]);

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden select-none embla-wrap">
        <div className="flex gap-3 sm:gap-4 pl-5 sm:pl-10">
          {W.gallery.map((ph,i) => (
            <motion.button key={i}
              initial={{ opacity:0, scale:.92, y:16 }}
              whileInView={{ opacity:1, scale:1, y:0 }}
              viewport={{ once:true }}
              transition={{ delay:Math.min(i*.06,.3), duration:.8, ease:[0.22,1,0.36,1] }}
              onClick={() => onOpen(i)}
              className="relative overflow-hidden shrink-0 group"
              style={{ width:"clamp(220px,30vw,340px)", aspectRatio:"3/4", boxShadow:`0 24px 56px rgba(26,21,17,.38)` }}
            >
              <img src={ph.src} alt={ph.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"/>
              <div className="absolute inset-0 transition-opacity duration-400"
                style={{ background:"linear-gradient(to top,rgba(26,21,17,.92) 0%,rgba(26,21,17,.2) 50%,transparent 100%)" }}/>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background:`radial-gradient(ellipse at center,${G.gold}10,transparent 70%)` }}/>
              <div className="absolute inset-x-0 bottom-0 py-5 px-5">
                <p className="fd italic text-base mb-0.5 transition-transform duration-400 group-hover:-translate-y-1" style={{ color:G.ivory }}>{ph.label}</p>
                <p className="fb text-[8px] font-semibold transition-opacity duration-300" style={{ color:G.goldL, letterSpacing:".14em" }}>
                  {String(i+1).padStart(2,"0")} / {W.gallery.length}
                </p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <span className="fb text-[9px] font-semibold px-5 py-2"
                  style={{ background:"rgba(255,252,247,.12)", color:G.ivory, border:`1px solid ${G.ivory}35`, backdropFilter:"blur(8px)", letterSpacing:".14em" }}>
                  LIHAT FOTO
                </span>
              </div>
              <div className="absolute top-0 left-0 right-0 h-[1.5px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background:`linear-gradient(to right,transparent,${G.gold},transparent)` }}/>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {W.gallery.map((_,i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Foto ${i+1}`}
            className="transition-all duration-400 rounded-full"
            style={{ width:i===sel?28:8, height:8, borderRadius:4, background:i===sel?G.gold:`${G.ivory}22`, border:"none", cursor:"pointer", padding:0 }} />
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
function Index() {
  const guest = useGuestName();
  const [loaded, setLoaded]   = useState(false);
  const [opened, setOpened]   = useState(false);
  const cd = useCountdown(W.date);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lightbox, setLightbox] = useState<number|null>(null);
  const [lbDir, setLbDir] = useState(1);
  const [activeNav, setActiveNav] = useState("pembukaan");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [form, setForm] = useState({ nama:"", hadir:"Hadir", ucapan:"" });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState<string|null>(null);
  const [storyIdx, setStoryIdx] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<unknown>(null);

  /* Lenis smooth scroll */
  useEffect(() => {
    if (!opened || typeof window === "undefined") return;
    let lenis: unknown;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp:0.09, smoothWheel:true, wheelMultiplier:0.95, touchMultiplier:1.4 });
      lenisRef.current = lenis;
      const raf = (time: number) => {
        (lenis as { raf:(t:number)=>void }).raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
      (lenis as { on:(e:string,cb:(v:{scroll:number})=>void)=>void }).on("scroll", ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(v?: number) {
          if (v !== undefined) (lenis as {scrollTo:(v:number)=>void}).scrollTo(v);
          return (lenis as {scroll:number}).scroll;
        },
        getBoundingClientRect() {
          return { top:0, left:0, width:window.innerWidth, height:window.innerHeight };
        },
      });
      ScrollTrigger.refresh();
    });
    return () => { if (lenis) (lenis as {destroy:()=>void}).destroy(); };
  }, [opened]);

  /* Intersection observer for nav */
  useEffect(() => {
    if (!opened) return;
    const ids = ["pembukaan","cerita","acara","galeri","rsvp"];
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); }); },
      { rootMargin:"-40% 0px -50% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [opened]);

  /* GSAP parallax on cover hero */
  const heroRef = useRef<HTMLImageElement>(null);
  useGSAP(() => {
    if (!heroRef.current || !opened) return;
    gsap.fromTo(heroRef.current, { yPercent:-6 }, {
      yPercent:18, ease:"none",
      scrollTrigger:{ trigger:heroRef.current, start:"top top", end:"bottom top", scrub:1 }
    });
  }, { dependencies:[opened] });

  /* GSAP text reveal for section headings */
  useGSAP(() => {
    if (!opened) return;
    gsap.utils.toArray<HTMLElement>(".gsap-title").forEach(el => {
      gsap.fromTo(el, { opacity:0, y:40 }, {
        opacity:1, y:0, duration:0.9, ease:"power3.out",
        scrollTrigger:{ trigger:el, start:"top 88%", once:true }
      });
    });
  }, { dependencies:[opened] });

  useEffect(() => { try { const r = localStorage.getItem("rsvps"); if (r) setRsvps(JSON.parse(r)); } catch {} }, []);

  const tryPlay = () => audioRef.current?.play().then(()=>setPlaying(true)).catch(()=>{});
  useEffect(() => { if (opened) tryPlay(); }, [opened]);
  const toggleMusic = () => { const a=audioRef.current; if(!a) return; if(playing){a.pause();setPlaying(false);}else tryPlay(); };

  const openInvitation = () => { setOpened(true); requestAnimationFrame(()=>window.scrollTo({top:0})); };

  const submitRsvp = (e:React.FormEvent) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.ucapan.trim()) return;
    const next:Rsvp[] = [{ ...form, ts:Date.now() }, ...rsvps];
    setRsvps(next);
    try { localStorage.setItem("rsvps", JSON.stringify(next)); } catch {}
    setForm({ nama:"", hadir:"Hadir", ucapan:"" });
    setSubmitted(true);
    setTimeout(()=>setSubmitted(false), 3500);
  };

  const copyBank = (no:string) => {
    navigator.clipboard?.writeText(no.replace(/\s/g,"")).catch(()=>{});
    setCopied(no); setTimeout(()=>setCopied(null), 2500);
  };

  const openLb = (i:number, dir=1) => { setLbDir(dir); setLightbox(i); };

  const navItems = [
    { id:"pembukaan", label:"Pasangan" },
    { id:"cerita",    label:"Kisah" },
    { id:"acara",     label:"Acara" },
    { id:"galeri",    label:"Galeri" },
    { id:"rsvp",      label:"RSVP" },
  ];

  const navTo = (id:string) => {
    setActiveNav(id);
    if (lenisRef.current) {
      const el = document.getElementById(id);
      if (el) (lenisRef.current as {scrollTo:(el:Element,opts:{offset:number})=>void}).scrollTo(el, { offset:-60 });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        html{-webkit-text-size-adjust:100%;}
        body{font-family:'Montserrat',sans-serif;background:${G.ivory};color:${G.deep};margin:0;padding:0;overflow-x:hidden;}
        @media(hover:hover) and (pointer:fine){body{cursor:none;}}

        .fs{font-family:'Great Vibes',cursive;}
        .fd{font-family:'Cormorant Garamond',Georgia,serif;}
        .fb{font-family:'Montserrat',sans-serif;}

        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:${G.gold}55;border-radius:2px;}

        @keyframes shimG{0%{background-position:-300% 0}100%{background-position:300% 0}}
        .gshim{background:linear-gradient(90deg,${G.goldD} 0%,${G.gold} 28%,${G.goldL} 50%,${G.gold} 72%,${G.goldD} 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimG 5s linear infinite;}

        @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${G.gold}60}60%{box-shadow:0 0 0 18px ${G.gold}00}}
        .btn-pulse{animation:pulse2 2.8s ease-out infinite;}

        @keyframes vSpin{to{transform:rotate(360deg)}}
        .vspin{animation:vSpin 4s linear infinite;}

        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .float{animation:floatY 5s ease-in-out infinite;}

        @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(5deg)}}
        .float-slow{animation:floatSlow 7s ease-in-out infinite;}

        /* Grain */
        #grain{position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.025;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode:overlay;}

        input,select,textarea{font-family:'Montserrat',sans-serif;-webkit-appearance:none;border-radius:0;}
        input::placeholder,textarea::placeholder{color:${G.ivory}40;}
        input:focus,select:focus,textarea:focus{outline:none;box-shadow:0 0 0 1.5px ${G.gold}88!important;}
        select option{background:${G.deep};color:${G.ivory};}

        /* Horizontal marquee */
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-inner{display:flex;animation:marquee 30s linear infinite;width:max-content;}
        .marquee-inner:hover{animation-play-state:paused;}

        /* Gallery cursor */
        .embla-wrap{cursor:grab;} .embla-wrap:active{cursor:grabbing;}

        /* Story timeline */
        .story-node{transition:all .3s ease;}

        /* Countdown flip */
        @keyframes countFlip{0%{transform:translateY(-100%);opacity:0}100%{transform:translateY(0);opacity:1}}

        /* Nav underline */
        .nav-item{position:relative;padding-bottom:2px;}
        .nav-item::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:${G.gold};transform:scaleX(0);transform-origin:left;transition:transform .35s ease;}
        .nav-item.active::after{transform:scaleX(1);}

        /* Card hover */
        .hover-lift{transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s ease;}
        .hover-lift:hover{transform:translateY(-5px);}

        /* Input group */
        .input-group{position:relative;}
        .input-group label{position:absolute;top:50%;left:16px;transform:translateY(-50%);font-size:10px;color:${G.ivory}50;pointer-events:none;transition:all .2s;font-family:'Montserrat',sans-serif;letter-spacing:.08em;}
        .input-group input:not(:placeholder-shown) ~ label,
        .input-group input:focus ~ label{top:8px;transform:none;font-size:8px;color:${G.gold};}
      `}</style>

      <div id="grain" aria-hidden="true" />
      <Cursor />

      {/* Loader */}
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {loaded && (
        <div ref={mainRef} className="w-full min-h-screen relative">

          {/* ════ COVER ════ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div key="cover"
                initial={{ opacity:1 }}
                exit={{ opacity:0, scale:1.03, filter:"blur(10px)" }}
                transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
                className="fixed inset-0 z-50 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* Left photo panel */}
                <div className="hidden lg:block lg:w-[52%] h-full relative overflow-hidden">
                  <img ref={heroRef}
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90&fit=crop"
                    alt="Wedding" className="w-full object-cover"
                    style={{ height:"115%", marginTop:"-7.5%", objectPosition:"center" }} loading="eager" />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(120deg,rgba(26,21,17,.02),rgba(26,21,17,.65))" }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <motion.p initial={{ opacity:0,y:-16,letterSpacing:".12em" }} animate={{ opacity:1,y:0,letterSpacing:".55em" }}
                      transition={{ delay:.4,duration:1.2 }}
                      className="fb text-[9px] font-semibold mb-8" style={{ color:`${G.ivory}80` }}>
                      THE WEDDING OF
                    </motion.p>
                    <div className="overflow-hidden">
                      <motion.h1 initial={{ y:"110%", skewY:4 }} animate={{ y:0, skewY:0 }}
                        transition={{ delay:.6,duration:1.15,ease:[0.22,1,0.36,1] }}
                        className="fs block" style={{ fontSize:"clamp(78px,10vw,118px)", color:G.ivory, lineHeight:1, textShadow:"0 6px 36px rgba(0,0,0,.45)" }}>
                        {W.bride}
                      </motion.h1>
                    </div>
                    <motion.p initial={{ opacity:0, scaleX:.5 }} animate={{ opacity:1, scaleX:1 }}
                      transition={{ delay:.95 }}
                      className="fd italic text-2xl my-3" style={{ color:G.goldL }}>&amp;</motion.p>
                    <div className="overflow-hidden">
                      <motion.h1 initial={{ y:"110%", skewY:-4 }} animate={{ y:0, skewY:0 }}
                        transition={{ delay:1.05,duration:1.15,ease:[0.22,1,0.36,1] }}
                        className="fs block" style={{ fontSize:"clamp(78px,10vw,118px)", color:G.ivory, lineHeight:1, textShadow:"0 6px 36px rgba(0,0,0,.45)" }}>
                        {W.groom}
                      </motion.h1>
                    </div>
                    <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1.45,duration:1 }}
                      className="my-8"><GLine className="w-28"/></motion.div>
                    <motion.p initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.55,duration:.9 }}
                      className="fd italic" style={{ fontSize:"clamp(14px,1.7vw,19px)", color:`${G.ivory}70` }}>
                      {W.dateText}
                    </motion.p>
                  </div>
                  <div className="absolute top-5 left-5 opacity-50"><Corner pos="tl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-50"><Corner pos="br"/></div>
                  <div className="absolute top-5 right-5 opacity-30"><Corner pos="tr"/></div>
                  <div className="absolute bottom-5 left-5 opacity-30"><Corner pos="bl"/></div>
                </div>

                {/* Right invitation card */}
                <div className="w-full lg:w-[48%] h-full flex items-center justify-center px-5 py-10 sm:px-8 relative overflow-hidden"
                  style={{ background:`radial-gradient(ellipse 160% 90% at 50% -15%,${G.rose}55 0%,transparent 55%),${G.ivory}` }}>

                  {/* Background ornament ring */}
                  <div className="absolute pointer-events-none float-slow" style={{ opacity:.08 }}>
                    <OrnamentRing size={320}/>
                  </div>

                  {/* Ambient sparkles */}
                  {[{t:"6%",l:"6%",c:"✦",s:18,d:0},{t:"8%",l:"88%",c:"✧",s:13,d:.7},{t:"89%",l:"7%",c:"✿",s:15,d:1.4},{t:"87%",l:"87%",c:"❋",s:17,d:2.1},{t:"50%",l:"3%",c:"✦",s:10,d:3},{t:"45%",l:"93%",c:"✧",s:11,d:1.2}]
                    .map((sp,i)=>(
                    <motion.span key={i} aria-hidden="true" className="absolute pointer-events-none select-none"
                      style={{ top:sp.t,left:sp.l,color:G.gold,fontSize:sp.s,opacity:.2 }}
                      animate={{ y:[0,-12,0],opacity:[.12,.32,.12],rotate:[0,15,0] }}
                      transition={{ duration:4+i,repeat:Infinity,delay:sp.d }}>{sp.c}</motion.span>
                  ))}

                  <TiltCard style={{ maxWidth:360, width:"100%" }}>
                    <motion.div initial={{ opacity:0,y:28,scale:.96 }} animate={{ opacity:1,y:0,scale:1 }}
                      transition={{ duration:1.2,delay:.2,ease:[0.22,1,0.36,1] }}
                      className="relative w-full text-center">
                      <div className="relative px-7 py-10 sm:px-10 sm:py-13"
                        style={{ border:`1px solid ${G.gold}45`, background:"rgba(255,252,247,.82)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)" }}>
                        {/* Top gold bar */}
                        <div className="absolute inset-x-0 top-0 h-[2px]"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}80,transparent)` }}/>
                        {/* Corner marks */}
                        {(["tl","tr","bl","br"] as const).map((p,i)=>{
                          const pos=p==="tl"?"top-2.5 left-2.5":p==="tr"?"top-2.5 right-2.5":p==="bl"?"bottom-2.5 left-2.5":"bottom-2.5 right-2.5";
                          const d=p==="tl"?"M0 10L0 0L10 0":p==="tr"?"M16 10L16 0L6 0":p==="bl"?"M0 6L0 16L10 16":"M16 6L16 16L6 16";
                          return (
                            <div key={i} className={`absolute ${pos} w-[16px] h-[16px]`}>
                              <svg viewBox="0 0 16 16" fill="none" width="16" height="16"><path d={d} stroke={G.gold} strokeWidth="1.2" opacity=".55"/></svg>
                            </div>
                          );
                        })}

                        {/* Mobile names */}
                        <div className="lg:hidden mb-7">
                          <motion.p initial={{ opacity:0,letterSpacing:".1em" }} animate={{ opacity:1,letterSpacing:".44em" }}
                            transition={{ duration:1.2,delay:.25 }} className="fb text-[9px] font-semibold mb-5"
                            style={{ color:G.gold }}>THE WEDDING OF</motion.p>
                          <GLine className="w-14 mx-auto mb-5"/>
                          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.5,duration:.9 }}>
                            <span className="fs gshim block" style={{ fontSize:"clamp(46px,12vw,66px)",lineHeight:1 }}>{W.bride}</span>
                            <span className="fd italic block my-1" style={{ color:G.muted,fontSize:20 }}>&amp;</span>
                            <span className="fs gshim block" style={{ fontSize:"clamp(46px,12vw,66px)",lineHeight:1 }}>{W.groom}</span>
                          </motion.div>
                          <GLine className="w-14 mx-auto mt-5 mb-4"/>
                          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.9 }}
                            className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</motion.p>
                        </div>

                        {/* Desktop brief */}
                        <div className="hidden lg:block mb-7">
                          <p className="fb text-[9px] font-semibold mb-4" style={{ color:G.gold,letterSpacing:".42em" }}>UNDANGAN PERNIKAHAN</p>
                          <GLine className="w-16 mx-auto mb-4"/>
                          <p className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</p>
                        </div>

                        {/* Guest */}
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }} className="mb-7">
                          <p className="fb text-[8px] font-semibold mb-1.5" style={{ color:G.gold,letterSpacing:".38em" }}>KEPADA YTH.</p>
                          <p className="fb text-xs mb-1" style={{ color:G.muted }}>Bpk/Ibu/Saudara/i</p>
                          <p className="fd font-medium mt-1" style={{ fontSize:"clamp(19px,5vw,24px)",color:G.deep }}>{guest}</p>
                          <p className="fb text-[10px] mt-0.5" style={{ color:G.muted }}>Di Tempat</p>
                        </motion.div>

                        <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.1 }}>
                          <GLine className="w-14 mx-auto mb-6"/>
                        </motion.div>

                        <Magnetic onClick={openInvitation}
                          className="btn-pulse fb inline-flex items-center gap-2.5 px-9 py-4 text-[10px] font-semibold"
                          style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldL})`, color:G.ivory, letterSpacing:".16em", boxShadow:`0 10px 32px ${G.gold}44` }}>
                          ✉&ensp; BUKA UNDANGAN
                        </Magnetic>
                      </div>
                    </motion.div>
                  </TiltCard>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ════ MAIN CONTENT ════ */}
          {opened && (
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <ScrollBar />

              {/* Floating petals */}
              <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
                {useMemo(()=>Array.from({length:12}).map((_,i)=>({
                  id:i, left:(i*9.4)%100, delay:(i*1.7)%12, dur:18+(i%5)*4,
                })),[]).map(p=>(
                  <motion.div key={p.id}
                    initial={{ y:"-4%",opacity:0,rotate:0 }}
                    animate={{ y:"106vh",opacity:[0,.14,.14,0],rotate:p.id%2===0?360:-360,x:[0,20,-16,10,0] }}
                    transition={{ duration:p.dur,delay:p.delay,repeat:Infinity,ease:"linear" }}
                    style={{ position:"absolute",left:`${p.left}%`,fontSize:8+p.id%5*2,color:G.gold }}>
                    {p.id%3===0?"✿":p.id%3===1?"❋":"✦"}
                  </motion.div>
                ))}
              </div>

              {/* ── SIDEBAR ── */}
              <aside className="hidden lg:flex lg:w-[30%] xl:w-[28%] 2xl:w-[26%] sticky top-0 h-screen flex-col overflow-hidden shrink-0"
                style={{ borderRight:`1px solid ${G.gold}1E` }}>
                <div className="flex-1 relative overflow-hidden min-h-0">
                  <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85&fit=crop&crop=top"
                    alt="Anis & Fadli" className="w-full object-cover absolute inset-0"
                    style={{ height:"120%", objectPosition:"top center" }} />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(26,21,17,.04) 0%,rgba(26,21,17,.62) 70%,rgba(26,21,17,.85) 100%)" }} />
                  <div className="absolute top-4 left-4 opacity-50"><Corner pos="tl"/></div>
                  <div className="absolute top-4 right-4 opacity-50"><Corner pos="tr"/></div>
                  <div className="absolute bottom-0 inset-x-0 px-6 pb-4">
                    <p className="fd italic text-xs" style={{ color:`${G.ivory}55` }}>Bersatu dalam cinta sejati</p>
                  </div>
                </div>
                <div className="px-6 py-5 text-center shrink-0" style={{ background:G.ivory, borderTop:`1px solid ${G.gold}22` }}>
                  <p className="fb text-[8px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".48em" }}>THE WEDDING OF</p>
                  <div className="flex items-baseline justify-center gap-2 mt-1">
                    <span className="fs" style={{ fontSize:40,color:G.deep,lineHeight:1 }}>{W.bride}</span>
                    <span className="fd italic text-lg" style={{ color:G.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize:40,color:G.deep,lineHeight:1 }}>{W.groom}</span>
                  </div>
                  <GLine className="w-12 mx-auto my-3"/>
                  <p className="fd italic text-xs mb-4" style={{ color:G.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>navTo(item.id)}
                        className={`nav-item fb text-[8px] font-semibold py-1 transition-colors duration-200 ${activeNav===item.id?"active":""}`}
                        style={{ color:activeNav===item.id?G.gold:G.muted,letterSpacing:".14em" }}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT PANEL ── */}
              <div className="flex-1 min-w-0 overflow-x-hidden" style={{ background:G.ivory }}>

                {/* Mobile nav */}
                <motion.nav initial={{ y:-48,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:.35,ease:[0.22,1,0.36,1] }}
                  className="sticky top-0 z-40 lg:hidden flex items-center justify-center py-2.5 gap-1"
                  style={{ background:"rgba(255,252,247,.95)", backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)", borderBottom:`1px solid ${G.gold}1A` }}>
                  {navItems.map(item=>(
                    <button key={item.id} onClick={()=>navTo(item.id)}
                      className="fb relative px-2.5 sm:px-3.5 py-1.5 text-[8px] font-semibold transition-colors duration-200"
                      style={{ color:activeNav===item.id?G.gold:G.muted,letterSpacing:".1em" }}>
                      {item.label.toUpperCase()}
                      {activeNav===item.id&&(
                        <motion.div layoutId="nav-m" className="absolute bottom-0 left-1 right-1 h-px" style={{ background:G.gold }}
                          transition={{ type:"spring",stiffness:340,damping:32 }} />
                      )}
                    </button>
                  ))}
                </motion.nav>

                {/* ══ PEMBUKAAN ══ */}
                <section id="pembukaan" className="relative px-5 sm:px-14 py-20 sm:py-28 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 90% 60% at 50% 0%,${G.rose}35,transparent 55%),${G.ivory}` }} />
                  <div className="absolute top-6 left-6 opacity-12 hidden sm:block"><Corner pos="tl"/></div>
                  <div className="absolute top-6 right-6 opacity-12 hidden sm:block"><Corner pos="tr"/></div>
                  {/* Background ornament */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity:.05 }}>
                    <OrnamentRing size={380}/>
                  </div>

                  <div className="text-center max-w-xl mx-auto relative">
                    <Reveal>
                      <p className="fd font-light mb-3" style={{ fontSize:"clamp(24px,5.5vw,36px)",color:G.deep }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    </Reveal>
                    <Reveal delay={.08}>
                      <div className="flex justify-center my-7">
                        <FloralDivider/>
                      </div>
                    </Reveal>
                    <Reveal delay={.12}>
                      <blockquote className="fd italic leading-[2.15] mb-3 px-4"
                        style={{ fontSize:"clamp(13px,2.1vw,16px)",color:G.muted }}>
                        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan
                        dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
                      </blockquote>
                    </Reveal>
                    <Reveal delay={.18}>
                      <p className="fb text-[9px] font-semibold mb-10" style={{ color:G.gold,letterSpacing:".36em" }}>— QS. AR-RUM : 21 —</p>
                    </Reveal>
                    <Reveal delay={.22}>
                      <p className="fb text-xs sm:text-sm leading-[2] mb-14 px-1" style={{ color:G.muted }}>
                        Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan
                        walimatul 'ursy putra-putri kami:
                      </p>
                    </Reveal>

                    {/* Couple portraits */}
                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-6 items-center sm:items-start justify-center">
                      {[
                        { img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE BRIDE", name:W.bride, full:W.brideFull, role:"Putri dari", parents:W.brideParents, dx:-36 },
                        { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE GROOM", name:W.groom, full:W.groomFull, role:"Putra dari", parents:W.groomParents, dx:36 },
                      ].map((p,i)=>(
                        <motion.div key={p.name}
                          initial={{ opacity:0,x:p.dx }}
                          whileInView={{ opacity:1,x:0 }}
                          viewport={{ once:true }}
                          transition={{ duration:1.1,delay:i*.16,ease:[0.22,1,0.36,1] }}
                          className="flex-1 text-center w-full max-w-[220px] sm:max-w-none mx-auto sm:mx-0"
                        >
                          <motion.div whileHover={{ y:-8,scale:1.03 }} transition={{ duration:.45,ease:[0.22,1,0.36,1] }}
                            className="relative mx-auto mb-5 overflow-hidden"
                            style={{ width:"min(162px,42vw)", aspectRatio:"3/4",
                              border:`1.5px solid ${G.gold}45`,
                              boxShadow:`0 22px 60px rgba(192,144,80,.18),0 0 0 8px ${G.ivory}` }}>
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 55%,rgba(26,21,17,.32))" }}/>
                            <div className="absolute inset-x-0 bottom-0 h-[2px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }}/>
                          </motion.div>
                          <p className="fb text-[8px] font-semibold mb-2.5" style={{ color:G.gold,letterSpacing:".32em" }}>{p.lbl}</p>
                          <h2 className="fs" style={{ fontSize:52,color:G.deep,lineHeight:1.1 }}>{p.name}</h2>
                          <p className="fd italic text-sm mt-2 mb-1" style={{ color:G.muted }}>{p.full}</p>
                          <GLine className="w-10 mx-auto my-3"/>
                          <p className="fb text-[11px]" style={{ color:G.muted }}>{p.role}</p>
                          <p className="fb text-[11px] font-semibold mt-0.5" style={{ color:G.deep }}>{p.parents}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Gold marquee divider */}
                <div className="overflow-hidden py-3.5 relative" style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldL},${G.gold},${G.goldD})` }}>
                  <div className="marquee-inner">
                    {Array.from({length:16}).map((_,i)=>(
                      <span key={i} className="fb text-[9px] font-semibold mx-6 shrink-0"
                        style={{ color:G.ivory, letterSpacing:".45em", opacity:.9 }}>
                        {i%2===0?"ANIS & FADLI":"✦ 27 APRIL 2024 ✦"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ══ CERITA ══ */}
                <section id="cerita" className="relative py-20 sm:py-28 overflow-hidden" style={{ background:G.deep }}>
                  {/* Subtle bg texture */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 80% 60% at 80% 50%,${G.gold}06,transparent 60%)` }}/>
                  <div className="px-5 sm:px-14">
                    <div className="text-center mb-14">
                      <SecLabel dark>OUR LOVE STORY</SecLabel>
                      <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(30px,5.5vw,50px)",color:G.ivory,lineHeight:1.2 }}>
                        Perjalanan Cinta Kami
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-6">
                          <FloralDivider/>
                        </div>
                      </Reveal>
                    </div>

                    {/* Vertical timeline */}
                    <div className="max-w-xl mx-auto relative">
                      {/* Center vertical line */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden sm:block"
                        style={{ background:`linear-gradient(to bottom,transparent,${G.gold}44,${G.gold}44,transparent)` }}/>

                      <div className="flex flex-col gap-0">
                        {W.story.map((s,i)=>{
                          const isRight = i%2===1;
                          return (
                            <motion.div key={s.year}
                              initial={{ opacity:0, x: isRight?32:-32 }}
                              whileInView={{ opacity:1, x:0 }}
                              viewport={{ once:true, amount:0.3 }}
                              transition={{ duration:0.85, delay:i*.1, ease:[0.22,1,0.36,1] }}
                              className={`relative flex ${isRight?"sm:flex-row-reverse":"sm:flex-row"} flex-col items-center gap-6 sm:gap-0 mb-10 sm:mb-12 cursor-pointer`}
                              onClick={()=>setStoryIdx(i)}
                            >
                              {/* Content card */}
                              <div className={`sm:w-[calc(50%-28px)] w-full ${isRight?"sm:pl-0 sm:pr-0":"sm:pl-0 sm:pr-0"}`}>
                                <motion.div
                                  whileHover={{ scale:1.02 }}
                                  transition={{ duration:.3 }}
                                  className="relative overflow-hidden"
                                  style={{
                                    border:`1px solid ${i===storyIdx?G.gold:`${G.ivory}12`}`,
                                    background:i===storyIdx?`rgba(192,144,80,.07)`:`rgba(255,252,247,.03)`,
                                    transition:"border-color .3s, background .3s",
                                    boxShadow: i===storyIdx?`0 0 0 1px ${G.gold}30,0 24px 56px rgba(0,0,0,.4)`:"0 8px 32px rgba(0,0,0,.2)"
                                  }}>
                                  <div className="absolute inset-x-0 top-0 h-[1.5px]"
                                    style={{ background:`linear-gradient(to right,transparent,${i===storyIdx?G.gold:`${G.ivory}18`},transparent)`,transition:"background .3s" }}/>
                                  <div className="flex gap-0 items-stretch">
                                    <div className="w-24 sm:w-28 shrink-0 overflow-hidden">
                                      <img src={s.img} alt={s.title} className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="flex-1 px-4 py-4">
                                      <p className="fb text-[8px] font-semibold mb-1.5" style={{ color:G.gold,letterSpacing:".35em" }}>{s.year}</p>
                                      <h3 className="fd font-normal mb-1" style={{ fontSize:"clamp(16px,3vw,20px)",color:G.ivory }}>{s.title}</h3>
                                      <p className="fd italic text-xs mb-2" style={{ color:`${G.ivory}45` }}>{s.sub}</p>
                                      <p className="fb text-[11px] leading-[1.85]" style={{ color:`${G.ivory}60` }}>{s.body}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              </div>

                              {/* Center dot */}
                              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 items-center justify-center z-10">
                                <motion.div
                                  animate={{ scale: i===storyIdx?1.15:1, background: i===storyIdx?G.gold:`rgba(255,252,247,.1)` }}
                                  transition={{ duration:.3 }}
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ border:`1px solid ${i===storyIdx?G.gold:`${G.ivory}22`}` }}>
                                  <span className="fd font-medium text-xs" style={{ color:i===storyIdx?G.ivory:G.gold }}>{i+1}</span>
                                </motion.div>
                              </div>

                              {/* Spacer for the other side */}
                              <div className="hidden sm:block sm:w-[calc(50%-28px)]"/>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Wave divider */}
                <div style={{ background:G.deep, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 60 Q300 0 600 30 Q900 60 1200 10 L1200 60 Z" fill={G.ivory}/>
                  </svg>
                </div>

                {/* ══ ACARA ══ */}
                <section id="acara" className="relative px-5 sm:px-14 py-20 sm:py-28 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 90% 45% at 50% 105%,${G.rose}22,transparent 55%)` }}/>
                  <div className="max-w-xl mx-auto">
                    <div className="text-center mb-14">
                      <SecLabel>SAVE THE DATE</SecLabel>
                      <AnimHeading delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(30px,5.5vw,48px)",color:G.deep,lineHeight:1.2 }}>
                        Detail Acara
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-6">
                          <FloralDivider/>
                        </div>
                      </Reveal>
                    </div>

                    {/* Countdown — large display */}
                    <Reveal delay={.1}>
                      <div className="mb-14 text-center">
                        <p className="fb text-[9px] font-semibold mb-5" style={{ color:G.muted,letterSpacing:".4em" }}>MENGHITUNG HARI</p>
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
                          {[{v:cd.d,l:"Hari"},{v:cd.h,l:"Jam"},{v:cd.m,l:"Menit"},{v:cd.s,l:"Detik"}].map((x,i)=>(
                            <div key={x.l} className="relative overflow-hidden text-center py-5 sm:py-7"
                              style={{ background:`linear-gradient(160deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}30`, boxShadow:`0 8px 28px rgba(192,144,80,.08)` }}>
                              <div className="absolute inset-x-0 top-0 h-[2px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }}/>
                              <div className="absolute inset-x-0 bottom-0 h-[1px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}22,transparent)` }}/>
                              <AnimatePresence mode="popLayout">
                                <motion.span key={x.v}
                                  initial={{ y:-16,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:16,opacity:0 }}
                                  transition={{ duration:.28,ease:[0.22,1,0.36,1] }}
                                  className="fd block" style={{ fontSize:"clamp(26px,6vw,38px)",color:G.deep,fontWeight:300,lineHeight:1 }}>
                                  {String(x.v).padStart(2,"0")}
                                </motion.span>
                              </AnimatePresence>
                              <span className="fb block mt-1.5" style={{ fontSize:"clamp(7px,1.8vw,9px)",color:G.gold,letterSpacing:".18em" }}>
                                {x.l.toUpperCase()}
                              </span>
                              {/* Corner dots */}
                              <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full opacity-40" style={{ background:G.gold }}/>
                              <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full opacity-40" style={{ background:G.gold }}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Reveal>

                    {/* Event cards — full redesign with image backgrounds */}
                    <div className="space-y-5 mb-14">
                      {[
                        {
                          title:"Akad Nikah", sub:"Ijab Kabul",
                          img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&q=85&fit=crop",
                          data:W.akad, icon:"🕌",
                        },
                        {
                          title:"Resepsi Pernikahan", sub:"Walimatul 'Ursy",
                          img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&q=85&fit=crop",
                          data:W.resepsi, icon:"🌸",
                        },
                      ].map((ev,i)=>(
                        <Reveal key={ev.title} delay={i*.14}>
                          <div className="hover-lift relative overflow-hidden"
                            style={{ border:`1px solid ${G.gold}28`, boxShadow:`0 12px 48px rgba(192,144,80,.1)` }}>
                            {/* Top image strip */}
                            <div className="relative h-36 overflow-hidden">
                              <img src={ev.img} alt={ev.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"/>
                              <div className="absolute inset-0"
                                style={{ background:"linear-gradient(to bottom,rgba(26,21,17,.3) 0%,rgba(26,21,17,.75) 100%)" }}/>
                              <div className="absolute inset-x-0 bottom-0 h-[1.5px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }}/>
                              {/* Overlay title */}
                              <div className="absolute inset-0 flex flex-col justify-end px-5 pb-4">
                                <p className="fb text-[8px] font-semibold mb-1" style={{ color:G.goldL,letterSpacing:".28em" }}>{ev.sub.toUpperCase()}</p>
                                <h3 className="fd font-normal" style={{ fontSize:"clamp(20px,4vw,26px)",color:G.ivory,lineHeight:1.2 }}>{ev.title}</h3>
                              </div>
                              {/* Corner ornaments */}
                              <div className="absolute top-2 right-2 opacity-60"><Corner pos="tr"/></div>
                            </div>

                            {/* Content */}
                            <div className="px-5 py-5" style={{ background:G.ivory }}>
                              <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-[2px] h-4 rounded-full" style={{ background:G.gold }}/>
                                    <p className="fb text-xs font-semibold" style={{ color:G.deep }}>{ev.data.time}</p>
                                  </div>
                                  <p className="fd italic text-base mb-0.5" style={{ color:G.deep }}>{ev.data.place}</p>
                                  <p className="fb text-xs" style={{ color:G.muted }}>{ev.data.addr}</p>
                                </div>
                                <Magnetic href={ev.data.maps}
                                  className="fb inline-flex items-center gap-2 text-[9px] font-semibold px-5 py-2.5 shrink-0"
                                  style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`,color:G.ivory,letterSpacing:".1em", boxShadow:`0 6px 20px ${G.gold}30` }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                  LIHAT LOKASI
                                </Magnetic>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>

                    {/* Dress code */}
                    <Reveal>
                      <div className="relative overflow-hidden"
                        style={{ background:`linear-gradient(150deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}28`, boxShadow:`0 8px 40px rgba(192,144,80,.07)` }}>
                        <div className="absolute inset-x-0 top-0 h-[2px]"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}55,transparent)` }}/>
                        <div className="p-6 sm:p-8">
                          <div className="text-center mb-7">
                            <SecLabel>DRESS CODE</SecLabel>
                            <h3 className="fd font-normal gsap-title" style={{ fontSize:"clamp(20px,3.5vw,26px)",color:G.deep }}>Tata Busana</h3>
                            <p className="fb text-xs mt-2" style={{ color:G.muted }}>Mohon kenakan warna busana berikut</p>
                          </div>
                          <div className="flex gap-5 sm:gap-7 justify-center flex-wrap">
                            {W.dressCode.map((d,i)=>(
                              <motion.div key={d.label}
                                initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }}
                                viewport={{ once:true }} transition={{ delay:i*.09,duration:.7 }}
                                whileHover={{ y:-6 }} className="text-center group">
                                <div className="relative mb-3">
                                  <motion.div whileHover={{ scale:1.14 }}
                                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto shadow-lg"
                                    style={{ background:d.color,border:`2px solid ${G.gold}28`,
                                      boxShadow:`0 8px 24px ${d.color}66` }}/>
                                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full" style={{ border:`1.5px solid ${G.gold}`, boxShadow:`0 0 8px ${G.gold}66` }}/>
                                  </div>
                                </div>
                                <p className="fb text-[10px] font-semibold" style={{ color:G.deep }}>{d.label}</p>
                                <p className="fb text-[9px] mt-0.5" style={{ color:G.muted }}>{d.for}</p>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-6 pt-5" style={{ borderTop:`1px dashed ${G.gold}28` }}>
                            <p className="fd italic text-center text-sm" style={{ color:G.muted }}>Hindari warna putih &amp; hitam penuh ✦</p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave divider 2 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 10 Q300 60 600 30 Q900 0 1200 50 L1200 60 L0 60 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ GALERI ══ */}
                <section id="galeri" className="relative py-20 sm:py-28 overflow-hidden" style={{ background:G.deep }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 70% 50% at 50% 100%,${G.gold}05,transparent 60%)` }}/>
                  <div className="text-center mb-12 sm:mb-16 px-5">
                    <SecLabel dark>OUR GALLERY</SecLabel>
                    <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                      style={{ fontSize:"clamp(30px,5.5vw,50px)",color:G.ivory,lineHeight:1.2 }}>
                      Momen Kami
                    </AnimHeading>
                    <Reveal delay={.2}>
                      <div className="flex justify-center mt-6 mb-3">
                        <FloralDivider/>
                      </div>
                    </Reveal>
                    <Reveal delay={.25}>
                      <p className="fd italic text-sm mt-1" style={{ color:`${G.ivory}40` }}>Geser atau seret untuk melihat semua foto</p>
                    </Reveal>
                  </div>
                  <Gallery onOpen={i=>openLb(i)}/>
                </section>

                {/* Wave divider 3 */}
                <div style={{ background:G.deep, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 50 Q300 0 600 30 Q900 60 1200 15 L1200 60 L0 60 Z" fill={G.ivory}/>
                  </svg>
                </div>

                {/* ══ HADIAH ══ */}
                <section className="relative px-5 sm:px-14 py-20 sm:py-28 overflow-hidden" style={{ background:G.ivory }}>
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-12">
                      <SecLabel>AMPLOP DIGITAL</SecLabel>
                      <AnimHeading delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(28px,5vw,44px)",color:G.deep,lineHeight:1.2 }}>
                        Hadiah &amp; Doa
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-6 mb-5">
                          <FloralDivider/>
                        </div>
                      </Reveal>
                      <Reveal delay={.25}>
                        <p className="fd italic text-sm px-2" style={{ color:G.muted }}>
                          Kehadiran dan doa restu Anda adalah hadiah terbesar. Namun bila berkenan:
                        </p>
                      </Reveal>
                    </div>

                    <div className="space-y-4 mb-7">
                      {W.bank.map((b,i)=>(
                        <Reveal key={b.no} delay={i*.12}>
                          <TiltCard>
                            <div className="relative overflow-hidden"
                              style={{ background:`linear-gradient(135deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}40`,
                                boxShadow:`0 12px 40px rgba(192,144,80,.1)` }}>
                              <div className="absolute inset-x-0 top-0 h-[2px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}70,transparent)` }}/>
                              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background:b.accent, opacity:.7 }}/>
                              <div className="absolute top-3 right-3 w-8 h-8 rounded-full opacity-10" style={{ background:b.accent }}/>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 pl-6">
                                <div>
                                  <p className="fb text-[8px] font-semibold mb-1.5" style={{ color:G.gold,letterSpacing:".28em" }}>{b.name.toUpperCase()}</p>
                                  <p className="fd font-medium break-all" style={{ fontSize:"clamp(22px,5.5vw,30px)",color:G.deep,letterSpacing:".04em" }}>{b.no}</p>
                                  <p className="fb text-xs mt-1" style={{ color:G.muted }}>a.n. <span style={{ color:G.deep }}>{b.an}</span></p>
                                </div>
                                <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:.95 }}
                                  onClick={()=>copyBank(b.no)}
                                  className="fb shrink-0 self-start sm:self-center px-6 py-2.5 text-[9px] font-semibold transition-all duration-300"
                                  style={{ background:copied===b.no?G.gold:"transparent",color:copied===b.no?G.ivory:G.gold,
                                    border:`1px solid ${copied===b.no?G.gold:G.gold+"55"}`,letterSpacing:".12em",minWidth:88,
                                    boxShadow:copied===b.no?`0 6px 20px ${G.gold}40`:"none" }}>
                                  {copied===b.no?"✓ COPIED":"SALIN"}
                                </motion.button>
                              </div>
                            </div>
                          </TiltCard>
                        </Reveal>
                      ))}
                    </div>

                    <Reveal delay={.2}>
                      <div className="mt-5 p-5 sm:p-6 text-center"
                        style={{ border:`1px dashed ${G.gold}38`, background:`${G.cream}` }}>
                        <p className="fb text-[8px] font-semibold mb-1.5" style={{ color:G.gold,letterSpacing:".32em" }}>ATAU KIRIM KE ALAMAT</p>
                        <p className="fd italic text-base mt-2" style={{ color:G.deep }}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                        <p className="fb text-xs mt-0.5" style={{ color:G.muted }}>Jakarta Selatan, 12160</p>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave divider 4 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 50 Q300 0 600 30 Q900 60 1200 15 L1200 60 L0 60 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ RSVP ══ */}
                <section id="rsvp" className="relative py-20 sm:py-28 overflow-hidden" style={{ background:G.deep }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 80% 60% at 50% 0%,${G.gold}07,transparent 55%)` }}/>
                  <div className="px-5 sm:px-14">
                    <div className="text-center mb-12">
                      <SecLabel dark>RSVP</SecLabel>
                      <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(30px,5.5vw,48px)",color:G.ivory,lineHeight:1.2 }}>
                        Ucapan &amp; Doa
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-6 mb-2">
                          <FloralDivider/>
                        </div>
                      </Reveal>
                      <Reveal delay={.25}>
                        <p className="fd italic text-sm mt-3" style={{ color:`${G.ivory}45` }}>Sampaikan ucapan terbaik Anda untuk kami</p>
                      </Reveal>
                    </div>

                    <div className="max-w-lg mx-auto">
                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div key="ok"
                            initial={{ opacity:0,scale:.92,y:12 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:.95 }}
                            transition={{ duration:.5,ease:[0.22,1,0.36,1] }}
                            className="text-center py-16" style={{ border:`1px solid ${G.gold}44`, background:`rgba(192,144,80,.05)` }}>
                            <div className="absolute inset-x-0 top-0 h-[1.5px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}60,transparent)` }}/>
                            <p className="fs mb-3 float" style={{ fontSize:64,color:G.gold,lineHeight:1 }}>✉</p>
                            <p className="fd text-2xl mb-2" style={{ color:G.ivory }}>Terima Kasih</p>
                            <p className="fb text-xs" style={{ color:`${G.ivory}45` }}>Ucapan Anda telah tersimpan dengan indah</p>
                            <div className="flex justify-center mt-6">
                              <FloralDivider/>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.form key="form"
                            initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                            transition={{ duration:.6,ease:[0.22,1,0.36,1] }}
                            onSubmit={submitRsvp}
                            className="relative mb-7"
                            style={{ background:"rgba(255,252,247,.05)", border:`1px solid ${G.gold}30`,
                              backdropFilter:"blur(4px)", WebkitBackdropFilter:"blur(4px)" }}>
                            <div className="absolute inset-x-0 top-0 h-[2px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}55,transparent)` }}/>
                            <div className="p-6 sm:p-8 space-y-3">
                              <input required value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})}
                                placeholder="Nama Anda" className="fb w-full px-4 py-3.5 text-sm"
                                style={{ background:"rgba(255,252,247,.06)",border:`1px solid ${G.gold}30`,color:G.ivory, letterSpacing:".02em" }}/>
                              <select value={form.hadir} onChange={e=>setForm({...form,hadir:e.target.value})}
                                className="fb w-full px-4 py-3.5 text-sm"
                                style={{ background:"rgba(26,21,17,.92)",border:`1px solid ${G.gold}30`,color:G.ivory }}>
                                <option value="Hadir">✓ Insya Allah Hadir</option>
                                <option value="Tidak Hadir">✗ Belum Bisa Hadir</option>
                              </select>
                              <textarea required rows={4} value={form.ucapan} onChange={e=>setForm({...form,ucapan:e.target.value})}
                                placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                                className="fb w-full px-4 py-3.5 text-sm resize-none"
                                style={{ background:"rgba(255,252,247,.06)",border:`1px solid ${G.gold}30`,color:G.ivory, letterSpacing:".02em" }}/>
                              <motion.button type="submit"
                                whileHover={{ scale:1.015 }} whileTap={{ scale:.98 }}
                                className="fb w-full py-4 text-[10px] font-semibold mt-2"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldL})`,color:G.ivory,
                                  letterSpacing:".16em", boxShadow:`0 10px 32px ${G.gold}40` }}>
                                ✉ &ensp; KIRIM UCAPAN
                              </motion.button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* RSVP list */}
                      {rsvps.length > 0 && (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          <AnimatePresence>
                            {rsvps.map(r=>(
                              <motion.div key={r.ts} layout
                                initial={{ opacity:0,x:-16,y:8 }} animate={{ opacity:1,x:0,y:0 }} exit={{ opacity:0 }}
                                transition={{ duration:.45,ease:[0.22,1,0.36,1] }}
                                className="relative p-4 sm:p-5"
                                style={{ background:"rgba(255,252,247,.04)",border:`1px solid ${G.gold}1E` }}>
                                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-r"
                                  style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}60,${G.gold}00)` }}/>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                      style={{ background:`${G.gold}20`, border:`1px solid ${G.gold}35` }}>
                                      <span className="fd italic text-sm" style={{ color:G.gold }}>{r.nama[0]}</span>
                                    </div>
                                    <p className="fd text-base font-medium" style={{ color:G.ivory }}>{r.nama}</p>
                                  </div>
                                  <span className="fb text-[8px] font-semibold px-2.5 py-1 shrink-0"
                                    style={{ background:r.hadir==="Hadir"?`${G.gold}22`:`${G.rose}18`,
                                      color:r.hadir==="Hadir"?G.gold:G.rose,
                                      border:`1px solid ${r.hadir==="Hadir"?G.gold+"40":G.rose+"40"}`,letterSpacing:".1em" }}>
                                    {r.hadir==="Hadir"?"✓ HADIR":"✕ BERHALANGAN"}
                                  </span>
                                </div>
                                <p className="fb text-xs leading-relaxed italic pl-9" style={{ color:`${G.ivory}52` }}>{r.ucapan}</p>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                      {rsvps.length===0 && !submitted && (
                        <p className="fb text-center text-[11px] italic py-5" style={{ color:`${G.ivory}35` }}>
                          Belum ada ucapan. Jadilah yang pertama ✦
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ══ PENUTUP ══ */}
                <section className="relative px-5 sm:px-14 py-24 sm:py-36 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 140% 60% at 50% -5%,${G.rose}52,transparent 52%),${G.ivory}` }}/>
                  {/* Large background ornament */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none float-slow" style={{ opacity:.07 }}>
                    <OrnamentRing size={420}/>
                  </div>
                  <div className="absolute bottom-5 left-5 opacity-12 hidden sm:block"><Corner pos="bl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-12 hidden sm:block"><Corner pos="br"/></div>
                  <div className="absolute top-5 left-5 opacity-8 hidden sm:block"><Corner pos="tl"/></div>
                  <div className="absolute top-5 right-5 opacity-8 hidden sm:block"><Corner pos="tr"/></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <Reveal>
                      <p className="fb text-[9px] font-semibold mb-8" style={{ color:G.gold,letterSpacing:".55em" }}>TERIMA KASIH</p>
                    </Reveal>

                    <div className="overflow-hidden mb-2">
                      <motion.span initial={{ y:"110%",opacity:0 }} whileInView={{ y:"0%",opacity:1 }}
                        viewport={{ once:true }} transition={{ duration:1.1,ease:[0.22,1,0.36,1] }}
                        className="fs gshim block" style={{ fontSize:"clamp(48px,10vw,80px)",lineHeight:1.15 }}>
                        Jazakumullah Khairan
                      </motion.span>
                    </div>

                    <Reveal delay={.14}>
                      <div className="flex justify-center my-9">
                        <FloralDivider/>
                      </div>
                    </Reveal>

                    <Reveal delay={.18}>
                      <p className="fd italic leading-[2.05] mb-9 px-2" style={{ fontSize:"clamp(13px,2.2vw,16px)",color:G.muted }}>
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                        berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                      </p>
                    </Reveal>

                    <Reveal delay={.24}>
                      <p className="fd italic text-sm mb-2" style={{ color:G.muted }}>Kami yang berbahagia,</p>
                      <motion.h3 animate={{ opacity:[.88,1,.88] }} transition={{ duration:3.2,repeat:Infinity }}
                        className="fs" style={{ fontSize:"clamp(42px,8.5vw,62px)",color:G.deep }}>
                        {W.bride} &amp; {W.groom}
                      </motion.h3>
                    </Reveal>

                    <Reveal delay={.3}>
                      <div className="flex justify-center my-9">
                        <FloralDivider/>
                      </div>
                      <Magnetic
                        href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}.`)}`}
                        className="fb inline-flex items-center gap-2.5 px-8 py-3.5 text-[10px] font-semibold"
                        style={{ background:"#25D366",color:"#fff",letterSpacing:".12em", boxShadow:"0 8px 28px rgba(37,211,102,.3)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        BAGIKAN KE WHATSAPP
                      </Magnetic>
                    </Reveal>

                    <p className="fb text-[9px] mt-14" style={{ color:G.gold,opacity:.28,letterSpacing:".35em" }}>✦ MADE WITH LOVE ✦ 2024 ✦</p>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ─ Music button ─ */}
          {opened && (
            <>
              <audio ref={audioRef} src={W.music[0]} loop preload="none"
                onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
              <motion.button
                initial={{ scale:0,opacity:0 }} animate={{ scale:1,opacity:1 }}
                transition={{ type:"spring",stiffness:200,delay:.7 }}
                whileHover={{ scale:1.14 }} whileTap={{ scale:.88 }}
                onClick={toggleMusic} aria-label={playing?"Pause music":"Play music"}
                className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[70] w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldL})`, width:52, height:52,
                  boxShadow:`0 10px 36px rgba(192,144,80,.55),0 0 0 1px ${G.gold}44` }}>
                {playing
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="vspin"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity=".4"/><circle cx="12" cy="12" r="3" fill="white"/><path d="M6 12a6 6 0 016-6" stroke="white" strokeWidth="1" fill="none" opacity=".55"/><path d="M18 12a6 6 0 01-6 6" stroke="white" strokeWidth="1" fill="none" opacity=".55"/></svg>
                  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
                }
              </motion.button>
            </>
          )}

          {/* ─ Lightbox ─ */}
          <AnimatePresence>
            {lightbox !== null && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                onClick={()=>setLightbox(null)}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-10 gap-4"
                style={{ background:"rgba(26,21,17,.94)",backdropFilter:"blur(22px)",WebkitBackdropFilter:"blur(22px)" }}>
                <motion.div
                  initial={{ scale:.86,opacity:0,y:24 }} animate={{ scale:1,opacity:1,y:0 }} exit={{ scale:.88,opacity:0 }}
                  transition={{ type:"spring",stiffness:240,damping:26 }}
                  onClick={e=>e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{ maxWidth:400,width:"100%",aspectRatio:"3/4",
                    boxShadow:`0 48px 96px rgba(0,0,0,.65),0 0 0 1px ${G.gold}40` }}>
                  <AnimatePresence mode="wait">
                    <motion.img key={lightbox}
                      initial={{ opacity:0,x:lbDir*36 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:lbDir*-36 }}
                      transition={{ duration:.4,ease:[0.22,1,0.36,1] }}
                      src={W.gallery[lightbox].src} alt={W.gallery[lightbox].label} className="w-full h-full object-cover"/>
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 py-6 px-5"
                    style={{ background:"linear-gradient(to top,rgba(26,21,17,.92),transparent)" }}>
                    <p className="fd italic text-lg" style={{ color:G.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[9px] mt-1 font-semibold" style={{ color:G.goldL,letterSpacing:".14em" }}>
                      {String(lightbox+1).padStart(2,"0")} / {W.gallery.length}
                    </p>
                  </div>
                  <div className="absolute top-3 left-3 opacity-40 pointer-events-none"><Corner pos="tl"/></div>
                  <button onClick={()=>setLightbox(null)} aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center fb text-sm font-semibold rounded-full"
                    style={{ background:"rgba(255,252,247,.18)",color:G.ivory,backdropFilter:"blur(8px)" }}>✕</button>
                  {lightbox > 0 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(-1); setLightbox(lightbox-1); }}
                      aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-2xl rounded-full"
                      style={{ background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(6px)" }}>‹</button>
                  )}
                  {lightbox < W.gallery.length-1 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(1); setLightbox(lightbox+1); }}
                      aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-2xl rounded-full"
                      style={{ background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(6px)" }}>›</button>
                  )}
                </motion.div>

                {/* Thumbnail strip */}
                <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:.18 }}
                  onClick={e=>e.stopPropagation()}
                  className="flex gap-2 px-4 py-2.5 flex-wrap justify-center max-w-sm rounded-sm"
                  style={{ background:"rgba(26,21,17,.6)",backdropFilter:"blur(10px)" }}>
                  {W.gallery.map((_,i)=>(
                    <button key={i} onClick={e=>{ e.stopPropagation(); setLbDir(i>lightbox!?1:-1); setLightbox(i); }}
                      aria-label={`Photo ${i+1}`}
                      className="overflow-hidden transition-all duration-350 shrink-0 rounded-sm"
                      style={{ width:i===lightbox?42:30,height:42,opacity:i===lightbox?1:.42,
                        outline:i===lightbox?`1.5px solid ${G.gold}`:undefined,
                        outlineOffset:i===lightbox?"1px":undefined }}>
                      <img src={W.gallery[i].src.replace("w=900","w=120")} alt="" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </>
  );
}
