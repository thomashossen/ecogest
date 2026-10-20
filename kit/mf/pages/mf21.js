/* ============================================================
   PAGE mf21 — Contraintes en probabilité
   ============================================================ */
const GREY = '#8a857a';
I18N.fr.k = {
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié',
  'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 21 – Contraintes en probabilité', 'k-h1': 'Contraintes en probabilité',
  'k-coursetitle': 'Rester solvable avec une probabilité donnée quand les passifs sont aléatoires', 'k-extitle': 'Un fonds de pension sous incertitude', 'k-soltitle': 'Un fonds de pension sous incertitude'
};
I18N.en.k = {
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied',
  'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 21 – Chance constraints', 'k-h1': 'Chance constraints',
  'k-coursetitle': 'Staying solvent with a given probability when liabilities are random', 'k-extitle': 'A pension fund under uncertainty', 'k-soltitle': 'A pension fund under uncertainty'
};

/* ---------- données du cours (fonds de pension, 15 ans, 3 obligations) ---------- */
const D21 = (function () {
  const beta = [11000, 12000, 14000, 15000, 16000, 18000, 20000, 21000, 22000, 24000, 25000, 30000, 31000, 31000, 31000];
  const al = [[0, 60, 60, 60, 60, 1060, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 1060, 0, 0, 0], [0, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 1075]];
  const g = [980, 970, 1050], K = 250000;
  const a = al.map((r, i) => { let c = 0; return r.map(v => { c += v; return c - g[i]; }); });
  let c = 0; const b = beta.map(v => { c += v; return c - K; });
  const sig = beta.map((v, k) => 500 * (k + 1));
  let s2 = 0; const st = sig.map(s => { s2 += s * s; return Math.sqrt(s2); });
  return { beta: beta, a: a, b: b, st: st, K: K };
})();
/* programme linéaire à trois variables : max c.x sous A x >= r, x >= 0, par énumération des sommets */
function d21lp3(a, rhs, cobj) {
  const m = rhs.length, rows = [];
  for (let j = 0; j < m; j++) rows.push({ v: [a[0][j], a[1][j], a[2][j]], r: rhs[j] });
  rows.push({ v: [1, 0, 0], r: 0 }, { v: [0, 1, 0], r: 0 }, { v: [0, 0, 1], r: 0 });
  let best = null;
  const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) for (let k = j + 1; k < rows.length; k++) {
    const M = [rows[i].v, rows[j].v, rows[k].v], d = det3(M);
    if (Math.abs(d) < 1e-9) continue;
    const R = [rows[i].r, rows[j].r, rows[k].r], x = [0, 1, 2].map(c => { const Mc = M.map((row, t) => row.map((v, u) => u === c ? R[t] : v)); return det3(Mc) / d; });
    if (rows.every(rw => rw.v[0] * x[0] + rw.v[1] * x[1] + rw.v[2] * x[2] >= rw.r - 1e-6)) {
      const val = cobj[0] * x[0] + cobj[1] * x[1] + cobj[2] * x[2];
      if (!best || val > best.val) best = { x: x, val: val };
    }
  }
  return best;
}
function d21solve(p) {
  const q = p <= 0.5 ? 0 : normInv(p), rhs = D21.b.map((v, j) => v + D21.st[j] * q);
  const R = d21lp3(D21.a, rhs, [D21.a[0][14], D21.a[1][14], D21.a[2][14]]);
  return R ? { x: R.x, cash: R.val - D21.b[14] } : null;
}
/* deux variables : énumération des sommets de { a1j x1 + a2j x2 >= rj, x >= 0 } */
function d21lp2(A, r, c) {
  const L = A.map((row, j) => ({ u: row[0], v: row[1], r: r[j] })).concat([{ u: 1, v: 0, r: 0 }, { u: 0, v: 1, r: 0 }]);
  const V = [];
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
    const d = L[i].u * L[j].v - L[i].v * L[j].u; if (Math.abs(d) < 1e-12) continue;
    const x1 = (L[i].r * L[j].v - L[i].v * L[j].r) / d, x2 = (L[i].u * L[j].r - L[i].r * L[j].u) / d;
    if (L.every(l => l.u * x1 + l.v * x2 >= l.r - 1e-7)) V.push({ x: [x1, x2], val: c[0] * x1 + c[1] * x2, lines: [i, j] });
  }
  V.sort((p, q) => q.val - p.val);
  return V;
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez écrire une contrainte en probabilité, la transformer en contrainte linéaire quand l'aléa est gaussien, comprendre la différence entre contraintes séparées et contrainte jointe, et mesurer ce que coûte un niveau de sûreté plus élevé.<br><br>
<strong>Pourquoi en finance ?</strong> Un fonds de pension ne connaît pas exactement ses paiements futurs : mortalité, inflation, revalorisations. Exiger d'être solvable dans tous les cas imaginables est impossible ou ruineux ; on demande plutôt de l'être avec une forte probabilité, comme le fait la réglementation Solvabilité II avec un niveau de 99.5 %.<br><br>
<strong>Prérequis.</strong> Loi normale et quantiles (page 2), programmation linéaire (page 15), VaR (page 17).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le fonds de pension</a> · <a href="#s2">2. Des passifs aléatoires</a> · <a href="#s3">3. Contraintes séparées</a> · <a href="#s4">4. Contrainte jointe</a> · <a href="#s5">5. Le prix de la sûreté</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le fonds de pension</div>
<p>Un fonds dispose d'un capital \(K\) et doit verser \(\beta_k\) à la fin de chaque année \(k=1,\ldots,m\). Il achète aujourd'hui \(x_i\) obligations de type \(i\), au prix \(\gamma_i\) ; chacune verse \(\alpha_{ik}\) l'année \(k\). La trésorerie à la fin de l'année \(j\) est :
\[K-\sum_{i=1}^{n}\gamma_ix_i+\sum_{k=1}^{j}\sum_{i=1}^{n}\alpha_{ik}x_i-\sum_{k=1}^{j}\beta_k=\sum_{i=1}^{n}a_{ij}x_i-b_j\]
avec \(a_{ij}=\sum_{k\le j}\alpha_{ik}-\gamma_i\), rendement cumulé net d'une obligation, et \(b_j=\sum_{k\le j}\beta_k-K\), besoin cumulé net. Le fonds veut maximiser sa trésorerie finale tout en restant solvable chaque année :
\[\max_{x\ge 0}\ \sum_{i=1}^{n}a_{im}x_i\qquad\text{sous}\qquad\sum_{i=1}^{n}a_{ij}x_i\ge b_j,\quad j=1,\ldots,m\]
C'est le modèle I des diapositives, où la somme définissant \(b_j\) porte sur \(\beta_k\) et non sur \(\beta_j\). Avec les données du cours (15 ans, trois obligations, \(K=250\,000\)), la solution achète environ 31.1, 55.5 et 147.3 obligations et laisse 127 332 en caisse à la fin. Mais la trésorerie tombe à zéro certaines années : la moindre hausse des paiements rendrait le fonds insolvable.</p>

