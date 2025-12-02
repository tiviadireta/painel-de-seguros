
import React, { useState } from 'react';
import { LayoutDashboard, Users, FileText, RefreshCw, ShieldCheck, Settings, UploadCloud } from 'lucide-react';
import { ConsultantTab } from './components/ConsultantTab';
import { ManagerTab } from './components/ManagerTab';
import { NewInsuranceTab } from './components/NewInsuranceTab';
import { RenewalsTab } from './components/RenewalsTab';
import { SettingsTab } from './components/SettingsTab';
import { LeadDistributionTab } from './components/LeadDistributionTab';
import { ConfigProvider } from './contexts/ConfigContext';

enum Tab {
  CONSULTORES = 'Consultores',
  GESTAO_VINICIUS = 'Dashboard Vinícius',
  NOVOS_SEGUROS = 'Novos Seguros',
  RENOVACOES = 'Renovações',
  DISTRIBUICAO_LEADS = 'Distribuição Leads',
  CONFIGURACOES = 'Configurações'
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONSULTORES);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.CONSULTORES:
        return <ConsultantTab />;
      case Tab.GESTAO_VINICIUS:
        return <ManagerTab />;
      case Tab.NOVOS_SEGUROS:
        return <NewInsuranceTab />;
      case Tab.RENOVACOES:
        return <RenewalsTab />;
      case Tab.DISTRIBUICAO_LEADS:
        return <LeadDistributionTab />;
      case Tab.CONFIGURACOES:
        return <SettingsTab />;
      default:
        return <ConsultantTab />;
    }
  };

  return (
    <ConfigProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-brand-600 p-2 rounded-lg">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <div className="leading-none">
                  <h1 className="text-xl font-bold text-gray-900">Painel de Seguros</h1>
                  <span className="text-xs text-brand-600 font-medium uppercase tracking-wide">Via Direta Corretora</span>
                </div>
              </div>
              {/* Optional: User Avatar or Profile placeholder */}
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-sm text-gray-500">Usuário: <strong className="text-gray-900">Renan</strong></span>
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">R</div>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
            <div className="flex space-x-6 h-12 items-center">
              <button
                onClick={() => setActiveTab(Tab.CONSULTORES)}
                className={`flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === Tab.CONSULTORES
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users size={18} />
                Consultores
              </button>
              <button
                onClick={() => setActiveTab(Tab.GESTAO_VINICIUS)}
                className={`flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === Tab.GESTAO_VINICIUS
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard size={18} />
                Dashboard Vinícius
              </button>
              <button
                onClick={() => setActiveTab(Tab.NOVOS_SEGUROS)}
                className={`flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === Tab.NOVOS_SEGUROS
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText size={18} />
                Novos Seguros
              </button>
              <button
                onClick={() => setActiveTab(Tab.RENOVACOES)}
                className={`flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === Tab.RENOVACOES
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <RefreshCw size={18} />
                Renovações
              </button>
              <button
                onClick={() => setActiveTab(Tab.DISTRIBUICAO_LEADS)}
                className={`flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === Tab.DISTRIBUICAO_LEADS
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UploadCloud size={18} />
                Distribuição Leads
              </button>
              <div className="flex-grow"></div>
              <button
                onClick={() => setActiveTab(Tab.CONFIGURACOES)}
                className={`flex items-center gap-2 px-1 h-full border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === Tab.CONFIGURACOES
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings size={18} />
                Configurações
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </ConfigProvider>
  );
}

export default App;
