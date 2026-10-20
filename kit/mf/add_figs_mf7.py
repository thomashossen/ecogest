#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/claude/mf')
from add_figs import inject

F = []

# ------------------------------------------------------------ E : sur un petit pas, le bruit domine
F.append(dict(fid='step', anchor_fr='<div class="dossier-title" id="s3">', anchor_en='<div class="dossier-title" id="s3">',
cap_fr="Sur un pas de durée \\(\\dd t\\), la dérive apporte \\(F\\,\\dd t\\) (en doré) et le bruit un écart type \\(G\\sqrt{\\dd t}\\) (en bleu). Réduisez le pas : la dérive décroît comme \\(\\dd t\\), le bruit seulement comme \\(\\sqrt{\\dd t}\\), si bien qu'à l'échelle du pas le bruit l'emporte toujours. C'est pour cela que l'on ne peut pas diviser par \\(\\dd t\\).",
cap_en="Over a step of length \\(\\dd t\\), the drift contributes \\(F\\,\\dd t\\) (gold) and the noise a standard deviation \\(G\\sqrt{\\dd t}\\) (blue). Shrink the step: the drift decreases like \\(\\dd t\\), the noise only like \\(\\sqrt{\\dd t}\\), so that at the scale of the step the noise always dominates. This is why one cannot divide by \\(\\dd t\\).",
code=r"""
Object.assign(I18N.fr.f, { stDt: 'Pas d<i>t</i>', stF: 'Dérive <i>F</i>', stG: 'Diffusion <i>G</i>', stAria: 'Dérive et bruit sur un pas de temps',
  stRead: (dt, F, G) => `Pour d<i>t</i> = ${fmt(dt, 4)} : <i>F</i> d<i>t</i> = <span class="v">${fmt(F * dt, 4)}</span>, <i>G</i> √d<i>t</i> = <span class="v">${fmt(G * Math.sqrt(dt), 4)}</span>, rapport bruit / dérive = <span class="v">${fmt(G * Math.sqrt(dt) / (F * dt), 2)}</span> ; il tend vers l'infini quand d<i>t</i> → 0.` });
Object.assign(I18N.en.f, { stDt: 'Step d<i>t</i>', stF: 'Drift <i>F</i>', stG: 'Diffusion <i>G</i>', stAria: 'Drift and noise over one time step',
  stRead: (dt, F, G) => `For d<i>t</i> = ${fmt(dt, 4)}: <i>F</i> d<i>t</i> = <span class="v">${fmt(F * dt, 4)}</span>, <i>G</i> √d<i>t</i> = <span class="v">${fmt(G * Math.sqrt(dt), 4)}</span>, noise / drift ratio = <span class="v">${fmt(G * Math.sqrt(dt) / (F * dt), 2)}</span>; it tends to infinity as d<i>t</i> → 0.` });
FIGS.step = {
  state: { k: 2, F: 1, G: 1 },
  controls: L => [
    { key: 'k', label: L.f.stDt, min: 0, max: 6, step: 1, fmt: v => fmt(Math.pow(4, -v), 4) },
    { key: 'F', label: L.f.stF, min: 0.2, max: 3, step: 0.2, fmt: v => fmt(v, 1) },
    { key: 'G', label: L.f.stG, min: 0.2, max: 3, step: 0.2, fmt: v => fmt(v, 1) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, F = s.F, G = s.G, dts = [0, 1, 2, 3, 4, 5, 6].map(k => Math.pow(4, -k)), dt = Math.pow(4, -s.k);
    const lg = v => Math.log10(Math.max(v, 1e-4));
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 44, x0: -0.5, x1: 6.5, y0: -4, y1: 0.7 });
    P.axes({ xt: [0, 1, 2, 3, 4, 5, 6], yt: [-4, -3, -2, -1, 0], xf: v => (v === 0 ? 'dt = 1' : '4^-' + v), yf: v => (v === 0 ? '1' : '10^' + v), xl: '' });
    dts.forEach((d, k) => {
      const on = k === s.k, w = 22;
      P.add(`<rect x="${P.X(k) - w - 3}" y="${P.Y(lg(F * d))}" width="${w}" height="${P.Y(-4) - P.Y(lg(F * d))}" fill="${COL.s2}" fill-opacity="${on ? 0.95 : 0.35}"/>`);
      P.add(`<rect x="${P.X(k) + 3}" y="${P.Y(lg(G * Math.sqrt(d)))}" width="${w}" height="${P.Y(-4) - P.Y(lg(G * Math.sqrt(d)))}" fill="${COL.s1}" fill-opacity="${on ? 0.95 : 0.35}"/>`);
    });
    P.line(dts.map((d, k) => [k, lg(F * d)]), { c: COL.s2, w: 1.2, dash: '4 3' });
    P.line(dts.map((d, k) => [k, lg(G * Math.sqrt(d))]), { c: COL.s1, w: 1.2, dash: '4 3' });
    P.legend([{ c: COL.s2, t: 'F dt', box: true }, { c: COL.s1, t: 'G √dt', box: true }], P.ml + 8, 16);
    return { svg: P.svg(L.stAria), read: L.stRead(dt, F, G) };
  }
};
"""))

