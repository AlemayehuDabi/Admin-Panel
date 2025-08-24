import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import { useAnalytics } from '../hooks/useApi';

export function Dashboard() {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard. Here's what's happening on your
            platform.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Loading...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">---</div>
                <p className="text-xs text-muted-foreground">Loading data...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-red-500">
            Error loading dashboard data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: analytics?.data.overview.totalUsers.toLocaleString() || '0',
      description: '+12% from last month',
      icon: Users,
      trend: 'up',
    },
    {
      title: 'Active Workers',
      value: analytics?.data.overview.totalWorkers.toLocaleString() || '0',
      description: '+8% from last month',
      icon: Briefcase,
      trend: 'up',
    },
    {
      title: 'Companies',
      value: analytics?.data.overview.totalCompanies.toLocaleString() || '0',
      description: '+15% from last month',
      icon: Building2,
      trend: 'up',
    },
    {
      title: 'Active Jobs',
      value: analytics?.data.overview.activeJobs.toLocaleString() || '0',
      description: `${
        analytics?.data.overview.completedJobs.toLocaleString() || '0'
      } completed`,
      icon: MapPin,
      trend: 'neutral',
    },
    {
      title: 'Total Revenue',
      value:
        `$${(analytics?.data.overview.totalRevenue / 1000000).toFixed(1)}M` ||
        '$0',
      description: '+22% from last month',
      icon: DollarSign,
      trend: 'up',
    },
    {
      title: 'Transactions',
      value: analytics?.data.overview.totalTransactions.toLocaleString() || '0',
      description: 'This month',
      icon: Activity,
      trend: 'neutral',
    },
    {
      title: 'Job Completion Rate',
      value:
        `${analytics?.data.jobStats.jobCompletionRate.toFixed(1)}%` || '0%',
      description: 'Average completion rate',
      icon: TrendingUp,
      trend: 'up',
    },
    {
      title: 'Avg. Time to Complete',
      value:
        `${analytics?.data.jobStats.averageTimeToComplete.toFixed(1)} days` ||
        '0 days',
      description: 'Average project duration',
      icon: Clock,
      trend: 'neutral',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening on your
          platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {stat.trend === 'up' && (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                )}
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New company registration
                  </p>
                  <p className="text-xs text-muted-foreground">
                    TechCorp Inc. joined the platform
                  </p>
                </div>
                <Badge variant="secondary">2 min ago</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Job completed</p>
                  <p className="text-xs text-muted-foreground">
                    Full Stack Developer project finished
                  </p>
                </div>
                <Badge variant="secondary">15 min ago</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment processed</p>
                  <p className="text-xs text-muted-foreground">
                    $2,500 payment to John Doe
                  </p>
                </div>
                <Badge variant="secondary">1 hour ago</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Worker verification</p>
                  <p className="text-xs text-muted-foreground">
                    Sarah Wilson's portfolio approved
                  </p>
                </div>
                <Badge variant="secondary">2 hours ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid gap-2">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Review pending users</span>
                </div>
                <Badge variant="destructive">5</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">Verify companies</span>
                </div>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Review flagged jobs</span>
                </div>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Process withdrawals</span>
                </div>
                <Badge variant="secondary">8</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
