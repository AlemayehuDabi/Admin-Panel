import { Search, X, CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import type { TransactionFilters as TransactionFiltersType } from '../types';
import { useState } from 'react';

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFiltersChange: (filters: TransactionFiltersType) => void;
  onClearFilters: () => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: TransactionFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleTypeChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, type: undefined });
    } else {
      onFiltersChange({ ...filters, type: [value as any] });
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, status: undefined });
    } else {
      onFiltersChange({ ...filters, status: [value as any] });
    }
  };

  const handleAmountRangeChange = (min: string, max: string) => {
    const minAmount = Number.parseFloat(min) || undefined;
    const maxAmount = Number.parseFloat(max) || undefined;

    if (minAmount || maxAmount) {
      onFiltersChange({
        ...filters,
        amountRange: {
          min: minAmount || 0,
          max: maxAmount || 999999,
        },
      });
    } else {
      onFiltersChange({ ...filters, amountRange: undefined });
    }
  };

  const handleDateRangeChange = () => {
    if (dateFrom && dateTo) {
      onFiltersChange({
        ...filters,
        dateRange: {
          start: dateFrom.toISOString(),
          end: dateTo.toISOString(),
        },
      });
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, transaction ID, or description..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              onClick={onClearFilters}
              disabled={activeFiltersCount === 0}
            >
              <X className="h-4 w-4 mr-2" />
              Clear ({activeFiltersCount})
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.type?.[0] || 'all'}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdrawal">Withdrawal</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="referral_bonus">Referral Bonus</SelectItem>
                <SelectItem value="fee">Fee</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status?.[0] || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="Min amount"
                type="number"
                className="w-[120px]"
                onChange={(e) =>
                  handleAmountRangeChange(
                    e.target.value,
                    filters.amountRange?.max?.toString() || ''
                  )
                }
              />
              <Input
                placeholder="Max amount"
                type="number"
                className="w-[120px]"
                onChange={(e) =>
                  handleAmountRangeChange(
                    filters.amountRange?.min?.toString() || '',
                    e.target.value
                  )
                }
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom && dateTo
                    ? `${format(dateFrom, 'MMM dd')} - ${format(
                        dateTo,
                        'MMM dd'
                      )}`
                    : 'Date Range'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Date</label>
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Date</label>
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      disabled={(date) => (dateFrom ? date < dateFrom : false)}
                    />
                  </div>
                  <Button onClick={handleDateRangeChange} className="w-full">
                    Apply Date Range
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary">
                  Search: {filters.search}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleSearchChange('')}
                  />
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary">
                  Type: {filters.type[0]}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleTypeChange('all')}
                  />
                </Badge>
              )}
              {filters.status && (
                <Badge variant="secondary">
                  Status: {filters.status[0]}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleStatusChange('all')}
                  />
                </Badge>
              )}
              {filters.amountRange && (
                <Badge variant="secondary">
                  Amount: ${filters.amountRange.min} - $
                  {filters.amountRange.max}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleAmountRangeChange('', '')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
