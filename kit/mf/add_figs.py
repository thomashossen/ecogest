#!/usr/bin/env python3
"""Ajoute des figures interactives aux pages mf (code + légendes FR/EN), avec renumérotation des figures."""
import re, json, sys
SITE = '/home/claude/site'

def enc(h): return json.dumps(h, ensure_ascii=False)[1:-1].replace('/', '\\/')

def renumber(course):
    """Renumérote « Figure k » (légendes) et les renvois « figure k » dans l'ordre d'apparition des légendes."""
    caps = list(re.finditer(r'<div class=\\"fig-cap\\">Figure (\d+) —', course))
    mapping = {int(m.group(1)): i + 1 for i, m in enumerate(caps)}
    # la nouvelle figure porte le numéro 0 : elle n'a pas de renvoi ailleurs
    def rep(m):
        k = int(m.group(2)); return m.group(1) + str(mapping.get(k, k))
    return re.sub(r'([Ff]igure )(\d+)', rep, course)

def inject(n, fid, code, cap_fr, cap_en, anchor_fr, anchor_en):
    f = f'{SITE}/mf{n}.html'
    d = open(f, encoding='utf-8').read()
    assert d.count('\ninitPage();\n') == 1, 'initPage'
    assert f'FIGS.{fid} =' not in d, 'déjà injectée'
    d = d.replace('\ninitPage();\n', '\n' + code + '\ninitPage();\n')
    for lang, cap, anchor in (('fr', cap_fr, anchor_fr), ('en', cap_en, anchor_en)):
        m = re.search(r'(I18N\.' + lang + r'\.course = ")(.*?)(";\n)', d, re.S)
        course = m.group(2)
        a = enc(anchor)
        assert course.count(a) == 1, (n, lang, anchor, course.count(a))
        block = enc(f'<div class="ifig" data-fig="{fid}"></div>\n<div class="fig-cap">Figure 0 — {cap}</div>\n')
        course = course.replace(a, block + a)
        course = renumber(course)
        d = d[:m.start(2)] + course + d[m.end(2):]
    open(f, 'w', encoding='utf-8').write(d)
    print(f'mf{n}: figure {fid} ajoutée')

FIGS = {}

