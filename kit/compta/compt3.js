/* H1: Travaux d'inventaire : séparation des exercices */
/* H2: Opérations d'ajustement (<em>cut-off</em>) au 31/12/N et au 01/01/N+1 */
PAGE.k = {
  fr: { title: "Comptabilité 3 – Séparation des exercices",
        'k-h1': "Travaux d'inventaire : séparation des exercices",
        'k-cardtitle': "Opérations d'ajustement (<em>cut-off</em>) au 31/12/N et au 01/01/N+1" },
  en: { title: "Accounting 3 – Cut-off procedures",
        'k-h1': "Year-end work: cut-off",
        'k-cardtitle': "Cut-off adjustments at 31/12/N and reversals at 01/01/N+1" }
};
const MONTHS = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
function mon(m) { return MONTHS[LANG][(m - 1) % 12]; }
function first(m) { return t(`1<sup>er</sup> ${mon(m)}`, `1 ${mon(m)}`); }

PAGE.compute = function () {
  const D = {};
  D.ccaTotal = randInt(12, 48) * 100; D.ccaDur = randInt(0, 1) === 0 ? 6 : 12; D.ccaStart = randInt(8, 11);
  D.ccaEnd = D.ccaStart + D.ccaDur - 1; D.ccaN1 = D.ccaEnd - 12; D.ccaAmt = r2(D.ccaTotal * D.ccaN1 / D.ccaDur);
  D.fnpHT = randInt(15, 80) * 100; D.fnpTVA = r2(D.fnpHT * 0.2); D.fnpTTC = r2(D.fnpHT + D.fnpTVA);
  D.pcaTotal = randInt(18, 60) * 100; D.pcaDur = 6; D.pcaStart = randInt(9, 11);
  D.pcaEnd = D.pcaStart + D.pcaDur - 1; D.pcaN1 = D.pcaEnd - 12; D.pcaAmt = r2(D.pcaTotal * D.pcaN1 / D.pcaDur);
  D.faeHT = randInt(30, 120) * 100; D.faeTVA = r2(D.faeHT * 0.2); D.faeTTC = r2(D.faeHT + D.faeTVA);
  D.loan = randInt(50, 200) * 1000; D.rate = randInt(2, 6); D.loanMonth = randInt(3, 9);
  D.mAcc = 12 - D.loanMonth + 1; D.icne = r2(D.loan * D.rate / 100 * D.mAcc / 12);
  return D;
};

PAGE.context = function (D) {
  return t(`Vous assistez le chef comptable de la société <strong>AlphaRéseaux SAS</strong> lors des travaux de clôture de l'exercice N, clos le 31 décembre. Pour que les états financiers donnent une image fidèle, vous appliquez le principe de séparation des exercices (<em>cut-off</em>) aux informations transmises par les différents services.<br><br><em>Règles applicables.</em> Toutes les factures courantes ont déjà été enregistrées. La TVA est au taux normal de 20 % ; l'assurance et les intérêts d'emprunt n'y sont pas soumis. Les prorata temporis se calculent par mois entiers.`,
           `You assist the chief accountant of <strong>AlphaRéseaux SAS</strong> with the closing of financial year N, which ends on 31 December. So that the financial statements give a true and fair view, you apply the cut-off principle to the information provided by the various departments.<br><br><em>Applicable rules.</em> All routine invoices have already been recorded. VAT is at the standard rate of 20%; insurance and loan interest are not subject to VAT. Time apportionments are computed in whole months.`);
};

PAGE.enonce = function (D) {
  const li = [
    t(`<strong>Service général.</strong> Une prime d'assurance de ${money(D.ccaTotal)} a été comptabilisée et payée en N. Elle couvre une période de ${D.ccaDur} mois débutant le ${first(D.ccaStart)} N.`,
      `<strong>General services.</strong> An insurance premium of ${money(D.ccaTotal)} was recorded and paid in N. It covers a ${D.ccaDur}-month period starting on ${first(D.ccaStart)} N.`),
    t(`<strong>Service logistique.</strong> Un lot de marchandises d'une valeur de ${money(D.fnpHT)} HT a été réceptionné le 28 décembre. Le bon de livraison est validé, mais la facture du fournisseur n'est pas parvenue au 31/12/N.`,
      `<strong>Logistics.</strong> A batch of goods worth ${money(D.fnpHT)} before VAT was received on 28 December. The delivery note has been approved, but the supplier's invoice had not arrived by 31/12/N.`),
    t(`<strong>Service client.</strong> Un contrat de maintenance a été facturé d'avance à un client pour ${money(D.pcaTotal)} HT et intégralement enregistré en chiffre d'affaires de N. Il couvre ${D.pcaDur} mois à compter du ${first(D.pcaStart)} N.`,
      `<strong>Customer service.</strong> A maintenance contract was invoiced in advance to a customer for ${money(D.pcaTotal)} before VAT and fully recorded as revenue of N. It covers ${D.pcaDur} months from ${first(D.pcaStart)} N.`),
    t(`<strong>Service commercial.</strong> Une commande importante de produits finis, valorisée ${money(D.faeHT)} HT, a été expédiée et réceptionnée par le client le 29 décembre ; la facture ne sera émise que le 5 janvier N+1.`,
      `<strong>Sales.</strong> A large order of finished goods, worth ${money(D.faeHT)} before VAT, was shipped and received by the customer on 29 December; the invoice will only be issued on 5 January N+1.`),
    t(`<strong>Service financier.</strong> L'échéancier d'un emprunt bancaire fait apparaître un capital restant dû de ${money(D.loan)} au taux annuel de ${pct(D.rate, 0)}. La dernière échéance annuelle a été prélevée le ${first(D.loanMonth)} N.`,
      `<strong>Treasury.</strong> The repayment schedule of a bank loan shows an outstanding principal of ${money(D.loan)} at an annual rate of ${pct(D.rate, 0)}. The last annual instalment was paid on ${first(D.loanMonth)} N.`)
  ];
  return head(t("Informations transmises par les services", "Information provided by the departments")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez les écritures d'ajustement au 31 décembre N, puis leur contre-passation au 1<sup>er</sup> janvier N+1.`,
           `Record the adjusting entries at 31 December N, then their reversals on 1 January N+1.`));
};

