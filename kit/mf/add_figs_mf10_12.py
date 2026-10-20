#!/usr/bin/env python3
import sys
sys.path.insert(0, '/home/claude/mf')
from add_figs import inject

JOBS = []

# ------------------------------------------------------------ mf10 : le prix ne dépend pas de p
JOBS.append((10, dict(fid='nop', anchor_fr='<div class="dossier-title" id="s4">', anchor_en='<div class="dossier-title" id="s4">',
cap_fr="Pourquoi la vraie probabilité \\(p\\) ne compte pas. Pour un call à une période (\\(S_0=100\\), \\(u=1{,}2\\), \\(d=0{,}8\\), \\(R=1{,}05\\), \\(K=100\\)), la barre dorée est l'espérance actualisée du gain calculée avec \\(p\\) : elle change avec le curseur. La barre bleue est le prix sans arbitrage \\(\\frac{q\\,f_u+(1-q)\\,f_d}{R}\\), avec \\(q=\\frac{R-d}{u-d}\\) : il ne bouge pas, car il est le coût du portefeuille \\((\\Delta,B)\\) qui réplique l'option dans les deux états.",
cap_en="Why the real probability \\(p\\) does not matter. For a one-period call (\\(S_0=100\\), \\(u=1.2\\), \\(d=0.8\\), \\(R=1.05\\), \\(K=100\\)), the gold bar is the discounted expected payoff computed with \\(p\\): it moves with the slider. The blue bar is the no-arbitrage price \\(\\frac{q\\,f_u+(1-q)\\,f_d}{R}\\), with \\(q=\\frac{R-d}{u-d}\\): it does not move, because it is the cost of the portfolio \\((\\Delta,B)\\) that replicates the option in both states.",
code=r"""
Object.assign(I18N.fr.f, { npP: 'Probabilité réelle <i>p</i>', npAria: 'Espérance actualisée sous p contre prix sans arbitrage',
  npRead: (p, q, naive, price, dl, B) => `<i>p</i> = ${fmt(p, 2)} : espérance actualisée <span class="v">${fmt(naive, 3)}</span> ; <i>q</i> = <span class="v">${fmt(q, 4)}</span>, prix <span class="v">${fmt(price, 3)}</span> ; portefeuille de réplication Δ = ${fmt(dl, 3)} action${dl > 1 ? 's' : ''} et emprunt de ${fmt(B, 3)}, coût ${fmt(dl * 100 - B, 3)}.` });
Object.assign(I18N.en.f, { npP: 'Real probability <i>p</i>', npAria: 'Discounted expectation under p versus no-arbitrage price',
  npRead: (p, q, naive, price, dl, B) => `<i>p</i> = ${fmt(p, 2)}: discounted expectation <span class="v">${fmt(naive, 3)}</span>; <i>q</i> = <span class="v">${fmt(q, 4)}</span>, price <span class="v">${fmt(price, 3)}</span>; replicating portfolio Δ = ${fmt(dl, 3)} share${dl > 1 ? 's' : ''} and borrowing of ${fmt(B, 3)}, cost ${fmt(dl * 100 - B, 3)}.` });
FIGS.nop = {
  state: { p: 0.5 },
  controls: L => [{ key: 'p', label: L.f.npP, min: 0.05, max: 0.95, step: 0.05, fmt: v => fmt(v, 2) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, S0 = 100, u = 1.2, d = 0.8, R = 1.05, K = 100, p = s.p, q = (R - d) / (u - d);
    const fu = Math.max(u * S0 - K, 0), fd = Math.max(d * S0 - K, 0);
    const naive = (p * fu + (1 - p) * fd) / R, price = (q * fu + (1 - q) * fd) / R;
    const dl = (fu - fd) / (S0 * (u - d)), B = (dl * d * S0 - fd) / R;
    const ps = []; for (let x = 0.05; x <= 0.951; x += 0.05) ps.push([x, (x * fu + (1 - x) * fd) / R]);
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 42, x0: 0, x1: 1, y0: 0, y1: 22 });
    P.axes({ xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 5, 10, 15, 20], xf: v => fmt(v, 2), yf: v => String(v), xl: 'p' });
    P.line(ps, { c: COL.s2, w: 1.4, dash: '4 3' });
    P.seg(0, price, 1, price, { c: COL.s1, w: 1.4, dash: '4 3' });
    P.bar(p - 0.03, 26, naive, { c: COL.s2, o: 0.9, tip: 'E_p / R' });
    P.bar(p + 0.03, 26, price, { c: COL.s1, o: 0.9, tip: 'prix' });
    P.text(p - 0.03, naive, fmt(naive, 2), { dy: -6, size: 10.5, mono: true });
    P.text(p + 0.03, price, fmt(price, 2), { dy: -6, size: 10.5, mono: true });
    P.seg(q, 0, q, 22, { c: COL.s3, w: 1, dash: '3 3' });
    P.text(q, 22, 'q = ' + fmt(q, 3), { dy: 36, dx: 6, anchor: 'start', size: 10.5, italic: true, c: COL.s3 });
    P.legend([{ c: COL.s2, t: lang === 'fr' ? 'espérance actualisée sous p' : 'discounted expectation under p', box: true }, { c: COL.s1, t: lang === 'fr' ? 'prix sans arbitrage (sous q)' : 'no-arbitrage price (under q)', box: true }], P.ml + 8, 16);
    return { svg: P.svg(L.npAria), read: L.npRead(p, q, naive, price, dl, B) };
  }
};
""")))

