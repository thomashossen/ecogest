/* H1: Travaux d'inventaire : risques et dépréciations */
/* H2: Ajustements comptables de fin d'exercice */
PAGE.k = {
  fr: { title: "Comptabilité 5 – Risques et dépréciations",
        'k-h1': "Travaux d'inventaire : risques et dépréciations",
        'k-cardtitle': "Ajustements comptables de fin d'exercice" },
  en: { title: "Accounting 5 – Risks and impairments",
        'k-h1': "Year-end work: risks and impairments",
        'k-cardtitle': "Year-end adjusting entries" }
};
const CLIENTS = ["SARL Dujardin", "Ateliers Moreau", "BricoTech", "Entreprise Leroy", "MecaSud"];

PAGE.compute = function () {
  const D = {};
  const i1 = randInt(0, CLIENTS.length - 1); let i2 = randInt(0, CLIENTS.length - 1); while (i2 === i1) i2 = randInt(0, CLIENTS.length - 1);
  D.c1 = CLIENTS[i1]; D.c2 = CLIENTS[i2];
  D.c1TTC = randInt(10, 30) * 1200; D.c1HT = D.c1TTC / 1.2; D.c1Rate = randInt(3, 7) * 10; D.c1Prov = r2(D.c1HT * D.c1Rate / 100);
  D.c1Pay = randInt(2, 6) * 1200; D.c1SoldeTTC = D.c1TTC - D.c1Pay; D.c1SoldeHT = D.c1SoldeTTC / 1.2; D.c1TVA = D.c1SoldeTTC - D.c1SoldeHT;
  D.c2TTC = randInt(20, 50) * 1200; D.c2HT = D.c2TTC / 1.2; D.c2Rate = randInt(3, 7) * 10; D.c2Prov = r2(D.c2HT * D.c2Rate / 100);
  D.c2Pay = randInt(5, 15) * 1200; D.c2SoldeTTC = D.c2TTC - D.c2Pay; D.c2SoldeHT = D.c2SoldeTTC / 1.2;
  D.c2RateN = randInt(2, 8) * 10; D.c2ProvN = r2(D.c2SoldeHT * D.c2RateN / 100); D.c2Adj = r2(D.c2ProvN - D.c2Prov);
  D.stock = randInt(50, 150) * 1000; D.market = D.stock - randInt(5, 20) * 1000; D.depN = D.stock - D.market; D.depN1 = randInt(3, 15) * 1000;
  D.litN1 = randInt(10, 30) * 1000; D.litVar = randInt(-8, 8) * 1000; if (D.litVar === 0) D.litVar = 2000; D.litN = D.litN1 + D.litVar;
  return D;
};

PAGE.context = function (D) {
  return t(`Vous êtes chargé des opérations d'inventaire de <strong>MétaGarant SAS</strong> au 31/12/N. Toutes les opérations courantes ont déjà été comptabilisées, y compris les encaissements reçus des clients douteux au cours de l'année. Il vous reste à passer les écritures de dépréciation et de provision, dans le respect du principe de prudence.<br><br><em>Information préalable.</em> Les créances du tableau ci-dessous ont été reclassées en clients douteux (416) dès l'exercice N−1.`,
           `You are in charge of the year-end procedures of <strong>MétaGarant SAS</strong> at 31/12/N. All routine transactions have already been recorded, including the cash received from doubtful customers during the year. You still have to record the impairment and provision entries, in accordance with the prudence principle.<br><br><em>Background.</em> The receivables in the table below were reclassified as doubtful (416) in year N−1.`);
};

