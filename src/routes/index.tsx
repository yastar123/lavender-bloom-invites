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

/* ─── PALETTE & DATA ─── */
const G = {
  gold:"#C09050", goldL:"#E0C080", goldD:"#8A6030", goldXL:"#F4D898",
  deep:"#12100E", ivory:"#FFFCF7", cream:"#FDF8F0",
  muted:"#7A6A58", rose:"#D4A8A0", roseDark:"#B88078",
};

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
    { year:"2019", title:"Pertemuan Pertama", sub:"Sebuah senyum yang mengubah segalanya", body:"Kami bertemu pertama kali di acara orientasi kampus. Satu tatapan yang tak sengaja, menjadi awal dari cerita yang paling indah dalam hidup kami.", img:"https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=700&h=900&q=85&fit=crop" },
    { year:"2021", title:"Jatuh Cinta", sub:"Dua hati yang akhirnya bicara", body:"Dua tahun persahabatan yang dalam, perlahan berubah menjadi cinta yang tulus. Kami tahu, ini adalah sesuatu yang sangat istimewa.", img:"https://images.unsplash.com/photo-1529635696947-b3f8c0d35b3c?w=700&h=900&q=85&fit=crop" },
    { year:"2023", title:"Lamaran", sub:"Momen yang paling dinantikan", body:"Di tepi pantai Bali, saat matahari tenggelam, Fadli berlutut dan bertanya, 'Maukah kamu menjadi teman hidupku?' Anis menjawab dengan air mata bahagia.", img:"https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=700&h=900&q=85&fit=crop" },
    { year:"2024", title:"Hari Bahagia", sub:"Selamanya dimulai hari ini", body:"27 April 2024 — hari yang selalu kami impikan. Bersama keluarga dan sahabat tercinta, kami resmi menyatukan dua jiwa dalam ikatan suci.", img:"https://images.unsplash.com/photo-1519741497674-611481863552?w=700&h=900&q=85&fit=crop" },
  ],
  gallery:[
    { src:"https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&h=1200&q=88&fit=crop", label:"Momen Pertama", tall:true },
    { src:"https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&h=600&q=88&fit=crop", label:"Dalam Kebun Bunga", tall:false },
    { src:"https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&h=1200&q=88&fit=crop", label:"Cincin Kami", tall:true },
    { src:"https://images.unsplash.com/photo-1511285560929-80b456503681?w=900&h=600&q=88&fit=crop", label:"Tarian Pertama", tall:false },
    { src:"https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=900&h=1200&q=88&fit=crop", label:"Dekorasi Akad", tall:true },
    { src:"https://images.unsplash.com/photo-1583939411023-14783179e581?w=900&h=600&q=88&fit=crop", label:"Bunga Cinta", tall:false },
    { src:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=1200&q=88&fit=crop", label:"Momen Bersama", tall:true },
    { src:"https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=900&h=600&q=88&fit=crop", label:"Sang Pengantin", tall:false },
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

/* ─── SVG ATOMS ─── */
function GLine({ className="w-16 mx-auto" }:{ className?:string }) {
  return <div className={`h-px ${className}`} style={{ background:`linear-gradient(to right,transparent,${G.gold}99,transparent)` }}/>;
}
function DiamondRow({ count=3, light=false }:{ count?:number; light?:boolean }) {
  const c = light ? G.goldL : G.gold;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px opacity-30" style={{ background:c }}/>
      {Array.from({length:count}).map((_,i)=>(
        <svg key={i} width={i===1?9:6} height={i===1?9:6} viewBox="0 0 9 9" fill="none">
          <path d="M4.5 0L9 4.5L4.5 9L0 4.5Z" fill={c} opacity={i===1?".85":".45"}/>
        </svg>
      ))}
      <div className="flex-1 h-px opacity-30" style={{ background:c }}/>
    </div>
  );
}
function Corner({ pos, size=48 }:{ pos:"tl"|"tr"|"bl"|"br"; size?:number }) {
  const deg={tl:0,tr:90,br:180,bl:270};
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ transform:`rotate(${deg[pos]}deg)` }}>
      <path d="M3 3 L20 3" stroke={G.gold} strokeWidth=".8" opacity=".55"/>
      <path d="M3 3 L3 20" stroke={G.gold} strokeWidth=".8" opacity=".55"/>
      <circle cx="3" cy="3" r="2.5" fill={G.gold} opacity=".65"/>
      <circle cx="20" cy="3" r="1" fill={G.gold} opacity=".3"/>
      <circle cx="3" cy="20" r="1" fill={G.gold} opacity=".3"/>
      <path d="M3 3 Q18 3 18 18" stroke={G.gold} strokeWidth=".4" opacity=".22" fill="none"/>
    </svg>
  );
}
function OrnamentRing({ size=220, opacity=1 }:{ size?:number; opacity?:number }) {
  const cx=size/2, cy=size/2, r1=cx-4, r2=cx-18, r3=cx-30;
  const dots1=[0,45,90,135,180,225,270,315], dots2=[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5];
  const diamonds=[0,60,120,180,240,300];
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" style={{ opacity }}>
      <circle cx={cx} cy={cy} r={r1} stroke={G.gold} strokeWidth=".5" strokeDasharray="3 7" opacity=".5"/>
      <circle cx={cx} cy={cy} r={r2} stroke={G.gold} strokeWidth=".7" opacity=".6"/>
      <circle cx={cx} cy={cy} r={r3} stroke={G.gold} strokeWidth=".4" strokeDasharray="1 6" opacity=".35"/>
      <circle cx={cx} cy={cy} r="3" fill={G.gold} opacity=".6"/>
      {dots1.map((deg,i)=>{ const a=deg*Math.PI/180; return <circle key={i} cx={cx+r2*Math.cos(a)} cy={cy+r2*Math.sin(a)} r="1.8" fill={G.gold} opacity=".5"/>; })}
      {dots2.map((deg,i)=>{ const a=deg*Math.PI/180; return <circle key={i} cx={cx+r3*Math.cos(a)} cy={cy+r3*Math.sin(a)} r="1" fill={G.gold} opacity=".3"/>; })}
      {diamonds.map((deg,i)=>{ const a=deg*Math.PI/180, x=cx+r1*Math.cos(a), y=cy+r1*Math.sin(a); return <path key={i} d={`M${x} ${y-4}L${x+3} ${y}L${x} ${y+4}L${x-3} ${y}Z`} fill={G.gold} opacity=".45"/>; })}
    </svg>
  );
}
function FloralDivider({ light=false, width=400 }:{ light?:boolean; width?:number }) {
  const c = light ? G.goldL : G.gold;
  return (
    <svg viewBox="0 0 440 48" fill="none" style={{ width:"100%", maxWidth:width, display:"block" }}>
      <line x1="0" y1="24" x2="168" y2="24" stroke={c} strokeWidth=".5" opacity=".3"/>
      <line x1="272" y1="24" x2="440" y2="24" stroke={c} strokeWidth=".5" opacity=".3"/>
      <path d="M180 24 Q192 10 204 24 Q192 38 180 24Z" fill={c} opacity=".28"/>
      <path d="M260 24 Q248 10 236 24 Q248 38 260 24Z" fill={c} opacity=".28"/>
      <path d="M170 24 Q178 15 186 24 Q178 33 170 24Z" fill={c} opacity=".18"/>
      <path d="M270 24 Q262 15 254 24 Q262 33 270 24Z" fill={c} opacity=".18"/>
      <circle cx="220" cy="24" r="6" stroke={c} strokeWidth="1" opacity=".7"/>
      <circle cx="220" cy="24" r="2.5" fill={c} opacity=".7"/>
      <circle cx="161" cy="24" r="2" fill={c} opacity=".5"/>
      <circle cx="279" cy="24" r="2" fill={c} opacity=".5"/>
      <circle cx="148" cy="24" r="1.2" fill={c} opacity=".28"/>
      <circle cx="292" cy="24" r="1.2" fill={c} opacity=".28"/>
    </svg>
  );
}

/* ─── REVEAL ─── */
function Reveal({ children, delay=0, y=28, once=true, className="", style={} }:{
  children:React.ReactNode; delay?:number; y?:number; once?:boolean; className?:string; style?:React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity:0, y }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once, amount:0.08 }}
      transition={{ duration:0.95, delay, ease:[0.22,1,0.36,1] }}
      className={className} style={style}
    >{children}</motion.div>
  );
}

/* ─── TILT CARD ─── */
function TiltCard({ children, style={}, className="" }:{ children:React.ReactNode; style?:React.CSSProperties; className?:string }) {
  const ref=useRef<HTMLDivElement>(null);
  const rx=useMotionValue(0), ry=useMotionValue(0);
  const srx=useSpring(rx,{stiffness:140,damping:18}), sry=useSpring(ry,{stiffness:140,damping:18});
  const onMove=useCallback((e:React.MouseEvent)=>{ if(!ref.current)return; const r=ref.current.getBoundingClientRect(); ry.set(((e.clientX-r.left)/r.width-.5)*8); rx.set(-(((e.clientY-r.top)/r.height)-.5)*8); },[rx,ry]);
  const onLeave=useCallback(()=>{ rx.set(0); ry.set(0); },[rx,ry]);
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX:srx, rotateY:sry, transformStyle:"preserve-3d", ...style }} className={className}>{children}</motion.div>
  );
}

/* ─── MAGNETIC ─── */
function Magnetic({ children, className="", style={}, onClick, href }:{
  children:React.ReactNode; className?:string; style?:React.CSSProperties; onClick?:()=>void; href?:string;
}) {
  const ref=useRef<HTMLDivElement>(null);
  const x=useMotionValue(0), y=useMotionValue(0);
  const sx=useSpring(x,{stiffness:150,damping:16}), sy=useSpring(y,{stiffness:150,damping:16});
  const onMove=useCallback((e:React.MouseEvent)=>{ if(!ref.current)return; const r=ref.current.getBoundingClientRect(); x.set((e.clientX-r.left-r.width/2)*.28); y.set((e.clientY-r.top-r.height/2)*.28); },[x,y]);
  const onLeave=useCallback(()=>{ x.set(0); y.set(0); },[x,y]);
  const Tag=href?"a":"button";
  const extra=href?{href,target:"_blank",rel:"noreferrer"}:{onClick};
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <motion.div style={{x:sx,y:sy}}>
        <Tag {...(extra as React.AnchorHTMLAttributes<HTMLAnchorElement>)} className={className} style={style}>{children}</Tag>
      </motion.div>
    </div>
  );
}

