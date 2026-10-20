I18N.fr.k = Object.assign({}, KBASE_FR, { title: 'Économie industrielle 9 – Oligopole et fusions', 'k-h1': 'Oligopole à n firmes et fusions', 'k-coursetitle': 'Concentration, paradoxe des fusions et arbitrage entre pouvoir de marché et gains d\'efficacité', 'k-extitle': 'Fusion dans un oligopole de Cournot : rentabilité, surplus et synergies', 'k-soltitle': 'Fusion dans un oligopole de Cournot : rentabilité, surplus et synergies' });
I18N.en.k = Object.assign({}, KBASE_EN, { title: 'Industrial economics 9 – Oligopoly and mergers', 'k-h1': 'n-firm oligopoly and mergers', 'k-coursetitle': 'Concentration, the merger paradox and the trade-off between market power and efficiency gains', 'k-extitle': 'A merger in a Cournot oligopoly: profitability, surplus and synergies', 'k-soltitle': 'A merger in a Cournot oligopoly: profitability, surplus and synergies' });

/* ---------- outils : Cournot à N entreprises de coûts c_i, P = a - bQ ---------- */
function e9cournot(a, b, cs) {
  const N = cs.length, S = cs.reduce((x, y) => x + y, 0), P = (a + S) / (N + 1);
  const q = cs.map(ci => (P - ci) / b);
  return { P: P, q: q, Q: q.reduce((x, y) => x + y, 0), pi: cs.map((ci, i) => (P - ci) * q[i]) };
}

