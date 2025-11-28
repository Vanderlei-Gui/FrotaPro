import React, { useState } from 'react';
import { Vehicle, VehicleType, VehicleStatus } from '../types';
import { Plus, Search, Filter, MoreVertical, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onAddVehicle: (v: Vehicle) => void;
  onUpdateStatus: (id: string, status: VehicleStatus) => void;
}

const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, onAddVehicle, onUpdateStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');

  // Form State
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: VehicleType.CAR,
    status: VehicleStatus.ACTIVE
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVehicle.model && newVehicle.plate) {
      onAddVehicle({
        id: Math.random().toString(36).substr(2, 9),
        name: newVehicle.model || 'Veículo',
        brand: newVehicle.brand || '',
        model: newVehicle.model || '',
        plate: newVehicle.plate || '',
        year: newVehicle.year || new Date().getFullYear(),
        type: newVehicle.type || VehicleType.CAR,
        currentKm: newVehicle.currentKm || 0,
        status: VehicleStatus.ACTIVE,
        purchaseValue: newVehicle.purchaseValue || 0,
        insuranceExpiry: new Date().toISOString(),
        costCenter: newVehicle.costCenter
      });
      setIsModalOpen(false);
      setNewVehicle({ type: VehicleType.CAR, status: VehicleStatus.ACTIVE });
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.model.toLowerCase().includes(filter.toLowerCase()) || 
    v.plate.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Meus Veículos</h2>
           <p className="text-slate-500">Gerencie a frota, documentos e status.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Novo Veículo
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-slate-200 shadow-sm w-full md:w-96">
        <Search size={20} className="text-slate-400 ml-2" />
        <input 
          type="text" 
          placeholder="Buscar por placa ou modelo..." 
          className="bg-transparent border-none outline-none text-sm w-full text-slate-900"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
            <div className="h-2 bg-blue-600 w-full"></div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wide">
                      {vehicle.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">{vehicle.model}</h3>
                    <p className="text-sm text-slate-500 font-mono">{vehicle.brand} • {vehicle.year}</p>
                 </div>
                 <div className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.status === VehicleStatus.ACTIVE ? 'bg-green-100 text-green-700' : 
                    vehicle.status === VehicleStatus.MAINTENANCE ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                 }`}>
                    {vehicle.status}
                 </div>
              </div>

              <div className="mt-6 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Placa</span>
                    <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 rounded border border-slate-200">{vehicle.plate}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Odômetro</span>
                    <span className="font-medium text-slate-700">{vehicle.currentKm.toLocaleString()} km</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Centro de Custo</span>
                    <span className="font-medium text-slate-700">{vehicle.costCenter || '-'}</span>
                 </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                 <button className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-xs font-medium">
                    <FileText size={14} /> Documentos
                 </button>
                 <div className="flex gap-2">
                    {vehicle.status === VehicleStatus.ACTIVE && (
                       <button onClick={() => onUpdateStatus(vehicle.id, VehicleStatus.MAINTENANCE)} title="Enviar para Manutenção" className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-full">
                          <AlertCircle size={18} />
                       </button>
                    )}
                    {vehicle.status === VehicleStatus.MAINTENANCE && (
                       <button onClick={() => onUpdateStatus(vehicle.id, VehicleStatus.ACTIVE)} title="Reativar" className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-full">
                          <CheckCircle size={18} />
                       </button>
                    )}
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-lg text-slate-800">Novo Veículo</h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Placa</label>
                    <input required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none uppercase" placeholder="ABC-1234" value={newVehicle.plate || ''} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Marca</label>
                    <input required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Toyota" value={newVehicle.brand || ''} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} />
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-medium text-slate-600">Modelo</label>
                 <input required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Corolla XEi" value={newVehicle.model || ''} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-600">Ano</label>
                   <input type="number" required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="2024" value={newVehicle.year || ''} onChange={e => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-1">
                   <label className="text-xs font-medium text-slate-600">KM Atual</label>
                   <input type="number" required className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" value={newVehicle.currentKm || ''} onChange={e => setNewVehicle({...newVehicle, currentKm: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Centro de Custo</label>
                  <input className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Engenharia, Obra A, Vendas" value={newVehicle.costCenter || ''} onChange={e => setNewVehicle({...newVehicle, costCenter: e.target.value})} />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                 <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Cadastrar Veículo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManager;