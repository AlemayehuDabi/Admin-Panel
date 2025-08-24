import { format } from 'date-fns';
import {
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import type { Company } from '../types';

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  selectedCompanies: string[];
  onSelectCompany: (companyId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function CompanyTable({
  companies,
  isLoading,
  selectedCompanies,
  onSelectCompany,
  onSelectAll,
}: CompanyTableProps) {
  const { setSelectedUser } = useAdminStore();

  const getInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getVerificationBadge = (verification: string) => {
    const variants = {
      verified: 'default',
      unverified: 'secondary',
      pending: 'outline',
      rejected: 'destructive',
    } as const;

    return (
      <Badge
        variant={variants[verification as keyof typeof variants] || 'secondary'}
      >
        {verification.charAt(0).toUpperCase() + verification.slice(1)}
      </Badge>
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
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Posted Jobs</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Date Joined</TableHead>
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
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
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
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
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
                  selectedCompanies.length === companies.length &&
                  companies.length > 0
                    ? true
                    : selectedCompanies.length > 0 &&
                      selectedCompanies.length < companies.length
                    ? 'indeterminate'
                    : false
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Posted Jobs</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              className="cursor-pointer"
              onClick={() => setSelectedUser(company)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedCompanies.includes(company.id)}
                  onCheckedChange={() => onSelectCompany(company.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="rounded-lg">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(company.companyName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{company.companyName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {company.address?.city}, {company.address?.country}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{company.industry || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                {getVerificationBadge(company.verification)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{company.postedJobs || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span>{(company.rating || 0).toFixed(1)}</span>
                  <span className="text-muted-foreground">★</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ${company.wallet.balance.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(company.dateJoined), 'MMM dd, yyyy')}
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
                    <DropdownMenuItem onClick={() => setSelectedUser(company)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Company
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Verification
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Verification
                    </DropdownMenuItem>
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
