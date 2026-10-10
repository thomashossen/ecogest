<script>
/* ============================================================
   SOCLE COMMUN DE LA FAMILLE « COMPTABILITÉ GÉNÉRALE » (compt1 … compt10)
   Identique sur toutes les pages : langue, tirages, nombres, journal.
   Chaque page y ajoute son exercice (objet PAGE).
   ============================================================ */
let LANG = 'fr';
let currentSeed = 0;
const PAGE = {};
const I18N = {
  fr: {
    htmlLang: 'fr', locale: 'fr-FR',
    'k-badge': 'INFORMATION COMPTABLE ET FINANCIÈRE',
    'k-seed': 'Seed de reproductibilité', 'k-gen': 'Générer',
    'k-welcome': 'Configurez les paramètres et cliquez sur Générer pour créer un nouvel exercice.',
    'k-seedbadge': 'Seed active\u00a0:', 'k-tag-ex': 'Énoncé', 'k-tag-sol': 'Corrigé',
    showSol: 'Afficher le corrigé', hideSol: 'Masquer le corrigé',
    work: 'Travail à faire', account: 'N° de compte', label: 'Intitulé', debit: 'Débit', credit: 'Crédit',
    journalOf: 'Journal de'
  },
  en: {
    htmlLang: 'en', locale: 'en-GB',
    'k-badge': 'ACCOUNTING AND FINANCIAL INFORMATION',
    'k-seed': 'Reproducibility seed', 'k-gen': 'Generate',
    'k-welcome': 'Set the parameters and click Generate to create a new exercise.',
    'k-seedbadge': 'Active seed:', 'k-tag-ex': 'Problem', 'k-tag-sol': 'Solution',
    showSol: 'Show the solution', hideSol: 'Hide the solution',
    work: 'Required', account: 'Account', label: 'Description', debit: 'Debit', credit: 'Credit',
    journalOf: 'Journal of'
  }
};
/* texte selon la langue */
function t(fr, en) { return LANG === 'fr' ? fr : en; }

/* ---------- tirages reproductibles (Mulberry32) ---------- */
let random = Math.random;
function seedPRNG(seed) {
  let s = seed >>> 0;
  return function () {
    let x = s += 0x6D2B79F5;
    x = Math.imul(x ^ x >>> 15, x | 1);
    x ^= x + Math.imul(x ^ x >>> 7, x | 61);
    return ((x ^ x >>> 14) >>> 0) / 4294967296;
  };
}
function randInt(min, max) { return Math.floor(random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(random() * arr.length)]; }

/* ---------- nombres ----------
   Montants arrondis au centime ; séparateurs selon la langue. */
function r2(x) { return Math.round(x * 100 + 1e-9) / 100; }
function num(x, d) {
  if (d === undefined) d = 2;
  const p = Math.pow(10, d), v = Math.round(x * p + 1e-9) / p;
  return v.toLocaleString(I18N[LANG].locale, { minimumFractionDigits: d, maximumFractionDigits: d });
}
function money(x) { return num(x, 2) + '\u00a0€'; }
function int(x) { return Math.round(x).toLocaleString(I18N[LANG].locale); }
function pct(x, d) { return num(x, d === undefined ? 2 : d) + (LANG === 'fr' ? '\u00a0%' : '%'); }
function dmy(d, m, y) { return LANG === 'fr' ? d + '/' + m + '/' + y : d + '/' + m + '/' + y; }

