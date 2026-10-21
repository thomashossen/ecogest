const GREY = '#8a857a';
const KBASE_FR = { 'k-badge': 'MICROÉCONOMIE', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer', 'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé', phSeed: 'auto', copy: 'Copier', copied: 'Copié', 'k-sub': '© Thomas Hossen – Version du 20 octobre 2026' };
const KBASE_EN = { 'k-badge': 'MICROECONOMICS', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate', 'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution', phSeed: 'auto', copy: 'Copy', copied: 'Copied', 'k-sub': '© Thomas Hossen – Version of 20 October 2026' };
/* ---------- calcul exact : reconnaissance des rationnels et affichage fractionnaire ---------- */
function ratOf(x) {
  if (!isFinite(x)) return null;
  const s = x < 0 ? -1 : 1, y = Math.abs(x);
  if (Math.abs(y - Math.round(y)) <= 1e-11 * Math.max(1, y)) return [s * Math.round(y), 1];
  let h0 = 0, h1 = 1, k0 = 1, k1 = 0, z = y;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(z), h2 = a * h1 + h0, k2 = a * k1 + k0;
    if (k2 > 2e6) return null;
    if (Math.abs(y - h2 / k2) <= 1e-12 * Math.max(1, y)) return [s * h2, k2];
    h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    const f = z - a; if (f < 1e-15) return null; z = 1 / f;
  }
  return null;
}
/* valeur exacte : entier ou fraction ; décimale si le nombre n'est pas rationnel (racine, puissance non entière) */
function fq(x) {
  const r = ratOf(x);
  if (!r) return texT(x, 4);
  if (r[1] === 1) return texT(r[0], 0);
  return (r[0] < 0 ? '-' : '') + '\\frac{' + texT(Math.abs(r[0]), 0) + '}{' + texT(r[1], 0) + '}';
}
/* valeur exacte suivie d'une approximation décimale */
function fqa(x) {
  const r = ratOf(x);
  if (!r) return texT(x, 4);
  if (r[1] === 1) return texT(r[0], 0);
  return fq(x) + '\\approx ' + texT(x, Math.abs(x) >= 100 ? 2 : 4);
}
/* entre parenthèses si fraction ou négatif (avant un exposant) */
function fqp(x) { const r = ratOf(x), t = fq(x); return (r && r[1] === 1 && r[0] >= 0) || (!r && x >= 0) ? t : '\\left(' + t + '\\right)'; }
/* cellule de tableau : valeur exacte, approximation en petit */
function fqt(x) { const r = ratOf(x); return '\\(' + fq(x) + '\\)' + (r && r[1] === 1 ? '' : '<br><small>≈ ' + fmt(x, 2) + '</small>'); }

/* signe = si la valeur est exacte (rationnelle), sinon approximation */
function eqa(x) { return ratOf(x) ? '=' + fqa(x) : '\\approx ' + texT(x, 4); }
/* simplification d'affichage : \frac{X}{1} devient X (entre parenthèses si nécessaire) */
function fracClean(h) {
  const grp = (s, i) => { if (s[i] !== '{') return -1; let d = 0; for (let j = i; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (d === 0) return j; } } return -1; };
  let out = '', i = 0;
  for (;;) {
    const re = /\\[td]?frac\{/g; re.lastIndex = i; const mm = re.exec(h);
    if (!mm) { out += h.slice(i); break; }
    const k = mm.index, cmd = mm[0].slice(0, -1), a = k + cmd.length, ae = grp(h, a), b = ae + 1, be = ae > 0 ? grp(h, b) : -1;
    if (ae < 0 || be < 0) { out += h.slice(i, a + 1); i = a + 1; continue; }
    const num = h.slice(a + 1, ae), den = h.slice(b + 1, be).trim();
    if (den === '1') {
      let top = false, d = 0; for (let j = 0; j < num.length; j++) { const c = num[j]; if (c === '{') d++; else if (c === '}') d--; else if ((c === '+' || c === '-') && d === 0 && j > 0) top = true; }
      const rest = h.slice(be + 1), end = /^(\s*$|\\\]|\\\)|=|&|\\\\|\\qquad|\\quad|\\text|\\iff|&lt;|&gt;|\s*[,;.<}])/.test(rest);
      out += h.slice(i, k) + (top && !end ? '\\left(' + fracClean(num) + '\\right)' : fracClean(num));
    } else out += h.slice(i, k) + cmd + '{' + fracClean(num) + '}{' + fracClean(h.slice(b + 1, be)) + '}';
    i = be + 1;
  }
  return out;
}
const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : fq(x) + '\\,';
/* figure générique : demande linéaire P = a - bQ, surplus des consommateurs, profits par segments [x0, x1, coût],
   perte sèche par rapport à la tarification au coût marginal minimal cmin */
