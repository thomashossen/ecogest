/* H1: Facturation, TVA et emballages */
/* H2: Comptabilisation d'opérations commerciales courantes */
PAGE.k = {
  fr: { title: "Comptabilité 1 – Facturation, TVA et emballages",
        'k-h1': "Facturation, TVA et emballages",
        'k-cardtitle': "Comptabilisation d'opérations commerciales courantes" },
  en: { title: "Accounting 1 – Invoicing, VAT and returnable packaging",
        'k-h1': "Invoicing, VAT and returnable packaging",
        'k-cardtitle': "Recording routine commercial transactions" }
};
const COMPANIES = ["AlphaDistrib SA", "MobiDesign", "TechIndustries", "ElectroPro", "LumiDéco", "Cabinet Dubois", "SARL Optima", "Avenir Services", "Consulting Group", "Ateliers Martin"];

PAGE.compute = function () {
  const D = {};
  const idx = [];
  while (idx.length < 3) { const i = randInt(0, COMPANIES.length - 1); if (idx.indexOf(i) < 0) idx.push(i); }
  D.me = COMPANIES[idx[0]]; D.p1 = COMPANIES[idx[1]]; D.p2 = COMPANIES[idx[2]];
  D.sale1 = random() > 0.5; D.sale2 = !D.sale1;

  /* facture F101 */
  D.brut1 = randInt(250, 800) * 10; D.remise = randInt(1, 3) * 5; D.esc = randInt(1, 3);
  D.port = randInt(5, 15) * 10; D.qEmb = randInt(10, 30); D.pxEmb = randInt(15, 25);
  D.consig = D.qEmb * D.pxEmb;
  D.mRemise = r2(D.brut1 * D.remise / 100); D.netCo = r2(D.brut1 - D.mRemise);
  D.mEsc = r2(D.netCo * D.esc / 100); D.netFin = r2(D.netCo - D.mEsc);
  D.base1 = r2(D.netFin + D.port); D.tva1 = r2(D.base1 * 0.2); D.ttc1 = r2(D.base1 + D.tva1);
  D.nap1 = r2(D.ttc1 + D.consig);

  /* avoir A10 */
  D.brutRet = randInt(30, 80) * 10; D.qRet = randInt(D.qEmb - 5, D.qEmb - 1); D.qCas = D.qEmb - D.qRet;
  D.mRemiseRet = r2(D.brutRet * D.remise / 100); D.netCoRet = r2(D.brutRet - D.mRemiseRet);
  D.mEscRet = r2(D.netCoRet * D.esc / 100); D.netFinRet = r2(D.netCoRet - D.mEscRet);
  D.tvaRet = r2(D.netFinRet * 0.2); D.ttcRet = r2(D.netFinRet + D.tvaRet);
  D.venteEmb = D.qCas * D.pxEmb; D.tvaEmb = r2(D.venteEmb * 0.2); D.reprise = D.qRet * D.pxEmb;
  D.napAvoir = r2(D.ttcRet + D.consig - D.venteEmb - D.tvaEmb);
  D.solde = r2(D.nap1 - D.napAvoir);

  /* facture F102 */
  D.b20 = randInt(100, 300) * 10; D.b55 = randInt(50, 150) * 10; D.esc2 = randInt(1, 2);
  D.e20 = r2(D.b20 * D.esc2 / 100); D.e55 = r2(D.b55 * D.esc2 / 100);
  D.nf20 = r2(D.b20 - D.e20); D.nf55 = r2(D.b55 - D.e55);
  D.tva20 = r2(D.nf20 * 0.2); D.tva55 = r2(D.nf55 * 0.055);
  D.tva102 = r2(D.tva20 + D.tva55); D.esc102 = r2(D.e20 + D.e55);
  D.nap2 = r2(D.nf20 + D.nf55 + D.tva102);

  /* TVA du mois */
  D.tvaColX = randInt(1500, 4000); D.tvaDedX = randInt(800, 3500);
  D.tvaCol = r2(D.tvaColX + (D.sale1 ? D.tva1 - D.tvaRet + D.tvaEmb : 0) + (D.sale2 ? D.tva102 : 0));
  D.tvaDed = r2(D.tvaDedX + (!D.sale1 ? D.tva1 - D.tvaRet + D.tvaEmb : 0) + (!D.sale2 ? D.tva102 : 0));
  D.soldeTVA = r2(D.tvaCol - D.tvaDed);
  return D;
};

