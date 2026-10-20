I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 6 – La concurrence en prix de Bertrand', 'k-h1': 'La concurrence en prix de Bertrand', 'k-coursetitle': 'Se concurrencer par les prix : paradoxe de Bertrand, coûts asymétriques et différenciation', 'k-extitle': 'Bertrand avec coûts différents, puis avec produits différenciés', 'k-soltitle': 'Bertrand avec coûts différents, puis avec produits différenciés' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 6 – Bertrand price competition', 'k-h1': 'Bertrand price competition', 'k-coursetitle': 'Competing in prices: the Bertrand paradox, asymmetric costs and differentiation', 'k-extitle': 'Bertrand with different costs, then with differentiated products', 'k-soltitle': 'Bertrand with different costs, then with differentiated products' });

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez déterminer l'équilibre de Nash d'une concurrence en prix pour un bien homogène, expliquer le paradoxe de Bertrand et ses limites, traiter le cas de coûts différents, et résoudre un duopole en prix avec produits différenciés, où les fonctions de réaction sont croissantes.<br><br>
<strong>Pourquoi ?</strong> Dans la grande distribution, le transport aérien ou les télécommunications, les entreprises fixent des prix plutôt que des quantités. Le modèle de Bertrand (1883) montre qu'avec deux concurrents seulement, la concurrence en prix peut suffire à ramener le prix au coût marginal, ce qui contraste fortement avec Cournot.<br><br>
<strong>Prérequis.</strong> Le duopole de Cournot (page 3), équilibre de Nash.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le jeu</a> · <a href="#s2">2. Le paradoxe</a> · <a href="#s3">3. Coûts différents</a> · <a href="#s4">4. Sortir du paradoxe</a> · <a href="#s5">5. Produits différenciés</a> · <a href="#s6">6. Surplus</a> · <a href="#s7">7. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le jeu de Bertrand</div>
<p>Deux entreprises vendent un bien homogène, de demande \(D(p)\), et fixent simultanément leurs prix \(p_1\) et \(p_2\). Les consommateurs achètent tous chez la moins chère ; à prix égaux, ils se répartissent à parts égales. La demande adressée à l'entreprise 1 est donc :
\[D_1(p_1,p_2)=\begin{cases}D(p_1)&amp;\text{si }p_1&lt;p_2\\\tfrac12D(p_1)&amp;\text{si }p_1=p_2\\0&amp;\text{si }p_1&gt;p_2\end{cases}\]
Cette demande est discontinue : une baisse infime du prix sous celui du concurrent fait passer de la moitié du marché au marché entier.</p>

<div class="dossier-title" id="s2">2. Le paradoxe de Bertrand</div>
<p>Avec un coût marginal constant \(c\) identique, l'unique équilibre de Nash est \(p_1=p_2=c\) : les profits sont nuls. En effet, si les deux prix étaient égaux et supérieurs à \(c\), chaque entreprise gagnerait à baisser légèrement le sien pour capter tout le marché ; si un prix était inférieur à \(c\), l'entreprise concernée perdrait de l'argent ; si les prix étaient différents, la moins chère gagnerait à remonter son prix jusque sous celui de l'autre. Seul \(p_1=p_2=c\) résiste à toutes ces déviations. Deux entreprises suffisent pour obtenir le résultat de la concurrence parfaite : c'est le <em>paradoxe de Bertrand</em>.</p>
<div class="ifig" data-fig="und"></div>
<div class="fig-cap">Figure 1 — Profit de l'entreprise 1 en fonction de son prix, pour un prix donné \(p_2\) de sa concurrente (demande \(D(p)=100-p\), coût \(c=20\)). Le profit chute à zéro dès que \(p_1\) dépasse \(p_2\) : la meilleure réponse est de se placer juste en dessous de \(p_2\), tant que \(p_2\) est supérieur au coût. En baissant \(p_2\), on voit le profit maximal se réduire jusqu'à zéro au coût marginal.</div>

<div class="dossier-title" id="s3">3. Des coûts différents</div>
<p>Si \(c_1&lt;c_2\), l'entreprise 1 fixe un prix égal à \(c_2\), ou juste en dessous, et sert tout le marché ; l'entreprise 2, qui ne peut pas vendre en dessous de son coût, ne vend rien. L'entreprise 1 réalise le profit \((c_2-c_1)\,D(c_2)\). Cela suppose que son prix de monopole \(p^m_1\) soit supérieur à \(c_2\) ; sinon, elle pratique simplement son prix de monopole. Le prix reste supérieur au coût marginal de l'entreprise qui produit : il subsiste une perte sèche.</p>

