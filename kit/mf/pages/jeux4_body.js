I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 4 – Stratégies mixtes', 'k-h1': 'Équilibre de Nash en stratégies mixtes', 'k-coursetitle': 'Jouer au hasard à bon escient : principe d\'indifférence, correspondances de meilleure réponse et existence d\'un équilibre', 'k-extitle': 'Équilibres en stratégies mixtes d\'un jeu sans équilibre pur et de la poule mouillée', 'k-soltitle': 'Équilibres en stratégies mixtes d\'un jeu sans équilibre pur et de la poule mouillée' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 4 – Mixed strategies', 'k-h1': 'Mixed-strategy Nash equilibrium', 'k-coursetitle': 'Randomising wisely: the indifference principle, best-response correspondences and existence of equilibrium', 'k-extitle': 'Mixed-strategy equilibria of a game without pure equilibrium and of chicken', 'k-soltitle': 'Mixed-strategy equilibria of a game without pure equilibrium and of chicken' });

/* ---------- outils : jeu 2 x 2, p = proba de la ligne 1, q = proba de la colonne 1 ---------- */
function j4mix(A, B) {
  const qd = A[0][0] - A[0][1] - A[1][0] + A[1][1], pd = B[0][0] - B[1][0] - B[0][1] + B[1][1];
  const q = qd !== 0 ? (A[1][1] - A[0][1]) / qd : NaN, p = pd !== 0 ? (B[1][1] - B[1][0]) / pd : NaN;
  return { p: p, q: q, ok: p > 0 && p < 1 && q > 0 && q < 1 };
}
/* espérances de gain du joueur 1 (lignes) contre q, du joueur 2 (colonnes) contre p */
const j4E1 = (A, q) => [q * A[0][0] + (1 - q) * A[0][1], q * A[1][0] + (1 - q) * A[1][1]];
const j4E2 = (B, p) => [p * B[0][0] + (1 - p) * B[1][0], p * B[0][1] + (1 - p) * B[1][1]];
/* correspondances de meilleure réponse dans le carré (q en abscisse, p en ordonnée) */
function j4brc(A, B, lab, lang, size) {
  const fr = lang === 'fr', M = j4mix(A, B), Bp = jxBR(A, B);
  const G = Plot({ w: size || 440, h: (size || 440) + 30, x0: 0, x1: 1, y0: 0, y1: 1, mt: 62, mb: 46, ml: 50 });
  G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.25, 0.5, 0.75, 1], xl: (fr ? 'q : probabilité de ' : 'q: probability of ') + lab[1][0], yl: (fr ? 'p : probabilité de ' : 'p: probability of ') + lab[0][0], xf: v => fmtT(v, 2), yf: v => fmtT(v, 2) });
  /* BR1(q) : p = 1 si E1[0] > E1[1] */
  const br1 = q => { const e = j4E1(A, q); return e[0] > e[1] + 1e-12 ? 1 : e[0] < e[1] - 1e-12 ? 0 : null; };
  const br2 = p => { const e = j4E2(B, p); return e[0] > e[1] + 1e-12 ? 1 : e[0] < e[1] - 1e-12 ? 0 : null; };
  const seg1 = [], seg2 = [];
  if (isFinite(M.q) && M.q > 0 && M.q < 1) { seg1.push([[0, br1(M.q / 2)], [M.q, br1(M.q / 2)]], [[M.q, 0], [M.q, 1]], [[M.q, br1((1 + M.q) / 2)], [1, br1((1 + M.q) / 2)]]); }
  else { const v = br1(0.5); seg1.push([[0, v], [1, v]]); }
  if (isFinite(M.p) && M.p > 0 && M.p < 1) { seg2.push([[br2(M.p / 2), 0], [br2(M.p / 2), M.p]], [[0, M.p], [1, M.p]], [[br2((1 + M.p) / 2), M.p], [br2((1 + M.p) / 2), 1]]); }
  else { const v = br2(0.5); seg2.push([[v, 0], [v, 1]]); }
  seg1.forEach(sg => G.line(sg, { c: COL.s1, w: 3 })); seg2.forEach(sg => G.line(sg, { c: COL.s2, w: 3, dash: '7 4' }));
  const eqs = Bp.ne.map(e => [e[1] === 0 ? 1 : 0, e[0] === 0 ? 1 : 0]); if (M.ok) eqs.push([M.q, M.p]);
  eqs.forEach(e => G.dot(e[0], e[1], { c: COL.s3, r: 7 }));
  G.legend([{ c: COL.s1, t: fr ? 'réponse du joueur 1' : 'player 1 response' }, { c: COL.s2, dash: '7 4', t: fr ? 'réponse du joueur 2' : 'player 2 response' }], G.ml - 30, 18);
  return '<div style="max-width:470px;margin:0 auto">' + G.svg(fr ? 'Correspondances de meilleure réponse' : 'Best-response correspondences') + '</div>';
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez définir une stratégie mixte, calculer un gain espéré, trouver un équilibre en stratégies mixtes par le principe d'indifférence, tracer les correspondances de meilleure réponse d'un jeu \(2\times 2\) et repérer tous ses équilibres, purs et mixtes.<br><br>
<strong>Pourquoi ?</strong> Un tireur de penalty, un contrôleur fiscal ou un joueur de poker ont intérêt à être imprévisibles : si l'adversaire devinait leur choix, il en profiterait. Les stratégies mixtes formalisent cette imprévisibilité, et garantissent qu'un jeu fini a toujours au moins un équilibre de Nash.<br><br>
<strong>Prérequis.</strong> Équilibre de Nash en stratégies pures (Théorie des jeux 3), espérance d'une variable aléatoire.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Stratégie mixte</a> · <a href="#s2">2. Le principe d'indifférence</a> · <a href="#s3">3. Le jeu 2 × 2</a> · <a href="#s4">4. Correspondances de meilleure réponse</a> · <a href="#s5">5. Le théorème de Nash</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Stratégie mixte et gain espéré</div>
<p>Une <em>stratégie mixte</em> est une loi de probabilité sur les stratégies pures : le joueur tire sa stratégie au hasard selon cette loi. Dans un jeu \(2\times 2\), le joueur 1 joue sa première ligne avec probabilité \(p\) et la seconde avec probabilité \(1-p\) ; le joueur 2 joue sa première colonne avec probabilité \(q\). Les tirages étant indépendants, le gain espéré du joueur 1 est :
\[U_1(p,q)=pq\,a_{11}+p(1-q)\,a_{12}+(1-p)q\,a_{21}+(1-p)(1-q)\,a_{22}\]
Il est linéaire en \(p\) : pour un \(q\) donné, le joueur 1 compare le gain espéré de ses deux lignes, \(E_1(q)=q\,a_{11}+(1-q)\,a_{12}\) et \(E_2(q)=q\,a_{21}+(1-q)\,a_{22}\), et met tout son poids sur la meilleure.</p>

