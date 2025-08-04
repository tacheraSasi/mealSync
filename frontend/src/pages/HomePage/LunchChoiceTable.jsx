import { useEffect, useState, useCallback, useMemo } from "react";
import { format, addDays, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Trash2, ClipboardList, CalendarDays, Clock, Utensils, User } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { fetchLunchData } from "@/hooks/fetchLunchData";
import { useAuth } from "@/contexts/AuthContext";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const LunchChoiceTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lunchData, setLunchData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch lunch data
  const loadLunchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchLunchData(setLunchData);
    } catch (error) {
      console.error("Error loading lunch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLunchData();
  }, [loadLunchData]);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle week navigation
  const handlePreviousWeek = () => {
    setSelectedDate(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  // Handle removing a lunch choice
  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this selection?')) return;
    
    try {
      const response = await fetch(`${API_URL}/lunchChoice/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (result.status === "success") {
        await loadLunchData();
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error removing selection:", error);
    }
  };

  // Filter lunch data for the selected week
  // const weeklyChoices = useMemo(() => {
  //   if (!lunchData.length) return [];
    
  //   const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  //   const weekEnd = addDays(weekStart, 6);
    
  //   return lunchData.filter(choice => {
  //     try {
  //       const choiceDate = parseISO(choice.menudate);
  //       return choiceDate >= weekStart && choiceDate <= weekEnd;
  //     } catch (e) {
  //       return false;
  //     }
  //   });
  // }, [lunchData, selectedDate]);

  // Helper function to parse the date format from backend (e.g., "2-Aug-2025")
  const parseMenuDate = (dateStr) => {
    try {
      // Convert "2-Aug-2025" to "2025-08-02"
      const [day, month, year] = dateStr.split('-');
      const monthNames = {
        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
      };
      const monthNum = monthNames[month];
      const dayPadded = day.padStart(2, '0');
      return `${year}-${monthNum}-${dayPadded}`;
    } catch (e) {
      console.error('Error parsing date:', dateStr, e);
      return null;
    }
  };

  // Group choices by date for the calendar
  const calendarEvents = useMemo(() => {
    const eventsMap = new Map();
    
    lunchData.forEach(choice => {
      const parsedDate = parseMenuDate(choice.menudate);
      if (parsedDate) {
        if (!eventsMap.has(parsedDate)) {
          eventsMap.set(parsedDate, []);
        }
        eventsMap.get(parsedDate).push(choice);
      }
    });
    
    return eventsMap;
  }, [lunchData]);

  // Get choices for the selected date
  const selectedDateChoices = useMemo(() => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return calendarEvents.get(dateKey) || [];
  }, [selectedDate, calendarEvents]);

  // Export to Excel
  const exportToExcel = () => {
    // Group by date and user
    const dataByDate = {};
    const users = new Set();
    
    lunchData.forEach(choice => {
      if (!dataByDate[choice.menudate]) {
        dataByDate[choice.menudate] = {};
      }
      dataByDate[choice.menudate][choice.username] = choice.menuname;
      users.add(choice.username);
    });
    
    // Convert to Excel format
    const data = Object.entries(dataByDate).map(([date, choices]) => {
      const parsedDate = parseMenuDate(date);
      const formattedDate = parsedDate ? format(parseISO(parsedDate), 'PP') : date;
      const row = { Date: formattedDate };
      users.forEach(user => {
        row[user] = choices[user] || '-';
      });
      return row;
    });
    
    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lunch Choices');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `lunch-choices-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="container py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Meal Selection Analytics
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive overview of all meal selections and dining preferences across the organization
            </p>
          </div>
        </div>

        {/* Export Action */}
        <div className="flex justify-center">
          <Button 
            onClick={exportToExcel}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            disabled={isLoading || lunchData.length === 0}
          >
            <Download className="h-4 w-4" />
            Export Analytics Report
          </Button>
        </div>

        {/* Calendar Section */}
        <Card className="bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-emerald-100">
            <CardTitle className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-emerald-600" />
              Weekly Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <WeeklyCalendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              onPreviousWeek={handlePreviousWeek}
              onNextWeek={handleNextWeek}
              events={Object.entries(calendarEvents).map(([date, events]) => ({
                date,
                title: `${events.length} ${events.length === 1 ? 'selection' : 'selections'}`
              }))}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card className="bg-white/70 backdrop-blur-sm border border-emerald-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-emerald-100">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-blue-600" />
                Selections for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {selectedDateChoices.length} {selectedDateChoices.length === 1 ? 'Selection' : 'Selections'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Utensils className="h-10 w-10 text-slate-400" />
                </div>
                <p className="text-slate-500">Loading selections...</p>
              </div>
            ) : selectedDateChoices.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <Utensils className="h-10 w-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-600">No selections for this date</h3>
                  <p className="text-slate-500">
                    No meal selections have been made for {format(selectedDate, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-bold text-slate-700">#</TableHead>
                      <TableHead className="font-bold text-slate-700">Employee</TableHead>
                      <TableHead className="font-bold text-slate-700">Meal Choice</TableHead>
                      <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedDateChoices.map((choice, index) => (
                      <TableRow 
                        key={choice.id}
                        className="hover:bg-slate-50/50 transition-colors duration-200"
                        style={{ 
                          animation: `fade-in-up 0.5s ease-out ${index * 0.1}s both`
                        }}
                      >
                        <TableCell className="text-slate-500 font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-emerald-700">
                                {choice.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{choice.username}</div>
                              <div className="text-sm text-slate-500">{choice.useremail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800">
                              {choice.menuname}
                            </Badge>
                            {choice.userid === user?.id && (
                              <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                                Your selection
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {(user?.role === 'admin' || choice.userid === user?.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                              onClick={() => handleRemove(choice.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1.5" />
                              Remove
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-600 text-sm font-medium mb-1">Total Selections</p>
                  <p className="text-3xl font-bold text-emerald-800">{lunchData.length}</p>
                  <p className="text-sm text-emerald-600 mt-1">Across all dates</p>
                </div>
                <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <ClipboardList className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium mb-1">Selected Date</p>
                  <p className="text-3xl font-bold text-blue-800">{selectedDateChoices.length}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Selections for {format(selectedDate, 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Clock className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium mb-1">Your Selections</p>
                  <p className="text-3xl font-bold text-purple-800">
                    {lunchData.filter(c => c.userid === user?.id).length}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">Meals you&apos;ve selected</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <User className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LunchChoiceTable;
