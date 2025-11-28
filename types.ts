export enum VehicleType {
  CAR = 'Carro',
  MOTORCYCLE = 'Moto',
  TRUCK = 'Caminhão',
  VAN = 'Van'
}

export enum VehicleStatus {
  ACTIVE = 'Ativo',
  MAINTENANCE = 'Manutenção',
  SOLD = 'Vendido',
  INACTIVE = 'Parado'
}

export enum FuelType {
  GASOLINE = 'Gasolina',
  ETHANOL = 'Etanol',
  DIESEL = 'Diesel',
  ELECTRIC = 'Elétrico',
  CNG = 'GNV'
}

export enum ExpenseType {
  FUEL = 'Abastecimento',
  MAINTENANCE = 'Manutenção',
  TAX = 'Imposto/Doc',
  FINE = 'Multa',
  INSURANCE = 'Seguro',
  OTHER = 'Outros'
}

export interface CompanySettings {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
}

export interface Driver {
  id: string;
  name: string;
  cnh: string;
  cnhValidity: string;
  score: number; // 0-100
  status: 'Active' | 'Inactive';
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  type: VehicleType;
  currentKm: number;
  status: VehicleStatus;
  purchaseValue: number;
  insuranceExpiry: string;
  costCenter?: string;
  assignedDriverId?: string;
  imageUrl?: string;
}

export interface Expense {
  id: string;
  vehicleId: string;
  type: ExpenseType;
  date: string;
  amount: number;
  description: string;
  kmAtTime?: number;
  liters?: number; // For fuel
  fuelType?: FuelType;
  provider?: string;
  receiptUrl?: string; // OCR image
  isPaid: boolean;
}

export interface KPIData {
  totalCost: number;
  costPerKm: number;
  activeVehicles: number;
  maintenanceAlerts: number;
}
