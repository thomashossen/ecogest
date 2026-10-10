/* H1: Cycle de vie des immobilisations */
/* H2: Acquisition, amortissement et cession d'un actif */
PAGE.k = {
  fr: { title: "Comptabilité 2 – Cycle de vie des immobilisations",
        'k-h1': "Cycle de vie des immobilisations",
        'k-cardtitle': "Acquisition, amortissement et cession d'un actif" },
  en: { title: "Accounting 2 – Fixed-asset life cycle",
        'k-h1': "Fixed-asset life cycle",
        'k-cardtitle': "Acquisition, depreciation and disposal of an asset" }
};
Object.assign(LBL, { "Matériel industriel": "Industrial equipment", "Matériel informatique": "Computer equipment", "Amortissement du matériel": "Accumulated depreciation" });

/* ---------- montants en centimes entiers ---------- */
function eur(c) { return money(c / 100); }
function numc(c) { return num(c / 100, 2); }
function roundDiv(a, b) { return Math.floor((2 * a + b) / (2 * b)); }
function eqs(exact) { return exact ? '=' : '≈'; }
function p2(n) { return n < 10 ? '0' + n : '' + n; }
const MOIS = { fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] };
const MOIS_ABR = { fr: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] };
function mois(m) { return MOIS[LANG][m - 1]; }
function deMois(m) { return LANG === 'fr' ? ((/^[aoû]/.test(mois(m)) ? "d'" : "de ") + mois(m)) : mois(m); }
function annee(i) { return i === 0 ? 'N' : 'N+' + i; }
function fracPct(r) { const v = 100 / r, ex = Number.isInteger(v * 10); return `1/${r} ${ex ? '=' : '≈'} ${pct(v, Number.isInteger(v) ? 0 : (ex ? 1 : 2))}`; }
const ASSETS = [
  { fr: "une machine-outil à commande numérique", en: "a CNC machine tool", acc: "2154", label: "Matériel industriel" },
  { fr: "une presse hydraulique de production", en: "a hydraulic production press", acc: "2154", label: "Matériel industriel" },
  { fr: "un ensemble de serveurs de calcul", en: "a set of computing servers", acc: "2183", label: "Matériel informatique" }
];

/* ---------- plans d'amortissement ---------- */
function planLineaire(B, n, d1) {
  const A = roundDiv(B, n), rows = []; let cum = 0;
  for (let i = 0; i <= n; i++) {
    let a, days;
    if (i === 0) { days = d1; a = roundDiv(B * d1, n * 360); }
    else if (i < n) { days = 360; a = A; }
    else { days = 360 - d1; a = B - cum; }
    cum += a; rows.push({ i, days, base: B, a, cum, vnc: B - cum });
  }
  return { A, rows };
}
function planDegressif(B, n, months0) {
  const tNum = n === 5 ? 7 : 9, tDen = n === 5 ? 20 : 32, rows = [];
  let V = B, cum = 0, lin = false, switchAt = null;
  for (let i = 0; i < n; i++) {
    const rest = n - i;
    if (!lin && tDen > tNum * rest) { lin = true; switchAt = i; }
    const months = i === 0 ? months0 : 12;
    let a;
    if (!lin) a = roundDiv(V * tNum * months, tDen * 12); else a = rest === 1 ? V : roundDiv(V, rest);
    cum += a; rows.push({ i, months, vdeb: V, rest, lin, a, cum, vnc: V - a }); V -= a;
  }
  return { tNum, tDen, rows, switchAt };
}
/* VNC à la cession sans arrondi intermédiaire : sert seulement à fixer le prix de vente (stabilité des seeds) */
function vncNonArrondie(D) {
  const base = D.B / 100, n = D.n, k = D.k; let vnc = base, cumul = 0;
  if (D.lin) {
    const A = base / n;
    for (let y = 0; y <= k; y++) cumul += y === 0 ? A * D.d1 / 360 : (y === k ? A * D.dk / 360 : A);
  } else {
    const tauxDeg = (1 / n) * (n === 5 ? 1.75 : 2.25); let lin = false, rest = n;
    for (let y = 0; y <= k; y++) {
      const tl = 1 / rest; if (tl > tauxDeg) lin = true;
      let d;
      if (!lin) d = y === 0 ? vnc * tauxDeg * D.m1 / 12 : (y === k ? vnc * tauxDeg * D.mk / 12 : vnc * tauxDeg);
      else d = y === k ? vnc * tl * D.mk / 12 : vnc * tl;
      vnc -= d; cumul += d; rest--;
    }
  }
  return base - cumul;
}

