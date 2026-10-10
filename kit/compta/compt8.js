/* H1: Actifs numériques : minage et trading */
/* H2: Opérations liées aux cryptomonnaies */
PAGE.k = {
  fr: { title: "Comptabilité 8 – Actifs numériques",
        'k-h1': "Actifs numériques : minage et trading",
        'k-cardtitle': "Opérations liées aux cryptomonnaies" },
  en: { title: "Accounting 8 – Digital assets",
        'k-h1': "Digital assets: mining and trading",
        'k-cardtitle': "Cryptocurrency transactions" }
};
const CRYPTOS = [{ n: "Bitcoin (BTC)", p: 40000, d: 4 }, { n: "Ethereum (ETH)", p: 2500, d: 2 }, { n: "Solana (SOL)", p: 150, d: 2 }];
function qty(x) { return x.toLocaleString(I18N[LANG].locale, { minimumFractionDigits: PAGE.last.dec, maximumFractionDigits: PAGE.last.dec }); }

PAGE.compute = function () {
  const D = {}, c = CRYPTOS[randInt(0, 2)];
  D.tok = c.n; D.dec = c.d; const k = 40000 / c.p, p10 = Math.pow(10, c.d);
  D.equip = randInt(50, 150) * 100; D.equipTVA = r2(D.equip * 0.2); D.equipTTC = r2(D.equip + D.equipTVA);
  D.elec = randInt(10, 40) * 100; D.elecTVA = r2(D.elec * 0.2); D.elecTTC = r2(D.elec + D.elecTVA);
  D.qMine = Math.round(randInt(5, 50) / 100 * k * p10) / p10; D.pMine = randInt(c.p * 0.9, c.p * 1.1); D.mine = r2(D.qMine * D.pMine);
  D.qBuy = Math.round(randInt(20, 100) / 100 * k * p10) / p10; D.pBuy = randInt(c.p * 0.8, c.p * 1.2); D.buy = r2(D.qBuy * D.pBuy);
  D.qSell = Math.round(D.qBuy * randInt(30, 70) / 100 * p10) / p10; D.pSell = Math.round(D.pBuy * randInt(85, 140) / 100);
  if (D.pSell === D.pBuy) D.pSell += 1;
  D.sell = r2(D.qSell * D.pSell); D.vnc = r2(D.qSell * D.pBuy); D.gain = D.pSell > D.pBuy; D.res = r2(Math.abs(D.sell - D.vnc));
  D.pClose = Math.round(D.pBuy * randInt(75, 125) / 100);
  D.qRest = r2(D.qBuy - D.qSell); D.qTot = r2(D.qMine + D.qRest);
  D.vncRest = r2(D.qRest * D.pBuy); D.vncTot = r2(D.mine + D.vncRest); D.mkt = r2(D.qTot * D.pClose);
  D.loss = D.mkt < D.vncTot; D.diff = r2(Math.abs(D.vncTot - D.mkt));
  D.amort = r2(D.equip / 3 * 6 / 12);
  return D;
};

PAGE.context = function (D) {
  return t(`<strong>BlockTech SAS</strong>, assujettie à la TVA au taux normal de 20 %, diversifie sa trésorerie dans les actifs numériques et développe une activité secondaire de validation de blocs (minage). L'exercice coïncide avec l'année civile.<br><br><em>Règles applicables.</em> On applique le règlement ANC 2018-07 sur la comptabilisation des jetons (compte 522). La TVA frappe les biens et services classiques ; les acquisitions, cessions et récompenses de minage de cryptomonnaies en sont exonérées.`,
           `<strong>BlockTech SAS</strong>, subject to VAT at the standard rate of 20%, diversifies its cash holdings into digital assets and develops a secondary block-validation (mining) activity. The financial year matches the calendar year.<br><br><em>Applicable rules.</em> ANC regulation 2018-07 on the accounting of tokens (account 522) applies. VAT is charged on ordinary goods and services; purchases, disposals and mining rewards of cryptocurrencies are exempt.`);
};