/* ---------- cours ---------- */
I18N.fr.course = String.raw`<div class="context-block">
<strong>Objectifs.</strong> À la fin de cette page, vous savez résoudre un oligopole de Cournot à \(n\) entreprises, mesurer la concentration d'un marché, montrer qu'une fusion sans gain d'efficacité est rarement rentable pour ses participants, et déterminer les gains d'efficacité nécessaires pour qu'une fusion ne nuise pas aux consommateurs.<br><br>
<strong>Pourquoi ?</strong> Les autorités de la concurrence examinent chaque année des centaines de projets de fusion. Elles doivent mettre en balance le pouvoir de marché que crée une fusion et les économies de coûts qu'elle permet : c'est exactement le calcul de cette page.<br><br>
<strong>Prérequis.</strong> Le duopole de Cournot (page 3), cartel (page 5).
</div>
<p class="toc">Sommaire : <a href="#s1">1. n entreprises</a> · <a href="#s2">2. Concentration</a> · <a href="#s3">3. Le paradoxe des fusions</a> · <a href="#s4">4. Synergies</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. À retenir</a> · <a href="#ex-anchor">Exercice corrigé</a></p>

<div class="dossier-title" id="s1">1. Cournot à n entreprises</div>
<p>Avec \(N\) entreprises de coûts marginaux \(c_i\) et une demande \(P=a-bQ\), la condition du premier ordre de l'entreprise \(i\) s'écrit \(P-c_i=bq_i\). En sommant ces \(N\) égalités, on obtient \(NP-\sum_jc_j=bQ=a-P\), d'où :
\[P^*=\frac{a+\sum_jc_j}{N+1},\qquad q_i^*=\frac{P^*-c_i}{b},\qquad\Pi_i^*=b\,(q_i^*)^2\]
Avec des entreprises identiques de coût \(c\), \(P^*=\frac{a+Nc}{N+1}\), chaque entreprise produit \(\frac{a-c}{(N+1)b}\) et gagne \(\frac{(a-c)^2}{(N+1)^2b}\).</p>

<div class="dossier-title" id="s2">2. Mesurer la concentration</div>
<p>L'indice de Herfindahl-Hirschman est la somme des carrés des parts de marché, exprimées en pourcentage : \(HHI=\sum_is_i^2\). Il vaut 10 000 pour un monopole et \(\frac{10\,000}{N}\) pour \(N\) entreprises égales. En Cournot, l'indice de Lerner moyen, pondéré par les parts de marché, est relié à la concentration : \(\sum_is_i\frac{P-c_i}{P}=\frac{HHI}{10\,000\,|\varepsilon|}\). Plus le marché est concentré, plus les marges sont élevées. Les autorités européennes et américaines s'inquiètent d'une fusion quand le HHI dépasse environ 2 000 et augmente de plus de 150 à 250 points.</p>

<div class="dossier-title" id="s3">3. Le paradoxe des fusions</div>
<p>Quand \(m\) entreprises identiques fusionnent sans gain d'efficacité, elles forment une seule entreprise, identique aux autres : il reste \(N-m+1\) entreprises. La nouvelle entité gagne \(\frac{(a-c)^2}{(N-m+2)^2b}\), alors que les \(m\) entreprises gagnaient ensemble \(m\,\frac{(a-c)^2}{(N+1)^2b}\). La fusion n'est rentable que si \((N+1)^2\ge m\,(N-m+2)^2\), ce qui exige en pratique qu'une très grande partie des entreprises fusionnent, environ 80 % (Salant, Switzer et Reynolds, 1983). La raison : l'entité fusionnée réduit sa production, mais les entreprises extérieures réagissent en augmentant la leur ; ce sont elles qui profitent le plus de la fusion.</p>
<div class="ifig" data-fig="merge"></div>
<div class="fig-cap">Figure 1 — Profit de l'entité fusionnée (bleu) comparé à la somme des profits des entreprises avant la fusion (doré), en fonction du nombre \(m\) d'entreprises qui fusionnent, pour \(N\) entreprises identiques. La fusion n'est rentable qu'à droite du point de croisement. Les entreprises extérieures, elles, gagnent toujours à la fusion.</div>

<div class="dossier-title" id="s4">4. Synergies et arbitrage de Williamson</div>
<p>Une fusion peut réduire les coûts : mutualisation de fonctions, meilleure utilisation des capacités. Si l'entité fusionnée a un coût marginal \(c_M&lt;c\), le prix devient \(P'=\frac{a+(N-m)c+c_M}{N-m+2}\). Le prix reste égal au prix d'avant la fusion si :
\[c_M=(N-m+2)\,\frac{a+Nc}{N+1}-a-(N-m)\,c\]
Au-dessous de ce seuil, la fusion fait baisser le prix et profite aux consommateurs ; au-dessus, elle les pénalise. C'est le test que mènent les autorités de la concurrence : les gains d'efficacité doivent être suffisants, vérifiables et répercutés sur les consommateurs.</p>
<div class="ifig" data-fig="synergy"></div>
<div class="fig-cap">Figure 2 — Prix après la fusion de deux entreprises sur cinq (\(P=100-Q\), \(c=40\)), en fonction du coût marginal \(c_M\) de l'entité fusionnée, comparé au prix d'avant la fusion. Les consommateurs ne sont pas lésés si \(c_M\) est inférieur au seuil marqué : la fusion doit permettre des économies de coût substantielles.</div>

<div class="dossier-title" id="s5">5. Fusions et surplus</div>
<p>Sans synergie, une fusion réduit le nombre de concurrents, fait monter le prix et baisse la production : le surplus des consommateurs diminue et la perte sèche augmente. Les profits des entreprises extérieures augmentent, celui de l'entité fusionnée peut baisser. Avec des synergies suffisantes, le prix peut baisser, et le surplus total augmenter, à la fois parce que la production augmente et parce qu'elle est réalisée à moindre coût.</p>

<div class="dossier-title" id="s6">6. À retenir</div>
<ul class="kit-simple">
<li>Cournot à \(N\) entreprises : \(P^*=\frac{a+\sum c_j}{N+1}\), \(q_i^*=\frac{P^*-c_i}{b}\).</li>
<li>HHI \(=\sum s_i^2\) ; marge moyenne \(=\frac{HHI}{10\,000\,|\varepsilon|}\).</li>
<li>Sans synergie, une fusion n'est rentable que si elle regroupe une grande part du marché ; les entreprises extérieures en sont les principales bénéficiaires.</li>
<li>Avec synergies, le prix ne monte pas si \(c_M\le(N-m+2)\frac{a+Nc}{N+1}-a-(N-m)c\).</li>
</ul>`;

