/* H1: Immobilisations atypiques : don, échange et démantèlement */
/* H2: Trois dossiers clients atypiques */
PAGE.k = {
  fr: { title: "Comptabilité 10 – Immobilisations atypiques",
        'k-h1': "Immobilisations atypiques : don, échange et démantèlement",
        'k-cardtitle': "Trois dossiers clients atypiques" },
  en: { title: "Accounting 10 – Unusual fixed assets",
        'k-h1': "Unusual fixed assets: gift, exchange and decommissioning",
        'k-cardtitle': "Three unusual client files" }
};
Object.assign(LBL, {
  "Installations complexes – Actif support": "Complex installations, underlying asset",
  "Installations complexes – Actif de démantèlement": "Complex installations, decommissioning asset",
  "Amortissement de l'actif support": "Accumulated depreciation, underlying asset",
  "Amortissement de l'actif de démantèlement": "Accumulated depreciation, decommissioning asset"
});
const ANIMALS = [{ fr: "lionceau", en: "lion cub", parc: "Parc zoologique de Beaumont" }, { fr: "girafon", en: "giraffe calf", parc: "Réserve animalière du Marais" }, { fr: "éléphanteau", en: "elephant calf", parc: "Zoo de la Vallée Verte" }, { fr: "tigreau", en: "tiger cub", parc: "Parc animalier des Cimes" }];
const CLUBS = ["FC Girondin", "Racing Nordique", "AS Vallée", "Stade Occitan"];
const PLAYERS = ["Julien Fabre", "Karim Belloc", "Thomas Lenoir", "Antoine Ricard", "Marc Delvaux", "Yanis Choukri"];
const PLANTS = [{ fr: "une plateforme d'extraction offshore", en: "an offshore extraction platform", co: "Atlantis Offshore SAS" }, { fr: "un site de stockage de déchets industriels", en: "an industrial-waste storage site", co: "GéoRessources SA" }, { fr: "un parc éolien en mer", en: "an offshore wind farm", co: "Nordic Energy SAS" }, { fr: "une usine de traitement chimique", en: "a chemical processing plant", co: "ChimEco Industries" }];
const MOIS = { fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"], en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] };
function p2(n) { return n < 10 ? '0' + n : '' + n; }
function dTxt(d, m, y) { return t(`${d === 1 ? '1<sup>er</sup>' : d} ${MOIS.fr[m - 1]} ${y}`, `${d} ${MOIS.en[m - 1]} ${y}`); }

PAGE.compute = function () {
  const D = {};
  D.an = pick(ANIMALS); D.bd = randInt(1, 28); D.bm = randInt(3, 11); D.cm = D.bm + 3; D.cy = 'N';
  if (D.cm > 12) { D.cm -= 12; D.cy = 'N+1'; }
  D.vv1 = randInt(30, 120) * 100;
  const i1 = randInt(0, 3); let i2 = randInt(0, 3); while (i2 === i1) i2 = randInt(0, 3);
  D.clubA = CLUBS[i1]; D.clubB = CLUBS[i2];
  const j1 = randInt(0, 5); let j2 = randInt(0, 5); while (j2 === j1) j2 = randInt(0, 5);
  D.pA = PLAYERS[j1]; D.pB = PLAYERS[j2];
  D.brutA = randInt(150, 500) * 1000; D.amA = Math.round(D.brutA * randInt(30, 70) / 100 / 100) * 100; D.vncA = D.brutA - D.amA;
  D.gainA = randInt(20, 80) * 1000; D.vvA = D.vncA + D.gainA; D.soulte = randInt(50, 200) * 1000; D.vvB = D.vvA + D.soulte;
  D.pl = pick(PLANTS); D.prix = randInt(200, 900) * 1000; D.tauxDem = randInt(10, 30);
  D.dem = Math.round(D.prix * D.tauxDem / 100 / 100) * 100; D.dur = [10, 15, 20, 25][randInt(0, 3)];
  D.tva3 = r2(D.prix * 0.2); D.dotS = r2(D.prix / D.dur); D.dotD = r2(D.dem / D.dur); D.dotT = r2(D.dotS + D.dotD);
  return D;
};

PAGE.context = function (D) {
  return t(`Vous effectuez un stage en cabinet d'expertise comptable. Votre maître de stage vous confie trois dossiers portant chacun sur une acquisition d'immobilisation qui sort du cadre de l'achat au comptant ou à crédit. L'exercice de chaque entreprise coïncide avec l'année civile.`,
           `You are an intern in an accounting firm. Your supervisor hands you three client files, each concerning the acquisition of a fixed asset outside the usual cash or credit purchase. Each company's financial year matches the calendar year.`);
};

PAGE.enonce = function (D) {
  const tbl = `<div class="kit-tw"><table class="data">
    <tr><th></th><th class="r">${t("Joueur cédé", "Player transferred out")} (${D.pA})</th><th class="r">${t("Joueur reçu", "Player received")} (${D.pB})</th></tr>
    <tr><td>${t("Valeur brute d'origine", "Original cost")}</td><td class="r">${money(D.brutA)}</td><td class="r">—</td></tr>
    <tr><td>${t("Cumul des amortissements", "Accumulated amortisation")}</td><td class="r">${money(D.amA)}</td><td class="r">—</td></tr>
    <tr><td>${t("Valeur vénale retenue pour l'échange", "Fair value used for the exchange")}</td><td class="r">${money(D.vvA)}</td><td class="r">${t("à déterminer", "to be determined")}</td></tr>
    <tr><td>${t(`Soulte versée par ${D.clubA} (virement)`, `Cash paid by ${D.clubA} (bank transfer)`)}</td><td class="r" colspan="2">${money(D.soulte)}</td></tr>
  </table></div>`;
  return head(t("Dossier 1 — Acquisition à titre gratuit", "File 1 — Asset acquired free of charge")) +
    `<p>${t(`Le ${dTxt(D.bd, D.bm, 'N')}, un ${D.an.fr} naît en captivité au <strong>${D.an.parc}</strong>. Conformément à la doctrine comptable, l'établissement attend la confirmation de la viabilité de l'animal, fixée à trois mois, avant de l'inscrire à l'actif. Le ${dTxt(D.bd, D.cm, D.cy)}, le vétérinaire confirme cette viabilité ; la valeur vénale de l'animal est alors estimée à ${money(D.vv1)}.`,
                 `On ${dTxt(D.bd, D.bm, 'N')}, a ${D.an.en} is born in captivity at <strong>${D.an.parc}</strong>. In line with accounting doctrine, the zoo waits for the animal's viability to be confirmed, after three months, before recognising it as an asset. On ${dTxt(D.bd, D.cm, D.cy)}, the vet confirms its viability; the animal's fair value is then estimated at ${money(D.vv1)}.`)}</p>` +
    `<p class="ex-head later">${t("Dossier 2 — Acquisition par voie d'échange", "File 2 — Acquisition by exchange")}</p>` +
    `<p>${t(`Le club <strong>${D.clubA}</strong> échange l'un de ses joueurs, ${D.pA}, contre ${D.pB}, joueur du club <strong>${D.clubB}</strong>. Les caractéristiques comptables du joueur cédé et la soulte versée sont connues ; la valeur d'entrée du joueur reçu est à déterminer.`,
                 `<strong>${D.clubA}</strong> exchanges one of its players, ${D.pA}, for ${D.pB}, a player of <strong>${D.clubB}</strong>. The accounting data of the player transferred out and the cash paid are known; the entry value of the player received is to be determined.`)}</p>` + tbl +
    `<p class="ex-head later">${t("Dossier 3 — Coûts de démantèlement", "File 3 — Decommissioning costs")}</p>` +
    `<p>${t(`Le 1<sup>er</sup> janvier N, <strong>${D.pl.co}</strong> fait installer ${D.pl.fr} pour ${money(D.prix)} HT (TVA 20 %), réglés par virement à la mise en service. Le contrat d'exploitation impose une obligation légale de démantèlement en fin de vie, dont le coût est estimé dès l'acquisition à ${pct(D.tauxDem, 0)} du prix d'achat HT. La durée d'utilisation est de ${D.dur} ans, en amortissement linéaire.`,
                 `On 1 January N, <strong>${D.pl.co}</strong> has ${D.pl.en} installed for ${money(D.prix)} before VAT (VAT 20%), paid by bank transfer when brought into use. The operating licence imposes a legal obligation to decommission the installation at the end of its life, the cost of which is estimated from the outset at ${pct(D.tauxDem, 0)} of the purchase price before VAT. The useful life is ${D.dur} years, straight-line depreciation.`)}</p>` +
    work(t(`Pour chacun des trois dossiers, enregistrez au journal les écritures nécessaires, y compris, le cas échéant, les écritures d'inventaire au 31 décembre N.`,
           `For each of the three files, record the required journal entries, including, where relevant, the year-end entries at 31 December N.`));
};

