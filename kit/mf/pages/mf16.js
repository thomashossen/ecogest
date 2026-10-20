/* ============================================================
   PAGE mf16 — Dédication (adossement des flux) et taux implicites
   ============================================================ */
const K16 = {
  fr: { 'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 16 – Dédication et taux implicites', 'k-h1': 'Dédication et taux implicites', 'k-coursetitle': 'Adosser des obligations à un passif, puis lire la courbe des taux dans les prix duaux', 'k-extitle': 'Portefeuille dédié, prix duaux et coûts réduits', 'k-soltitle': 'Portefeuille dédié, prix duaux et coûts réduits' },
  en: { 'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 16 – Dedication and implied rates', 'k-h1': 'Dedication and implied rates', 'k-coursetitle': 'Matching bonds to a liability stream, then reading the yield curve in the shadow prices', 'k-extitle': 'Dedicated portfolio, shadow prices and reduced costs', 'k-soltitle': 'Dedicated portfolio, shadow prices and reduced costs' }
};
I18N.fr.k = Object.assign({
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié'
}, K16.fr);
I18N.en.k = Object.assign({
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied'
}, K16.en);

/* ---------- calculs communs ---------- */
/* flux de l'obligation i (coupon C, échéance M, nominal 100) l'année t */
function d16cf(C, M, t) { return t > M ? 0 : C + (t === M ? 100 : 0); }
/* portefeuille dédié sans excédent : une obligation par échéance 1..T, résolution à rebours */
function d16back(C, L) {
  const T = L.length, x = new Array(T).fill(0);
  for (let t = T - 1; t >= 0; t--) {
    let cov = 0; for (let i = t + 1; i < T; i++) cov += C[i] * x[i];
    x[t] = (L[t] - cov) / (100 + C[t]);
  }
  return x;
}
/* prix duaux : P_i = somme des flux actualisés par lambda, système triangulaire */
function d16dual(C, P) {
  const lam = [];
  for (let t = 0; t < C.length; t++) { const s = lam.reduce((a, b) => a + b, 0); lam.push((P[t] - C[t] * s) / (100 + C[t])); }
  return lam;
}
function d16rates(lam) {
  const r = lam.map((l, t) => Math.pow(l, -1 / (t + 1)) - 1);
  const f = lam.map((l, t) => (t === 0 ? 1 : lam[t - 1]) / l - 1);
  return { r: r, f: f };
}
const D16_EX = { L: [12000, 18000, 20000, 15000], C: [5, 3, 4, 6], P: [102.94, 100.98, 102.90, 109.81], DF: [1 / 1.02, 1 / Math.pow(1.025, 2), 1 / Math.pow(1.03, 3), 1 / Math.pow(1.034, 4)] };

/* ---------- bloc de code ---------- */
function d16code(lang, lines) {
  const esc2 = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<div class="code-wrap"><div class="code-head"><span>Python</span><button type="button" onclick="copyCode(this)">' + (lang === 'fr' ? 'Copier' : 'Copy') + '</button></div><div class="code-block">' +
    lines.map(l => '<div class="cl"><code>' + (l === '' ? '&nbsp;' : esc2(l)) + '</code></div>').join('') + '</div></div>';
}
const D16_PY = c => [
  'import numpy as np',
  'from scipy.optimize import linprog',
  '',
  'L = [12000, 18000, 20000, 15000]          # ' + c[0],
  'P = [102.94, 100.98, 102.90, 109.81]      # ' + c[1],
  'C = [5, 3, 4, 6]                          # ' + c[2],
  'M = [1, 2, 3, 4]                          # ' + c[3],
  'rho, T, N = 0.01, 4, 4',
  '',
  '# ' + c[4],
  'c = np.r_[P, 1, np.zeros(T)]',
  'A = np.zeros((T, N + T + 1))',
  'for t in range(1, T + 1):',
  '    for i in range(N):',
  '        if M[i] >= t:',
  '            A[t - 1, i] = C[i] + (100 if M[i] == t else 0)',
  '    A[t - 1, N + t] = -1                  # ' + c[5],
  '    A[t - 1, N + t - 1] = 1 + rho         # ' + c[6],
  '',
  'res = linprog(c, A_eq=A, b_eq=L, method="highs")',
  'print(res.x[:N], res.fun)                 # ' + c[7],
  'print(res.eqlin.marginals)                # ' + c[8]
];

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez construire le portefeuille d'obligations le moins cher qui paie exactement un passif connu, écrire et résoudre le programme linéaire correspondant, puis lire dans ses prix duaux la valeur d'un euro à chaque date, c'est-à-dire une courbe des taux implicite.<br><br>
<strong>Pourquoi en finance ?</strong> Une collectivité qui rembourse une dette, un assureur qui doit verser des sinistres déjà connus, un fonds de pension qui paie des rentes : tous ont un calendrier de paiements certains et veulent le financer aujourd'hui, une fois pour toutes, avec des titres sans risque de défaut.<br><br>
<strong>Prérequis.</strong> Programmation linéaire et prix duaux (page 15), actualisation (page 3).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le principe</a> · <a href="#s2">2. Le programme linéaire</a> · <a href="#s3">3. Résolution à rebours</a> · <a href="#s4">4. Prix duaux et taux implicites</a> · <a href="#s5">5. Garder un excédent ?</a> · <a href="#s6">6. Une obligation de plus</a> · <a href="#s7">7. En Python</a> · <a href="#s8">8. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le principe de la dédication</div>
<p>On doit payer un montant \(L_t\) à la fin de chaque année \(t=1,\ldots,T\). On dispose d'obligations sans risque de défaut : l'obligation \(i\) coûte \(P_i\) aujourd'hui, verse un coupon \(C_i\) chaque année jusqu'à son échéance \(M_i\) et rembourse son nominal, 100, à l'échéance. La <em>dédication</em>, ou adossement des flux, consiste à acheter aujourd'hui un portefeuille dont les flux couvrent chaque paiement à sa date. Le tableau suivant la compare à l'immunisation, qui ne fait coïncider que la valeur actuelle et la sensibilité aux taux.</p>
<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>Dédication</th><th>Immunisation</th></tr></thead><tbody>
<tr><td>Principe</td><td>chaque paiement est couvert par des flux connus</td><td>actif et passif ont la même valeur et la même duration</td></tr>
<tr><td>Garantie</td><td>certaine, quelle que soit l'évolution des taux</td><td>pour de petits déplacements parallèles de la courbe</td></tr>
<tr><td>Risque de réinvestissement</td><td>éliminé</td><td>présent, compensé en moyenne</td></tr>
<tr><td>Souplesse et coût</td><td>rigide, souvent plus chère</td><td>souple, généralement moins chère</td></tr>
<tr><td>Usage</td><td>horizons courts ou moyens</td><td>horizons longs</td></tr>
</tbody></table></div>

