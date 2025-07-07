# 📘 Cahier des Charges – Application QR & Pages explicatives pour chalets

## 1. Contexte

Un propriétaire de chalets en location souhaite offrir à ses locataires un accès rapide à des explications sur l'utilisation des objets et équipements présents dans chaque chalet (ex : jacuzzi, télévision, poêle à bois, etc.).

L’objectif est de rendre ces explications facilement accessibles via des **QR codes** disposés dans les chalets. Lorsqu’un locataire scanne un QR code, il accède directement à une page explicative dédiée, lisible depuis un smartphone.

## 2. Objectifs de l'application

Développer une application web permettant :

- À un administrateur de **créer, éditer et gérer des pages explicatives** par chalet.
- De **générer automatiquement des QR codes** pour chaque page.
- De permettre aux utilisateurs finaux (locataires) de **consulter les pages** sans authentification.
- De **générer un PDF** contenant tous les QR codes d’un chalet pour impression.

## 3. Fonctionnalités

### 3.1 Gestion des chalets (admin uniquement)

- Création, modification et suppression de chalets.
- Visualisation d’un **dashboard** par chalet listant les pages associées.

### 3.2 Gestion des pages

- Création et édition de pages explicatives via un **éditeur WYSIWYG markdown** (type Notion).
- Chaque page peut contenir :
  - Texte (Markdown)
  - Images
  - Vidéos (liens YouTube, etc.)
  - Liens externes
- Organisation des pages par **catégories ou tags** (ex. "Cuisine", "Sécurité", "Extérieur").
- Aperçu en temps réel du rendu final de la page.

### 3.3 QR Codes

- QR code **généré automatiquement** à la création de chaque page.
- Possibilité de :
  - Télécharger le QR code individuellement depuis la page.
  - Générer un **PDF contenant tous les QR codes** d’un chalet (avec titre + nom du chalet).

### 3.4 Accès visiteurs (locataires)

- Accès en lecture seule à chaque page via une **URL unique** (contenue dans le QR code).
- Interface **responsive mobile**, simple et optimisée pour la lecture sur smartphone.

### 3.5 Authentification et sécurité

- Système de connexion **admin uniquement** (pas d’inscription publique).
- Authentification via **cookies HTTP-only sécurisés**.
- Possibilité d’ajouter de nouveaux comptes uniquement depuis un compte déjà connecté.
- Si connecté → mode édition/gestion activé ; sinon → lecture seule.

## 4. Architecture technique

### Backend

- **Node.js / Express** ou équivalent
- **MongoDB** pour le stockage
- Authentification via **cookies HTTP-only**
- QR codes générés avec une lib JS (ex : `qrcode`)
- PDF générés avec `pdfkit`, `puppeteer` ou équivalent

#### Structure MongoDB (exemple)

```json
{
  "chalet": "Cèdre",
  "pages": [
    {
      "title": "Utiliser le jacuzzi",
      "content": "Markdown...",
      "tags": ["Extérieur"],
      "slug": "utiliser-jacuzzi",
      "qrCodeUrl": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Frontend

- Framework : **React** ou équivalent
- Éditeur markdown WYSIWYG : **TipTap** (type Notion)
- Interface admin : dashboard par chalet
- Interface publique : lecture des pages
- **Responsive design** (mobile-first)

### Déploiement

- Application **dockerisée**
- Plateforme cible à définir (VPS, Render, Railway, etc.)
- Prévoir Docker Compose pour simplifier le setup

## 5. Contraintes et évolutivité

- Application uniquement en **français** pour le moment, mais conçue de manière extensible pour l’internationalisation.
- Une seule personne est admin à la base, mais possibilité d’en ajouter via l’interface admin.
- Aucune fonctionnalité sociale prévue (pas de commentaires, likes, etc.)

## 6. Livrables attendus

- Application web fonctionnelle (admin + public)
- Documentation d’installation et d’utilisation
- Générateur de QR codes + PDF imprimable intégré
- (Optionnel) Dock
