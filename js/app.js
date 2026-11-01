/* Mesa de Encantos — flujo del test, puntuación y pantallas. */
(function () {
  'use strict';
  const D = window.MESA, ICONS = window.MESA_ICONS, E = D.order, Q = D.questions, N = Q.length;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const root = document.documentElement;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pad = n => String(n).padStart(2, '0');
  const ROMAN = ['I', 'II', 'III', 'IV', 'V'];

  /* ---------- almacenamiento (puede fallar: privado, bloqueado, etc.) ---------- */
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem('mesa.' + k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('mesa.' + k, JSON.stringify(v)); } catch (e) { /* sin guardado */ } },
    del(k) { try { localStorage.removeItem('mesa.' + k); } catch (e) { /* nada */ } }
  };

  /* ---------- ajustes ---------- */
  const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = Object.assign({ theme: 'dark', style: 'pixel', motion: 'auto' }, store.get('settings') || {});
  const isReduced = () => S.motion === 'reduce' || (S.motion === 'auto' && prefersReduce);
  let scene = null;
  function applySettings() {
    root.dataset.theme = S.theme; root.dataset.style = S.style; root.dataset.motion = S.motion;
    const m = $('meta[name="theme-color"]'); if (m) m.content = S.theme === 'light' ? '#efe6ff' : '#150c33';
    if (scene) { scene.setLight(S.theme === 'light' ? 2.2 : 1); scene.reduce = isReduced(); }
  }

  /* ---------- íconos pixel ---------- */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  function iconCanvas(id) {
    const cv = document.createElement('canvas'); cv.width = 12; cv.height = 12; cv.setAttribute('aria-hidden', 'true');
    const c = rgb(D.enchants[id].color), x = cv.getContext('2d');
    const pal = { k: [26, 15, 58], a: c, b: c.map(v => v * 0.6), c: c.map(v => Math.min(255, v * 1.3 + 40)), w: [255, 255, 255], y: [255, 211, 110] };
    ICONS[id].forEach((row, y) => [...row].forEach((ch, xx) => { const p = pal[ch]; if (p) { x.fillStyle = `rgb(${p.map(Math.round).join(',')})`; x.fillRect(xx, y, 1, 1); } }));
    return cv;
  }
  window.MesaIcon = iconCanvas;

  /* ---------- estado de la partida ---------- */
  let run = null, lock = false, cur = 'intro', bubbleTimer = 0;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function newRun() {
    const byBlock = {}; Q.forEach((q, i) => (byBlock[q.b] = byBlock[q.b] || []).push(i));
    const order = []; Object.keys(byBlock).sort((a, b) => a - b).forEach(b => order.push(...shuffle(byBlock[b])));
    const perm = {}; Q.forEach((q, i) => { perm[i] = shuffle([0, 1, 2, 3]); });
    run = { order, perm, answers: {}, idx: 0 };
    store.set('run', run);
  }
  const answered = () => Object.keys(run.answers).length;
  function loadRun() {
    const r = store.get('run');
    if (r && Array.isArray(r.order) && r.order.length === N && r.perm && r.answers) { run = r; return true; }
    return false;
  }

  /* ---------- pantallas ---------- */
  function show(name) {
    cur = name;
    $$('[data-screen]').forEach(s => { s.hidden = s.id !== 'screen-' + name; });
    scene && scene.setState(name === 'ritual' ? 'ritual' : name === 'result' ? 'result' : name === 'quiz' ? 'quiz' : 'intro');
    requestAnimationFrame(updateShift);
  }
  function updateShift() {
    if (!scene) return;
    const W = innerWidth, H = innerHeight, side = matchMedia('(min-width: 980px) and (min-aspect-ratio: 1/1)').matches;
    if (cur === 'ritual') return scene.setShift(0.1, 0);
    const el = cur === 'result' ? $('.result-win') : $('#screen-' + cur), r = el.getBoundingClientRect();
    if (side) scene.setShift(0, clamp((W - r.left) / W, 0, 0.7));
    else if (cur === 'result') scene.setShift(0.56 * 0.98, 0);
    else scene.setShift(clamp((H - r.top) / H, 0, 0.62) * 0.96, 0);
  }

  /* ---------- Kixki habla ---------- */
  const bubble = $('#bubble'), bubbleText = $('#bubbleText');
  function say(text, ms) {
    bubbleText.textContent = text; bubble.hidden = false; clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.hidden = true; }, ms || 4200); placeBubble();
  }
  function placeBubble() {
    if (bubble.hidden || !scene) return;
    const p = scene.kixkiScreen(), w = bubble.offsetWidth || 200;
    bubble.style.left = clamp(p.x, w / 2 + 12, innerWidth - w / 2 - 12) + 'px';
    bubble.style.top = clamp(p.y - 8, bubble.offsetHeight + 16, innerHeight - 10) + 'px';
  }
  const BLOCK_SAY = {
    1: 'Primero, tus amigos y tú. ¡Sé sincero, el libro lo nota!', 2: 'Ahora, cuando las cosas se complican…', 3: 'Hora de tareas, estudio y proyectos.',
    4: '¡Turno de tu lado creativo!', 5: 'Hablemos de corazones y vínculos.', 6: 'Tiempo libre: ¿qué te gusta hacer?', 7: 'Última parte: lo que de verdad te importa.'
  };
  const REACT = ['Mmm, interesante…', 'Anotado en el libro.', '¡Eso brilló!', 'No hay respuestas malas.', 'El libro lo sintió.', 'Sigue así, ya casi.', 'Ooh, eso me gustó.'];

  /* ---------- preguntas ---------- */
  function showQuestion() {
    lock = false;
    const qid = run.order[run.idx], q = Q[qid], perm = run.perm[qid];
    $('#qFile').textContent = `pregunta-${pad(run.idx + 1)}.exe`;
    $('#qTheme').textContent = q.th;
    $('#qText').textContent = q.t;
    const opts = $('#opts'); opts.classList.remove('lock'); opts.textContent = '';
    perm.forEach((orig, d) => {
      const o = q.o[orig], b = document.createElement('button');
      b.type = 'button'; b.className = 'opt px'; b.setAttribute('aria-pressed', run.answers[qid] === orig ? 'true' : 'false');
      const k = document.createElement('span'); k.className = 'k'; k.textContent = 'ABCD'[d]; k.setAttribute('aria-hidden', 'true');
      const t = document.createElement('span'); t.textContent = o.t;
      b.append(k, t); b.addEventListener('click', () => choose(d)); opts.append(b);
    });
    setXP(run.idx);
    $('#btnBack').textContent = run.idx === 0 ? '« Inicio' : '« Volver';
    const body = $('#screen-quiz .win-body'); body.scrollTop = 0;
    $('#qText').focus({ preventScroll: true });
    requestAnimationFrame(updateShift);
  }
  function setXP(n) {
    $('#xpFill').style.width = (n / N * 100) + '%'; $('#xpLvl').textContent = n; $('#xpNum').textContent = `${Math.min(n + 1, N)} / ${N}`;
    const bar = $('#xpBar'); bar.setAttribute('aria-valuenow', n); bar.setAttribute('aria-valuetext', `Pregunta ${Math.min(n + 1, N)} de ${N}`);
  }
  function choose(d) {
    if (lock || cur !== 'quiz') return; lock = true;
    const qid = run.order[run.idx], orig = run.perm[qid][d];
    run.answers[qid] = orig; store.set('run', run);
    $$('#opts .opt').forEach((b, i) => b.setAttribute('aria-pressed', i === d ? 'true' : 'false'));
    $('#opts').classList.add('lock');
    setXP(run.idx + 1); scene && scene.burst(isReduced() ? 6 : 16);
    setTimeout(next, isReduced() ? 120 : 460);
  }
  function next() {
    run.idx++; store.set('run', run);
    if (run.idx >= N) return finish();
    showQuestion();
    const q = Q[run.order[run.idx]], first = run.idx === 0 || Q[run.order[run.idx - 1]].b !== q.b;
    if (first) say(BLOCK_SAY[q.b]);
    else if (run.idx === 35) say('¡Ya vas a la mitad! El libro está brillando.');
    else if (Math.random() < 0.2) say(REACT[Math.floor(Math.random() * REACT.length)], 2600);
  }
  function back() {
    if (lock) return;
    if (run.idx === 0) return goIntro();
    run.idx--; store.set('run', run); showQuestion();
  }

  /* ---------- puntuación ---------- */
  function compute() {
    const s = {}, m = {}; E.forEach(e => { s[e] = 0; m[e] = 0; });
    Q.forEach((q, i) => { const oi = run.answers[i]; if (oi == null) return; const o = q.o[oi]; s[o.e] += 3; m[o.e]++; s[o.s] += 1; });
    // norm: puntos sobre lo esperado al azar (corrige ventajas de cada encantamiento); pct: escala para mostrar
    const norm = {}, pct = {};
    E.forEach(e => { norm[e] = (s[e] - D.mean[e]) / (D.max[e] - D.mean[e]); pct[e] = 0.15 + 0.85 * clamp((norm[e] + 0.25) / 1.25, 0, 1); });
    const rank = E.slice().sort((a, b) => norm[b] - norm[a] || m[b] - m[a] || s[b] - s[a] || E.indexOf(a) - E.indexOf(b));
    return { pct, norm, rank, s, m };
  }
  const levelOf = n => n >= 0.58 ? 5 : n >= 0.46 ? 4 : n >= 0.34 ? 3 : n >= 0.22 ? 2 : 1;
  window.MesaScore = { compute, levelOf };

  /* ---------- ritual y resultado ---------- */
  const RITUAL = ['Encantando…', 'Leyendo tus respuestas…', 'Fundiendo las runas…', '¡Casi listo!'];
  let ritualT = 0, ritualI = 0, result = null;
  function finish() {
    show('ritual'); say('¡Es hora de encantar!', 3200);
    ritualI = 0; $('#ritualTxt').textContent = RITUAL[0];
    clearInterval(ritualT); ritualT = setInterval(() => { ritualI = Math.min(ritualI + 1, RITUAL.length - 1); $('#ritualTxt').textContent = RITUAL[ritualI]; scene && scene.burst(8); }, 1150);
    setTimeout(reveal, isReduced() ? 1400 : 4800);
  }
  // el nombre nunca debe salirse de la ventana: se achica hasta que quepa (la fuente pixel es más angosta que la de respaldo)
  function fitName(el) {
    el.style.fontSize = ''; let fs = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && fs > 22) { fs -= 2; el.style.fontSize = fs + 'px'; }
  }
  addEventListener('resize', () => { if (cur === 'result' && result && result.fit) result.fit(); });
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  function reveal() {
    clearInterval(ritualT);
    const r = compute(), win = r.rank[0], sec = r.rank[1], info = D.enchants[win], lvl = levelOf(r.norm[win]);
    result = { r, win, sec, lvl };
    store.set('done', { win, lvl, at: Date.now() });
    const sr = $('#screen-result'); sr.style.setProperty('--c', info.color);
    scene && (scene.setAccent(info.color), scene.burst(70), scene.happy());
    $('#rIcon').textContent = ''; $('#rIcon').append(iconCanvas(win));
    $('#rName').firstChild.nodeValue = info.nombre + ' '; $('#rLevel').textContent = ROMAN[lvl - 1];
    result.fit = () => fitName($('#rName'));
    $('#rSub').textContent = info.subtitulo; $('#rQuote').textContent = '“' + info.frase + '”'; $('#rDesc').textContent = info.descripcion;
    const fill = (id, arr) => { const ul = $(id); ul.textContent = ''; arr.forEach(t => ul.append(h('li', '', t))); };
    fill('#rStr', info.fortalezas); fill('#rWeak', info.debilidades);
    $('#rSee').textContent = info.como_te_ven; $('#rTool').textContent = info.herramienta_ideal;
    const sinfo = D.enchants[sec], combo = $('#rCombo'); combo.textContent = ''; combo.style.setProperty('--c', sinfo.color);
    const ct = h('div'); const b = h('b', '', `${info.nombre} ${ROMAN[lvl - 1]} + ${sinfo.nombre} ${ROMAN[levelOf(r.norm[sec]) - 1]}`);
    ct.append(b, h('p', '', `Tu lado secundario es ${sinfo.nombre}: “${sinfo.frase}”`)); combo.append(iconCanvas(sec), ct);
    const match = $('#rMatch'); match.textContent = '';
    info.combina_con.forEach(m => { const mi = D.enchants[m.id]; const box = h('div', 'r-box px'); box.style.setProperty('--c', mi.color); const t = h('div'); const nb = h('b', '', mi.nombre); t.append(nb, h('p', '', m.razon)); box.append(iconCanvas(m.id), t); match.append(box); });
    const bars = $('#rBars'); bars.textContent = '';
    r.rank.forEach((id, i) => {
      const bi = D.enchants[id], li = h('li'); li.style.setProperty('--c', bi.color); li.style.setProperty('--w', Math.round(r.pct[id] * 100) + '%');
      const tr = h('div', 'tr'), fl = h('div', 'fl'); fl.style.animationDelay = (i * 0.05) + 's'; tr.append(fl);
      li.append(iconCanvas(id), h('span', 'nm', bi.nombre), tr, h('span', 'pc', Math.round(r.pct[id] * 100) + '%')); bars.append(li);
    });
    show('result'); sr.scrollTop = 0; $('#shareMsg').textContent = ''; result.fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => result && result.fit());
    setTimeout(() => { say(`¡Mira! Eres ${info.nombre}.`, 5200); }, 600);
    $('#rName').focus({ preventScroll: true });
  }

  /* ---------- compartir y tarjeta ---------- */
  function shareText() {
    const info = D.enchants[result.win];
    return `Soy ${info.nombre} ${ROMAN[result.lvl - 1]} en la Mesa de Encantos. ¿Qué encantamiento eres tú?`;
  }
  async function downloadCard() {
    if (!result || !window.MesaCard) return;
    const msg = $('#shareMsg'); msg.textContent = 'Preparando tarjeta…';
    try {
      const cv = await window.MesaCard.make(result, D, iconCanvas);
      const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `mesa-de-encantos-${result.win}.png`;
      document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      msg.textContent = 'Tarjeta descargada.';
    } catch (e) { msg.textContent = 'No pude crear la tarjeta en este navegador.'; }
  }
  async function share() {
    const msg = $('#shareMsg'), url = location.href.split('#')[0].split('?')[0], text = shareText();
    if (navigator.share) { try { await navigator.share({ title: 'Mesa de Encantos', text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(`${text} ${url}`); msg.textContent = 'Copiado al portapapeles.'; }
    catch (e) { msg.textContent = 'No pude copiar. Selecciona y copia el enlace de la barra del navegador.'; }
  }

  /* ---------- navegación ---------- */
  function goIntro() {
    show('intro'); refreshResume(); $('#btnStart').focus({ preventScroll: true });
  }
  function refreshResume() {
    const b = $('#btnResume'), has = loadRun();
    if (has && answered() >= N) { b.hidden = false; b.textContent = 'Ver mi resultado'; }
    else if (has && answered() > 0) { b.hidden = false; b.textContent = `Continuar (${answered()}/${N})`; }
    else b.hidden = true;
  }
  function startFresh() { newRun(); show('quiz'); showQuestion(); say(BLOCK_SAY[1]); }
  function resume() {
    if (!loadRun()) return startFresh();
    if (answered() >= N) { show('ritual'); return reveal(); }
    run.idx = clamp(run.idx, 0, N - 1); show('quiz'); showQuestion();
  }

  /* ---------- ajustes ---------- */
  const modal = $('#settings'); let lastFocus = null;
  function openSettings() {
    lastFocus = document.activeElement; modal.hidden = false;
    $$('input[type=radio]', modal).forEach(i => { i.checked = S[i.name] === i.value; });
    $('#btnCloseSet').focus();
  }
  function closeSettings() { modal.hidden = true; lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true }); }
  modal.addEventListener('change', e => { const i = e.target; if (i.name in S) { S[i.name] = i.value; store.set('settings', S); applySettings(); } });
  modal.addEventListener('click', e => { if (e.target === modal) closeSettings(); });
  document.addEventListener('keydown', e => {
    if (!modal.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeSettings(); }
      else if (e.key === 'Tab') {
        const f = $$('button, input', modal).filter(x => x.offsetParent !== null || x.type === 'radio'); if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (cur !== 'quiz' || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase(), idx = '1234'.indexOf(k) >= 0 && k.length === 1 ? '1234'.indexOf(k) : 'abcd'.indexOf(k);
    if (k.length === 1 && idx >= 0) { e.preventDefault(); choose(idx); }
    else if (e.key === 'ArrowLeft' || e.key === 'Backspace') { e.preventDefault(); back(); }
  });

  /* ---------- arranque ---------- */
  $('#btnStart').addEventListener('click', startFresh);
  $('#btnResume').addEventListener('click', resume);
  $('#btnBack').addEventListener('click', back);
  $('#btnExit').addEventListener('click', goIntro);
  $('#btnAgain').addEventListener('click', () => { store.del('run'); store.del('done'); result = null; scene && scene.setAccent('#b36bff'); goIntro(); });
  $('#btnCard').addEventListener('click', downloadCard);
  $('#btnShare').addEventListener('click', share);
  $('#btnSettings').addEventListener('click', openSettings);
  $('#btnCloseSet').addEventListener('click', closeSettings);

  try {
    scene = new window.MesaScene($('#scene'), { reduce: isReduced(), fps30: matchMedia('(pointer: coarse)').matches });
  } catch (err) {
    console.warn('WebGL no disponible, uso el respaldo 2D:', err && err.message);
    $('#scene').hidden = true; $('#scene2d').hidden = false; scene = window.MesaFallback.create($('#scene2d'), { reduce: isReduced() });
  }
  scene.onFrame = placeBubble;
  applySettings();
  const fit = () => { scene.resize(innerWidth, innerHeight); updateShift(); placeBubble(); };
  let rz = 0; addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(fit); });
  addEventListener('pointermove', e => { if (e.pointerType !== 'touch') scene.setPointer((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2); }, { passive: true });
  addEventListener('deviceorientation', e => { if (e.gamma != null && e.beta != null) scene.setPointer(e.gamma / 28, (e.beta - 50) / 28); }, { passive: true });
  fit(); scene.setState('intro'); scene.start();
  refreshResume(); show('intro');
  setTimeout(() => say('¡Hola! Soy Kixki. Yo cuido la mesa de encantos.', 5000), 900);
  window.MesaApp = { scene, get run() { return run; }, choose, show, reveal, compute };
})();
