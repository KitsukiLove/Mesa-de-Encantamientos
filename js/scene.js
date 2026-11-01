/* Escena 3D: mesa de encantamientos, libro, cristales, runas, Kixki y sala. */
(function () {
  'use strict';
  const { Engine, mat } = window.MesaEngine;
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const lerp = (a, b, t) => a + (b - a) * t;
  const mixv = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  const STATES = {
    intro:  { eye: [0, 7.6, 13.5], ctr: [0, 1.9, 0], fov: 50, open: 1.45, bookY: 2.35, spin: 0, energy: 0.15 },
    quiz:   { eye: [0, 5.9, 8.9], ctr: [0, 1.75, 0], fov: 46, open: 0.2, bookY: 2.55, spin: 0, energy: 0.3 },
    ritual: { eye: [0, 4.9, 7.2], ctr: [0, 2.5, 0], fov: 46, open: 0.12, bookY: 3.2, spin: 1, energy: 1 },
    result: { eye: [0, 5.7, 9.8], ctr: [0, 2.3, 0], fov: 46, open: 0.2, bookY: 3.1, spin: 0, energy: 0.6 }
  };

  class MesaScene {
    constructor(canvas, opts) {
      opts = opts || {};
      this.eng = new Engine(canvas);
      this.canvas = canvas;
      this.reduce = !!opts.reduce;
      this.t = 0; this.stateName = 'intro';
      const s = STATES.intro;
      this.cam = { eye: s.eye.slice(), ctr: s.ctr.slice(), fov: s.fov };
      this.book = { open: 1.45, y: 2.35, spinV: 0, spin: 0, energy: 0.15 };
      this.accent = hex('#b36bff'); this.accentT = this.accent.slice();
      this.pointer = { x: 0, y: 0, sx: 0, sy: 0 };
      this.shift = 0.2; this.shiftT = 0.2; this.hshift = 0; this.hshiftT = 0; this.pf = null; this.kf = null;
      this.happyT = 0; this.blinkT = 2; this.blinking = 0; this.flap = 0;
      this.parts = []; this.rand = rng(7);
      this.px = 4; this.slowFrames = 0; this.last = 0; this.running = false;
      this.minDt = opts.fps30 ? 1 / 30 : 1 / 58;
      this.light = 1;
      this.buildStatic();
      for (let i = 0; i < 26; i++) this.spawnMote(true);
    }

    /* ---------- lote estático ---------- */
    buildStatic() {
      const B = [], R = rng(11);
      const sb = (cx, cy, cz, sx, sy, sz, col, o) => { o = o || {}; B.push({ c: [cx, cy, cz], s: [sx, sy, sz], col: hex(col), emi: o.emi, noise: o.noise, grid: o.grid }); };
      // suelo y alfombra
      sb(0, -0.25, 0, 60, 0.5, 60, '#2a1a5e', { grid: 1, noise: 0.5 });
      sb(0, 0.02, 0, 6.8, 0.04, 6.8, '#b88a2a', { noise: 0.4 });
      sb(0, 0.05, 0, 6.3, 0.04, 6.3, '#33207a', { noise: 0.7 });
      sb(0, 0.08, 0, 4.9, 0.03, 4.9, '#43299a', { noise: 0.7 });
      // círculo de runas en el suelo
      for (let i = 0; i < 16; i++) {
        const a = i / 16 * Math.PI * 2, x = Math.cos(a) * 2.6, z = Math.sin(a) * 2.6;
        sb(x, 0.12, z, i % 2 ? 0.22 : 0.34, 0.03, i % 2 ? 0.22 : 0.34, i % 2 ? '#ffd36e' : '#7ef0c4', { emi: i % 2 ? [0.5, 0.4, 0.1] : [0.15, 0.4, 0.3], noise: 0 });
      }
      // pared del fondo, ventanal
      sb(0, 5.5, -8, 44, 14, 1, '#1d1245', { noise: 0.8 });
      sb(0, 1.2, -7.45, 44, 2.4, 0.1, '#150c33');
      sb(0, 5.4, -7.35, 4.6, 6.8, 0.2, '#0c0620');
      sb(0, 5.4, -7.2, 4.0, 6.2, 0.1, '#241a70', { emi: [0.12, 0.1, 0.32], noise: 0 });
      const pane = ['#4a3ac8', '#8a4ad8', '#3a7ad0', '#d86aa8', '#e8b050', '#5ad0c0'];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
        const col = pane[Math.floor(R() * pane.length)], e = hex(col).map(v => v * 0.34);
        sb((c - 1) * 1.28, 3.2 + r * 1.18, -7.12, 1.08, 1.0, 0.06, col, { emi: e, noise: 0 });
      }
      sb(0, 5.4, -7.05, 0.14, 6.2, 0.08, '#0c0620'); sb(-0.64, 5.4, -7.05, 0.1, 6.2, 0.08, '#0c0620'); sb(0.64, 5.4, -7.05, 0.1, 6.2, 0.08, '#0c0620');
      sb(0, 8.55, -7.2, 4.0, 0.5, 0.2, '#0c0620');
      // pilares
      [-9.5, -6.8, 6.8, 9.5].forEach(x => {
        sb(x, 4, -6.6, 1.1, 8, 1.1, '#241552', { noise: 1 });
        sb(x, 0.25, -6.6, 1.5, 0.5, 1.5, '#33207a'); sb(x, 7.9, -6.6, 1.5, 0.4, 1.5, '#33207a');
        sb(x, 0.55, -6.6, 1.2, 0.1, 1.2, '#ffd36e', { emi: [0.2, 0.15, 0.03] });
      });
      // estantes con libros
      const bookCols = ['#6b3fe0', '#d84a8a', '#2aa88a', '#d89a30', '#3a6ad0', '#f1e6c8', '#9a4ad8', '#c04a4a'];
      [-4.2, 4.2].forEach(sx => {
        sb(sx, 2.2, -7.1, 3.6, 4.5, 0.1, '#150c33');
        sb(sx - 1.8, 2.2, -6.75, 0.16, 4.5, 0.8, '#5a3a22', { noise: 1.3 }); sb(sx + 1.8, 2.2, -6.75, 0.16, 4.5, 0.8, '#5a3a22', { noise: 1.3 });
        [0.08, 1.2, 2.32, 3.44, 4.5].forEach((y, k) => {
          sb(sx, y, -6.75, 3.76, 0.14, 0.8, '#5a3a22', { noise: 1.3 });
          if (k === 4) return;
          let x = sx - 1.65;
          while (x < sx + 1.6) {
            const w = 0.13 + R() * 0.14, h = 0.65 + R() * 0.3;
            if (R() < 0.1) { x += w; continue; }
            sb(x + w / 2, y + 0.07 + h / 2, -6.7, w * 0.92, h, 0.55, bookCols[Math.floor(R() * bookCols.length)], { noise: 0.8 });
            x += w;
          }
        });
      });
      // braseros
      [-4.2, 4.2].forEach(x => {
        sb(x, 0.95, -2.6, 0.26, 1.9, 0.26, '#3b2a1a', { noise: 1 });
        sb(x, 2.0, -2.6, 0.7, 0.22, 0.7, '#2a2a3a'); sb(x, 2.16, -2.6, 0.54, 0.12, 0.54, '#1a1a26');
        sb(x, 0.1, -2.6, 0.6, 0.2, 0.6, '#2a2a3a');
      });
      // mesa
      sb(0, 0.15, 0, 3.1, 0.3, 3.1, '#2a1a5e', { noise: 1 });
      sb(0, 0.95, 0, 2.3, 1.3, 2.3, '#150c33', { noise: 1.3 });
      sb(0, 0.55, 1.16, 1.5, 0.12, 0.04, '#ffd36e', { emi: [0.35, 0.28, 0.05], noise: 0 });
      sb(0, 1.25, 1.16, 1.5, 0.12, 0.04, '#ffd36e', { emi: [0.35, 0.28, 0.05], noise: 0 });
      for (let i = -2; i <= 2; i++) sb(i * 0.3, 0.9, 1.16, 0.12, 0.2, 0.04, '#b36bff', { emi: [0.35, 0.18, 0.55], noise: 0 });
      sb(0, 1.68, 0, 2.8, 0.3, 2.8, '#2e1d73', { noise: 1 });
      sb(0, 1.84, 0, 2.4, 0.06, 2.4, '#6b3fe0', { emi: [0.1, 0.05, 0.25], noise: 0.6 });
      [[0, 1.25], [0, -1.25], [1.25, 0], [-1.25, 0]].forEach(([x, z]) => sb(x, 1.9, z, x ? 0.1 : 2.5, 0.06, z ? 0.1 : 2.5, '#ffd36e', { emi: [0.3, 0.24, 0.04], noise: 0 }));
      [[1.3, 1.3], [-1.3, 1.3], [1.3, -1.3], [-1.3, -1.3]].forEach(([x, z]) => sb(x, 1.95, z, 0.24, 0.2, 0.24, '#ffd36e', { emi: [0.45, 0.35, 0.05], noise: 0.3 }));
      sb(0, 1.9, 0, 1.0, 0.04, 1.0, '#8a5af0', { emi: [0.2, 0.1, 0.4], noise: 0 });
      this.eng.setStatic(B);
    }

    /* ---------- partículas ---------- */
    spawnMote(init) {
      const r = this.rand;
      this.parts.push({ type: 'mote', x: (r() - 0.5) * 12, y: 0.5 + r() * 5, z: (r() - 0.5) * 8 - 1, vx: (r() - 0.5) * 0.12, vy: 0.04 + r() * 0.08, vz: (r() - 0.5) * 0.1, glyph: 7, size: 1.8, seed: r(), life: init ? r() * 10 : 0, max: 8 + r() * 6 });
    }
    spawnRune() {
      const r = this.rand;
      this.parts.push({ type: 'orbit', t: 0, ang: r() * 6.283, r0: 1.7 + r() * 0.6, y0: 1.95 + r() * 0.2, sp: 0.35 + r() * 0.35, glyph: Math.floor(r() * 7), size: 2.8 + r() * 1.8, seed: r(), dir: r() < 0.5 ? 1 : -1 });
    }
    burst(n) {
      const r = this.rand, y = this.book.y + 0.2;
      for (let i = 0; i < (n || 26); i++) {
        const a = r() * 6.283, e = (r() - 0.2) * 1.6, s = 1.2 + r() * 2.4;
        this.parts.push({ type: 'burst', x: Math.cos(a) * 0.3, y, z: Math.sin(a) * 0.3, vx: Math.cos(a) * s * 0.7, vy: 1 + e * 1.4, vz: Math.sin(a) * s * 0.7, life: 0, max: 0.8 + r() * 0.7, glyph: Math.floor(r() * 8), size: 3 + r() * 3, seed: r() });
      }
    }
    stepParts(dt) {
      const e = this.book.energy, out = [], by = this.book.y;
      if (!this.reduce || e > 0.5) {
        this.runeAcc = (this.runeAcc || 0) + dt * (3 + e * 10) * (this.reduce ? 0.3 : 1);
        while (this.runeAcc > 1) { this.runeAcc -= 1; if (this.parts.length < 330) this.spawnRune(); }
      }
      this.parts = this.parts.filter(p => {
        const out1 = { x: 0, y: 0, z: 0, size: p.size, glyph: p.glyph, alpha: 1, seed: p.seed };
        if (p.type === 'orbit') {
          p.t += dt * p.sp * (0.8 + e * 1.6); p.ang += dt * p.dir * (1.0 + e * 2.2);
          if (p.t >= 1) return false;
          const k = Math.pow(p.t, 0.85), r = lerp(p.r0, 0.5, k);
          out1.x = Math.cos(p.ang) * r; out1.z = Math.sin(p.ang) * r;
          out1.y = lerp(p.y0, by + 0.25, k) + Math.sin(p.ang * 2) * 0.06;
          out1.alpha = Math.sin(Math.PI * p.t) * (0.4 + e * 0.2);
        } else if (p.type === 'burst') {
          p.life += dt; if (p.life > p.max) return false;
          p.vy -= dt * 2.2; p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          out1.x = p.x; out1.y = p.y; out1.z = p.z; out1.alpha = 1 - p.life / p.max;
        } else {
          p.life += dt; if (p.life > p.max) { p.x = (this.rand() - 0.5) * 12; p.y = 0.4; p.z = (this.rand() - 0.5) * 8 - 1; p.life = 0; }
          p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
          out1.x = p.x; out1.y = p.y; out1.z = p.z; out1.alpha = Math.sin(Math.PI * p.life / p.max) * 0.35;
        }
        out.push(out1); return true;
      });
      return out;
    }

    /* ---------- control ---------- */
    setState(name) { this.stateName = name; const s = STATES[name]; this.target = s; if (this.reduce) { this.cam.eye = s.eye.slice(); this.cam.ctr = s.ctr.slice(); this.cam.fov = s.fov; } }
    setAccent(h) { this.accentT = hex(h); }
    setShift(v, h) { this.shiftT = v; this.hshiftT = h || 0; }
    setPointer(x, y) { this.pointer.x = clamp(x, -1, 1); this.pointer.y = clamp(y, -1, 1); }
    happy() { this.happyT = 1.3; }
    setLight(v) { this.light = v; }
    resize(w, h) {
      this.cw = w; this.ch = h;
      this.px = Math.max(2, Math.ceil(w / (w < 700 ? 300 : 520)));
      this.eng.resize(w, h, this.px);
    }
    kixkiPos() { const k = this.kf || 0, p = this.pf || 0; return [lerp(lerp(-3.15, -2.5, k), -1.0, p), 0, lerp(lerp(1.2, 1.8, k), 3.2, p)]; }
    kixkiScreen() {
      const q = this.kixkiPos(), p = [q[0], lerp(2.9, 2.5, this.pf || 0), q[2]], v = this.eng.vp;
      const x = v[0] * p[0] + v[4] * p[1] + v[8] * p[2] + v[12], y = v[1] * p[0] + v[5] * p[1] + v[9] * p[2] + v[13], w = v[3] * p[0] + v[7] * p[1] + v[11] * p[2] + v[15];
      return { x: (x / w * 0.5 + 0.5) * this.cw, y: (1 - (y / w * 0.5 + 0.5)) * this.ch };
    }
    start() { if (this.running) return; this.running = true; this.last = performance.now(); this._raf = requestAnimationFrame(t => this.loop(t)); }
    stop() { this.running = false; cancelAnimationFrame(this._raf); }
    loop(now) {
      if (!this.running) return;
      this._raf = requestAnimationFrame(t => this.loop(t));
      if (document.hidden) { this.last = now; return; }
      let dt = (now - this.last) / 1000;
      if (dt < this.minDt * 0.9) return;
      this.last = now; dt = Math.min(dt, 0.08);
      this.slowFrames = dt > 0.045 ? this.slowFrames + 1 : Math.max(0, this.slowFrames - 1);
      if (this.slowFrames > 50 && this.px < 8) { this.px++; this.slowFrames = 0; this.eng.resize(this.cw, this.ch, this.px); }
      this.update(dt); this.render(); if (this.onFrame) this.onFrame();
    }

    /* ---------- actualización ---------- */
    update(dt) {
      this.t += dt; const T = this.target || STATES.intro, k = this.reduce ? 1 : 1 - Math.exp(-dt * 2.4);
      const c = this.cam;
      const eff = (this.cw * (1 - this.hshiftT)) / this.ch, kt = clamp((1.35 - eff) / 0.45, 0, 1), pt = clamp((0.95 - eff) / 0.3, 0, 1), ks = 1 - Math.exp(-dt * 2.5);
      this.kf = this.kf == null || this.reduce ? kt : lerp(this.kf, kt, ks);
      this.pf = this.pf == null || this.reduce ? pt : lerp(this.pf, pt, ks);
      const dist = Math.hypot(T.eye[0] - T.ctr[0], T.eye[1] - T.ctr[1], T.eye[2] - T.ctr[2]), df = lerp(1, Math.min(13, dist * 1.35) / dist, this.pf);
      for (let i = 0; i < 3; i++) { c.ctr[i] = lerp(c.ctr[i], T.ctr[i], k); c.eye[i] = lerp(c.eye[i], T.ctr[i] + (T.eye[i] - T.ctr[i]) * df, k); }
      c.fov = lerp(c.fov, T.fov, k);
      this.shift = lerp(this.shift, this.shiftT, 1 - Math.exp(-dt * 3)); this.hshift = lerp(this.hshift, this.hshiftT, 1 - Math.exp(-dt * 3));
      const p = this.pointer, kp = 1 - Math.exp(-dt * 3); p.sx = lerp(p.sx, p.x, kp); p.sy = lerp(p.sy, p.y, kp);
      const b = this.book, kb = this.reduce ? 1 : 1 - Math.exp(-dt * 2.6);
      b.open = lerp(b.open, T.open, kb); b.y = lerp(b.y, T.bookY, kb); b.energy = lerp(b.energy, T.energy, kb);
      b.spinV = lerp(b.spinV, T.spin ? 2.4 : 0, 1 - Math.exp(-dt * 1.6));
      b.spin += b.spinV * dt; if (!T.spin) { const target = Math.round(b.spin / (Math.PI * 2)) * Math.PI * 2; b.spin = lerp(b.spin, target, 1 - Math.exp(-dt * 2)); }
      this.accent = mixv(this.accent, this.accentT, 1 - Math.exp(-dt * 3));
      this.blinkT -= dt; if (this.blinkT < 0) { this.blinking = 0.14; this.blinkT = 2.4 + this.rand() * 2.6; }
      if (this.blinking > 0) this.blinking -= dt;
      if (this.happyT > 0) this.happyT -= dt;
      this.flapT = (this.flapT || 0) + dt * (0.35 + b.energy * 0.9);
      this.partDraw = this.stepParts(dt);
    }

    /* ---------- dibujo ---------- */
    render() {
      const e = this.eng, c = this.cam, t = this.t, P = this.pointer, rd = this.reduce ? 0 : 1;
      const b = this.book, acc = this.accent, L = this.light;
      const eye = [c.eye[0] + P.sx * 0.9 * rd, c.eye[1] - P.sy * 0.35 * rd, c.eye[2]];
      const ctr = [c.ctr[0] + P.sx * 0.15 * rd, c.ctr[1], c.ctr[2]];
      const bob = Math.sin(t * 1.6) * 0.07 * rd, by = b.y + bob;
      const flick = k => 0.85 + Math.sin(t * 9 + k) * 0.08 + Math.sin(t * 23 + k * 3) * 0.05;
      e.amb = [0.22 * L + 0.05, 0.18 * L + 0.05, 0.42 * L + 0.08];
      e.fog = L > 1.5 ? [0.6, 0.52, 0.86] : [0.08, 0.05, 0.2];
      e.fogd = 0.018; e.moonC = [0.1 * L, 0.1 * L, 0.24 * L];
      e.setLight(0, [0, by + 0.8, 0.5], mixv([1.3, 1.1, 0.7], acc.map(v => v * 1.5 + 0.3), 0.55).map(v => v * (0.5 + b.energy * 0.9)));
      e.setLight(1, [-3.4, 3.4, 2.4], [1.5 * flick(0), 0.95 * flick(0), 0.45]);
      e.setLight(2, [4.2, 2.8, -2.2], [1.2 * flick(2), 0.7 * flick(2), 0.28]);
      e.setLight(3, [0, 6, -5.5], [0.5, 0.4, 1.0]);
      e.tint = mixv([1, 0.82, 0.4], acc.map(v => clamp(v * 1.2 + 0.15, 0, 1)), 0.6);
      e.begin(eye, ctr, c.fov, this.shift, this.hshift);
      e.drawStatic();

      const M = mat, I = M.id();
      const dyn = (parent, p, size, col, emi, rot, noise) => {
        let m = M.mul(parent, M.T(p[0], p[1], p[2])); if (rot) m = M.mul(m, rot);
        e.box(m, size, col, emi, noise);
      };

      // llamas
      [[-4.2, 0], [4.2, 2]].forEach(([x, k]) => {
        const f = flick(k), p = M.T(x, 2.3, -2.6);
        dyn(p, [0, 0.12 * f, 0], [0.36, 0.34 * f, 0.36], [1, 0.45, 0.08], [0.9, 0.35, 0.05], null, 0);
        dyn(p, [0, 0.36 * f, 0], [0.22, 0.3 * f, 0.22], [1, 0.8, 0.2], [1, 0.7, 0.15], null, 0);
        dyn(p, [0, 0.58 * f, 0], [0.1, 0.18, 0.1], [1, 1, 0.7], [1, 0.95, 0.6], null, 0);
      });

      // cristales orbitando
      const crystalCols = [[0.45, 0.85, 1], acc, [1, 0.8, 0.35], [1, 0.55, 0.8]];
      for (let i = 0; i < 4; i++) {
        const a = t * 0.55 * (0.6 + b.energy) + i * Math.PI / 2, r = 1.55 + b.energy * 0.25;
        const cy = 2.35 + Math.sin(t * 1.4 + i * 1.7) * 0.12 * rd + (by - 2.45) * 0.6;
        const rot = M.mul(M.RY(t * 1.1 + i), M.mul(M.RX(0.785), M.RZ(0.785)));
        const col = crystalCols[i];
        dyn(I, [Math.cos(a) * r, cy, Math.sin(a) * r], [0.3, 0.3, 0.3], col, col.map(v => v * 0.55), rot, 0);
        dyn(I, [Math.cos(a) * r, cy, Math.sin(a) * r], [0.14, 0.14, 0.14], [1, 1, 1], [0.6, 0.6, 0.6], M.mul(rot, M.RY(0.7)), 0);
      }

      // libro
      const root = M.mul(M.T(0, by, 0), M.mul(M.RY(b.spin + Math.sin(t * 0.5) * 0.08 * rd), M.RX(0.5 - b.open * 0.12)));
      const cover = hex('#4a2ca0'), gold = hex('#ffd36e'), page = [0.82, 0.78, 0.7];
      dyn(root, [0, -0.03, 0], [0.16, 0.22, 1.3], hex('#2e1d73'), null, null, 0.6);
      [-1, 1].forEach(s => {
        const half = M.mul(root, M.RZ(s * b.open)), hp = M.mul(half, M.T(s * 0.62, 0, 0));
        dyn(hp, [0, -0.07, 0], [1.2, 0.08, 1.4], cover, [0.03, 0.01, 0.1], null, 0.8);
        dyn(hp, [s * 0.52, -0.07, 0], [0.16, 0.1, 1.46], gold, [0.25, 0.2, 0.03], null, 0.3);
        dyn(hp, [-s * 0.02, 0.0, 0], [1.05, 0.1, 1.26], page, [0.07, 0.06, 0.04], null, 0.25);
        for (let l = 0; l < 6; l++) dyn(hp, [-s * 0.02, 0.058, -0.5 + l * 0.2], [0.7 - (l % 3) * 0.1, 0.012, 0.045], [0.5, 0.4, 0.65], [0.1, 0.08, 0.2], null, 0);
      });
      // hoja que pasa
      const fl = (this.flapT || 0) % 1;
      if (fl < 0.55 && b.energy > 0.2) {
        const q = fl / 0.55, ang = lerp(b.open, Math.PI - b.open, q * q * (3 - 2 * q));
        const pg = M.mul(root, M.mul(M.RZ(ang), M.T(0.55, 0.1 + Math.sin(q * Math.PI) * 0.22, 0)));
        dyn(pg, [0, 0, 0], [1.02, 0.02, 1.24], page, [0.16, 0.14, 0.1], null, 0);
      }

      this.drawKixki();
      e.particles(this.partDraw);
    }

    drawKixki() {
      const e = this.eng, M = mat, t = this.t, K = lerp(lerp(1.4, 1.2, this.kf || 0), 1.05, this.pf || 0), kp = this.kixkiPos();
      const happy = this.happyT > 0 ? Math.abs(Math.sin(t * 10)) * 0.5 * Math.min(1, this.happyT) : 0;
      const bob = Math.sin(t * 2.2) * 0.025;
      const yaw = 0.62 + Math.sin(t * 0.7) * 0.05 + (this.stateName === 'ritual' ? 0.15 : 0);
      const root = M.mul(M.T(kp[0], happy * K, kp[2]), M.RY(yaw + 0.25 * (this.pf || 0)));
      const kb = (parent, p, s, col, emi, rot) => { if (!emi) emi = col === wool || col === woolS ? [0.16, 0.15, 0.2] : (col === skin || col === skinD ? [0.12, 0.07, 0.05] : null); let m = M.mul(parent, M.T(p[0] * K, p[1] * K, p[2] * K)); if (rot) m = M.mul(m, rot); e.box(m, [s[0] * K, s[1] * K, s[2] * K], col, emi, 0.55); };
      var wool = hex('#fffaf0'), woolS = hex('#d9c9f5'), skin = hex('#f7b58a'), skinD = hex('#e39a6e'), eye = hex('#2b1a5e'), cheek = hex('#ff9fb8'), scarf = hex('#6b3fe0'), hat = hex('#3b2480'), gold = hex('#ffd36e');
      const body = M.mul(root, M.T(0, bob * K, 0));
      kb(body, [0, 0.95, 0], [1.0, 0.8, 1.15], wool);
      kb(body, [0, 0.66, 0], [0.9, 0.3, 1.2], woolS);
      kb(body, [0, 1.3, -0.05], [1.1, 0.34, 0.95], wool);
      kb(body, [0, 1.5, -0.25], [0.75, 0.24, 0.6], wool);
      [[-0.3, 0.4], [0.3, 0.4], [-0.3, -0.4], [0.3, -0.4]].forEach(([x, z]) => kb(body, [x, 0.27, z], [0.22, 0.54, 0.22], skinD));
      kb(body, [0, 1.0, 0.55], [0.74, 0.18, 0.5], scarf);
      kb(body, [0.3, 0.8, 0.72], [0.16, 0.4, 0.1], scarf);
      const nod = Math.sin(t * 2.2 + 1) * 0.03 + (this.happyT > 0 ? Math.sin(t * 10) * 0.08 : 0);
      const head = M.mul(body, M.mul(M.T(0, 1.28 * K, 0.78 * K), M.RX(nod)));
      kb(head, [0, 0, 0], [0.64, 0.58, 0.56], skin);
      kb(head, [0, 0.33, -0.03], [0.74, 0.22, 0.64], wool);
      const sway = Math.sin(t * 3) * 0.15;
      kb(head, [-0.42, 0.04, -0.02], [0.2, 0.14, 0.28], skin, null, M.RZ(0.35 + sway));
      kb(head, [0.42, 0.04, -0.02], [0.2, 0.14, 0.28], skin, null, M.RZ(-0.35 - sway));
      const closed = this.blinking > 0, hp = this.happyT > 0;
      [-0.17, 0.17].forEach(x => kb(head, [x, hp ? 0.08 : 0.04, 0.29], [0.1, hp ? 0.05 : (closed ? 0.025 : 0.16), 0.04], eye));
      [-0.27, 0.27].forEach(x => kb(head, [x, -0.1, 0.29], [0.13, 0.08, 0.03], cheek, [0.12, 0.04, 0.06]));
      kb(head, [0, -0.15, 0.29], [hp ? 0.18 : 0.1, hp ? 0.07 : 0.03, 0.03], eye);
      // sombrero de maga (más chico y echado hacia atrás para dejar ver la cara)
      const hg = M.mul(head, M.mul(M.T(0, 0.02 * K, -0.1 * K), M.RX(-0.22)));
      kb(hg, [0, 0.5, 0], [0.86, 0.06, 0.78], hat);
      kb(hg, [0, 0.54, 0], [0.62, 0.07, 0.56], gold, [0.3, 0.24, 0.04]);
      kb(hg, [0, 0.66, 0], [0.54, 0.18, 0.5], hat);
      kb(hg, [0.01, 0.83, 0], [0.4, 0.18, 0.38], hat);
      kb(hg, [0.03, 0.99, 0], [0.28, 0.18, 0.26], hat, null, M.RZ(-0.1));
      kb(hg, [0.1, 1.13, 0], [0.17, 0.18, 0.17], hat, null, M.RZ(-0.3 + Math.sin(t * 2.5) * 0.05));
      kb(hg, [0.0, 0.76, 0.22], [0.09, 0.09, 0.04], gold, [0.5, 0.4, 0.06]);
    }
  }

  window.MesaScene = MesaScene;
})();