PAGE.context = function (D) {
  return t(`Vous êtes le comptable de l'entreprise <strong>${D.me}</strong>. Toutes les opérations ci-dessous sont réalisées au cours du mois d'octobre N.<br><br><em>Règles applicables.</em> L'escompte se calcule toujours sur le net commercial, hors port. La TVA s'applique au taux normal de 20 % sauf mention contraire. Les emballages sont consignés hors taxe.`,
           `You are the accountant of <strong>${D.me}</strong>. All the transactions below take place in October N.<br><br><em>Applicable rules.</em> Settlement discounts are always computed on the net commercial amount, excluding freight. VAT applies at the standard rate of 20% unless stated otherwise. Returnable packaging is charged as a deposit, outside the scope of VAT.`);
};

PAGE.enonce = function (D) {
  const s1 = D.sale1, s2 = D.sale2;
  const li = [];
  li.push(t(`<strong class="date">Le 04/10.</strong> Vous ${s1 ? "adressez la facture n° F101 à votre client" : "recevez la facture n° F101 de votre fournisseur"} <strong>${D.p1}</strong>, relative à ${s1 ? "une vente" : "un achat"} de marchandises d'un montant brut de ${money(D.brut1)}. Une remise commerciale de ${pct(D.remise, 0)} est ${s1 ? "accordée" : "obtenue"} sur ce montant. La facture comprend également des frais de port forfaitaires de ${money(D.port)} et la consignation de ${D.qEmb} palettes au prix unitaire de ${money(D.pxEmb)}. Un escompte de règlement de ${pct(D.esc, 0)} est déduit directement sur la facture.`,
            `<strong class="date">4 October.</strong> You ${s1 ? "issue invoice F101 to your customer" : "receive invoice F101 from your supplier"} <strong>${D.p1}</strong> for ${s1 ? "a sale" : "a purchase"} of goods with a gross amount of ${money(D.brut1)}. A trade discount of ${pct(D.remise, 0)} is ${s1 ? "granted" : "obtained"} on this amount. The invoice also includes a flat freight charge of ${money(D.port)} and a deposit on ${D.qEmb} pallets at ${money(D.pxEmb)} each. A settlement discount of ${pct(D.esc, 0)} is deducted directly on the invoice.`));
  li.push(t(`<strong class="date">Le 08/10.</strong> Vous ${s1 ? "adressez l'avoir n° A10 à votre client" : "recevez l'avoir n° A10 de votre fournisseur"} <strong>${D.p1}</strong>, à la suite d'un retour partiel de marchandises sur la facture F101. Le montant brut des marchandises retournées s'élève à ${money(D.brutRet)} ; les réductions de la facture d'origine s'appliquent à ce retour, mais les frais de port ne sont pas remboursés. À cette occasion, ${s1 ? "le client vous restitue" : "vous restituez au fournisseur"} ${D.qRet} palettes en parfait état ; les ${D.qCas} palettes restantes ont été détruites et sont donc définitivement conservées.`,
            `<strong class="date">8 October.</strong> You ${s1 ? "issue credit note A10 to your customer" : "receive credit note A10 from your supplier"} <strong>${D.p1}</strong> following a partial return of goods invoiced on F101. The gross amount of the returned goods is ${money(D.brutRet)}; the discounts of the original invoice apply to this return, but freight is not refunded. On this occasion ${s1 ? "the customer returns" : "you return to the supplier"} ${D.qRet} pallets in perfect condition; the remaining ${D.qCas} pallets were destroyed and are therefore kept for good.`));
  li.push(t(`<strong class="date">Le 12/10.</strong> Vous ${s1 ? "recevez un virement bancaire de" : "émettez un virement bancaire en faveur de"} <strong>${D.p1}</strong> pour solde de la facture F101, déduction faite de l'avoir A10.`,
            `<strong class="date">12 October.</strong> You ${s1 ? "receive a bank transfer from" : "make a bank transfer to"} <strong>${D.p1}</strong> settling invoice F101 in full, net of credit note A10.`));
  li.push(t(`<strong class="date">Le 18/10.</strong> Vous ${s2 ? "adressez la facture n° F102 à votre client" : "recevez la facture n° F102 de votre fournisseur"} <strong>${D.p2}</strong>, relative à ${s2 ? "une vente" : "un achat"} de marchandises relevant de deux taux de TVA. Le premier lot, au taux normal de 20 %, représente un montant brut de ${money(D.b20)} ; le second lot, au taux réduit de 5,5 %, un montant brut de ${money(D.b55)}. Un escompte de règlement de ${pct(D.esc2, 0)} est déduit sur l'ensemble de la facture.`,
            `<strong class="date">18 October.</strong> You ${s2 ? "issue invoice F102 to your customer" : "receive invoice F102 from your supplier"} <strong>${D.p2}</strong> for ${s2 ? "a sale" : "a purchase"} of goods subject to two VAT rates. The first batch, at the standard 20% rate, has a gross amount of ${money(D.b20)}; the second batch, at the reduced 5.5% rate, a gross amount of ${money(D.b55)}. A settlement discount of ${pct(D.esc2, 0)} is deducted on the whole invoice.`));
  li.push(t(`<strong class="date">Le 31/10.</strong> Vous procédez à la liquidation de la TVA d'octobre. Indépendamment des opérations ci-dessus, l'entreprise a enregistré au cours du mois une TVA collectée de ${money(D.tvaColX)} et une TVA déductible sur autres biens et services de ${money(D.tvaDedX)}. Aucun crédit de TVA n'a été reporté du mois précédent.`,
            `<strong class="date">31 October.</strong> You compute the VAT settlement for October. Apart from the transactions above, the company recorded during the month output VAT of ${money(D.tvaColX)} and input VAT on other goods and services of ${money(D.tvaDedX)}. No VAT credit was carried forward from the previous month.`));
  return head(t("Opérations réalisées au cours du mois", "Transactions of the month")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez ces opérations au journal de l'entreprise ${D.me}.`, `Record these transactions in the journal of ${D.me}.`));
};

PAGE.sol = function (D) {
  const s1 = D.sale1, s2 = D.sale2;
  let h = '';

  /* --- F101 --- */
  h += box(t("Facture F101", "Invoice F101"),
    t(`<p>Le montant brut des marchandises est de ${money(D.brut1)}. La remise commerciale de ${pct(D.remise, 0)} représente ${money(D.mRemise)}, d'où un net commercial de ${money(D.netCo)}. L'escompte de règlement de ${pct(D.esc, 0)}, calculé sur ce net commercial, s'élève à ${money(D.mEsc)} et conduit à un net financier de ${money(D.netFin)}. Les frais de port de ${money(D.port)} s'y ajoutent, ce qui porte la base imposable à ${money(D.base1)} et la TVA à 20 % à ${money(D.tva1)}. La consignation de ${D.qEmb} palettes à ${money(D.pxEmb)} l'unité, soit ${money(D.consig)}, est hors champ de la TVA. Le net à payer s'établit donc à ${money(D.nap1)}.</p><p>${s1 ? "La vente est enregistrée pour le net commercial ; l'escompte accordé est une charge financière (668) et les emballages consignés constituent une dette envers le client (4196), puisqu'il peut les restituer." : "L'achat est enregistré pour le net commercial ; l'escompte obtenu est un produit financier (768) et les emballages consignés constituent une créance sur le fournisseur (4096), puisqu'ils seront restitués."}</p>`,
      `<p>The gross amount of the goods is ${money(D.brut1)}. The ${pct(D.remise, 0)} trade discount amounts to ${money(D.mRemise)}, giving a net commercial amount of ${money(D.netCo)}. The ${pct(D.esc, 0)} settlement discount, computed on this net amount, is ${money(D.mEsc)}, which leaves a net financial amount of ${money(D.netFin)}. Freight of ${money(D.port)} is added, so the taxable base is ${money(D.base1)} and VAT at 20% is ${money(D.tva1)}. The deposit on ${D.qEmb} pallets at ${money(D.pxEmb)} each, i.e. ${money(D.consig)}, is outside the scope of VAT. The amount payable is therefore ${money(D.nap1)}.</p><p>${s1 ? "The sale is recorded at the net commercial amount; the discount granted is a financial expense (668) and the packaging deposit is a liability towards the customer (4196), who may return the pallets." : "The purchase is recorded at the net commercial amount; the discount received is financial income (768) and the packaging deposit is a receivable from the supplier (4096), since the pallets will be returned."}</p>`));
  h += s1 ? J("04/10/N", [
      { c: "411", l: "Clients", d: D.nap1 }, { c: "668", l: "Escomptes accordés", d: D.mEsc },
      { c: "707", l: "Ventes de marchandises", cr: D.netCo }, { c: "7085", l: "Ports et frais facturés", cr: D.port },
      { c: "4196", l: "Clients - dettes emballages", cr: D.consig }, { c: "44571", l: "TVA collectée", cr: D.tva1 }])
    : J("04/10/N", [
      { c: "607", l: "Achats de marchandises", d: D.netCo }, { c: "6241", l: "Transports sur achats", d: D.port },
      { c: "4096", l: "Fournisseurs - créances emballages", d: D.consig }, { c: "44566", l: "TVA déductible sur B&S", d: D.tva1 },
      { c: "401", l: "Fournisseurs", cr: D.nap1 }, { c: "768", l: "Escomptes obtenus", cr: D.mEsc }]);

  /* --- A10 --- */
  h += box(t("Avoir A10", "Credit note A10"),
    t(`<p>Le retour porte sur un brut de ${money(D.brutRet)}. Les réductions de la facture d'origine s'annulent dans les mêmes proportions : remise de ${money(D.mRemiseRet)}, net commercial de ${money(D.netCoRet)}, escompte de ${money(D.mEscRet)}, net financier de ${money(D.netFinRet)} et TVA de ${money(D.tvaRet)}, soit un retour TTC de ${money(D.ttcRet)}.</p><p>La consignation est annulée en totalité, soit ${money(D.consig)} : les ${D.qRet} palettes rendues sont simplement reprises, et les ${D.qCas} palettes détruites ne reviendront jamais, de sorte que leur consignation se transforme en vente ferme d'emballages de ${money(D.venteEmb)} hors taxe, soumise à une TVA de ${money(D.tvaEmb)}. Le montant de l'avoir est donc le retour TTC, augmenté de la consignation reprise et diminué de la facturation TTC des emballages conservés : ${money(D.ttcRet)} + ${money(D.consig)} − ${money(D.venteEmb + D.tvaEmb)} = ${money(D.napAvoir)}. Tout se passe comme si ${s1 ? "le client" : "vous"} ne ${s1 ? "devait" : "deviez"} finalement, pour les palettes conservées, que la TVA sur leur prix.</p>`,
      `<p>The return concerns a gross amount of ${money(D.brutRet)}. The discounts of the original invoice are cancelled in the same proportions: trade discount ${money(D.mRemiseRet)}, net commercial amount ${money(D.netCoRet)}, settlement discount ${money(D.mEscRet)}, net financial amount ${money(D.netFinRet)} and VAT ${money(D.tvaRet)}, i.e. a return of ${money(D.ttcRet)} including VAT.</p><p>The deposit is cancelled in full, i.e. ${money(D.consig)}: the ${D.qRet} returned pallets are simply released, while the ${D.qCas} destroyed pallets will never come back, so their deposit turns into a firm sale of packaging of ${money(D.venteEmb)} before tax, subject to VAT of ${money(D.tvaEmb)}. The credit note is therefore the return including VAT, plus the deposit released, minus the VAT-inclusive invoicing of the pallets kept: ${money(D.ttcRet)} + ${money(D.consig)} − ${money(D.venteEmb + D.tvaEmb)} = ${money(D.napAvoir)}. In the end, for the pallets kept, ${s1 ? "the customer only owes" : "you only owe"} the VAT on their price.</p>`));
  h += s1 ? J("08/10/N", [
      { c: "707", l: "Ventes de marchandises", d: D.netCoRet }, { c: "44571", l: "TVA collectée", d: D.tvaRet },
      { c: "4196", l: "Clients - dettes emballages", d: D.consig },
      { c: "411", l: "Clients", cr: D.napAvoir }, { c: "668", l: "Escomptes accordés", cr: D.mEscRet },
      { c: "7088", l: "Autres produits accessoires", cr: D.venteEmb }, { c: "44571", l: "TVA collectée", cr: D.tvaEmb }])
    : J("08/10/N", [
      { c: "401", l: "Fournisseurs", d: D.napAvoir }, { c: "768", l: "Escomptes obtenus", d: D.mEscRet },
      { c: "6026", l: "Achats d'emballages", d: D.venteEmb }, { c: "44566", l: "TVA déductible sur B&S", d: D.tvaEmb },
      { c: "607", l: "Achats de marchandises", cr: D.netCoRet }, { c: "44566", l: "TVA déductible sur B&S", cr: D.tvaRet },
      { c: "4096", l: "Fournisseurs - créances emballages", cr: D.consig }]);

  /* --- règlement --- */
  h += box(t("Règlement du 12/10", "Settlement of 12 October"),
    t(`<p>Le solde dû correspond au net à payer de la facture diminué de l'avoir : ${money(D.nap1)} − ${money(D.napAvoir)} = ${money(D.solde)}.</p>`,
      `<p>The balance due is the invoice amount less the credit note: ${money(D.nap1)} − ${money(D.napAvoir)} = ${money(D.solde)}.</p>`));
  h += s1 ? J("12/10/N", [{ c: "512", l: "Banque", d: D.solde }, { c: "411", l: "Clients", cr: D.solde }])
          : J("12/10/N", [{ c: "401", l: "Fournisseurs", d: D.solde }, { c: "512", l: "Banque", cr: D.solde }]);

  /* --- F102 --- */
  h += box(t("Facture F102 (deux taux de TVA)", "Invoice F102 (two VAT rates)"),
    t(`<p>Chaque lot est traité séparément. Pour le lot à 20 %, le brut de ${money(D.b20)} diminué de l'escompte de ${money(D.e20)} donne un net financier de ${money(D.nf20)} et une TVA de ${money(D.tva20)}. Pour le lot à 5,5 %, le brut de ${money(D.b55)} diminué de l'escompte de ${money(D.e55)} donne un net financier de ${money(D.nf55)} et une TVA de ${money(D.tva55)}. Le net à payer s'élève à ${money(D.nap2)}. En l'absence de remise, ${s2 ? "la vente" : "l'achat"} est comptabilisé${s2 ? "e" : ""} pour le brut, l'escompte étant isolé en ${s2 ? "668" : "768"}.</p>`,
      `<p>Each batch is handled separately. For the 20% batch, the gross amount of ${money(D.b20)} less the ${money(D.e20)} discount gives a net financial amount of ${money(D.nf20)} and VAT of ${money(D.tva20)}. For the 5.5% batch, the gross amount of ${money(D.b55)} less the ${money(D.e55)} discount gives ${money(D.nf55)} and VAT of ${money(D.tva55)}. The amount payable is ${money(D.nap2)}. With no trade discount, the ${s2 ? "sale" : "purchase"} is recorded at the gross amount and the settlement discount is shown separately in account ${s2 ? "668" : "768"}.</p>`));
  h += s2 ? J("18/10/N", [
      { c: "411", l: "Clients", d: D.nap2 }, { c: "668", l: "Escomptes accordés", d: D.esc102 },
      { c: "707", l: "Ventes (20%)", cr: D.b20 }, { c: "707", l: "Ventes (5.5%)", cr: D.b55 },
      { c: "44571", l: "TVA collectée (20%)", cr: D.tva20 }, { c: "44571", l: "TVA collectée (5.5%)", cr: D.tva55 }])
    : J("18/10/N", [
      { c: "607", l: "Achats (20%)", d: D.b20 }, { c: "607", l: "Achats (5.5%)", d: D.b55 },
      { c: "44566", l: "TVA déductible (20%)", d: D.tva20 }, { c: "44566", l: "TVA déductible (5.5%)", d: D.tva55 },
      { c: "401", l: "Fournisseurs", cr: D.nap2 }, { c: "768", l: "Escomptes obtenus", cr: D.esc102 }]);

  /* --- TVA --- */
  const pos = D.soldeTVA >= 0;
  h += box(t("Liquidation de la TVA d'octobre", "October VAT settlement"),
    t(`<p>La TVA collectée du mois réunit les ${money(D.tvaColX)} des autres opérations et la TVA des opérations de l'énoncé, soit ${money(D.tvaCol)} au total. La TVA déductible réunit de même les ${money(D.tvaDedX)} des autres opérations et celle des opérations de l'énoncé, soit ${money(D.tvaDed)}. La différence fait apparaître ${pos ? `une TVA à décaisser de ${money(D.soldeTVA)}, dette envers l'État.` : `un crédit de TVA de ${money(-D.soldeTVA)}, créance sur l'État reportable sur les mois suivants.`}</p>`,
      `<p>Output VAT for the month combines the ${money(D.tvaColX)} of the other transactions and the VAT of the transactions above, i.e. ${money(D.tvaCol)} in total. Input VAT likewise combines the ${money(D.tvaDedX)} of the other transactions and that of the transactions above, i.e. ${money(D.tvaDed)}. The difference gives ${pos ? `VAT payable of ${money(D.soldeTVA)}, a liability towards the State.` : `a VAT credit of ${money(-D.soldeTVA)}, a receivable from the State carried forward to the following months.`}</p>`));
  h += pos ? J("31/10/N", [
      { c: "44571", l: "TVA collectée", d: D.tvaCol },
      { c: "44566", l: "TVA déductible sur B&S", cr: D.tvaDed }, { c: "44551", l: "TVA à décaisser", cr: D.soldeTVA }])
    : J("31/10/N", [
      { c: "44571", l: "TVA collectée", d: D.tvaCol }, { c: "44567", l: "Crédit de TVA à reporter", d: -D.soldeTVA },
      { c: "44566", l: "TVA déductible sur B&S", cr: D.tvaDed }]);
  return h;
};
