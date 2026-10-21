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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 5 – Jeux séquentiels', 'k-h1': 'Jeux séquentiels et induction à rebours', 'k-coursetitle': 'Forme extensive, stratégies conditionnelles, menaces non crédibles et équilibre parfait en sous-jeux', 'k-extitle': 'Forme extensive, forme normale et équilibre parfait', 'k-soltitle': 'Forme extensive, forme normale et équilibre parfait' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 5 – Sequential games', 'k-h1': 'Sequential games and backward induction', 'k-coursetitle': 'Extensive form, contingent strategies, non-credible threats and subgame perfect equilibrium', 'k-extitle': 'Extensive form, normal form and perfect equilibrium', 'k-soltitle': 'Extensive form, normal form and perfect equilibrium' });

/* ---------- jeu à deux étapes : 1 choisit H ou B, 2 observe et choisit g ou d ---------- */
/* P[k][m] : gains (u1, u2) après l'action k du joueur 1 et l'action m du joueur 2 */
function j5tree(P, L) {
  return { pl: 1, ch: [0, 1].map(k => ({ a: L.a1[k], n: { pl: 2, ch: [0, 1].map(m => ({ a: L.a2[m], n: { u: P[k][m] } })) } })) };
}
/* forme normale : stratégies du joueur 2 = (action après H, action après B) */
function j5normal(P) {
  const S2 = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const U1 = [0, 1].map(k => S2.map(s => P[k][s[k]][0])), U2 = [0, 1].map(k => S2.map(s => P[k][s[k]][1]));
  return { S2: S2, U1: U1, U2: U2 };
}
const J5_EX = [[[3, 1], [1, 0]], [[2, 3], [0, 2]]];
const J5L = { fr: { a1: ['H', 'B'], a2: ['g', 'd'], p1: 'Joueur 1', p2: 'Joueur 2' }, en: { a1: ['U', 'D'], a2: ['l', 'r'], p1: 'Player 1', p2: 'Player 2' } };
const j5s2 = (s, L) => `(${L.a2[s[0]]}, ${L.a2[s[1]]})`;

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez représenter un jeu séquentiel par un arbre, écrire les stratégies d'un joueur comme des plans d'action complets, passer de la forme extensive à la forme normale, trouver les équilibres de Nash, puis l'équilibre parfait en sous-jeux par induction à rebours, et repérer les menaces non crédibles.<br><br>
<strong>Pourquoi ?</strong> Dans beaucoup d'interactions, les joueurs agissent l'un après l'autre et observent les choix passés : leader et suiveur sur un marché, négociation, entrée d'un concurrent. L'ordre de jeu change l'issue, et certaines menaces, crédibles en apparence, ne seraient jamais exécutées.<br><br>
<strong>Prérequis.</strong> Équilibre de Nash (Théorie des jeux 3), Stackelberg (Économie industrielle 4).
</div>
<p class="toc">Sommaire : <a href="#s1">1. La forme extensive</a> · <a href="#s2">2. Stratégies</a> · <a href="#s3">3. Forme normale et équilibres de Nash</a> · <a href="#s4">4. Menaces non crédibles</a> · <a href="#s5">5. Induction à rebours</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La forme extensive</div>
<p>Un jeu séquentiel se représente par un <em>arbre</em>. Chaque nœud de décision indique le joueur qui doit jouer ; chaque branche qui en part est une action possible ; chaque feuille, au bout d'un chemin, porte les gains des joueurs. On suppose ici l'<em>information parfaite</em> : chaque joueur, au moment de jouer, connaît toutes les actions déjà choisies. Dans l'exemple ci-dessous, le joueur 1 choisit H ou B, puis le joueur 2, qui a observé ce choix, choisit g ou d.</p>
<div class="ifig" data-fig="tree"></div>
<div class="fig-cap">Figure 1 — Arbre du jeu. En activant l'induction à rebours, on colore à chaque nœud du joueur 2 l'action qu'il choisit, puis le choix du joueur 1 qui l'anticipe ; le chemin épais est l'issue de l'équilibre parfait en sous-jeux.</div>