<div class="dossier-title" id="s2">2. Le principe d'indifférence</div>
<p>Un joueur n'accepte de mélanger deux stratégies que si elles lui rapportent le même gain espéré : sinon, il jouerait la meilleure avec certitude. À l'équilibre en stratégies mixtes, chaque joueur choisit donc ses probabilités de façon à rendre <em>l'autre</em> indifférent entre ses stratégies. Le \(q^*\) du joueur 2 est la valeur qui égalise les gains espérés des deux lignes du joueur 1 :
\[q^*a_{11}+(1-q^*)a_{12}=q^*a_{21}+(1-q^*)a_{22}\iff q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\]
et, de même, le \(p^*\) du joueur 1 rend le joueur 2 indifférent entre ses colonnes. Résultat contre-intuitif : les probabilités d'un joueur dépendent des gains de l'autre, pas des siens.</p>
<div class="ifig" data-fig="ev"></div>
<div class="fig-cap">Figure 1 — Gains espérés des deux lignes du joueur 1 en fonction de la probabilité \(q\) avec laquelle le joueur 2 joue sa première colonne, dans le jeu de la poule mouillée. Les deux droites se coupent en \(q^*\) : c'est la seule valeur de \(q\) pour laquelle le joueur 1 accepte de mélanger.</div>

<div class="dossier-title" id="s3">3. L'exemple de pile ou face</div>
<p>Dans pile ou face, le joueur 1 gagne 1 si les pièces coïncident, le joueur 2 gagne 1 sinon. Il n'y a pas d'équilibre en stratégies pures. Pour que le joueur 1 soit indifférent, il faut \(q-(1-q)=-q+(1-q)\), soit \(q^*=\frac12\) ; par symétrie, \(p^*=\frac12\). À l'équilibre, chacun joue pile ou face avec probabilité \(\frac12\), et chacun a un gain espéré nul. Dans la poule mouillée, l'équilibre mixte s'ajoute aux deux équilibres purs ; il est symétrique, et l'accident y survient avec une probabilité positive.</p>

