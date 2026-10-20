I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 5 – Technologie de production', 'k-h1': 'Technologie de production', 'k-coursetitle': 'Fonction de production, productivités, rendements d\'échelle, isoquantes et TMST', 'k-extitle': 'Productivités, rendements d\'échelle et isoquantes d\'une Cobb-Douglas', 'k-soltitle': 'Productivités, rendements d\'échelle et isoquantes d\'une Cobb-Douglas' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 5 – Production technology', 'k-h1': 'Production technology', 'k-coursetitle': 'Production function, productivities, returns to scale, isoquants and MRTS', 'k-extitle': 'Productivities, returns to scale and isoquants of a Cobb-Douglas', 'k-soltitle': 'Productivities, returns to scale and isoquants of a Cobb-Douglas' });

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez décrire une technologie par une fonction de production, calculer les productivités moyennes et marginales et expliquer leurs relations, énoncer la loi des rendements décroissants, tracer des isoquantes, calculer le taux marginal de substitution technique (TMST) et déterminer la nature des rendements d'échelle.<br><br>
<strong>Pourquoi ?</strong> Les coûts d'une entreprise, et donc son offre, découlent de sa technologie : combien de travail et de capital faut-il pour produire, et peut-on remplacer l'un par l'autre ? Ces notions sont au cœur de la théorie du producteur, comme les préférences au cœur de celle du consommateur.<br><br>
<strong>Prérequis.</strong> Dérivées partielles ; la page 1 pour le parallèle avec les courbes d'indifférence.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Fonction de production</a> · <a href="#s2">2. Court terme</a> · <a href="#s3">3. Isoquantes et TMST</a> · <a href="#s4">4. Rendements d'échelle</a> · <a href="#s5">5. Cobb-Douglas</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La fonction de production</div>
<p>Une fonction de production \(q=f(K,L)\) donne la quantité maximale produite avec \(K\) unités de capital et \(L\) unités de travail, compte tenu de la technologie. La <em>productivité marginale</em> du travail \(Pm_L=\frac{\partial f}{\partial L}\) est le supplément de production apporté par une unité de travail de plus ; la <em>productivité moyenne</em> \(PM_L=\frac{f(K,L)}{L}\) est la production par unité de travail. On définit de même \(Pm_K\) et \(PM_K\).</p>

<div class="dossier-title" id="s2">2. À court terme : un facteur fixe</div>
<p>À court terme, le capital est fixé. Selon la <em>loi des rendements décroissants</em>, au-delà d'un certain point, ajouter du travail à un capital fixe augmente de moins en moins la production : \(Pm_L\) finit par décroître. La productivité marginale coupe la productivité moyenne en son maximum : tant que la dernière unité rapporte plus que la moyenne, elle fait monter la moyenne ; dès qu'elle rapporte moins, elle la fait baisser. Ce résultat se démontre en dérivant \(PM_L\) : \(\frac{d}{dL}\frac{f}{L}=\frac{1}{L}(Pm_L-PM_L)\).</p>
<div class="ifig" data-fig="sr"></div>
<div class="fig-cap">Figure 1 — Fonction de production de court terme \(q=12L^2-L^3\). Choisissez l'affichage : la production totale, ou les productivités. La productivité marginale (rouge) est maximale en \(L=4\), point d'inflexion de la production totale, et coupe la productivité moyenne (bleu) en son maximum, en \(L=6\).</div>

<div class="dossier-title" id="s3">3. Isoquantes et TMST</div>
<p>À long terme, tous les facteurs sont variables. Une <em>isoquante</em> rassemble les combinaisons \((L,K)\) qui permettent de produire la même quantité \(q\). Le long d'une isoquante, \(Pm_L\,dL+Pm_K\,dK=0\). Le <em>taux marginal de substitution technique</em> est la quantité de capital que l'on peut économiser en employant une unité de travail de plus, à production constante :
\[TMST_{L,K}=-\frac{dK}{dL}\Big|_{q}=\frac{Pm_L}{Pm_K}\]
C'est la valeur absolue de la pente de l'isoquante ; il est généralement décroissant (isoquantes convexes).</p>

