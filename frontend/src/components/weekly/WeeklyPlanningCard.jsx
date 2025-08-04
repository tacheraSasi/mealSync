import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const WeeklyPlanningCard = () => {
  const [planningInfo, setPlanningInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlanningInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/weeklyMealPlan/info`);
        const result = await response.json();
        
        if (result.status === 'success') {
          setPlanningInfo(result.result);
        }
      } catch (error) {
        console.error('Error fetching planning info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanningInfo();
  }, []);

  const handleNavigateToPlanning = () => {
    navigate('/weekly-planning');
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!planningInfo) return null;

  return (
    <Card className={`mb-6 border-l-4 ${
      planningInfo.isFridayPlanningDay 
        ? 'border-l-emerald-500 bg-emerald-50' 
        : 'border-l-amber-500 bg-amber-50'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${
            planningInfo.isFridayPlanningDay 
              ? 'bg-emerald-100 text-emerald-600' 
              : 'bg-amber-100 text-amber-600'
          }`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Weekly Meal Planning
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline"
                className={planningInfo.isFridayPlanningDay 
                  ? 'border-emerald-200 text-emerald-800' 
                  : 'border-amber-200 text-amber-800'
                }
              >
                {planningInfo.currentDay}
              </Badge>
              {planningInfo.isFridayPlanningDay && (
                <Badge className="bg-emerald-100 text-emerald-800">
                  Planning Available
                </Badge>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-slate-600 mb-4">
          {planningInfo.planningMessage}
        </p>
        
        {planningInfo.isFridayPlanningDay && (
          <p className="text-sm text-emerald-700 mb-4">
            Plan your meals for the week of{' '}
            <span className="font-medium">
              {new Date(planningInfo.nextWeekStartDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>
              {planningInfo.isFridayPlanningDay 
                ? 'Available today only' 
                : 'Next planning day: Friday'
              }
            </span>
          </div>
          
          <Button
            onClick={handleNavigateToPlanning}
            variant={planningInfo.isFridayPlanningDay ? "default" : "outline"}
            className={planningInfo.isFridayPlanningDay 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : ""
            }
          >
            {planningInfo.isFridayPlanningDay ? (
              <>
                Plan Your Week
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                View Planning
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyPlanningCard;
