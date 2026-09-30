/**
 * Neural Network Synaptic Animation Engine
 * Interactive, high-performance canvas simulation of interconnected neurons,
 * synaptic edges, and traveling action potential signals.
 * Fully optimized for both desktop pointers and mobile touchscreen interactions.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Settings tuned for high visibility and fluid performance
  const isMobile = window.innerWidth < 768;
  const NODE_COUNT = isMobile ? 36 : 60;
  const CONNECTION_DIST = isMobile ? 120 : 155;
  const MOUSE_DIST = isMobile ? 130 : 180;

  let nodes = [];
  let signals = [];
  let mouse = { x: -1000, y: -1000, active: false };
  let animationId = null;
  let isRunning = true;
  let touchTimer = null;

  function isLightMode() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  // Node Class
  class NeuralNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.6);
      this.vy = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.6);
      this.radius = Math.random() * 1.6 + 1.8; // Noticeable node size
      this.baseAlpha = Math.random() * 0.35 + 0.55;
      this.colorType = Math.random() > 0.4 ? 'cyan' : 'violet';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off screen boundaries gently
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interactive attraction/repulsion to pointer / touch
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (1 - dist / MOUSE_DIST) * 0.035;
          this.vx += dx * force;
          this.vy += dy * force;
        }
      }

      // Max velocity damping
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.4) {
        this.vx = (this.vx / speed) * 1.4;
        this.vy = (this.vy / speed) * 1.4;
      }
    }

    draw() {
      const isLight = isLightMode();
      const nodeColor = isLight
        ? (this.colorType === 'cyan' ? '#0284C7' : '#6366F1')
        : (this.colorType === 'cyan' ? '#38BDF8' : '#A78BFA');

      // Draw subtle glowing halo around node
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.globalAlpha = isLight ? 0.15 : 0.22;
      ctx.fill();

      // Draw solid node core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.globalAlpha = isLight ? 0.9 : this.baseAlpha;
      ctx.fill();
    }
  }

  // Action Potential / Synaptic Signal Pulse
  class SynapticSignal {
    constructor(startNode, endNode) {
      this.start = startNode;
      this.end = endNode;
      this.progress = 0;
      this.speed = Math.random() * 0.018 + 0.014; // Swift, dynamic travel
      this.isEmerald = Math.random() > 0.4;
      this.size = Math.random() * 1.2 + 2.4; // Clearly visible pulse bead
    }

    update() {
      this.progress += this.speed;
      return this.progress < 1;
    }

    draw() {
      const isLight = isLightMode();
      const currentX = this.start.x + (this.end.x - this.start.x) * this.progress;
      const currentY = this.start.y + (this.end.y - this.start.y) * this.progress;

      const signalColor = isLight
        ? (this.isEmerald ? '#059669' : '#0284C7')
        : (this.isEmerald ? '#34D399' : '#38BDF8');

      // Outer glow bead
      ctx.beginPath();
      ctx.arc(currentX, currentY, this.size * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = signalColor;
      ctx.globalAlpha = isLight ? 0.35 : 0.45;
      ctx.fill();

      // Core electric pulse
      ctx.beginPath();
      ctx.arc(currentX, currentY, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.95;
      ctx.fill();
    }
  }

  // Initialize Nodes
  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(new NeuralNode());
    }
  }

  // Spawns occasional synaptic signals between connected nodes
  function maybeSpawnSignal(nodeA, nodeB) {
    const maxSignals = isMobile ? 8 : 14;
    // Spawns frequently enough to always have lively visual feedback
    if (signals.length < maxSignals && Math.random() < 0.012) {
      signals.push(new SynapticSignal(nodeA, nodeB));
    }
  }

  // Render Loop
  function animate() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);
    const isLight = isLightMode();

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      // Connect neighboring nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * (isLight ? 0.38 : 0.32);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = isLight ? '#0284C7' : '#38BDF8';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          maybeSpawnSignal(nodes[i], nodes[j]);
        }
      }

      // Connect to mouse/touch if active
      if (mouse.active) {
        const dx = mouse.x - nodes[i].x;
        const dy = mouse.y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * (isLight ? 0.48 : 0.42);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = isLight ? '#6366F1' : '#A78BFA';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      }
    }

    // Update and draw synaptic signals
    signals = signals.filter(sig => {
      const active = sig.update();
      if (active) sig.draw();
      return active;
    });

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(animate);
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  });

  // Desktop Pointer
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Mobile Touch Interactions
  function handleTouch(e) {
    if (e.touches && e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
      if (touchTimer) clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        mouse.active = false;
      }, 1500);
    }
  }

  window.addEventListener('touchstart', handleTouch, { passive: true });
  window.addEventListener('touchmove', handleTouch, { passive: true });
  window.addEventListener('touchend', () => {
    if (touchTimer) clearTimeout(touchTimer);
    touchTimer = setTimeout(() => {
      mouse.active = false;
    }, 1200);
  }, { passive: true });

  // Tab Visibility (pause when tab hidden to conserve battery)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationId);
    } else {
      isRunning = true;
      animate();
    }
  });

  // Initialize
  initNodes();
  animate();
})();