# ---------------------------------------------------------------- mf2 : standardisation
FIGS[2] = dict(fid='std', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="Standardiser pour lire la table. En haut, la loi \\(N(\\mu,\\sigma^2)\\) et l'aire à gauche du seuil \\(x\\) ; en bas, la loi centrée réduite et l'aire à gauche de \\(z=\\frac{x-\\mu}{\\sigma}\\). Les deux aires sont égales : \\(\\PP(X\\le x)=\\Phi(z)\\). Déplacez \\(x\\), \\(\\mu\\) et \\(\\sigma\\).",
cap_en="Standardising to read the table. Top: the \\(N(\\mu,\\sigma^2)\\) distribution and the area to the left of the threshold \\(x\\); bottom: the standard normal and the area to the left of \\(z=\\frac{x-\\mu}{\\sigma}\\). The two areas are equal: \\(\\PP(X\\le x)=\\Phi(z)\\). Move \\(x\\), \\(\\mu\\) and \\(\\sigma\\).",
code=r"""
Object.assign(I18N.fr.f, { sx: 'Seuil <i>x</i>', smu: 'Espérance μ', ssg: 'Écart type σ', stdAria: 'Standardisation d\u2019une loi normale',
  stdRead: (x, mu, sg, z) => `<i>z</i> = (${fmtT(x, 1)} − ${fmtT(mu, 1)}) / ${fmtT(sg, 1)} = <span class="v">${fmtT(z, 3)}</span>, donc <i>P</i>(<i>X</i> ≤ ${fmtT(x, 1)}) = Φ(${fmtT(z, 3)}) = <span class="v">${fmtT(normCdf(z), 4)}</span>.` });
Object.assign(I18N.en.f, { sx: 'Threshold <i>x</i>', smu: 'Mean μ', ssg: 'Std. dev. σ', stdAria: 'Standardising a normal distribution',
  stdRead: (x, mu, sg, z) => `<i>z</i> = (${fmtT(x, 1)} − ${fmtT(mu, 1)}) / ${fmtT(sg, 1)} = <span class="v">${fmtT(z, 3)}</span>, so <i>P</i>(<i>X</i> ≤ ${fmtT(x, 1)}) = Φ(${fmtT(z, 3)}) = <span class="v">${fmtT(normCdf(z), 4)}</span>.` });
FIGS.std = {
  state: { x: -10, mu: 6, sg: 15 },
  controls: L => [
    { key: 'x', label: L.f.sx, min: -40, max: 50, step: 1, fmt: v => fmtT(v, 0) },
    { key: 'mu', label: L.f.smu, min: -10, max: 20, step: 1, fmt: v => fmtT(v, 0) },
    { key: 'sg', label: L.f.ssg, min: 3, max: 30, step: 1, fmt: v => fmtT(v, 0) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, x = s.x, mu = s.mu, sg = s.sg, z = (x - mu) / sg;
    const f = v => Math.exp(-0.5 * ((v - mu) / sg) ** 2) / (sg * 2.5066282746310002);
    const P1 = Plot({ w: 680, h: 400, mt: 14, mb: 230, x0: -50, x1: 60, y0: 0, y1: 0.14 });
    const P2 = Plot({ w: 680, h: 400, mt: 214, mb: 30, x0: -4, x1: 4, y0: 0, y1: 0.45 });
    P1.axes({ xt: [-40, -20, 0, 20, 40, 60], yt: [], xf: v => String(v), yAxis: false });
    P2.axes({ xt: [-4, -3, -2, -1, 0, 1, 2, 3, 4], yt: [], xf: v => String(v), yAxis: false });
    P1.area(P1.sample(f, -50, Math.min(60, Math.max(-50, x)), 160), 0, { c: COL.s2, o: 0.35 });
    P1.curve(f, -50, 60, { c: COL.s1, w: 2 }, 220);
    P1.seg(x, 0, x, 0.14, { c: COL.s3, w: 1.6, dash: '5 4' });
    P1.text(x, 0.14, 'x = ' + fmtT(x, 0), { dy: 10, dx: 6, anchor: 'start', size: 11, italic: true });
    P1.text(-48, 0.13, 'N(' + fmtT(mu, 0) + ', ' + fmtT(sg, 0) + '²)', { anchor: 'start', size: 11.5, c: COL.mute });
    P2.area(P2.sample(normPdf, -4, Math.min(4, Math.max(-4, z)), 160), 0, { c: COL.s2, o: 0.35 });
    P2.curve(normPdf, -4, 4, { c: COL.s1, w: 2 }, 220);
    P2.seg(z, 0, z, 0.45, { c: COL.s3, w: 1.6, dash: '5 4' });
    P2.text(z, 0.45, 'z = ' + fmtT(z, 2), { dy: 10, dx: 6, anchor: 'start', size: 11, italic: true });
    P2.text(-3.9, 0.42, 'N(0, 1)', { anchor: 'start', size: 11.5, c: COL.mute });
    const svg = `<svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(L.stdAria)}">${P1.el.join('')}${P2.el.join('')}</svg>`;
    return { svg: svg, read: L.stdRead(x, mu, sg, z) };
  }
};
""")

# ---------------------------------------------------------------- mf3 : rendement simple et logarithmique
FIGS[3] = dict(fid='logret', anchor_fr='<div class="dossier-title" id="s2">', anchor_en='<div class="dossier-title" id="s2">',
cap_fr="Rendement simple \\(r\\) et rendement logarithmique \\(\\ln(1+r)\\). Les deux courbes se confondent près de 0 : pour un rendement de quelques pourcents, \\(\\ln(1+r)\\approx r\\). L'écart, toujours du même signe, vaut environ \\(\\frac{r^2}{2}\\) ; déplacez \\(r\\) pour le lire.",
cap_en="Simple return \\(r\\) and log return \\(\\ln(1+r)\\). The two curves coincide near 0: for a return of a few percent, \\(\\ln(1+r)\\approx r\\). The gap, always of the same sign, is about \\(\\frac{r^2}{2}\\); move \\(r\\) to read it.",
code=r"""
Object.assign(I18N.fr.f, { lr: 'Rendement <i>r</i>', logAria: 'Rendement simple et rendement logarithmique',
  logRead: r => `Pour <i>r</i> = ${fmtT(100 * r, 0)} % : ln(1 + <i>r</i>) = <span class="v">${fmtT(100 * Math.log(1 + r), 2)} %</span>, écart <i>r</i> − ln(1 + <i>r</i>) = <span class="v">${fmtT(100 * (r - Math.log(1 + r)), 2)} %</span>, à comparer à <i>r</i>²/2 = ${fmtT(100 * r * r / 2, 2)} %.` });
Object.assign(I18N.en.f, { lr: 'Return <i>r</i>', logAria: 'Simple return and log return',
  logRead: r => `For <i>r</i> = ${fmtT(100 * r, 0)}%: ln(1 + <i>r</i>) = <span class="v">${fmtT(100 * Math.log(1 + r), 2)}%</span>, gap <i>r</i> − ln(1 + <i>r</i>) = <span class="v">${fmtT(100 * (r - Math.log(1 + r)), 2)}%</span>, to be compared with <i>r</i>²/2 = ${fmtT(100 * r * r / 2, 2)}%.` });
FIGS.logret = {
  state: { r: 0.2 },
  controls: L => [{ key: 'r', label: L.f.lr, min: -0.5, max: 0.8, step: 0.05, fmt: v => fmtT(100 * v, 0) + ' %' }],
  draw: function (s, lang) {
    const L = I18N[lang].f, r = Math.round(s.r * 100) / 100;
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 40, x0: -0.6, x1: 0.9, y0: -0.9, y1: 0.9 });
    P.axes({ xt: [-0.5, -0.25, 0, 0.25, 0.5, 0.75], yt: [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75], xf: v => fmtT(100 * v, 0) + '%', yf: v => fmtT(100 * v, 0) + '%', xAxisAt: 0 });
    P.clip();
    P.curve(v => v, -0.6, 0.9, { c: COL.s2, w: 2, clip: true });
    P.curve(v => Math.log(1 + v), -0.58, 0.9, { c: COL.s1, w: 2.2, clip: true }, 240);
    P.seg(r, r, r, Math.log(1 + r), { c: COL.s3, w: 2 });
    P.dot(r, r, { c: COL.s2 }); P.dot(r, Math.log(1 + r), { c: COL.s1 });
    P.legend([{ c: COL.s2, t: 'r' }, { c: COL.s1, t: 'ln(1 + r)' }, { c: COL.s3, t: lang === 'fr' ? 'écart' : 'gap' }], P.ml + 6, P.mt + 14);
    return { svg: P.svg(L.logAria), read: L.logRead(r) };
  }
};
""")