<div class="dossier-title" id="s2">2. Stratégies : des plans complets</div>
<p>Dans un jeu séquentiel, une <em>stratégie</em> est un plan d'action complet : elle indique ce que le joueur ferait à chacun de ses nœuds de décision, y compris ceux qui ne seront pas atteints. Le joueur 2 a ici deux nœuds, avec deux actions à chacun : il a donc \(2\times 2=4\) stratégies, notées (action après H, action après B) : (g, g), (g, d), (d, g) et (d, d). Le joueur 1, qui n'a qu'un nœud, a deux stratégies. Cette distinction entre action et stratégie est essentielle pour comprendre les menaces.</p>

<div class="dossier-title" id="s3">3. Forme normale et équilibres de Nash</div>
<p>À chaque couple de stratégies correspond un chemin dans l'arbre et donc des gains : on peut écrire le jeu sous forme normale, ici une matrice \(2\times 4\). On y cherche les équilibres de Nash par la méthode des meilleures réponses. Un jeu séquentiel a souvent plusieurs équilibres de Nash, dont certains reposent sur des actions que le joueur n'aurait aucun intérêt à jouer si le nœud correspondant était atteint.</p>
<div class="ifig" data-fig="nf"></div>
<div class="fig-cap">Figure 2 — Forme normale du jeu de la figure 1. Trois cases sont des équilibres de Nash. L'équilibre (B, (d, g)) repose sur la menace du joueur 2 de jouer d après H, qui lui rapporterait moins que g : elle n'est pas crédible.</div>

<div class="dossier-title" id="s4">4. Menaces non crédibles</div>
<p>Dans l'équilibre (B, (d, g)), le joueur 2 « menace » de répondre d à H, ce qui donnerait 1 au joueur 1 ; celui-ci préfère alors jouer B. Cette menace ne lui coûte rien, puisque le nœud après H n'est pas atteint. Mais si le joueur 1 jouait H, le joueur 2 gagnerait 1 en jouant g et 0 en jouant d : il ne mettrait pas sa menace à exécution. Le joueur 1, qui le sait, ne devrait pas y croire. Un équilibre de Nash peut donc reposer sur des comportements irrationnels hors du chemin d'équilibre.</p>

<div class="dossier-title" id="s5">5. Induction à rebours et équilibre parfait</div>
<p>Pour éliminer ces menaces, Selten (1965) exige que les stratégies forment un équilibre de Nash dans chaque <em>sous-jeu</em>, c'est-à-dire dans chaque partie de l'arbre qui commence à un nœud et contient tout ce qui le suit : c'est l'<em>équilibre parfait en sous-jeux</em>. Dans un jeu fini à information parfaite, on le trouve par <em>induction à rebours</em> : on part des derniers nœuds, on y choisit l'action optimale du joueur concerné, on remplace le nœud par les gains obtenus, et l'on remonte jusqu'à la racine. Dans l'exemple, le joueur 2 choisit g après H (1 &gt; 0) et g après B (3 &gt; 2) ; le joueur 1, qui l'anticipe, compare 3 et 2 et joue H. L'équilibre parfait est (H, (g, g)) ; c'est l'un des trois équilibres de Nash, le seul sans menace non crédible.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Forme extensive : arbre, nœuds de décision, actions, gains aux feuilles ; information parfaite si chaque joueur observe les actions passées.</li>
<li>Une stratégie précise une action à chaque nœud du joueur, même non atteint.</li>
<li>Un équilibre de Nash peut reposer sur des menaces non crédibles hors du chemin d'équilibre.</li>
<li>Équilibre parfait en sous-jeux : équilibre de Nash dans chaque sous-jeu ; on le trouve par induction à rebours.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can represent a sequential game by a tree, write a player's strategies as complete plans of action, move from the extensive form to the normal form, find the Nash equilibria, then the subgame perfect equilibrium by backward induction, and spot non-credible threats.<br><br>
<strong>Why?</strong> In many interactions, players act one after the other and observe past choices: leader and follower in a market, bargaining, a rival's entry. The order of play changes the outcome, and some threats, credible in appearance, would never be carried out.<br><br>
<strong>Prerequisites.</strong> Nash equilibrium (Game theory 3), Stackelberg (Industrial economics 4).
</div>
<p class="toc">Contents: <a href="#s1">1. The extensive form</a> · <a href="#s2">2. Strategies</a> · <a href="#s3">3. Normal form and Nash equilibria</a> · <a href="#s4">4. Non-credible threats</a> · <a href="#s5">5. Backward induction</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The extensive form</div>
<p>A sequential game is represented by a <em>tree</em>. Each decision node shows the player who must move; each branch leaving it is a possible action; each leaf, at the end of a path, carries the players' payoffs. We assume here <em>perfect information</em>: each player, when moving, knows all actions already chosen. In the example below, player 1 chooses U or D, then player 2, having observed this choice, chooses l or r.</p>
<div class="ifig" data-fig="tree"></div>
<div class="fig-cap">Figure 1 — Game tree. With backward induction switched on, each of player 2's nodes shows the action they choose, then player 1's choice anticipating it; the thick path is the outcome of the subgame perfect equilibrium.</div>