PAGE.enonce = function (D) {
  const li = [
    t(`<strong class="date">Le 01/07/N.</strong> Acquisition de serveurs spécialisés (ASIC) dédiés au minage pour ${money(D.equip)} HT, mis en service immédiatement et amortis en linéaire sur 3 ans.`,
      `<strong class="date">1 July N.</strong> Purchase of specialised servers (ASIC) dedicated to mining for ${money(D.equip)} before VAT, brought into use immediately and depreciated on a straight-line basis over 3 years.`),
    t(`<strong class="date">Le 15/09/N.</strong> Réception d'une facture d'électricité de ${money(D.elec)} HT liée exclusivement au minage. Le même jour, l'entreprise reçoit sa première récompense de minage : ${qty(D.qMine)} jetons <strong>${D.tok}</strong>, cotés ${money(D.pMine)} l'unité à cette date.`,
      `<strong class="date">15 September N.</strong> Receipt of an electricity invoice of ${money(D.elec)} before VAT relating solely to mining. The same day, the company receives its first mining reward: ${qty(D.qMine)} <strong>${D.tok}</strong> tokens, quoted at ${money(D.pMine)} each on that date.`),
    t(`<strong class="date">Le 10/10/N.</strong> Dans une optique de placement à court terme, achat sur une plateforme d'échange de ${qty(D.qBuy)} jetons <strong>${D.tok}</strong> au cours de ${money(D.pBuy)}, réglés par virement.`,
      `<strong class="date">10 October N.</strong> As a short-term investment, purchase on an exchange of ${qty(D.qBuy)} <strong>${D.tok}</strong> tokens at ${money(D.pBuy)} each, paid by bank transfer.`),
    t(`<strong class="date">Le 20/11/N.</strong> Revente de ${qty(D.qSell)} des jetons achetés le mois précédent, au cours de ${money(D.pSell)} ; le produit est rapatrié sur le compte bancaire.`,
      `<strong class="date">20 November N.</strong> Sale of ${qty(D.qSell)} of the tokens bought the previous month, at ${money(D.pSell)} each; the proceeds are transferred to the bank account.`),
    t(`<strong class="date">Le 31/12/N.</strong> Travaux d'inventaire : le cours du jeton <strong>${D.tok}</strong> s'établit à ${money(D.pClose)}. L'entreprise évalue le portefeuille de jetons restants et amortit son matériel.`,
      `<strong class="date">31 December N.</strong> Year-end work: the <strong>${D.tok}</strong> token is quoted at ${money(D.pClose)}. The company values its remaining token portfolio and depreciates its equipment.`)
  ];
  return head(t("Opérations réalisées au cours de l'exercice N", "Transactions of year N")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez ces opérations au journal de BlockTech SAS, écritures d'inventaire comprises.`, `Record these transactions in the journal of BlockTech SAS, including the year-end entries.`));
};

PAGE.sol = function (D) {
  let h = '';
  h += box(t("Acquisition du matériel de minage (01/07/N)", "Purchase of the mining equipment (01/07/N)"),
    t(`<p>Les serveurs ASIC sont une immobilisation corporelle (2183) inscrite pour ${money(D.equip)}. La TVA sur immobilisation, ${money(D.equipTVA)}, est déductible ; la dette envers le fournisseur d'immobilisations (404) s'élève à ${money(D.equipTTC)}.</p>`,
      `<p>The ASIC servers are property, plant and equipment (2183) recognised at ${money(D.equip)}. VAT on the fixed asset, ${money(D.equipTVA)}, is deductible; the liability towards the supplier of fixed assets (404) is ${money(D.equipTTC)}.</p>`));
  h += J("01/07/N", [{ c: "2183", l: "Matériel informatique (serveurs ASIC)", d: D.equip }, { c: "44562", l: "TVA déductible sur immobilisations", d: D.equipTVA }, { c: "404", l: "Fournisseurs d'immobilisations", cr: D.equipTTC }]);

  h += box(t("Minage (15/09/N)", "Mining (15/09/N)"),
    t(`<p>L'électricité est une charge de ${money(D.elec)} HT avec ${money(D.elecTVA)} de TVA déductible, soit ${money(D.elecTTC)} dus au fournisseur. La récompense de minage rémunère un service de validation : c'est un produit d'exploitation (706), non soumis à la TVA, évalué au cours du jour : ${qty(D.qMine)} × ${money(D.pMine)} = ${money(D.mine)}. Les jetons entrent au compte 522 pour cette valeur.</p>`,
      `<p>Electricity is an expense of ${money(D.elec)} before VAT with ${money(D.elecTVA)} of deductible VAT, i.e. ${money(D.elecTTC)} owed to the supplier. The mining reward remunerates a validation service: it is operating income (706), VAT-exempt, measured at the market price of the day: ${qty(D.qMine)} × ${money(D.pMine)} = ${money(D.mine)}. The tokens are recognised in account 522 at that value.</p>`));
  h += J("15/09/N", [{ c: "6061", l: "Fournitures non stockables (électricité)", d: D.elec }, { c: "44566", l: "TVA déductible sur autres B&S", d: D.elecTVA }, { c: "401", l: "Fournisseurs", cr: D.elecTTC }]);
  h += J("15/09/N", [{ c: "522", l: "Jetons détenus (actifs numériques)", d: D.mine }, { c: "706", l: "Prestations de services (minage)", cr: D.mine }]);

  h += box(t("Achat de jetons de trésorerie (10/10/N)", "Purchase of tokens as a cash investment (10/10/N)"),
    t(`<p>Les jetons détenus à titre de placement sont enregistrés au compte 522 pour leur coût d'acquisition : ${qty(D.qBuy)} × ${money(D.pBuy)} = ${money(D.buy)}, sans TVA.</p>`,
      `<p>Tokens held as an investment are recorded in account 522 at cost: ${qty(D.qBuy)} × ${money(D.pBuy)} = ${money(D.buy)}, with no VAT.</p>`));
  h += J("10/10/N", [{ c: "522", l: "Jetons détenus (actifs numériques)", d: D.buy }, { c: "512", l: "Banque", cr: D.buy }]);

  h += box(t("Cession partielle (20/11/N)", "Partial disposal (20/11/N)"),
    t(`<p>Les ${qty(D.qSell)} jetons cédés sortent pour leur coût d'entrée : ${qty(D.qSell)} × ${money(D.pBuy)} = ${money(D.vnc)}. L'encaissement s'élève à ${qty(D.qSell)} × ${money(D.pSell)} = ${money(D.sell)}. La différence, ${money(D.res)}, est ${D.gain ? "une plus-value (766)" : "une moins-value (666)"} de cession, en résultat financier.</p>`,
      `<p>The ${qty(D.qSell)} tokens sold are derecognised at cost: ${qty(D.qSell)} × ${money(D.pBuy)} = ${money(D.vnc)}. The proceeds are ${qty(D.qSell)} × ${money(D.pSell)} = ${money(D.sell)}. The difference, ${money(D.res)}, is a ${D.gain ? "gain (766)" : "loss (666)"} on disposal, in financial profit or loss.</p>`));
  h += D.gain ? J("20/11/N", [{ c: "512", l: "Banque", d: D.sell }, { c: "522", l: "Jetons détenus (sortie VNC)", cr: D.vnc }, { c: "766", l: "Gains sur cessions d'actifs numériques", cr: D.res }])
              : J("20/11/N", [{ c: "512", l: "Banque", d: D.sell }, { c: "666", l: "Pertes sur cessions d'actifs numériques", d: D.res }, { c: "522", l: "Jetons détenus (sortie VNC)", cr: D.vnc }]);

  h += box(t("Amortissement du matériel (31/12/N)", "Depreciation of the equipment (31/12/N)"),
    t(`<p>L'annuité linéaire complète est de ${money(D.equip)} / 3 = ${money(D.equip / 3)}. Le matériel ayant été mis en service le 1<sup>er</sup> juillet, la dotation de N est calculée prorata temporis sur 6 mois : ${money(D.amort)}.</p>`,
      `<p>The full straight-line charge is ${money(D.equip)} / 3 = ${money(D.equip / 3)}. As the equipment was brought into use on 1 July, the charge for N is time-apportioned over 6 months: ${money(D.amort)}.</p>`));
  h += J("31/12/N", [{ c: "6811", l: "Dotations aux amortissements sur immo. corp.", d: D.amort }, { c: "28183", l: "Amortissement du matériel informatique", cr: D.amort }]);

  h += box(t("Évaluation du portefeuille de jetons (31/12/N)", "Valuation of the token portfolio (31/12/N)"),
    t(`<p>Le portefeuille réunit ${qty(D.qMine)} jetons issus du minage (coût ${money(D.mine)}) et ${qty(D.qRest)} jetons restants du trading (coût ${money(D.vncRest)}), soit ${qty(D.qTot)} jetons pour une valeur comptable de ${money(D.vncTot)}. Au cours de clôture de ${money(D.pClose)}, la valeur vénale est de ${money(D.mkt)}. ${D.loss ? `Le portefeuille présente une moins-value latente de ${money(D.diff)} : le compte 522 est ramené à la valeur de marché par le compte de différence d'évaluation à l'actif (4786), et une provision pour risques (1517) est dotée pour le même montant.` : `Le portefeuille présente une plus-value latente de ${money(D.diff)} : le compte 522 est porté à la valeur de marché par le compte de différence d'évaluation au passif (4787), sans impact sur le résultat.`}</p>`,
      `<p>The portfolio comprises ${qty(D.qMine)} mined tokens (cost ${money(D.mine)}) and ${qty(D.qRest)} remaining traded tokens (cost ${money(D.vncRest)}), i.e. ${qty(D.qTot)} tokens with a carrying amount of ${money(D.vncTot)}. At the closing price of ${money(D.pClose)}, the market value is ${money(D.mkt)}. ${D.loss ? `The portfolio shows an unrealised loss of ${money(D.diff)}: account 522 is written down to market value through the valuation-difference account on the asset side (4786), and a provision for risks (1517) is booked for the same amount.` : `The portfolio shows an unrealised gain of ${money(D.diff)}: account 522 is increased to market value through the valuation-difference account on the liability side (4787), with no effect on profit.`}</p>`));
  if (D.loss) h += J("31/12/N", [{ c: "4786", l: "Différences d'évaluation de jetons - Actif", d: D.diff }, { c: "6868", l: "Dotations aux provisions", d: D.diff }, { c: "522", l: "Jetons détenus (actifs numériques)", cr: D.diff }, { c: "1517", l: "Provisions pour risques", cr: D.diff }]);
  else if (D.diff > 0) h += J("31/12/N", [{ c: "522", l: "Jetons détenus (actifs numériques)", d: D.diff }, { c: "4787", l: "Différences d'évaluation de jetons - Passif", cr: D.diff }]);
  return h;
};
