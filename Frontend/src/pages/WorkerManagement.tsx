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
import { WorkerTable } from '../components/WorkerTable';
import { UserDetails } from '../components/UserDetails';
import { useWorkers } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import { useState } from 'react';

export function WorkerManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const { selectedUser, setSelectedUser } = useAdminStore();

  const { data: workersData, isLoading, error } = useWorkers(currentPage, 10);

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && workersData?.data) {
      setSelectedWorkers(workersData.data.map((worker) => worker.id));
    } else {
      setSelectedWorkers([]);
    }
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete workers:', selectedWorkers);
    setSelectedWorkers([]);
  };

  const handleExport = () => {
    console.log('Export workers');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Worker Management
          </h1>
          <p className="text-muted-foreground">
            Manage worker profiles, skills, certifications, and portfolios.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Workers
            </h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the worker data. Please try again
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
            Worker Management
          </h1>
          <p className="text-muted-foreground">
            Manage worker profiles, skills, certifications, and portfolios.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Worker
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Workers ({workersData?.pagination.total || 0})
              </CardTitle>
              <CardDescription>
                {selectedWorkers.length > 0
                  ? `${selectedWorkers.length} worker${
                      selectedWorkers.length === 1 ? '' : 's'
                    } selected`
                  : 'Manage your platform workers'}
              </CardDescription>
            </div>
            {selectedWorkers.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedWorkers.length})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <WorkerTable
            workers={workersData?.data || []}
            isLoading={isLoading}
            selectedWorkers={selectedWorkers}
            onSelectWorker={handleSelectWorker}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
        {workersData?.pagination && workersData.pagination.totalPages > 1 && (
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
                  { length: Math.min(5, workersData.pagination.totalPages) },
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

                {workersData.pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          workersData.pagination.totalPages,
                          currentPage + 1
                        )
                      )
                    }
                    className={
                      currentPage === workersData.pagination.totalPages
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
