import type React from 'react';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Table, TableRow, TableCell } from '../components/ui/Table';

interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
}

// Mock API functions
const fetchBookings = async (): Promise<Booking[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      guestName: 'John Doe',
      roomNumber: '101',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18',
      status: 'confirmed',
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      roomNumber: '102',
      checkIn: '2024-01-16',
      checkOut: '2024-01-20',
      status: 'checked-in',
    },
    {
      id: '3',
      guestName: 'Bob Johnson',
      roomNumber: '103',
      checkIn: '2024-01-10',
      checkOut: '2024-01-14',
      status: 'checked-out',
    },
  ];
};

const addBooking = async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...booking, id: Date.now().toString() };
};

const updateBookingStatus = async ({
  id,
  status,
}: {
  id: string;
  status: Booking['status'];
}): Promise<Booking> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id, status } as Booking;
};

export default function Bookings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: '',
    checkOut: '',
    status: 'confirmed' as Booking['status'],
  });

  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  });

  const addBookingMutation = useMutation({
    mutationFn: addBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setIsModalOpen(false);
      setNewBooking({
        guestName: '',
        roomNumber: '',
        checkIn: '',
        checkOut: '',
        status: 'confirmed',
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    addBookingMutation.mutate(newBooking);
  };

  const handleStatusChange = (id: string, status: Booking['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'checked-in':
        return 'text-green-600 bg-green-100';
      case 'checked-out':
        return 'text-slate-600 bg-slate-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-slate-600">Manage guest bookings</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add New Booking</Button>
      </div>

      <Card>
        <Table
          headers={[
            'Guest',
            'Room',
            'Check In',
            'Check Out',
            'Status',
            'Actions',
          ]}
        >
          {bookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.guestName}</TableCell>
              <TableCell>{booking.roomNumber}</TableCell>
              <TableCell>
                {new Date(booking.checkIn).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(booking.checkOut).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status}
                </span>
              </TableCell>
              <TableCell>
                <select
                  value={booking.status}
                  onChange={(e) =>
                    handleStatusChange(
                      booking.id,
                      e.target.value as Booking['status']
                    )
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Booking"
      >
        <form onSubmit={handleAddBooking} className="space-y-4">
          <Input
            label="Guest Name"
            value={newBooking.guestName}
            onChange={(e) =>
              setNewBooking({ ...newBooking, guestName: e.target.value })
            }
            required
          />
          <Input
            label="Room Number"
            value={newBooking.roomNumber}
            onChange={(e) =>
              setNewBooking({ ...newBooking, roomNumber: e.target.value })
            }
            required
          />
          <Input
            label="Check In Date"
            type="date"
            value={newBooking.checkIn}
            onChange={(e) =>
              setNewBooking({ ...newBooking, checkIn: e.target.value })
            }
            required
          />
          <Input
            label="Check Out Date"
            type="date"
            value={newBooking.checkOut}
            onChange={(e) =>
              setNewBooking({ ...newBooking, checkOut: e.target.value })
            }
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={addBookingMutation.isPending}>
              {addBookingMutation.isPending ? 'Adding...' : 'Add Booking'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
