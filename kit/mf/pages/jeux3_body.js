I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 3 – Équilibre de Nash en stratégies pures', 'k-h1': 'Équilibre de Nash en stratégies pures', 'k-coursetitle': 'Meilleures réponses mutuelles : coordination, bataille des sexes, poule mouillée et équilibres multiples', 'k-extitle': 'Trouver les équilibres de Nash d\'un jeu fini', 'k-soltitle': 'Trouver les équilibres de Nash d\'un jeu fini' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 3 – Pure-strategy Nash equilibrium', 'k-h1': 'Pure-strategy Nash equilibrium', 'k-coursetitle': 'Mutual best responses: coordination, battle of the sexes, chicken and multiple equilibria', 'k-extitle': 'Finding the Nash equilibria of a finite game', 'k-soltitle': 'Finding the Nash equilibria of a finite game' });

/* ---------- jeux classiques ---------- */
const J3_GAMES = {
  pd: { U1: [[3, 0], [5, 1]], U2: [[3, 5], [0, 1]], fr: [['Coopérer', 'Dénoncer'], ['Coopérer', 'Dénoncer']], en: [['Cooperate', 'Denounce'], ['Cooperate', 'Denounce']] },
  bos: { U1: [[2, 0], [0, 1]], U2: [[1, 0], [0, 2]], fr: [['Opéra', 'Football'], ['Opéra', 'Football']], en: [['Opera', 'Football'], ['Opera', 'Football']] },
  chicken: { U1: [[0, -1], [1, -10]], U2: [[0, 1], [-1, -10]], fr: [['Dévier', 'Continuer'], ['Dévier', 'Continuer']], en: [['Swerve', 'Straight'], ['Swerve', 'Straight']] },
  stag: { U1: [[4, 0], [3, 3]], U2: [[4, 3], [0, 3]], fr: [['Cerf', 'Lièvre'], ['Cerf', 'Lièvre']], en: [['Stag', 'Hare'], ['Stag', 'Hare']] },
  mp: { U1: [[1, -1], [-1, 1]], U2: [[-1, 1], [1, -1]], fr: [['Pile', 'Face'], ['Pile', 'Face']], en: [['Heads', 'Tails'], ['Heads', 'Tails']] }
};

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez définir un équilibre de Nash, trouver tous les équilibres en stratégies pures d'un jeu fini par la méthode des meilleures réponses, reconnaître les grandes familles de jeux à deux stratégies (dilemme du prisonnier, coordination, bataille des sexes, poule mouillée, pile ou face) et discuter le choix entre plusieurs équilibres.<br><br>
<strong>Pourquoi ?</strong> L'équilibre de Nash est le concept central de la théorie des jeux : un profil de stratégies dont aucun joueur ne souhaite s'écarter seul. Il prolonge l'équilibre en stratégies dominantes et l'élimination répétée, et s'applique à tous les modèles d'oligopole vus en économie industrielle.<br><br>
<strong>Prérequis.</strong> Théorie des jeux 1 et 2.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Définition</a> · <a href="#s2">2. Méthode</a> · <a href="#s3">3. Les grands jeux</a> · <a href="#s4">4. Jeux symétriques</a> · <a href="#s5">5. Plusieurs équilibres</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Définition</div>
<p>Un profil \(s^*=(s_1^*,\ldots,s_n^*)\) est un <em>équilibre de Nash</em> si la stratégie de chaque joueur est une meilleure réponse aux stratégies des autres :
\[u_i(s_i^*,s_{-i}^*)\ge u_i(s_i,s_{-i}^*)\quad\text{pour tout joueur }i\text{ et toute stratégie }s_i\]
Aucun joueur n'a intérêt à changer de stratégie, seul, en supposant que les autres maintiennent la leur. Un équilibre en stratégies dominantes est un équilibre de Nash ; l'issue d'une élimination répétée réussie aussi. Mais un équilibre de Nash n'exige pas de stratégie dominante : il suffit que chaque stratégie soit la meilleure face aux stratégies effectivement jouées par les autres.</p>

