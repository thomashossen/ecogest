/* ============================================================
   PAGE mf22 — Variables entières : choix d'investissements et fonds indiciel
   ============================================================ */
const GREY = '#8a857a';
I18N.fr.k = {
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié',
  'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 22 – Variables entières et fonds indiciel', 'k-h1': 'Variables entières et fonds indiciel',
  'k-coursetitle': 'Décisions tout ou rien, conditions logiques et construction d\'un fonds indiciel', 'k-extitle': 'Choix de projets, contraintes logiques et réplication d\'indice', 'k-soltitle': 'Choix de projets, contraintes logiques et réplication d\'indice'
};
I18N.en.k = {
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied',
  'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 22 – Integer variables and index funds', 'k-h1': 'Integer variables and index funds',
  'k-coursetitle': 'All-or-nothing decisions, logical conditions and building an index fund', 'k-extitle': 'Project selection, logical constraints and index replication', 'k-soltitle': 'Project selection, logical constraints and index replication'
};

/* ---------- outils ---------- */
/* relaxation continue d'un sac à dos : on remplit par rapport rendement / coût décroissant */
function d22relax(c, r, B) {
  const idx = c.map((_, i) => i).sort((i, j) => r[j] / c[j] - r[i] / c[i]);
  const x = c.map(() => 0); let left = B, val = 0;
  for (const i of idx) { const f = Math.min(1, Math.max(0, left / c[i])); x[i] = f; left -= f * c[i]; val += f * r[i]; if (left <= 1e-9) break; }
  return { x: x, val: val, order: idx };
}
function d22enum(c, r, B) {
  const n = c.length, all = [];
  for (let m = 0; m < (1 << n); m++) {
    let cost = 0, val = 0; const x = [];
    for (let i = 0; i < n; i++) { const b = (m >> i) & 1; x.push(b); cost += b * c[i]; val += b * r[i]; }
    if (cost <= B) all.push({ x: x, cost: cost, val: val });
  }
  all.sort((a, b) => b.val - a.val || a.cost - b.cost);
  return all;
}
/* fonds indiciel : choisir q titres parmi n, chaque titre étant représenté par le plus semblable des titres choisis */
function d22index(rho, q) {
  const n = rho.length; let best = null;
  const rec = (start, S) => {
    if (S.length === q) {
      let v = 0; const rep = [];
      for (let i = 0; i < n; i++) { let bj = S[0]; S.forEach(j => { if (rho[i][j] > rho[i][bj]) bj = j; }); rep.push(bj); v += rho[i][bj]; }
      if (!best || v > best.v + 1e-12) best = { S: S.slice(), rep: rep, v: v };
      return;
    }
    for (let j = start; j < n; j++) { S.push(j); rec(j + 1, S); S.pop(); }
  };
  rec(0, []);
  return best;
}
const D22_KN = { c: [6700, 10000, 5500, 3400], r: [8000, 11000, 6000, 4000] };
const D22_RHO = [[1, 0.8, 0.7, 0.3, 0.2, 0.1], [0.8, 1, 0.75, 0.25, 0.2, 0.1], [0.7, 0.75, 1, 0.3, 0.25, 0.15], [0.3, 0.25, 0.3, 1, 0.85, 0.2], [0.2, 0.2, 0.25, 0.85, 1, 0.3], [0.1, 0.1, 0.15, 0.2, 0.3, 1]];
const D22_CAP = [120, 90, 60, 80, 50, 40];

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez reconnaître une décision qui ne peut pas être fractionnée, la modéliser par une variable binaire, traduire des conditions logiques en contraintes linéaires, expliquer pourquoi arrondir la solution continue ne suffit pas, et formuler la construction d'un fonds indiciel comme un programme en nombres entiers.<br><br>
<strong>Pourquoi en finance ?</strong> Financer ou non un projet, acheter ou non une entreprise, inclure ou non un titre dans un portefeuille : beaucoup de décisions sont du type tout ou rien. Les programmes en nombres entiers sont aussi utilisés pour limiter le nombre de lignes d'un portefeuille ou imposer des tailles minimales de transaction.<br><br>
<strong>Prérequis.</strong> Programmation linéaire (page 15), corrélation (page 20).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Pourquoi des entiers</a> · <a href="#s2">2. Arrondir ne suffit pas</a> · <a href="#s3">3. Conditions logiques</a> · <a href="#s4">4. Résoudre</a> · <a href="#s5">5. Le fonds indiciel</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Pourquoi des variables entières ?</div>
<p>Dans un programme linéaire, les variables peuvent prendre n'importe quelle valeur réelle. Certaines décisions ne s'y prêtent pas : on construit une usine ou on ne la construit pas ; on finance un projet en entier ou pas du tout. On les représente par une variable <em>binaire</em> \(x_i\in\{0,1\}\), qui vaut 1 si l'on retient l'option \(i\). Un programme dont certaines variables doivent être entières est un <em>programme en nombres entiers</em>, ou programme linéaire mixte s'il contient aussi des variables continues.</p>