<div class="dossier-title" id="s2">2. Le programme linéaire</div>
<p>On note \(x_i\ge 0\) le nombre d'obligations \(i\) achetées. On autorise aussi à conserver un excédent : \(z_0\) est la trésorerie mise de côté aujourd'hui, \(z_t\) l'excédent conservé à la fin de l'année \(t\), réinvesti au taux sans risque \(\rho\) pendant un an. L'obligation \(i\) verse l'année \(t\) le flux :
\[c_{i,t}=\begin{cases}C_i&amp;\text{si } t&lt;M_i\\C_i+100&amp;\text{si } t=M_i\\0&amp;\text{si } t&gt;M_i\end{cases}\]
À l'échéance, l'obligation verse son dernier coupon en même temps que son nominal. On minimise le coût d'aujourd'hui, sous la condition que, chaque année, les flux reçus plus l'excédent réinvesti de l'année précédente paient le passif, le reste étant mis de côté :
\[\begin{aligned}\min\ &amp;\ z_0+\sum_{i=1}^{N}P_i\,x_i\\\text{sous }&amp;\ \sum_{i=1}^{N}c_{i,t}\,x_i+(1+\rho)\,z_{t-1}-z_t=L_t,\qquad t=1,\ldots,T\\&amp;\ x_i\ge 0,\quad z_t\ge 0\end{aligned}\]
Chaque contrainte est un bilan de trésorerie de l'année \(t\) : ce qui entre (coupons, nominaux, excédent réinvesti) est égal à ce qui sort (paiement \(L_t\), nouvel excédent \(z_t\)).</p>