/* ─── CURSOR ─── */
function Cursor() {
  const cx=useMotionValue(-100), cy=useMotionValue(-100);
  const sx=useSpring(cx,{stiffness:280,damping:28}), sy=useSpring(cy,{stiffness:280,damping:28});
  const [hov,setHov]=useState(false), [click,setClick]=useState(false);
  useEffect(()=>{
    const mv=(e:MouseEvent)=>{ cx.set(e.clientX); cy.set(e.clientY); };
    const mo=(e:MouseEvent)=>{ if((e.target as HTMLElement).closest("a,button,[role=button]"))setHov(true); };
    const mu=()=>setHov(false), md=()=>setClick(true), mup=()=>setClick(false);
    window.addEventListener("mousemove",mv); window.addEventListener("mouseover",mo);
    window.addEventListener("mouseout",mu); window.addEventListener("mousedown",md); window.addEventListener("mouseup",mup);
    return()=>{ window.removeEventListener("mousemove",mv); window.removeEventListener("mouseover",mo); window.removeEventListener("mouseout",mu); window.removeEventListener("mousedown",md); window.removeEventListener("mouseup",mup); };
  },[]);
  return (
    <motion.div className="fixed z-[199] pointer-events-none hidden lg:flex items-center justify-center"
      style={{ x:sx, y:sy, marginLeft:"-18px", marginTop:"-18px" }}>
      <motion.div className="rounded-full"
        animate={{ width:click?5:hov?44:11, height:click?5:hov?44:11, background:hov?"rgba(192,144,80,0)":G.gold, border:hov?`1.5px solid ${G.gold}`:"1.5px solid rgba(192,144,80,0)", opacity:hov?.6:.9 }}
        transition={{ type:"spring",stiffness:340,damping:28 }} style={{ mixBlendMode:"multiply" }}/>
    </motion.div>
  );
}

