import { Users, Briefcase, DollarSign, Target } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAnalytics } from '../hooks/useApi';

export function Analytics() {
  const { data: analyticsData, isLoading, error } = useAnalytics();

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics & Reporting
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and reporting for platform insights.
          </p>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error Loading Analytics
            </h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the analytics data. Please try again
              later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const analytics = analyticsData?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics & Reporting
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and reporting for platform insights.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? '---'
                : analytics?.overview.totalUsers.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +{isLoading ? '--' : analytics?.userStats.newUsers || '0'} this
              month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? '---'
                : analytics?.overview.activeJobs.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? '--'
                : analytics?.overview.completedJobs.toLocaleString() ||
                  '0'}{' '}
              completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {isLoading
                ? '---'
                : (analytics?.overview.totalRevenue / 1000000).toFixed(1) +
                    'M' || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Job Completion Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? '--%'
                : analytics?.jobStats.jobCompletionRate.toFixed(1) + '%' ||
                  '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Above industry average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by role and status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                      <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-2 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(analytics?.userStats.usersByRole || {}).map(
                  ([role, count]) => (
                    <div key={role} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{role}s</span>
                        <span className="font-medium">
                          {count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={
                          (count / (analytics?.overview.totalUsers || 1)) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Categories</CardTitle>
            <CardDescription>Most popular job categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-6 w-12 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(analytics?.jobStats.jobsByCategory || {}).map(
                  ([category, count]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm">{category}</span>
                      <Badge variant="secondary">
                        {count.toLocaleString()}
                      </Badge>
                    </div>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referral Program</CardTitle>
            <CardDescription>
              Referral statistics and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Total Referrals</span>
                  <span className="font-medium">
                    {analytics?.referralStats.totalReferrals.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Successful Referrals</span>
                  <span className="font-medium">
                    {analytics?.referralStats.successfulReferrals.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conversion Rate</span>
                  <span className="font-medium">
                    {analytics?.referralStats.referralConversionRate.toFixed(1)}
                    %
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Rewards Paid</span>
                  <span className="font-medium">
                    $
                    {analytics?.referralStats.totalReferralRewards.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Active Users</span>
                  <span className="font-medium">
                    {analytics?.userStats.activeUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Jobs Posted</span>
                  <span className="font-medium">
                    {analytics?.jobStats.jobsPosted.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Job Value</span>
                  <span className="font-medium">
                    ${analytics?.jobStats.averageJobValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Completion Time</span>
                  <span className="font-medium">
                    {analytics?.jobStats.averageTimeToComplete.toFixed(1)} days
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>
              Users generating the most referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {analytics?.referralStats.topReferrers
                  .slice(0, 5)
                  .map((referrer, index) => (
                    <div
                      key={referrer.userId}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{referrer.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {referrer.successfulReferrals}/
                          {referrer.referralCount} successful
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${referrer.totalRewards.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          rewards earned
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New company verified</p>
                  <p className="text-xs text-muted-foreground">
                    TechCorp Inc. completed verification
                  </p>
                </div>
                <Badge variant="secondary">5 min ago</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Large transaction processed
                  </p>
                  <p className="text-xs text-muted-foreground">
                    $5,000 payment completed
                  </p>
                </div>
                <Badge variant="secondary">12 min ago</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Job milestone reached</p>
                  <p className="text-xs text-muted-foreground">
                    E-commerce project 75% complete
                  </p>
                </div>
                <Badge variant="secondary">25 min ago</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Worker certification approved
                  </p>
                  <p className="text-xs text-muted-foreground">
                    React certification verified
                  </p>
                </div>
                <Badge variant="secondary">1 hour ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
