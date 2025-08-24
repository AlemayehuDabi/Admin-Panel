import { Search, X } from 'lucide-react';
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
import { CalendarIcon } from 'lucide-react';
import type { UserFilters as UserFiltersType } from '../types';
import { useState } from 'react';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  onClearFilters: () => void;
}

export function UserFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: UserFiltersProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };

  const handleRoleChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, role: undefined });
    } else {
      onFiltersChange({ ...filters, role: [value as any] });
    }
  };

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, status: undefined });
    } else {
      onFiltersChange({ ...filters, status: [value as any] });
    }
  };

  const handleVerificationChange = (value: string) => {
    if (value === 'all') {
      onFiltersChange({ ...filters, verification: undefined });
    } else {
      onFiltersChange({ ...filters, verification: [value as any] });
    }
  };

  const handleDateRangeChange = () => {
    if (dateFrom && dateTo) {
      onFiltersChange({
        ...filters,
        dateJoined: {
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
                placeholder="Search by email, name, or referral code..."
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
              value={filters.role?.[0] || 'all'}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="worker">Worker</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="user">User</SelectItem>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.verification?.[0] || 'all'}
              onValueChange={handleVerificationChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

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
              {filters.role && (
                <Badge variant="secondary">
                  Role: {filters.role[0]}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleRoleChange('all')}
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
              {filters.verification && (
                <Badge variant="secondary">
                  Verification: {filters.verification[0]}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => handleVerificationChange('all')}
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
