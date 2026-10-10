/* H1: Gestion de la paie et fiscalité sociale */
/* H2: Comptabilisation du livre de paie */
PAGE.k = {
  fr: { title: "Comptabilité 6 – Paie et charges sociales",
        'k-h1': "Gestion de la paie et fiscalité sociale",
        'k-cardtitle': "Comptabilisation du livre de paie" },
  en: { title: "Accounting 6 – Payroll and social charges",
        'k-h1': "Payroll and social charges",
        'k-cardtitle': "Recording the payroll ledger" }
};

PAGE.compute = function () {
  const D = {};
  D.n = randInt(15, 45);
  D.base = randInt(200, 600) * 1000; D.extraKind = randInt(0, 1); D.extra = randInt(20, 80) * 1000;
  D.gross = D.base + D.extra;
  D.annual = D.gross * 12 + randInt(-50, 50) * 1000; D.cfpRate = 1; D.cfp = Math.round(D.annual * D.cfpRate / 100);
  D.adv = randInt(30, 90) * 1000;
  D.eSecR = randInt(14, 16); D.eOthR = randInt(6, 8); D.eSec = Math.round(D.gross * D.eSecR / 100); D.eOth = Math.round(D.gross * D.eOthR / 100);
  D.eTot = D.eSec + D.eOth;
  D.pSecR = randInt(29, 32); D.pOthR = randInt(11, 13); D.pSec = Math.round(D.gross * D.pSecR / 100); D.pOth = Math.round(D.gross * D.pOthR / 100);
  D.pasR = randInt(5, 9); D.netSoc = D.gross - D.eTot; D.pas = Math.round(D.netSoc * D.pasR / 100);
  D.net = D.netSoc - D.pas - D.adv;
  D.paySec = D.eSec + D.pSec; D.payOth = D.eOth + D.pOth;
  return D;
};

PAGE.context = function (D) {
  return t(`Vous êtes le comptable de <strong>NéoServices SARL</strong>, qui emploie ${D.n} salariés. Vous enregistrez la paie de fin d'année et les déclarations sociales ; l'exercice est clos le 31 décembre N.<br><br><em>Règles applicables.</em> Les cotisations sont ventilées entre la Sécurité sociale (URSSAF) et les autres organismes sociaux (retraite complémentaire, assurance chômage). Par simplification, le prélèvement à la source s'applique au salaire net social. L'entreprise est redevable de la contribution à la formation professionnelle (CFP).`,
           `You are the accountant of <strong>NéoServices SARL</strong>, which employs ${D.n} people. You record the year-end payroll and the social declarations; the financial year ends on 31 December N.<br><br><em>Applicable rules.</em> Contributions are split between social security (URSSAF) and the other social bodies (supplementary pension, unemployment insurance). For simplicity, income tax withheld at source is computed on net pay after social contributions. The company is liable for the vocational-training contribution (CFP).`);
};

