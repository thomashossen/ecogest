I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 7 – Prix limite et dissuasion à l\'entrée', 'k-h1': 'Prix limite et dissuasion à l\'entrée', 'k-coursetitle': 'Protéger un monopole : quantité limite, entrée bloquée, dissuadée ou acceptée', 'k-extitle': 'Dissuader ou accepter l\'entrée d\'un concurrent', 'k-soltitle': 'Dissuader ou accepter l\'entrée d\'un concurrent' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 7 – Limit pricing and entry deterrence', 'k-h1': 'Limit pricing and entry deterrence', 'k-coursetitle': 'Protecting a monopoly: limit quantity, blockaded, deterred or accommodated entry', 'k-extitle': 'Deterring or accommodating a rival\'s entry', 'k-soltitle': 'Deterring or accommodating a rival\'s entry' });

/* ---------- outils : P = a - bQ, coût marginal c commun, coût fixe d'entrée F ---------- */
function e7calc(a, b, c, F) {
  const A = a - c, s = Math.sqrt(b * F);
  const qm = A / (2 * b), Pm = a - b * qm, pim = (Pm - c) * qm;
  const qL = (A - 2 * s) / b, PL = a - b * qL, piL = (PL - c) * qL;
  const qIS = A / (2 * b), qES = A / (4 * b), PS = a - b * (qIS + qES), piIS = (PS - c) * qIS, piES = (PS - c) * qES - F;
  const blocked = qm >= qL;
  return { A: A, s: s, qm: qm, Pm: Pm, pim: pim, qL: qL, PL: PL, piL: piL, qIS: qIS, qES: qES, PS: PS, piIS: piIS, piES: piES, blocked: blocked, deter: !blocked && piL >= piIS };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez déterminer la quantité qu'un monopole doit produire pour qu'un entrant potentiel renonce à entrer, en déduire le prix limite, distinguer entrée bloquée, dissuadée et acceptée, et comparer les surplus dans chaque cas.<br><br>
<strong>Pourquoi ?</strong> Une entreprise en place ne se contente pas de maximiser son profit présent : elle peut sacrifier une partie de ce profit pour décourager l'entrée de concurrents. Les autorités de la concurrence s'intéressent à ces stratégies, qui peuvent protéger durablement une position dominante.<br><br>
<strong>Prérequis.</strong> Le monopole (page 1), Stackelberg (page 4).
</div>
<p class="toc">Sommaire : <a href="#s1">1. Le cadre</a> · <a href="#s2">2. La réaction de l'entrant</a> · <a href="#s3">3. Quantité et prix limites</a> · <a href="#s4">4. Bloquer, dissuader ou accepter</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Le cadre</div>
<p>Une entreprise en place, le titulaire, est seule sur un marché de demande \(P=a-bQ\). Un entrant potentiel a le même coût marginal \(c\), mais doit payer un coût fixe d'entrée \(F\). Le titulaire choisit d'abord sa quantité \(q_I\) et s'y engage, par exemple en investissant dans des capacités ; l'entrant observe \(q_I\), puis décide d'entrer ou non, et combien produire. C'est le postulat de Sylos-Labini : l'entrant considère la production du titulaire comme donnée.</p>

<div class="dossier-title" id="s2">2. La réaction de l'entrant</div>
<p>S'il entre, l'entrant fait face à la <em>demande résiduelle</em> \(P=(a-bq_I)-bq_E\), ce que la demande totale laisse après la production du titulaire. Il maximise \((a-bq_I-bq_E-c)\,q_E-F\), d'où :
\[q_E=\frac{a-c-bq_I}{2b},\qquad\Pi_E(q_I)=\frac{(a-c-bq_I)^2}{4b}-F\]
Plus le titulaire produit, plus la demande résiduelle est faible et plus le profit de l'entrant diminue.</p>
<div class="ifig" data-fig="resid"></div>
<div class="fig-cap">Figure 1 — Demande résiduelle de l'entrant (bleu), sa recette marginale (pointillés), son coût marginal (doré) et son coût moyen avec le coût fixe d'entrée (rouge), pour \(P=100-Q\), \(c=20\) et \(F=225\) : la quantité limite vaut 50. Augmentez la production du titulaire : la demande résiduelle se déplace vers le bas. Quand elle ne dépasse plus le coût moyen de l'entrant, entrer n'est plus rentable.</div>

<div class="dossier-title" id="s3">3. Quantité limite et prix limite</div>
<p>L'entrée est dissuadée si \(\Pi_E(q_I)\le 0\), c'est-à-dire si \(a-c-bq_I\le 2\sqrt{bF}\). La plus petite quantité qui dissuade l'entrée est la <em>quantité limite</em>, et le prix correspondant le <em>prix limite</em> :
\[q_L=\frac{a-c-2\sqrt{bF}}{b},\qquad P_L=a-bq_L=c+2\sqrt{bF}\]
Le prix limite dépasse le coût marginal d'un montant qui croît avec le coût d'entrée : plus l'entrée est coûteuse, moins le titulaire doit baisser son prix pour la décourager.</p>

<div class="dossier-title" id="s4">4. Bloquer, dissuader ou accepter</div>
<ul class="kit-simple">
<li><em>Entrée bloquée</em> : si la quantité de monopole \(q_m=\frac{a-c}{2b}\) dépasse déjà \(q_L\), le titulaire n'a rien à faire ; c'est le cas quand \(F\ge\frac{(a-c)^2}{16b}\).</li>
<li><em>Entrée dissuadée</em> : sinon, le titulaire peut produire \(q_L&gt;q_m\) ; il gagne \((P_L-c)\,q_L\), moins que le profit de monopole.</li>
<li><em>Entrée acceptée</em> : il peut aussi laisser entrer le concurrent et se comporter en leader de Stackelberg : \(q_I=\frac{a-c}{2b}\), \(q_E=\frac{a-c}{4b}\), et un profit \(\frac{(a-c)^2}{8b}\).</li>
</ul>
<p>Le titulaire choisit la stratégie qui lui rapporte le plus. Quand le coût d'entrée est très faible, dissuader exigerait une production presque concurrentielle : il vaut mieux accepter l'entrée. Quand il est intermédiaire, la dissuasion est plus profitable.</p>
<div class="ifig" data-fig="choice"></div>
<div class="fig-cap">Figure 2 — Profit du titulaire en fonction du coût d'entrée \(F\) (\(P=100-Q\), \(c=20\)) : en dissuadant l'entrée (bleu), en l'acceptant comme leader de Stackelberg (doré), et profit de monopole (pointillés). À gauche, accepter l'entrée est préférable ; au milieu, dissuader ; à droite, l'entrée est bloquée et le titulaire reste un monopole sans effort.</div>

<div class="dossier-title" id="s5">5. Dissuasion et surplus</div>
<p>Pour dissuader l'entrée, le titulaire produit plus que la quantité de monopole et vend moins cher : la simple menace d'entrée profite aux consommateurs, même si l'entrée n'a jamais lieu. Si l'entrée est acceptée, la production totale est encore plus élevée, mais la société paie le coût fixe \(F\) de l'entrant : le surplus total en tient compte. Comparer les situations demande donc de calculer le surplus des consommateurs, les profits nets et la perte sèche dans chaque cas.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Réaction de l'entrant : \(q_E=\frac{a-c-bq_I}{2b}\) ; profit \(\frac{(a-c-bq_I)^2}{4b}-F\).</li>
<li>Quantité limite \(q_L=\frac{a-c-2\sqrt{bF}}{b}\), prix limite \(P_L=c+2\sqrt{bF}\).</li>
<li>Entrée bloquée si \(F\ge\frac{(a-c)^2}{16b}\) ; sinon, le titulaire compare le profit de dissuasion et celui de leader de Stackelberg.</li>
<li>La menace d'entrée fait baisser le prix et augmente le surplus des consommateurs.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can determine the quantity a monopoly must produce for a potential entrant to give up entering, deduce the limit price, distinguish blockaded, deterred and accommodated entry, and compare surplus in each case.<br><br>
<strong>Why?</strong> An incumbent does not merely maximise its current profit: it may sacrifice part of this profit to discourage entry. Competition authorities pay attention to these strategies, which may durably protect a dominant position.<br><br>
<strong>Prerequisites.</strong> Monopoly (page 1), Stackelberg (page 4).
</div>
<p class="toc">Contents: <a href="#s1">1. The setting</a> · <a href="#s2">2. The entrant's reaction</a> · <a href="#s3">3. Limit quantity and price</a> · <a href="#s4">4. Blockade, deter or accommodate</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. The setting</div>
<p>An incumbent is alone on a market with demand \(P=a-bQ\). A potential entrant has the same marginal cost \(c\), but must pay a fixed entry cost \(F\). The incumbent first chooses its quantity \(q_I\) and commits to it, for instance by investing in capacity; the entrant observes \(q_I\), then decides whether to enter and how much to produce. This is the Sylos-Labini postulate: the entrant takes the incumbent's output as given.</p>

<div class="dossier-title" id="s2">2. The entrant's reaction</div>
<p>If it enters, the entrant faces the <em>residual demand</em> \(P=(a-bq_I)-bq_E\), what total demand leaves after the incumbent's output. It maximises \((a-bq_I-bq_E-c)\,q_E-F\), hence:
\[q_E=\frac{a-c-bq_I}{2b},\qquad\Pi_E(q_I)=\frac{(a-c-bq_I)^2}{4b}-F\]
The more the incumbent produces, the weaker the residual demand and the lower the entrant's profit.</p>
<div class="ifig" data-fig="resid"></div>
<div class="fig-cap">Figure 1 — The entrant's residual demand (blue), its marginal revenue (dashed), its marginal cost (gold) and its average cost including the entry cost (red), for \(P=100-Q\), \(c=20\) and \(F=225\): the limit quantity is 50. Increase the incumbent's output: residual demand shifts down. When it no longer exceeds the entrant's average cost, entering is no longer profitable.</div>

<div class="dossier-title" id="s3">3. Limit quantity and limit price</div>
<p>Entry is deterred if \(\Pi_E(q_I)\le 0\), that is if \(a-c-bq_I\le 2\sqrt{bF}\). The smallest quantity that deters entry is the <em>limit quantity</em>, and the corresponding price the <em>limit price</em>:
\[q_L=\frac{a-c-2\sqrt{bF}}{b},\qquad P_L=a-bq_L=c+2\sqrt{bF}\]
The limit price exceeds marginal cost by an amount that grows with the entry cost: the costlier entry is, the less the incumbent must cut its price to discourage it.</p>

<div class="dossier-title" id="s4">4. Blockade, deter or accommodate</div>
<ul class="kit-simple">
<li><em>Blockaded entry</em>: if the monopoly quantity \(q_m=\frac{a-c}{2b}\) already exceeds \(q_L\), the incumbent need not do anything; this is the case when \(F\ge\frac{(a-c)^2}{16b}\).</li>
<li><em>Deterred entry</em>: otherwise, the incumbent can produce \(q_L&gt;q_m\); it earns \((P_L-c)\,q_L\), less than monopoly profit.</li>
<li><em>Accommodated entry</em>: it may also let the rival in and behave as a Stackelberg leader: \(q_I=\frac{a-c}{2b}\), \(q_E=\frac{a-c}{4b}\), and a profit of \(\frac{(a-c)^2}{8b}\).</li>
</ul>
<p>The incumbent chooses the strategy that pays it most. When the entry cost is very low, deterrence would require almost competitive output: accommodating entry is better. When it is intermediate, deterrence is more profitable.</p>
<div class="ifig" data-fig="choice"></div>
<div class="fig-cap">Figure 2 — The incumbent's profit as a function of the entry cost \(F\) (\(P=100-Q\), \(c=20\)): deterring entry (blue), accommodating it as a Stackelberg leader (gold), and monopoly profit (dashed). On the left, accommodating entry is better; in the middle, deterring; on the right, entry is blockaded and the incumbent remains a monopoly without effort.</div>

<div class="dossier-title" id="s5">5. Deterrence and surplus</div>
<p>To deter entry, the incumbent produces more than the monopoly quantity and sells more cheaply: the mere threat of entry benefits consumers, even if entry never happens. If entry is accommodated, total output is even higher, but society pays the entrant's fixed cost \(F\): total surplus accounts for it. Comparing the situations therefore requires computing consumer surplus, net profits and the deadweight loss in each case.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Entrant's reaction: \(q_E=\frac{a-c-bq_I}{2b}\); profit \(\frac{(a-c-bq_I)^2}{4b}-F\).</li>
<li>Limit quantity \(q_L=\frac{a-c-2\sqrt{bF}}{b}\), limit price \(P_L=c+2\sqrt{bF}\).</li>
<li>Blockaded entry if \(F\ge\frac{(a-c)^2}{16b}\); otherwise, the incumbent compares deterrence profit with Stackelberg leader profit.</li>
<li>The threat of entry lowers the price and raises consumer surplus.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  qI: 'Production du titulaire q_I', qE: 'quantité de l\'entrant q_E', rd: 'demande résiduelle', rm: 'recette marginale', cm: 'coût marginal', cmo: 'coût moyen', residAria: 'Demande résiduelle et coûts de l\'entrant',
  residRead: (qe, pe) => `Meilleure réponse de l'entrant : <i>q</i><sub>E</sub> = <span class="v">${fmt(qe, 2)}</span>, profit <span class="v">${fmt(pe, 1)}</span> ` + (pe > 0 ? '(il entre)' : '(il n\'entre pas)'),
  F: 'coût d\'entrée F', det: 'dissuader', acc: 'accepter (Stackelberg)', mon: 'monopole', choiceAria: 'Profit du titulaire selon sa stratégie et le coût d\'entrée'
};
I18N.en.f = {
  qI: 'Incumbent output q_I', qE: 'entrant quantity q_E', rd: 'residual demand', rm: 'marginal revenue', cm: 'marginal cost', cmo: 'average cost', residAria: 'Residual demand and costs of the entrant',
  residRead: (qe, pe) => `Entrant's best response: <i>q</i><sub>E</sub> = <span class="v">${fmt(qe, 2)}</span>, profit <span class="v">${fmt(pe, 1)}</span> ` + (pe > 0 ? '(it enters)' : '(it stays out)'),
  F: 'entry cost F', det: 'deter', acc: 'accommodate (Stackelberg)', mon: 'monopoly', choiceAria: 'Incumbent profit by strategy and entry cost'
};
FIGS.resid = {
  state: { qI: 40 },
  controls: L => [{ key: 'qI', label: L.f.qI, min: 0, max: 70, step: 2, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = 100, c = 20, F = 225, r = a - s.qI, qe = Math.max(0, (r - c) / 2), pe = Math.max(0, r - c) ** 2 / 4 - F;
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 100, y0: 0, y1: 110, mt: 26, mb: 42 });
    G.axes({ xt: [0, 20, 40, 60, 80, 100], yt: [0, 25, 50, 75, 100], xl: L.qE, xf: v => String(v), yf: v => String(v) });
    G.clip();
    G.line([[0, r], [r, 0]], { c: COL.s1, w: 2.4, clip: true }); G.line([[0, r], [r / 2, 0]], { c: COL.s1, w: 1.4, dash: '5 4', clip: true });
    G.line([[0, c], [100, c]], { c: COL.s2, w: 2 });
    G.curve(q => c + F / q, 1, 100, { c: COL.s3, w: 2, clip: true }, 200);
    if (qe > 0) { G.dot(qe, r - qe, { c: pe > 0 ? '#2e7d5b' : COL.s3, r: 6 }); G.seg(qe, 0, qe, r - qe, { c: GREY, w: 1, dash: '3 3' }); }
    G.legend([{ c: COL.s1, t: L.rd }, { c: COL.s1, dash: '5 4', t: L.rm }, { c: COL.s2, t: L.cm }, { c: COL.s3, t: L.cmo }], G.ml + 8, 16);
    return { svg: G.svg(L.residAria), read: L.residRead(qe, pe) };
  }
};
FIGS.choice = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = 100, b = 1, c = 20, Fmax = 500;
    const G = Plot({ w: 680, h: 300, x0: 0, x1: Fmax, y0: 0, y1: 1700, mt: 26, mb: 42, ml: 56 });
    G.axes({ xt: [0, 100, 200, 300, 400, 500], yt: [0, 400, 800, 1200, 1600], xl: L.F, xf: v => String(v), yf: v => fmt(v, 0) });
    const det = G.sample(F => { const R = e7calc(a, b, c, F); return R.blocked ? R.pim : R.piL; }, 0, Fmax, 200);
    G.line(det, { c: COL.s1, w: 2.4 });
    G.line([[0, e7calc(a, b, c, 0).piIS], [Fmax, e7calc(a, b, c, 0).piIS]], { c: COL.s2, w: 2.2 });
    G.line([[0, e7calc(a, b, c, 0).pim], [Fmax, e7calc(a, b, c, 0).pim]], { c: GREY, w: 1.2, dash: '5 4' });
    const Fb = (a - c) * (a - c) / 16; G.seg(Fb, 0, Fb, 1700, { c: GREY, w: 1, dash: '3 3' });
    G.legend([{ c: COL.s1, t: L.det }, { c: COL.s2, t: L.acc }, { c: GREY, dash: '5 4', t: L.mon }], G.ml + 8, 16);
    return { svg: G.svg(L.choiceAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([60, 80, 100, 120]); D.b = pick([0.5, 1, 2]); D.c = 2 * rint(2, 8);
    const A = D.a - D.c; const smax = A / 4;
    D.s = rint(1, Math.floor(smax) - 1); D.F = D.s * D.s / D.b;
    if (D.s < 1 || D.s >= smax) continue;
    D.R = e7calc(D.a, D.b, D.c, D.F);
    if (D.R.blocked || D.R.qL <= D.R.qm + 0.5) continue;
    break;
  }
  const R = D.R, b = D.b, c = D.c;
  /* surplus : monopole, dissuasion, entrée acceptée */
  D.sit = [
    { Q: R.qm, P: R.Pm, piI: R.pim, piE: 0, F: 0 },
    { Q: R.qL, P: R.PL, piI: R.piL, piE: 0, F: 0 },
    { Q: R.qIS + R.qES, P: R.PS, piI: R.piIS, piE: R.piES, F: D.F }
  ];
  D.sit.forEach(x => { x.SC = b * x.Q * x.Q / 2; x.SPb = (x.P - c) * x.Q; x.W = x.SC + x.SPb - x.F; });
  D.Qc = (D.a - c) / b; D.Wc = b * D.Qc * D.Qc / 2;
  return D;
};
function e7graphPE(D, lang) {
  const fr = lang === 'fr', a = D.a, b = D.b, c = D.c, F = D.F, R = D.R, xmax = (a - c) / b;
  const pe = q => Math.max(0, a - c - b * q) ** 2 / (4 * b) - F, ymax = pe(0) * 1.1;
  const G = Plot({ w: 640, h: 300, x0: 0, x1: xmax, y0: -F * 1.3, y1: ymax, mt: 26, mb: 42, ml: 60 });
  G.axes({ xt: ticks(0, xmax, 5), yt: ticks(-F, ymax, 5), xl: 'q_I', xf: v => fmtT(v, 1), yf: v => fmt(v, 0), xAxisAt: 0 });
  G.curve(pe, 0, xmax, { c: COL.s1, w: 2.4 }, 200);
  G.seg(R.qm, -F * 1.3, R.qm, ymax, { c: GREY, w: 1, dash: '4 3' }); G.text(R.qm, ymax, 'q_m', { dx: 4, dy: 12, anchor: 'start', size: 11, c: COL.mute });
  G.dot(R.qL, 0, { c: COL.s3, r: 6 }); G.text(R.qL, 0, 'q_L', { dx: 6, dy: -8, anchor: 'start', bold: true, size: 12, c: COL.s3 });
  return '<div class="sol-fig">' + G.svg(fr ? 'Profit de l\'entrant selon la production du titulaire' : 'Entrant profit as a function of incumbent output') + '</div>';
}
I18N.fr.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">Une entreprise en place (le titulaire) est seule sur un marché de demande inverse \(P(Q)=${D.a}-${cfx(D.b)}Q\), avec un coût marginal constant \(c=${D.c}\). Un entrant potentiel a le même coût marginal, mais doit payer un coût fixe d'entrée \(F=${texT(D.F, 2)}\). Le titulaire choisit d'abord sa quantité et s'y engage ; l'entrant l'observe, puis décide d'entrer ou non.</div>
<div class="questions"><ol>
<li><div class="q-text">En l'absence de menace d'entrée, déterminez la quantité, le prix et le profit du monopole.</div></li>
<li><div class="q-text">Déterminez la meilleure réponse de l'entrant à une quantité \(q_I\) du titulaire, puis son profit. Déduisez-en la quantité limite et le prix limite. L'entrée est-elle bloquée ?</div></li>
<li><div class="q-text">Calculez le profit du titulaire s'il dissuade l'entrée, puis s'il l'accepte en se comportant en leader de Stackelberg. Quelle stratégie choisit-il ?</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs, le surplus des producteurs (net du coût d'entrée) et le surplus total dans les trois situations : monopole sans menace, dissuasion, entrée acceptée. Commentez.</div></li>
<li><div class="q-text">Représentez graphiquement le profit de l'entrant en fonction de \(q_I\), puis les surplus dans la situation retenue par le titulaire.</div></li>
</ol></div>`;
});
I18N.en.ex = ((f) => D => fracClean(f(D)))(function (D) {
  return String.raw`<div class="context-block">An incumbent is alone on a market with inverse demand \(P(Q)=${D.a}-${cfx(D.b)}Q\), with a constant marginal cost \(c=${D.c}\). A potential entrant has the same marginal cost, but must pay a fixed entry cost \(F=${texT(D.F, 2)}\). The incumbent first chooses its quantity and commits to it; the entrant observes it, then decides whether to enter.</div>
<div class="questions"><ol>
<li><div class="q-text">Without any entry threat, determine the monopoly quantity, price and profit.</div></li>
<li><div class="q-text">Determine the entrant's best response to an incumbent quantity \(q_I\), then its profit. Deduce the limit quantity and the limit price. Is entry blockaded?</div></li>
<li><div class="q-text">Compute the incumbent's profit if it deters entry, then if it accommodates it by acting as a Stackelberg leader. Which strategy does it choose?</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus, producer surplus (net of the entry cost) and total surplus in the three situations: monopoly without threat, deterrence, accommodated entry. Comment.</div></li>
<li><div class="q-text">Draw the entrant's profit as a function of \(q_I\), then the surpluses in the situation chosen by the incumbent.</div></li>
</ol></div>`;
});
function e7sol(D, lang) {
  const texT = (x) => fq(x);
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], a = D.a, b = D.b, c = D.c, F = D.F, R = D.R, n4 = x => texT(x, 4), m = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), bx = b === 1 ? '' : texT(b, 2) + '\\times ', A = a - c;
  const qfr = (num, den, val) => Math.abs(den - 1) < 1e-12 ? (String(num) === n4(val) ? n4(val) : `${num}=${n4(val)}`) : String.raw`\frac{${num}}{${n4(den)}}=${n4(val)}`;
  const names = T_([['Monopole', 'Dissuasion', 'Entrée acceptée'], ['Monopoly', 'Deterrence', 'Accommodated entry']]);
  const scI = x => String.raw`\int_0^{${n4(x.Q)}}\big(${a}-${cfx(b)}q-${n4(x.P)}\big)\,dq=\Big[${n4(a - x.P)}\,q-${cfx(b / 2)}q^2\Big]_0^{${n4(x.Q)}}=${m(x.SC)}`;
  const spI = x => String.raw`\int_0^{${n4(x.Q)}}(${n4(x.P)}-${c})\,dq${x.F ? '-' + texT(F, 2) : ''}=${m(x.SPb - x.F)}`;
  const tab = `<div class="dtable-wrap"><table class="dtable"><thead><tr><th></th>${names.map(n => `<th>${n}</th>`).join('')}</tr></thead><tbody>
  <tr><td>${T_(['Production totale', 'Total output'])}</td>${D.sit.map(x => `<td class="num">${fqt(x.Q)}</td>`).join('')}</tr>
  <tr><td>${T_(['Prix', 'Price'])}</td>${D.sit.map(x => `<td class="num">${fqt(x.P)}</td>`).join('')}</tr>
  <tr><td>${T_(['Surplus des consommateurs', 'Consumer surplus'])}</td>${D.sit.map(x => `<td class="num">${fqt(x.SC)}</td>`).join('')}</tr>
  <tr><td>${T_(['Surplus des producteurs (net)', 'Producer surplus (net)'])}</td>${D.sit.map(x => `<td class="num">${fqt(x.SPb - x.F)}</td>`).join('')}</tr>
  <tr><td>${T_(['Surplus total', 'Total surplus'])}</td>${D.sit.map(x => `<td class="num">${fqt(x.W)}</td>`).join('')}</tr>
  <tr><td>${T_(['Perte sèche', 'Deadweight loss'])}</td>${D.sit.map(x => `<td class="num">${fqt(D.Wc - x.W)}</td>`).join('')}</tr></tbody></table></div>`;
  const ch = R.deter ? 1 : 2, X = D.sit[ch];
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Sans menace d\'entrée, le titulaire est un monopole : il égalise sa recette marginale', 'Without entry threat, the incumbent is a monopoly: it equates its marginal revenue'])} \(${a}-${cfx(2 * b)}Q\) ${T_(['au coût marginal :', 'with marginal cost:'])}
  \[${a}-${cfx(2 * b)}Q=${c}\iff q_m=${qfr(a + '-' + c, 2 * b, R.qm)}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix de monopole :', 'The inverse demand function then gives the monopoly price:'])} \(P_m=${a}-${bx}${n4(R.qm)}=${fqa(R.Pm)}\), ${T_(['et le profit', 'and the profit'])} \(\Pi_m=(${n4(R.Pm)}-${c})\times ${n4(R.qm)}=${fqa(R.pim)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['S\'il entre, l\'entrant fait face à la demande résiduelle', 'If it enters, the entrant faces the residual demand'])} \(P=${a}-${cfx(b)}q_I-${cfx(b)}q_E\). ${T_(['Il maximise', 'It maximises'])} \(\Pi_E=(${a}-${cfx(b)}q_I-${cfx(b)}q_E-${c})\,q_E-F\) ${T_(['en annulant la dérivée par rapport à', 'by setting the derivative with respect to'])} \(q_E\)${T_(['', ' to zero'])} :
  \[${a - c}-${cfx(b)}q_I-${cfx(2 * b)}q_E=0\iff q_E=\frac{${a - c}-${cfx(b)}q_I}{${n4(2 * b)}}\]
  ${T_(['En reportant cette quantité dans son profit, on obtient le profit de l\'entrant en fonction de', 'Substituting this quantity into its profit gives the entrant\'s profit as a function of'])} \(q_I\) :
  \[\Pi_E(q_I)=\frac{(${a - c}-${cfx(b)}q_I)^2}{${n4(4 * b)}}-${texT(F, 2)}\]
  ${T_(['L\'entrée est dissuadée si ce profit est négatif ou nul. La plus petite quantité qui y parvient, la quantité limite, annule ce profit :', 'Entry is deterred if this profit is non-positive. The smallest quantity that achieves this, the limit quantity, sets this profit to zero:'])}
  \[\begin{aligned}\Pi_E(q_L)=0&amp;\iff ${a - c}-${cfx(b)}q_L=2\sqrt{${n4(b)}\times ${texT(F, 2)}}=${fqa(2 * R.s)}\\&amp;\iff q_L=${qfr(String(a - c) + '-' + n4(2 * R.s), b, R.qL)}\end{aligned}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix limite :', 'The inverse demand function then gives the limit price:'])} \(P_L=${a}-${bx}${n4(R.qL)}=${n4(R.PL)}=c+2\sqrt{bF}\). ${T_(['Comme', 'Since'])} \(q_m=${n4(R.qm)}&lt;q_L=${fqa(R.qL)}\), ${T_(['la quantité de monopole ne suffit pas à décourager l\'entrant : l\'entrée n\'est pas bloquée.', 'the monopoly quantity is not enough to discourage the entrant: entry is not blockaded.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Pour dissuader l\'entrée, le titulaire produit', 'To deter entry, the incumbent produces'])} \(q_L\) ${T_(['et vend au prix limite ; il gagne', 'and sells at the limit price; it earns'])} \(\Pi_I^L=(${n4(R.PL)}-${c})\times ${n4(R.qL)}=${fqa(R.piL)}\). ${T_(['S\'il accepte l\'entrée en leader de Stackelberg, il intègre la réaction de l\'entrant dans son profit, maximise ce profit, puis en déduit la quantité de l\'entrant et, d\'après la demande inverse, le prix :', 'If it accommodates entry as a Stackelberg leader, it builds the entrant\'s reaction into its profit, maximises this profit, then deduces the entrant\'s quantity and, from inverse demand, the price:'])}
  \[\begin{aligned}\Pi_I(q_I)&amp;=\big(${a}-${cfx(b)}q_I-${cfx(b)}q_E(q_I)-${c}\big)\,q_I=\frac{${a - c}-${cfx(b)}q_I}{2}\,q_I&amp;&amp;\text{${T_(['car', 'since'])} }q_E(q_I)=\tfrac{${a - c}-${cfx(b)}q_I}{${n4(2 * b)}}\\q_I^S&amp;=${qfr(String(a - c), 2 * b, R.qIS)}&amp;&amp;\text{${T_(['en annulant la dérivée', 'setting the derivative to zero'])}}\\q_E^S&amp;=\frac{${a - c}-${b === 1 ? '' : texT(b, 2) + '\\times '}${n4(R.qIS)}}{${n4(2 * b)}}=${fqa(R.qES)}\\P^S&amp;=${a}-${bx}(${n4(R.qIS)}+${n4(R.qES)})=${fqa(R.PS)}\end{aligned}\]
  ${T_(['Les profits valent', 'Profits are'])} \(\Pi_I^S=(${n4(R.PS)}-${c})\times ${n4(R.qIS)}=${fqa(R.piIS)}\) ${T_(['et', 'and'])} \(\Pi_E^S=(${n4(R.PS)}-${c})\times ${n4(R.qES)}-${texT(F, 2)}=${fqa(R.piES)}\).</p>
  <p>${R.deter ? T_(['Comme', 'Since']) + ' \\(' + m(R.piL) + '&gt;' + m(R.piIS) + '\\), ' + T_(['le titulaire préfère dissuader l\'entrée : il sacrifie une partie de son profit de monopole', 'the incumbent prefers to deter entry: it gives up part of its monopoly profit']) + ' (\\(' + m(R.pim - R.piL) + '\\)) ' + T_(['pour rester seul.', 'to remain alone.']) : T_(['Comme', 'Since']) + ' \\(' + m(R.piIS) + '&gt;' + m(R.piL) + '\\), ' + T_(['le titulaire préfère accepter l\'entrée : le coût d\'entrée est trop faible, et dissuader exigerait une production trop élevée.', 'the incumbent prefers to accommodate entry: the entry cost is too low, and deterrence would require too high an output.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix ; le surplus des producteurs est l\'intégrale de l\'écart entre le prix et le coût marginal, diminuée du coût d\'entrée lorsque l\'entrant entre, car ce coût est une ressource réellement dépensée :', 'Consumer surplus is the integral of the gap between inverse demand and the price; producer surplus is the integral of the gap between the price and marginal cost, minus the entry cost when the entrant enters, since this cost is a resource actually spent:'])}
  \[\begin{aligned}${D.sit.map((x, k) => String.raw`${SC}_{\text{${['m', 'L', 'S'][k]}}}&amp;=${scI(x)}\\${SP}_{\text{${['m', 'L', 'S'][k]}}}&amp;=${spI(x)}`).join('\\\\')}\end{aligned}\]
  ${T_(['Le surplus total maximal, avec un prix égal au coût marginal et un seul producteur, vaut', 'Maximal total surplus, with a price equal to marginal cost and a single producer, is'])} \(\int_0^{${n4(D.Qc)}}(${a}-${cfx(b)}q-${c})\,dq=${fqa(D.Wc)}\). ${T_(['On en déduit le tableau :', 'Hence the table:'])}</p>
  ${tab}
  <p>${T_(['La menace d\'entrée, même lorsqu\'elle ne se réalise pas, oblige le titulaire à produire plus et à vendre moins cher : le surplus des consommateurs et le surplus total augmentent par rapport au monopole.', 'The threat of entry, even when it does not materialise, forces the incumbent to produce more and sell more cheaply: consumer surplus and total surplus rise relative to monopoly.'])} ${D.sit[2].W > D.sit[1].W ? T_(['L\'entrée acceptée donne le surplus total le plus élevé, malgré le coût d\'entrée.', 'Accommodated entry gives the highest total surplus, despite the entry cost.']) : T_(['La dissuasion donne ici un surplus total plus élevé que l\'entrée acceptée : le coût d\'entrée dépensé par l\'entrant l\'emporte sur le gain de production.', 'Deterrence here gives a higher total surplus than accommodated entry: the entry cost spent by the entrant outweighs the output gain.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le profit de l\'entrant est une parabole décroissante en', 'The entrant\'s profit is a parabola decreasing in'])} \(q_I\) ${T_(['sur la zone utile ; il s\'annule en', 'over the relevant range; it vanishes at'])} \(q_L\), ${T_(['au-delà de la quantité de monopole', 'beyond the monopoly quantity'])} \(q_m\) :</p>
  ${e7graphPE(D, lang)}
  <p>${T_(['Surplus dans la situation retenue par le titulaire', 'Surpluses in the situation chosen by the incumbent'])} (${names[ch].toLowerCase()}) :</p>
  ${eiSurplusFig({ lang: lang, a: a, b: b, P: X.P, Q: X.Q, cmin: c, seg: ch === 2 ? [[0, R.qIS, c], [R.qIS, X.Q, c]] : [[0, X.Q, c]], label: ch === 2 ? 'S' : 'L', aria: names[ch] })}
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => fracClean((D => e7sol(D, 'fr'))(D));
I18N.en.sol = D => fracClean((D => e7sol(D, 'en'))(D));