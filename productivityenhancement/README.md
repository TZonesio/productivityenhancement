# Démo GitHub Pages — productivityenhancement

Ce paquet est prévu pour être servi depuis `https://organisation.github.io/productivityenhancement/`. Les chemins sont relatifs, aucune URL absolue n'est utilisée, ce qui rend le site compatible avec un sous-répertoire.

Placez le contenu du dossier `productivityenhancement/` à la racine du dépôt `organisation.github.io` sous un sous-dossier du même nom, ou publiez ce dossier dans un dépôt dédié nommé `productivityenhancement` avec GitHub Pages activé. Le fichier `.nojekyll` désactive le pipeline Jekyll afin d’éviter toute réécriture indésirable.

Le site charge des données synthétiques depuis `./data/*.json` et affiche un pont de marge, une cascade ABC, des variantes de processus et une carte de chaleur des activités non-valeur. Le curseur « what-if » applique une réduction de rework et en déduit l’effet sur le coût unitaire et sur la marge.
