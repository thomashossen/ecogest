I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 8 – Équilibre partiel et intervention publique', 'k-h1': 'Équilibre partiel et intervention publique', 'k-coursetitle': 'Équilibre de marché, surplus, taxe et incidence fiscale, prix plafond et prix plancher', 'k-extitle': 'Équilibre, taxe unitaire et prix plafond : surplus et perte sèche', 'k-soltitle': 'Équilibre, taxe unitaire et prix plafond : surplus et perte sèche' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 8 – Partial equilibrium and government intervention', 'k-h1': 'Partial equilibrium and government intervention', 'k-coursetitle': 'Market equilibrium, surplus, taxes and tax incidence, price ceilings and floors', 'k-extitle': 'Equilibrium, unit tax and price ceiling: surplus and deadweight loss', 'k-soltitle': 'Equilibrium, unit tax and price ceiling: surplus and deadweight loss' });

/* ---------- outils : demande Q = b (pM - p), offre Q = d (p - p0) ---------- */
function p8eq(pM, b, p0, d, t) {
  t = t || 0;
  const Q = b * d * (pM - p0 - t) / (b + d), pc = pM - Q / b, pp = pc - t;
  return { Q: Q, pc: pc, pp: pp, SC: Q * Q / (2 * b), SP: Q * Q / (2 * d), T: t * Q };
}
function p8fig(pM, b, p0, d, o, lang) {
  const fr = lang === 'fr', E0 = p8eq(pM, b, p0, d), Qmax = b * (pM - p0) * 1.15 + 1, Y1 = pM * 1.08;
  const G = Plot({ w: 620, h: 340, x0: 0, x1: Math.max(b * pM, Qmax) * 0.75, y0: 0, y1: Y1, mt: 26, mb: 42 });
  const X1 = G.x1;
  G.axes({ xt: ticks(0, X1, 5), yt: ticks(0, Y1, 5), xl: 'Q', yl: 'p', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
  G.clip();
  const Pd = q => pM - q / b, Ps = q => p0 + q / d, poly = (pts, c, op) => G.add(`<path d="${G.pts(pts)} Z" fill="${c}" fill-opacity="${op}" clip-path="url(#${G._clip})"/>`);
  if (o.t !== undefined) {
    const E = p8eq(pM, b, p0, d, o.t);
    poly([[0, pM], [E.Q, E.pc], [0, E.pc]], COL.s1, 0.22);
    poly([[0, p0], [E.Q, E.pp], [0, E.pp]], '#2e7d5b', 0.25);
    poly([[0, E.pc], [E.Q, E.pc], [E.Q, E.pp], [0, E.pp]], COL.s2, 0.35);
    poly([[E.Q, E.pc], [E0.Q, E0.pc], [E.Q, E.pp]], COL.s3, 0.4);
    G.dot(E.Q, E.pc, { c: COL.s1, r: 5 }); G.dot(E.Q, E.pp, { c: '#2e7d5b', r: 5 });
  } else {
    const pb = o.ceil, Qs = Math.max(0, d * (pb - p0)), pd = Pd(Qs);
    poly([[0, pM], [Qs, pd], [Qs, pb], [0, pb]], COL.s1, 0.22);
    poly([[0, p0], [Qs, pb], [0, pb]], '#2e7d5b', 0.25);
    poly([[Qs, pd], [E0.Q, E0.pc], [Qs, Ps(Qs)]], COL.s3, 0.4);
    G.line([[0, pb], [X1, pb]], { c: COL.ink, w: 1.4, dash: '6 4' });
    G.seg(Qs, pb, b * (pM - pb), pb, { c: COL.s3, w: 3 });
  }
  G.line([[0, pM], [b * pM, 0]], { c: COL.s1, w: 2.4, clip: true }); G.line([[0, p0], [X1, p0 + X1 / d]], { c: '#2e7d5b', w: 2.4, clip: true });
  G.dot(E0.Q, E0.pc, { c: COL.ink, r: 4, hollow: true });
  const lg = [{ c: COL.s1, box: true, o: 0.3, t: fr ? 'surplus des consommateurs' : 'consumer surplus' }, { c: '#2e7d5b', box: true, o: 0.35, t: fr ? 'surplus des producteurs' : 'producer surplus' }];
  if (o.t !== undefined) lg.push({ c: COL.s2, box: true, o: 0.4, t: fr ? 'recette fiscale' : 'tax revenue' });
  lg.push({ c: COL.s3, box: true, o: 0.45, t: fr ? 'perte sèche' : 'deadweight loss' });
  G.legend(lg, G.ml + 4, 16);
  return G.svg(fr ? 'Équilibre partiel' : 'Partial equilibrium');
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez déterminer l'équilibre d'un marché concurrentiel, calculer les surplus des consommateurs et des producteurs, analyser l'effet d'une taxe unitaire (prix payé, prix reçu, incidence, recette fiscale, perte sèche), et celui d'un prix plafond ou plancher.<br><br>
<strong>Pourquoi ?</strong> Taxes sur les carburants, plafonnement des loyers, salaire minimum, prix garantis agricoles : l'État intervient souvent sur les prix. L'équilibre partiel permet d'en mesurer les effets, de savoir qui en supporte réellement la charge, et ce que la collectivité y perd.<br><br>
<strong>Prérequis.</strong> Surplus du consommateur (page 4), offre et surplus du producteur (page 7).
</div>
<p class="toc">Sommaire : <a href="#s1">1. L'équilibre</a> · <a href="#s2">2. Les surplus</a> · <a href="#s3">3. Une taxe unitaire</a> · <a href="#s4">4. L'incidence fiscale</a> · <a href="#s5">5. Prix plafond et plancher</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. L'équilibre de marché</div>
<p>Sur un marché concurrentiel, la demande \(Q_d(p)\) décroît avec le prix et l'offre \(Q_s(p)\) croît. Le prix d'équilibre \(p^*\) égalise les deux : \(Q_d(p^*)=Q_s(p^*)\). À un prix supérieur, l'offre excède la demande et le prix baisse ; à un prix inférieur, la demande excède l'offre et le prix monte. L'analyse est dite <em>partielle</em> car elle considère un seul marché, les autres prix et les revenus étant donnés.</p>

<div class="dossier-title" id="s2">2. Les surplus et l'efficacité</div>
<p>Le surplus des consommateurs est l'aire entre la demande inverse et le prix, celui des producteurs l'aire entre le prix et l'offre inverse, qui est le coût marginal :
\[SC=\int_0^{Q^*}\big(P_d(q)-p^*\big)\,dq,\qquad SP=\int_0^{Q^*}\big(p^*-P_s(q)\big)\,dq\]
Leur somme, le surplus total, est l'aire entre la demande et l'offre jusqu'à \(Q^*\) : elle est maximale à l'équilibre concurrentiel, puisque toutes les unités dont la valeur pour un consommateur dépasse le coût pour un producteur sont échangées, et seulement celles-là. C'est le premier théorème du bien-être, en équilibre partiel.</p>

<div class="dossier-title" id="s3">3. Une taxe unitaire</div>
<p>Une taxe de \(t\) euros par unité crée un écart entre le prix payé par les consommateurs \(p_c\) et le prix reçu par les producteurs \(p_p=p_c-t\). Le nouvel équilibre vérifie \(Q_d(p_c)=Q_s(p_c-t)\). La quantité échangée diminue ; l'État perçoit \(tQ_t\). Les unités entre \(Q_t\) et \(Q^*\), qui auraient été échangées sans taxe, ne le sont plus : leur valeur perdue est la perte sèche, \(\frac12\,t\,(Q^*-Q_t)\) pour des courbes linéaires.</p>
<div class="ifig" data-fig="tax"></div>
<div class="fig-cap">Figure 1 — Marché \(Q_d=2(60-p)\), \(Q_s=2(p-10)\) avec une taxe unitaire. Le coin fiscal sépare le prix payé (sur la demande) du prix reçu (sur l'offre). Le rectangle doré est la recette fiscale, le triangle rouge la perte sèche, qui croît comme le carré de la taxe.</div>

<div class="dossier-title" id="s4">4. L'incidence fiscale</div>
<p>Peu importe que la taxe soit prélevée sur les vendeurs ou sur les acheteurs : son effet sur les prix est le même. Sa charge se répartit selon les pentes : avec \(Q_d=b(p_M-p)\) et \(Q_s=d(p-p_0)\), le prix payé augmente de \(\frac{d}{b+d}\,t\) et le prix reçu baisse de \(\frac{b}{b+d}\,t\). Le côté du marché le moins élastique supporte la plus grande part : si la demande est très inélastique (\(b\) petit), les consommateurs paient presque toute la taxe.</p>

<div class="dossier-title" id="s5">5. Prix plafond et prix plancher</div>
<p>Un <em>prix plafond</em> inférieur au prix d'équilibre (contrôle des loyers) crée une pénurie : les producteurs n'offrent que \(Q_s(\bar p)\), alors que les consommateurs demandent davantage. La quantité échangée baisse, une partie du surplus des producteurs est transférée aux consommateurs qui obtiennent le bien, et une perte sèche apparaît ; si le bien n'est pas attribué à ceux qui le valorisent le plus, la perte est encore plus grande. Un <em>prix plancher</em> supérieur au prix d'équilibre (salaire minimum, prix agricoles garantis) crée symétriquement un excédent d'offre.</p>
<div class="ifig" data-fig="ceil"></div>
<div class="fig-cap">Figure 2 — Prix plafond sur le marché de la figure 1. Le trait rouge épais est la pénurie : l'écart entre la demande et l'offre au prix plafond. Les consommateurs servis gagnent au détriment des producteurs ; le triangle rouge est la perte sèche.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Équilibre : \(Q_d(p^*)=Q_s(p^*)\) ; surplus total maximal en concurrence.</li>
<li>Taxe unitaire : \(Q_d(p_c)=Q_s(p_c-t)\) ; recette \(tQ_t\) ; perte sèche \(\frac12t(Q^*-Q_t)\).</li>
<li>Incidence : le côté le moins élastique supporte la plus grande part de la taxe, quel que soit celui qui la verse.</li>
<li>Prix plafond : pénurie et perte sèche ; prix plancher : excédent et perte sèche.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can determine the equilibrium of a competitive market, compute consumer and producer surplus, analyse the effect of a unit tax (price paid, price received, incidence, tax revenue, deadweight loss), and that of a price ceiling or floor.<br><br>
<strong>Why?</strong> Fuel taxes, rent control, minimum wages, guaranteed farm prices: governments often intervene on prices. Partial equilibrium measures the effects, shows who really bears the burden, and what society loses.<br><br>
<strong>Prerequisites.</strong> Consumer surplus (page 4), supply and producer surplus (page 7).
</div>
<p class="toc">Contents: <a href="#s1">1. Equilibrium</a> · <a href="#s2">2. Surplus</a> · <a href="#s3">3. A unit tax</a> · <a href="#s4">4. Tax incidence</a> · <a href="#s5">5. Price ceilings and floors</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Market equilibrium</div>
<p>In a competitive market, demand \(Q_d(p)\) falls with the price and supply \(Q_s(p)\) rises. The equilibrium price \(p^*\) equates them: \(Q_d(p^*)=Q_s(p^*)\). At a higher price, supply exceeds demand and the price falls; at a lower price, demand exceeds supply and the price rises. The analysis is <em>partial</em> because it considers a single market, other prices and incomes being given.</p>

<div class="dossier-title" id="s2">2. Surplus and efficiency</div>
<p>Consumer surplus is the area between inverse demand and the price, producer surplus the area between the price and inverse supply, which is marginal cost:
\[CS=\int_0^{Q^*}\big(P_d(q)-p^*\big)\,dq,\qquad PS=\int_0^{Q^*}\big(p^*-P_s(q)\big)\,dq\]
Their sum, total surplus, is the area between demand and supply up to \(Q^*\): it is maximal at the competitive equilibrium, since all units whose value to a consumer exceeds the cost to a producer are traded, and only those. This is the first welfare theorem, in partial equilibrium.</p>

<div class="dossier-title" id="s3">3. A unit tax</div>
<p>A tax of \(t\) euros per unit creates a wedge between the price paid by consumers \(p_c\) and the price received by producers \(p_p=p_c-t\). The new equilibrium satisfies \(Q_d(p_c)=Q_s(p_c-t)\). The quantity traded falls; the government collects \(tQ_t\). The units between \(Q_t\) and \(Q^*\), which would have been traded without the tax, no longer are: their lost value is the deadweight loss, \(\frac12\,t\,(Q^*-Q_t)\) for linear curves.</p>
<div class="ifig" data-fig="tax"></div>
<div class="fig-cap">Figure 1 — Market \(Q_d=2(60-p)\), \(Q_s=2(p-10)\) with a unit tax. The tax wedge separates the price paid (on demand) from the price received (on supply). The gold rectangle is tax revenue, the red triangle the deadweight loss, which grows with the square of the tax.</div>

<div class="dossier-title" id="s4">4. Tax incidence</div>
<p>It does not matter whether the tax is levied on sellers or on buyers: its effect on prices is the same. Its burden is shared according to the slopes: with \(Q_d=b(p_M-p)\) and \(Q_s=d(p-p_0)\), the price paid rises by \(\frac{d}{b+d}\,t\) and the price received falls by \(\frac{b}{b+d}\,t\). The less elastic side of the market bears the larger share: if demand is very inelastic (small \(b\)), consumers pay almost all the tax.</p>

<div class="dossier-title" id="s5">5. Price ceilings and floors</div>
<p>A <em>price ceiling</em> below the equilibrium price (rent control) creates a shortage: producers only supply \(Q_s(\bar p)\), while consumers demand more. The quantity traded falls, part of producer surplus is transferred to the consumers who obtain the good, and a deadweight loss appears; if the good is not allocated to those who value it most, the loss is even larger. A <em>price floor</em> above the equilibrium price (minimum wage, guaranteed farm prices) symmetrically creates excess supply.</p>
<div class="ifig" data-fig="ceil"></div>
<div class="fig-cap">Figure 2 — Price ceiling on the market of figure 1. The thick red segment is the shortage: the gap between demand and supply at the ceiling price. Consumers who are served gain at the producers' expense; the red triangle is the deadweight loss.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Equilibrium: \(Q_d(p^*)=Q_s(p^*)\); total surplus maximal under competition.</li>
<li>Unit tax: \(Q_d(p_c)=Q_s(p_c-t)\); revenue \(tQ_t\); deadweight loss \(\frac12t(Q^*-Q_t)\).</li>
<li>Incidence: the less elastic side bears the larger share of the tax, whoever pays it.</li>
<li>Price ceiling: shortage and deadweight loss; price floor: excess supply and deadweight loss.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { t: 'Taxe unitaire t', ce: 'Prix plafond', tRead: E => `Prix payé <span class="v">${fmt(E.pc, 2)}</span>, prix reçu <span class="v">${fmt(E.pp, 2)}</span>, quantité <span class="v">${fmt(E.Q, 2)}</span> &nbsp;·&nbsp; recette <span class="v">${fmt(E.T, 1)}</span>, perte sèche <span class="v">${fmt((50 - E.Q) * (E.pc - E.pp) / 2, 1)}</span>`, cRead: (pb) => `Offre <span class="v">${fmt(2 * (pb - 10), 1)}</span>, demande <span class="v">${fmt(2 * (60 - pb), 1)}</span> : pénurie de <span class="v">${fmt(2 * (60 - pb) - 2 * (pb - 10), 1)}</span>` };
I18N.en.f = { t: 'Unit tax t', ce: 'Price ceiling', tRead: E => `Price paid <span class="v">${fmt(E.pc, 2)}</span>, price received <span class="v">${fmt(E.pp, 2)}</span>, quantity <span class="v">${fmt(E.Q, 2)}</span> &nbsp;·&nbsp; revenue <span class="v">${fmt(E.T, 1)}</span>, deadweight loss <span class="v">${fmt((50 - E.Q) * (E.pc - E.pp) / 2, 1)}</span>`, cRead: (pb) => `Supply <span class="v">${fmt(2 * (pb - 10), 1)}</span>, demand <span class="v">${fmt(2 * (60 - pb), 1)}</span>: shortage of <span class="v">${fmt(2 * (60 - pb) - 2 * (pb - 10), 1)}</span>` };
FIGS.tax = { state: { t: 10 }, controls: L => [{ key: 't', label: L.f.t, min: 0, max: 40, step: 2, fmt: v => String(v) }], draw: function (s, lang) { return { svg: p8fig(60, 2, 10, 2, { t: s.t }, lang), read: I18N[lang].f.tRead(p8eq(60, 2, 10, 2, s.t)) }; } };
FIGS.ceil = { state: { c: 25 }, controls: L => [{ key: 'c', label: L.f.ce, min: 12, max: 35, step: 1, fmt: v => String(v) }], draw: function (s, lang) { return { svg: p8fig(60, 2, 10, 2, { ceil: s.c }, lang), read: I18N[lang].f.cRead(s.c) }; } };

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.pM = 10 * rint(5, 12); D.b = pick([1, 2, 3, 4]); D.p0 = 2 * rint(2, 10); D.d = pick([1, 2, 3, 4]);
    if (D.p0 > D.pM / 2) continue;
    D.E = p8eq(D.pM, D.b, D.p0, D.d);
    D.t = 2 * rint(1, Math.floor((D.pM - D.p0) / 6));
    D.Et = p8eq(D.pM, D.b, D.p0, D.d, D.t);
    D.ceil = Math.round(D.p0 + (D.E.pc - D.p0) * pick([0.5, 0.6, 0.7]));
    if (D.ceil <= D.p0 + 1 || D.ceil >= D.E.pc - 1) continue;
    break;
  }
  const E = D.E, Et = D.Et, b = D.b, d = D.d, pM = D.pM, p0 = D.p0;
  D.W = E.SC + E.SP; D.Wt = Et.SC + Et.SP + Et.T; D.DWLt = D.W - D.Wt;
  D.Qs = d * (D.ceil - p0); D.Qd = b * (pM - D.ceil); D.pdc = pM - D.Qs / b;
  D.SCc = (pM - D.pdc) * D.Qs / 2 + (D.pdc - D.ceil) * D.Qs; D.SPc = D.Qs * D.Qs / (2 * d); D.DWLc = D.W - D.SCc - D.SPc;
  return D;
};
const p8L = D => ({ dem: String.raw`Q_d=${D.b === 1 ? '' : D.b}\,(${D.pM}-p)`, off: String.raw`Q_s=${D.d === 1 ? '' : D.d}\,(p-${D.p0})` });
I18N.fr.ex = function (D) {
  const L = p8L(D);
  return String.raw`<div class="context-block">Sur un marché concurrentiel, la demande est \(${L.dem}\) et l'offre \(${L.off}\), où \(p\) est le prix.</div>
<div class="questions"><ol>
<li><div class="q-text">Déterminez le prix et la quantité d'équilibre.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs, le surplus des producteurs et le surplus total.</div></li>
<li><div class="q-text">L'État instaure une taxe de \(t=${D.t}\) par unité vendue, payée par les producteurs. Déterminez le prix payé par les consommateurs, le prix reçu par les producteurs et la quantité échangée. Quelle part de la taxe chacun supporte-t-il ?</div></li>
<li><div class="q-text">Calculez les nouveaux surplus, la recette fiscale et la perte sèche.</div></li>
<li><div class="q-text">Sans taxe, l'État impose un prix plafond \(\bar p=${D.ceil}\). Déterminez la quantité échangée, la pénurie, les surplus (en supposant que le bien va aux consommateurs qui le valorisent le plus) et la perte sèche.</div></li>
<li><div class="q-text">Représentez graphiquement les deux situations, avec les surplus, la recette fiscale et la perte sèche.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  const L = p8L(D);
  return String.raw`<div class="context-block">In a competitive market, demand is \(${L.dem}\) and supply \(${L.off}\), where \(p\) is the price.</div>
<div class="questions"><ol>
<li><div class="q-text">Determine the equilibrium price and quantity.</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus, producer surplus and total surplus.</div></li>
<li><div class="q-text">The government introduces a tax of \(t=${D.t}\) per unit sold, paid by producers. Determine the price paid by consumers, the price received by producers and the quantity traded. What share of the tax does each side bear?</div></li>
<li><div class="q-text">Compute the new surpluses, the tax revenue and the deadweight loss.</div></li>
<li><div class="q-text">Without a tax, the government imposes a price ceiling \(\bar p=${D.ceil}\). Determine the quantity traded, the shortage, the surpluses (assuming the good goes to the consumers who value it most) and the deadweight loss.</div></li>
<li><div class="q-text">Draw both situations, with the surpluses, tax revenue and deadweight loss.</div></li>
</ol></div>`;
};
function p8sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], b = D.b, d = D.d, pM = D.pM, p0 = D.p0, t = D.t, E = D.E, Et = D.Et, n = x => texT(x, 4), m = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), PS = T_(['PS', 'DWL']), cb = b === 1 ? '' : b, cd = d === 1 ? '' : d;
  const Pd = b === 1 ? `${pM}-q` : String.raw`${pM}-\frac{q}{${b}}`, Ps = d === 1 ? `${p0}+q` : String.raw`${p0}+\frac{q}{${d}}`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['À l\'équilibre, la quantité demandée est égale à la quantité offerte :', 'In equilibrium, quantity demanded equals quantity supplied:'])}
  \[${cb}\,(${pM}-p)=${cd}\,(p-${p0})\iff p^*=\frac{${b}\times ${pM}+${d}\times ${p0}}{${b}+${d}}=${n(E.pc)}\]
  ${T_(['On en déduit, d\'après la fonction de demande, la quantité échangée :', 'The demand function then gives the quantity traded:'])} \(Q^*=${cb}\,(${pM}-${n(E.pc)})=${n(E.Q)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les fonctions inverses sont', 'The inverse functions are'])} \(P_d(q)=${Pd}\) ${T_(['et', 'and'])} \(P_s(q)=${Ps}\). ${T_(['Les surplus sont les aires entre ces courbes et le prix d\'équilibre :', 'The surpluses are the areas between these curves and the equilibrium price:'])}
  \[\begin{aligned}${SC}&amp;=\int_0^{${n(E.Q)}}\big(${Pd}-${n(E.pc)}\big)\,dq=\Big[${n(pM - E.pc)}\,q-\frac{q^2}{${2 * b}}\Big]_0^{${n(E.Q)}}=${m(E.SC)}\\${SP}&amp;=\int_0^{${n(E.Q)}}\big(${n(E.pc)}-${Ps}\big)\,dq=\Big[${n(E.pc - p0)}\,q-\frac{q^2}{${2 * d}}\Big]_0^{${n(E.Q)}}=${m(E.SP)}\end{aligned}\]
  ${T_(['Le surplus total vaut', 'Total surplus is'])} \(W^*=${m(D.W)}\), ${T_(['maximal à l\'équilibre concurrentiel.', 'maximal at the competitive equilibrium.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les producteurs reçoivent', 'Producers receive'])} \(p_p=p_c-${t}\) : ${T_(['l\'offre dépend du prix reçu, la demande du prix payé. L\'équilibre vérifie', 'supply depends on the price received, demand on the price paid. Equilibrium satisfies'])}
  \[${cb}\,(${pM}-p_c)=${cd}\,(p_c-${t}-${p0})\iff p_c=\frac{${b}\times ${pM}+${d}\times ${p0 + t}}{${b + d}}=${n(Et.pc)}\]
  ${T_(['On en déduit le prix reçu', 'Hence the price received'])} \(p_p=${n(Et.pc)}-${t}=${n(Et.pp)}\) ${T_(['et, d\'après la demande, la quantité', 'and, from demand, the quantity'])} \(Q_t=${cb}\,(${pM}-${n(Et.pc)})=${n(Et.Q)}\). ${T_(['Le prix payé augmente de', 'The price paid rises by'])} \(${n(Et.pc - E.pc)}\), ${T_(['soit', 'that is'])} \(\frac{${d}}{${b + d}}=${texT(100 * d / (b + d), 1)}\,\%\) ${T_(['de la taxe ; le prix reçu baisse de', 'of the tax; the price received falls by'])} \(${n(E.pc - Et.pp)}\), ${T_(['soit', 'that is'])} \(${texT(100 * b / (b + d), 1)}\,\%\). ${T_(['Le côté du marché dont la courbe est la plus raide, le moins élastique, supporte la plus grande part, même si ce sont les producteurs qui versent la taxe.', 'The side of the market with the steeper curve, the less elastic one, bears the larger share, even though producers pay the tax.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les nouveaux surplus se calculent avec les prix payé et reçu :', 'The new surpluses are computed with the prices paid and received:'])}
  \[\begin{aligned}${SC}_t&amp;=\int_0^{${n(Et.Q)}}\big(${Pd}-${n(Et.pc)}\big)\,dq=${m(Et.SC)}\\${SP}_t&amp;=\int_0^{${n(Et.Q)}}\big(${n(Et.pp)}-${Ps}\big)\,dq=${m(Et.SP)}\\T&amp;=${t}\times ${n(Et.Q)}=${m(Et.T)}\end{aligned}\]
  ${T_(['Le surplus total, recette fiscale comprise, vaut', 'Total surplus, including tax revenue, is'])} \(${m(D.Wt)}\), ${T_(['d\'où une perte sèche', 'hence a deadweight loss'])} \(${PS}=${m(D.W)}-${m(D.Wt)}=${m(D.DWLt)}=\tfrac12\times ${t}\times(${n(E.Q)}-${n(Et.Q)})\). ${T_(['Elle correspond aux échanges mutuellement avantageux que la taxe empêche.', 'It corresponds to the mutually beneficial trades that the tax prevents.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Au prix plafond', 'At the ceiling price'])} \(${D.ceil}&lt;p^*\), ${T_(['les producteurs offrent', 'producers supply'])} \(Q_s=${cd}\,(${D.ceil}-${p0})=${n(D.Qs)}\) ${T_(['et les consommateurs demandent', 'and consumers demand'])} \(Q_d=${cb}\,(${pM}-${D.ceil})=${n(D.Qd)}\) : ${T_(['la quantité échangée est la plus petite des deux,', 'the quantity traded is the smaller of the two,'])} \(${n(D.Qs)}\), ${T_(['et la pénurie vaut', 'and the shortage is'])} \(${n(D.Qd - D.Qs)}\). ${T_(['Si le bien va aux consommateurs qui le valorisent le plus, leur surplus est l\'aire entre la demande et le prix plafond sur les', 'If the good goes to the consumers who value it most, their surplus is the area between demand and the ceiling price over the first'])} \(${n(D.Qs)}\) ${T_(['premières unités :', 'units:'])}
  \[\begin{aligned}${SC}_c&amp;=\int_0^{${n(D.Qs)}}\big(${Pd}-${D.ceil}\big)\,dq=${m(D.SCc)}\\${SP}_c&amp;=\int_0^{${n(D.Qs)}}\big(${D.ceil}-${Ps}\big)\,dq=${m(D.SPc)}\end{aligned}\]
  ${T_(['Les consommateurs servis gagnent', 'Consumers who are served gain'])} \(${m(D.SCc - E.SC)}\) ${T_(['par rapport à l\'équilibre, les producteurs perdent', 'relative to equilibrium, producers lose'])} \(${m(E.SP - D.SPc)}\), ${T_(['et la perte sèche vaut', 'and the deadweight loss is'])} \(${m(D.W)}-${m(D.SCc)}-${m(D.SPc)}=${m(D.DWLc)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec la taxe : coin fiscal entre prix payé et prix reçu, recette fiscale et perte sèche.', 'With the tax: tax wedge between price paid and price received, tax revenue and deadweight loss.'])}</p>
  <div class="sol-fig">${p8fig(pM, b, p0, d, { t: t }, lang)}</div>
  <p>${T_(['Avec le prix plafond : pénurie (trait rouge épais), transfert vers les consommateurs servis et perte sèche.', 'With the price ceiling: shortage (thick red segment), transfer to the consumers who are served and deadweight loss.'])}</p>
  <div class="sol-fig">${p8fig(pM, b, p0, d, { ceil: D.ceil }, lang)}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => p8sol(D, 'fr');
I18N.en.sol = D => p8sol(D, 'en');
