import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  DollarSign
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DepartmentTable = () => {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    mealBudget: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchDepartments();
  }, [user, navigate]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_URL}/department`);
      const data = await response.json();
      
      if (data.status === "success") {
        setDepartments(data.result);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mealBudget: formData.mealBudget ? parseFloat(formData.mealBudget) : null
        }),
      });

      const data = await response.json();
      
      if (data.status === "created") {
        setDepartments([...departments, data.result]);
        setIsCreateOpen(false);
        setFormData({ name: '', description: '', manager: '', mealBudget: '' });
      } else {
        alert(data.error || 'Failed to create department');
      }
    } catch (error) {
      console.error("Error creating department:", error);
      alert('Failed to create department');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/department/${selectedDepartment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mealBudget: formData.mealBudget ? parseFloat(formData.mealBudget) : null
        }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        setDepartments(departments.map(dept => 
          dept.id === selectedDepartment.id ? data.result : dept
        ));
        setIsEditOpen(false);
        setSelectedDepartment(null);
        setFormData({ name: '', description: '', manager: '', mealBudget: '' });
      } else {
        alert(data.error || 'Failed to update department');
      }
    } catch (error) {
      console.error("Error updating department:", error);
      alert('Failed to update department');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      const response = await fetch(`${API_URL}/department/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.status === "success") {
        fetchDepartments(); // Refresh the list
      } else {
        alert(data.error || 'Failed to delete department');
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      alert('Failed to delete department');
    }
  };

  const openEditDialog = (department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      description: department.description || '',
      manager: department.manager || '',
      mealBudget: department.mealBudget || ''
    });
    setIsEditOpen(true);
  };

  if (user?.role !== "admin") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Loading departments...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Department Management</h1>
              <p className="text-slate-600">Manage office departments and meal budgets</p>
            </div>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Add a new department to organize users and manage meal budgets.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Department Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manager">Manager</Label>
                    <Input
                      id="manager"
                      value={formData.manager}
                      onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mealBudget">Monthly Meal Budget ($)</Label>
                    <Input
                      id="mealBudget"
                      type="number"
                      step="0.01"
                      value={formData.mealBudget}
                      onChange={(e) => setFormData({ ...formData, mealBudget: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Department</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Departments Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-emerald-600" />
              Departments ({departments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {departments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg mb-2">No departments found</p>
                <p className="text-slate-400 text-sm">Create your first department to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Manager</TableHead>
                    <TableHead className="font-semibold">Users</TableHead>
                    <TableHead className="font-semibold">Budget</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div>
                          <p className="font-semibold text-slate-800">{department.name}</p>
                          {department.description && (
                            <p className="text-sm text-slate-500">{department.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {department.manager ? (
                          <span className="text-slate-700">{department.manager}</span>
                        ) : (
                          <span className="text-slate-400 italic">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-700">{department.users?.length || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {department.mealBudget ? (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="text-slate-700">${department.mealBudget.toLocaleString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={department.isActive ? "default" : "secondary"}>
                          {department.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(department)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(department.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update department information and settings.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Department Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-manager">Manager</Label>
                  <Input
                    id="edit-manager"
                    value={formData.manager}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-mealBudget">Monthly Meal Budget ($)</Label>
                  <Input
                    id="edit-mealBudget"
                    type="number"
                    step="0.01"
                    value={formData.mealBudget}
                    onChange={(e) => setFormData({ ...formData, mealBudget: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Department</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DepartmentTable;