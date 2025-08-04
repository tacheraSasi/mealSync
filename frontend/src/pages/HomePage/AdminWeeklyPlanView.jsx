import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Users, Calendar, TrendingUp, Sparkles } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const AdminWeeklyPlanView = () => {
  const [weeklyPlans, setWeeklyPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeeklyPlans();
  }, []);

  const fetchWeeklyPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/weeklyMealPlan`);
      if (!response.ok) {
        throw new Error('Failed to fetch weekly meal plans');
      }
      const data = await response.json();
      if (data.status === 'success') {
        setWeeklyPlans(data.result || []);
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('Error fetching weekly plans:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportWeeklyPlans = async () => {
    try {
      // Make API call to get export data
      const response = await fetch(`${API_URL}/weeklyMealPlan/export`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create download link
      const filename = `weekly-meal-plans-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
      saveAs(blob, filename);
    } catch (err) {
      console.error('Error exporting weekly plans:', err);
      // Fallback to client-side export if backend export fails
      exportWeeklyPlansClientSide();
    }
  };

  const exportWeeklyPlansClientSide = () => {
    // Group data by user and day
    const userData = {};
    
    weeklyPlans.forEach(plan => {
      if (!userData[plan.username]) {
        userData[plan.username] = {
          Username: plan.username,
          Monday: '-',
          Tuesday: '-',
          Wednesday: '-',
          Thursday: '-',
          Friday: '-'
        };
      }
      userData[plan.username][plan.dayOfWeek] = plan.mealName;
    });

    const data = Object.values(userData);

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Meal Plans');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    saveAs(blob, `weekly-meal-plans-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  // Group plans by user
  const plansByUser = weeklyPlans.reduce((acc, plan) => {
    if (!acc[plan.username]) {
      acc[plan.username] = {};
    }
    acc[plan.username][plan.dayOfWeek] = plan.mealName;
    return acc;
  }, {});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container py-8">
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-100">
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                </div>
                Weekly Meal Plans - Admin View
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-slate-700">Loading Weekly Plans</h3>
                  <p className="text-slate-500">Fetching the latest meal planning data...</p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container py-8">
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
              <CardTitle className="text-red-700">Weekly Meal Plans - Admin View</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-red-700">Oops! Something went wrong</h3>
                  <p className="text-red-600">{error}</p>
                </div>
                <Button onClick={fetchWeeklyPlans} className="bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userCount = Object.keys(plansByUser).length;
  const totalSelections = weeklyPlans.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-emerald-200 shadow-lg">
            <Calendar className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Weekly Meal Plans Dashboard
            </h1>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Comprehensive overview of all employee meal selections for the upcoming week
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-emerald-800">{userCount}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Selections</p>
                  <p className="text-3xl font-bold text-blue-800">{totalSelections}</p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Planning Rate</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {userCount > 0 ? Math.round((userCount / userCount) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Next Week&apos;s Meal Selections
                </CardTitle>
                <p className="text-slate-600">
                  Detailed breakdown of employee meal choices ({userCount} users planning)
                </p>
              </div>
              <Button 
                onClick={exportWeeklyPlans} 
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 shrink-0"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {weeklyPlans.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-10 w-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-600">No meal plans yet</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    No weekly meal plans have been submitted for next week. 
                    Employees can submit their plans on Fridays.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/70">
                      <TableHead className="font-bold text-slate-700 py-4 px-6 w-40">
                        Employee
                      </TableHead>
                      {daysOfWeek.map(day => (
                        <TableHead key={day} className="text-center font-bold text-slate-700 py-4 px-4 min-w-48">
                          <div className="flex items-center justify-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {day}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(plansByUser).map(([username, userPlans], index) => (
                      <TableRow 
                        key={username} 
                        className="hover:bg-slate-50/50 transition-colors duration-200 group"
                        style={{ 
                          animation: `fade-in-up 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <TableCell className="font-semibold text-slate-800 py-4 px-6 bg-slate-50/30 group-hover:bg-slate-50/60 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-emerald-700">
                                {username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {username}
                          </div>
                        </TableCell>
                        {daysOfWeek.map(day => (
                          <TableCell key={day} className="text-center py-4 px-4">
                            {userPlans[day] ? (
                              <Badge 
                                variant="secondary" 
                                className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300 text-xs py-1.5 px-3 font-medium hover:shadow-md transition-all duration-200"
                              >
                                {userPlans[day]}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-sm font-medium">
                                No selection
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWeeklyPlanView;
