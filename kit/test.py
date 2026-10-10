import sys, os, re, json
from playwright.sync_api import sync_playwright

MJ = '/home/claude/mj/node_modules/mathjax/es5'
page_file = sys.argv[1]
lang = sys.argv[2] if len(sys.argv) > 2 else 'fr'
shot = sys.argv[3] if len(sys.argv) > 3 else None
width = int(sys.argv[4]) if len(sys.argv) > 4 else 1100

def route(r):
    url = r.request.url
    m = re.search(r'mathjax@3(?:\.[\d.]+)?/es5/(.*)$', url)
    if m:
        p = os.path.join(MJ, m.group(1).split('?')[0])
        if os.path.exists(p):
            r.fulfill(path=p, content_type='application/javascript'); return
    if 'fonts.googleapis' in url or 'fonts.gstatic' in url:
        r.fulfill(body='', content_type='text/css'); return
    r.continue_()

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': width, 'height': 900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console.' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
    pg.route('**/*', route)
    pg.goto('file://' + os.path.abspath(page_file) + ('?lang=' + lang if lang != 'fr' else ''))
    pg.wait_for_timeout(800)
    # langue
    if lang == 'en' and pg.query_selector('#flag-en'):
        pg.click('#flag-en'); pg.wait_for_timeout(300)
    # générer
    if pg.query_selector('.btn-gen'):
        pg.click('.btn-gen'); pg.wait_for_timeout(600)
    if pg.query_selector('#toggle-btn'):
        pg.click('#toggle-btn'); pg.wait_for_timeout(300)
    pg.wait_for_function('!window.MathJax || (MathJax.startup && MathJax.startup.promise)', timeout=10000)
    pg.evaluate('MathJax && MathJax.startup && MathJax.startup.promise')
    pg.wait_for_timeout(1500)
    info = pg.evaluate('''() => {
      const q = s => document.querySelectorAll(s).length;
      const txt = (document.getElementById('sol-content')||document.body).innerText;
      return { sq: q('.sq'), tw: q('.kit-tw'), mjxd: q('mjx-container[display="true"]'),
               leftoverStrong: Array.from(document.querySelectorAll('.sol-card strong')).map(e=>e.textContent.trim()).filter(t=>/^[a-h][.)]?$/.test(t)).length,
               colonMissing: (() => { let n=0; document.querySelectorAll('mjx-container[display="true"]').forEach(c=>{ let p=c.previousSibling; while(p && p.nodeType===3 && !/\\S/.test(p.nodeValue)) p=p.previousSibling; let t=''; if(p){ t=(p.nodeType===3?p.nodeValue:p.textContent).replace(/\\s+$/,''); } if(t && !/[:?!]$/.test(t)) n++; }); return n; })(),
               sample: txt.slice(0, 1500) };
    }''')
    print(json.dumps(info, ensure_ascii=False, indent=1))
    # ponctuation finale dans les maths rendues (texte assistif)
    tex = pg.evaluate('''() => Array.from(document.querySelectorAll('mjx-container[display="true"]')).map(c => { const m = c.querySelector('mjx-assistive-mml math'); return m ? (m.getAttribute('alttext')||m.textContent).trim() : ''; })''')
    bad = [t for t in tex if re.search(r'[.,;]\s*$', t)]
    print('display maths :', len(tex), '| finissant par ponctuation :', len(bad), bad[:5])
    if shot:
        pg.screenshot(path=shot, full_page=True)
    print('errors:', errs[:10])
    b.close()