<div class="dossier-title" id="s2">2. Des passifs aléatoires</div>
<p>On suppose désormais les paiements gaussiens et indépendants : \(\tilde\beta_k\sim\mathcal{N}(\beta_k,\sigma_k^2)\), avec une incertitude croissante, \(\sigma_k=500\,k\). Le besoin cumulé devient aléatoire :
\[\xi_j=\sum_{k=1}^{j}\tilde\beta_k-K\sim\mathcal{N}\big(b_j,\ \tilde\sigma_j^2\big)\qquad\text{avec}\qquad\tilde\sigma_j^2=\sum_{k=1}^{j}\sigma_k^2\]
la variance d'une somme de variables indépendantes étant la somme des variances. Les \(\xi_j\) sont corrélés, puisqu'ils partagent leurs premiers termes : \(\text{Cov}(\xi_j,\xi_l)=\tilde\sigma^2_{\min(j,l)}\), d'où la matrice de covariance des diapositives, dont la ligne \(j\) vaut \(\tilde\sigma_1^2,\ldots,\tilde\sigma_j^2,\tilde\sigma_j^2,\ldots\) Une contrainte « pour tout \(\xi_j\) » n'a plus de sens, la loi normale n'étant pas bornée : on exige la solvabilité avec une probabilité \(p\).</p>

<div class="dossier-title" id="s3">3. Contraintes en probabilité séparées</div>
<p>On impose, année par année :
\[\mathbb{P}\Big(\sum_{i=1}^{n}a_{ij}x_i\ge\xi_j\Big)\ge p,\qquad j=1,\ldots,m\]
Pour \(x\) fixé, \(c_j:=\sum_ia_{ij}x_i\) est un nombre. En centrant et en réduisant \(\xi_j\), on obtient une variable \(\eta_j=(\xi_j-b_j)/\tilde\sigma_j\) de loi normale centrée réduite :
\[\begin{aligned}\mathbb{P}(c_j\ge\xi_j)\ge p&amp;\iff\mathbb{P}\Big(\eta_j\le\frac{c_j-b_j}{\tilde\sigma_j}\Big)\ge p\\&amp;\iff\Phi\Big(\frac{c_j-b_j}{\tilde\sigma_j}\Big)\ge p&amp;&amp;\text{définition de }\Phi\\&amp;\iff\frac{c_j-b_j}{\tilde\sigma_j}\ge q_p&amp;&amp;\Phi\text{ croissante, }q_p=\Phi^{-1}(p)\\&amp;\iff\sum_{i=1}^{n}a_{ij}x_i\ge\tilde b_j:=b_j+\tilde\sigma_j\,q_p\end{aligned}\]
La contrainte en probabilité équivaut à une contrainte linéaire dont le second membre est augmenté d'une <em>marge de sécurité</em> \(\tilde\sigma_jq_p\), d'autant plus grande que l'horizon est lointain et que \(p\) est élevé (\(q_{0.95}\approx 1.645\)). Le problème reste un programme linéaire : c'est l'équivalent déterministe. On retrouve la VaR de la page 17 : la contrainte dit que la VaR au niveau \(p\) du besoin cumulé ne dépasse pas les ressources.</p>
<div class="ifig" data-fig="cc"></div>
<div class="fig-cap">Figure 1 — Loi du besoin cumulé \(\xi_j\) de l'année \(j\) pour les données du cours. Le modèle déterministe ne couvre que la moyenne \(b_j\) : il est en défaut une fois sur deux si la trésorerie y est nulle. La contrainte en probabilité demande de couvrir le quantile \(b_j+\tilde\sigma_jq_p\) ; la zone colorée, de probabilité \(1-p\), est le risque accepté.</div>

