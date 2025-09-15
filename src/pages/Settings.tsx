import React, { useState } from 'react';
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
  Bell,
  Shield,
  Database,
  Palette,
  Languages,
  CreditCard,
  BarChart3,
  Users,
  FileText,
  Mail,
  Smartphone
} from 'lucide-react';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white shadow rounded-lg ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{ 
  children: React.ReactNode; 
  variant?: 'primary' | 'outline' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

const Input: React.FC<{ 
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
  label?: string;
}> = ({ placeholder, value, onChange, type = 'text', className = '', label }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    />
  </div>
);

const Select: React.FC<{ 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
}> = ({ value, onChange, children, className = '', label }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    >
      {children}
    </select>
  </div>
);

const Switch: React.FC<{ 
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
}> = ({ checked = false, onChange, label, description }) => (
  <div className="flex items-center justify-between">
    <div className="flex-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      }`}
      onClick={() => onChange?.(!checked)}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const Tabs: React.FC<{ children: React.ReactNode; defaultValue?: string }> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || 'general');
  
  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsList) {
          return React.cloneElement(child as any, { activeTab, setActiveTab });
        }
        if (React.isValidElement(child) && child.type === TabsContent) {
          return React.cloneElement(child as any, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList: React.FC<{ 
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}> = ({ children, activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="-mb-px flex space-x-8">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
      })}
    </nav>
  </div>
);

