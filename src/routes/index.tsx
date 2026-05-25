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
  goldXL:"#F0D090",
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
      <circle cx="110" cy="110" r="75" stroke={G.gold} strokeWidth=".3" strokeDasharray="2 8" opacity=".5"/>
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
      {[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map((deg,i)=>{
        const r = 75, a = deg*Math.PI/180;
        const x = 110+r*Math.cos(a), y = 110+r*Math.sin(a);
        return <circle key={i} cx={x} cy={y} r="1.2" fill={G.gold} opacity=".35"/>;
      })}
    </svg>
  );
}

function FloralDivider({ flip=false, light=false }: { flip?:boolean; light?:boolean }) {
  const c = light ? G.goldL : G.gold;
  return (
    <svg viewBox="0 0 440 44" fill="none" style={{ width:"100%", maxWidth:420, display:"block", transform: flip?"scaleX(-1)":"none" }}>
      <line x1="0" y1="22" x2="170" y2="22" stroke={c} strokeWidth=".5" opacity=".35"/>
      <line x1="270" y1="22" x2="440" y2="22" stroke={c} strokeWidth=".5" opacity=".35"/>
      <circle cx="220" cy="22" r="5.5" stroke={c} strokeWidth=".9" opacity=".75"/>
      <circle cx="220" cy="22" r="2.2" fill={c} opacity=".75"/>
      <path d="M193 22 Q203 11 213 22 Q203 33 193 22Z" fill={c} opacity=".3"/>
      <path d="M247 22 Q237 11 227 22 Q237 33 247 22Z" fill={c} opacity=".3"/>
      <path d="M183 22 Q188 15 193 22 Q188 29 183 22Z" fill={c} opacity=".2"/>
      <path d="M257 22 Q252 15 247 22 Q252 29 257 22Z" fill={c} opacity=".2"/>
      <circle cx="175" cy="22" r="1.8" fill={c} opacity=".55"/>
      <circle cx="265" cy="22" r="1.8" fill={c} opacity=".55"/>
      <circle cx="163" cy="22" r="1.2" fill={c} opacity=".3"/>
      <circle cx="277" cy="22" r="1.2" fill={c} opacity=".3"/>
      <circle cx="152" cy="22" r=".8" fill={c} opacity=".2"/>
      <circle cx="288" cy="22" r=".8" fill={c} opacity=".2"/>
    </svg>
  );
}

function Corner({ pos, size=56 }: { pos:"tl"|"tr"|"bl"|"br"; size?:number }) {
  const deg = { tl:0, tr:90, br:180, bl:270 };
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={{ transform:`rotate(${deg[pos]}deg)` }}>
      <path d="M4 4 Q4 28 28 28" stroke={G.gold} strokeWidth=".8" opacity=".5" fill="none"/>
      <path d="M4 4 Q28 4 28 28" stroke={G.gold} strokeWidth=".8" opacity=".5" fill="none"/>
      <circle cx="4" cy="4" r="2.5" fill={G.gold} opacity=".6"/>
      <circle cx="28" cy="4" r="1.2" fill={G.gold} opacity=".35"/>
      <circle cx="4" cy="28" r="1.2" fill={G.gold} opacity=".35"/>
      <path d="M4 4 L14 4" stroke={G.gold} strokeWidth=".5" opacity=".35"/>
      <path d="M4 4 L4 14" stroke={G.gold} strokeWidth=".5" opacity=".35"/>
    </svg>
  );
}

function DiamondDot() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 0L10 5L5 10L0 5Z" fill={G.gold} opacity=".7"/>
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
            initial={{ y:"115%", opacity:0 }}
            whileInView={{ y:"0%", opacity:1 }}
            viewport={{ once:true, amount:0.8 }}
            transition={{ duration:0.8, delay: delay + i * 0.09, ease:[0.22,1,0.36,1] }}
            style={{ display:"inline-block" }}
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
    ry.set(x * 9);
    rx.set(-y * 9);
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
    x.set((e.clientX - r.left - r.width/2) * 0.3);
    y.set((e.clientY - r.top - r.height/2) * 0.3);
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
      initial={{ opacity:0, y:28 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.1 }}
      transition={{ duration:0.95, delay, ease:[0.22,1,0.36,1] }}
      className={className} style={style}
    >
      {children}
    </motion.div>
  );
}

/* Gold gradient line */
function GLine({ className="w-16 mx-auto" }: { className?:string }) {
  return <div className={`h-px ${className}`} style={{ background:`linear-gradient(to right,transparent,${G.gold}99,transparent)` }} />;
}

/* Section label */
function SecLabel({ children, dark=false }: { children:string; dark?:boolean }) {
  return (
    <Reveal>
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="h-px w-10 opacity-45" style={{ background: dark ? G.goldL : G.gold }}/>
        <DiamondDot/>
        <p className="fb text-[8.5px] font-semibold" style={{ color: dark ? G.goldL : G.gold, letterSpacing:".6em" }}>{children}</p>
        <DiamondDot/>
        <div className="h-px w-10 opacity-45" style={{ background: dark ? G.goldL : G.gold }}/>
      </div>
    </Reveal>
  );
}

/* Bokeh ambient orbs */
function BokehBg({ dark=false }: { dark?:boolean }) {
  const orbs = useMemo(() => [
    { x:"12%", y:"20%", s:180, delay:0, dur:8 },
    { x:"78%", y:"15%", s:120, delay:1.5, dur:10 },
    { x:"55%", y:"70%", s:200, delay:0.8, dur:12 },
    { x:"25%", y:"75%", s:140, delay:2.2, dur:9 },
    { x:"88%", y:"60%", s:100, delay:0.3, dur:11 },
  ], []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((o,i)=>(
        <motion.div key={i}
          animate={{ scale:[1,1.18,1], opacity:[.4,1,.4] }}
          transition={{ duration:o.dur, repeat:Infinity, delay:o.delay, ease:"easeInOut" }}
          style={{
            position:"absolute", left:o.x, top:o.y, width:o.s, height:o.s,
            borderRadius:"50%",
            background: dark
              ? `radial-gradient(circle,${G.gold}18 0%,transparent 70%)`
              : `radial-gradient(circle,${G.rose}25 0%,transparent 70%)`,
            filter:"blur(32px)", transform:"translate(-50%,-50%)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── LOADER ─── */
function Loader({ onDone }: { onDone:()=>void }) {
  const el = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(".ldr-tag",  { opacity:1, letterSpacing:"0.58em", duration:1.2, ease:"power2.out" })
      .to(".ldr-a",    { opacity:1, y:0, duration:1.1, ease:"expo.out" }, "-=0.6")
      .to(".ldr-amp",  { opacity:1, scale:1, duration:0.6, ease:"back.out(2.5)" }, "-=0.55")
      .to(".ldr-f",    { opacity:1, y:0, duration:1.1, ease:"expo.out" }, "-=0.6")
      .to(".ldr-date", { opacity:1, duration:0.8 }, "-=0.35")
      .to(".ldr-ring", { opacity:.32, scale:1, duration:1.4, ease:"power2.out" }, "-=1.4")
      .to(".ldr-ring2",{ opacity:.15, scale:1, duration:1.8, ease:"power2.out" }, "-=1.6")
      .to(".ldr-fill", { scaleX:1, duration:1.6, ease:"power2.inOut" }, "-=0.6")
      .to(el.current,  { opacity:0, duration:1.0, ease:"power2.inOut", delay:0.2 });
  }, { scope: el });

  return (
    <div ref={el} className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{ background:G.deep }}>
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        opacity:.03, mixBlendMode:"overlay"
      }}/>
      <div className="absolute pointer-events-none ldr-ring2" style={{ opacity:0, transform:"scale(.5)" }}>
        <OrnamentRing size={360} opacity={1}/>
      </div>
      <div className="absolute pointer-events-none ldr-ring" style={{ opacity:0, transform:"scale(.65)" }}>
        <OrnamentRing size={260} opacity={1}/>
      </div>
      <div className="text-center px-6 relative">
        <p className="ldr-tag fb text-[8.5px] font-semibold mb-10" style={{ color:G.goldL, opacity:0, letterSpacing:"0.1em" }}>
          UNDANGAN PERNIKAHAN
        </p>
        <div className="flex items-center justify-center gap-6">
          <span className="ldr-a fs" style={{ fontSize:"clamp(68px,15vw,108px)", color:G.ivory, lineHeight:1, opacity:0, transform:"translateY(36px)" }}>A</span>
          <span className="ldr-amp fd italic" style={{ fontSize:"clamp(30px,5.5vw,46px)", color:G.goldL, lineHeight:1, opacity:0, transform:"scale(0.3)" }}>&amp;</span>
          <span className="ldr-f fs" style={{ fontSize:"clamp(68px,15vw,108px)", color:G.ivory, lineHeight:1, opacity:0, transform:"translateY(36px)" }}>F</span>
        </div>
        <p className="ldr-date fd italic mt-6" style={{ fontSize:"clamp(12px,2vw,15px)", color:`${G.ivory}55`, opacity:0 }}>
          27 · 04 · 2024
        </p>
        <div className="mt-12 w-48 mx-auto h-[1.5px] overflow-hidden rounded-full" style={{ background:`${G.ivory}14` }}>
          <div className="ldr-fill h-full origin-left scale-x-0 rounded-full"
            style={{ background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldL},${G.goldD})` }} />
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
    <motion.div className="fixed top-0 left-0 right-0 z-[60] origin-left h-[2.5px]"
      style={{ scaleX, background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD})` }} />
  );
}

