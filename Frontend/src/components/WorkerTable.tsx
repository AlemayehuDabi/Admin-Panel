import {
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Star,
  Briefcase,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
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
import type { Worker } from '../types';

interface WorkerTableProps {
  workers: Worker[];
  isLoading: boolean;
  selectedWorkers: string[];
  onSelectWorker: (workerId: string) => void;
  onSelectAll: (checked: boolean) => void;
}

export function WorkerTable({
  workers,
  isLoading,
  selectedWorkers,
  onSelectWorker,
  onSelectAll,
}: WorkerTableProps) {
  const { setSelectedUser } = useAdminStore();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getSkillBadges = (skills: any[]) => {
    const topSkills = skills.slice(0, 3);
    return (
      <div className="flex flex-wrap gap-1">
        {topSkills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {skill.name}
          </Badge>
        ))}
        {skills.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{skills.length - 3}
          </Badge>
        )}
      </div>
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
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
              <TableHead>Worker</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Hourly Rate</TableHead>
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
                  <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
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
                  selectedWorkers.length === workers.length &&
                  workers.length > 0
                    ? true
                    : selectedWorkers.length > 0 &&
                      selectedWorkers.length < workers.length
                    ? 'indeterminate'
                    : false
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Worker</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Hourly Rate</TableHead>
            <TableHead>Wallet Balance</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker) => (
            <TableRow
              key={worker.id}
              className="cursor-pointer"
              onClick={() => setSelectedUser(worker)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedWorkers.includes(worker.id)}
                  onCheckedChange={() => onSelectWorker(worker.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={worker.profileImage || '/placeholder.svg'}
                    />
                    <AvatarFallback>
                      {getInitials(worker.firstName, worker.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {worker.firstName} {worker.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {worker.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getSkillBadges(worker.skills || [])}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{worker.experience?.length || 0} roles</span>
                </div>
              </TableCell>
              <TableCell>{getRatingStars(worker.rating || 0)}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    worker.availability?.isAvailable ? 'default' : 'secondary'
                  }
                >
                  {worker.availability?.isAvailable
                    ? 'Available'
                    : 'Unavailable'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-medium">${worker.hourlyRate || 0}/hr</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  ${worker.wallet.balance.toLocaleString()}
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
                    <DropdownMenuItem onClick={() => setSelectedUser(worker)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Certifications
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="mr-2 h-4 w-4" />
                      Review Portfolio
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
