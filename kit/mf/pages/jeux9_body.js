I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Théorie des jeux 9 – Information incomplète', 'k-h1': 'Jeux à information incomplète', 'k-coursetitle': 'Types, croyances et équilibre bayésien : le duopole de Cournot avec un coût privé', 'k-extitle': 'Cournot avec coût privé : équilibre bayésien et valeur de l\'information', 'k-soltitle': 'Cournot avec coût privé : équilibre bayésien et valeur de l\'information' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Game theory 9 – Incomplete information', 'k-h1': 'Games of incomplete information', 'k-coursetitle': 'Types, beliefs and Bayesian equilibrium: the Cournot duopoly with a private cost', 'k-extitle': 'Cournot with a private cost: Bayesian equilibrium and the value of information', 'k-soltitle': 'Cournot with a private cost: Bayesian equilibrium and the value of information' });

/* ---------- outils : P = a - Q, coût c1 connu, coût de l'entreprise 2 : cH (proba th) ou cL ---------- */
function j9eq(a, c1, cH, cL, th) {
  const Ec = th * cH + (1 - th) * cL, q1 = (a - 2 * c1 + Ec) / 3, q2H = (a - cH - q1) / 2, q2L = (a - cL - q1) / 2;
  const st = (q2, c) => { const Q = q1 + q2, P = a - Q; return { q2: q2, Q: Q, P: P, pi1: (P - c1) * q1, pi2: (P - c) * q2, SC: Q * Q / 2 }; };
  const ci = c => { const x1 = (a - 2 * c1 + c) / 3, x2 = (a - 2 * c + c1) / 3, Q = x1 + x2, P = a - Q; return { q1: x1, q2: x2, Q: Q, P: P, pi1: (P - c1) * x1, pi2: (P - c) * x2, SC: Q * Q / 2 }; };
  return { Ec: Ec, q1: q1, H: st(q2H, cH), L: st(q2L, cL), CH: ci(cH), CL: ci(cL) };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez décrire un jeu où un joueur détient une information privée, représenter cette information par des <em>types</em> et des <em>croyances</em>, définir l'équilibre bayésien de Nash, le calculer dans un duopole de Cournot où le coût d'une entreprise est inconnu de l'autre, et le comparer à l'équilibre en information complète.<br><br>
<strong>Pourquoi ?</strong> Une entreprise connaît rarement les coûts de ses concurrents, un vendeur ignore la disposition à payer de l'acheteur, un assureur ne connaît pas le risque de l'assuré. Harsanyi (1967) a montré comment ramener ces situations à des jeux que l'on sait résoudre : c'est le point de départ de l'économie de l'information.<br><br>
<strong>Prérequis.</strong> Équilibre de Nash (Théorie des jeux 3), duopole de Cournot (Économie industrielle 3), espérance.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Information incomplète</a> · <a href="#s2">2. Types et croyances</a> · <a href="#s3">3. Équilibre bayésien</a> · <a href="#s4">4. Cournot avec coût privé</a> · <a href="#s5">5. Information complète et incomplète</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Information incomplète</div>
<p>Un jeu est à <em>information incomplète</em> quand certains joueurs ignorent une caractéristique d'un autre joueur qui influence ses gains : son coût, ses préférences, sa qualité. Ce n'est pas la même chose que l'information imparfaite, où l'on ignore une action passée. Sans précaution, l'analyse se heurte à une régression infinie : ce que je crois de ton coût, ce que tu crois que je crois, etc.</p>

<div class="dossier-title" id="s2">2. Types et croyances</div>
<p>Harsanyi propose de supposer que la Nature tire, au début du jeu, le <em>type</em> de chaque joueur (par exemple un coût élevé \(c_H\) ou faible \(c_L\)) selon une loi de probabilité connue de tous, la <em>croyance a priori</em>. Chaque joueur observe son propre type, mais pas celui des autres. Une stratégie est alors une <em>fonction</em> qui associe une action à chaque type possible : l'entreprise 2 choisit une quantité \(q_2(c_H)\) si son coût est élevé et \(q_2(c_L)\) s'il est faible, même si un seul des deux cas se produira.</p>

<div class="dossier-title" id="s3">3. L'équilibre bayésien de Nash</div>
<p>Un profil de stratégies est un <em>équilibre bayésien de Nash</em> si chaque type de chaque joueur maximise son gain <em>espéré</em>, compte tenu de sa croyance sur les types des autres et de leurs stratégies. C'est l'équilibre de Nash du jeu dans lequel on considère chaque type comme un joueur à part. Le joueur non informé répond à l'action <em>moyenne</em> de son adversaire ; chaque type du joueur informé répond à l'action du joueur non informé, qui est la même quel que soit ce type.</p>

<div class="dossier-title" id="s4">4. Cournot avec un coût privé</div>
<p>Deux entreprises font face à la demande \(P=a-Q\). L'entreprise 1 a un coût marginal \(c_1\) connu de tous. Le coût de l'entreprise 2 vaut \(c_H\) avec probabilité \(\theta\) et \(c_L\) avec probabilité \(1-\theta\) ; elle seule le connaît. Chaque type de l'entreprise 2 maximise \((a-q_1-q_2-c)\,q_2\), d'où \(q_2(c)=\frac{a-c-q_1}{2}\). L'entreprise 1 maximise son profit espéré \(\big(a-q_1-\mathbb{E}[q_2]-c_1\big)\,q_1\), d'où \(q_1=\frac{a-c_1-\mathbb{E}[q_2]}{2}\). En posant \(\bar c=\theta c_H+(1-\theta)c_L\), la résolution donne :
\[q_1^*=\frac{a-2c_1+\bar c}{3},\qquad q_2^*(c)=\frac{a-c-q_1^*}{2}\]
L'entreprise 1 se comporte comme si son concurrent avait le coût moyen \(\bar c\).</p>
<div class="ifig" data-fig="bay"></div>
<div class="fig-cap">Figure 1 — Fonction de réaction de l'entreprise 1 (bleu), qui répond à la quantité espérée de l'entreprise 2, et fonctions de réaction des deux types de l'entreprise 2 (doré), pour \(a=100\), \(c_1=20\), \(c_H=40\), \(c_L=10\). Les points rouges sont les quantités d'équilibre de chaque type, le point noir la quantité espérée. Faites varier la probabilité \(\theta\) du coût élevé : la production de l'entreprise 1 s'ajuste au coût moyen.</div>

<div class="dossier-title" id="s5">5. Information complète et incomplète</div>
<p>Si l'entreprise 1 connaissait le coût de sa concurrente, elle produirait \(\frac{a-2c_1+c}{3}\) : plus face à un concurrent coûteux, moins face à un concurrent efficace. En information incomplète, elle produit une quantité intermédiaire. Le type à coût élevé en profite (son concurrent produit moins qu'il ne le ferait s'il connaissait son coût), le type à coût faible en pâtit. L'information a donc une valeur : chacun peut chercher à la révéler ou à la cacher, ce qui ouvre la voie aux modèles de signal et de sélection adverse.</p>
<div class="ifig" data-fig="cmp"></div>
<div class="fig-cap">Figure 2 — Quantités d'équilibre en information incomplète (barres pleines) et en information complète (barres claires), selon le type réalisé de l'entreprise 2, avec les données de la figure 1 et \(\theta=0.5\).</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Information incomplète : un joueur ignore une caractéristique de l'autre ; on la modélise par des types tirés selon une loi connue de tous.</li>
<li>Stratégie : une action pour chaque type ; équilibre bayésien : chaque type maximise son gain espéré.</li>
<li>Cournot avec coût privé : \(q_1^*=\frac{a-2c_1+\bar c}{3}\), \(q_2^*(c)=\frac{a-c-q_1^*}{2}\).</li>
<li>L'asymétrie d'information profite au type à coût élevé et nuit au type à coût faible.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can describe a game where a player holds private information, represent this information with <em>types</em> and <em>beliefs</em>, define the Bayesian Nash equilibrium, compute it in a Cournot duopoly where one firm's cost is unknown to the other, and compare it with the complete-information equilibrium.<br><br>
<strong>Why?</strong> A firm seldom knows its rivals' costs, a seller does not know the buyer's willingness to pay, an insurer does not know the insured's risk. Harsanyi (1967) showed how to turn these situations into games we know how to solve: this is the starting point of the economics of information.<br><br>
<strong>Prerequisites.</strong> Nash equilibrium (Game theory 3), Cournot duopoly (Industrial economics 3), expectation.
</div>
<p class="toc">Contents: <a href="#s1">1. Incomplete information</a> · <a href="#s2">2. Types and beliefs</a> · <a href="#s3">3. Bayesian equilibrium</a> · <a href="#s4">4. Cournot with a private cost</a> · <a href="#s5">5. Complete and incomplete information</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Incomplete information</div>
<p>A game has <em>incomplete information</em> when some players do not know a characteristic of another player that affects their payoffs: cost, preferences, quality. This differs from imperfect information, where a past action is unknown. Without care, the analysis runs into an infinite regress: what I believe about your cost, what you believe I believe, and so on.</p>

<div class="dossier-title" id="s2">2. Types and beliefs</div>
<p>Harsanyi suggests assuming that Nature draws, at the start of the game, each player's <em>type</em> (for instance a high cost \(c_H\) or a low cost \(c_L\)) according to a probability distribution known to all, the <em>prior belief</em>. Each player observes their own type, but not the others'. A strategy is then a <em>function</em> associating an action with each possible type: firm 2 chooses a quantity \(q_2(c_H)\) if its cost is high and \(q_2(c_L)\) if it is low, even though only one case will occur.</p>

<div class="dossier-title" id="s3">3. Bayesian Nash equilibrium</div>
<p>A strategy profile is a <em>Bayesian Nash equilibrium</em> if each type of each player maximises their <em>expected</em> payoff, given their belief about the others' types and their strategies. It is the Nash equilibrium of the game in which each type is treated as a separate player. The uninformed player responds to the <em>average</em> action of the opponent; each type of the informed player responds to the uninformed player's action, which is the same whatever that type.</p>

<div class="dossier-title" id="s4">4. Cournot with a private cost</div>
<p>Two firms face demand \(P=a-Q\). Firm 1 has a marginal cost \(c_1\) known to all. Firm 2's cost is \(c_H\) with probability \(\theta\) and \(c_L\) with probability \(1-\theta\); only firm 2 knows it. Each type of firm 2 maximises \((a-q_1-q_2-c)\,q_2\), hence \(q_2(c)=\frac{a-c-q_1}{2}\). Firm 1 maximises its expected profit \(\big(a-q_1-\mathbb{E}[q_2]-c_1\big)\,q_1\), hence \(q_1=\frac{a-c_1-\mathbb{E}[q_2]}{2}\). Writing \(\bar c=\theta c_H+(1-\theta)c_L\), solving gives:
\[q_1^*=\frac{a-2c_1+\bar c}{3},\qquad q_2^*(c)=\frac{a-c-q_1^*}{2}\]
Firm 1 behaves as if its rival had the average cost \(\bar c\).</p>
<div class="ifig" data-fig="bay"></div>
<div class="fig-cap">Figure 1 — Firm 1's reaction function (blue), which responds to firm 2's expected quantity, and the reaction functions of firm 2's two types (gold), for \(a=100\), \(c_1=20\), \(c_H=40\), \(c_L=10\). Red dots are each type's equilibrium quantities, the black dot the expected quantity. Vary the probability \(\theta\) of the high cost: firm 1's output adjusts to the average cost.</div>

<div class="dossier-title" id="s5">5. Complete and incomplete information</div>
<p>If firm 1 knew its rival's cost, it would produce \(\frac{a-2c_1+c}{3}\): more against a costly rival, less against an efficient one. Under incomplete information, it produces an intermediate quantity. The high-cost type benefits (its rival produces less than it would if it knew its cost), the low-cost type loses. Information therefore has value: each may try to reveal or hide it, which opens the way to signalling and adverse-selection models.</p>
<div class="ifig" data-fig="cmp"></div>
<div class="fig-cap">Figure 2 — Equilibrium quantities under incomplete information (solid bars) and complete information (light bars), depending on firm 2's realised type, with the data of figure 1 and \(\theta=0.5\).</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Incomplete information: a player does not know a characteristic of the other; it is modelled by types drawn from a distribution known to all.</li>
<li>Strategy: one action per type; Bayesian equilibrium: each type maximises its expected payoff.</li>
<li>Cournot with a private cost: \(q_1^*=\frac{a-2c_1+\bar c}{3}\), \(q_2^*(c)=\frac{a-c-q_1^*}{2}\).</li>
<li>Information asymmetry benefits the high-cost type and harms the low-cost type.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { th: 'Probabilité θ du coût élevé', R1: 'réaction de l\'entreprise 1', R2: 'réactions des deux types de 2', bayAria: 'Équilibre bayésien de Cournot', bayRead: E => `<i>q</i><sub>1</sub> = <span class="v">${fmt(E.q1, 2)}</span> &nbsp;·&nbsp; <i>q</i><sub>2</sub>(<i>c<sub>H</sub></i>) = <span class="v">${fmt(E.H.q2, 2)}</span> &nbsp;·&nbsp; <i>q</i><sub>2</sub>(<i>c<sub>L</sub></i>) = <span class="v">${fmt(E.L.q2, 2)}</span>`, lab: ['q₁ si c_H', 'q₂ si c_H', 'q₁ si c_L', 'q₂ si c_L'], inc: 'information incomplète', com: 'information complète', cmpAria: 'Quantités en information complète et incomplète' };
I18N.en.f = { th: 'Probability θ of the high cost', R1: 'firm 1 reaction', R2: 'reactions of firm 2\'s two types', bayAria: 'Bayesian Cournot equilibrium', bayRead: E => `<i>q</i><sub>1</sub> = <span class="v">${fmt(E.q1, 2)}</span> &nbsp;·&nbsp; <i>q</i><sub>2</sub>(<i>c<sub>H</sub></i>) = <span class="v">${fmt(E.H.q2, 2)}</span> &nbsp;·&nbsp; <i>q</i><sub>2</sub>(<i>c<sub>L</sub></i>) = <span class="v">${fmt(E.L.q2, 2)}</span>`, lab: ['q₁ if c_H', 'q₂ if c_H', 'q₁ if c_L', 'q₂ if c_L'], inc: 'incomplete information', com: 'complete information', cmpAria: 'Quantities under complete and incomplete information' };
function j9graph(a, c1, cH, cL, th, lang) {
  const L = I18N[lang].f, E = j9eq(a, c1, cH, cL, th), top = (a - Math.min(c1, cL)) * 0.7;
  const G = Plot({ w: 520, h: 440, x0: 0, x1: top, y0: 0, y1: top, mt: 30, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, top, 4), yt: ticks(0, top, 4), xl: 'q₁', yl: 'q₂', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
  G.clip();
  G.line([[(a - c1) / 2, 0], [0, a - c1]], { c: COL.s1, w: 2.4, clip: true });
  [cH, cL].forEach(c => G.line([[0, (a - c) / 2], [a - c, 0]], { c: COL.s2, w: 2, dash: c === cH ? '6 4' : '', clip: true }));
  const Eq2 = th * E.H.q2 + (1 - th) * E.L.q2;
  G.seg(E.q1, E.H.q2, E.q1, E.L.q2, { c: GREY, w: 1, dash: '3 3' });
  G.dot(E.q1, E.H.q2, { c: COL.s3, r: 6 }); G.dot(E.q1, E.L.q2, { c: COL.s3, r: 6 }); G.dot(E.q1, Eq2, { c: COL.ink, r: 5 });
  G.text(E.q1, E.H.q2, 'c_H', { dx: 9, dy: 14, anchor: 'start', size: 11 }); G.text(E.q1, E.L.q2, 'c_L', { dx: 9, dy: -6, anchor: 'start', size: 11 });
  G.legend([{ c: COL.s1, t: L.R1 }, { c: COL.s2, t: L.R2 }], G.ml + 60, 16);
  return '<div style="max-width:540px;margin:0 auto">' + G.svg(L.bayAria) + '</div>';
}
function j9bars(a, c1, cH, cL, th, lang) {
  const L = I18N[lang].f, E = j9eq(a, c1, cH, cL, th), inc = [E.q1, E.H.q2, E.q1, E.L.q2], com = [E.CH.q1, E.CH.q2, E.CL.q1, E.CL.q2], ymax = Math.max(...inc, ...com) * 1.2;
  const G = Plot({ w: 640, h: 280, x0: 0.4, x1: 4.6, y0: 0, y1: ymax, mt: 30, mb: 42 });
  G.axes({ xt: [1, 2, 3, 4], yt: ticks(0, ymax, 4), xf: v => L.lab[v - 1], yf: v => fmtT(v, 0) });
  inc.forEach((v, i) => { G.bar(i + 1 - 0.16, 40, v, { c: i % 2 ? COL.s2 : COL.s1, o: 0.95 }); G.bar(i + 1 + 0.16, 40, com[i], { c: i % 2 ? COL.s2 : COL.s1, o: 0.4 }); });
  G.legend([{ c: GREY, box: true, o: 0.95, t: L.inc }, { c: GREY, box: true, o: 0.4, t: L.com }], G.ml + 8, 16);
  return G.svg(L.cmpAria);
}
FIGS.bay = { state: { th: 0.5 }, controls: L => [{ key: 'th', label: L.f.th, min: 0, max: 1, step: 0.05, fmt: v => fmtT(v, 2) }], draw: function (s, lang) { return { svg: j9graph(100, 20, 40, 10, s.th, lang), read: I18N[lang].f.bayRead(j9eq(100, 20, 40, 10, s.th)) }; } };
FIGS.cmp = { state: {}, controls: L => [], draw: function (s, lang) { return { svg: j9bars(100, 20, 40, 10, 0.5, lang), read: '' }; } };

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([60, 90, 120, 150]); D.c1 = 3 * rint(2, 8); D.cL = 3 * rint(1, 5); D.cH = D.cL + 3 * rint(2, 6); D.th = pick([0.25, 0.4, 0.5, 0.6, 0.75]);
    D.E = j9eq(D.a, D.c1, D.cH, D.cL, D.th);
    if ([D.E.q1, D.E.H.q2, D.E.L.q2, D.E.CH.q2, D.E.CL.q1].some(v => v <= 1)) continue;
    break;
  }
  const E = D.E, th = D.th;
  D.Epi1 = th * E.H.pi1 + (1 - th) * E.L.pi1; D.Epi1C = th * E.CH.pi1 + (1 - th) * E.CL.pi1;
  D.ESC = th * E.H.SC + (1 - th) * E.L.SC; D.ESCC = th * E.CH.SC + (1 - th) * E.CL.SC;
  return D;
};
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Deux entreprises produisent un bien homogène de demande inverse \(P(Q)=${D.a}-Q\) et choisissent simultanément leurs quantités. Le coût marginal de l'entreprise 1 vaut \(c_1=${D.c1}\) et est connu de tous. Celui de l'entreprise 2 vaut \(c_H=${D.cH}\) avec probabilité \(\theta=${fmtT(D.th, 2)}\) et \(c_L=${D.cL}\) sinon ; l'entreprise 2 le connaît, l'entreprise 1 n'en connaît que la loi. Il n'y a pas de coût fixe.</div>
<div class="questions"><ol>
<li><div class="q-text">Quels sont les types de l'entreprise 2 ? Qu'est-ce qu'une stratégie pour chaque entreprise ?</div></li>
<li><div class="q-text">Déterminez la meilleure réponse de chaque type de l'entreprise 2, puis celle de l'entreprise 1.</div></li>
<li><div class="q-text">Déterminez l'équilibre bayésien de Nash.</div></li>
<li><div class="q-text">Dans chacun des deux cas possibles, calculez le prix, les profits et, à l'aide d'une intégrale, le surplus des consommateurs. Déduisez-en le profit espéré de l'entreprise 1 et le surplus espéré des consommateurs.</div></li>
<li><div class="q-text">Comparez avec l'équilibre de Cournot en information complète, dans chacun des deux cas. Quel type de l'entreprise 2 gagne à l'asymétrie d'information ? Combien l'entreprise 1 serait-elle prête à payer pour connaître le coût de sa concurrente ?</div></li>
<li><div class="q-text">Représentez graphiquement les fonctions de réaction et l'équilibre bayésien.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">Two firms produce a homogeneous good with inverse demand \(P(Q)=${D.a}-Q\) and choose their quantities simultaneously. Firm 1's marginal cost is \(c_1=${D.c1}\) and is known to all. Firm 2's is \(c_H=${D.cH}\) with probability \(\theta=${fmtT(D.th, 2)}\) and \(c_L=${D.cL}\) otherwise; firm 2 knows it, firm 1 only knows its distribution. There is no fixed cost.</div>
<div class="questions"><ol>
<li><div class="q-text">What are firm 2's types? What is a strategy for each firm?</div></li>
<li><div class="q-text">Determine the best response of each type of firm 2, then that of firm 1.</div></li>
<li><div class="q-text">Determine the Bayesian Nash equilibrium.</div></li>
<li><div class="q-text">In each of the two possible cases, compute the price, the profits and, using an integral, consumer surplus. Deduce firm 1's expected profit and expected consumer surplus.</div></li>
<li><div class="q-text">Compare with the complete-information Cournot equilibrium in each case. Which type of firm 2 gains from the information asymmetry? How much would firm 1 be willing to pay to learn its rival's cost?</div></li>
<li><div class="q-text">Draw the reaction functions and the Bayesian equilibrium.</div></li>
</ol></div>`;
};
function j9sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], a = D.a, c1 = D.c1, cH = D.cH, cL = D.cL, th = D.th, E = D.E, n4 = x => texT(x, 4), m2 = x => texT(x, 2);
  const SC = T_(['SC', 'CS']);
  const row = (nm, S, C) => `<tr><td>${nm}</td><td class="num">${fmt(S.q1 !== undefined ? S.q1 : E.q1, 2)}</td><td class="num">${fmt(S.q2, 2)}</td><td class="num">${fmt(S.P, 2)}</td><td class="num">${fmt(S.pi1, 2)}</td><td class="num">${fmt(S.pi2, 2)}</td><td class="num">${fmt(S.SC, 2)}</td></tr>`;
  const tab = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>\\(q_1\\)</th><th>\\(q_2\\)</th><th>\\(P\\)</th><th>\\(\\Pi_1\\)</th><th>\\(\\Pi_2\\)</th><th>${SC}</th></tr></thead><tbody>${row(T_(['Incomplète, ', 'Incomplete, ']) + '\\(c_H\\)', E.H)}${row(T_(['Complète, ', 'Complete, ']) + '\\(c_H\\)', E.CH)}${row(T_(['Incomplète, ', 'Incomplete, ']) + '\\(c_L\\)', E.L)}${row(T_(['Complète, ', 'Complete, ']) + '\\(c_L\\)', E.CL)}</tbody></table></div>`;
  const st = (S, nm, c) => String.raw`${T_(['Si', 'If'])} \(c=c_${nm}\), ${T_(['la production totale est', 'total output is'])} \(Q=${n4(E.q1)}+${n4(S.q2)}=${n4(S.Q)}\), ${T_(['et l\'on en déduit, d\'après la fonction de demande inverse, le prix', 'and the inverse demand function gives the price'])} \(P=${a}-${n4(S.Q)}=${n4(S.P)}\). ${T_(['Les profits valent', 'Profits are'])} \(\Pi_1=(${n4(S.P)}-${c1})\times ${n4(E.q1)}=${m2(S.pi1)}\) ${T_(['et', 'and'])} \(\Pi_2=(${n4(S.P)}-${c})\times ${n4(S.q2)}=${m2(S.pi2)}\), ${T_(['et le surplus des consommateurs', 'and consumer surplus'])} \(${SC}=\int_0^{${n4(S.Q)}}(${a}-q-${n4(S.P)})\,dq=\Big[${n4(a - S.P)}\,q-\tfrac12q^2\Big]_0^{${n4(S.Q)}}=${m2(S.SC)}\).`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['L\'entreprise 2 a deux types possibles, selon son coût :', 'Firm 2 has two possible types, according to its cost:'])} \(c_H=${cH}\) (${T_(['probabilité', 'probability'])} ${fmtT(th, 2)}) ${T_(['et', 'and'])} \(c_L=${cL}\) (${T_(['probabilité', 'probability'])} ${fmtT(1 - th, 2)}). ${T_(['L\'entreprise 1 n\'a qu\'un type. Une stratégie de l\'entreprise 1 est une quantité', 'Firm 1 has a single type. A strategy of firm 1 is a quantity'])} \(q_1\) ; ${T_(['une stratégie de l\'entreprise 2 est un couple de quantités', 'a strategy of firm 2 is a pair of quantities'])} \((q_2(c_H),q_2(c_L))\), ${T_(['une pour chaque type, puisqu\'elle choisit en connaissant son coût.', 'one per type, since it chooses knowing its cost.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le type', 'The type'])} \(c\) ${T_(['de l\'entreprise 2 connaît son coût et maximise', 'of firm 2 knows its cost and maximises'])} \((${a}-q_1-q_2-c)\,q_2\) ; ${T_(['en annulant la dérivée par rapport à', 'setting the derivative with respect to'])} \(q_2\)${T_(['', ' to zero'])} :
  \[q_2(c_H)=\frac{${a}-${cH}-q_1}{2}=${n4((a - cH) / 2)}-\frac{q_1}{2}\qquad q_2(c_L)=\frac{${a}-${cL}-q_1}{2}=${n4((a - cL) / 2)}-\frac{q_1}{2}\]
  ${T_(['L\'entreprise 1 ne connaît pas', 'Firm 1 does not know'])} \(q_2\) ; ${T_(['elle maximise son profit espéré', 'it maximises its expected profit'])} \(\big(${a}-q_1-\mathbb{E}[q_2]-${c1}\big)\,q_1\), ${T_(['avec', 'with'])} \(\mathbb{E}[q_2]=${fmtT(th, 2)}\,q_2(c_H)+${fmtT(1 - th, 2)}\,q_2(c_L)\), ${T_(['d\'où', 'hence'])} \(q_1=\frac{${a - c1}-\mathbb{E}[q_2]}{2}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['En reportant les meilleures réponses de l\'entreprise 2 dans l\'espérance, on obtient', 'Substituting firm 2\'s best responses into the expectation gives'])} \(\mathbb{E}[q_2]=\frac{${a}-\bar c-q_1}{2}\), ${T_(['avec le coût moyen', 'with the average cost'])} \(\bar c=${fmtT(th, 2)}\times ${cH}+${fmtT(1 - th, 2)}\times ${cL}=${n4(E.Ec)}\). ${T_(['La réaction de l\'entreprise 1 devient', 'Firm 1\'s reaction becomes'])} :
  \[\begin{aligned}q_1&amp;=\frac{1}{2}\Big(${a - c1}-\frac{${a}-${n4(E.Ec)}-q_1}{2}\Big)\\\frac34\,q_1&amp;=\frac{${a}-2\times ${c1}+${n4(E.Ec)}}{4}&amp;&amp;\text{${T_(['en regroupant', 'grouping'])}}\\q_1^*&amp;=${n4(E.q1)}\end{aligned}\]
  ${T_(['On en déduit les quantités des deux types en reportant', 'The quantities of the two types follow by substituting'])} \(q_1^*\) ${T_(['dans leurs meilleures réponses', 'into their best responses'])} : \(q_2^*(c_H)=${n4((a - cH) / 2)}-\frac{${n4(E.q1)}}{2}=${n4(E.H.q2)}\) ${T_(['et', 'and'])} \(q_2^*(c_L)=${n4((a - cL) / 2)}-\frac{${n4(E.q1)}}{2}=${n4(E.L.q2)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${st(E.H, 'H', cH)}</p>
  <p>${st(E.L, 'L', cL)}</p>
  <p>${T_(['En pondérant par les probabilités, le profit espéré de l\'entreprise 1 vaut', 'Weighting by the probabilities, firm 1\'s expected profit is'])} \(${fmtT(th, 2)}\times ${m2(E.H.pi1)}+${fmtT(1 - th, 2)}\times ${m2(E.L.pi1)}=${m2(D.Epi1)}\), ${T_(['et le surplus espéré des consommateurs', 'and expected consumer surplus'])} \(${fmtT(th, 2)}\times ${m2(E.H.SC)}+${fmtT(1 - th, 2)}\times ${m2(E.L.SC)}=${m2(D.ESC)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['En information complète, dans l\'état', 'Under complete information, in state'])} \(c\), ${T_(['on retrouve l\'équilibre de Cournot', 'we recover the Cournot equilibrium'])} \(q_1=\frac{${a}-2\times ${c1}+c}{3}\), \(q_2=\frac{${a}-2c+${c1}}{3}\) :</p>
  ${tab}
  <p>${T_(['Face à un concurrent coûteux, l\'entreprise 1 produirait', 'Facing a costly rival, firm 1 would produce'])} \(${n4(E.CH.q1)}\) ${T_(['en le sachant, mais ne produit que', 'if it knew, but only produces'])} \(${n4(E.q1)}\) : ${T_(['le type à coût élevé en profite', 'the high-cost type benefits'])} (\(${m2(E.H.pi2)}\) ${T_(['contre', 'against'])} \(${m2(E.CH.pi2)}\)). ${T_(['À l\'inverse, le type à coût faible affronte une entreprise 1 qui produit plus qu\'elle ne le ferait en le sachant, et il y perd', 'Conversely, the low-cost type faces a firm 1 producing more than it would if it knew, and it loses'])} (\(${m2(E.L.pi2)}\) ${T_(['contre', 'against'])} \(${m2(E.CL.pi2)}\)). ${T_(['L\'entreprise 1 obtiendrait en information complète un profit espéré', 'Under complete information, firm 1 would get an expected profit'])} \(${fmtT(th, 2)}\times ${m2(E.CH.pi1)}+${fmtT(1 - th, 2)}\times ${m2(E.CL.pi1)}=${m2(D.Epi1C)}\) : ${T_(['elle serait prête à payer jusqu\'à', 'it would be willing to pay up to'])} \(${m2(D.Epi1C - D.Epi1)}\) ${T_(['pour connaître le coût de sa concurrente. Le surplus espéré des consommateurs passerait de', 'to learn its rival\'s cost. Expected consumer surplus would go from'])} \(${m2(D.ESC)}\) ${T_(['à', 'to'])} \(${m2(D.ESCC)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La droite bleue est la réaction de l\'entreprise 1 à la quantité de sa concurrente ; les deux droites dorées sont les réactions des deux types de l\'entreprise 2 (pointillés : coût élevé). L\'entreprise 1 produit la même quantité', 'The blue line is firm 1\'s reaction to its rival\'s quantity; the two gold lines are the reactions of firm 2\'s two types (dashed: high cost). Firm 1 produces the same quantity'])} \(q_1^*\) ${T_(['dans les deux cas : les deux points rouges sont sur la même verticale, et le point noir, la quantité espérée de l\'entreprise 2, est sur la réaction de l\'entreprise 1.', 'in both cases: the two red dots are on the same vertical line, and the black dot, firm 2\'s expected quantity, lies on firm 1\'s reaction.'])}</p>
  <div class="sol-fig">${j9graph(a, c1, cH, cL, th, lang)}</div>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => j9sol(D, 'fr');
I18N.en.sol = D => j9sol(D, 'en');
