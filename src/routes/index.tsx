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

/* ─── SMALL UI ─── */
function GLine({ className="w-16 mx-auto" }: { className?:string }) {
  return <div className={`h-px ${className}`} style={{ background:`linear-gradient(to right,transparent,${G.gold}77,transparent)` }} />;
}

function Corner({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) {
  const deg = { tl:0, tr:90, br:180, bl:270 };
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ transform:`rotate(${deg[pos]}deg)` }}>
      <path d="M4 4 Q4 26 26 26" stroke={G.gold} strokeWidth=".7" opacity=".5" fill="none"/>
      <path d="M4 4 Q26 4 26 26" stroke={G.gold} strokeWidth=".7" opacity=".5" fill="none"/>
      <circle cx="4" cy="4" r="2" fill={G.gold} opacity=".45"/>
      <circle cx="26" cy="4" r="1" fill={G.gold} opacity=".28"/>
      <circle cx="4" cy="26" r="1" fill={G.gold} opacity=".28"/>
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
      initial={{ opacity:0, y:36 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.12 }}
      transition={{ duration:0.85, delay, ease:[0.22,1,0.36,1] }}
      className={className} style={style}
    >
      {children}
    </motion.div>
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
      .to(".ldr-fill", { scaleX:1, duration:1.5, ease:"power2.inOut" }, "-=0.5")
      .to(el.current,  { opacity:0, duration:0.9, ease:"power2.inOut", delay:0.15 });
  }, { scope: el });

  return (
    <div ref={el} className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{ background:G.deep }}>
      <div className="text-center px-6">
        <p className="ldr-tag fb text-[9px] font-semibold mb-8" style={{ color:G.gold, opacity:0, letterSpacing:"0.12em" }}>
          UNDANGAN PERNIKAHAN
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className="ldr-a fs" style={{ fontSize:"clamp(60px,13vw,96px)", color:G.ivory, lineHeight:1, opacity:0, transform:"translateY(32px)" }}>A</span>
          <span className="ldr-amp fd italic" style={{ fontSize:"clamp(26px,5vw,42px)", color:G.gold, lineHeight:1, opacity:0, transform:"scale(0.4)" }}>&amp;</span>
          <span className="ldr-f fs" style={{ fontSize:"clamp(60px,13vw,96px)", color:G.ivory, lineHeight:1, opacity:0, transform:"translateY(32px)" }}>F</span>
        </div>
        <p className="ldr-date fd italic mt-5" style={{ fontSize:"clamp(12px,2vw,15px)", color:`${G.ivory}50`, opacity:0 }}>
          27 · 04 · 2024
        </p>
        <div className="mt-10 w-36 mx-auto h-px overflow-hidden" style={{ background:`${G.ivory}14` }}>
          <div className="ldr-fill h-full origin-left scale-x-0"
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
      <div ref={emblaRef} className="overflow-hidden select-none" style={{ cursor:"grab" }}>
        <div className="flex gap-3 sm:gap-4 pl-5 sm:pl-10">
          {W.gallery.map((ph,i) => (
            <motion.button key={i}
              initial={{ opacity:0, scale:.9 }}
              whileInView={{ opacity:1, scale:1 }}
              viewport={{ once:true }}
              transition={{ delay:Math.min(i*.06,.3), duration:.7 }}
              whileHover={{ y:-7 }}
              onClick={() => onOpen(i)}
              className="relative overflow-hidden shrink-0 group"
              style={{ width:"clamp(230px,32vw,360px)", aspectRatio:"3/4", boxShadow:"0 20px 48px rgba(26,21,17,.32)" }}
            >
              <img src={ph.src} alt={ph.label} className="w-full h-full object-cover gal-img"
                style={{ transition:"transform .75s ease" }}
                onMouseEnter={e=>(e.currentTarget.style.transform="scale(1.07)")}
                onMouseLeave={e=>(e.currentTarget.style.transform="scale(1)")} />
              <div className="absolute inset-x-0 bottom-0 py-5 px-4"
                style={{ background:"linear-gradient(to top,rgba(26,21,17,.88),transparent)" }}>
                <p className="fd italic text-base" style={{ color:G.ivory }}>{ph.label}</p>
                <p className="fb text-[8px] mt-0.5 font-semibold" style={{ color:G.goldL, letterSpacing:".12em" }}>
                  {String(i+1).padStart(2,"0")} / {W.gallery.length}
                </p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                style={{ background:`${G.gold}18`, transition:"opacity .3s" }}>
                <span className="fb text-[9px] font-semibold px-5 py-2"
                  style={{ background:"rgba(255,252,247,.14)", color:G.ivory, border:`1px solid ${G.ivory}30`, backdropFilter:"blur(6px)", letterSpacing:".12em" }}>
                  LIHAT FOTO
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-7">
        {W.gallery.map((_,i) => (
          <button key={i} onClick={() => emblaApi?.scrollTo(i)} aria-label={`Foto ${i+1}`}
            style={{ width:i===sel?24:8, height:8, borderRadius:4, background:i===sel?G.gold:`${G.ivory}25`, border:"none", cursor:"pointer", padding:0, transition:"all .35s ease" }} />
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
      /* Connect GSAP ScrollTrigger */
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

        @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${G.gold}60}60%{box-shadow:0 0 0 14px ${G.gold}00}}
        .btn-pulse{animation:pulse2 2.8s ease-out infinite;}

        @keyframes vSpin{to{transform:rotate(360deg)}}
        .vspin{animation:vSpin 4s linear infinite;}

        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .float{animation:floatY 5s ease-in-out infinite;}

        /* Grain */
        #grain{position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.03;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode:overlay;}

        input,select,textarea{font-family:'Montserrat',sans-serif;-webkit-appearance:none;border-radius:0;}
        input::placeholder,textarea::placeholder{color:${G.ivory}40;}
        input:focus,select:focus,textarea:focus{outline:none;box-shadow:0 0 0 1.5px ${G.gold}88!important;}
        select option{background:${G.deep};color:${G.ivory};}

        .story-tab{position:relative;padding-bottom:10px;transition:color .3s;}
        .story-tab::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:${G.gold};transform:scaleX(0);transform-origin:left;transition:transform .35s ease;}
        .story-tab.active::after{transform:scaleX(1);}

        /* Timeline vertical */
        .tl-line{width:1px;background:linear-gradient(to bottom,transparent,${G.gold}55,transparent);}

        /* Horizontal marquee */
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-inner{display:flex;animation:marquee 28s linear infinite;width:max-content;}
        .marquee-inner:hover{animation-play-state:paused;}

        /* Section divider wave */
        .wave-divider{display:block;width:100%;overflow:hidden;line-height:0;}

        /* Event card hover */
        .ev-card{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s ease;}
        .ev-card:hover{transform:translateY(-4px);box-shadow:0 22px 56px rgba(192,144,80,.16);}

        /* Gallery cursor */
        .embla-wrap{cursor:grab;} .embla-wrap:active{cursor:grabbing;}
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
                exit={{ opacity:0, scale:1.02, filter:"blur(8px)" }}
                transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
                className="fixed inset-0 z-50 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* Left photo panel (desktop) */}
                <div className="hidden lg:block lg:w-[52%] h-full relative overflow-hidden">
                  <img ref={heroRef}
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=90&fit=crop"
                    alt="Wedding" className="w-full object-cover"
                    style={{ height:"115%", marginTop:"-7.5%", objectPosition:"center" }} loading="eager" />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(120deg,rgba(26,21,17,.05),rgba(26,21,17,.62))" }} />
                  {/* Photo text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12">
                    <motion.p initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }} transition={{ delay:.4,duration:1 }}
                      className="fb text-[9px] font-semibold mb-9" style={{ color:`${G.ivory}85`, letterSpacing:".55em" }}>
                      THE WEDDING OF
                    </motion.p>
                    <div className="overflow-hidden">
                      <motion.h1 initial={{ y:"110%" }} animate={{ y:0 }} transition={{ delay:.6,duration:1.1,ease:[0.22,1,0.36,1] }}
                        className="fs block" style={{ fontSize:"clamp(72px,9vw,112px)", color:G.ivory, lineHeight:1, textShadow:"0 4px 30px rgba(0,0,0,.4)" }}>
                        {W.bride}
                      </motion.h1>
                    </div>
                    <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.95 }}
                      className="fd italic text-2xl my-2" style={{ color:G.goldL }}>&amp;</motion.p>
                    <div className="overflow-hidden">
                      <motion.h1 initial={{ y:"110%" }} animate={{ y:0 }} transition={{ delay:1.05,duration:1.1,ease:[0.22,1,0.36,1] }}
                        className="fs block" style={{ fontSize:"clamp(72px,9vw,112px)", color:G.ivory, lineHeight:1, textShadow:"0 4px 30px rgba(0,0,0,.4)" }}>
                        {W.groom}
                      </motion.h1>
                    </div>
                    <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1.4,duration:.9 }}>
                      <GLine className="w-24 my-7" />
                    </motion.div>
                    <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.5 }}
                      className="fd italic" style={{ fontSize:"clamp(14px,1.6vw,18px)", color:`${G.ivory}75` }}>
                      {W.dateText}
                    </motion.p>
                  </div>
                  <div className="absolute top-5 left-5 opacity-45"><Corner pos="tl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-45"><Corner pos="br"/></div>
                </div>

                {/* Right invitation card */}
                <div className="w-full lg:w-[48%] h-full flex items-center justify-center px-5 py-10 sm:px-8 relative overflow-hidden"
                  style={{ background:`radial-gradient(ellipse 160% 90% at 50% -15%,${G.rose}48 0%,transparent 52%),${G.ivory}` }}>
                  {/* Ambient sparkles */}
                  {[{t:"6%",l:"6%",c:"✦",s:18,d:0},{t:"8%",l:"88%",c:"✧",s:13,d:.7},{t:"89%",l:"7%",c:"✿",s:15,d:1.4},{t:"87%",l:"87%",c:"❋",s:17,d:2.1}]
                    .map((sp,i)=>(
                    <motion.span key={i} aria-hidden="true" className="absolute pointer-events-none select-none"
                      style={{ top:sp.t,left:sp.l,color:G.gold,fontSize:sp.s,opacity:.2 }}
                      animate={{ y:[0,-10,0],opacity:[.14,.3,.14] }}
                      transition={{ duration:4+i,repeat:Infinity,delay:sp.d }}>{sp.c}</motion.span>
                  ))}

                  <TiltCard style={{ maxWidth:340, width:"100%" }}>
                    <motion.div initial={{ opacity:0,y:22,scale:.97 }} animate={{ opacity:1,y:0,scale:1 }}
                      transition={{ duration:1.1,delay:.2,ease:[0.22,1,0.36,1] }}
                      className="relative w-full text-center">
                      <div className="relative px-7 py-10 sm:px-9 sm:py-12"
                        style={{ border:`1px solid ${G.gold}40`, background:"rgba(255,252,247,.78)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)" }}>
                        {/* Corner marks */}
                        {(["tl","tr","bl","br"] as const).map((p,i)=>{
                          const pos=p==="tl"?"top-2 left-2":p==="tr"?"top-2 right-2":p==="bl"?"bottom-2 left-2":"bottom-2 right-2";
                          const d=p==="tl"?"M0 8L0 0L8 0":p==="tr"?"M14 8L14 0L6 0":p==="bl"?"M0 6L0 14L8 14":"M14 6L14 14L6 14";
                          return (
                            <div key={i} className={`absolute ${pos} w-[14px] h-[14px]`}>
                              <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><path d={d} stroke={G.gold} strokeWidth="1" opacity=".5"/></svg>
                            </div>
                          );
                        })}

                        {/* Mobile names */}
                        <div className="lg:hidden mb-6">
                          <motion.p initial={{ opacity:0,letterSpacing:".1em" }} animate={{ opacity:1,letterSpacing:".42em" }}
                            transition={{ duration:1.2,delay:.25 }} className="fb text-[9px] font-semibold mb-4"
                            style={{ color:G.gold,letterSpacing:".42em" }}>THE WEDDING OF</motion.p>
                          <GLine className="w-14 mx-auto mb-5"/>
                          <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.5,duration:.9 }}>
                            <span className="fs gshim block" style={{ fontSize:"clamp(44px,12vw,64px)",lineHeight:1 }}>{W.bride}</span>
                            <span className="fd italic block my-1" style={{ color:G.muted,fontSize:18 }}>&amp;</span>
                            <span className="fs gshim block" style={{ fontSize:"clamp(44px,12vw,64px)",lineHeight:1 }}>{W.groom}</span>
                          </motion.div>
                          <GLine className="w-14 mx-auto mt-5 mb-4"/>
                          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.9 }}
                            className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</motion.p>
                        </div>

                        {/* Desktop brief */}
                        <div className="hidden lg:block mb-7">
                          <p className="fb text-[9px] font-semibold mb-4" style={{ color:G.gold,letterSpacing:".38em" }}>UNDANGAN PERNIKAHAN</p>
                          <GLine className="w-14 mx-auto mb-4"/>
                          <p className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</p>
                        </div>

                        {/* Guest */}
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }} className="mb-7">
                          <p className="fb text-[8px] font-semibold mb-1.5" style={{ color:G.gold,letterSpacing:".35em" }}>KEPADA YTH.</p>
                          <p className="fb text-xs mb-1" style={{ color:G.muted }}>Bpk/Ibu/Saudara/i</p>
                          <p className="fd font-medium" style={{ fontSize:"clamp(18px,5vw,22px)",color:G.deep }}>{guest}</p>
                          <p className="fb text-xs mt-0.5" style={{ color:G.muted }}>Di Tempat</p>
                        </motion.div>

                        <Magnetic onClick={openInvitation}
                          className="btn-pulse fb inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold"
                          style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, color:G.ivory, letterSpacing:".14em" }}>
                          ✉&nbsp; BUKA UNDANGAN
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
                {useMemo(()=>Array.from({length:10}).map((_,i)=>({
                  id:i, left:(i*10.4)%100, delay:(i*1.9)%10, dur:16+(i%4)*4,
                })),[]).map(p=>(
                  <motion.div key={p.id}
                    initial={{ y:"-4%",opacity:0,rotate:0 }}
                    animate={{ y:"106vh",opacity:[0,.16,.16,0],rotate:p.id%2===0?360:-360,x:[0,18,-14,8,0] }}
                    transition={{ duration:p.dur,delay:p.delay,repeat:Infinity,ease:"linear" }}
                    style={{ position:"absolute",left:`${p.left}%`,fontSize:8+p.id%4*2,color:G.gold }}>✿</motion.div>
                ))}
              </div>

              {/* ── SIDEBAR ── */}
              <aside className="hidden lg:flex lg:w-[33%] xl:w-[31%] 2xl:w-[28%] sticky top-0 h-screen flex-col overflow-hidden shrink-0"
                style={{ borderRight:`1px solid ${G.gold}1A` }}>
                <div className="flex-1 relative overflow-hidden min-h-0">
                  <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=85&fit=crop&crop=top"
                    alt="Anis & Fadli" className="w-full object-cover absolute inset-0"
                    style={{ height:"115%", objectPosition:"top center" }} />
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(26,21,17,.05),rgba(26,21,17,.72))" }} />
                  <div className="absolute top-4 left-4 opacity-45"><Corner pos="tl"/></div>
                  <div className="absolute top-4 right-4 opacity-45"><Corner pos="tr"/></div>
                  {/* Overlay names */}
                  <div className="absolute bottom-0 inset-x-0 px-6 pb-5">
                    <p className="fd italic text-xs" style={{ color:`${G.ivory}60` }}>Bersatu dalam cinta sejati</p>
                  </div>
                </div>
                <div className="px-7 py-5 text-center shrink-0" style={{ background:G.ivory, borderTop:`1px solid ${G.gold}20` }}>
                  <p className="fb text-[8px] font-semibold mb-1" style={{ color:G.gold,letterSpacing:".44em" }}>THE WEDDING OF</p>
                  <div className="flex items-baseline justify-center gap-1.5 mt-1.5">
                    <span className="fs" style={{ fontSize:38,color:G.deep,lineHeight:1 }}>{W.bride}</span>
                    <span className="fd italic text-base" style={{ color:G.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize:38,color:G.deep,lineHeight:1 }}>{W.groom}</span>
                  </div>
                  <GLine className="w-14 mx-auto my-3"/>
                  <p className="fd italic text-xs mb-4" style={{ color:G.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>navTo(item.id)}
                        className="fb text-[8px] font-semibold py-1 transition-colors duration-200"
                        style={{ color:activeNav===item.id?G.gold:G.muted,letterSpacing:".12em" }}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT PANEL ── */}
              <div className="flex-1 min-w-0 overflow-x-hidden" style={{ background:G.ivory }}>

                {/* Mobile nav */}
                <motion.nav initial={{ y:-48,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ delay:.35 }}
                  className="sticky top-0 z-40 lg:hidden flex items-center justify-center py-2.5"
                  style={{ background:"rgba(255,252,247,.94)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:`1px solid ${G.gold}18` }}>
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
                <section id="pembukaan" className="relative px-5 sm:px-12 py-16 sm:py-24 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 80% 55% at 50% 0%,${G.rose}30,transparent 55%)` }} />
                  <div className="absolute top-6 left-6 opacity-14 hidden sm:block"><Corner pos="tl"/></div>
                  <div className="absolute top-6 right-6 opacity-14 hidden sm:block"><Corner pos="tr"/></div>

                  <div className="text-center max-w-lg mx-auto relative">
                    <Reveal>
                      <p className="fd font-light mb-2" style={{ fontSize:"clamp(22px,5vw,34px)",color:G.deep }}>
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    </Reveal>
                    <Reveal delay={.1}><GLine className="w-20 mx-auto my-7"/></Reveal>
                    <Reveal delay={.15}>
                      <blockquote className="fd italic leading-[2.1] mb-3 px-2"
                        style={{ fontSize:"clamp(13px,2vw,16px)",color:G.muted }}>
                        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan‑pasangan
                        dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
                      </blockquote>
                    </Reveal>
                    <Reveal delay={.2}>
                      <p className="fb text-[9px] font-semibold mb-10" style={{ color:G.gold,letterSpacing:".32em" }}>— QS. AR-RUM : 21 —</p>
                    </Reveal>
                    <Reveal delay={.25}>
                      <p className="fb text-xs sm:text-sm leading-[1.95] mb-12 px-1" style={{ color:G.muted }}>
                        Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan
                        walimatul 'ursy putra-putri kami:
                      </p>
                    </Reveal>

                    {/* Couple portraits */}
                    <div className="flex flex-col sm:flex-row gap-10 sm:gap-8 items-center sm:items-start justify-center">
                      {[
                        { img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE BRIDE", name:W.bride, full:W.brideFull, role:"Putri dari", parents:W.brideParents, dx:-32 },
                        { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&q=85&fit=crop&crop=face", lbl:"THE GROOM", name:W.groom, full:W.groomFull, role:"Putra dari", parents:W.groomParents, dx:32 },
                      ].map((p,i)=>(
                        <motion.div key={p.name}
                          initial={{ opacity:0,x:p.dx }}
                          whileInView={{ opacity:1,x:0 }}
                          viewport={{ once:true }}
                          transition={{ duration:1,delay:i*.15,ease:[0.22,1,0.36,1] }}
                          className="flex-1 text-center w-full max-w-[210px] sm:max-w-none mx-auto sm:mx-0"
                        >
                          <motion.div whileHover={{ y:-7,scale:1.02 }} transition={{ duration:.4 }}
                            className="relative mx-auto mb-4 overflow-hidden"
                            style={{ width:"min(156px,40vw)", aspectRatio:"3/4",
                              border:`1.5px solid ${G.gold}40`,
                              boxShadow:`0 18px 52px rgba(192,144,80,.14),0 0 0 7px ${G.ivory}` }}>
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 50%,rgba(26,21,17,.28))" }}/>
                          </motion.div>
                          <p className="fb text-[8px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".3em" }}>{p.lbl}</p>
                          <h2 className="fs" style={{ fontSize:48,color:G.deep,lineHeight:1.1 }}>{p.name}</h2>
                          <p className="fd italic text-sm mt-1.5 mb-0.5" style={{ color:G.muted }}>{p.full}</p>
                          <p className="fb text-[11px]" style={{ color:G.muted }}>{p.role}</p>
                          <p className="fb text-[11px] font-semibold" style={{ color:G.deep }}>{p.parents}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Marquee divider */}
                <div className="overflow-hidden py-3" style={{ background:G.gold, opacity:.9 }}>
                  <div className="marquee-inner">
                    {Array.from({length:14}).map((_,i)=>(
                      <span key={i} className="fb text-[9px] font-semibold mx-6 shrink-0"
                        style={{ color:G.ivory,letterSpacing:".4em" }}>
                        {i%2===0?"ANIS & FADLI":"✦ 27 APRIL 2024"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ══ CERITA ══ */}
                <section id="cerita" className="relative py-16 sm:py-24 overflow-hidden" style={{ background:G.deep }}>
                  <div className="px-5 sm:px-12">
                    {/* Heading */}
                    <div className="text-center mb-12">
                      <Reveal><p className="fb text-[9px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".5em" }}>OUR LOVE STORY</p></Reveal>
                      <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(28px,5.5vw,48px)",color:G.ivory,lineHeight:1.2 }}>
                        Perjalanan Cinta Kami
                      </AnimHeading>
                      <Reveal delay={.2}><GLine className="w-14 mx-auto mt-5"/></Reveal>
                    </div>

                    <div className="max-w-lg mx-auto">
                      {/* Tabs */}
                      <div className="flex gap-7 mb-8 overflow-x-auto" style={{ borderBottom:`1px solid ${G.ivory}12` }}>
                        {W.story.map((s,i)=>(
                          <button key={s.year} onClick={()=>setStoryIdx(i)}
                            className={`story-tab fb text-[11px] font-semibold whitespace-nowrap shrink-0 transition-colors duration-300 ${i===storyIdx?"active":""}`}
                            style={{ color:i===storyIdx?G.gold:`${G.ivory}45`,letterSpacing:".08em" }}>
                            {s.year}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div key={storyIdx}
                          initial={{ opacity:0,x:28 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-28 }}
                          transition={{ duration:.48,ease:[0.22,1,0.36,1] }}
                          className="flex flex-col sm:flex-row gap-6">
                          <div className="shrink-0 overflow-hidden"
                            style={{ width:"min(100%,168px)",aspectRatio:"3/4",border:`1px solid ${G.gold}44`,margin:"0 auto",boxShadow:"0 22px 52px rgba(0,0,0,.45)" }}>
                            <motion.img key={W.story[storyIdx].img}
                              initial={{ scale:1.12 }} animate={{ scale:1 }} transition={{ duration:.9,ease:"easeOut" }}
                              src={W.story[storyIdx].img} alt={W.story[storyIdx].title} className="w-full h-full object-cover"/>
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="fb text-[9px] font-semibold mb-2" style={{ color:G.gold,letterSpacing:".4em" }}>{W.story[storyIdx].year}</p>
                            <h3 className="fd font-normal mb-1" style={{ fontSize:"clamp(22px,4.5vw,30px)",color:G.ivory }}>{W.story[storyIdx].title}</h3>
                            <p className="fd italic text-sm mb-4" style={{ color:`${G.ivory}55` }}>{W.story[storyIdx].sub}</p>
                            <GLine className="w-10 mb-5"/>
                            <p className="fb text-sm leading-[1.95]" style={{ color:`${G.ivory}75` }}>{W.story[storyIdx].body}</p>
                            <div className="flex gap-2 mt-8">
                              {W.story.map((_,i)=>(
                                <button key={i} onClick={()=>setStoryIdx(i)} aria-label={`Story ${i+1}`}
                                  style={{ width:i===storyIdx?24:8,height:8,borderRadius:4,background:i===storyIdx?G.gold:`${G.ivory}22`,border:"none",cursor:"pointer",padding:0,transition:"all .3s ease" }}/>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Timeline */}
                      <div className="relative mt-12 pl-9">
                        <div className="absolute left-3 top-2 bottom-2 tl-line"/>
                        <div className="flex flex-col gap-5">
                          {W.story.map((s,i)=>(
                            <motion.button key={s.year} onClick={()=>setStoryIdx(i)}
                              initial={{ opacity:0,x:-16 }} whileInView={{ opacity:1,x:0 }}
                              viewport={{ once:true }} transition={{ delay:i*.09,duration:.6 }}
                              className="flex items-center gap-3 text-left relative">
                              <div className="absolute left-[-30px] w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                                style={{ background:i===storyIdx?G.gold:`${G.ivory}14`,border:`1px solid ${i===storyIdx?G.gold:G.ivory+"20"}`,transition:"all .3s" }}>
                                <div className="w-2 h-2 rounded-full" style={{ background:i===storyIdx?G.ivory:`${G.gold}55` }}/>
                              </div>
                              <p className="fb text-[9px] font-semibold shrink-0" style={{ color:i===storyIdx?G.gold:`${G.ivory}40`,letterSpacing:".12em" }}>{s.year}</p>
                              <p className="fd italic text-sm" style={{ color:i===storyIdx?G.ivory:`${G.ivory}35` }}>{s.title}</p>
                            </motion.button>
                          ))}
                        </div>
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
                <section id="acara" className="relative px-5 sm:px-12 py-16 sm:py-24 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 90% 45% at 50% 100%,${G.rose}22,transparent 55%)` }}/>
                  <div className="max-w-lg mx-auto">
                    {/* Heading */}
                    <div className="text-center mb-12">
                      <Reveal><p className="fb text-[9px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".5em" }}>SAVE THE DATE</p></Reveal>
                      <AnimHeading delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(28px,5.5vw,46px)",color:G.deep,lineHeight:1.2 }}>
                        Detail Acara
                      </AnimHeading>
                      <Reveal delay={.2}><GLine className="w-14 mx-auto mt-5"/></Reveal>
                    </div>

                    {/* Countdown */}
                    <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-12">
                      {[{v:cd.d,l:"Hari"},{v:cd.h,l:"Jam"},{v:cd.m,l:"Menit"},{v:cd.s,l:"Detik"}].map((x,i)=>(
                        <Reveal key={x.l} delay={i*.07}>
                          <div className="text-center py-4 sm:py-5 relative overflow-hidden"
                            style={{ background:`linear-gradient(160deg,${G.ivory},${G.cream})`,border:`1px solid ${G.gold}30` }}>
                            <div className="absolute inset-x-0 top-0 h-[2px]"
                              style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }}/>
                            <AnimatePresence mode="popLayout">
                              <motion.span key={x.v}
                                initial={{ y:-12,opacity:0 }} animate={{ y:0,opacity:1 }} exit={{ y:12,opacity:0 }}
                                transition={{ duration:.25 }}
                                className="fd font-light block" style={{ fontSize:"clamp(22px,5.5vw,32px)",color:G.deep }}>
                                {String(x.v).padStart(2,"0")}
                              </motion.span>
                            </AnimatePresence>
                            <span className="fb block mt-0.5" style={{ fontSize:"clamp(7px,1.8vw,9px)",color:G.gold,letterSpacing:".15em" }}>
                              {x.l.toUpperCase()}
                            </span>
                          </div>
                        </Reveal>
                      ))}
                    </div>

                    {/* Event cards */}
                    <div className="space-y-4 mb-12">
                      {[
                        { title:"Akad Nikah",sub:"Ijab Kabul",img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&h=220&q=80&fit=crop",data:W.akad },
                        { title:"Resepsi Pernikahan",sub:"Walimatul 'Ursy",img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200&h=220&q=80&fit=crop",data:W.resepsi },
                      ].map((ev,i)=>(
                        <Reveal key={ev.title} delay={i*.12}>
                          <div className="ev-card relative overflow-hidden flex items-stretch"
                            style={{ border:`1px solid ${G.gold}30`,cursor:"default" }}>
                            <div className="absolute left-0 top-0 bottom-0 w-0.5"
                              style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}55,${G.gold}00)` }}/>
                            <div className="w-20 sm:w-24 shrink-0 overflow-hidden">
                              <img src={ev.img} alt={ev.title} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1 px-4 sm:px-5 py-4 sm:py-5" style={{ background:G.ivory }}>
                              <p className="fb text-[8px] font-semibold mb-0.5" style={{ color:G.gold,letterSpacing:".22em" }}>{ev.sub.toUpperCase()}</p>
                              <h3 className="fd mb-2 font-normal" style={{ fontSize:"clamp(17px,3.5vw,22px)",color:G.deep }}>{ev.title}</h3>
                              <p className="fb text-xs font-semibold mb-0.5" style={{ color:G.deep }}>{ev.data.time}</p>
                              <p className="fd italic text-sm mb-0.5" style={{ color:G.muted }}>{ev.data.place}</p>
                              <p className="fb text-xs mb-3" style={{ color:G.muted }}>{ev.data.addr}</p>
                              <Magnetic href={ev.data.maps}
                                className="fb inline-flex items-center gap-1.5 text-[9px] font-semibold px-4 py-1.5"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`,color:G.ivory,letterSpacing:".08em" }}>
                                ↗ GOOGLE MAPS
                              </Magnetic>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>

                    {/* Dress code */}
                    <Reveal>
                      <div className="p-6 sm:p-8" style={{ background:`linear-gradient(150deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}28` }}>
                        <div className="text-center mb-6">
                          <p className="fb text-[9px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".5em" }}>DRESS CODE</p>
                          <h3 className="fd font-normal" style={{ fontSize:"clamp(18px,3.5vw,24px)",color:G.deep }}>Tata Busana</h3>
                          <p className="fb text-xs mt-1.5" style={{ color:G.muted }}>Mohon kenakan warna busana berikut</p>
                        </div>
                        <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
                          {W.dressCode.map((d,i)=>(
                            <motion.div key={d.label}
                              initial={{ opacity:0,scale:.8 }} whileInView={{ opacity:1,scale:1 }}
                              viewport={{ once:true }} transition={{ delay:i*.08,type:"spring",stiffness:200 }}
                              whileHover={{ y:-5 }} className="text-center">
                              <motion.div whileHover={{ scale:1.12 }}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full mx-auto mb-2 shadow-lg"
                                style={{ background:d.color,border:`2px solid ${G.gold}22` }}/>
                              <p className="fb text-[9px] font-semibold" style={{ color:G.deep }}>{d.label}</p>
                              <p className="fb text-[8px]" style={{ color:G.muted }}>{d.for}</p>
                            </motion.div>
                          ))}
                        </div>
                        <p className="fd italic text-center text-xs mt-5" style={{ color:G.muted }}>Hindari warna putih &amp; hitam penuh ✦</p>
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
                <section id="galeri" className="relative py-16 sm:py-24 overflow-hidden" style={{ background:G.deep }}>
                  <div className="text-center mb-10 sm:mb-14 px-5">
                    <Reveal><p className="fb text-[9px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".5em" }}>OUR GALLERY</p></Reveal>
                    <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                      style={{ fontSize:"clamp(28px,5.5vw,48px)",color:G.ivory,lineHeight:1.2 }}>
                      Momen Kami
                    </AnimHeading>
                    <Reveal delay={.2}><GLine className="w-14 mx-auto mt-5"/></Reveal>
                    <Reveal delay={.25}>
                      <p className="fd italic text-sm mt-3" style={{ color:`${G.ivory}45` }}>Geser atau seret untuk melihat semua foto</p>
                    </Reveal>
                  </div>
                  <Gallery onOpen={i=>openLb(i)}/>
                </section>

                {/* ══ HADIAH ══ */}
                <section className="relative px-5 sm:px-12 py-16 sm:py-24 overflow-hidden" style={{ background:G.ivory }}>
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-10">
                      <Reveal><p className="fb text-[9px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".5em" }}>AMPLOP DIGITAL</p></Reveal>
                      <AnimHeading delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(26px,5vw,42px)",color:G.deep,lineHeight:1.2 }}>
                        Hadiah &amp; Doa
                      </AnimHeading>
                      <Reveal delay={.2}><GLine className="w-14 mx-auto mt-5"/></Reveal>
                      <Reveal delay={.25}>
                        <p className="fd italic text-sm mt-5 px-2" style={{ color:G.muted }}>
                          Kehadiran dan doa restu Anda adalah hadiah terbesar. Namun bila berkenan:
                        </p>
                      </Reveal>
                    </div>

                    <div className="space-y-4 mb-6">
                      {W.bank.map((b,i)=>(
                        <Reveal key={b.no} delay={i*.12}>
                          <TiltCard>
                            <div className="relative overflow-hidden"
                              style={{ background:`linear-gradient(135deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}40` }}>
                              <div className="absolute inset-x-0 top-0 h-[2px]"
                                style={{ background:`linear-gradient(to right,transparent,${G.gold}66,transparent)` }}/>
                              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background:b.accent,opacity:.65 }}/>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 pl-6">
                                <div>
                                  <p className="fb text-[9px] font-semibold mb-1" style={{ color:G.gold,letterSpacing:".25em" }}>{b.name.toUpperCase()}</p>
                                  <p className="fd font-medium break-all" style={{ fontSize:"clamp(20px,5vw,28px)",color:G.deep }}>{b.no}</p>
                                  <p className="fb text-xs" style={{ color:G.muted }}>a.n. {b.an}</p>
                                </div>
                                <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.96 }}
                                  onClick={()=>copyBank(b.no)}
                                  className="fb shrink-0 self-start sm:self-center px-5 py-2.5 text-[9px] font-semibold transition-all duration-300"
                                  style={{ background:copied===b.no?G.gold:"transparent",color:copied===b.no?G.ivory:G.gold,border:`1px solid ${G.gold}60`,letterSpacing:".1em",minWidth:84 }}>
                                  {copied===b.no?"✓ COPIED":"SALIN"}
                                </motion.button>
                              </div>
                            </div>
                          </TiltCard>
                        </Reveal>
                      ))}
                    </div>

                    <Reveal delay={.2}>
                      <div className="mt-5 p-5 text-center" style={{ border:`1px dashed ${G.gold}40` }}>
                        <p className="fb text-[9px] font-semibold mb-1" style={{ color:G.gold,letterSpacing:".3em" }}>ATAU KIRIM KE ALAMAT</p>
                        <p className="fd italic text-base" style={{ color:G.deep }}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                        <p className="fb text-xs mt-0.5" style={{ color:G.muted }}>Jakarta Selatan, 12160</p>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave divider 3 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block",width:"100%",height:"auto" }}>
                    <path d="M0 50 Q300 0 600 30 Q900 60 1200 15 L1200 60 L0 60 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ RSVP ══ */}
                <section id="rsvp" className="relative py-16 sm:py-24 overflow-hidden" style={{ background:G.deep }}>
                  <div className="px-5 sm:px-12">
                    <div className="text-center mb-10">
                      <Reveal><p className="fb text-[9px] font-semibold mb-3" style={{ color:G.gold,letterSpacing:".5em" }}>RSVP</p></Reveal>
                      <AnimHeading dark delay={.1} className="fd font-light gsap-title block"
                        style={{ fontSize:"clamp(28px,5.5vw,46px)",color:G.ivory,lineHeight:1.2 }}>
                        Ucapan &amp; Doa
                      </AnimHeading>
                      <Reveal delay={.2}><GLine className="w-14 mx-auto mt-5"/></Reveal>
                      <Reveal delay={.25}>
                        <p className="fd italic text-sm mt-5" style={{ color:`${G.ivory}50` }}>Sampaikan ucapan terbaik Anda untuk kami</p>
                      </Reveal>
                    </div>

                    <div className="max-w-lg mx-auto">
                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div key="ok"
                            initial={{ opacity:0,scale:.9 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0 }}
                            className="text-center py-16" style={{ border:`1px solid ${G.gold}44` }}>
                            <p className="fs mb-3 float" style={{ fontSize:60,color:G.gold,lineHeight:1 }}>✉</p>
                            <p className="fd text-2xl mb-2" style={{ color:G.ivory }}>Terima Kasih</p>
                            <p className="fb text-xs" style={{ color:`${G.ivory}50` }}>Ucapan Anda telah tersimpan dengan indah</p>
                          </motion.div>
                        ) : (
                          <motion.form key="form"
                            initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                            onSubmit={submitRsvp}
                            className="space-y-3 p-5 sm:p-7 mb-7"
                            style={{ background:"rgba(255,252,247,.05)",border:`1px solid ${G.gold}30` }}>
                            <div className="h-px mb-5" style={{ background:`linear-gradient(to right,transparent,${G.gold}50,transparent)` }}/>
                            <input required value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})}
                              placeholder="Nama Anda" className="fb w-full px-4 py-3 text-sm"
                              style={{ background:"rgba(255,252,247,.07)",border:`1px solid ${G.gold}30`,color:G.ivory }}/>
                            <select value={form.hadir} onChange={e=>setForm({...form,hadir:e.target.value})}
                              className="fb w-full px-4 py-3 text-sm"
                              style={{ background:"rgba(26,21,17,.92)",border:`1px solid ${G.gold}30`,color:G.ivory }}>
                              <option value="Hadir">✓ Insya Allah Hadir</option>
                              <option value="Tidak Hadir">✗ Belum Bisa Hadir</option>
                            </select>
                            <textarea required rows={4} value={form.ucapan} onChange={e=>setForm({...form,ucapan:e.target.value})}
                              placeholder="Tulis ucapan dan doa untuk kedua mempelai..."
                              className="fb w-full px-4 py-3 text-sm resize-none"
                              style={{ background:"rgba(255,252,247,.07)",border:`1px solid ${G.gold}30`,color:G.ivory }}/>
                            <Magnetic onClick={()=>{}} className="w-full block">
                              <button type="submit" className="fb w-full py-3.5 text-xs font-semibold mt-1"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`,color:G.ivory,letterSpacing:".14em",display:"block",width:"100%" }}>
                                KIRIM UCAPAN
                              </button>
                            </Magnetic>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      {rsvps.length > 0 && (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          <AnimatePresence>
                            {rsvps.map(r=>(
                              <motion.div key={r.ts} layout
                                initial={{ opacity:0,x:-14 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0 }}
                                className="relative p-4" style={{ background:"rgba(255,252,247,.05)",border:`1px solid ${G.gold}20` }}>
                                <div className="absolute left-0 top-0 bottom-0 w-0.5"
                                  style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}55,${G.gold}00)` }}/>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                                  <p className="fd text-base font-medium" style={{ color:G.ivory }}>{r.nama}</p>
                                  <span className="fb text-[8px] font-semibold px-2.5 py-0.5 shrink-0"
                                    style={{ background:r.hadir==="Hadir"?`${G.gold}28`:`${G.rose}22`,color:r.hadir==="Hadir"?G.gold:G.rose,
                                      border:`1px solid ${r.hadir==="Hadir"?G.gold+"44":G.rose+"44"}`,letterSpacing:".08em" }}>
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
                    style={{ background:`radial-gradient(ellipse 130% 55% at 50% -5%,${G.rose}48,transparent 52%),${G.ivory}` }}/>
                  <div className="absolute bottom-5 left-5 opacity-14 hidden sm:block"><Corner pos="bl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-14 hidden sm:block"><Corner pos="br"/></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <Reveal>
                      <p className="fb text-[9px] font-semibold mb-7" style={{ color:G.gold,letterSpacing:".5em" }}>TERIMA KASIH</p>
                    </Reveal>

                    <div className="overflow-hidden mb-1">
                      <motion.span initial={{ y:"110%",opacity:0 }} whileInView={{ y:"0%",opacity:1 }}
                        viewport={{ once:true }} transition={{ duration:1,ease:[0.22,1,0.36,1] }}
                        className="fs gshim block" style={{ fontSize:"clamp(46px,10vw,76px)",lineHeight:1.15 }}>
                        Jazakumullah Khairan
                      </motion.span>
                    </div>

                    <Reveal delay={.15}>
                      <GLine className="w-20 mx-auto my-9"/>
                    </Reveal>

                    <Reveal delay={.2}>
                      <p className="fd italic leading-[1.95] mb-8 px-2" style={{ fontSize:"clamp(13px,2.2vw,16px)",color:G.muted }}>
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                        berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                      </p>
                    </Reveal>

                    <Reveal delay={.25}>
                      <p className="fd italic text-sm mb-2" style={{ color:G.muted }}>Kami yang berbahagia,</p>
                      <motion.h3 animate={{ opacity:[.85,1,.85] }} transition={{ duration:3,repeat:Infinity }}
                        className="fs" style={{ fontSize:"clamp(40px,8vw,58px)",color:G.deep }}>
                        {W.bride} &amp; {W.groom}
                      </motion.h3>
                    </Reveal>

                    <Reveal delay={.3}>
                      <GLine className="w-16 mx-auto my-9"/>
                      <Magnetic
                        href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}.`)}`}
                        className="fb inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-semibold"
                        style={{ background:"#25D366",color:"#fff",letterSpacing:".1em" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        BAGIKAN KE WHATSAPP
                      </Magnetic>
                    </Reveal>

                    <p className="fb text-[9px] mt-12" style={{ color:G.gold,opacity:.3,letterSpacing:".3em" }}>✦ MADE WITH LOVE ✦ 2024 ✦</p>
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
                whileHover={{ scale:1.12 }} whileTap={{ scale:.9 }}
                onClick={toggleMusic} aria-label={playing?"Pause music":"Play music"}
                className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[70] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`,boxShadow:`0 8px 30px rgba(192,144,80,.5)` }}>
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
                style={{ background:"rgba(26,21,17,.92)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)" }}>
                <motion.div
                  initial={{ scale:.88,opacity:0,y:20 }} animate={{ scale:1,opacity:1,y:0 }} exit={{ scale:.88,opacity:0 }}
                  transition={{ type:"spring",stiffness:240,damping:26 }}
                  onClick={e=>e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{ maxWidth:400,width:"100%",aspectRatio:"3/4",boxShadow:`0 40px 90px rgba(0,0,0,.6),0 0 0 1px ${G.gold}33` }}>
                  <AnimatePresence mode="wait">
                    <motion.img key={lightbox}
                      initial={{ opacity:0,x:lbDir*32 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:lbDir*-32 }}
                      transition={{ duration:.38 }}
                      src={W.gallery[lightbox].src} alt={W.gallery[lightbox].label} className="w-full h-full object-cover"/>
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 py-5 px-5"
                    style={{ background:"linear-gradient(to top,rgba(26,21,17,.9),transparent)" }}>
                    <p className="fd italic text-lg" style={{ color:G.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[9px] mt-1 font-semibold" style={{ color:G.goldL,letterSpacing:".12em" }}>
                      {String(lightbox+1).padStart(2,"0")} / {W.gallery.length}
                    </p>
                  </div>
                  <div className="absolute top-3 left-3 opacity-35 pointer-events-none"><Corner pos="tl"/></div>
                  <button onClick={()=>setLightbox(null)} aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center fb text-sm font-semibold"
                    style={{ background:"rgba(255,252,247,.18)",color:G.ivory,backdropFilter:"blur(6px)" }}>✕</button>
                  {lightbox > 0 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(-1); setLightbox(lightbox-1); }}
                      aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-xl"
                      style={{ background:"rgba(255,252,247,.15)",color:G.ivory,backdropFilter:"blur(4px)" }}>‹</button>
                  )}
                  {lightbox < W.gallery.length-1 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(1); setLightbox(lightbox+1); }}
                      aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-xl"
                      style={{ background:"rgba(255,252,247,.15)",color:G.ivory,backdropFilter:"blur(4px)" }}>›</button>
                  )}
                </motion.div>

                {/* Thumbnail strip */}
                <motion.div initial={{ opacity:0,y:14 }} animate={{ opacity:1,y:0 }} transition={{ delay:.15 }}
                  onClick={e=>e.stopPropagation()}
                  className="flex gap-1.5 px-4 py-2 flex-wrap justify-center max-w-sm"
                  style={{ background:"rgba(26,21,17,.55)",backdropFilter:"blur(8px)" }}>
                  {W.gallery.map((_,i)=>(
                    <button key={i} onClick={e=>{ e.stopPropagation(); setLbDir(i>lightbox!?1:-1); setLightbox(i); }}
                      aria-label={`Photo ${i+1}`}
                      className="overflow-hidden transition-all duration-300 shrink-0"
                      style={{ width:i===lightbox?40:28,height:40,opacity:i===lightbox?1:.45,outline:i===lightbox?`1.5px solid ${G.gold}`:undefined }}>
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
