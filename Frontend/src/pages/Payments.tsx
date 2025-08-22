import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/ui/Card';
import { Table, TableRow, TableCell } from '../components/ui/Table';

interface Payment {
  id: string;
  bookingId: string;
  guestName: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  date: string;
}

// Mock API functions
const fetchPayments = async (): Promise<Payment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      bookingId: 'B001',
      guestName: 'John Doe',
      amount: 240,
      status: 'paid',
      date: '2024-01-15',
    },
    {
      id: '2',
      bookingId: 'B002',
      guestName: 'Jane Smith',
      amount: 480,
      status: 'pending',
      date: '2024-01-16',
    },
    {
      id: '3',
      bookingId: 'B003',
      guestName: 'Bob Johnson',
      amount: 320,
      status: 'paid',
      date: '2024-01-10',
    },
    {
      id: '4',
      bookingId: 'B004',
      guestName: 'Alice Brown',
      amount: 160,
      status: 'failed',
      date: '2024-01-12',
    },
  ];
};

const updatePaymentStatus = async ({
  id,
  status,
}: {
  id: string;
  status: Payment['status'];
}): Promise<Payment> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id, status } as Payment;
};

export default function Payments() {
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });

  const handleStatusChange = (id: string, status: Payment['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
        <p className="text-slate-600">Track and manage payment transactions</p>
      </div>

      <Card>
        <Table
          headers={[
            'Booking ID',
            'Guest',
            'Amount',
            'Date',
            'Status',
            'Actions',
          ]}
        >
          {payments?.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.bookingId}</TableCell>
              <TableCell>{payment.guestName}</TableCell>
              <TableCell>${payment.amount}</TableCell>
              <TableCell>
                {new Date(payment.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {payment.status}
                </span>
              </TableCell>
              <TableCell>
                <select
                  value={payment.status}
                  onChange={(e) =>
                    handleStatusChange(
                      payment.id,
                      e.target.value as Payment['status']
                    )
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  disabled={updateStatusMutation.isPending}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
}
