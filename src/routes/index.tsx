import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  motion, AnimatePresence,
  useScroll, useSpring,
  useMotionValue, useTransform,
} from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EmblaCarousel from "embla-carousel-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);
export const Route = createFileRoute("/")({ component: Index });

/* ─── PALETTE ─── */
const G = {
  gold:"#C09050", goldL:"#E0C080", goldD:"#8A6030", goldXL:"#F4D898",
  deep:"#0E0C0A", ivory:"#FFFCF7", cream:"#FDF8F0",
  muted:"#7A6A58", rose:"#D4A8A0",
};

/* ─── DATA ─── */
const W = {
  bride:"Anis", brideFull:"Anis Permata Sari",
  brideParents:"Bapak Suryanto & Ibu Hartini",
  groom:"Fadli", groomFull:"Fadli Ahmad Rahman",
  groomParents:"Bapak Mahmud & Ibu Siti Aminah",
  dateText:"Sabtu, 27 April 2024",
  date:"2024-04-27T08:00:00+07:00",
  verse:"وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا",
  verseSub:"QS. Ar-Rum : 21",
  verseId:"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan-pasangan dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya.",
  akad:{ time:"08.00 – 10.00 WIB", place:"Masjid Al-Hikmah", addr:"Jl. Raya Kebayoran Lama No.32, Jakarta Selatan", maps:"https://maps.google.com/?q=Masjid+Al-Hikmah+Jakarta" },
  resepsi:{ time:"11.00 – 14.00 WIB", place:"The Sultan Ballroom", addr:"Jl. Gatot Subroto, Senayan, Jakarta Pusat", maps:"https://maps.google.com/?q=Sultan+Hotel+Jakarta" },
  music:["https://cdn.pixabay.com/download/audio/2022/10/30/audio_347111d654.mp3"],
  story:[
    { year:"2019", num:"01", title:"Pertemuan\nPertama", sub:"Sebuah senyum yang mengubah segalanya", body:"Kami bertemu pertama kali di acara orientasi kampus. Satu tatapan yang tak sengaja, menjadi awal dari cerita yang paling indah dalam hidup kami.", img:"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&h=1100&q=90&fit=crop" },
    { year:"2021", num:"02", title:"Jatuh\nCinta", sub:"Dua hati yang akhirnya bicara", body:"Dua tahun persahabatan yang dalam, perlahan berubah menjadi cinta yang tulus. Kami tahu, ini adalah sesuatu yang sangat istimewa.", img:"https://images.unsplash.com/photo-1529635696947-b3f8c0d35b3c?w=900&h=1100&q=90&fit=crop" },
    { year:"2023", num:"03", title:"Lamaran\nBali", sub:"Momen yang paling dinantikan", body:"Di tepi pantai Bali, saat matahari tenggelam, Fadli berlutut dan bertanya, 'Maukah kamu menjadi teman hidupku?' Anis menjawab dengan air mata bahagia.", img:"https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=900&h=1100&q=90&fit=crop" },
    { year:"2024", num:"04", title:"Hari\nBahagia", sub:"Selamanya dimulai hari ini", body:"27 April 2024 — hari yang selalu kami impikan. Bersama keluarga dan sahabat tercinta, kami resmi menyatukan dua jiwa dalam ikatan suci.", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=900&h=1100&q=90&fit=crop" },
  ],
  gallery:[
    { src:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1100&h=1400&q=90&fit=crop", label:"Momen Pertama" },
    { src:"https://images.unsplash.com/photo-1529636798458-92182e662485?w=1100&h=700&q=90&fit=crop", label:"Dalam Kebun" },
    { src:"https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1100&h=1400&q=90&fit=crop", label:"Cincin Kami" },
    { src:"https://images.unsplash.com/photo-1511285560929-80b456503681?w=1100&h=700&q=90&fit=crop", label:"Tarian Pertama" },
    { src:"https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1100&h=1400&q=90&fit=crop", label:"Dekorasi Akad" },
    { src:"https://images.unsplash.com/photo-1583939411023-14783179e581?w=1100&h=700&q=90&fit=crop", label:"Bunga Cinta" },
    { src:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1100&h=1400&q=90&fit=crop", label:"Bersama" },
    { src:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1100&h=700&q=90&fit=crop", label:"Pengantin" },
  ],
  bank:[
    { name:"Bank BCA", no:"1234 5678 9012", an:"Anis Permata Sari", color:"#1565C0" },
    { name:"Bank Mandiri", no:"9876 5432 1098", an:"Fadli Ahmad Rahman", color:"#E65100" },
  ],
  dressCode:[
    { color:"#C8BA9E", label:"Sage Linen", for:"Tamu Pria" },
    { color:"#D4B8B0", label:"Dusty Blush", for:"Tamu Wanita" },
    { color:"#E0D8CC", label:"Ivory Cream", for:"Keluarga" },
    { color:"#8FA087", label:"Muted Sage", for:"Keluarga" },
  ],
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
function useCountdown(target:string) {
  const [now,setNow]=useState(Date.now);
  useEffect(()=>{ const id=setInterval(()=>setNow(Date.now()),1000); return()=>clearInterval(id); },[]);
  const diff=Math.max(0,new Date(target).getTime()-now);
  return{ d:Math.floor(diff/86400000), h:Math.floor((diff%86400000)/3600000), m:Math.floor((diff%3600000)/60000), s:Math.floor((diff%60000)/1000) };
}
function useMouseParallax() {
  const mx=useMotionValue(0), my=useMotionValue(0);
  useEffect(()=>{
    const h=(e:MouseEvent)=>{ mx.set((e.clientX/window.innerWidth-.5)*2); my.set((e.clientY/window.innerHeight-.5)*2); };
    window.addEventListener("mousemove",h);
    return()=>window.removeEventListener("mousemove",h);
  },[mx,my]);
  return { mx, my };
}

/* ─── SVG ATOMS ─── */
function Corner({ pos, size=48, op=".55" }:{ pos:"tl"|"tr"|"bl"|"br"; size?:number; op?:string }) {
  const deg={tl:0,tr:90,br:180,bl:270};
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ transform:`rotate(${deg[pos]}deg)`, opacity:Number(op) }}>
      <path d="M3 3L24 3" stroke={G.gold} strokeWidth=".8"/><path d="M3 3L3 24" stroke={G.gold} strokeWidth=".8"/>
      <circle cx="3" cy="3" r="2.5" fill={G.gold}/><circle cx="24" cy="3" r="1" fill={G.gold} opacity=".4"/>
      <circle cx="3" cy="24" r="1" fill={G.gold} opacity=".4"/>
    </svg>
  );
}
function OrnRing({ size=220, op=1 }:{ size?:number; op?:number }) {
  const cx=size/2, r1=cx-4, r2=cx-18, r3=cx-32;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ opacity:op }}>
      <circle cx={cx} cy={cx} r={r1} stroke={G.gold} strokeWidth=".5" strokeDasharray="2 8" opacity=".45"/>
      <circle cx={cx} cy={cx} r={r2} stroke={G.gold} strokeWidth=".7" opacity=".55"/>
      <circle cx={cx} cy={cx} r={r3} stroke={G.gold} strokeWidth=".4" strokeDasharray="1 7" opacity=".3"/>
      <circle cx={cx} cy={cx} r="3" fill={G.gold} opacity=".6"/>
      {[0,60,120,180,240,300].map((d,i)=>{const a=d*Math.PI/180,x=cx+r2*Math.cos(a),y=cx+r2*Math.sin(a);return<circle key={i} cx={x} cy={y} r="2" fill={G.gold} opacity=".5"/>;})}
      {[0,45,90,135,180,225,270,315].map((d,i)=>{const a=d*Math.PI/180,x=cx+r1*Math.cos(a),y=cx+r1*Math.sin(a);return<path key={i} d={`M${x} ${y-3.5}L${x+2.5} ${y}L${x} ${y+3.5}L${x-2.5} ${y}Z`} fill={G.gold} opacity=".4"/>;})}
    </svg>
  );
}
function FlDiv({ light=false }:{ light?:boolean }) {
  const c=light?G.goldL:G.gold;
  return (
    <svg viewBox="0 0 380 36" fill="none" style={{ width:"100%", maxWidth:380, display:"block" }}>
      <line x1="0" y1="18" x2="148" y2="18" stroke={c} strokeWidth=".5" opacity=".3"/>
      <line x1="232" y1="18" x2="380" y2="18" stroke={c} strokeWidth=".5" opacity=".3"/>
      <ellipse cx="174" cy="18" rx="22" ry="10" fill={c} opacity=".22"/>
      <ellipse cx="206" cy="18" rx="22" ry="10" fill={c} opacity=".22"/>
      <circle cx="190" cy="18" r="7" stroke={c} strokeWidth="1.2" opacity=".75"/><circle cx="190" cy="18" r="2.8" fill={c} opacity=".7"/>
      <circle cx="144" cy="18" r="2.2" fill={c} opacity=".45"/><circle cx="236" cy="18" r="2.2" fill={c} opacity=".45"/>
    </svg>
  );
}

/* ─── REVEAL ─── */
function Reveal({ children, delay=0, y=30, className="", style={} }:{
  children:React.ReactNode; delay?:number; y?:number; className?:string; style?:React.CSSProperties;
}) {
  return (
    <motion.div initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}}
      transition={{duration:1,delay,ease:[0.22,1,0.36,1]}} className={className} style={style}>
      {children}
    </motion.div>
  );
}

/* ─── CLIP REVEAL ─── (images reveal from left with a sliding curtain) */
function ClipReveal({ src, alt, delay=0, style={}, className="" }:{
  src:string; alt:string; delay?:number; style?:React.CSSProperties; className?:string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <motion.div
        initial={{ clipPath:"inset(0 100% 0 0)" }}
        whileInView={{ clipPath:"inset(0 0% 0 0)" }}
        viewport={{ once:true, amount:0.15 }}
        transition={{ duration:1.25, delay, ease:[0.76,0,0.24,1] }}
        className="w-full h-full"
      >
        <motion.img src={src} alt={alt} className="w-full h-full object-cover"
          initial={{ scale:1.15 }} whileInView={{ scale:1 }} viewport={{ once:true }}
          transition={{ duration:1.6, delay:delay+.1, ease:[0.22,1,0.36,1] }}/>
      </motion.div>
    </div>
  );
}

/* ─── MAGNETIC ─── */
function Mag({ children, className="", style={}, onClick, href }:{
  children:React.ReactNode; className?:string; style?:React.CSSProperties; onClick?:()=>void; href?:string;
}) {
  const ref=useRef<HTMLDivElement>(null);
  const x=useMotionValue(0), y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:150,damping:16}), sy=useSpring(y,{stiffness:150,damping:16});
  const mv=(e:React.MouseEvent)=>{ if(!ref.current)return; const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.3); y.set((e.clientY-r.top-r.height/2)*.3); };
  const ml=()=>{ x.set(0); y.set(0); };
  const Tag=href?"a":"button";
  return (
    <div ref={ref} onMouseMove={mv} onMouseLeave={ml} className="inline-block">
      <motion.div style={{x:sx,y:sy}}>
        <Tag {...(href?{href,target:"_blank",rel:"noreferrer"}:{onClick})} className={className} style={style}>{children}</Tag>
      </motion.div>
    </div>
  );
}