function eiSurplusFig(o) {
  const fr = o.lang === 'fr', a = o.a, b = o.b, Qmax = a / b, Qc = (a - o.cmin) / b;
  const G = Plot({ w: 640, h: 320, x0: 0, x1: Qmax * 1.02, y0: 0, y1: a * 1.08, mt: 26, mb: 42 });
  G.axes({ xt: ticks(0, Qmax, 5), yt: ticks(0, a, 5), xl: 'Q', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.add(`<path d="M${G.X(0)} ${G.Y(a)} L${G.X(o.Q)} ${G.Y(o.P)} L${G.X(0)} ${G.Y(o.P)} Z" fill="${COL.s1}" fill-opacity="0.22"/>`);
  (o.seg || []).forEach((s, k) => {
    G.add(`<rect x="${G.X(s[0])}" y="${G.Y(Math.max(o.P, s[2]))}" width="${G.X(s[1]) - G.X(s[0])}" height="${Math.abs(G.Y(s[2]) - G.Y(o.P))}" fill="${o.P >= s[2] ? '#2e7d5b' : COL.s3}" fill-opacity="${k % 2 ? 0.18 : 0.3}"/>`);
    if (s[2] > o.cmin && o.P >= s[2]) G.add(`<rect x="${G.X(s[0])}" y="${G.Y(s[2])}" width="${G.X(s[1]) - G.X(s[0])}" height="${G.Y(o.cmin) - G.Y(s[2])}" fill="${COL.s3}" fill-opacity="0.3"/>`);
  });
  if (Qc > o.Q + 1e-9) G.add(`<path d="M${G.X(o.Q)} ${G.Y(o.P)} L${G.X(Qc)} ${G.Y(o.cmin)} L${G.X(o.Q)} ${G.Y(o.cmin)} Z" fill="${COL.s3}" fill-opacity="0.3"/>`);
  G.line([[0, a], [Qmax, 0]], { c: COL.s1, w: 2.2 });
  G.line([[0, o.cmin], [Qmax, o.cmin]], { c: COL.s2, w: 1.8 });
  (o.costs || []).forEach(cc => { if (cc !== o.cmin) G.line([[0, cc], [Qmax, cc]], { c: COL.s2, w: 1.2, dash: '5 4' }); });
  G.dot(o.Q, o.P, { c: COL.s1 }); G.text(o.Q, o.P, o.label || 'E', { dx: 8, dy: -6, anchor: 'start', bold: true, size: 12 });
  G.legend([{ c: COL.s1, box: true, o: 0.3, t: fr ? 'surplus des consommateurs' : 'consumer surplus' }, { c: '#2e7d5b', box: true, o: 0.35, t: fr ? 'surplus des producteurs' : 'producer surplus' }, { c: COL.s3, box: true, o: 0.4, t: fr ? 'perte sèche' : 'deadweight loss' }], G.ml + 8, 16);
  return '<div class="sol-fig">' + (o.caption ? `<p style="text-align:center;margin:.2rem 0"><em>${o.caption}</em></p>` : '') + G.svg(o.aria || 'surplus') + '</div>';
}
/* ---------- outils communs : jeux finis à deux joueurs ---------- */
/* U1[i][j], U2[i][j] : gains des joueurs 1 (ligne i) et 2 (colonne j) */
function jxBR(U1, U2) {
  const n = U1.length, m = U1[0].length;
  const br1 = U1.map(() => U1[0].map(() => false)), br2 = U1.map(() => U1[0].map(() => false));
  for (let j = 0; j < m; j++) { const mx = Math.max(...U1.map(r => r[j])); for (let i = 0; i < n; i++) if (U1[i][j] === mx) br1[i][j] = true; }
  for (let i = 0; i < n; i++) { const mx = Math.max(...U2[i]); for (let j = 0; j < m; j++) if (U2[i][j] === mx) br2[i][j] = true; }
  const ne = []; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (br1[i][j] && br2[i][j]) ne.push([i, j]);
  return { br1: br1, br2: br2, ne: ne };
}
/* matrice des gains en SVG ; opts : rows, cols, p1, p2, br (bool), ne (bool), cross {rows:[], cols:[]} */
function jxMatrixSVG(U1, U2, o) {
  o = o || {};
  const n = U1.length, m = U1[0].length, cw = o.cw || 120, ch = o.ch || 56, x0 = 130, y0 = 62, W = x0 + cw * m + 20, H = y0 + ch * n + 16;
  const B = jxBR(U1, U2), cr = o.cross || { rows: [], cols: [] };
  let s = `<svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.aria || 'matrice'}">`;
  s += `<text x="${x0 + cw * m / 2}" y="18" text-anchor="middle" ${FONT_T} font-size="13" font-weight="700" fill="${COL.s2}">${o.p2 || 'Joueur 2'}</text>`;
  s += `<text x="16" y="${y0 + ch * n / 2}" text-anchor="middle" ${FONT_T} font-size="13" font-weight="700" fill="${COL.s1}" transform="rotate(-90 16 ${y0 + ch * n / 2})">${o.p1 || 'Joueur 1'}</text>`;
  (o.cols || []).forEach((t, j) => { s += `<text x="${x0 + cw * j + cw / 2}" y="${y0 - 12}" text-anchor="middle" ${FONT_T} font-size="12" fill="${cr.cols.indexOf(j) >= 0 ? COL.grid : COL.ink}">${t}</text>`; });
  (o.rows || []).forEach((t, i) => { s += `<text x="${x0 - 10}" y="${y0 + ch * i + ch / 2 + 4}" text-anchor="end" ${FONT_T} font-size="12" fill="${cr.rows.indexOf(i) >= 0 ? COL.grid : COL.ink}">${t}</text>`; });
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const dead = cr.rows.indexOf(i) >= 0 || cr.cols.indexOf(j) >= 0, eq = o.ne && B.br1[i][j] && B.br2[i][j] && !dead;
    s += `<rect x="${x0 + cw * j}" y="${y0 + ch * i}" width="${cw}" height="${ch}" fill="${eq ? COL.s3 : dead ? '#f2efe8' : '#fff'}" fill-opacity="${eq ? 0.14 : 1}" stroke="${COL.axis}"/>`;
    const u1 = fmtT(U1[i][j], 2), u2 = fmtT(U2[i][j], 2), b1 = o.br && B.br1[i][j] && !dead, b2 = o.br && B.br2[i][j] && !dead;
    s += `<text x="${x0 + cw * j + cw / 2}" y="${y0 + ch * i + ch / 2 + 5}" text-anchor="middle" ${FONT_M} font-size="14" fill="${dead ? '#b9b3a6' : COL.ink}"><tspan fill="${dead ? '#b9b3a6' : COL.s1}" font-weight="${b1 ? 700 : 400}" text-decoration="${b1 ? 'underline' : 'none'}">${u1}</tspan> ; <tspan fill="${dead ? '#b9b3a6' : COL.s2}" font-weight="${b2 ? 700 : 400}" text-decoration="${b2 ? 'underline' : 'none'}">${u2}</tspan></text>`;
    if (dead) s += `<line x1="${x0 + cw * j + 8}" y1="${y0 + ch * i + ch / 2}" x2="${x0 + cw * j + cw - 8}" y2="${y0 + ch * i + ch / 2}" stroke="${COL.s3}" stroke-width="1.4" stroke-opacity="0.6"/>`;
  }
  return s + '</svg>';
}
/* matrice en tableau HTML pour les énoncés */
function jxTable(U1, U2, rows, cols, corner) {
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${corner || ''}</th>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${U1.map((r, i) => `<tr><td><strong>${rows[i]}</strong></td>${r.map((v, j) => `<td class="num">(${fmtT(v, 2)} ; ${fmtT(U2[i][j], 2)})</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
/* ---------- arbres de jeu ---------- */
/* nœud : { pl: 1|2|3, lab: 'nom', ch: [{ a: 'action', n: nœud }] } ou feuille { u: [gains] } */
function jxBack(node) {
  /* induction à rebours : renvoie les gains et marque node.best */
  if (node.u) return node.u;
  let best = -1, val = null;
  node.ch.forEach((c, k) => { const v = jxBack(c.n); if (!val || v[node.pl - 1] > val[node.pl - 1]) { val = v; best = k; } });
  node.best = best; node.val = val; return val;
}
function jxTreeSVG(root, o) {
  o = o || {};
  const leaves = []; const walk = (n, d) => { n.d = d; if (n.u) { n.x = leaves.length; leaves.push(n); return; } n.ch.forEach(c => walk(c.n, d + 1)); n.x = (n.ch[0].n.x + n.ch[n.ch.length - 1].n.x) / 2; };
  walk(root, 0);
  let depth = 0; const md = n => { depth = Math.max(depth, n.d); if (!n.u) n.ch.forEach(c => md(c.n)); }; md(root);
  const W = Math.max(360, leaves.length * (o.lw || 90) + 40), H = (depth) * (o.dh || 90) + 110, px = n => 20 + (n.x + 0.5) * (W - 40) / leaves.length, py = n => 34 + n.d * (o.dh || 90);
  const cols = [COL.s1, COL.s2, COL.s4 || COL.s3];
  let s = `<svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.aria || 'arbre'}">`;
  const edges = (n, onPath) => { if (n.u) return; n.ch.forEach((c, k) => { const hot = o.bi && n.best === k, path = hot && onPath; s += `<line x1="${px(n)}" y1="${py(n)}" x2="${px(c.n)}" y2="${py(c.n)}" stroke="${hot ? COL.s3 : COL.axis}" stroke-width="${path ? 4 : hot ? 2.6 : 1.4}"/>`; s += `<text x="${(px(n) + px(c.n)) / 2 + (k === 0 ? -8 : 8)}" y="${(py(n) + py(c.n)) / 2}" text-anchor="${k === 0 ? 'end' : 'start'}" ${FONT_T} font-size="12" font-style="italic" fill="${hot ? COL.s3 : COL.ink}">${c.a}</text>`; edges(c.n, path); }); };
  edges(root, true);
  const nodes = n => { if (n.u) { s += `<text x="${px(n)}" y="${py(n) + 18}" text-anchor="middle" ${FONT_M} font-size="12" fill="${COL.ink}">(${n.u.map(v => fmtT(v, 2)).join(' ; ')})</text>`; return; } s += `<circle cx="${px(n)}" cy="${py(n)}" r="13" fill="${cols[n.pl - 1]}"/><text x="${px(n)}" y="${py(n) + 4.5}" text-anchor="middle" ${FONT_T} font-size="12" font-weight="700" fill="#fff">${n.lab || n.pl}</text>`; n.ch.forEach(c => nodes(c.n)); };
  nodes(root);
  return s + '</svg>';
}
