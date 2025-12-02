export enum PolicyStatus {
  EMITIDA = 'Emitida',
  CANCELADA = 'Cancelada',
  PENDENTE = 'Pendente',
  RENOVADA = 'Renovada',
  PERDIDO = 'Perdido',
  DESQUALIFICADO = 'Desqualificado'
}

export interface Policy {
  id: string;
  insuredName: string; // Segurado
  customerSource: string; // Origem do Cliente
  consultantName: string; // Produtor
  policyNumber: string;
  insurer: string; // Seguradora (Azul, Porto, etc.)
  branch: string; // Ramo/Modalidade (Automóvel Individual, etc.)
  saleStructure: string; // Estrutura de Vendas (Online, Renovação, etc.)
  
  startDate: string; // Início de Vigência
  endDate: string; // Fim de Vigência (ou Vencimento)
  
  netPremium: number; // Prêmio Líquido
  commissionPercentage: number; // Comissão (%)
  commissionValue: number; // Valor de Comissão
  producerCommission: number; // Repasse Produtor (R$)
  
  status: PolicyStatus; // Situação
  type: 'Seguro Novo' | 'Renovação'; // Tipo da operação
  
  notes?: string;
}

export interface DashboardKPIs {
  renewalsDelivered: number; // Entregues
  renewalsClosed: number;    // Renovados
  renewalRate: number;       // Renovação %
  lostCount: number;         // Perdidos
  disqualifiedCount: number; // Desqualificados
  weightedAverage: number;   // Média Ponderada
  simpleAverage: number;     // Média
  brokerCommission: number;  // Comissão da Corretora
  monthlyData: { name: string; value: number }[]; // Para o gráfico
}

export interface PostSalesAction {
  id: string;
  insuredName: string;
  policyNumber: string;
  whatsappSentDate: string;
  messageStatus: 'Enviado' | 'Lido' | 'Respondido' | 'Pendente';
}

export interface LeadBatch {
  id: string;
  fileName: string;
  consultantName: string;
  type: 'Seguros Novos' | 'Renovação';
  managerName: string; // Vinicius ou George
  uploadDate: string;
  status: 'Enviado' | 'Processando' | 'Erro';
  recordCount: number;
}

// Nova interface para armazenar as URLs dos Webhooks
export interface AppConfig {
  webhookConsultantSave: string;   // Para salvar/atualizar apólice (POST)
  webhookConsultantList: string;   // Para listar apólices do consultor (GET)
  webhookManagerKPI: string;       // Para buscar KPIs do gestor (GET)
  webhookNewSales: string;         // Para buscar novos seguros e pós-venda (GET)
  webhookRenewals: string;         // Para buscar renovações (GET)
  webhookLeadDistribution: string; // Para enviar planilha de leads (POST)
}