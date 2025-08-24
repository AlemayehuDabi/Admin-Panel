import { format } from 'date-fns';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Copy,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { User } from '../types';
import { toast } from 'sonner';

interface UserDetailsProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetails({ user, open, onClose }: UserDetailsProps) {
  if (!user) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard.`,
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>
            Comprehensive information about {user.firstName} {user.lastName}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profileImage || '/placeholder.svg'} />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(user.email, 'Email')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                  <Badge variant="outline">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {user.id}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(user.id, 'User ID')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Verification Status
                  </label>
                  <div>
                    <Badge
                      variant={
                        user.verification === 'verified' ? 'default' : 'outline'
                      }
                    >
                      {user.verification.charAt(0).toUpperCase() +
                        user.verification.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {user.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(user.phone!, 'Phone')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {user.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Address
                  </label>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <div>{user.address.street}</div>
                      <div>
                        {user.address.city}, {user.address.state}{' '}
                        {user.address.zipCode}
                      </div>
                      <div>{user.address.country}</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date Joined
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(user.dateJoined), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                {user.lastLogin && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Last Login
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(user.lastLogin), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Referral Information */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Referral Code
                </label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                    {user.referralCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      copyToClipboard(user.referralCode, 'Referral code')
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {user.referredBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Referred By
                  </label>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {user.referredBy}
                    </code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Current Balance
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      ${user.wallet.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Escrow Balance
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-semibold">
                      ${user.wallet.escrowBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Earnings
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-semibold text-green-600">
                      ${user.wallet.totalEarnings.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Total Spent
                  </label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg font-semibold text-red-600">
                      ${user.wallet.totalSpent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Last Updated
                </label>
                <div>
                  {format(
                    new Date(user.wallet.lastUpdated),
                    'MMM dd, yyyy HH:mm'
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 bg-transparent">
              Edit User
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              View Transactions
            </Button>
            {user.status === 'pending' && (
              <>
                <Button className="flex-1">Approve</Button>
                <Button variant="destructive" className="flex-1">
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
