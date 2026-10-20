/* ============================================================
   PAGE mf17 — Valeur à risque et valeur à risque conditionnelle
   ============================================================ */
I18N.fr.k = {
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié',
  'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 17 – VaR et CVaR', 'k-h1': 'VaR et CVaR',
  'k-coursetitle': 'Mesurer le risque de perte, comprendre pourquoi la VaR ne suffit pas, optimiser la CVaR', 'k-extitle': 'Calculs de VaR et de CVaR, sous-additivité et diversification', 'k-soltitle': 'Calculs de VaR et de CVaR, sous-additivité et diversification'
};
I18N.en.k = {
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied',
  'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 17 – VaR and CVaR', 'k-h1': 'VaR and CVaR',
  'k-coursetitle': 'Measuring the risk of loss, why VaR is not enough, optimising CVaR', 'k-extitle': 'VaR and CVaR computations, subadditivity and diversification', 'k-soltitle': 'VaR and CVaR computations, subadditivity and diversification'
};

/* ---------- outils : lois discrètes ---------- */
/* VaR_alpha = plus petite valeur l telle que P(L <= l) >= alpha */
function d17var(vals, probs, a) {
  const idx = vals.map((v, i) => i).sort((i, j) => vals[i] - vals[j]);
  let c = 0;
  for (const i of idx) { c += probs[i]; if (c >= a - 1e-12) return vals[i]; }
  return vals[idx[idx.length - 1]];
}
/* CVaR de Rockafellar-Uryasev : VaR + E[(L - VaR)^+] / (1 - alpha) */
function d17cvar(vals, probs, a) {
  const v = d17var(vals, probs, a);
  let e = 0; vals.forEach((x, i) => { if (x > v) e += probs[i] * (x - v); });
  return v + e / (1 - a);
}
function d17ru(vals, probs, a, c) { let e = 0; vals.forEach((x, i) => { if (x > c) e += probs[i] * (x - c); }); return c + e / (1 - a); }
/* deux obligations indépendantes : pertes -g (prob. 1-p) ou l (prob. p) */
function d17bonds(g, l, p) {
  return { one: { v: [-g, l], p: [1 - p, p] }, two: { v: [-2 * g, l - g, 2 * l], p: [(1 - p) * (1 - p), 2 * p * (1 - p), p * p] } };
}
const D17_DISC = { v: Array.from({ length: 100 }, (_, j) => j - 75), p: Array.from({ length: 100 }, () => 0.01) };
/* mélange gaussien de variance 1 : 90 % N(0,1) et 10 % N(0,9), remis à l'échelle */
const D17_S = 1 / Math.sqrt(1.8);
function d17mixCdf(x) { const y = x / D17_S; return 0.9 * normCdf(y) + 0.1 * normCdf(y / 3); }
function d17mixPdf(x) { const y = x / D17_S; return (0.9 * normPdf(y) + 0.1 * normPdf(y / 3) / 3) / D17_S; }
function d17mixVar(a) { let lo = -10, hi = 10; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (d17mixCdf(m) < a) lo = m; else hi = m; } return (lo + hi) / 2; }
function d17mixCvar(a) { const q = d17mixVar(a), y = q / D17_S; return D17_S * (0.9 * normPdf(y) + 0.3 * normPdf(y / 3)) / (1 - a); }

function d17code(lang, lines) {
  const esc2 = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return '<div class="code-wrap"><div class="code-head"><span>Python</span><button type="button" onclick="copyCode(this)">' + (lang === 'fr' ? 'Copier' : 'Copy') + '</button></div><div class="code-block">' +
    lines.map(l => '<div class="cl"><code>' + (l === '' ? '&nbsp;' : esc2(l)) + '</code></div>').join('') + '</div></div>';
}
const D17_PY = c => [
  'import numpy as np',
  '',
  'def var_cvar(pertes, alpha):            # ' + c[0],
  '    L = np.sort(np.asarray(pertes))',
  '    k = int(np.ceil(alpha * len(L))) - 1  # ' + c[1],
  '    var = L[k]',
  '    cvar = var + np.mean(np.maximum(L - var, 0)) / (1 - alpha)',
  '    return var, cvar',
  '',
  'pertes = np.arange(100) - 75             # ' + c[2],
  'print(var_cvar(pertes, 0.95))            # (19, 22.0)'
];

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez calculer la valeur à risque (VaR) et la valeur à risque conditionnelle (CVaR) d'une perte, dans le cas d'une loi discrète et dans le cas gaussien, expliquer pourquoi la VaR n'est pas une mesure de risque cohérente, et écrire le programme linéaire qui minimise la CVaR d'un portefeuille.<br><br>
<strong>Pourquoi en finance ?</strong> Les régulateurs bancaires et assurantiels imposent des fonds propres calculés à partir de ces mesures ; les gérants s'en servent pour fixer des limites de risque. Savoir ce qu'elles mesurent, et ce qu'elles ne mesurent pas, est indispensable.<br><br>
<strong>Prérequis.</strong> Lois discrètes et loi normale (pages 1 et 2), programmation linéaire (page 15).
</div>
<p class="toc">Sommaire : <a href="#s1">1. La VaR</a> · <a href="#s2">2. Mesures cohérentes</a> · <a href="#s3">3. Ce que la VaR ne voit pas</a> · <a href="#s4">4. La CVaR</a> · <a href="#s5">5. Optimiser la CVaR</a> · <a href="#s6">6. En Python</a> · <a href="#s7">7. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. La valeur à risque</div>
<p>On note \(L\) la perte d'une position sur un horizon donné ; une perte négative est un gain. Pour un niveau de confiance \(\alpha\), par exemple 95 % ou 99 %, la <em>valeur à risque</em> est le plus petit montant que la perte ne dépasse qu'avec une probabilité au plus \(1-\alpha\) :
\[\text{VaR}_\alpha(L)=\min\{\ell\ :\ \mathbb{P}(L\le\ell)\ge\alpha\}\]
C'est le quantile d'ordre \(\alpha\) de la perte. Si \(L\sim\mathcal{N}(\mu,\sigma^2)\), on a \(\mathbb{P}(L\le\mu+z\sigma)=\Phi(z)\), d'où, avec \(z_\alpha:=\Phi^{-1}(\alpha)\) :
\[\text{VaR}_\alpha(L)=\mu+z_\alpha\,\sigma\qquad(z_{0.95}\approx 1.645\ \text{;}\ z_{0.99}\approx 2.326)\]
La VaR est liée aux contraintes en probabilité : pour un seuil \(b\), on a l'équivalence \(\mathbb{P}(L\le b)\ge\alpha\iff\text{VaR}_\alpha(L)\le b\).</p>
<p>Pour une loi discrète, la définition se lit sur les pertes rangées par ordre croissant. Prenons la perte \(L=j-75\), où \(j\) est un entier tiré uniformément entre 0 et 99 : les pertes vont de \(-75\) à \(24\), chacune avec probabilité 1 %. On a \(\mathbb{P}(L\le 19)=0.95\) et \(\mathbb{P}(L\le 18)=0.94\), donc \(\text{VaR}_{0.95}(L)=19\). Certains auteurs retiennent la plus petite perte de la queue des 5 %, ici 20 : pour une loi discrète, la VaR dépend de la convention, ce qui n'est pas le cas de la CVaR (section 4).</p>
<div class="ifig" data-fig="dist"></div>
<div class="fig-cap">Figure 1 — La loi de la perte, la VaR (trait rouge) et la CVaR (trait noir) au niveau choisi. La queue au-delà de la VaR est colorée. Comparez la loi normale et un mélange de lois normales de même variance mais à queue épaisse : pour \(\alpha=95\) %, leurs VaR sont proches, mais l'écart entre VaR et CVaR est plus grand pour le mélange, et l'écart se creuse quand \(\alpha\) augmente.</div>

