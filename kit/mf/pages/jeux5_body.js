I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 5 – Jeux séquentiels', 'k-h1': 'Jeux séquentiels et induction à rebours', 'k-coursetitle': 'Forme extensive, stratégies conditionnelles, menaces non crédibles et équilibre parfait en sous-jeux', 'k-extitle': 'Forme extensive, forme normale et équilibre parfait', 'k-soltitle': 'Forme extensive, forme normale et équilibre parfait' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 5 – Sequential games', 'k-h1': 'Sequential games and backward induction', 'k-coursetitle': 'Extensive form, contingent strategies, non-credible threats and subgame perfect equilibrium', 'k-extitle': 'Extensive form, normal form and perfect equilibrium', 'k-soltitle': 'Extensive form, normal form and perfect equilibrium' });

/* ---------- jeu à deux étapes : 1 choisit H ou B, 2 observe et choisit g ou d ---------- */
/* P[k][m] : gains (u1, u2) après l'action k du joueur 1 et l'action m du joueur 2 */
function j5tree(P, L) {
  return { pl: 1, ch: [0, 1].map(k => ({ a: L.a1[k], n: { pl: 2, ch: [0, 1].map(m => ({ a: L.a2[m], n: { u: P[k][m] } })) } })) };
}
/* forme normale : stratégies du joueur 2 = (action après H, action après B) */
function j5normal(P) {
  const S2 = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const U1 = [0, 1].map(k => S2.map(s => P[k][s[k]][0])), U2 = [0, 1].map(k => S2.map(s => P[k][s[k]][1]));
  return { S2: S2, U1: U1, U2: U2 };
}
const J5_EX = [[[3, 1], [1, 0]], [[2, 3], [0, 2]]];
const J5L = { fr: { a1: ['H', 'B'], a2: ['g', 'd'], p1: 'Joueur 1', p2: 'Joueur 2' }, en: { a1: ['U', 'D'], a2: ['l', 'r'], p1: 'Player 1', p2: 'Player 2' } };
const j5s2 = (s, L) => `(${L.a2[s[0]]}, ${L.a2[s[1]]})`;

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez représenter un jeu séquentiel par un arbre, écrire les stratégies d'un joueur comme des plans d'action complets, passer de la forme extensive à la forme normale, trouver les équilibres de Nash, puis l'équilibre parfait en sous-jeux par induction à rebours, et repérer les menaces non crédibles.<br><br>
<strong>Pourquoi ?</strong> Dans beaucoup d'interactions, les joueurs agissent l'un après l'autre et observent les choix passés : leader et suiveur sur un marché, négociation, entrée d'un concurrent. L'ordre de jeu change l'issue, et certaines menaces, crédibles en apparence, ne seraient jamais exécutées.<br><br>
<strong>Prérequis.</strong> Équilibre de Nash (Théorie des jeux 3), Stackelberg (Économie industrielle 4).
</div>
<p class="toc">Sommaire : <a href="#s1">1. La forme extensive</a> · <a href="#s2">2. Stratégies</a> · <a href="#s3">3. Forme normale et équilibres de Nash</a> · <a href="#s4">4. Menaces non crédibles</a> · <a href="#s5">5. Induction à rebours</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La forme extensive</div>
<p>Un jeu séquentiel se représente par un <em>arbre</em>. Chaque nœud de décision indique le joueur qui doit jouer ; chaque branche qui en part est une action possible ; chaque feuille, au bout d'un chemin, porte les gains des joueurs. On suppose ici l'<em>information parfaite</em> : chaque joueur, au moment de jouer, connaît toutes les actions déjà choisies. Dans l'exemple ci-dessous, le joueur 1 choisit H ou B, puis le joueur 2, qui a observé ce choix, choisit g ou d.</p>
<div class="ifig" data-fig="tree"></div>
<div class="fig-cap">Figure 1 — Arbre du jeu. En activant l'induction à rebours, on colore à chaque nœud du joueur 2 l'action qu'il choisit, puis le choix du joueur 1 qui l'anticipe ; le chemin épais est l'issue de l'équilibre parfait en sous-jeux.</div>

