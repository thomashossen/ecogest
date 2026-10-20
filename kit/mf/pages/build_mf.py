#!/usr/bin/env python3
"""Construit une page mf à partir du gabarit mf15.html et du code de page newmf/mfNN.js."""
import sys, re
TPL = '/home/claude/site/mf15.html'
def build(n, js_path, titles_fr, out):
    t = open(TPL, encoding='utf-8').read()
    a = t.find('/* ============================================================\n   PAGE mf15')
    b = t.find('\ninitPage();\n</script>')
    assert a > 0 and b > a
    head, tail = t[:a], t[b:]
    # textes statiques de secours (remplacés au chargement par applyLang)
    rep = {
        'Mathématiques financières 15 – Programmation linéaire et financement à court terme': titles_fr['title'],
        'Programmation linéaire et financement à court terme': titles_fr['h1'],
        'Formuler un problème de décision, le résoudre et lire les prix duaux': titles_fr['course'],
        'Modélisation, résolution graphique et analyse de sensibilité': titles_fr['ex'],
        'Version du 6 octobre 2026': 'Version du 20 octobre 2026',
    }
    for k, v in rep.items(): head = head.replace(k, v)
    js = open(js_path, encoding='utf-8').read()
    open(out, 'w', encoding='utf-8').write(head + js + tail)
if __name__ == '__main__':
    import json
    n, js, titles, out = sys.argv[1], sys.argv[2], json.loads(sys.argv[3]), sys.argv[4]
    build(n, js, titles, out)
    print('built', out)
