/**
 * Neural Network Synaptic Animation Engine
 * Interactive, high-performance canvas simulation of interconnected neurons,
 * synaptic edges, and traveling action potential signals.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Settings
  const isMobile = window.innerWidth < 768;
  const NODE_COUNT = isMobile ? 26 : 52;
  const CONNECTION_DIST = isMobile ? 100 : 140;
  const MOUSE_DIST = 160;

  let nodes = [];
  let signals = [];
  let mouse = { x: -1000, y: -1000, active: false };
  let animationId = null;
  let isRunning = true;

  // Node Class
  class NeuralNode {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 1.2;
      this.baseAlpha = Math.random() * 0.4 + 0.35;
      this.color = Math.random() > 0.3 ? '#38BDF8' : '#818CF8'; // Ice-blue or violet
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off screen boundaries gently
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Subtle mouse interaction
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const force = (1 - dist / MOUSE_DIST) * 0.02;
          this.vx += dx * force;
          this.vy += dy * force;
        }
      }

      // Max velocity damping
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.2) {
        this.vx = (this.vx / speed) * 1.2;
        this.vy = (this.vy / speed) * 1.2;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.fill();
    }
  }

  // Action Potential / Signal Pulse
  class SynapticSignal {
    constructor(startNode, endNode) {
      this.start = startNode;
      this.end = endNode;
      this.progress = 0;
      this.speed = Math.random() * 0.015 + 0.012;
      this.color = Math.random() > 0.5 ? '#38BDF8' : '#34D399';
      this.size = Math.random() * 1.2 + 1.8;
    }

    update() {
      this.progress += this.speed;
      return this.progress < 1;
    }

    draw() {
      const currentX = this.start.x + (this.end.x - this.start.x) * this.progress;
      const currentY = this.start.y + (this.end.y - this.start.y) * this.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.85;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
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
    if (signals.length < (isMobile ? 4 : 8) && Math.random() < 0.003) {
      signals.push(new SynapticSignal(nodeA, nodeB));
    }
  }

  // Render Loop
  function animate() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

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
          const alpha = (1 - dist / CONNECTION_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = '#38BDF8';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
          ctx.stroke();

          maybeSpawnSignal(nodes[i], nodes[j]);
        }
      }

      // Connect to mouse if close
      if (mouse.active) {
        const dx = mouse.x - nodes[i].x;
        const dy = mouse.y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.28;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = '#818CF8';
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1;
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

  // Event Listeners
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  window.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
      mouse.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.active = false;
  });

  // Pause when tab hidden to save CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationId);
    } else {
      isRunning = true;
      animate();
    }
  });

  // Start Simulation
  initNodes();
  animate();
})();
