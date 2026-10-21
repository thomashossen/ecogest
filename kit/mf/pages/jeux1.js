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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 1 – Stratégies dominantes et dilemme du prisonnier', 'k-h1': 'Stratégies dominantes et dilemme du prisonnier', 'k-coursetitle': 'Représenter un jeu, repérer les meilleures réponses et les stratégies dominantes, comprendre pourquoi l\'équilibre peut être inefficace', 'k-extitle': 'Concurrence publicitaire et jeu à stratégie dominante', 'k-soltitle': 'Concurrence publicitaire et jeu à stratégie dominante' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 1 – Dominant strategies and the prisoner\'s dilemma', 'k-h1': 'Dominant strategies and the prisoner\'s dilemma', 'k-coursetitle': 'Representing a game, spotting best responses and dominant strategies, understanding why equilibrium can be inefficient', 'k-extitle': 'Advertising competition and a game with a dominant strategy', 'k-soltitle': 'Advertising competition and a game with a dominant strategy' });

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez écrire un jeu sous forme normale, lire une matrice des gains, déterminer les meilleures réponses de chaque joueur, reconnaître une stratégie strictement dominante, trouver un équilibre en stratégies dominantes et expliquer pourquoi, dans le dilemme du prisonnier, cet équilibre n'est pas un optimum de Pareto.<br><br>
<strong>Pourquoi ?</strong> La théorie des jeux étudie les décisions interdépendantes : le gain de chacun dépend des choix des autres. Concurrence publicitaire, guerre des prix, course aux armements, contribution aux biens publics : le dilemme du prisonnier en est la forme la plus célèbre, et explique pourquoi des acteurs rationnels peuvent tous perdre.<br><br>
<strong>Prérequis.</strong> Aucun ; la page Cartel (économie industrielle 5) en est une application.
</div>
<p class="toc">Sommaire : <a href="#s1">1. La forme normale</a> · <a href="#s2">2. Meilleures réponses</a> · <a href="#s3">3. Stratégies dominantes</a> · <a href="#s4">4. Le dilemme du prisonnier</a> · <a href="#s5">5. Optimalité de Pareto</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Un jeu sous forme normale</div>
<p>Un jeu sous forme normale (ou stratégique) est décrit par trois éléments : les <em>joueurs</em> ; les <em>stratégies</em> dont chacun dispose ; les <em>gains</em> de chaque joueur pour chaque combinaison de stratégies, appelée <em>profil</em>. Les joueurs choisissent simultanément, sans connaître le choix des autres, et l'on suppose que la description du jeu est connue de tous (information complète). Avec deux joueurs, on présente le jeu par une matrice : le joueur 1 choisit la ligne, le joueur 2 la colonne, et chaque case contient le couple (gain du joueur 1 ; gain du joueur 2).</p>

<div class="dossier-title" id="s2">2. Meilleures réponses</div>
<p>La <em>meilleure réponse</em> d'un joueur à une stratégie de son adversaire est la stratégie qui lui rapporte le plus face à celle-ci. Pour la trouver dans une matrice, on fixe la colonne choisie par le joueur 2 et l'on compare, dans cette colonne, les gains du joueur 1 : on souligne le plus élevé. On procède de même, ligne par ligne, pour les gains du joueur 2. Une case où les deux gains sont soulignés correspond à un profil où chacun joue sa meilleure réponse à l'autre : c'est un équilibre de Nash (page Théorie des jeux 3).</p>

