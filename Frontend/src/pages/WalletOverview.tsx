import {
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionTable } from '../components/TransactionTable';
import { WalletBalanceAdjustment } from '../components/WalletBalanceAdjustment';
import { useTransactions, useAnalytics } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import type { TransactionFilters as TransactionFiltersType } from '../types';
import { useState } from 'react';

export function WalletOverview() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [showBalanceAdjustment, setShowBalanceAdjustment] = useState(false);
  const { transactionFilters, setTransactionFilters } = useAdminStore();

  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions(transactionFilters, currentPage, 10);
  const { data: analyticsData, isLoading: analyticsLoading } = useAnalytics();

  const handleFiltersChange = (filters: TransactionFiltersType) => {
    setTransactionFilters(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setTransactionFilters({});
    setCurrentPage(1);
  };

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && transactionsData?.data) {
      setSelectedTransactions(
        transactionsData.data.map((transaction) => transaction.id)
      );
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleExport = () => {
    console.log('Export transactions');
  };

  const walletStats = analyticsData?.data.walletStats;

  if (transactionsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Overview</h1>
          <p className="text-muted-foreground">
            Monitor wallet balances, transactions, and financial activities.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Wallet Data
            </h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the wallet data. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet Overview</h1>
          <p className="text-muted-foreground">
            Monitor wallet balances, transactions, and financial activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowBalanceAdjustment(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Adjust Balance
          </Button>
        </div>
      </div>

      {/* Wallet Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Wallet Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {analyticsLoading
                ? '---'
                : walletStats?.totalWalletBalance.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all user wallets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transaction Volume
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {analyticsLoading
                ? '---'
                : (walletStats?.totalTransactionVolume / 1000000).toFixed(1) +
                    'M' || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total transaction volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Transaction
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {analyticsLoading
                ? '---'
                : walletStats?.averageTransactionValue.toFixed(2) || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Spenders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsLoading
                ? '---'
                : walletStats?.topSpenders.length || '0'}
            </div>
            <p className="text-xs text-muted-foreground">High-value users</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Types</CardTitle>
            <CardDescription>Breakdown by transaction type</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(walletStats?.transactionsByType || {}).map(
                  ([type, count]) => (
                    <div
                      key={type}
                      className="flex justify-between items-center"
                    >
                      <span className="capitalize">
                        {type.replace('_', ' ')}
                      </span>
                      <span className="font-medium">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Spenders</CardTitle>
            <CardDescription>
              Users with highest transaction volumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {walletStats?.topSpenders.slice(0, 5).map((spender, index) => (
                  <div
                    key={spender.userId}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{spender.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {spender.transactionCount} transactions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${spender.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg: ${spender.averageTransaction.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionFilters
        filters={transactionFilters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Transactions ({transactionsData?.pagination.total || 0})
              </CardTitle>
              <CardDescription>
                {selectedTransactions.length > 0
                  ? `${selectedTransactions.length} transaction${
                      selectedTransactions.length === 1 ? '' : 's'
                    } selected`
                  : 'All platform transactions'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionTable
            transactions={transactionsData?.data || []}
            isLoading={transactionsLoading}
            selectedTransactions={selectedTransactions}
            onSelectTransaction={handleSelectTransaction}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
        {transactionsData?.pagination &&
          transactionsData.pagination.totalPages > 1 && (
            <CardContent className="pt-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        transactionsData.pagination.totalPages
                      ),
                    },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  )}

                  {transactionsData.pagination.totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            transactionsData.pagination.totalPages,
                            currentPage + 1
                          )
                        )
                      }
                      className={
                        currentPage === transactionsData.pagination.totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          )}
      </Card>

      <WalletBalanceAdjustment
        open={showBalanceAdjustment}
        onClose={() => setShowBalanceAdjustment(false)}
        userId="1" // This would be dynamic based on selected user
        currentBalance={2500} // This would come from selected user data
      />
    </div>
  );
}