<div class="dossier-title" id="s4">4. Correspondances de meilleure réponse</div>
<p>La meilleure réponse du joueur 1 à \(q\) vaut \(p=1\) si sa première ligne est meilleure, \(p=0\) si c'est la seconde, et n'importe quel \(p\in[0,1]\) en cas d'égalité, c'est-à-dire en \(q=q^*\). Son graphe dans le carré \([0,1]^2\) est une ligne brisée en forme de Z. On trace de même celle du joueur 2. Les équilibres de Nash, purs et mixtes, sont exactement les points d'intersection des deux correspondances.</p>
<div class="ifig" data-fig="brc"></div>
<div class="fig-cap">Figure 2 — Correspondances de meilleure réponse et équilibres (points rouges) de quatre jeux classiques. Pile ou face : une seule intersection, mixte. Poule mouillée et bataille des sexes : trois intersections, deux pures dans les coins et une mixte à l'intérieur. Dilemme du prisonnier : une seule, pure, puisque chaque joueur a une stratégie dominante.</div>

<div class="dossier-title" id="s5">5. Le théorème de Nash</div>
<p>Nash (1950) a démontré que tout jeu fini, avec un nombre fini de joueurs et de stratégies pures, possède au moins un équilibre en stratégies mixtes, les stratégies pures étant des cas particuliers. Dans un jeu \(2\times 2\) générique, le nombre d'équilibres est impair : un ou trois. L'équilibre mixte se vérifie toujours de la même façon : chaque stratégie jouée avec une probabilité positive doit donner le même gain espéré, et aucune stratégie non jouée ne doit donner davantage.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Stratégie mixte : loi de probabilité sur les stratégies pures ; gain espéré linéaire en chaque probabilité.</li>
<li>Indifférence : les probabilités d'un joueur rendent l'autre indifférent entre les stratégies qu'il mélange ; \(q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\).</li>
<li>Les équilibres sont les intersections des correspondances de meilleure réponse.</li>
<li>Tout jeu fini a au moins un équilibre de Nash, éventuellement mixte.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can define a mixed strategy, compute an expected payoff, find a mixed-strategy equilibrium with the indifference principle, draw the best-response correspondences of a \(2\times 2\) game and locate all its equilibria, pure and mixed.<br><br>
<strong>Why?</strong> A penalty taker, a tax inspector or a poker player gain from being unpredictable: if the opponent guessed their choice, they would exploit it. Mixed strategies formalise this unpredictability, and guarantee that a finite game always has at least one Nash equilibrium.<br><br>
<strong>Prerequisites.</strong> Pure-strategy Nash equilibrium (Game theory 3), expectation of a random variable.
</div>
<p class="toc">Contents: <a href="#s1">1. Mixed strategy</a> · <a href="#s2">2. The indifference principle</a> · <a href="#s3">3. The 2 × 2 game</a> · <a href="#s4">4. Best-response correspondences</a> · <a href="#s5">5. Nash's theorem</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Mixed strategy and expected payoff</div>
<p>A <em>mixed strategy</em> is a probability distribution over pure strategies: the player draws their strategy at random according to it. In a \(2\times 2\) game, player 1 plays their first row with probability \(p\) and the second with probability \(1-p\); player 2 plays their first column with probability \(q\). Draws being independent, player 1's expected payoff is:
\[U_1(p,q)=pq\,a_{11}+p(1-q)\,a_{12}+(1-p)q\,a_{21}+(1-p)(1-q)\,a_{22}\]
It is linear in \(p\): for a given \(q\), player 1 compares the expected payoff of their two rows, \(E_1(q)=q\,a_{11}+(1-q)\,a_{12}\) and \(E_2(q)=q\,a_{21}+(1-q)\,a_{22}\), and puts all their weight on the better one.</p>

