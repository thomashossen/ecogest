/* ============================================================
   PAGE ei2 — Discrimination par les prix
   ============================================================ */
const GREY = '#8a857a';
const KBASE_FR = { 'k-badge': 'MICROÉCONOMIE', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer', 'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé', phSeed: 'auto', copy: 'Copier', copied: 'Copié', 'k-sub': '© Thomas Hossen – Version du 20 octobre 2026' };
const KBASE_EN = { 'k-badge': 'MICROECONOMICS', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate', 'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution', phSeed: 'auto', copy: 'Copy', copied: 'Copied', 'k-sub': '© Thomas Hossen – Version of 20 October 2026' };
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 2 – Discrimination par les prix', 'k-h1': 'Discrimination par les prix', 'k-coursetitle': 'Vendre le même bien à des prix différents : conditions, prix optimaux et effets sur le bien-être', 'k-extitle': 'Monopole sur deux marchés : discrimination, prix unique et surplus', 'k-soltitle': 'Monopole sur deux marchés : discrimination, prix unique et surplus' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 2 – Price discrimination', 'k-h1': 'Price discrimination', 'k-coursetitle': 'Selling the same good at different prices: conditions, optimal prices and welfare effects', 'k-extitle': 'Monopoly on two markets: discrimination, uniform price and surplus', 'k-soltitle': 'Monopoly on two markets: discrimination, uniform price and surplus' });

/* ---------- outils : deux demandes P_i = a_i - b_i q_i, coût marginal constant c ---------- */
function e2solve(a1, b1, a2, b2, c) {
  const q1 = (a1 - c) / (2 * b1), q2 = (a2 - c) / (2 * b2), p1 = (a1 + c) / 2, p2 = (a2 + c) / 2;
  const A = a1 / b1 + a2 / b2, B = 1 / b1 + 1 / b2;                 /* Q(p) = A - B p si les deux marchés sont servis */
  const pu = (A / B + c) / 2, qu1 = Math.max(0, (a1 - pu) / b1), qu2 = Math.max(0, (a2 - pu) / b2);
  const cs = (b, q) => b * q * q / 2;
  return {
    q1: q1, q2: q2, p1: p1, p2: p2, A: A, B: B, pu: pu, qu1: qu1, qu2: qu2,
    profD: (p1 - c) * q1 + (p2 - c) * q2, profU: (pu - c) * (qu1 + qu2),
    csD: cs(b1, q1) + cs(b2, q2), csU: cs(b1, qu1) + cs(b2, qu2),
    q1p: (a1 - c) / b1, q2p: (a2 - c) / b2, both: pu < Math.min(a1, a2)
  };
}

const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : texT(x, d === undefined ? 4 : d) + '\\,';
/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez dire à quelles conditions une entreprise peut pratiquer des prix différents pour un même bien, calculer les prix optimaux d'un monopole qui sert deux marchés séparés, les comparer au prix unique, et évaluer les conséquences sur les consommateurs, sur l'entreprise et sur le bien-être.<br><br>
<strong>Pourquoi ?</strong> Tarifs étudiants, billets de train ou d'avion selon la date de réservation, prix différents selon les pays, médicaments vendus moins cher dans les pays pauvres : la discrimination par les prix est partout.<br><br>
<strong>Prérequis.</strong> Le monopole (page 1), élasticité-prix, surplus.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Conditions</a> · <a href="#s2">2. Trois degrés</a> · <a href="#s3">3. Deux marchés</a> · <a href="#s4">4. Prix unique</a> · <a href="#s5">5. Bien-être</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Les conditions de la discrimination</div>
<p>Discriminer, c'est vendre un même bien à des prix différents, sans que l'écart de prix reflète un écart de coût. Trois conditions sont nécessaires : l'entreprise doit avoir un <em>pouvoir de marché</em> (en concurrence parfaite, le prix s'impose à elle) ; elle doit pouvoir <em>identifier</em> ou séparer les groupes de consommateurs ; la <em>revente</em> d'un groupe à l'autre doit être impossible ou coûteuse, sinon les acheteurs au prix bas revendraient aux autres.</p>

<div class="dossier-title" id="s2">2. Les trois degrés de discrimination</div>
<ul class="kit-simple">
<li><em>Premier degré</em> (parfaite) : chaque unité est vendue au prix maximal que l'acheteur est prêt à payer. Le monopole capte tout le surplus, mais produit la quantité efficace, celle où le prix de la dernière unité égale le coût marginal : il n'y a pas de perte sèche.</li>
<li><em>Deuxième degré</em> : le prix dépend de la quantité achetée ou de la version choisie (tarifs dégressifs, offres « premium »). Les consommateurs se trient eux-mêmes.</li>
<li><em>Troisième degré</em> : l'entreprise fixe un prix par groupe observable (âge, pays, statut). C'est le cas étudié dans la suite.</li>
</ul>

