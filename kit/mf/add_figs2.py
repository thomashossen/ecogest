#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/claude/mf')
from add_figs import inject
FIGS = {}

# ------------------------------------------------------------ mf6 : loi de W_t et enveloppe en racine de t
FIGS[6] = dict(fid='fan', anchor_fr='<div class="dossier-title" id="s3">', anchor_en='<div class="dossier-title" id="s3">',
cap_fr="Trois trajectoires browniennes et l'enveloppe \\(\\pm\\sqrt{t}\\) (trait plein) et \\(\\pm 2\\sqrt{t}\\) (pointillé). À chaque date \\(t\\), \\(W_t\\sim N(0,t)\\) : environ 68 % des trajectoires sont dans la bande étroite et 95 % dans la bande large. Déplacez la date pour lire l'écart type \\(\\sqrt{t}\\).",
cap_en="Three Brownian paths and the envelopes \\(\\pm\\sqrt{t}\\) (solid) and \\(\\pm 2\\sqrt{t}\\) (dotted). At each date \\(t\\), \\(W_t\\sim N(0,t)\\): about 68 % of paths lie in the narrow band and 95 % in the wide one. Move the date to read the standard deviation \\(\\sqrt{t}\\).",
code=r"""
Object.assign(I18N.fr.f, { fanT: 'Date <i>t</i>', fanSeed: 'Nouvelles trajectoires', fanAria: 'Trajectoires browniennes et enveloppe en racine de t',
  fanRead: t => `À <i>t</i> = ${fmtT(t, 2)} : <i>W<sub>t</sub></i> ~ <i>N</i>(0, ${fmtT(t, 2)}), écart type √<i>t</i> = <span class="v">${fmtT(Math.sqrt(t), 3)}</span> ; <i>P</i>(|<i>W<sub>t</sub></i>| ≤ √<i>t</i>) ≈ 0.683 et <i>P</i>(|<i>W<sub>t</sub></i>| ≤ 2√<i>t</i>) ≈ 0.954, quelle que soit la date.` });
Object.assign(I18N.en.f, { fanT: 'Date <i>t</i>', fanSeed: 'New paths', fanAria: 'Brownian paths and square-root envelope',
  fanRead: t => `At <i>t</i> = ${fmtT(t, 2)}: <i>W<sub>t</sub></i> ~ <i>N</i>(0, ${fmtT(t, 2)}), standard deviation √<i>t</i> = <span class="v">${fmtT(Math.sqrt(t), 3)}</span>; <i>P</i>(|<i>W<sub>t</sub></i>| ≤ √<i>t</i>) ≈ 0.683 and <i>P</i>(|<i>W<sub>t</sub></i>| ≤ 2√<i>t</i>) ≈ 0.954, whatever the date.` });
FIGS.fan = {
  state: { t: 2, seed: 7 },
  controls: L => [
    { key: 't', label: L.f.fanT, min: 0.1, max: 4, step: 0.1, fmt: v => fmtT(v, 1) },
    { key: 'seed', type: 'button', label: L.f.fanSeed, act: s => { s.seed = (s.seed * 7919 + 13) % 100000; } }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, T = 4, N = 400, dt = T / N, t0 = s.t;
    const P = Plot({ w: 680, h: 330, mt: 18, mb: 40, x0: 0, x1: T, y0: -5, y1: 5 });
    P.axes({ xt: [0, 1, 2, 3, 4], yt: [-4, -2, 0, 2, 4], xf: v => String(v), yf: v => String(v), xl: 't', yl: 'W(t)', xAxisAt: 0 });
    P.clip();
    const env = P.sample(u => 2 * Math.sqrt(u), 0, T, 160), env2 = P.sample(u => -2 * Math.sqrt(u), 0, T, 160).reverse();
    P.add(`<path d="${P.pts(env)} ${env2.map(q => 'L' + P.X(q[0]) + ' ' + P.Y(q[1])).join(' ')} Z" fill="${COL.s2}" fill-opacity="0.10"/>`);
    [1, -1].forEach(sg => { P.curve(u => sg * Math.sqrt(u), 0, T, { c: COL.s2, w: 1.6 }, 120); P.curve(u => 2 * sg * Math.sqrt(u), 0, T, { c: COL.s2, w: 1.2, dash: '4 4' }, 120); });
    const cols = [COL.s1, COL.s3, COL.s4];
    for (let k = 0; k < 3; k++) {
      const rnd = localRand(s.seed + 31 * k); let w = 0; const pts = [[0, 0]];
      for (let i = 1; i <= N; i++) { w += Math.sqrt(dt) * normInv(rnd()); pts.push([i * dt, w]); }
      P.line(pts, { c: cols[k], w: 1.3, clip: true });
    }
    P.seg(t0, -5, t0, 5, { c: COL.ink, w: 1, dash: '3 3' });
    P.seg(t0, -Math.sqrt(t0), t0, Math.sqrt(t0), { c: COL.ink, w: 3 });
    P.text(t0, Math.sqrt(t0), '+√t', { dx: 6, dy: -4, anchor: 'start', size: 10.5, mono: true });
    P.text(t0, -Math.sqrt(t0), '−√t', { dx: 6, dy: 12, anchor: 'start', size: 10.5, mono: true });
    return { svg: P.svg(L.fanAria), read: L.fanRead(t0) };
  }
};
""")