<div class="dossier-title" id="s2">2. Les mesures de risque cohérentes</div>
<p>Artzner, Delbaen, Eber et Heath (1999) ont proposé quatre propriétés qu'une mesure de risque \(\varrho\) raisonnable devrait vérifier, pour des pertes \(L\), \(L_1\), \(L_2\) :</p>
<ul class="kit-simple">
<li><em>Invariance par translation</em> : \(\varrho(L+c)=\varrho(L)+c\) pour toute constante \(c\). Ajouter une perte certaine augmente le risque d'autant.</li>
<li><em>Homogénéité positive</em> : \(\varrho(\lambda L)=\lambda\,\varrho(L)\) pour \(\lambda\ge 0\). Doubler la position double le risque.</li>
<li><em>Monotonie</em> : si \(L_1\le L_2\) dans tous les états, alors \(\varrho(L_1)\le\varrho(L_2)\).</li>
<li><em>Sous-additivité</em> : \(\varrho(L_1+L_2)\le\varrho(L_1)+\varrho(L_2)\). Regrouper deux positions ne crée pas de risque : la diversification ne peut que réduire le risque mesuré.</li>
</ul>
<p>La VaR vérifie les trois premières propriétés, mais pas toujours la quatrième. Considérons deux obligations indépendantes qui rapportent chacune 1 avec probabilité 0.96 et font perdre 2 avec probabilité 0.04. Pour l'une d'elles, \(\mathbb{P}(L_1\le -1)=0.96\ge 0.95\), donc \(\text{VaR}_{0.95}(L_1)=-1\). Pour les deux ensemble, la perte vaut \(-2\) avec probabilité \(0.96^2=0.9216\), \(1\) avec probabilité \(2\times 0.96\times 0.04=0.0768\) et \(4\) avec probabilité \(0.04^2=0.0016\). Comme \(0.9216&lt;0.95\le 0.9984\), il vient :
\[\text{VaR}_{0.95}(L_1+L_2)=1\ &gt;\ \text{VaR}_{0.95}(L_1)+\text{VaR}_{0.95}(L_2)=-2\]
Mesurée par la VaR, la diversification augmente le risque : la VaR n'est pas cohérente. Dans le cas gaussien, en revanche, elle est sous-additive, car l'écart-type l'est.</p>
<div class="ifig" data-fig="sub"></div>
<div class="fig-cap">Figure 2 — Les deux obligations de l'exemple, au niveau 95 %, en fonction de la probabilité de défaut \(p\). La VaR du portefeuille dépasse la somme des VaR quand \(p\) est compris entre 2.5 % environ et 5 % : une seule obligation fait défaut trop rarement pour apparaître dans sa VaR, mais l'une des deux fait défaut assez souvent pour apparaître dans celle du portefeuille. La CVaR, elle, reste toujours sous-additive.</div>

<div class="dossier-title" id="s3">3. Ce que la VaR ne voit pas</div>
<p>Deux placements perdent 0 avec probabilité 95 %. Avec probabilité 5 %, le placement A perd un million d'euros et le placement B cent millions. Au niveau 95 %, leurs VaR sont toutes deux nulles, alors que B est évidemment plus risqué. La VaR indique où commence la queue de la distribution, pas ce qui se passe à l'intérieur. Elle se prête en outre mal à l'optimisation : minimiser la VaR d'un portefeuille construit à partir de scénarios est un problème non convexe, qui peut avoir de nombreux minima locaux.</p>

<div class="dossier-title" id="s4">4. La valeur à risque conditionnelle</div>
<p>La CVaR, ou <em>expected shortfall</em>, mesure la perte moyenne dans la queue. Rockafellar et Uryasev (2000) l'ont définie comme la valeur d'un problème de minimisation :
\[\text{CVaR}_\alpha(L)=\min_{c\in\mathbb{R}}\Big\{c+\frac{1}{1-\alpha}\,\mathbb{E}\big[(L-c)^+\big]\Big\}\]
où \((x)^+=\max(x,0)\). Le minimum est atteint en \(c=\text{VaR}_\alpha(L)\), d'où la formule de calcul :
\[\text{CVaR}_\alpha(L)=\text{VaR}_\alpha(L)+\frac{1}{1-\alpha}\,\mathbb{E}\big[(L-\text{VaR}_\alpha(L))^+\big]\]
Pour une loi continue, elle vaut \(\mathbb{E}[L\mid L\ge\text{VaR}_\alpha(L)]\) ; pour \(n\) scénarios équiprobables avec \((1-\alpha)n\) entier, c'est la moyenne des \((1-\alpha)n\) plus grandes pertes. Dans l'exemple de la section 1 :
\[\text{CVaR}_{0.95}(L)=19+\frac{(1+2+3+4+5)\times 0.01}{0.05}=22=\frac{20+21+22+23+24}{5}\]
Avec la convention qui donne une VaR de 20, on obtient de même \(20+\frac{(1+2+3+4)\times 0.01}{0.05}=22\). Dans le cas gaussien :
\[\text{CVaR}_\alpha(L)=\mu+\sigma\,\frac{\varphi(z_\alpha)}{1-\alpha}\qquad(\text{coefficient }2.063\text{ pour }95\,\%,\ 2.665\text{ pour }99\,\%)\]
La CVaR est cohérente ; elle est toujours supérieure ou égale à la VaR.</p>
<div class="ifig" data-fig="ru"></div>
<div class="fig-cap">Figure 3 — La fonction \(c\mapsto c+\mathbb{E}[(L-c)^+]/(1-\alpha)\) pour la perte de la section 1. Elle est convexe et linéaire par morceaux ; sa valeur minimale est la CVaR, atteinte en la VaR. Pour \(\alpha=95\) %, le minimum est atteint sur tout le segment \([19\,;\,20]\) : les deux conventions de VaR donnent la même CVaR.</div>

<div class="dossier-title" id="s5">5. Optimiser la CVaR</div>
<p>Un portefeuille de poids \(\mathbf{x}\) subit, dans le scénario \(s=1,\ldots,S\) de probabilité \(p_s\), la perte \(L_s(\mathbf{x})=-\mathbf{r}_s^T\mathbf{x}\), où \(\mathbf{r}_s\) est le vecteur des rendements. La fonction à minimiser contient \((L_s-c)^+\), qui n'est pas linéaire. On introduit une variable \(u_s\) par scénario, contrainte à majorer \(L_s-c\) et 0 ; à l'optimum, \(u_s\) vaut exactement \((L_s-c)^+\). Minimiser la CVaR devient un programme linéaire :
\[\begin{aligned}\min_{\mathbf{x},\,c,\,\mathbf{u}}\ &amp;\ c+\frac{1}{1-\alpha}\sum_{s=1}^{S}p_s\,u_s\\\text{sous }&amp;\ u_s\ge -\mathbf{r}_s^T\mathbf{x}-c,\qquad u_s\ge 0,\qquad s=1,\ldots,S\\&amp;\ \mathbf{e}^T\mathbf{x}=1,\qquad\mathbf{x}\ge\mathbf{0}\end{aligned}\]
On peut aussi maximiser le rendement espéré sous une contrainte \(\text{CVaR}_\alpha\le U\), ou imposer plusieurs limites à des niveaux \(\alpha_j\) différents : le programme reste linéaire. La CVaR étant convexe en \(\mathbf{x}\), la CVaR d'un mélange de deux portefeuilles est au plus la moyenne de leurs CVaR : c'est la sous-additivité traduite en termes de poids.</p>

<div class="dossier-title" id="s6">6. En Python</div>
<p>VaR et CVaR de scénarios équiprobables, appliquées à l'exemple de la section 1.</p>
${d17code('fr', D17_PY(['scénarios équiprobables', 'rang du quantile d\'ordre alpha', 'pertes -75, ..., 24']))}

