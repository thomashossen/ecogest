I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Producteur et consommateur 1 – Préférences, utilité et TMS', 'k-h1': 'Préférences, utilité et taux marginal de substitution', 'k-coursetitle': 'Représenter les goûts d\'un consommateur : axiomes, fonctions d\'utilité, courbes d\'indifférence et TMS', 'k-extitle': 'Utilité Cobb-Douglas et substituts parfaits : utilités marginales, TMS et courbes d\'indifférence', 'k-soltitle': 'Utilité Cobb-Douglas et substituts parfaits : utilités marginales, TMS et courbes d\'indifférence' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Producer and consumer 1 – Preferences, utility and MRS', 'k-h1': 'Preferences, utility and the marginal rate of substitution', 'k-coursetitle': 'Representing a consumer\'s tastes: axioms, utility functions, indifference curves and MRS', 'k-extitle': 'Cobb-Douglas utility and perfect substitutes: marginal utilities, MRS and indifference curves', 'k-soltitle': 'Cobb-Douglas utility and perfect substitutes: marginal utilities, MRS and indifference curves' });

/* ---------- outils : quatre familles de préférences ---------- */
const P1T = {
  cd: { u: (x, y) => Math.sqrt(x * y), ic: (u, x) => u * u / x, tms: (x, y) => y / x },
  sub: { u: (x, y) => 2 * x + y, ic: (u, x) => u - 2 * x, tms: () => 2 },
  comp: { u: (x, y) => Math.min(x, 2 * y), ic: null, tms: (x, y) => (x < 2 * y ? Infinity : x > 2 * y ? 0 : NaN) },
  ql: { u: (x, y) => 4 * Math.sqrt(x) + y, ic: (u, x) => u - 4 * Math.sqrt(x), tms: x => 2 / Math.sqrt(x) }
};

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez énoncer les axiomes usuels sur les préférences, représenter des préférences par une fonction d'utilité, tracer des courbes d'indifférence, calculer et interpréter le taux marginal de substitution (TMS), et reconnaître les grandes familles de préférences : Cobb-Douglas, substituts parfaits, compléments parfaits et quasi-linéaires.<br><br>
<strong>Pourquoi ?</strong> Toute la théorie de la demande repose sur une description des goûts. Le TMS, qui mesure ce que le consommateur est prêt à céder d'un bien pour obtenir une unité d'un autre, est l'outil qui relie ces goûts aux prix du marché.<br><br>
<strong>Prérequis.</strong> Dérivées partielles, logarithme.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Préférences</a> · <a href="#s2">2. Fonction d'utilité</a> · <a href="#s3">3. Courbes d'indifférence</a> · <a href="#s4">4. Le TMS</a> · <a href="#s5">5. Quatre familles</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Les préférences</div>
<p>Un consommateur compare des paniers \(x=(x_1,x_2)\) de deux biens. On note \(x\succsim y\) « \(x\) est au moins aussi bon que \(y\) ». On suppose habituellement que la relation est <em>complète</em> (deux paniers sont toujours comparables), <em>transitive</em> (si \(x\succsim y\) et \(y\succsim z\), alors \(x\succsim z\)), <em>monotone</em> (plus de chaque bien n'est jamais moins bon) et <em>convexe</em> (un mélange de deux paniers équivalents est au moins aussi bon que chacun d'eux : on préfère la diversité).</p>

<div class="dossier-title" id="s2">2. La fonction d'utilité</div>
<p>Une fonction d'utilité \(U\) représente les préférences si \(x\succsim y\iff U(x)\ge U(y)\). Elle n'est qu'<em>ordinale</em> : seul l'ordre des valeurs compte. Toute transformation strictement croissante \(f(U)\), comme \(\ln U\) ou \(U^2\), représente les mêmes préférences. On ne peut donc pas dire qu'un panier est « deux fois meilleur » qu'un autre. Les <em>utilités marginales</em> \(Um_i=\frac{\partial U}{\partial x_i}\) mesurent le gain d'utilité d'une petite unité supplémentaire du bien \(i\) ; elles dépendent de la fonction choisie, mais leur rapport n'en dépend pas.</p>

