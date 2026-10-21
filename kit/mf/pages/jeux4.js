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
/* corrigé en parties numérotées 1, 2 avec sous-questions a, b, c (comme mcaf3) */
function regroupSol(html, heads, counts) {
  const a = html.indexOf('<ol>'), b = html.lastIndexOf('</ol>');
  if (a < 0 || b < 0) return html;
  const inner = html.slice(a + 4, b), items = [];
  let d = 0, start = -1, i = 0;
  while (i < inner.length) {
    if (inner.startsWith('<li', i) && /[\s>]/.test(inner[i + 3])) { if (d === 0) start = i; d++; i += 3; continue; }
    if (inner.startsWith('</li>', i)) { d--; i += 5; if (d === 0) items.push(inner.slice(start, i)); continue; }
    i++;
  }
  let k = 0, out = '<div class="st-parts">';
  heads.forEach((h, p) => {
    out += `<div class="calc-box"><span class="sol-sub">${p + 1}. ${h}</span><ol class="sub-list">${items.slice(k, k + counts[p]).join('')}</ol></div>`;
    k += counts[p];
  });
  return out + '</div>';
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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 4 – Stratégies mixtes', 'k-h1': 'Équilibre de Nash en stratégies mixtes', 'k-coursetitle': 'Jouer au hasard à bon escient : principe d\'indifférence, correspondances de meilleure réponse et existence d\'un équilibre', 'k-extitle': 'Équilibres en stratégies mixtes d\'un jeu sans équilibre pur et de la poule mouillée', 'k-soltitle': 'Équilibres en stratégies mixtes d\'un jeu sans équilibre pur et de la poule mouillée' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 4 – Mixed strategies', 'k-h1': 'Mixed-strategy Nash equilibrium', 'k-coursetitle': 'Randomising wisely: the indifference principle, best-response correspondences and existence of equilibrium', 'k-extitle': 'Mixed-strategy equilibria of a game without pure equilibrium and of chicken', 'k-soltitle': 'Mixed-strategy equilibria of a game without pure equilibrium and of chicken' });

/* ---------- outils : jeu 2 x 2, p = proba de la ligne 1, q = proba de la colonne 1 ---------- */
function j4mix(A, B) {
  const qd = A[0][0] - A[0][1] - A[1][0] + A[1][1], pd = B[0][0] - B[1][0] - B[0][1] + B[1][1];
  const q = qd !== 0 ? (A[1][1] - A[0][1]) / qd : NaN, p = pd !== 0 ? (B[1][1] - B[1][0]) / pd : NaN;
  return { p: p, q: q, ok: p > 0 && p < 1 && q > 0 && q < 1 };
}
/* espérances de gain du joueur 1 (lignes) contre q, du joueur 2 (colonnes) contre p */
const j4E1 = (A, q) => [q * A[0][0] + (1 - q) * A[0][1], q * A[1][0] + (1 - q) * A[1][1]];
const j4E2 = (B, p) => [p * B[0][0] + (1 - p) * B[1][0], p * B[0][1] + (1 - p) * B[1][1]];
/* correspondances de meilleure réponse dans le carré (q en abscisse, p en ordonnée) */
function j4brc(A, B, lab, lang, size) {
  const fr = lang === 'fr', M = j4mix(A, B), Bp = jxBR(A, B);
  const G = Plot({ w: size || 440, h: (size || 440) + 30, x0: 0, x1: 1, y0: 0, y1: 1, mt: 62, mb: 46, ml: 50 });
  G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.25, 0.5, 0.75, 1], xl: (fr ? 'q : probabilité de ' : 'q: probability of ') + lab[1][0], yl: (fr ? 'p : probabilité de ' : 'p: probability of ') + lab[0][0], xf: v => fmtT(v, 2), yf: v => fmtT(v, 2) });
  /* BR1(q) : p = 1 si E1[0] > E1[1] */
  const br1 = q => { const e = j4E1(A, q); return e[0] > e[1] + 1e-12 ? 1 : e[0] < e[1] - 1e-12 ? 0 : null; };
  const br2 = p => { const e = j4E2(B, p); return e[0] > e[1] + 1e-12 ? 1 : e[0] < e[1] - 1e-12 ? 0 : null; };
  const seg1 = [], seg2 = [];
  if (isFinite(M.q) && M.q > 0 && M.q < 1) { seg1.push([[0, br1(M.q / 2)], [M.q, br1(M.q / 2)]], [[M.q, 0], [M.q, 1]], [[M.q, br1((1 + M.q) / 2)], [1, br1((1 + M.q) / 2)]]); }
  else { const v = br1(0.5); seg1.push([[0, v], [1, v]]); }
  if (isFinite(M.p) && M.p > 0 && M.p < 1) { seg2.push([[br2(M.p / 2), 0], [br2(M.p / 2), M.p]], [[0, M.p], [1, M.p]], [[br2((1 + M.p) / 2), M.p], [br2((1 + M.p) / 2), 1]]); }
  else { const v = br2(0.5); seg2.push([[v, 0], [v, 1]]); }
  seg1.forEach(sg => G.line(sg, { c: COL.s1, w: 3 })); seg2.forEach(sg => G.line(sg, { c: COL.s2, w: 3, dash: '7 4' }));
  const eqs = Bp.ne.map(e => [e[1] === 0 ? 1 : 0, e[0] === 0 ? 1 : 0]); if (M.ok) eqs.push([M.q, M.p]);
  eqs.forEach(e => G.dot(e[0], e[1], { c: COL.s3, r: 7 }));
  G.legend([{ c: COL.s1, t: fr ? 'réponse du joueur 1' : 'player 1 response' }, { c: COL.s2, dash: '7 4', t: fr ? 'réponse du joueur 2' : 'player 2 response' }], G.ml - 30, 18);
  return '<div style="max-width:470px;margin:0 auto">' + G.svg(fr ? 'Correspondances de meilleure réponse' : 'Best-response correspondences') + '</div>';
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez définir une stratégie mixte, calculer un gain espéré, trouver un équilibre en stratégies mixtes par le principe d'indifférence, tracer les correspondances de meilleure réponse d'un jeu \(2\times 2\) et repérer tous ses équilibres, purs et mixtes.<br><br>
<strong>Pourquoi ?</strong> Un tireur de penalty, un contrôleur fiscal ou un joueur de poker ont intérêt à être imprévisibles : si l'adversaire devinait leur choix, il en profiterait. Les stratégies mixtes formalisent cette imprévisibilité, et garantissent qu'un jeu fini a toujours au moins un équilibre de Nash.<br><br>
<strong>Prérequis.</strong> Équilibre de Nash en stratégies pures (Théorie des jeux 3), espérance d'une variable aléatoire.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Stratégie mixte</a> · <a href="#s2">2. Le principe d'indifférence</a> · <a href="#s3">3. Le jeu 2 × 2</a> · <a href="#s4">4. Correspondances de meilleure réponse</a> · <a href="#s5">5. Le théorème de Nash</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Stratégie mixte et gain espéré</div>
<p>Une <em>stratégie mixte</em> est une loi de probabilité sur les stratégies pures : le joueur tire sa stratégie au hasard selon cette loi. Dans un jeu \(2\times 2\), le joueur 1 joue sa première ligne avec probabilité \(p\) et la seconde avec probabilité \(1-p\) ; le joueur 2 joue sa première colonne avec probabilité \(q\). Les tirages étant indépendants, le gain espéré du joueur 1 est :
\[U_1(p,q)=pq\,a_{11}+p(1-q)\,a_{12}+(1-p)q\,a_{21}+(1-p)(1-q)\,a_{22}\]
Il est linéaire en \(p\) : pour un \(q\) donné, le joueur 1 compare le gain espéré de ses deux lignes, \(E_1(q)=q\,a_{11}+(1-q)\,a_{12}\) et \(E_2(q)=q\,a_{21}+(1-q)\,a_{22}\), et met tout son poids sur la meilleure.</p>