<div class="dossier-title" id="s3">3. Un monopole sur deux marchés séparés</div>
<p>Un monopole vend sur deux marchés de demandes inverses \(P_1(q_1)\) et \(P_2(q_2)\), avec un coût total \(C(q_1+q_2)\). Il maximise :
\[\Pi(q_1,q_2)=P_1(q_1)\,q_1+P_2(q_2)\,q_2-C(q_1+q_2)\]
Les deux conditions du premier ordre donnent :
\[Rm_1(q_1)=Rm_2(q_2)=Cm(q_1+q_2)\]
Si une recette marginale était plus élevée sur un marché, déplacer une unité vers ce marché augmenterait la recette sans changer le coût. Avec \(Rm_i=P_i\big(1-\frac{1}{|\varepsilon_i|}\big)\), l'égalité des recettes marginales s'écrit :
\[P_1\Big(1-\frac{1}{|\varepsilon_1|}\Big)=P_2\Big(1-\frac{1}{|\varepsilon_2|}\Big)\]
Le prix est plus élevé sur le marché où la demande est la moins élastique. Pour des demandes linéaires \(P_i=a_i-b_iq_i\) et un coût marginal constant \(c\), chaque marché est traité comme un monopole séparé : \(q_i=\frac{a_i-c}{2b_i}\) et \(p_i=\frac{a_i+c}{2}\).</p>
<div class="ifig" data-fig="disc"></div>
<div class="fig-cap">Figure 1 — Les deux marchés côte à côte, avec leur demande (bleu), leur recette marginale (pointillés) et le coût marginal commun (doré). Le monopole égalise les deux recettes marginales au coût marginal ; le prix est plus haut là où la demande est moins élastique. Le trait gris montre le prix unique qu'il fixerait sans discriminer.</div>

<div class="dossier-title" id="s4">4. Le prix unique</div>
<p>Si la discrimination est interdite, le monopole fixe un seul prix \(p\) face à la demande totale \(Q(p)=q_1(p)+q_2(p)\). Avec des demandes linéaires et si les deux marchés sont servis, \(Q(p)=A-Bp\) avec \(A=\frac{a_1}{b_1}+\frac{a_2}{b_2}\) et \(B=\frac{1}{b_1}+\frac{1}{b_2}\). La demande inverse totale est \(P(Q)=\frac{A}{B}-\frac{Q}{B}\), et le prix optimal :
\[p^u=\frac{1}{2}\Big(\frac{A}{B}+c\Big)\]
Il se situe entre les deux prix discriminants. Le profit en prix unique est toujours inférieur ou égal au profit discriminant, puisque le prix unique est un cas particulier de couple de prix. Si l'un des marchés a une demande très faible, le prix unique peut l'exclure : la discrimination permet alors de le servir.</p>

<div class="dossier-title" id="s5">5. Effets sur le bien-être</div>
<p>Avec des demandes linéaires et un coût marginal constant, lorsque les deux marchés sont servis dans les deux cas, la quantité totale est la même avec ou sans discrimination : \(q_1+q_2=\frac{a_1-c}{2b_1}+\frac{a_2-c}{2b_2}=\frac{A-Bc}{2}\). La discrimination ne change donc pas la production, mais sa répartition : les consommateurs du marché le moins élastique paient plus et achètent moins, les autres paient moins et achètent plus. Les unités ne vont plus à ceux qui les valorisent le plus, et le surplus total baisse. La discrimination n'améliore le bien-être que si elle augmente la production, par exemple en permettant de servir un marché qui serait exclu par le prix unique. La discrimination parfaite, elle, est efficace : tout le surplus va au monopole, mais aucune unité utile n'est perdue.</p>
<div class="ifig" data-fig="welf"></div>
<div class="fig-cap">Figure 2 — Surplus des consommateurs, profit et perte sèche selon le régime de prix, pour l'exemple de la figure 1. La discrimination de troisième degré augmente le profit au détriment des consommateurs et du surplus total ; la discrimination parfaite supprime la perte sèche, mais tout le surplus devient profit.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Conditions : pouvoir de marché, séparation des groupes, impossibilité de revente.</li>
<li>Troisième degré : \(Rm_1=Rm_2=Cm\) ; prix plus élevé là où la demande est moins élastique.</li>
<li>Le prix unique est compris entre les prix discriminants ; le profit discriminant est au moins égal au profit en prix unique.</li>
<li>Demandes linéaires : même production totale, donc moins de surplus total avec discrimination, sauf si elle permet de servir un marché exclu ; la discrimination parfaite est efficace.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can state when a firm can charge different prices for the same good, compute the optimal prices of a monopoly serving two separate markets, compare them with the uniform price, and assess the consequences for consumers, for the firm and for welfare.<br><br>
<strong>Why?</strong> Student fares, train or plane tickets depending on the booking date, prices that differ across countries, medicines sold more cheaply in poor countries: price discrimination is everywhere.<br><br>
<strong>Prerequisites.</strong> Monopoly (page 1), price elasticity, surplus.
</div>
<p class="toc">Contents: <a href="#s1">1. Conditions</a> · <a href="#s2">2. Three degrees</a> · <a href="#s3">3. Two markets</a> · <a href="#s4">4. Uniform price</a> · <a href="#s5">5. Welfare</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Conditions for discrimination</div>
<p>Discriminating means selling the same good at different prices, without the price gap reflecting a cost gap. Three conditions are necessary: the firm must have <em>market power</em> (under perfect competition, the price is imposed on it); it must be able to <em>identify</em> or separate groups of consumers; <em>resale</em> from one group to another must be impossible or costly, otherwise low-price buyers would resell to the others.</p>