<div class="dossier-title" id="s2">2. La méthode des meilleures réponses</div>
<p>Dans une matrice, on souligne, colonne par colonne, le plus grand gain du joueur 1, et, ligne par ligne, le plus grand gain du joueur 2. Les cases où les deux gains sont soulignés sont exactement les équilibres de Nash en stratégies pures. Un jeu peut en avoir un, plusieurs ou aucun ; dans ce dernier cas, on cherche un équilibre en stratégies mixtes (Théorie des jeux 4).</p>
<div class="ifig" data-fig="classic"></div>
<div class="fig-cap">Figure 1 — Les grands jeux à deux joueurs et deux stratégies, avec les meilleures réponses soulignées et les équilibres de Nash colorés. Le dilemme du prisonnier a un équilibre inefficace ; la bataille des sexes et la chasse au cerf en ont deux ; la poule mouillée en a deux asymétriques ; pile ou face n'en a aucun en stratégies pures.</div>

<div class="dossier-title" id="s3">3. Les grands jeux</div>
<ul class="kit-simple">
<li><em>Bataille des sexes</em> : deux partenaires veulent passer la soirée ensemble, mais l'un préfère l'opéra et l'autre le football. Deux équilibres, chacun favorable à l'un des joueurs : il faut se coordonner, mais sur quoi ?</li>
<li><em>Chasse au cerf</em> : chasser le cerf ensemble rapporte le plus, mais chasser le lièvre seul est sans risque. Deux équilibres, l'un efficace et risqué, l'autre sûr et inefficace : un problème de confiance.</li>
<li><em>Poule mouillée</em> : deux conducteurs foncent l'un vers l'autre ; celui qui dévie perd la face, mais si aucun ne dévie, c'est la catastrophe. Deux équilibres asymétriques, où l'un des deux cède.</li>
<li><em>Pile ou face</em> : l'un veut que les pièces coïncident, l'autre non. Aucun équilibre en stratégies pures : chacun veut surprendre l'autre.</li>
</ul>

<div class="dossier-title" id="s4">4. Jeux symétriques à deux stratégies</div>
<p>Dans un jeu symétrique, les deux joueurs ont les mêmes stratégies A et B, et le gain du joueur 1 en \((s,s')\) est celui du joueur 2 en \((s',s)\). Notons \(a\), \(b\), \(c\), \(d\) les gains du joueur 1 en (A, A), (A, B), (B, A), (B, B). La nature du jeu dépend du signe de \(x=a-c\) (gain à jouer A face à A) et de \(y=d-b\) (gain à jouer B face à B) : si \(x\) et \(y\) sont positifs, c'est un jeu de coordination, avec deux équilibres symétriques ; s'ils sont négatifs, un jeu d'anti-coordination comme la poule mouillée, avec deux équilibres asymétriques et aucun équilibre symétrique en stratégies pures ; s'ils sont de signes opposés, l'une des stratégies est strictement dominante.</p>
<div class="ifig" data-fig="sym"></div>
<div class="fig-cap">Figure 2 — Classement des jeux symétriques à deux stratégies selon \(x=a-c\) et \(y=d-b\). Faites varier les gains : le point se déplace d'un quadrant à l'autre, et la matrice affichée en lecture change de nature.</div>