<div class="dossier-title" id="s2">2. Le principe d'indifférence</div>
<p>Un joueur n'accepte de mélanger deux stratégies que si elles lui rapportent le même gain espéré : sinon, il jouerait la meilleure avec certitude. À l'équilibre en stratégies mixtes, chaque joueur choisit donc ses probabilités de façon à rendre <em>l'autre</em> indifférent entre ses stratégies. Le \(q^*\) du joueur 2 est la valeur qui égalise les gains espérés des deux lignes du joueur 1 :
\[q^*a_{11}+(1-q^*)a_{12}=q^*a_{21}+(1-q^*)a_{22}\iff q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\]
et, de même, le \(p^*\) du joueur 1 rend le joueur 2 indifférent entre ses colonnes. Résultat contre-intuitif : les probabilités d'un joueur dépendent des gains de l'autre, pas des siens.</p>
<div class="ifig" data-fig="ev"></div>
<div class="fig-cap">Figure 1 — Gains espérés des deux lignes du joueur 1 en fonction de la probabilité \(q\) avec laquelle le joueur 2 joue sa première colonne, dans le jeu de la poule mouillée. Les deux droites se coupent en \(q^*\) : c'est la seule valeur de \(q\) pour laquelle le joueur 1 accepte de mélanger.</div>