# ------------------------------------------------------------ A : construction des sommes, Riemann contre Itô
F.append(dict(fid='build', anchor_fr='<div class="ifig" data-fig="ito">', anchor_en='<div class="ifig" data-fig="ito">',
cap_fr="D'où vient l'intégrale d'Itô. À gauche, une intégrale ordinaire \\(\\int_0^1 f(t)\\,\\dd t\\) : chaque rectangle a pour largeur une petite durée \\(\\Delta t\\) et pour hauteur \\(f(t_i)\\). À droite, \\(\\int_0^1 W\\,\\dd W\\) sur une trajectoire : la « largeur » de chaque terme est l'accroissement \\(\\Delta W_i\\), positif ou négatif, et la hauteur \\(W_{t_i}\\), prise au début du pas. Les barres du bas montrent chaque terme \\(W_{t_i}\\,\\Delta W_i\\) ; leur somme est la somme d'Itô.",
cap_en="Where the Itô integral comes from. Left, an ordinary integral \\(\\int_0^1 f(t)\\,\\dd t\\): each rectangle has a small duration \\(\\Delta t\\) as width and \\(f(t_i)\\) as height. Right, \\(\\int_0^1 W\\,\\dd W\\) along one path: the “width” of each term is the increment \\(\\Delta W_i\\), positive or negative, and the height is \\(W_{t_i}\\), taken at the start of the step. The bottom bars show each term \\(W_{t_i}\\,\\Delta W_i\\); their sum is the Itô sum.",
code=r"""
Object.assign(I18N.fr.f, { bdN: 'Nombre de pas <i>n</i>', bdSeed: 'Nouvelle trajectoire', bdAria: 'Construction d\u2019une somme de Riemann et d\u2019une somme d\u2019Itô',
  bdRead: (n, sr, exact, si, lim) => `Avec <i>n</i> = ${n} : somme de Riemann <span class="v">${fmt(sr, 4)}</span> (intégrale exacte ${fmt(exact, 4)}) ; somme d'Itô ∑ <i>W</i><sub>t<sub>i</sub></sub> Δ<i>W</i><sub>i</sub> = <span class="v">${fmt(si, 4)}</span>, à comparer à la limite (<i>W</i><sub>1</sub>² − 1)/2 = ${fmt(lim, 4)}.` });
Object.assign(I18N.en.f, { bdN: 'Number of steps <i>n</i>', bdSeed: 'New path', bdAria: 'Building a Riemann sum and an Itô sum',
  bdRead: (n, sr, exact, si, lim) => `With <i>n</i> = ${n}: Riemann sum <span class="v">${fmt(sr, 4)}</span> (exact integral ${fmt(exact, 4)}); Itô sum ∑ <i>W</i><sub>t<sub>i</sub></sub> Δ<i>W</i><sub>i</sub> = <span class="v">${fmt(si, 4)}</span>, to be compared with the limit (<i>W</i><sub>1</sub>² − 1)/2 = ${fmt(lim, 4)}.` });
FIGS.build = {
  state: { n: 8, seed: 1 },
  controls: L => [
    { key: 'n', type: 'select', numeric: true, label: L.f.bdN, options: [4, 8, 16, 32, 64].map(v => ({ v: v, t: 'n = ' + v })) },
    { key: 'seed', type: 'button', label: L.f.bdSeed, act: s => { s.seed++; } }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = s.n, NF = 1024, k = NF / n, rand = localRand(911 + 7919 * s.seed), sq = Math.sqrt(1 / NF);
    const f = t => 1 + Math.sin(3 * t) * 0.6, exact = 1 + (1 - Math.cos(3)) * 0.2;
    const W = [0]; for (let j = 1; j <= NF; j++) W.push(W[j - 1] + sq * gauss(rand));
    const Wn = []; for (let i = 0; i <= n; i++) Wn.push(W[i * k]);
    let sr = 0, si = 0; const terms = [];
    for (let i = 0; i < n; i++) { sr += f(i / n) / n; const d = Wn[i + 1] - Wn[i]; terms.push(Wn[i] * d); si += Wn[i] * d; }
    const Wt = 320, H = 360, G = 30;
    /* --- panneau gauche : Riemann --- */
    const P1 = Plot({ w: Wt, h: 220, mt: 26, mb: 36, ml: 40, mr: 12, x0: 0, x1: 1, y0: 0, y1: 1.8 });
    P1.axes({ xt: [0, 0.5, 1], yt: [0, 0.5, 1, 1.5], xf: v => fmt(v, 1), yf: v => fmt(v, 1), xl: 't' });
    for (let i = 0; i < n; i++) P1.add(`<rect x="${P1.X(i / n)}" y="${P1.Y(f(i / n))}" width="${Math.max(0.5, P1.X((i + 1) / n) - P1.X(i / n) - 0.5)}" height="${P1.Y(0) - P1.Y(f(i / n))}" fill="${COL.s2}" fill-opacity="0.35" stroke="${COL.s2}" stroke-width="0.8"/>`);
    P1.curve(f, 0, 1, { c: COL.s2, w: 2 }, 120);
    P1.add(`<text x="${Wt / 2}" y="16" text-anchor="middle" ${FONT_T} font-size="11.5" font-weight="700" fill="${COL.ink}">∑ f(tᵢ) Δt</text>`);
    [[lang === 'fr' ? 'largeur : Δt = 1/n, toujours positive' : 'width: Δt = 1/n, always positive', 262], [lang === 'fr' ? 'hauteur : f(tᵢ), début du pas' : 'height: f(tᵢ), start of step', 280], [lang === 'fr' ? 'à droite : largeur ΔWᵢ signée,' : 'right: signed width ΔWᵢ,', 310], [lang === 'fr' ? 'hauteur W(tᵢ), début du pas' : 'height W(tᵢ), start of step', 328]].forEach(x => P1.add(`<text x="${Wt / 2}" y="${x[1]}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.mute}">${x[0]}</text>`));
    /* --- panneau droit : trajectoire et accroissements --- */
    let mn = Math.min.apply(null, W), mx = Math.max.apply(null, W); const pad = 0.15 * (mx - mn + 0.2);
    const P2 = Plot({ w: Wt, h: 220, mt: 26, mb: 36, ml: 40, mr: 12, x0: 0, x1: 1, y0: mn - pad, y1: mx + pad });
    const yt = ticks(mn - pad, mx + pad, 4);
    P2.axes({ xt: [0, 0.5, 1], yt: yt, xf: v => fmt(v, 1), yf: v => fmt(v, 1), xl: 't', xAxisAt: 0 });
    const path = []; for (let j = 0; j <= NF; j += 2) path.push([j / NF, W[j]]);
    P2.line(path, { c: GREY, w: 1 });
    for (let i = 0; i < n; i++) {
      const up = Wn[i + 1] >= Wn[i];
      P2.add(`<rect x="${P2.X(i / n)}" y="${P2.Y(Math.max(Wn[i], Wn[i + 1]))}" width="${Math.max(0.5, P2.X((i + 1) / n) - P2.X(i / n) - 0.5)}" height="${Math.abs(P2.Y(Wn[i]) - P2.Y(Wn[i + 1]))}" fill="${up ? COL.s1 : COL.s3}" fill-opacity="0.25"/>`);
      P2.seg(i / n, Wn[i], (i + 1) / n, Wn[i], { c: COL.s1, w: 1.6 });
    }
    Wn.forEach((w, i) => { if (i < n) P2.dot(i / n, w, { c: COL.s1, r: n <= 16 ? 3 : 1.8 }); });
    P2.add(`<text x="${Wt / 2}" y="16" text-anchor="middle" ${FONT_T} font-size="11.5" font-weight="700" fill="${COL.ink}">W(tᵢ) et ΔWᵢ</text>`);
    /* --- bas : termes W(ti) ΔWi --- */
    const tm = Math.max.apply(null, terms.map(Math.abs)) || 1;
    const P3 = Plot({ w: Wt, h: 120, mt: 14, mb: 24, ml: 40, mr: 12, x0: 0, x1: 1, y0: -tm, y1: tm });
    P3.axes({ xt: [0, 0.5, 1], yt: [-tm, 0, tm], xf: v => fmt(v, 1), yf: v => fmt(v, 2), xAxisAt: 0 });
    terms.forEach((v, i) => P3.bar((i + 0.5) / n, Math.max(1, (P3.X(1) - P3.X(0)) / n - 1), v, { c: v >= 0 ? COL.s1 : COL.s3, o: 0.8 }));
    P3.add(`<text x="${Wt / 2}" y="10" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.mute}">${lang === 'fr' ? 'termes' : 'terms'} W(tᵢ) ΔWᵢ</text>`);
    const svg = `<svg viewBox="0 0 ${2 * Wt + G} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(L.bdAria)}"><g>${P1.el.join('')}</g><g transform="translate(${Wt + G},0)">${P2.el.join('')}</g><g transform="translate(${Wt + G},${220})">${P3.el.join('')}</g></svg>`;
    return { svg: svg, read: L.bdRead(n, sr, exact, si, (Wn[n] * Wn[n] - 1) / 2) };
  }
};
"""))

