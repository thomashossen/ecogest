/* H1: Modes de financement et investissements */
/* H2: Emprunt bancaire et contrat de crédit-bail */
PAGE.k = {
  fr: { title: "Comptabilité 7 – Emprunt et crédit-bail",
        'k-h1': "Modes de financement et investissements",
        'k-cardtitle': "Emprunt bancaire et contrat de crédit-bail" },
  en: { title: "Accounting 7 – Bank loan and leasing",
        'k-h1': "Financing methods and investments",
        'k-cardtitle': "Bank loan and equipment lease" }
};

PAGE.compute = function () {
  const D = {};
  D.loan = randInt(50, 200) * 1000; D.rate = randInt(2, 5); D.years = randInt(4, 7);
  const i = D.rate / 100;
  D.annExact = D.loan * i / (1 - Math.pow(1 + i, -D.years));
  D.int1 = Math.round(D.loan * i); D.am1 = Math.round(D.annExact - D.loan * i); D.ann = D.int1 + D.am1;
  D.leaseYears = randInt(3, 5); D.leaseMonths = D.leaseYears * 12;
  D.royHT = randInt(3, 9) * 1200; D.royTVA = r2(D.royHT * 0.2); D.royTTC = r2(D.royHT + D.royTVA);
  D.cca = r2(D.royHT * 2 / 12);
  D.optHT = randInt(2, 6) * 1000; D.optTVA = r2(D.optHT * 0.2); D.optTTC = r2(D.optHT + D.optTVA);
  return D;
};

PAGE.context = function (D) {
  return t(`L'entreprise <strong>Transport &amp; Logistique SAS</strong>, assujettie à la TVA au taux de 20 %, renouvelle sa flotte de véhicules et acquiert une machine de tri. Elle recourt pour cela à deux modes de financement distincts. L'exercice comptable coïncide avec l'année civile.`,
           `<strong>Transport &amp; Logistique SAS</strong>, subject to VAT at 20%, is renewing its vehicle fleet and acquiring a sorting machine. It uses two different financing methods. The financial year matches the calendar year.`);
};

