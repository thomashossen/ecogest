I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 8 – Jeux répétés', 'k-h1': 'Jeux répétés et coopération', 'k-coursetitle': 'Répéter le dilemme du prisonnier : horizon fini, stratégies de déclenchement, punitions limitées et théorème folk', 'k-extitle': 'Soutenir la coopération dans un dilemme du prisonnier répété', 'k-soltitle': 'Soutenir la coopération dans un dilemme du prisonnier répété' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 8 – Repeated games', 'k-h1': 'Repeated games and cooperation', 'k-coursetitle': 'Repeating the prisoner\'s dilemma: finite horizon, trigger strategies, limited punishments and the folk theorem', 'k-extitle': 'Sustaining cooperation in a repeated prisoner\'s dilemma', 'k-soltitle': 'Sustaining cooperation in a repeated prisoner\'s dilemma' });

/* ---------- outils ---------- */
const j8crit = (T, R, P) => (T - R) / (T - P);
/* plus petite durée de punition k telle que T - R <= somme_{t=1..k} delta^t (R - P) ; Infinity si impossible */
function j8k(T, R, P, d) { let s = 0; for (let k = 1; k <= 200; k++) { s += Math.pow(d, k) * (R - P); if (T - R <= s + 1e-12) return k; } return Infinity; }

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez montrer qu'un dilemme du prisonnier répété un nombre fini de fois n'aboutit jamais à la coopération, calculer le facteur d'actualisation au-dessus duquel une stratégie de déclenchement soutient la coopération quand la répétition est infinie, dimensionner une punition limitée, et énoncer le théorème folk.<br><br>
<strong>Pourquoi ?</strong> Les entreprises d'un même marché, les pays d'une alliance, les partenaires commerciaux se rencontrent encore et encore. La perspective du lendemain change les incitations d'aujourd'hui : la coopération, impossible dans le jeu joué une fois, peut devenir un équilibre. C'est le fondement de la théorie de la collusion tacite (page Cartel).<br><br>
<strong>Prérequis.</strong> Dilemme du prisonnier (Théorie des jeux 1), induction à rebours (Théorie des jeux 5), séries géométriques.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le jeu répété</a> · <a href="#s2">2. Horizon fini</a> · <a href="#s3">3. Horizon infini</a> · <a href="#s4">4. Punitions limitées</a> · <a href="#s5">5. Théorème folk</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le jeu répété</div>
<p>On répète un même jeu, le <em>jeu de base</em>, à chaque période \(t=0,1,2,\ldots\), et chaque joueur observe les actions passées. Une stratégie dit quoi jouer à chaque période en fonction de tout l'historique. Les gains futurs sont actualisés par un facteur \(\delta\in\,]0,1[\) : un gain \(g_t\) à la période \(t\) vaut \(\delta^tg_t\) aujourd'hui. On peut aussi lire \(\delta\) comme la probabilité que le jeu continue une période de plus. On note \(T&gt;R&gt;P&gt;S\) les gains du dilemme du prisonnier (tentation, récompense, punition, gain du dupe).</p>

<div class="dossier-title" id="s2">2. Horizon fini : la coopération s'effondre</div>
<p>Si le jeu est répété un nombre fini \(N\) de fois, connu de tous, on raisonne à rebours. À la dernière période, il n'y a plus d'avenir : on joue le jeu de base, et chacun dénonce. À l'avant-dernière, comme la dernière période est déjà déterminée, rien de ce qu'on fait ne sera récompensé ou puni : chacun dénonce encore. De proche en proche, l'unique équilibre parfait consiste à dénoncer à toutes les périodes. Ce raisonnement, rigoureux, est contredit par l'expérience, comme celui du mille-pattes.</p>

