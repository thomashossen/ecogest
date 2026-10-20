/* ============================================================
   PAGE mf18 — Optimisation robuste et regret
   ============================================================ */
I18N.fr.k = {
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié',
  'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 18 – Optimisation robuste et regret', 'k-h1': 'Optimisation robuste et regret',
  'k-coursetitle': 'Décider quand les paramètres sont incertains : ensembles d\'incertitude, pire cas et regret', 'k-extitle': 'Critères de décision, Markowitz robuste et regret sous erreur de suivi', 'k-soltitle': 'Critères de décision, Markowitz robuste et regret sous erreur de suivi'
};
I18N.en.k = {
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied',
  'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 18 – Robust optimisation and regret', 'k-h1': 'Robust optimisation and regret',
  'k-coursetitle': 'Deciding when parameters are uncertain: uncertainty sets, worst case and regret', 'k-extitle': 'Decision criteria, robust Markowitz and regret under a tracking-error limit', 'k-soltitle': 'Decision criteria, robust Markowitz and regret under a tracking-error limit'
};

const GREY = '#8a857a';
/* ---------- outils ---------- */
/* minimax du regret pour deux actifs sous contrainte d'erreur de suivi, benchmark 50/50 */
function d18te(s1, s2, rho, tau, mus) {
  const sd = Math.sqrt(s1 * s1 + s2 * s2 - 2 * rho * s1 * s2), h = tau / sd;
  const lo = Math.max(0, 0.5 - h), hi = Math.min(1, 0.5 + h);
  const val = (m, w) => m[0] * w + m[1] * (1 - w);
  const zs = mus.map(m => Math.max(val(m, lo), val(m, hi)));
  const wopt = mus.map(m => val(m, lo) >= val(m, hi) ? lo : hi);
  const reg = (k, w) => zs[k] - val(mus[k], w), maxr = w => Math.max(...mus.map((m, k) => reg(k, w)));
  const cand = [lo, hi];
  for (let a = 0; a < mus.length; a++) for (let b = a + 1; b < mus.length; b++) {
    const sa = mus[a][0] - mus[a][1], sb = mus[b][0] - mus[b][1];
    if (Math.abs(sa - sb) < 1e-12) continue;
    /* zs[a] - mus[a][1] - sa w = zs[b] - mus[b][1] - sb w */
    const w = ((zs[a] - mus[a][1]) - (zs[b] - mus[b][1])) / (sa - sb);
    if (w > lo - 1e-12 && w < hi + 1e-12) cand.push(w);
  }
  let best = cand[0]; cand.forEach(w => { if (maxr(w) < maxr(best) - 1e-12) best = w; });
  return { sd: sd, lo: lo, hi: hi, zs: zs, wopt: wopt, w: best, r: maxr(best), reg: reg, maxr: maxr, val: val };
}
const D18_MU = [[6, 4], [5.5, 5], [4.5, 5.5]];
/* Markowitz à deux actifs : maximise mu1 w + mu2 (1-w) - lam * variance, w dans [0, 1] */
function d18mk(m1, m2, s1, s2, rho, lam) {
  const den = 2 * (s1 * s1 + s2 * s2 - 2 * rho * s1 * s2);
  const w = ((m1 - m2) / lam + 2 * s2 * s2 - 2 * rho * s1 * s2) / den;
  return Math.max(0, Math.min(1, w));
}
function d18f(w, m1, m2, s1, s2, rho, lam) { return m1 * w + m2 * (1 - w) - lam * (w * w * s1 * s1 + (1 - w) * (1 - w) * s2 * s2 + 2 * w * (1 - w) * rho * s1 * s2); }

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez décrire l'incertitude sur les paramètres d'un problème d'optimisation par un ensemble, écrire la contrepartie robuste d'une contrainte linéaire, choisir une décision par le critère du pire cas ou par celui du regret, et appliquer ces idées à la sélection de portefeuille.<br><br>
<strong>Pourquoi en finance ?</strong> Rendements espérés et covariances sont estimés, souvent avec beaucoup d'erreur. Un optimiseur exploite ces erreurs : il concentre le portefeuille sur les actifs dont le rendement a été surestimé. L'optimisation robuste cherche des décisions qui restent bonnes pour toutes les valeurs plausibles des paramètres.<br><br>
<strong>Prérequis.</strong> Programmation linéaire (page 15), modèle de Markowitz, variance d'une combinaison linéaire.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Pourquoi</a> · <a href="#s2">2. Ensembles d'incertitude</a> · <a href="#s3">3. Contraintes robustes</a> · <a href="#s4">4. Pire cas et regret</a> · <a href="#s5">5. Markowitz robuste</a> · <a href="#s6">6. Regret et erreur de suivi</a> · <a href="#s7">7. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Pourquoi l'optimisation robuste ?</div>
<p>Un problème d'optimisation dépend de paramètres \(p\) : rendements, coûts, covariances. La solution <em>nominale</em> résout \(\max_{x\in X}f(x,\hat p)\), où \(\hat p\) est une estimation. Si la vraie valeur diffère de \(\hat p\), la solution nominale peut être mauvaise, voire irréalisable. On suppose seulement que \(p\) appartient à un <em>ensemble d'incertitude</em> \(\mathcal{U}\), et l'on cherche une décision qui se comporte bien pour tout \(p\in\mathcal{U}\). Chaque façon de décrire \(\mathcal{U}\) et chaque notion de « bien se comporter » donne une formulation robuste différente.</p>

<div class="dossier-title" id="s2">2. Décrire l'incertitude</div>
<ul class="kit-simple">
<li><em>Scénarios</em> : \(\mathcal{U}=\{p^1,\ldots,p^K\}\), quelques situations jugées plausibles.</li>
<li><em>Boîte</em> : \(\underline{p}\le p\le\overline{p}\), un intervalle pour chaque paramètre. Elle autorise toutes les combinaisons d'extrêmes, y compris les plus improbables.</li>
<li><em>Ellipsoïde</em> : \(p=p^0+M\,u\) avec \(\|u\|\le 1\). Chaque paramètre peut s'écarter beaucoup de \(p^0\), mais pas tous en même temps dans le sens le plus défavorable.</li>
</ul>
<p>Le choix de \(\mathcal{U}\) fait partie du modèle : sa forme traduit la structure de l'incertitude, sa taille le degré de protection souhaité. Une boîte trop grande rend la décision très prudente ; un ensemble trop petit ne protège de rien.</p>

