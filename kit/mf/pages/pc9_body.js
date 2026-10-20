I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 9 – Équilibre général d\'échange', 'k-h1': 'Équilibre général d\'échange : la boîte d\'Edgeworth', 'k-coursetitle': 'Allocations, optimum de Pareto, courbe des contrats, équilibre walrasien et théorèmes du bien-être', 'k-extitle': 'Économie d\'échange à deux agents Cobb-Douglas', 'k-soltitle': 'Économie d\'échange à deux agents Cobb-Douglas' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 9 – General exchange equilibrium', 'k-h1': 'General exchange equilibrium: the Edgeworth box', 'k-coursetitle': 'Allocations, Pareto optimum, contract curve, Walrasian equilibrium and the welfare theorems', 'k-extitle': 'A two-agent Cobb-Douglas exchange economy', 'k-soltitle': 'A two-agent Cobb-Douglas exchange economy' });

/* ---------- outils : U_A = x^al y^(1-al), U_B = x^be y^(1-be), dotations (xa, ya), (xb, yb), p_y = 1 ---------- */
function p9eq(al, be, xa, ya, xb, yb) {
  const X = xa + xb, Y = ya + yb, p = (al * ya + be * yb) / ((1 - al) * xa + (1 - be) * xb);
  const IA = p * xa + ya, IB = p * xb + yb;
  const A = { x: al * IA / p, y: (1 - al) * IA }, B = { x: be * IB / p, y: (1 - be) * IB };
  const uA = (x, y) => Math.pow(x, al) * Math.pow(y, 1 - al), uB = (x, y) => Math.pow(x, be) * Math.pow(y, 1 - be);
  const cc = x => be * (1 - al) * Y * x / (al * (1 - be) * (X - x) + be * (1 - al) * x);
  return { X: X, Y: Y, p: p, IA: IA, IB: IB, A: A, B: B, uA: uA, uB: uB, cc: cc };
}
function p9box(al, be, xa, ya, xb, yb, lang, o) {
  o = o || {};
  const fr = lang === 'fr', E = p9eq(al, be, xa, ya, xb, yb), X = E.X, Y = E.Y;
  const G = Plot({ w: 520, h: 460, x0: 0, x1: X, y0: 0, y1: Y, mt: 40, mb: 42, ml: 46, mr: 46 });
  G.axes({ xt: ticks(0, X, 4), yt: ticks(0, Y, 4), xl: fr ? 'bien x de A' : 'good x of A', yl: fr ? 'bien y de A' : 'good y of A', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
  G.add(`<rect x="${G.X(0)}" y="${G.Y(Y)}" width="${G.X(X) - G.X(0)}" height="${G.Y(0) - G.Y(Y)}" fill="none" stroke="${COL.axis}"/>`);
  G.clip();
  const icA = u => G.curve(x => Math.pow(u / Math.pow(x, al), 1 / (1 - al)), 0.01 * X, X, { c: COL.s1, w: 1.8, clip: true }, 300);
  const icB = u => G.curve(x => Y - Math.pow(u / Math.pow(X - x, be), 1 / (1 - be)), 0, X * 0.99, { c: '#2e7d5b', w: 1.8, clip: true }, 300);
  icA(E.uA(xa, ya)); icB(E.uB(xb, yb));
  if (o.eq !== false) { icA(E.uA(E.A.x, E.A.y)); icB(E.uB(E.B.x, E.B.y)); G.line([[0, ya + E.p * xa], [xa + ya / E.p, 0]], { c: COL.ink, w: 1.4, dash: '6 4', clip: true }); }
  G.curve(E.cc, 0, X, { c: COL.s2, w: 2.6, clip: true }, 300);
  G.dot(xa, ya, { c: COL.s3, r: 6 }); G.text(xa, ya, 'ω', { dx: 9, dy: 14, anchor: 'start', bold: true, size: 13 });
  if (o.eq !== false) { G.dot(E.A.x, E.A.y, { c: COL.ink, r: 6 }); G.text(E.A.x, E.A.y, 'E', { dx: 9, dy: -7, anchor: 'start', bold: true, size: 13 }); }
  G.text(0, 0, 'O_A', { dx: -6, dy: 28, anchor: 'end', size: 11, c: COL.mute }); G.text(X, Y, 'O_B', { dx: 6, dy: -6, anchor: 'start', size: 11, c: COL.mute });
  G.legend([{ c: COL.s1, t: fr ? 'indifférence A' : 'indifference A' }, { c: '#2e7d5b', t: fr ? 'indifférence B' : 'indifference B' }, { c: COL.s2, t: fr ? 'contrats' : 'contracts' }, { c: COL.ink, dash: '6 4', t: 'budget' }], G.ml - 20, 16);
  return { svg: '<div style="max-width:540px;margin:0 auto">' + G.svg(fr ? 'Boîte d\'Edgeworth' : 'Edgeworth box') + '</div>', E: E };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez représenter une économie d'échange à deux agents et deux biens dans une boîte d'Edgeworth, caractériser les allocations optimales au sens de Pareto et la courbe des contrats, calculer un équilibre walrasien et énoncer les deux théorèmes du bien-être.<br><br>
<strong>Pourquoi ?</strong> L'équilibre partiel étudie un marché isolé. L'équilibre général étudie tous les marchés à la fois et leurs interdépendances. La boîte d'Edgeworth en est le modèle le plus simple ; elle montre comment les prix coordonnent les échanges et pourquoi l'équilibre concurrentiel est efficace.<br><br>
<strong>Prérequis.</strong> Choix optimal et demandes (page 2), équilibre partiel (page 8).
</div>
<p class="toc">Sommaire : <a href="#s1">1. La boîte</a> · <a href="#s2">2. Optimum de Pareto</a> · <a href="#s3">3. La courbe des contrats</a> · <a href="#s4">4. L'équilibre walrasien</a> · <a href="#s5">5. Les théorèmes du bien-être</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La boîte d'Edgeworth</div>
<p>Deux consommateurs A et B se partagent des quantités totales \(X\) et \(Y\) de deux biens. Chacun dispose d'une <em>dotation</em> initiale : \(\omega_A=(x_A^0,y_A^0)\) et \(\omega_B=(X-x_A^0,Y-y_A^0)\). Une <em>allocation</em> attribue un panier à chacun, sans gaspillage : \(x_A+x_B=X\) et \(y_A+y_B=Y\). On la représente par un point d'une boîte de largeur \(X\) et de hauteur \(Y\) : les quantités de A se lisent depuis le coin en bas à gauche, celles de B depuis le coin en haut à droite. Les courbes d'indifférence de B sont donc « retournées ».</p>

<div class="dossier-title" id="s2">2. Optimum de Pareto</div>
<p>Une allocation est un <em>optimum de Pareto</em> s'il est impossible d'améliorer la situation d'un agent sans détériorer celle de l'autre. À l'intérieur de la boîte, les courbes d'indifférence de A et de B passant par une allocation optimale sont tangentes :
\[TMS_A=TMS_B\]
Si les TMS diffèrent, les deux agents valorisent différemment les biens, et un échange au taux intermédiaire les avantage tous deux : les allocations situées dans la <em>lentille</em> formée par les deux courbes d'indifférence passant par la dotation sont préférées par les deux.</p>

<div class="dossier-title" id="s3">3. La courbe des contrats</div>
<p>L'ensemble des optimums de Pareto forme la <em>courbe des contrats</em>, qui relie les deux origines. Pour des utilités Cobb-Douglas \(U_A=x^\alpha y^{1-\alpha}\) et \(U_B=x^\beta y^{1-\beta}\), l'égalité des TMS, \(\frac{\alpha y_A}{(1-\alpha)x_A}=\frac{\beta(Y-y_A)}{(1-\beta)(X-x_A)}\), donne :
\[y_A=\frac{\beta(1-\alpha)\,Y\,x_A}{\alpha(1-\beta)(X-x_A)+\beta(1-\alpha)\,x_A}\]
Si \(\alpha=\beta\), c'est la diagonale de la boîte. Sur la courbe des contrats, les échanges mutuellement avantageux sont épuisés ; les points de la courbe situés dans la lentille forment le <em>cœur</em> de l'économie.</p>
<div class="ifig" data-fig="box"></div>
<div class="fig-cap">Figure 1 — Boîte d'Edgeworth avec \(U_A=x^{0.5}y^{0.5}\), \(U_B=x^{0.3}y^{0.7}\) et 10 unités de chaque bien. Le point rouge est la dotation, la courbe dorée la courbe des contrats, la droite pointillée la droite de budget aux prix d'équilibre, et E l'équilibre walrasien, où les deux courbes d'indifférence sont tangentes à la droite de budget. Déplacez la dotation : l'équilibre reste sur la courbe des contrats.</div>

<div class="dossier-title" id="s4">4. L'équilibre walrasien</div>
<p>Supposons qu'un commissaire-priseur annonce des prix \((p_x,p_y)\), et normalisons \(p_y=1\) (seuls les prix relatifs comptent). Chaque agent vend sa dotation à ces prix et choisit son panier optimal avec le revenu \(I=p\,x^0+y^0\). Un <em>équilibre walrasien</em> est un prix pour lequel les demandes totales sont égales aux ressources sur chaque marché. Avec des Cobb-Douglas, la demande de \(x\) de A est \(\frac{\alpha I_A}{p}\), et l'équilibre du marché du bien \(x\) donne :
\[p^*=\frac{\alpha\,y_A^0+\beta\,y_B^0}{(1-\alpha)\,x_A^0+(1-\beta)\,x_B^0}\]
Par la <em>loi de Walras</em>, la valeur des demandes nettes est nulle pour tout prix : si un marché est équilibré, l'autre l'est aussi.</p>
<div class="ifig" data-fig="excess"></div>
<div class="fig-cap">Figure 2 — Demande nette totale du bien \(x\) en fonction de son prix relatif, pour l'économie de la figure 1. Elle est positive quand le bien est trop bon marché et négative quand il est trop cher ; elle s'annule au prix d'équilibre. Le tâtonnement walrasien fait monter le prix tant que la demande nette est positive.</div>

<div class="dossier-title" id="s5">5. Les théorèmes du bien-être</div>
<p>Le <em>premier théorème</em> affirme que tout équilibre walrasien est un optimum de Pareto : à l'équilibre, chaque agent égalise son TMS au même prix relatif, donc les TMS sont égaux. Le <em>second théorème</em> affirme que, avec des préférences convexes, tout optimum de Pareto peut être atteint comme équilibre walrasien après une redistribution appropriée des dotations : l'efficacité peut être confiée au marché, et l'équité à des transferts forfaitaires.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Boîte d'Edgeworth : allocations sans gaspillage, A depuis le coin bas gauche, B depuis le coin haut droit.</li>
<li>Optimum de Pareto intérieur : \(TMS_A=TMS_B\) ; leur ensemble est la courbe des contrats.</li>
<li>Équilibre walrasien : prix qui équilibre les marchés ; loi de Walras : un marché équilibré suffit.</li>
<li>Premier théorème : l'équilibre est efficace ; second théorème : tout optimum est un équilibre après redistribution.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can represent a two-agent, two-good exchange economy in an Edgeworth box, characterise Pareto-optimal allocations and the contract curve, compute a Walrasian equilibrium and state the two welfare theorems.<br><br>
<strong>Why?</strong> Partial equilibrium studies a market in isolation. General equilibrium studies all markets at once and their interdependence. The Edgeworth box is its simplest model; it shows how prices coordinate trade and why the competitive equilibrium is efficient.<br><br>
<strong>Prerequisites.</strong> Optimal choice and demand (page 2), partial equilibrium (page 8).
</div>
<p class="toc">Contents: <a href="#s1">1. The box</a> · <a href="#s2">2. Pareto optimum</a> · <a href="#s3">3. The contract curve</a> · <a href="#s4">4. Walrasian equilibrium</a> · <a href="#s5">5. Welfare theorems</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The Edgeworth box</div>
<p>Two consumers A and B share total quantities \(X\) and \(Y\) of two goods. Each has an initial <em>endowment</em>: \(\omega_A=(x_A^0,y_A^0)\) and \(\omega_B=(X-x_A^0,Y-y_A^0)\). An <em>allocation</em> gives a bundle to each, without waste: \(x_A+x_B=X\) and \(y_A+y_B=Y\). It is represented by a point in a box of width \(X\) and height \(Y\): A's quantities are read from the bottom-left corner, B's from the top-right corner. B's indifference curves are therefore "upside down".</p>

<div class="dossier-title" id="s2">2. Pareto optimum</div>
<p>An allocation is a <em>Pareto optimum</em> if no agent can be made better off without making the other worse off. Inside the box, A's and B's indifference curves through an optimal allocation are tangent:
\[MRS_A=MRS_B\]
If the MRS differ, the two agents value the goods differently, and trading at an intermediate rate benefits both: the allocations inside the <em>lens</em> formed by the two indifference curves through the endowment are preferred by both.</p>

<div class="dossier-title" id="s3">3. The contract curve</div>
<p>The set of Pareto optima forms the <em>contract curve</em>, which joins the two origins. For Cobb-Douglas utilities \(U_A=x^\alpha y^{1-\alpha}\) and \(U_B=x^\beta y^{1-\beta}\), equal MRS, \(\frac{\alpha y_A}{(1-\alpha)x_A}=\frac{\beta(Y-y_A)}{(1-\beta)(X-x_A)}\), gives:
\[y_A=\frac{\beta(1-\alpha)\,Y\,x_A}{\alpha(1-\beta)(X-x_A)+\beta(1-\alpha)\,x_A}\]
If \(\alpha=\beta\), it is the diagonal of the box. On the contract curve, mutually beneficial trades are exhausted; the points of the curve inside the lens form the <em>core</em> of the economy.</p>
<div class="ifig" data-fig="box"></div>
<div class="fig-cap">Figure 1 — Edgeworth box with \(U_A=x^{0.5}y^{0.5}\), \(U_B=x^{0.3}y^{0.7}\) and 10 units of each good. The red dot is the endowment, the gold curve the contract curve, the dashed line the budget line at equilibrium prices, and E the Walrasian equilibrium, where both indifference curves are tangent to the budget line. Move the endowment: the equilibrium stays on the contract curve.</div>

<div class="dossier-title" id="s4">4. Walrasian equilibrium</div>
<p>Suppose an auctioneer announces prices \((p_x,p_y)\), and normalise \(p_y=1\) (only relative prices matter). Each agent sells their endowment at these prices and chooses their optimal bundle with income \(I=p\,x^0+y^0\). A <em>Walrasian equilibrium</em> is a price at which total demands equal resources in each market. With Cobb-Douglas utilities, A's demand for \(x\) is \(\frac{\alpha I_A}{p}\), and clearing the market for good \(x\) gives:
\[p^*=\frac{\alpha\,y_A^0+\beta\,y_B^0}{(1-\alpha)\,x_A^0+(1-\beta)\,x_B^0}\]
By <em>Walras's law</em>, the value of net demands is zero at any price: if one market clears, so does the other.</p>
<div class="ifig" data-fig="excess"></div>
<div class="fig-cap">Figure 2 — Total net demand for good \(x\) as a function of its relative price, for the economy of figure 1. It is positive when the good is too cheap and negative when it is too dear; it vanishes at the equilibrium price. Walrasian tâtonnement raises the price as long as net demand is positive.</div>

<div class="dossier-title" id="s5">5. The welfare theorems</div>
<p>The <em>first theorem</em> states that every Walrasian equilibrium is a Pareto optimum: in equilibrium, each agent equates their MRS to the same relative price, so the MRS are equal. The <em>second theorem</em> states that, with convex preferences, any Pareto optimum can be reached as a Walrasian equilibrium after a suitable redistribution of endowments: efficiency can be left to the market, and equity to lump-sum transfers.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Edgeworth box: allocations without waste, A from the bottom-left corner, B from the top-right corner.</li>
<li>Interior Pareto optimum: \(MRS_A=MRS_B\); their set is the contract curve.</li>
<li>Walrasian equilibrium: prices that clear the markets; Walras's law: one cleared market suffices.</li>
<li>First theorem: equilibrium is efficient; second theorem: any optimum is an equilibrium after redistribution.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { xa: 'Dotation de A en bien x', ya: 'Dotation de A en bien y', boxRead: E => `Prix d'équilibre <i>p</i>* = <span class="v">${fmt(E.p, 3)}</span> &nbsp;·&nbsp; A reçoit (<span class="v">${fmt(E.A.x, 2)}</span> ; <span class="v">${fmt(E.A.y, 2)}</span>), B (<span class="v">${fmt(E.B.x, 2)}</span> ; <span class="v">${fmt(E.B.y, 2)}</span>)`, p: 'prix relatif p', z: 'demande nette de x', exAria: 'Demande nette du bien x' };
I18N.en.f = { xa: 'A\'s endowment of good x', ya: 'A\'s endowment of good y', boxRead: E => `Equilibrium price <i>p</i>* = <span class="v">${fmt(E.p, 3)}</span> &nbsp;·&nbsp; A gets (<span class="v">${fmt(E.A.x, 2)}</span>; <span class="v">${fmt(E.A.y, 2)}</span>), B (<span class="v">${fmt(E.B.x, 2)}</span>; <span class="v">${fmt(E.B.y, 2)}</span>)`, p: 'relative price p', z: 'net demand for x', exAria: 'Net demand for good x' };
FIGS.box = {
  state: { xa: 8, ya: 2 },
  controls: L => [{ key: 'xa', label: L.f.xa, min: 1, max: 9, step: 0.5, fmt: v => fmtT(v, 1) }, { key: 'ya', label: L.f.ya, min: 1, max: 9, step: 0.5, fmt: v => fmtT(v, 1) }],
  draw: function (s, lang) { const B = p9box(0.5, 0.3, s.xa, s.ya, 10 - s.xa, 10 - s.ya, lang); return { svg: B.svg, read: I18N[lang].f.boxRead(B.E) }; }
};
FIGS.excess = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, al = 0.5, be = 0.3, xa = 8, ya = 2, xb = 2, yb = 8, E = p9eq(al, be, xa, ya, xb, yb);
    const z = p => al * (p * xa + ya) / p + be * (p * xb + yb) / p - 10;
    const G = Plot({ w: 640, h: 280, x0: 0, x1: 3, y0: -6, y1: 10, mt: 26, mb: 42 });
    G.axes({ xt: [0, 0.5, 1, 1.5, 2, 2.5, 3], yt: [-5, 0, 5, 10], xl: L.p, yl: L.z, xf: v => fmtT(v, 1), yf: v => String(v), xAxisAt: 0 });
    G.clip(); G.curve(z, 0.05, 3, { c: COL.s1, w: 2.4, clip: true }, 200); G.dot(E.p, 0, { c: COL.s3, r: 6 });
    return { svg: G.svg(L.exAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.al = pick([0.25, 0.4, 0.5, 0.6, 0.75]); D.be = pick([0.25, 0.4, 0.5, 0.6, 0.75]);
    D.xa = rint(1, 9); D.ya = rint(1, 9); D.xb = rint(1, 9); D.yb = rint(1, 9);
    if (D.al === D.be && rnd() < 0.7) continue;
    D.E = p9eq(D.al, D.be, D.xa, D.ya, D.xb, D.yb);
    D.tA = D.al * D.ya / ((1 - D.al) * D.xa); D.tB = D.be * D.yb / ((1 - D.be) * D.xb);
    if (Math.abs(D.tA - D.tB) < 0.2) continue;
    break;
  }
  const E = D.E;
  D.u0A = E.uA(D.xa, D.ya); D.u0B = E.uB(D.xb, D.yb); D.u1A = E.uA(E.A.x, E.A.y); D.u1B = E.uB(E.B.x, E.B.y);
  return D;
};
const p9U = (n, e) => String.raw`U_${n}(x,y)=x^{${texT(e, 2)}}\,y^{${texT(1 - e, 2)}}`;
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Deux consommateurs A et B échangent deux biens \(x\) et \(y\). Leurs utilités sont \(${p9U('A', D.al)}\) et \(${p9U('B', D.be)}\). A possède initialement \(\omega_A=(${D.xa}\,;\,${D.ya})\) et B \(\omega_B=(${D.xb}\,;\,${D.yb})\). On prend le bien \(y\) comme numéraire (\(p_y=1\)) et l'on note \(p\) le prix du bien \(x\).</div>
<div class="questions"><ol>
<li><div class="q-text">Quelles sont les dimensions de la boîte d'Edgeworth ? Calculez l'utilité de chaque agent à la dotation initiale.</div></li>
<li><div class="q-text">Calculez le TMS de chaque agent. Écrivez la condition d'optimalité au sens de Pareto et déduisez-en l'équation de la courbe des contrats.</div></li>
<li><div class="q-text">La dotation initiale est-elle un optimum de Pareto ? Dans quel sens les agents ont-ils intérêt à échanger ?</div></li>
<li><div class="q-text">Déterminez les demandes de chaque agent en fonction de \(p\), puis le prix d'équilibre walrasien et l'allocation d'équilibre.</div></li>
<li><div class="q-text">Vérifiez que le marché du bien \(y\) est aussi équilibré, que chaque agent gagne à l'échange et que l'équilibre est un optimum de Pareto. Quel théorème illustre-t-on ?</div></li>
<li><div class="q-text">Représentez la boîte d'Edgeworth : dotation, courbes d'indifférence, courbe des contrats, droite de budget d'équilibre et équilibre.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">Two consumers A and B trade two goods \(x\) and \(y\). Their utilities are \(${p9U('A', D.al)}\) and \(${p9U('B', D.be)}\). A initially owns \(\omega_A=(${D.xa}\,;\,${D.ya})\) and B \(\omega_B=(${D.xb}\,;\,${D.yb})\). Good \(y\) is the numéraire (\(p_y=1\)) and \(p\) denotes the price of good \(x\).</div>
<div class="questions"><ol>
<li><div class="q-text">What are the dimensions of the Edgeworth box? Compute each agent's utility at the initial endowment.</div></li>
<li><div class="q-text">Compute each agent's MRS. Write the Pareto-optimality condition and deduce the equation of the contract curve.</div></li>
<li><div class="q-text">Is the initial endowment a Pareto optimum? In which direction do the agents want to trade?</div></li>
<li><div class="q-text">Determine each agent's demands as functions of \(p\), then the Walrasian equilibrium price and the equilibrium allocation.</div></li>
<li><div class="q-text">Check that the market for good \(y\) also clears, that each agent gains from trade and that the equilibrium is a Pareto optimum. Which theorem does this illustrate?</div></li>
<li><div class="q-text">Draw the Edgeworth box: endowment, indifference curves, contract curve, equilibrium budget line and equilibrium.</div></li>
</ol></div>`;
};
function p9sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], al = D.al, be = D.be, E = D.E, X = E.X, Y = E.Y, n = x => texT(x, 4), ta = texT(al, 2), tb = texT(be, 2), ta1 = texT(1 - al, 2), tb1 = texT(1 - be, 2);
  const TMS = T_(['TMS', 'MRS']);
  const B = p9box(al, be, D.xa, D.ya, D.xb, D.yb, lang);
  const giveX = D.tA < D.tB;   /* A valorise relativement moins x : il cède du x contre du y */
  const cmp = (nm, u0, u1) => `\\(U_${nm}\\) : \\(${n(u0)}\\to ${n(u1)}\\)`;
  const tmsE = al * E.A.y / ((1 - al) * E.A.x), tmsEB = be * E.B.y / ((1 - be) * E.B.x);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Les ressources totales sont', 'Total resources are'])} \(X=${D.xa}+${D.xb}=${X}\) ${T_(['et', 'and'])} \(Y=${D.ya}+${D.yb}=${Y}\) : ${T_(['la boîte mesure', 'the box measures'])} \(${X}\times ${Y}\). ${T_(['La dotation est le point de coordonnées', 'The endowment is the point with coordinates'])} \((${D.xa}\,;\,${D.ya})\) ${T_(['depuis l\'origine de A. Les utilités initiales sont', 'from A\'s origin. Initial utilities are'])} \(U_A(\omega_A)=${D.xa}^{${ta}}\times ${D.ya}^{${ta1}}\approx ${n(D.u0A)}\) ${T_(['et', 'and'])} \(U_B(\omega_B)=${D.xb}^{${tb}}\times ${D.yb}^{${tb1}}\approx ${n(D.u0B)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Pour une Cobb-Douglas', 'For a Cobb-Douglas'])} \(x^ay^{1-a}\), ${T_(['le TMS vaut', 'the MRS is'])} \(\frac{a\,y}{(1-a)\,x}\) (${T_(['page 1', 'page 1'])}) : \(${TMS}_A=\frac{${ta}\,y_A}{${ta1}\,x_A}\) ${T_(['et', 'and'])} \(${TMS}_B=\frac{${tb}\,y_B}{${tb1}\,x_B}\). ${T_(['Une allocation intérieure est optimale au sens de Pareto si les courbes d\'indifférence sont tangentes, c\'est-à-dire si les TMS sont égaux. Avec', 'An interior allocation is Pareto optimal if the indifference curves are tangent, that is, if the MRS are equal. With'])} \(x_B=${X}-x_A\) ${T_(['et', 'and'])} \(y_B=${Y}-y_A\) :
  \[\frac{${ta}\,y_A}{${ta1}\,x_A}=\frac{${tb}\,(${Y}-y_A)}{${tb1}\,(${X}-x_A)}\iff y_A=\frac{${n(be * (1 - al) * Y)}\,x_A}{${n(al * (1 - be))}\,(${X}-x_A)+${n(be * (1 - al))}\,x_A}\]
  ${T_(['C\'est l\'équation de la courbe des contrats, qui relie les deux origines.', 'This is the equation of the contract curve, which joins the two origins.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['À la dotation,', 'At the endowment,'])} \(${TMS}_A=\frac{${ta}\times ${D.ya}}{${ta1}\times ${D.xa}}\approx ${n(D.tA)}\) ${T_(['et', 'and'])} \(${TMS}_B=\frac{${tb}\times ${D.yb}}{${tb1}\times ${D.xb}}\approx ${n(D.tB)}\). ${T_(['Les TMS diffèrent : la dotation n\'est pas un optimum de Pareto, et un échange peut améliorer la situation des deux agents.', 'The MRS differ: the endowment is not a Pareto optimum, and trade can make both agents better off.'])} ${giveX ? T_(['A est prêt à céder moins de y pour une unité de x que B : A a intérêt à vendre du x à B contre du y.', 'A is willing to give up less y for one unit of x than B: A should sell x to B in exchange for y.']) : T_(['A valorise relativement plus le bien x que B : A a intérêt à acheter du x à B en échange de y.', 'A values good x relatively more than B: A should buy x from B in exchange for y.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Au prix', 'At price'])} \(p\), ${T_(['A vend sa dotation et dispose du revenu', 'A sells their endowment and has income'])} \(I_A=${D.xa}\,p+${D.ya}\) ; ${T_(['B dispose de', 'B has'])} \(I_B=${D.xb}\,p+${D.yb}\). ${T_(['Les demandes Cobb-Douglas sont', 'Cobb-Douglas demands are'])} \(x_A=\frac{${ta}\,I_A}{p}\), \(y_A=${ta1}\,I_A\), \(x_B=\frac{${tb}\,I_B}{p}\), \(y_B=${tb1}\,I_B\). ${T_(['Le marché du bien x est équilibré si', 'The market for good x clears if'])}
  \[\begin{aligned}\frac{${ta}\,(${D.xa}p+${D.ya})+${tb}\,(${D.xb}p+${D.yb})}{p}&amp;=${X}\\(${X}-${n(al * D.xa + be * D.xb)})\,p&amp;=${n(al * D.ya + be * D.yb)}\\p^*&amp;=${n(E.p)}\end{aligned}\]
  ${T_(['On en déduit les revenus', 'Hence the incomes'])} \(I_A=${n(E.IA)}\) ${T_(['et', 'and'])} \(I_B=${n(E.IB)}\), ${T_(['puis l\'allocation d\'équilibre :', 'then the equilibrium allocation:'])} \(A=(${n(E.A.x)}\,;\,${n(E.A.y)})\), \(B=(${n(E.B.x)}\,;\,${n(E.B.y)})\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Marché du bien y :', 'Market for good y:'])} \(y_A+y_B=${n(E.A.y)}+${n(E.B.y)}=${n(E.A.y + E.B.y)}=Y\) : ${T_(['il est équilibré, comme le prévoit la loi de Walras. Les utilités augmentent :', 'it clears, as Walras\'s law predicts. Utilities rise:'])} ${cmp('A', D.u0A, D.u1A)} ${T_(['et', 'and'])} ${cmp('B', D.u0B, D.u1B)}. ${T_(['À l\'équilibre,', 'In equilibrium,'])} \(${TMS}_A=\frac{${ta}\times ${n(E.A.y)}}{${ta1}\times ${n(E.A.x)}}\approx ${n(tmsE)}\) ${T_(['et', 'and'])} \(${TMS}_B\approx ${n(tmsEB)}\), ${T_(['tous deux égaux au prix relatif', 'both equal to the relative price'])} \(p^*=${n(E.p)}\) : ${T_(['les TMS sont égaux, l\'équilibre est sur la courbe des contrats. C\'est le premier théorème du bien-être : l\'équilibre concurrentiel est un optimum de Pareto.', 'the MRS are equal, the equilibrium lies on the contract curve. This is the first welfare theorem: the competitive equilibrium is a Pareto optimum.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les courbes d\'indifférence de A (bleu) et de B (vert) passant par la dotation délimitent la lentille des échanges avantageux ; à l\'équilibre E, les deux courbes d\'indifférence sont tangentes entre elles et à la droite de budget, qui passe par la dotation avec la pente', 'A\'s (blue) and B\'s (green) indifference curves through the endowment delimit the lens of mutually beneficial trades; at equilibrium E, both indifference curves are tangent to each other and to the budget line, which goes through the endowment with slope'])} \(-p^*\) :</p>
  <div class="sol-fig">${B.svg}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => p9sol(D, 'fr');
I18N.en.sol = D => p9sol(D, 'en');
