const GREY = '#8a857a';
const KBASE_FR = { 'k-badge': 'MICROÉCONOMIE', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer', 'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé', phSeed: 'auto', copy: 'Copier', copied: 'Copié', 'k-sub': '© Thomas Hossen – Version du 20 octobre 2026' };
const KBASE_EN = { 'k-badge': 'MICROECONOMICS', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate', 'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution', phSeed: 'auto', copy: 'Copy', copied: 'Copied', 'k-sub': '© Thomas Hossen – Version of 20 October 2026' };
const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : texT(x, d === undefined ? 4 : d) + '\\,';
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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 2 – Choix optimal et demandes', 'k-h1': 'Choix optimal du consommateur et fonctions de demande', 'k-coursetitle': 'Contrainte budgétaire, condition de tangence, lagrangien, demandes marshalliennes et solutions en coin', 'k-extitle': 'Choix optimal Cobb-Douglas, utilité indirecte et substituts parfaits', 'k-soltitle': 'Choix optimal Cobb-Douglas, utilité indirecte et substituts parfaits' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 2 – Optimal choice and demand', 'k-h1': 'Consumer\'s optimal choice and demand functions', 'k-coursetitle': 'Budget constraint, tangency condition, Lagrangian, Marshallian demands and corner solutions', 'k-extitle': 'Cobb-Douglas optimal choice, indirect utility and perfect substitutes', 'k-soltitle': 'Cobb-Douglas optimal choice, indirect utility and perfect substitutes' });