# ------------------------------------------------------------ mf7 : la correction d'Itô vue sur W²
FIGS[7] = dict(fid='itosq', anchor_fr='<div class="dossier-title" id="s5">', anchor_en='<div class="dossier-title" id="s5">',
cap_fr="Le terme correctif vu sur une trajectoire. Pour \\(u(x)=x^2\\), la règle ordinaire donnerait \\(\\dd(W^2)=2W\\,\\dd W\\) ; le lemme d'Itô ajoute \\(\\dd t\\). En bleu \\(W_t^2\\), en doré la somme cumulée \\(2\\sum W\\,\\Delta W\\) : l'écart entre les deux courbes (zone colorée) suit la droite \\(t\\).",
cap_en="The correction term seen on a path. For \\(u(x)=x^2\\), the ordinary rule would give \\(\\dd(W^2)=2W\\,\\dd W\\); Itô's lemma adds \\(\\dd t\\). In blue \\(W_t^2\\), in gold the cumulative sum \\(2\\sum W\\,\\Delta W\\): the gap between the curves (shaded) follows the line \\(t\\).",
code=r"""
Object.assign(I18N.fr.f, { isSeed: 'Nouvelle trajectoire', isAria: 'Correction d\u2019Itô sur le carré du mouvement brownien',
  isRead: (w2, s2, T) => `À <i>T</i> = ${T} : <i>W<sub>T</sub></i>² = <span class="v">${fmtT(w2, 3)}</span>, 2∑<i>W</i>Δ<i>W</i> = <span class="v">${fmtT(s2, 3)}</span>, écart <span class="v">${fmtT(w2 - s2, 3)}</span> ≈ <i>T</i> : c'est le terme ½·<i>u</i>″·<i>G</i>²·d<i>t</i> = d<i>t</i> intégré.` });
Object.assign(I18N.en.f, { isSeed: 'New path', isAria: 'Itô correction on the squared Brownian motion',
  isRead: (w2, s2, T) => `At <i>T</i> = ${T}: <i>W<sub>T</sub></i>² = <span class="v">${fmtT(w2, 3)}</span>, 2∑<i>W</i>Δ<i>W</i> = <span class="v">${fmtT(s2, 3)}</span>, gap <span class="v">${fmtT(w2 - s2, 3)}</span> ≈ <i>T</i>: this is the term ½·<i>u</i>″·<i>G</i>²·d<i>t</i> = d<i>t</i>, integrated.` });
FIGS.itosq = {
  state: { seed: 11 },
  controls: L => [{ key: 'seed', type: 'button', label: L.f.isSeed, act: s => { s.seed = (s.seed * 7919 + 13) % 100000; } }],
  draw: function (s, lang) {
    const L = I18N[lang].f, T = 2, N = 800, dt = T / N, rnd = localRand(s.seed);
    let w = 0, sum = 0; const a = [[0, 0]], b = [[0, 0]], gap = [[0, 0]];
    for (let i = 1; i <= N; i++) { const dw = Math.sqrt(dt) * normInv(rnd()); sum += 2 * w * dw; w += dw; a.push([i * dt, w * w]); b.push([i * dt, sum]); gap.push([i * dt, w * w - sum]); }
    const ymax = Math.max(3, ...a.map(p => p[1])), ymin = Math.min(-1, ...b.map(p => p[1]));
    const tk = ticks(ymin, ymax, 5);
    const P = Plot({ w: 680, h: 330, mt: 18, mb: 40, x0: 0, x1: T, y0: Math.min(tk[0], ymin), y1: Math.max(tk[tk.length - 1], ymax * 1.05) });
    P.axes({ xt: [0, 0.5, 1, 1.5, 2], yt: tk, xf: v => String(v), yf: v => fmtT(v, 1), xl: 't', xAxisAt: 0 });
    P.clip();
    P.add(`<path d="${P.pts(a)} ${b.slice().reverse().map(q => 'L' + P.X(q[0]) + ' ' + P.Y(q[1])).join(' ')} Z" fill="${COL.s3}" fill-opacity="0.12" clip-path="url(#${P._clip})"/>`);
    P.line(a, { c: COL.s1, w: 1.8, clip: true }); P.line(b, { c: COL.s2, w: 1.8, clip: true });
    P.line([[0, 0], [T, T]], { c: COL.s3, w: 1.4, dash: '5 4', clip: true });
    P.legend([{ c: COL.s1, t: 'W(t)²' }, { c: COL.s2, t: '2 ΣWΔW' }, { c: COL.s3, t: lang === 'fr' ? 'droite t' : 'line t', dash: '5 4' }], P.ml + 6, P.mt + 14);
    return { svg: P.svg(L.isAria), read: L.isRead(w * w, sum, T) };
  }
};
""")

