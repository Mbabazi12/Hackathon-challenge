// store/employeeStore.ts
import { create } from 'zustand';
import { Employee } from '@/types';

interface EmployeeStore {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  removeEmployee: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  loading: false,
  error: null,

  setEmployees: (employees) => set({ employees }),
  addEmployee: (employee) =>
    set((state) => ({ employees: [employee, ...state.employees] })),
  updateEmployee: (id, updates) =>
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