<div class="dossier-title" id="s2">2. Stratégies : des plans complets</div>
<p>Dans un jeu séquentiel, une <em>stratégie</em> est un plan d'action complet : elle indique ce que le joueur ferait à chacun de ses nœuds de décision, y compris ceux qui ne seront pas atteints. Le joueur 2 a ici deux nœuds, avec deux actions à chacun : il a donc \(2\times 2=4\) stratégies, notées (action après H, action après B) : (g, g), (g, d), (d, g) et (d, d). Le joueur 1, qui n'a qu'un nœud, a deux stratégies. Cette distinction entre action et stratégie est essentielle pour comprendre les menaces.</p>

<div class="dossier-title" id="s3">3. Forme normale et équilibres de Nash</div>
<p>À chaque couple de stratégies correspond un chemin dans l'arbre et donc des gains : on peut écrire le jeu sous forme normale, ici une matrice \(2\times 4\). On y cherche les équilibres de Nash par la méthode des meilleures réponses. Un jeu séquentiel a souvent plusieurs équilibres de Nash, dont certains reposent sur des actions que le joueur n'aurait aucun intérêt à jouer si le nœud correspondant était atteint.</p>
<div class="ifig" data-fig="nf"></div>
<div class="fig-cap">Figure 2 — Forme normale du jeu de la figure 1. Trois cases sont des équilibres de Nash. L'équilibre (B, (d, g)) repose sur la menace du joueur 2 de jouer d après H, qui lui rapporterait moins que g : elle n'est pas crédible.</div>

<div class="dossier-title" id="s4">4. Menaces non crédibles</div>
<p>Dans l'équilibre (B, (d, g)), le joueur 2 « menace » de répondre d à H, ce qui donnerait 1 au joueur 1 ; celui-ci préfère alors jouer B. Cette menace ne lui coûte rien, puisque le nœud après H n'est pas atteint. Mais si le joueur 1 jouait H, le joueur 2 gagnerait 1 en jouant g et 0 en jouant d : il ne mettrait pas sa menace à exécution. Le joueur 1, qui le sait, ne devrait pas y croire. Un équilibre de Nash peut donc reposer sur des comportements irrationnels hors du chemin d'équilibre.</p>

<div class="dossier-title" id="s5">5. Induction à rebours et équilibre parfait</div>
<p>Pour éliminer ces menaces, Selten (1965) exige que les stratégies forment un équilibre de Nash dans chaque <em>sous-jeu</em>, c'est-à-dire dans chaque partie de l'arbre qui commence à un nœud et contient tout ce qui le suit : c'est l'<em>équilibre parfait en sous-jeux</em>. Dans un jeu fini à information parfaite, on le trouve par <em>induction à rebours</em> : on part des derniers nœuds, on y choisit l'action optimale du joueur concerné, on remplace le nœud par les gains obtenus, et l'on remonte jusqu'à la racine. Dans l'exemple, le joueur 2 choisit g après H (1 &gt; 0) et g après B (3 &gt; 2) ; le joueur 1, qui l'anticipe, compare 3 et 2 et joue H. L'équilibre parfait est (H, (g, g)) ; c'est l'un des trois équilibres de Nash, le seul sans menace non crédible.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Forme extensive : arbre, nœuds de décision, actions, gains aux feuilles ; information parfaite si chaque joueur observe les actions passées.</li>
<li>Une stratégie précise une action à chaque nœud du joueur, même non atteint.</li>
<li>Un équilibre de Nash peut reposer sur des menaces non crédibles hors du chemin d'équilibre.</li>
<li>Équilibre parfait en sous-jeux : équilibre de Nash dans chaque sous-jeu ; on le trouve par induction à rebours.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can represent a sequential game by a tree, write a player's strategies as complete plans of action, move from the extensive form to the normal form, find the Nash equilibria, then the subgame perfect equilibrium by backward induction, and spot non-credible threats.<br><br>
<strong>Why?</strong> In many interactions, players act one after the other and observe past choices: leader and follower in a market, bargaining, a rival's entry. The order of play changes the outcome, and some threats, credible in appearance, would never be carried out.<br><br>
<strong>Prerequisites.</strong> Nash equilibrium (Game theory 3), Stackelberg (Industrial economics 4).
</div>
<p class="toc">Contents: <a href="#s1">1. The extensive form</a> · <a href="#s2">2. Strategies</a> · <a href="#s3">3. Normal form and Nash equilibria</a> · <a href="#s4">4. Non-credible threats</a> · <a href="#s5">5. Backward induction</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The extensive form</div>
<p>A sequential game is represented by a <em>tree</em>. Each decision node shows the player who must move; each branch leaving it is a possible action; each leaf, at the end of a path, carries the players' payoffs. We assume here <em>perfect information</em>: each player, when moving, knows all actions already chosen. In the example below, player 1 chooses U or D, then player 2, having observed this choice, chooses l or r.</p>
<div class="ifig" data-fig="tree"></div>
<div class="fig-cap">Figure 1 — Game tree. With backward induction switched on, each of player 2's nodes shows the action they choose, then player 1's choice anticipating it; the thick path is the outcome of the subgame perfect equilibrium.</div>

