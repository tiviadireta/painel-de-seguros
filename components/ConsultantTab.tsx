
import React, { useState, useEffect } from 'react';
import { Save, User } from 'lucide-react';
import { Policy, PolicyStatus } from '../types';
import { MOCK_POLICIES } from '../constants';
import { useConfig } from '../contexts/ConfigContext';

export const ConsultantTab: React.FC = () => {
  const { config } = useConfig();
  
  // Mock data filtered for 'Renan' to simulate logged user view
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Policy>>({
    status: PolicyStatus.EMITIDA,
    consultantName: 'Renan', // Simulando usuário logado
    type: 'Seguro Novo',
    saleStructure: 'Online (pj1)'
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true);
      if (config.webhookConsultantList) {
        try {
           console.log(`[ConsultantTab] Buscando dados de: ${config.webhookConsultantList}`);
           const response = await fetch(config.webhookConsultantList);
           if (!response.ok) throw new Error('Erro na resposta da API');
           const data = await response.json();
           
           // Assume que a API retorna um array de Policy
           if (Array.isArray(data)) {
             setPolicies(data);
           } else {
             console.warn("Formato de resposta inválido, usando mocks.");
             setPolicies(MOCK_POLICIES.filter(p => p.consultantName === 'Renan'));
           }
        } catch (error) {
          console.error("Erro ao buscar apólices:", error);
          // Fallback silencioso para mocks em caso de erro (para não quebrar a demo)
          setPolicies(MOCK_POLICIES.filter(p => p.consultantName === 'Renan'));
        }
      } else {
        setPolicies(MOCK_POLICIES.filter(p => p.consultantName === 'Renan'));
      }
      setIsLoading(false);
    };

    fetchPolicies();
  }, [config.webhookConsultantList]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config.webhookConsultantSave) {
      try {
        console.log(`[ConsultantTab] Enviando dados para: ${config.webhookConsultantSave}`);
        
        const response = await fetch(config.webhookConsultantSave, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Sucesso! Dados enviados para o sistema.');
          // Opcional: Recarregar a lista ou limpar formulário
        } else {
          alert('Erro ao salvar. Verifique o console.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro de conexão com o Webhook.');
      }
    } else {
      alert("Dados salvos localmente (Simulação). Configure o Webhook para salvar.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-brand-100 rounded-full text-brand-700">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Minha Produção</h2>
            <p className="text-gray-500">Insira os dados conforme a planilha oficial.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="space-y-2 lg:col-span-2">
            <label className="text-sm font-medium text-gray-700">Nome do Segurado</label>
            <input
              type="text"
              name="insuredName"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="Nome completo"
              value={formData.insuredName || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Consultor (Automático)</label>
            <input
              type="text"
              name="consultantName"
              readOnly
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              value={formData.consultantName || ''}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tipo de Operação</label>
            <select
              name="type"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={formData.type || 'Seguro Novo'}
              onChange={handleInputChange}
            >
              <option value="Seguro Novo">Seguro Novo</option>
              <option value="Renovação">Renovação</option>
            </select>
          </div>

           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Número da Apólice</label>
            <input
              type="text"
              name="policyNumber"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="000.000.000"
              value={formData.policyNumber || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Seguradora</label>
            <select
              name="insurer"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={formData.insurer || ''}
              onChange={handleInputChange}
            >
                <option value="">Selecione...</option>
                <option value="Azul">Azul</option>
                <option value="Porto Seguro">Porto Seguro</option>
                <option value="Tokio">Tokio</option>
                <option value="HDI">HDI</option>
                <option value="Allianz">Allianz</option>
                <option value="Suhai">Suhai</option>
                <option value="Pier">Pier</option>
                <option value="Yelum">Yelum</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Modalidade</label>
            <input
              type="text"
              name="branch"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="Ex: Automóvel Individual"
              value={formData.branch || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Origem do Cliente</label>
            <select
              name="customerSource"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={formData.customerSource || ''}
              onChange={handleInputChange}
            >
                <option value="">Selecione...</option>
                <option value="Agendamentos">Agendamentos</option>
                <option value="Renovação da Corretora">Renovação da Corretora</option>
                <option value="Indicação">Indicação</option>
                <option value="Cliente Base">Cliente Base</option>
                <option value="Porto Campanha">Porto Campanha</option>
            </select>
          </div>

           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Estrutura de Vendas</label>
            <input
              type="text"
              name="saleStructure"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="Ex: Online (pj1)"
              value={formData.saleStructure || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Início de Vigência</label>
            <input
              type="date"
              name="startDate"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={formData.startDate || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fim de Vigência</label>
            <input
              type="date"
              name="endDate"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={formData.endDate || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Prêmio Líquido (R$)</label>
            <input
              type="number"
              name="netPremium"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="0.00"
              step="0.01"
              value={formData.netPremium || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Comissão (%)</label>
            <input
              type="number"
              name="commissionPercentage"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="Ex: 20"
              step="0.1"
              value={formData.commissionPercentage || ''}
              onChange={handleInputChange}
            />
          </div>
          
           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Valor Comissão (R$)</label>
            <input
              type="number"
              name="commissionValue"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="Calculado..."
              step="0.01"
              value={formData.commissionValue || ''}
              onChange={handleInputChange}
            />
          </div>

           <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Repasse Produtor (R$)</label>
            <input
              type="number"
              name="producerCommission"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              placeholder="0.00"
              step="0.01"
              value={formData.producerCommission || ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Situação</label>
            <select
              name="status"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              value={formData.status || PolicyStatus.EMITIDA}
              onChange={handleInputChange}
            >
              <option value={PolicyStatus.EMITIDA}>Emitida</option>
              <option value={PolicyStatus.PENDENTE}>Pendente</option>
              <option value={PolicyStatus.CANCELADA}>Cancelada</option>
              <option value={PolicyStatus.PERDIDO}>Perdido</option>
              <option value={PolicyStatus.RENOVADA}>Renovada</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-brand-200 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              <Save size={20} />
              {isLoading ? 'Enviando...' : (config.webhookConsultantSave ? 'Enviar para Webhook' : 'Salvar Registro')}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Meus Lançamentos Recentes</h3>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full uppercase tracking-wider">
            Renan
          </span>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Carregando dados...</div>
          ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold">
              <tr>
                <th className="p-4">Segurado</th>
                <th className="p-4">Seguradora</th>
                <th className="p-4">Estrutura</th>
                <th className="p-4">Modalidade</th>
                <th className="p-4 text-right">Prêmio Líq.</th>
                <th className="p-4 text-right">Comissão</th>
                <th className="p-4 text-right">Repasse</th>
                <th className="p-4">Situação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {policies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{policy.insuredName}</td>
                  <td className="p-4">{policy.insurer}</td>
                  <td className="p-4">{policy.saleStructure}</td>
                  <td className="p-4">{policy.branch}</td>
                  <td className="p-4 text-right">R$ {policy.netPremium?.toFixed(2)}</td>
                  <td className="p-4 text-right text-brand-600 font-semibold">R$ {policy.commissionValue?.toFixed(2)}</td>
                  <td className="p-4 text-right">R$ {policy.producerCommission?.toFixed(2) || '0.00'}</td>
                   <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      policy.status === PolicyStatus.EMITIDA || policy.status === PolicyStatus.RENOVADA ? 'bg-green-100 text-green-700' :
                      policy.status === PolicyStatus.PERDIDO ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                </tr>
              ))}
              {policies.length === 0 && (
                <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};
