"use client";

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DASHBOARD_MOCK_DATA } from '@/lib/constants';
import { useConfig } from '@/contexts/ConfigContext';
import { DashboardKPIs } from '@/lib/types';

export const ManagerTab: React.FC = () => {
  const { config } = useConfig();
  const [dashboardData, setDashboardData] = useState<DashboardKPIs>(DASHBOARD_MOCK_DATA);

  useEffect(() => {
    const fetchKPIs = async () => {
        if (config.webhookManagerKPI) {
            try {
                console.log(`[ManagerTab] Buscando KPIs em: ${config.webhookManagerKPI}`);
                const response = await fetch(config.webhookManagerKPI);
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                }
            } catch (error) {
                console.error("Erro ao buscar KPIs:", error);
            }
        }
    };
    fetchKPIs();
  }, [config.webhookManagerKPI]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Geral</h2>
          <p className="text-gray-500">Acompanhamento consolidado de produção e renovação.</p>
        </div>
      </div>

      {/* Top KPI Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total de Renovação */}
        <div className="bg-black text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Total de Renovação</h3>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm text-gray-400">Entregues</span>
              <span className="text-2xl font-bold">{dashboardData.renewalsDelivered}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm text-gray-400">Renovados</span>
              <span className="text-2xl font-bold text-green-400">{dashboardData.renewalsClosed}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Renovação % */}
        <div className="bg-black text-white p-6 rounded-xl shadow-lg flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-gray-300 mb-1">Renovação %</h3>
            <div className="text-5xl font-bold text-white">{dashboardData.renewalRate}%</div>
        </div>

        {/* Card 3: Perdidos / Desqualificados */}
        <div className="bg-black text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-2 text-center">STATUS NEGATIVO</h3>
            <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
               <span className="text-gray-400">Perdidos</span>
               <span className="text-2xl font-bold text-red-400">{dashboardData.lostCount}</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-gray-400">Desqualificados</span>
               <span className="text-2xl font-bold text-orange-400">{dashboardData.disqualifiedCount}</span>
            </div>
        </div>

        {/* Card 4: Média Ponderada */}
        <div className="bg-black text-white p-6 rounded-xl shadow-lg">
           <div className="grid grid-cols-2 gap-4 h-full">
              <div className="flex flex-col justify-center">
                  <span className="text-xs text-gray-400 uppercase">Média Pond.</span>
                  <span className="text-xl font-bold">{dashboardData.weightedAverage}%</span>
              </div>
              <div className="flex flex-col justify-center border-l border-gray-700 pl-4">
                  <span className="text-xs text-gray-400 uppercase">Média Simples</span>
                  <span className="text-xl font-bold">{dashboardData.simpleAverage}%</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Commission Card & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Big Commission Number */}
        <div className="lg:col-span-3 bg-black text-white p-8 rounded-xl shadow-lg flex flex-col items-center justify-center">
           <h3 className="text-xl text-gray-400 mb-2 uppercase tracking-widest">Comissão da Corretora</h3>
           <div className="text-5xl md:text-6xl font-bold text-white">
             R$ {dashboardData.brokerCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
           </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[400px]">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Evolução de Comissão (Ano Vigente)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboardData.monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} tickFormatter={(value) => `R$${value/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Comissão']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};