<div class="dossier-title" id="s7">7. À retenir</div>
<ul class="kit-simple">
<li>La VaR est le quantile d'ordre \(\alpha\) de la perte ; dans le cas gaussien, \(\mu+z_\alpha\sigma\).</li>
<li>La VaR n'est pas sous-additive : la diversification peut l'augmenter ; elle ignore aussi l'ampleur des pertes au-delà du quantile.</li>
<li>La CVaR est la perte moyenne dans la queue : \(\text{VaR}+\mathbb{E}[(L-\text{VaR})^+]/(1-\alpha)\), soit la moyenne des pires scénarios.</li>
<li>La CVaR est cohérente, convexe, et sa minimisation sur des scénarios est un programme linéaire.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can compute the value at risk (VaR) and the conditional value at risk (CVaR) of a loss, for a discrete distribution and in the Gaussian case, explain why VaR is not a coherent risk measure, and write the linear programme that minimises the CVaR of a portfolio.<br><br>
<strong>Why in finance?</strong> Banking and insurance regulators require capital computed from these measures; fund managers use them to set risk limits. Knowing what they measure, and what they miss, is essential.<br><br>
<strong>Prerequisites.</strong> Discrete distributions and the normal distribution (pages 1 and 2), linear programming (page 15).
</div>
<p class="toc">Contents: <a href="#s1">1. VaR</a> · <a href="#s2">2. Coherent measures</a> · <a href="#s3">3. What VaR misses</a> · <a href="#s4">4. CVaR</a> · <a href="#s5">5. Optimising CVaR</a> · <a href="#s6">6. In Python</a> · <a href="#s7">7. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Value at risk</div>
<p>Let \(L\) be the loss of a position over a given horizon; a negative loss is a gain. For a confidence level \(\alpha\), for instance 95% or 99%, the <em>value at risk</em> is the smallest amount that the loss exceeds only with probability at most \(1-\alpha\):
\[\text{VaR}_\alpha(L)=\min\{\ell\ :\ \mathbb{P}(L\le\ell)\ge\alpha\}\]
It is the \(\alpha\)-quantile of the loss. If \(L\sim\mathcal{N}(\mu,\sigma^2)\), then \(\mathbb{P}(L\le\mu+z\sigma)=\Phi(z)\), hence, with \(z_\alpha:=\Phi^{-1}(\alpha)\):
\[\text{VaR}_\alpha(L)=\mu+z_\alpha\,\sigma\qquad(z_{0.95}\approx 1.645\ \text{;}\ z_{0.99}\approx 2.326)\]
VaR is linked to chance constraints: for a threshold \(b\), we have the equivalence \(\mathbb{P}(L\le b)\ge\alpha\iff\text{VaR}_\alpha(L)\le b\).</p>
<p>For a discrete distribution, the definition is read on the losses sorted in increasing order. Take the loss \(L=j-75\), where \(j\) is an integer drawn uniformly between 0 and 99: losses range from \(-75\) to \(24\), each with probability 1%. We have \(\mathbb{P}(L\le 19)=0.95\) and \(\mathbb{P}(L\le 18)=0.94\), so \(\text{VaR}_{0.95}(L)=19\). Some authors take the smallest loss of the 5% tail, here 20: for a discrete distribution, VaR depends on the convention, which is not the case for CVaR (section 4).</p>
<div class="ifig" data-fig="dist"></div>
<div class="fig-cap">Figure 1 — The distribution of the loss, the VaR (red line) and the CVaR (black line) at the chosen level. The tail beyond the VaR is shaded. Compare the normal distribution with a mixture of normals with the same variance but a fat tail: at \(\alpha=95\)%, their VaRs are close, but the gap between VaR and CVaR is wider for the mixture, and it widens as \(\alpha\) increases.</div>

<div class="dossier-title" id="s2">2. Coherent risk measures</div>
<p>Artzner, Delbaen, Eber and Heath (1999) proposed four properties that a sensible risk measure \(\varrho\) should satisfy, for losses \(L\), \(L_1\), \(L_2\):</p>
<ul class="kit-simple">
<li><em>Translation invariance</em>: \(\varrho(L+c)=\varrho(L)+c\) for every constant \(c\). Adding a certain loss raises the risk by the same amount.</li>
<li><em>Positive homogeneity</em>: \(\varrho(\lambda L)=\lambda\,\varrho(L)\) for \(\lambda\ge 0\). Doubling the position doubles the risk.</li>
<li><em>Monotonicity</em>: if \(L_1\le L_2\) in every state, then \(\varrho(L_1)\le\varrho(L_2)\).</li>
<li><em>Subadditivity</em>: \(\varrho(L_1+L_2)\le\varrho(L_1)+\varrho(L_2)\). Merging two positions does not create risk: diversification can only reduce the measured risk.</li>
</ul>
<p>VaR satisfies the first three properties, but not always the fourth. Consider two independent bonds that each earn 1 with probability 0.96 and lose 2 with probability 0.04. For one of them, \(\mathbb{P}(L_1\le -1)=0.96\ge 0.95\), so \(\text{VaR}_{0.95}(L_1)=-1\). For both together, the loss is \(-2\) with probability \(0.96^2=0.9216\), \(1\) with probability \(2\times 0.96\times 0.04=0.0768\) and \(4\) with probability \(0.04^2=0.0016\). Since \(0.9216&lt;0.95\le 0.9984\), we get:
\[\text{VaR}_{0.95}(L_1+L_2)=1\ &gt;\ \text{VaR}_{0.95}(L_1)+\text{VaR}_{0.95}(L_2)=-2\]
Measured by VaR, diversification increases risk: VaR is not coherent. In the Gaussian case, however, it is subadditive, because the standard deviation is.</p>
<div class="ifig" data-fig="sub"></div>
<div class="fig-cap">Figure 2 — The two bonds of the example, at the 95% level, as a function of the default probability \(p\). The VaR of the portfolio exceeds the sum of the VaRs when \(p\) lies between about 2.5% and 5%: a single bond defaults too rarely to show up in its VaR, but one of the two defaults often enough to show up in the portfolio's VaR. CVaR, on the other hand, always remains subadditive.</div>

<div class="dossier-title" id="s3">3. What VaR misses</div>
<p>Two investments lose 0 with probability 95%. With probability 5%, investment A loses one million euros and investment B one hundred million. At the 95% level, both VaRs are zero, although B is obviously riskier. VaR tells where the tail of the distribution starts, not what happens inside it. It is also ill-suited to optimisation: minimising the VaR of a portfolio built from scenarios is a non-convex problem, which may have many local minima.</p>

<div class="dossier-title" id="s4">4. Conditional value at risk</div>
<p>CVaR, or <em>expected shortfall</em>, measures the average loss in the tail. Rockafellar and Uryasev (2000) defined it as the value of a minimisation problem:
\[\text{CVaR}_\alpha(L)=\min_{c\in\mathbb{R}}\Big\{c+\frac{1}{1-\alpha}\,\mathbb{E}\big[(L-c)^+\big]\Big\}\]
where \((x)^+=\max(x,0)\). The minimum is attained at \(c=\text{VaR}_\alpha(L)\), hence the computing formula:
\[\text{CVaR}_\alpha(L)=\text{VaR}_\alpha(L)+\frac{1}{1-\alpha}\,\mathbb{E}\big[(L-\text{VaR}_\alpha(L))^+\big]\]
For a continuous distribution, it equals \(\mathbb{E}[L\mid L\ge\text{VaR}_\alpha(L)]\); for \(n\) equally likely scenarios with \((1-\alpha)n\) an integer, it is the average of the \((1-\alpha)n\) largest losses. In the example of section 1:
\[\text{CVaR}_{0.95}(L)=19+\frac{(1+2+3+4+5)\times 0.01}{0.05}=22=\frac{20+21+22+23+24}{5}\]
With the convention giving a VaR of 20, we likewise get \(20+\frac{(1+2+3+4)\times 0.01}{0.05}=22\). In the Gaussian case:
\[\text{CVaR}_\alpha(L)=\mu+\sigma\,\frac{\varphi(z_\alpha)}{1-\alpha}\qquad(\text{coefficient }2.063\text{ at }95\%,\ 2.665\text{ at }99\%)\]
CVaR is coherent; it is always greater than or equal to VaR.</p>
<div class="ifig" data-fig="ru"></div>
<div class="fig-cap">Figure 3 — The function \(c\mapsto c+\mathbb{E}[(L-c)^+]/(1-\alpha)\) for the loss of section 1. It is convex and piecewise linear; its minimum value is the CVaR, attained at the VaR. At \(\alpha=95\)%, the minimum is attained on the whole segment \([19,\,20]\): both VaR conventions give the same CVaR.</div>

