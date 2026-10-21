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
const cfx = (x, d) => Math.abs(x - 1) < 1e-12 ? '' : fq(x) + '\\,';
/* figure générique : demande linéaire P = a - bQ, surplus des consommateurs, profits par segments [x0, x1, coût],
   perte sèche par rapport à la tarification au coût marginal minimal cmin */
function eiSurplusFig(o) {
  const fr = o.lang === 'fr', a = o.a, b = o.b, Qmax = a / b, Qc = (a - o.cmin) / b;
  const G = Plot({ w: 640, h: 320, x0: 0, x1: Qmax * 1.02, y0: 0, y1: a * 1.08, mt: 26, mb: 42 });
  G.axes({ xt: ticks(0, Qmax, 5), yt: ticks(0, a, 5), xl: 'Q', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.add(`<path d="M${G.X(0)} ${G.Y(a)} L${G.X(o.Q)} ${G.Y(o.P)} L${G.X(0)} ${G.Y(o.P)} Z" fill="${COL.s1}" fill-opacity="0.22"/>`);
  (o.seg || []).forEach((s, k) => {
    G.add(`<rect x="${G.X(s[0])}" y="${G.Y(Math.max(o.P, s[2]))}" width="${G.X(s[1]) - G.X(s[0])}" height="${Math.abs(G.Y(s[2]) - G.Y(o.P))}" fill="${o.P >= s[2] ? '#2e7d5b' : COL.s3}" fill-opacity="${k % 2 ? 0.18 : 0.3}"/>`);
    if (s[2] > o.cmin && o.P >= s[2]) G.add(`<rect x="${G.X(s[0])}" y="${G.Y(s[2])}" width="${G.X(s[1]) - G.X(s[0])}" height="${G.Y(o.cmin) - G.Y(s[2])}" fill="${COL.s3}" fill-opacity="0.3"/>`);
  });
  if (Qc > o.Q + 1e-9) G.add(`<path d="M${G.X(o.Q)} ${G.Y(o.P)} L${G.X(Qc)} ${G.Y(o.cmin)} L${G.X(o.Q)} ${G.Y(o.cmin)} Z" fill="${COL.s3}" fill-opacity="0.3"/>`);
  G.line([[0, a], [Qmax, 0]], { c: COL.s1, w: 2.2 });
  G.line([[0, o.cmin], [Qmax, o.cmin]], { c: COL.s2, w: 1.8 });
  (o.costs || []).forEach(cc => { if (cc !== o.cmin) G.line([[0, cc], [Qmax, cc]], { c: COL.s2, w: 1.2, dash: '5 4' }); });
  G.dot(o.Q, o.P, { c: COL.s1 }); G.text(o.Q, o.P, o.label || 'E', { dx: 8, dy: -6, anchor: 'start', bold: true, size: 12 });
  G.legend([{ c: COL.s1, box: true, o: 0.3, t: fr ? 'surplus des consommateurs' : 'consumer surplus' }, { c: '#2e7d5b', box: true, o: 0.35, t: fr ? 'surplus des producteurs' : 'producer surplus' }, { c: COL.s3, box: true, o: 0.4, t: fr ? 'perte sèche' : 'deadweight loss' }], G.ml + 8, 16);
  return '<div class="sol-fig">' + (o.caption ? `<p style="text-align:center;margin:.2rem 0"><em>${o.caption}</em></p>` : '') + G.svg(o.aria || 'surplus') + '</div>';
}
I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 5 – Cartel et stabilité', 'k-h1': 'Cartel et stabilité', 'k-coursetitle': 'S\'entendre pour produire moins : profit joint, incitation à tricher et stabilité dans un jeu répété', 'k-extitle': 'Cartel de deux entreprises symétriques : profits, déviation, surplus et stratégie de déclenchement', 'k-soltitle': 'Cartel de deux entreprises symétriques : profits, déviation, surplus et stratégie de déclenchement' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 5 – Cartels and stability', 'k-h1': 'Cartels and stability', 'k-coursetitle': 'Agreeing to produce less: joint profit, incentive to cheat and stability in a repeated game', 'k-extitle': 'A cartel of two symmetric firms: profits, deviation, surplus and trigger strategy', 'k-soltitle': 'A cartel of two symmetric firms: profits, deviation, surplus and trigger strategy' });

/* ---------- outils : n entreprises symétriques, P = a - bQ, coût c ---------- */
function e5calc(a, b, c, n) {
  const K = (a - c) * (a - c) / (4 * n * b);                        /* profit de cartel par entreprise */
  const C = (a - c) * (a - c) / ((n + 1) * (n + 1) * b);            /* profit de Cournot */
  const qK = (a - c) / (2 * n * b), others = (n - 1) * qK;
  const qD = Math.max(0, (a - c - b * others) / (2 * b)), PD = a - b * (others + qD);
  const Dv = (PD - c) * qD, loyal = (PD - c) * qK;                  /* profit du tricheur et d'un fidèle */
  return { K: K, C: C, Dv: Dv, loyal: loyal, qK: qK, qD: qD, PD: PD, delta: (Dv - K) / (Dv - C) };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez calculer l'équilibre d'un cartel qui maximise le profit joint de ses membres, montrer que chaque membre a intérêt à tricher, mesurer ce que le cartel coûte aux consommateurs, et déterminer à quelle condition une entente peut durer quand le jeu se répète.<br><br>
<strong>Pourquoi ?</strong> Les ententes sur les prix ou les quantités sont interdites par le droit de la concurrence, et lourdement sanctionnées : cartels des vitamines, des camions, des lessives. Comprendre ce qui les rend profitables et ce qui les rend fragiles aide à les détecter et à les combattre.<br><br>
<strong>Prérequis.</strong> Le monopole (page 1), le duopole de Cournot (page 3), le dilemme du prisonnier.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le cartel</a> · <a href="#s2">2. Cartel contre Cournot</a> · <a href="#s3">3. L'incitation à tricher</a> · <a href="#s4">4. Le jeu répété</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le cartel maximise le profit joint</div>
<p>Un cartel est un accord par lequel des entreprises coordonnent leurs quantités pour maximiser leur profit total :
\[\max_{q_1,q_2}\ \Pi_1+\Pi_2=P(q_1+q_2)\,(q_1+q_2)-C_1(q_1)-C_2(q_2)\]
Les conditions du premier ordre imposent que la recette marginale de la production totale soit égale au coût marginal de chaque entreprise qui produit : \(Rm(Q)=Cm_1(q_1)=Cm_2(q_2)\). Le cartel se comporte comme un monopole à plusieurs usines : il produit la quantité de monopole et la répartit de façon à égaliser les coûts marginaux. Avec des entreprises symétriques, de coût marginal \(c\), chacune produit la moitié de la quantité de monopole \(\frac{a-c}{2b}\) et reçoit la moitié du profit de monopole.</p>

<div class="dossier-title" id="s2">2. Cartel contre Cournot</div>
<p>À l'équilibre de Cournot, chaque entreprise ignore l'effet de sa production sur le profit de l'autre : en produisant une unité de plus, elle fait baisser le prix pour sa concurrente aussi. Elle produit donc trop du point de vue du profit joint. Avec deux entreprises symétriques et \(P=a-bQ\), le cartel produit \(\frac{a-c}{2b}\) contre \(\frac{2(a-c)}{3b}\) en Cournot, et chaque entreprise gagne \(\frac{(a-c)^2}{8b}\) contre \(\frac{(a-c)^2}{9b}\).</p>

<div class="dossier-title" id="s3">3. L'incitation à tricher</div>
<p>Si l'entreprise 2 respecte l'accord, l'entreprise 1 a intérêt à jouer sa meilleure réponse plutôt que la quantité convenue : sa fonction de réaction donne \(q_1=\frac{a-c}{2b}-\frac{q_2}{2}\), plus que sa quote-part. Avec \(q_2=\frac{a-c}{4b}\), elle produit \(\frac{3(a-c)}{8b}\) et gagne \(\frac{9(a-c)^2}{64b}\), plus que \(\frac{(a-c)^2}{8b}=\frac{8(a-c)^2}{64b}\). Le jeu « respecter ou tricher » a la structure d'un dilemme du prisonnier : tricher est une stratégie dominante, et l'équilibre, où chacun triche, donne à chacun moins que le respect mutuel de l'accord.</p>
<div class="ifig" data-fig="dil"></div>
<div class="fig-cap">Figure 1 — Profits de l'entreprise 1 selon que chaque entreprise respecte l'accord (quantité de cartel) ou triche (meilleure réponse), pour \(P=a-Q\) et un coût marginal \(c\). Quelle que soit la décision de l'entreprise 2, tricher rapporte plus à l'entreprise 1 : c'est un dilemme du prisonnier. Les valeurs sont proportionnelles à \((a-c)^2\).</div>

<div class="dossier-title" id="s4">4. Stabilité dans un jeu répété</div>
<p>Si les entreprises se rencontrent indéfiniment, avec un facteur d'actualisation \(\delta\in\,]0,1[\), elles peuvent soutenir l'entente par une <em>stratégie de déclenchement</em> : respecter l'accord tant que l'autre l'a respecté, et revenir pour toujours à l'équilibre de Cournot dès qu'une déviation est observée. Respecter rapporte \(\frac{\pi^K}{1-\delta}\) ; tricher rapporte \(\pi^D\) une fois, puis \(\pi^C\) à chaque période :
\[\frac{\pi^K}{1-\delta}\ge\pi^D+\frac{\delta\,\pi^C}{1-\delta}\iff\delta\ge\delta^*=\frac{\pi^D-\pi^K}{\pi^D-\pi^C}\]
Le cartel est stable si les entreprises sont assez patientes. Avec deux entreprises symétriques et une demande linéaire, \(\delta^*=\frac{9/64-8/64}{9/64-1/9}=\frac{9}{17}\approx 0.53\). Plus les entreprises sont nombreuses, plus la part de chacune dans le cartel est petite et plus la tentation de tricher est forte : \(\delta^*\) augmente.</p>
<div class="ifig" data-fig="delta"></div>
<div class="fig-cap">Figure 2 — Facteur d'actualisation critique \(\delta^*\) au-dessus duquel la stratégie de déclenchement soutient le cartel, en fonction du nombre d'entreprises symétriques. Il vaut \(9/17\) pour deux entreprises et se rapproche de 1 quand leur nombre augmente : les grands cartels sont plus fragiles.</div>

<div class="dossier-title" id="s5">5. Le cartel et les surplus</div>
<p>Le cartel reproduit le monopole : la production baisse, le prix monte, le surplus des consommateurs diminue, et la perte sèche est celle du monopole, plus grande que celle de l'équilibre de Cournot. Le gain des producteurs est inférieur à la perte des consommateurs : c'est ce qui justifie l'interdiction des ententes. Avec des coûts différents (DM « Bowley contre cartel »), le cartel concentre en plus la production sur l'entreprise la plus efficace, et peut devoir organiser des transferts entre ses membres pour que chacun y gagne.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Le cartel maximise le profit joint : \(Rm(Q)=Cm_i(q_i)\) pour chaque membre ; il reproduit le monopole.</li>
<li>Chaque membre a intérêt à tricher en jouant sa meilleure réponse : dilemme du prisonnier.</li>
<li>Dans un jeu répété, la stratégie de déclenchement soutient l'entente si \(\delta\ge\frac{\pi^D-\pi^K}{\pi^D-\pi^C}\) ; \(\frac{9}{17}\) pour un duopole linéaire symétrique.</li>
<li>Le cartel réduit le surplus des consommateurs et le surplus total par rapport à Cournot.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can compute the equilibrium of a cartel that maximises its members' joint profit, show that each member has an incentive to cheat, measure what the cartel costs consumers, and determine under which condition an agreement can last when the game is repeated.<br><br>
<strong>Why?</strong> Agreements on prices or quantities are forbidden by competition law, and heavily fined: the vitamin, truck and detergent cartels. Understanding what makes them profitable and what makes them fragile helps detect and fight them.<br><br>
<strong>Prerequisites.</strong> Monopoly (page 1), the Cournot duopoly (page 3), the prisoner's dilemma.
</div>
<p class="toc">Contents: <a href="#s1">1. The cartel</a> · <a href="#s2">2. Cartel versus Cournot</a> · <a href="#s3">3. The incentive to cheat</a> · <a href="#s4">4. The repeated game</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The cartel maximises joint profit</div>
<p>A cartel is an agreement by which firms coordinate their quantities to maximise their total profit:
\[\max_{q_1,q_2}\ \Pi_1+\Pi_2=P(q_1+q_2)\,(q_1+q_2)-C_1(q_1)-C_2(q_2)\]
The first-order conditions require the marginal revenue of total output to equal the marginal cost of each producing firm: \(MR(Q)=MC_1(q_1)=MC_2(q_2)\). The cartel behaves like a multi-plant monopoly: it produces the monopoly quantity and splits it so as to equalise marginal costs. With symmetric firms with marginal cost \(c\), each produces half the monopoly quantity \(\frac{a-c}{2b}\) and receives half the monopoly profit.</p>

<div class="dossier-title" id="s2">2. Cartel versus Cournot</div>
<p>At the Cournot equilibrium, each firm ignores the effect of its output on the other's profit: by producing one more unit, it also lowers the price for its rival. It therefore produces too much from the point of view of joint profit. With two symmetric firms and \(P=a-bQ\), the cartel produces \(\frac{a-c}{2b}\) against \(\frac{2(a-c)}{3b}\) under Cournot, and each firm earns \(\frac{(a-c)^2}{8b}\) against \(\frac{(a-c)^2}{9b}\).</p>

<div class="dossier-title" id="s3">3. The incentive to cheat</div>
<p>If firm 2 abides by the agreement, firm 1 is better off playing its best response rather than the agreed quantity: its reaction function gives \(q_1=\frac{a-c}{2b}-\frac{q_2}{2}\), more than its quota. With \(q_2=\frac{a-c}{4b}\), it produces \(\frac{3(a-c)}{8b}\) and earns \(\frac{9(a-c)^2}{64b}\), more than \(\frac{(a-c)^2}{8b}=\frac{8(a-c)^2}{64b}\). The game "comply or cheat" has the structure of a prisoner's dilemma: cheating is a dominant strategy, and the equilibrium, where both cheat, gives each less than mutual compliance.</p>
<div class="ifig" data-fig="dil"></div>
<div class="fig-cap">Figure 1 — Firm 1's profits depending on whether each firm complies (cartel quantity) or cheats (best response), for \(P=a-Q\) and marginal cost \(c\). Whatever firm 2 does, cheating pays firm 1 more: this is a prisoner's dilemma. The values are proportional to \((a-c)^2\).</div>

<div class="dossier-title" id="s4">4. Stability in a repeated game</div>
<p>If firms meet indefinitely, with a discount factor \(\delta\in(0,1)\), they can sustain the agreement with a <em>trigger strategy</em>: comply as long as the other has complied, and revert forever to the Cournot equilibrium as soon as a deviation is observed. Complying yields \(\frac{\pi^K}{1-\delta}\); cheating yields \(\pi^D\) once, then \(\pi^C\) every period:
\[\frac{\pi^K}{1-\delta}\ge\pi^D+\frac{\delta\,\pi^C}{1-\delta}\iff\delta\ge\delta^*=\frac{\pi^D-\pi^K}{\pi^D-\pi^C}\]
The cartel is stable if firms are patient enough. With two symmetric firms and linear demand, \(\delta^*=\frac{9/64-8/64}{9/64-1/9}=\frac{9}{17}\approx 0.53\). The more firms there are, the smaller each one's share of the cartel and the stronger the temptation to cheat: \(\delta^*\) rises.</p>
<div class="ifig" data-fig="delta"></div>
<div class="fig-cap">Figure 2 — Critical discount factor \(\delta^*\) above which the trigger strategy sustains the cartel, as a function of the number of symmetric firms. It equals \(9/17\) for two firms and approaches 1 as their number grows: large cartels are more fragile.</div>

<div class="dossier-title" id="s5">5. The cartel and surplus</div>
<p>The cartel replicates monopoly: output falls, the price rises, consumer surplus shrinks, and the deadweight loss is that of monopoly, larger than that of the Cournot equilibrium. The producers' gain is smaller than the consumers' loss: this is what justifies banning cartels. With different costs (homework "Bowley versus cartel"), the cartel also concentrates output on the more efficient firm, and may need to organise transfers between its members so that each gains.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>The cartel maximises joint profit: \(MR(Q)=MC_i(q_i)\) for each member; it replicates monopoly.</li>
<li>Each member has an incentive to cheat by playing its best response: a prisoner's dilemma.</li>
<li>In a repeated game, the trigger strategy sustains the agreement if \(\delta\ge\frac{\pi^D-\pi^K}{\pi^D-\pi^C}\); \(\frac{9}{17}\) for a symmetric linear duopoly.</li>
<li>The cartel reduces consumer surplus and total surplus relative to Cournot.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  dilAria: 'Matrice des profits du dilemme du cartel', r: 'respecter', t: 'tricher', p1: 'Entreprise 1', p2: 'Entreprise 2', dilRead: 'En unités de \\((a-c)^2/b\\) : respect mutuel 0,125 chacun ; tricher seul 0,141 contre 0,105 ; tricher tous deux 0,111 chacun (Cournot).',
  n: 'Nombre d\'entreprises n', dAria: 'Facteur d\'actualisation critique en fonction du nombre d\'entreprises', dl: 'facteur critique δ*', nb: 'nombre d\'entreprises',
  dRead: (n, d) => `Avec <i>n</i> = ${n} entreprises : δ* = <span class="v">${fmt(d, 3)}</span>`
};
I18N.en.f = {
  dilAria: 'Payoff matrix of the cartel dilemma', r: 'comply', t: 'cheat', p1: 'Firm 1', p2: 'Firm 2', dilRead: 'In units of \\((a-c)^2/b\\): mutual compliance 0.125 each; cheating alone 0.141 against 0.105; both cheating 0.111 each (Cournot).',
  n: 'Number of firms n', dAria: 'Critical discount factor as a function of the number of firms', dl: 'critical factor δ*', nb: 'number of firms',
  dRead: (n, d) => `With <i>n</i> = ${n} firms: δ* = <span class="v">${fmt(d, 3)}</span>`
};
FIGS.dil = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, R = e5calc(1, 1, 0, 2), v = [[R.K, R.K], [R.loyal, R.Dv], [R.Dv, R.loyal], [R.C, R.C]];
    const W = 520, H = 250, x0 = 150, y0 = 60, cw = 170, ch = 80;
    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${L.dilAria}">`;
    svg += `<text x="${x0 + cw}" y="22" text-anchor="middle" ${FONT_T} font-size="13" font-weight="700" fill="${COL.ink}">${L.p2}</text>`;
    svg += `<text x="24" y="${y0 + ch}" text-anchor="middle" ${FONT_T} font-size="13" font-weight="700" fill="${COL.ink}" transform="rotate(-90 24 ${y0 + ch})">${L.p1}</text>`;
    [L.r, L.t].forEach((t, j) => { svg += `<text x="${x0 + cw * j + cw / 2}" y="${y0 - 10}" text-anchor="middle" ${FONT_T} font-size="12" fill="${COL.mute}">${t}</text>`; svg += `<text x="${x0 - 12}" y="${y0 + ch * j + ch / 2 + 4}" text-anchor="end" ${FONT_T} font-size="12" fill="${COL.mute}">${t}</text>`; });
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const k = 2 * i + j, best1 = (j === 0 ? i === 1 : i === 1), eq = i === 1 && j === 1;
      svg += `<rect x="${x0 + cw * j}" y="${y0 + ch * i}" width="${cw}" height="${ch}" fill="${eq ? COL.s3 : '#fff'}" fill-opacity="${eq ? 0.12 : 1}" stroke="${COL.axis}"/>`;
      svg += `<text x="${x0 + cw * j + cw / 2}" y="${y0 + ch * i + ch / 2 + 5}" text-anchor="middle" ${FONT_M} font-size="14" fill="${COL.ink}"><tspan fill="${COL.s1}" font-weight="${best1 ? 700 : 400}">${fmt(v[k][0], 3)}</tspan> ; <tspan fill="${COL.s2}">${fmt(v[k][1], 3)}</tspan></text>`;
    }
    svg += '</svg>';
    return { svg: svg, read: L.dilRead };
  }
};
FIGS.delta = {
  state: { n: 2 },
  controls: L => [{ key: 'n', label: L.f.n, min: 2, max: 12, step: 1, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f;
    const G = Plot({ w: 680, h: 300, x0: 1.5, x1: 12.5, y0: 0, y1: 1, mt: 26, mb: 42 });
    G.axes({ xt: [2, 4, 6, 8, 10, 12], yt: [0, 0.25, 0.5, 0.75, 1], xl: L.nb, xf: v => String(v), yf: v => fmtT(v, 2) });
    const pts = []; for (let n = 2; n <= 12; n++) pts.push([n, e5calc(1, 1, 0, n).delta]);
    G.line(pts, { c: COL.s1, w: 2 }); pts.forEach(p => G.dot(p[0], p[1], { c: p[0] === s.n ? COL.s3 : COL.s1, r: p[0] === s.n ? 6 : 4 }));
    return { svg: G.svg(L.dAria), read: L.dRead(s.n, e5calc(1, 1, 0, s.n).delta) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.a = pick([40, 60, 100, 120, 160]); D.b = pick([0.5, 1, 2]); D.c = pick([4, 10, 16, 20]);
  if (D.c >= D.a / 2) D.c = 10;
  const a = D.a, b = D.b, c = D.c;
  D.qC = (a - c) / (3 * b); D.QC = 2 * D.qC; D.PC = a - b * D.QC; D.piC = (D.PC - c) * D.qC;
  D.QK = (a - c) / (2 * b); D.qK = D.QK / 2; D.PK = a - b * D.QK; D.piK = (D.PK - c) * D.qK;
  D.qD = (a - c) / (2 * b) - D.qK / 2; D.QD = D.qD + D.qK; D.PD = a - b * D.QD; D.piD = (D.PD - c) * D.qD; D.piL = (D.PD - c) * D.qK;
  D.Qc = (a - c) / b;
  [['C', D.QC, D.PC], ['K', D.QK, D.PK], ['D', D.QD, D.PD]].forEach(r => { D['SC' + r[0]] = b * r[1] * r[1] / 2; D['SP' + r[0]] = (r[2] - c) * r[1]; D['W' + r[0]] = D['SC' + r[0]] + D['SP' + r[0]]; });
  D.Wc = b * D.Qc * D.Qc / 2;
  D.delta = (D.piD - D.piK) / (D.piD - D.piC);
  D.dTest = pick([0.4, 0.45, 0.6, 0.7, 0.8]);
  return D;
};
function e5graphBR(D, lang) {
  const fr = lang === 'fr', m = (D.a - D.c) / D.b, top = m * 0.62;
  const G = Plot({ w: 520, h: 420, x0: 0, x1: top, y0: 0, y1: top, mt: 26, mb: 42, ml: 50 });
  G.axes({ xt: ticks(0, top, 4), yt: ticks(0, top, 4), xl: 'q₁', yl: 'q₂', xf: v => fmtT(v, 1), yf: v => fmtT(v, 1) });
  G.clip();
  G.line([[m / 2, 0], [0, m]], { c: COL.s1, w: 2.4, clip: true }); G.line([[0, m / 2], [m, 0]], { c: COL.s2, w: 2.4, clip: true });
  G.line([[0, D.QK], [D.QK, 0]], { c: GREY, w: 1.4, dash: '5 4', clip: true });
  const pt = (x, y, l, col, dx) => { G.dot(x, y, { c: col, r: 6 }); G.text(x, y, l, { dx: dx || 9, dy: -7, anchor: (dx || 9) > 0 ? 'start' : 'end', bold: true, size: 12, c: col }); };
  pt(D.qC, D.qC, 'C', COL.ink); pt(D.qK, D.qK, 'K', COL.s3, -9); pt(D.qD, D.qK, 'D', COL.s4 || COL.s3);
  G.legend([{ c: COL.s1, t: 'R₁' }, { c: COL.s2, t: 'R₂' }, { c: GREY, dash: '5 4', t: fr ? 'production de cartel' : 'cartel output' }], G.ml + 70, 16);
  return '<div class="sol-fig">' + G.svg(fr ? 'Cournot, cartel et déviation' : 'Cournot, cartel and deviation') + '</div>';
}
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Deux entreprises identiques produisent un bien homogène de demande inverse \(P(Q)=${D.a}-${cfx(D.b)}Q\), avec \(Q=q_1+q_2\). Chacune a un coût marginal constant \(c=${D.c}\), sans coût fixe.</div>
<div class="questions"><ol>
<li><div class="q-text">Déterminez l'équilibre de Cournot : quantités, prix et profits.</div></li>
<li><div class="q-text">Les deux entreprises forment un cartel qui maximise leur profit joint et se partagent la production à parts égales. Déterminez la production, le prix et le profit de chacune.</div></li>
<li><div class="q-text">L'entreprise 2 respecte l'accord. Quelle quantité l'entreprise 1 a-t-elle intérêt à produire ? Calculez le prix et les profits des deux entreprises. Construisez la matrice des profits du jeu « respecter ou tricher » et commentez.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs, le surplus des producteurs et le surplus total en Cournot, en cartel et en cas de tricherie, ainsi que la perte sèche par rapport à la concurrence parfaite.</div></li>
<li><div class="q-text">Représentez graphiquement les fonctions de réaction, les points de Cournot, de cartel et de tricherie, puis les surplus en Cournot et en cartel.</div></li>
<li><div class="q-text">Le jeu est répété indéfiniment, avec un facteur d'actualisation \(\delta\). Chaque entreprise respecte l'accord tant que l'autre l'a respecté, et revient pour toujours à Cournot sinon. À quelle condition sur \(\delta\) le cartel est-il stable ? L'est-il pour \(\delta=${fmtT(D.dTest, 2)}\) ?</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Two identical firms produce a homogeneous good with inverse demand \(P(Q)=${D.a}-${cfx(D.b)}Q\), with \(Q=q_1+q_2\). Each has a constant marginal cost \(c=${D.c}\), with no fixed cost.</div>
<div class="questions"><ol>
<li><div class="q-text">Determine the Cournot equilibrium: quantities, price and profits.</div></li>
<li><div class="q-text">The two firms form a cartel that maximises their joint profit and split output equally. Determine output, the price and each firm's profit.</div></li>
<li><div class="q-text">Firm 2 abides by the agreement. What quantity should firm 1 produce? Compute the price and both firms' profits. Build the payoff matrix of the game "comply or cheat" and comment.</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus, producer surplus and total surplus under Cournot, under the cartel and when one firm cheats, together with the deadweight loss relative to perfect competition.</div></li>
<li><div class="q-text">Draw the reaction functions, the Cournot, cartel and cheating points, then the surpluses under Cournot and under the cartel.</div></li>
<li><div class="q-text">The game is repeated indefinitely, with a discount factor \(\delta\). Each firm complies as long as the other has complied, and reverts forever to Cournot otherwise. Under which condition on \(\delta\) is the cartel stable? Is it for \(\delta=${fmtT(D.dTest, 2)}\)?</div></li>
</ol></div>`;
});
function e5sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], a = D.a, b = D.b, c = D.c, n4 = x => texT(x, 4), m = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), bx = b === 1 ? '' : texT(b, 2) + '\\times ', r = (a - c) / (2 * b);
  const qfr = (num, den, val) => Math.abs(den - 1) < 1e-12 ? `${num}=${n4(val)}` : String.raw`\frac{${num}}{${n4(den)}}=${n4(val)}`;
  const scI = (Q, P) => String.raw`\int_0^{${n4(Q)}}\big(${a}-${cfx(b)}q-${n4(P)}\big)\,dq=\Big[${n4(a - P)}\,q-${cfx(b / 2)}q^2\Big]_0^{${n4(Q)}}=${m(b * Q * Q / 2)}`;
  const spI = (Q, P) => String.raw`\int_0^{${n4(Q)}}(${n4(P)}-${c})\,dq=${m((P - c) * Q)}`;
  const tab = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th><th>${T_(['Cournot', 'Cournot'])}</th><th>${T_(['Cartel', 'Cartel'])}</th><th>${T_(['Tricherie', 'Cheating'])}</th><th>${T_(['Concurrence parfaite', 'Perfect competition'])}</th></tr></thead><tbody>
  <tr><td>${T_(['Production', 'Output'])}</td><td class="num">${fqt(D.QC)}</td><td class="num">${fqt(D.QK)}</td><td class="num">${fqt(D.QD)}</td><td class="num">${fqt(D.Qc)}</td></tr>
  <tr><td>${T_(['Surplus des consommateurs', 'Consumer surplus'])}</td><td class="num">${fqt(D.SCC)}</td><td class="num">${fqt(D.SCK)}</td><td class="num">${fqt(D.SCD)}</td><td class="num">${fqt(D.Wc)}</td></tr>
  <tr><td>${T_(['Surplus des producteurs', 'Producer surplus'])}</td><td class="num">${fqt(D.SPC)}</td><td class="num">${fqt(D.SPK)}</td><td class="num">${fqt(D.SPD)}</td><td class="num">${fqt(0)}</td></tr>
  <tr><td>${T_(['Surplus total', 'Total surplus'])}</td><td class="num">${fqt(D.WC)}</td><td class="num">${fqt(D.WK)}</td><td class="num">${fqt(D.WD)}</td><td class="num">${fqt(D.Wc)}</td></tr>
  <tr><td>${T_(['Perte sèche', 'Deadweight loss'])}</td><td class="num">${fqt(D.Wc - D.WC)}</td><td class="num">${fqt(D.Wc - D.WK)}</td><td class="num">${fqt(D.Wc - D.WD)}</td><td class="num">${fqt(0)}</td></tr></tbody></table></div>`;
  const mat = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th>${T_(['1 \\ 2', '1 \\ 2'])}</th><th>${T_(['Respecter', 'Comply'])}</th><th>${T_(['Tricher', 'Cheat'])}</th></tr></thead><tbody>
  <tr><td>${T_(['Respecter', 'Comply'])}</td><td class="num">(${fmt(D.piK, 2)} ; ${fmt(D.piK, 2)})</td><td class="num">(${fmt(D.piL, 2)} ; ${fmt(D.piD, 2)})</td></tr>
  <tr><td>${T_(['Tricher', 'Cheat'])}</td><td class="num">(${fmt(D.piD, 2)} ; ${fmt(D.piL, 2)})</td><td class="num">(${fmt(D.piC, 2)} ; ${fmt(D.piC, 2)})</td></tr></tbody></table></div>`;
  const stable = D.dTest >= D.delta;
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le profit de l\'entreprise 1 est', 'Firm 1\'s profit is'])} \(\Pi_1=(${a}-${cfx(b)}q_1-${cfx(b)}q_2)\,q_1-${c}\,q_1\). ${T_(['Pour une quantité donnée de sa concurrente, elle annule la dérivée de son profit, ce qui donne sa fonction de réaction ; par symétrie, celle de l\'entreprise 2 s\'en déduit en échangeant les indices :', 'For a given rival quantity, it sets the derivative of its profit to zero, which gives its reaction function; by symmetry, firm 2\'s follows by swapping the indices:'])}
  \[\frac{\partial\Pi_1}{\partial q_1}=${a}-${cfx(2 * b)}q_1-${cfx(b)}q_2-${c}=0\iff q_1=${n4(r)}-\frac{q_2}{2}\qquad q_2=${n4(r)}-\frac{q_1}{2}\]
  ${T_(['L\'équilibre étant symétrique,', 'The equilibrium being symmetric,'])} \(q_1^C=q_2^C=q\) ${T_(['vérifie', 'satisfies'])} \(q=${n4(r)}-\frac{q}{2}\), ${T_(['soit', 'that is'])} \(q^C=\frac{2}{3}\times ${n4(r)}=${fqa(D.qC)}\). ${T_(['La production totale est', 'Total output is'])} \(Q^C=${fqa(D.QC)}\) ${T_(['et l\'on en déduit, d\'après la fonction de demande inverse, le prix d\'équilibre :', 'and the inverse demand function then gives the equilibrium price:'])}
  \[P^C=${a}-${bx}${n4(D.QC)}=${fqa(D.PC)}\qquad\text{${T_(['d\'où', 'hence'])}}\qquad\Pi^C=(${n4(D.PC)}-${c})\times ${n4(D.qC)}=${m(D.piC)}\ \text{${T_(['chacune', 'each'])}}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le cartel maximise le profit joint', 'The cartel maximises joint profit'])} \(\Pi=(${a}-${cfx(b)}Q)\,Q-${c}\,Q\), ${T_(['qui ne dépend que de la production totale. Il annule sa dérivée, c\'est-à-dire égalise la recette marginale au coût marginal :', 'which only depends on total output. It sets its derivative to zero, that is, equates marginal revenue with marginal cost:'])}
  \[${a}-${cfx(2 * b)}Q=${c}\iff Q^K=${qfr(a + '-' + c, 2 * b, D.QK)}\]
  ${T_(['Chaque entreprise produit la moitié,', 'Each firm produces half,'])} \(q^K=${fqa(D.qK)}\). ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix de cartel :', 'The inverse demand function then gives the cartel price:'])} \(P^K=${a}-${bx}${n4(D.QK)}=${fqa(D.PK)}\). ${T_(['Chaque entreprise gagne', 'Each firm earns'])} \(\Pi^K=(${n4(D.PK)}-${c})\times ${n4(D.qK)}=${fqa(D.piK)}\), ${T_(['plus qu\'en Cournot', 'more than under Cournot'])} (\(${m(D.piC)}\)) : ${T_(['en produisant moins, les deux entreprises font monter le prix.', 'by producing less, both firms push the price up.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Si l\'entreprise 2 produit sa quote-part', 'If firm 2 produces its quota'])} \(q_2=${fqa(D.qK)}\), ${T_(['la meilleure réponse de l\'entreprise 1 est donnée par sa fonction de réaction :', 'firm 1\'s best response is given by its reaction function:'])}
  \[q_1^D=${n4(r)}-\frac{${n4(D.qK)}}{2}=${fqa(D.qD)}\]
  ${T_(['La production totale devient', 'Total output becomes'])} \(${n4(D.QD)}\), ${T_(['et l\'on en déduit, d\'après la fonction de demande inverse, le prix :', 'and the inverse demand function then gives the price:'])} \(P^D=${a}-${bx}${n4(D.QD)}=${fqa(D.PD)}\). ${T_(['Le tricheur gagne', 'The cheater earns'])} \(\Pi^D=(${n4(D.PD)}-${c})\times ${n4(D.qD)}=${fqa(D.piD)}\), ${T_(['et l\'entreprise fidèle', 'and the loyal firm'])} \((${n4(D.PD)}-${c})\times ${n4(D.qK)}=${fqa(D.piL)}\). ${T_(['La matrice des profits (entreprise 1 ; entreprise 2) est donc :', 'The payoff matrix (firm 1; firm 2) is therefore:'])}</p>
  ${mat}
  <p>${T_(['Quelle que soit la décision de l\'autre, tricher rapporte davantage', 'Whatever the other does, cheating pays more'])} (\(${m(D.piD)}&gt;${m(D.piK)}\) ${T_(['et', 'and'])} \(${m(D.piC)}&gt;${m(D.piL)}\)) : ${T_(['tricher est une stratégie dominante. L\'équilibre de Nash est « tricher, tricher », c\'est-à-dire Cournot, alors que le respect mutuel donnerait davantage aux deux : c\'est un dilemme du prisonnier.', 'cheating is a dominant strategy. The Nash equilibrium is "cheat, cheat", that is Cournot, whereas mutual compliance would give both more: this is a prisoner\'s dilemma.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix ; le surplus des producteurs est l\'intégrale de l\'écart entre le prix et le coût marginal, égal à la somme des profits puisqu\'il n\'y a pas de coût fixe :', 'Consumer surplus is the integral of the gap between inverse demand and the price; producer surplus is the integral of the gap between the price and marginal cost, equal to the sum of profits since there is no fixed cost:'])}
  \[\begin{aligned}${SC}^C&amp;=${scI(D.QC, D.PC)}\\${SP}^C&amp;=${spI(D.QC, D.PC)}\\${SC}^K&amp;=${scI(D.QK, D.PK)}\\${SP}^K&amp;=${spI(D.QK, D.PK)}\\${SC}^D&amp;=${scI(D.QD, D.PD)}\\${SP}^D&amp;=${spI(D.QD, D.PD)}\end{aligned}\]
  ${T_(['En concurrence parfaite, le prix serait égal au coût marginal', 'Under perfect competition, the price would equal marginal cost'])} ${c} ${T_(['et la production', 'and output'])} \(Q^c=${fqa(D.Qc)}\) : ${T_(['le surplus total y atteint', 'total surplus there reaches'])} \(\int_0^{${n4(D.Qc)}}(${a}-${cfx(b)}q-${c})\,dq=${fqa(D.Wc)}\). ${T_(['On en déduit le tableau :', 'Hence the table:'])}</p>
  ${tab}
  <p>${T_(['Le cartel augmente le surplus des producteurs de', 'The cartel raises producer surplus by'])} \(${m(D.SPK - D.SPC)}\) ${T_(['mais réduit celui des consommateurs de', 'but reduces consumer surplus by'])} \(${m(D.SCC - D.SCK)}\) : ${T_(['la perte des consommateurs l\'emporte, et la perte sèche augmente. C\'est la justification économique de l\'interdiction des ententes. La tricherie, en augmentant la production, rapproche le marché de l\'efficacité.', 'the consumers\' loss outweighs it, and the deadweight loss rises. This is the economic justification for banning cartels. Cheating, by raising output, brings the market closer to efficiency.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le point de Cournot C est à l\'intersection des fonctions de réaction ; le point de cartel K est sur la droite des productions totales égales à', 'The Cournot point C is at the intersection of the reaction functions; the cartel point K lies on the line of total output equal to'])} \(Q^K\), ${T_(['à mi-chemin ; le point de tricherie D est sur la fonction de réaction de l\'entreprise 1, à la hauteur de la quote-part de l\'entreprise 2 :', 'halfway along; the cheating point D lies on firm 1\'s reaction function, at the level of firm 2\'s quota:'])}</p>
  ${e5graphBR(D, lang)}
  <p>${T_(['Les surplus en Cournot, puis en cartel :', 'Surpluses under Cournot, then under the cartel:'])}</p>
  ${eiSurplusFig({ lang: lang, a: a, b: b, P: D.PC, Q: D.QC, cmin: c, seg: [[0, D.qC, c], [D.qC, D.QC, c]], label: 'C', caption: 'Cournot', aria: 'Cournot' })}
  ${eiSurplusFig({ lang: lang, a: a, b: b, P: D.PK, Q: D.QK, cmin: c, seg: [[0, D.qK, c], [D.qK, D.QK, c]], label: 'K', caption: T_(['Cartel', 'Cartel']), aria: 'cartel' })}
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec la stratégie de déclenchement, respecter l\'accord rapporte', 'With the trigger strategy, complying yields'])} \(\Pi^K\) ${T_(['à chaque période, soit au total', 'every period, that is in total'])} \(\frac{\Pi^K}{1-\delta}\). ${T_(['Tricher rapporte', 'Cheating yields'])} \(\Pi^D\) ${T_(['une fois, puis', 'once, then'])} \(\Pi^C\) ${T_(['à chaque période suivante, puisque l\'autre revient à Cournot. Le cartel est stable si respecter rapporte au moins autant :', 'every subsequent period, since the other reverts to Cournot. The cartel is stable if complying pays at least as much:'])}
  \[\begin{aligned}\frac{\Pi^K}{1-\delta}\ge\Pi^D+\frac{\delta\,\Pi^C}{1-\delta}&amp;\iff\Pi^K\ge(1-\delta)\,\Pi^D+\delta\,\Pi^C&amp;&amp;\text{${T_(['en multipliant par', 'multiplying by'])} }1-\delta&gt;0\\&amp;\iff\delta\ge\frac{\Pi^D-\Pi^K}{\Pi^D-\Pi^C}=\frac{${m(D.piD)}-${m(D.piK)}}{${m(D.piD)}-${m(D.piC)}}=${fqa(D.delta)}\end{aligned}\]
  ${T_(['On retrouve', 'This is'])} \(\frac{9}{17}\approx 0.5294\), ${T_(['valeur qui ne dépend pas des paramètres pour un duopole linéaire symétrique.', 'a value that does not depend on the parameters for a symmetric linear duopoly.'])} ${stable ? T_(['Avec', 'With']) + ' \\(\\delta=' + texT(D.dTest, 2) + '\\ge\\delta^*\\), ' + T_(['le cartel est stable : la perte future liée au retour à Cournot dissuade de tricher.', 'the cartel is stable: the future loss from reverting to Cournot deters cheating.']) : T_(['Avec', 'With']) + ' \\(\\delta=' + texT(D.dTest, 2) + '&lt;\\delta^*\\), ' + T_(['le cartel n\'est pas stable : les entreprises sont trop impatientes, le gain immédiat de la tricherie l\'emporte.', 'the cartel is not stable: firms are too impatient, the immediate gain from cheating dominates.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => e5sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => e5sol(D, 'en'))(D));