# ------------------------------------------------------------ mf11 : l'arbitrage attendre / exercer
JOBS.append((11, dict(fid='wait', anchor_fr='<div class="dossier-title" id="s2">', anchor_en='<div class="dossier-title" id="s2">',
cap_fr="Ce que l'on gagne et ce que l'on perd à attendre. Pour un put de prix d'exercice 100, la courbe est la différence entre la valeur d'attente (approchée par le prix du put européen de même durée restante \\(\\tau\\)) et la valeur d'exercice immédiat \\(K-S\\). Quand le cours est bas, attendre coûte : les intérêts perdus sur \\(K\\), \\(K(1-e^{-r\\tau})\\), l'emportent sur la protection contre une baisse supplémentaire. Le point où la courbe traverse zéro est le cours critique \\(S^*\\) : en dessous, on exerce. Augmentez \\(r\\) ou réduisez \\(\\sigma\\) : \\(S^*\\) monte.",
cap_en="What is gained and lost by waiting. For a put with strike 100, the curve is the difference between the continuation value (approximated by the European put price with the same remaining time \\(\\tau\\)) and the immediate exercise value \\(K-S\\). When the price is low, waiting costs money: the interest lost on \\(K\\), \\(K(1-e^{-r\\tau})\\), outweighs the protection against a further fall. The point where the curve crosses zero is the critical price \\(S^*\\): below it, one exercises. Raise \\(r\\) or lower \\(\\sigma\\): \\(S^*\\) rises.",
code=r"""
Object.assign(I18N.fr.f, { wtR: 'Taux <i>r</i>', wtSg: 'Volatilité σ', wtTau: 'Durée restante τ', wtAria: 'Valeur d\u2019attente moins valeur d\u2019exercice selon le cours',
  wtRead: (r, sg, tau, Sx) => `Pour <i>r</i> = ${fmt(100 * r, 0)} %, σ = ${fmt(100 * sg, 0)} %, τ = ${fmt(tau, 2)} : intérêts perdus en attendant <i>K</i>(1 − <i>e</i><sup>−rτ</sup>) = <span class="v">${fmt(100 * (1 - Math.exp(-r * tau)), 2)}</span> ; cours critique <i>S</i>* ≈ <span class="v">${Sx === null ? '—' : fmt(Sx, 1)}</span>.` });
Object.assign(I18N.en.f, { wtR: 'Rate <i>r</i>', wtSg: 'Volatility σ', wtTau: 'Remaining time τ', wtAria: 'Continuation value minus exercise value against the price',
  wtRead: (r, sg, tau, Sx) => `For <i>r</i> = ${fmt(100 * r, 0)}%, σ = ${fmt(100 * sg, 0)}%, τ = ${fmt(tau, 2)}: interest lost by waiting <i>K</i>(1 − <i>e</i><sup>−rτ</sup>) = <span class="v">${fmt(100 * (1 - Math.exp(-r * tau)), 2)}</span>; critical price <i>S</i>* ≈ <span class="v">${Sx === null ? '—' : fmt(Sx, 1)}</span>.` });
FIGS.wait = {
  state: { r: 0.05, sg: 0.2, tau: 1 },
  controls: L => [
    { key: 'r', label: L.f.wtR, min: 0.01, max: 0.15, step: 0.01, fmt: v => fmt(100 * v, 0) + ' %' },
    { key: 'sg', label: L.f.wtSg, min: 0.1, max: 0.6, step: 0.05, fmt: v => fmt(100 * v, 0) + ' %' },
    { key: 'tau', label: L.f.wtTau, min: 0.1, max: 2, step: 0.1, fmt: v => fmt(v, 1) }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, r = s.r, sg = s.sg, tau = s.tau, K = 100;
    const put = S => { const d1 = (Math.log(S / K) + (r + sg * sg / 2) * tau) / (sg * Math.sqrt(tau)), d2 = d1 - sg * Math.sqrt(tau); return K * Math.exp(-r * tau) * normCdf(-d2) - S * normCdf(-d1); };
    const diff = S => put(S) - Math.max(K - S, 0);
    let Sx = null; for (let S = 40; S <= 100; S += 0.1) { if (diff(S) >= 0) { Sx = S; break; } }
    const pts = []; let mn = 0, mx = 0;
    for (let S = 40; S <= 140; S += 1) { const v = diff(S); pts.push([S, v]); mn = Math.min(mn, v); mx = Math.max(mx, v); }
    mn = Math.min(mn, -K * (1 - Math.exp(-r * tau)) - 1);
    const tk = ticks(mn - 0.5, mx + 0.5, 5);
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 42, x0: 40, x1: 140, y0: tk[0], y1: tk[tk.length - 1] });
    P.axes({ xt: [40, 60, 80, 100, 120, 140], yt: tk, xf: v => String(v), yf: v => fmt(v, 1), xl: 'S', xAxisAt: 0 });
    P.clip();
    if (Sx !== null) P.add(`<rect x="${P.X(40)}" y="${P.mt}" width="${P.X(Sx) - P.X(40)}" height="${P.h - P.mt - P.mb}" fill="${COL.s3}" fill-opacity="0.08"/>`);
    P.line(pts, { c: COL.s1, w: 2.2, clip: true });
    P.seg(40, -K * (1 - Math.exp(-r * tau)), 140, -K * (1 - Math.exp(-r * tau)), { c: COL.s2, w: 1.2, dash: '5 4' });
    P.text(140, -K * (1 - Math.exp(-r * tau)), '−K(1 − e^(−rτ))', { dx: -6, dy: -6, anchor: 'end', size: 10.5, mono: true, c: COL.s2 });
    if (Sx !== null) { P.seg(Sx, tk[0], Sx, tk[tk.length - 1], { c: COL.s3, w: 1.4, dash: '4 3' }); P.text(Sx, tk[tk.length - 1], 'S* ≈ ' + fmt(Sx, 1), { dy: 12, dx: 6, anchor: 'start', size: 10.5, italic: true, c: COL.s3 }); P.text((40 + Sx) / 2, tk[tk.length - 1], lang === 'fr' ? 'exercer' : 'exercise', { dy: 30, size: 11, c: COL.s3 }); }
    P.text(120, tk[tk.length - 1], lang === 'fr' ? 'attendre' : 'wait', { dy: 30, size: 11, c: COL.s1 });
    P.legend([{ c: COL.s1, t: lang === 'fr' ? 'valeur d\u2019attente − (K − S)' : 'continuation value − (K − S)' }], P.ml + 8, 16);
    return { svg: P.svg(L.wtAria), read: L.wtRead(r, sg, tau, Sx) };
  }
};
""")))

