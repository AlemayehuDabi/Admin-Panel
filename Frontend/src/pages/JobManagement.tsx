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
import { JobTable } from '../components/JobTable';
import { useJobs } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import { useState } from 'react';

export function JobManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const { jobFilters } = useAdminStore();

  const {
    data: jobsData,
    isLoading,
    error,
  } = useJobs(jobFilters, currentPage, 10);

  const handleSelectJob = (jobId: string) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && jobsData?.data) {
      setSelectedJobs(jobsData.data.map((job) => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleBulkDelete = () => {
    console.log('Bulk delete jobs:', selectedJobs);
    setSelectedJobs([]);
  };

  const handleExport = () => {
    console.log('Export jobs');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
          <p className="text-muted-foreground">
            Manage job postings, applications, and job-related activities.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Jobs
            </h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the job data. Please try again later.
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
          <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
          <p className="text-muted-foreground">
            Manage job postings, applications, and job-related activities.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Jobs ({jobsData?.pagination.total || 0})</CardTitle>
              <CardDescription>
                {selectedJobs.length > 0
                  ? `${selectedJobs.length} job${
                      selectedJobs.length === 1 ? '' : 's'
                    } selected`
                  : 'Manage your platform jobs'}
              </CardDescription>
            </div>
            {selectedJobs.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedJobs.length})
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <JobTable
            jobs={jobsData?.data || []}
            isLoading={isLoading}
            selectedJobs={selectedJobs}
            onSelectJob={handleSelectJob}
            onSelectAll={handleSelectAll}
          />
        </CardContent>
        {jobsData?.pagination && jobsData.pagination.totalPages > 1 && (
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
                  { length: Math.min(5, jobsData.pagination.totalPages) },
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

                {jobsData.pagination.totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          jobsData.pagination.totalPages,
                          currentPage + 1
                        )
                      )
                    }
                    className={
                      currentPage === jobsData.pagination.totalPages
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
    </div>
  );
}
