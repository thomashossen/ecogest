<script id="kit-polish">
/* ============================================================
   KIT v2 — FINITION AUTOMATIQUE DU CONTENU (identique sur toutes les pages)
   À chaque rendu de l'énoncé, du cours ou du corrigé :
     1. typographie française (espaces insécables devant : ; ? ! % €, guillemets) ;
        en anglais, pas d'espace devant % ;
     2. une ligne mathématique (\[ … \] ou $$ … $$) ne porte aucune ponctuation
        finale, et la phrase qui la précède se termine par deux-points ;
     3. les sous-questions a, b, c du corrigé sont entourées ;
     4. tout tableau est défilable horizontalement.
   Le texte TeX n'est jamais altéré, hormis la ponctuation finale.
   ============================================================ */
(function () {
  'use strict';
  var NBSP = '\u00a0', NNBSP = '\u202f';
  var SKIP = { SCRIPT: 1, STYLE: 1, PRE: 1, CODE: 1, TEXTAREA: 1, INPUT: 1, BUTTON: 1, SELECT: 1,
               KBD: 1, SVG: 1, 'MJX-CONTAINER': 1, 'MJX-ASSISTIVE-MML': 1, MATH: 1 };
  var INLINE = { SPAN: 1, STRONG: 1, EM: 1, B: 1, I: 1, A: 1, SUB: 1, SUP: 1, U: 1, SMALL: 1, ABBR: 1 };

  function lang() {
    var l = (window.LANG || (window.KIT && KIT.lang && KIT.lang()) || document.documentElement.lang || 'fr');
    return String(l).toLowerCase().indexOf('en') === 0 ? 'en' : 'fr';
  }
  function skipEl(el) {
    return !!(el && el.nodeType === 1 && (SKIP[el.nodeName.toUpperCase()] ||
             (el.classList && (el.classList.contains('kit-raw') || el.classList.contains('sq')))));
  }

  /* ---------- découpage d'un texte en segments texte / TeX ---------- */
  var TEX_RE = /(\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\\\([\s\S]*?\\\))/g;
  function segments(s) {
    var out = [], last = 0, m;
    TEX_RE.lastIndex = 0;
    while ((m = TEX_RE.exec(s))) {
      if (m.index > last) out.push({ tex: 0, s: s.slice(last, m.index) });
      var d = m[0].slice(0, 2);
      out.push({ tex: (d === '\\(') ? 1 : 2, s: m[0] });   /* 1 = en ligne, 2 = hors texte */
      last = m.index + m[0].length;
    }
    if (last < s.length) out.push({ tex: 0, s: s.slice(last) });
    return out;
  }

  /* ---------- 1. typographie ---------- */
  function typo(s, L) {
    if (L === 'fr') {
      s = s.replace(/([A-Za-z\u00C0-\u017F\)\]\u00bb%\u20ac])[ \u00a0\u202f]*:(?!\/\/)/g, '$1' + NBSP + ':');
      s = s.replace(/(\d)[ \u00a0\u202f]+:/g, '$1' + NBSP + ':');
      s = s.replace(/([^\s;!?\u00a0\u202f])[ \u00a0\u202f]*([;!?])/g, '$1' + NNBSP + '$2');
      s = s.replace(/(\d)[ \u00a0\u202f]*%/g, '$1' + NBSP + '%');
      s = s.replace(/(\d)[ \u00a0\u202f]*([\u20ac$\u00a3])/g, '$1' + NBSP + '$2');
      s = s.replace(/\u00ab[ \u00a0\u202f]*/g, '\u00ab' + NBSP);
      s = s.replace(/[ \u00a0\u202f]*\u00bb/g, NBSP + '\u00bb');
      s = s.replace(/(\d)[ \u00a0\u202f](\d{3})(?![\d])/g, '$1' + NNBSP + '$2');
    } else {
      s = s.replace(/(\d)[ \u00a0\u202f]+%/g, '$1%');
      s = s.replace(/(\d)[ \u00a0\u202f](\d{3})(?![\d])/g, '$1,$2');
    }
    return s;
  }

  /* ---------- 2. ponctuation finale d'une ligne mathématique ---------- */
  var SPACING = /(?:\s|~|\\[,;:!>]|\\quad|\\qquad|\\\s|\{\})+$/;
  function stripEnd(t) {
    for (var guard = 0; guard < 12; guard++) {
      t = t.replace(SPACING, '');
      if (/\.\.\.$/.test(t)) return t;
      var n = t.length, ch = t.charAt(n - 1);
      if ('.,;:!'.indexOf(ch) >= 0 && ch !== '' && t.charAt(n - 2) !== '\\') { t = t.slice(0, -1); continue; }
      var m = /\\end\{([a-zA-Z*]+)\}$/.exec(t);
      if (m) { return stripEnd(t.slice(0, m.index)) + m[0]; }
      /* ponctuation cachée dans un \text{…} final */
      var mt = /(\\(?:text|textit|textrm|textbf|mbox|mathrm|operatorname)\{)([^{}]*)\}$/.exec(t);
      if (mt) {
        var body = mt[2].replace(/[\s\u00a0\u202f]*[.,;:!]+[\s\u00a0\u202f]*$/, '');
        if (body !== mt[2]) { t = t.slice(0, mt.index) + mt[1] + body + '}'; continue; }
      }
      return t;
    }
    return t;
  }
  function cleanDisplay(tex) {
    var open = tex.slice(0, 2), close = tex.slice(-2), inner = tex.slice(2, -2);
    /* fin de ligne dans un alignement : pas de virgule ni de point avant \\ */
    inner = inner.replace(/([^\\])([.,;])((?:\s|~|\\[,;:!])*)\\\\/g, '$1$3\\\\');
    inner = stripEnd(inner);
    return open + inner + close;
  }

  /* ---------- 3. deux-points avant une ligne mathématique ---------- */
  function endWithColon(text, L) {
    var t = text.replace(/[\s\u00a0\u202f]+$/, '');
    if (!t) return null;
    var ch = t.charAt(t.length - 1);
    var colon = (L === 'fr' ? NBSP : '') + ':';
    if (ch === ':') return text;
    if (ch === '?' || ch === '!' || ch === '\u2026') return text;
    if (/[.,;]$/.test(t)) {
      if (/\.\.\.$/.test(t)) return text;
      return t.slice(0, -1).replace(/[\s\u00a0\u202f]+$/, '') + colon;
    }
    if (/[A-Za-z0-9\u00C0-\u017F\)\]\u00bb%\u20ac$]$/.test(t)) return t + colon;
    return null;
  }
  /* dernier nœud texte non vide qui précède `node`, sans sortir d'un bloc, sans traverser un tableau */
  function prevTextNode(node, root) {
    var n = node;
    for (var guard = 0; guard < 400; guard++) {
      var p = n.previousSibling;
      while (!p) {
        var par = n.parentNode;
        if (!par || par === root || par.nodeType !== 1) return null;
        if (!INLINE[par.nodeName.toUpperCase()] && par.nodeName !== 'P') return null;
        n = par; p = n.previousSibling;
      }
      n = p;
      if (n.nodeType === 8) continue;
      if (n.nodeType === 3) {
        if (/\S/.test(n.nodeValue)) return n;
        continue;
      }
      if (n.nodeType !== 1) continue;
      var tag = n.nodeName.toUpperCase();
      if (tag === 'BR') continue;
      if (skipEl(n) || /^(TABLE|SVG|FIGURE|OL|UL|HR|IMG|H[1-6]|CANVAS)$/.test(tag)) return null;
      if (n.classList && /\b(kit-tw|journal-wrap|dtable-wrap|math-formula|dossier-title|fig|figure|plot)\b/.test(n.className)) return null;
      /* descendre vers le dernier nœud texte */
      var last = n.lastChild;
      while (last && last.nodeType === 1 && !skipEl(last) && last.lastChild) last = last.lastChild;
      if (!last) continue;
      if (last.nodeType === 3) { if (/\S/.test(last.nodeValue)) return last; n = last; continue; }
      if (skipEl(last) || (last.nodeType === 1 && /^(TABLE|SVG|BR|HR|IMG)$/.test(last.nodeName.toUpperCase()))) {
        if (last.nodeName.toUpperCase() === 'BR') { n = last; continue; }
        return null;
      }
      n = last;
    }
    return null;
  }
  function fixColonBefore(textNode, segIndex, segs, root, L) {
    /* 1) texte précédent dans le même nœud */
    for (var i = segIndex - 1; i >= 0; i--) {
      var sg = segs[i];
      if (sg.tex === 2) return;                   /* deux lignes math qui se suivent */
      if (sg.tex === 1) {                         /* math en ligne juste avant : deux-points après elle */
        var nxt = segs[i + 1];
        if (nxt && !nxt.tex) {
          if (/^[\s\u00a0\u202f]*$/.test(nxt.s)) nxt.s = (L === 'fr' ? NBSP : '') + ': ';
          else { var r = endWithColon(nxt.s, L); if (r !== null) nxt.s = r + ' '; }
        }
        return;
      }
      if (/\S/.test(sg.s)) { var r2 = endWithColon(sg.s, L); if (r2 !== null) sg.s = r2 + ' '; return; }
    }
    /* 2) sinon, dernier texte des nœuds précédents */
    var tn = prevTextNode(textNode, root);
    if (!tn) return;
    if (tn.parentNode && tn.parentNode.closest && tn.parentNode.closest('.sq')) return;
    var sub = segments(tn.nodeValue), k;
    for (k = sub.length - 1; k >= 0; k--) {
      if (sub[k].tex === 2) return;
      if (sub[k].tex === 1) {
        var after = sub[k + 1];
        if (after && !after.tex && /^[\s\u00a0\u202f]*$/.test(after.s)) { after.s = (L === 'fr' ? NBSP : '') + ':'; break; }
        if (!after) { sub.push({ tex: 0, s: (L === 'fr' ? NBSP : '') + ':' }); break; }
        var r3 = endWithColon(after.s, L); if (r3 !== null) after.s = r3; break;
      }
      if (/\S/.test(sub[k].s)) { var r4 = endWithColon(sub[k].s, L); if (r4 !== null) sub[k].s = r4; break; }
    }
    var joined = sub.map(function (x) { return x.s; }).join('');
    if (joined !== tn.nodeValue) tn.nodeValue = joined;
  }

  /* ---------- traitement d'un nœud texte ---------- */
  function processText(tn, root, L) {
    var v = tn.nodeValue;
    if (!v || !/\S/.test(v)) return;
    var segs = segments(v), changed = false, i;
    for (i = 0; i < segs.length; i++) {
      var sg = segs[i], ns;
      if (sg.tex === 2) {
        ns = cleanDisplay(sg.s);
        if (ns !== sg.s) { sg.s = ns; changed = true; }
        /* ponctuation juste après la ligne : supprimée */
        var nx = segs[i + 1];
        if (nx && !nx.tex) {
          var ns2 = nx.s.replace(/^[\s\u00a0\u202f]*[.,;]+/, '');
          if (ns2 !== nx.s) { nx.s = ns2; changed = true; }
        }
      } else if (!sg.tex) {
        ns = typo(sg.s, L);
        if (ns !== sg.s) { sg.s = ns; changed = true; }
      }
    }
    for (i = 0; i < segs.length; i++) {
      if (segs[i].tex === 2) {
        var before = segs.map(function (x) { return x.s; }).join('');
        fixColonBefore(tn, i, segs, root, L);
        if (segs.map(function (x) { return x.s; }).join('') !== before) changed = true;
      }
    }
    if (changed) {
      var out = segs.map(function (x) { return x.s; }).join('');
      if (out !== tn.nodeValue) tn.nodeValue = out;
    }
  }

  /* ---------- 3. lettres de sous-questions ---------- */
  function circleLetters(root) {
    var scope = root.querySelectorAll ? root.querySelectorAll('.sol-card strong, .sol-card b, #sol-content strong, #sol-content b, .sol-sub, .sol-q') : [];
    for (var i = 0; i < scope.length; i++) {
      var el = scope[i];
      if (el.classList.contains('sq') || el.querySelector('.sq')) continue;
      var t = (el.textContent || '').replace(/[\s\u00a0\u202f]+/g, '');
      var m = /^([a-h])[.)]?$/.exec(t);
      if (!m) continue;
      /* premier contenu visible de son bloc */
      var prev = el.previousSibling, first = true;
      while (prev) {
        if (prev.nodeType === 3 && /\S/.test(prev.nodeValue)) { first = false; break; }
        if (prev.nodeType === 1 && prev.nodeName !== 'BR') { first = false; break; }
        prev = prev.previousSibling;
      }
      if (!first) continue;
      var sp = document.createElement('span');
      sp.className = 'sq'; sp.textContent = m[1];
      el.parentNode.replaceChild(sp, el);
      /* espace suivant superflu */
      var nx = sp.nextSibling;
      if (nx && nx.nodeType === 3) nx.nodeValue = nx.nodeValue.replace(/^[\s\u00a0\u202f]+/, '');
    }
  }

  /* ---------- 4. tableaux défilables ---------- */
  function wrapTables(root) {
    var tabs = root.querySelectorAll ? root.querySelectorAll('table') : [];
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i], p = t.parentNode;
      if (!p || p.nodeType !== 1) continue;
      if (p.closest && p.closest('table')) continue;
      if (/\b(kit-tw|journal-wrap|dtable-wrap|table-wrap|tbl-wrap|scroll)\b/i.test(p.className || '')) continue;
      var ov = window.getComputedStyle(p).overflowX;
      if (ov === 'auto' || ov === 'scroll') continue;
      var w = document.createElement('div'); w.className = 'kit-tw';
      p.insertBefore(w, t); w.appendChild(t);
    }
  }

  /* ---------- parcours ---------- */
  function walk(root, L) {
    var it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        while (p && p !== root) { if (skipEl(p)) return NodeFilter.FILTER_REJECT; p = p.parentNode; }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = it.nextNode())) nodes.push(n);
    for (var i = 0; i < nodes.length; i++) processText(nodes[i], root, L);
  }

  var busy = false, obs = null;
  function polish(root) {
    root = root || document.querySelector('main') || document.body;
    if (!root || busy) return;
    busy = true;
    try {
      var L = lang();
      walk(root, L);
      circleLetters(root);
      wrapTables(root);
    } catch (e) { if (window.console) console.warn('kit-polish :', e); }
    finally { if (obs) obs.takeRecords(); busy = false; }
  }
  window.KIT = window.KIT || {};
  window.KIT.polish = polish;

  /* MathJax compose de façon synchrone dans typeset()/typesetPromise() : la finition
     doit donc s'exécuter DANS sa chaîne de rendu, juste avant la recherche des formules. */
  function hookMathJax() {
    var MJ = window.MathJax;
    if (!MJ) return;
    var fn = function () { polish(); };
    function addTo(doc) {
      if (doc && doc.addRenderAction && !(doc.renderActions && doc.renderActions.findID && doc.renderActions.findID('kitPolish'))) {
        doc.addRenderAction('kitPolish', 5, fn, '', false);
      }
    }
    if (MJ.startup && MJ.startup.document) { addTo(MJ.startup.document); return; }
    if (MJ.startup && MJ.startup.promise && MJ.startup.promise.then) {
      MJ.startup.promise.then(function () { addTo(MJ.startup.document); });
      return;
    }
    MJ.options = MJ.options || {};
    MJ.options.renderActions = MJ.options.renderActions || {};
    MJ.options.renderActions.kitPolish = [5, fn, '', false];
  }

  function install() {
    var main = document.querySelector('main') || document.body;
    hookMathJax();
    polish(main);
    if (!window.MutationObserver) return;
    obs = new MutationObserver(function (recs) {
      if (busy) return;
      var touched = false;
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i];
        if (r.type !== 'childList' || !r.addedNodes.length) continue;
        var t = r.target;
        if (t && t.nodeType === 1 && (t.closest && t.closest('mjx-container'))) continue;
        for (var j = 0; j < r.addedNodes.length; j++) {
          var a = r.addedNodes[j];
          if (a.nodeType === 1 && /^MJX-/i.test(a.nodeName)) continue;
          if (a.nodeType === 1 && a.classList && (a.classList.contains('sq') || a.classList.contains('kit-tw'))) continue;
          touched = true; break;
        }
        if (touched) break;
      }
      if (!touched) return;
      polish(main);
    });
    obs.observe(main, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();
</script>