PAGE.compute = function () {
  const D = {};
  D.lin = randInt(0, 1) === 0; D.install = randInt(0, 1) === 0;
  D.asset = ASSETS[randInt(0, 2)];
  D.supplier = ["MecaTech SA", "EquipPro Industries", "Fournitures Globales", "TechSolutions"][randInt(0, 3)];
  D.client = ["Ateliers Dupon", "Usines Martin", "Manufacture de l'Est"][randInt(0, 2)];
  const priceHT = randInt(200, 800) * 100, accHT = randInt(10, 50) * 100;
  D.remise = randInt(2, 5); D.n = randInt(0, 1) === 0 ? 5 : 8;
  D.acqMonth = randInt(1, 9); D.acqDay = randInt(2, 28);
  D.serviceMonth = randInt(D.acqMonth, 10);
  D.serviceDay = D.serviceMonth === D.acqMonth ? randInt(D.acqDay + 1, 28) : randInt(2, 28);
  if (D.serviceMonth === 2 && D.serviceDay > 28) { D.serviceMonth = 3; D.serviceDay = 15; }
  D.k = randInt(2, D.n - 2); D.saleMonth = randInt(2, 11); D.saleDay = randInt(2, 28);
  D.price = priceHT * 100; D.mntRemise = priceHT * D.remise; D.net = D.price - D.mntRemise; D.acc = accHT * 100;
  D.B = D.install ? D.net + D.acc : D.net; D.totalHT = D.net + D.acc;
  D.tvaImmo = D.B / 5; D.tvaAcc = D.acc / 5; D.tvaTot = D.totalHT / 5; D.ttcAcq = D.totalHT + D.tvaTot;
  const n = D.n, B = D.B, k = D.k;
  if (D.lin) {
    D.d1a = 30 - D.serviceDay + 1; D.d1b = (12 - D.serviceMonth) * 30; D.d1 = D.d1a + D.d1b;
    D.plan = planLineaire(B, n, D.d1); D.A = D.plan.A;
    D.exactA = B % n === 0; D.exact0 = (B * D.d1) % (n * 360) === 0;
    D.dk = (D.saleMonth - 1) * 30 + D.saleDay; D.dotC = roundDiv(B * D.dk, n * 360); D.exactC = (B * D.dk) % (n * 360) === 0;
    D.taux = n === 5 ? pct(20, 0) : pct(12.5, 1);
  } else {
    D.coef = num(n === 5 ? 1.75 : 2.25, 2); D.tauxDeg = n === 5 ? pct(35, 0) : (num(28.125, 3) + (LANG === 'fr' ? '\u00a0%' : '%'));
    D.m1 = 12 - D.acqMonth + 1; D.plan = planDegressif(B, n, D.m1);
    const p = D.plan, rk = p.rows[k];
    D.exact0 = (B * p.tNum * D.m1) % (p.tDen * 12) === 0;
    D.mk = D.saleMonth - 1; D.linC = rk.lin; D.restC = rk.rest; D.vdebC = rk.vdeb;
    if (!rk.lin) { D.dotC = roundDiv(rk.vdeb * p.tNum * D.mk, p.tDen * 12); D.exactC = (rk.vdeb * p.tNum * D.mk) % (p.tDen * 12) === 0; }
    else { D.dotC = roundDiv(rk.vdeb * D.mk, rk.rest * 12); D.exactC = (rk.vdeb * D.mk) % (rk.rest * 12) === 0; }
  }
  D.dotN = D.plan.rows[0].a; D.cumAvant = D.plan.rows[k - 1].cum; D.cumul = D.cumAvant + D.dotC; D.vncCession = B - D.cumul;
  D.pratique = D.plan.rows.slice(0, k).map(r => ({ i: r.i, dur: D.lin ? r.days : r.months, a: r.a, cum: r.cum, vnc: r.vnc }));
  D.pratique.push({ i: k, dur: D.lin ? D.dk : D.mk, a: D.dotC, cum: D.cumul, vnc: D.vncCession, cession: true });
  D.pct = randInt(70, 140);
  D.sale = Math.round(Number(Math.max(1000, vncNonArrondie(D) * (D.pct / 100)).toFixed(2)) * 100);
  if (Math.abs(D.sale - D.vncCession) <= 10) D.sale = D.vncCession;
  D.tvaSale = roundDiv(D.sale, 5); D.ttcSale = D.sale + D.tvaSale; D.resultat = D.sale - D.vncCession;
  D.dAcq = p2(D.acqDay) + '/' + p2(D.acqMonth); D.dServ = p2(D.serviceDay) + '/' + p2(D.serviceMonth); D.dSale = p2(D.saleDay) + '/' + p2(D.saleMonth);
  return D;
};

PAGE.context = function (D) {
  const meth = D.lin
    ? t("L'amortissement est calculé selon le mode linéaire, <em>prorata temporis</em> en jours (convention 30/360 : mois de 30 jours, année de 360 jours).", "Depreciation is computed on a straight-line basis, time-apportioned in days (30/360 convention: 30-day months, 360-day year).")
    : t("L'amortissement est calculé selon le mode dégressif, <em>prorata temporis</em> en mois entiers (pour l'exercice de cession, jusqu'au début du mois de la vente).", "Depreciation is computed on a declining-balance basis, time-apportioned in whole months (in the year of disposal, up to the start of the month of sale).");
  return t(`L'entreprise <strong>Industrie Rhône-Alpes SAS</strong> clôture son exercice le 31 décembre et est assujettie à la TVA au taux normal de 20 %. Pour développer son appareil productif, elle réalise un investissement important.<br><br><em>Règles applicables.</em> ${meth} Les frais engagés lors de l'acquisition sont analysés conformément au PCG : ils sont activés chaque fois que c'est possible.`,
           `<strong>Industrie Rhône-Alpes SAS</strong> closes its financial year on 31 December and is subject to VAT at the standard rate of 20%. To develop its production capacity, it makes a major investment.<br><br><em>Applicable rules.</em> ${meth} Costs incurred on acquisition are analysed in accordance with French GAAP: they are capitalised whenever possible.`);
};