PAGE.enonce = function (D) {
  const extra = t(D.extraKind ? "des primes de fin d'année" : "des heures supplémentaires", D.extraKind ? "year-end bonuses" : "overtime");
  const li = [
    t(`<strong class="date">Le 15 décembre N.</strong> Versement par virement d'une avance sur salaire à plusieurs salariés, pour un total de ${money(D.adv)}.`,
      `<strong class="date">15 December N.</strong> Salary advances totalling ${money(D.adv)} are paid to several employees by bank transfer.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Édition du livre de paie du mois. Le salaire de base global s'élève à ${money(D.base)}, auquel s'ajoutent ${extra} pour ${money(D.extra)}. Cotisations salariales : Sécurité sociale ${pct(D.eSecR, 0)}, autres organismes ${pct(D.eOthR, 0)}. Cotisations patronales : Sécurité sociale ${pct(D.pSecR, 0)}, autres organismes ${pct(D.pOthR, 0)}. Prélèvement à la source : taux moyen de ${pct(D.pasR, 0)}.`,
      `<strong class="date">31 December N.</strong> The monthly payroll ledger is issued. Total basic pay is ${money(D.base)}, plus ${extra} of ${money(D.extra)}. Employee contributions: social security ${pct(D.eSecR, 0)}, other bodies ${pct(D.eOthR, 0)}. Employer contributions: social security ${pct(D.pSecR, 0)}, other bodies ${pct(D.pOthR, 0)}. Income tax withheld at source: average rate ${pct(D.pasR, 0)}.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Virement du salaire net à l'ensemble des salariés.`,
      `<strong class="date">31 December N.</strong> Net pay is transferred to all employees.`),
    t(`<strong class="date">Le 31 décembre N.</strong> Constatation de la contribution à la formation professionnelle : la masse salariale brute de l'année N s'élève à ${money(D.annual)} et le taux applicable est de ${pct(D.cfpRate, 0)}.`,
      `<strong class="date">31 December N.</strong> Recognition of the vocational-training contribution: gross payroll for year N amounts to ${money(D.annual)} and the applicable rate is ${pct(D.cfpRate, 0)}.`),
    t(`<strong class="date">Le 15 janvier N+1.</strong> Virement de l'intégralité des cotisations sociales de décembre N aux organismes concernés.`,
      `<strong class="date">15 January N+1.</strong> All social contributions for December N are paid to the relevant bodies by bank transfer.`),
    t(`<strong class="date">Le 20 janvier N+1.</strong> Règlement par virement de la contribution à la formation professionnelle de l'année écoulée.`,
      `<strong class="date">20 January N+1.</strong> The vocational-training contribution for the past year is paid by bank transfer.`)
  ];
  return head(t("Opérations réalisées", "Transactions")) +
    `<ul class="event-list">${li.map(x => `<li>${x}</li>`).join('')}</ul>` +
    work(t(`Enregistrez au journal l'ensemble de ces opérations, de l'avance de mi-décembre aux règlements de janvier N+1.`,
           `Record all these transactions in the journal, from the mid-December advance to the January N+1 payments.`));
};

