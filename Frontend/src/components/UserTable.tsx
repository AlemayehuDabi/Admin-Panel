import { format } from 'date-fns';
import {
  MoreHorizontal,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Power,
  PowerOff,
  Key,
  LogOut,
  Copy,
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
import { useApproveUser, useRejectUser, useUpdateUser } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import type { User } from '../types';
import { toast } from 'sonner';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function UserTable({
  users,
  isLoading,
  selectedUsers,
  onSelectUser,
  onSelectAll,
}: UserTableProps) {
  const { setSelectedUser } = useAdminStore();
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();
  const updateUser = useUpdateUser();

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive',
      pending: 'outline',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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

  const getRoleBadge = (role: string) => {
    const colors = {
      admin:
        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      worker: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      company:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      user: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    } as const;

    return (
      <Badge className={colors[role as keyof typeof colors] || colors.user}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  const handleApprove = async (user: User) => {
    try {
      await approveUser.mutateAsync(user.id);
      toast({
        title: 'User Approved',
        description: `${user.firstName} ${user.lastName} has been approved.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (user: User) => {
    try {
      await rejectUser.mutateAsync({ id: user.id, reason: 'Admin rejection' });
      toast({
        title: 'User Rejected',
        description: `${user.firstName} ${user.lastName} has been rejected.`,
        variant: 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject user. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStatusToggle = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { status: newStatus },
      });
      toast({
        title: 'Status Updated',
        description: `User status changed to ${newStatus}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyReferralCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Copied',
      description: 'Referral code copied to clipboard.',
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Referral Code</TableHead>
              <TableHead>Date Joined</TableHead>
              <TableHead>Wallet Balance</TableHead>
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
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
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
                  selectedUsers.length === users.length && users.length > 0
                    ? true
                    : selectedUsers.length > 0 &&
                      selectedUsers.length < users.length
                    ? 'indeterminate'
                    : false
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Referral Code</TableHead>
            <TableHead>Date Joined</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              className="cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={user.profileImage || '/placeholder.svg'}
                    />
                    <AvatarFallback>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getStatusBadge(user.status)}</TableCell>
              <TableCell>{getVerificationBadge(user.verification)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {user.referralCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyReferralCode(user.referralCode);
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(user.dateJoined), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ${user.wallet.balance.toLocaleString()}
                </div>
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
                    <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit User
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {user.status === 'pending' && (
                      <>
                        <DropdownMenuItem onClick={() => handleApprove(user)}>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Approve User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReject(user)}>
                          <UserX className="mr-2 h-4 w-4" />
                          Reject User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                      {user.status === 'active' ? (
                        <>
                          <PowerOff className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      Force Logout
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