/* ─── CONTEXT CURSOR ─── */
function Cursor({ cursorLabel }:{ cursorLabel:string }) {
  const cx=useMotionValue(-200), cy=useMotionValue(-200);
  const sx=useSpring(cx,{stiffness:220,damping:22}), sy=useSpring(cy,{stiffness:220,damping:22});
  const rx=useSpring(cx,{stiffness:60,damping:14}), ry=useSpring(cy,{stiffness:60,damping:14});
  const [hov,setHov]=useState(false);
  const [click,setClick]=useState(false);
  useEffect(()=>{
    const mv=(e:MouseEvent)=>{ cx.set(e.clientX); cy.set(e.clientY); };
    const mo=(e:MouseEvent)=>{ if((e.target as HTMLElement).closest("a,button,[data-hover]"))setHov(true); };
    const mu=()=>setHov(false), md=()=>setClick(true), mup=()=>setClick(false);
    window.addEventListener("mousemove",mv); window.addEventListener("mouseover",mo);
    window.addEventListener("mouseout",mu); window.addEventListener("mousedown",md); window.addEventListener("mouseup",mup);
    return()=>{ window.removeEventListener("mousemove",mv); window.removeEventListener("mouseover",mo); window.removeEventListener("mouseout",mu); window.removeEventListener("mousedown",md); window.removeEventListener("mouseup",mup); };
  },[]);
  const ringSize=hov||cursorLabel?64:28, dotSize=click?3:hov||cursorLabel?0:8;
  return (
    <div className="fixed inset-0 z-[199] pointer-events-none hidden lg:block" aria-hidden="true">
      {/* Dot */}
      <motion.div className="absolute rounded-full" style={{ x:sx, y:sy, marginLeft:-dotSize/2, marginTop:-dotSize/2, width:dotSize, height:dotSize, background:G.gold }} animate={{ width:dotSize, height:dotSize, marginLeft:-dotSize/2, marginTop:-dotSize/2 }} transition={{ type:"spring",stiffness:500,damping:35 }}/>
      {/* Ring */}
      <motion.div className="absolute rounded-full flex items-center justify-center"
        style={{ x:rx, y:ry, marginLeft:-ringSize/2, marginTop:-ringSize/2 }}
        animate={{ width:ringSize, height:ringSize, marginLeft:-ringSize/2, marginTop:-ringSize/2, borderColor: hov||cursorLabel?G.gold:`${G.gold}60`, opacity:1 }}
        transition={{ type:"spring",stiffness:180,damping:22 }}>
        <div className="rounded-full border" style={{ width:"100%", height:"100%", borderColor:"inherit" }}/>
        {(hov||cursorLabel) && (
          <motion.span initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="absolute fb text-[6px] font-semibold" style={{ color:G.gold, letterSpacing:".2em" }}>
            {cursorLabel||"VIEW"}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}

/* ─── SCROLL BAR ─── */
function ScrollBar() {
  const {scrollYProgress}=useScroll();
  const scaleX=useSpring(scrollYProgress,{stiffness:100,damping:30});
  return <motion.div className="fixed top-0 left-0 right-0 z-[60] origin-left" style={{ height:2, scaleX, background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldXL})` }}/>;
}

/* ─── SPLIT-SCREEN LOADER ─── */
function Loader({ onDone }:{ onDone:()=>void }) {
  const el=useRef<HTMLDivElement>(null);
  const [count,setCount]=useState(0);

  useEffect(()=>{
    let v=0;
    const id=setInterval(()=>{ v=Math.min(100,v+(100-v)*.08+.5); setCount(Math.round(v)); if(Math.round(v)>=100)clearInterval(id); },40);
    return()=>clearInterval(id);
  },[]);

  useGSAP(()=>{
    const tl=gsap.timeline({ onComplete:onDone, delay:.2 });
    tl.fromTo(".ldr-top",{y:0},{y:"-100%",duration:1.15,ease:"expo.inOut"},2.2)
      .fromTo(".ldr-bot",{y:0},{y:"100%",duration:1.15,ease:"expo.inOut"},2.2)
      .fromTo(".ldr-mid",{opacity:1},{opacity:0,duration:.4},2.1);
  },{ scope:el });

  return (
    <div ref={el} className="fixed inset-0 z-[200]" aria-hidden="true">
      {/* Top half */}
      <div className="ldr-top absolute inset-x-0 top-0 h-1/2 flex flex-col justify-end items-center pb-4"
        style={{ background:G.deep, zIndex:2 }}>
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 90% 120% at 50% 100%,${G.gold}12,transparent 60%)` }}/>
        <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{delay:.35,duration:.9}}>
          <span className="fb text-[8px] font-semibold" style={{ color:G.goldL, letterSpacing:".62em" }}>THE WEDDING OF</span>
        </motion.div>
        <div className="overflow-hidden mt-2">
          <motion.div initial={{y:"110%"}} animate={{y:0}} transition={{delay:.55,duration:1.1,ease:[0.22,1,0.36,1]}}>
            <span className="fs block" style={{ fontSize:"clamp(64px,13vw,108px)", color:G.ivory, lineHeight:.95, textShadow:`0 0 60px ${G.gold}28` }}>
              {W.bride}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom half */}
      <div className="ldr-bot absolute inset-x-0 bottom-0 h-1/2 flex flex-col justify-start items-center pt-4"
        style={{ background:G.deep, zIndex:2 }}>
        <div className="overflow-hidden">
          <motion.div initial={{y:"-110%"}} animate={{y:0}} transition={{delay:.55,duration:1.1,ease:[0.22,1,0.36,1]}}>
            <span className="fs block" style={{ fontSize:"clamp(64px,13vw,108px)", color:G.ivory, lineHeight:.95, textShadow:`0 0 60px ${G.gold}28` }}>
              {W.groom}
            </span>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{delay:.9,duration:.8}} className="mt-4">
          <span className="fd italic text-sm" style={{ color:`${G.ivory}45` }}>{W.dateText}</span>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 pb-6">
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:1,duration:1.4,ease:"power2.inOut"}}
            className="flex-1 mr-6 h-px origin-left" style={{ background:`linear-gradient(to right,${G.gold}00,${G.gold}55)` }}/>
          <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1,duration:.8}}
            className="fd text-6xl sm:text-7xl font-light shrink-0" style={{ color:`${G.ivory}18`, lineHeight:1 }}>
            {String(count).padStart(3,"0")}
          </motion.span>
          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:1,duration:1.4,ease:"power2.inOut"}}
            className="flex-1 ml-6 h-px origin-right" style={{ background:`linear-gradient(to left,${G.gold}00,${G.gold}55)` }}/>
        </div>
      </div>

      {/* Center divider line */}
      <div className="ldr-mid absolute inset-x-0 top-1/2 -translate-y-px z-[3] pointer-events-none" style={{ height:1, background:`linear-gradient(to right,transparent,${G.gold}80,transparent)` }}/>
    </div>
  );
}

