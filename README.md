# Exercices — Thomas Hossen

Site statique (GitHub Pages) : une page HTML autonome par exercice, `index.html` pour la navigation.

## Socle d'uniformisation (v2)

Chaque page embarque deux blocs communs, identiques partout :

- `<!-- KIT2:CSS:START --> … <!-- KIT2:CSS:END -->` (avant `</head>`)
- `<!-- KIT2:JS:START --> … <!-- KIT2:JS:END -->` (avant `</body>`)

Ils sont régénérés par `kit/build.py` (idempotent) à partir de `kit/kit2.css` et `kit/kit2.js`.
Ne jamais les modifier page par page : modifier `kit/kit2.*` puis relancer :

```
python3 kit/build.py .
```

Le kit applique, à chaque rendu et dans les deux langues :

1. typographie française (espaces insécables devant `: ; ? ! % €`, guillemets, milliers) ; en anglais, `5%` sans espace ;
2. aucune ponctuation finale dans une ligne mathématique (`\[ … \]`, `$$ … $$`, `align`), et deux-points à la fin de la phrase qui la précède ;
3. lettres a, b, c des sous-questions entourées dans les corrigés ;
4. formules, tableaux et blocs de code défilables horizontalement (téléphone) ;
5. séparateur décimal : virgule en français (`0,8`, et `0{,}8` dans les formules), point en anglais, y compris dans les étiquettes des graphiques ; le code Python garde le point.

`kit/test.py page.html [fr|en] [capture.png] [largeur]` charge une page sous Chromium (MathJax local) et vérifie ces règles.

## Outils de la famille « maths financières » (`kit/mf/`)

- `add_figs.py`, `add_figs2.py`, `add_figs3.py` : greffe d'une figure interactive (code + légendes FR/EN) dans le cours d'une page mf, avec renumérotation automatique des figures et de leurs renvois.
- `add_checks.py` : insertion d'encadrés « Vérification » (classe `p.check`, définie dans `kit2.css`) en fin de question du corrigé, calculés à partir des données tirées.

## Conventions de rédaction des corrigés

- Intertitres de corrigé : `<span class="sol-sub">…</span>` (jamais de style inline).
- Sous-questions : `<strong>a.</strong>` en début de paragraphe (entourées automatiquement par le socle) ou listes `enum-sublist`.
- Toute ligne mathématique est introduite par une phrase terminée par deux-points et ne porte aucune ponctuation finale (le socle corrige, mais autant écrire juste).

## Schémas de corrigé hors famille mf

Les pages sans cadre de figures (dérivés, analyse financière…) dessinent leurs schémas en SVG directement dans le corrigé, par une fonction `xxxFigure(P)` placée avant `generateExercise` et appelée à l'assemblage de `sol-content` : `bsFigure` (der3), `fwdFigure` (der5), `normFigure` (der6), `drciFigure` (mcaf1), `loanFigure` (mcaf2). Légendes FR/EN dans un objet voisin (`BSFIG`, `FWDFIG`, `NFIG`, `DRFIG`, `LOANFIG`).
