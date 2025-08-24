import { Plus, Download, Trash2 } from 'lucide-react';
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
import { UserFilters } from '../components/UserFilters';
import { UserTable } from '../components/UserTable';
import { UserDetails } from '../components/UserDetails';
import { useUsers } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import type { UserFilters as UserFiltersType } from '../types';
import { useState } from 'react';

export function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { selectedUser, setSelectedUser, userFilters, setUserFilters } =
    useAdminStore();

  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers(userFilters, currentPage, 10);

  const handleFiltersChange = (filters: UserFiltersType) => {
    setUserFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setUserFilters({});
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && usersData?.data) {
      setSelectedUsers(usersData.data.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkDelete = () => {
    // Implement bulk delete functionality
    console.log('Bulk delete users:', selectedUsers);
    setSelectedUsers([]);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export users');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, approve registrations, and handle user-related tasks.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Users
            </h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the user data. Please try again later.
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, approve registrations, and handle user-related tasks.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <UserFilters
        filters={userFilters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({usersData?.pagination.total || 0})</CardTitle>
              <CardDescription>
                {selectedUsers.length > 0
                  ? `${selectedUsers.length} user${
                      selectedUsers.length === 1 ? '' : 's'
                    } selected`
                  : 'Manage your platform users'}
              </CardDescription>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedUsers.length})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <UserTable
            users={usersData?.data || []}
            isLoading={isLoading}
            selectedUsers={selectedUsers}
            onSelectUser={handleSelectUser}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
        {usersData?.pagination && usersData.pagination.totalPages > 1 && (
          <CardContent className="pt-0">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: Math.min(5, usersData.pagination.totalPages) },
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

                {usersData.pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          usersData.pagination.totalPages,
                          currentPage + 1
                        )
                      )
                    }
                    className={
                      currentPage === usersData.pagination.totalPages
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

      <UserDetails
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
