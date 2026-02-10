import React, { useEffect, useRef } from 'react';

const BulletAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gun positions - precise muzzle tip positions based on soldier silhouettes
    const gunPositions = [
      // Far left soldier (crouching) - gun tip pointing right
      { x: 0.11, y: 0.72, angleMin: -15, angleMax: 0, direction: 1 },
      // Second soldier from left - gun tip pointing right  
      { x: 0.34, y: 0.68, angleMin: -10, angleMax: 5, direction: 1 },
      // Center soldier - gun tip pointing left
      { x: 0.40, y: 0.70, angleMin: 175, angleMax: 190, direction: -1 },
      // Fourth soldier - gun tip pointing left
      { x: 0.54, y: 0.69, angleMin: 172, angleMax: 188, direction: -1 },
      // Far right soldier - gun tip pointing left
      { x: 0.83, y: 0.73, angleMin: 168, angleMax: 182, direction: -1 },
    ];

    // Tracer round class - realistic military tracer with enhanced visuals
    class Tracer {
      constructor(gunPos) {
        this.startX = gunPos.x * canvas.width;
        this.startY = gunPos.y * canvas.height;
        this.x = this.startX;
        this.y = this.startY;
        const randomAngle = gunPos.angleMin + Math.random() * (gunPos.angleMax - gunPos.angleMin);
        this.angle = randomAngle * (Math.PI / 180);
        this.speed = 35 + Math.random() * 15; // Faster bullets
        this.life = 1;
        this.decay = 0.008 + Math.random() * 0.005; // Slower decay for longer trails
        this.length = 35 + Math.random() * 20; // Longer tracer trail
        this.type = Math.random() > 0.3 ? 'tracer' : 'incendiary'; // Mix of tracer types
        this.wobble = 0;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
        this.wobble = Math.sin(performance.now() * 0.05) * 0.5;
      }

      draw(ctx) {
        if (this.life <= 0) return;

        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;

        // Outer glow effect for visibility
        ctx.save();
        ctx.shadowColor = this.type === 'tracer' ? '#ff6600' : '#ff3300';
        ctx.shadowBlur = 15;

        // Main tracer body - thicker, more visible
        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        
        if (this.type === 'tracer') {
          // Orange-yellow tracer (standard military)
          gradient.addColorStop(0, `rgba(255, 100, 0, 0)`);
          gradient.addColorStop(0.2, `rgba(255, 150, 50, ${this.life * 0.4})`);
          gradient.addColorStop(0.5, `rgba(255, 200, 100, ${this.life * 0.8})`);
          gradient.addColorStop(0.8, `rgba(255, 240, 180, ${this.life})`);
          gradient.addColorStop(1, `rgba(255, 255, 255, ${this.life})`);
        } else {
          // Red incendiary tracer
          gradient.addColorStop(0, `rgba(255, 0, 0, 0)`);
          gradient.addColorStop(0.3, `rgba(255, 80, 30, ${this.life * 0.5})`);
          gradient.addColorStop(0.6, `rgba(255, 150, 80, ${this.life * 0.8})`);
          gradient.addColorStop(1, `rgba(255, 255, 200, ${this.life})`);
        }

        // Draw thick main trail
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Inner bright core
        ctx.beginPath();
        ctx.moveTo(tailX + (this.x - tailX) * 0.5, tailY + (this.y - tailY) * 0.5);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.9})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();

        // Hot glowing tip with multiple layers
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        const tipGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 5);
        tipGlow.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
        tipGlow.addColorStop(0.4, `rgba(255, 255, 200, ${this.life * 0.8})`);
        tipGlow.addColorStop(1, `rgba(255, 150, 50, 0)`);
        ctx.fillStyle = tipGlow;
        ctx.fill();

        // Bright white center
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.life})`;
        ctx.fill();

        // Sparks trailing behind
        if (Math.random() > 0.7) {
          for (let i = 0; i < 2; i++) {
            const sparkDist = Math.random() * this.length * 0.6;
            const sparkX = this.x - Math.cos(this.angle) * sparkDist + (Math.random() - 0.5) * 4;
            const sparkY = this.y - Math.sin(this.angle) * sparkDist + (Math.random() - 0.5) * 4;
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, 1 + Math.random(), 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 100, ${this.life * Math.random() * 0.8})`;
            ctx.fill();
          }
        }
      }

      isAlive() {
        return this.life > 0 && 
               this.x > -50 && this.x < canvas.width + 50 &&
               this.y > -50 && this.y < canvas.height + 50;
      }
    }

    // Muzzle flash class - enhanced with realistic effects
    class MuzzleFlash {
      constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.life = 1;
        this.size = 18 + Math.random() * 12; // Bigger flash
        this.sparkCount = 5 + Math.floor(Math.random() * 5);
        this.sparks = [];
        // Generate sparks
        for (let i = 0; i < this.sparkCount; i++) {
          this.sparks.push({
            angle: angle + (Math.random() - 0.5) * 0.8,
            speed: 8 + Math.random() * 12,
            size: 1 + Math.random() * 2,
            life: 1
          });
        }
      }

      update() {
        this.life -= 0.12;
        this.sparks.forEach(spark => {
          spark.life -= 0.15;
        });
      }

      draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Main flash glow - brighter and larger
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * this.life);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.life})`);
        gradient.addColorStop(0.2, `rgba(255, 255, 200, ${this.life * 0.9})`);
        gradient.addColorStop(0.4, `rgba(255, 200, 100, ${this.life * 0.6})`);
        gradient.addColorStop(0.7, `rgba(255, 100, 50, ${this.life * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 50, 0, 0)`);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.size * this.life, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Flash spikes for star effect
        ctx.rotate(this.angle);
        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const spikeLen = this.size * 1.5 * this.life;
          ctx.lineTo(spikeLen, 0);
          ctx.strokeStyle = `rgba(255, 220, 150, ${this.life * 0.6})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        ctx.restore();

        // Draw sparks flying out
        this.sparks.forEach(spark => {
          if (spark.life <= 0) return;
          const dist = (1 - spark.life) * spark.speed * 3;
          const sx = this.x + Math.cos(spark.angle) * dist;
          const sy = this.y + Math.sin(spark.angle) * dist;
          ctx.beginPath();
          ctx.arc(sx, sy, spark.size * spark.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 200, 100, ${spark.life * 0.8})`;
          ctx.fill();
        });
      }

      isAlive() {
        return this.life > 0;
      }
    }

    // Dust/smoke particle
    class DustParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 1.5 - 0.5;
        this.life = 1;
        this.size = 3 + Math.random() * 5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.02; // Gravity
        this.life -= 0.02;
        this.size += 0.1;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 70, 60, ${this.life * 0.3})`;
        ctx.fill();
      }

      isAlive() {
        return this.life > 0;
      }
    }

    let tracers = [];
    let flashes = [];
    let dust = [];
    let lastFireTime = 0;
    const burstInterval = 80;

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fire bursts
      if (timestamp - lastFireTime > burstInterval) {
        // Random burst from 1-3 guns
        const numShots = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numShots; i++) {
          const gun = gunPositions[Math.floor(Math.random() * gunPositions.length)];
          const tracer = new Tracer(gun);
          tracers.push(tracer);
          flashes.push(new MuzzleFlash(tracer.startX, tracer.startY, tracer.angle));
          
          // Add dust near gun
          if (Math.random() > 0.7) {
            dust.push(new DustParticle(tracer.startX, tracer.startY + 10));
          }
        }
        lastFireTime = timestamp;
      }

      // Update and draw dust (behind everything)
      dust = dust.filter(d => d.isAlive());
      dust.forEach(d => {
        d.update();
        d.draw(ctx);
      });

      // Update and draw tracers
      tracers = tracers.filter(t => t.isAlive());
      tracers.forEach(t => {
        t.update();
        t.draw(ctx);
      });

      // Update and draw flashes
      flashes = flashes.filter(f => f.isAlive());
      flashes.forEach(f => {
        f.update();
        f.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
};

export default BulletAnimation;
