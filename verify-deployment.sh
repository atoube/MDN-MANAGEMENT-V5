#!/bin/bash

# Script de vérification du déploiement - MDN Management V5
echo "🔍 Vérification du déploiement MDN Management V5.0.0"
echo "=================================================="

# Vérifier la structure des fichiers essentiels
echo "📁 Vérification de la structure des fichiers..."

required_files=(
    "package.json"
    "README.md"
    "DEPLOYMENT.md"
    "MANUEL_UTILISATEUR.md"
    "src/App.tsx"
    "src/main.tsx"
    "server/index.cjs"
    "deploy.sh"
    "start-api.sh"
    "vite.config.ts"
    "tailwind.config.js"
    "tsconfig.json"
    ".gitignore"
    "LICENSE"
    "CHANGELOG.md"
    "env.example"
)

missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - MANQUANT"
        missing_files+=("$file")
    fi
done

# Vérifier les dossiers essentiels
echo ""
echo "📂 Vérification des dossiers..."

required_dirs=(
    "src"
    "src/components"
    "src/pages"
    "src/hooks"
    "src/types"
    "server"
    "migrations"
)

for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/"
    else
        echo "❌ $dir/ - MANQUANT"
        missing_files+=("$dir/")
    fi
done

# Vérifier le package.json
echo ""
echo "📦 Vérification du package.json..."

if [ -f "package.json" ]; then
    version=$(grep '"version"' package.json | cut -d'"' -f4)
    name=$(grep '"name"' package.json | cut -d'"' -f4)
    echo "✅ Nom: $name"
    echo "✅ Version: $version"
    
    if [ "$version" = "5.0.0" ]; then
        echo "✅ Version correcte pour le déploiement"
    else
        echo "⚠️  Version: $version (attendu: 5.0.0)"
    fi
else
    echo "❌ package.json manquant"
fi

# Vérifier Git
echo ""
echo "🔧 Vérification Git..."

if [ -d ".git" ]; then
    echo "✅ Repository Git initialisé"
    
    # Compter les commits
    commit_count=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    echo "✅ Commits: $commit_count"
    
    # Vérifier le statut
    if git diff --quiet HEAD; then
        echo "✅ Working directory propre"
    else
        echo "⚠️  Modifications non commitées détectées"
    fi
else
    echo "❌ Repository Git non initialisé"
fi

# Vérifier les scripts de déploiement
echo ""
echo "🚀 Vérification des scripts de déploiement..."

scripts=("deploy.sh" "start-api.sh" "start-dev.sh")

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        if [ -x "$script" ]; then
            echo "✅ $script (exécutable)"
        else
            echo "⚠️  $script (non exécutable)"
        fi
    else
        echo "❌ $script manquant"
    fi
done

# Résumé
echo ""
echo "📊 RÉSUMÉ DE LA VÉRIFICATION"
echo "============================"

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "🎉 SUCCÈS: Tous les fichiers essentiels sont présents!"
    echo "✅ Le projet est prêt pour le déploiement"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "1. Configurer les variables d'environnement (copier env.example vers .env)"
    echo "2. Installer les dépendances: npm install"
    echo "3. Construire l'application: npm run build"
    echo "4. Déployer: ./deploy.sh"
    echo ""
    echo "🔗 Documentation disponible:"
    echo "- README.md - Guide principal"
    echo "- DEPLOYMENT.md - Instructions de déploiement"
    echo "- MANUEL_UTILISATEUR.md - Guide utilisateur"
else
    echo "⚠️  ATTENTION: $(( ${#missing_files[@]} )) fichier(s) manquant(s):"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "❌ Le projet n'est pas prêt pour le déploiement"
fi

echo ""
echo "🏷️  Version: 5.0.0 - MDN Management Suite"
echo "📅 Date: $(date)"
echo "=================================================="