I18N.en.course = String.raw`<div class="context-block">
<strong>Objectives.</strong> By the end of this page, you can solve an \(n\)-firm Cournot oligopoly, measure market concentration, show that a merger without efficiency gains is seldom profitable for its participants, and determine the efficiency gains needed for a merger not to harm consumers.<br><br>
<strong>Why?</strong> Competition authorities review hundreds of merger projects every year. They must weigh the market power a merger creates against the cost savings it allows: this is exactly the computation on this page.<br><br>
<strong>Prerequisites.</strong> The Cournot duopoly (page 3), cartel (page 5).
</div>
<p class="toc">Contents: <a href="#s1">1. n firms</a> · <a href="#s2">2. Concentration</a> · <a href="#s3">3. The merger paradox</a> · <a href="#s4">4. Synergies</a> · <a href="#s5">5. Surplus</a> · <a href="#s6">6. Key points</a> · <a href="#ex-anchor">Worked exercise</a></p>

<div class="dossier-title" id="s1">1. Cournot with n firms</div>
<p>With \(N\) firms with marginal costs \(c_i\) and demand \(P=a-bQ\), the first-order condition of firm \(i\) reads \(P-c_i=bq_i\). Summing these \(N\) equalities gives \(NP-\sum_jc_j=bQ=a-P\), hence:
\[P^*=\frac{a+\sum_jc_j}{N+1},\qquad q_i^*=\frac{P^*-c_i}{b},\qquad\Pi_i^*=b\,(q_i^*)^2\]
With identical firms with cost \(c\), \(P^*=\frac{a+Nc}{N+1}\), each firm produces \(\frac{a-c}{(N+1)b}\) and earns \(\frac{(a-c)^2}{(N+1)^2b}\).</p>

<div class="dossier-title" id="s2">2. Measuring concentration</div>
<p>The Herfindahl-Hirschman index is the sum of squared market shares, in percent: \(HHI=\sum_is_i^2\). It equals 10,000 for a monopoly and \(\frac{10\,000}{N}\) for \(N\) equal firms. Under Cournot, the average Lerner index, weighted by market shares, is linked to concentration: \(\sum_is_i\frac{P-c_i}{P}=\frac{HHI}{10\,000\,|\varepsilon|}\). The more concentrated the market, the higher the margins. European and US authorities worry about a merger when the HHI exceeds about 2,000 and rises by more than 150 to 250 points.</p>

<div class="dossier-title" id="s3">3. The merger paradox</div>
<p>When \(m\) identical firms merge without efficiency gains, they form a single firm, identical to the others: \(N-m+1\) firms remain. The new entity earns \(\frac{(a-c)^2}{(N-m+2)^2b}\), whereas the \(m\) firms together earned \(m\,\frac{(a-c)^2}{(N+1)^2b}\). The merger is only profitable if \((N+1)^2\ge m\,(N-m+2)^2\), which in practice requires a very large share of the firms to merge, about 80% (Salant, Switzer and Reynolds, 1983). The reason: the merged entity cuts its output, but outside firms respond by raising theirs; they are the ones who gain most from the merger.</p>
<div class="ifig" data-fig="merge"></div>
<div class="fig-cap">Figure 1 — Profit of the merged entity (blue) compared with the sum of the firms' profits before the merger (gold), as a function of the number \(m\) of merging firms, for \(N\) identical firms. The merger is only profitable to the right of the crossing point. Outside firms always gain from the merger.</div>

<div class="dossier-title" id="s4">4. Synergies and the Williamson trade-off</div>
<p>A merger may reduce costs: pooling of functions, better use of capacity. If the merged entity has marginal cost \(c_M&lt;c\), the price becomes \(P'=\frac{a+(N-m)c+c_M}{N-m+2}\). The price stays at its pre-merger level if:
\[c_M=(N-m+2)\,\frac{a+Nc}{N+1}-a-(N-m)\,c\]
Below this threshold, the merger lowers the price and benefits consumers; above it, it harms them. This is the test run by competition authorities: efficiency gains must be sufficient, verifiable and passed on to consumers.</p>
<div class="ifig" data-fig="synergy"></div>
<div class="fig-cap">Figure 2 — Price after a merger of two firms out of five (\(P=100-Q\), \(c=40\)), as a function of the merged entity's marginal cost \(c_M\), compared with the pre-merger price. Consumers are not harmed if \(c_M\) is below the marked threshold: the merger must allow substantial cost savings.</div>

<div class="dossier-title" id="s5">5. Mergers and surplus</div>
<p>Without synergies, a merger reduces the number of competitors, raises the price and lowers output: consumer surplus falls and the deadweight loss rises. Outside firms' profits rise; the merged entity's may fall. With sufficient synergies, the price may fall, and total surplus rise, both because output rises and because it is produced at lower cost.</p>

<div class="dossier-title" id="s6">6. Key points</div>
<ul class="kit-simple">
<li>Cournot with \(N\) firms: \(P^*=\frac{a+\sum c_j}{N+1}\), \(q_i^*=\frac{P^*-c_i}{b}\).</li>
<li>HHI \(=\sum s_i^2\); average margin \(=\frac{HHI}{10\,000\,|\varepsilon|}\).</li>
<li>Without synergies, a merger is only profitable if it gathers a large share of the market; outside firms are its main beneficiaries.</li>
<li>With synergies, the price does not rise if \(c_M\le(N-m+2)\frac{a+Nc}{N+1}-a-(N-m)c\).</li>
</ul>`;