/* ---------- intitulés de comptes (PCG) ---------- */
const LBL = {
  "Capital souscrit appelé versé": "Share capital (called-up, paid)",
  "Réserve légale": "Legal reserve",
  "Autres réserves (facultatives)": "Other (optional) reserves",
  "Report à nouveau (solde créditeur)": "Retained earnings (credit balance)",
  "Résultat de l'exercice (bénéfice)": "Profit for the year",
  "Subventions d'équipement": "Equipment grants",
  "Subv. d'investissement inscrites au CR": "Investment grants transferred to income",
  "Provisions pour litiges": "Provisions for litigation",
  "Provisions pour pertes de change": "Provisions for foreign-exchange losses",
  "Provisions pour risques": "Provisions for risks",
  "Provisions pour remise en état": "Provisions for site restoration",
  "Emprunts auprès des établissements de crédit": "Bank borrowings",
  "Intérêts courus sur emprunts": "Accrued interest on borrowings",
  "Immobilisations corporelles (animaux)": "Property, plant and equipment (livestock)",
  "Autres immobilisations incorporelles": "Other intangible assets",
  "Matériel industriel (apport en nature)": "Industrial equipment (contribution in kind)",
  "Matériel de transport": "Vehicles",
  "Matériel informatique (serveurs ASIC)": "Computer equipment (ASIC servers)",
  "Amort. des autres immob. incorporelles": "Accumulated amortisation, other intangibles",
  "Amortissement du matériel informatique": "Accumulated depreciation, computer equipment",
  "Provisions pour dépréciation des stocks": "Inventory impairment",
  "Fournisseurs": "Trade payables",
  "Fournisseurs d'immobilisations": "Payables on fixed assets",
  "Fournisseurs - factures non parvenues": "Suppliers, invoices not yet received",
  "Fournisseurs - créances emballages": "Suppliers, returnable packaging receivable",
  "Clients": "Trade receivables",
  "Clients douteux ou litigieux": "Doubtful receivables",
  "Clients - factures à établir": "Customers, invoices to be issued",
  "Clients - dettes emballages": "Customers, returnable packaging payable",
  "Personnel - rémunérations dues": "Staff, wages payable",
  "Personnel - avances et acomptes": "Staff, advances",
  "Sécurité sociale": "Social security",
  "Autres organismes sociaux": "Other social bodies",
  "État – Subventions à recevoir": "Government, grants receivable",
  "Prélèvements à la source (impôt sur le revenu)": "Income tax withheld at source",
  "Opérations particulières avec l'État": "Special transactions with the State",
  "TVA à décaisser": "VAT payable",
  "TVA déductible sur immobilisations": "Input VAT on fixed assets",
  "État – TVA sur immobilisations": "Input VAT on fixed assets",
  "TVA déductible (20%)": "Input VAT (20%)",
  "TVA déductible (5.5%)": "Input VAT (5.5%)",
  "TVA déductible sur B&S": "Input VAT on goods and services",
  "TVA déductible sur autres B&S": "Input VAT on goods and services",
  "Crédit de TVA à reporter": "VAT credit carried forward",
  "TVA collectée": "Output VAT",
  "TVA collectée (20%)": "Output VAT (20%)",
  "TVA collectée (5.5%)": "Output VAT (5.5%)",
  "TVA sur factures non parvenues": "VAT on invoices not yet received",
  "TVA sur factures à établir": "VAT on invoices to be issued",
  "Associés - comptes courants": "Shareholders' current accounts",
  "Associés - dividendes à payer": "Dividends payable",
  "Différences de conversion – Actif": "Translation differences, assets",
  "Différences d'évaluation de jetons - Actif": "Token valuation differences, assets",
  "Différences d'évaluation de jetons - Passif": "Token valuation differences, liabilities",
  "Charges constatées d'avance": "Prepaid expenses",
  "Produits constatés d'avance": "Deferred income",
  "Provisions pour dépréciation des comptes de clients": "Allowance for doubtful receivables",
  "Banque": "Bank",
  "Jetons détenus (actifs numériques)": "Tokens held (digital assets)",
  "Jetons détenus (sortie VNC)": "Tokens held (derecognised at carrying amount)",
  "Achats d'emballages": "Purchases of packaging",
  "Fournitures non stockables (électricité)": "Non-stored supplies (electricity)",
  "Achats (20%)": "Purchases (20%)",
  "Achats (5.5%)": "Purchases (5.5%)",
  "Achats de marchandises": "Purchases of goods for resale",
  "Redevances de crédit-bail mobilier": "Equipment lease payments",
  "Primes d'assurances": "Insurance premiums",
  "Divers (frais de formation)": "Sundry (training costs)",
  "Transports sur achats": "Freight on purchases",
  "Impôts, taxes et versements assimilés sur rémun.": "Payroll taxes",
  "Rémunérations du personnel": "Staff remuneration",
  "Charges de sécurité sociale et de prévoyance": "Social security and welfare costs",
  "Pertes sur créances irrécouvrables": "Bad-debt losses",
  "Intérêts des emprunts et dettes": "Interest on borrowings",
  "Pertes sur cessions d'actifs numériques": "Losses on disposal of digital assets",
  "Escomptes accordés": "Settlement discounts granted",
  "Valeur comptable des éléments d'actif cédés": "Carrying amount of assets sold",
  "Valeurs comptables des éléments d'actif cédés": "Carrying amount of assets sold",
  "Dotations aux amort. sur immo. corporelles": "Depreciation expense, PP&E",
  "Dotations aux amortissements sur immo. corp.": "Depreciation expense, PP&E",
  "Dotations aux amort. des immob. corporelles": "Depreciation expense, PP&E",
  "Dotations aux prov. pour risques et charges d'exp.": "Provision expense, operating risks",
  "Dotations aux prov. pour dép. de l'actif circulant": "Impairment expense, current assets",
  "Dotations aux provisions financières": "Financial provision expense",
  "Dotations aux provisions": "Provision expense",
  "Ventes de produits finis": "Sales of finished goods",
  "Prestations de services": "Services rendered",
  "Prestations de services (minage)": "Services rendered (mining)",
  "Ventes (20%)": "Sales (20%)",
  "Ventes (5.5%)": "Sales (5.5%)",
  "Ventes de marchandises": "Sales of goods",
  "Ports et frais facturés": "Freight recharged",
  "Autres produits accessoires": "Other ancillary income",
  "Gains sur cessions d'actifs numériques": "Gains on disposal of digital assets",
  "Escomptes obtenus": "Settlement discounts received",
  "Produits des cessions d'éléments d'actif": "Proceeds from disposal of assets",
  "Quote-part des subv. d'inv. virée au résultat": "Share of investment grant released to income",
  "Autres produits exceptionnels": "Other exceptional income",
  "Reprises sur prov. pour risques et charges d'exp.": "Reversal of provisions, operating risks",
  "Reprises sur prov. pour dép. de l'actif circulant": "Reversal of impairment, current assets"
};
function lbl(l) { return LANG === 'fr' ? l : (LBL[l] || l); }

