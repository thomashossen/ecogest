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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 7 – Le dilemme du volontaire', 'k-h1': 'Le dilemme du volontaire', 'k-coursetitle': 'Témoignage d\'une agression : équilibres asymétriques, équilibre symétrique mixte et effet du nombre de témoins', 'k-extitle': 'Combien de témoins pour qu\'un appel soit passé ?', 'k-soltitle': 'Combien de témoins pour qu\'un appel soit passé ?' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 7 – The volunteer\'s dilemma', 'k-h1': 'The volunteer\'s dilemma', 'k-coursetitle': 'Witnessing an assault: asymmetric equilibria, the symmetric mixed equilibrium and the effect of the number of witnesses', 'k-extitle': 'How many witnesses for a call to be made?', 'k-soltitle': 'How many witnesses for a call to be made?' });

/* ---------- outils : n témoins, bénéfice v si au moins un appelle, coût c pour celui qui appelle ---------- */
function j7mix(n, r) { const q = Math.pow(r, 1 / (n - 1)); return { q: q, p: 1 - q, P0: Math.pow(q, n), calls: n * (1 - q) }; }

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez modéliser une situation où un seul volontaire suffit, trouver ses équilibres de Nash en stratégies pures, calculer l'équilibre symétrique en stratégies mixtes pour \(n\) joueurs, et expliquer pourquoi, à l'équilibre, la probabilité que personne n'agisse augmente avec le nombre de témoins.<br><br>
<strong>Pourquoi ?</strong> En 1964, à New York, l'agression de Kitty Genovese aurait eu de nombreux témoins, dont aucun n'aurait appelé la police à temps. Les psychologues parlent d'« effet du témoin ». La théorie des jeux en donne une explication sans supposer d'indifférence morale : chacun compte un peu plus sur les autres quand ils sont nombreux. Le même dilemme apparaît pour signaler une panne, dénoncer une fraude ou contribuer à un bien commun.<br><br>
<strong>Prérequis.</strong> Stratégies mixtes (Théorie des jeux 4).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le jeu</a> · <a href="#s2">2. Équilibres purs</a> · <a href="#s3">3. Équilibre symétrique</a> · <a href="#s4">4. L'effet du nombre</a> · <a href="#s5">5. Efficacité et remèdes</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le jeu</div>
<p>Il y a \(n\ge 2\) témoins. Chacun décide simultanément d'appeler la police ou non. Si au moins un témoin appelle, chacun retire un bénéfice \(v&gt;0\) (la victime est secourue) ; celui qui appelle supporte en plus un coût \(c\), avec \(0&lt;c&lt;v\) (temps, risque, convocation au commissariat). Si personne n'appelle, chacun obtient 0. Les gains d'un témoin sont donc \(v-c\) s'il appelle, \(v\) s'il n'appelle pas et qu'un autre appelle, 0 si personne n'appelle.</p>

<div class="dossier-title" id="s2">2. Les équilibres en stratégies pures</div>
<p>Si personne n'appelle, chacun gagnerait à appeler (\(v-c&gt;0\)) : ce n'est pas un équilibre. Si deux témoins ou plus appellent, chacun d'eux gagnerait à s'abstenir (\(v&gt;v-c\)) : pas d'équilibre non plus. Si exactement un témoin appelle, il ne gagne rien à s'abstenir (il passerait de \(v-c\) à 0) et les autres ne gagnent rien à appeler (ils passeraient de \(v\) à \(v-c\)) : c'est un équilibre. Il y en a \(n\), un par volontaire possible. Mais rien n'indique <em>qui</em> doit appeler : ces équilibres asymétriques supposent une coordination que des inconnus n'ont aucun moyen de réaliser.</p>

