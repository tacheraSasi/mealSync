import React, { useEffect, useState, useCallback, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { fetchLunchData } from "@/hooks/fetchLunchData";
import { useAuth } from "@/contexts/AuthContext";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";

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
      const response = await fetch(`http://localhost:3001/lunchChoice/${id}`, {
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
  const weeklyChoices = useMemo(() => {
    if (!lunchData.length) return [];
    
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = addDays(weekStart, 6);
    
    return lunchData.filter(choice => {
      try {
        const choiceDate = parseISO(choice.menudate);
        return choiceDate >= weekStart && choiceDate <= weekEnd;
      } catch (e) {
        return false;
      }
    });
  }, [lunchData, selectedDate]);

  // Group choices by date for the calendar
  const calendarEvents = useMemo(() => {
    const eventsMap = new Map();
    
    lunchData.forEach(choice => {
      try {
        const date = format(parseISO(choice.menudate), 'yyyy-MM-dd');
        if (!eventsMap.has(date)) {
          eventsMap.set(date, []);
        }
        eventsMap.get(date).push(choice);
      } catch (e) {
        console.error('Error parsing date:', choice.menudate, e);
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
      const row = { Date: format(parseISO(date), 'PP') };
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
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meal Selections</h1>
          <p className="text-slate-500">View and manage meal selections</p>
        </div>
        <Button 
          onClick={exportToExcel}
          className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
          disabled={isLoading || lunchData.length === 0}
        >
          <Download className="h-4 w-4" />
          Export to Excel
        </Button>
      </div>
      
      {/* Weekly Calendar */}
      <div className="mb-8">
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
      </div>
      
      {/* Selections for the selected date */}
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-lg font-semibold">
            Selections for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center text-slate-500">
              Loading selections...
            </div>
          ) : selectedDateChoices.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              No selections for this day
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Meal Choice</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedDateChoices.map((choice, index) => (
                  <TableRow key={choice.id}>
                    <TableCell className="text-slate-500">{index + 1}</TableCell>
                    <TableCell>
                      <div className="font-medium">{choice.username}</div>
                      <div className="text-sm text-slate-500">{choice.useremail}</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {choice.menuname}
                      {choice.userid === user?.id && (
                        <Badge variant="outline" className="ml-2">
                          Your selection
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {(user?.role === 'admin' || choice.userid === user?.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
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
          )}
        </CardContent>
      </Card>
      
      {/* Summary Card */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Selections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lunchData.length}</div>
            <div className="text-sm text-slate-500 mt-1">
              Across all dates
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Selected Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {selectedDateChoices.length}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Selections for {format(selectedDate, 'MMM d, yyyy')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Your Selections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {lunchData.filter(c => c.userid === user?.id).length}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              Meals you've selected
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Meal Selections</h1>
        <p className="text-slate-500">View and manage meal selections</p>
      </div>
      <Button 
        onClick={exportToExcel}
        className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
        disabled={isLoading || lunchData.length === 0}
      >
        <Download className="h-4 w-4" />
        Export to Excel
      </Button>
    </div>
    
    {/* Weekly Calendar */}
    <div className="mb-8">
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
    </div>
    
    {/* Selections for the selected date */}
    <Card>
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-lg font-semibold">
          Selections for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center text-slate-500">
            Loading selections...
          </div>
        ) : selectedDateChoices.length === 0 ? (
          <div className="p-6 text-center text-slate-400">
            No selections for this day
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Meal Choice</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedDateChoices.map((choice, index) => (
                <TableRow key={choice.id}>
                  <TableCell className="text-slate-500">{index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{choice.username}</div>
                    <div className="text-sm text-slate-500">{choice.useremail}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {choice.menuname}
                    {choice.userid === user?.id && (
                      <Badge variant="outline" className="ml-2">
                        Your selection
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {(user?.role === 'admin' || choice.userid === user?.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
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
        )}
      </CardContent>
    </Card>
    
    {/* Summary Card */}
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            Total Selections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{lunchData.length}</div>
          <div className="text-sm text-slate-500 mt-1">
            Across all dates
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            Selected Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {selectedDateChoices.length}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Selections for {format(selectedDate, 'MMM d, yyyy')}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-slate-500">
            Your Selections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {lunchData.filter(c => c.userid === user?.id).length}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            Meals you've selected
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default LunchChoiceTable;
