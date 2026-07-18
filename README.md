# Page_Meteo_001--dynamique
Dans le cadre du cours LOG3500 (Conception et programmation de sites Web I), ce devoir consistait à concevoir une application web responsive connectée à une API réelle. L'option choisie est l'Option 2 : « Le Tableau de Bord Météo Dynamique », qui permet à l'utilisateur de rechercher une ville et d'obtenir ses conditions météorologiques actuelles (température, vent et statut du ciel), grâce aux API publiques Open-Meteo (géocodage et prévisions).

Structure et mise en page (HTML5 / CSS)
●	Structure HTML5 sémantique : header, nav, main, section, footer
●	Mise en page réalisée avec Flexbox et CSS Grid
●	Design responsive avec Media Queries (smartphones, tablettes, ordinateurs)
●	Indicateur de chargement affiché pendant les requêtes réseau
●	Arrière-plan dynamique selon le jour/nuit, avec image et dégradé

2.2 Logique JavaScript et accessibilité
●	Interception du formulaire avec event.preventDefault() et nettoyage de la saisie (.trim())
●	Validation d'accessibilité : aria-invalid, message d'erreur relié via aria-describedby
●	Appels asynchrones avec fetch(), async/await et blocs try...catch
●	Gestion des erreurs API (ville introuvable) et des erreurs réseau (connexion impossible)
●	Utilisation exclusive de textContent pour l'affichage des données (protection contre les failles XSS)
●	Fonctionnalité additionnelle : liste de choix lorsque plusieurs villes portent le même nom
●	Fonctionnalité additionnelle : icône météo et descriptions qualitatives (température, vent)

2.3 Technologies utilisées
●	HTML5, CSS3 (Flexbox, Grid, Media Queries)
●	JavaScript (ES6+) : fetch, async/await, manipulation du DOM
●	API Open-Meteo : géocodage (geocoding-api.open-meteo.com) et prévisions (api.open-meteo.com)