<div class="dossier-title" id="s4">4. Sortir du paradoxe</div>
<p>Le paradoxe repose sur trois hypothèses fortes : un bien parfaitement homogène, des capacités de production illimitées et une interaction unique. Si les capacités sont limitées, baisser son prix ne permet pas de servir tout le marché, et la guerre des prix s'arrête au-dessus du coût (Kreps et Scheinkman montrent qu'un choix de capacités suivi d'une concurrence en prix redonne l'équilibre de Cournot). Si les produits sont différenciés, baisser son prix n'attire qu'une partie des clients du concurrent. Si le jeu se répète, les entreprises peuvent soutenir des prix élevés par la menace de représailles, comme pour le cartel (page 5).</p>

<div class="dossier-title" id="s5">5. Produits différenciés</div>
<p>Avec des produits différenciés, la demande adressée à l'entreprise \(i\) est continue : \(q_i=\alpha-\beta p_i+\gamma p_j\), avec \(\beta&gt;\gamma&gt;0\). Le paramètre \(\gamma\) mesure la substituabilité des produits. L'entreprise \(i\) maximise \((p_i-c)(\alpha-\beta p_i+\gamma p_j)\) ; la condition du premier ordre donne sa fonction de réaction :
\[\alpha-2\beta p_i+\gamma p_j+\beta c=0\iff p_i=R_i(p_j)=\frac{\alpha+\beta c+\gamma p_j}{2\beta}\]
Elle est <em>croissante</em> : si le concurrent augmente son prix, l'entreprise peut augmenter le sien. Les prix sont des <em>compléments stratégiques</em>, contrairement aux quantités de Cournot. L'équilibre symétrique est :
\[p^*=\frac{\alpha+\beta c}{2\beta-\gamma}&gt;c\]
La différenciation donne à chaque entreprise un pouvoir de marché : le prix d'équilibre dépasse le coût marginal, d'autant plus que les produits sont peu substituables.</p>
<div class="ifig" data-fig="diff"></div>
<div class="fig-cap">Figure 2 — Fonctions de réaction en prix de deux entreprises aux produits différenciés (\(\alpha=60\), \(\beta=2\), \(c=10\)), l'équilibre de Bertrand (rouge) et le prix de collusion (point creux). Les fonctions de réaction sont croissantes. Augmentez \(\gamma\) : les produits deviennent plus substituables, la concurrence s'intensifie et le prix d'équilibre se rapproche du coût marginal.</div>

<div class="dossier-title" id="s6">6. Bertrand et les surplus</div>
<p>Avec un bien homogène et des coûts identiques, le prix est égal au coût marginal : le surplus total est maximal et revient entièrement aux consommateurs, sans perte sèche. Avec des coûts différents, le prix \(c_2\) reste supérieur au coût \(c_1\) de l'entreprise qui produit : le profit est l'aire du rectangle de hauteur \(c_2-c_1\), et la perte sèche le triangle entre la demande et \(c_1\), au-delà de \(D(c_2)\). Avec des produits différenciés, le prix de Bertrand est inférieur au prix de collusion : les consommateurs y gagnent, les entreprises y perdent.</p>