PAGE.enonce = function (D) {
  const li = [
    t(`<strong class="date">Le 1<sup>er</sup> janvier N.</strong> Obtention et encaissement d'un emprunt de ${money(D.loan)} destiné à financer la machine de tri, au taux annuel de ${pct(D.rate, 0)}, remboursable en ${D.years} ans par annuités constantes.`,
      `<strong class="date">1 January N.</strong> A loan of ${money(D.loan)} is obtained and received in the bank account to finance the sorting machine, at an annual rate of ${pct(D.rate, 0)}, repayable over ${D.years} years in constant annuities.`),
    t(`<strong class="date">Le 1<sup>er</sup> mars N.</strong> Signature d'un contrat de crédit-bail de ${D.leaseMonths} mois pour un camion de livraison. La redevance annuelle, qui couvre une année complète d'utilisation à compter de la signature, est prélevée le jour même : ${money(D.royHT)} HT.`,
      `<strong class="date">1 March N.</strong> A ${D.leaseMonths}-month lease is signed for a delivery truck. The annual rental, covering a full year of use from signature, is debited the same day: ${money(D.royHT)} before VAT.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Prélèvement par la banque de la première annuité de l'emprunt.`,
      `<strong class="date">31 December N.</strong> The bank debits the first annuity of the loan.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Travaux d'inventaire : régularisation de la redevance de crédit-bail au titre de la séparation des exercices.`,
      `<strong class="date">31 December N.</strong> Year-end work: cut-off adjustment of the lease rental.`),
    t(`<strong class="date">Le 1<sup>er</sup> janvier N+1.</strong> Contre-passation de l'écriture d'inventaire de la veille.`,
      `<strong class="date">1 January N+1.</strong> Reversal of the previous day's adjusting entry.`),
    t(`<strong class="date">Le 1<sup>er</sup> mars N+${D.leaseYears}.</strong> Au terme de la location, l'entreprise lève l'option d'achat du camion pour ${money(D.optHT)} HT ; la facture est réglée le jour même par virement.`,
      `<strong class="date">1 March N+${D.leaseYears}.</strong> At the end of the lease, the company exercises the purchase option on the truck for ${money(D.optHT)} before VAT; the invoice is paid the same day by bank transfer.`)
  ];
  return head(t("Opérations réalisées, par ordre chronologique", "Transactions, in chronological order")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez au journal l'ensemble de ces opérations, de la souscription de l'emprunt à la levée de l'option d'achat en N+${D.leaseYears}.`,
           `Record all these transactions in the journal, from the loan drawdown to the exercise of the purchase option in N+${D.leaseYears}.`));
};

PAGE.sol = function (D) {
  let h = '';
  h += box(t("Encaissement de l'emprunt (01/01/N)", "Loan drawdown (01/01/N)"),
    t(`<p>L'encaissement augmente la trésorerie (512) et crée une dette financière envers la banque (164) pour le capital emprunté, ${money(D.loan)}. Aucune charge n'est constatée à ce stade : les intérêts courront avec le temps.</p>`,
      `<p>The drawdown increases cash (512) and creates a financial liability towards the bank (164) for the principal, ${money(D.loan)}. No expense arises at this stage: interest will accrue over time.</p>`));
  h += J("01/01/N", [{ c: "512", l: "Banque", d: D.loan }, { c: "164", l: "Emprunts auprès des établissements de crédit", cr: D.loan }]);

  h += box(t("Redevance de crédit-bail (01/03/N)", "Lease rental (01/03/N)"),
    t(`<p>Tant que l'option d'achat n'est pas levée, le crédit-bail est une location : le camion n'entre pas au bilan. La redevance de ${money(D.royHT)} est une charge externe (6122) ; la TVA déductible s'élève à ${money(D.royTVA)} et le décaissement à ${money(D.royTTC)}.</p>`,
      `<p>Until the purchase option is exercised, the lease is a rental: the truck is not recognised on the balance sheet. The rental of ${money(D.royHT)} is an external expense (6122); input VAT is ${money(D.royTVA)} and the cash outflow ${money(D.royTTC)}.</p>`));
  h += J("01/03/N", [{ c: "6122", l: "Redevances de crédit-bail mobilier", d: D.royHT }, { c: "44566", l: "TVA déductible sur autres B&S", d: D.royTVA }, { c: "512", l: "Banque", cr: D.royTTC }]);

  h += box(t("Première annuité de l'emprunt (31/12/N)", "First loan annuity (31/12/N)"),
    t(`<p>L'annuité constante qui rembourse ${money(D.loan)} en ${D.years} ans au taux de ${pct(D.rate, 0)} se calcule ainsi :</p>\\[a=V_0\\,\\frac{i}{1-(1+i)^{-n}}=${int(D.loan)}\\times\\frac{${(D.rate / 100).toFixed(2)}}{1-${(1 + D.rate / 100).toFixed(2)}^{-${D.years}}}\\approx ${int(D.ann)}\\]<p>Les intérêts de la première année portent sur le capital initial : ${money(D.loan)} × ${pct(D.rate, 0)} = ${money(D.int1)}. L'amortissement du capital s'obtient par différence : ${money(D.ann)} − ${money(D.int1)} = ${money(D.am1)}. Le prélèvement réduit la dette (164) de la part de capital et constate une charge financière (6611) pour les intérêts ; le capital restant dû tombe à ${money(D.loan - D.am1)}.</p>`,
      `<p>The constant annuity that repays ${money(D.loan)} over ${D.years} years at ${pct(D.rate, 0)} is computed as follows:</p>\\[a=V_0\\,\\frac{i}{1-(1+i)^{-n}}=${int(D.loan)}\\times\\frac{${(D.rate / 100).toFixed(2)}}{1-${(1 + D.rate / 100).toFixed(2)}^{-${D.years}}}\\approx ${int(D.ann)}\\]<p>First-year interest is computed on the initial principal: ${money(D.loan)} × ${pct(D.rate, 0)} = ${money(D.int1)}. Principal repayment follows by difference: ${money(D.ann)} − ${money(D.int1)} = ${money(D.am1)}. The debit reduces the liability (164) by the principal portion and records a financial expense (6611) for the interest; the outstanding principal falls to ${money(D.loan - D.am1)}.</p>`));
  h += J("31/12/N", [{ c: "164", l: "Emprunts auprès des établissements de crédit", d: D.am1 }, { c: "6611", l: "Intérêts des emprunts et dettes", d: D.int1 }, { c: "512", l: "Banque", cr: D.ann }]);

  h += box(t("Régularisation de la redevance (31/12/N)", "Cut-off of the lease rental (31/12/N)"),
    t(`<p>La redevance payée le 1<sup>er</sup> mars couvre la période du 1<sup>er</sup> mars N au 28 février N+1 : janvier et février appartiennent à l'exercice suivant. On retire de la charge de N ces deux mois : ${money(D.royHT)} × 2/12 = ${money(D.cca)}, portés en charges constatées d'avance (486).</p>`,
      `<p>The rental paid on 1 March covers the period from 1 March N to 28 February N+1: January and February belong to the next financial year. Those two months are removed from the expense of N: ${money(D.royHT)} × 2/12 = ${money(D.cca)}, recognised as a prepaid expense (486).</p>`));
  h += J("31/12/N", [{ c: "486", l: "Charges constatées d'avance", d: D.cca }, { c: "6122", l: "Redevances de crédit-bail mobilier", cr: D.cca }]);

  h += box(t("Contre-passation (01/01/N+1)", "Reversal (01/01/N+1)"),
    t(`<p>À l'ouverture du nouvel exercice, l'écriture d'inventaire est extournée : la charge de ${money(D.cca)} est ainsi rattachée à N+1.</p>`,
      `<p>At the start of the new financial year, the adjusting entry is reversed: the ${money(D.cca)} expense is thus attached to N+1.</p>`));
  h += J("01/01/N+1", [{ c: "6122", l: "Redevances de crédit-bail mobilier", d: D.cca }, { c: "486", l: "Charges constatées d'avance", cr: D.cca }]);

  h += box(t(`Levée de l'option d'achat (01/03/N+${D.leaseYears})`, `Exercise of the purchase option (01/03/N+${D.leaseYears})`),
    t(`<p>Le camion entre à l'actif (2182) pour le prix de l'option, ${money(D.optHT)}, qui devient sa valeur d'origine amortissable. La TVA sur immobilisation, ${money(D.optTVA)}, est déductible et le règlement s'élève à ${money(D.optTTC)}.</p>`,
      `<p>The truck is recognised as a fixed asset (2182) at the option price, ${money(D.optHT)}, which becomes its depreciable cost. VAT on the fixed asset, ${money(D.optTVA)}, is deductible and the payment amounts to ${money(D.optTTC)}.</p>`));
  h += J(`01/03/N+${D.leaseYears}`, [{ c: "2182", l: "Matériel de transport", d: D.optHT }, { c: "44562", l: "TVA déductible sur immobilisations", d: D.optTVA }, { c: "512", l: "Banque", cr: D.optTTC }]);
  return h;
};