const TabsTrigger: React.FC<{ 
  value: string;
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}> = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab?.(value)}
    className={`py-2 px-1 border-b-2 font-medium text-sm ${
      activeTab === value
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {children}
  </button>
);

const TabsContent: React.FC<{ 
  value: string;
  children: React.ReactNode;
  activeTab?: string;
}> = ({ value, children, activeTab }) => (
  activeTab === value ? <div className="mt-6">{children}</div> : null
);

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // État des paramètres
  const [settings, setSettings] = useState({
    // Général
    companyName: 'MADON',
    companyEmail: 'contact@madon.com',
    companyPhone: '+237 6 12 34 56 78',
    companyAddress: 'Douala, Cameroun',
    
    // Langue et devise
    language: 'fr',
    currency: 'XAF',
    timezone: 'Africa/Douala',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Sécurité
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    
    // Modules
    employeesModule: true,
    tasksModule: true,
    documentsModule: true,
    financeModule: true,
    marketingModule: false,
    
    // Apparence
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false
  });

  // Taux de change (exemple - dans une vraie app, cela viendrait d'une API)
  const exchangeRates = {
    XAF: { EUR: 0.00152, USD: 0.00165, GBP: 0.00130 },
    EUR: { XAF: 655.957, USD: 1.08, GBP: 0.85 },
    USD: { XAF: 606.5, EUR: 0.92, GBP: 0.79 },
    GBP: { XAF: 769.23, EUR: 1.18, USD: 1.27 }
  };

  const currencies = [
    { code: 'XAF', symbol: 'F.CFA', name: 'Franc CFA' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar US' },
    { code: 'GBP', symbol: '£', name: 'Livre Sterling' }
  ];

  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  const timezones = [
    { code: 'Africa/Douala', name: 'Douala (GMT+1)' },
    { code: 'Africa/Lagos', name: 'Lagos (GMT+1)' },
    { code: 'Europe/Paris', name: 'Paris (GMT+1)' },
    { code: 'America/New_York', name: 'New York (GMT-5)' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasChanges(false);
      // Ici vous pourriez appeler une API pour sauvegarder les paramètres
      console.log('Paramètres sauvegardés:', settings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    // Réinitialiser aux valeurs par défaut
    setSettings({
      companyName: 'MADON',
      companyEmail: 'contact@madon.com',
      companyPhone: '+237 6 12 34 56 78',
      companyAddress: 'Douala, Cameroun',
      language: 'fr',
      currency: 'XAF',
      timezone: 'Africa/Douala',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      employeesModule: true,
      tasksModule: true,
      documentsModule: true,
      financeModule: true,
      marketingModule: false,
      theme: 'light',
      sidebarCollapsed: false,
      compactMode: false
    });
    setHasChanges(true);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paramètres
        </h1>
        <p className="text-gray-600">
          Configurez votre application selon vos besoins
        </p>
      </div>

      {/* Actions globales */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
        {hasChanges && (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Modifications non sauvegardées
          </Badge>
        )}
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="language">Langue & Devise</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="appearance">Apparence</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nom de l'entreprise"
                    value={settings.companyName}
                    onChange={(e) => updateSetting('companyName', e.target.value)}
                    placeholder="Nom de votre entreprise"
                  />
                  <Input
                    label="Email de contact"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => updateSetting('companyEmail', e.target.value)}
                    placeholder="contact@entreprise.com"
                  />
                  <Input
                    label="Téléphone"
                    value={settings.companyPhone}
                    onChange={(e) => updateSetting('companyPhone', e.target.value)}
                    placeholder="+237 6 12 34 56 78"
                  />
                  <Input
                    label="Adresse"
                    value={settings.companyAddress}
                    onChange={(e) => updateSetting('companyAddress', e.target.value)}
                    placeholder="Ville, Pays"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="language">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Select
                    label="Langue"
                    value={settings.language}
                    onChange={(e) => updateSetting('language', e.target.value)}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </Select>
                  
                  <Select
                    label="Devise"
                    value={settings.currency}
                    onChange={(e) => updateSetting('currency', e.target.value)}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name}
                      </option>
                    ))}
                  </Select>
                  
                  <Select
                    label="Fuseau horaire"
                    value={settings.timezone}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                  >
                    {timezones.map((tz) => (
                      <option key={tz.code} value={tz.code}>
                        {tz.name}
                      </option>
                    ))}
                  </Select>
                </div>

                {/* Taux de change */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Taux de change actuels
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(exchangeRates[settings.currency as keyof typeof exchangeRates]).map(([currency, rate]) => (
                      <div key={currency} className="flex justify-between">
                        <span className="text-gray-600">1 {settings.currency} =</span>
                        <span className="font-medium">{rate} {currency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(checked) => updateSetting('emailNotifications', checked)}
                    label="Notifications par email"
                    description="Recevoir des notifications par email"
                  />
                  
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(checked) => updateSetting('pushNotifications', checked)}
                    label="Notifications push"
                    description="Recevoir des notifications push dans le navigateur"
                  />
                  
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={(checked) => updateSetting('smsNotifications', checked)}
                    label="Notifications SMS"
                    description="Recevoir des notifications par SMS"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(checked) => updateSetting('twoFactorAuth', checked)}
                    label="Authentification à deux facteurs"
                    description="Ajouter une couche de sécurité supplémentaire"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Délai d'expiration de session (minutes)
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 min</span>
                      <span className="font-medium">{settings.sessionTimeout} min</span>
                      <span>120 min</span>
                    </div>
                  </div>
                  
                  <Select
                    label="Politique de mot de passe"
                    value={settings.passwordPolicy}
                    onChange={(e) => updateSetting('passwordPolicy', e.target.value)}
                  >
                    <option value="weak">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="strong">Forte</option>
                    <option value="very-strong">Très forte</option>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="modules">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Switch
                    checked={settings.employeesModule}
                    onChange={(checked) => updateSetting('employeesModule', checked)}
                    label="Module Employés"
                    description="Gestion des employés et des ressources humaines"
                  />
                  
                  <Switch
                    checked={settings.tasksModule}
                    onChange={(checked) => updateSetting('tasksModule', checked)}
                    label="Module Tâches"
                    description="Gestion des tâches et projets"
                  />
                  
                  <Switch
                    checked={settings.documentsModule}
                    onChange={(checked) => updateSetting('documentsModule', checked)}
                    label="Module Documents"
                    description="Gestion des documents et fichiers"
                  />
                  
                  <Switch
                    checked={settings.financeModule}
                    onChange={(checked) => updateSetting('financeModule', checked)}
                    label="Module Finance"
                    description="Gestion financière et comptabilité"
                  />
                  
                  <Switch
                    checked={settings.marketingModule}
                    onChange={(checked) => updateSetting('marketingModule', checked)}
                    label="Module Marketing"
                    description="Outils de marketing et communication"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Select
                    label="Thème"
                    value={settings.theme}
                    onChange={(e) => updateSetting('theme', e.target.value)}
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </Select>
                  
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onChange={(checked) => updateSetting('sidebarCollapsed', checked)}
                    label="Sidebar réduite"
                    description="Réduire la largeur de la barre latérale"
                  />
                  
                  <Switch
                    checked={settings.compactMode}
                    onChange={(checked) => updateSetting('compactMode', checked)}
                    label="Mode compact"
                    description="Réduire l'espacement pour afficher plus de contenu"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}