<div class="dossier-title" id="s4">4. La contrainte jointe</div>
<p>Des contraintes séparées garantissent chaque année avec probabilité \(p\), mais pas toutes les années à la fois : sur 15 ans, le risque de défaut au moins une fois peut être bien plus grand que \(1-p\). La contrainte <em>jointe</em> l'exige directement :
\[\mathbb{P}\Big(\sum_{i=1}^{n}a_{ij}x_i\ge\xi_j,\ j=1,\ldots,m\Big)\ge p\]
Elle n'a plus d'équivalent linéaire simple, car elle fait intervenir la loi jointe des \(\xi_j\). Une approche prudente utilise l'inégalité de Boole : la probabilité qu'au moins une contrainte soit violée est au plus la somme des probabilités de violation. Imposer chaque contrainte séparée au niveau \(p_j=1-(1-p)/m\) garantit donc la contrainte jointe au niveau \(p\), au prix d'une marge plus grande que nécessaire. Comme les \(\xi_j\) sont positivement corrélés, les violations ont tendance à arriver ensemble et la vraie probabilité jointe est nettement meilleure que cette borne. Les diapositives comparent les trois solutions : déterministe (127 332 en fin de période), contraintes séparées à 95 % (103 925, avec \(q_{0.95}\) arrondi à 1.65 ; 103 998 avec la valeur exacte 1.6449, celle de la figure 2) et contrainte jointe à 95 % (98 160).</p>

<div class="dossier-title" id="s5">5. Le prix de la sûreté</div>
<p>Chaque relèvement de \(p\) augmente les seconds membres \(\tilde b_j\), donc réduit l'ensemble réalisable et la trésorerie finale optimale. Tracer cette dernière en fonction de \(p\) montre le prix de la sûreté : il est modéré jusqu'à 90 % environ, puis s'accélère quand \(p\) tend vers 1, car \(q_p\) tend vers l'infini.</p>
<div class="ifig" data-fig="risk"></div>
<div class="fig-cap">Figure 2 — Trésorerie finale optimale du fonds de pension du cours avec des contraintes séparées, en fonction du niveau \(p\). Le point indique le niveau choisi ; la lecture donne le portefeuille correspondant. Pour \(p=0.5\), \(q_p=0\) et l'on retrouve la solution déterministe.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Une contrainte en probabilité demande qu'une contrainte soit satisfaite avec probabilité au moins \(p\), au lieu de l'être toujours ou seulement en moyenne.</li>
<li>Avec un second membre gaussien \(\xi\sim\mathcal{N}(b,\tilde\sigma^2)\) : \(\mathbb{P}(a^Tx\ge\xi)\ge p\iff a^Tx\ge b+\tilde\sigma q_p\) ; le problème reste linéaire.</li>
<li>Des besoins cumulés ont une variance cumulée : la marge de sécurité croît avec l'horizon.</li>
<li>Contraintes séparées : chaque année ; contrainte jointe : toutes les années ensemble, plus exigeante ; Boole donne une approximation prudente.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can write a chance constraint, turn it into a linear constraint when the randomness is Gaussian, understand the difference between separate constraints and a joint constraint, and measure the cost of a higher safety level.<br><br>
<strong>Why in finance?</strong> A pension fund does not know its future payments exactly: mortality, inflation, indexation. Requiring solvency in every conceivable case is impossible or ruinous; one rather asks for solvency with a high probability, as the Solvency II regulation does with a 99.5% level.<br><br>
<strong>Prerequisites.</strong> Normal distribution and quantiles (page 2), linear programming (page 15), VaR (page 17).
</div>
<p class="toc">Contents: <a href="#s1">1. The pension fund</a> · <a href="#s2">2. Random liabilities</a> · <a href="#s3">3. Separate constraints</a> · <a href="#s4">4. Joint constraint</a> · <a href="#s5">5. The price of safety</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The pension fund</div>
<p>A fund has capital \(K\) and must pay \(\beta_k\) at the end of each year \(k=1,\ldots,m\). It buys today \(x_i\) bonds of type \(i\), at price \(\gamma_i\); each pays \(\alpha_{ik}\) in year \(k\). The cash at the end of year \(j\) is:
\[K-\sum_{i=1}^{n}\gamma_ix_i+\sum_{k=1}^{j}\sum_{i=1}^{n}\alpha_{ik}x_i-\sum_{k=1}^{j}\beta_k=\sum_{i=1}^{n}a_{ij}x_i-b_j\]
with \(a_{ij}=\sum_{k\le j}\alpha_{ik}-\gamma_i\), the net cumulative yield of a bond, and \(b_j=\sum_{k\le j}\beta_k-K\), the net cumulative need. The fund wants to maximise its final cash while remaining solvent every year:
\[\max_{x\ge 0}\ \sum_{i=1}^{n}a_{im}x_i\qquad\text{s.t.}\qquad\sum_{i=1}^{n}a_{ij}x_i\ge b_j,\quad j=1,\ldots,m\]
This is model I of the slides, where the sum defining \(b_j\) runs over \(\beta_k\), not \(\beta_j\). With the course data (15 years, three bonds, \(K=250\,000\)), the solution buys about 31.1, 55.5 and 147.3 bonds and leaves 127,332 in cash at the end. But cash falls to zero in some years: the slightest increase in payments would make the fund insolvent.</p>