<div class="dossier-title" id="s3">3. L'exemple de pile ou face</div>
<p>Dans pile ou face, le joueur 1 gagne 1 si les pièces coïncident, le joueur 2 gagne 1 sinon. Il n'y a pas d'équilibre en stratégies pures. Pour que le joueur 1 soit indifférent, il faut \(q-(1-q)=-q+(1-q)\), soit \(q^*=\frac12\) ; par symétrie, \(p^*=\frac12\). À l'équilibre, chacun joue pile ou face avec probabilité \(\frac12\), et chacun a un gain espéré nul. Dans la poule mouillée, l'équilibre mixte s'ajoute aux deux équilibres purs ; il est symétrique, et l'accident y survient avec une probabilité positive.</p>

<div class="dossier-title" id="s4">4. Correspondances de meilleure réponse</div>
<p>La meilleure réponse du joueur 1 à \(q\) vaut \(p=1\) si sa première ligne est meilleure, \(p=0\) si c'est la seconde, et n'importe quel \(p\in[0,1]\) en cas d'égalité, c'est-à-dire en \(q=q^*\). Son graphe dans le carré \([0,1]^2\) est une ligne brisée en forme de Z. On trace de même celle du joueur 2. Les équilibres de Nash, purs et mixtes, sont exactement les points d'intersection des deux correspondances.</p>
<div class="ifig" data-fig="brc"></div>
<div class="fig-cap">Figure 2 — Correspondances de meilleure réponse et équilibres (points rouges) de quatre jeux classiques. Pile ou face : une seule intersection, mixte. Poule mouillée et bataille des sexes : trois intersections, deux pures dans les coins et une mixte à l'intérieur. Dilemme du prisonnier : une seule, pure, puisque chaque joueur a une stratégie dominante.</div>

<div class="dossier-title" id="s5">5. Le théorème de Nash</div>
<p>Nash (1950) a démontré que tout jeu fini, avec un nombre fini de joueurs et de stratégies pures, possède au moins un équilibre en stratégies mixtes, les stratégies pures étant des cas particuliers. Dans un jeu \(2\times 2\) générique, le nombre d'équilibres est impair : un ou trois. L'équilibre mixte se vérifie toujours de la même façon : chaque stratégie jouée avec une probabilité positive doit donner le même gain espéré, et aucune stratégie non jouée ne doit donner davantage.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Stratégie mixte : loi de probabilité sur les stratégies pures ; gain espéré linéaire en chaque probabilité.</li>
<li>Indifférence : les probabilités d'un joueur rendent l'autre indifférent entre les stratégies qu'il mélange ; \(q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\).</li>
<li>Les équilibres sont les intersections des correspondances de meilleure réponse.</li>
<li>Tout jeu fini a au moins un équilibre de Nash, éventuellement mixte.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can define a mixed strategy, compute an expected payoff, find a mixed-strategy equilibrium with the indifference principle, draw the best-response correspondences of a \(2\times 2\) game and locate all its equilibria, pure and mixed.<br><br>
<strong>Why?</strong> A penalty taker, a tax inspector or a poker player gain from being unpredictable: if the opponent guessed their choice, they would exploit it. Mixed strategies formalise this unpredictability, and guarantee that a finite game always has at least one Nash equilibrium.<br><br>
<strong>Prerequisites.</strong> Pure-strategy Nash equilibrium (Game theory 3), expectation of a random variable.
</div>
<p class="toc">Contents: <a href="#s1">1. Mixed strategy</a> · <a href="#s2">2. The indifference principle</a> · <a href="#s3">3. The 2 × 2 game</a> · <a href="#s4">4. Best-response correspondences</a> · <a href="#s5">5. Nash's theorem</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Mixed strategy and expected payoff</div>
<p>A <em>mixed strategy</em> is a probability distribution over pure strategies: the player draws their strategy at random according to it. In a \(2\times 2\) game, player 1 plays their first row with probability \(p\) and the second with probability \(1-p\); player 2 plays their first column with probability \(q\). Draws being independent, player 1's expected payoff is:
\[U_1(p,q)=pq\,a_{11}+p(1-q)\,a_{12}+(1-p)q\,a_{21}+(1-p)(1-q)\,a_{22}\]
It is linear in \(p\): for a given \(q\), player 1 compares the expected payoff of their two rows, \(E_1(q)=q\,a_{11}+(1-q)\,a_{12}\) and \(E_2(q)=q\,a_{21}+(1-q)\,a_{22}\), and puts all their weight on the better one.</p>

