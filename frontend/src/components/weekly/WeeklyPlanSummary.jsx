import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const WeeklyPlanSummary = ({ 
  weeklySelections, 
  mealTemplates, 
  weekDates, 
  existingPlan 
}) => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  
  // Get meal template name by ID
  const getMealName = (mealId) => {
    const meal = mealTemplates.find(m => m.id === mealId);
    return meal ? meal.name : 'Unknown Meal';
  };

  // Count selected meals
  const selectedCount = Object.values(weeklySelections).filter(selection => selection !== null).length;
  const hasExistingPlan = existingPlan && existingPlan.length > 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Week Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Meals Selected:</span>
            <Badge variant="outline" className="font-semibold">
              {selectedCount} / 5
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Status:</span>
            <Badge 
              variant={hasExistingPlan ? "default" : "outline"}
              className={hasExistingPlan ? "bg-emerald-100 text-emerald-800" : ""}
            >
              {hasExistingPlan ? 'Plan Submitted' : 'Draft'}
            </Badge>
          </div>

          {weekDates.monday && (
            <div className="text-xs text-slate-500 pt-2 border-t">
              Week of {format(weekDates.monday, 'MMM d')} - {format(weekDates.friday, 'MMM d, yyyy')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Daily Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Weekly Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {daysOfWeek.map(day => {
            const mealId = weeklySelections[day];
            const hasSelection = mealId !== null;
            const dayDate = weekDates[day];
            
            return (
              <div 
                key={day}
                className={`p-3 rounded-lg border transition-colors ${
                  hasSelection 
                    ? 'bg-emerald-50 border-emerald-200' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 capitalize">
                      {day}
                    </span>
                    {hasSelection ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  {dayDate && (
                    <span className="text-xs text-slate-500">
                      {format(dayDate, 'MMM d')}
                    </span>
                  )}
                </div>
                
                <div className="text-sm">
                  {hasSelection ? (
                    <span className="text-emerald-800 font-medium">
                      {getMealName(mealId)}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic">
                      No meal selected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Planning Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            Planning Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-slate-600">
                You can modify your selections until the end of Friday
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-slate-600">
                Select meals that provide balanced nutrition throughout the week
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
              <span className="text-slate-600">
                Consider variety across different meal categories
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium">{selectedCount}/5 days</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(selectedCount / 5) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-500 text-center mt-2">
              {selectedCount === 0 && "Start by selecting meals for your preferred days"}
              {selectedCount > 0 && selectedCount < 5 && `${5 - selectedCount} more day${5 - selectedCount === 1 ? '' : 's'} to complete`}
              {selectedCount === 5 && "🎉 Week planning complete!"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyPlanSummary;
