/* ============================================================
   PAGE ei1 — Le monopole : tarification, pouvoir de marché et taxe
   ============================================================ */
const GREY = '#8a857a';
const KBASE_FR = { 'k-badge': 'MICROÉCONOMIE', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer', 'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé', phSeed: 'auto', copy: 'Copier', copied: 'Copié', 'k-sub': '© Thomas Hossen – Version du 20 octobre 2026' };
const KBASE_EN = { 'k-badge': 'MICROECONOMICS', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate', 'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution', phSeed: 'auto', copy: 'Copy', copied: 'Copied', 'k-sub': '© Thomas Hossen – Version of 20 October 2026' };
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 1 – Le monopole', 'k-h1': 'Le monopole', 'k-coursetitle': 'Fixer son prix quand on est seul sur le marché : recette marginale, pouvoir de marché et perte sèche', 'k-extitle': 'Optimum du monopole, indice de Lerner, surplus et taxe', 'k-soltitle': 'Optimum du monopole, indice de Lerner, surplus et taxe' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 1 – Monopoly', 'k-h1': 'Monopoly', 'k-coursetitle': 'Setting the price as the only seller: marginal revenue, market power and deadweight loss', 'k-extitle': 'Monopoly optimum, Lerner index, surplus and tax', 'k-soltitle': 'Monopoly optimum, Lerner index, surplus and tax' });

/* ---------- outils : demande P = a - bQ, coût C(Q) = cQ + dQ^2 + F ---------- */
function e1solve(a, b, c, d, t) {
  t = t || 0;
  const Qm = (a - c - t) / (2 * b + 2 * d), Pm = a - b * Qm;            /* Rm = a - 2bQ = c + 2dQ + t */
  const Qc = (a - c - t) / (b + 2 * d), Pc = a - b * Qc;                /* P = Cm + t */
  const Qo = (a - c) / (b + 2 * d), Po = a - b * Qo;                     /* optimum social sans taxe */
  /* surplus total sans taxe en fonction de Q : aire entre demande et coût marginal */
  const W = Q => (a - c) * Q - (b / 2 + d) * Q * Q;
  return { Qm: Qm, Pm: Pm, Qc: Qc, Pc: Pc, Qo: Qo, Po: Po, W: W, cmM: c + 2 * d * Qm };
}