<div class="dossier-title" id="s2">2. The indifference principle</div>
<p>A player only agrees to mix two strategies if they yield the same expected payoff: otherwise, they would play the better one with certainty. In a mixed-strategy equilibrium, each player therefore chooses their probabilities so as to make <em>the other</em> indifferent between their strategies. Player 2's \(q^*\) is the value that equalises the expected payoffs of player 1's two rows:
\[q^*a_{11}+(1-q^*)a_{12}=q^*a_{21}+(1-q^*)a_{22}\iff q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\]
and, likewise, player 1's \(p^*\) makes player 2 indifferent between their columns. A counter-intuitive result: a player's probabilities depend on the other's payoffs, not on their own.</p>
<div class="ifig" data-fig="ev"></div>
<div class="fig-cap">Figure 1 — Expected payoffs of player 1's two rows as a function of the probability \(q\) with which player 2 plays their first column, in the game of chicken. The two lines cross at \(q^*\): it is the only value of \(q\) for which player 1 agrees to mix.</div>

<div class="dossier-title" id="s3">3. The matching pennies example</div>
<p>In matching pennies, player 1 wins 1 if the coins match, player 2 wins 1 otherwise. There is no pure-strategy equilibrium. For player 1 to be indifferent, we need \(q-(1-q)=-q+(1-q)\), that is \(q^*=\frac12\); by symmetry, \(p^*=\frac12\). In equilibrium, each plays heads or tails with probability \(\frac12\), and each has a zero expected payoff. In chicken, the mixed equilibrium adds to the two pure ones; it is symmetric, and the crash happens with positive probability.</p>

<div class="dossier-title" id="s4">4. Best-response correspondences</div>
<p>Player 1's best response to \(q\) is \(p=1\) if their first row is better, \(p=0\) if the second is, and any \(p\in[0,1]\) in case of a tie, that is at \(q=q^*\). Its graph in the square \([0,1]^2\) is a Z-shaped broken line. Player 2's is drawn likewise. The Nash equilibria, pure and mixed, are exactly the intersection points of the two correspondences.</p>
<div class="ifig" data-fig="brc"></div>
<div class="fig-cap">Figure 2 — Best-response correspondences and equilibria (red dots) of four classic games. Matching pennies: a single intersection, mixed. Chicken and battle of the sexes: three intersections, two pure in the corners and one mixed inside. Prisoner's dilemma: a single one, pure, since each player has a dominant strategy.</div>

