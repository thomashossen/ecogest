/* H1: Importation, subvention et perte de change */
/* H2: Acquisition d'une immobilisation importée */
PAGE.k = {
  fr: { title: "Comptabilité 9 – Importation, subvention et change",
        'k-h1': "Importation, subvention et perte de change",
        'k-cardtitle': "Acquisition d'une immobilisation importée" },
  en: { title: "Accounting 9 – Import, grant and foreign exchange",
        'k-h1': "Import, investment grant and foreign-exchange loss",
        'k-cardtitle': "Acquisition of an imported fixed asset" }
};
LBL["Matériel industriel"] = "Industrial equipment";
LBL["Amortissement du matériel industriel"] = "Accumulated depreciation, industrial equipment";
const FIRMS = ["MetalTrans Industries SAS", "Norditech SAS", "AtlasFab SAS", "Précisia Manufacturing SAS"];
const ASSETS = [{ fr: "une machine-outil à commande numérique", en: "a CNC machine tool" }, { fr: "une presse hydraulique de production", en: "a hydraulic production press" }, { fr: "une ligne d'assemblage robotisée", en: "a robotised assembly line" }];
const CUR = [
  { fr: "dollar américain", en: "US dollar", sym: "$", cfr: "un fournisseur établi aux États-Unis", cen: "a supplier based in the United States", names: ["TechFab Industries", "Global Machining Corp", "Precision Systems Inc."], lo: 0.90, hi: 0.97 },
  { fr: "franc suisse", en: "Swiss franc", sym: "CHF", cfr: "un fournisseur établi en Suisse", cen: "a supplier based in Switzerland", names: ["AlpinTech SA", "Helvetia Machines AG", "SwissPrecision SA"], lo: 1.02, hi: 1.09 },
  { fr: "livre sterling", en: "pound sterling", sym: "£", cfr: "un fournisseur établi au Royaume-Uni", cen: "a supplier based in the United Kingdom", names: ["British Engineering Ltd", "Sterling Industrial plc", "Northgate Machinery Ltd"], lo: 1.13, hi: 1.20 }
];
const MOIS = { fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] };
function p2(n) { return n < 10 ? '0' + n : '' + n; }
function dateTxt(d, m) { return t(`${d === 1 ? '1<sup>er</sup>' : d} ${MOIS.fr[m - 1]} N`, `${d} ${MOIS.en[m - 1]} N`); }
function dateNum(d, m) { return `${p2(d)}/${p2(m)}/N`; }
function fx(x, sym) { return num(x, 2) + '\u00a0' + sym; }
function rate(x) { return x.toLocaleString(I18N[LANG].locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); }

PAGE.compute = function () {
  const D = {};
  D.firm = pick(FIRMS); D.asset = pick(ASSETS); D.cur = pick(CUR); D.sup = pick(D.cur.names);
  D.m = randInt(2, 8); D.d1 = randInt(1, 12); D.d2 = Math.min(D.d1 + randInt(5, 10), 27); D.d3 = Math.min(D.d2 + randInt(3, 8), 28);
  D.mEnc = Math.min(D.m + randInt(1, 3), 11); D.dEnc = randInt(5, 25);
  D.fxAmt = randInt(30, 90) * 1000;
  D.c1 = Math.round((D.cur.lo + random() * (D.cur.hi - D.cur.lo)) * 10000) / 10000;
  D.ht = r2(D.fxAmt * D.c1);
  D.duty = randInt(5, 20) * 100; D.custVal = r2(D.ht + D.duty); D.tva = r2(D.custVal * 0.2); D.cost = D.custVal;
  D.subRate = randInt(2, 5) * 10; D.sub = r2(D.cost * D.subRate / 100);
  D.life = [4, 5, 6, 8][randInt(0, 3)]; D.annuity = r2(D.cost / D.life);
  D.daysMonth = 30 - D.d2 + 1; D.days = D.daysMonth + (12 - D.m) * 30; D.dot = r2(D.cost / D.life * D.days / 360);
  D.subRep = r2(D.dot * D.subRate / 100);
  D.c2 = Math.round(D.c1 * (1 + randInt(30, 80) / 1000) * 10000) / 10000;
  D.debt2 = r2(D.fxAmt * D.c2); D.loss = r2(D.debt2 - D.ht);
  return D;
};

