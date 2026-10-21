I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 6 – Jeu d\'entrée, engagement et mille-pattes', 'k-h1': 'Jeu d\'entrée, engagement et mille-pattes', 'k-coursetitle': 'Crédibilité des menaces, valeur de l\'engagement, induction à rebours à plusieurs joueurs et ses paradoxes', 'k-extitle': 'Dissuader un entrant, s\'engager et raisonner à rebours à trois joueurs', 'k-soltitle': 'Dissuader un entrant, s\'engager et raisonner à rebours à trois joueurs' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 6 – Entry game, commitment and centipede', 'k-h1': 'Entry game, commitment and centipede', 'k-coursetitle': 'Credibility of threats, value of commitment, backward induction with several players and its paradoxes', 'k-extitle': 'Deterring an entrant, committing and reasoning backwards with three players', 'k-soltitle': 'Deterring an entrant, committing and reasoning backwards with three players' });

const J6L = { fr: { E: 'Entrant', I: 'Titulaire', ent: 'Entrer', out: 'Rester dehors', fi: 'Combattre', ac: 'Accepter', inv: 'Investir', no: 'Ne pas investir' }, en: { E: 'Entrant', I: 'Incumbent', ent: 'Enter', out: 'Stay out', fi: 'Fight', ac: 'Accommodate', inv: 'Invest', no: 'Do not invest' } };
/* jeu d'entrée : feuilles (gain entrant ; gain titulaire) */
function j6entry(L, M, aE, aI, fE, fI) {
  return { pl: 1, lab: 'E', ch: [{ a: L.out, n: { u: [0, M] } }, { a: L.ent, n: { pl: 2, lab: 'T', ch: [{ a: L.fi, n: { u: [-fE, fI] } }, { a: L.ac, n: { u: [aE, aI] } }] } }] };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez analyser un jeu d'entrée, distinguer menace crédible et non crédible, montrer comment un engagement irréversible peut rendre une menace crédible, appliquer l'induction à rebours à un jeu à trois joueurs, et comprendre le paradoxe du mille-pattes.<br><br>
<strong>Pourquoi ?</strong> Un titulaire menace de déclencher une guerre des prix si un concurrent entre ; un gouvernement menace de sanctions ; un parent menace de punir. Ces menaces ne dissuadent que si celui qui les profère aurait intérêt à les exécuter le moment venu. Savoir les évaluer est un enjeu central de la stratégie d'entreprise.<br><br>
<strong>Prérequis.</strong> Jeux séquentiels (Théorie des jeux 5), prix limite (Économie industrielle 7).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le jeu d'entrée</a> · <a href="#s2">2. S'engager</a> · <a href="#s3">3. Plusieurs joueurs</a> · <a href="#s4">4. Le mille-pattes</a> · <a href="#s5">5. Limites</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le jeu d'entrée</div>
<p>Un entrant potentiel décide d'entrer sur un marché ou de rester dehors. S'il reste dehors, le titulaire garde son profit de monopole. S'il entre, le titulaire choisit de combattre (guerre des prix, coûteuse pour les deux) ou d'accepter le partage du marché. Sous forme normale, deux équilibres de Nash existent : (entrer, accepter) et (rester dehors, combattre). Le second repose sur une menace : si l'entrant entrait, le titulaire gagnerait moins à combattre qu'à accepter, et ne combattrait donc pas. Par induction à rebours, le titulaire accepte, l'entrant entre : seul (entrer, accepter) est parfait en sous-jeux.</p>
<div class="ifig" data-fig="entry"></div>
<div class="fig-cap">Figure 1 — Jeu d'entrée, avec induction à rebours. Sans investissement, le titulaire préfère accepter l'entrée : la menace de combat n'est pas crédible et l'entrant entre. Avec un investissement préalable en capacités, qui rend la guerre des prix moins coûteuse, combattre devient la meilleure réponse et l'entrant reste dehors.</div>

<div class="dossier-title" id="s2">2. S'engager pour rendre une menace crédible</div>
<p>Le titulaire peut modifier le jeu avant que l'entrant ne décide : investir dans des capacités excédentaires, signer des contrats, construire une réputation. Si cet investissement, irréversible et observable, rend le combat plus profitable que l'acceptation, la menace devient crédible, et l'entrant renonce. L'investissement est rentable si le profit de monopole, diminué de son coût, dépasse le profit obtenu en acceptant l'entrée sans investir. C'est la logique de Dixit (1980) et du prix limite : se lier les mains peut être avantageux.</p>

<div class="dossier-title" id="s3">3. Induction à rebours à plusieurs joueurs</div>
<p>La méthode s'étend à un nombre quelconque de joueurs et d'étapes. À chaque nœud final, le joueur concerné choisit l'action qui maximise <em>son</em> gain ; on remplace le nœud par le vecteur de gains obtenu, puis on remonte. Pour que le résultat soit unique, il suffit qu'aucun joueur ne soit indifférent à un nœud. L'équilibre parfait précise une action à chaque nœud, y compris hors du chemin suivi : c'est un profil de stratégies complet, et pas seulement une issue.</p>

<div class="dossier-title" id="s4">4. Le mille-pattes</div>
<p>Dans le jeu du mille-pattes (Rosenthal, 1981), deux joueurs décident tour à tour d'arrêter ou de continuer. Continuer fait grossir le pot commun, mais celui qui arrête prend la plus grosse part du pot du moment. Au dernier nœud, le joueur arrête ; l'avant-dernier, qui l'anticipe, arrête aussi ; et ainsi de suite jusqu'au premier nœud. L'équilibre parfait prescrit d'arrêter immédiatement, alors que continuer longtemps rapporterait beaucoup plus aux deux joueurs. Dans les expériences, la plupart des participants continuent plusieurs étapes.</p>
<div class="ifig" data-fig="cent"></div>
<div class="fig-cap">Figure 2 — Un mille-pattes à \(n\) étapes : à l'étape \(t\), arrêter donne \(t+1\) au joueur qui arrête et \(t-1\) à l'autre ; si personne n'arrête, chacun obtient \(n\). L'induction à rebours fait arrêter dès la première étape (flèche rouge), alors que les gains possibles croissent avec \(n\).</div>

<div class="dossier-title" id="s5">5. Les limites de l'induction à rebours</div>
<p>L'induction à rebours suppose que chaque joueur est rationnel, que tous le savent, et que cette connaissance est commune à toutes les profondeurs de l'arbre. Dans les longs jeux, cette hypothèse est fragile : un joueur qui observe un comportement inattendu (continuer au premier nœud) peut réviser sa croyance sur la rationalité de l'autre. Les modèles de réputation (Kreps, Milgrom, Roberts, Wilson, 1982) montrent qu'un léger doute suffit à rendre rationnelle la coopération pendant longtemps.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Jeu d'entrée : (rester dehors, combattre) est un équilibre de Nash qui repose sur une menace non crédible ; seul (entrer, accepter) est parfait.</li>
<li>Un engagement irréversible et observable peut rendre une menace crédible ; il est rentable si le gain qu'il permet dépasse son coût.</li>
<li>Induction à rebours à plusieurs joueurs : chacun maximise son propre gain à ses nœuds, du bas vers le haut.</li>
<li>Mille-pattes : l'équilibre parfait prescrit d'arrêter tout de suite, un résultat contredit par l'expérience.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can analyse an entry game, distinguish credible from non-credible threats, show how an irreversible commitment can make a threat credible, apply backward induction to a three-player game, and understand the centipede paradox.<br><br>
<strong>Why?</strong> An incumbent threatens a price war if a rival enters; a government threatens sanctions; a parent threatens punishment. These threats only deter if whoever makes them would want to carry them out when the time comes. Assessing them is a central issue of business strategy.<br><br>
<strong>Prerequisites.</strong> Sequential games (Game theory 5), limit pricing (Industrial economics 7).
</div>
<p class="toc">Contents: <a href="#s1">1. The entry game</a> · <a href="#s2">2. Committing</a> · <a href="#s3">3. Several players</a> · <a href="#s4">4. The centipede</a> · <a href="#s5">5. Limits</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The entry game</div>
<p>A potential entrant decides whether to enter a market or stay out. If it stays out, the incumbent keeps its monopoly profit. If it enters, the incumbent chooses to fight (a price war, costly for both) or to accommodate by sharing the market. In normal form, there are two Nash equilibria: (enter, accommodate) and (stay out, fight). The second relies on a threat: if the entrant entered, the incumbent would earn less by fighting than by accommodating, and would therefore not fight. By backward induction, the incumbent accommodates and the entrant enters: only (enter, accommodate) is subgame perfect.</p>
<div class="ifig" data-fig="entry"></div>
<div class="fig-cap">Figure 1 — Entry game, with backward induction. Without investment, the incumbent prefers to accommodate: the threat to fight is not credible and the entrant enters. With a prior investment in capacity, which makes the price war less costly, fighting becomes the best response and the entrant stays out.</div>

<div class="dossier-title" id="s2">2. Committing to make a threat credible</div>
<p>The incumbent can change the game before the entrant decides: invest in excess capacity, sign contracts, build a reputation. If this investment, irreversible and observable, makes fighting more profitable than accommodating, the threat becomes credible and the entrant gives up. The investment pays if monopoly profit, minus its cost, exceeds the profit obtained by accommodating entry without investing. This is the logic of Dixit (1980) and of limit pricing: tying one's hands may pay.</p>

<div class="dossier-title" id="s3">3. Backward induction with several players</div>
<p>The method extends to any number of players and stages. At each final node, the player concerned chooses the action maximising <em>their own</em> payoff; the node is replaced by the resulting payoff vector, and we move up. For the result to be unique, it suffices that no player is ever indifferent at a node. The perfect equilibrium specifies an action at every node, including off the path followed: it is a complete strategy profile, not only an outcome.</p>

<div class="dossier-title" id="s4">4. The centipede</div>
<p>In the centipede game (Rosenthal, 1981), two players take turns deciding to stop or continue. Continuing makes the common pot grow, but whoever stops takes the larger share of the current pot. At the last node, the player stops; the one before, anticipating this, stops too; and so on back to the first node. The perfect equilibrium prescribes stopping immediately, whereas continuing for a long time would pay both players much more. In experiments, most participants continue for several stages.</p>
<div class="ifig" data-fig="cent"></div>
<div class="fig-cap">Figure 2 — A centipede with \(n\) stages: at stage \(t\), stopping gives \(t+1\) to the stopper and \(t-1\) to the other; if nobody stops, each gets \(n\). Backward induction makes the first player stop at the first stage (red arrow), although possible payoffs grow with \(n\).</div>

<div class="dossier-title" id="s5">5. The limits of backward induction</div>
<p>Backward induction assumes that each player is rational, that all know it, and that this knowledge is common at all depths of the tree. In long games, this assumption is fragile: a player who observes unexpected behaviour (continuing at the first node) may revise their belief about the other's rationality. Reputation models (Kreps, Milgrom, Roberts, Wilson, 1982) show that a slight doubt is enough to make cooperation rational for a long time.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Entry game: (stay out, fight) is a Nash equilibrium relying on a non-credible threat; only (enter, accommodate) is perfect.</li>
<li>An irreversible and observable commitment can make a threat credible; it pays if the gain it allows exceeds its cost.</li>
<li>Backward induction with several players: each maximises their own payoff at their nodes, from the bottom up.</li>
<li>Centipede: the perfect equilibrium prescribes stopping immediately, a result contradicted by experiments.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { inv: 'Investissement en capacités', no: 'non', yes: 'oui', enAria: 'Jeu d\'entrée', enRead: v => v === 'yes' ? 'Avec l\'investissement, combattre rapporte 4 au titulaire contre 3 en acceptant : l\'entrant reste dehors et le titulaire obtient 8.' : 'Sans investissement, le titulaire préfère accepter (5 contre 2) : l\'entrant entre, et le titulaire obtient 5 au lieu de 10.', n: 'Nombre d\'étapes n', ceAria: 'Jeu du mille-pattes', ceRead: n => `Induction à rebours : le joueur 1 arrête dès la première étape, gains (2 ; 0). Si personne n'arrêtait, chacun obtiendrait ${n}.`, S: 'A', C: 'C' };
I18N.en.f = { inv: 'Investment in capacity', no: 'no', yes: 'yes', enAria: 'Entry game', enRead: v => v === 'yes' ? 'With the investment, fighting pays the incumbent 4 against 3 by accommodating: the entrant stays out and the incumbent gets 8.' : 'Without investment, the incumbent prefers to accommodate (5 against 2): the entrant enters, and the incumbent gets 5 instead of 10.', n: 'Number of stages n', ceAria: 'Centipede game', ceRead: n => `Backward induction: player 1 stops at the first stage, payoffs (2; 0). If nobody stopped, each would get ${n}.`, S: 'S', C: 'C' };
FIGS.entry = {
  state: { v: 'no' },
  controls: L => [{ key: 'v', type: 'select', label: L.f.inv, options: [{ v: 'no', t: L.f.no }, { v: 'yes', t: L.f.yes }] }],
  draw: function (s, lang) {
    const L = I18N[lang].f, JL = J6L[lang], T = s.v === 'yes' ? j6entry(JL, 8, 3, 3, 2, 4) : j6entry(JL, 10, 3, 5, 2, 2);
    jxBack(T); return { svg: jxTreeSVG(T, { bi: true, lw: 140, aria: L.enAria }), read: L.enRead(s.v) };
  }
};
FIGS.cent = {
  state: { n: 6 },
  controls: L => [{ key: 'n', label: L.f.n, min: 2, max: 10, step: 1, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = s.n, W = 680, H = 190, x0 = 50, dx = (W - 120) / n, y0 = 60;
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${L.ceAria}">`;
    for (let t = 1; t <= n; t++) {
      const x = x0 + (t - 1) * dx, pl = t % 2 ? 1 : 2, pay = pl === 1 ? [t + 1, t - 1] : [t - 1, t + 1];
      svg += `<line x1="${x}" y1="${y0}" x2="${x + dx}" y2="${y0}" stroke="${COL.axis}" stroke-width="1.6"/><line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + 70}" stroke="${t === 1 ? COL.s3 : COL.axis}" stroke-width="${t === 1 ? 3.4 : 1.6}"/>`;
      svg += `<circle cx="${x}" cy="${y0}" r="12" fill="${pl === 1 ? COL.s1 : COL.s2}"/><text x="${x}" y="${y0 + 4.5}" text-anchor="middle" ${FONT_T} font-size="12" font-weight="700" fill="#fff">${pl}</text>`;
      svg += `<text x="${x}" y="${y0 + 88}" text-anchor="middle" ${FONT_M} font-size="11" fill="${COL.ink}">(${pay[0]};${pay[1]})</text>`;
      svg += `<text x="${x + dx / 2}" y="${y0 - 8}" text-anchor="middle" ${FONT_T} font-size="11" font-style="italic" fill="${COL.mute}">${L.C}</text><text x="${x - 8}" y="${y0 + 40}" text-anchor="end" ${FONT_T} font-size="11" font-style="italic" fill="${COL.mute}">${L.S}</text>`;
    }
    svg += `<text x="${x0 + n * dx + 6}" y="${y0 + 4}" ${FONT_M} font-size="11" fill="${COL.ink}">(${n};${n})</text></svg>`;
    return { svg: svg, read: L.ceRead(n) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.M = rint(8, 14); D.aI = rint(3, 7); D.aE = rint(2, 5); D.fI = rint(0, 4); D.fE = rint(1, 4);
    if (D.fI >= D.aI || D.aI >= D.M) continue;
    D.g = D.aI - D.fI + rint(1, 3);                     /* l'investissement augmente le gain de combat de g */
    D.kmax = D.M - D.aI;                                  /* investir est rentable si k < M - aI */
    D.k = pick([1, 2, 3, D.kmax + 1]);
    if (D.k <= 0) continue;
    break;
  }
  /* jeu B : trois joueurs, arbre binaire de profondeur 3 */
  for (;;) {
    const leaf = () => ({ u: [rint(0, 9), rint(0, 9), rint(0, 9)] });
    const n3 = (l) => ({ pl: 3, ch: [{ a: 'x', n: leaf() }, { a: 'y', n: leaf() }] });
    const n2 = () => ({ pl: 2, ch: [{ a: 'g', n: n3() }, { a: 'd', n: n3() }] });
    D.T3 = { pl: 1, ch: [{ a: 'G', n: n2() }, { a: 'D', n: n2() }] };
    /* aucun joueur indifférent */
    let ok = true;
    const chk = n => { if (n.u) return; const v = n.ch.map(c => { chk(c.n); return jxBack(c.n)[n.pl - 1]; }); if (v[0] === v[1]) ok = false; };
    chk(D.T3); if (!ok) continue;
    jxBack(D.T3); break;
  }
  return D;
};
function j6leaves(T) { const out = []; const w = (n, path) => { if (n.u) { out.push({ path: path, u: n.u }); return; } n.ch.forEach(c => w(c.n, path.concat(c.a))); }; w(T, []); return out; }
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J6L.fr, lv = j6leaves(D.T3);
  return String.raw`<div class="context-block">Les deux parties sont indépendantes.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Partie A — Le jeu d'entrée.</strong> Un entrant décide d'entrer sur un marché ou de rester dehors. S'il reste dehors, il gagne 0 et le titulaire garde un profit de monopole \(M=${D.M}\). S'il entre, le titulaire choisit de combattre (gains : entrant \(${-D.fE}\), titulaire \(${D.fI}\)) ou d'accepter (gains : entrant \(${D.aE}\), titulaire \(${D.aI}\)).<ol class="sub-list"><li>Représentez le jeu sous forme extensive puis sous forme normale, et déterminez ses équilibres de Nash en stratégies pures.</li><li>Déterminez l'équilibre parfait en sous-jeux. Quel équilibre de Nash repose sur une menace non crédible ?</li><li>Avant que l'entrant ne décide, le titulaire peut investir dans des capacités, pour un coût \(k\), ce qui augmente de \(${D.g}\) son gain en cas de combat. Montrez que la menace devient alors crédible. Jusqu'à quel coût \(k\) cet investissement est-il rentable ? Le titulaire investit-il si \(k=${D.k}\) ?</li></ol></div></li>
<li><div class="q-text"><strong>Partie B — Un jeu à trois joueurs.</strong> Le joueur 1 choisit G ou D, puis le joueur 2, qui a observé ce choix, choisit g ou d, puis le joueur 3, qui a tout observé, choisit x ou y. Les gains (joueur 1 ; joueur 2 ; joueur 3) sont : ${lv.map(l => '(' + l.path.join(', ') + ') : \\((' + l.u.join('\\,;\\,') + ')\\)').join(' ; ')}.<ol class="sub-list"><li>Déterminez l'équilibre parfait en sous-jeux par induction à rebours, en justifiant chaque étape. Donnez la stratégie complète de chaque joueur et l'issue du jeu.</li><li>Représentez l'arbre en mettant en évidence les choix de l'induction à rebours.</li></ol></div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  const L = J6L.en, lv = j6leaves(D.T3);
  const tr = s => ({ G: 'L', D: 'R', g: 'l', d: 'r' })[s] || s;
  return String.raw`<div class="context-block">The two parts are independent.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Part A — The entry game.</strong> An entrant decides whether to enter a market or stay out. If it stays out, it earns 0 and the incumbent keeps a monopoly profit \(M=${D.M}\). If it enters, the incumbent chooses to fight (payoffs: entrant \(${-D.fE}\), incumbent \(${D.fI}\)) or to accommodate (payoffs: entrant \(${D.aE}\), incumbent \(${D.aI}\)).<ol class="sub-list"><li>Represent the game in extensive form then in normal form, and determine its pure-strategy Nash equilibria.</li><li>Determine the subgame perfect equilibrium. Which Nash equilibrium relies on a non-credible threat?</li><li>Before the entrant decides, the incumbent can invest in capacity, at a cost \(k\), which raises its fighting payoff by \(${D.g}\). Show that the threat then becomes credible. Up to which cost \(k\) is this investment profitable? Does the incumbent invest if \(k=${D.k}\)?</li></ol></div></li>
<li><div class="q-text"><strong>Part B — A three-player game.</strong> Player 1 chooses L or R, then player 2, having observed this choice, chooses l or r, then player 3, having observed everything, chooses x or y. Payoffs (player 1; player 2; player 3) are: ${lv.map(l => '(' + l.path.map(tr).join(', ') + '): \\((' + l.u.join('\\,;\\,') + ')\\)').join('; ')}.<ol class="sub-list"><li>Determine the subgame perfect equilibrium by backward induction, justifying each step. Give each player's complete strategy and the outcome of the game.</li><li>Draw the tree highlighting the backward-induction choices.</li></ol></div></li>
</ol></div>`;
});
function j6sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = J6L[lang], M = D.M, aE = D.aE, aI = D.aI, fE = D.fE, fI = D.fI, g = D.g, k = D.k;
  const tr = s => fr ? s : ({ G: 'L', D: 'R', g: 'l', d: 'r' })[s] || s;
  const T = j6entry(L, M, aE, aI, fE, fI); jxBack(T);
  const U1 = [[0, 0], [-fE, aE]], U2 = [[M, M], [fI, aI]];
  const Ti = j6entry(L, M - k, aE, aI - k, fE, fI + g - k); jxBack(Ti);
  /* partie B : relabel pour l'anglais */
  const relab = n => { if (n.u) return { u: n.u }; return { pl: n.pl, ch: n.ch.map(c => ({ a: tr(c.a), n: relab(c.n) })) }; };
  const T3 = relab(D.T3); jxBack(T3);
  const steps3 = [], s3 = [], s2 = [];
  T3.ch.forEach(c1 => c1.n.ch.forEach(c2 => { const n3 = c2.n, b = n3.best; s3.push(`${T_(['après', 'after'])} (${c1.a}, ${c2.a}) : ${n3.ch.map(c => c.a + ' ' + T_(['donne', 'gives']) + ' ' + c.n.u[2]).join(T_([' et ', ' and ']))} ${T_(['au joueur 3, qui joue', 'to player 3, who plays'])} ${n3.ch[b].a}`); }));
  T3.ch.forEach(c1 => { const n2 = c1.n, b = n2.best; s2.push(`${T_(['après', 'after'])} ${c1.a}, ${T_(['le joueur 2 anticipe les choix du joueur 3 : il obtient', 'player 2 anticipates player 3\'s choices: they get'])} ${n2.ch.map(c => c.n.val[1] + ' ' + T_(['avec', 'with']) + ' ' + c.a).join(T_([' et ', ' and ']))}, ${T_(['et joue', 'and plays'])} ${n2.ch[b].a}`); });
  const r1 = T3.ch.map(c => c.n.val[0]), b1 = T3.best, path = [T3.ch[b1].a, T3.ch[b1].n.ch[T3.ch[b1].n.best].a], last = T3.ch[b1].n.ch[T3.ch[b1].n.best].n;
  path.push(last.ch[last.best].a);
  const strat3 = []; T3.ch.forEach(c1 => c1.n.ch.forEach(c2 => strat3.push(c2.n.ch[c2.n.best].a)));
  const invest = k < M - aI;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['L\'entrant joue en premier ; le titulaire n\'a qu\'un nœud de décision, atteint seulement si l\'entrant entre :', 'The entrant moves first; the incumbent has a single decision node, reached only if the entrant enters:'])}</p>
  <div class="sol-fig">${jxTreeSVG(T, { bi: false, lw: 140, aria: 'entry' })}</div>
  <p>${T_(['Chaque joueur a deux stratégies. Sous forme normale (gain de l\'entrant ; gain du titulaire), si l\'entrant reste dehors, le titulaire gagne', 'Each player has two strategies. In normal form (entrant\'s payoff; incumbent\'s payoff), if the entrant stays out, the incumbent earns'])} ${M} ${T_(['quelle que soit sa stratégie :', 'whatever its strategy:'])}</p>
  <div class="sol-fig">${jxMatrixSVG(U1, U2, { rows: [L.out, L.ent], cols: [L.fi, L.ac], p1: L.E, p2: L.I, br: true, ne: true, cw: 130, aria: 'nf' })}</div>
  <p>${T_(['Face à « combattre », l\'entrant préfère rester dehors', 'Against "fight", the entrant prefers to stay out'])} (\(0&gt;${-fE}\)) ; ${T_(['face à « accepter », il préfère entrer', 'against "accommodate", it prefers to enter'])} (\(${aE}&gt;0\)). ${T_(['Si l\'entrant entre, le titulaire préfère accepter', 'If the entrant enters, the incumbent prefers to accommodate'])} (\(${aI}&gt;${fI}\)) ; ${T_(['s\'il reste dehors, le titulaire est indifférent. Les équilibres de Nash sont donc', 'if it stays out, the incumbent is indifferent. The Nash equilibria are therefore'])} (${L.ent}, ${L.ac}) ${T_(['et', 'and'])} (${L.out}, ${L.fi}).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Par induction à rebours, si l\'entrant entre, le titulaire compare', 'By backward induction, if the entrant enters, the incumbent compares'])} ${fI} ${T_(['(combattre) et', '(fight) and'])} ${aI} ${T_(['(accepter) : il accepte. L\'entrant, qui l\'anticipe, compare', '(accommodate): it accommodates. The entrant, anticipating this, compares'])} ${aE} ${T_(['(entrer) et 0 (rester dehors) : il entre. L\'équilibre parfait est', '(enter) and 0 (stay out): it enters. The perfect equilibrium is'])} (${L.ent}, ${L.ac}), ${T_(['de gains', 'with payoffs'])} \((${aE}\,;\,${aI})\). ${T_(['L\'équilibre', 'The equilibrium'])} (${L.out}, ${L.fi}) ${T_(['repose sur une menace de combat qui ne serait pas exécutée : une fois l\'entrée réalisée, combattre rapporterait', 'relies on a threat to fight that would not be carried out: once entry has occurred, fighting would pay'])} ${fI} ${T_(['au lieu de', 'instead of'])} ${aI}.</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Après investissement, le gain du titulaire est diminué de', 'After investing, the incumbent\'s payoff is reduced by'])} \(k\) ${T_(['dans tous les cas, et augmenté de', 'in all cases, and raised by'])} ${g} ${T_(['en cas de combat. Si l\'entrant entre, le titulaire compare donc', 'in case of a fight. If the entrant enters, the incumbent therefore compares'])} \(${fI}+${g}-k=${fI + g}-k\) ${T_(['et', 'and'])} \(${aI}-k\) : ${T_(['comme', 'since'])} \(${fI + g}&gt;${aI}\), ${T_(['il combat. La menace est devenue crédible ; l\'entrant, qui le sait, reste dehors, et le titulaire obtient', 'it fights. The threat has become credible; the entrant, knowing this, stays out, and the incumbent gets'])} \(${M}-k\). ${T_(['Sans investissement, il obtiendrait', 'Without investing, it would get'])} ${aI} ${T_(['(question 1 b). L\'investissement est rentable si', '(question 1(b)). The investment pays if'])}
  \[${M}-k&gt;${aI}\iff k&lt;${M - aI}\]
  ${invest ? T_(['Avec', 'With']) + ' \\(k=' + k + '\\), ' + T_(['le titulaire investit : il obtient', 'the incumbent invests: it gets']) + ' \\(' + (M - k) + '\\) ' + T_(['au lieu de', 'instead of']) + ' ' + aI + '. ' + T_(['En se liant les mains, il rend sa menace crédible et dissuade l\'entrée.', 'By tying its hands, it makes its threat credible and deters entry.']) : T_(['Avec', 'With']) + ' \\(k=' + k + '\\), ' + T_(['l\'investissement coûte trop cher : le titulaire n\'investit pas et accepte l\'entrée.', 'the investment is too costly: the incumbent does not invest and accommodates entry.'])}</p>
  <div class="sol-fig">${jxTreeSVG(Ti, { bi: true, lw: 140, aria: 'invest' })}</div>
  <p>${T_(['(Arbre du jeu après investissement, gains nets du coût', '(Game tree after investment, payoffs net of the cost'])} \(k=${k}\).)</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['On commence par les nœuds du joueur 3, qui maximise son propre gain (troisième nombre) :', 'We start with player 3\'s nodes, who maximises their own payoff (third number):'])} ${s3.join(' ; ')}.</p>
  <p>${T_(['On remonte aux nœuds du joueur 2, qui maximise le deuxième nombre :', 'We move up to player 2\'s nodes, who maximises the second number:'])} ${s2.join(' ; ')}.</p>
  <p>${T_(['Enfin, le joueur 1 obtient', 'Finally, player 1 gets'])} ${r1[0]} ${T_(['avec', 'with'])} ${T3.ch[0].a} ${T_(['et', 'and'])} ${r1[1]} ${T_(['avec', 'with'])} ${T3.ch[1].a} : ${T_(['il joue', 'they play'])} ${T3.ch[b1].a}. ${T_(['L\'équilibre parfait est formé des stratégies : joueur 1 :', 'The perfect equilibrium consists of the strategies: player 1:'])} ${T3.ch[b1].a} ; ${T_(['joueur 2 :', 'player 2:'])} (${T3.ch.map(c => c.n.ch[c.n.best].a).join(', ')}) ${T_(['après', 'after'])} (${T3.ch.map(c => c.a).join(', ')}) ; ${T_(['joueur 3 :', 'player 3:'])} (${strat3.join(', ')}) ${T_(['à ses quatre nœuds, de gauche à droite. L\'issue est le chemin', 'at their four nodes, from left to right. The outcome is the path'])} (${path.join(', ')}), ${T_(['de gains', 'with payoffs'])} \((${T3.val.join('\\,;\\,')})\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['En rouge, le choix de chaque joueur à chacun de ses nœuds ; le chemin épais est l\'issue de l\'équilibre :', 'In red, each player\'s choice at each of their nodes; the thick path is the equilibrium outcome:'])}</p>
  <div class="sol-fig">${jxTreeSVG(T3, { bi: true, lw: 108, dh: 80, aria: 'three' })}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean(regroupSol(j6sol(D, 'fr'), ["Partie A — Le jeu d'entrée", 'Partie B — Un jeu à trois joueurs'], [3, 2]));
I18N.en.sol = D => fracClean(regroupSol(j6sol(D, 'en'), ['Part A — The entry game', 'Part B — A three-player game'], [3, 2]));