<div class="dossier-title" id="s2">2. The three degrees of discrimination</div>
<ul class="kit-simple">
<li><em>First degree</em> (perfect): each unit is sold at the highest price the buyer is willing to pay. The monopoly captures all the surplus, but produces the efficient quantity, where the price of the last unit equals marginal cost: there is no deadweight loss.</li>
<li><em>Second degree</em>: the price depends on the quantity bought or the version chosen (quantity discounts, "premium" offers). Consumers sort themselves.</li>
<li><em>Third degree</em>: the firm sets one price per observable group (age, country, status). This is the case studied below.</li>
</ul>

<div class="dossier-title" id="s3">3. A monopoly on two separate markets</div>
<p>A monopoly sells on two markets with inverse demands \(P_1(q_1)\) and \(P_2(q_2)\), with total cost \(C(q_1+q_2)\). It maximises:
\[\Pi(q_1,q_2)=P_1(q_1)\,q_1+P_2(q_2)\,q_2-C(q_1+q_2)\]
The two first-order conditions give:
\[MR_1(q_1)=MR_2(q_2)=MC(q_1+q_2)\]
If marginal revenue were higher in one market, moving one unit to that market would raise revenue without changing cost. With \(MR_i=P_i\big(1-\frac{1}{|\varepsilon_i|}\big)\), equal marginal revenues read:
\[P_1\Big(1-\frac{1}{|\varepsilon_1|}\Big)=P_2\Big(1-\frac{1}{|\varepsilon_2|}\Big)\]
The price is higher in the market where demand is less elastic. For linear demands \(P_i=a_i-b_iq_i\) and a constant marginal cost \(c\), each market is treated as a separate monopoly: \(q_i=\frac{a_i-c}{2b_i}\) and \(p_i=\frac{a_i+c}{2}\).</p>
<div class="ifig" data-fig="disc"></div>
<div class="fig-cap">Figure 1 — The two markets side by side, with their demand (blue), marginal revenue (dashed) and the common marginal cost (gold). The monopoly equates both marginal revenues to marginal cost; the price is higher where demand is less elastic. The grey line shows the uniform price it would set without discriminating.</div>

<div class="dossier-title" id="s4">4. The uniform price</div>
<p>If discrimination is forbidden, the monopoly sets a single price \(p\) facing total demand \(Q(p)=q_1(p)+q_2(p)\). With linear demands and if both markets are served, \(Q(p)=A-Bp\) with \(A=\frac{a_1}{b_1}+\frac{a_2}{b_2}\) and \(B=\frac{1}{b_1}+\frac{1}{b_2}\). Total inverse demand is \(P(Q)=\frac{A}{B}-\frac{Q}{B}\), and the optimal price is:
\[p^u=\frac{1}{2}\Big(\frac{A}{B}+c\Big)\]
It lies between the two discriminating prices. Uniform-price profit is always at most the discriminating profit, since a uniform price is a special pair of prices. If one market has a very weak demand, the uniform price may exclude it: discrimination then allows it to be served.</p>

