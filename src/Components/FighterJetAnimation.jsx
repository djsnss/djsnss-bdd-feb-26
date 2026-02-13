import React, { useEffect, useRef } from 'react';

const FighterJetAnimation = () => {
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

    // Sonic boom shockwave
    class Shockwave {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.maxRadius = 150;
        this.opacity = 0.75;
        this.speed = 7;
      }

      update() {
        this.radius += this.speed;
        this.opacity -= 0.015;
      }

      draw(ctx) {
        if (this.opacity <= 0) return;

        // Add subtle glow effect
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 8;

        // Outer ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity * 0.45})`;
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Middle ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(230, 240, 255, ${this.opacity * 0.3})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner ring
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 220, 255, ${this.opacity * 0.2})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      isAlive() {
        return this.opacity > 0;
      }
    }

    // Contrail particle - TRICOLOR (Indian Flag: Saffron, White, Green)
    class ContrailParticle {
      constructor(x, y, size, colorIndex, jetAngle = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.opacity = 0.75;
        this.decay = 0.003 + Math.random() * 0.002;
        this.drift = (Math.random() - 0.5) * 0.2;
        this.rise = (Math.random() - 0.5) * 0.2;
        this.jetAngle = jetAngle;
        // Tricolor: 0 = Saffron, 1 = White, 2 = Green
        this.colorIndex = colorIndex;
        this.colors = [
          { r: 255, g: 153, b: 51 },   // Saffron
          { r: 255, g: 255, b: 255 },  // White
          { r: 19, g: 136, b: 8 }      // Green
        ];
        this.expansionRate = 0.5 + Math.random() * 0.3;
      }

      update() {
        this.x += this.drift;
        this.y += this.rise;
        this.size += this.expansionRate;
        this.opacity -= this.decay;
        this.expansionRate *= 0.995; // Slow down expansion over time
      }

      draw(ctx) {
        if (this.opacity <= 0) return;
        const color = this.colors[this.colorIndex];
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${this.opacity * 0.9})`);
        gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${this.opacity * 0.6})`);
        gradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      isAlive() {
        return this.opacity > 0;
      }
    }

    class FighterJet {
      constructor(fromRight, offsetIndex) {
        this.fromRight = fromRight;
        this.x = fromRight ? canvas.width + 200 : -200;
        this.y = canvas.height * 0.25 + offsetIndex * 80;
        this.baseSpeed = 12;
        this.speed = this.baseSpeed;
        this.scale = 1.2;
        this.contrailParticles = [];
        this.rotation = fromRight ? Math.PI + 0.15 : -0.15;
        this.bankAngle = 0;
        this.targetBank = (Math.random() - 0.5) * 0.1;
        this.time = Math.random() * 100;
        this.afterburnerIntensity = 0.8 + Math.random() * 0.2;
        this.lastShockwave = 0;
        this.colorCycle = 0; // For tricolor cycling
        this.leftScreen = false; // Track if jet has exited the screen
      }

      update(timestamp, shockwaves) {
        this.time += 0.05;

        // Smooth banking
        this.bankAngle += (this.targetBank - this.bankAngle) * 0.02;
        if (Math.random() < 0.005) {
          this.targetBank = (Math.random() - 0.5) * 0.15;
        }

        // Movement with slight oscillation
        const speedVar = Math.sin(this.time * 0.5) * 2;
        this.speed = this.baseSpeed + speedVar;

        if (this.fromRight) {
          this.x -= this.speed;
          this.y -= this.speed * 0.08 + Math.sin(this.time) * 0.5;
        } else {
          this.x += this.speed;
          this.y -= this.speed * 0.08 + Math.sin(this.time) * 0.5;
        }

        // Check if the jet has left the screen
        if (!this.leftScreen) {
          const offScreen = this.fromRight
            ? (this.x < -300 || this.y < -200)
            : (this.x > canvas.width + 300 || this.y < -200);
          if (offScreen) {
            this.leftScreen = true;
          }
        }

        // Generate tricolor contrail only if still on screen
        if (!this.leftScreen && Math.random() > 0.2) {
          const engineLocalX = -85;
          const engine1LocalY = -5;
          const engine2LocalY = 5;

          const cosR = Math.cos(this.rotation + this.bankAngle);
          const sinR = Math.sin(this.rotation + this.bankAngle);

          const eng1WorldX = this.x + (engineLocalX * cosR - engine1LocalY * sinR) * this.scale;
          const eng1WorldY = this.y + (engineLocalX * sinR + engine1LocalY * cosR) * this.scale;

          const eng2WorldX = this.x + (engineLocalX * cosR - engine2LocalY * sinR) * this.scale;
          const eng2WorldY = this.y + (engineLocalX * sinR + engine2LocalY * cosR) * this.scale;

          const colorIndex = Math.floor(this.colorCycle / 8) % 3;
          this.colorCycle++;

          this.contrailParticles.push(new ContrailParticle(
            eng1WorldX,
            eng1WorldY,
            6 + Math.random() * 4,
            colorIndex
          ));

          this.contrailParticles.push(new ContrailParticle(
            eng2WorldX,
            eng2WorldY,
            6 + Math.random() * 4,
            colorIndex
          ));
        }

        // Occasional shockwave - more frequent and visible
        if (timestamp - this.lastShockwave > 1500 && Math.random() < 0.025) {
          shockwaves.push(new Shockwave(this.x, this.y));
          this.lastShockwave = timestamp;
        }

        // Update contrail particles
        this.contrailParticles = this.contrailParticles.filter(p => p.isAlive());
        this.contrailParticles.forEach(p => p.update());

        // Flickering afterburner
        this.afterburnerIntensity = 0.7 + Math.sin(this.time * 3) * 0.15 + Math.random() * 0.15;
      }

      drawJet(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.rotate(this.bankAngle);
        ctx.scale(this.scale, this.scale);

        // === SUKHOI SU-30 INSPIRED SILHOUETTE ===

        // Shadow underneath
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 8, 60, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main fuselage
        ctx.fillStyle = '#1a1714';
        ctx.beginPath();
        ctx.moveTo(70, 0);
        ctx.bezierCurveTo(60, -4, 40, -6, 20, -7);
        ctx.lineTo(-50, -7);
        ctx.bezierCurveTo(-65, -6, -70, -4, -75, 0);
        ctx.bezierCurveTo(-70, 4, -65, 6, -50, 7);
        ctx.lineTo(20, 7);
        ctx.bezierCurveTo(40, 6, 60, 4, 70, 0);
        ctx.closePath();
        ctx.fill();

        // Nose cone detail
        ctx.fillStyle = '#252220';
        ctx.beginPath();
        ctx.moveTo(70, 0);
        ctx.bezierCurveTo(65, -2, 55, -3, 50, -3);
        ctx.lineTo(50, 3);
        ctx.bezierCurveTo(55, 3, 65, 2, 70, 0);
        ctx.closePath();
        ctx.fill();

        // Cockpit canopy
        ctx.fillStyle = 'rgba(70, 100, 130, 0.8)';
        ctx.beginPath();
        ctx.moveTo(45, -3);
        ctx.bezierCurveTo(40, -6, 25, -7, 15, -6);
        ctx.lineTo(15, -3);
        ctx.lineTo(45, -3);
        ctx.closePath();
        ctx.fill();

        // Canopy frame
        ctx.strokeStyle = '#0f0d0b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Left wing - delta style
        ctx.fillStyle = '#1a1714';
        ctx.beginPath();
        ctx.moveTo(15, -7);
        ctx.lineTo(-25, -55);
        ctx.lineTo(-45, -50);
        ctx.lineTo(-35, -7);
        ctx.closePath();
        ctx.fill();

        // Wing edge highlight
        ctx.strokeStyle = 'rgba(60, 55, 50, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(15, -7);
        ctx.lineTo(-25, -55);
        ctx.stroke();

        // Right wing
        ctx.fillStyle = '#1a1714';
        ctx.beginPath();
        ctx.moveTo(15, 7);
        ctx.lineTo(-25, 55);
        ctx.lineTo(-45, 50);
        ctx.lineTo(-35, 7);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(60, 55, 50, 0.5)';
        ctx.beginPath();
        ctx.moveTo(15, 7);
        ctx.lineTo(-25, 55);
        ctx.stroke();

        // Canards (front small wings)
        ctx.fillStyle = '#1a1714';
        ctx.beginPath();
        ctx.moveTo(35, -6);
        ctx.lineTo(20, -20);
        ctx.lineTo(10, -18);
        ctx.lineTo(25, -6);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(35, 6);
        ctx.lineTo(20, 20);
        ctx.lineTo(10, 18);
        ctx.lineTo(25, 6);
        ctx.closePath();
        ctx.fill();

        // Vertical stabilizers (twin tails)
        ctx.fillStyle = '#151311';
        ctx.beginPath();
        ctx.moveTo(-50, -10);
        ctx.lineTo(-60, -35);
        ctx.lineTo(-70, -30);
        ctx.lineTo(-65, -10);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-50, 10);
        ctx.lineTo(-60, 35);
        ctx.lineTo(-70, 30);
        ctx.lineTo(-65, 10);
        ctx.closePath();
        ctx.fill();

        // Horizontal stabilizers
        ctx.fillStyle = '#1a1714';
        ctx.beginPath();
        ctx.moveTo(-55, -6);
        ctx.lineTo(-70, -22);
        ctx.lineTo(-78, -18);
        ctx.lineTo(-68, -6);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-55, 6);
        ctx.lineTo(-70, 22);
        ctx.lineTo(-78, 18);
        ctx.lineTo(-68, 6);
        ctx.closePath();
        ctx.fill();

        // Engine nacelles
        ctx.fillStyle = '#0f0d0b';
        ctx.beginPath();
        ctx.ellipse(-72, -5, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(-72, 5, 10, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // AFTERBURNER EFFECTS
        const intensity = this.afterburnerIntensity;

        // Engine 1 afterburner
        this.drawAfterburner(ctx, -80, -5, intensity);
        // Engine 2 afterburner
        this.drawAfterburner(ctx, -80, 5, intensity);

        // Navigation lights
        ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
        ctx.beginPath();
        ctx.arc(-25, -52, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(50, 255, 50, 0.9)';
        ctx.beginPath();
        ctx.arc(-25, 52, 2, 0, Math.PI * 2);
        ctx.fill();

        // Anti-collision strobe
        if (Math.sin(this.time * 5) > 0.8) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(-60, 0, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      drawAfterburner(ctx, x, y, intensity) {
        // Outer glow
        const outerGlow = ctx.createRadialGradient(x - 20, y, 0, x - 20, y, 40);
        outerGlow.addColorStop(0, `rgba(255, 100, 20, ${intensity * 0.4})`);
        outerGlow.addColorStop(0.5, `rgba(255, 50, 0, ${intensity * 0.2})`);
        outerGlow.addColorStop(1, 'rgba(200, 30, 0, 0)');

        ctx.beginPath();
        ctx.ellipse(x - 20, y, 35, 12, 0, 0, Math.PI * 2);
        ctx.fillStyle = outerGlow;
        ctx.fill();

        // Core flame
        const coreFlame = ctx.createLinearGradient(x, y, x - 50, y);
        coreFlame.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
        coreFlame.addColorStop(0.1, `rgba(255, 255, 200, ${intensity * 0.9})`);
        coreFlame.addColorStop(0.3, `rgba(255, 200, 100, ${intensity * 0.7})`);
        coreFlame.addColorStop(0.6, `rgba(255, 100, 30, ${intensity * 0.4})`);
        coreFlame.addColorStop(1, 'rgba(255, 50, 0, 0)');

        ctx.beginPath();
        ctx.moveTo(x, y - 4);
        ctx.quadraticCurveTo(x - 25, y - 6, x - 45 - Math.random() * 10, y);
        ctx.quadraticCurveTo(x - 25, y + 6, x, y + 4);
        ctx.closePath();
        ctx.fillStyle = coreFlame;
        ctx.fill();

        // Inner white-hot core
        ctx.beginPath();
        ctx.ellipse(x - 5, y, 8, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.8})`;
        ctx.fill();

        // Shock diamonds (visible in afterburner)
        for (let i = 0; i < 3; i++) {
          const diamondX = x - 15 - i * 10;
          const diamondOpacity = intensity * (0.5 - i * 0.15);
          ctx.beginPath();
          ctx.moveTo(diamondX, y - 2);
          ctx.lineTo(diamondX - 4, y);
          ctx.lineTo(diamondX, y + 2);
          ctx.lineTo(diamondX + 4, y);
          ctx.closePath();
          ctx.fillStyle = `rgba(255, 220, 180, ${diamondOpacity})`;
          ctx.fill();
        }
      }

      draw(ctx) {
        // Draw contrail first (behind jet)
        this.contrailParticles.forEach(p => p.draw(ctx));

        // Draw the jet
        this.drawJet(ctx);
      }

      isAlive() {
        // Keep alive while smoke particles are still fading out
        if (this.leftScreen) {
          return this.contrailParticles.length > 0;
        }
        return true;
      }
    }

    let jets = [];
    let shockwaves = [];
    let lastSpawnTime = 0;
    let spawnFromRight = true;
    const spawnInterval = 10000;

    const spawnJetWave = (fromRight) => {
      // Single jet - more impactful
      const jet = new FighterJet(fromRight, 0);
      jets.push(jet);
    };

    setTimeout(() => {
      spawnJetWave(true);
      lastSpawnTime = performance.now();
    }, 2000);

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (lastSpawnTime > 0 && timestamp - lastSpawnTime > spawnInterval) {
        spawnFromRight = !spawnFromRight;
        spawnJetWave(spawnFromRight);
        lastSpawnTime = timestamp;
      }

      // Update and draw shockwaves
      shockwaves = shockwaves.filter(s => s.isAlive());
      shockwaves.forEach(s => {
        s.update();
        s.draw(ctx);
      });

      // Update and draw jets
      jets = jets.filter(jet => jet.isAlive());
      jets.forEach(jet => {
        jet.update(timestamp, shockwaves);
        jet.draw(ctx);
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
        zIndex: 4,
      }}
    />
  );
};

export default FighterJetAnimation;