<div class="dossier-title" id="s2">2. Strategies: complete plans</div>
<p>In a sequential game, a <em>strategy</em> is a complete plan of action: it says what the player would do at each of their decision nodes, including those that will not be reached. Player 2 has two nodes here, with two actions at each: they therefore have \(2\times 2=4\) strategies, written (action after U, action after D): (l, l), (l, r), (r, l) and (r, r). Player 1, with a single node, has two strategies. This distinction between action and strategy is essential to understand threats.</p>

<div class="dossier-title" id="s3">3. Normal form and Nash equilibria</div>
<p>Each pair of strategies determines a path in the tree and hence payoffs: the game can be written in normal form, here a \(2\times 4\) matrix. Nash equilibria are found there with the best-response method. A sequential game often has several Nash equilibria, some of which rely on actions the player would have no interest in playing if the corresponding node were reached.</p>
<div class="ifig" data-fig="nf"></div>
<div class="fig-cap">Figure 2 — Normal form of the figure 1 game. Three cells are Nash equilibria. The equilibrium (D, (r, l)) relies on player 2's threat to play r after U, which would pay them less than l: it is not credible.</div>

<div class="dossier-title" id="s4">4. Non-credible threats</div>
<p>In the equilibrium (D, (r, l)), player 2 "threatens" to answer U with r, which would give player 1 a payoff of 1; player 1 then prefers to play D. This threat costs player 2 nothing, since the node after U is not reached. But if player 1 played U, player 2 would earn 1 by playing l and 0 by playing r: they would not carry out the threat. Player 1, knowing this, should not believe it. A Nash equilibrium may thus rely on irrational behaviour off the equilibrium path.</p>

