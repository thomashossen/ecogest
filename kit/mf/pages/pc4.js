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
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 4 – Élasticités et surplus du consommateur', 'k-h1': 'Élasticités et surplus du consommateur', 'k-coursetitle': 'Mesurer la sensibilité de la demande, relier élasticité et dépense, calculer le surplus des consommateurs', 'k-extitle': 'Élasticités prix, revenu et croisée, dépense et surplus', 'k-soltitle': 'Élasticités prix, revenu et croisée, dépense et surplus' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 4 – Elasticities and consumer surplus', 'k-h1': 'Elasticities and consumer surplus', 'k-coursetitle': 'Measuring the sensitivity of demand, linking elasticity and expenditure, computing consumer surplus', 'k-extitle': 'Price, income and cross elasticities, expenditure and surplus', 'k-soltitle': 'Price, income and cross elasticities, expenditure and surplus' });

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez calculer les élasticités prix, revenu et croisée d'une demande, classer les biens à partir de ces élasticités, prévoir l'effet d'une variation de prix sur la dépense des consommateurs, et calculer le surplus des consommateurs et sa variation à l'aide d'intégrales.<br><br>
<strong>Pourquoi ?</strong> Une entreprise qui fixe ses prix, un État qui crée une taxe, une autorité qui évalue une fusion ont tous besoin de savoir de combien la demande réagit, et de mesurer en euros ce que gagnent ou perdent les consommateurs.<br><br>
<strong>Prérequis.</strong> Choix optimal et demandes (page 2), intégrales.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Élasticité-prix</a> · <a href="#s2">2. Élasticité et dépense</a> · <a href="#s3">3. Revenu et prix croisé</a> · <a href="#s4">4. Surplus des consommateurs</a> · <a href="#s5">5. Variation du surplus</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. L'élasticité-prix</div>
<p>L'élasticité-prix de la demande mesure la variation en pourcentage de la quantité demandée provoquée par une variation de 1 % du prix :
\[\varepsilon=\frac{dQ/Q}{dp/p}=\frac{dQ}{dp}\cdot\frac{p}{Q}\]
Elle est négative pour une demande décroissante. La demande est <em>élastique</em> si \(|\varepsilon|&gt;1\), <em>inélastique</em> si \(|\varepsilon|&lt;1\). Pour une demande linéaire \(Q=A-bp\), l'élasticité \(-\frac{bp}{A-bp}\) varie le long de la droite : nulle au prix nul, égale à \(-1\) au milieu, infinie au prix maximal. Pour une variation finie de \(p_0\) à \(p_1\), on utilise l'élasticité d'arc, calculée aux points moyens.</p>
<div class="ifig" data-fig="el"></div>
<div class="fig-cap">Figure 1 — Demande linéaire \(Q=100-2p\) : partie élastique (haut) et inélastique (bas), et rectangle de dépense \(p\times Q\) au prix choisi. La dépense est maximale au milieu de la droite, là où \(|\varepsilon|=1\).</div>

<div class="dossier-title" id="s2">2. Élasticité et dépense</div>
<p>La dépense des consommateurs, recette des producteurs, vaut \(D=pQ(p)\). Sa dérivée est \(D'(p)=Q+p\,Q'(p)=Q\,(1+\varepsilon)\). Une hausse de prix augmente la dépense si la demande est inélastique (\(|\varepsilon|&lt;1\)) et la diminue si elle est élastique. C'est pourquoi une mauvaise récolte, qui fait monter le prix de produits à demande inélastique, peut augmenter le revenu des agriculteurs.</p>
<div class="ifig" data-fig="rt"></div>
<div class="fig-cap">Figure 2 — Dépense \(p\,Q(p)\) en fonction du prix pour la demande de la figure 1. Elle croît tant que la demande est inélastique, atteint son maximum en \(p=25\), où \(|\varepsilon|=1\), puis décroît.</div>

<div class="dossier-title" id="s3">3. Élasticités revenu et croisée</div>
<p>L'élasticité-revenu \(\eta=\frac{\partial Q}{\partial R}\cdot\frac{R}{Q}\) classe les biens : <em>inférieur</em> si \(\eta&lt;0\), <em>normal</em> si \(\eta&gt;0\), et parmi ceux-ci <em>de première nécessité</em> si \(0&lt;\eta&lt;1\) (leur part dans le budget baisse quand le revenu augmente) et <em>de luxe</em> si \(\eta&gt;1\). L'élasticité croisée \(\varepsilon_{xy}=\frac{\partial Q_x}{\partial p_y}\cdot\frac{p_y}{Q_x}\) est positive pour des biens <em>substituts</em> (café et thé) et négative pour des biens <em>compléments</em> (café et sucre).</p>

<div class="dossier-title" id="s4">4. Le surplus des consommateurs</div>
<p>La demande inverse \(P(q)\) donne le prix maximal que les consommateurs sont prêts à payer pour la \(q\)-ième unité. Au prix \(p_0\), ils achètent \(Q_0\) unités, et le <em>surplus des consommateurs</em> est la somme des écarts entre ce qu'ils étaient prêts à payer et ce qu'ils paient :
\[SC(p_0)=\int_0^{Q_0}\big(P(q)-p_0\big)\,dq=\int_{p_0}^{p_{\max}}Q(p)\,dp\]
C'est l'aire comprise entre la courbe de demande et la droite horizontale de prix. Les deux intégrales, en quantité ou en prix, donnent la même aire.</p>

