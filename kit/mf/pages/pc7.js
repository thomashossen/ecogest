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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 7 – Coûts et offre concurrentielle', 'k-h1': 'Coûts de court terme et offre de la firme concurrentielle', 'k-coursetitle': 'Coûts fixes et variables, seuils de fermeture et de rentabilité, courbe d\'offre et surplus du producteur', 'k-extitle': 'Courbes de coût, décision de production et surplus du producteur', 'k-soltitle': 'Courbes de coût, décision de production et surplus du producteur' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 7 – Costs and competitive supply', 'k-h1': 'Short-run costs and the competitive firm\'s supply', 'k-coursetitle': 'Fixed and variable costs, shutdown and break-even points, supply curve and producer surplus', 'k-extitle': 'Cost curves, production decision and producer surplus', 'k-soltitle': 'Cost curves, production decision and producer surplus' });

/* ---------- outils : C(q) = q^3 - k q^2 + m q + F ---------- */
function p7(k, m, F) {
  const CV = q => q * q * q - k * q * q + m * q, Cm = q => 3 * q * q - 2 * k * q + m, CVM = q => q * q - k * q + m, CM = q => CVM(q) + F / q;
  const qf = k / 2, pf = m - k * k / 4;
  let lo = qf, hi = qf + 50; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (2 * mid * mid * mid - k * mid * mid - F < 0) lo = mid; else hi = mid; }
  const qr = (lo + hi) / 2, pr = CM(qr);
  const supply = p => p < pf ? 0 : (2 * k + Math.sqrt(4 * k * k - 12 * (m - p))) / 6;
  return { CV: CV, Cm: Cm, CVM: CVM, CM: CM, qf: qf, pf: pf, qr: qr, pr: pr, supply: supply };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez distinguer coûts fixes et variables, calculer et tracer les coûts moyen, variable moyen et marginal, déterminer la quantité qui maximise le profit d'une entreprise en concurrence parfaite, trouver ses seuils de fermeture et de rentabilité, construire sa courbe d'offre et calculer son surplus.<br><br>
<strong>Pourquoi ?</strong> En concurrence parfaite, l'entreprise ne fixe pas son prix : elle choisit seulement combien produire. Comprendre ce choix permet de dériver la courbe d'offre du marché, et de comprendre pourquoi certaines entreprises continuent de produire à perte à court terme.<br><br>
<strong>Prérequis.</strong> Minimisation du coût (page 6), dérivées, intégrales.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Les coûts</a> · <a href="#s2">2. Les courbes de coût</a> · <a href="#s3">3. Le choix de production</a> · <a href="#s4">4. Fermeture et rentabilité</a> · <a href="#s5">5. Offre et surplus</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Coûts fixes et coûts variables</div>
<p>À court terme, certains facteurs sont fixes : leur coût \(CF\) est supporté même si l'entreprise ne produit rien (loyer, matériel). Le coût variable \(CV(q)\) dépend de la quantité produite. Le coût total est \(CT(q)=CF+CV(q)\). On définit le coût moyen \(CM=CT/q\), le coût variable moyen \(CVM=CV/q\) et le coût marginal \(Cm=CT'(q)=CV'(q)\), coût de la dernière unité ; il ne dépend pas du coût fixe.</p>

<div class="dossier-title" id="s2">2. Les courbes de coût</div>
<p>Avec un coût variable cubique \(CV(q)=q^3-kq^2+mq\), le coût marginal \(Cm=3q^2-2kq+m\) a une forme en U : il baisse d'abord (rendements croissants du facteur variable), puis augmente (rendements décroissants). Le coût marginal coupe le coût variable moyen et le coût moyen en leurs minimums, pour la même raison que la productivité marginale coupe la productivité moyenne en son maximum : \(\frac{d}{dq}\frac{CT}{q}=\frac{1}{q}(Cm-CM)\).</p>
<div class="ifig" data-fig="costs"></div>
<div class="fig-cap">Figure 1 — Coût marginal (rouge), coût moyen (bleu) et coût variable moyen (pointillés) pour \(CT=q^3-6q^2+15q+20\). Au prix choisi, l'entreprise produit là où le prix coupe la partie croissante du coût marginal ; le rectangle vert est son profit, rouge s'il s'agit d'une perte.</div>