<div class="dossier-title" id="s3">3. Résolution à rebours</div>
<p>Supposons qu'il existe exactement une obligation par échéance, numérotée comme son échéance (\(M_i=i\)), et cherchons un portefeuille sans excédent : \(z_t=0\) pour tout \(t\). La contrainte de la dernière année ne fait intervenir que l'obligation \(T\), la seule encore vivante :
\[(100+C_T)\,x_T=L_T\qquad\text{d'où}\qquad x_T=\frac{L_T}{100+C_T}\]
On remonte ensuite d'une année à la fois : l'année \(t\), les obligations plus longues, déjà choisies, versent leurs coupons, et l'obligation \(t\) couvre le reste :
\[x_t=\frac{1}{100+C_t}\Big(L_t-\sum_{i&gt;t}C_i\,x_i\Big)\]
Si toutes les quantités obtenues sont positives, ce portefeuille paie exactement le passif. La section 5 montre à quelle condition il est aussi le moins cher.</p>
<div class="ifig" data-fig="cf"></div>
<div class="fig-cap">Figure 1 — Les flux du portefeuille dédié, année par année, empilés par obligation, et le passif à payer (trait noir). Les deux coïncident exactement. Modifiez le passif de l'année 4 ou le coupon de l'obligation 4 : la quantité \(x_4\) s'ajuste, ses coupons couvrent une part plus ou moins grande des années 1 à 3, et les quantités plus courtes s'ajustent à leur tour.</div>

<div class="dossier-title" id="s4">4. Prix duaux et taux implicites</div>
<p>Le prix dual \(\lambda_t\) de la contrainte de l'année \(t\) mesure l'augmentation du coût optimal quand \(L_t\) augmente d'un euro : c'est le coût, aujourd'hui, d'un euro à payer l'année \(t\). On le calcule sans solveur. Pour toute obligation achetée en quantité strictement positive, la théorie de la dualité impose un coût réduit nul : son prix est égal à la valeur de ses flux évalués avec les \(\lambda_t\).
\[P_i=\sum_{t=1}^{M_i}c_{i,t}\,\lambda_t\qquad\text{pour tout } i \text{ tel que } x_i&gt;0\]
Avec une obligation par échéance, ce système est triangulaire et se résout en avançant dans le temps :
\[\lambda_1=\frac{P_1}{100+C_1},\qquad\lambda_t=\frac{1}{100+C_t}\Big(P_t-C_t\sum_{s&lt;t}\lambda_s\Big)\]
C'est exactement la méthode du <em>bootstrapping</em> qui construit une courbe zéro-coupon à partir de prix d'obligations. Un euro payé dans \(t\) ans coûtant \(\lambda_t\) aujourd'hui, le taux implicite \(r_t\) et le taux forward implicite \(f_t\) entre \(t-1\) et \(t\) vérifient :
\[\lambda_t=\frac{1}{(1+r_t)^t}\qquad\text{et}\qquad 1+f_t=\frac{\lambda_{t-1}}{\lambda_t}\quad(\lambda_0:=1)\]
Enfin, par dualité forte, le coût du portefeuille est égal à la valeur du passif évalué avec ces prix :
\[\sum_{i=1}^{N}P_i\,x_i=\sum_{t=1}^{T}\lambda_t\,L_t\]
C'est une vérification commode des calculs.</p>
<div class="ifig" data-fig="curve"></div>
<div class="fig-cap">Figure 2 — Taux implicites \(r_t\) (en bleu) et taux forward implicites \(f_t\) (en doré) lus dans les prix duaux du portefeuille de la figure 1, comparés au taux de réinvestissement \(\rho\) (en rouge). Déplacez le prix de l'obligation 3 : seuls \(\lambda_3\) et \(\lambda_4\) changent, et un forward peut passer sous \(\rho\). Dans ce cas, garder un excédent devient rentable (section 5).</div>

<div class="dossier-title" id="s5">5. Garder un excédent est-il utile ?</div>
<p>Le portefeuille sans excédent est optimal si aucune variable hors base n'a un coût réduit négatif. Le coût réduit d'une variable est son coût dans l'objectif moins la valeur, aux prix \(\lambda_t\), de ce qu'elle consomme dans les contraintes. Pour l'excédent \(z_{t-1}\), qui retire un euro l'année \(t-1\) et en rend \(1+\rho\) l'année \(t\), et pour la trésorerie initiale \(z_0\), de coût 1 :
\[\begin{aligned}\bar c(z_0)&amp;=1-(1+\rho)\,\lambda_1\\\bar c(z_{t-1})&amp;=\lambda_{t-1}-(1+\rho)\,\lambda_t,\qquad t=2,\ldots,T\end{aligned}\]
Ces coûts réduits sont positifs ou nuls si et seulement si \(f_t\ge\rho\) pour tout \(t\) : tant que les obligations rapportent, d'une année sur l'autre, au moins autant que le placement de trésorerie, il est inutile de garder un excédent. Avec des quantités \(x_t\) positives, le portefeuille obtenu à rebours est alors optimal, puisqu'il est réalisable et que tous les coûts réduits sont positifs ou nuls.</p>

<div class="dossier-title" id="s6">6. Une obligation de plus</div>
<p>Une nouvelle obligation, de prix \(P\) et de flux \(c_t\), mérite d'entrer dans le portefeuille si son coût réduit est négatif :
\[\bar c=P-\sum_t c_t\,\lambda_t&lt;0\]
Elle coûte alors moins cher que le portefeuille des obligations existantes qui reproduit ses flux, et on abaisse le coût total en la substituant à ce portefeuille. Si \(\bar c&gt;0\), elle est trop chère et ne sera pas achetée. Les prix duaux servent ainsi d'étalon pour repérer, dans une liste d'obligations, celles qui sont bon marché.</p>

<div class="dossier-title" id="s7">7. En Python</div>
<p>Le programme de la section 2, pour l'exemple des figures, avec la fonction <code>linprog</code> de SciPy. Les prix duaux sont dans <code>res.eqlin.marginals</code>.</p>
${d16code('fr', D16_PY(['passif, années 1 à 4', 'prix des obligations', 'coupons pour 100 de nominal', 'échéances', 'variables : x_1..x_N, puis z_0..z_T', 'z_t : excédent conservé', 'z_{t-1} réinvesti à rho', 'portefeuille et coût', 'prix duaux lambda_t']))}

<div class="dossier-title" id="s8">8. À retenir</div>
<ul class="kit-simple">
<li>La dédication achète aujourd'hui les flux qui paieront chaque échéance du passif ; le programme linéaire écrit un bilan de trésorerie par année.</li>
<li>Avec une obligation par échéance, on résout à rebours : l'obligation la plus longue d'abord, ses coupons réduisant les besoins des années précédentes.</li>
<li>Les prix duaux sont les prix d'un euro à chaque date. On les obtient en avançant dans le temps (bootstrapping) ; ils donnent les taux implicites et la vérification \(\sum P_ix_i=\sum\lambda_tL_t\).</li>
<li>Garder un excédent est inutile tant que les forwards implicites dépassent le taux de réinvestissement ; une obligation de coût réduit négatif doit entrer dans le portefeuille.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can build the cheapest bond portfolio that pays a known liability stream exactly, write and solve the corresponding linear programme, and read in its shadow prices the value of one euro at each date, that is, an implied yield curve.<br><br>
<strong>Why in finance?</strong> A municipality repaying a debt, an insurer paying claims already known, a pension fund paying annuities: all of them face a schedule of certain payments and want to fund it today, once and for all, with default-free securities.<br><br>
<strong>Prerequisites.</strong> Linear programming and shadow prices (page 15), discounting (page 3).
</div>
<p class="toc">Contents: <a href="#s1">1. The principle</a> · <a href="#s2">2. The linear programme</a> · <a href="#s3">3. Backward solution</a> · <a href="#s4">4. Shadow prices and implied rates</a> · <a href="#s5">5. Keeping a surplus?</a> · <a href="#s6">6. One more bond</a> · <a href="#s7">7. In Python</a> · <a href="#s8">8. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The principle of dedication</div>
<p>An amount \(L_t\) must be paid at the end of each year \(t=1,\ldots,T\). Default-free bonds are available: bond \(i\) costs \(P_i\) today, pays a coupon \(C_i\) every year until its maturity \(M_i\) and repays its face value, 100, at maturity. <em>Dedication</em>, or cash-flow matching, buys today a portfolio whose cash flows cover each payment on its date. The table below compares it with immunisation, which only matches present value and interest-rate sensitivity.</p>
<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>Dedication</th><th>Immunisation</th></tr></thead><tbody>
<tr><td>Principle</td><td>each payment is covered by known cash flows</td><td>assets and liabilities have the same value and duration</td></tr>
<tr><td>Guarantee</td><td>certain, whatever happens to rates</td><td>for small parallel shifts of the curve</td></tr>
<tr><td>Reinvestment risk</td><td>eliminated</td><td>present, offset on average</td></tr>
<tr><td>Flexibility and cost</td><td>rigid, often more expensive</td><td>flexible, usually cheaper</td></tr>
<tr><td>Use</td><td>short or medium horizons</td><td>long horizons</td></tr>
</tbody></table></div>

<div class="dossier-title" id="s2">2. The linear programme</div>
<p>Let \(x_i\ge 0\) be the number of bonds \(i\) bought. A surplus may also be kept: \(z_0\) is cash set aside today, \(z_t\) the surplus kept at the end of year \(t\), reinvested at the risk-free rate \(\rho\) for one year. In year \(t\), bond \(i\) pays the cash flow:
\[c_{i,t}=\begin{cases}C_i&amp;\text{if } t&lt;M_i\\C_i+100&amp;\text{if } t=M_i\\0&amp;\text{if } t&gt;M_i\end{cases}\]
At maturity, the bond pays its last coupon together with its face value. We minimise today's cost, subject to the condition that, every year, the cash received plus last year's reinvested surplus pays the liability, the rest being set aside:
\[\begin{aligned}\min\ &amp;\ z_0+\sum_{i=1}^{N}P_i\,x_i\\\text{s.t. }&amp;\ \sum_{i=1}^{N}c_{i,t}\,x_i+(1+\rho)\,z_{t-1}-z_t=L_t,\qquad t=1,\ldots,T\\&amp;\ x_i\ge 0,\quad z_t\ge 0\end{aligned}\]
Each constraint is a cash balance for year \(t\): what comes in (coupons, face values, reinvested surplus) equals what goes out (payment \(L_t\), new surplus \(z_t\)).</p>

<div class="dossier-title" id="s3">3. Backward solution</div>
<p>Suppose there is exactly one bond per maturity, numbered like its maturity (\(M_i=i\)), and look for a portfolio without surplus: \(z_t=0\) for every \(t\). The last year's constraint only involves bond \(T\), the only one still alive:
\[(100+C_T)\,x_T=L_T\qquad\text{hence}\qquad x_T=\frac{L_T}{100+C_T}\]
We then move back one year at a time: in year \(t\), the longer bonds, already chosen, pay their coupons, and bond \(t\) covers the rest:
\[x_t=\frac{1}{100+C_t}\Big(L_t-\sum_{i&gt;t}C_i\,x_i\Big)\]
If all the quantities obtained are positive, this portfolio pays the liability exactly. Section 5 shows when it is also the cheapest.</p>
<div class="ifig" data-fig="cf"></div>
<div class="fig-cap">Figure 1 — The cash flows of the dedicated portfolio, year by year, stacked by bond, and the liability to be paid (black mark). The two match exactly. Change the year-4 liability or the coupon of bond 4: the quantity \(x_4\) adjusts, its coupons cover a larger or smaller share of years 1 to 3, and the shorter quantities adjust in turn.</div>

<div class="dossier-title" id="s4">4. Shadow prices and implied rates</div>
<p>The shadow price \(\lambda_t\) of the year-\(t\) constraint measures the increase in the optimal cost when \(L_t\) rises by one euro: it is the cost, today, of one euro to be paid in year \(t\). It can be computed without a solver. For every bond bought in a strictly positive quantity, duality theory requires a zero reduced cost: its price equals the value of its cash flows priced with the \(\lambda_t\).
\[P_i=\sum_{t=1}^{M_i}c_{i,t}\,\lambda_t\qquad\text{for every } i \text{ such that } x_i&gt;0\]
With one bond per maturity, this system is triangular and is solved moving forward in time:
\[\lambda_1=\frac{P_1}{100+C_1},\qquad\lambda_t=\frac{1}{100+C_t}\Big(P_t-C_t\sum_{s&lt;t}\lambda_s\Big)\]
This is exactly the <em>bootstrapping</em> method that builds a zero-coupon curve from bond prices. Since one euro paid in \(t\) years costs \(\lambda_t\) today, the implied rate \(r_t\) and the implied forward rate \(f_t\) between \(t-1\) and \(t\) satisfy:
\[\lambda_t=\frac{1}{(1+r_t)^t}\qquad\text{and}\qquad 1+f_t=\frac{\lambda_{t-1}}{\lambda_t}\quad(\lambda_0:=1)\]
Finally, by strong duality, the cost of the portfolio equals the value of the liability priced with these prices:
\[\sum_{i=1}^{N}P_i\,x_i=\sum_{t=1}^{T}\lambda_t\,L_t\]
This is a handy check of the computations.</p>
<div class="ifig" data-fig="curve"></div>
<div class="fig-cap">Figure 2 — Implied rates \(r_t\) (blue) and implied forward rates \(f_t\) (gold) read in the shadow prices of the portfolio of figure 1, compared with the reinvestment rate \(\rho\) (red). Move the price of bond 3: only \(\lambda_3\) and \(\lambda_4\) change, and a forward rate may fall below \(\rho\). In that case, keeping a surplus becomes worthwhile (section 5).</div>

<div class="dossier-title" id="s5">5. Is keeping a surplus worthwhile?</div>
<p>The portfolio without surplus is optimal if no non-basic variable has a negative reduced cost. The reduced cost of a variable is its cost in the objective minus the value, at prices \(\lambda_t\), of what it uses in the constraints. For the surplus \(z_{t-1}\), which takes one euro in year \(t-1\) and gives back \(1+\rho\) in year \(t\), and for the initial cash \(z_0\), whose cost is 1:
\[\begin{aligned}\bar c(z_0)&amp;=1-(1+\rho)\,\lambda_1\\\bar c(z_{t-1})&amp;=\lambda_{t-1}-(1+\rho)\,\lambda_t,\qquad t=2,\ldots,T\end{aligned}\]
These reduced costs are non-negative if and only if \(f_t\ge\rho\) for every \(t\): as long as bonds earn, from one year to the next, at least as much as the cash investment, keeping a surplus is pointless. With positive quantities \(x_t\), the portfolio obtained backwards is then optimal, since it is feasible and all reduced costs are non-negative.</p>

<div class="dossier-title" id="s6">6. One more bond</div>
<p>A new bond, with price \(P\) and cash flows \(c_t\), deserves to enter the portfolio if its reduced cost is negative:
\[\bar c=P-\sum_t c_t\,\lambda_t&lt;0\]
It is then cheaper than the portfolio of existing bonds that replicates its cash flows, and the total cost falls when it replaces that portfolio. If \(\bar c&gt;0\), it is too expensive and will not be bought. Shadow prices thus serve as a yardstick to spot cheap bonds in a list.</p>

<div class="dossier-title" id="s7">7. In Python</div>
<p>The programme of section 2, for the example of the figures, with SciPy's <code>linprog</code>. The shadow prices are in <code>res.eqlin.marginals</code>.</p>
${d16code('en', D16_PY(['liability, years 1 to 4', 'bond prices', 'coupons per 100 of face value', 'maturities', 'variables: x_1..x_N, then z_0..z_T', 'z_t: surplus kept', 'z_{t-1} reinvested at rho', 'portfolio and cost', 'shadow prices lambda_t']))}

<div class="dossier-title" id="s8">8. Key points</div>
<ul class="kit-simple">
<li>Dedication buys today the cash flows that will pay each liability date; the linear programme writes one cash balance per year.</li>
<li>With one bond per maturity, solve backwards: the longest bond first, its coupons reducing the needs of earlier years.</li>
<li>Shadow prices are the prices of one euro at each date. They are obtained moving forward (bootstrapping); they give the implied rates and the check \(\sum P_ix_i=\sum\lambda_tL_t\).</li>
<li>Keeping a surplus is pointless as long as the implied forwards exceed the reinvestment rate; a bond with a negative reduced cost should enter the portfolio.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  L4: 'Passif année 4', C4: 'Coupon obligation 4', year: 'année', amt: 'flux (€)', liab: 'passif', bond: 'obligation', cfAria: 'Flux du portefeuille dédié empilés par obligation et passif à payer',
  cfRead: (x, cost) => `Portefeuille : ${x.map((v, i) => `<i>x</i><sub>${i + 1}</sub> = <span class="v">${fmt(v, 2)}</span>`).join(' &nbsp;·&nbsp; ')}<br>Coût aujourd'hui : <span class="v">${fmt(cost, 2)} €</span>`,
  dP3: 'Écart sur le prix de l\'obligation 3', rho: 'Taux de réinvestissement ρ', rt: 'taux implicite r<tspan baseline-shift="sub" font-size="8">t</tspan>', ft: 'forward implicite f<tspan baseline-shift="sub" font-size="8">t</tspan>', rl: 'ρ', curveAria: 'Taux implicites et forwards implicites comparés au taux de réinvestissement',
  curveRead: (lam, bad) => `Prix duaux : ${lam.map((v, i) => `λ<sub>${i + 1}</sub> = <span class="v">${fmt(v, 4)}</span>`).join(' &nbsp;·&nbsp; ')}<br>` + (bad.length ? `Forward sous ρ pour ${bad.map(t => t === 1 ? 'aujourd\'hui → année 1' : `l'année ${t - 1} → ${t}`).join(', ')} : garder un excédent devient rentable.` : 'Tous les forwards dépassent ρ : aucun excédent n\'est utile, le portefeuille dédié est optimal.')
};
I18N.en.f = {
  L4: 'Year-4 liability', C4: 'Coupon of bond 4', year: 'year', amt: 'cash flow (€)', liab: 'liability', bond: 'bond', cfAria: 'Cash flows of the dedicated portfolio stacked by bond and liability to be paid',
  cfRead: (x, cost) => `Portfolio: ${x.map((v, i) => `<i>x</i><sub>${i + 1}</sub> = <span class="v">${fmt(v, 2)}</span>`).join(' &nbsp;·&nbsp; ')}<br>Cost today: <span class="v">€${fmt(cost, 2)}</span>`,
  dP3: 'Shift in the price of bond 3', rho: 'Reinvestment rate ρ', rt: 'implied rate r<tspan baseline-shift="sub" font-size="8">t</tspan>', ft: 'implied forward f<tspan baseline-shift="sub" font-size="8">t</tspan>', rl: 'ρ', curveAria: 'Implied rates and implied forwards compared with the reinvestment rate',
  curveRead: (lam, bad) => `Shadow prices: ${lam.map((v, i) => `λ<sub>${i + 1}</sub> = <span class="v">${fmt(v, 4)}</span>`).join(' &nbsp;·&nbsp; ')}<br>` + (bad.length ? `Forward below ρ for ${bad.map(t => t === 1 ? 'today → year 1' : `year ${t - 1} → ${t}`).join(', ')}: keeping a surplus becomes worthwhile.` : 'Every forward exceeds ρ: no surplus is useful, the dedicated portfolio is optimal.')
};
FIGS.cf = {
  state: { L4: 15000, C4: 6 },
  controls: L => [
    { key: 'L4', label: L.f.L4, min: 5000, max: 30000, step: 1000, fmt: v => fmt(v, 0) + ' €' },
    { key: 'C4', label: L.f.C4, min: 0, max: 10, step: 1, fmt: v => String(v) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, Ls = D16_EX.L.slice(0, 3).concat([s.L4]), C = D16_EX.C.slice(0, 3).concat([s.C4]);
    const x = d16back(C, Ls), DF = D16_EX.DF;
    const P = D16_EX.P.slice(0, 3).concat([Math.round((s.C4 * (DF[0] + DF[1] + DF[2] + DF[3]) + 100 * DF[3]) * 100) / 100]);
    const cost = x.reduce((a, v, i) => a + v * P[i], 0);
    const ymax = Math.max(32000, s.L4 + 2000);
    const G = Plot({ w: 680, h: 330, x0: 0.4, x1: 4.6, y0: 0, y1: ymax, mt: 30, mb: 42, ml: 62 });
    G.axes({ xt: [1, 2, 3, 4], yt: ticks(0, ymax, 5), xl: L.year, xf: v => String(v), yf: v => fmt(v, 0) });
    const cols = [COL.s1, COL.s2, COL.s3, COL.s4];
    for (let t = 1; t <= 4; t++) {
      let base = 0;
      for (let i = 0; i < 4; i++) {
        const v = d16cf(C[i], i + 1, t) * x[i];
        if (v > 0.5) { G.bar(t, 54, base + v, { base: base, c: cols[i], o: 0.85, tip: L.bond + ' ' + (i + 1) + ' : ' + fmt(v, 0) }); base += v; }
      }
      G.seg(t - 0.34, Ls[t - 1], t + 0.34, Ls[t - 1], { c: COL.ink, w: 2.4 });
    }
    G.legend([1, 2, 3, 4].map(i => ({ c: cols[i - 1], box: true, t: L.bond + ' ' + i })).concat([{ c: COL.ink, t: L.liab }]), G.ml + 8, 16);
    return { svg: G.svg(L.cfAria), read: L.cfRead(x, cost) };
  }
};
FIGS.curve = {
  state: { dP3: 0, rho: 1 },
  controls: L => [
    { key: 'dP3', label: L.f.dP3, min: -4, max: 4, step: 0.5, fmt: v => (v > 0 ? '+' : '') + fmtT(v, 1) },
    { key: 'rho', label: L.f.rho, min: 0, max: 6, step: 0.25, fmt: v => fmtT(v, 2) + ' %' }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, P = D16_EX.P.slice(); P[2] += s.dP3;
    const lam = d16dual(D16_EX.C, P), R = d16rates(lam), rho = s.rho / 100;
    const vals = R.r.concat(R.f).concat([rho]).map(v => 100 * v), lo = Math.min(0, Math.floor(Math.min(...vals))), hi = Math.ceil(Math.max(...vals) + 0.5);
    const G = Plot({ w: 680, h: 320, x0: 0.6, x1: 4.4, y0: lo, y1: hi, mt: 30, mb: 42 });
    G.axes({ xt: [1, 2, 3, 4], yt: ticks(lo, hi, 5), xl: L.year, xf: v => String(v), yf: v => fmtT(v, 1) + ' %' });
    G.seg(0.6, 100 * rho, 4.4, 100 * rho, { c: COL.s3, w: 1.8, dash: '6 4' });
    G.line(R.r.map((v, i) => [i + 1, 100 * v]), { c: COL.s1, w: 2.2 });
    R.r.forEach((v, i) => G.dot(i + 1, 100 * v, { c: COL.s1 }));
    G.line(R.f.map((v, i) => [i + 1, 100 * v]), { c: COL.s2, w: 2, dash: '6 4' });
    R.f.forEach((v, i) => G.dot(i + 1, 100 * v, { c: v < rho ? COL.s3 : COL.s2, r: 5 }));
    G.legend([{ c: COL.s1, t: L.rt }, { c: COL.s2, dash: '6 4', t: L.ft }, { c: COL.s3, dash: '6 4', t: L.rl }], G.ml + 8, 16);
    const bad = R.f.map((v, i) => v < rho ? i + 1 : 0).filter(Boolean);
    return { svg: G.svg(L.curveAria), read: L.curveRead(lam, bad) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed, T: 4 };
  for (;;) {
    D.L = [0, 1, 2, 3].map(() => 1000 * rint(10, 30));
    D.C = [0, 1, 2, 3].map(() => rint(2, 7));
    const r1 = rint(15, 30) / 1000, st = [0, rint(3, 8), rint(3, 8), rint(2, 7)];
    D.rTrue = []; let r = r1; for (let t = 0; t < 4; t++) { r += st[t] / 1000; D.rTrue.push(t === 0 ? r1 : r); }
    D.rTrue[0] = r1;
    const DF = D.rTrue.map((v, t) => Math.pow(1 + v, -(t + 1)));
    D.P = D.C.map((c, i) => { let v = 100 * DF[i]; for (let t = 0; t <= i; t++) v += c * DF[t]; return Math.round(v * 100) / 100; });
    D.rho = pick([0.005, 0.01]);
    D.x = d16back(D.C, D.L);
    if (D.x.some(v => v <= 1)) continue;
    D.lam = d16dual(D.C, D.P);
    const R = d16rates(D.lam); D.r = R.r; D.f = R.f;
    if (Math.min(...D.f) < D.rho + 0.003) continue;
    D.cost = D.x.reduce((a, v, i) => a + v * D.P[i], 0);
    D.lamL = D.lam.reduce((a, v, i) => a + v * D.L[i], 0);
    D.rcz = [1 - (1 + D.rho) * D.lam[0]].concat([1, 2, 3].map(t => D.lam[t - 1] - (1 + D.rho) * D.lam[t]));
    /* nouvelle obligation */
    D.m5 = pick([2, 3]);
    do { D.C5 = rint(1, 8); } while (D.C5 === D.C[D.m5 - 1]);
    D.theo5 = 0; for (let t = 1; t <= D.m5; t++) D.theo5 += d16cf(D.C5, D.m5, t) * D.lam[t - 1];
    D.cheap = rnd() < 0.5;
    D.P5 = Math.round((D.theo5 + (D.cheap ? -1 : 1) * rint(5, 12) / 10) * 100) / 100;
    D.rc5 = D.P5 - D.theo5;
    break;
  }
  return D;
};

function d16tables(D, lang) {
  const fr = lang === 'fr';
  const h1 = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Année' : 'Year'}</th>${[1, 2, 3, 4].map(t => `<th>${t}</th>`).join('')}</tr></thead><tbody><tr><td>${fr ? 'Passif \\(L_t\\) (€)' : 'Liability \\(L_t\\) (€)'}</td>${D.L.map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr></tbody></table></div>`;
  const h2 = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Obligation' : 'Bond'}</th><th>${fr ? 'Prix' : 'Price'}</th><th>Coupon</th><th>${fr ? 'Échéance' : 'Maturity'}</th></tr></thead><tbody>${D.P.map((p, i) => `<tr><td>${i + 1}</td><td class="num">${fmt(p, 2)}</td><td class="num">${D.C[i]}</td><td class="num">${i + 1}</td></tr>`).join('')}</tbody></table></div>`;
  return h1 + h2;
}
const d16x = v => tex(v, 4), d16e = v => tex(v, 2);

I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un fonds doit payer, à la fin de chacune des quatre prochaines années, les montants suivants. Il dispose de quatre obligations sans risque de défaut, de nominal 100, qui versent leur coupon chaque année jusqu'à l'échéance incluse. Les achats peuvent porter sur des quantités fractionnaires. L'excédent éventuel d'une année peut être placé pour un an au taux \(\rho=${fmtT(100 * D.rho, 2)}\) %.</div>
${d16tables(D, 'fr')}
<div class="questions"><ol>
<li><div class="q-text">Écrivez le programme linéaire qui détermine le portefeuille le moins cher couvrant le passif, en précisant les variables, l'objectif et la contrainte de chaque année.</div></li>
<li><div class="q-text">On cherche un portefeuille sans excédent. Déterminez les quantités \(x_4\), \(x_3\), \(x_2\) et \(x_1\) par une résolution à rebours, puis le coût du portefeuille.</div></li>
<li><div class="q-text">On admet que les quatre obligations sont achetées en quantités strictement positives à l'optimum.
  <ol><li>Justifiez que les prix duaux \(\lambda_t\) des contraintes vérifient \(P_i=\sum_t c_{i,t}\lambda_t\) pour chaque obligation, et calculez-les.</li>
  <li>Déduisez-en les taux implicites \(r_1,\ldots,r_4\).</li>
  <li>Vérifiez que \(\sum_t\lambda_tL_t\) est égal au coût trouvé à la question 2. Pourquoi ?</li></ol></div></li>
<li><div class="q-text">Calculez les coûts réduits des variables d'excédent \(z_0,\ldots,z_3\). Le portefeuille de la question 2 est-il optimal ?</div></li>
<li><div class="q-text">Une cinquième obligation, d'échéance ${D.m5} et de coupon ${D.C5}, est proposée au prix de ${fmt(D.P5, 2)}. Calculez son coût réduit. Faut-il l'acheter ?</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A fund must pay, at the end of each of the next four years, the following amounts. Four default-free bonds with face value 100 are available; they pay their coupon every year up to and including maturity. Fractional quantities may be bought. Any surplus in a year can be invested for one year at the rate \(\rho=${fmtT(100 * D.rho, 2)}\)%.</div>
${d16tables(D, 'en')}
<div class="questions"><ol>
<li><div class="q-text">Write the linear programme that determines the cheapest portfolio covering the liability, stating the variables, the objective and the constraint of each year.</div></li>
<li><div class="q-text">We look for a portfolio without surplus. Determine the quantities \(x_4\), \(x_3\), \(x_2\) and \(x_1\) by solving backwards, then the cost of the portfolio.</div></li>
<li><div class="q-text">Assume that all four bonds are bought in strictly positive quantities at the optimum.
  <ol><li>Explain why the shadow prices \(\lambda_t\) of the constraints satisfy \(P_i=\sum_t c_{i,t}\lambda_t\) for each bond, and compute them.</li>
  <li>Deduce the implied rates \(r_1,\ldots,r_4\).</li>
  <li>Check that \(\sum_t\lambda_tL_t\) equals the cost found in question 2. Why?</li></ol></div></li>
<li><div class="q-text">Compute the reduced costs of the surplus variables \(z_0,\ldots,z_3\). Is the portfolio of question 2 optimal?</div></li>
<li><div class="q-text">A fifth bond, with maturity ${D.m5} and coupon ${D.C5}, is offered at a price of ${fmt(D.P5, 2)}. Compute its reduced cost. Should it be bought?</div></li>
</ol></div>`;
};

function d16sol(D, lang) {
  const fr = lang === 'fr', C = D.C, L = D.L, x = D.x, lam = D.lam, rho = D.rho, P = D.P;
  const T_ = s => fr ? s[0] : s[1];
  const rowY = t => {
    const terms = [];
    for (let i = t; i <= 4; i++) terms.push(String.raw`${i === t ? (100 + C[i - 1]) : C[i - 1]}\,x_${i}`);
    return terms.join('+') + String.raw`+${tex(1 + rho, 3)}\,z_${t - 1}-z_${t}&amp;=${tex(L[t - 1], 0)}`;
  };
  const back = [];
  back.push(String.raw`x_4&amp;=\frac{L_4}{100+C_4}=\frac{${tex(L[3], 0)}}{${100 + C[3]}}\approx ${d16x(x[3])}`);
  for (let t = 3; t >= 1; t--) {
    const cov = []; let covV = 0;
    for (let i = t + 1; i <= 4; i++) { cov.push(`${C[i - 1]}\times ${d16x(x[i - 1])}`); covV += C[i - 1] * x[i - 1]; }
    back.push(String.raw`x_${t}&amp;=\frac{L_${t}-${[...Array(4 - t)].map((_, k) => 'C_' + (t + 1 + k) + 'x_' + (t + 1 + k)).join('-')}}{100+C_${t}}=\frac{${tex(L[t - 1], 0)}-${tex(covV, 2)}}{${100 + C[t - 1]}}\approx ${d16x(x[t - 1])}`);
  }
  const dualL = [];
  dualL.push(String.raw`\lambda_1&amp;=\frac{P_1}{100+C_1}=\frac{${d16e(P[0])}}{${100 + C[0]}}\approx ${tex(lam[0], 6)}`);
  for (let t = 2; t <= 4; t++) {
    let s = 0; for (let k = 0; k < t - 1; k++) s += lam[k];
    dualL.push(String.raw`\lambda_${t}&amp;=\frac{P_${t}-C_${t}(${[...Array(t - 1)].map((_, k) => '\\lambda_' + (k + 1)).join('+')})}{100+C_${t}}=\frac{${d16e(P[t - 1])}-${C[t - 1]}\times ${tex(s, 6)}}{${100 + C[t - 1]}}\approx ${tex(lam[t - 1], 6)}`);
  }
  const rates = D.r.map((v, t) => String.raw`r_${t + 1}&amp;=\lambda_${t + 1}^{-1/${t + 1}}-1=${tex(lam[t], 6)}^{-1/${t + 1}}-1\approx ${tex(100 * v, 3)}\,\%`);
  const rcz = [String.raw`\bar c(z_0)&amp;=1-(1+\rho)\,\lambda_1=1-${tex(1 + rho, 3)}\times ${tex(lam[0], 6)}\approx ${tex(D.rcz[0], 6)}`].concat([1, 2, 3].map(t => String.raw`\bar c(z_${t})&amp;=\lambda_${t}-(1+\rho)\,\lambda_${t + 1}=${tex(lam[t - 1], 6)}-${tex(1 + rho, 3)}\times ${tex(lam[t], 6)}\approx ${tex(D.rcz[t], 6)}`));
  const cf5 = []; for (let t = 1; t <= D.m5; t++) cf5.push(`${d16cf(D.C5, D.m5, t)}\\times ${tex(lam[t - 1], 6)}`);
  const costTerms = P.map((p, i) => `${d16e(p)}\\times ${d16x(x[i])}`).join('+');
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['On note \\(x_i\\ge 0\\) le nombre d\'obligations \\(i\\) achetées, \\(z_0\\ge 0\\) la trésorerie mise de côté aujourd\'hui et \\(z_t\\ge 0\\) l\'excédent conservé à la fin de l\'année \\(t\\). L\'obligation \\(i\\) verse \\(C_i\\) chaque année jusqu\'à l\'année \\(i\\) incluse, plus 100 l\'année \\(i\\). On minimise le coût d\'aujourd\'hui :', 'Let \\(x_i\\ge 0\\) be the number of bonds \\(i\\) bought, \\(z_0\\ge 0\\) the cash set aside today and \\(z_t\\ge 0\\) the surplus kept at the end of year \\(t\\). Bond \\(i\\) pays \\(C_i\\) every year up to and including year \\(i\\), plus 100 in year \\(i\\). We minimise today\'s cost:'])}
  \[\min\ z_0+${P.map((p, i) => String.raw`${d16e(p)}\,x_${i + 1}`).join('+')}\]
  ${T_(['sous les quatre bilans de trésorerie annuels (entrées égales aux sorties) et les contraintes de signe :', 'subject to the four annual cash balances (inflows equal outflows) and the sign constraints:'])}
  \[\left\{\begin{aligned}${[1, 2, 3, 4].map(rowY).join('\\\\')}\end{aligned}\right.\]
  ${T_(['Les coefficients de la contrainte de l\'année \\(t\\) sont les flux \\(c_{i,t}\\) : \\(100+C_t\\) pour l\'obligation qui arrive à échéance, \\(C_i\\) pour les obligations plus longues.', 'The coefficients of the year-\\(t\\) constraint are the cash flows \\(c_{i,t}\\): \\(100+C_t\\) for the bond that matures, \\(C_i\\) for the longer bonds.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Sans excédent, \\(z_t=0\\) pour tout \\(t\\). La contrainte de l\'année 4 ne fait intervenir que \\(x_4\\) ; on remonte ensuite d\'une année à la fois, les obligations plus longues déjà choisies versant leurs coupons :', 'Without surplus, \\(z_t=0\\) for every \\(t\\). The year-4 constraint only involves \\(x_4\\); we then move back one year at a time, the longer bonds already chosen paying their coupons:'])}
  \[\begin{aligned}${back.join('\\\\')}\end{aligned}\]
  ${T_(['Les quatre quantités sont positives : le portefeuille est réalisable. Son coût vaut :', 'The four quantities are positive: the portfolio is feasible. Its cost is:'])}
  \[\sum_{i=1}^{4}P_i\,x_i=${costTerms}\approx ${tex(D.cost, 2)}\]</p>
  <p class="check">${T_(['Vérification de l\'année 1', 'Check for year 1'])} : \(${100 + C[0]}\times ${d16x(x[0])}+${C[1]}\times ${d16x(x[1])}+${C[2]}\times ${d16x(x[2])}+${C[3]}\times ${d16x(x[3])}\approx ${tex((100 + C[0]) * x[0] + C[1] * x[1] + C[2] * x[2] + C[3] * x[3], 2)}=L_1\).</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['À l\'optimum d\'un programme linéaire, toute variable strictement positive a un coût réduit nul : son coût dans l\'objectif est égal à la valeur, aux prix duaux, de ce qu\'elle apporte aux contraintes. L\'obligation \\(i\\) coûte \\(P_i\\) et apporte \\(c_{i,t}\\) à la contrainte de l\'année \\(t\\), d\'où \\(P_i=\\sum_t c_{i,t}\\lambda_t\\). Le système est triangulaire ; on le résout en avançant dans le temps :', 'At the optimum of a linear programme, every strictly positive variable has a zero reduced cost: its cost in the objective equals the value, at the shadow prices, of what it brings to the constraints. Bond \\(i\\) costs \\(P_i\\) and brings \\(c_{i,t}\\) to the year-\\(t\\) constraint, hence \\(P_i=\\sum_t c_{i,t}\\lambda_t\\). The system is triangular; it is solved moving forward in time:'])}
  \[\begin{aligned}${dualL.join('\\\\')}\end{aligned}\]</p>
  <p><strong>b.</strong> ${T_(['Un euro payé dans \\(t\\) ans coûte \\(\\lambda_t\\) aujourd\'hui, donc \\(\\lambda_t=(1+r_t)^{-t}\\) :', 'One euro paid in \\(t\\) years costs \\(\\lambda_t\\) today, so \\(\\lambda_t=(1+r_t)^{-t}\\):'])}
  \[\begin{aligned}${rates.join('\\\\')}\end{aligned}\]
  ${T_(['La courbe implicite est croissante : les obligations longues rapportent davantage.', 'The implied curve is increasing: longer bonds yield more.'])}</p>
  <p><strong>c.</strong> ${T_(['On calcule la valeur du passif aux prix duaux :', 'We compute the value of the liability at the shadow prices:'])}
  \[\sum_{t=1}^{4}\lambda_t\,L_t=${lam.map((l, t) => `${tex(l, 6)}\\times ${tex(L[t], 0)}`).join('+')}\approx ${tex(D.lamL, 2)}\]
  ${T_(['On retrouve le coût du portefeuille : c\'est la dualité forte, les valeurs optimales du primal et du dual sont égales. Concrètement, payer le passif revient à acheter \\(L_t\\) euros de chaque date au prix unitaire \\(\\lambda_t\\).', 'This is the cost of the portfolio: by strong duality, the optimal values of the primal and of the dual are equal. Concretely, paying the liability amounts to buying \\(L_t\\) euros of each date at the unit price \\(\\lambda_t\\).'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le coût réduit d\'une variable est son coût dans l\'objectif moins la valeur, aux prix duaux, de ce qu\'elle consomme. L\'excédent \\(z_{t}\\) retire un euro l\'année \\(t\\) et rend \\(1+\\rho\\) l\'année \\(t+1\\) ; \\(z_0\\) coûte un euro aujourd\'hui et rend \\(1+\\rho\\) l\'année 1 :', 'The reduced cost of a variable is its cost in the objective minus the value, at the shadow prices, of what it uses. The surplus \\(z_{t}\\) takes one euro in year \\(t\\) and gives back \\(1+\\rho\\) in year \\(t+1\\); \\(z_0\\) costs one euro today and gives back \\(1+\\rho\\) in year 1:'])}
  \[\begin{aligned}${rcz.join('\\\\')}\end{aligned}\]
  ${T_(['Les quatre coûts réduits sont positifs : garder un excédent augmenterait le coût. Cela revient à constater que les forwards implicites dépassent le taux de réinvestissement :', 'All four reduced costs are positive: keeping a surplus would raise the cost. This amounts to noting that the implied forwards exceed the reinvestment rate:'])}
  \[${D.f.map((v, t) => `f_${t + 1}\\approx ${tex(100 * v, 2)}\\,\\%`).join(',\\quad ')}\qquad\text{${T_(['contre', 'against'])}}\qquad\rho=${tex(100 * rho, 2)}\,\%\]
  ${T_(['Le portefeuille de la question 2 est réalisable, et aucune variable hors base n\'a de coût réduit négatif : il est optimal.', 'The portfolio of question 2 is feasible, and no non-basic variable has a negative reduced cost: it is optimal.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'obligation 5 verse', 'Bond 5 pays'])} ${D.C5} ${T_(['chaque année jusqu\'à l\'année', 'every year up to year'])} ${D.m5}, ${T_(['plus 100 l\'année', 'plus 100 in year'])} ${D.m5}. ${T_(['Son coût réduit est son prix moins la valeur de ses flux aux prix duaux :', 'Its reduced cost is its price minus the value of its cash flows at the shadow prices:'])}
  \[\bar c_5=P_5-\sum_{t=1}^{${D.m5}}c_{5,t}\,\lambda_t=${d16e(D.P5)}-(${cf5.join('+')})\approx ${d16e(D.P5)}-${tex(D.theo5, 4)}=${tex(D.rc5, 4)}\]
  ${D.cheap ? T_(['Le coût réduit est négatif : l\'obligation 5 coûte moins cher que le portefeuille des obligations existantes qui reproduit ses flux. Le portefeuille de la question 2 n\'est plus optimal : il faut acheter l\'obligation 5 et réduire les quantités des obligations qu\'elle remplace, ce qui fait baisser le coût de ' + fmt(-D.rc5, 2) + ' par obligation 5 achetée, tant que les autres quantités restent positives.', 'The reduced cost is negative: bond 5 is cheaper than the portfolio of existing bonds that replicates its cash flows. The portfolio of question 2 is no longer optimal: bond 5 should be bought and the quantities of the bonds it replaces reduced, which lowers the cost by ' + fmt(-D.rc5, 2) + ' per bond 5 bought, as long as the other quantities remain positive.']) : T_(['Le coût réduit est positif : l\'obligation 5 est plus chère que le portefeuille des obligations existantes qui reproduit ses flux. L\'acheter augmenterait le coût ; le portefeuille de la question 2 reste optimal.', 'The reduced cost is positive: bond 5 is more expensive than the portfolio of existing bonds that replicates its cash flows. Buying it would raise the cost; the portfolio of question 2 remains optimal.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d16sol(D, 'fr');
I18N.en.sol = D => d16sol(D, 'en');
