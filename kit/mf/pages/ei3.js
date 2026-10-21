/* ============================================================
   PAGE ei3 — Le duopole de Cournot
   ============================================================ */
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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 3 – Le duopole de Cournot', 'k-h1': 'Le duopole de Cournot', 'k-coursetitle': 'Se concurrencer en quantités : fonctions de réaction, équilibre de Nash et nombre de firmes', 'k-extitle': 'Duopole de Cournot à coûts différents, comparaison avec le monopole et oligopole à n firmes', 'k-soltitle': 'Duopole de Cournot à coûts différents, comparaison avec le monopole et oligopole à n firmes' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 3 – The Cournot duopoly', 'k-h1': 'The Cournot duopoly', 'k-coursetitle': 'Competing in quantities: reaction functions, Nash equilibrium and number of firms', 'k-extitle': 'Cournot duopoly with different costs, comparison with monopoly and n-firm oligopoly', 'k-soltitle': 'Cournot duopoly with different costs, comparison with monopoly and n-firm oligopoly' });

const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : fq(x) + '\\,';
/* ---------- outils : P = a - bQ, coûts c_i q_i ---------- */
function e3cournot(a, b, c1, c2) {
  let q1 = (a - 2 * c1 + c2) / (3 * b), q2 = (a - 2 * c2 + c1) / (3 * b);
  if (q2 < 0) { q2 = 0; q1 = (a - c1) / (2 * b); } else if (q1 < 0) { q1 = 0; q2 = (a - c2) / (2 * b); }
  const P = a - b * (q1 + q2);
  return { q1: q1, q2: q2, P: P, p1: (P - c1) * q1, p2: (P - c2) * q2 };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez écrire le profit d'une entreprise en concurrence en quantités, en déduire sa fonction de réaction, trouver l'équilibre de Cournot comme intersection des fonctions de réaction, le comparer au monopole et à la concurrence parfaite, et voir comment il évolue avec le nombre de firmes.<br><br>
<strong>Pourquoi ?</strong> Quand la capacité de production se décide avant le prix (pétrole, acier, ciment, transport aérien), les entreprises se concurrencent en quantités. Le modèle de Cournot (1838) en est la référence ; il est aussi le premier exemple historique d'équilibre de Nash.<br><br>
<strong>Prérequis.</strong> Le monopole (page 1), dérivées partielles, résolution d'un système de deux équations.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le jeu</a> · <a href="#s2">2. Fonctions de réaction</a> · <a href="#s3">3. Équilibre</a> · <a href="#s4">4. Comparaisons</a> · <a href="#s5">5. n firmes</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le jeu de Cournot</div>
<p>Deux entreprises produisent un bien homogène. Elles choisissent simultanément leurs quantités \(q_1\) et \(q_2\) ; le prix s'ajuste ensuite pour écouler la production totale \(Q=q_1+q_2\), selon la demande inverse \(P(Q)\). Le profit de l'entreprise \(i\) dépend donc des deux quantités :
\[\Pi_i(q_1,q_2)=P(q_1+q_2)\,q_i-C_i(q_i)\]
Chaque entreprise choisit sa quantité en anticipant celle de sa concurrente : c'est un jeu simultané, dont la solution est un équilibre de Nash.</p>

<div class="dossier-title" id="s2">2. Fonctions de réaction</div>
<p>Pour une quantité \(q_j\) donnée de la concurrente, l'entreprise \(i\) maximise son profit. Avec \(P=a-bQ\) et \(C_i(q_i)=c_iq_i\) :
\[\frac{\partial\Pi_i}{\partial q_i}=a-2bq_i-bq_j-c_i=0\iff q_i=R_i(q_j)=\frac{a-c_i}{2b}-\frac{q_j}{2}\]
La fonction de réaction \(R_i\) donne la meilleure réponse de \(i\) à chaque quantité de \(j\). Elle est décroissante : les quantités sont des <em>substituts stratégiques</em>, plus la concurrente produit, moins il est intéressant de produire. Si \(q_j=0\), l'entreprise produit la quantité de monopole \(\frac{a-c_i}{2b}\) ; si \(q_j\ge\frac{a-c_i}{b}\), elle ne produit plus.</p>

<div class="dossier-title" id="s3">3. L'équilibre de Cournot</div>
<p>Un équilibre de Cournot est un couple \((q_1^*,q_2^*)\) où chaque quantité est la meilleure réponse à l'autre : \(q_1^*=R_1(q_2^*)\) et \(q_2^*=R_2(q_1^*)\). Graphiquement, c'est l'intersection des deux fonctions de réaction. En résolvant le système :
\[q_1^*=\frac{a-2c_1+c_2}{3b},\qquad q_2^*=\frac{a-2c_2+c_1}{3b},\qquad P^*=\frac{a+c_1+c_2}{3}\]
L'entreprise la plus efficace produit davantage. Les conditions du premier ordre donnent aussi \(P^*-c_i=bq_i^*\), d'où un indice de Lerner proportionnel à la part de marché \(s_i=q_i^*/Q^*\) :
\[L_i=\frac{P^*-c_i}{P^*}=\frac{s_i}{|\varepsilon|}\]
Partant de quantités quelconques, si chaque entreprise répond à tour de rôle à la dernière quantité de l'autre, le processus converge vers l'équilibre : c'est le tâtonnement de Cournot.</p>
<div class="ifig" data-fig="br"></div>
<div class="fig-cap">Figure 1 — Fonctions de réaction des deux entreprises pour \(P=100-Q\) et l'équilibre de Cournot à leur intersection. La ligne brisée grise montre le tâtonnement à partir d'un monopole de l'entreprise 1. Augmentez le coût d'une entreprise : sa fonction de réaction se déplace vers l'origine, et sa part de marché diminue.</div>

<div class="dossier-title" id="s4">4. Comparaison avec le monopole et la concurrence parfaite</div>
<p>Avec des coûts identiques \(c\), chaque entreprise produit \(\frac{a-c}{3b}\), soit une production totale \(\frac{2(a-c)}{3b}\). C'est plus que le monopole, \(\frac{a-c}{2b}\), et moins que la concurrence parfaite, \(\frac{a-c}{b}\) : le prix de Cournot est compris entre le prix de monopole et le coût marginal. Le profit total de Cournot est inférieur au profit de monopole. Les deux entreprises gagneraient à s'entendre pour produire moins, mais chacune a alors intérêt à dévier en produisant davantage : c'est un dilemme du prisonnier, étudié dans la page sur le cartel.</p>

<div class="dossier-title" id="s5">5. Oligopole à n entreprises</div>
<p>Avec \(n\) entreprises identiques de coût marginal \(c\), la condition du premier ordre de chacune, en équilibre symétrique \(q_i=q\), s'écrit \(a-b(n+1)q-c=0\). D'où :
\[q^*=\frac{a-c}{(n+1)b},\qquad Q^*=\frac{n}{n+1}\cdot\frac{a-c}{b},\qquad P^*=\frac{a+nc}{n+1}\xrightarrow[n\to\infty]{}c\]
Pour \(n=1\), on retrouve le monopole ; quand \(n\) augmente, le prix tend vers le coût marginal et la production vers celle de la concurrence parfaite. La concurrence parfaite apparaît comme la limite de l'oligopole quand le nombre de firmes devient grand.</p>
<div class="ifig" data-fig="nf"></div>
<div class="fig-cap">Figure 2 — Prix d'équilibre de Cournot en fonction du nombre d'entreprises \(n\), pour \(P=100-Q\). Il part du prix de monopole pour \(n=1\) et décroît vers le coût marginal. La lecture indique l'indice de Lerner de chaque entreprise, qui vaut \(\frac{1}{n\,|\varepsilon|}\).</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Fonction de réaction : \(q_i=\frac{a-c_i}{2b}-\frac{q_j}{2}\), décroissante (substituts stratégiques).</li>
<li>Équilibre de Cournot : intersection des fonctions de réaction ; \(q_i^*=\frac{a-2c_i+c_j}{3b}\), \(P^*=\frac{a+c_1+c_2}{3}\).</li>
<li>Production totale comprise entre celle du monopole et celle de la concurrence parfaite ; \(L_i=s_i/|\varepsilon|\).</li>
<li>Avec \(n\) firmes, \(P^*=\frac{a+nc}{n+1}\) tend vers le coût marginal.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can write the profit of a firm competing in quantities, derive its reaction function, find the Cournot equilibrium as the intersection of the reaction functions, compare it with monopoly and perfect competition, and see how it changes with the number of firms.<br><br>
<strong>Why?</strong> When production capacity is decided before the price (oil, steel, cement, air transport), firms compete in quantities. The Cournot model (1838) is the reference; it is also the first historical example of a Nash equilibrium.<br><br>
<strong>Prerequisites.</strong> Monopoly (page 1), partial derivatives, solving a system of two equations.
</div>
<p class="toc">Contents: <a href="#s1">1. The game</a> · <a href="#s2">2. Reaction functions</a> · <a href="#s3">3. Equilibrium</a> · <a href="#s4">4. Comparisons</a> · <a href="#s5">5. n firms</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The Cournot game</div>
<p>Two firms produce a homogeneous good. They simultaneously choose their quantities \(q_1\) and \(q_2\); the price then adjusts to clear total output \(Q=q_1+q_2\), according to the inverse demand \(P(Q)\). The profit of firm \(i\) therefore depends on both quantities:
\[\Pi_i(q_1,q_2)=P(q_1+q_2)\,q_i-C_i(q_i)\]
Each firm chooses its quantity anticipating its rival's: this is a simultaneous game, whose solution is a Nash equilibrium.</p>

<div class="dossier-title" id="s2">2. Reaction functions</div>
<p>For a given rival quantity \(q_j\), firm \(i\) maximises its profit. With \(P=a-bQ\) and \(C_i(q_i)=c_iq_i\):
\[\frac{\partial\Pi_i}{\partial q_i}=a-2bq_i-bq_j-c_i=0\iff q_i=R_i(q_j)=\frac{a-c_i}{2b}-\frac{q_j}{2}\]
The reaction function \(R_i\) gives \(i\)'s best response to each quantity of \(j\). It is decreasing: quantities are <em>strategic substitutes</em>, the more the rival produces, the less attractive producing becomes. If \(q_j=0\), the firm produces the monopoly quantity \(\frac{a-c_i}{2b}\); if \(q_j\ge\frac{a-c_i}{b}\), it stops producing.</p>

<div class="dossier-title" id="s3">3. The Cournot equilibrium</div>
<p>A Cournot equilibrium is a pair \((q_1^*,q_2^*)\) where each quantity is the best response to the other: \(q_1^*=R_1(q_2^*)\) and \(q_2^*=R_2(q_1^*)\). Graphically, it is the intersection of the two reaction functions. Solving the system:
\[q_1^*=\frac{a-2c_1+c_2}{3b},\qquad q_2^*=\frac{a-2c_2+c_1}{3b},\qquad P^*=\frac{a+c_1+c_2}{3}\]
The more efficient firm produces more. The first-order conditions also give \(P^*-c_i=bq_i^*\), hence a Lerner index proportional to the market share \(s_i=q_i^*/Q^*\):
\[L_i=\frac{P^*-c_i}{P^*}=\frac{s_i}{|\varepsilon|}\]
Starting from arbitrary quantities, if each firm in turn responds to the other's latest quantity, the process converges to equilibrium: this is the Cournot adjustment process.</p>
<div class="ifig" data-fig="br"></div>
<div class="fig-cap">Figure 1 — Reaction functions of the two firms for \(P=100-Q\) and the Cournot equilibrium at their intersection. The grey broken line shows the adjustment process starting from a monopoly of firm 1. Raise one firm's cost: its reaction function shifts towards the origin, and its market share falls.</div>

<div class="dossier-title" id="s4">4. Comparison with monopoly and perfect competition</div>
<p>With identical costs \(c\), each firm produces \(\frac{a-c}{3b}\), a total output of \(\frac{2(a-c)}{3b}\). This is more than monopoly, \(\frac{a-c}{2b}\), and less than perfect competition, \(\frac{a-c}{b}\): the Cournot price lies between the monopoly price and marginal cost. Total Cournot profit is below monopoly profit. Both firms would gain from agreeing to produce less, but each would then want to deviate by producing more: this is a prisoner's dilemma, studied on the cartel page.</p>

<div class="dossier-title" id="s5">5. Oligopoly with n firms</div>
<p>With \(n\) identical firms with marginal cost \(c\), the first-order condition of each, in a symmetric equilibrium \(q_i=q\), reads \(a-b(n+1)q-c=0\). Hence:
\[q^*=\frac{a-c}{(n+1)b},\qquad Q^*=\frac{n}{n+1}\cdot\frac{a-c}{b},\qquad P^*=\frac{a+nc}{n+1}\xrightarrow[n\to\infty]{}c\]
For \(n=1\), monopoly is recovered; as \(n\) grows, the price tends to marginal cost and output to that of perfect competition. Perfect competition appears as the limit of oligopoly when the number of firms becomes large.</p>
<div class="ifig" data-fig="nf"></div>
<div class="fig-cap">Figure 2 — Cournot equilibrium price as a function of the number of firms \(n\), for \(P=100-Q\). It starts from the monopoly price for \(n=1\) and falls towards marginal cost. The reading gives each firm's Lerner index, equal to \(\frac{1}{n\,|\varepsilon|}\).</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Reaction function: \(q_i=\frac{a-c_i}{2b}-\frac{q_j}{2}\), decreasing (strategic substitutes).</li>
<li>Cournot equilibrium: intersection of the reaction functions; \(q_i^*=\frac{a-2c_i+c_j}{3b}\), \(P^*=\frac{a+c_1+c_2}{3}\).</li>
<li>Total output between monopoly and perfect competition; \(L_i=s_i/|\varepsilon|\).</li>
<li>With \(n\) firms, \(P^*=\frac{a+nc}{n+1}\) tends to marginal cost.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  c1: 'Coût marginal c₁', c2: 'Coût marginal c₂', R1: 'réaction de 1', R2: 'réaction de 2', tat: 'tâtonnement', brAria: 'Fonctions de réaction et équilibre de Cournot',
  brRead: (E) => `Équilibre : <i>q</i><sub>1</sub> = <span class="v">${fmt(E.q1, 2)}</span>, <i>q</i><sub>2</sub> = <span class="v">${fmt(E.q2, 2)}</span>, <i>P</i> = <span class="v">${fmt(E.P, 2)}</span> &nbsp;·&nbsp; profits <span class="v">${fmt(E.p1, 1)}</span> et <span class="v">${fmt(E.p2, 1)}</span>`,
  c: 'Coût marginal c', n: 'nombre d\'entreprises n', pr: 'prix d\'équilibre', cm: 'coût marginal', nAria: 'Prix de Cournot en fonction du nombre d\'entreprises',
  nRead: (n, P, L) => `Avec <i>n</i> = ${n} : prix <span class="v">${fmt(P, 2)}</span> &nbsp;·&nbsp; indice de Lerner de chaque entreprise <span class="v">${fmt(L, 3)}</span>`
};
I18N.en.f = {
  c1: 'Marginal cost c₁', c2: 'Marginal cost c₂', R1: 'reaction of 1', R2: 'reaction of 2', tat: 'adjustment', brAria: 'Reaction functions and Cournot equilibrium',
  brRead: (E) => `Equilibrium: <i>q</i><sub>1</sub> = <span class="v">${fmt(E.q1, 2)}</span>, <i>q</i><sub>2</sub> = <span class="v">${fmt(E.q2, 2)}</span>, <i>P</i> = <span class="v">${fmt(E.P, 2)}</span> &nbsp;·&nbsp; profits <span class="v">${fmt(E.p1, 1)}</span> and <span class="v">${fmt(E.p2, 1)}</span>`,
  c: 'Marginal cost c', n: 'number of firms n', pr: 'equilibrium price', cm: 'marginal cost', nAria: 'Cournot price as a function of the number of firms',
  nRead: (n, P, L) => `With <i>n</i> = ${n}: price <span class="v">${fmt(P, 2)}</span> &nbsp;·&nbsp; Lerner index of each firm <span class="v">${fmt(L, 3)}</span>`
};
FIGS.br = {
  state: { c1: 10, c2: 25 },
  controls: L => [
    { key: 'c1', label: L.f.c1, min: 0, max: 50, step: 5, fmt: v => String(v) },
    { key: 'c2', label: L.f.c2, min: 0, max: 50, step: 5, fmt: v => String(v) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = 100, b = 1, E = e3cournot(a, b, s.c1, s.c2);
    const G = Plot({ w: 520, h: 440, x0: 0, x1: 100, y0: 0, y1: 100, mt: 26, mb: 42, ml: 46 });
    G.axes({ xt: [0, 25, 50, 75, 100], yt: [0, 25, 50, 75, 100], xl: 'q₁', yl: 'q₂', xf: v => String(v), yf: v => String(v) });
    G.clip();
    const m1 = (a - s.c1) / b, m2 = (a - s.c2) / b;
    G.line([[m1 / 2, 0], [0, m1]], { c: COL.s1, w: 2.4, clip: true });   /* q1 = (m1 - q2)/2 */
    G.line([[0, m2 / 2], [m2, 0]], { c: COL.s2, w: 2.4, clip: true });                               /* q2 = (m2 - q1)/2 */
    /* tâtonnement : départ q2 = 0 */
    const path = []; let q1 = Math.max(0, m1 / 2), q2 = 0; path.push([q1, q2]);
    for (let k = 0; k < 8; k++) { q2 = Math.max(0, (m2 - q1) / 2); path.push([q1, q2]); q1 = Math.max(0, (m1 - q2) / 2); path.push([q1, q2]); }
    G.line(path, { c: GREY, w: 1.2, dash: '4 3', clip: true });
    G.dot(E.q1, E.q2, { c: COL.s3, r: 6 });
    G.legend([{ c: COL.s1, t: L.R1 }, { c: COL.s2, t: L.R2 }, { c: GREY, dash: '4 3', t: L.tat }], G.ml + 120, 16);
    return { svg: G.svg(L.brAria), read: L.brRead(E) };
  }
};
FIGS.nf = {
  state: { c: 20, n: 3 },
  controls: L => [
    { key: 'c', label: L.f.c, min: 0, max: 60, step: 5, fmt: v => String(v) },
    { key: 'n', label: L.f.n, min: 1, max: 20, step: 1, fmt: v => String(v) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = 100, c = s.c, P = n => (a + n * c) / (n + 1);
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 20, y0: 0, y1: 100, mt: 26, mb: 42 });
    G.axes({ xt: [1, 5, 10, 15, 20], yt: [0, 25, 50, 75, 100], xl: L.n, xf: v => String(v), yf: v => String(v) });
    G.seg(0, c, 20, c, { c: COL.s2, w: 1.8, dash: '6 4' });
    for (let n = 1; n <= 20; n++) G.dot(n, P(n), { c: n === s.n ? COL.s3 : COL.s1, r: n === s.n ? 6 : 4 });
    G.legend([{ c: COL.s1, box: true, t: L.pr }, { c: COL.s2, dash: '6 4', t: L.cm }], G.ml + 8, 16);
    const Pn = P(s.n), Q = a - Pn, eps = Pn / Q;
    return { svg: G.svg(L.nAria), read: L.nRead(s.n, Pn, (Pn - c) / Pn) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([60, 90, 120, 150, 180]); D.b = pick([0.5, 1, 1.5, 2, 3]); D.c1 = 3 * rint(1, 10); D.c2 = 3 * rint(1, 10);
    if (D.c1 === D.c2) continue;
    D.E = e3cournot(D.a, D.b, D.c1, D.c2);
    if (D.E.q1 <= 0.5 || D.E.q2 <= 0.5) continue;
    D.n = pick([3, 4, 5, 9]);
    break;
  }
  const E = D.E, a = D.a, b = D.b;
  D.Q = E.q1 + E.q2; D.s1 = E.q1 / D.Q; D.s2 = E.q2 / D.Q; D.eps = -(1 / b) * E.P / D.Q;
  D.SC = b * D.Q * D.Q / 2; D.W = D.SC + E.p1 + E.p2;
  D.cmin = Math.min(D.c1, D.c2); D.Qm = (a - D.cmin) / (2 * b); D.Pm = a - b * D.Qm; D.pim = (D.Pm - D.cmin) * D.Qm; D.SCm = b * D.Qm * D.Qm / 2; D.Wm = D.SCm + D.pim;
  D.Qc = (a - D.cmin) / b; D.SCc = b * D.Qc * D.Qc / 2; D.Wc = D.SCc;
  D.qn = (a - D.cmin) / ((D.n + 1) * b); D.Qn = D.n * D.qn; D.Pn = (a + D.n * D.cmin) / (D.n + 1);
  D.SCn = b * D.Qn * D.Qn / 2; D.SPn = D.n * (D.Pn - D.cmin) * D.qn; D.Wn = D.SCn + D.SPn;
  return D;
};
function e3graphBR(D, lang) {
  const fr = lang === 'fr', E = D.E, a = D.a, b = D.b, m1 = (a - D.c1) / b, m2 = (a - D.c2) / b, top = Math.max(m1, m2) * 1.05;
  const G = Plot({ w: 520, h: 420, x0: 0, x1: top, y0: 0, y1: top, mt: 26, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, top, 4), yt: ticks(0, top, 4), xl: 'q₁', yl: 'q₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  G.line([[m1 / 2, 0], [0, m1]], { c: COL.s1, w: 2.4, clip: true });
  G.line([[0, m2 / 2], [m2, 0]], { c: COL.s2, w: 2.4, clip: true });
  G.seg(E.q1, 0, E.q1, E.q2, { c: GREY, w: 1, dash: '3 3' }); G.seg(0, E.q2, E.q1, E.q2, { c: GREY, w: 1, dash: '3 3' });
  G.dot(E.q1, E.q2, { c: COL.s3, r: 6 }); G.text(E.q1, E.q2, 'E', { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12 });
  G.legend([{ c: COL.s1, t: 'R₁' }, { c: COL.s2, t: 'R₂' }], G.ml + 160, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Fonctions de réaction et équilibre' : 'Reaction functions and equilibrium') + '</div>';
}
function e3graphS(D, lang) {
  const fr = lang === 'fr', E = D.E, a = D.a, b = D.b, Qmax = a / b;
  const G = Plot({ w: 640, h: 320, x0: 0, x1: Qmax * 1.02, y0: 0, y1: a * 1.08, mt: 26, mb: 42 });
  G.axes({ xt: ticks(0, Qmax, 5), yt: ticks(0, a, 5), xl: 'Q', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.add(`<path d="M${G.X(0)} ${G.Y(a)} L${G.X(D.Q)} ${G.Y(E.P)} L${G.X(0)} ${G.Y(E.P)} Z" fill="${COL.s1}" fill-opacity="0.22"/>`);
  /* profits : entreprise 1 sur [0, q1], entreprise 2 sur [q1, Q] */
  G.add(`<rect x="${G.X(0)}" y="${G.Y(E.P)}" width="${G.X(E.q1) - G.X(0)}" height="${G.Y(D.c1) - G.Y(E.P)}" fill="#2e7d5b" fill-opacity="0.3"/>`);
  G.add(`<rect x="${G.X(E.q1)}" y="${G.Y(E.P)}" width="${G.X(D.Q) - G.X(E.q1)}" height="${G.Y(D.c2) - G.Y(E.P)}" fill="#2e7d5b" fill-opacity="0.18"/>`);
  G.add(`<path d="M${G.X(D.Q)} ${G.Y(E.P)} L${G.X(D.Qc)} ${G.Y(D.cmin)} L${G.X(D.Q)} ${G.Y(D.cmin)} Z" fill="${COL.s3}" fill-opacity="0.3"/>`);
  /* inefficacité productive : l'entreprise la plus coûteuse produit au-dessus du coût minimal */
  [[0, E.q1, D.c1], [E.q1, D.Q, D.c2]].forEach(r => { if (r[2] > D.cmin) G.add(`<rect x="${G.X(r[0])}" y="${G.Y(r[2])}" width="${G.X(r[1]) - G.X(r[0])}" height="${G.Y(D.cmin) - G.Y(r[2])}" fill="${COL.s3}" fill-opacity="0.3"/>`); });
  G.line([[0, a], [Qmax, 0]], { c: COL.s1, w: 2.2 });
  G.line([[0, D.c1], [D.Q, D.c1]], { c: COL.s2, w: 1.8 }); G.line([[0, D.c2], [D.Q, D.c2]], { c: COL.s2, w: 1.8, dash: '5 4' });
  G.line([[0, D.cmin], [Qmax, D.cmin]], { c: GREY, w: 1, dash: '3 3' });
  G.dot(D.Q, E.P, { c: COL.s1 }); G.text(D.Q, E.P, 'E', { dx: 8, dy: -6, anchor: 'start', bold: true, size: 12 });
  G.legend([{ c: COL.s1, box: true, o: 0.3, t: fr ? 'surplus des consommateurs' : 'consumer surplus' }, { c: '#2e7d5b', box: true, o: 0.35, t: fr ? 'profits (1 puis 2)' : 'profits (1 then 2)' }, { c: COL.s3, box: true, o: 0.4, t: fr ? 'perte sèche' : 'deadweight loss' }], G.ml + 8, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Surplus à l\'équilibre de Cournot' : 'Surplus at the Cournot equilibrium') + '</div>';
}
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Deux entreprises produisent un bien homogène dont la demande inverse est \(P(Q)=${D.a}-${cfx(D.b)}Q\), où \(Q=q_1+q_2\). Leurs coûts marginaux sont constants : \(c_1=${D.c1}\) et \(c_2=${D.c2}\), sans coût fixe. Elles choisissent simultanément leurs quantités.</div>
<div class="questions"><ol>
<li><div class="q-text">Écrivez le profit de chaque entreprise et déduisez-en sa fonction de réaction.</div></li>
<li><div class="q-text">Déterminez l'équilibre de Cournot : quantités, prix et profits.</div></li>
<li><div class="q-text">Représentez graphiquement les deux fonctions de réaction et l'équilibre.</div></li>
<li><div class="q-text">Calculez les parts de marché, l'élasticité de la demande au prix d'équilibre et l'indice de Lerner de chaque entreprise ; vérifiez que \(L_i=s_i/|\varepsilon|\).</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs et le surplus de chaque producteur à l'équilibre de Cournot, puis le surplus total. Comparez avec la fusion des deux entreprises en un monopole et avec la concurrence parfaite, et représentez les surplus de Cournot.</div></li>
<li><div class="q-text">On considère maintenant ${D.n} entreprises identiques, toutes de coût marginal ${D.cmin}. Déterminez l'équilibre de Cournot et la perte sèche. Que se passe-t-il quand le nombre d'entreprises augmente ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Two firms produce a homogeneous good whose inverse demand is \(P(Q)=${D.a}-${cfx(D.b)}Q\), where \(Q=q_1+q_2\). Their marginal costs are constant: \(c_1=${D.c1}\) and \(c_2=${D.c2}\), with no fixed cost. They choose their quantities simultaneously.</div>
<div class="questions"><ol>
<li><div class="q-text">Write each firm's profit and derive its reaction function.</div></li>
<li><div class="q-text">Determine the Cournot equilibrium: quantities, price and profits.</div></li>
<li><div class="q-text">Draw the two reaction functions and the equilibrium.</div></li>
<li><div class="q-text">Compute the market shares, the elasticity of demand at the equilibrium price and each firm's Lerner index; check that \(L_i=s_i/|\varepsilon|\).</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus and each producer's surplus at the Cournot equilibrium, then total surplus. Compare with a merger of the two firms into a monopoly and with perfect competition, and draw the Cournot surpluses.</div></li>
<li><div class="q-text">Now consider ${D.n} identical firms, all with marginal cost ${D.cmin}. Determine the Cournot equilibrium and the deadweight loss. What happens as the number of firms grows?</div></li>
</ol></div>`;
});
function e3sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], E = D.E, a = D.a, b = D.b, c1 = D.c1, c2 = D.c2, n4 = x => texT(x, 4), m = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), PS = T_(['PS', 'DWL']);
  const r1 = (a - c1) / (2 * b), r2 = (a - c2) / (2 * b), bx = b === 1 ? '' : texT(b, 2) + '\\times ';
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le profit de chaque entreprise est sa recette, au prix fixé par la demande totale, diminuée de son coût. Pour l\'entreprise 1 :', 'Each firm\'s profit is its revenue, at the price set by total demand, minus its cost. For firm 1:'])}
  \[\Pi_1(q_1,q_2)=(${a}-${cfx(b)}q_1-${cfx(b)}q_2)\,q_1-${c1}\,q_1\]
  ${T_(['Pour une quantité', 'For a given quantity'])} \(q_2\) ${T_(['de sa concurrente, l\'entreprise 1 choisit la quantité qui annule la dérivée de son profit ; on en déduit sa fonction de réaction :', 'of its rival, firm 1 chooses the quantity that sets the derivative of its profit to zero; this gives its reaction function:'])}
  \[\begin{aligned}\frac{\partial\Pi_1}{\partial q_1}=0&amp;\iff ${a}-${cfx(2 * b)}q_1-${cfx(b)}q_2-${c1}=0\\&amp;\iff q_1=R_1(q_2)=${n4(r1)}-\frac{q_2}{2}\end{aligned}\]
  ${T_(['Le même raisonnement, appliqué au profit', 'The same reasoning, applied to the profit'])} \(\Pi_2=(${a}-${cfx(b)}q_1-${cfx(b)}q_2)\,q_2-${c2}\,q_2\) ${T_(['de l\'entreprise 2, donne :', 'of firm 2, gives:'])}
  \[\frac{\partial\Pi_2}{\partial q_2}=0\iff q_2=R_2(q_1)=${n4(r2)}-\frac{q_1}{2}\]
  ${T_(['Dans les deux cas, la dérivée seconde vaut', 'In both cases, the second derivative is'])} \(-${n4(2 * b)}&lt;0\) : ${T_(['ce sont bien des maxima. Les fonctions de réaction sont décroissantes : plus la concurrente produit, moins chaque entreprise a intérêt à produire.', 'these are indeed maxima. The reaction functions are decreasing: the more the rival produces, the less each firm wants to produce.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['À l\'équilibre de Cournot, chaque entreprise joue sa meilleure réponse à la quantité de l\'autre. On reporte donc', 'At the Cournot equilibrium, each firm plays its best response to the other\'s quantity. We therefore substitute'])} \(R_2\) ${T_(['dans', 'into'])} \(R_1\) :
  \[\begin{aligned}q_1^*&amp;=${n4(r1)}-\frac12\Big(${n4(r2)}-\frac{q_1^*}{2}\Big)&amp;&amp;\text{${T_(['car', 'since'])} }q_2^*=R_2(q_1^*)\\\frac34\,q_1^*&amp;=${n4(r1)}-${n4(r2 / 2)}=${fqa(r1 - r2 / 2)}&amp;&amp;\text{${T_(['en regroupant les termes en', 'grouping the terms in'])} }q_1^*\\q_1^*&amp;=${fqa(E.q1)}\end{aligned}\]
  ${T_(['On en déduit la quantité de l\'entreprise 2 en reportant ce résultat dans sa fonction de réaction :', 'Firm 2\'s quantity follows by substituting this result into its reaction function:'])} \(q_2^*=${n4(r2)}-\frac{${n4(E.q1)}}{2}=${fqa(E.q2)}\). ${T_(['La production totale est', 'Total output is'])} \(Q^*=${fqa(D.Q)}\), ${T_(['et l\'on en déduit, d\'après la fonction de demande inverse, le prix d\'équilibre sur le marché :', 'and the inverse demand function then gives the equilibrium market price:'])}
  \[P^*=${a}-${bx}${n4(D.Q)}=${fqa(E.P)}\]
  ${T_(['Les profits sont alors les marges unitaires multipliées par les quantités :', 'Profits are then the unit margins times the quantities:'])}
  \[\Pi_1^*=(${n4(E.P)}-${c1})\times ${n4(E.q1)}=${fqa(E.p1)}\qquad\Pi_2^*=(${n4(E.P)}-${c2})\times ${n4(E.q2)}=${fqa(E.p2)}\]
  ${T_(['L\'entreprise au coût le plus bas produit davantage et gagne plus.', 'The lower-cost firm produces more and earns more.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La fonction de réaction de l\'entreprise 1 coupe l\'axe', 'Firm 1\'s reaction function crosses the'])} \(q_1\) ${T_(['en sa quantité de monopole', 'axis at its monopoly quantity'])} \(${n4(r1)}\) ${T_(['et l\'axe', 'and the'])} \(q_2\) ${T_(['en', 'axis at'])} \(${n4(2 * r1)}\) ; ${T_(['celle de l\'entreprise 2 coupe l\'axe', 'firm 2\'s crosses the'])} \(q_2\) ${T_(['en', 'axis at'])} \(${n4(r2)}\) ${T_(['et l\'axe', 'and the'])} \(q_1\) ${T_(['en', 'axis at'])} \(${n4(2 * r2)}\). ${T_(['L\'équilibre E est leur point d\'intersection :', 'Equilibrium E is their point of intersection:'])}</p>
  ${e3graphBR(D, lang)}
</div></li>
<li><div class="q-content">
  <p>${T_(['Les parts de marché sont', 'Market shares are'])} \(s_1=\frac{${n4(E.q1)}}{${n4(D.Q)}}=${fqa(D.s1)}\) ${T_(['et', 'and'])} \(s_2=${fqa(D.s2)}\). ${T_(['L\'élasticité de la demande au point d\'équilibre vaut', 'The elasticity of demand at the equilibrium point is'])} \(\varepsilon=-\frac{1}{${texT(b, 2)}}\cdot\frac{P^*}{Q^*}=-\frac{1}{${texT(b, 2)}}\times\frac{${n4(E.P)}}{${n4(D.Q)}}${eqa(D.eps)}\). ${T_(['On compare alors les indices de Lerner aux rapports', 'We then compare the Lerner indices with the ratios'])} \(s_i/|\varepsilon|\) :
  \[\begin{aligned}L_1&amp;=\frac{${n4(E.P)}-${c1}}{${n4(E.P)}}${eqa((E.P - c1) / E.P)}\qquad\frac{s_1}{|\varepsilon|}=\frac{${n4(D.s1)}}{${n4(-D.eps)}}${eqa(D.s1 / -D.eps)}\\L_2&amp;=\frac{${n4(E.P)}-${c2}}{${n4(E.P)}}${eqa((E.P - c2) / E.P)}\qquad\frac{s_2}{|\varepsilon|}=\frac{${n4(D.s2)}}{${n4(-D.eps)}}${eqa(D.s2 / -D.eps)}\end{aligned}\]
  ${T_(['Les deux expressions coïncident, ce qui découle de la condition du premier ordre', 'The two expressions coincide, which follows from the first-order condition'])} \(P^*-c_i=${cfx(b)}q_i^*\) ${T_(['divisée par', 'divided by'])} \(P^*\) : ${T_(['le pouvoir de marché d\'une entreprise croît avec sa part de marché.', 'a firm\'s market power grows with its market share.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix d\'équilibre, sur les quantités achetées :', 'Consumer surplus is the integral of the gap between inverse demand and the equilibrium price, over the quantities bought:'])}
  \[${SC}^*=\int_0^{${n4(D.Q)}}\big(${a}-${cfx(b)}q-${n4(E.P)}\big)\,dq=\Big[${n4(a - E.P)}\,q-${cfx(b / 2)}q^2\Big]_0^{${n4(D.Q)}}=${fqa(D.SC)}\]
  ${T_(['Le surplus de chaque producteur est l\'intégrale de l\'écart entre le prix et son coût marginal, sur les quantités qu\'il vend ; sans coût fixe, il est égal à son profit :', 'Each producer\'s surplus is the integral of the gap between the price and its marginal cost, over the quantities it sells; with no fixed cost, it equals its profit:'])}
  \[${SP}_1^*=\int_0^{${n4(E.q1)}}(${n4(E.P)}-${c1})\,dq=${fqa(E.p1)}\qquad ${SP}_2^*=\int_0^{${n4(E.q2)}}(${n4(E.P)}-${c2})\,dq=${fqa(E.p2)}\]
  ${T_(['Le surplus total de Cournot vaut donc', 'Total Cournot surplus is therefore'])} \(W^*=${m(D.SC)}+${m(E.p1)}+${m(E.p2)}=${fqa(D.W)}\). ${T_(['Si les deux entreprises fusionnaient, le monopole produirait avec la technologie la moins coûteuse,', 'If the two firms merged, the monopoly would produce with the cheaper technology,'])} \(c=${D.cmin}\) : \(Q^m=\frac{${a}-${D.cmin}}{${n4(2 * b)}}=${fqa(D.Qm)}\), ${T_(['et, d\'après la demande inverse,', 'and, from inverse demand,'])} \(P^m=${fqa(D.Pm)}\). ${T_(['En concurrence parfaite, le prix serait égal au plus bas coût marginal,', 'Under perfect competition, the price would equal the lowest marginal cost,'])} ${D.cmin}, ${T_(['pour une production', 'for an output of'])} \(Q^c=${fqa(D.Qc)}\). ${T_(['Les mêmes intégrales donnent :', 'The same integrals give:'])}</p>
  <div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>${T_(['Monopole (fusion)', 'Monopoly (merger)'])}</th><th>Cournot</th><th>${T_(['Concurrence parfaite', 'Perfect competition'])}</th></tr></thead><tbody>
  <tr><td>${T_(['Prix', 'Price'])}</td><td class="num">${fqt(D.Pm)}</td><td class="num">${fqt(E.P)}</td><td class="num">${fqt(D.cmin)}</td></tr>
  <tr><td>${T_(['Surplus des consommateurs', 'Consumer surplus'])}</td><td class="num">${fqt(D.SCm)}</td><td class="num">${fqt(D.SC)}</td><td class="num">${fqt(D.SCc)}</td></tr>
  <tr><td>${T_(['Surplus des producteurs', 'Producer surplus'])}</td><td class="num">${fqt(D.pim)}</td><td class="num">${fqt(E.p1 + E.p2)}</td><td class="num">${fqt(0)}</td></tr>
  <tr><td>${T_(['Surplus total', 'Total surplus'])}</td><td class="num">${fqt(D.Wm)}</td><td class="num">${fqt(D.W)}</td><td class="num">${fqt(D.Wc)}</td></tr>
  <tr><td>${T_(['Perte sèche', 'Deadweight loss'])}</td><td class="num">${fqt(D.Wc - D.Wm)}</td><td class="num">${fqt(D.Wc - D.W)}</td><td class="num">${fqt(0)}</td></tr></tbody></table></div>
  <p>${T_(['Le duopole se situe entre le monopole et la concurrence parfaite. Sa perte sèche a deux sources : la production est inférieure à celle de la concurrence parfaite, et une partie est réalisée par l\'entreprise la moins efficace, à un coût supérieur au coût minimal (rectangle rouge sur le graphique). La fusion augmente le profit total mais réduit le surplus des consommateurs et le surplus total.', 'The duopoly lies between monopoly and perfect competition. Its deadweight loss has two sources: output is below the perfectly competitive level, and part of it is produced by the less efficient firm, at a cost above the minimum cost (red rectangle in the graph). The merger raises total profit but lowers consumer surplus and total surplus.'])}</p>
  ${e3graphS(D, lang)}
</div></li>
<li><div class="q-content">
  <p>${T_(['En équilibre symétrique, chaque entreprise produit', 'In a symmetric equilibrium, each firm produces'])} \(q\) ${T_(['et la production totale est', 'and total output is'])} \(${D.n}\,q\). ${T_(['La condition du premier ordre d\'une entreprise s\'écrit alors', 'A firm\'s first-order condition then reads'])} \(${a}-${cfx(b)}(${D.n}+1)\,q-${D.cmin}=0\), ${T_(['d\'où :', 'hence:'])}
  \[q^*=\frac{${a}-${D.cmin}}{(${D.n}+1)\times ${texT(b, 2)}}=${fqa(D.qn)}\qquad Q^*=${D.n}\times ${n4(D.qn)}=${fqa(D.Qn)}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix d\'équilibre :', 'The inverse demand function then gives the equilibrium price:'])} \(P^*=${a}-${bx}${n4(D.Qn)}=${fqa(D.Pn)}\). ${T_(['La perte sèche est l\'aire du triangle compris entre la demande et le coût marginal, de', 'The deadweight loss is the area of the triangle between demand and marginal cost, from'])} \(Q^*\) ${T_(['à', 'to'])} \(Q^c\) :
  \[${PS}_{${D.n}}=\int_{${n4(D.Qn)}}^{${n4(D.Qc)}}\big(${a}-${cfx(b)}q-${D.cmin}\big)\,dq=\frac{${texT(b, 2)}}{2}\,(${n4(D.Qc)}-${n4(D.Qn)})^2=${fqa(D.Wc - D.Wn)}\]
  ${T_(['Quand', 'As'])} \(n\) ${T_(['augmente, la production totale', 'grows, total output'])} \(\frac{n}{n+1}Q^c\) ${T_(['se rapproche de', 'approaches'])} \(Q^c\), ${T_(['le prix tend vers le coût marginal et la perte sèche, proportionnelle à', 'the price tends to marginal cost and the deadweight loss, proportional to'])} \(\frac{1}{(n+1)^2}\), ${T_(['tend vers zéro : la concurrence parfaite est la limite de l\'oligopole de Cournot.', 'tends to zero: perfect competition is the limit of the Cournot oligopoly.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => e3sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => e3sol(D, 'en'))(D));