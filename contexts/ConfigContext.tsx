"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppConfig } from '@/lib/types';

const CONFIG_STORAGE_KEY = 'via_direta_config';

// Helper seguro para acessar variáveis de ambiente no Next.js
const getEnv = (key: string): string => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      const envs: Record<string, string | undefined> = {
        'WEBHOOK_SAVE_POLICY': process.env.NEXT_PUBLIC_WEBHOOK_SAVE_POLICY,
        'WEBHOOK_LIST_POLICIES': process.env.NEXT_PUBLIC_WEBHOOK_LIST_POLICIES,
        'WEBHOOK_MANAGER_KPI': process.env.NEXT_PUBLIC_WEBHOOK_MANAGER_KPI,
        'WEBHOOK_NEW_SALES': process.env.NEXT_PUBLIC_WEBHOOK_NEW_SALES,
        'WEBHOOK_RENEWALS': process.env.NEXT_PUBLIC_WEBHOOK_RENEWALS,
        'WEBHOOK_LEAD_DISTRIBUTION': process.env.NEXT_PUBLIC_WEBHOOK_LEAD_DISTRIBUTION
      };
      return envs[key] || '';
    }
  } catch (error) {
    console.warn(`Erro ao ler variável de ambiente ${key}:`, error);
  }
  return '';
};

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
  // Initialize state immediately with Env vars so the Provider is always valid
  const [config, setConfig] = useState<AppConfig>(getEnvConfig());

  useEffect(() => {
    // Load from localStorage on client side mount
    const envConfig = getEnvConfig();
    const savedConfigString = localStorage.getItem(CONFIG_STORAGE_KEY);
    
    if (savedConfigString) {
      try {
        const savedConfig = JSON.parse(savedConfigString);
        setConfig({ 
          webhookConsultantSave: savedConfig.webhookConsultantSave || envConfig.webhookConsultantSave,
          webhookConsultantList: savedConfig.webhookConsultantList || envConfig.webhookConsultantList,
          webhookManagerKPI: savedConfig.webhookManagerKPI || envConfig.webhookManagerKPI,
          webhookNewSales: savedConfig.webhookNewSales || envConfig.webhookNewSales,
          webhookRenewals: savedConfig.webhookRenewals || envConfig.webhookRenewals,
          webhookLeadDistribution: savedConfig.webhookLeadDistribution || envConfig.webhookLeadDistribution,
        });
      } catch (e) {
        console.error("Erro ao carregar configurações", e);
        setConfig(envConfig);
      }
    }
  }, []);

  const updateConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
  };

  const resetToEnv = () => {
    const envConfig = getEnvConfig();
    setConfig(envConfig);
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  };

  // REMOVED: The check that returned <>{children}</> without Provider
  // We always return the Provider now.

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