# ------------------------------------------------------------ mf10 : un pas calibré
FIGS[10] = dict(fid='step', anchor_fr='<div class="dossier-title" id="s3">', anchor_en='<div class="dossier-title" id="s3">',
cap_fr="Un pas de l'arbre calibré sur \\(\\mu\\) et \\(\\sigma\\). Faites varier la volatilité et la durée du pas \\(\\delta t\\) : \\(u=e^{\\sigma\\sqrt{\\delta t}}\\) et \\(d=1/u\\) s'écartent de 1, et \\(p\\) s'ajuste pour que l'espérance du pas vaille \\(e^{\\mu\\,\\delta t}\\). La lecture vérifie l'espérance et la variance obtenues.",
cap_en="One step of the tree calibrated on \\(\\mu\\) and \\(\\sigma\\). Vary the volatility and the step length \\(\\delta t\\): \\(u=e^{\\sigma\\sqrt{\\delta t}}\\) and \\(d=1/u\\) move away from 1, and \\(p\\) adjusts so that the expected value of the step is \\(e^{\\mu\\,\\delta t}\\). The reading checks the expected value and variance obtained.",
code=r"""
Object.assign(I18N.fr.f, { stSg: 'Volatilité σ', stDt: 'Pas δt (années)', stMu: 'Dérive μ', stAria: 'Un pas de l\u2019arbre binomial calibré',
  stRead: (u, d, p, E, Et, V, Vt) => `<i>u</i> = <span class="v">${fmtT(u, 4)}</span>, <i>d</i> = <span class="v">${fmtT(d, 4)}</span>, <i>p</i> = <span class="v">${fmtT(p, 4)}</span>. Espérance du pas : <i>pu</i> + (1 − <i>p</i>)<i>d</i> = ${fmtT(E, 5)} contre <i>e</i><sup>μδt</sup> = ${fmtT(Et, 5)} (exact) ; variance : ${fmtT(V, 5)} contre ${fmtT(Vt, 5)} (approchée, l'écart tend vers 0 avec δt).` });
Object.assign(I18N.en.f, { stSg: 'Volatility σ', stDt: 'Step δt (years)', stMu: 'Drift μ', stAria: 'One calibrated step of the binomial tree',
  stRead: (u, d, p, E, Et, V, Vt) => `<i>u</i> = <span class="v">${fmtT(u, 4)}</span>, <i>d</i> = <span class="v">${fmtT(d, 4)}</span>, <i>p</i> = <span class="v">${fmtT(p, 4)}</span>. Expected value of the step: <i>pu</i> + (1 − <i>p</i>)<i>d</i> = ${fmtT(E, 5)} versus <i>e</i><sup>μδt</sup> = ${fmtT(Et, 5)} (exact); variance: ${fmtT(V, 5)} versus ${fmtT(Vt, 5)} (approximate, the gap vanishes as δt → 0).` });
FIGS.step = {
  state: { sg: 0.2, dt: 0.25, mu: 0.1 },
  controls: L => [
    { key: 'sg', label: L.f.stSg, min: 0.05, max: 0.6, step: 0.05, fmt: v => fmtT(100 * v, 0) + ' %' },
    { key: 'dt', label: L.f.stDt, min: 0.05, max: 1, step: 0.05, fmt: v => fmtT(v, 2) },
    { key: 'mu', label: L.f.stMu, min: -0.1, max: 0.3, step: 0.01, fmt: v => fmtT(100 * v, 0) + ' %' }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, sg = s.sg, dt = s.dt, mu = s.mu, S = 100;
    const u = Math.exp(sg * Math.sqrt(dt)), d = 1 / u, p = (Math.exp(mu * dt) - d) / (u - d);
    const E = p * u + (1 - p) * d, Et = Math.exp(mu * dt), V = p * u * u + (1 - p) * d * d - E * E, Vt = Math.exp(2 * mu * dt) * (Math.exp(sg * sg * dt) - 1);
    const W = 680, H = 260, x0 = 120, x1 = 520, yc = 130, sp = Math.min(95, 25 + 300 * (u - 1));
    let el = `<line x1="${x0}" y1="${yc}" x2="${x1}" y2="${yc - sp}" stroke="${COL.s1}" stroke-width="2"/><line x1="${x0}" y1="${yc}" x2="${x1}" y2="${yc + sp}" stroke="${COL.s3}" stroke-width="2"/>`;
    el += `<circle cx="${x0}" cy="${yc}" r="5" fill="${COL.navy}"/><circle cx="${x1}" cy="${yc - sp}" r="5" fill="${COL.s1}"/><circle cx="${x1}" cy="${yc + sp}" r="5" fill="${COL.s3}"/>`;
    el += `<text x="${x0 - 12}" y="${yc + 4}" text-anchor="end" ${FONT_M} font-size="12" font-weight="700" fill="${COL.ink}">S = ${S}</text>`;
    el += `<text x="${x1 + 12}" y="${yc - sp + 4}" ${FONT_M} font-size="12" font-weight="700" fill="${COL.ink}">uS = ${fmtT(S * u, 2)}</text>`;
    el += `<text x="${x1 + 12}" y="${yc + sp + 4}" ${FONT_M} font-size="12" font-weight="700" fill="${COL.ink}">dS = ${fmtT(S * d, 2)}</text>`;
    el += `<text x="${(x0 + x1) / 2}" y="${yc - sp / 2 - 12}" text-anchor="middle" ${FONT_T} font-size="12" fill="${COL.s1}">p = ${fmtT(p, 3)}</text>`;
    el += `<text x="${(x0 + x1) / 2}" y="${yc + sp / 2 + 20}" text-anchor="middle" ${FONT_T} font-size="12" fill="${COL.s3}">1 − p = ${fmtT(1 - p, 3)}</text>`;
    el += `<text x="${x0}" y="${H - 14}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.mute}">t</text><text x="${x1}" y="${H - 14}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.mute}">t + δt</text>`;
    el += `<line x1="${x0}" y1="${H - 34}" x2="${x1}" y2="${H - 34}" stroke="${COL.axis}" stroke-width="1"/>`;
    el += `<text x="${(x0 + x1) / 2}" y="${H - 40}" text-anchor="middle" ${FONT_M} font-size="10.5" fill="${COL.mute}">δt = ${fmtT(dt, 2)}</text>`;
    el += `<text x="${W - 14}" y="22" text-anchor="end" ${FONT_M} font-size="11" fill="${COL.mute}">u = e^(σ√δt) = ${fmtT(u, 4)}</text>`;
    el += `<text x="${W - 14}" y="${H - 14}" text-anchor="end" ${FONT_M} font-size="11" fill="${COL.mute}">E[S′] = ${fmtT(S * Et, 2)}</text>`;
    const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(L.stAria)}">${el}</svg>`;
    return { svg: svg, read: L.stRead(u, d, p, E, Et, V, Vt) };
  }
};
""")

