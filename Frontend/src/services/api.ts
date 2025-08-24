import type {
  User,
  Job,
  Company,
  Transaction,
  Analytics,
  Worker,
  PaginatedResponse,
  ApiResponse,
  UserFilters,
  JobFilters,
  TransactionFilters,
  CreateJobForm,
  UpdateUserForm,
} from '../types';

// Mock data generators
const generateMockUsers = (): User[] => [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'worker',
    status: 'active',
    verification: 'verified',
    referralCode: 'JD123',
    dateJoined: '2024-01-15T10:00:00Z',
    lastLogin: '2024-12-20T14:30:00Z',
    wallet: {
      id: 'w1',
      userId: '1',
      balance: 2500.0,
      currency: 'USD',
      escrowBalance: 500.0,
      totalEarnings: 15000.0,
      totalSpent: 0,
      pendingWithdrawals: 0,
      lastUpdated: '2024-12-20T14:30:00Z',
    },
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'company',
    status: 'active',
    verification: 'pending',
    referralCode: 'JS456',
    dateJoined: '2024-02-10T09:00:00Z',
    wallet: {
      id: 'w2',
      userId: '2',
      balance: 10000.0,
      currency: 'USD',
      escrowBalance: 2000.0,
      totalEarnings: 0,
      totalSpent: 25000.0,
      pendingWithdrawals: 0,
      lastUpdated: '2024-12-20T14:30:00Z',
    },
  },
  {
    id: '3',
    email: 'admin@platform.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    verification: 'verified',
    referralCode: 'AD789',
    dateJoined: '2023-01-01T00:00:00Z',
    wallet: {
      id: 'w3',
      userId: '3',
      balance: 0,
      currency: 'USD',
      escrowBalance: 0,
      totalEarnings: 0,
      totalSpent: 0,
      pendingWithdrawals: 0,
      lastUpdated: '2024-12-20T14:30:00Z',
    },
  },
];

const generateMockJobs = (): Job[] => [
  {
    id: 'j1',
    title: 'Full Stack Developer for E-commerce Platform',
    description:
      'We need an experienced full stack developer to build a modern e-commerce platform with React and Node.js.',
    requiredSkills: [
      {
        id: 's1',
        name: 'React',
        level: 'advanced',
        yearsOfExperience: 3,
        verified: true,
      },
      {
        id: 's2',
        name: 'Node.js',
        level: 'intermediate',
        yearsOfExperience: 2,
        verified: true,
      },
    ],
    optionalSkills: [
      {
        id: 's3',
        name: 'AWS',
        level: 'intermediate',
        yearsOfExperience: 1,
        verified: false,
      },
    ],
    location: { type: 'remote' },
    payRate: { type: 'fixed', amount: 5000, currency: 'USD' },
    status: 'active',
    companyId: '2',
    company: generateMockUsers().find((u) => u.id === '2') as Company,
    category: 'Web Development',
    experienceLevel: 'mid',
    jobType: 'contract',
    duration: '3 months',
    applications: [],
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    deadline: '2024-12-30T23:59:59Z',
    requirements: [
      '3+ years React experience',
      'Portfolio required',
      'Available 40hrs/week',
    ],
  },
];

const generateMockTransactions = (): Transaction[] => [
  {
    id: 't1',
    userId: '1',
    walletId: 'w1',
    type: 'payment',
    amount: 1500.0,
    currency: 'USD',
    status: 'completed',
    description: 'Payment for Full Stack Development Project',
    jobId: 'j1',
    createdAt: '2024-12-18T10:00:00Z',
    completedAt: '2024-12-18T10:05:00Z',
    fee: 75.0,
  },
  {
    id: 't2',
    userId: '2',
    walletId: 'w2',
    type: 'deposit',
    amount: 5000.0,
    currency: 'USD',
    status: 'completed',
    description: 'Wallet top-up via bank transfer',
    createdAt: '2024-12-17T14:30:00Z',
    completedAt: '2024-12-17T14:35:00Z',
    fee: 0,
  },
];

