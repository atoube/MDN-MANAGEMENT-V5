# 🚀 MDN-MANAGEMENT-V5

## 📋 Description

**MADON Management Suite - Version 5.0** - Application de gestion complète prête pour le déploiement en production.

Cette version est une version nettoyée et optimisée de MDN-MANAGEMENT-V4, avec tous les fichiers de debug et de test supprimés pour un déploiement propre.

## ✨ Fonctionnalités

- 🏢 **Gestion des Employés** - CRUD complet avec avatars
- 📊 **Tableau de Bord** - Métriques et statistiques en temps réel
- 📅 **Gestion des Absences** - Demandes de congés et suivi
- 💰 **Gestion Financière** - Salaires et budgets
- 📋 **Gestion des Tâches** - Suivi des projets et assignations
- 🔐 **Authentification** - Système de connexion sécurisé
- 📱 **Interface Responsive** - Compatible mobile et desktop
- 🎨 **Design Moderne** - Interface utilisateur intuitive

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **Base de Données**: MySQL/MariaDB
- **Styling**: Tailwind CSS + Radix UI
- **Cartes**: Leaflet + Google Maps
- **Graphiques**: Chart.js + Recharts
- **PDF**: jsPDF + AutoTable

## 🚀 Installation Rapide

### Prérequis
- Node.js 18+
- MySQL/MariaDB
- Git

### Installation
```bash
# Cloner le repository
git clone https://github.com/madon/mdn-management-v5.git
cd mdn-management-v5

# Installer les dépendances
npm install

# Installer les dépendances du serveur
cd server
npm install
cd ..

# Construire l'application
npm run build
```

## 🚀 Déploiement

### Option 1: Script Automatique
```bash
./deploy.sh
```

### Option 2: Déploiement Manuel
```bash
# Construire l'application
npm run build

# Démarrer le serveur API
npm run start:api
```

### Option 3: Développement
```bash
# Démarrer en mode développement
npm run dev:full
```

## 📁 Structure du Projet

```
MDN-MANAGEMENT-V5/
├── src/                    # Code source React/TypeScript
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── hooks/             # Hooks personnalisés
│   ├── lib/               # Utilitaires et configurations
│   └── types/             # Définitions TypeScript
├── server/                # API Backend Node.js
├── migrations/            # Scripts de base de données
├── dist/                  # Build de production
├── package.json           # Configuration npm
├── vite.config.ts         # Configuration Vite
├── tailwind.config.js     # Configuration Tailwind
└── deploy.sh              # Script de déploiement
```

## 🔧 Configuration

### Variables d'Environnement
```bash
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
```

### Base de Données
Exécutez les migrations dans l'ordre :
```bash
# Les fichiers de migration sont dans le dossier migrations/
# Exécutez-les dans l'ordre numérique
```

## 📚 Documentation

- [Guide de Déploiement](./DEPLOYMENT.md)
- [Manuel Utilisateur](./MANUEL_UTILISATEUR.md)
- [Résumé Base de Données](./DATABASE_SUMMARY.md)

## 🐛 Support

Pour toute question ou problème :
1. Consultez la documentation
2. Vérifiez les logs de la console
3. Contactez l'équipe de développement

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🏷️ Version

**Version 5.0.0** - Version de production stable
- ✅ Code nettoyé et optimisé
- ✅ Fichiers de debug supprimés
- ✅ Prêt pour déploiement
- ✅ Documentation complète

---

**Développé avec ❤️ par l'équipe MADON**