<div class="dossier-title" id="s2">2. Arrondir ne suffit pas</div>
<p>Exemple des diapositives : 19 000 à investir dans quatre projets indivisibles.</p>
<div class="dtable-wrap"><table class="dtable"><thead><tr><th>Projet</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>Coût</td><td class="num">6 700</td><td class="num">10 000</td><td class="num">5 500</td><td class="num">3 400</td></tr><tr><td>Valeur</td><td class="num">8 000</td><td class="num">11 000</td><td class="num">6 000</td><td class="num">4 000</td></tr></tbody></table></div>
<p>On maximise \(8000x_1+11000x_2+6000x_3+4000x_4\) sous \(6700x_1+10000x_2+5500x_3+3400x_4\le 19000\), \(x_i\in\{0,1\}\). Si l'on remplace \(x_i\in\{0,1\}\) par \(0\le x_i\le 1\), on obtient la <em>relaxation continue</em>, qui se résout en retenant les projets par rapport valeur sur coût décroissant (1.194 pour le projet 1, 1.176 pour le 4, 1.100 pour le 2, 1.091 pour le 3) jusqu'à épuiser le budget : \(x=(1,\,0.89,\,0,\,1)\), de valeur 21 790. Arrondir \(x_2\) à 1 donne un coût de 20 100, irréalisable ; l'arrondir à 0 donne 12 000. L'optimum entier est \((0,1,1,1)\), de coût 18 900 et de valeur 21 000 : il n'est voisin d'aucun arrondi. La valeur de la relaxation, 21 790, majore celle de tout choix entier ; elle sert de borne.</p>
<div class="ifig" data-fig="knap"></div>
<div class="fig-cap">Figure 1 — Part de chaque projet retenue par la relaxation continue (en clair) et par l'optimum entier (en foncé), pour le budget choisi. Faites varier le budget : la relaxation remplit toujours le budget en fractionnant un projet, l'optimum entier change parfois complètement de composition.</div>

<div class="dossier-title" id="s3">3. Traduire des conditions logiques</div>
<p>Les variables binaires permettent d'écrire des règles de gestion sous forme de contraintes linéaires. Avec des projets numérotés :</p>
<div class="dtable-wrap"><table class="dtable"><thead><tr><th>Condition</th><th>Contrainte</th></tr></thead><tbody>
<tr><td>au plus deux projets</td><td>\(x_1+x_2+x_3+x_4\le 2\)</td></tr>
<tr><td>si l'on investit dans 2, on investit dans 4</td><td>\(x_2\le x_4\)</td></tr>
<tr><td>1 et 3 sont incompatibles</td><td>\(x_1+x_3\le 1\)</td></tr>
<tr><td>exactement un projet parmi 4, 5, 6, 7</td><td>\(x_4+x_5+x_6+x_7=1\)</td></tr>
<tr><td>si 8 est retenu, 9 ou 10 doit l'être</td><td>\(x_8\le x_9+x_{10}\)</td></tr>
<tr><td>si 1 ou 2 est retenu, ni 8 ni 9 ne le sont</td><td>\(x_1+x_8\le 1\), \(x_1+x_9\le 1\), \(x_2+x_8\le 1\), \(x_2+x_9\le 1\)</td></tr>
</tbody></table></div>
<p>Pour vérifier une traduction, il suffit de passer en revue les valeurs 0 et 1 des variables concernées : par exemple, \(x_2\le x_4\) n'interdit que le cas \(x_2=1\), \(x_4=0\), exactement celui que la condition exclut. Les diapositives appliquent ces règles à un fonds souverain qui choisit des projets d'infrastructure sous un plafond annuel de décaissements : chaque année donne une contrainte de budget.</p>

<div class="dossier-title" id="s4">4. Résoudre un programme en nombres entiers</div>
<p>Avec \(n\) variables binaires, il y a \(2^n\) combinaisons : l'énumération est possible pour une dizaine de projets, pas pour cent. Les solveurs utilisent la méthode de <em>séparation et évaluation</em> (branch and bound). On résout la relaxation continue ; si une variable est fractionnaire, par exemple \(x_2=0.89\), on sépare le problème en deux sous-problèmes, \(x_2=0\) et \(x_2=1\), et l'on recommence. La valeur de la relaxation d'un sous-problème majore toutes les solutions qu'il contient : si elle est inférieure à la meilleure solution entière déjà trouvée, on abandonne ce sous-problème sans l'explorer. Cette élimination rend la méthode efficace en pratique, même si le problème reste difficile dans le pire cas.</p>

