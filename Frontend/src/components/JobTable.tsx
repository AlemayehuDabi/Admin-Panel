import { format } from 'date-fns';
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Users,
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
import { useDeleteJob } from '../hooks/useApi';
import { useAdminStore } from '../store/adminStore';
import type { Job } from '../types';
import { toast } from 'sonner';

interface JobTableProps {
  jobs: Job[];
  isLoading: boolean;
  selectedJobs: string[];
  onSelectJob: (jobId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function JobTable({
  jobs,
  isLoading,
  selectedJobs,
  onSelectJob,
  onSelectAll,
}: JobTableProps) {
  const { setSelectedJob } = useAdminStore();
  const deleteJob = useDeleteJob();

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'secondary',
      active: 'default',
      paused: 'outline',
      completed: 'default',
      cancelled: 'destructive',
    } as const;

    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      active:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      paused:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    } as const;

    return (
      <Badge className={colors[status as keyof typeof colors] || colors.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSkillBadges = (skills: any[]) => {
    const topSkills = skills.slice(0, 2);
    return (
      <div className="flex flex-wrap gap-1">
        {topSkills.map((skill, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {skill.name}
          </Badge>
        ))}
        {skills.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{skills.length - 2}
          </Badge>
        )}
      </div>
    );
  };

  const handleDelete = async (job: Job) => {
    try {
      await deleteJob.mutateAsync(job.id);
      toast({
        title: 'Job Deleted',
        description: `${job.title} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete job. Please try again.',
        variant: 'destructive',
      });
    }
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
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Skills Required</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Pay Rate</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Posted Date</TableHead>
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
                    <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                    <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
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
                  selectedJobs.length === jobs.length && jobs.length > 0
                    ? true
                    : selectedJobs.length > 0 &&
                      selectedJobs.length < jobs.length
                    ? 'indeterminate'
                    : false
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Skills Required</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Pay Rate</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              className="cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedJobs.includes(job.id)}
                  onCheckedChange={() => onSelectJob(job.id)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {job.category}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {job.company?.companyName || 'Unknown'}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell>{getSkillBadges(job.requiredSkills || [])}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{job.location.type}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {job.payRate.type === 'hourly'
                      ? `$${job.payRate.amount}/hr`
                      : `$${job.payRate.amount}`}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{job.applications?.length || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(job.createdAt), 'MMM dd, yyyy')}
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
                    <DropdownMenuItem onClick={() => setSelectedJob(job)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Job
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(job)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Job
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
