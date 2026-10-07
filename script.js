/* ============ DATA — edit properties here ============ */
const FEATURED=[
 {t:"Eloria Signature Residence",l:"Elegant Coastal Living Concept",p:"A resort-inspired sanctuary of warm textures, layered light and effortless sophistication designed for elevated everyday living.",pr:"$19,500.00",img:"--img-bedroom",pk:"Infinity View Concept"},
 {t:"Maple Ridge Residence",l:"Karen, Nairobi",p:"A serene timber-and-stone home framed by lush gardens, soft natural light and exceptional family comfort.",pr:"$24,800.00",img:"--img-hero",pk:"Forest Edge Concept"},
 {t:"Olive Court Loft",l:"Westlands, Nairobi",p:"Double-height living with sculpted detailing, rich natural finishes and a refined, contemporary sense of luxury.",pr:"$16,200.00",img:"--img-kitchen",pk:"Studio Loft Concept"}];
const HERO_PHOTOS=[
 "images/jason-briscoe-UV81E0oXXWQ-unsplash.jpg",
 "images/naksha-banwao-QSXDXnYE8WQ-unsplash.jpg",
 "images/lotus-design-n-print-wRzBarqn3hs-unsplash.jpg",
 "images/jason-briscoe-UV81E0oXXWQ-unsplash.jpg",
 "images/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg",
 "images/francesca-tosolini-qnSTxcs0EEs-unsplash.jpg",
 "images/frames-for-your-heart-zSG-kd-L6vw-unsplash.jpg",
 "images/aaron-huber-G7sE2S4Lab4-unsplash.jpg"
];
const HERO_HEADLINES=[
 ["Designing Spaces","That Define","Luxury"],
 ["Find Your Place","In The Heart","Of Home"],
 ["Light, Space","And A Little","More Living"],
 ["A Better View","A Brighter","Way To Live"],
 ["Room To Breathe","Room To Dream","Room To Grow"],
 ["Make Every Day","Feel A Little","More Special"],
 ["Your Next Chapter","Begins Right","At Home"],
 ["Come Home To","Something","Exceptional"]
];
const PROPS=[
 {n:"The Maple Ridge",c:"villa",l:"Karen, Nairobi",p:"$1.8M",img:"--img-hero",m:"5 bd · 6 ba · 520 m²"},
 {n:"Coastal Haven",c:"villa",l:"Diani Beach",p:"$2.4M",img:"--img-bedroom",m:"4 bd · 5 ba · 410 m²"},
 {n:"Olive Court",c:"apartment",l:"Westlands",p:"$420K",img:"--img-kitchen",m:"2 bd · 2 ba · 120 m²"},
 {n:"Skyline Penthouse",c:"penthouse",l:"Upper Hill",p:"$1.2M",img:"--img-living",m:"3 bd · 3 ba · 260 m²"},
 {n:"Garden Residence",c:"apartment",l:"Kilimani",p:"$360K",img:"--img-dining",m:"2 bd · 2 ba · 105 m²"},
 {n:"The Terrace Suite",c:"penthouse",l:"Riverside",p:"$980K",img:"--img-bedroom",m:"3 bd · 4 ba · 230 m²"}];

const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

const routePaths=$$(".page").map(p=>p.dataset.page);
const burger=$("#burger");
const curtain=$("#curtain");let busy=false,current=null;

