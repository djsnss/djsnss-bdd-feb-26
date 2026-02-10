import React, { useEffect, useRef } from 'react';

const BombAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Realistic fire/smoke particle with layered rendering
    class FireParticle {
      constructor(x, y, explosionSize) {
        this.x = x;
        this.y = y;
        this.originX = x;
        this.originY = y;
        const angle = Math.random() * Math.PI * 2;
        const power = Math.pow(Math.random(), 0.5) * explosionSize * 0.8;
        this.vx = Math.cos(angle) * power * 0.4;
        this.vy = Math.sin(angle) * power * 0.3 - Math.random() * 3;
        this.life = 1;
        this.maxLife = 1;
        this.decay = 0.008 + Math.random() * 0.008;
        this.size = 15 + Math.random() * 30;
        this.maxSize = this.size * 3.5;
        this.turbulence = Math.random() * Math.PI * 2;
        this.turbulenceSpeed = 0.05 + Math.random() * 0.05;
      }

      update() {
        this.turbulence += this.turbulenceSpeed;
        this.x += this.vx + Math.sin(this.turbulence) * 0.5;
        this.y += this.vy;
        this.vy -= 0.08; // Rise up
        this.vx *= 0.99;
        this.life -= this.decay;
        this.size += (this.maxSize - this.size) * 0.02;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        const progress = 1 - this.life;
        
        // Fire to smoke color transition
        let r, g, b, a;
        if (progress < 0.3) {
          // Bright hot core
          r = 255;
          g = 255 - progress * 300;
          b = 200 - progress * 600;
          a = this.life * 0.9;
        } else if (progress < 0.6) {
          // Orange/red fire
          r = 255;
          g = 150 - (progress - 0.3) * 300;
          b = 30;
          a = this.life * 0.7;
        } else {
          // Dark smoke
          const smokeProgress = (progress - 0.6) / 0.4;
          r = 80 - smokeProgress * 50;
          g = 60 - smokeProgress * 40;
          b = 50 - smokeProgress * 30;
          a = this.life * 0.5;
        }

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${a})`);
        gradient.addColorStop(0.4, `rgba(${r * 0.7}, ${g * 0.6}, ${b * 0.5}, ${a * 0.6})`);
        gradient.addColorStop(1, `rgba(${r * 0.3}, ${g * 0.2}, ${b * 0.1}, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      isAlive() { return this.life > 0; }
    }

    // Hot ember/spark with physics
    class Ember {
      constructor(x, y, intensity) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 15 * intensity;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - Math.random() * 8;
        this.life = 0.6 + Math.random() * 0.4;
        this.size = 1 + Math.random() * 2.5;
        this.gravity = 0.15 + Math.random() * 0.1;
        this.trail = [];
        this.maxTrail = 8;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, life: this.life });
        if (this.trail.length > this.maxTrail) this.trail.shift();
        
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.98;
        this.life -= 0.015;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
          const t = this.trail[i];
          const trailLife = (i / this.trail.length) * this.life;
          ctx.beginPath();
          ctx.arc(t.x, t.y, this.size * (i / this.trail.length) * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, ${150 + i * 10}, 50, ${trailLife * 0.4})`;
          ctx.fill();
        }
        
        // Main ember
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 220, ${this.life})`);
        gradient.addColorStop(0.3, `rgba(255, 200, 100, ${this.life * 0.8})`);
        gradient.addColorStop(1, `rgba(255, 100, 20, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      isAlive() { return this.life > 0; }
    }

    // Debris with realistic physics
    class Debris {
      constructor(x, y, intensity) {
        this.x = x;
        this.y = y;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
        const speed = 8 + Math.random() * 12 * intensity;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.4;
        this.size = 3 + Math.random() * 6;
        this.life = 1;
        this.gravity = 0.25;
        this.type = Math.floor(Math.random() * 3); // Different debris shapes
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.995;
        this.rotation += this.rotSpeed;
        this.rotSpeed *= 0.99;
        
        // Fade when falling
        if (this.vy > 5) {
          this.life -= 0.02;
        }
      }

      draw(ctx) {
        if (this.life <= 0) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const alpha = this.life * 0.9;
        ctx.fillStyle = `rgba(40, 35, 30, ${alpha})`;
        ctx.strokeStyle = `rgba(60, 50, 40, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        
        if (this.type === 0) {
          // Jagged rock
          ctx.beginPath();
          ctx.moveTo(-this.size, 0);
          ctx.lineTo(-this.size * 0.5, -this.size * 0.8);
          ctx.lineTo(this.size * 0.3, -this.size * 0.6);
          ctx.lineTo(this.size, this.size * 0.2);
          ctx.lineTo(this.size * 0.4, this.size * 0.8);
          ctx.lineTo(-this.size * 0.6, this.size * 0.5);
          ctx.closePath();
        } else if (this.type === 1) {
          // Metal shard
          ctx.beginPath();
          ctx.moveTo(-this.size * 0.3, -this.size);
          ctx.lineTo(this.size * 0.3, -this.size * 0.8);
          ctx.lineTo(this.size * 0.2, this.size);
          ctx.lineTo(-this.size * 0.2, this.size * 0.9);
          ctx.closePath();
        } else {
          // Chunk
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.7, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      isAlive() { return this.life > 0 && this.y < canvas.height + 50; }
    }

    // Ground impact shockwave
    class Shockwave {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 4;
        this.maxRadius = 130;
        this.life = 1;
        this.ringWidth = 6;
      }

      update() {
        const progress = 1 - this.life;
        this.radius = 4 + progress * this.maxRadius;
        this.life -= 0.03;
        this.ringWidth = 6 * this.life;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        
        // Outer pressure wave
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 220, 180, ${this.life * 0.4})`;
        ctx.lineWidth = this.ringWidth;
        ctx.stroke();
        
        // Inner hot ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 150, 50, ${this.life * 0.3})`;
        ctx.lineWidth = this.ringWidth * 0.5;
        ctx.stroke();
        
        // Distortion effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.15})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      isAlive() { return this.life > 0; }
    }

    // Ground crater scorch mark
    class CraterMark {
      constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.life = 1;
        this.decay = 0.003;
      }

      update() {
        this.life -= this.decay;
      }

      draw(ctx) {
        if (this.life <= 0) return;
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(20, 15, 10, ${this.life * 0.6})`);
        gradient.addColorStop(0.3, `rgba(40, 30, 20, ${this.life * 0.4})`);
        gradient.addColorStop(0.6, `rgba(30, 25, 20, ${this.life * 0.2})`);
        gradient.addColorStop(1, `rgba(20, 15, 10, 0)`);
        
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      isAlive() { return this.life > 0; }
    }

    // Main explosion controller
    class Explosion {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.fireParticles = [];
        this.embers = [];
        this.debris = [];
        this.shockwaves = [];
        this.craters = [];
        this.flashLife = 1;
        this.flashSize = 90;
        this.secondaryExplosions = [];
        this.time = 0;
        
        this.createInitialExplosion();
      }

      createInitialExplosion() {
        // Main shockwave
        this.shockwaves.push(new Shockwave(this.x, this.y));
        
        // Crater mark
        this.craters.push(new CraterMark(this.x, this.y, 60));
        
        // Fire/smoke cloud
        for (let i = 0; i < 40; i++) {
          this.fireParticles.push(new FireParticle(this.x, this.y, 0.8));
        }
        
        // Embers
        for (let i = 0; i < 45; i++) {
          this.embers.push(new Ember(this.x, this.y, 0.85));
        }
        
        // Debris
        for (let i = 0; i < 18; i++) {
          this.debris.push(new Debris(this.x, this.y, 0.85));
        }
        
        // Schedule secondary explosions
        this.secondaryExplosions = [
          { time: 8, x: this.x + (Math.random() - 0.5) * 45, y: this.y + (Math.random() - 0.5) * 22, intensity: 0.5 },
          { time: 15, x: this.x + (Math.random() - 0.5) * 60, y: this.y + (Math.random() - 0.5) * 30, intensity: 0.35 },
          { time: 25, x: this.x + (Math.random() - 0.5) * 75, y: this.y + (Math.random() - 0.5) * 22, intensity: 0.25 },
        ];
      }

      update() {
        this.time++;
        this.flashLife -= 0.08;
        
        // Trigger secondary explosions
        this.secondaryExplosions = this.secondaryExplosions.filter(se => {
          if (this.time >= se.time) {
            for (let i = 0; i < 20 * se.intensity; i++) {
              this.fireParticles.push(new FireParticle(se.x, se.y, se.intensity));
            }
            for (let i = 0; i < 25 * se.intensity; i++) {
              this.embers.push(new Ember(se.x, se.y, se.intensity));
            }
            this.shockwaves.push(new Shockwave(se.x, se.y));
            return false;
          }
          return true;
        });
        
        // Update all particles
        this.fireParticles.forEach(p => p.update());
        this.fireParticles = this.fireParticles.filter(p => p.isAlive());
        
        this.embers.forEach(e => e.update());
        this.embers = this.embers.filter(e => e.isAlive());
        
        this.debris.forEach(d => d.update());
        this.debris = this.debris.filter(d => d.isAlive());
        
        this.shockwaves.forEach(s => s.update());
        this.shockwaves = this.shockwaves.filter(s => s.isAlive());
        
        this.craters.forEach(c => c.update());
        this.craters = this.craters.filter(c => c.isAlive());
      }

      draw(ctx) {
        // Crater marks (bottom layer)
        this.craters.forEach(c => c.draw(ctx));
        
        // Shockwaves
        this.shockwaves.forEach(s => s.draw(ctx));
        
        // Initial flash
        if (this.flashLife > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.flashSize * (1 + (1 - this.flashLife) * 0.5));
          gradient.addColorStop(0, `rgba(255, 255, 255, ${this.flashLife})`);
          gradient.addColorStop(0.2, `rgba(255, 250, 220, ${this.flashLife * 0.9})`);
          gradient.addColorStop(0.5, `rgba(255, 200, 100, ${this.flashLife * 0.5})`);
          gradient.addColorStop(1, `rgba(255, 100, 20, 0)`);
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.flashSize * (1 + (1 - this.flashLife) * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.restore();
        }
        
        // Debris
        this.debris.forEach(d => d.draw(ctx));
        
        // Fire particles (sorted by size for depth)
        const sortedFire = [...this.fireParticles].sort((a, b) => b.size - a.size);
        sortedFire.forEach(p => p.draw(ctx));
        
        // Embers on top
        this.embers.forEach(e => e.draw(ctx));
      }

      isAlive() {
        return this.fireParticles.length > 0 || 
               this.embers.length > 0 || 
               this.debris.length > 0 || 
               this.flashLife > 0 ||
               this.shockwaves.length > 0 ||
               this.secondaryExplosions.length > 0;
      }
    }

    // Realistic bomb with proper aerodynamics
    class Bomb {
      constructor() {
        // Drop from top, slightly random position
        this.x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
        this.y = -80;
        this.targetY = canvas.height * 0.75 + Math.random() * (canvas.height * 0.15);
        
        // Initial velocity with forward momentum
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = 8 + Math.random() * 4;
        
        // Bomb orientation - nose down as it falls
        this.angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.3;
        this.angularVel = 0;
        
        this.scale = 0.7;
        this.exploded = false;
        this.time = 0;
        this.windTrail = [];
      }

      update() {
        if (this.exploded) return false;
        
        this.time++;
        
        // Gravity
        this.vy += 0.35;
        
        // Air resistance
        this.vx *= 0.998;
        this.vy *= 0.999;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Orient bomb toward velocity (nose-first falling)
        const targetAngle = Math.atan2(this.vy, this.vx);
        const angleDiff = targetAngle - this.angle;
        this.angularVel += angleDiff * 0.02;
        this.angularVel *= 0.9;
        this.angle += this.angularVel;
        
        // Wind trail effect
        if (this.time % 2 === 0) {
          this.windTrail.push({ x: this.x, y: this.y, life: 1 });
        }
        this.windTrail = this.windTrail.filter(t => {
          t.life -= 0.05;
          return t.life > 0;
        });
        
        // Check impact
        if (this.y >= this.targetY) {
          this.exploded = true;
          return true;
        }
        return false;
      }

      draw(ctx) {
        if (this.exploded) return;

        // Wind trail
        ctx.save();
        this.windTrail.forEach((t, i) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2 * t.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 90, 80, ${t.life * 0.3})`;
          ctx.fill();
        });
        ctx.restore();

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.scale, this.scale);

        // === MK-82 STYLE BOMB ===
        
        // Main body shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(3, 3, 16, 50, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main cylindrical body
        const bodyGradient = ctx.createLinearGradient(-16, 0, 16, 0);
        bodyGradient.addColorStop(0, '#2a2825');
        bodyGradient.addColorStop(0.3, '#454035');
        bodyGradient.addColorStop(0.5, '#3a3530');
        bodyGradient.addColorStop(0.7, '#2d2a25');
        bodyGradient.addColorStop(1, '#1a1815');
        
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nose cone (ogive shape)
        ctx.beginPath();
        ctx.moveTo(-12, -42);
        ctx.quadraticCurveTo(-8, -60, 0, -72);
        ctx.quadraticCurveTo(8, -60, 12, -42);
        ctx.closePath();
        const noseGradient = ctx.createLinearGradient(-12, -55, 12, -55);
        noseGradient.addColorStop(0, '#353025');
        noseGradient.addColorStop(0.4, '#4a453a');
        noseGradient.addColorStop(0.6, '#3a352a');
        noseGradient.addColorStop(1, '#252015');
        ctx.fillStyle = noseGradient;
        ctx.fill();

        // Tail section (conical)
        ctx.beginPath();
        ctx.moveTo(-15, 40);
        ctx.lineTo(-12, 55);
        ctx.lineTo(12, 55);
        ctx.lineTo(15, 40);
        ctx.closePath();
        ctx.fillStyle = '#252220';
        ctx.fill();

        // Tail fins (4 fins at 90 degrees)
        ctx.fillStyle = '#353025';
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate(i * Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(-2, 45);
          ctx.lineTo(-3, 65);
          ctx.lineTo(-20, 75);
          ctx.lineTo(-18, 68);
          ctx.lineTo(-3, 58);
          ctx.lineTo(-2, 45);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Yellow identification bands (military marking)
        ctx.fillStyle = '#c4a020';
        ctx.beginPath();
        ctx.ellipse(0, -20, 16, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#c4a020';
        ctx.beginPath();
        ctx.ellipse(0, 10, 16, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fuze at nose
        ctx.fillStyle = '#606055';
        ctx.beginPath();
        ctx.ellipse(0, -70, 4, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body rivet lines
        ctx.strokeStyle = 'rgba(80, 75, 65, 0.5)';
        ctx.lineWidth = 1;
        for (let y = -30; y <= 30; y += 15) {
          ctx.beginPath();
          ctx.ellipse(0, y, 15, 3, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Specular highlight
        ctx.strokeStyle = 'rgba(120, 110, 100, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, -35);
        ctx.lineTo(-10, 25);
        ctx.stroke();

        ctx.restore();
      }

      isAlive() {
        return !this.exploded;
      }
    }

    let bombs = [];
    let explosions = [];
    let lastBombTime = 0;
    const bombInterval = 12000;
    let initialDelay = 4000;

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn bombs
      if (timestamp > initialDelay && timestamp - lastBombTime > bombInterval) {
        bombs.push(new Bomb());
        lastBombTime = timestamp;
      }

      // Update and draw bombs
      bombs = bombs.filter(bomb => {
        const shouldExplode = bomb.update();
        if (shouldExplode) {
          explosions.push(new Explosion(bomb.x, bomb.targetY));
          return false;
        }
        bomb.draw(ctx);
        return bomb.isAlive();
      });

      // Update and draw explosions
      explosions = explosions.filter(exp => exp.isAlive());
      explosions.forEach(exp => {
        exp.update();
        exp.draw(ctx);
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
        zIndex: 6,
      }}
    />
  );
};

export default BombAnimation;
