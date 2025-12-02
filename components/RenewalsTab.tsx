"use client";

import React, { useState, useEffect } from 'react';
import { MOCK_POLICIES, RENEWAL_TEAM } from '@/lib/constants';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PolicyStatus, Policy } from '@/lib/types';
import { useConfig } from '@/contexts/ConfigContext';

export const RenewalsTab: React.FC = () => {
  const { config } = useConfig();
  // Mock inicial
  const [renewals, setRenewals] = useState<Policy[]>(
    MOCK_POLICIES.filter(p => p.type === 'Renovação' && RENEWAL_TEAM.includes(p.consultantName))
  );
  const [selectedConsultant, setSelectedConsultant] = useState<string>('Todos');

  useEffect(() => {
    const fetchRenewals = async () => {
        if (config.webhookRenewals) {
           try {
               console.log(`[RenewalsTab] Buscando dados em: ${config.webhookRenewals}`);
               const response = await fetch(config.webhookRenewals);
               if (response.ok) {
                   const data = await response.json();
                   if (Array.isArray(data)) {
                       setRenewals(data);
                   }
               }
           } catch (error) {
               console.error("Erro ao buscar renovações:", error);
           }
        }
    };
    fetchRenewals();
  }, [config.webhookRenewals]);

  const filteredRenewals = selectedConsultant === 'Todos' 
    ? renewals 
    : renewals.filter(p => p.consultantName === selectedConsultant);

  // KPIs simples baseados na lista filtrada
  const stats = {
      total: filteredRenewals.length,
      renewed: filteredRenewals.filter(r => r.status === PolicyStatus.RENOVADA).length,
      lost: filteredRenewals.filter(r => r.status === PolicyStatus.PERDIDO || r.status === PolicyStatus.DESQUALIFICADO).length,
      pending: filteredRenewals.filter(r => r.status === PolicyStatus.PENDENTE).length
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Renovações</h2>
            <p className="text-gray-500">Equipe: Márcia, George, Fabiana e Renan.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto max-w-full">
           <button 
             onClick={() => setSelectedConsultant('Todos')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${selectedConsultant === 'Todos' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Todos
           </button>
           {RENEWAL_TEAM.map(name => (
             <button 
               key={name}
               onClick={() => setSelectedConsultant(name)}
               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${selectedConsultant === name ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
             >
               {name}
             </button>
           ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-gray-500 text-sm block mb-1">Total Lista</span>
              <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
              <span className="text-green-600 text-sm block mb-1">Renovados</span>
              <span className="text-2xl font-bold text-green-700">{stats.renewed}</span>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 shadow-sm">
              <span className="text-yellow-600 text-sm block mb-1">Pendentes</span>
              <span className="text-2xl font-bold text-yellow-700">{stats.pending}</span>
          </div>
           <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
              <span className="text-red-600 text-sm block mb-1">Perdidos/Desq.</span>
              <span className="text-2xl font-bold text-red-700">{stats.lost}</span>
          </div>
      </div>

      {/* Renewals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <RefreshCw size={20} className="text-brand-600"/>
            <h3 className="text-lg font-bold text-gray-900">Controle de Renovações (Espelho Planilha)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-900 font-semibold">
              <tr>
                <th className="p-4">Segurado</th>
                <th className="p-4">Início Vigência</th>
                <th className="p-4 text-right">Prêmio Líq.</th>
                <th className="p-4 text-right">Comissão</th>
                <th className="p-4">Produtor</th>
                <th className="p-4">Estrutura</th>
                <th className="p-4">Seguradora</th>
                <th className="p-4">Modalidade</th>
                <th className="p-4 text-right">Repasse</th>
                <th className="p-4">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRenewals.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{policy.insuredName}</td>
                  <td className="p-4 text-red-600 font-medium">{policy.startDate ? new Date(policy.startDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 text-right">R$ {policy.netPremium?.toFixed(2)}</td>
                  <td className="p-4 text-right font-semibold text-green-600">R$ {policy.commissionValue?.toFixed(2)}</td>
                  <td className="p-4 font-medium text-brand-600">{policy.consultantName}</td>
                  <td className="p-4 text-xs">{policy.saleStructure}</td>
                  <td className="p-4">{policy.insurer}</td>
                  <td className="p-4 text-xs">{policy.branch}</td>
                  <td className="p-4 text-right text-gray-500">R$ {policy.producerCommission?.toFixed(2) || '-'}</td>
                  <td className="p-4">
                     <div className="flex items-center gap-2">
                        {policy.status === PolicyStatus.RENOVADA && <CheckCircle size={16} className="text-green-600" />}
                        {policy.status === PolicyStatus.PERDIDO && <XCircle size={16} className="text-red-600" />}
                        {policy.status === PolicyStatus.PENDENTE && <AlertCircle size={16} className="text-yellow-600" />}
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            policy.status === PolicyStatus.RENOVADA ? 'bg-green-100 text-green-700' :
                            policy.status === PolicyStatus.PENDENTE ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                        }`}>
                            {policy.status}
                        </span>
                     </div>
                  </td>
                </tr>
              ))}
               {filteredRenewals.length === 0 && (
                  <tr>
                      <td colSpan={10} className="p-8 text-center text-gray-400">Nenhuma renovação encontrada para este filtro.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};