function normalizePath(path){
  const safePath=path && routePaths.includes(path)?path:"/";
  return safePath;
}
function closeMenu(){
  document.body.classList.remove("menu-open");
  if(burger){
    burger.setAttribute("aria-expanded","false");
  }
}
function show(path){
  const safePath=normalizePath(path);
  $$(".page").forEach(p=>p.classList.toggle("active",p.dataset.page===safePath));
  $$(".links a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+safePath));
  window.scrollTo(0,0);closeMenu();
  $$(".reveal").forEach(e=>e.classList.remove("show"));
  setTimeout(observe,60);
  $$(".hero h1 i").forEach(i=>{i.style.animation="none";i.offsetWidth;i.style.animation=""});
  current=safePath;
}
function go(){
  const path=normalizePath(location.hash.slice(1)||"/");
  if(path===current||busy)return;
  if(current===null){show(path);return}
  busy=true;curtain.className="curtain in";
  setTimeout(()=>{show(path);curtain.className="curtain out";
    setTimeout(()=>{curtain.className="curtain";busy=false},900)},1050);
}
addEventListener("hashchange",go);
document.addEventListener("click",e=>{
  const target=e.target;
  const a=target && target.closest ? target.closest("[data-link]") : null;
  if(a){
    if(a.getAttribute("href")==="#"+current)e.preventDefault();
    closeMenu();
  }
});
if(burger){
  burger.setAttribute("aria-expanded","false");
  burger.addEventListener("click",()=>{
    const open=document.body.classList.toggle("menu-open");
    burger.setAttribute("aria-expanded",String(open));
  });
}

/* ---------- Scroll reveal, nav, counters ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("show");io.unobserve(e.target)}}),{threshold:.15});
function observe(){$$(".page.active .reveal").forEach(e=>io.observe(e));countUp()}
function countUp(){$$(".page.active [data-count]").forEach(el=>{const to=+el.dataset.count,t0=performance.now();
  (function f(t){const k=Math.min((t-t0)/1600,1);el.textContent=Math.round(to*(1-Math.pow(1-k,3)))+(to>50?"+":"");if(k<1)requestAnimationFrame(f)})(t0)})}
const nav=$("#nav");
addEventListener("scroll",()=>nav.classList.toggle("solid",scrollY>60||current!=="/"),{passive:true});
addEventListener("hashchange",()=>setTimeout(()=>nav.classList.toggle("solid",scrollY>60||current!=="/"),1100));

/* ---------- Homepage background slideshow ---------- */
const heroPhotos=$$(".hero-photo",$(".hero"));
const heroHeadlineLines=$$(".hero h1 .line i");
let heroPhotoIndex=0,heroLayerIndex=0,heroPhotoLoading=false;
function updateHeroHeadline(index){
  HERO_HEADLINES[index].forEach((line,i)=>{
    heroHeadlineLines[i].textContent=line;
    heroHeadlineLines[i].style.animation="none";
    heroHeadlineLines[i].offsetWidth;
    heroHeadlineLines[i].style.animation="";
  });
}
function showNextHeroPhoto(){
  if(current!=="/"||document.hidden||heroPhotoLoading||heroPhotos.length<2)return;
  heroPhotoLoading=true;
  const nextIndex=(heroPhotoIndex+1)%HERO_PHOTOS.length;
  const image=new Image();
  image.onload=()=>{
    const nextLayerIndex=1-heroLayerIndex;
    heroPhotos[nextLayerIndex].style.backgroundImage=`url("${HERO_PHOTOS[nextIndex]}")`;
    heroPhotos[heroLayerIndex].classList.remove("active");
    heroPhotos[nextLayerIndex].classList.add("active");
    updateHeroHeadline(nextIndex);
    heroPhotoIndex=nextIndex;
    heroLayerIndex=nextLayerIndex;
    heroPhotoLoading=false;
  };
  image.onerror=()=>{
    console.error("Unable to load homepage background photo:",HERO_PHOTOS[nextIndex]);
    heroPhotoIndex=nextIndex;
    heroPhotoLoading=false;
  };
  image.src=HERO_PHOTOS[nextIndex];
}
setInterval(showNextHeroPhoto,7000);

/* ---------- Accordion ---------- */
$$("#acc li").forEach(li=>li.querySelector("button").onclick=()=>{
  const was=li.classList.contains("open");$$("#acc li").forEach(x=>x.classList.remove("open"));if(!was)li.classList.add("open")});
$$(".tabs button").forEach((b,i)=>b.onclick=()=>{$$(".tabs button").forEach(x=>x.classList.remove("on"));b.classList.add("on")});

/* ---------- Featured slider ---------- */
let idx=0;const dots=$("#dots");FEATURED.forEach(()=>dots.append(document.createElement("i")));
function slide(n){
  idx=(n+FEATURED.length)%FEATURED.length;const d=FEATURED[idx],img=$("#fImg");
  img.style.opacity=0;img.style.transform="scale(1.06)";
  setTimeout(()=>{img.style.backgroundImage=`var(${d.img})`;img.style.opacity=1;img.style.transform="scale(1)"},350);
  $("#fT").textContent=d.t;$("#fL").textContent="📍 "+d.l;$("#fP").textContent=d.p;$("#fPr").textContent=d.pr;
  $("#peekT").textContent=d.pk;$("#peekI").style.backgroundImage=`var(${d.img})`;
  $$("i",dots).forEach((x,i)=>x.classList.toggle("on",i===idx));
}
$("#prev").onclick=()=>slide(idx-1);$("#next").onclick=()=>slide(idx+1);
setInterval(()=>current==="/"&&slide(idx+1),7000);slide(0);

/* ---------- Listings + filters ---------- */
$("#listings").innerHTML=PROPS.map(p=>`<article class="prop reveal" data-c="${p.c}"><div class="frame"><div class="ph" style="background-image:var(${p.img})"></div></div><h3>${p.n}</h3><small>${p.l}</small><div class="row"><small>${p.m}</small><b>${p.p}</b></div></article>`).join("");
$$("#filters button").forEach(b=>b.onclick=()=>{$$("#filters button").forEach(x=>x.classList.remove("on"));b.classList.add("on");
  $$(".prop").forEach(p=>p.classList.toggle("hide",b.dataset.f!=="all"&&p.dataset.c!==b.dataset.f))});

/* ---------- Contact form ---------- */
$("#form").onsubmit=e=>{e.preventDefault();$("#ok").style.display="block";e.target.reset()};

go();