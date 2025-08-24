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
import { CompanyTable } from '../components/CompanyTable';
import { UserDetails } from '../components/UserDetails';
import { useCompanies } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import { useState } from 'react';

export function CompanyManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const { selectedUser, setSelectedUser } = useAdminStore();

  const {
    data: companiesData,
    isLoading,
    error,
  } = useCompanies(currentPage, 10);

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && companiesData?.data) {
      setSelectedCompanies(companiesData.data.map((company) => company.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete companies:', selectedCompanies);
    setSelectedCompanies([]);
  };

  const handleExport = () => {
    console.log('Export companies');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Company Management
          </h1>
          <p className="text-muted-foreground">
            Manage company profiles, verification documents, and company-related
            activities.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Companies
            </h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the company data. Please try again
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
          <h1 className="text-3xl font-bold tracking-tight">
            Company Management
          </h1>
          <p className="text-muted-foreground">
            Manage company profiles, verification documents, and company-related
            activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Companies ({companiesData?.pagination.total || 0})
              </CardTitle>
              <CardDescription>
                {selectedCompanies.length > 0
                  ? `${selectedCompanies.length} compan${
                      selectedCompanies.length === 1 ? 'y' : 'ies'
                    } selected`
                  : 'Manage your platform companies'}
              </CardDescription>
            </div>
            {selectedCompanies.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedCompanies.length})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CompanyTable
            companies={companiesData?.data || []}
            isLoading={isLoading}
            selectedCompanies={selectedCompanies}
            onSelectCompany={handleSelectCompany}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
        {companiesData?.pagination &&
          companiesData.pagination.totalPages > 1 && (
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
                      length: Math.min(5, companiesData.pagination.totalPages),
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

                  {companiesData.pagination.totalPages > 5 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(
                          Math.min(
                            companiesData.pagination.totalPages,
                            currentPage + 1
                          )
                        )
                      }
                      className={
                        currentPage === companiesData.pagination.totalPages
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
