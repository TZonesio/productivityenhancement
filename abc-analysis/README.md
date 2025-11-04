# ABC Analysis — Productivity Enhancement

## Vue d'ensemble

Ce module d'analyse ABC est une extension autonome de la démo originale de process mining. Il fournit des outils complets pour identifier et prioriser les opportunités d'amélioration de la productivité à travers l'analyse des nomenclatures (BoM), produits, services et initiatives d'amélioration.

## Structure du répertoire

```
abc-analysis/
├── index.html              # Interface principale de l'analyse ABC
├── js/
│   └── app.js             # Logique JavaScript avec classification ABC
├── assets/
│   └── style.css          # Styles CSS complets
├── data/
│   ├── abc_bom_items.json           # 15 composants BoM
│   ├── abc_products.json            # 12 produits et services
│   ├── abc_opportunities.json       # 8 opportunités d'amélioration
│   ├── what_if_baseline.json        # Données de base KPI
│   ├── margin_bridge.json           # Analyse de la marge
│   ├── abc_waterfall.json           # Cascade ABC
│   ├── process_variants.json        # Variantes de processus
│   ├── nva_heatmap.json            # Carte de chaleur NVA
│   └── sla.json                     # Données SLA
└── README.md              # Cette documentation

```

## Différences avec la démo originale

### Démo originale (`/index.html`)
- **Focus** : Process mining, analyse des variants, identification du rework
- **Visualisations** : Margin bridge, Sankey (variants), Heatmap NVA
- **Objectif** : Démonstration des capacités de process mining
- **Données** : Processus de peinture de meubles de jardin

### Module ABC Analysis (`/abc-analysis/index.html`)
- **Focus** : Classification ABC, analyse BoM, opportunités de productivité
- **Visualisations** : Tout de la démo originale + 4 nouveaux onglets ABC
- **Objectif** : Identification et priorisation des leviers d'amélioration
- **Données** : 15 items BoM, 12 produits/services, 8 opportunités détaillées

## Fonctionnalités clés

### 1. Classification ABC (Onglet Pareto)
- **Graphiques de Pareto** pour BoM et produits
- **Classification automatique** : A (80%), B (15%), C (5%)
- **Visualisation cumulative** avec courbes de pourcentage
- **Statistiques résumées** par catégorie

### 2. Bill of Materials (Onglet BoM)
- **15 composants** classifiés par coût annuel
- **Informations fournisseurs** et délais de livraison
- **Pourcentages** de contribution et valeurs cumulées
- **Tri par impact** pour prioriser les négociations

### 3. Produits & Services (Onglet)
- **12 produits et 4 services** analysés
- **Classification par marge** annuelle
- **Identification** des produits les plus rentables
- **Mix produit** optimal basé sur la contribution

### 4. Opportunités de Productivité (Onglet)
- **8 initiatives** détaillées et priorisées
- **266 150€/an** de potentiel d'économies identifié
- **ROI calculé** pour chaque opportunité
- **Actions recommandées** et causes racines
- **Impact KPI** prédit pour chaque initiative

## Données d'exemple

### Top 3 opportunités
1. **Réduction du rework en peinture** : 63 750€/an (ROI: 4.7 mois)
2. **Optimisation changements de série** : 40 800€/an (ROI: 4.4 mois)
3. **Maintenance préventive** : 38 500€/an (ROI: 5.6 mois)

### Distribution BoM
- **Catégorie A** : 4 items = 818 450€ (80% du coût total)
- **Catégorie B** : 5 items = 152 950€ (15% du coût total)
- **Catégorie C** : 6 items = 50 650€ (5% du coût total)

## Technologies utilisées

- **Plotly.js 2.35.2** : Visualisations interactives (Pareto, Sankey, Heatmap)
- **Vanilla JavaScript** : Logique de classification et rendu
- **CSS3** : Interface moderne avec dark theme
- **JSON** : Stockage de données structurées

## Navigation

- **Vers démo originale** : Cliquez sur "← Retour à la démo originale" dans le header
- **Vers ABC Analysis** : Depuis la démo originale, cliquez sur "→ Voir l'analyse ABC complète"

## Utilisation

1. **Ouvrez** `index.html` dans un navigateur web moderne
2. **Explorez** les 4 onglets d'analyse ABC
3. **Interagissez** avec le curseur What-if pour simuler les réductions de rework
4. **Analysez** les opportunités par priorité et ROI

## Méthodologie ABC

### Principe de Pareto (80/20)
L'analyse ABC applique le principe de Pareto qui stipule que :
- **20% des éléments** génèrent **80% de l'impact**
- **30% des éléments** génèrent **15% de l'impact**
- **50% des éléments** génèrent **5% de l'impact**

### Applications
- **Gestion des stocks** : Focus sur items catégorie A
- **Négociations fournisseurs** : Prioriser les gros volumes
- **Portfolio produits** : Optimiser le mix par marge
- **Amélioration continue** : Prioriser initiatives à fort ROI

## Personnalisation

Pour adapter à vos propres données :

1. **Modifiez** les fichiers JSON dans `/data/`
2. **Ajustez** les seuils ABC dans `classifyABC()` si nécessaire
3. **Personnalisez** les couleurs dans `style.css`
4. **Ajoutez** de nouvelles métriques ou KPI dans `app.js`

## Support

Pour des questions ou suggestions :
- Consultez la démo originale pour comprendre les bases
- Analysez les fichiers JSON pour voir la structure des données
- Modifiez les paramètres dans le code pour expérimentation

---

**© CGC 2024 - 2025** | ABC Analysis & Productivity Enhancement
