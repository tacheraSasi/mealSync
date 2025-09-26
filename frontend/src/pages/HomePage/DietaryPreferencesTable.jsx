import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Leaf, 
  Plus, 
  Edit, 
  Trash2, 
  User
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DIETARY_PREFERENCES = [
  'vegetarian',
  'vegan',
  'halal',
  'kosher',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'shellfish-free',
  'soy-free',
  'low-sodium',
  'diabetic',
  'keto',
  'paleo',
  'other'
];

const DietaryPreferencesTable = () => {
  const [preferences, setPreferences] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    preference: '',
    description: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [preferencesResponse, usersResponse] = await Promise.all([
        fetch(`${API_URL}/dietaryPreference`),
        fetch(`${API_URL}/user`)
      ]);
      
      const preferencesData = await preferencesResponse.json();
      const usersData = await usersResponse.json();
      
      if (preferencesData.status === "success") {
        setPreferences(preferencesData.result);
      }
      
      if (usersData.status === "success") {
        setUsers(usersData.result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/dietaryPreference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: parseInt(formData.userId)
        }),
      });

      const data = await response.json();
      
      if (data.status === "created") {
        fetchData(); // Refresh the list
        setIsCreateOpen(false);
        setFormData({ userId: '', preference: '', description: '' });
      } else {
        alert(data.error || 'Failed to create dietary preference');
      }
    } catch (error) {
      console.error("Error creating dietary preference:", error);
      alert('Failed to create dietary preference');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/dietaryPreference/${selectedPreference.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        fetchData(); // Refresh the list
        setIsEditOpen(false);
        setSelectedPreference(null);
        setFormData({ userId: '', preference: '', description: '' });
      } else {
        alert(data.error || 'Failed to update dietary preference');
      }
    } catch (error) {
      console.error("Error updating dietary preference:", error);
      alert('Failed to update dietary preference');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this dietary preference?')) return;
    
    try {
      const response = await fetch(`${API_URL}/dietaryPreference/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.status === "success") {
        fetchData(); // Refresh the list
      } else {
        alert(data.error || 'Failed to delete dietary preference');
      }
    } catch (error) {
      console.error("Error deleting dietary preference:", error);
      alert('Failed to delete dietary preference');
    }
  };

  const openEditDialog = (preference) => {
    setSelectedPreference(preference);
    setFormData({
      userId: preference.userId.toString(),
      preference: preference.preference,
      description: preference.description || ''
    });
    setIsEditOpen(true);
  };

  const getUserName = (userId) => {
    const userData = users.find(u => u.id === userId);
    return userData ? userData.username : 'Unknown User';
  };

  const getPreferenceColor = (preference) => {
    const colors = {
      'vegetarian': 'bg-green-100 text-green-800',
      'vegan': 'bg-emerald-100 text-emerald-800',
      'halal': 'bg-blue-100 text-blue-800',
      'kosher': 'bg-purple-100 text-purple-800',
      'gluten-free': 'bg-orange-100 text-orange-800',
      'dairy-free': 'bg-yellow-100 text-yellow-800',
      'nut-free': 'bg-red-100 text-red-800',
      'shellfish-free': 'bg-pink-100 text-pink-800',
      'soy-free': 'bg-indigo-100 text-indigo-800',
      'low-sodium': 'bg-gray-100 text-gray-800',
      'diabetic': 'bg-cyan-100 text-cyan-800',
      'keto': 'bg-lime-100 text-lime-800',
      'paleo': 'bg-amber-100 text-amber-800',
      'other': 'bg-slate-100 text-slate-800'
    };
    return colors[preference] || colors['other'];
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
              <p className="text-slate-500">Loading dietary preferences...</p>
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
            <Leaf className="h-8 w-8 text-emerald-600" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dietary Preferences</h1>
              <p className="text-slate-600">Manage user dietary restrictions and preferences</p>
            </div>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Preference
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Dietary Preference</DialogTitle>
                <DialogDescription>
                  Add a dietary preference for a user to help with meal planning.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="userId">User</Label>
                    <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.username} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="preference">Dietary Preference</Label>
                    <Select value={formData.preference} onValueChange={(value) => setFormData({ ...formData, preference: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIETARY_PREFERENCES.map((pref) => (
                          <SelectItem key={pref} value={pref}>
                            {pref.charAt(0).toUpperCase() + pref.slice(1).replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Additional details about the dietary preference..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Preference</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Preferences Table */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              Dietary Preferences ({preferences.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {preferences.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Leaf className="h-12 w-12 text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg mb-2">No dietary preferences found</p>
                <p className="text-slate-400 text-sm">Add dietary preferences to help with meal planning</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Preference</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preferences.map((preference) => (
                    <TableRow key={preference.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium text-slate-800">
                            {getUserName(preference.userId)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPreferenceColor(preference.preference)}>
                          {preference.preference.charAt(0).toUpperCase() + preference.preference.slice(1).replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {preference.description ? (
                          <span className="text-slate-700">{preference.description}</span>
                        ) : (
                          <span className="text-slate-400 italic">No description</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={preference.isActive ? "default" : "secondary"}>
                          {preference.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(preference)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(preference.id)}
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
              <DialogTitle>Edit Dietary Preference</DialogTitle>
              <DialogDescription>
                Update the dietary preference information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-preference">Dietary Preference</Label>
                  <Select value={formData.preference} onValueChange={(value) => setFormData({ ...formData, preference: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIETARY_PREFERENCES.map((pref) => (
                        <SelectItem key={pref} value={pref}>
                          {pref.charAt(0).toUpperCase() + pref.slice(1).replace('-', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details about the dietary preference..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Preference</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DietaryPreferencesTable;