<div class="dossier-title" id="s3">3. Les courbes d'indifférence</div>
<p>Une courbe d'indifférence rassemble les paniers qui procurent le même niveau d'utilité : \(U(x_1,x_2)=u\). Avec des préférences monotones, elles sont décroissantes (pour garder le même niveau, il faut compenser une baisse d'un bien par une hausse de l'autre), ne se croisent pas (transitivité) et les plus éloignées de l'origine correspondent aux niveaux les plus élevés. Avec des préférences convexes, elles sont convexes : tournées vers l'origine.</p>

<div class="dossier-title" id="s4">4. Le taux marginal de substitution</div>
<p>Le long d'une courbe d'indifférence, \(dU=Um_1\,dx_1+Um_2\,dx_2=0\). Le <em>taux marginal de substitution</em> du bien 2 au bien 1 est la quantité de bien 2 que le consommateur accepte de céder pour une unité supplémentaire de bien 1 :
\[TMS_{1,2}=-\frac{dx_2}{dx_1}\Big|_{U=u}=\frac{Um_1}{Um_2}\]
C'est la valeur absolue de la pente de la courbe d'indifférence. Il ne dépend pas de la représentation choisie : une transformation croissante multiplie les deux utilités marginales par le même facteur. Avec des préférences convexes, il est décroissant le long d'une courbe : plus on possède de bien 1, moins on est prêt à céder de bien 2 pour en obtenir davantage.</p>
<div class="ifig" data-fig="ic"></div>
<div class="fig-cap">Figure 1 — Trois courbes d'indifférence pour chaque famille de préférences, et la tangente à la courbe du milieu au point choisi ; la valeur absolue de sa pente est le TMS. Déplacez le point le long de la courbe : le TMS diminue pour Cobb-Douglas et quasi-linéaire, reste constant pour les substituts parfaits, et n'est pas défini au coin des compléments parfaits.</div>