<div class="dossier-title" id="s3">3. Contraintes robustes</div>
<p>Une contrainte est <em>robuste</em> si elle est satisfaite pour toute valeur du paramètre dans \(\mathcal{U}\). Pour une contrainte linéaire \(a^Tx\le b\) dont le vecteur \(a\) est incertain, il suffit de considérer le pire \(a\) :
\[a^Tx\le b\quad\text{pour tout } a\in\mathcal{U}\qquad\iff\qquad\max_{a\in\mathcal{U}}a^Tx\le b\]
Si \(a\) appartient à la boîte \(\bar a-\delta\le a\le\bar a+\delta\) et que \(x\ge 0\), le pire cas est \(a=\bar a+\delta\), et la contrainte robuste reste linéaire : \((\bar a+\delta)^Tx\le b\). Si \(a=\bar a+\delta\,u\) avec \(\|u\|\le 1\), l'inégalité de Cauchy-Schwarz donne \(\max_{\|u\|\le1}u^Tx=\|x\|\), et la contrainte robuste devient :
\[\bar a^Tx+\delta\,\|x\|\le b\]
C'est une contrainte conique, qu'un solveur traite efficacement. Dans les deux cas, l'ensemble réalisable robuste est l'intersection des ensembles réalisables de tous les scénarios.</p>
<div class="ifig" data-fig="set"></div>
<div class="fig-cap">Figure 1 — Ensemble réalisable de la contrainte \(a_1x_1+a_2x_2\le 1\), \(x\ge 0\), pour \(\bar a=(1,\,0.8)\). Les droites grises correspondent à quelques valeurs de \(a\) dans l'ensemble d'incertitude ; la zone colorée est l'ensemble robuste, la droite pointillée la contrainte nominale. Avec une boîte, le pire cas pousse les deux coefficients au maximum en même temps : l'ensemble robuste est plus petit qu'avec un disque de même rayon.</div>

<div class="dossier-title" id="s4">4. Pire cas et regret</div>
<p>Quand c'est l'objectif qui est incertain, la robustesse <em>absolue</em> choisit la décision dont la pire performance est la meilleure. Pour un coût à minimiser, \(\min_{x\in X}\max_{p\in\mathcal{U}}f(x,p)\) ; pour un gain à maximiser, \(\max_{x}\min_{p}f(x,p)\). La robustesse <em>relative</em> protège contre le fait de faire beaucoup moins bien que ce qu'on aurait pu faire en connaissant \(p\). On définit le <em>regret</em> d'une décision \(x\) dans le scénario \(p\), pour un gain à maximiser :
\[r(x,p)=z^*(p)-f(x,p)\qquad\text{où}\qquad z^*(p)=\max_{y\in X}f(y,p)\]
puis l'on minimise le regret maximal, \(\min_{x}\max_{p}r(x,p)\). Exemple des diapositives : deux décisions, cinq scénarios, regrets
\(x_1\) : 0, 1, 0, 1, 10 et \(x_2\) : 4, 5, 5, 4, 5. Le critère du regret maximal choisit \(x_2\) (5 contre 10), alors que \(x_1\) a un regret moyen bien plus faible (2.4 contre 4.6). Les critères robustes protègent contre le scénario défavorable, au prix d'une moins bonne performance moyenne.</p>

<div class="dossier-title" id="s5">5. Markowitz robuste</div>
<p>Le modèle de Markowitz maximise \(\mu^Tx-\lambda\,x^T\Sigma x\) sous \(e^Tx=1\), \(x\ge 0\). Si l'on sait seulement que \(\mu^L\le\mu\le\mu^U\) et \(\Sigma^L\le\Sigma\le\Sigma^U\) composante par composante, la formulation robuste absolue maximise le pire objectif :
\[\max_{x\ge 0,\ e^Tx=1}\ \min_{\mu,\,\Sigma}\ \mu^Tx-\lambda\,x^T\Sigma x\]
Comme \(x\ge 0\), \(\mu^Tx\) est le plus petit pour \(\mu=\mu^L\), et \(x^T\Sigma x=\sum_{i,j}\sigma_{ij}x_ix_j\) est le plus grand pour \(\Sigma=\Sigma^U\), chaque produit \(x_ix_j\) étant positif. Le problème robuste est donc un problème de Markowitz ordinaire, avec les rendements les plus bas et les covariances les plus hautes :
\[\max_{x\ge 0,\ e^Tx=1}\ (\mu^L)^Tx-\lambda\,x^T\Sigma^Ux\]
Il faut seulement vérifier que \(\Sigma^U\) est bien une matrice de covariance, c'est-à-dire semi-définie positive.</p>

<div class="dossier-title" id="s6">6. Regret et erreur de suivi</div>
<p>Un gérant suit un indice de référence qui investit 50 % dans chacun de deux actifs. Il peut s'en écarter, mais l'<em>erreur de suivi</em>, écart-type de la différence de rendement avec la référence, doit rester sous \(\tau\) :
\[\text{TE}(x)=\sqrt{(x-x^B)^T\,\Sigma\,(x-x^B)}\le\tau\]
Avec deux actifs, \(x=(w,1-w)\) et \(x^B=(0.5,0.5)\), donc \(x-x^B=(w-0.5)\,(1,-1)\) et \(\text{TE}(w)=|w-0.5|\,\sigma_d\), où \(\sigma_d^2=\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2\) est la variance de la différence des deux rendements. La contrainte délimite un intervalle de poids admissibles. Les diapositives retiennent \(\sigma_1=0.42\), \(\sigma_2=0.33\), \(\rho=0.7\) et \(\tau=10\) %, d'où \(\sigma_d\approx 0.302\) et \(w\in[0.169\,;\,0.831]\), et trois scénarios de rendements espérés : (6, 4), (5.5, 5) et (4.5, 5.5), en %. Les meilleurs rendements possibles sont \(z_1^*\approx 5.662\), \(z_2^*\approx 5.416\) et \(z_3^*\approx 5.331\). Le regret maximal se minimise en introduisant une variable \(t\) qui majore les trois regrets :
\[\min_{w,\,t}\ t\qquad\text{sous}\qquad z_k^*-\big(\mu_{k,1}w+\mu_{k,2}(1-w)\big)\le t,\quad k=1,2,3,\qquad \text{TE}(w)\le\tau\]
Le regret du scénario 1 décroît avec \(w\), celui du scénario 3 croît : l'optimum est à leur intersection, \(w\approx 0.610\), pour un regret maximal d'environ 0.441 point de rendement.</p>
<div class="ifig" data-fig="regret"></div>
<div class="fig-cap">Figure 2 — Les regrets des trois scénarios en fonction du poids \(w\) du premier actif, sur l'intervalle autorisé par l'erreur de suivi (zone claire). Le regret maximal est l'enveloppe supérieure (trait épais) ; son minimum est la décision robuste. Augmentez \(\tau\) : l'intervalle s'élargit, les meilleurs rendements \(z_k^*\) augmentent et les regrets aussi, car on se compare à de meilleures décisions possibles.</div>