<div class="dossier-title" id="s5">5. Backward induction and perfect equilibrium</div>
<p>To rule out such threats, Selten (1965) requires strategies to form a Nash equilibrium in every <em>subgame</em>, that is in every part of the tree that starts at a node and contains everything that follows it: this is the <em>subgame perfect equilibrium</em>. In a finite game of perfect information, it is found by <em>backward induction</em>: start from the last nodes, choose there the optimal action of the player concerned, replace the node by the payoffs obtained, and move up to the root. In the example, player 2 chooses l after U (1 &gt; 0) and l after D (3 &gt; 2); player 1, anticipating this, compares 3 and 2 and plays U. The perfect equilibrium is (U, (l, l)); it is one of the three Nash equilibria, the only one without a non-credible threat.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Extensive form: tree, decision nodes, actions, payoffs at the leaves; perfect information if each player observes past actions.</li>
<li>A strategy specifies an action at each of the player's nodes, even unreached ones.</li>
<li>A Nash equilibrium may rely on non-credible threats off the equilibrium path.</li>
<li>Subgame perfect equilibrium: a Nash equilibrium in every subgame; found by backward induction.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { bi: 'Induction à rebours', off: 'masquée', on: 'affichée', trAria: 'Arbre du jeu séquentiel', trRead: on => on ? 'Le joueur 2 joue g après H et g après B ; le joueur 1 joue donc H. Équilibre parfait : (H, (g, g)), gains (3 ; 1).' : 'Activez l\'induction à rebours pour voir les choix optimaux.', nfAria: 'Forme normale du jeu séquentiel', nfRead: 'Équilibres de Nash : (H, (g, g)), (H, (g, d)) et (B, (d, g)).' };
I18N.en.f = { bi: 'Backward induction', off: 'hidden', on: 'shown', trAria: 'Sequential game tree', trRead: on => on ? 'Player 2 plays l after U and l after D; player 1 therefore plays U. Perfect equilibrium: (U, (l, l)), payoffs (3; 1).' : 'Switch on backward induction to see the optimal choices.', nfAria: 'Normal form of the sequential game', nfRead: 'Nash equilibria: (U, (l, l)), (U, (l, r)) and (D, (r, l)).' };
FIGS.tree = {
  state: { bi: 'off' },
  controls: L => [{ key: 'bi', type: 'select', label: L.f.bi, options: [{ v: 'off', t: L.f.off }, { v: 'on', t: L.f.on }] }],
  draw: function (s, lang) { const L = I18N[lang].f, T = j5tree(J5_EX, J5L[lang]); jxBack(T); return { svg: jxTreeSVG(T, { bi: s.bi === 'on', aria: L.trAria, lw: 120 }), read: L.trRead(s.bi === 'on') }; }
};
FIGS.nf = {
  state: {}, controls: L => [],
  draw: function (s, lang) { const L = I18N[lang].f, N = j5normal(J5_EX), JL = J5L[lang]; return { svg: jxMatrixSVG(N.U1, N.U2, { rows: JL.a1, cols: N.S2.map(x => j5s2(x, JL)), p1: JL.p1, p2: JL.p2, br: true, ne: true, cw: 96, aria: L.nfAria }), read: L.nfRead }; }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.P = [0, 1].map(() => [0, 1].map(() => [rint(0, 9), rint(0, 9)]));
    const P = D.P;
    if (P[0][0][1] === P[0][1][1] || P[1][0][1] === P[1][1][1]) continue;           /* le joueur 2 n'est jamais indifférent */
    D.T = j5tree(P, J5L.fr); jxBack(D.T);
    const b2 = [D.T.ch[0].n.best, D.T.ch[1].n.best], v = [P[0][b2[0]][0], P[1][b2[1]][0]];
    if (v[0] === v[1]) continue;
    D.b2 = b2; D.b1 = v[0] > v[1] ? 0 : 1;
    D.N = j5normal(P); D.NE = jxBR(D.N.U1, D.N.U2).ne;
    /* au moins un équilibre de Nash dont l'issue diffère de l'équilibre parfait */
    D.bad = D.NE.filter(e => e[0] !== D.b1);
    if (!D.bad.length) continue;
    if (D.N.U1.some(r => false)) continue;
    /* version simultanée : le joueur 2 ne voit pas le choix du joueur 1 */
    D.S1 = [0, 1].map(k => [0, 1].map(m => P[k][m][0])); D.S2 = [0, 1].map(k => [0, 1].map(m => P[k][m][1]));
    D.SNE = jxBR(D.S1, D.S2).ne;
    break;
  }
  return D;
};
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const P = D.P;
  return String.raw`<div class="context-block">Le joueur 1 choisit H ou B. Le joueur 2 observe ce choix, puis choisit g ou d. Les gains (joueur 1 ; joueur 2) sont : après (H, g) : \((${P[0][0][0]}\,;\,${P[0][0][1]})\) ; après (H, d) : \((${P[0][1][0]}\,;\,${P[0][1][1]})\) ; après (B, g) : \((${P[1][0][0]}\,;\,${P[1][0][1]})\) ; après (B, d) : \((${P[1][1][0]}\,;\,${P[1][1][1]})\).</div>
<div class="questions"><ol>
<li><div class="q-text">Représentez le jeu sous forme extensive.</div></li>
<li><div class="q-text">Combien de stratégies chaque joueur a-t-il ? Énumérez-les.</div></li>
<li><div class="q-text">Écrivez le jeu sous forme normale et déterminez tous ses équilibres de Nash en stratégies pures.</div></li>
<li><div class="q-text">Déterminez l'équilibre parfait en sous-jeux par induction à rebours. Quels équilibres de Nash reposent sur une menace non crédible ?</div></li>
<li><div class="q-text">On suppose maintenant que le joueur 2 ne peut pas observer le choix du joueur 1 : les deux joueurs choisissent simultanément. Déterminez les équilibres de Nash et comparez.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const P = D.P;
  return String.raw`<div class="context-block">Player 1 chooses U or D. Player 2 observes this choice, then chooses l or r. Payoffs (player 1; player 2) are: after (U, l): \((${P[0][0][0]}\,;\,${P[0][0][1]})\); after (U, r): \((${P[0][1][0]}\,;\,${P[0][1][1]})\); after (D, l): \((${P[1][0][0]}\,;\,${P[1][0][1]})\); after (D, r): \((${P[1][1][0]}\,;\,${P[1][1][1]})\).</div>
