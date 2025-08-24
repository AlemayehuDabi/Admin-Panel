import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type {
  UserFilters,
  JobFilters,
  TransactionFilters,
  CreateJobForm,
  UpdateUserForm,
} from '../types';

// Query keys
export const queryKeys = {
  users: (filters?: UserFilters, page?: number) => ['users', filters, page],
  user: (id: string) => ['user', id],
  jobs: (filters?: JobFilters, page?: number) => ['jobs', filters, page],
  job: (id: string) => ['job', id],
  transactions: (filters?: TransactionFilters, page?: number) => [
    'transactions',
    filters,
    page,
  ],
  transaction: (id: string) => ['transaction', id],
  analytics: (timeRange?: { start: string; end: string }) => [
    'analytics',
    timeRange,
  ],
  workers: (page?: number) => ['workers', page],
  companies: (page?: number) => ['companies', page],
};

// User hooks
export const useUsers = (filters?: UserFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.users(filters, page),
    queryFn: () => api.getUsers(filters, page, limit),
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserForm }) =>
      api.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useApproveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

export const useRejectUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.rejectUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// Job hooks
export const useJobs = (filters?: JobFilters, page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.jobs(filters, page),
    queryFn: () => api.getJobs(filters, page, limit),
  });
};

export const useJob = (id: string) => {
  return useQuery({
    queryKey: queryKeys.job(id),
    queryFn: () => api.getJobById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateJobForm) => api.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      api.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job'] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

// Transaction hooks
export const useTransactions = (
  filters?: TransactionFilters,
  page = 1,
  limit = 10
) => {
  return useQuery({
    queryKey: queryKeys.transactions(filters, page),
    queryFn: () => api.getTransactions(filters, page, limit),
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => api.getTransactionById(id),
    enabled: !!id,
  });
};

export const useAdjustWalletBalance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      amount,
      reason,
    }: {
      userId: string;
      amount: number;
      reason: string;
    }) => api.adjustWalletBalance(userId, amount, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

// Analytics hooks
export const useAnalytics = (timeRange?: { start: string; end: string }) => {
  return useQuery({
    queryKey: queryKeys.analytics(timeRange),
    queryFn: () => api.getAnalytics(timeRange),
  });
};

// Worker hooks
export const useWorkers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.workers(page),
    queryFn: () => api.getWorkers(page, limit),
  });
};

// Company hooks
export const useCompanies = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: queryKeys.companies(page),
    queryFn: () => api.getCompanies(page, limit),
  });
};