<div class="dossier-title" id="s5">5. Nash's theorem</div>
<p>Nash (1950) proved that every finite game, with finitely many players and pure strategies, has at least one equilibrium in mixed strategies, pure strategies being special cases. In a generic \(2\times 2\) game, the number of equilibria is odd: one or three. A mixed equilibrium is always checked the same way: each strategy played with positive probability must give the same expected payoff, and no unplayed strategy may give more.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Mixed strategy: a probability distribution over pure strategies; expected payoff linear in each probability.</li>
<li>Indifference: a player's probabilities make the other indifferent between the strategies they mix; \(q^*=\frac{a_{22}-a_{12}}{a_{11}-a_{12}-a_{21}+a_{22}}\).</li>
<li>Equilibria are the intersections of the best-response correspondences.</li>
<li>Every finite game has at least one Nash equilibrium, possibly mixed.</li>
</ul>`;

/* ---------- figures ---------- */
const J4_G = {
  mp: { A: [[1, -1], [-1, 1]], B: [[-1, 1], [1, -1]], fr: [['Pile', 'Face'], ['Pile', 'Face']], en: [['Heads', 'Tails'], ['Heads', 'Tails']] },
  chicken: { A: [[0, -1], [1, -10]], B: [[0, 1], [-1, -10]], fr: [['Dévier', 'Continuer'], ['Dévier', 'Continuer']], en: [['Swerve', 'Straight'], ['Swerve', 'Straight']] },
  bos: { A: [[2, 0], [0, 1]], B: [[1, 0], [0, 2]], fr: [['Opéra', 'Football'], ['Opéra', 'Football']], en: [['Opera', 'Football'], ['Opera', 'Football']] },
  pd: { A: [[3, 0], [5, 1]], B: [[3, 5], [0, 1]], fr: [['Coopérer', 'Dénoncer'], ['Coopérer', 'Dénoncer']], en: [['Cooperate', 'Denounce'], ['Cooperate', 'Denounce']] }
};
I18N.fr.f = { game: 'Jeu', gmp: 'Pile ou face', gchicken: 'Poule mouillée', gbos: 'Bataille des sexes', gpd: 'Dilemme du prisonnier', q: 'Probabilité q', e1: 'gain espéré de « Dévier »', e2: 'gain espéré de « Continuer »', evAria: 'Gains espérés en fonction de q',
  evRead: (q, e, qs) => `Pour <i>q</i> = ${fmtT(q, 2)} : « Dévier » rapporte <span class="v">${fmt(e[0], 2)}</span>, « Continuer » <span class="v">${fmt(e[1], 2)}</span> ; ` + (Math.abs(e[0] - e[1]) < 1e-9 ? 'indifférence.' : `meilleure réponse : ${e[0] > e[1] ? 'dévier' : 'continuer'}.`) + ` Indifférence en <i>q</i>* = <span class="v">${fmt(qs, 3)}</span>.`,
  brRead: (M) => M.ok ? `Équilibre mixte : <i>p</i>* = <span class="v">${fmt(M.p, 3)}</span>, <i>q</i>* = <span class="v">${fmt(M.q, 3)}</span>` : 'Pas d\'équilibre strictement mixte.' };
I18N.en.f = { game: 'Game', gmp: 'Matching pennies', gchicken: 'Chicken', gbos: 'Battle of the sexes', gpd: 'Prisoner\'s dilemma', q: 'Probability q', e1: 'expected payoff of "Swerve"', e2: 'expected payoff of "Straight"', evAria: 'Expected payoffs as a function of q',
  evRead: (q, e, qs) => `For <i>q</i> = ${fmtT(q, 2)}: "Swerve" pays <span class="v">${fmt(e[0], 2)}</span>, "Straight" <span class="v">${fmt(e[1], 2)}</span>; ` + (Math.abs(e[0] - e[1]) < 1e-9 ? 'indifference.' : `best response: ${e[0] > e[1] ? 'swerve' : 'go straight'}.`) + ` Indifference at <i>q</i>* = <span class="v">${fmt(qs, 3)}</span>.`,
  brRead: (M) => M.ok ? `Mixed equilibrium: <i>p</i>* = <span class="v">${fmt(M.p, 3)}</span>, <i>q</i>* = <span class="v">${fmt(M.q, 3)}</span>` : 'No strictly mixed equilibrium.' };
FIGS.ev = {
  state: { q: 0.5 },
  controls: L => [{ key: 'q', label: L.f.q, min: 0, max: 1, step: 0.05, fmt: v => fmtT(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, A = J4_G.chicken.A, M = j4mix(A, J4_G.chicken.B), e = j4E1(A, s.q);
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 1, y0: -10.5, y1: 1.5, mt: 26, mb: 42 });
    G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: [-10, -8, -6, -4, -2, 0], xl: 'q', xf: v => fmtT(v, 2), yf: v => String(v), xAxisAt: 0 });
    G.line([[0, A[0][1]], [1, A[0][0]]], { c: COL.s1, w: 2.4 }); G.line([[0, A[1][1]], [1, A[1][0]]], { c: COL.s2, w: 2.4 });
    G.seg(M.q, -10.5, M.q, j4E1(A, M.q)[0], { c: COL.s3, w: 1.2, dash: '4 3' }); G.dot(M.q, j4E1(A, M.q)[0], { c: COL.s3, r: 6 });
    G.seg(s.q, -10.5, s.q, 1.5, { c: GREY, w: 1, dash: '2 3' });
    G.legend([{ c: COL.s1, t: L.e1 }, { c: COL.s2, t: L.e2 }], G.ml + 8, 16);
    return { svg: G.svg(L.evAria), read: L.evRead(s.q, e, M.q) };
  }
};
FIGS.brc = {
  state: { g: 'chicken' },
  controls: L => [{ key: 'g', type: 'select', label: L.f.game, options: ['mp', 'chicken', 'bos', 'pd'].map(k => ({ v: k, t: L.f['g' + k] })) }],
  draw: function (s, lang) { const L = I18N[lang].f, g = J4_G[s.g]; return { svg: j4brc(g.A, g.B, g[lang], lang), read: L.brRead(j4mix(g.A, g.B)) }; }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  /* jeu A : contrôleur fiscal (ligne) et contribuable (colonne), pas d'équilibre pur */
  for (;;) {
    D.A = [[rint(1, 9), rint(0, 9)], [rint(0, 9), rint(1, 9)]]; D.B = [[rint(0, 9), rint(0, 9)], [rint(0, 9), rint(0, 9)]];
    if (D.A[0][0] === D.A[1][0] || D.A[0][1] === D.A[1][1] || D.B[0][0] === D.B[0][1] || D.B[1][0] === D.B[1][1]) continue;
    if (jxBR(D.A, D.B).ne.length) continue;
    D.M = j4mix(D.A, D.B);
    if (!D.M.ok) continue;
    const den1 = D.A[0][0] - D.A[0][1] - D.A[1][0] + D.A[1][1], den2 = D.B[0][0] - D.B[1][0] - D.B[0][1] + D.B[1][1];
    if (Math.abs(den1) < 2 || Math.abs(den2) < 2) continue;
    break;
  }
  D.U1 = j4E1(D.A, D.M.q)[0]; D.U2 = j4E2(D.B, D.M.p)[0];
  /* jeu B : poule mouillée symétrique */
  for (;;) { D.w = rint(3, 8); D.t = rint(1, 5); D.l = rint(-2, 2); D.k = rint(4, 12); if (D.w > D.t && D.t > D.l && D.l > -D.k) break; }
  D.CA = [[D.t, D.l], [D.w, -D.k]]; D.CB = [[D.t, D.w], [D.l, -D.k]];
  D.CM = j4mix(D.CA, D.CB);
  D.crash = (1 - D.CM.p) * (1 - D.CM.q);
  D.CU = j4E1(D.CA, D.CM.q)[0];
  return D;
};
const J4L = { fr: { r: ['Contrôler', 'Ne pas contrôler'], c: ['Frauder', 'Déclarer'], ch: ['Dévier', 'Continuer'] }, en: { r: ['Inspect', 'Not inspect'], c: ['Cheat', 'Declare'], ch: ['Swerve', 'Straight'] } };
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J4L.fr;
  return String.raw`<div class="context-block">Les deux jeux sont indépendants. Dans chaque case, le premier nombre est le gain du joueur en ligne, le second celui du joueur en colonne.</div>