/* ---------- figures ---------- */
I18N.fr.f = {
  N: 'Nombre d\'entreprises N', m: 'entreprises qui fusionnent m', fu: 'profit de l\'entité fusionnée', av: 'somme des profits avant fusion', mergeAria: 'Rentabilité d\'une fusion selon le nombre d\'entreprises qui fusionnent',
  mergeRead: (mm) => mm ? `La fusion devient rentable à partir de <i>m</i> = <span class="v">${mm}</span> entreprises.` : 'Aucune fusion partielle n\'est rentable ; seule la fusion de toutes les entreprises l\'est.',
  cM: 'coût marginal de l\'entité fusionnée c_M', pa: 'prix après fusion', pb: 'prix avant fusion', synAria: 'Prix après fusion selon le coût de l\'entité fusionnée',
  synRead: (th) => `Seuil : <i>c</i><sub>M</sub> = <span class="v">${fmt(th, 2)}</span> ; en dessous, la fusion fait baisser le prix.`
};
I18N.en.f = {
  N: 'Number of firms N', m: 'merging firms m', fu: 'merged entity profit', av: 'sum of pre-merger profits', mergeAria: 'Profitability of a merger by the number of merging firms',
  mergeRead: (mm) => mm ? `The merger becomes profitable from <i>m</i> = <span class="v">${mm}</span> firms.` : 'No partial merger is profitable; only the merger of all firms is.',
  cM: 'merged entity marginal cost c_M', pa: 'post-merger price', pb: 'pre-merger price', synAria: 'Post-merger price by the merged entity cost',
  synRead: (th) => `Threshold: <i>c</i><sub>M</sub> = <span class="v">${fmt(th, 2)}</span>; below it, the merger lowers the price.`
};
FIGS.merge = {
  state: { N: 6 },
  controls: L => [{ key: 'N', label: L.f.N, min: 3, max: 12, step: 1, fmt: v => String(v) }],
  draw: function (s, lang) {
    const L = I18N[lang].f, N = s.N, pre = 1 / ((N + 1) * (N + 1)), post = m => 1 / ((N - m + 2) * (N - m + 2));
    const ymax = 0.26;
    const G = Plot({ w: 680, h: 300, x0: 1.5, x1: N + 0.5, y0: 0, y1: ymax, mt: 26, mb: 42 });
    G.axes({ xt: Array.from({ length: N - 1 }, (_, k) => k + 2), yt: [0, 0.05, 0.1, 0.15, 0.2, 0.25], xl: L.m, xf: v => String(v), yf: v => fmtT(v, 2) });
    const A = [], B = []; let first = 0;
    for (let m = 2; m <= N; m++) { A.push([m, post(m)]); B.push([m, m * pre]); if (!first && post(m) >= m * pre) first = m; }
    G.line(B, { c: COL.s2, w: 2 }); B.forEach(p => G.dot(p[0], p[1], { c: COL.s2, r: 4 }));
    G.line(A, { c: COL.s1, w: 2.2 }); A.forEach(p => G.dot(p[0], p[1], { c: COL.s1, r: 4 }));
    G.legend([{ c: COL.s1, t: L.fu }, { c: COL.s2, t: L.av }], G.ml + 8, 16);
    return { svg: G.svg(L.mergeAria), read: L.mergeRead(first < N ? first : 0) };
  }
};
FIGS.synergy = {
  state: {}, controls: L => [],
  draw: function (s, lang) {
    const L = I18N[lang].f, a = 100, c = 40, N = 5, m = 2, Pb = (a + N * c) / (N + 1), th = (N - m + 2) * Pb - a - (N - m) * c;
    const G = Plot({ w: 680, h: 300, x0: 0, x1: 40, y0: 45, y1: 55, mt: 26, mb: 42 });
    G.axes({ xt: [0, 10, 20, 30, 40], yt: [46, 48, 50, 52, 54], xl: L.cM, xf: v => String(v), yf: v => String(v) });
    G.clip();
    G.line([[0, (a + (N - m) * c) / (N - m + 2)], [40, (a + (N - m) * c + 40) / (N - m + 2)]], { c: COL.s1, w: 2.4, clip: true });
    G.line([[0, Pb], [40, Pb]], { c: COL.s2, w: 1.8, dash: '6 4' });
    G.seg(th, 45, th, Pb, { c: COL.s3, w: 1.4, dash: '3 3' }); G.dot(th, Pb, { c: COL.s3, r: 6 });
    G.legend([{ c: COL.s1, t: L.pa }, { c: COL.s2, dash: '6 4', t: L.pb }], G.ml + 8, 16);
    return { svg: G.svg(L.synAria), read: L.synRead(th) };
  }
};

