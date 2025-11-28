import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Fuel, Wallet, Zap, Loader2, ArrowRight } from 'lucide-react';
import { Expense, Vehicle, KPIData } from '../types';
import { getFleetInsights } from '../services/geminiService';

interface DashboardProps {
  kpiData: KPIData;
  expenses: Expense[];
  vehicles: Vehicle[];
  onNavigate: (tab: string) => void;
}

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const Dashboard: React.FC<DashboardProps> = ({ kpiData, expenses, vehicles, onNavigate }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // Prepare Chart Data
  const expensesByCategory = expenses.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  // Mock monthly data (in real app, aggregate by date)
  const barData = [
    { name: 'Jan', value: 4200 },
    { name: 'Fev', value: 3800 },
    { name: 'Mar', value: kpiData.totalCost },
    { name: 'Abr', value: 2400 }, // Projected
  ];

  const topVehicles = vehicles
    .map(v => {
      const cost = expenses.filter(e => e.vehicleId === v.id).reduce((sum, e) => sum + e.amount, 0);
      return { ...v, totalCost: cost };
    })
    .sort((a, b) => b.totalCost - a.totalCost)
    .slice(0, 3);

  const fetchInsights = async () => {
    if (vehicles.length === 0) return;
    setLoadingInsights(true);
    try {
      const results = await getFleetInsights(vehicles, expenses);
      if (results && Array.isArray(results)) {
        setInsights(results);
      }
    } catch (e) {
      console.error("Failed to fetch insights", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [vehicles.length, expenses.length]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Visão Geral</h2>
          <p className="text-slate-500">Acompanhe os indicadores da sua frota em tempo real.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
          📅 Este mês
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => onNavigate('expenses')}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
        >
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={48} className="text-blue-600" />
          </div>
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Custo Total (Mês)</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">R$ {kpiData.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          <span className="text-xs text-green-600 flex items-center mt-2 font-medium">
            <TrendingUp size={12} className="mr-1" /> -5.2% vs mês anterior
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
           <div className="absolute right-0 top-0 p-4 opacity-10">
            <Fuel size={48} className="text-orange-500" />
          </div>
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Custo por KM</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">R$ {kpiData.costPerKm.toFixed(2)}</span>
          <span className="text-xs text-slate-400 mt-2 font-medium">Média da frota</span>
        </div>

        <div 
          onClick={() => onNavigate('vehicles')}
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
        >
            <div className="absolute right-0 top-0 p-4 opacity-10">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Alertas</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{kpiData.maintenanceAlerts}</span>
          <span className="text-xs text-red-500 mt-2 font-medium">Revisões pendentes</span>
        </div>

         <div 
           onClick={() => onNavigate('vehicles')}
           className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1"
        >
          <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Veículos Ativos</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{kpiData.activeVehicles}/{vehicles.length}</span>
          <span className="text-xs text-blue-600 mt-2 font-medium cursor-pointer">Ver frota completa &rarr;</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Evolução de Custos</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `R$${value}`} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Gastos por Categoria</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                 <span className="text-xs text-slate-400 font-medium uppercase">Total</span>
                 <p className="text-xl font-bold text-slate-800">100%</p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600">{entry.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{((entry.value / kpiData.totalCost) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings / Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800">🏆 Ranking de Custos</h3>
          </div>
          <div className="p-0">
             <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Veículo</th>
                    <th className="px-6 py-3">Placa</th>
                    <th className="px-6 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topVehicles.map((v, i) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-600'}`}>{i + 1}</span>
                        {v.model}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{v.plate}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-800">
                        R$ {v.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>

        <div className="bg-blue-900 rounded-xl shadow-sm border border-blue-800 p-6 text-white relative overflow-hidden flex flex-col">
            <div className="absolute right-0 top-0 opacity-10">
               <Zap size={120} />
            </div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
               <Zap size={20} className="text-yellow-400" />
               Insights de IA
            </h3>
            <p className="text-blue-200 mb-6 text-sm">
               Nossa inteligência artificial analisou seus dados e encontrou oportunidades:
            </p>
            
            <div className="space-y-4 flex-1">
               {loadingInsights ? (
                 <div className="flex items-center justify-center py-8 text-blue-200">
                    <Loader2 size={24} className="animate-spin mr-2" /> Analisando frota...
                 </div>
               ) : insights.length > 0 ? (
                 insights.map((insight, idx) => (
                   <div key={idx} className="bg-blue-800/50 p-3 rounded-lg border border-blue-700/50 flex items-start">
                      <span className="mr-2 mt-0.5">💡</span>
                      <p className="text-sm text-blue-50">{insight}</p>
                   </div>
                 ))
               ) : (
                  <div className="bg-blue-800/50 p-3 rounded-lg border border-blue-700/50">
                    <p className="text-sm">Nenhum insight disponível no momento. Adicione mais dados.</p>
                  </div>
               )}
            </div>
            
            <button 
              onClick={fetchInsights}
              disabled={loadingInsights}
              className="mt-6 w-full bg-white text-blue-900 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center"
            >
               {loadingInsights ? 'Gerando...' : 'Atualizar Análise IA'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;