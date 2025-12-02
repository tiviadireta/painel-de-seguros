import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppConfig } from '../types';

const CONFIG_STORAGE_KEY = 'via_direta_config';

// Helper seguro para acessar variáveis de ambiente
// Isso previne o erro "process is not defined" caso o ambiente não injete o objeto globalmente
const getEnv = (key: string): string => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key] || '';
    }
    // Fallback para verificar se existe em import.meta.env (Vite/Modern Bundlers)
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key] || '';
    }
  } catch (error) {
    console.warn(`Erro ao ler variável de ambiente ${key}:`, error);
  }
  return '';
};

// Configuração padrão lendo das Variáveis de Ambiente de forma segura
const getEnvConfig = (): AppConfig => ({
  webhookConsultantSave: getEnv('WEBHOOK_SAVE_POLICY'),
  webhookConsultantList: getEnv('WEBHOOK_LIST_POLICIES'),
  webhookManagerKPI: getEnv('WEBHOOK_MANAGER_KPI'),
  webhookNewSales: getEnv('WEBHOOK_NEW_SALES'),
  webhookRenewals: getEnv('WEBHOOK_RENEWALS'),
  webhookLeadDistribution: getEnv('WEBHOOK_LEAD_DISTRIBUTION')
});

interface ConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: AppConfig) => void;
  resetToEnv: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializa o estado mesclando Variáveis de Ambiente com LocalStorage
  const [config, setConfig] = useState<AppConfig>(() => {
    const envConfig = getEnvConfig();
    const savedConfigString = localStorage.getItem(CONFIG_STORAGE_KEY);
    
    if (savedConfigString) {
      try {
        const savedConfig = JSON.parse(savedConfigString);
        // Garante que campos vazios do localStorage possam ser preenchidos pelo env se disponíveis agora
        // Prioriza o valor salvo, a menos que esteja vazio e o env tenha valor
        return { 
          webhookConsultantSave: savedConfig.webhookConsultantSave || envConfig.webhookConsultantSave,
          webhookConsultantList: savedConfig.webhookConsultantList || envConfig.webhookConsultantList,
          webhookManagerKPI: savedConfig.webhookManagerKPI || envConfig.webhookManagerKPI,
          webhookNewSales: savedConfig.webhookNewSales || envConfig.webhookNewSales,
          webhookRenewals: savedConfig.webhookRenewals || envConfig.webhookRenewals,
          webhookLeadDistribution: savedConfig.webhookLeadDistribution || envConfig.webhookLeadDistribution,
        };
      } catch (e) {
        console.error("Erro ao carregar configurações", e);
        return envConfig;
      }
    }
    return envConfig;
  });

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const resetToEnv = () => {
    const envConfig = getEnvConfig();
    setConfig(envConfig);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetToEnv }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig deve ser usado dentro de um ConfigProvider');
  }
  return context;
};