<div class="dossier-title" id="s2">2. Strategies: complete plans</div>
<p>In a sequential game, a <em>strategy</em> is a complete plan of action: it says what the player would do at each of their decision nodes, including those that will not be reached. Player 2 has two nodes here, with two actions at each: they therefore have \(2\times 2=4\) strategies, written (action after U, action after D): (l, l), (l, r), (r, l) and (r, r). Player 1, with a single node, has two strategies. This distinction between action and strategy is essential to understand threats.</p>

<div class="dossier-title" id="s3">3. Normal form and Nash equilibria</div>
<p>Each pair of strategies determines a path in the tree and hence payoffs: the game can be written in normal form, here a \(2\times 4\) matrix. Nash equilibria are found there with the best-response method. A sequential game often has several Nash equilibria, some of which rely on actions the player would have no interest in playing if the corresponding node were reached.</p>
<div class="ifig" data-fig="nf"></div>
<div class="fig-cap">Figure 2 — Normal form of the figure 1 game. Three cells are Nash equilibria. The equilibrium (D, (r, l)) relies on player 2's threat to play r after U, which would pay them less than l: it is not credible.</div>

<div class="dossier-title" id="s4">4. Non-credible threats</div>
<p>In the equilibrium (D, (r, l)), player 2 "threatens" to answer U with r, which would give player 1 a payoff of 1; player 1 then prefers to play D. This threat costs player 2 nothing, since the node after U is not reached. But if player 1 played U, player 2 would earn 1 by playing l and 0 by playing r: they would not carry out the threat. Player 1, knowing this, should not believe it. A Nash equilibrium may thus rely on irrational behaviour off the equilibrium path.</p>

<div class="dossier-title" id="s5">5. Backward induction and perfect equilibrium</div>
<p>To rule out such threats, Selten (1965) requires strategies to form a Nash equilibrium in every <em>subgame</em>, that is in every part of the tree that starts at a node and contains everything that follows it: this is the <em>subgame perfect equilibrium</em>. In a finite game of perfect information, it is found by <em>backward induction</em>: start from the last nodes, choose there the optimal action of the player concerned, replace the node by the payoffs obtained, and move up to the root. In the example, player 2 chooses l after U (1 &gt; 0) and l after D (3 &gt; 2); player 1, anticipating this, compares 3 and 2 and plays U. The perfect equilibrium is (U, (l, l)); it is one of the three Nash equilibria, the only one without a non-credible threat.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Extensive form: tree, decision nodes, actions, payoffs at the leaves; perfect information if each player observes past actions.</li>
<li>A strategy specifies an action at each of the player's nodes, even unreached ones.</li>
<li>A Nash equilibrium may rely on non-credible threats off the equilibrium path.</li>
<li>Subgame perfect equilibrium: a Nash equilibrium in every subgame; found by backward induction.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { bi: 'Induction à rebours', off: 'masquée', on: 'affichée', trAria: 'Arbre du jeu séquentiel', trRead: on => on ? 'Le joueur 2 joue g après H et g après B ; le joueur 1 joue donc H. Équilibre parfait : (H, (g, g)), gains (3 ; 1).' : 'Activez l\'induction à rebours pour voir les choix optimaux.', nfAria: 'Forme normale du jeu séquentiel', nfRead: 'Équilibres de Nash : (H, (g, g)), (H, (g, d)) et (B, (d, g)).' };
I18N.en.f = { bi: 'Backward induction', off: 'hidden', on: 'shown', trAria: 'Sequential game tree', trRead: on => on ? 'Player 2 plays l after U and l after D; player 1 therefore plays U. Perfect equilibrium: (U, (l, l)), payoffs (3; 1).' : 'Switch on backward induction to see the optimal choices.', nfAria: 'Normal form of the sequential game', nfRead: 'Nash equilibria: (U, (l, l)), (U, (l, r)) and (D, (r, l)).' };
FIGS.tree = {
  state: { bi: 'off' },
  controls: L => [{ key: 'bi', type: 'select', label: L.f.bi, options: [{ v: 'off', t: L.f.off }, { v: 'on', t: L.f.on }] }],
  draw: function (s, lang) { const L = I18N[lang].f, T = j5tree(J5_EX, J5L[lang]); jxBack(T); return { svg: jxTreeSVG(T, { bi: s.bi === 'on', aria: L.trAria, lw: 120 }), read: L.trRead(s.bi === 'on') }; }
};
FIGS.nf = {
  state: {}, controls: L => [],
  draw: function (s, lang) { const L = I18N[lang].f, N = j5normal(J5_EX), JL = J5L[lang]; return { svg: jxMatrixSVG(N.U1, N.U2, { rows: JL.a1, cols: N.S2.map(x => j5s2(x, JL)), p1: JL.p1, p2: JL.p2, br: true, ne: true, cw: 96, aria: L.nfAria }), read: L.nfRead }; }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.P = [0, 1].map(() => [0, 1].map(() => [rint(0, 9), rint(0, 9)]));
    const P = D.P;
    if (P[0][0][1] === P[0][1][1] || P[1][0][1] === P[1][1][1]) continue;           /* le joueur 2 n'est jamais indifférent */
    D.T = j5tree(P, J5L.fr); jxBack(D.T);
    const b2 = [D.T.ch[0].n.best, D.T.ch[1].n.best], v = [P[0][b2[0]][0], P[1][b2[1]][0]];
    if (v[0] === v[1]) continue;
    D.b2 = b2; D.b1 = v[0] > v[1] ? 0 : 1;
    D.N = j5normal(P); D.NE = jxBR(D.N.U1, D.N.U2).ne;
    /* au moins un équilibre de Nash dont l'issue diffère de l'équilibre parfait */
    D.bad = D.NE.filter(e => e[0] !== D.b1);
    if (!D.bad.length) continue;
    if (D.N.U1.some(r => false)) continue;
    /* version simultanée : le joueur 2 ne voit pas le choix du joueur 1 */
    D.S1 = [0, 1].map(k => [0, 1].map(m => P[k][m][0])); D.S2 = [0, 1].map(k => [0, 1].map(m => P[k][m][1]));
    D.SNE = jxBR(D.S1, D.S2).ne;
    break;
  }
  return D;
};
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const P = D.P;
  return String.raw`<div class="context-block">Le joueur 1 choisit H ou B. Le joueur 2 observe ce choix, puis choisit g ou d. Les gains (joueur 1 ; joueur 2) sont : après (H, g) : \((${P[0][0][0]}\,;\,${P[0][0][1]})\) ; après (H, d) : \((${P[0][1][0]}\,;\,${P[0][1][1]})\) ; après (B, g) : \((${P[1][0][0]}\,;\,${P[1][0][1]})\) ; après (B, d) : \((${P[1][1][0]}\,;\,${P[1][1][1]})\).</div>
<div class="questions"><ol>
<li><div class="q-text">Représentez le jeu sous forme extensive.</div></li>
<li><div class="q-text">Combien de stratégies chaque joueur a-t-il ? Énumérez-les.</div></li>
<li><div class="q-text">Écrivez le jeu sous forme normale et déterminez tous ses équilibres de Nash en stratégies pures.</div></li>
<li><div class="q-text">Déterminez l'équilibre parfait en sous-jeux par induction à rebours. Quels équilibres de Nash reposent sur une menace non crédible ?</div></li>
<li><div class="q-text">On suppose maintenant que le joueur 2 ne peut pas observer le choix du joueur 1 : les deux joueurs choisissent simultanément. Déterminez les équilibres de Nash et comparez.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const P = D.P;
  return String.raw`<div class="context-block">Player 1 chooses U or D. Player 2 observes this choice, then chooses l or r. Payoffs (player 1; player 2) are: after (U, l): \((${P[0][0][0]}\,;\,${P[0][0][1]})\); after (U, r): \((${P[0][1][0]}\,;\,${P[0][1][1]})\); after (D, l): \((${P[1][0][0]}\,;\,${P[1][0][1]})\); after (D, r): \((${P[1][1][0]}\,;\,${P[1][1][1]})\).</div>
