#!/usr/bin/env python3
"""Insère des appels ${testFig({...})} dans les fonctions sol (fr et en) d'une page,
juste avant le premier </li> qui suit l'ancre donnée (expression de code identique dans les deux langues)."""
import re

def sol_bounds(d, lang):
    starts = [m.start() for m in re.finditer(r'\bsol\s*:\s*function', d)]
    assert len(starts) >= 2, 'sol functions not found'
    s = starts[0] if lang == 'fr' else starts[1]
    e = d.find('return ', s)
    e = d.find('\n    }', e) if e > 0 else len(d)
    return s, e

def place(d, items, closer='</li>', dry=False, after=False):
    """items : liste de (ancre, occurrence, appel_js). Retourne la page modifiée."""
    for lang in ('fr', 'en'):
        s, e = sol_bounds(d, lang)
        body = d[s:e]
        inserts = []
        for it in items:
            anchor, occ, call = it[0], it[1], it[2]
            cl = it[3] if len(it) > 3 else closer
            af = it[4] if len(it) > 4 else after
            pos = -1
            for _ in range(occ):
                pos = body.find(anchor, pos + 1)
                assert pos >= 0, (lang, anchor, occ)
            c = body.find(cl, pos)
            assert c > 0, (lang, anchor)
            if af: c += len(cl)
            inserts.append((c, '${' + call + '}'))
        for c, txt in sorted(inserts, reverse=True):
            body = body[:c] + txt + body[c:]
        if dry:
            for c, txt in sorted(inserts):
                print(lang, repr(body[max(0, c - 120):c]))
        d = d[:s] + body + d[e:]
    return d

def counts(d, anchor):
    out = []
    for lang in ('fr', 'en'):
        s, e = sol_bounds(d, lang); out.append(d[s:e].count(anchor))
    return out
