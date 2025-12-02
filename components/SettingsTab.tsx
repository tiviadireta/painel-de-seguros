"use client";

import React, { useState, useEffect } from 'react';
import { Save, Settings, Link as LinkIcon, UploadCloud, RotateCcw } from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { AppConfig } from '@/lib/types';

export const SettingsTab: React.FC = () => {
  const { config, updateConfig, resetToEnv } = useConfig();
  const [formData, setFormData] = useState<AppConfig>(config);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Deseja restaurar as configurações para os valores das Variáveis de Ambiente originais? Isso apagará suas edições manuais.')) {
        resetToEnv();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const EnvBadge = ({ name }: { name: string }) => (
    <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono border border-gray-200">
      ENV: {name}
    </span>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full text-gray-700">
                <Settings size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Configuração de Integrações</h2>
                <p className="text-gray-500">Defina os Webhooks manualmente ou via Variáveis de Ambiente.</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
            title="Restaurar para Variáveis de Ambiente"
          >
            <RotateCcw size={14} /> Restaurar Padrões
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 mb-6">
            <strong>Dica:</strong> Você pode preencher esses campos automaticamente definindo as variáveis de ambiente indicadas ao lado de cada campo no seu painel de hospedagem.
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LinkIcon size={18} /> Aba Consultores
            </h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Webhook Salvar Apólice (POST) <EnvBadge name="WEBHOOK_SAVE_POLICY" />
              </label>
              <input
                type="text"
                name="webhookConsultantSave"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-xs"
                placeholder="https://seu-webhook.com/salvar-apolice"
                value={formData.webhookConsultantSave}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Webhook Listar Apólices (GET) <EnvBadge name="WEBHOOK_LIST_POLICIES" />
              </label>
              <input
                type="text"
                name="webhookConsultantList"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-xs"
                placeholder="https://seu-webhook.com/listar-apolices?consultor=Renan"
                value={formData.webhookConsultantList}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <LinkIcon size={18} /> Aba Gestão (Vinícius/George)
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Webhook KPIs e Gráficos (GET) <EnvBadge name="WEBHOOK_MANAGER_KPI" />
              </label>
              <input
                type="text"
                name="webhookManagerKPI"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-xs"
                placeholder="https://seu-webhook.com/dados-gerenciais"
                value={formData.webhookManagerKPI}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UploadCloud size={18} /> Distribuição de Leads
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Webhook Envio de Planilhas (POST) <EnvBadge name="WEBHOOK_LEAD_DISTRIBUTION" />
              </label>
              <input
                type="text"
                name="webhookLeadDistribution"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-xs"
                placeholder="https://seu-webhook.com/enviar-leads"
                value={formData.webhookLeadDistribution}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               <LinkIcon size={18} /> Aba Novos Seguros e Renovações
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                 Webhook Listar Novos Seguros (GET) <EnvBadge name="WEBHOOK_NEW_SALES" />
              </label>
              <input
                type="text"
                name="webhookNewSales"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-xs"
                placeholder="https://seu-webhook.com/novos-seguros"
                value={formData.webhookNewSales}
                onChange={handleInputChange}
              />
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Webhook Listar Renovações (GET) <EnvBadge name="WEBHOOK_RENEWALS" />
              </label>
              <input
                type="text"
                name="webhookRenewals"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none font-mono text-xs"
                placeholder="https://seu-webhook.com/renovacoes"
                value={formData.webhookRenewals}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            {showSuccess && <span className="text-green-600 font-medium animate-fade-in">Configurações salvas com sucesso!</span>}
            {!showSuccess && <span></span>}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition-colors shadow-lg"
            >
              <Save size={20} />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};