<div class="dossier-title" id="s5">5. Construire un fonds indiciel</div>
<p>Un fonds indiciel cherche à reproduire un indice, comme le CAC 40, avec un petit nombre \(q\) de titres choisis parmi les \(n\) de l'indice, pour limiter les coûts de transaction. On mesure la ressemblance entre les titres \(i\) et \(j\) par un nombre \(\rho_{ij}\), le plus souvent la corrélation de leurs rendements. Les variables sont binaires : \(y_j=1\) si le titre \(j\) entre dans le fonds, \(x_{ij}=1\) si le titre \(j\) du fonds représente le titre \(i\) de l'indice. On maximise la ressemblance totale :
\[\begin{aligned}\max\ &amp;\ \sum_{i=1}^{n}\sum_{j=1}^{n}\rho_{ij}\,x_{ij}\\\text{sous }&amp;\ \sum_{j=1}^{n}y_j=q&amp;&amp;\text{exactement } q \text{ titres dans le fonds}\\&amp;\ \sum_{j=1}^{n}x_{ij}=1,\quad i=1,\ldots,n&amp;&amp;\text{chaque titre est représenté une fois}\\&amp;\ x_{ij}\le y_j&amp;&amp;\text{seul un titre du fonds peut représenter}\\&amp;\ x_{ij},\ y_j\in\{0,1\}\end{aligned}\]
À l'optimum, chaque titre est représenté par le plus semblable des titres retenus. Le poids du titre \(j\) dans le fonds est la part de la capitalisation des titres qu'il représente : \(w_j=\sum_iV_ix_{ij}/\sum_iV_i\). Ce modèle est celui des « \(q\)-médianes », étudié aussi en logistique pour placer des entrepôts.</p>
<div class="ifig" data-fig="index"></div>
<div class="fig-cap">Figure 2 — Six titres : trois valeurs technologiques (1 à 3), deux banques (4 et 5) et une entreprise de services collectifs (6). Les titres retenus sont en doré, chaque flèche relie un titre à son représentant, avec la corrélation correspondante. Avec \(q=3\), le modèle retient un titre par secteur.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Une décision tout ou rien se modélise par une variable binaire ; arrondir la solution continue peut être irréalisable ou loin de l'optimum.</li>
<li>La relaxation continue fournit une borne ; la séparation et évaluation explore les sous-problèmes en éliminant ceux dont la borne est trop faible.</li>
<li>Conditions logiques : « au plus k » par une somme, « si a alors b » par \(x_a\le x_b\), « a ou b exclusif » par \(x_a+x_b\le 1\).</li>
<li>Fonds indiciel : choisir \(q\) titres et affecter chaque titre à son représentant le plus corrélé ; les poids viennent des capitalisations représentées.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can recognise a decision that cannot be split, model it with a binary variable, translate logical conditions into linear constraints, explain why rounding the continuous solution is not enough, and formulate the construction of an index fund as an integer programme.<br><br>
<strong>Why in finance?</strong> Financing a project or not, buying a company or not, including a security in a portfolio or not: many decisions are all-or-nothing. Integer programmes are also used to limit the number of holdings in a portfolio or to impose minimum transaction sizes.<br><br>
<strong>Prerequisites.</strong> Linear programming (page 15), correlation (page 20).
</div>
<p class="toc">Contents: <a href="#s1">1. Why integers</a> · <a href="#s2">2. Rounding is not enough</a> · <a href="#s3">3. Logical conditions</a> · <a href="#s4">4. Solving</a> · <a href="#s5">5. The index fund</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Why integer variables?</div>
<p>In a linear programme, variables may take any real value. Some decisions do not fit: a factory is built or not; a project is financed entirely or not at all. They are represented by a <em>binary</em> variable \(x_i\in\{0,1\}\), equal to 1 if option \(i\) is selected. A programme in which some variables must be integers is an <em>integer programme</em>, or a mixed-integer linear programme if it also has continuous variables.</p>

<div class="dossier-title" id="s2">2. Rounding is not enough</div>
<p>Example from the slides: 19,000 to invest in four indivisible projects.</p>
<div class="dtable-wrap"><table class="dtable"><thead><tr><th>Project</th><th>1</th><th>2</th><th>3</th><th>4</th></tr></thead><tbody><tr><td>Cost</td><td class="num">6,700</td><td class="num">10,000</td><td class="num">5,500</td><td class="num">3,400</td></tr><tr><td>Value</td><td class="num">8,000</td><td class="num">11,000</td><td class="num">6,000</td><td class="num">4,000</td></tr></tbody></table></div>
<p>We maximise \(8000x_1+11000x_2+6000x_3+4000x_4\) subject to \(6700x_1+10000x_2+5500x_3+3400x_4\le 19000\), \(x_i\in\{0,1\}\). Replacing \(x_i\in\{0,1\}\) by \(0\le x_i\le 1\) gives the <em>continuous relaxation</em>, solved by taking projects in decreasing order of value-to-cost ratio (1.194 for project 1, 1.176 for 4, 1.100 for 2, 1.091 for 3) until the budget is used up: \(x=(1,\,0.89,\,0,\,1)\), with value 21,790. Rounding \(x_2\) up to 1 costs 20,100, which is infeasible; rounding it down gives 12,000. The integer optimum is \((0,1,1,1)\), costing 18,900 and worth 21,000: it is not next to either rounding. The relaxation value, 21,790, bounds that of every integer choice; it serves as a bound.</p>
<div class="ifig" data-fig="knap"></div>
<div class="fig-cap">Figure 1 — Share of each project selected by the continuous relaxation (light) and by the integer optimum (dark), for the chosen budget. Vary the budget: the relaxation always fills the budget by splitting one project, while the integer optimum sometimes changes its composition completely.</div>