PAGE.sol = function (D) {
  let h = '';
  const rev = t("La contre-passation au 1<sup>er</sup> janvier N+1 solde le compte transitoire et rattache la charge ou le produit au nouvel exercice.",
                "The reversal on 1 January N+1 clears the suspense account and attaches the expense or income to the new financial year.");
  /* 1 */
  h += box(t("1. Prime d'assurance : charge constatée d'avance", "1. Insurance premium: prepaid expense"),
    t(`<p>La prime a été comptabilisée en totalité en N alors qu'elle couvre ${D.ccaDur} mois à partir du ${first(D.ccaStart)}, c'est-à-dire jusqu'à fin ${mon(D.ccaEnd)} N+1 : ${D.ccaN1} mois concernent l'exercice suivant. Pour respecter l'indépendance des exercices, on retire de la charge de N la quote-part relative à N+1 : ${money(D.ccaTotal)} × ${D.ccaN1}/${D.ccaDur} = ${money(D.ccaAmt)}, portée à l'actif en charges constatées d'avance (486). L'assurance n'étant pas soumise à la TVA, aucune régularisation de taxe n'est nécessaire. ${rev}</p>`,
      `<p>The premium was fully expensed in N although it covers ${D.ccaDur} months from ${first(D.ccaStart)}, i.e. until the end of ${mon(D.ccaEnd)} N+1: ${D.ccaN1} months relate to the next financial year. To respect the matching principle, the share relating to N+1 is removed from the expense of N: ${money(D.ccaTotal)} × ${D.ccaN1}/${D.ccaDur} = ${money(D.ccaAmt)}, recognised as a prepaid expense (486). Insurance is outside the scope of VAT, so no tax adjustment is needed. ${rev}</p>`));
  h += J("31/12/N", [{ c: "486", l: "Charges constatées d'avance", d: D.ccaAmt }, { c: "616", l: "Primes d'assurances", cr: D.ccaAmt }]);
  h += J("01/01/N+1", [{ c: "616", l: "Primes d'assurances", d: D.ccaAmt }, { c: "486", l: "Charges constatées d'avance", cr: D.ccaAmt }]);
  /* 2 */
  h += box(t("2. Marchandises réceptionnées : facture non parvenue", "2. Goods received: invoice not yet received"),
    t(`<p>Les marchandises sont entrées dans l'entreprise avant la clôture : l'achat se rattache à l'exercice N même sans facture. On constate la charge de ${money(D.fnpHT)}, la TVA à régulariser de ${money(D.fnpTVA)} (44586) et une dette estimée envers le fournisseur de ${money(D.fnpTTC)} (4081). ${rev} La facture définitive sera ensuite enregistrée normalement.</p>`,
      `<p>The goods entered the company before the year end: the purchase belongs to year N even without an invoice. The expense of ${money(D.fnpHT)}, the VAT to be regularised of ${money(D.fnpTVA)} (44586) and an estimated liability of ${money(D.fnpTTC)} towards the supplier (4081) are recognised. ${rev} The final invoice will then be recorded in the usual way.</p>`));
  h += J("31/12/N", [{ c: "607", l: "Achats de marchandises", d: D.fnpHT }, { c: "44586", l: "TVA sur factures non parvenues", d: D.fnpTVA }, { c: "4081", l: "Fournisseurs - factures non parvenues", cr: D.fnpTTC }]);
  h += J("01/01/N+1", [{ c: "4081", l: "Fournisseurs - factures non parvenues", d: D.fnpTTC }, { c: "607", l: "Achats de marchandises", cr: D.fnpHT }, { c: "44586", l: "TVA sur factures non parvenues", cr: D.fnpTVA }]);
  /* 3 */
  h += box(t("3. Contrat de maintenance : produit constaté d'avance", "3. Maintenance contract: deferred income"),
    t(`<p>Il s'agit cette fois d'une prestation vendue. Le chiffre d'affaires a été enregistré en N, mais la prestation de ${D.pcaDur} mois débutant le ${first(D.pcaStart)} se poursuit ${D.pcaN1} mois en N+1. On retire du résultat de N la part non encore réalisée, hors taxes : ${money(D.pcaTotal)} × ${D.pcaN1}/${D.pcaDur} = ${money(D.pcaAmt)}, inscrite au passif en produits constatés d'avance (487). La TVA, exigible à la facturation, n'est pas corrigée. ${rev}</p>`,
      `<p>This time it is a service sold. The revenue was recorded in N, but the ${D.pcaDur}-month service starting on ${first(D.pcaStart)} continues for ${D.pcaN1} months in N+1. The part not yet performed is removed from the profit of N, before VAT: ${money(D.pcaTotal)} × ${D.pcaN1}/${D.pcaDur} = ${money(D.pcaAmt)}, recognised as deferred income (487). VAT, due on invoicing, is not adjusted. ${rev}</p>`));
  h += J("31/12/N", [{ c: "706", l: "Prestations de services", d: D.pcaAmt }, { c: "487", l: "Produits constatés d'avance", cr: D.pcaAmt }]);
  h += J("01/01/N+1", [{ c: "487", l: "Produits constatés d'avance", d: D.pcaAmt }, { c: "706", l: "Prestations de services", cr: D.pcaAmt }]);
  /* 4 */
  h += box(t("4. Produits finis livrés : facture à établir", "4. Finished goods delivered: invoice to be issued"),
    t(`<p>La livraison a eu lieu en N : le transfert de propriété étant réalisé, la vente de ${money(D.faeHT)} se rattache à l'exercice N bien que la facture ne soit émise qu'en janvier. La TVA correspondante, ${money(D.faeTVA)}, est en attente dans le compte 44587 et la créance estimée sur le client s'élève à ${money(D.faeTTC)} (4181). ${rev} Le chiffre d'affaires ne sera ainsi pas compté deux fois à l'émission de la facture.</p>`,
      `<p>Delivery took place in N: title has passed, so the sale of ${money(D.faeHT)} belongs to year N even though the invoice is only issued in January. The corresponding VAT, ${money(D.faeTVA)}, is parked in account 44587 and the estimated receivable amounts to ${money(D.faeTTC)} (4181). ${rev} Revenue will therefore not be counted twice when the invoice is issued.</p>`));
  h += J("31/12/N", [{ c: "4181", l: "Clients - factures à établir", d: D.faeTTC }, { c: "701", l: "Ventes de produits finis", cr: D.faeHT }, { c: "44587", l: "TVA sur factures à établir", cr: D.faeTVA }]);
  h += J("01/01/N+1", [{ c: "701", l: "Ventes de produits finis", d: D.faeHT }, { c: "44587", l: "TVA sur factures à établir", d: D.faeTVA }, { c: "4181", l: "Clients - factures à établir", cr: D.faeTTC }]);
  /* 5 */
  h += box(t("5. Emprunt bancaire : intérêts courus non échus", "5. Bank loan: accrued interest"),
    t(`<p>Les intérêts se paient à terme échu, à chaque échéance annuelle. Depuis la dernière, le ${first(D.loanMonth)} N, l'entreprise a disposé des fonds pendant ${D.mAcc} mois dont le coût appartient à l'exercice N : ${money(D.loan)} × ${pct(D.rate, 0)} × ${D.mAcc}/12 = ${money(D.icne)}. On constate cette charge financière et la dette rattachée à l'emprunt (1688). ${rev} La charge viendra alors en déduction des intérêts payés à l'échéance de N+1.</p>`,
      `<p>Interest is paid in arrears at each annual instalment. Since the last one, on ${first(D.loanMonth)} N, the company has used the funds for ${D.mAcc} months, whose cost belongs to year N: ${money(D.loan)} × ${pct(D.rate, 0)} × ${D.mAcc}/12 = ${money(D.icne)}. This financial expense and the related accrued liability (1688) are recognised. ${rev} The expense will then offset the interest paid at the N+1 instalment.</p>`));
  h += J("31/12/N", [{ c: "6611", l: "Intérêts des emprunts et dettes", d: D.icne }, { c: "1688", l: "Intérêts courus sur emprunts", cr: D.icne }]);
  h += J("01/01/N+1", [{ c: "1688", l: "Intérêts courus sur emprunts", d: D.icne }, { c: "6611", l: "Intérêts des emprunts et dettes", cr: D.icne }]);
  return h;
};