<div class="dossier-title" id="s4">4. Les rendements d'échelle</div>
<p>Quand on multiplie tous les facteurs par \(t&gt;1\), la production est multipliée par plus que \(t\) (rendements <em>croissants</em>), par \(t\) (rendements <em>constants</em>) ou par moins que \(t\) (rendements <em>décroissants</em>). À ne pas confondre avec la loi des rendements décroissants, qui concerne un seul facteur : une technologie peut avoir des rendements d'échelle constants et une productivité marginale du travail décroissante. Graphiquement, les isoquantes \(q\), \(2q\), \(3q\) se resserrent quand les rendements sont croissants et s'écartent quand ils sont décroissants.</p>
<div class="ifig" data-fig="iso"></div>
<div class="fig-cap">Figure 2 — Isoquantes \(q\), \(2q\) et \(3q\) de \(q=K^aL^a\) selon la somme \(2a\) des exposants. Avec des rendements croissants, les isoquantes successives se rapprochent : doubler la production demande moins que doubler les facteurs. La droite pointillée est un rayon : le long d'un rayon, les proportions de facteurs restent les mêmes.</div>

<div class="dossier-title" id="s5">5. La fonction Cobb-Douglas</div>
<p>Pour \(q=AK^aL^b\) : \(Pm_L=\frac{bq}{L}\), \(Pm_K=\frac{aq}{K}\), \(TMST=\frac{bK}{aL}\). L'élasticité de la production par rapport au travail vaut \(b\), par rapport au capital \(a\). Comme \(f(tK,tL)=t^{a+b}f(K,L)\), les rendements d'échelle sont croissants si \(a+b&gt;1\), constants si \(a+b=1\), décroissants si \(a+b&lt;1\). Les productivités marginales sont décroissantes dès que \(a&lt;1\) et \(b&lt;1\). Avec des rendements constants, la production est égale à la somme des facteurs rémunérés à leur productivité marginale (théorème d'Euler) : \(q=Pm_L\,L+Pm_K\,K\).</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>\(Pm_L=\partial f/\partial L\), \(PM_L=f/L\) ; \(Pm_L\) coupe \(PM_L\) en son maximum.</li>
<li>Loi des rendements décroissants : à capital fixe, \(Pm_L\) finit par décroître.</li>
<li>Isoquante : \(f(K,L)=q\) ; \(TMST=\frac{Pm_L}{Pm_K}\), valeur absolue de sa pente.</li>
<li>Rendements d'échelle : \(f(tK,tL)\) comparé à \(t\,f(K,L)\) ; Cobb-Douglas : selon \(a+b\gtrless 1\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can describe a technology by a production function, compute average and marginal products and explain their relations, state the law of diminishing returns, draw isoquants, compute the marginal rate of technical substitution (MRTS) and determine the nature of returns to scale.<br><br>
<strong>Why?</strong> A firm's costs, and hence its supply, stem from its technology: how much labour and capital are needed to produce, and can one replace the other? These notions are at the heart of producer theory, as preferences are at the heart of consumer theory.<br><br>
<strong>Prerequisites.</strong> Partial derivatives; page 1 for the parallel with indifference curves.
</div>
<p class="toc">Contents: <a href="#s1">1. Production function</a> · <a href="#s2">2. Short run</a> · <a href="#s3">3. Isoquants and MRTS</a> · <a href="#s4">4. Returns to scale</a> · <a href="#s5">5. Cobb-Douglas</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The production function</div>
<p>A production function \(q=f(K,L)\) gives the maximum output from \(K\) units of capital and \(L\) units of labour, given the technology. The <em>marginal product</em> of labour \(MP_L=\frac{\partial f}{\partial L}\) is the extra output from one more unit of labour; the <em>average product</em> \(AP_L=\frac{f(K,L)}{L}\) is output per unit of labour. \(MP_K\) and \(AP_K\) are defined likewise.</p>

<div class="dossier-title" id="s2">2. Short run: one fixed factor</div>
<p>In the short run, capital is fixed. By the <em>law of diminishing returns</em>, beyond some point, adding labour to fixed capital raises output less and less: \(MP_L\) eventually falls. The marginal product crosses the average product at its maximum: as long as the last unit yields more than the average, it pulls the average up; as soon as it yields less, it pulls it down. This follows from differentiating \(AP_L\): \(\frac{d}{dL}\frac{f}{L}=\frac{1}{L}(MP_L-AP_L)\).</p>
<div class="ifig" data-fig="sr"></div>
<div class="fig-cap">Figure 1 — Short-run production function \(q=12L^2-L^3\). Choose the display: total product, or the productivities. The marginal product (red) peaks at \(L=4\), the inflection point of total product, and crosses the average product (blue) at its maximum, at \(L=6\).</div>

<div class="dossier-title" id="s3">3. Isoquants and MRTS</div>
<p>In the long run, all factors are variable. An <em>isoquant</em> gathers the combinations \((L,K)\) that produce the same quantity \(q\). Along an isoquant, \(MP_L\,dL+MP_K\,dK=0\). The <em>marginal rate of technical substitution</em> is the amount of capital that can be saved by employing one more unit of labour, at constant output:
\[MRTS_{L,K}=-\frac{dK}{dL}\Big|_{q}=\frac{MP_L}{MP_K}\]
It is the absolute value of the isoquant's slope; it is usually decreasing (convex isoquants).</p>

<div class="dossier-title" id="s4">4. Returns to scale</div>
<p>When all factors are multiplied by \(t&gt;1\), output is multiplied by more than \(t\) (<em>increasing</em> returns), by \(t\) (<em>constant</em> returns) or by less than \(t\) (<em>decreasing</em> returns). Not to be confused with the law of diminishing returns, which concerns a single factor: a technology may have constant returns to scale and a diminishing marginal product of labour. Graphically, isoquants \(q\), \(2q\), \(3q\) get closer together with increasing returns and further apart with decreasing returns.</p>
<div class="ifig" data-fig="iso"></div>
<div class="fig-cap">Figure 2 — Isoquants \(q\), \(2q\) and \(3q\) of \(q=K^aL^a\) depending on the sum \(2a\) of the exponents. With increasing returns, successive isoquants get closer: doubling output requires less than doubling inputs. The dashed line is a ray: along a ray, factor proportions stay the same.</div>

<div class="dossier-title" id="s5">5. The Cobb-Douglas function</div>
<p>For \(q=AK^aL^b\): \(MP_L=\frac{bq}{L}\), \(MP_K=\frac{aq}{K}\), \(MRTS=\frac{bK}{aL}\). The output elasticity with respect to labour is \(b\), with respect to capital \(a\). Since \(f(tK,tL)=t^{a+b}f(K,L)\), returns to scale are increasing if \(a+b&gt;1\), constant if \(a+b=1\), decreasing if \(a+b&lt;1\). Marginal products are decreasing as soon as \(a&lt;1\) and \(b&lt;1\). With constant returns, output equals the sum of factors paid their marginal product (Euler's theorem): \(q=MP_L\,L+MP_K\,K\).</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>\(MP_L=\partial f/\partial L\), \(AP_L=f/L\); \(MP_L\) crosses \(AP_L\) at its maximum.</li>
<li>Law of diminishing returns: with fixed capital, \(MP_L\) eventually falls.</li>
<li>Isoquant: \(f(K,L)=q\); \(MRTS=\frac{MP_L}{MP_K}\), absolute value of its slope.</li>
<li>Returns to scale: compare \(f(tK,tL)\) with \(t\,f(K,L)\); Cobb-Douglas: according to \(a+b\gtrless 1\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { view: 'Affichage', pt: 'production totale', prod: 'productivités', L: 'travail L', pm: 'productivité marginale', pmo: 'productivité moyenne', srAria: 'Production de court terme', rs: 'Somme des exposants 2a', isoAria: 'Isoquantes et rendements d\'échelle', isoRead: s => s > 1 ? 'Rendements d\'échelle croissants : les isoquantes se rapprochent.' : s < 1 ? 'Rendements d\'échelle décroissants : les isoquantes s\'écartent.' : 'Rendements d\'échelle constants : isoquantes régulièrement espacées le long d\'un rayon.' };
I18N.en.f = { view: 'Display', pt: 'total product', prod: 'productivities', L: 'labour L', pm: 'marginal product', pmo: 'average product', srAria: 'Short-run production', rs: 'Sum of exponents 2a', isoAria: 'Isoquants and returns to scale', isoRead: s => s > 1 ? 'Increasing returns to scale: isoquants get closer.' : s < 1 ? 'Decreasing returns to scale: isoquants spread out.' : 'Constant returns to scale: evenly spaced isoquants along a ray.' };
FIGS.sr = {
  state: { v: 'prod' },
  controls: L => [{ key: 'v', type: 'select', label: L.f.view, options: [{ v: 'pt', t: L.f.pt }, { v: 'prod', t: L.f.prod }] }],
  draw: function (s, lang) {
    const L = I18N[lang].f;
    if (s.v === 'pt') {
      const G = Plot({ w: 640, h: 300, x0: 0, x1: 12, y0: 0, y1: 300, mt: 26, mb: 42 });
      G.axes({ xt: [0, 2, 4, 6, 8, 10, 12], yt: [0, 100, 200, 300], xl: L.L, xf: v => String(v), yf: v => String(v) });
      G.curve(l => 12 * l * l - l * l * l, 0, 12, { c: COL.s2, w: 2.4 }, 200); G.dot(4, 128, { c: COL.s3, r: 5 }); G.dot(8, 256, { c: COL.ink, r: 5 });
      return { svg: G.svg(L.srAria), read: '' };
    }
    const G = Plot({ w: 640, h: 300, x0: 0, x1: 12, y0: -10, y1: 52, mt: 26, mb: 42 });
    G.axes({ xt: [0, 2, 4, 6, 8, 10, 12], yt: [0, 10, 20, 30, 40, 50], xl: L.L, xf: v => String(v), yf: v => String(v), xAxisAt: 0 });
    G.clip(); G.curve(l => 24 * l - 3 * l * l, 0, 12, { c: COL.s3, w: 2.4, clip: true }, 200); G.curve(l => 12 * l - l * l, 0, 12, { c: COL.s1, w: 2.4, clip: true }, 200);
    G.dot(6, 36, { c: COL.ink, r: 5 });
    G.legend([{ c: COL.s3, t: L.pm }, { c: COL.s1, t: L.pmo }], G.ml + 8, 16);
    return { svg: G.svg(L.srAria), read: '' };
  }
};
FIGS.iso = {
  state: { s: 1 },
  controls: L => [{ key: 's', label: L.f.rs, min: 0.6, max: 1.6, step: 0.2, fmt: v => fmtT(v, 1) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = s.s / 2, G = Plot({ w: 520, h: 440, x0: 0, x1: 10, y0: 0, y1: 10, mt: 26, mb: 42, ml: 46 });
    G.axes({ xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10], xl: 'L', yl: 'K', xf: v => String(v), yf: v => String(v) });
    G.clip();
    [1, 2, 3].forEach((q, k) => G.curve(l => Math.pow(q * 2, 1 / a) / Math.pow(l, 1), 0.05, 10, { c: [COL.s1, COL.s2, COL.s3][k], w: 2.2, clip: true }, 300));
    G.line([[0, 0], [10, 10]], { c: GREY, w: 1, dash: '4 4', clip: true });
    [1, 2, 3].forEach(q => { const x = Math.pow(q * 2, 1 / (2 * a)); G.dot(x, x, { c: COL.ink, r: 4 }); });
    return { svg: '<div style="max-width:540px;margin:0 auto">' + G.svg(L.isoAria) + '</div>', read: L.isoRead(s.s) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) { D.A = rint(1, 4); D.a = pick([0.25, 0.5, 0.75]); D.b = pick([0.25, 0.5, 0.75]); if (D.a + D.b !== 1 || rnd() < 0.4) break; }
  D.K = pick([4, 9, 16, 25]); D.L = pick([4, 9, 16, 36]);
  D.q = D.A * Math.pow(D.K, D.a) * Math.pow(D.L, D.b);
  D.PmL = D.b * D.q / D.L; D.PmK = D.a * D.q / D.K; D.PML = D.q / D.L; D.tmst = D.PmL / D.PmK;
  D.L2 = D.L * 2; D.K2 = Math.pow(D.q / (D.A * Math.pow(D.L2, D.b)), 1 / D.a);
  return D;
};
const p5f = D => String.raw`f(K,L)=${D.A === 1 ? '' : D.A}\,K^{${texT(D.a, 2)}}L^{${texT(D.b, 2)}}`;
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Une entreprise produit selon la fonction \(q=${p5f(D)}\). Elle emploie actuellement \(K=${D.K}\) unités de capital et \(L=${D.L}\) unités de travail.</div>
<div class="questions"><ol>
<li><div class="q-text">Calculez la production, les productivités marginales du travail et du capital, et la productivité moyenne du travail. Les productivités marginales sont-elles décroissantes ?</div></li>
<li><div class="q-text">Déterminez la nature des rendements d'échelle.</div></li>
<li><div class="q-text">Calculez le TMST au point actuel et interprétez-le. Déterminez l'équation de l'isoquante passant par ce point, et la quantité de capital nécessaire pour produire la même quantité avec \(L=${D.L2}\).</div></li>
<li><div class="q-text">Calculez les élasticités de la production par rapport à chaque facteur. Vérifiez la relation \(Pm_L\,L+Pm_K\,K=(a+b)\,q\) et commentez.</div></li>
<li><div class="q-text">À court terme, le capital est fixé à \(K=${D.K}\). Écrivez la fonction de production de court terme, ses productivités moyenne et marginale, et comparez-les.</div></li>
<li><div class="q-text">Représentez l'isoquante passant par le point actuel, celle correspondant au double de la production, et la tangente au point actuel.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A firm produces according to the function \(q=${p5f(D)}\). It currently employs \(K=${D.K}\) units of capital and \(L=${D.L}\) units of labour.</div>
<div class="questions"><ol>
<li><div class="q-text">Compute output, the marginal products of labour and capital, and the average product of labour. Are the marginal products decreasing?</div></li>
<li><div class="q-text">Determine the nature of returns to scale.</div></li>
<li><div class="q-text">Compute the MRTS at the current point and interpret it. Determine the equation of the isoquant through this point, and the capital needed to produce the same quantity with \(L=${D.L2}\).</div></li>
<li><div class="q-text">Compute the output elasticities with respect to each factor. Check the relation \(MP_L\,L+MP_K\,K=(a+b)\,q\) and comment.</div></li>
<li><div class="q-text">In the short run, capital is fixed at \(K=${D.K}\). Write the short-run production function, its average and marginal products, and compare them.</div></li>
<li><div class="q-text">Draw the isoquant through the current point, the one corresponding to twice the output, and the tangent at the current point.</div></li>
</ol></div>`;
};
function p5sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], A = D.A, a = D.a, b = D.b, K = D.K, L = D.L, q = D.q, n = x => texT(x, 4), ta = texT(a, 2), tb = texT(b, 2), Ac = A === 1 ? '' : A + '\\,', An = A === 1 ? '' : A + '\\times ';
  const PM = T_(['Pm', 'MP']), PMo = T_(['PM', 'AP']), TM = T_(['TMST', 'MRTS']), s = a + b;
  const rts = s > 1 ? T_(['croissants', 'increasing']) : s < 1 ? T_(['décroissants', 'decreasing']) : T_(['constants', 'constant']);
  const X1 = Math.max(D.L2, L) * 1.6, Y1 = Math.max(K, D.K2) * 2.2;
  const G = Plot({ w: 520, h: 440, x0: 0, x1: X1, y0: 0, y1: Y1, mt: 26, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, X1, 4), yt: ticks(0, Y1, 4), xl: 'L', yl: 'K', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
  G.clip();
  const iso = qq => G.curve(l => Math.pow(qq / (A * Math.pow(l, b)), 1 / a), 0.05, X1, { c: qq === q ? COL.s1 : COL.s2, w: 2.2, clip: true }, 400);
  iso(q); iso(2 * q);
  G.line([[L - X1, K + X1 * D.tmst], [L + X1, K - X1 * D.tmst]], { c: COL.s3, w: 1.6, dash: '6 4', clip: true });
  G.dot(L, K, { c: COL.s3, r: 6 }); G.dot(D.L2, D.K2, { c: COL.s1, r: 5 });
  G.legend([{ c: COL.s1, t: 'q = ' + fmtT(q, 2) }, { c: COL.s2, t: 'q = ' + fmtT(2 * q, 2) }, { c: COL.s3, dash: '6 4', t: T_(['tangente', 'tangent']) }], G.ml + 60, 16);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['La production vaut', 'Output is'])} \(q=${An}${K}^{${ta}}\times ${L}^{${tb}}=${n(q)}\). ${T_(['Les productivités marginales sont les dérivées partielles ; on peut les écrire en fonction de', 'Marginal products are the partial derivatives; they can be written in terms of'])} \(q\) :
  \[\begin{aligned}${PM}_L&amp;=\frac{\partial f}{\partial L}=${tb}\times ${Ac}K^{${ta}}L^{${texT(b - 1, 2)}}=\frac{${tb}\,q}{L}=\frac{${tb}\times ${n(q)}}{${L}}=${n(D.PmL)}\\${PM}_K&amp;=\frac{\partial f}{\partial K}=\frac{${ta}\,q}{K}=\frac{${ta}\times ${n(q)}}{${K}}=${n(D.PmK)}\\${PMo}_L&amp;=\frac{q}{L}=\frac{${n(q)}}{${L}}=${n(D.PML)}\end{aligned}\]
  ${T_(['Comme', 'Since'])} \(\frac{\partial^2f}{\partial L^2}=${tb}\,(${tb}-1)\,\frac{q}{L^2}&lt;0\) ${T_(['et de même pour', 'and likewise for'])} \(K\) (${T_(['exposants inférieurs à 1', 'exponents below 1'])}), ${T_(['les productivités marginales sont décroissantes : chaque facteur obéit à la loi des rendements décroissants.', 'marginal products are decreasing: each factor obeys the law of diminishing returns.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['En multipliant les deux facteurs par', 'Multiplying both factors by'])} \(t&gt;1\) :
  \[f(tK,tL)=${Ac}(tK)^{${ta}}(tL)^{${tb}}=t^{${ta}+${tb}}\,f(K,L)=t^{${texT(s, 2)}}\,f(K,L)\]
  ${T_(['Comme', 'Since'])} \(a+b=${texT(s, 2)}${s > 1 ? '&gt;' : s < 1 ? '&lt;' : '='}1\), ${T_(['les rendements d\'échelle sont', 'returns to scale are'])} ${rts} : ${T_(['doubler les facteurs multiplie la production par', 'doubling inputs multiplies output by'])} \(2^{${texT(s, 2)}}\approx ${n(Math.pow(2, s))}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le TMST est le rapport des productivités marginales :', 'The MRTS is the ratio of marginal products:'])}
  \[${TM}_{L,K}=\frac{${PM}_L}{${PM}_K}=\frac{${tb}\,K}{${ta}\,L}=\frac{${tb}\times ${K}}{${ta}\times ${L}}=${n(D.tmst)}\]
  ${T_(['Au point actuel, une unité de travail supplémentaire permet d\'économiser environ', 'At the current point, one extra unit of labour saves about'])} \(${n(D.tmst)}\) ${T_(['unité(s) de capital à production constante. L\'isoquante passant par ce point est l\'ensemble des combinaisons telles que', 'unit(s) of capital at constant output. The isoquant through this point is the set of combinations such that'])} \(${Ac}K^{${ta}}L^{${tb}}=${n(q)}\), ${T_(['soit', 'that is'])}
  \[K=\Big(\frac{${n(q)}}{${Ac}L^{${tb}}}\Big)^{${texT(1 / a, 4)}}\]
  ${T_(['Pour', 'For'])} \(L=${D.L2}\), ${T_(['on en déduit', 'we get'])} \(K=${n(D.K2)}\) : ${T_(['doubler le travail permet de réduire le capital de', 'doubling labour allows capital to be cut from'])} ${K} ${T_(['à', 'to'])} \(${n(D.K2)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'élasticité de la production par rapport au travail est', 'The output elasticity with respect to labour is'])} \(\frac{${PM}_L\,L}{q}=${tb}\), ${T_(['par rapport au capital', 'with respect to capital'])} \(\frac{${PM}_K\,K}{q}=${ta}\) : ${T_(['une hausse de 1 % du travail augmente la production de', 'a 1% rise in labour raises output by'])} \(${texT(100 * b, 0)}\,\%\). ${T_(['On vérifie', 'We check'])} \(${PM}_L\,L+${PM}_K\,K=${n(D.PmL)}\times ${L}+${n(D.PmK)}\times ${K}=${n(D.PmL * L + D.PmK * K)}=${texT(s, 2)}\times ${n(q)}\). ${s === 1 ? T_(['Les rendements étant constants, la production est exactement épuisée par la rémunération des facteurs à leur productivité marginale (théorème d\'Euler).', 'Returns being constant, output is exactly exhausted by paying factors their marginal product (Euler\'s theorem).']) : s > 1 ? T_(['Avec des rendements croissants, payer chaque facteur à sa productivité marginale coûterait plus que la production : l\'entreprise ferait des pertes.', 'With increasing returns, paying each factor its marginal product would cost more than output: the firm would make losses.']) : T_(['Avec des rendements décroissants, la rémunération des facteurs à leur productivité marginale laisse un reste, qui rémunère un facteur fixe implicite.', 'With decreasing returns, paying factors their marginal product leaves a residual, which rewards an implicit fixed factor.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['À court terme,', 'In the short run,'])} \(q(L)=${An}${K}^{${ta}}\,L^{${tb}}=${n(A * Math.pow(K, a))}\,L^{${tb}}\), ${T_(['d\'où', 'hence'])} \(${PMo}_L=${n(A * Math.pow(K, a))}\,L^{${texT(b - 1, 2)}}\) ${T_(['et', 'and'])} \(${PM}_L=${tb}\times ${n(A * Math.pow(K, a))}\,L^{${texT(b - 1, 2)}}=${tb}\times ${PMo}_L\). ${T_(['La productivité marginale est toujours égale à', 'The marginal product is always'])} \(${tb}\) ${T_(['fois la productivité moyenne, donc inférieure à elle : les deux décroissent avec', 'times the average product, hence below it: both decrease with'])} \(L\), ${T_(['ce qui est cohérent avec la relation', 'consistent with the relation'])} \(\frac{d\,${PMo}_L}{dL}=\frac{1}{L}(${PM}_L-${PMo}_L)&lt;0\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'isoquante du point actuel (bleu), celle de la production doublée (dorée) et la tangente au point actuel, de pente', 'The isoquant of the current point (blue), that of doubled output (gold) and the tangent at the current point, with slope'])} \(-${n(D.tmst)}\) :</p>
  <div class="sol-fig"><div style="max-width:540px;margin:0 auto">${G.svg('iso')}</div></div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => p5sol(D, 'fr');
I18N.en.sol = D => p5sol(D, 'en');
