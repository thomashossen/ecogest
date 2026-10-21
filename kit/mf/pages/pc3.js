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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 3 – Effets de substitution et de revenu', 'k-h1': 'Effets de substitution et de revenu', 'k-coursetitle': 'Décomposer l\'effet d\'une variation de prix : demande compensée, décompositions de Hicks et de Slutsky', 'k-extitle': 'Hausse ou baisse d\'un prix : décompositions de Hicks et de Slutsky pour une utilité Cobb-Douglas', 'k-soltitle': 'Hausse ou baisse d\'un prix : décompositions de Hicks et de Slutsky pour une utilité Cobb-Douglas' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 3 – Substitution and income effects', 'k-h1': 'Substitution and income effects', 'k-coursetitle': 'Decomposing the effect of a price change: compensated demand, Hicks and Slutsky decompositions', 'k-extitle': 'A price rise or fall: Hicks and Slutsky decompositions for a Cobb-Douglas utility', 'k-soltitle': 'A price rise or fall: Hicks and Slutsky decompositions for a Cobb-Douglas utility' });

/* ---------- outils Cobb-Douglas ---------- */
function p3m(al, be, p1, p2, R) { const x1 = al / (al + be) * R / p1, x2 = be / (al + be) * R / p2; return { x1: x1, x2: x2, u: Math.pow(x1, al) * Math.pow(x2, be) }; }
function p3h(al, be, p1, p2, u) { const s = al + be, h1 = Math.pow(u, 1 / s) * Math.pow(al * p2 / (be * p1), be / s), h2 = Math.pow(u, 1 / s) * Math.pow(be * p1 / (al * p2), al / s); return { x1: h1, x2: h2, e: p1 * h1 + p2 * h2 }; }
function p3fig(al, be, p1, p1n, p2, R, lang, slutsky) {
  const fr = lang === 'fr', A = p3m(al, be, p1, p2, R), C = p3m(al, be, p1n, p2, R), B = slutsky ? p3m(al, be, p1n, p2, p1n * A.x1 + p2 * A.x2) : p3h(al, be, p1n, p2, A.u);
  const Rb = slutsky ? p1n * A.x1 + p2 * A.x2 : B.e, X1 = Math.max(R / p1, R / p1n, Rb / p1n) * 1.08, Y1 = Math.max(R, Rb) / p2 * 1.08;
  const G = Plot({ w: 540, h: 440, x0: 0, x1: X1, y0: 0, y1: Y1, mt: 26, mb: 42, ml: 46 });
  G.axes({ xt: ticks(0, X1, 4), yt: ticks(0, Y1, 4), xl: 'x₁', yl: 'x₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  const ic = (u, c, d) => G.curve(x => Math.pow(u / Math.pow(x, al), 1 / be), 0.02, X1, { c: c, w: 1.5, dash: d, clip: true }, 400);
  G.line([[0, R / p2], [R / p1, 0]], { c: COL.s1, w: 2.2, clip: true });
  G.line([[0, R / p2], [R / p1n, 0]], { c: COL.s2, w: 2.2, clip: true });
  G.line([[0, Rb / p2], [Rb / p1n, 0]], { c: GREY, w: 1.6, dash: '5 4', clip: true });
  ic(A.u, COL.s1, '6 4'); ic(C.u, COL.s2, '6 4'); if (slutsky) ic(B.u, GREY, '2 4');
  [[A, 'A', COL.s1], [B, slutsky ? 'S' : 'B', GREY], [C, 'C', COL.s2]].forEach(p => { G.dot(p[0].x1, p[0].x2, { c: p[2], r: 6 }); G.text(p[0].x1, p[0].x2, p[1], { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12 }); });
  G.seg(A.x1, 0, A.x1, A.x2, { c: COL.s1, w: 1, dash: '2 3' }); G.seg(B.x1, 0, B.x1, B.x2, { c: GREY, w: 1, dash: '2 3' }); G.seg(C.x1, 0, C.x1, C.x2, { c: COL.s2, w: 1, dash: '2 3' });
  G.legend([{ c: COL.s1, t: fr ? 'budget initial' : 'initial budget' }, { c: COL.s2, t: fr ? 'nouveau budget' : 'new budget' }, { c: GREY, dash: '5 4', t: fr ? 'budget compensé' : 'compensated budget' }], G.ml + 4, 16);
  return { svg: '<div style="max-width:560px;margin:0 auto">' + G.svg(fr ? 'Décomposition' : 'Decomposition') + '</div>', A: A, B: B, C: C };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez décomposer l'effet d'une variation de prix sur la demande en un effet de substitution et un effet de revenu, à la manière de Hicks puis de Slutsky, calculer la demande compensée d'une utilité Cobb-Douglas, et classer les biens selon le signe de l'effet de revenu.<br><br>
<strong>Pourquoi ?</strong> Quand un prix baisse, le consommateur achète davantage du bien pour deux raisons : il devient relativement moins cher que les autres, et le consommateur est en pratique plus riche. Distinguer ces deux effets explique pourquoi la demande est presque toujours décroissante, et pourquoi elle peut, exceptionnellement, ne pas l'être.<br><br>
<strong>Prérequis.</strong> Choix optimal et demandes (page 2).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Deux effets</a> · <a href="#s2">2. Hicks</a> · <a href="#s3">3. Slutsky</a> · <a href="#s4">4. Signes</a> · <a href="#s5">5. L'équation de Slutsky</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Deux effets d'une variation de prix</div>
<p>Quand \(p_1\) varie, le panier optimal passe de \(A\) à \(C\). On sépare ce déplacement en deux étapes fictives. L'<em>effet de substitution</em> mesure la réaction à la seule variation du prix relatif, le pouvoir d'achat étant maintenu constant. L'<em>effet de revenu</em> mesure la réaction à la variation du pouvoir d'achat, à prix relatifs nouveaux. L'effet total est leur somme.</p>

<div class="dossier-title" id="s2">2. La décomposition de Hicks</div>
<p>Hicks maintient constant le <em>niveau d'utilité</em> : on cherche le panier \(B\) qui atteint l'utilité initiale \(u_A\) au moindre coût aux nouveaux prix. C'est la <em>demande compensée</em> (ou hicksienne) \(h(p,u)\), solution de \(\min p_1x_1+p_2x_2\) sous \(U(x_1,x_2)=u\). Graphiquement, \(B\) est le point de la courbe d'indifférence initiale où la pente vaut le nouveau prix relatif. L'effet de substitution est \(x_1^B-x_1^A\) ; l'effet de revenu \(x_1^C-x_1^B\). Pour \(U=x_1^\alpha x_2^\beta\) et \(s=\alpha+\beta\) :
\[h_1(p,u)=u^{1/s}\Big(\frac{\alpha p_2}{\beta p_1}\Big)^{\beta/s},\qquad h_2(p,u)=u^{1/s}\Big(\frac{\beta p_1}{\alpha p_2}\Big)^{\alpha/s}\]</p>
<div class="ifig" data-fig="hicks"></div>
<div class="fig-cap">Figure 1 — Décomposition de Hicks pour \(U=\sqrt{x_1x_2}\), \(p_2=1\), \(R=20\) et un prix initial \(p_1=2\). Le passage de A à B, le long de la courbe d'indifférence initiale, est l'effet de substitution ; le passage de B à C, entre deux droites de budget parallèles, l'effet de revenu. Choisissez la décomposition de Slutsky pour comparer.</div>

<div class="dossier-title" id="s3">3. La décomposition de Slutsky</div>
<p>Slutsky maintient constant le <em>pouvoir d'achat</em> au sens du panier initial : on donne au consommateur le revenu \(R'=p_1'x_1^A+p_2x_2^A\) qui lui permet tout juste d'acheter \(A\) aux nouveaux prix, et l'on note \(S\) son choix optimal. L'effet de substitution est \(x_1^S-x_1^A\), l'effet de revenu \(x_1^C-x_1^S\). Cette compensation s'observe directement, sans connaître la fonction d'utilité, ce qui la rend utile pour les indices de prix. Pour de petites variations de prix, les deux décompositions coïncident.</p>

<div class="dossier-title" id="s4">4. Les signes des effets</div>
<p>L'effet de substitution est toujours de signe opposé à la variation de prix : quand un bien devient relativement plus cher, on en consomme moins à utilité constante, à cause de la convexité des courbes d'indifférence. L'effet de revenu dépend de la nature du bien. Pour un bien <em>normal</em>, dont la demande croît avec le revenu, les deux effets vont dans le même sens. Pour un bien <em>inférieur</em>, ils s'opposent ; si l'effet de revenu l'emporte, la demande croît avec le prix : c'est un bien <em>Giffen</em>, cas théorique rare.</p>
<div class="ifig" data-fig="curves"></div>
<div class="fig-cap">Figure 2 — Demande marshallienne \(x_1(p_1)\) à revenu donné (bleu) et demande compensée \(h_1(p_1)\) à utilité donnée (doré), pour la même utilité qu'en figure 1. Elles se croisent au prix initial. Pour un bien normal, la demande compensée est plus pentue dans ce graphique, c'est-à-dire moins sensible au prix : elle ne contient que l'effet de substitution.</div>

<div class="dossier-title" id="s5">5. L'équation de Slutsky</div>
<p>Pour de petites variations, la décomposition s'écrit en dérivées :
\[\frac{\partial x_1}{\partial p_1}=\frac{\partial h_1}{\partial p_1}-x_1\,\frac{\partial x_1}{\partial R}\]
Le premier terme, toujours négatif, est l'effet de substitution ; le second est l'effet de revenu : une hausse de \(p_1\) d'un euro réduit le pouvoir d'achat d'environ \(x_1\) euros, ce qui modifie la demande de \(x_1\,\partial x_1/\partial R\).</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Effet total = effet de substitution + effet de revenu.</li>
<li>Hicks : utilité constante (demande compensée) ; Slutsky : panier initial juste accessible.</li>
<li>L'effet de substitution est toujours opposé à la variation de prix ; l'effet de revenu va dans le même sens pour un bien normal.</li>
<li>Équation de Slutsky : \(\frac{\partial x_1}{\partial p_1}=\frac{\partial h_1}{\partial p_1}-x_1\frac{\partial x_1}{\partial R}\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can decompose the effect of a price change on demand into a substitution effect and an income effect, following Hicks and then Slutsky, compute the compensated demand of a Cobb-Douglas utility, and classify goods by the sign of the income effect.<br><br>
<strong>Why?</strong> When a price falls, the consumer buys more of the good for two reasons: it becomes relatively cheaper than the others, and the consumer is effectively richer. Separating the two effects explains why demand is almost always decreasing, and why, exceptionally, it may not be.<br><br>
<strong>Prerequisites.</strong> Optimal choice and demand (page 2).
</div>
<p class="toc">Contents: <a href="#s1">1. Two effects</a> · <a href="#s2">2. Hicks</a> · <a href="#s3">3. Slutsky</a> · <a href="#s4">4. Signs</a> · <a href="#s5">5. The Slutsky equation</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Two effects of a price change</div>
<p>When \(p_1\) changes, the optimal bundle moves from \(A\) to \(C\). This move is split into two fictitious steps. The <em>substitution effect</em> measures the reaction to the change in the relative price alone, purchasing power being held constant. The <em>income effect</em> measures the reaction to the change in purchasing power, at the new relative prices. The total effect is their sum.</p>

<div class="dossier-title" id="s2">2. The Hicks decomposition</div>
<p>Hicks holds the <em>utility level</em> constant: we look for the bundle \(B\) that reaches the initial utility \(u_A\) at least cost at the new prices. This is the <em>compensated</em> (or Hicksian) demand \(h(p,u)\), solution of \(\min p_1x_1+p_2x_2\) subject to \(U(x_1,x_2)=u\). Graphically, \(B\) is the point of the initial indifference curve where the slope equals the new relative price. The substitution effect is \(x_1^B-x_1^A\); the income effect \(x_1^C-x_1^B\). For \(U=x_1^\alpha x_2^\beta\) and \(s=\alpha+\beta\):
\[h_1(p,u)=u^{1/s}\Big(\frac{\alpha p_2}{\beta p_1}\Big)^{\beta/s},\qquad h_2(p,u)=u^{1/s}\Big(\frac{\beta p_1}{\alpha p_2}\Big)^{\alpha/s}\]</p>
<div class="ifig" data-fig="hicks"></div>
<div class="fig-cap">Figure 1 — Hicks decomposition for \(U=\sqrt{x_1x_2}\), \(p_2=1\), \(R=20\) and an initial price \(p_1=2\). The move from A to B, along the initial indifference curve, is the substitution effect; the move from B to C, between two parallel budget lines, is the income effect. Choose the Slutsky decomposition to compare.</div>

<div class="dossier-title" id="s3">3. The Slutsky decomposition</div>
<p>Slutsky holds constant <em>purchasing power</em> in the sense of the initial bundle: the consumer is given the income \(R'=p_1'x_1^A+p_2x_2^A\) that just allows them to buy \(A\) at the new prices, and \(S\) denotes their optimal choice. The substitution effect is \(x_1^S-x_1^A\), the income effect \(x_1^C-x_1^S\). This compensation is directly observable, without knowing the utility function, which makes it useful for price indices. For small price changes, both decompositions coincide.</p>

<div class="dossier-title" id="s4">4. Signs of the effects</div>
<p>The substitution effect always has the opposite sign to the price change: when a good becomes relatively dearer, less of it is consumed at constant utility, because of the convexity of indifference curves. The income effect depends on the nature of the good. For a <em>normal</em> good, whose demand rises with income, both effects go the same way. For an <em>inferior</em> good, they oppose each other; if the income effect dominates, demand rises with the price: this is a <em>Giffen</em> good, a rare theoretical case.</p>
<div class="ifig" data-fig="curves"></div>
<div class="fig-cap">Figure 2 — Marshallian demand \(x_1(p_1)\) at given income (blue) and compensated demand \(h_1(p_1)\) at given utility (gold), for the same utility as in figure 1. They cross at the initial price. For a normal good, compensated demand is steeper in this graph, that is less sensitive to the price: it contains only the substitution effect.</div>

<div class="dossier-title" id="s5">5. The Slutsky equation</div>
<p>For small changes, the decomposition is written in derivatives:
\[\frac{\partial x_1}{\partial p_1}=\frac{\partial h_1}{\partial p_1}-x_1\,\frac{\partial x_1}{\partial R}\]
The first term, always negative, is the substitution effect; the second is the income effect: a one-euro rise in \(p_1\) reduces purchasing power by about \(x_1\) euros, which changes demand by \(x_1\,\partial x_1/\partial R\).</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Total effect = substitution effect + income effect.</li>
<li>Hicks: constant utility (compensated demand); Slutsky: initial bundle just affordable.</li>
<li>The substitution effect always opposes the price change; the income effect goes the same way for a normal good.</li>
<li>Slutsky equation: \(\frac{\partial x_1}{\partial p_1}=\frac{\partial h_1}{\partial p_1}-x_1\frac{\partial x_1}{\partial R}\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { p1n: 'Nouveau prix p₁′', dec: 'Décomposition', hk: 'Hicks', sl: 'Slutsky', read: (F, sl) => `Effet de substitution : <span class="v">${fmt(F.B.x1 - F.A.x1, 2)}</span> &nbsp;·&nbsp; effet de revenu : <span class="v">${fmt(F.C.x1 - F.B.x1, 2)}</span> &nbsp;·&nbsp; effet total : <span class="v">${fmt(F.C.x1 - F.A.x1, 2)}</span> (${sl ? 'Slutsky' : 'Hicks'})`, mar: 'demande marshallienne', com: 'demande compensée', cAria: 'Demandes marshallienne et compensée' };
I18N.en.f = { p1n: 'New price p₁′', dec: 'Decomposition', hk: 'Hicks', sl: 'Slutsky', read: (F, sl) => `Substitution effect: <span class="v">${fmt(F.B.x1 - F.A.x1, 2)}</span> &nbsp;·&nbsp; income effect: <span class="v">${fmt(F.C.x1 - F.B.x1, 2)}</span> &nbsp;·&nbsp; total effect: <span class="v">${fmt(F.C.x1 - F.A.x1, 2)}</span> (${sl ? 'Slutsky' : 'Hicks'})`, mar: 'Marshallian demand', com: 'compensated demand', cAria: 'Marshallian and compensated demands' };
FIGS.hicks = {
  state: { p1n: 1, d: 'h' },
  controls: L => [{ key: 'p1n', label: L.f.p1n, min: 0.5, max: 4, step: 0.25, fmt: v => fmtT(v, 2) }, { key: 'd', type: 'select', label: L.f.dec, options: [{ v: 'h', t: L.f.hk }, { v: 's', t: L.f.sl }] }],
  draw: function (s, lang) { const F = p3fig(0.5, 0.5, 2, s.p1n, 1, 20, lang, s.d === 's'); return { svg: F.svg, read: I18N[lang].f.read(F, s.d === 's') }; }
};
FIGS.curves = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, uA = p3m(0.5, 0.5, 2, 1, 20).u, G = Plot({ w: 640, h: 280, x0: 0, x1: 20, y0: 0, y1: 5, mt: 26, mb: 42 });
    G.axes({ xt: [0, 5, 10, 15, 20], yt: [0, 1, 2, 3, 4, 5], xl: 'x₁', yl: 'p₁', xf: v => String(v), yf: v => String(v) });
    G.clip();
    const pts = (f) => { const o = []; for (let p = 0.3; p <= 5; p += 0.05) o.push([f(p), p]); return o; };
    G.line(pts(p => 10 / p), { c: COL.s1, w: 2.4, clip: true }); G.line(pts(p => p3h(0.5, 0.5, p, 1, uA).x1), { c: COL.s2, w: 2.4, clip: true });
    G.dot(5, 2, { c: COL.s3, r: 6 });
    G.legend([{ c: COL.s1, t: L.mar }, { c: COL.s2, t: L.com }], G.ml + 300, 16);
    return { svg: G.svg(L.cAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.al = pick([1, 2, 3]); D.be = pick([1, 2, 3]); D.p1 = rint(2, 8); D.p2 = rint(2, 8); D.R = 10 * rint(6, 20);
  D.p1n = pick([D.p1 / 2, D.p1 * 2, D.p1 + 2, Math.max(1, D.p1 - 1)]);
  const al = D.al, be = D.be;
  D.A = p3m(al, be, D.p1, D.p2, D.R); D.C = p3m(al, be, D.p1n, D.p2, D.R); D.B = p3h(al, be, D.p1n, D.p2, D.A.u);
  D.Rs = D.p1n * D.A.x1 + D.p2 * D.A.x2; D.S = p3m(al, be, D.p1n, D.p2, D.Rs);
  D.VC = D.B.e - D.R;
  return D;
};
const p3U = D => String.raw`U(x_1,x_2)=x_1${D.al === 1 ? '' : '^{' + D.al + '}'}\,x_2${D.be === 1 ? '' : '^{' + D.be + '}'}`;
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Un consommateur a pour utilité \(${p3U(D)}\), un revenu \(R=${D.R}\), et fait face aux prix \(p_1=${D.p1}\) et \(p_2=${D.p2}\). Le prix du bien 1 passe à \(p_1'=${fq(D.p1n, 2)}\), le revenu et \(p_2\) restant inchangés.</div>
<div class="questions"><ol>
<li><div class="q-text">Déterminez le panier optimal initial \(A\) et le niveau d'utilité \(u_A\).</div></li>
<li><div class="q-text">Déterminez le nouveau panier optimal \(C\). Quel est l'effet total sur la demande de bien 1 ?</div></li>
<li><div class="q-text">Décomposition de Hicks : déterminez le panier \(B\) qui permet d'atteindre \(u_A\) au moindre coût aux nouveaux prix. Déduisez-en l'effet de substitution et l'effet de revenu.</div></li>
<li><div class="q-text">Décomposition de Slutsky : calculez le revenu qui permet tout juste d'acheter \(A\) aux nouveaux prix, le panier optimal \(S\) correspondant, puis les deux effets. Comparez avec Hicks.</div></li>
<li><div class="q-text">Le bien 1 est-il normal ou inférieur ? Quelle somme faudrait-il donner (ou retirer) au consommateur pour qu'il retrouve son utilité initiale aux nouveaux prix ?</div></li>
<li><div class="q-text">Représentez graphiquement la décomposition de Hicks.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">A consumer has utility \(${p3U(D)}\), income \(R=${D.R}\), and faces prices \(p_1=${D.p1}\) and \(p_2=${D.p2}\). The price of good 1 changes to \(p_1'=${fq(D.p1n, 2)}\), income and \(p_2\) remaining unchanged.</div>
<div class="questions"><ol>
<li><div class="q-text">Determine the initial optimal bundle \(A\) and the utility level \(u_A\).</div></li>
<li><div class="q-text">Determine the new optimal bundle \(C\). What is the total effect on the demand for good 1?</div></li>
<li><div class="q-text">Hicks decomposition: determine the bundle \(B\) reaching \(u_A\) at least cost at the new prices. Deduce the substitution effect and the income effect.</div></li>
<li><div class="q-text">Slutsky decomposition: compute the income that just allows buying \(A\) at the new prices, the corresponding optimal bundle \(S\), then both effects. Compare with Hicks.</div></li>
<li><div class="q-text">Is good 1 normal or inferior? What amount should be given to (or taken from) the consumer for them to regain their initial utility at the new prices?</div></li>
<li><div class="q-text">Draw the Hicks decomposition.</div></li>
</ol></div>`;
});
function p3sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], al = D.al, be = D.be, s = al + be, p1 = D.p1, p1n = D.p1n, p2 = D.p2, R = D.R, A = D.A, B = D.B, C = D.C, S = D.S, n = x => texT(x, 4);
  const pw = (v, e) => { v = String(v); if (/^\\frac|^-/.test(v)) v = '\\left(' + v + '\\right)'; return e === 1 ? v : `${v}^{${e}}`; }, up = D.p1n > D.p1;
  const F = p3fig(al, be, p1, p1n, p2, R, lang, false);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Pour une utilité Cobb-Douglas, la tangence et la contrainte budgétaire donnent les demandes', 'For a Cobb-Douglas utility, tangency and the budget constraint give the demands'])} \(x_1=\frac{${al}}{${s}}\frac{R}{p_1}\) ${T_(['et', 'and'])} \(x_2=\frac{${be}}{${s}}\frac{R}{p_2}\) (${T_(['page 2', 'page 2'])}). ${T_(['Aux prix initiaux :', 'At the initial prices:'])}
  \[x_1^A=\frac{${al}}{${s}}\times\frac{${R}}{${p1}}=${fqa(A.x1)}\qquad x_2^A=\frac{${be}}{${s}}\times\frac{${R}}{${p2}}=${fqa(A.x2)}\qquad u_A=${pw(n(A.x1), al)}\times ${pw(n(A.x2), be)}${eqa(A.u)}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Au nouveau prix, la même formule donne', 'At the new price, the same formula gives'])} \(x_1^C=\frac{${al}}{${s}}\times\frac{${R}}{${texT(p1n, 2)}}=${fqa(C.x1)}\) ${T_(['et', 'and'])} \(x_2^C=${fqa(C.x2)}\), ${T_(['inchangé. L\'effet total sur le bien 1 est', 'unchanged. The total effect on good 1 is'])} \(x_1^C-x_1^A=${fqa(C.x1 - A.x1)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le panier', 'Bundle'])} \(B\) ${T_(['minimise la dépense', 'minimises expenditure'])} \(${texT(p1n, 2)}\,x_1+${p2}\,x_2\) ${T_(['sous la contrainte', 'subject to'])} \(U(x_1,x_2)=u_A\). ${T_(['La condition de tangence est la même qu\'au choix optimal :', 'The tangency condition is the same as for the optimal choice:'])} \(\frac{${al === 1 ? '' : al}\,x_2}{${be === 1 ? '' : be}\,x_1}=\frac{${texT(p1n, 2)}}{${p2}}\), ${T_(['soit', 'that is'])} \(x_2=${n(be * p1n / (al * p2))}\,x_1\). ${T_(['En reportant dans', 'Substituting into'])} \(U=u_A\) :
  \[\begin{aligned}${pw('x_1', al)}\,${pw(String.raw`(${n(be * p1n / (al * p2))}\,x_1)`, be)}&amp;=${fqa(A.u)}\\x_1^B&amp;=\Big(\frac{${n(A.u)}}{${n(Math.pow(be * p1n / (al * p2), be))}}\Big)^{1/${s}}=${fqa(B.x1)}\qquad x_2^B=${fqa(B.x2)}\end{aligned}\]
  ${T_(['On en déduit la décomposition :', 'Hence the decomposition:'])}
  \[\underbrace{x_1^C-x_1^A}_{${n(C.x1 - A.x1)}}=\underbrace{x_1^B-x_1^A}_{\text{${T_(['substitution', 'substitution'])}}\,=\,${n(B.x1 - A.x1)}}+\underbrace{x_1^C-x_1^B}_{\text{${T_(['revenu', 'income'])}}\,=\,${n(C.x1 - B.x1)}}\]
  ${T_(['L\'effet de substitution est', 'The substitution effect is'])} ${up ? T_(['négatif : le bien 1 devient relativement plus cher, on en consomme moins à utilité constante.', 'negative: good 1 becomes relatively dearer, less of it is consumed at constant utility.']) : T_(['positif : le bien 1 devient relativement moins cher, on en consomme plus à utilité constante.', 'positive: good 1 becomes relatively cheaper, more of it is consumed at constant utility.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le revenu qui permet tout juste d\'acheter', 'The income that just allows buying'])} \(A\) ${T_(['aux nouveaux prix est', 'at the new prices is'])} \(R'=${texT(p1n, 2)}\times ${n(A.x1)}+${p2}\times ${n(A.x2)}=${fqa(D.Rs)}\). ${T_(['Avec ce revenu, le consommateur choisit', 'With this income, the consumer chooses'])} \(x_1^S=\frac{${al}}{${s}}\times\frac{${n(D.Rs)}}{${texT(p1n, 2)}}=${fqa(S.x1)}\). ${T_(['L\'effet de substitution de Slutsky vaut', 'The Slutsky substitution effect is'])} \(${n(S.x1 - A.x1)}\) ${T_(['et l\'effet de revenu', 'and the income effect'])} \(${n(C.x1 - S.x1)}\). ${T_(['Les deux décompositions ont le même effet total, mais diffèrent légèrement : la compensation de Slutsky, qui permet de racheter', 'Both decompositions share the same total effect, but differ slightly: Slutsky compensation, which allows buying back'])} \(A\), ${T_(['laisse le consommateur sur une courbe d\'indifférence un peu plus haute que celle de Hicks', 'leaves the consumer on a slightly higher indifference curve than Hicks\'s'])} (\(R'=${n(D.Rs)}\ge ${n(B.e)}\)).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La demande', 'Demand'])} \(x_1=\frac{${al}}{${s}}\frac{R}{p_1}\) ${T_(['croît avec le revenu : le bien 1 est normal, et l\'effet de revenu va dans le même sens que l\'effet de substitution. La somme qui rend au consommateur son utilité initiale est la variation compensatrice : la dépense minimale pour atteindre', 'rises with income: good 1 is normal, and the income effect goes the same way as the substitution effect. The amount that restores the consumer\'s initial utility is the compensating variation: the minimal expenditure to reach'])} \(u_A\) ${T_(['aux nouveaux prix, moins le revenu :', 'at the new prices, minus income:'])}
  \[VC=e(p_1',p_2,u_A)-R=${texT(p1n, 2)}\times ${n(B.x1)}+${p2}\times ${n(B.x2)}-${R}=${fqa(D.VC)}\]
  ${D.VC > 0 ? T_(['Il faudrait donner', 'One would have to give']) + ' \\(' + n(D.VC) + '\\) ' + T_(['au consommateur : la hausse de prix le rend plus pauvre.', 'to the consumer: the price rise makes them poorer.']) : T_(['On pourrait retirer', 'One could take']) + ' \\(' + n(-D.VC) + '\\) ' + T_(['au consommateur sans réduire son utilité : la baisse de prix l\'enrichit.', 'from the consumer without reducing their utility: the price fall makes them richer.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['A est sur le budget initial (bleu), C sur le nouveau (doré). B est sur la courbe d\'indifférence initiale, tangent à une droite parallèle au nouveau budget (pointillés gris) : de A à B, l\'effet de substitution ; de B à C, l\'effet de revenu.', 'A lies on the initial budget (blue), C on the new one (gold). B lies on the initial indifference curve, tangent to a line parallel to the new budget (grey dashed): from A to B, the substitution effect; from B to C, the income effect.'])}</p>
  <div class="sol-fig">${F.svg}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => p3sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => p3sol(D, 'en'))(D));