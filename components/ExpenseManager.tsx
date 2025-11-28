import React, { useState } from 'react';
import { Expense, ExpenseType, Vehicle, FuelType } from '../types';
import { Camera, Upload, Check, Loader2, Plus } from 'lucide-react';
import { analyzeReceiptImage } from '../services/geminiService';

interface ExpenseManagerProps {
  expenses: Expense[];
  vehicles: Vehicle[];
  onAddExpense: (e: Expense) => void;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ expenses, vehicles, onAddExpense }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Expense>>({
    type: ExpenseType.FUEL,
    date: new Date().toISOString().split('T')[0],
    isPaid: true
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      setIsAnalyzing(true);
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        try {
          // Use AI to extract data
          const data = await analyzeReceiptImage(base64Data);
          if (data) {
            setFormData(prev => ({
              ...prev,
              amount: data.amount,
              description: data.description || prev.description,
              date: data.date || prev.date,
              provider: data.provider,
              liters: data.liters,
              receiptUrl: base64String // Store preview
            }));
          }
        } catch (err) {
          alert('Erro ao analisar a nota fiscal. Tente inserir manualmente.');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.vehicleId && formData.amount) {
      onAddExpense({
        id: Math.random().toString(36).substr(2, 9),
        vehicleId: formData.vehicleId,
        type: formData.type || ExpenseType.OTHER,
        date: formData.date || new Date().toISOString(),
        amount: Number(formData.amount),
        description: formData.description || 'Despesa Avulsa',
        isPaid: formData.isPaid || false,
        liters: formData.liters,
        kmAtTime: formData.kmAtTime,
        fuelType: formData.fuelType
      });
      setIsModalOpen(false);
      setFormData({ type: ExpenseType.FUEL, date: new Date().toISOString().split('T')[0], isPaid: true });
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Registro de Gastos</h2>
           <p className="text-slate-500">Controle combustível, manutenção e multas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Lançar Despesa
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium">Veículo</th>
              <th className="px-6 py-4 font-medium">Tipo</th>
              <th className="px-6 py-4 font-medium">Descrição</th>
              <th className="px-6 py-4 font-medium text-right">Valor</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => {
              const vehicle = vehicles.find(v => v.id === expense.vehicleId);
              return (
                <tr key={expense.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{vehicle?.model || 'Desconhecido'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      expense.type === ExpenseType.FUEL ? 'bg-orange-100 text-orange-700' :
                      expense.type === ExpenseType.MAINTENANCE ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {expense.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 truncate max-w-xs">{expense.description}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-700">R$ {expense.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    {expense.isPaid ? <Check size={16} className="text-green-500 mx-auto" /> : <span className="text-red-500 text-xs">Pendente</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-lg text-slate-800">Nova Despesa</h3>
                 {isAnalyzing && <span className="flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"><Loader2 size={12} className="animate-spin mr-1"/> Analisando Nota...</span>}
               </div>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div className="p-6">
              {/* OCR Area */}
              <div className="mb-6 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:bg-blue-100 transition-colors cursor-pointer relative">
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center">
                   <Camera className="text-blue-500 mb-2" size={32} />
                   <p className="text-sm font-medium text-blue-900">Digitalizar Nota Fiscal (IA)</p>
                   <p className="text-xs text-blue-600 mt-1">Carregue uma foto para preencher automaticamente</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Veículo</label>
                      <select required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.vehicleId || ''} onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                      >
                        <option value="">Selecione...</option>
                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.plate})</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Tipo de Despesa</label>
                      <select required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ExpenseType})}
                      >
                         {Object.values(ExpenseType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600">Data</label>
                       <input type="date" required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                         value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-medium text-slate-600">Valor Total (R$)</label>
                       <input type="number" step="0.01" required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                         value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} placeholder="0,00"
                       />
                    </div>
                 </div>

                 {formData.type === ExpenseType.FUEL && (
                    <div className="bg-orange-50 p-4 rounded-lg grid grid-cols-2 gap-4 border border-orange-100">
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-orange-800">Litros</label>
                          <input type="number" step="0.1" className="w-full bg-white border border-orange-200 rounded-lg p-2 text-sm text-slate-900" placeholder="0.0" 
                            value={formData.liters || ''} onChange={e => setFormData({...formData, liters: parseFloat(e.target.value)})}
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-xs font-medium text-orange-800">Combustível</label>
                          <select className="w-full bg-white border border-orange-200 rounded-lg p-2 text-sm text-slate-900"
                             value={formData.fuelType || ''} onChange={e => setFormData({...formData, fuelType: e.target.value as FuelType})}
                          >
                             <option value="">Selecione...</option>
                             {Object.values(FuelType).map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                       </div>
                       <div className="space-y-1 col-span-2">
                          <label className="text-xs font-medium text-orange-800">KM Atual</label>
                          <input type="number" className="w-full bg-white border border-orange-200 rounded-lg p-2 text-sm text-slate-900" placeholder="Odômetro no momento"
                            value={formData.kmAtTime || ''} onChange={e => setFormData({...formData, kmAtTime: parseInt(e.target.value)})}
                          />
                       </div>
                    </div>
                 )}

                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Descrição / Estabelecimento</label>
                    <input type="text" required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Posto Ipiranga Centro"
                    />
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                     <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                     <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Salvar Despesa</button>
                 </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;