<div class="dossier-title" id="s5">5. La variation du surplus</div>
<p>Quand le prix passe de \(p_0\) à \(p_1&gt;p_0\), la perte de surplus est \(\Delta SC=-\int_{p_0}^{p_1}Q(p)\,dp\). Elle se décompose en un rectangle \((p_1-p_0)\,Q_1\), supplément payé sur les unités encore achetées, et un triangle, valeur perdue des unités auxquelles les consommateurs renoncent. Cette mesure marshallienne est une approximation de la variation compensatrice (page 3), d'autant meilleure que l'effet de revenu est faible.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>\(\varepsilon=\frac{dQ}{dp}\frac{p}{Q}\) ; élastique si \(|\varepsilon|&gt;1\) ; pour une demande linéaire, \(|\varepsilon|=1\) au milieu.</li>
<li>\(D'(p)=Q(1+\varepsilon)\) : une hausse de prix augmente la dépense si la demande est inélastique.</li>
<li>Élasticité-revenu : inférieur, nécessité, luxe ; élasticité croisée : substituts (+), compléments (−).</li>
<li>\(SC=\int_0^{Q_0}(P(q)-p_0)\,dq\) ; perte due à une hausse de prix : \(\int_{p_0}^{p_1}Q(p)\,dp\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can compute the price, income and cross elasticities of a demand, classify goods from these elasticities, predict the effect of a price change on consumer expenditure, and compute consumer surplus and its change using integrals.<br><br>
<strong>Why?</strong> A firm setting its prices, a government creating a tax, an authority assessing a merger all need to know how much demand reacts, and to measure in euros what consumers gain or lose.<br><br>
<strong>Prerequisites.</strong> Optimal choice and demand (page 2), integrals.
</div>
<p class="toc">Contents: <a href="#s1">1. Price elasticity</a> · <a href="#s2">2. Elasticity and expenditure</a> · <a href="#s3">3. Income and cross price</a> · <a href="#s4">4. Consumer surplus</a> · <a href="#s5">5. Change in surplus</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Price elasticity</div>
<p>The price elasticity of demand measures the percentage change in quantity demanded caused by a 1% change in price:
\[\varepsilon=\frac{dQ/Q}{dp/p}=\frac{dQ}{dp}\cdot\frac{p}{Q}\]
It is negative for a decreasing demand. Demand is <em>elastic</em> if \(|\varepsilon|&gt;1\), <em>inelastic</em> if \(|\varepsilon|&lt;1\). For a linear demand \(Q=A-bp\), the elasticity \(-\frac{bp}{A-bp}\) varies along the line: zero at a zero price, \(-1\) at the midpoint, infinite at the maximum price. For a finite change from \(p_0\) to \(p_1\), the arc elasticity, computed at midpoints, is used.</p>
<div class="ifig" data-fig="el"></div>
<div class="fig-cap">Figure 1 — Linear demand \(Q=100-2p\): elastic part (top) and inelastic part (bottom), and the expenditure rectangle \(p\times Q\) at the chosen price. Expenditure is maximal at the midpoint of the line, where \(|\varepsilon|=1\).</div>

<div class="dossier-title" id="s2">2. Elasticity and expenditure</div>
<p>Consumer expenditure, producers' revenue, is \(D=pQ(p)\). Its derivative is \(D'(p)=Q+p\,Q'(p)=Q\,(1+\varepsilon)\). A price rise increases expenditure if demand is inelastic (\(|\varepsilon|&lt;1\)) and decreases it if demand is elastic. This is why a poor harvest, which raises the price of products with inelastic demand, may increase farmers' income.</p>
<div class="ifig" data-fig="rt"></div>
<div class="fig-cap">Figure 2 — Expenditure \(p\,Q(p)\) as a function of price for the demand of figure 1. It rises while demand is inelastic, peaks at \(p=25\), where \(|\varepsilon|=1\), then falls.</div>

<div class="dossier-title" id="s3">3. Income and cross elasticities</div>
<p>The income elasticity \(\eta=\frac{\partial Q}{\partial R}\cdot\frac{R}{Q}\) classifies goods: <em>inferior</em> if \(\eta&lt;0\), <em>normal</em> if \(\eta&gt;0\), and among these <em>necessities</em> if \(0&lt;\eta&lt;1\) (their budget share falls as income rises) and <em>luxuries</em> if \(\eta&gt;1\). The cross elasticity \(\varepsilon_{xy}=\frac{\partial Q_x}{\partial p_y}\cdot\frac{p_y}{Q_x}\) is positive for <em>substitutes</em> (coffee and tea) and negative for <em>complements</em> (coffee and sugar).</p>

<div class="dossier-title" id="s4">4. Consumer surplus</div>
<p>The inverse demand \(P(q)\) gives the maximum price consumers are willing to pay for the \(q\)-th unit. At price \(p_0\), they buy \(Q_0\) units, and <em>consumer surplus</em> is the sum of the gaps between what they were willing to pay and what they pay:
\[CS(p_0)=\int_0^{Q_0}\big(P(q)-p_0\big)\,dq=\int_{p_0}^{p_{\max}}Q(p)\,dp\]
It is the area between the demand curve and the horizontal price line. Both integrals, over quantities or over prices, give the same area.</p>

<div class="dossier-title" id="s5">5. Change in surplus</div>
<p>When the price rises from \(p_0\) to \(p_1&gt;p_0\), the surplus loss is \(\Delta CS=-\int_{p_0}^{p_1}Q(p)\,dp\). It splits into a rectangle \((p_1-p_0)\,Q_1\), the extra amount paid on the units still bought, and a triangle, the lost value of the units consumers give up. This Marshallian measure approximates the compensating variation (page 3), all the better as the income effect is small.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>\(\varepsilon=\frac{dQ}{dp}\frac{p}{Q}\); elastic if \(|\varepsilon|&gt;1\); for a linear demand, \(|\varepsilon|=1\) at the midpoint.</li>
<li>\(D'(p)=Q(1+\varepsilon)\): a price rise increases expenditure if demand is inelastic.</li>
<li>Income elasticity: inferior, necessity, luxury; cross elasticity: substitutes (+), complements (−).</li>
<li>\(CS=\int_0^{Q_0}(P(q)-p_0)\,dq\); loss from a price rise: \(\int_{p_0}^{p_1}Q(p)\,dp\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { p: 'Prix p', Q: 'quantité Q', el: 'zone élastique', in: 'zone inélastique', dep: 'dépense', elAria: 'Demande linéaire, élasticité et dépense', elRead: (p, e, d) => `Au prix ${fmtT(p, 1)} : ε = <span class="v">${fmt(e, 3)}</span> (${Math.abs(e) > 1 ? 'élastique' : Math.abs(e) < 1 ? 'inélastique' : 'élasticité unitaire'}) &nbsp;·&nbsp; dépense <span class="v">${fmt(d, 0)}</span>`, rtAria: 'Dépense en fonction du prix' };
I18N.en.f = { p: 'Price p', Q: 'quantity Q', el: 'elastic range', in: 'inelastic range', dep: 'expenditure', elAria: 'Linear demand, elasticity and expenditure', elRead: (p, e, d) => `At price ${fmtT(p, 1)}: ε = <span class="v">${fmt(e, 3)}</span> (${Math.abs(e) > 1 ? 'elastic' : Math.abs(e) < 1 ? 'inelastic' : 'unit elastic'}) &nbsp;·&nbsp; expenditure <span class="v">${fmt(d, 0)}</span>`, rtAria: 'Expenditure as a function of price' };
FIGS.el = {
  state: { p: 15 },
  controls: L => [{ key: 'p', label: L.f.p, min: 2, max: 48, step: 1, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, Q = 100 - 2 * s.p, G = Plot({ w: 640, h: 320, x0: 0, x1: 100, y0: 0, y1: 55, mt: 26, mb: 42 });
    G.axes({ xt: [0, 25, 50, 75, 100], yt: [0, 10, 20, 30, 40, 50], xl: L.Q, yl: 'p', xf: v => String(v), yf: v => String(v) });
    G.add(`<rect x="${G.X(0)}" y="${G.Y(s.p)}" width="${G.X(Q) - G.X(0)}" height="${G.Y(0) - G.Y(s.p)}" fill="${COL.s2}" fill-opacity="0.22"/>`);
    G.line([[0, 50], [50, 25]], { c: COL.s3, w: 3 }); G.line([[50, 25], [100, 0]], { c: COL.s1, w: 3 });
    G.dot(Q, s.p, { c: COL.ink, r: 6 });
    G.legend([{ c: COL.s3, t: L.el }, { c: COL.s1, t: L.in }, { c: COL.s2, box: true, o: 0.3, t: L.dep }], G.ml + 300, 16);
    return { svg: G.svg(L.elAria), read: L.elRead(s.p, -2 * s.p / Q, s.p * Q) };
  }
};
FIGS.rt = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, G = Plot({ w: 640, h: 260, x0: 0, x1: 50, y0: 0, y1: 1400, mt: 26, mb: 42, ml: 56 });
    G.axes({ xt: [0, 10, 20, 25, 30, 40, 50], yt: [0, 400, 800, 1200], xl: 'p', yl: L.dep, xf: v => String(v), yf: v => fmt(v, 0) });
    G.curve(p => p * (100 - 2 * p), 0, 50, { c: COL.s2, w: 2.4 }, 200); G.dot(25, 1250, { c: COL.s3, r: 6 });
    return { svg: G.svg(L.rtAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = 10 * rint(4, 12); D.b = pick([1, 2, 4, 5]); D.c = pick([0.01, 0.02, 0.05]); D.R = 100 * rint(10, 40); D.d = pick([-2, -1, 1, 2, 3]); D.py = rint(2, 10);
    D.A = D.a + D.c * D.R + D.d * D.py; D.pmax = D.A / D.b;
    D.p0 = rint(Math.ceil(D.pmax * 0.15), Math.floor(D.pmax * 0.7)); D.p1 = D.p0 + rint(1, Math.max(1, Math.floor(D.pmax * 0.15)));
    D.Q0 = D.A - D.b * D.p0; D.Q1 = D.A - D.b * D.p1;
    if (D.Q1 <= 2 || D.A <= 0 || Math.abs(D.b * D.p0 / D.Q0 - 1) < 0.05) continue;
    break;
  }
  D.eps = -D.b * D.p0 / D.Q0; D.eta = D.c * D.R / D.Q0; D.cross = D.d * D.py / D.Q0;
  D.pstar = D.A / (2 * D.b); D.SC0 = D.Q0 * D.Q0 / (2 * D.b); D.SC1 = D.Q1 * D.Q1 / (2 * D.b); D.dSC = D.SC1 - D.SC0;
  D.arc = ((D.Q1 - D.Q0) / ((D.Q0 + D.Q1) / 2)) / ((D.p1 - D.p0) / ((D.p0 + D.p1) / 2));
  D.Dexp0 = D.p0 * D.Q0; D.Dexp1 = D.p1 * D.Q1;
  return D;
};
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">La demande d'un bien \(x\) est \(Q=${D.a}-${cfx(D.b)}p+${texT(D.c, 2)}\,R${D.d < 0 ? '-' : '+'}${cfx(Math.abs(D.d))}p_y\), où \(p\) est son prix, \(R\) le revenu des consommateurs et \(p_y\) le prix d'un autre bien \(y\). Initialement, \(R=${D.R}\), \(p_y=${D.py}\) et \(p=${D.p0}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Calculez la quantité demandée et l'élasticité-prix de la demande. La demande est-elle élastique ?</div></li>
<li><div class="q-text">Calculez l'élasticité-revenu et l'élasticité croisée. Quelle est la nature du bien \(x\), et sa relation avec le bien \(y\) ?</div></li>
<li><div class="q-text">À revenu et prix de \(y\) donnés, quel prix maximise la dépense des consommateurs ? Une hausse du prix augmente-t-elle la dépense ?</div></li>
<li><div class="q-text">Calculez, à l'aide d'une intégrale, le surplus des consommateurs au prix \(p=${D.p0}\).</div></li>
<li><div class="q-text">Le prix passe à \(p=${D.p1}\). Calculez l'élasticité d'arc, la nouvelle dépense et la variation du surplus des consommateurs, par une intégrale puis par la décomposition en rectangle et triangle.</div></li>
<li><div class="q-text">Représentez graphiquement la demande, le surplus initial et la perte de surplus.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Demand for a good \(x\) is \(Q=${D.a}-${cfx(D.b)}p+${texT(D.c, 2)}\,R${D.d < 0 ? '-' : '+'}${cfx(Math.abs(D.d))}p_y\), where \(p\) is its price, \(R\) consumers' income and \(p_y\) the price of another good \(y\). Initially, \(R=${D.R}\), \(p_y=${D.py}\) and \(p=${D.p0}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Compute the quantity demanded and the price elasticity of demand. Is demand elastic?</div></li>
<li><div class="q-text">Compute the income elasticity and the cross elasticity. What is the nature of good \(x\), and its relation with good \(y\)?</div></li>
<li><div class="q-text">With given income and price of \(y\), which price maximises consumer expenditure? Does a price rise increase expenditure?</div></li>
<li><div class="q-text">Compute, using an integral, consumer surplus at price \(p=${D.p0}\).</div></li>
<li><div class="q-text">The price rises to \(p=${D.p1}\). Compute the arc elasticity, the new expenditure and the change in consumer surplus, by an integral then by the rectangle-and-triangle decomposition.</div></li>
<li><div class="q-text">Draw demand, the initial surplus and the surplus loss.</div></li>
</ol></div>`;
});
function p4sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], n = x => texT(x, 4), m = x => texT(x, 2), b = D.b, A = D.A, p0 = D.p0, p1 = D.p1, Q0 = D.Q0, Q1 = D.Q1;
  const SC = T_(['SC', 'CS']);
  const G = Plot({ w: 640, h: 320, x0: 0, x1: A * 1.03, y0: 0, y1: D.pmax * 1.08, mt: 26, mb: 42 });
  G.axes({ xt: ticks(0, A, 5), yt: ticks(0, D.pmax, 5), xl: 'Q', yl: 'p', xf: v => fmtT(v, 0), yf: v => fmtT(v, 1) });
  G.add(`<path d="M${G.X(0)} ${G.Y(D.pmax)} L${G.X(Q1)} ${G.Y(p1)} L${G.X(0)} ${G.Y(p1)} Z" fill="${COL.s1}" fill-opacity="0.22"/>`);
  G.add(`<rect x="${G.X(0)}" y="${G.Y(p1)}" width="${G.X(Q1) - G.X(0)}" height="${G.Y(p0) - G.Y(p1)}" fill="${COL.s3}" fill-opacity="0.3"/>`);
  G.add(`<path d="M${G.X(Q1)} ${G.Y(p1)} L${G.X(Q0)} ${G.Y(p0)} L${G.X(Q1)} ${G.Y(p0)} Z" fill="${COL.s3}" fill-opacity="0.5"/>`);
  G.line([[0, D.pmax], [A, 0]], { c: COL.s1, w: 2.4 });
  G.dot(Q0, p0, { c: COL.s1, r: 5 }); G.dot(Q1, p1, { c: COL.s3, r: 5 });
  G.legend([{ c: COL.s1, box: true, o: 0.3, t: T_(['surplus restant', 'remaining surplus']) }, { c: COL.s3, box: true, o: 0.35, t: T_(['rectangle de perte', 'loss rectangle']) }, { c: COL.s3, box: true, o: 0.6, t: T_(['triangle de perte', 'loss triangle']) }], G.ml + 8, 16);
  const rect = (p1 - p0) * Q1, tri = (p1 - p0) * (Q0 - Q1) / 2;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['En remplaçant', 'Substituting'])} \(R\) ${T_(['et', 'and'])} \(p_y\), ${T_(['la demande s\'écrit', 'demand reads'])} \(Q=${n(A)}-${cfx(b)}p\). ${T_(['Au prix', 'At price'])} \(p=${p0}\), \(Q_0=${n(A)}-${b === 1 ? '' : b + '\\times '}${p0}=${fqa(Q0)}\). ${T_(['L\'élasticité-prix est', 'The price elasticity is'])}
  \[\varepsilon=\frac{\partial Q}{\partial p}\cdot\frac{p}{Q}=-${b}\times\frac{${p0}}{${n(Q0)}}${eqa(D.eps)}\]
  ${T_(['Comme', 'Since'])} \(|\varepsilon|${Math.abs(D.eps) > 1 ? '&gt;' : '&lt;'}1\), ${T_(['la demande est', 'demand is'])} ${Math.abs(D.eps) > 1 ? T_(['élastique : une hausse de 1 % du prix réduit la quantité de plus de 1 %.', 'elastic: a 1% price rise reduces quantity by more than 1%.']) : T_(['inélastique : une hausse de 1 % du prix réduit la quantité de moins de 1 %.', 'inelastic: a 1% price rise reduces quantity by less than 1%.'])}</p>
</div></li>
<li><div class="q-content">
  <p>\(\eta=\frac{\partial Q}{\partial R}\cdot\frac{R}{Q}=${texT(D.c, 2)}\times\frac{${D.R}}{${n(Q0)}}${eqa(D.eta)}\) : ${D.eta > 1 ? T_(['le bien est normal et de luxe, sa part dans le budget augmente avec le revenu.', 'the good is normal and a luxury, its budget share rises with income.']) : T_(['le bien est normal et de première nécessité : sa demande augmente avec le revenu, mais moins que proportionnellement.', 'the good is normal and a necessity: its demand rises with income, but less than proportionally.'])} \(\varepsilon_{xy}=\frac{\partial Q}{\partial p_y}\cdot\frac{p_y}{Q}=${D.d}\times\frac{${D.py}}{${n(Q0)}}${eqa(D.cross)}\) : ${D.d > 0 ? T_(['positive, les biens sont substituts : une hausse du prix de y reporte la demande vers x.', 'positive, the goods are substitutes: a rise in the price of y shifts demand towards x.']) : T_(['négative, les biens sont compléments : une hausse du prix de y réduit aussi la demande de x.', 'negative, the goods are complements: a rise in the price of y also reduces demand for x.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La dépense est', 'Expenditure is'])} \(D(p)=p\,(${n(A)}-${cfx(b)}p)\), ${T_(['de dérivée', 'with derivative'])} \(D'(p)=${n(A)}-${n(2 * b)}\,p\), ${T_(['nulle en', 'zero at'])} \(p^*=\frac{${n(A)}}{${n(2 * b)}}=${fqa(D.pstar)}\), ${T_(['où', 'where'])} \(|\varepsilon|=1\). ${p0 < D.pstar ? T_(['Au prix actuel, inférieur à', 'At the current price, below']) + ' \\(p^*\\), ' + T_(['la demande est inélastique et une hausse de prix augmente la dépense.', 'demand is inelastic and a price rise increases expenditure.']) : T_(['Au prix actuel, supérieur à', 'At the current price, above']) + ' \\(p^*\\), ' + T_(['la demande est élastique et une hausse de prix diminue la dépense.', 'demand is elastic and a price rise decreases expenditure.'])} ${T_(['On le vérifie avec', 'We check this with'])} \(D'(p)=Q(1+\varepsilon)\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La demande inverse est', 'Inverse demand is'])} \(P(q)=${b === 1 ? n(A) + '-q' : String.raw`\frac{${n(A)}-q}{${b}}`}\), ${T_(['de prix maximal', 'with maximum price'])} \(${n(D.pmax)}\). ${T_(['Le surplus est l\'intégrale de l\'écart entre ce que les consommateurs sont prêts à payer et le prix :', 'Surplus is the integral of the gap between what consumers are willing to pay and the price:'])}
  \[${SC}_0=\int_0^{${n(Q0)}}\Big(${b === 1 ? n(A) + '-q' : String.raw`\frac{${n(A)}-q}{${b}}`}-${p0}\Big)\,dq=\Big[${n(D.pmax - p0)}\,q-\frac{q^2}{${2 * b}}\Big]_0^{${n(Q0)}}=${fqa(D.SC0)}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Au nouveau prix, la quantité est', 'At the new price, quantity is'])} \(Q_1=${fqa(Q1)}\). ${T_(['L\'élasticité d\'arc, calculée aux points moyens, vaut', 'Arc elasticity, computed at midpoints, is'])} \(\frac{(${n(Q1)}-${n(Q0)})/${n((Q0 + Q1) / 2)}}{(${p1}-${p0})/${n((p0 + p1) / 2)}}${eqa(D.arc)}\). ${T_(['La dépense passe de', 'Expenditure goes from'])} \(${m(D.Dexp0)}\) ${T_(['à', 'to'])} \(${p1}\times ${n(Q1)}=${fqa(D.Dexp1)}\). ${T_(['La perte de surplus est l\'intégrale de la demande entre les deux prix :', 'The surplus loss is the integral of demand between the two prices:'])}
  \[-\Delta ${SC}=\int_{${p0}}^{${p1}}(${n(A)}-${cfx(b)}p)\,dp=\Big[${n(A)}\,p-${n(b / 2)}\,p^2\Big]_{${p0}}^{${p1}}=${fqa(-D.dSC)}\]
  ${T_(['Elle se décompose en un rectangle, supplément payé sur les', 'It splits into a rectangle, the extra paid on the'])} \(${n(Q1)}\) ${T_(['unités encore achetées,', 'units still bought,'])} \((${p1}-${p0})\times ${n(Q1)}=${fqa(rect)}\), ${T_(['et un triangle, valeur perdue des unités abandonnées,', 'and a triangle, the lost value of the units given up,'])} \(\frac12(${p1}-${p0})(${n(Q0)}-${n(Q1)})=${fqa(tri)}\) ; ${T_(['on retrouve', 'together'])} \(${m(rect)}+${m(tri)}=${fqa(-D.dSC)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus restant est le triangle bleu ; la perte se compose du rectangle et du triangle rouges :', 'The remaining surplus is the blue triangle; the loss consists of the red rectangle and triangle:'])}</p>
  <div class="sol-fig">${G.svg('surplus')}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => p4sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => p4sol(D, 'en'))(D));