const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : texT(x, d === undefined ? 4 : d) + '\\,';
/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez calculer la recette marginale d'un monopole, déterminer sa quantité et son prix optimaux, mesurer son pouvoir de marché par l'indice de Lerner, chiffrer la perte sèche qu'il impose à la collectivité et analyser l'effet d'une taxe sur la production.<br><br>
<strong>Pourquoi ?</strong> Brevets, réseaux, ressources rares, économies d'échelle : bien des marchés sont dominés par une seule entreprise. Le monopole est aussi le point de départ de toute l'économie industrielle : les modèles d'oligopole se situent entre lui et la concurrence parfaite.<br><br>
<strong>Prérequis.</strong> Dérivées, élasticité-prix de la demande, surplus.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Recette marginale</a> · <a href="#s2">2. Le choix du monopole</a> · <a href="#s3">3. Pouvoir de marché</a> · <a href="#s4">4. Perte sèche</a> · <a href="#s5">5. Une taxe sur le monopole</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Recette totale et recette marginale</div>
<p>Le monopole fait face à toute la demande du marché. Choisir la quantité \(Q\), c'est donc choisir le prix \(P(Q)\) auquel elle s'écoule. Sa recette totale et sa recette marginale sont :
\[RT(Q)=P(Q)\,Q,\qquad Rm(Q)=RT'(Q)=P(Q)+P'(Q)\,Q\]
Comme la demande est décroissante, \(P'(Q)&lt;0\) : vendre une unité de plus rapporte son prix, mais oblige à baisser le prix de toutes les unités déjà vendues. La recette marginale est donc inférieure au prix. Pour une demande linéaire \(P(Q)=a-bQ\), on a \(RT(Q)=aQ-bQ^2\) et :
\[Rm(Q)=a-2bQ\]
La droite de recette marginale a la même ordonnée à l'origine que la demande et une pente deux fois plus forte.</p>

<div class="dossier-title" id="s2">2. Le choix du monopole</div>
<p>Avec une fonction de coût \(C(Q)\), le profit est \(\Pi(Q)=RT(Q)-C(Q)\). La condition du premier ordre égalise recette marginale et coût marginal :
\[\Pi'(Q)=0\iff Rm(Q)=Cm(Q)\]
La condition du second ordre, \(\Pi''(Q)=Rm'(Q)-Cm'(Q)&lt;0\), est vérifiée dès que la recette marginale décroît plus vite que le coût marginal. Pour \(P=a-bQ\) et \(C(Q)=cQ+dQ^2+F\), on obtient :
\[a-2bQ=c+2dQ\iff Q^m=\frac{a-c}{2(b+d)},\qquad P^m=a-bQ^m\]
Le coût fixe \(F\) n'intervient pas dans le choix de \(Q\) ; il décide seulement si le monopole a intérêt à produire, c'est-à-dire si \(\Pi(Q^m)\ge 0\).</p>
<div class="ifig" data-fig="mono"></div>
<div class="fig-cap">Figure 1 — Demande (bleu), recette marginale (pointillés) et coût marginal (doré). Le monopole produit là où la recette marginale coupe le coût marginal et vend au prix lu sur la demande. Le rectangle vert est son profit hors coût fixe, le triangle rouge la perte sèche par rapport à la concurrence parfaite. Faites varier le coût marginal et sa pente.</div>

<div class="dossier-title" id="s3">3. Pouvoir de marché et indice de Lerner</div>
<p>En écrivant \(Rm=P\big(1+\frac{Q}{P}P'(Q)\big)=P\big(1-\frac{1}{|\varepsilon|}\big)\), où \(\varepsilon\) est l'élasticité-prix de la demande, la condition \(Rm=Cm\) devient :
\[L:=\frac{P-Cm}{P}=\frac{1}{|\varepsilon|}\]
L'indice de Lerner \(L\) mesure le taux de marge du monopole : il est d'autant plus élevé que la demande est peu élastique. Comme \(Cm\ge 0\), on a \(L\le 1\), donc \(|\varepsilon|\ge 1\) : un monopole se place toujours sur la partie élastique de la demande. Sur la partie inélastique, une baisse de la quantité augmenterait la recette tout en réduisant les coûts.</p>

<div class="dossier-title" id="s4">4. Surplus et perte sèche</div>
<p>En concurrence parfaite, le prix serait égal au coût marginal : \(P(Q)=Cm(Q)\), soit \(Q^c=\frac{a-c}{b+2d}\), quantité qui maximise le surplus total. Le monopole produit moins, \(Q^m&lt;Q^c\), et vend plus cher. Une partie du surplus des consommateurs devient du profit, ce qui est un transfert ; mais les unités entre \(Q^m\) et \(Q^c\), que les consommateurs valorisent plus que leur coût, ne sont plus produites. Leur valeur perdue est la <em>perte sèche</em> :
\[PS=\int_{Q^m}^{Q^c}\big(P(Q)-Cm(Q)\big)\,dQ\]
Avec une demande et un coût marginal linéaires, c'est l'aire d'un triangle : \(\frac{1}{2}(Q^c-Q^m)\big(P^m-Cm(Q^m)\big)\).</p>

<div class="dossier-title" id="s5">5. Une taxe sur la production du monopole</div>
<p>Une taxe unitaire \(t\) sur chaque unité vendue s'ajoute au coût marginal. Le monopole égalise désormais \(Rm(Q)\) et \(Cm(Q)+t\) :
\[Q^m_t=\frac{a-c-t}{2(b+d)},\qquad P^m_t-P^m=\frac{b}{2(b+d)}\,t\]
Avec un coût marginal constant (\(d=0\)), le prix n'augmente que de la moitié de la taxe, alors qu'en concurrence parfaite il augmenterait de toute la taxe. Le monopole absorbe une partie de la taxe sur sa marge. La taxe réduit encore la quantité : elle ajoute une perte sèche à celle du monopole, et rapporte à l'État \(t\,Q^m_t\).</p>
<div class="ifig" data-fig="tax"></div>
<div class="fig-cap">Figure 2 — Effet d'une taxe unitaire sur le prix payé par les consommateurs, en monopole (bleu) et en concurrence parfaite (doré), avec un coût marginal constant. La pente de la droite du monopole est \(\frac{1}{2}\) : il répercute la moitié de la taxe. Augmentez la pente du coût marginal : la répercussion diminue encore.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Recette marginale \(Rm=P+P'(Q)Q&lt;P\) ; pour \(P=a-bQ\), \(Rm=a-2bQ\).</li>
<li>Le monopole choisit \(Rm=Cm\), produit moins qu'en concurrence parfaite et vend plus cher.</li>
<li>Indice de Lerner : \(\frac{P-Cm}{P}=\frac{1}{|\varepsilon|}\) ; le monopole se place sur la partie élastique de la demande.</li>
<li>La perte sèche mesure les échanges mutuellement avantageux qui n'ont pas lieu ; une taxe unitaire l'augmente et n'est répercutée qu'en partie sur le prix.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can compute a monopoly's marginal revenue, determine its optimal quantity and price, measure its market power with the Lerner index, quantify the deadweight loss it imposes on society and analyse the effect of a production tax.<br><br>
<strong>Why?</strong> Patents, networks, scarce resources, economies of scale: many markets are dominated by a single firm. Monopoly is also the starting point of industrial economics: oligopoly models lie between it and perfect competition.<br><br>
<strong>Prerequisites.</strong> Derivatives, price elasticity of demand, surplus.
</div>
<p class="toc">Contents: <a href="#s1">1. Marginal revenue</a> · <a href="#s2">2. The monopoly's choice</a> · <a href="#s3">3. Market power</a> · <a href="#s4">4. Deadweight loss</a> · <a href="#s5">5. A tax on the monopoly</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Total revenue and marginal revenue</div>
<p>The monopoly faces the whole market demand. Choosing the quantity \(Q\) therefore means choosing the price \(P(Q)\) at which it sells. Its total revenue and marginal revenue are:
\[TR(Q)=P(Q)\,Q,\qquad MR(Q)=TR'(Q)=P(Q)+P'(Q)\,Q\]
Since demand is decreasing, \(P'(Q)&lt;0\): selling one more unit brings its price, but forces a lower price on all the units already sold. Marginal revenue is therefore below the price. For a linear demand \(P(Q)=a-bQ\), \(TR(Q)=aQ-bQ^2\) and:
\[MR(Q)=a-2bQ\]
The marginal revenue line has the same intercept as demand and twice its slope.</p>

<div class="dossier-title" id="s2">2. The monopoly's choice</div>
<p>With a cost function \(C(Q)\), profit is \(\Pi(Q)=TR(Q)-C(Q)\). The first-order condition equates marginal revenue and marginal cost:
\[\Pi'(Q)=0\iff MR(Q)=MC(Q)\]
The second-order condition, \(\Pi''(Q)=MR'(Q)-MC'(Q)&lt;0\), holds as soon as marginal revenue falls faster than marginal cost. For \(P=a-bQ\) and \(C(Q)=cQ+dQ^2+F\), we get:
\[a-2bQ=c+2dQ\iff Q^m=\frac{a-c}{2(b+d)},\qquad P^m=a-bQ^m\]
The fixed cost \(F\) plays no role in the choice of \(Q\); it only decides whether producing is worthwhile, that is, whether \(\Pi(Q^m)\ge 0\).</p>
<div class="ifig" data-fig="mono"></div>
<div class="fig-cap">Figure 1 — Demand (blue), marginal revenue (dashed) and marginal cost (gold). The monopoly produces where marginal revenue crosses marginal cost and sells at the price read on the demand curve. The green rectangle is its profit before fixed cost, the red triangle the deadweight loss relative to perfect competition. Vary the marginal cost and its slope.</div>

<div class="dossier-title" id="s3">3. Market power and the Lerner index</div>
<p>Writing \(MR=P\big(1+\frac{Q}{P}P'(Q)\big)=P\big(1-\frac{1}{|\varepsilon|}\big)\), where \(\varepsilon\) is the price elasticity of demand, the condition \(MR=MC\) becomes:
\[L:=\frac{P-MC}{P}=\frac{1}{|\varepsilon|}\]
The Lerner index \(L\) measures the monopoly's markup rate: it is all the higher as demand is inelastic. Since \(MC\ge 0\), \(L\le 1\), hence \(|\varepsilon|\ge 1\): a monopoly always operates on the elastic part of demand. On the inelastic part, cutting output would raise revenue while lowering costs.</p>

<div class="dossier-title" id="s4">4. Surplus and deadweight loss</div>
<p>Under perfect competition, the price would equal marginal cost: \(P(Q)=MC(Q)\), that is \(Q^c=\frac{a-c}{b+2d}\), the quantity that maximises total surplus. The monopoly produces less, \(Q^m&lt;Q^c\), and sells at a higher price. Part of consumer surplus becomes profit, which is a transfer; but the units between \(Q^m\) and \(Q^c\), which consumers value above their cost, are no longer produced. Their lost value is the <em>deadweight loss</em>:
\[DWL=\int_{Q^m}^{Q^c}\big(P(Q)-MC(Q)\big)\,dQ\]
With linear demand and marginal cost, it is the area of a triangle: \(\frac{1}{2}(Q^c-Q^m)\big(P^m-MC(Q^m)\big)\).</p>

<div class="dossier-title" id="s5">5. A tax on the monopoly's output</div>
<p>A unit tax \(t\) on each unit sold adds to marginal cost. The monopoly now equates \(MR(Q)\) and \(MC(Q)+t\):
\[Q^m_t=\frac{a-c-t}{2(b+d)},\qquad P^m_t-P^m=\frac{b}{2(b+d)}\,t\]
With a constant marginal cost (\(d=0\)), the price only rises by half the tax, whereas under perfect competition it would rise by the full tax. The monopoly absorbs part of the tax on its margin. The tax further reduces output: it adds a deadweight loss to that of the monopoly, and raises \(t\,Q^m_t\) for the government.</p>
<div class="ifig" data-fig="tax"></div>
<div class="fig-cap">Figure 2 — Effect of a unit tax on the price paid by consumers, under monopoly (blue) and perfect competition (gold), with a constant marginal cost. The slope of the monopoly line is \(\frac{1}{2}\): it passes on half the tax. Increase the slope of marginal cost: pass-through falls further.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Marginal revenue \(MR=P+P'(Q)Q&lt;P\); for \(P=a-bQ\), \(MR=a-2bQ\).</li>
<li>The monopoly chooses \(MR=MC\), produces less than under perfect competition and sells at a higher price.</li>
<li>Lerner index: \(\frac{P-MC}{P}=\frac{1}{|\varepsilon|}\); the monopoly operates on the elastic part of demand.</li>
<li>The deadweight loss measures the mutually beneficial trades that do not happen; a unit tax increases it and is only partly passed on to the price.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  c: 'Coût marginal à l\'origine c', d: 'Pente du coût marginal 2d', Q: 'quantité Q', P: 'prix', dem: 'demande', rm: 'recette marginale', cm: 'coût marginal', prof: 'profit', ps: 'perte sèche', monoAria: 'Demande, recette marginale et coût marginal du monopole',
  monoRead: (R) => `Monopole : <i>Q</i> = <span class="v">${fmt(R.Qm, 2)}</span>, <i>P</i> = <span class="v">${fmt(R.Pm, 2)}</span> &nbsp;·&nbsp; concurrence parfaite : <i>Q</i> = <span class="v">${fmt(R.Qo, 2)}</span>, <i>P</i> = <span class="v">${fmt(R.Po, 2)}</span><br>Indice de Lerner <span class="v">${fmt((R.Pm - R.cmM) / R.Pm, 3)}</span> &nbsp;·&nbsp; perte sèche <span class="v">${fmt(R.W(R.Qo) - R.W(R.Qm), 2)}</span>`,
  t: 'taxe unitaire t', pr: 'hausse du prix', mon: 'monopole', cpp: 'concurrence parfaite', taxAria: 'Hausse du prix payé en fonction de la taxe, monopole et concurrence parfaite'
};
I18N.en.f = {
  c: 'Marginal cost intercept c', d: 'Marginal cost slope 2d', Q: 'quantity Q', P: 'price', dem: 'demand', rm: 'marginal revenue', cm: 'marginal cost', prof: 'profit', ps: 'deadweight loss', monoAria: 'Demand, marginal revenue and marginal cost of the monopoly',
  monoRead: (R) => `Monopoly: <i>Q</i> = <span class="v">${fmt(R.Qm, 2)}</span>, <i>P</i> = <span class="v">${fmt(R.Pm, 2)}</span> &nbsp;·&nbsp; perfect competition: <i>Q</i> = <span class="v">${fmt(R.Qo, 2)}</span>, <i>P</i> = <span class="v">${fmt(R.Po, 2)}</span><br>Lerner index <span class="v">${fmt((R.Pm - R.cmM) / R.Pm, 3)}</span> &nbsp;·&nbsp; deadweight loss <span class="v">${fmt(R.W(R.Qo) - R.W(R.Qm), 2)}</span>`,
  t: 'unit tax t', pr: 'price increase', mon: 'monopoly', cpp: 'perfect competition', taxAria: 'Increase in the price paid as a function of the tax, monopoly and perfect competition'
};
I18N.fr.f.taxRead = (km, kc) => `Part de la taxe répercutée sur le prix : monopole <span class="v">${fmt(100 * km, 1)} %</span>, concurrence parfaite <span class="v">${fmt(100 * kc, 1)} %</span>`;
I18N.en.f.taxRead = (km, kc) => `Share of the tax passed on to the price: monopoly <span class="v">${fmt(100 * km, 1)}%</span>, perfect competition <span class="v">${fmt(100 * kc, 1)}%</span>`;
FIGS.mono = {
  state: { c: 20, d2: 0 },
  controls: L => [
    { key: 'c', label: L.f.c, min: 0, max: 80, step: 5, fmt: v => String(v) },
    { key: 'd2', label: L.f.d, min: 0, max: 2, step: 0.25, fmt: v => fmtT(v, 2) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = 100, b = 1, c = s.c, d = s.d2 / 2, R = e1solve(a, b, c, d);
    const G = Plot({ w: 680, h: 340, x0: 0, x1: 100, y0: 0, y1: 110, mt: 26, mb: 42 });
    G.axes({ xt: [0, 20, 40, 60, 80, 100], yt: [0, 20, 40, 60, 80, 100], xl: L.Q, xf: v => String(v), yf: v => String(v) });
    G.clip();
    G.add(`<rect x="${G.X(0)}" y="${G.Y(R.Pm)}" width="${G.X(R.Qm) - G.X(0)}" height="${G.Y(R.cmM) - G.Y(R.Pm)}" fill="#2e7d5b" fill-opacity="0.2"/>`);
    G.add(`<path d="M${G.X(R.Qm)} ${G.Y(R.Pm)} L${G.X(R.Qo)} ${G.Y(R.Po)} L${G.X(R.Qm)} ${G.Y(R.cmM)} Z" fill="${COL.s3}" fill-opacity="0.3"/>`);
    G.line([[0, a], [a / b, 0]], { c: COL.s1, w: 2.4, clip: true });
    G.line([[0, a], [a / (2 * b), 0]], { c: COL.s1, w: 1.6, dash: '6 4', clip: true });
    G.line([[0, c], [100, c + 2 * d * 100]], { c: COL.s2, w: 2.2, clip: true });
    G.seg(R.Qm, 0, R.Qm, R.Pm, { c: GREY, w: 1, dash: '3 3' }); G.seg(0, R.Pm, R.Qm, R.Pm, { c: GREY, w: 1, dash: '3 3' });
    G.dot(R.Qm, R.Pm, { c: COL.s1 }); G.dot(R.Qo, R.Po, { c: COL.s2, hollow: true });
    G.legend([{ c: COL.s1, t: L.dem }, { c: COL.s1, dash: '6 4', t: L.rm }, { c: COL.s2, t: L.cm }, { c: '#2e7d5b', box: true, o: 0.3, t: L.prof }, { c: COL.s3, box: true, o: 0.35, t: L.ps }], G.ml + 8, 16);
    return { svg: G.svg(L.monoAria), read: L.monoRead(R) };
  }
};
FIGS.tax = {
  state: { d2: 0 },
  controls: L => [{ key: 'd2', label: L.f.d, min: 0, max: 2, step: 0.25, fmt: v => fmtT(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, b = 1, d = s.d2 / 2, km = b / (2 * (b + d)), kc = b / (b + 2 * d);
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 20, y0: 0, y1: 22, mt: 26, mb: 42 });
    G.axes({ xt: [0, 5, 10, 15, 20], yt: [0, 5, 10, 15, 20], xl: L.t, xf: v => String(v), yf: v => String(v) });
    G.line([[0, 0], [20, 20]], { c: GREY, w: 1, dash: '3 4' });
    G.line([[0, 0], [20, 20 * kc]], { c: COL.s2, w: 2.2 });
    G.line([[0, 0], [20, 20 * km]], { c: COL.s1, w: 2.4 });
    G.legend([{ c: COL.s1, t: L.mon }, { c: COL.s2, t: L.cpp }], G.ml + 8, 16);
    return { svg: G.svg(L.taxAria), read: L.taxRead(km, kc) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([60, 80, 100, 120, 150]); D.b = pick([0.5, 1, 2]); D.c = 2 * rint(2, 12); D.d = pick([0, 0.25, 0.5, 1]); D.F = 10 * rint(10, 60); D.t = pick([2, 4, 6, 10]);
    const R = e1solve(D.a, D.b, D.c, D.d), T = e1solve(D.a, D.b, D.c, D.d, D.t);
    if (R.Qm <= 0 || T.Qm <= 0) continue;
    D.R = R; D.T = T;
    D.prof = R.Pm * R.Qm - (D.c * R.Qm + D.d * R.Qm * R.Qm + D.F);
    if (D.prof <= 0) continue;
    break;
  }
  const R = D.R, T = D.T, b = D.b, c = D.c, d = D.d;
  D.eps = -(1 / b) * R.Pm / R.Qm; D.L = (R.Pm - R.cmM) / R.Pm;
  /* surplus : SC = int_0^Q (P(q) - P) dq = bQ^2/2 ; SP = int_0^Q (P - Cm(q)) dq = (P - c)Q - dQ^2 */
  D.SCm = b * R.Qm * R.Qm / 2; D.SPm = (R.Pm - c) * R.Qm - d * R.Qm * R.Qm; D.Wm = D.SCm + D.SPm;
  D.SCc = b * R.Qo * R.Qo / 2; D.SPc = (R.Po - c) * R.Qo - d * R.Qo * R.Qo; D.Wc = D.SCc + D.SPc;
  D.DWL = D.Wc - D.Wm;
  D.cmC = c + 2 * d * R.Qo;
  D.SCt = b * T.Qm * T.Qm / 2; D.SPt = (T.Pm - D.t - c) * T.Qm - d * T.Qm * T.Qm; D.Tt = D.t * T.Qm; D.Wt = D.SCt + D.SPt + D.Tt; D.DWLt = D.Wc - D.Wt;
  D.passK = b / (2 * (b + d));
  return D;
};
function e1C(D) { return String.raw`C(Q)=${D.c}\,Q${D.d ? '+' + texT(D.d, 2) + '\\,Q^2' : ''}+${D.F}`; }
/* résolution graphique : figure propre au tirage */
function e1graph(D, lang, tax) {
  const fr = lang === 'fr', R = D.R, a = D.a, b = D.b, c = D.c, d = D.d, Qmax = a / b, M = tax ? D.T : R, t = tax ? D.t : 0;
  const G = Plot({ w: 640, h: 330, x0: 0, x1: Qmax * 1.02, y0: 0, y1: a * 1.08, mt: 26, mb: 42 });
  G.axes({ xt: ticks(0, Qmax, 5), yt: ticks(0, a, 5), xl: 'Q', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  const cm = q => c + 2 * d * q;
  /* surplus des consommateurs : entre la demande et le prix payé */
  G.add(`<path d="M${G.X(0)} ${G.Y(a)} L${G.X(M.Qm)} ${G.Y(M.Pm)} L${G.X(0)} ${G.Y(M.Pm)} Z" fill="${COL.s1}" fill-opacity="0.22"/>`);
  /* surplus du producteur : entre le prix reçu et le coût marginal */
  const pr = M.Pm - t;
  G.add(`<path d="M${G.X(0)} ${G.Y(pr)} L${G.X(M.Qm)} ${G.Y(pr)} L${G.X(M.Qm)} ${G.Y(cm(M.Qm))} L${G.X(0)} ${G.Y(c)} Z" fill="#2e7d5b" fill-opacity="0.25"/>`);
  if (tax) G.add(`<rect x="${G.X(0)}" y="${G.Y(M.Pm)}" width="${G.X(M.Qm) - G.X(0)}" height="${G.Y(pr) - G.Y(M.Pm)}" fill="${COL.s2}" fill-opacity="0.3"/>`);
  /* perte sèche : entre la demande et le coût marginal, de Q^m à Q^c */
  G.add(`<path d="M${G.X(M.Qm)} ${G.Y(M.Pm)} L${G.X(R.Qo)} ${G.Y(R.Po)} L${G.X(M.Qm)} ${G.Y(cm(M.Qm))} Z" fill="${COL.s3}" fill-opacity="0.32"/>`);
  G.line([[0, a], [Qmax, 0]], { c: COL.s1, w: 2.2, clip: true });
  G.line([[0, a], [a / (2 * b), 0]], { c: COL.s1, w: 1.4, dash: '6 4', clip: true });
  G.line([[0, c], [Qmax, cm(Qmax)]], { c: COL.s2, w: 2, clip: true });
  if (tax) G.line([[0, c + t], [Qmax, cm(Qmax) + t]], { c: COL.s2, w: 1.4, dash: '4 3', clip: true });
  G.seg(M.Qm, 0, M.Qm, M.Pm, { c: GREY, w: 1, dash: '3 3' }); G.seg(0, M.Pm, M.Qm, M.Pm, { c: GREY, w: 1, dash: '3 3' });
  G.dot(M.Qm, M.Pm, { c: COL.s1 }); G.text(M.Qm, M.Pm, 'M', { dx: 8, dy: -6, anchor: 'start', bold: true, size: 12 });
  G.dot(R.Qo, R.Po, { c: COL.s2, hollow: true }); G.text(R.Qo, R.Po, 'C', { dx: 8, dy: -6, anchor: 'start', bold: true, size: 12 });
  const lg = [{ c: COL.s1, box: true, o: 0.3, t: fr ? 'surplus des consommateurs' : 'consumer surplus' }, { c: '#2e7d5b', box: true, o: 0.35, t: fr ? 'surplus du producteur' : 'producer surplus' }];
  if (tax) lg.push({ c: COL.s2, box: true, o: 0.4, t: fr ? 'recette fiscale' : 'tax revenue' });
  lg.push({ c: COL.s3, box: true, o: 0.4, t: fr ? 'perte sèche' : 'deadweight loss' });
  G.legend(lg, G.ml + 8, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Résolution graphique' : 'Graphical solution') + '</div>';
}
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Une entreprise est seule à produire un bien dont la demande inverse est \(P(Q)=${D.a}-${cfx(D.b)}Q\). Sa fonction de coût total est \(${e1C(D)}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Calculez la recette marginale et le coût marginal, puis déterminez la quantité, le prix et le profit du monopole. Vérifiez la condition du second ordre.</div></li>
<li><div class="q-text">Calculez l'élasticité-prix de la demande et l'indice de Lerner à l'optimum, et vérifiez la relation qui les lie.</div></li>
<li><div class="q-text">Déterminez l'équilibre qui prévaudrait si le prix était égal au coût marginal, comme en concurrence parfaite.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs et le surplus du producteur dans les deux situations, puis le surplus total et la perte sèche due au monopole.</div></li>
<li><div class="q-text">Représentez graphiquement la demande, la recette marginale et le coût marginal, les deux équilibres et les surplus de la question 4.</div></li>
<li><div class="q-text">L'État instaure une taxe de ${D.t} par unité produite. Déterminez le nouvel équilibre, la part de la taxe répercutée sur le prix, puis la répartition du surplus entre consommateurs, producteur et État, et la nouvelle perte sèche.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A firm is the only producer of a good whose inverse demand is \(P(Q)=${D.a}-${cfx(D.b)}Q\). Its total cost function is \(${e1C(D)}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Compute marginal revenue and marginal cost, then determine the monopoly's quantity, price and profit. Check the second-order condition.</div></li>
<li><div class="q-text">Compute the price elasticity of demand and the Lerner index at the optimum, and check the relation between them.</div></li>
<li><div class="q-text">Determine the equilibrium that would prevail if the price were equal to marginal cost, as under perfect competition.</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus and producer surplus in both situations, then total surplus and the deadweight loss caused by the monopoly.</div></li>
<li><div class="q-text">Draw the demand, marginal revenue and marginal cost curves, the two equilibria and the surpluses of question 4.</div></li>
<li><div class="q-text">The government introduces a tax of ${D.t} per unit produced. Determine the new equilibrium, the share of the tax passed on to the price, then how surplus is split between consumers, the producer and the government, and the new deadweight loss.</div></li>
</ol></div>`;
};
function e1sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], R = D.R, Tx = D.T, a = D.a, b = D.b, c = D.c, d = D.d, t = D.t, n = x => texT(x, 4), m = x => texT(x, 2);
  const RM = T_(['Rm', 'MR']), CM = T_(['Cm', 'MC']), SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), PS = T_(['PS', 'DWL']);
  const cmE = d ? String.raw`${c}+${cfx(2 * d)}Q` : String(c), den = 2 * b + 2 * d;
  const cmq = d ? String.raw`${c}+${cfx(2 * d)}q` : String(c);
  /* surplus du producteur par intégrale */
  const spInt = (P, Q, tt) => { const k = P - (tt || 0) - c; return String.raw`\int_0^{${n(Q)}}\big(${n(P)}${tt ? '-' + tt : ''}-${d ? '(' + cmq + ')' : c}\big)\,dq=\Big[${n(k)}\,q${d ? '-' + cfx(d) + 'q^2' : ''}\Big]_0^{${n(Q)}}=${n(k)}\times ${n(Q)}${d ? '-' + n(d) + '\\times ' + n(Q) + '^2' : ''}`; };
  const scInt = (P, Q) => String.raw`\int_0^{${n(Q)}}\big(${a}-${cfx(b)}q-${n(P)}\big)\,dq=\Big[${n(a - P)}\,q-${cfx(b / 2)}q^2\Big]_0^{${n(Q)}}=${n(a - P)}\times ${n(Q)}-${n(b / 2)}\times ${n(Q)}^2`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['La recette totale du monopole est le produit du prix par la quantité vendue,', 'The monopoly\'s total revenue is the price times the quantity sold,'])} \(RT(Q)=P(Q)\,Q=${a}\,Q-${cfx(b)}Q^2\). ${T_(['On en déduit la recette marginale, en dérivant par rapport à', 'Differentiating with respect to'])} \(Q\)${T_(['', ' gives marginal revenue'])}, ${T_(['et, de même, le coût marginal à partir du coût total :', 'and, likewise, marginal cost from total cost:'])}
  \[${RM}(Q)=${a}-${cfx(2 * b)}Q\qquad\text{${T_(['et', 'and'])}}\qquad ${CM}(Q)=C'(Q)=${cmE}\]
  ${T_(['Le profit', 'Profit'])} \(\Pi(Q)=RT(Q)-C(Q)\) ${T_(['est maximal lorsque sa dérivée s\'annule, c\'est-à-dire lorsque la recette marginale est égale au coût marginal :', 'is maximal when its derivative vanishes, that is, when marginal revenue equals marginal cost:'])}
  \[\begin{aligned}\Pi'(Q)=0&amp;\iff ${RM}(Q)=${CM}(Q)\\&amp;\iff ${a}-${cfx(2 * b)}Q=${cmE}\\&amp;\iff Q^m=${den === 1 ? a + '-' + c : String.raw`\frac{${a}-${c}}{${n(den)}}`}=${n(R.Qm)}\end{aligned}\]
  ${T_(['La dérivée seconde', 'The second derivative'])} \(\Pi''(Q)=-${n(den)}\) ${T_(['est négative : il s\'agit bien d\'un maximum. On en déduit, d\'après la fonction de demande inverse, le prix fixé par le monopole :', 'is negative: this is indeed a maximum. The inverse demand function then gives the price set by the monopoly:'])}
  \[P^m=P(Q^m)=${a}-${b === 1 ? '' : texT(b, 2) + '\\times '}${n(R.Qm)}=${n(R.Pm)}\]
  ${T_(['Le profit est alors la recette totale diminuée du coût total :', 'Profit is then total revenue minus total cost:'])}
  \[\Pi^m=P^mQ^m-C(Q^m)=${n(R.Pm)}\times ${n(R.Qm)}-${n(c * R.Qm + d * R.Qm * R.Qm + D.F)}\approx ${m(D.prof)}\]
  ${T_(['Ce profit est positif : le monopole a intérêt à produire, malgré le coût fixe de', 'This profit is positive: the monopoly finds it worthwhile to produce, despite the fixed cost of'])} ${D.F}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La demande s\'écrit', 'Demand can be written'])} \(Q=\frac{${a}-P}{${texT(b, 2)}}\), ${T_(['donc', 'so'])} \(\frac{dQ}{dP}=-\frac{1}{${texT(b, 2)}}\). ${T_(['L\'élasticité-prix au point d\'équilibre et l\'indice de Lerner valent donc :', 'The price elasticity at the equilibrium point and the Lerner index are therefore:'])}
  \[\begin{aligned}\varepsilon&amp;=\frac{dQ}{dP}\cdot\frac{P^m}{Q^m}=-\frac{1}{${texT(b, 2)}}\times\frac{${n(R.Pm)}}{${n(R.Qm)}}\approx ${n(D.eps)}\\L&amp;=\frac{P^m-${CM}(Q^m)}{P^m}=\frac{${n(R.Pm)}-${n(R.cmM)}}{${n(R.Pm)}}\approx ${n(D.L)}\end{aligned}\]
  ${T_(['On vérifie que', 'We check that'])} \(\frac{1}{|\varepsilon|}\approx ${n(1 / Math.abs(D.eps))}=L\) : ${T_(['le taux de marge du monopole est l\'inverse de l\'élasticité de la demande. Comme', 'the monopoly\'s markup rate is the inverse of the elasticity of demand. Since'])} \(|\varepsilon|&gt;1\), ${T_(['le monopole se situe sur la partie élastique de la demande.', 'the monopoly lies on the elastic part of demand.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si le prix était égal au coût marginal, la quantité échangée serait celle pour laquelle la demande coupe le coût marginal :', 'If the price equalled marginal cost, the quantity traded would be the one at which demand crosses marginal cost:'])}
  \[P(Q)=${CM}(Q)\iff ${a}-${cfx(b)}Q=${cmE}\iff Q^c=${b + 2 * d === 1 ? a + '-' + c : String.raw`\frac{${a}-${c}}{${n(b + 2 * d)}}`}=${n(R.Qo)}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix correspondant :', 'The inverse demand function then gives the corresponding price:'])} \(P^c=${a}-${b === 1 ? '' : texT(b, 2) + '\\times '}${n(R.Qo)}=${n(R.Po)}\). ${T_(['Le monopole produit donc', 'The monopoly therefore produces'])} \(${n(R.Qo - R.Qm)}\) ${T_(['unités de moins et vend', 'fewer units and sells'])} \(${n(R.Pm - R.Po)}\) ${T_(['plus cher.', 'more expensively.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est la somme, sur les unités achetées, de l\'écart entre ce qu\'ils étaient prêts à payer, lu sur la demande, et le prix payé. En monopole :', 'Consumer surplus is the sum, over the units bought, of the gap between what consumers were willing to pay, read on the demand curve, and the price paid. Under monopoly:'])}
  \[${SC}^m=${scInt(R.Pm, R.Qm)}=${m(D.SCm)}\]
  ${T_(['Le surplus du producteur est la somme, sur les unités vendues, de l\'écart entre le prix reçu et le coût marginal ; il est égal au profit augmenté du coût fixe :', 'Producer surplus is the sum, over the units sold, of the gap between the price received and marginal cost; it equals profit plus the fixed cost:'])}
  \[${SP}^m=${spInt(R.Pm, R.Qm)}=${m(D.SPm)}=\Pi^m+${D.F}\]
  ${T_(['Avec un prix égal au coût marginal, les mêmes calculs donnent :', 'With a price equal to marginal cost, the same computations give:'])}
  \[\begin{aligned}${SC}^c&amp;=${scInt(R.Po, R.Qo)}=${m(D.SCc)}\\${SP}^c&amp;=${spInt(R.Po, R.Qo)}=${m(D.SPc)}\end{aligned}\]
  ${T_(['Le surplus total, somme des deux, passe de', 'Total surplus, the sum of the two, goes from'])} \(W^c=${m(D.Wc)}\) ${T_(['à', 'to'])} \(W^m=${m(D.Wm)}\). ${T_(['La différence est la perte sèche :', 'The difference is the deadweight loss:'])}
  \[${PS}=W^c-W^m=${m(D.Wc)}-${m(D.Wm)}=${m(D.DWL)}\]
  ${T_(['On retrouve l\'aire du triangle compris entre la demande et le coût marginal, de', 'This is the area of the triangle between demand and marginal cost, from'])} \(Q^m\) ${T_(['à', 'to'])} \(Q^c\) : \(\frac12\,(${n(R.Qo)}-${n(R.Qm)})\,(${n(R.Pm)}-${n(R.cmM)})=${m(D.DWL)}\). ${T_(['Le monopole transfère une partie du surplus des consommateurs vers lui-même, et en détruit une autre partie.', 'The monopoly transfers part of consumer surplus to itself, and destroys another part.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Graphiquement, l\'équilibre du monopole', 'Graphically, the monopoly equilibrium'])} M ${T_(['se lit à l\'intersection de la recette marginale (pointillés) et du coût marginal (doré), en remontant jusqu\'à la demande pour obtenir le prix ; l\'équilibre', 'is read at the intersection of marginal revenue (dashed) and marginal cost (gold), going up to the demand curve to obtain the price; equilibrium'])} C ${T_(['est à l\'intersection de la demande et du coût marginal. Les surplus de la question 4 sont les aires colorées.', 'is at the intersection of demand and marginal cost. The surpluses of question 4 are the shaded areas.'])}</p>
  ${e1graph(D, lang, false)}
</div></li>
<li><div class="q-content">
  <p>${T_(['La taxe s\'ajoute au coût de chaque unité : le monopole égalise désormais sa recette marginale au coût marginal augmenté de la taxe.', 'The tax adds to the cost of each unit: the monopoly now equates marginal revenue with marginal cost plus the tax.'])}
  \[${a}-${cfx(2 * b)}Q=${cmE}+${t}\iff Q^m_t=${den === 1 ? a + '-' + c + '-' + t : String.raw`\frac{${a}-${c}-${t}}{${n(den)}}`}=${n(Tx.Qm)}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix payé par les consommateurs :', 'The inverse demand function then gives the price paid by consumers:'])} \(P^m_t=${a}-${b === 1 ? '' : texT(b, 2) + '\\times '}${n(Tx.Qm)}=${n(Tx.Pm)}\). ${T_(['Le prix augmente de', 'The price rises by'])} \(${n(Tx.Pm - R.Pm)}\), ${T_(['soit', 'that is'])} \(${texT(100 * D.passK, 1)}\,\%\) ${T_(['de la taxe : le monopole n\'en répercute qu\'une partie et absorbe le reste sur sa marge. Il reçoit, net de taxe,', 'of the tax: the monopoly only passes on part of it and absorbs the rest on its margin. It receives, net of tax,'])} \(${n(Tx.Pm - t)}\) ${T_(['par unité. Les surplus et la recette fiscale \\(T\\) perçue par l\'État deviennent :', 'per unit. The surpluses, and the tax revenue \\(T\\) collected by the government, become:'])}
  \[\begin{aligned}${SC}_t&amp;=${scInt(Tx.Pm, Tx.Qm)}=${m(D.SCt)}\\${SP}_t&amp;=${spInt(Tx.Pm, Tx.Qm, String(t))}=${m(D.SPt)}\\T&amp;=${t}\times ${n(Tx.Qm)}=${m(D.Tt)}\end{aligned}\]
  ${T_(['Le surplus total, recette fiscale comprise, vaut', 'Total surplus, including tax revenue, is'])} \(W_t=${m(D.SCt)}+${m(D.SPt)}+${m(D.Tt)}=${m(D.Wt)}\), ${T_(['d\'où une perte sèche', 'hence a deadweight loss'])} \(W^c-W_t=${m(D.DWLt)}\), ${T_(['supérieure à celle du monopole sans taxe', 'larger than that of the untaxed monopoly'])} (\(${m(D.DWL)}\)). ${T_(['La taxe aggrave la sous-production ; elle est supportée à la fois par les consommateurs, dont le surplus baisse de', 'The tax worsens underproduction; it is borne both by consumers, whose surplus falls by'])} \(${m(D.SCm - D.SCt)}\), ${T_(['et par le monopole, dont le surplus baisse de', 'and by the monopoly, whose surplus falls by'])} \(${m(D.SPm - D.SPt)}\).</p>
  ${e1graph(D, lang, true)}
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => e1sol(D, 'fr');
I18N.en.sol = D => e1sol(D, 'en');