<div class="dossier-title" id="s3">3. Horizon infini : la stratégie de déclenchement</div>
<p>Si le jeu n'a pas de dernière période, la menace de représailles futures devient possible. La stratégie de <em>déclenchement</em> (« grim trigger ») consiste à coopérer tant que tout le monde a coopéré, et à dénoncer pour toujours dès qu'une déviation est observée. Si les deux joueurs l'adoptent, coopérer rapporte \(R\) à chaque période ; dévier rapporte \(T\) une fois, puis \(P\) pour toujours. Les sommes de séries géométriques donnent la condition :
\[\frac{R}{1-\delta}\ge T+\frac{\delta P}{1-\delta}\iff\delta\ge\delta^*=\frac{T-R}{T-P}\]
La coopération est un équilibre parfait si les joueurs sont assez patients : le gain immédiat de la trahison, \(T-R\), est alors inférieur à la perte future \(\frac{\delta}{1-\delta}(R-P)\). La punition est crédible, puisque dénoncer pour toujours est un équilibre de Nash du jeu de base répété.</p>
<div class="ifig" data-fig="cum"></div>
<div class="fig-cap">Figure 1 — Gains cumulés actualisés en coopérant toujours (bleu) et en déviant à la période 0 (rouge), pour \(T=5\), \(R=3\), \(P=1\). La déviation gagne au début, mais la coopération rattrape son retard si \(\delta\) dépasse \(\delta^*=\frac12\). Faites varier \(\delta\) de part et d'autre du seuil.</div>

<div class="dossier-title" id="s4">4. Des punitions limitées</div>
<p>Une punition éternelle est sévère, et un malentendu y mène irrémédiablement. Une punition de \(k\) périodes suffit si la perte qu'elle inflige au tricheur dépasse son gain immédiat :
\[T-R\le\sum_{t=1}^{k}\delta^t\,(R-P)=\delta\,\frac{1-\delta^k}{1-\delta}\,(R-P)\]
Plus \(\delta\) est proche de 1, plus la punition peut être courte. La stratégie « donnant-donnant » (« tit for tat »), qui reproduit à chaque période l'action de l'autre à la période précédente, a remporté les tournois d'Axelrod (1984) : elle est bienveillante, rétorsive, indulgente et claire.</p>

<div class="dossier-title" id="s5">5. Le théorème folk</div>
<p>Le <em>théorème folk</em> affirme que, pour \(\delta\) assez proche de 1, tout couple de gains moyens réalisable (combinaison des gains du jeu de base) et individuellement rationnel (supérieur au gain que chacun peut se garantir, ici \(P\)) peut être obtenu à un équilibre parfait du jeu répété. La répétition rend la coopération possible, mais elle rend possibles beaucoup d'autres issues : le jeu répété a une multitude d'équilibres.</p>
<div class="ifig" data-fig="folk"></div>
<div class="fig-cap">Figure 2 — Ensemble des gains moyens réalisables (polygone bleu clair), et partie individuellement rationnelle, où chacun obtient au moins \(P\) (zone foncée). Selon le théorème folk, tout point de cette zone est un équilibre parfait du jeu répété pour \(\delta\) assez grand ; la coopération (R, R) en fait partie.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Horizon fini connu : l'induction à rebours fait dénoncer à toutes les périodes.</li>
<li>Horizon infini, stratégie de déclenchement : coopération soutenue si \(\delta\ge\frac{T-R}{T-P}\).</li>
<li>Punition de \(k\) périodes : elle suffit si \(T-R\le\sum_{t=1}^{k}\delta^t(R-P)\).</li>
<li>Théorème folk : tout gain réalisable et individuellement rationnel est un équilibre pour \(\delta\) assez grand.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can show that a prisoner's dilemma repeated a finite number of times never leads to cooperation, compute the discount factor above which a trigger strategy sustains cooperation under infinite repetition, size a limited punishment, and state the folk theorem.<br><br>
<strong>Why?</strong> Firms in the same market, countries in an alliance, trading partners meet again and again. The prospect of tomorrow changes today's incentives: cooperation, impossible in the one-shot game, can become an equilibrium. This is the foundation of the theory of tacit collusion (Cartel page).<br><br>
<strong>Prerequisites.</strong> Prisoner's dilemma (Game theory 1), backward induction (Game theory 5), geometric series.
</div>
<p class="toc">Contents: <a href="#s1">1. The repeated game</a> · <a href="#s2">2. Finite horizon</a> · <a href="#s3">3. Infinite horizon</a> · <a href="#s4">4. Limited punishments</a> · <a href="#s5">5. Folk theorem</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The repeated game</div>
<p>The same game, the <em>stage game</em>, is repeated at each period \(t=0,1,2,\ldots\), and each player observes past actions. A strategy says what to play at each period depending on the whole history. Future payoffs are discounted by a factor \(\delta\in(0,1)\): a payoff \(g_t\) at period \(t\) is worth \(\delta^tg_t\) today. \(\delta\) can also be read as the probability that the game continues one more period. We write \(T&gt;R&gt;P&gt;S\) for the payoffs of the prisoner's dilemma (temptation, reward, punishment, sucker's payoff).</p>

