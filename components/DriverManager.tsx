import React, { useState } from 'react';
import { Driver } from '../types';
import { Plus, Search, Trash2, User, FileBadge, Star } from 'lucide-react';

interface DriverManagerProps {
  drivers: Driver[];
  onAddDriver: (d: Driver) => void;
}

const DriverManager: React.FC<DriverManagerProps> = ({ drivers, onAddDriver }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState<Partial<Driver>>({ status: 'Active', score: 100 });
  const [filter, setFilter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDriver.name && newDriver.cnh) {
      onAddDriver({
        id: Math.random().toString(36).substr(2, 9),
        name: newDriver.name,
        cnh: newDriver.cnh,
        cnhValidity: newDriver.cnhValidity || new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
        score: newDriver.score || 100,
        status: 'Active'
      });
      setIsModalOpen(false);
      setNewDriver({ status: 'Active', score: 100 });
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(filter.toLowerCase()) || 
    d.cnh.includes(filter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Motoristas</h2>
           <p className="text-slate-500">Gerencie os condutores da sua frota.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <Plus size={20} /> Novo Motorista
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm w-full md:w-96">
        <Search size={20} className="text-slate-400 ml-2" />
        <input type="text" placeholder="Buscar por nome ou CNH..." className="bg-transparent border-none outline-none text-sm w-full text-slate-900" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-5 flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{driver.name}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                     <FileBadge size={12} className="mr-1" />
                     CNH: {driver.cnh}
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${driver.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {driver.status === 'Active' ? 'Ativo' : 'Inativo'}
              </div>
            </div>
            <div className="px-5 pb-5">
               <div className="mt-4 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-sm text-slate-500">Score de Direção</span>
                  <div className="flex items-center font-bold text-blue-600">
                     <Star size={16} className="mr-1 fill-blue-600" />
                     {driver.score}/100
                  </div>
               </div>
               <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Validade CNH: {new Date(driver.cnhValidity).toLocaleDateString()}</span>
                  <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-lg text-slate-800">Novo Motorista</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-600">Nome Completo</label>
                 <input required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.name || ''} onChange={e => setNewDriver({...newDriver, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-600">CNH</label>
                 <input required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.cnh || ''} onChange={e => setNewDriver({...newDriver, cnh: e.target.value})} />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-600">Validade CNH</label>
                 <input type="date" required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" value={newDriver.cnhValidity || ''} onChange={e => setNewDriver({...newDriver, cnhValidity: e.target.value})} />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DriverManager;