<div class="dossier-title" id="s3">3. L'équilibre symétrique en stratégies mixtes</div>
<p>Cherchons un équilibre où chaque témoin n'appelle pas avec la même probabilité \(q\). Un témoin n'accepte de mélanger que s'il est indifférent. S'il appelle, il obtient \(v-c\) avec certitude. S'il n'appelle pas, il obtient \(v\) si au moins l'un des \(n-1\) autres appelle, ce qui arrive avec probabilité \(1-q^{n-1}\). L'indifférence s'écrit :
\[v-c=v\,(1-q^{n-1})\iff q^{n-1}=\frac{c}{v}\iff q^*=\Big(\frac{c}{v}\Big)^{\frac{1}{n-1}}\]
Chaque témoin appelle avec probabilité \(p^*=1-q^*\). Son gain espéré est \(v-c\), le même qu'en appelant à coup sûr.</p>

<div class="dossier-title" id="s4">4. L'effet du nombre de témoins</div>
<p>Quand \(n\) augmente, \(q^*\) se rapproche de 1 : chaque témoin appelle de moins en moins souvent, parce qu'il compte sur les autres. La probabilité que personne n'appelle vaut :
\[P_0=(q^*)^n=\Big(\frac{c}{v}\Big)^{\frac{n}{n-1}}\]
Comme l'exposant \(\frac{n}{n-1}\) diminue vers 1 et que \(\frac{c}{v}&lt;1\), \(P_0\) <em>augmente</em> avec \(n\) et tend vers \(\frac{c}{v}\). Plus il y a de témoins, moins la victime a de chances d'être secourue : l'effet de chaque témoin supplémentaire est plus que compensé par la baisse de la probabilité individuelle d'appeler. C'est l'effet du témoin, déduit de la seule rationalité.</p>
<div class="ifig" data-fig="p0"></div>
<div class="fig-cap">Figure 1 — Probabilité que personne n'appelle (rouge) et probabilité qu'un témoin donné appelle (bleu), à l'équilibre symétrique, en fonction du nombre de témoins. La première augmente avec \(n\) et tend vers \(c/v\) (pointillés). Faites varier le rapport \(c/v\) : plus l'appel est coûteux, plus la victime est en danger.</div>

<div class="dossier-title" id="s5">5. Efficacité et remèdes</div>
<p>Du point de vue collectif, l'idéal est qu'une seule personne appelle : le surplus total est alors \(nv-c\). À l'équilibre symétrique, chacun obtient en espérance \(v-c\), soit un total \(n(v-c)\) : la perte, \((n-1)c\), croît avec le nombre de témoins. Les remèdes consistent à briser la symétrie : désigner nommément quelqu'un (« vous, appelez les secours » est le conseil des secouristes), réduire le coût de l'appel (numéro gratuit et anonyme), ou instaurer une obligation légale de porter assistance.</p>
<div class="ifig" data-fig="welf"></div>
<div class="fig-cap">Figure 2 — Surplus total à l'équilibre symétrique (bleu) et avec un volontaire désigné (doré), pour \(v=10\) et \(c=2\). L'écart \((n-1)c\) mesure le coût de l'absence de coordination.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Équilibres purs : exactement un témoin appelle ; il y en a \(n\), mais ils exigent une coordination.</li>
<li>Équilibre symétrique : \(q^*=(c/v)^{1/(n-1)}\) par indifférence entre appeler et attendre.</li>
<li>Probabilité que personne n'appelle : \((c/v)^{n/(n-1)}\), croissante en \(n\) : l'effet du témoin.</li>
<li>Perte collective \((n-1)c\) ; désigner un volontaire ou réduire le coût d'appel y remédie.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can model a situation where a single volunteer suffices, find its pure-strategy Nash equilibria, compute the symmetric mixed-strategy equilibrium for \(n\) players, and explain why, in equilibrium, the probability that nobody acts rises with the number of witnesses.<br><br>
<strong>Why?</strong> In 1964, in New York, the assault of Kitty Genovese reportedly had many witnesses, none of whom called the police in time. Psychologists speak of the "bystander effect". Game theory explains it without assuming moral indifference: each relies a little more on the others when they are many. The same dilemma arises when reporting a breakdown, blowing the whistle on fraud or contributing to a common good.<br><br>
<strong>Prerequisites.</strong> Mixed strategies (Game theory 4).
</div>
<p class="toc">Contents: <a href="#s1">1. The game</a> · <a href="#s2">2. Pure equilibria</a> · <a href="#s3">3. Symmetric equilibrium</a> · <a href="#s4">4. The effect of numbers</a> · <a href="#s5">5. Efficiency and remedies</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The game</div>
<p>There are \(n\ge 2\) witnesses. Each simultaneously decides whether to call the police. If at least one witness calls, each obtains a benefit \(v&gt;0\) (the victim is rescued); whoever calls also bears a cost \(c\), with \(0&lt;c&lt;v\) (time, risk, being summoned to the police station). If nobody calls, each gets 0. A witness's payoffs are therefore \(v-c\) if they call, \(v\) if they do not call and someone else does, 0 if nobody calls.</p>