<div class="dossier-title" id="s5">5. Choisir entre plusieurs équilibres</div>
<p>Quand un jeu a plusieurs équilibres, la théorie seule ne dit pas lequel sera joué. Plusieurs critères aident à trancher : un équilibre qui domine les autres au sens de Pareto est un bon candidat, mais pas toujours (dans la chasse au cerf, l'équilibre efficace est aussi le plus risqué) ; un équilibre peut être <em>focal</em> (Schelling), saillant par la culture ou l'histoire ; la communication préalable ou un ordre de jeu (l'un choisit d'abord, Théorie des jeux 5) peuvent aussi sélectionner un équilibre.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Équilibre de Nash : chaque joueur joue une meilleure réponse aux stratégies des autres ; aucun n'a intérêt à dévier seul.</li>
<li>Méthode : souligner les meilleures réponses ; les cases doublement soulignées sont les équilibres en stratégies pures.</li>
<li>Un jeu peut avoir zéro, un ou plusieurs équilibres en stratégies pures.</li>
<li>Jeu symétrique \(2\times 2\) : signes de \(a-c\) et \(d-b\) : coordination, anti-coordination ou stratégie dominante.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can define a Nash equilibrium, find all pure-strategy equilibria of a finite game with the best-response method, recognise the main families of two-strategy games (prisoner's dilemma, coordination, battle of the sexes, chicken, matching pennies) and discuss the choice between several equilibria.<br><br>
<strong>Why?</strong> Nash equilibrium is the central concept of game theory: a strategy profile from which no player wants to deviate alone. It extends equilibrium in dominant strategies and iterated elimination, and applies to all the oligopoly models seen in industrial economics.<br><br>
<strong>Prerequisites.</strong> Game theory 1 and 2.
</div>
<p class="toc">Contents: <a href="#s1">1. Definition</a> · <a href="#s2">2. Method</a> · <a href="#s3">3. The main games</a> · <a href="#s4">4. Symmetric games</a> · <a href="#s5">5. Several equilibria</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Definition</div>
<p>A profile \(s^*=(s_1^*,\ldots,s_n^*)\) is a <em>Nash equilibrium</em> if each player's strategy is a best response to the others' strategies:
\[u_i(s_i^*,s_{-i}^*)\ge u_i(s_i,s_{-i}^*)\quad\text{for every player }i\text{ and every strategy }s_i\]
No player wants to change strategy alone, assuming the others keep theirs. An equilibrium in dominant strategies is a Nash equilibrium; so is the outcome of a successful iterated elimination. But a Nash equilibrium does not require dominant strategies: it suffices that each strategy is the best against the strategies actually played by the others.</p>

<div class="dossier-title" id="s2">2. The best-response method</div>
<p>In a matrix, underline, column by column, player 1's highest payoff, and, row by row, player 2's highest payoff. The cells where both payoffs are underlined are exactly the pure-strategy Nash equilibria. A game may have one, several or none; in the latter case, one looks for a mixed-strategy equilibrium (Game theory 4).</p>
<div class="ifig" data-fig="classic"></div>
<div class="fig-cap">Figure 1 — The main two-player two-strategy games, with best responses underlined and Nash equilibria shaded. The prisoner's dilemma has an inefficient equilibrium; the battle of the sexes and the stag hunt have two; chicken has two asymmetric ones; matching pennies has none in pure strategies.</div>

<div class="dossier-title" id="s3">3. The main games</div>
<ul class="kit-simple">
<li><em>Battle of the sexes</em>: two partners want to spend the evening together, but one prefers the opera and the other football. Two equilibria, each favouring one player: they must coordinate, but on what?</li>
<li><em>Stag hunt</em>: hunting the stag together pays most, but hunting a hare alone is safe. Two equilibria, one efficient and risky, the other safe and inefficient: a problem of trust.</li>
<li><em>Chicken</em>: two drivers race towards each other; whoever swerves loses face, but if neither swerves, disaster strikes. Two asymmetric equilibria, where one of them gives way.</li>
<li><em>Matching pennies</em>: one wants the coins to match, the other does not. No pure-strategy equilibrium: each wants to surprise the other.</li>
</ul>

<div class="dossier-title" id="s4">4. Symmetric two-strategy games</div>
<p>In a symmetric game, both players have the same strategies A and B, and player 1's payoff at \((s,s')\) is player 2's payoff at \((s',s)\). Let \(a\), \(b\), \(c\), \(d\) be player 1's payoffs at (A, A), (A, B), (B, A), (B, B). The nature of the game depends on the sign of \(x=a-c\) (gain from playing A against A) and \(y=d-b\) (gain from playing B against B): if \(x\) and \(y\) are positive, it is a coordination game, with two symmetric equilibria; if they are negative, an anti-coordination game like chicken, with two asymmetric equilibria and no symmetric pure-strategy equilibrium; if they have opposite signs, one strategy is strictly dominant.</p>
<div class="ifig" data-fig="sym"></div>
<div class="fig-cap">Figure 2 — Classification of symmetric two-strategy games by \(x=a-c\) and \(y=d-b\). Vary the payoffs: the point moves from one quadrant to another, and the matrix shown in the reading changes nature.</div>