PAGE.context = function (D) {
  return t(`La société <strong>${D.firm}</strong>, assujettie à la TVA au taux normal de 20 % et dont l'exercice coïncide avec l'année civile, acquiert ${D.asset.fr} auprès de <strong>${D.sup}</strong>, ${D.cur.cfr}. La facture est libellée en ${D.cur.fr}s et doit être convertie en euros au cours du jour de chaque opération. Le Conseil régional accorde à l'entreprise une subvention d'équipement pour financer une partie de cette acquisition.`,
           `<strong>${D.firm}</strong>, subject to VAT at the standard rate of 20% and whose financial year matches the calendar year, acquires ${D.asset.en} from <strong>${D.sup}</strong>, ${D.cur.cen}. The invoice is denominated in ${D.cur.en}s and must be converted into euros at the spot rate of each transaction. The regional council grants the company an equipment grant to finance part of this acquisition.`);
};

PAGE.enonce = function (D) {
  const li = [
    t(`<strong class="date">Le ${dateTxt(D.d1, D.m)}.</strong> Réception de la facture de ${D.sup} pour ${D.asset.fr} : ${fx(D.fxAmt, D.cur.sym)}. Cours du jour : 1 ${D.cur.fr} = ${rate(D.c1)} €.`,
      `<strong class="date">${dateTxt(D.d1, D.m)}.</strong> Receipt of the invoice from ${D.sup} for ${D.asset.en}: ${fx(D.fxAmt, D.cur.sym)}. Spot rate: 1 ${D.cur.en} = €${rate(D.c1)}.`),
    t(`<strong class="date">Le ${dateTxt(D.d2, D.m)}.</strong> Dédouanement du matériel. Les droits de douane, ${money(D.duty)}, sont réglés comptant par virement. La mise en service a lieu le jour même ; l'entreprise amortit le bien en linéaire sur ${D.life} ans.`,
      `<strong class="date">${dateTxt(D.d2, D.m)}.</strong> Customs clearance. Customs duties of ${money(D.duty)} are paid immediately by bank transfer. The asset is brought into use the same day; the company depreciates it on a straight-line basis over ${D.life} years.`),
    t(`<strong class="date">Le ${dateTxt(D.d3, D.m)}.</strong> Notification par le Conseil régional d'une subvention d'équipement égale à ${pct(D.subRate, 0)} du coût d'acquisition. L'entreprise opte pour l'étalement de la subvention sur la durée d'utilisation du bien.`,
      `<strong class="date">${dateTxt(D.d3, D.m)}.</strong> The regional council notifies an equipment grant equal to ${pct(D.subRate, 0)} of the acquisition cost. The company elects to spread the grant over the useful life of the asset.`),
    t(`<strong class="date">Le ${dateTxt(D.dEnc, D.mEnc)}.</strong> Encaissement de la subvention sur le compte bancaire.`,
      `<strong class="date">${dateTxt(D.dEnc, D.mEnc)}.</strong> The grant is received in the bank account.`),
    t(`<strong class="date">Le 31 décembre N.</strong> La facture de ${D.sup} n'est pas encore réglée. Cours de clôture : 1 ${D.cur.fr} = ${rate(D.c2)} €. Réévaluez la dette et constatez, le cas échéant, la provision correspondante.`,
      `<strong class="date">31 December N.</strong> The invoice from ${D.sup} is still unpaid. Closing rate: 1 ${D.cur.en} = €${rate(D.c2)}. Remeasure the liability and, if necessary, book the corresponding provision.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Travaux d'inventaire courants : dotation aux amortissements de l'exercice et reprise de la quote-part de subvention correspondante.`,
      `<strong class="date">31 December N.</strong> Routine year-end work: depreciation charge for the year and release of the matching share of the grant.`)
  ];
  return head(t("Opérations réalisées au cours de l'exercice N, par ordre chronologique", "Transactions of year N, in chronological order")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez au journal l'ensemble de ces opérations, de la réception de la facture aux écritures d'inventaire du 31 décembre N.`,
           `Record all these transactions in the journal, from receipt of the invoice to the year-end entries of 31 December N.`));
};

PAGE.sol = function (D) {
  let h = '';
  const A = "Matériel industriel";
  h += box(t(`Réception de la facture (${dateNum(D.d1, D.m)})`, `Receipt of the invoice (${dateNum(D.d1, D.m)})`),
    t(`<p>La facture est libellée en devise : on la convertit au cours du jour, ${fx(D.fxAmt, D.cur.sym)} × ${rate(D.c1)} = ${money(D.ht)}. L'immobilisation est enregistrée à ce coût d'entrée et la dette envers le fournisseur d'immobilisations (404) pour le même montant. Aucune TVA n'apparaît à ce stade : sur une importation, elle n'est exigible qu'au dédouanement.</p>`,
      `<p>The invoice is in foreign currency: it is converted at the spot rate, ${fx(D.fxAmt, D.cur.sym)} × ${rate(D.c1)} = ${money(D.ht)}. The asset is recorded at this cost and the liability towards the supplier of fixed assets (404) for the same amount. No VAT appears yet: on an import, VAT only becomes due at customs clearance.</p>`));
  h += J(dateNum(D.d1, D.m), [{ c: "2154", l: A, d: D.ht }, { c: "404", l: "Fournisseurs d'immobilisations", cr: D.ht }]);

  h += box(t(`Dédouanement (${dateNum(D.d2, D.m)})`, `Customs clearance (${dateNum(D.d2, D.m)})`),
    t(`<p>Les importations supportent la TVA française, calculée sur la valeur en douane : prix converti augmenté des droits de douane, ${money(D.ht)} + ${money(D.duty)} = ${money(D.custVal)}, d'où une TVA déductible sur immobilisations de ${money(D.tva)}, due à la douane (443). Les droits de douane, frais directement attribuables, s'ajoutent au coût d'acquisition : la base amortissable est donc de ${money(D.cost)}.</p>`,
      `<p>Imports bear French VAT, computed on the customs value: converted price plus customs duties, ${money(D.ht)} + ${money(D.duty)} = ${money(D.custVal)}, giving deductible VAT on fixed assets of ${money(D.tva)}, owed to customs (443). Customs duties, as directly attributable costs, are added to the acquisition cost: the depreciable base is therefore ${money(D.cost)}.</p>`));
  h += J(dateNum(D.d2, D.m), [{ c: "2154", l: A, d: D.duty }, { c: "44562", l: "État – TVA sur immobilisations", d: D.tva }, { c: "512", l: "Banque", cr: D.duty }, { c: "443", l: "Opérations particulières avec l'État", cr: D.tva }]);

  h += box(t(`Notification de la subvention (${dateNum(D.d3, D.m)})`, `Notification of the grant (${dateNum(D.d3, D.m)})`),
    t(`<p>La subvention s'élève à ${pct(D.subRate, 0)} × ${money(D.cost)} = ${money(D.sub)}. L'entreprise ayant opté pour l'étalement, elle est inscrite en capitaux propres (131) dès la notification, avant même l'encaissement, en contrepartie d'une créance sur l'État (441).</p>`,
      `<p>The grant amounts to ${pct(D.subRate, 0)} × ${money(D.cost)} = ${money(D.sub)}. As the company has elected to spread it, the grant is recognised in equity (131) upon notification, before it is received, against a receivable from the State (441).</p>`));
  h += J(dateNum(D.d3, D.m), [{ c: "441", l: "État – Subventions à recevoir", d: D.sub }, { c: "131", l: "Subventions d'équipement", cr: D.sub }]);

  h += box(t(`Encaissement de la subvention (${dateNum(D.dEnc, D.mEnc)})`, `Receipt of the grant (${dateNum(D.dEnc, D.mEnc)})`),
    t(`<p>L'encaissement solde la créance sur l'État, sans effet sur le résultat.</p>`, `<p>The receipt clears the receivable from the State, with no effect on profit.</p>`));
  h += J(dateNum(D.dEnc, D.mEnc), [{ c: "512", l: "Banque", d: D.sub }, { c: "441", l: "État – Subventions à recevoir", cr: D.sub }]);

  h += box(t("Réévaluation de la dette en devise (31/12/N)", "Remeasurement of the foreign-currency liability (31/12/N)"),
    t(`<p>La dette non réglée est actualisée au cours de clôture : ${fx(D.fxAmt, D.cur.sym)} × ${rate(D.c2)} = ${money(D.debt2)}, contre ${money(D.ht)} à l'origine. La devise s'étant appréciée, la dette augmente de ${money(D.loss)} : c'est une perte latente, inscrite en différence de conversion à l'actif (476). Par prudence, cette perte non encore réalisée est couverte par une provision pour perte de change (1515) du même montant.</p>`,
      `<p>The unpaid liability is remeasured at the closing rate: ${fx(D.fxAmt, D.cur.sym)} × ${rate(D.c2)} = ${money(D.debt2)}, against ${money(D.ht)} originally. As the currency has appreciated, the liability increases by ${money(D.loss)}: this is an unrealised loss, recorded as a translation difference on the asset side (476). Out of prudence, this unrealised loss is covered by a provision for foreign-exchange losses (1515) of the same amount.</p>`));
  h += J("31/12/N", [{ c: "476", l: "Différences de conversion – Actif", d: D.loss }, { c: "404", l: "Fournisseurs d'immobilisations", cr: D.loss }]);
  h += J("31/12/N", [{ c: "6865", l: "Dotations aux provisions financières", d: D.loss }, { c: "1515", l: "Provisions pour pertes de change", cr: D.loss }]);

  h += box(t("Dotation aux amortissements (31/12/N)", "Depreciation charge (31/12/N)"),
    t(`<p>En linéaire, l'amortissement court à compter de la mise en service, le ${dateNum(D.d2, D.m)} : ${D.daysMonth} jours pour le mois de mise en service plus ${12 - D.m} mois de 30 jours, soit ${D.days} jours. L'annuité pleine est de ${money(D.cost)} / ${D.life} = ${money(D.annuity)} ; la dotation de N vaut ${money(D.annuity)} × ${D.days}/360 = ${money(D.dot)}.</p>`,
      `<p>Under the straight-line method, depreciation runs from the date the asset is brought into use, ${dateNum(D.d2, D.m)}: ${D.daysMonth} days for that month plus ${12 - D.m} months of 30 days, i.e. ${D.days} days. The full annual charge is ${money(D.cost)} / ${D.life} = ${money(D.annuity)}; the charge for N is ${money(D.annuity)} × ${D.days}/360 = ${money(D.dot)}.</p>`));
  h += J("31/12/N", [{ c: "6811", l: "Dotations aux amort. sur immo. corporelles", d: D.dot }, { c: "28154", l: "Amortissement du matériel industriel", cr: D.dot }]);

  h += box(t("Reprise de la subvention d'investissement (31/12/N)", "Release of the investment grant (31/12/N)"),
    t(`<p>La subvention est reprise au résultat au rythme de l'amortissement du bien qu'elle finance : ${pct(D.subRate, 0)} × ${money(D.dot)} = ${money(D.subRep)}, virés en produit exceptionnel (777) par le débit du compte 139. La reprise se poursuivra chaque année jusqu'à épuisement de la subvention.</p>`,
      `<p>The grant is released to income at the pace of the depreciation of the asset it finances: ${pct(D.subRate, 0)} × ${money(D.dot)} = ${money(D.subRep)}, transferred to exceptional income (777) by debiting account 139. The release continues every year until the grant is fully used.</p>`));
  h += J("31/12/N", [{ c: "139", l: "Subv. d'investissement inscrites au CR", d: D.subRep }, { c: "777", l: "Quote-part des subv. d'inv. virée au résultat", cr: D.subRep }]);
  return h;
};