/* ---------- journal ----------
   rows : [{c, l, d, cr}] ; d = montant au débit, cr = montant au crédit (l'un des deux). */
function journal(date, rows, note) {
  const D = I18N[LANG];
  let h = `<div class="journal-wrap"><table class="journal">
    <tr class="date-row"><td colspan="4">${date}</td></tr>
    <tr><th>${D.account}</th><th>${D.label}</th><th style="text-align:right">${D.debit}</th><th style="text-align:right">${D.credit}</th></tr>`;
  rows.filter(e => e.d !== undefined).forEach(e => {
    h += `<tr><td class="num">${e.c}</td><td class="debit-col">${lbl(e.l)}</td><td class="amt">${money(e.d)}</td><td></td></tr>`;
  });
  rows.filter(e => e.cr !== undefined).forEach(e => {
    h += `<tr><td class="num">${e.c}</td><td class="credit-col" style="padding-left:1.5rem">${lbl(e.l)}</td><td></td><td class="amt">${money(e.cr)}</td></tr>`;
  });
  if (note) h += `<tr><td colspan="4" class="libelle">${note}</td></tr>`;
  return h + `</table></div>`;
}
/* vérification d'équilibre (console uniquement) */
function checkBalance(rows, where) {
  const d = rows.reduce((s, e) => s + (e.d || 0), 0), c = rows.reduce((s, e) => s + (e.cr || 0), 0);
  if (Math.abs(d - c) > 0.011 && window.console) console.warn('Écriture déséquilibrée', where, d, c);
}
function J(date, rows, note) { checkBalance(rows, date); return journal(date, rows, note); }

