import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { 
  Settings as SettingsIcon, 
  Globe, 
  DollarSign, 
  Package, 
  Save, 
  RefreshCw,
  AlertCircle,
  Calculator,
  TrendingUp,
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Key,
  Users,
  FileText,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // États des paramètres
  const [settings, setSettings] = useState({
    // Général
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    
    // Modules
    employeesModule: true,
    documentsModule: true,
    tasksModule: true,
    settingsModule: true,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    documentUpdates: true,
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    
    // Apparence
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false,
    
    // Base de données
    autoBackup: true,
    backupFrequency: 'daily',
    retentionDays: 30
  });

  const currencies = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'XAF', symbol: 'F.CFA', name: 'Franc CFA' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling' }
  ];

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const timezones = [
    { code: 'Europe/Paris', name: 'Europe/Paris (UTC+1)' },
    { code: 'Europe/London', name: 'Europe/London (UTC+0)' },
    { code: 'America/New_York', name: 'America/New_York (UTC-5)' },
    { code: 'Africa/Douala', name: 'Africa/Douala (UTC+1)' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!hasChanges) {
      toast.info('Aucun changement à sauvegarder');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir sauvegarder ces paramètres ?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast.success('Paramètres sauvegardés avec succès');
      
      // Recharger la page pour appliquer les changements
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      setSettings({
        language: 'fr',
        timezone: 'Europe/Paris',
        dateFormat: 'DD/MM/YYYY',
        currency: 'EUR',
        employeesModule: true,
        documentsModule: true,
        tasksModule: true,
        settingsModule: true,
        emailNotifications: true,
        pushNotifications: false,
        taskReminders: true,
        documentUpdates: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: 'medium',
        theme: 'light',
        sidebarCollapsed: false,
        compactMode: false,
        autoBackup: true,
        backupFrequency: 'daily',
        retentionDays: 30
      });
      setHasChanges(true);
      toast.success('Paramètres réinitialisés');
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configuration de l'application et des préférences utilisateur
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleResetSettings}
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réinitialiser
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!hasChanges || isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Base de données
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    {timezones.map(tz => (
                      <option key={tz.code} value={tz.code}>
                        {tz.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Format de date</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Devise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise par défaut</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Taux de change</h4>
                      <p className="text-xs text-blue-700">Les taux sont mis à jour automatiquement</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Modules */}
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Modules de l'application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Module Employés</h4>
                      <p className="text-sm text-gray-500">Gestion des employés et RH</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.employeesModule}
                      onChange={(e) => handleSettingChange('employeesModule', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Module Documents</h4>
                      <p className="text-sm text-gray-500">Gestion documentaire</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.documentsModule}
                      onChange={(e) => handleSettingChange('documentsModule', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Module Tâches</h4>
                      <p className="text-sm text-gray-500">Gestion des tâches et projets</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.tasksModule}
                      onChange={(e) => handleSettingChange('tasksModule', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <SettingsIcon className="h-5 w-5 text-gray-600 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Module Paramètres</h4>
                      <p className="text-sm text-gray-500">Configuration système</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.settingsModule}
                      onChange={(e) => handleSettingChange('settingsModule', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Préférences de notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications par email</h4>
                    <p className="text-sm text-gray-500">Recevoir des notifications par email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications push</h4>
                    <p className="text-sm text-gray-500">Recevoir des notifications push</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Rappels de tâches</h4>
                    <p className="text-sm text-gray-500">Notifications pour les échéances de tâches</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.taskReminders}
                      onChange={(e) => handleSettingChange('taskReminders', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mises à jour de documents</h4>
                    <p className="text-sm text-gray-500">Notifications pour les modifications de documents</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.documentUpdates}
                      onChange={(e) => handleSettingChange('documentUpdates', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Authentification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
                    <p className="text-sm text-gray-500">Sécuriser votre compte avec 2FA</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Délai d'expiration de session (minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Politique de mot de passe</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={settings.passwordPolicy}
                    onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
                  >
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Accès
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-900">Sécurité renforcée</h4>
                      <p className="text-xs text-yellow-700">Activez l'authentification à deux facteurs pour plus de sécurité</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Sessions actives</h4>
                  <div className="text-sm text-gray-500">
                    <p>• Session actuelle: {user?.email || 'Utilisateur'}</p>
                    <p>• Dernière connexion: {new Date().toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Apparence */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Thème et apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thème</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="auto">Automatique</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Barre latérale réduite</h4>
                  <p className="text-sm text-gray-500">Réduire la barre latérale par défaut</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('sidebarCollapsed', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Mode compact</h4>
                  <p className="text-sm text-gray-500">Interface plus compacte</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Base de données */}
        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Sauvegarde et maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Sauvegarde automatique</h4>
                  <p className="text-sm text-gray-500">Sauvegarder automatiquement les données</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.autoBackup}
                    onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence de sauvegarde</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rétention des sauvegardes (jours)</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={settings.retentionDays}
                  onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
                />
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-green-900">Statut de la base de données</h4>
                    <p className="text-xs text-green-700">Connexion Railway active - Toutes les données sont synchronisées</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}