<div class="dossier-title" id="s3">3. Translating logical conditions</div>
<p>Binary variables make it possible to write management rules as linear constraints. With numbered projects:</p>
<div class="dtable-wrap"><table class="dtable"><thead><tr><th>Condition</th><th>Constraint</th></tr></thead><tbody>
<tr><td>at most two projects</td><td>\(x_1+x_2+x_3+x_4\le 2\)</td></tr>
<tr><td>if we invest in 2, we invest in 4</td><td>\(x_2\le x_4\)</td></tr>
<tr><td>1 and 3 are incompatible</td><td>\(x_1+x_3\le 1\)</td></tr>
<tr><td>exactly one project among 4, 5, 6, 7</td><td>\(x_4+x_5+x_6+x_7=1\)</td></tr>
<tr><td>if 8 is selected, 9 or 10 must be</td><td>\(x_8\le x_9+x_{10}\)</td></tr>
<tr><td>if 1 or 2 is selected, neither 8 nor 9 is</td><td>\(x_1+x_8\le 1\), \(x_1+x_9\le 1\), \(x_2+x_8\le 1\), \(x_2+x_9\le 1\)</td></tr>
</tbody></table></div>
<p>To check a translation, it suffices to go through the values 0 and 1 of the variables involved: for instance, \(x_2\le x_4\) only rules out the case \(x_2=1\), \(x_4=0\), exactly the one the condition excludes. The slides apply these rules to a sovereign wealth fund choosing infrastructure projects under an annual spending cap: each year gives a budget constraint.</p>

<div class="dossier-title" id="s4">4. Solving an integer programme</div>
<p>With \(n\) binary variables, there are \(2^n\) combinations: enumeration is possible for about ten projects, not for a hundred. Solvers use <em>branch and bound</em>. The continuous relaxation is solved; if a variable is fractional, for instance \(x_2=0.89\), the problem is split into two subproblems, \(x_2=0\) and \(x_2=1\), and the process repeats. The relaxation value of a subproblem bounds all the solutions it contains: if it is below the best integer solution already found, the subproblem is discarded without being explored. This pruning makes the method efficient in practice, even though the problem remains hard in the worst case.</p>