<div class="dossier-title" id="s5">5. Choosing between several equilibria</div>
<p>When a game has several equilibria, theory alone does not say which will be played. Several criteria help: an equilibrium that Pareto-dominates the others is a good candidate, but not always (in the stag hunt, the efficient equilibrium is also the riskiest); an equilibrium may be <em>focal</em> (Schelling), salient through culture or history; prior communication or an order of play (one chooses first, Game theory 5) may also select an equilibrium.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Nash equilibrium: each player plays a best response to the others' strategies; none wants to deviate alone.</li>
<li>Method: underline best responses; doubly underlined cells are the pure-strategy equilibria.</li>
<li>A game may have zero, one or several pure-strategy equilibria.</li>
<li>Symmetric \(2\times 2\) game: signs of \(a-c\) and \(d-b\): coordination, anti-coordination or dominant strategy.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { game: 'Jeu', gpd: 'Dilemme du prisonnier', gbos: 'Bataille des sexes', gchicken: 'Poule mouillée', gstag: 'Chasse au cerf', gmp: 'Pile ou face', p1: 'Joueur 1', p2: 'Joueur 2',
  clRead: (g, ne) => `Équilibres de Nash en stratégies pures : ${ne.length ? ne.map(e => '(' + J3_GAMES[g].fr[0][e[0]] + ', ' + J3_GAMES[g].fr[1][e[1]] + ')').join(' et ') : 'aucun'}.`,
  a: 'a : gain en (A, A)', b: 'b : gain en (A, B)', c: 'c : gain en (B, A)', d: 'd : gain en (B, B)', symAria: 'Classement des jeux symétriques', coord: 'coordination', anti: 'anti-coordination', domA: 'A dominante', domB: 'B dominante',
  symRead: (x, y, ne) => `<i>x</i> = ${x}, <i>y</i> = ${y} : ` + (x > 0 && y > 0 ? 'jeu de coordination' : x < 0 && y < 0 ? 'jeu d\'anti-coordination' : x > 0 && y < 0 ? 'A est strictement dominante' : x < 0 && y > 0 ? 'B est strictement dominante' : 'cas limite (égalité)') + ` ; équilibres : ${ne.map(e => '(' + 'AB'[e[0]] + ', ' + 'AB'[e[1]] + ')').join(', ') || 'aucun'}.` };