# ------------------------------------------------------------ mf11 : exercer ou attendre, à un nœud
FIGS[11] = dict(fid='node', anchor_fr='<div class="dossier-title" id="s3">', anchor_en='<div class="dossier-title" id="s3">',
cap_fr="La décision à un nœud, pour un put de prix d'exercice 100. Déplacez le cours \\(S\\) du nœud : la barre dorée est la valeur intrinsèque \\(\\max(K-S,0)\\), la barre bleue la valeur d'attente \\(\\frac{q\\,f_u+(1-q)\\,f_d}{R}\\) calculée avec les deux valeurs suivantes de l'option. La valeur du nœud est la plus grande des deux.",
cap_en="The decision at a node, for a put with strike 100. Move the price \\(S\\) of the node: the gold bar is the intrinsic value \\(\\max(K-S,0)\\), the blue bar the continuation value \\(\\frac{q\\,f_u+(1-q)\\,f_d}{R}\\) computed from the next two option values. The node value is the larger of the two.",
code=r"""
Object.assign(I18N.fr.f, { ndS: 'Cours <i>S</i> du nœud', ndR: 'Taux <i>R</i> − 1', ndAria: 'Exercer ou attendre à un nœud',
  ndEx: 'exercer', ndWait: 'attendre',
  ndRead: (S, intr, cont, q) => `<i>q</i> = <span class="v">${fmtT(q, 4)}</span> ; valeur intrinsèque <span class="v">${fmtT(intr, 2)}</span>, valeur d'attente <span class="v">${fmtT(cont, 2)}</span> : ${intr > cont ? 'on exerce' : 'on attend'}, le nœud vaut <span class="v">${fmtT(Math.max(intr, cont), 2)}</span>.` });
Object.assign(I18N.en.f, { ndS: 'Node price <i>S</i>', ndR: 'Rate <i>R</i> − 1', ndAria: 'Exercise or wait at a node',
  ndEx: 'exercise', ndWait: 'wait',
  ndRead: (S, intr, cont, q) => `<i>q</i> = <span class="v">${fmtT(q, 4)}</span>; intrinsic value <span class="v">${fmtT(intr, 2)}</span>, continuation value <span class="v">${fmtT(cont, 2)}</span>: ${intr > cont ? 'exercise' : 'wait'}, the node is worth <span class="v">${fmtT(Math.max(intr, cont), 2)}</span>.` });
FIGS.node = {
  state: { S: 80, r: 0.05 },
  controls: L => [
    { key: 'S', label: L.f.ndS, min: 50, max: 120, step: 1, fmt: v => fmtT(v, 0) },
    { key: 'r', label: L.f.ndR, min: 0, max: 0.1, step: 0.01, fmt: v => fmtT(100 * v, 0) + ' %' }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, K = 100, u = 1.25, d = 0.8, R = 1 + s.r, S = s.S, q = (R - d) / (u - d);
    const fu = Math.max(K - u * S, 0), fd = Math.max(K - d * S, 0), cont = (q * fu + (1 - q) * fd) / R, intr = Math.max(K - S, 0);
    const W = 680, H = 300, x0 = 50, x1 = 200, yc = 140, sp = 70;
    let el = `<line x1="${x0}" y1="${yc}" x2="${x1}" y2="${yc - sp}" stroke="${COL.s1}" stroke-width="1.6"/><line x1="${x0}" y1="${yc}" x2="${x1}" y2="${yc + sp}" stroke="${COL.s3}" stroke-width="1.6"/>`;
    el += `<circle cx="${x0}" cy="${yc}" r="5" fill="${COL.navy}"/><circle cx="${x1}" cy="${yc - sp}" r="4" fill="${COL.s1}"/><circle cx="${x1}" cy="${yc + sp}" r="4" fill="${COL.s3}"/>`;
    el += `<text x="${x0}" y="${yc - 12}" text-anchor="middle" ${FONT_M} font-size="12" font-weight="700" fill="${COL.ink}">S = ${fmtT(S, 0)}</text>`;
    el += `<text x="${x1 + 10}" y="${yc - sp + 4}" ${FONT_M} font-size="11" fill="${COL.ink}">uS = ${fmtT(u * S, 1)} → f = ${fmtT(fu, 2)}</text>`;
    el += `<text x="${x1 + 10}" y="${yc + sp + 4}" ${FONT_M} font-size="11" fill="${COL.ink}">dS = ${fmtT(d * S, 1)} → f = ${fmtT(fd, 2)}</text>`;
    el += `<text x="${(x0 + x1) / 2 - 6}" y="${yc - sp / 2 - 8}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.s1}">q = ${fmtT(q, 3)}</text>`;
    el += `<text x="${(x0 + x1) / 2 - 6}" y="${yc + sp / 2 + 16}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.s3}">1 − q</text>`;
    /* barres : exercer / attendre */
    const bx = 440, bw = 90, by = 260, sc = 3.2, ex = intr > cont;
    const bar = (x, v, c, lab, on) => `<rect x="${x}" y="${by - v * sc}" width="${bw}" height="${v * sc}" fill="${c}" fill-opacity="${on ? 1 : 0.35}" rx="3"/><text x="${x + bw / 2}" y="${by - v * sc - 6}" text-anchor="middle" ${FONT_M} font-size="11.5" font-weight="700" fill="${COL.ink}">${fmtT(v, 2)}</text><text x="${x + bw / 2}" y="${by + 16}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.mute}">${lab}</text>`;
    el += `<line x1="${bx - 20}" y1="${by}" x2="${bx + 2 * bw + 50}" y2="${by}" stroke="${COL.axis}"/>`;
    el += bar(bx, intr, COL.s2, L.ndEx + ' : K − S', ex) + bar(bx + bw + 30, cont, COL.s1, L.ndWait, !ex);
    const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(L.ndAria)}">${el}</svg>`;
    return { svg: svg, read: L.ndRead(S, intr, cont, q) };
  }
};
""")