<div class="dossier-title" id="s2">2. Finite horizon: cooperation unravels</div>
<p>If the game is repeated a finite number \(N\) of times, known to all, we reason backwards. In the last period, there is no future: the stage game is played, and each denounces. In the period before, since the last period is already determined, nothing one does will be rewarded or punished: each denounces again. Step by step, the unique perfect equilibrium is to denounce in every period. This rigorous reasoning is contradicted by experiments, like that of the centipede.</p>

<div class="dossier-title" id="s3">3. Infinite horizon: the trigger strategy</div>
<p>If the game has no last period, the threat of future retaliation becomes possible. The <em>grim trigger</em> strategy consists in cooperating as long as everyone has cooperated, and denouncing forever as soon as a deviation is observed. If both players adopt it, cooperating yields \(R\) every period; deviating yields \(T\) once, then \(P\) forever. Sums of geometric series give the condition:
\[\frac{R}{1-\delta}\ge T+\frac{\delta P}{1-\delta}\iff\delta\ge\delta^*=\frac{T-R}{T-P}\]
Cooperation is a perfect equilibrium if players are patient enough: the immediate gain from betrayal, \(T-R\), is then below the future loss \(\frac{\delta}{1-\delta}(R-P)\). The punishment is credible, since denouncing forever is a Nash equilibrium of the repeated stage game.</p>
<div class="ifig" data-fig="cum"></div>
<div class="fig-cap">Figure 1 — Cumulative discounted payoffs from always cooperating (blue) and from deviating at period 0 (red), for \(T=5\), \(R=3\), \(P=1\). Deviation gains at first, but cooperation catches up if \(\delta\) exceeds \(\delta^*=\frac12\). Vary \(\delta\) on either side of the threshold.</div>

<div class="dossier-title" id="s4">4. Limited punishments</div>
<p>An eternal punishment is harsh, and a misunderstanding leads to it irreversibly. A punishment of \(k\) periods suffices if the loss it inflicts on the cheater exceeds their immediate gain:
\[T-R\le\sum_{t=1}^{k}\delta^t\,(R-P)=\delta\,\frac{1-\delta^k}{1-\delta}\,(R-P)\]
The closer \(\delta\) is to 1, the shorter the punishment can be. The "tit for tat" strategy, which copies at each period the other's action in the previous period, won Axelrod's tournaments (1984): it is nice, retaliatory, forgiving and clear.</p>

