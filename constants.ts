
import { Policy, PolicyStatus, DashboardKPIs, PostSalesAction, LeadBatch } from './types';

export const NEW_SALES_TEAM = ['Vinicius', 'Wagner', 'Renan', 'Sandra'];
export const RENEWAL_TEAM = ['Marcia', 'George', 'Fabiana', 'Renan'];

export const MOCK_POLICIES: Policy[] = [
  // --- NOVOS SEGUROS (Baseado na Imagem 7, 8, 9) ---
  {
    id: '1',
    insuredName: 'Lucas Ricarte de Oliveira',
    customerSource: 'Agendamentos',
    consultantName: 'Vinicius',
    policyNumber: '100.200.300',
    insurer: 'Azul',
    branch: 'Azul Por Assinatura',
    saleStructure: 'Online (pj1)',
    startDate: '2025-09-01',
    endDate: '2026-09-01',
    netPremium: 1200.00,
    commissionPercentage: 20,
    commissionValue: 240.00,
    producerCommission: 30.87,
    status: PolicyStatus.EMITIDA,
    type: 'Seguro Novo'
  },
  {
    id: '2',
    insuredName: 'Ellana Rodrigues de Amorim',
    customerSource: 'Agendamentos',
    consultantName: 'Vinicius',
    policyNumber: '100.200.301',
    insurer: 'Porto Seguro',
    branch: 'Automóvel Individual',
    saleStructure: 'Online (pj1)',
    startDate: '2025-09-02',
    endDate: '2026-09-02',
    netPremium: 2788.70,
    commissionPercentage: 20,
    commissionValue: 557.74,
    producerCommission: 71.74,
    status: PolicyStatus.EMITIDA,
    type: 'Seguro Novo'
  },
  {
    id: '3',
    insuredName: 'Zuleica Rodrigues Ferreira',
    customerSource: 'Agendamentos',
    consultantName: 'Renan',
    policyNumber: '100.200.302',
    insurer: 'Pier',
    branch: 'Automóvel Individual',
    saleStructure: 'Indicação',
    startDate: '2025-09-03',
    endDate: '2026-09-03',
    netPremium: 815.42,
    commissionPercentage: 25,
    commissionValue: 203.86,
    producerCommission: 26.22,
    status: PolicyStatus.EMITIDA,
    type: 'Seguro Novo'
  },
  {
    id: '4',
    insuredName: 'Rafaela Silva Bravim',
    customerSource: 'Agendamentos',
    consultantName: 'Wagner',
    policyNumber: '100.200.303',
    insurer: 'Azul',
    branch: 'Azul Por Assinatura',
    saleStructure: 'Online (pj1)',
    startDate: '2025-09-04',
    endDate: '2026-09-04',
    netPremium: 3800.00,
    commissionPercentage: 20,
    commissionValue: 760.00,
    producerCommission: 97.76,
    status: PolicyStatus.EMITIDA,
    type: 'Seguro Novo'
  },
  {
    id: '5',
    insuredName: 'Laysa de Castro Mendes',
    customerSource: 'Agendamentos',
    consultantName: 'Sandra',
    policyNumber: '100.200.304',
    insurer: 'Azul',
    branch: 'Azul Por Assinatura',
    saleStructure: 'Online (pj1)',
    startDate: '2025-09-04',
    endDate: '2026-09-04',
    netPremium: 4500.00,
    commissionPercentage: 20,
    commissionValue: 900.00,
    producerCommission: 115.76,
    status: PolicyStatus.EMITIDA,
    type: 'Seguro Novo'
  },

  // --- RENOVAÇÕES (Baseado na Imagem 4, 5, 6) ---
  {
    id: '101',
    insuredName: 'Rodrigo Baciga',
    customerSource: 'Renovação da Corretora',
    consultantName: 'George',
    policyNumber: '555.666.777',
    insurer: 'Tokio',
    branch: 'Automóvel Individual',
    saleStructure: 'Renovação',
    startDate: '2025-09-01',
    endDate: '2026-09-01',
    netPremium: 403.26,
    commissionPercentage: 25,
    commissionValue: 100.82,
    producerCommission: 8.64,
    status: PolicyStatus.RENOVADA,
    type: 'Renovação'
  },
  {
    id: '102',
    insuredName: 'Lindeoci Alves de Brito',
    customerSource: 'Renovação da Corretora',
    consultantName: 'Marcia',
    policyNumber: '555.666.778',
    insurer: 'Azul',
    branch: 'Automóvel Individual',
    saleStructure: 'Renovação',
    startDate: '2025-09-02',
    endDate: '2026-09-02',
    netPremium: 1800.34,
    commissionPercentage: 25,
    commissionValue: 450.09,
    producerCommission: 38.59,
    status: PolicyStatus.RENOVADA,
    type: 'Renovação'
  },
  {
    id: '103',
    insuredName: 'Fabio Bittencourt',
    customerSource: 'Renovação da Corretora',
    consultantName: 'Fabiana',
    policyNumber: '555.666.779',
    insurer: 'HDI',
    branch: 'Automóvel Individual',
    saleStructure: 'Renovação',
    startDate: '2025-09-02',
    endDate: '2026-09-02',
    netPremium: 1097.49,
    commissionPercentage: 23,
    commissionValue: 252.42,
    producerCommission: 21.65,
    status: PolicyStatus.PENDENTE,
    type: 'Renovação'
  },
  {
    id: '104',
    insuredName: 'Odilon Alberto Junqueira',
    customerSource: 'Renovação da Corretora',
    consultantName: 'Renan', // Renan também faz renovação
    policyNumber: '555.666.780',
    insurer: 'Azul',
    branch: 'Automóvel Individual',
    saleStructure: 'Renovação',
    startDate: '2025-09-02',
    endDate: '2026-09-02',
    netPremium: 1677.97,
    commissionPercentage: 20,
    commissionValue: 335.59,
    producerCommission: 28.78,
    status: PolicyStatus.PERDIDO,
    type: 'Renovação'
  }
];