/* ---------- outils : Cobb-Douglas U = x1^al x2^be ---------- */
function p2cd(al, be, p1, p2, R) { const x1 = al / (al + be) * R / p1, x2 = be / (al + be) * R / p2; return { x1: x1, x2: x2, u: Math.pow(x1, al) * Math.pow(x2, be) }; }
function p2fig(al, be, cases, lang, o) {
  o = o || {};
  const fr = lang === 'fr', X1 = o.X1 || 12, Y1 = o.Y1 || 12;
  const G = Plot({ w: 520, h: 440, x0: 0, x1: X1, y0: 0, y1: Y1, mt: 26, mb: 42, ml: 46 });
  G.axes({ xt: ticks(0, X1, 4), yt: ticks(0, Y1, 4), xl: 'x₁', yl: 'x₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  cases.forEach((c, k) => {
    const col = k ? COL.s2 : COL.s1, O = p2cd(al, be, c.p1, c.p2, c.R);
    G.add(`<path d="M${G.X(0)} ${G.Y(0)} L${G.X(c.R / c.p1)} ${G.Y(0)} L${G.X(0)} ${G.Y(c.R / c.p2)} Z" fill="${col}" fill-opacity="${k ? 0.05 : 0.1}"/>`);
    G.line([[0, c.R / c.p2], [c.R / c.p1, 0]], { c: col, w: 2.2, clip: true });
    G.curve(x => Math.pow(O.u / Math.pow(x, al), 1 / be), 0.02, X1, { c: col, w: 1.6, dash: '6 4', clip: true }, 400);
    G.dot(O.x1, O.x2, { c: COL.s3, r: 6 }); G.text(O.x1, O.x2, c.lab || 'E', { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12 });
  });
  G.legend([{ c: COL.s1, t: fr ? 'droite de budget' : 'budget line' }, { c: COL.s1, dash: '6 4', t: fr ? 'courbe d\'indifférence' : 'indifference curve' }], G.ml + 60, 16);
  return '<div style="max-width:540px;margin:0 auto">' + G.svg(fr ? 'Choix optimal' : 'Optimal choice') + '</div>';
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez écrire la contrainte budgétaire, caractériser le panier optimal par la condition de tangence \(TMS=p_1/p_2\), le calculer par la méthode du lagrangien, en déduire les fonctions de demande marshalliennes et l'utilité indirecte, et traiter les solutions en coin des substituts parfaits et le cas des compléments parfaits.<br><br>
<strong>Pourquoi ?</strong> La fonction de demande, point de départ de toute analyse de marché, résulte du choix d'un consommateur qui fait au mieux avec son budget. Comprendre ce choix permet de prévoir la réaction de la demande aux prix et au revenu.<br><br>
<strong>Prérequis.</strong> Préférences et TMS (page 1), optimisation sous contrainte.
</div>
<p class="toc">Sommaire : <a href="#s1">1. La contrainte budgétaire</a> · <a href="#s2">2. La tangence</a> · <a href="#s3">3. Le lagrangien</a> · <a href="#s4">4. Cobb-Douglas</a> · <a href="#s5">5. Solutions en coin</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La contrainte budgétaire</div>
<p>Un consommateur dispose d'un revenu \(R\) et fait face aux prix \(p_1\) et \(p_2\). Les paniers accessibles vérifient \(p_1x_1+p_2x_2\le R\). La <em>droite de budget</em> \(p_1x_1+p_2x_2=R\) coupe les axes en \(R/p_1\) et \(R/p_2\) ; sa pente, \(-p_1/p_2\), est le prix relatif : le marché échange une unité de bien 1 contre \(p_1/p_2\) unités de bien 2. Une hausse du revenu déplace la droite parallèlement ; une hausse de \(p_1\) la fait pivoter autour de son intersection avec l'axe du bien 2.</p>

<div class="dossier-title" id="s2">2. La condition de tangence</div>
<p>Avec des préférences monotones, le consommateur dépense tout son revenu. S'il choisit un panier intérieur (les deux biens en quantités positives) et si ses préférences sont convexes, l'optimum est le point de la droite de budget tangent à une courbe d'indifférence :
\[TMS_{1,2}=\frac{Um_1}{Um_2}=\frac{p_1}{p_2}\]
Le taux auquel le consommateur est prêt à échanger les biens est égal au taux auquel le marché les échange. Sinon, il pourrait gagner en réallouant son budget : si \(TMS&gt;p_1/p_2\), le bien 1 lui apporte relativement plus que ce qu'il coûte, et il devrait en acheter davantage.</p>
<div class="ifig" data-fig="opt"></div>
<div class="fig-cap">Figure 1 — Choix optimal d'un consommateur d'utilité \(x_1^{0.4}x_2^{0.6}\) : la droite de budget (bleu) est tangente à la courbe d'indifférence la plus haute qu'elle touche (pointillés), au panier optimal (rouge). Faites varier les prix et le revenu : avec cette utilité, le consommateur consacre toujours 40 % de son revenu au bien 1.</div>

<div class="dossier-title" id="s3">3. La méthode du lagrangien</div>
<p>On maximise \(U(x_1,x_2)\) sous la contrainte \(p_1x_1+p_2x_2=R\). Le lagrangien est \(\mathcal{L}=U(x_1,x_2)+\lambda\,(R-p_1x_1-p_2x_2)\), et les conditions du premier ordre sont :
\[\frac{\partial U}{\partial x_1}=\lambda p_1,\qquad\frac{\partial U}{\partial x_2}=\lambda p_2,\qquad p_1x_1+p_2x_2=R\]
Le rapport des deux premières redonne la tangence. Le multiplicateur \(\lambda=\frac{Um_1}{p_1}=\frac{Um_2}{p_2}\) est l'utilité marginale du revenu : un euro de plus rapporte la même utilité, qu'il soit dépensé en bien 1 ou en bien 2.</p>

<div class="dossier-title" id="s4">4. Les demandes Cobb-Douglas</div>
<p>Pour \(U=x_1^\alpha x_2^\beta\), la tangence donne \(\frac{\alpha x_2}{\beta x_1}=\frac{p_1}{p_2}\), soit \(p_2x_2=\frac{\beta}{\alpha}p_1x_1\). En reportant dans la contrainte :
\[x_1^*(p_1,p_2,R)=\frac{\alpha}{\alpha+\beta}\cdot\frac{R}{p_1},\qquad x_2^*(p_1,p_2,R)=\frac{\beta}{\alpha+\beta}\cdot\frac{R}{p_2}\]
Ce sont les <em>demandes marshalliennes</em>. Le consommateur dépense une part fixe \(\frac{\alpha}{\alpha+\beta}\) de son revenu en bien 1, quels que soient les prix ; la demande d'un bien ne dépend pas du prix de l'autre. En reportant dans \(U\), on obtient l'<em>utilité indirecte</em> \(V(p_1,p_2,R)=U(x_1^*,x_2^*)\), utilité maximale atteignable, croissante en \(R\) et décroissante en chaque prix.</p>
<div class="ifig" data-fig="dem"></div>
<div class="fig-cap">Figure 2 — Courbe de demande du bien 1 déduite du choix optimal, \(x_1^*=\frac{0.4R}{p_1}\), pour deux revenus. Chaque point correspond à un panier optimal de la figure 1 ; une hausse du revenu déplace la courbe vers la droite.</div>

<div class="dossier-title" id="s5">5. Solutions en coin et compléments parfaits</div>
<p>Avec des substituts parfaits \(U=ax_1+bx_2\), les courbes d'indifférence sont des droites : il n'y a pas de tangence, sauf si les pentes sont égales. Le consommateur compare l'utilité par euro de chaque bien, \(a/p_1\) et \(b/p_2\), et dépense tout son revenu dans le bien le plus avantageux : c'est une <em>solution en coin</em>. Avec des compléments parfaits \(U=\min(ax_1,bx_2)\), l'optimum est au coin de la courbe en L, là où \(ax_1=bx_2\) : \(x_1^*=\frac{bR}{bp_1+ap_2}\). La condition \(TMS=p_1/p_2\) ne s'applique ni dans un cas ni dans l'autre.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Droite de budget \(p_1x_1+p_2x_2=R\), de pente \(-p_1/p_2\).</li>
<li>Optimum intérieur : \(TMS=p_1/p_2\) ; lagrangien : \(Um_i=\lambda p_i\), \(\lambda\) utilité marginale du revenu.</li>
<li>Cobb-Douglas : \(x_i^*=\frac{\alpha_i}{\alpha+\beta}\frac{R}{p_i}\), parts budgétaires constantes ; utilité indirecte \(V=U(x^*)\).</li>
<li>Substituts parfaits : solution en coin selon \(a/p_1\gtrless b/p_2\) ; compléments parfaits : \(ax_1=bx_2\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can write the budget constraint, characterise the optimal bundle by the tangency condition \(MRS=p_1/p_2\), compute it with the Lagrangian method, derive Marshallian demand functions and indirect utility, and handle the corner solutions of perfect substitutes and the case of perfect complements.<br><br>
<strong>Why?</strong> The demand function, the starting point of any market analysis, results from the choice of a consumer doing their best with their budget. Understanding this choice makes it possible to predict how demand reacts to prices and income.<br><br>
<strong>Prerequisites.</strong> Preferences and MRS (page 1), constrained optimisation.
</div>
<p class="toc">Contents: <a href="#s1">1. The budget constraint</a> · <a href="#s2">2. Tangency</a> · <a href="#s3">3. The Lagrangian</a> · <a href="#s4">4. Cobb-Douglas</a> · <a href="#s5">5. Corner solutions</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The budget constraint</div>
<p>A consumer has an income \(R\) and faces prices \(p_1\) and \(p_2\). Affordable bundles satisfy \(p_1x_1+p_2x_2\le R\). The <em>budget line</em> \(p_1x_1+p_2x_2=R\) crosses the axes at \(R/p_1\) and \(R/p_2\); its slope, \(-p_1/p_2\), is the relative price: the market trades one unit of good 1 for \(p_1/p_2\) units of good 2. A rise in income shifts the line in parallel; a rise in \(p_1\) rotates it around its intercept on the good-2 axis.</p>

<div class="dossier-title" id="s2">2. The tangency condition</div>
<p>With monotone preferences, the consumer spends all their income. If they choose an interior bundle (positive quantities of both goods) and preferences are convex, the optimum is the point of the budget line tangent to an indifference curve:
\[MRS_{1,2}=\frac{MU_1}{MU_2}=\frac{p_1}{p_2}\]
The rate at which the consumer is willing to trade the goods equals the rate at which the market trades them. Otherwise, they could gain by reallocating their budget: if \(MRS&gt;p_1/p_2\), good 1 brings them relatively more than it costs, and they should buy more of it.</p>
<div class="ifig" data-fig="opt"></div>
<div class="fig-cap">Figure 1 — Optimal choice of a consumer with utility \(x_1^{0.4}x_2^{0.6}\): the budget line (blue) is tangent to the highest indifference curve it touches (dashed), at the optimal bundle (red). Vary prices and income: with this utility, the consumer always spends 40% of their income on good 1.</div>

<div class="dossier-title" id="s3">3. The Lagrangian method</div>
<p>We maximise \(U(x_1,x_2)\) subject to \(p_1x_1+p_2x_2=R\). The Lagrangian is \(\mathcal{L}=U(x_1,x_2)+\lambda\,(R-p_1x_1-p_2x_2)\), and the first-order conditions are:
\[\frac{\partial U}{\partial x_1}=\lambda p_1,\qquad\frac{\partial U}{\partial x_2}=\lambda p_2,\qquad p_1x_1+p_2x_2=R\]
The ratio of the first two gives tangency again. The multiplier \(\lambda=\frac{MU_1}{p_1}=\frac{MU_2}{p_2}\) is the marginal utility of income: one more euro brings the same utility whether spent on good 1 or good 2.</p>

<div class="dossier-title" id="s4">4. Cobb-Douglas demands</div>
<p>For \(U=x_1^\alpha x_2^\beta\), tangency gives \(\frac{\alpha x_2}{\beta x_1}=\frac{p_1}{p_2}\), that is \(p_2x_2=\frac{\beta}{\alpha}p_1x_1\). Substituting into the constraint:
\[x_1^*(p_1,p_2,R)=\frac{\alpha}{\alpha+\beta}\cdot\frac{R}{p_1},\qquad x_2^*(p_1,p_2,R)=\frac{\beta}{\alpha+\beta}\cdot\frac{R}{p_2}\]
These are the <em>Marshallian demands</em>. The consumer spends a fixed share \(\frac{\alpha}{\alpha+\beta}\) of income on good 1, whatever the prices; the demand for one good does not depend on the other's price. Substituting into \(U\) gives <em>indirect utility</em> \(V(p_1,p_2,R)=U(x_1^*,x_2^*)\), the maximal attainable utility, increasing in \(R\) and decreasing in each price.</p>
<div class="ifig" data-fig="dem"></div>
<div class="fig-cap">Figure 2 — Demand curve for good 1 derived from the optimal choice, \(x_1^*=\frac{0.4R}{p_1}\), for two incomes. Each point corresponds to an optimal bundle of figure 1; a rise in income shifts the curve to the right.</div>

<div class="dossier-title" id="s5">5. Corner solutions and perfect complements</div>
<p>With perfect substitutes \(U=ax_1+bx_2\), indifference curves are straight lines: there is no tangency, unless slopes are equal. The consumer compares the utility per euro of each good, \(a/p_1\) and \(b/p_2\), and spends all their income on the better deal: this is a <em>corner solution</em>. With perfect complements \(U=\min(ax_1,bx_2)\), the optimum is at the corner of the L-shaped curve, where \(ax_1=bx_2\): \(x_1^*=\frac{bR}{bp_1+ap_2}\). The condition \(MRS=p_1/p_2\) applies in neither case.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Budget line \(p_1x_1+p_2x_2=R\), slope \(-p_1/p_2\).</li>
<li>Interior optimum: \(MRS=p_1/p_2\); Lagrangian: \(MU_i=\lambda p_i\), \(\lambda\) marginal utility of income.</li>
<li>Cobb-Douglas: \(x_i^*=\frac{\alpha_i}{\alpha+\beta}\frac{R}{p_i}\), constant budget shares; indirect utility \(V=U(x^*)\).</li>
<li>Perfect substitutes: corner solution according to \(a/p_1\gtrless b/p_2\); perfect complements: \(ax_1=bx_2\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { p1: 'Prix p₁', p2: 'Prix p₂', R: 'Revenu R', optRead: (O, R, p1) => `Panier optimal : <i>x</i><sub>1</sub> = <span class="v">${fmt(O.x1, 2)}</span>, <i>x</i><sub>2</sub> = <span class="v">${fmt(O.x2, 2)}</span> &nbsp;·&nbsp; part du budget en bien 1 : <span class="v">${fmt(100 * p1 * O.x1 / R, 0)} %</span>`, x1: 'quantité demandée x₁', pr: 'prix p₁', R1: 'R = 40', R2: 'R = 60', demAria: 'Courbes de demande du bien 1' };
I18N.en.f = { p1: 'Price p₁', p2: 'Price p₂', R: 'Income R', optRead: (O, R, p1) => `Optimal bundle: <i>x</i><sub>1</sub> = <span class="v">${fmt(O.x1, 2)}</span>, <i>x</i><sub>2</sub> = <span class="v">${fmt(O.x2, 2)}</span> &nbsp;·&nbsp; budget share of good 1: <span class="v">${fmt(100 * p1 * O.x1 / R, 0)}%</span>`, x1: 'quantity demanded x₁', pr: 'price p₁', R1: 'R = 40', R2: 'R = 60', demAria: 'Demand curves for good 1' };
FIGS.opt = {
  state: { p1: 4, p2: 4, R: 40 },
  controls: L => [{ key: 'p1', label: L.f.p1, min: 2, max: 10, step: 0.5, fmt: v => fmtT(v, 1) }, { key: 'p2', label: L.f.p2, min: 2, max: 10, step: 0.5, fmt: v => fmtT(v, 1) }, { key: 'R', label: L.f.R, min: 20, max: 60, step: 5, fmt: v => String(v) }],
  draw: function (s, lang) { const L = I18N[lang].f; return { svg: p2fig(0.4, 0.6, [{ p1: s.p1, p2: s.p2, R: s.R }], lang, { X1: 16, Y1: 16 }), read: L.optRead(p2cd(0.4, 0.6, s.p1, s.p2, s.R), s.R, s.p1) }; }
};
FIGS.dem = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, G = Plot({ w: 640, h: 280, x0: 0, x1: 12, y0: 0, y1: 10, mt: 26, mb: 42 });
    G.axes({ xt: [0, 3, 6, 9, 12], yt: [0, 2, 4, 6, 8, 10], xl: L.x1, yl: L.pr, xf: v => String(v), yf: v => String(v) });
    G.clip(); G.curve(x => 16 / x, 0.5, 12, { c: COL.s1, w: 2.4, clip: true }, 200); G.curve(x => 24 / x, 0.5, 12, { c: COL.s2, w: 2.4, clip: true }, 200);
    G.legend([{ c: COL.s1, t: L.R1 }, { c: COL.s2, t: L.R2 }], G.ml + 300, 16);
    return { svg: G.svg(L.demAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.al = pick([1, 2, 3]); D.be = pick([1, 2, 3]); D.p1 = rint(2, 8); D.p2 = rint(2, 8); D.R = 10 * rint(6, 20); D.k = pick([2, 0.5, 1.5]);
  D.O = p2cd(D.al, D.be, D.p1, D.p2, D.R); D.p1n = D.p1 * D.k; D.On = p2cd(D.al, D.be, D.p1n, D.p2, D.R);
  D.lam = D.al * D.O.u / D.O.x1 / D.p1;
  for (;;) { D.a = rint(1, 5); D.b = rint(1, 5); if (Math.abs(D.a / D.p1 - D.b / D.p2) > 0.02) break; }
  return D;
};
const p2U = D => String.raw`U(x_1,x_2)=x_1${D.al === 1 ? '' : '^{' + D.al + '}'}\,x_2${D.be === 1 ? '' : '^{' + D.be + '}'}`;
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un consommateur a pour fonction d'utilité \(${p2U(D)}\). Il dispose d'un revenu \(R=${D.R}\) et les prix sont \(p_1=${D.p1}\) et \(p_2=${D.p2}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Écrivez la contrainte budgétaire. Donnez les intersections de la droite de budget avec les axes et sa pente.</div></li>
<li><div class="q-text">Écrivez le lagrangien du problème du consommateur et les conditions du premier ordre. Montrez qu'elles impliquent l'égalité du TMS et du rapport des prix.</div></li>
<li><div class="q-text">Déduisez-en les fonctions de demande, le panier optimal, le niveau d'utilité atteint et la part du revenu consacrée à chaque bien. Calculez le multiplicateur de Lagrange et interprétez-le.</div></li>
<li><div class="q-text">Déterminez l'utilité indirecte \(V(p_1,p_2,R)\) et vérifiez sa valeur.</div></li>
<li><div class="q-text">Le prix du bien 1 passe à \(${texT(D.p1n, 2)}\). Déterminez le nouveau panier optimal et représentez graphiquement les deux droites de budget et les deux optimums.</div></li>
<li><div class="q-text">Un autre consommateur, de même revenu et face aux prix initiaux, a pour utilité \(W(x_1,x_2)=${D.a}\,x_1+${D.b}\,x_2\). Déterminez son panier optimal.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A consumer has utility function \(${p2U(D)}\). Their income is \(R=${D.R}\) and prices are \(p_1=${D.p1}\) and \(p_2=${D.p2}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Write the budget constraint. Give the intercepts of the budget line with the axes and its slope.</div></li>
<li><div class="q-text">Write the Lagrangian of the consumer's problem and the first-order conditions. Show that they imply the equality of the MRS and the price ratio.</div></li>
<li><div class="q-text">Deduce the demand functions, the optimal bundle, the utility level reached and the share of income spent on each good. Compute the Lagrange multiplier and interpret it.</div></li>
<li><div class="q-text">Determine the indirect utility \(V(p_1,p_2,R)\) and check its value.</div></li>
<li><div class="q-text">The price of good 1 changes to \(${texT(D.p1n, 2)}\). Determine the new optimal bundle and draw the two budget lines and the two optima.</div></li>
<li><div class="q-text">Another consumer, with the same income and facing the initial prices, has utility \(W(x_1,x_2)=${D.a}\,x_1+${D.b}\,x_2\). Determine their optimal bundle.</div></li>
</ol></div>`;
};
function p2sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], al = D.al, be = D.be, p1 = D.p1, p2 = D.p2, R = D.R, O = D.O, On = D.On, n = x => texT(x, 4), s = al + be;
  const TMS = T_(['TMS', 'MRS']);
  const pw = (v, e) => e === 1 ? v : `${v}^{${e}}`;
  const d1 = al === 1 ? '' : `${al}\\,`, d2 = be === 1 ? '' : `${be}\\,`;
  const mu1 = String.raw`${d1}${al - 1 === 0 ? '' : pw('x_1', al - 1)}\,${pw('x_2', be)}`, mu2 = String.raw`${d2}${pw('x_1', al)}\,${be - 1 === 0 ? '' : pw('x_2', be - 1)}`;
  const X1 = Math.max(R / p1, R / D.p1n) * 1.1, Y1 = R / p2 * 1.1;
  const corner1 = D.a / p1 > D.b / p2;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le consommateur ne peut pas dépenser plus que son revenu :', 'The consumer cannot spend more than their income:'])} \(${p1}\,x_1+${p2}\,x_2\le ${R}\). ${T_(['La droite de budget', 'The budget line'])} \(${p1}\,x_1+${p2}\,x_2=${R}\) ${T_(['coupe l\'axe du bien 1 en', 'crosses the good-1 axis at'])} \(R/p_1=${n(R / p1)}\) ${T_(['(tout le revenu en bien 1) et l\'axe du bien 2 en', '(all income on good 1) and the good-2 axis at'])} \(R/p_2=${n(R / p2)}\). ${T_(['En l\'écrivant', 'Writing it as'])} \(x_2=${n(R / p2)}-${n(p1 / p2)}\,x_1\), ${T_(['on lit sa pente', 'we read its slope'])} \(-p_1/p_2=-${n(p1 / p2)}\) : ${T_(['une unité de bien 1 coûte', 'one unit of good 1 costs'])} \(${n(p1 / p2)}\) ${T_(['unité(s) de bien 2.', 'unit(s) of good 2.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les préférences étant monotones, tout le revenu est dépensé. Le lagrangien est', 'Preferences being monotone, all income is spent. The Lagrangian is'])} \(\mathcal{L}=${pw('x_1', al)}\,${pw('x_2', be)}+\lambda\,(${R}-${p1}\,x_1-${p2}\,x_2)\), ${T_(['et ses dérivées partielles s\'annulent à l\'optimum :', 'and its partial derivatives vanish at the optimum:'])}
  \[\begin{aligned}\frac{\partial\mathcal{L}}{\partial x_1}&amp;=${mu1}-${p1}\,\lambda=0\\\frac{\partial\mathcal{L}}{\partial x_2}&amp;=${mu2}-${p2}\,\lambda=0\\\frac{\partial\mathcal{L}}{\partial\lambda}&amp;=${R}-${p1}\,x_1-${p2}\,x_2=0\end{aligned}\]
  ${T_(['En divisant la première condition par la deuxième, le multiplicateur disparaît et les puissances communes se simplifient :', 'Dividing the first condition by the second, the multiplier disappears and common powers cancel:'])}
  \[${TMS}_{1,2}=\frac{${al === 1 ? '' : al}\,x_2}{${be === 1 ? '' : be}\,x_1}=\frac{${p1}}{${p2}}=\frac{p_1}{p_2}\]
  ${T_(['À l\'optimum, le taux auquel le consommateur échange les biens est égal à celui du marché.', 'At the optimum, the rate at which the consumer trades the goods equals the market rate.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La tangence donne', 'Tangency gives'])} \(${p2}\,x_2=\frac{${be}}{${al}}\times ${p1}\,x_1\) : ${T_(['la dépense en bien 2 est', 'spending on good 2 is'])} \(\frac{${be}}{${al}}\) ${T_(['fois la dépense en bien 1. En reportant dans la contrainte,', 'times spending on good 1. Substituting into the constraint,'])} \(${p1}\,x_1\big(1+\frac{${be}}{${al}}\big)=${R}\), ${T_(['d\'où les fonctions de demande et le panier optimal :', 'hence the demand functions and the optimal bundle:'])}
  \[\begin{aligned}x_1^*&amp;=\frac{${al}}{${s}}\cdot\frac{R}{p_1}=\frac{${al}}{${s}}\times\frac{${R}}{${p1}}=${n(O.x1)}\\x_2^*&amp;=\frac{${be}}{${s}}\cdot\frac{R}{p_2}=\frac{${be}}{${s}}\times\frac{${R}}{${p2}}=${n(O.x2)}\end{aligned}\]
  ${T_(['Le niveau d\'utilité atteint est', 'The utility level reached is'])} \(U^*=${pw(n(O.x1), al)}\times ${pw(n(O.x2), be)}\approx ${n(O.u)}\). ${T_(['Le consommateur consacre', 'The consumer spends'])} \(\frac{${al}}{${s}}\approx ${texT(100 * al / s, 1)}\,\%\) ${T_(['de son revenu au bien 1 et', 'of income on good 1 and'])} \(${texT(100 * be / s, 1)}\,\%\) ${T_(['au bien 2, quels que soient les prix. D\'après la première condition, le multiplicateur vaut', 'on good 2, whatever the prices. From the first condition, the multiplier is'])} \(\lambda=\frac{${T_(['Um', 'MU'])}_1}{p_1}\approx ${n(D.lam)}\) : ${T_(['un euro de revenu supplémentaire augmenterait l\'utilité d\'environ', 'one extra euro of income would raise utility by about'])} \(${n(D.lam)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'utilité indirecte est l\'utilité du panier optimal, exprimée en fonction des prix et du revenu :', 'Indirect utility is the utility of the optimal bundle, expressed as a function of prices and income:'])}
  \[V(p_1,p_2,R)=${pw(String.raw`\Big(\frac{${al === 1 ? '' : al}R}{${s}p_1}\Big)`, al)}\,${pw(String.raw`\Big(\frac{${be === 1 ? '' : be}R}{${s}p_2}\Big)`, be)}=\frac{${[al, be].filter(v => v !== 1).map(v => pw(v, v)).join('\\,') || '1'}}{${pw(s, s)}}\cdot\frac{R^{${s}}}{${pw('p_1', al)}\,${pw('p_2', be)}}\]
  ${T_(['Elle est croissante en', 'It is increasing in'])} \(R\) ${T_(['et décroissante en chaque prix. Avec les valeurs de l\'énoncé, on retrouve', 'and decreasing in each price. With the values of the problem, we recover'])} \(V(${p1},${p2},${R})\approx ${n(O.u)}=U^*\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les fonctions de demande donnent directement le nouveau panier :', 'The demand functions directly give the new bundle:'])} \(x_1^*=\frac{${al}}{${s}}\times\frac{${R}}{${texT(D.p1n, 2)}}=${n(On.x1)}\) ${T_(['et', 'and'])} \(x_2^*=${n(On.x2)}\), ${T_(['inchangé : avec une utilité Cobb-Douglas, la demande d\'un bien ne dépend pas du prix de l\'autre. L\'utilité passe de', 'unchanged: with Cobb-Douglas utility, the demand for one good does not depend on the other\'s price. Utility goes from'])} \(${n(O.u)}\) ${T_(['à', 'to'])} \(${n(On.u)}\). ${T_(['La droite de budget pivote autour de son intersection avec l\'axe du bien 2 :', 'The budget line rotates around its intercept on the good-2 axis:'])}</p>
  ${p2fig(al, be, [{ p1: p1, p2: p2, R: R, lab: 'E' }, { p1: D.p1n, p2: p2, R: R, lab: 'E′' }], lang, { X1: X1, Y1: Y1 })}
</div></li>
<li><div class="q-content">
  <p>${T_(['Les biens sont pour lui des substituts parfaits : son TMS vaut', 'For this consumer the goods are perfect substitutes: their MRS is'])} \(\frac{${D.a}}{${D.b}}\) ${T_(['partout, et la condition de tangence ne s\'applique pas. Il compare l\'utilité procurée par un euro dépensé dans chaque bien :', 'everywhere, and the tangency condition does not apply. They compare the utility brought by one euro spent on each good:'])} \(\frac{a}{p_1}=\frac{${D.a}}{${p1}}\approx ${n(D.a / p1)}\) ${T_(['et', 'and'])} \(\frac{b}{p_2}=\frac{${D.b}}{${p2}}\approx ${n(D.b / p2)}\). ${corner1 ? T_(['Le bien 1 est le plus avantageux : il dépense tout son revenu en bien 1, soit', 'Good 1 is the better deal: they spend all their income on good 1, that is']) + ' \\(x_1^*=' + n(R / p1) + '\\), \\(x_2^*=0\\)' : T_(['Le bien 2 est le plus avantageux : il dépense tout son revenu en bien 2, soit', 'Good 2 is the better deal: they spend all their income on good 2, that is']) + ' \\(x_1^*=0\\), \\(x_2^*=' + n(R / p2) + '\\)'}. ${T_(['C\'est une solution en coin : le panier optimal est à une extrémité de la droite de budget.', 'This is a corner solution: the optimal bundle is at one end of the budget line.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => p2sol(D, 'fr');
I18N.en.sol = D => p2sol(D, 'en');
