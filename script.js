(function(){
var rm=matchMedia("(prefers-reduced-motion:reduce)").matches;
var root=document.documentElement;
/* theme toggle */
try{var t=localStorage.getItem("theme");if(t)root.setAttribute("data-theme",t)}catch(e){}
document.getElementById("theme").onclick=function(){
  var dark=root.getAttribute("data-theme")?root.getAttribute("data-theme")==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
  var n=dark?"light":"dark";root.setAttribute("data-theme",n);try{localStorage.setItem("theme",n)}catch(e){}
};
/* marquee */
var items=["HTML","CSS","JavaScript","Java","Python","Machine Learning","Cyber Security","IoT","AWS","Amazon S3","CloudFront","Git","GitHub","MS Office"];
var tr=document.getElementById("track");
tr.innerHTML=items.concat(items).map(function(x){return "<span>"+x+"</span>"}).join("");
/* typewriter */
var roles=["BCA Student","Web Developer","Python and Java Learner","AWS and IoT Project Builder"],ri=0,ci=0,del=false,tw=document.getElementById("tw");
function tick(){
  var r=roles[ri];
  if(rm){tw.textContent=r;return}
  tw.textContent=r.slice(0,ci);
  if(!del&&ci===r.length){del=true;return setTimeout(tick,1500)}
  if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
  ci+=del?-1:1;setTimeout(tick,del?35:80);
}
tick();
/* scroll progress + active nav */
var bar=document.getElementById("bar");
addEventListener("scroll",function(){
  var h=root.scrollHeight-innerHeight;bar.style.width=(h>0?scrollY/h*100:0)+"%";
},{passive:true});
var links=[].slice.call(document.querySelectorAll("nav a"));
var so=new IntersectionObserver(function(es){es.forEach(function(e){
  if(e.isIntersecting)links.forEach(function(a){a.classList.toggle("on",a.getAttribute("href")==="#"+e.target.id)});
})},{rootMargin:"-45% 0px -50% 0px"});
document.querySelectorAll("section").forEach(function(s){so.observe(s)});
/* reveal + counters */
function count(el){
  var n=+el.dataset.n,s=performance.now();
  (function f(now){var p=Math.min((now-s)/1200,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(s);
}
var ro=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-n]").forEach(function(c){rm?c.textContent=c.dataset.n:count(c)});
  ro.unobserve(e.target);
})},{threshold:.12});
document.querySelectorAll(".rv").forEach(function(el,i){el.style.transitionDelay=(i%3)*80+"ms";ro.observe(el)});
/* card spotlight */
document.querySelectorAll(".card").forEach(function(c){
  c.addEventListener("pointermove",function(e){
    var r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty("--mx",x+"px");c.style.setProperty("--my",y+"px");if(!rm&&e.pointerType==="mouse"&&c.offsetWidth<700){c.style.transitionDelay="0ms";c.style.transform="perspective(900px) rotateX("+((.5-y/r.height)*6)+"deg) rotateY("+((x/r.width-.5)*8)+"deg) translateY(-3px)"}
  });
});
/* 3D: card reset, photo tilt, three.js orb */
document.querySelectorAll(".card").forEach(function(c){c.addEventListener("pointerleave",function(){c.style.transform=""})});
var stage=document.getElementById("stage"),inner=document.getElementById("inner"),hero=document.querySelector(".hero"),tx=0,ty=0;
hero.addEventListener("pointermove",function(e){
  var r=stage.getBoundingClientRect();
  tx=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(innerWidth/2)));
  ty=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/(innerHeight/2)));
  if(!rm)inner.style.transform="rotateY("+tx*18+"deg) rotateX("+(-ty*14)+"deg)";
});
hero.addEventListener("pointerleave",function(){tx=ty=0;inner.style.transform=""});
if(window.THREE){
  var rd=new THREE.WebGLRenderer({canvas:document.getElementById("orb"),alpha:true,antialias:true}),sc=new THREE.Scene(),cm=new THREE.PerspectiveCamera(45,1,.1,50);
  cm.position.z=6.4;
  var g=new THREE.Group();sc.add(g);
  var mat=new THREE.LineBasicMaterial({color:0x8dc0c9,transparent:true,opacity:.5}),pm=new THREE.PointsMaterial({color:0x8dc0c9,size:.07});
  var geo=new THREE.IcosahedronGeometry(2.3,1);
  var ico=new THREE.LineSegments(new THREE.EdgesGeometry(geo),mat),pts=new THREE.Points(geo,pm);
  g.add(ico);g.add(pts);
  var rings=[];
  [2.9,3.3].forEach(function(rad,i){
    var m=new THREE.Mesh(new THREE.TorusGeometry(rad,.01,8,140),new THREE.MeshBasicMaterial({color:0x8dc0c9,transparent:true,opacity:.4}));
    m.rotation.x=1.2+i*.5;m.rotation.y=i*.7;g.add(m);rings.push(m);
  });
  var rs=function(){var w=stage.clientWidth;rd.setPixelRatio(Math.min(devicePixelRatio||1,2));rd.setSize(w,w,false)};
  rs();addEventListener("resize",rs);
  var fr=0;
  (function loop(){
    fr++;
    if(fr%30===1){var c=getComputedStyle(root).getPropertyValue("--accent").trim();if(/^#[0-9a-f]{6}$/i.test(c)){mat.color.set(c);pm.color.set(c);rings.forEach(function(m){m.material.color.set(c)})}}
    if(!rm){ico.rotation.y+=.003;pts.rotation.y+=.003;ico.rotation.x+=.0012;pts.rotation.x+=.0012;rings[0].rotation.z+=.004;rings[1].rotation.z-=.003}
    g.rotation.y+=(tx*.8-g.rotation.y)*.05;g.rotation.x+=(ty*.6-g.rotation.x)*.05;
    rd.render(sc,cm);
    if(!rm)requestAnimationFrame(loop);
  })();
}
/* extras: mobile menu, cursor glow, back to top, magnetic buttons */
var nv=document.querySelector("nav"),mb=document.getElementById("menu");
mb.onclick=function(){var o=nv.classList.toggle("open");mb.setAttribute("aria-expanded",o);mb.textContent=o?"✕":"☰"};
nv.addEventListener("click",function(e){if(e.target.tagName==="A"){nv.classList.remove("open");mb.textContent="☰";mb.setAttribute("aria-expanded",false)}});
var gl=document.getElementById("glow");
if(rm)gl.style.display="none";else addEventListener("pointermove",function(e){gl.style.opacity=1;gl.style.transform="translate("+e.clientX+"px,"+e.clientY+"px)"},{passive:true});
var up=document.getElementById("up");
addEventListener("scroll",function(){up.classList.toggle("on",scrollY>700)},{passive:true});
up.onclick=function(){scrollTo({top:0,behavior:rm?"auto":"smooth"})};
document.querySelectorAll(".btn").forEach(function(b){
  b.addEventListener("pointermove",function(e){if(rm||e.pointerType!=="mouse")return;var r=b.getBoundingClientRect();b.style.transform="translate("+(e.clientX-r.left-r.width/2)*.15+"px,"+(e.clientY-r.top-r.height/2)*.25+"px)"});
  b.addEventListener("pointerleave",function(){b.style.transform=""});
});
/* copy email */
document.getElementById("copy").onclick=function(){
  var m="soumilseal9@gmail.com",to=document.getElementById("toast");
  function ok(){to.classList.add("show");setTimeout(function(){to.classList.remove("show")},1800)}
  try{navigator.clipboard.writeText(m).then(ok,function(){location.href="mailto:"+m})}catch(e){location.href="mailto:"+m}
};
/* network canvas */
var cv=document.getElementById("net"),cx=cv.getContext("2d"),W,H,P=[],mx=-999,my=-999,col="141,192,201";
function size(){
  var r=cv.parentNode.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);
  var n=Math.round(W*H/16000);P=[];
  for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3});
}
function color(){
  var c=getComputedStyle(root).getPropertyValue("--accent").trim(),m=/^#([0-9a-f]{6})$/i.exec(c);
  if(m)col=[1,3,5].map(function(i){return parseInt(m[1].substr(i-1,2),16)}).join(",");
}
function draw(){
  color();cx.clearRect(0,0,W,H);
  for(var i=0;i<P.length;i++){
    var a=P[i];a.x+=a.vx;a.y+=a.vy;
    if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
    var dx=a.x-mx,dy=a.y-my,dm=Math.sqrt(dx*dx+dy*dy);
    if(dm<110){a.x+=dx/dm*1.2;a.y+=dy/dm*1.2}
    cx.fillStyle="rgba("+col+",.55)";cx.beginPath();cx.arc(a.x,a.y,1.6,0,6.3);cx.fill();
    for(var j=i+1;j<P.length;j++){
      var b=P[j],x=a.x-b.x,y=a.y-b.y,d=Math.sqrt(x*x+y*y);
      if(d<130){cx.strokeStyle="rgba("+col+","+(.22*(1-d/130))+")";cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}
    }
  }
  if(!rm)requestAnimationFrame(draw);
}
size();draw();
addEventListener("resize",function(){size();if(rm)draw()});
cv.parentNode.addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
cv.parentNode.addEventListener("pointerleave",function(){mx=my=-999});
})();