/* ─── SCROLL BAR ─── */
function ScrollBar() {
  const { scrollYProgress }=useScroll();
  const scaleX=useSpring(scrollYProgress,{stiffness:100,damping:30});
  return <motion.div className="fixed top-0 left-0 right-0 z-[60] origin-left" style={{ height:2.5, scaleX, background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD})` }}/>;
}

/* ─── LOADER ─── */
function Loader({ onDone }:{ onDone:()=>void }) {
  const el=useRef<HTMLDivElement>(null);
  useGSAP(()=>{
    const tl=gsap.timeline({ onComplete:onDone });
    tl.set(".ldr-all",{ visibility:"visible" })
      .fromTo(".ldr-ring1",{ scale:.3, opacity:0 },{ scale:1, opacity:.18, duration:2, ease:"expo.out" },0)
      .fromTo(".ldr-ring2",{ scale:.5, opacity:0 },{ scale:1, opacity:.1, duration:2.4, ease:"expo.out" },0.2)
      .fromTo(".ldr-tag",{ opacity:0, letterSpacing:"0.05em" },{ opacity:1, letterSpacing:"0.52em", duration:1.3, ease:"power2.out" },0.4)
      .fromTo(".ldr-a",{ opacity:0, y:50, skewY:6 },{ opacity:1, y:0, skewY:0, duration:1.1, ease:"expo.out" },0.7)
      .fromTo(".ldr-amp",{ opacity:0, scale:.2 },{ opacity:1, scale:1, duration:.7, ease:"back.out(2.2)" },1.2)
      .fromTo(".ldr-f",{ opacity:0, y:50, skewY:-6 },{ opacity:1, y:0, skewY:0, duration:1.1, ease:"expo.out" },0.9)
      .fromTo(".ldr-date",{ opacity:0, y:10 },{ opacity:1, y:0, duration:.8 },1.6)
      .fromTo(".ldr-line",{ scaleX:0 },{ scaleX:1, duration:1.6, ease:"power2.inOut" },1.4)
      .fromTo(".ldr-bar",{ scaleX:0 },{ scaleX:1, duration:1.6, ease:"power2.inOut" },1.4)
      .to(".ldr-all",{ opacity:0, duration:1.1, ease:"power2.inOut" },2.8);
  },{ scope:el });
  return (
    <div ref={el} className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden" style={{ background:G.deep }}>
      {/* film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[.035] mix-blend-overlay" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}/>
      {/* radial glow */}
      <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 70% 65% at 50% 50%,${G.gold}12,transparent 65%)` }}/>
      <div className="ldr-all invisible absolute pointer-events-none ldr-ring1"><OrnamentRing size={480}/></div>
      <div className="ldr-all invisible absolute pointer-events-none ldr-ring2"><OrnamentRing size={280}/></div>
      <div className="ldr-all invisible relative text-center px-8">
        <p className="ldr-tag fb text-[8px] font-semibold mb-10" style={{ color:G.goldL, letterSpacing:".05em" }}>UNDANGAN PERNIKAHAN</p>
        <div className="overflow-hidden flex items-center justify-center gap-5">
          <span className="ldr-a fs" style={{ fontSize:"clamp(72px,16vw,120px)", color:G.ivory, lineHeight:1, display:"block" }}>A</span>
          <span className="ldr-amp fd italic" style={{ fontSize:"clamp(28px,6vw,48px)", color:G.goldL, display:"block" }}>&amp;</span>
          <span className="ldr-f fs" style={{ fontSize:"clamp(72px,16vw,120px)", color:G.ivory, lineHeight:1, display:"block" }}>F</span>
        </div>
        <div className="ldr-line my-8 mx-auto origin-center" style={{ height:1, width:180, background:`linear-gradient(to right,transparent,${G.gold},transparent)`, transform:"scaleX(0)" }}/>
        <p className="ldr-date fd italic" style={{ fontSize:"clamp(12px,2vw,15px)", color:`${G.ivory}50` }}>27 · 04 · 2024</p>
        {/* progress bar */}
        <div className="mt-10 mx-auto overflow-hidden rounded-full" style={{ width:160, height:1.5, background:`${G.ivory}12` }}>
          <div className="ldr-bar h-full origin-left" style={{ background:`linear-gradient(to right,${G.goldD},${G.gold},${G.goldXL})`, transform:"scaleX(0)" }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── GALLERY EMBLA ─── */
function Gallery({ onOpen }:{ onOpen:(i:number)=>void }) {
  const [emblaRef,emblaApi]=EmblaCarousel({ loop:true, dragFree:true, align:"start" });
  const [sel,setSel]=useState(0);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(()=>{
    if(!emblaApi)return;
    emblaApi.on("select",()=>setSel(emblaApi.selectedScrollSnap()));
    const start=()=>{ timer.current=setInterval(()=>emblaApi.scrollNext(),3800); };
    const stop=()=>{ if(timer.current){clearInterval(timer.current);timer.current=null;} };
    start();
    emblaApi.on("pointerDown",stop);
    emblaApi.on("pointerUp",()=>{ stop(); start(); });
    return()=>stop();
  },[emblaApi]);
  return (
    <div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background:`linear-gradient(to right,${G.deep},transparent)` }}/>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background:`linear-gradient(to left,${G.deep},transparent)` }}/>
        <div ref={emblaRef} className="overflow-hidden select-none" style={{ cursor:"grab" }}>
          <div className="flex gap-4 sm:gap-5 pl-6 sm:pl-14">
            {W.gallery.map((ph,i)=>(
              <motion.button key={i}
                initial={{ opacity:0, y:24, scale:.94 }}
                whileInView={{ opacity:1, y:0, scale:1 }}
                viewport={{ once:true }}
                transition={{ delay:Math.min(i*.06,.3), duration:.85, ease:[0.22,1,0.36,1] }}
                onClick={()=>onOpen(i)}
                className="relative overflow-hidden shrink-0 group gallery-card"
                style={{ width:"clamp(200px,26vw,310px)", aspectRatio:"3/4" }}
              >
                <img src={ph.src} alt={ph.label} className="gallery-img w-full h-full object-cover"/>
                <div className="absolute inset-0" style={{ background:"linear-gradient(to top,rgba(18,16,14,.96) 0%,rgba(18,16,14,.1) 52%,transparent 100%)" }}/>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background:`radial-gradient(ellipse at center,${G.gold}16,transparent 65%)` }}/>
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" style={{ background:`linear-gradient(to right,transparent,${G.goldL},transparent)` }}/>
                <div className="absolute inset-x-0 bottom-0 px-5 py-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <p className="fb text-[7px] font-semibold mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75" style={{ color:G.goldL, letterSpacing:".22em" }}>{String(i+1).padStart(2,"0")} / {W.gallery.length}</p>
                  <p className="fd italic text-lg" style={{ color:G.ivory }}>{ph.label}</p>
                </div>
                <div className="absolute top-2.5 left-2.5 opacity-35 pointer-events-none"><Corner pos="tl" size={32}/></div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-8">
        {W.gallery.map((_,i)=>(
          <motion.button key={i} onClick={()=>emblaApi?.scrollTo(i)} aria-label={`Foto ${i+1}`}
            animate={{ width:i===sel?30:8, background:i===sel?G.gold:`${G.ivory}22` }}
            transition={{ duration:.3, ease:[0.22,1,0.36,1] }}
            style={{ height:8, borderRadius:4, border:"none", cursor:"pointer", padding:0 }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── ANIMATED SECTION LABEL ─── */
function SectionLabel({ children, light=false }:{ children:string; light?:boolean }) {
  return (
    <Reveal>
      <div className="flex items-center justify-center gap-4 mb-6">
        <DiamondRow light={light}/>
      </div>
      <p className="fb text-center text-[8.5px] font-semibold -mt-3 mb-2" style={{ color:light?G.goldL:G.gold, letterSpacing:".62em" }}>{children}</p>
    </Reveal>
  );
}

/* ─── SECTION HEADING ─── */
function SectionHeading({ children, light=false, size="default", className="" }:{
  children:string; light?:boolean; size?:"sm"|"default"|"lg"; className?:string;
}) {
  const fs = size==="lg"?"clamp(36px,6.5vw,60px)":size==="sm"?"clamp(26px,4.5vw,40px)":"clamp(32px,5.8vw,52px)";
  const words=children.split(" ");
  return (
    <h2 className={`fd font-light text-center ${className}`} style={{ fontSize:fs, color:light?G.ivory:G.deep, lineHeight:1.15, letterSpacing:".01em" }}>
      {words.map((w,i)=>(
        <span key={i} className="inline-block overflow-hidden mr-[.22em] last:mr-0">
          <motion.span
            initial={{ y:"115%", opacity:0 }}
            whileInView={{ y:"0%", opacity:1 }}
            viewport={{ once:true, amount:0.8 }}
            transition={{ duration:.85, delay:i*.09, ease:[0.22,1,0.36,1] }}
            style={{ display:"inline-block" }}
          >{w}</motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ─── BOKEH BG ─── */
function BokehBg({ dark=false }:{ dark?:boolean }) {
  const orbs=useMemo(()=>[
    {x:"10%",y:"18%",s:200,d:0,dur:9},{x:"80%",y:"12%",s:140,d:1.6,dur:11},
    {x:"50%",y:"72%",s:220,d:.9,dur:13},{x:"22%",y:"78%",s:160,d:2.4,dur:10},
    {x:"90%",y:"58%",s:110,d:.4,dur:12},{x:"60%",y:"35%",s:90,d:1.8,dur:8},
  ],[]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map((o,i)=>(
        <motion.div key={i}
          animate={{ scale:[1,1.2,1], opacity:[.35,.8,.35] }}
          transition={{ duration:o.dur, repeat:Infinity, delay:o.d, ease:"easeInOut" }}
          style={{ position:"absolute", left:o.x, top:o.y, width:o.s, height:o.s, borderRadius:"50%",
            background:dark?`radial-gradient(circle,${G.gold}1A,transparent 70%)`:`radial-gradient(circle,${G.rose}28,transparent 70%)`,
            filter:"blur(36px)", transform:"translate(-50%,-50%)" }}/>
      ))}
    </div>
  );
}

/* ─── FLOATING PARTICLES ─── */
const PETALS=Array.from({length:16}).map((_,i)=>({ id:i, left:(i*7.3)%100, delay:(i*1.8)%14, dur:18+(i%5)*4 }));

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
  const [form,setForm]=useState({ nama:"", hadir:"Hadir", ucapan:"" });
  const [submitted,setSubmitted]=useState(false);
  const [copied,setCopied]=useState<string|null>(null);
  const lenisRef=useRef<unknown>(null);
  const heroRef=useRef<HTMLImageElement>(null);

  /* Lenis */
  useEffect(()=>{
    if(!opened||typeof window==="undefined")return;
    let lenis:unknown;
    import("lenis").then(({default:Lenis})=>{
      lenis=new Lenis({ lerp:.08, smoothWheel:true, wheelMultiplier:.88, touchMultiplier:1.4 });
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

  /* Nav intersection */
  useEffect(()=>{
    if(!opened)return;
    const ids=["pembukaan","cerita","acara","galeri","rsvp"];
    const obs=new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting)setActiveNav(e.target.id); }); },{ rootMargin:"-35% 0px -55% 0px" });
    ids.forEach(id=>{ const el=document.getElementById(id); if(el)obs.observe(el); });
    return()=>obs.disconnect();
  },[opened]);

  /* Hero parallax */
  useGSAP(()=>{
    if(!heroRef.current)return;
    gsap.fromTo(heroRef.current,{ yPercent:-5 },{ yPercent:20, ease:"none", scrollTrigger:{ trigger:heroRef.current, start:"top top", end:"bottom top", scrub:1.5 } });
  },[]);

  /* GSAP fade-ins */
  useGSAP(()=>{
    if(!opened)return;
    gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach(el=>{
      gsap.fromTo(el,{ opacity:0, y:36 },{ opacity:1, y:0, duration:.95, ease:"power3.out", scrollTrigger:{ trigger:el, start:"top 88%", once:true } });
    });
  },{ dependencies:[opened] });

  useEffect(()=>{ try{ const r=localStorage.getItem("rsvps"); if(r)setRsvps(JSON.parse(r)); }catch{} },[]);
  const tryPlay=()=>audioRef.current?.play().then(()=>setPlaying(true)).catch(()=>{});
  useEffect(()=>{ if(opened)tryPlay(); },[opened]);
  const toggleMusic=()=>{ const a=audioRef.current; if(!a)return; if(playing){a.pause();setPlaying(false);}else tryPlay(); };
  const openInvitation=()=>{ setOpened(true); requestAnimationFrame(()=>window.scrollTo({top:0})); };
  const submitRsvp=(e:React.FormEvent)=>{
    e.preventDefault();
    if(!form.nama.trim()||!form.ucapan.trim())return;
    const next:Rsvp[]=[{...form,ts:Date.now()},...rsvps];
    setRsvps(next); try{localStorage.setItem("rsvps",JSON.stringify(next));}catch{}
    setForm({nama:"",hadir:"Hadir",ucapan:""}); setSubmitted(true); setTimeout(()=>setSubmitted(false),3500);
  };
  const copyBank=(no:string)=>{ navigator.clipboard?.writeText(no.replace(/\s/g,"")).catch(()=>{}); setCopied(no); setTimeout(()=>setCopied(null),2500); };
  const openLb=(i:number,dir=1)=>{ setLbDir(dir); setLightbox(i); };

  const navItems=[
    {id:"pembukaan",label:"Pasangan"},{id:"cerita",label:"Kisah"},
    {id:"acara",label:"Acara"},{id:"galeri",label:"Galeri"},{id:"rsvp",label:"RSVP"},
  ];
  const navTo=(id:string)=>{
    setActiveNav(id);
    if(lenisRef.current){ const el=document.getElementById(id); if(el)(lenisRef.current as{scrollTo:(el:Element,opts:{offset:number})=>void}).scrollTo(el,{offset:-60}); }
    else document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  };

  /* ─── JSX ─── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        html{-webkit-text-size-adjust:100%;scroll-behavior:smooth;}
        body{font-family:'Montserrat',sans-serif;background:${G.ivory};color:${G.deep};margin:0;padding:0;overflow-x:hidden;}
        @media(hover:hover) and (pointer:fine){body{cursor:none;}}
        .fs{font-family:'Great Vibes',cursive;}
        .fd{font-family:'Cormorant Garamond',Georgia,serif;}
        .fb{font-family:'Montserrat',sans-serif;}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:${G.gold}66;border-radius:2px;}

        /* Grain overlay */
        #grain{position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.028;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode:overlay;}

        /* Gold shimmer text */
        @keyframes shimG{0%{background-position:-300% 0}100%{background-position:300% 0}}
        .gshim{background:linear-gradient(90deg,${G.goldD} 0%,${G.gold} 22%,${G.goldXL} 48%,${G.gold} 74%,${G.goldD} 100%);background-size:300% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:shimG 7s linear infinite;}

        /* Button pulse */
        @keyframes pulse2{0%,100%{box-shadow:0 0 0 0 ${G.gold}70}65%{box-shadow:0 0 0 22px ${G.gold}00}}
        .btn-pulse{animation:pulse2 3s ease-out infinite;}

        /* Animations */
        @keyframes vSpin{to{transform:rotate(360deg)}}
        .vspin{animation:vSpin 3.5s linear infinite;}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .float{animation:floatY 5s ease-in-out infinite;}
        @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(6deg)}}
        .float-slow{animation:floatSlow 9s ease-in-out infinite;}
        @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .rotate-slow{animation:rotateSlow 45s linear infinite;}
        @keyframes rotateCCW{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        .rotate-ccw{animation:rotateCCW 60s linear infinite;}

        /* Gold shimmer button */
        @keyframes goldShimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .btn-shimmer{background:linear-gradient(90deg,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD});background-size:200% auto;animation:goldShimmer 4s linear infinite;}

        /* Animated card border */
        @keyframes borderFlow{0%,100%{opacity:.6}50%{opacity:1}}

        /* Forms */
        input,select,textarea{font-family:'Montserrat',sans-serif;-webkit-appearance:none;border-radius:0;}
        input::placeholder,textarea::placeholder{color:${G.ivory}38;}
        input:focus,select:focus,textarea:focus{outline:none;box-shadow:0 0 0 1.5px ${G.gold}99!important;}
        select option{background:${G.deep};color:${G.ivory};}

        /* Marquee */
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-inner{display:flex;animation:marquee 30s linear infinite;width:max-content;}
        .marquee-inner:hover{animation-play-state:paused;}
        @keyframes marqueeR{from{transform:translateX(-50%)}to{transform:translateX(0)}}
        .marquee-r{display:flex;animation:marqueeR 30s linear infinite;width:max-content;}

        /* Gallery */
        .gallery-card{transition:box-shadow .5s ease,transform .5s cubic-bezier(.22,1,.36,1);}
        .gallery-card:hover{transform:translateY(-8px);box-shadow:0 40px 80px rgba(18,16,14,.55),0 0 0 1px ${G.gold}35!important;}
        .gallery-img{filter:brightness(.86) saturate(1.08);transition:filter .6s ease,transform .8s cubic-bezier(.22,1,.36,1);}
        .gallery-card:hover .gallery-img{filter:brightness(1) saturate(1.14);transform:scale(1.05);}

        /* Story timeline */
        @keyframes dotPulse{0%,100%{box-shadow:0 0 0 0 ${G.gold}55}70%{box-shadow:0 0 0 12px ${G.gold}00}}
        .dot-active{animation:dotPulse 2.5s ease-out infinite;}

        /* Nav */
        .nav-item{position:relative;padding-bottom:3px;}
        .nav-item::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:${G.gold};transform:scaleX(0);transform-origin:left;transition:transform .35s ease;}
        .nav-item.active::after{transform:scaleX(1);}

        /* Hover lift */
        .hover-lift{transition:transform .45s cubic-bezier(.22,1,.36,1),box-shadow .45s ease;}
        .hover-lift:hover{transform:translateY(-8px);box-shadow:0 32px 80px rgba(192,144,80,.22)!important;}

        /* Portrait double frame */
        .portrait-frame::before{content:'';position:absolute;inset:8px;border:1px solid ${G.gold}28;pointer-events:none;z-index:2;}

        /* Card glow */
        @keyframes cardGlow{0%,100%{box-shadow:0 12px 44px rgba(192,144,80,.1)}50%{box-shadow:0 18px 60px rgba(192,144,80,.22)}}
        .card-glow{animation:cardGlow 4.5s ease-in-out infinite;}

        /* RSVP */
        .rsvp-feed{scrollbar-width:thin;scrollbar-color:${G.gold}44 transparent;}
        .rsvp-feed::-webkit-scrollbar{width:2px;}
        .rsvp-feed::-webkit-scrollbar-thumb{background:${G.gold}55;border-radius:2px;}
        .rsvp-item{transition:border-color .25s,background .25s;}
        .rsvp-item:hover{border-color:${G.gold}44!important;background:rgba(255,252,247,.06)!important;}

        img{transition:opacity .4s ease;}
      `}</style>

      <div id="grain" aria-hidden="true"/>
      <Cursor/>
      {!loaded && <Loader onDone={()=>setLoaded(true)}/>}

      {loaded && (
        <div className="w-full min-h-screen relative">

          {/* ═══════ COVER ═══════ */}
          <AnimatePresence mode="wait">
            {!opened && (
              <motion.div key="cover"
                initial={{ opacity:1 }}
                exit={{ opacity:0, filter:"blur(14px)", scale:1.04 }}
                transition={{ duration:1.4, ease:[0.22,1,0.36,1] }}
                className="fixed inset-0 z-50 flex flex-col lg:flex-row overflow-hidden"
              >
                {/* ── Left photo ── */}
                <div className="hidden lg:block lg:w-[55%] h-full relative overflow-hidden">
                  <img ref={heroRef}
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=92&fit=crop"
                    alt="Wedding" className="w-full object-cover absolute inset-0"
                    style={{ height:"120%", width:"100%", objectPosition:"center" }} loading="eager"/>
                  {/* Layered dark vignette */}
                  <div className="absolute inset-0" style={{ background:"linear-gradient(130deg,rgba(18,16,14,.04) 0%,rgba(18,16,14,.72) 100%)" }}/>
                  <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 65% 90% at 90% 50%,${G.gold}16,transparent 58%)` }}/>
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-16">
                    <motion.p initial={{ opacity:0, letterSpacing:".08em" }} animate={{ opacity:1, letterSpacing:".52em" }}
                      transition={{ delay:.6, duration:1.5 }}
                      className="fb text-[8px] font-semibold mb-12" style={{ color:`${G.ivory}72` }}>
                      THE WEDDING OF
                    </motion.p>
                    {/* Names stagger */}
                    <div className="overflow-hidden">
                      <motion.div initial={{ y:"120%", skewY:6 }} animate={{ y:0, skewY:0 }}
                        transition={{ delay:.8, duration:1.3, ease:[0.22,1,0.36,1] }}>
                        <h1 className="fs block" style={{ fontSize:"clamp(82px,10.5vw,128px)", color:G.ivory, lineHeight:1, textShadow:"0 10px 48px rgba(0,0,0,.55)" }}>{W.bride}</h1>
                      </motion.div>
                    </div>
                    <motion.div initial={{ scaleX:0, opacity:0 }} animate={{ scaleX:1, opacity:1 }} transition={{ delay:1.15, duration:1 }}
                      className="flex items-center gap-5 my-4">
                      <div className="h-px w-14 opacity-40" style={{ background:G.goldL }}/>
                      <span className="fd italic" style={{ fontSize:26, color:G.goldL }}>&amp;</span>
                      <div className="h-px w-14 opacity-40" style={{ background:G.goldL }}/>
                    </motion.div>
                    <div className="overflow-hidden">
                      <motion.div initial={{ y:"120%", skewY:-6 }} animate={{ y:0, skewY:0 }}
                        transition={{ delay:1.15, duration:1.3, ease:[0.22,1,0.36,1] }}>
                        <h1 className="fs block" style={{ fontSize:"clamp(82px,10.5vw,128px)", color:G.ivory, lineHeight:1, textShadow:"0 10px 48px rgba(0,0,0,.55)" }}>{W.groom}</h1>
                      </motion.div>
                    </div>
                    <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.7, duration:1.2 }}
                      className="fd italic mt-10" style={{ fontSize:"clamp(14px,1.8vw,20px)", color:`${G.ivory}62` }}>
                      {W.dateText}
                    </motion.p>
                  </div>
                  {/* Corner ornaments */}
                  <div className="absolute top-5 left-5 opacity-55"><Corner pos="tl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-55"><Corner pos="br"/></div>
                  <div className="absolute top-5 right-5 opacity-28"><Corner pos="tr"/></div>
                  <div className="absolute bottom-5 left-5 opacity-28"><Corner pos="bl"/></div>
                  {/* Ambient floating dots */}
                  {[{t:"12%",l:"8%",d:0},{t:"82%",l:"6%",d:1.4},{t:"15%",l:"88%",d:.7},{t:"78%",l:"90%",d:2.1}].map((s,i)=>(
                    <motion.div key={i} animate={{ opacity:[.14,.32,.14], scale:[1,1.4,1] }} transition={{ duration:6+i,repeat:Infinity,delay:s.d }}
                      className="absolute w-1.5 h-1.5 rounded-full pointer-events-none" style={{ top:s.t, left:s.l, background:G.goldL }}/>
                  ))}
                </div>

                {/* ── Right card ── */}
                <div className="w-full lg:w-[45%] h-full flex items-center justify-center px-5 py-10 sm:px-10 relative overflow-hidden"
                  style={{ background:G.ivory }}>
                  {/* Mobile BG photo */}
                  <div className="lg:hidden absolute inset-0 pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80&fit=crop"
                      alt="" className="w-full h-full object-cover object-center"/>
                    <div className="absolute inset-0" style={{ background:"rgba(255,252,247,.88)" }}/>
                  </div>
                  {/* Desktop rose glow */}
                  <div className="hidden lg:block absolute inset-0 pointer-events-none"
                    style={{ background:`radial-gradient(ellipse 180% 85% at 50% -22%,${G.rose}65,transparent 50%)` }}/>
                  {/* Rotating rings */}
                  <div className="absolute pointer-events-none rotate-slow" style={{ opacity:.055 }}>
                    <OrnamentRing size={400}/>
                  </div>
                  <div className="absolute pointer-events-none rotate-ccw" style={{ opacity:.03 }}>
                    <OrnamentRing size={260}/>
                  </div>
                  {/* Gold sparkle particles */}
                  {[{t:"6%",l:"6%",c:"✦",s:18,d:0},{t:"8%",l:"88%",c:"✧",s:14,d:.9},{t:"88%",l:"6%",c:"✿",s:16,d:1.8},{t:"86%",l:"87%",c:"❋",s:18,d:2.6},{t:"46%",l:"3%",c:"✦",s:10,d:3.5},{t:"42%",l:"93%",c:"✧",s:12,d:1.3},{t:"28%",l:"94%",c:"✿",s:9,d:2.2},{t:"66%",l:"2%",c:"✦",s:8,d:.5}]
                    .map((sp,i)=>(
                    <motion.span key={i} aria-hidden="true" className="absolute pointer-events-none select-none"
                      style={{ top:sp.t, left:sp.l, color:G.gold, fontSize:sp.s, opacity:.18 }}
                      animate={{ y:[0,-15,0], opacity:[.1,.28,.1], rotate:[0,22,0] }}
                      transition={{ duration:5+i*.7, repeat:Infinity, delay:sp.d }}>{sp.c}</motion.span>
                  ))}

                  <TiltCard style={{ maxWidth:390, width:"100%" }}>
                    <motion.div initial={{ opacity:0, y:36, scale:.94 }} animate={{ opacity:1, y:0, scale:1 }}
                      transition={{ duration:1.4, delay:.3, ease:[0.22,1,0.36,1] }}
                      className="relative w-full text-center">

                      {/* Animated glow border */}
                      <motion.div className="absolute -inset-[1.5px] pointer-events-none"
                        animate={{ opacity:[.55,.9,.55] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
                        style={{ background:`linear-gradient(135deg,${G.goldD}55,${G.gold}90,${G.goldXL}60,${G.gold}50,${G.goldD}40)`, filter:"blur(1px)" }}/>

                      <div className="relative px-7 py-10 sm:px-10 sm:py-12"
                        style={{ border:`1px solid ${G.gold}55`, background:"rgba(255,252,247,.9)", backdropFilter:"blur(28px)", WebkitBackdropFilter:"blur(28px)" }}>
                        {/* Top gold accent */}
                        <div className="absolute inset-x-0 top-0 h-[2.5px]"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}95,transparent)` }}/>
                        <div className="absolute inset-x-0 bottom-0 h-px"
                          style={{ background:`linear-gradient(to right,transparent,${G.gold}50,transparent)` }}/>
                        {/* Corner marks */}
                        {(["tl","tr","bl","br"] as const).map((p,i)=>{
                          const pos=p==="tl"?"top-3 left-3":p==="tr"?"top-3 right-3":p==="bl"?"bottom-3 left-3":"bottom-3 right-3";
                          const d=p==="tl"?"M0 14L0 0L14 0":p==="tr"?"M22 14L22 0L8 0":p==="bl"?"M0 8L0 22L14 22":"M22 8L22 22L8 22";
                          return (
                            <div key={i} className={`absolute ${pos}`}>
                              <svg viewBox="0 0 22 22" fill="none" width="22" height="22"><path d={d} stroke={G.gold} strokeWidth="1.2" opacity=".65"/></svg>
                            </div>
                          );
                        })}

                        {/* Mobile names */}
                        <div className="lg:hidden mb-8">
                          <motion.p initial={{ opacity:0, letterSpacing:".05em" }} animate={{ opacity:1, letterSpacing:".48em" }}
                            transition={{ duration:1.4, delay:.35 }}
                            className="fb text-[8px] font-semibold mb-5" style={{ color:G.gold }}>THE WEDDING OF</motion.p>
                          <GLine className="w-14 mx-auto mb-5"/>
                          <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.6, duration:1 }}>
                            <span className="fs gshim block" style={{ fontSize:"clamp(50px,13vw,72px)", lineHeight:1 }}>{W.bride}</span>
                            <span className="fd italic block my-2" style={{ color:G.muted, fontSize:21 }}>&amp;</span>
                            <span className="fs gshim block" style={{ fontSize:"clamp(50px,13vw,72px)", lineHeight:1 }}>{W.groom}</span>
                          </motion.div>
                          <GLine className="w-14 mx-auto mt-5 mb-4"/>
                          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
                            className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</motion.p>
                        </div>

                        {/* Desktop brief */}
                        <div className="hidden lg:block mb-8">
                          <motion.p initial={{ opacity:0, letterSpacing:".05em" }} animate={{ opacity:1, letterSpacing:".46em" }}
                            transition={{ duration:1.4, delay:.3 }}
                            className="fb text-[8px] font-semibold mb-4" style={{ color:G.gold }}>UNDANGAN PERNIKAHAN</motion.p>
                          <GLine className="w-16 mx-auto mb-5"/>
                          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.52, duration:1 }}>
                            <span className="fs gshim block" style={{ fontSize:"clamp(44px,6.5vw,66px)", lineHeight:1 }}>{W.bride}</span>
                            <span className="fd italic block my-2" style={{ color:G.muted, fontSize:18 }}>&amp;</span>
                            <span className="fs gshim block" style={{ fontSize:"clamp(44px,6.5vw,66px)", lineHeight:1 }}>{W.groom}</span>
                          </motion.div>
                          <GLine className="w-16 mx-auto mt-5 mb-4"/>
                          <p className="fd italic text-sm" style={{ color:G.muted }}>{W.dateText}</p>
                        </div>

                        {/* Guest box */}
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }} className="mb-7">
                          <div className="relative py-3.5 px-5" style={{ background:`linear-gradient(135deg,${G.cream}90,${G.ivory}70)`, border:`1px solid ${G.gold}22` }}>
                            <div className="absolute inset-x-0 top-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}45,transparent)` }}/>
                            <p className="fb text-[7px] font-semibold mb-1.5" style={{ color:G.gold, letterSpacing:".42em" }}>KEPADA YTH.</p>
                            <p className="fb text-[10px] mb-1" style={{ color:G.muted }}>Bpk/Ibu/Saudara/i</p>
                            <p className="fd font-medium" style={{ fontSize:"clamp(19px,5vw,24px)", color:G.deep }}>{guest}</p>
                            <p className="fb text-[9px] mt-0.5" style={{ color:G.muted }}>Di Tempat</p>
                          </div>
                        </motion.div>

                        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1.2, duration:.9 }} className="mb-7">
                          <GLine className="w-14 mx-auto"/>
                        </motion.div>

                        <Magnetic onClick={openInvitation}
                          className="btn-pulse btn-shimmer fb inline-flex items-center gap-2.5 px-10 py-4 text-[9px] font-semibold"
                          style={{ color:G.ivory, letterSpacing:".2em", boxShadow:`0 14px 40px ${G.gold}55` }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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

          {/* ═══════ MAIN CONTENT ═══════ */}
          {opened && (
            <div className="flex flex-col lg:flex-row w-full min-h-screen">
              <ScrollBar/>

              {/* Falling petals */}
              <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
                {PETALS.map(p=>(
                  <motion.div key={p.id}
                    initial={{ y:"-5%", opacity:0, rotate:0 }}
                    animate={{ y:"108vh", opacity:[0,.15,.15,0], rotate:p.id%2===0?400:-400, x:[0,24,-18,14,0] }}
                    transition={{ duration:p.dur, delay:p.delay, repeat:Infinity, ease:"linear" }}
                    style={{ position:"absolute", left:`${p.left}%`, fontSize:9+p.id%5*2, color:G.gold }}>
                    {p.id%4===0?"✿":p.id%4===1?"❋":p.id%4===2?"✦":"❀"}
                  </motion.div>
                ))}
              </div>

              {/* ── SIDEBAR ── */}
              <aside className="hidden lg:flex lg:w-[27%] xl:w-[25%] 2xl:w-[23%] sticky top-0 h-screen flex-col overflow-hidden shrink-0"
                style={{ borderRight:`1px solid ${G.gold}22` }}>
                <div className="flex-1 relative overflow-hidden min-h-0">
                  <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&q=90&fit=crop&crop=top"
                    alt="Anis & Fadli" className="absolute inset-0 w-full object-cover"
                    style={{ height:"124%", objectPosition:"top center" }}/>
                  <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(18,16,14,.02) 0%,rgba(18,16,14,.48) 60%,rgba(18,16,14,.88) 100%)" }}/>
                  {/* Inner vignette ring */}
                  <div className="absolute inset-0" style={{ boxShadow:"inset 0 0 48px rgba(18,16,14,.35)" }}/>
                  <div className="absolute top-4 left-4 opacity-55"><Corner pos="tl"/></div>
                  <div className="absolute top-4 right-4 opacity-55"><Corner pos="tr"/></div>
                  <div className="absolute bottom-28 left-4 opacity-28"><Corner pos="bl"/></div>
                  <div className="absolute bottom-28 right-4 opacity-28"><Corner pos="br"/></div>
                  <div className="absolute bottom-0 inset-x-0 px-5 pb-3.5">
                    <p className="fd italic text-[11px]" style={{ color:`${G.ivory}48` }}>Bersatu dalam cinta sejati</p>
                  </div>
                </div>
                <div className="px-5 py-5 text-center shrink-0" style={{ background:G.ivory, borderTop:`1px solid ${G.gold}2A` }}>
                  <p className="fb text-[7.5px] font-semibold mb-2" style={{ color:G.gold, letterSpacing:".55em" }}>THE WEDDING OF</p>
                  <div className="flex items-baseline justify-center gap-2 mt-1.5">
                    <span className="fs" style={{ fontSize:38, color:G.deep, lineHeight:1 }}>{W.bride}</span>
                    <span className="fd italic text-xl" style={{ color:G.gold }}>&amp;</span>
                    <span className="fs" style={{ fontSize:38, color:G.deep, lineHeight:1 }}>{W.groom}</span>
                  </div>
                  <GLine className="w-10 mx-auto my-3"/>
                  <p className="fd italic text-xs mb-4" style={{ color:G.muted }}>{W.dateText}</p>
                  <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>navTo(item.id)}
                        className={`nav-item fb text-[7.5px] font-semibold py-1 transition-colors duration-200 ${activeNav===item.id?"active":""}`}
                        style={{ color:activeNav===item.id?G.gold:G.muted, letterSpacing:".16em" }}>
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* ── RIGHT PANEL ── */}
              <div className="flex-1 min-w-0 overflow-x-hidden" style={{ background:G.ivory }}>

                {/* Mobile nav */}
                <motion.nav initial={{ y:-52, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:.3, ease:[0.22,1,0.36,1] }}
                  className="sticky top-0 z-40 lg:hidden"
                  style={{ background:"rgba(255,252,247,.96)", backdropFilter:"blur(26px)", WebkitBackdropFilter:"blur(26px)", borderBottom:`1px solid ${G.gold}1E` }}>
                  <div className="flex items-center justify-center py-2.5 gap-0.5 px-2">
                    {navItems.map(item=>(
                      <button key={item.id} onClick={()=>navTo(item.id)}
                        className="fb relative px-2.5 sm:px-4 py-2 text-[7.5px] font-semibold transition-colors duration-200"
                        style={{ color:activeNav===item.id?G.gold:G.muted, letterSpacing:".1em" }}>
                        {item.label.toUpperCase()}
                        {activeNav===item.id&&(
                          <motion.div layoutId="nav-bg" className="absolute inset-0 rounded-sm -z-10"
                            style={{ background:`${G.gold}12` }} transition={{ type:"spring",stiffness:380,damping:34 }}/>
                        )}
                        {activeNav===item.id&&(
                          <motion.div layoutId="nav-line" className="absolute bottom-0 left-2 right-2 h-[1.5px]"
                            style={{ background:G.gold }} transition={{ type:"spring",stiffness:380,damping:34 }}/>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.nav>

                {/* ══ PEMBUKAAN ══ */}
                <section id="pembukaan" className="relative overflow-hidden">
                  {/* Full-bleed hero banner */}
                  <div className="relative h-[55vh] sm:h-[62vh] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1511285560929-80b456503681?w=1600&q=88&fit=crop"
                      alt="" className="absolute inset-0 w-full h-full object-cover object-center"/>
                    <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(18,16,14,.35) 0%,rgba(18,16,14,.15) 35%,rgba(255,252,247,.0) 60%,rgba(255,252,247,1) 100%)" }}/>
                    {/* Centered text on banner */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                      <motion.p initial={{ opacity:0, letterSpacing:".05em" }} whileInView={{ opacity:1, letterSpacing:".52em" }}
                        viewport={{ once:true }} transition={{ duration:1.5 }}
                        className="fb text-[7.5px] font-semibold mb-7" style={{ color:`${G.ivory}80` }}>PASANGAN</motion.p>
                      <div className="overflow-hidden">
                        <motion.h1 initial={{ y:"110%" }} whileInView={{ y:0 }} viewport={{ once:true }}
                          transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
                          className="fs" style={{ fontSize:"clamp(54px,11vw,90px)", color:G.ivory, lineHeight:1, textShadow:"0 8px 32px rgba(0,0,0,.5)" }}>
                          {W.bride} &amp; {W.groom}
                        </motion.h1>
                      </div>
                      <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
                        transition={{ delay:.5, duration:1.2 }}
                        className="mt-6" style={{ height:1, width:120, background:`linear-gradient(to right,transparent,${G.goldL},transparent)` }}/>
                    </div>
                    {/* Corner decorations */}
                    <div className="absolute top-4 left-4 opacity-40"><Corner pos="tl"/></div>
                    <div className="absolute top-4 right-4 opacity-40"><Corner pos="tr"/></div>
                  </div>

                  {/* Content below banner */}
                  <div className="relative px-5 sm:px-14 pt-0 pb-24 sm:pb-32 overflow-hidden" style={{ background:G.ivory }}>
                    <BokehBg/>
                    {/* Large bg ornament */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rotate-slow" style={{ opacity:.045 }}>
                      <OrnamentRing size={440}/>
                    </div>

                    <div className="text-center max-w-2xl mx-auto relative pt-10">
                      {/* Bismillah card */}
                      <Reveal>
                        <div className="inline-block relative mb-2"
                          style={{ border:`1px solid ${G.gold}30`, background:`linear-gradient(145deg,${G.cream},${G.ivory})`, padding:"18px 36px" }}>
                          <div className="absolute inset-x-0 top-0 h-[2px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}65,transparent)` }}/>
                          <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}65,transparent)` }}/>
                          <p className="fd font-light" style={{ fontSize:"clamp(26px,5.5vw,42px)", color:G.deep, letterSpacing:".04em" }}>
                            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </p>
                        </div>
                      </Reveal>

                      <Reveal delay={.1}>
                        <div className="flex justify-center my-8"><FloralDivider/></div>
                      </Reveal>

                      {/* Quote */}
                      <Reveal delay={.16}>
                        <div className="relative max-w-lg mx-auto px-8 sm:px-12 py-8 mb-3 card-glow"
                          style={{ background:`linear-gradient(145deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}24` }}>
                          <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}55,transparent)` }}/>
                          <div className="absolute top-4 left-5 fd italic text-5xl leading-none pointer-events-none" style={{ color:G.gold, opacity:.1 }}>"</div>
                          <div className="absolute bottom-4 right-5 fd italic text-5xl leading-none pointer-events-none" style={{ color:G.gold, opacity:.1 }}>"</div>
                          <p className="fd font-light mb-4" style={{ fontSize:"clamp(15px,2.5vw,18px)", color:G.deep, letterSpacing:".02em" }}>{W.verse}</p>
                          <blockquote className="fd italic leading-[2.1]" style={{ fontSize:"clamp(12.5px,2vw,14.5px)", color:G.muted }}>
                            {W.verseId}
                          </blockquote>
                        </div>
                      </Reveal>

                      <Reveal delay={.22}>
                        <p className="fb text-[8.5px] font-semibold mb-10" style={{ color:G.gold, letterSpacing:".4em" }}>— {W.verseSub} —</p>
                      </Reveal>

                      <Reveal delay={.28}>
                        <p className="fd italic text-sm sm:text-base leading-[2.2] mb-16 px-2" style={{ color:G.muted }}>
                          Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud menyelenggarakan
                          walimatul 'ursy putra-putri kami:
                        </p>
                      </Reveal>

                      {/* Couple portraits */}
                      <div className="flex flex-col sm:flex-row gap-14 sm:gap-0 items-start justify-center relative">
                        {[
                          { img:"https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=700&q=88&fit=crop&crop=face", lbl:"THE BRIDE", name:W.bride, full:W.brideFull, role:"Putri dari", parents:W.brideParents, dx:-48 },
                          { img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&q=88&fit=crop&crop=face", lbl:"THE GROOM", name:W.groom, full:W.groomFull, role:"Putra dari", parents:W.groomParents, dx:48 },
                        ].map((p,i)=>(
                          <motion.div key={p.name}
                            initial={{ opacity:0, x:p.dx }}
                            whileInView={{ opacity:1, x:0 }}
                            viewport={{ once:true }}
                            transition={{ duration:1.25, delay:i*.2, ease:[0.22,1,0.36,1] }}
                            className="flex-1 text-center w-full max-w-[240px] mx-auto">
                            {/* Portrait */}
                            <motion.div whileHover={{ y:-10, scale:1.025 }} transition={{ duration:.5, ease:[0.22,1,0.36,1] }}
                              className="relative mx-auto mb-6 portrait-frame"
                              style={{ width:"min(180px,46vw)", aspectRatio:"3/4" }}>
                              {/* Outer glow */}
                              <div className="absolute -inset-4 rounded-sm pointer-events-none"
                                style={{ background:`radial-gradient(ellipse,${G.gold}15,transparent 70%)`, opacity:0 }}
                                onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.opacity="1"}
                                onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.opacity="0"}/>
                              {/* Outer frame */}
                              <div className="absolute -inset-[6px]" style={{ border:`1px solid ${G.gold}28` }}/>
                              {/* Main image frame */}
                              <div className="absolute inset-0 overflow-hidden"
                                style={{ border:`1.5px solid ${G.gold}65`, boxShadow:`0 36px 88px rgba(192,144,80,.28)` }}>
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.07]"/>
                                <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,transparent 42%,rgba(18,16,14,.5))" }}/>
                                <div className="absolute inset-x-0 bottom-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}95,transparent)` }}/>
                                <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}48,transparent)` }}/>
                              </div>
                              {/* Corner dots */}
                              {[["top-0.5 left-0.5"],["top-0.5 right-0.5"],["bottom-0.5 left-0.5"],["bottom-0.5 right-0.5"]].map(([c],j)=>(
                                <div key={j} className={`absolute ${c} w-1.5 h-1.5 rounded-full`} style={{ background:G.gold, opacity:.65 }}/>
                              ))}
                            </motion.div>
                            <p className="fb text-[7.5px] font-semibold mb-3" style={{ color:G.gold, letterSpacing:".38em" }}>{p.lbl}</p>
                            <h2 className="fs" style={{ fontSize:60, color:G.deep, lineHeight:1.05 }}>{p.name}</h2>
                            <p className="fd italic text-sm mt-2 mb-2" style={{ color:G.muted }}>{p.full}</p>
                            <GLine className="w-10 mx-auto my-3.5"/>
                            <p className="fb text-[10px]" style={{ color:G.muted }}>{p.role}</p>
                            <p className="fb text-[11px] font-semibold mt-1 leading-snug px-3" style={{ color:G.deep }}>{p.parents}</p>
                          </motion.div>
                        ))}
                        {/* Center & */}
                        <div className="hidden sm:flex absolute left-1/2 top-[10%] -translate-x-1/2 flex-col items-center gap-2 z-10">
                          <div className="w-px h-14 opacity-22" style={{ background:G.gold }}/>
                          <motion.div animate={{ scale:[1,1.16,1], opacity:[.65,1,.65] }} transition={{ duration:5, repeat:Infinity }}>
                            <span className="fd italic" style={{ fontSize:32, color:G.gold, lineHeight:1 }}>&amp;</span>
                          </motion.div>
                          <div className="w-px h-14 opacity-22" style={{ background:G.gold }}/>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ══ GOLD MARQUEE ══ */}
                <div className="relative overflow-hidden" style={{ background:`linear-gradient(90deg,${G.goldD},${G.gold},${G.goldXL},${G.gold},${G.goldD})` }}>
                  <div className="absolute inset-0 pointer-events-none opacity-[.08]" style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}/>
                  <div className="py-3.5 marquee-inner">
                    {Array.from({length:22}).map((_,i)=>(
                      <span key={i} className="fb text-[8px] font-semibold mx-6 shrink-0" style={{ color:G.ivory, letterSpacing:".52em", opacity:.9 }}>
                        {i%2===0?"ANIS & FADLI":"✦ 27 APRIL 2024 ✦"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ══ CERITA ══ */}
                <section id="cerita" className="relative py-24 sm:py-32 overflow-hidden" style={{ background:G.deep }}>
                  <BokehBg dark/>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 80% 60% at 90% 45%,${G.gold}08,transparent 55%)` }}/>
                  <div className="px-5 sm:px-14">
                    <div className="text-center mb-18">
                      <SectionLabel light>OUR LOVE STORY</SectionLabel>
                      <SectionHeading light size="lg" className="mt-3">Perjalanan Cinta Kami</SectionHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-8"><FloralDivider light/></div>
                      </Reveal>
                    </div>

                    {/* Story cards — alternating layout */}
                    <div className="max-w-2xl mx-auto space-y-6">
                      {W.story.map((s,i)=>(
                        <motion.div key={s.year}
                          initial={{ opacity:0, x:i%2===0?-40:40, y:20 }}
                          whileInView={{ opacity:1, x:0, y:0 }}
                          viewport={{ once:true, amount:0.2 }}
                          transition={{ duration:1, ease:[0.22,1,0.36,1] }}
                          className="relative overflow-hidden group"
                          style={{ border:`1px solid ${G.ivory}12`, background:"rgba(255,252,247,.025)" }}>
                          {/* Top shimmer */}
                          <div className="absolute inset-x-0 top-0 h-[1.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}55,transparent)` }}/>
                          {/* Left year bar */}
                          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}70,${G.gold}00)` }}/>
                          <div className="flex items-stretch">
                            {/* Photo */}
                            <div className="w-28 sm:w-40 shrink-0 overflow-hidden relative">
                              <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"/>
                              <div className="absolute inset-0" style={{ background:"linear-gradient(to right,transparent 55%,rgba(18,16,14,.55))" }}/>
                              {/* Year badge */}
                              <div className="absolute top-3 left-3 px-2.5 py-1" style={{ background:G.gold }}>
                                <span className="fb text-[8px] font-semibold" style={{ color:G.ivory, letterSpacing:".12em" }}>{s.year}</span>
                              </div>
                            </div>
                            {/* Text */}
                            <div className="flex-1 px-5 sm:px-7 py-5 sm:py-7">
                              <p className="fd italic text-[11px] mb-1.5" style={{ color:`${G.ivory}45` }}>{s.sub}</p>
                              <h3 className="fd font-normal mb-3" style={{ fontSize:"clamp(18px,3vw,24px)", color:G.ivory, lineHeight:1.2 }}>{s.title}</h3>
                              <p className="fb text-[11px] leading-[1.95]" style={{ color:`${G.ivory}55` }}>{s.body}</p>
                            </div>
                          </div>
                          {/* Bottom shimmer on hover */}
                          <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-600" style={{ background:`linear-gradient(to right,transparent,${G.gold}55,transparent)` }}/>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Wave */}
                <div style={{ background:G.deep, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", width:"100%", height:"auto" }}>
                    <path d="M0 80 Q200 0 500 44 Q800 80 1000 18 Q1110 0 1200 22 L1200 80 Z" fill={G.ivory}/>
                  </svg>
                </div>

                {/* ══ ACARA ══ */}
                <section id="acara" className="relative px-5 sm:px-14 py-24 sm:py-32 overflow-hidden">
                  <BokehBg/>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 110% 55% at 50% 112%,${G.rose}28,transparent 50%)` }}/>
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-16">
                      <SectionLabel>SAVE THE DATE</SectionLabel>
                      <SectionHeading size="lg" className="mt-3">Detail Acara</SectionHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-8"><FloralDivider/></div>
                      </Reveal>
                    </div>

                    {/* Countdown */}
                    <Reveal delay={.14}>
                      <div className="mb-16">
                        {(cd.d===0&&cd.h===0&&cd.m===0&&cd.s===0) ? (
                          <div className="relative py-14 text-center overflow-hidden"
                            style={{ border:`1px solid ${G.gold}45`, background:`linear-gradient(160deg,${G.cream},${G.ivory})` }}>
                            <div className="absolute inset-x-0 top-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}85,transparent)` }}/>
                            <motion.p animate={{ opacity:[.75,1,.75] }} transition={{ duration:4, repeat:Infinity }}
                              className="fs gshim block" style={{ fontSize:"clamp(32px,6.5vw,52px)" }}>
                              Selamat Menempuh Hidup Baru
                            </motion.p>
                            <p className="fb text-[8px] mt-5" style={{ color:G.gold, letterSpacing:".46em" }}>✦ 27 APRIL 2024 ✦</p>
                          </div>
                        ) : (
                          <div>
                            <p className="fb text-center text-[8.5px] font-semibold mb-7" style={{ color:G.muted, letterSpacing:".46em" }}>MENGHITUNG HARI</p>
                            <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                              {[{v:cd.d,l:"Hari"},{v:cd.h,l:"Jam"},{v:cd.m,l:"Menit"},{v:cd.s,l:"Detik"}].map(x=>(
                                <div key={x.l} className="relative overflow-hidden text-center py-7 sm:py-9"
                                  style={{ background:`linear-gradient(155deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}35`,
                                    boxShadow:`0 10px 36px rgba(192,144,80,.1)` }}>
                                  <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}85,transparent)` }}/>
                                  <div className="absolute inset-x-0 bottom-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}32,transparent)` }}/>
                                  <AnimatePresence mode="popLayout">
                                    <motion.span key={x.v}
                                      initial={{ y:-22, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:22, opacity:0 }}
                                      transition={{ duration:.32, ease:[0.22,1,0.36,1] }}
                                      className="fd block" style={{ fontSize:"clamp(30px,7vw,46px)", color:G.deep, fontWeight:300, lineHeight:1 }}>
                                      {String(x.v).padStart(2,"0")}
                                    </motion.span>
                                  </AnimatePresence>
                                  <span className="fb block mt-2.5" style={{ fontSize:"clamp(7px,1.7vw,9px)", color:G.gold, letterSpacing:".22em" }}>{x.l.toUpperCase()}</span>
                                  {/* Corners */}
                                  <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full" style={{ background:G.gold, opacity:.45 }}/>
                                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background:G.gold, opacity:.45 }}/>
                                  <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full" style={{ background:G.gold, opacity:.22 }}/>
                                  <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full" style={{ background:G.gold, opacity:.22 }}/>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Reveal>

                    {/* Event cards */}
                    <div className="space-y-6 mb-16">
                      {[
                        { title:"Akad Nikah", sub:"Ijab Kabul", num:"01", data:W.akad, img:"https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&h=500&q=90&fit=crop" },
                        { title:"Resepsi Pernikahan", sub:"Walimatul 'Ursy", num:"02", data:W.resepsi, img:"https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&h=500&q=90&fit=crop" },
                      ].map((ev,i)=>(
                        <Reveal key={ev.title} delay={i*.18}>
                          <div className="hover-lift relative overflow-hidden"
                            style={{ border:`1px solid ${G.gold}35`, boxShadow:`0 20px 64px rgba(192,144,80,.12)` }}>
                            {/* Number badge */}
                            <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center"
                              style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, boxShadow:`0 6px 22px ${G.gold}55` }}>
                              <span className="fb text-[10px] font-semibold" style={{ color:G.ivory }}>{ev.num}</span>
                            </div>
                            {/* Photo header */}
                            <div className="relative h-52 overflow-hidden">
                              <img src={ev.img} alt={ev.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"/>
                              <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(18,16,14,.08) 0%,rgba(18,16,14,.92) 100%)" }}/>
                              <div className="absolute inset-x-0 bottom-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}99,transparent)` }}/>
                              <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
                                <p className="fb text-[7.5px] font-semibold mb-1.5" style={{ color:G.goldL, letterSpacing:".35em" }}>{ev.sub.toUpperCase()}</p>
                                <h3 className="fd font-normal" style={{ fontSize:"clamp(24px,4.2vw,34px)", color:G.ivory, lineHeight:1.2 }}>{ev.title}</h3>
                              </div>
                              <div className="absolute top-2.5 right-2.5 opacity-40"><Corner pos="tr" size={36}/></div>
                            </div>
                            {/* Details */}
                            <div className="px-6 py-5" style={{ background:G.ivory }}>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                                <div className="space-y-2.5 flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background:`${G.gold}14`, border:`1px solid ${G.gold}30` }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                    </div>
                                    <p className="fb text-[12px] font-semibold" style={{ color:G.deep }}>{ev.data.time}</p>
                                  </div>
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background:`${G.gold}14`, border:`1px solid ${G.gold}30` }}>
                                      <svg width="10" height="12" viewBox="0 0 24 24" fill={G.gold}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                    </div>
                                    <div>
                                      <p className="fd italic" style={{ fontSize:"clamp(14px,2.5vw,17px)", color:G.deep, lineHeight:1.3 }}>{ev.data.place}</p>
                                      <p className="fb text-[10.5px] mt-0.5" style={{ color:G.muted }}>{ev.data.addr}</p>
                                    </div>
                                  </div>
                                </div>
                                <Magnetic href={ev.data.maps}
                                  className="fb inline-flex items-center gap-2 text-[9px] font-semibold px-7 py-3.5 shrink-0"
                                  style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold})`, color:G.ivory, letterSpacing:".12em", boxShadow:`0 8px 26px ${G.gold}42` }}>
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                  LIHAT PETA
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
                        style={{ background:`linear-gradient(150deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}32`, boxShadow:`0 14px 52px rgba(192,144,80,.1)` }}>
                        <div className="absolute inset-x-0 top-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}75,transparent)` }}/>
                        <div className="absolute top-3.5 left-3.5 opacity-14"><Corner pos="tl" size={38}/></div>
                        <div className="absolute top-3.5 right-3.5 opacity-14"><Corner pos="tr" size={38}/></div>
                        <div className="p-7 sm:p-10">
                          <div className="text-center mb-9">
                            <SectionLabel>DRESS CODE</SectionLabel>
                            <SectionHeading size="sm" className="mt-2">Tata Busana</SectionHeading>
                            <p className="fb text-[10.5px] mt-2.5" style={{ color:G.muted }}>Mohon kenakan warna busana berikut</p>
                          </div>
                          <div className="flex gap-7 sm:gap-12 justify-center flex-wrap">
                            {W.dressCode.map((d,i)=>(
                              <motion.div key={d.label}
                                initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
                                viewport={{ once:true }} transition={{ delay:i*.1, duration:.8 }}
                                whileHover={{ y:-9 }} className="text-center cursor-default">
                                <div className="relative mb-4">
                                  <motion.div whileHover={{ scale:1.2 }}
                                    style={{ width:66, height:66, background:d.color, borderRadius:"50%",
                                      border:`2.5px solid ${G.gold}32`, margin:"0 auto",
                                      boxShadow:`0 12px 32px ${d.color}90, 0 0 0 4px ${G.ivory}` }}/>
                                </div>
                                <p className="fb text-[10.5px] font-semibold" style={{ color:G.deep }}>{d.label}</p>
                                <p className="fb text-[9px] mt-0.5" style={{ color:G.muted }}>{d.for}</p>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-8 pt-6" style={{ borderTop:`1px dashed ${G.gold}28` }}>
                            <p className="fd italic text-center text-sm" style={{ color:G.muted }}>Hindari warna putih &amp; hitam penuh ✦</p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave 2 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", width:"100%", height:"auto" }}>
                    <path d="M0 20 Q300 80 600 38 Q900 0 1200 58 L1200 80 L0 80 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ GALERI ══ */}
                <section id="galeri" className="relative py-24 sm:py-32 overflow-hidden" style={{ background:G.deep }}>
                  <BokehBg dark/>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 80% 55% at 50% 100%,${G.gold}07,transparent 55%)` }}/>
                  <div className="text-center mb-14 px-5">
                    <SectionLabel light>OUR GALLERY</SectionLabel>
                    <SectionHeading light size="lg" className="mt-3">Momen Kami</SectionHeading>
                    <Reveal delay={.2}>
                      <div className="flex justify-center mt-8 mb-3"><FloralDivider light/></div>
                    </Reveal>
                    <Reveal delay={.3}>
                      <p className="fd italic text-sm" style={{ color:`${G.ivory}38` }}>Geser untuk melihat semua foto</p>
                    </Reveal>
                  </div>

                  {/* Masonry peek grid (static, top 6) */}
                  <div className="px-5 sm:px-14 mb-10 max-w-2xl mx-auto hidden sm:grid sm:grid-cols-3 gap-3">
                    {W.gallery.slice(0,6).map((ph,i)=>(
                      <motion.button key={i}
                        initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
                        viewport={{ once:true }} transition={{ delay:i*.06, duration:.75, ease:[0.22,1,0.36,1] }}
                        onClick={()=>openLb(i)}
                        className="relative overflow-hidden group"
                        style={{ aspectRatio:i%3===1?"3/4":"1/1" }}>
                        <img src={ph.src} alt={ph.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"/>
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                          style={{ background:`rgba(18,16,14,.55)` }}/>
                        <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-75">
                          <p className="fd italic text-sm" style={{ color:G.ivory }}>{ph.label}</p>
                        </div>
                        <div className="absolute inset-x-0 top-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}55,transparent)` }}/>
                      </motion.button>
                    ))}
                  </div>

                  <Gallery onOpen={i=>openLb(i)}/>
                </section>

                {/* Wave 3 */}
                <div style={{ background:G.deep, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", width:"100%", height:"auto" }}>
                    <path d="M0 58 Q300 0 600 38 Q900 80 1200 22 L1200 80 L0 80 Z" fill={G.ivory}/>
                  </svg>
                </div>

                {/* ══ HADIAH ══ */}
                <section className="relative px-5 sm:px-14 py-24 sm:py-32 overflow-hidden">
                  <BokehBg/>
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-14">
                      <SectionLabel>AMPLOP DIGITAL</SectionLabel>
                      <SectionHeading className="mt-3">Hadiah &amp; Doa</SectionHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-8 mb-6"><FloralDivider/></div>
                      </Reveal>
                      <Reveal delay={.28}>
                        <p className="fd italic text-sm sm:text-base leading-[2] px-2" style={{ color:G.muted }}>
                          Kehadiran dan doa restu Anda adalah hadiah terbesar.<br/>Namun bila berkenan mengirimkan hadiah:
                        </p>
                      </Reveal>
                    </div>
                    <div className="space-y-4 mb-8">
                      {W.bank.map((b,i)=>(
                        <Reveal key={b.no} delay={i*.16}>
                          <TiltCard>
                            <div className="relative overflow-hidden card-glow"
                              style={{ background:`linear-gradient(145deg,${G.cream},${G.ivory})`, border:`1px solid ${G.gold}48`, boxShadow:`0 16px 52px rgba(192,144,80,.14)` }}>
                              <div className="absolute inset-x-0 top-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}85,transparent)` }}/>
                              <div className="absolute left-0 top-0 bottom-0 w-[3.5px]" style={{ background:`linear-gradient(to bottom,${b.color}40,${b.color}95,${b.color}40)` }}/>
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="w-28 h-28 rounded-full opacity-[.055]" style={{ background:b.color, filter:"blur(20px)" }}/>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 pl-6">
                                <div>
                                  <p className="fb text-[7.5px] font-semibold mb-2" style={{ color:G.gold, letterSpacing:".34em" }}>{b.name.toUpperCase()}</p>
                                  <p className="fd font-medium tracking-wide" style={{ fontSize:"clamp(22px,5.5vw,34px)", color:G.deep }}>{b.no}</p>
                                  <p className="fb text-[11px] mt-1.5" style={{ color:G.muted }}>a.n. <span className="font-semibold" style={{ color:G.deep }}>{b.an}</span></p>
                                </div>
                                <motion.button whileHover={{ scale:1.08 }} whileTap={{ scale:.93 }}
                                  onClick={()=>copyBank(b.no)}
                                  className="fb shrink-0 self-start sm:self-center px-6 py-2.5 text-[9px] font-semibold transition-all duration-300"
                                  style={{ background:copied===b.no?G.gold:"transparent", color:copied===b.no?G.ivory:G.gold, border:`1.5px solid ${copied===b.no?G.gold:G.gold+"55"}`, letterSpacing:".14em", minWidth:92, boxShadow:copied===b.no?`0 8px 24px ${G.gold}45`:"none" }}>
                                  {copied===b.no?"✓ TERSALIN":"SALIN"}
                                </motion.button>
                              </div>
                            </div>
                          </TiltCard>
                        </Reveal>
                      ))}
                    </div>
                    <Reveal delay={.24}>
                      <div className="p-5 sm:p-6 text-center relative overflow-hidden"
                        style={{ border:`1.5px dashed ${G.gold}35`, background:G.cream }}>
                        <div className="absolute inset-x-0 top-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}42,transparent)` }}/>
                        <p className="fb text-[8px] font-semibold mb-2" style={{ color:G.gold, letterSpacing:".38em" }}>ATAU KIRIM KE ALAMAT</p>
                        <p className="fd italic text-base mt-2.5" style={{ color:G.deep }}>Jl. Anggrek Raya No. 12, Kebayoran Baru</p>
                        <p className="fb text-[11px] mt-0.5" style={{ color:G.muted }}>Jakarta Selatan, 12160</p>
                      </div>
                    </Reveal>
                  </div>
                </section>

                {/* Wave 4 */}
                <div style={{ background:G.ivory, marginBottom:"-2px" }}>
                  <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", width:"100%", height:"auto" }}>
                    <path d="M0 58 Q300 0 600 38 Q900 80 1200 22 L1200 80 L0 80 Z" fill={G.deep}/>
                  </svg>
                </div>

                {/* ══ RSVP ══ */}
                <section id="rsvp" className="relative py-24 sm:py-32 overflow-hidden" style={{ background:G.deep }}>
                  <BokehBg dark/>
                  <div className="absolute inset-0 pointer-events-none" style={{ background:`radial-gradient(ellipse 80% 60% at 50% 0%,${G.gold}10,transparent 50%)` }}/>
                  <div className="px-5 sm:px-14">
                    <div className="text-center mb-14">
                      <SectionLabel light>RSVP</SectionLabel>
                      <SectionHeading light size="lg" className="mt-3">Ucapan &amp; Doa</SectionHeading>
                      <Reveal delay={.2}>
                        <div className="flex justify-center mt-8 mb-3"><FloralDivider light/></div>
                      </Reveal>
                      <Reveal delay={.3}>
                        <p className="fd italic text-sm" style={{ color:`${G.ivory}40` }}>Sampaikan ucapan terbaik Anda untuk kami</p>
                      </Reveal>
                    </div>

                    <div className="max-w-lg mx-auto">
                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div key="ok"
                            initial={{ opacity:0, scale:.88, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0 }}
                            transition={{ duration:.6, ease:[0.22,1,0.36,1] }}
                            className="relative text-center py-20 overflow-hidden mb-8"
                            style={{ border:`1px solid ${G.gold}55`, background:"rgba(192,144,80,.06)" }}>
                            <div className="absolute inset-x-0 top-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}75,transparent)` }}/>
                            <motion.div animate={{ y:[0,-10,0], rotate:[0,6,-6,0] }} transition={{ duration:3.5, repeat:Infinity }}
                              className="text-5xl mb-5">✉</motion.div>
                            <p className="fd text-3xl mb-2.5" style={{ color:G.ivory }}>Terima Kasih</p>
                            <p className="fb text-[10.5px]" style={{ color:`${G.ivory}40` }}>Ucapan Anda telah tersimpan dengan indah</p>
                            <div className="flex justify-center mt-7"><FloralDivider light/></div>
                          </motion.div>
                        ) : (
                          <motion.form key="form"
                            initial={{ opacity:0, y:26 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                            transition={{ duration:.7, ease:[0.22,1,0.36,1] }}
                            onSubmit={submitRsvp} className="relative mb-8"
                            style={{ background:"rgba(255,252,247,.04)", border:`1px solid ${G.gold}35`, backdropFilter:"blur(6px)" }}>
                            <div className="absolute inset-x-0 top-0 h-[2.5px]" style={{ background:`linear-gradient(to right,transparent,${G.gold}70,transparent)` }}/>
                            <div className="absolute inset-x-0 bottom-0 h-px" style={{ background:`linear-gradient(to right,transparent,${G.gold}38,transparent)` }}/>
                            <div className="p-6 sm:p-8 space-y-3.5">
                              {/* Name */}
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".55"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                                <input required value={form.nama} onChange={e=>setForm({...form,nama:e.target.value})}
                                  placeholder="Nama lengkap Anda" className="fb w-full pl-10 pr-4 py-3.5 text-[12px]"
                                  style={{ background:"rgba(255,252,247,.07)", border:`1px solid ${G.gold}35`, color:G.ivory }}/>
                              </div>
                              {/* Attendance */}
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".55"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                                </div>
                                <select value={form.hadir} onChange={e=>setForm({...form,hadir:e.target.value})}
                                  className="fb w-full pl-10 pr-4 py-3.5 text-[12px]"
                                  style={{ background:"rgba(18,16,14,.95)", border:`1px solid ${G.gold}35`, color:G.ivory }}>
                                  <option value="Hadir">✓  Insya Allah Hadir</option>
                                  <option value="Tidak Hadir">✗  Belum Bisa Hadir</option>
                                </select>
                              </div>
                              {/* Message */}
                              <div className="relative">
                                <div className="absolute left-4 top-4 pointer-events-none">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={G.gold} strokeWidth="1.8" opacity=".55"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                </div>
                                <textarea required rows={4} value={form.ucapan} onChange={e=>setForm({...form,ucapan:e.target.value})}
                                  placeholder="Tulis ucapan dan doa terbaik untuk kedua mempelai..."
                                  className="fb w-full pl-10 pr-4 py-3.5 text-[12px] resize-none"
                                  style={{ background:"rgba(255,252,247,.07)", border:`1px solid ${G.gold}35`, color:G.ivory }}/>
                              </div>
                              {/* Submit */}
                              <motion.button type="submit"
                                whileHover={{ scale:1.016 }} whileTap={{ scale:.975 }}
                                className="fb w-full py-4 text-[9.5px] font-semibold flex items-center justify-center gap-2.5"
                                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldXL},${G.gold})`, color:G.ivory, letterSpacing:".2em", boxShadow:`0 14px 40px ${G.gold}48` }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
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
                                initial={{ opacity:0, x:-22, y:10 }} animate={{ opacity:1, x:0, y:0 }} exit={{ opacity:0 }}
                                transition={{ duration:.5, ease:[0.22,1,0.36,1] }}
                                className="rsvp-item relative p-4 sm:p-5"
                                style={{ background:"rgba(255,252,247,.04)", border:`1px solid ${G.gold}22` }}>
                                <div className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-r" style={{ background:`linear-gradient(to bottom,${G.gold}00,${G.gold}72,${G.gold}00)` }}/>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                      style={{ background:`linear-gradient(135deg,${G.gold}28,${G.gold}12)`, border:`1px solid ${G.gold}42` }}>
                                      <span className="fd italic text-base font-medium" style={{ color:G.gold }}>{r.nama[0]?.toUpperCase()}</span>
                                    </div>
                                    <p className="fd text-base font-medium" style={{ color:G.ivory }}>{r.nama}</p>
                                  </div>
                                  <span className="fb text-[7.5px] font-semibold px-2.5 py-1 shrink-0"
                                    style={{ background:r.hadir==="Hadir"?`${G.gold}20`:`${G.rose}18`, color:r.hadir==="Hadir"?G.gold:G.rose, border:`1px solid ${r.hadir==="Hadir"?G.gold+"44":G.rose+"44"}`, letterSpacing:".12em" }}>
                                    {r.hadir==="Hadir"?"✓ HADIR":"✕ BERHALANGAN"}
                                  </span>
                                </div>
                                <p className="fb text-[11px] leading-[1.88] italic pl-10" style={{ color:`${G.ivory}50` }}>{r.ucapan}</p>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                      {rsvps.length===0 && !submitted && (
                        <p className="fb text-center text-[11px] italic py-6" style={{ color:`${G.ivory}30` }}>
                          Belum ada ucapan. Jadilah yang pertama ✦
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* ══ PENUTUP ══ */}
                <section className="relative px-5 sm:px-14 py-32 sm:py-44 overflow-hidden">
                  {/* Full-bleed photo */}
                  <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&q=82&fit=crop"
                      alt="" className="w-full h-full object-cover object-center"/>
                    <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom,rgba(255,252,247,.96) 0%,rgba(255,252,247,.88) 45%,rgba(255,252,247,.93) 100%)" }}/>
                    <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse 140% 60% at 50% 50%,${G.rose}38,transparent 60%)` }}/>
                  </div>
                  {/* Rotating rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-slow pointer-events-none" style={{ opacity:.065 }}>
                    <OrnamentRing size={500}/>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-ccw pointer-events-none" style={{ opacity:.04 }}>
                    <OrnamentRing size={300}/>
                  </div>
                  <div className="absolute top-5 left-5 opacity-16 hidden sm:block"><Corner pos="tl"/></div>
                  <div className="absolute top-5 right-5 opacity-16 hidden sm:block"><Corner pos="tr"/></div>
                  <div className="absolute bottom-5 left-5 opacity-10 hidden sm:block"><Corner pos="bl"/></div>
                  <div className="absolute bottom-5 right-5 opacity-10 hidden sm:block"><Corner pos="br"/></div>

                  <div className="relative text-center max-w-lg mx-auto">
                    <Reveal>
                      <div className="flex items-center justify-center gap-3 mb-12">
                        <div className="h-px w-12 opacity-38" style={{ background:G.gold }}/>
                        <span className="fb text-[8px] font-semibold" style={{ color:G.gold, letterSpacing:".58em" }}>TERIMA KASIH</span>
                        <div className="h-px w-12 opacity-38" style={{ background:G.gold }}/>
                      </div>
                    </Reveal>

                    <div className="overflow-hidden mb-3">
                      <motion.span initial={{ y:"115%", opacity:0 }} whileInView={{ y:0, opacity:1 }}
                        viewport={{ once:true }} transition={{ duration:1.3, ease:[0.22,1,0.36,1] }}
                        className="fs gshim block" style={{ fontSize:"clamp(48px,11vw,88px)", lineHeight:1.1 }}>
                        Jazakumullah Khairan
                      </motion.span>
                    </div>

                    <Reveal delay={.18}>
                      <div className="flex justify-center my-11"><FloralDivider/></div>
                    </Reveal>

                    <Reveal delay={.24}>
                      <p className="fd italic leading-[2.15] mb-11 px-3" style={{ fontSize:"clamp(13px,2.2vw,16px)", color:G.muted }}>
                        Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
                        berkenan hadir dan memberikan doa restu kepada kedua mempelai.
                      </p>
                    </Reveal>

                    <Reveal delay={.3}>
                      <p className="fd italic text-sm mb-3" style={{ color:G.muted }}>Kami yang berbahagia,</p>
                      <motion.h3 animate={{ opacity:[.82,1,.82] }} transition={{ duration:4, repeat:Infinity }}
                        className="fs" style={{ fontSize:"clamp(46px,9.5vw,72px)", color:G.deep, lineHeight:1.1 }}>
                        {W.bride} &amp; {W.groom}
                      </motion.h3>
                    </Reveal>

                    <Reveal delay={.36}>
                      <div className="flex justify-center my-11"><FloralDivider/></div>
                    </Reveal>

                    <Reveal delay={.42}>
                      <Magnetic
                        href={`https://wa.me/?text=${encodeURIComponent(`Undangan pernikahan ${W.bride} & ${W.groom} — ${W.dateText}.`)}`}
                        className="fb inline-flex items-center gap-2.5 px-9 py-4 text-[9.5px] font-semibold"
                        style={{ background:"#25D366", color:"#fff", letterSpacing:".14em", boxShadow:"0 12px 36px rgba(37,211,102,.38)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        BAGIKAN KE WHATSAPP
                      </Magnetic>
                    </Reveal>

                    <Reveal delay={.5}>
                      <p className="fb text-[8px] mt-16" style={{ color:G.gold, opacity:.28, letterSpacing:".42em" }}>✦ MADE WITH LOVE ✦ 2024 ✦</p>
                    </Reveal>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ─ Music button ─ */}
          {opened && (
            <>
              <audio ref={audioRef} src={W.music[0]} loop preload="none" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
              <motion.button
                initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                transition={{ type:"spring", stiffness:220, delay:.8 }}
                whileHover={{ scale:1.16 }} whileTap={{ scale:.86 }}
                onClick={toggleMusic} aria-label={playing?"Pause music":"Play music"}
                className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[70] rounded-full flex items-center justify-center"
                style={{ background:`linear-gradient(135deg,${G.goldD},${G.gold},${G.goldXL})`, width:52, height:52, boxShadow:`0 14px 44px rgba(192,144,80,.65),0 0 0 1.5px ${G.gold}58` }}>
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
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-14 gap-5"
                style={{ background:"rgba(18,16,14,.97)", backdropFilter:"blur(32px)" }}>
                <motion.div
                  initial={{ scale:.82, opacity:0, y:32 }} animate={{ scale:1, opacity:1, y:0 }} exit={{ scale:.84, opacity:0 }}
                  transition={{ type:"spring", stiffness:270, damping:28 }}
                  onClick={e=>e.stopPropagation()}
                  className="relative overflow-hidden"
                  style={{ maxWidth:430, width:"100%", aspectRatio:"3/4", boxShadow:`0 60px 110px rgba(0,0,0,.75),0 0 0 1.5px ${G.gold}48` }}>
                  <AnimatePresence mode="wait">
                    <motion.img key={lightbox}
                      initial={{ opacity:0, x:lbDir*44 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:lbDir*-44 }}
                      transition={{ duration:.44, ease:[0.22,1,0.36,1] }}
                      src={W.gallery[lightbox].src} alt={W.gallery[lightbox].label} className="w-full h-full object-cover"/>
                  </AnimatePresence>
                  <div className="absolute inset-x-0 bottom-0 py-7 px-6" style={{ background:"linear-gradient(to top,rgba(18,16,14,.96),transparent)" }}>
                    <p className="fd italic text-xl mb-1" style={{ color:G.ivory }}>{W.gallery[lightbox].label}</p>
                    <p className="fb text-[8px] font-semibold" style={{ color:G.goldL, letterSpacing:".2em" }}>{String(lightbox+1).padStart(2,"0")} / {W.gallery.length}</p>
                  </div>
                  <div className="absolute top-3 left-3 opacity-42 pointer-events-none"><Corner pos="tl" size={34}/></div>
                  <button onClick={()=>setLightbox(null)} aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center fb text-sm font-semibold rounded-full"
                    style={{ background:"rgba(255,252,247,.15)", color:G.ivory, backdropFilter:"blur(8px)" }}>✕</button>
                  {lightbox > 0 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(-1); setLightbox(lightbox-1); }} aria-label="Previous"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full"
                      style={{ background:"rgba(255,252,247,.14)", color:G.ivory, backdropFilter:"blur(6px)", fontSize:24 }}>‹</button>
                  )}
                  {lightbox < W.gallery.length-1 && (
                    <button onClick={e=>{ e.stopPropagation(); setLbDir(1); setLightbox(lightbox+1); }} aria-label="Next"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full"
                      style={{ background:"rgba(255,252,247,.14)", color:G.ivory, backdropFilter:"blur(6px)", fontSize:24 }}>›</button>
                  )}
                </motion.div>
                {/* Thumbnail strip */}
                <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.2 }}
                  onClick={e=>e.stopPropagation()}
                  className="flex gap-2 px-4 py-3 flex-wrap justify-center max-w-xs rounded-sm"
                  style={{ background:"rgba(18,16,14,.68)", backdropFilter:"blur(14px)" }}>
                  {W.gallery.map((_,i)=>(
                    <button key={i} onClick={e=>{ e.stopPropagation(); setLbDir(i>lightbox!?1:-1); setLightbox(i); }}
                      aria-label={`Photo ${i+1}`}
                      className="overflow-hidden transition-all duration-300 shrink-0"
                      style={{ width:i===lightbox?44:30, height:44, opacity:i===lightbox?1:.38, outline:i===lightbox?`1.5px solid ${G.gold}`:undefined, outlineOffset:"1px" }}>
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
