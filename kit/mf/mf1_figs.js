
/* ---------- figure 4 : dispersion, variance et écart type ---------- */
Object.assign(I18N.fr.f, {
  dsp: 'Étirement <i>a</i>', dshift: 'Décalage <i>b</i>',
  dispAria: 'Dispersion d\u2019une loi autour de son espérance',
  dispRead: (mu, v, sd, a, b) => `<i>Y</i> = ${fmtT(a, 2)}·<i>X</i> ${b >= 0 ? '+' : '−'} ${fmtT(Math.abs(b), 1)} : espérance <span class="v">${fmtT(mu, 3)}</span>, variance <span class="v">${fmtT(v, 4)}</span>, écart type <span class="v">${fmtT(sd, 4)}</span> = ${fmtT(a, 2)} × ${fmtT(Math.sqrt(4.11), 4)}.`,
  dmu: 'espérance μ', dsig: 'μ ± σ', ddev: 'écart à μ',
  ln: 'Périodes <i>n</i>', lu: 'Hausse <i>u</i>', ld: 'Baisse <i>d</i>', lp: 'Probabilité <i>p</i>',
  latAria: (n) => `Arbre binomial recombinant à ${n} périodes`,
  latRead: (n, p, ES) => `Nombre de hausses <i>K</i> ~ <i>B</i>(${n}, ${fmtT(p, 2)}) ; le cours final <i>S<sub>n</sub></i> = <i>S</i><sub>0</sub> <i>u</i><sup>K</sup> <i>d</i><sup>n−K</sup> a pour espérance <span class="v">${fmtT(ES, 2)}</span>. Chaque nœud indique le cours ; les nœuds finaux portent, à droite, la probabilité C(<i>n</i>,<i>k</i>) <i>p</i><sup>k</sup>(1 − <i>p</i>)<sup>n−k</sup> d'y parvenir.`
});
Object.assign(I18N.en.f, {
  dsp: 'Stretch <i>a</i>', dshift: 'Shift <i>b</i>',
  dispAria: 'Dispersion of a distribution around its mean',
  dispRead: (mu, v, sd, a, b) => `<i>Y</i> = ${fmtT(a, 2)}·<i>X</i> ${b >= 0 ? '+' : '−'} ${fmtT(Math.abs(b), 1)}: mean <span class="v">${fmtT(mu, 3)}</span>, variance <span class="v">${fmtT(v, 4)}</span>, standard deviation <span class="v">${fmtT(sd, 4)}</span> = ${fmtT(a, 2)} × ${fmtT(Math.sqrt(4.11), 4)}.`,
  dmu: 'mean μ', dsig: 'μ ± σ', ddev: 'deviation from μ',
  ln: 'Periods <i>n</i>', lu: 'Up <i>u</i>', ld: 'Down <i>d</i>', lp: 'Probability <i>p</i>',
  latAria: (n) => `Recombining binomial tree with ${n} periods`,
  latRead: (n, p, ES) => `Number of up moves <i>K</i> ~ <i>B</i>(${n}, ${fmtT(p, 2)}); the final price <i>S<sub>n</sub></i> = <i>S</i><sub>0</sub> <i>u</i><sup>K</sup> <i>d</i><sup>n−K</sup> has expected value <span class="v">${fmtT(ES, 2)}</span>. Each node shows the price; the final nodes show, on the right, the probability C(<i>n</i>,<i>k</i>) <i>p</i><sup>k</sup>(1 − <i>p</i>)<sup>n−k</sup> of reaching it.`
});
FIGS.disp = {
  state: { a: 1, b: 0 },
  controls: L => [
    { key: 'a', label: L.f.dsp, min: 0.25, max: 2, step: 0.25, fmt: v => fmtT(v, 2) },
    { key: 'b', label: L.f.dshift, min: -3, max: 3, step: 0.5, fmt: v => fmtT(v, 1) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, X = [1, 3, 5, 7], p = [0.5, 0.25, 0.15, 0.1], mu0 = 2.7, a = s.a, b = s.b;
    const Y = X.map(x => a * x + b), mu = a * mu0 + b;
    const v = Y.reduce((acc, y, i) => acc + p[i] * (y - mu) * (y - mu), 0), sd = Math.sqrt(v);
    const P = Plot({ w: 680, h: 300, mt: 30, mb: 40, x0: -6, x1: 18, y0: 0, y1: 0.6 });
    P.axes({ xt: [-6, -4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18], yt: [0, 0.2, 0.4, 0.6], xf: v => String(v), yf: v => fmtT(v, 1), yl: L.pmf });
    /* bande μ ± σ */
    P.add(`<rect x="${P.X(mu - sd)}" y="${P.mt}" width="${Math.max(0, P.X(mu + sd) - P.X(mu - sd))}" height="${P.h - P.mt - P.mb}" fill="${COL.s2}" fill-opacity="0.13"/>`);
    Y.forEach((y, i) => {
      P.bar(y, 16, p[i], { c: COL.s1, tip: `P(Y = ${fmtT(y, 2)}) = ${p[i]}` });
      P.text(y, p[i], fmtT(y, 2), { dy: -6, mono: true, size: 10.5 });
      /* écart à l'espérance */
      P.seg(mu, 0.03 + 0.02 * i, y, 0.03 + 0.02 * i, { c: COL.s3, w: 1.2, dash: '3 3' });
    });
    P.seg(mu, 0, mu, 0.6, { c: COL.s2, w: 1.8 });
    P.text(mu, 0.6, 'μ = ' + fmtT(mu, 2), { dy: -4, size: 11.5, italic: true });
    P.text(mu + sd, 0.6, 'μ + σ', { dy: 28, size: 10.5, c: COL.mute });
    P.text(mu - sd, 0.6, 'μ − σ', { dy: 28, size: 10.5, c: COL.mute });
    P.legend([{ c: COL.s1, t: 'p(y)', box: true }, { c: COL.s2, t: L.dmu }, { c: COL.s2, t: L.dsig, box: true, o: 0.25 }, { c: COL.s3, t: L.ddev, dash: '3 3' }], P.ml, P.h - 4);
    return { svg: P.svg(L.dispAria), read: L.dispRead(mu, v, sd, a, b) };
  }
};

/* ---------- figure 5 : arbre binomial recombinant d'un cours ---------- */
FIGS.lattice = {
  state: { n: 3, u: 1.1, d: 0.9, p: 0.5 },
  controls: L => [
    { key: 'n', label: L.f.ln, min: 1, max: 6, step: 1 },
    { key: 'u', label: L.f.lu, min: 1.05, max: 1.5, step: 0.05, fmt: v => fmtT(v, 2) },
    { key: 'd', label: L.f.ld, min: 0.5, max: 0.95, step: 0.05, fmt: v => fmtT(v, 2) },
    { key: 'p', label: L.f.lp, min: 0.1, max: 0.9, step: 0.05, fmt: v => fmtT(v, 2) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = s.n, u = Math.round(s.u * 100) / 100, d = Math.round(s.d * 100) / 100, p = Math.round(s.p * 100) / 100, S0 = 100;
    const W = 680, H = 60 + 46 * n, xL = 60, xR = W - 70, X = j => xL + j * (xR - xL) / n, cy = H / 2, dy = (H - 50) / (2 * n);
    const Yn = (j, k) => cy - (2 * k - j) * dy;             // k hausses parmi j périodes
    let el = '', ES = 0;
    for (let j = 0; j < n; j++) for (let k = 0; k <= j; k++) {
      el += `<line x1="${X(j)}" y1="${Yn(j, k)}" x2="${X(j + 1)}" y2="${Yn(j + 1, k + 1)}" stroke="${COL.s1}" stroke-width="1.4"/>`;
      el += `<line x1="${X(j)}" y1="${Yn(j, k)}" x2="${X(j + 1)}" y2="${Yn(j + 1, k)}" stroke="${COL.s3}" stroke-width="1.4"/>`;
    }
    for (let j = 0; j <= n; j++) for (let k = 0; k <= j; k++) {
      const S = S0 * Math.pow(u, k) * Math.pow(d, j - k), pr = comb(j, k) * Math.pow(p, k) * Math.pow(1 - p, j - k);
      if (j === n) ES += pr * S;
      const last = j === n;
      el += `<circle cx="${X(j)}" cy="${Yn(j, k)}" r="${last ? 4.5 : 3.5}" fill="${last ? COL.navy : '#fff'}" stroke="${COL.navy}" stroke-width="1.6"/>`;
      el += `<text x="${X(j)}" y="${Yn(j, k) - 7}" text-anchor="middle" ${FONT_M} font-size="${n > 4 ? 9.5 : 10.5}" font-weight="700" fill="${COL.ink}">${fmtT(S, n > 3 ? 1 : 2)}</text>`;
      if (last || j === 0) el += `<text x="${X(j) + (last ? 10 : -10)}" y="${Yn(j, k) + 4}" text-anchor="${last ? 'start' : 'end'}" ${FONT_M} font-size="9.5" fill="${COL.mute}">${last ? fmtT(pr, 4) : 'S₀'}</text>`;
    }
    for (let j = 0; j <= n; j++) el += `<text x="${X(j)}" y="${H - 6}" text-anchor="middle" ${FONT_T} font-size="11" fill="${COL.mute}">t = ${j}</text>`;
    el += `<text x="${X(0) + 8}" y="${cy - dy - 12}" ${FONT_T} font-size="11" fill="${COL.s1}">×u (p)</text>`;
    el += `<text x="${X(0) + 8}" y="${cy + dy + 20}" ${FONT_T} font-size="11" fill="${COL.s3}">×d (1 − p)</text>`;
    const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(L.latAria(n))}">${el}</svg>`;
    return { svg: svg, read: L.latRead(n, p, ES) };
  }
};