<div class="dossier-title" id="s3">3. Le choix de production</div>
<p>En concurrence parfaite, l'entreprise prend le prix \(p\) comme donné. Son profit est \(\Pi(q)=pq-CT(q)\), et la condition du premier ordre est :
\[p=Cm(q)\]
Pour un maximum, il faut aussi \(\Pi''(q)=-Cm'(q)&lt;0\) : l'entreprise produit sur la partie <em>croissante</em> du coût marginal. Le profit vaut alors \(\Pi=(p-CM(q))\,q\) : il est positif si le prix dépasse le coût moyen.</p>

<div class="dossier-title" id="s4">4. Seuils de fermeture et de rentabilité</div>
<p>Le <em>seuil de rentabilité</em> est le minimum du coût moyen : au-dessus, le profit est positif. Le <em>seuil de fermeture</em> est le minimum du coût variable moyen. Entre les deux, l'entreprise fait des pertes, mais a intérêt à continuer de produire à court terme : ses recettes couvrent ses coûts variables et une partie de ses coûts fixes, qu'elle paierait de toute façon. Sous le seuil de fermeture, produire ferait perdre plus que les coûts fixes : elle arrête. À long terme, tous les coûts sont variables, et une entreprise qui ne couvre pas son coût moyen quitte le marché.</p>

<div class="dossier-title" id="s5">5. La courbe d'offre et le surplus du producteur</div>
<p>La courbe d'offre de court terme est la partie du coût marginal située au-dessus du seuil de fermeture ; en dessous, l'offre est nulle. L'offre de marché est la somme horizontale des offres individuelles. Le <em>surplus du producteur</em> est l'écart entre ce que l'entreprise reçoit et le coût marginal de chaque unité :
\[SP=\int_0^{q^*}\big(p-Cm(q)\big)\,dq=pq^*-CV(q^*)=\Pi+CF\]
Il diffère du profit des coûts fixes, qui ne dépendent pas de la décision de produire.</p>
<div class="ifig" data-fig="supply"></div>
<div class="fig-cap">Figure 2 — Courbe d'offre de l'entreprise de la figure 1 : nulle sous le seuil de fermeture (min CVM = 6), puis égale au coût marginal. Le saut en ce point correspond au passage de l'arrêt à la production de la quantité \(q=3\).</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>\(CT=CF+CV\) ; \(Cm\) coupe \(CVM\) et \(CM\) en leurs minimums.</li>
<li>Concurrence parfaite : \(p=Cm(q)\) sur la partie croissante du coût marginal ; \(\Pi=(p-CM)\,q\).</li>
<li>Seuil de fermeture : \(\min CVM\) ; seuil de rentabilité : \(\min CM\).</li>
<li>Offre = coût marginal au-dessus du seuil de fermeture ; \(SP=\int_0^{q^*}(p-Cm)\,dq=\Pi+CF\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can distinguish fixed and variable costs, compute and draw average, average variable and marginal costs, determine the profit-maximising quantity of a perfectly competitive firm, find its shutdown and break-even points, build its supply curve and compute its surplus.<br><br>
<strong>Why?</strong> Under perfect competition, the firm does not set its price: it only chooses how much to produce. Understanding this choice yields the market supply curve, and explains why some firms keep producing at a loss in the short run.<br><br>
<strong>Prerequisites.</strong> Cost minimisation (page 6), derivatives, integrals.
</div>
<p class="toc">Contents: <a href="#s1">1. Costs</a> · <a href="#s2">2. Cost curves</a> · <a href="#s3">3. The production choice</a> · <a href="#s4">4. Shutdown and break-even</a> · <a href="#s5">5. Supply and surplus</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Fixed and variable costs</div>
<p>In the short run, some factors are fixed: their cost \(FC\) is borne even if the firm produces nothing (rent, equipment). Variable cost \(VC(q)\) depends on the quantity produced. Total cost is \(TC(q)=FC+VC(q)\). Average cost is \(AC=TC/q\), average variable cost \(AVC=VC/q\) and marginal cost \(MC=TC'(q)=VC'(q)\), the cost of the last unit; it does not depend on fixed cost.</p>

<div class="dossier-title" id="s2">2. Cost curves</div>
<p>With a cubic variable cost \(VC(q)=q^3-kq^2+mq\), marginal cost \(MC=3q^2-2kq+m\) is U-shaped: it first falls (increasing returns to the variable factor), then rises (diminishing returns). Marginal cost crosses average variable cost and average cost at their minima, for the same reason that the marginal product crosses the average product at its maximum: \(\frac{d}{dq}\frac{TC}{q}=\frac{1}{q}(MC-AC)\).</p>
<div class="ifig" data-fig="costs"></div>
<div class="fig-cap">Figure 1 — Marginal cost (red), average cost (blue) and average variable cost (dashed) for \(TC=q^3-6q^2+15q+20\). At the chosen price, the firm produces where the price crosses the rising part of marginal cost; the green rectangle is its profit, red if it is a loss.</div>

<div class="dossier-title" id="s3">3. The production choice</div>
<p>Under perfect competition, the firm takes the price \(p\) as given. Its profit is \(\Pi(q)=pq-TC(q)\), and the first-order condition is:
\[p=MC(q)\]
For a maximum, we also need \(\Pi''(q)=-MC'(q)&lt;0\): the firm produces on the <em>rising</em> part of marginal cost. Profit is then \(\Pi=(p-AC(q))\,q\): it is positive if the price exceeds average cost.</p>

<div class="dossier-title" id="s4">4. Shutdown and break-even points</div>
<p>The <em>break-even point</em> is the minimum of average cost: above it, profit is positive. The <em>shutdown point</em> is the minimum of average variable cost. Between the two, the firm makes losses, but should keep producing in the short run: its revenue covers its variable costs and part of its fixed costs, which it would pay anyway. Below the shutdown point, producing would lose more than the fixed costs: it stops. In the long run, all costs are variable, and a firm that does not cover its average cost leaves the market.</p>

<div class="dossier-title" id="s5">5. The supply curve and producer surplus</div>
<p>The short-run supply curve is the part of marginal cost above the shutdown point; below it, supply is zero. Market supply is the horizontal sum of individual supplies. <em>Producer surplus</em> is the gap between what the firm receives and the marginal cost of each unit:
\[PS=\int_0^{q^*}\big(p-MC(q)\big)\,dq=pq^*-VC(q^*)=\Pi+FC\]
It differs from profit by fixed costs, which do not depend on the decision to produce.</p>
<div class="ifig" data-fig="supply"></div>
<div class="fig-cap">Figure 2 — Supply curve of the figure 1 firm: zero below the shutdown point (min AVC = 6), then equal to marginal cost. The jump at that point corresponds to the switch from shutting down to producing the quantity \(q=3\).</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>\(TC=FC+VC\); \(MC\) crosses \(AVC\) and \(AC\) at their minima.</li>
<li>Perfect competition: \(p=MC(q)\) on the rising part of marginal cost; \(\Pi=(p-AC)\,q\).</li>
<li>Shutdown point: \(\min AVC\); break-even point: \(\min AC\).</li>
<li>Supply = marginal cost above the shutdown point; \(PS=\int_0^{q^*}(p-MC)\,dq=\Pi+FC\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { p: 'Prix p', q: 'quantité q', cm: 'coût marginal', cmo: 'coût moyen', cvm: 'coût variable moyen', cAria: 'Courbes de coût et décision de production', cRead: (p, q, pi) => q > 0 ? `<i>q</i>* = <span class="v">${fmt(q, 2)}</span>, profit <span class="v">${fmt(pi, 2)}</span>` + (pi < 0 ? ' : perte, mais production maintenue à court terme' : '') : 'Prix sous le seuil de fermeture : l\'entreprise ne produit pas (perte égale au coût fixe, 20).', sAria: 'Courbe d\'offre de court terme', of: 'offre' };
I18N.en.f = { p: 'Price p', q: 'quantity q', cm: 'marginal cost', cmo: 'average cost', cvm: 'average variable cost', cAria: 'Cost curves and production decision', cRead: (p, q, pi) => q > 0 ? `<i>q</i>* = <span class="v">${fmt(q, 2)}</span>, profit <span class="v">${fmt(pi, 2)}</span>` + (pi < 0 ? ': a loss, but production continues in the short run' : '') : 'Price below the shutdown point: the firm does not produce (loss equal to fixed cost, 20).', sAria: 'Short-run supply curve', of: 'supply' };
function p7fig(k, m, F, p, lang, o) {
  const fr = lang === 'fr', M = p7(k, m, F), q = M.supply(p), X1 = o.X1, Y1 = o.Y1;
  const G = Plot({ w: 620, h: 340, x0: 0, x1: X1, y0: 0, y1: Y1, mt: 26, mb: 42 });
  G.axes({ xt: ticks(0, X1, 5), yt: ticks(0, Y1, 5), xl: fr ? 'quantité q' : 'quantity q', xf: v => fmtT(v, 1), yf: v => fmtT(v, 0) });
  G.clip();
  if (q > 0) {
    const ac = M.CM(q);
    G.add(`<rect x="${G.X(0)}" y="${G.Y(Math.max(p, ac))}" width="${G.X(q) - G.X(0)}" height="${Math.abs(G.Y(p) - G.Y(ac))}" fill="${p >= ac ? '#2e7d5b' : COL.s3}" fill-opacity="0.25"/>`);
    if (o.sp) {
      /* partie positive (prix au-dessus du coût marginal) et partie négative (coût marginal au-dessus du prix) */
      let q1 = 0; if (M.Cm(0) > p) { let lo = 0, hi = M.qf; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (M.Cm(mid) > p) lo = mid; else hi = mid; } q1 = (lo + hi) / 2; }
      const cl = ` clip-path="url(#${G._clip})"`;
      if (q1 > 0) G.add(`<path d="${G.pts([[0, p]].concat(G.sample(M.Cm, 0, q1, 60)).concat([[q1, p]]))} Z" fill="${COL.s3}" fill-opacity="0.18"${cl}/>`);
      G.add(`<path d="${G.pts([[q1, p]].concat(G.sample(M.Cm, q1, q, 80)).concat([[q, p]]))} Z" fill="${COL.s2}" fill-opacity="0.3"${cl}/>`);
    }
  }
  G.curve(M.Cm, 0.05, X1, { c: COL.s3, w: 2.4, clip: true }, 300); G.curve(M.CM, 0.3, X1, { c: COL.s1, w: 2.2, clip: true }, 300); G.curve(M.CVM, 0.05, X1, { c: COL.s1, w: 1.5, dash: '5 4', clip: true }, 300);
  G.line([[0, p], [X1, p]], { c: COL.ink, w: 1.4 });
  G.dot(M.qf, M.pf, { c: COL.ink, r: 4 }); G.dot(M.qr, M.pr, { c: COL.ink, r: 4 }); if (q > 0) G.dot(q, p, { c: COL.s3, r: 6 });
  G.legend([{ c: COL.s3, t: fr ? 'coût marginal' : 'marginal cost' }, { c: COL.s1, t: fr ? 'coût moyen' : 'average cost' }, { c: COL.s1, dash: '5 4', t: fr ? 'coût variable moyen' : 'average variable cost' }].concat(o.sp ? [{ c: COL.s2, box: true, o: 0.3, t: fr ? 'surplus du producteur' : 'producer surplus' }] : []), G.ml + 8, 16);
  return { svg: G.svg(fr ? 'Coûts' : 'Costs'), q: q };
}
FIGS.costs = {
  state: { p: 20 },
  controls: L => [{ key: 'p', label: L.f.p, min: 2, max: 40, step: 1, fmt: v => String(v) }],
  draw: function (s, lang) { const F = p7fig(6, 15, 20, s.p, lang, { X1: 7, Y1: 45 }), M = p7(6, 15, 20); return { svg: F.svg, read: I18N[lang].f.cRead(s.p, F.q, F.q > 0 ? s.p * F.q - M.CV(F.q) - 20 : -20) }; }
};
FIGS.supply = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, M = p7(6, 15, 20), G = Plot({ w: 620, h: 280, x0: 0, x1: 7, y0: 0, y1: 45, mt: 26, mb: 42 });
    G.axes({ xt: [0, 1, 2, 3, 4, 5, 6, 7], yt: [0, 10, 20, 30, 40], xl: L.q, yl: 'p', xf: v => String(v), yf: v => String(v) });
    G.clip();
    G.line([[0, 0], [0, M.pf]], { c: COL.s2, w: 3 }); G.curve(M.Cm, M.qf, 7, { c: COL.s2, w: 3, clip: true }, 200);
    G.dot(0, M.pf, { c: COL.s2, r: 4, hollow: true }); G.dot(M.qf, M.pf, { c: COL.s2, r: 5 });
    return { svg: G.svg(L.sAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.k = 2 * rint(2, 6); D.m = Math.ceil(D.k * D.k / 3) + rint(1, 10); D.F = 10 * rint(1, 6);
    D.M = p7(D.k, D.m, D.F);
    D.loss = rnd() < 0.4;
    D.p = D.loss ? Math.round((D.M.pf + D.M.pr) / 2 * 2) / 2 : Math.ceil(D.M.pr + rint(3, 15));
    if (D.loss && (D.p <= D.M.pf + 0.5 || D.p >= D.M.pr - 0.5)) continue;
    break;
  }
  const M = D.M; D.q = M.supply(D.p); D.CTq = M.CV(D.q) + D.F; D.pi = D.p * D.q - D.CTq; D.SP = D.p * D.q - M.CV(D.q);
  return D;
};
const p7C = D => String.raw`CT(q)=q^3-${D.k}\,q^2+${texT(D.m, 2)}\,q+${D.F}`;
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Une entreprise en concurrence parfaite a pour coût total de court terme \(${p7C(D)}\). Le prix de marché est \(p=${texT(D.p, 2)}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Identifiez le coût fixe et le coût variable, puis calculez le coût moyen, le coût variable moyen et le coût marginal.</div></li>
<li><div class="q-text">Déterminez le seuil de fermeture et le seuil de rentabilité.</div></li>
<li><div class="q-text">Déterminez la courbe d'offre de court terme de l'entreprise.</div></li>
<li><div class="q-text">Au prix \(p=${texT(D.p, 2)}\), quelle quantité l'entreprise produit-elle ? Calculez son profit. A-t-elle intérêt à produire ?</div></li>
<li><div class="q-text">Calculez, à l'aide d'une intégrale, le surplus du producteur, et vérifiez qu'il est égal au profit augmenté du coût fixe.</div></li>
<li><div class="q-text">Représentez les courbes de coût, le prix, la quantité produite, le profit (ou la perte) et le surplus du producteur.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A perfectly competitive firm has short-run total cost \(${p7C(D).replace('CT', 'TC')}\). The market price is \(p=${texT(D.p, 2)}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Identify fixed cost and variable cost, then compute average cost, average variable cost and marginal cost.</div></li>
<li><div class="q-text">Determine the shutdown point and the break-even point.</div></li>
<li><div class="q-text">Determine the firm's short-run supply curve.</div></li>
<li><div class="q-text">At price \(p=${texT(D.p, 2)}\), what quantity does the firm produce? Compute its profit. Should it produce?</div></li>
<li><div class="q-text">Compute, using an integral, producer surplus, and check that it equals profit plus fixed cost.</div></li>
<li><div class="q-text">Draw the cost curves, the price, the quantity produced, the profit (or loss) and producer surplus.</div></li>
</ol></div>`;
};
function p7sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], k = D.k, m = D.m, F = D.F, p = D.p, M = D.M, q = D.q, n = x => texT(x, 4);
  const CF = T_(['CF', 'FC']), CV = T_(['CV', 'VC']), CM = T_(['CM', 'AC']), CVM = T_(['CVM', 'AVC']), Cm = T_(['Cm', 'MC']), SP = T_(['SP', 'PS']), tm = texT(m, 2);
  const F7 = p7fig(k, m, F, p, lang, { X1: Math.max(q, M.qr) * 1.5, Y1: Math.max(p, M.pr) * 1.6, sp: true });
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le coût fixe est la partie du coût qui ne dépend pas de', 'Fixed cost is the part of cost that does not depend on'])} \(q\) : \(${CF}=${F}\). ${T_(['Le reste est le coût variable', 'The rest is variable cost'])} \(${CV}(q)=q^3-${k}\,q^2+${tm}\,q\). ${T_(['On en déduit', 'Hence'])} :
  \[\begin{aligned}${CM}(q)&amp;=\frac{CT(q)}{q}=q^2-${k}\,q+${tm}+\frac{${F}}{q}\\${CVM}(q)&amp;=\frac{${CV}(q)}{q}=q^2-${k}\,q+${tm}\\${Cm}(q)&amp;=CT'(q)=3q^2-${2 * k}\,q+${tm}\end{aligned}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le seuil de fermeture est le minimum du coût variable moyen ; sa dérivée', 'The shutdown point is the minimum of average variable cost; its derivative'])} \(2q-${k}\) ${T_(['s\'annule en', 'vanishes at'])} \(q=${n(M.qf)}\), ${T_(['d\'où', 'hence'])} \(\min ${CVM}=${n(M.qf)}^2-${k}\times ${n(M.qf)}+${tm}=${n(M.pf)}\). ${T_(['On vérifie que le coût marginal y est égal :', 'We check that marginal cost equals it there:'])} \(${Cm}(${n(M.qf)})=${n(M.Cm(M.qf))}\).</p>
  <p>${T_(['Le seuil de rentabilité est le minimum du coût moyen, atteint là où', 'The break-even point is the minimum of average cost, reached where'])} \(${Cm}=${CM}\) : \(3q^2-${2 * k}q+${tm}=q^2-${k}q+${tm}+\frac{${F}}{q}\), ${T_(['soit', 'that is'])} \(2q^3-${k}\,q^2-${F}=0\). ${T_(['Cette équation se résout numériquement (par dichotomie) :', 'This equation is solved numerically (by bisection):'])} \(q\approx ${n(M.qr)}\), ${T_(['et', 'and'])} \(\min ${CM}=${CM}(${n(M.qr)})\approx ${n(M.pr)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Au-dessus du seuil de fermeture, l\'entreprise produit la quantité qui égalise le prix et le coût marginal, sur sa partie croissante :', 'Above the shutdown point, the firm produces the quantity equating price and marginal cost, on its rising part:'])} \(3q^2-${2 * k}\,q+${tm}=p\). ${T_(['En retenant la plus grande racine :', 'Keeping the larger root:'])}
  \[q(p)=\begin{cases}0&amp;\text{${T_(['si', 'if'])} }p&lt;${n(M.pf)}\\\dfrac{${2 * k}+\sqrt{${4 * k * k}-12\,(${tm}-p)}}{6}&amp;\text{${T_(['si', 'if'])} }p\ge ${n(M.pf)}\end{cases}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Au prix', 'At price'])} \(${texT(p, 2)}\), ${T_(['supérieur au seuil de fermeture, l\'offre donne', 'above the shutdown point, supply gives'])} \(q^*=\frac{${2 * k}+\sqrt{${4 * k * k}-12\,(${tm}-${texT(p, 2)})}}{6}=${n(q)}\). ${T_(['Le profit vaut', 'Profit is'])} \(\Pi=p\,q^*-CT(q^*)=${texT(p, 2)}\times ${n(q)}-${n(D.CTq)}=${n(D.pi)}\). ${D.pi >= 0 ? T_(['Le prix dépasse le seuil de rentabilité : le profit est positif.', 'The price exceeds the break-even point: profit is positive.']) : T_(['Le prix est compris entre les deux seuils : l\'entreprise fait une perte de', 'The price lies between the two thresholds: the firm makes a loss of']) + ' \\(' + n(-D.pi) + '\\), ' + T_(['inférieure au coût fixe', 'smaller than the fixed cost']) + ' (' + F + ') ' + T_(['qu\'elle perdrait en s\'arrêtant : elle a intérêt à produire à court terme, mais quittera le marché à long terme si le prix ne remonte pas.', 'it would lose by shutting down: it should produce in the short run, but will leave the market in the long run if the price does not recover.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus du producteur est l\'intégrale de l\'écart entre le prix et le coût marginal :', 'Producer surplus is the integral of the gap between the price and marginal cost:'])}
  \[\begin{aligned}${SP}&amp;=\int_0^{${n(q)}}\big(${texT(p, 2)}-(3q^2-${2 * k}\,q+${tm})\big)\,dq\\&amp;=\Big[${texT(p - m, 4)}\,q+${k}\,q^2-q^3\Big]_0^{${n(q)}}=${n(D.SP)}\end{aligned}\]
  ${T_(['On vérifie', 'We check'])} \(\Pi+${CF}=${n(D.pi)}+${F}=${n(D.pi + F)}\) : ${T_(['le surplus du producteur est la recette diminuée des seuls coûts variables, qui sont les coûts liés à la décision de produire.', 'producer surplus is revenue minus variable costs only, which are the costs tied to the decision to produce.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le rectangle entre le prix et le coût moyen, de largeur', 'The rectangle between the price and average cost, of width'])} \(q^*\), ${T_(['est le profit (vert) ou la perte (rouge). Le surplus du producteur est l\'aire dorée entre le prix et le coût marginal, diminuée, le cas échéant, de l\'aire rose où les premières unités coûtent plus que le prix :', 'is the profit (green) or the loss (red). Producer surplus is the gold area between the price and marginal cost, minus, where relevant, the pink area where the first units cost more than the price:'])}</p>
  <div class="sol-fig">${F7.svg}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => p7sol(D, 'fr');
I18N.en.sol = D => p7sol(D, 'en');
