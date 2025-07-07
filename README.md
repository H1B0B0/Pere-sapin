# Père Sapin - Application de gestion QR codes pour chalets

Application web permettant de gérer des QR codes pour l'accès aux informations des équipements dans les chalets en location.

## 🚀 Démarrage rapide avec Docker

### Prérequis

- Docker et Docker Compose installés
- Ports 3000, 5042 et 27017 disponibles

### Installation

1. **Cloner le projet** (si pas déjà fait)

```bash
git clone <votre-repo>
cd pere-sapin
```

2. **Démarrer l'application**

```bash
docker-compose up
```

L'application sera disponible sur :

- **Frontend (public)** : http://localhost:3000
- **Backend API** : http://localhost:5042
- **MongoDB** : localhost:27017

### Première connexion

Un compte administrateur par défaut est créé automatiquement :

- **Email** : `admin@pere-sapin.com`
- **Mot de passe** : `admin123`

🔐 **Important** : Changez ce mot de passe après la première connexion !

## 📱 Utilisation

### Interface publique

- Accès direct aux pages via QR codes
- URL format : `http://localhost:3000/page/[slug]`
- Interface optimisée mobile

### Interface d'administration

1. Accédez à http://localhost:3000/admin/login
2. Connectez-vous avec les identifiants par défaut
3. Créez vos chalets
4. Ajoutez des pages explicatives
5. Téléchargez les PDF de QR codes

## 🏗️ Architecture

### Backend (NestJS + MongoDB)

- **Port** : 5042
- **Base de données** : MongoDB
- **Authentification** : JWT + cookies sécurisés
- **Génération QR** : qrcode library
- **Génération PDF** : Puppeteer

### Frontend (Next.js + React)

- **Port** : 3000
- **UI** : HeroUI + Tailwind CSS
- **État** : Zustand
- **Éditeur** : TipTap (markdown)

## 🔧 Développement

### Structure du projet

```
pere-sapin/
├── backend/          # API NestJS
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── schemas/
│   │   └── dto/
│   └── package.json
├── frontend/         # Application Next.js
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
└── docker-compose.yml
```

### Scripts utiles

**Backend** :

```bash
cd backend
npm run dev          # Démarrage développement
npm run create-admin # Créer un admin manuellement
npm run build        # Build production
```

**Frontend** :

```bash
cd frontend
npm run dev          # Démarrage développement
npm run build        # Build production
```

### Développement sans Docker

1. **Démarrer MongoDB localement** (port 27017)
2. **Backend** :

```bash
cd backend
npm install
npm run dev
```

3. **Frontend** :

```bash
cd frontend
npm install
npm run dev
```

## 📊 Fonctionnalités

### ✅ Implémentées

- [x] Gestion des chalets (CRUD)
- [x] Gestion des pages (CRUD)
- [x] Authentification admin
- [x] Génération automatique QR codes
- [x] Affichage public des pages
- [x] Export PDF des QR codes
- [x] Interface responsive
- [x] Éditeur markdown

### 🚧 À venir

- [ ] Éditeur WYSIWYG complet (TipTap)
- [ ] Upload d'images
- [ ] Gestion multi-utilisateurs
- [ ] Statistiques de consultation
- [ ] Thèmes personnalisables

## 🔒 Sécurité

- Authentification JWT avec cookies HTTP-only
- Routes admin protégées par middleware
- Validation des données avec class-validator
- Variables d'environnement pour les secrets

## 🐛 Dépannage

### Problèmes courants

**Port déjà utilisé** :

```bash
# Arrêter les containers
docker-compose down

# Vérifier les ports
lsof -i :3000
lsof -i :5042
lsof -i :27017
```

**Erreur MongoDB** :

```bash
# Supprimer les volumes et redémarrer
docker-compose down -v
docker-compose up
```

**Problème d'authentification** :

- Vérifiez que JWT_SECRET est défini
- Supprimez les cookies du navigateur
- Redémarrez le backend

## 📝 Variables d'environnement

### Backend (.env)

```env
NODE_ENV=development
PORT=5042
MONGODB_URI=mongodb://database:27017/pere-sapin
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5042
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

Développé avec ❤️ pour simplifier la gestion des chalets en location.
