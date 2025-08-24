import { DollarSign, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdjustWalletBalance } from '../hooks/useApi';
import { useMemo, useState } from 'react';

interface WalletBalanceAdjustmentProps {
  open: boolean;
  onClose: () => void;
  userId?: string;
  currentBalance?: number;
}

export function WalletBalanceAdjustment({
  open,
  onClose,
  userId,
  currentBalance = 0,
}: WalletBalanceAdjustmentProps) {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>(
    'add'
  );
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const adjustBalance = useAdjustWalletBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !amount || !reason) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const adjustmentAmount = Number.parseFloat(amount);
    if (isNaN(adjustmentAmount) || adjustmentAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    const finalAmount =
      adjustmentType === 'subtract' ? -adjustmentAmount : adjustmentAmount;

    setIsLoading(true);
    try {
      await adjustBalance.mutateAsync({
        userId,
        amount: finalAmount,
        reason,
      });

      toast({
        title: 'Balance Adjusted',
        description: `Wallet balance has been ${
          adjustmentType === 'add' ? 'increased' : 'decreased'
        } by $${adjustmentAmount.toFixed(2)}.`,
      });

      // Reset form
      setAmount('');
      setReason('');
      setAdjustmentType('add');
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to adjust wallet balance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const newBalance = useMemo(() => {
    const adjustmentAmount = Number.parseFloat(amount) || 0;
    const finalAmount =
      adjustmentType === 'subtract' ? -adjustmentAmount : adjustmentAmount;
    return currentBalance + finalAmount;
  }, [currentBalance, amount, adjustmentType]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Wallet Balance</DialogTitle>
          <DialogDescription>
            Manually adjust the user's wallet balance. This action will be
            logged for audit purposes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Current Balance</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                ${currentBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adjustment-type">Adjustment Type</Label>
            <Select
              value={adjustmentType}
              onValueChange={(value: 'add' | 'subtract') =>
                setAdjustmentType(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-green-600" />
                    Add to Balance
                  </div>
                </SelectItem>
                <SelectItem value="subtract">
                  <div className="flex items-center gap-2">
                    <Minus className="h-4 w-4 text-red-600" />
                    Subtract from Balance
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>New Balance (Preview)</Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span
                className={`font-medium ${
                  newBalance < 0 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                ${newBalance.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment</Label>
            <Textarea
              id="reason"
              placeholder="Explain why this balance adjustment is necessary..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Adjust Balance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
