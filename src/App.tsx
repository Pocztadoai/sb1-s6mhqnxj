import React, { useState, useEffect } from 'react';
import { Contact, EmailTemplate, Campaign, AppState } from './types';
import { StorageManager } from './utils/storage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ContactsList from './components/ContactsList';
import Settings from './components/Settings';
import Login from './components/Login';

function AppContent() {
  const { currentUser } = useAuth();
  const [appState, setAppState] = useState<AppState>({
    currentTab: 'dashboard',
    contacts: [],
    templates: [],
    campaigns: []
  });

  // Load data from localStorage on mount
  useEffect(() => {
    if (currentUser) {
      const contacts = StorageManager.loadContacts();
      const templates = StorageManager.loadTemplates();
      const campaigns = StorageManager.loadCampaigns();
      
      setAppState(prev => ({
        ...prev,
        contacts,
        templates,
        campaigns
      }));
    }
  }, [currentUser]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      StorageManager.saveContacts(appState.contacts);
    }
  }, [appState.contacts, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageManager.saveTemplates(appState.templates);
    }
  }, [appState.templates, currentUser]);

  useEffect(() => {
    if (currentUser) {
      StorageManager.saveCampaigns(appState.campaigns);
    }
  }, [appState.campaigns, currentUser]);

  const handleTabChange = (tab: string) => {
    setAppState(prev => ({ ...prev, currentTab: tab as any }));
  };

  const handleAddContacts = (newContacts: Contact[]) => {
    setAppState(prev => ({
      ...prev,
      contacts: [...prev.contacts, ...newContacts]
    }));
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setAppState(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
    }));
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm('Czy na pewno chcesz usunąć ten kontakt?')) {
      setAppState(prev => ({
        ...prev,
        contacts: prev.contacts.filter(contact => contact.id !== contactId)
      }));
    }
  };

  if (!currentUser) {
    return <Login />;
  }

  const renderCurrentTab = () => {
    switch (appState.currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            contacts={appState.contacts}
            campaigns={appState.campaigns}
          />
        );
      case 'contacts':
        return (
          <ContactsList
            contacts={appState.contacts}
            onAddContacts={handleAddContacts}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
          />
        );
      case 'campaigns':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kampanie</h2>
            <p className="text-gray-600">Zarządzanie kampaniami wkrótce...</p>
          </div>
        );
      case 'templates':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Szablony</h2>
            <p className="text-gray-600">Zarządzanie szablonami wkrótce...</p>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentTab={appState.currentTab}
        onTabChange={handleTabChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentTab()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;