import { format } from 'date-fns';
import {
  MoreHorizontal,
  Eye,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminStore } from '../store/adminStore';
import type { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  selectedTransactions: string[];
  onSelectTransaction: (transactionId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function TransactionTable({
  transactions,
  isLoading,
  selectedTransactions,
  onSelectTransaction,
  onSelectAll,
}: TransactionTableProps) {
  const { setSelectedTransaction } = useAdminStore();

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      completed: 'default',
      failed: 'destructive',
      cancelled: 'secondary',
    } as const;

    const colors = {
      pending:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      cancelled:
        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    } as const;

    return (
      <Badge
        className={colors[status as keyof typeof colors] || colors.pending}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      deposit:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      withdrawal:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      payment:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      refund:
        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      referral_bonus:
        'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      fee: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    } as const;

    return (
      <Badge className={colors[type as keyof typeof colors] || colors.fee}>
        {type.replace('_', ' ').charAt(0).toUpperCase() +
          type.replace('_', ' ').slice(1)}
      </Badge>
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'refund':
      case 'referral_bonus':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
      case 'payment':
      case 'fee':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const isIncoming = ['deposit', 'refund', 'referral_bonus'].includes(type);
    const sign = isIncoming ? '+' : '-';
    const color = isIncoming ? 'text-green-600' : 'text-red-600';

    return (
      <span className={`font-medium ${color}`}>
        {sign}${amount.toLocaleString()}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Transaction</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox disabled />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedTransactions.length === transactions.length &&
                  transactions.length > 0
                    ? true
                    : selectedTransactions.length > 0 &&
                      selectedTransactions.length < transactions.length
                    ? 'indeterminate'
                    : false
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.id}
              className="cursor-pointer"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedTransactions.includes(transaction.id)}
                  onCheckedChange={() => onSelectTransaction(transaction.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <div className="font-medium">
                      #{transaction.id.slice(0, 8)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.description}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  User #{transaction.userId.slice(0, 8)}
                </div>
              </TableCell>
              <TableCell>{getTypeBadge(transaction.type)}</TableCell>
              <TableCell>
                {formatAmount(transaction.amount, transaction.type)}
              </TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell>
                {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                {transaction.fee ? (
                  <span className="text-muted-foreground">
                    ${transaction.fee.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {transaction.status === 'pending' && (
                      <>
                        <DropdownMenuItem>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Process Transaction
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Cancel Transaction
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
