// store/uiStore.ts
import { create } from 'zustand';

interface UIStore {
  darkMode: boolean;
  sidebarOpen: boolean;
  assetModalOpen: boolean;
  employeeModalOpen: boolean;
  assignmentModalOpen: boolean;
  selectedAsset: string | null;
  selectedEmployee: string | null;
  selectedAssignment: string | null;
  
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  openAssetModal: () => void;
  closeAssetModal: () => void;
  openEmployeeModal: () => void;
  closeEmployeeModal: () => void;
  openAssignmentModal: () => void;
  closeAssignmentModal: () => void;
  setSelectedAsset: (id: string | null) => void;
  setSelectedEmployee: (id: string | null) => void;
  setSelectedAssignment: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  darkMode: false,
  sidebarOpen: true,
  assetModalOpen: false,
  employeeModalOpen: false,
  assignmentModalOpen: false,
  selectedAsset: null,
  selectedEmployee: null,
  selectedAssignment: null,

  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.darkMode;
      if (newDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(newDarkMode));
      return { darkMode: newDarkMode };
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  openAssetModal: () => set({ assetModalOpen: true }),
  closeAssetModal: () => set({ assetModalOpen: false, selectedAsset: null }),

  openEmployeeModal: () => set({ employeeModalOpen: true }),
  closeEmployeeModal: () =>
    set({ employeeModalOpen: false, selectedEmployee: null }),

  openAssignmentModal: () => set({ assignmentModalOpen: true }),
  closeAssignmentModal: () =>
    set({ assignmentModalOpen: false, selectedAssignment: null }),

  setSelectedAsset: (id) => set({ selectedAsset: id }),
  setSelectedEmployee: (id) => set({ selectedEmployee: id }),
  setSelectedAssignment: (id) => set({ selectedAssignment: id }),
}));
