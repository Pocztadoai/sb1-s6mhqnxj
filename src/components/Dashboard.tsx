import React from 'react';
import { 
  Users, 
  Mail, 
  Send, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  PauseCircle
} from 'lucide-react';
import { Campaign, Contact } from '../types';

interface DashboardProps {
  contacts: Contact[];
  campaigns: Campaign[];
}

const Dashboard: React.FC<DashboardProps> = ({ contacts, campaigns }) => {
  const activeCampaigns = campaigns.filter(c => c.status === 'sending').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  const totalEmailsSent = campaigns.reduce((sum, c) => sum + c.stats.emailsSent, 0);
  
  const stats = [
    {
      label: 'Łączna liczba kontaktów',
      value: contacts.length,
      icon: Users,
      color: 'blue',
      change: '+12% od ostatniego miesiąca'
    },
    {
      label: 'Aktywne kampanie',
      value: activeCampaigns,
      icon: Send,
      color: 'emerald',
      change: `${activeCampaigns} obecnie uruchomionych`
    },
    {
      label: 'Wysłane e-maile',
      value: totalEmailsSent,
      icon: Mail,
      color: 'purple',
      change: '+5.4% wskaźnik sukcesu'
    },
    {
      label: 'Zakończone kampanie',
      value: completedCampaigns,
      icon: CheckCircle,
      color: 'indigo',
      change: `${completedCampaigns} w tym miesiącu`
    }
  ];

  const recentCampaigns = campaigns
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-yellow-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'sending':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'sending':
        return 'wysyłanie';
      case 'completed':
        return 'zakończona';
      case 'paused':
        return 'wstrzymana';
      case 'scheduled':
        return 'zaplanowana';
      case 'draft':
        return 'szkic';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel główny</h1>
        <p className="text-gray-600">Przegląd kampanii email marketingowych</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ostatnie kampanie</h2>
            <p className="text-sm text-gray-600">Najnowsze kampanie e-mailowe i ich status</p>
          </div>
          <div className="p-6">
            {recentCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Brak kampanii</p>
                <p className="text-sm text-gray-400">Utwórz pierwszą kampanię, aby rozpocząć</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(campaign.status)}
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-600">
                          {campaign.stats.emailsSent} / {campaign.stats.totalContacts} wysłanych
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Szybkie akcje</h2>
            <p className="text-sm text-gray-600">Najczęściej używane funkcje</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all group">
                <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors">
                  <Send className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Utwórz kampanię</p>
                  <p className="text-sm text-gray-600">Rozpocznij nową kampanię e-mailową</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200 hover:from-emerald-100 hover:to-green-100 transition-all group">
                <div className="p-2 bg-emerald-600 rounded-lg group-hover:bg-emerald-700 transition-colors">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Importuj kontakty</p>
                  <p className="text-sm text-gray-600">Wczytaj kontakty z pliku CSV</p>
                </div>
              </button>
              
              <button className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-pink-100 transition-all group">
                <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-700 transition-colors">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Utwórz szablon</p>
                  <p className="text-sm text-gray-600">Zaprojektuj nowy szablon e-maila</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;