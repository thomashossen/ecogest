/* ============================================================
   PAGE mf20 — Le modèle de Markowitz pas à pas
   ============================================================ */
const GREY = '#8a857a';
I18N.fr.k = {
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié',
  'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 20 – Le modèle de Markowitz', 'k-h1': 'Le modèle de Markowitz',
  'k-coursetitle': 'Estimer rendements et covariances, puis construire les portefeuilles de variance minimale', 'k-extitle': 'Estimation, portefeuille de variance minimale et frontière efficiente', 'k-soltitle': 'Estimation, portefeuille de variance minimale et frontière efficiente'
};
I18N.en.k = {
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied',
  'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 20 – The Markowitz model', 'k-h1': 'The Markowitz model',
  'k-coursetitle': 'Estimating returns and covariances, then building minimum-variance portfolios', 'k-extitle': 'Estimation, minimum-variance portfolio and efficient frontier', 'k-soltitle': 'Estimation, minimum-variance portfolio and efficient frontier'
};

/* ---------- outils ---------- */
const D20_MU = [0.1206, 0.0785, 0.0632];
const D20_S = [[0.02778, 0.00387, 0.00021], [0.00387, 0.01112, -0.00020], [0.00021, -0.00020, 0.00116]];
function d20inv3(M) {
  const [a, b, c] = M[0], [d, e, f] = M[1], [g, h, i] = M[2];
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C;
  return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]];
}
const d20mv = (M, v) => M.map(r => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
const d20dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
/* frontière sans contrainte de signe : x(m) = Sigma^-1 (l1 mu + l2 e) */
function d20front(mu, S) {
  const Si = d20inv3(S), e = [1, 1, 1], Se = d20mv(Si, e), Sm = d20mv(Si, mu);
  const A = d20dot(e, Se), B = d20dot(e, Sm), C = d20dot(mu, Sm), Dl = A * C - B * B;
  const at = m => { const l1 = (A * m - B) / Dl, l2 = (C - B * m) / Dl; const x = [0, 1, 2].map(k => l1 * Sm[k] + l2 * Se[k]); return { x: x, l1: l1, l2: l2, v: (A * m * m - 2 * B * m + C) / Dl }; };
  return { A: A, B: B, C: C, D: Dl, mMin: B / A, vMin: 1 / A, at: at, Si: Si };
}
const d20var2 = (w, s1, s2, c) => w * w * s1 * s1 + (1 - w) * (1 - w) * s2 * s2 + 2 * w * (1 - w) * c;

function d20code(lang, lines) {
  const esc2 = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<div class="code-wrap"><div class="code-head"><span>Python</span><button type="button" onclick="copyCode(this)">' + (lang === 'fr' ? 'Copier' : 'Copy') + '</button></div><div class="code-block">' +
    lines.map(l => '<div class="cl"><code>' + (l === '' ? '&nbsp;' : esc2(l)) + '</code></div>').join('') + '</div></div>';
}
const D20_PY = c => [
  'import numpy as np',
  '',
  'mu = np.array([0.1206, 0.0785, 0.0632])              # ' + c[0],
  'S = np.array([[0.02778,  0.00387,  0.00021],',
  '              [0.00387,  0.01112, -0.00020],',
  '              [0.00021, -0.00020,  0.00116]])',
  'm = 0.08                                              # ' + c[1],
  '',
  'Si, e = np.linalg.inv(S), np.ones(3)',
  'A, B, C = e @ Si @ e, e @ Si @ mu, mu @ Si @ mu',
  'l1, l2 = (A * m - B) / (A * C - B**2), (C - B * m) / (A * C - B**2)',
  'x = Si @ (l1 * mu + l2 * e)',
  'print(x.round(4), np.sqrt(x @ S @ x))                 # [0.2514 0.1548 0.5938] 0.0525'
];

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez estimer les rendements moyens, les variances et les covariances d'actifs à partir de séries historiques, écrire le modèle de Markowitz, calculer le portefeuille de variance minimale de deux actifs et les portefeuilles de la frontière efficiente par la méthode de Lagrange.<br><br>
<strong>Pourquoi en finance ?</strong> Le modèle de Markowitz (1952) est le fondement de la gestion de portefeuille : il formalise l'arbitrage entre rendement espéré et risque, et montre que la diversification réduit le risque sans nécessairement réduire le rendement.<br><br>
<strong>Prérequis.</strong> Variance d'une combinaison linéaire, programmation linéaire et prix duaux (page 15), multiplicateurs de Lagrange.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Estimer les paramètres</a> · <a href="#s2">2. Le modèle</a> · <a href="#s3">3. Deux actifs</a> · <a href="#s4">4. La frontière efficiente</a> · <a href="#s5">5. En Python</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Estimer les paramètres</div>
<p>À partir des valeurs \(I_{i,t}\) d'un actif ou d'un indice \(i\), on calcule les rendements \(r_{i,t}=(I_{i,t}-I_{i,t-1})/I_{i,t-1}\), \(t=1,\ldots,T\). On estime ensuite :
\[\bar r_i=\frac{1}{T}\sum_{t=1}^{T}r_{i,t},\qquad\sigma_{ij}=\frac{1}{T}\sum_{t=1}^{T}(r_{i,t}-\bar r_i)(r_{j,t}-\bar r_j),\qquad\rho_{ij}=\frac{\sigma_{ij}}{\sigma_i\,\sigma_j}\]
où \(\sigma_i=\sqrt{\sigma_{ii}}\) est la volatilité. La moyenne arithmétique ne dit pas ce qu'a rapporté l'actif : après une hausse de 25 % puis une baisse de 25 %, la moyenne arithmétique est nulle, mais il reste \(1.25\times 0.75=0.9375\) fois la mise. Le rendement réellement obtenu par an est la moyenne <em>géométrique</em> :
\[1+\bar r_i^{\,\text{géo}}=\Big(\prod_{t=1}^{T}(1+r_{i,t})\Big)^{1/T}\]
ici \(\sqrt{0.9375}-1\approx-3.2\) %. La moyenne géométrique est toujours inférieure ou égale à la moyenne arithmétique ; l'écart est d'autant plus grand que la volatilité est forte. Les diapositives estiment ainsi, pour des actions (S&amp;P 500), des obligations à 10 ans et le monétaire, des moyennes arithmétiques de 12.06 %, 7.85 % et 6.32 %, des moyennes géométriques de 10.73 %, 7.37 % et 6.27 %, et des volatilités de 16.67 %, 10.55 % et 3.40 %. La variance du monétaire y est notée 0.0015 ; une volatilité de 3.40 % correspond à 0.00116, valeur retenue dans cette page.</p>

<div class="dossier-title" id="s2">2. Le modèle de Markowitz</div>
<p>Un investisseur répartit son capital entre \(n\) actifs, en proportions \(x_1,\ldots,x_n\). Le rendement du portefeuille, \(R_p=\sum_ix_iR_i\), est aléatoire ; son espérance et sa variance sont :
\[\mathbb{E}[R_p]=\mu^Tx=\sum_i\mu_ix_i,\qquad\text{Var}(R_p)=x^T\Sigma x=\sum_i\sum_j\sigma_{ij}x_ix_j\]
Markowitz mesure le risque par la variance et cherche, pour un rendement espéré visé \(m\), le portefeuille de variance minimale :
\[\begin{aligned}\min_x\ &amp;\ x^T\Sigma x\\\text{sous }&amp;\ \mu^Tx=m,\qquad e^Tx=1,\qquad x\ge 0\end{aligned}\]
La contrainte \(e^Tx=1\) est la contrainte de budget, \(x\ge 0\) interdit la vente à découvert. L'exemple des diapositives (1000 dollars à répartir entre IBM, Walmart et Southern Electric pour viser 5 % par mois) s'écrit de la même façon avec des montants au lieu de proportions. L'objectif est quadratique et les contraintes linéaires : c'est un programme quadratique convexe, que les solveurs résolvent très bien.</p>

<div class="dossier-title" id="s3">3. Deux actifs</div>
<p>Avec deux actifs de poids \(w\) et \(1-w\), la variance du portefeuille est un polynôme du second degré en \(w\) :
\[\sigma_p^2(w)=w^2\sigma_1^2+(1-w)^2\sigma_2^2+2w(1-w)\sigma_{12}\]
Sa dérivée s'annule en un unique point, le portefeuille de <em>variance minimale</em> :
\[w^*=\frac{\sigma_2^2-\sigma_{12}}{\sigma_1^2+\sigma_2^2-2\sigma_{12}}\]
Quand \(\rho_{12}&lt;1\), la volatilité du portefeuille est strictement inférieure à la moyenne pondérée des volatilités : c'est l'effet de la diversification. Avec \(\rho_{12}=-1\), on peut même annuler complètement le risque. Les portefeuilles situés sous le portefeuille de variance minimale ne sont pas <em>efficients</em> : un autre portefeuille a la même volatilité et un rendement espéré plus élevé.</p>
<div class="ifig" data-fig="two"></div>
<div class="fig-cap">Figure 1 — Rendement espéré et volatilité des portefeuilles combinant les actions et les obligations des diapositives, quand le poids des actions varie de 0 à 1. Les pointillés montrent les cas extrêmes \(\rho=1\) (droite) et \(\rho=-1\) (deux segments). Diminuez la corrélation : la courbe se creuse vers la gauche, et la diversification devient plus efficace.</div>

<div class="dossier-title" id="s4">4. La frontière efficiente</div>
<p>Sans la contrainte \(x\ge 0\), le problème se résout par la méthode de Lagrange. Avec la fonction \(\frac{1}{2}x^T\Sigma x\), qui a les mêmes minima, et les multiplicateurs \(\lambda_1\), \(\lambda_2\) des deux contraintes d'égalité, les conditions d'optimalité sont :
\[\Sigma x=\lambda_1\,\mu+\lambda_2\,e,\qquad\mu^Tx=m,\qquad e^Tx=1\]
La première donne \(x=\lambda_1\Sigma^{-1}\mu+\lambda_2\Sigma^{-1}e\) ; en reportant dans les deux autres, avec \(A=e^T\Sigma^{-1}e\), \(B=e^T\Sigma^{-1}\mu\), \(C=\mu^T\Sigma^{-1}\mu\) et \(\Delta=AC-B^2\), on obtient :
\[\lambda_1=\frac{Am-B}{\Delta},\qquad\lambda_2=\frac{C-Bm}{\Delta},\qquad\sigma_p^2(m)=\frac{Am^2-2Bm+C}{\Delta}\]
La frontière est une hyperbole dans le plan (volatilité, rendement), de sommet le portefeuille de variance minimale, de rendement \(B/A\) et de variance \(1/A\). Seule sa branche supérieure est efficiente. Si certains poids obtenus sont négatifs, la solution suppose une vente à découvert ; avec la contrainte \(x\ge 0\), il faut résoudre le programme quadratique avec un solveur, et la frontière se raccourcit.</p>
<div class="ifig" data-fig="front"></div>
<div class="fig-cap">Figure 2 — Frontière de Markowitz sans contrainte de signe pour les trois actifs des diapositives (actions, obligations, monétaire), et portefeuille de rendement visé \(m\). Pour \(m\) élevé, le poids du monétaire devient négatif (point rouge) : il faut alors vendre à découvert, ce que la contrainte \(x\ge 0\) interdit.</div>

<div class="dossier-title" id="s5">5. En Python</div>
<p>Les formules de la section 4, pour les données des diapositives et un rendement visé de 8 %.</p>
${d20code('fr', D20_PY(['actions, obligations, monétaire', 'rendement visé']))}
<p>Avec la contrainte \(x\ge 0\), on utilise un solveur de programmes quadratiques, par exemple la bibliothèque <code>cvxpy</code>.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Moyenne arithmétique pour l'espérance d'un an, moyenne géométrique pour le rendement réellement composé ; covariances et corrélations estimées sur les mêmes dates.</li>
<li>Markowitz : minimiser \(x^T\Sigma x\) sous un rendement visé et le budget ; programme quadratique convexe.</li>
<li>Deux actifs : \(w^*=\frac{\sigma_2^2-\sigma_{12}}{\sigma_1^2+\sigma_2^2-2\sigma_{12}}\) ; la diversification réduit le risque dès que \(\rho&lt;1\).</li>
<li>Sans contrainte de signe, \(\Sigma x=\lambda_1\mu+\lambda_2e\) et la frontière est une hyperbole ; seule sa partie haute est efficiente.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can estimate the average returns, variances and covariances of assets from historical series, write the Markowitz model, compute the minimum-variance portfolio of two assets and the portfolios of the efficient frontier by the Lagrange method.<br><br>
<strong>Why in finance?</strong> The Markowitz model (1952) is the foundation of portfolio management: it formalises the trade-off between expected return and risk, and shows that diversification reduces risk without necessarily reducing return.<br><br>
<strong>Prerequisites.</strong> Variance of a linear combination, linear programming and shadow prices (page 15), Lagrange multipliers.
</div>
<p class="toc">Contents: <a href="#s1">1. Estimating the parameters</a> · <a href="#s2">2. The model</a> · <a href="#s3">3. Two assets</a> · <a href="#s4">4. The efficient frontier</a> · <a href="#s5">5. In Python</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Estimating the parameters</div>
<p>From the values \(I_{i,t}\) of an asset or index \(i\), we compute the returns \(r_{i,t}=(I_{i,t}-I_{i,t-1})/I_{i,t-1}\), \(t=1,\ldots,T\). We then estimate:
\[\bar r_i=\frac{1}{T}\sum_{t=1}^{T}r_{i,t},\qquad\sigma_{ij}=\frac{1}{T}\sum_{t=1}^{T}(r_{i,t}-\bar r_i)(r_{j,t}-\bar r_j),\qquad\rho_{ij}=\frac{\sigma_{ij}}{\sigma_i\,\sigma_j}\]
where \(\sigma_i=\sqrt{\sigma_{ii}}\) is the volatility. The arithmetic mean does not say what the asset actually earned: after a rise of 25% and then a fall of 25%, the arithmetic mean is zero, but only \(1.25\times 0.75=0.9375\) times the stake is left. The return actually earned per year is the <em>geometric</em> mean:
\[1+\bar r_i^{\,\text{geo}}=\Big(\prod_{t=1}^{T}(1+r_{i,t})\Big)^{1/T}\]
here \(\sqrt{0.9375}-1\approx-3.2\)%. The geometric mean is always at most the arithmetic mean; the gap grows with volatility. The slides thus estimate, for stocks (S&amp;P 500), 10-year bonds and the money market, arithmetic means of 12.06%, 7.85% and 6.32%, geometric means of 10.73%, 7.37% and 6.27%, and volatilities of 16.67%, 10.55% and 3.40%. The money-market variance is given there as 0.0015; a volatility of 3.40% corresponds to 0.00116, the value used on this page.</p>

<div class="dossier-title" id="s2">2. The Markowitz model</div>
<p>An investor splits capital among \(n\) assets, in proportions \(x_1,\ldots,x_n\). The portfolio return, \(R_p=\sum_ix_iR_i\), is random; its expectation and variance are:
\[\mathbb{E}[R_p]=\mu^Tx=\sum_i\mu_ix_i,\qquad\text{Var}(R_p)=x^T\Sigma x=\sum_i\sum_j\sigma_{ij}x_ix_j\]
Markowitz measures risk by the variance and looks, for a target expected return \(m\), for the minimum-variance portfolio:
\[\begin{aligned}\min_x\ &amp;\ x^T\Sigma x\\\text{s.t. }&amp;\ \mu^Tx=m,\qquad e^Tx=1,\qquad x\ge 0\end{aligned}\]
The constraint \(e^Tx=1\) is the budget constraint, \(x\ge 0\) rules out short selling. The example in the slides (1000 dollars to split between IBM, Walmart and Southern Electric aiming at 5% per month) is written in the same way with amounts instead of proportions. The objective is quadratic and the constraints linear: this is a convex quadratic programme, which solvers handle very well.</p>

<div class="dossier-title" id="s3">3. Two assets</div>
<p>With two assets with weights \(w\) and \(1-w\), the portfolio variance is a quadratic polynomial in \(w\):
\[\sigma_p^2(w)=w^2\sigma_1^2+(1-w)^2\sigma_2^2+2w(1-w)\sigma_{12}\]
Its derivative vanishes at a single point, the <em>minimum-variance</em> portfolio:
\[w^*=\frac{\sigma_2^2-\sigma_{12}}{\sigma_1^2+\sigma_2^2-2\sigma_{12}}\]
When \(\rho_{12}&lt;1\), the portfolio volatility is strictly below the weighted average of the volatilities: this is the diversification effect. With \(\rho_{12}=-1\), risk can even be eliminated altogether. Portfolios below the minimum-variance portfolio are not <em>efficient</em>: another portfolio has the same volatility and a higher expected return.</p>
<div class="ifig" data-fig="two"></div>
<div class="fig-cap">Figure 1 — Expected return and volatility of the portfolios combining the stocks and bonds of the slides, as the stock weight varies from 0 to 1. The dashed lines show the extreme cases \(\rho=1\) (straight line) and \(\rho=-1\) (two segments). Lower the correlation: the curve bends to the left, and diversification becomes more effective.</div>

<div class="dossier-title" id="s4">4. The efficient frontier</div>
<p>Without the constraint \(x\ge 0\), the problem is solved by the Lagrange method. With the function \(\frac{1}{2}x^T\Sigma x\), which has the same minima, and the multipliers \(\lambda_1\), \(\lambda_2\) of the two equality constraints, the optimality conditions are:
\[\Sigma x=\lambda_1\,\mu+\lambda_2\,e,\qquad\mu^Tx=m,\qquad e^Tx=1\]
The first gives \(x=\lambda_1\Sigma^{-1}\mu+\lambda_2\Sigma^{-1}e\); substituting into the other two, with \(A=e^T\Sigma^{-1}e\), \(B=e^T\Sigma^{-1}\mu\), \(C=\mu^T\Sigma^{-1}\mu\) and \(\Delta=AC-B^2\), we obtain:
\[\lambda_1=\frac{Am-B}{\Delta},\qquad\lambda_2=\frac{C-Bm}{\Delta},\qquad\sigma_p^2(m)=\frac{Am^2-2Bm+C}{\Delta}\]
The frontier is a hyperbola in the (volatility, return) plane, whose vertex is the minimum-variance portfolio, with return \(B/A\) and variance \(1/A\). Only its upper branch is efficient. If some weights obtained are negative, the solution involves short selling; with the constraint \(x\ge 0\), the quadratic programme must be solved with a solver, and the frontier gets shorter.</p>
<div class="ifig" data-fig="front"></div>
<div class="fig-cap">Figure 2 — Markowitz frontier without sign constraint for the three assets of the slides (stocks, bonds, money market), and the portfolio with target return \(m\). For high \(m\), the money-market weight becomes negative (red point): short selling is then required, which the constraint \(x\ge 0\) forbids.</div>

<div class="dossier-title" id="s5">5. In Python</div>
<p>The formulas of section 4, for the data of the slides and a target return of 8%.</p>
${d20code('en', D20_PY(['stocks, bonds, money market', 'target return']))}
<p>With the constraint \(x\ge 0\), a quadratic-programming solver is used, for instance the <code>cvxpy</code> library.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Arithmetic mean for the one-year expectation, geometric mean for the return actually compounded; covariances and correlations estimated over the same dates.</li>
<li>Markowitz: minimise \(x^T\Sigma x\) subject to a target return and the budget; a convex quadratic programme.</li>
<li>Two assets: \(w^*=\frac{\sigma_2^2-\sigma_{12}}{\sigma_1^2+\sigma_2^2-2\sigma_{12}}\); diversification reduces risk as soon as \(\rho&lt;1\).</li>
<li>Without sign constraint, \(\Sigma x=\lambda_1\mu+\lambda_2e\) and the frontier is a hyperbola; only its upper part is efficient.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  rho: 'Corrélation ρ', w: 'Poids des actions w', vol: 'volatilité (%)', ret: 'rendement espéré (%)', twoAria: 'Rendement et volatilité des portefeuilles de deux actifs',
  twoRead: (w, s, m, ws) => `Portefeuille choisi : volatilité <span class="v">${fmt(s, 2)} %</span>, rendement <span class="v">${fmt(m, 2)} %</span><br>Variance minimale pour <i>w</i>* = <span class="v">${fmt(ws, 3)}</span>`,
  m: 'Rendement visé m', names: ['actions', 'obligations', 'monétaire'], frAria: 'Frontière de Markowitz de trois actifs',
  frRead: (x, s, neg) => `Poids : ${x.map((v, i) => `${['actions', 'obligations', 'monétaire'][i]} <span class="v">${fmt(v, 3)}</span>`).join(' ; ')} &nbsp;·&nbsp; volatilité <span class="v">${fmt(s, 2)} %</span>` + (neg ? '<br>Un poids est négatif : ce portefeuille suppose une vente à découvert.' : '')
};
I18N.en.f = {
  rho: 'Correlation ρ', w: 'Stock weight w', vol: 'volatility (%)', ret: 'expected return (%)', twoAria: 'Return and volatility of two-asset portfolios',
  twoRead: (w, s, m, ws) => `Chosen portfolio: volatility <span class="v">${fmt(s, 2)}%</span>, return <span class="v">${fmt(m, 2)}%</span><br>Minimum variance at <i>w</i>* = <span class="v">${fmt(ws, 3)}</span>`,
  m: 'Target return m', names: ['stocks', 'bonds', 'money market'], frAria: 'Markowitz frontier of three assets',
  frRead: (x, s, neg) => `Weights: ${x.map((v, i) => `${['stocks', 'bonds', 'money market'][i]} <span class="v">${fmt(v, 3)}</span>`).join(', ')} &nbsp;·&nbsp; volatility <span class="v">${fmt(s, 2)}%</span>` + (neg ? '<br>One weight is negative: this portfolio requires short selling.' : '')
};
FIGS.two = {
  state: { rho: 0.22, w: 0.5 },
  controls: L => [
    { key: 'rho', label: L.f.rho, min: -1, max: 1, step: 0.05, fmt: v => fmtT(v, 2) },
    { key: 'w', label: L.f.w, min: 0, max: 1, step: 0.05, fmt: v => fmtT(v, 2) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, s1 = 0.1667, s2 = 0.1055, m1 = 0.1206, m2 = 0.0785, c = s.rho * s1 * s2;
    const G = Plot({ w: 680, h: 320, x0: 0, x1: 20, y0: 7, y1: 13, mt: 26, mb: 42 });
    G.axes({ xt: [0, 5, 10, 15, 20], yt: [7, 8, 9, 10, 11, 12, 13], xl: L.vol, xf: v => String(v), yf: v => String(v) });
    const curve = cc => { const p = []; for (let k = 0; k <= 100; k++) { const w = k / 100; p.push([100 * Math.sqrt(Math.max(0, d20var2(w, s1, s2, cc))), 100 * (w * m1 + (1 - w) * m2)]); } return p; };
    G.line(curve(s1 * s2), { c: GREY, w: 1.2, dash: '4 4' }); G.line(curve(-s1 * s2), { c: GREY, w: 1.2, dash: '4 4' });
    G.line(curve(c), { c: COL.s1, w: 2.4 });
    let ws = (s2 * s2 - c) / (s1 * s1 + s2 * s2 - 2 * c); ws = Math.max(0, Math.min(1, ws));
    G.dot(100 * Math.sqrt(d20var2(ws, s1, s2, c)), 100 * (ws * m1 + (1 - ws) * m2), { c: COL.s2, r: 5 });
    const sp = 100 * Math.sqrt(d20var2(s.w, s1, s2, c)), mp = 100 * (s.w * m1 + (1 - s.w) * m2);
    G.dot(sp, mp, { c: COL.s3, r: 6 });
    G.text(100 * s1, 100 * m1, L.names[0], { dx: 8, anchor: 'start', size: 11, c: COL.mute }); G.text(100 * s2, 100 * m2, L.names[1], { dx: 8, dy: 4, anchor: 'start', size: 11, c: COL.mute });
    return { svg: G.svg(L.twoAria), read: L.twoRead(s.w, sp, mp, ws) };
  }
};
FIGS.front = {
  state: { m: 8 },
  controls: L => [{ key: 'm', label: L.f.m, min: 6.6, max: 13, step: 0.2, fmt: v => fmtT(v, 1) + ' %' }],
  draw: function (s, lang) {
    const L = I18N[lang].f, F = d20front(D20_MU, D20_S), P = F.at(s.m / 100);
    const G = Plot({ w: 680, h: 320, x0: 0, x1: 20, y0: 4, y1: 14, mt: 26, mb: 42 });
    G.axes({ xt: [0, 5, 10, 15, 20], yt: [4, 6, 8, 10, 12, 14], xl: L.vol, xf: v => String(v), yf: v => String(v) });
    const up = [], dn = [];
    for (let k = 0; k <= 160; k++) { const m = F.mMin + k * 0.0005; const v = Math.sqrt((F.A * m * m - 2 * F.B * m + F.C) / F.D); up.push([100 * v, 100 * m]); const m2 = F.mMin - k * 0.0005; dn.push([100 * Math.sqrt((F.A * m2 * m2 - 2 * F.B * m2 + F.C) / F.D), 100 * m2]); }
    G.clip(); G.line(dn, { c: GREY, w: 1.6, dash: '5 4', clip: true }); G.line(up, { c: COL.s1, w: 2.4, clip: true });
    D20_MU.forEach((m, i) => { G.dot(100 * Math.sqrt(D20_S[i][i]), 100 * m, { c: COL.s4, r: 4.5 }); G.text(100 * Math.sqrt(D20_S[i][i]), 100 * m, L.names[i], { dx: 8, dy: 4, anchor: 'start', size: 11, c: COL.mute }); });
    const neg = P.x.some(v => v < -1e-9);
    G.dot(100 * Math.sqrt(P.v), s.m, { c: neg ? COL.s3 : COL.s2, r: 6 });
    G.dot(100 * Math.sqrt(F.vMin), 100 * F.mMin, { c: COL.ink, r: 4, hollow: true });
    return { svg: G.svg(L.frAria), read: L.frRead(P.x, 100 * Math.sqrt(P.v), neg) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed, T: 5 };
  for (;;) {
    D.rA = Array.from({ length: 5 }, () => rint(-15, 30)); D.rB = Array.from({ length: 5 }, () => rint(-4, 14));
    const mA = D.rA.reduce((a, b) => a + b, 0) / 5, mB = D.rB.reduce((a, b) => a + b, 0) / 5;
    if (mA <= mB + 2) continue;
    D.mA = mA; D.mB = mB;
    D.vA = D.rA.reduce((s, r) => s + (r - mA) * (r - mA), 0) / 5; D.vB = D.rB.reduce((s, r) => s + (r - mB) * (r - mB), 0) / 5;
    D.cAB = D.rA.reduce((s, r, t) => s + (r - mA) * (D.rB[t] - mB), 0) / 5;
    D.rhoAB = D.cAB / Math.sqrt(D.vA * D.vB);
    if (D.vB >= D.vA || Math.abs(D.rhoAB) > 0.9) continue;
    D.ws = (D.vB - D.cAB) / (D.vA + D.vB - 2 * D.cAB);
    if (D.ws <= 0.03 || D.ws >= 0.97) continue;
    D.mS = D.ws * mA + (1 - D.ws) * mB; D.sS = Math.sqrt(d20var2(D.ws, Math.sqrt(D.vA), Math.sqrt(D.vB), D.cAB));
    D.geoA = 100 * (Math.pow(D.rA.reduce((p, r) => p * (1 + r / 100), 1), 1 / 5) - 1);
    D.eff = rnd() < 0.5;
    D.m3 = Math.round(10 * (D.eff ? D.mS + (mA - D.mS) * (0.3 + 0.4 * rnd()) : mB + (D.mS - mB) * (0.2 + 0.6 * rnd()))) / 10;
    D.w3 = (D.m3 - mB) / (mA - mB); D.s3 = Math.sqrt(d20var2(D.w3, Math.sqrt(D.vA), Math.sqrt(D.vB), D.cAB));
    if (Math.abs(D.m3 - D.mS) < 0.1) continue;
    D.eff = D.m3 > D.mS;
    D.w3b = 2 * D.ws - D.w3; D.m3b = D.w3b * mA + (1 - D.w3b) * mB;   /* même variance, de l'autre côté du sommet */
    break;
  }
  /* trois actifs */
  for (;;) {
    D.mu = [rint(9, 13) / 100, rint(6, 8) / 100, rint(2, 4) / 100];
    D.sg = [rint(18, 25) / 100, rint(9, 14) / 100, rint(2, 4) / 100];
    D.cr = [pick([0.2, 0.3, 0.4]), pick([0, 0.1]), pick([-0.1, 0, 0.1])];   /* rho12, rho13, rho23 */
    const s = D.sg, r = D.cr;
    D.S = [[s[0] * s[0], r[0] * s[0] * s[1], r[1] * s[0] * s[2]], [r[0] * s[0] * s[1], s[1] * s[1], r[2] * s[1] * s[2]], [r[1] * s[0] * s[2], r[2] * s[1] * s[2], s[2] * s[2]]];
    D.S = D.S.map(row => row.map(v => Math.round(v * 1e5) / 1e5));
    const F = d20front(D.mu, D.S);
    D.m4 = rint(Math.ceil(100 * F.mMin) + 1, Math.floor(100 * D.mu[0]) - 1) / 100;
    if (!(D.m4 > F.mMin)) continue;
    const P = F.at(D.m4);
    if (P.x.some(v => v < 0.03)) continue;
    D.F = F; D.P = P; D.Sx = d20mv(D.S, P.x); break;
  }
  return D;
};
function d20tab(D, lang) {
  const fr = lang === 'fr';
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Année' : 'Year'}</th>${[1, 2, 3, 4, 5].map(t => `<th>${t}</th>`).join('')}</tr></thead><tbody><tr><td>${fr ? 'Rendement de A (%)' : 'Return of A (%)'}</td>${D.rA.map(v => `<td class="num">${v}</td>`).join('')}</tr><tr><td>${fr ? 'Rendement de B (%)' : 'Return of B (%)'}</td>${D.rB.map(v => `<td class="num">${v}</td>`).join('')}</tr></tbody></table></div>`;
}
const d20M = (S) => String.raw`\begin{pmatrix}${S.map(r => r.map(v => tex(v, 5)).join('&amp;')).join('\\\\')}\end{pmatrix}`;
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Les questions 1 à 3 portent sur les deux actifs A et B, la question 4 sur trois autres actifs.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Estimation.</strong> On observe les rendements annuels suivants.
  ${d20tab(D, 'fr')}
  <ol><li>Calculez les moyennes arithmétiques, les variances (avec le facteur \(1/T\)), la covariance et la corrélation des deux rendements.</li>
  <li>Calculez la moyenne géométrique de A et comparez-la à sa moyenne arithmétique.</li></ol></div></li>
<li><div class="q-text"><strong>Variance minimale.</strong> Avec ces estimations, déterminez le portefeuille de A et B de variance minimale, puis son rendement espéré et sa volatilité.</div></li>
<li><div class="q-text"><strong>Rendement visé.</strong> On vise un rendement espéré de ${fmtT(D.m3, 1)} %. Déterminez le portefeuille correspondant et sa volatilité. Est-il efficient ?</div></li>
<li><div class="q-text"><strong>Trois actifs.</strong> Trois actifs ont pour rendements espérés \(\mu=(${D.mu.map(v => fmtT(v, 2)).join(',\\,')})\) et pour matrice de covariance :
  \[\Sigma=${d20M(D.S)}\]
  <ol><li>Écrivez le problème de Markowitz pour un rendement visé \(m=${fmtT(D.m4, 2)}\), sans vente à découvert, puis les conditions de Lagrange du problème sans contrainte de signe.</li>
  <li>On propose le portefeuille \(x=(${D.P.x.map(v => fmtT(v, 4)).join(',\\,')})\) avec \(\lambda_1=${fmtT(D.P.l1, 4)}\) et \(\lambda_2=${fmtT(D.P.l2, 4)}\). Vérifiez qu'il satisfait les conditions de Lagrange, et calculez sa volatilité.</li>
  <li>Ce portefeuille est-il aussi solution du problème avec \(x\ge 0\) ? Justifiez.</li></ol></div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">Questions 1 to 3 concern the two assets A and B, question 4 three other assets.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Estimation.</strong> The following annual returns are observed.
  ${d20tab(D, 'en')}
  <ol><li>Compute the arithmetic means, the variances (with the factor \(1/T\)), the covariance and the correlation of the two returns.</li>
  <li>Compute the geometric mean of A and compare it with its arithmetic mean.</li></ol></div></li>
<li><div class="q-text"><strong>Minimum variance.</strong> With these estimates, determine the minimum-variance portfolio of A and B, then its expected return and volatility.</div></li>
<li><div class="q-text"><strong>Target return.</strong> The target expected return is ${fmtT(D.m3, 1)}%. Determine the corresponding portfolio and its volatility. Is it efficient?</div></li>
<li><div class="q-text"><strong>Three assets.</strong> Three assets have expected returns \(\mu=(${D.mu.map(v => fmtT(v, 2)).join(',\\,')})\) and covariance matrix:
  \[\Sigma=${d20M(D.S)}\]
  <ol><li>Write the Markowitz problem for a target return \(m=${fmtT(D.m4, 2)}\), without short selling, then the Lagrange conditions of the problem without sign constraint.</li>
  <li>The portfolio \(x=(${D.P.x.map(v => fmtT(v, 4)).join(',\\,')})\) with \(\lambda_1=${fmtT(D.P.l1, 4)}\) and \(\lambda_2=${fmtT(D.P.l2, 4)}\) is proposed. Check that it satisfies the Lagrange conditions, and compute its volatility.</li>
  <li>Is this portfolio also a solution of the problem with \(x\ge 0\)? Justify.</li></ol></div></li>
</ol></div>`;
};
function d20sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1];
  const sum = a => a.reduce((x, y) => x + y, 0);
  const dev = (a, m) => a.map(r => '(' + r + '-' + (m < 0 ? '(' + tex(m, 1) + ')' : tex(m, 1)) + ')^2').join('+');
  const sA = Math.sqrt(D.vA), sB = Math.sqrt(D.vB), P = D.P, mu = D.mu, S = D.S;
  const lhs = D.Sx, rhs = [0, 1, 2].map(k => P.l1 * mu[k] + P.l2);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Avec', 'With'])} \(T=5\) ${T_(['et les rendements en pourcentage :', 'and returns in percent:'])}
  \[\begin{aligned}\bar r_A&amp;=\frac{${D.rA.join('+').replace(/\+-/g, '-')}}{5}=${tex(D.mA, 1)}\qquad\bar r_B=\frac{${D.rB.join('+').replace(/\+-/g, '-')}}{5}=${tex(D.mB, 1)}\\\sigma_A^2&amp;=\frac{1}{5}\big(${dev(D.rA, D.mA)}\big)=${tex(D.vA, 2)}\\\sigma_B^2&amp;=\frac{1}{5}\big(${dev(D.rB, D.mB)}\big)=${tex(D.vB, 2)}\\\sigma_{AB}&amp;=\frac{1}{5}\sum_{t=1}^{5}(r_{A,t}-\bar r_A)(r_{B,t}-\bar r_B)=${tex(D.cAB, 2)}\\\rho_{AB}&amp;=\frac{\sigma_{AB}}{\sigma_A\sigma_B}=\frac{${tex(D.cAB, 2)}}{${tex(sA, 3)}\times ${tex(sB, 3)}}\approx ${tex(D.rhoAB, 3)}\end{aligned}\]
  ${T_(['Les variances sont en (points de %)², les volatilités en points de % :', 'The variances are in (percentage points)², the volatilities in percentage points:'])} \(\sigma_A\approx ${tex(sA, 2)}\), \(\sigma_B\approx ${tex(sB, 2)}\).</p>
  <p><strong>b.</strong> ${T_(['On compose les rendements, puis on prend la racine cinquième :', 'We compound the returns, then take the fifth root:'])}
  \[1+\bar r_A^{\,\text{${T_(['géo', 'geo'])}}}=\Big(${D.rA.map(r => tex(1 + r / 100, 2)).join('\\times ')}\Big)^{1/5}\qquad\text{${T_(['d\'où', 'hence'])}}\qquad\bar r_A^{\,\text{${T_(['géo', 'geo'])}}}\approx ${tex(D.geoA, 2)}\,\%\]
  ${T_(['La moyenne géométrique est inférieure à la moyenne arithmétique', 'The geometric mean is below the arithmetic mean'])}, \(${tex(D.mA, 1)}\,\%\) ; ${T_(['l\'écart, d\'environ', 'the gap, about'])} \(\sigma_A^2/2\approx ${tex(D.vA / 200, 2)}\) ${T_(['point, vient de la volatilité : les baisses pèsent plus que les hausses de même taille.', 'point, comes from volatility: falls weigh more than rises of the same size.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La variance du portefeuille', 'The variance of the portfolio'])} \(w\,A+(1-w)\,B\) ${T_(['est', 'is'])} \(\sigma_p^2(w)=w^2\sigma_A^2+(1-w)^2\sigma_B^2+2w(1-w)\sigma_{AB}\), ${T_(['polynôme du second degré de coefficient dominant', 'a quadratic polynomial with leading coefficient'])} \(\sigma_A^2+\sigma_B^2-2\sigma_{AB}&gt;0\). ${T_(['Sa dérivée s\'annule en :', 'Its derivative vanishes at:'])}
  \[w^*=\frac{\sigma_B^2-\sigma_{AB}}{\sigma_A^2+\sigma_B^2-2\sigma_{AB}}=\frac{${tex(D.vB, 2)}-${D.cAB < 0 ? '(' + tex(D.cAB, 2) + ')' : tex(D.cAB, 2)}}{${tex(D.vA, 2)}+${tex(D.vB, 2)}-2\times ${D.cAB < 0 ? '(' + tex(D.cAB, 2) + ')' : tex(D.cAB, 2)}}\approx ${tex(D.ws, 4)}\]
  \[\begin{aligned}\mu_p&amp;=${tex(D.ws, 4)}\times ${tex(D.mA, 1)}+${tex(1 - D.ws, 4)}\times ${tex(D.mB, 1)}\approx ${tex(D.mS, 2)}\,\%\\\sigma_p&amp;=\sqrt{\sigma_p^2(w^*)}\approx ${tex(D.sS, 2)}\,\%\end{aligned}\]
  ${T_(['Sa volatilité est inférieure à celle de chacun des deux actifs : c\'est l\'effet de la diversification.', 'Its volatility is below that of each of the two assets: this is the diversification effect.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec deux actifs, la contrainte de rendement fixe le portefeuille :', 'With two assets, the return constraint pins down the portfolio:'])}
  \[${tex(D.mA, 1)}\,w+${tex(D.mB, 1)}\,(1-w)=${tex(D.m3, 1)}\qquad\iff\qquad w=\frac{${tex(D.m3, 1)}-${tex(D.mB, 1)}}{${tex(D.mA, 1)}-${tex(D.mB, 1)}}\approx ${tex(D.w3, 4)}\]
  ${T_(['et sa volatilité vaut', 'and its volatility is'])} \(\sqrt{\sigma_p^2(${tex(D.w3, 4)})}\approx ${tex(D.s3, 2)}\,\%\). ${D.eff ? T_(['Son rendement est supérieur à celui du portefeuille de variance minimale', 'Its return exceeds that of the minimum-variance portfolio']) + ' (\\(' + tex(D.mS, 2) + '\\,\\%\\)) : ' + T_(['il est sur la branche haute de la frontière, donc efficient. Pour obtenir davantage de rendement, il faudrait accepter plus de risque.', 'it lies on the upper branch of the frontier, so it is efficient. More return would require more risk.']) : T_(['Son rendement est inférieur à celui du portefeuille de variance minimale', 'Its return is below that of the minimum-variance portfolio']) + ' (\\(' + tex(D.mS, 2) + '\\,\\%\\)) : ' + T_(['il n\'est pas efficient. Le portefeuille symétrique par rapport au sommet', 'it is not efficient. The portfolio symmetric with respect to the vertex']) + ', \\(w=2w^*-w\\approx ' + tex(D.w3b, 4) + '\\), ' + T_(['a la même variance', 'has the same variance']) + ' (\\(\\sigma_p^2\\) ' + T_(['est symétrique autour de', 'is symmetric around']) + ' \\(w^*\\)) ' + T_(['et un rendement plus élevé', 'and a higher return']) + ', \\(' + tex(D.m3b, 2) + '\\,\\%\\).'}</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Le problème s\'écrit :', 'The problem reads:'])}
  \[\begin{aligned}\min_x\ &amp;\ x^T\Sigma x\\\text{${T_(['sous', 's.t.'])} }&amp;\ ${mu.map((v, i) => tex(v, 2) + '\\,x_' + (i + 1)).join('+')}=${tex(D.m4, 2)}\qquad x_1+x_2+x_3=1\qquad x\ge 0\end{aligned}\]
  ${T_(['Sans contrainte de signe, on minimise', 'Without sign constraint, we minimise'])} \(\frac12x^T\Sigma x\) ${T_(['avec les multiplicateurs', 'with the multipliers'])} \(\lambda_1\) ${T_(['et', 'and'])} \(\lambda_2\). ${T_(['Le gradient du lagrangien s\'annule :', 'The gradient of the Lagrangian vanishes:'])}
  \[\Sigma x=\lambda_1\,\mu+\lambda_2\,e,\qquad\mu^Tx=${tex(D.m4, 2)}\qquad e^Tx=1\]</p>
  <p><strong>b.</strong> ${T_(['On calcule les deux membres de la première condition, ligne par ligne :', 'We compute both sides of the first condition, row by row:'])}
  \[\Sigma x\approx\begin{pmatrix}${lhs.map(v => tex(v, 5)).join('\\\\')}\end{pmatrix},\qquad\lambda_1\mu+\lambda_2e\approx\begin{pmatrix}${rhs.map(v => tex(v, 5)).join('\\\\')}\end{pmatrix}\]
  ${T_(['Ils coïncident aux arrondis près. Les deux contraintes sont satisfaites :', 'They coincide up to rounding. Both constraints hold:'])}
  \[\begin{aligned}\mu^Tx&amp;=${mu.map((v, i) => tex(v, 2) + '\\times ' + tex(P.x[i], 4)).join('+')}\approx ${tex(d20dot(mu, P.x), 4)}\\e^Tx&amp;=${P.x.map(v => tex(v, 4)).join('+')}=${tex(sum(P.x), 4)}\end{aligned}\]
  ${T_(['Comme', 'Since'])} \(\Sigma x=\lambda_1\mu+\lambda_2e\), ${T_(['la variance se calcule sans nouveau produit matriciel :', 'the variance is obtained without another matrix product:'])}
  \[x^T\Sigma x=\lambda_1\,\mu^Tx+\lambda_2\,e^Tx=${tex(P.l1, 4)}\times ${tex(D.m4, 2)}+${P.l2 < 0 ? '(' + tex(P.l2, 4) + ')' : tex(P.l2, 4)}\approx ${tex(P.v, 5)}\qquad\text{${T_(['et', 'and'])}}\qquad\sigma_p\approx ${tex(100 * Math.sqrt(P.v), 2)}\,\%\]</p>
  <p><strong>c.</strong> ${T_(['Les trois poids sont positifs. Le problème avec', 'All three weights are positive. The problem with'])} \(x\ge 0\) ${T_(['a un ensemble réalisable plus petit que le problème sans contrainte de signe, et ce portefeuille en fait partie ; comme il minimise la variance sur le plus grand ensemble, il la minimise a fortiori sur le plus petit. Il est donc aussi solution du problème avec', 'has a smaller feasible set than the problem without sign constraint, and this portfolio belongs to it; since it minimises the variance over the larger set, it a fortiori minimises it over the smaller one. It is therefore also a solution of the problem with'])} \(x\ge 0\).</p>
  <p class="check">${T_(['Vérification', 'Check'])} : ${T_(['le rendement visé est supérieur à celui du portefeuille de variance minimale', 'the target return exceeds that of the minimum-variance portfolio'])}, \(B/A\approx ${tex(D.F.mMin, 4)}\) : ${T_(['le portefeuille est sur la branche efficiente.', 'the portfolio is on the efficient branch.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d20sol(D, 'fr');
I18N.en.sol = D => d20sol(D, 'en');
