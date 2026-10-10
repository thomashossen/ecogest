/* H1: Capitaux propres et affectation du résultat */
/* H2: De la création à l'affectation du premier bénéfice */
PAGE.k = {
  fr: { title: "Comptabilité 4 – Capitaux propres et affectation du résultat",
        'k-h1': "Capitaux propres et affectation du résultat",
        'k-cardtitle': "De la création à l'affectation du premier bénéfice" },
  en: { title: "Accounting 4 – Equity and profit appropriation",
        'k-h1': "Equity and profit appropriation",
        'k-cardtitle': "From incorporation to the appropriation of the first profit" }
};

PAGE.compute = function () {
  const D = {};
  D.capNum = randInt(20, 80) * 1000; D.capNat = randInt(10, 30) * 1000; D.capital = D.capNum + D.capNat;
  D.cca = randInt(15, 40) * 1000; D.ccaRemb = randInt(5, D.cca / 1000 - 5) * 1000;
  D.benef = randInt(40, 120) * 1000;
  D.resLeg = Math.min(D.benef * 0.05, D.capital * 0.10); D.plafond = D.capital * 0.10;
  D.resFac = randInt(5, 15) * 1000;
  const reste = D.benef - D.resLeg - D.resFac;
  D.div = randInt(15, Math.floor(reste / 1000) - 2) * 1000;
  D.ran = r2(D.benef - D.resLeg - D.resFac - D.div);
  return D;
};

PAGE.context = function (D) {
  return t(`La société <strong>InnoTech SAS</strong> a été constituée le 2 janvier N ; son exercice comptable coïncide avec l'année civile. Son développement ayant été rapide dès la première année, l'assemblée générale ordinaire se réunit l'année suivante pour statuer sur l'affectation de son tout premier résultat.`,
           `<strong>InnoTech SAS</strong> was incorporated on 2 January N; its financial year matches the calendar year. As the business grew quickly from the start, the annual general meeting is held the following year to decide on the appropriation of its very first profit.`);
};

PAGE.enonce = function (D) {
  const li = [
    t(`<strong class="date">Le 2 janvier N.</strong> Création de la société. Les actionnaires réalisent un apport en numéraire de ${money(D.capNum)}, intégralement libéré et versé sur le compte bancaire, et apportent du matériel industriel évalué à ${money(D.capNat)}. Pour soutenir la trésorerie de démarrage, l'un d'eux consent en outre une avance en compte courant d'associé de ${money(D.cca)} par virement. L'ensemble est constaté à cette date.`,
      `<strong class="date">2 January N.</strong> Incorporation. The shareholders contribute ${money(D.capNum)} in cash, fully paid up and deposited in the bank account, and industrial equipment valued at ${money(D.capNat)}. To support the opening cash position, one of them also makes a shareholder loan of ${money(D.cca)} by bank transfer. Everything is recorded on that date.`),
    t(`<strong class="date">Le 15 septembre N.</strong> La trésorerie le permettant, la société rembourse partiellement le compte courant d'associé par un virement de ${money(D.ccaRemb)}.`,
      `<strong class="date">15 September N.</strong> Cash permitting, the company partly repays the shareholder loan by a bank transfer of ${money(D.ccaRemb)}.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Clôture du premier exercice. Après enregistrement de toutes les opérations, le compte de résultat fait apparaître un bénéfice net de ${money(D.benef)}. Aucune écriture n'est demandée à cette date.`,
      `<strong class="date">31 December N.</strong> Close of the first financial year. Once all transactions are recorded, the income statement shows a net profit of ${money(D.benef)}. No entry is required on that date.`),
    t(`<strong class="date">Le 18 mai N+1.</strong> Assemblée générale ordinaire. Les actionnaires affectent le bénéfice de l'exercice N comme suit : dotation à la réserve légale dans les conditions fixées par la loi ; dotation à une réserve facultative de ${money(D.resFac)} ; distribution d'un dividende global de ${money(D.div)} ; affectation du solde en report à nouveau.`,
      `<strong class="date">18 May N+1.</strong> Annual general meeting. The shareholders appropriate the profit of year N as follows: allocation to the legal reserve as required by law; allocation of ${money(D.resFac)} to an optional reserve; distribution of a total dividend of ${money(D.div)}; carry-forward of the balance as retained earnings.`)
  ];
  return head(t("Opérations réalisées, par ordre chronologique", "Transactions, in chronological order")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez au journal la constitution du 2 janvier N, le remboursement du 15 septembre N et l'affectation du résultat décidée le 18 mai N+1.`,
           `Record in the journal the incorporation on 2 January N, the repayment on 15 September N and the appropriation of profit decided on 18 May N+1.`));
};

