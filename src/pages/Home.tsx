import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, Users, FileText, Calendar, Settings } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MADON Management Suite
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Solution complète de gestion d'entreprise pour optimiser vos processus, 
            gérer vos équipes et suivre vos performances.
          </p>
          <Button size="lg" className="text-lg px-8 py-4">
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Gestion des Employés</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gérez efficacement vos équipes, profils, et informations personnelles.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Gestion des Projets</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Suivez vos projets, tâches et collaborateurs en temps réel.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Gestion des Absences</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gérez les demandes de congés et le planning de vos équipes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Personnalisez votre environnement de travail selon vos besoins.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Fonctionnalités Principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">📊 Tableau de Bord</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Vue d'ensemble des métriques clés</li>
                <li>• Graphiques et statistiques en temps réel</li>
                <li>• Notifications et alertes</li>
                <li>• Accès rapide aux fonctionnalités</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">👥 Gestion d'Équipe</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Profils employés complets</li>
                <li>• Gestion des rôles et permissions</li>
                <li>• Suivi des performances</li>
                <li>• Communication intégrée</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">📋 Gestion de Projets</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Planification et suivi des tâches</li>
                <li>• Collaboration en équipe</li>
                <li>• Gestion des documents</li>
                <li>• Rapports de progression</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">📅 Gestion des Absences</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Demandes de congés</li>
                <li>• Planning et calendrier</li>
                <li>• Approbations et notifications</li>
                <li>• Historique des absences</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