PAGE.enonce = function (D) {
  const acc = D.install ? t("Des frais de transport et d'installation sur site", "Transport and on-site installation costs") : t("Des frais de formation du personnel à l'utilisation de cet équipement", "Staff training costs for the use of this equipment");
  const li = [
    t(`<strong class="date">Le ${D.dAcq}/N.</strong> Acquisition auprès du fournisseur <strong>${D.supplier}</strong> d'${D.asset.fr}. Le prix catalogue est de ${eur(D.price)} HT, sur lequel le fournisseur accorde une remise commerciale de ${pct(D.remise, 0)}. ${acc} sont facturés par le même fournisseur pour ${eur(D.acc)} HT. La facture est réglée le jour même par virement. La durée d'utilisation prévue est de ${D.n} ans.`,
      `<strong class="date">${D.dAcq}/N.</strong> Purchase from supplier <strong>${D.supplier}</strong> of ${D.asset.en}. The list price is ${eur(D.price)} before VAT, on which the supplier grants a trade discount of ${pct(D.remise, 0)}. ${acc} are invoiced by the same supplier for ${eur(D.acc)} before VAT. The invoice is paid the same day by bank transfer. The expected useful life is ${D.n} years.`),
    t(`<strong class="date">Le ${D.dServ}/N.</strong> Mise en service effective de l'équipement dans l'usine.`, `<strong class="date">${D.dServ}/N.</strong> The equipment is brought into use in the plant.`),
    t(`<strong class="date">Le 31/12/N.</strong> Clôture de l'exercice N : enregistrement de l'annuité d'amortissement.`, `<strong class="date">31/12/N.</strong> Close of year N: the depreciation charge is recorded.`),
    t(`<strong class="date">Le ${D.dSale}/N+${D.k}.</strong> À la suite d'un changement de stratégie technologique, l'entreprise revend l'équipement à <strong>${D.client}</strong> pour ${eur(D.sale)} HT, encaissés immédiatement par chèque. Toutes les écritures liées à la sortie de l'actif sont passées le jour même.`,
      `<strong class="date">${D.dSale}/N+${D.k}.</strong> Following a change of technological strategy, the company sells the equipment to <strong>${D.client}</strong> for ${eur(D.sale)} before VAT, received immediately by cheque. All entries relating to the disposal are recorded the same day.`)
  ];
  return head(t("Opérations réalisées au cours des exercices successifs", "Transactions over the successive years")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Présentez le plan d'amortissement de l'immobilisation, puis enregistrez au journal les écritures d'acquisition de l'année N, l'écriture d'inventaire au 31/12/N et l'ensemble des écritures de cession de l'année N+${D.k}.`,
           `Present the depreciation schedule of the asset, then record in the journal the acquisition entries of year N, the year-end entry at 31/12/N and all the disposal entries of year N+${D.k}.`));
};

/* ---------- tableaux et frises ---------- */
function tableRegles(D) {
  const lin = D.lin, on = c => c ? ' class="on"' : '';
  const rows = LANG === 'fr' ? [
    ["Point de départ", "Date de <b>mise en service</b>, c'est-à-dire le début de la consommation des avantages économiques du bien", "<b>Premier jour du mois d'acquisition</b>, quelle que soit la date de mise en service"],
    ["Décompte du temps", "En <b>jours</b>, avec des mois de 30 jours et une année de 360 jours", "En <b>mois entiers</b>, rapportés à 12"],
    ["Base de calcul", "Base amortissable (valeur d'origine), identique chaque année", "Valeur nette comptable au début de l'exercice"],
    ["Fin du plan", "Un exercice supplémentaire reçoit le reliquat de la première année : n + 1 lignes pour n années", "Aucun exercice supplémentaire : n lignes, avec passage au linéaire sur la durée restante en fin de plan"],
    ["Exercice de cession", "Du 1<sup>er</sup> janvier à la date de cession, en jours", "Du 1<sup>er</sup> janvier au début du mois de cession, en mois entiers"]
  ] : [
    ["Starting point", "Date the asset is <b>brought into use</b>, i.e. when consumption of its economic benefits begins", "<b>First day of the month of acquisition</b>, whatever the date of use"],
    ["Counting time", "In <b>days</b>, with 30-day months and a 360-day year", "In <b>whole months</b>, out of 12"],
    ["Base", "Depreciable base (original cost), the same every year", "Carrying amount at the start of the year"],
    ["End of the schedule", "One extra year receives the remainder of the first year: n + 1 lines for n years", "No extra year: n lines, switching to straight-line over the remaining life at the end"],
    ["Year of disposal", "From 1 January to the date of disposal, in days", "From 1 January to the start of the month of disposal, in whole months"]
  ];
  const hint = t(" (mode de l'énoncé)", " (method in this exercise)");
  let h = `<div class="journal-wrap"><table class="journal regle"><tr><th>${t("Règle", "Rule")}</th><th${on(lin)}>${t("Mode linéaire", "Straight-line")}${lin ? hint : ""}</th><th${on(!lin)}>${t("Mode dégressif", "Declining-balance")}${!lin ? hint : ""}</th></tr>`;
  rows.forEach(r => { h += `<tr><td class="crit">${r[0]}</td><td${on(lin)}>${r[1]}</td><td${on(!lin)}>${r[2]}</td></tr>`; });
  return h + `</table></div>`;
}
function frise(o) {
  const W = 720, H = 112, x0 = 24, bw = 640, y = 48, bh = 26, CH = 6.7;
  const px = d => Math.round((x0 + bw * d / 360) * 10) / 10, mono = `font-family="'JetBrains Mono',monospace"`;
  let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${o.aria}">`;
  s += `<rect x="${x0}" y="${y}" width="${bw}" height="${bh}" fill="#ffffff" stroke="#d4cfc4"/>`;
  s += `<rect x="${px(o.from)}" y="${y}" width="${Math.round((px(o.to) - px(o.from)) * 10) / 10}" height="${bh}" fill="#e8b84b" fill-opacity="0.45" stroke="#c9952a"/>`;
  for (let m = 0; m < 12; m++) {
    if (m > 0) s += `<line x1="${px(m * 30)}" y1="${y}" x2="${px(m * 30)}" y2="${y + bh}" stroke="#d4cfc4"/>`;
    s += `<text x="${px(m * 30 + 15)}" y="${y + bh + 16}" text-anchor="middle" ${mono} font-size="10" fill="#5a5a5a">${MOIS_ABR[LANG][m]}</text>`;
  }
  const cuts = [o.from].concat(o.marks.map(mk => mk.d).filter(d => d > o.from && d < o.to).sort((a, b) => a - b), [o.to]);
  let lx = (o.from + o.to) / 2, best = -1;
  for (let i = 0; i + 1 < cuts.length; i++) if (cuts[i + 1] - cuts[i] > best) { best = cuts[i + 1] - cuts[i]; lx = (cuts[i] + cuts[i + 1]) / 2; }
  s += `<text x="${px(lx)}" y="${y + bh / 2 + 4}" text-anchor="middle" ${mono} font-size="11" font-weight="700" fill="#0d1b2a">${o.label}</text>`;
  o.marks.forEach(function (mk) {
    const x = px(mk.d), col = mk.strong ? '#0d1b2a' : '#8a8a8a', ty = mk.row === 0 ? 14 : 31, w = mk.txt.length * CH;
    let anchor, tx;
    if (mk.row === 0 && x - 5 - w >= 4) { anchor = 'end'; tx = x - 5; } else { anchor = 'start'; tx = x + 5; }
    s += `<line x1="${x}" y1="${ty - 9}" x2="${x}" y2="${y + bh + 3}" stroke="${col}" stroke-width="${mk.strong ? 1.8 : 1.2}"${mk.strong ? '' : ' stroke-dasharray="4 3"'}/>`;
    s += `<text x="${tx}" y="${ty}" text-anchor="${anchor}" ${mono} font-size="11" font-weight="${mk.strong ? 700 : 400}" fill="${col}">${mk.txt}</text>`;
  });
  return `<div class="fig-wrap"><div class="fig-scroll">${s}</svg></div><div class="fig-cap">${o.cap}</div></div>`;
}
function friseN(D) {
  const acq = t('acquisition ', 'purchase ') + D.dAcq, mes = t('mise en service ', 'in use ') + D.dServ;
  if (D.lin) {
    const from = (D.serviceMonth - 1) * 30 + D.serviceDay - 1;
    return frise({ from, to: 360, label: D.d1 + t(' jours', ' days'), aria: t(`Exercice N : ${D.d1} jours retenus sur 360`, `Year N: ${D.d1} days out of 360`),
      marks: [{ d: (D.acqMonth - 1) * 30 + D.acqDay - 1, txt: acq, strong: false, row: 0 }, { d: from, txt: mes, strong: true, row: 1 }],
      cap: t("Exercice N, mode linéaire : le temps est compté de la mise en service au 31 décembre (zone colorée), chaque mois valant 30 jours.", "Year N, straight-line: time runs from the date of use to 31 December (shaded area), each month counting 30 days.") });
  }
  const from = (D.acqMonth - 1) * 30;
  return frise({ from, to: 360, label: D.m1 + t(' mois', ' months'), aria: t(`Exercice N : ${D.m1} mois retenus sur 12`, `Year N: ${D.m1} months out of 12`),
    marks: [{ d: (D.acqMonth - 1) * 30 + D.acqDay - 1, txt: acq, strong: true, row: 0 }, { d: (D.serviceMonth - 1) * 30 + D.serviceDay - 1, txt: mes, strong: false, row: 1 }],
    cap: t("Exercice N, mode dégressif : le mois d'acquisition est retenu en entier (zone colorée), la date de mise en service est sans effet.", "Year N, declining-balance: the whole month of acquisition counts (shaded area); the date of use is irrelevant.") });
}
function friseCession(D) {
  const ces = t('cession ', 'disposal ') + D.dSale;
  if (D.lin) return frise({ from: 0, to: D.dk, label: D.dk + t(' jours', ' days'), aria: t(`Exercice N+${D.k} : ${D.dk} jours retenus sur 360`, `Year N+${D.k}: ${D.dk} days out of 360`),
    marks: [{ d: D.dk, txt: ces, strong: true, row: 1 }],
    cap: t(`Exercice N+${D.k}, mode linéaire : le temps est compté du 1<sup>er</sup> janvier à la date de cession (zone colorée).`, `Year N+${D.k}, straight-line: time runs from 1 January to the date of disposal (shaded area).`) });
  return frise({ from: 0, to: D.mk * 30, label: D.mk + t(' mois', ' months'), aria: t(`Exercice N+${D.k} : ${D.mk} mois retenus sur 12`, `Year N+${D.k}: ${D.mk} months out of 12`),
    marks: [{ d: (D.saleMonth - 1) * 30 + D.saleDay - 1, txt: ces, strong: true, row: 1 }],
    cap: t(`Exercice N+${D.k}, mode dégressif : le temps est compté du 1<sup>er</sup> janvier au début du mois de cession (zone colorée).`, `Year N+${D.k}, declining-balance: time runs from 1 January to the start of the month of disposal (shaded area).`) });
}
function tablePlan(D) {
  const u = D.lin ? t(' j', ' d') : t(' mois', ' mo.');
  let h = `<div class="journal-wrap"><table class="journal amort">`;
  if (D.lin) {
    h += `<tr class="date-row"><td colspan="7">${t(`Plan d'amortissement linéaire sur ${D.n} ans (montants en euros)`, `Straight-line depreciation schedule over ${D.n} years (amounts in euros)`)}</td></tr>
      <tr><th>${t("Exercice", "Year")}</th><th>${t("Durée retenue", "Time counted")}</th><th>${t("Base amortissable", "Depreciable base")}</th><th>${t("Taux", "Rate")}</th><th>${t("Annuité", "Charge")}</th><th>${t("Amort. cumulés", "Accumulated")}</th><th>${t("VNC en fin d'exercice", "Carrying amount at year end")}</th></tr>`;
    D.plan.rows.forEach(r => { h += `<tr><td class="yr">${annee(r.i)}</td><td class="ctr">${r.days}${u}</td><td>${numc(r.base)}</td><td class="ctr">${D.taux}</td><td>${numc(r.a)}</td><td>${numc(r.cum)}</td><td>${numc(r.vnc)}</td></tr>`; });
  } else {
    h += `<tr class="date-row"><td colspan="8">${t(`Plan d'amortissement dégressif sur ${D.n} ans (montants en euros)`, `Declining-balance depreciation schedule over ${D.n} years (amounts in euros)`)}</td></tr>
      <tr><th>${t("Exercice", "Year")}</th><th>${t("Durée retenue", "Time counted")}</th><th>${t("VNC en début d'exercice", "Opening carrying amount")}</th><th>${t("Taux dégressif", "Declining rate")}</th><th>${t("Taux linéaire sur la durée restante", "Straight-line rate on remaining life")}</th><th>${t("Annuité", "Charge")}</th><th>${t("Amort. cumulés", "Accumulated")}</th><th>${t("VNC en fin d'exercice", "Closing carrying amount")}</th></tr>`;
    D.plan.rows.forEach(r => {
      const tdg = r.lin ? D.tauxDeg : `<b>${D.tauxDeg}</b>`, tln = r.lin ? `<b>${fracPct(r.rest)}</b>` : fracPct(r.rest);
      h += `<tr><td class="yr">${annee(r.i)}</td><td class="ctr">${r.months}${u}</td><td>${numc(r.vdeb)}</td><td class="ctr">${tdg}</td><td class="ctr">${tln}</td><td>${numc(r.a)}</td><td>${numc(r.cum)}</td><td>${numc(r.vnc)}</td></tr>`;
    });
  }
  return h + `</table></div>`;
}
function tablePratique(D) {
  const u = D.lin ? t(' j', ' d') : t(' mois', ' mo.');
  let h = `<div class="journal-wrap"><table class="journal amort"><tr class="date-row"><td colspan="5">${t(`Amortissements pratiqués jusqu'à la cession du ${D.dSale}/N+${D.k} (montants en euros)`, `Depreciation actually recorded up to the disposal on ${D.dSale}/N+${D.k} (amounts in euros)`)}</td></tr>
    <tr><th>${t("Exercice", "Year")}</th><th>${t("Durée retenue", "Time counted")}</th><th>${t("Annuité", "Charge")}</th><th>${t("Amortissements cumulés", "Accumulated depreciation")}</th><th>${t("VNC", "Carrying amount")}</th></tr>`;
  D.pratique.forEach(r => { h += `<tr${r.cession ? ' class="last"' : ''}><td class="yr">${annee(r.i)}${r.cession ? t(' (cession)', ' (disposal)') : ''}</td><td class="ctr">${r.dur}${u}</td><td>${numc(r.a)}</td><td>${numc(r.cum)}</td><td>${numc(r.vnc)}</td></tr>`; });
  return h + `</table></div>`;
}

PAGE.sol = function (D) {
  const B = D.B, n = D.n, k = D.k, lin = D.lin, cA = "28" + D.asset.acc.substring(1);
  let h = '';
  /* acquisition */
  const accTxt = D.install
    ? t("Les frais de transport et d'installation sont indispensables à la mise en état de fonctionnement de l'équipement : conformément au PCG, ils sont activés et intégrés au coût d'acquisition.", "Transport and installation costs are necessary to bring the equipment into working condition: under French GAAP they are capitalised as part of the acquisition cost.")
    : t("Les frais de formation du personnel ne sont pas directement attribuables à la mise en place de l'actif (l'équipement peut fonctionner sans que le personnel soit formé) : ils sont exclus de la base amortissable et comptabilisés en charges (6228).", "Staff training costs are not directly attributable to bringing the asset into use (the equipment can run without trained staff): they are excluded from the depreciable base and expensed (6228).");
  h += box(t(`Acquisition de l'immobilisation (${D.dAcq}/N)`, `Acquisition of the asset (${D.dAcq}/N)`),
    t(`<p>Le prix d'achat de ${eur(D.price)}, diminué de la remise de ${pct(D.remise, 0)} (${eur(D.mntRemise)}), donne un net commercial de ${eur(D.net)}. ${accTxt} La valeur d'origine, base amortissable, s'établit à ${eur(B)}.</p>`,
      `<p>The purchase price of ${eur(D.price)}, less the ${pct(D.remise, 0)} discount (${eur(D.mntRemise)}), gives a net amount of ${eur(D.net)}. ${accTxt} The original cost, which is the depreciable base, is ${eur(B)}.</p>`));
  h += D.install ? J(`${D.dAcq}/N`, [{ c: D.asset.acc, l: D.asset.label, d: B / 100 }, { c: "44562", l: "TVA déductible sur immobilisations", d: D.tvaTot / 100 }, { c: "512", l: "Banque", cr: D.ttcAcq / 100 }])
    : J(`${D.dAcq}/N`, [{ c: D.asset.acc, l: D.asset.label, d: B / 100 }, { c: "6228", l: "Divers (frais de formation)", d: D.acc / 100 }, { c: "44562", l: "TVA déductible sur immobilisations", d: D.tvaImmo / 100 }, { c: "44566", l: "TVA déductible sur autres B&S", d: D.tvaAcc / 100 }, { c: "512", l: "Banque", cr: D.ttcAcq / 100 }]);

  /* règle du prorata */
  h += box(t("La règle du prorata temporis", "The time-apportionment rule"),
    t(`<p>Amortir, c'est répartir le coût d'entrée d'un bien sur sa durée d'utilisation. Une annuité pleine correspond à douze mois d'utilisation ; or un bien entre et sort rarement du patrimoine un 1<sup>er</sup> janvier. Pour les exercices incomplets, celui de l'entrée et celui de la sortie, la dotation est réduite <em>prorata temporis</em>, en proportion du temps : elle vaut l'annuité pleine multipliée par le temps couru pendant l'exercice et divisée par la durée de l'exercice.</p><p>Trois choses se fixent avant tout calcul : la date à partir de laquelle le temps court, l'unité dans laquelle on le compte et la manière dont le plan se termine. Les réponses diffèrent selon le mode d'amortissement, comme le résume le tableau suivant.</p>`,
      `<p>Depreciating means spreading the cost of an asset over its useful life. A full annual charge corresponds to twelve months of use; yet an asset rarely enters or leaves the business on 1 January. For incomplete years, the year of entry and the year of exit, the charge is reduced <em>pro rata temporis</em>, in proportion to time: it equals the full annual charge multiplied by the time elapsed during the year and divided by the length of the year.</p><p>Three things must be settled before any computation: the date from which time runs, the unit in which it is counted and how the schedule ends. The answers differ between the two methods, as the following table summarises.</p>`));
  h += tableRegles(D);
  h += box('', t(`<p>L'énoncé impose le mode ${lin ? "linéaire" : "dégressif"} : ce sont les règles de cette colonne qui s'appliquent, une première fois à l'exercice N (année d'entrée), une seconde fois à l'exercice N+${k} (année de cession).</p>`,
                 `<p>The exercise prescribes the ${lin ? "straight-line" : "declining-balance"} method: the rules of that column apply, first to year N (year of entry), then to year N+${k} (year of disposal).</p>`));

  /* exercice N */
  if (lin) {
    h += box(t("Application à l'exercice N : décompte du temps et première annuité", "Year N: counting time and first charge"),
      t(`<p>En mode linéaire, le temps court à compter de la mise en service, le ${D.dServ}/N, et non de l'acquisition du ${D.dAcq}/N : entre ces deux dates, le bien figure à l'actif mais n'est pas encore utilisé, donc pas encore amorti. Le mois de mise en service compte pour 30 − ${D.serviceDay} + 1 = ${D.d1a} jours (du ${D.serviceDay} au 30 inclus, le jour de mise en service étant compté), auxquels s'ajoutent les ${12 - D.serviceMonth} mois entiers ${deMois(D.serviceMonth + 1)} à décembre, soit ${12 - D.serviceMonth} × 30 = ${D.d1b} jours. Le temps retenu pour l'exercice N est donc de ${D.d1a} + ${D.d1b} = ${D.d1} jours sur 360.</p><p>Le taux linéaire est 1/${n} = ${D.taux} et l'annuité pleine vaut ${eur(B)} × ${D.taux} ${eqs(D.exactA)} ${eur(D.A)}. La première annuité en est la fraction ${D.d1}/360 : ${eur(B)} × ${D.taux} × ${D.d1}/360 ${eqs(D.exact0)} ${eur(D.dotN)}.</p>`,
        `<p>Under the straight-line method, time runs from the date of use, ${D.dServ}/N, not from the purchase on ${D.dAcq}/N: between those dates the asset is on the balance sheet but not yet used, hence not yet depreciated. The month of use counts 30 − ${D.serviceDay} + 1 = ${D.d1a} days (from the ${D.serviceDay}th to the 30th inclusive, the day of use being counted), plus the ${12 - D.serviceMonth} whole months from ${mois(D.serviceMonth + 1)} to December, i.e. ${12 - D.serviceMonth} × 30 = ${D.d1b} days. Time counted for year N is therefore ${D.d1a} + ${D.d1b} = ${D.d1} days out of 360.</p><p>The straight-line rate is 1/${n} = ${D.taux} and the full annual charge is ${eur(B)} × ${D.taux} ${eqs(D.exactA)} ${eur(D.A)}. The first charge is the fraction ${D.d1}/360 of it: ${eur(B)} × ${D.taux} × ${D.d1}/360 ${eqs(D.exact0)} ${eur(D.dotN)}.</p>`));
  } else {
    const full = D.m1 === 12;
    h += box(t("Application à l'exercice N : décompte du temps et première annuité", "Year N: counting time and first charge"),
      t(`<p>En mode dégressif, le temps court à compter du premier jour du mois d'acquisition, le 1<sup>er</sup> ${mois(D.acqMonth)} N : ni le jour exact de l'acquisition (le ${D.acqDay}) ni la mise en service (le ${D.dServ}/N) n'interviennent. Le décompte se fait en mois entiers : ${deMois(D.acqMonth)} à décembre, l'exercice N compte pour ${D.m1} mois sur 12${full ? " ; l'acquisition ayant lieu en janvier, la première annuité n'est pas réduite" : ""}.</p><p>Le taux dégressif est le taux linéaire multiplié par le coefficient fiscal lié à la durée d'utilisation (1,25 pour 3 ou 4 ans, 1,75 pour 5 ou 6 ans, 2,25 au-delà) : 1/${n} × ${D.coef} = ${D.tauxDeg}. La première année, la valeur nette comptable est encore égale à la base : la première annuité vaut ${eur(B)} × ${D.tauxDeg} × ${D.m1}/12 ${eqs(D.exact0)} ${eur(D.dotN)}.</p>`,
        `<p>Under the declining-balance method, time runs from the first day of the month of acquisition, 1 ${mois(D.acqMonth)} N: neither the exact purchase day (the ${D.acqDay}th) nor the date of use (${D.dServ}/N) matters. Time is counted in whole months: from ${mois(D.acqMonth)} to December, year N counts ${D.m1} months out of 12${full ? "; as the purchase took place in January, the first charge is not reduced" : ""}.</p><p>The declining rate is the straight-line rate multiplied by the tax coefficient attached to the useful life (1.25 for 3 or 4 years, 1.75 for 5 or 6 years, 2.25 beyond): 1/${n} × ${D.coef} = ${D.tauxDeg}. In the first year the carrying amount still equals the base: the first charge is ${eur(B)} × ${D.tauxDeg} × ${D.m1}/12 ${eqs(D.exact0)} ${eur(D.dotN)}.</p>`));
  }
  h += friseN(D);

  /* plan */
  if (lin) {
    const last = D.plan.rows[n], avant = D.plan.rows[n - 1];
    h += box(t("Plan d'amortissement", "Depreciation schedule"),
      t(`<p>Le plan répartit la base de ${eur(B)} sur ${n} ans à compter de la mise en service. La première annuité étant réduite, il s'étale sur ${n + 1} exercices : N+1 à N+${n - 1} supportent chacun l'annuité pleine de ${eur(D.A)}, et N+${n} reçoit le reliquat, c'est-à-dire les 360 − ${D.d1} = ${360 - D.d1} jours non amortis en N. Cette dernière annuité s'obtient par différence, ${eur(B)} − ${eur(avant.cum)} = ${eur(last.a)}, de sorte que la valeur nette comptable soit exactement nulle en fin de plan.</p>`,
        `<p>The schedule spreads the base of ${eur(B)} over ${n} years from the date of use. As the first charge is reduced, it runs over ${n + 1} years: N+1 to N+${n - 1} each bear the full charge of ${eur(D.A)}, and N+${n} receives the remainder, i.e. the 360 − ${D.d1} = ${360 - D.d1} days not depreciated in N. That last charge is obtained by difference, ${eur(B)} − ${eur(avant.cum)} = ${eur(last.a)}, so that the carrying amount is exactly nil at the end.</p>`));
  } else {
    const s = D.plan.switchAt, rs = D.plan.rows[s];
    h += box(t("Plan d'amortissement", "Depreciation schedule"),
      t(`<p>Chaque annuité dégressive est la valeur nette comptable de début d'exercice multipliée par ${D.tauxDeg}, la première étant réduite à ${D.m1}/12. Le plan n'a pas d'exercice supplémentaire : il s'achève à la clôture de N+${n - 1}, ${n}<sup>e</sup> exercice. À chaque clôture, le taux dégressif est comparé au taux linéaire calculé sur les années restantes ; dès que ce dernier l'emporte, ici en N+${s} où ${fracPct(rs.rest)} dépasse ${D.tauxDeg}, la VNC restante est amortie par parts égales sur les ${rs.rest} exercices restants, ce qui la ramène exactement à zéro. Dans le tableau, le taux retenu figure en gras.</p>`,
        `<p>Each declining charge is the opening carrying amount multiplied by ${D.tauxDeg}, the first being reduced to ${D.m1}/12. The schedule has no extra year: it ends at the close of N+${n - 1}, the ${n}th year. At each year end, the declining rate is compared with the straight-line rate over the remaining years; as soon as the latter is higher, here in N+${s} where ${fracPct(rs.rest)} exceeds ${D.tauxDeg}, the remaining carrying amount is depreciated in equal parts over the ${rs.rest} remaining years, bringing it exactly to nil. In the table, the rate applied is in bold.</p>`));
  }
  h += tablePlan(D);

  /* inventaire N */
  h += box(t("Écriture d'inventaire au 31/12/N", "Year-end entry at 31/12/N"),
    t(`<p>L'écriture reprend la première ligne du plan : la dotation de l'exercice N est de ${eur(D.dotN)}.</p>`, `<p>The entry follows the first line of the schedule: the charge for year N is ${eur(D.dotN)}.</p>`));
  h += J("31/12/N", [{ c: "6811", l: "Dotations aux amort. sur immo. corporelles", d: D.dotN / 100 }, { c: cA, l: "Amortissement du matériel", cr: D.dotN / 100 }]);

  /* dotation complémentaire */
  const prevu = D.plan.rows[k].a;
  let detail;
  if (lin) {
    const mE = D.saleMonth - 1;
    const debut = mE === 1 ? t("le mois entier de janvier compte pour 30 jours", "the whole month of January counts 30 days")
      : t(`les ${mE} mois entiers de janvier à ${mois(D.saleMonth - 1)} comptent pour ${mE} × 30 = ${mE * 30} jours`, `the ${mE} whole months from January to ${mois(D.saleMonth - 1)} count ${mE} × 30 = ${mE * 30} days`);
    detail = t(`<p>Avant de sortir l'actif, il faut constater l'amortissement couru entre le 1<sup>er</sup> janvier N+${k} et la vente. Le plan prévoyait une annuité pleine de ${eur(prevu)}, mais le bien n'est utilisé que jusqu'à sa cession : le prorata joue une seconde fois, en jours. Du 1<sup>er</sup> janvier au ${D.dSale}, ${debut}, auxquels s'ajoutent les ${D.saleDay} jours ${deMois(D.saleMonth)} (jour de la cession compris), soit ${D.dk} jours sur 360.</p><p>La dotation complémentaire est ${eur(B)} × ${D.taux} × ${D.dk}/360 ${eqs(D.exactC)} ${eur(D.dotC)}.</p>`,
               `<p>Before derecognising the asset, the depreciation accrued between 1 January N+${k} and the sale must be recorded. The schedule provided a full charge of ${eur(prevu)}, but the asset is used only until its disposal: apportionment applies a second time, in days. From 1 January to ${D.dSale}, ${debut}, plus the ${D.saleDay} days of ${mois(D.saleMonth)} (day of disposal included), i.e. ${D.dk} days out of 360.</p><p>The additional charge is ${eur(B)} × ${D.taux} × ${D.dk}/360 ${eqs(D.exactC)} ${eur(D.dotC)}.</p>`);
  } else {
    const duree = D.mk === 1 ? t("seul le mois de janvier est retenu, soit 1 mois sur 12", "only January counts, i.e. 1 month out of 12")
      : t(`de janvier à ${mois(D.saleMonth - 1)}, on retient ${D.mk} mois sur 12`, `from January to ${mois(D.saleMonth - 1)}, ${D.mk} months out of 12 count`);
    const calcul = D.linC
      ? t(`En N+${k}, le plan est passé au linéaire sur la durée restante : le taux applicable est ${fracPct(D.restC)}, supérieur au taux dégressif de ${D.tauxDeg}. La dotation complémentaire est ${eur(D.vdebC)} × 1/${D.restC} × ${D.mk}/12 ${eqs(D.exactC)} ${eur(D.dotC)}.`, `In N+${k} the schedule has switched to straight-line over the remaining life: the applicable rate is ${fracPct(D.restC)}, above the declining rate of ${D.tauxDeg}. The additional charge is ${eur(D.vdebC)} × 1/${D.restC} × ${D.mk}/12 ${eqs(D.exactC)} ${eur(D.dotC)}.`)
      : t(`Le taux dégressif de ${D.tauxDeg} reste applicable en N+${k}. La dotation complémentaire est ${eur(D.vdebC)} × ${D.tauxDeg} × ${D.mk}/12 ${eqs(D.exactC)} ${eur(D.dotC)}.`, `The declining rate of ${D.tauxDeg} still applies in N+${k}. The additional charge is ${eur(D.vdebC)} × ${D.tauxDeg} × ${D.mk}/12 ${eqs(D.exactC)} ${eur(D.dotC)}.`);
    detail = t(`<p>Avant de sortir l'actif, il faut constater l'amortissement couru entre le 1<sup>er</sup> janvier N+${k} et la vente. Le plan prévoyait une annuité de ${eur(prevu)}, calculée sur une VNC de début d'exercice de ${eur(D.vdebC)}, mais le bien est cédé en cours d'année : le prorata joue une seconde fois. En mode dégressif, le décompte reste en mois entiers et s'arrête au début du mois de cession : ${duree}, le mois ${deMois(D.saleMonth)} n'étant pas compté.</p><p>${calcul}</p>`,
               `<p>Before derecognising the asset, the depreciation accrued between 1 January N+${k} and the sale must be recorded. The schedule provided a charge of ${eur(prevu)}, computed on an opening carrying amount of ${eur(D.vdebC)}, but the asset is sold during the year: apportionment applies a second time. Under the declining-balance method, time is still counted in whole months and stops at the start of the month of disposal: ${duree}, ${mois(D.saleMonth)} not being counted.</p><p>${calcul}</p>`);
  }
  h += box(t(`Cession, étape 1 : dotation complémentaire (${D.dSale}/N+${k})`, `Disposal, step 1: additional depreciation (${D.dSale}/N+${k})`), detail);
  h += friseCession(D);
  h += box('', t(`<p>Le tableau ci-dessous récapitule les amortissements effectivement pratiqués : les annuités de N à N+${k - 1} sont celles du plan, celle de N+${k} est la dotation complémentaire. Au 31/12/N+${k - 1}, le cumul atteignait ${eur(D.cumAvant)} ; à la date de cession, il s'élève à ${eur(D.cumAvant)} + ${eur(D.dotC)} = ${eur(D.cumul)}.</p>`,
                 `<p>The table below summarises the depreciation actually recorded: the charges from N to N+${k - 1} are those of the schedule, the charge of N+${k} is the additional one. At 31/12/N+${k - 1} the accumulated amount was ${eur(D.cumAvant)}; at the date of disposal it is ${eur(D.cumAvant)} + ${eur(D.dotC)} = ${eur(D.cumul)}.</p>`));
  h += tablePratique(D);
  h += J(`${D.dSale}/N+${k}`, [{ c: "6811", l: "Dotations aux amort. sur immo. corporelles", d: D.dotC / 100 }, { c: cA, l: "Amortissement du matériel", cr: D.dotC / 100 }]);

  /* vente */
  h += box(t(`Cession, étape 2 : facturation de la vente (${D.dSale}/N+${k})`, `Disposal, step 2: invoicing the sale (${D.dSale}/N+${k})`),
    t(`<p>La cession d'une immobilisation n'est pas du chiffre d'affaires mais un produit exceptionnel (775). Le prix hors taxes est de ${eur(D.sale)}, la TVA collectée de ${eur(D.tvaSale)} et l'encaissement de ${eur(D.ttcSale)}.</p>`,
      `<p>The disposal of a fixed asset is not revenue but exceptional income (775). The price before VAT is ${eur(D.sale)}, output VAT ${eur(D.tvaSale)} and the cash received ${eur(D.ttcSale)}.</p>`));
  h += J(`${D.dSale}/N+${k}`, [{ c: "512", l: "Banque", d: D.ttcSale / 100 }, { c: "775", l: "Produits des cessions d'éléments d'actif", cr: D.sale / 100 }, { c: "44571", l: "TVA collectée", cr: D.tvaSale / 100 }]);

  /* sortie */
  let note;
  if (D.resultat > 0) note = t(`l'opération dégage une plus-value de ${eur(D.resultat)} (prix de vente ${eur(D.sale)} − VNC ${eur(D.vncCession)}).`, `the transaction yields a gain of ${eur(D.resultat)} (sale price ${eur(D.sale)} − carrying amount ${eur(D.vncCession)}).`);
  else if (D.resultat < 0) note = t(`l'opération dégage une moins-value de ${eur(-D.resultat)} (prix de vente ${eur(D.sale)} − VNC ${eur(D.vncCession)}).`, `the transaction yields a loss of ${eur(-D.resultat)} (sale price ${eur(D.sale)} − carrying amount ${eur(D.vncCession)}).`);
  else note = t(`le prix de vente de ${eur(D.sale)} étant égal à la VNC, l'opération ne dégage ni plus-value ni moins-value.`, `as the sale price of ${eur(D.sale)} equals the carrying amount, there is neither gain nor loss.`);
  h += box(t(`Cession, étape 3 : sortie de l'actif (${D.dSale}/N+${k})`, `Disposal, step 3: derecognition (${D.dSale}/N+${k})`),
    t(`<p>L'immobilisation est retirée du bilan : le compte d'immobilisation est soldé au crédit pour la valeur d'origine, ${eur(B)}, et le compte d'amortissement au débit pour le cumul pratiqué jusqu'au jour de la vente, ${eur(D.cumul)}, lu sur la dernière ligne du tableau. La différence est la valeur nette comptable, enregistrée en charge exceptionnelle (675) : ${eur(B)} − ${eur(D.cumul)} = ${eur(D.vncCession)}. Au total, ${note}</p>`,
      `<p>The asset is removed from the balance sheet: the asset account is credited for the original cost, ${eur(B)}, and the accumulated depreciation account debited for the amount recorded up to the day of sale, ${eur(D.cumul)}, read on the last line of the table. The difference is the carrying amount, recorded as an exceptional expense (675): ${eur(B)} − ${eur(D.cumul)} = ${eur(D.vncCession)}. Overall, ${note}</p>`));
  h += J(`${D.dSale}/N+${k}`, [{ c: cA, l: "Amortissement du matériel", d: D.cumul / 100 }, { c: "675", l: "Valeurs comptables des éléments d'actif cédés", d: D.vncCession / 100 }, { c: D.asset.acc, l: D.asset.label, cr: B / 100 }]);
  return h;
};
