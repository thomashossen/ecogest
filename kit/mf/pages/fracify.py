import re, sys
FOLLOW = ['\\]', '\\)', '\\\\', '\\qquad', '\\end', '&amp;', '\\quad', '\\text']
def match_paren(s, i):
    # s[i] == '(' ; return index of matching ')'
    d = 0
    for j in range(i, len(s)):
        c = s[j]
        if c == '(': d += 1
        elif c == ')':
            d -= 1
            if d == 0: return j
    return -1
def split_top(arg):
    d = 0
    for j, c in enumerate(arg):
        if c in '([{': d += 1
        elif c in ')]}': d -= 1
        elif c == ',' and d == 0: return arg[:j], arg[j+1:]
    return arg, None
def process_seg(seg, names):
    out = []; i = 0; n_a = n_p = n_t = 0
    pat = re.compile(r'\$\{(' + '|'.join(map(re.escape, names)) + r'|fmt)\(')
    while True:
        m = pat.search(seg, i)
        if not m: out.append(seg[i:]); break
        name = m.group(1); po = m.end() - 1; pc = match_paren(seg, po)
        if pc < 0 or seg[pc+1:pc+2] != '}': out.append(seg[i:m.end()]); i = m.end(); continue
        arg = seg[po+1:pc]; after = seg[pc+2:]; before = seg[max(0, m.start()-1):m.start()]
        newname = name
        if name == 'fmt':
            if seg[max(0, m.start()-16):m.start()] == '<td class="num">':
                a0, _ = split_top(arg); arg = a0; newname = 'fqt'; n_t += 1
        elif after.startswith('^'):
            a0, _ = split_top(arg); arg = a0; newname = 'fqp'; n_p += 1
        elif before == '=' and any(after.startswith(f) for f in FOLLOW):
            a0, _ = split_top(arg); arg = a0; newname = 'fqa'; n_a += 1
        out.append(seg[i:m.start()] + '${' + newname + '(' + arg + ')}')
        i = pc + 2
    return ''.join(out), n_a, n_p, n_t
def process(path, solname, names):
    s = open(path, encoding='utf-8').read()
    a = s.find('function ' + solname + '(')
    b = s.find('I18N.fr.sol', a)
    assert a > 0 and b > a, (path, solname)
    seg = s[a:b]
    if 'const texT = (x) => fq(x);' not in seg:
        k = seg.find('{') + 1
        seg = seg[:k] + '\n  const texT = (x) => fq(x);' + seg[k:]
    seg2, na, np_, nt = process_seg(seg, names)
    s = s[:a] + seg2 + s[b:]
    open(path, 'w', encoding='utf-8').write(s)
    print(path.split('/')[-1], solname, 'final:', na, 'pow:', np_, 'tables:', nt)
NAMES = ['n4', 'n', 'm', 'm2', 'e2n', 'texT', 'fq']
jobs = [('ei1.js', 'e1sol'), ('ei2.js', 'e2sol'), ('ei3.js', 'e3sol'), ('ei4.js', 'e4sol')]
jobs += [('ei%d_body.js' % k, 'e%dsol' % k) for k in range(5, 10)]
jobs += [('jeux%d_body.js' % k, 'j%dsol' % k) for k in range(1, 10)]
jobs += [('pc%d_body.js' % k, 'p%dsol' % k) for k in range(1, 10)]
for f, sn in jobs: process('/home/claude/newmf/' + f, sn, NAMES)
