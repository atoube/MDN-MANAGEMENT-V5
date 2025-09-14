# 🚂 Guide de Configuration Railway + Vercel

Ce guide vous explique comment configurer votre base de données MySQL sur Railway avec votre application Vercel.

## 📋 Prérequis

- Compte GitHub
- Compte Railway (gratuit)
- Compte Vercel (gratuit)
- Application MADON Management Suite déployée

## 🚀 Étape 1 : Créer la Base de Données sur Railway

### 1.1 Créer un Compte Railway
1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur "Login with GitHub"
3. Autorisez Railway à accéder à votre GitHub

### 1.2 Créer un Nouveau Projet
1. Cliquez sur "New Project"
2. Sélectionnez "Provision MySQL"
3. Attendez que la base de données soit créée (2-3 minutes)

### 1.3 Récupérer les Informations de Connexion
1. Cliquez sur votre service MySQL
2. Allez dans l'onglet "Variables"
3. Notez les valeurs suivantes :
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## 🔧 Étape 2 : Configurer Vercel

### 2.1 Ajouter les Variables d'Environnement
1. Allez sur votre projet Vercel
2. Cliquez sur "Settings" → "Environment Variables"
3. Ajoutez les variables suivantes :

```
RAILWAY_DB_HOST=votre_host_railway
RAILWAY_DB_PORT=3306
RAILWAY_DB_USER=root
RAILWAY_DB_PASSWORD=votre_password_railway
RAILWAY_DB_NAME=railway
RAILWAY_DB_SSL=true
```

### 2.2 Redéployer l'Application
1. Allez dans l'onglet "Deployments"
2. Cliquez sur "Redeploy" sur le dernier déploiement
3. Attendez que le déploiement soit terminé

## 🧪 Étape 3 : Tester la Connexion

### 3.1 Tester via l'API
Visitez : `https://votre-app.vercel.app/api/test-connection`

Vous devriez voir une réponse comme :
```json
{
  "success": true,
  "message": "Connexion à la base de données réussie",
  "connection": {
    "success": true,
    "message": "Connexion réussie"
  },
  "initialization": {
    "success": true,
    "message": "Base de données initialisée avec succès"
  }
}
```

### 3.2 Vérifier les Tables
1. Allez sur Railway
2. Cliquez sur votre service MySQL
3. Allez dans l'onglet "Data"
4. Vous devriez voir les tables :
   - `users`
   - `employees`
   - `documents`
   - `tasks`

## 📊 Étape 4 : Utiliser l'Application

### 4.1 Connexion
- Email : `admin@madon.com`
- Mot de passe : `admin123`

### 4.2 Fonctionnalités Disponibles
- **Dashboard** : Vue d'ensemble avec statistiques
- **Employés** : Gestion complète des employés
- **Documents** : Gestion des documents
- **Tâches** : Gestion des tâches et projets
- **Paramètres** : Configuration de l'application

## 🔍 Dépannage

### Problème : Erreur de Connexion
**Solution :**
1. Vérifiez que les variables d'environnement sont correctes
2. Assurez-vous que Railway est en cours d'exécution
3. Vérifiez que le SSL est activé

### Problème : Tables Non Créées
**Solution :**
1. Visitez `/api/test-connection` pour initialiser la base
2. Vérifiez les logs Vercel pour les erreurs
3. Redéployez l'application

### Problème : Données Non Sauvegardées
**Solution :**
1. Vérifiez que les API routes fonctionnent
2. Testez avec des requêtes directes
3. Vérifiez les permissions de la base de données

## 📈 Avantages de Railway

- ✅ **Gratuit** jusqu'à 5$ de crédit/mois
- ✅ **MySQL natif** avec SSL
- ✅ **Backup automatique**
- ✅ **Monitoring intégré**
- ✅ **Scaling automatique**
- ✅ **Interface simple**

## 🔗 Liens Utiles

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MySQL on Railway](https://docs.railway.app/databases/mysql)

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Railway
2. Vérifiez les logs Vercel
3. Testez la connexion via l'API
4. Contactez le support si nécessaire

---

**🎉 Félicitations !** Votre application MADON Management Suite est maintenant connectée à une vraie base de données MySQL sur Railway !
