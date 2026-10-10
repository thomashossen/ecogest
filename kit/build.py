#!/usr/bin/env python3
"""Applique le socle v2 à toutes les pages du site (idempotent)."""
import re, glob, os, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/site'
KIT = os.path.dirname(os.path.abspath(__file__))
CSS2 = open(os.path.join(KIT, 'kit2.css'), encoding='utf-8').read()
JS2 = open(os.path.join(KIT, 'kit2.js'), encoding='utf-8').read()

CSS_BLOCK = '<!-- KIT2:CSS:START -->\n<style id="kit2-css">' + CSS2 + '</style>\n<!-- KIT2:CSS:END -->'
JS_BLOCK = '<!-- KIT2:JS:START -->\n' + JS2.strip() + '\n<!-- KIT2:JS:END -->'

def strip_block(d, name):
    return re.sub(r'<!-- %s:START -->[\s\S]*?<!-- %s:END -->\n?' % (name, name), '', d)

def inject(d):
    d = strip_block(d, 'KIT2:CSS')
    d = strip_block(d, 'KIT2:JS')
    # CSS : juste avant </head>
    if '</head>' in d:
        d = d.replace('</head>', CSS_BLOCK + '\n</head>', 1)
    # JS : juste avant </body>
    if '</body>' in d:
        idx = d.rfind('</body>')
        d = d[:idx] + JS_BLOCK + '\n' + d[idx:]
    return d

def strip_highlight(d):
    # <span class="highlight">X</span> -> X (jamais imbriqué)
    return re.sub(r'<span class="highlight">([^<]*)</span>', r'\1', d)

INDEX_FIX = {
    'data-f="fin8.html" href="fin7.html"': 'data-f="fin7.html" href="fin7.html"',
    'data-f="fin7.html" href="fin8.html"': 'data-f="fin8.html" href="fin8.html"',
    'data-f="gest8.html" href="gest5.html"': 'data-f="gest8.html" href="gest8.html"',
    'data-f="econ13.html" href="econ12.html"': 'data-f="econ13.html" href="econ13.html"',
    'data-f="econ14.html" href="econ13.html"': 'data-f="econ14.html" href="econ14.html"',
}

changed = 0
for f in sorted(glob.glob(os.path.join(SRC, '*.html'))):
    name = os.path.basename(f)
    d = open(f, encoding='utf-8').read()
    o = d
    if name == 'index.html':
        for k, v in INDEX_FIX.items():
            d = d.replace(k, v)
    else:
        d = strip_highlight(d)
        d = inject(d)
    if d != o:
        open(f, 'w', encoding='utf-8').write(d)
        changed += 1
print('pages modifiées :', changed)
