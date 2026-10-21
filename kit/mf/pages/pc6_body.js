I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 6 – Minimisation du coût', 'k-h1': 'Minimisation du coût et fonction de coût', 'k-coursetitle': 'Isocoûts, condition de tangence, demandes conditionnelles de facteurs et fonction de coût', 'k-extitle': 'Demandes conditionnelles, fonction de coût et substitution des facteurs', 'k-soltitle': 'Demandes conditionnelles, fonction de coût et substitution des facteurs' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 6 – Cost minimisation', 'k-h1': 'Cost minimisation and the cost function', 'k-coursetitle': 'Isocosts, tangency condition, conditional factor demands and the cost function', 'k-extitle': 'Conditional demands, cost function and factor substitution', 'k-soltitle': 'Conditional demands, cost function and factor substitution' });

/* ---------- outils : q = A K^a L^b, prix w du travail, r du capital ---------- */
function p6opt(A, a, b, w, r, q) {
  const s = a + b, L = Math.pow(q / A, 1 / s) * Math.pow(b * r / (a * w), a / s), K = Math.pow(q / A, 1 / s) * Math.pow(a * w / (b * r), b / s);
  return { L: L, K: K, C: w * L + r * K };
}
function p6fig(A, a, b, q, cases, lang, o) {
  const fr = lang === 'fr', X1 = o.X1, Y1 = o.Y1;
  const G = Plot({ w: 520, h: 440, x0: 0, x1: X1, y0: 0, y1: Y1, mt: 26, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, X1, 4), yt: ticks(0, Y1, 4), xl: 'L', yl: 'K', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
  G.clip();
  G.curve(l => Math.pow(q / (A * Math.pow(l, b)), 1 / a), 0.02, X1, { c: COL.ink, w: 2.2, clip: true }, 400);
  cases.forEach((c, k) => { const O = p6opt(A, a, b, c.w, c.r, q), col = k ? COL.s2 : COL.s1; G.line([[0, O.C / c.r], [O.C / c.w, 0]], { c: col, w: 2, dash: k ? '6 4' : '', clip: true }); G.dot(O.L, O.K, { c: COL.s3, r: 6 }); G.text(O.L, O.K, c.lab || 'E', { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12 }); });
  G.legend([{ c: COL.ink, t: fr ? 'isoquante' : 'isoquant' }, { c: COL.s1, t: fr ? 'isocoût' : 'isocost' }].concat(cases.length > 1 ? [{ c: COL.s2, dash: '6 4', t: fr ? 'nouvel isocoût' : 'new isocost' }] : []), G.ml + 60, 16);
  return '<div style="max-width:540px;margin:0 auto">' + G.svg(fr ? 'Minimisation du coût' : 'Cost minimisation') + '</div>';
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez tracer des droites d'isocoût, caractériser la combinaison de facteurs qui produit une quantité donnée au moindre coût, calculer les demandes conditionnelles de facteurs et la fonction de coût d'une technologie Cobb-Douglas, et relier la forme des coûts aux rendements d'échelle.<br><br>
<strong>Pourquoi ?</strong> Quelle que soit la quantité qu'elle décide de produire, une entreprise rationnelle la produit au moindre coût. La fonction de coût qui en résulte résume toute l'information utile sur la technologie pour les décisions de production et d'offre.<br><br>
<strong>Prérequis.</strong> Technologie de production (page 5), lagrangien (page 2).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Isocoûts</a> · <a href="#s2">2. La tangence</a> · <a href="#s3">3. Demandes conditionnelles</a> · <a href="#s4">4. La fonction de coût</a> · <a href="#s5">5. Coûts et rendements</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Les droites d'isocoût</div>
<p>L'entreprise paie le travail au salaire \(w\) et le capital au coût d'usage \(r\). Le coût d'une combinaison est \(C=wL+rK\). Une <em>droite d'isocoût</em> rassemble les combinaisons de même coût : \(K=\frac{C}{r}-\frac{w}{r}L\). Sa pente, \(-w/r\), est le prix relatif du travail ; les isocoûts plus éloignés de l'origine correspondent à des coûts plus élevés.</p>

<div class="dossier-title" id="s2">2. La condition de tangence</div>
<p>Pour produire \(q\) au moindre coût, l'entreprise cherche l'isocoût le plus bas qui touche l'isoquante \(f(K,L)=q\). Pour une solution intérieure et des isoquantes convexes, il lui est tangent :
\[TMST_{L,K}=\frac{Pm_L}{Pm_K}=\frac{w}{r}\iff\frac{Pm_L}{w}=\frac{Pm_K}{r}\]
La dernière forme dit que le dernier euro dépensé en travail rapporte autant de production que le dernier euro dépensé en capital ; sinon, déplacer un euro d'un facteur vers l'autre augmenterait la production à coût constant. C'est le pendant de la condition \(TMS=p_1/p_2\) du consommateur.</p>
<div class="ifig" data-fig="tan"></div>
<div class="fig-cap">Figure 1 — Combinaison de moindre coût pour produire \(q=10\) avec \(q=K^{0.5}L^{0.5}\). L'isocoût le plus bas tangent à l'isoquante détermine la combinaison optimale. Augmentez le salaire : l'isocoût devient plus pentu, et l'entreprise remplace du travail par du capital.</div>

<div class="dossier-title" id="s3">3. Les demandes conditionnelles de facteurs</div>
<p>La combinaison de moindre coût dépend de \(q\), \(w\) et \(r\) : ce sont les <em>demandes conditionnelles</em> \(L^*(q,w,r)\) et \(K^*(q,w,r)\), « conditionnelles » à la quantité produite. Pour \(q=AK^aL^b\), la tangence \(\frac{bK}{aL}=\frac{w}{r}\) donne \(K=\frac{aw}{br}L\), et l'on reporte dans l'isoquante. Avec \(s=a+b\) :
\[L^*=\Big(\frac{q}{A}\Big)^{1/s}\Big(\frac{br}{aw}\Big)^{a/s},\qquad K^*=\Big(\frac{q}{A}\Big)^{1/s}\Big(\frac{aw}{br}\Big)^{b/s}\]
La demande conditionnelle d'un facteur diminue quand son prix augmente : c'est l'effet de substitution entre facteurs.</p>

<div class="dossier-title" id="s4">4. La fonction de coût</div>
<p>La <em>fonction de coût</em> donne le coût minimal de production de \(q\) : \(C(q)=wL^*+rK^*\). Pour une Cobb-Douglas :
\[C(q)=s\,\Big(\frac{q}{A}\Big)^{1/s}\Big(\frac{w}{b}\Big)^{b/s}\Big(\frac{r}{a}\Big)^{a/s}\]
On en déduit le coût moyen \(CM=C(q)/q\) et le coût marginal \(Cm=C'(q)\), coût de la dernière unité produite. Pour une Cobb-Douglas, \(Cm=\frac{C(q)}{s\,q}\).</p>

<div class="dossier-title" id="s5">5. Coûts et rendements d'échelle</div>
<p>Comme \(C(q)\) est proportionnel à \(q^{1/s}\), la forme des coûts reflète les rendements d'échelle. Avec des rendements constants (\(s=1\)), le coût est proportionnel à la quantité, et \(CM=Cm\) sont constants. Avec des rendements croissants (\(s&gt;1\)), le coût moyen décroît : ce sont des économies d'échelle, et \(Cm&lt;CM\). Avec des rendements décroissants (\(s&lt;1\)), le coût moyen croît, et \(Cm&gt;CM\).</p>
<div class="ifig" data-fig="costs"></div>
<div class="fig-cap">Figure 2 — Coût moyen (bleu) et coût marginal (rouge) d'une Cobb-Douglas symétrique selon les rendements d'échelle, pour \(w=r=1\). Rendements croissants : coûts décroissants ; rendements décroissants : coûts croissants, le coût marginal au-dessus du coût moyen.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Isocoût \(wL+rK=C\), de pente \(-w/r\).</li>
<li>Moindre coût : \(TMST=w/r\), soit \(Pm_L/w=Pm_K/r\).</li>
<li>Demandes conditionnelles \(L^*(q,w,r)\), \(K^*(q,w,r)\) ; décroissantes en leur propre prix.</li>
<li>\(C(q)\propto q^{1/s}\) pour une Cobb-Douglas : coûts moyens décroissants, constants ou croissants selon les rendements.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can draw isocost lines, characterise the factor combination that produces a given quantity at least cost, compute the conditional factor demands and the cost function of a Cobb-Douglas technology, and relate the shape of costs to returns to scale.<br><br>
<strong>Why?</strong> Whatever quantity it decides to produce, a rational firm produces it at least cost. The resulting cost function summarises all the information about technology that matters for production and supply decisions.<br><br>
<strong>Prerequisites.</strong> Production technology (page 5), Lagrangian (page 2).
</div>
<p class="toc">Contents: <a href="#s1">1. Isocosts</a> · <a href="#s2">2. Tangency</a> · <a href="#s3">3. Conditional demands</a> · <a href="#s4">4. The cost function</a> · <a href="#s5">5. Costs and returns</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Isocost lines</div>
<p>The firm pays labour the wage \(w\) and capital the user cost \(r\). The cost of a combination is \(C=wL+rK\). An <em>isocost line</em> gathers combinations with the same cost: \(K=\frac{C}{r}-\frac{w}{r}L\). Its slope, \(-w/r\), is the relative price of labour; isocosts further from the origin correspond to higher costs.</p>

<div class="dossier-title" id="s2">2. The tangency condition</div>
<p>To produce \(q\) at least cost, the firm looks for the lowest isocost touching the isoquant \(f(K,L)=q\). For an interior solution and convex isoquants, it is tangent to it:
\[MRTS_{L,K}=\frac{MP_L}{MP_K}=\frac{w}{r}\iff\frac{MP_L}{w}=\frac{MP_K}{r}\]
The last form says that the last euro spent on labour yields as much output as the last euro spent on capital; otherwise, moving one euro from one factor to the other would raise output at constant cost. It is the counterpart of the consumer's condition \(MRS=p_1/p_2\).</p>
<div class="ifig" data-fig="tan"></div>
<div class="fig-cap">Figure 1 — Least-cost combination to produce \(q=10\) with \(q=K^{0.5}L^{0.5}\). The lowest isocost tangent to the isoquant determines the optimal combination. Raise the wage: the isocost becomes steeper, and the firm replaces labour with capital.</div>

<div class="dossier-title" id="s3">3. Conditional factor demands</div>
<p>The least-cost combination depends on \(q\), \(w\) and \(r\): these are the <em>conditional demands</em> \(L^*(q,w,r)\) and \(K^*(q,w,r)\), "conditional" on the quantity produced. For \(q=AK^aL^b\), tangency \(\frac{bK}{aL}=\frac{w}{r}\) gives \(K=\frac{aw}{br}L\), which is substituted into the isoquant. With \(s=a+b\):
\[L^*=\Big(\frac{q}{A}\Big)^{1/s}\Big(\frac{br}{aw}\Big)^{a/s},\qquad K^*=\Big(\frac{q}{A}\Big)^{1/s}\Big(\frac{aw}{br}\Big)^{b/s}\]
The conditional demand for a factor falls when its price rises: this is the substitution effect between factors.</p>

<div class="dossier-title" id="s4">4. The cost function</div>
<p>The <em>cost function</em> gives the minimal cost of producing \(q\): \(C(q)=wL^*+rK^*\). For a Cobb-Douglas:
\[C(q)=s\,\Big(\frac{q}{A}\Big)^{1/s}\Big(\frac{w}{b}\Big)^{b/s}\Big(\frac{r}{a}\Big)^{a/s}\]
Average cost \(AC=C(q)/q\) and marginal cost \(MC=C'(q)\), the cost of the last unit produced, follow. For a Cobb-Douglas, \(MC=\frac{C(q)}{s\,q}\).</p>

<div class="dossier-title" id="s5">5. Costs and returns to scale</div>
<p>Since \(C(q)\) is proportional to \(q^{1/s}\), the shape of costs reflects returns to scale. With constant returns (\(s=1\)), cost is proportional to quantity, and \(AC=MC\) are constant. With increasing returns (\(s&gt;1\)), average cost falls: these are economies of scale, and \(MC&lt;AC\). With decreasing returns (\(s&lt;1\)), average cost rises, and \(MC&gt;AC\).</p>
<div class="ifig" data-fig="costs"></div>
<div class="fig-cap">Figure 2 — Average cost (blue) and marginal cost (red) of a symmetric Cobb-Douglas depending on returns to scale, for \(w=r=1\). Increasing returns: falling costs; decreasing returns: rising costs, marginal cost above average cost.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Isocost \(wL+rK=C\), slope \(-w/r\).</li>
<li>Least cost: \(MRTS=w/r\), that is \(MP_L/w=MP_K/r\).</li>
<li>Conditional demands \(L^*(q,w,r)\), \(K^*(q,w,r)\); decreasing in their own price.</li>
<li>\(C(q)\propto q^{1/s}\) for a Cobb-Douglas: average costs falling, constant or rising according to returns.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { w: 'Salaire w', r: 'Coût du capital r', tanRead: O => `<i>L</i>* = <span class="v">${fmt(O.L, 2)}</span>, <i>K</i>* = <span class="v">${fmt(O.K, 2)}</span>, coût minimal <span class="v">${fmt(O.C, 2)}</span>`, s: 'Somme des exposants s', q: 'quantité q', cm: 'coût moyen', cma: 'coût marginal', cAria: 'Coûts moyen et marginal' };
I18N.en.f = { w: 'Wage w', r: 'Capital cost r', tanRead: O => `<i>L</i>* = <span class="v">${fmt(O.L, 2)}</span>, <i>K</i>* = <span class="v">${fmt(O.K, 2)}</span>, minimal cost <span class="v">${fmt(O.C, 2)}</span>`, s: 'Sum of exponents s', q: 'quantity q', cm: 'average cost', cma: 'marginal cost', cAria: 'Average and marginal costs' };
FIGS.tan = {
  state: { w: 2, r: 2 },
  controls: L => [{ key: 'w', label: L.f.w, min: 0.5, max: 6, step: 0.5, fmt: v => fmtT(v, 1) }, { key: 'r', label: L.f.r, min: 0.5, max: 6, step: 0.5, fmt: v => fmtT(v, 1) }],
  draw: function (s, lang) { return { svg: p6fig(1, 0.5, 0.5, 10, [{ w: s.w, r: s.r }], lang, { X1: 40, Y1: 40 }), read: I18N[lang].f.tanRead(p6opt(1, 0.5, 0.5, s.w, s.r, 10)) }; }
};
FIGS.costs = {
  state: { s: 1 },
  controls: L => [{ key: 's', label: L.f.s, min: 0.6, max: 1.6, step: 0.2, fmt: v => fmtT(v, 1) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, C = q => p6opt(1, s.s / 2, s.s / 2, 1, 1, q).C, G = Plot({ w: 640, h: 280, x0: 0, x1: 20, y0: 0, y1: 6, mt: 26, mb: 42 });
    G.axes({ xt: [0, 5, 10, 15, 20], yt: [0, 2, 4, 6], xl: L.q, xf: v => String(v), yf: v => String(v) });
    G.clip(); G.curve(q => C(q) / q, 0.3, 20, { c: COL.s1, w: 2.4, clip: true }, 200); G.curve(q => C(q) / (s.s * q), 0.3, 20, { c: COL.s3, w: 2.4, clip: true }, 200);
    G.legend([{ c: COL.s1, t: L.cm }, { c: COL.s3, t: L.cma }], G.ml + 300, 16);
    return { svg: G.svg(L.cAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.A = rint(1, 3); D.a = pick([0.25, 0.5, 0.75]); D.b = pick([0.25, 0.5, 0.75]); D.w = rint(2, 10); D.r = rint(2, 10); D.q = 10 * rint(2, 10); D.wn = D.w * pick([2, 1.5]);
  D.O = p6opt(D.A, D.a, D.b, D.w, D.r, D.q); D.On = p6opt(D.A, D.a, D.b, D.wn, D.r, D.q);
  D.s = D.a + D.b; D.CM = D.O.C / D.q; D.Cm = D.O.C / (D.s * D.q);
  return D;
};
const p6f = D => String.raw`q=${D.A === 1 ? '' : D.A + '\\,'}K^{${texT(D.a, 2)}}L^{${texT(D.b, 2)}}`;
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Une entreprise produit selon la fonction \(${p6f(D)}\). Le salaire est \(w=${D.w}\) et le coût d'usage du capital \(r=${D.r}\). Elle souhaite produire \(q=${D.q}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Écrivez le problème de minimisation du coût et son lagrangien. Montrez qu'à l'optimum le TMST est égal au rapport des prix des facteurs.</div></li>
<li><div class="q-text">Déduisez-en les demandes conditionnelles de facteurs, puis leur valeur pour \(q=${D.q}\).</div></li>
<li><div class="q-text">Déterminez la fonction de coût \(C(q)\), le coût moyen et le coût marginal. Calculez-les pour \(q=${D.q}\) et reliez leur évolution aux rendements d'échelle.</div></li>
<li><div class="q-text">Le salaire passe à \(w'=${texT(D.wn, 2)}\). Déterminez la nouvelle combinaison de moindre coût pour produire la même quantité, et le nouveau coût. Commentez la substitution entre facteurs.</div></li>
<li><div class="q-text">Représentez l'isoquante \(q=${D.q}\) et les isocoûts tangents avant et après la hausse du salaire.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">A firm produces according to the function \(${p6f(D)}\). The wage is \(w=${D.w}\) and the user cost of capital \(r=${D.r}\). It wishes to produce \(q=${D.q}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Write the cost-minimisation problem and its Lagrangian. Show that at the optimum the MRTS equals the ratio of factor prices.</div></li>
<li><div class="q-text">Deduce the conditional factor demands, then their value for \(q=${D.q}\).</div></li>
<li><div class="q-text">Determine the cost function \(C(q)\), average cost and marginal cost. Compute them for \(q=${D.q}\) and relate their behaviour to returns to scale.</div></li>
<li><div class="q-text">The wage rises to \(w'=${texT(D.wn, 2)}\). Determine the new least-cost combination to produce the same quantity, and the new cost. Comment on the substitution between factors.</div></li>
<li><div class="q-text">Draw the isoquant \(q=${D.q}\) and the tangent isocosts before and after the wage rise.</div></li>
</ol></div>`;
});
function p6sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], A = D.A, a = D.a, b = D.b, w = D.w, r = D.r, q = D.q, O = D.O, On = D.On, s = D.s, n = x => texT(x, 4), ta = texT(a, 2), tb = texT(b, 2), ts = texT(s, 2);
  const TM = T_(['TMST', 'MRTS']), PM = T_(['Pm', 'MP']), CMn = T_(['CM', 'AC']), Cmn = T_(['Cm', 'MC']), Ac = A === 1 ? '' : A + '\\,';
  const k = a * w / (b * r);
  const X1 = Math.max(O.L, On.L) * 2.2, Y1 = Math.max(O.K, On.K) * 2.2;
  const rts = s > 1 ? T_(['croissants : le coût moyen diminue avec la quantité, le coût marginal est inférieur au coût moyen.', 'increasing: average cost falls with quantity, marginal cost is below average cost.']) : s < 1 ? T_(['décroissants : le coût moyen augmente avec la quantité, le coût marginal est supérieur au coût moyen.', 'decreasing: average cost rises with quantity, marginal cost is above average cost.']) : T_(['constants : coût moyen et coût marginal sont égaux et constants.', 'constant: average and marginal costs are equal and constant.']);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['L\'entreprise minimise', 'The firm minimises'])} \(${w}\,L+${r}\,K\) ${T_(['sous la contrainte', 'subject to'])} \(${Ac}K^{${ta}}L^{${tb}}=${q}\). ${T_(['Le lagrangien est', 'The Lagrangian is'])} \(\mathcal{L}=${w}\,L+${r}\,K+\mu\,(${q}-${Ac}K^{${ta}}L^{${tb}})\), ${T_(['et ses dérivées partielles s\'annulent à l\'optimum :', 'and its partial derivatives vanish at the optimum:'])}
  \[\frac{\partial\mathcal{L}}{\partial L}=${w}-\mu\,${PM}_L=0\qquad\frac{\partial\mathcal{L}}{\partial K}=${r}-\mu\,${PM}_K=0\]
  ${T_(['En divisant la première par la seconde, le multiplicateur disparaît, et avec', 'Dividing the first by the second, the multiplier disappears, and with'])} \(${PM}_L=\frac{${tb}\,q}{L}\), \(${PM}_K=\frac{${ta}\,q}{K}\) :
  \[${TM}_{L,K}=\frac{${PM}_L}{${PM}_K}=\frac{${tb}\,K}{${ta}\,L}=\frac{${w}}{${r}}\]
  ${T_(['Le multiplicateur', 'The multiplier'])} \(\mu=\frac{w}{${PM}_L}\) ${T_(['est le coût d\'une unité de production supplémentaire : c\'est le coût marginal.', 'is the cost of one extra unit of output: it is marginal cost.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La tangence donne', 'Tangency gives'])} \(K=\frac{${ta}\times ${w}}{${tb}\times ${r}}\,L=${n(k)}\,L\). ${T_(['En reportant dans l\'isoquante :', 'Substituting into the isoquant:'])}
  \[\begin{aligned}${Ac}(${n(k)}\,L)^{${ta}}L^{${tb}}&amp;=q\\L^{${ts}}&amp;=\frac{q}{${A === 1 ? '' : A + '\\times '}${fqp(k)}^{${ta}}}\\L^*(q)&amp;=\Big(\frac{q}{${n(A * Math.pow(k, a))}}\Big)^{${texT(1 / s, 4)}}\qquad K^*(q)=${n(k)}\,L^*(q)\end{aligned}\]
  ${T_(['Pour', 'For'])} \(q=${q}\), ${T_(['on obtient', 'we get'])} \(L^*=${fqa(O.L)}\) ${T_(['et', 'and'])} \(K^*=${fqa(O.K)}\).</p>
  <p class="check">${T_(['Vérification', 'Check'])} : \(${A === 1 ? '' : A + '\\times '}${fqp(O.K)}^{${ta}}\times ${fqp(O.L)}^{${tb}}${eqa(A * Math.pow(O.K, a) * Math.pow(O.L, b))}=q\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le coût minimal est', 'The minimal cost is'])} \(C(q)=w\,L^*+r\,K^*=(${w}+${r}\times ${n(k)})\,L^*(q)=${n(w + r * k)}\,\Big(\frac{q}{${n(A * Math.pow(k, a))}}\Big)^{${texT(1 / s, 4)}}\), ${T_(['proportionnel à', 'proportional to'])} \(q^{1/${ts}}\). ${T_(['Pour', 'For'])} \(q=${q}\) :
  \[\begin{aligned}C(${q})&amp;=${w}\times ${n(O.L)}+${r}\times ${n(O.K)}=${fqa(O.C)}\\${CMn}&amp;=\frac{C(q)}{q}=\frac{${n(O.C)}}{${q}}=${fqa(D.CM)}\\${Cmn}&amp;=C'(q)=\frac{C(q)}{${ts}\,q}=${fqa(D.Cm)}\end{aligned}\]
  ${T_(['Les rendements d\'échelle sont', 'Returns to scale are'])} ${rts}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec', 'With'])} \(w'=${fqa(D.wn)}\), ${T_(['la tangence devient', 'tangency becomes'])} \(K=${n(a * D.wn / (b * r))}\,L\) : ${T_(['le capital devient relativement moins cher, et la combinaison optimale s\'enrichit en capital. Les mêmes calculs donnent', 'capital becomes relatively cheaper, and the optimal combination becomes more capital-intensive. The same computations give'])} \(L^{*\prime}=${fqa(On.L)}\), \(K^{*\prime}=${fqa(On.K)}\) ${T_(['et un coût', 'and a cost'])} \(${n(On.C)}\). ${T_(['L\'entreprise emploie moins de travail', 'The firm employs less labour'])} (\(${n(On.L)}&lt;${n(O.L)}\)) ${T_(['et plus de capital', 'and more capital'])} (\(${n(On.K)}&gt;${n(O.K)}\)) : ${T_(['c\'est la substitution du capital au travail. Le coût augmente de', 'this is the substitution of capital for labour. Cost rises by'])} \(${n(On.C - O.C)}\), ${T_(['soit moins que ce que coûterait la combinaison initiale au nouveau salaire', 'less than the initial combination would cost at the new wage'])}, \(${n(D.wn * O.L + r * O.K)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'isoquante (noir) est la même ; le nouvel isocoût, plus pentu, est tangent plus haut sur l\'isoquante :', 'The isoquant (black) is the same; the new, steeper isocost is tangent higher up the isoquant:'])}</p>
  <div class="sol-fig">${p6fig(A, a, b, q, [{ w: w, r: r, lab: 'E' }, { w: D.wn, r: r, lab: 'E′' }], lang, { X1: X1, Y1: Y1 })}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => p6sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => p6sol(D, 'en'))(D));