/* ============================================================
   PAGE ei4 — Stackelberg, Cournot et Bowley
   ============================================================ */
const GREY = '#8a857a';
const KBASE_FR = { 'k-badge': 'MICROÉCONOMIE', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer', 'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé', phSeed: 'auto', copy: 'Copier', copied: 'Copié', 'k-sub': '© Thomas Hossen – Version du 20 octobre 2026' };
const KBASE_EN = { 'k-badge': 'MICROECONOMICS', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate', 'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution', phSeed: 'auto', copy: 'Copy', copied: 'Copied', 'k-sub': '© Thomas Hossen – Version of 20 October 2026' };
/* ---------- calcul exact : reconnaissance des rationnels et affichage fractionnaire ---------- */
function ratOf(x) {
  if (!isFinite(x)) return null;
  const s = x < 0 ? -1 : 1, y = Math.abs(x);
  if (Math.abs(y - Math.round(y)) <= 1e-11 * Math.max(1, y)) return [s * Math.round(y), 1];
  let h0 = 0, h1 = 1, k0 = 1, k1 = 0, z = y;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(z), h2 = a * h1 + h0, k2 = a * k1 + k0;
    if (k2 > 2e6) return null;
    if (Math.abs(y - h2 / k2) <= 1e-12 * Math.max(1, y)) return [s * h2, k2];
    h0 = h1; h1 = h2; k0 = k1; k1 = k2;
    const f = z - a; if (f < 1e-15) return null; z = 1 / f;
  }
  return null;
}
/* valeur exacte : entier ou fraction ; décimale si le nombre n'est pas rationnel (racine, puissance non entière) */
function fq(x) {
  const r = ratOf(x);
  if (!r) return texT(x, 4);
  if (r[1] === 1) return texT(r[0], 0);
  return (r[0] < 0 ? '-' : '') + '\\frac{' + texT(Math.abs(r[0]), 0) + '}{' + texT(r[1], 0) + '}';
}
/* valeur exacte suivie d'une approximation décimale */
function fqa(x) {
  const r = ratOf(x);
  if (!r) return texT(x, 4);
  if (r[1] === 1) return texT(r[0], 0);
  return fq(x) + '\\approx ' + texT(x, Math.abs(x) >= 100 ? 2 : 4);
}
/* entre parenthèses si fraction ou négatif (avant un exposant) */
function fqp(x) { const r = ratOf(x), t = fq(x); return (r && r[1] === 1 && r[0] >= 0) || (!r && x >= 0) ? t : '\\left(' + t + '\\right)'; }
/* cellule de tableau : valeur exacte, approximation en petit */
function fqt(x) { const r = ratOf(x); return '\\(' + fq(x) + '\\)' + (r && r[1] === 1 ? '' : '<br><small>≈ ' + fmt(x, 2) + '</small>'); }

/* signe = si la valeur est exacte (rationnelle), sinon approximation */
function eqa(x) { return ratOf(x) ? '=' + fqa(x) : '\\approx ' + texT(x, 4); }
/* simplification d'affichage : \frac{X}{1} devient X (entre parenthèses si nécessaire) */
function fracClean(h) {
  const grp = (s, i) => { if (s[i] !== '{') return -1; let d = 0; for (let j = i; j < s.length; j++) { if (s[j] === '{') d++; else if (s[j] === '}') { d--; if (d === 0) return j; } } return -1; };
  let out = '', i = 0;
  for (;;) {
    const re = /\\[td]?frac\{/g; re.lastIndex = i; const mm = re.exec(h);
    if (!mm) { out += h.slice(i); break; }
    const k = mm.index, cmd = mm[0].slice(0, -1), a = k + cmd.length, ae = grp(h, a), b = ae + 1, be = ae > 0 ? grp(h, b) : -1;
    if (ae < 0 || be < 0) { out += h.slice(i, a + 1); i = a + 1; continue; }
    const num = h.slice(a + 1, ae), den = h.slice(b + 1, be).trim();
    if (den === '1') {
      let top = false, d = 0; for (let j = 0; j < num.length; j++) { const c = num[j]; if (c === '{') d++; else if (c === '}') d--; else if ((c === '+' || c === '-') && d === 0 && j > 0) top = true; }
      const rest = h.slice(be + 1), end = /^(\s*$|\\\]|\\\)|=|&|\\\\|\\qquad|\\quad|\\text|\\iff|&lt;|&gt;|\s*[,;.<}])/.test(rest);
      out += h.slice(i, k) + (top && !end ? '\\left(' + fracClean(num) + '\\right)' : fracClean(num));
    } else out += h.slice(i, k) + cmd + '{' + fracClean(num) + '}{' + fracClean(h.slice(b + 1, be)) + '}';
    i = be + 1;
  }
  return out;
}
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 4 – Stackelberg contre Cournot', 'k-h1': 'Stackelberg contre Cournot', 'k-coursetitle': 'Jouer en premier : leader, suiveur, avantage du premier joueur et guerre de Stackelberg', 'k-extitle': 'Cournot, Stackelberg et Bowley avec des coûts quadratiques', 'k-soltitle': 'Cournot, Stackelberg et Bowley avec des coûts quadratiques' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 4 – Stackelberg versus Cournot', 'k-h1': 'Stackelberg versus Cournot', 'k-coursetitle': 'Moving first: leader, follower, first-mover advantage and Stackelberg warfare', 'k-extitle': 'Cournot, Stackelberg and Bowley with quadratic costs', 'k-soltitle': 'Cournot, Stackelberg and Bowley with quadratic costs' });

