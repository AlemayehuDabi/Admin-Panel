import type React from 'react';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { Table, TableRow, TableCell } from '../components/ui/Table';

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
}

// Mock API functions
const fetchRooms = async (): Promise<Room[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    { id: '1', number: '101', type: 'Single', price: 80, status: 'available' },
    { id: '2', number: '102', type: 'Double', price: 120, status: 'occupied' },
    { id: '3', number: '103', type: 'Suite', price: 200, status: 'available' },
    {
      id: '4',
      number: '201',
      type: 'Single',
      price: 80,
      status: 'maintenance',
    },
    { id: '5', number: '202', type: 'Double', price: 120, status: 'available' },
  ];
};

const addRoom = async (room: Omit<Room, 'id'>): Promise<Room> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...room, id: Date.now().toString() };
};

const updateRoomStatus = async ({
  id,
  status,
}: {
  id: string;
  status: Room['status'];
}): Promise<Room> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id, status } as Room;
};

export default function Rooms() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'Single',
    price: 0,
    status: 'available' as Room['status'],
  });

  const queryClient = useQueryClient();

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

  const addRoomMutation = useMutation({
    mutationFn: addRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setIsModalOpen(false);
      setNewRoom({ number: '', type: 'Single', price: 0, status: 'available' });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateRoomStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    addRoomMutation.mutate(newRoom);
  };

  const handleStatusChange = (id: string, status: Room['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'occupied':
        return 'text-red-600 bg-red-100';
      case 'maintenance':
        return 'text-amber-600 bg-amber-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rooms</h1>
          <p className="text-slate-600">Manage your guest house rooms</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add New Room</Button>
      </div>

      <Card>
        <Table headers={['Room Number', 'Type', 'Price', 'Status', 'Actions']}>
          {rooms?.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.number}</TableCell>
              <TableCell>{room.type}</TableCell>
              <TableCell>${room.price}/night</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    room.status
                  )}`}
                >
                  {room.status}
                </span>
              </TableCell>
              <TableCell>
                <select
                  value={room.status}
                  onChange={(e) =>
                    handleStatusChange(
                      room.id,
                      e.target.value as Room['status']
                    )
                  }
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Room"
      >
        <form onSubmit={handleAddRoom} className="space-y-4">
          <Input
            label="Room Number"
            value={newRoom.number}
            onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-1">
              Room Type
            </label>
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
            </select>
          </div>
          <Input
            label="Price per night"
            type="number"
            value={newRoom.price}
            onChange={(e) =>
              setNewRoom({ ...newRoom, price: Number(e.target.value) })
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
            <Button type="submit" disabled={addRoomMutation.isPending}>
              {addRoomMutation.isPending ? 'Adding...' : 'Add Room'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