<div class="dossier-title" id="s7">7. À retenir</div>
<ul class="kit-simple">
<li>On décrit l'incertitude par un ensemble \(\mathcal{U}\) : scénarios, boîte ou ellipsoïde ; sa forme et sa taille font partie du modèle.</li>
<li>Une contrainte linéaire robuste se ramène à son pire cas : \((\bar a+\delta)^Tx\le b\) pour une boîte et \(x\ge 0\), \(\bar a^Tx+\delta\|x\|\le b\) pour une boule.</li>
<li>Pire cas : la meilleure performance garantie ; regret : le plus petit écart garanti à la meilleure décision a posteriori. Les deux se ramènent à un problème classique en introduisant une variable \(t\).</li>
<li>Markowitz robuste avec boîte et \(x\ge0\) : on remplace \(\mu\) par \(\mu^L\) et \(\Sigma\) par \(\Sigma^U\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can describe the uncertainty on the parameters of an optimisation problem by a set, write the robust counterpart of a linear constraint, choose a decision by the worst-case criterion or by the regret criterion, and apply these ideas to portfolio selection.<br><br>
<strong>Why in finance?</strong> Expected returns and covariances are estimated, often with large errors. An optimiser exploits these errors: it concentrates the portfolio on the assets whose return has been overestimated. Robust optimisation looks for decisions that remain good for all plausible values of the parameters.<br><br>
<strong>Prerequisites.</strong> Linear programming (page 15), the Markowitz model, variance of a linear combination.
</div>
<p class="toc">Contents: <a href="#s1">1. Why</a> · <a href="#s2">2. Uncertainty sets</a> · <a href="#s3">3. Robust constraints</a> · <a href="#s4">4. Worst case and regret</a> · <a href="#s5">5. Robust Markowitz</a> · <a href="#s6">6. Regret and tracking error</a> · <a href="#s7">7. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Why robust optimisation?</div>
<p>An optimisation problem depends on parameters \(p\): returns, costs, covariances. The <em>nominal</em> solution solves \(\max_{x\in X}f(x,\hat p)\), where \(\hat p\) is an estimate. If the true value differs from \(\hat p\), the nominal solution may be poor, or even infeasible. We only assume that \(p\) belongs to an <em>uncertainty set</em> \(\mathcal{U}\), and look for a decision that behaves well for every \(p\in\mathcal{U}\). Each way of describing \(\mathcal{U}\) and each notion of "behaving well" gives a different robust formulation.</p>

<div class="dossier-title" id="s2">2. Describing uncertainty</div>
<ul class="kit-simple">
<li><em>Scenarios</em>: \(\mathcal{U}=\{p^1,\ldots,p^K\}\), a few situations deemed plausible.</li>
<li><em>Box</em>: \(\underline{p}\le p\le\overline{p}\), an interval for each parameter. It allows every combination of extremes, including the most unlikely ones.</li>
<li><em>Ellipsoid</em>: \(p=p^0+M\,u\) with \(\|u\|\le 1\). Each parameter may move far from \(p^0\), but not all of them at once in the most unfavourable direction.</li>
</ul>
<p>Choosing \(\mathcal{U}\) is part of the model: its shape reflects the structure of the uncertainty, its size the desired degree of protection. A box that is too large makes the decision very cautious; a set that is too small protects against nothing.</p>

<div class="dossier-title" id="s3">3. Robust constraints</div>
<p>A constraint is <em>robust</em> if it holds for every value of the parameter in \(\mathcal{U}\). For a linear constraint \(a^Tx\le b\) whose vector \(a\) is uncertain, it suffices to consider the worst \(a\):
\[a^Tx\le b\quad\text{for every } a\in\mathcal{U}\qquad\iff\qquad\max_{a\in\mathcal{U}}a^Tx\le b\]
If \(a\) belongs to the box \(\bar a-\delta\le a\le\bar a+\delta\) and \(x\ge 0\), the worst case is \(a=\bar a+\delta\), and the robust constraint remains linear: \((\bar a+\delta)^Tx\le b\). If \(a=\bar a+\delta\,u\) with \(\|u\|\le 1\), the Cauchy-Schwarz inequality gives \(\max_{\|u\|\le1}u^Tx=\|x\|\), and the robust constraint becomes:
\[\bar a^Tx+\delta\,\|x\|\le b\]
This is a conic constraint, which solvers handle efficiently. In both cases, the robust feasible set is the intersection of the feasible sets of all scenarios.</p>
<div class="ifig" data-fig="set"></div>
<div class="fig-cap">Figure 1 — Feasible set of the constraint \(a_1x_1+a_2x_2\le 1\), \(x\ge 0\), for \(\bar a=(1,\,0.8)\). The grey lines correspond to a few values of \(a\) in the uncertainty set; the shaded area is the robust set, the dashed line the nominal constraint. With a box, the worst case pushes both coefficients to their maximum at once: the robust set is smaller than with a disc of the same radius.</div>

<div class="dossier-title" id="s4">4. Worst case and regret</div>
<p>When the objective is uncertain, <em>absolute</em> robustness chooses the decision whose worst performance is best. For a cost to minimise, \(\min_{x\in X}\max_{p\in\mathcal{U}}f(x,p)\); for a gain to maximise, \(\max_{x}\min_{p}f(x,p)\). <em>Relative</em> robustness protects against doing much worse than what could have been done knowing \(p\). The <em>regret</em> of a decision \(x\) in scenario \(p\), for a gain to maximise, is:
\[r(x,p)=z^*(p)-f(x,p)\qquad\text{where}\qquad z^*(p)=\max_{y\in X}f(y,p)\]
and we minimise the maximum regret, \(\min_{x}\max_{p}r(x,p)\). Example from the slides: two decisions, five scenarios, regrets
\(x_1\): 0, 1, 0, 1, 10 and \(x_2\): 4, 5, 5, 4, 5. The maximum-regret criterion chooses \(x_2\) (5 against 10), whereas \(x_1\) has a much lower average regret (2.4 against 4.6). Robust criteria protect against the unfavourable scenario, at the price of a weaker average performance.</p>

<div class="dossier-title" id="s5">5. Robust Markowitz</div>
<p>The Markowitz model maximises \(\mu^Tx-\lambda\,x^T\Sigma x\) subject to \(e^Tx=1\), \(x\ge 0\). If we only know that \(\mu^L\le\mu\le\mu^U\) and \(\Sigma^L\le\Sigma\le\Sigma^U\) entrywise, the absolute robust formulation maximises the worst objective:
\[\max_{x\ge 0,\ e^Tx=1}\ \min_{\mu,\,\Sigma}\ \mu^Tx-\lambda\,x^T\Sigma x\]
Since \(x\ge 0\), \(\mu^Tx\) is smallest for \(\mu=\mu^L\), and \(x^T\Sigma x=\sum_{i,j}\sigma_{ij}x_ix_j\) is largest for \(\Sigma=\Sigma^U\), each product \(x_ix_j\) being non-negative. The robust problem is therefore an ordinary Markowitz problem, with the lowest returns and the highest covariances:
\[\max_{x\ge 0,\ e^Tx=1}\ (\mu^L)^Tx-\lambda\,x^T\Sigma^Ux\]
One only needs to check that \(\Sigma^U\) is indeed a covariance matrix, that is, positive semi-definite.</p>

<div class="dossier-title" id="s6">6. Regret and tracking error</div>
<p>A manager follows a benchmark that invests 50% in each of two assets. He may deviate from it, but the <em>tracking error</em>, the standard deviation of the return difference with the benchmark, must stay below \(\tau\):
\[\text{TE}(x)=\sqrt{(x-x^B)^T\,\Sigma\,(x-x^B)}\le\tau\]
With two assets, \(x=(w,1-w)\) and \(x^B=(0.5,0.5)\), so \(x-x^B=(w-0.5)\,(1,-1)\) and \(\text{TE}(w)=|w-0.5|\,\sigma_d\), where \(\sigma_d^2=\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2\) is the variance of the difference of the two returns. The constraint defines an interval of admissible weights. The slides use \(\sigma_1=0.42\), \(\sigma_2=0.33\), \(\rho=0.7\) and \(\tau=10\)%, hence \(\sigma_d\approx 0.302\) and \(w\in[0.169,\,0.831]\), and three scenarios of expected returns: (6, 4), (5.5, 5) and (4.5, 5.5), in %. The best achievable returns are \(z_1^*\approx 5.662\), \(z_2^*\approx 5.416\) and \(z_3^*\approx 5.331\). The maximum regret is minimised by introducing a variable \(t\) that bounds the three regrets:
\[\min_{w,\,t}\ t\qquad\text{s.t.}\qquad z_k^*-\big(\mu_{k,1}w+\mu_{k,2}(1-w)\big)\le t,\quad k=1,2,3,\qquad \text{TE}(w)\le\tau\]
The regret of scenario 1 decreases with \(w\), that of scenario 3 increases: the optimum is at their intersection, \(w\approx 0.610\), for a maximum regret of about 0.441 percentage point.</p>
<div class="ifig" data-fig="regret"></div>
<div class="fig-cap">Figure 2 — The regrets of the three scenarios as a function of the weight \(w\) of the first asset, over the interval allowed by the tracking error (light area). The maximum regret is the upper envelope (thick line); its minimum is the robust decision. Increase \(\tau\): the interval widens, the best returns \(z_k^*\) rise and so do the regrets, since we compare ourselves with better possible decisions.</div>

<div class="dossier-title" id="s7">7. Key points</div>
<ul class="kit-simple">
<li>Uncertainty is described by a set \(\mathcal{U}\): scenarios, box or ellipsoid; its shape and size are part of the model.</li>
<li>A robust linear constraint reduces to its worst case: \((\bar a+\delta)^Tx\le b\) for a box and \(x\ge 0\), \(\bar a^Tx+\delta\|x\|\le b\) for a ball.</li>
<li>Worst case: the best guaranteed performance; regret: the smallest guaranteed gap to the best decision in hindsight. Both reduce to a standard problem by introducing a variable \(t\).</li>
<li>Robust Markowitz with a box and \(x\ge0\): replace \(\mu\) by \(\mu^L\) and \(\Sigma\) by \(\Sigma^U\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  shape: 'Ensemble d\'incertitude', box: 'boîte', ball: 'disque', d: 'Taille δ', setAria: 'Ensemble réalisable nominal et robuste d\'une contrainte linéaire incertaine', rob: 'ensemble robuste', nom: 'contrainte nominale',
  setRead: (r) => `Aire de l'ensemble robuste : <span class="v">${fmt(100 * r, 1)} %</span> de l'aire de l'ensemble nominal.`,
  tau: 'Limite d\'erreur de suivi τ', rho: 'Corrélation ρ', w: 'poids w du premier actif', reg: 'regret', env: 'regret maximal', regAria: 'Regrets des trois scénarios et regret maximal en fonction du poids',
  regRead: (R) => `Poids admissibles : [<span class="v">${fmt(R.lo, 3)}</span> ; <span class="v">${fmt(R.hi, 3)}</span>] &nbsp;·&nbsp; z* = ${R.zs.map(z => `<span class="v">${fmt(z, 3)}</span>`).join(' ; ')}<br>Décision robuste : <i>w</i> = <span class="v">${fmt(R.w, 3)}</span>, regret maximal <span class="v">${fmt(R.r, 3)}</span>`
};
I18N.en.f = {
  shape: 'Uncertainty set', box: 'box', ball: 'disc', d: 'Size δ', setAria: 'Nominal and robust feasible sets of an uncertain linear constraint', rob: 'robust set', nom: 'nominal constraint',
  setRead: (r) => `Area of the robust set: <span class="v">${fmt(100 * r, 1)}%</span> of the area of the nominal set.`,
  tau: 'Tracking-error limit τ', rho: 'Correlation ρ', w: 'weight w of the first asset', reg: 'regret', env: 'maximum regret', regAria: 'Regrets of the three scenarios and maximum regret as a function of the weight',
  regRead: (R) => `Admissible weights: [<span class="v">${fmt(R.lo, 3)}</span>, <span class="v">${fmt(R.hi, 3)}</span>] &nbsp;·&nbsp; z* = ${R.zs.map(z => `<span class="v">${fmt(z, 3)}</span>`).join(', ')}<br>Robust decision: <i>w</i> = <span class="v">${fmt(R.w, 3)}</span>, maximum regret <span class="v">${fmt(R.r, 3)}</span>`
};
FIGS.set = {
  state: { shape: 'box', d: 0.2 },
  controls: L => [
    { key: 'shape', type: 'select', label: L.f.shape, options: [{ v: 'box', t: L.f.box }, { v: 'ball', t: L.f.ball }] },
    { key: 'd', label: L.f.d, min: 0, max: 0.5, step: 0.05, fmt: v => fmtT(v, 2) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = [1, 0.8], d = s.d;
    const G = Plot({ w: 520, h: 420, x0: 0, x1: 1.5, y0: 0, y1: 1.5, mt: 26, mb: 42, ml: 46 });
    G.axes({ xt: [0, 0.5, 1, 1.5], yt: [0, 0.5, 1, 1.5], xl: 'x₁', yl: 'x₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
    G.clip();
    /* frontière robuste : pour chaque direction u, t* = 1 / max_a a.u */
    const pts = [[0, 0]], n = 90;
    for (let k = 0; k <= n; k++) {
      const th = Math.PI / 2 * k / n, u = [Math.cos(th), Math.sin(th)];
      const m = s.shape === 'box' ? (a[0] + d) * u[0] + (a[1] + d) * u[1] : a[0] * u[0] + a[1] * u[1] + d;
      pts.push([u[0] / m, u[1] / m]);
    }
    G.add(`<path d="${G.pts(pts)} Z" fill="${COL.s1}" fill-opacity="0.2" stroke="${COL.s1}" stroke-width="2"/>`);
    /* quelques contraintes de l'ensemble d'incertitude */
    const samp = [];
    if (s.shape === 'box') { [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, 1], [1, 0], [-1, 0], [0, -1]].forEach(e => samp.push([a[0] + e[0] * d, a[1] + e[1] * d])); }
    else { for (let k = 0; k < 10; k++) { const t = 2 * Math.PI * k / 10; samp.push([a[0] + d * Math.cos(t), a[1] + d * Math.sin(t)]); } }
    samp.forEach(c => { if (c[0] > 0 && c[1] > 0) G.line([[0, 1 / c[1]], [1 / c[0], 0]], { c: GREY, w: 1, clip: true }); });
    G.line([[0, 1 / a[1]], [1 / a[0], 0]], { c: COL.s2, w: 2, dash: '7 4', clip: true });
    G.legend([{ c: COL.s1, box: true, o: 0.35, t: L.rob }, { c: COL.s2, dash: '7 4', t: L.nom }], G.ml + 8, 16);
    let area = 0; for (let k = 1; k < pts.length - 1; k++) area += (pts[k][0] * pts[k + 1][1] - pts[k + 1][0] * pts[k][1]) / 2;
    return { svg: G.svg(L.setAria), read: L.setRead(area / (0.5 / (a[0] * a[1]))) };
  }
};
FIGS.regret = {
  state: { tau: 10, rho: 0.7 },
  controls: L => [
    { key: 'tau', label: L.f.tau, min: 4, max: 20, step: 1, fmt: v => fmtT(v, 0) + ' %' },
    { key: 'rho', label: L.f.rho, min: 0, max: 0.9, step: 0.05, fmt: v => fmtT(v, 2) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, R = d18te(0.42, 0.33, s.rho, s.tau / 100, D18_MU);
    const ymax = Math.max(1.2, Math.ceil(10 * Math.max(...[0, 1, 2].map(k => Math.max(R.reg(k, 0), R.reg(k, 1))))) / 10);
    const G = Plot({ w: 680, h: 320, x0: 0, x1: 1, y0: -0.2, y1: Math.min(ymax, 2.4), mt: 26, mb: 42 });
    G.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: ticks(-0.2, Math.min(ymax, 2.4), 5), xl: L.w, xf: v => fmtT(v, 2), yf: v => fmtT(v, 1), xAxisAt: 0 });
    G.clip();
    G.add(`<rect x="${G.X(R.lo)}" y="${G.mt}" width="${G.X(R.hi) - G.X(R.lo)}" height="${G.h - G.mt - G.mb}" fill="${COL.s1}" fill-opacity="0.07"/>`);
    const cols = [COL.s1, COL.s2, COL.s4];
    [0, 1, 2].forEach(k => G.line([[0, R.reg(k, 0)], [1, R.reg(k, 1)]], { c: cols[k], w: 1.6, dash: '5 4', clip: true }));
    G.line(G.sample(w => R.maxr(w), R.lo, R.hi, 200), { c: COL.ink, w: 3, clip: true });
    G.dot(R.w, R.r, { c: COL.s3, r: 6 });
    G.seg(R.lo, -0.2, R.lo, Math.min(ymax, 2.4), { c: GREY, w: 1, dash: '3 3' }); G.seg(R.hi, -0.2, R.hi, Math.min(ymax, 2.4), { c: GREY, w: 1, dash: '3 3' });
    G.legend([{ c: cols[0], dash: '5 4', t: L.reg + ' 1' }, { c: cols[1], dash: '5 4', t: L.reg + ' 2' }, { c: cols[2], dash: '5 4', t: L.reg + ' 3' }, { c: COL.ink, t: L.env }], G.ml + 8, 16);
    return { svg: G.svg(L.regAria), read: L.regRead(R) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  /* 1. tableau de gains */
  for (;;) {
    D.G = [0, 1, 2].map(() => [0, 1, 2, 3].map(() => rint(2, 20)));
    const mins = D.G.map(r => Math.min(...r)), best = [0, 1, 2, 3].map(j => Math.max(...D.G.map(r => r[j])));
    D.R = D.G.map(r => r.map((g, j) => best[j] - g)); const maxR = D.R.map(r => Math.max(...r));
    const avg = D.G.map(r => r.reduce((a, b) => a + b, 0) / 4);
    const uniq = arr => { const m = Math.max(...arr); return arr.filter(v => Math.abs(v - m) < 1e-9).length === 1; };
    if (!uniq(mins) || !uniq(maxR.map(v => -v)) || !uniq(avg)) continue;
    D.iMaximin = mins.indexOf(Math.max(...mins)); D.iRegret = maxR.indexOf(Math.min(...maxR)); D.iMean = avg.indexOf(Math.max(...avg));
    if (new Set([D.iMaximin, D.iRegret, D.iMean]).size < 2) continue;
    if (D.G.some(r => D.G.some(q => q !== r && q.every((v, j) => v >= r[j])))) continue;   /* pas de décision dominée */
    D.mins = mins; D.best = best; D.maxR = maxR; D.avg = avg; break;
  }
  /* 2. Markowitz robuste */
  for (;;) {
    D.m1 = rint(8, 13) / 100; D.m2 = rint(4, 8) / 100; D.e1 = rint(2, 4) / 100; D.e2 = rint(1, 2) / 100;
    D.s1 = rint(20, 30) / 100; D.s2 = rint(12, 20) / 100; D.d1 = rint(3, 6) / 100; D.d2 = rint(2, 4) / 100;
    D.rho = pick([0.2, 0.3, 0.4]); D.lam = pick([1, 1.5, 2]);
    D.wN = d18mk(D.m1, D.m2, D.s1, D.s2, D.rho, D.lam);
    D.wR = d18mk(D.m1 - D.e1, D.m2 - D.e2, D.s1 + D.d1, D.s2 + D.d2, D.rho, D.lam);
    if (D.wN <= 0.05 || D.wN >= 0.95 || D.wR <= 0.05 || D.wR >= 0.95 || D.wN - D.wR < 0.08) continue;
    D.fWN = d18f(D.wN, D.m1 - D.e1, D.m2 - D.e2, D.s1 + D.d1, D.s2 + D.d2, D.rho, D.lam);
    D.fWR = d18f(D.wR, D.m1 - D.e1, D.m2 - D.e2, D.s1 + D.d1, D.s2 + D.d2, D.rho, D.lam);
    D.fNN = d18f(D.wN, D.m1, D.m2, D.s1, D.s2, D.rho, D.lam); D.fNR = d18f(D.wR, D.m1, D.m2, D.s1, D.s2, D.rho, D.lam);
    break;
  }
  /* 3. regret sous erreur de suivi */
  for (;;) {
    D.ts1 = rint(30, 45) / 100; D.ts2 = rint(20, 32) / 100; D.trho = pick([0.5, 0.6, 0.7, 0.8]); D.tau = pick([0.08, 0.1, 0.12]);
    const b1 = rint(45, 60) / 10, b2 = rint(40, 55) / 10;
    D.mu = [[b1 + rint(5, 12) / 10, b2 - rint(2, 6) / 10], [b1 + rint(0, 3) / 10, b2 + rint(0, 3) / 10], [b1 - rint(5, 10) / 10, b2 + rint(4, 9) / 10]];
    D.mu = D.mu.map(m => [Math.round(m[0] * 10) / 10, Math.round(m[1] * 10) / 10]);
    const R = d18te(D.ts1, D.ts2, D.trho, D.tau, D.mu);
    if (R.lo <= 0 || R.hi >= 1) continue;
    if (!(D.mu[0][0] > D.mu[0][1] && D.mu[2][0] < D.mu[2][1])) continue;
    if (R.w <= R.lo + 0.03 || R.w >= R.hi - 0.03) continue;
    if (R.reg(1, R.w) > R.r - 0.02) continue;     /* le scénario 2 n'est pas actif à l'optimum */
    D.T = R; D.wInt = ((R.zs[0] - D.mu[0][1]) - (R.zs[2] - D.mu[2][1])) / ((D.mu[0][0] - D.mu[0][1]) - (D.mu[2][0] - D.mu[2][1]));
    break;
  }
  return D;
};
function d18tab(D, lang) {
  const fr = lang === 'fr';
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th>${[1, 2, 3, 4].map(j => `<th>${fr ? 'Scénario' : 'Scenario'} ${j}</th>`).join('')}</tr></thead><tbody>${D.G.map((r, i) => `<tr><td>${fr ? 'Décision' : 'Decision'} ${String.fromCharCode(65 + i)}</td>${r.map(v => `<td class="num">${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const p18 = (x, d) => fmtT(100 * x, d === undefined ? 0 : d);
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Les trois questions sont indépendantes.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Critères de décision.</strong> Un investisseur doit choisir entre trois stratégies A, B et C. Leur gain, en millions d'euros, dépend du scénario économique qui se réalisera :
  ${d18tab(D, 'fr')}
  <ol><li>Quelle stratégie choisit-on par le critère du pire cas (maximiser le gain minimal) ?</li>
  <li>Construisez le tableau des regrets. Quelle stratégie minimise le regret maximal ?</li>
  <li>Quelle stratégie maximise le gain moyen si les scénarios sont équiprobables ? Comparez les trois choix.</li></ol></div></li>
<li><div class="q-text"><strong>Markowitz robuste.</strong> On investit une part \(w\in[0,1]\) dans l'actif 1 et \(1-w\) dans l'actif 2, et l'on maximise \(\mu_1w+\mu_2(1-w)-\lambda\,\sigma_p^2(w)\) avec \(\lambda=${D.lam}\). Les estimations sont \(\mu_1=${p18(D.m1)}\) %, \(\mu_2=${p18(D.m2)}\) %, \(\sigma_1=${p18(D.s1)}\) %, \(\sigma_2=${p18(D.s2)}\) %, avec une corrélation \(\rho=${fmtT(D.rho, 1)}\) connue. Les rendements espérés sont connus à \(\pm${p18(D.e1)}\) et \(\pm${p18(D.e2)}\) points près, les volatilités à \(\pm${p18(D.d1)}\) et \(\pm${p18(D.d2)}\) points près.
  <ol><li>Montrez que la fonction à maximiser atteint son maximum en \(w^*=\dfrac{(\mu_1-\mu_2)/\lambda+2\sigma_2^2-2\rho\sigma_1\sigma_2}{2(\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2)}\) lorsque ce nombre est dans \([0,1]\), et calculez le portefeuille nominal.</li>
  <li>Justifiez que le pire cas de l'ensemble d'incertitude est obtenu avec les rendements les plus bas et les volatilités les plus hautes, puis calculez le portefeuille robuste.</li>
  <li>Comparez les deux portefeuilles, sous les paramètres estimés et dans le pire cas.</li></ol></div></li>
<li><div class="q-text"><strong>Regret sous erreur de suivi.</strong> Un gérant investit \(w\) dans l'actif 1 et \(1-w\) dans l'actif 2 ; son indice de référence est à 50 % dans chacun. Les volatilités sont \(\sigma_1=${fmtT(D.ts1, 2)}\) et \(\sigma_2=${fmtT(D.ts2, 2)}\), la corrélation \(\rho=${fmtT(D.trho, 1)}\), et l'erreur de suivi ne doit pas dépasser \(\tau=${p18(D.tau)}\) %. Trois scénarios de rendements espérés (en %) sont envisagés : \((${fmtT(D.mu[0][0], 1)}\,;\,${fmtT(D.mu[0][1], 1)})\), \((${fmtT(D.mu[1][0], 1)}\,;\,${fmtT(D.mu[1][1], 1)})\) et \((${fmtT(D.mu[2][0], 1)}\,;\,${fmtT(D.mu[2][1], 1)})\).
  <ol><li>Montrez que l'erreur de suivi vaut \(|w-0.5|\,\sigma_d\) avec \(\sigma_d^2=\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2\), et déduisez-en l'intervalle des poids admissibles.</li>
  <li>Calculez, pour chaque scénario, le meilleur rendement possible \(z_k^*\).</li>
  <li>Écrivez les regrets \(r_k(w)\) et le programme linéaire qui minimise le regret maximal, puis résolvez-le.</li>
  <li>Calculez le regret maximal du portefeuille de référence \(w=0.5\) et commentez.</li></ol></div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">The three questions are independent.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Decision criteria.</strong> An investor must choose between three strategies A, B and C. Their gain, in millions of euros, depends on which economic scenario occurs:
  ${d18tab(D, 'en')}
  <ol><li>Which strategy is chosen by the worst-case criterion (maximising the minimum gain)?</li>
  <li>Build the regret table. Which strategy minimises the maximum regret?</li>
  <li>Which strategy maximises the average gain if the scenarios are equally likely? Compare the three choices.</li></ol></div></li>
<li><div class="q-text"><strong>Robust Markowitz.</strong> A share \(w\in[0,1]\) is invested in asset 1 and \(1-w\) in asset 2, and we maximise \(\mu_1w+\mu_2(1-w)-\lambda\,\sigma_p^2(w)\) with \(\lambda=${D.lam}\). The estimates are \(\mu_1=${p18(D.m1)}\)%, \(\mu_2=${p18(D.m2)}\)%, \(\sigma_1=${p18(D.s1)}\)%, \(\sigma_2=${p18(D.s2)}\)%, with a known correlation \(\rho=${fmtT(D.rho, 1)}\). Expected returns are known within \(\pm${p18(D.e1)}\) and \(\pm${p18(D.e2)}\) points, volatilities within \(\pm${p18(D.d1)}\) and \(\pm${p18(D.d2)}\) points.
  <ol><li>Show that the function to maximise reaches its maximum at \(w^*=\dfrac{(\mu_1-\mu_2)/\lambda+2\sigma_2^2-2\rho\sigma_1\sigma_2}{2(\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2)}\) when this number lies in \([0,1]\), and compute the nominal portfolio.</li>
  <li>Explain why the worst case of the uncertainty set is obtained with the lowest returns and the highest volatilities, then compute the robust portfolio.</li>
  <li>Compare the two portfolios, under the estimated parameters and in the worst case.</li></ol></div></li>
<li><div class="q-text"><strong>Regret under a tracking-error limit.</strong> A manager invests \(w\) in asset 1 and \(1-w\) in asset 2; the benchmark holds 50% of each. Volatilities are \(\sigma_1=${fmtT(D.ts1, 2)}\) and \(\sigma_2=${fmtT(D.ts2, 2)}\), the correlation is \(\rho=${fmtT(D.trho, 1)}\), and the tracking error must not exceed \(\tau=${p18(D.tau)}\)%. Three scenarios of expected returns (in %) are considered: \((${fmtT(D.mu[0][0], 1)},\,${fmtT(D.mu[0][1], 1)})\), \((${fmtT(D.mu[1][0], 1)},\,${fmtT(D.mu[1][1], 1)})\) and \((${fmtT(D.mu[2][0], 1)},\,${fmtT(D.mu[2][1], 1)})\).
  <ol><li>Show that the tracking error equals \(|w-0.5|\,\sigma_d\) with \(\sigma_d^2=\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2\), and deduce the interval of admissible weights.</li>
  <li>Compute, for each scenario, the best achievable return \(z_k^*\).</li>
  <li>Write the regrets \(r_k(w)\) and the linear programme that minimises the maximum regret, then solve it.</li>
  <li>Compute the maximum regret of the benchmark portfolio \(w=0.5\) and comment.</li></ol></div></li>
</ol></div>`;
};

function d18sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], Lt = i => String.fromCharCode(65 + i);
  const regTab = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th>${[1, 2, 3, 4].map(j => `<th>${fr ? 'Scénario' : 'Scenario'} ${j}</th>`).join('')}<th>${fr ? 'Regret maximal' : 'Maximum regret'}</th></tr></thead><tbody>${D.R.map((r, i) => `<tr><td>${Lt(i)}</td>${r.map(v => `<td class="num">${v}</td>`).join('')}<td class="num"><strong>${D.maxR[i]}</strong></td></tr>`).join('')}</tbody></table></div>`;
  const den = (s1, s2) => 2 * (s1 * s1 + s2 * s2 - 2 * D.rho * s1 * s2);
  const num = (m1, m2, s1, s2) => (m1 - m2) / D.lam + 2 * s2 * s2 - 2 * D.rho * s1 * s2;
  const s1u = D.s1 + D.d1, s2u = D.s2 + D.d2, m1l = D.m1 - D.e1, m2l = D.m2 - D.e2;
  const R = D.T, mu = D.mu, t2 = x => tex(x, 3);
  const slope = k => mu[k][0] - mu[k][1];
  const regExpr = k => String.raw`r_${k + 1}(w)&amp;=z_${k + 1}^*-\big(${tex(mu[k][0], 1)}\,w+${tex(mu[k][1], 1)}\,(1-w)\big)=${t2(R.zs[k] - mu[k][1])}${slope(k) >= 0 ? '-' : '+'}${tex(Math.abs(slope(k)), 1)}\,w`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Les gains minimaux des trois stratégies sont', 'The minimum gains of the three strategies are'])} ${D.mins.map((m, i) => Lt(i) + ' : ' + m).join(', ')}. ${T_(['Le critère du pire cas retient', 'The worst-case criterion picks'])} <strong>${Lt(D.iMaximin)}</strong>, ${T_(['qui garantit au moins', 'which guarantees at least'])} ${D.mins[D.iMaximin]} ${T_(['quel que soit le scénario.', 'whatever the scenario.'])}</p>
  <p><strong>b.</strong> ${T_(['Le meilleur gain de chaque scénario est', 'The best gain in each scenario is'])} ${D.best.join(', ')}. ${T_(['Le regret d\'une stratégie dans un scénario est l\'écart entre ce meilleur gain et le sien :', 'The regret of a strategy in a scenario is the gap between this best gain and its own:'])}</p>
  ${regTab}
  <p>${T_(['Le critère du regret retient', 'The regret criterion picks'])} <strong>${Lt(D.iRegret)}</strong>, ${T_(['dont le regret maximal', 'whose maximum regret'])}, ${D.maxR[D.iRegret]}, ${T_(['est le plus petit : quel que soit le scénario, on ne perdra jamais plus de', 'is the smallest: whatever the scenario, we will never lose more than'])} ${D.maxR[D.iRegret]} ${T_(['par rapport au meilleur choix a posteriori.', 'compared with the best choice in hindsight.'])}</p>
  <p><strong>c.</strong> ${T_(['Les gains moyens sont', 'The average gains are'])} ${D.avg.map((m, i) => Lt(i) + ' : ' + fmtT(m, 2)).join(T_([' ; ', ', ']))} : ${T_(['le critère de l\'espérance retient', 'the expectation criterion picks'])} <strong>${Lt(D.iMean)}</strong>. ${T_(['Les trois critères ne répondent pas à la même question. Le pire cas protège contre le scénario le plus défavorable, sans regarder ce qu\'on aurait pu gagner ; le regret protège contre le fait de mal se comparer au meilleur choix ; l\'espérance est neutre au risque et suppose des probabilités connues. Quand les probabilités sont mal connues, les critères robustes sont plus défendables.', 'The three criteria do not answer the same question. The worst case protects against the most unfavourable scenario, without looking at what could have been gained; regret protects against comparing badly with the best choice; expectation is risk-neutral and assumes known probabilities. When probabilities are poorly known, robust criteria are easier to defend.'])}</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['La variance du portefeuille est', 'The portfolio variance is'])} \(\sigma_p^2(w)=w^2\sigma_1^2+(1-w)^2\sigma_2^2+2w(1-w)\rho\sigma_1\sigma_2\). ${T_(['La fonction', 'The function'])} \(f(w)=\mu_1w+\mu_2(1-w)-\lambda\sigma_p^2(w)\) ${T_(['est un polynôme du second degré, de coefficient dominant', 'is a quadratic polynomial, with leading coefficient'])} \(-\lambda(\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2)&lt;0\) : ${T_(['elle est concave et son maximum annule la dérivée :', 'it is concave and its maximum sets the derivative to zero:'])}
  \[\begin{aligned}f'(w)&amp;=\mu_1-\mu_2-\lambda\big(2w\sigma_1^2-2(1-w)\sigma_2^2+2(1-2w)\rho\sigma_1\sigma_2\big)\\&amp;=\mu_1-\mu_2-\lambda\big(2(\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2)\,w-2\sigma_2^2+2\rho\sigma_1\sigma_2\big)&amp;&amp;\text{${T_(['en regroupant les termes en', 'grouping the terms in'])} }w\end{aligned}\]
  ${T_(['qui s\'annule en la valeur', 'which vanishes at the value'])} \(w^*\) ${T_(['de l\'énoncé. Avec les estimations :', 'of the problem. With the estimates:'])}
  \[w_N=\frac{(${tex(D.m1, 2)}-${tex(D.m2, 2)})/${D.lam}+2\times ${tex(D.s2, 2)}^2-2\times ${tex(D.rho, 1)}\times ${tex(D.s1, 2)}\times ${tex(D.s2, 2)}}{${tex(den(D.s1, D.s2), 4)}}=\frac{${tex(num(D.m1, D.m2, D.s1, D.s2), 4)}}{${tex(den(D.s1, D.s2), 4)}}\approx ${tex(D.wN, 3)}\]</p>
  <p><strong>b.</strong> ${T_(['Comme', 'Since'])} \(w\ge 0\) ${T_(['et', 'and'])} \(1-w\ge 0\), ${T_(['le terme de rendement', 'the return term'])} \(\mu_1w+\mu_2(1-w)\) ${T_(['est le plus petit avec', 'is smallest with'])} \(\mu_1=${p18(m1l)}\) % ${T_(['et', 'and'])} \(\mu_2=${p18(m2l)}\) %. ${T_(['La variance est une somme de termes', 'The variance is a sum of terms'])} \(w^2\sigma_1^2\), \((1-w)^2\sigma_2^2\) ${T_(['et', 'and'])} \(2w(1-w)\rho\sigma_1\sigma_2\), ${T_(['tous croissants en', 'all increasing in'])} \(\sigma_1\) ${T_(['et', 'and'])} \(\sigma_2\) ${T_(['puisque', 'since'])} \(\rho&gt;0\) : ${T_(['elle est la plus grande avec', 'it is largest with'])} \(\sigma_1=${p18(s1u)}\) % ${T_(['et', 'and'])} \(\sigma_2=${p18(s2u)}\) %. ${T_(['Le pire cas ne dépend donc pas de', 'The worst case therefore does not depend on'])} \(w\), ${T_(['et le problème robuste est un problème de Markowitz avec ces paramètres :', 'and the robust problem is a Markowitz problem with these parameters:'])}
  \[w_R=\frac{(${tex(m1l, 2)}-${tex(m2l, 2)})/${D.lam}+2\times ${tex(s2u, 2)}^2-2\times ${tex(D.rho, 1)}\times ${tex(s1u, 2)}\times ${tex(s2u, 2)}}{${tex(den(s1u, s2u), 4)}}=\frac{${tex(num(m1l, m2l, s1u, s2u), 4)}}{${tex(den(s1u, s2u), 4)}}\approx ${tex(D.wR, 3)}\]</p>
  <p><strong>c.</strong> ${T_(['Le portefeuille robuste investit moins dans l\'actif 1, le plus rentable mais le plus risqué, dont l\'avantage de rendement est le plus incertain. Les valeurs de l\'objectif (en points de rendement ajusté du risque) sont :', 'The robust portfolio invests less in asset 1, the most profitable but riskiest, whose return advantage is the most uncertain. The objective values (in risk-adjusted return points) are:'])}</p>
  <div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>${T_(['Paramètres estimés', 'Estimated parameters'])}</th><th>${T_(['Pire cas', 'Worst case'])}</th></tr></thead><tbody>
  <tr><td>${T_(['Nominal', 'Nominal'])} \(w_N=${tex(D.wN, 3)}\)</td><td class="num">${fmt(100 * D.fNN, 3)}</td><td class="num">${fmt(100 * D.fWN, 3)}</td></tr>
  <tr><td>${T_(['Robuste', 'Robust'])} \(w_R=${tex(D.wR, 3)}\)</td><td class="num">${fmt(100 * D.fNR, 3)}</td><td class="num">${fmt(100 * D.fWR, 3)}</td></tr></tbody></table></div>
  <p>${T_(['Chaque portefeuille est le meilleur dans le cadre pour lequel il a été conçu : le nominal sous les estimations, le robuste dans le pire cas. Le robuste sacrifie un peu de performance si les estimations sont justes, en échange d\'une meilleure garantie si elles sont trop optimistes.', 'Each portfolio is the best in the setting it was designed for: the nominal one under the estimates, the robust one in the worst case. The robust portfolio gives up a little performance if the estimates are right, in exchange for a better guarantee if they are too optimistic.'])}</p>
  <p class="check">${T_(['Vérification', 'Check'])} : ${fmt(100 * D.fNN, 3)} \(\ge\) ${fmt(100 * D.fNR, 3)} ${T_(['et', 'and'])} ${fmt(100 * D.fWR, 3)} \(\ge\) ${fmt(100 * D.fWN, 3)}.</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['L\'écart de portefeuille est', 'The portfolio deviation is'])} \(x-x^B=(w-0.5,\ 0.5-w)=(w-0.5)\,(1,-1)\). ${T_(['L\'erreur de suivi est l\'écart-type de', 'The tracking error is the standard deviation of'])} \((x-x^B)^TR=(w-0.5)(R_1-R_2)\) :
  ${T_(['Comme', 'Since'])} \(\text{Var}(aU)=a^2\,\text{Var}(U)\) ${T_(['et', 'and'])} \(\text{Var}(R_1-R_2)=\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2\) :
  \[\begin{aligned}\text{TE}(w)&amp;=|w-0.5|\,\sqrt{\sigma_1^2+\sigma_2^2-2\rho\sigma_1\sigma_2}\\&amp;=|w-0.5|\times\sqrt{${tex(D.ts1, 2)}^2+${tex(D.ts2, 2)}^2-2\times ${tex(D.trho, 1)}\times ${tex(D.ts1, 2)}\times ${tex(D.ts2, 2)}}\approx|w-0.5|\times ${tex(R.sd, 4)}\end{aligned}\]
  ${T_(['La contrainte', 'The constraint'])} \(\text{TE}(w)\le ${tex(D.tau, 2)}\) ${T_(['donne', 'gives'])} \(|w-0.5|\le ${tex(D.tau, 2)}/${tex(R.sd, 4)}\approx ${tex(D.tau / R.sd, 3)}\), ${T_(['soit', 'that is'])} \(w\in[${t2(R.lo)}\,;\,${t2(R.hi)}]\).</p>
  <p><strong>b.</strong> ${T_(['Le rendement espéré est linéaire en', 'The expected return is linear in'])} \(w\) : ${T_(['son maximum sur l\'intervalle est atteint à une extrémité, celle du côté de l\'actif le plus rentable dans le scénario :', 'its maximum over the interval is attained at an end point, on the side of the more profitable asset in the scenario:'])}
  \[\begin{aligned}${[0, 1, 2].map(k => String.raw`z_${k + 1}^*&amp;=${tex(mu[k][0], 1)}\times ${t2(R.wopt[k])}+${tex(mu[k][1], 1)}\times ${t2(1 - R.wopt[k])}\approx ${t2(R.zs[k])}`).join('\\\\')}\end{aligned}\]</p>
  <p><strong>c.</strong> ${T_(['Les regrets sont affines en', 'The regrets are affine in'])} \(w\) :
  \[\begin{aligned}${[0, 1, 2].map(regExpr).join('\\\\')}\end{aligned}\]
  ${T_(['On minimise leur maximum en introduisant une variable', 'Their maximum is minimised by introducing a variable'])} \(t\) ${T_(['qui les majore tous :', 'that bounds them all:'])}
  \[\min_{w,\,t}\ t\qquad\text{${T_(['sous', 's.t.'])}}\qquad r_k(w)\le t,\quad k=1,2,3,\qquad ${t2(R.lo)}\le w\le ${t2(R.hi)}\]
  ${T_(['Le regret 1 décroît avec', 'Regret 1 decreases with'])} \(w\), ${T_(['le regret 3 croît : le maximum est le plus petit là où ils sont égaux,', 'regret 3 increases: the maximum is smallest where they are equal,'])}
  \[${t2(R.zs[0] - mu[0][1])}-${tex(slope(0), 1)}\,w=${t2(R.zs[2] - mu[2][1])}${slope(2) >= 0 ? '-' : '+'}${tex(Math.abs(slope(2)), 1)}\,w\qquad\iff\qquad w^*=\frac{${t2(R.zs[0] - mu[0][1])}-${R.zs[2] - mu[2][1] < 0 ? '(' + t2(R.zs[2] - mu[2][1]) + ')' : t2(R.zs[2] - mu[2][1])}}{${tex(slope(0), 1)}-${slope(2) < 0 ? '(' + tex(slope(2), 1) + ')' : tex(slope(2), 1)}}\approx ${t2(R.w)}\]
  ${T_(['pour un regret maximal', 'for a maximum regret'])} \(t^*\approx ${t2(R.r)}\). ${T_(['On vérifie que le regret 2 y est plus faible', 'We check that regret 2 is lower there'])} : \(r_2(w^*)\approx ${t2(R.reg(1, R.w))}\le ${t2(R.r)}\).</p>
  <p><strong>d.</strong> ${T_(['Pour', 'For'])} \(w=0.5\), ${T_(['les regrets valent', 'the regrets are'])} ${[0, 1, 2].map(k => '\\(' + t2(R.reg(k, 0.5)) + '\\)').join(T_([' ; ', ', ']))}, ${T_(['soit un regret maximal de', 'that is, a maximum regret of'])} \(${t2(R.maxr(0.5))}\), ${T_(['supérieur à', 'above'])} \(${t2(R.r)}\). ${T_(['S\'écarter de la référence vers', 'Moving away from the benchmark towards'])} \(w^*\approx ${t2(R.w)}\) ${T_(['réduit le pire écart au meilleur choix a posteriori, sans parier sur un scénario. Les portefeuilles optimaux de chaque scénario, eux, sont aux extrémités de l\'intervalle et ont un regret maximal plus élevé :', 'reduces the worst gap to the best choice in hindsight, without betting on a scenario. The optimal portfolios of each scenario lie at the end points of the interval and have a higher maximum regret:'])} \(${t2(R.maxr(R.lo))}\) ${T_(['en', 'at'])} \(w=${t2(R.lo)}\) ${T_(['et', 'and'])} \(${t2(R.maxr(R.hi))}\) ${T_(['en', 'at'])} \(w=${t2(R.hi)}\).</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d18sol(D, 'fr');
I18N.en.sol = D => d18sol(D, 'en');