/* ─── CURSOR ─── */
function Cursor() {
  const cx = useMotionValue(-100); const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness:260, damping:26 });
  const sy = useSpring(cy, { stiffness:260, damping:26 });
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
    return () => {
      window.removeEventListener("mousemove",mv); window.removeEventListener("mouseover",mo);
      window.removeEventListener("mouseout",mu); window.removeEventListener("mousedown",md); window.removeEventListener("mouseup",mup);
    };
  }, []);

  return (
    <motion.div className="fixed z-[199] pointer-events-none hidden lg:flex items-center justify-center"
      style={{ x:sx, y:sy, marginLeft:"-20px", marginTop:"-20px" }}>
      <motion.div className="rounded-full"
        animate={{ width:click?6:hov?48:13, height:click?6:hov?48:13, background:hov?`rgba(192,144,80,0)`:G.gold, border:hov?`1.5px solid ${G.gold}`:"1.5px solid rgba(192,144,80,0)", opacity:hov?0.65:0.92 }}
        transition={{ type:"spring", stiffness:320, damping:28 }}
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
    const start = () => { timer.current = setInterval(() => emblaApi.scrollNext(), 3600); };
    const stop  = () => { if (timer.current) { clearInterval(timer.current); timer.current=null; } };
    start();
    emblaApi.on("pointerDown", stop);
    emblaApi.on("pointerUp", () => { stop(); start(); });
    return () => stop();
  }, [emblaApi]);

  return (
    <div>
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background:`linear-gradient(to right,${G.deep},transparent)` }}/>
        <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
          style={{ background:`linear-gradient(to left,${G.deep},transparent)` }}/>
        <div ref={emblaRef} className="overflow-hidden select-none embla-wrap">
          <div className="flex gap-4 sm:gap-5 pl-6 sm:pl-12">
            {W.gallery.map((ph,i) => (
              <motion.button key={i}
                initial={{ opacity:0, scale:.9, y:20 }}
                whileInView={{ opacity:1, scale:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay:Math.min(i*.07,.35), duration:.9, ease:[0.22,1,0.36,1] }}
                onClick={() => onOpen(i)}
                className="relative overflow-hidden shrink-0 group gallery-card"
                style={{ width:"clamp(210px,28vw,320px)", aspectRatio:"3/4",
                  boxShadow:`0 28px 60px rgba(26,21,17,.45)` }}
              >
                <img src={ph.src} alt={ph.label} className="gallery-img w-full h-full object-cover"/>
                {/* Gradient */}
                <div className="absolute inset-0 transition-opacity duration-500"
                  style={{ background:"linear-gradient(to top,rgba(26,21,17,.95) 0%,rgba(26,21,17,.15) 55%,transparent 100%)" }}/>
                {/* Gold hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background:`radial-gradient(ellipse at center,${G.gold}14,transparent 65%)` }}/>
                {/* Top shimmer on hover */}
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600"
                  style={{ background:`linear-gradient(to right,transparent,${G.goldL},transparent)` }}/>
                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 py-5 px-5 flex flex-col gap-1">
                  <p className="fd italic text-base transition-transform duration-400 group-hover:-translate-y-1.5" style={{ color:G.ivory }}>{ph.label}</p>
                  <p className="fb text-[7.5px] font-semibold" style={{ color:G.goldL, letterSpacing:".16em", opacity:.8 }}>
                    {String(i+1).padStart(2,"0")} / {W.gallery.length}
                  </p>
                </div>
                {/* Center overlay button */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-400">
                  <motion.span
                    initial={{ scale:.8 }} whileHover={{ scale:1.05 }}
                    className="fb text-[8.5px] font-semibold px-6 py-2.5 flex items-center gap-2"
                    style={{ background:"rgba(255,252,247,.1)", color:G.ivory,
                      border:`1px solid ${G.ivory}38`, backdropFilter:"blur(10px)", letterSpacing:".18em" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1l22 22M17 5H9a4 4 0 000 8h3"/><path d="M9.5 14.5A4 4 0 0015 19h3"/><path d="M1 12s4-8 11-8a9.93 9.93 0 014 .8"/><path d="M21.17 21.17C19.36 22.32 17 23 14 23c-7 0-11-8-11-8a21 21 0 014.44-5.56"/></svg>
                    LIHAT FOTO
                  </motion.span>
                </div>
                {/* Corner accent */}
                <div className="absolute top-2.5 left-2.5 opacity-40 pointer-events-none"><Corner pos="tl" size={36}/></div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {W.gallery.map((_,i) => (
          <motion.button key={i} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Foto ${i+1}`}
            animate={{ width:i===sel?32:8, background:i===sel?G.gold:`${G.ivory}25` }}
            transition={{ duration:.35, ease:[0.22,1,0.36,1] }}
            style={{ height:8, borderRadius:4, border:"none", cursor:"pointer", padding:0 }} />
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
  const petals = useMemo(() => Array.from({length:14}).map((_,i) => ({
    id:i, left:(i*7.8)%100, delay:(i*1.5)%11, dur:16+(i%5)*5,
  })), []);

  /* Lenis smooth scroll */
  useEffect(() => {
    if (!opened || typeof window === "undefined") return;
    let lenis: unknown;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ lerp:0.085, smoothWheel:true, wheelMultiplier:0.9, touchMultiplier:1.5 });
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
      { rootMargin:"-35% 0px -55% 0px" }
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
      scrollTrigger:{ trigger:heroRef.current, start:"top top", end:"bottom top", scrub:1.2 }
    });
  }, { dependencies:[opened] });

  /* GSAP text reveal for section headings */
  useGSAP(() => {
    if (!opened) return;
    gsap.utils.toArray<HTMLElement>(".gsap-title").forEach(el => {
      gsap.fromTo(el, { opacity:0, y:44 }, {
        opacity:1, y:0, duration:1.0, ease:"power3.out",
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
        ::-webkit-scrollbar-thumb{background:${G.gold}66;border-radius:2px;}

        @keyframes shimG{0%{background-position:-300% 0}100%{background-position:300% 0}}
        .gshim{background:linear-gradient(90deg,${G.goldD} 0%,${G.gold} 25%,${G.goldXL} 50%,${G.gold} 75%,${G.goldD} 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimG 6s linear infinite;}

        @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${G.gold}70}65%{box-shadow:0 0 0 20px ${G.gold}00}}
        .btn-pulse{animation:pulse2 3s ease-out infinite;}

        @keyframes vSpin{to{transform:rotate(360deg)}}
        .vspin{animation:vSpin 3.5s linear infinite;}

        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .float{animation:floatY 5s ease-in-out infinite;}

        @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(5deg)}}
        .float-slow{animation:floatSlow 8s ease-in-out infinite;}

        @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .rotate-slow{animation:rotateSlow 40s linear infinite;}

        /* Grain overlay */
        #grain{position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.028;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode:overlay;}

        input,select,textarea{font-family:'Montserrat',sans-serif;-webkit-appearance:none;border-radius:0;}
        input::placeholder,textarea::placeholder{color:${G.ivory}40;}
        input:focus,select:focus,textarea:focus{outline:none;box-shadow:0 0 0 1.5px ${G.gold}99!important;}
        select option{background:${G.deep};color:${G.ivory};}

        /* Horizontal marquee */
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-inner{display:flex;animation:marquee 28s linear infinite;width:max-content;}
        .marquee-inner:hover{animation-play-state:paused;}

        /* Gallery */
        .embla-wrap{cursor:grab;}.embla-wrap:active{cursor:grabbing;}
        .gallery-card{transition:box-shadow .5s ease;}
        .gallery-card:hover{box-shadow:0 36px 80px rgba(26,21,17,.6),0 0 0 1px ${G.gold}30!important;}
        .gallery-img{filter:brightness(.88) saturate(1.05);transition:filter .6s ease,transform .8s cubic-bezier(.22,1,.36,1);}
        .gallery-card:hover .gallery-img{filter:brightness(1) saturate(1.12);}

        /* Story timeline */
        @keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 ${G.gold}55}70%{box-shadow:0 0 0 10px ${G.gold}00}}
        .dot-active{animation:dotPulse 2.2s ease-out infinite;}

        /* Countdown */
        @keyframes countFlip{0%{transform:translateY(-100%);opacity:0}100%{transform:translateY(0);opacity:1}}

        /* Nav */
        .nav-item{position:relative;padding-bottom:3px;}
        .nav-item::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:${G.gold};transform:scaleX(0);transform-origin:left;transition:transform .35s ease;}
        .nav-item.active::after{transform:scaleX(1);}

        /* Card hover lift */
        .hover-lift{transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s ease;}
        .hover-lift:hover{transform:translateY(-7px);box-shadow:0 28px 72px rgba(192,144,80,.2)!important;}

        /* Input floating labels */
        .input-group{position:relative;}
        .input-group label{position:absolute;top:50%;left:16px;transform:translateY(-50%);font-size:10px;color:${G.ivory}50;pointer-events:none;transition:all .2s;font-family:'Montserrat',sans-serif;letter-spacing:.08em;}
        .input-group input:not(:placeholder-shown) ~ label,
        .input-group input:focus ~ label{top:8px;transform:none;font-size:8px;color:${G.gold};}

        /* Gold shimmer button */
        @keyframes goldShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .btn-shimmer{background:linear-gradient(90deg,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD});background-size:200% auto;animation:goldShimmer 4s linear infinite;}

        /* RSVP scroll track */
        .rsvp-feed{scrollbar-width:thin;scrollbar-color:${G.gold}44 transparent;}
        .rsvp-feed::-webkit-scrollbar{width:2px;}
        .rsvp-feed::-webkit-scrollbar-thumb{background:${G.gold}55;border-radius:2px;}

        /* RSVP items */
        .rsvp-item{transition:border-color .25s,background .25s;}
        .rsvp-item:hover{border-color:${G.gold}44!important;background:rgba(255,252,247,.06)!important;}

        /* Image lazy fade */
        img{transition:opacity .4s ease;}
        html{scroll-behavior:smooth;}

        /* Mobile nav */
        .nav-pill{position:relative;border-radius:2px;transition:color .2s;}

        /* Hover reveal underline */
        .hover-underline{position:relative;}
        .hover-underline::after{content:'';position:absolute;bottom:-1px;left:0;width:0;height:1px;background:${G.gold};transition:width .3s ease;}
        .hover-underline:hover::after{width:100%;}

        /* Portrait frame */
        .portrait-frame{position:relative;}
        .portrait-frame::before{content:'';position:absolute;inset:8px;border:1px solid ${G.gold}30;pointer-events:none;z-index:2;}

        /* Card glow */
        @keyframes cardGlow{0%,100%{box-shadow:0 12px 40px rgba(192,144,80,.1)}50%{box-shadow:0 16px 56px rgba(192,144,80,.2)}}
        .card-glow{animation:cardGlow 4s ease-in-out infinite;}

        /* Animated border */
        @keyframes borderTrail{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      `}</style>

      <div id="grain" aria-hidden="true" />
      <Cursor />

      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {loaded && (
        <div ref={mainRef} className="w-full min-h-screen relative">

          {/* ════ COVER ════ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div key="cover"
                initial={{ opacity:1 }}
                exit={{ opacity:0, scale:1.04, filter:"blur(12px)" }}
                transition={{ duration:1.3, ease:[0.22,1,0.36,1] }}
                className="fixed inset-0 z-50 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* Left photo panel */}
                <div className="hidden lg:block lg:w-[54%] h-full relative overflow-hidden">
                  <img ref={heroRef}
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90&fit=crop"
                    alt="Wedding" className="w-full object-cover"
                    style={{ height:"118%", marginTop:"-9%", objectPosition:"center" }} loading="eager" />
                  {/* Layered gradients */}
                  <div className="absolute inset-0" style={{ background:"linear-gradient(120deg,rgba(26,21,17,.03),rgba(26,21,17,.7))" }} />
                  <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 60% 80% at 85% 50%,${G.gold}12,transparent 60%)` }}/>
                  {/* Text overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-14">
                    <motion.p initial={{ opacity:0,y:-20,letterSpacing:".1em" }} animate={{ opacity:1,y:0,letterSpacing:".52em" }}
                      transition={{ delay:.5,duration:1.4 }}
                      className="fb text-[8.5px] font-semibold mb-10" style={{ color:`${G.ivory}75` }}>
                      THE WEDDING OF
                    </motion.p>
                    <div className="overflow-hidden">
                      <motion.h1 initial={{ y:"115%", skewY:5 }} animate={{ y:0, skewY:0 }}
                        transition={{ delay:.7,duration:1.2,ease:[0.22,1,0.36,1] }}
                        className="fs block" style={{ fontSize:"clamp(80px,10.5vw,122px)", color:G.ivory, lineHeight:1, textShadow:"0 8px 40px rgba(0,0,0,.5)" }}>
                        {W.bride}
                      </motion.h1>
                    </div>
                    <motion.div initial={{ scaleX:0,opacity:0 }} animate={{ scaleX:1,opacity:1 }}
                      transition={{ delay:1.05,duration:.9 }}
                      className="flex items-center gap-4 my-4">
                      <div className="h-px w-12 opacity-45" style={{ background:G.goldL }}/>
                      <span className="fd italic text-2xl" style={{ color:G.goldL }}>&amp;</span>
                      <div className="h-px w-12 opacity-45" style={{ background:G.goldL }}/>
                    </motion.div>
                    <div className="overflow-hidden">
                      <motion.h1 initial={{ y:"115%", skewY:-5 }} animate={{ y:0, skewY:0 }}
                        transition={{ delay:1.1,duration:1.2,ease:[0.22,1,0.36,1] }}
                        className="fs block" style={{ fontSize:"clamp(80px,10.5vw,122px)", color:G.ivory, lineHeight:1, textShadow:"0 8px 40px rgba(0,0,0,.5)" }}>
                        {W.groom}
                      </motion.h1>
                    </div>
                    <motion.p initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.6,duration:1 }}
                      className="fd italic mt-8" style={{ fontSize:"clamp(14px,1.8vw,20px)", color:`${G.ivory}65` }}>
                      {W.dateText}
                    </motion.p>
                  </div>
                  {/* Corner ornaments */}
                  <div className="absolute top-5 left-5 opacity-55"><Corner pos="tl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-55"><Corner pos="br"/></div>
                  <div className="absolute top-5 right-5 opacity-30"><Corner pos="tr"/></div>
                  <div className="absolute bottom-5 left-5 opacity-30"><Corner pos="bl"/></div>
                </div>

                {/* Right invitation card */}
                <div className="w-full lg:w-[46%] h-full flex items-center justify-center px-5 py-10 sm:px-10 relative overflow-hidden"
                  style={{ background:G.ivory }}>

                  {/* Mobile full-bleed bg */}
                  <div className="lg:hidden absolute inset-0 pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&fit=crop"
                      alt="" className="w-full h-full object-cover object-center"/>
                    <div className="absolute inset-0" style={{ background:`linear-gradient(160deg,rgba(255,252,247,.9) 0%,rgba(255,252,247,.8) 100%)` }}/>
                  </div>

                  {/* Desktop rose gradient */}
                  <div className="hidden lg:block absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 170% 80% at 50% -20%,${G.rose}60 0%,transparent 52%)` }}/>

                  {/* Rotating ornament ring */}
                  <div className="absolute pointer-events-none rotate-slow" style={{ opacity:.06 }}>
                    <OrnamentRing size={360}/>
                  </div>
                  <div className="absolute pointer-events-none float-slow" style={{ opacity:.04, transform:"scale(1.5)" }}>
                    <OrnamentRing size={240}/>
                  </div>

                  {/* Bokeh particles */}
                  {[
                    {t:"7%",l:"7%",c:"✦",s:18,d:0},{t:"9%",l:"87%",c:"✧",s:13,d:.8},
                    {t:"88%",l:"6%",c:"✿",s:15,d:1.6},{t:"86%",l:"86%",c:"❋",s:17,d:2.4},
                    {t:"48%",l:"3%",c:"✦",s:10,d:3.2},{t:"43%",l:"92%",c:"✧",s:12,d:1.4},
                    {t:"30%",l:"95%",c:"✿",s:9,d:2.0},{t:"65%",l:"2%",c:"✦",s:8,d:0.6},
                  ].map((sp,i)=>(
                    <motion.span key={i} aria-hidden="true" className="absolute pointer-events-none select-none"
                      style={{ top:sp.t,left:sp.l,color:G.gold,fontSize:sp.s,opacity:.18 }}
                      animate={{ y:[0,-14,0],opacity:[.1,.3,.1],rotate:[0,20,0] }}
                      transition={{ duration:4.5+i*.6,repeat:Infinity,delay:sp.d }}>{sp.c}</motion.span>
                  ))}

                  <TiltCard style={{ maxWidth:380, width:"100%" }}>
                    <motion.div initial={{ opacity:0,y:32,scale:.95 }} animate={{ opacity:1,y:0,scale:1 }}
                      transition={{ duration:1.3,delay:.25,ease:[0.22,1,0.36,1] }}
                      className="relative w-full text-center">

                      {/* Animated glow border */}
                      <div className="absolute -inset-[1.5px] rounded-sm pointer-events-none"
                        style={{
                          background:`linear-gradient(135deg,${G.goldD}44,${G.gold}88,${G.goldXL}55,${G.gold}44,${G.goldD}33)`,
                          backgroundSize:"300% 300%",
                          animation:"borderTrail 5s ease infinite",
                          filter:"blur(1px)",
                        }}/>

                      <div className="relative px-7 py-10 sm:px-10 sm:py-12"
                        style={{ border:`1px solid ${G.gold}50`, background:"rgba(255,252,247,.88)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}>
                        {/* Top/bottom gold bars */}
                        <div className="absolute inset-x-0 top-0 h-[2px]"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}90,transparent)` }}/>
                        <div className="absolute inset-x-0 bottom-0 h-[1px]"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}50,transparent)` }}/>

                        {/* Inner corner marks */}
                        {(["tl","tr","bl","br"] as const).map((p,i)=>{
                          const pos=p==="tl"?"top-3 left-3":p==="tr"?"top-3 right-3":p==="bl"?"bottom-3 left-3":"bottom-3 right-3";
                          const d=p==="tl"?"M0 12L0 0L12 0":p==="tr"?"M20 12L20 0L8 0":p==="bl"?"M0 8L0 20L12 20":"M20 8L20 20L8 20";
                          return (
                            <div key={i} className={`absolute ${pos} w-[20px] h-[20px]`}>
                              <svg viewBox="0 0 20 20" fill="none" width="20" height="20"><path d={d} stroke={G.gold} strokeWidth="1.2" opacity=".6"/></svg>
                            </div>
                          );
                        })}

                        {/* Mobile names */}
                        <div className="lg:hidden mb-8">
                          <motion.p initial={{ opacity:0,letterSpacing:".1em" }} animate={{ opacity:1,letterSpacing:".46em" }}
                            transition={{ duration:1.3,delay:.3 }} className="fb text-[8.5px] font-semibold mb-5"
                            style={{ color:G.gold }}>THE WEDDING OF</motion.p>
                          <GLine className="w-14 mx-auto mb-5"/>
                          <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:.55,duration:1 }}>
                            <span className="fs gshim block" style={{ fontSize:"clamp(48px,12.5vw,70px)",lineHeight:1 }}>{W.bride}</span>
                            <span className="fd italic block my-2" style={{ color:G.muted,fontSize:20 }}>&amp;</span>
                            <span className="fs gshim block" style={{ fontSize:"clamp(48px,12.5vw,70px)",lineHeight:1 }}>{W.groom}</span>
                          </motion.div>
                          <GLine className="w-14 mx-auto mt-5 mb-4"/>
                          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }}
                            className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</motion.p>
                        </div>

                        {/* Desktop brief */}
                        <div className="hidden lg:block mb-8">
                          <motion.p initial={{ opacity:0,letterSpacing:".1em" }} animate={{ opacity:1,letterSpacing:".44em" }}
                            transition={{ duration:1.3,delay:.28 }} className="fb text-[8.5px] font-semibold mb-4"
                            style={{ color:G.gold }}>UNDANGAN PERNIKAHAN</motion.p>
                          <GLine className="w-16 mx-auto mb-5"/>
                          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.5,duration:1 }}>
                            <span className="fs gshim block" style={{ fontSize:"clamp(42px,6.2vw,62px)",lineHeight:1 }}>{W.bride}</span>
                            <span className="fd italic block my-2" style={{ color:G.muted,fontSize:18 }}>&amp;</span>
                            <span className="fs gshim block" style={{ fontSize:"clamp(42px,6.2vw,62px)",lineHeight:1 }}>{W.groom}</span>
                          </motion.div>
                          <GLine className="w-16 mx-auto mt-5 mb-4"/>
                          <p className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</p>
                        </div>

                        {/* Guest name */}
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.05 }} className="mb-7">
                          <div className="py-3 px-4 relative" style={{ background:`linear-gradient(135deg,${G.cream}80,${G.ivory}60)`, border:`1px solid ${G.gold}20` }}>
                            <div className="absolute inset-x-0 top-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}40,transparent)` }}/>
                            <p className="fb text-[7.5px] font-semibold mb-1.5" style={{ color:G.gold,letterSpacing:".4em" }}>KEPADA YTH.</p>
                            <p className="fb text-[10px] mb-1" style={{ color:G.muted }}>Bpk/Ibu/Saudara/i</p>
                            <p className="fd font-medium" style={{ fontSize:"clamp(18px,4.5vw,23px)",color:G.deep }}>{guest}</p>
                            <p className="fb text-[9px] mt-0.5" style={{ color:G.muted }}>Di Tempat</p>
                          </div>
                        </motion.div>

                        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1.15,duration:.9 }}
                          className="mb-7"><GLine className="w-14 mx-auto"/></motion.div>

                        <Magnetic onClick={openInvitation}
                          className="btn-pulse btn-shimmer fb inline-flex items-center gap-2.5 px-10 py-4 text-[9.5px] font-semibold"
                          style={{ color:G.ivory, letterSpacing:".18em", boxShadow:`0 12px 36px ${G.gold}50` }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                          BUKA UNDANGAN
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
                {petals.map(p=>(
                  <motion.div key={p.id}
                    initial={{ y:"-5%",opacity:0,rotate:0 }}
                    animate={{ y:"108vh",opacity:[0,.16,.16,0],rotate:p.id%2===0?360:-360,x:[0,22,-18,12,0] }}
                    transition={{ duration:p.dur,delay:p.delay,repeat:Infinity,ease:"linear" }}
                    style={{ position:"absolute",left:`${p.left}%`,fontSize:8+p.id%5*2,color:G.gold }}>
                    {p.id%4===0?"✿":p.id%4===1?"❋":p.id%4===2?"✦":"❀"}
                  </motion.div>
                ))}
              </div>

              {/* ── SIDEBAR ── */}
              <aside className="hidden lg:flex lg:w-[28%] xl:w-[26%] 2xl:w-[24%] sticky top-0 h-screen flex-col overflow-hidden shrink-0"
                style={{ borderRight:`1px solid ${G.gold}20` }}>
                <div className="flex-1 relative overflow-hidden min-h-0">
                  <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=88&fit=crop&crop=top"
                    alt="Anis & Fadli" className="w-full object-cover absolute inset-0"
                    style={{ height:"122%", objectPosition:"top center" }} />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(26,21,17,.02) 0%,rgba(26,21,17,.55) 65%,rgba(26,21,17,.88) 100%)" }} />
                  {/* Gold vignette frame */}
                  <div className="absolute inset-0" style={{ boxShadow:`inset 0 0 40px rgba(26,21,17,.3)` }}/>
                  <div className="absolute top-4 left-4 opacity-55"><Corner pos="tl"/></div>
                  <div className="absolute top-4 right-4 opacity-55"><Corner pos="tr"/></div>
                  <div className="absolute bottom-28 left-4 opacity-30"><Corner pos="bl"/></div>
                  <div className="absolute bottom-28 right-4 opacity-30"><Corner pos="br"/></div>
                  <div className="absolute bottom-0 inset-x-0 px-5 pb-3">
                    <p className="fd italic text-xs" style={{ color:`${G.ivory}50` }}>Bersatu dalam cinta sejati</p>
                  </div>
                </div>
                <div className="px-5 py-5 text-center shrink-0" style={{ background:G.ivory, borderTop:`1px solid ${G.gold}28` }}>
                  <p className="fb text-[7.5px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".52em" }}>THE WEDDING OF</p>
                  <div className="flex items-baseline justify-center gap-2 mt-1.5">
                    <span className="fs" style={{ fontSize:38,color:G.deep,lineHeight:1 }}>{W.bride}</span>
                    <span className="fd italic text-lg" style={{ color:G.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize:38,color:G.deep,lineHeight:1 }}>{W.groom}</span>
                  </div>
                  <GLine className="w-10 mx-auto my-3"/>
                  <p className="fd italic text-xs mb-4" style={{ color:G.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>navTo(item.id)}
                        className={`nav-item fb text-[7.5px] font-semibold py-1 transition-colors duration-200 ${activeNav===item.id?"active":""}`}
                        style={{ color:activeNav===item.id?G.gold:G.muted,letterSpacing:".16em" }}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT PANEL ── */}
              <div className="flex-1 min-w-0 overflow-x-hidden" style={{ background:G.ivory }}>

                {/* Mobile nav */}
                <motion.nav initial={{ y:-52,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:.3,ease:[0.22,1,0.36,1] }}
                  className="sticky top-0 z-40 lg:hidden overflow-hidden"
                  style={{ background:"rgba(255,252,247,.96)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderBottom:`1px solid ${G.gold}1E` }}>
                  <div className="flex items-center justify-center py-2.5 gap-0.5 px-2 relative">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>navTo(item.id)}
                        className="fb relative px-2.5 sm:px-4 py-2 text-[7.5px] font-semibold transition-colors duration-200"
                        style={{ color:activeNav===item.id?G.gold:G.muted,letterSpacing:".1em" }}>
                        {item.label.toUpperCase()}
                        {activeNav===item.id&&(
                          <motion.div layoutId="nav-m"
                            className="absolute inset-0 rounded-sm -z-10"
                            style={{ background:`${G.gold}12` }}
                            transition={{ type:"spring",stiffness:380,damping:34 }} />
                        )}
                        {activeNav===item.id&&(
                          <motion.div layoutId="nav-m-line"
                            className="absolute bottom-0 left-2 right-2 h-[1.5px] rounded-full"
                            style={{ background:G.gold }}
                            transition={{ type:"spring",stiffness:380,damping:34 }} />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.nav>

                {/* ══ PEMBUKAAN ══ */}
                <section id="pembukaan" className="relative px-5 sm:px-14 py-24 sm:py-32 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 100% 70% at 50% 0%,${G.rose}40,transparent 55%),${G.ivory}` }} />
                  <BokehBg/>
                  <div className="absolute top-6 left-6 opacity-10 hidden sm:block"><Corner pos="tl"/></div>
                  <div className="absolute top-6 right-6 opacity-10 hidden sm:block"><Corner pos="tr"/></div>
                  {/* Large bg ornament */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rotate-slow" style={{ opacity:.04 }}>
                    <OrnamentRing size={420}/>
                  </div>

                  <div className="text-center max-w-2xl mx-auto relative">
                    {/* Bismillah */}
                    <Reveal>
                      <div className="inline-block relative px-8 py-5 mb-2"
                        style={{ border:`1px solid ${G.gold}28`, background:`linear-gradient(135deg,${G.cream}90,${G.ivory})` }}>
                        <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}60,transparent)` }}/>
                        <div className="absolute inset-x-0 bottom-0 h-[1.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}60,transparent)` }}/>
                        <p className="fd font-light" style={{ fontSize:"clamp(26px,5.5vw,42px)",color:G.deep,letterSpacing:".04em" }}>
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                      </div>
                    </Reveal>

                    <Reveal delay={.08}>
                      <div className="flex justify-center my-8">
                        <FloralDivider/>
                      </div>
                    </Reveal>

                    {/* Quran quote */}
                    <Reveal delay={.14}>
                      <div className="relative px-7 sm:px-12 py-7 mb-3 mx-auto max-w-lg card-glow"
                        style={{ background:`linear-gradient(145deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}22` }}>
                        <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}50,transparent)` }}/>
                        <div className="absolute top-3 left-4 fd italic text-5xl leading-none opacity-12" style={{ color:G.gold }}>"</div>
                        <div className="absolute bottom-3 right-4 fd italic text-5xl leading-none opacity-12" style={{ color:G.gold }}>"</div>
                        <blockquote className="fd italic leading-[2.15] relative z-10"
                          style={{ fontSize:"clamp(13px,2.1vw,15.5px)",color:G.muted }}>
                          Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan
                          dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.
                        </blockquote>
                      </div>
                    </Reveal>

                    <Reveal delay={.2}>
                      <p className="fb text-[8.5px] font-semibold mb-10" style={{ color:G.gold,letterSpacing:".38em" }}>— QS. AR-RUM : 21 —</p>
                    </Reveal>

                    <Reveal delay={.24}>
                      <p className="fd italic text-sm sm:text-base leading-[2.15] mb-16 px-1" style={{ color:G.muted }}>
                        Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan
                        walimatul 'ursy putra-putri kami:
                      </p>
                    </Reveal>

                    {/* Couple portraits */}
                    <div className="flex flex-col sm:flex-row gap-14 sm:gap-0 items-center sm:items-start justify-center relative">
                      {[
                        { img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE BRIDE", name:W.bride, full:W.brideFull, role:"Putri dari", parents:W.brideParents, dx:-40 },
                        { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE GROOM", name:W.groom, full:W.groomFull, role:"Putra dari", parents:W.groomParents, dx:40 },
                      ].map((p,i)=>(
                        <motion.div key={p.name}
                          initial={{ opacity:0,x:p.dx }}
                          whileInView={{ opacity:1,x:0 }}
                          viewport={{ once:true }}
                          transition={{ duration:1.2,delay:i*.18,ease:[0.22,1,0.36,1] }}
                          className="flex-1 text-center w-full max-w-[230px] sm:max-w-[260px] mx-auto"
                        >
                          {/* Portrait with decorative frame */}
                          <motion.div whileHover={{ y:-10,scale:1.025 }} transition={{ duration:.5,ease:[0.22,1,0.36,1] }}
                            className="relative mx-auto mb-6 portrait-frame"
                            style={{ width:"min(175px,45vw)", aspectRatio:"3/4" }}>
                            {/* Outer glow ring */}
                            <div className="absolute -inset-3 rounded-sm opacity-0 hover:opacity-100 transition-opacity duration-500"
                              style={{ background:`radial-gradient(ellipse,${G.gold}20,transparent 70%)` }}/>
                            {/* Double border effect */}
                            <div className="absolute -inset-[5px] rounded-sm"
                              style={{ border:`1px solid ${G.gold}25` }}/>
                            <div className="absolute inset-0 overflow-hidden"
                              style={{ border:`1.5px solid ${G.gold}60`, boxShadow:`0 32px 80px rgba(192,144,80,.25)` }}>
                              <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.06]"/>
                              <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 45%,rgba(26,21,17,.5))" }}/>
                              <div className="absolute inset-x-0 bottom-0 h-[2px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}90,transparent)` }}/>
                              <div className="absolute inset-x-0 top-0 h-[2px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}45,transparent)` }}/>
                            </div>
                            {/* Corner dots */}
                            {[["top-1 left-1"],["top-1 right-1"],["bottom-1 left-1"],["bottom-1 right-1"]].map(([c],j)=>(
                              <div key={j} className={`absolute ${c} w-1.5 h-1.5 rounded-full`} style={{ background:G.gold, opacity:.6 }}/>
                            ))}
                          </motion.div>

                          <p className="fb text-[8px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".36em" }}>{p.lbl}</p>
                          <h2 className="fs" style={{ fontSize:58,color:G.deep,lineHeight:1.05 }}>{p.name}</h2>
                          <p className="fd italic text-sm mt-2 mb-1.5" style={{ color:G.muted }}>{p.full}</p>
                          <GLine className="w-10 mx-auto my-3.5"/>
                          <p className="fb text-[10px]" style={{ color:G.muted }}>{p.role}</p>
                          <p className="fb text-[10.5px] font-semibold mt-0.5 leading-snug px-2" style={{ color:G.deep }}>{p.parents}</p>
                        </motion.div>
                      ))}

                      {/* Centre & sign */}
                      <div className="hidden sm:flex absolute left-1/2 top-[18%] -translate-x-1/2 flex-col items-center gap-2 z-10">
                        <div className="w-px h-12 opacity-25" style={{ background:G.gold }}/>
                        <motion.span animate={{ scale:[1,1.14,1],opacity:[.7,1,.7] }} transition={{ duration:4.5,repeat:Infinity }}
                          className="fd italic" style={{ fontSize:30,color:G.gold,lineHeight:1 }}>&amp;</motion.span>
                        <div className="w-px h-12 opacity-25" style={{ background:G.gold }}/>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ══ MARQUEE DIVIDER ══ */}
                <div className="overflow-hidden py-4 relative" style={{ background:`linear-gradient(90deg,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD})` }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ opacity:.1,
                    backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
                  }}/>
                  <div className="marquee-inner">
                    {Array.from({length:20}).map((_,i)=>(
                      <span key={i} className="fb text-[8.5px] font-semibold mx-7 shrink-0 flex items-center gap-7"
                        style={{ color:G.ivory, letterSpacing:".5em", opacity:.92 }}>
                        {i%2===0?"ANIS & FADLI":"✦ 27 APRIL 2024 ✦"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ══ CERITA ══ */}
                <section id="cerita" className="relative py-24 sm:py-32 overflow-hidden" style={{ background:G.deep }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 85% 65% at 85% 50%,${G.gold}07,transparent 58%)` }}/>
                  <BokehBg dark/>
                  <div className="px-5 sm:px-14">
                    <div className="text-center mb-16">
                      <SecLabel dark>OUR LOVE STORY</SecLabel>
                      <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(32px,5.8vw,54px)",color:G.ivory,lineHeight:1.15 }}>
                        Perjalanan Cinta Kami
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-7">
                          <FloralDivider light/>
                        </div>
                      </Reveal>
                    </div>

                    {/* Vertical timeline */}
                    <div className="max-w-2xl mx-auto relative">
                      {/* Center line */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px hidden sm:block"
                        style={{ background:`linear-gradient(to bottom,transparent,${G.gold}55,${G.gold}55,transparent)` }}/>

                      <div className="flex flex-col gap-0">
                        {W.story.map((s,i)=>{
                          const isRight = i%2===1;
                          return (
                            <motion.div key={s.year}
                              initial={{ opacity:0, x: isRight?40:-40 }}
                              whileInView={{ opacity:1, x:0 }}
                              viewport={{ once:true, amount:0.25 }}
                              transition={{ duration:0.9, delay:i*.1, ease:[0.22,1,0.36,1] }}
                              className={`relative flex ${isRight?"sm:flex-row-reverse":"sm:flex-row"} flex-col items-center gap-5 sm:gap-0 mb-10 sm:mb-14 cursor-pointer group`}
                              onClick={()=>setStoryIdx(i)}
                            >
                              {/* Content card */}
                              <div className={`sm:w-[calc(50%-32px)] w-full`}>
                                <motion.div
                                  whileHover={{ scale:1.025 }}
                                  transition={{ duration:.35 }}
                                  className="relative overflow-hidden"
                                  style={{
                                    border:`1px solid ${i===storyIdx?G.gold:`${G.ivory}14`}`,
                                    background:i===storyIdx?`rgba(192,144,80,.08)`:`rgba(255,252,247,.04)`,
                                    transition:"border-color .35s, background .35s",
                                    boxShadow: i===storyIdx?`0 0 0 1px ${G.gold}35,0 28px 64px rgba(0,0,0,.45)`:"0 10px 36px rgba(0,0,0,.22)"
                                  }}>
                                  <div className="absolute inset-x-0 top-0 h-[1.5px]"
                                    style={{ background:`linear-gradient(to right,transparent,${i===storyIdx?G.gold:`${G.ivory}20`},transparent)`,transition:"background .35s" }}/>
                                  <div className="flex gap-0 items-stretch">
                                    {/* Photo */}
                                    <div className="w-28 sm:w-32 shrink-0 overflow-hidden img-zoom">
                                      <img src={s.img} alt={s.title} className="w-full h-full object-cover"/>
                                      <div className="absolute inset-y-0 right-0 w-6"
                                        style={{ background:`linear-gradient(to right,transparent,${i===storyIdx?`rgba(192,144,80,.06)`:G.deep+"0a"})` }}/>
                                    </div>
                                    {/* Text */}
                                    <div className="flex-1 px-4 py-4 sm:py-5">
                                      <p className="fb text-[8px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".38em" }}>{s.year}</p>
                                      <h3 className="fd font-normal mb-1" style={{ fontSize:"clamp(17px,2.8vw,21px)",color:G.ivory }}>{s.title}</h3>
                                      <p className="fd italic text-xs mb-2.5" style={{ color:`${G.ivory}48` }}>{s.sub}</p>
                                      <p className="fb text-[10.5px] leading-[1.9]" style={{ color:`${G.ivory}58` }}>{s.body}</p>
                                    </div>
                                  </div>
                                  {/* Bottom accent */}
                                  <div className="h-px" style={{ background:`linear-gradient(to right,transparent,${i===storyIdx?G.gold+"50":"transparent"},transparent)` }}/>
                                </motion.div>
                              </div>

                              {/* Center timeline dot */}
                              <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 items-center justify-center z-10">
                                <motion.div
                                  animate={{
                                    scale: i===storyIdx?1.2:1,
                                    background: i===storyIdx?`linear-gradient(135deg,${G.goldD},${G.gold})`:`rgba(255,252,247,.08)`
                                  }}
                                  transition={{ duration:.35 }}
                                  className={`w-12 h-12 rounded-full flex items-center justify-center${i===storyIdx?" dot-active":""}`}
                                  style={{ border:`1.5px solid ${i===storyIdx?G.gold:`${G.ivory}25`}` }}>
                                  <span className="fd font-medium text-xs" style={{ color:i===storyIdx?G.ivory:G.gold }}>{i+1}</span>
                                </motion.div>
                              </div>

                              <div className="hidden sm:block sm:w-[calc(50%-32px)]"/>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Wave divider */}
                <div style={{ background:G.deep, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 70 Q200 0 500 40 Q800 70 1000 15 Q1100 0 1200 20 L1200 70 Z" fill={G.ivory}/>
                  </svg>
                </div>

                {/* ══ ACARA ══ */}
                <section id="acara" className="relative px-5 sm:px-14 py-24 sm:py-32 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 100% 50% at 50% 110%,${G.rose}28,transparent 52%)` }}/>
                  <BokehBg/>
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-16">
                      <SecLabel>SAVE THE DATE</SecLabel>
                      <AnimHeading delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(32px,5.8vw,52px)",color:G.deep,lineHeight:1.15 }}>
                        Detail Acara
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-7">
                          <FloralDivider/>
                        </div>
                      </Reveal>
                    </div>

                    {/* Countdown */}
                    <Reveal delay={.12}>
                      <div className="mb-16 text-center">
                        {(cd.d===0&&cd.h===0&&cd.m===0&&cd.s===0) ? (
                          <div className="py-12 relative overflow-hidden"
                            style={{ border:`1px solid ${G.gold}40`, background:`linear-gradient(160deg,${G.cream},${G.ivory})`, boxShadow:`0 16px 56px rgba(192,144,80,.14)` }}>
                            <div className="absolute inset-x-0 top-0 h-[2.5px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}80,transparent)` }}/>
                            <motion.p animate={{ opacity:[.7,1,.7] }} transition={{ duration:3.5,repeat:Infinity }}
                              className="fs gshim block" style={{ fontSize:"clamp(34px,7vw,56px)",lineHeight:1.2 }}>
                              Selamat Menempuh Hidup Baru
                            </motion.p>
                            <p className="fb text-[8.5px] mt-5" style={{ color:G.gold,letterSpacing:".44em" }}>✦ 27 APRIL 2024 ✦</p>
                          </div>
                        ) : (
                          <>
                            <p className="fb text-[8.5px] font-semibold mb-6" style={{ color:G.muted,letterSpacing:".44em" }}>MENGHITUNG HARI</p>
                            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                              {[{v:cd.d,l:"Hari"},{v:cd.h,l:"Jam"},{v:cd.m,l:"Menit"},{v:cd.s,l:"Detik"}].map((x)=>(
                                <div key={x.l} className="relative overflow-hidden text-center py-6 sm:py-8"
                                  style={{ background:`linear-gradient(160deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}32`, boxShadow:`0 10px 32px rgba(192,144,80,.1)` }}>
                                  <div className="absolute inset-x-0 top-0 h-[2.5px]"
                                    style={{ background:`linear-gradient(to right,transparent,${G.gold}80,transparent)` }}/>
                                  <div className="absolute inset-x-0 bottom-0 h-px"
                                    style={{ background:`linear-gradient(to right,transparent,${G.gold}28,transparent)` }}/>
                                  <AnimatePresence mode="popLayout">
                                    <motion.span key={x.v}
                                      initial={{ y:-20,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:20,opacity:0 }}
                                      transition={{ duration:.3,ease:[0.22,1,0.36,1] }}
                                      className="fd block" style={{ fontSize:"clamp(28px,6.5vw,42px)",color:G.deep,fontWeight:300,lineHeight:1 }}>
                                      {String(x.v).padStart(2,"0")}
                                    </motion.span>
                                  </AnimatePresence>
                                  <span className="fb block mt-2" style={{ fontSize:"clamp(7px,1.8vw,9px)",color:G.gold,letterSpacing:".2em" }}>
                                    {x.l.toUpperCase()}
                                  </span>
                                  {/* Corner dots */}
                                  <div className="absolute top-2 left-2 w-1 h-1 rounded-full" style={{ background:G.gold,opacity:.4 }}/>
                                  <div className="absolute top-2 right-2 w-1 h-1 rounded-full" style={{ background:G.gold,opacity:.4 }}/>
                                  <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full" style={{ background:G.gold,opacity:.2 }}/>
                                  <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full" style={{ background:G.gold,opacity:.2 }}/>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </Reveal>

                    {/* Event cards */}
                    <div className="relative mb-16">
                      <div className="absolute left-[22px] sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px"
                        style={{ background:`linear-gradient(to bottom,transparent,${G.gold}60 20%,${G.gold}60 80%,transparent)` }}/>
                      <div className="flex flex-col gap-6">
                      {[
                        {
                          title:"Akad Nikah", sub:"Ijab Kabul", num:"01", icon:"🕌",
                          img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=500&q=88&fit=crop",
                          data:W.akad,
                        },
                        {
                          title:"Resepsi Pernikahan", sub:"Walimatul 'Ursy", num:"02", icon:"🥂",
                          img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=500&q=88&fit=crop",
                          data:W.resepsi,
                        },
                      ].map((ev,i)=>(
                        <Reveal key={ev.title} delay={i*.16}>
                          <div className="flex items-start gap-4 sm:gap-0 sm:block">
                            {/* Mobile timeline dot */}
                            <div className="flex-shrink-0 sm:hidden mt-6 z-10 relative">
                              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, boxShadow:`0 4px 20px ${G.gold}50` }}>
                                <span className="fb text-[10px] font-semibold" style={{ color:G.ivory }}>{ev.num}</span>
                              </div>
                            </div>
                            <div className="hover-lift flex-1 relative overflow-hidden"
                              style={{ border:`1px solid ${G.gold}32`, boxShadow:`0 20px 60px rgba(192,144,80,.14)` }}>
                              {/* Desktop number badge */}
                              <div className="hidden sm:flex absolute top-4 left-4 z-10 w-11 h-11 rounded-full items-center justify-center"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, boxShadow:`0 6px 22px ${G.gold}50` }}>
                                <span className="fb text-[10px] font-semibold" style={{ color:G.ivory }}>{ev.num}</span>
                              </div>
                              {/* Image header */}
                              <div className="relative h-48 overflow-hidden group img-zoom">
                                <img src={ev.img} alt={ev.title} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0"
                                  style={{ background:"linear-gradient(to bottom,rgba(26,21,17,.12) 0%,rgba(26,21,17,.88) 100%)" }}/>
                                <div className="absolute inset-x-0 bottom-0 h-[2.5px]"
                                  style={{ background:`linear-gradient(to right,transparent,${G.gold}99,transparent)` }}/>
                                <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
                                  <p className="fb text-[7.5px] font-semibold mb-1.5" style={{ color:G.goldL,letterSpacing:".32em" }}>{ev.sub.toUpperCase()}</p>
                                  <h3 className="fd font-normal" style={{ fontSize:"clamp(22px,4vw,32px)",color:G.ivory,lineHeight:1.2 }}>{ev.title}</h3>
                                </div>
                                <div className="absolute top-2.5 right-2.5 opacity-45"><Corner pos="tr"/></div>
                              </div>
                              {/* Content */}
                              <div className="px-6 py-5" style={{ background:G.ivory }}>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                        style={{ background:`${G.gold}15`, border:`1px solid ${G.gold}30` }}>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                      </div>
                                      <p className="fb text-[11.5px] font-semibold" style={{ color:G.deep }}>{ev.data.time}</p>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ background:`${G.gold}15`, border:`1px solid ${G.gold}30` }}>
                                        <svg width="9" height="11" viewBox="0 0 24 24" fill={G.gold}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                      </div>
                                      <div>
                                        <p className="fd italic text-[15px] leading-tight" style={{ color:G.deep }}>{ev.data.place}</p>
                                        <p className="fb text-[10.5px] mt-0.5 leading-snug" style={{ color:G.muted }}>{ev.data.addr}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <Magnetic href={ev.data.maps}
                                    className="fb inline-flex items-center gap-2 text-[9px] font-semibold px-6 py-3 shrink-0"
                                    style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`,color:G.ivory,letterSpacing:".1em", boxShadow:`0 8px 24px ${G.gold}40` }}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                    LIHAT PETA
                                  </Magnetic>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                      </div>
                    </div>

                    {/* Dress code */}
                    <Reveal>
                      <div className="relative overflow-hidden"
                        style={{ background:`linear-gradient(150deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}30`, boxShadow:`0 10px 48px rgba(192,144,80,.08)` }}>
                        <div className="absolute inset-x-0 top-0 h-[2.5px]"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}70,transparent)` }}/>
                        <div className="absolute top-3 left-3 opacity-15"><Corner pos="tl" size={40}/></div>
                        <div className="absolute top-3 right-3 opacity-15"><Corner pos="tr" size={40}/></div>
                        <div className="p-7 sm:p-9">
                          <div className="text-center mb-8">
                            <SecLabel>DRESS CODE</SecLabel>
                            <h3 className="fd font-normal gsap-title" style={{ fontSize:"clamp(20px,3.5vw,28px)",color:G.deep }}>Tata Busana</h3>
                            <p className="fb text-[10.5px] mt-2" style={{ color:G.muted }}>Mohon kenakan warna busana berikut</p>
                          </div>
                          <div className="flex gap-6 sm:gap-10 justify-center flex-wrap">
                            {W.dressCode.map((d,i)=>(
                              <motion.div key={d.label}
                                initial={{ opacity:0,y:18 }} whileInView={{ opacity:1,y:0 }}
                                viewport={{ once:true }} transition={{ delay:i*.1,duration:.75 }}
                                whileHover={{ y:-8 }} className="text-center group cursor-default">
                                <div className="relative mb-3.5">
                                  <motion.div whileHover={{ scale:1.18 }}
                                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full mx-auto shadow-lg transition-shadow duration-300"
                                    style={{ width:64, height:64, background:d.color,
                                      border:`2.5px solid ${G.gold}30`,
                                      boxShadow:`0 10px 28px ${d.color}80,0 0 0 4px ${G.ivory}` }}/>
                                  <motion.div
                                    initial={{ scale:0 }} whileHover={{ scale:1 }}
                                    className="absolute inset-0 rounded-full flex items-center justify-center"
                                    style={{ border:`1.5px solid ${G.gold}`, transition:"all .3s" }}>
                                    <div className="w-3 h-3 rounded-full" style={{ border:`1.5px solid ${G.gold}88` }}/>
                                  </motion.div>
                                </div>
                                <p className="fb text-[10px] font-semibold" style={{ color:G.deep }}>{d.label}</p>
                                <p className="fb text-[9px] mt-0.5" style={{ color:G.muted }}>{d.for}</p>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-7 pt-5" style={{ borderTop:`1px dashed ${G.gold}30` }}>
                            <p className="fd italic text-center text-sm" style={{ color:G.muted }}>Hindari warna putih &amp; hitam penuh ✦</p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave divider 2 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 15 Q300 70 600 35 Q900 0 1200 55 L1200 70 L0 70 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ GALERI ══ */}
                <section id="galeri" className="relative py-24 sm:py-32 overflow-hidden" style={{ background:G.deep }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 75% 55% at 50% 100%,${G.gold}06,transparent 58%)` }}/>
                  <BokehBg dark/>
                  <div className="text-center mb-14 sm:mb-18 px-5">
                    <SecLabel dark>OUR GALLERY</SecLabel>
                    <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                      style={{ fontSize:"clamp(32px,5.8vw,54px)",color:G.ivory,lineHeight:1.15 }}>
                      Momen Kami
                    </AnimHeading>
                    <Reveal delay={.2}>
                      <div className="flex justify-center mt-7 mb-3">
                        <FloralDivider light/>
                      </div>
                    </Reveal>
                    <Reveal delay={.28}>
                      <p className="fd italic text-sm mt-2" style={{ color:`${G.ivory}38` }}>Geser atau seret untuk melihat semua foto</p>
                    </Reveal>
                  </div>
                  <Gallery onOpen={i=>openLb(i)}/>
                </section>

                {/* Wave divider 3 */}
                <div style={{ background:G.deep, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 55 Q300 0 600 35 Q900 70 1200 20 L1200 70 L0 70 Z" fill={G.ivory}/>
                  </svg>
                </div>

                {/* ══ HADIAH ══ */}
                <section className="relative px-5 sm:px-14 py-24 sm:py-32 overflow-hidden" style={{ background:G.ivory }}>
                  <BokehBg/>
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-14">
                      <SecLabel>AMPLOP DIGITAL</SecLabel>
                      <AnimHeading delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(30px,5.5vw,46px)",color:G.deep,lineHeight:1.15 }}>
                        Hadiah &amp; Doa
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-7 mb-6">
                          <FloralDivider/>
                        </div>
                      </Reveal>
                      <Reveal delay={.26}>
                        <p className="fd italic text-sm px-2 leading-[1.9]" style={{ color:G.muted }}>
                          Kehadiran dan doa restu Anda adalah hadiah terbesar.<br/>Namun bila berkenan mengirimkan hadiah:
                        </p>
                      </Reveal>
                    </div>

                    <div className="space-y-4 mb-8">
                      {W.bank.map((b,i)=>(
                        <Reveal key={b.no} delay={i*.14}>
                          <TiltCard>
                            <div className="relative overflow-hidden card-glow"
                              style={{ background:`linear-gradient(135deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}45`,
                                boxShadow:`0 14px 48px rgba(192,144,80,.12)` }}>
                              <div className="absolute inset-x-0 top-0 h-[2.5px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}80,transparent)` }}/>
                              {/* Accent side bar */}
                              <div className="absolute left-0 top-0 bottom-0 w-[3.5px]" style={{ background:`linear-gradient(to bottom,${b.accent}44,${b.accent}90,${b.accent}44)` }}/>
                              {/* Decorative circle */}
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full opacity-6" style={{ background:b.accent }}/>
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full opacity-5" style={{ background:b.accent }}/>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 pl-6">
                                <div>
                                  <p className="fb text-[7.5px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".32em" }}>{b.name.toUpperCase()}</p>
                                  <p className="fd font-medium break-all tracking-wide" style={{ fontSize:"clamp(22px,5.5vw,32px)",color:G.deep }}>{b.no}</p>
                                  <p className="fb text-[11px] mt-1.5" style={{ color:G.muted }}>a.n. <span className="font-semibold" style={{ color:G.deep }}>{b.an}</span></p>
                                </div>
                                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:.93 }}
                                  onClick={()=>copyBank(b.no)}
                                  className="fb shrink-0 self-start sm:self-center px-6 py-2.5 text-[9px] font-semibold transition-all duration-350"
                                  style={{ background:copied===b.no?G.gold:"transparent",color:copied===b.no?G.ivory:G.gold,
                                    border:`1.5px solid ${copied===b.no?G.gold:G.gold+"55"}`,letterSpacing:".14em",minWidth:90,
                                    boxShadow:copied===b.no?`0 8px 24px ${G.gold}45`:"none" }}>
                                  {copied===b.no?"✓ TERSALIN":"SALIN"}
                                </motion.button>
                              </div>
                            </div>
                          </TiltCard>
                        </Reveal>
                      ))}
                    </div>

                    <Reveal delay={.22}>
                      <div className="p-5 sm:p-6 text-center relative overflow-hidden"
                        style={{ border:`1.5px dashed ${G.gold}35`, background:G.cream }}>
                        <div className="absolute inset-x-0 top-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}40,transparent)` }}/>
                        <p className="fb text-[8px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".36em" }}>ATAU KIRIM KE ALAMAT</p>
                        <p className="fd italic text-base mt-2.5" style={{ color:G.deep }}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                        <p className="fb text-[11px] mt-0.5" style={{ color:G.muted }}>Jakarta Selatan, 12160</p>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave divider 4 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 55 Q300 0 600 35 Q900 70 1200 20 L1200 70 L0 70 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ RSVP ══ */}
                <section id="rsvp" className="relative py-24 sm:py-32 overflow-hidden" style={{ background:G.deep }}>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 85% 65% at 50% 0%,${G.gold}09,transparent 52%)` }}/>
                  <BokehBg dark/>
                  <div className="px-5 sm:px-14">
                    <div className="text-center mb-14">
                      <SecLabel dark>RSVP</SecLabel>
                      <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(32px,5.8vw,52px)",color:G.ivory,lineHeight:1.15 }}>
                        Ucapan &amp; Doa
                      </AnimHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-7 mb-3">
                          <FloralDivider light/>
                        </div>
                      </Reveal>
                      <Reveal delay={.28}>
                        <p className="fd italic text-sm mt-3" style={{ color:`${G.ivory}42` }}>Sampaikan ucapan terbaik Anda untuk kami</p>
                      </Reveal>
                    </div>

                    <div className="max-w-lg mx-auto">
                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div key="ok"
                            initial={{ opacity:0,scale:.9,y:16 }} animate={{ opacity:1,scale:1,y:0 }} exit={{ opacity:0,scale:.95 }}
                            transition={{ duration:.6,ease:[0.22,1,0.36,1] }}
                            className="relative text-center py-20 overflow-hidden" style={{ border:`1px solid ${G.gold}50`, background:`rgba(192,144,80,.06)` }}>
                            <div className="absolute inset-x-0 top-0 h-[2px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}70,transparent)` }}/>
                            <div className="absolute inset-x-0 bottom-0 h-px"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}40,transparent)` }}/>
                            <motion.div
                              animate={{ y:[0,-8,0],rotate:[0,5,-5,0] }}
                              transition={{ duration:3,repeat:Infinity,ease:"easeInOut" }}
                              className="text-5xl mb-5">✉</motion.div>
                            <p className="fd text-3xl mb-2.5" style={{ color:G.ivory }}>Terima Kasih</p>
                            <p className="fb text-[10.5px]" style={{ color:`${G.ivory}42` }}>Ucapan Anda telah tersimpan dengan indah</p>
                            <div className="flex justify-center mt-7">
                              <FloralDivider light/>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.form key="form"
                            initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                            transition={{ duration:.65,ease:[0.22,1,0.36,1] }}
                            onSubmit={submitRsvp}
                            className="relative mb-8"
                            style={{ background:"rgba(255,252,247,.04)", border:`1px solid ${G.gold}32`,
                              backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)" }}>
                            <div className="absolute inset-x-0 top-0 h-[2.5px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}65,transparent)` }}/>
                            <div className="absolute inset-x-0 bottom-0 h-px"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}35,transparent)` }}/>
                            <div className="p-6 sm:p-8 space-y-3.5">
                              {/* Name input */}
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".6"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                                <input required value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})}
                                  placeholder="Nama lengkap Anda" className="fb w-full pl-10 pr-4 py-3.5 text-[12px]"
                                  style={{ background:"rgba(255,252,247,.07)",border:`1px solid ${G.gold}32`,color:G.ivory, letterSpacing:".02em" }}/>
                              </div>

                              {/* Select */}
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".6"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                                </div>
                                <select value={form.hadir} onChange={e=>setForm({...form,hadir:e.target.value})}
                                  className="fb w-full pl-10 pr-4 py-3.5 text-[12px]"
                                  style={{ background:"rgba(26,21,17,.95)",border:`1px solid ${G.gold}32`,color:G.ivory }}>
                                  <option value="Hadir">✓  Insya Allah Hadir</option>
                                  <option value="Tidak Hadir">✗  Belum Bisa Hadir</option>
                                </select>
                              </div>

                              {/* Textarea */}
                              <div className="relative">
                                <div className="absolute left-4 top-4 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                </div>
                                <textarea required rows={4} value={form.ucapan} onChange={e=>setForm({...form,ucapan:e.target.value})}
                                  placeholder="Tulis ucapan dan doa terbaik untuk kedua mempelai..."
                                  className="fb w-full pl-10 pr-4 py-3.5 text-[12px] resize-none"
                                  style={{ background:"rgba(255,252,247,.07)",border:`1px solid ${G.gold}32`,color:G.ivory, letterSpacing:".02em" }}/>
                              </div>

                              {/* Submit */}
                              <motion.button type="submit"
                                whileHover={{ scale:1.016 }} whileTap={{ scale:.975 }}
                                className="fb w-full py-4 text-[9.5px] font-semibold mt-1 flex items-center justify-center gap-2.5"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldXL},${G.gold})`,color:G.ivory,
                                  letterSpacing:".18em", boxShadow:`0 12px 36px ${G.gold}45` }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                  <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                KIRIM UCAPAN
                              </motion.button>
                            </div>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {/* RSVP list */}
                      {rsvps.length > 0 && (
                        <div className="rsvp-feed space-y-3 max-h-80 overflow-y-auto pr-1">
                          <AnimatePresence>
                            {rsvps.map(r=>(
                              <motion.div key={r.ts} layout
                                initial={{ opacity:0,x:-20,y:10 }} animate={{ opacity:1,x:0,y:0 }} exit={{ opacity:0 }}
                                transition={{ duration:.5,ease:[0.22,1,0.36,1] }}
                                className="rsvp-item relative p-4 sm:p-5"
                                style={{ background:"rgba(255,252,247,.04)",border:`1px solid ${G.gold}20` }}>
                                <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r"
                                  style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}70,${G.gold}00)` }}/>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                      style={{ background:`linear-gradient(135deg,${G.gold}25,${G.gold}12)`, border:`1px solid ${G.gold}40` }}>
                                      <span className="fd italic text-base font-medium" style={{ color:G.gold }}>{r.nama[0]?.toUpperCase()}</span>
                                    </div>
                                    <p className="fd text-[16px] font-medium" style={{ color:G.ivory }}>{r.nama}</p>
                                  </div>
                                  <span className="fb text-[7.5px] font-semibold px-2.5 py-1 shrink-0"
                                    style={{ background:r.hadir==="Hadir"?`${G.gold}20`:`${G.rose}16`,
                                      color:r.hadir==="Hadir"?G.gold:G.rose,
                                      border:`1px solid ${r.hadir==="Hadir"?G.gold+"42":G.rose+"42"}`,letterSpacing:".12em" }}>
                                    {r.hadir==="Hadir"?"✓ HADIR":"✕ BERHALANGAN"}
                                  </span>
                                </div>
                                <p className="fb text-[11px] leading-[1.85] italic pl-10" style={{ color:`${G.ivory}50` }}>{r.ucapan}</p>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                      {rsvps.length===0 && !submitted && (
                        <p className="fb text-center text-[11px] italic py-6" style={{ color:`${G.ivory}32` }}>
                          Belum ada ucapan. Jadilah yang pertama ✦
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ══ PENUTUP ══ */}
                <section className="relative px-5 sm:px-14 py-28 sm:py-40 overflow-hidden">
                  {/* Full-bleed photo */}
                  <div className="absolute inset-0 pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1511285560929-80b456503681?w=1400&q=82&fit=crop"
                      alt="" className="w-full h-full object-cover object-center"/>
                    <div className="absolute inset-0"
                      style={{ background:`linear-gradient(to bottom,rgba(255,252,247,.95) 0%,rgba(255,252,247,.88) 50%,rgba(255,252,247,.95) 100%)` }}/>
                    <div className="absolute inset-0"
                      style={{ background:`radial-gradient(ellipse 130% 55% at 50% 50%,${G.rose}35,transparent 62%)` }}/>
                  </div>
                  {/* Rotating ornament */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rotate-slow" style={{ opacity:.07 }}>
                    <OrnamentRing size={480}/>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none float-slow" style={{ opacity:.04 }}>
                    <OrnamentRing size={280}/>
                  </div>
                  <div className="absolute top-5 left-5 opacity-18 hidden sm:block"><Corner pos="tl"/></div>
                  <div className="absolute top-5 right-5 opacity-18 hidden sm:block"><Corner pos="tr"/></div>
                  <div className="absolute bottom-5 left-5 opacity-12 hidden sm:block"><Corner pos="bl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-12 hidden sm:block"><Corner pos="br"/></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <Reveal>
                      <div className="flex items-center justify-center gap-3 mb-10">
                        <div className="h-px w-10 opacity-40" style={{ background:G.gold }}/>
                        <span className="fb text-[8.5px] font-semibold" style={{ color:G.gold,letterSpacing:".55em" }}>TERIMA KASIH</span>
                        <div className="h-px w-10 opacity-40" style={{ background:G.gold }}/>
                      </div>
                    </Reveal>

                    <div className="overflow-hidden mb-3">
                      <motion.span initial={{ y:"115%",opacity:0 }} whileInView={{ y:"0%",opacity:1 }}
                        viewport={{ once:true }} transition={{ duration:1.2,ease:[0.22,1,0.36,1] }}
                        className="fs gshim block" style={{ fontSize:"clamp(46px,10vw,84px)",lineHeight:1.12 }}>
                        Jazakumullah Khairan
                      </motion.span>
                    </div>

                    <Reveal delay={.15}>
                      <div className="flex justify-center my-10">
                        <FloralDivider/>
                      </div>
                    </Reveal>

                    <Reveal delay={.2}>
                      <p className="fd italic leading-[2.1] mb-10 px-3" style={{ fontSize:"clamp(13px,2.2vw,16px)",color:G.muted }}>
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                        berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                      </p>
                    </Reveal>

                    <Reveal delay={.26}>
                      <p className="fd italic text-sm mb-2.5" style={{ color:G.muted }}>Kami yang berbahagia,</p>
                      <motion.h3 animate={{ opacity:[.85,1,.85] }} transition={{ duration:3.5,repeat:Infinity }}
                        className="fs" style={{ fontSize:"clamp(44px,9vw,68px)",color:G.deep,lineHeight:1.1 }}>
                        {W.bride} &amp; {W.groom}
                      </motion.h3>
                    </Reveal>

                    <Reveal delay={.32}>
                      <div className="flex justify-center my-10">
                        <FloralDivider/>
                      </div>
                    </Reveal>

                    {/* Share button */}
                    <Reveal delay={.36}>
                      <Magnetic
                        href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}.`)}`}
                        className="fb inline-flex items-center gap-2.5 px-9 py-4 text-[9.5px] font-semibold"
                        style={{ background:"#25D366",color:"#fff",letterSpacing:".14em", boxShadow:"0 10px 32px rgba(37,211,102,.35)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        BAGIKAN KE WHATSAPP
                      </Magnetic>
                    </Reveal>

                    <Reveal delay={.44}>
                      <p className="fb text-[8px] mt-16" style={{ color:G.gold,opacity:.3,letterSpacing:".4em" }}>✦ MADE WITH LOVE ✦ 2024 ✦</p>
                    </Reveal>
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
                transition={{ type:"spring",stiffness:220,delay:.8 }}
                whileHover={{ scale:1.15 }} whileTap={{ scale:.87 }}
                onClick={toggleMusic} aria-label={playing?"Pause music":"Play music"}
                className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[70] rounded-full flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldXL})`, width:52, height:52,
                  boxShadow:`0 12px 40px rgba(192,144,80,.6),0 0 0 1.5px ${G.gold}55` }}>
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
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-12 gap-4"
                style={{ background:"rgba(26,21,17,.96)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)" }}>
                <motion.div
                  initial={{ scale:.84,opacity:0,y:28 }} animate={{ scale:1,opacity:1,y:0 }} exit={{ scale:.86,opacity:0 }}
                  transition={{ type:"spring",stiffness:260,damping:28 }}
                  onClick={e=>e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{ maxWidth:420,width:"100%",aspectRatio:"3/4",
                    boxShadow:`0 56px 100px rgba(0,0,0,.7),0 0 0 1.5px ${G.gold}45` }}>
                  <AnimatePresence mode="wait">
                    <motion.img key={lightbox}
                      initial={{ opacity:0,x:lbDir*40 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:lbDir*-40 }}
                      transition={{ duration:.42,ease:[0.22,1,0.36,1] }}
                      src={W.gallery[lightbox].src} alt={W.gallery[lightbox].label} className="w-full h-full object-cover"/>
                  </AnimatePresence>
                  {/* Info overlay */}
                  <div className="absolute inset-x-0 bottom-0 py-7 px-6"
                    style={{ background:"linear-gradient(to top,rgba(26,21,17,.95),transparent)" }}>
                    <p className="fd italic text-xl mb-1" style={{ color:G.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[8px] font-semibold" style={{ color:G.goldL,letterSpacing:".18em" }}>
                      {String(lightbox+1).padStart(2,"0")} / {W.gallery.length}
                    </p>
                  </div>
                  <div className="absolute top-3 left-3 opacity-45 pointer-events-none"><Corner pos="tl" size={36}/></div>
                  {/* Close */}
                  <button onClick={()=>setLightbox(null)} aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center fb text-sm font-semibold rounded-full"
                    style={{ background:"rgba(255,252,247,.15)",color:G.ivory,backdropFilter:"blur(8px)" }}>✕</button>
                  {/* Nav arrows */}
                  {lightbox > 0 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(-1); setLightbox(lightbox-1); }}
                      aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full"
                      style={{ background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(6px)",fontSize:22 }}>‹</button>
                  )}
                  {lightbox < W.gallery.length-1 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(1); setLightbox(lightbox+1); }}
                      aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full"
                      style={{ background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(6px)",fontSize:22 }}>›</button>
                  )}
                </motion.div>

                {/* Thumbnail strip */}
                <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:.2 }}
                  onClick={e=>e.stopPropagation()}
                  className="flex gap-2 px-4 py-3 flex-wrap justify-center max-w-xs rounded-sm"
                  style={{ background:"rgba(26,21,17,.65)",backdropFilter:"blur(12px)" }}>
                  {W.gallery.map((_,i)=>(
                    <button key={i} onClick={e=>{ e.stopPropagation(); setLbDir(i>lightbox!?1:-1); setLightbox(i); }}
                      aria-label={`Photo ${i+1}`}
                      className="overflow-hidden transition-all duration-300 shrink-0 rounded-sm"
                      style={{ width:i===lightbox?44:30,height:44,opacity:i===lightbox?1:.4,
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
