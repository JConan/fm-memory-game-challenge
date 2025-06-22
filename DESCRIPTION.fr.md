## Description de l'Application

Cette application est un jeu de mémoire interactif conçu pour défier et améliorer les capacités de mémorisation des utilisateurs. Le jeu propose deux niveaux de difficulté : une grille de 4x4 pour les débutants et une grille de 6x6 pour les joueurs avancés. Utilisant React comme principale bibliothèque, l'application offre une interface utilisateur fluide et réactive, avec des animations engageantes pour chaque paire trouvée.
Challenges et Solutions

## Gestion de l'État des Cartes :

#### **Challenge**:

Assurer une gestion efficace de l'état des cartes (retournées, trouvées, cachées) pour éviter les comportements inattendus.

#### **Solution**:

Utilisation de hooks comme useState pour gérer l'état des cartes individuellement et useEffect pour déclencher des actions spécifiques lorsque certaines conditions sont remplies, comme retourner les cartes après un délai si elles ne sont pas une paire.

## Responsivité et UX :

#### **Challenge**:

Assurer que le jeu soit jouable sur diverses tailles d'écran, des mobiles aux ordinateurs de bureau.

#### **Solution**:

Mise en place de media queries pour ajuster les tailles de cartes et des espaces, et ajout d'animations CSS pour rendre le jeu visuellement attrayant.

## Gestion du Temps et des Scores :

#### **Challenge**:

Intégrer un système de chronomètre et de score pour augmenter l'engagement des utilisateurs.

#### **Solution**:

Implémentation d'un compteur de temps avec useState et useEffect pour mettre à jour le temps écoulé, et calcul du score basé sur le temps et le nombre de mouvements effectués, affiché dynamiquement à l'utilisateur.