/* ─── GALLERY EMBLA ─── */
function Gallery({ onOpen, onEnter, onLeave }:{ onOpen:(i:number)=>void; onEnter:()=>void; onLeave:()=>void }) {
  const [emblaRef,emblaApi]=EmblaCarousel({ loop:true, dragFree:true, align:"start" });
  const [sel,setSel]=useState(0);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(()=>{
    if(!emblaApi)return;
    emblaApi.on("select",()=>setSel(emblaApi.selectedScrollSnap()));
    const start=()=>{ timer.current=setInterval(()=>emblaApi.scrollNext(),4000); };
    const stop=()=>{ if(timer.current){clearInterval(timer.current);timer.current=null;} };
    start(); emblaApi.on("pointerDown",stop); emblaApi.on("pointerUp",()=>{ stop();start(); });
    return()=>stop();
  },[emblaApi]);
  return (
    <div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background:`linear-gradient(to right,${G.deep},transparent)` }}/>
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background:`linear-gradient(to left,${G.deep},transparent)` }}/>
        <div ref={emblaRef} className="overflow-hidden select-none" style={{ cursor:"none" }}>
          <div className="flex gap-3 sm:gap-5 pl-6 sm:pl-12">
            {W.gallery.map((ph,i)=>(
              <motion.button key={i}
                initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                transition={{delay:Math.min(i*.07,.35),duration:.9,ease:[0.22,1,0.36,1]}}
                onClick={()=>onOpen(i)} onMouseEnter={onEnter} onMouseLeave={onLeave}
                data-hover="true"
                className="relative overflow-hidden shrink-0 group"
                style={{ width:"clamp(190px,24vw,295px)", aspectRatio:"3/4" }}>
                <img src={ph.src} alt={ph.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  style={{ filter:"brightness(.85) saturate(1.1)" }}/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(14,12,10,.95) 0%,rgba(14,12,10,.08) 50%,transparent 100%)" }}/>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`radial-gradient(ellipse at center,${G.gold}14,transparent 65%)` }}/>
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" style={{ background:`linear-gradient(to right,transparent,${G.goldL},transparent)` }}/>
                <div className="absolute bottom-0 inset-x-0 px-5 pb-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="fb text-[7px] font-semibold mb-1" style={{ color:G.goldL, letterSpacing:".22em" }}>{String(i+1).padStart(2,"0")}</p>
                  <p className="fd italic text-lg" style={{ color:G.ivory }}>{ph.label}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {W.gallery.map((_,i)=>(
          <motion.button key={i} onClick={()=>emblaApi?.scrollTo(i)}
            animate={{ width:i===sel?32:8, background:i===sel?G.gold:`${G.ivory}20` }}
            transition={{duration:.35,ease:[0.22,1,0.36,1]}}
            style={{ height:8, borderRadius:4, padding:0, border:"none", cursor:"none" }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
function Index() {
  const guest=useGuestName();
  const [loaded,setLoaded]=useState(false);
  const [opened,setOpened]=useState(false);
  const cd=useCountdown(W.date);
  const [playing,setPlaying]=useState(false);
  const audioRef=useRef<HTMLAudioElement>(null);
  const [lightbox,setLightbox]=useState<number|null>(null);
  const [lbDir,setLbDir]=useState(1);
  const [activeNav,setActiveNav]=useState("pembukaan");
  const [rsvps,setRsvps]=useState<Rsvp[]>([]);
  const [form,setForm]=useState({nama:"",hadir:"Hadir",ucapan:""});
  const [submitted,setSubmitted]=useState(false);
  const [copied,setCopied]=useState<string|null>(null);
  const [cursorLabel,setCursorLabel]=useState("");
  const lenisRef=useRef<unknown>(null);
  const storyWrapRef=useRef<HTMLDivElement>(null);
  const storyTrackRef=useRef<HTMLDivElement>(null);
  const coverPhotoRef=useRef<HTMLDivElement>(null);
  const { mx:pmx, my:pmy }=useMouseParallax();

  /* Parallax transforms for cover layers */
  const pl1x=useTransform(pmx,[-1,1],[-18,18]);
  const pl1y=useTransform(pmy,[-1,1],[-12,12]);
  const pl2x=useTransform(pmx,[-1,1],[-10,10]);
  const pl2y=useTransform(pmy,[-1,1],[-7,7]);
  const pl3x=useTransform(pmx,[-1,1],[-5,5]);
  const pl3y=useTransform(pmy,[-1,1],[-4,4]);

  /* Lenis */
  useEffect(()=>{
    if(!opened||typeof window==="undefined")return;
    let lenis:unknown;
    import("lenis").then(({default:Lenis})=>{
      lenis=new Lenis({ lerp:.078, smoothWheel:true, wheelMultiplier:.86 });
      lenisRef.current=lenis;
      const raf=(t:number)=>{ (lenis as{raf:(t:number)=>void}).raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      (lenis as{on:(e:string,cb:()=>void)=>void}).on("scroll",ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(document.documentElement,{
        scrollTop(v?:number){ if(v!==undefined)(lenis as{scrollTo:(v:number)=>void}).scrollTo(v); return(lenis as{scroll:number}).scroll; },
        getBoundingClientRect(){ return{top:0,left:0,width:window.innerWidth,height:window.innerHeight}; },
      });
      ScrollTrigger.refresh();
    });
    return()=>{ if(lenis)(lenis as{destroy:()=>void}).destroy(); };
  },[opened]);

  /* Horizontal story scroll */
  useGSAP(()=>{
    if(!opened||!storyWrapRef.current||!storyTrackRef.current)return;
    const track=storyTrackRef.current;
    const totalX=track.scrollWidth-window.innerWidth;
    if(totalX<=0)return;
    gsap.to(track,{
      x:-totalX, ease:"none",
      scrollTrigger:{ trigger:storyWrapRef.current, start:"top top", end:`+=${totalX}`, scrub:1.2, pin:true, anticipatePin:1 },
    });
  },{ dependencies:[opened], scope:storyWrapRef });

  /* Nav intersection */
  useEffect(()=>{
    if(!opened)return;
    const ids=["pembukaan","cerita","acara","galeri","rsvp"];
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting)setActiveNav(e.target.id); });
    },{ rootMargin:"-35% 0px -55% 0px" });
    ids.forEach(id=>{ const el=document.getElementById(id); if(el)obs.observe(el); });
    return()=>obs.disconnect();
  },[opened]);

  useEffect(()=>{ try{ const r=localStorage.getItem("rsvps"); if(r)setRsvps(JSON.parse(r)); }catch{} },[]);
  const tryPlay=()=>audioRef.current?.play().then(()=>setPlaying(true)).catch(()=>{});
  useEffect(()=>{ if(opened)tryPlay(); },[opened]);
  const toggleMusic=()=>{ const a=audioRef.current; if(!a)return; if(playing){a.pause();setPlaying(false);}else tryPlay(); };
  const openInvitation=()=>{ setOpened(true); requestAnimationFrame(()=>window.scrollTo({top:0})); };
  const submitRsvp=(e:React.FormEvent)=>{
    e.preventDefault();
    if(!form.nama.trim()||!form.ucapan.trim())return;
    const next=[{...form,ts:Date.now()},...rsvps];
    setRsvps(next); try{localStorage.setItem("rsvps",JSON.stringify(next));}catch{}
    setForm({nama:"",hadir:"Hadir",ucapan:""}); setSubmitted(true); setTimeout(()=>setSubmitted(false),3500);
  };
  const copyBank=(no:string)=>{ navigator.clipboard?.writeText(no.replace(/\s/g,"")).catch(()=>{}); setCopied(no); setTimeout(()=>setCopied(null),2500); };
  const scrollTo=(id:string)=>{
    setActiveNav(id);
    if(lenisRef.current){ const el=document.getElementById(id); if(el)(lenisRef.current as{scrollTo:(el:Element,opts:{offset:number})=>void}).scrollTo(el,{offset:-60}); }
    else document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  };

  const navItems=[{id:"pembukaan",label:"Pasangan"},{id:"cerita",label:"Kisah"},{id:"acara",label:"Acara"},{id:"galeri",label:"Galeri"},{id:"rsvp",label:"RSVP"}];

  /* ─── GLOBAL STYLES ─── */
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box}
    html{-webkit-text-size-adjust:100%;scroll-behavior:auto}
    body{font-family:'Montserrat',sans-serif;background:${G.ivory};color:${G.deep};margin:0;padding:0;overflow-x:hidden}
    @media(hover:hover) and (pointer:fine){body{cursor:none}*{cursor:none!important}}
    .fs{font-family:'Great Vibes',cursive}
    .fd{font-family:'Cormorant Garamond',Georgia,serif}
    .fb{font-family:'Montserrat',sans-serif}
    ::-webkit-scrollbar{width:2px;height:2px}
    ::-webkit-scrollbar-thumb{background:${G.gold}55;border-radius:2px}

    /* Grain */
    #grain{position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.032;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='280' height='280'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      mix-blend-mode:overlay}

    /* Gold shimmer text */
    @keyframes shimG{0%{background-position:-300% 0}100%{background-position:300% 0}}
    .gshim{background:linear-gradient(90deg,${G.goldD} 0%,${G.gold} 22%,${G.goldXL} 48%,${G.gold} 74%,${G.goldD} 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimG 7s linear infinite}

    /* Marquee */
    @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .mq-inner{display:flex;animation:mq 28s linear infinite;width:max-content}
    .mq-inner:hover{animation-play-state:paused}

    /* Animations */
    @keyframes rotS{to{transform:rotate(360deg)}} .rot-s{animation:rotS 44s linear infinite}
    @keyframes rotC{to{transform:rotate(-360deg)}} .rot-c{animation:rotC 58s linear infinite}
    @keyframes vspin{to{transform:rotate(360deg)}} .vspin{animation:vspin 3.5s linear infinite}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}} .float{animation:floatY 6s ease-in-out infinite}

    /* Button shimmer */
    @keyframes gSh{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .btn-sh{background:linear-gradient(90deg,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD});background-size:200% auto;animation:gSh 4s linear infinite}

    /* Pulse */
    @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${G.gold}65}70%{box-shadow:0 0 0 24px ${G.gold}00}}
    .btn-pulse{animation:pulse2 3.2s ease-out infinite}

    /* Nav underline */
    .ni{position:relative;padding-bottom:3px}
    .ni::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:${G.gold};transform:scaleX(0);transform-origin:left;transition:transform .3s ease}
    .ni.active::after{transform:scaleX(1)}

    /* Form */
    input,select,textarea{font-family:'Montserrat',sans-serif;-webkit-appearance:none;border-radius:0}
    input::placeholder,textarea::placeholder{color:${G.ivory}38}
    input:focus,select:focus,textarea:focus{outline:none;box-shadow:0 0 0 1.5px ${G.gold}99!important}
    select option{background:${G.deep};color:${G.ivory}}

    /* Hover lift */
    .hl{transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s ease}
    .hl:hover{transform:translateY(-9px);box-shadow:0 36px 88px rgba(192,144,80,.24)!important}

    /* Gallery */
    .g-card{transition:box-shadow .5s ease}
    .g-card:hover{box-shadow:0 44px 88px rgba(14,12,10,.6),0 0 0 1px ${G.gold}40!important}

    /* Story horizontal slides */
    .s-slide{width:100vw;flex-shrink:0;height:100vh}

    /* RSVP feed */
    .rfeed{scrollbar-width:thin;scrollbar-color:${G.gold}44 transparent}
    .rfeed::-webkit-scrollbar{width:2px}
    .rfeed::-webkit-scrollbar-thumb{background:${G.gold}55}

    /* Portrait */
    .pf::before{content:'';position:absolute;inset:9px;border:1px solid ${G.gold}28;pointer-events:none;z-index:2}

    /* Section big bg number */
    .sec-num{position:absolute;pointer-events:none;font-family:'Cormorant Garamond',serif;font-weight:300;opacity:.045;line-height:1;user-select:none}

    img{transition:opacity .35s ease}
  `;

  return (
    <>
      <style>{css}</style>
      <div id="grain" aria-hidden="true"/>
      <Cursor cursorLabel={cursorLabel}/>
      {!loaded && <Loader onDone={()=>setLoaded(true)}/>}

      {loaded && (
        <div className="w-full min-h-screen relative">

          {/* ═════ COVER ═════ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div key="cover"
                initial={{opacity:1}}
                exit={{ clipPath:"inset(0 0 100% 0)", transition:{duration:1.4,ease:[0.76,0,0.24,1]} }}
                className="fixed inset-0 z-50 overflow-hidden flex">
                {/* ── Left: full bleed photo with mouse parallax ── */}
                <div className="hidden lg:block w-[58%] relative overflow-hidden">
                  {/* Parallax layer 1 — photo */}
                  <motion.div style={{ x:pl1x, y:pl1y, position:"absolute", inset:"-5%" }}>
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=95&fit=crop"
                      alt="Wedding" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} loading="eager"/>
                  </motion.div>
                  {/* Parallax layer 2 — dark vignette */}
                  <motion.div style={{ x:pl2x, y:pl2y, position:"absolute", inset:"-3%" }}
                    className="pointer-events-none" aria-hidden="true">
                    <div style={{ width:"100%", height:"100%", background:"linear-gradient(115deg,rgba(14,12,10,.06) 0%,rgba(14,12,10,.78) 100%)" }}/>
                  </motion.div>
                  {/* Parallax layer 3 — ornament ring */}
                  <motion.div style={{ x:pl3x, y:pl3y }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rot-s pointer-events-none" aria-hidden="true">
                    <OrnRing size={440} op={.06}/>
                  </motion.div>
                  {/* Letterbox bars */}
                  <div className="absolute inset-x-0 top-0 h-16 pointer-events-none" style={{ background:"linear-gradient(to bottom,rgba(14,12,10,.88),transparent)" }}/>
                  <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background:"linear-gradient(to top,rgba(14,12,10,.88),transparent)" }}/>
                  {/* Main text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-20">
                    <motion.p initial={{opacity:0,letterSpacing:".05em"}} animate={{opacity:1,letterSpacing:".58em"}}
                      transition={{delay:.5,duration:1.6}} className="fb text-[7.5px] font-semibold mb-14" style={{color:`${G.ivory}70`}}>
                      THE WEDDING OF
                    </motion.p>
                    <div style={{overflow:"hidden"}}>
                      <motion.h1 initial={{y:"115%",skewY:5}} animate={{y:0,skewY:0}}
                        transition={{delay:.75,duration:1.35,ease:[0.22,1,0.36,1]}}
                        className="fs block" style={{fontSize:"clamp(80px,11vw,130px)",color:G.ivory,lineHeight:.95,textShadow:"0 12px 50px rgba(0,0,0,.55)"}}>
                        {W.bride}
                      </motion.h1>
                    </div>
                    <motion.div initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}} transition={{delay:1.1,duration:1.1}}
                      className="flex items-center gap-6 my-5">
                      <div style={{width:60,height:.8,opacity:.38,background:G.goldL}}/>
                      <span className="fd italic" style={{fontSize:28,color:G.goldL}}>&amp;</span>
                      <div style={{width:60,height:.8,opacity:.38,background:G.goldL}}/>
                    </motion.div>
                    <div style={{overflow:"hidden"}}>
                      <motion.h1 initial={{y:"115%",skewY:-5}} animate={{y:0,skewY:0}}
                        transition={{delay:1.05,duration:1.35,ease:[0.22,1,0.36,1]}}
                        className="fs block" style={{fontSize:"clamp(80px,11vw,130px)",color:G.ivory,lineHeight:.95,textShadow:"0 12px 50px rgba(0,0,0,.55)"}}>
                        {W.groom}
                      </motion.h1>
                    </div>
                    <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:1.7,duration:1.1}}
                      className="fd italic mt-12" style={{fontSize:"clamp(13px,1.6vw,18px)",color:`${G.ivory}55`}}>
                      {W.dateText}
                    </motion.p>
                  </div>
                  {/* Corner marks */}
                  <div className="absolute top-5 left-5"><Corner pos="tl" op=".55"/></div>
                  <div className="absolute bottom-5 right-5"><Corner pos="br" op=".55"/></div>
                  <div className="absolute top-5 right-5"><Corner pos="tr" op=".22"/></div>
                  <div className="absolute bottom-5 left-5"><Corner pos="bl" op=".22"/></div>
                  {/* Ambient dots */}
                  {[{t:"10%",l:"7%",d:0},{t:"85%",l:"5%",d:1.5},{t:"12%",l:"90%",d:.8},{t:"80%",l:"88%",d:2.2}].map((s,i)=>(
                    <motion.div key={i} style={{position:"absolute",top:s.t,left:s.l,width:7,height:7,borderRadius:"50%",background:G.goldL,pointerEvents:"none"}}
                      animate={{opacity:[.12,.28,.12],scale:[1,1.5,1]}} transition={{duration:6+i,repeat:Infinity,delay:s.d}}/>
                  ))}
                </div>

                {/* ── Right: invitation card ── */}
                <div className="w-full lg:w-[42%] h-full flex items-center justify-center px-5 py-10 sm:px-10 relative overflow-hidden"
                  style={{background:G.ivory}}>
                  {/* Mobile photo bg */}
                  <div className="lg:hidden absolute inset-0 pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&fit=crop" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",inset:0,background:"rgba(255,252,247,.9)"}}/>
                  </div>
                  <div className="hidden lg:block absolute inset-0 pointer-events-none"
                    style={{background:`radial-gradient(ellipse 200% 80% at 55% -15%,${G.rose}55,transparent 48%)`}}/>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rot-s pointer-events-none" style={{opacity:.052}}>
                    <OrnRing size={380}/>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rot-c pointer-events-none" style={{opacity:.032}}>
                    <OrnRing size={240}/>
                  </div>
                  {/* Sparks */}
                  {[{t:"5%",l:"5%",c:"✦",s:16,d:0},{t:"7%",l:"90%",c:"✧",s:12,d:.9},{t:"90%",l:"5%",c:"✿",s:14,d:1.8},{t:"88%",l:"88%",c:"❋",s:16,d:2.6},{t:"50%",l:"2%",c:"✦",s:9,d:3.5},{t:"48%",l:"95%",c:"✧",s:11,d:1.2}]
                    .map((sp,i)=>(
                    <motion.span key={i} style={{position:"absolute",top:sp.t,left:sp.l,color:G.gold,fontSize:sp.s,opacity:.16,pointerEvents:"none"}}
                      animate={{y:[0,-14,0],opacity:[.08,.22,.08],rotate:[0,20,0]}} transition={{duration:5+i*.6,repeat:Infinity,delay:sp.d}}>
                      {sp.c}
                    </motion.span>
                  ))}

                  <motion.div initial={{opacity:0,y:32,scale:.94}} animate={{opacity:1,y:0,scale:1}}
                    transition={{duration:1.5,delay:.25,ease:[0.22,1,0.36,1]}} style={{maxWidth:370,width:"100%"}}>
                    <div className="relative w-full text-center">
                      {/* Animated border */}
                      <motion.div className="absolute -inset-[1.5px] pointer-events-none"
                        animate={{opacity:[.5,.95,.5]}} transition={{duration:4.5,repeat:Infinity}}
                        style={{background:`linear-gradient(135deg,${G.goldD}55,${G.gold}88,${G.goldXL}65,${G.gold}50,${G.goldD}40)`,filter:"blur(1.2px)"}}/>
                      <div className="relative px-7 py-10 sm:px-9 sm:py-12"
                        style={{border:`1px solid ${G.gold}52`,background:"rgba(255,252,247,.92)",backdropFilter:"blur(30px)",WebkitBackdropFilter:"blur(30px)"}}>
                        {/* Gold bar top */}
                        <div className="absolute inset-x-0 top-0 h-[3px]" style={{background:`linear-gradient(to right,transparent,${G.gold}95,transparent)`}}/>
                        <div className="absolute inset-x-0 bottom-0 h-px" style={{background:`linear-gradient(to right,transparent,${G.gold}45,transparent)`}}/>
                        {/* Corners */}
                        {(["tl","tr","bl","br"] as const).map((p)=>{
                          const pos=p==="tl"?"top-2.5 left-2.5":p==="tr"?"top-2.5 right-2.5":p==="bl"?"bottom-2.5 left-2.5":"bottom-2.5 right-2.5";
                          const d=p==="tl"?"M0 12L0 0L12 0":p==="tr"?"M20 12L20 0L8 0":p==="bl"?"M0 8L0 20L12 20":"M20 8L20 20L8 20";
                          return (
                            <div key={p} className={`absolute ${pos}`}>
                              <svg viewBox="0 0 20 20" fill="none" width="20" height="20"><path d={d} stroke={G.gold} strokeWidth="1.1" opacity=".65"/></svg>
                            </div>
                          );
                        })}
                        {/* Mobile names */}
                        <div className="lg:hidden mb-7">
                          <motion.p initial={{opacity:0,letterSpacing:".04em"}} animate={{opacity:1,letterSpacing:".48em"}}
                            transition={{duration:1.4,delay:.4}} className="fb text-[7.5px] font-semibold mb-4" style={{color:G.gold}}>THE WEDDING OF</motion.p>
                          <div style={{height:1,background:`linear-gradient(to right,transparent,${G.gold},transparent)`,marginBottom:16}}/>
                          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.65,duration:1}}>
                            <span className="fs gshim block" style={{fontSize:"clamp(48px,12vw,68px)",lineHeight:1}}>{W.bride}</span>
                            <span className="fd italic block my-1.5" style={{color:G.muted,fontSize:18}}>&amp;</span>
                            <span className="fs gshim block" style={{fontSize:"clamp(48px,12vw,68px)",lineHeight:1}}>{W.groom}</span>
                          </motion.div>
                          <div style={{height:1,background:`linear-gradient(to right,transparent,${G.gold},transparent)`,margin:"14px 0"}}/>
                          <p className="fd italic text-sm" style={{color:G.muted}}>{W.dateText}</p>
                        </div>
                        {/* Desktop names */}
                        <div className="hidden lg:block mb-7">
                          <motion.p initial={{opacity:0,letterSpacing:".04em"}} animate={{opacity:1,letterSpacing:".44em"}}
                            transition={{duration:1.4,delay:.28}} className="fb text-[7.5px] font-semibold mb-3.5" style={{color:G.gold}}>UNDANGAN PERNIKAHAN</motion.p>
                          <div style={{height:1,background:`linear-gradient(to right,transparent,${G.gold},transparent)`,marginBottom:14}}/>
                          <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.48,duration:1}}>
                            <span className="fs gshim block" style={{fontSize:"clamp(40px,6vw,60px)",lineHeight:1}}>{W.bride}</span>
                            <span className="fd italic block my-1.5" style={{color:G.muted,fontSize:16}}>&amp;</span>
                            <span className="fs gshim block" style={{fontSize:"clamp(40px,6vw,60px)",lineHeight:1}}>{W.groom}</span>
                          </motion.div>
                          <div style={{height:1,background:`linear-gradient(to right,transparent,${G.gold},transparent)`,margin:"14px 0"}}/>
                          <p className="fd italic text-sm" style={{color:G.muted}}>{W.dateText}</p>
                        </div>
                        {/* Guest */}
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.1}} className="mb-7">
                          <div style={{border:`1px solid ${G.gold}22`,background:`linear-gradient(135deg,${G.cream}88,${G.ivory}68)`,padding:"13px 20px",position:"relative"}}>
                            <div style={{position:"absolute",inset:"0 0 auto 0",height:1,background:`linear-gradient(to right,transparent,${G.gold}42,transparent)`}}/>
                            <p className="fb text-[7px] font-semibold mb-1.5" style={{color:G.gold,letterSpacing:".4em"}}>KEPADA YTH.</p>
                            <p className="fb text-[9.5px] mb-0.5" style={{color:G.muted}}>Bpk/Ibu/Saudara/i</p>
                            <p className="fd font-medium" style={{fontSize:"clamp(18px,4.5vw,23px)",color:G.deep}}>{guest}</p>
                          </div>
                        </motion.div>
                        <Mag onClick={openInvitation}
                          className="btn-pulse btn-sh fb inline-flex items-center gap-2.5 px-10 py-4 text-[8.5px] font-semibold"
                          style={{color:G.ivory,letterSpacing:".22em",boxShadow:`0 16px 44px ${G.gold}52`}}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                          </svg>
                          BUKA UNDANGAN
                        </Mag>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═════ MAIN CONTENT ═════ */}
          {opened && (
            <div className="w-full min-h-screen" style={{background:G.ivory}}>
              <ScrollBar/>
              <audio ref={audioRef} src={W.music[0]} loop preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>

              {/* ── NAV ── */}
              <motion.nav initial={{y:-56,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:.25,ease:[0.22,1,0.36,1]}}
                className="fixed top-0 left-0 right-0 z-40"
                style={{background:"rgba(255,252,247,.94)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",borderBottom:`1px solid ${G.gold}1C`}}>
                <div className="flex items-center justify-between max-w-screen-xl mx-auto px-5 sm:px-8 py-3.5">
                  <span className="fs" style={{fontSize:28,color:G.deep,lineHeight:1}}>{W.bride} &amp; {W.groom}</span>
                  <nav className="flex items-center gap-1 sm:gap-2">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>scrollTo(item.id)}
                        className={`ni fb px-2.5 sm:px-4 py-2 text-[7.5px] font-semibold transition-colors duration-200 ${activeNav===item.id?"active":""}`}
                        style={{color:activeNav===item.id?G.gold:G.muted,letterSpacing:".14em"}}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                  <button onClick={toggleMusic} aria-label="Music"
                    className="w-9 h-9 flex items-center justify-center rounded-full"
                    style={{background:playing?`${G.gold}22`:G.cream,border:`1.5px solid ${G.gold}38`}}>
                    {playing
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" opacity=".4"/><circle cx="12" cy="12" r="3" fill={G.gold} stroke="none"/><path d="M6 12a6 6 0 016-6" opacity=".55"/><path d="M18 12a6 6 0 01-6 6" opacity=".55"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>
                    }
                  </button>
                </div>
              </motion.nav>

              {/* ══ PEMBUKAAN ══ */}
              <section id="pembukaan" style={{paddingTop:58}}>
                {/* Hero banner */}
                <div className="relative overflow-hidden" style={{height:"68vh",minHeight:360}}>
                  <ClipReveal src="https://images.unsplash.com/photo-1511285560929-80b456503681?w=1800&q=90&fit=crop" alt="" style={{position:"absolute",inset:0}}/>
                  <div className="absolute inset-0 pointer-events-none" style={{background:"linear-gradient(to bottom,rgba(14,12,10,.38) 0%,rgba(14,12,10,.22) 40%,rgba(255,252,247,0) 60%,rgba(255,252,247,1) 100%)"}}/>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <motion.p initial={{opacity:0,letterSpacing:".04em"}} whileInView={{opacity:1,letterSpacing:".55em"}} viewport={{once:true}} transition={{duration:1.6}}
                      className="fb text-[7.5px] font-semibold mb-8" style={{color:`${G.ivory}70`}}>PASANGAN</motion.p>
                    <div style={{overflow:"hidden"}}>
                      <motion.h1 initial={{y:"112%"}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:1.2,ease:[0.22,1,0.36,1]}}
                        className="fs" style={{fontSize:"clamp(52px,12vw,96px)",color:G.ivory,lineHeight:1,textShadow:"0 8px 36px rgba(0,0,0,.5)"}}>
                        {W.bride} &amp; {W.groom}
                      </motion.h1>
                    </div>
                    <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{delay:.5,duration:1.2}}
                      style={{height:1,width:100,background:`linear-gradient(to right,transparent,${G.goldL},transparent)`,marginTop:20}}/>
                  </div>
                  <div className="absolute top-4 left-4"><Corner pos="tl" op=".4"/></div>
                  <div className="absolute top-4 right-4"><Corner pos="tr" op=".4"/></div>
                </div>

                {/* Content */}
                <div className="relative overflow-hidden px-5 sm:px-10 pb-28 sm:pb-36 max-w-3xl mx-auto pt-8">
                  {/* Large BG ornament */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rot-s pointer-events-none" style={{opacity:.038}}>
                    <OrnRing size={460}/>
                  </div>

                  {/* Bismillah */}
                  <Reveal className="text-center mb-2 mt-4">
                    <div className="inline-block relative" style={{border:`1px solid ${G.gold}28`,padding:"16px 38px",background:`linear-gradient(145deg,${G.cream},${G.ivory})`}}>
                      <div style={{position:"absolute",inset:"0 0 auto 0",height:2.5,background:`linear-gradient(to right,transparent,${G.gold}65,transparent)`}}/>
                      <div style={{position:"absolute",inset:"auto 0 0 0",height:2.5,background:`linear-gradient(to right,transparent,${G.gold}65,transparent)`}}/>
                      <p className="fd" style={{fontSize:"clamp(24px,5vw,40px)",color:G.deep,fontWeight:300,letterSpacing:".03em"}}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    </div>
                  </Reveal>

                  <Reveal delay={.1} className="flex justify-center my-8"><FlDiv/></Reveal>

                  {/* Verse */}
                  <Reveal delay={.15}>
                    <div className="relative px-8 sm:px-14 py-8 mb-3 text-center" style={{border:`1px solid ${G.gold}22`,background:`linear-gradient(145deg,${G.cream},${G.ivory})`}}>
                      <div style={{position:"absolute",inset:"0 0 auto 0",height:1.5,background:`linear-gradient(to right,transparent,${G.gold}52,transparent)`}}/>
                      <div className="absolute top-4 left-5 fd italic text-5xl leading-none" style={{color:G.gold,opacity:.08}}>"</div>
                      <div className="absolute bottom-4 right-5 fd italic text-5xl leading-none" style={{color:G.gold,opacity:.08}}>"</div>
                      <p className="fd mb-4" style={{fontSize:"clamp(15px,2.4vw,18px)",color:G.deep,fontWeight:300}}>{W.verse}</p>
                      <p className="fd italic leading-[2.1]" style={{fontSize:"clamp(12px,1.8vw,14px)",color:G.muted}}>{W.verseId}</p>
                    </div>
                  </Reveal>
                  <Reveal delay={.22} className="text-center mb-10">
                    <p className="fb text-[8px] font-semibold" style={{color:G.gold,letterSpacing:".42em"}}>— {W.verseSub} —</p>
                  </Reveal>

                  <Reveal delay={.28} className="text-center mb-16">
                    <p className="fd italic leading-[2.2]" style={{fontSize:"clamp(12.5px,1.9vw,15px)",color:G.muted}}>
                      Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud<br className="hidden sm:block"/> menyelenggarakan walimatul ursy putra-putri kami:
                    </p>
                  </Reveal>

                  {/* Portraits */}
                  <div className="flex flex-col sm:flex-row gap-16 sm:gap-0 items-start justify-center relative">
                    {[
                      {img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=800&q=90&fit=crop&crop=face",lbl:"THE BRIDE",name:W.bride,full:W.brideFull,role:"Putri dari",parents:W.brideParents,dx:-52},
                      {img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&q=90&fit=crop&crop=face",lbl:"THE GROOM",name:W.groom,full:W.groomFull,role:"Putra dari",parents:W.groomParents,dx:52},
                    ].map((p,i)=>(
                      <motion.div key={p.name} initial={{opacity:0,x:p.dx}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
                        transition={{duration:1.3,delay:i*.22,ease:[0.22,1,0.36,1]}} className="flex-1 text-center w-full max-w-[225px] mx-auto">
                        <motion.div whileHover={{y:-12,scale:1.028}} transition={{duration:.5,ease:[0.22,1,0.36,1]}}
                          className="relative mx-auto mb-6 pf" style={{width:"min(175px,44vw)",aspectRatio:"3/4"}}>
                          {/* Outer frame */}
                          <div style={{position:"absolute",inset:-7,border:`1px solid ${G.gold}28`}}/>
                          {/* Main frame */}
                          <div style={{position:"absolute",inset:0,border:`1.5px solid ${G.gold}62`,overflow:"hidden",boxShadow:`0 38px 88px rgba(192,144,80,.28)`}}>
                            <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .7s ease"}}
                              onMouseEnter={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1.07)"}
                              onMouseLeave={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1)"}/>
                            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 45%,rgba(14,12,10,.52))"}}/>
                            <div style={{position:"absolute",inset:"0 0 auto 0",height:2.5,background:`linear-gradient(to right,transparent,${G.gold}88,transparent)`}}/>
                            <div style={{position:"absolute",inset:"auto 0 0 0",height:2.5,background:`linear-gradient(to right,transparent,${G.gold}88,transparent)`}}/>
                          </div>
                          {/* Corner dots */}
                          {["top-0.5 left-0.5","top-0.5 right-0.5","bottom-0.5 left-0.5","bottom-0.5 right-0.5"].map((c,j)=>(
                            <div key={j} className={`absolute ${c} w-1.5 h-1.5 rounded-full`} style={{background:G.gold,opacity:.65}}/>
                          ))}
                        </motion.div>
                        <p className="fb text-[7.5px] font-semibold mb-3" style={{color:G.gold,letterSpacing:".36em"}}>{p.lbl}</p>
                        <h2 className="fs" style={{fontSize:58,color:G.deep,lineHeight:1.05}}>{p.name}</h2>
                        <p className="fd italic text-sm mt-1.5 mb-2" style={{color:G.muted}}>{p.full}</p>
                        <div style={{height:1,width:36,background:G.gold,margin:"12px auto"}}/>
                        <p className="fb text-[10px]" style={{color:G.muted}}>{p.role}</p>
                        <p className="fb text-[11px] font-semibold mt-1 leading-snug px-2" style={{color:G.deep}}>{p.parents}</p>
                      </motion.div>
                    ))}
                    {/* Center & */}
                    <div className="hidden sm:flex absolute left-1/2 top-[8%] -translate-x-1/2 flex-col items-center gap-2 z-10">
                      <div style={{width:1,height:52,background:G.gold,opacity:.22}}/>
                      <motion.span animate={{scale:[1,1.18,1],opacity:[.65,1,.65]}} transition={{duration:5,repeat:Infinity}} className="fd italic" style={{fontSize:30,color:G.gold,lineHeight:1}}>&amp;</motion.span>
                      <div style={{width:1,height:52,background:G.gold,opacity:.22}}/>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── MARQUEE ── */}
              <div className="relative overflow-hidden" style={{background:`linear-gradient(90deg,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD})`}}>
                <div className="absolute inset-0 pointer-events-none" style={{opacity:.07,backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
                <div className="py-4 mq-inner">
                  {Array.from({length:24}).map((_,i)=>(
                    <span key={i} className="fb text-[7.5px] font-semibold mx-7 shrink-0" style={{color:G.ivory,letterSpacing:".55em",opacity:.88}}>
                      {i%2===0?"ANIS & FADLI":"✦ 27 · 04 · 2024 ✦"}
                    </span>
                  ))}
                </div>
              </div>

              {/* ══ CERITA — HORIZONTAL SCROLL ══ */}
              <section id="cerita">
                <div ref={storyWrapRef} style={{height:`${W.story.length*100}vh`,position:"relative"}}>
                  <div className="sticky top-0 h-screen overflow-hidden" style={{background:G.deep}}>
                    {/* Section label (fixed) */}
                    <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-8 sm:px-14 pointer-events-none">
                      <p className="fb text-[7.5px] font-semibold" style={{color:G.goldL,letterSpacing:".52em"}}>OUR LOVE STORY</p>
                      <p className="fd italic text-xs" style={{color:`${G.ivory}40`}}>Geser atau scroll</p>
                    </div>
                    {/* Horizontal track */}
                    <div ref={storyTrackRef} className="flex h-full" style={{width:`${W.story.length*100}vw`}}>
                      {W.story.map((s,i)=>(
                        <div key={s.year} className="s-slide relative flex flex-col sm:flex-row overflow-hidden">
                          {/* Big background year */}
                          <div className="sec-num" style={{
                            fontSize:"clamp(200px,28vw,380px)",color:G.ivory,
                            right:-20,bottom:-60,
                          }}>{s.year}</div>
                          {/* Left: text */}
                          <div className="flex flex-col justify-center flex-1 px-10 sm:px-20 pt-24 pb-10 sm:py-0 relative z-10" style={{maxWidth:"50vw",minWidth:"40vw"}}>
                            <div className="mb-8">
                              <motion.div className="flex items-center gap-3 mb-5"
                                initial={{opacity:0,x:-28}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.5}}
                                transition={{duration:.9,ease:[0.22,1,0.36,1]}}>
                                <span className="fb text-[8px] font-semibold px-3 py-1.5" style={{background:G.gold,color:G.ivory,letterSpacing:".16em"}}>{s.num}</span>
                                <div style={{flex:1,height:1,background:`linear-gradient(to right,${G.gold}55,transparent)`}}/>
                                <span className="fd italic text-sm" style={{color:`${G.ivory}38`}}>{s.year}</span>
                              </motion.div>
                              <div style={{overflow:"hidden"}}>
                                <motion.h2 initial={{y:"115%"}} whileInView={{y:0}} viewport={{once:true,amount:.5}}
                                  transition={{duration:1.1,ease:[0.22,1,0.36,1]}}
                                  className="fd font-light" style={{fontSize:"clamp(36px,6vw,68px)",color:G.ivory,lineHeight:1.1,whiteSpace:"pre-line"}}>
                                  {s.title}
                                </motion.h2>
                              </div>
                              <motion.div initial={{scaleX:0}} whileInView={{scaleX:1}} viewport={{once:true,amount:.5}}
                                transition={{delay:.3,duration:.9}} className="mt-4 mb-5 origin-left"
                                style={{height:1,width:60,background:`linear-gradient(to right,${G.gold},${G.gold}00)`}}/>
                              <motion.p initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.5}}
                                transition={{delay:.2,duration:.9}} className="fd italic text-xs mb-4" style={{color:`${G.ivory}50`}}>
                                {s.sub}
                              </motion.p>
                              <motion.p initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.5}}
                                transition={{delay:.32,duration:.9}} className="fb leading-[2]" style={{fontSize:"clamp(11px,1.5vw,13.5px)",color:`${G.ivory}55`,maxWidth:380}}>
                                {s.body}
                              </motion.p>
                            </div>
                            {/* Step indicator */}
                            <div className="flex gap-2">
                              {W.story.map((_,j)=>(
                                <div key={j} style={{width:j===i?28:8,height:2,background:j===i?G.gold:`${G.ivory}22`,borderRadius:2,transition:"all .4s ease"}}/>
                              ))}
                            </div>
                          </div>
                          {/* Right: image */}
                          <div className="hidden sm:block relative flex-1 overflow-hidden" style={{maxWidth:"50vw"}}>
                            <div className="absolute inset-0" style={{margin:"32px 32px 32px 0"}}>
                              <ClipReveal src={s.img} alt={s.title} delay={.2} style={{width:"100%",height:"100%"}}/>
                              <div className="absolute top-4 right-4"><Corner pos="tr" op=".45"/></div>
                              <div className="absolute bottom-4 left-4"><Corner pos="bl" op=".45"/></div>
                              {/* Gold bar on the left edge of image */}
                              <div style={{position:"absolute",left:0,top:"15%",bottom:"15%",width:3,background:`linear-gradient(to bottom,${G.gold}00,${G.gold}80,${G.gold}00)`}}/>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ══ ACARA ══ */}
              <section id="acara" className="relative overflow-hidden" style={{background:G.ivory}}>
                {/* Section big number */}
                <div className="sec-num" style={{fontSize:"clamp(180px,26vw,360px)",color:G.deep,right:-10,top:-40}}>02</div>
                <div className="absolute inset-0 pointer-events-none" style={{background:`radial-gradient(ellipse 100% 50% at 50% 110%,${G.rose}28,transparent 52%)`}}/>
                <div className="px-5 sm:px-10 py-28 sm:py-36 max-w-2xl mx-auto relative">
                  <Reveal>
                    <p className="fb text-center text-[8px] font-semibold mb-2" style={{color:G.gold,letterSpacing:".58em"}}>SAVE THE DATE</p>
                  </Reveal>
                  <div style={{overflow:"hidden",textAlign:"center"}}>
                    <motion.h2 initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:1.1,ease:[0.22,1,0.36,1]}}
                      className="fd font-light" style={{fontSize:"clamp(38px,7vw,64px)",color:G.deep,lineHeight:1.1}}>
                      Detail Acara
                    </motion.h2>
                  </div>
                  <Reveal delay={.18} className="flex justify-center mt-8 mb-16"><FlDiv/></Reveal>

                  {/* Countdown */}
                  <Reveal delay={.12} className="mb-16">
                    {(cd.d===0&&cd.h===0&&cd.m===0&&cd.s===0) ? (
                      <div className="relative py-14 text-center overflow-hidden" style={{border:`1px solid ${G.gold}42`,background:`linear-gradient(160deg,${G.cream},${G.ivory})`}}>
                        <div style={{position:"absolute",inset:"0 0 auto 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}85,transparent)`}}/>
                        <motion.p animate={{opacity:[.75,1,.75]}} transition={{duration:4,repeat:Infinity}} className="fs gshim block" style={{fontSize:"clamp(30px,6vw,50px)"}}>
                          Selamat Menempuh Hidup Baru
                        </motion.p>
                        <p className="fb text-[8px] mt-5" style={{color:G.gold,letterSpacing:".46em"}}>✦ 27 APRIL 2024 ✦</p>
                      </div>
                    ) : (
                      <div>
                        <p className="fb text-center text-[8px] font-semibold mb-7" style={{color:G.muted,letterSpacing:".46em"}}>MENGHITUNG HARI</p>
                        <div className="grid grid-cols-4 gap-2 sm:gap-3">
                          {[{v:cd.d,l:"Hari"},{v:cd.h,l:"Jam"},{v:cd.m,l:"Menit"},{v:cd.s,l:"Detik"}].map(x=>(
                            <div key={x.l} className="relative text-center py-7 sm:py-9 overflow-hidden"
                              style={{background:`linear-gradient(155deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}35`,boxShadow:`0 10px 36px rgba(192,144,80,.1)`}}>
                              <div style={{position:"absolute",inset:"0 0 auto 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}80,transparent)`}}/>
                              <AnimatePresence mode="popLayout">
                                <motion.span key={x.v} initial={{y:-20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}
                                  transition={{duration:.3,ease:[0.22,1,0.36,1]}}
                                  className="fd block font-light" style={{fontSize:"clamp(28px,7vw,44px)",color:G.deep,lineHeight:1}}>
                                  {String(x.v).padStart(2,"0")}
                                </motion.span>
                              </AnimatePresence>
                              <span className="fb block mt-2.5" style={{fontSize:"clamp(6.5px,1.6vw,8.5px)",color:G.gold,letterSpacing:".22em"}}>{x.l.toUpperCase()}</span>
                              <div style={{position:"absolute",top:6,left:6,width:5,height:5,borderRadius:"50%",background:G.gold,opacity:.4}}/>
                              <div style={{position:"absolute",top:6,right:6,width:5,height:5,borderRadius:"50%",background:G.gold,opacity:.4}}/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Reveal>

                  {/* Events */}
                  <div className="space-y-5 mb-14">
                    {[
                      {title:"Akad Nikah",sub:"Ijab Kabul",num:"01",data:W.akad,img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1000&h=500&q=90&fit=crop"},
                      {title:"Resepsi Pernikahan",sub:"Walimatul 'Ursy",num:"02",data:W.resepsi,img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&h=500&q=90&fit=crop"},
                    ].map((ev,i)=>(
                      <Reveal key={ev.title} delay={i*.18}>
                        <div className="hl relative overflow-hidden" style={{border:`1px solid ${G.gold}35`,boxShadow:`0 20px 60px rgba(192,144,80,.1)`}}>
                          {/* Number badge */}
                          <div style={{position:"absolute",top:16,left:16,zIndex:10,width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${G.goldD},${G.gold})`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 6px 24px ${G.gold}52`}}>
                            <span className="fb text-[10px] font-semibold" style={{color:G.ivory}}>{ev.num}</span>
                          </div>
                          {/* Photo */}
                          <div className="relative overflow-hidden" style={{height:200}}>
                            <img src={ev.img} alt={ev.title} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.82) saturate(1.1)",transition:"transform .7s ease"}}
                              onMouseEnter={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1.05)"}
                              onMouseLeave={e=>(e.currentTarget as HTMLImageElement).style.transform="scale(1)"}/>
                            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(14,12,10,.08) 0%,rgba(14,12,10,.9) 100%)"}}/>
                            <div style={{position:"absolute",inset:"auto 0 0 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}95,transparent)`}}/>
                            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 24px 20px"}}>
                              <p className="fb text-[7.5px] font-semibold mb-1.5" style={{color:G.goldL,letterSpacing:".34em"}}>{ev.sub.toUpperCase()}</p>
                              <h3 className="fd font-light" style={{fontSize:"clamp(22px,4vw,32px)",color:G.ivory,lineHeight:1.2}}>{ev.title}</h3>
                            </div>
                            <div style={{position:"absolute",top:10,right:10,opacity:.38}}><Corner pos="tr" size={34}/></div>
                          </div>
                          {/* Details */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5" style={{background:G.ivory}}>
                            <div className="space-y-2.5 flex-1">
                              {[
                                {icon:<><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>, val:ev.data.time},
                                {icon:<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>, val:`${ev.data.place} — ${ev.data.addr}`},
                              ].map((row,j)=>(
                                <div key={j} className="flex items-center gap-3">
                                  <div style={{width:32,height:32,borderRadius:"50%",background:`${G.gold}14`,border:`1px solid ${G.gold}28`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill={j===1?G.gold:"none"} stroke={j===0?G.gold:"none"} strokeWidth="1.8" strokeLinecap="round">{row.icon}</svg>
                                  </div>
                                  <p className="fd" style={{fontSize:"clamp(12px,2.2vw,14.5px)",color:G.deep,lineHeight:1.4}}>{row.val}</p>
                                </div>
                              ))}
                            </div>
                            <Mag href={ev.data.maps}
                              className="fb inline-flex items-center gap-2 text-[8.5px] font-semibold px-7 py-3.5 shrink-0"
                              style={{background:`linear-gradient(135deg,${G.goldD},${G.gold})`,color:G.ivory,letterSpacing:".12em",boxShadow:`0 8px 26px ${G.gold}42`}}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                              LIHAT PETA
                            </Mag>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>

                  {/* Dress code */}
                  <Reveal>
                    <div className="relative overflow-hidden" style={{border:`1px solid ${G.gold}30`,background:`linear-gradient(150deg,${G.cream},${G.ivory})`,boxShadow:`0 14px 52px rgba(192,144,80,.1)`}}>
                      <div style={{position:"absolute",inset:"0 0 auto 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}72,transparent)`}}/>
                      <div className="p-7 sm:p-10">
                        <p className="fb text-center text-[8px] font-semibold mb-3" style={{color:G.gold,letterSpacing:".52em"}}>DRESS CODE</p>
                        <h3 className="fd text-center font-light mb-2" style={{fontSize:"clamp(26px,4.5vw,38px)",color:G.deep}}>Tata Busana</h3>
                        <p className="fb text-center text-[10px] mb-8" style={{color:G.muted}}>Mohon kenakan warna busana berikut</p>
                        <div className="flex gap-8 sm:gap-14 justify-center flex-wrap">
                          {W.dressCode.map((d,i)=>(
                            <motion.div key={d.label} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                              transition={{delay:i*.1,duration:.8}} whileHover={{y:-10}} className="text-center">
                              <motion.div whileHover={{scale:1.2}} style={{width:64,height:64,background:d.color,borderRadius:"50%",border:`2.5px solid ${G.gold}30`,margin:"0 auto 14px",boxShadow:`0 12px 32px ${d.color}88,0 0 0 4px ${G.ivory}`}}/>
                              <p className="fb text-[10.5px] font-semibold" style={{color:G.deep}}>{d.label}</p>
                              <p className="fb text-[9px] mt-0.5" style={{color:G.muted}}>{d.for}</p>
                            </motion.div>
                          ))}
                        </div>
                        <div className="mt-8 pt-5" style={{borderTop:`1px dashed ${G.gold}28`}}>
                          <p className="fd italic text-center text-sm" style={{color:G.muted}}>Hindari warna putih &amp; hitam penuh ✦</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* Wave */}
              <div style={{background:G.ivory,marginBottom:"-1px"}}>
                <svg viewBox="0 0 1440 80" fill="none" style={{display:"block",width:"100%",height:"auto"}}>
                  <path d="M0 22 Q360 80 720 40 Q1080 0 1440 56 L1440 80 L0 80 Z" fill={G.deep}/>
                </svg>
              </div>

              {/* ══ GALERI ══ */}
              <section id="galeri" className="relative overflow-hidden" style={{background:G.deep}}>
                <div className="sec-num" style={{fontSize:"clamp(180px,26vw,360px)",color:G.ivory,left:-20,top:-40}}>03</div>
                <div className="absolute inset-0 pointer-events-none" style={{background:`radial-gradient(ellipse 85% 55% at 50% 100%,${G.gold}08,transparent 55%)`}}/>
                <div className="px-5 sm:px-10 pt-24 sm:pt-32 pb-14">
                  <div className="text-center mb-14 max-w-2xl mx-auto">
                    <Reveal><p className="fb text-[8px] font-semibold mb-2" style={{color:G.goldL,letterSpacing:".58em"}}>OUR GALLERY</p></Reveal>
                    <div style={{overflow:"hidden",textAlign:"center"}}>
                      <motion.h2 initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:1.1,ease:[0.22,1,0.36,1]}}
                        className="fd font-light" style={{fontSize:"clamp(38px,7vw,64px)",color:G.ivory,lineHeight:1.1}}>
                        Momen Kami
                      </motion.h2>
                    </div>
                    <Reveal delay={.2} className="flex justify-center mt-8 mb-3"><FlDiv light/></Reveal>
                    <Reveal delay={.3}><p className="fd italic text-sm" style={{color:`${G.ivory}38`}}>Geser untuk melihat semua foto</p></Reveal>
                  </div>

                  {/* 3-col masonry preview */}
                  <div className="hidden sm:grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
                    {W.gallery.slice(0,6).map((ph,i)=>(
                      <motion.button key={i}
                        initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
                        transition={{delay:i*.07,duration:.8,ease:[0.22,1,0.36,1]}}
                        onClick={()=>setLightbox(i)}
                        onMouseEnter={()=>setCursorLabel("VIEW")} onMouseLeave={()=>setCursorLabel("")}
                        data-hover="true"
                        className="relative overflow-hidden group"
                        style={{aspectRatio:i%3===1?"3/4":"3/4",border:`1px solid ${G.gold}18`}}>
                        <img src={ph.src} alt={ph.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.09]" style={{filter:"brightness(.84)"}}/>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400" style={{background:"rgba(14,12,10,.52)"}}/>
                        <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-75">
                          <p className="fd italic text-sm" style={{color:G.ivory}}>{ph.label}</p>
                        </div>
                        <div style={{position:"absolute",inset:"0 0 auto 0",height:1.5,background:`linear-gradient(to right,transparent,${G.gold}58,transparent)`}}/>
                      </motion.button>
                    ))}
                  </div>

                  <Gallery onOpen={i=>setLightbox(i)} onEnter={()=>setCursorLabel("VIEW")} onLeave={()=>setCursorLabel("")}/>
                </div>
              </section>

              {/* Wave 2 */}
              <div style={{background:G.deep,marginBottom:"-1px"}}>
                <svg viewBox="0 0 1440 80" fill="none" style={{display:"block",width:"100%",height:"auto"}}>
                  <path d="M0 56 Q360 0 720 38 Q1080 80 1440 24 L1440 80 L0 80 Z" fill={G.ivory}/>
                </svg>
              </div>

              {/* ══ HADIAH ══ */}
              <section className="relative overflow-hidden px-5 sm:px-10 py-24 sm:py-32" style={{background:G.ivory}}>
                <div className="sec-num" style={{fontSize:"clamp(180px,26vw,360px)",color:G.deep,right:-10,bottom:-40}}>04</div>
                <div className="max-w-lg mx-auto relative">
                  <Reveal><p className="fb text-center text-[8px] font-semibold mb-2" style={{color:G.gold,letterSpacing:".58em"}}>AMPLOP DIGITAL</p></Reveal>
                  <div style={{overflow:"hidden",textAlign:"center"}}>
                    <motion.h2 initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:1.1,ease:[0.22,1,0.36,1]}}
                      className="fd font-light" style={{fontSize:"clamp(36px,6.5vw,58px)",color:G.deep,lineHeight:1.1}}>
                      Hadiah &amp; Doa
                    </motion.h2>
                  </div>
                  <Reveal delay={.2} className="flex justify-center mt-8 mb-6"><FlDiv/></Reveal>
                  <Reveal delay={.28} className="text-center mb-14">
                    <p className="fd italic leading-[2.1]" style={{fontSize:"clamp(12.5px,1.9vw,15px)",color:G.muted}}>
                      Kehadiran dan doa restu Anda adalah hadiah terbesar.<br/>Namun bila berkenan mengirimkan hadiah:
                    </p>
                  </Reveal>
                  <div className="space-y-4 mb-8">
                    {W.bank.map((b,i)=>(
                      <Reveal key={b.no} delay={i*.16}>
                        <div className="relative overflow-hidden" style={{background:`linear-gradient(145deg,${G.cream},${G.ivory})`,border:`1px solid ${G.gold}48`,boxShadow:`0 16px 52px rgba(192,144,80,.13)`}}>
                          <div style={{position:"absolute",inset:"0 0 auto 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}82,transparent)`}}/>
                          <div style={{position:"absolute",inset:"0 auto 0 0",width:4,background:`linear-gradient(to bottom,${b.color}40,${b.color}92,${b.color}40)`}}/>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 pl-7">
                            <div>
                              <p className="fb text-[7.5px] font-semibold mb-2" style={{color:G.gold,letterSpacing:".34em"}}>{b.name.toUpperCase()}</p>
                              <p className="fd font-medium tracking-wide" style={{fontSize:"clamp(22px,5vw,32px)",color:G.deep}}>{b.no}</p>
                              <p className="fb text-[11px] mt-1.5" style={{color:G.muted}}>a.n. <span className="font-semibold" style={{color:G.deep}}>{b.an}</span></p>
                            </div>
                            <motion.button whileHover={{scale:1.08}} whileTap={{scale:.93}} onClick={()=>copyBank(b.no)}
                              className="fb shrink-0 self-start sm:self-center px-6 py-2.5 text-[9px] font-semibold"
                              style={{background:copied===b.no?G.gold:"transparent",color:copied===b.no?G.ivory:G.gold,border:`1.5px solid ${copied===b.no?G.gold:G.gold+"55"}`,letterSpacing:".14em",minWidth:90,transition:"all .3s",boxShadow:copied===b.no?`0 8px 24px ${G.gold}45`:"none"}}>
                              {copied===b.no?"✓ TERSALIN":"SALIN"}
                            </motion.button>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  <Reveal delay={.24}>
                    <div className="p-5 sm:p-6 text-center" style={{border:`1.5px dashed ${G.gold}35`,background:G.cream}}>
                      <p className="fb text-[8px] font-semibold mb-2" style={{color:G.gold,letterSpacing:".38em"}}>ATAU KIRIM KE ALAMAT</p>
                      <p className="fd italic text-base mt-2" style={{color:G.deep}}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                      <p className="fb text-[10.5px] mt-0.5" style={{color:G.muted}}>Jakarta Selatan, 12160</p>
                    </div>
                  </Reveal>
                </div>
              </section>

              {/* Wave 3 */}
              <div style={{background:G.ivory,marginBottom:"-1px"}}>
                <svg viewBox="0 0 1440 80" fill="none" style={{display:"block",width:"100%",height:"auto"}}>
                  <path d="M0 56 Q360 0 720 38 Q1080 80 1440 24 L1440 80 L0 80 Z" fill={G.deep}/>
                </svg>
              </div>

              {/* ══ RSVP ══ */}
              <section id="rsvp" className="relative overflow-hidden py-24 sm:py-32" style={{background:G.deep}}>
                <div className="sec-num" style={{fontSize:"clamp(180px,26vw,360px)",color:G.ivory,left:-20,bottom:-40}}>05</div>
                <div className="absolute inset-0 pointer-events-none" style={{background:`radial-gradient(ellipse 85% 60% at 50% -5%,${G.gold}10,transparent 50%)`}}/>
                <div className="px-5 sm:px-10 max-w-lg mx-auto relative">
                  <Reveal><p className="fb text-center text-[8px] font-semibold mb-2" style={{color:G.goldL,letterSpacing:".58em"}}>RSVP</p></Reveal>
                  <div style={{overflow:"hidden",textAlign:"center"}}>
                    <motion.h2 initial={{y:"110%"}} whileInView={{y:0}} viewport={{once:true}} transition={{duration:1.1,ease:[0.22,1,0.36,1]}}
                      className="fd font-light" style={{fontSize:"clamp(38px,7vw,64px)",color:G.ivory,lineHeight:1.1}}>
                      Ucapan &amp; Doa
                    </motion.h2>
                  </div>
                  <Reveal delay={.2} className="flex justify-center mt-8 mb-3"><FlDiv light/></Reveal>
                  <Reveal delay={.3} className="text-center mb-12">
                    <p className="fd italic text-sm" style={{color:`${G.ivory}42`}}>Sampaikan ucapan terbaik Anda</p>
                  </Reveal>

                  <AnimatePresence mode="wait">
                    {submitted ? (
                      <motion.div key="ok" initial={{opacity:0,scale:.88,y:18}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0}}
                        transition={{duration:.6,ease:[0.22,1,0.36,1]}}
                        className="relative text-center py-20 overflow-hidden mb-8"
                        style={{border:`1px solid ${G.gold}52`,background:"rgba(192,144,80,.05)"}}>
                        <div style={{position:"absolute",inset:"0 0 auto 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}72,transparent)`}}/>
                        <motion.div animate={{y:[0,-10,0],rotate:[0,5,-5,0]}} transition={{duration:3.5,repeat:Infinity}} style={{fontSize:48,marginBottom:20}}>✉</motion.div>
                        <p className="fd text-3xl mb-2" style={{color:G.ivory}}>Terima Kasih</p>
                        <p className="fb text-[10.5px]" style={{color:`${G.ivory}40`}}>Ucapan Anda telah tersimpan</p>
                        <div className="flex justify-center mt-7"><FlDiv light/></div>
                      </motion.div>
                    ) : (
                      <motion.form key="form" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                        transition={{duration:.7,ease:[0.22,1,0.36,1]}}
                        onSubmit={submitRsvp} className="relative mb-8"
                        style={{background:"rgba(255,252,247,.04)",border:`1px solid ${G.gold}35`,backdropFilter:"blur(6px)"}}>
                        <div style={{position:"absolute",inset:"0 0 auto 0",height:3,background:`linear-gradient(to right,transparent,${G.gold}68,transparent)`}}/>
                        <div className="p-6 sm:p-8 space-y-3.5">
                          {[
                            {placeholder:"Nama lengkap Anda",value:form.nama,key:"nama",type:"text",icon:<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>},
                          ].map(f=>(
                            <div key={f.key} className="relative">
                              <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".52">{f.icon}</svg>
                              </div>
                              <input required value={f.value} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                                placeholder={f.placeholder} type={f.type} className="fb w-full pl-10 pr-4 py-3.5 text-[12px]"
                                style={{background:"rgba(255,252,247,.07)",border:`1px solid ${G.gold}35`,color:G.ivory}}/>
                            </div>
                          ))}
                          <div className="relative">
                            <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".52"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                            </div>
                            <select value={form.hadir} onChange={e=>setForm({...form,hadir:e.target.value})} className="fb w-full pl-10 pr-4 py-3.5 text-[12px]"
                              style={{background:"rgba(14,12,10,.96)",border:`1px solid ${G.gold}35`,color:G.ivory}}>
                              <option value="Hadir">✓  Insya Allah Hadir</option>
                              <option value="Tidak Hadir">✗  Belum Bisa Hadir</option>
                            </select>
                          </div>
                          <div className="relative">
                            <div style={{position:"absolute",left:14,top:16,pointerEvents:"none"}}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".52"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                            </div>
                            <textarea required rows={4} value={form.ucapan} onChange={e=>setForm({...form,ucapan:e.target.value})}
                              placeholder="Tulis ucapan dan doa terbaik..." className="fb w-full pl-10 pr-4 py-3.5 text-[12px] resize-none"
                              style={{background:"rgba(255,252,247,.07)",border:`1px solid ${G.gold}35`,color:G.ivory}}/>
                          </div>
                          <motion.button type="submit" whileHover={{scale:1.018}} whileTap={{scale:.975}}
                            className="fb w-full py-4 text-[9.5px] font-semibold flex items-center justify-center gap-2.5"
                            style={{background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldXL},${G.gold})`,color:G.ivory,letterSpacing:".2em",boxShadow:`0 14px 40px ${G.gold}48`}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                            KIRIM UCAPAN
                          </motion.button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  {/* Comments */}
                  {rsvps.length > 0 && (
                    <div className="rfeed space-y-3 max-h-80 overflow-y-auto pr-1">
                      <AnimatePresence>
                        {rsvps.map(r=>(
                          <motion.div key={r.ts} layout initial={{opacity:0,x:-22,y:10}} animate={{opacity:1,x:0,y:0}} exit={{opacity:0}}
                            transition={{duration:.5,ease:[0.22,1,0.36,1]}}
                            className="relative p-4 sm:p-5"
                            style={{background:"rgba(255,252,247,.04)",border:`1px solid ${G.gold}22`}}>
                            <div style={{position:"absolute",inset:"12px auto 12px 0",width:3,borderRadius:"0 2px 2px 0",background:`linear-gradient(to bottom,${G.gold}00,${G.gold}72,${G.gold}00)`}}/>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-2.5">
                                <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${G.gold}28,${G.gold}12)`,border:`1px solid ${G.gold}42`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                  <span className="fd italic text-base font-medium" style={{color:G.gold}}>{r.nama[0]?.toUpperCase()}</span>
                                </div>
                                <p className="fd text-base font-medium" style={{color:G.ivory}}>{r.nama}</p>
                              </div>
                              <span className="fb text-[7.5px] font-semibold px-2.5 py-1 shrink-0"
                                style={{background:r.hadir==="Hadir"?`${G.gold}20`:`${G.rose}18`,color:r.hadir==="Hadir"?G.gold:G.rose,border:`1px solid ${r.hadir==="Hadir"?G.gold+"44":G.rose+"44"}`,letterSpacing:".1em"}}>
                                {r.hadir==="Hadir"?"✓ HADIR":"✕ BERHALANGAN"}
                              </span>
                            </div>
                            <p className="fb text-[11px] leading-[1.88] italic pl-10" style={{color:`${G.ivory}50`}}>{r.ucapan}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  {rsvps.length===0&&!submitted&&(
                    <p className="fb text-center text-[11px] italic py-6" style={{color:`${G.ivory}30`}}>Belum ada ucapan. Jadilah yang pertama ✦</p>
                  )}
                </div>
              </section>

              {/* ══ PENUTUP ══ */}
              <section className="relative overflow-hidden px-5 sm:px-10 py-40 sm:py-52 text-center">
                <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=85&fit=crop" alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(255,252,247,.97) 0%,rgba(255,252,247,.88) 48%,rgba(255,252,247,.95) 100%)"}}/>
                  <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse 140% 60% at 50% 50%,${G.rose}38,transparent 60%)`}}/>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rot-s pointer-events-none" style={{opacity:.058}}><OrnRing size={500}/></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rot-c pointer-events-none" style={{opacity:.035}}><OrnRing size={300}/></div>
                <div className="absolute top-5 left-5 hidden sm:block"><Corner pos="tl" op=".16"/></div>
                <div className="absolute top-5 right-5 hidden sm:block"><Corner pos="tr" op=".16"/></div>
                <div className="absolute bottom-5 left-5 hidden sm:block"><Corner pos="bl" op=".1"/></div>
                <div className="absolute bottom-5 right-5 hidden sm:block"><Corner pos="br" op=".1"/></div>

                <div className="relative max-w-xl mx-auto">
                  <Reveal>
                    <div className="flex items-center justify-center gap-4 mb-12">
                      <div style={{height:1,width:44,background:G.gold,opacity:.38}}/>
                      <span className="fb text-[7.5px] font-semibold" style={{color:G.gold,letterSpacing:".55em"}}>TERIMA KASIH</span>
                      <div style={{height:1,width:44,background:G.gold,opacity:.38}}/>
                    </div>
                  </Reveal>
                  <div style={{overflow:"hidden"}}>
                    <motion.span initial={{y:"115%",opacity:0}} whileInView={{y:0,opacity:1}} viewport={{once:true}}
                      transition={{duration:1.3,ease:[0.22,1,0.36,1]}}
                      className="fs gshim block" style={{fontSize:"clamp(44px,10vw,84px)",lineHeight:1.1}}>
                      Jazakumullah Khairan
                    </motion.span>
                  </div>
                  <Reveal delay={.18} className="flex justify-center my-12"><FlDiv/></Reveal>
                  <Reveal delay={.24}>
                    <p className="fd italic leading-[2.15] mb-12 px-2" style={{fontSize:"clamp(13px,2vw,16px)",color:G.muted}}>
                      Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
                      dan memberikan doa restu kepada kedua mempelai.
                    </p>
                  </Reveal>
                  <Reveal delay={.3}>
                    <p className="fd italic text-sm mb-3" style={{color:G.muted}}>Kami yang berbahagia,</p>
                    <motion.h3 animate={{opacity:[.82,1,.82]}} transition={{duration:4,repeat:Infinity}}
                      className="fs" style={{fontSize:"clamp(44px,9vw,70px)",color:G.deep,lineHeight:1.1}}>
                      {W.bride} &amp; {W.groom}
                    </motion.h3>
                  </Reveal>
                  <Reveal delay={.36} className="flex justify-center my-12"><FlDiv/></Reveal>
                  <Reveal delay={.44}>
                    <Mag href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}.`)}`}
                      className="fb inline-flex items-center gap-2.5 px-9 py-4 text-[9px] font-semibold"
                      style={{background:"#25D366",color:"#fff",letterSpacing:".14em",boxShadow:"0 12px 36px rgba(37,211,102,.38)"}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      BAGIKAN KE WHATSAPP
                    </Mag>
                  </Reveal>
                  <Reveal delay={.54}>
                    <p className="fb text-[7.5px] mt-16" style={{color:G.gold,opacity:.28,letterSpacing:".44em"}}>✦ MADE WITH LOVE ✦ 2024 ✦</p>
                  </Reveal>
                </div>
              </section>
            </div>
          )}

          {/* ─ Lightbox ─ */}
          <AnimatePresence>
            {lightbox!==null && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                onClick={()=>{ setLightbox(null); setCursorLabel(""); }}
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 p-4 sm:p-12"
                style={{background:"rgba(14,12,10,.97)",backdropFilter:"blur(32px)"}}>
                <motion.div initial={{scale:.82,opacity:0,y:36}} animate={{scale:1,opacity:1,y:0}} exit={{scale:.84,opacity:0}}
                  transition={{type:"spring",stiffness:260,damping:28}}
                  onClick={e=>e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{maxWidth:420,width:"100%",aspectRatio:"3/4",boxShadow:`0 64px 110px rgba(0,0,0,.8),0 0 0 1.5px ${G.gold}48`}}>
                  <AnimatePresence mode="wait">
                    <motion.img key={lightbox} initial={{opacity:0,x:lbDir*46}} animate={{opacity:1,x:0}} exit={{opacity:0,x:lbDir*-46}}
                      transition={{duration:.44,ease:[0.22,1,0.36,1]}}
                      src={W.gallery[lightbox].src} alt={W.gallery[lightbox].label} className="w-full h-full object-cover"/>
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 py-7 px-6" style={{background:"linear-gradient(to top,rgba(14,12,10,.95),transparent)"}}>
                    <p className="fd italic text-xl mb-1" style={{color:G.ivory}}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[8px] font-semibold" style={{color:G.goldL,letterSpacing:".2em"}}>{String(lightbox+1).padStart(2,"0")} / {W.gallery.length}</p>
                  </div>
                  <div style={{position:"absolute",top:10,left:10,opacity:.42,pointerEvents:"none"}}><Corner pos="tl" size={32}/></div>
                  <button onClick={()=>{ setLightbox(null); setCursorLabel(""); }}
                    className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full fb text-sm font-semibold"
                    style={{background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(8px)"}}>✕</button>
                  {lightbox>0&&<button onClick={e=>{ e.stopPropagation(); setLbDir(-1); setLightbox(lightbox-1); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full"
                    style={{background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(6px)",fontSize:26}}>‹</button>}
                  {lightbox<W.gallery.length-1&&<button onClick={e=>{ e.stopPropagation(); setLbDir(1); setLightbox(lightbox+1); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full"
                    style={{background:"rgba(255,252,247,.14)",color:G.ivory,backdropFilter:"blur(6px)",fontSize:26}}>›</button>}
                </motion.div>
                {/* Thumbnail strip */}
                <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.2}}
                  onClick={e=>e.stopPropagation()}
                  className="flex gap-1.5 px-4 py-3 flex-wrap justify-center max-w-xs"
                  style={{background:"rgba(14,12,10,.72)",backdropFilter:"blur(14px)"}}>
                  {W.gallery.map((_,i)=>(
                    <button key={i} onClick={e=>{ e.stopPropagation(); setLbDir(i>lightbox!?1:-1); setLightbox(i); }}
                      style={{width:i===lightbox?42:28,height:42,overflow:"hidden",transition:"all .3s",opacity:i===lightbox?1:.38,outline:i===lightbox?`1.5px solid ${G.gold}`:undefined,outlineOffset:"1px"}}>
                      <img src={W.gallery[i].src.replace("w=1100","w=100")} alt="" className="w-full h-full object-cover"/>
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