<div class="dossier-title" id="s2">2. Random liabilities</div>
<p>Payments are now assumed Gaussian and independent: \(\tilde\beta_k\sim\mathcal{N}(\beta_k,\sigma_k^2)\), with uncertainty growing over time, \(\sigma_k=500\,k\). The cumulative need becomes random:
\[\xi_j=\sum_{k=1}^{j}\tilde\beta_k-K\sim\mathcal{N}\big(b_j,\ \tilde\sigma_j^2\big)\qquad\text{with}\qquad\tilde\sigma_j^2=\sum_{k=1}^{j}\sigma_k^2\]
since the variance of a sum of independent variables is the sum of the variances. The \(\xi_j\) are correlated, as they share their first terms: \(\text{Cov}(\xi_j,\xi_l)=\tilde\sigma^2_{\min(j,l)}\), hence the covariance matrix of the slides, whose row \(j\) reads \(\tilde\sigma_1^2,\ldots,\tilde\sigma_j^2,\tilde\sigma_j^2,\ldots\) A constraint "for every \(\xi_j\)" no longer makes sense, the normal distribution being unbounded: solvency is required with probability \(p\).</p>

<div class="dossier-title" id="s3">3. Separate chance constraints</div>
<p>We impose, year by year:
\[\mathbb{P}\Big(\sum_{i=1}^{n}a_{ij}x_i\ge\xi_j\Big)\ge p,\qquad j=1,\ldots,m\]
For a fixed \(x\), \(c_j:=\sum_ia_{ij}x_i\) is a number. Centring and scaling \(\xi_j\), we get a variable \(\eta_j=(\xi_j-b_j)/\tilde\sigma_j\) with a standard normal distribution:
\[\begin{aligned}\mathbb{P}(c_j\ge\xi_j)\ge p&amp;\iff\mathbb{P}\Big(\eta_j\le\frac{c_j-b_j}{\tilde\sigma_j}\Big)\ge p\\&amp;\iff\Phi\Big(\frac{c_j-b_j}{\tilde\sigma_j}\Big)\ge p&amp;&amp;\text{definition of }\Phi\\&amp;\iff\frac{c_j-b_j}{\tilde\sigma_j}\ge q_p&amp;&amp;\Phi\text{ increasing, }q_p=\Phi^{-1}(p)\\&amp;\iff\sum_{i=1}^{n}a_{ij}x_i\ge\tilde b_j:=b_j+\tilde\sigma_j\,q_p\end{aligned}\]
The chance constraint is equivalent to a linear constraint whose right-hand side is raised by a <em>safety margin</em> \(\tilde\sigma_jq_p\), all the larger as the horizon is distant and \(p\) high (\(q_{0.95}\approx 1.645\)). The problem remains a linear programme: this is the deterministic equivalent. This is the VaR of page 17: the constraint says that the \(p\)-level VaR of the cumulative need does not exceed the resources.</p>
<div class="ifig" data-fig="cc"></div>
<div class="fig-cap">Figure 1 — Distribution of the cumulative need \(\xi_j\) of year \(j\) for the course data. The deterministic model only covers the mean \(b_j\): it defaults half of the time if cash is zero there. The chance constraint requires covering the quantile \(b_j+\tilde\sigma_jq_p\); the shaded area, with probability \(1-p\), is the accepted risk.</div>

<div class="dossier-title" id="s4">4. The joint constraint</div>
<p>Separate constraints guarantee each year with probability \(p\), but not all years at once: over 15 years, the risk of defaulting at least once may be much larger than \(1-p\). The <em>joint</em> constraint requires it directly:
\[\mathbb{P}\Big(\sum_{i=1}^{n}a_{ij}x_i\ge\xi_j,\ j=1,\ldots,m\Big)\ge p\]
It no longer has a simple linear equivalent, as it involves the joint distribution of the \(\xi_j\). A cautious approach uses Boole's inequality: the probability that at least one constraint is violated is at most the sum of the violation probabilities. Imposing each separate constraint at level \(p_j=1-(1-p)/m\) therefore guarantees the joint constraint at level \(p\), at the price of a larger margin than necessary. Since the \(\xi_j\) are positively correlated, violations tend to occur together and the true joint probability is markedly better than this bound. The slides compare the three solutions: deterministic (127,332 at the end), separate constraints at 95% (103,925, with \(q_{0.95}\) rounded to 1.65; 103,998 with the exact value 1.6449, used in figure 2) and joint constraint at 95% (98,160).</p>

