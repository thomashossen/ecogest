#!/usr/bin/env python3
"""Assemble compt<N>.html = tête de l'original (CSS, MathJax, kit) + corps bilingue + socle + page."""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = '/home/claude/site'
ORIG = '/home/claude/orig'   # copie des originaux

FLAGS = '''<div class="lang-switch">
      <button type="button" class="flag-btn active" id="flag-fr" onclick="setLang('fr')" title="Français" aria-label="Français"><svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="20" height="40" fill="#002654"/><rect x="20" width="20" height="40" fill="#ffffff"/><rect x="40" width="20" height="40" fill="#ED2939"/></svg></button>
      <button type="button" class="flag-btn" id="flag-en" onclick="setLang('en')" title="English" aria-label="English"><svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="60" height="40" fill="#012169"/><path d="M0 0 L60 40 M60 0 L0 40" stroke="#ffffff" stroke-width="8"/><path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" stroke-width="4"/><path d="M30 0 V40 M0 20 H60" stroke="#ffffff" stroke-width="12"/><path d="M30 0 V40 M0 20 H60" stroke="#C8102E" stroke-width="7"/></svg></button>
    </div>'''

BODY = '''<body>

<header>
<div class="header-inner">
  <div class="header-top">
    <div class="header-badge" data-k="k-badge">INFORMATION COMPTABLE ET FINANCIÈRE</div>
    %(flags)s
  </div>
  <h1 data-k="k-h1">%(h1)s</h1>
  <p class="subtitle" data-k="k-sub">© Thomas Hossen – Version du 10 octobre 2026</p>

  <div class="ctrls">
    <div class="ctrl-g">
      <span class="ctrl-lbl" data-k="k-seed">Seed de reproductibilité</span>
      <div class="seed-row"><input class="ctrl-inp w120" type="number" id="seed-input" placeholder="auto" min="1" max="99999999"><button type="button" class="btn-copy-seed" id="btn-copy-seed" onclick="copySeed(this)" title="Copier la seed active"><span data-kit="btnCopy">&#10697; Copier</span></button></div>
    </div>
    <button class="btn-gen" onclick="generateExercise(false)"><span data-k="k-gen">Générer</span></button>
  </div>
</div>
</header>

<main>
  <div id="welcome" style="text-align:center; padding:4rem; color:var(--text-muted); font-style:italic;">
    <span data-k="k-welcome">Configurez les paramètres et cliquez sur Générer pour créer un nouvel exercice.</span>
  </div>

  <div id="ex-area" style="display:none">
    <div class="top-bar">
      <div class="seed-badge"><span data-k="k-seedbadge">Seed active&nbsp;:</span> <span id="seed-disp"></span></div>
      <div class="top-bar-left">
        <button type="button" class="btn-sm" onclick="generateExercise(true)"><span data-kit="btnNew">&#8634; Nouvel &eacute;nonc&eacute;</span></button>
        <button type="button" class="btn-sm pdf" onclick="openPdfModal()"><span data-kit="btnPdf">&#11015; Exporter PDF</span></button>
        <button type="button" class="btn-sm doc" onclick="exportWord()"><span data-kit="btnDoc">&#11015; Exporter Word</span></button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="tag" data-k="k-tag-ex">Énoncé</span><h2 data-k="k-cardtitle">%(h2)s</h2></div>
      <div class="card-body">
        <div class="context-block" id="context-text"></div>
        <div id="ex-body"></div>
      </div>
    </div>

    <div class="sol-toggle-wrap">
      <button class="btn-toggle" id="toggle-btn" onclick="toggleSol()">Afficher le corrigé</button>
    </div>

    <div id="sol-card" class="card sol-card">
      <div class="card-header"><span class="tag" data-k="k-tag-sol">Corrigé</span><h2 data-k="k-cardtitle">%(h2)s</h2></div>
      <div class="card-body" id="sol-content"></div>
    </div>
  </div>
</main>

'''

EXTRA_CSS = '''<style id="compta-css">
.header-top{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:.5rem}
.lang-switch{display:flex;gap:.45rem;flex-shrink:0}
.flag-btn{background:rgba(255,255,255,.06);border:1px solid rgba(201,149,42,.35);border-radius:3px;padding:3px;cursor:pointer;line-height:0;opacity:.5;transition:opacity .2s,border-color .2s}
.flag-btn:hover{opacity:1}
.flag-btn.active{opacity:1;border-color:var(--gold-light);box-shadow:0 0 0 1px rgba(232,184,75,.35)}
.flag-btn svg{display:block;width:30px;height:20px;border-radius:1px}
.ex-head{margin:0 0 1rem;font-weight:600;color:var(--navy);text-align:left}
.ex-head.later{margin-top:1.6rem}
.ex-work{margin:1.5rem 0 .4rem;font-weight:600;color:var(--red);text-align:left}
.ex-q{font-style:italic;text-align:justify}
.sol-card .sol-sub{color:var(--navy);font-weight:600;display:block;margin:0 0 .5rem;font-size:1rem}
.calc-box p{margin:0 0 .85rem}
.calc-box p:last-child{margin-bottom:0}
.event-list li strong.date{color:var(--navy)}
table.data{width:100%;border-collapse:collapse;font-size:.88rem;margin:.6rem 0 1.2rem}
table.data th{background:var(--navy);color:var(--cream);padding:.5rem .6rem;text-align:left;font-weight:600}
table.data td{padding:.45rem .6rem;border:1px solid var(--border)}
table.data td.r{text-align:right;font-family:'JetBrains Mono',monospace;white-space:nowrap}
table.data th.r{text-align:right;font-family:inherit;white-space:normal;line-height:1.3}
table.data th{line-height:1.3;vertical-align:bottom}
table.data td:last-child{min-width:12rem}
.sol-card table.data td{font-size:.86rem}
@media (max-width:640px){
  table.journal{font-size:.78rem} table.journal .num{width:52px} table.journal .amt{width:auto;font-size:.74rem}
  table.journal td, table.journal th{padding:.35rem .4rem} table.journal .credit-col{padding-left:.9rem !important}
}
</style>
'''

def build(n, spec_file):
    orig = open(os.path.join(ORIG, 'compt%d.html' % n), encoding='utf-8').read()
    cur = open(os.path.join(SITE, 'compt%d.html' % n), encoding='utf-8').read()
    spec = open(spec_file, encoding='utf-8').read()
    m = re.search(r'/\*\s*H1:(.*?)\*/\s*/\*\s*H2:(.*?)\*/', spec, re.S)
    h1, h2 = m.group(1).strip(), m.group(2).strip()
    head = cur[:cur.find('<body>')]
    head = re.sub(r'<style id="compta-css">[\s\S]*?</style>\n', '', head)
    head = head.replace('</head>', EXTRA_CSS + '</head>', 1)
    # titre du document : remplacé dynamiquement par applyLang
    kit_js_start = cur.find('<!-- KIT:JS:START')
    tail = cur[kit_js_start:]
    core = open(os.path.join(HERE, 'core.js'), encoding='utf-8').read()
    body = BODY % {'flags': FLAGS, 'h1': h1, 'h2': h2}
    out = head + body + core + '\n<script>\n' + spec + '\n</script>\n' + tail
    open(os.path.join(SITE, 'compt%d.html' % n), 'w', encoding='utf-8').write(out)
    print('compt%d.html assemblé (%d Ko)' % (n, len(out) // 1024))

if __name__ == '__main__':
    for a in sys.argv[1:]:
        n = int(re.search(r'\d+', a).group())
        build(n, a)
