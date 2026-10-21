I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 2 – Élimination des stratégies dominées', 'k-h1': 'Élimination répétée des stratégies strictement dominées', 'k-coursetitle': 'Raisonner sur la rationalité de l\'autre : dominance stricte, élimination itérée et ses limites', 'k-extitle': 'Résoudre un jeu par élimination répétée', 'k-soltitle': 'Résoudre un jeu par élimination répétée' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 2 – Eliminating dominated strategies', 'k-h1': 'Iterated elimination of strictly dominated strategies', 'k-coursetitle': 'Reasoning about the other\'s rationality: strict dominance, iterated elimination and its limits', 'k-extitle': 'Solving a game by iterated elimination', 'k-soltitle': 'Solving a game by iterated elimination' });

/* ---------- outils : élimination itérée (dominance stricte par une stratégie pure) ---------- */
function j2iesds(U1, U2, first) {
  let R = U1.map((_, i) => i), C = U1[0].map((_, j) => j); const steps = [];
  for (;;) {
    const cand = [];
    const d1 = () => { for (const x of R) for (const y of R) if (x !== y && C.every(j => U1[y][j] > U1[x][j])) return { p: 1, out: x, by: y }; return null; };
    const d2 = () => { for (const x of C) for (const y of C) if (x !== y && R.every(i => U2[i][y] > U2[i][x])) return { p: 2, out: x, by: y }; return null; };
    const order = first === 2 ? [d2, d1] : [d1, d2];
    let st = null; for (const f of order) { st = f(); if (st) break; }
    if (!st) break;
    st.R = R.slice(); st.C = C.slice(); steps.push(st);
    if (st.p === 1) R = R.filter(i => i !== st.out); else C = C.filter(j => j !== st.out);
  }
  return { steps: steps, R: R, C: C };
}
const J2_EX = { U1: [[8, 7, 6], [2, 3, 2], [8, 6, 0]], U2: [[1, 2, 9], [0, 4, 0], [4, 7, 9]] };

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez reconnaître une stratégie strictement dominée, appliquer pas à pas l'élimination répétée des stratégies strictement dominées (ERSSD), justifier chaque étape par la rationalité des joueurs et la connaissance commune de cette rationalité, et savoir pourquoi la dominance faible doit être maniée avec prudence.<br><br>
<strong>Pourquoi ?</strong> Beaucoup de jeux n'ont pas de stratégie dominante pour chaque joueur. L'ERSSD permet pourtant souvent de prévoir l'issue d'un jeu, en raisonnant sur ce que l'autre ne fera certainement pas. C'est le premier pas vers l'équilibre de Nash.<br><br>
<strong>Prérequis.</strong> Stratégies dominantes (Théorie des jeux 1).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Stratégie strictement dominée</a> · <a href="#s2">2. L'élimination répétée</a> · <a href="#s3">3. Rationalité commune</a> · <a href="#s4">4. Propriétés</a> · <a href="#s5">5. Dominance faible</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Stratégie strictement dominée</div>
<p>Une stratégie \(s_i\) du joueur \(i\) est <em>strictement dominée</em> par une stratégie \(s_i'\) si \(s_i'\) lui rapporte strictement plus, quoi que fassent les autres :
\[u_i(s_i',s_{-i})&gt;u_i(s_i,s_{-i})\quad\text{pour tout }s_{-i}\]
Un joueur rationnel ne joue jamais une stratégie strictement dominée : quelle que soit sa croyance sur les autres, \(s_i'\) lui rapporte davantage. Dans une matrice, la ligne \(s_i\) est strictement dominée par la ligne \(s_i'\) si, dans chaque colonne, le gain du joueur 1 est plus élevé en \(s_i'\) ; de même pour les colonnes et le joueur 2.</p>

<div class="dossier-title" id="s2">2. L'élimination répétée</div>
<p>Une fois une stratégie strictement dominée retirée, le jeu est plus petit, et une stratégie qui ne l'était pas peut le devenir. On répète donc l'opération : à chaque étape, on supprime une stratégie strictement dominée de l'un des joueurs, dans le jeu restant, jusqu'à ce qu'il n'y en ait plus. Si un seul profil subsiste, le jeu est dit <em>résoluble par dominance</em>, et ce profil est l'issue prédite. Il faut justifier chaque suppression en comparant explicitement les gains dans toutes les stratégies restantes de l'adversaire.</p>
<div class="ifig" data-fig="iesds"></div>
<div class="fig-cap">Figure 1 — Élimination répétée sur un jeu \(3\times 3\). Cliquez sur « étape suivante » : la stratégie strictement dominée est barrée, puis le raisonnement reprend dans le jeu restant. La lecture indique quelle stratégie domine laquelle. Le profil qui subsiste est l'équilibre de Nash du jeu.</div>

<div class="dossier-title" id="s3">3. Rationalité et connaissance commune</div>
<p>Chaque étape repose sur une hypothèse de plus. La première suppression suppose seulement que le joueur concerné est rationnel. La deuxième suppose que l'autre sait qu'il est rationnel, et donc qu'il ne jouera pas la stratégie supprimée. La troisième suppose que le premier sait que l'autre le sait, et ainsi de suite. Une élimination en \(k\) étapes suppose \(k-1\) niveaux de « je sais que tu sais » : c'est la <em>connaissance commune de la rationalité</em>. Plus la chaîne est longue, plus la prédiction est fragile en pratique.</p>

<div class="dossier-title" id="s4">4. Propriétés</div>
<p>Avec la dominance stricte, l'ordre des suppressions n'a pas d'importance : on aboutit toujours au même jeu réduit. Aucun équilibre de Nash n'est jamais supprimé, puisqu'une stratégie strictement dominée n'est la meilleure réponse à rien. Si l'ERSSD aboutit à un profil unique, ce profil est donc l'unique équilibre de Nash du jeu. En revanche, beaucoup de jeux ne sont pas résolubles par dominance : dans la bataille des sexes ou le jeu de la poule mouillée, aucune stratégie n'est dominée.</p>

<div class="dossier-title" id="s5">5. Prudence avec la dominance faible</div>
<p>Une stratégie est <em>faiblement dominée</em> si une autre rapporte au moins autant contre toute stratégie adverse, et strictement plus contre l'une d'elles. Éliminer itérativement les stratégies faiblement dominées peut donner des résultats qui dépendent de l'ordre des suppressions, et peut supprimer des équilibres de Nash. Dans le jeu ci-dessous, commencer par supprimer H mène à (B, D), commencer par supprimer M mène à (B, G) : deux issues différentes.</p>
<div class="ifig" data-fig="weak"></div>
<div class="fig-cap">Figure 2 — Un jeu où l'élimination des stratégies faiblement dominées dépend de l'ordre. Le menu choisit la première suppression ; le jeu réduit final est différent dans les deux cas. Avec la dominance stricte, ce problème ne se pose pas.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Strictement dominée : une autre stratégie rapporte strictement plus contre toutes les stratégies adverses ; un joueur rationnel ne la joue jamais.</li>
<li>ERSSD : on supprime, étape par étape, les stratégies strictement dominées dans le jeu restant ; chaque étape exige un niveau de plus de connaissance de la rationalité.</li>
<li>L'ordre n'importe pas avec la dominance stricte ; le profil final unique, s'il existe, est l'unique équilibre de Nash.</li>
<li>Avec la dominance faible, l'ordre peut changer le résultat.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can recognise a strictly dominated strategy, apply step by step the iterated elimination of strictly dominated strategies (IESDS), justify each step by the players' rationality and common knowledge of rationality, and know why weak dominance must be handled with care.<br><br>
<strong>Why?</strong> Many games do not have a dominant strategy for each player. IESDS nevertheless often allows predicting the outcome, by reasoning about what the other will certainly not do. It is the first step towards Nash equilibrium.<br><br>
<strong>Prerequisites.</strong> Dominant strategies (Game theory 1).
</div>
<p class="toc">Contents: <a href="#s1">1. Strictly dominated strategy</a> · <a href="#s2">2. Iterated elimination</a> · <a href="#s3">3. Common rationality</a> · <a href="#s4">4. Properties</a> · <a href="#s5">5. Weak dominance</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Strictly dominated strategy</div>
<p>A strategy \(s_i\) of player \(i\) is <em>strictly dominated</em> by a strategy \(s_i'\) if \(s_i'\) pays strictly more, whatever the others do:
\[u_i(s_i',s_{-i})&gt;u_i(s_i,s_{-i})\quad\text{for every }s_{-i}\]
A rational player never plays a strictly dominated strategy: whatever their belief about the others, \(s_i'\) pays more. In a matrix, row \(s_i\) is strictly dominated by row \(s_i'\) if, in every column, player 1's payoff is higher at \(s_i'\); likewise for columns and player 2.</p>

<div class="dossier-title" id="s2">2. Iterated elimination</div>
<p>Once a strictly dominated strategy is removed, the game is smaller, and a strategy that was not dominated may become so. The operation is therefore repeated: at each step, a strictly dominated strategy of one of the players is removed, in the remaining game, until none is left. If a single profile remains, the game is said to be <em>dominance solvable</em>, and this profile is the predicted outcome. Each removal must be justified by explicitly comparing payoffs against all the opponent's remaining strategies.</p>
<div class="ifig" data-fig="iesds"></div>
<div class="fig-cap">Figure 1 — Iterated elimination on a \(3\times 3\) game. Click "next step": the strictly dominated strategy is struck out, then reasoning resumes in the remaining game. The reading says which strategy dominates which. The surviving profile is the game's Nash equilibrium.</div>

<div class="dossier-title" id="s3">3. Rationality and common knowledge</div>
<p>Each step relies on one more assumption. The first removal only assumes that the player concerned is rational. The second assumes that the other knows they are rational, and therefore will not play the removed strategy. The third assumes that the first knows that the other knows, and so on. An elimination in \(k\) steps requires \(k-1\) levels of "I know that you know": this is <em>common knowledge of rationality</em>. The longer the chain, the more fragile the prediction in practice.</p>

<div class="dossier-title" id="s4">4. Properties</div>
<p>With strict dominance, the order of removals does not matter: the same reduced game is always reached. No Nash equilibrium is ever removed, since a strictly dominated strategy is a best response to nothing. If IESDS leads to a single profile, this profile is therefore the game's unique Nash equilibrium. However, many games are not dominance solvable: in the battle of the sexes or the game of chicken, no strategy is dominated.</p>

<div class="dossier-title" id="s5">5. Care with weak dominance</div>
<p>A strategy is <em>weakly dominated</em> if another pays at least as much against every opposing strategy, and strictly more against at least one. Iteratively removing weakly dominated strategies may give results that depend on the order of removals, and may remove Nash equilibria. In the game below, removing U first leads to (D, R), removing M first leads to (D, L): two different outcomes.</p>
<div class="ifig" data-fig="weak"></div>
<div class="fig-cap">Figure 2 — A game in which the elimination of weakly dominated strategies depends on the order. The menu chooses the first removal; the final reduced game differs in the two cases. With strict dominance, this problem does not arise.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Strictly dominated: another strategy pays strictly more against every opposing strategy; a rational player never plays it.</li>
<li>IESDS: remove, step by step, strictly dominated strategies in the remaining game; each step requires one more level of knowledge of rationality.</li>
<li>Order does not matter with strict dominance; the unique final profile, if any, is the unique Nash equilibrium.</li>
<li>With weak dominance, the order may change the result.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { rows: ['H', 'M', 'B'], cols: ['G', 'C', 'D'], next: 'Étape suivante', reset: 'Recommencer', p1: 'Joueur 1', p2: 'Joueur 2', aria: 'Élimination répétée',
  read: (st, k, n, fin) => k === 0 ? 'Jeu initial : cliquez sur « étape suivante ».' : (st ? `Étape ${k} : pour le joueur ${st.p}, ${st.p === 1 ? ['H', 'M', 'B'][st.out] : ['G', 'C', 'D'][st.out]} est strictement dominée par ${st.p === 1 ? ['H', 'M', 'B'][st.by] : ['G', 'C', 'D'][st.by]}.` : '') + (fin ? ' Il ne reste qu\'un profil : c\'est l\'issue du jeu.' : ''),
  first: 'Première suppression', fU: 'H (faiblement dominée par B)', fM: 'M (faiblement dominée par B)', weakAria: 'Jeu où l\'élimination faible dépend de l\'ordre',
  wRead: f => f === 'U' ? 'Ordre : H, puis G, puis M. Il reste (B, D), avec les gains (4 ; 4).' : 'Ordre : M, puis D, puis H. Il reste (B, G), avec les gains (6 ; 4).' };
I18N.en.f = { rows: ['U', 'M', 'D'], cols: ['L', 'C', 'R'], next: 'Next step', reset: 'Restart', p1: 'Player 1', p2: 'Player 2', aria: 'Iterated elimination',
  read: (st, k, n, fin) => k === 0 ? 'Initial game: click "next step".' : (st ? `Step ${k}: for player ${st.p}, ${st.p === 1 ? ['U', 'M', 'D'][st.out] : ['L', 'C', 'R'][st.out]} is strictly dominated by ${st.p === 1 ? ['U', 'M', 'D'][st.by] : ['L', 'C', 'R'][st.by]}.` : '') + (fin ? ' Only one profile remains: it is the outcome of the game.' : ''),
  first: 'First removal', fU: 'U (weakly dominated by D)', fM: 'M (weakly dominated by D)', weakAria: 'Game where weak elimination depends on the order',
  wRead: f => f === 'U' ? 'Order: U, then L, then M. (D, R) remains, with payoffs (4; 4).' : 'Order: M, then R, then U. (D, L) remains, with payoffs (6; 4).' };
FIGS.iesds = {
  state: { k: 0 },
  controls: L => [{ key: 'nx', type: 'button', label: L.f.next, act: s => { s.k = Math.min(s.k + 1, j2iesds(J2_EX.U1, J2_EX.U2).steps.length); } }, { key: 'rs', type: 'button', label: L.f.reset, act: s => { s.k = 0; } }],
  draw: function (s, lang) {
    const L = I18N[lang].f, E = j2iesds(J2_EX.U1, J2_EX.U2), done = E.steps.slice(0, s.k);
    const cross = { rows: done.filter(x => x.p === 1).map(x => x.out), cols: done.filter(x => x.p === 2).map(x => x.out) };
    return { svg: jxMatrixSVG(J2_EX.U1, J2_EX.U2, { rows: L.rows, cols: L.cols, p1: L.p1, p2: L.p2, cross: cross, ne: s.k === E.steps.length, aria: L.aria }), read: L.read(done[s.k - 1], s.k, E.steps.length, s.k === E.steps.length) };
  }
};
FIGS.weak = {
  state: { f: 'U' },
  controls: L => [{ key: 'f', type: 'select', label: L.f.first, options: [{ v: 'U', t: L.f.fU }, { v: 'M', t: L.f.fM }] }],
  draw: function (s, lang) {
    const L = I18N[lang].f, U1 = [[5, 4], [6, 3], [6, 4]], U2 = [[1, 0], [0, 1], [4, 4]];
    const cross = s.f === 'U' ? { rows: [0, 1], cols: [0] } : { rows: [1, 0], cols: [1] };
    return { svg: jxMatrixSVG(U1, U2, { rows: L.rows, cols: [L.cols[0], L.cols[2]], p1: L.p1, p2: L.p2, cross: cross, aria: L.weakAria }), read: L.wRead(s.f) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.U1 = [0, 1, 2].map(() => [0, 1, 2].map(() => rint(0, 9))); D.U2 = [0, 1, 2].map(() => [0, 1, 2].map(() => rint(0, 9)));
    const E = j2iesds(D.U1, D.U2, 1), F = j2iesds(D.U1, D.U2, 2);
    if (E.R.length !== 1 || E.C.length !== 1 || E.steps.length < 4) continue;
    /* aucune stratégie strictement dominante au départ, pour que l'itération soit nécessaire */
    const dom1 = [0, 1, 2].some(x => [0, 1, 2].every(y => y === x || [0, 1, 2].every(j => D.U1[x][j] > D.U1[y][j])));
    const dom2 = [0, 1, 2].some(x => [0, 1, 2].every(y => y === x || [0, 1, 2].every(i => D.U2[i][x] > D.U2[i][y])));
    if (dom1 || dom2) continue;
    /* pas d'égalités gênantes dans les comparaisons de meilleure réponse finale */
    D.E = E; D.F = F; break;
  }
  D.i = D.E.R[0]; D.j = D.E.C[0];
  return D;
};
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = I18N.fr.f;
  return String.raw`<div class="context-block">Deux joueurs choisissent simultanément une stratégie : le joueur 1 parmi H, M et B, le joueur 2 parmi G, C et D. Dans chaque case, le premier nombre est le gain du joueur 1, le second celui du joueur 2.</div>
${jxTable(D.U1, D.U2, L.rows, L.cols, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">L'un des joueurs a-t-il une stratégie strictement dominante ?</div></li>
<li><div class="q-text">Appliquez l'élimination répétée des stratégies strictement dominées, en commençant par examiner le joueur 1 à chaque étape. Justifiez chaque suppression par une comparaison des gains.</div></li>
<li><div class="q-text">Quelle est l'issue du jeu ? Vérifiez qu'il s'agit d'un équilibre de Nash. Quelles hypothèses sur les joueurs cette prédiction suppose-t-elle ?</div></li>
<li><div class="q-text">Représentez la matrice à chaque étape de l'élimination.</div></li>
<li><div class="q-text">Reprenez l'élimination en examinant d'abord le joueur 2 à chaque étape. Le résultat change-t-il ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = I18N.en.f;
  return String.raw`<div class="context-block">Two players simultaneously choose a strategy: player 1 among U, M and D, player 2 among L, C and R. In each cell, the first number is player 1's payoff, the second player 2's.</div>
${jxTable(D.U1, D.U2, L.rows, L.cols, '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">Does either player have a strictly dominant strategy?</div></li>
<li><div class="q-text">Apply the iterated elimination of strictly dominated strategies, examining player 1 first at each step. Justify each removal by comparing payoffs.</div></li>
<li><div class="q-text">What is the outcome of the game? Check that it is a Nash equilibrium. What assumptions about the players does this prediction require?</div></li>
<li><div class="q-text">Draw the matrix at each step of the elimination.</div></li>
<li><div class="q-text">Redo the elimination examining player 2 first at each step. Does the result change?</div></li>
</ol></div>`;
});
function j2step(D, st, k, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = I18N[lang].f, U1 = D.U1, U2 = D.U2;
  const nm = st.p === 1 ? L.rows : L.cols, other = st.p === 1 ? st.C : st.R, onm = st.p === 1 ? L.cols : L.rows;
  const cmp = other.map(o => { const a = st.p === 1 ? U1[st.by][o] : U2[o][st.by], b = st.p === 1 ? U1[st.out][o] : U2[o][st.out]; return `${T_(['face à', 'against'])} ${onm[o]}, \\(${a}&gt;${b}\\)`; }).join(' ; ');
  const remain = (st.p === 1 ? st.C : st.R).map(o => onm[o]).join(', ');
  return `<p><strong>${T_(['Étape', 'Step'])} ${k}.</strong> ${T_(['Dans le jeu restant, la stratégie', 'In the remaining game, strategy'])} ${nm[st.out]} ${T_(['du joueur', 'of player'])} ${st.p} ${T_(['est strictement dominée par', 'is strictly dominated by'])} ${nm[st.by]} : ${T_(['contre chacune des stratégies restantes de l\'adversaire', 'against each of the opponent\'s remaining strategies'])} (${remain}), ${nm[st.by]} ${T_(['rapporte strictement plus', 'pays strictly more'])} : ${cmp}. ${k === 1 ? T_(['Un joueur rationnel ne joue donc pas', 'A rational player therefore does not play']) : T_(['L\'adversaire, sachant que le joueur', 'The opponent, knowing that player']) + ' ' + st.p + ' ' + T_(['est rationnel et connaît le jeu restant, sait qu\'il ne jouera pas', 'is rational and knows the remaining game, knows that they will not play'])} ${nm[st.out]} : ${T_(['on la supprime.', 'we remove it.'])}</p>`;
}
function j2sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = I18N[lang].f, U1 = D.U1, U2 = D.U2, E = D.E, F = D.F, i = D.i, j = D.j;
  const noDom1 = [0, 1, 2].map(x => { const y = [0, 1, 2].find(y => y !== x && !([0, 1, 2].every(c => U1[x][c] > U1[y][c]))); const c = [0, 1, 2].find(c => U1[x][c] <= U1[y][c]); return `${L.rows[x]} ${T_(['ne fait pas mieux que', 'does no better than'])} ${L.rows[y]} ${T_(['face à', 'against'])} ${L.cols[c]} (\\(${U1[x][c]}\\le ${U1[y][c]}\\))`; }).join(' ; ');
  const noDom2 = [0, 1, 2].map(x => { const y = [0, 1, 2].find(y => y !== x && !([0, 1, 2].every(r => U2[r][x] > U2[r][y]))); const r = [0, 1, 2].find(r => U2[r][x] <= U2[r][y]); return `${L.cols[x]} ${T_(['ne fait pas mieux que', 'does no better than'])} ${L.cols[y]} ${T_(['face à', 'against'])} ${L.rows[r]} (\\(${U2[r][x]}\\le ${U2[r][y]}\\))`; }).join(' ; ');
  const figs = E.steps.map((st, k) => { const done = E.steps.slice(0, k + 1); return `<div style="flex:1 1 300px"><p style="text-align:center;margin:.2rem 0"><em>${T_(['Après l\'étape', 'After step'])} ${k + 1}</em></p>${jxMatrixSVG(U1, U2, { rows: L.rows, cols: L.cols, p1: L.p1, p2: L.p2, cross: { rows: done.filter(x => x.p === 1).map(x => x.out), cols: done.filter(x => x.p === 2).map(x => x.out) }, ne: k === E.steps.length - 1, cw: 92, ch: 44, aria: 'step' })}</div>`; }).join('');
  const seq = S => S.steps.map(st => (st.p === 1 ? L.rows : L.cols)[st.out] + ` (${T_(['joueur', 'player'])} ${st.p})`).join(', ');
  const brc = [0, 1, 2].map(x => U1[x][j]), brr = U2[i];
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Une stratégie strictement dominante devrait faire strictement mieux que chacune des autres dans toutes les colonnes (pour le joueur 1) ou toutes les lignes (pour le joueur 2). Ce n\'est le cas d\'aucune stratégie. Pour le joueur 1 :', 'A strictly dominant strategy would have to do strictly better than each of the others in every column (for player 1) or every row (for player 2). No strategy satisfies this. For player 1:'])} ${noDom1}. ${T_(['Pour le joueur 2 :', 'For player 2:'])} ${noDom2}. ${T_(['Aucun joueur n\'a de stratégie strictement dominante : il faut raisonner par élimination successive.', 'Neither player has a strictly dominant strategy: we must reason by successive elimination.'])}</p>
</div></li>
<li><div class="q-content">
  ${E.steps.map((st, k) => j2step(D, st, k + 1, lang)).join('')}
  <p>${T_(['Il ne reste plus que la ligne', 'Only row'])} ${L.rows[i]} ${T_(['et la colonne', 'and column'])} ${L.cols[j]} : ${T_(['l\'élimination s\'arrête.', 'remain: the elimination stops.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'issue du jeu est le profil', 'The outcome of the game is the profile'])} (${L.rows[i]}, ${L.cols[j]}), ${T_(['avec les gains', 'with payoffs'])} \((${U1[i][j]}\,;\,${U2[i][j]})\). ${T_(['C\'est un équilibre de Nash : face à', 'It is a Nash equilibrium: against'])} ${L.cols[j]}, ${T_(['le joueur 1 obtient', 'player 1 gets'])} ${brc.join(', ')} ${T_(['avec', 'with'])} ${L.rows.join(', ')}, ${T_(['et', 'and'])} ${L.rows[i]} ${T_(['donne le plus grand de ces gains ; face à', 'gives the largest of these payoffs; against'])} ${L.rows[i]}, ${T_(['le joueur 2 obtient', 'player 2 gets'])} ${brr.join(', ')} ${T_(['avec', 'with'])} ${L.cols.join(', ')}, ${T_(['et', 'and'])} ${L.cols[j]} ${T_(['donne le plus grand. Chacun joue donc sa meilleure réponse à l\'autre. Cette prédiction repose sur la rationalité des joueurs et sur la connaissance commune de cette rationalité : l\'élimination a demandé', 'gives the largest. Each therefore plays a best response to the other. This prediction rests on the players\' rationality and on common knowledge of this rationality: the elimination required'])} ${E.steps.length} ${T_(['étapes, donc', 'steps, hence'])} ${E.steps.length - 1} ${T_(['niveaux de « je sais que tu sais que… ».', 'levels of "I know that you know that…".'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les stratégies supprimées sont barrées ; la case restante, colorée, est l\'issue du jeu :', 'Removed strategies are struck out; the remaining shaded cell is the outcome of the game:'])}</p>
  <div class="sol-fig" style="display:flex;flex-wrap:wrap;gap:.6rem">${figs}</div>
</div></li>
<li><div class="q-content">
  <p>${T_(['En examinant d\'abord le joueur 2 à chaque étape, on supprime successivement', 'Examining player 2 first at each step, we successively remove'])} ${seq(F)}, ${T_(['et il reste', 'and what remains is'])} (${L.rows[F.R[0]]}, ${L.cols[F.C[0]]}). ${T_(['Le résultat est le même : avec la dominance stricte, l\'ordre des suppressions n\'a pas d\'importance. Seul le chemin change', 'The result is the same: with strict dominance, the order of removals does not matter. Only the path changes'])} (${T_(['ordre initial', 'initial order'])} : ${seq(E)}).</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j2sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j2sol(D, 'en'))(D));