# ---------------------------------------------------------------- mf4 : retour à la moyenne
FIGS[4] = dict(fid='revert', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="Retour à la moyenne : \\(y(t)=\\theta+(y_0-\\theta)\\,e^{-\\kappa t}\\). Faites varier la vitesse \\(\\kappa\\), le niveau \\(\\theta\\) et le point de départ \\(y_0\\) : l'écart à \\(\\theta\\) est divisé par deux à chaque demi-vie \\(\\frac{\\ln 2}{\\kappa}\\) (traits verticaux), sans jamais traverser \\(\\theta\\).",
cap_en="Mean reversion: \\(y(t)=\\theta+(y_0-\\theta)\\,e^{-\\kappa t}\\). Vary the speed \\(\\kappa\\), the level \\(\\theta\\) and the starting point \\(y_0\\): the gap to \\(\\theta\\) is halved at every half-life \\(\\frac{\\ln 2}{\\kappa}\\) (vertical lines), without ever crossing \\(\\theta\\).",
code=r"""
Object.assign(I18N.fr.f, { rk: 'Vitesse κ', rth: 'Niveau θ', ry0: 'Départ <i>y</i><sub>0</sub>', revAria: 'Solution de l\u2019équation de retour à la moyenne',
  revRead: (k, th, y0, hl) => `Demi-vie ln 2 / κ = <span class="v">${fmtT(hl, 2)}</span> ; après une demi-vie, <i>y</i> = ${fmtT(th, 1)} + (${fmtT(y0, 1)} − ${fmtT(th, 1)}) / 2 = <span class="v">${fmtT(th + (y0 - th) / 2, 2)}</span> ; après deux, <span class="v">${fmtT(th + (y0 - th) / 4, 2)}</span>.` });
Object.assign(I18N.en.f, { rk: 'Speed κ', rth: 'Level θ', ry0: 'Start <i>y</i><sub>0</sub>', revAria: 'Solution of the mean-reversion equation',
  revRead: (k, th, y0, hl) => `Half-life ln 2 / κ = <span class="v">${fmtT(hl, 2)}</span>; after one half-life, <i>y</i> = ${fmtT(th, 1)} + (${fmtT(y0, 1)} − ${fmtT(th, 1)}) / 2 = <span class="v">${fmtT(th + (y0 - th) / 2, 2)}</span>; after two, <span class="v">${fmtT(th + (y0 - th) / 4, 2)}</span>.` });
FIGS.revert = {
  state: { k: 0.5, th: 3, y0: 5 },
  controls: L => [
    { key: 'k', label: L.f.rk, min: 0.1, max: 2, step: 0.1, fmt: v => fmtT(v, 1) },
    { key: 'th', label: L.f.rth, min: 0, max: 8, step: 0.5, fmt: v => fmtT(v, 1) },
    { key: 'y0', label: L.f.ry0, min: 0, max: 8, step: 0.5, fmt: v => fmtT(v, 1) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, k = s.k, th = s.th, y0 = s.y0, hl = Math.LN2 / k, T = 10;
    const y = t => th + (y0 - th) * Math.exp(-k * t);
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 40, x0: 0, x1: T, y0: 0, y1: 8.5 });
    P.axes({ xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8], xf: v => String(v), yf: v => String(v), xl: 't', yl: 'y(t)' });
    P.seg(0, th, T, th, { c: COL.s2, w: 1.6, dash: '6 4' });
    P.text(T, th, 'θ', { dx: -6, dy: -5, anchor: 'end', italic: true, c: COL.s2 });
    for (let m = 1; m <= 4 && m * hl < T; m++) { P.seg(m * hl, 0, m * hl, y(m * hl), { c: COL.s3, w: 1, dash: '3 3' }); P.dot(m * hl, y(m * hl), { c: COL.s3, r: 3.5 }); }
    P.curve(y, 0, T, { c: COL.s1, w: 2.4 }, 200);
    P.dot(0, y0, { c: COL.s1 });
    P.text(0, y0, 'y₀', { dx: 8, dy: -6, anchor: 'start', italic: true });
    return { svg: P.svg(L.revAria), read: L.revRead(k, th, y0, hl) };
  }
};
""")