/* ---------- blocs du corrigé ---------- */
function box(title, body) { return `<div class="calc-box"><span class="sol-sub">${title}</span>${body}</div>`; }
function head(txt) { return `<p class="ex-head">${txt}</p>`; }
function work(txt) { return `<p class="ex-work">${I18N[LANG].work}</p><p class="ex-q">${txt}</p>`; }

/* ---------- langue ---------- */
function detectLang() {
  try {
    const q = new URLSearchParams(window.location.search).get('lang');
    if (q && I18N[q.toLowerCase()]) return q.toLowerCase();
  } catch (e) {}
  return 'fr';
}
function applyLang() {
  const D = I18N[LANG], K = PAGE.k[LANG];
  document.documentElement.lang = D.htmlLang;
  document.title = K.title;
  document.querySelectorAll('[data-k]').forEach(function (el) {
    const key = el.getAttribute('data-k');
    if (K[key] !== undefined) el.innerHTML = K[key];
    else if (D[key] !== undefined) el.innerHTML = D[key];
  });
  const btn = document.getElementById('toggle-btn');
  if (btn) btn.innerText = document.getElementById('sol-card').classList.contains('visible') ? D.hideSol : D.showSol;
  document.getElementById('flag-fr').classList.toggle('active', LANG === 'fr');
  document.getElementById('flag-en').classList.toggle('active', LANG === 'en');
}
function setLang(lang) {
  if (!I18N[lang] || lang === LANG) return;
  LANG = lang;
  try {
    const u = new URL(window.location.href);
    u.searchParams.set('lang', lang);
    history.replaceState(null, '', u.toString());
  } catch (e) {}
  applyLang();
  if (document.getElementById('ex-area').style.display !== 'none') {
    const solWasVisible = document.getElementById('sol-card').classList.contains('visible');
    generateExercise(false);
    if (solWasVisible) toggleSol();
  }
}

/* ---------- génération ---------- */
function generateExercise(forceNew) {
  const inp = document.getElementById('seed-input');
  if (forceNew) inp.value = '';
  currentSeed = inp.value ? parseInt(inp.value, 10) : Math.floor(Math.random() * 99999999);
  inp.value = currentSeed;
  document.getElementById('seed-disp').innerText = currentSeed;
  random = seedPRNG(currentSeed);
  const D = PAGE.compute();
  PAGE.last = D;

  document.getElementById('welcome').style.display = 'none';
  document.getElementById('ex-area').style.display = 'block';
  const sol = document.getElementById('sol-card'), btn = document.getElementById('toggle-btn');
  sol.classList.remove('visible'); btn.classList.remove('shown'); btn.innerText = I18N[LANG].showSol;

  document.getElementById('context-text').innerHTML = PAGE.context(D);
  document.getElementById('ex-body').innerHTML = PAGE.enonce(D);
  document.getElementById('sol-content').innerHTML = PAGE.sol(D);
  if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([document.getElementById('ex-area')]).catch(function () {});
}
function toggleSol() {
  const sol = document.getElementById('sol-card'), btn = document.getElementById('toggle-btn');
  const vis = sol.classList.toggle('visible');
  btn.classList.toggle('shown', vis);
  btn.innerText = vis ? I18N[LANG].hideSol : I18N[LANG].showSol;
}
document.addEventListener('DOMContentLoaded', function () { LANG = detectLang(); applyLang(); });
</script>