<div class="dossier-title" id="s5">5. Quatre familles de préférences</div>
<ul class="kit-simple">
<li><em>Cobb-Douglas</em> : \(U=x_1^\alpha x_2^\beta\), \(TMS=\frac{\alpha x_2}{\beta x_1}\) ; courbes convexes et régulières, cas de référence.</li>
<li><em>Substituts parfaits</em> : \(U=ax_1+bx_2\), \(TMS=\frac ab\) constant ; courbes rectilignes. Exemple : deux marques de stylos.</li>
<li><em>Compléments parfaits</em> : \(U=\min(ax_1,bx_2)\) ; courbes en L, les biens se consomment en proportions fixes. Exemple : chaussures gauches et droites.</li>
<li><em>Quasi-linéaires</em> : \(U=v(x_1)+x_2\), \(TMS=v'(x_1)\) ne dépend que de \(x_1\) ; courbes parallèles verticalement.</li>
</ul>
<div class="ifig" data-fig="tms"></div>
<div class="fig-cap">Figure 2 — TMS le long de la courbe d'indifférence Cobb-Douglas \(x_1x_2=16\), en fonction de \(x_1\). Il décroît : c'est la traduction de la convexité des préférences, et de la décroissance de l'utilité marginale relative du bien 1.</div>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Préférences complètes, transitives, monotones, convexes ; représentées par une utilité ordinale.</li>
<li>Courbe d'indifférence : \(U(x_1,x_2)=u\) ; décroissante, convexe, sans croisement.</li>
<li>\(TMS_{1,2}=\frac{Um_1}{Um_2}\), valeur absolue de la pente ; invariant par transformation croissante.</li>
<li>Cobb-Douglas \(\frac{\alpha x_2}{\beta x_1}\), substituts parfaits constant, compléments parfaits en L, quasi-linéaire \(v'(x_1)\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can state the usual axioms on preferences, represent preferences with a utility function, draw indifference curves, compute and interpret the marginal rate of substitution (MRS), and recognise the main families of preferences: Cobb-Douglas, perfect substitutes, perfect complements and quasi-linear.<br><br>
<strong>Why?</strong> The whole theory of demand rests on a description of tastes. The MRS, which measures how much of one good the consumer is willing to give up to obtain one unit of another, is the tool linking these tastes to market prices.<br><br>
<strong>Prerequisites.</strong> Partial derivatives, logarithm.
</div>
<p class="toc">Contents: <a href="#s1">1. Preferences</a> · <a href="#s2">2. Utility function</a> · <a href="#s3">3. Indifference curves</a> · <a href="#s4">4. The MRS</a> · <a href="#s5">5. Four families</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Preferences</div>
<p>A consumer compares bundles \(x=(x_1,x_2)\) of two goods. We write \(x\succsim y\) for "\(x\) is at least as good as \(y\)". The relation is usually assumed to be <em>complete</em> (two bundles can always be compared), <em>transitive</em> (if \(x\succsim y\) and \(y\succsim z\), then \(x\succsim z\)), <em>monotone</em> (more of each good is never worse) and <em>convex</em> (a mix of two equivalent bundles is at least as good as each of them: diversity is preferred).</p>

<div class="dossier-title" id="s2">2. The utility function</div>
<p>A utility function \(U\) represents preferences if \(x\succsim y\iff U(x)\ge U(y)\). It is only <em>ordinal</em>: only the order of values matters. Any strictly increasing transformation \(f(U)\), such as \(\ln U\) or \(U^2\), represents the same preferences. One therefore cannot say that a bundle is "twice as good" as another. <em>Marginal utilities</em> \(MU_i=\frac{\partial U}{\partial x_i}\) measure the utility gain from a small extra unit of good \(i\); they depend on the chosen function, but their ratio does not.</p>

<div class="dossier-title" id="s3">3. Indifference curves</div>
<p>An indifference curve gathers the bundles giving the same utility level: \(U(x_1,x_2)=u\). With monotone preferences, they are decreasing (to keep the same level, a fall in one good must be offset by a rise in the other), do not cross (transitivity), and those further from the origin correspond to higher levels. With convex preferences, they are convex: bowed towards the origin.</p>

<div class="dossier-title" id="s4">4. The marginal rate of substitution</div>
<p>Along an indifference curve, \(dU=MU_1\,dx_1+MU_2\,dx_2=0\). The <em>marginal rate of substitution</em> of good 2 for good 1 is the quantity of good 2 the consumer is willing to give up for one extra unit of good 1:
\[MRS_{1,2}=-\frac{dx_2}{dx_1}\Big|_{U=u}=\frac{MU_1}{MU_2}\]
It is the absolute value of the slope of the indifference curve. It does not depend on the chosen representation: an increasing transformation multiplies both marginal utilities by the same factor. With convex preferences, it decreases along a curve: the more good 1 one has, the less good 2 one is willing to give up for more of it.</p>
<div class="ifig" data-fig="ic"></div>
<div class="fig-cap">Figure 1 — Three indifference curves for each family of preferences, and the tangent to the middle curve at the chosen point; the absolute value of its slope is the MRS. Move the point along the curve: the MRS falls for Cobb-Douglas and quasi-linear, stays constant for perfect substitutes, and is undefined at the corner of perfect complements.</div>

<div class="dossier-title" id="s5">5. Four families of preferences</div>
<ul class="kit-simple">
<li><em>Cobb-Douglas</em>: \(U=x_1^\alpha x_2^\beta\), \(MRS=\frac{\alpha x_2}{\beta x_1}\); smooth convex curves, the benchmark case.</li>
<li><em>Perfect substitutes</em>: \(U=ax_1+bx_2\), \(MRS=\frac ab\) constant; straight-line curves. Example: two brands of pens.</li>
<li><em>Perfect complements</em>: \(U=\min(ax_1,bx_2)\); L-shaped curves, goods are consumed in fixed proportions. Example: left and right shoes.</li>
<li><em>Quasi-linear</em>: \(U=v(x_1)+x_2\), \(MRS=v'(x_1)\) depends only on \(x_1\); curves are vertical shifts of each other.</li>
</ul>
<div class="ifig" data-fig="tms"></div>
<div class="fig-cap">Figure 2 — MRS along the Cobb-Douglas indifference curve \(x_1x_2=16\), as a function of \(x_1\). It decreases: this reflects the convexity of preferences, and the declining relative marginal utility of good 1.</div>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Complete, transitive, monotone, convex preferences; represented by an ordinal utility.</li>
<li>Indifference curve: \(U(x_1,x_2)=u\); decreasing, convex, non-crossing.</li>
<li>\(MRS_{1,2}=\frac{MU_1}{MU_2}\), absolute value of the slope; invariant under increasing transformations.</li>
<li>Cobb-Douglas \(\frac{\alpha x_2}{\beta x_1}\), perfect substitutes constant, perfect complements L-shaped, quasi-linear \(v'(x_1)\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = { type: 'Préférences', cd: 'Cobb-Douglas √(x₁x₂)', sub: 'substituts 2x₁ + x₂', comp: 'compléments min(x₁, 2x₂)', ql: 'quasi-linéaire 4√x₁ + x₂', x: 'Position x₁ du point', icAria: 'Courbes d\'indifférence et TMS', tmsAria: 'TMS le long d\'une courbe d\'indifférence', tl: 'TMS', icRead: (t, x, y, m) => `Point (${fmtT(x, 2)} ; ${fmtT(y, 2)}) : ` + (isFinite(m) ? `TMS = <span class="v">${fmt(m, 3)}</span>` : (t === 'comp' ? 'TMS non défini au coin, nul ou infini de part et d\'autre' : 'TMS non défini')) };
I18N.en.f = { type: 'Preferences', cd: 'Cobb-Douglas √(x₁x₂)', sub: 'substitutes 2x₁ + x₂', comp: 'complements min(x₁, 2x₂)', ql: 'quasi-linear 4√x₁ + x₂', x: 'Position x₁ of the point', icAria: 'Indifference curves and MRS', tmsAria: 'MRS along an indifference curve', tl: 'MRS', icRead: (t, x, y, m) => `Point (${fmtT(x, 2)}; ${fmtT(y, 2)}): ` + (isFinite(m) ? `MRS = <span class="v">${fmt(m, 3)}</span>` : (t === 'comp' ? 'MRS undefined at the corner, zero or infinite on either side' : 'MRS undefined')) };
FIGS.ic = {
  state: { t: 'cd', x: 4 },
  controls: L => [{ key: 't', type: 'select', label: L.f.type, options: ['cd', 'sub', 'comp', 'ql'].map(k => ({ v: k, t: L.f[k] })) }, { key: 'x', label: L.f.x, min: 1, max: 9, step: 0.5, fmt: v => fmtT(v, 1) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, P = P1T[s.t], u0 = P.u(4, 4), G = Plot({ w: 520, h: 440, x0: 0, x1: 12, y0: 0, y1: 12, mt: 26, mb: 42, ml: 46 });
    G.axes({ xt: [0, 3, 6, 9, 12], yt: [0, 3, 6, 9, 12], xl: 'x₁', yl: 'x₂', xf: v => String(v), yf: v => String(v) });
    G.clip();
    const levels = [u0 * 0.6, u0, u0 * 1.5];
    let px = s.x, py;
    levels.forEach((u, k) => {
      const c = k === 1 ? COL.s1 : GREY, w = k === 1 ? 2.4 : 1.4;
      if (s.t === 'comp') { G.line([[u, 12], [u, u / 2], [12, u / 2]], { c: c, w: w, clip: true }); }
      else G.curve(x => P.ic(u, x), 0.05, 12, { c: c, w: w, clip: true }, 300);
    });
    if (s.t === 'comp') { py = Math.max(u0 / 2, 0); px = Math.max(px, u0); if (s.x < u0) { px = u0; py = u0 / 2 + (u0 - s.x); } }
    else py = P.ic(u0, px);
    const m = s.t === 'comp' ? (Math.abs(px - u0) < 1e-9 && Math.abs(py - u0 / 2) < 1e-9 ? NaN : px > u0 + 1e-9 ? 0 : Infinity) : P.tms(px, py);
    if (isFinite(m)) G.line([[px - 3, py + 3 * m], [px + 3, py - 3 * m]], { c: COL.s3, w: 1.8, dash: '6 4', clip: true });
    G.dot(px, py, { c: COL.s3, r: 6 });
    return { svg: '<div style="max-width:540px;margin:0 auto">' + G.svg(L.icAria) + '</div>', read: L.icRead(s.t, px, py, m) };
  }
};
FIGS.tms = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, G = Plot({ w: 640, h: 260, x0: 0, x1: 12, y0: 0, y1: 8, mt: 26, mb: 42 });
    G.axes({ xt: [0, 2, 4, 6, 8, 10, 12], yt: [0, 2, 4, 6, 8], xl: 'x₁', yl: L.tl, xf: v => String(v), yf: v => String(v) });
    G.clip(); G.curve(x => 16 / (x * x), 0.5, 12, { c: COL.s1, w: 2.4, clip: true }, 200);
    return { svg: G.svg(L.tmsAria), read: '' };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  D.al = pick([0.25, 0.5, 0.75, 1, 2]); D.be = pick([0.25, 0.5, 1, 1.5]); D.xA = rint(2, 8); D.yA = rint(2, 8);
  for (;;) { D.a = rint(1, 4); D.b = rint(1, 4); if (Math.abs(D.al * D.yA / (D.be * D.xA) - D.a / D.b) > 0.1) break; }
  D.UA = Math.pow(D.xA, D.al) * Math.pow(D.yA, D.be);
  D.U1 = D.al * D.UA / D.xA; D.U2 = D.be * D.UA / D.yA; D.tms = D.U1 / D.U2;
  D.xB = D.xA + 2; D.yB = Math.pow(D.UA / Math.pow(D.xB, D.al), 1 / D.be); D.tmsB = D.al * D.yB / (D.be * D.xB);
  return D;
};
const p1n = x => texT(x, 4);
const p1U = D => String.raw`U(x_1,x_2)=x_1^{${texT(D.al, 2)}}\,x_2^{${texT(D.be, 2)}}`.replace('^{1}', '').replace('^{1}', '');
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un consommateur a des préférences représentées par la fonction d'utilité \(${p1U(D)}\), définie pour \(x_1&gt;0\) et \(x_2&gt;0\). On considère le panier \(A=(${D.xA}\,;\,${D.yA})\).</div>
<div class="questions"><ol>
<li><div class="q-text">Calculez les utilités marginales des deux biens, puis leur valeur au point \(A\).</div></li>
<li><div class="q-text">Calculez le TMS du bien 2 au bien 1 au point \(A\) et interprétez-le.</div></li>
<li><div class="q-text">Déterminez l'équation de la courbe d'indifférence passant par \(A\). Quelle quantité de bien 2 le panier \(B\), qui contient \(${D.xB}\) unités de bien 1, doit-il contenir pour être indifférent à \(A\) ? Calculez le TMS en \(B\).</div></li>
<li><div class="q-text">Montrez que le TMS diminue le long de la courbe d'indifférence. Que traduit cette propriété ?</div></li>
<li><div class="q-text">On considère \(V=\ln U\). Calculez le TMS associé à \(V\). Que peut-on en conclure ?</div></li>
<li><div class="q-text">Un autre consommateur a pour utilité \(W(x_1,x_2)=${D.a}\,x_1+${D.b}\,x_2\). Calculez son TMS et tracez, sur un même graphique, sa courbe d'indifférence passant par \(A\) et celle du premier consommateur, avec la tangente en \(A\).</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A consumer has preferences represented by the utility function \(${p1U(D)}\), defined for \(x_1&gt;0\) and \(x_2&gt;0\). Consider the bundle \(A=(${D.xA}\,;\,${D.yA})\).</div>
<div class="questions"><ol>
<li><div class="q-text">Compute the marginal utilities of both goods, then their value at point \(A\).</div></li>
<li><div class="q-text">Compute the MRS of good 2 for good 1 at point \(A\) and interpret it.</div></li>
<li><div class="q-text">Determine the equation of the indifference curve through \(A\). How much good 2 must bundle \(B\), which contains \(${D.xB}\) units of good 1, contain to be indifferent to \(A\)? Compute the MRS at \(B\).</div></li>
<li><div class="q-text">Show that the MRS decreases along the indifference curve. What does this property express?</div></li>
<li><div class="q-text">Consider \(V=\ln U\). Compute the MRS associated with \(V\). What can we conclude?</div></li>
<li><div class="q-text">Another consumer has utility \(W(x_1,x_2)=${D.a}\,x_1+${D.b}\,x_2\). Compute their MRS and draw, on the same graph, their indifference curve through \(A\) and that of the first consumer, with the tangent at \(A\).</div></li>
</ol></div>`;
};
function p1sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], al = D.al, be = D.be, xA = D.xA, yA = D.yA, n = p1n, UM = T_(['Um', 'MU']), TMS = T_(['TMS', 'MRS']);
  const pw = (v, e) => e === 1 ? v : `${v}^{${texT(e, 2)}}`;
  const ex1 = al - 1, ex2 = be - 1, A = cfx(al, 2), B = cfx(be, 2);
  const G = Plot({ w: 520, h: 440, x0: 0, x1: Math.max(12, xA + 6), y0: 0, y1: Math.max(12, yA + 6), mt: 26, mb: 42, ml: 46 });
  const X1 = G.x1, Y1 = G.y1;
  G.axes({ xt: ticks(0, X1, 4), yt: ticks(0, Y1, 4), xl: 'x₁', yl: 'x₂', xf: v => fmtT(v, 0), yf: v => fmtT(v, 0) });
  G.clip();
  G.curve(x => Math.pow(D.UA / Math.pow(x, al), 1 / be), 0.05, X1, { c: COL.s1, w: 2.4, clip: true }, 400);
  const WA = D.a * xA + D.b * yA; G.line([[0, WA / D.b], [WA / D.a, 0]], { c: COL.s2, w: 2.2, clip: true });
  G.line([[xA - 4, yA + 4 * D.tms], [xA + 4, yA - 4 * D.tms]], { c: COL.s3, w: 1.6, dash: '6 4', clip: true });
  G.dot(xA, yA, { c: COL.s3, r: 6 }); G.text(xA, yA, 'A', { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12 });
  G.dot(D.xB, D.yB, { c: COL.s1, r: 5 }); G.text(D.xB, D.yB, 'B', { dx: 9, dy: -7, anchor: 'start', bold: true, size: 12 });
  G.legend([{ c: COL.s1, t: 'U' }, { c: COL.s2, t: 'W' }, { c: COL.s3, dash: '6 4', t: T_(['tangente en A', 'tangent at A']) }], G.ml + 100, 16);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Les utilités marginales sont les dérivées partielles de', 'Marginal utilities are the partial derivatives of'])} \(U\) ${T_(['par rapport à chaque quantité, l\'autre étant fixée :', 'with respect to each quantity, the other being held fixed:'])}
  \[${UM}_1=\frac{\partial U}{\partial x_1}=${A}${ex1 === 0 ? '' : pw('x_1', ex1)}\,${pw('x_2', be)}\qquad ${UM}_2=\frac{\partial U}{\partial x_2}=${B}${pw('x_1', al)}\,${ex2 === 0 ? '' : pw('x_2', ex2)}\]
  ${T_(['Au point', 'At point'])} \(A\), ${T_(['on a', 'we have'])} \(U(A)=${pw(xA, al)}\times ${pw(yA, be)}\approx ${n(D.UA)}\), ${T_(['et l\'on peut écrire', 'and we can write'])} \(${UM}_1=\frac{${A}U}{x_1}\), \(${UM}_2=\frac{${B}U}{x_2}\) :
  \[${UM}_1(A)=\frac{${texT(al, 2)}\times ${n(D.UA)}}{${xA}}\approx ${n(D.U1)}\qquad ${UM}_2(A)=\frac{${texT(be, 2)}\times ${n(D.UA)}}{${yA}}\approx ${n(D.U2)}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le TMS est le rapport des utilités marginales ; les puissances communes se simplifient :', 'The MRS is the ratio of marginal utilities; common powers cancel out:'])}
  \[${TMS}_{1,2}=\frac{${UM}_1}{${UM}_2}=\frac{${A}x_2}{${B}x_1}\qquad ${TMS}_{1,2}(A)=\frac{${texT(al, 2)}\times ${yA}}{${texT(be, 2)}\times ${xA}}=${n(D.tms)}\]
  ${T_(['Au point', 'At point'])} \(A\), ${T_(['le consommateur est prêt à céder environ', 'the consumer is willing to give up about'])} \(${n(D.tms)}\) ${T_(['unité(s) de bien 2 pour obtenir une unité supplémentaire de bien 1, en restant au même niveau de satisfaction. C\'est la valeur absolue de la pente de la courbe d\'indifférence en', 'unit(s) of good 2 to obtain one extra unit of good 1, while staying at the same satisfaction level. It is the absolute value of the slope of the indifference curve at'])} \(A\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La courbe d\'indifférence passant par', 'The indifference curve through'])} \(A\) ${T_(['est l\'ensemble des paniers tels que', 'is the set of bundles such that'])} \(U(x_1,x_2)=U(A)\approx ${n(D.UA)}\). ${T_(['En isolant', 'Solving for'])} \(x_2\) :
  \[${pw('x_1', al)}\,${pw('x_2', be)}=${n(D.UA)}\iff x_2=\Big(\frac{${n(D.UA)}}{${pw('x_1', al)}}\Big)^{${texT(1 / be, 4)}}\]
  ${T_(['Pour', 'For'])} \(x_1=${D.xB}\), ${T_(['on obtient', 'we get'])} \(x_2=\big(${n(D.UA)}/${pw(D.xB, al)}\big)^{${texT(1 / be, 4)}}\approx ${n(D.yB)}\) : ${T_(['le panier', 'bundle'])} \(B=(${D.xB}\,;\,${n(D.yB)})\) ${T_(['est indifférent à', 'is indifferent to'])} \(A\). ${T_(['Le TMS y vaut', 'The MRS there is'])} \(\frac{${texT(al, 2)}\times ${n(D.yB)}}{${texT(be, 2)}\times ${D.xB}}\approx ${n(D.tmsB)}\), ${T_(['plus faible qu\'en', 'lower than at'])} \(A\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le long de la courbe d\'indifférence, quand', 'Along the indifference curve, as'])} \(x_1\) ${T_(['augmente,', 'rises,'])} \(x_2=\big(u/x_1^{${texT(al, 2)}}\big)^{1/${texT(be, 2)}}\) ${T_(['diminue ; le TMS', 'falls; the MRS'])} \(\frac{${A}x_2}{${B}x_1}\) ${T_(['a donc un numérateur qui diminue et un dénominateur qui augmente : il est strictement décroissant. On le vérifie entre', 'thus has a falling numerator and a rising denominator: it is strictly decreasing. This is checked between'])} \(A\) ${T_(['et', 'and'])} \(B\) (\(${n(D.tms)}&gt;${n(D.tmsB)}\)). ${T_(['Cette propriété traduit la convexité des préférences : plus le consommateur possède de bien 1 relativement au bien 2, moins il est prêt à sacrifier de bien 2 pour une unité de plus de bien 1. Les courbes d\'indifférence sont tournées vers l\'origine.', 'This property reflects the convexity of preferences: the more good 1 the consumer has relative to good 2, the less good 2 they are willing to sacrifice for one more unit of good 1. Indifference curves are bowed towards the origin.'])}</p>
</div></li>
<li><div class="q-content">
  <p>\(V=\ln U=${A}\ln x_1+${B}\ln x_2\), ${T_(['d\'où', 'hence'])} \(\frac{\partial V}{\partial x_1}=\frac{${texT(al, 2)}}{x_1}\) ${T_(['et', 'and'])} \(\frac{\partial V}{\partial x_2}=\frac{${texT(be, 2)}}{x_2}\), ${T_(['et le TMS', 'and the MRS'])}
  \[${TMS}_V=\frac{${texT(al, 2)}/x_1}{${texT(be, 2)}/x_2}=\frac{${A}x_2}{${B}x_1}=${TMS}_U\]
  ${T_(['Les deux fonctions ont le même TMS en tout point, donc les mêmes courbes d\'indifférence : elles représentent les mêmes préférences. C\'est attendu, puisque', 'Both functions have the same MRS everywhere, hence the same indifference curves: they represent the same preferences. This is expected, since'])} \(\ln\) ${T_(['est strictement croissante : l\'utilité est ordinale.', 'is strictly increasing: utility is ordinal.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Pour', 'For'])} \(W\), \(\frac{\partial W}{\partial x_1}=${D.a}\) ${T_(['et', 'and'])} \(\frac{\partial W}{\partial x_2}=${D.b}\) : ${T_(['le TMS vaut', 'the MRS is'])} \(\frac{${D.a}}{${D.b}}=${n(D.a / D.b)}\) ${T_(['en tout point. Ce consommateur considère les biens comme des substituts parfaits : il échange toujours', 'at every point. This consumer regards the goods as perfect substitutes: they always trade'])} ${D.b} ${T_(['unité(s) de bien 1 contre', 'unit(s) of good 1 for'])} ${D.a} ${T_(['unité(s) de bien 2, quelle que soit la composition du panier. Sa courbe d\'indifférence passant par', 'unit(s) of good 2, whatever the composition of the bundle. Their indifference curve through'])} \(A\) ${T_(['est la droite', 'is the line'])} \(${D.a}\,x_1+${D.b}\,x_2=${D.a * xA + D.b * yA}\), ${T_(['de pente', 'with slope'])} \(-${n(D.a / D.b)}\) :</p>
  <div class="sol-fig"><div style="max-width:540px;margin:0 auto">${G.svg('ic')}</div></div>
  <p>${T_(['Au point', 'At point'])} \(A\), ${T_(['la courbe de', 'the curve of'])} \(U\) ${T_(['a pour pente', 'has slope'])} \(-${n(D.tms)}\) ${T_(['(tangente en pointillés) ; elle est plus', '(dashed tangent); it is'])} ${D.tms > D.a / D.b ? T_(['pentue que la droite de', 'steeper than the line of']) : T_(['plate que la droite de', 'flatter than the line of'])} \(W\) : ${T_(['en', 'at'])} \(A\), ${T_(['le premier consommateur valorise relativement', 'the first consumer values good 1 relatively'])} ${D.tms > D.a / D.b ? T_(['plus', 'more']) : T_(['moins', 'less'])} ${T_(['le bien 1 que le second.', 'than the second consumer.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => p1sol(D, 'fr');
I18N.en.sol = D => p1sol(D, 'en');
