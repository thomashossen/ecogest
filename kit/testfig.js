<script id="testfig-lib">
/* ════════════════════════════════════════════════════════════════════
   SCHÉMAS DE TESTS D'HYPOTHÈSES (commun aux pages d'économétrie)
   testFig({ law: 't' | 'z' | 'F' | 'chi2', df1, df2, stat, side: 'B' | 'L' | 'R',
             levels: [95] ou [95, 99] (niveaux de confiance en %), lab: 't̂₁',
             crit: valeurs critiques imposées (facultatif, mêmes que dans le corrigé),
             asym: true si la loi n'est valable qu'asymptotiquement })
   Densité sous H0, zone(s) de rejet, quantile(s), statistique observée, verdict.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function lgam(x) {
    const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgam(1 - x);
    x -= 1; let a = c[0]; const t = x + 7.5;
    for (let i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  /* bêta incomplète régularisée (fraction continue de Lentz) */
  function betacf(x, a, b) {
    const FPMIN = 1e-300; let qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; let h = d;
    for (let m = 1; m <= 300; m++) {
      const m2 = 2 * m; let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d;
      const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-14) break;
    }
    return h;
  }
  function ibeta(x, a, b) {
    if (x <= 0) return 0; if (x >= 1) return 1;
    const bt = Math.exp(lgam(a + b) - lgam(a) - lgam(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(x, a, b) / a : 1 - bt * betacf(1 - x, b, a) / b;
  }
  /* gamma incomplète régularisée inférieure */
  function gammp(a, x) {
    if (x <= 0) return 0;
    if (x < a + 1) { let ap = a, sum = 1 / a, del = sum; for (let n = 0; n < 500; n++) { ap += 1; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-15) break; } return sum * Math.exp(-x + a * Math.log(x) - lgam(a)); }
    let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-15) break; }
    return 1 - Math.exp(-x + a * Math.log(x) - lgam(a)) * h;
  }
  const LAW = {
    z: { pdf: x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI), cdf: x => x >= 0 ? 0.5 + 0.5 * gammp(0.5, x * x / 2) : 0.5 - 0.5 * gammp(0.5, x * x / 2), sym: true },
    t: { pdf: (x, n) => Math.exp(lgam((n + 1) / 2) - lgam(n / 2) - 0.5 * Math.log(n * Math.PI) - (n + 1) / 2 * Math.log(1 + x * x / n)),
         cdf: (x, n) => { const p = 0.5 * ibeta(n / (n + x * x), n / 2, 0.5); return x >= 0 ? 1 - p : p; }, sym: true },
    F: { pdf: (x, d1, d2) => x <= 0 ? 0 : Math.exp((d1 / 2) * Math.log(d1 / d2) + (d1 / 2 - 1) * Math.log(x) - ((d1 + d2) / 2) * Math.log(1 + d1 * x / d2) - (lgam(d1 / 2) + lgam(d2 / 2) - lgam((d1 + d2) / 2))),
         cdf: (x, d1, d2) => x <= 0 ? 0 : ibeta(d1 * x / (d1 * x + d2), d1 / 2, d2 / 2), sym: false },
    chi2: { pdf: (x, k) => x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.log(2) - lgam(k / 2)), cdf: (x, k) => gammp(k / 2, x / 2), sym: false }
  };
  function quant(law, p, d1, d2) {
    const L = LAW[law]; let lo = L.sym ? -60 : 0, hi = L.sym ? 60 : 1;
    if (!L.sym) while (L.cdf(hi, d1, d2) < p && hi < 1e7) hi *= 2;
    for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (L.cdf(m, d1, d2) < p) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  window.testQuantile = quant;
  window.testCdf = (law, x, d1, d2) => LAW[law].cdf(x, d1, d2);

  window.testFig = function (o) {
    const lg = (typeof LANG !== 'undefined' && LANG) ? LANG : (document.documentElement.lang || 'fr'), fr = String(lg).toLowerCase().indexOf('en') !== 0, law = o.law, L = LAW[law], d1 = o.df1, d2 = o.df2, t = o.stat, side = o.side || 'B';
    const levels = (o.levels || [95]).slice();
    const pdf = x => L.pdf(x, d1, d2);
    /* valeurs critiques par niveau : [bas, haut] (null si absent) */
    const crits = levels.map((lv, i) => {
      const a = 1 - lv / 100;
      if (o.crit && o.crit[i] !== undefined && o.crit[i] !== null) {
        const c = o.crit[i];
        if (Array.isArray(c)) return c;
        if (side === 'B') return L.sym ? [-c, c] : [quant(law, a / 2, d1, d2), c];
        return side === 'L' ? [L.sym ? -c : c, null] : [null, c];
      }
      if (side === 'B') return [quant(law, a / 2, d1, d2), quant(law, 1 - a / 2, d1, d2)];
      return side === 'L' ? [quant(law, a, d1, d2), null] : [null, quant(law, 1 - a, d1, d2)];
    });
    const rejAt = cr => (cr[0] !== null && t < cr[0]) || (cr[1] !== null && t > cr[1]);
    const rej = crits.map(rejAt);
    /* échelle */
    const two = levels.length > 1, W = 680, H = two ? 280 : 262, ml = 24, mr = 24, mt = two ? 84 : 64, mb = 38;
    const all = []; crits.forEach(c => c.forEach(v => { if (v !== null) all.push(v); }));
    const cmax = Math.max.apply(null, all.map(Math.abs));
    let x0, x1;
    if (L.sym) { x1 = Math.max(4, cmax + 1.6); x0 = -x1; }
    else {
      const mean = law === 'chi2' ? d1 : (d2 > 2 ? d2 / (d2 - 2) : 1.5);
      x0 = 0; x1 = Math.max(cmax * 1.6, mean * 2.4, law === 'chi2' ? d1 + 4 * Math.sqrt(2 * d1) : 3);
      const nice = [1, 2, 2.5, 5, 10]; const p10 = Math.pow(10, Math.floor(Math.log10(x1))); x1 = nice.map(v => v * p10).find(v => v >= x1) || 10 * p10;
    }
    let ymax = 0; for (let i = 0; i <= 300; i++) { const v = x0 + (x1 - x0) * i / 300; if (!L.sym && v < (x1 - x0) * 0.02) continue; ymax = Math.max(ymax, pdf(v)); }
    ymax *= 1.08;
    const X = v => ml + (v - x0) / (x1 - x0) * (W - ml - mr), Y = v => H - mb - Math.min(Math.max(v, 0), ymax) / ymax * (H - mt - mb);
    const curve = (a, b) => { let s = ''; for (let i = 0; i <= 240; i++) { const v = a + (b - a) * i / 240; s += (i ? ' L' : 'M') + X(v).toFixed(1) + ' ' + Y(pdf(L.sym ? v : Math.max(v, 1e-9))).toFixed(1); } return s; };
    const area = (a, b, op) => `<path d="${curve(a, b)} L${X(b).toFixed(1)} ${Y(0)} L${X(a).toFixed(1)} ${Y(0)} Z" fill="#b3261e" fill-opacity="${op}"/>`;
    const MONO = `font-family="'JetBrains Mono',monospace"`, SERIF = `font-family="'Source Serif 4',Georgia,serif"`;
    const HALO = `paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"`;
    const pc = fr ? '\u00a0%' : '%', fx = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(3);
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${fr ? 'Schéma du test : zone de rejet et statistique observée' : 'Test diagram: rejection region and observed statistic'}" style="width:100%;max-width:${W}px;height:auto;display:block;margin:0 auto">`;
    /* zones de rejet : du niveau le plus large (clair) au plus strict (foncé) */
    const order = crits.map((c, i) => i).sort((i, j) => (100 - levels[j]) - (100 - levels[i]));
    order.forEach((i, r) => {
      const c = crits[i], op = order.length > 1 ? 0.18 + 0.2 * r : 0.3;
      if (c[0] !== null) s += area(x0, Math.max(x0, c[0]), op);
      if (c[1] !== null) s += area(Math.min(x1, c[1]), x1, op);
      if (!L.sym) {
        if (c[1] !== null) s += `<rect x="${X(Math.min(x1, c[1]))}" y="${Y(0) - 2.5}" width="${X(x1) - X(Math.min(x1, c[1]))}" height="5" fill="#b3261e" fill-opacity="${0.35 + 0.2 * r}"/>`;
        if (c[0] !== null) s += `<rect x="${X(x0)}" y="${Y(0) - 2.5}" width="${X(Math.max(x0, c[0])) - X(x0)}" height="5" fill="#b3261e" fill-opacity="${0.35 + 0.2 * r}"/>`;
      }
    });
    let xs = L.sym ? x0 : Math.max(x0, (x1 - x0) * 0.004);
    if (!L.sym) { while (xs < x1 && pdf(xs) > ymax) xs += (x1 - x0) / 2000; }
    s += `<path d="${curve(xs, x1)}" fill="none" stroke="#1f5fa6" stroke-width="2"/>`;
    s += `<line x1="${ml}" y1="${Y(0)}" x2="${W - mr}" y2="${Y(0)}" stroke="#8a8a8a"/>`;
    /* graduations */
    const span = x1 - x0, raw = span / 8, p10 = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(v => v * p10).find(v => v >= raw);
    for (let v = Math.ceil(x0 / step) * step; v <= x1 + 1e-9; v += step) {
      const vv = Math.round(v * 1e6) / 1e6;
      s += `<line x1="${X(vv)}" y1="${Y(0)}" x2="${X(vv)}" y2="${Y(0) + 4}" stroke="#8a8a8a"/><text x="${X(vv)}" y="${Y(0) + 17}" text-anchor="middle" ${MONO} font-size="11" fill="#5a5a5a">${vv < 0 ? '−' : ''}${Math.abs(vv)}</text>`;
    }
    /* valeurs critiques */
    crits.forEach((c, i) => {
      const a = 100 - levels[i], yl = mt - 8 - (two ? (i === 0 ? 0 : 15) : 0);
      c.forEach((v, k) => {
        if (v === null || v < x0 || v > x1) return;
        s += `<line x1="${X(v)}" y1="${Y(0)}" x2="${X(v)}" y2="${yl + 4}" stroke="#b3261e" stroke-width="1.4" stroke-dasharray="${i === 0 ? '5 4' : '2 3'}"/>`;
        s += `<text x="${X(v)}" y="${yl}" text-anchor="middle" ${MONO} font-size="11" font-weight="700" fill="#b3261e" ${HALO}>${fx(v)}${crits.length > 1 ? ` (${a}${pc})` : ''}</text>`;
      });
    });
    /* α dans la zone la plus large */
    const big = order[0], cb = crits[big], ab = 100 - levels[big];
    const aTxt = side === 'B' ? `α/2 = ${(ab / 2).toFixed(1)}${pc}` : `α = ${ab}${pc}`;
    if (cb[0] !== null && cb[0] > x0 + 0.3) s += `<text x="${X((x0 + cb[0]) / 2)}" y="${Y(0) - 26}" text-anchor="middle" ${MONO} font-size="10.5" fill="#b3261e" ${HALO}>${aTxt}</text>`;
    if (cb[1] !== null && cb[1] < x1 - 0.3) s += `<text x="${X((x1 + cb[1]) / 2)}" y="${Y(0) - 26}" text-anchor="middle" ${MONO} font-size="10.5" fill="#b3261e" ${HALO}>${aTxt}</text>`;
    const accA = cb[0] !== null ? Math.max(x0, cb[0]) : x0, accB = cb[1] !== null ? Math.min(x1, cb[1]) : x1;
    s += `<text x="${X((accA + accB) / 2)}" y="${Y(0) - 10}" text-anchor="middle" ${SERIF} font-size="11.5" fill="#1f5fa6" ${HALO}>${fr ? 'non-rejet de H₀' : 'H₀ not rejected'}</text>`;
    /* statistique observée */
    const out = t > x1 - span * 0.02 || t < x0 + span * 0.02, tx = Math.max(x0 + span * 0.02, Math.min(x1 - span * 0.02, t));
    const nr = rej.filter(Boolean).length, col = nr === 0 ? '#2e7d32' : (nr === rej.length ? '#b3261e' : '#b07d1e');
    s += `<line x1="${X(tx)}" y1="${Y(0) + 2}" x2="${X(tx)}" y2="${mt + 22}" stroke="${col}" stroke-width="2.4"/><circle cx="${X(tx)}" cy="${Y(0)}" r="4.5" fill="${col}"/>`;
    let anchor = (tx - x0) >= span / 2 ? 'start' : 'end';
    if (anchor === 'start' && X(tx) > W - mr - 160) anchor = 'end';
    if (anchor === 'end' && X(tx) < ml + 160) anchor = 'start';
    s += `<text x="${X(tx) + (anchor === 'end' ? -7 : 7)}" y="${mt + 34}" text-anchor="${anchor}" ${MONO} font-size="12.5" font-weight="700" fill="${col}" ${HALO}>${out && t < x0 ? '← ' : ''}${o.lab || 'T'} = ${fx(t)}${out && t > x1 ? ' →' : ''}</text>`;
    /* titre et verdict */
    const names = {
      t: fr ? `loi de Student à ${d1} degrés de liberté` : `Student distribution with ${d1} degrees of freedom`,
      z: fr ? 'loi normale centrée réduite' : 'standard normal distribution',
      F: fr ? `loi de Fisher à ${d1} et ${d2} degrés de liberté` : `Fisher distribution with ${d1} and ${d2} degrees of freedom`,
      chi2: fr ? `loi du χ² à ${d1} degré${d1 > 1 ? 's' : ''} de liberté` : `χ² distribution with ${d1} degree${d1 > 1 ? 's' : ''} of freedom`
    };
    const sideTxt = side === 'B' ? (fr ? 'test bilatéral' : 'two-sided test') : (side === 'L' ? (fr ? 'test unilatéral à gauche' : 'left-tailed test') : (fr ? 'test unilatéral à droite' : 'right-tailed test'));
    s += `<text x="${ml}" y="16" ${SERIF} font-size="12" fill="#5a5a5a">${names[law]} ${o.asym ? (fr ? 'sous H₀ (asymptotiquement)' : 'under H₀ (asymptotically)') : (fr ? 'sous H₀' : 'under H₀')}, ${sideTxt}</text>`;
    const al = levels.map(lv => `${100 - lv}${pc}`);
    let verdict;
    if (levels.length === 1) verdict = rej[0] ? (fr ? `H₀ rejetée au risque de ${al[0]}` : `H₀ rejected at the ${al[0]} level`) : (fr ? `H₀ non rejetée au risque de ${al[0]}` : `H₀ not rejected at the ${al[0]} level`);
    else if (nr === rej.length) verdict = fr ? `H₀ rejetée à ${al.join(' et à ')}` : `H₀ rejected at ${al.join(' and at ')}`;
    else if (nr === 0) verdict = fr ? `H₀ non rejetée à ${al.join(' ni à ')}` : `H₀ not rejected at ${al.join(' nor at ')}`;
    else verdict = fr ? `H₀ rejetée à ${al.filter((x, i) => rej[i]).join(', ')}, non rejetée à ${al.filter((x, i) => !rej[i]).join(', ')}` : `H₀ rejected at ${al.filter((x, i) => rej[i]).join(', ')}, not at ${al.filter((x, i) => !rej[i]).join(', ')}`;
    const bw = Math.min(330, 30 + verdict.length * 6.6);
    s += `<rect x="${W - mr - bw}" y="24" width="${bw}" height="22" rx="4" fill="${col}" fill-opacity="0.10" stroke="${col}" stroke-width="1"/>`;
    s += `<text x="${W - mr - bw / 2}" y="39.5" text-anchor="middle" ${SERIF} font-size="12.5" font-weight="700" fill="${col}">${verdict}</text>`;
    s += `</svg>`;
    return `<div class="fig-wrap" style="margin:1rem 0 .4rem;padding:.7rem .6rem .3rem;border:1px solid var(--border);border-radius:6px;background:#fff">${s}</div>`;
  };
})();
</script>