# ------------------------------------------------------------ B : convergence des trois sommes
F.append(dict(fid='conv', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="Les trois sommes selon le point d'évaluation, sur une même trajectoire fine, quand le nombre de pas augmente. Avec \\(W\\) pris au début du pas (Itô), la somme tend vers \\(\\frac{W_1^2-1}{2}\\) ; au milieu (Stratonovich), vers \\(\\frac{W_1^2}{2}\\) ; à la fin, vers \\(\\frac{W_1^2+1}{2}\\). L'écart entre les limites extrêmes est exactement la variation quadratique \\(T=1\\) : il ne disparaît pas quand le pas tend vers 0, alors qu'il disparaîtrait pour une fonction dérivable.",
cap_en="The three sums according to the evaluation point, along one fine path, as the number of steps grows. With \\(W\\) taken at the start of the step (Itô), the sum tends to \\(\\frac{W_1^2-1}{2}\\); at the midpoint (Stratonovich), to \\(\\frac{W_1^2}{2}\\); at the end, to \\(\\frac{W_1^2+1}{2}\\). The gap between the extreme limits is exactly the quadratic variation \\(T=1\\): it does not vanish as the step tends to 0, whereas it would for a differentiable function.",
code=r"""
Object.assign(I18N.fr.f, { cvSeed: 'Nouvelle trajectoire', cvAria: 'Convergence des sommes selon le point d\u2019évaluation',
  cvRead: (w, l, m, r) => `Pour <i>n</i> = 4096 : début <span class="v">${fmt(l, 4)}</span>, milieu <span class="v">${fmt(m, 4)}</span>, fin <span class="v">${fmt(r, 4)}</span> ; limites théoriques ${fmt((w * w - 1) / 2, 4)}, ${fmt(w * w / 2, 4)} et ${fmt((w * w + 1) / 2, 4)}. Fin − début = <span class="v">${fmt(r - l, 4)}</span> ≈ 1.` });
Object.assign(I18N.en.f, { cvSeed: 'New path', cvAria: 'Convergence of the sums according to the evaluation point',
  cvRead: (w, l, m, r) => `For <i>n</i> = 4096: start <span class="v">${fmt(l, 4)}</span>, midpoint <span class="v">${fmt(m, 4)}</span>, end <span class="v">${fmt(r, 4)}</span>; theoretical limits ${fmt((w * w - 1) / 2, 4)}, ${fmt(w * w / 2, 4)} and ${fmt((w * w + 1) / 2, 4)}. End − start = <span class="v">${fmt(r - l, 4)}</span> ≈ 1.` });
FIGS.conv = {
  state: { seed: 1 },
  controls: L => [{ key: 'seed', type: 'button', label: L.f.cvSeed, act: s => { s.seed++; } }],
  draw: function (s, lang) {
    const L = I18N[lang].f, NF = 4096, rand = localRand(4242 + 7919 * s.seed), sq = Math.sqrt(1 / NF);
    const W = [0]; for (let j = 1; j <= NF; j++) W.push(W[j - 1] + sq * gauss(rand));
    const ns = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096], pl = [], pm = [], pr = []; let l = 0, m = 0, r = 0;
    ns.forEach(n => { const k = NF / n; l = 0; m = 0; r = 0; for (let i = 0; i < n; i++) { const a = W[i * k], b = W[(i + 1) * k], mid = (a + b) / 2, d = b - a; l += a * d; m += mid * d; r += b * d; } pl.push([Math.log2(n), l]); pm.push([Math.log2(n), m]); pr.push([Math.log2(n), r]); });
    const w1 = W[NF], lims = [(w1 * w1 - 1) / 2, w1 * w1 / 2, (w1 * w1 + 1) / 2];
    let mn = Math.min(lims[0], ...pl.map(p => p[1]), ...pr.map(p => p[1])), mx = Math.max(lims[2], ...pl.map(p => p[1]), ...pr.map(p => p[1]));
    const pad = 0.1 * (mx - mn + 0.5), tk = ticks(mn - pad, mx + pad, 5);
    const P = Plot({ w: 680, h: 330, mt: 40, mb: 42, x0: 1.5, x1: 12.5, y0: tk[0], y1: tk[tk.length - 1] });
    P.axes({ xt: ns.map(n => Math.log2(n)), yt: tk, xf: v => String(Math.pow(2, v)), yf: v => fmt(v, 2), xl: lang === 'fr' ? 'nombre de pas n' : 'number of steps n' });
    [[lims[0], COL.s1], [lims[1], COL.s4], [lims[2], COL.s2]].forEach(x => P.seg(1.5, x[0], 12.5, x[0], { c: x[1], w: 1.2, dash: '5 4' }));
    P.line(pr, { c: COL.s2, w: 2 }); P.line(pm, { c: COL.s4, w: 2 }); P.line(pl, { c: COL.s1, w: 2 });
    pr.forEach(p => P.dot(p[0], p[1], { c: COL.s2, r: 3 })); pm.forEach(p => P.dot(p[0], p[1], { c: COL.s4, r: 3 })); pl.forEach(p => P.dot(p[0], p[1], { c: COL.s1, r: 3 }));
    P.add(`<line x1="${P.X(12.3)}" y1="${P.Y(lims[0])}" x2="${P.X(12.3)}" y2="${P.Y(lims[2])}" stroke="${COL.ink}" stroke-width="1.4"/><rect x="${P.X(12.3) - 34}" y="${(P.Y(lims[0]) + P.Y(lims[2])) / 2 - 16}" width="30" height="14" fill="#fff" fill-opacity="0.85"/><text x="${P.X(12.3) - 6}" y="${(P.Y(lims[0]) + P.Y(lims[2])) / 2 - 5}" text-anchor="end" ${FONT_M} font-size="10.5" font-weight="700" fill="${COL.ink}">T = 1</text>`);
    P.legend([{ c: COL.s1, t: lang === 'fr' ? 'début (Itô)' : 'start (Itô)' }, { c: COL.s4, t: lang === 'fr' ? 'milieu (Stratonovich)' : 'midpoint (Stratonovich)' }, { c: COL.s2, t: lang === 'fr' ? 'fin' : 'end' }], P.ml + 8, 16);
    return { svg: P.svg(L.cvAria), read: L.cvRead(w1, l, m, r) };
  }
};
"""))

