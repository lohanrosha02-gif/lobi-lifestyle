/* Efeito decorativo isolado: não interfere nos controles da loja */
(() => {
 const hero=document.querySelector('.hero');
 if(!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const canvas=document.createElement('canvas');canvas.className='lobi-aurora-canvas';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let w=0,h=0,raf=0,visible=true;const pointer={x:-1000,y:-1000};let dots=[];
 function resize(){const r=hero.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);dots=Array.from({length:Math.min(75,Math.floor(w*h/14000))},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.7+.4,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,hue:Math.random()>.5?285:190}));}
 function draw(){if(!visible)return;ctx.clearRect(0,0,w,h);for(const p of dots){p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);if(dist<150&&dist>0){p.x+=dx/dist*1.1;p.y+=dy/dist*1.1}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='hsla('+p.hue+',100%,78%,.72)';ctx.fill()}raf=requestAnimationFrame(draw)}
 hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top},{passive:true});
 hero.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000},{passive:true});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){cancelAnimationFrame(raf);draw()}else cancelAnimationFrame(raf)});observer.observe(hero);
 window.addEventListener('resize',resize,{passive:true});resize();
})();