I18N.en.f = { game: 'Game', gpd: 'Prisoner\'s dilemma', gbos: 'Battle of the sexes', gchicken: 'Chicken', gstag: 'Stag hunt', gmp: 'Matching pennies', p1: 'Player 1', p2: 'Player 2',
  clRead: (g, ne) => `Pure-strategy Nash equilibria: ${ne.length ? ne.map(e => '(' + J3_GAMES[g].en[0][e[0]] + ', ' + J3_GAMES[g].en[1][e[1]] + ')').join(' and ') : 'none'}.`,
  a: 'a: payoff at (A, A)', b: 'b: payoff at (A, B)', c: 'c: payoff at (B, A)', d: 'd: payoff at (B, B)', symAria: 'Classification of symmetric games', coord: 'coordination', anti: 'anti-coordination', domA: 'A dominant', domB: 'B dominant',
  symRead: (x, y, ne) => `<i>x</i> = ${x}, <i>y</i> = ${y}: ` + (x > 0 && y > 0 ? 'coordination game' : x < 0 && y < 0 ? 'anti-coordination game' : x > 0 && y < 0 ? 'A is strictly dominant' : x < 0 && y > 0 ? 'B is strictly dominant' : 'limit case (tie)') + `; equilibria: ${ne.map(e => '(' + 'AB'[e[0]] + ', ' + 'AB'[e[1]] + ')').join(', ') || 'none'}.` };