<div class="dossier-title" id="s2">2. Pure-strategy equilibria</div>
<p>If nobody calls, each would gain by calling (\(v-c&gt;0\)): not an equilibrium. If two or more witnesses call, each of them would gain by abstaining (\(v&gt;v-c\)): not an equilibrium either. If exactly one witness calls, they gain nothing by abstaining (they would go from \(v-c\) to 0) and the others gain nothing by calling (they would go from \(v\) to \(v-c\)): it is an equilibrium. There are \(n\) of them, one per possible volunteer. But nothing says <em>who</em> should call: these asymmetric equilibria assume a coordination that strangers have no way of achieving.</p>

<div class="dossier-title" id="s3">3. The symmetric mixed-strategy equilibrium</div>
<p>Let us look for an equilibrium where each witness does not call with the same probability \(q\). A witness only agrees to mix if indifferent. If they call, they get \(v-c\) for sure. If they do not, they get \(v\) if at least one of the \(n-1\) others calls, which happens with probability \(1-q^{n-1}\). Indifference reads:
\[v-c=v\,(1-q^{n-1})\iff q^{n-1}=\frac{c}{v}\iff q^*=\Big(\frac{c}{v}\Big)^{\frac{1}{n-1}}\]
Each witness calls with probability \(p^*=1-q^*\). Their expected payoff is \(v-c\), the same as calling for sure.</p>

<div class="dossier-title" id="s4">4. The effect of the number of witnesses</div>
<p>As \(n\) grows, \(q^*\) approaches 1: each witness calls less and less often, because they rely on the others. The probability that nobody calls is:
\[P_0=(q^*)^n=\Big(\frac{c}{v}\Big)^{\frac{n}{n-1}}\]
Since the exponent \(\frac{n}{n-1}\) decreases towards 1 and \(\frac{c}{v}&lt;1\), \(P_0\) <em>rises</em> with \(n\) and tends to \(\frac{c}{v}\). The more witnesses, the lower the victim's chance of being rescued: the effect of each additional witness is more than offset by the fall in the individual probability of calling. This is the bystander effect, derived from rationality alone.</p>
<div class="ifig" data-fig="p0"></div>
<div class="fig-cap">Figure 1 — Probability that nobody calls (red) and probability that a given witness calls (blue), in the symmetric equilibrium, as a function of the number of witnesses. The former rises with \(n\) and tends to \(c/v\) (dashed). Vary the ratio \(c/v\): the costlier the call, the greater the danger for the victim.</div>