# ---------------------------------------------------------------- mf5 : positions longue et courte
FIGS[5] = dict(fid='longshort', anchor_fr='<div class="dossier-title" id="s2">', anchor_en='<div class="dossier-title" id="s2">',
cap_fr="Résultat d'une position longue (en bleu) et d'une position courte (en doré) prises à 100, en fonction du cours final \\(S(T)\\). Les deux droites sont symétriques : ce que gagne l'un, l'autre le perd. La perte de l'acheteur est bornée par sa mise ; celle du vendeur à découvert ne l'est pas.",
cap_en="Profit of a long position (blue) and of a short position (gold) entered at 100, as a function of the final price \\(S(T)\\). The two lines are mirror images: what one gains, the other loses. The buyer's loss is bounded by the amount invested; the short seller's loss is not.",
code=r"""
Object.assign(I18N.fr.f, { lsS: 'Cours final <i>S</i>(<i>T</i>)', lsAria: 'Résultat des positions longue et courte',
  lsRead: S => `Pour <i>S</i>(<i>T</i>) = ${fmtT(S, 0)} : position longue <span class="v">${fmtT(S - 100, 0)}</span>, position courte <span class="v">${fmtT(100 - S, 0)}</span>.` });
Object.assign(I18N.en.f, { lsS: 'Final price <i>S</i>(<i>T</i>)', lsAria: 'Profit of long and short positions',
  lsRead: S => `For <i>S</i>(<i>T</i>) = ${fmtT(S, 0)}: long position <span class="v">${fmtT(S - 100, 0)}</span>, short position <span class="v">${fmtT(100 - S, 0)}</span>.` });
FIGS.longshort = {
  state: { S: 120 },
  controls: L => [{ key: 'S', label: L.f.lsS, min: 0, max: 200, step: 5, fmt: v => fmtT(v, 0) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, S = s.S;
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 40, x0: 0, x1: 200, y0: -110, y1: 110 });
    P.axes({ xt: [0, 50, 100, 150, 200], yt: [-100, -50, 0, 50, 100], xf: v => String(v), yf: v => String(v), xAxisAt: 0, xl: 'S(T)' });
    P.line([[0, -100], [200, 100]], { c: COL.s1, w: 2.4 });
    P.line([[0, 100], [200, -100]], { c: COL.s2, w: 2.4 });
    P.seg(S, -110, S, 110, { c: COL.s3, w: 1.2, dash: '4 3' });
    P.dot(S, S - 100, { c: COL.s1 }); P.dot(S, 100 - S, { c: COL.s2 });
    P.legend([{ c: COL.s1, t: lang === 'fr' ? 'longue : S(T) − 100' : 'long: S(T) − 100' }, { c: COL.s2, t: lang === 'fr' ? 'courte : 100 − S(T)' : 'short: 100 − S(T)' }], P.ml + 6, P.mt + 14);
    return { svg: P.svg(L.lsAria), read: L.lsRead(S) };
  }
};
""")