<div class="dossier-title" id="s5">5. The folk theorem</div>
<p>The <em>folk theorem</em> states that, for \(\delta\) close enough to 1, any pair of average payoffs that is feasible (a combination of stage-game payoffs) and individually rational (above what each can guarantee themselves, here \(P\)) can be obtained in a perfect equilibrium of the repeated game. Repetition makes cooperation possible, but it makes many other outcomes possible too: the repeated game has a multitude of equilibria.</p>
<div class="ifig" data-fig="folk"></div>
<div class="fig-cap">Figure 2 — Set of feasible average payoffs (light blue polygon), and its individually rational part, where each gets at least \(P\) (darker area). By the folk theorem, any point of this area is a perfect equilibrium of the repeated game for large enough \(\delta\); cooperation (R, R) is one of them.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Known finite horizon: backward induction makes players denounce in every period.</li>
<li>Infinite horizon, trigger strategy: cooperation sustained if \(\delta\ge\frac{T-R}{T-P}\).</li>
<li>A punishment of \(k\) periods suffices if \(T-R\le\sum_{t=1}^{k}\delta^t(R-P)\).</li>
<li>Folk theorem: any feasible, individually rational payoff is an equilibrium for large enough \(\delta\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { d: 'Facteur d\'actualisation δ', t: 'période', co: 'coopérer toujours', de: 'dévier en 0', cumAria: 'Gains cumulés actualisés', cumRead: (d, a, b) => `Valeur totale : coopérer <span class="v">${fmt(a, 2)}</span>, dévier <span class="v">${fmt(b, 2)}</span> : ` + (a >= b ? 'la coopération est soutenable.' : 'dévier est profitable.'), u1: 'gain moyen du joueur 1', u2: 'gain moyen du joueur 2', fe: 'réalisable', ir: 'réalisable et individuellement rationnel', folkAria: 'Théorème folk' };
I18N.en.f = { d: 'Discount factor δ', t: 'period', co: 'always cooperate', de: 'deviate at 0', cumAria: 'Cumulative discounted payoffs', cumRead: (d, a, b) => `Total value: cooperate <span class="v">${fmt(a, 2)}</span>, deviate <span class="v">${fmt(b, 2)}</span>: ` + (a >= b ? 'cooperation is sustainable.' : 'deviating pays.'), u1: 'player 1 average payoff', u2: 'player 2 average payoff', fe: 'feasible', ir: 'feasible and individually rational', folkAria: 'Folk theorem' };
FIGS.cum = {
  state: { d: 0.6 },
  controls: L => [{ key: 'd', label: L.f.d, min: 0.1, max: 0.95, step: 0.05, fmt: v => fmtT(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, T = 5, R = 3, P = 1, d = s.d, N = 20, A = [], B = []; let a = 0, b = 0;
    for (let t = 0; t <= N; t++) { a += Math.pow(d, t) * R; b += Math.pow(d, t) * (t === 0 ? T : P); A.push([t, a]); B.push([t, b]); }
    const ymax = Math.ceil(Math.max(a, b) + 1);
    const G = Plot({ w: 680, h: 300, x0: 0, x1: N, y0: 0, y1: ymax, mt: 26, mb: 42 });
    G.axes({ xt: [0, 5, 10, 15, 20], yt: ticks(0, ymax, 5), xl: L.t, xf: v => String(v), yf: v => fmtT(v, 0) });
    G.line(A, { c: COL.s1, w: 2.4 }); G.line(B, { c: COL.s3, w: 2.4 });
    G.legend([{ c: COL.s1, t: L.co }, { c: COL.s3, t: L.de }], G.ml + 8, 16);
    return { svg: G.svg(L.cumAria), read: L.cumRead(d, R / (1 - d), T + d * P / (1 - d)) };
  }
};
function j8folk(T, R, P, S, lang) {
  const L = I18N[lang].f, mx = T + 0.5, mn = Math.min(0, S) - 0.5;
  const G = Plot({ w: 460, h: 460, x0: mn, x1: mx, y0: mn, y1: mx, mt: 52, mb: 42, ml: 46 });
  G.axes({ xt: ticks(Math.ceil(mn), T, 5), yt: ticks(Math.ceil(mn), T, 5), xl: L.u1, yl: L.u2, xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  const poly = [[R, R], [T, S], [P, P], [S, T]];
  G.add(`<path d="${G.pts(poly)} Z" fill="${COL.s1}" fill-opacity="0.15" stroke="${COL.s1}" stroke-width="1.5"/>`);
  /* partie où u1 >= P et u2 >= P : intersection du polygone avec le quadrant */
  const clip = []; const inQ = p => p[0] >= P - 1e-9 && p[1] >= P - 1e-9;
  for (let k = 0; k < 4; k++) { const A = poly[k], B = poly[(k + 1) % 4]; if (inQ(A)) clip.push(A); for (const ax of [0, 1]) { if ((A[ax] - P) * (B[ax] - P) < 0) { const t = (P - A[ax]) / (B[ax] - A[ax]), Q = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]; if (inQ(Q)) clip.push(Q); } } }
  const cx = clip.reduce((s, p) => s + p[0], 0) / clip.length, cy = clip.reduce((s, p) => s + p[1], 0) / clip.length;
  clip.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
  G.add(`<path d="${G.pts(clip)} Z" fill="${COL.s1}" fill-opacity="0.4"/>`);
  [['R', R, R], ['T,S', T, S], ['P', P, P], ['S,T', S, T]].forEach(p => { G.dot(p[1], p[2], { c: COL.ink, r: 4.5 }); G.text(p[1], p[2], '(' + fmtT(p[1], 1) + ' ; ' + fmtT(p[2], 1) + ')', { dx: p[0] === 'T,S' ? -8 : 8, dy: -8, anchor: p[0] === 'T,S' ? 'end' : 'start', size: 11, mono: true }); });
  G.legend([{ c: COL.s1, box: true, o: 0.2, t: L.fe }, { c: COL.s1, box: true, o: 0.5, t: L.ir }], G.ml + 4, 16);
  return '<div style="max-width:480px;margin:0 auto">' + G.svg(L.folkAria) + '</div>';
}
FIGS.folk = { state: {}, controls: L => [], draw: function (s, lang) { return { svg: j8folk(5, 3, 1, 0, lang), read: '' }; } };

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) { D.T = rint(6, 12); D.R = rint(4, 9); D.P = rint(1, 5); D.S = rint(0, 3); if (D.T > D.R && D.R > D.P && D.P > D.S && 2 * D.R > D.T + D.S) break; }
  D.N = rint(5, 20); D.crit = j8crit(D.T, D.R, D.P);
  D.d = pick([0.3, 0.4, 0.6, 0.7, 0.8, 0.9]);
  D.d2 = Math.min(0.95, Math.max(D.crit + 0.05, 0.75));
  D.d2 = Math.round(D.d2 * 100) / 100;
  D.k = j8k(D.T, D.R, D.P, D.d2);
  return D;
};
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Deux entreprises jouent à chaque période le jeu suivant, où C signifie coopérer (respecter un accord de prix élevés) et D dévier (baisser son prix). Les gains sont en millions d'euros par période.</div>
${jxTable([[D.R, D.S], [D.T, D.P]], [[D.R, D.T], [D.S, D.P]], ['C', 'D'], ['C', 'D'], '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">Déterminez l'équilibre de Nash du jeu joué une seule fois. Est-il efficace ?</div></li>
<li><div class="q-text">Le jeu est répété \(N=${D.N}\) fois, et les deux entreprises le savent. Déterminez l'équilibre parfait en sous-jeux.</div></li>
<li><div class="q-text">Le jeu est maintenant répété indéfiniment, avec un facteur d'actualisation \(\delta\). Chaque entreprise adopte la stratégie de déclenchement. À quelle condition sur \(\delta\) la coopération est-elle un équilibre ? L'est-elle pour \(\delta=${fmtT(D.d, 2)}\) ?</div></li>
<li><div class="q-text">Avec \(\delta=${fmtT(D.d2, 2)}\), on remplace la punition éternelle par une punition de \(k\) périodes, après lesquelles on revient à la coopération. Quelle est la plus petite valeur de \(k\) qui dissuade la déviation ?</div></li>
<li><div class="q-text">Représentez les gains cumulés actualisés de la coopération et de la déviation pour \(\delta=${fmtT(D.d, 2)}\), puis l'ensemble des gains moyens réalisables et individuellement rationnels. Que dit le théorème folk ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Two firms play the following game every period, where C means cooperate (keep a high-price agreement) and D means deviate (cut one's price). Payoffs are in millions of euros per period.</div>
${jxTable([[D.R, D.S], [D.T, D.P]], [[D.R, D.T], [D.S, D.P]], ['C', 'D'], ['C', 'D'], '1 \\ 2')}
<div class="questions"><ol>
<li><div class="q-text">Determine the Nash equilibrium of the one-shot game. Is it efficient?</div></li>
<li><div class="q-text">The game is repeated \(N=${D.N}\) times, and both firms know it. Determine the subgame perfect equilibrium.</div></li>
<li><div class="q-text">The game is now repeated indefinitely, with a discount factor \(\delta\). Each firm adopts the trigger strategy. Under which condition on \(\delta\) is cooperation an equilibrium? Is it for \(\delta=${fmtT(D.d, 2)}\)?</div></li>
<li><div class="q-text">With \(\delta=${fmtT(D.d2, 2)}\), the eternal punishment is replaced by a punishment lasting \(k\) periods, after which cooperation resumes. What is the smallest \(k\) that deters deviation?</div></li>
<li><div class="q-text">Draw the cumulative discounted payoffs of cooperation and deviation for \(\delta=${fmtT(D.d, 2)}\), then the set of feasible and individually rational average payoffs. What does the folk theorem say?</div></li>
</ol></div>`;
});
function j8sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], T = D.T, R = D.R, P = D.P, S = D.S, d = D.d, d2 = D.d2, n4 = x => texT(x, 4);
  const ok = d >= D.crit, k = D.k;
  const sumk = kk => { let s = 0; for (let t = 1; t <= kk; t++) s += Math.pow(d2, t) * (R - P); return s; };
  const N = 20, A = [], B = []; let a = 0, b = 0;
  for (let t = 0; t <= N; t++) { a += Math.pow(d, t) * R; b += Math.pow(d, t) * (t === 0 ? T : P); A.push([t, a]); B.push([t, b]); }
  const ymax = Math.ceil(Math.max(a, b) + 1), G = Plot({ w: 640, h: 300, x0: 0, x1: N, y0: 0, y1: ymax, mt: 26, mb: 42 });
  G.axes({ xt: [0, 5, 10, 15, 20], yt: ticks(0, ymax, 5), xl: T_(['période', 'period']), xf: v => String(v), yf: v => fmtT(v, 0) });
  G.line(A, { c: COL.s1, w: 2.4 }); G.line(B, { c: COL.s3, w: 2.4 });
  G.legend([{ c: COL.s1, t: T_(['coopérer toujours', 'always cooperate']) }, { c: COL.s3, t: T_(['dévier en 0', 'deviate at 0']) }], G.ml + 8, 16);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Si l\'autre coopère, dévier rapporte', 'If the other cooperates, deviating pays'])} ${T} ${T_(['contre', 'against'])} ${R} ; ${T_(['s\'il dévie, dévier rapporte', 'if they deviate, deviating pays'])} ${P} ${T_(['contre', 'against'])} ${S}. ${T_(['Dévier est une stratégie strictement dominante pour chacun : l\'unique équilibre de Nash est (D, D), de gains', 'Deviating is a strictly dominant strategy for each: the unique Nash equilibrium is (D, D), with payoffs'])} \((${P}\,;\,${P})\). ${T_(['Il est dominé au sens de Pareto par (C, C), qui donne', 'It is Pareto-dominated by (C, C), which gives'])} \((${R}\,;\,${R})\) : ${T_(['c\'est un dilemme du prisonnier.', 'it is a prisoner\'s dilemma.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['On raisonne à rebours. À la période', 'We reason backwards. At period'])} ${D.N}, ${T_(['la dernière, aucune période ne suit : les entreprises jouent le jeu de base, et chacune dévie. À la période', 'the last, no period follows: firms play the stage game, and each deviates. At period'])} ${D.N - 1}, ${T_(['ce qui se passera à la dernière période est déjà déterminé, quoi qu\'on fasse aujourd\'hui : coopérer ne serait pas récompensé, et chacune dévie encore. Le même argument s\'applique à toutes les périodes précédentes : l\'unique équilibre parfait consiste à dévier à chaque période, et chaque entreprise obtient', 'what will happen at the last period is already determined, whatever is done today: cooperating would not be rewarded, and each deviates again. The same argument applies to all earlier periods: the unique perfect equilibrium is to deviate in every period, and each firm gets'])} ${P} ${T_(['par période.', 'per period.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si les deux entreprises suivent la stratégie de déclenchement, coopérer rapporte', 'If both firms follow the trigger strategy, cooperating yields'])} ${R} ${T_(['à chaque période. Une entreprise qui dévie obtient', 'every period. A firm that deviates gets'])} ${T} ${T_(['une fois, puis', 'once, then'])} ${P} ${T_(['pour toujours, puisque l\'autre la punit. En sommant les séries géométriques :', 'forever, since the other punishes it. Summing the geometric series:'])}
  \[\begin{aligned}\frac{${R}}{1-\delta}\ge ${T}+\frac{${P}\,\delta}{1-\delta}&amp;\iff ${R}\ge ${T}\,(1-\delta)+${P}\,\delta&amp;&amp;\text{${T_(['en multipliant par', 'multiplying by'])} }1-\delta&gt;0\\&amp;\iff\delta\ge\delta^*=\frac{${T}-${R}}{${T}-${P}}=${fqa(D.crit)}\end{aligned}\]
  ${ok ? T_(['Avec', 'With']) + ' \\(\\delta=' + texT(d, 2) + '\\ge\\delta^*\\), ' + T_(['la coopération est un équilibre parfait : la perte future liée à la punition l\'emporte sur le gain immédiat de la déviation.', 'cooperation is a perfect equilibrium: the future loss from punishment outweighs the immediate gain from deviating.']) : T_(['Avec', 'With']) + ' \\(\\delta=' + texT(d, 2) + '&lt;\\delta^*\\), ' + T_(['la coopération n\'est pas soutenable : les entreprises accordent trop peu de poids à l\'avenir.', 'cooperation is not sustainable: firms give too little weight to the future.'])} ${T_(['La punition est crédible : dévier pour toujours est un équilibre de Nash à chaque période, donc dans chaque sous-jeu.', 'The punishment is credible: deviating forever is a Nash equilibrium in every period, hence in every subgame.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Une déviation rapporte', 'A deviation yields'])} \(${T}-${R}=${T - R}\) ${T_(['de plus à la période où elle a lieu, puis fait perdre', 'more in the period it occurs, then costs'])} \(${R}-${P}=${R - P}\) ${T_(['à chacune des', 'in each of the'])} \(k\) ${T_(['périodes de punition. Actualisée au moment de la déviation, la perte vaut', 'punishment periods. Discounted to the time of deviation, the loss is'])} \(\sum_{t=1}^{k}\delta^t(${R - P})\). ${T_(['On cherche le plus petit', 'We look for the smallest'])} \(k\) ${T_(['tel que cette perte dépasse le gain :', 'such that this loss exceeds the gain:'])}
  \[${T - R}\le ${R - P}\times\big(${[1, 2, 3].map(t => texT(d2, 2) + (t > 1 ? '^' + t : '')).join('+')}+\cdots\big)\]
  ${isFinite(k) ? T_(['Les sommes partielles valent', 'The partial sums are']) + ' ' + [...Array(Math.min(k, 6))].map((_, i) => '\\(' + n4(sumk(i + 1)) + '\\)').join(T_([' ; ', '; '])) + (k > 6 ? '…' : '') + ' : ' + T_(['la condition est satisfaite pour la première fois à', 'the condition first holds at']) + ' \\(k=' + k + '\\). ' + T_(['Une punition de', 'A punishment of']) + ' ' + k + ' ' + T_(['période(s) suffit donc à dissuader la déviation, sans condamner les entreprises à une guerre des prix éternelle.', 'period(s) is therefore enough to deter deviation, without condemning firms to an eternal price war.']) : T_(['Même une punition infinie ne suffit pas, puisque', 'Even an infinite punishment is not enough, since']) + ' \\(\\delta&lt;\\delta^*\\).'}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Gains cumulés actualisés pour', 'Cumulative discounted payoffs for'])} \(\delta=${fqa(d)}\) : ${ok ? T_(['la courbe de la coopération finit par dépasser celle de la déviation.', 'the cooperation curve ends up above the deviation curve.']) : T_(['la courbe de la déviation reste au-dessus.', 'the deviation curve stays above.'])}</p>
  <div class="sol-fig">${G.svg('cum')}</div>
  <p>${T_(['Les gains moyens réalisables sont les combinaisons convexes des quatre couples du jeu de base ; ils sont individuellement rationnels si chacun obtient au moins', 'Feasible average payoffs are the convex combinations of the four stage-game pairs; they are individually rational if each gets at least'])} ${P}, ${T_(['ce que chaque entreprise peut se garantir en déviant toujours :', 'what each firm can guarantee itself by always deviating:'])}</p>
  ${j8folk(T, R, P, S, lang)}
  <p>${T_(['Selon le théorème folk, pour', 'By the folk theorem, for'])} \(\delta\) ${T_(['assez proche de 1, tout point de la zone foncée, et en particulier la coopération', 'close enough to 1, any point in the dark area, and in particular cooperation'])} \((${R}\,;\,${R})\), ${T_(['est le gain moyen d\'un équilibre parfait du jeu répété. La répétition rend la collusion tacite possible, mais elle ne permet pas de prédire quel équilibre sera joué.', 'is the average payoff of a perfect equilibrium of the repeated game. Repetition makes tacit collusion possible, but does not predict which equilibrium will be played.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => j8sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => j8sol(D, 'en'))(D));