<div class="dossier-title" id="s5">5. Efficiency and remedies</div>
<p>From a collective point of view, the ideal is for a single person to call: total surplus is then \(nv-c\). In the symmetric equilibrium, each gets \(v-c\) in expectation, a total of \(n(v-c)\): the loss, \((n-1)c\), grows with the number of witnesses. Remedies consist in breaking the symmetry: designating someone by name ("you, call the emergency services" is the first-aiders' advice), lowering the cost of calling (a free, anonymous number), or a legal duty to assist.</p>
<div class="ifig" data-fig="welf"></div>
<div class="fig-cap">Figure 2 — Total surplus in the symmetric equilibrium (blue) and with a designated volunteer (gold), for \(v=10\) and \(c=2\). The gap \((n-1)c\) measures the cost of the lack of coordination.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Pure equilibria: exactly one witness calls; there are \(n\) of them, but they require coordination.</li>
<li>Symmetric equilibrium: \(q^*=(c/v)^{1/(n-1)}\) from indifference between calling and waiting.</li>
<li>Probability that nobody calls: \((c/v)^{n/(n-1)}\), increasing in \(n\): the bystander effect.</li>
<li>Collective loss \((n-1)c\); designating a volunteer or lowering the cost of calling remedies it.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { r: 'Rapport c/v', n: 'nombre de témoins n', P0: 'personne n\'appelle', p: 'un témoin donné appelle', lim: 'limite c/v', p0Aria: 'Probabilités à l\'équilibre selon le nombre de témoins',
  p0Read: r => `Avec <i>c</i>/<i>v</i> = ${fmtT(r, 2)} : <i>P</i><sub>0</sub> = <span class="v">${fmt(j7mix(2, r).P0, 3)}</span> pour 2 témoins, <span class="v">${fmt(j7mix(10, r).P0, 3)}</span> pour 10 témoins.`,
  wm: 'équilibre symétrique', wo: 'volontaire désigné', wAria: 'Surplus total selon le nombre de témoins' };
I18N.en.f = { r: 'Ratio c/v', n: 'number of witnesses n', P0: 'nobody calls', p: 'a given witness calls', lim: 'limit c/v', p0Aria: 'Equilibrium probabilities by number of witnesses',
  p0Read: r => `With <i>c</i>/<i>v</i> = ${fmtT(r, 2)}: <i>P</i><sub>0</sub> = <span class="v">${fmt(j7mix(2, r).P0, 3)}</span> for 2 witnesses, <span class="v">${fmt(j7mix(10, r).P0, 3)}</span> for 10 witnesses.`,
  wm: 'symmetric equilibrium', wo: 'designated volunteer', wAria: 'Total surplus by number of witnesses' };
FIGS.p0 = {
  state: { r: 0.2 },
  controls: L => [{ key: 'r', label: L.f.r, min: 0.05, max: 0.9, step: 0.05, fmt: v => fmtT(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f;
    const G = Plot({ w: 680, h: 300, x0: 1.5, x1: 15.5, y0: 0, y1: 1, mt: 26, mb: 42 });
    G.axes({ xt: [2, 4, 6, 8, 10, 12, 14], yt: [0, 0.25, 0.5, 0.75, 1], xl: L.n, xf: v => String(v), yf: v => fmtT(v, 2) });
    const A = [], B = []; for (let n = 2; n <= 15; n++) { const M = j7mix(n, s.r); A.push([n, M.P0]); B.push([n, M.p]); }
    G.line([[1.5, s.r], [15.5, s.r]], { c: GREY, w: 1, dash: '4 4' });
    G.line(A, { c: COL.s3, w: 2.2 }); A.forEach(p => G.dot(p[0], p[1], { c: COL.s3, r: 4 }));
    G.line(B, { c: COL.s1, w: 2.2 }); B.forEach(p => G.dot(p[0], p[1], { c: COL.s1, r: 4 }));
    G.legend([{ c: COL.s3, t: L.P0 }, { c: COL.s1, t: L.p }, { c: GREY, dash: '4 4', t: L.lim }], G.ml + 8, 16);
    return { svg: G.svg(L.p0Aria), read: L.p0Read(s.r) };
  }
};
FIGS.welf = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, v = 10, c = 2;
    const G = Plot({ w: 680, h: 280, x0: 1.5, x1: 12.5, y0: 0, y1: 125, mt: 26, mb: 42 });
    G.axes({ xt: [2, 4, 6, 8, 10, 12], yt: [0, 25, 50, 75, 100, 125], xl: L.n, xf: v => String(v), yf: v => String(v) });
    const A = [], B = []; for (let n = 2; n <= 12; n++) { A.push([n, n * (v - c)]); B.push([n, n * v - c]); }
    G.line(B, { c: COL.s2, w: 2.2 }); G.line(A, { c: COL.s1, w: 2.2 });
    G.legend([{ c: COL.s1, t: L.wm }, { c: COL.s2, t: L.wo }], G.ml + 8, 16);
    return { svg: G.svg(L.wAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.v = pick([10, 20, 40, 50, 100]); D.c = D.v * pick([0.1, 0.2, 0.25, 0.4, 0.5]); D.n = rint(3, 8); D.r = D.c / D.v;
  D.M2 = j7mix(2, D.r); D.Mn = j7mix(D.n, D.r);
  return D;
};
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Des témoins assistent à une agression. Chacun décide simultanément d'appeler la police ou non. Si au moins un témoin appelle, chacun retire un bénéfice \(v=${D.v}\) ; celui qui appelle supporte de plus un coût \(c=${texT(D.c, 2)}\). Si personne n'appelle, chacun obtient 0.</div>
<div class="questions"><ol>
<li><div class="q-text">On suppose d'abord qu'il y a deux témoins. Écrivez la matrice des gains, puis déterminez les équilibres de Nash en stratégies pures et l'équilibre symétrique en stratégies mixtes.</div></li>
<li><div class="q-text">Il y a maintenant \(n=${D.n}\) témoins. Déterminez les équilibres de Nash en stratégies pures. Pourquoi sont-ils peu plausibles entre inconnus ?</div></li>
<li><div class="q-text">Déterminez l'équilibre symétrique en stratégies mixtes : probabilité qu'un témoin n'appelle pas, probabilité qu'il appelle, gain espéré.</div></li>
<li><div class="q-text">Calculez la probabilité que personne n'appelle avec 2 témoins et avec \(${D.n}\) témoins. Commentez. Quelle est sa limite quand le nombre de témoins devient très grand ?</div></li>
<li><div class="q-text">Représentez graphiquement la probabilité que personne n'appelle et la probabilité qu'un témoin donné appelle, en fonction du nombre de témoins.</div></li>
<li><div class="q-text">Comparez le surplus total espéré à l'équilibre symétrique avec \(${D.n}\) témoins à celui obtenu si un témoin était désigné pour appeler. Quelles mesures pourraient réduire la perte ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Witnesses observe an assault. Each simultaneously decides whether to call the police. If at least one witness calls, each obtains a benefit \(v=${D.v}\); whoever calls also bears a cost \(c=${texT(D.c, 2)}\). If nobody calls, each gets 0.</div>
<div class="questions"><ol>
<li><div class="q-text">First assume there are two witnesses. Write the payoff matrix, then determine the pure-strategy Nash equilibria and the symmetric mixed-strategy equilibrium.</div></li>
<li><div class="q-text">There are now \(n=${D.n}\) witnesses. Determine the pure-strategy Nash equilibria. Why are they implausible among strangers?</div></li>
<li><div class="q-text">Determine the symmetric mixed-strategy equilibrium: probability that a witness does not call, probability that they call, expected payoff.</div></li>
<li><div class="q-text">Compute the probability that nobody calls with 2 witnesses and with \(${D.n}\) witnesses. Comment. What is its limit as the number of witnesses becomes very large?</div></li>
<li><div class="q-text">Draw the probability that nobody calls and the probability that a given witness calls, as functions of the number of witnesses.</div></li>
<li><div class="q-text">Compare expected total surplus in the symmetric equilibrium with \(${D.n}\) witnesses with the surplus obtained if one witness were designated to call. Which measures could reduce the loss?</div></li>
</ol></div>`;
});
function j7sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], v = D.v, c = D.c, n = D.n, r = D.r, M2 = D.M2, Mn = D.Mn, n4 = x => texT(x, 4), m2 = x => texT(x, 2);
  const lab = T_([['Appeler', 'Ne pas appeler'], ['Call', 'Not call']]);
  const U1 = [[v - c, v - c], [v, 0]], U2 = [[v - c, v], [v - c, 0]];
  /* graphique propre au tirage */
  const G = Plot({ w: 640, h: 300, x0: 1.5, x1: 15.5, y0: 0, y1: 1, mt: 26, mb: 42 });
  G.axes({ xt: [2, 4, 6, 8, 10, 12, 14], yt: [0, 0.25, 0.5, 0.75, 1], xl: T_(['nombre de témoins', 'number of witnesses']), xf: x => String(x), yf: x => fmtT(x, 2) });
  const A = [], B = []; for (let k = 2; k <= 15; k++) { const M = j7mix(k, r); A.push([k, M.P0]); B.push([k, M.p]); }
  G.line([[1.5, r], [15.5, r]], { c: GREY, w: 1, dash: '4 4' }); G.line(A, { c: COL.s3, w: 2.2 }); G.line(B, { c: COL.s1, w: 2.2 });
  A.forEach(p => G.dot(p[0], p[1], { c: COL.s3, r: p[0] === n || p[0] === 2 ? 6 : 3.5 })); B.forEach(p => G.dot(p[0], p[1], { c: COL.s1, r: 3.5 }));
  G.legend([{ c: COL.s3, t: T_(['personne n\'appelle', 'nobody calls']) }, { c: COL.s1, t: T_(['un témoin donné appelle', 'a given witness calls']) }, { c: GREY, dash: '4 4', t: 'c/v' }], G.ml + 8, 16);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Un témoin qui appelle obtient', 'A witness who calls gets'])} \(v-c=${fqa(v - c)}\) ${T_(['quoi que fasse l\'autre ; s\'il n\'appelle pas, il obtient', 'whatever the other does; if they do not call, they get'])} ${v} ${T_(['si l\'autre appelle et 0 sinon :', 'if the other calls and 0 otherwise:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(U1, U2, { rows: lab, cols: lab, p1: T_(['Témoin 1', 'Witness 1']), p2: T_(['Témoin 2', 'Witness 2']), br: true, ne: true, cw: 140, aria: 'n2' })}</div>
  <p>${T_(['Si l\'autre appelle, la meilleure réponse est de ne pas appeler', 'If the other calls, the best response is not to call'])} (\(${v}&gt;${m2(v - c)}\)) ; ${T_(['s\'il n\'appelle pas, c\'est d\'appeler', 'if they do not call, it is to call'])} (\(${m2(v - c)}&gt;0\)). ${T_(['Les équilibres purs sont les deux profils où un seul témoin appelle. Pour l\'équilibre symétrique, notons', 'The pure equilibria are the two profiles where a single witness calls. For the symmetric equilibrium, let'])} \(q\) ${T_(['la probabilité que l\'autre n\'appelle pas ; l\'indifférence s\'écrit', 'be the probability that the other does not call; indifference reads'])} \(${m2(v - c)}=${v}\,(1-q)\), ${T_(['d\'où', 'hence'])} \(q^*=\frac{${m2(c)}}{${v}}=${fqa(M2.q)}\) ${T_(['et une probabilité d\'appeler', 'and a probability of calling'])} \(${n4(M2.p)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si personne n\'appelle, chacun gagnerait', 'If nobody calls, each would gain'])} \(${m2(v - c)}&gt;0\) ${T_(['en appelant : ce n\'est pas un équilibre. Si au moins deux témoins appellent, chacun d\'eux gagnerait', 'by calling: not an equilibrium. If at least two witnesses call, each of them would gain'])} \(c=${fqa(c)}\) ${T_(['en s\'abstenant : ce n\'est pas un équilibre non plus. Si exactement un témoin appelle, il perdrait', 'by abstaining: not an equilibrium either. If exactly one witness calls, they would lose'])} \(${m2(v - c)}\) ${T_(['en s\'abstenant, et chacun des autres perdrait', 'by abstaining, and each of the others would lose'])} \(${m2(c)}\) ${T_(['en appelant aussi : c\'est un équilibre. Il y a donc', 'by calling too: it is an equilibrium. There are therefore'])} ${n} ${T_(['équilibres en stratégies pures, un par volontaire possible. Ils supposent que chacun sait qui doit appeler, ce qu\'aucune règle ne fixe entre inconnus qui ne peuvent pas communiquer.', 'pure-strategy equilibria, one per possible volunteer. They assume each knows who should call, which no rule determines among strangers who cannot communicate.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Chaque témoin n\'appelle pas avec probabilité', 'Each witness does not call with probability'])} \(q\). ${T_(['S\'il appelle, il obtient', 'If they call, they get'])} \(${m2(v - c)}\) ${T_(['à coup sûr. S\'il n\'appelle pas, il obtient', 'for sure. If they do not call, they get'])} ${v} ${T_(['si au moins l\'un des', 'if at least one of the'])} ${n - 1} ${T_(['autres appelle, ce qui arrive avec probabilité', 'others calls, which happens with probability'])} \(1-q^{${n - 1}}\). ${T_(['L\'indifférence donne :', 'Indifference gives:'])}
  \[\begin{aligned}${m2(v - c)}&amp;=${v}\,(1-q^{${n - 1}})\\q^{${n - 1}}&amp;=\frac{${m2(c)}}{${v}}=${fqa(r)}\\q^*&amp;=${fqp(r)}^{1/${n - 1}}=${fqa(Mn.q)}\end{aligned}\]
  ${T_(['Chaque témoin appelle donc avec probabilité', 'Each witness therefore calls with probability'])} \(p^*=1-q^*=${fqa(Mn.p)}\), ${T_(['et son gain espéré est', 'and their expected payoff is'])} \(v-c=${fqa(v - c)}\), ${T_(['puisqu\'il est indifférent avec le fait d\'appeler.', 'since they are indifferent with calling.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les choix étant indépendants, personne n\'appelle avec probabilité', 'Choices being independent, nobody calls with probability'])} \(P_0=(q^*)^n=\big(\frac{c}{v}\big)^{\frac{n}{n-1}}\) :
  \[P_0(2)=${fqp(r)}^{2}=${fqa(M2.P0)}\qquad P_0(${n})=${fqp(r)}^{${n}/${n - 1}}=${fqa(Mn.P0)}\]
  ${T_(['La victime a moins de chances d\'être secourue avec', 'The victim is less likely to be rescued with'])} ${n} ${T_(['témoins qu\'avec 2 : chacun appelle avec une probabilité plus faible', 'witnesses than with 2: each calls with a lower probability'])} (\(${n4(Mn.p)}\) ${T_(['contre', 'against'])} \(${n4(M2.p)}\)), ${T_(['et cette baisse l\'emporte sur l\'augmentation du nombre de témoins. Quand', 'and this fall outweighs the increase in the number of witnesses. As'])} \(n\to\infty\), ${T_(['l\'exposant', 'the exponent'])} \(\frac{n}{n-1}\) ${T_(['tend vers 1 et', 'tends to 1 and'])} \(P_0\) ${T_(['tend vers', 'tends to'])} \(\frac{c}{v}=${fqa(r)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les deux courbes, calculées avec', 'Both curves, computed with'])} \(c/v=${fqa(r)}\) ; ${T_(['les points agrandis correspondent à 2 et à', 'the enlarged points correspond to 2 and'])} ${n} ${T_(['témoins :', 'witnesses:'])}</p>
  <div class="sol-fig">${G.svg('volunteer')}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['À l\'équilibre symétrique, chaque témoin obtient en espérance', 'In the symmetric equilibrium, each witness gets in expectation'])} \(v-c\), ${T_(['soit un surplus total', 'a total surplus of'])} \(${n}\times ${m2(v - c)}=${fqa(n * (v - c))}\). ${T_(['Si un témoin était désigné, il appellerait toujours ; le surplus total serait', 'If one witness were designated, they would always call; total surplus would be'])} \(${n}\times ${v}-${m2(c)}=${fqa(n * v - c)}\). ${T_(['La perte due au défaut de coordination vaut', 'The loss due to the lack of coordination is'])} \((n-1)\,c=${fqa((n - 1) * c)}\), ${T_(['et elle augmente avec le nombre de témoins. Désigner nommément quelqu\'un, rendre l\'appel gratuit et anonyme, ou imposer une obligation légale de porter assistance brisent la symétrie et réduisent cette perte.', 'and it grows with the number of witnesses. Designating someone by name, making calls free and anonymous, or imposing a legal duty to assist break the symmetry and reduce this loss.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j7sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j7sol(D, 'en'))(D));