PAGE.sol = function (D) {
  let h = '';
  h += box(t("Avance sur salaire (15/12/N)", "Salary advance (15/12/N)"),
    t(`<p>L'avance n'est pas une charge : c'est une créance sur le personnel (425) qui sera retenue sur la paie de décembre. Elle réduit la trésorerie de ${money(D.adv)}.</p>`,
      `<p>The advance is not an expense: it is a receivable from staff (425) that will be deducted from the December pay. It reduces cash by ${money(D.adv)}.</p>`));
  h += J("15/12/N", [{ c: "425", l: "Personnel - avances et acomptes", d: D.adv }, { c: "512", l: "Banque", cr: D.adv }]);

  h += box(t("Centralisation de la paie (31/12/N)", "Payroll entry (31/12/N)"),
    t(`<p>Le salaire brut (641) réunit la base de ${money(D.base)} et les éléments annexes de ${money(D.extra)}, soit ${money(D.gross)}. L'entreprise en retient les cotisations salariales, ${money(D.eSec)} pour la Sécurité sociale (${pct(D.eSecR, 0)}) et ${money(D.eOth)} pour les autres organismes (${pct(D.eOthR, 0)}), d'où un net social de ${money(D.netSoc)}. Elle retient ensuite l'impôt à la source, ${pct(D.pasR, 0)} de ce net social, soit ${money(D.pas)} dus à l'État (4421), puis l'avance déjà versée. Le net à payer (421) s'obtient par différence : ${money(D.gross)} − ${money(D.eTot)} − ${money(D.pas)} − ${money(D.adv)} = ${money(D.net)}. Les retenues ne sont pas des charges de l'entreprise : elles sont prélevées pour le compte des organismes, de l'État et du salarié lui-même.</p>`,
      `<p>Gross pay (641) combines basic pay of ${money(D.base)} and additional items of ${money(D.extra)}, i.e. ${money(D.gross)}. The company withholds employee contributions, ${money(D.eSec)} for social security (${pct(D.eSecR, 0)}) and ${money(D.eOth)} for the other bodies (${pct(D.eOthR, 0)}), leaving net pay after contributions of ${money(D.netSoc)}. It then withholds income tax at source, ${pct(D.pasR, 0)} of that amount, i.e. ${money(D.pas)} owed to the State (4421), and finally the advance already paid. Net pay (421) follows by difference: ${money(D.gross)} − ${money(D.eTot)} − ${money(D.pas)} − ${money(D.adv)} = ${money(D.net)}. The deductions are not expenses of the company: they are withheld on behalf of the social bodies, the State and the employee.</p>`));
  h += J("31/12/N", [
    { c: "641", l: "Rémunérations du personnel", d: D.gross },
    { c: "431", l: "Sécurité sociale", cr: D.eSec }, { c: "437", l: "Autres organismes sociaux", cr: D.eOth },
    { c: "4421", l: "Prélèvements à la source (impôt sur le revenu)", cr: D.pas },
    { c: "425", l: "Personnel - avances et acomptes", cr: D.adv }, { c: "421", l: "Personnel - rémunérations dues", cr: D.net }]);

  h += box(t("Charges patronales (31/12/N)", "Employer contributions (31/12/N)"),
    t(`<p>Les cotisations patronales sont, elles, une charge de l'entreprise (645), calculée sur le brut de ${money(D.gross)} : ${money(D.pSec)} pour la Sécurité sociale (${pct(D.pSecR, 0)}) et ${money(D.pOth)} pour les autres organismes (${pct(D.pOthR, 0)}), soit ${money(D.pSec + D.pOth)}.</p>`,
      `<p>Employer contributions, by contrast, are an expense of the company (645), computed on the gross pay of ${money(D.gross)}: ${money(D.pSec)} for social security (${pct(D.pSecR, 0)}) and ${money(D.pOth)} for the other bodies (${pct(D.pOthR, 0)}), i.e. ${money(D.pSec + D.pOth)}.</p>`));
  h += J("31/12/N", [{ c: "645", l: "Charges de sécurité sociale et de prévoyance", d: D.pSec + D.pOth }, { c: "431", l: "Sécurité sociale", cr: D.pSec }, { c: "437", l: "Autres organismes sociaux", cr: D.pOth }]);

  h += box(t("Paiement des salaires nets (31/12/N)", "Payment of net pay (31/12/N)"),
    t(`<p>Le virement de ${money(D.net)} solde la dette envers le personnel.</p>`, `<p>The transfer of ${money(D.net)} clears the liability towards staff.</p>`));
  h += J("31/12/N", [{ c: "421", l: "Personnel - rémunérations dues", d: D.net }, { c: "512", l: "Banque", cr: D.net }]);

  h += box(t("Contribution à la formation professionnelle (31/12/N)", "Vocational-training contribution (31/12/N)"),
    t(`<p>La CFP est un impôt assis sur les salaires : ${money(D.annual)} × ${pct(D.cfpRate, 0)} = ${money(D.cfp)}, enregistré en 633 ; la dette est portée au crédit des autres organismes sociaux (437) en attendant son règlement.</p>`,
      `<p>The CFP is a payroll-based tax: ${money(D.annual)} × ${pct(D.cfpRate, 0)} = ${money(D.cfp)}, recorded in 633; the liability is credited to the other social bodies (437) until payment.</p>`));
  h += J("31/12/N", [{ c: "633", l: "Impôts, taxes et versements assimilés sur rémun.", d: D.cfp }, { c: "437", l: "Autres organismes sociaux", cr: D.cfp }]);

  h += box(t("Règlement des organismes sociaux (15/01/N+1)", "Payment to the social bodies (15/01/N+1)"),
    t(`<p>L'entreprise reverse les cotisations salariales et patronales de décembre. Sécurité sociale : ${money(D.eSec)} + ${money(D.pSec)} = ${money(D.paySec)}. Autres organismes : ${money(D.eOth)} + ${money(D.pOth)} = ${money(D.payOth)}. La CFP, elle, n'est pas encore réglée.</p>`,
      `<p>The company pays over the employee and employer contributions for December. Social security: ${money(D.eSec)} + ${money(D.pSec)} = ${money(D.paySec)}. Other bodies: ${money(D.eOth)} + ${money(D.pOth)} = ${money(D.payOth)}. The CFP is not yet paid.</p>`));
  h += J("15/01/N+1", [{ c: "431", l: "Sécurité sociale", d: D.paySec }, { c: "437", l: "Autres organismes sociaux", d: D.payOth }, { c: "512", l: "Banque", cr: D.paySec + D.payOth }]);

  h += box(t("Règlement de la CFP (20/01/N+1)", "Payment of the CFP (20/01/N+1)"),
    t(`<p>Le paiement de ${money(D.cfp)} solde le compte 437 au titre de l'année N.</p>`, `<p>The payment of ${money(D.cfp)} clears account 437 for year N.</p>`));
  h += J("20/01/N+1", [{ c: "437", l: "Autres organismes sociaux", d: D.cfp }, { c: "512", l: "Banque", cr: D.cfp }]);
  return h;
};
