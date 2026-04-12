// types/index.ts

export interface Asset {
  id: string;
  assetId: string;
  deviceType: string;
  brand: string;
  model: string;
  serialNumber: string;
  specifications: string;
  purchaseDate: Date | string;
  condition: string;
  status: string;
  location?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email?: string;
  department: string;
  designation?: string;
  phone?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Assignment {
  id: string;
  assetId: string;
  employeeId: string;
  assignmentDate: Date | string;
  returnDate?: Date | string | null;
  status: string;
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  asset?: Asset;
  employee?: Employee;
}

export interface AuditLog {
  id: string;
  assetId?: string;
  employeeId?: string;
  action: string;
  description: string;
  previousValue?: string;
  newValue?: string;
  timestamp: Date | string;
  userId?: string;
  asset?: Asset;
  employee?: Employee;
}

export interface ConditionHistory {
  id: string;
  assetId: string;
  previousCondition: string;
  newCondition: string;
  reason?: string;
  changedAt: Date | string;
  asset?: Asset;
}

export interface DashboardStats {
  totalAssets: number;
  assignedAssets: number;
  availableAssets: number;
  damagedAssets: number;
  totalEmployees: number;
  assetsByType: Record<string, number>;
  assetsByDepartment: Record<string, number>;
}
