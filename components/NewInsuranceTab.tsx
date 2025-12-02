
import React, { useState, useEffect } from 'react';
import { MOCK_POLICIES, POST_SALES_ACTIONS, NEW_SALES_TEAM } from '../constants';
import { Shield, MessageCircle, Filter } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { PolicyStatus, Policy } from '../types';

export const NewInsuranceTab: React.FC = () => {
  const { config } = useConfig();
  // Inicialmente Mock, depois pode ser substituído
  const [policies, setPolicies] = useState<Policy[]>(
    MOCK_POLICIES.filter(p => p.type === 'Seguro Novo' && NEW_SALES_TEAM.includes(p.consultantName))
  );
  const [postSales, setPostSales] = useState(POST_SALES_ACTIONS);
  const [selectedConsultant, setSelectedConsultant] = useState<string>('Todos');

  // ==================================================================================
  // INTEGRAÇÃO: Buscando novos seguros via Webhook configurável
  // ==================================================================================
  useEffect(() => {
    const fetchNewSales = async () => {
        if (config.webhookNewSales) {
            try {
                console.log(`[NewInsuranceTab] Buscando dados em: ${config.webhookNewSales}`);
                const response = await fetch(config.webhookNewSales);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setPolicies(data);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar novos seguros:", error);
            }
        }
    };
    fetchNewSales();
  }, [config.webhookNewSales]);

  const filteredPolicies = selectedConsultant === 'Todos' 
    ? policies 
    : policies.filter(p => p.consultantName === selectedConsultant);

  const totalCommission = filteredPolicies.reduce((acc, curr) => acc + (curr.commissionValue || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seguros Novos</h2>
          <p className="text-gray-500">Gestão de produção nova: Vinícius, Wagner, Renan e Sandra.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
           <button 
             onClick={() => setSelectedConsultant('Todos')}
             className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedConsultant === 'Todos' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             Todos
           </button>
           {NEW_SALES_TEAM.map(name => (
             <button 
               key={name}
               onClick={() => setSelectedConsultant(name)}
               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${selectedConsultant === name ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
             >
               {name}
             </button>
           ))}
        </div>
      </div>

      {/* Summary Row */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl shadow-md p-6 text-white flex justify-between items-center">
          <div>
              <p className="text-brand-100 text-sm font-medium mb-1">Total Comissão (Filtrado)</p>
              <h3 className="text-3xl font-bold">R$ {totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="text-right">
              <p className="text-brand-100 text-sm font-medium mb-1">Quantidade</p>
              <h3 className="text-3xl font-bold">{filteredPolicies.length}</h3>
          </div>
      </div>

      {/* New Policies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                <Shield size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Relatório de Produção (Espelho Planilha)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-900 font-semibold">
              <tr>
                <th className="p-4">Segurado</th>
                <th className="p-4">Origem</th>
                <th className="p-4">Início Vigência</th>
                <th className="p-4 text-right">Prêmio Líq.</th>
                <th className="p-4 text-center">% Com.</th>
                <th className="p-4 text-right">Valor Com.</th>
                <th className="p-4">Produtor</th>
                <th className="p-4">Estrutura</th>
                <th className="p-4">Seguradora</th>
                <th className="p-4">Modalidade</th>
                <th className="p-4 text-right">Repasse</th>
                <th className="p-4">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{policy.insuredName}</td>
                  <td className="p-4 text-xs">{policy.customerSource}</td>
                  <td className="p-4">{policy.startDate ? new Date(policy.startDate).toLocaleDateString('pt-BR') : '-'}</td>
                  <td className="p-4 text-right">R$ {policy.netPremium?.toFixed(2)}</td>
                  <td className="p-4 text-center">{policy.commissionPercentage}%</td>
                  <td className="p-4 text-right font-bold text-green-700">R$ {policy.commissionValue?.toFixed(2)}</td>
                  <td className="p-4 font-medium text-brand-700">{policy.consultantName}</td>
                  <td className="p-4 text-xs">{policy.saleStructure}</td>
                  <td className="p-4">{policy.insurer}</td>
                  <td className="p-4 text-xs">{policy.branch}</td>
                  <td className="p-4 text-right text-gray-500">R$ {policy.producerCommission?.toFixed(2) || '-'}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.status === PolicyStatus.EMITIDA ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {policy.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredPolicies.length === 0 && (
                  <tr>
                      <td colSpan={12} className="p-8 text-center text-gray-400">Nenhum registro encontrado para este filtro.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Sales Section */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Pós-Venda (Automação)</h3>
                        <p className="text-sm text-gray-500">Status de envio WhatsApp.</p>
                    </div>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-white text-gray-900 font-semibold border-b border-gray-200">
                    <tr>
                        <th className="p-4">Segurado</th>
                        <th className="p-4">Apólice</th>
                        <th className="p-4">Data Envio</th>
                        <th className="p-4">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {postSales.map(action => (
                             <tr key={action.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-900">{action.insuredName}</td>
                                <td className="p-4">{action.policyNumber}</td>
                                <td className="p-4">{new Date(action.whatsappSentDate).toLocaleDateString('pt-BR')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        action.messageStatus === 'Respondido' ? 'bg-green-100 text-green-700' :
                                        action.messageStatus === 'Lido' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                        {action.messageStatus}
                                    </span>
                                </td>
                             </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
      </div>
    </div>
  );
};