<div class="dossier-title" id="s2">2. The indifference principle</div>
<p>A player only agrees to mix two strategies if they yield the same expected payoff: otherwise, they would play the better one with certainty. In a mixed-strategy equilibrium, each player therefore chooses their probabilities so as to make <em>the other</em> indifferent between their strategies. Player 2's \(q^*\) is the value that equalises the expected payoffs of player 1's two rows:
\[q^*a_{11}+(1-q^*)a_{12}=q^*a_{21}+(1-q^*)a_{22}\iff q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\]
and, likewise, player 1's \(p^*\) makes player 2 indifferent between their columns. A counter-intuitive result: a player's probabilities depend on the other's payoffs, not on their own.</p>
<div class="ifig" data-fig="ev"></div>
<div class="fig-cap">Figure 1 — Expected payoffs of player 1's two rows as a function of the probability \(q\) with which player 2 plays their first column, in the game of chicken. The two lines cross at \(q^*\): it is the only value of \(q\) for which player 1 agrees to mix.</div>

<div class="dossier-title" id="s3">3. The matching pennies example</div>
<p>In matching pennies, player 1 wins 1 if the coins match, player 2 wins 1 otherwise. There is no pure-strategy equilibrium. For player 1 to be indifferent, we need \(q-(1-q)=-q+(1-q)\), that is \(q^*=\frac12\); by symmetry, \(p^*=\frac12\). In equilibrium, each plays heads or tails with probability \(\frac12\), and each has a zero expected payoff. In chicken, the mixed equilibrium adds to the two pure ones; it is symmetric, and the crash happens with positive probability.</p>

<div class="dossier-title" id="s4">4. Best-response correspondences</div>
<p>Player 1's best response to \(q\) is \(p=1\) if their first row is better, \(p=0\) if the second is, and any \(p\in[0,1]\) in case of a tie, that is at \(q=q^*\). Its graph in the square \([0,1]^2\) is a Z-shaped broken line. Player 2's is drawn likewise. The Nash equilibria, pure and mixed, are exactly the intersection points of the two correspondences.</p>
<div class="ifig" data-fig="brc"></div>
<div class="fig-cap">Figure 2 — Best-response correspondences and equilibria (red dots) of four classic games. Matching pennies: a single intersection, mixed. Chicken and battle of the sexes: three intersections, two pure in the corners and one mixed inside. Prisoner's dilemma: a single one, pure, since each player has a dominant strategy.</div>

