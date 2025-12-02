
import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle, UserCheck, Briefcase } from 'lucide-react';
import { NEW_SALES_TEAM, RENEWAL_TEAM, MOCK_LEAD_BATCHES } from '../constants';
import { useConfig } from '../contexts/ConfigContext';
import { LeadBatch } from '../types';

export const LeadDistributionTab: React.FC = () => {
  const { config } = useConfig();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [leadType, setLeadType] = useState<'Seguros Novos' | 'Renovação'>('Seguros Novos');
  const [selectedConsultant, setSelectedConsultant] = useState<string>('');
  const [batches, setBatches] = useState<LeadBatch[]>(MOCK_LEAD_BATCHES);
  const [isUploading, setIsUploading] = useState(false);

  // Determina qual time mostrar baseado no tipo de lead selecionado
  const availableConsultants = leadType === 'Seguros Novos' ? NEW_SALES_TEAM : RENEWAL_TEAM;
  const currentManager = leadType === 'Seguros Novos' ? 'Vinicius' : 'George';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !selectedConsultant) {
      alert("Por favor, selecione um arquivo e um consultor.");
      return;
    }

    setIsUploading(true);

    const newBatch: LeadBatch = {
      id: Math.random().toString(36).substr(2, 9),
      fileName: selectedFile.name,
      consultantName: selectedConsultant,
      type: leadType,
      managerName: currentManager,
      uploadDate: new Date().toLocaleString('pt-BR'),
      status: 'Enviado',
      recordCount: 0 // Será atualizado se a API retornar
    };

    if (config.webhookLeadDistribution) {
      try {
        console.log(`[LeadDistribution] Enviando arquivo para: ${config.webhookLeadDistribution}`);
        
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('consultant', selectedConsultant);
        formData.append('manager', currentManager);
        formData.append('leadType', leadType);

        const response = await fetch(config.webhookLeadDistribution, { 
            method: 'POST', 
            body: formData 
        });

        if (response.ok) {
            newBatch.status = 'Enviado';
            // Se a API retornar JSON, podemos usar
            // const data = await response.json(); 
            // newBatch.recordCount = data.count;
            setBatches([newBatch, ...batches]);
            alert(`Arquivo enviado com sucesso!\nGestor: ${currentManager}\nConsultor: ${selectedConsultant}`);
        } else {
            throw new Error('Erro no envio');
        }

      } catch (error) {
        console.error(error);
        alert("Erro ao enviar arquivo para o Webhook.");
      }
    } else {
      // Fallback Simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      newBatch.recordCount = 20; // Mock count
      setBatches([newBatch, ...batches]);
      alert(`Simulação: Arquivo registrado localmente.\n(Configure o Webhook na aba Configurações)`);
    }

    setIsUploading(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Distribuição de Leads</h2>
          <p className="text-gray-500">Envie planilhas de leads diretamente para a fila dos consultores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário de Envio */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UploadCloud size={20} className="text-brand-600" />
              Novo Envio
            </h3>

            <form onSubmit={handleUpload} className="space-y-5">
              
              {/* Seleção do Tipo de Lead */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Tipo de Lead (Gestão)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setLeadType('Seguros Novos'); setSelectedConsultant(''); }}
                    className={`p-3 text-sm rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      leadType === 'Seguros Novos' 
                      ? 'bg-brand-50 border-brand-500 text-brand-700 font-semibold' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Briefcase size={18} />
                    Seguros Novos
                    <span className="text-xs font-normal opacity-75">(Vinícius)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLeadType('Renovação'); setSelectedConsultant(''); }}
                    className={`p-3 text-sm rounded-lg border transition-all flex flex-col items-center gap-2 ${
                      leadType === 'Renovação' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UserCheck size={18} />
                    Renovação
                    <span className="text-xs font-normal opacity-75">(George)</span>
                  </button>
                </div>
              </div>

              {/* Seleção do Consultor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Selecionar Consultor</label>
                <select
                  value={selectedConsultant}
                  onChange={(e) => setSelectedConsultant(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Selecione o consultor...</option>
                  {availableConsultants.map((consultant) => (
                    <option key={consultant} value={consultant}>{consultant}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">
                  Exibindo equipe de {leadType === 'Seguros Novos' ? 'Novos Negócios' : 'Renovação'}.
                </p>
              </div>

              {/* Upload de Arquivo */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Arquivo (.csv, .xlsx)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    accept=".csv, .xlsx, .xls"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileSpreadsheet className="text-gray-400 mb-2" size={32} />
                  {selectedFile ? (
                    <span className="text-sm font-medium text-brand-600 truncate max-w-full px-2">
                      {selectedFile.name}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">Clique para selecionar ou arraste</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transition-all ${
                  isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isUploading ? 'Enviando...' : 'Enviar Planilha'}
              </button>
            </form>
          </div>
        </div>

        {/* Histórico */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
               <h3 className="text-lg font-semibold text-gray-900">Histórico de Distribuição</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-semibold">
                  <tr>
                    <th className="p-4">Arquivo</th>
                    <th className="p-4">Consultor</th>
                    <th className="p-4">Tipo / Gestor</th>
                    <th className="p-4">Data Envio</th>
                    <th className="p-4 text-center">Registros</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900 flex items-center gap-2">
                        <FileSpreadsheet size={16} className="text-green-600" />
                        {batch.fileName}
                      </td>
                      <td className="p-4">{batch.consultantName}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{batch.type}</span>
                          <span className="text-xs text-gray-400">Gestão: {batch.managerName}</span>
                        </div>
                      </td>
                      <td className="p-4">{batch.uploadDate}</td>
                      <td className="p-4 text-center">{batch.recordCount}</td>
                      <td className="p-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                            batch.status === 'Enviado' ? 'bg-green-100 text-green-700' :
                            batch.status === 'Processando' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {batch.status === 'Enviado' && <CheckCircle size={12} />}
                            {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {batches.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400">Nenhum envio recente.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