PAGE.sol = function (D) {
  let h = '';
  const dc = `${p2(D.bd)}/${p2(D.cm)}/${D.cy}`;
  h += `<p class="dossier-title">${t("Dossier 1 — Acquisition à titre gratuit", "File 1 — Asset acquired free of charge")}</p>`;
  h += box(t(`Entrée du ${D.an.fr} à l'actif (${dc})`, `Recognition of the ${D.an.en} (${dc})`),
    t(`<p>Une immobilisation reçue à titre gratuit est comptabilisée à sa valeur vénale, en contrepartie d'un produit exceptionnel. La date d'enregistrement n'est pas celle de la naissance : selon l'article 321-11 du PCG, l'actif n'est reconnu qu'à partir du moment où il est démontré qu'il procurera des avantages économiques futurs, c'est-à-dire ici à la confirmation de la viabilité, trois mois après la naissance. L'écriture est donc passée le ${dc} pour ${money(D.vv1)}.</p>`,
      `<p>A fixed asset received free of charge is recognised at its fair value, against exceptional income. The recognition date is not the birth date: under article 321-11 of the French chart of accounts, the asset is recognised only once it is demonstrated that it will generate future economic benefits, i.e. here when viability is confirmed, three months after birth. The entry is therefore recorded on ${dc} for ${money(D.vv1)}.</p>`));
  h += J(dc, [{ c: "2", l: "Immobilisations corporelles (animaux)", d: D.vv1 }, { c: "7788", l: "Autres produits exceptionnels", cr: D.vv1 }]);

  h += `<p class="dossier-title">${t("Dossier 2 — Acquisition par voie d'échange", "File 2 — Acquisition by exchange")}</p>`;
  const de = t("Date de l'échange", "Date of the exchange");
  h += box(t(`Étape 1 : sortie du joueur cédé (${D.pA})`, `Step 1: derecognition of the player transferred out (${D.pA})`),
    t(`<p>Un échange s'analyse comme une cession suivie d'une acquisition. On sort d'abord l'élément cédé : sa valeur nette comptable est ${money(D.brutA)} − ${money(D.amA)} = ${money(D.vncA)}, constatée en charge (675) ; le compte d'immobilisation est soldé pour la valeur brute et les amortissements cumulés sont annulés.</p>`,
      `<p>An exchange is treated as a disposal followed by an acquisition. The asset given up is derecognised first: its carrying amount is ${money(D.brutA)} − ${money(D.amA)} = ${money(D.vncA)}, recorded as an expense (675); the asset account is cleared at cost and accumulated amortisation is reversed.</p>`));
  h += J(de, [{ c: "2808", l: "Amort. des autres immob. incorporelles", d: D.amA }, { c: "675", l: "Valeur comptable des éléments d'actif cédés", d: D.vncA }, { c: "208", l: "Autres immobilisations incorporelles", cr: D.brutA }]);
  h += box(t(`Étape 2 : entrée du joueur reçu (${D.pB})`, `Step 2: recognition of the player received (${D.pB})`),
    t(`<p>Le joueur reçu est payé de deux manières : par le joueur cédé, pour sa valeur vénale de ${money(D.vvA)}, enregistrée en produit de cession (775), et par la soulte de ${money(D.soulte)}. Sa valeur d'entrée est donc ${money(D.vvA)} + ${money(D.soulte)} = ${money(D.vvB)}. En rapprochant les deux écritures, l'opération dégage une plus-value de cession sur ${D.pA} de ${money(D.vvA)} − ${money(D.vncA)} = ${money(D.gainA)}.</p>`,
      `<p>The player received is paid for in two ways: with the player given up, at his fair value of ${money(D.vvA)}, recorded as disposal proceeds (775), and with the cash payment of ${money(D.soulte)}. His entry value is therefore ${money(D.vvA)} + ${money(D.soulte)} = ${money(D.vvB)}. Taken together, the two entries show a gain on the disposal of ${D.pA} of ${money(D.vvA)} − ${money(D.vncA)} = ${money(D.gainA)}.</p>`));
  h += J(de, [{ c: "208", l: "Autres immobilisations incorporelles", d: D.vvB }, { c: "512", l: "Banque", cr: D.soulte }, { c: "775", l: "Produits des cessions d'éléments d'actif", cr: D.vvA }]);

  h += `<p class="dossier-title">${t("Dossier 3 — Coûts de démantèlement", "File 3 — Decommissioning costs")}</p>`;
  h += box(t("Acquisition et provision pour démantèlement (01/01/N)", "Acquisition and decommissioning provision (01/01/N)"),
    t(`<p>Le coût de démantèlement estimé, ${pct(D.tauxDem, 0)} × ${money(D.prix)} = ${money(D.dem)}, est un composant distinct de l'installation, inscrit dans une subdivision du compte d'actif ; sa contrepartie est une provision pour remise en état (1581) du même montant. La TVA déductible, ${money(D.tva3)}, ne porte que sur le prix facturé par le fournisseur : le coût de démantèlement ne correspond à aucune facture.</p>`,
      `<p>The estimated decommissioning cost, ${pct(D.tauxDem, 0)} × ${money(D.prix)} = ${money(D.dem)}, is a separate component of the installation, recorded in a sub-account of the asset; its counterpart is a provision for site restoration (1581) of the same amount. Deductible VAT, ${money(D.tva3)}, relates only to the price invoiced by the supplier: the decommissioning cost corresponds to no invoice.</p>`));
  h += J("01/01/N", [
    { c: "21511-a", l: "Installations complexes – Actif support", d: D.prix }, { c: "21511-b", l: "Installations complexes – Actif de démantèlement", d: D.dem },
    { c: "44562", l: "État – TVA sur immobilisations", d: D.tva3 },
    { c: "404", l: "Fournisseurs d'immobilisations", cr: D.prix + D.tva3 }, { c: "1581", l: "Provisions pour remise en état", cr: D.dem }]);
  h += box(t("Amortissement de l'exercice N (31/12/N)", "Depreciation for year N (31/12/N)"),
    t(`<p>Les deux composants s'amortissent séparément sur ${D.dur} ans : ${money(D.prix)} / ${D.dur} = ${money(D.dotS)} pour l'actif support et ${money(D.dem)} / ${D.dur} = ${money(D.dotD)} pour l'actif de démantèlement, soit ${money(D.dotT)} au total. Après cette première annuité, les valeurs nettes comptables sont de ${money(D.prix - D.dotS)} et ${money(D.dem - D.dotD)}.</p>`,
      `<p>The two components are depreciated separately over ${D.dur} years: ${money(D.prix)} / ${D.dur} = ${money(D.dotS)} for the underlying asset and ${money(D.dem)} / ${D.dur} = ${money(D.dotD)} for the decommissioning asset, i.e. ${money(D.dotT)} in total. After this first year, the carrying amounts are ${money(D.prix - D.dotS)} and ${money(D.dem - D.dotD)}.</p>`));
  h += J("31/12/N", [{ c: "68112", l: "Dotations aux amort. des immob. corporelles", d: D.dotT }, { c: "28151-a", l: "Amortissement de l'actif support", cr: D.dotS }, { c: "28151-b", l: "Amortissement de l'actif de démantèlement", cr: D.dotD }]);
  return h;
};
