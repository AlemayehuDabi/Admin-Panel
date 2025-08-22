import type React from 'react';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Table, TableRow, TableCell } from '../components/ui/Table';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
}

// Mock API functions
const fetchGuests = async (): Promise<Guest[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      idNumber: 'ID123456',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      idNumber: 'ID123457',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      idNumber: 'ID123458',
    },
  ];
};

const addGuest = async (guest: Omit<Guest, 'id'>): Promise<Guest> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...guest, id: Date.now().toString() };
};

export default function Guests() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: '',
  });

  const queryClient = useQueryClient();

  const { data: guests, isLoading } = useQuery({
    queryKey: ['guests'],
    queryFn: fetchGuests,
  });

  const addGuestMutation = useMutation({
    mutationFn: addGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setIsModalOpen(false);
      setNewGuest({ name: '', email: '', phone: '', idNumber: '' });
    },
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    addGuestMutation.mutate(newGuest);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading guests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guests</h1>
          <p className="text-slate-600">Manage guest information</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add New Guest</Button>
      </div>

      <Card>
        <Table headers={['Name', 'Email', 'Phone', 'ID Number']}>
          {guests?.map((guest) => (
            <TableRow key={guest.id}>
              <TableCell>{guest.name}</TableCell>
              <TableCell>{guest.email}</TableCell>
              <TableCell>{guest.phone}</TableCell>
              <TableCell>{guest.idNumber}</TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Guest"
      >
        <form onSubmit={handleAddGuest} className="space-y-4">
          <Input
            label="Full Name"
            value={newGuest.name}
            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newGuest.email}
            onChange={(e) =>
              setNewGuest({ ...newGuest, email: e.target.value })
            }
            required
          />
          <Input
            label="Phone"
            value={newGuest.phone}
            onChange={(e) =>
              setNewGuest({ ...newGuest, phone: e.target.value })
            }
            required
          />
          <Input
            label="ID Number"
            value={newGuest.idNumber}
            onChange={(e) =>
              setNewGuest({ ...newGuest, idNumber: e.target.value })
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
            <Button type="submit" disabled={addGuestMutation.isPending}>
              {addGuestMutation.isPending ? 'Adding...' : 'Add Guest'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