FIGS.classic = {
  state: { g: 'bos' },
  controls: L => [{ key: 'g', type: 'select', label: L.f.game, options: ['pd', 'bos', 'stag', 'chicken', 'mp'].map(k => ({ v: k, t: L.f['g' + k] })) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, G = J3_GAMES[s.g], lab = G[lang], B = jxBR(G.U1, G.U2);
    return { svg: jxMatrixSVG(G.U1, G.U2, { rows: lab[0], cols: lab[1], p1: L.p1, p2: L.p2, br: true, ne: true, cw: 130, aria: L['g' + s.g] }), read: L.clRead(s.g, B.ne) };
  }
};
FIGS.sym = {
  state: { a: 4, b: 0, c: 3, d: 3 },
  controls: L => ['a', 'b', 'c', 'd'].map(k => ({ key: k, label: L.f[k], min: -3, max: 6, step: 1, fmt: v => String(v) })),
  draw: function (s, lang) {
    const L = I18N[lang].f, x = s.a - s.c, y = s.d - s.b, U1 = [[s.a, s.b], [s.c, s.d]], U2 = [[s.a, s.c], [s.b, s.d]], B = jxBR(U1, U2);
    const G = Plot({ w: 480, h: 400, x0: -9, x1: 9, y0: -9, y1: 9, mt: 20, mb: 42, ml: 46 });
    G.add(`<rect x="${G.X(0)}" y="${G.Y(9)}" width="${G.X(9) - G.X(0)}" height="${G.Y(0) - G.Y(9)}" fill="${COL.s1}" fill-opacity="0.1"/>`);
    G.add(`<rect x="${G.X(-9)}" y="${G.Y(0)}" width="${G.X(0) - G.X(-9)}" height="${G.Y(-9) - G.Y(0)}" fill="${COL.s3}" fill-opacity="0.1"/>`);
    G.axes({ xt: [-8, -4, 0, 4, 8], yt: [-8, -4, 0, 4, 8], xl: 'x = a − c', yl: 'y = d − b', xf: v => String(v), yf: v => String(v), xAxisAt: 0 });
    G.seg(0, -9, 0, 9, { c: COL.axis, w: 1 });
    G.text(4.5, 7.5, L.coord, { size: 12, c: COL.s1, bold: true }); G.text(-4.5, -7.5, L.anti, { size: 12, c: COL.s3, bold: true });
    G.text(4.5, -7.5, L.domA, { size: 12, c: COL.mute }); G.text(-4.5, 7.5, L.domB, { size: 12, c: COL.mute });
    G.dot(x, y, { c: COL.ink, r: 7 });
    return { svg: G.svg(L.symAria), read: L.symRead(x, y, B.ne) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  /* jeu A : 3 x 3 avec deux équilibres de Nash en stratégies pures, meilleures réponses uniques */
  for (;;) {
    D.U1 = [0, 1, 2].map(() => [0, 1, 2].map(() => rint(0, 9))); D.U2 = [0, 1, 2].map(() => [0, 1, 2].map(() => rint(0, 9)));
    const uniq = [0, 1, 2].every(j => { const col = D.U1.map(r => r[j]); return col.filter(v => v === Math.max(...col)).length === 1; }) && D.U2.every(r => r.filter(v => v === Math.max(...r)).length === 1);
    if (!uniq) continue;
    D.B = jxBR(D.U1, D.U2);
    if (D.B.ne.length !== 2) continue;
    const [e, f] = D.B.ne, pe = [D.U1[e[0]][e[1]], D.U2[e[0]][e[1]]], pf = [D.U1[f[0]][f[1]], D.U2[f[0]][f[1]]];
    D.pareto = (pe[0] >= pf[0] && pe[1] >= pf[1]) ? 0 : (pf[0] >= pe[0] && pf[1] >= pe[1]) ? 1 : -1;
    break;
  }
  /* jeu B : poule mouillée */
  for (;;) { D.w = rint(3, 8); D.t = rint(1, 5); D.l = rint(-3, 2); D.k = rint(5, 12); if (D.w > D.t && D.t > D.l && D.l > -D.k) break; }
  D.C1 = [[D.t, D.l], [D.w, -D.k]]; D.C2 = [[D.t, D.w], [D.l, -D.k]];
  return D;
};
const J3L = { fr: { rows: ['H', 'M', 'B'], cols: ['G', 'C', 'D'], ch: ['Dévier', 'Continuer'] }, en: { rows: ['U', 'M', 'D'], cols: ['L', 'C', 'R'], ch: ['Swerve', 'Straight'] } };
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J3L.fr;
  return String.raw`<div class="context-block">Les deux jeux sont indépendants. Dans chaque case, le premier nombre est le gain du joueur en ligne, le second celui du joueur en colonne.</div>
<p><strong>Jeu A.</strong> Le joueur 1 choisit H, M ou B ; le joueur 2 choisit G, C ou D.</p>
${jxTable(D.U1, D.U2, L.rows, L.cols, '1 \\ 2')}
<p><strong>Jeu B.</strong> Deux conducteurs foncent l'un vers l'autre et choisissent simultanément de dévier ou de continuer.</p>
${jxTable(D.C1, D.C2, L.ch, L.ch, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">(A) Déterminez la meilleure réponse du joueur 1 à chaque stratégie du joueur 2, puis la meilleure réponse du joueur 2 à chaque stratégie du joueur 1.</div></li>
<li><div class="q-text">(A) Déduisez-en tous les équilibres de Nash en stratégies pures, et représentez la matrice en soulignant les meilleures réponses.</div></li>
<li><div class="q-text">(A) Comparez les équilibres du point de vue des joueurs. Peut-on prédire lequel sera joué ?</div></li>
<li><div class="q-text">(B) Déterminez les équilibres de Nash en stratégies pures. Existe-t-il un équilibre symétrique en stratégies pures ? Situez ce jeu dans le classement des jeux symétriques.</div></li>
<li><div class="q-text">(B) Le conducteur 1 peut s'engager, avant le jeu, à continuer quoi qu'il arrive (en arrachant son volant, par exemple), et le conducteur 2 le voit. Quelle est alors l'issue du jeu ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J3L.en;
  return String.raw`<div class="context-block">The two games are independent. In each cell, the first number is the row player's payoff, the second the column player's.</div>
<p><strong>Game A.</strong> Player 1 chooses U, M or D; player 2 chooses L, C or R.</p>
${jxTable(D.U1, D.U2, L.rows, L.cols, '1 \\ 2')}
<p><strong>Game B.</strong> Two drivers race towards each other and simultaneously choose to swerve or go straight.</p>
${jxTable(D.C1, D.C2, L.ch, L.ch, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">(A) Determine player 1's best response to each strategy of player 2, then player 2's best response to each strategy of player 1.</div></li>
<li><div class="q-text">(A) Deduce all the pure-strategy Nash equilibria, and draw the matrix underlining the best responses.</div></li>
<li><div class="q-text">(A) Compare the equilibria from the players' point of view. Can we predict which one will be played?</div></li>
<li><div class="q-text">(B) Determine the pure-strategy Nash equilibria. Is there a symmetric pure-strategy equilibrium? Place this game in the classification of symmetric games.</div></li>
<li><div class="q-text">(B) Driver 1 can commit, before the game, to go straight whatever happens (by tearing off the steering wheel, for instance), and driver 2 sees it. What is the outcome of the game then?</div></li>
</ol></div>`;
});
function j3sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J3L[lang], U1 = D.U1, U2 = D.U2, B = D.B;
  const br1 = [0, 1, 2].map(j => { const col = U1.map(r => r[j]), mx = Math.max(...col), i = col.indexOf(mx); return `${T_(['face à', 'against'])} ${L.cols[j]}, ${T_(['le joueur 1 obtient', 'player 1 gets'])} ${col.join(', ')} ${T_(['avec', 'with'])} ${L.rows.join(', ')} : ${T_(['sa meilleure réponse est', 'their best response is'])} ${L.rows[i]}`; }).join(' ; ');
  const br2 = [0, 1, 2].map(i => { const row = U2[i], mx = Math.max(...row), j = row.indexOf(mx); return `${T_(['face à', 'against'])} ${L.rows[i]}, ${T_(['le joueur 2 obtient', 'player 2 gets'])} ${row.join(', ')} ${T_(['avec', 'with'])} ${L.cols.join(', ')} : ${T_(['sa meilleure réponse est', 'their best response is'])} ${L.cols[j]}`; }).join(' ; ');
  const [e, f] = B.ne, nm = x => `(${L.rows[x[0]]}, ${L.cols[x[1]]})`, pay = x => `\\((${U1[x[0]][x[1]]}\\,;\\,${U2[x[0]][x[1]]})\\)`;
  const x = D.t - D.w, y = -D.k - D.l, ch = L.ch;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Pour le joueur 1, on fixe la colonne choisie par le joueur 2 et l\'on compare ses gains dans cette colonne :', 'For player 1, fix the column chosen by player 2 and compare their payoffs in that column:'])} ${br1}.</p>
  <p>${T_(['Pour le joueur 2, on fixe la ligne choisie par le joueur 1 et l\'on compare ses gains dans cette ligne :', 'For player 2, fix the row chosen by player 1 and compare their payoffs in that row:'])} ${br2}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Un équilibre de Nash est un profil où chaque stratégie est la meilleure réponse à l\'autre. On cherche donc les cases où la stratégie du joueur 1 est sa meilleure réponse à la colonne et où celle du joueur 2 est sa meilleure réponse à la ligne. D\'après la question 1, il y en a deux :', 'A Nash equilibrium is a profile where each strategy is the best response to the other. We therefore look for the cells where player 1\'s strategy is their best response to the column and player 2\'s is their best response to the row. From question 1, there are two:'])} ${nm(e)}, ${T_(['de gains', 'with payoffs'])} ${pay(e)}, ${T_(['et', 'and'])} ${nm(f)}, ${T_(['de gains', 'with payoffs'])} ${pay(f)}. ${T_(['Dans la matrice, ce sont les deux cases dont les deux gains sont soulignés :', 'In the matrix, these are the two cells whose two payoffs are underlined:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(U1, U2, { rows: L.rows, cols: L.cols, p1: T_(['Joueur 1', 'Player 1']), p2: T_(['Joueur 2', 'Player 2']), br: true, ne: true, aria: 'A' })}</div>
</div></li>
<li><div class="q-content">
  <p>${D.pareto >= 0 ? T_(['L\'équilibre', 'Equilibrium']) + ' ' + nm(D.pareto === 0 ? e : f) + ' ' + T_(['domine l\'autre au sens de Pareto : les deux joueurs y gagnent au moins autant. C\'est un candidat naturel, surtout si les joueurs peuvent communiquer avant de jouer ; mais rien dans la définition de l\'équilibre de Nash ne garantit qu\'il sera choisi : si chacun s\'attend à ce que l\'autre joue l\'autre équilibre, il n\'a pas intérêt à dévier seul.', 'Pareto-dominates the other: both players gain at least as much there. It is a natural candidate, especially if players can communicate before playing; but nothing in the definition of Nash equilibrium guarantees that it will be chosen: if each expects the other to play the other equilibrium, neither wants to deviate alone.']) : T_(['Aucun équilibre ne domine l\'autre au sens de Pareto : le joueur 1 préfère l\'un, le joueur 2 l\'autre, comme dans la bataille des sexes. La théorie ne permet pas de prédire lequel sera joué ; un point focal, une communication préalable ou un ordre de jeu peuvent départager.', 'Neither equilibrium Pareto-dominates the other: player 1 prefers one, player 2 the other, as in the battle of the sexes. Theory does not predict which one will be played; a focal point, prior communication or an order of play may decide.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si le conducteur 2 dévie, le conducteur 1 obtient', 'If driver 2 swerves, driver 1 gets'])} ${D.t} ${T_(['en déviant et', 'by swerving and'])} ${D.w} ${T_(['en continuant : sa meilleure réponse est de continuer. Si le conducteur 2 continue, il obtient', 'by going straight: their best response is to go straight. If driver 2 goes straight, they get'])} ${D.l} ${T_(['en déviant et', 'by swerving and'])} \(${-D.k}\) ${T_(['en continuant : sa meilleure réponse est de dévier. Le jeu étant symétrique, il en va de même pour le conducteur 2. Les équilibres de Nash sont donc', 'by going straight: their best response is to swerve. The game being symmetric, the same holds for driver 2. The Nash equilibria are therefore'])} (${ch[1]}, ${ch[0]}) ${T_(['et', 'and'])} (${ch[0]}, ${ch[1]}) : ${T_(['l\'un continue, l\'autre cède. Aucun équilibre n\'est symétrique en stratégies pures. Avec', 'one goes straight, the other gives way. No equilibrium is symmetric in pure strategies. With'])} \(a=${D.t}\), \(b=${D.l}\), \(c=${D.w}\), \(d=${-D.k}\), ${T_(['on a', 'we have'])} \(x=a-c=${x}&lt;0\) ${T_(['et', 'and'])} \(y=d-b=${y}&lt;0\) : ${T_(['c\'est un jeu d\'anti-coordination.', 'it is an anti-coordination game.'])}</p>
  <div class="sol-fig">${jxMatrixSVG(D.C1, D.C2, { rows: ch, cols: ch, p1: T_(['Conducteur 1', 'Driver 1']), p2: T_(['Conducteur 2', 'Driver 2']), br: true, ne: true, cw: 130, aria: 'B' })}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si le conducteur 1 s\'engage à continuer de façon visible et irréversible, le conducteur 2 ne choisit plus que sa meilleure réponse à « continuer » : dévier, qui lui rapporte', 'If driver 1 commits visibly and irreversibly to going straight, driver 2 only chooses their best response to "straight": swerving, which pays them'])} ${D.l}, ${T_(['plutôt que', 'rather than'])} \(${-D.k}\). ${T_(['L\'issue est', 'The outcome is'])} (${ch[1]}, ${ch[0]}), ${T_(['l\'équilibre le plus favorable au conducteur 1, qui obtient', 'the equilibrium most favourable to driver 1, who gets'])} ${D.w}. ${T_(['En se privant d\'une option, il améliore sa position : c\'est la valeur stratégique de l\'engagement, que l\'on retrouve dans le modèle de Stackelberg et que les jeux séquentiels formalisent.', 'By giving up an option, they improve their position: this is the strategic value of commitment, found in the Stackelberg model and formalised by sequential games.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j3sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j3sol(D, 'en'))(D));