PAGE.enonce = function (D) {
  const tbl = `<div class="kit-tw"><table class="data">
    <tr><th>${t("Client", "Customer")}</th><th class="r">${t("Créance TTC au 01/01/N", "Receivable incl. VAT at 01/01/N")}</th><th class="r">${t("Dépréciation constituée en N−1", "Allowance booked in N−1")}</th><th class="r">${t("Règlements TTC reçus en N", "Payments received in N")}</th><th>${t("Observations au 31/12/N", "Situation at 31/12/N")}</th></tr>
    <tr><td><strong>${D.c1}</strong></td><td class="r">${money(D.c1TTC)}</td><td class="r">${money(D.c1Prov)}</td><td class="r">${money(D.c1Pay)}</td><td>${t("Client en liquidation judiciaire : le solde est définitivement irrécouvrable.", "Customer in liquidation: the balance is definitively irrecoverable.")}</td></tr>
    <tr><td><strong>${D.c2}</strong></td><td class="r">${money(D.c2TTC)}</td><td class="r">${money(D.c2Prov)}</td><td class="r">${money(D.c2Pay)}</td><td>${t(`Le risque d'insolvabilité est désormais évalué à ${pct(D.c2RateN, 0)} du solde de la créance.`, `The insolvency risk is now estimated at ${pct(D.c2RateN, 0)} of the outstanding balance.`)}</td></tr>
  </table></div>`;
  return head(t("1. Créances douteuses au 31/12/N (TVA à 20 %)", "1. Doubtful receivables at 31/12/N (VAT at 20%)")) + tbl +
    `<p class="ex-head later">${t("2. Stocks de marchandises", "2. Inventories of goods")}</p>` +
    `<p>${t(`Les écritures de variation de stocks ont déjà été passées. L'évaluation des stocks de marchandises à la clôture fait apparaître une valeur comptable de ${money(D.stock)} et une valeur vénale de ${money(D.market)}. Une dépréciation de ${money(D.depN1)} avait été constituée sur ces stocks à la clôture précédente.`,
                 `The inventory movement entries have already been recorded. At the year end, the goods in inventory have a carrying amount of ${money(D.stock)} and a market value of ${money(D.market)}. An impairment of ${money(D.depN1)} had been booked on these inventories at the previous year end.`)}</p>` +
    `<p class="ex-head later">${t("3. Provision pour risques", "3. Provision for risks")}</p>` +
    `<p>${t(`L'entreprise est en litige devant le conseil de prud'hommes avec un ancien salarié. Au 31/12/N−1, une provision pour risques de ${money(D.litN1)} avait été dotée ; au 31/12/N, l'avocat de l'entreprise évalue le risque de condamnation à ${money(D.litN)}.`,
                 `The company is in dispute before the labour court with a former employee. At 31/12/N−1 a provision of ${money(D.litN1)} had been booked; at 31/12/N the company's lawyer estimates the risk at ${money(D.litN)}.`)}</p>` +
    work(t(`Enregistrez au journal les écritures d'inventaire nécessaires au 31/12/N pour les créances douteuses, les stocks et le litige prud'homal.`,
           `Record the year-end entries required at 31/12/N for the doubtful receivables, the inventories and the labour dispute.`));
};

PAGE.sol = function (D) {
  let h = '';
  h += box(t(`Créance irrécouvrable (${D.c1})`, `Irrecoverable receivable (${D.c1})`),
    t(`<p>La créance initiale de ${money(D.c1TTC)} TTC, diminuée du règlement de ${money(D.c1Pay)}, laisse un solde de ${money(D.c1SoldeTTC)} TTC. Ce solde est définitivement perdu : on le sort de l'actif. La perte réelle est le montant hors taxe, ${money(D.c1SoldeHT)}, enregistré en 654 ; la TVA de ${money(D.c1TVA)}, collectée lors de la vente et jamais encaissée, est récupérée auprès de l'État par le débit du compte 44571. Le compte 416 est soldé. La dépréciation de ${money(D.c1Prov)} constituée en N−1 n'a plus d'objet et est reprise en totalité.</p>`,
      `<p>The initial receivable of ${money(D.c1TTC)} including VAT, less the payment of ${money(D.c1Pay)}, leaves a balance of ${money(D.c1SoldeTTC)}. This balance is definitively lost and is removed from the assets. The actual loss is the amount before VAT, ${money(D.c1SoldeHT)}, recorded in 654; the VAT of ${money(D.c1TVA)}, charged on the sale and never collected, is recovered from the State by debiting account 44571. Account 416 is cleared. The ${money(D.c1Prov)} allowance booked in N−1 no longer has a purpose and is reversed in full.</p>`));
  h += J("31/12/N", [{ c: "654", l: "Pertes sur créances irrécouvrables", d: D.c1SoldeHT }, { c: "44571", l: "TVA collectée", d: D.c1TVA }, { c: "416", l: "Clients douteux ou litigieux", cr: D.c1SoldeTTC }]);
  h += J("31/12/N", [{ c: "491", l: "Provisions pour dépréciation des comptes de clients", d: D.c1Prov }, { c: "78174", l: "Reprises sur prov. pour dép. de l'actif circulant", cr: D.c1Prov }]);

  const up = D.c2Adj > 0;
  h += box(t(`Ajustement de la dépréciation (${D.c2})`, `Adjustment of the allowance (${D.c2})`),
    t(`<p>Après le règlement de ${money(D.c2Pay)}, le solde est de ${money(D.c2SoldeTTC)} TTC, soit ${money(D.c2SoldeHT)} HT. La dépréciation se calcule toujours sur le hors taxe, puisque la TVA sera récupérée en cas de perte : ${money(D.c2SoldeHT)} × ${pct(D.c2RateN, 0)} = ${money(D.c2ProvN)}. La dépréciation existante est de ${money(D.c2Prov)} ; l'écart de ${money(Math.abs(D.c2Adj))} donne lieu à ${up ? "une dotation complémentaire, le risque s'étant aggravé." : "une reprise partielle, le risque ayant diminué."}</p>`,
      `<p>After the payment of ${money(D.c2Pay)}, the balance is ${money(D.c2SoldeTTC)} including VAT, i.e. ${money(D.c2SoldeHT)} before VAT. The allowance is always computed on the amount before VAT, since VAT will be recovered in case of loss: ${money(D.c2SoldeHT)} × ${pct(D.c2RateN, 0)} = ${money(D.c2ProvN)}. The existing allowance is ${money(D.c2Prov)}; the difference of ${money(Math.abs(D.c2Adj))} requires ${up ? "an additional charge, as the risk has increased." : "a partial reversal, as the risk has decreased."}</p>`));
  h += up ? J("31/12/N", [{ c: "68174", l: "Dotations aux prov. pour dép. de l'actif circulant", d: D.c2Adj }, { c: "491", l: "Provisions pour dépréciation des comptes de clients", cr: D.c2Adj }])
          : J("31/12/N", [{ c: "491", l: "Provisions pour dépréciation des comptes de clients", d: -D.c2Adj }, { c: "78174", l: "Reprises sur prov. pour dép. de l'actif circulant", cr: -D.c2Adj }]);

  h += box(t("Dépréciation des stocks", "Inventory impairment"),
    t(`<p>Pour les stocks, le PCG procède comme pour la variation des stocks : la dépréciation de l'exercice précédent, ${money(D.depN1)}, est annulée par une reprise, puis la dépréciation de l'exercice est dotée en totalité. La valeur vénale, ${money(D.market)}, étant inférieure à la valeur comptable, ${money(D.stock)}, la dépréciation à constater est de ${money(D.depN)}.</p>`,
      `<p>For inventories, French GAAP proceeds as for inventory movements: last year's impairment, ${money(D.depN1)}, is reversed, then this year's impairment is booked in full. Since the market value, ${money(D.market)}, is below the carrying amount, ${money(D.stock)}, the impairment to recognise is ${money(D.depN)}.</p>`));
  h += J("31/12/N", [{ c: "397", l: "Provisions pour dépréciation des stocks", d: D.depN1 }, { c: "78173", l: "Reprises sur prov. pour dép. de l'actif circulant", cr: D.depN1 }]);
  h += J("31/12/N", [{ c: "68173", l: "Dotations aux prov. pour dép. de l'actif circulant", d: D.depN }, { c: "397", l: "Provisions pour dépréciation des stocks", cr: D.depN }]);

  const more = D.litVar > 0;
  h += box(t("Provision pour litige", "Provision for litigation"),
    t(`<p>À la différence des stocks, les provisions pour risques et charges s'ajustent par la différence, comme les dépréciations de créances. Le risque est désormais évalué à ${money(D.litN)} contre ${money(D.litN1)} provisionnés : l'écart de ${money(Math.abs(D.litVar))} appelle ${more ? "une dotation complémentaire." : "une reprise de provision."}</p>`,
      `<p>Unlike inventories, provisions for risks and charges are adjusted by the difference, like allowances on receivables. The risk is now estimated at ${money(D.litN)} against ${money(D.litN1)} already provided: the difference of ${money(Math.abs(D.litVar))} calls for ${more ? "an additional charge." : "a reversal of the provision."}</p>`));
  h += more ? J("31/12/N", [{ c: "6815", l: "Dotations aux prov. pour risques et charges d'exp.", d: D.litVar }, { c: "1511", l: "Provisions pour litiges", cr: D.litVar }])
            : J("31/12/N", [{ c: "1511", l: "Provisions pour litiges", d: -D.litVar }, { c: "7815", l: "Reprises sur prov. pour risques et charges d'exp.", cr: -D.litVar }]);
  return h;
};