PAGE.sol = function (D) {
  let h = '';
  h += box(t("Constitution et apports (02/01/N)", "Incorporation and contributions (02/01/N)"),
    t(`<p>Le capital social (1013) est la somme de l'apport en numéraire, ${money(D.capNum)}, et de l'apport en nature, ${money(D.capNat)}, soit ${money(D.capital)}. L'avance de l'actionnaire n'est pas un apport : c'est une dette financière de la société envers lui, inscrite au crédit du compte courant d'associé (4551) pour ${money(D.cca)}. La banque reçoit le numéraire et l'avance, soit ${money(D.capNum + D.cca)}, et le matériel industriel entre à l'actif immobilisé.</p>`,
      `<p>Share capital (1013) is the sum of the cash contribution, ${money(D.capNum)}, and the contribution in kind, ${money(D.capNat)}, i.e. ${money(D.capital)}. The shareholder loan is not a contribution: it is a financial liability of the company towards the shareholder, credited to the current account (4551) for ${money(D.cca)}. The bank receives the cash contribution and the loan, ${money(D.capNum + D.cca)}, and the industrial equipment is recognised as a fixed asset.</p>`));
  h += J("02/01/N", [
    { c: "512", l: "Banque", d: D.capNum + D.cca }, { c: "2154", l: "Matériel industriel (apport en nature)", d: D.capNat },
    { c: "1013", l: "Capital souscrit appelé versé", cr: D.capital }, { c: "4551", l: "Associés - comptes courants", cr: D.cca }]);

  h += box(t("Remboursement partiel du compte courant (15/09/N)", "Partial repayment of the shareholder loan (15/09/N)"),
    t(`<p>Le compte courant d'associé fonctionne comme un prêt : son remboursement éteint une partie de la dette envers l'actionnaire. On débite 4551 par le crédit de la banque pour ${money(D.ccaRemb)} ; le solde du compte courant tombe à ${money(D.cca - D.ccaRemb)}.</p>`,
      `<p>The shareholder current account works like a loan: its repayment extinguishes part of the liability. Account 4551 is debited and the bank credited for ${money(D.ccaRemb)}; the remaining balance of the current account is ${money(D.cca - D.ccaRemb)}.</p>`));
  h += J("15/09/N", [{ c: "4551", l: "Associés - comptes courants", d: D.ccaRemb }, { c: "512", l: "Banque", cr: D.ccaRemb }]);

  h += box(t("Affectation du premier résultat (18/05/N+1)", "Appropriation of the first profit (18/05/N+1)"),
    t(`<p>Le bénéfice à répartir est de ${money(D.benef)} ; s'agissant du premier exercice, aucun report à nouveau antérieur n'intervient. La loi impose une dotation à la réserve légale de 5 % du bénéfice tant que celle-ci n'atteint pas 10 % du capital : ${money(D.benef)} × 5 % = ${money(D.benef * 0.05)}, montant inférieur au plafond de ${money(D.plafond)}, donc retenu en totalité. La réserve facultative décidée par l'assemblée est de ${money(D.resFac)} et les dividendes (457) de ${money(D.div)}. Le reliquat est porté en report à nouveau créditeur (110) : ${money(D.benef)} − ${money(D.resLeg)} − ${money(D.resFac)} − ${money(D.div)} = ${money(D.ran)}. L'écriture solde le compte 120 et répartit le bénéfice entre réserves, dette envers les actionnaires et report.</p>`,
      `<p>The profit to be appropriated is ${money(D.benef)}; as this is the first year, there are no prior retained earnings. The law requires an allocation of 5% of the profit to the legal reserve until it reaches 10% of the share capital: ${money(D.benef)} × 5% = ${money(D.benef * 0.05)}, below the ${money(D.plafond)} ceiling, so the full amount is allocated. The optional reserve voted by the meeting is ${money(D.resFac)} and dividends (457) amount to ${money(D.div)}. The remainder is carried forward as retained earnings (110): ${money(D.benef)} − ${money(D.resLeg)} − ${money(D.resFac)} − ${money(D.div)} = ${money(D.ran)}. The entry clears account 120 and splits the profit between reserves, the liability towards shareholders and the carry-forward.</p>`));
  h += J("18/05/N+1", [
    { c: "120", l: "Résultat de l'exercice (bénéfice)", d: D.benef },
    { c: "1061", l: "Réserve légale", cr: D.resLeg }, { c: "1068", l: "Autres réserves (facultatives)", cr: D.resFac },
    { c: "457", l: "Associés - dividendes à payer", cr: D.div }, { c: "110", l: "Report à nouveau (solde créditeur)", cr: D.ran }]);
  return h;
};
