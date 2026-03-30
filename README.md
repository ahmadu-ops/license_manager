# 🔑 LicenceManager

Système complet de gestion de licences logicielles avec architecture API REST découplée.

Développé pour le marché sénégalais (FCFA, locale fr-SN).

![Stack](https://img.shields.io/badge/Laravel-13-red?style=flat-square)
![Stack](https://img.shields.io/badge/React-19-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square)
![Stack](https://img.shields.io/badge/MySQL-8-orange?style=flat-square)

---

## 📸 Fonctionnalités

### Tableau de bord
- 6 KPIs : total, actives, expirées, expirant sous 30j, investissement FCFA, sièges utilisés
- 5 graphiques interactifs (Recharts) :
  - Barres : licences par catégorie
  - Donut : répartition par statut
  - Barres horizontales : top 5 logiciels par investissement
  - Donut : répartition par type (abonnement/perpétuelle/essai)
  - Courbe : évolution des dépenses sur 6 mois
- Table des alertes urgentes

### Gestion des licences (CRUD complet)
- Liste paginée (15/page) avec filtres : statut, catégorie, recherche (debounce 300ms)
- Clé de licence chiffrée en base (cast `encrypted`), masquée/révélée côté UI
- Bouton copier la clé (clipboard)
- Badge statut dynamique (Active, Expirée, Révoquée)
- Calcul automatique coût/siège
- Export PDF professionnel (A4 paysage)

### Gestion des logiciels (CRUD)
- Catalogue avec vue en cartes
- Catégorisation : Antivirus, Bureautique, Design, Développement, Autre
- Avatars par initiales colorées selon la catégorie
- Protection contre la suppression si des licences sont associées

### Attributions
- Assigner une licence à un utilisateur/appareil
- Barre de progression des sièges (X/Y)
- Alerte automatique si dépassement de capacité
- Retour d'attribution

### Alertes
- Commande Artisan `licenses:check-expiry` (planifiable en cron quotidien)
- 3 types : expiration proche (30j), expirée, surutilisée
- Badge compteur temps réel dans le header
- Marquage comme lue

### Design
- Dark/Light mode avec toggle animé (persisté en localStorage)
- Responsive mobile avec menu hamburger
- Modal de confirmation pour les suppressions
- Skeleton loaders pendant le chargement
- Toast notifications (react-hot-toast)
- Page 404 personnalisée

---

## 🛠 Stack technique

| Couche    | Technologie                                              |
|-----------|----------------------------------------------------------|
| Backend   | Laravel 13, PHP 8.3+, Sanctum (API tokens), MySQL       |
| Frontend  | React 19, Vite, Tailwind CSS v4, Recharts, Axios         |
| Auth      | Token Bearer via Sanctum (stocké en localStorage)        |
| PDF       | barryvdh/laravel-dompdf                                  |
| Comm.     | API REST JSON uniquement (pas d'Inertia)                 |

---

## 📁 Structure du projet

```
license-manager/
├── backend/                          # API Laravel
│   ├── app/
│   │   ├── Console/Commands/
│   │   │   └── CheckLicenseExpiry.php
│   │   ├── Enums/
│   │   │   ├── AlertType.php
│   │   │   ├── LicenseStatus.php
│   │   │   ├── LicenseType.php
│   │   │   └── SoftwareCategory.php
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AlertController.php
│   │   │   │   ├── AssignmentController.php
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── LicenseController.php
│   │   │   │   └── SoftwareController.php
│   │   │   ├── Middleware/
│   │   │   │   └── Cors.php
│   │   │   └── Requests/
│   │   │       ├── LoginRequest.php
│   │   │       ├── StoreAssignmentRequest.php
│   │   │       ├── StoreLicenseRequest.php
│   │   │       ├── StoreSoftwareRequest.php
│   │   │       └── UpdateLicenseRequest.php
│   │   └── Models/
│   │       ├── Alert.php
│   │       ├── Assignment.php
│   │       ├── License.php
│   │       ├── Software.php
│   │       └── User.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       ├── UserSeeder.php
│   │       ├── SoftwareSeeder.php
│   │       └── LicenseSeeder.php
│   ├── resources/views/exports/
│   │   └── licenses-pdf.blade.php
│   ├── routes/
│   │   ├── api.php
│   │   └── console.php
│   └── bootstrap/app.php
│
├── frontend/                         # SPA React
│   ├── src/
│   │   ├── components/
│   │   │   ├── AlertBadge.jsx
│   │   │   ├── AssignmentModal.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── KPICard.jsx
│   │   │   ├── SkeletonTable.jsx
│   │   │   ├── SoftwareAvatar.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── layouts/
│   │   │   ├── Header.jsx
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   ├── Alerts.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LicenseForm.jsx
│   │   │   ├── LicenseIndex.jsx
│   │   │   ├── LicenseShow.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── SoftwareForm.jsx
│   │   │   └── SoftwareIndex.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prérequis

- PHP 8.3+
- Composer 2+
- Node.js 18+
- MySQL 8+

### 1. Cloner le projet

```bash
git clone https://github.com/votre-user/license-manager.git
cd license-manager
```

### 2. Backend (Laravel)

```bash
cd backend

# Installer les dépendances
composer install

# Copier la config
cp .env.example .env

# Générer la clé (nécessaire pour le chiffrement des clés de licence)
php artisan key:generate
```

Configurer le fichier `.env` :

```env
APP_NAME="License Manager"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=license_manager
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

Créer la base de données MySQL :

```sql
CREATE DATABASE license_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Lancer les migrations et seeders :

```bash
php artisan migrate --seed
```

Démarrer le serveur :

```bash
php artisan serve --port=8000
```

### 3. Frontend (React)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### 4. Accéder à l'application

- **Frontend** : http://localhost:5173
- **API** : http://localhost:8000/api

**Identifiants de démonstration** :
```
Email    : admin@licences.sn
Mot de passe : password
```

---

## 📡 API Endpoints

### Authentification

| Méthode | URL            | Description       |
|---------|----------------|--------------------|
| POST    | /api/login     | Connexion          |
| POST    | /api/logout    | Déconnexion        |

### Dashboard

| Méthode | URL                  | Description                |
|---------|----------------------|----------------------------|
| GET     | /api/dashboard/stats | KPIs + données graphiques  |

### Licences

| Méthode | URL                              | Description                        |
|---------|----------------------------------|------------------------------------|
| GET     | /api/licenses                    | Liste paginée (filtres: status, category, search) |
| POST    | /api/licenses                    | Créer une licence                  |
| GET     | /api/licenses/{id}               | Détail d'une licence               |
| PUT     | /api/licenses/{id}               | Modifier une licence               |
| DELETE  | /api/licenses/{id}               | Supprimer une licence              |
| GET     | /api/licenses/export-pdf-download| Export PDF (token en query string)  |

### Logiciels

| Méthode | URL                    | Description              |
|---------|------------------------|--------------------------|
| GET     | /api/softwares         | Liste des logiciels      |
| POST    | /api/softwares         | Créer un logiciel        |
| GET     | /api/softwares/{id}    | Détail d'un logiciel     |
| PUT     | /api/softwares/{id}    | Modifier un logiciel     |
| DELETE  | /api/softwares/{id}    | Supprimer un logiciel    |

### Attributions

| Méthode | URL                                    | Description              |
|---------|----------------------------------------|--------------------------|
| POST    | /api/licenses/{id}/assignments         | Créer une attribution    |
| PATCH   | /api/assignments/{id}/return           | Retourner une attribution|

### Alertes

| Méthode | URL                      | Description              |
|---------|--------------------------|--------------------------|
| GET     | /api/alerts              | Alertes non lues         |
| PATCH   | /api/alerts/{id}/read    | Marquer comme lue        |

---

## 🗄 Modèle de données

```
softwares
├── id
├── name
├── vendor
├── category (enum: antivirus, office, design, dev, other)
├── logo_url (nullable)
├── website (nullable)
└── timestamps

licenses
├── id
├── software_id (FK → softwares)
├── license_key (chiffré via cast encrypted)
├── type (enum: perpetual, subscription, trial)
├── seats (int)
├── status (enum: active, expired, revoked)
├── purchased_at (date)
├── expires_at (date, nullable)
├── cost (decimal) — en FCFA
├── notes (nullable)
└── timestamps

assignments
├── id
├── license_id (FK → licenses)
├── assigned_to (string)
├── device_name (nullable)
├── assigned_at (datetime)
├── returned_at (datetime, nullable)
└── timestamps

alerts
├── id
├── license_id (FK → licenses)
├── type (enum: expiry_soon, expired, overused)
├── triggered_at (datetime)
├── is_read (boolean)
└── timestamps
```

---

## ⏰ Tâche planifiée

Vérification quotidienne des expirations :

```bash
# Exécution manuelle
php artisan licenses:check-expiry

# Planification automatique (déjà configuré dans routes/console.php)
# Ajouter au crontab du serveur :
* * * * * cd /chemin/vers/backend && php artisan schedule:run >> /dev/null 2>&1
```

Cette commande :
- Marque les licences expirées (status → expired)
- Crée des alertes `expired` pour les nouvelles expirations
- Crée des alertes `expiry_soon` pour les licences expirant dans 30 jours
- Crée des alertes `overused` pour les licences dont les sièges sont dépassés

---

## 🏗 Build production

### Frontend

```bash
cd frontend
npm run build
# Les fichiers statiques sont générés dans dist/
```

### Backend

```bash
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

## 📦 Seeds de démonstration

Le seeder génère :
- **1 utilisateur** : Abdoulaye Diallo (admin@licences.sn)
- **10 logiciels** : Microsoft 365, Adobe CC, Norton, Slack, JetBrains, Figma, AutoCAD, Kaspersky, Visual Studio, Zoom
- **20 licences** variées : abonnements, perpétuelles, essais — actives, expirées, révoquées
- **12 attributions** avec noms sénégalais et postes de travail
- **4 alertes** initiales (expiration proche + expirées)

Les dates sont dynamiques (relatives à `now()`) pour que les graphiques affichent toujours des données pertinentes.

---

## 🧰 Technologies et librairies

### Backend
| Package                    | Usage                          |
|----------------------------|--------------------------------|
| laravel/sanctum            | Authentification API tokens    |
| barryvdh/laravel-dompdf    | Export PDF                     |

### Frontend
| Package                    | Usage                          |
|----------------------------|--------------------------------|
| react-router-dom           | Routage SPA                    |
| axios                      | Client HTTP                    |
| recharts                   | Graphiques interactifs         |
| react-hot-toast            | Notifications toast            |
| @heroicons/react           | Icônes SVG                     |
| tailwindcss                | Framework CSS utilitaire       |

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 👤 Auteur

Cheikhouna Modou Bamba FALL - ahmadu-ops