/* ============================================================
   PAGE mf19 — Dédication contre immunisation
   ============================================================ */
const GREY = '#8a857a';
I18N.fr.k = {
  'k-badge': 'MATHÉMATIQUES FINANCIÈRES', 'k-seed': 'Seed de reproductibilité', 'k-seedtip': 'Vide = nouvel exercice aléatoire', 'k-gen': 'Générer',
  'k-tag-course': 'Cours', 'k-tag-ex': 'Exercice', 'k-tag-sol': 'Corrigé', 'k-seedbadge': 'Seed&nbsp;:', showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
  phSeed: 'auto', copy: 'Copier', copied: 'Copié',
  'k-sub': '© Thomas Hossen – Version du 20 octobre 2026', title: 'Mathématiques financières 19 – Dédication contre immunisation', 'k-h1': 'Dédication contre immunisation',
  'k-coursetitle': 'Protéger un passif contre les mouvements de taux : duration, convexité et leurs limites', 'k-extitle': 'Immuniser un passif avec deux zéro-coupons', 'k-soltitle': 'Immuniser un passif avec deux zéro-coupons'
};
I18N.en.k = {
  'k-badge': 'MATHEMATICS FOR FINANCE', 'k-seed': 'Reproducibility seed', 'k-seedtip': 'Empty = new random exercise', 'k-gen': 'Generate',
  'k-tag-course': 'Lesson', 'k-tag-ex': 'Exercise', 'k-tag-sol': 'Solution', 'k-seedbadge': 'Seed:', showSol: 'Show solution', hideSol: 'Hide solution',
  phSeed: 'auto', copy: 'Copy', copied: 'Copied',
  'k-sub': '© Thomas Hossen – Version of 20 October 2026', title: 'Mathematics for Finance 19 – Dedication versus immunisation', 'k-h1': 'Dedication versus immunisation',
  'k-coursetitle': 'Protecting a liability against rate moves: duration, convexity and their limits', 'k-extitle': 'Immunising a liability with two zero-coupon bonds', 'k-soltitle': 'Immunising a liability with two zero-coupon bonds'
};