<div class="dossier-title" id="s5">5. The price of safety</div>
<p>Each increase in \(p\) raises the right-hand sides \(\tilde b_j\), hence shrinks the feasible set and the optimal final cash. Plotting the latter against \(p\) shows the price of safety: it is moderate up to about 90%, then accelerates as \(p\) tends to 1, since \(q_p\) tends to infinity.</p>
<div class="ifig" data-fig="risk"></div>
<div class="fig-cap">Figure 2 — Optimal final cash of the course's pension fund with separate constraints, as a function of the level \(p\). The dot marks the chosen level; the reading gives the corresponding portfolio. For \(p=0.5\), \(q_p=0\) and the deterministic solution is recovered.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>A chance constraint requires a constraint to hold with probability at least \(p\), instead of always or only on average.</li>
<li>With a Gaussian right-hand side \(\xi\sim\mathcal{N}(b,\tilde\sigma^2)\): \(\mathbb{P}(a^Tx\ge\xi)\ge p\iff a^Tx\ge b+\tilde\sigma q_p\); the problem remains linear.</li>
<li>Cumulative needs have a cumulative variance: the safety margin grows with the horizon.</li>
<li>Separate constraints: each year; joint constraint: all years together, more demanding; Boole gives a cautious approximation.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  j: 'Année j', p: 'Niveau p', need: 'besoin cumulé ξ (milliers)', ccAria: 'Loi du besoin cumulé, moyenne et quantile couvert',
  ccRead: (b, s, m) => `Moyenne <i>b<sub>j</sub></i> = <span class="v">${fmt(b, 0)}</span> &nbsp;·&nbsp; écart-type σ̃<sub>j</sub> = <span class="v">${fmt(s, 0)}</span> &nbsp;·&nbsp; marge de sécurité σ̃<sub>j</sub>q<sub>p</sub> = <span class="v">${fmt(m, 0)}</span>`,
  cash: 'trésorerie finale optimale', riskAria: 'Trésorerie finale optimale en fonction du niveau de sûreté',
  riskRead: (R) => R ? `Portefeuille : <span class="v">${fmt(R.x[0], 1)}</span> ; <span class="v">${fmt(R.x[1], 1)}</span> ; <span class="v">${fmt(R.x[2], 1)}</span> obligations &nbsp;·&nbsp; trésorerie finale <span class="v">${fmt(R.cash, 0)}</span>` : 'Aucune solution réalisable à ce niveau.'
};
I18N.en.f = {
  j: 'Year j', p: 'Level p', need: 'cumulative need ξ (thousands)', ccAria: 'Distribution of the cumulative need, mean and covered quantile',
  ccRead: (b, s, m) => `Mean <i>b<sub>j</sub></i> = <span class="v">${fmt(b, 0)}</span> &nbsp;·&nbsp; standard deviation σ̃<sub>j</sub> = <span class="v">${fmt(s, 0)}</span> &nbsp;·&nbsp; safety margin σ̃<sub>j</sub>q<sub>p</sub> = <span class="v">${fmt(m, 0)}</span>`,
  cash: 'optimal final cash', riskAria: 'Optimal final cash as a function of the safety level',
  riskRead: (R) => R ? `Portfolio: <span class="v">${fmt(R.x[0], 1)}</span>, <span class="v">${fmt(R.x[1], 1)}</span>, <span class="v">${fmt(R.x[2], 1)}</span> bonds &nbsp;·&nbsp; final cash <span class="v">${fmt(R.cash, 0)}</span>` : 'No feasible solution at this level.'
};
FIGS.cc = {
  state: { j: 10, p: 0.95 },
  controls: L => [
    { key: 'j', label: L.f.j, min: 1, max: 15, step: 1, fmt: v => String(v) },
    { key: 'p', label: L.f.p, min: 0.5, max: 0.995, step: 0.005, fmt: v => fmtT(100 * v, 1) + ' %' }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, b = D21.b[s.j - 1] / 1000, sd = D21.st[s.j - 1] / 1000, q = normInv(s.p), thr = b + sd * q;
    const x0 = b - 4 * sd, x1 = b + 4 * sd, pdf = x => normPdf((x - b) / sd) / sd;
    const G = Plot({ w: 680, h: 300, x0: x0, x1: x1, y0: 0, y1: pdf(b) * 1.18, mt: 26, mb: 42 });
    G.axes({ xt: ticks(x0, x1, 6), yt: [], xl: L.need, xf: v => fmtT(v, 0), yAxis: false });
    G.area(G.sample(pdf, thr, x1, 100), 0, { c: COL.s3, o: 0.3 });
    G.curve(pdf, x0, x1, { c: COL.s1, w: 2.2 }, 200);
    G.seg(b, 0, b, pdf(b) * 1.05, { c: GREY, w: 1.4, dash: '4 4' }); G.text(b, pdf(b) * 1.05, 'b', { dy: -4, italic: true, size: 12, c: COL.mute });
    G.seg(thr, 0, thr, pdf(b) * 0.9, { c: COL.s2, w: 2.2 }); G.text(thr, pdf(b) * 0.9, 'b + σ̃ q', { dy: -4, size: 11.5, c: COL.s2 });
    return { svg: G.svg(L.ccAria), read: L.ccRead(1000 * b, 1000 * sd, 1000 * sd * q) };
  }
};
const D21_CURVE = (function () { const out = []; for (let k = 0; k <= 49; k++) { const p = 0.5 + 0.01 * k; const R = d21solve(p); if (R) out.push([p, R.cash]); } return out; })();
FIGS.risk = {
  state: { p: 0.95 },
  controls: L => [{ key: 'p', label: L.f.p, min: 0.5, max: 0.99, step: 0.01, fmt: v => fmtT(100 * v, 0) + ' %' }],
  draw: function (s, lang) {
    const L = I18N[lang].f, R = d21solve(s.p);
    const G = Plot({ w: 680, h: 300, x0: 0.5, x1: 1, y0: 60000, y1: 140000, mt: 26, mb: 42, ml: 66 });
    G.axes({ xt: [0.5, 0.6, 0.7, 0.8, 0.9, 1], yt: [60000, 80000, 100000, 120000, 140000], xl: 'p', xf: v => fmtT(v, 1), yf: v => fmt(v, 0) });
    G.line(D21_CURVE, { c: COL.s1, w: 2.4 });
    if (R) G.dot(s.p, R.cash, { c: COL.s3, r: 6 });
    G.legend([{ c: COL.s1, t: L.cash }], G.ml + 8, 16);
    return { svg: G.svg(L.riskAria), read: L.riskRead(R) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.K = 1000 * rint(80, 120);
    D.beta = [1000 * rint(30, 50), 1000 * rint(30, 50), 1000 * rint(30, 50)];
    D.g = [rint(940, 1000), rint(950, 1020)]; D.c = [rint(40, 70), rint(50, 80)];
    /* obligation 1 : échéance 2 ; obligation 2 : échéance 3 */
    D.al = [[D.c[0], D.c[0] + 1000, 0], [D.c[1], D.c[1], D.c[1] + 1000]];
    D.a = D.al.map((r, i) => { let s = 0; return r.map(v => { s += v; return s - D.g[i]; }); });
    let s = 0; D.b = D.beta.map(v => { s += v; return s - D.K; });
    D.sig = [rint(2, 4) * 1000, rint(4, 6) * 1000, rint(6, 9) * 1000];
    let s2 = 0; D.st = D.sig.map(v => { s2 += v * v; return Math.sqrt(s2); });
    D.p = pick([0.9, 0.95]); D.q = normInv(D.p);
    D.bt = D.b.map((v, j) => v + D.st[j] * D.q);
    D.pB = 1 - (1 - D.p) / 3; D.qB = normInv(D.pB); D.bB = D.b.map((v, j) => v + D.st[j] * D.qB);
    const A = [0, 1, 2].map(j => [D.a[0][j], D.a[1][j]]), cobj = [D.a[0][2], D.a[1][2]];
    D.V0 = d21lp2(A, D.b, cobj); D.V1 = d21lp2(A, D.bt, cobj); D.V2 = d21lp2(A, D.bB, cobj);
    if (!D.V0.length || !D.V1.length || !D.V2.length) continue;
    if (D.b.some(v => v >= -5000)) continue;
    if (D.V0[0].x.some(v => v < 1) || D.V1[0].x.some(v => v < 1)) continue;
    if (D.V0[0].val - D.V1[0].val < 500) continue;
    D.fin = V => V[0].val - D.b[2];
    break;
  }
  return D;
};
const d21x = v => fmt(v, 2);
function d21tables(D, lang) {
  const fr = lang === 'fr';
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Année' : 'Year'}</th><th>${fr ? 'Paiement moyen' : 'Mean payment'} \\(\\beta_k\\)</th><th>${fr ? 'Écart-type' : 'Std. deviation'} \\(\\sigma_k\\)</th><th>${fr ? 'Obligation 1' : 'Bond 1'}</th><th>${fr ? 'Obligation 2' : 'Bond 2'}</th></tr></thead><tbody>${[0, 1, 2].map(k => `<tr><td>${k + 1}</td><td class="num">${fmt(D.beta[k], 0)}</td><td class="num">${fmt(D.sig[k], 0)}</td><td class="num">${D.al[0][k]}</td><td class="num">${D.al[1][k]}</td></tr>`).join('')}<tr><td>${fr ? 'Prix' : 'Price'}</td><td></td><td></td><td class="num">${D.g[0]}</td><td class="num">${D.g[1]}</td></tr></tbody></table></div>`;
}
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un fonds de pension dispose de \(K=${fmt(D.K, 0)}\) et doit effectuer trois paiements annuels. Il peut acheter aujourd'hui deux types d'obligations, en quantités \(x_1\) et \(x_2\) éventuellement fractionnaires ; le tableau donne leurs prix et leurs versements annuels, ainsi que les paiements. Il cherche à maximiser sa trésorerie à la fin de l'année 3.</div>
${d21tables(D, 'fr')}
<div class="questions"><ol>
<li><div class="q-text">Calculez les coefficients \(a_{ij}\) et les besoins cumulés \(b_j\), puis écrivez le modèle déterministe.</div></li>
<li><div class="q-text">Résolvez-le en énumérant les sommets de l'ensemble réalisable. Quelle est la trésorerie finale ?</div></li>
<li><div class="q-text">Les paiements sont en fait aléatoires, gaussiens et indépendants, d'écarts-types donnés dans le tableau. Calculez les écarts-types \(\tilde\sigma_j\) des besoins cumulés, puis écrivez l'équivalent déterministe des contraintes séparées au niveau \(p=${fmtT(D.p, 2)}\) et résolvez-le.</div></li>
<li><div class="q-text">Pour garantir la solvabilité les trois années à la fois avec probabilité ${fmtT(D.p, 2)}, on impose chaque contrainte au niveau \(1-(1-p)/3\). Justifiez ce choix, puis résolvez le nouveau problème. Comparez les trois trésoreries finales.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A pension fund has \(K=${fmt(D.K, 0)}\) and must make three annual payments. It can buy today two types of bonds, in possibly fractional quantities \(x_1\) and \(x_2\); the table gives their prices and annual payouts, together with the payments. It seeks to maximise its cash at the end of year 3.</div>
${d21tables(D, 'en')}
<div class="questions"><ol>
<li><div class="q-text">Compute the coefficients \(a_{ij}\) and the cumulative needs \(b_j\), then write the deterministic model.</div></li>
<li><div class="q-text">Solve it by listing the vertices of the feasible set. What is the final cash?</div></li>
<li><div class="q-text">Payments are in fact random, Gaussian and independent, with the standard deviations given in the table. Compute the standard deviations \(\tilde\sigma_j\) of the cumulative needs, then write the deterministic equivalent of the separate constraints at level \(p=${fmtT(D.p, 2)}\) and solve it.</div></li>
<li><div class="q-text">To guarantee solvency in all three years at once with probability ${fmtT(D.p, 2)}, each constraint is imposed at level \(1-(1-p)/3\). Justify this choice, then solve the new problem. Compare the three final cash levels.</div></li>
</ol></div>`;
};
function d21sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1];
  const lineName = i => i < 3 ? T_(['année ', 'year ']) + (i + 1) : (i === 3 ? 'x_1=0' : 'x_2=0');
  const vt = V => `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${T_(['Contraintes saturées', 'Binding constraints'])}</th><th>\\(x_1\\)</th><th>\\(x_2\\)</th><th>${T_(['Objectif', 'Objective'])}</th></tr></thead><tbody>${V.map((v, k) => `<tr><td>${v.lines.map(lineName).join(T_([' et ', ' and ']))}</td><td class="num">${d21x(v.x[0])}</td><td class="num">${d21x(v.x[1])}</td><td class="num">${k === 0 ? '<strong>' + fmt(v.val, 2) + '</strong>' : fmt(v.val, 2)}</td></tr>`).join('')}</tbody></table></div>`;
  const cons = rhs => String.raw`\left\{\begin{aligned}${[0, 1, 2].map(j => String.raw`${tex(D.a[0][j], 0)}\,x_1${D.a[1][j] < 0 ? '' : '+'}${tex(D.a[1][j], 0)}\,x_2&amp;\ge ${tex(rhs[j], 2)}`).join('\\\\')}\end{aligned}\right.`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le coefficient', 'The coefficient'])} \(a_{ij}\) ${T_(['est le total des versements de l\'obligation', 'is the total payout of bond'])} \(i\) ${T_(['jusqu\'à l\'année', 'up to year'])} \(j\) ${T_(['moins son prix ;', 'minus its price;'])} \(b_j\) ${T_(['est le total des paiements jusqu\'à l\'année', 'is the total of payments up to year'])} \(j\) ${T_(['moins le capital :', 'minus the capital:'])}
  \[\begin{aligned}${[0, 1].map(i => [0, 1, 2].map(j => String.raw`a_{${i + 1}${j + 1}}&amp;=${D.al[i].slice(0, j + 1).join('+')}-${D.g[i]}=${tex(D.a[i][j], 0)}`).join('\\\\')).join('\\\\')}\\${[0, 1, 2].map(j => String.raw`b_${j + 1}&amp;=${D.beta.slice(0, j + 1).map(v => tex(v, 0)).join('+')}-${tex(D.K, 0)}=${tex(D.b[j], 0)}`).join('\\\\')}\end{aligned}\]
  ${T_(['Le modèle déterministe maximise la trésorerie finale, à une constante près', 'The deterministic model maximises final cash, up to a constant'])} \(-b_3\) :
  \[\max_{x\ge 0}\ ${tex(D.a[0][2], 0)}\,x_1+${tex(D.a[1][2], 0)}\,x_2\qquad\text{${T_(['sous', 's.t.'])}}\qquad ${cons(D.b)}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Un programme linéaire à deux variables atteint son optimum en un sommet de l\'ensemble réalisable. Les sommets sont les intersections de deux droites frontières qui satisfont toutes les contraintes :', 'A linear programme in two variables reaches its optimum at a vertex of the feasible set. The vertices are the intersections of two boundary lines that satisfy all the constraints:'])}</p>
  ${vt(D.V0)}
  <p>${T_(['L\'optimum est', 'The optimum is'])} \(x_1\approx ${tex(D.V0[0].x[0], 2)}\), \(x_2\approx ${tex(D.V0[0].x[1], 2)}\). ${T_(['La trésorerie finale vaut l\'objectif moins', 'The final cash equals the objective minus'])} \(b_3\) : \(${tex(D.V0[0].val, 2)}-(${tex(D.b[2], 0)})\approx ${tex(D.fin(D.V0), 2)}\). ${T_(['Les contraintes saturées sont celles où la trésorerie tombe exactement à zéro : le moindre dépassement des paiements ces années-là rendrait le fonds insolvable.', 'The binding constraints are those where cash falls exactly to zero: the slightest excess payment in those years would make the fund insolvent.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les paiements étant indépendants, la variance d\'un besoin cumulé est la somme des variances :', 'Since payments are independent, the variance of a cumulative need is the sum of the variances:'])}
  \[\begin{aligned}${[0, 1, 2].map(j => String.raw`\tilde\sigma_${j + 1}&amp;=\sqrt{${D.sig.slice(0, j + 1).map(v => tex(v, 0) + '^2').join('+')}}\approx ${tex(D.st[j], 2)}`).join('\\\\')}\end{aligned}\]
  ${T_(['Avec', 'With'])} \(q_{${fmtT(D.p, 2)}}\approx ${tex(D.q, 4)}\), ${T_(['chaque contrainte en probabilité équivaut à', 'each chance constraint is equivalent to'])} \(\sum_ia_{ij}x_i\ge\tilde b_j=b_j+\tilde\sigma_jq_p\) :
  \[\begin{aligned}${[0, 1, 2].map(j => String.raw`\tilde b_${j + 1}&amp;=${tex(D.b[j], 0)}+${tex(D.st[j], 2)}\times ${tex(D.q, 4)}\approx ${tex(D.bt[j], 2)}`).join('\\\\')}\end{aligned}\]
  ${T_(['Le problème reste linéaire, avec les seconds membres', 'The problem remains linear, with right-hand sides'])} \(\tilde b_j\) ${T_(['au lieu de', 'instead of'])} \(b_j\) ${T_(['; ses sommets sont :', '; its vertices are:'])}</p>
  ${vt(D.V1)}
  <p>${T_(['La trésorerie finale optimale est', 'The optimal final cash is'])} \(${tex(D.V1[0].val, 2)}-(${tex(D.b[2], 0)})\approx ${tex(D.fin(D.V1), 2)}\), ${T_(['soit', 'that is'])} \(${tex(D.fin(D.V0) - D.fin(D.V1), 2)}\) ${T_(['de moins : c\'est le prix de la sûreté.', 'less: this is the price of safety.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Notons', 'Let'])} \(E_j\) ${T_(['l\'événement « le fonds est insolvable l\'année', 'be the event "the fund is insolvent in year'])} \(j\) ». ${T_(['D\'après l\'inégalité de Boole :', 'By Boole\'s inequality:'])}
  \[\mathbb{P}(E_1\cup E_2\cup E_3)\le\mathbb{P}(E_1)+\mathbb{P}(E_2)+\mathbb{P}(E_3)\le 3\times\frac{1-p}{3}=1-p\]
  ${T_(['La probabilité d\'être solvable les trois années est donc au moins', 'The probability of being solvent in all three years is therefore at least'])} \(p\). ${T_(['Avec', 'With'])} \(1-(1-p)/3\approx ${tex(D.pB, 4)}\), ${T_(['le quantile vaut', 'the quantile is'])} \(${tex(D.qB, 4)}\) ${T_(['et', 'and'])}
  \[${[0, 1, 2].map(j => String.raw`\tilde b_${j + 1}\approx ${tex(D.bB[j], 2)}`).join('\\qquad ')}\]
  ${T_(['Les sommets du nouvel ensemble réalisable sont :', 'The vertices of the new feasible set are:'])}</p>
  ${vt(D.V2)}
  <p>${T_(['La trésorerie finale tombe à', 'Final cash falls to'])} \(${tex(D.fin(D.V2), 2)}\). ${T_(['En résumé : modèle déterministe', 'In summary: deterministic model'])} \(${tex(D.fin(D.V0), 2)}\), ${T_(['contraintes séparées', 'separate constraints'])} \(${tex(D.fin(D.V1), 2)}\), ${T_(['contrainte jointe approchée', 'approximate joint constraint'])} \(${tex(D.fin(D.V2), 2)}\). ${T_(['Chaque niveau de protection supplémentaire coûte de la trésorerie. L\'approche de Boole est prudente : les besoins cumulés étant positivement corrélés, la vraie probabilité de solvabilité jointe dépasse', 'Each additional level of protection costs cash. Boole\'s approach is cautious: since cumulative needs are positively correlated, the true joint solvency probability exceeds'])} \(${fmtT(D.p, 2)}\).</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d21sol(D, 'fr');
I18N.en.sol = D => d21sol(D, 'en');
