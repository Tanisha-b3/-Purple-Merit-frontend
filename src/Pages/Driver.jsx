import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../Components/ui/button';
import { Input } from '../Components/ui/input';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../Components/ui/dialog';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '../Components/ui/table';
import { Label } from '../Components/ui/label';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    currentShiftHours: '',
    pastWeekHours: ''
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/drivers');
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({ title: 'Error', description: 'Failed to load drivers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({ _id: '', name: '', currentShiftHours: '', pastWeekHours: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (driver) => {
    setFormData({
      ...driver,
      pastWeekHours: driver.pastWeekHours?.join(', ') || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drivers/${id}`);
      toast({ title: 'Success', description: 'Driver deleted successfully' });
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast({ title: 'Error', description: 'Failed to delete driver', variant: 'destructive' });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Driver name is required', variant: 'destructive' });
      return;
    }

    try {
      const processedValues = {
        ...formData,
        pastWeekHours: formData.pastWeekHours
          ? formData.pastWeekHours.split(',').map(h => parseFloat(h.trim()))
          : []
      };

      setLoading(true);

      if (processedValues._id) {
        await axios.put(`http://localhost:5000/api/drivers/${processedValues._id}`, processedValues);
        toast({ title: 'Success', description: 'Driver updated successfully' });
      } else {
        await axios.post('http://localhost:5000/api/drivers', processedValues);
        toast({ title: 'Success', description: 'Driver added successfully' });
      }

      setIsDialogOpen(false);
      fetchDrivers();
    } catch (error) {
      console.error('Error saving driver:', error);
      toast({ title: 'Error', description: error.response?.data?.message || 'Failed to save driver', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <Button onClick={handleAdd}>Add Driver</Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Current Shift Hours</TableHead>
              <TableHead>Past Week Hours</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map(driver => (
              <TableRow key={driver._id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.currentShiftHours || 'N/A'}</TableCell>
                <TableCell>{driver.pastWeekHours?.join(', ') || 'N/A'}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="link" onClick={() => handleEdit(driver)}>Edit</Button>
                  <Button variant="link" className="text-red-500" onClick={() => handleDelete(driver._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{formData._id ? 'Edit Driver' : 'Add Driver'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label>Current Shift Hours</Label>
              <Input
                type="number"
                value={formData.currentShiftHours}
                onChange={(e) => setFormData(prev => ({ ...prev, currentShiftHours: e.target.value }))}
              />
            </div>
            <div>
              <Label>Past Week Hours (comma separated)</Label>
              <Input
                placeholder="e.g., 8, 7.5, 9, 8, 8.5, 7, 8"
                value={formData.pastWeekHours}
                onChange={(e) => setFormData(prev => ({ ...prev, pastWeekHours: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
