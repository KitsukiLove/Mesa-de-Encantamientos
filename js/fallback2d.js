/* Respaldo 2D para dispositivos sin WebGL: escena pixel simple (mesa, libro, Kixki) con animación por pasos. */
(function () {
  'use strict';
  const SHEEP = [
    '....hhhh....', '...hhhhhh...', '..wwhhhhww..', '.wwwffffwww.', '.wwfefeefwww'.slice(0, 12), '.wwffffffww.', '.wwwwmmwwww.', '..wwwwwwww..', '..wwwwwwww..', '...l....l...'
  ];
  const PAL = { h: '#3b2480', w: '#fffaf0', f: '#f7b58a', e: '#2b1a5e', m: '#ff9fb8', l: '#e39a6e' };

  function create(canvas, opts) {
    const W = 192, H = 108, ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H; ctx.imageSmoothingEnabled = false;
    const api = {
      reduce: !!(opts && opts.reduce), running: false, t: 0, onFrame: null, state: 'intro', accent: '#b36bff', light: 1, mood: 0, sparks: [],
      setState(s) { this.state = s; }, setAccent(h) { this.accent = h; }, setShift(v, h) { this.vs = v || 0; this.hs = h || 0; }, setLight(v) { this.light = v; }, setPointer() { },
      burst(n) { for (let i = 0; i < (n || 12); i++) this.sparks.push({ x: 96 + (Math.random() - .5) * 20, y: 50, vx: (Math.random() - .5) * 3, vy: -Math.random() * 2.5 - .5, l: 14 }); },
      happy() { this.mood = 12; }, resize() { }, kixkiScreen() { const r = canvas.getBoundingClientRect(); return { x: r.left + r.width * (68 - (this.hs || 0) * W / 2) / W, y: r.top + r.height * (62 - (this.vs || 0) * H / 2) / H }; },
      start() { if (this.running) return; this.running = true; const step = () => { if (!this.running) return; this.draw(); if (this.onFrame) this.onFrame(); this.timer = setTimeout(step, this.reduce ? 400 : 120); }; step(); },
      stop() { this.running = false; clearTimeout(this.timer); },
      draw() {
        this.t++; const t = this.t, day = this.light > 1.5, c = ctx;
        const sky = day ? ['#bba6f0', '#a58de8', '#8f78de', '#7a62d0', '#6b52c4'] : ['#0c0620', '#150c33', '#1d1245', '#241552', '#2e1d73'];
        sky.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * 22, W, 22); });
        c.fillStyle = '#2a1a5e'; c.fillRect(0, 76, W, 32);
        c.save(); c.translate(Math.round(-(this.hs || 0) * W / 2), Math.round(-(this.vs || 0) * H / 2));
        c.fillStyle = day ? '#fff' : '#c9b8ff'; for (let i = 0; i < 22; i++) { const x = (i * 53) % W, y = (i * 29) % 60; if ((t + i) % 5) c.fillRect(x, y, 1, 1); }
        c.fillStyle = '#3a2a9a'; c.fillRect(80, 8, 32, 44); c.fillStyle = '#8a4ad8'; c.fillRect(82, 10, 14, 20); c.fillStyle = '#d86aa8'; c.fillRect(98, 10, 12, 20); c.fillStyle = '#4a3ac8'; c.fillRect(82, 32, 28, 18);
        c.fillStyle = '#5a3a22'; c.fillRect(20, 24, 44, 52); c.fillRect(128, 24, 44, 52);
        ['#6b3fe0', '#d84a8a', '#2aa88a', '#d89a30'].forEach((col, i) => { c.fillStyle = col; for (let r = 0; r < 4; r++) c.fillRect(23 + i * 10, 27 + r * 12, 6, 9); for (let r = 0; r < 4; r++) c.fillRect(131 + i * 10, 27 + r * 12, 6, 9); });
        c.fillStyle = '#2a1a5e'; c.fillRect(0, 76, W, 32); c.fillStyle = '#33207a'; c.fillRect(40, 84, 112, 20);
        c.fillStyle = '#150c33'; c.fillRect(76, 60, 40, 28); c.fillStyle = '#2a1a5e'; c.fillRect(72, 86, 48, 6);
        c.fillStyle = '#2e1d73'; c.fillRect(70, 54, 52, 8); c.fillStyle = '#6b3fe0'; c.fillRect(72, 52, 48, 4); c.fillStyle = '#ffd36e'; c.fillRect(70, 52, 4, 4); c.fillRect(118, 52, 4, 4);
        const bob = Math.round(Math.sin(t / 3) * 2); c.fillStyle = '#4a2ca0'; c.fillRect(74, 40 + bob, 44, 4); c.fillStyle = '#fff7e0'; c.fillRect(76, 34 + bob, 18, 8); c.fillRect(98, 34 + bob, 18, 8);
        c.fillStyle = '#7a6aa0'; for (let i = 0; i < 3; i++) { c.fillRect(78, 36 + bob + i * 2, 12, 1); c.fillRect(100, 36 + bob + i * 2, 12, 1); }
        const cols = ['#8fe8ff', this.accent, '#ffd36e', '#ff8fc7'];
        for (let i = 0; i < 4; i++) { const a = t / 6 + i * 1.57; c.fillStyle = cols[i]; c.fillRect(Math.round(96 + Math.cos(a) * 30), Math.round(44 + Math.sin(a) * 6 + bob), 3, 3); }
        const jump = this.mood > 0 ? -Math.abs(Math.round(Math.sin(t) * 5)) : 0; if (this.mood > 0) this.mood--;
        SHEEP.forEach((row, y) => [...row].forEach((ch, x) => { if (PAL[ch]) { c.fillStyle = PAL[ch]; c.fillRect(56 + x * 2, 66 + y * 2 + jump, 2, 2); } }));
        this.sparks = this.sparks.filter(s => { s.x += s.vx; s.y += s.vy; s.vy += 0.2; s.l--; c.fillStyle = this.accent; c.fillRect(Math.round(s.x), Math.round(s.y), 2, 2); return s.l > 0; });
        if (!this.reduce && t % 3 === 0) this.sparks.push({ x: 96 + (Math.random() - .5) * 50, y: 56, vx: 0, vy: -0.8, l: 10 });
        c.restore();
      }
    };
    return api;
  }
  window.MesaFallback = { create };
})();
