#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/claude/mf')
from add_figs import inject
F = dict(fid='qline', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="La probabilité risque-neutre comme une position. Sur l'axe des facteurs de croissance, \\(q=\\frac{R-d}{u-d}\\) est la fraction du chemin de \\(d\\) à \\(u\\) parcourue par \\(R\\). Déplacez \\(R\\) : \\(q\\) reste entre 0 et 1 tant que \\(d&lt;R&lt;u\\) ; aux bornes, l'une des deux branches domine l'actif sans risque et il y a arbitrage.",
cap_en="The risk-neutral probability as a position. On the axis of growth factors, \\(q=\\frac{R-d}{u-d}\\) is the fraction of the way from \\(d\\) to \\(u\\) travelled by \\(R\\). Move \\(R\\): \\(q\\) stays between 0 and 1 as long as \\(d&lt;R&lt;u\\); at the bounds, one branch dominates the riskless asset and there is an arbitrage.",
code=r"""
Object.assign(I18N.fr.f, { qlR: 'Facteur sans risque <i>R</i>', qlAria: 'La probabilité risque-neutre sur l\u2019axe des facteurs',
  qlRead: (u, d, R, q) => `<i>q</i> = (${fmtT(R, 3)} − ${fmtT(d, 2)}) / (${fmtT(u, 2)} − ${fmtT(d, 2)}) = <span class="v">${fmtT(q, 4)}</span> ; vérification : <i>qu</i> + (1 − <i>q</i>)<i>d</i> = <span class="v">${fmtT(q * u + (1 - q) * d, 3)}</span> = <i>R</i>.${q <= 0 || q >= 1 ? ' Hors de ]0, 1[ : arbitrage.' : ''}` });
Object.assign(I18N.en.f, { qlR: 'Riskless factor <i>R</i>', qlAria: 'The risk-neutral probability on the factor axis',
  qlRead: (u, d, R, q) => `<i>q</i> = (${fmtT(R, 3)} − ${fmtT(d, 2)}) / (${fmtT(u, 2)} − ${fmtT(d, 2)}) = <span class="v">${fmtT(q, 4)}</span>; check: <i>qu</i> + (1 − <i>q</i>)<i>d</i> = <span class="v">${fmtT(q * u + (1 - q) * d, 3)}</span> = <i>R</i>.${q <= 0 || q >= 1 ? ' Outside ]0, 1[: arbitrage.' : ''}` });
FIGS.qline = {
  state: { R: 1.05 },
  controls: L => [{ key: 'R', label: L.f.qlR, min: 0.85, max: 1.30, step: 0.01, fmt: v => fmtT(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, u = 1.25, d = 0.9, R = s.R, q = (R - d) / (u - d), ok = q > 0 && q < 1;
    const P = Plot({ w: 680, h: 150, mt: 30, mb: 40, ml: 40, mr: 40, x0: 0.8, x1: 1.35, y0: 0, y1: 1 });
    P.axes({ xt: [0.8, 0.9, 1, 1.1, 1.2, 1.3], yt: [], xf: v => fmtT(v, 2), yAxis: false, xAxisAt: 0 });
    P.seg(d, 0.5, u, 0.5, { c: COL.axis, w: 4 });
    P.seg(d, 0.5, Math.min(u, Math.max(d, R)), 0.5, { c: ok ? COL.s1 : COL.s3, w: 6 });
    P.dot(d, 0.5, { c: COL.ink, r: 5 }); P.dot(u, 0.5, { c: COL.ink, r: 5 }); P.dot(R, 0.5, { c: ok ? COL.s2 : COL.s3, r: 6 });
    P.text(d, 0.5, 'd = ' + fmtT(d, 2), { dy: 26, mono: true, size: 11 }); P.text(u, 0.5, 'u = ' + fmtT(u, 2), { dy: 26, mono: true, size: 11 });
    P.text(R, 0.5, 'R = ' + fmtT(R, 2), { dy: -12, mono: true, size: 11, bold: true, c: ok ? COL.s2 : COL.s3 });
    P.text((d + Math.min(u, Math.max(d, R))) / 2, 0.5, 'q = ' + fmtT(q, 3), { dy: -30, size: 11.5, italic: true, c: ok ? COL.s1 : COL.s3 });
    return { svg: P.svg(L.qlAria), read: L.qlRead(u, d, R, q) };
  }
};
""")
inject(9, F['fid'], F['code'], F['cap_fr'], F['cap_en'], F['anchor_fr'], F['anchor_en'])