# ------------------------------------------------------------ mf12 : loi de l'estimateur Monte-Carlo
JOBS.append((12, dict(fid='sampling', anchor_fr='<div class="dossier-title" id="s6">', anchor_en='<div class="dossier-title" id="s6">',
cap_fr="La loi de l'estimateur. On répète 300 fois l'expérience « \\(n\\) simulations, puis moyenne » pour le call de la figure 1 et l'on trace l'histogramme des 300 prix obtenus, avec la densité normale d'écart type \\(\\sigma/\\sqrt{n}\\) prévue par le théorème central limite. Multipliez \\(n\\) par 4 : la cloche se resserre d'un facteur 2 autour du prix exact (trait doré). Chaque exécution d'un programme Monte-Carlo est un tirage dans cette cloche.",
cap_en="The distribution of the estimator. The experiment “\\(n\\) simulations, then average” is repeated 300 times for the call of figure 1, and the histogram of the 300 prices obtained is drawn, with the normal density of standard deviation \\(\\sigma/\\sqrt{n}\\) predicted by the central limit theorem. Multiply \\(n\\) by 4: the bell narrows by a factor of 2 around the exact price (gold line). Each run of a Monte-Carlo program is one draw from this bell.",
code=r"""
Object.assign(I18N.fr.f, { smN: 'Simulations par expérience <i>n</i>', smSeed: 'Nouvelles expériences', smAria: 'Histogramme de 300 estimations Monte-Carlo et densité normale',
  smRead: (n, exact, m, sd, th) => `<i>n</i> = ${n} : moyenne des 300 estimations <span class="v">${fmt(m, 3)}</span> (prix exact ${fmt(exact, 3)}), écart type observé <span class="v">${fmt(sd, 3)}</span> contre σ/√<i>n</i> = ${fmt(th, 3)} attendu.` });
Object.assign(I18N.en.f, { smN: 'Simulations per experiment <i>n</i>', smSeed: 'New experiments', smAria: 'Histogram of 300 Monte-Carlo estimates and normal density',
  smRead: (n, exact, m, sd, th) => `<i>n</i> = ${n}: mean of the 300 estimates <span class="v">${fmt(m, 3)}</span> (exact price ${fmt(exact, 3)}), observed standard deviation <span class="v">${fmt(sd, 3)}</span> against σ/√<i>n</i> = ${fmt(th, 3)} expected.` });
FIGS.sampling = {
  state: { n: 400, seed: 1 },
  controls: L => [
    { key: 'n', type: 'select', numeric: true, label: L.f.smN, options: [100, 400, 1600, 6400].map(v => ({ v: v, t: 'n = ' + v })) },
    { key: 'seed', type: 'button', label: L.f.smSeed, act: s => { s.seed++; } }
  ],
  draw: function (s, lang) {
    const L = I18N[lang].f, n = s.n, M = 300, rand = localRand(5150 + 7919 * s.seed), S0 = 100, K = 100, r = 0.05, sg = 0.2, T = 1, df = Math.exp(-r * T);
    const d1 = (Math.log(S0 / K) + (r + sg * sg / 2) * T) / (sg * Math.sqrt(T)), d2 = d1 - sg * Math.sqrt(T), exact = S0 * normCdf(d1) - K * df * normCdf(d2);
    const sigX = 14.2;  /* écart type d'un gain actualisé, mesuré une fois pour toutes */
    const est = []; let sm = 0, sm2 = 0;
    for (let e = 0; e < M; e++) { let acc = 0; for (let i = 0; i < n; i++) { const ST = S0 * Math.exp((r - sg * sg / 2) * T + sg * Math.sqrt(T) * gauss(rand)); acc += df * Math.max(ST - K, 0); } const v = acc / n; est.push(v); sm += v; sm2 += v * v; }
    const m = sm / M, sd = Math.sqrt((sm2 - M * m * m) / (M - 1)), th = sigX / Math.sqrt(n);
    const x0 = exact - 4.5, x1 = exact + 4.5, nb = 36, bw = (x1 - x0) / nb, counts = new Array(nb).fill(0);
    est.forEach(v => { const b = Math.floor((v - x0) / bw); if (b >= 0 && b < nb) counts[b]++; });
    const dens = x => Math.exp(-0.5 * ((x - exact) / th) ** 2) / (th * Math.sqrt(2 * Math.PI));
    const ymax = Math.max(dens(exact) * 1.15, Math.max.apply(null, counts) / (M * bw) * 1.1);
    const P = Plot({ w: 680, h: 320, mt: 20, mb: 42, x0: x0, x1: x1, y0: 0, y1: ymax });
    P.axes({ xt: ticks(x0, x1, 6), yt: [], xf: v => fmt(v, 1), yAxis: false, xl: lang === 'fr' ? 'prix estimé' : 'estimated price' });
    counts.forEach((c, b) => P.bar(x0 + (b + 0.5) * bw, Math.max(1, (P.X(bw) - P.X(0)) - 1), c / (M * bw), { c: COL.s1, o: 0.55 }));
    P.curve(dens, x0, x1, { c: COL.s1, w: 2 }, 200);
    P.seg(exact, 0, exact, ymax, { c: COL.s2, w: 2 });
    P.text(exact, ymax, lang === 'fr' ? 'prix exact ' + fmt(exact, 2) : 'exact price ' + fmt(exact, 2), { dy: 12, dx: 6, anchor: 'start', size: 10.5, c: COL.s2 });
    P.seg(exact - th, ymax * 0.55, exact + th, ymax * 0.55, { c: COL.s3, w: 2.5 });
    P.text(exact + th, ymax * 0.55, '± σ/√n', { dx: 6, dy: 4, anchor: 'start', size: 10.5, mono: true, c: COL.s3 });
    return { svg: P.svg(L.smAria), read: L.smRead(n, exact, m, sd, th) };
  }
};
""")))

if __name__ == '__main__':
    for n, F in JOBS:
        inject(n, F['fid'], F['code'], F['cap_fr'], F['cap_en'], F['anchor_fr'], F['anchor_en'])