/* ---------- exercice ---------- */
PAGE.compute = function (seed) {
  initRand(seed);
  const D = { seed: seed };
  for (;;) {
    D.a = pick([60, 100, 120, 160, 200]); D.b = pick([0.5, 1, 2]); D.c = pick([10, 20, 30, 40]); D.N = rint(4, 7); D.m = pick([2, 3]);
    if (D.c >= D.a / 2) continue;
    const a = D.a, b = D.b, c = D.c, N = D.N, m = D.m;
    D.pre = e9cournot(a, b, Array(N).fill(c));
    D.post = e9cournot(a, b, Array(N - m + 1).fill(c));
    D.Pb = D.pre.P; D.th = (N - m + 2) * D.Pb - a - (N - m) * c;
    if (D.th < 6) continue;
    let ok = false;
    for (const o of shuffle([-8, -4, 4, 8, -2, 2])) { D.cM = Math.round(D.th + o); D.syn = e9cournot(a, b, [D.cM].concat(Array(N - m).fill(c))); if (D.cM > 0 && D.cM < c && D.syn.q.every(v => v > 0.1)) { ok = true; break; } }
    if (ok) break;
  }
  const a = D.a, b = D.b, c = D.c, N = D.N, m = D.m;
  const S = (R, costs) => { const SC = b * R.Q * R.Q / 2, SP = R.pi.reduce((x, y) => x + y, 0); return { SC: SC, SP: SP, W: SC + SP }; };
  D.Spre = S(D.pre); D.Spost = S(D.post); D.Ssyn = S(D.syn);
  D.Wc = b * ((a - c) / b) ** 2 / 2;
  D.HHIpre = 10000 / N; D.HHIpost = 10000 / (N - m + 1);
  return D;
};
I18N.fr.ex = function (D) {
  return String.raw`<div class="context-block">Un marché de demande inverse \(P(Q)=${D.a}-${cfx(D.b)}Q\) est servi par \(N=${D.N}\) entreprises identiques, de coût marginal constant \(c=${D.c}\), sans coût fixe, qui se font concurrence à la Cournot.</div>
<div class="questions"><ol>
<li><div class="q-text">Déterminez l'équilibre de Cournot : quantité de chaque entreprise, production totale, prix et profits. Calculez l'indice de Herfindahl-Hirschman.</div></li>
<li><div class="q-text">Calculez, à l'aide d'intégrales, le surplus des consommateurs, le surplus des producteurs, le surplus total et la perte sèche.</div></li>
<li><div class="q-text">${D.m} entreprises fusionnent, sans gain d'efficacité. Déterminez le nouvel équilibre. La fusion est-elle rentable pour les entreprises qui fusionnent ? Pour les autres ?</div></li>
<li><div class="q-text">Calculez les surplus après la fusion et comparez. Comment évolue le HHI ?</div></li>
<li><div class="q-text">On suppose maintenant que la fusion réduit le coût marginal de l'entité fusionnée à \(c_M\). Quelle valeur de \(c_M\) laisse le prix inchangé ? Avec \(c_M=${D.cM}\), déterminez le nouvel équilibre et les surplus, et dites si la fusion doit être autorisée du point de vue des consommateurs.</div></li>
<li><div class="q-text">Représentez graphiquement les surplus avant la fusion, puis après la fusion avec synergies.</div></li>
</ol></div>`;
};
I18N.en.ex = function (D) {
  return String.raw`<div class="context-block">A market with inverse demand \(P(Q)=${D.a}-${cfx(D.b)}Q\) is served by \(N=${D.N}\) identical firms, with constant marginal cost \(c=${D.c}\) and no fixed cost, competing à la Cournot.</div>
<div class="questions"><ol>
<li><div class="q-text">Determine the Cournot equilibrium: each firm's quantity, total output, price and profits. Compute the Herfindahl-Hirschman index.</div></li>
<li><div class="q-text">Compute, using integrals, consumer surplus, producer surplus, total surplus and the deadweight loss.</div></li>
<li><div class="q-text">${D.m} firms merge, without efficiency gains. Determine the new equilibrium. Is the merger profitable for the merging firms? For the others?</div></li>
<li><div class="q-text">Compute the surpluses after the merger and compare. How does the HHI change?</div></li>
<li><div class="q-text">Now assume the merger lowers the merged entity's marginal cost to \(c_M\). Which value of \(c_M\) leaves the price unchanged? With \(c_M=${D.cM}\), determine the new equilibrium and the surpluses, and say whether the merger should be cleared from the consumers' point of view.</div></li>
<li><div class="q-text">Draw the surpluses before the merger, then after the merger with synergies.</div></li>
</ol></div>`;
};
function e9sol(D, lang) {
  const fr = lang === 'fr', T_ = s => fr ? s[0] : s[1], a = D.a, b = D.b, c = D.c, N = D.N, mm = D.m, n4 = x => texT(x, 4), m2 = x => texT(x, 2);
  const SC = T_(['SC', 'CS']), SP = T_(['SP', 'PS']), PS = T_(['PS', 'DWL']), bx = b === 1 ? '' : texT(b, 2) + '\\times ';
  const pre = D.pre, post = D.post, syn = D.syn, K = N - mm + 1;
  const scI = R => String.raw`\int_0^{${n4(R.Q)}}\big(${a}-${cfx(b)}q-${n4(R.P)}\big)\,dq=\Big[${n4(a - R.P)}\,q-${cfx(b / 2)}q^2\Big]_0^{${n4(R.Q)}}=${m2(b * R.Q * R.Q / 2)}`;
  const outQ = syn.q.slice(1).reduce((x, y) => x + y, 0);
  return String.raw`<div class="st"><ol>
<li><div class="q-content">
  <p>${T_(['Chaque entreprise', 'Each firm'])} \(i\) ${T_(['maximise', 'maximises'])} \(\Pi_i=(${a}-${cfx(b)}Q)\,q_i-${c}\,q_i\), ${T_(['où', 'where'])} \(Q\) ${T_(['inclut sa propre production. En annulant la dérivée par rapport à', 'includes its own output. Setting the derivative with respect to'])} \(q_i\)${T_(['', ' to zero'])} :
  \[${a}-${cfx(b)}Q-${cfx(b)}q_i-${c}=0\iff P-${c}=${cfx(b)}q_i\]
  ${T_(['Toutes les entreprises étant identiques, elles produisent la même quantité', 'All firms being identical, they produce the same quantity'])} \(q\), ${T_(['et', 'and'])} \(Q=${N}\,q\). ${T_(['En reportant dans la condition du premier ordre :', 'Substituting into the first-order condition:'])}
  \[${a}-${cfx(b)}\times ${N}\,q-${cfx(b)}q-${c}=0\iff q^*=\frac{${a}-${c}}{${N + 1}\times ${texT(b, 2)}}=${n4(pre.q[0])}\qquad Q^*=${N}\times ${n4(pre.q[0])}=${n4(pre.Q)}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le prix d\'équilibre sur le marché :', 'The inverse demand function then gives the equilibrium market price:'])} \(P^*=${a}-${bx}${n4(pre.Q)}=${n4(pre.P)}\). ${T_(['Chaque entreprise gagne', 'Each firm earns'])} \(\Pi^*=(${n4(pre.P)}-${c})\times ${n4(pre.q[0])}=${m2(pre.pi[0])}\). ${T_(['Chaque part de marché vaut', 'Each market share is'])} \(\frac{100}{${N}}\,\%\), ${T_(['d\'où', 'hence'])} \(HHI=${N}\times\big(\frac{100}{${N}}\big)^2=${m2(D.HHIpre)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Le surplus des consommateurs est l\'intégrale de l\'écart entre la demande inverse et le prix ; le surplus des producteurs est l\'intégrale de l\'écart entre le prix et le coût marginal, égal à la somme des profits :', 'Consumer surplus is the integral of the gap between inverse demand and the price; producer surplus is the integral of the gap between the price and marginal cost, equal to the sum of profits:'])}
  \[\begin{aligned}${SC}&amp;=${scI(pre)}\\${SP}&amp;=\int_0^{${n4(pre.Q)}}(${n4(pre.P)}-${c})\,dq=${m2(D.Spre.SP)}\end{aligned}\]
  ${T_(['Le surplus total vaut', 'Total surplus is'])} \(W=${m2(D.Spre.W)}\). ${T_(['Le maximum, atteint au prix', 'The maximum, reached at price'])} \(c\), ${T_(['est', 'is'])} \(\int_0^{${n4((a - c) / b)}}(${a}-${cfx(b)}q-${c})\,dq=${m2(D.Wc)}\), ${T_(['d\'où une perte sèche', 'hence a deadweight loss'])} \(${PS}=${m2(D.Wc - D.Spre.W)}\).</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Après la fusion, il reste', 'After the merger,'])} \(${K}\) ${T_(['entreprises identiques. Le même raisonnement donne :', 'identical firms remain. The same reasoning gives:'])}
  \[q'=\frac{${a}-${c}}{${K + 1}\times ${texT(b, 2)}}=${n4(post.q[0])}\qquad Q'=${K}\times ${n4(post.q[0])}=${n4(post.Q)}\]
  ${T_(['On en déduit, d\'après la fonction de demande inverse, le nouveau prix :', 'The inverse demand function then gives the new price:'])} \(P'=${a}-${bx}${n4(post.Q)}=${n4(post.P)}\), ${T_(['puis le profit de chaque entreprise, y compris l\'entité fusionnée :', 'then each firm\'s profit, including the merged entity:'])} \(\Pi'=(${n4(post.P)}-${c})\times ${n4(post.q[0])}=${m2(post.pi[0])}\).</p>
  <p>${T_(['Avant la fusion, les', 'Before the merger, the'])} ${mm} ${T_(['entreprises gagnaient ensemble', 'firms earned together'])} \(${mm}\times ${m2(pre.pi[0])}=${m2(mm * pre.pi[0])}\). ${post.pi[0] >= mm * pre.pi[0] ? T_(['L\'entité fusionnée gagne davantage : la fusion est rentable.', 'The merged entity earns more: the merger is profitable.']) : T_(['L\'entité fusionnée gagne moins : la fusion n\'est pas rentable pour ses participants. C\'est le paradoxe des fusions : l\'entité fusionnée réduit sa production, mais les autres entreprises augmentent la leur.', 'The merged entity earns less: the merger is not profitable for its participants. This is the merger paradox: the merged entity cuts its output, but the other firms raise theirs.'])} ${T_(['Chaque entreprise extérieure passe de', 'Each outside firm goes from'])} \(${m2(pre.pi[0])}\) ${T_(['à', 'to'])} \(${m2(post.pi[0])}\) : ${T_(['elle profite de la fusion.', 'it benefits from the merger.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Les mêmes intégrales, au nouveau prix et à la nouvelle production, donnent :', 'The same integrals, at the new price and output, give:'])}
  \[\begin{aligned}${SC}'&amp;=${scI(post)}\\${SP}'&amp;=\int_0^{${n4(post.Q)}}(${n4(post.P)}-${c})\,dq=${m2(D.Spost.SP)}\end{aligned}\]
  ${T_(['Le surplus des consommateurs baisse de', 'Consumer surplus falls by'])} \(${m2(D.Spre.SC - D.Spost.SC)}\), ${T_(['celui des producteurs augmente de', 'producer surplus rises by'])} \(${m2(D.Spost.SP - D.Spre.SP)}\), ${T_(['et le surplus total baisse de', 'and total surplus falls by'])} \(${m2(D.Spre.W - D.Spost.W)}\) : ${T_(['la perte sèche augmente. Le HHI passe de', 'the deadweight loss rises. The HHI goes from'])} \(${m2(D.HHIpre)}\) ${T_(['à', 'to'])} \(\frac{10\,000}{${K}}=${m2(D.HHIpost)}\), ${T_(['une hausse de', 'an increase of'])} \(${m2(D.HHIpost - D.HHIpre)}\) ${T_(['points.', 'points.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Avec', 'With'])} \(${N - mm}\) ${T_(['entreprises au coût', 'firms at cost'])} ${c} ${T_(['et l\'entité fusionnée au coût', 'and the merged entity at cost'])} \(c_M\), ${T_(['la somme des conditions du premier ordre donne', 'summing the first-order conditions gives'])} \(P'=\frac{${a}+${N - mm}\times ${c}+c_M}{${K + 1}}\). ${T_(['Le prix est inchangé si cette expression vaut', 'The price is unchanged if this expression equals'])} \(${n4(D.Pb)}\) :
  \[\frac{${a}+${(N - mm) * c}+c_M}{${K + 1}}=${n4(D.Pb)}\iff c_M=${K + 1}\times ${n4(D.Pb)}-${a}-${(N - mm) * c}=${n4(D.th)}\]
  ${T_(['Avec', 'With'])} \(c_M=${D.cM}\), ${T_(['le prix devient', 'the price becomes'])} \(P''=\frac{${a}+${(N - mm) * c}+${D.cM}}{${K + 1}}=${n4(syn.P)}\). ${T_(['Chaque entreprise produit', 'Each firm produces'])} \(q_i=\frac{P''-c_i}{${texT(b, 2)}}\) : ${T_(['l\'entité fusionnée', 'the merged entity'])} \(${n4(syn.q[0])}\), ${T_(['chaque autre entreprise', 'each other firm'])} \(${n4(syn.q[1])}\), ${T_(['soit une production totale', 'a total output of'])} \(${n4(syn.Q)}\). ${T_(['Les surplus valent', 'Surpluses are'])} \(${SC}''=\frac{${texT(b, 2)}}{2}\times ${n4(syn.Q)}^2=${m2(D.Ssyn.SC)}\) ${T_(['et', 'and'])} \(${SP}''=\int_0^{${n4(syn.q[0])}}(${n4(syn.P)}-${D.cM})\,dq+${N - mm}\int_0^{${n4(syn.q[1])}}(${n4(syn.P)}-${c})\,dq=${m2(D.Ssyn.SP)}\), ${T_(['soit un surplus total de', 'that is, a total surplus of'])} \(${m2(D.Ssyn.W)}\).</p>
  <p>${D.cM <= D.th ? T_(['Comme', 'Since']) + ' \\(c_M\\le' + n4(D.th) + '\\), ' + T_(['le prix baisse et le surplus des consommateurs augmente par rapport à la situation avant fusion : du point de vue des consommateurs, la fusion peut être autorisée.', 'the price falls and consumer surplus rises compared with the pre-merger situation: from the consumers\' point of view, the merger can be cleared.']) : T_(['Comme', 'Since']) + ' \\(c_M&gt;' + n4(D.th) + '\\), ' + T_(['le prix augmente et le surplus des consommateurs baisse par rapport à la situation avant fusion : les synergies ne suffisent pas, la fusion ne devrait pas être autorisée en l\'état.', 'the price rises and consumer surplus falls compared with the pre-merger situation: synergies are not enough, the merger should not be cleared as it stands.'])}</p>
</div></li>
<li><div class="q-content">
  <p>${T_(['Avant la fusion, toutes les entreprises vendent au même coût :', 'Before the merger, all firms sell at the same cost:'])}</p>
  ${eiSurplusFig({ lang: lang, a: a, b: b, P: pre.P, Q: pre.Q, cmin: c, seg: [[0, pre.Q, c]], label: 'E', aria: 'pre' })}
  <p>${T_(['Après la fusion avec synergies, l\'entité fusionnée produit les', 'After the merger with synergies, the merged entity produces the first'])} \(${n4(syn.q[0])}\) ${T_(['premières unités au coût', 'units at cost'])} \(${D.cM}\) ${T_(['(rectangle vert foncé), les autres entreprises le reste au coût', '(dark green rectangle), the other firms the rest at cost'])} ${c} :</p>
  ${eiSurplusFig({ lang: lang, a: a, b: b, P: syn.P, Q: syn.Q, cmin: Math.min(c, D.cM), seg: [[0, syn.q[0], D.cM], [syn.q[0], syn.Q, c]], costs: [c, D.cM], label: 'E″', aria: 'post' })}
</div></li>
</ol></div>`;
}
I18N.fr.sol = D => e9sol(D, 'fr');
I18N.en.sol = D => e9sol(D, 'en');