<p><strong>Jeu A.</strong> Un contrôleur fiscal (en ligne) choisit de contrôler ou non un contribuable (en colonne), qui choisit simultanément de frauder ou de déclarer honnêtement. Le contrôleur joue « contrôler » avec probabilité \(p\), le contribuable « frauder » avec probabilité \(q\).</p>
${jxTable(D.A, D.B, L.r, L.c, 'C \\ F')}
<p><strong>Jeu B.</strong> Deux conducteurs foncent l'un vers l'autre et choisissent simultanément de dévier ou de continuer.</p>
${jxTable(D.CA, D.CB, L.ch, L.ch, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">(A) Montrez que ce jeu n'a pas d'équilibre de Nash en stratégies pures.</div></li>
<li><div class="q-text">(A) Déterminez l'équilibre en stratégies mixtes par le principe d'indifférence, puis les gains espérés à l'équilibre.</div></li>
<li><div class="q-text">(A) Tracez les correspondances de meilleure réponse et vérifiez graphiquement l'équilibre.</div></li>
<li><div class="q-text">(B) Déterminez tous les équilibres de Nash, purs et mixtes. Quelle est, à l'équilibre mixte, la probabilité d'accident ?</div></li>
<li><div class="q-text">(B) Tracez les correspondances de meilleure réponse. Comment évolue la probabilité de continuer à l'équilibre mixte si le coût de l'accident augmente ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J4L.en;
  return String.raw`<div class="context-block">The two games are independent. In each cell, the first number is the row player's payoff, the second the column player's.</div>
<p><strong>Game A.</strong> A tax inspector (row) chooses whether to inspect a taxpayer (column), who simultaneously chooses to cheat or to declare honestly. The inspector plays "inspect" with probability \(p\), the taxpayer "cheat" with probability \(q\).</p>
${jxTable(D.A, D.B, L.r, L.c, 'I \\ T')}
<p><strong>Game B.</strong> Two drivers race towards each other and simultaneously choose to swerve or go straight.</p>
${jxTable(D.CA, D.CB, L.ch, L.ch, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">(A) Show that this game has no pure-strategy Nash equilibrium.</div></li>
<li><div class="q-text">(A) Determine the mixed-strategy equilibrium using the indifference principle, then the expected payoffs in equilibrium.</div></li>
<li><div class="q-text">(A) Draw the best-response correspondences and check the equilibrium graphically.</div></li>
<li><div class="q-text">(B) Determine all Nash equilibria, pure and mixed. In the mixed equilibrium, what is the probability of a crash?</div></li>
<li><div class="q-text">(B) Draw the best-response correspondences. How does the probability of going straight in the mixed equilibrium change if the cost of a crash rises?</div></li>
</ol></div>`;
});
function j4sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J4L[lang], A = D.A, B = D.B, M = D.M, n4 = x => texT(x, 4);
  const bc = j => { const i = A[0][j] > A[1][j] ? 0 : 1; return `${T_(['face à', 'against'])} « ${L.c[j]} », ${T_(['le contrôleur obtient', 'the inspector gets'])} ${A[0][j]} ${T_(['en contrôlant et', 'by inspecting and'])} ${A[1][j]} ${T_(['sinon : il préfère', 'otherwise: they prefer'])} « ${L.r[i]} »`; };
  const br = i => { const j = B[i][0] > B[i][1] ? 0 : 1; return `${T_(['face à', 'against'])} « ${L.r[i]} », ${T_(['le contribuable obtient', 'the taxpayer gets'])} ${B[i][0]} ${T_(['en fraudant et', 'by cheating and'])} ${B[i][1]} ${T_(['en déclarant : il préfère', 'by declaring: they prefer'])} « ${L.c[j]} »`; };
  const den1 = A[0][0] - A[0][1] - A[1][0] + A[1][1], den2 = B[0][0] - B[1][0] - B[0][1] + B[1][1];
  const t = D.t, l = D.l, w = D.w, k = D.k, CM = D.CM, ch = L.ch;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['On cherche les meilleures réponses de chaque joueur :', 'We look for each player\'s best responses:'])} ${bc(0)} ; ${bc(1)} ; ${br(0)} ; ${br(1)}. ${T_(['Les meilleures réponses forment un cycle : aucune case n\'a ses deux gains soulignés, il n\'y a donc pas d\'équilibre de Nash en stratégies pures. Chacun veut prendre l\'autre par surprise : il faut être imprévisible.', 'The best responses form a cycle: no cell has both payoffs underlined, so there is no pure-strategy Nash equilibrium. Each wants to catch the other by surprise: one must be unpredictable.'])}</p>
  <div class="sol-fig">${jxMatrixSVG(A, B, { rows: L.r, cols: L.c, p1: T_(['Contrôleur', 'Inspector']), p2: T_(['Contribuable', 'Taxpayer']), br: true, ne: true, cw: 130, aria: 'A' })}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['À l\'équilibre mixte, le contribuable choisit', 'In the mixed equilibrium, the taxpayer chooses'])} \(q\) ${T_(['de façon que le contrôleur soit indifférent entre ses deux stratégies. Les gains espérés du contrôleur sont :', 'so that the inspector is indifferent between their two strategies. The inspector\'s expected payoffs are:'])}
  \[\begin{aligned}E(\text{${L.r[0]}})&amp;=${A[0][0]}\,q+${A[0][1]}\,(1-q)\\E(\text{${L.r[1]}})&amp;=${A[1][0]}\,q+${A[1][1]}\,(1-q)\end{aligned}\]
  ${T_(['En les égalisant :', 'Equating them:'])}
  \[${A[0][0]}\,q+${A[0][1]}\,(1-q)=${A[1][0]}\,q+${A[1][1]}\,(1-q)\iff q^*=\frac{${A[1][1]}-${A[0][1]}}{${den1}}=${fqa(M.q)}\]
  ${T_(['De même, le contrôleur choisit', 'Likewise, the inspector chooses'])} \(p\) ${T_(['de façon que le contribuable soit indifférent entre frauder et déclarer :', 'so that the taxpayer is indifferent between cheating and declaring:'])}
  \[${B[0][0]}\,p+${B[1][0]}\,(1-p)=${B[0][1]}\,p+${B[1][1]}\,(1-p)\iff p^*=\frac{${B[1][1]}-${B[1][0]}}{${den2}}=${fqa(M.p)}\]
  ${T_(['Les deux probabilités sont comprises strictement entre 0 et 1 : l\'équilibre est bien strictement mixte. On en déduit les gains espérés en reportant', 'Both probabilities lie strictly between 0 and 1: the equilibrium is indeed strictly mixed. The expected payoffs follow by substituting'])} \(q^*\) ${T_(['dans le gain d\'une ligne quelconque du contrôleur, et', 'into the payoff of either of the inspector\'s rows, and'])} \(p^*\) ${T_(['dans celui d\'une colonne quelconque du contribuable :', 'into that of either of the taxpayer\'s columns:'])} \(U_C^*=${A[0][0]}\times ${n4(M.q)}+${A[0][1]}\times ${n4(1 - M.q)}=${fqa(D.U1)}\) ${T_(['et', 'and'])} \(U_F^*=${B[0][0]}\times ${n4(M.p)}+${B[1][0]}\times ${n4(1 - M.p)}=${fqa(D.U2)}\). ${T_(['La probabilité de fraude ne dépend que des gains du contrôleur : rendre les contrôles moins coûteux ne réduit pas la fraude à l\'équilibre, mais la fréquence des contrôles.', 'The probability of cheating only depends on the inspector\'s payoffs: making inspections cheaper does not reduce cheating in equilibrium, but the frequency of inspections.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La meilleure réponse du contrôleur est', 'The inspector\'s best response is'])} \(p=1\) ${T_(['ou', 'or'])} \(p=0\) ${T_(['selon que', 'depending on whether'])} \(q\) ${T_(['est d\'un côté ou de l\'autre de', 'is on one side or the other of'])} \(q^*\), ${T_(['et tout', 'and any'])} \(p\) ${T_(['en', 'at'])} \(q=q^*\) ; ${T_(['de même pour le contribuable autour de', 'likewise for the taxpayer around'])} \(p^*\). ${T_(['Les deux correspondances ne se coupent qu\'en un point, à l\'intérieur du carré :', 'The two correspondences only cross at one point, inside the square:'])} \((q^*\,;\,p^*)=(${n4(M.q)}\,;\,${n4(M.p)})\).</p>
  <div class="sol-fig">${j4brc(A, B, [L.r, L.c], lang, 420)}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si l\'autre dévie, continuer rapporte', 'If the other swerves, going straight pays'])} \(${w}\) ${T_(['contre', 'against'])} \(${t}\) ; ${T_(['s\'il continue, dévier rapporte', 'if they go straight, swerving pays'])} \(${l}\) ${T_(['contre', 'against'])} \(${-k}\). ${T_(['Les équilibres purs sont donc', 'The pure equilibria are therefore'])} (${ch[1]}, ${ch[0]}) ${T_(['et', 'and'])} (${ch[0]}, ${ch[1]}). ${T_(['Pour l\'équilibre mixte, notons', 'For the mixed equilibrium, let'])} \(q\) ${T_(['la probabilité que le conducteur 2 dévie ; le conducteur 1 est indifférent si :', 'be the probability that driver 2 swerves; driver 1 is indifferent if:'])}
  \[${t}\,q+${l < 0 ? '(' + l + ')' : l}\,(1-q)=${w}\,q-${k}\,(1-q)\iff q^*=\frac{${-k}-${l < 0 ? '(' + l + ')' : l}}{${t}-${l < 0 ? '(' + l + ')' : l}-${w}-${k}}=${fqa(CM.q)}\]
  ${T_(['Par symétrie,', 'By symmetry,'])} \(p^*=${fqa(CM.p)}\). ${T_(['Chacun continue avec probabilité', 'Each goes straight with probability'])} \(1-q^*=${fqa(1 - CM.q)}\). ${T_(['Les tirages étant indépendants, l\'accident, qui se produit quand les deux continuent, a lieu avec probabilité', 'Draws being independent, a crash, which happens when both go straight, occurs with probability'])} \((1-p^*)(1-q^*)=${fqa(D.crash)}\). ${T_(['Le gain espéré de chacun est', 'Each one\'s expected payoff is'])} \(${n4(D.CU)}\), ${T_(['inférieur à celui de la coopération mutuelle', 'below that of mutual swerving'])} (${t}).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les correspondances se coupent en trois points : les deux coins des équilibres purs et le point intérieur de l\'équilibre mixte.', 'The correspondences cross at three points: the two corners of the pure equilibria and the interior point of the mixed equilibrium.'])}</p>
  <div class="sol-fig">${j4brc(D.CA, D.CB, [ch, ch], lang, 420)}</div>
  <p>${T_(['Si le coût de l\'accident', 'If the cost of a crash'])} \(k\) ${T_(['augmente, la probabilité de dévier', 'rises, the probability of swerving'])} \(q^*=\frac{k+${l}}{k+${l}+${w}-${t}}\) ${T_(['se rapproche de 1 : chacun continue moins souvent, ce qui maintient l\'autre indifférent malgré le danger accru. La probabilité d\'accident', 'approaches 1: each goes straight less often, which keeps the other indifferent despite the greater danger. The probability of a crash'])} \((1-q^*)^2\) ${T_(['diminue.', 'falls.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j4sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j4sol(D, 'en'))(D));