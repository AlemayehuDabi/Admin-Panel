// Base types
export type UserRole = 'admin' | 'worker' | 'company' | 'user';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type VerificationStatus =
  | 'verified'
  | 'unverified'
  | 'pending'
  | 'rejected';
export type JobStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';
export type ApplicationStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';
export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'payment'
  | 'refund'
  | 'referral_bonus'
  | 'fee';
export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'cancelled';

// User Management Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  verification: VerificationStatus;
  referralCode: string;
  referredBy?: string;
  dateJoined: string;
  lastLogin?: string;
  profileImage?: string;
  phone?: string;
  address?: Address;
  wallet: Wallet;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Worker Management Types
export interface Worker extends User {
  role: 'worker';
  skills: Skill[];
  experience: Experience[];
  certifications: Certification[];
  portfolios: Portfolio[];
  availability: Availability;
  hourlyRate: number;
  rating: number;
  completedJobs: number;
  bio?: string;
  languages: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  verified: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  status: VerificationStatus;
  documentUrl?: string;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  images: string[];
  projectUrl?: string;
  skills: string[];
  completionDate: string;
  status: VerificationStatus;
}

export interface Availability {
  isAvailable: boolean;
  hoursPerWeek: number;
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  availableDays: string[];
}

// Company Management Types
export interface Company extends User {
  role: 'company';
  companyName: string;
  industry: string;
  companySize: string;
  website?: string;
  description: string;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  verificationDocuments: VerificationDocument[];
  postedJobs: number;
  rating: number;
  establishedYear: number;
}

export interface VerificationDocument {
  id: string;
  type:
    | 'business_license'
    | 'tax_certificate'
    | 'incorporation_certificate'
    | 'other';
  name: string;
  documentUrl: string;
  uploadDate: string;
  status: VerificationStatus;
  reviewNotes?: string;
}

// Job Management Types
export interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: Skill[];
  optionalSkills: Skill[];
  location: JobLocation;
  payRate: PayRate;
  status: JobStatus;
  companyId: string;
  company: Company;
  category: string;
  experienceLevel: 'entry' | 'mid' | 'senior' | 'expert';
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  duration?: string;
  applications: JobApplication[];
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  benefits?: string[];
  requirements: string[];
  milestones?: Milestone[];
}

export interface JobLocation {
  type: 'remote' | 'onsite' | 'hybrid';
  address?: Address;
  timezone?: string;
}

export interface PayRate {
  type: 'hourly' | 'fixed' | 'milestone';
  amount: number;
  currency: string;
  range?: {
    min: number;
    max: number;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  worker: Worker;
  status: ApplicationStatus;
  appliedAt: string;
  coverLetter: string;
  proposedRate?: number;
  estimatedDuration?: string;
  portfolio?: Portfolio[];
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: string;
}

// Wallet & Transaction Types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  escrowBalance: number;
  totalEarnings: number;
  totalSpent: number;
  pendingWithdrawals: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  reference?: string;
  jobId?: string;
  createdAt: string;
  completedAt?: string;
  fee?: number;
  metadata?: Record<string, any>;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'bank_account' | 'paypal' | 'stripe' | 'crypto';
  details: Record<string, any>;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

// Analytics & Reporting Types
export interface Analytics {
  overview: OverviewStats;
  userStats: UserStats;
  jobStats: JobStats;
  walletStats: WalletStats;
  referralStats: ReferralStats;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface OverviewStats {
  totalUsers: number;
  totalWorkers: number;
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalTransactions: number;
  totalRevenue: number;
}

export interface UserStats {
  newUsers: number;
  activeUsers: number;
  usersByRole: Record<UserRole, number>;
  usersByStatus: Record<UserStatus, number>;
  userGrowth: ChartData[];
  topReferrers: ReferralData[];
}

export interface JobStats {
  jobsPosted: number;
  jobsCompleted: number;
  averageJobValue: number;
  jobsByCategory: Record<string, number>;
  jobsByStatus: Record<JobStatus, number>;
  jobCompletionRate: number;
  averageTimeToComplete: number;
}

export interface WalletStats {
  totalWalletBalance: number;
  totalTransactionVolume: number;
  averageTransactionValue: number;
  transactionsByType: Record<TransactionType, number>;
  revenueGrowth: ChartData[];
  topSpenders: UserSpendingData[];
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  referralConversionRate: number;
  totalReferralRewards: number;
  topReferrers: ReferralData[];
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface ReferralData {
  userId: string;
  userName: string;
  referralCount: number;
  successfulReferrals: number;
  totalRewards: number;
}

export interface UserSpendingData {
  userId: string;
  userName: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

// Filter and Search Types
export interface UserFilters {
  role?: UserRole[];
  status?: UserStatus[];
  verification?: VerificationStatus[];
  dateJoined?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface JobFilters {
  status?: JobStatus[];
  category?: string[];
  location?: string[];
  payRange?: {
    min: number;
    max: number;
  };
  skills?: string[];
  companyId?: string;
  search?: string;
}

export interface TransactionFilters {
  type?: TransactionType[];
  status?: TransactionStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  userId?: string;
  search?: string;
}

// Form Types
export interface CreateJobForm {
  title: string;
  description: string;
  requiredSkills: string[];
  optionalSkills: string[];
  location: JobLocation;
  payRate: PayRate;
  category: string;
  experienceLevel: string;
  jobType: string;
  duration?: string;
  deadline?: string;
  benefits?: string[];
  requirements: string[];
}

export interface UpdateUserForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: UserStatus;
  role?: UserRole;
}

// Admin Action Types
export interface AdminAction {
  id: string;
  adminId: string;
  action: string;
  targetType: 'user' | 'job' | 'company' | 'transaction';
  targetId: string;
  details: Record<string, any>;
  timestamp: string;
  reason?: string;
}