<div class="dossier-title" id="s5">5. Optimising CVaR</div>
<p>A portfolio with weights \(\mathbf{x}\) suffers, in scenario \(s=1,\ldots,S\) with probability \(p_s\), the loss \(L_s(\mathbf{x})=-\mathbf{r}_s^T\mathbf{x}\), where \(\mathbf{r}_s\) is the vector of returns. The function to minimise contains \((L_s-c)^+\), which is not linear. We introduce one variable \(u_s\) per scenario, constrained to exceed both \(L_s-c\) and 0; at the optimum, \(u_s\) equals exactly \((L_s-c)^+\). Minimising CVaR becomes a linear programme:
\[\begin{aligned}\min_{\mathbf{x},\,c,\,\mathbf{u}}\ &amp;\ c+\frac{1}{1-\alpha}\sum_{s=1}^{S}p_s\,u_s\\\text{s.t. }&amp;\ u_s\ge -\mathbf{r}_s^T\mathbf{x}-c,\qquad u_s\ge 0,\qquad s=1,\ldots,S\\&amp;\ \mathbf{e}^T\mathbf{x}=1,\qquad\mathbf{x}\ge\mathbf{0}\end{aligned}\]
One may also maximise expected return subject to \(\text{CVaR}_\alpha\le U\), or impose several limits at different levels \(\alpha_j\): the programme remains linear. Since CVaR is convex in \(\mathbf{x}\), the CVaR of a mix of two portfolios is at most the average of their CVaRs: this is subadditivity expressed in terms of weights.</p>

<div class="dossier-title" id="s6">6. In Python</div>
<p>VaR and CVaR of equally likely scenarios, applied to the example of section 1.</p>
${d17code('en', D17_PY(['equally likely scenarios', 'rank of the alpha-quantile', 'losses -75, ..., 24']))}