# ------------------------------------------------------------ mf12 : histogramme des gains simulés
FIGS[12] = dict(fid='hist', anchor_fr='<div class="dossier-title" id="s3">', anchor_en='<div class="dossier-title" id="s3">',
cap_fr="Histogramme de \\(n\\) gains actualisés simulés du call de la figure 1 (\\(S_0=K=100\\), \\(r=5\\,\\%\\), \\(\\sigma=20\\,\\%\\), \\(T=1\\)). Le trait vertical est la moyenne empirique, le segment couvre un écart type empirique de part et d'autre. Plus de la moitié des tirages valent 0 : la variance est forte, d'où la lenteur de la méthode.",
cap_en="Histogram of \\(n\\) simulated discounted payoffs of the call of figure 1 (\\(S_0=K=100\\), \\(r=5\\,\\%\\), \\(\\sigma=20\\,\\%\\), \\(T=1\\)). The vertical line is the sample mean, the segment covers one sample standard deviation on either side. More than half of the draws are 0: the variance is large, hence the slowness of the method.",
code=r"""
Object.assign(I18N.fr.f, { hsN: 'Simulations <i>n</i>', hsSeed: 'Nouveaux tirages', hsAria: 'Histogramme des gains actualisés simulés',
  hsRead: (n, m, sd, z) => `<i>n</i> = ${n} : moyenne empirique <span class="v">${fmtT(m, 3)}</span>, écart type empirique <i>S</i> = <span class="v">${fmtT(sd, 3)}</span>, part des gains nuls <span class="v">${fmtT(100 * z, 1)} %</span> ; erreur type <i>S</i>/√<i>n</i> = <span class="v">${fmtT(sd / Math.sqrt(n), 3)}</span>.` });
Object.assign(I18N.en.f, { hsN: 'Simulations <i>n</i>', hsSeed: 'New draws', hsAria: 'Histogram of simulated discounted payoffs',
  hsRead: (n, m, sd, z) => `<i>n</i> = ${n}: sample mean <span class="v">${fmtT(m, 3)}</span>, sample standard deviation <i>S</i> = <span class="v">${fmtT(sd, 3)}</span>, share of zero payoffs <span class="v">${fmtT(100 * z, 1)}%</span>; standard error <i>S</i>/√<i>n</i> = <span class="v">${fmtT(sd / Math.sqrt(n), 3)}</span>.` });
FIGS.hist = {
  state: { n: 1000, seed: 3 },
  controls: L => [
    { key: 'n', label: L.f.hsN, min: 100, max: 5000, step: 100, fmt: v => String(v) },
    { key: 'seed', type: 'button', label: L.f.hsSeed, act: s => { s.seed = (s.seed * 7919 + 13) % 100000; } }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = s.n, rnd = localRand(s.seed), S0 = 100, K = 100, r = 0.05, sg = 0.2, T = 1;
    const xs = []; let sum = 0, sum2 = 0, zeros = 0;
    for (let i = 0; i < n; i++) { const ST = S0 * Math.exp((r - sg * sg / 2) * T + sg * Math.sqrt(T) * normInv(rnd())); const x = Math.exp(-r * T) * Math.max(ST - K, 0); xs.push(x); sum += x; sum2 += x * x; if (x === 0) zeros++; }
    const m = sum / n, sd = Math.sqrt((sum2 - n * m * m) / (n - 1));
    const bw = 4, nb = 20, counts = new Array(nb).fill(0);
    xs.forEach(x => { const b = Math.min(nb - 1, Math.floor(x / bw)); counts[b]++; });
    const fmax = Math.max.apply(null, counts) / n, tk = ticks(0, fmax * 1.1, 4);
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 40, x0: -2, x1: nb * bw + 2, y0: 0, y1: tk[tk.length - 1] });
    P.axes({ xt: [0, 20, 40, 60, 80], yt: tk, xf: v => String(v), yf: v => fmtT(v, 2), xl: lang === 'fr' ? 'gain actualisé' : 'discounted payoff', yl: lang === 'fr' ? 'fréquence' : 'frequency' });
    counts.forEach((c, b) => P.bar(b * bw + bw / 2, (P.X(bw) - P.X(0)) - 2, c / n, { c: COL.s1, o: 0.85, tip: `[${b * bw}, ${(b + 1) * bw}${b === nb - 1 ? '+' : ''}) : ${c}` }));
    P.seg(m, 0, m, P.y1, { c: COL.s2, w: 2 });
    P.seg(Math.max(0, m - sd), P.y1 * 0.72, m + sd, P.y1 * 0.72, { c: COL.s2, w: 3 });
    P.text(m + sd, P.y1 * 0.72, lang === 'fr' ? 'moyenne ± S' : 'mean ± S', { dx: 8, dy: 4, anchor: 'start', size: 11, c: COL.s2 });
    return { svg: P.svg(L.hsAria), read: L.hsRead(n, m, sd, zeros / n) };
  }
};
""")