# ------------------------------------------------------------ C : variation quadratique
F.append(dict(fid='qv', anchor_fr='<div class="dossier-title" id="s5">', anchor_en='<div class="dossier-title" id="s5">',
cap_fr="Pourquoi le terme \\(\\frac12 u''\\,G^2\\,\\dd t\\) apparaît. Sur une même trajectoire, on découpe \\([0,1]\\) en \\(n\\) pas et l'on cumule \\(\\sum(\\Delta W_i)^2\\) (en bleu) : la somme tend vers \\(t\\), quel que soit \\(n\\). Pour une fonction dérivable (en doré, \\(x(t)=\\sin 3t\\)), la même somme \\(\\sum(\\Delta x_i)^2\\) s'écrase vers 0 quand le pas diminue. C'est parce que \\((\\dd W)^2\\) « vaut » \\(\\dd t\\) que le développement de Taylor doit garder le terme du second ordre.",
cap_en="Why the term \\(\\frac12 u''\\,G^2\\,\\dd t\\) appears. On one path, \\([0,1]\\) is split into \\(n\\) steps and \\(\\sum(\\Delta W_i)^2\\) is accumulated (blue): the sum tends to \\(t\\), whatever \\(n\\). For a differentiable function (gold, \\(x(t)=\\sin 3t\\)), the same sum \\(\\sum(\\Delta x_i)^2\\) collapses to 0 as the step shrinks. Because \\((\\dd W)^2\\) “equals” \\(\\dd t\\), the Taylor expansion must keep the second-order term.",
code=r"""
Object.assign(I18N.fr.f, { qvN: 'Nombre de pas <i>n</i>', qvSeed: 'Nouvelle trajectoire', qvAria: 'Variation quadratique du mouvement brownien et d\u2019une fonction dérivable',
  qvRead: (n, q, qx) => `Avec <i>n</i> = ${n} : ∑(Δ<i>W</i><sub>i</sub>)² = <span class="v">${fmt(q, 4)}</span> (limite 1), ∑(Δ<i>x</i><sub>i</sub>)² = <span class="v">${fmt(qx, 5)}</span> (limite 0, de l'ordre de 1/<i>n</i>).` });
Object.assign(I18N.en.f, { qvN: 'Number of steps <i>n</i>', qvSeed: 'New path', qvAria: 'Quadratic variation of Brownian motion and of a differentiable function',
  qvRead: (n, q, qx) => `With <i>n</i> = ${n}: ∑(Δ<i>W</i><sub>i</sub>)² = <span class="v">${fmt(q, 4)}</span> (limit 1), ∑(Δ<i>x</i><sub>i</sub>)² = <span class="v">${fmt(qx, 5)}</span> (limit 0, of order 1/<i>n</i>).` });
FIGS.qv = {
  state: { n: 128, seed: 1 },
  controls: L => [
    { key: 'n', type: 'select', numeric: true, label: L.f.qvN, options: [8, 32, 128, 512, 2048].map(v => ({ v: v, t: 'n = ' + v })) },
    { key: 'seed', type: 'button', label: L.f.qvSeed, act: s => { s.seed++; } }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = s.n, NF = 2048, k = NF / n, rand = localRand(77 + 7919 * s.seed), sq = Math.sqrt(1 / NF);
    const W = [0]; for (let j = 1; j <= NF; j++) W.push(W[j - 1] + sq * gauss(rand));
    const x = t => Math.sin(3 * t);
    let q = 0, qx = 0; const pq = [[0, 0]], px = [[0, 0]];
    for (let i = 0; i < n; i++) { const d = W[(i + 1) * k] - W[i * k], dx = x((i + 1) / n) - x(i / n); q += d * d; qx += dx * dx; pq.push([(i + 1) / n, q]); px.push([(i + 1) / n, qx]); }
    const top = Math.max(1.2, q * 1.1, qx * 1.1);
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 42, x0: 0, x1: 1, y0: 0, y1: top });
    P.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: ticks(0, top, 5), xf: v => fmt(v, 2), yf: v => fmt(v, 2), xl: 't' });
    P.line([[0, 0], [1, 1]], { c: GREY, w: 1.2, dash: '5 4' });
    P.line(pq, { c: COL.s1, w: 2 }); P.line(px, { c: COL.s2, w: 2 });
    P.legend([{ c: COL.s1, t: '∑ (ΔW)²' }, { c: COL.s2, t: '∑ (Δx)², x = sin 3t' }, { c: GREY, dash: '5 4', t: lang === 'fr' ? 'droite t' : 'line t' }], P.ml + 8, 16);
    return { svg: P.svg(L.qvAria), read: L.qvRead(n, q, qx) };
  }
};
"""))

if __name__ == '__main__':
    for Fi in F:
        inject(7, Fi['fid'], Fi['code'], Fi['cap_fr'], Fi['cap_en'], Fi['anchor_fr'], Fi['anchor_en'])