<div class="dossier-title" id="s7">7. Key points</div>
<ul class="kit-simple">
<li>VaR is the \(\alpha\)-quantile of the loss; in the Gaussian case, \(\mu+z_\alpha\sigma\).</li>
<li>VaR is not subadditive: diversification may increase it; it also ignores the size of losses beyond the quantile.</li>
<li>CVaR is the average loss in the tail: \(\text{VaR}+\mathbb{E}[(L-\text{VaR})^+]/(1-\alpha)\), that is the average of the worst scenarios.</li>
<li>CVaR is coherent and convex, and minimising it over scenarios is a linear programme.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  law: 'Loi de la perte', a: 'Niveau α', norm: 'normale', mix: 'mélange à queue épaisse', disc: 'discrète (j − 75)', loss: 'perte', dens: 'densité', prob: 'probabilité',
  distAria: 'Loi de la perte avec la VaR et la CVaR au niveau choisi',
  distRead: (v, c) => `VaR = <span class="v">${fmt(v, 3)}</span> &nbsp;·&nbsp; CVaR = <span class="v">${fmt(c, 3)}</span> &nbsp;·&nbsp; écart CVaR − VaR = <span class="v">${fmt(c - v, 3)}</span>`,
  p: 'Probabilité de défaut p', svar: 'VaR(L₁) + VaR(L₂)', pvar: 'VaR(L₁ + L₂)', scv: 'CVaR(L₁) + CVaR(L₂)', pcv: 'CVaR(L₁ + L₂)', subAria: 'VaR et CVaR de deux obligations et de leur somme',
  subRead: (a, b, c, d) => `Somme des VaR = <span class="v">${fmt(a, 2)}</span>, VaR du portefeuille = <span class="v">${fmt(b, 2)}</span> : ` + (b > a + 1e-9 ? '<strong>la VaR n\'est pas sous-additive ici</strong>.' : 'sous-additivité respectée.') + `<br>Somme des CVaR = <span class="v">${fmt(c, 2)}</span>, CVaR du portefeuille = <span class="v">${fmt(d, 2)}</span> : sous-additivité respectée.`,
  c: 'c', g: 'c + E[(L − c)⁺] / (1 − α)', ruAria: 'Fonction de Rockafellar et Uryasev, minimale en la VaR',
  ruRead: (lo, hi, m) => `Minimum <span class="v">${fmt(m, 3)}</span> = CVaR, atteint pour ` + (hi - lo > 1e-9 ? `tout c entre <span class="v">${fmt(lo, 0)}</span> et <span class="v">${fmt(hi, 0)}</span>` : `c = <span class="v">${fmt(lo, 0)}</span> = VaR`) + '.'
};
I18N.en.f = {
  law: 'Loss distribution', a: 'Level α', norm: 'normal', mix: 'fat-tailed mixture', disc: 'discrete (j − 75)', loss: 'loss', dens: 'density', prob: 'probability',
  distAria: 'Loss distribution with VaR and CVaR at the chosen level',
  distRead: (v, c) => `VaR = <span class="v">${fmt(v, 3)}</span> &nbsp;·&nbsp; CVaR = <span class="v">${fmt(c, 3)}</span> &nbsp;·&nbsp; gap CVaR − VaR = <span class="v">${fmt(c - v, 3)}</span>`,
  p: 'Default probability p', svar: 'VaR(L₁) + VaR(L₂)', pvar: 'VaR(L₁ + L₂)', scv: 'CVaR(L₁) + CVaR(L₂)', pcv: 'CVaR(L₁ + L₂)', subAria: 'VaR and CVaR of two bonds and of their sum',
  subRead: (a, b, c, d) => `Sum of VaRs = <span class="v">${fmt(a, 2)}</span>, portfolio VaR = <span class="v">${fmt(b, 2)}</span>: ` + (b > a + 1e-9 ? '<strong>VaR is not subadditive here</strong>.' : 'subadditivity holds.') + `<br>Sum of CVaRs = <span class="v">${fmt(c, 2)}</span>, portfolio CVaR = <span class="v">${fmt(d, 2)}</span>: subadditivity holds.`,
  c: 'c', g: 'c + E[(L − c)⁺] / (1 − α)', ruAria: 'Rockafellar-Uryasev function, minimal at the VaR',
  ruRead: (lo, hi, m) => `Minimum <span class="v">${fmt(m, 3)}</span> = CVaR, attained for ` + (hi - lo > 1e-9 ? `every c between <span class="v">${fmt(lo, 0)}</span> and <span class="v">${fmt(hi, 0)}</span>` : `c = <span class="v">${fmt(lo, 0)}</span> = VaR`) + '.'
};
FIGS.dist = {
  state: { law: 'norm', a: 0.95 },
  controls: L => [
    { key: 'law', type: 'select', label: L.f.law, options: [{ v: 'norm', t: L.f.norm }, { v: 'mix', t: L.f.mix }, { v: 'disc', t: L.f.disc }] },
    { key: 'a', label: L.f.a, min: 0.8, max: 0.995, step: 0.005, fmt: v => fmtT(100 * v, 1) + ' %' }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = s.a;
    let v, c, G;
    if (s.law === 'disc') {
      v = d17var(D17_DISC.v, D17_DISC.p, a); c = d17cvar(D17_DISC.v, D17_DISC.p, a);
      G = Plot({ w: 680, h: 300, x0: -78, x1: 28, y0: 0, y1: 0.014, mt: 26, mb: 42 });
      G.axes({ xt: [-75, -50, -25, 0, 25], yt: [0, 0.005, 0.01], xl: L.loss, xf: v => String(v), yf: v => fmtT(v, 3) });
      D17_DISC.v.forEach(x => G.bar(x, 3.4, 0.01, { c: x > v ? COL.s3 : COL.s1, o: x > v ? 0.75 : 0.45 }));
    } else {
      const mix = s.law === 'mix';
      const pdf = mix ? d17mixPdf : normPdf;
      v = mix ? d17mixVar(a) : normInv(a); c = mix ? d17mixCvar(a) : normPdf(normInv(a)) / (1 - a);
      G = Plot({ w: 680, h: 300, x0: -4, x1: 5, y0: 0, y1: 0.55, mt: 26, mb: 42 });
      G.axes({ xt: [-4, -2, 0, 2, 4], yt: [0, 0.2, 0.4], xl: L.loss, xf: v => String(v), yf: v => fmtT(v, 1) });
      G.area(G.sample(pdf, Math.min(v, 5), 5, 120), 0, { c: COL.s3, o: 0.3 });
      G.curve(pdf, -4, 5, { c: COL.s1, w: 2.2 }, 240);
    }
    const yt = s.law === 'disc' ? 0.0128 : 0.5;
    G.seg(v, 0, v, yt, { c: COL.s3, w: 2, dash: '6 4' }); G.text(v, yt, 'VaR', { dy: -4, dx: -4, anchor: 'end', size: 11, c: COL.s3 });
    G.seg(c, 0, c, yt * 0.8, { c: COL.ink, w: 2 }); G.text(c, yt * 0.8, 'CVaR', { dy: -4, dx: 4, anchor: 'start', size: 11 });
    return { svg: G.svg(L.distAria), read: L.distRead(v, c) };
  }
};
FIGS.sub = {
  state: { p: 0.04 },
  controls: L => [{ key: 'p', label: L.f.p, min: 0.005, max: 0.06, step: 0.0025, fmt: v => fmtT(100 * v, 2) + ' %' }],
  draw: function (s, lang) {
    const L = I18N[lang].f, B = d17bonds(1, 2, s.p), a = 0.95;
    const v1 = d17var(B.one.v, B.one.p, a), v2 = d17var(B.two.v, B.two.p, a), c1 = d17cvar(B.one.v, B.one.p, a), c2 = d17cvar(B.two.v, B.two.p, a);
    const vals = [2 * v1, v2, 2 * c1, c2], lo = Math.floor(Math.min(0, ...vals)) - 0.5, hi = Math.ceil(Math.max(...vals)) + 0.8;
    const G = Plot({ w: 680, h: 300, x0: 0.4, x1: 4.6, y0: lo, y1: hi, mt: 30, mb: 42 });
    G.axes({ xt: [], yt: ticks(lo, hi, 6), yf: v => fmtT(v, 1), xAxisAt: 0 });
    const lab = [L.svar, L.pvar, L.scv, L.pcv], col = [COL.s1, v2 > 2 * v1 + 1e-9 ? COL.s3 : COL.s1, COL.s2, COL.s2];
    vals.forEach((y, i) => { G.bar(i + 1, 70, y, { c: col[i], o: i % 2 ? 0.95 : 0.55 }); G.text(i + 1, y, fmt(y, 2), { dy: y >= 0 ? -6 : 14, size: 11, mono: true }); G.text(i + 1, lo, lab[i], { dy: 16, size: 11, c: COL.mute }); });
    return { svg: G.svg(L.subAria), read: L.subRead(2 * v1, v2, 2 * c1, c2) };
  }
};
FIGS.ru = {
  state: { a: 0.95 },
  controls: L => [{ key: 'a', label: L.f.a, min: 0.8, max: 0.99, step: 0.01, fmt: v => fmtT(100 * v, 0) + ' %' }],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = Math.round(s.a * 100) / 100, V = D17_DISC.v, Pp = D17_DISC.p;
    const g = c => d17ru(V, Pp, a, c), m = d17cvar(V, Pp, a);
    let lo = null, hi = null; for (let c = -10; c <= 30; c += 1) { if (Math.abs(g(c) - m) < 1e-9) { if (lo === null) lo = c; hi = c; } }
    const ymax = Math.ceil(g(-10) + 2), ymin = Math.floor(m - 3);
    const G = Plot({ w: 680, h: 300, x0: -10, x1: 30, y0: ymin, y1: ymax, mt: 26, mb: 42 });
    G.axes({ xt: [-10, 0, 10, 20, 30], yt: ticks(ymin, ymax, 5), xl: L.c, xf: v => String(v), yf: v => fmtT(v, 0) });
    G.curve(g, -10, 30, { c: COL.s1, w: 2.2 }, 400);
    G.seg(lo, m, hi, m, { c: COL.s3, w: 4 });
    G.seg(-10, m, 30, m, { c: COL.ink, w: 1, dash: '4 4' }); G.text(30, m, 'CVaR = ' + fmt(m, 2), { dy: -6, dx: -4, anchor: 'end', size: 11 });
    G.dot(lo, m, { c: COL.s3 }); if (hi > lo) G.dot(hi, m, { c: COL.s3 });
    G.legend([{ c: COL.s1, t: L.g }], G.ml + 8, 16);
    return { svg: G.svg(L.ruAria), read: L.ruRead(lo, hi, m) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  /* 1. vingt scénarios */
  D.a1 = pick([0.85, 0.9]); D.S = 20; D.k1 = Math.round((1 - D.a1) * D.S);
  for (;;) { D.L1 = Array.from({ length: 20 }, () => rint(-25, 45)); const s = D.L1.slice().sort((x, y) => x - y); if (s[19] - s[16] > 4) break; }
  D.sorted = D.L1.slice().sort((x, y) => x - y);
  D.rank = Math.round(D.a1 * D.S);
  D.var1 = D.sorted[D.rank - 1];
  D.exc1 = D.L1.filter(x => x > D.var1).map(x => x - D.var1);
  D.cvar1 = D.var1 + D.exc1.reduce((s, x) => s + x, 0) / (D.S * (1 - D.a1));
  D.worst = D.sorted.slice(D.S - D.k1);
  /* 2. deux obligations */
  D.g = pick([2, 3, 4]); D.l = pick([20, 25, 30, 40]); D.p = pick([0.03, 0.035, 0.04, 0.045]);
  const B = d17bonds(D.g, D.l, D.p);
  D.v1 = d17var(B.one.v, B.one.p, 0.95); D.v2 = d17var(B.two.v, B.two.p, 0.95);
  D.c1 = d17cvar(B.one.v, B.one.p, 0.95); D.c2 = d17cvar(B.two.v, B.two.p, 0.95);
  /* 3. portefeuille gaussien */
  D.V = pick([500, 800, 1000, 1500, 2000]); D.w = pick([0.3, 0.4, 0.5, 0.6, 0.7]);
  D.muA = rint(4, 10) / 100; D.muB = rint(2, 7) / 100; D.sA = rint(15, 30) / 100; D.sB = rint(8, 20) / 100; D.rho = pick([-0.3, -0.2, 0, 0.2, 0.4, 0.6]);
  D.a3 = pick([0.95, 0.99]); D.z = normInv(D.a3); D.kc = normPdf(D.z) / (1 - D.a3);
  D.mup = D.w * D.muA + (1 - D.w) * D.muB;
  D.vp = D.w * D.w * D.sA * D.sA + (1 - D.w) * (1 - D.w) * D.sB * D.sB + 2 * D.w * (1 - D.w) * D.rho * D.sA * D.sB;
  D.sp = Math.sqrt(D.vp);
  D.muL = -D.V * D.mup; D.sL = D.V * D.sp;
  D.VaR3 = D.muL + D.z * D.sL; D.CVaR3 = D.muL + D.kc * D.sL;
  D.VaRA = -D.V * D.w * D.muA + D.z * D.V * D.w * D.sA; D.VaRB = -D.V * (1 - D.w) * D.muB + D.z * D.V * (1 - D.w) * D.sB;
  /* 4. minimisation de la CVaR */
  D.a4 = 0.8; D.S4 = 10;
  for (;;) {
    D.r1 = Array.from({ length: 10 }, () => rint(-15, 20)); D.r2 = Array.from({ length: 10 }, () => rint(-12, 16));
    const cv = w => { const Ls = D.r1.map((x, i) => -(w * x + (1 - w) * D.r2[i])); return d17cvar(Ls, Ls.map(() => 0.1), 0.8); };
    D.cv = [cv(0), cv(0.5), cv(1)];
    if (D.cv[1] < Math.min(D.cv[0], D.cv[2]) - 1 && D.cv[0] > 0 && D.cv[2] > 0) break;
  }
  D.L4 = [0, 0.5, 1].map(w => D.r1.map((x, i) => -(w * x + (1 - w) * D.r2[i])));
  return D;
};
function d17t(D, lang) {
  const fr = lang === 'fr';
  const t1 = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Scénario' : 'Scenario'}</th>${D.L1.slice(0, 10).map((_, i) => `<th>${i + 1}</th>`).join('')}</tr></thead><tbody><tr><td>${fr ? 'Perte' : 'Loss'}</td>${D.L1.slice(0, 10).map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr></tbody></table></div>` +
    `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Scénario' : 'Scenario'}</th>${D.L1.slice(10).map((_, i) => `<th>${i + 11}</th>`).join('')}</tr></thead><tbody><tr><td>${fr ? 'Perte' : 'Loss'}</td>${D.L1.slice(10).map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr></tbody></table></div>`;
  return t1;
}
function d17t4(D, lang) {
  const fr = lang === 'fr';
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Scénario' : 'Scenario'}</th>${D.r1.map((_, i) => `<th>${i + 1}</th>`).join('')}</tr></thead><tbody><tr><td>${fr ? 'Rendement de A (%)' : 'Return of A (%)'}</td>${D.r1.map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr><tr><td>${fr ? 'Rendement de B (%)' : 'Return of B (%)'}</td>${D.r2.map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr></tbody></table></div>`;
}
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Les quatre questions sont indépendantes. Une perte négative est un gain. Les montants sont en milliers d'euros.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Vingt scénarios.</strong> Un portefeuille peut subir, sur un mois, l'une des 20 pertes suivantes, toutes de probabilité \(1/20\).
  ${d17t(D, 'fr')}
  <ol><li>Calculez \(\text{VaR}_{${fmtT(D.a1, 2)}}\) à partir de la définition.</li>
  <li>Calculez \(\text{CVaR}_{${fmtT(D.a1, 2)}}\) avec la formule de Rockafellar et Uryasev.</li>
  <li>Vérifiez le résultat en calculant la moyenne des ${D.k1} plus grandes pertes, et interprétez les deux nombres.</li></ol></div></li>
<li><div class="q-text"><strong>Sous-additivité.</strong> Deux obligations indépendantes rapportent chacune ${D.g} avec probabilité \(${fmtT(1 - D.p, 3)}\) et font perdre ${D.l} avec probabilité \(p=${fmtT(D.p, 3)}\) (défaut). On note \(L_1\) et \(L_2\) leurs pertes et on travaille au niveau 95 %.
  <ol><li>Calculez \(\text{VaR}_{0.95}(L_1)\).</li>
  <li>Donnez la loi de \(L_1+L_2\), puis \(\text{VaR}_{0.95}(L_1+L_2)\). Commentez.</li>
  <li>Calculez \(\text{CVaR}_{0.95}(L_1)\) et \(\text{CVaR}_{0.95}(L_1+L_2)\). La sous-additivité est-elle respectée ?</li></ol></div></li>
<li><div class="q-text"><strong>Cas gaussien.</strong> On investit ${fmt(D.V, 0)} : une part \(${fmtT(D.w, 2)}\) dans l'actif A et le reste dans l'actif B. Sur un an, leurs rendements sont gaussiens, d'espérances ${fmtT(100 * D.muA, 0)} % et ${fmtT(100 * D.muB, 0)} %, d'écarts-types ${fmtT(100 * D.sA, 0)} % et ${fmtT(100 * D.sB, 0)} %, de corrélation \(${fmtT(D.rho, 1)}\).
  <ol><li>Donnez l'espérance et l'écart-type de la perte annuelle \(L\) du portefeuille.</li>
  <li>Calculez \(\text{VaR}_{${fmtT(D.a3, 2)}}(L)\) et \(\text{CVaR}_{${fmtT(D.a3, 2)}}(L)\).</li>
  <li>Calculez la VaR de chacune des deux positions prises isolément et comparez leur somme à la VaR du portefeuille.</li></ol></div></li>
<li><div class="q-text"><strong>Minimiser la CVaR.</strong> On répartit un capital entre les actifs A (poids \(w\)) et B (poids \(1-w\)), avec \(0\le w\le 1\). Dix scénarios équiprobables de rendement sont envisagés.
  ${d17t4(D, 'fr')}
  <ol><li>Écrivez le programme linéaire qui minimise la \(\text{CVaR}_{0.8}\) de la perte, exprimée en pourcentage du capital.</li>
  <li>Calculez la \(\text{CVaR}_{0.8}\) des portefeuilles \(w=0\), \(w=0.5\) et \(w=1\).</li>
  <li>Vérifiez que la CVaR du portefeuille \(w=0.5\) est au plus la moyenne des deux autres, et commentez.</li></ol></div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">The four questions are independent. A negative loss is a gain. Amounts are in thousands of euros.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Twenty scenarios.</strong> Over one month, a portfolio may suffer one of the following 20 losses, each with probability \(1/20\).
  ${d17t(D, 'en')}
  <ol><li>Compute \(\text{VaR}_{${fmtT(D.a1, 2)}}\) from the definition.</li>
  <li>Compute \(\text{CVaR}_{${fmtT(D.a1, 2)}}\) with the Rockafellar-Uryasev formula.</li>
  <li>Check the result by computing the average of the ${D.k1} largest losses, and interpret both numbers.</li></ol></div></li>
<li><div class="q-text"><strong>Subadditivity.</strong> Two independent bonds each earn ${D.g} with probability \(${fmtT(1 - D.p, 3)}\) and lose ${D.l} with probability \(p=${fmtT(D.p, 3)}\) (default). Let \(L_1\) and \(L_2\) be their losses; we work at the 95% level.
  <ol><li>Compute \(\text{VaR}_{0.95}(L_1)\).</li>
  <li>Give the distribution of \(L_1+L_2\), then \(\text{VaR}_{0.95}(L_1+L_2)\). Comment.</li>
  <li>Compute \(\text{CVaR}_{0.95}(L_1)\) and \(\text{CVaR}_{0.95}(L_1+L_2)\). Does subadditivity hold?</li></ol></div></li>
<li><div class="q-text"><strong>Gaussian case.</strong> We invest ${fmt(D.V, 0)}: a share \(${fmtT(D.w, 2)}\) in asset A and the rest in asset B. Over one year, their returns are Gaussian, with expectations ${fmtT(100 * D.muA, 0)}% and ${fmtT(100 * D.muB, 0)}%, standard deviations ${fmtT(100 * D.sA, 0)}% and ${fmtT(100 * D.sB, 0)}%, and correlation \(${fmtT(D.rho, 1)}\).
  <ol><li>Give the expectation and the standard deviation of the portfolio's annual loss \(L\).</li>
  <li>Compute \(\text{VaR}_{${fmtT(D.a3, 2)}}(L)\) and \(\text{CVaR}_{${fmtT(D.a3, 2)}}(L)\).</li>
  <li>Compute the VaR of each of the two positions taken alone and compare their sum with the VaR of the portfolio.</li></ol></div></li>
<li><div class="q-text"><strong>Minimising CVaR.</strong> Capital is split between assets A (weight \(w\)) and B (weight \(1-w\)), with \(0\le w\le 1\). Ten equally likely return scenarios are considered.
  ${d17t4(D, 'en')}
  <ol><li>Write the linear programme that minimises the \(\text{CVaR}_{0.8}\) of the loss, expressed as a percentage of capital.</li>
  <li>Compute the \(\text{CVaR}_{0.8}\) of the portfolios \(w=0\), \(w=0.5\) and \(w=1\).</li>
  <li>Check that the CVaR of the portfolio \(w=0.5\) is at most the average of the other two, and comment.</li></ol></div></li>
</ol></div>`;
};

function d17sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], a1 = fmtT(D.a1, 2), n = D.S;
  const exc = D.L1.filter(x => x > D.var1);
  const excSum = exc.reduce((s, x) => s + x - D.var1, 0);
  const sortedTxt = D.sorted.map(v => fmt(v, 0)).join(' ; ');
  const g = D.g, l = D.l, p = D.p, q = 1 - p;
  const cvTerms = D.L4.map(Ls => { const s = Ls.slice().sort((x, y) => y - x); return s.slice(0, 2); });
  const r = (x, d) => tex(x, d);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Les pertes rangées par ordre croissant sont :', 'The losses sorted in increasing order are:'])}</p>
  <p class="num" style="text-align:center">${sortedTxt}</p>
  <p>${T_(['Chaque perte a probabilité', 'Each loss has probability'])} \(1/${n}\) : ${T_(['la probabilité de ne pas dépasser la', 'the probability of not exceeding the'])} \(k\)-${T_(['ième plus petite perte est au moins', 'th smallest loss is at least'])} \(k/${n}\). ${T_(['On cherche le plus petit', 'We look for the smallest'])} \(k\) ${T_(['tel que', 'such that'])} \(k/${n}\ge ${a1}\), ${T_(['soit', 'that is'])} \(k=${D.rank}\) :
  \[\text{VaR}_{${a1}}=${r(D.var1, 0)}\]
  ${T_(['Avec probabilité au moins', 'With probability at least'])} ${fmtT(100 * D.a1, 0)} %, ${T_(['la perte ne dépasse pas', 'the loss does not exceed'])} ${fmt(D.var1, 0)}.</p>
  <p><strong>b.</strong> ${T_(['Seules les pertes supérieures à la VaR contribuent à', 'Only losses above the VaR contribute to'])} \(\mathbb{E}[(L-\text{VaR})^+]\) :
  \[\begin{aligned}\text{CVaR}_{${a1}}&amp;=\text{VaR}_{${a1}}+\frac{1}{1-${a1}}\,\mathbb{E}\big[(L-\text{VaR}_{${a1}})^+\big]\\&amp;=${r(D.var1, 0)}+\frac{1}{${tex(1 - D.a1, 2)}}\times\frac{${exc.map(x => '(' + r(x, 0) + '-' + (D.var1 < 0 ? '(' + r(D.var1, 0) + ')' : r(D.var1, 0)) + ')').join('+') || '0'}}{${n}}&amp;&amp;\text{${T_(['scénarios équiprobables', 'equally likely scenarios'])}}\\&amp;=${r(D.var1, 0)}+\frac{${r(excSum, 0)}}{${tex((1 - D.a1) * n, 0)}}=${r(D.cvar1, 2)}\end{aligned}\]</p>
  <p><strong>c.</strong> ${T_(['Les', 'The'])} ${D.k1} ${T_(['plus grandes pertes sont', 'largest losses are'])} ${D.worst.slice().reverse().map(v => fmt(v, 0)).join(T_([' et ', ' and ']))}, ${T_(['de moyenne', 'with average'])} \(${tex(D.worst.reduce((s, x) => s + x, 0) / D.k1, 2)}\) : ${T_(['on retrouve la CVaR. La VaR est le seuil que la perte ne dépasse que dans', 'this is the CVaR. VaR is the threshold that the loss exceeds only in'])} ${fmtT(100 * (1 - D.a1), 0)} % ${T_(['des cas ; la CVaR est la perte moyenne dans ces', 'of cases; CVaR is the average loss in these'])} ${fmtT(100 * (1 - D.a1), 0)} % ${T_(['les plus défavorables.', 'worst cases.'])}</p>
  <p class="check">${T_(['La CVaR est bien supérieure ou égale à la VaR', 'CVaR is indeed at least VaR'])} : \(${r(D.cvar1, 2)}\ge ${r(D.var1, 0)}\).</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['La perte', 'The loss'])} \(L_1\) ${T_(['vaut', 'equals'])} \(-${g}\) ${T_(['avec probabilité', 'with probability'])} \(${tex(q, 3)}\) ${T_(['et', 'and'])} \(${l}\) ${T_(['avec probabilité', 'with probability'])} \(${tex(p, 3)}\). ${T_(['Comme', 'Since'])} \(\mathbb{P}(L_1\le -${g})=${tex(q, 3)}\ge 0.95\) :
  \[\text{VaR}_{0.95}(L_1)=-${g}\]
  ${T_(['Le défaut est trop rare pour apparaître dans la VaR.', 'Default is too rare to show up in the VaR.'])}</p>
  <p><strong>b.</strong> ${T_(['Par indépendance, la perte totale prend trois valeurs :', 'By independence, the total loss takes three values:'])}
  \[\begin{aligned}\mathbb{P}(L_1+L_2=-${2 * g})&amp;=${tex(q, 3)}^2=${tex(q * q, 6)}&amp;&amp;\text{${T_(['aucun défaut', 'no default'])}}\\\mathbb{P}(L_1+L_2=${l - g})&amp;=2\times ${tex(p, 3)}\times ${tex(q, 3)}=${tex(2 * p * q, 6)}&amp;&amp;\text{${T_(['un seul défaut', 'exactly one default'])}}\\\mathbb{P}(L_1+L_2=${2 * l})&amp;=${tex(p, 3)}^2=${tex(p * p, 6)}&amp;&amp;\text{${T_(['deux défauts', 'two defaults'])}}\end{aligned}\]
  ${T_(['Comme', 'Since'])} \(\mathbb{P}(L_1+L_2\le -${2 * g})=${tex(q * q, 4)}&lt;0.95\) ${T_(['et', 'and'])} \(\mathbb{P}(L_1+L_2\le ${l - g})=${tex(1 - p * p, 4)}\ge 0.95\) :
  \[\text{VaR}_{0.95}(L_1+L_2)=${l - g}\ &gt;\ \text{VaR}_{0.95}(L_1)+\text{VaR}_{0.95}(L_2)=-${2 * g}\]
  ${T_(['La VaR du portefeuille diversifié dépasse la somme des VaR : la VaR n\'est pas sous-additive. Pour une obligation, le défaut est un événement de probabilité', 'The VaR of the diversified portfolio exceeds the sum of the VaRs: VaR is not subadditive. For one bond, default has probability'])} \(${tex(p, 3)}&lt;5\,\%\) ; ${T_(['pour deux, au moins un défaut a probabilité', 'for two, at least one default has probability'])} \(${tex(1 - q * q, 4)}&gt;5\,\%\).</p>
  <p><strong>c.</strong> ${T_(['Avec la formule de Rockafellar et Uryasev :', 'With the Rockafellar-Uryasev formula:'])}
  \[\begin{aligned}\text{CVaR}_{0.95}(L_1)&amp;=-${g}+\frac{${tex(p, 3)}\times(${l}+${g})}{0.05}=${tex(D.c1, 2)}\\\text{CVaR}_{0.95}(L_1+L_2)&amp;=${l - g}+\frac{${tex(p * p, 6)}\times(${2 * l}-${l - g})}{0.05}=${tex(D.c2, 2)}\end{aligned}\]
  ${T_(['On a', 'We have'])} \(${tex(D.c2, 2)}\le 2\times ${tex(D.c1, 2)}=${tex(2 * D.c1, 2)}\) : ${T_(['la CVaR respecte la sous-additivité, comme toute mesure cohérente. Elle voit la perte de', 'CVaR satisfies subadditivity, like any coherent measure. It sees the loss of'])} ${l} ${T_(['dans la queue de chaque obligation, alors que la VaR l\'ignorait.', 'in the tail of each bond, whereas VaR ignored it.'])}</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Le rendement du portefeuille est', 'The portfolio return is'])} \(R_p=${tex(D.w, 2)}\,R_A+${tex(1 - D.w, 2)}\,R_B\), ${T_(['gaussien comme combinaison linéaire de variables gaussiennes conjointes', 'Gaussian as a linear combination of jointly Gaussian variables'])} :
  \[\begin{aligned}\mathbb{E}[R_p]&amp;=${tex(D.w, 2)}\times ${tex(D.muA, 2)}+${tex(1 - D.w, 2)}\times ${tex(D.muB, 2)}=${tex(D.mup, 4)}&amp;&amp;\text{${T_(['linéarité de l\'espérance', 'linearity of expectation'])}}\\\text{Var}(R_p)&amp;=${tex(D.w, 2)}^2\times ${tex(D.sA, 2)}^2+${tex(1 - D.w, 2)}^2\times ${tex(D.sB, 2)}^2+2\times ${tex(D.w, 2)}\times ${tex(1 - D.w, 2)}\times ${D.rho < 0 ? '(' + tex(D.rho, 1) + ')' : tex(D.rho, 1)}\times ${tex(D.sA, 2)}\times ${tex(D.sB, 2)}=${tex(D.vp, 6)}&amp;&amp;\text{${T_(['variance d\'une somme', 'variance of a sum'])}}\end{aligned}\]
  ${T_(['La perte est', 'The loss is'])} \(L=-${fmt(D.V, 0)}\,R_p\), ${T_(['d\'où', 'hence'])} \(\mu_L=${tex(D.muL, 2)}\) ${T_(['et', 'and'])} \(\sigma_L=${fmt(D.V, 0)}\times\sqrt{${tex(D.vp, 6)}}=${tex(D.sL, 2)}\).</p>
  <p><strong>b.</strong> ${T_(['Avec', 'With'])} \(z_{${fmtT(D.a3, 2)}}=${tex(D.z, 4)}\) ${T_(['et', 'and'])} \(\varphi(z)/(1-\alpha)=${tex(D.kc, 4)}\) :
  \[\begin{aligned}\text{VaR}_{${fmtT(D.a3, 2)}}(L)&amp;=\mu_L+z\,\sigma_L=${tex(D.muL, 2)}+${tex(D.z, 4)}\times ${tex(D.sL, 2)}=${tex(D.VaR3, 2)}\\\text{CVaR}_{${fmtT(D.a3, 2)}}(L)&amp;=\mu_L+\frac{\varphi(z)}{1-\alpha}\,\sigma_L=${tex(D.muL, 2)}+${tex(D.kc, 4)}\times ${tex(D.sL, 2)}=${tex(D.CVaR3, 2)}\end{aligned}\]</p>
  <p><strong>c.</strong> ${T_(['Chaque position isolée a une perte gaussienne d\'espérance', 'Each position on its own has a Gaussian loss with expectation'])} \(-V w_i\mu_i\) ${T_(['et d\'écart-type', 'and standard deviation'])} \(V w_i\sigma_i\) :
  \[\begin{aligned}\text{VaR}(A)&amp;=-${tex(D.V * D.w, 0)}\times ${tex(D.muA, 2)}+${tex(D.z, 4)}\times ${tex(D.V * D.w, 0)}\times ${tex(D.sA, 2)}=${tex(D.VaRA, 2)}\\\text{VaR}(B)&amp;=-${tex(D.V * (1 - D.w), 0)}\times ${tex(D.muB, 2)}+${tex(D.z, 4)}\times ${tex(D.V * (1 - D.w), 0)}\times ${tex(D.sB, 2)}=${tex(D.VaRB, 2)}\end{aligned}\]
  ${T_(['Leur somme', 'Their sum'])} \(${tex(D.VaRA + D.VaRB, 2)}\) ${T_(['dépasse la VaR du portefeuille', 'exceeds the portfolio VaR'])}, \(${tex(D.VaR3, 2)}\). ${T_(['Dans le cas gaussien, la VaR est sous-additive : les espérances s\'ajoutent, et l\'écart-type du portefeuille est au plus la somme des écarts-types, avec égalité seulement si la corrélation vaut 1. Le gain de diversification vaut ici', 'In the Gaussian case, VaR is subadditive: expectations add up, and the portfolio standard deviation is at most the sum of the standard deviations, with equality only if the correlation is 1. The diversification benefit here is'])} \(${tex(D.VaRA + D.VaRB - D.VaR3, 2)}\).</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Dans le scénario', 'In scenario'])} \(s\), ${T_(['la perte en pourcentage est', 'the loss in percent is'])} \(L_s(w)=-\big(w\,r_{A,s}+(1-w)\,r_{B,s}\big)\). ${T_(['Avec', 'With'])} \(p_s=1/10\) ${T_(['et', 'and'])} \(1-\alpha=0.2\), ${T_(['le programme de Rockafellar et Uryasev s\'écrit :', 'the Rockafellar-Uryasev programme reads:'])}
  \[\begin{aligned}\min_{w,\,c,\,u_1,\ldots,u_{10}}\ &amp;\ c+\frac{1}{0.2}\times\frac{1}{10}\sum_{s=1}^{10}u_s=c+\frac{1}{2}\sum_{s=1}^{10}u_s\\\text{${T_(['sous', 's.t.'])} }&amp;\ u_s\ge -w\,r_{A,s}-(1-w)\,r_{B,s}-c,\qquad u_s\ge 0,\qquad s=1,\ldots,10\\&amp;\ 0\le w\le 1\end{aligned}\]</p>
  <p><strong>b.</strong> ${T_(['Avec dix scénarios équiprobables et', 'With ten equally likely scenarios and'])} \(1-\alpha=0.2\), ${T_(['la CVaR est la moyenne des deux plus grandes pertes', 'CVaR is the average of the two largest losses'])} :
  \[\begin{aligned}\text{CVaR}(w=0)&amp;=\frac{${r(cvTerms[0][0], 1)}+${r(cvTerms[0][1], 1)}}{2}=${r(D.cv[0], 2)}\\\text{CVaR}(w=0.5)&amp;=\frac{${r(cvTerms[1][0], 1)}+${r(cvTerms[1][1], 1)}}{2}=${r(D.cv[1], 2)}\\\text{CVaR}(w=1)&amp;=\frac{${r(cvTerms[2][0], 1)}+${r(cvTerms[2][1], 1)}}{2}=${r(D.cv[2], 2)}\end{aligned}\]
  ${T_(['Les pertes du portefeuille', 'The losses of the portfolio'])} \(w=0.5\) ${T_(['sont les moyennes des pertes des deux actifs, scénario par scénario ; ses deux pires scénarios ne sont pas nécessairement ceux de A ou de B.', 'are the averages of the losses of the two assets, scenario by scenario; its two worst scenarios are not necessarily those of A or of B.'])}</p>
  <p><strong>c.</strong> \(${r(D.cv[1], 2)}\le\frac{${r(D.cv[0], 2)}+${r(D.cv[2], 2)}}{2}=${r((D.cv[0] + D.cv[2]) / 2, 2)}\) : ${T_(['c\'est la convexité de la CVaR, conséquence de son homogénéité et de sa sous-additivité. Ici, le portefeuille mélangé a même une CVaR plus faible que chacun des deux actifs : les pires scénarios de A et de B ne coïncident pas, et la diversification réduit la perte moyenne dans la queue. Le programme linéaire de la question a trouverait le poids', 'this is the convexity of CVaR, a consequence of its homogeneity and subadditivity. Here, the mixed portfolio even has a lower CVaR than each of the two assets: the worst scenarios of A and B do not coincide, and diversification reduces the average loss in the tail. The linear programme of question a would find the weight'])} \(w\) ${T_(['qui la rend minimale.', 'that makes it smallest.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d17sol(D, 'fr');
I18N.en.sol = D => d17sol(D, 'en');