<div class="dossier-title" id="s5">5. Welfare effects</div>
<p>With linear demands and a constant marginal cost, when both markets are served in both cases, total output is the same with or without discrimination: \(q_1+q_2=\frac{a_1-c}{2b_1}+\frac{a_2-c}{2b_2}=\frac{A-Bc}{2}\). Discrimination therefore does not change output, but its allocation: consumers in the less elastic market pay more and buy less, the others pay less and buy more. Units no longer go to those who value them most, and total surplus falls. Discrimination only improves welfare if it raises output, for instance by allowing a market excluded by the uniform price to be served. Perfect discrimination is efficient: all the surplus goes to the monopoly, but no useful unit is lost.</p>
<div class="ifig" data-fig="welf"></div>
<div class="fig-cap">Figure 2 — Consumer surplus, profit and deadweight loss under each pricing regime, for the example of figure 1. Third-degree discrimination raises profit at the expense of consumers and of total surplus; perfect discrimination removes the deadweight loss, but all the surplus becomes profit.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Conditions: market power, separation of groups, no resale.</li>
<li>Third degree: \(MR_1=MR_2=MC\); higher price where demand is less elastic.</li>
<li>The uniform price lies between the discriminating prices; discriminating profit is at least the uniform-price profit.</li>
<li>Linear demands: same total output, hence less total surplus with discrimination, unless it allows an excluded market to be served; perfect discrimination is efficient.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  c: 'Coût marginal c', a2: 'Prix maximal sur le marché 2', m1: 'marché 1', m2: 'marché 2', q: 'quantité', dem: 'demande', rm: 'recette marginale', cm: 'coût marginal', pu: 'prix unique', discAria: 'Deux marchés, recettes marginales et coût marginal commun',
  discRead: (R) => `Prix discriminants : <span class="v">${fmt(R.p1, 2)}</span> et <span class="v">${fmt(R.p2, 2)}</span> &nbsp;·&nbsp; prix unique : <span class="v">${fmt(R.pu, 2)}</span>` + (R.both ? '' : ' (le marché 2 n\'est pas servi)'),
  reg: ['prix unique', '3ᵉ degré', '1ᵉʳ degré'], cs: 'surplus des consommateurs', pr: 'profit', dwl: 'perte sèche', welfAria: 'Surplus des consommateurs, profit et perte sèche selon le régime de prix',
  welfRead: (v) => `Surplus total : prix unique <span class="v">${fmt(v[0], 1)}</span> ; 3ᵉ degré <span class="v">${fmt(v[1], 1)}</span> ; 1ᵉʳ degré <span class="v">${fmt(v[2], 1)}</span>`
};
I18N.en.f = {
  c: 'Marginal cost c', a2: 'Maximum price in market 2', m1: 'market 1', m2: 'market 2', q: 'quantity', dem: 'demand', rm: 'marginal revenue', cm: 'marginal cost', pu: 'uniform price', discAria: 'Two markets, marginal revenues and common marginal cost',
  discRead: (R) => `Discriminating prices: <span class="v">${fmt(R.p1, 2)}</span> and <span class="v">${fmt(R.p2, 2)}</span> &nbsp;·&nbsp; uniform price: <span class="v">${fmt(R.pu, 2)}</span>` + (R.both ? '' : ' (market 2 is not served)'),
  reg: ['uniform price', '3rd degree', '1st degree'], cs: 'consumer surplus', pr: 'profit', dwl: 'deadweight loss', welfAria: 'Consumer surplus, profit and deadweight loss under each pricing regime',
  welfRead: (v) => `Total surplus: uniform price <span class="v">${fmt(v[0], 1)}</span>; 3rd degree <span class="v">${fmt(v[1], 1)}</span>; 1st degree <span class="v">${fmt(v[2], 1)}</span>`
};
const E2_EX = { a1: 100, b1: 1, b2: 0.5 };
FIGS.disc = {
  state: { c: 20, a2: 60 },
  controls: L => [
    { key: 'c', label: L.f.c, min: 0, max: 40, step: 5, fmt: v => String(v) },
    { key: 'a2', label: L.f.a2, min: 45, max: 100, step: 5, fmt: v => String(v) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, a1 = E2_EX.a1, b1 = E2_EX.b1, a2 = s.a2, b2 = E2_EX.b2, c = s.c, R = e2solve(a1, b1, a2, b2, c);
    const W = 680, H = 320, half = 330;
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${L.discAria}">`;
    [[a1, b1, R.q1, R.p1, L.m1, R.qu1], [a2, b2, R.q2, R.p2, L.m2, R.qu2]].forEach((m, k) => {
      const G = Plot({ w: half, h: H, x0: 0, x1: 210, y0: 0, y1: 110, mt: 30, mb: 40, ml: 40, mr: 10 });
      G.axes({ xt: [0, 100, 200], yt: [0, 50, 100], xl: m[4], xf: v => String(v), yf: v => String(v) });
      G.clip();
      G.line([[0, m[0]], [m[0] / m[1], 0]], { c: COL.s1, w: 2.2, clip: true });
      G.line([[0, m[0]], [m[0] / (2 * m[1]), 0]], { c: COL.s1, w: 1.4, dash: '5 4', clip: true });
      G.line([[0, c], [210, c]], { c: COL.s2, w: 2 });
      G.line([[0, R.pu], [210, R.pu]], { c: GREY, w: 1.2, dash: '3 3' });
      G.seg(m[2], 0, m[2], m[3], { c: GREY, w: 1, dash: '3 3' });
      G.dot(m[2], m[3], { c: COL.s1 }); G.text(m[2], m[3], fmtT(m[3], 1), { dx: 8, dy: -6, anchor: 'start', size: 11, mono: true });
      svg += `<g transform="translate(${k * (half + 20)},0)">${G.el.join('')}</g>`;
    });
    svg += '</svg>';
    return { svg: svg, read: L.discRead(R) };
  }
};
FIGS.welf = {
  state: {},
  controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, a1 = E2_EX.a1, b1 = E2_EX.b1, a2 = 60, b2 = E2_EX.b2, c = 20, R = e2solve(a1, b1, a2, b2, c);
    const Wmax = (a1 - c) * R.q1p / 2 + (a2 - c) * R.q2p / 2;
    const v = [[R.csU, R.profU], [R.csD, R.profD], [0, Wmax]];
    const G = Plot({ w: 680, h: 300, x0: 0.4, x1: 3.6, y0: 0, y1: Wmax * 1.12, mt: 30, mb: 42, ml: 60 });
    G.axes({ xt: [1, 2, 3], yt: ticks(0, Wmax * 1.12, 5), xf: v => L.reg[v - 1], yf: v => fmt(v, 0) });
    v.forEach((x, i) => { G.bar(i + 1, 90, x[0], { c: COL.s1, o: 0.8 }); G.bar(i + 1, 90, x[0] + x[1], { base: x[0], c: '#2e7d5b', o: 0.7 }); G.bar(i + 1, 90, Wmax, { base: x[0] + x[1], c: COL.s3, o: 0.35 }); });
    G.legend([{ c: COL.s1, box: true, o: 0.8, t: L.cs }, { c: '#2e7d5b', box: true, o: 0.7, t: L.pr }, { c: COL.s3, box: true, o: 0.35, t: L.dwl }], G.ml + 8, 16);
    return { svg: G.svg(L.welfAria), read: L.welfRead(v.map(x => x[0] + x[1])) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a1 = 10 * rint(8, 16); D.a2 = 10 * rint(5, 10); D.b1 = pick([0.5, 1, 2]); D.b2 = pick([0.25, 0.5, 1]); D.c = 2 * rint(3, 15);
    if (D.a2 >= D.a1 || D.a2 <= D.c + 10) continue;
    D.R = e2solve(D.a1, D.b1, D.a2, D.b2, D.c);
    if (!D.R.both) continue;
    if (D.R.pu - D.R.p2 < 2) continue;
    break;
  }
  const R = D.R, c = D.c;
  D.e1 = -(1 / D.b1) * R.p1 / R.q1; D.e2 = -(1 / D.b2) * R.p2 / R.q2;
  D.SC1 = D.b1 * R.q1 * R.q1 / 2; D.SC2 = D.b2 * R.q2 * R.q2 / 2; D.SP1 = (R.p1 - c) * R.q1; D.SP2 = (R.p2 - c) * R.q2;
  D.SCu1 = D.b1 * R.qu1 * R.qu1 / 2; D.SCu2 = D.b2 * R.qu2 * R.qu2 / 2; D.SPu1 = (R.pu - c) * R.qu1; D.SPu2 = (R.pu - c) * R.qu2;
  D.WD = D.SC1 + D.SC2 + D.SP1 + D.SP2; D.WU = D.SCu1 + D.SCu2 + D.SPu1 + D.SPu2;
  D.W1max = (D.a1 - c) * R.q1p / 2; D.W2max = (D.a2 - c) * R.q2p / 2; D.Wmax = D.W1max + D.W2max;
  return D;
};
const e2n = (x, d) => texT(x, d === undefined ? 4 : d);
/* résolution graphique propre au tirage : deux marchés côte à côte */
function e2graph(D, lang, uniform) {
  const fr = lang === 'fr', R = D.R, c = D.c, W = 680, H = 300, half = 330, ymax = D.a1 * 1.08;
  let svg = `<svg viewBox="0 0 ${W} ${H + 24}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${fr ? 'Résolution graphique' : 'Graphical solution'}">`;
  const mk = [[D.a1, D.b1, uniform ? R.qu1 : R.q1, uniform ? R.pu : R.p1, fr ? 'métropole' : 'home market'], [D.a2, D.b2, uniform ? R.qu2 : R.q2, uniform ? R.pu : R.p2, fr ? 'étranger' : 'foreign market']];
  mk.forEach((m, k) => {
    const xmax = m[0] / m[1], G = Plot({ w: half, h: H, x0: 0, x1: xmax * 1.05, y0: 0, y1: ymax, mt: 30, mb: 40, ml: 42, mr: 10 });
    G.axes({ xt: ticks(0, xmax, 4), yt: ticks(0, ymax, 4), xl: m[4], xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
    const qe = (m[0] - c) / m[1];
    G.add(`<path d="M${G.X(0)} ${G.Y(m[0])} L${G.X(m[2])} ${G.Y(m[3])} L${G.X(0)} ${G.Y(m[3])} Z" fill="${COL.s1}" fill-opacity="0.22"/>`);
    G.add(`<rect x="${G.X(0)}" y="${G.Y(m[3])}" width="${G.X(m[2]) - G.X(0)}" height="${G.Y(c) - G.Y(m[3])}" fill="#2e7d5b" fill-opacity="0.25"/>`);
    G.add(`<path d="M${G.X(m[2])} ${G.Y(m[3])} L${G.X(qe)} ${G.Y(c)} L${G.X(m[2])} ${G.Y(c)} Z" fill="${COL.s3}" fill-opacity="0.32"/>`);
    G.line([[0, m[0]], [xmax, 0]], { c: COL.s1, w: 2.2 });
    if (!uniform) G.line([[0, m[0]], [m[0] / (2 * m[1]), 0]], { c: COL.s1, w: 1.3, dash: '5 4' });
    G.line([[0, c], [xmax * 1.05, c]], { c: COL.s2, w: 2 });
    G.dot(m[2], m[3], { c: COL.s1 }); G.text(m[2], m[3], fmtT(m[3], 2), { dx: 8, dy: -6, anchor: 'start', size: 11, mono: true });
    svg += `<g transform="translate(${k * (half + 20)},24)">${G.el.join('')}</g>`;
  });
  const lg = [[COL.s1, 0.3, fr ? 'surplus des consommateurs' : 'consumer surplus'], ['#2e7d5b', 0.35, fr ? 'profit' : 'profit'], [COL.s3, 0.4, fr ? 'perte sèche' : 'deadweight loss']];
  let x = 50; lg.forEach(l => { svg += `<rect x="${x}" y="8" width="12" height="9" rx="2" fill="${l[0]}" fill-opacity="${l[1]}"/><text x="${x + 17}" y="16" ${FONT_T} font-size="11.5" fill="${COL.ink}">${l[2]}</text>`; x += 190; });
  return '<div class="sol-fig">' + svg + '</svg></div>';
}
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un laboratoire est seul à produire un médicament, à un coût marginal constant \(c=${D.c}\), sans coût fixe. Il le vend sur deux marchés séparés, entre lesquels la revente est impossible : la métropole, de demande inverse \(P_1=${D.a1}-${cfx(D.b1)}q_1\), et l'étranger, de demande inverse \(P_2=${D.a2}-${cfx(D.b2)}q_2\).</div>
<div class="questions"><ol>
<li><div class="q-text">Le laboratoire pratique des prix différents. Déterminez les quantités, les prix et le profit.</div></li>
<li><div class="q-text">Calculez l'élasticité-prix de la demande sur chaque marché à l'optimum. Sur quel marché le prix est-il le plus élevé, et pourquoi ?</div></li>
<li><div class="q-text">La discrimination est interdite. Déterminez la demande totale, le prix unique, les quantités vendues sur chaque marché et le profit.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs et le surplus du producteur sur chaque marché dans les deux régimes, puis le surplus total et la perte sèche par rapport à une tarification au coût marginal.</div></li>
<li><div class="q-text">Représentez graphiquement les deux marchés et les surplus, avec et sans discrimination.</div></li>
<li><div class="q-text">Que deviendraient le surplus des consommateurs, le profit et le surplus total si le laboratoire pratiquait une discrimination parfaite ?</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A laboratory is the only producer of a medicine, at a constant marginal cost \(c=${D.c}\), with no fixed cost. It sells it on two separate markets, between which resale is impossible: the home market, with inverse demand \(P_1=${D.a1}-${cfx(D.b1)}q_1\), and the foreign market, with inverse demand \(P_2=${D.a2}-${cfx(D.b2)}q_2\).</div>
<div class="questions"><ol>
<li><div class="q-text">The laboratory charges different prices. Determine the quantities, prices and profit.</div></li>
<li><div class="q-text">Compute the price elasticity of demand in each market at the optimum. In which market is the price higher, and why?</div></li>
<li><div class="q-text">Discrimination is forbidden. Determine total demand, the uniform price, the quantities sold in each market and the profit.</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus and producer surplus in each market under both regimes, then total surplus and the deadweight loss relative to marginal-cost pricing.</div></li>
<li><div class="q-text">Draw the two markets and the surpluses, with and without discrimination.</div></li>
<li><div class="q-text">What would consumer surplus, profit and total surplus be if the laboratory practised perfect discrimination?</div></li>
</ol></div>`;
};
function e2sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], R = D.R, c = D.c, RM = T_(['Rm', 'MR']), CM = T_(['Cm', 'MC']), SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), n = e2n, m = x => e2n(x, 2);
  const qfr = (num, den, val) => Math.abs(den - 1) < 1e-12 ? `${num}=${n(val)}` : String.raw`\frac{${num}}{${n(den)}}=${n(val)}`;
  const scI = (a, b, p, q) => String.raw`\int_0^{${n(q)}}\big(${a}-${cfx(b)}x-${n(p)}\big)\,dx=\Big[${n(a - p)}\,x-${cfx(b / 2)}x^2\Big]_0^{${n(q)}}=${m(b * q * q / 2)}`;
  const spI = (p, q) => String.raw`\int_0^{${n(q)}}\big(${n(p)}-${c}\big)\,dx=${n(p - c)}\times ${n(q)}=${m((p - c) * q)}`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le laboratoire choisit les quantités vendues sur chaque marché pour maximiser son profit', 'The laboratory chooses the quantities sold in each market to maximise its profit'])} \(\Pi=P_1(q_1)\,q_1+P_2(q_2)\,q_2-${c}\,(q_1+q_2)\). ${T_(['Comme le coût marginal est constant, les deux marchés se traitent séparément : sur chacun, la recette marginale doit égaler le coût marginal.', 'Since marginal cost is constant, the two markets can be treated separately: in each, marginal revenue must equal marginal cost.'])} ${T_(['Sur le marché 1, la recette totale', 'In market 1, total revenue'])} \(${D.a1}\,q_1-${cfx(D.b1)}q_1^2\) ${T_(['a pour dérivée', 'has derivative'])} \(${RM}_1=${D.a1}-${cfx(2 * D.b1)}q_1\), ${T_(['d\'où :', 'hence:'])}
  \[${RM}_1(q_1)=${CM}\iff ${D.a1}-${cfx(2 * D.b1)}q_1=${c}\iff q_1=${qfr(D.a1 + '-' + c, 2 * D.b1, R.q1)}\]
  ${T_(['On en déduit, d\'après la demande inverse du marché 1, le prix pratiqué en métropole :', 'The inverse demand of market 1 then gives the price charged on the home market:'])} \(p_1=${D.a1}-${D.b1 === 1 ? '' : n(D.b1) + '\\times '}${n(R.q1)}=${n(R.p1)}\). ${T_(['De même, sur le marché 2 :', 'Likewise, in market 2:'])}
  \[${RM}_2(q_2)=${CM}\iff ${D.a2}-${cfx(2 * D.b2)}q_2=${c}\iff q_2=${qfr(D.a2 + '-' + c, 2 * D.b2, R.q2)}\]
  ${T_(['et la demande inverse du marché 2 donne le prix à l\'étranger :', 'and the inverse demand of market 2 gives the foreign price:'])} \(p_2=${D.a2}-${D.b2 === 1 ? '' : n(D.b2) + '\\times '}${n(R.q2)}=${n(R.p2)}\). ${T_(['Le profit est la somme des marges réalisées sur les deux marchés :', 'Profit is the sum of the margins earned in both markets:'])}
  \[\Pi^d=(${n(R.p1)}-${c})\times ${n(R.q1)}+(${n(R.p2)}-${c})\times ${n(R.q2)}=${m(R.profD)}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La demande du marché', 'The demand of market'])} \(i\) ${T_(['s\'écrit', 'can be written'])} \(q_i=(a_i-p_i)/b_i\), ${T_(['d\'où', 'hence'])} \(\frac{dq_i}{dp_i}=-\frac{1}{b_i}\) ${T_(['et une élasticité', 'and an elasticity'])} \(\varepsilon_i=-\frac{1}{b_i}\cdot\frac{p_i}{q_i}\). ${T_(['Aux prix d\'équilibre :', 'At the equilibrium prices:'])}
  \[\varepsilon_1=-\frac{1}{${n(D.b1)}}\times\frac{${n(R.p1)}}{${n(R.q1)}}\approx ${n(D.e1)}\qquad\varepsilon_2=-\frac{1}{${n(D.b2)}}\times\frac{${n(R.p2)}}{${n(R.q2)}}\approx ${n(D.e2)}\]
  ${T_(['Le prix est plus élevé en métropole, où la demande est la moins élastique', 'The price is higher on the home market, where demand is less elastic'])} (\(|\varepsilon_1|&lt;|\varepsilon_2|\)). ${T_(['En effet, l\'égalité des recettes marginales s\'écrit', 'Indeed, equal marginal revenues read'])} \(p_1\big(1-\frac{1}{|\varepsilon_1|}\big)=p_2\big(1-\frac{1}{|\varepsilon_2|}\big)=c\) : ${T_(['le taux de marge de chaque marché est l\'inverse de son élasticité, ce que l\'on vérifie :', 'the markup rate in each market is the inverse of its elasticity, as we check:'])} \(\frac{p_1-c}{p_1}\approx ${n((R.p1 - c) / R.p1)}=\frac{1}{|\varepsilon_1|}\) ${T_(['et', 'and'])} \(\frac{p_2-c}{p_2}\approx ${n((R.p2 - c) / R.p2)}=\frac{1}{|\varepsilon_2|}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec un prix unique', 'With a uniform price'])} \(p\) ${T_(['inférieur aux deux prix maximaux', 'below both maximum prices'])} ${D.a1} ${T_(['et', 'and'])} ${D.a2}, ${T_(['les deux marchés achètent, et la demande totale est la somme des demandes :', 'both markets buy, and total demand is the sum of the demands:'])}
  \[\begin{aligned}Q(p)&amp;=\frac{${D.a1}-p}{${n(D.b1)}}+\frac{${D.a2}-p}{${n(D.b2)}}=${n(R.A)}-${n(R.B)}\,p\\P(Q)&amp;=\frac{${n(R.A)}-Q}{${n(R.B)}}=${n(R.A / R.B)}-${n(1 / R.B)}\,Q&amp;&amp;\text{${T_(['en inversant', 'inverting'])}}\end{aligned}\]
  ${T_(['Le laboratoire se comporte alors comme un monopole face à cette demande : il égalise la recette marginale', 'The laboratory then behaves as a monopoly facing this demand: it equates marginal revenue'])} \(${n(R.A / R.B)}-${n(2 / R.B)}\,Q\) ${T_(['au coût marginal', 'with marginal cost'])} ${c}, ${T_(['ce qui donne', 'which gives'])} \(Q^u=${n(R.qu1 + R.qu2)}\). ${T_(['On en déduit, d\'après la demande inverse totale, le prix unique :', 'The total inverse demand then gives the uniform price:'])} \(p^u=${n(R.A / R.B)}-${n(1 / R.B)}\times ${n(R.qu1 + R.qu2)}=${n(R.pu)}\). ${T_(['Comme', 'Since'])} \(p^u&lt;${D.a2}\), ${T_(['les deux marchés sont bien servis, et chaque demande donne la quantité vendue sur son marché :', 'both markets are indeed served, and each demand gives the quantity sold on its market:'])}
  \[q_1^u=\frac{${D.a1}-${n(R.pu)}}{${n(D.b1)}}=${n(R.qu1)}\qquad q_2^u=\frac{${D.a2}-${n(R.pu)}}{${n(D.b2)}}=${n(R.qu2)}\]
  ${T_(['Le profit vaut alors', 'Profit is then'])} \(\Pi^u=(${n(R.pu)}-${c})\times ${n(R.qu1 + R.qu2)}=${m(R.profU)}\), ${T_(['inférieur au profit discriminant', 'below the discriminating profit'])}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Sur chaque marché, le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix payé ; le surplus du producteur est l\'intégrale de l\'écart entre le prix reçu et le coût marginal, ici égal au profit puisqu\'il n\'y a pas de coût fixe. Avec discrimination :', 'In each market, consumer surplus is the integral of the gap between inverse demand and the price paid; producer surplus is the integral of the gap between the price received and marginal cost, here equal to profit since there is no fixed cost. With discrimination:'])}
  \[\begin{aligned}${SC}_1^d&amp;=${scI(D.a1, D.b1, R.p1, R.q1)}\\${SC}_2^d&amp;=${scI(D.a2, D.b2, R.p2, R.q2)}\\${SP}_1^d&amp;=${spI(R.p1, R.q1)}\\${SP}_2^d&amp;=${spI(R.p2, R.q2)}\end{aligned}\]
  ${T_(['Avec un prix unique :', 'With a uniform price:'])}
  \[\begin{aligned}${SC}_1^u&amp;=${scI(D.a1, D.b1, R.pu, R.qu1)}\\${SC}_2^u&amp;=${scI(D.a2, D.b2, R.pu, R.qu2)}\\${SP}_1^u&amp;=${spI(R.pu, R.qu1)}\\${SP}_2^u&amp;=${spI(R.pu, R.qu2)}\end{aligned}\]
  ${T_(['Si le prix était égal au coût marginal sur chaque marché, le surplus total atteindrait son maximum, l\'aire entre la demande et le coût marginal :', 'If the price equalled marginal cost in each market, total surplus would reach its maximum, the area between demand and marginal cost:'])}
  \[W^*=\int_0^{${n(R.q1p)}}(${D.a1}-${cfx(D.b1)}x-${c})\,dx+\int_0^{${n(R.q2p)}}(${D.a2}-${cfx(D.b2)}x-${c})\,dx=${m(D.W1max)}+${m(D.W2max)}=${m(D.Wmax)}\]
  ${T_(['On en déduit les bilans :', 'Hence the totals:'])}</p>
  <div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>${T_(['Discrimination', 'Discrimination'])}</th><th>${T_(['Prix unique', 'Uniform price'])}</th></tr></thead><tbody>
  <tr><td>${T_(['Surplus des consommateurs', 'Consumer surplus'])}</td><td class="num">${fmt(D.SC1 + D.SC2, 2)}</td><td class="num">${fmt(D.SCu1 + D.SCu2, 2)}</td></tr>
  <tr><td>${T_(['Surplus du producteur (profit)', 'Producer surplus (profit)'])}</td><td class="num">${fmt(D.SP1 + D.SP2, 2)}</td><td class="num">${fmt(D.SPu1 + D.SPu2, 2)}</td></tr>
  <tr><td>${T_(['Surplus total', 'Total surplus'])}</td><td class="num">${fmt(D.WD, 2)}</td><td class="num">${fmt(D.WU, 2)}</td></tr>
  <tr><td>${T_(['Perte sèche', 'Deadweight loss'])}</td><td class="num">${fmt(D.Wmax - D.WD, 2)}</td><td class="num">${fmt(D.Wmax - D.WU, 2)}</td></tr></tbody></table></div>
  <p>${T_(['La production totale est la même dans les deux régimes', 'Total output is the same in both regimes'])} (\(${n(R.q1 + R.q2)}\)). ${T_(['La discrimination augmente le profit, réduit le surplus des consommateurs et augmente la perte sèche : à production égale, elle répartit mal les unités, puisque les consommateurs de la métropole renoncent à des unités qu\'ils valorisent davantage que les consommateurs étrangers qui les obtiennent.', 'Discrimination raises profit, reduces consumer surplus and increases the deadweight loss: with the same output, it misallocates units, since home consumers give up units that they value more than the foreign consumers who obtain them.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Sur chaque marché, l\'équilibre se lit à l\'intersection de la recette marginale (pointillés) et du coût marginal (doré), en remontant jusqu\'à la demande. Le rectangle vert est le profit, le triangle bleu le surplus des consommateurs, le triangle rouge la perte sèche. Avec discrimination :', 'In each market, the equilibrium is read at the intersection of marginal revenue (dashed) and marginal cost (gold), going up to the demand curve. The green rectangle is profit, the blue triangle consumer surplus, the red triangle deadweight loss. With discrimination:'])}</p>
  ${e2graph(D, lang, false)}
  <p>${T_(['Avec un prix unique, le même prix s\'applique sur les deux marchés :', 'With a uniform price, the same price applies in both markets:'])}</p>
  ${e2graph(D, lang, true)}
</div></li>
<li><div class="q-content">
  <p>${T_(['En discrimination parfaite, chaque unité est vendue au prix maximal que l\'acheteur est prêt à payer. Le laboratoire vend donc tant que ce prix dépasse le coût marginal, c\'est-à-dire jusqu\'à', 'Under perfect discrimination, each unit is sold at the highest price the buyer is willing to pay. The laboratory therefore sells as long as this price exceeds marginal cost, that is, up to'])} \(q_1=${n(R.q1p)}\) ${T_(['et', 'and'])} \(q_2=${n(R.q2p)}\). ${T_(['Les consommateurs paient exactement leur disposition à payer : leur surplus est nul. Le profit est alors l\'intégrale de l\'écart entre la demande et le coût marginal :', 'Consumers pay exactly their willingness to pay: their surplus is zero. Profit is then the integral of the gap between demand and marginal cost:'])}
  \[\Pi^{pd}=\int_0^{${n(R.q1p)}}(${D.a1}-${cfx(D.b1)}x-${c})\,dx+\int_0^{${n(R.q2p)}}(${D.a2}-${cfx(D.b2)}x-${c})\,dx=${m(D.Wmax)}\]
  ${T_(['Le surplus total atteint son maximum : il n\'y a plus de perte sèche, mais tout le surplus revient au laboratoire. La discrimination parfaite est efficace, mais très défavorable aux consommateurs.', 'Total surplus reaches its maximum: there is no deadweight loss any more, but all the surplus goes to the laboratory. Perfect discrimination is efficient, but very unfavourable to consumers.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => e2sol(D, 'fr');
I18N.en.sol = D => e2sol(D, 'en');
