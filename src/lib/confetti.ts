export function fireConfetti(): void {
  const c = document.createElement('canvas');
  c.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:60;';
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  document.body.appendChild(c);
  const ctx = c.getContext('2d')!;
  const colors = ['#D4A14A','#0F1A2E','#E3C06A','#1F7A5A','#F6E9C9'];
  interface Particle { x:number; y:number; vx:number; vy:number; g:number; r:number; c:string; rot:number; vr:number; life:number; }
  const N = 140;
  const parts: Particle[] = Array.from({length:N}, () => ({
    x: c.width/2 + (Math.random()-0.5)*120,
    y: c.height/2 - 40,
    vx: (Math.random()-0.5)*12,
    vy: (Math.random()*-12)-4,
    g: 0.35 + Math.random()*0.2,
    r: 3 + Math.random()*4,
    c: colors[(Math.random()*colors.length)|0],
    rot: Math.random()*Math.PI,
    vr: (Math.random()-0.5)*0.3,
    life: 0,
  }));
  let start = performance.now();
  function frame(t: number) {
    const dt = t - start; start = t;
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life += dt;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - p.life/2500);
      ctx.fillRect(-p.r, -p.r*0.4, p.r*2, p.r*0.8); ctx.restore();
    });
    if (parts.some(p => p.life < 2500)) requestAnimationFrame(frame);
    else c.remove();
  }
  requestAnimationFrame(frame);
}
