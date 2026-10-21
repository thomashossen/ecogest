I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 8 – Concurrence spatiale', 'k-h1': 'Concurrence spatiale : Hotelling et Salop', 'k-coursetitle': 'Se différencier par la localisation : ville linéaire, prix d\'équilibre, choix de localisation et cercle de Salop', 'k-extitle': 'Duopole de Hotelling avec coûts de transport quadratiques', 'k-soltitle': 'Duopole de Hotelling avec coûts de transport quadratiques' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 8 – Spatial competition', 'k-h1': 'Spatial competition: Hotelling and Salop', 'k-coursetitle': 'Differentiating through location: the linear city, equilibrium prices, location choice and the Salop circle', 'k-extitle': 'Hotelling duopoly with quadratic transport costs', 'k-soltitle': 'Hotelling duopoly with quadratic transport costs' });

/* ---------- outils : ville [0,1], entreprises en x1 < x2, coût de transport t d^2, coût marginal c ---------- */
function e8eq(x1, x2, t, c) {
  const Dl = x2 - x1, m = (x1 + x2) / 2;
  const p1 = c + 2 * t * Dl * (1 + m) / 3, p2 = c + 2 * t * Dl * (2 - m) / 3, xh = (1 + m) / 3;
  const T = t * ((xh - x1) ** 3 + x1 ** 3) / 3 + t * ((x2 - xh) ** 3 + (1 - x2) ** 3) / 3;
  return { Dl: Dl, m: m, p1: p1, p2: p2, xh: xh, pi1: (p1 - c) * xh, pi2: (p2 - c) * (1 - xh), T: T };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez déterminer la demande de deux entreprises situées sur une ville linéaire, calculer les prix d'équilibre lorsque les consommateurs supportent un coût de transport, expliquer pourquoi les entreprises choisissent de s'éloigner l'une de l'autre, mesurer le surplus par le coût de transport total, et utiliser le modèle circulaire de Salop pour le nombre d'entreprises.<br><br>
<strong>Pourquoi ?</strong> La localisation n'est pas seulement géographique : la place d'un produit dans l'espace des caractéristiques (goût, design, gamme, ligne éditoriale) joue le même rôle. Le modèle de Hotelling (1929) est la référence de la différenciation horizontale.<br><br>
<strong>Prérequis.</strong> Bertrand (page 6), intégrales de polynômes.
</div>
<p class="toc">Sommaire : <a href="#s1">1. La ville linéaire</a> · <a href="#s2">2. Le consommateur indifférent</a> · <a href="#s3">3. Prix d'équilibre</a> · <a href="#s4">4. Choix de localisation</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. Le cercle de Salop</a> · <a href="#s7">7. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La ville linéaire</div>
<p>Des consommateurs, de masse 1, sont répartis uniformément sur le segment \([0,1]\). Chacun achète une unité du bien, qu'il valorise \(v\), assez élevé pour que tous achètent. Deux entreprises, de coût marginal \(c\), sont situées en \(x_1&lt;x_2\). Un consommateur situé en \(x\) qui achète à l'entreprise \(i\) paie le prix \(p_i\) et supporte un coût de transport \(t\,(x-x_i)^2\), quadratique en la distance. Il achète là où le <em>prix complet</em>, prix plus transport, est le plus bas.</p>

<div class="dossier-title" id="s2">2. Le consommateur indifférent</div>
<p>Le consommateur indifférent \(\hat x\) a le même prix complet chez les deux entreprises :
\[p_1+t(\hat x-x_1)^2=p_2+t(x_2-\hat x)^2\iff\hat x=\frac{x_1+x_2}{2}+\frac{p_2-p_1}{2t\,(x_2-x_1)}\]
Les consommateurs à gauche de \(\hat x\) achètent à l'entreprise 1, les autres à l'entreprise 2 : les demandes sont \(D_1=\hat x\) et \(D_2=1-\hat x\). Contrairement à Bertrand, une baisse de prix ne capte qu'une partie des clients du concurrent : la différenciation adoucit la concurrence.</p>

<div class="dossier-title" id="s3">3. Les prix d'équilibre</div>
<p>L'entreprise 1 maximise \((p_1-c)\,\hat x(p_1,p_2)\). En notant \(\Delta=x_2-x_1\) et \(m=\frac{x_1+x_2}{2}\), la condition du premier ordre donne une fonction de réaction croissante, \(p_1=\frac{p_2+c+2t\Delta m}{2}\), et de même \(p_2=\frac{p_1+c+2t\Delta(1-m)}{2}\). L'équilibre est :
\[p_1^*=c+\frac{2t\Delta(1+m)}{3},\qquad p_2^*=c+\frac{2t\Delta(2-m)}{3},\qquad\hat x^*=\frac{1+m}{3}\]
Aux deux extrémités (\(x_1=0\), \(x_2=1\)), on retrouve le résultat classique \(p_1^*=p_2^*=c+t\) : la marge est égale au coût de transport unitaire. Plus les entreprises sont éloignées et plus le transport est coûteux, plus les prix sont élevés.</p>
<div class="ifig" data-fig="hot"></div>
<div class="fig-cap">Figure 1 — Prix complet payé par un consommateur selon sa position, chez l'entreprise 1 (bleu) et chez l'entreprise 2 (doré), aux prix d'équilibre (\(t=1\), \(c=0\)). Chaque consommateur choisit la courbe la plus basse ; le consommateur indifférent est à leur intersection. Rapprochez les deux entreprises : leurs prix baissent fortement.</div>

<div class="dossier-title" id="s4">4. Le choix de localisation</div>
<p>Si les prix sont fixés et égaux, chaque entreprise a intérêt à se rapprocher du centre pour capter davantage de clients : c'est le <em>principe de différenciation minimale</em> de Hotelling, qui explique que des commerces ou des partis politiques se ressemblent. Mais si les prix sont choisis après les localisations, se rapprocher intensifie la concurrence en prix. Avec des coûts quadratiques, en remplaçant les prix par leurs valeurs d'équilibre, le profit de l'entreprise 1 vaut \(\Pi_1=\frac{2t\Delta(1+m)^2}{9}\), et :
\[\frac{\partial\Pi_1}{\partial x_1}=\frac{2t(1+m)}{9}\Big(\frac{x_2}{2}-1-\frac{3x_1}{2}\Big)&lt;0\]
L'entreprise 1 a toujours intérêt à s'éloigner vers 0, et symétriquement l'entreprise 2 vers 1 : c'est la <em>différenciation maximale</em> (d'Aspremont, Gabszewicz et Thisse, 1979). L'effet stratégique, des prix plus élevés, l'emporte sur l'effet de part de marché.</p>

<div class="dossier-title" id="s5">5. Surplus et coût de transport</div>
<p>Comme chaque consommateur achète une unité, les prix sont de simples transferts entre consommateurs et entreprises : le surplus total vaut \(v-c\) moins le coût de transport total. Ce coût est l'intégrale des coûts individuels :
\[T=\int_0^{\hat x}t(x-x_1)^2\,dx+\int_{\hat x}^{1}t(x_2-x)^2\,dx\]
Il est minimal quand chaque entreprise est au milieu de sa clientèle : en \(\frac14\) et \(\frac34\), avec \(\hat x=\frac12\), on obtient \(T=\frac{t}{48}\). Aux extrémités, \(T=\frac{t}{12}\), quatre fois plus : la différenciation maximale choisie par les entreprises est excessive du point de vue social.</p>

<div class="dossier-title" id="s6">6. Le cercle de Salop</div>
<p>Salop (1979) place \(n\) entreprises à égale distance sur un cercle de circonférence 1, avec un coût de transport linéaire \(t\,d\) et un coût fixe d'entrée \(F\). À l'équilibre symétrique, chaque entreprise vend \(\frac1n\) au prix \(p=c+\frac{t}{n}\). L'entrée se poursuit tant que le profit \(\frac{t}{n^2}-F\) est positif : le nombre d'entreprises en libre entrée est \(n^*=\sqrt{t/F}\). Le nombre socialement optimal, qui minimise coûts fixes et coûts de transport \(nF+\frac{t}{4n}\), vaut \(\frac12\sqrt{t/F}\) : la libre entrée conduit à deux fois trop d'entreprises.</p>
<div class="ifig" data-fig="salop"></div>
<div class="fig-cap">Figure 2 — Le cercle de Salop en libre entrée, pour \(t=1\). Diminuez le coût fixe d'entrée \(F\) : de nouvelles entreprises entrent, les prix baissent, mais le nombre d'entreprises reste deux fois supérieur à l'optimum social.</div>

<div class="dossier-title" id="s7">7. À retenir</div>
<ul class="kit-simple">
<li>Consommateur indifférent : \(\hat x=\frac{x_1+x_2}{2}+\frac{p_2-p_1}{2t(x_2-x_1)}\) ; demandes \(\hat x\) et \(1-\hat x\).</li>
<li>Aux extrémités, \(p_1^*=p_2^*=c+t\) ; plus de différenciation, des prix plus élevés.</li>
<li>Coûts quadratiques et prix choisis après la localisation : différenciation maximale, excessive socialement (optimum en \(\frac14\), \(\frac34\)).</li>
<li>Salop : \(p=c+\frac tn\), libre entrée \(n^*=\sqrt{t/F}\), deux fois l'optimum social.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can determine the demand of two firms located on a linear city, compute equilibrium prices when consumers bear a transport cost, explain why firms choose to move away from each other, measure surplus through total transport cost, and use the Salop circular model for the number of firms.<br><br>
<strong>Why?</strong> Location is not only geographical: a product's position in the space of characteristics (taste, design, range, editorial line) plays the same role. The Hotelling model (1929) is the reference for horizontal differentiation.<br><br>
<strong>Prerequisites.</strong> Bertrand (page 6), integrals of polynomials.
</div>
<p class="toc">Contents: <a href="#s1">1. The linear city</a> · <a href="#s2">2. The indifferent consumer</a> · <a href="#s3">3. Equilibrium prices</a> · <a href="#s4">4. Location choice</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. The Salop circle</a> · <a href="#s7">7. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The linear city</div>
<p>Consumers, of mass 1, are uniformly spread over the segment \([0,1]\). Each buys one unit of the good, which they value at \(v\), high enough for all to buy. Two firms, with marginal cost \(c\), are located at \(x_1&lt;x_2\). A consumer at \(x\) who buys from firm \(i\) pays the price \(p_i\) and bears a transport cost \(t\,(x-x_i)^2\), quadratic in distance. They buy where the <em>full price</em>, price plus transport, is lowest.</p>

<div class="dossier-title" id="s2">2. The indifferent consumer</div>
<p>The indifferent consumer \(\hat x\) faces the same full price at both firms:
\[p_1+t(\hat x-x_1)^2=p_2+t(x_2-\hat x)^2\iff\hat x=\frac{x_1+x_2}{2}+\frac{p_2-p_1}{2t\,(x_2-x_1)}\]
Consumers to the left of \(\hat x\) buy from firm 1, the others from firm 2: demands are \(D_1=\hat x\) and \(D_2=1-\hat x\). Unlike Bertrand, a price cut only captures part of the rival's customers: differentiation softens competition.</p>

<div class="dossier-title" id="s3">3. Equilibrium prices</div>
<p>Firm 1 maximises \((p_1-c)\,\hat x(p_1,p_2)\). Writing \(\Delta=x_2-x_1\) and \(m=\frac{x_1+x_2}{2}\), the first-order condition gives an increasing reaction function, \(p_1=\frac{p_2+c+2t\Delta m}{2}\), and likewise \(p_2=\frac{p_1+c+2t\Delta(1-m)}{2}\). The equilibrium is:
\[p_1^*=c+\frac{2t\Delta(1+m)}{3},\qquad p_2^*=c+\frac{2t\Delta(2-m)}{3},\qquad\hat x^*=\frac{1+m}{3}\]
At both ends (\(x_1=0\), \(x_2=1\)), the classic result \(p_1^*=p_2^*=c+t\) is recovered: the margin equals the unit transport cost. The further apart the firms and the costlier transport, the higher the prices.</p>
<div class="ifig" data-fig="hot"></div>
<div class="fig-cap">Figure 1 — Full price paid by a consumer depending on their position, at firm 1 (blue) and firm 2 (gold), at equilibrium prices (\(t=1\), \(c=0\)). Each consumer picks the lower curve; the indifferent consumer is at their intersection. Bring the two firms closer: their prices fall sharply.</div>

<div class="dossier-title" id="s4">4. Location choice</div>
<p>If prices are fixed and equal, each firm wants to move towards the centre to capture more customers: this is Hotelling's <em>principle of minimum differentiation</em>, which explains why shops or political parties look alike. But if prices are chosen after locations, moving closer intensifies price competition. With quadratic costs, replacing prices by their equilibrium values, firm 1's profit is \(\Pi_1=\frac{2t\Delta(1+m)^2}{9}\), and:
\[\frac{\partial\Pi_1}{\partial x_1}=\frac{2t(1+m)}{9}\Big(\frac{x_2}{2}-1-\frac{3x_1}{2}\Big)&lt;0\]
Firm 1 always wants to move away towards 0, and symmetrically firm 2 towards 1: this is <em>maximum differentiation</em> (d'Aspremont, Gabszewicz and Thisse, 1979). The strategic effect, higher prices, outweighs the market-share effect.</p>

<div class="dossier-title" id="s5">5. Surplus and transport cost</div>
<p>Since each consumer buys one unit, prices are mere transfers between consumers and firms: total surplus equals \(v-c\) minus total transport cost. This cost is the integral of individual costs:
\[T=\int_0^{\hat x}t(x-x_1)^2\,dx+\int_{\hat x}^{1}t(x_2-x)^2\,dx\]
It is minimal when each firm is in the middle of its clientele: at \(\frac14\) and \(\frac34\), with \(\hat x=\frac12\), we get \(T=\frac{t}{48}\). At the ends, \(T=\frac{t}{12}\), four times more: the maximum differentiation chosen by firms is socially excessive.</p>

<div class="dossier-title" id="s6">6. The Salop circle</div>
<p>Salop (1979) places \(n\) firms at equal distances on a circle of circumference 1, with a linear transport cost \(t\,d\) and a fixed entry cost \(F\). In the symmetric equilibrium, each firm sells \(\frac1n\) at price \(p=c+\frac{t}{n}\). Entry continues as long as profit \(\frac{t}{n^2}-F\) is positive: the free-entry number of firms is \(n^*=\sqrt{t/F}\). The socially optimal number, which minimises fixed and transport costs \(nF+\frac{t}{4n}\), is \(\frac12\sqrt{t/F}\): free entry leads to twice too many firms.</p>
<div class="ifig" data-fig="salop"></div>
<div class="fig-cap">Figure 2 — The Salop circle under free entry, for \(t=1\). Lower the fixed entry cost \(F\): new firms enter, prices fall, but the number of firms remains twice the social optimum.</div>

<div class="dossier-title" id="s7">7. Key points</div>
<ul class="kit-simple">
<li>Indifferent consumer: \(\hat x=\frac{x_1+x_2}{2}+\frac{p_2-p_1}{2t(x_2-x_1)}\); demands \(\hat x\) and \(1-\hat x\).</li>
<li>At the ends, \(p_1^*=p_2^*=c+t\); more differentiation, higher prices.</li>
<li>Quadratic costs and prices chosen after location: maximum differentiation, socially excessive (optimum at \(\frac14\), \(\frac34\)).</li>
<li>Salop: \(p=c+\frac tn\), free entry \(n^*=\sqrt{t/F}\), twice the social optimum.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  x1: 'Position de l\'entreprise 1', x2: 'Position de l\'entreprise 2', pos: 'position du consommateur x', f1: 'prix complet chez 1', f2: 'prix complet chez 2', hotAria: 'Prix complets le long de la ville linéaire',
  hotRead: (E) => `Prix : <span class="v">${fmt(E.p1, 3)}</span> et <span class="v">${fmt(E.p2, 3)}</span> &nbsp;·&nbsp; consommateur indifférent <span class="v">${fmt(E.xh, 3)}</span> &nbsp;·&nbsp; coût de transport total <span class="v">${fmt(E.T, 4)}</span>`,
  F: 'Coût fixe d\'entrée F', salAria: 'Cercle de Salop avec n entreprises',
  salRead: (n, p, no) => `Libre entrée : <i>n</i>* = <span class="v">${n}</span> entreprises, prix <span class="v">c + ${fmt(p, 3)}</span> &nbsp;·&nbsp; nombre socialement optimal ≈ <span class="v">${fmt(no, 1)}</span>`
};
I18N.en.f = {
  x1: 'Location of firm 1', x2: 'Location of firm 2', pos: 'consumer location x', f1: 'full price at 1', f2: 'full price at 2', hotAria: 'Full prices along the linear city',
  hotRead: (E) => `Prices: <span class="v">${fmt(E.p1, 3)}</span> and <span class="v">${fmt(E.p2, 3)}</span> &nbsp;·&nbsp; indifferent consumer <span class="v">${fmt(E.xh, 3)}</span> &nbsp;·&nbsp; total transport cost <span class="v">${fmt(E.T, 4)}</span>`,
  F: 'Fixed entry cost F', salAria: 'Salop circle with n firms',
  salRead: (n, p, no) => `Free entry: <i>n</i>* = <span class="v">${n}</span> firms, price <span class="v">c + ${fmt(p, 3)}</span> &nbsp;·&nbsp; socially optimal number ≈ <span class="v">${fmt(no, 1)}</span>`
};
FIGS.hot = {
  state: { x1: 0, x2: 1 },
  clamp: s => { if (s.x2 < s.x1 + 0.1) s.x2 = Math.min(1, s.x1 + 0.1); },
  controls: L => [
    { key: 'x1', label: L.f.x1, min: 0, max: 0.45, step: 0.05, fmt: v => fmtT(v, 2) },
    { key: 'x2', label: L.f.x2, min: 0.55, max: 1, step: 0.05, fmt: v => fmtT(v, 2) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, t = 1, E = e8eq(s.x1, s.x2, t, 0);
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 1, y0: 0, y1: 2.2, mt: 26, mb: 42 });
    G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.5, 1, 1.5, 2], xl: L.pos, xf: v => fmtT(v, 2), yf: v => fmtT(v, 1) });
    G.clip();
    const f1 = x => E.p1 + t * (x - s.x1) ** 2, f2 = x => E.p2 + t * (s.x2 - x) ** 2;
    G.area(G.sample(f1, 0, E.xh, 60), 0, { c: COL.s1, o: 0.1 }); G.area(G.sample(f2, E.xh, 1, 60), 0, { c: COL.s2, o: 0.12 });
    G.curve(f1, 0, 1, { c: COL.s1, w: 2.2, clip: true }, 120); G.curve(f2, 0, 1, { c: COL.s2, w: 2.2, clip: true }, 120);
    G.seg(E.xh, 0, E.xh, f1(E.xh), { c: GREY, w: 1, dash: '3 3' }); G.text(E.xh, 0, 'x̂', { dy: -6, dx: 6, anchor: 'start', size: 12 });
    G.dot(s.x1, 0, { c: COL.s1, r: 6 }); G.dot(s.x2, 0, { c: COL.s2, r: 6 });
    G.legend([{ c: COL.s1, t: L.f1 }, { c: COL.s2, t: L.f2 }], G.ml + 8, 16);
    return { svg: G.svg(L.hotAria), read: L.hotRead(E) };
  }
};
FIGS.salop = {
  state: { F: 0.02 },
  controls: L => [{ key: 'F', label: L.f.F, min: 0.005, max: 0.1, step: 0.005, fmt: v => fmtT(v, 3) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, t = 1, n = Math.max(1, Math.floor(Math.sqrt(t / s.F))), no = 0.5 * Math.sqrt(t / s.F);
    const W = 420, H = 300, cx = 210, cy = 150, R = 115;
    let svg = `<svg viewBox="0 0 ${W} ${H}" style="max-width:420px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${L.salAria}"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${COL.s1}" stroke-width="2.4"/>`;
    for (let k = 0; k < n; k++) { const th = -Math.PI / 2 + 2 * Math.PI * k / n; svg += `<circle cx="${cx + R * Math.cos(th)}" cy="${cy + R * Math.sin(th)}" r="7" fill="${COL.s2}" stroke="#fff" stroke-width="2"/>`; }
    svg += `<text x="${cx}" y="${cy + 5}" text-anchor="middle" ${FONT_T} font-size="15" font-weight="700" fill="${COL.ink}">n* = ${n}</text></svg>`;
    return { svg: svg, read: L.salRead(n, t / n, no) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.t = pick([2, 3, 4, 6, 9, 12]); D.c = pick([2, 4, 5, 10]); D.x1 = pick([0, 0.1, 0.2]); D.x2 = pick([0.7, 0.8, 0.9, 1]);
  if (D.x1 === 0 && D.x2 === 1) D.x2 = 0.9;
  D.E = e8eq(D.x1, D.x2, D.t, D.c);
  { const E = D.E, f1 = x => E.p1 + D.t * (x - D.x1) ** 2, f2 = x => E.p2 + D.t * (D.x2 - x) ** 2; D.v = Math.ceil(Math.max(f1(0), f2(1), f1(E.xh), D.c + 1.25 * D.t) + D.t); }
  const E = D.E;
  D.SC = D.v - (E.p1 * E.xh + E.p2 * (1 - E.xh)) - E.T; D.SP = E.pi1 + E.pi2; D.W = D.SC + D.SP;
  D.Wopt = D.v - D.c - D.t / 48;
  D.dPi1 = 2 * D.t * (1 + E.m) / 9 * (D.x2 / 2 - 1 - 1.5 * D.x1);
  D.Eext = e8eq(0, 1, D.t, D.c); D.Wext = D.v - D.c - D.t / 12;
  return D;
};
function e8graph(D, lang) {
  const fr = lang === 'fr', E = D.E, t = D.t, f1 = x => E.p1 + t * (x - D.x1) ** 2, f2 = x => E.p2 + t * (D.x2 - x) ** 2;
  const ymax = D.v * 1.05;
  const G = Plot({ w: 640, h: 320, x0: 0, x1: 1, y0: 0, y1: ymax, mt: 26, mb: 42 });
  G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: ticks(0, ymax, 5), xl: 'x', xf: v => fmtT(v, 2), yf: v => fmtT(v, 0) });
  G.clip();
  /* surplus des consommateurs : entre v et le prix complet ; coût de transport : entre le prix complet et le prix ; marge : entre le prix et c */
  const env = x => x <= E.xh ? f1(x) : f2(x), pr = x => x <= E.xh ? E.p1 : E.p2;
  const top = [], mid = [], bot = [];
  for (let k = 0; k <= 120; k++) { const x = k / 120; top.push([x, env(x)]); mid.push([x, pr(x)]); }
  G.add(`<path d="${G.pts([[0, D.v], [1, D.v]].concat(top.slice().reverse()))} Z" fill="${COL.s1}" fill-opacity="0.18"/>`);
  G.add(`<path d="${G.pts(top.concat(mid.slice().reverse()))} Z" fill="${COL.s3}" fill-opacity="0.28"/>`);
  G.add(`<path d="${G.pts(mid.concat([[1, D.c], [0, D.c]]))} Z" fill="#2e7d5b" fill-opacity="0.25"/>`);
  G.line([[0, D.v], [1, D.v]], { c: COL.ink, w: 1.4, dash: '6 4' }); G.text(1, D.v, 'v', { dx: -6, dy: -6, anchor: 'end', size: 12, italic: true });
  G.line([[0, D.c], [1, D.c]], { c: GREY, w: 1.2 }); G.text(1, D.c, 'c', { dx: -6, dy: -6, anchor: 'end', size: 12, italic: true });
  G.curve(f1, 0, 1, { c: COL.s1, w: 2.2, clip: true }, 120); G.curve(f2, 0, 1, { c: COL.s2, w: 2.2, clip: true }, 120);
  G.seg(E.xh, 0, E.xh, env(E.xh), { c: GREY, w: 1, dash: '3 3' });
  G.dot(D.x1, D.c, { c: COL.s1, r: 6 }); G.dot(D.x2, D.c, { c: COL.s2, r: 6 });
  G.legend([{ c: COL.s1, box: true, o: 0.25, t: fr ? 'surplus des consommateurs' : 'consumer surplus' }, { c: COL.s3, box: true, o: 0.35, t: fr ? 'coût de transport' : 'transport cost' }, { c: '#2e7d5b', box: true, o: 0.35, t: fr ? 'profits' : 'profits' }], G.ml + 8, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Prix complets et surplus' : 'Full prices and surplus') + '</div>';
}
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Des consommateurs de masse 1 sont répartis uniformément sur \([0,1]\). Chacun achète une unité d'un bien qu'il valorise \(v=${D.v}\). Deux entreprises, de coût marginal \(c=${D.c}\), sont situées en \(x_1=${fq(D.x1, 2)}\) et \(x_2=${fq(D.x2, 2)}\). Un consommateur situé en \(x\) qui achète à l'entreprise \(i\) supporte un coût de transport \(${D.t}\,(x-x_i)^2\). Les entreprises fixent simultanément leurs prix.</div>
<div class="questions"><ol>
<li><div class="q-text">Déterminez la position du consommateur indifférent, puis la demande adressée à chaque entreprise.</div></li>
<li><div class="q-text">Déterminez les fonctions de réaction, les prix d'équilibre, les parts de marché et les profits.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le coût de transport total, le surplus des consommateurs, le surplus des producteurs et le surplus total. Comparez avec l'optimum social, atteint avec des entreprises en \(\frac14\) et \(\frac34\).</div></li>
<li><div class="q-text">Représentez graphiquement les prix complets le long de la ville, le consommateur indifférent et la décomposition du surplus.</div></li>
<li><div class="q-text">L'entreprise 1 a-t-elle intérêt à se rapprocher de sa concurrente, une fois anticipé l'effet sur les prix ? Où les entreprises finiront-elles par se placer, et que deviennent alors les prix et le surplus total ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Consumers of mass 1 are uniformly spread over \([0,1]\). Each buys one unit of a good they value at \(v=${D.v}\). Two firms, with marginal cost \(c=${D.c}\), are located at \(x_1=${fq(D.x1, 2)}\) and \(x_2=${fq(D.x2, 2)}\). A consumer at \(x\) who buys from firm \(i\) bears a transport cost \(${D.t}\,(x-x_i)^2\). Firms set their prices simultaneously.</div>
<div class="questions"><ol>
<li><div class="q-text">Determine the location of the indifferent consumer, then the demand addressed to each firm.</div></li>
<li><div class="q-text">Determine the reaction functions, the equilibrium prices, the market shares and the profits.</div></li>
<li><div class="q-text">Compute, using integrals, total transport cost, consumer surplus, producer surplus and total surplus. Compare with the social optimum, reached with firms at \(\frac14\) and \(\frac34\).</div></li>
<li><div class="q-text">Draw the full prices along the city, the indifferent consumer and the breakdown of surplus.</div></li>
<li><div class="q-text">Does firm 1 want to move closer to its rival, once the effect on prices is anticipated? Where will the firms eventually locate, and what then happens to prices and total surplus?</div></li>
</ol></div>`;
});
function e8sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], E = D.E, t = D.t, c = D.c, x1 = D.x1, x2 = D.x2, n4 = x => texT(x, 4), m = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']);
  const k = 2 * t * E.Dl, r1 = (c + k * E.m) / 2, r2 = (c + k * (1 - E.m)) / 2;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le consommateur indifférent paie le même prix complet chez les deux entreprises. On résout cette égalité ; les termes en', 'The indifferent consumer pays the same full price at both firms. We solve this equality; the terms in'])} \(\hat x^2\) ${T_(['se simplifient :', 'cancel out:'])}
  \[\begin{aligned}p_1+${t}(\hat x-${n4(x1)})^2&amp;=p_2+${t}(${n4(x2)}-\hat x)^2\\p_1-${n4(2 * t * x1)}\,\hat x+${n4(t * x1 * x1)}&amp;=p_2-${n4(2 * t * x2)}\,\hat x+${n4(t * x2 * x2)}&amp;&amp;\text{${T_(['en développant', 'expanding'])}}\\\hat x&amp;=\frac{p_2-p_1+${n4(t * (x2 * x2 - x1 * x1))}}{${n4(2 * t * (x2 - x1))}}=${n4(E.m)}+\frac{p_2-p_1}{${n4(2 * t * E.Dl)}}\end{aligned}\]
  ${T_(['Les consommateurs situés entre 0 et', 'Consumers located between 0 and'])} \(\hat x\) ${T_(['achètent à l\'entreprise 1, les autres à l\'entreprise 2. Comme ils sont de masse 1 et uniformément répartis, les demandes sont', 'buy from firm 1, the others from firm 2. Since they have mass 1 and are uniformly spread, demands are'])} \(D_1=\hat x\) ${T_(['et', 'and'])} \(D_2=1-\hat x\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'entreprise 1 maximise', 'Firm 1 maximises'])} \(\Pi_1=(p_1-${c})\Big(${n4(E.m)}+\frac{p_2-p_1}{${n4(k)}}\Big)\). ${T_(['En annulant la dérivée par rapport à', 'Setting the derivative with respect to'])} \(p_1\)${T_(['', ' to zero'])} :
  \[\begin{aligned}${n4(E.m)}+\frac{p_2-p_1}{${n4(k)}}-\frac{p_1-${c}}{${n4(k)}}=0&amp;&amp;\text{${T_(['dérivée d\'un produit', 'derivative of a product'])}}\\p_1=R_1(p_2)=\frac{p_2}{2}+${n4(r1)}\end{aligned}\]
  ${T_(['De même, l\'entreprise 2 maximise', 'Likewise, firm 2 maximises'])} \((p_2-${c})(1-\hat x)\), ${T_(['ce qui donne', 'which gives'])} \(p_2=R_2(p_1)=\frac{p_1}{2}+${n4(r2)}\). ${T_(['Les fonctions de réaction sont croissantes : les prix sont des compléments stratégiques. En reportant', 'The reaction functions are increasing: prices are strategic complements. Substituting'])} \(R_2\) ${T_(['dans', 'into'])} \(R_1\) :
  \[\begin{aligned}p_1&amp;=\frac12\Big(\frac{p_1}{2}+${n4(r2)}\Big)+${n4(r1)}\iff\frac34\,p_1=${n4(r2 / 2 + r1)}\iff p_1^*=${fqa(E.p1)}\\p_2^*&amp;=\frac{${n4(E.p1)}}{2}+${n4(r2)}=${fqa(E.p2)}\end{aligned}\]
  ${T_(['On en déduit, d\'après la position du consommateur indifférent, les parts de marché', 'The position of the indifferent consumer then gives the market shares'])} \(\hat x^*=${n4(E.m)}+\frac{${n4(E.p2)}-${n4(E.p1)}}{${n4(k)}}=${fqa(E.xh)}\) ${T_(['et', 'and'])} \(1-\hat x^*=${fqa(1 - E.xh)}\), ${T_(['puis les profits :', 'then the profits:'])}
  \[\Pi_1^*=(${n4(E.p1)}-${c})\times ${n4(E.xh)}=${fqa(E.pi1)}\qquad\Pi_2^*=(${n4(E.p2)}-${c})\times ${n4(1 - E.xh)}=${fqa(E.pi2)}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le coût de transport total est la somme des coûts supportés par chaque consommateur, de part et d\'autre de', 'Total transport cost is the sum of the costs borne by each consumer, on either side of'])} \(\hat x\) :
  \[\begin{aligned}T&amp;=\int_0^{${n4(E.xh)}}${t}(x-${n4(x1)})^2\,dx+\int_{${n4(E.xh)}}^{1}${t}(${n4(x2)}-x)^2\,dx\\&amp;=${t}\Big[\frac{(x-${n4(x1)})^3}{3}\Big]_0^{${n4(E.xh)}}+${t}\Big[-\frac{(${n4(x2)}-x)^3}{3}\Big]_{${n4(E.xh)}}^{1}\\&amp;=${n4(t * ((E.xh - x1) ** 3 + x1 ** 3) / 3)}+${n4(t * ((x2 - E.xh) ** 3 + (1 - x2) ** 3) / 3)}=${fqa(E.T)}\end{aligned}\]
  ${T_(['Chaque consommateur retire', 'Each consumer obtains'])} \(v\) ${T_(['moins le prix complet. Le surplus des consommateurs est donc la valeur', 'minus the full price. Consumer surplus is therefore the value'])} \(v\) ${T_(['moins les dépenses et moins le coût de transport ; le surplus des producteurs est la somme des profits :', 'minus expenditure and minus transport cost; producer surplus is the sum of profits:'])}
  \[\begin{aligned}${SC}&amp;=${D.v}-(${n4(E.p1)}\times ${n4(E.xh)}+${n4(E.p2)}\times ${n4(1 - E.xh)})-${n4(E.T)}=${fqa(D.SC)}\\${SP}&amp;=${n4(E.pi1)}+${n4(E.pi2)}=${fqa(D.SP)}\\W&amp;=${SC}+${SP}=${n4(D.W)}=v-c-T\end{aligned}\]
  ${T_(['Les prix sont de simples transferts : seul le coût de transport réduit le surplus total. Avec des entreprises en', 'Prices are mere transfers: only transport cost reduces total surplus. With firms at'])} \(\frac14\) ${T_(['et', 'and'])} \(\frac34\), ${T_(['chaque consommateur va au plus proche, et', 'each consumer goes to the nearest one, and'])} \(T^{\text{opt}}=2\int_0^{1/2}${t}(x-\tfrac14)^2\,dx=\frac{${t}}{48}=${fqa(t / 48)}\), ${T_(['d\'où un surplus total optimal', 'hence an optimal total surplus'])} \(${n4(D.Wopt)}\). ${T_(['La perte due à la localisation actuelle est donc', 'The loss due to the current locations is therefore'])} \(${n4(D.Wopt - D.W)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les deux paraboles sont les prix complets chez chaque entreprise ; chaque consommateur suit la plus basse, et elles se croisent en', 'The two parabolas are the full prices at each firm; each consumer follows the lower one, and they cross at'])} \(\hat x\). ${T_(['Entre', 'Between'])} \(v\) ${T_(['et ce prix complet se trouve le surplus des consommateurs, entre le prix complet et le prix le coût de transport, entre le prix et', 'and this full price lies consumer surplus, between the full price and the price the transport cost, between the price and'])} \(c\) ${T_(['les profits :', 'the profits:'])}</p>
  ${e8graph(D, lang)}
</div></li>
<li><div class="q-content">
  <p>${T_(['En remplaçant les prix par leurs valeurs d\'équilibre, le profit de l\'entreprise 1 s\'écrit', 'Replacing prices by their equilibrium values, firm 1\'s profit reads'])} \(\Pi_1=\frac{2t\,(x_2-x_1)(1+m)^2}{9}\). ${T_(['Sa dérivée par rapport à', 'Its derivative with respect to'])} \(x_1\), ${T_(['aux positions actuelles, vaut :', 'at the current locations, is:'])}
  \[\frac{\partial\Pi_1}{\partial x_1}=\frac{2\times ${t}\times(1+${n4(E.m)})}{9}\Big(\frac{${n4(x2)}}{2}-1-\frac{3\times ${n4(x1)}}{2}\Big)=${n4(D.dPi1)}&lt;0\]
  ${T_(['Se rapprocher du centre réduirait le profit de l\'entreprise 1 : l\'effet stratégique, une concurrence en prix plus vive, l\'emporte sur le gain de clientèle. Ce signe négatif vaut pour toutes les positions : l\'entreprise 1 s\'éloigne jusqu\'en 0, et symétriquement l\'entreprise 2 jusqu\'en 1. Les prix deviennent alors', 'Moving towards the centre would reduce firm 1\'s profit: the strategic effect, fiercer price competition, outweighs the gain in customers. This negative sign holds for all locations: firm 1 moves away to 0, and symmetrically firm 2 to 1. Prices then become'])} \(p_1=p_2=c+t=${fqa(D.Eext.p1)}\), ${T_(['et le coût de transport total', 'and total transport cost'])} \(\frac{t}{12}=${fqa(t / 12)}\) : ${T_(['le surplus total tombe à', 'total surplus falls to'])} \(${n4(D.Wext)}\). ${T_(['La différenciation maximale profite aux entreprises, mais elle est excessive du point de vue social.', 'Maximum differentiation benefits firms, but it is socially excessive.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => e8sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => e8sol(D, 'en'))(D));