<div class="dossier-title" id="s5">5. Building an index fund</div>
<p>An index fund seeks to replicate an index, such as the CAC 40, with a small number \(q\) of securities chosen among the \(n\) of the index, to limit transaction costs. The similarity between securities \(i\) and \(j\) is measured by a number \(\rho_{ij}\), most often the correlation of their returns. The variables are binary: \(y_j=1\) if security \(j\) enters the fund, \(x_{ij}=1\) if security \(j\) of the fund represents security \(i\) of the index. Total similarity is maximised:
\[\begin{aligned}\max\ &amp;\ \sum_{i=1}^{n}\sum_{j=1}^{n}\rho_{ij}\,x_{ij}\\\text{s.t. }&amp;\ \sum_{j=1}^{n}y_j=q&amp;&amp;\text{exactly } q \text{ securities in the fund}\\&amp;\ \sum_{j=1}^{n}x_{ij}=1,\quad i=1,\ldots,n&amp;&amp;\text{each security is represented once}\\&amp;\ x_{ij}\le y_j&amp;&amp;\text{only a security in the fund can represent}\\&amp;\ x_{ij},\ y_j\in\{0,1\}\end{aligned}\]
At the optimum, each security is represented by the most similar of the selected securities. The weight of security \(j\) in the fund is the share of the market value of the securities it represents: \(w_j=\sum_iV_ix_{ij}/\sum_iV_i\). This is the "\(q\)-median" model, also studied in logistics to locate warehouses.</p>
<div class="ifig" data-fig="index"></div>
<div class="fig-cap">Figure 2 — Six securities: three technology stocks (1 to 3), two banks (4 and 5) and a utility (6). Selected securities are in gold, each arrow links a security to its representative, with the corresponding correlation. With \(q=3\), the model picks one security per sector.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>An all-or-nothing decision is modelled by a binary variable; rounding the continuous solution may be infeasible or far from the optimum.</li>
<li>The continuous relaxation gives a bound; branch and bound explores subproblems and discards those whose bound is too low.</li>
<li>Logical conditions: "at most k" by a sum, "if a then b" by \(x_a\le x_b\), "not both a and b" by \(x_a+x_b\le 1\).</li>
<li>Index fund: choose \(q\) securities and assign each security to its most correlated representative; weights come from the market values represented.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  B: 'Budget', proj: 'projet', share: 'part retenue', rel: 'relaxation continue', int: 'optimum entier', knAria: 'Parts des projets retenues par la relaxation continue et par l\'optimum entier',
  knRead: (R, I) => `Relaxation : valeur <span class="v">${fmt(R.val, 0)}</span> &nbsp;·&nbsp; optimum entier : valeur <span class="v">${fmt(I.val, 0)}</span>, coût <span class="v">${fmt(I.cost, 0)}</span>, projets ${I.x.map((v, i) => v ? i + 1 : 0).filter(Boolean).join(', ') || 'aucun'}`,
  q: 'Nombre de titres q', ixAria: 'Titres retenus dans le fonds indiciel et représentant de chaque titre',
  ixRead: (B, w) => `Titres retenus : ${B.S.map(j => j + 1).join(', ')} &nbsp;·&nbsp; ressemblance totale <span class="v">${fmt(B.v, 2)}</span><br>Poids : ${B.S.map(j => `titre ${j + 1} <span class="v">${fmt(100 * w[j], 1)} %</span>`).join(' ; ')}`
};
I18N.en.f = {
  B: 'Budget', proj: 'project', share: 'share selected', rel: 'continuous relaxation', int: 'integer optimum', knAria: 'Shares of the projects selected by the continuous relaxation and by the integer optimum',
  knRead: (R, I) => `Relaxation: value <span class="v">${fmt(R.val, 0)}</span> &nbsp;·&nbsp; integer optimum: value <span class="v">${fmt(I.val, 0)}</span>, cost <span class="v">${fmt(I.cost, 0)}</span>, projects ${I.x.map((v, i) => v ? i + 1 : 0).filter(Boolean).join(', ') || 'none'}`,
  q: 'Number of securities q', ixAria: 'Securities selected in the index fund and representative of each security',
  ixRead: (B, w) => `Selected securities: ${B.S.map(j => j + 1).join(', ')} &nbsp;·&nbsp; total similarity <span class="v">${fmt(B.v, 2)}</span><br>Weights: ${B.S.map(j => `security ${j + 1} <span class="v">${fmt(100 * w[j], 1)}%</span>`).join('; ')}`
};
FIGS.knap = {
  state: { B: 19000 },
  controls: L => [{ key: 'B', label: L.f.B, min: 8000, max: 26000, step: 500, fmt: v => fmt(v, 0) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, R = d22relax(D22_KN.c, D22_KN.r, s.B), I = d22enum(D22_KN.c, D22_KN.r, s.B)[0];
    const G = Plot({ w: 680, h: 280, x0: 0.4, x1: 4.6, y0: 0, y1: 1.15, mt: 30, mb: 42 });
    G.axes({ xt: [1, 2, 3, 4], yt: [0, 0.25, 0.5, 0.75, 1], xl: L.proj, xf: v => String(v), yf: v => fmtT(v, 2) });
    for (let i = 0; i < 4; i++) {
      G.bar(i + 1 - 0.17, 46, Math.max(R.x[i], 0.004), { c: COL.s1, o: 0.4 }); G.text(i + 1 - 0.17, R.x[i], fmtT(R.x[i], 2), { dy: -5, size: 10.5, mono: true });
      G.bar(i + 1 + 0.17, 46, Math.max(I.x[i], 0.004), { c: COL.s1, o: 0.95 }); G.text(i + 1 + 0.17, I.x[i], String(I.x[i]), { dy: -5, size: 10.5, mono: true });
    }
    G.legend([{ c: COL.s1, box: true, o: 0.4, t: L.rel }, { c: COL.s1, box: true, o: 0.95, t: L.int }], G.ml + 8, 16);
    return { svg: G.svg(L.knAria), read: L.knRead(R, I) };
  }
};
FIGS.index = {
  state: { q: 3 },
  controls: L => [{ key: 'q', label: L.f.q, min: 1, max: 5, step: 1, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, B = d22index(D22_RHO, s.q), n = 6, W = 520, H = 400, cx = 260, cy = 205, R0 = 150;
    const pos = Array.from({ length: n }, (_, i) => [cx + R0 * Math.cos(-Math.PI / 2 + 2 * Math.PI * i / n), cy + R0 * Math.sin(-Math.PI / 2 + 2 * Math.PI * i / n)]);
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${L.ixAria}"><defs><marker id="ixar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${COL.mute}"/></marker></defs>`;
    for (let i = 0; i < n; i++) {
      const j = B.rep[i]; if (j === i) continue;
      const [x1, y1] = pos[i], [x2, y2] = pos[j], dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
      svg += `<line x1="${x1 + 26 * ux}" y1="${y1 + 26 * uy}" x2="${x2 - 28 * ux}" y2="${y2 - 28 * uy}" stroke="${COL.mute}" stroke-width="1.6" marker-end="url(#ixar)"/>`;
      svg += `<text x="${(x1 + x2) / 2 - 10 * uy}" y="${(y1 + y2) / 2 + 10 * ux + 4}" text-anchor="middle" ${FONT_M} font-size="11" fill="${COL.ink}">${fmtT(D22_RHO[i][j], 2)}</text>`;
    }
    for (let i = 0; i < n; i++) {
      const sel = B.S.indexOf(i) >= 0, r = 14 + 0.12 * D22_CAP[i];
      svg += `<circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="${Math.min(26, r)}" fill="${sel ? COL.s2 : '#fff'}" stroke="${sel ? COL.s2 : COL.s1}" stroke-width="2"/>`;
      svg += `<text x="${pos[i][0]}" y="${pos[i][1] + 4.5}" text-anchor="middle" ${FONT_T} font-size="13" font-weight="700" fill="${sel ? '#fff' : COL.ink}">${i + 1}</text>`;
    }
    svg += '</svg>';
    const tot = D22_CAP.reduce((a, b) => a + b, 0), w = D22_CAP.map(() => 0); B.rep.forEach((j, i) => { w[j] += D22_CAP[i] / tot; });
    return { svg: svg, read: L.ixRead(B, w) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed, n: 5 };
  for (;;) {
    D.c = Array.from({ length: 5 }, () => 100 * rint(20, 90));
    D.r = D.c.map(c => 100 * Math.round(c * (1.05 + 0.3 * rnd()) / 100));
    const tot = D.c.reduce((a, b) => a + b, 0); D.B = 100 * Math.round(tot * (0.45 + 0.15 * rnd()) / 100);
    D.R = d22relax(D.c, D.r, D.B);
    const fr = D.R.x.filter(v => v > 1e-9 && v < 1 - 1e-9); if (fr.length !== 1) continue;
    D.E = d22enum(D.c, D.r, D.B); D.I = D.E[0];
    D.down = D.R.x.map(v => v > 1 - 1e-9 ? 1 : 0); D.downVal = D.down.reduce((a, b, i) => a + b * D.r[i], 0);
    if (D.downVal >= D.I.val) continue;
    if (D.E.length > 1 && D.E[1].val === D.I.val) continue;
    break;
  }
  /* conditions logiques */
  const perm = shuffle([1, 2, 3, 4, 5]); D.L = { k: pick([2, 3]), ia: perm[0], ib: perm[1], ic: perm[2], id: perm[3], ie: perm[4] };
  /* fonds indiciel */
  D.names = ['A', 'B', 'C', 'D', 'E'];
  for (;;) {
    D.rho = [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0], [0, 0, 0, 0, 1]];
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { const v = rint(1, 9) / 10; D.rho[i][j] = v; D.rho[j][i] = v; }
    D.V = Array.from({ length: 5 }, () => 10 * rint(3, 15));
    D.IX = d22index(D.rho, 2);
    /* toutes les paires */
    D.pairs = [];
    for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) { let v = 0; for (let i = 0; i < 5; i++) v += Math.max(D.rho[i][a], D.rho[i][b]); D.pairs.push({ a: a, b: b, v: v }); }
    D.pairs.sort((p, q) => q.v - p.v);
    if (D.pairs[1].v > D.pairs[0].v - 0.05) continue;
    break;
  }
  const tot = D.V.reduce((a, b) => a + b, 0); D.w = D.V.map(() => 0); D.IX.rep.forEach((j, i) => { D.w[j] += D.V[i] / tot; }); D.Vtot = tot;
  return D;
};
function d22tab1(D, lang) {
  const fr = lang === 'fr';
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${fr ? 'Projet' : 'Project'}</th>${[1, 2, 3, 4, 5].map(i => `<th>${i}</th>`).join('')}</tr></thead><tbody><tr><td>${fr ? 'Coût' : 'Cost'}</td>${D.c.map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr><tr><td>${fr ? 'Valeur' : 'Value'}</td>${D.r.map(v => `<td class="num">${fmt(v, 0)}</td>`).join('')}</tr></tbody></table></div>`;
}
function d22tab3(D, lang) {
  const fr = lang === 'fr';
  return `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th>${D.names.map(n => `<th>${n}</th>`).join('')}</tr></thead><tbody>${D.rho.map((r, i) => `<tr><td>${D.names[i]}</td>${r.map(v => `<td class="num">${fmtT(v, 1)}</td>`).join('')}</tr>`).join('')}<tr><td>${fr ? 'Capitalisation' : 'Market value'}</td>${D.V.map(v => `<td class="num">${v}</td>`).join('')}</tr></tbody></table></div>`;
}
I18N.fr.ex = function (D) {
  const L = D.L;
  return String.raw`<div class="context-block">Les trois questions sont indépendantes.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Projets indivisibles.</strong> Une entreprise dispose d'un budget de ${fmt(D.B, 0)} et peut financer, en totalité ou pas du tout, les projets suivants.
  ${d22tab1(D, 'fr')}
  <ol><li>Écrivez le programme en nombres entiers qui maximise la valeur totale, puis résolvez sa relaxation continue.</li>
  <li>Quelle valeur obtient-on en arrondissant à 0 la variable fractionnaire ?</li>
  <li>Déterminez l'optimum entier par énumération et comparez les trois valeurs.</li></ol></div></li>
<li><div class="q-text"><strong>Conditions logiques.</strong> Avec les mêmes projets, traduisez en contraintes linéaires les règles suivantes, et vérifiez chaque traduction en passant en revue les valeurs possibles des variables concernées.
  <ol><li>On finance au plus ${L.k} projets.</li>
  <li>Si le projet ${L.ia} est financé, le projet ${L.ib} doit l'être aussi.</li>
  <li>Les projets ${L.ic} et ${L.id} ne peuvent pas être financés tous les deux.</li>
  <li>Si le projet ${L.ie} est financé, au moins l'un des projets ${L.ia} et ${L.ic} doit l'être.</li></ol></div></li>
<li><div class="q-text"><strong>Fonds indiciel.</strong> Un indice comprend cinq titres, dont on donne les corrélations des rendements et les capitalisations. On veut le reproduire avec \(q=2\) titres.
  ${d22tab3(D, 'fr')}
  <ol><li>Écrivez le programme en nombres entiers correspondant.</li>
  <li>Résolvez-le en évaluant chacune des dix paires possibles.</li>
  <li>Donnez la composition et les poids du fonds.</li></ol></div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  const L = D.L;
  return String.raw`<div class="context-block">The three questions are independent.</div>
<div class="questions"><ol>
<li><div class="q-text"><strong>Indivisible projects.</strong> A company has a budget of ${fmt(D.B, 0)} and can finance, entirely or not at all, the following projects.
  ${d22tab1(D, 'en')}
  <ol><li>Write the integer programme that maximises total value, then solve its continuous relaxation.</li>
  <li>What value is obtained by rounding the fractional variable down to 0?</li>
  <li>Find the integer optimum by enumeration and compare the three values.</li></ol></div></li>
<li><div class="q-text"><strong>Logical conditions.</strong> With the same projects, translate the following rules into linear constraints, and check each translation by going through the possible values of the variables involved.
  <ol><li>At most ${L.k} projects are financed.</li>
  <li>If project ${L.ia} is financed, project ${L.ib} must be too.</li>
  <li>Projects ${L.ic} and ${L.id} cannot both be financed.</li>
  <li>If project ${L.ie} is financed, at least one of projects ${L.ia} and ${L.ic} must be.</li></ol></div></li>
<li><div class="q-text"><strong>Index fund.</strong> An index comprises five securities, whose return correlations and market values are given. We want to replicate it with \(q=2\) securities.
  ${d22tab3(D, 'en')}
  <ol><li>Write the corresponding integer programme.</li>
  <li>Solve it by evaluating each of the ten possible pairs.</li>
  <li>Give the composition and the weights of the fund.</li></ol></div></li>
</ol></div>`;
};
function d22sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], L = D.L, nm = D.names;
  const ratios = D.c.map((c, i) => D.r[i] / c);
  const ord = D.R.order, fi = D.R.x.findIndex(v => v > 1e-9 && v < 1 - 1e-9);
  const top = D.E.slice(0, 4);
  const setTxt = x => x.map((v, i) => v ? i + 1 : 0).filter(Boolean).join(', ') || '—';
  const pairTab = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${T_(['Paire', 'Pair'])}</th>${nm.map(n => `<th>${n}</th>`).join('')}<th>${T_(['Total', 'Total'])}</th></tr></thead><tbody>${D.pairs.map((p, k) => `<tr><td>${nm[p.a]}, ${nm[p.b]}</td>${[0, 1, 2, 3, 4].map(i => `<td class="num">${fmtT(Math.max(D.rho[i][p.a], D.rho[i][p.b]), 1)}</td>`).join('')}<td class="num">${k === 0 ? '<strong>' + fmtT(p.v, 1) + '</strong>' : fmtT(p.v, 1)}</td></tr>`).join('')}</tbody></table></div>`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['On note', 'Let'])} \(x_i=1\) ${T_(['si le projet', 'if project'])} \(i\) ${T_(['est financé, 0 sinon :', 'is financed, 0 otherwise:'])}
  \[\begin{aligned}\max\ &amp;\ ${D.r.map((v, i) => tex(v, 0) + '\\,x_' + (i + 1)).join('+')}\\\text{${T_(['sous', 's.t.'])} }&amp;\ ${D.c.map((v, i) => tex(v, 0) + '\\,x_' + (i + 1)).join('+')}\le ${tex(D.B, 0)}\qquad x_i\in\{0,1\}\end{aligned}\]
  ${T_(['La relaxation continue remplace', 'The continuous relaxation replaces'])} \(x_i\in\{0,1\}\) ${T_(['par', 'by'])} \(0\le x_i\le 1\). ${T_(['Avec une seule contrainte, on remplit le budget par rapport valeur sur coût décroissant. Les rapports sont', 'With a single constraint, the budget is filled in decreasing order of value-to-cost ratio. The ratios are'])} ${ratios.map((v, i) => (i + 1) + ' : ' + fmtT(v, 3)).join(T_([' ; ', '; ']))}, ${T_(['d\'où l\'ordre', 'hence the order'])} ${ord.map(i => i + 1).join(', ')}. ${T_(['On retient entièrement les projets', 'Projects'])} ${setTxt(D.R.x.map(v => v > 1 - 1e-9 ? 1 : 0))}${T_([', puis le projet', ' are taken in full, then project'])} ${fi + 1} ${T_(['pour la part qui reste', 'for the remaining share'])} :
  \[x_${fi + 1}=\frac{${tex(D.B, 0)}-${tex(D.B - D.R.x[fi] * D.c[fi], 0)}}{${tex(D.c[fi], 0)}}\approx ${tex(D.R.x[fi], 3)}\qquad\text{${T_(['valeur', 'value'])}}\qquad${tex(D.R.val, 2)}\]</p>
  <p><strong>b.</strong> ${T_(['Arrondir', 'Rounding'])} \(x_${fi + 1}\) ${T_(['à 0 garde les projets', 'down to 0 keeps projects'])} ${setTxt(D.down)}, ${T_(['de valeur', 'worth'])} ${fmt(D.downVal, 0)}${T_(['. L\'arrondir à 1 dépasserait le budget.', '. Rounding it up would exceed the budget.'])}</p>
  <p><strong>c.</strong> ${T_(['Il y a', 'There are'])} \(2^5=32\) ${T_(['combinaisons ; les meilleures combinaisons réalisables sont :', 'combinations; the best feasible combinations are:'])}</p>
  <div class="dtable-wrap"><table class="dtable"><thead><tr><th>${T_(['Projets', 'Projects'])}</th><th>${T_(['Coût', 'Cost'])}</th><th>${T_(['Valeur', 'Value'])}</th></tr></thead><tbody>${top.map((e, k) => `<tr><td>${setTxt(e.x)}</td><td class="num">${fmt(e.cost, 0)}</td><td class="num">${k === 0 ? '<strong>' + fmt(e.val, 0) + '</strong>' : fmt(e.val, 0)}</td></tr>`).join('')}</tbody></table></div>
  <p>${T_(['L\'optimum entier finance les projets', 'The integer optimum finances projects'])} ${setTxt(D.I.x)}, ${T_(['pour une valeur de', 'for a value of'])} ${fmt(D.I.val, 0)}. ${T_(['On a bien', 'We do have'])} \(${tex(D.downVal, 0)}&lt;${tex(D.I.val, 0)}\le ${tex(D.R.val, 2)}\) : ${T_(['l\'arrondi est sous-optimal, et la relaxation majore l\'optimum entier, comme toute relaxation d\'un problème de maximisation.', 'rounding is suboptimal, and the relaxation bounds the integer optimum from above, like any relaxation of a maximisation problem.'])}</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> \(x_1+x_2+x_3+x_4+x_5\le ${L.k}\) : ${T_(['la somme compte les projets financés.', 'the sum counts the financed projects.'])}</p>
  <p><strong>b.</strong> \(x_${L.ia}\le x_${L.ib}\) : ${T_(['le seul cas exclu est', 'the only excluded case is'])} \(x_${L.ia}=1\), \(x_${L.ib}=0\), ${T_(['c\'est-à-dire', 'that is,'])} ${L.ia} ${T_(['sans', 'without'])} ${L.ib}.</p>
  <p><strong>c.</strong> \(x_${L.ic}+x_${L.id}\le 1\) : ${T_(['le seul cas exclu est', 'the only excluded case is'])} \(x_${L.ic}=x_${L.id}=1\).</p>
  <p><strong>d.</strong> \(x_${L.ie}\le x_${L.ia}+x_${L.ic}\) : ${T_(['si', 'if'])} \(x_${L.ie}=0\), ${T_(['la contrainte est toujours satisfaite ; si', 'the constraint always holds; if'])} \(x_${L.ie}=1\), ${T_(['elle impose', 'it requires'])} \(x_${L.ia}+x_${L.ic}\ge 1\), ${T_(['c\'est-à-dire au moins l\'un des deux projets.', 'that is, at least one of the two projects.'])}</p>
</div></li>
<li><div class="q-content">
  <p><strong>a.</strong> ${T_(['Avec', 'With'])} \(y_j=1\) ${T_(['si le titre', 'if security'])} \(j\) ${T_(['entre dans le fonds et', 'enters the fund and'])} \(x_{ij}=1\) ${T_(['si', 'if'])} \(j\) ${T_(['représente', 'represents'])} \(i\) :
  \[\begin{aligned}\max\ &amp;\ \sum_{i=1}^{5}\sum_{j=1}^{5}\rho_{ij}\,x_{ij}\\\text{${T_(['sous', 's.t.'])} }&amp;\ \sum_{j=1}^{5}y_j=2,\qquad\sum_{j=1}^{5}x_{ij}=1\ \ (i=1,\ldots,5),\qquad x_{ij}\le y_j,\qquad x_{ij},\,y_j\in\{0,1\}\end{aligned}\]</p>
  <p><strong>b.</strong> ${T_(['Pour une paire de titres retenus, chaque titre est représenté par le plus corrélé des deux ; la ressemblance totale est la somme, sur les cinq titres, du maximum des deux corrélations (un titre retenu se représente lui-même, avec une corrélation de 1) :', 'For a pair of selected securities, each security is represented by the more correlated of the two; total similarity is the sum, over the five securities, of the larger of the two correlations (a selected security represents itself, with a correlation of 1):'])}</p>
  ${pairTab}
  <p>${T_(['La meilleure paire est', 'The best pair is'])} ${nm[D.pairs[0].a]}, ${nm[D.pairs[0].b]}, ${T_(['avec une ressemblance totale de', 'with a total similarity of'])} ${fmtT(D.pairs[0].v, 1)}.</p>
  <p><strong>c.</strong> ${T_(['Chaque titre est affecté à son représentant :', 'Each security is assigned to its representative:'])} ${D.IX.rep.map((j, i) => nm[i] + ' → ' + nm[j]).join(T_([' ; ', '; ']))}. ${T_(['Le poids d\'un titre du fonds est la part de la capitalisation totale', 'The weight of a fund security is the share of total market value'])}, ${D.Vtot}, ${T_(['qu\'il représente :', 'that it represents:'])}
  \[${D.IX.S.map(j => String.raw`w_{${nm[j]}}=\frac{${D.IX.rep.map((r, i) => r === j ? D.V[i] : null).filter(v => v !== null).join('+')}}{${D.Vtot}}\approx ${tex(100 * D.w[j], 1)}\,\%`).join('\\qquad ')}\]</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d22sol(D, 'fr');
I18N.en.sol = D => d22sol(D, 'en');