# ------------------------------------------------------------ mf13 : corrélation gain / cours final
FIGS[13] = dict(fid='corr', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="Pourquoi \\(S_T\\) est une bonne variable de contrôle pour un call : chaque point est une simulation, en abscisse le cours final \\(S_T\\), en ordonnée le gain actualisé \\(X\\). Les deux sont fortement corrélés, et l'espérance de \\(S_T\\), \\(S_0e^{rT}\\), est connue : la droite dorée est la régression de \\(X\\) sur \\(S_T\\), dont la pente est le coefficient \\(c^{*}\\) au signe près.",
cap_en="Why \\(S_T\\) is a good control variate for a call: each dot is a simulation, with the final price \\(S_T\\) on the x-axis and the discounted payoff \\(X\\) on the y-axis. The two are strongly correlated, and the expected value of \\(S_T\\), \\(S_0e^{rT}\\), is known: the gold line is the regression of \\(X\\) on \\(S_T\\), whose slope is the coefficient \\(c^{*}\\) up to sign.",
code=r"""
Object.assign(I18N.fr.f, { crK: 'Prix d\u2019exercice <i>K</i>', crSeed: 'Nouveaux tirages', crAria: 'Corrélation entre le gain d\u2019un call et le cours final',
  crRead: (rho, c, red) => `Corrélation empirique ρ = <span class="v">${fmtT(rho, 3)}</span>, pente de régression <span class="v">${fmtT(c, 4)}</span> ; la variance résiduelle vaut (1 − ρ²) = <span class="v">${fmtT(100 * (1 - rho * rho), 1)} %</span> de la variance initiale : variance divisée par <span class="v">${fmtT(red, 1)}</span>.` });
Object.assign(I18N.en.f, { crK: 'Strike <i>K</i>', crSeed: 'New draws', crAria: 'Correlation between a call payoff and the final price',
  crRead: (rho, c, red) => `Sample correlation ρ = <span class="v">${fmtT(rho, 3)}</span>, regression slope <span class="v">${fmtT(c, 4)}</span>; the residual variance is (1 − ρ²) = <span class="v">${fmtT(100 * (1 - rho * rho), 1)}%</span> of the initial one: variance divided by <span class="v">${fmtT(red, 1)}</span>.` });
FIGS.corr = {
  state: { K: 100, seed: 5 },
  controls: L => [
    { key: 'K', label: L.f.crK, min: 70, max: 140, step: 5, fmt: v => fmtT(v, 0) },
    { key: 'seed', type: 'button', label: L.f.crSeed, act: s => { s.seed = (s.seed * 7919 + 13) % 100000; } }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = 400, rnd = localRand(s.seed), S0 = 100, K = s.K, r = 0.05, sg = 0.2, T = 1, df = Math.exp(-r * T);
    const pts = []; let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0;
    for (let i = 0; i < n; i++) { const ST = S0 * Math.exp((r - sg * sg / 2) * T + sg * normInv(rnd())); const X = df * Math.max(ST - K, 0); pts.push([ST, X]); sx += ST; sy += X; sxx += ST * ST; syy += X * X; sxy += ST * X; }
    const mx = sx / n, my = sy / n, vx = sxx / n - mx * mx, vy = syy / n - my * my, cov = sxy / n - mx * my;
    const rho = cov / Math.sqrt(vx * vy), c = cov / vx, red = 1 / (1 - rho * rho);
    const P = Plot({ w: 680, h: 330, mt: 20, mb: 40, x0: 50, x1: 180, y0: -5, y1: 80 });
    P.axes({ xt: [60, 80, 100, 120, 140, 160, 180], yt: [0, 20, 40, 60, 80], xf: v => String(v), yf: v => String(v), xl: 'S(T)', yl: 'X', xAxisAt: 0 });
    P.clip();
    pts.forEach(p => P.add(`<circle cx="${P.X(p[0])}" cy="${P.Y(p[1])}" r="2.6" fill="${COL.s1}" fill-opacity="0.45"/>`));
    P.line([[50, my + c * (50 - mx)], [180, my + c * (180 - mx)]], { c: COL.s2, w: 2.2, clip: true });
    P.seg(S0 * Math.exp(r * T), -5, S0 * Math.exp(r * T), 80, { c: COL.s3, w: 1.2, dash: '4 3' });
    P.text(S0 * Math.exp(r * T), 80, 'E[S(T)] = S₀e^(rT)', { dx: 6, dy: 12, anchor: 'start', size: 10.5, mono: true, c: COL.s3 });
    return { svg: P.svg(L.crAria), read: L.crRead(rho, c, red) };
  }
};
""")