export const DASHBOARD_MOCK_DATA: DashboardKPIs = {
  renewalsDelivered: 86,
  renewalsClosed: 70,
  renewalRate: 86,
  lostCount: 11,
  disqualifiedCount: 5,
  weightedAverage: 20.66,
  simpleAverage: 20.89,
  brokerCommission: 31758.19,
  monthlyData: [
    { name: 'Jan', value: 26429.08 },
    { name: 'Fev', value: 26264.45 },
    { name: 'Mar', value: 25980.35 },
    { name: 'Abr', value: 26160.82 },
    { name: 'Mai', value: 31758.19 },
    { name: 'Jun', value: 23065.67 },
    { name: 'Jul', value: 29023.00 },
    { name: 'Ago', value: 38872.34 },
    { name: 'Set', value: 23869.00 },
    { name: 'Out', value: 32941.28 },
  ]
};

export const POST_SALES_ACTIONS: PostSalesAction[] = [
  { id: '101', insuredName: 'Lucas Ricarte', policyNumber: '100.200.300', whatsappSentDate: '2025-10-25', messageStatus: 'Lido' },
  { id: '102', insuredName: 'Ellana Rodrigues', policyNumber: '100.200.301', whatsappSentDate: '2025-10-26', messageStatus: 'Respondido' },
];

export const MOCK_LEAD_BATCHES: LeadBatch[] = [
  { id: '1', fileName: 'leads_outubro_vinicius.xlsx', consultantName: 'Renan', type: 'Seguros Novos', managerName: 'Vinicius', uploadDate: '2025-10-01 09:30', status: 'Enviado', recordCount: 45 },
  { id: '2', fileName: 'renovacoes_novembro.csv', consultantName: 'Marcia', type: 'Renovação', managerName: 'George', uploadDate: '2025-10-02 14:15', status: 'Processando', recordCount: 120 },
];