<div class="dossier-title" id="s5">5. Nash's theorem</div>
<p>Nash (1950) proved that every finite game, with finitely many players and pure strategies, has at least one equilibrium in mixed strategies, pure strategies being special cases. In a generic \(2\times 2\) game, the number of equilibria is odd: one or three. A mixed equilibrium is always checked the same way: each strategy played with positive probability must give the same expected payoff, and no unplayed strategy may give more.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Mixed strategy: a probability distribution over pure strategies; expected payoff linear in each probability.</li>
<li>Indifference: a player's probabilities make the other indifferent between the strategies they mix; \(q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\).</li>
<li>Equilibria are the intersections of the best-response correspondences.</li>
<li>Every finite game has at least one Nash equilibrium, possibly mixed.</li>
</ul>`;

/* ---------- figures ---------- */
const J4_G = {
  mp: { A: [[1, -1], [-1, 1]], B: [[-1, 1], [1, -1]], fr: [['Pile', 'Face'], ['Pile', 'Face']], en: [['Heads', 'Tails'], ['Heads', 'Tails']] },
  chicken: { A: [[0, -1], [1, -10]], B: [[0, 1], [-1, -10]], fr: [['Dévier', 'Continuer'], ['Dévier', 'Continuer']], en: [['Swerve', 'Straight'], ['Swerve', 'Straight']] },
  bos: { A: [[2, 0], [0, 1]], B: [[1, 0], [0, 2]], fr: [['Opéra', 'Football'], ['Opéra', 'Football']], en: [['Opera', 'Football'], ['Opera', 'Football']] },
  pd: { A: [[3, 0], [5, 1]], B: [[3, 5], [0, 1]], fr: [['Coopérer', 'Dénoncer'], ['Coopérer', 'Dénoncer']], en: [['Cooperate', 'Denounce'], ['Cooperate', 'Denounce']] }
};
I18N.fr.f = { game: 'Jeu', gmp: 'Pile ou face', gchicken: 'Poule mouillée', gbos: 'Bataille des sexes', gpd: 'Dilemme du prisonnier', q: 'Probabilité q', e1: 'gain espéré de « Dévier »', e2: 'gain espéré de « Continuer »', evAria: 'Gains espérés en fonction de q',
  evRead: (q, e, qs) => `Pour <i>q</i> = ${fmtT(q, 2)} : « Dévier » rapporte <span class="v">${fmt(e[0], 2)}</span>, « Continuer » <span class="v">${fmt(e[1], 2)}</span> ; ` + (Math.abs(e[0] - e[1]) < 1e-9 ? 'indifférence.' : `meilleure réponse : ${e[0] > e[1] ? 'dévier' : 'continuer'}.`) + ` Indifférence en <i>q</i>* = <span class="v">${fmt(qs, 3)}</span>.`,
  brRead: (M) => M.ok ? `Équilibre mixte : <i>p</i>* = <span class="v">${fmt(M.p, 3)}</span>, <i>q</i>* = <span class="v">${fmt(M.q, 3)}</span>` : 'Pas d\'équilibre strictement mixte.' };
I18N.en.f = { game: 'Game', gmp: 'Matching pennies', gchicken: 'Chicken', gbos: 'Battle of the sexes', gpd: 'Prisoner\'s dilemma', q: 'Probability q', e1: 'expected payoff of "Swerve"', e2: 'expected payoff of "Straight"', evAria: 'Expected payoffs as a function of q',
  evRead: (q, e, qs) => `For <i>q</i> = ${fmtT(q, 2)}: "Swerve" pays <span class="v">${fmt(e[0], 2)}</span>, "Straight" <span class="v">${fmt(e[1], 2)}</span>; ` + (Math.abs(e[0] - e[1]) < 1e-9 ? 'indifference.' : `best response: ${e[0] > e[1] ? 'swerve' : 'go straight'}.`) + ` Indifference at <i>q</i>* = <span class="v">${fmt(qs, 3)}</span>.`,
  brRead: (M) => M.ok ? `Mixed equilibrium: <i>p</i>* = <span class="v">${fmt(M.p, 3)}</span>, <i>q</i>* = <span class="v">${fmt(M.q, 3)}</span>` : 'No strictly mixed equilibrium.' };
FIGS.ev = {
  state: { q: 0.5 },
  controls: L => [{ key: 'q', label: L.f.q, min: 0, max: 1, step: 0.05, fmt: v => fmtT(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, A = J4_G.chicken.A, M = j4mix(A, J4_G.chicken.B), e = j4E1(A, s.q);
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 1, y0: -10.5, y1: 1.5, mt: 26, mb: 42 });
    G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: [-10, -8, -6, -4, -2, 0], xl: 'q', xf: v => fmtT(v, 2), yf: v => String(v), xAxisAt: 0 });
    G.line([[0, A[0][1]], [1, A[0][0]]], { c: COL.s1, w: 2.4 }); G.line([[0, A[1][1]], [1, A[1][0]]], { c: COL.s2, w: 2.4 });
    G.seg(M.q, -10.5, M.q, j4E1(A, M.q)[0], { c: COL.s3, w: 1.2, dash: '4 3' }); G.dot(M.q, j4E1(A, M.q)[0], { c: COL.s3, r: 6 });
    G.seg(s.q, -10.5, s.q, 1.5, { c: GREY, w: 1, dash: '2 3' });
    G.legend([{ c: COL.s1, t: L.e1 }, { c: COL.s2, t: L.e2 }], G.ml + 8, 16);
    return { svg: G.svg(L.evAria), read: L.evRead(s.q, e, M.q) };
  }
};
FIGS.brc = {
  state: { g: 'chicken' },
  controls: L => [{ key: 'g', type: 'select', label: L.f.game, options: ['mp', 'chicken', 'bos', 'pd'].map(k => ({ v: k, t: L.f['g' + k] })) }],
  draw: function (s, lang) { const L = I18N[lang].f, g = J4_G[s.g]; return { svg: j4brc(g.A, g.B, g[lang], lang), read: L.brRead(j4mix(g.A, g.B)) }; }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  /* jeu A : contrôleur fiscal (ligne) et contribuable (colonne), pas d'équilibre pur */
  for (;;) {
    D.A = [[rint(1, 9), rint(0, 9)], [rint(0, 9), rint(1, 9)]]; D.B = [[rint(0, 9), rint(0, 9)], [rint(0, 9), rint(0, 9)]];
    if (D.A[0][0] === D.A[1][0] || D.A[0][1] === D.A[1][1] || D.B[0][0] === D.B[0][1] || D.B[1][0] === D.B[1][1]) continue;
    if (jxBR(D.A, D.B).ne.length) continue;
    D.M = j4mix(D.A, D.B);
    if (!D.M.ok) continue;
    const den1 = D.A[0][0] - D.A[0][1] - D.A[1][0] + D.A[1][1], den2 = D.B[0][0] - D.B[1][0] - D.B[0][1] + D.B[1][1];
    if (Math.abs(den1) < 2 || Math.abs(den2) < 2) continue;
    break;
  }
  D.U1 = j4E1(D.A, D.M.q)[0]; D.U2 = j4E2(D.B, D.M.p)[0];
  /* jeu B : poule mouillée symétrique */
  for (;;) { D.w = rint(3, 8); D.t = rint(1, 5); D.l = rint(-2, 2); D.k = rint(4, 12); if (D.w > D.t && D.t > D.l && D.l > -D.k) break; }
  D.CA = [[D.t, D.l], [D.w, -D.k]]; D.CB = [[D.t, D.w], [D.l, -D.k]];
  D.CM = j4mix(D.CA, D.CB);
  D.crash = (1 - D.CM.p) * (1 - D.CM.q);
  D.CU = j4E1(D.CA, D.CM.q)[0];
  return D;
};
const J4L = { fr: { r: ['Contrôler', 'Ne pas contrôler'], c: ['Frauder', 'Déclarer'], ch: ['Dévier', 'Continuer'] }, en: { r: ['Inspect', 'Not inspect'], c: ['Cheat', 'Declare'], ch: ['Swerve', 'Straight'] } };
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J4L.fr;
  return String.raw`<div class="context-block">Les deux jeux sont indépendants. Dans chaque case, le premier nombre est le gain du joueur en ligne, le second celui du joueur en colonne.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Jeu A — Contrôle fiscal.</strong> Un contrôleur fiscal (en ligne) choisit de contrôler ou non un contribuable (en colonne), qui choisit simultanément de frauder ou de déclarer honnêtement. Le contrôleur joue « contrôler » avec probabilité \(p\), le contribuable « frauder » avec probabilité \(q\).
