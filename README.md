# Visualisation d'Algorithmes de Graphes

Une application web interactive pour visualiser et analyser les algorithmes de graphes, en se concentrant particulièrement sur l'algorithme du plus court chemin de Dijkstra et l'algorithme de flux maximum de Ford-Fulkerson.

## 🚀 Fonctionnalités

- Création et manipulation interactive de graphes
- Prise en charge de plusieurs algorithmes :
  - Algorithme de Dijkstra (Plus Court Chemin)
  - Algorithme de Ford-Fulkerson (Flux Maximum)
- Visualisation en temps réel de l'exécution des algorithmes
- Historique des chemins et fonction de relecture
- Support multilingue (Anglais/Français)
- Fonctionnalité d'exportation (rapports PDF)
- Interface utilisateur moderne et responsive

## 🛠️ Technologies Utilisées

### Technologies Principales
- **HTML5** : Structure et mise en page de l'application
- **CSS3** : Style et animations
  - Tailwind CSS : Framework CSS utilitaire pour designs modernes
- **JavaScript** : Langage de programmation principal
  - D3.js : Bibliothèque de visualisation de données pour le rendu interactif des graphes
  - jsPDF : Génération de PDF pour l'exportation des résultats

### Outils de Développement
- **Visual Studio Code** : IDE recommandé
  - Extensions :
    - Live Server
    - JavaScript (ES6) code snippets
    - Tailwind CSS IntelliSense
- **Git** : Gestion de versions
- **Navigateur Web Moderne** : Chrome/Firefox/Edge (dernières versions)

## 📁 Structure du Projet

```
projet/
│
├── index.html          # Fichier HTML principal contenant la structure de l'application
├── styles.css         # Styles CSS personnalisés et animations
├── script.js          # Fonctionnalités JavaScript principales et algorithmes
└── README.md         # Documentation du projet
```

### Description des Fichiers

- **index.html** :
  - Point d'entrée de l'application
  - Structure DOM
  - Chargement des ressources externes
  - Configuration de la mise en page responsive

- **styles.css** :
  - Style personnalisé pour les éléments du graphe
  - Définitions des animations
  - Règles de design responsive
  - Thèmes et schémas de couleurs

- **script.js** :
  - Structures de données des graphes
  - Implémentation des algorithmes
  - Configuration de la visualisation D3.js
  - Gestionnaires d'événements et interactions UI

## 🚀 Pour Commencer

### Prérequis
- Navigateur web moderne
- Visual Studio Code (ou IDE similaire)
- Connaissance de base des technologies web

### Installation

1. Cloner le dépôt :
```bash
git clone [url-du-dépôt]
```

2. Ouvrir le projet dans Visual Studio Code

3. Installer l'extension Live Server :
   - Ouvrir VS Code
   - Aller dans Extensions (Ctrl+Shift+X)
   - Rechercher "Live Server"
   - Installer et redémarrer VS Code

4. Lancer l'application :
   - Clic droit sur `index.html`
   - Sélectionner "Ouvrir avec Live Server"
   - L'application s'ouvrira dans votre navigateur par défaut

## 🎯 Utilisation

### Création d'un Graphe
1. Utiliser les contrôles du panneau gauche pour ajouter des nœuds et des arêtes
2. Cliquer sur "Ajouter un Nœud" pour créer de nouveaux nœuds
3. Sélectionner les nœuds source et cible, spécifier le poids/capacité
4. Cliquer sur "Ajouter une Arête" pour créer des connexions

### Exécution des Algorithmes
1. Sélectionner l'algorithme souhaité dans le menu déroulant
2. Choisir les nœuds de départ et d'arrivée
3. Cliquer sur "Trouver le Chemin" pour exécuter
4. Observer la visualisation et les résultats

### Exemple d'Utilisation
- Charger le réseau exemple avec "Charger l'Exemple de Flux"
- Expérimenter avec différents chemins et flux
- Exporter les résultats en PDF

## 🔧 Détails des Algorithmes

### Algorithme de Dijkstra
- Trouve le plus court chemin entre les nœuds
- Utilise les poids des arêtes comme distances
- Visualise le processus de découverte du chemin

### Algorithme de Ford-Fulkerson
- Calcule le flux maximum dans un réseau
- Utilise les capacités des arêtes
- Montre les chemins augmentants et le graphe résiduel

## 🌐 Internationalisation

L'application prend en charge plusieurs langues :
- Anglais (par défaut)
- Français

La langue peut être changée via le menu déroulant dans l'en-tête.

## 📊 Fonctionnalités de Visualisation

- Manipulation interactive du graphe
- Animation des algorithmes en temps réel
- Nœuds et arêtes en couleur
- Étiquettes de flux/capacité
- Mise en évidence des chemins
- Contrôles de zoom et de panoramique

## 💾 Gestion des Données

- Stockage local des paramètres
- Suivi de l'historique des chemins
- Fonctionnalité d'exportation PDF
- Persistance de l'état du graphe

## 🎨 Caractéristiques UI/UX

- Interface moderne et épurée
- Design responsive
- Contrôles intuitifs
- Retour en temps réel
- Info-bulles informatives
- Gestion des erreurs

## 🔍 Implémentation Technique

### Représentation du Graphe
- Nœuds : Sommets dans le graphe
- Arêtes : Connexions avec poids/capacités
- Liste d'adjacence pour un parcours efficace

### Visualisation
- Disposition basée sur les forces
- Rendu basé sur SVG
- Mises à jour dynamiques
- Transitions fluides

### Algorithmes
- Implémentations efficaces
- Visualisation étape par étape
- Présentation claire des résultats

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion, veuillez contacter :
[Vos Informations de Contact]

## 🙏 Remerciements

- Communauté D3.js
- Équipe Tailwind CSS
- Contributeurs open source

---
Fait avec ❤️ en utilisant des technologies web modernes 