<div class="questions"><ol>
<li><div class="q-text">Represent the game in extensive form.</div></li>
<li><div class="q-text">How many strategies does each player have? List them.</div></li>
<li><div class="q-text">Write the game in normal form and determine all its pure-strategy Nash equilibria.</div></li>
<li><div class="q-text">Determine the subgame perfect equilibrium by backward induction. Which Nash equilibria rely on a non-credible threat?</div></li>
<li><div class="q-text">Now assume player 2 cannot observe player 1's choice: both players choose simultaneously. Determine the Nash equilibria and compare.</div></li>
</ol></div>`;
});
function j5sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J5L[lang], P = D.P, N = D.N, b2 = D.b2, b1 = D.b1;
  const T = j5tree(P, L); jxBack(T);
  const a1 = L.a1, a2 = L.a2, NEtxt = D.NE.map(e => `(${a1[e[0]]}, ${j5s2(N.S2[e[1]], L)})`).join(', ');
  const spe = `(${a1[b1]}, ${j5s2(b2, L)})`;
  const badTxt = D.bad.map(e => { const s = N.S2[e[1]], k = 1 - e[0]; return `(${a1[e[0]]}, ${j5s2(s, L)}) : ${T_(['le joueur 2 y prévoit de jouer', 'player 2 plans there to play'])} ${a2[s[k]]} ${T_(['après', 'after'])} ${a1[k]}, ${T_(['ce qui lui rapporterait', 'which would pay them'])} ${P[k][s[k]][1]} ${T_(['au lieu de', 'instead of'])} ${P[k][1 - s[k]][1]}`; }).join(' ; ');
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le joueur 1 joue en premier, à la racine ; le joueur 2 a deux nœuds de décision, un après chaque action du joueur 1, puisqu\'il observe ce choix. Les gains sont inscrits aux feuilles :', 'Player 1 moves first, at the root; player 2 has two decision nodes, one after each of player 1\'s actions, since they observe that choice. Payoffs are written at the leaves:'])}</p>
  <div class="sol-fig">${jxTreeSVG(T, { bi: false, lw: 120, aria: 'tree' })}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le joueur 1 n\'a qu\'un nœud de décision, avec deux actions : il a deux stratégies,', 'Player 1 has a single decision node, with two actions: they have two strategies,'])} ${a1[0]} ${T_(['et', 'and'])} ${a1[1]}. ${T_(['Une stratégie du joueur 2 doit préciser son action à chacun de ses deux nœuds, qu\'il soit atteint ou non : il a donc', 'A strategy of player 2 must specify their action at each of their two nodes, whether reached or not: they therefore have'])} \(2\times 2=4\) ${T_(['stratégies, notées (action après', 'strategies, written (action after'])} ${a1[0]}, ${T_(['action après', 'action after'])} ${a1[1]}) : ${N.S2.map(x => j5s2(x, L)).join(', ')}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Pour chaque couple de stratégies, on suit le chemin correspondant dans l\'arbre : par exemple, si le joueur 1 joue', 'For each pair of strategies, we follow the corresponding path in the tree: for instance, if player 1 plays'])} ${a1[0]} ${T_(['et le joueur 2 joue', 'and player 2 plays'])} ${j5s2(N.S2[1], L)}, ${T_(['seule compte l\'action du joueur 2 après', 'only player 2\'s action after'])} ${a1[0]}, ${T_(['soit', 'matters, that is'])} ${a2[N.S2[1][0]]}, ${T_(['et les gains sont', 'and payoffs are'])} \((${N.U1[0][1]}\,;\,${N.U2[0][1]})\). ${T_(['On obtient la forme normale ci-dessous, où l\'on souligne les meilleures réponses :', 'We obtain the normal form below, where best responses are underlined:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(N.U1, N.U2, { rows: a1, cols: N.S2.map(x => j5s2(x, L)), p1: L.p1, p2: L.p2, br: true, ne: true, cw: 96, aria: 'nf' })}</div>
  <p>${T_(['Les équilibres de Nash en stratégies pures sont les cases dont les deux gains sont soulignés :', 'The pure-strategy Nash equilibria are the cells whose two payoffs are underlined:'])} ${NEtxt}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['On raisonne à rebours. Après', 'We reason backwards. After'])} ${a1[0]}, ${T_(['le joueur 2 obtient', 'player 2 gets'])} ${P[0][0][1]} ${T_(['avec', 'with'])} ${a2[0]} ${T_(['et', 'and'])} ${P[0][1][1]} ${T_(['avec', 'with'])} ${a2[1]} : ${T_(['il joue', 'they play'])} ${a2[b2[0]]}. ${T_(['Après', 'After'])} ${a1[1]}, ${T_(['il obtient', 'they get'])} ${P[1][0][1]} ${T_(['avec', 'with'])} ${a2[0]} ${T_(['et', 'and'])} ${P[1][1][1]} ${T_(['avec', 'with'])} ${a2[1]} : ${T_(['il joue', 'they play'])} ${a2[b2[1]]}. ${T_(['Le joueur 1, qui anticipe ces réponses, obtient', 'Player 1, anticipating these responses, gets'])} ${P[0][b2[0]][0]} ${T_(['avec', 'with'])} ${a1[0]} ${T_(['et', 'and'])} ${P[1][b2[1]][0]} ${T_(['avec', 'with'])} ${a1[1]} : ${T_(['il joue', 'they play'])} ${a1[b1]}. ${T_(['L\'équilibre parfait en sous-jeux est', 'The subgame perfect equilibrium is'])} ${spe}, ${T_(['de gains', 'with payoffs'])} \((${P[b1][b2[b1]][0]}\,;\,${P[b1][b2[b1]][1]})\) :</p>
  <div class="sol-fig">${jxTreeSVG(T, { bi: true, lw: 120, aria: 'bi' })}</div>
  <p>${T_(['Les équilibres de Nash dont l\'issue diffère reposent sur une menace non crédible :', 'The Nash equilibria with a different outcome rely on a non-credible threat:'])} ${badTxt}. ${T_(['Si le nœud était atteint, le joueur 2 ne mettrait pas cette menace à exécution ; un joueur 1 rationnel ne doit donc pas y croire.', 'If the node were reached, player 2 would not carry out this threat; a rational player 1 should therefore not believe it.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Sans observation, le joueur 2 ne peut plus conditionner son action au choix du joueur 1 : chaque joueur n\'a que deux stratégies, et le jeu est la matrice', 'Without observation, player 2 can no longer condition their action on player 1\'s choice: each player has only two strategies, and the game is the'])} \(2\times 2\) ${T_(['suivante :', 'matrix below:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(D.S1, D.S2, { rows: a1, cols: a2, p1: L.p1, p2: L.p2, br: true, ne: true, aria: 'sim' })}</div>
  <p>${D.SNE.length ? T_(['Ses équilibres de Nash en stratégies pures sont', 'Its pure-strategy Nash equilibria are']) + ' ' + D.SNE.map(e => `(${a1[e[0]]}, ${a2[e[1]]})`).join(', ') + '.' : T_(['Il n\'a pas d\'équilibre de Nash en stratégies pures ; il faudrait chercher un équilibre en stratégies mixtes.', 'It has no pure-strategy Nash equilibrium; a mixed-strategy equilibrium would have to be sought.'])} ${T_(['L\'ordre des coups et l\'information changent donc la prédiction : dans le jeu séquentiel, le joueur 1 tire parti du fait que le joueur 2 réagira de façon prévisible à son choix.', 'The order of moves and information therefore change the prediction: in the sequential game, player 1 takes advantage of the fact that player 2 will react predictably to their choice.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j5sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j5sol(D, 'en'))(D));