# ---------------------------------------------------------------- mf8 : espérance et médiane
FIGS[8] = dict(fid='medmean', anchor_fr='<div class="dossier-title" id="s5">', anchor_en='<div class="dossier-title" id="s5">',
cap_fr="Espérance \\(S_0e^{\\mu t}\\) (en doré) et médiane \\(S_0e^{(\\mu-\\sigma^2/2)t}\\) (en bleu) d'un cours parti de 100 ; la zone colorée contient 80 % des trajectoires à chaque date. Augmentez \\(\\sigma\\) : l'espérance ne bouge pas, mais la médiane s'affaisse et finit par décroître.",
cap_en="Expected value \\(S_0e^{\\mu t}\\) (gold) and median \\(S_0e^{(\\mu-\\sigma^2/2)t}\\) (blue) of a price starting at 100; the shaded area contains 80 % of the paths at each date. Increase \\(\\sigma\\): the expected value does not move, but the median sags and eventually decreases.",
code=r"""
Object.assign(I18N.fr.f, { mmMu: 'Dérive μ', mmSg: 'Volatilité σ', mmAria: 'Espérance et médiane d\u2019un mouvement brownien géométrique',
  mmRead: (mu, sg, T, E, M, p) => `À <i>t</i> = ${T} ans : espérance <span class="v">${fmtT(E, 2)}</span>, médiane <span class="v">${fmtT(M, 2)}</span> ; probabilité que le cours soit sous 100 : Φ(−(μ − σ²/2)√T / σ) = <span class="v">${fmtT(p, 3)}</span>.` });
Object.assign(I18N.en.f, { mmMu: 'Drift μ', mmSg: 'Volatility σ', mmAria: 'Expected value and median of a geometric Brownian motion',
  mmRead: (mu, sg, T, E, M, p) => `At <i>t</i> = ${T} years: expected value <span class="v">${fmtT(E, 2)}</span>, median <span class="v">${fmtT(M, 2)}</span>; probability that the price is below 100: Φ(−(μ − σ²/2)√T / σ) = <span class="v">${fmtT(p, 3)}</span>.` });
FIGS.medmean = {
  state: { mu: 0.08, sg: 0.5 },
  controls: L => [
    { key: 'mu', label: L.f.mmMu, min: 0, max: 0.2, step: 0.01, fmt: v => fmtT(100 * v, 0) + ' %' },
    { key: 'sg', label: L.f.mmSg, min: 0.05, max: 0.8, step: 0.05, fmt: v => fmtT(100 * v, 0) + ' %' }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, mu = s.mu, sg = s.sg, T = 10, S0 = 100, z = 1.2815515655446004;
    const E = t => S0 * Math.exp(mu * t), M = t => S0 * Math.exp((mu - sg * sg / 2) * t);
    const q = (t, u) => S0 * Math.exp((mu - sg * sg / 2) * t + u * sg * Math.sqrt(t));
    const top = Math.max(E(T) * 1.1, q(T, z) * 0.6, 150), tk = ticks(0, top, 5);
    const P = Plot({ w: 680, h: 330, mt: 20, mb: 40, x0: 0, x1: T, y0: 0, y1: tk[tk.length - 1] });
    P.axes({ xt: [0, 2, 4, 6, 8, 10], yt: tk, xf: v => String(v), yf: v => fmtT(v, 0), xl: 't', yl: 'S(t)' });
    P.clip();
    const up = P.sample(t => q(t, z), 0, T, 120), lo = P.sample(t => q(t, -z), 0, T, 120).reverse();
    P.add(`<path d="${P.pts(up)} ${lo.map(pt => 'L' + P.X(pt[0]) + ' ' + P.Y(pt[1])).join(' ')} Z" fill="${COL.s1}" fill-opacity="0.12" clip-path="url(#${P._clip})"/>`);
    P.seg(0, S0, T, S0, { c: COL.mute, w: 1, dash: '3 3' });
    P.curve(E, 0, T, { c: COL.s2, w: 2.4, clip: true }, 120);
    P.curve(M, 0, T, { c: COL.s1, w: 2.4, clip: true }, 120);
    P.legend([{ c: COL.s2, t: lang === 'fr' ? 'espérance' : 'expected value' }, { c: COL.s1, t: lang === 'fr' ? 'médiane' : 'median' }, { c: COL.s1, t: lang === 'fr' ? 'quantiles 10 % – 90 %' : '10% – 90% quantiles', box: true, o: 0.25 }], P.ml + 6, P.mt + 14);
    const p = normCdf(-(mu - sg * sg / 2) * Math.sqrt(T) / sg);
    return { svg: P.svg(L.mmAria), read: L.mmRead(mu, sg, T, E(T), M(T), p) };
  }
};
""")

if __name__ == '__main__':
    for n in (int(a) for a in sys.argv[1:]):
        F = FIGS[n]
        inject(n, F['fid'], F['code'], F['cap_fr'], F['cap_en'], F['anchor_fr'], F['anchor_en'])