const generateMockAnalytics = (): Analytics => ({
  overview: {
    totalUsers: 1250,
    totalWorkers: 850,
    totalCompanies: 400,
    totalJobs: 2340,
    activeJobs: 156,
    completedJobs: 2184,
    totalTransactions: 15670,
    totalRevenue: 2450000,
  },
  userStats: {
    newUsers: 45,
    activeUsers: 892,
    usersByRole: { admin: 5, worker: 850, company: 400, user: 0 },
    usersByStatus: { active: 1100, inactive: 120, suspended: 25, pending: 5 },
    userGrowth: [
      { date: '2024-12-01', value: 1200 },
      { date: '2024-12-15', value: 1225 },
      { date: '2024-12-20', value: 1250 },
    ],
    topReferrers: [
      {
        userId: '1',
        userName: 'John Doe',
        referralCount: 15,
        successfulReferrals: 12,
        totalRewards: 600,
      },
    ],
  },
  jobStats: {
    jobsPosted: 156,
    jobsCompleted: 142,
    averageJobValue: 2500,
    jobsByCategory: {
      'Web Development': 45,
      'Mobile Development': 32,
      Design: 28,
    },
    jobsByStatus: {
      draft: 12,
      active: 156,
      paused: 8,
      completed: 2184,
      cancelled: 45,
    },
    jobCompletionRate: 91.2,
    averageTimeToComplete: 14.5,
  },
  walletStats: {
    totalWalletBalance: 1250000,
    totalTransactionVolume: 2450000,
    averageTransactionValue: 156.3,
    transactionsByType: {
      deposit: 3200,
      withdrawal: 2800,
      payment: 8500,
      refund: 170,
      referral_bonus: 800,
      fee: 200,
    },
    revenueGrowth: [
      { date: '2024-12-01', value: 2400000 },
      { date: '2024-12-15', value: 2425000 },
      { date: '2024-12-20', value: 2450000 },
    ],
    topSpenders: [
      {
        userId: '2',
        userName: 'Jane Smith',
        totalSpent: 25000,
        transactionCount: 45,
        averageTransaction: 555.56,
      },
    ],
  },
  referralStats: {
    totalReferrals: 245,
    successfulReferrals: 198,
    referralConversionRate: 80.8,
    totalReferralRewards: 9900,
    topReferrers: [
      {
        userId: '1',
        userName: 'John Doe',
        referralCount: 15,
        successfulReferrals: 12,
        totalRewards: 600,
      },
    ],
  },
  timeRange: {
    start: '2024-12-01T00:00:00Z',
    end: '2024-12-20T23:59:59Z',
  },
});

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API functions
export const api = {
  // Users
  async getUsers(
    filters?: UserFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<User>> {
    await delay(500);
    const users = generateMockUsers();
    return {
      data: users,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
      success: true,
    };
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    await delay(300);
    const user = generateMockUsers().find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return { data: user, success: true };
  },

  async updateUser(
    id: string,
    data: UpdateUserForm
  ): Promise<ApiResponse<User>> {
    await delay(400);
    const user = generateMockUsers().find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return {
      data: { ...user, ...data },
      success: true,
      message: 'User updated successfully',
    };
  },

  async approveUser(id: string): Promise<ApiResponse<User>> {
    await delay(300);
    const user = generateMockUsers().find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return {
      data: { ...user, status: 'active' },
      success: true,
      message: 'User approved',
    };
  },

  async rejectUser(id: string, reason: string): Promise<ApiResponse<User>> {
    await delay(300);
    const user = generateMockUsers().find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return {
      data: { ...user, status: 'suspended' },
      success: true,
      message: 'User rejected',
    };
  },

  // Jobs
  async getJobs(
    filters?: JobFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Job>> {
    await delay(500);
    const jobs = generateMockJobs();
    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total: jobs.length,
        totalPages: Math.ceil(jobs.length / limit),
      },
      success: true,
    };
  },

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    await delay(300);
    const job = generateMockJobs().find((j) => j.id === id);
    if (!job) throw new Error('Job not found');
    return { data: job, success: true };
  },

  async createJob(data: CreateJobForm): Promise<ApiResponse<Job>> {
    await delay(600);
    const newJob: Job = {
      id: `j${Date.now()}`,
      ...data,
      status: 'draft',
      companyId: '2',
      company: generateMockUsers().find((u) => u.id === '2') as Company,
      applications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return { data: newJob, success: true, message: 'Job created successfully' };
  },

  async updateJob(id: string, data: Partial<Job>): Promise<ApiResponse<Job>> {
    await delay(400);
    const job = generateMockJobs().find((j) => j.id === id);
    if (!job) throw new Error('Job not found');
    return {
      data: { ...job, ...data, updatedAt: new Date().toISOString() },
      success: true,
      message: 'Job updated successfully',
    };
  },

  async deleteJob(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    return {
      data: undefined,
      success: true,
      message: 'Job deleted successfully',
    };
  },

  // Transactions
  async getTransactions(
    filters?: TransactionFilters,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Transaction>> {
    await delay(500);
    const transactions = generateMockTransactions();
    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total: transactions.length,
        totalPages: Math.ceil(transactions.length / limit),
      },
      success: true,
    };
  },

  async getTransactionById(id: string): Promise<ApiResponse<Transaction>> {
    await delay(300);
    const transaction = generateMockTransactions().find((t) => t.id === id);
    if (!transaction) throw new Error('Transaction not found');
    return { data: transaction, success: true };
  },

  async adjustWalletBalance(
    userId: string,
    amount: number,
    reason: string
  ): Promise<ApiResponse<void>> {
    await delay(400);
    return {
      data: undefined,
      success: true,
      message: 'Wallet balance adjusted successfully',
    };
  },

  // Analytics
  async getAnalytics(timeRange?: {
    start: string;
    end: string;
  }): Promise<ApiResponse<Analytics>> {
    await delay(800);
    return { data: generateMockAnalytics(), success: true };
  },

  // Workers
  async getWorkers(page = 1, limit = 10): Promise<PaginatedResponse<Worker>> {
    await delay(500);
    const workers = generateMockUsers().filter(
      (u) => u.role === 'worker'
    ) as Worker[];
    return {
      data: workers,
      pagination: {
        page,
        limit,
        total: workers.length,
        totalPages: Math.ceil(workers.length / limit),
      },
      success: true,
    };
  },

  // Companies
  async getCompanies(
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Company>> {
    await delay(500);
    const companies = generateMockUsers().filter(
      (u) => u.role === 'company'
    ) as Company[];
    return {
      data: companies,
      pagination: {
        page,
        limit,
        total: companies.length,
        totalPages: Math.ceil(companies.length / limit),
      },
      success: true,
    };
  },
};
