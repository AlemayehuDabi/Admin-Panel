import { create } from 'zustand';
import type {
  User,
  Job,
  Company,
  Transaction,
  UserFilters,
  JobFilters,
  TransactionFilters,
} from '../types';

interface AdminState {
  // Selected entities
  selectedUser: User | null;
  selectedJob: Job | null;
  selectedCompany: Company | null;
  selectedTransaction: Transaction | null;

  // Filters
  userFilters: UserFilters;
  jobFilters: JobFilters;
  transactionFilters: TransactionFilters;

  // UI state
  sidebarOpen: boolean;
  currentPage: string;

  // Actions
  setSelectedUser: (user: User | null) => void;
  setSelectedJob: (job: Job | null) => void;
  setSelectedCompany: (company: Company | null) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setUserFilters: (filters: UserFilters) => void;
  setJobFilters: (filters: JobFilters) => void;
  setTransactionFilters: (filters: TransactionFilters) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
  clearSelections: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  selectedUser: null,
  selectedJob: null,
  selectedCompany: null,
  selectedTransaction: null,
  userFilters: {},
  jobFilters: {},
  transactionFilters: {},
  sidebarOpen: true,
  currentPage: 'dashboard',

  // Actions
  setSelectedUser: (user) => set({ selectedUser: user }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  setSelectedTransaction: (transaction) =>
    set({ selectedTransaction: transaction }),
  setUserFilters: (filters) => set({ userFilters: filters }),
  setJobFilters: (filters) => set({ jobFilters: filters }),
  setTransactionFilters: (filters) => set({ transactionFilters: filters }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  clearSelections: () =>
    set({
      selectedUser: null,
      selectedJob: null,
      selectedCompany: null,
      selectedTransaction: null,
    }),
}));
