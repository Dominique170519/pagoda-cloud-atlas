import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  opacity: number;
  delay: number;
}

export default function LandingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 400;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - 40;

    function pagodaShape(index: number): { x: number; y: number } {
      const total = PARTICLE_COUNT;
      const t = index / total;
      const levelCount = 9;
      const level = Math.floor(t * levelCount);
      const levelT = (t * levelCount) % 1;

      const baseY = cy + 160 - level * 38;
      const width = 18 + (levelCount - 1 - level) * 16;
      const x = cx + (levelT - 0.5) * width * 2;
      const y = baseY + Math.sin(levelT * Math.PI * 3) * 4;

      return { x, y };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 200 + Math.random() * 400;
      const shape = pagodaShape(i);

      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        targetX: shape.x,
        targetY: shape.y,
        originX: cx + Math.cos(angle) * radius,
        originY: cy + Math.sin(angle) * radius,
        size: 0.8 + Math.random() * 1.8,
        opacity: 0.15 + Math.random() * 0.5,
        delay: Math.random() * 1.5,
      });
    }

    function draw() {
      time += 0.016;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p) => {
        const t = Math.min(Math.max((time - p.delay) * 0.8, 0), 1);
        const ease = 1 - Math.pow(1 - t, 3);

        const currentX = p.originX + (p.targetX - p.originX) * ease;
        const currentY = p.originY + (p.targetY - p.originY) * ease;

        const floatX = Math.sin(time * 0.4 + p.delay * 10) * (1 - ease) * 8;
        const floatY = Math.cos(time * 0.6 + p.delay * 8) * (1 - ease) * 6;

        p.x = currentX + floatX;
        p.y = currentY + floatY;

        const alpha = p.opacity * (0.4 + ease * 0.6);

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * (1 - (1 - ease) * 0.5), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,168,78,${alpha})`;
        ctx!.fill();

        if (ease > 0.6) {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(201,168,78,${alpha * 0.06})`;
          ctx!.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
    />
  );
}