<div class="dossier-title" id="s7">7. À retenir</div>
<ul class="kit-simple">
<li>Bien homogène, coûts identiques constants : \(p_1=p_2=c\), profits nuls, même avec deux entreprises (paradoxe de Bertrand).</li>
<li>Coûts différents : l'entreprise efficace fixe \(p=c_2\) et sert tout le marché ; une perte sèche subsiste.</li>
<li>Capacités limitées, différenciation et répétition du jeu permettent de sortir du paradoxe.</li>
<li>Produits différenciés : fonctions de réaction croissantes (compléments stratégiques), \(p^*=\frac{\alpha+\beta c}{2\beta-\gamma}\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can determine the Nash equilibrium of price competition for a homogeneous good, explain the Bertrand paradox and its limits, handle the case of different costs, and solve a price duopoly with differentiated products, where reaction functions are increasing.<br><br>
<strong>Why?</strong> In retailing, air transport or telecommunications, firms set prices rather than quantities. The Bertrand model (1883) shows that with only two competitors, price competition may suffice to drive the price down to marginal cost, in sharp contrast with Cournot.<br><br>
<strong>Prerequisites.</strong> The Cournot duopoly (page 3), Nash equilibrium.
</div>
<p class="toc">Contents: <a href="#s1">1. The game</a> · <a href="#s2">2. The paradox</a> · <a href="#s3">3. Different costs</a> · <a href="#s4">4. Escaping the paradox</a> · <a href="#s5">5. Differentiated products</a> · <a href="#s6">6. Surplus</a> · <a href="#s7">7. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The Bertrand game</div>
<p>Two firms sell a homogeneous good, with demand \(D(p)\), and simultaneously set their prices \(p_1\) and \(p_2\). All consumers buy from the cheaper one; at equal prices, they split equally. The demand addressed to firm 1 is therefore:
\[D_1(p_1,p_2)=\begin{cases}D(p_1)&amp;\text{if }p_1&lt;p_2\\\tfrac12D(p_1)&amp;\text{if }p_1=p_2\\0&amp;\text{if }p_1&gt;p_2\end{cases}\]
This demand is discontinuous: a tiny price cut below the rival's price takes the firm from half the market to the whole market.</p>

<div class="dossier-title" id="s2">2. The Bertrand paradox</div>
<p>With an identical constant marginal cost \(c\), the only Nash equilibrium is \(p_1=p_2=c\): profits are zero. Indeed, if both prices were equal and above \(c\), each firm would gain by slightly cutting its own to capture the whole market; if a price were below \(c\), that firm would lose money; if prices differed, the cheaper firm would gain by raising its price to just below the other's. Only \(p_1=p_2=c\) withstands all these deviations. Two firms suffice to obtain the perfectly competitive outcome: this is the <em>Bertrand paradox</em>.</p>
<div class="ifig" data-fig="und"></div>
<div class="fig-cap">Figure 1 — Firm 1's profit as a function of its price, for a given rival price \(p_2\) (demand \(D(p)=100-p\), cost \(c=20\)). Profit drops to zero as soon as \(p_1\) exceeds \(p_2\): the best response is to price just below \(p_2\), as long as \(p_2\) is above cost. Lowering \(p_2\) shows the maximal profit shrinking to zero at marginal cost.</div>

<div class="dossier-title" id="s3">3. Different costs</div>
<p>If \(c_1&lt;c_2\), firm 1 sets a price equal to \(c_2\), or just below, and serves the whole market; firm 2, which cannot sell below its cost, sells nothing. Firm 1 earns \((c_2-c_1)\,D(c_2)\). This assumes that its monopoly price \(p^m_1\) is above \(c_2\); otherwise, it simply charges its monopoly price. The price remains above the marginal cost of the producing firm: a deadweight loss remains.</p>

<div class="dossier-title" id="s4">4. Escaping the paradox</div>
<p>The paradox rests on three strong assumptions: a perfectly homogeneous good, unlimited production capacity and a one-shot interaction. If capacity is limited, cutting one's price does not allow serving the whole market, and the price war stops above cost (Kreps and Scheinkman show that a choice of capacities followed by price competition yields the Cournot outcome). If products are differentiated, a price cut only attracts part of the rival's customers. If the game is repeated, firms can sustain high prices through the threat of retaliation, as for the cartel (page 5).</p>

<div class="dossier-title" id="s5">5. Differentiated products</div>
<p>With differentiated products, the demand addressed to firm \(i\) is continuous: \(q_i=\alpha-\beta p_i+\gamma p_j\), with \(\beta&gt;\gamma&gt;0\). The parameter \(\gamma\) measures the substitutability of the products. Firm \(i\) maximises \((p_i-c)(\alpha-\beta p_i+\gamma p_j)\); the first-order condition gives its reaction function:
\[\alpha-2\beta p_i+\gamma p_j+\beta c=0\iff p_i=R_i(p_j)=\frac{\alpha+\beta c+\gamma p_j}{2\beta}\]
It is <em>increasing</em>: if the rival raises its price, the firm can raise its own. Prices are <em>strategic complements</em>, unlike Cournot quantities. The symmetric equilibrium is:
\[p^*=\frac{\alpha+\beta c}{2\beta-\gamma}&gt;c\]
Differentiation gives each firm market power: the equilibrium price exceeds marginal cost, all the more as the products are poor substitutes.</p>
<div class="ifig" data-fig="diff"></div>
<div class="fig-cap">Figure 2 — Price reaction functions of two firms with differentiated products (\(\alpha=60\), \(\beta=2\), \(c=10\)), the Bertrand equilibrium (red) and the collusive price (hollow dot). Reaction functions are increasing. Increase \(\gamma\): products become closer substitutes, competition intensifies and the equilibrium price approaches marginal cost.</div>

<div class="dossier-title" id="s6">6. Bertrand and surplus</div>
<p>With a homogeneous good and identical costs, the price equals marginal cost: total surplus is maximal and goes entirely to consumers, with no deadweight loss. With different costs, the price \(c_2\) remains above the cost \(c_1\) of the producing firm: profit is the area of the rectangle of height \(c_2-c_1\), and the deadweight loss is the triangle between demand and \(c_1\), beyond \(D(c_2)\). With differentiated products, the Bertrand price is below the collusive price: consumers gain, firms lose.</p>

<div class="dossier-title" id="s7">7. Key points</div>
<ul class="kit-simple">
<li>Homogeneous good, identical constant costs: \(p_1=p_2=c\), zero profits, even with two firms (Bertrand paradox).</li>
<li>Different costs: the efficient firm sets \(p=c_2\) and serves the whole market; a deadweight loss remains.</li>
<li>Limited capacity, differentiation and repetition of the game allow escaping the paradox.</li>
<li>Differentiated products: increasing reaction functions (strategic complements), \(p^*=\frac{\alpha+\beta c}{2\beta-\gamma}\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  p2: 'Prix du concurrent p₂', p1: 'prix p₁', pr: 'profit de l\'entreprise 1', undAria: 'Profit de l\'entreprise 1 en fonction de son prix',
  undRead: (p2, best) => p2 > 20 ? `Meilleure réponse : un prix juste inférieur à <span class="v">${fmt(Math.min(p2, 60), 2)}</span>, profit proche de <span class="v">${fmt(best, 1)}</span>` : 'Avec p₂ = c, aucun prix ne rapporte un profit positif : le prix de la concurrente est déjà au coût marginal.',
  g: 'Substituabilité γ', R1: 'réaction de 1', R2: 'réaction de 2', diffAria: 'Fonctions de réaction en prix et équilibre de Bertrand',
  diffRead: (p, pk) => `Prix de Bertrand <span class="v">${fmt(p, 2)}</span> &nbsp;·&nbsp; prix de collusion <span class="v">${fmt(pk, 2)}</span> &nbsp;·&nbsp; coût marginal 10`
};
I18N.en.f = {
  p2: 'Rival price p₂', p1: 'price p₁', pr: 'firm 1 profit', undAria: 'Firm 1 profit as a function of its price',
  undRead: (p2, best) => p2 > 20 ? `Best response: a price just below <span class="v">${fmt(Math.min(p2, 60), 2)}</span>, profit close to <span class="v">${fmt(best, 1)}</span>` : 'With p₂ = c, no price yields a positive profit: the rival price is already at marginal cost.',
  g: 'Substitutability γ', R1: 'reaction of 1', R2: 'reaction of 2', diffAria: 'Price reaction functions and Bertrand equilibrium',
  diffRead: (p, pk) => `Bertrand price <span class="v">${fmt(p, 2)}</span> &nbsp;·&nbsp; collusive price <span class="v">${fmt(pk, 2)}</span> &nbsp;·&nbsp; marginal cost 10`
};
FIGS.und = {
  state: { p2: 50 },
  controls: L => [{ key: 'p2', label: L.f.p2, min: 20, max: 80, step: 2, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, c = 20, pr = p => (p - c) * (100 - p), p2 = s.p2;
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 100, y0: -200, y1: 1800, mt: 26, mb: 42, ml: 56 });
    G.axes({ xt: [0, 20, 40, 60, 80, 100], yt: [0, 500, 1000, 1500], xl: L.p1, xf: v => String(v), yf: v => fmt(v, 0), xAxisAt: 0 });
    G.clip();
    G.curve(p => p < p2 ? pr(p) : NaN, 0, p2 - 0.01, { c: COL.s1, w: 2.4, clip: true }, 200);
    G.line([[p2, 0], [100, 0]], { c: COL.s1, w: 2.4 });
    G.dot(p2, pr(p2) / 2, { c: COL.s1, hollow: true, r: 4 });
    G.curve(pr, 0, 100, { c: GREY, w: 1, dash: '4 4', clip: true }, 200);
    G.seg(p2, -200, p2, 1800, { c: COL.s3, w: 1.2, dash: '5 4' }); G.text(p2, 1750, 'p₂', { dx: 6, anchor: 'start', size: 11, c: COL.s3 });
    const best = p2 > 60 ? pr(60) : pr(p2);
    return { svg: G.svg(L.undAria), read: L.undRead(p2, best) };
  }
};
FIGS.diff = {
  state: { g: 1 },
  controls: L => [{ key: 'g', label: L.f.g, min: 0.2, max: 1.8, step: 0.1, fmt: v => fmtT(v, 1) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, al = 60, be = 2, c = 10, g = s.g, R = p => (al + be * c + g * p) / (2 * be), p = (al + be * c) / (2 * be - g), pk = (al + (be - g) * c) / (2 * (be - g));
    const top = Math.min(200, Math.max(60, pk * 1.15));
    const G = Plot({ w: 520, h: 420, x0: 0, x1: top, y0: 0, y1: top, mt: 26, mb: 42, ml: 50 });
    G.axes({ xt: ticks(0, top, 4), yt: ticks(0, top, 4), xl: 'p₁', yl: 'p₂', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
    G.clip();
    G.line([[R(0), 0], [R(top), top]], { c: COL.s1, w: 2.4, clip: true });
    G.line([[0, R(0)], [top, R(top)]], { c: COL.s2, w: 2.4, clip: true });
    G.line([[0, 0], [top, top]], { c: GREY, w: 1, dash: '3 4', clip: true });
    G.dot(p, p, { c: COL.s3, r: 6 }); G.dot(pk, pk, { c: COL.ink, r: 5, hollow: true });
    G.legend([{ c: COL.s1, t: L.R1 }, { c: COL.s2, t: L.R2 }], G.ml + 150, 16);
    return { svg: G.svg(L.diffAria), read: L.diffRead(p, pk) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([60, 80, 100, 120]); D.b = pick([0.5, 1, 2]); D.c1 = 2 * rint(2, 10); D.c2 = D.c1 + 2 * rint(2, 8);
    D.pm1 = (D.a + D.c1) / 2;
    if (D.pm1 <= D.c2 + 2 || D.c2 >= D.a - 10) continue;
    break;
  }
  const a = D.a, b = D.b;
  D.Q = (a - D.c2) / b; D.pi1 = (D.c2 - D.c1) * D.Q; D.SC = b * D.Q * D.Q / 2; D.W = D.SC + D.pi1;
  D.Qe = (a - D.c1) / b; D.We = b * D.Qe * D.Qe / 2; D.DWL = D.We - D.W;
  D.Qm = (a - D.c1) / (2 * b); D.SCm = b * D.Qm * D.Qm / 2; D.pim = (D.pm1 - D.c1) * D.Qm; D.Wm = D.SCm + D.pim;
  /* produits différenciés */
  for (;;) { D.al = 10 * rint(4, 12); D.be = pick([1, 2, 3]); D.ga = pick([0.5, 1, 1.5, 2]); D.c = 2 * rint(2, 8); if (D.ga < D.be && D.al > D.be * D.c) break; }
  D.pB = (D.al + D.be * D.c) / (2 * D.be - D.ga); D.qB = D.al - (D.be - D.ga) * D.pB; D.piB = (D.pB - D.c) * D.qB;
  D.pK = (D.al + (D.be - D.ga) * D.c) / (2 * (D.be - D.ga)); D.qK = D.al - (D.be - D.ga) * D.pK; D.piK = (D.pK - D.c) * D.qK;
  return D;
};
function e6graphR(D, lang) {
  const fr = lang === 'fr', R = p => (D.al + D.be * D.c + D.ga * p) / (2 * D.be), top = Math.max(D.pK, D.pB) * 1.35;
  const G = Plot({ w: 520, h: 420, x0: 0, x1: top, y0: 0, y1: top, mt: 26, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, top, 4), yt: ticks(0, top, 4), xl: 'p₁', yl: 'p₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  G.line([[R(0), 0], [R(top), top]], { c: COL.s1, w: 2.4, clip: true }); G.line([[0, R(0)], [top, R(top)]], { c: COL.s2, w: 2.4, clip: true });
  G.dot(D.pB, D.pB, { c: COL.s3, r: 6 }); G.text(D.pB, D.pB, 'B', { dx: 9, dy: 14, anchor: 'start', bold: true, size: 12, c: COL.s3 });
  G.dot(D.pK, D.pK, { c: COL.ink, r: 5, hollow: true }); G.text(D.pK, D.pK, 'K', { dx: 9, dy: -6, anchor: 'start', bold: true, size: 12 });
  G.legend([{ c: COL.s1, t: 'R₁' }, { c: COL.s2, t: 'R₂' }], G.ml + 160, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Fonctions de réaction en prix' : 'Price reaction functions') + '</div>';
}
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Les deux parties sont indépendantes.<br><strong>Partie A.</strong> Deux entreprises vendent un bien homogène dont la demande est \(Q=\frac{${D.a}-p}{${texT(D.b, 2)}}\), c'est-à-dire \(P(Q)=${D.a}-${cfx(D.b)}Q\). Elles fixent simultanément leurs prix ; les consommateurs achètent chez la moins chère. Leurs coûts marginaux sont constants : \(c_1=${D.c1}\) et \(c_2=${D.c2}\).<br><strong>Partie B.</strong> Deux entreprises vendent des produits différenciés, de demandes \(q_1=${D.al}-${cfx(D.be)}p_1+${cfx(D.ga)}p_2\) et \(q_2=${D.al}-${cfx(D.be)}p_2+${cfx(D.ga)}p_1\), avec un coût marginal commun \(c=${D.c}\).</div>
<div class="questions"><ol>
<li><div class="q-text">(A) Montrez qu'à l'équilibre de Bertrand, l'entreprise 1 fixe un prix égal (ou juste inférieur) à \(c_2\). Déterminez la quantité vendue, puis les profits.</div></li>
<li><div class="q-text">(A) Calculez, à l'aide d'intégrales, le surplus des consommateurs, le surplus des producteurs, le surplus total et la perte sèche. Comparez avec la situation où l'entreprise 1 serait seule sur le marché.</div></li>
<li><div class="q-text">(A) Représentez graphiquement l'équilibre et les surplus.</div></li>
<li><div class="q-text">(B) Déterminez les fonctions de réaction en prix, l'équilibre de Bertrand, les quantités et les profits.</div></li>
<li><div class="q-text">(B) Représentez graphiquement les fonctions de réaction et l'équilibre. Pourquoi les fonctions de réaction sont-elles croissantes ?</div></li>
<li><div class="q-text">(B) Les deux entreprises s'entendent pour fixer le même prix qui maximise leur profit joint. Déterminez ce prix, les quantités et les profits, et comparez avec l'équilibre de Bertrand du point de vue des entreprises et des consommateurs.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">The two parts are independent.<br><strong>Part A.</strong> Two firms sell a homogeneous good whose demand is \(Q=\frac{${D.a}-p}{${texT(D.b, 2)}}\), that is \(P(Q)=${D.a}-${cfx(D.b)}Q\). They set their prices simultaneously; consumers buy from the cheaper one. Their marginal costs are constant: \(c_1=${D.c1}\) and \(c_2=${D.c2}\).<br><strong>Part B.</strong> Two firms sell differentiated products, with demands \(q_1=${D.al}-${cfx(D.be)}p_1+${cfx(D.ga)}p_2\) and \(q_2=${D.al}-${cfx(D.be)}p_2+${cfx(D.ga)}p_1\), and a common marginal cost \(c=${D.c}\).</div>
<div class="questions"><ol>
<li><div class="q-text">(A) Show that in the Bertrand equilibrium, firm 1 sets a price equal to (or just below) \(c_2\). Determine the quantity sold, then the profits.</div></li>
<li><div class="q-text">(A) Compute, using integrals, consumer surplus, producer surplus, total surplus and the deadweight loss. Compare with the situation where firm 1 would be alone on the market.</div></li>
<li><div class="q-text">(A) Draw the equilibrium and the surpluses.</div></li>
<li><div class="q-text">(B) Determine the price reaction functions, the Bertrand equilibrium, the quantities and the profits.</div></li>
<li><div class="q-text">(B) Draw the reaction functions and the equilibrium. Why are the reaction functions increasing?</div></li>
<li><div class="q-text">(B) The two firms agree to set the same price maximising their joint profit. Determine this price, the quantities and the profits, and compare with the Bertrand equilibrium from the point of view of firms and consumers.</div></li>
</ol></div>`;
};
function e6sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], a = D.a, b = D.b, c1 = D.c1, c2 = D.c2, n4 = x => texT(x, 4), m = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), PS = T_(['PS', 'DWL']);
  const qd = p => Math.abs(b - 1) < 1e-12 ? String.raw`${a}-${p}` : String.raw`\frac{${a}-${p}}{${texT(b, 2)}}`;
  const al = D.al, be = D.be, ga = D.ga, c = D.c;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Raisonnons par élimination des situations qui ne peuvent pas être un équilibre. Si l\'entreprise 1 fixait un prix supérieur à', 'Let us rule out the situations that cannot be an equilibrium. If firm 1 set a price above'])} \(c_2\), ${T_(['l\'entreprise 2 pourrait se placer juste en dessous, entre', 'firm 2 could undercut it, between'])} \(c_2\) ${T_(['et ce prix, capter tout le marché et faire un profit positif : ce ne serait pas un équilibre. Si l\'entreprise 1 fixait un prix inférieur à', 'and that price, capture the whole market and make a positive profit: this would not be an equilibrium. If firm 1 set a price below'])} \(c_2\), ${T_(['elle gagnerait à le remonter, puisque l\'entreprise 2 ne peut pas vendre en dessous de son coût. Elle fixe donc', 'it would gain by raising it, since firm 2 cannot sell below its cost. It therefore sets'])} \(p=c_2=${c2}\) ${T_(['(ou un prix infiniment proche, juste en dessous) et sert tout le marché. Ce prix est bien inférieur à son prix de monopole', '(or a price infinitely close, just below) and serves the whole market. This price is indeed below its monopoly price'])} \(p^m_1=\frac{${a}+${c1}}{2}=${n4(D.pm1)}\) : ${T_(['la concurrence potentielle de l\'entreprise 2 la contraint.', 'the potential competition of firm 2 constrains it.'])}</p>
  <p>${T_(['On en déduit, d\'après la fonction de demande, la quantité vendue :', 'The demand function then gives the quantity sold:'])}
  \[Q=${qd(c2)}=${n4(D.Q)}\]
  ${T_(['Le profit de l\'entreprise 1 est sa marge unitaire multipliée par cette quantité, celui de l\'entreprise 2 est nul :', 'Firm 1\'s profit is its unit margin times this quantity; firm 2\'s profit is zero:'])}
  \[\Pi_1=(${c2}-${c1})\times ${n4(D.Q)}=${m(D.pi1)}\qquad\Pi_2=0\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix payé, et le surplus des producteurs l\'intégrale de l\'écart entre le prix et le coût marginal de l\'entreprise qui produit :', 'Consumer surplus is the integral of the gap between inverse demand and the price paid, and producer surplus the integral of the gap between the price and the marginal cost of the producing firm:'])}
  \[\begin{aligned}${SC}&amp;=\int_0^{${n4(D.Q)}}\big(${a}-${cfx(b)}q-${c2}\big)\,dq=\Big[${a - c2}\,q-${cfx(b / 2)}q^2\Big]_0^{${n4(D.Q)}}=${m(D.SC)}\\${SP}&amp;=\int_0^{${n4(D.Q)}}(${c2}-${c1})\,dq=${m(D.pi1)}\end{aligned}\]
  ${T_(['Le surplus total vaut donc', 'Total surplus is therefore'])} \(W=${m(D.SC)}+${m(D.pi1)}=${m(D.W)}\). ${T_(['L\'optimum serait de vendre au coût marginal le plus bas,', 'The optimum would be to sell at the lowest marginal cost,'])} ${c1}, ${T_(['soit', 'that is'])} \(Q^e=${n4(D.Qe)}\) ${T_(['et un surplus total', 'and a total surplus'])} \(W^e=\int_0^{${n4(D.Qe)}}(${a}-${cfx(b)}q-${c1})\,dq=${m(D.We)}\). ${T_(['On en déduit la perte sèche :', 'Hence the deadweight loss:'])}
  \[${PS}=W^e-W=${m(D.We)}-${m(D.W)}=${m(D.DWL)}=\tfrac12\,(${n4(D.Qe)}-${n4(D.Q)})\,(${c2}-${c1})\]
  ${T_(['Si l\'entreprise 1 était seule, elle fixerait son prix de monopole', 'If firm 1 were alone, it would charge its monopoly price'])} \(${n4(D.pm1)}\), ${T_(['vendrait', 'sell'])} \(Q^m=${Math.abs(2 * b - 1) < 1e-12 ? a + '-' + c1 : String.raw`\frac{${a}-${c1}}{${n4(2 * b)}}`}=${n4(D.Qm)}\), ${T_(['et les mêmes intégrales donneraient', 'and the same integrals would give'])} \(${SC}^m=${m(D.SCm)}\), \(${SP}^m=${m(D.pim)}\), ${T_(['soit un surplus total de', 'that is a total surplus of'])} \(${m(D.Wm)}\). ${T_(['La seule présence de l\'entreprise 2, même si elle ne vend rien, fait baisser le prix, augmente le surplus des consommateurs de', 'The mere presence of firm 2, even though it sells nothing, lowers the price, raises consumer surplus by'])} \(${m(D.SC - D.SCm)}\) ${T_(['et réduit la perte sèche.', 'and reduces the deadweight loss.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le prix d\'équilibre est la droite horizontale', 'The equilibrium price is the horizontal line'])} \(p=c_2\) ; ${T_(['la quantité se lit sur la demande. Le rectangle vert, entre', 'the quantity is read on the demand curve. The green rectangle, between'])} \(c_2\) ${T_(['et', 'and'])} \(c_1\), ${T_(['est le profit de l\'entreprise 1 ; le triangle rouge, au-delà, la perte sèche :', 'is firm 1\'s profit; the red triangle beyond it is the deadweight loss:'])}</p>
  ${eiSurplusFig({ lang: lang, a: a, b: b, P: c2, Q: D.Q, cmin: c1, seg: [[0, D.Q, c1]], costs: [c2], label: 'B', aria: 'Bertrand' })}
</div></li>
<li><div class="q-content">
  <p>${T_(['Le profit de l\'entreprise 1 est', 'Firm 1\'s profit is'])} \(\Pi_1=(p_1-${c})(${al}-${cfx(be)}p_1+${cfx(ga)}p_2)\). ${T_(['Pour un prix donné de sa concurrente, elle annule la dérivée de son profit par rapport à son propre prix :', 'For a given rival price, it sets the derivative of its profit with respect to its own price to zero:'])}
  \[\begin{aligned}\frac{\partial\Pi_1}{\partial p_1}=0&amp;\iff ${al}-${cfx(2 * be)}p_1+${cfx(ga)}p_2+${n4(be * c)}=0&amp;&amp;\text{${T_(['dérivée d\'un produit', 'derivative of a product'])}}\\&amp;\iff p_1=R_1(p_2)=${n4((al + be * c) / (2 * be))}+${n4(ga / (2 * be))}\,p_2\end{aligned}\]
  ${T_(['Par symétrie,', 'By symmetry,'])} \(p_2=R_2(p_1)=${n4((al + be * c) / (2 * be))}+${n4(ga / (2 * be))}\,p_1\). ${T_(['L\'équilibre est symétrique :', 'The equilibrium is symmetric:'])} \(p^*=${n4((al + be * c) / (2 * be))}+${n4(ga / (2 * be))}\,p^*\), ${T_(['d\'où', 'hence'])}
  \[p^*=\frac{${al}+${n4(be * c)}}{${n4(2 * be)}-${n4(ga)}}=${n4(D.pB)}\]
  ${T_(['On en déduit, d\'après la fonction de demande, la quantité vendue par chaque entreprise, puis son profit :', 'The demand function then gives the quantity sold by each firm, then its profit:'])}
  \[q^*=${al}-${cfx(be)}\times ${n4(D.pB)}+${cfx(ga)}\times ${n4(D.pB)}=${n4(D.qB)}\qquad\Pi^*=(${n4(D.pB)}-${c})\times ${n4(D.qB)}=${m(D.piB)}\]
  ${T_(['Le prix dépasse le coût marginal : la différenciation donne à chaque entreprise un pouvoir de marché, et le paradoxe de Bertrand disparaît.', 'The price exceeds marginal cost: differentiation gives each firm market power, and the Bertrand paradox disappears.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les deux fonctions de réaction sont des droites croissantes, de pente', 'Both reaction functions are increasing lines, with slope'])} \(${n4(ga / (2 * be))}&lt;1\) ; ${T_(['elles se coupent sur la diagonale, au point B. Elles sont croissantes parce que les prix sont des compléments stratégiques : si la concurrente augmente son prix, une partie de ses clients se reporte vers l\'entreprise, dont la demande augmente ; il devient alors optimal d\'augmenter aussi son prix.', 'they cross on the diagonal, at point B. They are increasing because prices are strategic complements: if the rival raises its price, some of its customers switch to the firm, whose demand rises; it then becomes optimal to raise its own price too.'])}</p>
  ${e6graphR(D, lang)}
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec un prix commun', 'With a common price'])} \(p\), ${T_(['chaque entreprise vend', 'each firm sells'])} \(q=${al}-${n4(be - ga)}\,p\) ${T_(['et le profit joint vaut', 'and joint profit is'])} \(2\,(p-${c})(${al}-${n4(be - ga)}\,p)\). ${T_(['Il est maximal quand sa dérivée s\'annule :', 'It is maximal when its derivative vanishes:'])}
  \[${al}-${n4(2 * (be - ga))}\,p+${n4((be - ga) * c)}=0\iff p^K=\frac{${al}+${n4((be - ga) * c)}}{${n4(2 * (be - ga))}}=${n4(D.pK)}\]
  ${T_(['On en déduit, d\'après la fonction de demande, la quantité de chaque entreprise', 'The demand function then gives each firm\'s quantity'])}, \(q^K=${n4(D.qK)}\), ${T_(['et son profit', 'and its profit'])}, \(\Pi^K=(${n4(D.pK)}-${c})\times ${n4(D.qK)}=${m(D.piK)}\). ${T_(['La collusion augmente le prix', 'Collusion raises the price'])} (\(${n4(D.pK)}&gt;${n4(D.pB)}\)) ${T_(['et le profit de chaque entreprise, qui est son surplus de producteur', 'and each firm\'s profit, which is its producer surplus'])} (\(${m(D.piK)}&gt;${m(D.piB)}\)). ${T_(['Les consommateurs achètent moins de chaque produit, plus cher : leur surplus diminue. Comme pour le cartel en quantités, l\'entente n\'est pas un équilibre du jeu simultané : au prix', 'Consumers buy less of each product, at a higher price: their surplus falls. As for the quantity cartel, the agreement is not an equilibrium of the simultaneous game: at price'])} \(p^K\), ${T_(['la meilleure réponse de chaque entreprise est', 'each firm\'s best response is'])} \(R(p^K)=${n4((al + be * c + ga * D.pK) / (2 * be))}&lt;p^K\) : ${T_(['chacune a intérêt à baisser son prix.', 'each has an incentive to cut its price.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => e6sol(D, 'fr');
I18N.en.sol = D => e6sol(D, 'en');
