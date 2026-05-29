/**
 * iBrains Interactive Canvas Particle Mesh (Neural Net) Background
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let animationFrameId;

  // Configuration
  const config = {
    particleCount: 85,
    maxDistance: 130, // Max distance for connection lines
    mouseRadius: 160,  // Interactive distance around mouse
    particleColor: 'rgba(0, 180, 216, 0.4)', // Secondary theme color
    lineColor: 'rgba(0, 180, 216, 0.08)',
    activeLineColor: 'rgba(0, 245, 212, 0.25)', // Glow color when connecting to mouse
  };

  // Mouse State
  let mouse = {
    x: null,
    y: null,
    radius: config.mouseRadius
  };

  // Track Mouse Move
  const heroSection = canvas.parentElement;
  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Track Mouse Out
  heroSection.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Handle Resize
  const resizeCanvas = () => {
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;
    
    // Adjust density based on screen size
    if (canvas.width < 768) {
      config.particleCount = 35;
      config.maxDistance = 90;
    } else {
      config.particleCount = 85;
      config.maxDistance = 130;
    }
    
    initParticles();
  };

  // Particle Class
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 0.7; // Speed X
      this.vy = (Math.random() - 0.5) * 0.7; // Speed Y
      this.radius = Math.random() * 2.5 + 1.5; // Radius 1.5px to 4px
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = config.particleColor;
      ctx.fill();
    }

    update() {
      // Keep within boundaries
      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

      // Mouse interactive deflection (push away slightly)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const forceDirectionX = dx / dist;
          const forceDirectionY = dy / dist;
          
          this.x += forceDirectionX * force * 1.5;
          this.y += forceDirectionY * force * 1.5;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
      this.draw();
    }
  }

  // Populate particles array
  const initParticles = () => {
    particlesArray = [];
    for (let i = 0; i < config.particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesArray.push(new Particle(x, y));
    }
  };

  // Draw lines connecting particles
  const connectParticles = () => {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a + 1; b < particlesArray.length; b++) {
        const dx = particlesArray[a].x - particlesArray[b].x;
        const dy = particlesArray[a].y - particlesArray[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.maxDistance) {
          // Adjust opacity based on distance (closer = more opaque)
          const opacity = (1 - distance / config.maxDistance) * 0.15;
          ctx.strokeStyle = `rgba(0, 180, 216, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }

      // Draw connections to mouse cursor (dynamic tech nodes)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particlesArray[a].x - mouse.x;
        const dy = particlesArray[a].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const opacity = (1 - distance / mouse.radius) * 0.35;
          ctx.strokeStyle = `rgba(0, 245, 212, ${opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  };

  // Loop Animation
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw and update particles
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    
    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  };

  // Start the system
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
});
