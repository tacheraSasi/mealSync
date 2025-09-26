import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Utensils, 
  Calendar,
  Leaf,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DashboardOverview = ({ setActive }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    departments: 0,
    totalUsers: 0,
    activeMeals: 0,
    weeklyPlans: 0,
    dietaryPreferences: 0
  });
  const [popularMeals, setPopularMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch basic stats
      const [departmentsRes, usersRes, mealsRes, preferencesRes] = await Promise.all([
        fetch(`${API_URL}/department`),
        fetch(`${API_URL}/user`),
        fetch(`${API_URL}/mealTemplate`),
        fetch(`${API_URL}/dietaryPreference`)
      ]);

      const [departments, users, meals, preferences] = await Promise.all([
        departmentsRes.json(),
        usersRes.json(),
        mealsRes.json(),
        preferencesRes.json()
      ]);

      setStats({
        departments: departments.status === 'success' ? departments.result.length : 0,
        totalUsers: users.status === 'success' ? users.result.length : 0,
        activeMeals: meals.status === 'success' ? meals.result.filter(m => m.isActive).length : 0,
        dietaryPreferences: preferences.status === 'success' ? preferences.result.length : 0
      });

      // Set popular meals (top rated ones)
      if (meals.status === 'success') {
        const topMeals = meals.result
          .filter(m => m.isActive && m.averageRating > 0)
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 5);
        setPopularMeals(topMeals);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, description, color = "text-gray-600" }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          </div>
          <div className={`w-12 h-12 rounded-full bg-opacity-10 flex items-center justify-center ${color === 'text-emerald-600' ? 'bg-emerald-600' : color === 'text-blue-600' ? 'bg-blue-600' : color === 'text-purple-600' ? 'bg-purple-600' : 'bg-gray-600'}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const resetActiveState = (activeKey) => ({
    menu: false,
    user: false,
    choice: false,
    weeklyPlans: false,
    departments: false,
    dietaryPreferences: false,
    [activeKey]: true
  });

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to MealSync</h1>
            <p className="text-slate-600 mb-8">Your comprehensive office meal management system</p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/weekly-planning')}>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Weekly Meal Planning</h3>
                  <p className="text-slate-600 mb-4">Plan your meals for the upcoming week</p>
                  <Badge className="bg-emerald-100 text-emerald-800">Available Fridays</Badge>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Dietary Preferences</h3>
                  <p className="text-slate-600 mb-4">Meals tailored to your dietary needs</p>
                  <Badge className="bg-green-100 text-green-800">Smart Matching</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Loading dashboard...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MealSync Dashboard</h1>
          <p className="text-slate-600">Comprehensive overview of your office meal management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Building2}
            title="Departments"
            value={stats.departments}
            description="Active departments"
            color="text-blue-600"
          />
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            description="Registered users"
            color="text-emerald-600"
          />
          <StatCard
            icon={Utensils}
            title="Active Meals"
            value={stats.activeMeals}
            description="Available meal options"
            color="text-purple-600"
          />
          <StatCard
            icon={Leaf}
            title="Dietary Preferences"
            value={stats.dietaryPreferences}
            description="User preferences set"
            color="text-green-600"
          />
        </div>

        {/* Quick Actions & Popular Meals */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200"
                    onClick={() => setActive(resetActiveState('departments'))}
                  >
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Manage Departments</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200"
                    onClick={() => setActive(resetActiveState('dietaryPreferences'))}
                  >
                    <Leaf className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">Dietary Preferences</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200"
                    onClick={() => setActive(resetActiveState('menu'))}
                  >
                    <Utensils className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">Manage Menus</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200"
                    onClick={() => setActive(resetActiveState('weeklyPlans'))}
                  >
                    <Calendar className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm font-medium">Weekly Plans</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Meals */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Popular Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {popularMeals.length > 0 ? (
                  <div className="space-y-3">
                    {popularMeals.map((meal, index) => (
                      <div key={meal.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 truncate">{meal.name}</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-slate-500">{meal.averageRating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    <Star className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No rated meals yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">API Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Database</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Notifications</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;