const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : fq(x) + '\\,';
/* ---------- outils : P = a - bQ, C_i = c_i q_i + e_i q_i^2 / 2 ---------- */
function e4model(a, b, c, e) {
  const al = [0, 1].map(i => (a - c[i]) / (2 * b + e[i])), be = [0, 1].map(i => b / (2 * b + e[i]));
  const R = (i, qj) => Math.max(0, al[i] - be[i] * qj);
  const prof = (i, q) => (a - b * (q[0] + q[1])) * q[i] - c[i] * q[i] - e[i] * q[i] * q[i] / 2;
  const cour = [(al[0] - be[0] * al[1]) / (1 - be[0] * be[1]), (al[1] - be[1] * al[0]) / (1 - be[0] * be[1])];
  const lead = L => { const F = 1 - L; return (a - b * al[F] - c[L]) / (2 * b * (1 - be[F]) + e[L]); };
  const stack = L => { const F = 1 - L, q = [0, 0]; q[L] = lead(L); q[F] = R(F, q[L]); return q; };
  const bow = [lead(0), lead(1)];
  const pack = q => ({ q: q, P: a - b * (q[0] + q[1]), pi: [prof(0, q), prof(1, q)] });
  return { al: al, be: be, R: R, prof: prof, C: pack(cour), S0: pack(stack(0)), S1: pack(stack(1)), B: pack(bow) };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez résoudre un duopole de Stackelberg par induction à rebours, le comparer à l'équilibre de Cournot, expliquer l'avantage du premier joueur à l'aide des courbes d'isoprofit, et analyser la situation de Bowley, où chaque entreprise se croit leader.<br><br>
<strong>Pourquoi ?</strong> Sur beaucoup de marchés, une entreprise installée choisit ses capacités avant ses concurrents, qui s'adaptent ensuite. Pouvoir s'engager le premier est un atout stratégique ; vouloir le faire à deux mène à la surproduction.<br><br>
<strong>Prérequis.</strong> Le duopole de Cournot (page 3), induction à rebours.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le jeu séquentiel</a> · <a href="#s2">2. Le suiveur</a> · <a href="#s3">3. Le leader</a> · <a href="#s4">4. Comparaison avec Cournot</a> · <a href="#s5">5. Bowley</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Un jeu séquentiel</div>
<p>Dans le modèle de Stackelberg (1934), une entreprise, le <em>leader</em>, choisit sa quantité en premier ; l'autre, le <em>suiveur</em>, observe ce choix puis choisit la sienne. Le leader sait que le suiveur réagira de façon optimale à ce qu'il observe : il intègre la fonction de réaction du suiveur dans son propre calcul. On résout le jeu par <em>induction à rebours</em> : d'abord la décision du suiveur, pour chaque quantité possible du leader, puis celle du leader.</p>

<div class="dossier-title" id="s2">2. La décision du suiveur</div>
<p>Le suiveur \(F\) maximise son profit pour la quantité \(q_L\) observée : il joue sa fonction de réaction, la même que dans le modèle de Cournot. Avec \(P=a-bQ\) et \(C_i(q_i)=c_iq_i+\frac{e_i}{2}q_i^2\), la condition du premier ordre \(a-2bq_F-bq_L-c_F-e_Fq_F=0\) donne :
\[q_F=R_F(q_L)=\alpha_F-\beta_F\,q_L,\qquad\alpha_F=\frac{a-c_F}{2b+e_F},\quad\beta_F=\frac{b}{2b+e_F}\]</p>

<div class="dossier-title" id="s3">3. La décision du leader</div>
<p>Le leader remplace \(q_F\) par \(R_F(q_L)\) dans son profit, qui ne dépend plus que de sa propre quantité :
\[\Pi_L(q_L)=\big(a-bq_L-b\,R_F(q_L)\big)\,q_L-c_Lq_L-\frac{e_L}{2}q_L^2=\big(a-b\alpha_F-c_L\big)\,q_L-\Big(b(1-\beta_F)+\frac{e_L}{2}\Big)\,q_L^2\]
La condition du premier ordre donne :
\[q_L^S=\frac{a-b\alpha_F-c_L}{2b(1-\beta_F)+e_L},\qquad q_F^S=R_F(q_L^S)\]
Le leader tient compte du fait qu'en produisant plus, il pousse le suiveur à produire moins : la demande qui lui reste baisse moins vite que s'il prenait \(q_F\) comme donné. C'est pourquoi il produit plus qu'à l'équilibre de Cournot.</p>

<div class="dossier-title" id="s4">4. Comparaison avec Cournot et courbes d'isoprofit</div>
<p>Une <em>courbe d'isoprofit</em> du leader rassemble les couples \((q_L,q_F)\) qui lui donnent le même profit ; plus elle est basse, plus le profit est élevé, puisque le suiveur produit moins. À l'équilibre de Cournot, l'isoprofit du leader est horizontale (sa dérivée par rapport à \(q_L\) est nulle) et elle coupe la fonction de réaction du suiveur. Le leader peut faire mieux en se déplaçant le long de cette fonction de réaction jusqu'au point où elle est tangente à une isoprofit plus basse : c'est l'équilibre de Stackelberg. Par rapport à Cournot, le leader produit plus et gagne plus, le suiveur produit moins et gagne moins, la production totale augmente et le prix baisse. C'est l'<em>avantage du premier joueur</em>, qui repose sur la crédibilité de l'engagement : une fois sa quantité produite, le leader ne peut plus revenir dessus.</p>
<div class="ifig" data-fig="iso"></div>
<div class="fig-cap">Figure 1 — Fonction de réaction du suiveur (doré) et courbes d'isoprofit du leader passant par l'équilibre de Cournot (pointillés) et par l'équilibre de Stackelberg (bleu), pour les données du devoir : \(P=4-Q\), \(C_1=q_1\), \(C_2=q_2^2/2\). L'isoprofit de Stackelberg est tangente à la réaction du suiveur, et plus basse : le leader gagne davantage. Changez le leader pour comparer.</div>

<div class="dossier-title" id="s5">5. Bowley : quand chacun se croit leader</div>
<p>Si chaque entreprise se comporte en leader, en supposant que l'autre suivra sa fonction de réaction, chacune produit sa quantité de leader de Stackelberg. Aucune ne joue en réalité sa meilleure réponse : la production totale dépasse celle de Stackelberg et le prix baisse fortement. Les profits sont alors généralement inférieurs à ceux de Cournot, et peuvent devenir négatifs, ce qui pousse l'une des entreprises à sortir du marché. Cette situation de déséquilibre, dite de Bowley ou « guerre de Stackelberg », montre que l'avantage du premier joueur n'existe que si les rôles sont clairement établis.</p>
<div class="ifig" data-fig="cmp"></div>
<div class="fig-cap">Figure 2 — Quantités, prix et profits dans les quatre situations, pour les données de la figure 1 : Cournot, Stackelberg avec chacune des deux entreprises comme leader, et Bowley. Le leader gagne toujours plus qu'en Cournot ; en Bowley, les deux entreprises gagnent moins.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Stackelberg se résout à rebours : réaction du suiveur, puis maximisation du leader qui l'anticipe.</li>
<li>Le leader produit plus et gagne plus qu'en Cournot ; le suiveur produit moins et gagne moins ; le prix baisse.</li>
<li>L'équilibre de Stackelberg est le point de la fonction de réaction du suiveur tangent à une isoprofit du leader.</li>
<li>Bowley : si chacun se croit leader, la surproduction fait chuter le prix et les profits.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can solve a Stackelberg duopoly by backward induction, compare it with the Cournot equilibrium, explain the first-mover advantage using isoprofit curves, and analyse the Bowley situation, in which each firm believes it is the leader.<br><br>
<strong>Why?</strong> In many markets, an incumbent chooses its capacity before its rivals, who then adapt. Being able to commit first is a strategic asset; both trying to do so leads to overproduction.<br><br>
<strong>Prerequisites.</strong> The Cournot duopoly (page 3), backward induction.
</div>
<p class="toc">Contents: <a href="#s1">1. The sequential game</a> · <a href="#s2">2. The follower</a> · <a href="#s3">3. The leader</a> · <a href="#s4">4. Comparison with Cournot</a> · <a href="#s5">5. Bowley</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. A sequential game</div>
<p>In the Stackelberg model (1934), one firm, the <em>leader</em>, chooses its quantity first; the other, the <em>follower</em>, observes this choice and then chooses its own. The leader knows that the follower will react optimally to what it observes: it builds the follower's reaction function into its own computation. The game is solved by <em>backward induction</em>: first the follower's decision, for each possible quantity of the leader, then the leader's.</p>

<div class="dossier-title" id="s2">2. The follower's decision</div>
<p>The follower \(F\) maximises its profit for the observed quantity \(q_L\): it plays its reaction function, the same as in the Cournot model. With \(P=a-bQ\) and \(C_i(q_i)=c_iq_i+\frac{e_i}{2}q_i^2\), the first-order condition \(a-2bq_F-bq_L-c_F-e_Fq_F=0\) gives:
\[q_F=R_F(q_L)=\alpha_F-\beta_F\,q_L,\qquad\alpha_F=\frac{a-c_F}{2b+e_F},\quad\beta_F=\frac{b}{2b+e_F}\]</p>

<div class="dossier-title" id="s3">3. The leader's decision</div>
<p>The leader replaces \(q_F\) by \(R_F(q_L)\) in its profit, which then depends only on its own quantity:
\[\Pi_L(q_L)=\big(a-bq_L-b\,R_F(q_L)\big)\,q_L-c_Lq_L-\frac{e_L}{2}q_L^2=\big(a-b\alpha_F-c_L\big)\,q_L-\Big(b(1-\beta_F)+\frac{e_L}{2}\Big)\,q_L^2\]
The first-order condition gives:
\[q_L^S=\frac{a-b\alpha_F-c_L}{2b(1-\beta_F)+e_L},\qquad q_F^S=R_F(q_L^S)\]
The leader takes into account that producing more pushes the follower to produce less: the demand left to it falls more slowly than if it took \(q_F\) as given. This is why it produces more than in the Cournot equilibrium.</p>

<div class="dossier-title" id="s4">4. Comparison with Cournot and isoprofit curves</div>
<p>An <em>isoprofit curve</em> of the leader gathers the pairs \((q_L,q_F)\) that give it the same profit; the lower it is, the higher the profit, since the follower produces less. At the Cournot equilibrium, the leader's isoprofit is horizontal (its derivative with respect to \(q_L\) is zero) and it crosses the follower's reaction function. The leader can do better by moving along that reaction function to the point where it is tangent to a lower isoprofit: this is the Stackelberg equilibrium. Compared with Cournot, the leader produces more and earns more, the follower produces less and earns less, total output rises and the price falls. This is the <em>first-mover advantage</em>, which rests on the credibility of the commitment: once its quantity is produced, the leader cannot go back on it.</p>
<div class="ifig" data-fig="iso"></div>
<div class="fig-cap">Figure 1 — Follower's reaction function (gold) and the leader's isoprofit curves through the Cournot equilibrium (dashed) and the Stackelberg equilibrium (blue), for the homework data: \(P=4-Q\), \(C_1=q_1\), \(C_2=q_2^2/2\). The Stackelberg isoprofit is tangent to the follower's reaction function, and lower: the leader earns more. Switch the leader to compare.</div>

<div class="dossier-title" id="s5">5. Bowley: when each firm believes it leads</div>
<p>If each firm behaves as a leader, assuming that the other will follow its reaction function, each produces its Stackelberg leader quantity. Neither actually plays its best response: total output exceeds the Stackelberg level and the price falls sharply. Profits are then usually below Cournot profits, and may become negative, which pushes one of the firms out of the market. This disequilibrium situation, called Bowley or "Stackelberg warfare", shows that the first-mover advantage only exists if roles are clearly established.</p>
<div class="ifig" data-fig="cmp"></div>
<div class="fig-cap">Figure 2 — Quantities, price and profits in the four situations, for the data of figure 1: Cournot, Stackelberg with each firm as leader, and Bowley. The leader always earns more than under Cournot; under Bowley, both firms earn less.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Stackelberg is solved backwards: the follower's reaction, then the maximisation of the leader who anticipates it.</li>
<li>The leader produces more and earns more than under Cournot; the follower produces less and earns less; the price falls.</li>
<li>The Stackelberg equilibrium is the point of the follower's reaction function tangent to an isoprofit of the leader.</li>
<li>Bowley: if each firm believes it leads, overproduction drives price and profits down.</li>
</ul>`;

/* ---------- figures ---------- */
const E4_EX = { a: 4, b: 1, c: [1, 0], e: [0, 1] };
I18N.fr.f = {
  lead: 'Leader', l1: 'entreprise 1', l2: 'entreprise 2', rf: 'réaction du suiveur', isoC: 'isoprofit (Cournot)', isoS: 'isoprofit (Stackelberg)', isoAria: 'Fonction de réaction du suiveur et isoprofits du leader',
  isoRead: (M, L) => { const S = L === 0 ? M.S0 : M.S1; return `Cournot : profit du leader <span class="v">${fmt(M.C.pi[L], 3)}</span> &nbsp;·&nbsp; Stackelberg : <i>q</i><sub>L</sub> = <span class="v">${fmt(S.q[L], 3)}</span>, <i>q</i><sub>F</sub> = <span class="v">${fmt(S.q[1 - L], 3)}</span>, profit du leader <span class="v">${fmt(S.pi[L], 3)}</span>`; },
  sit: ['Cournot', 'Stackelberg, 1 leader', 'Stackelberg, 2 leader', 'Bowley'], pi1: 'profit de 1', pi2: 'profit de 2', P: 'prix', cmpAria: 'Profits et prix dans les quatre situations',
  cmpRead: (M) => `Prix : Cournot <span class="v">${fmt(M.C.P, 3)}</span> ; 1 leader <span class="v">${fmt(M.S0.P, 3)}</span> ; 2 leader <span class="v">${fmt(M.S1.P, 3)}</span> ; Bowley <span class="v">${fmt(M.B.P, 3)}</span>`
};
I18N.en.f = {
  lead: 'Leader', l1: 'firm 1', l2: 'firm 2', rf: 'follower\'s reaction', isoC: 'isoprofit (Cournot)', isoS: 'isoprofit (Stackelberg)', isoAria: 'Follower\'s reaction function and leader\'s isoprofits',
  isoRead: (M, L) => { const S = L === 0 ? M.S0 : M.S1; return `Cournot: leader's profit <span class="v">${fmt(M.C.pi[L], 3)}</span> &nbsp;·&nbsp; Stackelberg: <i>q</i><sub>L</sub> = <span class="v">${fmt(S.q[L], 3)}</span>, <i>q</i><sub>F</sub> = <span class="v">${fmt(S.q[1 - L], 3)}</span>, leader's profit <span class="v">${fmt(S.pi[L], 3)}</span>`; },
  sit: ['Cournot', 'Stackelberg, 1 leads', 'Stackelberg, 2 leads', 'Bowley'], pi1: 'profit of 1', pi2: 'profit of 2', P: 'price', cmpAria: 'Profits and price in the four situations',
  cmpRead: (M) => `Price: Cournot <span class="v">${fmt(M.C.P, 3)}</span>; 1 leads <span class="v">${fmt(M.S0.P, 3)}</span>; 2 leads <span class="v">${fmt(M.S1.P, 3)}</span>; Bowley <span class="v">${fmt(M.B.P, 3)}</span>`
};
FIGS.iso = {
  state: { L: '2' },
  controls: L => [{ key: 'L', type: 'select', label: L.f.lead, options: [{ v: '1', t: L.f.l1 }, { v: '2', t: L.f.l2 }] }],
  draw: function (s, lang) {
    const L = I18N[lang].f, M = e4model(E4_EX.a, E4_EX.b, E4_EX.c, E4_EX.e), ld = s.L === '1' ? 0 : 1, fw = 1 - ld;
    const G = Plot({ w: 520, h: 420, x0: 0, x1: 3, y0: 0, y1: 3, mt: 26, mb: 42, ml: 46 });
    G.axes({ xt: [0, 1, 2, 3], yt: [0, 1, 2, 3], xl: 'q_L', yl: 'q_F', xf: v => String(v), yf: v => String(v) });
    G.clip();
    const a = E4_EX.a, b = E4_EX.b, c = E4_EX.c, e = E4_EX.e;
    /* isoprofit du leader : (a - b qL - b qF - cL) qL - eL qL^2/2 = K  => qF = (a - b qL - cL - eL qL/2 - K/qL)/b */
    const iso = K => G.sample(qL => (a - b * qL - c[ld] - e[ld] * qL / 2 - K / qL) / b, 0.05, 3, 200);
    const S = ld === 0 ? M.S0 : M.S1;
    G.line(iso(M.C.pi[ld]), { c: COL.s1, w: 1.4, dash: '5 4', clip: true });
    G.line(iso(S.pi[ld]), { c: COL.s1, w: 2.2, clip: true });
    G.line([[0, M.al[fw]], [M.al[fw] / M.be[fw], 0]], { c: COL.s2, w: 2.4, clip: true });
    G.dot(M.C.q[ld], M.C.q[fw], { c: GREY, r: 5 }); G.text(M.C.q[ld], M.C.q[fw], 'C', { dx: -8, dy: -8, size: 12, bold: true, c: COL.mute });
    G.dot(S.q[ld], S.q[fw], { c: COL.s3, r: 6 }); G.text(S.q[ld], S.q[fw], 'S', { dx: 10, dy: -6, size: 12, bold: true, c: COL.s3 });
    G.legend([{ c: COL.s2, t: L.rf }, { c: COL.s1, dash: '5 4', t: L.isoC }, { c: COL.s1, t: L.isoS }], G.ml + 8, 16);
    return { svg: G.svg(L.isoAria), read: L.isoRead(M, ld) };
  }
};
FIGS.cmp = {
  state: {},
  controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, M = e4model(E4_EX.a, E4_EX.b, E4_EX.c, E4_EX.e), sits = [M.C, M.S0, M.S1, M.B];
    const ymax = 2.2, ymin = Math.min(0, ...sits.map(x => Math.min(x.pi[0], x.pi[1]))) - 0.1;
    const G = Plot({ w: 680, h: 300, x0: 0.4, x1: 4.6, y0: ymin, y1: ymax, mt: 30, mb: 42 });
    G.axes({ xt: [1, 2, 3, 4], yt: ticks(Math.floor(ymin * 2) / 2, ymax, 5), xf: v => L.sit[v - 1], yf: v => fmtT(v, 1), xAxisAt: 0 });
    sits.forEach((x, i) => { G.bar(i + 1 - 0.17, 44, x.pi[0], { c: COL.s1, o: 0.85 }); G.bar(i + 1 + 0.17, 44, x.pi[1], { c: COL.s2, o: 0.85 }); G.dot(i + 1, x.P, { c: COL.s3, r: 5 }); });
    G.legend([{ c: COL.s1, box: true, t: L.pi1 }, { c: COL.s2, box: true, t: L.pi2 }, { c: COL.s3, box: true, t: L.P }], G.ml + 8, 16);
    return { svg: G.svg(L.cmpAria), read: L.cmpRead(M) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([20, 40, 60, 100]); D.b = pick([1, 2, 4]); D.c = [rint(0, 6), rint(0, 6)]; D.e = [pick([0, 0.5, 1, 1.5, 2]), pick([0, 0.5, 1, 1.5, 2])];
    if (D.e[0] === 0 && D.e[1] === 0) continue;
    D.L = rint(0, 1); D.F = 1 - D.L;
    D.M = e4model(D.a, D.b, D.c, D.e);
    const M = D.M, S = D.L === 0 ? M.S0 : M.S1;
    if ([M.C, S, M.B].some(x => x.q.some(v => v <= 0.2) || x.P <= 0)) continue;
    if (!(S.pi[D.L] > M.C.pi[D.L] && S.pi[D.F] < M.C.pi[D.F])) continue;
    D.S = S; break;
  }
  const b = D.b;
  [D.M.C, D.S, D.M.B].forEach(x => { const Q = x.q[0] + x.q[1]; x.Q = Q; x.SC = b * Q * Q / 2; x.W = x.SC + x.pi[0] + x.pi[1]; });
  /* optimum : prix = coût marginal de chaque entreprise ; maximum du surplus total */
  return D;
};
const e4C = (D, i) => String.raw`C_${i + 1}(q_${i + 1})=${D.c[i] ? D.c[i] + '\\,q_' + (i + 1) : ''}${D.e[i] ? (D.c[i] ? '+' : '') + (D.e[i] === 2 ? '' : D.e[i] === 1 ? '\\frac{1}{2}' : fq(D.e[i] / 2, 2) + '\\,') + 'q_' + (i + 1) + '^2' : ''}${!D.c[i] && !D.e[i] ? '0' : ''}`;
const e4Cm = (D, i, v) => { const c = D.c[i], e = D.e[i]; if (!e) return String(c); return (c ? c + '+' : '') + cfx(e) + v; };
function e4graph(D, lang) {
  const fr = lang === 'fr', M = D.M, S = D.S, top = Math.max(M.B.q[0], M.B.q[1], M.C.q[0], M.C.q[1], S.q[0], S.q[1]) * 1.9;
  const G = Plot({ w: 520, h: 420, x0: 0, x1: top, y0: 0, y1: top, mt: 26, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, top, 4), yt: ticks(0, top, 4), xl: 'q₁', yl: 'q₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  G.line([[M.al[0], 0], [0, M.al[0] / M.be[0]]], { c: COL.s1, w: 2.4, clip: true });
  G.line([[0, M.al[1]], [M.al[1] / M.be[1], 0]], { c: COL.s2, w: 2.4, clip: true });
  const pt = (x, lab, col) => { G.dot(x.q[0], x.q[1], { c: col, r: 6 }); G.text(x.q[0], x.q[1], lab, { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12, c: col }); };
  G.dot(M.C.q[0], M.C.q[1], { c: COL.ink, r: 6 }); G.text(M.C.q[0], M.C.q[1], 'C', { dx: -10, dy: 16, anchor: 'end', bold: true, size: 12 }); pt(S, 'S', COL.s3); pt(M.B, 'B', COL.s4 || COL.s3);
  G.legend([{ c: COL.s1, t: 'R₁' }, { c: COL.s2, t: 'R₂' }], G.ml + 160, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Fonctions de réaction et équilibres' : 'Reaction functions and equilibria') + '</div>';
}
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Deux entreprises produisent un bien homogène de demande inverse \(P(Q)=${D.a}-${cfx(D.b)}Q\), avec \(Q=q_1+q_2\). Leurs coûts sont \(${e4C(D, 0)}\) et \(${e4C(D, 1)}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Déterminez les fonctions de réaction et l'équilibre de Cournot : quantités, prix, profits.</div></li>
<li><div class="q-text">L'entreprise ${D.L + 1} est en position dominante : elle choisit sa quantité en premier, l'entreprise ${D.F + 1} observe ce choix avant de choisir la sienne. Déterminez l'équilibre de Stackelberg par induction à rebours.</div></li>
<li><div class="q-text">Chaque entreprise se croit en position dominante et produit sa quantité de leader (situation de Bowley). Calculez les quantités, le prix et les profits.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs et le surplus de chaque producteur dans les trois situations, puis le surplus total. Comparez et commentez.</div></li>
<li><div class="q-text">Représentez graphiquement les fonctions de réaction et les trois situations.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Two firms produce a homogeneous good with inverse demand \(P(Q)=${D.a}-${cfx(D.b)}Q\), with \(Q=q_1+q_2\). Their costs are \(${e4C(D, 0)}\) and \(${e4C(D, 1)}\).</div>
<div class="questions"><ol>
<li><div class="q-text">Determine the reaction functions and the Cournot equilibrium: quantities, price, profits.</div></li>
<li><div class="q-text">Firm ${D.L + 1} is dominant: it chooses its quantity first, and firm ${D.F + 1} observes this choice before choosing its own. Determine the Stackelberg equilibrium by backward induction.</div></li>
<li><div class="q-text">Each firm believes it is dominant and produces its leader quantity (Bowley situation). Compute the quantities, the price and the profits.</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus and each producer's surplus in the three situations, then total surplus. Compare and comment.</div></li>
<li><div class="q-text">Draw the reaction functions and the three situations.</div></li>
</ol></div>`;
});
function e4sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], M = D.M, a = D.a, b = D.b, c = D.c, e = D.e, n4 = x => texT(x, 4), Lr = D.L, Fw = D.F, S = D.S;
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), bx = b === 1 ? '' : texT(b, 2) + '\\times ';
  const foc = i => String.raw`${a}-${cfx(2 * b)}q_${i + 1}-${cfx(b)}q_${2 - i}${c[i] ? '-' + c[i] : ''}${e[i] ? '-' + cfx(e[i]) + 'q_' + (i + 1) : ''}=0`;
  const coefL = b * (1 - M.be[Fw]) + e[Lr] / 2, linL = a - b * M.al[Fw] - c[Lr];
  const priceLine = x => String.raw`P=${a}-${bx}(${n4(x.q[0])}+${n4(x.q[1])})=${n4(x.P)}`;
  const spI = (x, i) => String.raw`\int_0^{${n4(x.q[i])}}\big(${n4(x.P)}-${e[i] ? '(' + e4Cm(D, i, 'q') + ')' : c[i]}\big)\,dq=${n4(x.P - c[i])}\times ${n4(x.q[i])}${e[i] ? '-' + (e[i] === 2 ? '' : n4(e[i] / 2) + '\\times ') + fqp(x.q[i]) + '^2' : ''}=${n4(x.pi[i])}`;
  const scI = x => String.raw`\int_0^{${n4(x.Q)}}\big(${a}-${cfx(b)}q-${n4(x.P)}\big)\,dq=\Big[${n4(a - x.P)}\,q-${cfx(b / 2)}q^2\Big]_0^{${n4(x.Q)}}=${n4(x.SC)}`;
  const block = (x, nm) => String.raw`\[\begin{aligned}${SC}^{${nm}}&amp;=${scI(x)}\\${SP}_1^{${nm}}&amp;=${spI(x, 0)}\\${SP}_2^{${nm}}&amp;=${spI(x, 1)}\end{aligned}\]`;
  const rows = [['Cournot', M.C], ['Stackelberg', S], ['Bowley', M.B]];
  const tab = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>\\(Q\\)</th><th>\\(P\\)</th><th>${SC}</th><th>\\(${SP}_1\\)</th><th>\\(${SP}_2\\)</th><th>${T_(['Surplus total', 'Total surplus'])}</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td class="num">${fqt(r[1].Q)}</td><td class="num">${fqt(r[1].P)}</td><td class="num">${fqt(r[1].SC)}</td><td class="num">${fqt(r[1].pi[0])}</td><td class="num">${fqt(r[1].pi[1])}</td><td class="num">${fqt(r[1].W)}</td></tr>`).join('')}</tbody></table></div>`;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le profit de l\'entreprise', 'The profit of firm'])} \(i\) ${T_(['est sa recette, au prix fixé par la demande totale, diminuée de son coût :', 'is its revenue, at the price set by total demand, minus its cost:'])} \(\Pi_i=(${a}-${cfx(b)}q_1-${cfx(b)}q_2)\,q_i-C_i(q_i)\). ${T_(['Pour une quantité donnée de sa concurrente, chaque entreprise annule la dérivée de son profit par rapport à sa propre quantité ; on en déduit les fonctions de réaction :', 'For a given rival quantity, each firm sets the derivative of its profit with respect to its own quantity to zero; this gives the reaction functions:'])}
  \[\begin{aligned}\frac{\partial\Pi_1}{\partial q_1}=0&amp;\iff ${foc(0)}\iff q_1=R_1(q_2)=${n4(M.al[0])}-${n4(M.be[0])}\,q_2\\\frac{\partial\Pi_2}{\partial q_2}=0&amp;\iff ${foc(1)}\iff q_2=R_2(q_1)=${n4(M.al[1])}-${n4(M.be[1])}\,q_1\end{aligned}\]
  ${T_(['À l\'équilibre de Cournot, chaque quantité est la meilleure réponse à l\'autre. En reportant', 'At the Cournot equilibrium, each quantity is the best response to the other. Substituting'])} \(R_2\) ${T_(['dans', 'into'])} \(R_1\), ${T_(['on obtient', 'we get'])} \(q_1=${n4(M.al[0])}-${n4(M.be[0])}\,(${n4(M.al[1])}-${n4(M.be[1])}\,q_1)\), ${T_(['d\'où :', 'hence:'])}
  \[q_1^C=\frac{${n4(M.al[0])}-${n4(M.be[0])}\times ${n4(M.al[1])}}{1-${n4(M.be[0])}\times ${n4(M.be[1])}}=${fqa(M.C.q[0])}\qquad q_2^C=R_2(q_1^C)=${fqa(M.C.q[1])}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix d\'équilibre sur le marché :', 'The inverse demand function then gives the equilibrium market price:'])}
  \[${priceLine(M.C)}\]
  ${T_(['Les profits valent alors', 'Profits are then'])} \(\Pi_1^C=${fqa(M.C.pi[0])}\) ${T_(['et', 'and'])} \(\Pi_2^C=${fqa(M.C.pi[1])}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['On raisonne par induction à rebours, en commençant par la décision du suiveur, l\'entreprise', 'We reason by backward induction, starting with the decision of the follower, firm'])} ${Fw + 1}. ${T_(['Quelle que soit la quantité observée du leader, elle joue sa meilleure réponse, c\'est-à-dire sa fonction de réaction de la question 1 :', 'Whatever the leader\'s observed quantity, it plays its best response, that is, its reaction function from question 1:'])} \(q_${Fw + 1}=${n4(M.al[Fw])}-${n4(M.be[Fw])}\,q_${Lr + 1}\). ${T_(['Le leader anticipe cette réaction et l\'intègre dans son profit, qui ne dépend plus que de sa propre quantité :', 'The leader anticipates this reaction and builds it into its profit, which then depends only on its own quantity:'])}
  \[\begin{aligned}\Pi_${Lr + 1}(q_${Lr + 1})&amp;=\big(${a}-${cfx(b)}q_${Lr + 1}-${cfx(b)}(${n4(M.al[Fw])}-${n4(M.be[Fw])}\,q_${Lr + 1})\big)\,q_${Lr + 1}-C_${Lr + 1}(q_${Lr + 1})\\&amp;=${n4(linL)}\,q_${Lr + 1}-${n4(coefL)}\,q_${Lr + 1}^2&amp;&amp;\text{${T_(['en développant', 'expanding'])}}\end{aligned}\]
  ${T_(['Le leader annule la dérivée de ce profit :', 'The leader sets the derivative of this profit to zero:'])} \(${n4(linL)}-${n4(2 * coefL)}\,q_${Lr + 1}=0\), ${T_(['soit', 'that is'])} \(q_${Lr + 1}^S=\frac{${n4(linL)}}{${n4(2 * coefL)}}=${fqa(S.q[Lr])}\). ${T_(['On en déduit la quantité du suiveur en reportant ce résultat dans sa fonction de réaction :', 'The follower\'s quantity follows by substituting this result into its reaction function:'])} \(q_${Fw + 1}^S=${n4(M.al[Fw])}-${n4(M.be[Fw])}\times ${n4(S.q[Lr])}=${fqa(S.q[Fw])}\). ${T_(['D\'après la fonction de demande inverse, le prix d\'équilibre est alors :', 'From the inverse demand function, the equilibrium price is then:'])}
  \[${priceLine(S)}\]
  ${T_(['et les profits valent', 'and profits are'])} \(\Pi_1^S=${fqa(S.pi[0])}\) ${T_(['et', 'and'])} \(\Pi_2^S=${fqa(S.pi[1])}\). ${T_(['Le leader produit plus et gagne plus qu\'en Cournot, le suiveur produit moins et gagne moins : c\'est l\'avantage du premier joueur.', 'The leader produces more and earns more than under Cournot, the follower produces less and earns less: this is the first-mover advantage.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Chaque entreprise produit la quantité qu\'elle choisirait comme leader, calculée comme à la question 2 en supposant que l\'autre suit sa fonction de réaction :', 'Each firm produces the quantity it would choose as leader, computed as in question 2 assuming that the other follows its reaction function:'])} \(q_1^B=${fqa(M.B.q[0])}\) ${T_(['et', 'and'])} \(q_2^B=${fqa(M.B.q[1])}\). ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix sur le marché :', 'The inverse demand function then gives the market price:'])}
  \[${priceLine(M.B)}\]
  ${T_(['et les profits', 'and the profits'])} \(\Pi_1^B=${fqa(M.B.pi[0])}\) ${T_(['et', 'and'])} \(\Pi_2^B=${fqa(M.B.pi[1])}\). ${T_(['Aucune entreprise ne joue sa meilleure réponse à la quantité effective de l\'autre : la production totale dépasse celle des deux équilibres et le prix est le plus bas des trois situations.', 'Neither firm plays its best response to the other\'s actual quantity: total output exceeds that of both equilibria and the price is the lowest of the three situations.'])}${M.B.pi.some(v => v < 0) ? T_([' Un profit est même négatif : l\'entreprise concernée a intérêt à quitter le marché.', ' One profit is even negative: the firm concerned has an incentive to leave the market.']) : ''}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix payé ; le surplus de chaque producteur est l\'intégrale de l\'écart entre le prix et son coût marginal', 'Consumer surplus is the integral of the gap between inverse demand and the price paid; each producer\'s surplus is the integral of the gap between the price and its marginal cost'])} \(C_i'(q)\), ${T_(['égal ici à son profit puisqu\'il n\'y a pas de coût fixe. En Cournot :', 'here equal to its profit since there is no fixed cost. Under Cournot:'])}</p>
  ${block(M.C, 'C')}
  <p>${T_(['En Stackelberg :', 'Under Stackelberg:'])}</p>
  ${block(S, 'S')}
  <p>${T_(['En Bowley :', 'Under Bowley:'])}</p>
  ${block(M.B, 'B')}
  ${tab}
  <p>${T_(['Le surplus des consommateurs augmente de Cournot à Stackelberg, puis à Bowley, car la production totale augmente et le prix baisse. Le profit du suiveur baisse de Cournot à Stackelberg, tandis que celui du leader augmente.', 'Consumer surplus rises from Cournot to Stackelberg, then to Bowley, because total output rises and the price falls. The follower\'s profit falls from Cournot to Stackelberg, while the leader\'s rises.'])} ${M.B.pi[0] < M.C.pi[0] && M.B.pi[1] < M.C.pi[1] ? T_(['En Bowley, les deux entreprises gagnent moins qu\'en Cournot : la rivalité pour le rôle de leader leur nuit à toutes deux.', 'Under Bowley, both firms earn less than under Cournot: the rivalry for the leader role harms them both.']) : T_(['En Bowley, au moins une entreprise gagne moins qu\'en Cournot : la rivalité pour le rôle de leader est coûteuse.', 'Under Bowley, at least one firm earns less than under Cournot: the rivalry for the leader role is costly.'])} ${M.B.W > S.W ? T_(['Le surplus total est le plus élevé en Bowley : la surproduction, coûteuse pour les entreprises, rapproche le marché de l\'efficacité.', 'Total surplus is highest under Bowley: overproduction, costly for the firms, brings the market closer to efficiency.']) : T_(['Le surplus total est plus élevé en Stackelberg qu\'en Bowley : au-delà d\'un certain point, la surproduction se fait à un coût marginal qui dépasse ce que les consommateurs sont prêts à payer.', 'Total surplus is higher under Stackelberg than under Bowley: beyond some point, overproduction takes place at a marginal cost above what consumers are willing to pay.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['L\'équilibre de Cournot C est l\'intersection des deux fonctions de réaction. L\'équilibre de Stackelberg S est situé sur la fonction de réaction du suiveur, au point où elle est tangente à une courbe d\'isoprofit du leader. Le point de Bowley B n\'est sur aucune des deux fonctions de réaction : chaque entreprise y produit plus que sa meilleure réponse.', 'The Cournot equilibrium C is the intersection of the two reaction functions. The Stackelberg equilibrium S lies on the follower\'s reaction function, at the point where it is tangent to an isoprofit curve of the leader. The Bowley point B lies on neither reaction function: each firm produces more than its best response there.'])}</p>
  ${e4graph(D, lang)}
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => e4sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => e4sol(D, 'en'))(D));