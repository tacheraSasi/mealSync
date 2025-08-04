import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
      <Card>
        <CardHeader>
          <CardTitle>Weekly Meal Plans - Admin View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading weekly meal plans...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Meal Plans - Admin View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 text-center py-8">
            Error: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const userCount = Object.keys(plansByUser).length;
  const totalSelections = weeklyPlans.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Weekly Meal Plans - Admin View</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Next week&apos;s meal selections ({userCount} users, {totalSelections} total selections)
            </p>
          </div>
          <Button onClick={exportWeeklyPlans} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </CardHeader>
        <CardContent>
          {weeklyPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No weekly meal plans found for next week.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">User</TableHead>
                    {daysOfWeek.map(day => (
                      <TableHead key={day} className="text-center min-w-40">
                        {day}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(plansByUser).map(([username, userPlans]) => (
                    <TableRow key={username}>
                      <TableCell className="font-medium">{username}</TableCell>
                      {daysOfWeek.map(day => (
                        <TableCell key={day} className="text-center">
                          {userPlans[day] ? (
                            <Badge variant="secondary" className="text-xs">
                              {userPlans[day]}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
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
  );
};

export default AdminWeeklyPlanView;