${jxTable(D.A, D.B, L.r, L.c, 'C \\ F')}<ol class="sub-list"><li>Montrez que ce jeu n'a pas d'équilibre de Nash en stratégies pures.</li><li>Déterminez l'équilibre en stratégies mixtes par le principe d'indifférence, puis les gains espérés à l'équilibre.</li><li>Tracez les correspondances de meilleure réponse et vérifiez graphiquement l'équilibre.</li></ol></div></li>
<li><div class="q-text"><strong>Jeu B — La poule mouillée.</strong> Deux conducteurs foncent l'un vers l'autre et choisissent simultanément de dévier ou de continuer.
${jxTable(D.CA, D.CB, L.ch, L.ch, '1 \\ 2')}<ol class="sub-list"><li>Déterminez tous les équilibres de Nash, purs et mixtes. Quelle est, à l'équilibre mixte, la probabilité d'accident ?</li><li>Tracez les correspondances de meilleure réponse. Comment évolue la probabilité de continuer à l'équilibre mixte si le coût de l'accident augmente ?</li></ol></div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J4L.en;
  return String.raw`<div class="context-block">The two games are independent. In each cell, the first number is the row player's payoff, the second the column player's.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Game A — Tax inspection.</strong> A tax inspector (row) chooses whether to inspect a taxpayer (column), who simultaneously chooses to cheat or to declare honestly. The inspector plays "inspect" with probability \(p\), the taxpayer "cheat" with probability \(q\).
${jxTable(D.A, D.B, L.r, L.c, 'I \\ T')}<ol class="sub-list"><li>Show that this game has no pure-strategy Nash equilibrium.</li><li>Determine the mixed-strategy equilibrium using the indifference principle, then the expected payoffs in equilibrium.</li><li>Draw the best-response correspondences and check the equilibrium graphically.</li></ol></div></li>
<li><div class="q-text"><strong>Game B — Chicken.</strong> Two drivers race towards each other and simultaneously choose to swerve or go straight.
${jxTable(D.CA, D.CB, L.ch, L.ch, '1 \\ 2')}<ol class="sub-list"><li>Determine all Nash equilibria, pure and mixed. In the mixed equilibrium, what is the probability of a crash?</li><li>Draw the best-response correspondences. How does the probability of going straight in the mixed equilibrium change if the cost of a crash rises?</li></ol></div></li>
</ol></div>`;
});
function j4sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J4L[lang], A = D.A, B = D.B, M = D.M, n4 = x => texT(x, 4);
  const bc = j => { const i = A[0][j] > A[1][j] ? 0 : 1; return `${T_(['face à', 'against'])} « ${L.c[j]} », ${T_(['le contrôleur obtient', 'the inspector gets'])} ${A[0][j]} ${T_(['en contrôlant et', 'by inspecting and'])} ${A[1][j]} ${T_(['sinon : il préfère', 'otherwise: they prefer'])} « ${L.r[i]} »`; };
  const br = i => { const j = B[i][0] > B[i][1] ? 0 : 1; return `${T_(['face à', 'against'])} « ${L.r[i]} », ${T_(['le contribuable obtient', 'the taxpayer gets'])} ${B[i][0]} ${T_(['en fraudant et', 'by cheating and'])} ${B[i][1]} ${T_(['en déclarant : il préfère', 'by declaring: they prefer'])} « ${L.c[j]} »`; };
  const den1 = A[0][0] - A[0][1] - A[1][0] + A[1][1], den2 = B[0][0] - B[1][0] - B[0][1] + B[1][1];
  const t = D.t, l = D.l, w = D.w, k = D.k, CM = D.CM, ch = L.ch;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['On cherche les meilleures réponses de chaque joueur :', 'We look for each player\'s best responses:'])} ${bc(0)} ; ${bc(1)} ; ${br(0)} ; ${br(1)}. ${T_(['Les meilleures réponses forment un cycle : aucune case n\'a ses deux gains soulignés, il n\'y a donc pas d\'équilibre de Nash en stratégies pures. Chacun veut prendre l\'autre par surprise : il faut être imprévisible.', 'The best responses form a cycle: no cell has both payoffs underlined, so there is no pure-strategy Nash equilibrium. Each wants to catch the other by surprise: one must be unpredictable.'])}</p>
  <div class="sol-fig">${jxMatrixSVG(A, B, { rows: L.r, cols: L.c, p1: T_(['Contrôleur', 'Inspector']), p2: T_(['Contribuable', 'Taxpayer']), br: true, ne: true, cw: 130, aria: 'A' })}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['À l\'équilibre mixte, le contribuable choisit', 'In the mixed equilibrium, the taxpayer chooses'])} \(q\) ${T_(['de façon que le contrôleur soit indifférent entre ses deux stratégies. Les gains espérés du contrôleur sont :', 'so that the inspector is indifferent between their two strategies. The inspector\'s expected payoffs are:'])}
  \[\begin{aligned}E(\text{${L.r[0]}})&amp;=${A[0][0]}\,q+${A[0][1]}\,(1-q)\\E(\text{${L.r[1]}})&amp;=${A[1][0]}\,q+${A[1][1]}\,(1-q)\end{aligned}\]
  ${T_(['En les égalisant :', 'Equating them:'])}
  \[${A[0][0]}\,q+${A[0][1]}\,(1-q)=${A[1][0]}\,q+${A[1][1]}\,(1-q)\iff q^*=\frac{${A[1][1]}-${A[0][1]}}{${den1}}=${fqa(M.q)}\]
  ${T_(['De même, le contrôleur choisit', 'Likewise, the inspector chooses'])} \(p\) ${T_(['de façon que le contribuable soit indifférent entre frauder et déclarer :', 'so that the taxpayer is indifferent between cheating and declaring:'])}
  \[${B[0][0]}\,p+${B[1][0]}\,(1-p)=${B[0][1]}\,p+${B[1][1]}\,(1-p)\iff p^*=\frac{${B[1][1]}-${B[1][0]}}{${den2}}=${fqa(M.p)}\]
  ${T_(['Les deux probabilités sont comprises strictement entre 0 et 1 : l\'équilibre est bien strictement mixte. On en déduit les gains espérés en reportant', 'Both probabilities lie strictly between 0 and 1: the equilibrium is indeed strictly mixed. The expected payoffs follow by substituting'])} \(q^*\) ${T_(['dans le gain d\'une ligne quelconque du contrôleur, et', 'into the payoff of either of the inspector\'s rows, and'])} \(p^*\) ${T_(['dans celui d\'une colonne quelconque du contribuable :', 'into that of either of the taxpayer\'s columns:'])} \(U_C^*=${A[0][0]}\times ${n4(M.q)}+${A[0][1]}\times ${n4(1 - M.q)}=${fqa(D.U1)}\) ${T_(['et', 'and'])} \(U_F^*=${B[0][0]}\times ${n4(M.p)}+${B[1][0]}\times ${n4(1 - M.p)}=${fqa(D.U2)}\). ${T_(['La probabilité de fraude ne dépend que des gains du contrôleur : rendre les contrôles moins coûteux ne réduit pas la fraude à l\'équilibre, mais la fréquence des contrôles.', 'The probability of cheating only depends on the inspector\'s payoffs: making inspections cheaper does not reduce cheating in equilibrium, but the frequency of inspections.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La meilleure réponse du contrôleur est', 'The inspector\'s best response is'])} \(p=1\) ${T_(['ou', 'or'])} \(p=0\) ${T_(['selon que', 'depending on whether'])} \(q\) ${T_(['est d\'un côté ou de l\'autre de', 'is on one side or the other of'])} \(q^*\), ${T_(['et tout', 'and any'])} \(p\) ${T_(['en', 'at'])} \(q=q^*\) ; ${T_(['de même pour le contribuable autour de', 'likewise for the taxpayer around'])} \(p^*\). ${T_(['Les deux correspondances ne se coupent qu\'en un point, à l\'intérieur du carré :', 'The two correspondences only cross at one point, inside the square:'])} \((q^*\,;\,p^*)=(${n4(M.q)}\,;\,${n4(M.p)})\).</p>
  <div class="sol-fig">${j4brc(A, B, [L.r, L.c], lang, 420)}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si l\'autre dévie, continuer rapporte', 'If the other swerves, going straight pays'])} \(${w}\) ${T_(['contre', 'against'])} \(${t}\) ; ${T_(['s\'il continue, dévier rapporte', 'if they go straight, swerving pays'])} \(${l}\) ${T_(['contre', 'against'])} \(${-k}\). ${T_(['Les équilibres purs sont donc', 'The pure equilibria are therefore'])} (${ch[1]}, ${ch[0]}) ${T_(['et', 'and'])} (${ch[0]}, ${ch[1]}). ${T_(['Pour l\'équilibre mixte, notons', 'For the mixed equilibrium, let'])} \(q\) ${T_(['la probabilité que le conducteur 2 dévie ; le conducteur 1 est indifférent si :', 'be the probability that driver 2 swerves; driver 1 is indifferent if:'])}
  \[${t}\,q+${l < 0 ? '(' + l + ')' : l}\,(1-q)=${w}\,q-${k}\,(1-q)\iff q^*=\frac{${-k}-${l < 0 ? '(' + l + ')' : l}}{${t}-${l < 0 ? '(' + l + ')' : l}-${w}-${k}}=${fqa(CM.q)}\]
  ${T_(['Par symétrie,', 'By symmetry,'])} \(p^*=${fqa(CM.p)}\). ${T_(['Chacun continue avec probabilité', 'Each goes straight with probability'])} \(1-q^*=${fqa(1 - CM.q)}\). ${T_(['Les tirages étant indépendants, l\'accident, qui se produit quand les deux continuent, a lieu avec probabilité', 'Draws being independent, a crash, which happens when both go straight, occurs with probability'])} \((1-p^*)(1-q^*)=${fqa(D.crash)}\). ${T_(['Le gain espéré de chacun est', 'Each one\'s expected payoff is'])} \(${n4(D.CU)}\), ${T_(['inférieur à celui de la coopération mutuelle', 'below that of mutual swerving'])} (${t}).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les correspondances se coupent en trois points : les deux coins des équilibres purs et le point intérieur de l\'équilibre mixte.', 'The correspondences cross at three points: the two corners of the pure equilibria and the interior point of the mixed equilibrium.'])}</p>
  <div class="sol-fig">${j4brc(D.CA, D.CB, [ch, ch], lang, 420)}</div>
  <p>${T_(['Si le coût de l\'accident', 'If the cost of a crash'])} \(k\) ${T_(['augmente, la probabilité de dévier', 'rises, the probability of swerving'])} \(q^*=\frac{k+${l}}{k+${l}+${w}-${t}}\) ${T_(['se rapproche de 1 : chacun continue moins souvent, ce qui maintient l\'autre indifférent malgré le danger accru. La probabilité d\'accident', 'approaches 1: each goes straight less often, which keeps the other indifferent despite the greater danger. The probability of a crash'])} \((1-q^*)^2\) ${T_(['diminue.', 'falls.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean(regroupSol(j4sol(D, 'fr'), ['Jeu A — Contrôle fiscal', 'Jeu B — La poule mouillée'], [3, 2]));
I18N.en.sol = D => fracClean(regroupSol(j4sol(D, 'en'), ['Game A — Tax inspection', 'Game B — Chicken'], [3, 2]));