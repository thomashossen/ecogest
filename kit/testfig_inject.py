#!/usr/bin/env python3
"""Injecte (ou met à jour) la bibliothèque testfig.js dans les pages données (idempotent)."""
import re, sys, os
KIT = os.path.dirname(os.path.abspath(__file__))
LIB = open(os.path.join(KIT, 'testfig.js'), encoding='utf-8').read().strip()
BLOCK = '<!-- TESTFIG:START -->\n' + LIB + '\n<!-- TESTFIG:END -->'
for f in sys.argv[1:]:
    d = open(f, encoding='utf-8').read()
    d = re.sub(r'<!-- TESTFIG:START -->[\s\S]*?<!-- TESTFIG:END -->\n?', '', d)
    d = d.replace('</head>', BLOCK + '\n</head>', 1)
    open(f, 'w', encoding='utf-8').write(d)
    print('testfig →', os.path.basename(f))
