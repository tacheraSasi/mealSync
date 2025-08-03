import React from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WeeklyCalendar = ({
  selectedDate,
  onDateSelect,
  onPreviousWeek,
  onNextWeek,
  events = [],
  isLoading = false
}) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start week on Monday
  
  // Generate days of the week
  const days = [];
  for (let i = 0; i < 5; i++) { // Only weekdays
    const day = addDays(weekStart, i);
    days.push({
      date: day,
      formattedDate: format(day, 'd'),
      dayName: format(day, 'EEE'),
      isSelected: isSameDay(day, selectedDate),
      hasEvents: events.some(event => isSameDay(new Date(event.date), day))
    });
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {format(weekStart, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPreviousWeek}
              disabled={isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNextWeek}
              disabled={isLoading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-5 border-b">
          {days.map((day) => (
            <div
              key={day.date.toString()}
              className={`p-3 text-center cursor-pointer transition-colors ${
                day.isSelected
                  ? 'bg-emerald-50 text-emerald-600 font-medium'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => onDateSelect(day.date)}
            >
              <div className="text-sm text-slate-500 mb-1">{day.dayName}</div>
              <div className="relative mx-auto w-8 h-8 flex items-center justify-center rounded-full">
                {day.formattedDate}
                {day.hasEvents && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Events for selected day */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-md animate-pulse"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-slate-500">
                    {format(new Date(event.date), 'h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>No events scheduled for this day</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;