<div class="dossier-title" id="s3">3. Stratégies dominantes</div>
<p>Une stratégie \(s_i\) est <em>strictement dominante</em> pour le joueur \(i\) si elle lui rapporte strictement plus que toute autre stratégie, quoi que fassent les autres joueurs :
\[u_i(s_i,s_{-i})&gt;u_i(s_i',s_{-i})\quad\text{pour toute }s_i'\ne s_i\text{ et tout }s_{-i}\]
où \(s_{-i}\) désigne les stratégies des autres joueurs. Elle est <em>faiblement dominante</em> si l'inégalité est large, et stricte pour au moins un \(s_{-i}\). Un joueur rationnel joue sa stratégie strictement dominante s'il en a une : il n'a même pas besoin de deviner ce que feront les autres. Si chaque joueur a une stratégie strictement dominante, le profil formé par ces stratégies est l'<em>équilibre en stratégies dominantes</em> ; il est unique.</p>

<div class="dossier-title" id="s4">4. Le dilemme du prisonnier</div>
<p>Deux suspects, interrogés séparément, peuvent coopérer entre eux (se taire) ou dénoncer l'autre. Notons \(R\) le gain si les deux coopèrent, \(P\) si les deux dénoncent, \(T\) celui du dénonciateur face à un coopérateur et \(S\) celui du coopérateur dénoncé. Le jeu est un dilemme du prisonnier si :
\[T&gt;R&gt;P&gt;S\]
Dénoncer rapporte \(T&gt;R\) si l'autre coopère et \(P&gt;S\) s'il dénonce : c'est une stratégie strictement dominante pour chacun. L'équilibre est donc « dénoncer, dénoncer », qui donne \(P\) à chacun, alors que la coopération mutuelle donnerait \(R&gt;P\). La rationalité individuelle conduit à un résultat collectivement mauvais.</p>
<div class="ifig" data-fig="pd"></div>
<div class="fig-cap">Figure 1 — Un jeu symétrique à deux stratégies, coopérer (C) ou dénoncer (D). Les gains en gras soulignés sont les meilleures réponses ; la case colorée est l'équilibre. Faites varier \(T\), \(R\), \(P\) et \(S\) : tant que \(T&gt;R&gt;P&gt;S\), dénoncer reste dominant et l'équilibre est inefficace ; si \(R&gt;T\), la coopération devient une meilleure réponse.</div>

<div class="dossier-title" id="s5">5. Optimalité de Pareto</div>
<p>Un profil est un <em>optimum de Pareto</em> s'il n'existe aucun autre profil qui améliore le gain d'un joueur sans réduire celui d'un autre. Dans le dilemme du prisonnier, l'équilibre « dénoncer, dénoncer » est dominé au sens de Pareto par « coopérer, coopérer » : les deux joueurs y gagneraient. Les trois autres profils sont des optimums de Pareto. Le plan des gains montre ce résultat : l'équilibre est situé au sud-ouest du point de coopération. La concurrence publicitaire entre deux entreprises en est un exemple : chacune a intérêt à faire de la publicité quoi que fasse l'autre, mais les deux dépenses s'annulent et les deux entreprises gagneraient à s'abstenir.</p>
<div class="ifig" data-fig="plane"></div>
<div class="fig-cap">Figure 2 — Les gains des quatre profils du jeu de la figure 1 dans le plan (gain du joueur 1, gain du joueur 2). L'équilibre (rouge) est dominé au sens de Pareto par la coopération mutuelle : les profils situés au nord-est d'un point le dominent.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Forme normale : joueurs, stratégies, gains ; matrice (gain du joueur 1 ; gain du joueur 2).</li>
<li>Meilleure réponse : on compare les gains d'un joueur en fixant la stratégie de l'autre.</li>
<li>Stratégie strictement dominante : meilleure quoi que fassent les autres ; si chacun en a une, elles forment l'équilibre en stratégies dominantes.</li>
<li>Dilemme du prisonnier (\(T&gt;R&gt;P&gt;S\)) : l'équilibre en stratégies dominantes n'est pas un optimum de Pareto.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can write a game in normal form, read a payoff matrix, determine each player's best responses, recognise a strictly dominant strategy, find an equilibrium in dominant strategies and explain why, in the prisoner's dilemma, this equilibrium is not a Pareto optimum.<br><br>
<strong>Why?</strong> Game theory studies interdependent decisions: each player's payoff depends on the others' choices. Advertising competition, price wars, arms races, contributions to public goods: the prisoner's dilemma is the most famous form, and explains why rational players may all lose.<br><br>
<strong>Prerequisites.</strong> None; the Cartel page (industrial economics 5) is an application.
</div>
<p class="toc">Contents: <a href="#s1">1. Normal form</a> · <a href="#s2">2. Best responses</a> · <a href="#s3">3. Dominant strategies</a> · <a href="#s4">4. The prisoner's dilemma</a> · <a href="#s5">5. Pareto optimality</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. A game in normal form</div>
<p>A game in normal (or strategic) form is described by three elements: the <em>players</em>; the <em>strategies</em> available to each; each player's <em>payoffs</em> for each combination of strategies, called a <em>profile</em>. Players choose simultaneously, without knowing the others' choices, and the description of the game is assumed to be known to all (complete information). With two players, the game is shown as a matrix: player 1 chooses the row, player 2 the column, and each cell contains the pair (player 1's payoff; player 2's payoff).</p>

<div class="dossier-title" id="s2">2. Best responses</div>
<p>A player's <em>best response</em> to a strategy of the opponent is the strategy that pays them most against it. To find it in a matrix, fix the column chosen by player 2 and compare player 1's payoffs in that column: underline the highest. Proceed likewise, row by row, for player 2's payoffs. A cell where both payoffs are underlined corresponds to a profile where each plays a best response to the other: it is a Nash equilibrium (Game theory 3 page).</p>

<div class="dossier-title" id="s3">3. Dominant strategies</div>
<p>A strategy \(s_i\) is <em>strictly dominant</em> for player \(i\) if it pays strictly more than any other strategy, whatever the other players do:
\[u_i(s_i,s_{-i})&gt;u_i(s_i',s_{-i})\quad\text{for every }s_i'\ne s_i\text{ and every }s_{-i}\]
where \(s_{-i}\) denotes the other players' strategies. It is <em>weakly dominant</em> if the inequality is weak, and strict for at least one \(s_{-i}\). A rational player plays a strictly dominant strategy if they have one: they do not even need to guess what the others will do. If each player has a strictly dominant strategy, the profile of these strategies is the <em>equilibrium in dominant strategies</em>; it is unique.</p>

<div class="dossier-title" id="s4">4. The prisoner's dilemma</div>
<p>Two suspects, questioned separately, can cooperate with each other (keep quiet) or denounce the other. Let \(R\) be the payoff if both cooperate, \(P\) if both denounce, \(T\) that of the denouncer facing a cooperator and \(S\) that of the denounced cooperator. The game is a prisoner's dilemma if:
\[T&gt;R&gt;P&gt;S\]
Denouncing pays \(T&gt;R\) if the other cooperates and \(P&gt;S\) if they denounce: it is a strictly dominant strategy for each. The equilibrium is therefore "denounce, denounce", which gives \(P\) to each, whereas mutual cooperation would give \(R&gt;P\). Individual rationality leads to a collectively poor outcome.</p>
<div class="ifig" data-fig="pd"></div>
<div class="fig-cap">Figure 1 — A symmetric game with two strategies, cooperate (C) or denounce (D). Bold underlined payoffs are best responses; the shaded cell is the equilibrium. Vary \(T\), \(R\), \(P\) and \(S\): as long as \(T&gt;R&gt;P&gt;S\), denouncing remains dominant and the equilibrium is inefficient; if \(R&gt;T\), cooperating becomes a best response.</div>

<div class="dossier-title" id="s5">5. Pareto optimality</div>
<p>A profile is a <em>Pareto optimum</em> if no other profile raises one player's payoff without lowering another's. In the prisoner's dilemma, the equilibrium "denounce, denounce" is Pareto-dominated by "cooperate, cooperate": both players would gain. The other three profiles are Pareto optima. The payoff plane shows this: the equilibrium lies south-west of the cooperation point. Advertising competition between two firms is an example: each wants to advertise whatever the other does, but the two expenditures cancel out and both firms would gain by refraining.</p>
<div class="ifig" data-fig="plane"></div>
<div class="fig-cap">Figure 2 — The payoffs of the four profiles of the figure 1 game in the plane (player 1's payoff, player 2's payoff). The equilibrium (red) is Pareto-dominated by mutual cooperation: profiles lying north-east of a point dominate it.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Normal form: players, strategies, payoffs; matrix (player 1's payoff; player 2's payoff).</li>
<li>Best response: compare one player's payoffs holding the other's strategy fixed.</li>
<li>Strictly dominant strategy: best whatever the others do; if each player has one, they form the equilibrium in dominant strategies.</li>
<li>Prisoner's dilemma (\(T&gt;R&gt;P&gt;S\)): the equilibrium in dominant strategies is not a Pareto optimum.</li>
</ul>`;

/* ---------- figures ---------- */
const J1_ST = { T: 5, R: 3, P: 1, S: 0 };
I18N.fr.f = { T: 'T (dénoncer face à C)', R: 'R (coopération mutuelle)', P: 'P (dénonciation mutuelle)', S: 'S (coopérer face à D)', C: 'C', D: 'D', p1: 'Joueur 1', p2: 'Joueur 2', pdAria: 'Matrice du dilemme du prisonnier',
  pdRead: (s, B) => (s.T > s.R && s.R > s.P && s.P > s.S ? 'T > R > P > S : dilemme du prisonnier. ' : 'L\'ordre T > R > P > S n\'est pas respecté. ') + `Équilibre(s) : ${B.ne.map(e => '(' + 'CD'[e[0]] + ', ' + 'CD'[e[1]] + ')').join(' et ') || 'aucun en stratégies pures'}.`,
  u1: 'gain du joueur 1', u2: 'gain du joueur 2', plAria: 'Gains des profils dans le plan', eq: 'équilibre', po: 'optimum de Pareto', dom: 'dominé au sens de Pareto' };
I18N.en.f = { T: 'T (denounce against C)', R: 'R (mutual cooperation)', P: 'P (mutual denunciation)', S: 'S (cooperate against D)', C: 'C', D: 'D', p1: 'Player 1', p2: 'Player 2', pdAria: 'Prisoner\'s dilemma matrix',
  pdRead: (s, B) => (s.T > s.R && s.R > s.P && s.P > s.S ? 'T > R > P > S: prisoner\'s dilemma. ' : 'The order T > R > P > S does not hold. ') + `Equilibrium(a): ${B.ne.map(e => '(' + 'CD'[e[0]] + ', ' + 'CD'[e[1]] + ')').join(' and ') || 'none in pure strategies'}.`,
  u1: 'player 1 payoff', u2: 'player 2 payoff', plAria: 'Payoffs of the profiles in the plane', eq: 'equilibrium', po: 'Pareto optimum', dom: 'Pareto-dominated' };
const j1mat = s => [[[s.R, s.S], [s.T, s.P]], [[s.R, s.T], [s.S, s.P]]];
FIGS.pd = {
  state: Object.assign({}, J1_ST),
  controls: L => ['T', 'R', 'P', 'S'].map(k => ({ key: k, label: L.f[k], min: 0, max: 6, step: 1, fmt: v => String(v) })),
  draw: function (s, lang) {
    const L = I18N[lang].f, M = j1mat(s), B = jxBR(M[0], M[1]);
    return { svg: jxMatrixSVG(M[0], M[1], { rows: [L.C, L.D], cols: [L.C, L.D], p1: L.p1, p2: L.p2, br: true, ne: true, aria: L.pdAria }), read: L.pdRead(s, B) };
  }
};
function j1plane(U1, U2, labels, lang, title) {
  const L = I18N[lang].f, B = jxBR(U1, U2), pts = [];
  U1.forEach((r, i) => r.forEach((v, j) => pts.push({ x: v, y: U2[i][j], lab: labels[i][j], ne: B.ne.some(e => e[0] === i && e[1] === j) })));
  pts.forEach(p => { p.dom = pts.some(q => q !== p && q.x >= p.x && q.y >= p.y && (q.x > p.x || q.y > p.y)); });
  const mx = Math.max(...pts.map(p => Math.max(p.x, p.y))), mn = Math.min(0, ...pts.map(p => Math.min(p.x, p.y)));
  const G = Plot({ w: 520, h: 420, x0: mn - 0.5, x1: mx + 1, y0: mn - 0.5, y1: mx + 1, mt: 50, mb: 42, ml: 50 });
  G.axes({ xt: ticks(mn, mx + 0.5, 5), yt: ticks(mn, mx + 0.5, 5), xl: L.u1, yl: L.u2, xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  pts.forEach(p => { G.dot(p.x, p.y, { c: p.ne ? COL.s3 : p.dom ? GREY : COL.s1, r: 7, hollow: p.dom && !p.ne }); G.text(p.x, p.y, p.lab, { dx: 10, dy: -8, anchor: 'start', size: 12, bold: true, c: p.ne ? COL.s3 : COL.ink }); });
  G.legend([{ c: COL.s3, box: true, t: L.eq }, { c: COL.s1, box: true, t: L.po }, { c: GREY, box: true, o: 0.5, t: L.dom }], G.ml + 8, 16);
  return G.svg(title || L.plAria);
}
FIGS.plane = {
  state: {}, controls: L => [],
  draw: function (s, lang) { const M = j1mat(J1_ST); return { svg: j1plane(M[0], M[1], [['CC', 'CD'], ['DC', 'DD']], lang), read: '' }; }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  /* jeu A : concurrence publicitaire, symétrique, T > R > P > S (en millions) */
  for (;;) { D.T = rint(6, 12); D.R = rint(4, 10); D.P = rint(2, 7); D.S = rint(0, 5); if (D.T > D.R && D.R > D.P && D.P > D.S) break; }
  /* lignes et colonnes : 0 = pas de publicité, 1 = publicité */
  D.A1 = [[D.R, D.S], [D.T, D.P]]; D.A2 = [[D.R, D.T], [D.S, D.P]];
  /* jeu B : 2 x 3, le joueur 1 a une stratégie strictement dominante, pas le joueur 2 */
  for (;;) {
    D.B1 = [[0, 0, 0], [0, 0, 0]].map(r => r.map(() => rint(0, 9))); D.B2 = [[0, 0, 0], [0, 0, 0]].map(r => r.map(() => rint(0, 9)));
    D.dom1 = D.B1[0].every((v, j) => v > D.B1[1][j]) ? 0 : D.B1[1].every((v, j) => v > D.B1[0][j]) ? 1 : -1;
    if (D.dom1 < 0) continue;
    const dom2 = [0, 1, 2].filter(j => [0, 1, 2].every(k => k === j || (D.B2[0][j] > D.B2[0][k] && D.B2[1][j] > D.B2[1][k])));
    if (dom2.length) continue;
    if (D.B2.some(r => r.filter(v => v === Math.max(...r)).length !== 1)) continue;
    const row = D.B2[D.dom1], mx = Math.max(...row);
    /* les meilleures réponses du joueur 2 diffèrent selon la ligne */
    const br = r => r.indexOf(Math.max(...r));
    if (br(D.B2[0]) === br(D.B2[1])) continue;
    D.j2 = row.indexOf(mx); break;
  }
  return D;
};
const J1L = { fr: { pub: ['Pas de publicité', 'Publicité'], A: 'Entreprise A', Bn: 'Entreprise B', rows: ['H', 'B'], cols: ['G', 'C', 'D'] }, en: { pub: ['No advertising', 'Advertising'], A: 'Firm A', Bn: 'Firm B', rows: ['U', 'D'], cols: ['L', 'C', 'R'] } };
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J1L.fr;
  return String.raw`<div class="context-block">Les deux jeux sont indépendants. Dans chaque case, le premier nombre est le gain du joueur en ligne, le second celui du joueur en colonne.</div>
<p><strong>Jeu A.</strong> Deux entreprises A (en ligne) et B (en colonne) décident simultanément de lancer ou non une campagne de publicité. Les profits, en millions d'euros, sont les suivants.</p>
${jxTable(D.A1, D.A2, L.pub, L.pub, 'A \\ B')}
<p><strong>Jeu B.</strong> Le joueur 1 choisit H ou B, le joueur 2 choisit G, C ou D.</p>
${jxTable(D.B1, D.B2, L.rows, L.cols, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">(A) Déterminez la meilleure réponse de chaque entreprise à chaque stratégie de l'autre.</div></li>
<li><div class="q-text">(A) Chaque entreprise a-t-elle une stratégie strictement dominante ? Déduisez-en l'issue du jeu.</div></li>
<li><div class="q-text">(A) Quels profils sont des optimums de Pareto ? L'issue du jeu en est-elle un ? Représentez les gains des quatre profils dans le plan et commentez.</div></li>
<li><div class="q-text">(B) Le joueur 1 a-t-il une stratégie strictement dominante ? Et le joueur 2 ?</div></li>
<li><div class="q-text">(B) En supposant que le joueur 2 sait que le joueur 1 est rationnel, déterminez l'issue du jeu. Représentez la matrice en soulignant les meilleures réponses.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J1L.en;
  return String.raw`<div class="context-block">The two games are independent. In each cell, the first number is the row player's payoff, the second the column player's.</div>
<p><strong>Game A.</strong> Two firms A (row) and B (column) simultaneously decide whether to launch an advertising campaign. Profits, in millions of euros, are as follows.</p>
${jxTable(D.A1, D.A2, L.pub, L.pub, 'A \\ B')}
<p><strong>Game B.</strong> Player 1 chooses U or D, player 2 chooses L, C or R.</p>
${jxTable(D.B1, D.B2, L.rows, L.cols, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">(A) Determine each firm's best response to each strategy of the other.</div></li>
<li><div class="q-text">(A) Does each firm have a strictly dominant strategy? Deduce the outcome of the game.</div></li>
<li><div class="q-text">(A) Which profiles are Pareto optima? Is the outcome of the game one of them? Plot the payoffs of the four profiles in the plane and comment.</div></li>
<li><div class="q-text">(B) Does player 1 have a strictly dominant strategy? And player 2?</div></li>
<li><div class="q-text">(B) Assuming player 2 knows that player 1 is rational, determine the outcome of the game. Draw the matrix underlining the best responses.</div></li>
</ol></div>`;
});
function j1sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J1L[lang], np = L.pub[0].toLowerCase(), pp = L.pub[1].toLowerCase();
  const B1 = D.B1, B2 = D.B2, r = L.rows, c = L.cols, d = D.dom1, o = 1 - d;
  const colCmp = [0, 1, 2].map(j => `${T_(['si le joueur 2 joue', 'if player 2 plays'])} ${c[j]}, ${r[d]} ${T_(['rapporte', 'pays'])} ${B1[d][j]} ${T_(['contre', 'against'])} ${B1[o][j]} ${T_(['pour', 'for'])} ${r[o]}`).join(' ; ');
  const rowBR = i => { const mx = Math.max(...B2[i]); return B2[i].map((v, j) => v === mx ? c[j] : null).filter(Boolean).join(T_([' ou ', ' or '])); };
  const nd2 = [0, 1, 2].map(j => [0, 1, 2].filter(k => k !== j).find(k => !(B2[0][j] > B2[0][k] && B2[1][j] > B2[1][k])));
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Considérons d\'abord l\'entreprise A, en fixant la stratégie de B. Si B ne fait pas de publicité, A obtient', 'Consider firm A first, holding B\'s strategy fixed. If B does not advertise, A gets'])} ${D.R} ${T_(['sans publicité et', 'without advertising and'])} ${D.T} ${T_(['avec', 'with'])} : ${T_(['comme', 'since'])} \(${D.T}&gt;${D.R}\), ${T_(['sa meilleure réponse est de faire de la publicité. Si B fait de la publicité, A obtient', 'its best response is to advertise. If B advertises, A gets'])} ${D.S} ${T_(['sans publicité et', 'without advertising and'])} ${D.P} ${T_(['avec', 'with'])} : ${T_(['comme', 'since'])} \(${D.P}&gt;${D.S}\), ${T_(['sa meilleure réponse est encore de faire de la publicité.', 'its best response is again to advertise.'])} ${T_(['Le jeu étant symétrique, la meilleure réponse de B est, de même, de faire de la publicité quelle que soit la décision de A.', 'The game being symmetric, B\'s best response is likewise to advertise whatever A does.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['D\'après la question 1, la publicité rapporte strictement plus à A que l\'absence de publicité, quoi que fasse B', 'From question 1, advertising pays A strictly more than not advertising, whatever B does'])} (\(${D.T}&gt;${D.R}\) ${T_(['et', 'and'])} \(${D.P}&gt;${D.S}\)) : ${T_(['c\'est une stratégie strictement dominante pour A, et, par symétrie, pour B. Des entreprises rationnelles jouent leur stratégie strictement dominante : l\'issue du jeu est l\'équilibre en stratégies dominantes (publicité, publicité), où chacune gagne', 'it is a strictly dominant strategy for A, and, by symmetry, for B. Rational firms play their strictly dominant strategy: the outcome of the game is the equilibrium in dominant strategies (advertising, advertising), where each earns'])} ${D.P}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le profil (publicité, publicité), qui donne', 'The profile (advertising, advertising), which gives'])} \((${D.P}\,;\,${D.P})\), ${T_(['est dominé au sens de Pareto par (pas de publicité, pas de publicité), qui donne', 'is Pareto-dominated by (no advertising, no advertising), which gives'])} \((${D.R}\,;\,${D.R})\) : ${T_(['les deux entreprises y gagnent', 'both firms gain'])} (\(${D.R}&gt;${D.P}\)). ${T_(['Les trois autres profils sont des optimums de Pareto : passer de l\'un à un autre réduit toujours le gain d\'au moins une entreprise. L\'issue du jeu n\'est donc pas un optimum de Pareto : c\'est un dilemme du prisonnier, puisque', 'The other three profiles are Pareto optima: moving from one to another always lowers at least one firm\'s payoff. The outcome of the game is therefore not a Pareto optimum: it is a prisoner\'s dilemma, since'])} \(T=${D.T}&gt;R=${D.R}&gt;P=${D.P}&gt;S=${D.S}\). ${T_(['Dans le plan des gains, l\'équilibre (rouge) est situé au sud-ouest de la coopération mutuelle :', 'In the payoff plane, the equilibrium (red) lies south-west of mutual cooperation:'])}</p>
  <div class="sol-fig">${j1plane(D.A1, D.A2, fr ? [['NN', 'NP'], ['PN', 'PP']] : [['NN', 'NA'], ['AN', 'AA']], lang)}</div>
  <p>${T_(['(N : pas de publicité ; P : publicité ; la première lettre est la décision de A.) Chaque entreprise dépense pour attirer les clients de l\'autre, et les deux campagnes s\'annulent : elles gagneraient toutes deux à s\'entendre pour s\'abstenir, mais un tel accord ne serait pas respecté, puisque chacune aurait alors intérêt à faire de la publicité.', '(N: no advertising; A: advertising; the first letter is A\'s decision.) Each firm spends to attract the other\'s customers, and the two campaigns cancel out: both would gain by agreeing to refrain, but such an agreement would not be kept, since each would then want to advertise.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Pour le joueur 1, on compare ses gains en H et en B dans chaque colonne :', 'For player 1, compare their payoffs at the two rows in each column:'])} ${colCmp}. ${r[d]} ${T_(['rapporte strictement plus dans les trois colonnes : c\'est une stratégie strictement dominante pour le joueur 1.', 'pays strictly more in all three columns: it is a strictly dominant strategy for player 1.'])}</p>
  <p>${T_(['Pour le joueur 2, la meilleure réponse dépend de la ligne : face à', 'For player 2, the best response depends on the row: against'])} ${r[0]}, ${T_(['c\'est', 'it is'])} ${rowBR(0)} ; ${T_(['face à', 'against'])} ${r[1]}, ${T_(['c\'est', 'it is'])} ${rowBR(1)}. ${T_(['Aucune stratégie n\'est donc meilleure que toutes les autres dans les deux lignes : le joueur 2 n\'a pas de stratégie strictement dominante.', 'No strategy is therefore better than all the others in both rows: player 2 has no strictly dominant strategy.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le joueur 1, rationnel, joue sa stratégie strictement dominante', 'Player 1, being rational, plays their strictly dominant strategy'])} ${r[d]}. ${T_(['Le joueur 2, qui le sait, n\'a qu\'à choisir sa meilleure réponse à', 'Player 2, who knows this, only needs to choose their best response to'])} ${r[d]} : ${T_(['ses gains y sont', 'their payoffs there are'])} ${B2[d].join(', ')} ${T_(['pour', 'for'])} ${c.join(', ')}, ${T_(['et le plus élevé est obtenu avec', 'and the highest is obtained with'])} ${c[D.j2]}. ${T_(['L\'issue du jeu est donc', 'The outcome of the game is therefore'])} (${r[d]}, ${c[D.j2]}), ${T_(['avec les gains', 'with payoffs'])} \((${B1[d][D.j2]}\,;\,${B2[d][D.j2]})\). ${T_(['C\'est la seule case où les deux gains sont soulignés :', 'It is the only cell where both payoffs are underlined:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(B1, B2, { rows: r, cols: c, p1: T_(['Joueur 1', 'Player 1']), p2: T_(['Joueur 2', 'Player 2']), br: true, ne: true, aria: 'B' })}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j1sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j1sol(D, 'en'))(D));