/* ---------- outils ---------- */
/* barbell de deux zéro-coupons d'échéances T1 < T < T2 calé en valeur et en duration sur un passif L à T, taux plat y */
function d19bar(L, T, y, T1, T2) {
  const PV = L * Math.pow(1 + y, -T), w1 = (T2 - T) / (T2 - T1), w2 = (T - T1) / (T2 - T1);
  const a1 = PV * w1, a2 = PV * w2, F1 = a1 * Math.pow(1 + y, T1), F2 = a2 * Math.pow(1 + y, T2);
  const CL = T * (T + 1) / Math.pow(1 + y, 2), CA = (w1 * T1 * (T1 + 1) + w2 * T2 * (T2 + 1)) / Math.pow(1 + y, 2);
  return { PV: PV, w1: w1, w2: w2, a1: a1, a2: a2, F1: F1, F2: F2, CL: CL, CA: CA };
}
/* surplus quand le taux de l'échéance t devient y + a + b (t - T) */
function d19surplus(B, L, T, y, T1, T2, a, b) {
  const r = t => y + a + b * (t - T);
  return B.F1 * Math.pow(1 + r(T1), -T1) + B.F2 * Math.pow(1 + r(T2), -T2) - L * Math.pow(1 + r(T), -T);
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez calculer la valeur actuelle, la duration et la convexité d'un flux, construire un portefeuille immunisé contre les déplacements parallèles de la courbe des taux, expliquer pourquoi la convexité le protège, et montrer sur un exemple ce que l'immunisation ne couvre pas, contrairement à la dédication.<br><br>
<strong>Pourquoi en finance ?</strong> Assureurs, fonds de pension et banques doivent honorer des engagements lointains. Les couvrir flux par flux (page 16) est rarement possible sur des décennies ; on se contente alors d'aligner la valeur et la sensibilité aux taux de l'actif sur celles du passif.<br><br>
<strong>Prérequis.</strong> Actualisation (page 3), dédication et taux implicites (page 16), développement de Taylor à l'ordre 2.
</div>
<p class="toc">Sommaire : <a href="#s1">1. Valeur, duration, convexité</a> · <a href="#s2">2. Le principe de l'immunisation</a> · <a href="#s3">3. Deux zéro-coupons</a> · <a href="#s4">4. Ce que l'immunisation ne couvre pas</a> · <a href="#s5">5. Dédication ou immunisation ?</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Valeur, duration et convexité</div>
<p>On considère des flux \(c_t\) versés aux dates \(t\), actualisés au taux plat annuel \(y\). Leur valeur actuelle, leur duration de Macaulay et leur convexité sont :
\[V(y)=\sum_t c_t(1+y)^{-t},\qquad D=\frac{1}{V}\sum_t t\,c_t(1+y)^{-t},\qquad C=\frac{1}{V}\sum_t t(t+1)\,c_t(1+y)^{-t-2}\]
La duration est la date moyenne des flux, pondérée par leurs valeurs actuelles ; pour un zéro-coupon d'échéance \(T\), \(D=T\) et \(C=T(T+1)/(1+y)^2\). Elles décrivent la réaction de la valeur à un petit déplacement \(\Delta y\) du taux, par le développement de Taylor :
\[\frac{V(y+\Delta y)-V(y)}{V(y)}\approx-\frac{D}{1+y}\,\Delta y+\frac{C}{2}\,(\Delta y)^2\]
La duration modifiée \(D/(1+y)\) donne la sensibilité au premier ordre ; la convexité corrige la courbure.</p>

<div class="dossier-title" id="s2">2. Le principe de l'immunisation</div>
<p>Un passif de valeur \(V_L(y)\) est couvert par un actif de valeur \(V_A(y)\). Le surplus est \(S(y)=V_A(y)-V_L(y)\). Si l'on choisit l'actif tel que, au taux actuel \(y_0\) :</p>
<ul class="kit-simple">
<li>\(V_A(y_0)=V_L(y_0)\) : l'actif paie exactement le passif aujourd'hui ;</li>
<li>\(D_A=D_L\) : les deux réagissent de la même façon au premier ordre ;</li>
<li>\(C_A&gt;C_L\) : l'actif est plus convexe que le passif ;</li>
</ul>
<p>alors le développement de Taylor donne, pour un petit déplacement parallèle :
\[S(y_0+\Delta y)\approx V_L(y_0)\,\frac{C_A-C_L}{2}\,(\Delta y)^2\ \ge 0\]
Le surplus est minimal, et nul, au taux actuel : quel que soit le sens du mouvement, l'actif gagne plus ou perd moins que le passif. Ce sont les conditions de Redington (1952).</p>

<div class="dossier-title" id="s3">3. Immuniser avec deux zéro-coupons</div>
<p>Un passif unique \(L\) est dû dans \(T\) ans. On dispose de zéro-coupons d'échéances \(T_1&lt;T&lt;T_2\), mais pas d'échéance \(T\). On y investit les montants \(a_1\) et \(a_2\), de poids \(w_i=a_i/V_L\). Égaler les valeurs et les durations donne :
\[\left\{\begin{aligned}w_1+w_2&amp;=1\\w_1T_1+w_2T_2&amp;=T\end{aligned}\right.\qquad\iff\qquad w_1=\frac{T_2-T}{T_2-T_1},\quad w_2=\frac{T-T_1}{T_2-T_1}\]
Les valeurs nominales achetées sont \(F_i=a_i(1+y)^{T_i}\). La convexité est alors automatiquement plus grande que celle du passif : comme \(w_1T_1+w_2T_2=T\),
\[C_A-C_L=\frac{w_1T_1^2+w_2T_2^2-T^2}{(1+y)^2}=\frac{(T_2-T)(T-T_1)}{(1+y)^2}&gt;0\]
Ce portefeuille aux deux extrémités, appelé <em>barbell</em>, est d'autant plus convexe que les échéances sont écartées. Pour un déplacement parallèle quelconque de la courbe plate, le surplus reste même positif, et pas seulement au voisinage de \(y_0\).</p>
<div class="ifig" data-fig="surplus"></div>
<div class="fig-cap">Figure 1 — Surplus d'un portefeuille de deux zéro-coupons immunisant un passif de 1000 dû dans 6 ans, au taux de 4 %, en fonction d'un déplacement parallèle de la courbe. Il est nul au taux actuel et positif ailleurs. Écartez les échéances \(T_1\) et \(T_2\) : la convexité augmente, et le surplus aussi pour un même déplacement.</div>

<div class="dossier-title" id="s4">4. Ce que l'immunisation ne couvre pas</div>
<p>L'immunisation protège contre les déplacements <em>parallèles</em>. Si la courbe se déforme, par exemple en pivotant autour de l'échéance \(T\), le taux de l'échéance \(t\) devient \(y_0+b\,(t-T)\) : les taux courts et les taux longs bougent en sens contraires. Le zéro-coupon court et le zéro-coupon long ne compensent plus le passif, et le surplus peut devenir négatif. Par exemple, une pentification (\(b&gt;0\)) fait baisser la valeur du zéro long bien plus que la hausse de celle du zéro court ne la compense, si l'échéance longue est loin. Il faut alors rééquilibrer le portefeuille, ce qui expose au risque de réinvestissement et à des coûts de transaction. La duration et la convexité résument la sensibilité à un seul facteur, le niveau des taux.</p>
<div class="ifig" data-fig="twist"></div>
<div class="fig-cap">Figure 2 — Surplus du même portefeuille quand la courbe se déplace de \(a\) et pivote de pente \(b\) par an autour de 6 ans. Avec \(b=0\), on retrouve la figure 1. Dès que \(b\ne 0\), la courbe du surplus se décale et prend des valeurs négatives : le pivotement, que la duration ne voit pas, crée une perte.</div>

<div class="dossier-title" id="s5">5. Dédication ou immunisation ?</div>
<p>Si un zéro-coupon d'échéance \(T\) existe, l'acheter couvre le passif exactement, quelle que soit la déformation de la courbe : c'est la dédication, qui élimine le risque de taux et le risque de réinvestissement. Elle exige des titres d'échéances et de flux adaptés, ce qui la rend rigide et souvent coûteuse ; elle convient aux horizons courts ou moyens. L'immunisation est toujours réalisable avec des titres quelconques et généralement moins chère, mais elle ne protège que contre de petits déplacements parallèles et demande des rééquilibrages ; elle sert pour les horizons longs. En pratique, on combine souvent les deux : dédication des premières années, immunisation au-delà.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Duration : date moyenne des flux et sensibilité au premier ordre ; convexité : courbure.</li>
<li>Immuniser : égaler les valeurs et les durations, avec une convexité de l'actif supérieure ; le surplus est alors minimal au taux actuel.</li>
<li>Avec deux zéro-coupons encadrant \(T\) : \(w_1=\frac{T_2-T}{T_2-T_1}\), \(w_2=\frac{T-T_1}{T_2-T_1}\), et \(C_A-C_L=\frac{(T_2-T)(T-T_1)}{(1+y)^2}\).</li>
<li>L'immunisation ne protège ni contre les déformations de la courbe ni dans la durée sans rééquilibrage ; la dédication, elle, est exacte.</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can compute the present value, duration and convexity of a cash flow stream, build a portfolio immunised against parallel shifts of the yield curve, explain why convexity protects it, and show on an example what immunisation does not cover, unlike dedication.<br><br>
<strong>Why in finance?</strong> Insurers, pension funds and banks must honour distant commitments. Covering them cash flow by cash flow (page 16) is seldom possible over decades; one then settles for matching the value and the interest-rate sensitivity of the assets to those of the liabilities.<br><br>
<strong>Prerequisites.</strong> Discounting (page 3), dedication and implied rates (page 16), second-order Taylor expansion.
</div>
<p class="toc">Contents: <a href="#s1">1. Value, duration, convexity</a> · <a href="#s2">2. The principle of immunisation</a> · <a href="#s3">3. Two zero-coupon bonds</a> · <a href="#s4">4. What immunisation misses</a> · <a href="#s5">5. Dedication or immunisation?</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Value, duration and convexity</div>
<p>Consider cash flows \(c_t\) paid at dates \(t\), discounted at the flat annual rate \(y\). Their present value, Macaulay duration and convexity are:
\[V(y)=\sum_t c_t(1+y)^{-t},\qquad D=\frac{1}{V}\sum_t t\,c_t(1+y)^{-t},\qquad C=\frac{1}{V}\sum_t t(t+1)\,c_t(1+y)^{-t-2}\]
Duration is the average date of the cash flows, weighted by their present values; for a zero-coupon bond with maturity \(T\), \(D=T\) and \(C=T(T+1)/(1+y)^2\). They describe how the value reacts to a small move \(\Delta y\) of the rate, through the Taylor expansion:
\[\frac{V(y+\Delta y)-V(y)}{V(y)}\approx-\frac{D}{1+y}\,\Delta y+\frac{C}{2}\,(\Delta y)^2\]
The modified duration \(D/(1+y)\) gives the first-order sensitivity; convexity corrects for curvature.</p>

<div class="dossier-title" id="s2">2. The principle of immunisation</div>
<p>A liability with value \(V_L(y)\) is covered by an asset with value \(V_A(y)\). The surplus is \(S(y)=V_A(y)-V_L(y)\). If the asset is chosen so that, at the current rate \(y_0\):</p>
<ul class="kit-simple">
<li>\(V_A(y_0)=V_L(y_0)\): the asset pays the liability exactly today;</li>
<li>\(D_A=D_L\): both react in the same way to first order;</li>
<li>\(C_A&gt;C_L\): the asset is more convex than the liability;</li>
</ul>
<p>then the Taylor expansion gives, for a small parallel shift:
\[S(y_0+\Delta y)\approx V_L(y_0)\,\frac{C_A-C_L}{2}\,(\Delta y)^2\ \ge 0\]
The surplus is minimal, and zero, at the current rate: whichever way rates move, the asset gains more or loses less than the liability. These are Redington's conditions (1952).</p>

<div class="dossier-title" id="s3">3. Immunising with two zero-coupon bonds</div>
<p>A single liability \(L\) is due in \(T\) years. Zero-coupon bonds with maturities \(T_1&lt;T&lt;T_2\) are available, but none with maturity \(T\). Amounts \(a_1\) and \(a_2\) are invested in them, with weights \(w_i=a_i/V_L\). Matching values and durations gives:
\[\left\{\begin{aligned}w_1+w_2&amp;=1\\w_1T_1+w_2T_2&amp;=T\end{aligned}\right.\qquad\iff\qquad w_1=\frac{T_2-T}{T_2-T_1},\quad w_2=\frac{T-T_1}{T_2-T_1}\]
The face values bought are \(F_i=a_i(1+y)^{T_i}\). Convexity is then automatically larger than the liability's: since \(w_1T_1+w_2T_2=T\),
\[C_A-C_L=\frac{w_1T_1^2+w_2T_2^2-T^2}{(1+y)^2}=\frac{(T_2-T)(T-T_1)}{(1+y)^2}&gt;0\]
This portfolio at both ends, called a <em>barbell</em>, is all the more convex as the maturities are far apart. For any parallel shift of the flat curve, the surplus even remains positive, not only near \(y_0\).</p>
<div class="ifig" data-fig="surplus"></div>
<div class="fig-cap">Figure 1 — Surplus of a portfolio of two zero-coupon bonds immunising a liability of 1000 due in 6 years, at 4%, as a function of a parallel shift of the curve. It is zero at the current rate and positive elsewhere. Spread the maturities \(T_1\) and \(T_2\) apart: convexity increases, and so does the surplus for a given shift.</div>

<div class="dossier-title" id="s4">4. What immunisation misses</div>
<p>Immunisation protects against <em>parallel</em> shifts. If the curve changes shape, for instance by rotating around maturity \(T\), the rate of maturity \(t\) becomes \(y_0+b\,(t-T)\): short and long rates move in opposite directions. The short and the long zero-coupon bonds no longer offset the liability, and the surplus may turn negative. For instance, a steepening (\(b&gt;0\)) lowers the value of the long zero far more than the rise in the short zero's value offsets, if the long maturity is far away. The portfolio must then be rebalanced, which brings reinvestment risk and transaction costs. Duration and convexity summarise the sensitivity to a single factor, the level of rates.</p>
<div class="ifig" data-fig="twist"></div>
<div class="fig-cap">Figure 2 — Surplus of the same portfolio when the curve shifts by \(a\) and rotates with slope \(b\) per year around 6 years. With \(b=0\), figure 1 is recovered. As soon as \(b\ne 0\), the surplus curve moves and takes negative values: the rotation, which duration does not see, creates a loss.</div>

<div class="dossier-title" id="s5">5. Dedication or immunisation?</div>
<p>If a zero-coupon bond with maturity \(T\) exists, buying it covers the liability exactly, whatever the change in the curve: this is dedication, which eliminates interest-rate risk and reinvestment risk. It requires securities with suitable maturities and cash flows, which makes it rigid and often expensive; it suits short or medium horizons. Immunisation is always feasible with any securities and usually cheaper, but it only protects against small parallel shifts and requires rebalancing; it serves for long horizons. In practice, both are often combined: dedication of the first years, immunisation beyond.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Duration: average date of the cash flows and first-order sensitivity; convexity: curvature.</li>
<li>Immunising: match values and durations, with a higher asset convexity; the surplus is then minimal at the current rate.</li>
<li>With two zero-coupon bonds around \(T\): \(w_1=\frac{T_2-T}{T_2-T_1}\), \(w_2=\frac{T-T_1}{T_2-T_1}\), and \(C_A-C_L=\frac{(T_2-T)(T-T_1)}{(1+y)^2}\).</li>
<li>Immunisation protects neither against changes in the shape of the curve nor over time without rebalancing; dedication is exact.</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  T1: 'Échéance courte T₁', T2: 'Échéance longue T₂', dy: 'déplacement parallèle Δy (points de %)', sur: 'surplus', surAria: 'Surplus du portefeuille immunisé en fonction d\'un déplacement parallèle des taux',
  surRead: (B, s2, s2m) => `Poids : <i>w</i><sub>1</sub> = <span class="v">${fmt(B.w1, 3)}</span>, <i>w</i><sub>2</sub> = <span class="v">${fmt(B.w2, 3)}</span> &nbsp;·&nbsp; convexités : actif <span class="v">${fmt(B.CA, 2)}</span>, passif <span class="v">${fmt(B.CL, 2)}</span><br>Surplus pour Δy = +2 points : <span class="v">${fmt(s2, 2)}</span> ; pour Δy = −2 points : <span class="v">${fmt(s2m, 2)}</span>`,
  b: 'Pente du pivotement b', twAria: 'Surplus du portefeuille immunisé quand la courbe se déplace et pivote', tw: 'avec pivotement', par: 'sans pivotement',
  twRead: (s0, mn) => `Surplus pour <i>a</i> = 0 : <span class="v">${fmt(s0, 2)}</span> &nbsp;·&nbsp; surplus minimal sur la plage : <span class="v">${fmt(mn, 2)}</span>` + (mn < -1e-6 ? ' : l\'immunisation ne protège plus.' : '.')
};
I18N.en.f = {
  T1: 'Short maturity T₁', T2: 'Long maturity T₂', dy: 'parallel shift Δy (percentage points)', sur: 'surplus', surAria: 'Surplus of the immunised portfolio as a function of a parallel shift of rates',
  surRead: (B, s2, s2m) => `Weights: <i>w</i><sub>1</sub> = <span class="v">${fmt(B.w1, 3)}</span>, <i>w</i><sub>2</sub> = <span class="v">${fmt(B.w2, 3)}</span> &nbsp;·&nbsp; convexities: asset <span class="v">${fmt(B.CA, 2)}</span>, liability <span class="v">${fmt(B.CL, 2)}</span><br>Surplus for Δy = +2 points: <span class="v">${fmt(s2, 2)}</span>; for Δy = −2 points: <span class="v">${fmt(s2m, 2)}</span>`,
  b: 'Rotation slope b', twAria: 'Surplus of the immunised portfolio when the curve shifts and rotates', tw: 'with rotation', par: 'without rotation',
  twRead: (s0, mn) => `Surplus for <i>a</i> = 0: <span class="v">${fmt(s0, 2)}</span> &nbsp;·&nbsp; minimum surplus over the range: <span class="v">${fmt(mn, 2)}</span>` + (mn < -1e-6 ? ': immunisation no longer protects.' : '.')
};
FIGS.surplus = {
  state: { T1: 2, T2: 10 },
  controls: L => [
    { key: 'T1', label: L.f.T1, min: 1, max: 5, step: 1, fmt: v => String(v) },
    { key: 'T2', label: L.f.T2, min: 7, max: 15, step: 1, fmt: v => String(v) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, B = d19bar(1000, 6, 0.04, s.T1, s.T2);
    const f = d => d19surplus(B, 1000, 6, 0.04, s.T1, s.T2, d / 100, 0);
    const ymax = Math.max(6, Math.ceil(Math.max(f(-3), f(3)) + 1));
    const G = Plot({ w: 680, h: 300, x0: -3, x1: 3, y0: -1, y1: ymax, mt: 26, mb: 42 });
    G.axes({ xt: [-3, -2, -1, 0, 1, 2, 3], yt: ticks(0, ymax, 5), xl: L.dy, xf: v => (v > 0 ? '+' : '') + v, yf: v => fmtT(v, 0), xAxisAt: 0 });
    G.curve(f, -3, 3, { c: COL.s1, w: 2.4 }, 160);
    G.dot(0, 0, { c: COL.s3 });
    G.legend([{ c: COL.s1, t: L.sur }], G.ml + 8, 16);
    return { svg: G.svg(L.surAria), read: L.surRead(B, f(2), f(-2)) };
  }
};
FIGS.twist = {
  state: { b: 0.2 },
  controls: L => [{ key: 'b', label: L.f.b, min: -0.4, max: 0.4, step: 0.05, fmt: v => (v > 0 ? '+' : '') + fmtT(v, 2) + ' pt' }],
  draw: function (s, lang) {
    const L = I18N[lang].f, B = d19bar(1000, 6, 0.04, 2, 10);
    const f = (a, b) => d19surplus(B, 1000, 6, 0.04, 2, 10, a / 100, b / 100);
    let mn = Infinity; for (let a = -3; a <= 3.0001; a += 0.05) mn = Math.min(mn, f(a, s.b));
    const vals = [f(-3, s.b), f(3, s.b), f(-3, 0), f(3, 0), mn], lo = Math.floor(Math.min(-2, ...vals)), hi = Math.ceil(Math.max(...vals) + 1);
    const G = Plot({ w: 680, h: 300, x0: -3, x1: 3, y0: lo, y1: hi, mt: 26, mb: 42 });
    G.axes({ xt: [-3, -2, -1, 0, 1, 2, 3], yt: ticks(lo, hi, 5), xl: 'a', xf: v => (v > 0 ? '+' : '') + v, yf: v => fmtT(v, 0), xAxisAt: 0 });
    G.curve(a => f(a, 0), -3, 3, { c: GREY, w: 1.6, dash: '5 4' }, 120);
    G.curve(a => f(a, s.b), -3, 3, { c: COL.s3, w: 2.4 }, 160);
    G.legend([{ c: COL.s3, t: L.tw }, { c: GREY, dash: '5 4', t: L.par }], G.ml + 8, 16);
    return { svg: G.svg(L.twAria), read: L.twRead(f(0, s.b), mn) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.L = pick([500, 800, 1000, 1200, 2000]); D.T = rint(5, 9); D.y = rint(25, 50) / 1000;
    D.T1 = rint(1, D.T - 2); D.T2 = rint(D.T + 2, D.T + 7); D.dy = pick([0.01, 0.015, 0.02]);
    D.B = d19bar(D.L, D.T, D.y, D.T1, D.T2);
    D.Sp = d19surplus(D.B, D.L, D.T, D.y, D.T1, D.T2, D.dy, 0); D.Sm = d19surplus(D.B, D.L, D.T, D.y, D.T1, D.T2, -D.dy, 0);
    D.approx = D.B.PV * (D.B.CA - D.B.CL) / 2 * D.dy * D.dy;
    /* pivotement nuisible */
    D.b = pick([0.001, 0.002, 0.003]) * (rnd() < 0.5 ? 1 : -1);
    D.St = d19surplus(D.B, D.L, D.T, D.y, D.T1, D.T2, 0, D.b);
    if (D.St > -0.05 * D.L / 1000) { D.b = -D.b; D.St = d19surplus(D.B, D.L, D.T, D.y, D.T1, D.T2, 0, D.b); }
    if (D.St > -0.05 * D.L / 1000) continue;
    D.r1 = D.y + D.b * (D.T1 - D.T); D.r2 = D.y + D.b * (D.T2 - D.T);
    if (D.r1 <= 0) continue;
    D.VA1 = D.B.F1 * Math.pow(1 + D.r1, -D.T1); D.VA2 = D.B.F2 * Math.pow(1 + D.r2, -D.T2);
    break;
  }
  return D;
};
const d19p = x => fmtT(100 * x, 2);
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un assureur doit verser ${fmt(D.L, 0)} (en milliers d'euros) dans ${D.T} ans. La courbe des taux est plate, au taux annuel \(y=${d19p(D.y)}\) %. Il dispose de zéro-coupons d'échéances ${D.T1} ans et ${D.T2} ans, mais d'aucun titre d'échéance ${D.T} ans. On travaille en capitalisation annuelle.</div>
<div class="questions"><ol>
<li><div class="q-text">Calculez la valeur actuelle \(V_L\), la duration et la convexité du passif.</div></li>
<li><div class="q-text">Déterminez les montants à investir aujourd'hui dans chaque zéro-coupon pour que l'actif ait la même valeur et la même duration que le passif, puis les valeurs nominales correspondantes.</div></li>
<li><div class="q-text">Calculez la convexité de l'actif et comparez-la à celle du passif. Le taux passe immédiatement à \(y+${d19p(D.dy)}\) %, puis à \(y-${d19p(D.dy)}\) % : calculez le surplus exact dans chaque cas et comparez-le à l'approximation \(V_L\frac{C_A-C_L}{2}(\Delta y)^2\).</div></li>
<li><div class="q-text">La courbe pivote au lieu de se déplacer : le taux de l'échéance \(t\) devient \(y+${D.b > 0 ? '' : '('}${d19p(D.b)}${D.b > 0 ? '' : ')'}\,\% \times (t-${D.T})\). Calculez le surplus. Quelle stratégie aurait évité cette perte, et à quelle condition ?</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">An insurer must pay ${fmt(D.L, 0)} (in thousands of euros) in ${D.T} years. The yield curve is flat, at the annual rate \(y=${d19p(D.y)}\)%. Zero-coupon bonds with maturities ${D.T1} years and ${D.T2} years are available, but no security with maturity ${D.T} years. Annual compounding is used.</div>
<div class="questions"><ol>
<li><div class="q-text">Compute the present value \(V_L\), the duration and the convexity of the liability.</div></li>
<li><div class="q-text">Determine the amounts to invest today in each zero-coupon bond so that the asset has the same value and the same duration as the liability, then the corresponding face values.</div></li>
<li><div class="q-text">Compute the convexity of the asset and compare it with that of the liability. The rate immediately moves to \(y+${d19p(D.dy)}\)%, then to \(y-${d19p(D.dy)}\)%: compute the exact surplus in each case and compare it with the approximation \(V_L\frac{C_A-C_L}{2}(\Delta y)^2\).</div></li>
<li><div class="q-text">The curve rotates instead of shifting: the rate of maturity \(t\) becomes \(y+${D.b > 0 ? '' : '('}${d19p(D.b)}${D.b > 0 ? '' : ')'}\% \times (t-${D.T})\). Compute the surplus. Which strategy would have avoided this loss, and under what condition?</div></li>
</ol></div>`;
};
function d19sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], B = D.B, y = D.y, T = D.T, T1 = D.T1, T2 = D.T2;
  const yy = tex(1 + y, 4);
  const sv = (F, r, t) => String.raw`${tex(F, 2)}\times ${tex(1 + r, 4)}^{-${t}}`;
  const Sp = (sg) => { const r = y + sg * D.dy; return String.raw`${sv(B.F1, r, T1)}+${sv(B.F2, r, T2)}-${sv(D.L, r, T)}`; };
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Le passif est un flux unique, comme un zéro-coupon d\'échéance', 'The liability is a single cash flow, like a zero-coupon bond with maturity'])} ${T} :
  \[\begin{aligned}V_L&amp;=L\,(1+y)^{-T}=${tex(D.L, 0)}\times ${yy}^{-${T}}\approx ${tex(B.PV, 2)}\\D_L&amp;=T=${T}&amp;&amp;\text{${T_(['un seul flux, à la date', 'a single cash flow, at date'])} }T\\C_L&amp;=\frac{T(T+1)}{(1+y)^2}=\frac{${T}\times ${T + 1}}{${yy}^2}\approx ${tex(B.CL, 3)}\end{aligned}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['On note', 'Let'])} \(w_i=a_i/V_L\) ${T_(['les poids des deux zéro-coupons, de durations', 'be the weights of the two zero-coupon bonds, with durations'])} ${T1} ${T_(['et', 'and'])} ${T2}. ${T_(['La duration d\'un portefeuille est la moyenne des durations pondérée par les valeurs ; égaler valeurs et durations donne :', 'The duration of a portfolio is the value-weighted average of the durations; matching values and durations gives:'])}
  \[\left\{\begin{aligned}w_1+w_2&amp;=1\\${T1}\,w_1+${T2}\,w_2&amp;=${T}\end{aligned}\right.\qquad\iff\qquad w_1=\frac{${T2}-${T}}{${T2}-${T1}}\approx ${tex(B.w1, 4)}\qquad w_2=\frac{${T}-${T1}}{${T2}-${T1}}\approx ${tex(B.w2, 4)}\]
  ${T_(['Les montants investis et les valeurs nominales sont :', 'The amounts invested and the face values are:'])}
  \[\begin{aligned}a_1&amp;=w_1V_L\approx ${tex(B.a1, 2)},&amp;\quad F_1&amp;=a_1(1+y)^{${T1}}\approx ${tex(B.F1, 2)}\\a_2&amp;=w_2V_L\approx ${tex(B.a2, 2)},&amp;\quad F_2&amp;=a_2(1+y)^{${T2}}\approx ${tex(B.F2, 2)}\end{aligned}\]</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['La convexité d\'un portefeuille est la moyenne des convexités pondérée par les valeurs :', 'The convexity of a portfolio is the value-weighted average of the convexities:'])}
  \[\begin{aligned}C_A&amp;=\frac{w_1T_1(T_1+1)+w_2T_2(T_2+1)}{(1+y)^2}=\frac{${tex(B.w1, 4)}\times ${T1 * (T1 + 1)}+${tex(B.w2, 4)}\times ${T2 * (T2 + 1)}}{${yy}^2}\approx ${tex(B.CA, 3)}\\C_A-C_L&amp;=\frac{(T_2-T)(T-T_1)}{(1+y)^2}=\frac{${T2 - T}\times ${T - T1}}{${yy}^2}\approx ${tex(B.CA - B.CL, 3)}&gt;0\end{aligned}\]
  ${T_(['L\'actif est plus convexe que le passif : les conditions de Redington sont satisfaites. Surplus exacts, en réévaluant chaque flux au nouveau taux :', 'The asset is more convex than the liability: Redington\'s conditions hold. Exact surpluses, revaluing each cash flow at the new rate:'])}
  \[\begin{aligned}S(y+${d19p(D.dy)}\,\%)&amp;=${Sp(1)}\approx ${tex(D.Sp, 3)}\\S(y-${d19p(D.dy)}\,\%)&amp;=${Sp(-1)}\approx ${tex(D.Sm, 3)}\end{aligned}\]
  ${T_(['Les deux surplus sont positifs. L\'approximation du second ordre donne', 'Both surpluses are positive. The second-order approximation gives'])} \(V_L\frac{C_A-C_L}{2}(\Delta y)^2=${tex(B.PV, 2)}\times\frac{${tex(B.CA - B.CL, 3)}}{2}\times ${tex(D.dy, 3)}^2\approx ${tex(D.approx, 3)}\), ${T_(['proche des valeurs exactes ; l\'écart entre la hausse et la baisse vient des termes d\'ordre 3.', 'close to the exact values; the difference between the rise and the fall comes from third-order terms.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le taux de l\'échéance', 'The rate of maturity'])} ${T} ${T_(['ne change pas, donc la valeur du passif non plus. Les taux des échéances', 'does not change, so neither does the value of the liability. The rates of maturities'])} ${T1} ${T_(['et', 'and'])} ${T2} ${T_(['deviennent', 'become'])} \(r_1=${d19p(D.r1)}\,\%\) ${T_(['et', 'and'])} \(r_2=${d19p(D.r2)}\,\%\) :
  \[\begin{aligned}S&amp;=F_1(1+r_1)^{-${T1}}+F_2(1+r_2)^{-${T2}}-V_L\\&amp;=${sv(B.F1, D.r1, T1)}+${sv(B.F2, D.r2, T2)}-${tex(B.PV, 2)}\\&amp;\approx ${tex(D.VA1, 2)}+${tex(D.VA2, 2)}-${tex(B.PV, 2)}=${tex(D.St, 2)}\end{aligned}\]
  ${T_(['Le surplus est négatif : le pivotement ne change pas le niveau moyen des taux, auquel la duration est sensible, mais il fait bouger en sens contraires les deux jambes du barbell. Le zéro-coupon', 'The surplus is negative: the rotation does not change the average level of rates, to which duration is sensitive, but it moves the two legs of the barbell in opposite directions. The'])} ${D.b > 0 ? T_(['long perd plus que ce que le zéro-coupon court gagne.', 'long zero loses more than the short zero gains.']) : T_(['court perd plus que ce que le zéro-coupon long gagne.', 'short zero loses more than the long zero gains.'])} ${T_(['La dédication, c\'est-à-dire l\'achat d\'un zéro-coupon d\'échéance', 'Dedication, that is, buying a zero-coupon bond with maturity'])} ${T} ${T_(['et de nominal', 'and face value'])} ${fmt(D.L, 0)}, ${T_(['aurait couvert le passif exactement, quelle que soit la déformation de la courbe ; elle suppose qu\'un tel titre existe, ce qui n\'est pas le cas ici.', 'would have covered the liability exactly, whatever the change in the curve; it requires such a security to exist, which is not the case here.'])}</p>
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => d19sol(D, 'fr');
I18N.en.sol = D => d19sol(D, 'en');
