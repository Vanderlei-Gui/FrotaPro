import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import VehicleManager from './components/VehicleManager';
import ExpenseManager from './components/ExpenseManager';
import DriverManager from './components/DriverManager';
import Settings from './components/Settings';
import { Vehicle, Expense, VehicleType, VehicleStatus, ExpenseType, CompanySettings, KPIData, Driver } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initial Mock Data
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    name: 'TechFleet Solutions',
    logoUrl: null,
    primaryColor: '#1e3a8a'
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1', name: 'Corolla 01', plate: 'ABC-1234', brand: 'Toyota', model: 'Corolla XEi',
      year: 2023, type: VehicleType.CAR, currentKm: 25000, status: VehicleStatus.ACTIVE,
      purchaseValue: 140000, insuranceExpiry: '2025-05-20', costCenter: 'Vendas'
    },
    {
      id: '2', name: 'Fiorino 05', plate: 'XYZ-9876', brand: 'Fiat', model: 'Fiorino Endurance',
      year: 2022, type: VehicleType.VAN, currentKm: 58000, status: VehicleStatus.ACTIVE,
      purchaseValue: 95000, insuranceExpiry: '2024-12-10', costCenter: 'Logística'
    },
    {
      id: '3', name: 'Caminhão 02', plate: 'TRK-5544', brand: 'Volvo', model: 'FH 540',
      year: 2021, type: VehicleType.TRUCK, currentKm: 320000, status: VehicleStatus.MAINTENANCE,
      purchaseValue: 850000, insuranceExpiry: '2024-11-01', costCenter: 'Logística'
    }
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    { id: '1', name: 'Carlos Silva', cnh: '12345678900', cnhValidity: '2026-05-20', score: 98, status: 'Active' },
    { id: '2', name: 'Roberto Almeida', cnh: '09876543211', cnhValidity: '2024-11-10', score: 85, status: 'Active' },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '101', vehicleId: '1', type: ExpenseType.FUEL, amount: 250.00, date: '2024-03-01', description: 'Posto Shell', isPaid: true, liters: 45 },
    { id: '102', vehicleId: '1', type: ExpenseType.MAINTENANCE, amount: 1200.00, date: '2024-02-15', description: 'Revisão 20k', isPaid: true },
    { id: '103', vehicleId: '2', type: ExpenseType.FUEL, amount: 300.00, date: '2024-03-05', description: 'Posto BR', isPaid: true, liters: 55 },
    { id: '104', vehicleId: '2', type: ExpenseType.FINE, amount: 195.00, date: '2024-01-20', description: 'Excesso de Velocidade', isPaid: false },
    { id: '105', vehicleId: '3', type: ExpenseType.MAINTENANCE, amount: 4500.00, date: '2024-03-10', description: 'Troca de Pneus', isPaid: true },
  ]);

  // Computed KPI Data
  const kpiData: KPIData = useMemo(() => {
    const totalCost = expenses.reduce((sum, e) => sum + e.amount, 0);
    const activeVehicles = vehicles.filter(v => v.status === VehicleStatus.ACTIVE).length;
    // Simple mock calculation for cost/km (Total Cost / Total KM of active fleet - rough approximation)
    const totalKm = vehicles.reduce((sum, v) => sum + v.currentKm, 0);
    const costPerKm = totalKm > 0 ? totalCost / (totalKm * 0.1) : 0; // *0.1 assumes cost is monthly vs lifetime km ratio adjustment for demo

    return {
      totalCost,
      costPerKm,
      activeVehicles,
      maintenanceAlerts: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length
    };
  }, [vehicles, expenses]);

  // Handlers
  const handleAddVehicle = (vehicle: Vehicle) => {
    setVehicles([...vehicles, vehicle]);
  };

  const handleUpdateVehicleStatus = (id: string, status: VehicleStatus) => {
    setVehicles(vehicles.map(v => v.id === id ? { ...v, status } : v));
  };

  const handleAddExpense = (expense: Expense) => {
    setExpenses([expense, ...expenses]);
    
    // Update vehicle KM if fuel expense
    if (expense.kmAtTime && expense.vehicleId) {
       setVehicles(vehicles.map(v => {
          if (v.id === expense.vehicleId && expense.kmAtTime! > v.currentKm) {
             return { ...v, currentKm: expense.kmAtTime! };
          }
          return v;
       }));
    }
  };

  const handleAddDriver = (driver: Driver) => {
    setDrivers([...drivers, driver]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard kpiData={kpiData} expenses={expenses} vehicles={vehicles} onNavigate={setActiveTab} />;
      case 'vehicles':
        return <VehicleManager vehicles={vehicles} onAddVehicle={handleAddVehicle} onUpdateStatus={handleUpdateVehicleStatus} />;
      case 'expenses':
        return <ExpenseManager expenses={expenses} vehicles={vehicles} onAddExpense={handleAddExpense} />;
      case 'settings':
        return <Settings settings={companySettings} onUpdate={setCompanySettings} />;
      case 'drivers':
        return <DriverManager drivers={drivers} onAddDriver={handleAddDriver} />;
      default:
        return <Dashboard kpiData={kpiData} expenses={expenses} vehicles={vehicles} onNavigate={setActiveTab} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      companySettings={companySettings}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;