# ------------------------------------------------------------ mf14 : schéma de la récurrence LSM
FIGS[14] = dict(fid='lsm', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="Le déroulement de la méthode de Longstaff et Schwartz. On simule vers l'avant, puis on remonte le temps date par date : à chaque date, seules les trajectoires dans la monnaie servent à la régression, et le flux d'une trajectoire est remplacé par le gain d'exercice quand celui-ci dépasse la valeur de continuation estimée.",
cap_en="The flow of the Longstaff–Schwartz method. Paths are simulated forward, then time is walked backward date by date: at each date, only the in-the-money paths feed the regression, and a path's cash flow is replaced by the exercise payoff whenever it exceeds the estimated continuation value.",
code=r"""
Object.assign(I18N.fr.f, { lsmAria: 'Schéma de la récurrence de Longstaff et Schwartz',
  lsmT: ['1. Simuler n trajectoires', 'dérive r,|dates t₁ … t<tspan baseline-shift="sub" font-size="8">M</tspan>', '2. À l\u2019échéance t<tspan baseline-shift="sub" font-size="8">M</tspan>', 'flux = gain|de l\u2019option', '3. Reculer à t<tspan baseline-shift="sub" font-size="8">k</tspan>', 'ne garder que les|trajectoires dans la monnaie', '4. Régresser', 'Y = flux futur actualisé|sur X = cours en t<tspan baseline-shift="sub" font-size="8">k</tspan>', '5. Comparer', 'gain immédiat ≥ continuation|estimée ? → remplacer le flux', '6. En t₀', 'prix = moyenne|des flux actualisés'] });
Object.assign(I18N.en.f, { lsmAria: 'Flow chart of the Longstaff–Schwartz recursion',
  lsmT: ['1. Simulate n paths', 'drift r,|dates t₁ … t<tspan baseline-shift="sub" font-size="8">M</tspan>', '2. At maturity t<tspan baseline-shift="sub" font-size="8">M</tspan>', 'cash flow =|option payoff', '3. Step back to t<tspan baseline-shift="sub" font-size="8">k</tspan>', 'keep only the|in-the-money paths', '4. Regress', 'Y = discounted future flow|on X = price at t<tspan baseline-shift="sub" font-size="8">k</tspan>', '5. Compare', 'immediate payoff ≥ estimated|continuation? → replace the flow', '6. At t₀', 'price = mean of|discounted flows'] });
FIGS.lsm = {
  state: {},
  draw: function (s, lang) {
    const L = I18N[lang].f, T = L.lsmT, W = 680, H = 250;
    const nodes = [[40, 0], [250, 0], [460, 0], [460, 1], [250, 1], [40, 1]];
    const bw = 190, bh = 74, Y = i => 20 + i * 120;
    let el = `<defs><marker id="lsmArr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="${COL.mute}"/></marker></defs>`;
    const txt = (x, y, w, lines) => lines.map((ln, i) => `<text x="${x + w / 2}" y="${y + 20 + i * 15}" text-anchor="middle" ${FONT_T} font-size="${i ? 10.5 : 11.5}" font-weight="${i ? 400 : 700}" fill="${i ? COL.mute : COL.ink}">${ln}</text>`).join('');
    nodes.forEach((nd, i) => {
      const x = nd[0], y = Y(nd[1]), loop = i >= 2 && i <= 4;
      el += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6" fill="${loop ? '#f7f9fc' : '#fff'}" stroke="${loop ? COL.s1 : COL.navy}" stroke-width="1.4"/>`;
      el += txt(x, y, bw, [T[2 * i]].concat(T[2 * i + 1].split('|')));
    });
    const arrow = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${COL.mute}" stroke-width="1.4" marker-end="url(#lsmArr)"/>`;
    el += arrow(40 + bw, Y(0) + bh / 2, 250, Y(0) + bh / 2) + arrow(250 + bw, Y(0) + bh / 2, 460, Y(0) + bh / 2);
    el += arrow(460 + bw / 2, Y(0) + bh, 460 + bw / 2, Y(1)) + arrow(460, Y(1) + bh / 2, 250 + bw, Y(1) + bh / 2) + arrow(250, Y(1) + bh / 2, 40 + bw, Y(1) + bh / 2);
    el += `<text x="${460 + bw / 2 + 8}" y="${(Y(0) + bh + Y(1)) / 2 + 4}" ${FONT_M} font-size="10.5" fill="${COL.s1}">k = M−1, …, 1</text>`;
    const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(L.lsmAria)}">${el}</svg>`;
    return { svg: svg, read: '' };
  }
};
""")

if __name__ == '__main__':
    for n in (int(a) for a in sys.argv[1:]):
        F = FIGS[n]
        inject(n, F['fid'], F['code'], F['cap_fr'], F['cap_en'], F['anchor_fr'], F['anchor_en'])