<div class="questions"><ol>
<li><div class="q-text">Represent the game in extensive form.</div></li>
<li><div class="q-text">How many strategies does each player have? List them.</div></li>
<li><div class="q-text">Write the game in normal form and determine all its pure-strategy Nash equilibria.</div></li>
<li><div class="q-text">Determine the subgame perfect equilibrium by backward induction. Which Nash equilibria rely on a non-credible threat?</div></li>
<li><div class="q-text">Now assume player 2 cannot observe player 1's choice: both players choose simultaneously. Determine the Nash equilibria and compare.</div></li>
</ol></div>`;
});
function j5sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J5L[lang], P = D.P, N = D.N, b2 = D.b2, b1 = D.b1;
  const T = j5tree(P, L); jxBack(T);
  const a1 = L.a1, a2 = L.a2, NEtxt = D.NE.map(e => `(${a1[e[0]]}, ${j5s2(N.S2[e[1]], L)})`).join(', ');
  const spe = `(${a1[b1]}, ${j5s2(b2, L)})`;
  const badTxt = D.bad.map(e => { const s = N.S2[e[1]], k = 1 - e[0]; return `(${a1[e[0]]}, ${j5s2(s, L)}) : ${T_(['le joueur 2 y prévoit de jouer', 'player 2 plans there to play'])} ${a2[s[k]]} ${T_(['après', 'after'])} ${a1[k]}, ${T_(['ce qui lui rapporterait', 'which would pay them'])} ${P[k][s[k]][1]} ${T_(['au lieu de', 'instead of'])} ${P[k][1 - s[k]][1]}`; }).join(' ; ');
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le joueur 1 joue en premier, à la racine ; le joueur 2 a deux nœuds de décision, un après chaque action du joueur 1, puisqu\'il observe ce choix. Les gains sont inscrits aux feuilles :', 'Player 1 moves first, at the root; player 2 has two decision nodes, one after each of player 1\'s actions, since they observe that choice. Payoffs are written at the leaves:'])}</p>
  <div class="sol-fig">${jxTreeSVG(T, { bi: false, lw: 120, aria: 'tree' })}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le joueur 1 n\'a qu\'un nœud de décision, avec deux actions : il a deux stratégies,', 'Player 1 has a single decision node, with two actions: they have two strategies,'])} ${a1[0]} ${T_(['et', 'and'])} ${a1[1]}. ${T_(['Une stratégie du joueur 2 doit préciser son action à chacun de ses deux nœuds, qu\'il soit atteint ou non : il a donc', 'A strategy of player 2 must specify their action at each of their two nodes, whether reached or not: they therefore have'])} \(2\times 2=4\) ${T_(['stratégies, notées (action après', 'strategies, written (action after'])} ${a1[0]}, ${T_(['action après', 'action after'])} ${a1[1]}) : ${N.S2.map(x => j5s2(x, L)).join(', ')}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Pour chaque couple de stratégies, on suit le chemin correspondant dans l\'arbre : par exemple, si le joueur 1 joue', 'For each pair of strategies, we follow the corresponding path in the tree: for instance, if player 1 plays'])} ${a1[0]} ${T_(['et le joueur 2 joue', 'and player 2 plays'])} ${j5s2(N.S2[1], L)}, ${T_(['seule compte l\'action du joueur 2 après', 'only player 2\'s action after'])} ${a1[0]}, ${T_(['soit', 'matters, that is'])} ${a2[N.S2[1][0]]}, ${T_(['et les gains sont', 'and payoffs are'])} \((${N.U1[0][1]}\,;\,${N.U2[0][1]})\). ${T_(['On obtient la forme normale ci-dessous, où l\'on souligne les meilleures réponses :', 'We obtain the normal form below, where best responses are underlined:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(N.U1, N.U2, { rows: a1, cols: N.S2.map(x => j5s2(x, L)), p1: L.p1, p2: L.p2, br: true, ne: true, cw: 96, aria: 'nf' })}</div>
  <p>${T_(['Les équilibres de Nash en stratégies pures sont les cases dont les deux gains sont soulignés :', 'The pure-strategy Nash equilibria are the cells whose two payoffs are underlined:'])} ${NEtxt}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['On raisonne à rebours. Après', 'We reason backwards. After'])} ${a1[0]}, ${T_(['le joueur 2 obtient', 'player 2 gets'])} ${P[0][0][1]} ${T_(['avec', 'with'])} ${a2[0]} ${T_(['et', 'and'])} ${P[0][1][1]} ${T_(['avec', 'with'])} ${a2[1]} : ${T_(['il joue', 'they play'])} ${a2[b2[0]]}. ${T_(['Après', 'After'])} ${a1[1]}, ${T_(['il obtient', 'they get'])} ${P[1][0][1]} ${T_(['avec', 'with'])} ${a2[0]} ${T_(['et', 'and'])} ${P[1][1][1]} ${T_(['avec', 'with'])} ${a2[1]} : ${T_(['il joue', 'they play'])} ${a2[b2[1]]}. ${T_(['Le joueur 1, qui anticipe ces réponses, obtient', 'Player 1, anticipating these responses, gets'])} ${P[0][b2[0]][0]} ${T_(['avec', 'with'])} ${a1[0]} ${T_(['et', 'and'])} ${P[1][b2[1]][0]} ${T_(['avec', 'with'])} ${a1[1]} : ${T_(['il joue', 'they play'])} ${a1[b1]}. ${T_(['L\'équilibre parfait en sous-jeux est', 'The subgame perfect equilibrium is'])} ${spe}, ${T_(['de gains', 'with payoffs'])} \((${P[b1][b2[b1]][0]}\,;\,${P[b1][b2[b1]][1]})\) :</p>
  <div class="sol-fig">${jxTreeSVG(T, { bi: true, lw: 120, aria: 'bi' })}</div>
  <p>${T_(['Les équilibres de Nash dont l\'issue diffère reposent sur une menace non crédible :', 'The Nash equilibria with a different outcome rely on a non-credible threat:'])} ${badTxt}. ${T_(['Si le nœud était atteint, le joueur 2 ne mettrait pas cette menace à exécution ; un joueur 1 rationnel ne doit donc pas y croire.', 'If the node were reached, player 2 would not carry out this threat; a rational player 1 should therefore not believe it.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Sans observation, le joueur 2 ne peut plus conditionner son action au choix du joueur 1 : chaque joueur n\'a que deux stratégies, et le jeu est la matrice', 'Without observation, player 2 can no longer condition their action on player 1\'s choice: each player has only two strategies, and the game is the'])} \(2\times 2\) ${T_(['suivante :', 'matrix below:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(D.S1, D.S2, { rows: a1, cols: a2, p1: L.p1, p2: L.p2, br: true, ne: true, aria: 'sim' })}</div>
  <p>${D.SNE.length ? T_(['Ses équilibres de Nash en stratégies pures sont', 'Its pure-strategy Nash equilibria are']) + ' ' + D.SNE.map(e => `(${a1[e[0]]}, ${a2[e[1]]})`).join(', ') + '.' : T_(['Il n\'a pas d\'équilibre de Nash en stratégies pures ; il faudrait chercher un équilibre en stratégies mixtes.', 'It has no pure-strategy Nash equilibrium; a mixed-strategy equilibrium would have to be sought.'])} ${T_(['L\'ordre des coups et l\'information changent donc la prédiction : dans le jeu séquentiel, le joueur 1 tire parti du fait que le joueur 2 réagira de façon prévisible à son choix.', 'The order of moves and information therefore change the prediction: in the sequential game, player 1 takes advantage of the fact that player 2 will react predictably to their choice.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j5sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j5sol(D, 'en'))(D));